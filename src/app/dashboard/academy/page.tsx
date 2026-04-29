import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { GraduationCap, Plus, BookOpen, Clock, Settings, Users, Layers, PlayCircle, Edit, ChevronRight } from "lucide-react"
import { CyberCard, NeonButton, GlassPanel } from "@/components/ui/CyberUI"

export default async function AcademyAdminPage() {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'MANAGEMENT')) {
        redirect("/dashboard")
    }

    const categories = await prisma.academyCategory.findMany({
        include: {
            courses: {
                include: {
                    _count: {
                        select: { lessons: true, enrollments: true }
                    }
                }
            }
        }
    })

    const stats = [
        { label: "Categorías", value: categories.length, icon: Layers, color: "text-[#E8341A]" },
        { label: "Cursos Totales", value: categories.reduce((acc, cat) => acc + cat.courses.length, 0), icon: BookOpen, color: "text-white" },
        { label: "Lecciones", value: categories.reduce((acc, cat) => acc + cat.courses.reduce((accC, c) => accC + c._count.lessons, 0), 0), icon: PlayCircle, color: "text-white" },
        { label: "Inscripciones", value: categories.reduce((acc, cat) => acc + cat.courses.reduce((accC, c) => accC + c._count.enrollments, 0), 0), icon: Users, color: "text-emerald-400" },
    ]

    return (
        <div className="space-y-16 pb-32 relative">
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[10%] right-[-10%] w-[40%] h-[40%] bg-[#E8341A]/5 blur-[120px] animate-pulse" />
            </div>

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 border-b border-white/5 pb-16 relative z-10">
                <div>
                    <div className="flex items-center space-x-4 mb-4 text-[#E8341A] neon-text">
                        <GraduationCap size={20} />
                        <span className="text-[10px] uppercase font-black tracking-[0.6em] italic">CENTRO DE CAPACITACIÓN // ATOMIC ACADEMY</span>
                    </div>
                    <h1 className="text-7xl font-black text-white tracking-tighter uppercase italic leading-none">
                        ACADE<span className="text-[#E8341A] neon-text">MIA</span>
                    </h1>
                </div>
                <div className="flex gap-4">
                    <Link href="/dashboard/academy/course/new">
                        <NeonButton variant="primary">CREAR CURSO</NeonButton>
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                {stats.map((s, i) => (
                    <CyberCard key={i} className="flex items-center gap-6 !p-6">
                        <div className="w-14 h-14 bg-white/5 flex items-center justify-center border border-white/5">
                            <s.icon size={24} className={s.color} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/30 italic">{s.label}</p>
                            <p className={`text-3xl font-black italic tracking-tighter ${s.color}`}>{s.value}</p>
                        </div>
                    </CyberCard>
                ))}
            </div>

            {/* Categories & Courses */}
            <div className="space-y-12 relative z-10">
                {categories.map(cat => (
                    <div key={cat.id} className="space-y-6">
                        <div className="flex items-center gap-4 border-l-4 border-[#E8341A] pl-6 py-2">
                            <h2 className="text-2xl font-black uppercase tracking-widest text-white italic">{cat.name}</h2>
                            <span className="text-[10px] font-black text-white/20 uppercase tracking-widest italic">/ {cat.courses.length} CURSOS</span>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {cat.courses.map(course => (
                                <CyberCard key={course.id} className="!p-8 flex flex-col justify-between group h-full min-h-[250px]">
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-xl font-black uppercase tracking-tighter leading-tight italic group-hover:text-[#E8341A] transition-colors">{course.title}</h3>
                                            <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest border ${course.published ? 'border-emerald-500/50 text-emerald-400 bg-emerald-400/5' : 'border-yellow-500/50 text-yellow-500 bg-yellow-500/5'}`}>
                                                {course.published ? 'PÚBLICO' : 'BORRADOR'}
                                            </span>
                                        </div>
                                        <p className="text-xs text-white/40 line-clamp-2 italic font-medium">{course.description}</p>
                                    </div>

                                    <div className="mt-10 pt-6 border-t border-white/5 flex items-center justify-between">
                                        <div className="flex gap-6">
                                            <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/30 italic">
                                                <BookOpen size={14} className="text-[#E8341A]" /> {course._count.lessons} <span className="opacity-40">MÓDULOS</span>
                                            </span>
                                            <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/30 italic">
                                                <Users size={14} className="text-blue-400" /> {course._count.enrollments} <span className="opacity-40">ALUMNOS</span>
                                            </span>
                                        </div>
                                        <Link href={`/dashboard/academy/course/${course.id}`}>
                                            <NeonButton variant="outline" className="!px-6 !py-3">GESTIONAR</NeonButton>
                                        </Link>
                                    </div>
                                </CyberCard>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
