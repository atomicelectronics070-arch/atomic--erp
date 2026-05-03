import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { BookOpen, PlayCircle, Clock, CheckCircle2, ChevronRight, GraduationCap, Lock, Calendar } from "lucide-react"

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id

    const course = await prisma.course.findUnique({
        where: { slug },
        include: {
            category: true,
            lessons: {
                orderBy: { order: 'asc' },
                include: {
                    progress: userId ? { where: { userId } } : false
                }
            },
            enrollments: userId ? { where: { userId } } : false
        }
    })

    if (!course) {
        return (
            <div className="min-h-screen flex items-center justify-center text-center p-6 bg-[#0F1923] text-white">
                <div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter mb-4 text-white/30">Módulo no encontrado</h1>
                    <Link href="/web/academy" className="text-[#E8341A] font-black uppercase tracking-widest text-[10px] hover:underline">Volver a la Academia</Link>
                </div>
            </div>
        )
    }

    const isEnrolled = course.enrollments && course.enrollments.length > 0
    const enrollment = isEnrolled ? course.enrollments[0] : null
    
    // Calculate progress
    const totalLessons = course.lessons.length
    const completedLessons = course.lessons.filter(l => l.progress && l.progress.length > 0 && l.progress[0].completed).length
    const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

    return (
        <div className="min-h-screen bg-white/60 backdrop-blur-sm text-[#0F1923]">
            {/* Header Hero */}
            <div className="bg-[#0F1923] py-24 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    {course.imageUrl ? (
                        <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-r from-[#E8341A]/20 to-blue-900/20 mix-blend-overlay"></div>
                    )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F1923] via-[#0F1923]/90 to-transparent"></div>
                
                <div className="max-w-4xl mx-auto px-6 relative z-10 text-center mt-12">
                    <div className="inline-flex items-center gap-3 px-4 py-1.5 border border-white/10 bg-white/5 backdrop-blur-md mb-8">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#E8341A]">{course.category.name}</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none mb-6 italic">
                        {course.title}
                    </h1>
                    <p className="text-white/50 text-sm md:text-lg uppercase tracking-widest leading-relaxed max-w-2xl mx-auto">
                        {course.description}
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-16 -mt-12 relative z-20">
                {/* Status Bar */}
                <div className="bg-white border border-[#0F1923]/10 shadow-2xl p-8 mb-16 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-8 w-full md:w-auto">
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black uppercase tracking-widest text-[#0F1923]/40 mb-1">Duración</span>
                            <span className="flex items-center gap-2 font-mono font-black text-lg"><Clock size={16} className="text-[#E8341A]"/> ~2.5 Horas</span>
                        </div>
                        <div className="w-px h-10 bg-[#0F1923]/10 hidden md:block"></div>
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black uppercase tracking-widest text-[#0F1923]/40 mb-1">Lecciones</span>
                            <span className="flex items-center gap-2 font-mono font-black text-lg"><BookOpen size={16} className="text-[#E8341A]"/> {totalLessons}</span>
                        </div>
                    </div>

                    <div className="w-full md:w-auto flex-1 md:max-w-xs">
                        {isEnrolled ? (
                            <div className="space-y-3">
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[#0F1923]">Progreso</span>
                                    <span className="font-mono font-black text-[#E8341A]">{progressPercentage}%</span>
                                </div>
                                <div className="w-full h-2 bg-[#0F1923]/5 rounded-none overflow-hidden">
                                    <div className="h-full bg-[#E8341A] transition-all duration-1000" style={{ width: `${progressPercentage}%` }}></div>
                                </div>
                            </div>
                        ) : (
                            <form action={async () => {
                                'use server'
                                const { revalidatePath } = require('next/cache')
                                if (!userId) return; 
                                await prisma.courseEnrollment.create({
                                    data: { userId, courseId: course.id }
                                })
                                revalidatePath(`/web/academy/course/${course.slug}`)
                            }}>
                                <button type="submit" className="w-full bg-[#E8341A] text-white py-4 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#0F1923] transition-colors flex items-center justify-center gap-3">
                                    {userId ? 'Iniciar Especialidad' : 'Inicia Sesión para Estudiar'} <GraduationCap size={16} />
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* Lessons List */}
                <div className="space-y-12">
                    <div className="flex items-end justify-between border-b border-[#0F1923]/10 pb-4">
                        <h2 className="text-2xl font-black uppercase tracking-tighter italic">Plan de Estudio</h2>
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#0F1923]/30">Programa Intensivo</span>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {course.lessons.map((lesson, index) => {
                            const isCompleted = lesson.progress && lesson.progress.length > 0 && lesson.progress[0].completed
                            const canAccess = isEnrolled || index === 0 // First lesson is preview maybe, but let's restrict all to enrolled for now
                            
                            return (
                                <Link 
                                    href={canAccess ? `/web/academy/lesson/${course.slug}/${lesson.slug}` : '#'}
                                    key={lesson.id} 
                                    className={`group flex items-center gap-6 p-6 border transition-all ${canAccess ? 'bg-white border-[#0F1923]/5 hover:border-[#E8341A]/30 cursor-pointer shadow-sm hover:shadow-xl' : 'bg-white/60 backdrop-blur-sm border-[#0F1923]/5 opacity-60 cursor-not-allowed'}`}
                                >
                                    <div className={`w-12 h-12 flex items-center justify-center shrink-0 border ${isCompleted ? 'bg-green-50 border-green-200 text-green-600' : (canAccess ? 'bg-[#0F1923] border-[#0F1923] text-white' : 'bg-transparent border-[#0F1923]/20 text-[#0F1923]/20')}`}>
                                        {isCompleted ? <CheckCircle2 size={20} /> : <span className="font-mono font-black">{index + 1}</span>}
                                    </div>
                                    
                                    <div className="flex-1">
                                        <h3 className={`text-sm font-black uppercase tracking-wider mb-1 ${canAccess ? 'group-hover:text-[#E8341A] transition-colors' : ''}`}>{lesson.title}</h3>
                                        <div className="flex items-center gap-4 text-[9px] font-bold uppercase tracking-widest text-[#0F1923]/40">
                                            <span className="flex items-center gap-1.5"><PlayCircle size={12} /> Video / Lectura</span>
                                        </div>
                                    </div>

                                    <div>
                                        {!canAccess ? (
                                            <Lock size={16} className="text-[#0F1923]/20" />
                                        ) : (
                                            <ChevronRight size={16} className="text-[#0F1923]/20 group-hover:text-[#E8341A] group-hover:translate-x-2 transition-transform" />
                                        )}
                                    </div>
                                </Link>
                            )
                        })}

                        {course.lessons.length === 0 && (
                            <div className="py-20 text-center border-2 border-dashed border-[#0F1923]/10">
                                <Calendar size={32} className="mx-auto text-[#0F1923]/20 mb-4" />
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0F1923]/40">Las lecciones de este módulo se publicarán pronto.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
