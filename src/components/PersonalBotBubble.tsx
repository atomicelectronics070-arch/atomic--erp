"use client"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Send, Sparkles, Loader2, ChevronDown } from "lucide-react"

interface BotMessage {
    id: string
    role: "user" | "assistant"
    content: string
    suggestions?: string[]
}

export default function PersonalBotBubble() {
    const { data: session } = useSession()
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<BotMessage[]>([])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [botName, setBotName] = useState<string | null>(null)
    const [onboardingDone, setOnboardingDone] = useState(false)
    const [isNamingBot, setIsNamingBot] = useState(false)
    const [isInitializing, setIsInitializing] = useState(true)
    const [hasNewMessage, setHasNewMessage] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

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
                    // Load existing messages
                    if (memory.messages?.length > 0) {
                        const loaded: BotMessage[] = memory.messages.map((m: any) => ({
                            id: m.id,
                            role: m.role,
                            content: m.content,
                        }))
                        setMessages(loaded)
                    } else if (!memory.botName) {
                        // First time — ask for name
                        setIsNamingBot(true)
                        setMessages([{
                            id: "welcome",
                            role: "assistant",
                            content: `👋 ¡Hola ${session.user.name?.split(" ")[0] || ""}! Soy tu asistente personal de **ATOMIC Industries**.\n\nTengo acceso a todo tu perfil, tus cotizaciones, tu posición en el ranking y mucho más. Estaré contigo donde estés para guiarte en un camino laboral saludable y con futuro.\n\n✨ **¿Cómo te gustaría llamarme?**\n*(Escribe el nombre que quieras darme — lo recordaré siempre)*`,
                        }])
                    }
                } else {
                    // No memory yet — first time
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

    // Auto scroll
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
                body: JSON.stringify({ message: msgText, isNamingBot })
            })
            const data = await res.json()

            if (isNamingBot) {
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

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    }

    const formatContent = (text: string) => {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong class="text-emerald-300">$1</strong>')
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
                {/* Neon glow rings */}
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
                        className="fixed bottom-6 right-6 z-50 w-[420px] h-[620px] flex flex-col rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.8)] border border-emerald-500/20"
                        style={{ background: "linear-gradient(135deg, #0a0f1e 0%, #0d1b2a 50%, #050d15 100%)" }}
                    >
                        {/* Header */}
                        <div className="flex items-center gap-3 px-5 py-4 border-b border-emerald-500/10"
                            style={{ background: "linear-gradient(90deg, rgba(16,185,129,0.08) 0%, rgba(6,182,212,0.05) 100%)" }}>
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 to-emerald-600 flex items-center justify-center font-black text-white text-lg shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                                {firstLetter}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-white font-black text-sm tracking-wide">{displayName}</h3>
                                <p className="text-emerald-400 text-[10px] font-mono uppercase tracking-widest flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse inline-block" />
                                    Asistente Personal ATOMIC
                                </p>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-8 h-8 rounded-xl bg-slate-800/60 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
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
                                                {/* Suggestion chips */}
                                                {msg.role === "assistant" && msg.suggestions && msg.suggestions.length > 0 && (
                                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                                        {msg.suggestions.map((s, i) => (
                                                            <button
                                                                key={i}
                                                                onClick={() => sendMessage(s)}
                                                                className="px-3 py-1.5 bg-slate-900/80 border border-emerald-500/30 text-emerald-300 rounded-xl text-[10px] font-bold hover:bg-emerald-500/10 hover:border-emerald-400 transition-all"
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
