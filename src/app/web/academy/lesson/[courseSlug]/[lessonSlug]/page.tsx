import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { notFound, redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import LessonPlayer from "./LessonPlayer"
import { sendWhatsAppMessage } from "@/lib/whatsapp/service"

export default async function LessonPage({ params }: { params: { courseSlug: string, lessonSlug: string } }) {
    const session = await getServerSession(authOptions)
    if (!session) redirect("/login")
    const userId = session.user.id

    const course = await prisma.course.findUnique({
        where: { slug: params.courseSlug },
        include: {
            category: true,
            enrollments: { where: { userId } },
            lessons: {
                orderBy: { order: 'asc' },
                include: {
                    progress: { where: { userId } }
                }
            }
        }
    })

    if (!course || course.enrollments.length === 0) {
        redirect(`/web/academy/course/${params.courseSlug}`)
    }

    const lesson = course.lessons.find(l => l.slug === params.lessonSlug)
    if (!lesson) notFound()

    const lessonIndex = course.lessons.findIndex(l => l.id === lesson.id)
    const prevLesson = lessonIndex > 0 ? course.lessons[lessonIndex - 1] : null

    const isCompleted = lesson.progress && lesson.progress.length > 0 && lesson.progress[0].completed

    async function markCompleted() {
        'use server'
        await prisma.lessonProgress.upsert({
            where: {
                userId_lessonId: { userId, lessonId: lesson.id }
            },
            update: { completed: true },
            create: { userId, lessonId: lesson.id, completed: true }
        })

        // Update overall course progress
        const completedCount = course.lessons.filter(l => 
            (l.id === lesson.id) || (l.progress && l.progress.length > 0 && l.progress[0].completed)
        ).length
        const totalCount = course.lessons.length
        const newProgress = Math.round((completedCount / totalCount) * 100)

        await prisma.courseEnrollment.update({
            where: { id: course.enrollments[0].id },
            data: { 
                progress: newProgress,
                status: newProgress === 100 ? 'COMPLETED' : 'IN_PROGRESS',
                completedAt: newProgress === 100 ? new Date() : null
            }
        })

        // NEW: WhatsApp Notification for Completion
        if (newProgress === 100) {
            try {
                const fullUser = await prisma.user.findUnique({ where: { id: userId } })
                if (fullUser?.phone) {
                    await sendWhatsAppMessage(
                        fullUser.phone,
                        `🚀 ¡Felicidades Elemento ${fullUser.name}! Has completado el curso "${course.title}". Tu certificación ha sido generada en el núcleo de Atomic Academy.`
                    )
                }
            } catch (e) { console.error("Error sending WhatsApp completion message", e) }
        }

        revalidatePath(`/web/academy/lesson/${params.courseSlug}/${params.lessonSlug}`)
        revalidatePath(`/web/academy/course/${params.courseSlug}`)
    }

    return (
        <LessonPlayer 
            course={course} 
            lesson={lesson} 
            prevLesson={prevLesson} 
            isCompleted={isCompleted} 
            markCompletedAction={markCompleted} 
        />
    )
}
