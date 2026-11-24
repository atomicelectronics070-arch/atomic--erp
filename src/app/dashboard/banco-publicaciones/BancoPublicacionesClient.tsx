"use client"

import React, { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Clock, Calendar, User, Tag, Plus, CheckCircle2, Copy, Download,
    Share2, ExternalLink, Sparkles, Filter, Search, ArrowRight,
    Check, AlertCircle, RefreshCw, Layers, ShieldCheck, Image as ImageIcon,
    Laptop, Gamepad2, Shield, Zap, Home, Eye, X, Upload
} from "lucide-react"

// Types
interface PostItem {
    id: string
    title: string
    price: string
    category: string
    imageUrl: string
    copyText: string
    advisorName: string
    marketplaceAccount: string
    date: string // YYYY-MM-DD
    timeLabel: string
    status: "PENDIENTE" | "ENTREGADO"
    verifiedByStefy: boolean
}

const CATEGORIES = [
    { id: "GAMING", name: "Gaming & Consolas (PS4 / PS5)", icon: Gamepad2, color: "text-blue-400 bg-blue-500/10 border-blue-500/30" },
    { id: "COMPUTO", name: "Computación & Laptops (Nitro V / Dell)", icon: Laptop, color: "text-purple-400 bg-purple-500/10 border-purple-500/30" },
    { id: "DOMOTICA", name: "Domótica & Cerraduras Biométricas", icon: Shield, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" },
    { id: "ENERGIA", name: "Energía & Respaldo Eléctrico (Transferencias)", icon: Zap, color: "text-amber-400 bg-amber-500/10 border-amber-500/30" },
    { id: "PANELES", name: "Paneles WPC & Acabados de Construcción", icon: Home, color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30" }
]

const ADVISORS = [
    "Esteban Miranda",
    "Andrés",
    "Alex",
    "Isabel Reyes",
    "Yosvel",
    "Karen",
    "Nuevo Asesor..."
]

// Mock data initialized for Stefy and Advisors
const INITIAL_POSTS: PostItem[] = [
    {
        id: "post-1",
        title: "PlayStation 4 Slim 1TB + 2 Mandos + Juegos Listos",
        price: "$240.00",
        category: "GAMING",
        imageUrl: "https://images.unsplash.com/photo-1507457379470-08b800bebc67?auto=format&fit=crop&w=800&q=80",
        copyText: "🔥 ¡PLAYSTATION 4 SLIM 1TB CON ENTREGA INMEDIATA HOY MISMO EN QUITO! 🔥\n\nIncluye:\n✅ Consola 100% testeada con mantenimiento al día y sello de garantía\n✅ 2 Controles inalámbricos en perfecto estado\n✅ Juegos instalados listos para conectar y jugar\n✅ Envíos a todo el Ecuador con Servientrega o retiro seguro en punto.\n\nPrecio de remate: $240.00 USD. Escríbenos al WhatsApp para apartar la tuya hoy.",
        advisorName: "Esteban Miranda",
        marketplaceAccount: "Perfil FB 1 - Esteban",
        date: "2026-11-24",
        timeLabel: "Hoy · Martes 24 Nov",
        status: "PENDIENTE",
        verifiedByStefy: false
    },
    {
        id: "post-2",
        title: "PlayStation 5 Sellada de Fábrica (Garantía Oficial Sony 1 Año)",
        price: "$620.00",
        category: "GAMING",
        imageUrl: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80",
        copyText: "⚡ PLAYSTATION 5 VERSIÓN DISCO - BODEGA CENTRAL MAYORISTA ⚡\n\nConsola virgen sellada de fábrica, con precinto de seguridad intacto y garantía oficial Sony de 1 año.\n\n📦 Protocolo de Entrega en 24 Horas:\n1. Reserva hoy con anticipo formal del 50%\n2. Despacho directo de almacén central\n3. Entrega a domicilio o retiro en oficina donde liquidas el saldo restante.\n\nPrecio oficial: $620 USD. Cupos de despacho limitados.",
        advisorName: "Esteban Miranda",
        marketplaceAccount: "Perfil FB 1 - Esteban",
        date: "2026-11-24",
        timeLabel: "Hoy · Martes 24 Nov",
        status: "ENTREGADO",
        verifiedByStefy: true
    },
    {
        id: "post-3",
        title: "Laptop Gamer Acer Nitro V 15 (Core i5 13va + RTX 4050)",
        price: "$890.00",
        category: "COMPUTO",
        imageUrl: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80",
        copyText: "🚀 POTENCIA TOTAL: ACER NITRO V 15 PARA ARQUITECTURA Y GAMING 🚀\n\nEspecificaciones de Alto Desempeño:\n• Intel Core i5 13420H (13va Generación Turbo)\n• Gráfica NVIDIA RTX 4050 6GB GDDR6\n• 16GB RAM DDR5 + 512GB SSD NVMe\n• Pantalla 15.6\" FHD 144Hz IPS\n\nFactura electrónica con IVA y garantía de 1 año. Ideal para renderizado, AutoCAD y gaming pesado.",
        advisorName: "Andrés",
        marketplaceAccount: "Perfil FB - Andrés Tech",
        date: "2026-11-24",
        timeLabel: "Hoy · Martes 24 Nov",
        status: "PENDIENTE",
        verifiedByStefy: false
    },
    {
        id: "post-4",
        title: "Cerradura Biométrica Inteligente Tuya WiFi con Huella y App",
        price: "$195.00",
        category: "DOMOTICA",
        imageUrl: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80",
        copyText: "🔒 SEGURIDAD INTELIGENTE: CERRADURA BIOMÉTRICA DE ALTA SEGURIDAD 🔒\n\nOlvídate de cargar llaves. Abre tu puerta con:\n👆 Huella dactilar ultra-rápida (< 0.3s)\n📱 Apertura remota desde celular con app Tuya / SmartLife\n🔢 Código PIN numérico temporal para visitas o Airbnb\n💳 Tarjeta de proximidad RFID y llaves mecánicas de emergencia\n\nCompatible con puertas de madera y metal. ¡Instalación garantizada en Quito y valles!",
        advisorName: "Alex",
        marketplaceAccount: "Perfil Alex Ventas",
        date: "2026-11-23",
        timeLabel: "Ayer · Lunes 23 Nov",
        status: "ENTREGADO",
        verifiedByStefy: true
    },
    {
        id: "post-5",
        title: "Tablero de Transferencia Automática para Generador Eléctrico",
        price: "$420.00",
        category: "ENERGIA",
        imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
        copyText: "⚡ ¡BLINDA TU CASA CONTRA LOS APAGONES! TABLERO DE TRANSFERENCIA AUTOMÁTICA ⚡\n\n¿Se corta la luz en tu sector? Nuestro sistema conmuta en milisegundos hacia tu generador o batería sin que tengas que mover una palanca ni quedarte a oscuras.\n\nProtege tus neveras, computadoras, cámaras y red de internet. Ingeniería certificada con garantía de 2 años.",
        advisorName: "Isabel Reyes",
        marketplaceAccount: "Perfil Isabel Proyectos",
        date: "2026-11-23",
        timeLabel: "Ayer · Lunes 23 Nov",
        status: "ENTREGADO",
        verifiedByStefy: true
    }
]

export default function BancoPublicacionesClient() {
    // State
    const [posts, setPosts] = useState<PostItem[]>(INITIAL_POSTS)
    const [activeTab, setActiveTab] = useState<"stefy" | "asesor" | "google_fotos">("stefy")
    const [selectedAdvisor, setSelectedAdvisor] = useState<string>("Esteban Miranda")
    const [categoryFilter, setCategoryFilter] = useState<string>("TODAS")
    const [searchQuery, setSearchQuery] = useState<string>("")
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [copiedPostId, setCopiedPostId] = useState<string | null>(null)

    // Form State for Creating Week/Assignment
    const [formAdvisor, setFormAdvisor] = useState<string>("Esteban Miranda")
    const [formCustomAdvisor, setFormCustomAdvisor] = useState<string>("")
    const [formCategory, setFormCategory] = useState<string>("GAMING")
    const [formNumAds, setFormNumAds] = useState<number>(5)
    const [formTitle, setFormTitle] = useState<string>("")
    const [formPrice, setFormPrice] = useState<string>("")
    const [formAccount, setFormAccount] = useState<string>("Perfil Marketplace Principal")
    const [formCopy, setFormCopy] = useState<string>("")
    const [formImageUrl, setFormImageUrl] = useState<string>("")

    // Real-time Ecuador Clock (UTC-5: America/Guayaquil)
    const [ecuadorTime, setEcuadorTime] = useState<string>("")
    const [isWithinWorkingHours, setIsWithinWorkingHours] = useState<boolean>(true)

    useEffect(() => {
        // Load from localStorage if present
        const saved = localStorage.getItem("atomic_banco_publicaciones_v1")
        if (saved) {
            try {
                setPosts(JSON.parse(saved))
            } catch (e) {
                console.error("Error loading posts from localStorage", e)
            }
        }

        // Live Ecuador Clock Interval
        const updateClock = () => {
            const now = new Date()
            const ecFormatter = new Intl.DateTimeFormat("es-EC", {
                timeZone: "America/Guayaquil",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true
            })
            setEcuadorTime(ecFormatter.format(now))

            // Check if 9:00 AM to 5:00 PM (hour 9 to 16 inclusive)
            const ecHoursFormatter = new Intl.DateTimeFormat("es-EC", {
                timeZone: "America/Guayaquil",
                hour: "numeric",
                hour12: false
            })
            const currentHour = parseInt(ecHoursFormatter.format(now), 10)
            setIsWithinWorkingHours(currentHour >= 9 && currentHour < 17)
        }

        updateClock()
        const timer = setInterval(updateClock, 1000)
        return () => clearInterval(timer)
    }, [])

    // Save to localStorage when posts change
    const updateAndPersistPosts = (newPosts: PostItem[]) => {
        setPosts(newPosts)
        localStorage.setItem("atomic_banco_publicaciones_v1", JSON.stringify(newPosts))
    }

    // Toggle Stefy's Approval ("Entregado Correctamente")
    const handleToggleVerification = (id: string) => {
        const updated = posts.map(p => {
            if (p.id === id) {
                const nextStatus: "PENDIENTE" | "ENTREGADO" = p.status === "ENTREGADO" ? "PENDIENTE" : "ENTREGADO"
                return {
                    ...p,
                    status: nextStatus,
                    verifiedByStefy: nextStatus === "ENTREGADO"
                }
            }
            return p
        })
        updateAndPersistPosts(updated)
    }

    // Copy Text to Clipboard
    const handleCopyText = (text: string, id: string) => {
        navigator.clipboard.writeText(text)
        setCopiedPostId(id)
        setTimeout(() => setCopiedPostId(null), 2500)
    }

    // Handle Create New Post Assignment
    const handleCreateAssignment = (e: React.FormEvent) => {
        e.preventDefault()
        const effectiveAdvisor = formAdvisor === "Nuevo Asesor..." ? (formCustomAdvisor.trim() || "Asesor Asignado") : formAdvisor
        const now = new Date()
        const dateStr = now.toISOString().split("T")[0]

        const newPost: PostItem = {
            id: `post-${Date.now()}`,
            title: formTitle || `Publicación ${formCategory} (${formNumAds} anuncios asignados)`,
            price: formPrice || "Consultar PVP",
            category: formCategory,
            imageUrl: formImageUrl || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80",
            copyText: formCopy || `🔥 PROMOCIÓN OFICIAL ${formCategory} 🔥\nEscribe al WhatsApp para entregas y catálogo completo.`,
            advisorName: effectiveAdvisor,
            marketplaceAccount: formAccount,
            date: dateStr,
            timeLabel: "Hoy · " + now.toLocaleDateString("es-EC", { weekday: "short", day: "numeric", month: "short" }),
            status: "PENDIENTE",
            verifiedByStefy: false
        }

        updateAndPersistPosts([newPost, ...posts])
        setIsCreateModalOpen(false)

        // Reset inputs
        setFormTitle("")
        setFormPrice("")
        setFormCopy("")
        setFormImageUrl("")
    }

    // Filtered posts for Stefy / General
    const filteredPosts = useMemo(() => {
        return posts.filter(p => {
            const matchCategory = categoryFilter === "TODAS" || p.category === categoryFilter
            const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                p.advisorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                p.copyText.toLowerCase().includes(searchQuery.toLowerCase())
            return matchCategory && matchSearch
        })
    }, [posts, categoryFilter, searchQuery])

    // Filtered posts specifically for the Selected Advisor
    const advisorSpecificPosts = useMemo(() => {
        return posts.filter(p => p.advisorName.toLowerCase() === selectedAdvisor.toLowerCase())
    }, [posts, selectedAdvisor])

    // Grouping by Date for Google Photos timeline mode
    const groupedByDate = useMemo(() => {
        const groups: { [key: string]: PostItem[] } = {}
        filteredPosts.forEach(p => {
            const key = p.timeLabel || p.date
            if (!groups[key]) groups[key] = []
            groups[key].push(p)
        })
        return groups
    }, [filteredPosts])

    return (
        <div className="min-h-screen bg-[#070a14] text-slate-100 font-sans pb-24 selection:bg-cyan-500/30">
            {/* ── HEADER CON RELOJ ECUADOR EN TIEMPO REAL ── */}
            <header className="border-b border-slate-800 bg-[#090e1d]/90 backdrop-blur-xl sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                                <Sparkles size={18} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-black text-white tracking-tight font-heading flex items-center gap-2">
                                    <span>Estudio de Asignación & Banco de Contenido</span>
                                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase">
                                        Stefy Command
                                    </span>
                                </h1>
                                <p className="text-xs text-slate-400">
                                    Plataforma de asignación diaria de anuncios para Marketplace y auditoría de entregas.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Ecuador Live Clock Widget */}
                    <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 rounded-2xl p-2.5 px-4 shadow-sm">
                        <div className={`w-3 h-3 rounded-full ${isWithinWorkingHours ? "bg-emerald-400 animate-pulse shadow-[0_0_12px_#10b981]" : "bg-amber-400"}`} />
                        <div className="flex flex-col">
                            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-white">
                                <Clock size={13} className="text-cyan-400" />
                                <span>Ecuador: {ecuadorTime || "09:00:00 AM"}</span>
                            </div>
                            <span className="text-[10px] font-mono text-slate-400">
                                {isWithinWorkingHours ? "⚡ Jornada Activa (Corriendo 9:00 a 17:00)" : "🌙 Fuera de Horario Laboral"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-2 overflow-x-auto pt-2 pb-3 border-t border-slate-800/60">
                    <button
                        onClick={() => setActiveTab("stefy")}
                        className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0 ${
                            activeTab === "stefy"
                                ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                        }`}
                    >
                        <ShieldCheck size={14} />
                        <span>Vista Stefy (Asignar & Auditar)</span>
                    </button>

                    <button
                        onClick={() => setActiveTab("asesor")}
                        className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0 ${
                            activeTab === "asesor"
                                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                        }`}
                    >
                        <User size={14} />
                        <span>Portal del Asesor (Descargar & Copiar)</span>
                    </button>

                    <button
                        onClick={() => setActiveTab("google_fotos")}
                        className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0 ${
                            activeTab === "google_fotos"
                                ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
                                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                        }`}
                    >
                        <ImageIcon size={14} />
                        <span>Banco General (Estilo Google Fotos)</span>
                    </button>

                    <div className="ml-auto flex items-center gap-2">
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md shadow-emerald-950/40"
                        >
                            <Plus size={15} />
                            <span>Crear Semana / Asignar</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-8">
                {/* ════════════════════════════════════════════════════════════════════
                    MODO 1: VISTA STEFY (ADMINISTRACIÓN Y BOTÓN ENTREGADO CORRECTAMENTE)
                   ════════════════════════════════════════════════════════════════════ */}
                {activeTab === "stefy" && (
                    <section className="space-y-6">
                        {/* Banner Explicativo de Stefy */}
                        <div className="p-5 rounded-3xl bg-gradient-to-r from-blue-950/40 via-cyan-950/20 to-slate-900 border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="space-y-1">
                                <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-widest block">
                                    Panel de Auditoría Exclusivo de Stefy
                                </span>
                                <h2 className="text-lg font-black text-white">
                                    Control Diario de Publicaciones & Verificación 1 a 1
                                </h2>
                                <p className="text-xs text-slate-300 max-w-2xl">
                                    Solo tú como supervisora puedes marcar el botón <strong className="text-emerald-400">«Entregado Correctamente»</strong> para validar que el asesor realizó su publicación. Esto se refleja en su matriz de puntuación semanal.
                                </p>
                            </div>

                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="px-5 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shrink-0 shadow-lg flex items-center gap-2"
                            >
                                <Plus size={16} />
                                <span>Nueva Asignación de Anuncios</span>
                            </button>
                        </div>

                        {/* Filtros de Búsqueda */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/50 p-3 rounded-2xl border border-slate-800">
                            <div className="relative w-full sm:w-80">
                                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar por asesor, producto o cuenta..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                                />
                            </div>

                            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
                                <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                                    <Filter size={12} /> Categoría:
                                </span>
                                <select
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                    className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 font-medium"
                                >
                                    <option value="TODAS">Todas las Categorías</option>
                                    {CATEGORIES.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Lista de Publicaciones Asignadas con Botón Individual de Stefy */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {filteredPosts.map(post => (
                                <motion.div
                                    key={post.id}
                                    layout
                                    className={`rounded-3xl border transition-all overflow-hidden flex flex-col justify-between ${
                                        post.verifiedByStefy
                                            ? "bg-[#081715] border-emerald-500/50 shadow-md shadow-emerald-950/20"
                                            : "bg-[#0b1222] border-slate-800 hover:border-slate-700 shadow-sm"
                                    }`}
                                >
                                    <div>
                                        {/* Header de la tarjeta */}
                                        <div className="p-4 border-b border-white/5 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold text-xs">
                                                    {post.advisorName.charAt(0)}
                                                </div>
                                                <div>
                                                    <span className="text-xs font-black text-white block leading-none">{post.advisorName}</span>
                                                    <span className="text-[10px] text-slate-400 font-mono">{post.marketplaceAccount}</span>
                                                </div>
                                            </div>

                                            <span className={`text-[10px] font-mono font-black px-2 py-0.5 rounded-full border ${
                                                post.verifiedByStefy
                                                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                                                    : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                                            }`}>
                                                {post.verifiedByStefy ? "✓ ENTREGADO" : "⏳ PENDIENTE"}
                                            </span>
                                        </div>

                                        {/* Imagen y Preview */}
                                        <div className="relative aspect-video bg-black/60 overflow-hidden group">
                                            <img
                                                src={post.imageUrl}
                                                alt={post.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-white/10 text-white font-mono font-black text-xs">
                                                {post.price}
                                            </div>
                                            <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-cyan-950/90 border border-cyan-500/40 text-cyan-200 text-[10px] font-mono">
                                                {post.category}
                                            </div>
                                        </div>

                                        {/* Contenido y Textos Asignados */}
                                        <div className="p-4 space-y-3">
                                            <h3 className="text-sm font-black text-white leading-snug line-clamp-2">
                                                {post.title}
                                            </h3>

                                            <div className="p-3 rounded-xl bg-black/50 border border-white/5 space-y-1.5">
                                                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                                                    <span>Texto asignado para publicar:</span>
                                                    <button
                                                        onClick={() => handleCopyText(post.copyText, post.id)}
                                                        className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-[10px]"
                                                    >
                                                        {copiedPostId === post.id ? <Check size={12} /> : <Copy size={12} />}
                                                        <span>{copiedPostId === post.id ? "Copiado!" : "Copiar"}</span>
                                                    </button>
                                                </div>
                                                <p className="text-xs text-slate-300 font-mono line-clamp-3 leading-relaxed whitespace-pre-line">
                                                    {post.copyText}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ── BOTÓN EXCLUSIVO DE STEFY (CONTROL 1 A 1) ── */}
                                    <div className="p-4 pt-0">
                                        <button
                                            onClick={() => handleToggleVerification(post.id)}
                                            className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md ${
                                                post.verifiedByStefy
                                                    ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                                                    : "bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-300 border border-slate-700"
                                            }`}
                                        >
                                            <CheckCircle2 size={16} />
                                            <span>
                                                {post.verifiedByStefy ? "Entregado Correctamente (Aprobado)" : "Marcar Entregado Correctamente"}
                                            </span>
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                )}

                {/* ════════════════════════════════════════════════════════════════════
                    MODO 2: PORTAL DEL ASESOR (DESCARGA AUTOMÁTICA Y COPIAR TEXTOS)
                   ════════════════════════════════════════════════════════════════════ */}
                {activeTab === "asesor" && (
                    <section className="space-y-6">
                        {/* Selector de Asesor para Simular o Compartir Link */}
                        <div className="p-6 rounded-3xl bg-[#09152b] border border-blue-500/40 space-y-4">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div>
                                    <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">
                                        Enlace Directo para Vendedores
                                    </span>
                                    <h2 className="text-xl font-black text-white">
                                        Asignación de Publicaciones para: <span className="text-blue-300">{selectedAdvisor}</span>
                                    </h2>
                                    <p className="text-xs text-slate-300 mt-0.5">
                                        El asesor abre este enlace, descarga sus imágenes y copia sus copys en segundos.
                                    </p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <select
                                        value={selectedAdvisor}
                                        onChange={(e) => setSelectedAdvisor(e.target.value)}
                                        className="px-4 py-2 bg-slate-950 border border-blue-500/50 rounded-xl text-xs text-white font-bold focus:outline-none"
                                    >
                                        {ADVISORS.filter(a => a !== "Nuevo Asesor...").map(a => (
                                            <option key={a} value={a}>{a}</option>
                                        ))}
                                    </select>

                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(`${window.location.origin}/dashboard/banco-publicaciones?asesor=${encodeURIComponent(selectedAdvisor)}`)
                                            alert(`¡Enlace copiado! Pásale este link a ${selectedAdvisor} para que vea sus publicaciones de hoy.`)
                                        }}
                                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs flex items-center gap-1.5 shadow-md"
                                    >
                                        <Share2 size={14} />
                                        <span>Copiar Link para {selectedAdvisor}</span>
                                    </button>
                                </div>
                            </div>

                            {/* Botón de Descarga en Lote */}
                            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                                <div className="text-xs text-slate-300 font-mono">
                                    <span>Total publicaciones asignadas hoy: <strong>{advisorSpecificPosts.length} anuncios</strong></span>
                                </div>
                                <button
                                    onClick={() => {
                                        advisorSpecificPosts.forEach(p => {
                                            const a = document.createElement("a")
                                            a.href = p.imageUrl
                                            a.download = `${p.title.replace(/\s+/g, "_")}.jpg`
                                            a.target = "_blank"
                                            a.click()
                                        })
                                    }}
                                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md hover:scale-102 transition-transform flex items-center gap-2"
                                >
                                    <Download size={15} />
                                    <span>Descargar Automáticamente Todas las Fotos del Día</span>
                                </button>
                            </div>
                        </div>

                        {/* Tarjetas de Anuncios del Asesor */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {advisorSpecificPosts.map((post, idx) => (
                                <div
                                    key={post.id}
                                    className="p-5 rounded-3xl bg-[#0d1424] border border-slate-800 space-y-4 flex flex-col justify-between"
                                >
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[11px] font-mono font-bold text-cyan-400">
                                                Anuncio #{idx + 1} · {post.category}
                                            </span>
                                            <span className="px-3 py-1 rounded-lg bg-black/50 border border-white/10 text-white font-mono font-black text-xs">
                                                {post.price}
                                            </span>
                                        </div>

                                        <div className="aspect-video rounded-2xl overflow-hidden bg-black relative">
                                            <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
                                            <a
                                                href={post.imageUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="absolute bottom-2 right-2 px-3 py-1.5 rounded-xl bg-black/80 hover:bg-black text-white text-xs font-mono font-bold flex items-center gap-1 border border-white/20"
                                            >
                                                <Download size={13} />
                                                <span>Descargar Foto</span>
                                            </a>
                                        </div>

                                        <h3 className="text-base font-black text-white">{post.title}</h3>

                                        {/* Copy con Botón Copiar Rápido */}
                                        <div className="p-3.5 rounded-2xl bg-black/60 border border-white/5 space-y-2">
                                            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                                                <span>Copy para pegar en Marketplace:</span>
                                                <button
                                                    onClick={() => handleCopyText(post.copyText, post.id)}
                                                    className="px-3 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold text-xs flex items-center gap-1"
                                                >
                                                    {copiedPostId === post.id ? <Check size={13} /> : <Copy size={13} />}
                                                    <span>{copiedPostId === post.id ? "¡Texto Copiado!" : "Copiar Texto"}</span>
                                                </button>
                                            </div>
                                            <p className="text-xs text-slate-300 font-mono whitespace-pre-line leading-relaxed">
                                                {post.copyText}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Estado de entrega */}
                                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                                        <span className="text-slate-400">Publicar en: <strong>{post.marketplaceAccount}</strong></span>
                                        <span className={post.verifiedByStefy ? "text-emerald-400 font-bold" : "text-amber-400"}>
                                            {post.verifiedByStefy ? "✓ Aprobado por Stefy" : "⏳ Pendiente de revisión"}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* ════════════════════════════════════════════════════════════════════
                    MODO 3: BANCO GENERAL (ESTILO GOOGLE FOTOS CON LEYENDAS POR FECHA)
                   ════════════════════════════════════════════════════════════════════ */}
                {activeTab === "google_fotos" && (
                    <section className="space-y-8">
                        <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                            <div>
                                <h2 className="text-2xl font-black text-white tracking-tight">
                                    Galería Global de Publicaciones
                                </h2>
                                <p className="text-xs text-slate-400">
                                    Historial unificado de todos los artes generados, divididos sutilmente por fechas estilo Google Fotos.
                                </p>
                            </div>

                            <button
                                onClick={() => {
                                    filteredPosts.forEach(p => {
                                        const a = document.createElement("a")
                                        a.href = p.imageUrl
                                        a.download = `${p.title}.jpg`
                                        a.target = "_blank"
                                        a.click()
                                    })
                                }}
                                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs flex items-center gap-2"
                            >
                                <Download size={14} />
                                <span>Descargar Todo el Banco</span>
                            </button>
                        </div>

                        {/* Timeline agrupado por Fechas estilo Google Fotos */}
                        <div className="space-y-10">
                            {Object.entries(groupedByDate).map(([dateLabel, items]) => (
                                <div key={dateLabel} className="space-y-4">
                                    {/* Leyenda casi invisible / elegante estilo Google Fotos */}
                                    <div className="sticky top-28 z-20 py-1 px-3 rounded-lg bg-[#070a14]/90 backdrop-blur-md w-fit border border-white/5 text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
                                        {dateLabel} · <span className="text-slate-500 font-normal">{items.length} imágenes</span>
                                    </div>

                                    {/* Grid de Fotos Fluido */}
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                        {items.map(item => (
                                            <div
                                                key={item.id}
                                                className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-900 border border-white/5 hover:border-cyan-500/50 transition-all cursor-pointer shadow-sm"
                                            >
                                                <img
                                                    src={item.imageUrl}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2.5 flex flex-col justify-end">
                                                    <p className="text-[11px] font-bold text-white line-clamp-1">{item.title}</p>
                                                    <p className="text-[10px] text-cyan-300 font-mono">{item.price} · {item.advisorName}</p>
                                                    <div className="flex items-center gap-1.5 pt-1.5">
                                                        <a
                                                            href={item.imageUrl}
                                                            download
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-[10px]"
                                                            title="Descargar Foto"
                                                        >
                                                            <Download size={12} />
                                                        </a>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                handleCopyText(item.copyText, item.id)
                                                            }}
                                                            className="p-1.5 rounded-lg bg-cyan-500/40 hover:bg-cyan-500 text-white text-[10px]"
                                                            title="Copiar Copy"
                                                        >
                                                            {copiedPostId === item.id ? <Check size={12} /> : <Copy size={12} />}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>

            {/* ════════════════════════════════════════════════════════════════════
                MODAL: FORMULARIO CREAR SEMANA / ASIGNACIÓN PARA STEFY
               ════════════════════════════════════════════════════════════════════ */}
            <AnimatePresence>
                {isCreateModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-2xl bg-[#0c1222] border border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                <div className="space-y-0.5">
                                    <h3 className="text-lg font-black text-white font-heading">
                                        Crear Asignación Semanal de Publicaciones
                                    </h3>
                                    <p className="text-xs text-slate-400">
                                        Asigna productos, fotos y textos a un asesor comercial.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <form onSubmit={handleCreateAssignment} className="space-y-4">
                                {/* Asesor y Categoría */}
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-mono font-bold text-slate-300">
                                            Asesor Comercial:
                                        </label>
                                        <select
                                            value={formAdvisor}
                                            onChange={(e) => setFormAdvisor(e.target.value)}
                                            className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                                        >
                                            {ADVISORS.map(a => (
                                                <option key={a} value={a}>{a}</option>
                                            ))}
                                        </select>
                                        {formAdvisor === "Nuevo Asesor..." && (
                                            <input
                                                type="text"
                                                placeholder="Escribe el nombre del nuevo asesor..."
                                                value={formCustomAdvisor}
                                                onChange={(e) => setFormCustomAdvisor(e.target.value)}
                                                className="w-full p-2.5 mt-2 bg-slate-900 border border-cyan-500/40 rounded-xl text-xs text-white"
                                                required
                                            />
                                        )}
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-mono font-bold text-slate-300">
                                            Categoría Asignada:
                                        </label>
                                        <select
                                            value={formCategory}
                                            onChange={(e) => setFormCategory(e.target.value)}
                                            className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                                        >
                                            {CATEGORIES.map(c => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Cantidad de Anuncios y Cuenta Asignada */}
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-mono font-bold text-slate-300">
                                            Cantidad de Anuncios:
                                        </label>
                                        <select
                                            value={formNumAds}
                                            onChange={(e) => setFormNumAds(parseInt(e.target.value, 10))}
                                            className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                                        >
                                            <option value={3}>3 Anuncios Diarios</option>
                                            <option value={5}>5 Anuncios Diarios (Estándar)</option>
                                            <option value={7}>7 Anuncios Diarios</option>
                                            <option value={10}>10 Anuncios Diarios (Élite)</option>
                                        </select>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-mono font-bold text-slate-300">
                                            Cuenta / Perfil de Marketplace:
                                        </label>
                                        <input
                                            type="text"
                                            value={formAccount}
                                            onChange={(e) => setFormAccount(e.target.value)}
                                            placeholder="Ej: Perfil 1 Personal o Cuenta Comercial"
                                            className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                                        />
                                    </div>
                                </div>

                                {/* Título y Precio */}
                                <div className="grid sm:grid-cols-3 gap-4">
                                    <div className="sm:col-span-2 space-y-1.5">
                                        <label className="text-xs font-mono font-bold text-slate-300">
                                            Título del Producto / Anuncio:
                                        </label>
                                        <input
                                            type="text"
                                            value={formTitle}
                                            onChange={(e) => setFormTitle(e.target.value)}
                                            placeholder="Ej: PlayStation 5 Slim Sellada con Garantía"
                                            className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-mono font-bold text-slate-300">
                                            Precio de Venta ($):
                                        </label>
                                        <input
                                            type="text"
                                            value={formPrice}
                                            onChange={(e) => setFormPrice(e.target.value)}
                                            placeholder="$620.00"
                                            className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* URL de Imagen / Foto de Publicación */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-mono font-bold text-slate-300">
                                        URL de la Foto / Arte de Stefy:
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="url"
                                            value={formImageUrl}
                                            onChange={(e) => setFormImageUrl(e.target.value)}
                                            placeholder="Pega enlace de la imagen o deja vacío para usar imagen de catálogo"
                                            className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                                        />
                                    </div>
                                </div>

                                {/* Copy / Textos Asignados */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-mono font-bold text-slate-300">
                                        Textos Asignados (Copy listo para copiar y pegar en Marketplace):
                                    </label>
                                    <textarea
                                        rows={4}
                                        value={formCopy}
                                        onChange={(e) => setFormCopy(e.target.value)}
                                        placeholder="Pega aquí el texto completo que el asesor debe pegar en Facebook Marketplace..."
                                        className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 font-mono leading-relaxed"
                                        required
                                    />
                                </div>

                                <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                                    <button
                                        type="button"
                                        onClick={() => setIsCreateModalOpen(false)}
                                        className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-950/50 flex items-center gap-2"
                                    >
                                        <Check size={16} />
                                        <span>Guardar y Asignar al Asesor</span>
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
