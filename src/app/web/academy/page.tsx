import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { BookOpen, PlayCircle, Clock, ChevronRight, GraduationCap, ArrowRight, LayoutDashboard, Sparkles } from "lucide-react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export default async function AcademyPage() {
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id

    const [categories, userEnrollments] = await Promise.all([
        prisma.academyCategory.findMany({
            include: {
                courses: {
                    where: { published: true },
                    include: {
                        _count: { select: { lessons: true } }
                    }
                }
            }
        }),
        userId ? prisma.courseEnrollment.findMany({
            where: { userId },
            include: {
                course: {
                    include: { category: true }
                }
            },
            take: 3,
            orderBy: { updatedAt: 'desc' }
        }) : []
    ])

    return (
        <div className="min-h-screen bg-[#F4F1EB] text-[#0F1923] selection:bg-[#E8341A]/10">
            {/* High-End Hero Section */}
            <div className="bg-[#0F1923] py-40 relative overflow-hidden">
                {/* Dynamic Background */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#E8341A 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[100%] bg-[#E8341A]/5 blur-[120px] rounded-full animate-pulse"></div>
                
                <div className="max-w-7xl mx-auto px-8 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-20">
                        <div className="max-w-3xl text-center lg:text-left">
                            <div className="inline-flex items-center gap-4 px-5 py-2 bg-white/5 border border-white/10 mb-10 backdrop-blur-md">
                                <Sparkles size={16} className="text-[#E8341A]" />
                                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white">Ecosistema de Formación Élite</span>
                            </div>
                            <h1 className="text-7xl md:text-9xl font-black text-white uppercase tracking-tighter leading-[0.85] mb-10 italic">
                                ACADEMIA <span className="text-[#E8341A]">ATOMIC.</span>
                            </h1>
                            <p className="text-white/40 text-sm md:text-xl max-w-2xl uppercase tracking-widest leading-relaxed mb-12 italic">
                                Sincroniza tus habilidades con la infraestructura tecnológica de mayor impacto en la región.
                            </p>
                            
                            <div className="flex flex-wrap justify-center lg:justify-start gap-6">
                                <Link href="#categorias" className="px-10 py-5 bg-[#E8341A] text-white text-[11px] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-[#0F1923] transition-all shadow-[0_20px_50px_-10px_rgba(232,52,26,0.5)]">Explorar Catálogo</Link>
                                {session && (
                                    <Link href="/web/academy/dashboard" className="px-10 py-5 border-2 border-white/20 text-white text-[11px] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-[#0F1923] transition-all flex items-center gap-3">
                                        Mi Dashboard <LayoutDashboard size={18} />
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Quick Stats / Achievements */}
                        <div className="hidden xl:flex flex-col gap-6">
                            <div className="p-8 bg-white/5 border border-white/10 backdrop-blur-3xl w-72">
                                <h4 className="text-4xl font-black text-[#E8341A] italic">24/7</h4>
                                <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mt-2">Soporte Técnico Especializado</p>
                            </div>
                            <div className="p-8 bg-white/5 border border-white/10 backdrop-blur-3xl w-72">
                                <h4 className="text-4xl font-black text-white italic">100%</h4>
                                <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mt-2">Certificación Oficial Atomic</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* In Progress Section (If Enrolled) */}
            {userEnrollments.length > 0 && (
                <div className="bg-white border-b border-slate-200 relative z-20 shadow-2xl">
                    <div className="max-w-7xl mx-auto px-8 py-12">
                        <div className="flex items-center gap-6 mb-10 border-l-4 border-[#E8341A] pl-6">
                            <h3 className="text-xl font-black uppercase tracking-tighter italic">Continuar Formación</h3>
                            <Link href="/web/academy/dashboard" className="text-[9px] font-black uppercase tracking-widest text-[#E8341A] hover:underline flex items-center gap-2">Ver todos <ArrowRight size={12} /></Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {userEnrollments.map((en) => (
                                <Link 
                                    key={en.id} 
                                    href={`/web/academy/course/${en.course.slug}`}
                                    className="group bg-[#F4F1EB]/50 p-6 border border-slate-100 hover:border-[#E8341A]/30 transition-all flex items-center gap-6"
                                >
                                    <div className="w-16 h-16 bg-[#0F1923] shrink-0 flex items-center justify-center text-white relative overflow-hidden">
                                        {en.course.imageUrl && <img src={en.course.imageUrl} className="absolute inset-0 w-full h-full object-cover opacity-30" />}
                                        <PlayCircle size={20} className="relative z-10" />
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <h4 className="text-xs font-black uppercase tracking-tight truncate">{en.course.title}</h4>
                                        <div className="mt-2 w-full h-1 bg-slate-200">
                                            <div className="h-full bg-[#E8341A]" style={{ width: `${en.progress}%` }}></div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <div id="categorias" className="max-w-7xl mx-auto px-8 py-32">
                {categories.length > 0 ? categories.map((cat) => (
                    <div key={cat.id} className="mb-40 last:mb-0" id={`cat-${cat.slug}`}>
                        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 border-b-2 border-[#0F1923]/10 pb-10">
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 text-[#E8341A] text-[10px] font-black uppercase tracking-[0.5em]">
                                    <div className="w-8 h-px bg-current"></div>
                                    Área de Especialización
                                </div>
                                <h2 className="text-5xl font-black text-[#0F1923] uppercase tracking-tighter italic leading-none">{cat.name}</h2>
                            </div>
                            <div className="bg-white px-6 py-3 border border-slate-200 shadow-xl">
                                <span className="text-[10px] font-black text-[#0F1923]/40 tracking-[0.3em] uppercase">{cat.courses.length} Módulos Disponibles</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                            {cat.courses.map((course) => (
                                <Link 
                                    key={course.id} 
                                    href={`/web/academy/course/${course.slug}`}
                                    className="group bg-white border border-slate-100 hover:border-[#E8341A]/20 transition-all shadow-[0_20px_60px_-20px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_100px_-20px_rgba(232,52,26,0.15)] flex flex-col h-full overflow-hidden relative"
                                >
                                    <div className="h-64 bg-[#0F1923] relative overflow-hidden">
                                        {course.imageUrl ? (
                                            <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-1000" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center opacity-10">
                                                <BookOpen size={100} className="text-white" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0F1923] via-transparent to-transparent"></div>
                                        <div className="absolute bottom-8 left-8">
                                            <div className="bg-[#E8341A] text-white text-[8px] font-black uppercase px-4 py-2 mb-4 inline-block italic shadow-xl">Fase Profesional</div>
                                            <h3 className="text-white text-2xl font-black uppercase tracking-tighter leading-none italic">{course.title}</h3>
                                        </div>
                                    </div>
                                    
                                    <div className="p-10 flex-1 flex flex-col">
                                        <p className="text-slate-500 text-xs leading-relaxed mb-10 line-clamp-3 font-medium uppercase tracking-wider">
                                            {course.description || "InÃ­ciate en los fundamentos tÃ©cnicos y operativos de esta categorÃ­a con nuestra metodologÃ­a Atomic de alto rendimiento."}
                                        </p>
                                        
                                        <div className="mt-auto pt-8 border-t border-slate-50 flex items-center justify-between">
                                            <div className="flex items-center gap-6 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                                <span className="flex items-center gap-2"><PlayCircle size={14} className="text-[#E8341A]" /> {course._count.lessons} Lecciones</span>
                                                <span className="flex items-center gap-2"><Clock size={14} /> 2.5h</span>
                                            </div>
                                            <div className="w-10 h-10 bg-slate-50 flex items-center justify-center group-hover:bg-[#E8341A] group-hover:text-white transition-all">
                                                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )) : (
                    <div className="py-48 text-center border-2 border-dashed border-[#0F1923]/10">
                        <GraduationCap size={64} className="mx-auto text-[#0F1923]/10 mb-8" />
                        <h3 className="text-2xl font-black uppercase text-[#0F1923]/30 tracking-[0.3em] italic">Contenido Educativo en Sincronización</h3>
                        <p className="text-[11px] font-bold text-[#0F1923]/20 uppercase tracking-[0.4em] mt-4 max-w-lg mx-auto leading-relaxed">Estamos preparando los núcleos de datos para tu formación técnica superior.</p>
                    </div>
                )}
            </div>

            {/* Premium Footer */}
            <footer className="bg-[#0F1923] py-20 px-8 border-t border-white/5">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="text-center md:text-left">
                        <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter">ATOMIC <span className="text-[#E8341A]">ACADEMY.</span></h4>
                        <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.5em] mt-2 italic">Infraestructura de Aprendizaje Profesional</p>
                    </div>
                    <div className="flex gap-12 text-[10px] font-black uppercase tracking-widest text-white/50">
                        <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
                        <Link href="/web/products" className="hover:text-white transition-colors">Productos</Link>
                        <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard ERP</Link>
                    </div>
                </div>
            </footer>
        </div>
    )
}

