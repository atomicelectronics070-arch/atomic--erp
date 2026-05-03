"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { BookOpen, PlayCircle, Users, Clock, Search, Layers, ChevronRight, Zap, GraduationCap, Star, Settings, Plus, Edit } from "lucide-react"
import { motion } from "framer-motion"
import { useSession } from "next-auth/react"

interface Lesson {
    id: string
    title: string
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
    _count: { lessons: number; enrollments: number }
}

interface Category {
    id: string
    name: string
    slug: string
    description: string | null
    image: string | null
    courses: Course[]
}

const CATEGORY_ICONS: Record<string, string> = {
    "electronica-placas": "🔌",
    "arquitectura-redes": "🌐",
    "programacion": "💻",
    "cyber-seguridad": "🛡️",
    "frontend-dev": "🎨",
    "servicios": "🔧",
    "ventas-online": "🛒",
    "seguridad-digital": "🔐",
    "domotica-residencial": "🏠",
    "reparacion-celulares": "📱",
    "reparacion-laptops": "💻",
    "energia-respaldo": "⚡",
    "automatizacion": "🤖",
    "control-accesos": "🚗",
    "drones": "🚁",
    "deportes": "🏋️",
    "telecomunicaciones": "📡",
    "seguridad-electronica": "📷",
    "redes-conectividad": "🌐",
}

export default function AcademyPage() {
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
        <div className="pb-32">
            {/* HERO */}
            <section className="relative py-32 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <Zap size={14} className="text-[#E8341A]" />
                            <span className="text-[10px] font-black uppercase tracking-[0.6em] text-[#E8341A] italic">
                                Centro de Capacitación · Acceso Gratuito
                            </span>
                        </div>
                        <h1 className="text-7xl md:text-9xl font-black text-white tracking-tighter uppercase italic leading-none mb-8">
                            ACADE<span className="text-[#E8341A]">MIA</span>
                        </h1>
                        <p className="text-lg text-white/40 max-w-xl font-medium leading-relaxed">
                            Capacitación tecnológica profesional. Accede libremente a todos nuestros cursos, 
                            sin registro ni pago requerido.
                        </p>

                        {isAdmin && (
                            <div className="mt-10 flex gap-4">
                                <Link href="/dashboard/academy" className="px-8 py-4 bg-primary text-white text-[10px] font-black uppercase tracking-widest italic flex items-center gap-3 shadow-[0_0_30px_rgba(99,102,241,0.3)]">
                                    <Settings size={16} /> PANEL DE GESTIÓN
                                </Link>
                                <button className="px-8 py-4 border border-white/10 text-white/60 text-[10px] font-black uppercase tracking-widest italic flex items-center gap-3 hover:bg-white/5 transition-all">
                                    <Plus size={16} /> NUEVO CURSO
                                </button>
                            </div>
                        )}
                    </motion.div>

                    {/* Stats strip */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="flex flex-wrap gap-12 mt-16 pt-12 border-t border-white/5"
                    >
                        {[
                            { label: "Categorías", value: categories.length, icon: Layers },
                            { label: "Cursos Disponibles", value: totalCourses, icon: BookOpen },
                            { label: "Lecciones de Video", value: totalLessons, icon: PlayCircle },
                            { label: "Acceso Libre", value: "100%", icon: Star },
                        ].map((s, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-[#E8341A]/10 border border-[#E8341A]/20 flex items-center justify-center">
                                    <s.icon size={18} className="text-[#E8341A]" />
                                </div>
                                <div>
                                    <p className="text-2xl font-black text-white italic tracking-tighter">{s.value}</p>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-white/30 italic">{s.label}</p>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* SEARCH + FILTERS */}
            <section className="px-6 mb-16">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" />
                            <input
                                type="text"
                                placeholder="Buscar cursos..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full bg-white/[0.03] border border-white/10 pl-12 pr-5 py-4 text-sm text-white placeholder-white/20 outline-none focus:border-[#E8341A]/50 transition-all font-medium"
                            />
                        </div>

                        {/* Category filters */}
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setActiveCategory(null)}
                                className={`px-5 py-3 text-[10px] font-black uppercase tracking-widest italic transition-all ${
                                    activeCategory === null
                                        ? "bg-[#E8341A] text-white"
                                        : "bg-white/[0.03] border border-white/10 text-white/40 hover:text-white hover:border-white/20"
                                }`}
                            >
                                Todos
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.slug === activeCategory ? null : cat.slug)}
                                    className={`px-5 py-3 text-[10px] font-black uppercase tracking-widest italic transition-all ${
                                        activeCategory === cat.slug
                                            ? "bg-[#E8341A] text-white"
                                            : "bg-white/[0.03] border border-white/10 text-white/40 hover:text-white hover:border-white/20"
                                    }`}
                                >
                                    {CATEGORY_ICONS[cat.slug] || "📚"} {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* COURSES GRID */}
            <section className="px-6">
                <div className="max-w-7xl mx-auto space-y-20">
                    {loading ? (
                        <div className="flex items-center justify-center py-32">
                            <div className="space-y-6 flex flex-col items-center">
                                <div className="w-16 h-16 border border-[#E8341A]/20 animate-spin relative">
                                    <div className="absolute inset-2 border-t border-[#E8341A] animate-spin" />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-[0.6em] text-white/20 animate-pulse italic">
                                    Cargando Academia...
                                </p>
                            </div>
                        </div>
                    ) : filteredCategories.length === 0 ? (
                        <div className="text-center py-32">
                            <GraduationCap size={48} className="text-white/10 mx-auto mb-6" />
                            <p className="text-white/30 font-black uppercase tracking-widest italic text-sm">
                                No se encontraron cursos
                            </p>
                        </div>
                    ) : (
                        filteredCategories.map((cat, catIdx) => (
                            <motion.div
                                key={cat.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: catIdx * 0.1 }}
                            >
                                {/* Category header */}
                                <div className="flex items-center gap-5 mb-10 border-l-4 border-[#E8341A] pl-6">
                                    <div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-2xl">{CATEGORY_ICONS[cat.slug] || "📚"}</span>
                                            <h2 className="text-2xl font-black uppercase tracking-widest text-white italic">
                                                {cat.name}
                                            </h2>
                                            <span className="text-[10px] font-black text-white/20 uppercase tracking-widest italic">
                                                · {cat.courses.length} CURSOS
                                            </span>
                                        </div>
                                        {cat.description && (
                                            <p className="text-xs text-white/30 mt-2 font-medium">{cat.description}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Courses grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {cat.courses.map((course, cIdx) => (
                                        <motion.div
                                            key={course.id}
                                            initial={{ opacity: 0, scale: 0.96 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.4, delay: cIdx * 0.05 }}
                                        >
                                            <Link href={`/academy/${course.slug}`} className="group block">
                                                <div className="relative overflow-hidden border border-white/[0.06] bg-white/[0.02] hover:border-[#E8341A]/30 transition-all duration-500 hover:bg-white/[0.04] hover:shadow-[0_0_40px_rgba(232,52,26,0.08)]">
                                                    {/* Thumbnail */}
                                                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-slate-900 to-black">
                                                        {course.imageUrl ? (
                                                            <img
                                                                src={course.imageUrl}
                                                                alt={course.title}
                                                                className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <GraduationCap size={48} className="text-white/10" />
                                                            </div>
                                                        )}
                                                        {/* Play overlay */}
                                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                            <div className="w-16 h-16 bg-[#E8341A] flex items-center justify-center shadow-[0_0_30px_rgba(232,52,26,0.6)] scale-90 group-hover:scale-100 transition-transform">
                                                                <PlayCircle size={28} className="text-white" />
                                                            </div>
                                                        </div>
                                                        {/* Gradient overlay */}
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                                        {/* Lessons badge */}
                                                        <div className="absolute bottom-4 left-4 flex items-center gap-2">
                                                            <span className="flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-white/70 border border-white/10 italic">
                                                                <PlayCircle size={10} className="text-[#E8341A]" />
                                                                {course._count.lessons} {course._count.lessons === 1 ? "Lección" : "Lecciones"}
                                                            </span>
                                                        </div>
                                                        {/* FREE badge */}
                                                        <div className="absolute top-4 right-4">
                                                            <span className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[8px] font-black uppercase tracking-widest px-3 py-1 italic">
                                                                GRATIS
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Content */}
                                                    <div className="p-6 space-y-4">
                                                        <h3 className="text-base font-black uppercase tracking-tight italic text-white group-hover:text-[#E8341A] transition-colors leading-tight">
                                                            {course.title}
                                                        </h3>
                                                        {course.description && (
                                                            <p className="text-xs text-white/40 line-clamp-2 leading-relaxed font-medium">
                                                                {course.description}
                                                            </p>
                                                        )}
                                                        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                                                            <div className="flex items-center gap-4">
                                                                <span className="flex items-center gap-1.5 text-[9px] font-black text-white/30 uppercase tracking-widest italic">
                                                                    <BookOpen size={12} className="text-[#E8341A]" />
                                                                    {course._count.lessons} Módulos
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                {isAdmin && <button className="p-2 text-white/20 hover:text-white transition-colors"><Edit size={14} /></button>}
                                                                <ChevronRight size={16} className="text-[#E8341A] group-hover:translate-x-1 transition-transform" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </section>

            {/* CTA BANNER */}
            <section className="px-6 mt-32">
                <div className="max-w-7xl mx-auto">
                    <div className="border border-[#E8341A]/20 bg-[#E8341A]/5 p-12 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#E8341A]/10 blur-[80px]" />
                        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                            <div>
                                <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white mb-3">
                                    ¿Quieres más herramientas?
                                </h3>
                                <p className="text-sm text-white/40 font-medium max-w-md">
                                    Accede al ERP completo de Atomic Solutions — cotizaciones, inventario, CRM, WhatsApp y mucho más.
                                </p>
                            </div>
                            <Link
                                href="/login"
                                className="shrink-0 px-10 py-5 bg-[#E8341A] text-white font-black uppercase tracking-widest text-xs italic hover:shadow-[0_0_30px_rgba(232,52,26,0.5)] transition-all hover:-translate-y-0.5 flex items-center gap-3"
                            >
                                INGRESAR AL ERP
                                <ChevronRight size={16} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
