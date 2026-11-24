"use client"

import React, { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    KeyRound, User, Mail, Shield, ShieldCheck, Copy, Check, Eye,
    EyeOff, Edit3, Save, X, Search, Plus, RefreshCw, AlertCircle,
    CheckCircle2, Smartphone, Lock, Unlock, PhoneCall, Sparkles, Filter
} from "lucide-react"

interface SystemUserCredential {
    id: string
    name: string
    lastName?: string
    fullName: string
    email: string
    password: string
    role: string
    status: string
    isActive: boolean
    cedula?: string
    phoneNumber?: string
    createdAt?: string
}

interface SystemCredentialsModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function SystemCredentialsModal({
    isOpen,
    onClose
}: SystemCredentialsModalProps) {
    const [loading, setLoading] = useState(true)
    const [users, setUsers] = useState<SystemUserCredential[]>([])
    const [search, setSearch] = useState("")
    const [selectedRoleFilter, setSelectedRoleFilter] = useState("TODOS")

    // Show/hide password states map
    const [showPasswordMap, setShowPasswordMap] = useState<Record<string, boolean>>({})
    const [copiedKey, setCopiedKey] = useState<string | null>(null)

    // Inline Editing State
    const [editingUserId, setEditingUserId] = useState<string | null>(null)
    const [editFormData, setEditFormData] = useState<Partial<SystemUserCredential>>({})
    const [savingId, setSavingId] = useState<string | null>(null)
    const [saveToast, setSaveToast] = useState<string | null>(null)

    // Create New User State
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [createFormData, setCreateFormData] = useState({
        name: "",
        lastName: "",
        email: "",
        password: "",
        role: "SALESPERSON",
        phoneNumber: "",
        cedula: ""
    })
    const [creating, setCreating] = useState(false)

    const fetchCredentials = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/admin/system-credentials")
            const data = await res.json()
            if (data.success && data.users) {
                setUsers(data.users)
            } else if (data.error) {
                console.error("Error fetching credentials:", data.error)
            }
        } catch (e) {
            console.error("Fetch credentials error:", e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (isOpen) {
            fetchCredentials()
        }
    }, [isOpen])

    const handleCopy = (text: string, key: string) => {
        if (!text) return
        navigator.clipboard.writeText(text)
        setCopiedKey(key)
        setTimeout(() => setCopiedKey(null), 2000)
    }

    const handleCopyFullAccess = (u: SystemUserCredential) => {
        const text = `🔐 *ACCESO OFICIAL AL SISTEMA ATOMIC ERP*
👤 *Colaborador:* ${u.fullName}
📧 *Usuario / Correo:* ${u.email}
🔑 *Contraseña:* ${u.password}
🏷️ *Rol Asignado:* ${u.role}
🌐 *Plataforma:* https://atomiccotizador.shop/login

_Guarda este mensaje en tus chats fijados. No compartas tus credenciales con personas ajenas a la empresa._`

        navigator.clipboard.writeText(text)
        setCopiedKey(`full_${u.id}`)
        setSaveToast(`Ficha de acceso copiada para ${u.fullName}`)
        setTimeout(() => {
            setCopiedKey(null)
            setSaveToast(null)
        }, 3000)
    }

    const togglePasswordVisibility = (id: string) => {
        setShowPasswordMap(prev => ({ ...prev, [id]: !prev[id] }))
    }

    const startEditing = (u: SystemUserCredential) => {
        setEditingUserId(u.id)
        setEditFormData({
            name: u.name,
            lastName: u.lastName || "",
            email: u.email,
            password: u.password,
            role: u.role,
            phoneNumber: u.phoneNumber || "",
            cedula: u.cedula || "",
            isActive: u.isActive
        })
    }

    const cancelEditing = () => {
        setEditingUserId(null)
        setEditFormData({})
    }

    const saveInlineEdit = async (userId: string) => {
        setSavingId(userId)
        try {
            const res = await fetch("/api/admin/system-credentials", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "update",
                    id: userId,
                    name: editFormData.name,
                    lastName: editFormData.lastName,
                    email: editFormData.email,
                    password: editFormData.password,
                    role: editFormData.role,
                    phoneNumber: editFormData.phoneNumber,
                    cedula: editFormData.cedula,
                    isActive: editFormData.isActive
                })
            })

            const data = await res.json()
            if (data.success && data.user) {
                setUsers(prev => prev.map(item => item.id === userId ? { ...item, ...data.user } : item))
                setEditingUserId(null)
                setEditFormData({})
                setSaveToast(`✅ Credenciales actualizadas para ${data.user.name || data.user.email}`)
                setTimeout(() => setSaveToast(null), 3500)
            } else {
                alert(data.error || "Error al actualizar credenciales")
            }
        } catch (e: any) {
            alert(e.message || "Error al conectar con el servidor")
        } finally {
            setSavingId(null)
        }
    }

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!createFormData.email || !createFormData.password) {
            alert("Email y Contraseña son obligatorios.")
            return
        }

        setCreating(true)
        try {
            const res = await fetch("/api/admin/system-credentials", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "create",
                    ...createFormData
                })
            })
            const data = await res.json()
            if (data.success && data.user) {
                setUsers(prev => [data.user, ...prev])
                setShowCreateModal(false)
                setCreateFormData({
                    name: "",
                    lastName: "",
                    email: "",
                    password: "",
                    role: "SALESPERSON",
                    phoneNumber: "",
                    cedula: ""
                })
                setSaveToast(`✅ Usuario creado: ${data.user.email}`)
                setTimeout(() => setSaveToast(null), 3500)
            } else {
                alert(data.error || "No se pudo crear el usuario")
            }
        } catch (e: any) {
            alert(e.message || "Error en el servidor")
        } finally {
            setCreating(false)
        }
    }

    // Filtered users list
    const filteredUsers = useMemo(() => {
        return users.filter(u => {
            const matchesSearch = 
                u.fullName.toLowerCase().includes(search.toLowerCase()) ||
                u.email.toLowerCase().includes(search.toLowerCase()) ||
                (u.phoneNumber && u.phoneNumber.includes(search)) ||
                (u.cedula && u.cedula.includes(search))

            const matchesRole = 
                selectedRoleFilter === "TODOS" ? true :
                selectedRoleFilter === "VENTAS" ? u.role.includes("SALESPERSON") :
                selectedRoleFilter === "COORDINACION" ? u.role.includes("COORDINATOR") :
                selectedRoleFilter === "ADMIN" ? (u.role.includes("ADMIN") || u.role.includes("MANAGEMENT")) :
                selectedRoleFilter === "TECNICO" ? u.role.includes("TECNICO") :
                selectedRoleFilter === "MEDIA" ? (u.role.includes("USER") || u.email.includes("stefy")) : true

            return matchesSearch && matchesRole
        })
    }, [users, search, selectedRoleFilter])

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
                />

                {/* Modal Window */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative z-10 w-full max-w-5xl max-h-[92vh] flex flex-col bg-[#070b18] border border-cyan-500/40 rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.95)] overflow-hidden"
                >
                    {/* Header */}
                    <div className="p-5 sm:p-6 border-b border-white/10 bg-gradient-to-r from-blue-950/40 via-cyan-950/30 to-[#070b18] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 flex items-center justify-center text-black font-black shadow-lg shadow-amber-500/30 shrink-0">
                                <KeyRound size={24} className="stroke-[2.5]" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h2 className="text-lg sm:text-xl font-black text-white tracking-tight uppercase">
                                        Credenciales & Contraseñas del Sistema
                                    </h2>
                                    <span className="text-[9px] font-mono font-black px-2 py-0.5 rounded-full bg-amber-500 text-black uppercase">
                                        DIRECTORIO JUAN PABLO
                                    </span>
                                </div>
                                <p className="text-xs text-slate-300 mt-0.5">
                                    Directorio central de cuentas activas en ATOMIC ERP. Consulta, copia y edita claves en tiempo real.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-auto">
                            <button
                                type="button"
                                onClick={() => setShowCreateModal(true)}
                                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-emerald-950/40 transition-all cursor-pointer"
                            >
                                <Plus size={15} className="stroke-[3]" />
                                <span>Nuevo Colaborador</span>
                            </button>

                            <button
                                type="button"
                                onClick={fetchCredentials}
                                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors"
                                title="Recargar lista"
                            >
                                <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                            </button>

                            <button
                                type="button"
                                onClick={onClose}
                                className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-white/10 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Floating Toast Notification */}
                    {saveToast && (
                        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-emerald-500 text-black font-black text-xs shadow-2xl flex items-center gap-2 border border-white animate-in fade-in duration-200">
                            <CheckCircle2 size={16} />
                            <span>{saveToast}</span>
                        </div>
                    )}

                    {/* Search & Filter Bar */}
                    <div className="p-4 border-b border-white/5 bg-slate-950/60 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
                        <div className="relative w-full sm:w-80">
                            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Buscar por nombre, correo, cédula o teléfono..."
                                className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-medium"
                            />
                        </div>

                        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
                            <span className="text-[11px] font-mono text-slate-400 mr-1 hidden sm:inline">Filtrar:</span>
                            {["TODOS", "VENTAS", "COORDINACION", "ADMIN", "TECNICO", "MEDIA"].map(r => (
                                <button
                                    key={r}
                                    type="button"
                                    onClick={() => setSelectedRoleFilter(r)}
                                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase transition-all shrink-0 ${
                                        selectedRoleFilter === r
                                            ? "bg-cyan-500 text-black shadow-sm font-black"
                                            : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                                    }`}
                                >
                                    {r}
                                </button>
                            ))}
                            <span className="text-[10px] font-mono text-slate-500 px-2">
                                ({filteredUsers.length} de {users.length})
                            </span>
                        </div>
                    </div>

                    {/* Body: Table of Users & Credentials */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 custom-scrollbar">
                        {loading ? (
                            <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400 font-mono text-xs">
                                <RefreshCw size={24} className="animate-spin text-cyan-400" />
                                <span>Cargando directorio de credenciales y contraseñas...</span>
                            </div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="py-20 text-center text-slate-400 font-mono text-xs space-y-2">
                                <AlertCircle size={28} className="mx-auto text-amber-400" />
                                <p>No se encontraron usuarios coincidentes con tu búsqueda.</p>
                            </div>
                        ) : (
                            filteredUsers.map((u) => {
                                const isEditing = editingUserId === u.id
                                const isPasswordVisible = Boolean(showPasswordMap[u.id])

                                return (
                                    <div
                                        key={u.id}
                                        className={`rounded-2xl border transition-all p-4 ${
                                            isEditing
                                                ? "bg-cyan-950/20 border-cyan-400/80 shadow-lg shadow-cyan-950/50"
                                                : "bg-[#0b1021]/80 hover:bg-[#0e142a] border-white/5 hover:border-white/10"
                                        }`}
                                    >
                                        {isEditing ? (
                                            /* ── INLINE EDIT FORM ── */
                                            <div className="space-y-4 animate-in fade-in duration-200">
                                                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                                                    <span className="text-xs font-mono font-bold text-cyan-400 uppercase flex items-center gap-1.5">
                                                        <Edit3 size={13} />
                                                        <span>Editando Perfil y Credenciales de: {u.fullName}</span>
                                                    </span>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={cancelEditing}
                                                            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono"
                                                        >
                                                            Cancelar
                                                        </button>
                                                        <button
                                                            type="button"
                                                            disabled={savingId === u.id}
                                                            onClick={() => saveInlineEdit(u.id)}
                                                            className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs font-mono uppercase flex items-center gap-1.5 shadow-md shadow-emerald-950/60"
                                                        >
                                                            {savingId === u.id ? (
                                                                <RefreshCw size={13} className="animate-spin" />
                                                            ) : (
                                                                <Save size={13} />
                                                            )}
                                                            <span>Guardar Cambios</span>
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                                                    <div>
                                                        <label className="text-[10px] font-mono text-slate-400 block mb-1">Nombres</label>
                                                        <input
                                                            type="text"
                                                            value={editFormData.name || ""}
                                                            onChange={e => setEditFormData(p => ({ ...p, name: e.target.value }))}
                                                            className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-mono text-slate-400 block mb-1">Apellidos</label>
                                                        <input
                                                            type="text"
                                                            value={editFormData.lastName || ""}
                                                            onChange={e => setEditFormData(p => ({ ...p, lastName: e.target.value }))}
                                                            className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-mono text-slate-400 block mb-1">Correo Electrónico (Login)</label>
                                                        <input
                                                            type="email"
                                                            value={editFormData.email || ""}
                                                            onChange={e => setEditFormData(p => ({ ...p, email: e.target.value }))}
                                                            className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-cyan-300 font-mono focus:outline-none focus:border-cyan-400"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-mono text-amber-400 font-bold block mb-1 flex items-center gap-1">
                                                            <KeyRound size={11} />
                                                            <span>Nueva Contraseña (Plano & Hash)</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={editFormData.password || ""}
                                                            onChange={e => setEditFormData(p => ({ ...p, password: e.target.value }))}
                                                            placeholder="Escribe la nueva contraseña..."
                                                            className="w-full px-3 py-2 bg-slate-950 border border-amber-500/60 rounded-xl text-amber-300 font-mono font-bold focus:outline-none focus:border-amber-400 shadow-inner"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-mono text-slate-400 block mb-1">Rol en el Sistema</label>
                                                        <select
                                                            value={editFormData.role || "SALESPERSON"}
                                                            onChange={e => setEditFormData(p => ({ ...p, role: e.target.value }))}
                                                            className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                                                        >
                                                            <option value="SALESPERSON">Vendedor / Comercial (SALESPERSON)</option>
                                                            <option value="COORDINATOR">Coordinador (COORDINATOR)</option>
                                                            <option value="COORDINATOR,SALESPERSON">Coordinador + Ventas</option>
                                                            <option value="ADMIN">SuperAdmin / Propietario (ADMIN)</option>
                                                            <option value="MANAGEMENT">Gerencia / Software (MANAGEMENT)</option>
                                                            <option value="TECNICO">Técnico Instalador (TECNICO)</option>
                                                            <option value="USER">Diseño / Edición (USER)</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-mono text-slate-400 block mb-1">Teléfono / WhatsApp</label>
                                                        <input
                                                            type="text"
                                                            value={editFormData.phoneNumber || ""}
                                                            onChange={e => setEditFormData(p => ({ ...p, phoneNumber: e.target.value }))}
                                                            placeholder="099xxxxxxx"
                                                            className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            /* ── NORMAL CARD VIEW ── */
                                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                                {/* User Info */}
                                                <div className="flex items-center gap-3 min-w-[220px]">
                                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white font-black text-sm shrink-0 shadow-md">
                                                        {u.name ? u.name[0].toUpperCase() : "U"}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-bold text-white text-sm leading-tight">
                                                                {u.fullName}
                                                            </span>
                                                            <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
                                                                u.role.includes("ADMIN") ? "bg-purple-500/20 text-purple-300 border border-purple-500/40" :
                                                                u.role.includes("COORDINAT") ? "bg-blue-500/20 text-blue-300 border border-blue-500/40" :
                                                                "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                                                            }`}>
                                                                {u.role}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5 font-mono">
                                                            {u.cedula && <span>CI: {u.cedula}</span>}
                                                            {u.phoneNumber && <span>📱 {u.phoneNumber}</span>}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Credentials Boxes: Email & Password */}
                                                <div className="flex-1 w-full md:w-auto grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                                                    {/* Email Box */}
                                                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/90 border border-white/10 gap-2">
                                                        <div className="flex items-center gap-2 overflow-hidden">
                                                            <Mail size={13} className="text-cyan-400 shrink-0" />
                                                            <span className="text-slate-200 truncate select-all">{u.email}</span>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleCopy(u.email, `email_${u.id}`)}
                                                            className="p-1 rounded-lg hover:bg-white/10 text-cyan-400 transition-colors shrink-0"
                                                            title="Copiar Correo"
                                                        >
                                                            {copiedKey === `email_${u.id}` ? (
                                                                <Check size={14} className="text-emerald-400" />
                                                            ) : (
                                                                <Copy size={14} />
                                                            )}
                                                        </button>
                                                    </div>

                                                    {/* Password Box */}
                                                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/90 border border-amber-500/30 gap-2">
                                                        <div className="flex items-center gap-2 overflow-hidden">
                                                            <Lock size={13} className="text-amber-400 shrink-0" />
                                                            <span className="text-amber-300 font-bold truncate select-all">
                                                                {isPasswordVisible ? u.password : "••••••••••••"}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-1 shrink-0">
                                                            <button
                                                                type="button"
                                                                onClick={() => togglePasswordVisibility(u.id)}
                                                                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                                                                title={isPasswordVisible ? "Ocultar clave" : "Revelar clave"}
                                                            >
                                                                {isPasswordVisible ? <EyeOff size={14} /> : <Eye size={14} />}
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleCopy(u.password, `pass_${u.id}`)}
                                                                className="p-1 rounded-lg hover:bg-white/10 text-amber-400 transition-colors"
                                                                title="Copiar Contraseña"
                                                            >
                                                                {copiedKey === `pass_${u.id}` ? (
                                                                    <Check size={14} className="text-emerald-400" />
                                                                ) : (
                                                                    <Copy size={14} />
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Action Buttons: Copiar Ficha & Editar */}
                                                <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleCopyFullAccess(u)}
                                                        className="px-3 py-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                                                        title="Copiar credenciales completas formateadas para WhatsApp"
                                                    >
                                                        {copiedKey === `full_${u.id}` ? (
                                                            <Check size={13} className="text-emerald-400" />
                                                        ) : (
                                                            <Smartphone size={13} />
                                                        )}
                                                        <span className="hidden sm:inline">Copiar Ficha</span>
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => startEditing(u)}
                                                        className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-mono font-black uppercase flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                                                        title="Editar correo, contraseña y datos de este usuario"
                                                    >
                                                        <Edit3 size={13} />
                                                        <span>Editar</span>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )
                            })
                        )}
                    </div>

                    {/* Modal Footer */}
                    <div className="p-4 border-t border-white/10 bg-slate-950/80 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-slate-400 gap-2 shrink-0">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span>Total de colaboradores registrados: <strong>{users.length}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-500">Clave Universal de Emergencia:</span>
                            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-300 font-bold">
                                atomic2026
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Sub-Modal: Create New User */}
                {showCreateModal && (
                    <div className="fixed inset-0 z-70 flex items-center justify-center p-4">
                        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
                        <div className="relative z-10 w-full max-w-md bg-[#090e1f] border border-emerald-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
                            <div className="flex items-center justify-between border-b border-white/10 pb-3">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                                        <Plus size={18} />
                                    </div>
                                    <h3 className="text-base font-black text-white uppercase">Registrar Nuevo Colaborador</h3>
                                </div>
                                <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">
                                    <X size={18} />
                                </button>
                            </div>

                            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
                                <div>
                                    <label className="text-[10px] font-mono text-slate-400 block mb-1">Nombres</label>
                                    <input
                                        type="text"
                                        required
                                        value={createFormData.name}
                                        onChange={e => setCreateFormData(p => ({ ...p, name: e.target.value }))}
                                        placeholder="Ej: David Esteban"
                                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-mono text-slate-400 block mb-1">Apellidos</label>
                                    <input
                                        type="text"
                                        value={createFormData.lastName}
                                        onChange={e => setCreateFormData(p => ({ ...p, lastName: e.target.value }))}
                                        placeholder="Ej: Miranda Lopez"
                                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-mono text-slate-400 block mb-1">Correo Electrónico (Login)</label>
                                    <input
                                        type="email"
                                        required
                                        value={createFormData.email}
                                        onChange={e => setCreateFormData(p => ({ ...p, email: e.target.value }))}
                                        placeholder="usuario@atomic.com.ec o gmail"
                                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-cyan-300 font-mono focus:outline-none focus:border-cyan-400"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-mono text-amber-400 font-bold block mb-1">Contraseña Inicial</label>
                                    <input
                                        type="text"
                                        required
                                        value={createFormData.password}
                                        onChange={e => setCreateFormData(p => ({ ...p, password: e.target.value }))}
                                        placeholder="Ej: Atomic2026 o clave segura"
                                        className="w-full px-3 py-2 bg-slate-950 border border-amber-500/50 rounded-xl text-amber-300 font-mono font-bold focus:outline-none focus:border-amber-400"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-mono text-slate-400 block mb-1">Rol</label>
                                    <select
                                        value={createFormData.role}
                                        onChange={e => setCreateFormData(p => ({ ...p, role: e.target.value }))}
                                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                                    >
                                        <option value="SALESPERSON">Vendedor / Comercial</option>
                                        <option value="COORDINATOR">Coordinador Operativo</option>
                                        <option value="ADMIN">SuperAdmin</option>
                                        <option value="TECNICO">Técnico Instalador</option>
                                        <option value="USER">Diseño / Edición</option>
                                    </select>
                                </div>

                                <div className="pt-2 flex items-center justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateModal(false)}
                                        className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-mono"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={creating}
                                        className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-black font-mono uppercase shadow-md flex items-center gap-1.5"
                                    >
                                        {creating ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                                        <span>Crear Colaborador</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AnimatePresence>
    )
}
