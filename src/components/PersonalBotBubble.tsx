"use client"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
    X, Send, Sparkles, Loader2, Copy, Check, FileText, 
    ShoppingBag, Users, Map, Smartphone, DollarSign, Palette, 
    FileSpreadsheet, Bot, GraduationCap, ArrowRight, Table
} from "lucide-react"

interface BotMessage {
    id: string
    role: "user" | "assistant"
    content: string
    suggestions?: string[]
}

interface ModuleQuickAction {
    id: string
    label: string
    icon: React.ReactNode
    query: string
    path: string
}

const QUICK_MODULES: ModuleQuickAction[] = [
    { id: "quotes", label: "Cotizaciones PROP", icon: <FileText size={12} />, query: "¿Cómo funciona el módulo de cotizaciones y cómo descargo el PDF?", path: "/dashboard/quotes" },
    { id: "matriz", label: "Matriz de Precios", icon: <Table size={12} />, query: "¿Cómo consultar la matriz de precios, PVP y cotizar productos?", path: "/dashboard/matriz-precios" },
    { id: "coordinacion", label: "Coordinación", icon: <Users size={12} />, query: "¿Cómo asignar leads y usar la bitácora de coordinación?", path: "/dashboard/coordinacion" },
    { id: "prospecting", label: "Radar Prospección", icon: <Map size={12} />, query: "¿Cómo buscar clientes en el radar de prospección en mapa?", path: "/dashboard/map-prospecting" },
    { id: "crm", label: "WhatsApp CRM", icon: <Smartphone size={12} />, query: "¿Cómo gestionar los leads y pautas desde WhatsApp CRM?", path: "/dashboard/whatsapp/crm" },
    { id: "finance", label: "Finanzas", icon: <DollarSign size={12} />, query: "¿Cómo revisar el balance y comisiones en Finanzas?", path: "/dashboard/finance" },
    { id: "themes", label: "Cambiar Temas", icon: <Palette size={12} />, query: "¿Cómo personalizar los temas visuales del sistema?", path: "/dashboard/profile" },
    { id: "forms", label: "Tratos Proveedores", icon: <FileSpreadsheet size={12} />, query: "¿Cómo registrar fichas y tratos con proveedores?", path: "/dashboard/formularios" },
    { id: "academy", label: "Cursos Academy", icon: <GraduationCap size={12} />, query: "¿Qué capacitaciones comerciales tenemos en Academy?", path: "/dashboard/academy" },
    { id: "bot", label: "Bot Ruta & IA", icon: <Bot size={12} />, query: "¿Cómo funciona el bot de ruta y automatización?", path: "/dashboard/bot-ruta" }
]

export default function PersonalBotBubble() {
    const { data: session } = useSession()
    const pathname = usePathname()
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<BotMessage[]>([])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [botName, setBotName] = useState<string | null>(null)
    const [onboardingDone, setOnboardingDone] = useState(false)
    const [isNamingBot, setIsNamingBot] = useState(false)
    const [isInitializing, setIsInitializing] = useState(true)
    const [hasNewMessage, setHasNewMessage] = useState(false)
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Load memory on mount
    useEffect(() => {
        if (!session?.user) return
        fetch("/api/personal-bot/memory")
            .then(r => r.json())
            .then(data => {
                const memory = data.memory
                if (memory) {
                    setBotName(memory.botName || "Alfred")
                    setOnboardingDone(memory.onboardingDone)
                    if (memory.messages?.length > 0) {
                        const loaded: BotMessage[] = memory.messages.map((m: any) => ({
                            id: m.id,
                            role: m.role,
                            content: m.content,
                        }))
                        setMessages(loaded)
                    } else {
                        setMessages([{
                            id: "welcome",
                            role: "assistant",
                            content: `👋 ¡Hola **${session.user.name?.split(" ")[0] || "Asesor"}**! Soy tu asistente personal de **ATOMIC Industries**.\n\nTengo acceso a todos los módulos: Cotizaciones \`PROP\`, Inventario, Coordinación, Radar de Prospección y más.\n\n✨ Usa el **menú deslizable** abajo o escribe cualquier consulta para comenzar.`,
                        }])
                    }
                } else {
                    setMessages([{
                        id: "welcome",
                        role: "assistant",
                        content: `👋 ¡Hola **${session.user.name?.split(" ")[0] || "Asesor"}**! Soy tu asistente personal de **ATOMIC Industries**.\n\n¿Sobre qué módulo o tarea deseas que te asista hoy?`,
                    }])
                }
            })
            .catch(console.error)
            .finally(() => setIsInitializing(false))
    }, [session])

    // Contextual pop notification on route change
    useEffect(() => {
        if (!botName || isInitializing) return

        let popupText = ""
        if (pathname === "/dashboard") {
            popupText = `📍 **Estás en el Dashboard Principal**: Visualiza el estado operativo de ATOMIC, accesos rápidos y actividad de tu equipo.`
        } else if (pathname === "/dashboard/quotes") {
            popupText = `📍 **Estás en Cotizaciones**: Emite propuestas formales en PDF \`PROP-XXXX\` o usa el generador unificado.`
        } else if (pathname === "/dashboard/shop") {
            popupText = `📍 **Estás en Inventario**: Consulta el catálogo de más de 9,700 artículos, precios y proveedores.`
        } else if (pathname === "/dashboard/coordinacion") {
            popupText = `📍 **Estás en Coordinación**: Planifica metas de leads, bitácoras y supervisión de propuestas.`
        } else if (pathname === "/dashboard/profile") {
            popupText = `📍 **Estás en tu Perfil**: Puedes actualizar tus datos personales y seleccionar entre los **5 Temas Globales** del sistema.`
        }

        if (popupText) {
            setMessages(prev => {
                const last = prev[prev.length - 1]
                if (last && last.content.startsWith(popupText.substring(0, 25))) return prev
                return [...prev, { id: Date.now().toString(), role: "assistant", content: popupText }]
            })
            setHasNewMessage(true)
        }
    }, [pathname, botName, isInitializing])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const sendMessage = async (text?: string) => {
        const msgText = text || input.trim()
        if (!msgText || isLoading) return

        const userMsg: BotMessage = { id: Date.now().toString(), role: "user", content: msgText }
        setMessages(prev => [...prev, userMsg])
        setInput("")
        setIsLoading(true)

        try {
            const res = await fetch("/api/personal-bot", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: msgText, isNamingBot, currentPath: pathname })
            })
            const data = await res.json()

            if (data.botName) {
                setBotName(data.botName)
                setIsNamingBot(false)
                setOnboardingDone(true)
            }

            const botMsg: BotMessage = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: data.text || "Estoy listo para ayudarte con cualquier módulo de ATOMIC.",
                suggestions: data.suggestions || []
            }
            setMessages(prev => [...prev, botMsg])

            if (!isOpen) setHasNewMessage(true)
        } catch (err) {
            setMessages(prev => [...prev, {
                id: (Date.now() + 2).toString(),
                role: "assistant",
                content: "⚠️ Hubo un breve problema de conexión. Puedes elegir cualquier módulo del menú inferior para consultarme directamente."
            }])
        } finally {
            setIsLoading(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    }

    const formatContent = (text: string) => {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong class="text-cyan-300 font-bold">$1</strong>')
            .replace(/\*(.*?)\*/g, '<em class="text-slate-300">$1</em>')
            .replace(/`([^`]+)`/g, '<code class="bg-slate-900 px-1.5 py-0.5 rounded text-emerald-400 font-mono text-xs">$1</code>')
            .replace(/\n/g, '<br/>')
    }

    if (!session?.user) return null

    const displayName = botName || "Alfred"
    const firstLetter = displayName[0].toUpperCase()

    return (
        <>
            {/* Floating Bubble */}
            <motion.button
                onClick={() => { setIsOpen(true); setHasNewMessage(false) }}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.4)] group cursor-pointer"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                style={{ display: isOpen ? "none" : "flex" }}
            >
                <div className="absolute inset-0 rounded-full bg-cyan-500 opacity-25 animate-ping" />
                <div className="absolute inset-1 rounded-full bg-gradient-to-br from-cyan-400 via-indigo-600 to-teal-500 shadow-[0_0_30px_rgba(6,182,212,0.6)]" />
                <div className="relative z-10 flex flex-col items-center justify-center">
                    <span className="text-white font-black text-xl italic">{firstLetter}</span>
                    {hasNewMessage && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full border-2 border-slate-950 animate-bounce" />
                    )}
                </div>
            </motion.button>

            {/* Chat Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20, transformOrigin: "bottom right" }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                        className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 w-[92vw] sm:w-[440px] h-[85vh] sm:h-[650px] flex flex-col rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.9)] border border-cyan-500/30"
                        style={{ background: "linear-gradient(145deg, #090e1a 0%, #0d1527 50%, #060a12 100%)" }}
                    >
                        {/* Header */}
                        <div className="flex items-center gap-3 px-5 py-4 border-b border-cyan-500/20 bg-slate-950/60 backdrop-blur-md">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center font-black text-white text-lg shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                                {firstLetter}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-white font-black text-sm tracking-wide truncate">{displayName}</h3>
                                    <span className="px-1.5 py-0.5 rounded-full bg-cyan-400/15 text-cyan-300 text-[9px] font-mono font-bold">IA v2.4</span>
                                </div>
                                <p className="text-cyan-400 text-[10px] font-mono uppercase tracking-widest flex items-center gap-1.5 truncate">
                                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shrink-0" />
                                    Guía Integral ATOMIC
                                </p>
                            </div>

                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-8 h-8 rounded-xl bg-slate-800/80 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all shrink-0 cursor-pointer"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-700">
                            {isInitializing ? (
                                <div className="flex flex-col items-center justify-center h-full gap-2 text-slate-400">
                                    <Loader2 className="text-cyan-400 animate-spin" size={32} />
                                    <span className="text-xs font-mono">Conectando asistente...</span>
                                </div>
                            ) : (
                                <>
                                    {messages.map(msg => (
                                        <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                            {msg.role === "assistant" && (
                                                <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center font-black text-white text-xs mr-2 mt-0.5 shrink-0 shadow-[0_0_10px_rgba(6,182,212,0.4)]">
                                                    {firstLetter}
                                                </div>
                                            )}
                                            <div className={`max-w-[88%] ${msg.role === "user" ? "order-1" : ""}`}>
                                                <div
                                                    className={`px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                                                        msg.role === "user"
                                                            ? "bg-gradient-to-br from-cyan-600 to-indigo-600 text-white rounded-br-sm shadow-[0_0_15px_rgba(6,182,212,0.3)] font-medium"
                                                            : "bg-slate-900/90 text-slate-100 rounded-bl-sm border border-slate-800 shadow-md"
                                                    }`}
                                                    dangerouslySetInnerHTML={{ __html: formatContent(msg.content) }}
                                                />
                                                {msg.role === "assistant" && msg.suggestions && msg.suggestions.length > 0 && (
                                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                                        {msg.suggestions.map((s, i) => (
                                                            <button
                                                                key={i}
                                                                onClick={() => sendMessage(s)}
                                                                className="px-3 py-1.5 bg-slate-950/80 border border-cyan-500/30 text-cyan-300 rounded-xl text-[10px] font-bold hover:bg-cyan-500/20 hover:border-cyan-400 transition-all text-left cursor-pointer"
                                                            >
                                                                {s}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    {isLoading && (
                                        <div className="flex justify-start">
                                            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center font-black text-white text-xs mr-2 shrink-0">
                                                {firstLetter}
                                            </div>
                                            <div className="bg-slate-900/90 border border-slate-800 px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1.5 items-center">
                                                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Interactive Mini Scroll Menu for Modules */}
                        <div className="px-3 py-2 border-t border-slate-800/80 bg-slate-950/70">
                            <div className="flex items-center justify-between mb-1.5 px-1">
                                <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                    <Sparkles size={11} className="text-cyan-400" />
                                    <span>Módulos del Sistema (Haz clic para consultar)</span>
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none custom-scrollbar">
                                {QUICK_MODULES.map((m) => (
                                    <button
                                        key={m.id}
                                        onClick={() => sendMessage(m.query)}
                                        className="shrink-0 px-2.5 py-1.5 bg-slate-900/90 hover:bg-cyan-500/20 border border-slate-800 hover:border-cyan-400/50 text-slate-300 hover:text-cyan-200 text-[10px] font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
                                        title={`Preguntar sobre ${m.label}`}
                                    >
                                        <span className="text-cyan-400">{m.icon}</span>
                                        <span>{m.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Input Area */}
                        <div className="px-4 pb-4 pt-2 border-t border-cyan-500/10 bg-slate-950">
                            <div className="flex items-end gap-2">
                                <textarea
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder={`Pregunta a ${displayName} sobre cualquier módulo...`}
                                    rows={1}
                                    className="flex-1 bg-slate-900 border border-slate-800 text-white text-xs placeholder:text-slate-500 rounded-2xl px-4 py-3 outline-none resize-none focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/30 transition-all"
                                    style={{ maxHeight: "90px" }}
                                    onInput={(e: any) => {
                                        e.target.style.height = "auto"
                                        e.target.style.height = Math.min(e.target.scrollHeight, 90) + "px"
                                    }}
                                />
                                <button
                                    onClick={() => sendMessage()}
                                    disabled={!input.trim() || isLoading}
                                    className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-105 disabled:opacity-40 disabled:scale-100 transition-all shrink-0 cursor-pointer"
                                >
                                    {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
