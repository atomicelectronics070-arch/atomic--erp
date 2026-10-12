"use client"

import React, { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { 
    CalendarCheck, CheckCircle2, Circle, Plus, Trash2, 
    MessageSquare, Copy, Check, ExternalLink, Share2, 
    Flame, ShoppingBag, FolderTree, ChevronRight, ChevronDown, 
    ArrowRight, Clock, Target, DollarSign, Award, 
    Zap, Sparkles, AlertCircle, RefreshCw, X, ShieldCheck, 
    Search, Layers, Send, Smartphone
} from "lucide-react"
import SalesCopyManager from "./SalesCopyManager"

export interface DailyActivity {
    id: string
    title: string
    description: string
    category: "ventas" | "marketplace" | "seguimiento" | "operaciones"
    priority: "ALTA" | "MEDIA" | "RUTINA"
    completed: boolean
    completedAt?: string
    isCustom?: boolean
}

const DEFAULT_ACTIVITIES: DailyActivity[] = [
    {
        id: "act-1",
        title: "Apertura & Verificación de Catálogo",
        description: "Revisar stock crítico, ofertas del día y novedades en el sistema ATOMIC.",
        category: "operaciones",
        priority: "ALTA",
        completed: false
    },
    {
        id: "act-2",
        title: "Respuesta Inicial Marketplace (10 Chats)",
        description: "Responder a los primeros leads de Facebook Marketplace e Instagram usando los scripts rápidos.",
        category: "marketplace",
        priority: "ALTA",
        completed: false
    },
    {
        id: "act-3",
        title: "Difusión de Video / Producto Viral (Suicide Squad)",
        description: "Publicar al menos 1 producto estrella o video viral en estados de WhatsApp, TikTok o Facebook.",
        category: "marketplace",
        priority: "ALTA",
        completed: false
    },
    {
        id: "act-4",
        title: "Captura de Números Telefónicos para Catálogo",
        description: "Pedir el WhatsApp de los prospectos interesados para enviarles el catálogo oficial en PDF.",
        category: "ventas",
        priority: "ALTA",
        completed: false
    },
    {
        id: "act-5",
        title: "Generación de 3 Cotizaciones Oficiales",
        description: "Enviar cotizaciones formales en PDF o Excel con PVP Público, IVA y garantía de 1 año.",
        category: "ventas",
        priority: "MEDIA",
        completed: false
    },
    {
        id: "act-6",
        title: "Seguimiento a Clientes de la Semana Anterior",
        description: "Contactar a 5 clientes anteriores para ofrecerles accesorios, instalación o recompra.",
        category: "seguimiento",
        priority: "MEDIA",
        completed: false
    },
    {
        id: "act-7",
        title: "Prospección Radar de Negocios Locales",
        description: "Identificar y registrar 3 comercios o conjuntos residenciales que requieran seguridad electrónica.",
        category: "ventas",
        priority: "RUTINA",
        completed: false
    },
    {
        id: "act-8",
        title: "Cierre de Turno & Registro de Metas",
        description: "Comprobar el volumen de venta del día, comisiones ganadas y dejar listas las tareas de mañana.",
        category: "operaciones",
        priority: "ALTA",
        completed: false
    }
]

export default function RutaDelDiaWorkspace({
    isOpen = true,
    onClose,
    embedded = false
}: {
    isOpen?: boolean
    onClose?: () => void
    embedded?: boolean
}) {
    const { data: session } = useSession()
    const sellerName = session?.user?.name || "Asesor Comercial"

    const [activeTab, setActiveTab] = useState<"actividades" | "categorias" | "plan_laboral" | "mensajes">("actividades")

    // ─────────────────────────────────────────────────────────────
    // 1. GESTIÓN DE ACTIVIDADES DIARIAS CON LOCALSTORAGE
    // ─────────────────────────────────────────────────────────────
    const [activities, setActivities] = useState<DailyActivity[]>(DEFAULT_ACTIVITIES)
    const [newTitle, setNewTitle] = useState("")
    const [newDesc, setNewDesc] = useState("")
    const [newPriority, setNewPriority] = useState<"ALTA" | "MEDIA" | "RUTINA">("ALTA")
    const [newCategory, setNewCategory] = useState<"ventas" | "marketplace" | "seguimiento" | "operaciones">("ventas")
    const [notes, setNotes] = useState("")
    const [notesSaved, setNotesSaved] = useState(false)

    // Load persisted activities
    useEffect(() => {
        try {
            const saved = localStorage.getItem("atomic_daily_route_activities")
            if (saved) {
                const parsed = JSON.parse(saved)
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setActivities(parsed)
                }
            }
            const savedNotes = localStorage.getItem("atomic_daily_route_notes")
            if (savedNotes) setNotes(savedNotes)
        } catch (e) {}
    }, [])

    const saveActivitiesToStorage = (updated: DailyActivity[]) => {
        setActivities(updated)
        try {
            localStorage.setItem("atomic_daily_route_activities", JSON.stringify(updated))
        } catch (e) {}
    }

    const toggleActivity = (id: string) => {
        const nowStr = new Date().toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" })
        const updated = activities.map(act => {
            if (act.id === id) {
                const nextCompleted = !act.completed
                return {
                    ...act,
                    completed: nextCompleted,
                    completedAt: nextCompleted ? nowStr : undefined
                }
            }
            return act
        })
        saveActivitiesToStorage(updated)
    }

    const handleAddActivity = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newTitle.trim()) return
        const newAct: DailyActivity = {
            id: `custom-${Date.now()}`,
            title: newTitle.trim(),
            description: newDesc.trim() || "Actividad personalizada del día",
            category: newCategory,
            priority: newPriority,
            completed: false,
            isCustom: true
        }
        const updated = [newAct, ...activities]
        saveActivitiesToStorage(updated)
        setNewTitle("")
        setNewDesc("")
    }

    const handleDeleteActivity = (id: string) => {
        const updated = activities.filter(a => a.id !== id)
        saveActivitiesToStorage(updated)
    }

    const handleResetActivities = () => {
        if (confirm("¿Deseas reiniciar el checklist de actividades para hoy?")) {
            saveActivitiesToStorage(DEFAULT_ACTIVITIES)
        }
    }

    const handleSaveNotes = () => {
        try {
            localStorage.setItem("atomic_daily_route_notes", notes)
            setNotesSaved(true)
            setTimeout(() => setNotesSaved(false), 2000)
        } catch (e) {}
    }

    const completedCount = activities.filter(a => a.completed).length
    const totalCount = activities.length
    const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

    // ─────────────────────────────────────────────────────────────
    // 2. GESTIÓN DE CATEGORÍAS & SUBCATEGORÍAS
    // ─────────────────────────────────────────────────────────────
    const [squads, setSquads] = useState<any[]>([])
    const [loadingCatalog, setLoadingCatalog] = useState(false)
    const [selectedCategoryName, setSelectedCategoryName] = useState<string | null>(null)
    const [subcategories, setSubcategories] = useState<any[]>([])
    const [loadingSubs, setLoadingSubs] = useState(false)
    const [selectedSubId, setSelectedSubId] = useState<string | null>(null)
    const [productsList, setProductsList] = useState<any[]>([])
    const [loadingProducts, setLoadingProducts] = useState(false)
    const [catalogSearch, setCatalogSearch] = useState("")

    // Quote feedback state
    const [quoteCount, setQuoteCount] = useState(0)
    const [copiedProductKey, setCopiedProductKey] = useState<string | null>(null)

    // Load squads and categories taxonomy
    const loadCategories = async () => {
        setLoadingCatalog(true)
        try {
            const res = await fetch("/api/tools/suicide-squad")
            const data = await res.json()
            if (data.success && data.squads) {
                setSquads(data.squads)
                if (data.squads.length > 0 && data.squads[0].categories.length > 0) {
                    // Preselect first category
                    const firstCat = data.squads[0].categories[0]
                    loadSubcategoriesFor(firstCat)
                }
            }
        } catch (e) {
            console.error("Error loading categories:", e)
        } finally {
            setLoadingCatalog(false)
        }
    }

    const loadSubcategoriesFor = async (catName: string) => {
        setSelectedCategoryName(catName)
        setSelectedSubId(null)
        setProductsList([])
        setLoadingSubs(true)
        try {
            const res = await fetch(`/api/tools/suicide-squad?action=subcategories&categoryName=${encodeURIComponent(catName)}`)
            const data = await res.json()
            if (data.success && data.subcategories) {
                setSubcategories(data.subcategories)
                // Load products for the first subcategory or "all"
                if (data.subcategories.length > 0) {
                    loadProductsFor(catName, data.subcategories[0])
                }
            }
        } catch (e) {
            console.error("Error loading subcategories:", e)
        } finally {
            setLoadingSubs(false)
        }
    }

    const loadProductsFor = async (catName: string, sub: any) => {
        setSelectedSubId(sub.id)
        setLoadingProducts(true)
        try {
            const kw = sub.isAll ? "all" : (sub.keywords?.join(",") || "")
            const res = await fetch(
                `/api/tools/suicide-squad?action=products&categoryName=${encodeURIComponent(catName)}&subcategoryKeywords=${encodeURIComponent(kw)}&limit=12`
            )
            const data = await res.json()
            if (data.success && data.products) {
                setProductsList(data.products)
            }
        } catch (e) {
            console.error("Error loading products:", e)
        } finally {
            setLoadingProducts(false)
        }
    }

    useEffect(() => {
        if (activeTab === "categorias" && squads.length === 0) {
            loadCategories()
        }
    }, [activeTab])

    // Synchronize quote counter
    useEffect(() => {
        try {
            const saved = localStorage.getItem("atomic_quote_items")
            if (saved) {
                const parsed = JSON.parse(saved)
                if (Array.isArray(parsed)) setQuoteCount(parsed.length)
            }
        } catch (e) {}
    }, [])

    const handleAddProductToQuote = (p: any) => {
        const pvp = p.pvp ?? p.price
        let photoUrl = ""
        try {
            if (p.images) {
                const parsed = JSON.parse(p.images)
                if (Array.isArray(parsed)) photoUrl = parsed[0]
                else if (typeof parsed === "string") photoUrl = parsed
            }
        } catch (e) {
            if (p.images && p.images.startsWith("http")) photoUrl = p.images
        }

        try {
            const currentStr = localStorage.getItem("atomic_quote_items")
            let current = currentStr ? JSON.parse(currentStr) : []
            if (!Array.isArray(current)) current = []

            const existingIdx = current.findIndex((it: any) => it.productId === p.id)
            if (existingIdx >= 0) {
                current[existingIdx].quantity += 1
            } else {
                current.push({
                    id: String(Date.now() + Math.random()),
                    productId: p.id,
                    description: p.name,
                    quantity: 1,
                    unitPrice: pvp,
                    customImage: photoUrl || undefined
                })
            }
            localStorage.setItem("atomic_quote_items", JSON.stringify(current))

            // Sync with atomic_cart
            const cartStr = localStorage.getItem("atomic_cart")
            let cart = cartStr ? JSON.parse(cartStr) : []
            if (Array.isArray(cart)) {
                const inCart = cart.find((it: any) => it.id === p.id)
                if (inCart) inCart.quantity += 1
                else cart.push({ id: p.id, name: p.name, price: pvp, quantity: 1, image: photoUrl })
                localStorage.setItem("atomic_cart", JSON.stringify(cart))
            }

            setQuoteCount(current.length)
        } catch (e) {}
    }

    const copyProductPitch = (p: any) => {
        const pitch = p.whatsappPitch || `*${p.name}*\n🏷️ *PVP Público:* $${(p.pvp || p.price).toFixed(2)} (Inc. IVA)\n🔗 Ver en tienda: ${p.publicUrl || `https://atomiccotizador.shop/web/product/${p.id}`}`
        navigator.clipboard.writeText(pitch)
        setCopiedProductKey(p.id)
        setTimeout(() => setCopiedProductKey(null), 2000)
    }

    // ─────────────────────────────────────────────────────────────
    // 3. PLAN LABORAL & CALCULADORA DE METAS
    // ─────────────────────────────────────────────────────────────
    const [dailyTarget, setDailyTarget] = useState(400)
    const [currentSales, setCurrentSales] = useState(185)
    const [commissionRate, setCommissionRate] = useState(6) // 6%

    const salesProgress = Math.min(100, Math.round((currentSales / (dailyTarget || 1)) * 100))
    const earnedCommission = (currentSales * (commissionRate / 100)).toFixed(2)

    // Current date formatted
    const todayFormatted = new Date().toLocaleDateString("es-EC", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    })

    if (!isOpen) return null

    const content = (
        <div className="flex flex-col h-full bg-[#040714] text-white">
            {/* ── TOP HEADER: IDENTIFICADOR RUTA DEL DÍA ── */}
            <header className="px-4 sm:px-6 py-3.5 border-b border-cyan-500/20 bg-slate-950/95 flex flex-wrap items-center justify-between gap-3 shrink-0 z-20">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center text-black font-black shadow-lg shadow-emerald-500/30">
                        <CalendarCheck size={20} className="stroke-[2.5]" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-sm sm:text-base font-black tracking-tight text-white">
                                Ruta del Día
                            </h2>
                            <span className="text-[9px] font-mono font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase">
                                Plan Operativo
                            </span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-mono capitalize">
                            📅 {todayFormatted} • {sellerName}
                        </p>
                    </div>
                </div>

                {/* Progress bar in header & Close button */}
                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex flex-col items-end gap-1">
                        <div className="flex items-center gap-2 text-[10px] font-mono">
                            <span className="text-slate-400">Cumplimiento hoy:</span>
                            <span className="font-bold text-emerald-400">{completedCount}/{totalCount} ({progressPercent}%)</span>
                        </div>
                        <div className="w-28 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full transition-all duration-300" 
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    </div>

                    {quoteCount > 0 && (
                        <Link
                            href="/dashboard/quotes"
                            className="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/50 hover:bg-amber-500/30 text-amber-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm"
                            title="Ver Cotización Activa"
                        >
                            <ShoppingBag size={13} />
                            <span>{quoteCount} en Cotización</span>
                        </Link>
                    )}

                    {onClose && (
                        <button
                            onClick={onClose}
                            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-rose-500/20 hover:text-rose-400 transition-colors cursor-pointer"
                            title="Cerrar ventana"
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>
            </header>

            {/* ── SUB-HEADER: TABS SELECTOR (4 MÓDULOS REQUERIDOS) ── */}
            <div className="px-4 sm:px-6 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0">
                {[
                    { id: "actividades", label: "📋 Plan Diario & Actividades", badge: `${progressPercent}%` },
                    { id: "categorias", label: "🗂️ Categorías & Subcategorías", badge: "Catálogo" },
                    { id: "plan_laboral", label: "🎯 Plan Laboral & Metas", badge: `Meta $${dailyTarget}` },
                    { id: "mensajes", label: "💬 Mensajes para Copiar", badge: "Marketplace" }
                ].map((tab) => {
                    const isActive = activeTab === tab.id
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                                isActive
                                    ? "bg-emerald-500 text-black font-extrabold shadow-[0_0_15px_rgba(16,185,129,0.4)] scale-102"
                                    : "bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
                            }`}
                        >
                            <span>{tab.label}</span>
                            <span className={`text-[9px] px-1.5 py-0.2 rounded-md ${
                                isActive ? "bg-black/20 text-black" : "bg-slate-800 text-slate-400"
                            }`}>
                                {tab.badge}
                            </span>
                        </button>
                    )
                })}
            </div>

            {/* ── MAIN TAB BODY ── */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#040714] space-y-6">
                
                {/* ═══════════════════════════════════════════════════════════
                    TAB 1: PLAN DIARIO & REGISTRO DE ACTIVIDADES (CHECKLIST)
                ═══════════════════════════════════════════════════════════ */}
                {activeTab === "actividades" && (
                    <div className="max-w-5xl mx-auto space-y-6">
                        
                        {/* Daily Motivational Status Card */}
                        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900/80 to-cyan-950/40 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="space-y-1 text-center sm:text-left">
                                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5 justify-center sm:justify-start">
                                    <Sparkles size={13} />
                                    <span>Bitácora de Productividad Diaria</span>
                                </span>
                                <h3 className="text-lg font-extrabold text-white">
                                    {progressPercent === 100 
                                        ? "🎉 ¡Excelente trabajo! Completaste todas las actividades del día." 
                                        : `Llevas ${completedCount} de ${totalCount} actividades realizadas hoy`}
                                </h3>
                                <p className="text-xs text-slate-400 font-mono">
                                    Marca cada tarea al culminarla para registrar la hora exacta y mantener tu ritmo de ventas.
                                </p>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                                <div className="text-center p-3 rounded-2xl bg-black/40 border border-white/10 min-w-[90px]">
                                    <span className="text-2xl font-black text-emerald-400">{progressPercent}%</span>
                                    <span className="text-[9px] text-slate-400 block font-mono">PROGRESO</span>
                                </div>
                                <button
                                    onClick={handleResetActivities}
                                    className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all cursor-pointer"
                                    title="Reiniciar checklist de hoy"
                                >
                                    <RefreshCw size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Checklist Table / List */}
                        <div className="space-y-2.5">
                            <div className="flex items-center justify-between px-1">
                                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                                    Lista de Tareas & Tiempos Operativos
                                </span>
                                <span className="text-[10px] font-mono text-slate-500">
                                    Toca el checkbox para marcar como hecha
                                </span>
                            </div>

                            <div className="grid grid-cols-1 gap-2.5">
                                {activities.map((act) => {
                                    return (
                                        <div
                                            key={act.id}
                                            onClick={() => toggleActivity(act.id)}
                                            className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 group select-none ${
                                                act.completed
                                                    ? "bg-emerald-950/20 border-emerald-500/40 opacity-75"
                                                    : "bg-slate-900/80 border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900"
                                            }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <button 
                                                    type="button"
                                                    onClick={(e) => { e.stopPropagation(); toggleActivity(act.id) }}
                                                    className="mt-0.5 text-slate-400 group-hover:text-emerald-400 transition-colors"
                                                >
                                                    {act.completed ? (
                                                        <CheckCircle2 size={20} className="text-emerald-400 fill-emerald-500/20" />
                                                    ) : (
                                                        <Circle size={20} className="text-slate-600 group-hover:text-slate-400" />
                                                    )}
                                                </button>

                                                <div className="space-y-0.5">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <h4 className={`text-xs sm:text-sm font-bold transition-colors ${
                                                            act.completed ? "line-through text-slate-400" : "text-white group-hover:text-cyan-300"
                                                        }`}>
                                                            {act.title}
                                                        </h4>
                                                        <span className={`text-[9px] font-mono font-bold px-2 py-0.2 rounded-full uppercase ${
                                                            act.priority === "ALTA" 
                                                                ? "bg-rose-500/20 text-rose-300 border border-rose-500/40" 
                                                                : act.priority === "MEDIA" 
                                                                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" 
                                                                : "bg-slate-800 text-slate-400"
                                                        }`}>
                                                            {act.priority}
                                                        </span>
                                                        {act.completedAt && (
                                                            <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-1">
                                                                <Clock size={10} />
                                                                <span>Listo {act.completedAt}</span>
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-[11px] text-slate-400 font-mono">
                                                        {act.description}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Action shortcut or delete */}
                                            <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                                                {act.category === "marketplace" && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setActiveTab("mensajes")}
                                                        className="px-2 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold flex items-center gap-1 border border-emerald-500/30"
                                                    >
                                                        <span>Ver Scripts</span>
                                                        <ArrowRight size={10} />
                                                    </button>
                                                )}
                                                {act.title.includes("Suicide Squad") && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setActiveTab("categorias")}
                                                        className="px-2 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold flex items-center gap-1 border border-rose-500/30"
                                                    >
                                                        <span>Ver Catálogo</span>
                                                        <ArrowRight size={10} />
                                                    </button>
                                                )}
                                                {act.isCustom && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteActivity(act.id)}
                                                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                                                        title="Eliminar actividad"
                                                    >
                                                        <Trash2 size={13} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Add Custom Activity Form */}
                        <form onSubmit={handleAddActivity} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                            <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                                <Plus size={14} className="text-emerald-400" />
                                <span>Agregar Tarea Personalizada a la Ruta de Hoy</span>
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                <input
                                    type="text"
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    placeholder="Nombre de la actividad (ej. Entregar kit a cliente X)..."
                                    className="sm:col-span-2 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                                />
                                <div className="flex gap-2">
                                    <select
                                        value={newPriority}
                                        onChange={(e: any) => setNewPriority(e.target.value)}
                                        className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-400 flex-1"
                                    >
                                        <option value="ALTA">Prioridad Alta</option>
                                        <option value="MEDIA">Prioridad Media</option>
                                        <option value="RUTINA">Rutina</option>
                                    </select>
                                    <button
                                        type="submit"
                                        disabled={!newTitle.trim()}
                                        className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer shadow-md"
                                    >
                                        <Plus size={14} />
                                        <span>Agregar</span>
                                    </button>
                                </div>
                            </div>
                        </form>

                        {/* Bitácora / Notas Operacionales Rápidas */}
                        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-mono font-bold text-slate-300">
                                    📝 Notas & Novedades de la Jornada
                                </span>
                                {notesSaved && (
                                    <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                                        <Check size={12} />
                                        <span>Guardado</span>
                                    </span>
                                )}
                            </div>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                onBlur={handleSaveNotes}
                                rows={3}
                                placeholder="Escribe aquí notas rápidas, requerimientos especiales de clientes o pendientes para el día siguiente..."
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 font-mono"
                            />
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={handleSaveNotes}
                                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-bold cursor-pointer transition-colors"
                                >
                                    Guardar Notas
                                </button>
                            </div>
                        </div>

                    </div>
                )}

                {/* ═══════════════════════════════════════════════════════════
                    TAB 2: LISTADO DE CATEGORÍAS CON SUS SUBCATEGORÍAS DENTRO
                ═══════════════════════════════════════════════════════════ */}
                {activeTab === "categorias" && (
                    <div className="max-w-6xl mx-auto space-y-6">
                        
                        <div className="p-4 rounded-3xl bg-slate-900/90 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
                            <div>
                                <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
                                    <span>🗂️ Catálogo de Categorías & Subcategorías Jerárquicas</span>
                                </h3>
                                <p className="text-xs text-slate-400 font-mono">
                                    Explora las familias del catálogo, subcategorías filtradas y agrega productos a la cotización con 1 clic.
                                </p>
                            </div>
                            <Link
                                href="/web"
                                target="_blank"
                                className="px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold flex items-center gap-1.5 shrink-0"
                            >
                                <ExternalLink size={13} />
                                <span>Ver Tienda Completa</span>
                            </Link>
                        </div>

                        {/* Squad / Family Selector Pill bar */}
                        {loadingCatalog ? (
                            <div className="py-10 text-center space-y-2">
                                <RefreshCw size={24} className="animate-spin text-cyan-400 mx-auto" />
                                <p className="text-xs text-slate-400 font-mono">Cargando categorías y taxonomía de productos...</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <span className="text-[10px] font-mono font-bold uppercase text-slate-400">
                                        1. Selecciona la Categoría Principal:
                                    </span>
                                    <div className="flex flex-wrap gap-2">
                                        {squads.flatMap(s => s.categoryDetails || []).map((cat: any) => {
                                            const isSelected = selectedCategoryName === cat.name
                                            return (
                                                <button
                                                    key={cat.name}
                                                    onClick={() => loadSubcategoriesFor(cat.name)}
                                                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 ${
                                                        isSelected
                                                            ? "bg-cyan-400 text-black font-extrabold shadow-[0_0_15px_rgba(6,182,212,0.4)] scale-102"
                                                            : "bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700"
                                                    }`}
                                                >
                                                    <span>{cat.name}</span>
                                                    <span className={`text-[9px] px-1.5 py-0.2 rounded-md ${
                                                        isSelected ? "bg-black/20 text-black" : "bg-slate-800 text-slate-400"
                                                    }`}>
                                                        {cat.count}
                                                    </span>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>

                                {/* 2. Subcategories nested inside category */}
                                {selectedCategoryName && (
                                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-mono font-bold uppercase text-cyan-300 flex items-center gap-1.5">
                                                <FolderTree size={12} />
                                                <span>Subcategorías dentro de: &ldquo;{selectedCategoryName}&rdquo;</span>
                                            </span>
                                            {loadingSubs && (
                                                <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                                                    <RefreshCw size={10} className="animate-spin" />
                                                    <span>Cargando...</span>
                                                </span>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                            {subcategories.map((sub: any) => {
                                                const isSelectedSub = selectedSubId === sub.id
                                                return (
                                                    <button
                                                        key={sub.id}
                                                        onClick={() => loadProductsFor(selectedCategoryName, sub)}
                                                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                                                            isSelectedSub
                                                                ? "bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-md"
                                                                : "bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300"
                                                        }`}
                                                    >
                                                        <div className="flex items-center justify-between text-xs font-bold">
                                                            <span className="line-clamp-1">{sub.name}</span>
                                                            <span className="text-[9px] font-mono px-1 rounded bg-black/40 text-slate-400">
                                                                {sub.count}
                                                            </span>
                                                        </div>
                                                        {sub.description && (
                                                            <p className="text-[9px] text-slate-500 font-mono mt-0.5 line-clamp-1">
                                                                {sub.description}
                                                            </p>
                                                        )}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* 3. Products list with PVP and Action buttons */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                                            <ShoppingBag size={14} className="text-amber-400" />
                                            <span>Modelos Disponibles con PVP Público (IVA Inc.)</span>
                                        </span>
                                        <span className="text-[10px] font-mono text-slate-400">
                                            {productsList.length} productos listados
                                        </span>
                                    </div>

                                    {loadingProducts ? (
                                        <div className="py-8 text-center space-y-2">
                                            <RefreshCw size={20} className="animate-spin text-cyan-400 mx-auto" />
                                            <p className="text-xs text-slate-400 font-mono">Buscando productos de la subcategoría...</p>
                                        </div>
                                    ) : productsList.length === 0 ? (
                                        <div className="p-8 text-center rounded-2xl bg-slate-900/50 border border-slate-800 text-slate-400 text-xs font-mono">
                                            No hay productos en esta subcategoría o selecciona otra opción.
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                            {productsList.map((p: any) => {
                                                const pvp = p.pvp || p.price
                                                const isCopied = copiedProductKey === p.id
                                                let img = "/images/products/placeholder.jpg"
                                                try {
                                                    if (p.images) {
                                                        const parsed = JSON.parse(p.images)
                                                        if (Array.isArray(parsed) && parsed[0]) img = parsed[0]
                                                        else if (typeof parsed === "string") img = parsed
                                                    }
                                                } catch (e) {
                                                    if (p.images && p.images.startsWith("http")) img = p.images
                                                }

                                                return (
                                                    <div
                                                        key={p.id}
                                                        className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 flex flex-col justify-between space-y-2.5 transition-all group"
                                                    >
                                                        <div className="space-y-2">
                                                            <div className="aspect-video w-full rounded-xl bg-slate-950 overflow-hidden relative border border-slate-800">
                                                                <img
                                                                    src={img}
                                                                    alt={p.name}
                                                                    className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform"
                                                                    onError={(e: any) => { e.target.src = "https://placehold.co/400x300/0b1026/06b6d4?text=ATOMIC" }}
                                                                />
                                                                <span className="absolute top-1.5 right-1.5 text-[8px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/80 text-emerald-400 border border-emerald-500/30">
                                                                    Stock: {p.stock}
                                                                </span>
                                                            </div>

                                                            <h5 className="text-xs font-bold text-white line-clamp-2 leading-snug group-hover:text-cyan-300 transition-colors">
                                                                {p.name}
                                                            </h5>

                                                            <div className="flex items-center justify-between pt-1 border-t border-white/5">
                                                                <div>
                                                                    <span className="text-[9px] text-slate-500 block font-mono">PVP PÚBLICO</span>
                                                                    <span className="text-sm font-black text-emerald-400 font-mono">
                                                                        ${pvp.toFixed(2)}
                                                                    </span>
                                                                </div>
                                                                <span className="text-[9px] font-mono text-slate-400">
                                                                    IVA Inc.
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* 3 Action Buttons Requested by User */}
                                                        <div className="grid grid-cols-3 gap-1 pt-2 border-t border-slate-800">
                                                            {/* 1. Añadir a Cotización */}
                                                            <button
                                                                type="button"
                                                                onClick={() => handleAddProductToQuote(p)}
                                                                className="p-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[9px] font-mono font-bold flex flex-col items-center justify-center gap-0.5 border border-amber-500/40 cursor-pointer active:scale-95 transition-all"
                                                                title="Añadir a Cotización"
                                                            >
                                                                <Plus size={12} />
                                                                <span>Cotizar</span>
                                                            </button>

                                                            {/* 2. Compartir Pitch WhatsApp */}
                                                            <button
                                                                type="button"
                                                                onClick={() => copyProductPitch(p)}
                                                                className={`p-1.5 rounded-lg text-[9px] font-mono font-bold flex flex-col items-center justify-center gap-0.5 border cursor-pointer active:scale-95 transition-all ${
                                                                    isCopied
                                                                        ? "bg-emerald-500 text-black border-emerald-400 font-black"
                                                                        : "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border-emerald-500/40"
                                                                }`}
                                                                title="Copiar texto para WhatsApp"
                                                            >
                                                                {isCopied ? <Check size={12} /> : <Share2 size={12} />}
                                                                <span>{isCopied ? "¡Copiado!" : "Compartir"}</span>
                                                            </button>

                                                            {/* 3. Abrir en Tienda */}
                                                            <a
                                                                href={`/web/product/${p.id}`}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="p-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-[9px] font-mono font-bold flex flex-col items-center justify-center gap-0.5 border border-cyan-500/40 transition-all text-center"
                                                                title="Abrir en Tienda Web"
                                                            >
                                                                <ExternalLink size={12} />
                                                                <span>Abrir</span>
                                                            </a>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                    </div>
                )}

                {/* ═══════════════════════════════════════════════════════════
                    TAB 3: EL PLAN LABORAL & METAS
                ═══════════════════════════════════════════════════════════ */}
                {activeTab === "plan_laboral" && (
                    <div className="max-w-5xl mx-auto space-y-6">
                        
                        {/* Target Progress Banner */}
                        <div className="p-5 rounded-3xl bg-slate-900 border border-amber-500/40 space-y-4">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                                <div>
                                    <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                                        <Target size={14} />
                                        <span>Calculadora & Control de Meta Comercial Diaria</span>
                                    </span>
                                    <h3 className="text-base sm:text-lg font-black text-white">
                                        Meta del Día: ${dailyTarget} USD • Ventas Actuales: ${currentSales} USD
                                    </h3>
                                </div>

                                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center min-w-[140px]">
                                    <span className="text-[9px] text-slate-400 font-mono block">COMISIÓN ESTIMADA</span>
                                    <span className="text-xl font-black text-emerald-400 font-mono">+${earnedCommission}</span>
                                </div>
                            </div>

                            {/* Progress bar */}
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs font-mono">
                                    <span className="text-slate-400">Progreso a la meta:</span>
                                    <span className="font-bold text-amber-400">{salesProgress}%</span>
                                </div>
                                <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                                    <div 
                                        className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-300"
                                        style={{ width: `${salesProgress}%` }}
                                    />
                                </div>
                            </div>

                            {/* Interactive Target Adjusters */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-mono text-slate-400">Tu Meta de Hoy ($ USD):</label>
                                    <input 
                                        type="number"
                                        value={dailyTarget}
                                        onChange={(e) => setDailyTarget(Number(e.target.value) || 0)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-mono text-slate-400">Ventas Registradas Hoy ($ USD):</label>
                                    <input 
                                        type="number"
                                        value={currentSales}
                                        onChange={(e) => setCurrentSales(Number(e.target.value) || 0)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-emerald-400 font-bold focus:outline-none focus:border-emerald-400 font-mono"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-mono text-slate-400">% Comisión Vendedor:</label>
                                    <input 
                                        type="number"
                                        value={commissionRate}
                                        onChange={(e) => setCommissionRate(Number(e.target.value) || 0)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-cyan-300 font-bold focus:outline-none focus:border-cyan-400 font-mono"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Horario Operativo & Estructura Laboral */}
                        <div className="space-y-3">
                            <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                                ⏰ Cronograma Diario de Alto Rendimiento (Estructura Laboral)
                            </span>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {[
                                    {
                                        time: "08:30 - 09:30",
                                        title: "Apertura & Prospección Matutina",
                                        desc: "Revisar stock de Suicide Squad, responder primeros 10 mensajes en Marketplace con el link de la tienda web.",
                                        color: "border-cyan-500/30 text-cyan-400"
                                    },
                                    {
                                        time: "09:30 - 13:00",
                                        title: "Bloque de Alta Conversión & Cotizaciones",
                                        desc: "Emitir cotizaciones formales en PDF/Excel a clientes confirmados. Cierre de llamadas y seguimiento B2B.",
                                        color: "border-amber-500/30 text-amber-400"
                                    },
                                    {
                                        time: "14:00 - 16:30",
                                        title: "Difusión Masiva & Prospección Radar",
                                        desc: "Subir 1 video de Suicide Squad a estados y buscar 3 nuevos clientes potenciales en mapa o base de datos.",
                                        color: "border-purple-500/30 text-purple-400"
                                    },
                                    {
                                        time: "16:30 - 18:00",
                                        title: "Cierre Diario & Auditoría de Metas",
                                        desc: "Comprobar facturación, calcular comisión del día, ordenar pedidos pendientes para despacho por Servientrega.",
                                        color: "border-emerald-500/30 text-emerald-400"
                                    }
                                ].map((block, idx) => (
                                    <div key={idx} className={`p-4 rounded-2xl bg-slate-900 border ${block.color} space-y-1.5`}>
                                        <div className="flex items-center justify-between">
                                            <span className={`text-[10px] font-mono font-black px-2 py-0.5 rounded-full bg-black/40 ${block.color}`}>
                                                {block.time}
                                            </span>
                                            <Clock size={14} className="text-slate-500" />
                                        </div>
                                        <h4 className="text-xs font-bold text-white">{block.title}</h4>
                                        <p className="text-[11px] text-slate-400 font-mono">{block.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Las 5 Reglas de Oro de ATOMIC */}
                        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5">
                            <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                                <Award size={14} className="text-cyan-400" />
                                <span>Protocolo Comercial de Oro en ATOMIC</span>
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-slate-300">
                                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                                    <span className="text-emerald-400 font-bold">1. Velocidad:</span> Responder en menos de 5 min en Marketplace aumenta 7x la probabilidad de cierre.
                                </div>
                                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                                    <span className="text-emerald-400 font-bold">2. Pedir WhatsApp:</span> Nunca dar solo el precio sin solicitar el teléfono para enviar el catálogo en PDF.
                                </div>
                                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                                    <span className="text-emerald-400 font-bold">3. Seguridad:</span> Resaltar siempre la garantía de 1 año y la entrega con factura oficial con IVA.
                                </div>
                                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                                    <span className="text-emerald-400 font-bold">4. Portal de Bienvenida:</span> Si el cliente duda, envíale la carta de presentación con referencias reales.
                                </div>
                            </div>
                        </div>

                    </div>
                )}

                {/* ═══════════════════════════════════════════════════════════
                    TAB 4: MENSAJES PARA COPIAR Y PEGAR (SCRIPTS MARKETPLACE)
                ═══════════════════════════════════════════════════════════ */}
                {activeTab === "mensajes" && (
                    <div className="max-w-5xl mx-auto space-y-6">
                        <div className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/30 flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                    <MessageSquare size={16} className="text-emerald-400" />
                                    <span>Scripts para Copiar y Pegar en Redes Sociales & Marketplace</span>
                                </h3>
                                <p className="text-[11px] text-slate-400 font-mono">
                                    Respuestas optimizadas con enlace de tienda web, portal de bienvenida y solicitud de teléfono para WhatsApp.
                                </p>
                            </div>
                        </div>

                        {/* Direct embedding of full SalesCopyManager */}
                        <div className="rounded-3xl border border-slate-800 overflow-hidden bg-slate-950">
                            <SalesCopyManager />
                        </div>
                    </div>
                )}

            </div>
        </div>
    )

    // Return as standalone modal or embedded view
    if (embedded) {
        return content
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-2xl animate-in fade-in duration-200">
            <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 15 }}
                className="relative w-full max-w-7xl h-[94vh] bg-[#070b18] border-2 border-emerald-500/40 rounded-3xl shadow-[0_0_90px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden"
            >
                {content}
            </motion.div>
        </div>
    )
}
