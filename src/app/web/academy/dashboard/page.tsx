import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { BookOpen, GraduationCap, Award, PlayCircle, Clock, ChevronRight, Star, TrendingUp, Search, Zap, Shield, Cpu, ArrowRight } from "lucide-react"
import { StaticMoleculesBackground } from "@/components/ui/StaticMoleculesBackground"

export default async function AcademyDashboard() {
    const session = await getServerSession(authOptions)
    if (!session) redirect("/login")
    const userId = session.user.id

    const [enrollments, allCourses, categories] = await Promise.all([
        prisma.courseEnrollment.findMany({
            where: { userId },
            include: {
                course: {
                    include: {
                        _count: { select: { lessons: true } },
                        category: true
                    }
                }
            },
            orderBy: { updatedAt: 'desc' }
        }),
        prisma.course.findMany({
            where: { published: true },
            include: {
                _count: { select: { lessons: true } },
                category: true
            },
            take: 6
        }),
        prisma.academyCategory.findMany()
    ])

    const completedCourses = enrollments.filter(e => e.status === 'COMPLETED')
    const inProgressCourses = enrollments.filter(e => e.status === 'IN_PROGRESS')

    return (
        <div className="min-h-screen bg-[#F4F1EB] text-slate-900 selection:bg-[#E8341A]/10 relative overflow-hidden">
            <StaticMoleculesBackground />
            
            {/* Academy Navigation */}
            <nav className="fixed top-0 left-0 w-full z-50 bg-[#0F1923]/95 backdrop-blur-xl border-b border-white/5 px-8 py-5">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-10">
                        <Link href="/web/academy" className="text-2xl font-black tracking-tighter italic text-white uppercase group">
                            ACADEMIA<span className="text-[#E8341A] group-hover:animate-pulse">.</span>
                        </Link>
                        <div className="hidden md:flex gap-8">
                            <Link href="/web/academy/dashboard" className="text-[10px] font-black uppercase tracking-[0.3em] text-[#E8341A] border-b-2 border-[#E8341A] pb-1">Mi Panel</Link>
                            <Link href="/web/academy" className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50 hover:text-white transition-colors">Explorar</Link>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-right hidden sm:block">
                            <p className="text-[10px] font-black text-white uppercase tracking-tighter leading-none">{session.user.name}</p>
                            <p className="text-[8px] font-bold text-[#E8341A] uppercase tracking-widest mt-1">Estudiante Elite</p>
                        </div>
                        <div className="w-10 h-10 bg-[#E8341A] flex items-center justify-center text-white font-black italic">
                            {session.user.name?.[0] || 'U'}
                        </div>
                    </div>
                </div>
            </nav>

            <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto relative z-10">
                {/* Hero Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    <div className="bg-[#0F1923] p-10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <GraduationCap size={120} />
                        </div>
                        <p className="text-[10px] font-black text-[#E8341A] uppercase tracking-[0.4em] mb-4">Cursos Activos</p>
                        <h3 className="text-6xl font-black text-white italic tracking-tighter">{inProgressCourses.length}</h3>
                        <p className="text-white/30 text-[9px] font-bold uppercase tracking-widest mt-4">Sincronización de Conocimiento</p>
                    </div>
                    <div className="bg-white p-10 border border-slate-200 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Award size={120} className="text-[#E8341A]" />
                        </div>
                        <p className="text-[10px] font-black text-[#E8341A] uppercase tracking-[0.4em] mb-4">Certificaciones</p>
                        <h3 className="text-6xl font-black text-slate-900 italic tracking-tighter">{completedCourses.length}</h3>
                        <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest mt-4">Especialidades Maestras</p>
                    </div>
                    <div className="bg-white p-10 border border-slate-200 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity text-[#E8341A]">
                            <TrendingUp size={120} />
                        </div>
                        <p className="text-[10px] font-black text-[#E8341A] uppercase tracking-[0.4em] mb-4">Mastery Rank</p>
                        <h3 className="text-6xl font-black text-slate-900 italic tracking-tighter">LVL 04</h3>
                        <div className="mt-4 w-full h-1 bg-slate-100">
                            <div className="h-full bg-[#E8341A] w-3/4"></div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Left: Progress */}
                    <div className="lg:col-span-2 space-y-12">
                        <div className="flex items-end justify-between border-b border-slate-200 pb-6">
                            <div>
                                <h2 className="text-4xl font-black uppercase tracking-tighter italic">Continuar <span className="text-[#E8341A]">Aprendiendo</span></h2>
                                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Retoma tu formación donde la dejaste</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            {inProgressCourses.length > 0 ? inProgressCourses.map((en) => (
                                <Link 
                                    key={en.id} 
                                    href={`/web/academy/course/${en.course.slug}`}
                                    className="group bg-white p-8 border border-slate-200 hover:border-[#E8341A]/30 transition-all flex flex-col md:flex-row items-center gap-10 shadow-xl hover:shadow-2xl"
                                >
                                    <div className="w-full md:w-48 h-32 bg-[#0F1923] shrink-0 overflow-hidden relative">
                                        {en.course.imageUrl && <img src={en.course.imageUrl} className="w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-700" />}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <PlayCircle size={32} className="text-white opacity-40 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <span className="text-[9px] font-black text-[#E8341A] uppercase tracking-[0.4em]">{en.course.category.name}</span>
                                                <h4 className="text-xl font-black uppercase tracking-tighter italic">{en.course.title}</h4>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-[10px] font-black text-[#E8341A]">{en.progress}%</span>
                                                <p className="text-[8px] font-bold text-slate-300 uppercase">Completado</p>
                                            </div>
                                        </div>
                                        <div className="w-full h-1.5 bg-slate-50">
                                            <div className="h-full bg-[#E8341A] transition-all duration-1000" style={{ width: `${en.progress}%` }}></div>
                                        </div>
                                        <div className="flex items-center gap-4 text-[9px] font-black uppercase text-slate-400 tracking-widest">
                                            <span className="flex items-center gap-1.5"><BookOpen size={12} /> {en.course._count.lessons} Lecciones</span>
                                            <span className="flex items-center gap-1.5"><Clock size={12} /> 2.5h</span>
                                        </div>
                                    </div>
                                    <ChevronRight className="text-slate-200 group-hover:text-[#E8341A] group-hover:translate-x-2 transition-all hidden md:block" />
                                </Link>
                            )) : (
                                <div className="py-20 text-center border-2 border-dashed border-slate-200 opacity-30">
                                    <p className="text-[10px] font-black uppercase tracking-widest">No tienes cursos en progreso</p>
                                </div>
                            )}
                        </div>

                        {/* Available Courses */}
                        <div className="pt-20">
                            <div className="flex items-end justify-between border-b border-slate-200 pb-6 mb-12">
                                <h2 className="text-3xl font-black uppercase tracking-tighter italic">Nuevas <span className="text-[#E8341A]">Especialidades</span></h2>
                                <Link href="/web/academy" className="text-[10px] font-black text-[#E8341A] uppercase tracking-widest">Ver Catálogo Completo</Link>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {allCourses.filter(c => !enrollments.find(e => e.courseId === c.id)).map((course) => (
                                    <Link 
                                        key={course.id} 
                                        href={`/web/academy/course/${course.slug}`}
                                        className="group bg-white p-6 border border-slate-200 hover:border-[#E8341A]/20 transition-all shadow-lg hover:shadow-2xl"
                                    >
                                        <div className="h-40 bg-[#0F1923] mb-6 overflow-hidden relative">
                                            {course.imageUrl && <img src={course.imageUrl} className="w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-700" />}
                                            <div className="absolute top-4 left-4 bg-[#E8341A] text-white text-[8px] font-black uppercase px-3 py-1.5 italic">Nuevo Módulo</div>
                                        </div>
                                        <span className="text-[9px] font-black text-[#E8341A] uppercase tracking-[0.4em]">{course.category.name}</span>
                                        <h4 className="text-lg font-black uppercase tracking-tighter italic mb-4">{course.title}</h4>
                                        <div className="flex justify-between items-center text-[9px] font-black uppercase text-slate-300 tracking-widest pt-4 border-t border-slate-50">
                                            <span>{course._count.lessons} Lecciones</span>
                                            <span className="text-slate-900 group-hover:text-[#E8341A] transition-colors">Empezar <ArrowRight size={12} className="inline ml-1" /></span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Achievements & Certs */}
                    <div className="space-y-12">
                        {/* SKILLS RADAR / BADGES (New Recommendation) */}
                        <div className="bg-[#0F1923] p-10 text-white relative overflow-hidden border-b-4 border-[#E8341A]">
                            <div className="absolute top-[-20%] left-[-20%] w-64 h-64 bg-[#E8341A]/5 blur-3xl rounded-full"></div>
                            <h3 className="text-xl font-black uppercase tracking-tighter italic mb-8 flex items-center gap-3">
                                <Award size={20} className="text-[#E8341A]" /> Tus Especialidades
                            </h3>
                            <div className="grid grid-cols-3 gap-4">
                                {categories.slice(0, 6).map((cat, i) => {
                                    const isMastered = completedCourses.some(e => e.course.categoryId === cat.id)
                                    return (
                                        <div key={cat.id} className={`aspect-square flex flex-col items-center justify-center p-4 border transition-all ${isMastered ? 'bg-[#E8341A]/10 border-[#E8341A] shadow-[0_0_20px_rgba(232,52,26,0.2)]' : 'bg-white/5 border-white/5 opacity-20 grayscale'}`}>
                                            <div className="w-10 h-10 mb-2 flex items-center justify-center">
                                                {i % 3 === 0 ? <Zap size={24} /> : i % 3 === 1 ? <Shield size={24} /> : <Cpu size={24} />}
                                            </div>
                                            <span className="text-[6px] font-black uppercase tracking-widest text-center leading-tight">{cat.name}</span>
                                        </div>
                                    )
                                })}
                            </div>
                            <p className="text-[7px] font-black text-white/30 uppercase tracking-[0.4em] mt-8 text-center">Completa cursos para desbloquear medallas</p>
                        </div>

                        <div className="bg-[#0F1923] p-10 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Award size={100} />
                            </div>
                            <h3 className="text-xl font-black uppercase tracking-tighter italic mb-8">Certificados Obtenidos</h3>
                            <div className="space-y-6">
                                {completedCourses.length > 0 ? completedCourses.map(en => (
                                    <div key={en.id} className="flex items-center gap-4 p-4 bg-white/5 border border-white/5 group hover:border-[#E8341A]/50 transition-all">
                                        <div className="w-12 h-12 bg-[#E8341A] flex items-center justify-center text-white shrink-0 shadow-lg shadow-[#E8341A]/20">
                                            <Award size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <h5 className="text-[10px] font-black uppercase tracking-tighter leading-tight">{en.course.title}</h5>
                                            <p className="text-[8px] text-white/40 uppercase tracking-widest mt-1">Completado: {new Date(en.completedAt || Date.now()).toLocaleDateString()}</p>
                                        </div>
                                        <Link href={`/web/academy/certificate/${en.id}`} className="text-[#E8341A] opacity-0 group-hover:opacity-100 transition-opacity">
                                            <ChevronRight size={16} />
                                        </Link>
                                    </div>
                                )) : (
                                    <div className="py-10 text-center border border-white/5 opacity-20">
                                        <p className="text-[9px] font-black uppercase tracking-widest">Aún no has completado especialidades</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-white p-10 border border-slate-200">
                            <h3 className="text-xl font-black uppercase tracking-tighter italic mb-8">Categorías</h3>
                            <div className="space-y-4">
                                {categories.map(cat => (
                                    <Link key={cat.id} href={`/web/academy#cat-${cat.slug}`} className="flex justify-between items-center p-4 hover:bg-[#E8341A]/5 transition-all group">
                                        <span className="text-[10px] font-black uppercase tracking-widest group-hover:text-[#E8341A]">{cat.name}</span>
                                        <ChevronRight size={14} className="text-slate-200 group-hover:text-[#E8341A] transition-all" />
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-[#E8341A] to-[#C0280F] p-10 text-white shadow-2xl relative overflow-hidden">
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                            <h3 className="text-xl font-black uppercase tracking-tighter italic mb-4">¿Necesitas Ayuda?</h3>
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 leading-loose mb-8">Nuestros tutores IA y expertos están disponibles 24/7 para resolver tus dudas técnicas.</p>
                            <button className="w-full bg-white text-[#E8341A] py-4 text-[9px] font-black uppercase tracking-widest hover:bg-[#0F1923] hover:text-white transition-all">Soporte Académico</button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

