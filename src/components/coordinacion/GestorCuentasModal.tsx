"use client"

import React, { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    KeyRound, Plus, Trash2, Eye, EyeOff, Copy, Check, 
    X, Shield, User, Globe, Search, RefreshCw, Sparkles, 
    ExternalLink, AlertCircle, CheckCircle2, UserCheck, Layers, FileText
} from "lucide-react"

interface GestorCuentasModalProps {
    isOpen: boolean
    onClose: () => void
}

const POPULAR_PLATFORMS = [
    "Facebook Marketplace",
    "Google Maps (Prospección)",
    "TikTok Ads / Orgánico",
    "WhatsApp Business",
    "Instagram Comercial",
    "Correo Corporativo (@atomic)",
    "Mercado Libre",
    "Canva Pro / Diseño",
    "ChatGPT Plus / IA",
    "Hosting / Cloud"
]

export default function GestorCuentasModal({
    isOpen,
    onClose
}: GestorCuentasModalProps) {
    const [loading, setLoading] = useState(true)
    const [accounts, setAccounts] = useState<any[]>([])
    const [users, setUsers] = useState<any[]>([])
    const [search, setSearch] = useState("")
    const [filterPlatform, setFilterPlatform] = useState("ALL")

    // Show/hide passwords map
    const [showPasswordMap, setShowPasswordMap] = useState<Record<string, boolean>>({})
    const [copiedId, setCopiedId] = useState<string | null>(null)

    // Form: Create Account
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        platform: POPULAR_PLATFORMS[0],
        customPlatform: "",
        cedula: "",
        email: "",
        password: "",
        isAssigned: false,
        assignedUserId: "",
        notes: ""
    })

    const fetchAccounts = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/admin/managed-accounts")
            const data = await res.json()
            if (data.success) {
                setAccounts(data.accounts || [])
                setUsers(data.users || [])
                if (data.users && data.users.length > 0 && !formData.assignedUserId) {
                    setFormData(prev => ({ ...prev, assignedUserId: data.users[0].id }))
                }
            }
        } catch (e) {
            console.error("Error fetching accounts:", e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (isOpen) {
            fetchAccounts()
        }
    }, [isOpen])

    const handleTogglePassword = (id: string) => {
        setShowPasswordMap(prev => ({ ...prev, [id]: !prev[id] }))
    }

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
    }

    const handleCopyAllCredentials = (acc: any) => {
        const text = `🔐 *CREDENCIALES ATOMIC — ${acc.platform.toUpperCase()}*
📧 Correo: ${acc.email}
🔑 Contraseña: ${acc.password}
${acc.cedula ? `🪪 Cédula/CI: ${acc.cedula}` : ''}
${acc.assignedUserName ? `👤 Asignada a: ${acc.assignedUserName}` : ''}
${acc.notes ? `📝 Notas: ${acc.notes}` : ''}`

        navigator.clipboard.writeText(text)
        setCopiedId(`full_${acc.id}`)
        setTimeout(() => setCopiedId(null), 2000)
    }

    const handleCreateAccount = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)

        const finalPlatform = formData.platform === "OTRA" 
            ? formData.customPlatform.trim() 
            : formData.platform

        if (!finalPlatform) {
            alert("Debes indicar una plataforma válida.")
            setSubmitting(false)
            return
        }

        try {
            const res = await fetch("/api/admin/managed-accounts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "create",
                    platform: finalPlatform,
                    cedula: formData.cedula,
                    email: formData.email,
                    password: formData.password,
                    isAssigned: formData.isAssigned,
                    assignedUserId: formData.isAssigned ? formData.assignedUserId : undefined,
                    notes: formData.notes
                })
            })

            const data = await res.json()
            if (data.success) {
                setShowCreateForm(false)
                setFormData({
                    platform: POPULAR_PLATFORMS[0],
                    customPlatform: "",
                    cedula: "",
                    email: "",
                    password: "",
                    isAssigned: false,
                    assignedUserId: users[0]?.id || "",
                    notes: ""
                })
                await fetchAccounts()
            } else {
                alert(data.error || "Error al crear cuenta")
            }
        } catch (e: any) {
            alert(e.message || "Error en la petición")
        } finally {
            setSubmitting(false)
        }
    }

    const handleDeleteAccount = async (id: string) => {
        if (!confirm("¿Estás seguro de eliminar esta cuenta del gestor?")) return
        try {
            const res = await fetch("/api/admin/managed-accounts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "delete", accountId: id })
            })
            const data = await res.json()
            if (data.success) {
                await fetchAccounts()
            }
        } catch (e) {
            console.error("Error deleting account:", e)
        }
    }

    // Filter accounts
    const filteredAccounts = useMemo(() => {
        return accounts.filter(acc => {
            const matchesSearch = 
                acc.platform.toLowerCase().includes(search.toLowerCase()) ||
                acc.email.toLowerCase().includes(search.toLowerCase()) ||
                (acc.cedula && acc.cedula.includes(search)) ||
                (acc.assignedUserName && acc.assignedUserName.toLowerCase().includes(search.toLowerCase()))

            const matchesPlatform = filterPlatform === "ALL" || acc.platform === filterPlatform
            return matchesSearch && matchesPlatform
        })
    }, [accounts, search, filterPlatform])

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
                />

                {/* Main Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.96, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: 20 }}
                    className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-gradient-to-b from-[#0b1229] via-[#070b1a] to-[#04060f] border border-amber-500/40 rounded-[28px] shadow-[0_0_80px_rgba(245,158,11,0.2)] text-white overflow-hidden z-10"
                >
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/30 backdrop-blur-md shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-black font-black shadow-lg shadow-amber-500/30">
                                <KeyRound size={22} className="stroke-[2.5]" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-mono font-black text-amber-400 uppercase tracking-widest flex items-center gap-1">
                                        <Shield size={12} />
                                        <span>Custodia de Accesos & Cuentas Oficiales</span>
                                    </span>
                                    <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-white/10 text-slate-300">
                                        {accounts.length} Cuentas Registradas
                                    </span>
                                </div>
                                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                                    Gestor de Cuentas del Sistema
                                </h2>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setShowCreateForm(prev => !prev)}
                                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-amber-500/25 transition-all cursor-pointer"
                            >
                                <Plus size={16} strokeWidth={3} />
                                <span>{showCreateForm ? "Cerrar Formulario" : "Crear Cuenta"}</span>
                            </button>

                            <button
                                onClick={onClose}
                                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">

                        {/* ── FORMULARIO CREAR CUENTA (EXPANDIBLE) ── */}
                        <AnimatePresence>
                            {showCreateForm && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <form onSubmit={handleCreateAccount} className="p-5 sm:p-6 rounded-3xl bg-white/5 border border-amber-500/40 space-y-4 shadow-xl">
                                        <div className="flex items-center justify-between border-b border-white/10 pb-2">
                                            <div className="flex items-center gap-2">
                                                <Sparkles size={16} className="text-amber-400" />
                                                <span className="font-mono font-black text-xs text-white uppercase tracking-wider">
                                                    Registrar Nueva Cuenta de Plataforma
                                                </span>
                                            </div>
                                            <span className="text-[10px] text-slate-400">Campos obligatorios *</span>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                                            {/* Plataforma */}
                                            <div>
                                                <label className="text-slate-300 block mb-1 font-bold">Plataforma *:</label>
                                                <select
                                                    value={formData.platform}
                                                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                                                    className="w-full px-3 py-2 rounded-xl bg-[#080d1f] border border-white/15 text-white focus:outline-none focus:border-amber-400"
                                                >
                                                    {POPULAR_PLATFORMS.map(p => (
                                                        <option key={p} value={p}>{p}</option>
                                                    ))}
                                                    <option value="OTRA">+ Otra plataforma...</option>
                                                </select>
                                                {formData.platform === "OTRA" && (
                                                    <input
                                                        type="text"
                                                        placeholder="Escribe la plataforma..."
                                                        required
                                                        value={formData.customPlatform}
                                                        onChange={(e) => setFormData({ ...formData, customPlatform: e.target.value })}
                                                        className="w-full mt-2 px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-amber-400"
                                                    />
                                                )}
                                            </div>

                                            {/* Cédula / CI */}
                                            <div>
                                                <label className="text-slate-300 block mb-1 font-bold">CI / Cédula Vinculada:</label>
                                                <input
                                                    type="text"
                                                    placeholder="Ej: 0928374651"
                                                    value={formData.cedula}
                                                    onChange={(e) => setFormData({ ...formData, cedula: e.target.value })}
                                                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-amber-400 font-mono"
                                                />
                                            </div>

                                            {/* Correo Electrónico */}
                                            <div>
                                                <label className="text-slate-300 block mb-1 font-bold">Correo de la Cuenta *:</label>
                                                <input
                                                    type="email"
                                                    required
                                                    placeholder="usuario@dominio.com"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-amber-400"
                                                />
                                            </div>

                                            {/* Contraseña */}
                                            <div>
                                                <label className="text-slate-300 block mb-1 font-bold">Contraseña *:</label>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="Contraseña de la cuenta"
                                                    value={formData.password}
                                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-amber-400 font-mono"
                                                />
                                            </div>
                                        </div>

                                        {/* Checkbox: ¿Está designada o no? */}
                                        <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="checkbox"
                                                    id="isAssignedCheck"
                                                    checked={formData.isAssigned}
                                                    onChange={(e) => setFormData({ ...formData, isAssigned: e.target.checked })}
                                                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 cursor-pointer"
                                                />
                                                <label htmlFor="isAssignedCheck" className="text-xs font-bold text-white cursor-pointer select-none">
                                                    ¿Esta cuenta está designada / delegada a un colaborador específico?
                                                </label>
                                            </div>

                                            {/* Si pongo SI, sale la lista de usuarios del sistema */}
                                            {formData.isAssigned && (
                                                <div className="pt-2 border-t border-white/10 space-y-1.5">
                                                    <label className="text-xs text-amber-300 font-bold block">
                                                        Delegar cuenta al usuario del sistema (Custodia teórica):
                                                    </label>
                                                    <select
                                                        value={formData.assignedUserId}
                                                        onChange={(e) => setFormData({ ...formData, assignedUserId: e.target.value })}
                                                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#090e24] border border-amber-500/40 text-white text-xs font-medium focus:outline-none focus:border-amber-400"
                                                    >
                                                        {users.map(u => (
                                                            <option key={u.id} value={u.id}>
                                                                {u.name} {u.lastName || ""} • {u.email} ({u.role})
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}
                                        </div>

                                        {/* Notas opcionales */}
                                        <div className="text-xs">
                                            <label className="text-slate-400 block mb-1">Notas / Observaciones de la cuenta (Opcional):</label>
                                            <input
                                                type="text"
                                                placeholder="Ej: Cuenta configurada para Marketplace Norte, chip 098..., etc."
                                                value={formData.notes}
                                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-amber-400"
                                            />
                                        </div>

                                        {/* Submit Action */}
                                        <div className="flex items-center justify-end gap-3 pt-2">
                                            <button
                                                type="button"
                                                onClick={() => setShowCreateForm(false)}
                                                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold"
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={submitting}
                                                className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-950/50 cursor-pointer"
                                            >
                                                {submitting ? <RefreshCw size={14} className="animate-spin" /> : <Plus size={14} />}
                                                <span>Guardar y Registrar Cuenta</span>
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* ── BARRA DE BÚSQUEDA Y FILTRO ── */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                            <div className="relative w-full sm:w-80">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar por plataforma, correo, cédula o asesor..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-xs"
                                />
                            </div>

                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <span className="text-slate-400 text-xs whitespace-nowrap">Plataforma:</span>
                                <select
                                    value={filterPlatform}
                                    onChange={(e) => setFilterPlatform(e.target.value)}
                                    className="px-3 py-2 rounded-xl bg-[#080d1f] border border-white/15 text-white text-xs focus:outline-none focus:border-amber-400"
                                >
                                    <option value="ALL">Todas las plataformas</option>
                                    {POPULAR_PLATFORMS.map(p => (
                                        <option key={p} value={p}>{p}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* ── LISTADO / TABLA DE CUENTAS ── */}
                        {loading ? (
                            <div className="text-center py-20 text-slate-400 text-xs flex flex-col items-center gap-2">
                                <RefreshCw size={20} className="animate-spin text-amber-400" />
                                <span>Cargando gestor de cuentas...</span>
                            </div>
                        ) : filteredAccounts.length === 0 ? (
                            <div className="text-center py-16 p-8 rounded-3xl bg-white/5 border border-white/10 space-y-3">
                                <KeyRound size={36} className="mx-auto text-slate-600" />
                                <h3 className="text-base font-bold text-white">No hay cuentas registradas</h3>
                                <p className="text-xs text-slate-400 max-w-md mx-auto">
                                    Utiliza el botón superior "Crear Cuenta" para registrar plataformas de Facebook, Maps, correos o TikTok y delegarlas a colaboradores.
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-3">
                                {filteredAccounts.map(acc => {
                                    const isRevealed = Boolean(showPasswordMap[acc.id])
                                    const isCopied = copiedId === acc.id
                                    const isFullCopied = copiedId === `full_${acc.id}`

                                    return (
                                        <div
                                            key={acc.id}
                                            className="p-4 sm:p-5 rounded-2xl bg-white/5 hover:bg-white/[0.07] border border-white/10 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                                        >
                                            {/* Platform & Details */}
                                            <div className="flex items-start gap-3.5">
                                                <div className="w-11 h-11 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                                                    <Globe size={20} />
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="font-black text-sm text-white">
                                                            {acc.platform}
                                                        </span>
                                                        {acc.cedula && (
                                                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                                                                CI: {acc.cedula}
                                                            </span>
                                                        )}
                                                        {acc.isAssigned ? (
                                                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                                                                <UserCheck size={11} />
                                                                <span>Delegada a: {acc.assignedUserName || "Colaborador"}</span>
                                                            </span>
                                                        ) : (
                                                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-700/50 text-slate-400">
                                                                Disponible / Sin Asignar
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Email and Password credentials */}
                                                    <div className="flex items-center gap-3 text-xs flex-wrap">
                                                        <span className="text-slate-300 font-mono flex items-center gap-1.5">
                                                            <strong>Email:</strong> {acc.email}
                                                        </span>
                                                        <span className="text-slate-400">•</span>
                                                        <div className="flex items-center gap-1.5 font-mono">
                                                            <strong className="text-slate-300">Clave:</strong>
                                                            <span className="text-amber-300">
                                                                {isRevealed ? acc.password : "••••••••••••"}
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleTogglePassword(acc.id)}
                                                                className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                                                                title={isRevealed ? "Ocultar clave" : "Ver clave"}
                                                            >
                                                                {isRevealed ? <EyeOff size={13} /> : <Eye size={13} />}
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleCopy(acc.password, acc.id)}
                                                                className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                                                                title="Copiar contraseña"
                                                            >
                                                                {isCopied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {acc.notes && (
                                                        <div className="text-[11px] text-slate-400 italic">
                                                            📝 {acc.notes}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Action buttons */}
                                            <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                                                <button
                                                    type="button"
                                                    onClick={() => handleCopyAllCredentials(acc)}
                                                    className="py-1.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                                                    title="Copiar datos completos para enviar por WhatsApp"
                                                >
                                                    {isFullCopied ? (
                                                        <>
                                                            <Check size={13} className="text-emerald-400" />
                                                            <span className="text-emerald-400">¡Copiado!</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Copy size={13} />
                                                            <span>Copiar WhatsApp</span>
                                                        </>
                                                    )}
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteAccount(acc.id)}
                                                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/25 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                                                    title="Eliminar cuenta del gestor"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}
