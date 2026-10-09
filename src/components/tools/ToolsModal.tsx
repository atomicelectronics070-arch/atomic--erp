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
    MessageSquare, DollarSign, Key, Zap
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

export type ToolTab = 
    | "grid"
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

    // Synchronize initialTab if changed externally
    useEffect(() => {
        if (isOpen) {
            setActiveTab(initialTab)
        }
    }, [isOpen, initialTab])

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
    // 2. UNIFIED BOT STATE (SWITCH TRABAJO VS CRIPTO + TELEGRAM/WHATSAPP)
    // ─────────────────────────────────────────────────────────────
    const storageKey = `atomic_personal_bot_history_${userEmail}`
    const botNameKey = `atomic_personal_bot_name_${userEmail}`

    const [customBotName, setCustomBotName] = useState<string>("Mi Asistente Personal & Guía")
    const [isEditingBotName, setIsEditingBotName] = useState(false)
    const [botMessages, setBotMessages] = useState<PersonalChatMessage[]>([])
    const [botInput, setBotInput] = useState("")
    const [isBotThinking, setIsBotThinking] = useState(false)
    const [botMode, setBotMode] = useState<"TRABAJO" | "CRIPTO">("TRABAJO")
    const [voiceActive, setVoiceActive] = useState(false)
    const [isTelegramModalOpen, setIsTelegramModalOpen] = useState(false)
    const [isWhatsappModalOpen, setIsWhatsappModalOpen] = useState(false)
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

            // Welcome default message
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

            if (voiceActive && "speechSynthesis" in window) {
                const utterance = new SpeechSynthesisUtterance(reply.replace(/[*_#`]/g, ""))
                utterance.lang = "es-EC"
                window.speechSynthesis.speak(utterance)
            }
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

    // Tools Definitions for Grid View
    const TOOLS_LIST = [
        {
            id: "anydesk" as ToolTab,
            title: "AnyDesk ATOMIC",
            badge: "PRO IA",
            badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/40",
            icon: Monitor,
            color: "text-rose-400 bg-rose-500/10 border-rose-500/30",
            desc: "Control de PC con soporte para doble monitor simultáneo, visión de pantalla y copiloto IA de hardware."
        },
        {
            id: "zoom" as ToolTab,
            title: "Zoom Interno (ATOMIC Meet)",
            badge: "ILIMITADO",
            badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
            icon: Video,
            color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
            desc: "Videollamadas P2P ilimitadas con cámara, micrófono, compartir pantalla y chat lateral de equipo."
        },
        {
            id: "downloader" as ToolTab,
            title: "Descargador Multimedia",
            badge: "HD 1080p",
            badgeColor: "bg-red-500/20 text-red-300 border-red-500/40",
            icon: Youtube,
            color: "text-red-400 bg-red-500/10 border-red-500/30",
            desc: "Descarga videos MP4, audios MP3 y portadas en alta resolución de YouTube, TikTok, Instagram y FB."
        },
        {
            id: "bot" as ToolTab,
            title: "Mi Bot Personal & Guía",
            badge: "CEREBRO IA",
            badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/40",
            icon: Bot,
            color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30",
            desc: "Asistente unificado con switch Trabajo/Cripto, coaching empresarial y conectores a Telegram y WhatsApp."
        },
        {
            id: "valores" as ToolTab,
            title: "Valores & Terminal Binance",
            badge: "EN VIVO",
            badgeColor: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
            icon: Activity,
            color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
            desc: "Cotizaciones oficiales en vivo de Binance, gráficos de velas, libro de órdenes y automatización algorítmica."
        },
        {
            id: "asignaciones" as ToolTab,
            title: "Asignaciones & Organigrama",
            badge: "2D MAP",
            badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/40",
            icon: Users,
            color: "text-purple-400 bg-purple-500/10 border-purple-500/30",
            desc: "Mapa conceptual interactivo con nodos arrastrables, conexiones de jerarquía superior/inferior y privilegios."
        },
        {
            id: "social" as ToolTab,
            title: "Gestor Social Multicuentas",
            badge: "MULTI",
            badgeColor: "bg-pink-500/20 text-pink-300 border-pink-500/40",
            icon: Share2,
            color: "text-pink-400 bg-pink-500/10 border-pink-500/30",
            desc: "Gestión de múltiples perfiles de TikTok, Instagram y Facebook con generador de copys por IA."
        },
        {
            id: "calendar" as ToolTab,
            title: "Calendario Operativo",
            badge: "AGENDA",
            badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
            icon: Calendar,
            color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
            desc: "Planificación mensual de visitas técnicas, entregas de productos, reuniones Zoom y cobros."
        },
        {
            id: "calculator" as ToolTab,
            title: "Calculadora con Historial",
            badge: "IVA 15%",
            badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
            icon: Calculator,
            color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
            desc: "Cálculos comerciales con IVA Ecuador, márgenes de ganancia %, descuentos y cinta de auditoría exportable."
        },
        {
            id: "connections_config" as ToolTab,
            title: "Configuración de Conexiones",
            badge: "TOKENS",
            badgeColor: "bg-slate-500/20 text-slate-300 border-slate-500/40",
            icon: Settings,
            color: "text-slate-300 bg-slate-800 border-slate-700",
            desc: "Administración de tokens sociales, propósitos autoguardados (Cripto vs Trabajo) y canales habilitados."
        },
        {
            id: "theming" as ToolTab,
            title: "Pintor de Temas (Color Studio)",
            badge: "DINÁMICO",
            badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
            icon: Palette,
            color: "text-amber-400 bg-amber-500/10 border-amber-500/30",
            desc: "Pinta literalmente el sistema con selector de color primario neón, fondo base y variables CSS en tiempo real."
        }
    ]

    const filteredTools = TOOLS_LIST.filter(t => 
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        t.desc.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-2xl animate-in fade-in duration-200">
            <motion.div 
                initial={{ opacity: 0, scale: 0.96, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 15 }}
                className="relative w-full max-w-7xl h-[92vh] bg-[#070b18] border border-cyan-500/30 rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden"
            >
                {/* ── TOP HEADER BAR ── */}
                <div className="px-5 py-3.5 border-b border-cyan-500/20 bg-slate-950/80 flex flex-wrap items-center justify-between gap-3 shrink-0">
                    <div className="flex items-center gap-3">
                        {activeTab !== "grid" && (
                            <button
                                onClick={() => setActiveTab("grid")}
                                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                            >
                                <ArrowLeft size={14} />
                                <span>Cuadrícula</span>
                            </button>
                        )}

                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-black font-black shadow-lg shadow-cyan-500/30">
                                <Sparkles size={18} />
                            </div>
                            <div>
                                <h2 className="text-sm sm:text-base font-black tracking-tight text-white flex items-center gap-2">
                                    Caja de Herramientas ATOMIC
                                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-cyan-400 text-black uppercase">
                                        PRO 2026
                                    </span>
                                </h2>
                                <p className="text-[10px] text-slate-400 font-mono hidden sm:block">
                                    Suite avanzada de utilidades operacionales, streaming, IA y finanzas
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Quick navigation pill or close */}
                    <div className="flex items-center gap-2">
                        {activeTab === "grid" && (
                            <div className="relative">
                                <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Buscar herramienta..."
                                    className="bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 w-44 sm:w-56"
                                />
                            </div>
                        )}

                        <button 
                            onClick={onClose}
                            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-rose-500/20 hover:text-rose-400 transition-colors cursor-pointer"
                            title="Cerrar modal"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* ── BODY VIEW ROUTER ── */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#050813]">
                    {/* VIEW 0: GRID VIEW (VISTA EN CUADRÍCULA) */}
                    {activeTab === "grid" && (
                        <div className="space-y-6 max-w-6xl mx-auto">
                            <div className="text-center space-y-1">
                                <h3 className="text-xl sm:text-2xl font-black text-white">Centro de Herramientas Operacionales</h3>
                                <p className="text-xs text-slate-400 font-mono">
                                    Selecciona cualquier módulo para iniciar la herramienta en pantalla completa.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredTools.map(tool => {
                                    const IconComponent = tool.icon
                                    return (
                                        <button
                                            key={tool.id}
                                            onClick={() => setActiveTab(tool.id)}
                                            className="p-5 rounded-3xl bg-[#080d22]/90 border border-slate-800/90 hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)] text-left transition-all duration-200 flex flex-col justify-between space-y-4 group cursor-pointer"
                                        >
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition-transform group-hover:scale-110 ${tool.color}`}>
                                                        <IconComponent size={24} />
                                                    </div>
                                                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${tool.badgeColor}`}>
                                                        {tool.badge}
                                                    </span>
                                                </div>

                                                <div>
                                                    <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                                                        {tool.title}
                                                    </h4>
                                                    <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                                                        {tool.desc}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-mono text-cyan-400 group-hover:translate-x-1 transition-transform">
                                                <span>Abrir Herramienta</span>
                                                <ArrowRight size={14} />
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* VIEW 1: ANYDESK ATOMIC */}
                    {activeTab === "anydesk" && <AnyDeskRemoteView />}

                    {/* VIEW 2: ZOOM INTERNO (ATOMIC MEET) */}
                    {activeTab === "zoom" && (
                        <div className="h-full flex flex-col items-center justify-center space-y-4">
                            <AtomicMeetModal
                                isOpen={true}
                                onClose={() => setActiveTab("grid")}
                                targetMember={{ name: "Sala Principal de Equipo", roleName: "Conferencia P2P" }}
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
                                        className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1.5"
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

                            {/* Media Result Preview */}
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

                                    {/* Format Download Buttons */}
                                    <div className="pt-3 border-t border-slate-800 flex flex-wrap gap-2.5">
                                        {mediaResult.formats.map((fmt, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleDownloadItem(fmt)}
                                                className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 text-white text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md"
                                            >
                                                {fmt.type === "video" && <Video size={14} className="text-cyan-400" />}
                                                {fmt.type === "audio" && <Music size={14} className="text-emerald-400" />}
                                                {fmt.type === "image" && <ImageIcon size={14} className="text-purple-400" />}
                                                <span>{fmt.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* VIEW 4: MI BOT PERSONAL & GUÍA */}
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

                                {/* Connect Telegram & WhatsApp Buttons */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setIsTelegramModalOpen(true)}
                                        className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
                                    >
                                        <Send size={12} />
                                        <span>Conectar Telegram</span>
                                    </button>
                                    <button
                                        onClick={() => setIsWhatsappModalOpen(true)}
                                        className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
                                    >
                                        <MessageSquare size={12} />
                                        <span>Conectar WhatsApp</span>
                                    </button>
                                </div>
                            </div>

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

                                        {/* Clickable Action Buttons if present */}
                                        {m.clickableOptions && m.clickableOptions.length > 0 && (
                                            <div className="mt-3 pt-2 border-t border-white/10 flex flex-wrap gap-2">
                                                {m.clickableOptions.map((opt, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => handleOptionClick(opt.action)}
                                                        className="px-2.5 py-1 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 font-mono text-[10px] font-bold transition-all cursor-pointer shadow-sm"
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
                </div>
            </motion.div>

            {/* Modal: Conectar Telegram */}
            {isTelegramModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="w-full max-w-md bg-[#090d1e] border border-cyan-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <h4 className="font-bold text-white text-sm flex items-center gap-2">
                                <Send size={16} className="text-cyan-400" />
                                Conectar Bot de Telegram
                            </h4>
                            <button onClick={() => setIsTelegramModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
                        </div>
                        <div className="text-xs text-slate-300 font-sans space-y-2.5">
                            <p>1. Abre Telegram y escribe a <strong>@BotFather</strong> para crear o consultar tu token.</p>
                            <p>2. Pega aquí el Token HTTP API otorgado por BotFather:</p>
                            <input
                                type="text"
                                value={telegramToken}
                                onChange={(e) => setTelegramToken(e.target.value)}
                                placeholder="123456789:ABCdefGHIjklMNOpqrs..."
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                            />
                            <p className="text-[11px] text-slate-400">
                                El webhook `/api/telegram/webhook` enviará botones interactivos (Cotizar, Precios, Asesor) y guardará el historial con el núcleo del bot.
                            </p>
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <button onClick={() => setIsTelegramModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs">
                                Cancelar
                            </button>
                            <button
                                onClick={() => {
                                    alert("¡Token de Telegram guardado y sincronizado con el Bot Guía!")
                                    setIsTelegramModalOpen(false)
                                }}
                                className="px-5 py-2 rounded-xl bg-cyan-500 text-black font-bold text-xs"
                            >
                                Vincular Telegram
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal: Conectar WhatsApp */}
            {isWhatsappModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="w-full max-w-md bg-[#090d1e] border border-emerald-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <h4 className="font-bold text-white text-sm flex items-center gap-2">
                                <MessageSquare size={16} className="text-emerald-400" />
                                Conectar WhatsApp al Bot Guía
                            </h4>
                            <button onClick={() => setIsWhatsappModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
                        </div>
                        <div className="text-xs text-slate-300 font-sans space-y-2.5">
                            <p>Para hablar directamente desde WhatsApp con el Bot Guía/Personal de ATOMIC:</p>
                            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-[11px] font-mono">
                                <div>• Número Oficial: <strong>+593 98 333 1234</strong></div>
                                <div>• Meta Graph API: <strong>v21.0 Cloud Conectado</strong></div>
                                <div>• Botones Clickables: <strong>Habilitados en Plantillas</strong></div>
                            </div>
                            <p className="text-[11px] text-slate-400">
                                Puedes ingresar el token permanente en la pestaña <em>Configuración de Conexiones</em> o enviar un mensaje directo para activar la sesión.
                            </p>
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <button onClick={() => setIsWhatsappModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs">
                                Entendido
                            </button>
                            <button
                                onClick={() => {
                                    window.open("https://wa.me/593983331234?text=Hola%20Bot%20Guia%20ATOMIC", "_blank")
                                    setIsWhatsappModalOpen(false)
                                }}
                                className="px-5 py-2 rounded-xl bg-emerald-500 text-black font-bold text-xs"
                            >
                                Probar en WhatsApp
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
