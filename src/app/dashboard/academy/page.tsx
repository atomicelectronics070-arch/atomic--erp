"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { 
    BookOpen, PlayCircle, Users, Clock, Search, Layers, 
    ChevronRight, Zap, GraduationCap, Star, Settings, 
    Plus, Edit3, Trash2, Eye, ShieldCheck 
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useSession } from "next-auth/react"

interface Course {
    id: string
    title: string
    slug: string
    description: string | null
    imageUrl: string | null
    published: boolean
    _count: { lessons: number; enrollments: number }
}

interface Category {
    id: string
    name: string
    slug: string
    description: string | null
    courses: Course[]
}

const CATEGORY_ICONS: Record<string, string> = {
    "electronica-placas": "🔌",
    "arquitectura-redes": "🌐",
    "programacion": "💻",
    "cyber-seguridad": "🛡️",
    "frontend-dev": "🎨",
    "ventas-online": "🛒",
}

export default function UnifiedAcademyPortal() {
    const { data: session } = useSession()
    const isAdmin = session?.user?.role === "ADMIN" || session?.user?.role === "MANAGEMENT"
    
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [activeCategory, setActiveCategory] = useState<string | null>(null)

    useEffect(() => {
        fetch("/api/public/academy/courses")
            .then(r => r.json())
            .then(data => {
                setCategories(data.categories || [])
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [])

    const totalCourses = categories.reduce((acc, c) => acc + c.courses.length, 0)
    const totalLessons = categories.reduce((acc, c) =>
        acc + c.courses.reduce((a, co) => a + co._count.lessons, 0), 0)

    const filteredCategories = categories
        .map(cat => ({
            ...cat,
            courses: cat.courses.filter(co =>
                co.title.toLowerCase().includes(search.toLowerCase()) ||
                co.description?.toLowerCase().includes(search.toLowerCase())
            )
        }))
        .filter(cat =>
            (activeCategory === null || cat.slug === activeCategory) &&
            cat.courses.length > 0
        )

    return (
        <div className="pb-32 space-y-12 animate-in fade-in duration-500 font-sans">
            {/* HERO SECTION */}
            <section className="bg-white border-b border-slate-200 py-12 px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-6xl mx-auto"
                >
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                        <div>
                            <h1 className="text-4xl font-black text-[#0F172A] flex items-center gap-3">
                                <GraduationCap className="text-indigo-600" size={40} /> Academia Atomic
                            </h1>
                            <p className="text-base text-slate-500 font-medium mt-3 max-w-2xl">
                                Portal educativo unificado. Capacitación continua en ventas, procesos técnicos y herramientas corporativas.
                            </p>
                        </div>

                        {isAdmin && (
                            <div className="flex gap-4">
                                <Link href="/dashboard/academy/admin" className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
                                    <Settings size={18} /> Panel de Control
                                </Link>
                                <Link href="/dashboard/academy/course/new" className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-sm">
                                    <Plus size={18} /> Crear Curso
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-6 mt-12">
                        {[
                            { label: "Cursos Activos", value: totalCourses, icon: BookOpen, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
                            { label: "Lecciones", value: totalLessons, icon: PlayCircle, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
                            { label: "Estado", value: "En Línea", icon: ShieldCheck, color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100" },
                        ].map((s, i) => (
                            <div key={i} className={`flex items-center gap-4 ${s.bg} border ${s.border} px-6 py-4 rounded-2xl shadow-sm min-w-[200px]`}>
                                <div className={`w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm ${s.color}`}>
                                    <s.icon size={24} />
                                </div>
                                <div>
                                    <p className="text-2xl font-black text-[#0F172A]">{s.value}</p>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{s.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </section>

            <div className="max-w-6xl mx-auto px-8 space-y-12">
                {/* SEARCH & CATEGORIES */}
                <section className="flex flex-col lg:flex-row gap-6 items-center justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="relative w-full lg:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar en la academia..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 py-3 pl-12 pr-4 text-sm font-medium text-[#0F172A] rounded-xl outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
                        />
                    </div>
                    <div className="flex flex-wrap gap-2 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 hide-scrollbar">
                        <button
                            onClick={() => setActiveCategory(null)}
                            className={`px-5 py-2.5 text-sm font-bold rounded-xl transition-all whitespace-nowrap ${
                                activeCategory === null ? "bg-indigo-600 text-white shadow-sm" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                            }`}
                        >
                            Todos los Cursos
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.slug === activeCategory ? null : cat.slug)}
                                className={`px-5 py-2.5 text-sm font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
                                    activeCategory === cat.slug ? "bg-indigo-600 text-white shadow-sm" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                                }`}
                            >
                                <span>{CATEGORY_ICONS[cat.slug] || "📚"}</span>
                                <span>{cat.name}</span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* COURSES GRID */}
                <section className="space-y-16">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32 gap-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
                            <div className="w-12 h-12 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin" />
                            <p className="text-sm font-bold uppercase tracking-wider text-slate-500">Cargando Academia...</p>
                        </div>
                    ) : filteredCategories.map((cat) => (
                        <div key={cat.id} className="space-y-6">
                            <div className="flex items-center gap-4 border-b border-slate-200 pb-4">
                                <h2 className="text-2xl font-black text-[#0F172A] flex items-center gap-3">
                                    <span className="text-3xl">{CATEGORY_ICONS[cat.slug] || "📚"}</span>
                                    {cat.name}
                                </h2>
                                <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{cat.courses.length} Cursos</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {cat.courses.map(course => (
                                    <div key={course.id} className="group bg-white border border-slate-200 rounded-2xl hover:border-indigo-300 transition-all duration-300 overflow-hidden flex flex-col shadow-sm hover:shadow-md">
                                        {/* Thumbnail */}
                                        <div className="relative h-48 overflow-hidden bg-slate-100 border-b border-slate-100">
                                            {course.imageUrl ? (
                                                <img src={course.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={course.title} />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                    <GraduationCap size={48} />
                                                </div>
                                            )}
                                            
                                            {isAdmin && (
                                                <div className="absolute top-4 left-4">
                                                    <span className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md shadow-sm backdrop-blur-md ${course.published ? 'bg-emerald-500/90 text-white' : 'bg-amber-500/90 text-white'}`}>
                                                        {course.published ? 'Público' : 'Borrador'}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                                            <div>
                                                <h3 className="text-lg font-black text-[#0F172A] group-hover:text-indigo-600 transition-colors leading-tight mb-2 line-clamp-2">{course.title}</h3>
                                                <p className="text-sm text-slate-500 font-medium line-clamp-2">{course.description}</p>
                                            </div>

                                            <div className="space-y-6">
                                                <div className="flex items-center gap-4 text-sm font-bold text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                                    <div className="flex items-center gap-1.5">
                                                        <PlayCircle size={16} className="text-indigo-500" />
                                                        {course._count.lessons} Lecciones
                                                    </div>
                                                    {isAdmin && (
                                                        <div className="flex items-center gap-1.5">
                                                            <Users size={16} className="text-blue-500" />
                                                            {course._count.enrollments} Alumnos
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <Link href={`/academy/${course.slug}`} className="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-sm font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors">
                                                        Tomar Curso <ChevronRight size={16} />
                                                    </Link>
                                                    
                                                    {isAdmin && (
                                                        <Link href={`/dashboard/academy/course/${course.id}`} className="p-2.5 ml-2 bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 rounded-xl transition-all shadow-sm">
                                                            <Edit3 size={18} />
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    {filteredCategories.length === 0 && !loading && (
                        <div className="py-20 text-center bg-white border border-slate-200 rounded-2xl shadow-sm">
                            <BookOpen size={48} className="text-slate-300 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-[#0F172A]">No se encontraron cursos</h3>
                            <p className="text-slate-500 mt-2">Intenta con otro término de búsqueda o selecciona otra categoría.</p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    )
}
