"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Users, 
    Briefcase,
    ShieldCheck,
    ChevronRight,
    ChevronLeft,
    Save,
    LayoutGrid,
    CheckCircle2,
    Clock,
    FileText,
    Target,
    Zap,
    Plus,
    X,
    UserPlus,
    Building2,
    Award,
    ShieldOff,
    Key,
    Trash2,
    Search
} from "lucide-react"
import { getJobProfile, upsertJobProfile } from "@/lib/actions/jobProfiles"
import { useSession } from "next-auth/react"

export default function JobProfilesPage() {
    const { data: session } = useSession()
    const role = session?.user?.role
    const isAdmin = role === "ADMIN" || role === "MANAGEMENT"

    const [view, setView] = useState<"list" | "editor" | "template">("list")
    const [selectedUser, setSelectedUser] = useState<any>(null)
    const [profile, setProfile] = useState<any>(null)
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")

    const toggleUserStatus = async (userId: string, currentIsActive: boolean, currentStatus: string = "APPROVED") => {
        const isPending = currentStatus === "PENDING";
        const newIsActive = isPending ? true : !currentIsActive;
        const action = isPending ? 'aprobar' : (currentIsActive ? 'desactivar' : 'activar');
        if (!confirm(`¿Desea ${action} el acceso de este asesor?`)) return
        try {
            const res = await fetch(`/api/admin/users/${userId}`, {
                method: "PATCH",
                body: JSON.stringify({ isActive: newIsActive, status: "APPROVED" })
            })
            if (res.ok) loadUsers()
        } catch (e) { console.error(e) }
    }

    const approveReset = async (userId: string) => {
        if (!confirm("¿Autorizar generación de código de reseteo temporal? Esto cambiará la contraseña del asesor.")) return
        try {
            const res = await fetch(`/api/admin/users/${userId}`, {
                method: "PATCH",
                body: JSON.stringify({ approveReset: true })
            })
            if (res.ok) {
                const data = await res.json()
                alert(`Código temporal generado: ${data.user.tempResetCode}`)
                loadUsers()
            }
        } catch (e) { console.error(e) }
    }

    const deleteUser = async (userId: string) => {
        if (!confirm("¿Está seguro de eliminar este asesor? Esta acción es irreversible y borrará todos sus perfiles asociados.")) return
        try {
            const res = await fetch(`/api/admin/users/${userId}`, {
                method: "DELETE"
            })
            if (res.ok) loadUsers()
        } catch (e) { console.error(e) }
    }

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        skills: [] as string[],
        responsibilities: [] as string[],
        benefits: [] as string[],
        templateName: "Estándar Corporativo Atomic"
    })

    const [newItem, setNewItem] = useState({ type: "", value: "" })

    useEffect(() => {
        if (isAdmin) {
            loadUsers()
        } else if (session?.user?.id) {
            loadOwnProfile()
        }
    }, [isAdmin, session])

    const loadUsers = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/admin/users?status=ALL")
            const data = await res.json()
            setUsers(data.users || [])
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const loadOwnProfile = async () => {
        if (!session?.user?.id) return
        setLoading(true)
        try {
            const data = await getJobProfile(session.user.id)
            if (data) {
                setProfile(data)
                setFormData({
                    title: data.title,
                    description: data.description || "",
                    skills: JSON.parse(data.skills || "[]"),
                    responsibilities: JSON.parse(data.responsibilities || "[]"),
                    benefits: JSON.parse(data.benefits || "[]"),
                    templateName: data.templateName || "Estándar Corporativo Atomic"
                })
                setView("editor")
            } else {
                setView("template")
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleSelectUser = async (user: any) => {
        setSelectedUser(user)
        setLoading(true)
        const data = await getJobProfile(user.id)
        if (data) {
            setProfile(data)
            setFormData({
                title: data.title,
                description: data.description || "",
                skills: JSON.parse(data.skills || "[]"),
                responsibilities: JSON.parse(data.responsibilities || "[]"),
                benefits: JSON.parse(data.benefits || "[]"),
                templateName: data.templateName || "Estándar Corporativo Atomic"
            })
        } else {
            setProfile(null)
            setFormData({
                title: user.role,
                description: "",
                skills: [],
                responsibilities: [],
                benefits: [],
                templateName: "Estándar Corporativo Atomic"
            })
        }
        setLoading(false)
        setView("editor")
    }

    const handleSave = async () => {
        const targetId = isAdmin ? selectedUser?.id : session?.user?.id
        if (!targetId) return
        
        setLoading(true)
        const res = await upsertJobProfile(targetId, formData)
        if (res.success) {
            setProfile(res.profile)
            if (isAdmin) setView("list")
        }
        setLoading(false)
    }

    const addItem = (type: "skills" | "responsibilities" | "benefits") => {
        if (!newItem.value) return
        setFormData(prev => ({
            ...prev,
            [type]: [...prev[type as keyof typeof prev] as string[], newItem.value]
        }))
        setNewItem({ type: "", value: "" })
    }

    const removeItem = (type: "skills" | "responsibilities" | "benefits", index: number) => {
        setFormData(prev => ({
            ...prev,
            [type]: (prev[type as keyof typeof prev] as string[]).filter((_, i) => i !== index)
        }))
    }

    const filteredUsers = users.filter((u: any) => 
        ((u.name || u.email) as string).toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-8 pb-32 animate-in fade-in duration-500 font-sans">

            {/* Header */}
            <header className="flex flex-col lg:flex-row lg:items-end justify-between border-b border-slate-800 pb-6 relative z-10 gap-6">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-widest mb-1">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                        <span>TALENTO HUMANO · ATOMIC HQ</span>
                    </div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-3 uppercase tracking-tight">
                        <Briefcase className="text-indigo-400" /> Directorio de Asesores & RRHH
                    </h1>
                    <p className="text-xs text-slate-400 font-mono mt-1 max-w-xl">
                        Gestión de fichas técnicas, competencias, permisos y accesos operativos del equipo.
                    </p>
                </motion.div>

                {isAdmin && view !== "list" && (
                    <button
                        onClick={() => setView("list")}
                        className="bg-slate-900 border border-slate-700 text-slate-200 px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg cursor-pointer"
                    >
                        <ChevronLeft size={16} />
                        <span>Volver al Directorio</span>
                    </button>
                )}
            </header>

            {/* Quick Metrics Bar */}
            {view === "list" && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
                        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Total Asesores</span>
                        <div className="text-2xl font-black text-white mt-1">{users.length}</div>
                    </div>
                    <div className="bg-emerald-950/20 border border-emerald-500/30 p-4 rounded-2xl">
                        <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">Activos</span>
                        <div className="text-2xl font-black text-emerald-300 mt-1">
                            {users.filter((u: any) => u.isActive && u.status !== 'PENDING').length}
                        </div>
                    </div>
                    <div className="bg-amber-950/20 border border-amber-500/30 p-4 rounded-2xl">
                        <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">Pendientes</span>
                        <div className="text-2xl font-black text-amber-300 mt-1">
                            {users.filter((u: any) => u.status === 'PENDING').length}
                        </div>
                    </div>
                    <div className="bg-rose-950/20 border border-rose-500/30 p-4 rounded-2xl">
                        <span className="text-[10px] font-mono font-bold text-rose-400 uppercase">Resets Pedidos</span>
                        <div className="text-2xl font-black text-rose-300 mt-1">
                            {users.filter((u: any) => u.resetRequested).length}
                        </div>
                    </div>
                </div>
            )}

            <AnimatePresence mode="wait">
                {view === "list" ? (
                    <motion.div 
                        key="list"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="bg-slate-900/90 border border-slate-800 shadow-2xl overflow-hidden rounded-3xl relative z-10"
                    >
                        <div className="p-6 border-b border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-950/80">
                            <div>
                                <h2 className="text-base font-black text-white uppercase tracking-wider">Directorio de Talento Humano</h2>
                                <p className="text-xs text-slate-400 mt-0.5">Seleccione un asesor para gestionar su ficha técnica o permisos</p>
                            </div>
                            <div className="relative w-full md:w-[320px]">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                <input
                                    type="text"
                                    placeholder="Buscar por nombre, correo o rol..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 text-xs font-medium text-white outline-none rounded-xl focus:border-indigo-500 transition-all placeholder:text-slate-600"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="text-[11px] font-mono text-slate-400 uppercase tracking-wider bg-slate-950/60 border-b border-slate-800">
                                    <tr>
                                        <th className="px-6 py-4">Identidad Laboral</th>
                                        <th className="px-6 py-4">Status & Seguridad</th>
                                        <th className="px-6 py-4">Accesos</th>
                                        <th className="px-6 py-4 text-right">Gestión</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/60 text-xs">
                                    {loading ? (
                                        <tr><td colSpan={4} className="px-6 py-12 text-center font-mono font-bold text-slate-500">Cargando asesores de la base de datos...</td></tr>
                                    ) : filteredUsers.length === 0 ? (
                                        <tr><td colSpan={4} className="px-6 py-12 text-center font-mono text-slate-500">No se encontraron asesores</td></tr>
                                    ) : filteredUsers.map((u: any) => (
                                        <tr key={u.id} className="hover:bg-slate-800/40 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3.5">
                                                    <div className={`w-10 h-10 bg-slate-800 border ${u.resetRequested ? 'border-rose-400' : 'border-slate-700'} flex items-center justify-center text-cyan-300 font-black text-sm rounded-xl shadow-md`}>
                                                        {u.name?.[0] || u.email?.[0]?.toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-bold text-white text-xs group-hover:text-cyan-400 transition-colors">{u.name || (u.email.split('@')[0])}</p>
                                                            {u.resetRequested && (
                                                                <span className="bg-rose-950 text-rose-400 border border-rose-500/40 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">Reset Solicitado</span>
                                                            )}
                                                        </div>
                                                        <p className="text-[11px] font-mono text-slate-400 mt-0.5">{u.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1.5">
                                                    <div className="flex items-center gap-2">
                                                        {u.status === "PENDING" ? (
                                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-950 text-amber-300 border border-amber-500/30">
                                                                Pendiente
                                                            </span>
                                                        ) : (
                                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${u.isActive ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' : 'bg-rose-950 text-rose-300 border border-rose-500/30'}`}>
                                                                {u.isActive ? 'Activo' : 'Desactivado'}
                                                            </span>
                                                        )}
                                                        <span className="text-[10px] font-mono font-bold text-cyan-300 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-md">{u.role}</span>
                                                    </div>
                                                    {u.tempResetCode && (
                                                        <div className="bg-indigo-950/60 border border-indigo-500/40 px-2 py-1 rounded-md flex items-center gap-1.5 max-w-fit">
                                                            <span className="text-[9px] font-mono text-indigo-400 uppercase">Temp Code:</span>
                                                            <span className="text-[10px] font-mono font-black text-white">{u.tempResetCode}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {u.status === "PENDING" || !u.isActive ? (
                                                    <button 
                                                        onClick={() => toggleUserStatus(u.id, u.isActive, u.status)}
                                                        className="flex items-center gap-1 bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-900 transition-all cursor-pointer"
                                                    >
                                                        <CheckCircle2 size={13} /> Aprobar
                                                    </button>
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <button 
                                                            onClick={() => toggleUserStatus(u.id, u.isActive, u.status)}
                                                            className="p-2 rounded-lg border border-slate-800 text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-all cursor-pointer"
                                                            title="Desactivar Acceso"
                                                        >
                                                            <ShieldOff size={15} />
                                                        </button>
                                                        <button 
                                                            onClick={() => approveReset(u.id)}
                                                            className={`p-2 rounded-lg border transition-all cursor-pointer ${u.resetRequested ? 'bg-rose-600 border-rose-500 text-white' : 'border-slate-800 text-slate-400 hover:text-indigo-300 hover:bg-slate-800'}`}
                                                            title="Autorizar Reseteo"
                                                        >
                                                            <Key size={15} />
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end items-center gap-2">
                                                    {u.status === "PENDING" || !u.isActive ? (
                                                        <button
                                                            onClick={() => deleteUser(u.id)}
                                                            className="flex items-center gap-1 bg-rose-950 text-rose-300 border border-rose-500/40 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-rose-900 transition-all cursor-pointer"
                                                            title="Rechazar y Eliminar"
                                                        >
                                                            <X size={13} /> Rechazar
                                                        </button>
                                                    ) : (
                                                        <>
                                                            <button
                                                                onClick={() => handleSelectUser(u)}
                                                                className="p-2 border border-slate-800 rounded-lg text-slate-300 hover:text-cyan-400 hover:bg-slate-800 transition-all cursor-pointer bg-slate-900"
                                                                title="Editar Perfil Laboral"
                                                            >
                                                                <FileText size={15} />
                                                            </button>
                                                            <button
                                                                onClick={() => deleteUser(u.id)}
                                                                className="p-2 border border-slate-800 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-all cursor-pointer bg-slate-900"
                                                                title="Eliminar Asesor"
                                                            >
                                                                <Trash2 size={15} />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="editor"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="grid grid-cols-1 xl:grid-cols-3 gap-8 relative z-10"
                    >
                        {/* Editor Form */}
                        <div className="xl:col-span-2 space-y-8">
                            <div className="bg-slate-900/90 border border-slate-800 p-8 rounded-3xl shadow-2xl overflow-hidden relative">
                                <div className="flex justify-between items-start mb-8 border-b border-slate-800 pb-6">
                                    <div>
                                        <h2 className="text-2xl font-black text-white flex items-center gap-2 uppercase">
                                            <Building2 className="text-indigo-400" size={24} /> Arquitectura de Cargo
                                        </h2>
                                        <p className="text-xs font-mono text-slate-400 mt-2">
                                            Perfil asignado a: <span className="text-cyan-300 font-bold">{isAdmin ? selectedUser?.name : session?.user?.name}</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider ml-1">Título del Perfil</label>
                                            <input 
                                                type="text"
                                                disabled={!isAdmin}
                                                value={formData.title}
                                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                                className="w-full bg-slate-950 border border-slate-800 px-4 py-3 text-xs font-bold text-white outline-none rounded-xl focus:border-indigo-500 transition-all disabled:opacity-60"
                                                placeholder="Ej: Asesor Comercial Senior"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider ml-1">Plantilla de Referencia</label>
                                            <input 
                                                type="text"
                                                disabled={!isAdmin}
                                                value={formData.templateName}
                                                onChange={(e) => setFormData({...formData, templateName: e.target.value})}
                                                className="w-full bg-slate-950 border border-indigo-500/40 px-4 py-3 text-xs font-bold text-indigo-300 outline-none rounded-xl focus:border-indigo-400 transition-all disabled:opacity-60"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider ml-1">Resumen del Perfil Laboral</label>
                                        <textarea 
                                            disabled={!isAdmin}
                                            value={formData.description}
                                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                                            className="w-full bg-slate-950 border border-slate-800 p-4 text-xs font-medium text-slate-200 outline-none rounded-xl focus:border-indigo-500 transition-all h-28 resize-none disabled:opacity-60"
                                            placeholder="Describa la misión del cargo..."
                                        />
                                    </div>

                                    {/* List Sections */}
                                    {[
                                        { id: 'skills', label: 'Competencias & Skills', color: 'text-indigo-400', bg: 'bg-indigo-950/20', border: 'border-indigo-500/30', icon: <Zap size={16} /> },
                                        { id: 'responsibilities', label: 'Responsabilidades', color: 'text-emerald-400', bg: 'bg-emerald-950/20', border: 'border-emerald-500/30', icon: <Target size={16} /> },
                                        { id: 'benefits', label: 'Beneficios', color: 'text-cyan-400', bg: 'bg-cyan-950/20', border: 'border-cyan-500/30', icon: <Award size={16} /> }
                                    ].map(section => (
                                        <div key={section.id} className="space-y-3">
                                            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                                                <div className={`flex items-center gap-2 ${section.color}`}>
                                                    {section.icon}
                                                    <h3 className="text-xs font-black uppercase tracking-wider">{section.label}</h3>
                                                </div>
                                                {isAdmin && (
                                                    <div className="flex gap-2">
                                                        <input 
                                                            type="text"
                                                            placeholder="Añadir ítem..."
                                                            value={newItem.type === section.id ? newItem.value : ""}
                                                            onChange={(e) => setNewItem({ type: section.id, value: e.target.value })}
                                                            className="bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs font-medium text-white outline-none rounded-lg focus:border-indigo-500 w-48"
                                                            onKeyDown={(e) => { if(e.key === 'Enter') addItem(section.id as any) }}
                                                        />
                                                        <button 
                                                            onClick={() => addItem(section.id as any)}
                                                            className="bg-slate-800 text-slate-200 p-1.5 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
                                                        >
                                                            <Plus size={16} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                                {formData[section.id as keyof typeof formData] instanceof Array && (formData[section.id as keyof typeof formData] as string[]).map((item, i) => (
                                                    <motion.div 
                                                        layout
                                                        key={i} 
                                                        className={`flex items-start justify-between p-3 ${section.bg} border ${section.border} rounded-xl group`}
                                                    >
                                                        <div className="flex items-start gap-2.5">
                                                            <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ${section.color.replace('text-', 'bg-')}`} />
                                                            <span className="text-xs font-medium text-slate-200 leading-snug">{item}</span>
                                                        </div>
                                                        {isAdmin && (
                                                            <button 
                                                                onClick={() => removeItem(section.id as any, i)}
                                                                className="text-slate-500 hover:text-rose-400 transition-all opacity-0 group-hover:opacity-100 p-1 cursor-pointer"
                                                            >
                                                                <X size={14} />
                                                            </button>
                                                        )}
                                                    </motion.div>
                                                ))}
                                                {formData[section.id as keyof typeof formData].length === 0 && (
                                                    <div className="col-span-full py-4 text-center text-xs text-slate-500 font-mono bg-slate-950 rounded-xl border border-dashed border-slate-800">
                                                        No hay elementos registrados.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {isAdmin && (
                                    <div className="mt-8 pt-6 border-t border-slate-800">
                                        <button 
                                            onClick={handleSave}
                                            className="w-full bg-gradient-to-r from-indigo-600 to-cyan-600 text-white py-3.5 text-xs font-black uppercase rounded-xl hover:from-indigo-500 hover:to-cyan-500 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                                        >
                                            <Save size={16} />
                                            <span>Guardar Cambios del Perfil</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar Preview */}
                        <div className="xl:col-span-1 space-y-6">
                            <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-6">
                                <h3 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest text-center">Ficha Técnica</h3>
                                <div className="flex flex-col items-center gap-4 border-b border-slate-800 pb-6">
                                    <div className="w-20 h-20 bg-slate-800 border border-slate-700 rounded-2xl flex items-center justify-center text-cyan-300 text-2xl font-black shadow-lg">
                                        {isAdmin ? selectedUser?.name?.[0] : session?.user?.name?.[0]}
                                    </div>
                                    <div className="text-center">
                                        <p className="text-base font-black text-white">{isAdmin ? selectedUser?.name : session?.user?.name}</p>
                                        <p className="text-[10px] font-mono font-bold text-cyan-300 uppercase tracking-wider mt-1 bg-slate-800 border border-slate-700 inline-block px-3 py-1 rounded-full">{isAdmin ? selectedUser?.role : session?.user?.role}</p>
                                    </div>
                                </div>
                                <div className="py-2 space-y-4 text-xs">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-slate-950 rounded-xl border border-slate-800 text-slate-400"><Clock size={16} /></div>
                                        <div>
                                            <p className="text-[9px] font-mono text-slate-500 uppercase">Última Actualización</p>
                                            <p className="font-bold text-slate-200">{profile ? new Date(profile.updatedAt).toLocaleDateString() : 'Sin registro'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-emerald-950/40 rounded-xl border border-emerald-500/30 text-emerald-400"><ShieldCheck size={16} /></div>
                                        <div>
                                            <p className="text-[9px] font-mono text-slate-500 uppercase">Estado Operativo</p>
                                            <p className="font-bold text-emerald-300">Activo y Autorizado</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
