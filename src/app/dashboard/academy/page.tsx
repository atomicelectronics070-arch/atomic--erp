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
            {/* HERO SECTION - Style from Academia Pro */}
            <section className="relative overflow-hidden border-b border-white/5 pb-20">
                <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-[#E8341A]/5 blur-[120px] pointer-events-none" />
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-10"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-1.5 h-10 bg-[#E8341A]"></div>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <Zap size={14} className="text-[#E8341A] neon-text" />
                                <span className="text-[10px] font-black uppercase tracking-[0.6em] text-[#E8341A] italic">PORTAL EDUCATIVO UNIFICADO</span>
                            </div>
                            <h1 className="text-7xl md:text-8xl font-black text-white tracking-tighter uppercase italic leading-none">
                                ACADE<span className="text-[#E8341A] neon-text">MIA</span>
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
                                <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-[#E8341A]/50 transition-all">
                                    <s.icon size={20} className="text-[#E8341A]" />
                                </div>
                                <div>
                                    <p className="text-3xl font-black text-white italic tracking-tighter leading-none">{s.value}</p>
                                    <p className="text-[8px] font-black uppercase tracking-widest text-white/30 italic mt-1">{s.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {isAdmin && (
                        <div className="flex flex-wrap gap-6 pt-10">
                            <Link href="/dashboard/academy/course/new" className="px-10 py-5 bg-[#E8341A] text-white text-[10px] font-black uppercase tracking-[0.4em] italic flex items-center gap-4 shadow-[0_20px_50px_-10px_rgba(232,52,26,0.5)] hover:scale-105 active:scale-95 transition-all">
                                <Plus size={18} /> CREAR NUEVO CURSO
                            </Link>
                            <Link href="/dashboard/academy/admin" className="px-10 py-5 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.4em] italic flex items-center gap-4 hover:bg-white/10 transition-all">
                                <Settings size={18} /> PANEL DE CONTROL
                            </Link>
                        </div>
                    )}
                </motion.div>
            </section>

            {/* SEARCH & CATEGORIES */}
            <section className="flex flex-col lg:flex-row gap-8 items-center justify-between">
                <div className="relative w-full lg:w-96 group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#E8341A] transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="BUSCAR EN LA ACADEMIA..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full bg-white/[0.02] border border-white/10 py-5 pl-16 pr-8 text-xs font-black text-white placeholder:text-white/10 outline-none focus:border-[#E8341A] transition-all italic uppercase tracking-widest"
                    />
                </div>
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => setActiveCategory(null)}
                        className={`px-8 py-4 text-[9px] font-black uppercase tracking-widest italic transition-all ${
                            activeCategory === null ? "bg-[#E8341A] text-white shadow-2xl" : "bg-white/5 text-white/40 border border-white/5 hover:text-white"
                        }`}
                    >
                        TODOS
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.slug === activeCategory ? null : cat.slug)}
                            className={`px-8 py-4 text-[9px] font-black uppercase tracking-widest italic transition-all ${
                                activeCategory === cat.slug ? "bg-[#E8341A] text-white shadow-2xl" : "bg-white/5 text-white/40 border border-white/5 hover:text-white"
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
                        <div className="w-16 h-16 border-2 border-[#E8341A]/20 border-t-[#E8341A] animate-spin" />
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 italic animate-pulse">Sincronizando Módulos...</p>
                    </div>
                ) : filteredCategories.map((cat, idx) => (
                    <div key={cat.id} className="space-y-12">
                        <div className="flex items-center gap-6">
                            <div className="w-10 h-[1px] bg-[#E8341A]"></div>
                            <h2 className="text-3xl font-black uppercase tracking-tighter text-white italic">{cat.name}</h2>
                            <span className="text-[9px] font-black text-white/20 uppercase tracking-widest italic">/ {cat.courses.length} CURSOS</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            {cat.courses.map(course => (
                                <div key={course.id} className="group relative bg-white/[0.02] border border-white/5 hover:border-[#E8341A]/30 transition-all duration-500 overflow-hidden flex flex-col">
                                    {/* Thumbnail with Admin Badges */}
                                    <div className="relative h-48 overflow-hidden bg-black/40">
                                        {course.imageUrl ? (
                                            <img src={course.imageUrl} className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-all duration-700 group-hover:scale-105" alt={course.title} />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center opacity-10">
                                                <GraduationCap size={64} />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                                        
                                        {isAdmin && (
                                            <div className="absolute top-4 left-4 flex gap-2">
                                                <span className={`px-3 py-1 text-[8px] font-black uppercase tracking-widest border ${course.published ? 'border-emerald-500/50 text-emerald-400 bg-emerald-400/5' : 'border-yellow-500/50 text-yellow-500 bg-yellow-500/5'}`}>
                                                    {course.published ? 'PÚBLICO' : 'BORRADOR'}
                                                </span>
                                            </div>
                                        )}

                                        <div className="absolute bottom-4 left-4 flex items-center gap-4">
                                            <div className="flex items-center gap-2 text-[9px] font-black text-white uppercase italic">
                                                <PlayCircle size={14} className="text-[#E8341A]" />
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
                                            <h3 className="text-xl font-black uppercase tracking-tighter italic text-white group-hover:text-[#E8341A] transition-colors leading-tight mb-4">{course.title}</h3>
                                            <p className="text-xs text-white/30 italic font-medium line-clamp-2">{course.description}</p>
                                        </div>

                                        <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                                            <Link href={`/academy/${course.slug}`} className="text-[10px] font-black text-[#E8341A] uppercase tracking-widest italic flex items-center gap-3 group/link">
                                                TOMAR CURSO <ChevronRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                                            </Link>
                                            
                                            {isAdmin && (
                                                <div className="flex items-center gap-4">
                                                    <Link href={`/dashboard/academy/course/${course.id}`} className="p-3 bg-white/5 border border-white/10 text-white/40 hover:text-[#E8341A] hover:border-[#E8341A]/50 transition-all">
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
