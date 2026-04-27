import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { GraduationCap, Plus, BookOpen, Clock, Settings, Users, Layers, PlayCircle, Edit } from "lucide-react"

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

    return (
        <div className="min-h-screen bg-[#0F1923] text-white p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#E8341A]/10 border border-[#E8341A]/20 mb-4">
                            <GraduationCap size={14} className="text-[#E8341A]" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#E8341A]">Gestión Académica</span>
                        </div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter italic">Panel de <span className="text-[#E8341A]">Academia</span></h1>
                        <p className="text-white/40 text-xs font-bold uppercase tracking-widest mt-2">Administración de cursos, módulos y currícula técnica.</p>
                    </div>

                    <div className="flex gap-4">
                        <Link href="/dashboard/academy/categories/new" className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-2">
                            <Layers size={14} /> Nueva Categoría
                        </Link>
                        <Link href="/dashboard/academy/course/new" className="px-6 py-3 bg-[#E8341A] hover:bg-white hover:text-[#E8341A] text-white text-[10px] font-black uppercase tracking-widest transition-colors shadow-[0_0_20px_rgba(232,52,26,0.3)] flex items-center gap-2">
                            <Plus size={14} /> Crear Curso
                        </Link>
                    </div>
                </div>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <div className="bg-white/5 border border-white/10 p-6 flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/5 flex items-center justify-center">
                            <Layers size={20} className="text-[#E8341A]" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Categorías</p>
                            <p className="text-2xl font-black font-mono">{categories.length}</p>
                        </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-6 flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/5 flex items-center justify-center">
                            <BookOpen size={20} className="text-white" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Cursos Totales</p>
                            <p className="text-2xl font-black font-mono">
                                {categories.reduce((acc, cat) => acc + cat.courses.length, 0)}
                            </p>
                        </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-6 flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/5 flex items-center justify-center">
                            <PlayCircle size={20} className="text-white" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Lecciones</p>
                            <p className="text-2xl font-black font-mono">
                                {categories.reduce((acc, cat) => acc + cat.courses.reduce((accC, c) => accC + c._count.lessons, 0), 0)}
                            </p>
                        </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-6 flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/5 flex items-center justify-center">
                            <Users size={20} className="text-green-500" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Inscripciones Totales</p>
                            <p className="text-2xl font-black font-mono text-green-500">
                                {categories.reduce((acc, cat) => acc + cat.courses.reduce((accC, c) => accC + c._count.enrollments, 0), 0)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Categories & Courses */}
                <div className="space-y-12">
                    {categories.map(cat => (
                        <div key={cat.id} className="border border-white/10 bg-white/[0.02] overflow-hidden">
                            <div className="p-6 border-b border-white/10 bg-white/5 flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl font-black uppercase tracking-widest text-[#E8341A]">{cat.name}</h2>
                                    <p className="text-xs text-white/50 mt-1">{cat.description}</p>
                                </div>
                                <button className="p-2 bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors">
                                    <Settings size={16} />
                                </button>
                            </div>

                            <div className="p-6">
                                {cat.courses.length > 0 ? (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {cat.courses.map(course => (
                                            <div key={course.id} className="bg-[#0F1923] border border-white/10 p-6 flex flex-col justify-between group">
                                                <div>
                                                    <div className="flex justify-between items-start mb-4">
                                                        <h3 className="text-lg font-black uppercase tracking-tighter leading-tight">{course.title}</h3>
                                                        <span className={`px-2 py-1 text-[8px] font-black uppercase tracking-widest border ${course.published ? 'border-green-500/50 text-green-500 bg-green-500/10' : 'border-yellow-500/50 text-yellow-500 bg-yellow-500/10'}`}>
                                                            {course.published ? 'Público' : 'Borrador'}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-white/40 line-clamp-2 mb-6">{course.description}</p>
                                                </div>

                                                <div className="border-t border-white/10 pt-4 flex items-center justify-between">
                                                    <div className="flex gap-4">
                                                        <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-white/40">
                                                            <BookOpen size={12} className="text-[#E8341A]" /> {course._count.lessons}
                                                        </span>
                                                        <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-white/40">
                                                            <Users size={12} className="text-blue-400" /> {course._count.enrollments}
                                                        </span>
                                                    </div>
                                                    <Link href={`/dashboard/academy/course/${course.id}`} className="text-[#E8341A] hover:text-white flex items-center gap-1 text-[9px] font-black uppercase tracking-widest transition-colors">
                                                        Gestionar <ChevronRight size={12} />
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 border border-dashed border-white/10">
                                        <p className="text-white/30 text-xs font-black uppercase tracking-widest">No hay cursos en esta categoría</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

function ChevronRight(props: any) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m9 18 6-6-6-6"/></svg>
}
