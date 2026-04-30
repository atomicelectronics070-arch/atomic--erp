"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
    PlayCircle, ChevronLeft, ChevronRight, ChevronDown, ChevronUp,
    BookOpen, CheckCircle, GraduationCap, Zap, List, X, Volume2,
    ExternalLink, AlertCircle
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

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
    category: { name: string; slug: string }
    lessons: Lesson[]
}

interface LessonData {
    id: string
    title: string
    content: string
    videoUrl: string | null
    order: number
    course: Course
}

// ─── Video URL Parser ────────────────────────────────────────────────────────

function parseVideoUrl(url: string | null): { type: "youtube" | "vimeo" | "mp4" | "direct" | "none"; embedUrl: string | null; isEmbed: boolean } {
    if (!url) return { type: "none", embedUrl: null, isEmbed: false }

    // YouTube
    const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&\s?#]+)/)
    if (ytMatch) {
        return {
            type: "youtube",
            embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?rel=0&modestbranding=1&color=red&controls=1&showinfo=0`,
            isEmbed: true
        }
    }

    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
    if (vimeoMatch) {
        return {
            type: "vimeo",
            embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?color=E8341A&title=0&byline=0&portrait=0`,
            isEmbed: true
        }
    }

    // Direct MP4/WebM/Blob
    if (url.endsWith(".mp4") || url.endsWith(".webm") || url.endsWith(".ogg") || url.includes("storage.googleapis") || url.includes("supabase")) {
        return { type: "mp4", embedUrl: url, isEmbed: false }
    }

    // Fallback — try to embed any URL
    return { type: "direct", embedUrl: url, isEmbed: true }
}

// ─── Video Player Component ──────────────────────────────────────────────────

function VideoPlayer({ url, title }: { url: string | null; title: string }) {
    const { type, embedUrl, isEmbed } = parseVideoUrl(url)
    const videoRef = useRef<HTMLVideoElement>(null)

    if (type === "none" || !embedUrl) {
        return (
            <div className="w-full aspect-video bg-gradient-to-br from-slate-950 to-black flex flex-col items-center justify-center gap-6 border border-white/5">
                <div className="w-20 h-20 border border-white/10 flex items-center justify-center">
                    <AlertCircle size={36} className="text-white/20" />
                </div>
                <div className="text-center">
                    <p className="text-sm font-black uppercase italic text-white/30 tracking-widest">Video no disponible</p>
                    <p className="text-[10px] text-white/15 uppercase tracking-widest mt-2 font-bold italic">Contenido en preparación</p>
                </div>
            </div>
        )
    }

    // Native HTML5 player (MP4, Supabase, etc.)
    if (!isEmbed) {
        return (
            <div className="w-full aspect-video bg-black relative group">
                <video
                    ref={videoRef}
                    src={embedUrl}
                    controls
                    className="w-full h-full"
                    preload="metadata"
                    style={{ maxHeight: "100%" }}
                >
                    <source src={embedUrl} type="video/mp4" />
                    Tu navegador no soporta video HTML5.
                </video>
            </div>
        )
    }

    // iFrame embed (YouTube, Vimeo, etc.)
    return (
        <div className="w-full aspect-video bg-black relative">
            <iframe
                src={embedUrl}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
                loading="lazy"
            />
        </div>
    )
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function LessonPlayerPage() {
    const params = useParams()
    const router = useRouter()
    const courseSlug = params.slug as string
    const lessonId = params.lessonId as string

    const [lesson, setLesson] = useState<LessonData | null>(null)
    const [loading, setLoading] = useState(true)
    const [showSidebar, setShowSidebar] = useState(true)
    const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set())

    useEffect(() => {
        fetch(`/api/public/academy/lesson/${lessonId}`)
            .then(r => r.json())
            .then(data => { setLesson(data.lesson); setLoading(false) })
            .catch(() => setLoading(false))
    }, [lessonId])

    // Load completed lessons from localStorage
    useEffect(() => {
        const stored = localStorage.getItem(`academy_completed_${courseSlug}`)
        if (stored) setCompletedLessons(new Set(JSON.parse(stored)))
    }, [courseSlug])

    const markCompleted = (id: string) => {
        setCompletedLessons(prev => {
            const next = new Set(prev)
            next.add(id)
            localStorage.setItem(`academy_completed_${courseSlug}`, JSON.stringify([...next]))
            return next
        })
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex flex-col items-center gap-6">
                    <div className="w-16 h-16 border border-[#E8341A]/20 animate-spin relative">
                        <div className="absolute inset-2 border-t border-[#E8341A]" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.6em] text-white/20 animate-pulse italic">
                        Cargando lección...
                    </p>
                </div>
            </div>
        )
    }

    if (!lesson) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
                <AlertCircle size={64} className="text-white/10" />
                <h2 className="text-2xl font-black uppercase italic text-white/30">Lección no encontrada</h2>
                <Link href={`/academy/${courseSlug}`} className="text-[#E8341A] font-black uppercase tracking-widest text-xs italic hover:underline flex items-center gap-2">
                    <ChevronLeft size={14} /> Volver al Curso
                </Link>
            </div>
        )
    }

    const course = lesson.course
    const lessons = course.lessons
    const currentIndex = lessons.findIndex(l => l.id === lesson.id)
    const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null
    const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null
    const progressPct = lessons.length > 0 ? Math.round((completedLessons.size / lessons.length) * 100) : 0

    return (
        <div className="flex flex-col h-[calc(100vh-80px)] overflow-hidden">
            {/* Top nav bar */}
            <div className="shrink-0 border-b border-white/5 bg-black/40 backdrop-blur-xl px-6 py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                    <Link
                        href={`/academy/${courseSlug}`}
                        className="shrink-0 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-[#E8341A] transition-colors italic"
                    >
                        <ChevronLeft size={14} />
                        <span className="hidden sm:inline">Volver al Curso</span>
                    </Link>
                    <div className="h-4 w-px bg-white/10 shrink-0" />
                    <div className="min-w-0">
                        <p className="text-[9px] font-black uppercase tracking-widest text-white/20 italic truncate">{course.title}</p>
                        <h1 className="text-sm font-black uppercase italic tracking-tight text-white truncate">
                            {lesson.title}
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                    {/* Progress */}
                    <div className="hidden md:flex items-center gap-3">
                        <div className="w-32 h-1 bg-white/10 relative">
                            <div
                                className="absolute inset-y-0 left-0 bg-[#E8341A] transition-all duration-700"
                                style={{ width: `${progressPct}%` }}
                            />
                        </div>
                        <span className="text-[9px] font-black text-white/30 italic uppercase tracking-widest">{progressPct}%</span>
                    </div>

                    {/* Mark as complete */}
                    {!completedLessons.has(lesson.id) && (
                        <button
                            onClick={() => markCompleted(lesson.id)}
                            className="flex items-center gap-2 px-4 py-2 border border-emerald-500/30 text-emerald-400 text-[9px] font-black uppercase tracking-widest italic hover:bg-emerald-500/10 transition-all"
                        >
                            <CheckCircle size={12} />
                            <span className="hidden sm:inline">Completada</span>
                        </button>
                    )}
                    {completedLessons.has(lesson.id) && (
                        <div className="flex items-center gap-2 px-4 py-2 border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase tracking-widest italic">
                            <CheckCircle size={12} />
                            <span className="hidden sm:inline">✓ Completada</span>
                        </div>
                    )}

                    {/* Toggle sidebar */}
                    <button
                        onClick={() => setShowSidebar(!showSidebar)}
                        className="p-2 border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-all"
                        title="Temario"
                    >
                        <List size={16} />
                    </button>
                </div>
            </div>

            {/* Main content area */}
            <div className="flex flex-1 overflow-hidden">
                {/* Video + Content */}
                <div className="flex-1 overflow-y-auto">
                    {/* Video */}
                    <div className="bg-black w-full">
                        <div className="max-w-5xl mx-auto">
                            <VideoPlayer url={lesson.videoUrl} title={lesson.title} />
                        </div>
                    </div>

                    {/* Content area */}
                    <div className="max-w-4xl mx-auto px-6 py-12 space-y-10">
                        {/* Lesson header */}
                        <div className="border-b border-white/5 pb-8">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-[9px] font-black uppercase tracking-[0.5em] text-[#E8341A] italic">
                                    LECCIÓN {String(currentIndex + 1).padStart(2, "0")}
                                </span>
                                {completedLessons.has(lesson.id) && (
                                    <span className="text-[8px] font-black uppercase tracking-widest text-emerald-400 italic border border-emerald-500/30 px-2 py-0.5 bg-emerald-500/5">
                                        ✓ COMPLETADA
                                    </span>
                                )}
                            </div>
                            <h2 className="text-3xl font-black uppercase italic tracking-tight text-white">
                                {lesson.title}
                            </h2>
                        </div>

                        {/* Lesson content (HTML or markdown) */}
                        {lesson.content && (
                            <div
                                className="prose prose-invert prose-sm max-w-none text-white/60 leading-relaxed [&_h1]:text-white [&_h1]:font-black [&_h1]:uppercase [&_h1]:italic [&_h2]:text-white [&_h2]:font-black [&_h2]:uppercase [&_h2]:italic [&_h3]:text-white/80 [&_h3]:font-bold [&_strong]:text-white [&_a]:text-[#E8341A] [&_code]:bg-white/5 [&_code]:px-2 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-[#E8341A] [&_pre]:bg-white/[0.03] [&_pre]:border [&_pre]:border-white/5"
                                dangerouslySetInnerHTML={{ __html: lesson.content }}
                            />
                        )}

                        {/* Navigation buttons */}
                        <div className="flex items-center justify-between pt-8 border-t border-white/5">
                            {prevLesson ? (
                                <Link
                                    href={`/academy/${courseSlug}/${prevLesson.id}`}
                                    className="flex items-center gap-3 px-6 py-4 border border-white/10 text-white/50 hover:border-white/30 hover:text-white transition-all group"
                                >
                                    <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                                    <div className="text-left">
                                        <p className="text-[8px] font-black uppercase tracking-widest italic text-white/20">Anterior</p>
                                        <p className="text-[10px] font-black uppercase italic tracking-tight">{prevLesson.title}</p>
                                    </div>
                                </Link>
                            ) : <div />}

                            {nextLesson ? (
                                <Link
                                    href={`/academy/${courseSlug}/${nextLesson.id}`}
                                    onClick={() => markCompleted(lesson.id)}
                                    className="flex items-center gap-3 px-6 py-4 bg-[#E8341A] text-white hover:shadow-[0_0_30px_rgba(232,52,26,0.4)] transition-all group"
                                >
                                    <div className="text-right">
                                        <p className="text-[8px] font-black uppercase tracking-widest italic opacity-70">Siguiente</p>
                                        <p className="text-[10px] font-black uppercase italic tracking-tight">{nextLesson.title}</p>
                                    </div>
                                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            ) : (
                                <Link
                                    href={`/academy/${courseSlug}`}
                                    onClick={() => markCompleted(lesson.id)}
                                    className="flex items-center gap-3 px-6 py-4 bg-emerald-600 text-white hover:bg-emerald-500 transition-all"
                                >
                                    <CheckCircle size={16} />
                                    <span className="text-[10px] font-black uppercase italic tracking-widest">Finalizar Curso</span>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Lessons sidebar */}
                <AnimatePresence>
                    {showSidebar && (
                        <motion.aside
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 340, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                            className="shrink-0 border-l border-white/5 bg-black/30 overflow-hidden flex flex-col"
                        >
                            <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between shrink-0">
                                <div>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-white/30 italic">Temario</p>
                                    <p className="text-xs font-black uppercase italic tracking-tight text-white truncate">{course.title}</p>
                                </div>
                                <button onClick={() => setShowSidebar(false)} className="text-white/20 hover:text-white transition-colors">
                                    <X size={16} />
                                </button>
                            </div>

                            {/* Progress bar */}
                            <div className="px-6 py-4 border-b border-white/5 shrink-0">
                                <div className="flex justify-between mb-2">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-white/20 italic">Progreso</span>
                                    <span className="text-[9px] font-black text-[#E8341A] italic">{progressPct}%</span>
                                </div>
                                <div className="h-1 bg-white/5 relative">
                                    <div
                                        className="absolute inset-y-0 left-0 bg-[#E8341A] transition-all duration-700"
                                        style={{ width: `${progressPct}%` }}
                                    />
                                </div>
                                <p className="text-[8px] text-white/20 italic mt-2 font-bold uppercase tracking-widest">
                                    {completedLessons.size} de {lessons.length} completadas
                                </p>
                            </div>

                            {/* Lessons list */}
                            <div className="flex-1 overflow-y-auto py-4 space-y-1 px-2">
                                {lessons.map((l, idx) => {
                                    const isActive = l.id === lesson.id
                                    const isDone = completedLessons.has(l.id)
                                    const hasVideo = l.videoUrl && (l.videoUrl.includes("youtube") || l.videoUrl.includes("vimeo") || l.videoUrl.endsWith(".mp4"))

                                    return (
                                        <Link key={l.id} href={`/academy/${courseSlug}/${l.id}`}>
                                            <div className={`flex items-center gap-4 px-4 py-4 transition-all group ${
                                                isActive
                                                    ? "bg-[#E8341A]/10 border border-[#E8341A]/30"
                                                    : "hover:bg-white/[0.03] border border-transparent hover:border-white/5"
                                            }`}>
                                                {/* Status icon */}
                                                <div className={`shrink-0 w-6 h-6 flex items-center justify-center border ${
                                                    isDone
                                                        ? "border-emerald-500/50 bg-emerald-500/10"
                                                        : isActive
                                                        ? "border-[#E8341A] bg-[#E8341A]/10"
                                                        : "border-white/10 bg-white/[0.02]"
                                                }`}>
                                                    {isDone ? (
                                                        <CheckCircle size={12} className="text-emerald-400" />
                                                    ) : isActive ? (
                                                        <PlayCircle size={12} className="text-[#E8341A]" />
                                                    ) : (
                                                        <span className="text-[8px] font-black text-white/20 italic">{idx + 1}</span>
                                                    )}
                                                </div>

                                                {/* Title */}
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-[10px] font-black uppercase italic tracking-tight truncate ${
                                                        isActive ? "text-[#E8341A]" : isDone ? "text-white/50" : "text-white/60 group-hover:text-white"
                                                    } transition-colors`}>
                                                        {l.title}
                                                    </p>
                                                    {hasVideo && (
                                                        <p className="text-[8px] font-black text-white/20 uppercase tracking-widest italic mt-0.5">VIDEO</p>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    )
                                })}
                            </div>
                        </motion.aside>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
