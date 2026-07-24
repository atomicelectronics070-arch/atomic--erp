"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Save, Plus, Trash2, PlayCircle, Eye, EyeOff,
    BookOpen, Link as LinkIcon, CheckCircle, AlertCircle,
    ChevronDown, ChevronUp, X, Globe, Youtube, ArrowUp, ArrowDown
} from "lucide-react"
import Link from "next/link"

interface Lesson {
    id: string; title: string; slug: string; content: string;
    videoUrl: string | null; order: number
}
interface Course {
    id: string; title: string; slug: string; description: string | null;
    imageUrl: string | null; published: boolean; categoryId: string;
    category: { id: string; name: string }; lessons: Lesson[]
}
interface Category { id: string; name: string }

function getYouTubeId(url: string): string | null {
    const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
    return m ? m[1] : null
}
function getVimeoId(url: string): string | null {
    const m = url.match(/vimeo\.com\/(\d+)/)
    return m ? m[1] : null
}
function generateSlug(title: string) {
    return title.toLowerCase()
        .replace(/[áàäâ]/g,"a").replace(/[éèëê]/g,"e")
        .replace(/[íìïî]/g,"i").replace(/[óòöô]/g,"o")
        .replace(/[úùüû]/g,"u").replace(/[ñ]/g,"n")
        .replace(/[^a-z0-9\s-]/g,"").trim().replace(/\s+/g,"-")
}

function VideoPreview({ url }: { url: string | null }) {
    if (!url) return null
    const ytId = getYouTubeId(url)
    const vimeoId = !ytId ? getVimeoId(url) : null
    if (ytId) return (
        <div className="aspect-video w-full rounded-xl overflow-hidden border border-slate-200 bg-black">
            <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${ytId}`} allowFullScreen />
        </div>
    )
    if (vimeoId) return (
        <div className="aspect-video w-full rounded-xl overflow-hidden border border-slate-200 bg-black">
            <iframe className="w-full h-full" src={`https://player.vimeo.com/video/${vimeoId}`} allowFullScreen />
        </div>
    )
    return (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
            <PlayCircle size={14} className="text-emerald-600" />
            <span className="text-xs font-bold text-emerald-700 truncate">{url}</span>
        </div>
    )
}

export default function CourseManagerClient({ course: initialCourse, categories }: { course: Course; categories: Category[] }) {
    const [course, setCourse] = useState(initialCourse)
    const [lessons, setLessons] = useState<Lesson[]>(initialCourse.lessons)
    const [saving, setSaving] = useState(false)
    const [savingLessonId, setSavingLessonId] = useState<string | null>(null)
    const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null)
    const [expandedLesson, setExpandedLesson] = useState<string | null>(null)
    const [addingLesson, setAddingLesson] = useState(false)
    const [newLesson, setNewLesson] = useState({ title: "", videoUrl: "", content: "" })

    const showToast = (type: "ok" | "err", msg: string) => {
        setToast({ type, msg }); setTimeout(() => setToast(null), 3500)
    }

    const saveCourse = async () => {
        setSaving(true)
        try {
            const res = await fetch(`/api/academy/courses/${course.id}`, {
                method: "PATCH", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: course.title, description: course.description, imageUrl: course.imageUrl, published: course.published, categoryId: course.categoryId })
            })
            if (!res.ok) throw new Error()
            showToast("ok", "Curso guardado correctamente")
        } catch { showToast("err", "Error al guardar") } finally { setSaving(false) }
    }

    const togglePublished = async () => {
        const next = !course.published
        setCourse(prev => ({ ...prev, published: next }))
        await fetch(`/api/academy/courses/${course.id}`, {
            method: "PATCH", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ published: next })
        })
        showToast("ok", next ? "✓ Curso publicado y visible" : "Curso archivado como borrador")
    }

    const saveLesson = async (lesson: Lesson) => {
        setSavingLessonId(lesson.id)
        try {
            const res = await fetch(`/api/academy/lessons/${lesson.id}`, {
                method: "PATCH", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: lesson.title, videoUrl: lesson.videoUrl, content: lesson.content })
            })
            if (!res.ok) throw new Error()
            showToast("ok", `"${lesson.title}" guardada`)
        } catch { showToast("err", "Error al guardar la lección") } finally { setSavingLessonId(null) }
    }

    const deleteLesson = async (lessonId: string) => {
        if (!confirm("¿Eliminar esta lección? No se puede deshacer.")) return
        try {
            await fetch(`/api/academy/lessons/${lessonId}`, { method: "DELETE" })
            setLessons(prev => prev.filter(l => l.id !== lessonId))
            showToast("ok", "Lección eliminada")
        } catch { showToast("err", "Error al eliminar") }
    }

    const addLesson = async () => {
        if (!newLesson.title.trim()) return
        try {
            const res = await fetch(`/api/academy/courses/${course.id}/lessons`, {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: newLesson.title, slug: generateSlug(newLesson.title), videoUrl: newLesson.videoUrl || null, content: newLesson.content || "", order: lessons.length + 1 })
            })
            if (!res.ok) throw new Error()
            const data = await res.json()
            setLessons(prev => [...prev, data.lesson])
            setNewLesson({ title: "", videoUrl: "", content: "" })
            setAddingLesson(false)
            setExpandedLesson(data.lesson.id)
            showToast("ok", "Lección añadida")
        } catch { showToast("err", "Error al crear la lección") }
    }

    const updateLesson = (id: string, field: keyof Lesson, value: string) =>
        setLessons(prev => prev.map(l => l.id === id ? { ...l, [field]: value } : l))

    const moveLesson = async (idx: number, dir: -1 | 1) => {
        const next = [...lessons]
        const swap = idx + dir
        if (swap < 0 || swap >= next.length) return
        ;[next[idx], next[swap]] = [next[swap], next[idx]]
        const reordered = next.map((l, i) => ({ ...l, order: i + 1 }))
        setLessons(reordered)
        await Promise.all(reordered.map(l =>
            fetch(`/api/academy/lessons/${l.id}`, {
                method: "PATCH", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ order: l.order })
            })
        ))
    }

    return (
        <div className="relative z-10 space-y-8">
            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
                        className={`fixed top-6 right-6 z-[200] flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-bold shadow-2xl border ${toast.type === "ok" ? "bg-emerald-950 border-emerald-500/30 text-emerald-400" : "bg-red-950 border-red-500/30 text-red-400"}`}>
                        {toast.type === "ok" ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
                        {toast.msg}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Course Meta */}
            <div className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 border border-slate-200 rounded-2xl p-8 shadow-[0_4px_15px_rgba(0,0,0,0.3)] space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-sm font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
                        <BookOpen size={16} className="text-indigo-500" /> Información del Curso
                    </h2>
                    <button onClick={togglePublished}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${course.published ? "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100" : "bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100"}`}>
                        {course.published ? <><Globe size={13} /> Publicado</> : <><EyeOff size={13} /> Borrador</>}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Título</label>
                        <input type="text" value={course.title} onChange={e => setCourse(p => ({ ...p, title: e.target.value }))}
                            className="w-full border border-slate-200 bg-slate-50 px-4 py-3 rounded-xl text-sm font-medium text-slate-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Categoría</label>
                        <select value={course.categoryId} onChange={e => setCourse(p => ({ ...p, categoryId: e.target.value }))}
                            className="w-full border border-slate-200 bg-slate-50 px-4 py-3 rounded-xl text-sm font-medium text-slate-800 outline-none focus:border-indigo-500 transition-all appearance-none">
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Imagen de Portada (URL)</label>
                        <input type="url" value={course.imageUrl || ""} onChange={e => setCourse(p => ({ ...p, imageUrl: e.target.value }))}
                            placeholder="https://..." className="w-full border border-slate-200 bg-slate-50 px-4 py-3 rounded-xl text-sm font-medium text-slate-800 outline-none focus:border-indigo-500 transition-all" />
                        {course.imageUrl && <img src={course.imageUrl} className="w-full h-32 object-cover rounded-xl border border-slate-200 mt-2" alt="Preview" />}
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Descripción</label>
                        <textarea value={course.description || ""} onChange={e => setCourse(p => ({ ...p, description: e.target.value }))}
                            rows={3} className="w-full border border-slate-200 bg-slate-50 px-4 py-3 rounded-xl text-sm font-medium text-slate-800 outline-none focus:border-indigo-500 transition-all resize-none" />
                    </div>
                </div>

                <div className="flex justify-end">
                    <button onClick={saveCourse} disabled={saving}
                        className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-[0_4px_15px_rgba(0,0,0,0.3)]">
                        <Save size={15} /> {saving ? "Guardando..." : "Guardar Curso"}
                    </button>
                </div>
            </div>

            {/* Lessons */}
            <div className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 border border-slate-200 rounded-2xl shadow-[0_4px_15px_rgba(0,0,0,0.3)] overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-sm font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
                        <PlayCircle size={16} className="text-indigo-500" /> Lecciones
                        <span className="bg-slate-100 text-slate-500 text-xs font-bold px-2.5 py-1 rounded-full">{lessons.length}</span>
                    </h2>
                    <button onClick={() => setAddingLesson(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all">
                        <Plus size={14} /> Nueva Lección
                    </button>
                </div>

                {/* Add Lesson Form */}
                <AnimatePresence>
                    {addingLesson && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-b border-slate-100">
                            <div className="p-6 bg-indigo-50/50 space-y-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-xs font-black text-indigo-700 uppercase tracking-widest">Nueva Lección</h3>
                                    <button onClick={() => setAddingLesson(false)} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Título *</label>
                                        <input type="text" value={newLesson.title}
                                            onChange={e => setNewLesson(p => ({ ...p, title: e.target.value }))}
                                            placeholder="Ej: Introducción a los protocolos TCP/IP"
                                            className="w-full border border-slate-200 bg-slate-900/50 backdrop-blur-xl border-slate-700/50 px-4 py-3 rounded-xl text-sm font-medium text-slate-800 outline-none focus:border-indigo-500 transition-all" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">URL Video (YouTube / Vimeo)</label>
                                        <input type="url" value={newLesson.videoUrl}
                                            onChange={e => setNewLesson(p => ({ ...p, videoUrl: e.target.value }))}
                                            placeholder="https://youtube.com/watch?v=..."
                                            className="w-full border border-slate-200 bg-slate-900/50 backdrop-blur-xl border-slate-700/50 px-4 py-3 rounded-xl text-sm font-medium text-slate-800 outline-none focus:border-indigo-500 transition-all" />
                                    </div>
                                    {newLesson.videoUrl && (
                                        <div className="md:col-span-2"><VideoPreview url={newLesson.videoUrl} /></div>
                                    )}
                                    <div className="md:col-span-2 space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Notas / Descripción</label>
                                        <textarea value={newLesson.content} onChange={e => setNewLesson(p => ({ ...p, content: e.target.value }))}
                                            rows={3} placeholder="Descripción de la lección o notas adicionales..."
                                            className="w-full border border-slate-200 bg-slate-900/50 backdrop-blur-xl border-slate-700/50 px-4 py-3 rounded-xl text-sm font-medium text-slate-800 outline-none focus:border-indigo-500 transition-all resize-none" />
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <button onClick={addLesson}
                                        className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all">
                                        <Plus size={15} /> Crear Lección
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Lesson List */}
                {lessons.length === 0 ? (
                    <div className="text-center py-16">
                        <PlayCircle size={40} className="text-slate-200 mx-auto mb-3" />
                        <p className="text-slate-400 font-bold text-sm">Sin lecciones todavía</p>
                        <p className="text-slate-300 text-xs mt-1">Haz clic en "Nueva Lección" para empezar</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {lessons.map((lesson, idx) => {
                            const isExpanded = expandedLesson === lesson.id
                            const ytId = lesson.videoUrl ? getYouTubeId(lesson.videoUrl) : null
                            return (
                                <div key={lesson.id} className={`transition-colors ${isExpanded ? "bg-slate-50" : "hover:bg-slate-50/50"}`}>
                                    {/* Row */}
                                    <div className="flex items-center gap-4 px-6 py-4 cursor-pointer" onClick={() => setExpandedLesson(isExpanded ? null : lesson.id)}>
                                        <div className="flex flex-col gap-1 shrink-0">
                                            <button onClick={e => { e.stopPropagation(); moveLesson(idx, -1) }} disabled={idx === 0} className="text-slate-300 hover:text-slate-500 disabled:opacity-20 transition-colors"><ArrowUp size={12} /></button>
                                            <button onClick={e => { e.stopPropagation(); moveLesson(idx, 1) }} disabled={idx === lessons.length - 1} className="text-slate-300 hover:text-slate-500 disabled:opacity-20 transition-colors"><ArrowDown size={12} /></button>
                                        </div>
                                        <div className="w-8 h-8 bg-indigo-50 border border-indigo-100 rounded-lg flex items-center justify-center shrink-0">
                                            <span className="text-[11px] font-black text-indigo-500">{String(idx + 1).padStart(2, "0")}</span>
                                        </div>
                                        {ytId && (
                                            <img src={`https://img.youtube.com/vi/${ytId}/default.jpg`} className="w-12 h-8 object-cover rounded-lg border border-slate-200 shrink-0" alt="" />
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-slate-700 truncate">{lesson.title}</p>
                                            <div className="flex items-center gap-3 mt-0.5">
                                                {lesson.videoUrl ? (
                                                    <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                                                        <PlayCircle size={10} /> {ytId ? "YouTube" : getVimeoId(lesson.videoUrl) ? "Vimeo" : "Video"}
                                                    </span>
                                                ) : (
                                                    <span className="text-[10px] font-bold text-slate-300">Sin video</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <Link href={`/academy/${course.slug}/${lesson.id}`} target="_blank" onClick={e => e.stopPropagation()}
                                                className="p-1.5 text-slate-300 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-all">
                                                <Eye size={14} />
                                            </Link>
                                            <button onClick={e => { e.stopPropagation(); deleteLesson(lesson.id) }}
                                                className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                                <Trash2 size={14} />
                                            </button>
                                            {isExpanded ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-300" />}
                                        </div>
                                    </div>

                                    {/* Expanded Editor */}
                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden border-t border-slate-100">
                                                <div className="p-6 space-y-5 bg-slate-900/50 backdrop-blur-xl border-slate-700/50">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                        <div className="space-y-1.5">
                                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Título de la Lección</label>
                                                            <input type="text" value={lesson.title} onChange={e => updateLesson(lesson.id, "title", e.target.value)}
                                                                className="w-full border border-slate-200 bg-slate-50 px-4 py-3 rounded-xl text-sm font-medium text-slate-800 outline-none focus:border-indigo-500 transition-all" />
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                                                <LinkIcon size={10} className="text-indigo-400" /> URL del Video
                                                            </label>
                                                            <input type="url" value={lesson.videoUrl || ""} onChange={e => updateLesson(lesson.id, "videoUrl", e.target.value)}
                                                                placeholder="https://youtube.com/watch?v=... · vimeo.com/..."
                                                                className="w-full border border-slate-200 bg-slate-50 px-4 py-3 rounded-xl text-sm font-medium text-slate-800 outline-none focus:border-indigo-500 transition-all" />
                                                        </div>
                                                    </div>

                                                    {lesson.videoUrl && (
                                                        <VideoPreview url={lesson.videoUrl} />
                                                    )}

                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Notas / Contenido</label>
                                                        <textarea value={lesson.content || ""} onChange={e => updateLesson(lesson.id, "content", e.target.value)}
                                                            rows={5} placeholder="Descripción, notas, recursos adicionales de la lección..."
                                                            className="w-full border border-slate-200 bg-slate-50 px-4 py-3 rounded-xl text-sm font-medium text-slate-800 outline-none focus:border-indigo-500 transition-all resize-none font-mono" />
                                                    </div>

                                                    <div className="flex justify-end">
                                                        <button onClick={() => saveLesson(lesson)} disabled={savingLessonId === lesson.id}
                                                            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all disabled:opacity-50">
                                                            <Save size={14} /> {savingLessonId === lesson.id ? "Guardando..." : "Guardar Lección"}
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
