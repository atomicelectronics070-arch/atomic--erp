"use client"

import { useState } from "react"
import { Search, Shield, ShieldAlert, Mail, Clock, Check, X, ChevronDown, Trash2 } from "lucide-react"

interface User {
    id: string
    name: string
    email: string
    role: string
    status: string
    createdAt: string
    quotesCount?: number
    totalVentas?: number
    totalComision?: number
}

interface Props {
    users: User[]
}

export default function UserManagementClient({ users: initialUsers }: Props) {
    const [users, setUsers] = useState(initialUsers)
    const [searchTerm, setSearchTerm] = useState("")
    const [activeTab, setActiveTab] = useState("pending")
    const [loadingId, setLoadingId] = useState<string | null>(null)

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

    const handleRoleChange = async (userId: string, role: string) => {
        setLoadingId(userId)
        try {
            const res = await fetch(`/api/admin/users/${userId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role }),
            })
            if (res.ok) {
                setUsers(users.map(u => u.id === userId ? { ...u, role } : u))
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoadingId(null)
        }
    }

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
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
            className={`px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all border-b-2 flex items-center space-x-2 ${activeTab === id
                ? "border-indigo-500 text-indigo-500 bg-indigo-50/30"
                : "border-transparent text-neutral-400 hover:text-neutral-600 :text-neutral-200"
                }`}
        >
            <span>{label}</span>
            <span className={`px-2 py-0.5 rounded-none text-[10px] ${activeTab === id ? 'bg-indigo-500 text-white' : 'bg-neutral-100  text-neutral-500'}`}>{count}</span>
        </button>
    )

    return (
        <div className="bg-white  border border-neutral-200  rounded-none shadow-sm overflow-hidden mt-8">

            {/* Header / Tabs */}
            <div className="flex flex-col md:flex-row border-b border-neutral-50  px-4 text-neutral-900 ">
                <div className="flex flex-1 overflow-x-auto">
                    {renderTabButton("pending", "Pendientes", pendingUsers.length)}
                    {renderTabButton("approved", "Activos", activeUsers.length)}
                    {renderTabButton("rejected", "Rechazados", rejectedUsers.length)}
                </div>
                <div className="p-3 flex items-center">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                        <input
                            type="text"
                            placeholder="Buscar usuario..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2 bg-neutral-50  border border-neutral-100  rounded-none text-xs outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-64"
                        />
                    </div>
                </div>
            </div>

            <div className="divide-y divide-neutral-50 ">
                {usersToShow.length === 0 ? (
                    <div className="p-20 text-center text-neutral-900 ">
                        <ShieldAlert size={48} className="mx-auto text-neutral-100 mb-4" />
                        <p className="text-neutral-400 font-bold uppercase tracking-widest text-[10px]">Sin registros encontrados</p>
                    </div>
                ) : (
                    usersToShow.map(user => (
                        <div key={user.id} className="p-4 transition-colors hover:bg-neutral-50/50 :bg-neutral-800/20 group">
                            <div className="flex flex-col lg:flex-row gap-4">

                                {/* Left Col: Identity and Metrics */}
                                <div className="flex-1 flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4">
                                    <div className="w-12 h-12 rounded-none bg-indigo-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/20 shrink-0">
                                        {user.name?.[0] || "?"}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-base font-bold text-neutral-900 tracking-tight flex items-center">
                                            {user.name}
                                            {user.status === "PENDING" && <span className="ml-2 text-[8px] font-bold px-1.5 py-0.5 bg-indigo-500 text-white rounded-none uppercase tracking-widest">Nuevo</span>}
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-3 mt-1 text-[9px] font-bold text-neutral-400 uppercase tracking-widest">
                                            <span className="flex items-center"><Mail size={12} className="mr-1 text-indigo-500" /> {user.email}</span>
                                            <span className="flex items-center"><Clock size={12} className="mr-1 text-indigo-500" /> {new Date(user.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        
                                        {/* Performance Metrics Row */}
                                        <div className="flex flex-wrap gap-4 mt-3 pt-3 border-t border-neutral-100">
                                            <div className="flex flex-col">
                                                <span className="text-[8px] text-neutral-400 uppercase font-bold tracking-widest">Cotizaciones</span>
                                                <span className="text-xs font-black text-neutral-800">{user.quotesCount || 0}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[8px] text-neutral-400 uppercase font-bold tracking-widest">Ventas (Aprob/Fact)</span>
                                                <span className="text-xs font-black text-green-600">${(user.totalVentas || 0).toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
                                            </div>
                                            <div className="flex flex-col border-l border-neutral-100 pl-4">
                                                <span className="text-[8px] text-neutral-400 uppercase font-bold tracking-widest">Comisiones Generadas</span>
                                                <span className="text-xs font-black text-indigo-500">${(user.totalComision || 0).toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Col: Management */}
                                <div className="lg:w-72 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-neutral-50  pt-8 lg:pt-0 lg:pl-8">

                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-4">Acciones de Dirección</h4>

                                        {user.status === "PENDING" && (
                                            <div className="flex flex-col space-y-2">
                                                <button
                                                    onClick={() => handleUpdateStatus(user.id, "APPROVED")}
                                                    disabled={loadingId === user.id}
                                                    className="w-full bg-indigo-500 hover:bg-orange-700 text-white font-bold py-4 rounded-none flex items-center justify-center transition-all disabled:opacity-50 text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-500/20"
                                                >
                                                    <Check size={16} className="mr-2" /> Aprobar Acceso
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateStatus(user.id, "REJECTED")}
                                                    disabled={loadingId === user.id}
                                                    className="w-full bg-white  border border-neutral-200  text-red-600 font-bold py-4 rounded-none flex items-center justify-center transition-all disabled:opacity-50 text-[10px] uppercase tracking-widest"
                                                >
                                                    <X size={16} className="mr-2" /> Declinar
                                                </button>
                                            </div>
                                        )}

                                        {user.status === "APPROVED" && (
                                            <div className="space-y-4">
                                                <div className="relative">
                                                    <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Asignar Cargo</label>
                                                    <div className="relative">
                                                        <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500" size={16} />
                                                        <select
                                                            value={user.role}
                                                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                            className="w-full bg-neutral-50  border border-neutral-100  text-neutral-900  text-xs font-bold rounded-none pl-11 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-indigo-500 appearance-none transition-all"
                                                        >
                                                            <option value="ADMIN">Administrador</option>
                                                            <option value="MANAGEMENT">Gerencia Corporativa</option>
                                                            <option value="COORDINATOR">Coordinación</option>
                                                            <option value="COORD_ASSISTANT">Asistente de Coordinación</option>
                                                            <option value="SALESPERSON">Asesor Comercial (Vendedor)</option>
                                                            <option value="AFILIADO">Afiliado Corporativo</option>
                                                            <option value="CONSUMIDOR">Consumidor Final</option>
                                                            <option value="CURSOS">Estudiante / Academia</option>
                                                            <option value="EDITOR">Editor de Contenido</option>
                                                        </select>
                                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" size={16} />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {user.status === "REJECTED" && (
                                            <button
                                                onClick={() => handleUpdateStatus(user.id, "APPROVED")}
                                                disabled={loadingId === user.id}
                                                className="w-full bg-neutral-100  text-neutral-600  font-bold py-4 rounded-none flex items-center justify-center transition-all disabled:opacity-50 text-[10px] uppercase tracking-widest"
                                            >
                                                Re-evaluar Postulante
                                            </button>
                                        )}
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-neutral-50 flex justify-between items-center">
                                        <button
                                            onClick={() => handleDeleteUser(user.id)}
                                            className="p-2 text-neutral-300 hover:text-red-600 hover:bg-red-50 transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                        <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest">
                                            <span className="text-neutral-400">Estado:</span>
                                            <span className={user.status === 'APPROVED' ? 'text-green-500' : user.status === 'REJECTED' ? 'text-red-500' : 'text-indigo-500'}>
                                                {user.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}







