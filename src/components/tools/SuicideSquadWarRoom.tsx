"use client"

import React, { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Flame, Users, ShieldAlert, Sparkles, CheckCircle2, AlertCircle,
    Copy, Check, Search, Filter, ArrowRight, Play, Pause, RotateCcw,
    Sliders, ExternalLink, Download, FileText, ChevronRight, X,
    Eye, Shield, Lock, Zap, Smartphone, Cpu, Video, MessageSquare,
    DollarSign, Clock, Trophy, Target, ArrowUpDown, UserPlus, Trash2,
    Share2, RefreshCw
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

export interface ProductItem {
    id: string
    name: string
    price: number
    compareAtPrice?: number | null
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
    const [selectedSquadForProducts, setSelectedSquadForProducts] = useState<SquadData | null>(null)
    const [selectedSquadForPlaybook, setSelectedSquadForPlaybook] = useState<SquadData | null>(null)
    const [assigningSquadId, setAssigningSquadId] = useState<string | null>(null)

    // User assignment modal state
    const [selectedUserToAdd, setSelectedUserToAdd] = useState("")
    const [customUserName, setCustomUserName] = useState("")

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
        setTimeout(() => setCopiedKey(null), 2000)
    }

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
    const handleSaveAssignments = async (newSquads: SquadData[]) => {
        setIsSaving(true)
        try {
            const assignmentsPayload: Record<string, SquadMember[]> = {}
            newSquads.forEach(s => {
                assignmentsPayload[s.id] = s.members || []
            })

            // Save to localStorage immediately as fast fallback
            localStorage.setItem("atomic_suicide_squad_assignments", JSON.stringify(assignmentsPayload))

            // Save to database
            await fetch("/api/tools/suicide-squad", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ assignments: assignmentsPayload })
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

    // ── 3. FETCH PRODUCTS FOR FLOATING SCROLL DRAWER ──
    const fetchSquadProducts = async (squadId: string, search: string = "", sort: string = "price_asc") => {
        setProductsLoading(true)
        try {
            const url = `/api/tools/suicide-squad?action=products&squadId=${squadId}&query=${encodeURIComponent(search)}&sortBy=${sort}&limit=80`
            const res = await fetch(url)
            const data = await res.json()
            if (data.success) {
                setProductsList(data.products)
                setTotalProductsCount(data.total)
            }
        } catch (e) {
            console.error("Error fetching squad products:", e)
        } finally {
            setProductsLoading(false)
        }
    }

    const handleOpenProductsModal = (squad: SquadData) => {
        setSelectedSquadForProducts(squad)
        setProductSearch("")
        setProductSort("price_asc")
        fetchSquadProducts(squad.id, "", "price_asc")
    }

    // Debounced search for products
    useEffect(() => {
        if (!selectedSquadForProducts) return
        const timer = setTimeout(() => {
            fetchSquadProducts(selectedSquadForProducts.id, productSearch, productSort)
        }, 350)
        return () => clearTimeout(timer)
    }, [productSearch, productSort])

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
        <div className="h-full flex flex-col space-y-5 max-w-7xl mx-auto text-slate-100">
            {/* ── TOP HERO HEADER & METRICS BAR ── */}
            <div className="p-5 rounded-3xl bg-gradient-to-r from-[#0d122b] via-[#090d1f] to-[#120b22] border-2 border-rose-500/30 shadow-[0_0_40px_rgba(244,63,94,0.15)] flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                    <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-rose-600 via-red-500 to-amber-500 flex items-center justify-center text-black font-black shadow-lg shadow-rose-500/30">
                        <Flame size={28} className="animate-pulse" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-2">
                                SUICIDE SQUAD <span className="text-rose-400 font-mono text-xs px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40">WAR ROOM</span>
                            </h2>
                            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                                5 SQUADS ACTIVAS
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">
                            Células Focales de Crecimiento Viral: 5 Categorías Insignia, Miembros Asignados y Dominio de Redes
                        </p>
                    </div>
                </div>

                {/* Sub-Tabs Selector */}
                <div className="flex items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800">
                    <button
                        onClick={() => setActiveTab("squads")}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                            activeTab === "squads"
                                ? "bg-rose-500 text-black font-extrabold shadow-[0_0_15px_rgba(244,63,94,0.4)]"
                                : "text-slate-400 hover:text-white"
                        }`}
                    >
                        <Flame size={13} />
                        <span>Escuadras (5)</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("playbook")}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                            activeTab === "playbook"
                                ? "bg-cyan-500 text-black font-extrabold shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                                : "text-slate-400 hover:text-white"
                        }`}
                    >
                        <FileText size={13} />
                        <span>Plan de Guerra</span>
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
                        <span>Simulador TikTok</span>
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
                            Cargando las 5 Escuadras Virales y conectando con los 9,736 productos de catálogo...
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

                                        {/* Bottom Actions: 1) Ver Plan Viral, 2) Ver Todos los Productos */}
                                        <div className="pt-4 mt-4 border-t border-slate-800 flex gap-2">
                                            <button
                                                onClick={() => setSelectedSquadForPlaybook(squad)}
                                                className="flex-1 py-2.5 px-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
                                            >
                                                <FileText size={13} className="text-cyan-400" />
                                                <span>Plan & Guión</span>
                                            </button>

                                            <button
                                                onClick={() => handleOpenProductsModal(squad)}
                                                className={`flex-1 py-2.5 px-3 rounded-2xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 ${style.btnPrimary}`}
                                            >
                                                <Eye size={13} />
                                                <span>Ver Todo ({squad.productCount})</span>
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
                            Cada uno de tus 5 colaboradores debe aplicar esta estructura sin desviarse. No se venden características; se vende paz mental y dolor resuelto en Ecuador.
                        </p>
                    </div>

                    {/* Timeline of 4 steps */}
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

                    {/* Checklist de Producción Diaria */}
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

                    {/* Timer Big Display */}
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

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-800">
                        <div
                            className="h-full bg-gradient-to-r from-amber-500 via-rose-500 to-emerald-500 transition-all duration-300"
                            style={{ width: `${(simSeconds / 25) * 100}%` }}
                        />
                    </div>

                    {/* Controls */}
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

                    {/* Views Slider */}
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

                    {/* Calculation Results Cards */}
                    <div className="grid grid-cols-3 gap-3 text-center">
                        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                            <span className="text-[10px] font-mono text-slate-400 block uppercase">Alcance Mensual</span>
                            <span className="text-lg sm:text-xl font-black text-white font-mono mt-1 block">
                                {(dailyViews * 10 * 30).toLocaleString()}
                            </span>
                            <span className="text-[9px] text-slate-500 font-mono">personas en Ecuador</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30">
                            <span className="text-[10px] font-mono text-emerald-300 block uppercase">Prospectos CRM</span>
                            <span className="text-lg sm:text-xl font-black text-emerald-400 font-mono mt-1 block">
                                {Math.round((dailyViews * 10 * 30) * 0.005).toLocaleString()}
                            </span>
                            <span className="text-[9px] text-emerald-500/80 font-mono">chats directos (0.5%)</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30">
                            <span className="text-[10px] font-mono text-cyan-300 block uppercase">Ventas Cerradas</span>
                            <span className="text-lg sm:text-xl font-black text-cyan-400 font-mono mt-1 block">
                                {Math.round((dailyViews * 10 * 30) * 0.005 * 0.12).toLocaleString()}
                            </span>
                            <span className="text-[9px] text-cyan-500/80 font-mono">cierre 12% ticket prom</span>
                        </div>
                    </div>
                </div>
            )}

            {/* ── MODAL 1: ASIGNAR MIEMBRO ── */}
            <AnimatePresence>
                {assigningSquadId && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
                        <div className="w-full max-w-md bg-[#090e24] border-2 border-cyan-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                                    <UserPlus size={16} className="text-cyan-400" />
                                    Asignar Miembro al Escuadrón
                                </h4>
                                <button
                                    onClick={() => setAssigningSquadId(null)}
                                    className="text-slate-400 hover:text-white"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            <p className="text-xs text-slate-300 font-sans">
                                Selecciona un colaborador registrado en el ERP o escribe su nombre para asignarlo como responsable oficial de este grupo focal:
                            </p>

                            {/* Select system user */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-mono text-slate-400 uppercase">
                                    Colaborador del Sistema:
                                </label>
                                <select
                                    value={selectedUserToAdd}
                                    onChange={(e) => {
                                        setSelectedUserToAdd(e.target.value)
                                        if (e.target.value) setCustomUserName("")
                                    }}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                                >
                                    <option value="">-- Seleccionar de la lista de usuarios --</option>
                                    {systemUsers.map((u) => (
                                        <option key={u.id} value={u.id}>
                                            {u.name || u.email} ({u.role})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 justify-center">
                                <span>— O Escribe un Nombre Manual —</span>
                            </div>

                            {/* Custom name input */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-mono text-slate-400 uppercase">
                                    Nombre del Asesor / Creador:
                                </label>
                                <input
                                    type="text"
                                    value={customUserName}
                                    onChange={(e) => {
                                        setCustomUserName(e.target.value)
                                        if (e.target.value) setSelectedUserToAdd("")
                                    }}
                                    placeholder="Ej. Roberto Sánchez (Vendedor Guayaquil)..."
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                                <button
                                    onClick={() => setAssigningSquadId(null)}
                                    className="px-4 py-2 rounded-xl bg-slate-900 text-slate-300 text-xs font-mono"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={() => handleAddMember(assigningSquadId)}
                                    disabled={!selectedUserToAdd && !customUserName.trim()}
                                    className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs font-mono disabled:opacity-40 cursor-pointer shadow-md"
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

                            {/* Teleprompter Script Box */}
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

                            {/* Keyword WhatsApp Info */}
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

            {/* ── MODAL 3: FLOATING SCROLL DRAWER - VER TODOS LOS PRODUCTOS DE LA CATEGORÍA ── */}
            <AnimatePresence>
                {selectedSquadForProducts && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-black/85 backdrop-blur-xl animate-in fade-in duration-150">
                        <div className="w-full max-w-6xl h-[92vh] bg-[#070b19] border-2 border-cyan-500/40 rounded-3xl p-5 sm:p-6 shadow-[0_0_80px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden">
                            {/* Modal Header */}
                            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 shrink-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-bold">
                                        <Eye size={20} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-mono font-black px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                                                {selectedSquadForProducts.code}
                                            </span>
                                            <h3 className="font-black text-white text-base sm:text-lg">
                                                Catálogo Completo: {selectedSquadForProducts.name}
                                            </h3>
                                        </div>
                                        <p className="text-xs text-slate-400 font-mono mt-0.5">
                                            {totalProductsCount} productos activos en {selectedSquadForProducts.categories.join(", ")}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setSelectedSquadForProducts(null)}
                                    className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Search & Sort Filter Bar */}
                            <div className="py-3.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
                                <div className="relative flex-1 min-w-[240px]">
                                    <Search size={15} className="absolute left-3.5 top-3 text-slate-400" />
                                    <input
                                        type="text"
                                        value={productSearch}
                                        onChange={(e) => setProductSearch(e.target.value)}
                                        placeholder={`Buscar producto, SKU, marca en ${selectedSquadForProducts.name}...`}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-mono text-slate-400 hidden sm:inline">Ordenar:</span>
                                    <select
                                        value={productSort}
                                        onChange={(e) => setProductSort(e.target.value as any)}
                                        className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                                    >
                                        <option value="price_asc">Menor Precio ($ → $$$)</option>
                                        <option value="price_desc">Mayor Precio ($$$ → $)</option>
                                        <option value="name_asc">Nombre A-Z</option>
                                    </select>
                                </div>
                            </div>

                            {/* Scrollable Product Grid */}
                            <div className="flex-1 overflow-y-auto pr-1 space-y-3">
                                {productsLoading ? (
                                    <div className="h-64 flex flex-col items-center justify-center text-slate-400 font-mono text-xs gap-3">
                                        <RefreshCw size={24} className="animate-spin text-cyan-400" />
                                        <span>Consultando inventario en tiempo real...</span>
                                    </div>
                                ) : productsList.length === 0 ? (
                                    <div className="h-64 flex flex-col items-center justify-center text-slate-500 font-mono text-xs">
                                        No se encontraron productos con el término de búsqueda.
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 pb-4">
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

                                            return (
                                                <div
                                                    key={p.id}
                                                    className="p-3.5 rounded-2xl bg-[#090d22] border border-slate-800/90 hover:border-cyan-400/50 flex flex-col justify-between transition-all group hover:scale-[1.01]"
                                                >
                                                    <div className="space-y-2">
                                                        {/* Product Image / Placeholder */}
                                                        <div className="w-full h-32 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden relative flex items-center justify-center">
                                                            <img
                                                                src={photoUrl}
                                                                alt={p.name}
                                                                className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform"
                                                                onError={(e) => {
                                                                    (e.target as any).src = "https://placehold.co/300x200/0f172a/38bdf8?text=ATOMIC"
                                                                }}
                                                            />
                                                            <span className="absolute top-2 left-2 text-[8px] font-mono px-2 py-0.5 rounded bg-black/70 text-slate-300 border border-white/10 uppercase">
                                                                {p.category?.name || "Hardware"}
                                                            </span>
                                                        </div>

                                                        {/* Product Name & SKU */}
                                                        <div>
                                                            <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug group-hover:text-cyan-300 transition-colors" title={p.name}>
                                                                {p.name}
                                                            </h4>
                                                            {p.sku && (
                                                                <span className="text-[9px] font-mono text-slate-500 block mt-0.5">
                                                                    SKU: {p.sku}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Price, Stock and Quick Action */}
                                                    <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between">
                                                        <div>
                                                            <span className="text-sm font-black text-emerald-400 font-mono">
                                                                ${p.price.toFixed(2)}
                                                            </span>
                                                            <span className="text-[9px] font-mono text-slate-400 block">
                                                                Stock: {p.stock > 0 ? `${p.stock} unid.` : "Bajo Pedido"}
                                                            </span>
                                                        </div>

                                                        <button
                                                            onClick={() => {
                                                                const textToCopy = `*${p.name}*\nPrecio: $${p.price.toFixed(2)} + IVA\nDisponible en ATOMIC Ecuador: https://atomiccotizador.shop/web`
                                                                copyToClipboard(textToCopy, `prod-${p.id}`)
                                                            }}
                                                            className="p-2 rounded-xl bg-slate-900 hover:bg-cyan-500 hover:text-black text-slate-300 border border-slate-800 transition-all cursor-pointer"
                                                            title="Copiar detalles para enviar a cliente"
                                                        >
                                                            {copiedKey === `prod-${p.id}` ? <Check size={14} className="text-emerald-400" /> : <Share2 size={14} />}
                                                        </button>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
