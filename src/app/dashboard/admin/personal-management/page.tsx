"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { 
    Users, Key, Shield, UserPlus, Eye, EyeOff, CheckCircle2, XCircle, 
    Sparkles, RefreshCw, Layers, Cpu, Search, Bot, MessageSquare, Send, X, Box
} from "lucide-react"

interface SystemUser {
    id: string
    name: string | null
    lastName: string | null
    email: string
    role: string
    status: string
    area: string | null
    createdAt: string
    isActive: boolean
    plainPassword?: string
    personalBot?: {
        botName: string | null
        onboardingDone: boolean
        updatedAt: string
    }
}

interface AdminBotOverview {
    id: string
    userId: string
    botName: string | null
    onboardingDone: boolean
    updatedAt: string
    user: {
        name: string | null
        lastName: string | null
        role: string
        area: string | null
        email: string
    }
    messages: {
        id: string
        role: string
        content: string
        createdAt: string
    }[]
}

export default function PersonalManagementPage() {
    const { data: session } = useSession()
    const [users, setUsers] = useState<SystemUser[]>([])
    const [botOverviews, setBotOverviews] = useState<AdminBotOverview[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({})
    const [search, setSearch] = useState("")
    const [roleFilter, setRoleFilter] = useState("ALL")
    const [activeTab, setActiveTab] = useState<"users" | "org" | "ai_network">("org")

    // Admin direct chat modal with profile bot
    const [selectedBotUser, setSelectedBotUser] = useState<SystemUser | null>(null)
    const [adminChatMessage, setAdminChatMessage] = useState("")
    const [adminChatHistory, setAdminChatHistory] = useState<{ role: string; content: string }[]>([])
    const [isSendingAdminMsg, setIsSendingAdminMsg] = useState(false)

    // Create User Modal
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [newUser, setNewUser] = useState({
        name: "",
        lastName: "",
        email: "",
        password: "",
        role: "SALESPERSON",
        area: "Ventas"
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setIsLoading(true)
        try {
            const [uRes, bRes] = await Promise.all([
                fetch("/api/admin/manage-users"),
                fetch("/api/admin/personal-bot")
            ])
            const uData = await uRes.json()
            const bData = await bRes.json()
            
            if (uData.users) setUsers(uData.users)
            if (bData.bots) setBotOverviews(bData.bots)
        } catch (e) {
            console.error("Error fetching admin data", e)
        } finally {
            setIsLoading(false)
        }
    }

    const togglePassword = (id: string) => {
        setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }))
    }

    const openAdminBotChat = (user: SystemUser) => {
        setSelectedBotUser(user)
        const overview = botOverviews.find(b => b.userId === user.id)
        if (overview && overview.messages.length > 0) {
            setAdminChatHistory(overview.messages.map(m => ({ role: m.role, content: m.content })).reverse())
        } else {
            setAdminChatHistory([
                {
                    role: "assistant",
                    content: `👋 **Hola Administrador**. Aún no existe una sesión activa con un colaborador físico en esta cuenta de **${user.name} (${user.role})**.\n\n🤖 Como Inteligencia Artificial asignada a este perfil, me encuentro **actuando como trabajador interino**. Puedes darme instrucciones directas (ej: metas de leads, tareas del mes) y las guardaré para ejecutarlas y reportarlas cuando ingrese un colaborador.`
                }
            ])
        }
    }

    const sendAdminMessage = async () => {
        if (!adminChatMessage.trim() || !selectedBotUser || isSendingAdminMsg) return
        const text = adminChatMessage.trim()
        setAdminChatHistory(prev => [...prev, { role: "user", content: text }])
        setAdminChatMessage("")
        setIsSendingAdminMsg(true)

        try {
            const res = await fetch("/api/personal-bot", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: `[INSTRUCCIÓN ADMINISTRATIVA]: ${text}`,
                    currentPath: "/dashboard/admin/personal-management"
                })
            })
            const data = await res.json()
            setAdminChatHistory(prev => [...prev, { role: "assistant", content: data.text }])
        } catch {
            setAdminChatHistory(prev => [...prev, { role: "assistant", content: "❌ Error procesando instrucción." }])
        } finally {
            setIsSendingAdminMsg(false)
        }
    }

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError("")

        try {
            const res = await fetch("/api/admin/manage-users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newUser)
            })
            const data = await res.json()

            if (!res.ok) {
                setError(data.error || "Error al crear usuario")
            } else {
                setIsCreateOpen(false)
                setNewUser({ name: "", lastName: "", email: "", password: "", role: "SALESPERSON", area: "Ventas" })
                fetchData()
            }
        } catch {
            setError("Error de servidor")
        } finally {
            setIsSubmitting(false)
        }
    }

    const filteredUsers = users.filter(u => {
        const full = `${u.name || ""} ${u.lastName || ""} ${u.email} ${u.area || ""}`.toLowerCase()
        const matchesSearch = full.includes(search.toLowerCase())
        const matchesRole = roleFilter === "ALL" || u.role === roleFilter
        return matchesSearch && matchesRole
    })

    if (session?.user?.role !== "ADMIN") {
        return (
            <div className="p-12 text-center text-rose-400 font-mono">
                🚫 Acceso restringido. Módulo reservado para la Administración Central de ATOMIC.
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#050914] text-white p-8 space-y-8">
            
            {/* Header */}
            <div className="bg-slate-900/90 border border-slate-800 p-8 rounded-3xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 shadow-2xl relative overflow-hidden">
                <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
                
                <div>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                            <Users size={24} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight text-white">Gestión de Personal & Mapa 3D de Bots</h1>
                            <p className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest mt-1">
                                Control Maestro • Mapa Conceptual 3D • Diálogo Directo con Perfiles
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={fetchData} 
                        className="p-3 bg-slate-800 hover:bg-slate-700 rounded-2xl border border-slate-700 text-slate-300 transition-all"
                        title="Recargar datos"
                    >
                        <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
                    </button>
                    <button 
                        onClick={() => setIsCreateOpen(true)}
                        className="px-6 py-3.5 bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 text-slate-950 font-black text-xs uppercase tracking-widest rounded-2xl shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:scale-105 transition-all flex items-center gap-2"
                    >
                        <UserPlus size={16} /> Crear Cuenta
                    </button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-3 border-b border-slate-800 pb-4">
                <button
                    onClick={() => setActiveTab("org")}
                    className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 ${
                        activeTab === "org" 
                            ? "bg-purple-500/15 border border-purple-500/40 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.2)]" 
                            : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                    }`}
                >
                    <Box size={16} /> Mapa Conceptual 3D & Tarjetas de Perfil
                </button>
                <button
                    onClick={() => setActiveTab("users")}
                    className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 ${
                        activeTab === "users" 
                            ? "bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]" 
                            : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                    }`}
                >
                    <Key size={16} /> Matriz de Usuarios & Claves ({users.length})
                </button>
                <button
                    onClick={() => setActiveTab("ai_network")}
                    className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 ${
                        activeTab === "ai_network" 
                            ? "bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]" 
                            : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                    }`}
                >
                    <Cpu size={16} /> Red de Bots & Actividad ({botOverviews.length})
                </button>
            </div>

            {/* TAB: MAPA CONCEPTUAL 3D CON CONEXIÓN DIRECTA */}
            {activeTab === "org" && (
                <div className="space-y-8">
                    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h2 className="text-xl font-black text-white flex items-center gap-2">
                                <Box className="text-purple-400" /> Mapa Conceptual 3D • Jerarquía Corporativa ATOMIC
                            </h2>
                            <p className="text-xs font-mono text-slate-400 mt-1">
                                Haz clic en cualquier tarjeta de perfil para **conversar en vivo con la IA interina del puesto** y darle instrucciones.
                            </p>
                        </div>
                        <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[10px] font-mono font-bold rounded-full">
                            Vista 3D Interactiva
                        </span>
                    </div>

                    {/* 3D Visual Map Container */}
                    <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 relative overflow-hidden shadow-2xl min-h-[500px]">
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

                        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                            {users.map(u => {
                                const botName = u.personalBot?.botName
                                const isFixed = ["atomic@administrador.com", "atomic@techman.com", "atomic@softman.com", "atomic@cordinacion.com", "atomic@media.com"].includes(u.email)
                                const roleColors = u.role === "ADMIN" ? "from-rose-500/20 to-pink-600/20 border-rose-500/40 shadow-[0_10px_30px_rgba(244,63,94,0.2)]" :
                                                   u.role === "MANAGEMENT" ? "from-purple-500/20 to-indigo-600/20 border-purple-500/40 shadow-[0_10px_30px_rgba(168,85,247,0.2)]" :
                                                   u.role === "COORDINATOR" ? "from-amber-500/20 to-orange-600/20 border-amber-500/40 shadow-[0_10px_30px_rgba(245,158,11,0.2)]" :
                                                   "from-emerald-500/20 to-teal-600/20 border-emerald-500/40 shadow-[0_10px_30px_rgba(16,185,129,0.2)]"

                                return (
                                    <div
                                        key={u.id}
                                        onClick={() => openAdminBotChat(u)}
                                        className={`bg-gradient-to-br ${roleColors} border backdrop-blur-xl p-6 rounded-3xl cursor-pointer hover:scale-105 transition-all duration-300 space-y-4 group relative overflow-hidden`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-[9px] font-mono font-bold uppercase px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-slate-300">
                                                {u.area || u.role}
                                            </span>
                                            {isFixed && (
                                                <span className="text-[9px] font-mono font-black text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                                                    CUENTA MATRIZ
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center font-black text-white text-lg shadow-md group-hover:scale-110 transition-transform">
                                                {(u.name?.[0] || u.email[0]).toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="font-black text-white text-base truncate">{u.name} {u.lastName || ""}</h3>
                                                <p className="text-xs font-mono text-slate-400 truncate">{u.email}</p>
                                            </div>
                                        </div>

                                        <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800/80 space-y-1">
                                            <p className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
                                                <span>Estado del Bot:</span>
                                                <span className="text-emerald-400 font-bold">{botName || "IA Interina Activa"}</span>
                                            </p>
                                            <p className="text-[10px] font-mono text-slate-500">
                                                {botName ? "Colaborador + Bot sincronizados" : "Sin sesión física — IA respondiendo"}
                                            </p>
                                        </div>

                                        <div className="pt-2 flex items-center justify-between text-xs font-mono font-bold text-cyan-400 group-hover:translate-x-1 transition-transform">
                                            <span>Hablar & Asignar Tarea →</span>
                                            <MessageSquare size={14} />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* TAB USERS EXCEL */}
            {activeTab === "users" && (
                <div className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-4 top-3.5 text-slate-500" size={16} />
                            <input 
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Buscar por nombre, email o área..."
                                className="w-full bg-slate-950 border border-slate-800 text-sm font-medium text-white placeholder:text-slate-500 rounded-xl pl-11 pr-4 py-2.5 outline-none focus:border-cyan-500/50 transition-all"
                            />
                        </div>
                    </div>

                    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left font-sans">
                                <thead>
                                    <tr className="bg-slate-950 text-[10px] font-mono uppercase tracking-widest text-slate-400 border-b border-slate-800">
                                        <th className="px-6 py-4">Usuario</th>
                                        <th className="px-6 py-4">Email Matriz</th>
                                        <th className="px-6 py-4">Contraseña</th>
                                        <th className="px-6 py-4">Rol & Área</th>
                                        <th className="px-6 py-4">Bot Personal</th>
                                        <th className="px-6 py-4 text-right">Acción</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/60 text-sm">
                                    {filteredUsers.map(user => (
                                        <tr key={user.id} className="hover:bg-slate-800/40 transition-colors">
                                            <td className="px-6 py-4 font-bold text-white">{user.name} {user.lastName}</td>
                                            <td className="px-6 py-4 font-mono text-xs text-slate-300">{user.email}</td>
                                            <td className="px-6 py-4 font-mono text-xs text-emerald-400">
                                                {showPasswords[user.id] ? user.plainPassword : "••••••••••••"}
                                                <button onClick={() => togglePassword(user.id)} className="ml-2 text-slate-500">
                                                    {showPasswords[user.id] ? <EyeOff size={12} /> : <Eye size={12} />}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-xs font-mono">{user.role} - {user.area}</td>
                                            <td className="px-6 py-4 text-xs font-mono text-emerald-300">{user.personalBot?.botName || "Sin bot"}</td>
                                            <td className="px-6 py-4 text-right">
                                                <button 
                                                    onClick={() => openAdminBotChat(user)}
                                                    className="px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 rounded-xl text-xs font-mono font-bold hover:bg-cyan-500/20"
                                                >
                                                    Hablar con IA
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB AI NETWORK */}
            {activeTab === "ai_network" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {botOverviews.map(b => (
                        <div key={b.id} className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
                            <h3 className="font-black text-white">{b.botName || "Bot Sin Nombre"} ({b.user.name})</h3>
                            <div className="space-y-2 bg-slate-950 p-4 rounded-2xl border border-slate-800 max-h-48 overflow-y-auto">
                                {b.messages.map(m => (
                                    <p key={m.id} className="text-xs text-slate-300">
                                        <strong className="text-cyan-400">{m.role}:</strong> {m.content}
                                    </p>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* MODAL: ADMIN CHAT DIRECTO CON BOT DE PERFIL */}
            {selectedBotUser && (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl h-[620px] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 to-emerald-600 flex items-center justify-center font-black text-white text-lg">
                                    {(selectedBotUser.name?.[0] || "U").toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="font-black text-white text-sm">
                                        Asistente IA de: {selectedBotUser.name} ({selectedBotUser.role})
                                    </h3>
                                    <p className="text-[10px] font-mono text-cyan-400">
                                        {selectedBotUser.personalBot?.botName ? `Bot Asignado: ${selectedBotUser.personalBot.botName}` : "Sin colaborador físico — Modos de Instrucciones de Tareas"}
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedBotUser(null)} className="text-slate-500 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-950/50">
                            {adminChatHistory.map((m, i) => (
                                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-xs leading-relaxed ${
                                        m.role === 'user' ? 'bg-cyan-600 text-white rounded-br-sm' : 'bg-slate-800 text-slate-100 rounded-bl-sm border border-slate-700'
                                    }`}>
                                        <p className="whitespace-pre-wrap">{m.content}</p>
                                    </div>
                                </div>
                            ))}
                            {isSendingAdminMsg && (
                                <div className="flex justify-start">
                                    <div className="bg-slate-800 text-slate-400 px-4 py-2 rounded-2xl text-xs flex items-center gap-2">
                                        <Loader2 size={14} className="animate-spin text-cyan-400" /> Procesando instrucción de administración...
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-4 border-t border-slate-800 bg-slate-950 flex gap-2">
                            <input 
                                type="text"
                                value={adminChatMessage}
                                onChange={e => setAdminChatMessage(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && sendAdminMessage()}
                                placeholder="Escribe instrucciones para este puesto (ej: Conseguir 30 leads este mes)..."
                                className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white outline-none focus:border-cyan-500"
                            />
                            <button 
                                onClick={sendAdminMessage}
                                disabled={isSendingAdminMsg || !adminChatMessage.trim()}
                                className="px-5 py-3 bg-cyan-500 text-slate-950 font-black rounded-2xl text-xs uppercase tracking-wider hover:bg-cyan-400 disabled:opacity-50"
                            >
                                <Send size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
