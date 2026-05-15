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

    const toggleUserStatus = async (userId: string, current: boolean) => {
        if (!confirm(`¿Desea ${current ? 'desactivar' : 'activar'} el acceso de este asesor?`)) return
        try {
            const res = await fetch(`/api/admin/users/${userId}`, {
                method: "PATCH",
                body: JSON.stringify({ isActive: !current })
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
            const res = await fetch("/api/admin/users")
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
            <header className="flex flex-col lg:flex-row lg:items-end justify-between border-b border-slate-200 pb-6 relative z-10 gap-6">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-black text-[#0F172A] flex items-center gap-3">
                        <Briefcase className="text-indigo-600" /> Perfiles Laborales
                    </h1>
                    <p className="text-sm text-slate-500 font-medium mt-1 max-w-xl">
                        Gestión de fichas técnicas, competencias y permisos de los asesores del equipo.
                    </p>
                </motion.div>

                {isAdmin && view !== "list" && (
                    <button
                        onClick={() => setView("list")}
                        className="bg-white border border-slate-200 text-slate-700 px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
                    >
                        <ChevronLeft size={18} />
                        <span>Volver a Asesores</span>
                    </button>
                )}
            </header>

            <AnimatePresence mode="wait">
                {view === "list" ? (
                    <motion.div 
                        key="list"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="bg-white border border-slate-200 shadow-sm overflow-hidden rounded-2xl relative z-10"
                    >
                        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-50">
                            <div>
                                <h2 className="text-lg font-black text-[#0F172A]">Directorio de Talento Humano</h2>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Seleccione un asesor para gestionar su ficha técnica</p>
                            </div>
                            <div className="relative w-full md:w-[350px]">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Buscar asesor..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 text-sm font-medium text-[#0F172A] outline-none rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-sm"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="text-xs text-slate-500 uppercase font-bold bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-4">Identidad Laboral</th>
                                        <th className="px-6 py-4">Status & Seguridad</th>
                                        <th className="px-6 py-4">Accesos</th>
                                        <th className="px-6 py-4 text-right">Gestión</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {loading ? (
                                        <tr><td colSpan={4} className="px-6 py-12 text-center text-sm font-bold text-slate-400">Cargando base de datos...</td></tr>
                                    ) : filteredUsers.map((u: any) => (
                                        <tr key={u.id} className="hover:bg-slate-50 transition-colors group">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center space-x-4">
                                                    <div className={`w-12 h-12 bg-indigo-50 border ${u.resetRequested ? 'border-rose-300' : 'border-indigo-100'} flex items-center justify-center text-indigo-600 font-black text-lg rounded-xl shadow-sm`}>
                                                        {u.name?.[0] || u.email?.[0]}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-bold text-[#0F172A] text-base group-hover:text-indigo-600 transition-colors">{u.name || (u.email.split('@')[0])}</p>
                                                            {u.resetRequested && (
                                                                <span className="bg-rose-100 text-rose-600 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">Reset Pendiente</span>
                                                            )}
                                                        </div>
                                                        <p className="text-xs font-medium text-slate-500 mt-0.5">{u.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${u.isActive ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-rose-50 text-rose-600 border border-rose-200'}`}>
                                                            {u.isActive ? 'Activo' : 'Desactivado'}
                                                        </span>
                                                        <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">{u.role}</span>
                                                    </div>
                                                    {u.tempResetCode && (
                                                        <div className="bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-md flex items-center gap-2 max-w-fit">
                                                            <span className="text-[10px] font-bold text-indigo-500 uppercase">Código Temporal:</span>
                                                            <span className="text-xs font-black text-indigo-700">{u.tempResetCode}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2">
                                                    <button 
                                                        onClick={() => toggleUserStatus(u.id, u.isActive)}
                                                        className={`p-2 rounded-lg border transition-all ${u.isActive ? 'border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50' : 'border-emerald-200 text-emerald-600 bg-emerald-50 hover:bg-emerald-100'}`}
                                                        title={u.isActive ? "Desactivar Acceso" : "Activar Acceso"}
                                                    >
                                                        {u.isActive ? <ShieldOff size={18} /> : <ShieldCheck size={18} />}
                                                    </button>
                                                    <button 
                                                        onClick={() => approveReset(u.id)}
                                                        className={`p-2 rounded-lg border transition-all ${u.resetRequested ? 'bg-rose-500 border-rose-600 text-white' : 'border-slate-200 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'}`}
                                                        title="Autorizar Reseteo"
                                                    >
                                                        <Key size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex justify-end items-center gap-2">
                                                    <button
                                                        onClick={() => handleSelectUser(u)}
                                                        className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all shadow-sm bg-white"
                                                        title="Editar Perfil Laboral"
                                                    >
                                                        <FileText size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteUser(u.id)}
                                                        className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all shadow-sm bg-white"
                                                        title="Eliminar Asesor"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
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
                            <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm overflow-hidden relative">
                                <div className="flex justify-between items-start mb-8 border-b border-slate-100 pb-6">
                                    <div>
                                        <h2 className="text-2xl font-black text-[#0F172A] flex items-center gap-2">
                                            <Building2 className="text-indigo-600" size={24} /> Arquitectura de Cargo
                                        </h2>
                                        <p className="text-sm font-medium text-slate-500 mt-2">
                                            Perfil asignado a: <span className="text-[#0F172A] font-bold">{isAdmin ? selectedUser?.name : session?.user?.name}</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Título del Perfil</label>
                                            <input 
                                                type="text"
                                                disabled={!isAdmin}
                                                value={formData.title}
                                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                                className="w-full bg-slate-50 border border-slate-200 px-4 py-3 text-sm font-bold text-[#0F172A] outline-none rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all disabled:opacity-70 disabled:bg-slate-100"
                                                placeholder="Ej: Asesor Comercial Senior"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Plantilla de Referencia</label>
                                            <input 
                                                type="text"
                                                disabled={!isAdmin}
                                                value={formData.templateName}
                                                onChange={(e) => setFormData({...formData, templateName: e.target.value})}
                                                className="w-full bg-white border border-indigo-200 px-4 py-3 text-sm font-bold text-indigo-700 outline-none rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-sm disabled:opacity-70 disabled:bg-slate-50"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Resumen del Perfil Laboral</label>
                                        <textarea 
                                            disabled={!isAdmin}
                                            value={formData.description}
                                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                                            className="w-full bg-slate-50 border border-slate-200 p-4 text-sm font-medium text-[#0F172A] outline-none rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all h-32 resize-none disabled:opacity-70 disabled:bg-slate-100"
                                            placeholder="Describa la misión del cargo..."
                                        />
                                    </div>

                                    {/* List Sections */}
                                    {[
                                        { id: 'skills', label: 'Competencias & Skills', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100', icon: <Zap size={18} /> },
                                        { id: 'responsibilities', label: 'Responsabilidades', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', icon: <Target size={18} /> },
                                        { id: 'benefits', label: 'Beneficios', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', icon: <Award size={18} /> }
                                    ].map(section => (
                                        <div key={section.id} className="space-y-4">
                                            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                                                <div className={`flex items-center gap-2 ${section.color}`}>
                                                    {section.icon}
                                                    <h3 className="text-sm font-bold uppercase tracking-wider">{section.label}</h3>
                                                </div>
                                                {isAdmin && (
                                                    <div className="flex gap-2">
                                                        <input 
                                                            type="text"
                                                            placeholder="Añadir ítem..."
                                                            value={newItem.type === section.id ? newItem.value : ""}
                                                            onChange={(e) => setNewItem({ type: section.id, value: e.target.value })}
                                                            className="bg-slate-50 border border-slate-200 px-3 py-1.5 text-sm font-medium outline-none rounded-lg focus:border-indigo-500 w-48"
                                                            onKeyDown={(e) => { if(e.key === 'Enter') addItem(section.id as any) }}
                                                        />
                                                        <button 
                                                            onClick={() => addItem(section.id as any)}
                                                            className="bg-slate-100 text-slate-600 p-1.5 rounded-lg hover:bg-slate-200 transition-colors"
                                                        >
                                                            <Plus size={18} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {formData[section.id as keyof typeof formData] instanceof Array && (formData[section.id as keyof typeof formData] as string[]).map((item, i) => (
                                                    <motion.div 
                                                        layout
                                                        key={i} 
                                                        className={`flex items-start justify-between p-3 ${section.bg} border ${section.border} rounded-xl group`}
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ${section.color.replace('text-', 'bg-')}`} />
                                                            <span className="text-sm font-medium text-slate-700 leading-snug">{item}</span>
                                                        </div>
                                                        {isAdmin && (
                                                            <button 
                                                                onClick={() => removeItem(section.id as any, i)}
                                                                className="text-slate-400 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100 p-1"
                                                            >
                                                                <X size={16} />
                                                            </button>
                                                        )}
                                                    </motion.div>
                                                ))}
                                                {formData[section.id as keyof typeof formData].length === 0 && (
                                                    <div className="col-span-full py-4 text-center text-sm text-slate-400 font-medium bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                                        No hay elementos registrados.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {isAdmin && (
                                    <div className="mt-10 pt-6 border-t border-slate-100">
                                        <button 
                                            onClick={handleSave}
                                            className="w-full bg-indigo-600 text-white py-4 text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-sm flex items-center justify-center gap-2"
                                        >
                                            <Save size={18} />
                                            <span>Guardar Cambios del Perfil</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar Preview */}
                        <div className="xl:col-span-1 space-y-6">
                            <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm">
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-6 text-center">Identificación de Asesor</h3>
                                <div className="flex flex-col items-center gap-6 border-b border-slate-100 pb-6">
                                    <div className="w-24 h-24 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 text-3xl font-black shadow-sm">
                                        {isAdmin ? selectedUser?.name?.[0] : session?.user?.name?.[0]}
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xl font-black text-[#0F172A]">{isAdmin ? selectedUser?.name : session?.user?.name}</p>
                                        <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mt-1 bg-indigo-50 inline-block px-3 py-1 rounded-full">{isAdmin ? selectedUser?.role : session?.user?.role}</p>
                                    </div>
                                </div>
                                <div className="py-6 space-y-5">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-slate-500"><Clock size={18} /></div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Última Actualización</p>
                                            <p className="text-sm font-bold text-[#0F172A]">{profile ? new Date(profile.updatedAt).toLocaleDateString() : 'Sin registro'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-600"><ShieldCheck size={18} /></div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Estado Operativo</p>
                                            <p className="text-sm font-bold text-emerald-600">Activo</p>
                                        </div>
                                    </div>
                                </div>
                                <button className="w-full py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:text-indigo-600 hover:border-indigo-200 transition-colors">
                                    Exportar Resumen (PDF)
                                </button>
                            </div>

                            <div className="bg-indigo-50 border border-indigo-100 p-8 rounded-2xl shadow-sm relative overflow-hidden">
                                <div className="absolute -right-4 -bottom-4 text-indigo-100 opacity-50"><Building2 size={100} /></div>
                                <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-3 relative z-10">Misión Corporativa</h3>
                                <p className="text-sm font-medium text-slate-700 leading-relaxed relative z-10">
                                    Sincronizar el talento humano con los objetivos corporativos de Atomic Industries para garantizar una expansión sostenible y de alto rendimiento.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
