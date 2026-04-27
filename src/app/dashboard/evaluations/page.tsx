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
    Award
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

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        skills: [] as string[],
        responsibilities: [] as string[],
        benefits: [] as string[],
        templateName: "ESTÁNDAR CORPORATIVO ATOMIC"
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
                    templateName: data.templateName || "ESTÁNDAR CORPORATIVO ATOMIC"
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
                templateName: data.templateName || "ESTÁNDAR CORPORATIVO ATOMIC"
            })
        } else {
            setProfile(null)
            setFormData({
                title: user.role,
                description: "",
                skills: [],
                responsibilities: [],
                benefits: [],
                templateName: "ESTÁNDAR CORPORATIVO ATOMIC"
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
            [type]: [...prev[type as keyof typeof prev] as string[], newItem.value.toUpperCase()]
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
        <div className="space-y-12 pb-32 animate-in fade-in duration-1000 relative">
            {/* Background Orbs */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[10%] left-[-10%] w-[45%] h-[45%] rounded-none bg-primary/5 blur-[120px]" />
                <div className="absolute bottom-[10%] right-[-10%] w-[35%] h-[35%] rounded-none bg-secondary/5 blur-[100px]" />
            </div>

            {/* Header */}
            <header className="flex flex-col lg:flex-row lg:items-end justify-between border-b border-white/5 pb-16 relative z-10 gap-10">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                     <div className="flex items-center space-x-4 mb-4 text-primary">
                        <Award size={20} className="drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                        <span className="text-[10px] uppercase font-black tracking-[0.6em] italic">Corporate Talent Architecture v6.0</span>
                    </div>
                    <h1 className="text-6xl font-black text-white uppercase tracking-tighter leading-none italic">
                        PERFILES <span className="text-primary underline decoration-primary/30 underline-offset-8">LABORALES</span>
                    </h1>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.3em] mt-5 max-w-xl italic leading-relaxed">
                        Definición de fichas técnicas de talento, competencias críticas y estructura de responsabilidades corporativas.
                    </p>
                </motion.div>

                {isAdmin && view !== "list" && (
                    <button
                        onClick={() => setView("list")}
                        className="bg-slate-900 text-white font-black text-[10px] uppercase tracking-[0.4em] px-10 py-5 hover:bg-primary transition-all flex items-center gap-4 rounded-none border border-white/5 shadow-2xl skew-x-[-12deg] group"
                    >
                         <div className="skew-x-[12deg] flex items-center gap-3">
                            <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                            <span>Listado de Asesores</span>
                        </div>
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
                        className="glass-panel border-white/5 shadow-2xl overflow-hidden rounded-none-[3.5rem] relative z-10 backdrop-blur-3xl"
                    >
                        <div className="p-10 border-b border-white/5 flex flex-col lg:flex-row justify-between items-center gap-10 bg-white/[0.01]">
                            <div>
                                <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Elementos de Talento Humano</h2>
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] mt-1 italic">Seleccione un asesor para gestionar su ficha técnica</p>
                            </div>
                            <div className="relative w-full lg:w-[450px] group">
                                <Users className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-primary transition-colors" size={20} />
                                <input
                                    type="text"
                                    placeholder="BUSCAR ASESOR..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-16 pr-8 py-5 bg-slate-950 border border-white/5 text-xs font-black uppercase tracking-widest text-white outline-none rounded-none focus:border-primary transition-all shadow-inner placeholder:text-slate-900 italic"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="text-[10px] text-slate-600 uppercase font-black tracking-[0.4em] bg-white/[0.02]">
                                    <tr>
                                        <th className="px-12 py-10 italic">Identidad_Laboral</th>
                                        <th className="px-10 py-10 italic">Rango_Sist</th>
                                        <th className="px-10 py-10 italic">Status_Ficha</th>
                                        <th className="px-12 py-10 text-right italic">Gestión</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {loading ? (
                                        <tr><td colSpan={4} className="px-12 py-32 text-center text-[10px] font-black text-slate-500 uppercase tracking-[1em] animate-pulse italic">Analizando Base de Datos...</td></tr>
                                    ) : filteredUsers.map((u: any) => (
                                        <tr key={u.id} className="hover:bg-white/[0.03] transition-all group">
                                            <td className="px-12 py-8">
                                                <div className="flex items-center space-x-6">
                                                    <div className="w-14 h-14 bg-slate-950 border border-white/5 flex items-center justify-center text-primary font-black text-lg group-hover:bg-primary group-hover:text-white transition-all rounded-none shadow-inner italic">
                                                        {u.name?.[0] || u.email?.[0]}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-white text-base tracking-tighter uppercase italic group-hover:text-primary transition-colors">{u.name || (u.email.split('@')[0])}</p>
                                                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mt-1 italic">{u.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <span className="text-[10px] font-black text-azure-400 bg-azure-500/10 px-4 py-1.5 border border-azure-400/20 uppercase tracking-[0.3em] italic">{u.role}</span>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-2 h-2 rounded-none ${u.jobProfile ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-slate-800'}`} />
                                                    <span className={`text-[10px] font-black uppercase tracking-widest italic ${u.jobProfile ? 'text-emerald-500' : 'text-slate-700'}`}>
                                                        {u.jobProfile ? 'CONFIGURADA' : 'PENDIENTE'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-12 py-8 text-right">
                                                <button
                                                    onClick={() => handleSelectUser(u)}
                                                    className="bg-primary text-white px-8 py-4 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-primary transition-all rounded-none italic skew-x-[-12deg] shadow-2xl shadow-primary/20 group"
                                                >
                                                    <div className="skew-x-[12deg] flex items-center gap-3">
                                                        <span>{u.jobProfile ? "Editar Perfil" : "Crear Perfil"}</span>
                                                        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                                    </div>
                                                </button>
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
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -40 }}
                        className="grid grid-cols-1 xl:grid-cols-3 gap-12 relative z-10"
                    >
                        {/* Editor Form */}
                        <div className="xl:col-span-2 space-y-12">
                            <div className="glass-panel border-white/10 p-16 rounded-none-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] backdrop-blur-3xl overflow-hidden relative">
                                <div className="absolute top-0 right-0 p-12 opacity-5 text-primary pointer-events-none -rotate-12"><Briefcase size={200} /></div>
                                
                                <div className="flex justify-between items-start mb-16 border-b border-white/5 pb-10">
                                    <div>
                                        <div className="flex items-center space-x-4 mb-4 text-azure-400">
                                            <Building2 size={20} />
                                            <span className="text-[10px] uppercase font-black tracking-[0.6em] italic">Configuración de Ficha Técnica</span>
                                        </div>
                                        <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">ARQUITECTURA DE <span className="text-primary">CARGO</span></h2>
                                        <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] mt-3 italic leading-none">
                                            Perfil asignado a: <span className="text-white ml-2 underline decoration-primary/30">{isAdmin ? selectedUser?.name : session?.user?.name}</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-12">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2 italic">Título del Perfil</label>
                                            <input 
                                                type="text"
                                                disabled={!isAdmin}
                                                value={formData.title}
                                                onChange={(e) => setFormData({...formData, title: e.target.value.toUpperCase()})}
                                                className="w-full bg-slate-950 border border-white/5 px-8 py-6 text-base font-black uppercase tracking-widest text-white outline-none rounded-none focus:border-primary transition-all shadow-inner italic"
                                                placeholder="EJ: SENIOR SALES ADVISOR"
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2 italic">Plantilla de Referencia</label>
                                            <input 
                                                type="text"
                                                disabled={!isAdmin}
                                                value={formData.templateName}
                                                onChange={(e) => setFormData({...formData, templateName: e.target.value.toUpperCase()})}
                                                className="w-full bg-slate-950 border border-white/5 px-8 py-6 text-base font-black text-primary outline-none rounded-none focus:border-primary transition-all shadow-inner italic"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2 italic">Resumen del Perfil Laboral</label>
                                        <textarea 
                                            disabled={!isAdmin}
                                            value={formData.description}
                                            onChange={(e) => setFormData({...formData, description: e.target.value.toUpperCase()})}
                                            className="w-full bg-slate-950 border border-white/5 p-8 text-[12px] font-black italic text-white shadow-inner focus:border-primary transition-all h-32 outline-none resize-none uppercase tracking-widest leading-relaxed placeholder:text-slate-900"
                                            placeholder="DESCRIBA LA MISIÓN DEL CARGO..."
                                        />
                                    </div>

                                    {/* List Sections */}
                                    {[
                                        { id: 'skills', label: 'Competencias & Skills', color: 'text-azure-400', icon: <Zap size={16} /> },
                                        { id: 'responsibilities', label: 'Responsabilidades Críticas', color: 'text-secondary', icon: <Target size={16} /> },
                                        { id: 'benefits', label: 'Beneficios & Incentivos', color: 'text-emerald-400', icon: < Award size={16} /> }
                                    ].map(section => (
                                        <div key={section.id} className="space-y-6">
                                            <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                                <div className={`flex items-center gap-4 ${section.color}`}>
                                                    {section.icon}
                                                    <h3 className="text-[11px] font-black uppercase tracking-[0.5em] italic">{section.label}</h3>
                                                </div>
                                                {isAdmin && (
                                                    <div className="flex gap-4">
                                                        <input 
                                                            type="text"
                                                            placeholder="AÑADIR..."
                                                            value={newItem.type === section.id ? newItem.value : ""}
                                                            onChange={(e) => setNewItem({ type: section.id, value: e.target.value.toUpperCase() })}
                                                            className="bg-slate-950 border border-white/5 px-6 py-2 text-[9px] font-black uppercase tracking-widest outline-none rounded-none focus:border-primary transition-all w-48 shadow-inner italic placeholder:text-slate-900"
                                                        />
                                                        <button 
                                                            onClick={() => addItem(section.id as any)}
                                                            className="bg-primary text-white p-2 hover:bg-white hover:text-primary transition-all rounded-none"
                                                        >
                                                            <Plus size={16} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {formData[section.id as keyof typeof formData] instanceof Array && (formData[section.id as keyof typeof formData] as string[]).map((item, i) => (
                                                    <motion.div 
                                                        layout
                                                        key={i} 
                                                        className="flex items-center justify-between p-4 bg-slate-950/60 border border-white/5 rounded-none group hover:border-primary/20 transition-all shadow-inner"
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className={`w-1 h-4 ${section.color.replace('text-', 'bg-')}/30 group-hover:bg-primary transition-colors`} />
                                                            <span className="text-[9px] font-black text-slate-400 group-hover:text-white uppercase tracking-[0.2em] italic transition-colors leading-relaxed">{item}</span>
                                                        </div>
                                                        {isAdmin && (
                                                            <button 
                                                                onClick={() => removeItem(section.id as any, i)}
                                                                className="text-slate-800 hover:text-red-500 transition-all"
                                                            >
                                                                <X size={14} />
                                                            </button>
                                                        )}
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {isAdmin && (
                                    <div className="mt-20">
                                        <button 
                                            onClick={handleSave}
                                            className="w-full bg-primary text-white px-16 py-7 text-[12px] font-black uppercase tracking-[0.5em] transition-all shadow-[0_25px_60px_-10px_rgba(99,102,241,0.6)] rounded-none-[2.5rem] skew-x-[-12deg] group"
                                        >
                                            <div className="skew-x-[12deg] flex items-center justify-center gap-5">
                                                <Save size={24} className="group-hover:rotate-12 transition-transform" />
                                                <span>Sincronizar Ficha Técnica</span>
                                            </div>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar Preview */}
                        <div className="xl:col-span-1 space-y-12">
                             <div className="glass-panel border-white/10 p-12 rounded-none-[3rem] bg-gradient-to-br from-white/[0.03] to-transparent shadow-2xl backdrop-blur-xl">
                                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] italic mb-10 text-center">Identificación Corporativa</h3>
                                <div className="flex flex-col items-center gap-8 border-b border-white/5 pb-10">
                                    <div className="w-32 h-32 bg-slate-950 border border-white/10 flex items-center justify-center text-primary text-5xl font-black italic shadow-inner rounded-none group relative overflow-hidden">
                                        <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        {isAdmin ? selectedUser?.name?.[0] : session?.user?.name?.[0]}
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-black text-white italic tracking-tighter uppercase">{isAdmin ? selectedUser?.name : session?.user?.name}</p>
                                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mt-2 italic">{isAdmin ? selectedUser?.role : session?.user?.role}</p>
                                    </div>
                                </div>
                                <div className="py-10 space-y-8">
                                    <div className="flex items-center gap-6">
                                        <div className="p-3 bg-white/5 border border-white/10 text-slate-500"><Clock size={16} /></div>
                                        <div>
                                            <p className="text-[8px] font-black text-slate-700 uppercase tracking-widest italic mb-1">Última Actualización</p>
                                            <p className="text-[10px] font-black text-white italic">{profile ? new Date(profile.updatedAt).toLocaleDateString() : 'SIN REGISTRO'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="p-3 bg-white/5 border border-white/10 text-slate-500"><ShieldCheck size={16} /></div>
                                        <div>
                                            <p className="text-[8px] font-black text-slate-700 uppercase tracking-widest italic mb-1">Status de Contrato</p>
                                            <p className="text-[10px] font-black text-emerald-400 italic">ACTIVO_VECT</p>
                                        </div>
                                    </div>
                                </div>
                                <button className="w-full py-5 border border-white/5 bg-slate-950 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-white hover:bg-white/5 transition-all italic">
                                    Exportar Ficha PDF
                                </button>
                            </div>

                            <div className="glass-panel border-white/10 p-12 rounded-none-[3rem] bg-slate-950/40 relative overflow-hidden group">
                                <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity"><Building2 size={120} /></div>
                                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] italic mb-6">Misión Corporativa</h3>
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-loose italic">
                                    Sincronizar el talento humano con los objetivos Corporativoes de ATOMIC para garantizar una expansión sostenible y de alto rendimiento.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}


