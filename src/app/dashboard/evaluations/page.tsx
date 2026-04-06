"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Users, 
    Star, 
    Search, 
    BarChart3, 
    ArrowUpRight, 
    Target, 
    Trash2, 
    Plus, 
    Settings, 
    Calendar, 
    CheckCircle2, 
    Clock, 
    DollarSign, 
    Briefcase,
    X,
    Save,
    ChevronRight,
    ChevronLeft,
    ShieldCheck,
    Zap,
    LayoutGrid,
    Activity,
    ClipboardCheck
} from "lucide-react"
import { getAllUsersWithActiveCycle, activateWorkCycle, deactivateWorkCycle, saveDailyLog, getActiveWorkCycle } from "@/lib/actions/evaluations"
import { useSession } from "next-auth/react"

export default function EvaluationsPage() {
    const { data: session } = useSession()
    const role = session?.user?.role
    const isAdmin = role === "ADMIN" || role === "MANAGEMENT"

    const [view, setView] = useState<"list" | "config" | "dashboard" | "history">("list")
    const [selectedUser, setSelectedUser] = useState<any>(null)
    const [activeCycle, setActiveCycle] = useState<any>(null)
    const [pastCycles, setPastCycles] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [users, setUsers] = useState<any[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    
    // Cycle Form State
    const [cycleForm, setCycleForm] = useState({
        role: "VENDEDOR JUNIOR",
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        fixedPay: 460,
        commissionPct: 3,
        functions: ["PROSPECCIÓN DIARIA", "LLAMADAS DE CIERRE", "SEGUIMIENTO CRM"]
    })

    const [newFunction, setNewFunction] = useState("")

    useEffect(() => {
        if (isAdmin) {
            loadUsers()
        } else if (session?.user?.id) {
            loadOwnCycle()
        }
    }, [isAdmin, session])

    const loadUsers = async () => {
        setLoading(true)
        try {
            const data = await getAllUsersWithActiveCycle()
            setUsers(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const loadOwnCycle = async () => {
        if (!session?.user?.id) return
        setLoading(true)
        try {
            const cycle = await getActiveWorkCycle(session.user.id)
            if (cycle) {
                setSelectedUser(session.user)
                setActiveCycle(cycle)
                setView("dashboard")
            } else {
                setView("list")
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleSelectUser = (user: any) => {
        setSelectedUser(user)
        const active = user.workCycles?.find((c: any) => c.isActive) || null
        const past = user.workCycles?.filter((c: any) => !c.isActive) || []
        
        setActiveCycle(active)
        setPastCycles(past)
        
        if (active) {
            setView("dashboard")
        } else {
            setView("config")
        }
    }

    const handleActivateCycle = async () => {
        if (!selectedUser) return
        setLoading(true)
        const res = await activateWorkCycle(selectedUser.id, {
            ...cycleForm,
            startDate: new Date(cycleForm.startDate),
            endDate: new Date(cycleForm.endDate)
        })
        if (res.success) {
            const updatedUsers = await getAllUsersWithActiveCycle()
            setUsers(updatedUsers)
            const updatedUser = updatedUsers.find((u: any) => u.id === selectedUser.id)
            setSelectedUser(updatedUser)
            setActiveCycle(updatedUser?.workCycles?.find((c: any) => c.isActive) || null)
            setView("dashboard")
        }
        setLoading(false)
    }

    const handleDeactivate = async () => {
        if (!activeCycle) return
        if (confirm("⚠️ Alerta de Seguridad: ¿Finalizar y archivar este ciclo operativo?")) {
            setLoading(true)
            await deactivateWorkCycle(activeCycle.id)
            await loadUsers()
            setView("list")
            setLoading(false)
        }
    }

    const [selectedDay, setSelectedDay] = useState<number | null>(null)
    const [dayContent, setDayContent] = useState<any>({})

    const openDayLog = (day: number) => {
        setSelectedDay(day)
        const existingLog = activeCycle?.dailyLogs?.find((l: any) => l.dayNumber === day)
        if (existingLog) {
            setDayContent(JSON.parse(existingLog.content))
        } else {
            setDayContent({})
        }
    }

    const handleSaveDayLog = async () => {
        if (!activeCycle || selectedDay === null) return
        setLoading(true)
        const res = await saveDailyLog(activeCycle.id, selectedDay, dayContent)
        if (res.success) {
            const updatedUsers = await getAllUsersWithActiveCycle()
            setUsers(updatedUsers)
            const updatedUser = updatedUsers.find((u: any) => u.id === selectedUser?.id)
            const newActiveCycle = updatedUser?.workCycles?.find((c: any) => c.isActive) || null
            setActiveCycle(newActiveCycle)
            setSelectedDay(null)
        }
        setLoading(false)
    }

    const filteredUsers = users.filter((u: any) => 
        ((u.name || u.email) as string).toLowerCase().includes(searchTerm.toLowerCase())
    )

    const currentDayOfCycle = activeCycle ? Math.floor((new Date().getTime() - new Date(activeCycle.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1 : 1

    return (
        <div className="space-y-12 pb-32 animate-in fade-in duration-1000 relative">
            {/* Background Orbs */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[15%] left-[-5%] w-[40%] h-[40%] rounded-full bg-secondary/5 blur-[120px]" />
                <div className="absolute bottom-[20%] right-[-5%] w-[35%] h-[35%] rounded-full bg-azure-500/5 blur-[100px]" />
            </div>

            {/* Header */}
            <header className="flex flex-col lg:flex-row lg:items-end justify-between border-b border-white/5 pb-16 relative z-10 gap-10">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                     <div className="flex items-center space-x-4 mb-4 text-secondary">
                        <ClipboardCheck size={20} className="drop-shadow-[0_0_8px_rgba(255,99,71,0.5)]" />
                        <span className="text-[10px] uppercase font-black tracking-[0.6em] italic">Industrial Evaluation Core v5.1</span>
                    </div>
                    <h1 className="text-6xl font-black text-white uppercase tracking-tighter leading-none italic">
                        CONTROL DE <span className="text-secondary underline decoration-secondary/30 underline-offset-8">RÚBRICAS</span>
                    </h1>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.3em] mt-5 max-w-xl italic leading-relaxed">
                        Sistema operativo de auditoría de rendimiento, seguimiento de funciones críticas y optimización de capital humano.
                    </p>
                </motion.div>

                {isAdmin && view !== "list" && (
                    <button
                        onClick={() => setView("list")}
                        className="bg-slate-900 text-white font-black text-[10px] uppercase tracking-[0.4em] px-10 py-5 hover:bg-secondary transition-all flex items-center gap-4 rounded-2xl border border-white/5 shadow-2xl skew-x-[-12deg] group"
                    >
                         <div className="skew-x-[12deg] flex items-center gap-3">
                            <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                            <span>Volver al Nodo Maestro</span>
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
                        className="glass-panel border-white/5 shadow-2xl overflow-hidden rounded-[3.5rem] relative z-10 backdrop-blur-3xl"
                    >
                        {/* List Header */}
                        <div className="p-10 border-b border-white/5 flex flex-col lg:flex-row justify-between items-center gap-10 bg-white/[0.01]">
                            <div>
                                <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Gestión de Ciclos de Alto Rendimiento</h2>
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] mt-1 italic">Auditoría en tiempo real por usuario</p>
                            </div>
                            <div className="relative w-full lg:w-[450px] group">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-secondary transition-colors" size={20} />
                                <input
                                    type="text"
                                    placeholder="LOCALIZAR COLABORADOR..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-16 pr-8 py-5 bg-slate-950 border border-white/5 text-xs font-black uppercase tracking-widest text-white outline-none rounded-2xl focus:border-secondary transition-all shadow-inner placeholder:text-slate-900 italic"
                                />
                            </div>
                        </div>

                        {/* List Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="text-[10px] text-slate-600 uppercase font-black tracking-[0.4em] bg-white/[0.02]">
                                    <tr>
                                        <th className="px-12 py-10 italic">Colaborador / Rango</th>
                                        <th className="px-10 py-10 italic">Estado_Ciclo</th>
                                        <th className="px-10 py-10 italic">Progreso Ops</th>
                                        <th className="px-12 py-10 text-right italic">Acción_Comando</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {loading ? (
                                        <tr><td colSpan={4} className="px-12 py-32 text-center text-[10px] font-black text-slate-500 uppercase tracking-[1em] animate-pulse italic">Escaneando Registro Central...</td></tr>
                                    ) : filteredUsers.length === 0 ? (
                                        <tr><td colSpan={4} className="px-12 py-32 text-center text-[10px] font-black text-slate-800 uppercase tracking-[1em] italic">Zero Nodos Operativos</td></tr>
                                    ) : (
                                        filteredUsers.map((u: any) => {
                                            const cycle = u.workCycles?.find((c: any) => c.isActive)
                                            return (
                                                <tr key={u.id} className="hover:bg-white/[0.03] transition-all group">
                                                    <td className="px-12 py-8">
                                                        <div className="flex items-center space-x-6">
                                                            <div className="w-14 h-14 bg-slate-950 border border-white/5 flex items-center justify-center text-secondary font-black text-lg group-hover:bg-secondary group-hover:text-white transition-all rounded-2xl shadow-inner italic">
                                                                {u.name?.[0] || u.email?.[0]}
                                                            </div>
                                                            <div>
                                                                <p className="font-black text-white text-base tracking-tighter uppercase italic group-hover:text-secondary transition-colors">{u.name || (u.email.split('@')[0])}</p>
                                                                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mt-1 group-hover:text-azure-400 transition-colors">{u.role}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-10 py-8">
                                                        {cycle ? (
                                                            <div className="flex flex-col gap-2">
                                                                <span className="text-[10px] font-black text-azure-400 bg-azure-500/10 px-4 py-1.5 border border-azure-400/20 uppercase tracking-[0.3em] italic w-fit rounded-lg shadow-2xl shadow-azure-500/20">ACTIVO: {cycle.role}</span>
                                                                <div className="flex items-center gap-3 text-[9px] text-slate-600 font-extrabold italic uppercase">
                                                                    <Calendar size={12} /> Sinc: {new Date(cycle.startDate).toLocaleDateString()}
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <span className="text-[10px] font-black text-slate-600 bg-slate-950 px-4 py-1.5 border border-white/5 uppercase tracking-[0.3em] italic w-fit rounded-lg opacity-40">ESTADO_IDLE</span>
                                                        )}
                                                    </td>
                                                    <td className="px-10 py-8">
                                                        {cycle && (
                                                            <div className="flex items-center space-x-6">
                                                                <div className="flex-1 h-3 bg-slate-950 border border-white/10 rounded-full w-32 overflow-hidden shadow-inner">
                                                                    <div 
                                                                        className="h-full bg-secondary shadow-[0_0_20px_rgba(255,99,71,0.5)] transition-all duration-1000" 
                                                                        style={{ width: `${(cycle.dailyLogs.length / 30) * 100}%` }}
                                                                    />
                                                                </div>
                                                                <span className="text-[11px] font-black text-white italic tracking-tighter">{cycle.dailyLogs.length}/30D</span>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-12 py-8 text-right">
                                                        <button
                                                            onClick={() => handleSelectUser(u)}
                                                            className="bg-secondary text-white px-8 py-4 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-secondary transition-all rounded-xl italic skew-x-[-12deg] shadow-2xl shadow-secondary/20 group"
                                                        >
                                                            <div className="skew-x-[12deg] flex items-center gap-3">
                                                                <span>{cycle ? "Analizar Avances" : "Gestionar Ciclo"}</span>
                                                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                                            </div>
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                ) : view === "config" ? (
                    <motion.div 
                        key="config"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -40 }}
                        className="max-w-4xl mx-auto glass-panel border-white/10 p-16 rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] relative z-10 backdrop-blur-3xl overflow-hidden"
                    >
                         <div className="absolute top-0 right-0 p-12 opacity-5 text-secondary pointer-events-none -rotate-12"><Briefcase size={200} /></div>
                        
                        <div className="flex justify-between items-start mb-16 border-b border-white/5 pb-10">
                            <div>
                                 <div className="flex items-center space-x-4 mb-4 text-azure-400">
                                    <Target size={20} className="drop-shadow-[0_0_8px_rgba(45,212,191,0.5)]" />
                                    <span className="text-[10px] uppercase font-black tracking-[0.6em] italic">Protocolo de Despliegue</span>
                                </div>
                                <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">CONFIGURACIÓN <span className="text-secondary">PRO_CICLO</span></h2>
                                <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] mt-3 italic leading-none">
                                    Establecer parámetros industriales para: <span className="text-white ml-2 underline decoration-secondary/30">{selectedUser?.name || selectedUser?.email}</span>
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2 italic">Rol de Desempeño</label>
                                <input 
                                    type="text"
                                    value={cycleForm.role}
                                    onChange={(e) => setCycleForm({...cycleForm, role: e.target.value.toUpperCase()})}
                                    className="w-full bg-slate-950 border border-white/5 px-8 py-6 text-base font-black uppercase tracking-widest text-white outline-none rounded-3xl focus:border-secondary transition-all shadow-inner italic"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2 italic">Sueldo Base ($)</label>
                                    <input 
                                        type="number"
                                        value={cycleForm.fixedPay}
                                        onChange={(e) => setCycleForm({...cycleForm, fixedPay: parseFloat(e.target.value) || 0})}
                                        className="w-full bg-slate-950 border border-white/5 px-8 py-6 text-base font-black text-white outline-none rounded-3xl focus:border-secondary transition-all shadow-inner italic"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2 italic">Comisión (%)</label>
                                    <input 
                                        type="number"
                                        value={cycleForm.commissionPct}
                                        onChange={(e) => setCycleForm({...cycleForm, commissionPct: parseFloat(e.target.value) || 0})}
                                        className="w-full bg-slate-950 border border-white/5 px-8 py-6 text-base font-black text-secondary outline-none rounded-3xl focus:border-secondary transition-all shadow-inner italic"
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2 italic">Inicio del Vector</label>
                                <input 
                                    type="date"
                                    value={cycleForm.startDate}
                                    onChange={(e) => setCycleForm({...cycleForm, startDate: e.target.value})}
                                    className="w-full bg-slate-950 border border-white/5 px-8 py-6 text-base font-black text-white outline-none rounded-3xl focus:border-secondary transition-all shadow-inner italic appearance-none"
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2 italic">Fin del Vector (Est.)</label>
                                <input 
                                    type="date"
                                    value={cycleForm.endDate}
                                    onChange={(e) => setCycleForm({...cycleForm, endDate: e.target.value})}
                                    className="w-full bg-slate-950 border border-white/5 px-8 py-6 text-base font-black text-white outline-none rounded-3xl focus:border-secondary transition-all shadow-inner italic appearance-none"
                                />
                            </div>
                        </div>

                        <div className="mt-16 space-y-8">
                            <div className="flex justify-between items-center border-b border-white/5 pb-6">
                                <h3 className="text-[11px] font-black text-white uppercase tracking-[0.5em] italic">Funciones Críticas de Operación</h3>
                                <div className="flex gap-4">
                                    <input 
                                        type="text"
                                        value={newFunction}
                                        onChange={(e) => setNewFunction(e.target.value.toUpperCase())}
                                        placeholder="DEFINIR FUNCIÓN..."
                                        className="bg-slate-950 border border-white/5 px-6 py-3 text-[10px] font-black uppercase tracking-widest outline-none rounded-xl focus:border-secondary transition-all w-60 shadow-inner italic placeholder:text-slate-900"
                                    />
                                    <button 
                                        onClick={() => { if(newFunction) { setCycleForm({...cycleForm, functions: [...cycleForm.functions, newFunction.toUpperCase()]}); setNewFunction(""); } }}
                                        className="bg-secondary text-white p-3 hover:bg-white hover:text-secondary transition-all rounded-xl shadow-2xl shadow-secondary/20"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {cycleForm.functions.map((f, i) => (
                                    <motion.div 
                                        layout
                                        key={i} 
                                        className="flex items-center justify-between p-6 bg-slate-950/60 border border-white/5 rounded-2xl group hover:border-secondary/20 transition-all shadow-inner"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-1.5 h-6 bg-secondary/30 group-hover:bg-secondary transition-colors" />
                                            <span className="text-[10px] font-black text-slate-400 group-hover:text-white uppercase tracking-[0.2em] italic transition-colors leading-loose">{f}</span>
                                        </div>
                                        <button 
                                            onClick={() => setCycleForm({...cycleForm, functions: cycleForm.functions.filter((_, idx) => idx !== i)})}
                                            className="text-slate-800 hover:text-red-500 transition-all"
                                        >
                                            <X size={16} />
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-20 flex flex-col md:flex-row gap-8">
                            <button 
                                onClick={handleActivateCycle}
                                disabled={!isAdmin}
                                className={`flex-1 ${isAdmin ? 'bg-secondary' : 'bg-slate-900 opacity-20'} text-white px-16 py-7 text-[12px] font-black uppercase tracking-[0.5em] transition-all shadow-[0_25px_60px_-10px_rgba(255,99,71,0.6)] rounded-[2.5rem] skew-x-[-12deg] group`}
                            >
                                <div className="skew-x-[12deg] flex items-center justify-center gap-5">
                                    <ShieldCheck size={24} className="group-hover:rotate-12 transition-transform" />
                                    <span>Habilitar Ciclo Operativo</span>
                                </div>
                            </button>
                            <button 
                                onClick={() => setView("list")}
                                className="bg-slate-950 border border-white/5 text-slate-600 font-black text-[10px] uppercase tracking-[0.4em] px-12 py-7 hover:text-white transition-all rounded-[2.5rem] italic"
                            >
                                Descartar_CMD
                            </button>
                        </div>
                    </motion.div>
                ) : view === "history" ? (
                    <motion.div 
                        key="history"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-12 relative z-10"
                    >
                         <div className="glass-panel border-white/10 p-16 rounded-[4rem] shadow-2xl backdrop-blur-3xl overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-12 opacity-5 text-secondary pointer-events-none -rotate-12"><Activity size={180} /></div>
                            
                            <div className="flex justify-between items-center mb-16 border-b border-white/5 pb-10">
                                <div>
                                    <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">HISTORIAL DE <span className="text-secondary">DESPLIEGUES</span></h2>
                                    <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] mt-3 italic">Registros auditables de performance: <span className="text-secondary ml-2">{selectedUser?.name || selectedUser?.email}</span></p>
                                </div>
                                <button onClick={() => setView(activeCycle ? "dashboard" : "list")} className="p-5 bg-slate-900 border border-white/10 rounded-2xl text-slate-600 hover:text-white transition-all shadow-2xl">
                                    <ChevronLeft size={28} />
                                </button>
                            </div>

                            {pastCycles.length === 0 ? (
                                <div className="py-40 text-center space-y-8">
                                    <div className="w-24 h-24 bg-slate-950 border border-white/5 rounded-3xl flex items-center justify-center mx-auto shadow-inner opacity-20">
                                        <Clock size={48} className="text-secondary" />
                                    </div>
                                    <p className="text-slate-800 font-black text-xs uppercase tracking-[0.8em] italic">Cámara de registros histórica vacía</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-8">
                                    {pastCycles.map((cycle, idx) => (
                                        <div key={cycle.id} className="glass-panel !bg-slate-950/60 border border-white/5 p-10 flex flex-col lg:flex-row justify-between items-center gap-10 group hover:border-secondary/20 transition-all rounded-[2.5rem] shadow-2xl">
                                            <div className="flex items-center gap-10">
                                                <div className="w-16 h-16 bg-slate-950 border border-white/5 text-slate-800 flex items-center justify-center font-black text-2xl group-hover:text-secondary group-hover:scale-110 transition-all rounded-2xl italic shadow-inner">
                                                    {(pastCycles.length - idx).toString().padStart(2, '0')}
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-black text-white uppercase tracking-widest italic group-hover:text-secondary transition-colors">{cycle.role}</h3>
                                                    <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.3em] mt-2 italic flex items-center gap-3">
                                                        <Calendar size={12} /> {new Date(cycle.startDate).toLocaleDateString()} — {new Date(cycle.endDate).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-16">
                                                <div className="text-right">
                                                    <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.4em] italic mb-1">Pago_Base</p>
                                                    <p className="font-black text-white text-xl italic tracking-tighter">${cycle.fixedPay}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.4em] italic mb-1">Bitácora_Op</p>
                                                    <p className="font-black text-secondary text-xl italic tracking-tighter">{cycle.dailyLogs?.length || 0}/30D</p>
                                                </div>
                                                <button 
                                                    onClick={() => { setActiveCycle(cycle); setView("dashboard"); }}
                                                    className="bg-slate-900 text-white px-8 py-4 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-secondary transition-all rounded-xl border border-white/5 shadow-2xl skew-x-[-12deg]"
                                                >
                                                    <span className="skew-x-[12deg] block">Cargar_DATA</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="dashboard"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="space-y-12 relative z-10"
                    >
                        {/* Status Bar */}
                        <div className="glass-panel border-white/5 p-12 flex flex-col lg:flex-row justify-between items-center gap-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] rounded-[3.5rem] relative overflow-hidden backdrop-blur-3xl">
                            <div className="absolute top-0 left-0 w-2 h-full bg-secondary shadow-[0_0_20px_rgba(255,99,71,0.5)]"></div>
                            <div className="flex items-center gap-8">
                                <div className="w-24 h-24 bg-slate-950 border border-white/5 text-secondary flex items-center justify-center text-4xl font-black shadow-inner rounded-3xl italic">
                                    {selectedUser?.name?.[0] || selectedUser?.email?.[0]}
                                </div>
                                <div>
                                    <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-tight italic">{selectedUser?.name || (selectedUser?.email.split('@')[0])}</h2>
                                    <div className="flex items-center gap-6 mt-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                                            <span className="text-[11px] font-black text-secondary uppercase tracking-[0.3em] italic">{activeCycle?.role}</span>
                                        </div>
                                        <div className="h-4 w-px bg-white/10"></div>
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] italic">VECT_NODE: DÍA {activeCycle?.dailyLogs.length} / 30</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-wrap justify-center gap-10">
                                <div className="text-center lg:text-right px-10 border-r border-white/5">
                                    <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.4em] mb-2 italic">Val_Fija_Base</p>
                                    <p className="text-3xl font-black text-white italic tracking-tighter">
                                        <span className="text-secondary text-sm mr-2 not-italic">$</span>
                                        {activeCycle?.fixedPay}
                                    </p>
                                </div>
                                <div className="text-center lg:text-right px-10">
                                    <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.4em] mb-2 italic">Margen_COM</p>
                                    <p className="text-3xl font-black text-azure-400 italic tracking-tighter">
                                        {activeCycle?.commissionPct}<span className="text-azure-500 text-sm ml-2 not-italic">%</span>
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                     {isAdmin && (
                                        <button 
                                            onClick={handleDeactivate}
                                            className="bg-red-500/10 border border-red-500/30 text-red-500 px-8 py-4 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-red-500 hover:text-white transition-all rounded-xl italic skew-x-[-12deg]"
                                        >
                                           <span className="skew-x-[12deg] block">Abortar_Ciclo</span>
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => setView("history")}
                                        className="bg-slate-900 border border-white/10 text-white px-8 py-4 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-secondary transition-all rounded-xl italic shadow-2xl skew-x-[-12deg]"
                                    >
                                        <span className="skew-x-[12deg] block text-inherit">Archivo_LOG</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* 30 Day Productivity Matrix */}
                        <div className="glass-panel border-white/5 p-16 shadow-2xl rounded-[4rem] backdrop-blur-3xl relative overflow-hidden">
                             <div className="absolute top-0 right-0 p-12 opacity-5 text-azure-400 pointer-events-none -rotate-12"><LayoutGrid size={150} /></div>
                            
                            <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
                                <div>
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">Matriz de Rendimiento Operativo</h3>
                                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mt-2 italic">Mapa térmico de despliegue de 30 días</p>
                                </div>
                                <div className="flex items-center gap-8 bg-slate-950/40 p-4 rounded-2xl border border-white/5 shadow-inner">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 bg-secondary rounded-sm shadow-[0_0_10px_rgba(255,99,71,0.5)]"></div>
                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] italic">COMPLETADO</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 bg-slate-800 rounded-sm border border-white/5"></div>
                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] italic">PENDIENTE</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-5 relative z-10">
                                {Array.from({ length: 30 }).map((_, i) => {
                                    const day = i + 1
                                    const log = activeCycle?.dailyLogs?.find((l: any) => l.dayNumber === day)
                                    const hasLog = !!log
                                    const isSelected = selectedDay === day
                                    const isLocked = day > currentDayOfCycle
                                    
                                    return (
                                        <motion.button 
                                            whileHover={!isLocked || isAdmin ? { scale: 1.1, zIndex: 20 } : {}}
                                            whileTap={{ scale: 0.95 }}
                                            key={day}
                                            disabled={isLocked && !isAdmin}
                                            onClick={() => openDayLog(day)}
                                            className={`
                                                aspect-square flex flex-col items-center justify-center border transition-all relative group rounded-2xl
                                                ${hasLog ? 'bg-secondary border-secondary shadow-[0_15px_30px_-10px_rgba(255,99,71,0.5)] text-white' : 'bg-slate-950 border-white/5 text-slate-700 hover:border-secondary/40 hover:text-white shadow-inner'}
                                                ${isSelected ? 'ring-4 ring-secondary/30 border-secondary scale-110 z-10 shadow-[0_0_50px_rgba(255,99,71,0.3)]' : ''}
                                                ${isLocked && !isAdmin ? 'opacity-10 cursor-not-allowed grayscale' : ''}
                                            `}
                                        >
                                            <span className="text-xl font-black italic tracking-tighter tracking-widest">
                                                {isLocked && !isAdmin ? <Clock size={16} /> : day.toString().padStart(2, '0')}
                                            </span>
                                            {!isLocked && hasLog && (
                                                <div className="absolute bottom-3 text-white/40 group-hover:text-white transition-colors">
                                                     <CheckCircle2 size={10} />
                                                </div>
                                            )}
                                            
                                            {/* Tooltip Industrial */}
                                            <div className="absolute -top-16 left-1/2 -translate-x-1/2 px-4 py-2 bg-slate-900 border border-white/10 text-white text-[8px] font-black uppercase tracking-[0.4em] opacity-0 group-hover:opacity-100 pointer-events-none transition-all whitespace-nowrap shadow-2xl z-50 rounded-lg italic">
                                                {isLocked && !isAdmin ? "VECT_DAY_LOCKED" : `OPERACIÓN_NODO_D${day}`}
                                            </div>
                                        </motion.button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Day Log Editor (Inlined as a major section) */}
                        <AnimatePresence>
                            {selectedDay && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 50 }}
                                    className="glass-panel !bg-slate-950/80 border border-secondary/20 p-16 rounded-[4rem] shadow-[0_0_150px_rgba(0,0,0,0.8)] relative z-20 backdrop-blur-3xl overflow-hidden"
                                >
                                    <div className="absolute top-0 left-0 w-full h-1.5 bg-secondary overflow-hidden">
                                        <motion.div 
                                            initial={{ x: "-100%" }}
                                            animate={{ x: "100%" }}
                                            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                                            className="w-1/3 h-full bg-white opacity-50"
                                        />
                                    </div>

                                    <div className="flex justify-between items-start mb-16 border-b border-white/5 pb-10">
                                        <div>
                                             <div className="flex items-center space-x-4 mb-4 text-secondary">
                                                <Activity size={20} className="animate-pulse" />
                                                <span className="text-[10px] uppercase font-black tracking-[0.6em] italic">Bitácora de Despliegue</span>
                                            </div>
                                            <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic">
                                                REGISTRO_DÍA <span className="text-secondary">{selectedDay.toString().padStart(2, '0')}</span>
                                            </h3>
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-3 italic">Nodo de sincronización de avances operativos</p>
                                        </div>
                                        <button onClick={() => setSelectedDay(null)} className="p-5 bg-slate-900 border border-white/10 rounded-2xl text-slate-600 hover:text-white transition-all shadow-2xl">
                                            <X size={28} />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 gap-12 max-w-5xl mx-auto">
                                        {(() => {
                                            let functions = [];
                                            try { functions = JSON.parse(activeCycle.functions); } catch(e) { functions = activeCycle.functions || []; }
                                            return functions.map((func: string, idx: number) => (
                                                <div key={idx} className="space-y-6">
                                                    <div className="flex items-center gap-6">
                                                        <div className="w-1.5 h-8 bg-secondary shadow-[0_0_15px_rgba(255,99,71,0.4)]"></div>
                                                        <label className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] italic leading-none">{func}</label>
                                                    </div>
                                                    <textarea 
                                                        value={dayContent[func] || ""}
                                                        onChange={(e) => setDayContent({...dayContent, [func]: e.target.value.toUpperCase()})}
                                                        placeholder={`DESCRIPCIÓN DE AVANCES PARA ${func}...`}
                                                        className="w-full bg-slate-950 border border-white/5 p-10 rounded-[3rem] text-[12px] font-black italic text-white shadow-inner focus:border-secondary transition-all h-48 outline-none resize-none uppercase tracking-widest leading-relaxed placeholder:text-slate-900 custom-scrollbar"
                                                    />
                                                </div>
                                            ));
                                        })()}

                                        <div className="mt-16 flex flex-col md:flex-row justify-between items-center bg-slate-950/40 p-10 rounded-[3rem] border border-white/5 gap-10">
                                            <div className="flex items-center gap-6">
                                                <div className="p-4 bg-azure-500/10 text-azure-400 rounded-2xl border border-azure-500/20 shadow-2xl shadow-azure-500/10">
                                                    <ShieldCheck size={28} />
                                                </div>
                                                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] max-w-xs italic leading-relaxed">
                                                    {isAdmin ? "MODO_ADMIN: LOS REGISTROS ESTÁN EN ESTADO DE SÓLO LECTURA PARA AUDITORÍA." : "NUCLEO_DATA: EL GUARDADO DE ESTA BITÁCORA ES REQUISITO CRÍTICO PARA EL CIERRE DEL CICLO."}
                                                </p>
                                            </div>
                                            {!isAdmin && activeCycle.isActive && (
                                                <button 
                                                    onClick={handleSaveDayLog}
                                                    className="bg-secondary text-white px-16 py-7 text-[12px] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-secondary transition-all shadow-[0_25px_60px_-10px_rgba(255,99,71,0.6)] rounded-[2.5rem] flex items-center gap-6 skew-x-[-12deg] group"
                                                >
                                                    <div className="skew-x-[12deg] flex items-center gap-5">
                                                        <Save size={24} className="group-hover:scale-110 transition-transform" />
                                                        <span>Garantizar Registro_SYNC</span>
                                                    </div>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {!selectedDay && (
                            <div className="py-40 text-center space-y-10 bg-slate-950/20 rounded-[4rem] border border-dashed border-white/5 shadow-inner opacity-50 relative pointer-events-none">
                                <div className="w-24 h-24 bg-slate-950 border border-white/10 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl">
                                    <Target className="text-slate-800" size={48} />
                                </div>
                                <p className="text-slate-800 font-extrabold text-xs uppercase tracking-[0.8em] italic">SELECCIONE UN NODO TEMPORAL PARA AUDITAR RENDIMIENTO</p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
