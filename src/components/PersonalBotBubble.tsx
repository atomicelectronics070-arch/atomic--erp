"use client"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
    X, Send, Sparkles, Loader2, Copy, Check, FileText, 
    ShoppingBag, Users, Map, Smartphone, DollarSign, Palette, 
    FileSpreadsheet, Bot, GraduationCap, ArrowRight, Table,
    Settings, Sliders, CalendarCheck, ShieldAlert, Globe, Monitor,
    Building2, MessageSquare, Plus, CheckCircle2
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

export interface FloatingShortcut {
    id: string
    label: string
    shortLabel: string
    icon: string
    path: string
    gradient: string
    border: string
    description: string
}

export const ALL_AVAILABLE_SHORTCUTS: FloatingShortcut[] = [
    {
        id: "landings",
        label: "Landings ATOMIC 2026",
        shortLabel: "Landings",
        icon: "🌐",
        path: "/bienvenida/categoria",
        gradient: "from-cyan-500 to-blue-600",
        border: "border-cyan-400/50",
        description: "Catálogo de 11+ landings de bienvenida por categoría"
    },
    {
        id: "ruta_dia",
        label: "Ruta del Día",
        shortLabel: "Ruta Día",
        icon: "📋",
        path: "/dashboard/ruta-del-dia",
        gradient: "from-emerald-500 to-teal-600",
        border: "border-emerald-400/50",
        description: "Checklist de 7 actividades, catálogo y metas"
    },
    {
        id: "suicide_squad",
        label: "Suicide Squad War Room",
        shortLabel: "Squad",
        icon: "💀",
        path: "/dashboard/suicide-squad",
        gradient: "from-rose-500 to-pink-600",
        border: "border-rose-400/50",
        description: "5 escuadras virales, speeches de venta y simulador"
    },
    {
        id: "quotes",
        label: "Cotizaciones PROP",
        shortLabel: "Cotizar",
        icon: "📄",
        path: "/dashboard/quotes",
        gradient: "from-amber-500 to-orange-600",
        border: "border-amber-400/50",
        description: "Generador de cotizaciones formales PDF y Excel"
    },
    {
        id: "anydesk",
        label: "AnyDesk PC en Vivo",
        shortLabel: "AnyDesk",
        icon: "🖥️",
        path: "/dashboard/anydesk",
        gradient: "from-red-500 to-rose-700",
        border: "border-red-400/50",
        description: "Conexión y transmisión en vivo de pantalla de PC"
    },
    {
        id: "suppliers",
        label: "Gestor de Proveedores",
        shortLabel: "Proveed.",
        icon: "🏢",
        path: "/dashboard/suppliers",
        gradient: "from-purple-500 to-indigo-600",
        border: "border-purple-400/50",
        description: "Marcas, distribuidores, importadores y scraping"
    },
    {
        id: "scripts",
        label: "Marketplace de Scripts",
        shortLabel: "Scripts",
        icon: "💬",
        path: "/dashboard/sales-copy",
        gradient: "from-blue-500 to-cyan-500",
        border: "border-blue-400/50",
        description: "Mensajes para copiar y pegar para ventas rápidas"
    },
    {
        id: "tienda",
        label: "Catálogo & Tienda Web",
        shortLabel: "Tienda",
        icon: "🛒",
        path: "/web",
        gradient: "from-teal-500 to-emerald-600",
        border: "border-teal-400/50",
        description: "Catálogo público para clientes con PVP e IVA"
    },
    {
        id: "crm",
        label: "WhatsApp CRM",
        shortLabel: "CRM",
        icon: "📱",
        path: "/dashboard/whatsapp/crm",
        gradient: "from-emerald-600 to-green-500",
        border: "border-emerald-400/50",
        description: "Panel de mensajes, chats con clientes y seguimiento"
    },
    {
        id: "map_radar",
        label: "Radar de Prospección",
        shortLabel: "Radar",
        icon: "📍",
        path: "/dashboard/map-prospecting",
        gradient: "from-amber-600 to-yellow-500",
        border: "border-amber-400/50",
        description: "Búsqueda geográfica de comercios en Google Maps"
    }
]

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
    const [isInitializing, setIsInitializing] = useState(true)
    const [hasNewMessage, setHasNewMessage] = useState(false)
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // ── CONFIGURABLE FLOATING SHORTCUTS (UP TO 4 BUTTONS ABOVE BOT) ──
    const [activeShortcutIds, setActiveShortcutIds] = useState<string[]>(["landings", "ruta_dia", "suicide_squad", "quotes"])
    const [isConfigShortcutsOpen, setIsConfigShortcutsOpen] = useState(false)
    const [tempSelectedShortcuts, setTempSelectedShortcuts] = useState<string[]>([])

    // Load active shortcuts from localStorage
    useEffect(() => {
        try {
            const saved = localStorage.getItem("atomic_floating_shortcuts")
            if (saved) {
                const parsed = JSON.parse(saved)
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setActiveShortcutIds(parsed.slice(0, 4))
                }
            }
        } catch (e) {}
    }, [])

    const handleOpenShortcutConfig = (e: React.MouseEvent) => {
        e.stopPropagation()
        setTempSelectedShortcuts([...activeShortcutIds])
        setIsConfigShortcutsOpen(true)
    }

    const toggleShortcutSelection = (id: string) => {
        if (tempSelectedShortcuts.includes(id)) {
            setTempSelectedShortcuts(prev => prev.filter(item => item !== id))
        } else {
            if (tempSelectedShortcuts.length >= 4) {
                alert("Puedes seleccionar un máximo de 4 atajos flotantes.")
                return
            }
            setTempSelectedShortcuts(prev => [...prev, id])
        }
    }

    const handleSaveShortcuts = () => {
        if (tempSelectedShortcuts.length === 0) {
            alert("Debes seleccionar al menos 1 atajo flotante.")
            return
        }
        setActiveShortcutIds(tempSelectedShortcuts)
        try {
            localStorage.setItem("atomic_floating_shortcuts", JSON.stringify(tempSelectedShortcuts))
        } catch (e) {}
        setIsConfigShortcutsOpen(false)
    }

    // Load memory on mount
    useEffect(() => {
        if (!session?.user) {
            setMessages([{
                id: "welcome-guest",
                role: "assistant",
                content: `👋 ¡Hola! Soy el asistente de **ATOMIC Industries**.\n\nPuedo ayudarte a registrarte en el sistema diciendo:\n*"Quiero registrarme como vendedor"*\n\nO si eres asesor con código de trabajador, escribe:\n*"Ayúdame a generar una cotización"* (Código \`1111\`).\n\n¿En qué te puedo ayudar hoy?`,
                suggestions: ["Quiero registrarme como vendedor", "Quiero registrarme como técnico", "Ayúdame a generar un contrato"]
            }])
            setIsInitializing(false)
            return
        }

        fetch("/api/personal-bot/memory")
            .then(r => r.json())
            .then(data => {
                const memory = data.memory
                if (memory) {
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
                            content: `👋 ¡Hola **${session.user.name?.split(" ")[0] || "Asesor"}**! Soy el **Guía de ATOMIC**.\n\nTengo acceso a todos los módulos: Cotizaciones \`PROP\`, Inventario, Coordinación, Radar de Prospección y más.\n\n✨ Haz clic en cualquier botón del **menú inferior** o escribe tu duda para aprender a usar ATOMIC.`,
                        }])
                    }
                } else {
                    setMessages([{
                        id: "welcome",
                        role: "assistant",
                        content: `👋 ¡Hola **${session.user.name?.split(" ")[0] || "Asesor"}**! Soy el **Guía de ATOMIC**.\n\nTengo acceso a todos los módulos: Cotizaciones \`PROP\`, Inventario, Coordinación, Radar de Prospección y más.\n\n✨ Haz clic en cualquier botón del **menú inferior** o escribe tu duda para aprender a usar ATOMIC.`,
                    }])
                }
            })
            .catch(() => {
                setMessages([{
                    id: "welcome",
                    role: "assistant",
                    content: `👋 ¡Hola **${session.user.name?.split(" ")[0] || "Asesor"}**! Soy el **Guía de ATOMIC**.\n\n¿Qué módulo o herramienta del ERP deseas aprender a usar hoy?`,
                }])
            })
            .finally(() => setIsInitializing(false))
    }, [session])

    // Contextual pop notification on route change
    useEffect(() => {
        if (isInitializing) return

        let popupText = ""
        if (pathname === "/dashboard") {
            popupText = `📍 **Estás en el Dashboard Principal**: Visualiza el estado operativo de ATOMIC, accesos rápidos y actividad de tu equipo.`
        } else if (pathname === "/dashboard/quotes") {
            popupText = `📍 **Estás en Cotizaciones**: Emite propuestas formales en PDF \`PROP-XXXX\` o usa el generador unificado.`
        } else if (pathname === "/dashboard/shop") {
            popupText = `📍 **Estás en Inventario**: Consulta el catálogo de más de 9,700 artículos, precios y proveedores.`
        } else if (pathname === "/dashboard/coordinacion") {
            popupText = `📍 **Estás en Coordinación**: Gestiona asesores comerciales, contratos laborales y bitácoras de seguimiento.`
        } else if (pathname === "/dashboard/profile") {
            popupText = `📍 **Estás en tu Perfil**: Puedes actualizar tus datos y alternar entre los **Temas Globales** (Blanco Ejecutivo con Tomate activado).`
        }

        if (popupText) {
            setMessages(prev => {
                const last = prev[prev.length - 1]
                if (last && last.content.startsWith(popupText.substring(0, 25))) return prev
                return [...prev, { id: Date.now().toString(), role: "assistant", content: popupText }]
            })
        }
    }, [pathname, isInitializing])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages, isOpen])

    const sendMessage = async (customText?: string) => {
        const textToSend = customText || input
        if (!textToSend.trim() || isLoading) return

        const userMsg: BotMessage = {
            id: Date.now().toString(),
            role: "user",
            content: textToSend.trim(),
        }

        const newMessages = [...messages, userMsg]
        setMessages(newMessages)
        if (!customText) setInput("")
        setIsLoading(true)

        try {
            let guestSenderId = "guest-web"
            if (typeof window !== "undefined") {
                guestSenderId = localStorage.getItem("atomic_guest_sender_id") || ""
                if (!guestSenderId) {
                    guestSenderId = "guest-" + Math.random().toString(36).substring(2, 9)
                    localStorage.setItem("atomic_guest_sender_id", guestSenderId)
                }
            }

            const res = await fetch("/api/personal-bot", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: textToSend.trim(),
                    messages: newMessages.map(m => ({ role: m.role, content: m.content })),
                    senderId: session?.user?.id || guestSenderId,
                    currentPath: pathname,
                })
            })

            const data = await res.json()
            const replyMsg = data.reply || data.text
            if (replyMsg) {
                const assistantMsg: BotMessage = {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    content: replyMsg,
                    suggestions: data.suggestions,
                }
                setMessages(prev => [...prev, assistantMsg])
                if (!isOpen) setHasNewMessage(true)
            }
        } catch (err) {
            console.error(err)
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: "Lo siento, tuve un problema de conexión al consultar las directivas del sistema. Intenta de nuevo.",
            }])
        } finally {
            setIsLoading(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
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

    const displayName = session?.user?.name ? "Guía de ATOMIC" : "Asistente ATOMIC"

    const activeShortcuts = ALL_AVAILABLE_SHORTCUTS.filter(s => activeShortcutIds.includes(s.id))

    return (
        <>
            {/* ═══════════════════════════════════════════════════════════════════════════
                STACK VERTICAL DE ATAJOS FLOTANTES + BOTÓN GUÍA (ABOVE DOCK ON MOBILE)
            ═══════════════════════════════════════════════════════════════════════════ */}
            <div 
                className="fixed bottom-28 lg:bottom-8 right-4 sm:right-6 z-40 flex flex-col-reverse items-center gap-2.5 pointer-events-none"
                style={{ display: isOpen ? "none" : "flex" }}
            >
                {/* 1. BOTÓN PRINCIPAL GUÍA DE ATOMIC */}
                <motion.button
                    onClick={() => { setIsOpen(true); setHasNewMessage(false) }}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-[0_0_35px_rgba(6,182,212,0.55)] group cursor-pointer border-2 border-cyan-400/50 pointer-events-auto relative"
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    title="Abrir Guía de ATOMIC"
                >
                    <div className="absolute inset-0 rounded-full bg-cyan-500 opacity-25 animate-ping" />
                    <div className="absolute inset-1 rounded-full bg-gradient-to-br from-cyan-400 via-indigo-600 to-teal-500 shadow-[0_0_30px_rgba(6,182,212,0.6)]" />
                    <div className="relative z-10 flex flex-col items-center justify-center text-white">
                        <Bot size={26} className="drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] group-hover:scale-110 transition-transform" />
                        <span className="text-[8px] font-mono font-black uppercase tracking-tighter text-cyan-200 -mt-0.5">GUÍA</span>
                        {hasNewMessage && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full border-2 border-slate-950 animate-bounce" />
                        )}
                    </div>
                </motion.button>

                {/* 2. LOS HASTA 4 BOTONES DE ACCESO RÁPIDO CONFIGURADOS */}
                <div className="flex flex-col-reverse items-center gap-2 pointer-events-auto">
                    {activeShortcuts.map((shortcut, idx) => (
                        <motion.button
                            key={shortcut.id}
                            onClick={() => router.push(shortcut.path)}
                            whileHover={{ scale: 1.12, x: -3 }}
                            whileTap={{ scale: 0.92 }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr ${shortcut.gradient} border ${shortcut.border} shadow-lg shadow-black/60 flex flex-col items-center justify-center text-white cursor-pointer group relative`}
                            title={shortcut.label}
                        >
                            <span className="text-base sm:text-lg leading-none">{shortcut.icon}</span>
                            <span className="text-[7.5px] font-mono font-black uppercase tracking-tight text-white/90 drop-shadow mt-0.5">
                                {shortcut.shortLabel}
                            </span>
                            
                            {/* Hover Tooltip */}
                            <span className="absolute right-full mr-2.5 px-2.5 py-1 rounded-xl bg-slate-950/95 border border-slate-800 text-white text-[10px] font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
                                {shortcut.label}
                            </span>
                        </motion.button>
                    ))}

                    {/* 3. BOTÓN PARA CONFIGURAR ATAJOS (GEAR MINI ICON) */}
                    <motion.button
                        onClick={handleOpenShortcutConfig}
                        whileHover={{ scale: 1.15, rotate: 45 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-7 h-7 rounded-full bg-slate-950/90 border border-slate-700/80 hover:border-cyan-400 text-slate-400 hover:text-cyan-300 flex items-center justify-center cursor-pointer shadow-md transition-colors"
                        title="Configurar Atajos Flotantes (Hasta 4)"
                    >
                        <Settings size={13} />
                    </motion.button>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════════════════
                MODAL DE CONFIGURACIÓN DE ATAJOS FLOTANTES
            ═══════════════════════════════════════════════════════════════════════════ */}
            <AnimatePresence>
                {isConfigShortcutsOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="w-full max-w-lg bg-[#070b18] border-2 border-cyan-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                                        <Sliders size={18} />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-white text-base">
                                            Configurar Atajos Flotantes
                                        </h3>
                                        <p className="text-[11px] font-mono text-slate-400">
                                            Selecciona hasta 4 botones de acceso rápido sobre el Guía
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsConfigShortcutsOpen(false)}
                                    className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Selector grid */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs font-mono">
                                    <span className="text-slate-400">Seleccionados:</span>
                                    <span className={`font-bold ${tempSelectedShortcuts.length === 4 ? "text-cyan-400" : "text-emerald-400"}`}>
                                        {tempSelectedShortcuts.length} / 4 activos
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {ALL_AVAILABLE_SHORTCUTS.map((s) => {
                                        const isSelected = tempSelectedShortcuts.includes(s.id)
                                        return (
                                            <div
                                                key={s.id}
                                                onClick={() => toggleShortcutSelection(s.id)}
                                                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 select-none ${
                                                    isSelected
                                                        ? "bg-cyan-950/40 border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                                                        : "bg-slate-950 border-slate-800 hover:border-slate-700"
                                                }`}
                                            >
                                                <div className="flex items-center gap-2.5 min-w-0">
                                                    <span className="text-xl shrink-0">{s.icon}</span>
                                                    <div className="min-w-0">
                                                        <h4 className="text-xs font-bold text-white truncate">{s.label}</h4>
                                                        <p className="text-[10px] text-slate-400 truncate font-mono">{s.description}</p>
                                                    </div>
                                                </div>

                                                <div className="shrink-0">
                                                    {isSelected ? (
                                                        <CheckCircle2 size={18} className="text-cyan-400" />
                                                    ) : (
                                                        <div className="w-4 h-4 rounded-full border border-slate-700" />
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2.5 pt-3 border-t border-slate-800">
                                <button
                                    onClick={() => setIsConfigShortcutsOpen(false)}
                                    className="flex-1 py-2.5 rounded-2xl bg-slate-900 text-slate-400 hover:text-white font-mono text-xs font-bold transition-colors cursor-pointer"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSaveShortcuts}
                                    className="flex-1 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black font-mono text-xs hover:scale-102 transition-all cursor-pointer shadow-lg shadow-cyan-500/30"
                                >
                                    Guardar Atajos ({tempSelectedShortcuts.length})
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ═══════════════════════════════════════════════════════════════════════════
                VENTANA PRINCIPAL DEL CHAT GUÍA
            ═══════════════════════════════════════════════════════════════════════════ */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20, transformOrigin: "bottom right" }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                        className="fixed bottom-24 lg:bottom-10 right-4 sm:right-6 z-50 w-[92vw] sm:w-[440px] h-[78vh] sm:h-[640px] flex flex-col rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.9)] border border-cyan-500/30"
                        style={{ background: "linear-gradient(145deg, #090e1a 0%, #0d1527 50%, #060a12 100%)" }}
                    >
                        {/* Header */}
                        <div className="flex items-center gap-3 px-5 py-4 border-b border-cyan-500/20 bg-slate-950/70 backdrop-blur-md">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                                <Bot size={22} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-white font-black text-sm tracking-wide truncate">Guía de ATOMIC</h3>
                                    <span className="px-1.5 py-0.5 rounded-full bg-cyan-400/15 text-cyan-300 text-[9px] font-mono font-bold">Tutorial</span>
                                </div>
                                <p className="text-cyan-400 text-[10px] font-mono uppercase tracking-widest flex items-center gap-1.5 truncate">
                                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shrink-0" />
                                    Estoy para enseñarte el sistema
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
                                                    <Bot size={13} />
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
                                                <Bot size={13} />
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
