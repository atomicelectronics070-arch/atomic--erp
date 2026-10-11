"use client"

import React, { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Flame, Users, ShieldAlert, Sparkles, CheckCircle2, AlertCircle,
    Copy, Check, Search, Filter, ArrowRight, ArrowLeft, Play, Pause, RotateCcw,
    Sliders, ExternalLink, Download, FileText, ChevronRight, X,
    Eye, Shield, Lock, Zap, Smartphone, Cpu, Video, MessageSquare,
    DollarSign, Clock, Trophy, Target, ArrowUpDown, UserPlus, Trash2,
    Share2, RefreshCw, FolderTree, Layers, ChevronDown, Plus, FileSpreadsheet
} from "lucide-react"

export interface SquadMember {
    id: string
    name: string
    email: string
    role?: string
    avatar?: string
    status?: "GRABANDO" | "EN_VIVO" | "STANDBY" | "EN_CRM"
    phone?: string
}

export interface SquadData {
    id: string
    code: string
    name: string
    subtitle: string
    priority: string
    priorityLevel: number
    viralScore: string
    ticketAvg: string
    colorTheme: "rose" | "emerald" | "amber" | "cyan" | "violet"
    categories: string[]
    categoryDetails?: {
        name: string
        count: number
    }[]
    productCount: number
    mission: string
    viralHook: string
    whatsappKeyword: string
    flagships: {
        name: string
        price: number
        stock: number
        img?: string
    }[]
    scriptTeleprompter: string
    members?: SquadMember[]
}

export interface SubcategoryItem {
    id: string
    name: string
    description?: string
    count: number
    keywords?: string[]
    isAll?: boolean
}

export interface ProductItem {
    id: string
    name: string
    price: number
    compareAtPrice?: number | null
    pvp?: number
    distributorPrice?: number | null
    publicUrl?: string
    whatsappPitch?: string
    sku?: string | null
    stock: number
    images?: string | null
    specSheetUrl?: string | null
    category?: { name: string; slug: string } | null
}

const THEME_STYLES: Record<string, {
    border: string
    borderHover: string
    badgeBg: string
    badgeText: string
    glow: string
    accentBg: string
    accentText: string
    btnPrimary: string
}> = {
    rose: {
        border: "border-rose-500/30",
        borderHover: "hover:border-rose-400/80",
        badgeBg: "bg-rose-500/15 border-rose-500/40",
        badgeText: "text-rose-400",
        glow: "rgba(244,63,94,0.25)",
        accentBg: "bg-rose-500/20",
        accentText: "text-rose-300",
        btnPrimary: "bg-rose-500 hover:bg-rose-400 text-black shadow-[0_0_15px_rgba(244,63,94,0.4)]"
    },
    emerald: {
        border: "border-emerald-500/30",
        borderHover: "hover:border-emerald-400/80",
        badgeBg: "bg-emerald-500/15 border-emerald-500/40",
        badgeText: "text-emerald-400",
        glow: "rgba(16,185,129,0.25)",
        accentBg: "bg-emerald-500/20",
        accentText: "text-emerald-300",
        btnPrimary: "bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]"
    },
    amber: {
        border: "border-amber-500/30",
        borderHover: "hover:border-amber-400/80",
        badgeBg: "bg-amber-500/15 border-amber-500/40",
        badgeText: "text-amber-400",
        glow: "rgba(245,158,11,0.25)",
        accentBg: "bg-amber-500/20",
        accentText: "text-amber-300",
        btnPrimary: "bg-amber-500 hover:bg-amber-400 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)]"
    },
    cyan: {
        border: "border-cyan-500/30",
        borderHover: "hover:border-cyan-400/80",
        badgeBg: "bg-cyan-500/15 border-cyan-500/40",
        badgeText: "text-cyan-400",
        glow: "rgba(6,182,212,0.25)",
        accentBg: "bg-cyan-500/20",
        accentText: "text-cyan-300",
        btnPrimary: "bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]"
    },
    violet: {
        border: "border-purple-500/30",
        borderHover: "hover:border-purple-400/80",
        badgeBg: "bg-purple-500/15 border-purple-500/40",
        badgeText: "text-purple-400",
        glow: "rgba(168,85,247,0.25)",
        accentBg: "bg-purple-500/20",
        accentText: "text-purple-300",
        btnPrimary: "bg-purple-500 hover:bg-purple-400 text-black shadow-[0_0_15px_rgba(168,85,247,0.4)]"
    }
}

export default function SuicideSquadWarRoom() {
    const [squads, setSquads] = useState<SquadData[]>([])
    const [systemUsers, setSystemUsers] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [activeTab, setActiveTab] = useState<"squads" | "playbook" | "simulator" | "calculator">("squads")

    // Modals
    const [selectedSquadForPlaybook, setSelectedSquadForPlaybook] = useState<SquadData | null>(null)
    const [assigningSquadId, setAssigningSquadId] = useState<string | null>(null)

    // User assignment modal state
    const [selectedUserToAdd, setSelectedUserToAdd] = useState("")
    const [customUserName, setCustomUserName] = useState("")

    // ── 3-LEVEL HIERARCHICAL CATALOG EXPLORER STATE ──
    const [explorerOpen, setExplorerOpen] = useState(false)
    const [explorerLevel, setExplorerLevel] = useState<1 | 2 | 3>(1) // 1: Squad Categories, 2: Subcategories, 3: Products
    const [activeSquad, setActiveSquad] = useState<SquadData | null>(null)
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [selectedSubcategory, setSelectedSubcategory] = useState<SubcategoryItem | null>(null)

    // Subcategories list
    const [subcategoriesList, setSubcategoriesList] = useState<SubcategoryItem[]>([])
    const [subcategoriesLoading, setSubcategoriesLoading] = useState(false)

    // Products modal state
    const [productsList, setProductsList] = useState<ProductItem[]>([])
    const [productsLoading, setProductsLoading] = useState(false)
    const [productSearch, setProductSearch] = useState("")
    const [productSort, setProductSort] = useState<"price_asc" | "price_desc" | "name_asc">("price_asc")
    const [totalProductsCount, setTotalProductsCount] = useState(0)

    // Simulator State
    const [simSeconds, setSimSeconds] = useState(0)
    const [isSimRunning, setIsSimRunning] = useState(false)

    // Calculator State
    const [dailyViews, setDailyViews] = useState(3000)

    // Copy alert
    const [copiedKey, setCopiedKey] = useState<string | null>(null)

    const copyToClipboard = (text: string, key: string) => {
        navigator.clipboard.writeText(text)
        setCopiedKey(key)
        setTimeout(() => setCopiedKey(null), 2500)
    }

    // ── QUOTATION ITEMS STATE & HANDLER ──
    const [quoteItems, setQuoteItems] = useState<{
        id: string
        productId: string
        description: string
        quantity: number
        unitPrice: number
        customImage?: string
    }[]>([])

    // Load quote items from localStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem('atomic_quote_items')
            if (saved) {
                const parsed = JSON.parse(saved)
                if (Array.isArray(parsed)) {
                    setQuoteItems(parsed.filter((it: any) => it.description || it.productId))
                }
            }
        } catch (e) {}
    }, [])

    const handleAddToQuote = (p: ProductItem) => {
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

        setQuoteItems(prev => {
            const cleanPrev = prev.filter(it => it.productId || it.description)
            const existingIndex = cleanPrev.findIndex(item => item.productId === p.id)
            let updated: typeof prev = []

            if (existingIndex >= 0) {
                updated = cleanPrev.map((item, idx) =>
                    idx === existingIndex ? { ...item, quantity: item.quantity + 1 } : item
                )
            } else {
                const newItem = {
                    id: String(Date.now() + Math.random()),
                    productId: p.id,
                    description: p.name,
                    quantity: 1,
                    unitPrice: pvp,
                    customImage: photoUrl || undefined
                }
                updated = [...cleanPrev, newItem]
            }

            try {
                localStorage.setItem('atomic_quote_items', JSON.stringify(updated))
                // Also synchronize to atomic_cart
                const currentCartStr = localStorage.getItem('atomic_cart')
                let currentCart = currentCartStr ? JSON.parse(currentCartStr) : []
                if (Array.isArray(currentCart)) {
                    const existingInCart = currentCart.find((it: any) => it.id === p.id)
                    if (existingInCart) {
                        existingInCart.quantity += 1
                    } else {
                        currentCart.push({
                            id: p.id,
                            name: p.name,
                            price: pvp,
                            quantity: 1,
                            image: photoUrl || undefined
                        })
                    }
                    localStorage.setItem('atomic_cart', JSON.stringify(currentCart))
                }
            } catch (e) {}

            return updated
        })

        setCopiedKey(`quoted-${p.id}`)
        setTimeout(() => setCopiedKey(null), 2000)
    }

    const quoteItemsCount = quoteItems.reduce((acc, it) => acc + (it.quantity || 1), 0)
    const quoteTotalPvp = quoteItems.reduce((acc, it) => acc + ((it.unitPrice || 0) * (it.quantity || 1)), 0)

    // ── 1. LOAD SQUADS & MEMBERS ──
    const loadSquadsData = async () => {
        setIsLoading(true)
        try {
            const res = await fetch("/api/tools/suicide-squad")
            const data = await res.json()
            if (data.success) {
                setSquads(data.squads)
                setSystemUsers(data.systemUsers || [])
            }
        } catch (e) {
            console.error("Error loading suicide squads:", e)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        loadSquadsData()
    }, [])

    // ── 2. SAVE ASSIGNMENTS PERSISTENTLY ──
    const handleSaveAssignments = async (updatedSquads: SquadData[]) => {
        setIsSaving(true)
        try {
            const assignmentsMap: Record<string, SquadMember[]> = {}
            updatedSquads.forEach(s => {
                assignmentsMap[s.id] = s.members || []
            })

            await fetch("/api/tools/suicide-squad", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ assignments: assignmentsMap })
            })
        } catch (e) {
            console.error("Error saving assignments:", e)
        } finally {
            setIsSaving(false)
        }
    }

    // Assign a member to a squad
    const handleAddMember = (squadId: string) => {
        let memberToAdd: SquadMember | null = null

        if (selectedUserToAdd) {
            const user = systemUsers.find(u => u.id === selectedUserToAdd)
            if (user) {
                memberToAdd = {
                    id: user.id,
                    name: user.name || user.email.split("@")[0],
                    email: user.email,
                    role: user.role,
                    status: "GRABANDO",
                    avatar: user.name?.slice(0, 2).toUpperCase() || "OP"
                }
            }
        } else if (customUserName.trim()) {
            memberToAdd = {
                id: `custom-${Date.now()}`,
                name: customUserName.trim(),
                email: "colaborador@atomic.com.ec",
                role: "CREADOR VIRAL",
                status: "GRABANDO",
                avatar: customUserName.trim().slice(0, 2).toUpperCase()
            }
        }

        if (!memberToAdd) return

        const updated = squads.map(s => {
            if (s.id === squadId) {
                const currentMembers = s.members || []
                // Prevent duplicate user
                if (currentMembers.some(m => m.id === memberToAdd!.id)) return s
                return {
                    ...s,
                    members: [...currentMembers, memberToAdd!]
                }
            }
            return s
        })

        setSquads(updated)
        handleSaveAssignments(updated)
        setAssigningSquadId(null)
        setSelectedUserToAdd("")
        setCustomUserName("")
    }

    // Remove a member from a squad
    const handleRemoveMember = (squadId: string, memberId: string) => {
        const updated = squads.map(s => {
            if (s.id === squadId) {
                return {
                    ...s,
                    members: (s.members || []).filter(m => m.id !== memberId)
                }
            }
            return s
        })
        setSquads(updated)
        handleSaveAssignments(updated)
    }

    // ── 3. HIERARCHICAL EXPLORER LOGIC (NIVELES 1, 2 Y 3) ──
    // Open from squad card directly into Level 2 (Subcategories of a selected category)
    const handleOpenCategoryDirectly = (squad: SquadData, categoryName: string) => {
        setActiveSquad(squad)
        setSelectedCategory(categoryName)
        setSelectedSubcategory(null)
        setExplorerLevel(2)
        setExplorerOpen(true)
        fetchSubcategories(categoryName)
    }

    // Open at Level 1 (All categories belonging to this squad)
    const handleOpenSquadCategories = (squad: SquadData) => {
        setActiveSquad(squad)
        setSelectedCategory(null)
        setSelectedSubcategory(null)
        setExplorerLevel(1)
        setExplorerOpen(true)
    }

    // Level 2: Fetch subcategories for the chosen category
    const fetchSubcategories = async (categoryName: string) => {
        setSubcategoriesLoading(true)
        try {
            const res = await fetch(`/api/tools/suicide-squad?action=subcategories&categoryName=${encodeURIComponent(categoryName)}`)
            const data = await res.json()
            if (data.success) {
                setSubcategoriesList(data.subcategories || [])
            }
        } catch (e) {
            console.error("Error fetching subcategories:", e)
        } finally {
            setSubcategoriesLoading(false)
        }
    }

    // Level 3: Select a subcategory and load its products
    const handleSelectSubcategory = (sub: SubcategoryItem) => {
        setSelectedSubcategory(sub)
        setExplorerLevel(3)
        setProductSearch("")
        setProductSort("price_asc")
        fetchProducts(selectedCategory || "", sub, "", "price_asc")
    }

    // Level 3: Fetch products with filters
    const fetchProducts = async (categoryName: string, sub: SubcategoryItem | null, query: string = "", sort: string = "price_asc") => {
        setProductsLoading(true)
        try {
            const kwParam = sub && !sub.isAll && sub.keywords && sub.keywords.length > 0
                ? `&keywords=${encodeURIComponent(sub.keywords.join(','))}`
                : ""
            const squadParam = activeSquad ? `&squadId=${activeSquad.id}` : ""
            const catParam = categoryName ? `&categoryName=${encodeURIComponent(categoryName)}` : ""

            const url = `/api/tools/suicide-squad?action=products${catParam}${squadParam}${kwParam}&query=${encodeURIComponent(query)}&sortBy=${sort}&limit=100`
            const res = await fetch(url)
            const data = await res.json()
            if (data.success) {
                setProductsList(data.products || [])
                setTotalProductsCount(data.total || 0)
            }
        } catch (e) {
            console.error("Error fetching products:", e)
        } finally {
            setProductsLoading(false)
        }
    }

    // Debounced search for products in Level 3
    useEffect(() => {
        if (!explorerOpen || explorerLevel !== 3 || !selectedCategory) return
        const timer = setTimeout(() => {
            fetchProducts(selectedCategory, selectedSubcategory, productSearch, productSort)
        }, 350)
        return () => clearTimeout(timer)
    }, [productSearch, productSort])

    // Breadcrumb navigation back
    const handleNavigateBack = () => {
        if (explorerLevel === 3) {
            setExplorerLevel(2)
            setSelectedSubcategory(null)
            setProductSearch("")
        } else if (explorerLevel === 2) {
            setExplorerLevel(1)
            setSelectedCategory(null)
            setSelectedSubcategory(null)
        } else {
            setExplorerOpen(false)
        }
    }

    // Share product via Web Share API or Clipboard with PVP
    const handleShareProduct = async (p: ProductItem) => {
        const pvp = p.pvp || p.price
        const url = p.publicUrl || `https://atomiccotizador.shop/web/product/${p.id}`
        const text = `🔥 *${p.name}*\n🏷️ *PVP PÚBLICO:* $${pvp.toFixed(2)} (Inc. IVA)\n📦 *Disponibilidad:* ${p.stock > 0 ? `${p.stock} unidades en stock` : 'Bajo pedido con entrega inmediata'}\n🛡️ Garantía local en Ecuador y factura autorizada.\n🔗 *Ver y comprar aquí:* ${url}\n\n📲 *Asesoría directa en ATOMIC:* https://wa.me/593963226319?text=Hola,%20deseo%20comprar%20este%20producto:%20${encodeURIComponent(p.name)}`

        if (typeof navigator !== "undefined" && navigator.share) {
            try {
                await navigator.share({
                    title: p.name,
                    text: text,
                    url: url
                })
                setCopiedKey(`shared-${p.id}`)
                setTimeout(() => setCopiedKey(null), 2500)
                return
            } catch (e) {
                // Ignore abort error, proceed to clipboard
            }
        }

        copyToClipboard(text, `shared-${p.id}`)
    }

    // ── 4. SIMULATOR TIMER (0-25s) ──
    useEffect(() => {
        let interval: any = null
        if (isSimRunning) {
            interval = setInterval(() => {
                setSimSeconds(prev => {
                    if (prev >= 25) {
                        setIsSimRunning(false)
                        return 25
                    }
                    return prev + 1
                })
            }, 1000)
        }
        return () => clearInterval(interval)
    }, [isSimRunning])

    return (
        <div className="space-y-6">
            {/* Top Navigation & Status Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-[#080d22] border border-cyan-500/20 shadow-2xl">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                        <Flame size={20} className="animate-pulse" />
                    </div>
                    <div>
                        <h2 className="text-base sm:text-lg font-black text-white tracking-wide flex items-center gap-2">
                            <span>SUICIDE SQUAD WAR ROOM</span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                                5 ESCUADRAS ACTIVAS
                            </span>
                        </h2>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">
                            Explorador de Categorías, Subcategorías y Productos con PVP Público para Ventas
                        </p>
                    </div>
                </div>

                {/* Tab Navigation Buttons */}
                <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950/80 border border-slate-800">
                    <button
                        onClick={() => setActiveTab("squads")}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                            activeTab === "squads"
                                ? "bg-cyan-500 text-black font-extrabold shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                                : "text-slate-400 hover:text-white"
                        }`}
                    >
                        <ShieldAlert size={13} />
                        <span>Escuadras Virales (5)</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("playbook")}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                            activeTab === "playbook"
                                ? "bg-rose-500 text-black font-extrabold shadow-[0_0_15px_rgba(244,63,94,0.4)]"
                                : "text-slate-400 hover:text-white"
                        }`}
                    >
                        <Sparkles size={13} />
                        <span>Playbook de 25s</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("simulator")}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                            activeTab === "simulator"
                                ? "bg-amber-500 text-black font-extrabold shadow-[0_0_15px_rgba(245,158,11,0.4)]"
                                : "text-slate-400 hover:text-white"
                        }`}
                    >
                        <Clock size={13} />
                        <span>Simulador 25s</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("calculator")}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                            activeTab === "calculator"
                                ? "bg-emerald-500 text-black font-extrabold shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                                : "text-slate-400 hover:text-white"
                        }`}
                    >
                        <Trophy size={13} />
                        <span>Calculadora Leads</span>
                    </button>
                </div>
            </div>

            {/* ── 1. MAIN TAB: THE 5 SQUADS CARDS (UNA TARJETA POR CATEGORÍA) ── */}
            {activeTab === "squads" && (
                <div className="space-y-6">
                    {isLoading ? (
                        <div className="p-12 text-center text-slate-400 font-mono text-sm animate-pulse">
                            Cargando las 5 Escuadras Virales y conectando con el catálogo de 9,736 productos...
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {squads.map((squad) => {
                                const style = THEME_STYLES[squad.colorTheme] || THEME_STYLES.rose
                                const members = squad.members || []

                                return (
                                    <div
                                        key={squad.id}
                                        className={`rounded-3xl bg-[#080d22]/95 border-2 ${style.border} ${style.borderHover} p-5 flex flex-col justify-between transition-all duration-300 shadow-xl relative overflow-hidden group hover:-translate-y-1`}
                                        style={{ boxShadow: `0 8px 30px rgba(0,0,0,0.6)` }}
                                    >
                                        {/* Top Card Bar: Code, Priority, Viral Gauge */}
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-2.5 py-1 rounded-xl text-xs font-mono font-black border ${style.badgeBg} ${style.badgeText}`}>
                                                        {squad.code}
                                                    </span>
                                                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
                                                        {squad.priority}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-right">
                                                    <span className="text-[10px] font-mono text-slate-400">Viral:</span>
                                                    <span className={`text-xs font-mono font-black ${style.accentText}`}>
                                                        {squad.viralScore}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Squad Title & Mission */}
                                            <div>
                                                <h3 className="text-base sm:text-lg font-black text-white group-hover:text-cyan-300 transition-colors">
                                                    {squad.name}
                                                </h3>
                                                <p className="text-xs font-bold text-slate-300">
                                                    {squad.subtitle}
                                                </p>
                                                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed line-clamp-2">
                                                    {squad.mission}
                                                </p>
                                            </div>

                                            {/* ── BOTONES DE CADA CATEGORÍA (NIVEL 1) ── */}
                                            <div className="pt-2 border-t border-slate-800/80 space-y-2">
                                                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                                                    <span className="flex items-center gap-1.5 font-bold text-cyan-300">
                                                        <FolderTree size={12} />
                                                        Categorías del Escuadrón ({squad.categories.length}):
                                                    </span>
                                                    <span className="text-[9px] text-slate-500 font-mono">Clic para subfamilias</span>
                                                </div>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {squad.categories.map((catName) => {
                                                        const detail = squad.categoryDetails?.find(c => c.name.toLowerCase() === catName.toLowerCase())
                                                        const count = detail?.count ?? 0
                                                        return (
                                                            <button
                                                                key={catName}
                                                                onClick={() => handleOpenCategoryDirectly(squad, catName)}
                                                                className="group/cat flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/95 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-400 text-xs font-mono text-slate-200 hover:text-white transition-all cursor-pointer shadow-sm active:scale-95 hover:scale-[1.02]"
                                                                title={`Explorar subcategorías de ${catName}`}
                                                            >
                                                                <span className="font-semibold">{catName}</span>
                                                                {count > 0 && (
                                                                    <span className="px-1.5 py-0.2 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-[10px] text-cyan-300 font-bold">
                                                                        {count}
                                                                    </span>
                                                                )}
                                                                <ChevronRight size={11} className="text-slate-500 group-hover/cat:text-cyan-400 group-hover/cat:translate-x-0.5 transition-transform" />
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                            </div>

                                            {/* Viral Hook Preview Box */}
                                            <div className="p-3 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-1">
                                                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                                                    <span className="flex items-center gap-1 font-bold text-amber-300">
                                                        <Sparkles size={11} />
                                                        Gancho Psicológico Viral:
                                                    </span>
                                                    <button
                                                        onClick={() => copyToClipboard(squad.viralHook, `hook-${squad.id}`)}
                                                        className="hover:text-white transition-colors cursor-pointer"
                                                        title="Copiar gancho"
                                                    >
                                                        {copiedKey === `hook-${squad.id}` ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                                                    </button>
                                                </div>
                                                <p className="text-[11px] text-slate-200 italic">
                                                    "{squad.viralHook}"
                                                </p>
                                            </div>

                                            {/* Assigned Members Section */}
                                            <div className="pt-2 border-t border-slate-800/80">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                                        <Users size={12} />
                                                        Miembros a Cargo ({members.length}):
                                                    </span>
                                                    <button
                                                        onClick={() => setAssigningSquadId(squad.id)}
                                                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg border flex items-center gap-1 transition-all cursor-pointer ${style.badgeBg} ${style.badgeText} hover:scale-105`}
                                                    >
                                                        <UserPlus size={11} />
                                                        <span>+ Asignar</span>
                                                    </button>
                                                </div>

                                                {members.length === 0 ? (
                                                    <div className="p-2.5 rounded-xl border border-dashed border-slate-800 text-center text-[10px] font-mono text-slate-500">
                                                        Sin colaborador asignado aún. Clic en '+ Asignar'.
                                                    </div>
                                                ) : (
                                                    <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
                                                        {members.map((m) => (
                                                            <div
                                                                key={m.id}
                                                                className="flex items-center justify-between p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs"
                                                            >
                                                                <div className="flex items-center gap-2 min-w-0">
                                                                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[10px] text-black ${style.btnPrimary}`}>
                                                                        {m.avatar || m.name.slice(0, 2).toUpperCase()}
                                                                    </div>
                                                                    <div className="min-w-0">
                                                                        <div className="font-bold text-white text-[11px] truncate">{m.name}</div>
                                                                        <div className="text-[9px] font-mono text-slate-400 truncate">{m.role || "Ventas"}</div>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-1.5 shrink-0">
                                                                    <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                                                                        {m.status || "GRABANDO"}
                                                                    </span>
                                                                    <button
                                                                        onClick={() => handleRemoveMember(squad.id, m.id)}
                                                                        className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                                                                        title="Remover miembro"
                                                                    >
                                                                        <Trash2 size={12} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Flagship Products Preview Mini-Grid */}
                                            <div className="pt-2 border-t border-slate-800/80">
                                                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1.5">
                                                    <span>Productos Insignia (Top Ventas):</span>
                                                    <span className="text-cyan-400 font-bold">{squad.productCount} en catálogo</span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-1.5">
                                                    {squad.flagships.slice(0, 2).map((item, i) => (
                                                        <div key={i} className="p-2 rounded-xl bg-slate-950 border border-slate-800/90">
                                                            <div className="text-[10px] font-bold text-white line-clamp-1" title={item.name}>
                                                                {item.name}
                                                            </div>
                                                            <div className="flex items-center justify-between mt-1 text-[9px] font-mono">
                                                                <span className="text-emerald-400 font-bold">${item.price.toFixed(2)}</span>
                                                                <span className="text-slate-500">Stock: {item.stock}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bottom Actions: 1) Ver Plan Viral, 2) Explorar Catálogo Jerárquico */}
                                        <div className="pt-4 mt-4 border-t border-slate-800 flex gap-2">
                                            <button
                                                onClick={() => setSelectedSquadForPlaybook(squad)}
                                                className="flex-1 py-2.5 px-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
                                            >
                                                <FileText size={13} className="text-cyan-400" />
                                                <span>Plan & Guión</span>
                                            </button>

                                            <button
                                                onClick={() => handleOpenSquadCategories(squad)}
                                                className={`flex-1 py-2.5 px-3 rounded-2xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 ${style.btnPrimary}`}
                                            >
                                                <Eye size={13} />
                                                <span>Explorar Todo ({squad.productCount})</span>
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* ── 2. PLAYBOOK TAB (ESTRATEGIA COMPLETA & GUIONES) ── */}
            {activeTab === "playbook" && (
                <div className="p-6 rounded-3xl bg-[#080d22] border-2 border-cyan-500/30 space-y-6 max-w-5xl mx-auto">
                    <div className="text-center space-y-2">
                        <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                            MANUAL MAESTRO DE RETENCIÓN DE VIDEO CORTO (TIKTOK / REELS / SHORTS)
                        </span>
                        <h3 className="text-2xl font-black text-white">
                            La Fórmula Científica de 25 Segundos para Vender Hardware
                        </h3>
                        <p className="text-xs text-slate-400 max-w-2xl mx-auto font-sans">
                            Cada uno de tus colaboradores debe aplicar esta estructura sin desviarse. No se venden características; se vende paz mental y dolor resuelto en Ecuador.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {[
                            {
                                sec: "0s - 3s",
                                title: "1. GANCHO DISRUPTIVO",
                                badge: "Romper el Scroll",
                                color: "border-rose-500/50 bg-rose-500/10 text-rose-300",
                                desc: "Ruido visual, golpe con el producto o pregunta incómoda. Prohibido saludar con 'Hola amigos'."
                            },
                            {
                                sec: "3s - 12s",
                                title: "2. SHOW, DON'T TELL",
                                badge: "Demostración Real",
                                color: "border-cyan-500/50 bg-cyan-500/10 text-cyan-300",
                                desc: "El producto físico en la mano. La cámara iluminando de noche o la cerradura abriendo en 0.3 segundos."
                            },
                            {
                                sec: "12s - 20s",
                                title: "3. DERRIBO OBJECIÓN",
                                badge: "Precio & Facilidad",
                                color: "border-amber-500/50 bg-amber-500/10 text-amber-300",
                                desc: "Aclarar que no hay cuotas mensuales y que cuesta menos que un almuerzo. Instalación fácil en 5 minutos."
                            },
                            {
                                sec: "20s - 25s",
                                title: "4. LLAMADO A LA ACCIÓN",
                                badge: "Ruta al CRM",
                                color: "border-emerald-500/50 bg-emerald-500/10 text-emerald-300",
                                desc: "Palabra clave única hacia WhatsApp. El bot responde en 2 segundos con cotización y PDF formal."
                            }
                        ].map((step, idx) => (
                            <div key={idx} className={`p-4 rounded-2xl border ${step.color} space-y-2`}>
                                <div className="flex items-center justify-between text-xs font-mono font-black">
                                    <span>{step.sec}</span>
                                    <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-black/40">{step.badge}</span>
                                </div>
                                <h4 className="font-bold text-white text-sm">{step.title}</h4>
                                <p className="text-xs text-slate-300 leading-relaxed">{step.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                        <h4 className="font-bold text-white text-sm flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-emerald-400" />
                            Checklist Técnico Antes de Darle a "Grabar":
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-slate-300">
                            <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800">
                                <input type="checkbox" defaultChecked className="rounded text-cyan-500" />
                                <span>Micrófono inalámbrico conectado y probado (Cero eco)</span>
                            </label>
                            <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800">
                                <input type="checkbox" defaultChecked className="rounded text-cyan-500" />
                                <span>Iluminación frontal limpia (Lente de cámara limpio)</span>
                            </label>
                            <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800">
                                <input type="checkbox" defaultChecked className="rounded text-cyan-500" />
                                <span>Subtítulos dinámicos de alto contraste en CapCut</span>
                            </label>
                            <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800">
                                <input type="checkbox" defaultChecked className="rounded text-cyan-500" />
                                <span>Hashtags geolocalizados: #Ecuador #Quito #Guayaquil</span>
                            </label>
                        </div>
                    </div>
                </div>
            )}

            {/* ── 3. SIMULATOR TAB (CRONÓMETRO DE 25s PARA ENSAYAR) ── */}
            {activeTab === "simulator" && (
                <div className="p-8 rounded-3xl bg-[#080d22] border-2 border-amber-500/30 text-center space-y-6 max-w-xl mx-auto">
                    <div>
                        <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                            TELEPROMPTER & ENSAYO EN TIEMPO REAL
                        </span>
                        <h3 className="text-2xl font-black text-white mt-2">
                            Simulador de Retención de 25 Segundos
                        </h3>
                        <p className="text-xs text-slate-400 font-sans mt-1">
                            Pon tu celular frente a ti, dale a "Iniciar" y ensaya tu discurso sin pasarte de los tiempos clave.
                        </p>
                    </div>

                    <div className="w-44 h-44 rounded-full border-4 border-amber-500/40 bg-slate-950 flex flex-col items-center justify-center mx-auto shadow-[0_0_40px_rgba(245,158,11,0.2)]">
                        <span className="text-5xl font-mono font-black text-amber-400">
                            {simSeconds.toString().padStart(2, "0")}s
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 mt-1">
                            {simSeconds < 3 ? "🔥 GANCHO DISRUPTIVO" :
                             simSeconds < 12 ? "👀 DEMOSTRACIÓN FÍSICA" :
                             simSeconds < 20 ? "💡 PRECIO & GARANTÍA" : "📲 CALL TO ACTION WHATSAPP"}
                        </span>
                    </div>

                    <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-800">
                        <div
                            className="h-full bg-gradient-to-r from-amber-500 via-rose-500 to-emerald-500 transition-all duration-300"
                            style={{ width: `${(simSeconds / 25) * 100}%` }}
                        />
                    </div>

                    <div className="flex justify-center gap-3">
                        <button
                            onClick={() => setIsSimRunning(!isSimRunning)}
                            className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs font-mono flex items-center gap-2 cursor-pointer shadow-lg"
                        >
                            {isSimRunning ? <Pause size={15} /> : <Play size={15} />}
                            <span>{isSimRunning ? "Pausar" : "Iniciar Ensayo"}</span>
                        </button>
                        <button
                            onClick={() => { setIsSimRunning(false); setSimSeconds(0) }}
                            className="px-4 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                        >
                            <RotateCcw size={14} />
                            <span>Reiniciar</span>
                        </button>
                    </div>
                </div>
            )}

            {/* ── 4. CALCULATOR TAB (PROYECTOR DE LEADS & INGRESOS) ── */}
            {activeTab === "calculator" && (
                <div className="p-8 rounded-3xl bg-[#080d22] border-2 border-emerald-500/30 space-y-6 max-w-2xl mx-auto">
                    <div className="text-center space-y-2">
                        <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                            PROYECCIÓN MATEMÁTICA DE CRECIMIENTO VIRAL
                        </span>
                        <h3 className="text-2xl font-black text-white">
                            ¿Cuánto Produce el Suicide Squad al Mes?
                        </h3>
                        <p className="text-xs text-slate-400 font-sans">
                            Ajusta el promedio de visualizaciones por video para ver la cantidad de prospectos automáticos ingresando al WhatsApp CRM de ATOMIC.
                        </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                        <div className="flex justify-between text-xs font-mono">
                            <span className="text-slate-400">Visualizaciones promedio por video:</span>
                            <span className="text-emerald-400 font-bold">{dailyViews.toLocaleString()} views</span>
                        </div>
                        <input
                            type="range"
                            min={1000}
                            max={50000}
                            step={500}
                            value={dailyViews}
                            onChange={(e) => setDailyViews(Number(e.target.value))}
                            className="w-full accent-emerald-500 cursor-pointer"
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-center">
                        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                            <span className="text-[10px] font-mono text-slate-400 block uppercase">Alcance Mensual</span>
                            <span className="text-lg sm:text-xl font-black text-white font-mono mt-1 block">
                                {(dailyViews * 10 * 30).toLocaleString()}
                            </span>
                            <span className="text-[9px] text-slate-500 font-mono">personas en Ecuador</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30">
                            <span className="text-[10px] font-mono text-emerald-400 block uppercase">Leads WhatsApp</span>
                            <span className="text-lg sm:text-xl font-black text-emerald-300 font-mono mt-1 block">
                                {Math.round((dailyViews * 10 * 30) * 0.0035).toLocaleString()}
                            </span>
                            <span className="text-[9px] text-slate-400 font-mono">conversaciones (0.35%)</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30">
                            <span className="text-[10px] font-mono text-cyan-400 block uppercase">Ventas Estimadas</span>
                            <span className="text-lg sm:text-xl font-black text-cyan-300 font-mono mt-1 block">
                                ${Math.round((dailyViews * 10 * 30 * 0.0035 * 0.12) * 110).toLocaleString()}
                            </span>
                            <span className="text-[9px] text-slate-400 font-mono">ticket prom. $110</span>
                        </div>
                    </div>
                </div>
            )}

            {/* ── MODAL 1: ASIGNAR MIEMBRO A ESCUADRA ── */}
            <AnimatePresence>
                {assigningSquadId && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
                        <div className="w-full max-w-md bg-[#090e24] border-2 border-cyan-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                <h3 className="font-black text-white text-base flex items-center gap-2">
                                    <UserPlus size={18} className="text-cyan-400" />
                                    <span>Asignar Colaborador al Escuadrón</span>
                                </h3>
                                <button
                                    onClick={() => setAssigningSquadId(null)}
                                    className="p-1 rounded-xl text-slate-400 hover:text-white"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs font-mono text-slate-300 block mb-1.5">
                                        Seleccionar usuario registrado del sistema:
                                    </label>
                                    <select
                                        value={selectedUserToAdd}
                                        onChange={(e) => {
                                            setSelectedUserToAdd(e.target.value)
                                            if (e.target.value) setCustomUserName("")
                                        }}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                                    >
                                        <option value="">-- Seleccionar usuario --</option>
                                        {systemUsers.map(u => (
                                            <option key={u.id} value={u.id}>
                                                {u.name || u.email} ({u.role})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="text-center text-[10px] font-mono text-slate-500">
                                    - O ingresa un colaborador manual -
                                </div>

                                <div>
                                    <label className="text-xs font-mono text-slate-300 block mb-1.5">
                                        Nombre del Colaborador / Creador:
                                    </label>
                                    <input
                                        type="text"
                                        value={customUserName}
                                        onChange={(e) => {
                                            setCustomUserName(e.target.value)
                                            if (e.target.value) setSelectedUserToAdd("")
                                        }}
                                        placeholder="Ej: David Proaño (Tiktoker Oficial)"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-2 pt-2 border-t border-slate-800">
                                <button
                                    onClick={() => setAssigningSquadId(null)}
                                    className="flex-1 py-2.5 rounded-2xl bg-slate-900 text-slate-400 hover:text-white font-mono text-xs"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={() => handleAddMember(assigningSquadId)}
                                    disabled={!selectedUserToAdd && !customUserName.trim()}
                                    className="flex-1 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-mono text-xs disabled:opacity-50 cursor-pointer"
                                >
                                    Confirmar Asignación
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </AnimatePresence>

            {/* ── MODAL 2: PLAYBOOK & GUIÓN VIRAL DEL SQUAD ── */}
            <AnimatePresence>
                {selectedSquadForPlaybook && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
                        <div className="w-full max-w-2xl bg-[#090e24] border-2 border-cyan-500/40 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-mono font-black px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                                            {selectedSquadForPlaybook.code}
                                        </span>
                                        <h4 className="font-black text-white text-base">
                                            {selectedSquadForPlaybook.name}
                                        </h4>
                                    </div>
                                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                                        {selectedSquadForPlaybook.subtitle}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedSquadForPlaybook(null)}
                                    className="p-1 rounded-xl text-slate-400 hover:text-white"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-mono font-bold text-amber-300 flex items-center gap-1.5">
                                        <FileText size={14} />
                                        Guión Teleprompter Listo para Grabar:
                                    </span>
                                    <button
                                        onClick={() => copyToClipboard(selectedSquadForPlaybook.scriptTeleprompter, "script-copy")}
                                        className="px-3 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-mono text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5 cursor-pointer"
                                    >
                                        {copiedKey === "script-copy" ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                                        <span>{copiedKey === "script-copy" ? "¡Copiado!" : "Copiar Guión"}</span>
                                    </button>
                                </div>
                                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-line select-all">
                                    {selectedSquadForPlaybook.scriptTeleprompter}
                                </div>
                            </div>

                            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between">
                                <div>
                                    <span className="text-[10px] font-mono text-emerald-400 block uppercase font-bold">
                                        Palabra Clave de Activación Bot WhatsApp:
                                    </span>
                                    <span className="text-base font-black text-white font-mono mt-0.5 block">
                                        "{selectedSquadForPlaybook.whatsappKeyword}"
                                    </span>
                                </div>
                                <button
                                    onClick={() => {
                                        window.open(`https://wa.me/593963226319?text=Hola,%20vi%20el%20video%20de%20${selectedSquadForPlaybook.whatsappKeyword}`, "_blank")
                                    }}
                                    className="px-4 py-2 rounded-xl bg-emerald-500 text-black font-bold text-xs font-mono flex items-center gap-1.5 cursor-pointer shadow-md"
                                >
                                    <MessageSquare size={13} />
                                    <span>Probar en WhatsApp</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </AnimatePresence>

            {/* ── MODAL 3: EXPLORADOR JERÁRQUICO (NIVEL 1: CATEGORÍAS -> NIVEL 2: SUBCATEGORÍAS -> NIVEL 3: PRODUCTOS CON PVP) ── */}
            <AnimatePresence>
                {explorerOpen && activeSquad && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-black/90 backdrop-blur-xl animate-in fade-in duration-150">
                        <div className="w-full max-w-6xl h-[92vh] bg-[#070b19] border-2 border-cyan-500/40 rounded-3xl p-5 sm:p-6 shadow-[0_0_80px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden">
                            {/* Breadcrumbs Navigation Header */}
                            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 shrink-0">
                                <div className="flex items-center gap-3">
                                    {/* Botón Volver si está en Nivel 2 o 3 */}
                                    {explorerLevel > 1 && (
                                        <button
                                            onClick={handleNavigateBack}
                                            className="p-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-mono"
                                            title="Volver al nivel anterior"
                                        >
                                            <ArrowLeft size={16} />
                                            <span className="hidden sm:inline">Volver</span>
                                        </button>
                                    )}

                                    <div>
                                        {/* Breadcrumbs interactivos */}
                                        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
                                            <button
                                                onClick={() => { setExplorerLevel(1); setSelectedCategory(null); setSelectedSubcategory(null); }}
                                                className={`font-black flex items-center gap-1.5 px-2 py-0.5 rounded-lg transition-colors ${
                                                    explorerLevel === 1 ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white cursor-pointer'
                                                }`}
                                            >
                                                <span>{activeSquad.code} {activeSquad.name}</span>
                                            </button>

                                            {selectedCategory && (
                                                <>
                                                    <ChevronRight size={12} className="text-slate-600" />
                                                    <button
                                                        onClick={() => { setExplorerLevel(2); setSelectedSubcategory(null); }}
                                                        className={`font-bold px-2 py-0.5 rounded-lg transition-colors ${
                                                            explorerLevel === 2 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:text-white cursor-pointer'
                                                        }`}
                                                    >
                                                        <span>{selectedCategory}</span>
                                                    </button>
                                                </>
                                            )}

                                            {selectedSubcategory && (
                                                <>
                                                    <ChevronRight size={12} className="text-slate-600" />
                                                    <span className="font-bold px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                                        {selectedSubcategory.name}
                                                    </span>
                                                </>
                                            )}
                                        </div>

                                        <p className="text-[11px] text-slate-400 font-mono mt-1">
                                            {explorerLevel === 1 && `Paso 1: Selecciona una de las categorías del escuadrón para explorar sus subfamilias.`}
                                            {explorerLevel === 2 && `Paso 2: Subfamilias de "${selectedCategory}". Selecciona una para ver todos los productos con PVP Público.`}
                                            {explorerLevel === 3 && `Paso 3: Catálogo desplegado (${totalProductsCount} productos). Comparte por WhatsApp o abre el producto en la tienda.`}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {quoteItemsCount > 0 && (
                                        <button
                                            onClick={() => window.open('/dashboard/quotes', '_blank')}
                                            className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500 hover:text-black text-amber-300 border border-amber-500/40 font-mono font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                                            title="Abrir cotizador oficial PROP con los productos seleccionados"
                                        >
                                            <FileSpreadsheet size={13} />
                                            <span>Cotización ({quoteItemsCount})</span>
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setExplorerOpen(false)}
                                        className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* ── VISTA NIVEL 1: TODAS LAS CATEGORÍAS DEL ESCUADRÓN ── */}
                            {explorerLevel === 1 && (
                                <div className="flex-1 overflow-y-auto pr-1 py-4 space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {activeSquad.categories.map((catName) => {
                                            const detail = activeSquad.categoryDetails?.find(c => c.name.toLowerCase() === catName.toLowerCase())
                                            const count = detail?.count ?? 0

                                            return (
                                                <div
                                                    key={catName}
                                                    onClick={() => handleOpenCategoryDirectly(activeSquad, catName)}
                                                    className="p-5 rounded-3xl bg-[#090e24] border-2 border-slate-800 hover:border-cyan-400/80 p-5 flex flex-col justify-between transition-all group hover:scale-[1.02] cursor-pointer shadow-lg hover:shadow-cyan-500/10"
                                                >
                                                    <div className="space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <div className="w-9 h-9 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
                                                                <FolderTree size={18} />
                                                            </div>
                                                            <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono font-bold text-cyan-400">
                                                                {count} productos
                                                            </span>
                                                        </div>
                                                        <h4 className="font-black text-white text-base group-hover:text-cyan-300 transition-colors">
                                                            {catName}
                                                        </h4>
                                                        <p className="text-xs text-slate-400 font-sans leading-relaxed">
                                                            Haz clic para desplegar las subfamilias y todos los equipos de esta línea.
                                                        </p>
                                                    </div>

                                                    <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono font-bold text-cyan-400 group-hover:text-cyan-300">
                                                        <span>Ver Subcategorías</span>
                                                        <ChevronRight size={15} className="group-hover:translate-x-1 transition-transform" />
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* ── VISTA NIVEL 2: SUBCATEGORÍAS DE LA CATEGORÍA SELECCIONADA ── */}
                            {explorerLevel === 2 && (
                                <div className="flex-1 overflow-y-auto pr-1 py-4 space-y-4">
                                    {subcategoriesLoading ? (
                                        <div className="h-64 flex flex-col items-center justify-center text-slate-400 font-mono text-xs gap-3">
                                            <RefreshCw size={24} className="animate-spin text-cyan-400" />
                                            <span>Consultando subcategorías e inventario en vivo...</span>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {subcategoriesList.map((sub) => (
                                                <div
                                                    key={sub.id}
                                                    onClick={() => handleSelectSubcategory(sub)}
                                                    className="p-5 rounded-3xl bg-[#090e24] border-2 border-slate-800 hover:border-emerald-400/80 p-5 flex flex-col justify-between transition-all group hover:scale-[1.02] cursor-pointer shadow-lg hover:shadow-emerald-500/10"
                                                >
                                                    <div className="space-y-2.5">
                                                        <div className="flex items-center justify-between">
                                                            <div className="w-9 h-9 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-300">
                                                                <Layers size={18} />
                                                            </div>
                                                            <span className="px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-xs font-mono font-black text-emerald-400">
                                                                {sub.count} productos
                                                            </span>
                                                        </div>

                                                        <h4 className="font-black text-white text-base group-hover:text-emerald-300 transition-colors">
                                                            {sub.name}
                                                        </h4>

                                                        {sub.description && (
                                                            <p className="text-xs text-slate-400 font-sans leading-relaxed">
                                                                {sub.description}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono font-bold text-emerald-400 group-hover:text-emerald-300">
                                                        <span>Desplegar Productos con PVP</span>
                                                        <ChevronRight size={15} className="group-hover:translate-x-1 transition-transform" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ── VISTA NIVEL 3: PRODUCTOS DESPLEGADOS CON PVP PÚBLICO Y ACCIONES ── */}
                            {explorerLevel === 3 && (
                                <>
                                    {/* Search & Sort Filter Bar */}
                                    <div className="py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
                                        <div className="relative flex-1 min-w-[240px]">
                                            <Search size={15} className="absolute left-3.5 top-3 text-slate-400" />
                                            <input
                                                type="text"
                                                value={productSearch}
                                                onChange={(e) => setProductSearch(e.target.value)}
                                                placeholder={`Buscar por nombre, SKU o marca en ${selectedSubcategory?.name || 'subcategoría'}...`}
                                                className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 font-mono"
                                            />
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-mono text-slate-400 hidden sm:inline">Ordenar:</span>
                                            <select
                                                value={productSort}
                                                onChange={(e) => setProductSort(e.target.value as any)}
                                                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-400"
                                            >
                                                <option value="price_asc">Menor PVP ($ → $$$)</option>
                                                <option value="price_desc">Mayor PVP ($$$ → $)</option>
                                                <option value="name_asc">Nombre A-Z</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Scrollable Product Grid */}
                                    <div className="flex-1 overflow-y-auto pr-1 space-y-3">
                                        {productsLoading ? (
                                            <div className="h-64 flex flex-col items-center justify-center text-slate-400 font-mono text-xs gap-3">
                                                <RefreshCw size={24} className="animate-spin text-emerald-400" />
                                                <span>Cargando productos con PVP Público...</span>
                                            </div>
                                        ) : productsList.length === 0 ? (
                                            <div className="h-64 flex flex-col items-center justify-center text-slate-500 font-mono text-xs">
                                                No se encontraron productos coincidentes en esta subcategoría.
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-4">
                                                {productsList.map((p) => {
                                                    let parsedImages: string[] = []
                                                    try {
                                                        if (p.images) {
                                                            const parsed = JSON.parse(p.images)
                                                            if (Array.isArray(parsed)) parsedImages = parsed
                                                        }
                                                    } catch (e) {
                                                        if (p.images && p.images.startsWith("http")) parsedImages = [p.images]
                                                    }

                                                    const photoUrl = parsedImages[0] || "/images/placeholder-product.png"
                                                    const pvp = p.pvp ?? p.price
                                                    const isCopied = copiedKey === `shared-${p.id}`
                                                    const quoteItem = quoteItems.find(it => it.productId === p.id)
                                                    const isAddedToQuote = !!quoteItem || copiedKey === `quoted-${p.id}`
                                                    const quoteQty = quoteItem?.quantity || (copiedKey === `quoted-${p.id}` ? 1 : 0)

                                                    return (
                                                        <div
                                                            key={p.id}
                                                            className="p-3.5 rounded-3xl bg-[#090e24] border border-slate-800/90 hover:border-emerald-400/60 flex flex-col justify-between transition-all group hover:scale-[1.01] shadow-lg"
                                                        >
                                                            <div className="space-y-2.5">
                                                                {/* Product Image / Preview */}
                                                                <div className="w-full h-36 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden relative flex items-center justify-center">
                                                                    <img
                                                                        src={photoUrl}
                                                                        alt={p.name}
                                                                        className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                                                                        onError={(e) => {
                                                                            (e.target as any).src = "https://placehold.co/300x200/0f172a/38bdf8?text=ATOMIC"
                                                                        }}
                                                                    />
                                                                    <span className="absolute top-2 left-2 text-[8px] font-mono px-2 py-0.5 rounded bg-black/80 text-cyan-300 border border-white/10 uppercase">
                                                                        {p.category?.name || "Catálogo"}
                                                                    </span>
                                                                    <span className={`absolute top-2 right-2 text-[8px] font-mono px-2 py-0.5 rounded uppercase font-bold border ${
                                                                        p.stock > 0 ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40' : 'bg-amber-950/80 text-amber-400 border-amber-500/40'
                                                                    }`}>
                                                                        {p.stock > 0 ? `${p.stock} unid.` : 'Bajo Pedido'}
                                                                    </span>
                                                                </div>

                                                                {/* Title & SKU */}
                                                                <div>
                                                                    <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug group-hover:text-emerald-300 transition-colors" title={p.name}>
                                                                        {p.name}
                                                                    </h4>
                                                                    {p.sku && (
                                                                        <span className="text-[9px] font-mono text-slate-500 block mt-1">
                                                                            REF/SKU: {p.sku}
                                                                        </span>
                                                                    )}
                                                                </div>

                                                                {/* PVP Público Highlighted Box */}
                                                                <div className="p-2.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30">
                                                                    <div className="text-[9px] font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center justify-between">
                                                                        <span>PVP PÚBLICO</span>
                                                                        <span className="text-[8px] text-slate-400 font-normal">INC. IVA</span>
                                                                    </div>
                                                                    <div className="text-xl font-black text-white font-mono mt-0.5">
                                                                        ${pvp.toFixed(2)}
                                                                    </div>
                                                                    {p.distributorPrice && p.distributorPrice > 0 && (
                                                                        <div className="text-[9px] font-mono text-slate-400 mt-1 flex justify-between border-t border-emerald-500/20 pt-1">
                                                                            <span>Costo: ${p.distributorPrice.toFixed(2)}</span>
                                                                            <span className="text-cyan-400 font-bold">
                                                                                Margen: +${(pvp - p.distributorPrice).toFixed(2)}
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Action Buttons: 1) Añadir a Cotización, 2) Compartir Pitch WhatsApp, 3) Abrir Producto en Tienda */}
                                                            <div className="pt-3 mt-3 border-t border-slate-800 flex items-center gap-1.5">
                                                                {/* Botón 1: Añadir a Cotización */}
                                                                <button
                                                                    onClick={() => handleAddToQuote(p)}
                                                                    className={`flex-1 py-2 px-2 rounded-xl font-mono font-bold text-[11px] flex items-center justify-center gap-1 transition-all cursor-pointer ${
                                                                        isAddedToQuote
                                                                            ? "bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.5)] scale-[1.02]"
                                                                            : "bg-amber-500/15 hover:bg-amber-500 hover:text-black text-amber-300 border border-amber-500/40 active:scale-95"
                                                                    }`}
                                                                    title="Añadir producto a la cotización oficial formal (PDF / Excel)"
                                                                >
                                                                    {isAddedToQuote ? <Check size={12} /> : <Plus size={12} />}
                                                                    <span>{isAddedToQuote ? `Cotizando (${quoteQty})` : "+ Cotizar"}</span>
                                                                </button>

                                                                {/* Botón 2: Compartir Pitch WhatsApp */}
                                                                <button
                                                                    onClick={() => handleShareProduct(p)}
                                                                    className={`flex-1 py-2 px-2 rounded-xl font-mono font-bold text-[11px] flex items-center justify-center gap-1 transition-all cursor-pointer ${
                                                                        isCopied
                                                                            ? "bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                                                                            : "bg-slate-900 hover:bg-emerald-500 hover:text-black text-emerald-300 border border-emerald-500/40 active:scale-95"
                                                                    }`}
                                                                    title="Copiar mensaje con PVP y enlace para WhatsApp o compartir"
                                                                >
                                                                    {isCopied ? <Check size={12} /> : <Share2 size={12} />}
                                                                    <span>{isCopied ? "¡Copiado!" : "Compartir"}</span>
                                                                </button>

                                                                {/* Botón 3: Abrir Producto en Tienda */}
                                                                <button
                                                                    onClick={() => {
                                                                        const targetUrl = p.publicUrl || `/web/product/${p.id}`
                                                                        window.open(targetUrl, "_blank")
                                                                    }}
                                                                    className="py-2 px-2.5 rounded-xl bg-slate-900 hover:bg-cyan-500 hover:text-black text-slate-300 border border-slate-800 transition-all cursor-pointer flex items-center justify-center gap-1 text-[11px] font-mono active:scale-95"
                                                                    title="Abrir página oficial del producto en la tienda web"
                                                                >
                                                                    <ExternalLink size={12} />
                                                                    <span className="hidden sm:inline">Abrir</span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}

                            {/* ── BARRA INFERIOR DE COTIZACIÓN ACTIVA ── */}
                            {quoteItemsCount > 0 && (
                                <div className="shrink-0 mt-3 p-3.5 bg-gradient-to-r from-amber-950/90 via-[#0a1029] to-emerald-950/90 border-t-2 border-amber-500/50 flex flex-wrap items-center justify-between gap-3 rounded-2xl shadow-2xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold shrink-0">
                                            <FileSpreadsheet size={18} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-mono font-black text-white">
                                                    COTIZACIÓN EN CURSO:
                                                </span>
                                                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold">
                                                    {quoteItemsCount} {quoteItemsCount === 1 ? 'producto' : 'productos'}
                                                </span>
                                            </div>
                                            <div className="text-[11px] font-mono text-slate-300 mt-0.5">
                                                Total PVP Acumulado: <span className="text-emerald-400 font-black">${quoteTotalPvp.toFixed(2)}</span> (Inc. IVA)
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => {
                                                localStorage.removeItem('atomic_quote_items')
                                                setQuoteItems([])
                                            }}
                                            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-rose-500/20 hover:text-rose-300 text-slate-400 text-xs font-mono border border-slate-800 transition-colors cursor-pointer"
                                            title="Vaciar productos de la cotización actual"
                                        >
                                            Vaciar
                                        </button>
                                        <button
                                            onClick={() => {
                                                window.open('/dashboard/quotes', '_blank')
                                            }}
                                            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs font-mono flex items-center gap-1.5 cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:scale-105 transition-all"
                                        >
                                            <FileText size={14} />
                                            <span>Generar Cotización PROP (PDF / Excel)</span>
                                            <ArrowRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
