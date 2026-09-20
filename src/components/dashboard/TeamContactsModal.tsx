"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    X, Users, Search, Phone, MessageSquare, Mail, 
    UserPlus, Shield, Sparkles, Check, ExternalLink 
} from "lucide-react"

interface TeamUser {
    id: string
    name: string | null
    email: string
    role: string
    status: string
    phoneNumber?: string | null
    profilePicture?: string | null
    profileData?: string | null
}

export default function TeamContactsModal({
    isOpen,
    onClose
}: {
    isOpen: boolean
    onClose: () => void
}) {
    const [team, setTeam] = useState<TeamUser[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [selectedRole, setSelectedRole] = useState("ALL")
    const [showNewContactForm, setShowNewContactForm] = useState(false)
    const [newContact, setNewContact] = useState({ name: "", phone: "", email: "", role: "ASESOR" })
    const [savedSuccess, setSavedSuccess] = useState(false)

    useEffect(() => {
        if (!isOpen) return
        fetchTeam()
    }, [isOpen])

    const fetchTeam = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/admin/users?status=APPROVED")
            if (res.ok) {
                const data = await res.json()
                setTeam(data.users || [])
            }
        } catch (err) {
            console.error("Error fetching team:", err)
        } finally {
            setLoading(false)
        }
    }

    const handleCreateQuickContact = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newContact.name || !newContact.phone) return

        const customUser: TeamUser = {
            id: `temp-${Date.now()}`,
            name: newContact.name,
            email: newContact.email || `${newContact.name.toLowerCase().replace(/\s+/g, '')}@atomic.shop`,
            role: newContact.role,
            status: "APPROVED",
            phoneNumber: newContact.phone
        }

        setTeam(prev => [customUser, ...prev])
        setShowNewContactForm(false)
        setNewContact({ name: "", phone: "", email: "", role: "ASESOR" })
        setSavedSuccess(true)
        setTimeout(() => setSavedSuccess(false), 3000)
    }

    const filteredTeam = team.filter(user => {
        const matchesSearch = (user.name || "").toLowerCase().includes(search.toLowerCase()) ||
            (user.email || "").toLowerCase().includes(search.toLowerCase()) ||
            (user.phoneNumber || "").includes(search)
        
        const matchesRole = selectedRole === "ALL" || (user.role || "").toUpperCase().includes(selectedRole)
        return matchesSearch && matchesRole
    })

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/85 backdrop-blur-md">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    className="w-full sm:max-w-2xl bg-slate-900 border border-slate-800 sm:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col max-h-[88vh] overflow-hidden"
                >
                    {/* Header */}
                    <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                                <Users size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-base">Directorio de Compañeros</h3>
                                <p className="text-xs text-slate-400">Equipo ATOMIC • Contactos directos y WhatsApp</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setShowNewContactForm(!showNewContactForm)}
                                className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center gap-1.5 transition-all"
                            >
                                <UserPlus size={14} />
                                <span className="hidden sm:inline">Agregar Contacto</span>
                            </button>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Quick Add Form */}
                    {showNewContactForm && (
                        <motion.form
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            onSubmit={handleCreateQuickContact}
                            className="p-4 bg-slate-950 border-b border-cyan-500/30 space-y-3"
                        >
                            <p className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                                <Sparkles size={13} /> Agregar Contacto Rápido al Directorio
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <input
                                    type="text"
                                    placeholder="Nombre completo..."
                                    required
                                    value={newContact.name}
                                    onChange={e => setNewContact({ ...newContact, name: e.target.value })}
                                    className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 outline-none focus:border-cyan-400"
                                />
                                <input
                                    type="text"
                                    placeholder="Teléfono / WhatsApp (ej: 0991234567)..."
                                    required
                                    value={newContact.phone}
                                    onChange={e => setNewContact({ ...newContact, phone: e.target.value })}
                                    className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 outline-none focus:border-cyan-400"
                                />
                                <input
                                    type="email"
                                    placeholder="Correo electrónico (opcional)..."
                                    value={newContact.email}
                                    onChange={e => setNewContact({ ...newContact, email: e.target.value })}
                                    className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 outline-none focus:border-cyan-400"
                                />
                                <select
                                    value={newContact.role}
                                    onChange={e => setNewContact({ ...newContact, role: e.target.value })}
                                    className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                                >
                                    <option value="ASESOR">Asesor Comercial</option>
                                    <option value="COORDINADOR">Coordinador</option>
                                    <option value="TECNICO">Servicio Técnico</option>
                                    <option value="SUPERVISOR">Supervisor</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-2 pt-1">
                                <button
                                    type="button"
                                    onClick={() => setShowNewContactForm(false)}
                                    className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-xs"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                                >
                                    Guardar
                                </button>
                            </div>
                        </motion.form>
                    )}

                    {savedSuccess && (
                        <div className="p-3 bg-emerald-500/10 border-b border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2">
                            <Check size={14} className="text-emerald-400" /> Contacto guardado correctamente en la sesión.
                        </div>
                    )}

                    {/* Search & Filter Bar */}
                    <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Buscar compañero por nombre, email o teléfono..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-slate-500 outline-none focus:border-cyan-400/60"
                            />
                        </div>
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                            {["ALL", "SALES", "COORD", "TECH", "ADMIN"].map(r => (
                                <button
                                    key={r}
                                    onClick={() => setSelectedRole(r)}
                                    className={`px-3 py-1.5 rounded-xl text-[10px] font-mono font-bold tracking-wider uppercase transition-all whitespace-nowrap ${
                                        selectedRole === r
                                            ? "bg-cyan-500 text-slate-950"
                                            : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                                    }`}
                                >
                                    {r === "ALL" ? "Todos" : r}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Directory List */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {loading ? (
                            <div className="py-16 text-center text-slate-500 text-xs font-mono">
                                Cargando compañeros del equipo...
                            </div>
                        ) : filteredTeam.length === 0 ? (
                            <div className="py-16 text-center space-y-2">
                                <Users size={32} className="mx-auto text-slate-600 opacity-50" />
                                <p className="text-slate-400 text-xs">No se encontraron compañeros con ese criterio.</p>
                            </div>
                        ) : (
                            filteredTeam.map(user => {
                                const cleanPhone = (user.phoneNumber || "").replace(/\D/g, "")
                                const waUrl = cleanPhone ? `https://wa.me/${cleanPhone.startsWith('0') ? '593' + cleanPhone.substring(1) : cleanPhone}` : null
                                const firstLetter = (user.name || user.email)?.[0]?.toUpperCase() || "A"

                                return (
                                    <div
                                        key={user.id}
                                        className="p-3.5 bg-slate-950/60 border border-slate-800/80 hover:border-cyan-500/40 rounded-2xl flex items-center justify-between gap-3 transition-all"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center font-bold text-cyan-300 text-sm shrink-0 overflow-hidden">
                                                {user.profilePicture ? (
                                                    <img src={user.profilePicture} alt="User" className="w-full h-full object-cover" />
                                                ) : (
                                                    firstLetter
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="text-white font-bold text-xs truncate">{user.name || "Usuario ATOMIC"}</h4>
                                                    <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-300 text-[9px] font-mono uppercase shrink-0">
                                                        {user.role}
                                                    </span>
                                                </div>
                                                <p className="text-[11px] text-slate-400 truncate mt-0.5">{user.email}</p>
                                                {user.phoneNumber && (
                                                    <p className="text-[10px] text-cyan-400/80 font-mono mt-0.5 flex items-center gap-1">
                                                        <Phone size={10} /> {user.phoneNumber}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 shrink-0">
                                            {waUrl ? (
                                                <a
                                                    href={waUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs flex items-center gap-1 transition-all"
                                                    title="Chatear por WhatsApp"
                                                >
                                                    <MessageSquare size={14} />
                                                    <span className="hidden sm:inline font-bold">WhatsApp</span>
                                                </a>
                                            ) : null}

                                            {user.email ? (
                                                <a
                                                    href={`mailto:${user.email}`}
                                                    className="p-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs flex items-center transition-all"
                                                    title="Enviar correo"
                                                >
                                                    <Mail size={14} />
                                                </a>
                                            ) : null}
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-3 border-t border-slate-800 bg-slate-950/80 text-center">
                        <span className="text-[10px] text-slate-500 font-mono">
                            Mostrando {filteredTeam.length} de {team.length} miembros activos en ATOMIC
                        </span>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}
