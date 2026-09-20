"use client"

import { useState } from "react"
import { 
    Search, Shield, ShieldAlert, Mail, Clock, Check, X, 
    ChevronDown, Trash2, Settings2, Sliders, Lock, Unlock, 
    Sparkles, UserCheck, Eye, EyeOff, Save, Loader2 
} from "lucide-react"

interface User {
    id: string
    name: string
    email: string
    role: string
    status: string
    createdAt: string
    profileData?: string | null
    area?: string | null
    profilePicture?: string | null
    quotesCount?: number
    totalVentas?: number
    totalComision?: number
}

interface Props {
    users: User[]
}

const AVAILABLE_ROLES = [
    { id: "ADMIN", label: "Administrador Total", desc: "Acceso ilimitado a todo el ERP", color: "bg-red-500/15 text-red-300 border-red-500/30", icon: "👑" },
    { id: "COORDINATOR", label: "Coordinador General", desc: "Gestión de asesores, contratos y planes", color: "bg-purple-500/15 text-purple-300 border-purple-500/30", icon: "🎯" },
    { id: "COORD_ASSISTANT", label: "Asistente de Coord.", desc: "Soporte administrativo y bitácoras", color: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30", icon: "📋" },
    { id: "SALESPERSON", label: "Asesor Comercial", desc: "Ventas, clientes y cotizaciones", color: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30", icon: "💼" },
    { id: "EDITOR", label: "Editor de Medios", desc: "Diseños, marketing y publicación", color: "bg-pink-500/15 text-pink-300 border-pink-500/30", icon: "🎨" },
    { id: "TECNICO", label: "Servicio Técnico", desc: "Taller, soporte y visitas técnicas", color: "bg-amber-500/15 text-amber-300 border-amber-500/30", icon: "🔧" },
    { id: "AFILIADO", label: "Afiliado Corporativo", desc: "Comisionista independiente freelance", color: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30", icon: "🤝" },
    { id: "CURSOS", label: "Academia / Cursos", desc: "Estudiante de campus ATOMIC", color: "bg-blue-500/15 text-blue-300 border-blue-500/30", icon: "🎓" },
]

const MODULE_PERMISSIONS = [
    { id: "viewCostMatrix", label: "Ver Costos en Matriz de Precios", desc: "Permite ver costos de distribuidor y márgenes. Si está desactivado, solo ve PVP.", icon: "🏷️" },
    { id: "createQuotes", label: "Emisión de Cotizaciones PROP", desc: "Crear cotizaciones oficiales y exportar a PDF / WhatsApp.", icon: "📑" },
    { id: "manageCoordination", label: "Módulo de Coordinación", desc: "Gestión de contratos, planes de 30 días y bitácoras de asesores.", icon: "🎯" },
    { id: "crmLeads", label: "CRM WhatsApp & Asignación de Leads", desc: "Recepción, chat y seguimiento de prospectos comerciales.", icon: "💬" },
    { id: "techWorkshop", label: "Taller Técnico & Visitas", desc: "Soporte, reparaciones y registro de visitas en terreno.", icon: "🔧" },
    { id: "academy", label: "Academia & Cursos ATOMIC", desc: "Acceso al campus formativo y certificaciones técnicas.", icon: "🎓" },
    { id: "marketingPublisher", label: "Publicador & Diseños Media", desc: "Subida y descarga de piezas publicitarias para redes.", icon: "📣" },
    { id: "finances", label: "Finanzas & Comisiones", desc: "Acceso a balances financieros y liquidación de comisiones.", icon: "💰" },
]

export default function UserManagementClient({ users: initialUsers }: Props) {
    const [users, setUsers] = useState(initialUsers)
    const [searchTerm, setSearchTerm] = useState("")
    const [activeTab, setActiveTab] = useState("approved")
    const [loadingId, setLoadingId] = useState<string | null>(null)

    // Modal state for editing roles & permissions
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [modalRoles, setModalRoles] = useState<string[]>([])
    const [modalPermissions, setModalPermissions] = useState<Record<string, boolean>>({})
    const [isSavingModal, setIsSavingModal] = useState(false)

    const parseRoles = (roleStr: string): string[] => {
        if (!roleStr) return ["SALESPERSON"]
        return roleStr.split(",").map(r => r.trim()).filter(Boolean)
    }

    const parsePermissions = (user: User): Record<string, boolean> => {
        try {
            if (user.profileData) {
                const parsed = JSON.parse(user.profileData)
                if (parsed.permissions) return parsed.permissions
            }
        } catch {}
        const roles = parseRoles(user.role)
        const isAdminOrCoord = roles.some(r => ["ADMIN", "MANAGEMENT", "COORDINATOR"].includes(r))
        return {
            viewCostMatrix: isAdminOrCoord,
            createQuotes: true,
            manageCoordination: isAdminOrCoord,
            crmLeads: true,
            techWorkshop: roles.includes("TECNICO") || isAdminOrCoord,
            academy: true,
            marketingPublisher: roles.includes("EDITOR") || isAdminOrCoord,
            finances: isAdminOrCoord
        }
    }

    const handleOpenModal = (user: User) => {
        setSelectedUser(user)
        setModalRoles(parseRoles(user.role))
        setModalPermissions(parsePermissions(user))
    }

    const handleToggleRole = (roleId: string) => {
        if (modalRoles.includes(roleId)) {
            if (modalRoles.length === 1) return // Keep at least one role
            setModalRoles(modalRoles.filter(r => r !== roleId))
        } else {
            setModalRoles([...modalRoles, roleId])
        }
    }

    const handleTogglePermission = (permId: string) => {
        setModalPermissions(prev => ({
            ...prev,
            [permId]: !prev[permId]
        }))
    }

    const handleSaveRolesAndPermissions = async () => {
        if (!selectedUser) return
        setIsSavingModal(true)
        const newRolesStr = modalRoles.join(",")
        
        let updatedProfileData: any = {}
        try {
            if (selectedUser.profileData) {
                updatedProfileData = JSON.parse(selectedUser.profileData)
            }
        } catch {}
        updatedProfileData.roles = modalRoles
        updatedProfileData.permissions = modalPermissions

        try {
            const res = await fetch(`/api/admin/users/${selectedUser.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    role: newRolesStr,
                    profileData: JSON.stringify(updatedProfileData)
                })
            })
            if (res.ok) {
                setUsers(users.map(u => u.id === selectedUser.id ? {
                    ...u,
                    role: newRolesStr,
                    profileData: JSON.stringify(updatedProfileData)
                } : u))
                setSelectedUser(null)
            } else {
                alert("Error al guardar roles y permisos")
            }
        } catch (err) {
            console.error(err)
            alert("Error de conexión al servidor")
        } finally {
            setIsSavingModal(false)
        }
    }

    const handleDeleteUser = async (userId: string) => {
        if (!confirm("¿Está seguro de eliminar este usuario definitivamente?")) return;
        setLoadingId(userId)
        try {
            const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" })
            if (res.ok) {
                setUsers(users.filter(u => u.id !== userId))
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoadingId(null)
        }
    }

    const handleUpdateStatus = async (userId: string, status: string) => {
        setLoadingId(userId)
        try {
            const res = await fetch(`/api/admin/users/${userId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            })
            if (res.ok) {
                setUsers(users.map(u => u.id === userId ? { ...u, status } : u))
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoadingId(null)
        }
    }

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const pendingUsers = filteredUsers.filter(u => u.status === "PENDING")
    const activeUsers = filteredUsers.filter(u => u.status === "APPROVED")
    const rejectedUsers = filteredUsers.filter(u => u.status === "REJECTED")

    const usersToShow = activeTab === "pending" ? pendingUsers
        : activeTab === "approved" ? activeUsers
            : rejectedUsers

    const renderTabButton = (id: string, label: string, count: number) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`px-5 py-3 text-xs font-bold uppercase tracking-widest transition-all border-b-2 flex items-center space-x-2 cursor-pointer ${activeTab === id
                ? "border-cyan-400 text-cyan-400 bg-cyan-950/20"
                : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
        >
            <span>{label}</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${activeTab === id ? 'bg-cyan-500 text-black' : 'bg-slate-800 text-slate-400'}`}>{count}</span>
        </button>
    )

    return (
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl overflow-hidden mt-6">

            {/* Header / Tabs */}
            <div className="flex flex-col md:flex-row border-b border-slate-800 px-4 text-slate-100 items-stretch md:items-center justify-between">
                <div className="flex flex-1 overflow-x-auto">
                    {renderTabButton("approved", "Asesores Activos", activeUsers.length)}
                    {renderTabButton("pending", "Postulantes Pendientes", pendingUsers.length)}
                    {renderTabButton("rejected", "Declinados", rejectedUsers.length)}
                </div>
                <div className="p-3 flex items-center">
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-white outline-none focus:border-cyan-400 w-full placeholder:text-slate-500"
                        />
                    </div>
                </div>
            </div>

            {/* Users List */}
            <div className="divide-y divide-slate-800/80">
                {usersToShow.length === 0 ? (
                    <div className="p-16 text-center text-slate-400">
                        <ShieldAlert size={40} className="mx-auto text-slate-600 mb-3" />
                        <p className="font-bold uppercase tracking-wider text-xs">Sin registros encontrados en esta sección</p>
                    </div>
                ) : (
                    usersToShow.map(user => {
                        const userRoles = parseRoles(user.role)
                        const userPerms = parsePermissions(user)
                        return (
                            <div key={user.id} className="p-5 transition-colors hover:bg-slate-850/40 group">
                                <div className="flex flex-col lg:flex-row gap-5">

                                    {/* Left Col: Identity and Metrics */}
                                    <div className="flex-1 flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-600 to-indigo-700 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-cyan-500/20 shrink-0 border border-cyan-400/30 overflow-hidden">
                                            {user.profilePicture ? (
                                                <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
                                            ) : (
                                                user.name?.[0] || "?"
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className="text-base font-bold text-white tracking-tight">
                                                    {user.name}
                                                </h3>
                                                {user.status === "PENDING" && (
                                                    <span className="text-[9px] font-bold px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full uppercase tracking-wider">
                                                        Pendiente Aprobación
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex flex-wrap items-center gap-4 mt-1.5 text-[10px] font-medium text-slate-400">
                                                <span className="flex items-center"><Mail size={12} className="mr-1 text-cyan-400" /> {user.email}</span>
                                                <span className="flex items-center"><Clock size={12} className="mr-1 text-indigo-400" /> {new Date(user.createdAt).toLocaleDateString()}</span>
                                            </div>

                                            {/* Multi-Role Badges */}
                                            <div className="flex flex-wrap items-center gap-1.5 mt-3">
                                                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mr-1">Roles:</span>
                                                {userRoles.map(r => {
                                                    const roleObj = AVAILABLE_ROLES.find(ar => ar.id === r)
                                                    return (
                                                        <span 
                                                            key={r} 
                                                            className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold border flex items-center gap-1 ${
                                                                roleObj ? roleObj.color : "bg-slate-800 text-slate-300 border-slate-700"
                                                            }`}
                                                        >
                                                            <span>{roleObj?.icon || "💼"}</span>
                                                            <span>{roleObj?.label || r}</span>
                                                        </span>
                                                    )
                                                })}
                                                {userPerms.viewCostMatrix && (
                                                    <span className="px-2 py-0.5 rounded-lg text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                                                        <Eye size={10} /> Costos Habilitados
                                                    </span>
                                                )}
                                            </div>
                                            
                                            {/* Performance Metrics Row */}
                                            <div className="flex flex-wrap gap-6 mt-4 pt-3 border-t border-slate-800/60 text-xs">
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Cotizaciones</span>
                                                    <span className="text-xs font-bold text-white mt-0.5">{user.quotesCount || 0}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Ventas Cerradas</span>
                                                    <span className="text-xs font-bold text-emerald-400 mt-0.5">${(user.totalVentas || 0).toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
                                                </div>
                                                <div className="flex flex-col border-l border-slate-800 pl-4">
                                                    <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Comisiones</span>
                                                    <span className="text-xs font-bold text-cyan-400 mt-0.5">${(user.totalComision || 0).toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Col: Actions */}
                                    <div className="lg:w-80 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-800 pt-4 lg:pt-0 lg:pl-6">
                                        <div className="space-y-3">
                                            {user.status === "PENDING" ? (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleUpdateStatus(user.id, "APPROVED")}
                                                        disabled={loadingId === user.id}
                                                        className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2.5 rounded-xl flex items-center justify-center text-xs uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer"
                                                    >
                                                        <Check size={14} className="mr-1.5" /> Aprobar
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateStatus(user.id, "REJECTED")}
                                                        disabled={loadingId === user.id}
                                                        className="px-4 bg-slate-800 hover:bg-rose-900/40 text-rose-300 border border-rose-500/20 font-bold py-2.5 rounded-xl flex items-center justify-center text-xs uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => handleOpenModal(user)}
                                                    className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-cyan-500/50 text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-between text-xs uppercase tracking-wider transition-all cursor-pointer group/btn"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <Sliders size={14} className="text-cyan-400 group-hover/btn:rotate-90 transition-transform" />
                                                        <span>Roles & Permisos ({userRoles.length})</span>
                                                    </div>
                                                    <ChevronDown size={14} className="text-slate-400" />
                                                </button>
                                            )}
                                        </div>

                                        <div className="mt-4 pt-3 border-t border-slate-800/60 flex justify-between items-center text-[10px]">
                                            <button
                                                onClick={() => handleDeleteUser(user.id)}
                                                className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all cursor-pointer"
                                                title="Eliminar asesor"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                            <span className={`font-mono font-bold uppercase ${
                                                user.status === 'APPROVED' ? 'text-emerald-400' : user.status === 'REJECTED' ? 'text-rose-400' : 'text-amber-400'
                                            }`}>
                                                ● {user.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>

            {/* ── MODAL: GESTIÓN DE MULTI-ROLES & ALCANCE DE FUNCIONES ── */}
            {selectedUser && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-[#10111a] border border-cyan-500/30 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200">
                        
                        {/* Modal Header */}
                        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                            <div>
                                <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider">
                                    <Shield size={16} />
                                    <span>Control de Perfil y Alcance</span>
                                </div>
                                <h3 className="text-xl font-black text-white mt-1">
                                    {selectedUser.name}
                                </h3>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    {selectedUser.email}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* SECCIÓN 1: Selección Multi-Rol */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-black uppercase text-cyan-300 tracking-wider flex items-center gap-2">
                                    <span>1. Asignar Roles Activos (Multi-Rol)</span>
                                </label>
                                <span className="text-[10px] font-mono text-cyan-400">
                                    {modalRoles.length} Seleccionado(s)
                                </span>
                            </div>
                            <p className="text-xs text-slate-400">
                                Puedes asignar uno o más roles simultáneos al colaborador para combinar sus facultades en el sistema:
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                {AVAILABLE_ROLES.map((r) => {
                                    const isSelected = modalRoles.includes(r.id)
                                    return (
                                        <button
                                            key={r.id}
                                            type="button"
                                            onClick={() => handleToggleRole(r.id)}
                                            className={`p-3 rounded-2xl border text-left transition-all flex items-start justify-between cursor-pointer ${
                                                isSelected
                                                    ? "bg-cyan-950/40 border-cyan-400 ring-1 ring-cyan-400"
                                                    : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                                            }`}
                                        >
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-base">{r.icon}</span>
                                                    <span className="text-xs font-black text-white uppercase">
                                                        {r.label}
                                                    </span>
                                                </div>
                                                <p className="text-[10px] text-slate-400 leading-tight">
                                                    {r.desc}
                                                </p>
                                            </div>
                                            <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${
                                                isSelected ? "bg-cyan-400 border-cyan-400 text-black" : "border-slate-700"
                                            }`}>
                                                {isSelected && <Check size={12} strokeWidth={3} />}
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* SECCIÓN 2: Alcance de Funciones & Permisos */}
                        <div className="space-y-3 pt-4 border-t border-slate-800">
                            <label className="text-xs font-black uppercase text-indigo-300 tracking-wider flex items-center gap-2">
                                <span>2. Matriz de Alcance de Funciones & Módulos</span>
                            </label>
                            <p className="text-xs text-slate-400">
                                Enciende o apaga las capacidades operativas para este asesor:
                            </p>

                            <div className="space-y-2">
                                {MODULE_PERMISSIONS.map((p) => {
                                    const isAllowed = !!modalPermissions[p.id]
                                    return (
                                        <div
                                            key={p.id}
                                            onClick={() => handleTogglePermission(p.id)}
                                            className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                                                isAllowed
                                                    ? "bg-indigo-950/30 border-indigo-500/50"
                                                    : "bg-slate-950/40 border-slate-800 hover:border-slate-700 opacity-60"
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-lg">{p.icon}</span>
                                                <div>
                                                    <div className="text-xs font-bold text-white flex items-center gap-2">
                                                        <span>{p.label}</span>
                                                        {p.id === "viewCostMatrix" && (
                                                            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                                                CRÍTICO
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-[10px] text-slate-400 mt-0.5">
                                                        {p.desc}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Toggle Switch */}
                                            <div className={`w-11 h-6 rounded-full p-1 transition-colors shrink-0 ${
                                                isAllowed ? "bg-cyan-500" : "bg-slate-800"
                                            }`}>
                                                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                                                    isAllowed ? "translate-x-5" : "translate-x-0"
                                                }`} />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Modal Footer Actions */}
                        <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setSelectedUser(null)}
                                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold uppercase transition-colors cursor-pointer"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                disabled={isSavingModal}
                                onClick={handleSaveRolesAndPermissions}
                                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all cursor-pointer disabled:opacity-50"
                            >
                                {isSavingModal ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                <span>Guardar Configuración</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}







