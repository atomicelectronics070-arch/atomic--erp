import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { CheckCircle2, ChevronLeft, ChevronRight, PlayCircle, Lock } from "lucide-react"
import { revalidatePath } from "next/cache"

export default async function LessonPage({ params }: { params: { courseSlug: string, lessonSlug: string } }) {
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id

    if (!userId) {
        redirect("/login")
    }

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

    const currentLessonIndex = course.lessons.findIndex(l => l.slug === params.lessonSlug)
    const lesson = course.lessons[currentLessonIndex]

    if (!lesson) {
        return <div className="p-20 text-center">Lección no encontrada</div>
    }

    const prevLesson = currentLessonIndex > 0 ? course.lessons[currentLessonIndex - 1] : null
    const nextLesson = currentLessonIndex < course.lessons.length - 1 ? course.lessons[currentLessonIndex + 1] : null

    const isCompleted = lesson.progress && lesson.progress.length > 0 && lesson.progress[0].completed

    // Calculate overall progress to update course status if needed
    const totalLessons = course.lessons.length
    const completedCount = course.lessons.filter(l => l.progress?.length > 0 && l.progress[0].completed).length

    async function markCompleted() {
        'use server'
        if (!userId) return

        await prisma.lessonProgress.upsert({
            where: {
                userId_lessonId: { userId, lessonId: lesson.id }
            },
            update: { completed: true },
            create: { userId, lessonId: lesson.id, completed: true }
        })

        // Update overall course progress
        const newCompletedCount = isCompleted ? completedCount : completedCount + 1
        const newProgress = Math.round((newCompletedCount / totalLessons) * 100)
        
        await prisma.courseEnrollment.update({
            where: {
                userId_courseId: { userId, courseId: course.id }
            },
            data: { 
                progress: newProgress,
                status: newProgress >= 100 ? 'COMPLETED' : 'IN_PROGRESS',
                completedAt: newProgress >= 100 ? new Date() : null
            }
        })

        revalidatePath(`/web/academy/lesson/${params.courseSlug}/${params.lessonSlug}`)
        if (nextLesson) {
            redirect(`/web/academy/lesson/${params.courseSlug}/${nextLesson.slug}`)
        } else {
            redirect(`/web/academy/course/${params.courseSlug}`)
        }
    }

    return (
        <div className="min-h-screen bg-white/60 backdrop-blur-sm text-[#0F1923] flex flex-col md:flex-row">
            {/* Sidebar / Curriculum */}
            <aside className="w-full md:w-80 bg-[#0F1923] text-white flex flex-col h-auto md:h-screen sticky top-0 shrink-0">
                <div className="p-6 border-b border-white/10">
                    <Link href={`/web/academy/course/${course.slug}`} className="text-[10px] font-black uppercase tracking-widest text-[#E8341A] hover:text-white transition-colors mb-4 flex items-center gap-2">
                        <ChevronLeft size={14} /> Volver al Curso
                    </Link>
                    <h2 className="text-xl font-black uppercase tracking-tighter leading-tight mt-4 italic">{course.title}</h2>
                    
                    <div className="mt-6 space-y-2">
                        <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-white/50">
                            <span>Progreso</span>
                            <span className="text-[#E8341A]">{course.enrollments[0].progress}%</span>
                        </div>
                        <div className="w-full h-1 bg-white/10">
                            <div className="h-full bg-[#E8341A] transition-all" style={{ width: `${course.enrollments[0].progress}%` }}></div>
                        </div>
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                    {course.lessons.map((l, index) => {
                        const lCompleted = l.progress && l.progress.length > 0 && l.progress[0].completed
                        const isActive = l.id === lesson.id
                        
                        return (
                            <Link 
                                href={`/web/academy/lesson/${course.slug}/${l.slug}`} 
                                key={l.id}
                                className={`flex items-start gap-4 p-5 border-b border-white/5 transition-colors ${isActive ? 'bg-white/5' : 'hover:bg-white/5'}`}
                            >
                                <div className={`w-5 h-5 mt-0.5 shrink-0 flex items-center justify-center rounded-none ${lCompleted ? 'text-green-500' : 'text-white/20'}`}>
                                    {lCompleted ? <CheckCircle2 size={16} /> : <div className="w-1.5 h-1.5 bg-current rounded-full"></div>}
                                </div>
                                <div>
                                    <span className="text-[8px] font-black text-[#E8341A] uppercase tracking-widest block mb-1">Lección {index + 1}</span>
                                    <h4 className={`text-xs font-bold leading-relaxed ${isActive ? 'text-white' : 'text-white/60'}`}>{l.title}</h4>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto">
                {/* Video Area (if applicable) */}
                {lesson.videoUrl ? (
                    <div className="w-full bg-black aspect-video flex items-center justify-center relative">
                        {/* Placeholder for actual video player. For now, an iframe or simple message */}
                        <div className="absolute inset-0 bg-[#0F1923] flex flex-col items-center justify-center">
                            <PlayCircle size={64} className="text-[#E8341A] mb-4 opacity-50" />
                            <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Reproductor de Video (URL: {lesson.videoUrl})</p>
                        </div>
                    </div>
                ) : (
                    <div className="w-full bg-[#0F1923] h-48 md:h-64 flex items-center justify-center border-b-4 border-[#E8341A]">
                        <div className="text-center px-6">
                            <span className="text-[10px] font-black text-[#E8341A] uppercase tracking-[0.4em] mb-4 block">Módulo Teórico / Práctico</span>
                            <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter italic">{lesson.title}</h1>
                        </div>
                    </div>
                )}

                {/* Content Area */}
                <div className="max-w-3xl mx-auto px-6 py-16">
                    <div className="prose prose-neutral prose-lg max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-a:text-[#E8341A]">
                        {lesson.content ? (
                            <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
                        ) : (
                            <div className="text-center py-20 border-2 border-dashed border-[#0F1923]/10">
                                <p className="text-[#0F1923]/30 text-sm font-black uppercase tracking-widest">El contenido detallado de esta lección será publicado pronto.</p>
                            </div>
                        )}
                    </div>

                    {/* Completion Action */}
                    <div className="mt-20 pt-10 border-t border-[#0F1923]/10 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="flex gap-4 w-full sm:w-auto">
                            {prevLesson && (
                                <Link 
                                    href={`/web/academy/lesson/${course.slug}/${prevLesson.slug}`}
                                    className="px-6 py-4 border border-[#0F1923]/20 text-[10px] font-black uppercase tracking-widest hover:bg-[#0F1923]/5 transition-colors flex items-center gap-2"
                                >
                                    <ChevronLeft size={16} /> Anterior
                                </Link>
                            )}
                        </div>

                        <form action={markCompleted} className="w-full sm:w-auto">
                            <button 
                                type="submit"
                                className={`w-full sm:w-auto px-8 py-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 ${isCompleted ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-[#E8341A] text-white hover:bg-[#0F1923]'}`}
                            >
                                {isCompleted ? (
                                    <>Completado <CheckCircle2 size={16} /></>
                                ) : (
                                    <>Marcar y Continuar <ChevronRight size={16} /></>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    )
}
