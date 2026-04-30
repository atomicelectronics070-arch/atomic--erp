"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { PlayCircle, BookOpen, ChevronLeft, ChevronRight, Lock, CheckCircle, Clock, Users, GraduationCap, Zap } from "lucide-react"
import { motion } from "framer-motion"

interface Lesson {
    id: string
    title: string
    slug: string
    content: string
    videoUrl: string | null
    order: number
}

interface Course {
    id: string
    title: string
    slug: string
    description: string | null
    imageUrl: string | null
    published: boolean
    category: { name: string; slug: string }
    lessons: Lesson[]
    _count: { enrollments: number }
}

function getVideoThumbnail(videoUrl: string | null): string | null {
    if (!videoUrl) return null
    const ytMatch = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
    if (ytMatch) return `https://img.youtube.com/vi/${ytMatch[1]}/mqdefault.jpg`
    return null
}

function isVideoUrl(url: string | null): boolean {
    if (!url) return false
    return url.includes("youtube") || url.includes("youtu.be") ||
        url.includes("vimeo") || url.endsWith(".mp4") || url.endsWith(".webm")
}

export default function CoursePage() {
    const params = useParams()
    const slug = params.slug as string
    const [course, setCourse] = useState<Course | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch(`/api/public/academy/course/${slug}`)
            .then(r => r.json())
            .then(data => { setCourse(data.course); setLoading(false) })
            .catch(() => setLoading(false))
    }, [slug])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-6">
                    <div className="w-16 h-16 border border-[#E8341A]/20 animate-spin relative">
                        <div className="absolute inset-2 border-t border-[#E8341A]" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.6em] text-white/20 animate-pulse italic">
                        Cargando curso...
                    </p>
                </div>
            </div>
        )
    }

    if (!course) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
                <GraduationCap size={64} className="text-white/10" />
                <h2 className="text-2xl font-black uppercase italic text-white/30">Curso no encontrado</h2>
                <Link href="/academy" className="text-[#E8341A] font-black uppercase tracking-widest text-xs italic hover:underline flex items-center gap-2">
                    <ChevronLeft size={14} /> Volver a la Academia
                </Link>
            </div>
        )
    }

    const lessonsWithVideo = course.lessons.filter(l => isVideoUrl(l.videoUrl))
    const firstLesson = course.lessons[0]

    return (
        <div className="pb-32">
            {/* Breadcrumb */}
            <div className="border-b border-white/5 px-6 py-5">
                <div className="max-w-7xl mx-auto flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/30 italic">
                    <Link href="/academy" className="hover:text-[#E8341A] transition-colors flex items-center gap-1.5">
                        <ChevronLeft size={12} /> Academia
                    </Link>
                    <span className="text-white/10">/</span>
                    <span className="text-white/50">{course.category.name}</span>
                    <span className="text-white/10">/</span>
                    <span className="text-white">{course.title}</span>
                </div>
            </div>

            {/* Hero */}
            <section className="relative overflow-hidden">
                {/* BG image blurred */}
                {course.imageUrl && (
                    <div className="absolute inset-0 opacity-10">
                        <img src={course.imageUrl} alt="" className="w-full h-full object-cover blur-2xl scale-110" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-[#000103]" />

                <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7 }}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <span className="text-[9px] font-black uppercase tracking-[0.5em] text-[#E8341A] italic border border-[#E8341A]/30 px-4 py-1.5 bg-[#E8341A]/5">
                                    {course.category.name}
                                </span>
                                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400 italic border border-emerald-500/30 px-4 py-1.5 bg-emerald-500/5">
                                    GRATIS
                                </span>
                            </div>

                            <h1 className="text-5xl md:text-6xl font-black uppercase italic tracking-tighter text-white leading-none mb-6">
                                {course.title}
                            </h1>
                            {course.description && (
                                <p className="text-base text-white/50 leading-relaxed font-medium mb-10">
                                    {course.description}
                                </p>
                            )}

                            {/* Stats */}
                            <div className="flex flex-wrap gap-8 mb-10">
                                {[
                                    { label: "Lecciones", value: course.lessons.length, icon: BookOpen },
                                    { label: "Con Video", value: lessonsWithVideo.length, icon: PlayCircle },
                                    { label: "Estudiantes", value: course._count.enrollments, icon: Users },
                                ].map((s, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <s.icon size={16} className="text-[#E8341A]" />
                                        <div>
                                            <span className="text-xl font-black text-white italic tracking-tighter">{s.value}</span>
                                            <span className="text-[9px] font-black text-white/30 uppercase tracking-widest italic ml-2">{s.label}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {firstLesson ? (
                                <Link
                                    href={`/academy/${course.slug}/${firstLesson.id}`}
                                    className="inline-flex items-center gap-4 px-10 py-5 bg-[#E8341A] text-white font-black uppercase tracking-widest text-xs italic hover:shadow-[0_0_40px_rgba(232,52,26,0.5)] transition-all hover:-translate-y-0.5 active:translate-y-0"
                                >
                                    <PlayCircle size={18} />
                                    Comenzar Curso
                                </Link>
                            ) : (
                                <div className="inline-flex items-center gap-4 px-10 py-5 border border-white/10 text-white/30 font-black uppercase tracking-widest text-xs italic">
                                    <Lock size={18} />
                                    Próximamente
                                </div>
                            )}
                        </motion.div>

                        {/* Course thumbnail / preview */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="relative aspect-video border border-white/10 overflow-hidden bg-black group">
                                {course.imageUrl ? (
                                    <img
                                        src={course.imageUrl}
                                        alt={course.title}
                                        className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-slate-900 to-black flex items-center justify-center">
                                        <GraduationCap size={80} className="text-white/10" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                {firstLesson && (
                                    <Link
                                        href={`/academy/${course.slug}/${firstLesson.id}`}
                                        className="absolute inset-0 flex items-center justify-center"
                                    >
                                        <div className="w-20 h-20 bg-[#E8341A]/90 backdrop-blur-sm flex items-center justify-center shadow-[0_0_50px_rgba(232,52,26,0.5)] hover:scale-110 transition-transform">
                                            <PlayCircle size={36} className="text-white" />
                                        </div>
                                    </Link>
                                )}
                                <div className="absolute bottom-4 left-4 right-4">
                                    <div className="flex gap-1">
                                        {course.lessons.slice(0, 8).map((_, i) => (
                                            <div key={i} className="flex-1 h-0.5 bg-white/20 rounded-full" />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* LESSONS LIST */}
            <section className="px-6 mt-16">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                        {/* Lessons sidebar */}
                        <div className="lg:col-span-2 space-y-3">
                            <div className="flex items-center gap-4 mb-8">
                                <Zap size={16} className="text-[#E8341A]" />
                                <h2 className="text-xl font-black uppercase italic tracking-widest text-white">
                                    Contenido del Curso
                                </h2>
                                <span className="text-[10px] text-white/20 font-black uppercase tracking-widest italic">
                                    · {course.lessons.length} LECCIONES
                                </span>
                            </div>

                            {course.lessons.length === 0 ? (
                                <div className="border border-white/5 bg-white/[0.02] p-12 text-center">
                                    <Clock size={40} className="text-white/10 mx-auto mb-4" />
                                    <p className="text-white/30 font-black uppercase tracking-widest italic text-sm">
                                        Contenido en preparación
                                    </p>
                                </div>
                            ) : (
                                course.lessons.map((lesson, idx) => {
                                    const thumb = getVideoThumbnail(lesson.videoUrl)
                                    const hasVideo = isVideoUrl(lesson.videoUrl)
                                    return (
                                        <motion.div
                                            key={lesson.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.04 }}
                                        >
                                            <Link href={`/academy/${course.slug}/${lesson.id}`}>
                                                <div className="flex items-center gap-5 p-5 border border-white/[0.06] bg-white/[0.01] hover:border-[#E8341A]/30 hover:bg-white/[0.04] transition-all group cursor-pointer">
                                                    {/* Thumbnail or number */}
                                                    <div className="shrink-0 w-20 h-14 relative overflow-hidden bg-black border border-white/10">
                                                        {thumb ? (
                                                            <img src={thumb} alt="" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <span className="text-2xl font-black text-white/10 italic">
                                                                    {String(idx + 1).padStart(2, "0")}
                                                                </span>
                                                            </div>
                                                        )}
                                                        {hasVideo && (
                                                            <div className="absolute inset-0 flex items-center justify-center">
                                                                <div className="w-7 h-7 bg-[#E8341A]/80 flex items-center justify-center">
                                                                    <PlayCircle size={14} className="text-white" />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-[9px] font-black text-white/20 uppercase tracking-widest italic">
                                                                LECCIÓN {String(idx + 1).padStart(2, "0")}
                                                            </span>
                                                            {hasVideo && (
                                                                <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest italic border border-emerald-500/30 px-2 py-0.5">
                                                                    VIDEO
                                                                </span>
                                                            )}
                                                        </div>
                                                        <h3 className="text-sm font-black uppercase italic text-white group-hover:text-[#E8341A] transition-colors tracking-tight truncate">
                                                            {lesson.title}
                                                        </h3>
                                                    </div>

                                                    <ChevronRight size={16} className="text-white/20 group-hover:text-[#E8341A] group-hover:translate-x-1 transition-all shrink-0" />
                                                </div>
                                            </Link>
                                        </motion.div>
                                    )
                                })
                            )}
                        </div>

                        {/* Sidebar info */}
                        <div className="space-y-6">
                            <div className="border border-white/[0.06] bg-white/[0.02] p-8">
                                <h3 className="text-sm font-black uppercase italic tracking-widest text-white mb-6 border-b border-white/5 pb-4">
                                    Detalles del Curso
                                </h3>
                                <ul className="space-y-5">
                                    {[
                                        { label: "Categoría", value: course.category.name, icon: Zap },
                                        { label: "Total Lecciones", value: `${course.lessons.length} módulos`, icon: BookOpen },
                                        { label: "Videos", value: `${lessonsWithVideo.length} disponibles`, icon: PlayCircle },
                                        { label: "Precio", value: "Gratuito", icon: CheckCircle },
                                        { label: "Nivel", value: "Todos los niveles", icon: GraduationCap },
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-3">
                                                <item.icon size={14} className="text-[#E8341A] shrink-0" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-white/30 italic">{item.label}</span>
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-white italic text-right">{item.value}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* CTA */}
                            <div className="border border-[#E8341A]/20 bg-[#E8341A]/5 p-8">
                                <p className="text-xs text-white/50 font-medium leading-relaxed mb-6">
                                    Quieres llevar un seguimiento de tu progreso? Regístrate gratuitamente.
                                </p>
                                <Link
                                    href="/register"
                                    className="block text-center px-6 py-4 bg-[#E8341A] text-white font-black uppercase tracking-widest text-[10px] italic hover:shadow-[0_0_20px_rgba(232,52,26,0.4)] transition-all"
                                >
                                    Crear Cuenta
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
