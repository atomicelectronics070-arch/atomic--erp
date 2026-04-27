"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { 
    Calendar, Target, Users, Bell, CheckSquare, Plus, 
    ChevronRight, Folder, FileUp, ShieldCheck, Zap, 
    ArrowRight, LayoutGrid, Database, MessageSquare, 
    CheckCircle2, Clock, Trash2, Edit3, X
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface QuarterlyPlan {
    id: string
    name: string
    objective: string
    participants: string
    notifyUsers: boolean
    postsPerDay: number
    retargetingPerWeek: number
    leadsPerWeek: number
    adminMeetingsPerWeek: number
    adminProvideDbPerWeek: number
    status: string
    assignedUsers: { id: string, name: string }[]
    createdAt: string
}

interface User {
    id: string
    name: string
    role: string
}

export default function QuarterlyPage() {
    const { data: session } = useSession()
    const [plans, setPlans] = useState<QuarterlyPlan[]>([])
    const [users, setUsers] = useState<User[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'admin' | 'advisor'>('advisor')

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        objective: "",
        participants: ["VENDEDORES"],
        notifyUsers: true,
        postsPerDay: 3,
        retargetingPerWeek: 1,
        leadsPerWeek: 25,
        adminMeetingsPerWeek: 1,
        adminProvideDbPerWeek: 5,
        assignedUserIds: [] as string[]
    })

    useEffect(() => {
        fetchPlans()
        if (session?.user?.role === 'ADMIN') {
            fetchUsers()
            setActiveTab('admin')
        }
    }, [session])

    const fetchPlans = async () => {
        try {
            const res = await fetch("/api/quarterly")
            if (res.ok) {
                const data = await res.json()
                setPlans(data)
            }
        } catch (error) {
            console.error("Fetch plans error:", error)
        } finally {
            setLoading(false)
        }
    }

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/admin/users")
            if (res.ok) {
                const data = await res.json()
                setUsers(data.filter((u: User) => u.role === 'SALESPERSON'))
            }
        } catch (error) {
            console.error("Fetch users error:", error)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await fetch("/api/quarterly", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })
            if (res.ok) {
                setIsModalOpen(false)
                fetchPlans()
                setFormData({
                    name: "", objective: "", participants: ["VENDEDORES"], notifyUsers: true,
                    postsPerDay: 3, retargetingPerWeek: 1, leadsPerWeek: 25,
                    adminMeetingsPerWeek: 1, adminProvideDbPerWeek: 5, assignedUserIds: []
                })
            }
        } catch (error) {
            console.error("Submit plan error:", error)
        }
    }

    const toggleParticipant = (p: string) => {
        setFormData(prev => ({
            ...prev,
            participants: prev.participants.includes(p) 
                ? prev.participants.filter(x => x !== p)
                : [...prev.participants, p]
        }))
    }

    const toggleUser = (userId: string) => {
        setFormData(prev => ({
            ...prev,
            assignedUserIds: prev.assignedUserIds.includes(userId)
                ? prev.assignedUserIds.filter(id => id !== userId)
                : [...prev.assignedUserIds, userId]
        }))
    }

    return (
        <div className="space-y-12 pb-32 animate-in fade-in duration-1000 relative">
            {/* Background Orbs */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[10%] left-[-10%] w-[45%] h-[45%] rounded-none bg-secondary/5 blur-[120px]" />
                <div className="absolute bottom-[10%] right-[-10%] w-[35%] h-[35%] rounded-none bg-azure-500/5 blur-[100px]" />
            </div>

            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 border-b border-white/5 pb-16 relative z-10">
                <div>
                    <div className="flex items-center space-x-4 mb-4 text-secondary">
                        <Calendar size={20} className="drop-shadow-[0_0_8px_rgba(255,99,71,0.5)]" />
                        <span className="text-[10px] uppercase font-black tracking-[0.6em] italic">Gesti�n Legal & Corporativo v5.0</span>
                    </div>
                    <h1 className="text-6xl font-black text-white tracking-tighter uppercase italic leading-none">
                        PLAN <span className="text-secondary underline decoration-secondary/30 underline-offset-8">TRIMESTRAL</span>
                    </h1>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.3em] mt-5 max-w-xl italic leading-relaxed">
                        Configuración táctica de objetivos comerciales y operativos para la expansión Corporativo del ecosistema ATOMIC.
                    </p>
                </div>
                {session?.user?.role === 'ADMIN' && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-secondary text-white px-10 py-5 font-black uppercase tracking-[0.3em] text-[10px] flex items-center shadow-[0_20px_50px_-10px_rgba(255,99,71,0.5)] transition-all hover:bg-white hover:text-secondary rounded-none active:scale-95 group italic skew-x-[-12deg]"
                    >
                        <div className="skew-x-[12deg] flex items-center gap-4">
                            <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                            <span>Crear Trimestre</span>
                        </div>
                    </button>
                )}
            </div>

            {/* Dashboard Navigation */}
            <div className="flex gap-4 relative z-10">
                <button 
                    onClick={() => setActiveTab('advisor')}
                    className={`px-8 py-4 text-[10px] font-black uppercase tracking-widest italic border-b-2 transition-all ${activeTab === 'advisor' ? 'border-secondary text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                >
                    Vista Operativa (Asesor)
                </button>
                {session?.user?.role === 'ADMIN' && (
                    <button 
                        onClick={() => setActiveTab('admin')}
                        className={`px-8 py-4 text-[10px] font-black uppercase tracking-widest italic border-b-2 transition-all ${activeTab === 'admin' ? 'border-primary text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                    >
                        Gestión Administrativa
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 relative z-10">
                {activeTab === 'admin' ? (
                    <div className="xl:col-span-3 space-y-12">
                        {plans.length === 0 ? (
                            <div className="glass-panel border-white/5 p-20 text-center rounded-none-[3rem]">
                                <Calendar size={48} className="mx-auto text-slate-800 mb-6" />
                                <p className="text-slate-500 font-black uppercase tracking-[0.4em] italic">No hay planes trimestrales activos en el sistema</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {plans.map((plan, idx) => (
                                    <motion.div 
                                        key={plan.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="glass-panel border-white/5 p-8 rounded-none-[2rem] hover:border-secondary/30 transition-all group relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                            <Target size={80} />
                                        </div>
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="bg-secondary/10 text-secondary px-4 py-2 text-[9px] font-black uppercase tracking-widest italic border border-secondary/20">
                                                Trimestre {plans.length - idx}
                                            </div>
                                            <span className="text-emerald-400 text-[8px] font-black uppercase tracking-widest bg-emerald-500/5 px-3 py-1 border border-emerald-500/10 italic">Activo</span>
                                        </div>
                                        <h3 className="text-xl font-black text-white uppercase tracking-tighter italic mb-2">{plan.name}</h3>
                                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest line-clamp-2 h-8 mb-6">{plan.objective || "Sin objetivo definido"}</p>
                                        
                                        <div className="space-y-4 pt-6 border-t border-white/5">
                                            <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-400">
                                                <span>Participantes:</span>
                                                <span className="text-white italic">{JSON.parse(plan.participants).join(" / ")}</span>
                                            </div>
                                            <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-400">
                                                <span>Publicaciones:</span>
                                                <span className="text-azure-400 italic">{plan.postsPerDay} Diarias</span>
                                            </div>
                                            <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-400">
                                                <span>Leads Requeridos:</span>
                                                <span className="text-secondary italic">{plan.leadsPerWeek} Semanales</span>
                                            </div>
                                        </div>

                                        <button className="w-full mt-8 py-4 bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-[0.3em] text-slate-300 hover:bg-secondary hover:text-white transition-all italic">
                                            Ver Métricas de Cumplimiento
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="xl:col-span-3 grid grid-cols-1 lg:grid-cols-4 gap-12">
                        {/* Advisor University Folder Navigation */}
                        <div className="lg:col-span-1 space-y-6">
                            <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] italic px-4">Estructura de Trabajo</h2>
                            <div className="space-y-2">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(week => (
                                    <button key={week} className="w-full text-left px-6 py-4 glass-panel border-white/5 hover:border-secondary/40 transition-all flex items-center justify-between group">
                                        <div className="flex items-center gap-4">
                                            <Folder size={18} className="text-slate-700 group-hover:text-secondary transition-colors" />
                                            <span className="text-[10px] font-black text-white uppercase tracking-widest italic">Semana {week}</span>
                                        </div>
                                        <ChevronRight size={14} className="text-slate-800" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Workspace Area */}
                        <div className="lg:col-span-3 space-y-12">
                            <div className="glass-panel border-white/5 p-12 rounded-none-[3rem] bg-gradient-to-br from-white/[0.02] to-transparent">
                                <header className="flex justify-between items-center mb-12 border-b border-white/5 pb-8">
                                    <div>
                                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">Workspace: <span className="text-secondary">Semana 1</span></h3>
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] mt-2 italic">Carga de evidencia y sincronización de leads</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[8px] font-black text-slate-700 uppercase tracking-[0.4em] block mb-1">Status Global</span>
                                        <span className="text-[10px] font-black text-emerald-400 italic">85% COMPLETADO</span>
                                    </div>
                                </header>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Task: Posts */}
                                    <div className="glass-panel !bg-slate-950/40 border-white/5 p-8 rounded-none-[2rem] space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div className="p-3 bg-secondary/10 text-secondary border border-secondary/20"><FileUp size={20} /></div>
                                            <span className="text-[10px] font-black text-white bg-secondary/20 px-3 py-1 italic">3 / 5 CARGAS</span>
                                        </div>
                                        <h4 className="text-[11px] font-black text-white uppercase tracking-widest italic">Publicaciones Diarias</h4>
                                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest italic leading-relaxed">Sube capturas de pantalla de tus publicaciones en redes sociales.</p>
                                        <button className="w-full py-4 border border-dashed border-white/10 text-[9px] font-black uppercase text-slate-600 hover:text-white hover:border-secondary transition-all italic">
                                            Seleccionar Archivos
                                        </button>
                                    </div>

                                    {/* Task: CRM Leads */}
                                    <div className="glass-panel !bg-slate-950/40 border-white/5 p-8 rounded-none-[2rem] space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div className="p-3 bg-azure-500/10 text-azure-400 border border-azure-500/20"><Users size={20} /></div>
                                            <span className="text-[10px] font-black text-white bg-azure-500/20 px-3 py-1 italic">12 / 25 LEADS</span>
                                        </div>
                                        <h4 className="text-[11px] font-black text-white uppercase tracking-widest italic">Inyección de Leads CRM</h4>
                                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest italic leading-relaxed">Debes ingresar el número establecido de contactos para marcar como realizado.</p>
                                        <button className="w-full py-4 bg-azure-500/10 border border-azure-500/20 text-[9px] font-black uppercase text-azure-400 hover:bg-azure-500 hover:text-slate-950 transition-all italic">
                                            Ir al CRM y Vincular
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Creation Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 lg:p-24 overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-5xl bg-slate-950 border border-white/10 p-12 lg:p-20 shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden rounded-none-[4rem] custom-scrollbar"
                        >
                            <div className="absolute top-0 left-0 w-2 h-full bg-secondary shadow-[0_0_20px_rgba(255,99,71,0.5)]"></div>
                            
                            <header className="mb-16 flex items-center justify-between border-b border-white/5 pb-10">
                                <div className="space-y-4">
                                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">
                                        NUEVO PLAN <span className="text-secondary text-4xl underline decoration-secondary/20 underline-offset-8">TRIMESTRAL</span>
                                    </h2>
                                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] italic leading-none">Arquitectura de metas y sincronización de equipos</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="p-4 hover:bg-white/5 text-slate-600 hover:text-white transition-all"><X size={24} /></button>
                            </header>

                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2 italic">Nombre del Trimestre</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value.toUpperCase() })}
                                        className="w-full bg-slate-950 border border-white/5 p-6 text-base font-black text-white outline-none rounded-none focus:border-secondary transition-all italic shadow-inner uppercase"
                                        placeholder="EJ: EXPANSIÓN Q3 2026"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2 italic">Objetivo Maestro</label>
                                    <input
                                        type="text"
                                        value={formData.objective}
                                        onChange={(e) => setFormData({ ...formData, objective: e.target.value.toUpperCase() })}
                                        className="w-full bg-slate-950 border border-white/5 p-6 text-base font-black text-white outline-none rounded-none focus:border-secondary transition-all italic shadow-inner uppercase"
                                        placeholder="ALCANCE DE 10,000 NUEVOS LEADS"
                                    />
                                </div>

                                <div className="space-y-8 col-span-2">
                                    <div className="flex flex-wrap gap-12 items-center">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2 italic">Participantes</label>
                                            <div className="flex gap-6">
                                                {["VENDEDORES", "SOCIOS", "AFILIADOS"].map(p => (
                                                    <button
                                                        key={p}
                                                        type="button"
                                                        onClick={() => toggleParticipant(p)}
                                                        className={`px-6 py-3 text-[9px] font-black uppercase tracking-widest italic border transition-all ${formData.participants.includes(p) ? 'bg-secondary/10 border-secondary text-secondary' : 'bg-slate-950 border-white/5 text-slate-700 hover:text-slate-400'}`}
                                                    >
                                                        {p}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-4 flex flex-col justify-end">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2 italic">Notificación</label>
                                            <label className="flex items-center gap-4 cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.notifyUsers}
                                                    onChange={(e) => setFormData({ ...formData, notifyUsers: e.target.checked })}
                                                    className="hidden"
                                                />
                                                <div className={`w-12 h-6 border transition-all relative flex items-center ${formData.notifyUsers ? 'bg-secondary border-secondary' : 'bg-slate-900 border-white/10'}`}>
                                                    <div className={`absolute w-4 h-4 bg-white transition-all ${formData.notifyUsers ? 'right-1' : 'left-1'}`}></div>
                                                </div>
                                                <span className="text-[10px] font-black text-slate-600 group-hover:text-slate-400 uppercase tracking-widest italic">Notificar Usuarios</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-12 col-span-2 border-t border-white/5 pt-12">
                                    <h3 className="text-sm font-black text-white uppercase tracking-[0.4em] italic mb-8">Configuración de Métricas Operativas</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2 italic">Publicaciones Diarias</label>
                                            <div className="flex gap-2">
                                                {[3, 5, 10].map(n => (
                                                    <button
                                                        key={n} type="button"
                                                        onClick={() => setFormData({...formData, postsPerDay: n})}
                                                        className={`flex-1 py-4 text-xs font-black italic border transition-all ${formData.postsPerDay === n ? 'bg-secondary text-white border-secondary' : 'bg-slate-950 border-white/5 text-slate-700'}`}
                                                    >
                                                        {n}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2 italic">Retargeting Semanal</label>
                                            <div className="flex gap-2">
                                                {[1, 2, 3].map(n => (
                                                    <button
                                                        key={n} type="button"
                                                        onClick={() => setFormData({...formData, retargetingPerWeek: n})}
                                                        className={`flex-1 py-4 text-xs font-black italic border transition-all ${formData.retargetingPerWeek === n ? 'bg-azure-500 text-slate-950 border-azure-500' : 'bg-slate-950 border-white/5 text-slate-700'}`}
                                                    >
                                                        {n}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2 italic">Leads / Base de Datos</label>
                                            <input
                                                type="number"
                                                value={formData.leadsPerWeek}
                                                onChange={(e) => setFormData({...formData, leadsPerWeek: parseInt(e.target.value)})}
                                                className="w-full bg-slate-950 border border-white/5 p-4 text-xl font-black text-emerald-400 outline-none rounded-none focus:border-emerald-500 italic text-center"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-12 col-span-2 border-t border-white/5 pt-12">
                                    <h3 className="text-sm font-black text-white uppercase tracking-[0.4em] italic mb-8 flex items-center gap-4">
                                         <ShieldCheck size={20} className="text-primary" /> Actividades de Administrador
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2 italic">Reuniones por Semana</label>
                                            <div className="flex gap-2">
                                                {[1, 2, 3].map(n => (
                                                    <button
                                                        key={n} type="button"
                                                        onClick={() => setFormData({...formData, adminMeetingsPerWeek: n})}
                                                        className={`flex-1 py-4 text-xs font-black italic border transition-all ${formData.adminMeetingsPerWeek === n ? 'bg-primary text-white border-primary' : 'bg-slate-950 border-white/5 text-slate-700'}`}
                                                    >
                                                        {n}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2 italic">Proporcionar Base de Datos</label>
                                            <div className="flex gap-2">
                                                {[5, 10, 15].map(n => (
                                                    <button
                                                        key={n} type="button"
                                                        onClick={() => setFormData({...formData, adminProvideDbPerWeek: n})}
                                                        className={`flex-1 py-4 text-xs font-black italic border transition-all ${formData.adminProvideDbPerWeek === n ? 'bg-primary text-white border-primary' : 'bg-slate-950 border-white/5 text-slate-700'}`}
                                                    >
                                                        {n}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-8 col-span-2 border-t border-white/5 pt-12">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2 italic">Asignar Asesores Responsables</label>
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                        {users.map(u => (
                                            <button
                                                key={u.id}
                                                type="button"
                                                onClick={() => toggleUser(u.id)}
                                                className={`p-4 text-left border transition-all ${formData.assignedUserIds.includes(u.id) ? 'bg-secondary/10 border-secondary' : 'bg-slate-950 border-white/5 opacity-40'}`}
                                            >
                                                <p className="text-[9px] font-black text-white uppercase tracking-tighter truncate">{u.name}</p>
                                                <p className="text-[7px] text-slate-500 uppercase font-bold tracking-[0.2em] mt-1">{u.role}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="col-span-2 pt-12">
                                    <button
                                        type="submit"
                                        className="w-full bg-secondary text-white py-8 font-black uppercase tracking-[0.5em] text-xs italic hover:bg-white hover:text-secondary transition-all shadow-[0_30px_60px_-15px_rgba(255,99,71,0.5)]"
                                    >
                                        Sincronizar y Desplegar Plan Trimestral
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}


