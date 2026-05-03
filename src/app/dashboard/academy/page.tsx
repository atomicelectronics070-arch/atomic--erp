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
        <div className="pb-32 space-y-20 animate-in fade-in duration-1000">
            {/* HERO SECTION */}
            <section className="relative overflow-hidden border-b border-slate-100 pb-20">
                <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-[#1E3A8A]/5 blur-[120px] pointer-events-none" />
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-10"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-1.5 h-10 bg-[#1E3A8A]"></div>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <Zap size={14} className="text-[#1E3A8A]" />
                                <span className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-400 italic">PORTAL EDUCATIVO UNIFICADO</span>
                            </div>
                            <h1 className="text-7xl md:text-8xl font-black text-[#0F172A] tracking-tighter uppercase italic leading-none">
                                ACADE<span className="text-[#1E3A8A]">MIA</span>
                            </h1>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-12 pt-10">
                        {[
                            { label: "CURSOS", value: totalCourses, icon: BookOpen },
                            { label: "LECCIONES", value: totalLessons, icon: PlayCircle },
                            { label: "NODO", value: "ACTIVO", icon: ShieldCheck },
                        ].map((s, i) => (
                            <div key={i} className="flex items-center gap-4 group">
                                <div className="w-12 h-12 bg-white border border-slate-100 flex items-center justify-center group-hover:border-[#1E3A8A] transition-all shadow-sm">
                                    <s.icon size={20} className="text-[#1E3A8A]" />
                                </div>
                                <div>
                                    <p className="text-3xl font-black text-[#0F172A] italic tracking-tighter leading-none">{s.value}</p>
                                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 italic mt-1">{s.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {isAdmin && (
                        <div className="flex flex-wrap gap-6 pt-10">
                            <Link href="/dashboard/academy/course/new" className="px-10 py-5 bg-[#1E3A8A] text-white text-[10px] font-black uppercase tracking-[0.4em] italic flex items-center gap-4 shadow-xl shadow-[#1E3A8A]/20 hover:scale-105 active:scale-95 transition-all">
                                <Plus size={18} /> CREAR NUEVO CURSO
                            </Link>
                            <Link href="/dashboard/academy/admin" className="px-10 py-5 bg-white border border-slate-200 text-[#0F172A] text-[10px] font-black uppercase tracking-[0.4em] italic flex items-center gap-4 hover:bg-slate-50 transition-all">
                                <Settings size={18} /> PANEL DE CONTROL
                            </Link>
                        </div>
                    )}
                </motion.div>
            </section>

            {/* SEARCH & CATEGORIES */}
            <section className="flex flex-col lg:flex-row gap-8 items-center justify-between">
                <div className="relative w-full lg:w-96 group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#1E3A8A] transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="BUSCAR EN LA ACADEMIA..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full bg-white border border-slate-200 py-5 pl-16 pr-8 text-xs font-black text-[#0F172A] placeholder:text-slate-300 outline-none focus:border-[#1E3A8A] transition-all italic uppercase tracking-widest shadow-sm"
                    />
                </div>
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => setActiveCategory(null)}
                        className={`px-8 py-4 text-[9px] font-black uppercase tracking-widest italic transition-all ${
                            activeCategory === null ? "bg-[#1E3A8A] text-white shadow-lg shadow-[#1E3A8A]/20" : "bg-white text-slate-400 border border-slate-100 hover:text-[#0F172A] hover:bg-slate-50"
                        }`}
                    >
                        TODOS
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.slug === activeCategory ? null : cat.slug)}
                            className={`px-8 py-4 text-[9px] font-black uppercase tracking-widest italic transition-all ${
                                activeCategory === cat.slug ? "bg-[#1E3A8A] text-white shadow-lg shadow-[#1E3A8A]/20" : "bg-white text-slate-400 border border-slate-100 hover:text-[#0F172A] hover:bg-slate-50"
                            }`}
                        >
                            {CATEGORY_ICONS[cat.slug] || "📚"} {cat.name}
                        </button>
                    ))}
                </div>
            </section>

            {/* COURSES GRID */}
            <section className="space-y-24">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-8">
                        <div className="w-16 h-16 border-2 border-slate-100 border-t-[#1E3A8A] animate-spin" />
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 italic animate-pulse">Sincronizando Módulos...</p>
                    </div>
                ) : filteredCategories.map((cat, idx) => (
                    <div key={cat.id} className="space-y-12">
                        <div className="flex items-center gap-6">
                            <div className="w-10 h-[1px] bg-[#1E3A8A]"></div>
                            <h2 className="text-3xl font-black uppercase tracking-tighter text-[#0F172A] italic">{cat.name}</h2>
                            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic">/ {cat.courses.length} CURSOS</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            {cat.courses.map(course => (
                                <div key={course.id} className="group relative bg-white border border-slate-200 hover:border-[#1E3A8A] transition-all duration-500 overflow-hidden flex flex-col shadow-sm hover:shadow-xl">
                                    {/* Thumbnail */}
                                    <div className="relative h-48 overflow-hidden bg-slate-900">
                                        {course.imageUrl ? (
                                            <img src={course.imageUrl} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-all duration-700 group-hover:scale-105" alt={course.title} />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center opacity-20 text-white">
                                                <GraduationCap size={64} />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent opacity-60" />
                                        
                                        {isAdmin && (
                                            <div className="absolute top-4 left-4 flex gap-2">
                                                <span className={`px-3 py-1 text-[8px] font-black uppercase tracking-widest border ${course.published ? 'border-emerald-500/50 text-emerald-400 bg-emerald-400/5' : 'border-yellow-500/50 text-yellow-500 bg-yellow-500/5'}`}>
                                                    {course.published ? 'PÚBLICO' : 'BORRADOR'}
                                                </span>
                                            </div>
                                        )}

                                        <div className="absolute bottom-4 left-4 flex items-center gap-4">
                                            <div className="flex items-center gap-2 text-[9px] font-black text-white uppercase italic">
                                                <PlayCircle size={14} className="text-[#1E3A8A]" />
                                                {course._count.lessons} LECCIONES
                                            </div>
                                            {isAdmin && (
                                                <div className="flex items-center gap-2 text-[9px] font-black text-blue-400 uppercase italic">
                                                    <Users size={14} />
                                                    {course._count.enrollments} ALUMNOS
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-8 flex-1 flex flex-col justify-between space-y-6">
                                        <div>
                                            <h3 className="text-xl font-black uppercase tracking-tighter italic text-[#0F172A] group-hover:text-[#1E3A8A] transition-colors leading-tight mb-4">{course.title}</h3>
                                            <p className="text-xs text-slate-400 italic font-medium line-clamp-2 leading-relaxed">{course.description}</p>
                                        </div>

                                        <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
                                            <Link href={`/academy/${course.slug}`} className="text-[10px] font-black text-[#1E3A8A] uppercase tracking-widest italic flex items-center gap-3 group/link">
                                                TOMAR CURSO <ChevronRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                                            </Link>
                                            
                                            {isAdmin && (
                                                <div className="flex items-center gap-4">
                                                    <Link href={`/dashboard/academy/course/${course.id}`} className="p-3 bg-slate-50 border border-slate-100 text-slate-400 hover:text-[#1E3A8A] hover:border-[#1E3A8A] transition-all">
                                                        <Edit3 size={16} />
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </section>
        </div>
    )
}
