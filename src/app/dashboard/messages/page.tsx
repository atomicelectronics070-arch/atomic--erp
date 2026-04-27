"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Send, Inbox, UploadCloud, AlertCircle, CheckCircle2, 
    Clock, Mail, MailOpen, Users, RefreshCw, MessageSquarePlus,
    Target, Zap, ShieldCheck, ArrowRight, LayoutGrid, X
} from "lucide-react"

type Message = {
    id: string
    subject: string
    type: string
    content: string
    status: string
    isRead: boolean
    createdAt: string
    sender?: { name: string; role: string }
    receiver?: { name: string; role: string }
}

type User = {
    id: string
    name: string
    email: string
    role: string
    status: string
}

export default function MessagesPage() {
    const { data: session } = useSession()
    const [activeTab, setActiveTab] = useState<"inbox" | "outbox" | "compose">("inbox")
    const [messages, setMessages] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [users, setUsers] = useState<User[]>([])
    const [usersLoading, setUsersLoading] = useState(false)
    const [usersError, setUsersError] = useState("")

    // Compose Form
    const [composeData, setComposeData] = useState({
        receiverIds: [] as string[],
        subject: "",
        type: "Mensaje Simple",
        content: "",
    })
    const [isSending, setIsSending] = useState(false)
    const [feedback, setFeedback] = useState({ text: "", type: "" })

    const fetchUsers = useCallback(async () => {
        setUsersLoading(true)
        setUsersError("")
        try {
            const res = await fetch("/api/admin/users")
            if (res.ok) {
                const data = await res.json()
                const others = (data.users as User[]).filter(
                    (u) => u.id !== (session?.user as any)?.id
                )
                setUsers(others)
            } else {
                setUsersError("NODE_AUTH_FAILURE: No se pudo cargar la lista de usuarios.")
            }
        } catch (error) {
            setUsersError("CON_ERROR: Error de red al cargar usuarios.")
        } finally {
            setUsersLoading(false)
        }
    }, [session?.user])

    const fetchMessages = async (type: "inbox" | "outbox") => {
        setIsLoading(true)
        try {
            const res = await fetch(`/api/messages?type=${type}`)
            if (res.ok) {
                const data = await res.json()
                setMessages(data.messages || [])
            }
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (session) {
            fetchUsers()
            fetchMessages("inbox")
        }
    }, [session])

    useEffect(() => {
        if (activeTab === "inbox") fetchMessages("inbox")
        if (activeTab === "outbox") fetchMessages("outbox")
    }, [activeTab])

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault()
        if (composeData.receiverIds.length === 0 || !composeData.subject || !composeData.content) {
            setFeedback({ text: "ASIGNACIÓN_FALLIDA: Completa todos los Etiquetaes requeridos.", type: "error" })
            return
        }
        setIsSending(true)
        setFeedback({ text: "", type: "" })
        try {
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(composeData),
            })
            if (res.ok) {
                setFeedback({ text: "NUCLEO_SYNC: Mensajes emitidos con éxito.", type: "success" })
                setComposeData({ receiverIds: [], subject: "", type: "Mensaje Simple", content: "" })
                fetchMessages("outbox")
                setTimeout(() => setActiveTab("outbox"), 1500)
            } else {
                const err = await res.json()
                setFeedback({ text: err.error || "PROTOCOLO_ERROR: Fallo en la emisión.", type: "error" })
            }
        } catch (error) {
            setFeedback({ text: "NETWORK_DROP: Error de conexión.", type: "error" })
        } finally {
            setIsSending(false)
        }
    }

    const handleStatusUpdate = async (msgId: string, newStatus: string, markRead: boolean = false) => {
        try {
            const res = await fetch(`/api/messages/${msgId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus, isRead: markRead }),
            })
            if (res.ok) {
                setMessages(
                    messages.map((m) =>
                        m.id === msgId
                            ? { ...m, status: newStatus, isRead: markRead ? true : m.isRead }
                            : m
                    )
                )
            }
        } catch (error) {
            console.error(error)
        }
    }

    const getTypeColor = (type: string) => {
        switch (type) {
            case "URGENTE": return "bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]"
            case "Notificacion": return "bg-azure-500 text-slate-950 shadow-[0_0_15px_rgba(45,212,191,0.4)]"
            case "Tarea": return "bg-primary text-white shadow-[0_0_15px_rgba(255,99,71,0.4)]"
            default: return "bg-slate-800 text-slate-200"
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Completado": return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_10px_rgba(52,211,153,0.2)]"
            case "En proceso": return "text-secondary bg-secondary/10 border-secondary/20 shadow-[0_0_10px_rgba(255,99,71,0.2)]"
            default: return "text-slate-500 bg-slate-900 border-white/5"
        }
    }

    const getRoleLabel = (role: string) => {
        const labels: Record<string, string> = {
            ADMIN: "ADMIN",
            SALESPERSON: "VENDEDOR",
            COORDINATOR: "COORDINADOR",
            MANAGER: "GERENTE",
            EDITOR: "EDITOR",
        }
        return labels[role] || role
    }

    const unreadCount = messages.filter((m) => !m.isRead).length

    return (
        <div className="space-y-12 pb-32 animate-in fade-in duration-1000 relative">
            {/* Background Orbs */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[10%] right-[-10%] w-[45%] h-[45%] rounded-none bg-secondary/5 blur-[120px]" />
                <div className="absolute bottom-[20%] left-[-10%] w-[35%] h-[35%] rounded-none bg-azure-500/5 blur-[100px]" />
            </div>

            {/* Header */}
            <header className="flex flex-col lg:flex-row lg:items-end justify-between border-b border-white/5 pb-16 relative z-10 gap-10">
                <div>
                     <div className="flex items-center space-x-4 mb-4 text-secondary">
                        <Mail size={20} className="drop-shadow-[0_0_8px_rgba(255,99,71,0.5)]" />
                        <span className="text-[10px] uppercase font-black tracking-[0.6em] italic">Communications Hub v4.0</span>
                    </div>
                    <h1 className="text-6xl font-black text-white uppercase tracking-tighter leading-none italic">
                        MENSAJERÍA <span className="text-secondary underline decoration-secondary/30 underline-offset-8">INTERNA</span>
                    </h1>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.3em] mt-5 max-w-xl italic leading-relaxed">
                        Despliegue de comunicados oficiales, asignaciones tácticas y coordinación de alto rendimiento entre departamentos.
                    </p>
                </div>

                <div className="flex items-center gap-6">
                    <button
                        onClick={() => setActiveTab("compose")}
                        className="bg-secondary text-white px-12 py-5 font-black uppercase tracking-[0.3em] text-[10px] flex items-center shadow-[0_20px_50px_-10px_rgba(255,99,71,0.5)] transition-all hover:bg-white hover:text-secondary rounded-none active:scale-95 group italic skew-x-[-12deg]"
                    >
                         <div className="skew-x-[12deg] flex items-center gap-4">
                            <MessageSquarePlus size={20} className="group-hover:rotate-12 transition-transform" />
                            <span>Redactar</span>
                        </div>
                    </button>
                </div>
            </header>

            <div className="flex flex-col lg:flex-row gap-12 relative z-10 min-h-[700px]">
                {/* Sidebar Navigation */}
                <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0">
                    <div className="glass-panel !bg-slate-950/40 p-4 rounded-none-[2.5rem] border-white/5 shadow-2xl backdrop-blur-3xl space-y-2">
                        <button
                            onClick={() => setActiveTab("inbox")}
                            className={`flex items-center justify-between p-6 w-full text-left transition-all rounded-none border-white/5 group ${activeTab === "inbox"
                                ? "bg-white/[0.03] border-white/10 text-secondary shadow-inner"
                                : "text-slate-500 hover:text-white"
                                }`}
                        >
                            <span className="flex items-center space-x-4">
                                <Inbox size={20} className={activeTab === "inbox" ? "text-secondary" : "text-slate-700"} />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">Bandeja Entrada</span>
                            </span>
                            {unreadCount > 0 && (
                                <span className="bg-secondary text-white text-[9px] font-black px-2.5 py-1 rounded-none shadow-[0_0_15px_rgba(255,99,71,0.5)] animate-pulse">
                                    {unreadCount}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab("outbox")}
                            className={`flex items-center space-x-4 p-6 w-full text-left transition-all rounded-none border-white/5 group ${activeTab === "outbox"
                                ? "bg-white/[0.03] border-white/10 text-secondary shadow-inner"
                                : "text-slate-500 hover:text-white"
                                }`}
                        >
                            <UploadCloud size={20} className={activeTab === "outbox" ? "text-secondary" : "text-slate-700"} />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">Comunicados Enviados</span>
                        </button>
                    </div>

                    <div className="glass-panel !bg-slate-950/40 p-8 rounded-none-[2.5rem] border-white/5 shadow-2xl backdrop-blur-3xl flex-1 max-h-[500px] overflow-hidden flex flex-col relative">
                        <div className="absolute top-0 right-0 p-6 opacity-5 text-secondary pointer-events-none -rotate-12"><Users size={80} /></div>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-8 flex items-center justify-between shrink-0 italic border-b border-white/5 pb-4">
                            <span className="flex items-center gap-3"><Users size={14} className="text-secondary" /> Equipo Conectado</span>
                            <button onClick={fetchUsers} className="hover:text-secondary transition-colors"><RefreshCw size={12} /></button>
                        </p>
                        <div className="space-y-3 overflow-y-auto custom-scrollbar flex-1 pr-2">
                            {usersLoading ? (
                                <div className="flex justify-center py-10 opacity-20"><RefreshCw className="animate-spin" /></div>
                            ) : users.map((u) => (
                                <button
                                    key={u.id}
                                    onClick={() => {
                                        setComposeData((prev) => ({
                                            ...prev,
                                            receiverIds: prev.receiverIds.includes(u.id) ? prev.receiverIds : [...prev.receiverIds, u.id]
                                        }))
                                        setActiveTab("compose")
                                    }}
                                    className="w-full text-left p-4 hover:bg-white/[0.03] border border-transparent hover:border-white/5 rounded-none transition-all flex items-center gap-4 group/user"
                                >
                                    <div className="w-10 h-10 rounded-none bg-slate-950 border border-white/5 text-secondary font-black text-[12px] flex items-center justify-center shrink-0 uppercase italic shadow-inner group-hover/user:scale-110 transition-transform">
                                        {(u.name?.[0] || u.email?.[0] || "?")}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="font-black text-white text-[11px] truncate uppercase italic tracking-tighter group-hover/user:text-secondary transition-colors">{u.name || (u.email.split('@')[0])}</div>
                                        <div className="text-[8px] text-slate-600 uppercase font-black tracking-widest">{getRoleLabel(u.role)}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 glass-panel !bg-slate-950/40 rounded-none-[3.5rem] border-white/5 shadow-2xl backdrop-blur-3xl overflow-hidden relative flex flex-col">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-azure-500/5 blur-[100px] -mr-32 -mt-32 rounded-none"></div>
                    
                    <div className="flex-1 overflow-y-auto p-12 custom-scrollbar relative z-10">
                        {/* COMPOSE VIEW */}
                        <AnimatePresence mode="wait">
                            {activeTab === "compose" && (
                                <motion.div 
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="max-w-3xl mx-auto space-y-12"
                                >
                                    <div className="flex items-center gap-6 border-b border-white/5 pb-10">
                                        <div className="p-4 bg-secondary/10 border border-secondary/20 text-secondary rounded-none shadow-inner">
                                            <MessageSquarePlus size={28} />
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-black uppercase tracking-tighter text-white italic">REDACTAR <span className="text-secondary">COMUNICADO</span></h2>
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-2 italic">Etiqueta de emisión de información estratégica</p>
                                        </div>
                                    </div>

                                    {feedback.text && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className={`p-6 rounded-none border flex items-center gap-6 italic tracking-widest font-black uppercase text-[10px] ${feedback.type === "success"
                                                ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400 shadow-[0_0_30px_rgba(52,211,153,0.1)]"
                                                : "bg-red-500/5 border-red-500/20 text-red-400 shadow-[0_0_30px_rgba(239,68,68,0.1)]"
                                                }`}
                                        >
                                            {feedback.type === "success" ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                                            <span>{feedback.text}</span>
                                        </motion.div>
                                    )}

                                    <form onSubmit={handleSend} className="space-y-10">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                            {/* Destinatario */}
                                            <div className="space-y-4">
                                                <label className="text-[10px] uppercase font-black tracking-[0.4em] text-slate-500 ml-2 italic flex items-center gap-3">
                                                    <Target size={14} className="text-secondary" /> Etiqueta Destino
                                                </label>
                                                <div className="space-y-3">
                                                    <div className="w-full bg-slate-950 border border-white/5 p-3 min-h-[64px] flex flex-wrap gap-3 items-center rounded-none-[2rem] shadow-inner">
                                                        {composeData.receiverIds.map(id => {
                                                            const user = users.find(u => u.id === id)
                                                            if (!user) return null
                                                            return (
                                                                <div key={id} className="bg-secondary/10 border border-secondary/30 text-secondary text-[9px] font-black px-4 py-2 flex items-center gap-3 rounded-none uppercase italic shadow-2xl">
                                                                    <span>{user.name || (user.email.split('@')[0])}</span>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setComposeData(prev => ({ ...prev, receiverIds: prev.receiverIds.filter(userId => userId !== id) }))}
                                                                        className="text-secondary/60 hover:text-white transition-colors"
                                                                    >
                                                                        <X size={14} />
                                                                    </button>
                                                                </div>
                                                            )
                                                        })}
                                                        <select
                                                            value=""
                                                            onChange={(e) => {
                                                                const val = e.target.value;
                                                                if (val && !composeData.receiverIds.includes(val)) {
                                                                    setComposeData(prev => ({ ...prev, receiverIds: [...prev.receiverIds, val] }))
                                                                }
                                                            }}
                                                            className="flex-1 min-w-[200px] bg-transparent border-none text-xs font-black uppercase tracking-widest text-white outline-none px-4 py-2 italic cursor-pointer italic"
                                                        >
                                                            <option value="" className="bg-slate-950">SELECCIONE ElementoS...</option>
                                                            {users.filter(u => !composeData.receiverIds.includes(u.id)).map((u) => (
                                                                <option key={u.id} value={u.id} className="bg-slate-950">
                                                                    {u.name || u.email} [{getRoleLabel(u.role)}]
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <p className="text-[9px] text-slate-700 italic uppercase font-black tracking-widest ml-4">* Despliegue multi-Etiqueta habilitado.</p>
                                                </div>
                                            </div>

                                            {/* Clasificación */}
                                            <div className="space-y-4">
                                                <label className="text-[10px] uppercase font-black tracking-[0.4em] text-slate-500 ml-2 italic flex items-center gap-3">
                                                    <Zap size={14} className="text-azure-400" /> Clasificación
                                                </label>
                                                <select
                                                    value={composeData.type}
                                                    onChange={(e) =>
                                                        setComposeData({ ...composeData, type: e.target.value })
                                                    }
                                                    className="w-full bg-slate-950 border border-white/5 p-6 text-xs font-black uppercase tracking-widest text-azure-400 outline-none rounded-none-[2rem] focus:border-azure-500 transition-all shadow-inner italic appearance-none"
                                                    required
                                                >
                                                    <option value="Mensaje Simple">Mensaje Simple</option>
                                                    <option value="Notificacion">Notificación</option>
                                                    <option value="Tarea">Asignación de Tarea</option>
                                                    <option value="URGENTE">🔥 Prioridad Crítica</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Asunto */}
                                        <div className="space-y-4">
                                            <label className="text-[10px] uppercase font-black tracking-[0.4em] text-slate-500 ml-2 italic">Asunto del Comunicado</label>
                                            <input
                                                type="text"
                                                value={composeData.subject}
                                                onChange={(e) =>
                                                    setComposeData({ ...composeData, subject: e.target.value.toUpperCase() })
                                                }
                                                className="w-full bg-slate-950 border border-white/5 p-6 text-sm font-black uppercase tracking-widest text-white outline-none rounded-none-[2rem] focus:border-secondary transition-all shadow-inner placeholder:text-slate-900 italic"
                                                required
                                                placeholder="EJ: REVISIÓN DE MÉTRICAS SEMANALES_S14"
                                            />
                                        </div>

                                        {/* Mensaje */}
                                        <div className="space-y-4">
                                            <label className="text-[10px] uppercase font-black tracking-[0.4em] text-slate-500 ml-2 italic">Metadata del Mensaje</label>
                                            <textarea
                                                value={composeData.content}
                                                onChange={(e) =>
                                                    setComposeData({ ...composeData, content: e.target.value.toUpperCase() })
                                                }
                                                rows={8}
                                                className="w-full bg-slate-950 border border-white/5 p-8 text-sm font-bold text-slate-400 outline-none rounded-none-[3rem] focus:border-secondary transition-all shadow-inner resize-none uppercase tracking-widest leading-relaxed placeholder:text-slate-900 italic custom-scrollbar"
                                                required
                                                placeholder="DESCRIBA LOS DETALLES TÁCTICOS AQUÍ..."
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSending || users.length === 0 || usersLoading}
                                            className="w-full bg-secondary text-white p-8 font-black uppercase tracking-[0.5em] text-[11px] flex items-center justify-center gap-6 shadow-[0_25px_60px_-10px_rgba(255,99,71,0.6)] transition-all hover:bg-white hover:text-secondary rounded-none-[3rem] active:scale-95 disabled:opacity-20 italic skew-x-[-8deg] group"
                                        >
                                            <div className="skew-x-[8deg] flex items-center gap-4">
                                                <Send size={24} className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
                                                <span>{isSending ? "EMITIENDO..." : "EMITIR COMUNICADO"}</span>
                                            </div>
                                        </button>
                                    </form>
                                </motion.div>
                            )}

                            {/* INBOX & OUTBOX VIEW */}
                            {(activeTab === "inbox" || activeTab === "outbox") && (
                                <motion.div 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="h-full"
                                >
                                    {isLoading ? (
                                        <div className="flex flex-col items-center justify-center py-40 gap-8 animate-pulse">
                                            <div className="w-20 h-20 border-4 border-secondary/10 border-t-secondary rounded-none animate-spin shadow-2xl" />
                                            <p className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-700 italic">Extrayendo Archivo de Mensajes...</p>
                                        </div>
                                    ) : messages.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-40 gap-8 text-slate-800 italic uppercase font-black text-xs">
                                            <div className="w-32 h-32 bg-slate-950 border border-white/5 rounded-none-[3rem] flex items-center justify-center shadow-inner opacity-20">
                                                <Inbox size={60} />
                                            </div>
                                            <p className="tracking-[0.8em]">Cámara de Mensajes Vacía</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-8 animate-in fade-in duration-700">
                                            {messages.map((msg) => (
                                                <motion.div
                                                    layout
                                                    key={msg.id}
                                                    className={`glass-panel border-white/5 p-10 rounded-none-[3rem] transition-all group relative overflow-hidden ${!msg.isRead && activeTab === "inbox" ? "bg-white/[0.04] shadow-[0_0_50px_rgba(255,99,71,0.05)] border-secondary/20" : "bg-slate-950/20 hover:bg-white/[0.02]"}`}
                                                >
                                                     <div 
                                                        className="absolute left-0 top-0 w-1.5 h-full opacity-40 group-hover:opacity-100 transition-opacity" 
                                                        style={{ backgroundColor: msg.type === 'URGENTE' ? '#ef4444' : msg.type === 'Notificacion' ? '#2dd4bf' : '#ff6347' }}
                                                    />

                                                    <div className="flex flex-col xl:flex-row gap-10 justify-between relative z-10">
                                                        <div className="flex-1 space-y-6">
                                                            <div className="flex flex-wrap items-center gap-6">
                                                                <span
                                                                    className={`text-[9px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-none italic border border-white/5 ${getTypeColor(msg.type)}`}
                                                                >
                                                                    {msg.type}
                                                                </span>
                                                                <h3 className={`text-2xl tracking-tighter uppercase italic ${!msg.isRead && activeTab === "inbox" ? "font-black text-white" : "font-black text-slate-400 group-hover:text-white"} transition-colors`}>{msg.subject}</h3>
                                                            </div>

                                                            <div className="flex flex-wrap items-center gap-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] italic">
                                                                {activeTab === "inbox" ? (
                                                                    <div className="flex items-center gap-3">
                                                                        <span className="text-slate-700">ORIGEN:</span>
                                                                        <span className="text-secondary">{msg.sender?.name || "SYS_NODE"}</span>
                                                                        {msg.sender?.role && <span className="px-3 py-1 bg-slate-900 border border-white/5 rounded-none text-[8px] text-slate-400 tracking-widest">{getRoleLabel(msg.sender.role)}</span>}
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex items-center gap-3">
                                                                        <span className="text-slate-700">DESTINO:</span>
                                                                        <span className="text-secondary">{msg.receiver?.name || "SYS_NODE"}</span>
                                                                        {msg.receiver?.role && <span className="px-3 py-1 bg-slate-900 border border-white/5 rounded-none text-[8px] text-slate-400 tracking-widest">{getRoleLabel(msg.receiver.role)}</span>}
                                                                    </div>
                                                                )}
                                                                <div className="flex items-center gap-3">
                                                                    <Clock size={14} className="text-slate-700" />
                                                                    <span>{new Date(msg.createdAt).toLocaleDateString("es-EC")} {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                                                                </div>
                                                            </div>

                                                            <div className="text-[11px] text-slate-400 bg-slate-950/80 p-8 rounded-none-[2.5rem] border border-white/5 whitespace-pre-wrap italic font-bold leading-relaxed uppercase tracking-widest shadow-inner group-hover:text-slate-300 transition-colors">
                                                                {msg.content}
                                                            </div>
                                                        </div>

                                                        <div className="xl:w-80 flex flex-col justify-between shrink-0 border-t xl:border-t-0 xl:border-l border-white/5 pt-10 xl:pt-0 xl:pl-10 space-y-8">
                                                            <div className="space-y-6">
                                                                <p className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-700 mb-4 italic">Metadata de Estado</p>

                                                                {activeTab === "inbox" ? (
                                                                    <div className="space-y-4">
                                                                        <select
                                                                            value={msg.status}
                                                                            onChange={(e) =>
                                                                                handleStatusUpdate(msg.id, e.target.value, true)
                                                                            }
                                                                            className={`w-full text-[10px] font-black uppercase tracking-[0.4em] border px-6 py-4 rounded-none outline-none transition-all italic shadow-inner bg-slate-950 ${getStatusColor(msg.status)}`}
                                                                        >
                                                                            <option value="Recibido" className="bg-slate-950">RECIBIDO</option>
                                                                            <option value="En proceso" className="bg-slate-950">PROCESANDO</option>
                                                                            <option value="Completado" className="bg-slate-950">COMPLETADO</option>
                                                                        </select>

                                                                        {!msg.isRead && (
                                                                            <button
                                                                                onClick={() =>
                                                                                    handleStatusUpdate(msg.id, msg.status, true)
                                                                                }
                                                                                className="w-full flex items-center justify-center gap-4 bg-secondary text-white py-4 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-secondary transition-all rounded-none shadow-2xl italic group/read"
                                                                            >
                                                                                <MailOpen size={16} className="group-hover/read:scale-110 transition-transform" />
                                                                                <span>Marcar Leído</span>
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                ) : (
                                                                    <div className="space-y-4">
                                                                        <div
                                                                            className={`text-[10px] font-black uppercase tracking-[0.4em] px-6 py-4 text-center border rounded-none italic ${getStatusColor(msg.status)}`}
                                                                        >
                                                                            {msg.status.toUpperCase()}
                                                                        </div>
                                                                        <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest justify-center italic">
                                                                            {msg.isRead ? (
                                                                                <><CheckCircle2 size={16} className="text-emerald-500 shadow-[0_0_10px_rgba(52,211,153,0.3)]" /><span className="text-emerald-500">Elemento Visualizado</span></>
                                                                            ) : (
                                                                                <><Clock size={16} className="text-secondary animate-pulse" /><span className="text-secondary">En Cola de Lectura</span></>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Bottom Status Bar */}
                    <div className="h-14 bg-slate-950/80 border-t border-white/5 flex items-center justify-between px-10 relative z-10">
                        <div className="flex items-center gap-6">
                            <div className="w-2 h-2 rounded-none bg-emerald-500 animate-pulse" />
                            <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] italic leading-none">Canal de Enlace Directo Activo</span>
                        </div>
                        <div className="flex items-center gap-6 text-slate-800 font-black italic uppercase text-[8px] tracking-[0.5em]">
                            <ShieldCheck size={14} /> SECURITY:_ROOT_SYNC
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


