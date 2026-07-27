"use client"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { X, Send, Sparkles, Loader2, Copy, Check, FileText } from "lucide-react"

interface BotMessage {
    id: string
    role: "user" | "assistant"
    content: string
    suggestions?: string[]
}

export default function PersonalBotBubble() {
    const { data: session } = useSession()
    const pathname = usePathname()
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

    // Quick Quote Template
    const quickQuoteTemplate = `📋 **FORMATO DE COTIZACIÓN RÁPIDA**
----------------------------------------
• **Asunto/Tema:** [Cotización Equipos NFC]
• **Nombre / Razón Social:** [Nombre del Cliente]
• **Correo Electrónico:** [cliente@empresa.com]
• **Teléfono:** [+593 99 999 9999]
• **Lista de Productos:**
  - Código: [SKU-001] | Desc: [Acrílico Google Reviews] | Cant: [5] | P.Unit: [$15.00]
----------------------------------------
*Puedes copiar este texto, llenar los datos y pegarlo aquí mismo para generar la cotización descargable en PDF.*`

    // Load memory on mount
    useEffect(() => {
        if (!session?.user) return
        fetch("/api/personal-bot/memory")
            .then(r => r.json())
            .then(data => {
                const memory = data.memory
                if (memory) {
                    setBotName(memory.botName)
                    setOnboardingDone(memory.onboardingDone)
                    if (memory.messages?.length > 0) {
                        const loaded: BotMessage[] = memory.messages.map((m: any) => ({
                            id: m.id,
                            role: m.role,
                            content: m.content,
                        }))
                        setMessages(loaded)
                    } else if (!memory.botName) {
                        setIsNamingBot(true)
                        setMessages([{
                            id: "welcome",
                            role: "assistant",
                            content: `👋 ¡Hola ${session.user.name?.split(" ")[0] || ""}! Soy tu asistente personal de **ATOMIC Industries**.\n\nTengo acceso a todo tu perfil, tus cotizaciones, tu posición en el ranking y mucho más. Estaré contigo donde estés para guiarte en un camino laboral saludable y con futuro.\n\n✨ **¿Cómo te gustaría llamarme?**\n*(Escribe el nombre que quieras darme — lo recordaré siempre)*`,
                        }])
                    }
                } else {
                    setIsNamingBot(true)
                    setMessages([{
                        id: "welcome",
                        role: "assistant",
                        content: `👋 ¡Hola ${session.user.name?.split(" ")[0] || ""}! Soy tu asistente personal de **ATOMIC Industries**.\n\nTengo acceso a todo tu perfil, tus cotizaciones, tu posición en el ranking y mucho más. Estaré contigo donde estés para guiarte en un camino laboral saludable y con futuro.\n\n✨ **¿Cómo te gustaría llamarme?**\n*(Escribe el nombre que quieras darme — lo recordaré siempre)*`,
                    }])
                }
            })
            .catch(console.error)
            .finally(() => setIsInitializing(false))
    }, [session])

    // Contextual pop notification on route change
    useEffect(() => {
        if (!botName || !onboardingDone || isInitializing) return

        let popupText = ""
        if (pathname === "/dashboard") {
            popupText = `📍 **Estás en la Oficina Virtual**: Aquí encuentras la red social interna, las publicaciones del equipo, noticias y las estaciones de trabajo 2.5D con avatares asignados.`
        } else if (pathname === "/dashboard/analytics") {
            popupText = `📍 **Estás en Análisis Strategic BI 2027**: Módulo diseñado para darte un resumen profundo en tiempo real de ingresos, conversión y telemetría de asesores.`
        } else if (pathname === "/dashboard/coordinacion") {
            popupText = `📍 **Estás en Coordinación**: Este módulo sirve para la planificación estratégica diaria, asignación de objetivos de leads y supervisión de equipos.`
        } else if (pathname === "/dashboard/quotes") {
            popupText = `📍 **Estás en Cotizaciones**: Aquí emites cotizaciones formales en PDF. Puedes usar el botón de **Hacer Cotización Rápida** para enviarme los datos y procesarla al instante.`
        } else if (pathname === "/dashboard/shop") {
            popupText = `📍 **Estás en Inventario y Precios**: Catálogo de productos con stock en tiempo real y fichas técnicas. ¿Tienes alguna duda de un modelo?`
        } else if (pathname === "/dashboard/map-prospecting") {
            popupText = `📍 **Estás en Prospección Mapa**: Módulo para buscar negocios o conjuntos cercanos. ¿Quieres que busque por ti? Escríbeme qué buscar (ej: "conjuntos residenciales") y activaré el radar. Si un lead no tiene teléfono, lo guardaremos para Visitas Técnicas.`
        }

        if (popupText) {
            setMessages(prev => {
                const last = prev[prev.length - 1]
                if (last && last.content.startsWith(popupText.substring(0, 20))) return prev
                return [...prev, { id: Date.now().toString(), role: "assistant", content: popupText }]
            })
            setHasNewMessage(true)
        }
    }, [pathname, botName, onboardingDone, isInitializing])

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

            if (isNamingBot || data.botName) {
                setBotName(data.botName || msgText)
                setIsNamingBot(false)
                setOnboardingDone(true)
            }

            const botMsg: BotMessage = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: data.text,
                suggestions: data.suggestions || []
            }
            setMessages(prev => [...prev, botMsg])

            if (!isOpen) setHasNewMessage(true)
        } catch (err) {
            setMessages(prev => [...prev, {
                id: (Date.now() + 2).toString(),
                role: "assistant",
                content: "❌ Error conectando con el asistente. Intenta de nuevo."
            }])
        } finally {
            setIsLoading(false)
        }
    }

    const copyTemplate = () => {
        navigator.clipboard.writeText(quickQuoteTemplate)
        setCopiedIndex(999)
        setTimeout(() => setCopiedIndex(null), 2000)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    }

    const formatContent = (text: string) => {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong class="text-emerald-300 font-bold">$1</strong>')
            .replace(/\*(.*?)\*/g, '<em class="text-slate-300">$1</em>')
            .replace(/\n/g, '<br/>')
    }

    if (!session?.user) return null

    const displayName = botName || "ATOM"
    const firstLetter = displayName[0].toUpperCase()

    return (
        <>
            {/* Floating Bubble */}
            <motion.button
                onClick={() => { setIsOpen(true); setHasNewMessage(false) }}
                className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl group"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                style={{ display: isOpen ? "none" : "flex" }}
            >
                <div className="absolute inset-0 rounded-full bg-emerald-500 opacity-20 animate-ping" />
                <div className="absolute inset-1 rounded-full bg-gradient-to-br from-cyan-400 via-emerald-500 to-teal-600 shadow-[0_0_30px_rgba(16,185,129,0.6)]" />
                <div className="relative z-10 flex flex-col items-center justify-center">
                    <span className="text-white font-black text-xl">{firstLetter}</span>
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
                        className="fixed bottom-6 right-6 z-50 w-[430px] h-[640px] flex flex-col rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.8)] border border-emerald-500/20"
                        style={{ background: "linear-gradient(135deg, #0a0f1e 0%, #0d1b2a 50%, #050d15 100%)" }}
                    >
                        {/* Header */}
                        <div className="flex items-center gap-3 px-5 py-4 border-b border-emerald-500/10"
                            style={{ background: "linear-gradient(90deg, rgba(16,185,129,0.08) 0%, rgba(6,182,212,0.05) 100%)" }}>
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 to-emerald-600 flex items-center justify-center font-black text-white text-lg shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                                {firstLetter}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-white font-black text-sm tracking-wide truncate">{displayName}</h3>
                                <p className="text-emerald-400 text-[10px] font-mono uppercase tracking-widest flex items-center gap-1.5 truncate">
                                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shrink-0" />
                                    Asistente Personal ATOMIC
                                </p>
                            </div>

                            {/* Quick Actions Header Buttons */}
                            {pathname === "/dashboard/quotes" && (
                                <button
                                    onClick={copyTemplate}
                                    className="px-3 py-1.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono font-bold rounded-xl hover:bg-emerald-500/30 transition-all flex items-center gap-1.5"
                                    title="Copiar formato de cotización rápida"
                                >
                                    {copiedIndex === 999 ? <Check size={12} /> : <FileText size={12} />}
                                    <span>{copiedIndex === 999 ? "¡Copiado!" : "Cotización Rápida"}</span>
                                </button>
                            )}

                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-8 h-8 rounded-xl bg-slate-800/60 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all shrink-0"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-700">
                            {isInitializing ? (
                                <div className="flex items-center justify-center h-full">
                                    <Loader2 className="text-emerald-400 animate-spin" size={32} />
                                </div>
                            ) : (
                                <>
                                    {messages.map(msg => (
                                        <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                            {msg.role === "assistant" && (
                                                <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-cyan-400 to-emerald-600 flex items-center justify-center font-black text-white text-xs mr-2 mt-0.5 shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.4)]">
                                                    {firstLetter}
                                                </div>
                                            )}
                                            <div className={`max-w-[85%] ${msg.role === "user" ? "order-1" : ""}`}>
                                                <div
                                                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                                                        msg.role === "user"
                                                            ? "bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-br-sm shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                                                            : "bg-slate-800/80 text-slate-100 rounded-bl-sm border border-slate-700/50"
                                                    }`}
                                                    dangerouslySetInnerHTML={{ __html: formatContent(msg.content) }}
                                                />
                                                {msg.role === "assistant" && msg.suggestions && msg.suggestions.length > 0 && (
                                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                                        {msg.suggestions.map((s, i) => (
                                                            <button
                                                                key={i}
                                                                onClick={() => sendMessage(s)}
                                                                className="px-3 py-1.5 bg-slate-900/80 border border-emerald-500/30 text-emerald-300 rounded-xl text-[10px] font-bold hover:bg-emerald-500/10 hover:border-emerald-400 transition-all text-left"
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
                                            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-cyan-400 to-emerald-600 flex items-center justify-center font-black text-white text-xs mr-2 shrink-0">
                                                {firstLetter}
                                            </div>
                                            <div className="bg-slate-800/80 border border-slate-700/50 px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1 items-center">
                                                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="px-4 pb-4 pt-3 border-t border-emerald-500/10"
                            style={{ background: "rgba(5,13,21,0.9)" }}>
                            {isNamingBot && (
                                <p className="text-[10px] text-emerald-400/70 font-mono text-center mb-2">
                                    ✨ Escribe el nombre que quieres darme
                                </p>
                            )}
                            <div className="flex items-end gap-2">
                                <textarea
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder={isNamingBot ? "Ej: NEXUS, ARIA, MAX, ATLAS..." : `Mensaje a ${displayName}...`}
                                    rows={1}
                                    className="flex-1 bg-slate-800/60 border border-slate-700/50 text-white text-sm placeholder:text-slate-500 rounded-2xl px-4 py-3 outline-none resize-none focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/20 transition-all"
                                    style={{ maxHeight: "100px" }}
                                    onInput={(e: any) => {
                                        e.target.style.height = "auto"
                                        e.target.style.height = Math.min(e.target.scrollHeight, 100) + "px"
                                    }}
                                />
                                <button
                                    onClick={() => sendMessage()}
                                    disabled={!input.trim() || isLoading}
                                    className="w-11 h-11 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:scale-105 disabled:opacity-40 disabled:scale-100 transition-all shrink-0"
                                >
                                    {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
