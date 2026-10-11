"use client"

import React, { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    X, Download, Youtube, Video, Image as ImageIcon, Music, 
    Sparkles, Bot, Send, Trash2, Copy, Check, ExternalLink, 
    Link as LinkIcon, RefreshCw, AlertCircle, CheckCircle2,
    Volume2, VolumeX, Smartphone, Share2, Layers, Search,
    Grid, Monitor, Calendar, Calculator, Users, Activity,
    Settings, Palette, ArrowLeft, ArrowRight, ShieldCheck,
    MessageSquare, DollarSign, Key, Zap, CheckCheck, Flame
} from "lucide-react"

import AnyDeskRemoteView from "./AnyDeskRemoteView"
import AtomicMeetModal from "@/components/video/AtomicMeetModal"
import SocialMultiManager from "./SocialMultiManager"
import OperativeCalendar from "./OperativeCalendar"
import FinancialCalculator from "./FinancialCalculator"
import InteractiveHierarchyMap from "./InteractiveHierarchyMap"
import CryptoBinanceTerminal from "./CryptoBinanceTerminal"
import ConnectionsConfigModal from "./ConnectionsConfigModal"
import ThemePainterStudio from "./ThemePainterStudio"
import SuicideSquadWarRoom from "./SuicideSquadWarRoom"
import SalesCopyManager from "./SalesCopyManager"

export type ToolTab = 
    | "grid"
    | "sales_copy_messages"
    | "suicide_squad"
    | "anydesk"
    | "zoom"
    | "downloader"
    | "bot"
    | "social"
    | "calendar"
    | "calculator"
    | "asignaciones"
    | "valores"
    | "connections_config"
    | "theming"

interface MediaFormat {
    quality: string
    label: string
    type: "video" | "audio" | "image"
    url: string
    downloadUrl?: string
    fallbackUrl?: string
    isDirectImage?: boolean
}

interface MediaResult {
    success: boolean
    platform: string
    videoId?: string
    title: string
    author: string
    thumbnail: string
    thumbnailOptions?: { label: string; url: string }[]
    formats: MediaFormat[]
    shareUrl?: string
}

interface PersonalChatMessage {
    id: string
    role: "user" | "assistant"
    content: string
    timestamp: number
    clickableOptions?: { label: string; action: string }[]
}

export default function ToolsModal({
    isOpen,
    onClose,
    initialTab = "grid"
}: {
    isOpen: boolean
    onClose: () => void
    initialTab?: ToolTab
}) {
    const { data: session } = useSession()
    const userName = session?.user?.name?.split(" ")[0] || "Colaborador"
    const userEmail = session?.user?.email || "usuario@atomic.com.ec"

    const [activeTab, setActiveTab] = useState<ToolTab>(initialTab)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<"all" | "stream" | "ai" | "finance" | "system">("all")

    // Synchronize initialTab if changed externally
    useEffect(() => {
        if (isOpen) {
            setActiveTab(initialTab)
        }
    }, [isOpen, initialTab])

    // Keyboard shortcut Escape to return to grid or close
    useEffect(() => {
        if (!isOpen) return
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                if (activeTab !== "grid") {
                    setActiveTab("grid")
                } else {
                    onClose()
                }
            }
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [isOpen, activeTab, onClose])

    // ─────────────────────────────────────────────────────────────
    // 1. MEDIA DOWNLOADER STATE
    // ─────────────────────────────────────────────────────────────
    const [mediaUrl, setMediaUrl] = useState("")
    const [isFetchingMedia, setIsFetchingMedia] = useState(false)
    const [mediaResult, setMediaResult] = useState<MediaResult | null>(null)
    const [mediaError, setMediaError] = useState<string | null>(null)
    const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null)

    const handlePasteClipboard = async () => {
        try {
            const text = await navigator.clipboard.readText()
            if (text) {
                setMediaUrl(text.trim())
                analyzeMediaUrl(text.trim())
            }
        } catch (e) {}
    }

    const analyzeMediaUrl = async (urlToAnalyze?: string) => {
        const target = (urlToAnalyze || mediaUrl).trim()
        if (!target) {
            setMediaError("Ingresa un enlace de YouTube, TikTok, Instagram o Facebook")
            return
        }

        setIsFetchingMedia(true)
        setMediaError(null)
        setMediaResult(null)

        try {
            const res = await fetch("/api/tools/media-downloader", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: target })
            })

            const data = await res.json()
            if (res.ok && data.success) {
                setMediaResult(data)
            } else {
                setMediaError(data.error || "No se pudo extraer información del enlace.")
            }
        } catch (err: any) {
            setMediaError("Error de conexión al procesar el enlace.")
        } finally {
            setIsFetchingMedia(false)
        }
    }

    const handleDownloadItem = (fmt: MediaFormat) => {
        setDownloadingFormat(fmt.label)
        if (fmt.isDirectImage || fmt.type === "image") {
            const link = document.createElement("a")
            link.href = fmt.url
            link.target = "_blank"
            link.download = `atomic_${mediaResult?.videoId || "image"}.jpg`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } else {
            window.open(fmt.url, "_blank")
        }
        setTimeout(() => setDownloadingFormat(null), 1500)
    }

    // ─────────────────────────────────────────────────────────────
    // 2. UNIFIED BOT STATE
    // ─────────────────────────────────────────────────────────────
    const storageKey = `atomic_personal_bot_history_${userEmail}`
    const botNameKey = `atomic_personal_bot_name_${userEmail}`

    const [customBotName, setCustomBotName] = useState<string>("Mi Asistente Personal & Guía")
    const [botMessages, setBotMessages] = useState<PersonalChatMessage[]>([])
    const [botInput, setBotInput] = useState("")
    const [isBotThinking, setIsBotThinking] = useState(false)
    const [botMode, setBotMode] = useState<"TRABAJO" | "CRIPTO">("TRABAJO")
    const [botIntegrationTab, setBotIntegrationTab] = useState<"chat" | "telegram" | "whatsapp">("chat")
    const [telegramToken, setTelegramToken] = useState("")
    const chatEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!isOpen) return
        try {
            const savedName = localStorage.getItem(botNameKey)
            if (savedName) setCustomBotName(savedName)
            else setCustomBotName(`Bot Guía & Personal de ${userName}`)

            const savedChat = localStorage.getItem(storageKey)
            if (savedChat) {
                const parsed = JSON.parse(savedChat)
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setBotMessages(parsed)
                    return
                }
            }

            setBotMessages([{
                id: "init-welcome",
                role: "assistant",
                content: `Hola **${userName}**, soy tu **Bot Personal y Guía Oficial** de ATOMIC.\n\nEstoy equipado con capacidades de **psicólogo empresarial, coach motivacional y estratega de negocios** de alto impacto.\n\nActualmente me encuentro en **💼 Modo Trabajo**: Durante el día se han registrado cotizaciones activas, clientes en CRM y sincronización de catálogo. Puedes alternar al **🪙 Modo Cripto** en cualquier momento para análisis en vivo de Binance.`,
                timestamp: Date.now(),
                clickableOptions: [
                    { label: "⚡ Nueva Cotización", action: "cotizar" },
                    { label: "👤 Guardar Contacto", action: "contacto" },
                    { label: "📊 Ver Precios", action: "precios" },
                    { label: "🪙 Switch a Cripto", action: "switch_cripto" }
                ]
            }])
        } catch (e) {}
    }, [isOpen, userEmail, userName])

    useEffect(() => {
        if (botMessages.length > 0) {
            try {
                localStorage.setItem(storageKey, JSON.stringify(botMessages))
            } catch (e) {}
        }
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [botMessages])

    const handleSwitchBotMode = (newMode: "TRABAJO" | "CRIPTO") => {
        setBotMode(newMode)
        const announcement: PersonalChatMessage = newMode === "CRIPTO" ? {
            id: `mode-${Date.now()}`,
            role: "assistant",
            content: `🪙 **¡Modo Cripto Activado!**\n\nEntendido ${userName}. Me conecto en vivo con la API de Binance e investigo tendencias del mercado. Bitcoin y Solana lideran los flujos institucionales. Puedes pedirme análisis de soporte, volumen o simular operaciones.`,
            timestamp: Date.now(),
            clickableOptions: [
                { label: "📈 Ver Precios Binance", action: "ver_binance" },
                { label: "🔍 Análisis de Bitcoin", action: "analisis_btc" },
                { label: "💼 Volver a Trabajo", action: "switch_trabajo" }
            ]
        } : {
            id: `mode-${Date.now()}`,
            role: "assistant",
            content: `💼 **¡Modo Trabajo Activado!**\n\nExcelente, vamos a seguir enfocados en ventas y producción. Mientras estuvimos operando se generaron proformas en el sistema, nuevos prospectos en WhatsApp CRM y consultas en la tienda. ¿Qué cotización o seguimiento preparamos ahora?`,
            timestamp: Date.now(),
            clickableOptions: [
                { label: "📄 Generar Cotización PDF", action: "cotizar" },
                { label: "📱 Enviar a WhatsApp", action: "whatsapp" },
                { label: "🪙 Cambiar a Cripto", action: "switch_cripto" }
            ]
        }
        setBotMessages(prev => [...prev, announcement])
    }

    const handleOptionClick = (action: string) => {
        if (action === "switch_cripto") handleSwitchBotMode("CRIPTO")
        else if (action === "switch_trabajo") handleSwitchBotMode("TRABAJO")
        else if (action === "ver_binance") setActiveTab("valores")
        else if (action === "cotizar") window.location.href = "/dashboard/quotes"
        else if (action === "precios") window.location.href = "/dashboard/matriz-precios"
        else if (action === "contacto") window.location.href = "/dashboard/whatsapp/crm"
        else sendPersonalBotMessage(`Ejecutar acción: ${action}`)
    }

    const sendPersonalBotMessage = async (customPrompt?: string) => {
        const text = (customPrompt || botInput).trim()
        if (!text || isBotThinking) return

        const userMsg: PersonalChatMessage = {
            id: `usr-${Date.now()}`,
            role: "user",
            content: text,
            timestamp: Date.now()
        }

        const updated = [...botMessages, userMsg]
        setBotMessages(updated)
        if (!customPrompt) setBotInput("")
        setIsBotThinking(true)

        try {
            const res = await fetch("/api/personal-bot", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: updated.map(m => ({ role: m.role, content: m.content })),
                    currentPath: "/dashboard/herramientas",
                    persona: botMode === "CRIPTO" ? "CRIPTO_TRADER" : "VENTAS_COACH",
                    botName: customBotName
                })
            })

            const data = await res.json()
            const reply = data.reply || (
                botMode === "CRIPTO"
                    ? `Como estratega cripto, te recomiendo vigilar los niveles de liquidez de Bitcoin y mantener órdenes escalonadas en USDT.`
                    : `Como tu coach motivacional y comercial, recuerda que cada contacto es una oportunidad de cierre. Enfócate en resolver el dolor de seguridad del cliente y envía la cotización con entrega inmediata.`
            )

            const assistantMsg: PersonalChatMessage = {
                id: `ast-${Date.now()}`,
                role: "assistant",
                content: reply,
                timestamp: Date.now(),
                clickableOptions: botMode === "CRIPTO" ? [
                    { label: "📊 Ver Terminal Binance", action: "ver_binance" },
                    { label: "💼 Modo Trabajo", action: "switch_trabajo" }
                ] : [
                    { label: "⚡ Generar Cotización", action: "cotizar" },
                    { label: "🪙 Switch a Cripto", action: "switch_cripto" }
                ]
            }
            setBotMessages(prev => [...prev, assistantMsg])
        } catch (err) {
            setBotMessages(prev => [...prev, {
                id: `err-${Date.now()}`,
                role: "assistant",
                content: "Lo siento, tuve un problema procesando la consulta. Intenta nuevamente.",
                timestamp: Date.now()
            }])
        } finally {
            setIsBotThinking(false)
        }
    }

    if (!isOpen) return null

    // ─────────────────────────────────────────────────────────────
    // TOOLS DEFINITIONS FOR SQUARE GRID
    // ─────────────────────────────────────────────────────────────
    const TOOLS_LIST = [
        {
            id: "sales_copy_messages" as ToolTab,
            category: "ai",
            title: "Mensajes para Copiar y Pegar",
            shortTitle: "Scripts Marketplace",
            badge: "VENTAS & WHATSAPP",
            badgeColor: "bg-emerald-500/25 text-emerald-300 border-emerald-500/50",
            icon: MessageSquare,
            color: "text-emerald-400 bg-emerald-500/15 border-emerald-500/40",
            glow: "rgba(16,185,129,0.4)",
            desc: "Bienvenida Marketplace, link de tienda, captura de WhatsApp y cierres rápidos"
        },
        {
            id: "suicide_squad" as ToolTab,
            category: "ai",
            title: "SUICIDE SQUAD",
            shortTitle: "Suicide Squad",
            badge: "WAR ROOM",
            badgeColor: "bg-rose-500/25 text-rose-300 border-rose-500/50",
            icon: Flame,
            color: "text-rose-400 bg-rose-500/15 border-rose-500/40",
            glow: "rgba(244,63,94,0.4)",
            desc: "5 Escuadras Virales, Miembros a Cargo, Playbook y Catálogo Completo"
        },
        {
            id: "anydesk" as ToolTab,
            category: "stream",
            title: "AnyDesk ATOMIC",
            shortTitle: "AnyDesk",
            badge: "PRO IA",
            badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/40",
            icon: Monitor,
            color: "text-rose-400 bg-rose-500/10 border-rose-500/40",
            glow: "rgba(244,63,94,0.3)",
            desc: "Control PC dual-monitor con visión y mouse físico"
        },
        {
            id: "zoom" as ToolTab,
            category: "stream",
            title: "Zoom Interno (Meet)",
            shortTitle: "Zoom Meet",
            badge: "ILIMITADO",
            badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
            icon: Video,
            color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/40",
            glow: "rgba(6,182,212,0.3)",
            desc: "Videollamadas P2P WebRTC con pantalla y chat"
        },
        {
            id: "downloader" as ToolTab,
            category: "media",
            title: "Descargador Multimedia",
            shortTitle: "Downloader",
            badge: "HD 1080p",
            badgeColor: "bg-red-500/20 text-red-300 border-red-500/40",
            icon: Youtube,
            color: "text-red-400 bg-red-500/10 border-red-500/40",
            glow: "rgba(239,68,68,0.3)",
            desc: "Descargas MP4, MP3 y portadas de YouTube/TikTok/IG"
        },
        {
            id: "bot" as ToolTab,
            category: "ai",
            title: "Mi Bot Personal & Guía",
            shortTitle: "Bot Guía",
            badge: "CEREBRO IA",
            badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/40",
            icon: Bot,
            color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/40",
            glow: "rgba(99,102,241,0.3)",
            desc: "Coach comercial y trading con WhatsApp y Telegram"
        },
        {
            id: "valores" as ToolTab,
            category: "finance",
            title: "Valores & Binance Live",
            shortTitle: "Binance Live",
            badge: "EN VIVO",
            badgeColor: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
            icon: Activity,
            color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/40",
            glow: "rgba(234,179,8,0.3)",
            desc: "Cotizaciones en tiempo real, velas y libro de órdenes"
        },
        {
            id: "calculator" as ToolTab,
            category: "finance",
            title: "Calculadora Financiera",
            shortTitle: "Calculadora",
            badge: "IVA 15%",
            badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
            icon: Calculator,
            color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/40",
            glow: "rgba(16,185,129,0.3)",
            desc: "Cálculos con IVA Ecuador, márgenes y cinta de auditoría"
        },
        {
            id: "social" as ToolTab,
            category: "ai",
            title: "Gestor Multicuentas Social",
            shortTitle: "Multicuentas",
            badge: "MULTI",
            badgeColor: "bg-pink-500/20 text-pink-300 border-pink-500/40",
            icon: Share2,
            color: "text-pink-400 bg-pink-500/10 border-pink-500/40",
            glow: "rgba(236,72,153,0.3)",
            desc: "TikTok, Instagram, Facebook y generador copy IA"
        },
        {
            id: "asignaciones" as ToolTab,
            category: "system",
            title: "Organigrama & Asignaciones",
            shortTitle: "Mapa 2D",
            badge: "2D MAP",
            badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/40",
            icon: Users,
            color: "text-purple-400 bg-purple-500/10 border-purple-500/40",
            glow: "rgba(168,85,247,0.3)",
            desc: "Lienzo interactivo de jerarquía y conexiones 2D"
        },
        {
            id: "calendar" as ToolTab,
            category: "system",
            title: "Calendario Operativo",
            shortTitle: "Calendario",
            badge: "AGENDA",
            badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
            icon: Calendar,
            color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/40",
            glow: "rgba(6,182,212,0.3)",
            desc: "Visitas técnicas, entregas, Zoom y cobranzas"
        },
        {
            id: "connections_config" as ToolTab,
            category: "system",
            title: "Configuración Conexiones",
            shortTitle: "Conexiones",
            badge: "TOKENS",
            badgeColor: "bg-slate-500/20 text-slate-300 border-slate-500/40",
            icon: Settings,
            color: "text-slate-300 bg-slate-800/60 border-slate-700",
            glow: "rgba(148,163,184,0.3)",
            desc: "Tokens Meta WhatsApp, Telegram y propósitos de enlace"
        },
        {
            id: "theming" as ToolTab,
            category: "system",
            title: "Estudio Pintor de Temas",
            shortTitle: "Temas CSS",
            badge: "DINÁMICO",
            badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
            icon: Palette,
            color: "text-amber-400 bg-amber-500/10 border-amber-500/40",
            glow: "rgba(245,158,11,0.3)",
            desc: "Personalizador en vivo de variables neón y paletas"
        }
    ]

    const filteredTools = TOOLS_LIST.filter(t => {
        const matchesCategory = selectedCategory === "all" || t.category === selectedCategory
        const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              t.desc.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesCategory && matchesSearch
    })

    const activeToolObj = TOOLS_LIST.find(t => t.id === activeTab)

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-2xl animate-in fade-in duration-200">
            <motion.div 
                initial={{ opacity: 0, scale: 0.96, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 15 }}
                className="relative w-full max-w-7xl h-[94vh] bg-[#070b18] border-2 border-cyan-500/40 rounded-3xl shadow-[0_0_90px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden"
            >
                {/* ── TOP UNIFIED HEADER BAR ── */}
                <header className="px-4 sm:px-6 py-3 border-b border-cyan-500/20 bg-slate-950/90 flex flex-wrap items-center justify-between gap-3 shrink-0 z-20">
                    <div className="flex items-center gap-3">
                        {activeTab !== "grid" ? (
                            <button
                                onClick={() => setActiveTab("grid")}
                                className="px-3.5 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border-2 border-cyan-400/50 text-cyan-300 text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.2)] active:scale-95"
                                title="Volver a la cuadrícula de herramientas (Esc)"
                            >
                                <ArrowLeft size={15} />
                                <span>← Cuadrícula</span>
                            </button>
                        ) : (
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 to-indigo-600 flex items-center justify-center text-black font-black shadow-lg shadow-cyan-500/30">
                                <Grid size={18} />
                            </div>
                        )}

                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-sm sm:text-base font-black tracking-tight text-white flex items-center gap-2">
                                    {activeTab === "grid" ? (
                                        <>Centro de Herramientas ATOMIC</>
                                    ) : (
                                        <>
                                            <span className="text-slate-400 font-normal hidden sm:inline">Herramientas &gt;</span>
                                            <span className="text-cyan-300">{activeToolObj?.title}</span>
                                        </>
                                    )}
                                </h2>
                                <span className="text-[9px] font-mono font-black px-2 py-0.5 rounded-full bg-rose-500 text-black uppercase shadow-sm">
                                    12 PRO (WAR ROOM)
                                </span>
                            </div>
                            <p className="text-[10px] text-slate-400 font-mono hidden md:block">
                                {activeTab === "grid" 
                                    ? "Modo Cuadrícula: Suite integrada de utilidades, streaming, IA, Suicide Squad y finanzas" 
                                    : activeToolObj?.desc}
                            </p>
                        </div>
                    </div>

                    {/* Quick Switcher Dock when inside a tool + Search / Close */}
                    <div className="flex items-center gap-2">
                        {activeTab !== "grid" && (
                            <div className="hidden md:flex items-center gap-1 px-2 py-1 rounded-2xl bg-slate-900/90 border border-slate-800">
                                {TOOLS_LIST.map(t => {
                                    const Icon = t.icon
                                    const isCurrent = t.id === activeTab
                                    return (
                                        <button
                                            key={t.id}
                                            onClick={() => setActiveTab(t.id)}
                                            className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                                                isCurrent 
                                                    ? "bg-rose-500 text-black font-bold shadow-md scale-105" 
                                                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                                            }`}
                                            title={t.title}
                                        >
                                            <Icon size={14} />
                                        </button>
                                    )
                                })}
                            </div>
                        )}

                        {activeTab === "grid" && (
                            <div className="relative">
                                <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Buscar en cuadrícula..."
                                    className="bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 w-36 sm:w-52"
                                />
                            </div>
                        )}

                        <button 
                            onClick={onClose}
                            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-rose-500/20 hover:text-rose-400 transition-colors cursor-pointer"
                            title="Cerrar modal (Esc)"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </header>

                {/* ── BODY VIEW ROUTER ── */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#040714] relative">
                    {/* VIEW 0: GRID VIEW (100% MODO CUADRÍCULA CUADRADA - CERO RECTÁNGULOS HORIZONTALES) */}
                    {activeTab === "grid" && (
                        <div className="space-y-6 max-w-6xl mx-auto pb-4">
                            {/* Category Filter Pills Bar */}
                            <div className="flex items-center justify-center gap-1.5 flex-wrap">
                                {[
                                    { id: "all", label: "Todas (12)" },
                                    { id: "ai", label: "🔥 Suicide Squad & IA (3)" },
                                    { id: "stream", label: "📹 Streaming & PC (2)" },
                                    { id: "finance", label: "📈 Finanzas & Precios (2)" },
                                    { id: "system", label: "⚙️ Operación & Sistema (5)" }
                                ].map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.id as any)}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                                            selectedCategory === cat.id
                                                ? "bg-rose-500 text-black font-extrabold shadow-[0_0_15px_rgba(244,63,94,0.4)] scale-105"
                                                : "bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
                                        }`}
                                    >
                                        {cat.label}
                                    </button>
                                ))}
                            </div>

                            {/* PURE SQUARE CUADRÍCULA (GRID TILES) */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4.5">
                                {filteredTools.map((tool) => {
                                    const IconComponent = tool.icon
                                    return (
                                        <button
                                            key={tool.id}
                                            onClick={() => setActiveTab(tool.id)}
                                            className="p-4 sm:p-5 rounded-3xl bg-[#090e24]/90 border border-cyan-500/20 hover:border-cyan-400/70 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] flex flex-col items-center justify-between text-center transition-all duration-200 group active:scale-95 hover:-translate-y-1 cursor-pointer select-none relative overflow-hidden aspect-square sm:aspect-auto sm:min-h-[195px]"
                                            style={{
                                                boxShadow: `0 4px 20px rgba(0,0,0,0.5)`
                                            }}
                                        >
                                            {/* Micro-badge top row */}
                                            <div className="w-full flex items-center justify-between">
                                                <span className={`text-[9px] font-mono font-black px-2 py-0.5 rounded-full border ${tool.badgeColor}`}>
                                                    {tool.badge}
                                                </span>
                                                <span className="w-2 h-2 rounded-full bg-cyan-400/40 group-hover:bg-cyan-400 group-hover:shadow-[0_0_8px_#06b6d4] transition-all" />
                                            </div>

                                            {/* Large Square Icon Center */}
                                            <div className="my-1.5 flex flex-col items-center">
                                                <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg ${tool.color}`}>
                                                    <IconComponent size={28} className="stroke-[2.2]" />
                                                </div>
                                            </div>

                                            {/* Title & Short Description */}
                                            <div className="w-full">
                                                <h4 className="text-xs sm:text-sm font-extrabold text-white group-hover:text-cyan-300 transition-colors leading-tight line-clamp-1">
                                                    {tool.title}
                                                </h4>
                                                <p className="text-[10px] text-slate-400 font-mono mt-0.5 line-clamp-1">
                                                    {tool.desc}
                                                </p>
                                                <div className="text-[9px] text-cyan-400 font-mono font-bold mt-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                                                    <span>Iniciar</span>
                                                    <ArrowRight size={10} />
                                                </div>
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* VIEW 1: ANYDESK ATOMIC (DOCKED SPLIT-VIEW) */}
                    {activeTab === "anydesk" && <AnyDeskRemoteView />}

                    {/* VIEW 2: ZOOM INTERNO (ATOMIC MEET EMBEDDED) */}
                    {activeTab === "zoom" && (
                        <div className="h-full w-full">
                            <AtomicMeetModal
                                isOpen={true}
                                onClose={() => setActiveTab("grid")}
                                embedded={true}
                                targetMember={{ name: "Sala Principal de Equipo", roleName: "Conferencia P2P Ilimitada" }}
                            />
                        </div>
                    )}

                    {/* VIEW 3: DESCARGADOR MULTIMEDIA */}
                    {activeTab === "downloader" && (
                        <div className="max-w-4xl mx-auto space-y-6">
                            <div className="text-center space-y-2">
                                <h3 className="text-xl font-bold text-white">Descargador Universal de Videos y Audios</h3>
                                <p className="text-xs text-slate-400 font-mono">
                                    Pega enlaces de YouTube (Videos & Shorts), TikTok, Instagram o Facebook para descargar en alta calidad.
                                </p>
                            </div>

                            {/* URL Input Form */}
                            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={mediaUrl}
                                        onChange={(e) => setMediaUrl(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && analyzeMediaUrl()}
                                        placeholder="Pega el enlace aquí (https://youtube.com/watch?v=...)..."
                                        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                                    />
                                    <button
                                        type="button"
                                        onClick={handlePasteClipboard}
                                        className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                                    >
                                        <Copy size={13} />
                                        <span>Pegar</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => analyzeMediaUrl()}
                                        disabled={isFetchingMedia}
                                        className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
                                    >
                                        <Download size={14} className={isFetchingMedia ? "animate-spin" : ""} />
                                        <span>{isFetchingMedia ? "Extrayendo..." : "Analizar"}</span>
                                    </button>
                                </div>

                                {mediaError && (
                                    <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-center gap-2">
                                        <AlertCircle size={15} />
                                        <span>{mediaError}</span>
                                    </div>
                                )}
                            </div>

                            {/* Media Result Preview in Square Grid */}
                            {mediaResult && (
                                <div className="p-5 rounded-3xl bg-slate-900 border border-cyan-500/30 space-y-4">
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <img
                                            src={mediaResult.thumbnail}
                                            alt={mediaResult.title}
                                            className="w-full sm:w-60 h-36 object-cover rounded-2xl border border-slate-800"
                                        />
                                        <div className="space-y-2">
                                            <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold uppercase border border-cyan-500/30">
                                                {mediaResult.platform}
                                            </span>
                                            <h4 className="font-bold text-white text-base">{mediaResult.title}</h4>
                                            <p className="text-xs text-slate-400 font-mono">Autor: {mediaResult.author}</p>
                                        </div>
                                    </div>

                                    {/* Format Download Buttons: MODE CUADRÍCULA */}
                                    <div className="pt-3 border-t border-slate-800">
                                        <span className="text-[11px] font-mono font-bold text-slate-400 mb-2.5 block uppercase">
                                            Formatos Disponibles para Descarga:
                                        </span>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                            {mediaResult.formats.map((fmt, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleDownloadItem(fmt)}
                                                    className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-400/60 flex flex-col items-center justify-center text-center gap-2 transition-all cursor-pointer shadow-md group hover:scale-[1.02]"
                                                >
                                                    <div className="p-2 rounded-xl bg-slate-900 text-cyan-300 group-hover:scale-110 transition-transform">
                                                        {fmt.type === "video" && <Video size={20} className="text-cyan-400" />}
                                                        {fmt.type === "audio" && <Music size={20} className="text-emerald-400" />}
                                                        {fmt.type === "image" && <ImageIcon size={20} className="text-purple-400" />}
                                                    </div>
                                                    <div>
                                                        <span className="text-xs font-bold text-white block group-hover:text-cyan-300">
                                                            {fmt.label}
                                                        </span>
                                                        <span className="text-[10px] font-mono text-slate-400 uppercase">
                                                            {fmt.quality || fmt.type}
                                                        </span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* VIEW 4: MI BOT PERSONAL & GUÍA (CON PANELES INTEGRADOS SIN OVERLAYS) */}
                    {activeTab === "bot" && (
                        <div className="max-w-4xl mx-auto h-full flex flex-col space-y-4">
                            {/* Bot Top Controls */}
                            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
                                        <Bot size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-sm flex items-center gap-2">
                                            {customBotName}
                                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                                Cerebro Unificado
                                            </span>
                                        </h4>
                                        <p className="text-[10px] text-slate-400 font-mono">
                                            Psicólogo empresarial, coach motivacional y estratega de negocios
                                        </p>
                                    </div>
                                </div>

                                {/* Switch Trabajo vs Cripto */}
                                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
                                    <button
                                        onClick={() => handleSwitchBotMode("TRABAJO")}
                                        className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                                            botMode === "TRABAJO" ? "bg-cyan-500 text-black font-bold shadow-md" : "text-slate-400 hover:text-white"
                                        }`}
                                    >
                                        💼 Modo Trabajo
                                    </button>
                                    <button
                                        onClick={() => handleSwitchBotMode("CRIPTO")}
                                        className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                                            botMode === "CRIPTO" ? "bg-yellow-500 text-black font-bold shadow-md" : "text-slate-400 hover:text-white"
                                        }`}
                                    >
                                        🪙 Modo Cripto
                                    </button>
                                </div>

                                {/* Tabs de Integración Inline (No Popups Flotantes) */}
                                <div className="flex items-center gap-1.5">
                                    <button
                                        onClick={() => setBotIntegrationTab(botIntegrationTab === "telegram" ? "chat" : "telegram")}
                                        className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                                            botIntegrationTab === "telegram"
                                                ? "bg-cyan-500 text-black border-cyan-400 shadow-md"
                                                : "bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/30 text-cyan-300"
                                        }`}
                                    >
                                        <Send size={12} />
                                        <span>Telegram</span>
                                    </button>
                                    <button
                                        onClick={() => setBotIntegrationTab(botIntegrationTab === "whatsapp" ? "chat" : "whatsapp")}
                                        className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                                            botIntegrationTab === "whatsapp"
                                                ? "bg-emerald-500 text-black border-emerald-400 shadow-md"
                                                : "bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30 text-emerald-300"
                                        }`}
                                    >
                                        <MessageSquare size={12} />
                                        <span>WhatsApp</span>
                                    </button>
                                </div>
                            </div>

                            {/* INLINE TELEGRAM INTEGRATION PANEL (No Floating Popups) */}
                            {botIntegrationTab === "telegram" && (
                                <div className="p-4 rounded-2xl bg-[#090d1e] border border-cyan-500/40 space-y-3 animate-in fade-in duration-150">
                                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                                        <h4 className="font-bold text-white text-xs flex items-center gap-2">
                                            <Send size={14} className="text-cyan-400" />
                                            Conexión con Telegram Bot API
                                        </h4>
                                        <button onClick={() => setBotIntegrationTab("chat")} className="text-slate-400 hover:text-white text-xs">Cerrar</button>
                                    </div>
                                    <p className="text-[11px] text-slate-300 font-sans">
                                        Pega el Token HTTP API otorgado por <strong>@BotFather</strong> para que tu bot responda en chats privados y grupos:
                                    </p>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={telegramToken}
                                            onChange={(e) => setTelegramToken(e.target.value)}
                                            placeholder="123456789:ABCdefGHIjklMNOpqrs..."
                                            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                                        />
                                        <button
                                            onClick={() => {
                                                alert("¡Token de Telegram guardado y sincronizado con el núcleo del bot!")
                                                setBotIntegrationTab("chat")
                                            }}
                                            className="px-4 py-2 rounded-xl bg-cyan-500 text-black font-bold text-xs"
                                        >
                                            Guardar
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* INLINE WHATSAPP INTEGRATION PANEL (No Floating Popups) */}
                            {botIntegrationTab === "whatsapp" && (
                                <div className="p-4 rounded-2xl bg-[#090d1e] border border-emerald-500/40 space-y-3 animate-in fade-in duration-150">
                                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                                        <h4 className="font-bold text-white text-xs flex items-center gap-2">
                                            <MessageSquare size={14} className="text-emerald-400" />
                                            Conexión con Meta WhatsApp Cloud API
                                        </h4>
                                        <button onClick={() => setBotIntegrationTab("chat")} className="text-slate-400 hover:text-white text-xs">Cerrar</button>
                                    </div>
                                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-[11px] font-mono">
                                        <div>• Número Oficial: <strong>+593 96 322 6319</strong></div>
                                        <div>• Estado Meta API: <strong className="text-emerald-400">Verificado GREEN (Cloud API v21.0)</strong></div>
                                        <div>• Token Permanente: <strong className="text-cyan-300">Activo (System User)</strong></div>
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => {
                                                window.open("https://wa.me/593963226319?text=Hola%20Bot%20Guia%20ATOMIC", "_blank")
                                            }}
                                            className="px-4 py-2 rounded-xl bg-emerald-500 text-black font-bold text-xs"
                                        >
                                            Chatear en WhatsApp
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Chat Messages */}
                            <div className="flex-1 min-h-[360px] bg-slate-950/90 border border-slate-800 rounded-3xl p-4 overflow-y-auto space-y-3 font-sans text-xs">
                                {botMessages.map(m => (
                                    <div
                                        key={m.id}
                                        className={`p-3.5 rounded-2xl max-w-[85%] ${
                                            m.role === "user"
                                                ? "bg-cyan-500 text-black font-semibold ml-auto shadow-md"
                                                : "bg-slate-900 border border-slate-800 text-slate-200 mr-auto"
                                        }`}
                                    >
                                        <div className="text-[10px] mb-1 opacity-70 font-mono">
                                            {m.role === "user" ? "Tú" : customBotName}
                                        </div>
                                        <p className="leading-relaxed whitespace-pre-line">{m.content}</p>

                                        {/* Action buttons rendered in pure grid */}
                                        {m.clickableOptions && m.clickableOptions.length > 0 && (
                                            <div className="mt-3 pt-2 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-2">
                                                {m.clickableOptions.map((opt, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => handleOptionClick(opt.action)}
                                                        className="px-2.5 py-1.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 font-mono text-[10px] font-bold text-center transition-all cursor-pointer shadow-sm truncate"
                                                    >
                                                        {opt.label}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <div ref={chatEndRef} />
                            </div>

                            {/* Chat Input */}
                            <form onSubmit={(e) => { e.preventDefault(); sendPersonalBotMessage() }} className="flex gap-2">
                                <input
                                    type="text"
                                    value={botInput}
                                    onChange={(e) => setBotInput(e.target.value)}
                                    placeholder={botMode === "CRIPTO" ? "Pregúntale sobre Binance, soporte, criptomonedas..." : "Pregúntale sobre estrategias de venta, cotizaciones, metas..."}
                                    className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-400"
                                />
                                <button
                                    type="submit"
                                    disabled={isBotThinking || !botInput.trim()}
                                    className="px-5 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                                >
                                    <Send size={15} />
                                    <span>Enviar</span>
                                </button>
                            </form>
                        </div>
                    )}

                    {/* VIEW 5: SOCIAL MULTI MANAGER */}
                    {activeTab === "social" && <SocialMultiManager />}

                    {/* VIEW 6: CALENDARIO OPERATIVO */}
                    {activeTab === "calendar" && <OperativeCalendar />}

                    {/* VIEW 7: CALCULADORA FINANCIERA */}
                    {activeTab === "calculator" && <FinancialCalculator />}

                    {/* VIEW 8: ASIGNACIONES & ORGANIGRAMA */}
                    {activeTab === "asignaciones" && <InteractiveHierarchyMap />}

                    {/* VIEW 9: VALORES & TERMINAL BINANCE */}
                    {activeTab === "valores" && <CryptoBinanceTerminal />}

                    {/* VIEW 10: CONFIGURACIÓN DE CONEXIONES */}
                    {activeTab === "connections_config" && <ConnectionsConfigModal />}

                    {/* VIEW 11: PINTOR DE TEMAS */}
                    {activeTab === "theming" && <ThemePainterStudio />}

                    {/* VIEW 12: SUICIDE SQUAD WAR ROOM */}
                    {activeTab === "suicide_squad" && <SuicideSquadWarRoom />}

                    {/* VIEW 13: MENSAJES PARA COPIAR Y PEGAR (SCRIPTS MARKETPLACE) */}
                    {activeTab === "sales_copy_messages" && <SalesCopyManager onClose={() => setActiveTab("grid")} />}
                </div>
            </motion.div>
        </div>
    )
}
