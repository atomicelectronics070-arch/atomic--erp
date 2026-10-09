"use client"

import React, { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    X, Download, Youtube, Video, Image as ImageIcon, Music, 
    Sparkles, Bot, Send, Trash2, Copy, Check, ExternalLink, 
    Link as LinkIcon, RefreshCw, AlertCircle, CheckCircle2,
    Volume2, VolumeX, Smartphone, Share2, Layers, Search
} from "lucide-react"

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
}

export default function ToolsModal({
    isOpen,
    onClose,
    initialTab = "downloader"
}: {
    isOpen: boolean
    onClose: () => void
    initialTab?: "downloader" | "bot"
}) {
    const { data: session } = useSession()
    const userName = session?.user?.name?.split(" ")[0] || "Colaborador"
    const userEmail = session?.user?.email || "usuario@atomic.com.ec"

    const [activeTab, setActiveTab] = useState<"downloader" | "bot">(initialTab)

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
        } catch (e) {
            // Clipboard access denied, user can paste manually
        }
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
        // If it's a direct image, open or trigger download
        if (fmt.isDirectImage || fmt.type === "image") {
            const link = document.createElement("a")
            link.href = fmt.url
            link.target = "_blank"
            link.download = `atomic_${mediaResult?.videoId || "image"}.jpg`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } else {
            // Open direct fast downloader window
            window.open(fmt.url, "_blank")
        }
        setTimeout(() => setDownloadingFormat(null), 1500)
    }

    // ─────────────────────────────────────────────────────────────
    // 2. PERSONAL BOT STATE (EXCLUSIVE PER USER)
    // ─────────────────────────────────────────────────────────────
    const storageKey = `atomic_personal_bot_history_${userEmail}`
    const botNameKey = `atomic_personal_bot_name_${userEmail}`

    const [customBotName, setCustomBotName] = useState<string>("Mi Asistente Personal")
    const [isEditingBotName, setIsEditingBotName] = useState(false)
    const [botMessages, setBotMessages] = useState<PersonalChatMessage[]>([])
    const [botInput, setBotInput] = useState("")
    const [isBotThinking, setIsBotThinking] = useState(false)
    const [botPersona, setBotPersona] = useState<"VENTAS" | "MEDIA" | "TECNICO">("VENTAS")
    const [voiceActive, setVoiceActive] = useState(false)
    const chatEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!isOpen) return
        try {
            const savedName = localStorage.getItem(botNameKey)
            if (savedName) setCustomBotName(savedName)
            else setCustomBotName(`Copiloto de ${userName}`)

            const savedChat = localStorage.getItem(storageKey)
            if (savedChat) {
                const parsed = JSON.parse(savedChat)
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setBotMessages(parsed)
                    return
                }
            }
            // Welcome message if empty
            setBotMessages([{
                id: "init-welcome",
                role: "assistant",
                content: `Hola **${userName}**, soy tu **Bot Personal exclusivo** en Herramientas.\n\nAquí tienes un espacio 100% privado donde puedo ayudarte con argumentos de venta, redacción de copys para redes, resúmenes o respuestas rápidas para tus clientes.\n\n¿En qué trabajamos ahora?`,
                timestamp: Date.now()
            }])
        } catch (e) {
            // localStorage not available
        }
    }, [isOpen, userEmail, userName])

    useEffect(() => {
        if (botMessages.length > 0) {
            try {
                localStorage.setItem(storageKey, JSON.stringify(botMessages))
            } catch (e) {}
        }
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [botMessages])

    const saveBotName = (name: string) => {
        setCustomBotName(name)
        setIsEditingBotName(false)
        try {
            localStorage.setItem(botNameKey, name)
        } catch (e) {}
    }

    const clearPersonalChat = () => {
        if (!confirm("¿Deseas reiniciar la conversación de tu Bot Personal?")) return
        const fresh: PersonalChatMessage = {
            id: `msg-${Date.now()}`,
            role: "assistant",
            content: `Memoria reiniciada. ¡Listo para nuevas consultas, **${userName}**!`,
            timestamp: Date.now()
        }
        setBotMessages([fresh])
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
            // Call AI personal-bot endpoint with context
            const res = await fetch("/api/personal-bot", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: updated.map(m => ({ role: m.role, content: m.content })),
                    currentPath: "/dashboard/herramientas",
                    persona: botPersona,
                    botName: customBotName
                })
            })

            const data = await res.json()
            const reply = data.reply || `Entendido ${userName}. Como tu asistente personal configurado en modo ${botPersona}, te sugiero enfocar la propuesta destacando la garantía directa de fábrica, soporte técnico inmediato y facturación con IVA incluido.`

            const assistantMsg: PersonalChatMessage = {
                id: `ast-${Date.now()}`,
                role: "assistant",
                content: reply,
                timestamp: Date.now()
            }
            setBotMessages(prev => [...prev, assistantMsg])

            // Speak if TTS enabled
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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-2xl animate-in fade-in duration-200">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-[28px] bg-[#070b18] border border-cyan-500/30 shadow-[0_20px_70px_rgba(0,0,0,0.85)] overflow-hidden text-white"
            >
                {/* ── TOP HEADER ── */}
                <div className="px-6 py-4 border-b border-white/[0.08] bg-[#0c1224] flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                            <Layers size={20} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-base font-black tracking-tight text-white uppercase">
                                    Caja de Herramientas ATOMIC
                                </h2>
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-cyan-400/10 text-cyan-300 border border-cyan-500/30">
                                    PRO
                                </span>
                            </div>
                            <p className="text-xs text-white/50 font-mono">
                                Descargador multimedia de YouTube y tu Asistente Personal exclusivo
                            </p>
                        </div>
                    </div>

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="w-9 h-9 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white/60 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                        title="Cerrar Herramientas"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* ── NAVIGATION TABS ── */}
                <div className="px-6 pt-3 pb-2 bg-[#090e1f] border-b border-white/[0.06] flex items-center gap-2 shrink-0">
                    <button
                        onClick={() => setActiveTab("downloader")}
                        className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                            activeTab === "downloader"
                                ? "bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                                : "text-white/60 hover:text-white hover:bg-white/[0.04]"
                        }`}
                    >
                        <Download size={14} />
                        <span>Descargar Videos y Fotos (YouTube & Redes)</span>
                    </button>

                    <button
                        onClick={() => setActiveTab("bot")}
                        className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                            activeTab === "bot"
                                ? "bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                                : "text-white/60 hover:text-white hover:bg-white/[0.04]"
                        }`}
                    >
                        <Bot size={14} />
                        <span>Mi Bot Personal ({userName})</span>
                    </button>
                </div>

                {/* ── TAB CONTENT BODY ── */}
                <div className="flex-1 overflow-y-auto p-5 sm:p-6 custom-scrollbar bg-[#050814]">
                    {/* TAB 1: MEDIA DOWNLOADER */}
                    {activeTab === "downloader" && (
                        <div className="space-y-6">
                            {/* Input Form Card */}
                            <div className="p-5 rounded-2xl bg-[#0b1021] border border-cyan-500/20 shadow-xl space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                    <label className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                                        <LinkIcon size={14} />
                                        <span>Pega el enlace de YouTube, TikTok, Instagram o Facebook:</span>
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-mono text-white/40">Plataformas soportadas:</span>
                                        <div className="flex items-center gap-1 text-[10px] font-bold text-white/70">
                                            <span className="px-1.5 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-800/40">YouTube</span>
                                            <span className="px-1.5 py-0.5 rounded bg-pink-950/80 text-pink-400 border border-pink-800/40">Instagram</span>
                                            <span className="px-1.5 py-0.5 rounded bg-slate-900 text-cyan-400 border border-slate-700">TikTok</span>
                                            <span className="px-1.5 py-0.5 rounded bg-blue-950/80 text-blue-400 border border-blue-800/40">Facebook</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="relative flex-1">
                                        <input
                                            type="text"
                                            value={mediaUrl}
                                            onChange={(e) => setMediaUrl(e.target.value)}
                                            onKeyDown={(e) => { if (e.key === "Enter") analyzeMediaUrl() }}
                                            placeholder="https://www.youtube.com/watch?v=... o https://youtu.be/... o Shorts"
                                            className="w-full h-12 pl-4 pr-12 rounded-xl bg-[#070b16] border border-white/10 text-white placeholder-white/30 text-xs sm:text-sm font-mono focus:outline-none focus:border-cyan-400 transition-all"
                                        />
                                        {mediaUrl && (
                                            <button
                                                onClick={() => { setMediaUrl(""); setMediaResult(null); setMediaError(null) }}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                                            >
                                                <X size={16} />
                                            </button>
                                        )}
                                    </div>

                                    <button
                                        onClick={handlePasteClipboard}
                                        type="button"
                                        className="h-12 px-3.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white/80 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
                                        title="Pegar desde el portapapeles"
                                    >
                                        <Copy size={14} />
                                        <span className="hidden sm:inline">Pegar</span>
                                    </button>

                                    <button
                                        onClick={() => analyzeMediaUrl()}
                                        disabled={isFetchingMedia || !mediaUrl.trim()}
                                        type="button"
                                        className="h-12 px-5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-50 text-white font-black text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all shrink-0 cursor-pointer"
                                    >
                                        {isFetchingMedia ? (
                                            <>
                                                <RefreshCw size={16} className="animate-spin" />
                                                <span>Analizando...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Search size={16} />
                                                <span>Extraer</span>
                                            </>
                                        )}
                                    </button>
                                </div>

                                {mediaError && (
                                    <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                                        <AlertCircle size={16} className="shrink-0" />
                                        <span>{mediaError}</span>
                                    </div>
                                )}
                            </div>

                            {/* Result Showcase */}
                            {mediaResult && (
                                <div className="p-6 rounded-2xl bg-[#0b1021] border border-cyan-500/30 shadow-2xl space-y-6 animate-in fade-in duration-300">
                                    <div className="flex flex-col md:flex-row gap-5 items-start">
                                        {/* Thumbnail HD */}
                                        <div className="w-full md:w-64 aspect-video rounded-xl overflow-hidden bg-black/40 border border-white/10 relative shrink-0 shadow-lg group">
                                            <img
                                                src={mediaResult.thumbnail}
                                                alt={mediaResult.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm text-[9px] font-mono font-bold text-cyan-300 border border-white/20">
                                                {mediaResult.platform.toUpperCase()}
                                            </span>
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0 space-y-2">
                                            <div className="flex items-center gap-2">
                                                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                                                    Listo para Descargar
                                                </span>
                                                <span className="text-xs text-white/50 font-mono">{mediaResult.author}</span>
                                            </div>
                                            <h3 className="text-base font-bold text-white line-clamp-2 leading-snug">
                                                {mediaResult.title}
                                            </h3>
                                            <p className="text-xs text-white/50 font-mono">
                                                Elige el formato deseado para descargar a tu teléfono o computadora:
                                            </p>
                                        </div>
                                    </div>

                                    {/* Format Cards Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                        {mediaResult.formats.map((fmt, i) => (
                                            <div
                                                key={i}
                                                className="p-4 rounded-xl bg-[#070b16] border border-white/[0.08] hover:border-cyan-400/50 transition-all flex items-center justify-between gap-3 group"
                                            >
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                                        fmt.type === "video" 
                                                            ? "bg-red-500/10 text-red-400 border border-red-500/30" 
                                                            : fmt.type === "audio"
                                                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                                                            : "bg-indigo-500/10 text-indigo-400 border border-indigo-500/30"
                                                    }`}>
                                                        {fmt.type === "video" ? <Video size={18} /> : fmt.type === "audio" ? <Music size={18} /> : <ImageIcon size={18} />}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="text-xs font-bold text-white truncate group-hover:text-cyan-300 transition-colors">
                                                            {fmt.label}
                                                        </div>
                                                        <div className="text-[10px] font-mono text-white/40">
                                                            Calidad: {fmt.quality}
                                                        </div>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => handleDownloadItem(fmt)}
                                                    className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs flex items-center gap-1.5 transition-all shadow-md shrink-0 cursor-pointer active:scale-95"
                                                >
                                                    <Download size={14} />
                                                    <span>Bajar</span>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quick Presets for Sellers & Social Team */}
                            <div className="p-5 rounded-2xl bg-[#070b16] border border-white/[0.06] space-y-3">
                                <h4 className="text-xs font-bold text-white/70 uppercase tracking-wider">
                                    💡 Consejos útiles de descarga multimedia:
                                </h4>
                                <ul className="text-xs text-white/50 space-y-1.5 list-disc list-inside font-mono">
                                    <li><strong>YouTube Shorts & Videos:</strong> Copia el enlace desde la app móvil o navegador y pégalo aquí para obtener el MP4 1080p o audio MP3.</li>
                                    <li><strong>Fotos de Portada:</strong> Puedes guardar las miniaturas oficiales en máxima resolución para usarlas en cotizaciones o fichas técnicas.</li>
                                    <li><strong>Instagram & TikTok:</strong> Permite obtener reels sin marca de agua para capacitación o difusión de productos.</li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* TAB 2: MI BOT PERSONAL */}
                    {activeTab === "bot" && (
                        <div className="flex flex-col h-[520px] rounded-2xl bg-[#090d1c] border border-purple-500/30 overflow-hidden shadow-2xl">
                            {/* Bot Sub-header */}
                            <div className="p-4 bg-[#0d142b] border-b border-white/[0.08] flex items-center justify-between shrink-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                                        <Bot size={18} />
                                    </div>
                                    <div>
                                        {isEditingBotName ? (
                                            <input
                                                type="text"
                                                defaultValue={customBotName}
                                                autoFocus
                                                onBlur={(e) => saveBotName(e.target.value.trim() || customBotName)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") saveBotName((e.target as any).value.trim() || customBotName)
                                                }}
                                                className="px-2 py-0.5 bg-black/60 border border-purple-400 rounded text-xs font-bold text-purple-200"
                                            />
                                        ) : (
                                            <div 
                                                onClick={() => setIsEditingBotName(true)}
                                                className="flex items-center gap-1.5 cursor-pointer group"
                                                title="Haz clic para renombrar a tu Bot"
                                            >
                                                <h3 className="text-xs font-bold text-white group-hover:text-purple-300">
                                                    {customBotName}
                                                </h3>
                                                <span className="text-[10px] text-white/30 group-hover:text-purple-400">✏️</span>
                                            </div>
                                        )}
                                        <p className="text-[10px] font-mono text-purple-300/60">
                                            Privado de: {userName} ({userEmail})
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {/* Persona Mode */}
                                    <div className="flex items-center bg-black/40 border border-white/10 rounded-xl p-0.5 text-[10px]">
                                        <button
                                            onClick={() => setBotPersona("VENTAS")}
                                            className={`px-2 py-1 rounded-lg transition-all ${
                                                botPersona === "VENTAS" ? "bg-purple-600 text-white font-bold" : "text-white/40 hover:text-white"
                                            }`}
                                        >
                                            Ventas
                                        </button>
                                        <button
                                            onClick={() => setBotPersona("MEDIA")}
                                            className={`px-2 py-1 rounded-lg transition-all ${
                                                botPersona === "MEDIA" ? "bg-purple-600 text-white font-bold" : "text-white/40 hover:text-white"
                                            }`}
                                        >
                                            Media
                                        </button>
                                        <button
                                            onClick={() => setBotPersona("TECNICO")}
                                            className={`px-2 py-1 rounded-lg transition-all ${
                                                botPersona === "TECNICO" ? "bg-purple-600 text-white font-bold" : "text-white/40 hover:text-white"
                                            }`}
                                        >
                                            Técnico
                                        </button>
                                    </div>

                                    {/* Voice Toggle */}
                                    <button
                                        onClick={() => setVoiceActive(!voiceActive)}
                                        className={`p-2 rounded-xl border transition-all ${
                                            voiceActive ? "bg-purple-600/30 border-purple-400 text-purple-300" : "bg-white/[0.04] border-white/10 text-white/40"
                                        }`}
                                        title={voiceActive ? "Voz activada" : "Activar voz"}
                                    >
                                        {voiceActive ? <Volume2 size={14} /> : <VolumeX size={14} />}
                                    </button>

                                    {/* Clear chat */}
                                    <button
                                        onClick={clearPersonalChat}
                                        className="p-2 rounded-xl bg-white/[0.04] hover:bg-rose-500/20 text-white/40 hover:text-rose-300 border border-white/10 transition-all cursor-pointer"
                                        title="Reiniciar conversación"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>

                            {/* Chat Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-[#060914]">
                                {botMessages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                    >
                                        <div
                                            className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                                                msg.role === "user"
                                                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-br-none shadow-md"
                                                    : "bg-[#0d1326] text-white/90 border border-white/[0.08] rounded-bl-none shadow-sm"
                                            }`}
                                        >
                                            <div className="whitespace-pre-wrap">{msg.content}</div>
                                        </div>
                                    </div>
                                ))}

                                {isBotThinking && (
                                    <div className="flex justify-start">
                                        <div className="px-4 py-2 rounded-2xl bg-[#0d1326] border border-white/[0.08] text-xs text-purple-300 flex items-center gap-2">
                                            <RefreshCw size={12} className="animate-spin" />
                                            <span>Pensando respuesta para ti...</span>
                                        </div>
                                    </div>
                                )}
                                <div ref={chatEndRef} />
                            </div>

                            {/* Quick Sales/Media prompts */}
                            <div className="px-3 py-1.5 bg-[#090d1c] border-t border-white/[0.04] flex items-center gap-1.5 overflow-x-auto custom-scrollbar shrink-0">
                                {[
                                    "¿Cómo rebatir 'Está muy caro'?",
                                    "Dame un guión de cierre para CCTV",
                                    "Redacta un copy promocional para TikTok",
                                    "¿Cuáles son los pasos de garantía?"
                                ].map((p, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => sendPersonalBotMessage(p)}
                                        className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-white/[0.05] hover:bg-purple-600/20 hover:text-purple-200 text-white/50 whitespace-nowrap transition-all border border-white/[0.06] cursor-pointer shrink-0"
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>

                            {/* Chat Input */}
                            <div className="p-3 bg-[#0a0f21] border-t border-white/[0.08] flex items-center gap-2 shrink-0">
                                <input
                                    type="text"
                                    value={botInput}
                                    onChange={(e) => setBotInput(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === "Enter") sendPersonalBotMessage() }}
                                    placeholder={`Pregunta a tu ${customBotName}...`}
                                    className="flex-1 h-11 px-4 rounded-xl bg-[#060914] border border-white/10 text-white placeholder-white/30 text-xs focus:outline-none focus:border-purple-400 transition-all font-sans"
                                />

                                <button
                                    onClick={() => sendPersonalBotMessage()}
                                    disabled={!botInput.trim() || isBotThinking}
                                    className="h-11 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(168,85,247,0.4)] cursor-pointer shrink-0"
                                >
                                    <Send size={14} />
                                    <span className="hidden sm:inline">Enviar</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    )
}
