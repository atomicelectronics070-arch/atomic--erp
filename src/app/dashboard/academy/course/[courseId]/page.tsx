import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { notFound } from "next/navigation"
import Link from "next/link"
import CourseManagerClient from "./CourseManagerClient"
import { ChevronLeft, GraduationCap } from "lucide-react"

interface Props {
    params: Promise<{ courseId: string }>
}

export default async function CourseManagerPage({ params }: Props) {
    const { courseId } = await params
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "MANAGEMENT")) {
        redirect("/dashboard")
    }

    const course = await prisma.course.findUnique({
        where: { id: courseId },
        include: {
            category: true,
            lessons: { orderBy: { order: "asc" } }
        }
    })

    if (!course) notFound()

    const categories = await prisma.academyCategory.findMany({ orderBy: { name: "asc" } })

    return (
        <div className="space-y-12 pb-32 relative">
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[10%] right-[-10%] w-[40%] h-[40%] bg-[#E8341A]/5 blur-[120px] animate-pulse" />
            </div>

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-10 relative z-10">
                <div>
                    <Link
                        href="/dashboard/academy"
                        className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-white/30 hover:text-[#E8341A] transition-colors italic mb-4"
                    >
                        <ChevronLeft size={12} /> Volver a Academia
                    </Link>
                    <div className="flex items-center gap-3 text-[#E8341A] mb-3">
                        <GraduationCap size={18} />
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] italic">Gestión de Curso</span>
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">
                        {course.title}
                    </h1>
                    <p className="text-xs text-white/30 font-medium mt-2 italic">
                        Categoría: {course.category.name} · {course.lessons.length} lecciones
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        href={`/academy/${course.slug}`}
                        target="_blank"
                        className="flex items-center gap-2 px-6 py-3 border border-white/10 text-white/50 hover:text-white hover:border-white/30 text-[10px] font-black uppercase tracking-widest italic transition-all"
                    >
                        Ver Público ↗
                    </Link>
                </div>
            </div>

            <CourseManagerClient
                course={JSON.parse(JSON.stringify(course))}
                categories={JSON.parse(JSON.stringify(categories))}
            />
        </div>
    )
}
