"use client"

import { useState, useEffect } from "react"
import { BookOpen, Plus, PlayCircle, Layers, ChevronRight, Save, Trash2, Edit3, Globe, Lock, GraduationCap } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function AcademyAdminPage() {
    const [categories, setCategories] = useState<any[]>([])
    const [courses, setCourses] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    
    const [activeTab, setActiveTab] = useState<"CATEGORIES" | "COURSES">("COURSES")
    
    // Modal/Form States
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
    const [isCourseModalOpen, setIsCourseModalOpen] = useState(false)
    
    const [catForm, setCatForm] = useState({ name: "", slug: "", description: "", image: "" })
    const [courseForm, setCourseForm] = useState({ title: "", slug: "", description: "", imageUrl: "", categoryId: "", published: false })

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setLoading(true)
        try {
            const [catRes, courseRes] = await Promise.all([
                fetch("/api/admin/academy/categories"),
                fetch("/api/admin/academy/courses")
            ])
            const cats = await catRes.json()
            const crs = await courseRes.json()
            setCategories(cats)
            setCourses(crs)
        } catch (e) {
            console.error("Error fetching academy data", e)
        } finally {
            setLoading(false)
        }
    }

    const handleCreateCategory = async () => {
        if (!catForm.name || !catForm.slug) return
        try {
            const res = await fetch("/api/admin/academy/categories", {
                method: "POST",
                body: JSON.stringify(catForm)
            })
            if (res.ok) {
                fetchData()
                setIsCategoryModalOpen(false)
                setCatForm({ name: "", slug: "", description: "", image: "" })
            }
        } catch (e) { console.error(e) }
    }

    const handleCreateCourse = async () => {
        if (!courseForm.title || !courseForm.slug || !courseForm.categoryId) return
        try {
            const res = await fetch("/api/admin/academy/courses", {
                method: "POST",
                body: JSON.stringify(courseForm)
            })
            if (res.ok) {
                fetchData()
                setIsCourseModalOpen(false)
                setCourseForm({ title: "", slug: "", description: "", imageUrl: "", categoryId: "", published: false })
            }
        } catch (e) { console.error(e) }
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-white/5 pb-10">
                <div>
                    <div className="flex items-center gap-3 text-[#E8341A] mb-4">
                        <GraduationCap size={20} />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em]">Gestión de Conocimiento</span>
                    </div>
                    <h1 className="text-5xl font-black text-white uppercase tracking-tighter italic leading-none">
                        CENTRO <span className="text-[#E8341A]">ACADÉMICO.</span>
                    </h1>
                    <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.3em] mt-4">Administración de módulos de especialización y mallas curriculares</p>
                </div>
                
                <div className="flex gap-4">
                    <button 
                        onClick={() => setIsCategoryModalOpen(true)}
                        className="px-6 py-4 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3"
                    >
                        <Layers size={16} /> Nueva Categoría
                    </button>
                    <button 
                        onClick={() => setIsCourseModalOpen(true)}
                        className="px-8 py-4 bg-[#E8341A] text-white text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-[#E8341A]/20 flex items-center gap-3"
                    >
                        <Plus size={16} /> Crear Curso
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-10 border-b border-white/5 pb-4">
                <button 
                    onClick={() => setActiveTab("COURSES")}
                    className={`text-[10px] font-black uppercase tracking-[0.4em] pb-4 transition-all ${activeTab === "COURSES" ? "text-[#E8341A] border-b-2 border-[#E8341A]" : "text-white/30 hover:text-white"}`}
                >
                    Módulos y Cursos ({courses.length})
                </button>
                <button 
                    onClick={() => setActiveTab("CATEGORIES")}
                    className={`text-[10px] font-black uppercase tracking-[0.4em] pb-4 transition-all ${activeTab === "CATEGORIES" ? "text-[#E8341A] border-b-2 border-[#E8341A]" : "text-white/30 hover:text-white"}`}
                >
                    Categorías ({categories.length})
                </button>
            </div>

            {/* List Content */}
            <div className="grid grid-cols-1 gap-6">
                {loading ? (
                    <div className="py-20 text-center animate-pulse">
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-widest italic">Sincronizando Malla Curricular...</p>
                    </div>
                ) : (
                    <>
                        {activeTab === "COURSES" ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {courses.map(course => (
                                    <div key={course.id} className="bg-slate-900/30 border border-white/5 p-8 flex flex-col md:flex-row gap-8 group hover:border-[#E8341A]/30 transition-all">
                                        <div className="w-full md:w-40 h-32 bg-black flex items-center justify-center relative overflow-hidden shrink-0">
                                            {course.imageUrl && <img src={course.imageUrl} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-1000" />}
                                            <PlayCircle size={32} className="text-[#E8341A] opacity-20 group-hover:opacity-100 transition-opacity relative z-10" />
                                        </div>
                                        <div className="flex-1 flex flex-col">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <span className="text-[8px] font-black text-[#E8341A] uppercase tracking-[0.4em]">{course.category.name}</span>
                                                    <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">{course.title}</h3>
                                                </div>
                                                <div className={`px-3 py-1 text-[7px] font-black uppercase tracking-widest border ${course.published ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-white/5 text-white/30 border-white/10"}`}>
                                                    {course.published ? "Publicado" : "Borrador"}
                                                </div>
                                            </div>
                                            <p className="text-white/20 text-[9px] font-medium uppercase tracking-widest mt-4 line-clamp-2">{course.description || "Sin descripción de especialidad."}</p>
                                            <div className="mt-auto pt-6 flex justify-between items-center border-t border-white/5">
                                                <div className="flex items-center gap-4 text-[8px] font-black text-white/30 uppercase tracking-widest">
                                                    <span>{course._count.lessons} Lecciones</span>
                                                </div>
                                                <a href={`/dashboard/admin/academy/course/${course.id}`} className="px-5 py-2 bg-white/5 text-white text-[8px] font-black uppercase tracking-widest hover:bg-[#E8341A] transition-all flex items-center gap-2">
                                                    Gestionar Malla <ChevronRight size={12} />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {categories.map(cat => (
                                    <div key={cat.id} className="bg-slate-900/30 border border-white/5 p-8 group hover:border-[#E8341A]/30 transition-all">
                                        <h3 className="text-xl font-black text-white uppercase tracking-tighter italic mb-4">{cat.name}</h3>
                                        <p className="text-white/30 text-[9px] font-medium uppercase tracking-widest mb-6 h-12 line-clamp-3">{cat.description || "Área temática sin detalles."}</p>
                                        <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-white/20 pt-6 border-t border-white/5">
                                            <span>{cat._count.courses} Cursos</span>
                                            <button className="text-[#E8341A] hover:text-white transition-colors flex items-center gap-2">
                                                Editar <Edit3 size={12} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Category Modal */}
            <AnimatePresence>
                {isCategoryModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCategoryModalOpen(false)} className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="w-full max-w-lg bg-slate-950 border border-white/10 p-12 relative z-10">
                            <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic mb-8">Nueva <span className="text-[#E8341A]">Categoría</span></h2>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-white/30 uppercase tracking-widest ml-1">Nombre</label>
                                    <input value={catForm.name} onChange={(e) => setCatForm({...catForm, name: e.target.value})} placeholder="Seguridad Electrónica" className="w-full bg-white/5 border border-white/10 p-4 text-white text-[11px] font-black uppercase tracking-widest focus:border-[#E8341A] outline-none transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-white/30 uppercase tracking-widest ml-1">Slug (URL)</label>
                                    <input value={catForm.slug} onChange={(e) => setCatForm({...catForm, slug: e.target.value})} placeholder="seguridad-electronica" className="w-full bg-white/5 border border-white/10 p-4 text-white text-[11px] font-black uppercase tracking-widest focus:border-[#E8341A] outline-none transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-white/30 uppercase tracking-widest ml-1">Descripción</label>
                                    <textarea value={catForm.description} onChange={(e) => setCatForm({...catForm, description: e.target.value})} rows={3} placeholder="Módulos enfocados en infraestructura de seguridad..." className="w-full bg-white/5 border border-white/10 p-4 text-white text-[11px] font-black uppercase tracking-widest focus:border-[#E8341A] outline-none transition-all resize-none" />
                                </div>
                                <button onClick={handleCreateCategory} className="w-full py-5 bg-[#E8341A] text-white font-black text-[10px] uppercase tracking-[0.4em] hover:bg-white hover:text-[#0F1923] transition-all">Guardar Categoría</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Course Modal */}
            <AnimatePresence>
                {isCourseModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCourseModalOpen(false)} className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="w-full max-w-2xl bg-slate-950 border border-white/10 p-12 relative z-10">
                            <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic mb-8">Configurar <span className="text-[#E8341A]">Nuevo Curso</span></h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-white/30 uppercase tracking-widest ml-1">Título del Curso</label>
                                        <input value={courseForm.title} onChange={(e) => setCourseForm({...courseForm, title: e.target.value})} placeholder="Instalación de Cámaras IP" className="w-full bg-white/5 border border-white/10 p-4 text-white text-[11px] font-black uppercase tracking-widest focus:border-[#E8341A] outline-none transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-white/30 uppercase tracking-widest ml-1">Slug (URL)</label>
                                        <input value={courseForm.slug} onChange={(e) => setCourseForm({...courseForm, slug: e.target.value})} placeholder="instalacion-camaras-ip" className="w-full bg-white/5 border border-white/10 p-4 text-white text-[11px] font-black uppercase tracking-widest focus:border-[#E8341A] outline-none transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-white/30 uppercase tracking-widest ml-1">Categoría</label>
                                        <select value={courseForm.categoryId} onChange={(e) => setCourseForm({...courseForm, categoryId: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 text-white text-[11px] font-black uppercase tracking-widest focus:border-[#E8341A] outline-none transition-all appearance-none cursor-pointer">
                                            <option value="" className="bg-slate-900">Seleccionar Área</option>
                                            {categories.map(cat => <option key={cat.id} value={cat.id} className="bg-slate-900">{cat.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-white/30 uppercase tracking-widest ml-1">Imagen URL</label>
                                        <input value={courseForm.imageUrl} onChange={(e) => setCourseForm({...courseForm, imageUrl: e.target.value})} placeholder="https://..." className="w-full bg-white/5 border border-white/10 p-4 text-white text-[11px] font-black uppercase tracking-widest focus:border-[#E8341A] outline-none transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-white/30 uppercase tracking-widest ml-1">Descripción</label>
                                        <textarea value={courseForm.description} onChange={(e) => setCourseForm({...courseForm, description: e.target.value})} rows={4} placeholder="Detalles del módulo formativo..." className="w-full bg-white/5 border border-white/10 p-4 text-white text-[11px] font-black uppercase tracking-widest focus:border-[#E8341A] outline-none transition-all resize-none" />
                                    </div>
                                    <div className="flex items-center gap-4 py-2">
                                        <input type="checkbox" checked={courseForm.published} onChange={(e) => setCourseForm({...courseForm, published: e.target.checked})} className="w-5 h-5 accent-[#E8341A]" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white">Publicar Inmediatamente</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={handleCreateCourse} className="w-full py-6 mt-10 bg-[#E8341A] text-white font-black text-[11px] uppercase tracking-[0.5em] hover:bg-white hover:text-[#0F1923] transition-all">Registrar Especialidad</button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
