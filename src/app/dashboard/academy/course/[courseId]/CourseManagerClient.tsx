"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Save, Plus, Trash2, GripVertical, PlayCircle, Eye, EyeOff,
    BookOpen, Link as LinkIcon, Upload, CheckCircle, AlertCircle,
    ChevronDown, ChevronUp, Edit3, X, Globe
} from "lucide-react"
import Link from "next/link"

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
    categoryId: string
    category: { id: string; name: string }
    lessons: Lesson[]
}

interface Category {
    id: string
    name: string
}

interface Props {
    course: Course
    categories: Category[]
}

function generateSlug(title: string): string {
    return title.toLowerCase()
        .replace(/[áàäâ]/g, "a").replace(/[éèëê]/g, "e")
        .replace(/[íìïî]/g, "i").replace(/[óòöô]/g, "o")
        .replace(/[úùüû]/g, "u").replace(/[ñ]/g, "n")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim().replace(/\s+/g, "-")
}

export default function CourseManagerClient({ course: initialCourse, categories }: Props) {
    const [course, setCourse] = useState(initialCourse)
    const [lessons, setLessons] = useState<Lesson[]>(initialCourse.lessons)
    const [saving, setSaving] = useState(false)
    const [savingLessonId, setSavingLessonId] = useState<string | null>(null)
    const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null)
    const [expandedLesson, setExpandedLesson] = useState<string | null>(null)
    const [addingLesson, setAddingLesson] = useState(false)
    const [newLesson, setNewLesson] = useState({ title: "", videoUrl: "", content: "" })

    const showToast = (type: "ok" | "err", msg: string) => {
        setToast({ type, msg })
        setTimeout(() => setToast(null), 3500)
    }

    // ── Save course metadata ──────────────────────────────────────────────────
    const saveCourse = async () => {
        setSaving(true)
        try {
            const res = await fetch(`/api/academy/courses/${course.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: course.title,
                    description: course.description,
                    imageUrl: course.imageUrl,
                    published: course.published,
                    categoryId: course.categoryId
                })
            })
            if (!res.ok) throw new Error()
            showToast("ok", "Curso actualizado correctamente")
        } catch {
            showToast("err", "Error al guardar el curso")
        } finally {
            setSaving(false)
        }
    }

    // ── Toggle published ──────────────────────────────────────────────────────
    const togglePublished = async () => {
        const next = !course.published
        setCourse(prev => ({ ...prev, published: next }))
        await fetch(`/api/academy/courses/${course.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ published: next })
        })
        showToast("ok", next ? "Curso publicado — visible al público" : "Curso despublicado")
    }

    // ── Save individual lesson ────────────────────────────────────────────────
    const saveLesson = async (lesson: Lesson) => {
        setSavingLessonId(lesson.id)
        try {
            const res = await fetch(`/api/academy/lessons/${lesson.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: lesson.title,
                    videoUrl: lesson.videoUrl,
                    content: lesson.content
                })
            })
            if (!res.ok) throw new Error()
            showToast("ok", `Lección "${lesson.title}" guardada`)
        } catch {
            showToast("err", "Error al guardar la lección")
        } finally {
            setSavingLessonId(null)
        }
    }

    // ── Delete lesson ─────────────────────────────────────────────────────────
    const deleteLesson = async (lessonId: string) => {
        if (!confirm("¿Eliminar esta lección? Esta acción no se puede deshacer.")) return
        try {
            await fetch(`/api/academy/lessons/${lessonId}`, { method: "DELETE" })
            setLessons(prev => prev.filter(l => l.id !== lessonId))
            showToast("ok", "Lección eliminada")
        } catch {
            showToast("err", "Error al eliminar")
        }
    }

    // ── Add new lesson ────────────────────────────────────────────────────────
    const addLesson = async () => {
        if (!newLesson.title.trim()) return
        try {
            const res = await fetch(`/api/academy/courses/${course.id}/lessons`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: newLesson.title,
                    slug: generateSlug(newLesson.title),
                    videoUrl: newLesson.videoUrl || null,
                    content: newLesson.content || "",
                    order: lessons.length + 1
                })
            })
            if (!res.ok) throw new Error()
            const data = await res.json()
            setLessons(prev => [...prev, data.lesson])
            setNewLesson({ title: "", videoUrl: "", content: "" })
            setAddingLesson(false)
            showToast("ok", "Lección añadida correctamente")
        } catch {
            showToast("err", "Error al crear la lección")
        }
    }

    const updateLesson = (id: string, field: keyof Lesson, value: string) => {
        setLessons(prev => prev.map(l => l.id === id ? { ...l, [field]: value } : l))
    }

    const videoTypes: Record<string, string> = {
        youtube: "YouTube",
        vimeo: "Vimeo",
        mp4: "Archivo MP4 (URL directa)",
    }

    const getVideoType = (url: string | null) => {
        if (!url) return null
        if (url.includes("youtube") || url.includes("youtu.be")) return "youtube"
        if (url.includes("vimeo")) return "vimeo"
        if (url.endsWith(".mp4")) return "mp4"
        return "other"
    }

    return (
        <div className="relative z-10 space-y-12">
            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className={`fixed top-8 right-8 z-[200] flex items-center gap-3 px-6 py-4 border text-xs font-black uppercase tracking-widest italic shadow-2xl ${
                            toast.type === "ok"
                                ? "bg-emerald-950 border-emerald-500/40 text-emerald-400"
                                : "bg-red-950 border-red-500/40 text-red-400"
                        }`}
                    >
                        {toast.type === "ok" ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                        {toast.msg}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Course Meta ──────────────────────────────────────────────── */}
            <div className="border border-white/[0.06] bg-white/[0.02] p-8 space-y-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-sm font-black uppercase italic tracking-widest text-white flex items-center gap-3">
                        <BookOpen size={16} className="text-[#E8341A]" />
                        Información del Curso
                    </h2>
                    {/* Published toggle */}
                    <button
                        onClick={togglePublished}
                        className={`flex items-center gap-3 px-5 py-2.5 border text-[10px] font-black uppercase tracking-widest italic transition-all ${
                            course.published
                                ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10"
                                : "border-yellow-500/40 text-yellow-500 bg-yellow-500/5 hover:bg-yellow-500/10"
                        }`}
                    >
                        {course.published ? <Globe size={13} /> : <EyeOff size={13} />}
                        {course.published ? "PUBLICADO" : "BORRADOR"}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-white/30 italic">Título del Curso</label>
                        <input
                            type="text"
                            value={course.title}
                            onChange={e => setCourse(prev => ({ ...prev, title: e.target.value }))}
                            className="w-full bg-white/[0.03] border border-white/10 px-5 py-3 text-sm text-white font-medium outline-none focus:border-[#E8341A]/50 transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-white/30 italic">Categoría</label>
                        <select
                            value={course.categoryId}
                            onChange={e => setCourse(prev => ({ ...prev, categoryId: e.target.value }))}
                            className="w-full bg-white/[0.03] border border-white/10 px-5 py-3 text-sm text-white font-medium outline-none focus:border-[#E8341A]/50 transition-all"
                        >
                            {categories.map(c => (
                                <option key={c.id} value={c.id} className="bg-black">{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-white/30 italic">Imagen de Portada (URL)</label>
                        <input
                            type="url"
                            value={course.imageUrl || ""}
                            onChange={e => setCourse(prev => ({ ...prev, imageUrl: e.target.value }))}
                            placeholder="https://..."
                            className="w-full bg-white/[0.03] border border-white/10 px-5 py-3 text-sm text-white font-medium outline-none focus:border-[#E8341A]/50 transition-all placeholder-white/20"
                        />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-white/30 italic">Descripción</label>
                        <textarea
                            value={course.description || ""}
                            onChange={e => setCourse(prev => ({ ...prev, description: e.target.value }))}
                            rows={3}
                            className="w-full bg-white/[0.03] border border-white/10 px-5 py-3 text-sm text-white font-medium outline-none focus:border-[#E8341A]/50 transition-all resize-none"
                        />
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={saveCourse}
                        disabled={saving}
                        className="flex items-center gap-3 px-8 py-4 bg-[#E8341A] text-white text-[10px] font-black uppercase tracking-widest italic hover:shadow-[0_0_25px_rgba(232,52,26,0.4)] transition-all disabled:opacity-50"
                    >
                        <Save size={14} />
                        {saving ? "Guardando..." : "Guardar Curso"}
                    </button>
                </div>
            </div>

            {/* ── Lessons ──────────────────────────────────────────────────── */}
            <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-sm font-black uppercase italic tracking-widest text-white flex items-center gap-3">
                        <PlayCircle size={16} className="text-[#E8341A]" />
                        Lecciones
                        <span className="text-[10px] text-white/20 italic">· {lessons.length} módulos</span>
                    </h2>
                    <button
                        onClick={() => setAddingLesson(true)}
                        className="flex items-center gap-2 px-6 py-3 border border-[#E8341A]/30 text-[#E8341A] text-[10px] font-black uppercase tracking-widest italic hover:bg-[#E8341A]/10 transition-all"
                    >
                        <Plus size={14} /> Nueva Lección
                    </button>
                </div>

                {/* Add lesson form */}
                <AnimatePresence>
                    {addingLesson && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="border border-[#E8341A]/20 bg-[#E8341A]/5 p-8 space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xs font-black uppercase italic tracking-widest text-[#E8341A]">Nueva Lección</h3>
                                    <button onClick={() => setAddingLesson(false)} className="text-white/30 hover:text-white"><X size={16} /></button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-white/30 italic">Título</label>
                                        <input
                                            type="text"
                                            value={newLesson.title}
                                            onChange={e => setNewLesson(prev => ({ ...prev, title: e.target.value }))}
                                            placeholder="Título de la lección..."
                                            className="w-full bg-white/[0.03] border border-white/10 px-5 py-3 text-sm text-white font-medium outline-none focus:border-[#E8341A]/50 transition-all placeholder-white/20"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-white/30 italic">
                                            URL del Video (YouTube / Vimeo / MP4)
                                        </label>
                                        <input
                                            type="url"
                                            value={newLesson.videoUrl}
                                            onChange={e => setNewLesson(prev => ({ ...prev, videoUrl: e.target.value }))}
                                            placeholder="https://youtube.com/watch?v=..."
                                            className="w-full bg-white/[0.03] border border-white/10 px-5 py-3 text-sm text-white font-medium outline-none focus:border-[#E8341A]/50 transition-all placeholder-white/20"
                                        />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-white/30 italic">Contenido / Descripción (HTML o texto)</label>
                                        <textarea
                                            value={newLesson.content}
                                            onChange={e => setNewLesson(prev => ({ ...prev, content: e.target.value }))}
                                            rows={4}
                                            placeholder="<h2>Introducción</h2><p>En esta lección veremos...</p>"
                                            className="w-full bg-white/[0.03] border border-white/10 px-5 py-3 text-sm text-white font-medium outline-none focus:border-[#E8341A]/50 transition-all resize-none placeholder-white/20"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        onClick={addLesson}
                                        className="flex items-center gap-3 px-8 py-4 bg-[#E8341A] text-white text-[10px] font-black uppercase tracking-widest italic hover:shadow-[0_0_25px_rgba(232,52,26,0.4)] transition-all"
                                    >
                                        <Plus size={14} /> Crear Lección
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Lessons list */}
                {lessons.length === 0 ? (
                    <div className="border border-white/5 bg-white/[0.01] p-16 text-center">
                        <PlayCircle size={40} className="text-white/10 mx-auto mb-4" />
                        <p className="text-white/20 font-black uppercase tracking-widest italic text-sm">Sin lecciones todavía</p>
                        <p className="text-white/10 text-xs font-medium mt-2">Añade la primera lección para comenzar</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {lessons.map((lesson, idx) => {
                            const isExpanded = expandedLesson === lesson.id
                            const videoType = getVideoType(lesson.videoUrl)

                            return (
                                <div key={lesson.id} className="border border-white/[0.06] bg-white/[0.02] overflow-hidden">
                                    {/* Lesson row header */}
                                    <div
                                        className="flex items-center gap-5 p-5 cursor-pointer hover:bg-white/[0.02] transition-all group"
                                        onClick={() => setExpandedLesson(isExpanded ? null : lesson.id)}
                                    >
                                        <GripVertical size={16} className="text-white/10 shrink-0" />
                                        <div className="w-8 h-8 border border-white/10 flex items-center justify-center shrink-0">
                                            <span className="text-[10px] font-black text-white/30 italic">{String(idx + 1).padStart(2, "0")}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-black uppercase italic tracking-tight text-white group-hover:text-[#E8341A] transition-colors">
                                                {lesson.title}
                                            </h3>
                                            <div className="flex items-center gap-4 mt-1">
                                                {videoType && (
                                                    <span className="flex items-center gap-1 text-[8px] font-black text-emerald-400 uppercase tracking-widest italic">
                                                        <PlayCircle size={10} /> {videoType === "youtube" ? "YouTube" : videoType === "vimeo" ? "Vimeo" : "Video"}
                                                    </span>
                                                )}
                                                {!lesson.videoUrl && (
                                                    <span className="text-[8px] font-black text-white/20 uppercase tracking-widest italic">Sin video</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 shrink-0">
                                            <Link
                                                href={`/academy/${course.slug}/${lesson.id}`}
                                                target="_blank"
                                                onClick={e => e.stopPropagation()}
                                                className="p-2 text-white/20 hover:text-white transition-colors"
                                                title="Ver en público"
                                            >
                                                <Eye size={14} />
                                            </Link>
                                            <button
                                                onClick={e => { e.stopPropagation(); deleteLesson(lesson.id) }}
                                                className="p-2 text-white/20 hover:text-red-400 transition-colors"
                                                title="Eliminar"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                            {isExpanded ? <ChevronUp size={14} className="text-white/30" /> : <ChevronDown size={14} className="text-white/30" />}
                                        </div>
                                    </div>

                                    {/* Lesson edit form */}
                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="overflow-hidden border-t border-white/5"
                                            >
                                                <div className="p-8 space-y-6 bg-black/20">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div className="space-y-2">
                                                            <label className="text-[9px] font-black uppercase tracking-widest text-white/30 italic">Título de la Lección</label>
                                                            <input
                                                                type="text"
                                                                value={lesson.title}
                                                                onChange={e => updateLesson(lesson.id, "title", e.target.value)}
                                                                className="w-full bg-white/[0.03] border border-white/10 px-5 py-3 text-sm text-white font-medium outline-none focus:border-[#E8341A]/50 transition-all"
                                                            />
                                                        </div>

                                                        <div className="space-y-2">
                                                            <label className="text-[9px] font-black uppercase tracking-widest text-white/30 italic flex items-center gap-2">
                                                                <LinkIcon size={10} className="text-[#E8341A]" />
                                                                URL del Video
                                                            </label>
                                                            <input
                                                                type="url"
                                                                value={lesson.videoUrl || ""}
                                                                onChange={e => updateLesson(lesson.id, "videoUrl", e.target.value)}
                                                                placeholder="https://youtube.com/watch?v=... · vimeo.com/... · archivo.mp4"
                                                                className="w-full bg-white/[0.03] border border-white/10 px-5 py-3 text-sm text-white font-medium outline-none focus:border-[#E8341A]/50 transition-all placeholder-white/20"
                                                            />
                                                            {lesson.videoUrl && (
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    <span className="text-[8px] font-black text-emerald-400 italic uppercase tracking-widest">
                                                                        ✓ {getVideoType(lesson.videoUrl) === "youtube" ? "YouTube detectado" : getVideoType(lesson.videoUrl) === "vimeo" ? "Vimeo detectado" : "URL de video"}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="space-y-2 md:col-span-2">
                                                            <label className="text-[9px] font-black uppercase tracking-widest text-white/30 italic">Contenido / Notas (HTML)</label>
                                                            <textarea
                                                                value={lesson.content || ""}
                                                                onChange={e => updateLesson(lesson.id, "content", e.target.value)}
                                                                rows={6}
                                                                placeholder="<h2>Introducción</h2><p>En esta lección...</p>"
                                                                className="w-full bg-white/[0.03] border border-white/10 px-5 py-3 text-sm text-white font-medium outline-none focus:border-[#E8341A]/50 transition-all resize-none placeholder-white/20 font-mono"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="flex justify-end gap-3">
                                                        <button
                                                            onClick={() => saveLesson(lesson)}
                                                            disabled={savingLessonId === lesson.id}
                                                            className="flex items-center gap-2 px-8 py-4 bg-[#E8341A] text-white text-[10px] font-black uppercase tracking-widest italic hover:shadow-[0_0_20px_rgba(232,52,26,0.4)] transition-all disabled:opacity-50"
                                                        >
                                                            <Save size={13} />
                                                            {savingLessonId === lesson.id ? "Guardando..." : "Guardar Lección"}
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
