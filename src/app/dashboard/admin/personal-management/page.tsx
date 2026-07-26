"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { 
    Users, Key, Shield, UserPlus, Eye, EyeOff, CheckCircle2, XCircle, 
    Sparkles, RefreshCw, Layers, Cpu, Code, Share2, Award, Search, Filter, MessageSquare
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
    salesRanking?: {
        points: number
        quotesCount: number
        salesCount: number
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
    const [activeTab, setActiveTab] = useState<"users" | "org" | "ai_network">("users")

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
        } catch (err) {
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
            
            {/* Header Cyberpunk */}
            <div className="bg-slate-900/90 border border-slate-800 p-8 rounded-3xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 shadow-2xl relative overflow-hidden">
                <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
                
                <div>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                            <Users size={24} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight text-white">Gestión de Personal & Matriz de Bots</h1>
                            <p className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest mt-1">
                                Control Maestro • Credenciales Fijas • Red de Inteligencia Personalizada
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
                    onClick={() => setActiveTab("org")}
                    className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 ${
                        activeTab === "org" 
                            ? "bg-purple-500/15 border border-purple-500/40 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.2)]" 
                            : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                    }`}
                >
                    <Layers size={16} /> Organigrama del Sistema
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

            {/* TAB 1: USERS TABLE EXCEL STYLE */}
            {activeTab === "users" && (
                <div className="space-y-6">
                    {/* Filters */}
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
                        <div className="flex gap-2 w-full md:w-auto">
                            <select
                                value={roleFilter}
                                onChange={e => setRoleFilter(e.target.value)}
                                className="bg-slate-950 border border-slate-800 text-xs font-mono font-bold text-white rounded-xl px-4 py-2.5 outline-none focus:border-cyan-500/50"
                            >
                                <option value="ALL">Todos los Roles</option>
                                <option value="ADMIN">ADMIN</option>
                                <option value="MANAGEMENT">MANAGEMENT</option>
                                <option value="COORDINATOR">COORDINATOR</option>
                                <option value="SALESPERSON">SALESPERSON</option>
                            </select>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left font-sans">
                                <thead>
                                    <tr className="bg-slate-950 text-[10px] font-mono uppercase tracking-widest text-slate-400 border-b border-slate-800">
                                        <th className="px-6 py-4">Usuario</th>
                                        <th className="px-6 py-4">Email Matriz</th>
                                        <th className="px-6 py-4">Contraseña (Fija / Asignada)</th>
                                        <th className="px-6 py-4">Rol & Área</th>
                                        <th className="px-6 py-4">Bot Personal</th>
                                        <th className="px-6 py-4">Antigüedad</th>
                                        <th className="px-6 py-4 text-right">Estado</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/60 text-sm">
                                    {filteredUsers.map(user => {
                                        const days = Math.floor((Date.now() - new Date(user.createdAt).getTime()) / 86400000)
                                        const isFixed = ["atomic@administrador.com", "atomic@techman.com", "atomic@softman.com", "atomic@cordinacion.com", "atomic@media.com"].includes(user.email)

                                        return (
                                            <tr key={user.id} className="hover:bg-slate-800/40 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-black text-cyan-400">
                                                            {(user.name?.[0] || user.email[0]).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-white flex items-center gap-1.5">
                                                                {user.name} {user.lastName}
                                                                {isFixed && (
                                                                    <span className="px-1.5 py-0.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[9px] font-mono rounded font-bold">
                                                                        CUENTA FIJA
                                                                    </span>
                                                                )}
                                                            </p>
                                                            <p className="text-[10px] font-mono text-slate-400">{user.id.substring(0, 8)}...</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-mono text-xs text-slate-200">{user.email}</td>
                                                <td className="px-6 py-4">
                                                    {user.plainPassword ? (
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-mono text-xs bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-emerald-400 font-bold min-w-[120px] inline-block">
                                                                {showPasswords[user.id] ? user.plainPassword : "••••••••••••"}
                                                            </span>
                                                            <button 
                                                                onClick={() => togglePassword(user.id)}
                                                                className="text-slate-500 hover:text-white p-1"
                                                            >
                                                                {showPasswords[user.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-slate-500 italic">Encriptada (BCrypt)</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="space-y-1">
                                                        <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-mono font-black uppercase tracking-wider ${
                                                            user.role === 'ADMIN' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' :
                                                            user.role === 'MANAGEMENT' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30' :
                                                            user.role === 'COORDINATOR' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                                                            'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                                        }`}>
                                                            {user.role}
                                                        </span>
                                                        {user.area && (
                                                            <p className="text-[11px] text-slate-400 font-medium">{user.area}</p>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {user.personalBot?.botName ? (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold rounded-xl">
                                                            <Sparkles size={12} /> {user.personalBot.botName}
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs text-slate-500 font-mono">Sin configurar</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 font-mono text-xs text-slate-300">
                                                    {days} días en ATOMIC
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
                                                        user.isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                                                    }`}>
                                                        {user.isActive ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
                                                        {user.isActive ? 'ACTIVO' : 'INACTIVO'}
                                                    </span>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 2: ORGANIGRAMA DEL SISTEMA */}
            {activeTab === "org" && (
                <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-8">
                    <div>
                        <h2 className="text-xl font-black text-white">Organigrama Estratégico & Red de Nodos de Inteligencia</h2>
                        <p className="text-xs font-mono text-slate-400 mt-1">Estructura jerárquica de cuentas fijas y bots de personal</p>
                    </div>

                    {/* Hierarchy Diagram */}
                    <div className="space-y-12 max-w-4xl mx-auto py-6">
                        
                        {/* LEVEL 1: ADMIN MATRIX */}
                        <div className="flex flex-col items-center">
                            <div className="bg-gradient-to-br from-rose-600 to-pink-700 p-6 rounded-3xl shadow-[0_0_40px_rgba(244,63,94,0.4)] border border-rose-400 text-center max-w-md w-full relative">
                                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-950 px-3 py-0.5 border border-rose-500 text-rose-400 text-[9px] font-mono font-black rounded-full uppercase">
                                    🛡️ Círculo Mayor (Visión 360°)
                                </span>
                                <h3 className="text-lg font-black text-white">ADMINISTRACIÓN MAESTRA</h3>
                                <p className="text-xs font-mono text-rose-200 mt-1">atomic@administrador.com</p>
                                <p className="text-[11px] text-slate-200 mt-2 bg-slate-950/40 p-2 rounded-xl border border-rose-500/30">
                                    IA Admin monitorea todos los bots y tiene contexto de toda la organización.
                                </p>
                            </div>
                            <div className="w-0.5 h-10 bg-gradient-to-b from-rose-500 to-purple-500" />
                        </div>

                        {/* LEVEL 2: MANAGEMENT & TECH */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                            <div className="bg-slate-950 border border-purple-500/40 p-6 rounded-3xl shadow-[0_0_25px_rgba(168,85,247,0.2)] text-center space-y-2">
                                <span className="px-2.5 py-0.5 bg-purple-500/10 text-purple-300 text-[9px] font-mono font-bold rounded-full border border-purple-500/30 uppercase">
                                    💻 Tecnología & Infraestructura
                                </span>
                                <h4 className="font-black text-white text-base">TECHMAN</h4>
                                <p className="text-xs font-mono text-slate-400">atomic@techman.com</p>
                                <p className="text-[11px] text-slate-300 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                                    Gestión de hardware, servidores y conexiones de red.
                                </p>
                            </div>

                            <div className="bg-slate-950 border border-purple-500/40 p-6 rounded-3xl shadow-[0_0_25px_rgba(168,85,247,0.2)] text-center space-y-2">
                                <span className="px-2.5 py-0.5 bg-purple-500/10 text-purple-300 text-[9px] font-mono font-bold rounded-full border border-purple-500/30 uppercase">
                                    ⚙️ Desarrollo & Software
                                </span>
                                <h4 className="font-black text-white text-base">SOFTMAN</h4>
                                <p className="text-xs font-mono text-slate-400">atomic@softman.com</p>
                                <p className="text-[11px] text-slate-300 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                                    Desarrollo de módulos ERP, automatizaciones e IA.
                                </p>
                            </div>
                        </div>

                        {/* CONNECTOR LINE */}
                        <div className="flex justify-center">
                            <div className="w-0.5 h-10 bg-gradient-to-b from-purple-500 to-amber-500" />
                        </div>

                        {/* LEVEL 3: COORDINATION & MEDIA */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-slate-950 border border-amber-500/40 p-6 rounded-3xl shadow-[0_0_25px_rgba(245,158,11,0.2)] text-center space-y-2">
                                <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-300 text-[9px] font-mono font-bold rounded-full border border-amber-500/30 uppercase">
                                    🎯 Coordinación de Asesores
                                </span>
                                <h4 className="font-black text-white text-base">COORDINACIÓN</h4>
                                <p className="text-xs font-mono text-slate-400">atomic@cordinacion.com</p>
                                <p className="text-[11px] text-slate-300 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                                    Supervisión de vendedores, asignación de leads y metas diarias.
                                </p>
                            </div>

                            <div className="bg-slate-950 border border-emerald-500/40 p-6 rounded-3xl shadow-[0_0_25px_rgba(16,185,129,0.2)] text-center space-y-2">
                                <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-300 text-[9px] font-mono font-bold rounded-full border border-emerald-500/30 uppercase">
                                    📢 Marketing & Media
                                </span>
                                <h4 className="font-black text-white text-base">MEDIA ATOMIC</h4>
                                <p className="text-xs font-mono text-slate-400">atomic@media.com</p>
                                <p className="text-[11px] text-slate-300 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                                    Gestión de redes sociales, campañas y blogs de la plataforma.
                                </p>
                            </div>
                        </div>

                        {/* CONNECTOR */}
                        <div className="flex justify-center">
                            <div className="w-0.5 h-10 bg-gradient-to-b from-emerald-500 to-cyan-500" />
                        </div>

                        {/* LEVEL 4: ADVISORS & INDIVIDUAL BOTS */}
                        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-cyan-500/30 p-6 rounded-3xl text-center space-y-4 shadow-xl">
                            <span className="px-3 py-1 bg-cyan-500/10 text-cyan-300 text-[10px] font-mono font-black rounded-full border border-cyan-500/30 uppercase">
                                💬 Círculos de Asistencia Individual (Nodos Asesores)
                            </span>
                            <p className="text-xs text-slate-300 max-w-xl mx-auto">
                                Cada asesor de ventas tiene su propio bot personal con memoria permanente, especializado en su rol y con técnicas de cierre en vivo.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 3: AI NETWORK OVERVIEW */}
            {activeTab === "ai_network" && (
                <div className="space-y-6">
                    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl">
                        <h2 className="text-lg font-black text-white flex items-center gap-2">
                            <Cpu className="text-emerald-400" /> Matriz de Bots de Personal en Actividad
                        </h2>
                        <p className="text-xs font-mono text-slate-400 mt-1">
                            Como Administrador, la IA te sintetiza el diálogo e inquietudes de cada usuario con su bot personal.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {botOverviews.map(b => (
                            <div key={b.id} className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl hover:border-slate-700 transition-all">
                                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-black">
                                            {b.botName?.[0] || "A"}
                                        </div>
                                        <div>
                                            <h3 className="font-black text-white text-sm">{b.botName || "Sin Nombre"}</h3>
                                            <p className="text-[11px] text-slate-400 font-mono">
                                                Bot de: <span className="text-emerald-400 font-bold">{b.user.name} {b.user.lastName}</span> ({b.user.role})
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-mono bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-slate-400">
                                        {b.messages.length} msgs
                                    </span>
                                </div>

                                <div className="space-y-2 bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80 max-h-60 overflow-y-auto">
                                    {b.messages.length === 0 ? (
                                        <p className="text-xs text-slate-500 italic">Sin interacción reciente registrada.</p>
                                    ) : (
                                        b.messages.map(m => (
                                            <div key={m.id} className="text-xs space-y-1">
                                                <span className={`font-mono font-bold text-[9px] uppercase ${m.role === 'user' ? 'text-cyan-400' : 'text-emerald-400'}`}>
                                                    {m.role === 'user' ? b.user.name : b.botName}:
                                                </span>
                                                <p className="text-slate-300 text-xs pl-2 border-l border-slate-800 whitespace-pre-wrap">
                                                    {m.content.length > 150 ? m.content.substring(0, 150) + "..." : m.content}
                                                </p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Modal: Create User */}
            {isCreateOpen && (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6 animate-in fade-in zoom-in-95">
                        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                            <h3 className="text-lg font-black text-white">Crear Nueva Cuenta</h3>
                            <button onClick={() => setIsCreateOpen(false)} className="text-slate-500 hover:text-white">
                                <XCircle size={20} />
                            </button>
                        </div>

                        {error && (
                            <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl text-xs font-mono">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleCreateUser} className="space-y-4 text-xs font-medium">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-slate-400 block mb-1">Nombre</label>
                                    <input 
                                        type="text"
                                        required
                                        value={newUser.name}
                                        onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-slate-400 block mb-1">Apellido</label>
                                    <input 
                                        type="text"
                                        value={newUser.lastName}
                                        onChange={e => setNewUser({ ...newUser, lastName: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-slate-400 block mb-1">Correo Electrónico</label>
                                <input 
                                    type="email"
                                    required
                                    value={newUser.email}
                                    onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-500 font-mono"
                                />
                            </div>

                            <div>
                                <label className="text-slate-400 block mb-1">Contraseña Fija Asignada</label>
                                <input 
                                    type="text"
                                    required
                                    value={newUser.password}
                                    onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-emerald-400 outline-none focus:border-cyan-500 font-mono"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-slate-400 block mb-1">Rol</label>
                                    <select
                                        value={newUser.role}
                                        onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-500"
                                    >
                                        <option value="SALESPERSON">Vendedor</option>
                                        <option value="COORDINATOR">Coordinador</option>
                                        <option value="MANAGEMENT">Gestión</option>
                                        <option value="ADMIN">Administrador</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-slate-400 block mb-1">Área</label>
                                    <input 
                                        type="text"
                                        value={newUser.area}
                                        onChange={e => setNewUser({ ...newUser, area: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-500"
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-black text-xs uppercase tracking-widest rounded-xl hover:scale-[1.02] transition-all disabled:opacity-50 mt-4"
                            >
                                {isSubmitting ? "Creando..." : "Guardar & Aprobar Cuenta"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
