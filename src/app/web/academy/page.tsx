import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { BookOpen, PlayCircle, Clock, ChevronRight, GraduationCap } from "lucide-react"

export default async function AcademyPage() {
    const categories = await prisma.academyCategory.findMany({
        include: {
            courses: {
                where: { published: true },
                include: {
                    _count: {
                        select: { lessons: true }
                    }
                }
            }
        }
    })

    return (
        <div className="min-h-screen bg-transparent/60 backdrop-blur-[2px] text-[#0F1923]">
            {/* Hero Section */}
            <div className="bg-[#0F1923] py-32 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#E8341A 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
                        <GraduationCap size={16} className="text-[#E8341A]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Centro de CapacitaciÃ³n TÃ©cnica</span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none mb-8 italic">
                        ACADEMIA <span className="text-[#E8341A]">ATOMIC.</span>
                    </h1>
                    <p className="text-white/40 text-sm md:text-lg max-w-2xl mx-auto uppercase tracking-widest leading-relaxed">
                        Domina la infraestructura tecnolÃ³gica de vanguardia con nuestros cursos especializados por categorÃ­a.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-24">
                {categories.length > 0 ? categories.map((cat) => (
                    <div key={cat.id} className="mb-32 last:mb-0">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 border-b border-[#0F1923]/10 pb-8">
                            <div className="space-y-2">
                                <p className="text-[#E8341A] text-[10px] font-black uppercase tracking-[0.3em]">CategorÃ­a de EnseÃ±anza</p>
                                <h2 className="text-4xl font-black text-[#0F1923] uppercase tracking-tighter italic">{cat.name}</h2>
                            </div>
                            <span className="text-[10px] font-black text-[#0F1923]/30 tracking-widest">{cat.courses.length} CURSOS DISPONIBLES</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {cat.courses.map((course) => (
                                <Link 
                                    key={course.id} 
                                    href={`/web/academy/course/${course.slug}`}
                                    className="group bg-white border border-[#0F1923]/5 hover:border-[#E8341A]/30 transition-all shadow-xl shadow-[#0F1923]/5 hover:shadow-[#E8341A]/10 flex flex-col h-full overflow-hidden"
                                >
                                    <div className="h-56 bg-[#0F1923] relative overflow-hidden">
                                        {course.imageUrl ? (
                                            <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-1000" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center opacity-10">
                                                <BookOpen size={80} className="text-white" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0F1923] to-transparent"></div>
                                        <div className="absolute bottom-6 left-6">
                                            <div className="bg-[#E8341A] text-white text-[8px] font-black uppercase px-3 py-1.5 mb-2 inline-block">Nivel Pro</div>
                                            <h3 className="text-white text-xl font-black uppercase tracking-tighter leading-none">{course.title}</h3>
                                        </div>
                                    </div>
                                    
                                    <div className="p-8 flex-1 flex flex-col">
                                        <p className="text-[#0F1923]/50 text-xs leading-relaxed mb-8 line-clamp-3 font-medium">
                                            {course.description || "InÃ­ciate en los fundamentos tÃ©cnicos y operativos de esta categorÃ­a con nuestra metodologÃ­a Atomic de alto rendimiento."}
                                        </p>
                                        
                                        <div className="mt-auto pt-6 border-t border-[#0F1923]/5 flex items-center justify-between">
                                            <div className="flex items-center gap-4 text-[9px] font-black text-[#0F1923]/40 uppercase tracking-widest">
                                                <span className="flex items-center gap-1.5"><PlayCircle size={12} className="text-[#E8341A]" /> {course._count.lessons} Lecciones</span>
                                                <span className="flex items-center gap-1.5"><Clock size={12} /> 2.5h aprox.</span>
                                            </div>
                                            <ChevronRight size={16} className="text-[#0F1923]/20 group-hover:text-[#E8341A] group-hover:translate-x-1 transition-all" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )) : (
                    <div className="py-32 text-center border-2 border-dashed border-[#0F1923]/10">
                        <GraduationCap size={48} className="mx-auto text-[#0F1923]/10 mb-6" />
                        <h3 className="text-xl font-black uppercase text-[#0F1923]/30 tracking-widest">PrÃ³ximamente: Contenido Educativo Atomic</h3>
                        <p className="text-[10px] font-bold text-[#0F1923]/20 uppercase tracking-[0.3em] mt-2">Estamos preparando los mejores materiales para tu formaciÃ³n.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

