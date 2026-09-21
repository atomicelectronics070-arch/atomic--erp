"use client"

import React, { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    X, Send, Sparkles, Volume2, VolumeX, History, Bookmark, 
    Bell, CheckSquare, Calculator, Bot, Copy, Check, MessageSquare, 
    FileDown, ExternalLink, Plus, RefreshCw, Trash2, ArrowRight
} from "lucide-react"

interface Bot2Message {
    id: string
    role: "user" | "assistant"
    content: string
    timestamp: number
    isFavorite?: boolean
}

interface Reminder {
    id: string
    text: string
    clientName?: string
    dueDate: string
    completed: boolean
}

interface Task {
    id: string
    title: string
    completed: boolean
}

export default function PersonalSalesBotModal({
    isOpen,
    onClose
}: {
    isOpen: boolean
    onClose: () => void
}) {
    const { data: session } = useSession()
    const userId = session?.user?.id || "guest"
    const userName = session?.user?.name?.split(" ")[0] || "Asesor"

    // Sub-views
    const [activeTab, setActiveTab] = useState<"CHAT" | "HISTORIAL" | "FAVORITOS" | "RECORDATORIOS" | "TAREAS" | "COTIZADOR">("CHAT")

    // TTS Voice & Audio
    const [isVoiceEnabled, setIsVoiceEnabled] = useState(true)
    const [isSpeaking, setIsSpeaking] = useState(false)

    // Chat State
    const [messages, setMessages] = useState<Bot2Message[]>([])
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)
    const [copiedId, setCopiedId] = useState<string | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Reminders & Tasks
    const [reminders, setReminders] = useState<Reminder[]>([])
    const [newReminderText, setNewReminderText] = useState("")
    const [newReminderDate, setNewReminderDate] = useState("")

    const [tasks, setTasks] = useState<Task[]>([
        { id: "1", title: "Publicar 5 productos en Marketplace / Redes", completed: false },
        { id: "2", title: "Prospectar 10 nuevos negocios en Radar", completed: false },
        { id: "3", title: "Emitir 2 cotizaciones formales PROP", completed: false },
        { id: "4", title: "Seguimiento a 3 clientes de ayer en CRM", completed: false },
        { id: "5", title: "Revisar novedades en Coordinación y Bitácora", completed: false },
    ])
    const [newTaskTitle, setNewTaskTitle] = useState("")

    // Quick Quotation Calculator State
    const [budgetInput, setBudgetInput] = useState<number>(250)
    const [cameraCount, setCameraCount] = useState<number>(4)
    const [installationType, setInstallationType] = useState<"HOGAR" | "NEGOCIO" | "INDUSTRIAL">("NEGOCIO")
    const [quoteResult, setQuoteResult] = useState<any | null>(null)

    // Storage Key
    const storageKey = `atomic_bot_personal_${userId}`

    // Load Memory
    useEffect(() => {
        if (!isOpen) return
        try {
            const saved = localStorage.getItem(storageKey)
            if (saved) {
                const parsed = JSON.parse(saved)
                if (parsed.messages?.length) setMessages(parsed.messages)
                if (parsed.reminders?.length) setReminders(parsed.reminders)
                if (parsed.tasks?.length) setTasks(parsed.tasks)
            } else {
                // Initial Welcome
                const welcome: Bot2Message = {
                    id: "welcome-0",
                    role: "assistant",
                    content: `¡Hola **${userName}**! Soy tu **Bot Personal de Ventas** con memoria dedicada.\n\nTe ayudo a calificar prospectos, recomendar kits de CCTV, armar cotizaciones según el presupuesto del cliente y cerrar ventas con técnicas infalibles.\n\n¿Tienes un cliente en línea o necesitas asesoría sobre algún producto?`,
                    timestamp: Date.now()
                }
                setMessages([welcome])
                if (isVoiceEnabled) {
                    speakText(`Hola ${userName}, soy tu bot personal de ventas de ATOMIC. ¿Qué cliente o presupuesto deseas analizar hoy?`)
                }
            }
        } catch (e) {
            console.error("Error reading bot memory:", e)
        }
    }, [isOpen, userId])

    // Save Memory
    const persistData = (newMsgs?: Bot2Message[], newRem?: Reminder[], newTsk?: Task[]) => {
        try {
            const payload = {
                messages: newMsgs || messages,
                reminders: newRem || reminders,
                tasks: newTsk || tasks,
                lastUpdated: Date.now()
            }
            localStorage.setItem(storageKey, JSON.stringify(payload))
        } catch (e) {
            console.error("Error saving bot memory:", e)
        }
    }

    // Speech Synthesis
    const speakText = (text: string) => {
        if (!isVoiceEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) return
        try {
            window.speechSynthesis.cancel()
            const cleanText = text.replace(/[*_#`\[\]]/g, "").substring(0, 280)
            const utterance = new SpeechSynthesisUtterance(cleanText)
            utterance.lang = "es-EC"
            utterance.rate = 1.05
            utterance.pitch = 1.0
            utterance.onstart = () => setIsSpeaking(true)
            utterance.onend = () => setIsSpeaking(false)
            utterance.onerror = () => setIsSpeaking(false)

            // Select Spanish voice if available
            const voices = window.speechSynthesis.getVoices()
            const esVoice = voices.find(v => v.lang.startsWith("es"))
            if (esVoice) utterance.voice = esVoice

            window.speechSynthesis.speak(utterance)
        } catch (e) {
            console.error("TTS error:", e)
        }
    }

    const stopSpeaking = () => {
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
            window.speechSynthesis.cancel()
            setIsSpeaking(false)
        }
    }

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages, activeTab])

    // Send Message Handler
    const handleSend = async (customPrompt?: string) => {
        const text = (customPrompt || input).trim()
        if (!text || loading) return

        const userMsg: Bot2Message = {
            id: `msg-${Date.now()}`,
            role: "user",
            content: text,
            timestamp: Date.now()
        }

        const nextMsgs = [...messages, userMsg]
        setMessages(nextMsgs)
        if (!customPrompt) setInput("")
        setLoading(true)

        try {
            const res = await fetch("/api/personal-bot", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: nextMsgs.slice(-8).map(m => ({ role: m.role, content: m.content })),
                    advisorRole: (session?.user as any)?.role || "SALESPERSON",
                    advisorName: userName,
                    isPersonalSalesBot: true
                })
            })

            const data = await res.json()
            const botReplyText = data.reply || data.text || "Entendido. Según nuestro catálogo ATOMIC podemos armar una solución perfecta para tu cliente."

            const botMsg: Bot2Message = {
                id: `msg-${Date.now() + 1}`,
                role: "assistant",
                content: botReplyText,
                timestamp: Date.now()
            }

            const finalMsgs = [...nextMsgs, botMsg]
            setMessages(finalMsgs)
            persistData(finalMsgs)

            if (isVoiceEnabled) {
                speakText(botReplyText)
            }
        } catch (err) {
            console.error(err)
            const errorMsg: Bot2Message = {
                id: `msg-${Date.now() + 1}`,
                role: "assistant",
                content: "Hubo un corte en la conexión neuronal. Pero aquí estoy para ayudarte a cerrar tu venta.",
                timestamp: Date.now()
            }
            setMessages(prev => [...prev, errorMsg])
        } finally {
            setLoading(false)
        }
    }

    // Toggle Favorite
    const toggleFavorite = (id: string) => {
        const updated = messages.map(m => m.id === id ? { ...m, isFavorite: !m.isFavorite } : m)
        setMessages(updated)
        persistData(updated)
    }

    // Copy Content
    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
    }

    // Reminders
    const handleAddReminder = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newReminderText.trim()) return
        const rem: Reminder = {
            id: `rem-${Date.now()}`,
            text: newReminderText.trim(),
            dueDate: newReminderDate || new Date().toISOString().split("T")[0],
            completed: false
        }
        const updated = [rem, ...reminders]
        setReminders(updated)
        persistData(undefined, updated)
        setNewReminderText("")
        setNewReminderDate("")
    }

    const toggleReminder = (id: string) => {
        const updated = reminders.map(r => r.id === id ? { ...r, completed: !r.completed } : r)
        setReminders(updated)
        persistData(undefined, updated)
    }

    const deleteReminder = (id: string) => {
        const updated = reminders.filter(r => r.id !== id)
        setReminders(updated)
        persistData(undefined, updated)
    }

    // Tasks
    const toggleTask = (id: string) => {
        const updated = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
        setTasks(updated)
        persistData(undefined, undefined, updated)
    }

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newTaskTitle.trim()) return
        const t: Task = { id: `task-${Date.now()}`, title: newTaskTitle.trim(), completed: false }
        const updated = [...tasks, t]
        setTasks(updated)
        persistData(undefined, undefined, updated)
        setNewTaskTitle("")
    }

    // Quick Quote Calculator
    const calculateQuickQuote = () => {
        const baseCamPrice = 32.50
        const dvrPrice = cameraCount <= 4 ? 65.00 : 110.00
        const hddPrice = 45.00
        const cablesPerCam = 12.00
        const psuPrice = 18.00
        const totalEquipment = (cameraCount * baseCamPrice) + dvrPrice + hddPrice + (cameraCount * cablesPerCam) + psuPrice
        const laborPerCam = installationType === "INDUSTRIAL" ? 35.00 : installationType === "NEGOCIO" ? 25.00 : 20.00
        const totalLabor = cameraCount * laborPerCam
        const totalPVP = totalEquipment + totalLabor

        const items = [
            { description: `Cámaras HD 1080p visión nocturna ColorVu (${cameraCount} unidades)`, qty: cameraCount, unitPrice: baseCamPrice, total: cameraCount * baseCamPrice },
            { description: `DVR ${cameraCount <= 4 ? '4 Canales' : '8 Canales'} Penta-Híbrido ATOMIC Smart`, qty: 1, unitPrice: dvrPrice, total: dvrPrice },
            { description: "Disco Duro 1TB Vigilancia 24/7 WD Purple", qty: 1, unitPrice: hddPrice, total: hddPrice },
            { description: `Kits Baluns + Fuentes y Conectores (${cameraCount} puntos)`, qty: cameraCount, unitPrice: cablesPerCam, total: cameraCount * cablesPerCam },
            { description: `Instalación, canalizado y configuración móvil (${installationType})`, qty: cameraCount, unitPrice: laborPerCam, total: totalLabor }
        ]

        setQuoteResult({
            title: `Kit ${cameraCount} Cámaras Seguridad ATOMIC - ${installationType}`,
            cameraCount,
            installationType,
            totalPVP,
            withinBudget: totalPVP <= budgetInput,
            budgetDiff: budgetInput - totalPVP,
            items
        })
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md">
                <motion.div
                    initial={{ opacity: 0, scale: 0.94, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.94, y: 20 }}
                    className="w-full max-w-4xl h-[88vh] bg-slate-900 border border-cyan-500/40 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden relative"
                >
                    {/* Header */}
                    <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 via-cyan-500 to-teal-400 flex items-center justify-center text-white shadow-[0_0_20px_rgba(6,182,212,0.5)]">
                                <Sparkles size={22} className="animate-pulse" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-white font-black text-base tracking-wide">Bot Personal de Ventas</h3>
                                    <span className="px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 font-mono text-[10px] font-bold border border-cyan-400/30">
                                        Cerebro Asesor
                                    </span>
                                </div>
                                <p className="text-xs text-slate-400">
                                    Memoria exclusiva de <strong className="text-cyan-400">{userName}</strong> • Catálogo y Cierres
                                </p>
                            </div>
                        </div>

                        {/* Controls: Audio TTS & Close */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => {
                                    if (isSpeaking) stopSpeaking()
                                    setIsVoiceEnabled(!isVoiceEnabled)
                                }}
                                className={`p-2.5 rounded-2xl border transition-all flex items-center gap-1.5 text-xs font-bold ${
                                    isVoiceEnabled 
                                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.3)]' 
                                        : 'bg-slate-800 text-slate-400 border-slate-700'
                                }`}
                                title={isVoiceEnabled ? "Desactivar voz TTS" : "Activar voz TTS"}
                            >
                                {isVoiceEnabled ? <Volume2 size={16} className={isSpeaking ? "text-cyan-400 animate-bounce" : ""} /> : <VolumeX size={16} />}
                                <span className="hidden sm:inline">{isVoiceEnabled ? "Voz Activa" : "Silencio"}</span>
                            </button>

                            <button
                                onClick={() => {
                                    stopSpeaking()
                                    onClose()
                                }}
                                className="p-2.5 rounded-2xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Navigation Sub-Tabs */}
                    <div className="px-4 py-2 border-b border-slate-800 bg-slate-950/60 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                        {[
                            { id: "CHAT", label: "💬 Nueva Consulta", icon: MessageSquare },
                            { id: "COTIZADOR", label: "📑 Cotizador Rápido", icon: Calculator },
                            { id: "HISTORIAL", label: "📚 Historial", icon: History },
                            { id: "FAVORITOS", label: "⭐ Favoritos", icon: Bookmark },
                            { id: "RECORDATORIOS", label: "⏰ Recordatorios", icon: Bell },
                            { id: "TAREAS", label: "📋 Tareas Diarias", icon: CheckSquare },
                        ].map(tab => {
                            const Icon = tab.icon
                            const isActive = activeTab === tab.id
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                                        isActive
                                            ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                                            : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                                    }`}
                                >
                                    <Icon size={14} />
                                    <span>{tab.label}</span>
                                </button>
                            )
                        })}
                    </div>

                    {/* TAB CONTENT */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950/40">
                        
                        {/* 1. CHAT TAB */}
                        {activeTab === "CHAT" && (
                            <div className="h-full flex flex-col justify-between space-y-4">
                                <div className="flex-1 overflow-y-auto space-y-3.5 pr-2">
                                    {messages.map((m) => (
                                        <div
                                            key={m.id}
                                            className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
                                        >
                                            <div
                                                className={`max-w-[85%] rounded-3xl p-4 text-xs sm:text-sm leading-relaxed ${
                                                    m.role === "user"
                                                        ? "bg-cyan-600 text-white rounded-br-none shadow-[0_5px_20px_rgba(6,182,212,0.25)]"
                                                        : "bg-slate-900 border border-slate-800 text-slate-100 rounded-bl-none shadow-md"
                                                }`}
                                            >
                                                <div className="whitespace-pre-wrap">{m.content}</div>
                                                
                                                {m.role === "assistant" && (
                                                    <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between gap-2 text-[10px] text-slate-400 font-mono">
                                                        <span className="flex items-center gap-1">
                                                            <Sparkles size={11} className="text-cyan-400" /> ATOMIC Brain
                                                        </span>
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => toggleFavorite(m.id)}
                                                                className={`hover:text-amber-400 transition-colors ${m.isFavorite ? "text-amber-400" : ""}`}
                                                                title="Guardar en favoritos"
                                                            >
                                                                <Bookmark size={13} fill={m.isFavorite ? "currentColor" : "none"} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleCopy(m.content, m.id)}
                                                                className="hover:text-white transition-colors"
                                                                title="Copiar texto"
                                                            >
                                                                {copiedId === m.id ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                                                            </button>
                                                            {isVoiceEnabled && (
                                                                <button
                                                                    onClick={() => speakText(m.content)}
                                                                    className="hover:text-cyan-400 transition-colors"
                                                                    title="Escuchar"
                                                                >
                                                                    <Volume2 size={13} />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <span className="text-[9px] text-slate-500 font-mono mt-1 px-1">
                                                {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    ))}
                                    {loading && (
                                        <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono p-3 bg-slate-900/60 rounded-2xl w-fit animate-pulse">
                                            <Sparkles size={14} className="animate-spin" />
                                            <span>El Cerebro Personal está formulando la mejor estrategia...</span>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Quick Prompt Suggestions */}
                                <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2">
                                    {[
                                        "¿Cómo convencer a un cliente con poco presupuesto?",
                                        "Kit recomendado de 4 cámaras para tienda de abarrotes",
                                        "Ventajas de cámaras IP vs Análogas ATOMIC",
                                        "Técnica de cierre con urgencia para hoy"
                                    ].map((prompt, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleSend(prompt)}
                                            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-cyan-950/60 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 text-[10px] font-medium whitespace-nowrap transition-all"
                                        >
                                            {prompt}
                                        </button>
                                    ))}
                                </div>

                                {/* Input */}
                                <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={e => setInput(e.target.value)}
                                        onKeyDown={e => e.key === "Enter" && handleSend()}
                                        placeholder="Pregúntale a tu bot: cliente, presupuesto, kit, objeciones..."
                                        className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white placeholder:text-slate-500 outline-none focus:border-cyan-400 transition-colors"
                                    />
                                    <button
                                        onClick={() => handleSend()}
                                        disabled={!input.trim() || loading}
                                        className="w-12 h-12 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:scale-105 disabled:opacity-40 disabled:scale-100 transition-all shrink-0"
                                    >
                                        <Send size={18} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* 2. COTIZADOR RÁPIDO TAB */}
                        {activeTab === "COTIZADOR" && (
                            <div className="space-y-6">
                                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
                                    <h4 className="font-black text-white text-sm uppercase tracking-wider flex items-center gap-2">
                                        <Calculator className="text-cyan-400" size={18} /> Generador Express de Propuestas por Presupuesto
                                    </h4>
                                    <p className="text-xs text-slate-400">
                                        Ingresa el dinero estimado del cliente y configura la cantidad de cámaras para calcular un kit exacto con margen y WhatsApp prearmado.
                                    </p>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                                        <div>
                                            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Presupuesto Cliente ($ USD)</label>
                                            <input
                                                type="number"
                                                value={budgetInput}
                                                onChange={e => setBudgetInput(Number(e.target.value))}
                                                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 text-white font-bold text-sm outline-none focus:border-cyan-400"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Cantidad de Cámaras</label>
                                            <select
                                                value={cameraCount}
                                                onChange={e => setCameraCount(Number(e.target.value))}
                                                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 text-white font-bold text-sm outline-none focus:border-cyan-400"
                                            >
                                                <option value={2}>2 Cámaras (Kit Básico)</option>
                                                <option value={4}>4 Cámaras (Kit Estándar)</option>
                                                <option value={8}>8 Cámaras (Kit Completo)</option>
                                                <option value={16}>16 Cámaras (Corporativo)</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Tipo de Instalación</label>
                                            <select
                                                value={installationType}
                                                onChange={e => setInstallationType(e.target.value as any)}
                                                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 text-white font-bold text-sm outline-none focus:border-cyan-400"
                                            >
                                                <option value="HOGAR">Residencial / Hogar</option>
                                                <option value="NEGOCIO">Local Comercial / Negocio</option>
                                                <option value="INDUSTRIAL">Bodega / Industrial</option>
                                            </select>
                                        </div>
                                    </div>

                                    <button
                                        onClick={calculateQuickQuote}
                                        className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2"
                                    >
                                        <Sparkles size={16} /> Calcular Propuesta y Desglose
                                    </button>
                                </div>

                                {quoteResult && (
                                    <div className="bg-slate-900 border border-cyan-500/30 rounded-3xl p-5 space-y-4 animate-in fade-in">
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800 pb-3">
                                            <div>
                                                <h4 className="text-white font-bold text-sm">{quoteResult.title}</h4>
                                                <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                                                    quoteResult.withinBudget 
                                                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                                                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                                }`}>
                                                    {quoteResult.withinBudget ? `✔ Dentro de Presupuesto (Sobran $${quoteResult.budgetDiff.toFixed(2)})` : `⚠ Supera presupuesto por $${Math.abs(quoteResult.budgetDiff).toFixed(2)}`}
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-[10px] text-slate-400 uppercase font-mono">PVP Total Sugerido:</span>
                                                <div className="text-2xl font-black text-cyan-400">${quoteResult.totalPVP.toFixed(2)}</div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            {quoteResult.items.map((item: any, i: number) => (
                                                <div key={i} className="flex justify-between items-center text-xs p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/60">
                                                    <span className="text-slate-200">{item.qty}x {item.description}</span>
                                                    <span className="text-cyan-300 font-mono font-bold">${item.total.toFixed(2)}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex flex-wrap gap-2 pt-2">
                                            <a
                                                href={`https://wa.me/?text=${encodeURIComponent(`Hola, te comparto la propuesta especial de ATOMIC para tu proyecto:\n\n*${quoteResult.title}*\nTotal: $${quoteResult.totalPVP.toFixed(2)} (Incluye equipos + instalación + configuración en tu celular).\n\n¿Te agendamos la instalación para esta semana?`)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                                            >
                                                <MessageSquare size={14} /> Compartir por WhatsApp
                                            </a>
                                            <button
                                                onClick={() => {
                                                    alert("Redirigiendo a Cotizador Central con estos ítems cargados...")
                                                    window.location.href = "/dashboard/quotes"
                                                }}
                                                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                                            >
                                                <ExternalLink size={14} /> Pasar a Cotización Oficial
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 3. HISTORIAL TAB */}
                        {activeTab === "HISTORIAL" && (
                            <div className="space-y-3">
                                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                                    <h4 className="text-white font-bold text-xs uppercase tracking-wider">Historial de Consultas</h4>
                                    <button
                                        onClick={() => {
                                            if (confirm("¿Vaciar historial de conversación?")) {
                                                setMessages([])
                                                persistData([])
                                            }
                                        }}
                                        className="text-rose-400 hover:text-rose-300 text-xs flex items-center gap-1"
                                    >
                                        <Trash2 size={13} /> Limpiar Historial
                                    </button>
                                </div>
                                {messages.length === 0 ? (
                                    <p className="text-slate-500 text-xs py-8 text-center">No hay mensajes previos en la memoria.</p>
                                ) : (
                                    messages.map(m => (
                                        <div key={m.id} className="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-xs space-y-1">
                                            <div className="flex justify-between items-center text-[10px] text-slate-400">
                                                <span className="font-bold text-cyan-400">{m.role === "user" ? userName : "Bot Personal"}</span>
                                                <span>{new Date(m.timestamp).toLocaleString()}</span>
                                            </div>
                                            <p className="text-slate-200 line-clamp-2">{m.content}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {/* 4. FAVORITOS TAB */}
                        {activeTab === "FAVORITOS" && (
                            <div className="space-y-3">
                                <h4 className="text-white font-bold text-xs uppercase tracking-wider pb-2 border-b border-slate-800">
                                    Consejos & Respuestas Favoritas
                                </h4>
                                {messages.filter(m => m.isFavorite).length === 0 ? (
                                    <p className="text-slate-500 text-xs py-8 text-center">
                                        No has marcado ningún consejo como favorito aún. Haz clic en la estrella en el chat para guardarlos aquí.
                                    </p>
                                ) : (
                                    messages.filter(m => m.isFavorite).map(m => (
                                        <div key={m.id} className="p-4 bg-slate-900 border border-amber-500/30 rounded-2xl text-xs space-y-2">
                                            <p className="text-slate-200 whitespace-pre-wrap">{m.content}</p>
                                            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                                                <button
                                                    onClick={() => handleCopy(m.content, m.id)}
                                                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold flex items-center gap-1"
                                                >
                                                    {copiedId === m.id ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />} Copiar
                                                </button>
                                                <button
                                                    onClick={() => toggleFavorite(m.id)}
                                                    className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-[10px] font-bold flex items-center gap-1"
                                                >
                                                    Quitar
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {/* 5. RECORDATORIOS TAB */}
                        {activeTab === "RECORDATORIOS" && (
                            <div className="space-y-4">
                                <form onSubmit={handleAddReminder} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                                    <h4 className="text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                                        <Plus size={14} className="text-cyan-400" /> Nuevo Recordatorio de Seguimiento
                                    </h4>
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <input
                                            type="text"
                                            placeholder="Llamar a Cliente X para confirmar instalación..."
                                            value={newReminderText}
                                            onChange={e => setNewReminderText(e.target.value)}
                                            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                                        />
                                        <input
                                            type="date"
                                            value={newReminderDate}
                                            onChange={e => setNewReminderDate(e.target.value)}
                                            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                                        />
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-cyan-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-cyan-400 transition-colors shrink-0"
                                        >
                                            Agregar
                                        </button>
                                    </div>
                                </form>

                                <div className="space-y-2">
                                    {reminders.map(r => (
                                        <div
                                            key={r.id}
                                            className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs transition-all ${
                                                r.completed ? 'bg-slate-950/40 border-slate-800 opacity-60 line-through text-slate-500' : 'bg-slate-900 border-slate-800 text-slate-200'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <input
                                                    type="checkbox"
                                                    checked={r.completed}
                                                    onChange={() => toggleReminder(r.id)}
                                                    className="rounded border-slate-700 bg-slate-950 text-cyan-400"
                                                />
                                                <span>{r.text}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-[10px] text-cyan-400">{r.dueDate}</span>
                                                <button onClick={() => deleteReminder(r.id)} className="text-slate-500 hover:text-rose-400">
                                                    <Trash2 size={13} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {reminders.length === 0 && (
                                        <p className="text-slate-500 text-xs py-6 text-center">No tienes recordatorios pendientes.</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* 6. TAREAS DIARIAS TAB */}
                        {activeTab === "TAREAS" && (
                            <div className="space-y-4">
                                <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
                                    <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3 flex items-center justify-between">
                                        <span>Checklist Diario de Alto Rendimiento</span>
                                        <span className="text-cyan-400 font-mono text-[11px]">
                                            {tasks.filter(t => t.completed).length}/{tasks.length} Completadas
                                        </span>
                                    </h4>
                                    <div className="space-y-2">
                                        {tasks.map(t => (
                                            <div
                                                key={t.id}
                                                onClick={() => toggleTask(t.id)}
                                                className={`p-3 rounded-xl border flex items-center gap-3 text-xs cursor-pointer transition-all ${
                                                    t.completed ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-slate-950 border-slate-800 hover:border-cyan-500/40 text-slate-300'
                                                }`}
                                            >
                                                <div className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all ${
                                                    t.completed ? 'bg-emerald-500 border-emerald-400 text-slate-950' : 'border-slate-700 bg-slate-900'
                                                }`}>
                                                    {t.completed && <Check size={13} strokeWidth={3} />}
                                                </div>
                                                <span className={t.completed ? "line-through opacity-80" : ""}>{t.title}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <form onSubmit={handleAddTask} className="flex gap-2 mt-4 pt-3 border-t border-slate-800">
                                        <input
                                            type="text"
                                            placeholder="Añadir tarea personal..."
                                            value={newTaskTitle}
                                            onChange={e => setNewTaskTitle(e.target.value)}
                                            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                                        />
                                        <button
                                            type="submit"
                                            className="px-3 py-2 rounded-xl bg-slate-800 text-white hover:bg-slate-700 text-xs font-bold"
                                        >
                                            + Tarea
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}

                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}
