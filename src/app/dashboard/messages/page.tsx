"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { Send, Inbox, UploadCloud, AlertCircle, CheckCircle2, Clock, Mail, MailOpen, Users, RefreshCw, MessageSquarePlus } from "lucide-react"

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

    // Fetch users (all approved users excluding self) — called once on mount
    const fetchUsers = useCallback(async () => {
        setUsersLoading(true)
        setUsersError("")
        try {
            const res = await fetch("/api/admin/users")
            if (res.ok) {
                const data = await res.json()
                // Exclude current user from the list
                const others = (data.users as User[]).filter(
                    (u) => u.id !== (session?.user as any)?.id
                )
                setUsers(others)
            } else {
                setUsersError("No se pudo cargar la lista de usuarios.")
            }
        } catch (error) {
            console.error("fetchUsers error:", error)
            setUsersError("Error de red al cargar usuarios.")
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
            console.error("fetchMessages error:", error)
        } finally {
            setIsLoading(false)
        }
    }

    // Load users on mount (so the dropdown is ready when user clicks "Redactar")
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
            setFeedback({ text: "Selecciona al menos un destinatario y completa el asunto y mensaje.", type: "error" })
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
                setFeedback({ text: "Mensaje(s) enviado(s) con éxito.", type: "success" })
                setComposeData({ receiverIds: [], subject: "", type: "Mensaje Simple", content: "" })
                fetchMessages("outbox")
                setTimeout(() => setActiveTab("outbox"), 1500)
            } else {
                const err = await res.json()
                setFeedback({ text: err.error || "Error al enviar el mensaje.", type: "error" })
            }
        } catch (error) {
            setFeedback({ text: "Error de red.", type: "error" })
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
            console.error("handleStatusUpdate error:", error)
        }
    }

    const getTypeColor = (type: string) => {
        switch (type) {
            case "URGENTE": return "bg-red-600 text-white"
            case "Notificacion": return "bg-blue-600 text-white"
            case "Tarea": return "bg-purple-600 text-white"
            default: return "bg-neutral-800 text-white"
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Completado": return "text-green-600 bg-green-50"
            case "En proceso": return "text-orange-600 bg-orange-50"
            default: return "text-neutral-500 bg-neutral-100"
        }
    }

    const getRoleLabel = (role: string) => {
        const labels: Record<string, string> = {
            ADMIN: "Admin",
            SALESPERSON: "Vendedor",
            COORDINATOR: "Coordinador",
            MANAGER: "Gerente",
            EDITOR: "Editor",
        }
        return labels[role] || role
    }

    const unreadCount = messages.filter((m) => !m.isRead).length

    return (
        <div className="space-y-8 pb-24 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-neutral-900 uppercase">
                        Mensajería <span className="text-orange-600">Interna</span>
                    </h1>
                    <p className="text-neutral-400 font-medium text-sm mt-1">
                        Comunicación oficial departamental. &nbsp;
                        {users.length > 0 && (
                            <span className="text-neutral-500">
                                <Users size={12} className="inline mr-1" />
                                {users.length} usuarios disponibles
                            </span>
                        )}
                    </p>
                </div>
                <button
                    onClick={() => setActiveTab("compose")}
                    className="bg-orange-600 text-white px-6 py-3 font-bold uppercase tracking-widest text-[10px] flex items-center space-x-2 transition-all hover:bg-neutral-900 shadow-lg shadow-orange-600/20"
                >
                    <MessageSquarePlus size={16} />
                    <span>Redactar</span>
                </button>
            </div>

            <div className="bg-white border border-neutral-200 shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[600px]">
                {/* Sidebar Navigation */}
                <div className="w-full md:w-64 bg-neutral-50 border-b md:border-b-0 md:border-r border-neutral-200 p-6 flex flex-col gap-2 shrink-0">
                    <button
                        onClick={() => setActiveTab("inbox")}
                        className={`flex items-center justify-between p-4 w-full text-left transition-colors ${activeTab === "inbox"
                            ? "bg-white border border-neutral-200 text-orange-600 shadow-sm font-bold"
                            : "text-neutral-600 hover:bg-neutral-100 font-medium"
                            }`}
                    >
                        <span className="flex items-center space-x-3">
                            <Inbox size={18} />
                            <span className="text-xs uppercase tracking-widest">Entrada</span>
                        </span>
                        {unreadCount > 0 && activeTab !== "inbox" && (
                            <span className="bg-orange-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                {unreadCount}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab("outbox")}
                        className={`flex items-center space-x-3 p-4 w-full text-left transition-colors ${activeTab === "outbox"
                            ? "bg-white border border-neutral-200 text-orange-600 shadow-sm font-bold"
                            : "text-neutral-600 hover:bg-neutral-100 font-medium"
                            }`}
                    >
                        <UploadCloud size={18} />
                        <span className="text-xs uppercase tracking-widest">Enviados</span>
                    </button>

                    {/* Users list preview in sidebar */}
                    {users.length > 0 && (
                        <div className="mt-6 pt-4 border-t border-neutral-200">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-3 flex items-center justify-between">
                                <span><Users size={12} className="inline mr-1" />Equipo</span>
                                <button
                                    onClick={fetchUsers}
                                    title="Actualizar lista"
                                    className="hover:text-orange-600 transition-colors"
                                >
                                    <RefreshCw size={11} />
                                </button>
                            </p>
                            <div className="space-y-1 max-h-60 overflow-y-auto">
                                {users.map((u) => (
                                    <button
                                        key={u.id}
                                        onClick={() => {
                                            setComposeData((prev) => ({
                                                ...prev,
                                                receiverIds: prev.receiverIds.includes(u.id) ? prev.receiverIds : [...prev.receiverIds, u.id]
                                            }))
                                            setActiveTab("compose")
                                        }}
                                        className="w-full text-left px-3 py-2 text-xs hover:bg-orange-50 hover:text-orange-700 rounded transition-colors flex items-center gap-2"
                                        title={`Enviar mensaje a ${u.name}`}
                                    >
                                        <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 font-bold text-[10px] flex items-center justify-center shrink-0 uppercase">
                                            {(u.name || u.email || "?")[0]}
                                        </span>
                                        <div className="min-w-0">
                                            <div className="font-medium text-neutral-800 truncate">{u.name || u.email}</div>
                                            <div className="text-[10px] text-neutral-400 uppercase tracking-widest">{getRoleLabel(u.role)}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Main Content Area */}
                <div className="flex-1 p-0 md:p-8 bg-white">

                    {/* COMPOSE VIEW */}
                    {activeTab === "compose" && (
                        <div className="max-w-2xl mx-auto p-6 md:p-0">
                            <h2 className="text-xl font-bold uppercase tracking-tight mb-8 flex items-center">
                                <Send className="mr-3 text-orange-600" size={20} /> Nuevo Comunicado
                            </h2>

                            {feedback.text && (
                                <div
                                    className={`mb-6 p-4 flex items-center space-x-3 text-sm font-bold uppercase tracking-widest ${feedback.type === "success"
                                        ? "bg-green-50 text-green-700"
                                        : "bg-red-50 text-red-700"
                                        }`}
                                >
                                    {feedback.type === "success" ? (
                                        <CheckCircle2 size={18} />
                                    ) : (
                                        <AlertCircle size={18} />
                                    )}
                                    <span>{feedback.text}</span>
                                </div>
                            )}

                            <form onSubmit={handleSend} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Destinatario */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 flex items-center gap-2">
                                            <Users size={12} /> Destinatario
                                        </label>
                                        {usersLoading ? (
                                            <div className="w-full bg-neutral-50 border border-neutral-200 p-4 text-sm text-neutral-400 flex items-center gap-2">
                                                <div className="w-4 h-4 border-2 border-orange-200 border-t-orange-600 rounded-full animate-spin" />
                                                Cargando usuarios...
                                            </div>
                                        ) : usersError ? (
                                            <div className="space-y-2">
                                                <div className="w-full bg-red-50 border border-red-200 p-4 text-sm text-red-600 flex items-center gap-2">
                                                    <AlertCircle size={14} />
                                                    {usersError}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={fetchUsers}
                                                    className="text-xs text-orange-600 hover:underline flex items-center gap-1"
                                                >
                                                    <RefreshCw size={12} /> Reintentar
                                                </button>
                                            </div>
                                        ) : users.length === 0 ? (
                                            <div className="w-full bg-neutral-50 border border-neutral-200 p-4 text-sm text-neutral-400">
                                                No hay otros usuarios aprobados disponibles.
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                <div className="w-full bg-neutral-50 border border-neutral-200 p-2 min-h-[56px] flex flex-wrap gap-2 items-center">
                                                    {composeData.receiverIds.map(id => {
                                                        const user = users.find(u => u.id === id)
                                                        if (!user) return null
                                                        return (
                                                            <div key={id} className="bg-white border border-neutral-200 text-xs px-3 py-1.5 flex items-center gap-2 font-medium">
                                                                <span>{user.name || user.email}</span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setComposeData(prev => ({ ...prev, receiverIds: prev.receiverIds.filter(userId => userId !== id) }))}
                                                                    className="text-neutral-400 hover:text-red-500"
                                                                >
                                                                    &times;
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
                                                        className="flex-1 min-w-[150px] bg-transparent border-none text-sm outline-none px-2 py-1"
                                                    >
                                                        <option value="">Añadir destinatario...</option>
                                                        {users.filter(u => !composeData.receiverIds.includes(u.id)).map((u) => (
                                                            <option key={u.id} value={u.id}>
                                                                {u.name || u.email} · {getRoleLabel(u.role)}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <p className="text-[10px] text-neutral-400">* Puedes seleccionar múltiples usuarios.</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Clasificación */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-bold tracking-widest text-neutral-500">
                                            Clasificación
                                        </label>
                                        <select
                                            value={composeData.type}
                                            onChange={(e) =>
                                                setComposeData({ ...composeData, type: e.target.value })
                                            }
                                            className="w-full bg-neutral-50 border border-neutral-200 p-4 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                                            required
                                        >
                                            <option value="Mensaje Simple">Mensaje Simple</option>
                                            <option value="Notificacion">Notificación</option>
                                            <option value="Tarea">Asignación de Tarea</option>
                                            <option value="URGENTE">🔴 Urgente</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Asunto */}
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold tracking-widest text-neutral-500">
                                        Asunto
                                    </label>
                                    <input
                                        type="text"
                                        value={composeData.subject}
                                        onChange={(e) =>
                                            setComposeData({ ...composeData, subject: e.target.value })
                                        }
                                        className="w-full bg-neutral-50 border border-neutral-200 p-4 text-sm font-bold focus:ring-2 focus:ring-orange-500 outline-none"
                                        required
                                        placeholder="Ej: Revisión de métricas semanales"
                                    />
                                </div>

                                {/* Mensaje */}
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold tracking-widest text-neutral-500">
                                        Mensaje
                                    </label>
                                    <textarea
                                        value={composeData.content}
                                        onChange={(e) =>
                                            setComposeData({ ...composeData, content: e.target.value })
                                        }
                                        rows={8}
                                        className="w-full bg-neutral-50 border border-neutral-200 p-4 text-sm focus:ring-2 focus:ring-orange-500 outline-none resize-y"
                                        required
                                        placeholder="Escribe tu mensaje aquí..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSending || users.length === 0 || usersLoading}
                                    className="w-full bg-neutral-900 text-white p-4 font-bold uppercase tracking-widest text-xs hover:bg-orange-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    <Send size={14} />
                                    {isSending ? "Enviando..." : "Emitir Comunicado"}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* INBOX & OUTBOX VIEW */}
                    {(activeTab === "inbox" || activeTab === "outbox") && (
                        <div className="h-full">
                            {isLoading ? (
                                <div className="flex justify-center items-center h-48">
                                    <div className="w-8 h-8 border-2 border-orange-200 border-t-orange-600 rounded-full animate-spin" />
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center p-20 text-neutral-400">
                                    <Mail size={48} className="mb-4 text-neutral-200" />
                                    <p className="text-xs font-bold uppercase tracking-widest">Bandeja Vacía</p>
                                    {activeTab === "inbox" && (
                                        <p className="text-xs text-neutral-300 mt-2">No tienes mensajes recibidos.</p>
                                    )}
                                </div>
                            ) : (
                                <div className="divide-y divide-neutral-100">
                                    {messages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={`p-6 transition-colors hover:bg-neutral-50 ${!msg.isRead && activeTab === "inbox" ? "bg-orange-50/30" : ""}`}
                                        >
                                            <div className="flex flex-col xl:flex-row gap-6 justify-between">
                                                <div className="flex-1 space-y-3">
                                                    <div className="flex items-center space-x-3">
                                                        <span
                                                            className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 ${getTypeColor(msg.type)}`}
                                                        >
                                                            {msg.type}
                                                        </span>
                                                        <h3
                                                            className={`text-lg tracking-tight ${!msg.isRead && activeTab === "inbox"
                                                                ? "font-bold text-neutral-900"
                                                                : "font-medium text-neutral-800"
                                                                }`}
                                                        >
                                                            {msg.subject}
                                                        </h3>
                                                    </div>

                                                    <div className="flex items-center space-x-4 text-xs font-bold text-neutral-500 uppercase tracking-widest">
                                                        {activeTab === "inbox" ? (
                                                            <span>
                                                                De:{" "}
                                                                <span className="text-orange-600">
                                                                    {msg.sender?.name || "Desconocido"}
                                                                </span>
                                                                {msg.sender?.role && (
                                                                    <span className="text-neutral-400 normal-case font-normal">
                                                                        {" "}· {getRoleLabel(msg.sender.role)}
                                                                    </span>
                                                                )}
                                                            </span>
                                                        ) : (
                                                            <span>
                                                                Para:{" "}
                                                                <span className="text-orange-600">
                                                                    {msg.receiver?.name || "Desconocido"}
                                                                </span>
                                                                {msg.receiver?.role && (
                                                                    <span className="text-neutral-400 normal-case font-normal">
                                                                        {" "}· {getRoleLabel(msg.receiver.role)}
                                                                    </span>
                                                                )}
                                                            </span>
                                                        )}
                                                        <span>•</span>
                                                        <span>
                                                            {new Date(msg.createdAt).toLocaleDateString("es-CO", {
                                                                day: "2-digit",
                                                                month: "short",
                                                                year: "numeric",
                                                            })}{" "}
                                                            {new Date(msg.createdAt).toLocaleTimeString([], {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            })}
                                                        </span>
                                                    </div>

                                                    <div className="text-sm text-neutral-600 bg-neutral-50 p-4 border-l-4 border-neutral-200 whitespace-pre-wrap mt-4">
                                                        {msg.content}
                                                    </div>
                                                </div>

                                                <div className="xl:w-64 flex flex-col justify-between shrink-0 border-t xl:border-t-0 xl:border-l border-neutral-100 pt-4 xl:pt-0 xl:pl-6 space-y-4">
                                                    <div>
                                                        <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">
                                                            Estado del Mensaje
                                                        </p>

                                                        {activeTab === "inbox" ? (
                                                            <div className="space-y-2">
                                                                <select
                                                                    value={msg.status}
                                                                    onChange={(e) =>
                                                                        handleStatusUpdate(msg.id, e.target.value, true)
                                                                    }
                                                                    className={`w-full text-xs font-bold uppercase tracking-widest border border-neutral-200 p-3 outline-none transition-colors ${getStatusColor(msg.status)}`}
                                                                >
                                                                    <option value="Recibido" className="bg-white text-neutral-900">
                                                                        Recibido
                                                                    </option>
                                                                    <option
                                                                        value="En proceso"
                                                                        className="bg-white text-neutral-900"
                                                                    >
                                                                        En proceso
                                                                    </option>
                                                                    <option
                                                                        value="Completado"
                                                                        className="bg-white text-neutral-900"
                                                                    >
                                                                        Completado
                                                                    </option>
                                                                </select>

                                                                {!msg.isRead && (
                                                                    <button
                                                                        onClick={() =>
                                                                            handleStatusUpdate(msg.id, msg.status, true)
                                                                        }
                                                                        className="w-full flex items-center justify-center space-x-2 bg-orange-600 text-white p-2 text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-900 transition-colors"
                                                                    >
                                                                        <MailOpen size={14} />
                                                                        <span>Marcar como Leído</span>
                                                                    </button>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <div className="space-y-2 mt-2">
                                                                <div
                                                                    className={`text-[10px] font-bold uppercase tracking-widest px-3 py-2 text-center border ${getStatusColor(msg.status)} border-current`}
                                                                >
                                                                    {msg.status}
                                                                </div>
                                                                <div className="flex items-center space-x-2 text-[10px] font-bold text-neutral-500 uppercase tracking-widest justify-center mt-2">
                                                                    {msg.isRead ? (
                                                                        <CheckCircle2 size={14} className="text-green-500" />
                                                                    ) : (
                                                                        <Clock size={14} className="text-orange-500" />
                                                                    )}
                                                                    <span>
                                                                        {msg.isRead ? "Visto por el destinatario" : "No Visto aún"}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
