"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import {
    BookOpen, PlayCircle, Users, Search, GraduationCap, Star,
    Plus, Edit3, Trash2, Globe, EyeOff, ChevronRight, X,
    Save, AlertCircle, CheckCircle, BarChart2, Layers, RefreshCw,
    Filter, BookMarked, TrendingUp
} from "lucide-react"

interface Course {
    id: string
    title: string
    slug: string
    description: string | null
    imageUrl: string | null
    published: boolean
    categoryId: string
    category: { id: string; name: string; slug: string }
    _count: { lessons: number; enrollments: number }
    createdAt: string
}

interface Category {
    id: string
    name: string
    slug: string
    _count: { courses: number }
}

export default function AcademyAdminPage() {
    const { data: session } = useSession()
    const isAdmin = session?.user?.role === "ADMIN" || session?.user?.role === "MANAGEMENT"

    const [courses, setCourses] = useState<Course[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [totalEnrollments, setTotalEnrollments] = useState(0)
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [filterCat, setFilterCat] = useState("")
    const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft">("all")
    const [showCreate, setShowCreate] = useState(false)
    const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null)
    const [newCourse, setNewCourse] = useState({ title: "", description: "", categoryId: "", imageUrl: "", published: false })
    const [saving, setSaving] = useState(false)
    const [deletingId, setDeletingId] = useState<string | null>(null)

    const showToast = (type: "ok" | "err", msg: string) => {
        setToast({ type, msg })
        setTimeout(() => setToast(null), 3500)
    }

    const loadData = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/admin/academy/courses")
            const data = await res.json()
            setCourses(data.courses || [])
            setCategories(data.categories || [])
            setTotalEnrollments(data.totalEnrollments || 0)
        } catch {
            showToast("err", "Error cargando la academia")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { loadData() }, [])

    const handleCreate = async () => {
        if (!newCourse.title.trim() || !newCourse.categoryId) {
            showToast("err", "Título y categoría son obligatorios")
            return
        }
        setSaving(true)
        try {
            const res = await fetch("/api/admin/academy/courses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newCourse)
            })
            const data = await res.json()
            if (!res.ok) throw new Error()
            setCourses(prev => [data.course, ...prev])
            setNewCourse({ title: "", description: "", categoryId: "", imageUrl: "", published: false })
            setShowCreate(false)
            showToast("ok", "Curso creado — ahora añade lecciones")
        } catch {
            showToast("err", "Error creando el curso")
        } finally {
            setSaving(false)
        }
    }

    const handleTogglePublish = async (course: Course) => {
        const next = !course.published
        setCourses(prev => prev.map(c => c.id === course.id ? { ...c, published: next } : c))
        try {
            await fetch(`/api/academy/courses/${course.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ published: next })
            })
            showToast("ok", next ? `"${course.title}" publicado` : `"${course.title}" archivado`)
        } catch {
            setCourses(prev => prev.map(c => c.id === course.id ? { ...c, published: !next } : c))
            showToast("err", "Error al cambiar estado")
        }
    }

    const handleDelete = async (course: Course) => {
        if (!confirm(`¿Eliminar "${course.title}"? Esta acción es irreversible.`)) return
        setDeletingId(course.id)
        try {
            await fetch(`/api/academy/courses/${course.id}`, { method: "DELETE" })
            setCourses(prev => prev.filter(c => c.id !== course.id))
            showToast("ok", "Curso eliminado")
        } catch {
            showToast("err", "Error al eliminar")
        } finally {
            setDeletingId(null)
        }
    }

    const filtered = courses.filter(c => {
        const matchSearch = c.title.toLowerCase().includes(search.toLowerCase())
        const matchCat = !filterCat || c.categoryId === filterCat
        const matchStatus = filterStatus === "all" || (filterStatus === "published" ? c.published : !c.published)
        return matchSearch && matchCat && matchStatus
    })

    const totalLessons = courses.reduce((a, c) => a + c._count.lessons, 0)
    const publishedCount = courses.filter(c => c.published).length
    const emptyCourses = courses.filter(c => c._count.lessons === 0).length

    const stats = [
        { label: "Cursos Totales", value: courses.length, icon: BookOpen, color: "text-indigo-500", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
        { label: "Publicados", value: publishedCount, icon: Globe, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
        { label: "Lecciones", value: totalLessons, icon: PlayCircle, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
        { label: "Matriculados", value: totalEnrollments, icon: Users, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20" },
        { label: "Sin Contenido", value: emptyCourses, icon: AlertCircle, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    ]

    return (
        <div className="space-y-8 pb-20 animate-in fade-in duration-500">
            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                        className={`fixed top-6 right-6 z-[200] flex items-center gap-3 px-6 py-4 rounded-xl text-sm font-bold shadow-2xl border ${toast.type === "ok" ? "bg-emerald-950 border-emerald-500/30 text-emerald-400" : "bg-red-950 border-red-500/30 text-red-400"}`}
                    >
                        {toast.type === "ok" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                        {toast.msg}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-900/50 backdrop-blur-xl border-slate-700/50 border border-slate-200 rounded-2xl p-6 shadow-[0_4px_15px_rgba(0,0,0,0.3)]">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center">
                        <GraduationCap size={24} className="text-indigo-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Academia Atomic</h1>
                        <p className="text-xs text-slate-500 font-medium mt-0.5 uppercase tracking-widest">Panel de Gestión de Contenido Educativo</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={loadData} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all">
                        <RefreshCw size={16} />
                    </button>
                    {isAdmin && (
                        <button
                            onClick={() => setShowCreate(true)}
                            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-[0_4px_15px_rgba(0,0,0,0.3)] shadow-indigo-500/20"
                        >
                            <Plus size={16} /> Nuevo Curso
                        </button>
                    )}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {stats.map((s, i) => (
                    <div key={i} className={`bg-slate-900/50 backdrop-blur-xl border-slate-700/50 border ${s.border} rounded-2xl p-5 shadow-[0_4px_15px_rgba(0,0,0,0.3)] flex items-center gap-4`}>
                        <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                            <s.icon size={18} className={s.color} />
                        </div>
                        <div>
                            <p className="text-2xl font-black text-slate-900">{s.value}</p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{s.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create Course Modal */}
            <AnimatePresence>
                {showCreate && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6"
                        onClick={(e) => { if (e.target === e.currentTarget) setShowCreate(false) }}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                            className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl p-8 space-y-6"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-black text-slate-900">Crear Nuevo Curso</h2>
                                    <p className="text-xs text-slate-500 mt-1 font-medium">Completa los datos básicos. Podrás añadir lecciones después.</p>
                                </div>
                                <button onClick={() => setShowCreate(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"><X size={18} /></button>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Título del Curso *</label>
                                    <input
                                        type="text" value={newCourse.title}
                                        onChange={e => setNewCourse(p => ({ ...p, title: e.target.value }))}
                                        placeholder="Ej: Fundamentos de Redes Cisco"
                                        className="w-full border border-slate-200 bg-slate-50 px-4 py-3 rounded-xl text-sm font-medium text-slate-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Categoría *</label>
                                        <select
                                            value={newCourse.categoryId}
                                            onChange={e => setNewCourse(p => ({ ...p, categoryId: e.target.value }))}
                                            className="w-full border border-slate-200 bg-slate-50 px-4 py-3 rounded-xl text-sm font-medium text-slate-800 outline-none focus:border-indigo-500 transition-all appearance-none"
                                        >
                                            <option value="">Seleccionar categoría...</option>
                                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Imagen (URL)</label>
                                        <input
                                            type="url" value={newCourse.imageUrl}
                                            onChange={e => setNewCourse(p => ({ ...p, imageUrl: e.target.value }))}
                                            placeholder="https://..."
                                            className="w-full border border-slate-200 bg-slate-50 px-4 py-3 rounded-xl text-sm font-medium text-slate-800 outline-none focus:border-indigo-500 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Descripción</label>
                                    <textarea
                                        value={newCourse.description}
                                        onChange={e => setNewCourse(p => ({ ...p, description: e.target.value }))}
                                        rows={3} placeholder="¿Qué aprenderán los estudiantes?"
                                        className="w-full border border-slate-200 bg-slate-50 px-4 py-3 rounded-xl text-sm font-medium text-slate-800 outline-none focus:border-indigo-500 transition-all resize-none"
                                    />
                                </div>

                                <label className="flex items-center gap-3 cursor-pointer p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
                                    <input type="checkbox" checked={newCourse.published} onChange={e => setNewCourse(p => ({ ...p, published: e.target.checked }))} className="w-4 h-4 accent-indigo-600 rounded" />
                                    <div>
                                        <p className="text-sm font-bold text-slate-700">Publicar inmediatamente</p>
                                        <p className="text-xs text-slate-500">El curso será visible para todos los usuarios</p>
                                    </div>
                                </label>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button onClick={() => setShowCreate(false)} className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all">Cancelar</button>
                                <button
                                    onClick={handleCreate} disabled={saving}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all disabled:opacity-50"
                                >
                                    <Save size={15} /> {saving ? "Creando..." : "Crear Curso"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Filters & Search */}
            <div className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 border border-slate-200 rounded-2xl p-4 shadow-[0_4px_15px_rgba(0,0,0,0.3)] flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text" value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Buscar cursos..."
                        className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 outline-none focus:border-indigo-500 transition-all"
                    />
                </div>
                <select
                    value={filterCat} onChange={e => setFilterCat(e.target.value)}
                    className="bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-600 outline-none focus:border-indigo-500 transition-all appearance-none"
                >
                    <option value="">Todas las categorías</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name} ({c._count.courses})</option>)}
                </select>
                <div className="flex rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
                    {(["all", "published", "draft"] as const).map(s => (
                        <button key={s} onClick={() => setFilterStatus(s)}
                            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all ${filterStatus === s ? "bg-indigo-600 text-white" : "text-slate-500 hover:text-slate-700"}`}
                        >
                            {s === "all" ? "Todos" : s === "published" ? "Publicados" : "Borradores"}
                        </button>
                    ))}
                </div>
            </div>

            {/* Courses Table */}
            <div className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 border border-slate-200 rounded-2xl shadow-[0_4px_15px_rgba(0,0,0,0.3)] overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-sm font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
                        <BookMarked size={16} className="text-indigo-500" /> Catálogo de Cursos
                        <span className="bg-slate-100 text-slate-500 text-xs font-bold px-2.5 py-1 rounded-full">{filtered.length}</span>
                    </h2>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20 gap-4">
                        <div className="w-8 h-8 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin" />
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Cargando...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20">
                        <BookOpen size={48} className="text-slate-200 mx-auto mb-4" />
                        <p className="text-lg font-black text-slate-400">No se encontraron cursos</p>
                        <p className="text-sm text-slate-400 mt-1">Prueba con otros filtros o crea un nuevo curso</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                    <th className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Curso</th>
                                    <th className="text-left px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Categoría</th>
                                    <th className="text-center px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Lecciones</th>
                                    <th className="text-center px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Alumnos</th>
                                    <th className="text-center px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado</th>
                                    <th className="text-right px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filtered.map(course => (
                                    <tr key={course.id} className="hover:bg-slate-50/60 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0">
                                                    {course.imageUrl ? (
                                                        <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center"><GraduationCap size={20} className="text-slate-300" /></div>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-black text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">{course.title}</p>
                                                    <p className="text-xs text-slate-400 font-medium mt-0.5 line-clamp-1">{course.description || "Sin descripción"}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="inline-flex items-center px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold">{course.category?.name}</span>
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            <span className={`inline-flex items-center gap-1.5 text-sm font-black ${course._count.lessons === 0 ? "text-amber-500" : "text-slate-700"}`}>
                                                {course._count.lessons === 0 && <AlertCircle size={12} />}
                                                {course._count.lessons}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            <span className="text-sm font-black text-slate-700">{course._count.enrollments}</span>
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            <button onClick={() => handleTogglePublish(course)} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${course.published ? "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100" : "bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100"}`}>
                                                {course.published ? <><Globe size={11} /> Publicado</> : <><EyeOff size={11} /> Borrador</>}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`/dashboard/academy/course/${course.id}`} className="flex items-center gap-1.5 px-3 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg text-xs font-bold transition-all">
                                                    <Edit3 size={13} /> Editar
                                                </Link>
                                                {isAdmin && (
                                                    <button
                                                        onClick={() => handleDelete(course)}
                                                        disabled={deletingId === course.id}
                                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Empty courses alert */}
            {emptyCourses > 0 && !loading && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4">
                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <AlertCircle size={20} className="text-amber-600" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-black text-amber-800">{emptyCourses} cursos sin lecciones</p>
                        <p className="text-xs text-amber-600 font-medium mt-1">Estos cursos están vacíos. Haz clic en "Editar" para agregar lecciones y contenido.</p>
                    </div>
                </div>
            )}
        </div>
    )
}
