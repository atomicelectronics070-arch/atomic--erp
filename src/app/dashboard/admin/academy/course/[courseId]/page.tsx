"use client"

import { use, useState, useEffect } from "react"
import { PlayCircle, Plus, Save, ChevronLeft, GripVertical, Edit3, Trash2, Globe, Lock, BookOpen } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

export default function CourseLessonsAdmin({ params: paramsPromise }: { params: Promise<{ courseId: string }> }) {
    const params = use(paramsPromise)
    const [course, setCourse] = useState<any>(null)
    const [lessons, setLessons] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    
    const [isLessonModalOpen, setIsLessonModalOpen] = useState(false)
    const [editingLesson, setEditingLesson] = useState<any>(null)
    const [lessonForm, setLessonForm] = useState({ title: "", slug: "", content: "", videoUrl: "", quizData: "", order: 0 })

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setLoading(true)
        try {
            const [courseRes, lessonsRes] = await Promise.all([
                fetch(`/api/admin/academy/courses`),
                fetch(`/api/admin/academy/lessons?courseId=${params.courseId}`)
            ])
            const allCourses = await courseRes.json()
            const crs = allCourses.find((c: any) => c.id === params.courseId)
            const lss = await lessonsRes.json()
            
            setCourse(crs)
            setLessons(lss)
        } catch (e) { console.error(e) }
        finally { setLoading(false) }
    }

    const handleSaveLesson = async () => {
        if (!lessonForm.title || !lessonForm.slug) return
        const method = editingLesson ? "PUT" : "POST"
        const body = editingLesson ? { ...lessonForm, id: editingLesson.id } : { ...lessonForm, courseId: params.courseId }
        
        try {
            const res = await fetch("/api/admin/academy/lessons", {
                method,
                body: JSON.stringify(body)
            })
            if (res.ok) {
                fetchData()
                setIsLessonModalOpen(false)
                setEditingLesson(null)
                setLessonForm({ title: "", slug: "", content: "", videoUrl: "", quizData: "", order: 0 })
            }
        } catch (e) { console.error(e) }
    }

    const openEdit = (lesson: any) => {
        setEditingLesson(lesson)
        setLessonForm({
            title: lesson.title,
            slug: lesson.slug,
            content: lesson.content || "",
            videoUrl: lesson.videoUrl || "",
            quizData: lesson.quizData || "",
            order: lesson.order || 0
        })
        setIsLessonModalOpen(true)
    }

    if (!course && !loading) return <div className="p-20 text-center text-white/30">Módulo no encontrado.</div>

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-white/5 pb-10">
                <div className="space-y-6">
                    <Link href="/dashboard/admin/academy" className="text-[10px] font-black uppercase tracking-[0.4em] text-[#E8341A] hover:text-white transition-all flex items-center gap-3">
                        <ChevronLeft size={16} /> Volver al Hub
                    </Link>
                    <div>
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] block mb-2">{course?.category?.name}</span>
                        <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic leading-none">
                            {course?.title}
                        </h1>
                    </div>
                </div>
                
                <button 
                    onClick={() => { setEditingLesson(null); setLessonForm({ title: "", slug: "", content: "", videoUrl: "", quizData: "", order: lessons.length }); setIsLessonModalOpen(true); }}
                    className="px-10 py-5 bg-[#E8341A] text-white text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-[#E8341A]/20 flex items-center gap-4 skew-x-[-10deg]"
                >
                    <div className="skew-x-[10deg] flex items-center gap-3">
                        <Plus size={18} /> Añadir Lección
                    </div>
                </button>
            </div>

            {/* Lessons List */}
            <div className="grid grid-cols-1 gap-4">
                {lessons.length > 0 ? lessons.map((lesson, index) => (
                    <div key={lesson.id} className="bg-slate-900/30 border border-white/5 p-8 flex items-center gap-8 group hover:border-[#E8341A]/30 transition-all">
                        <div className="text-4xl font-black text-white/5 italic group-hover:text-[#E8341A]/20 transition-colors w-12">
                            {index + 1}
                        </div>
                        <div className="flex-1">
                            <h4 className="text-lg font-black text-white uppercase tracking-tighter italic">{lesson.title}</h4>
                            <div className="flex items-center gap-6 mt-2">
                                <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Slug: {lesson.slug}</span>
                                {lesson.videoUrl && <span className="flex items-center gap-2 text-[8px] font-black text-emerald-500 uppercase tracking-widest"><PlayCircle size={12} /> Video Vinculado</span>}
                            </div>
                        </div>
                        <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openEdit(lesson)} className="p-3 bg-white/5 text-white hover:bg-[#E8341A] transition-all">
                                <Edit3 size={18} />
                            </button>
                            <button className="p-3 bg-white/5 text-white/30 hover:text-red-500 transition-all">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                )) : (
                    <div className="py-32 text-center border-2 border-dashed border-white/5">
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-widest italic">Este curso aún no tiene lecciones configuradas.</p>
                    </div>
                )}
            </div>

            {/* Lesson Modal */}
            <AnimatePresence>
                {isLessonModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsLessonModalOpen(false)} className="absolute inset-0 bg-black/95 backdrop-blur-md" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="w-full max-w-5xl bg-slate-950 border border-white/10 flex flex-col max-h-[90vh] relative z-10 overflow-hidden shadow-[0_0_100px_rgba(232,52,26,0.1)]">
                            <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                                <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">{editingLesson ? "Editar" : "Nueva"} <span className="text-[#E8341A]">Lección</span></h2>
                                <button onClick={() => setIsLessonModalOpen(false)} className="text-white/20 hover:text-white transition-colors uppercase text-[10px] font-black tracking-widest">Cerrar</button>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar-hidden">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                                    <div className="space-y-8">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-white/30 uppercase tracking-widest ml-1">Título de Fase</label>
                                            <input value={lessonForm.title} onChange={(e) => setLessonForm({...lessonForm, title: e.target.value})} placeholder="Fundamentos de Redes" className="w-full bg-white/5 border border-white/10 p-5 text-white text-xs font-black uppercase tracking-widest focus:border-[#E8341A] outline-none transition-all" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-white/30 uppercase tracking-widest ml-1">Slug Académico</label>
                                            <input value={lessonForm.slug} onChange={(e) => setLessonForm({...lessonForm, slug: e.target.value})} placeholder="fundamentos-redes" className="w-full bg-white/5 border border-white/10 p-5 text-white text-xs font-black uppercase tracking-widest focus:border-[#E8341A] outline-none transition-all" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-white/30 uppercase tracking-widest ml-1">URL de Video (YouTube/Vimeo)</label>
                                            <input value={lessonForm.videoUrl} onChange={(e) => setLessonForm({...lessonForm, videoUrl: e.target.value})} placeholder="https://..." className="w-full bg-white/5 border border-white/10 p-5 text-white text-xs font-black uppercase tracking-widest focus:border-[#E8341A] outline-none transition-all" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-white/30 uppercase tracking-widest ml-1">Orden de Visualización</label>
                                            <input type="number" value={lessonForm.order} onChange={(e) => setLessonForm({...lessonForm, order: parseInt(e.target.value)})} className="w-full bg-white/5 border border-white/10 p-5 text-white text-xs font-black uppercase tracking-widest focus:border-[#E8341A] outline-none transition-all" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-white/30 uppercase tracking-widest ml-1">Examen Rápido (JSON)</label>
                                            <textarea 
                                                value={lessonForm.quizData} 
                                                onChange={(e) => setLessonForm({...lessonForm, quizData: e.target.value})} 
                                                rows={8}
                                                placeholder='[{"q": "¿...", "a": ["Op1", "Op2"], "c": 0}]'
                                                className="w-full bg-white/5 border border-white/10 p-5 text-white text-[10px] font-mono focus:border-[#E8341A] outline-none transition-all resize-none" 
                                            />
                                        </div>
                                    </div>
                                    <div className="lg:col-span-2 space-y-4 flex flex-col">
                                        <label className="text-[9px] font-black text-white/30 uppercase tracking-widest ml-1">Contenido de la Lección (HTML / Markdown)</label>
                                        <textarea 
                                            value={lessonForm.content} 
                                            onChange={(e) => setLessonForm({...lessonForm, content: e.target.value})} 
                                            className="flex-1 w-full bg-white/5 border border-white/10 p-8 text-white text-sm font-medium focus:border-[#E8341A] outline-none transition-all resize-none min-h-[400px] font-mono leading-relaxed custom-scrollbar-hidden" 
                                            placeholder="Desarrolla el contenido técnico aquí..." 
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="p-10 border-t border-white/5 bg-white/[0.02]">
                                <button onClick={handleSaveLesson} className="w-full py-6 bg-[#E8341A] text-white font-black text-[12px] uppercase tracking-[0.6em] hover:bg-white hover:text-[#0F1923] transition-all flex items-center justify-center gap-4">
                                    <Save size={20} /> Sincronizar Lección
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
