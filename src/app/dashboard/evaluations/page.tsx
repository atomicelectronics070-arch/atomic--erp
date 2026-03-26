"use client"

import { useState, useEffect } from "react"
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
    ChevronLeft
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
        const data = await getAllUsersWithActiveCycle()
        setUsers(data)
        setLoading(false)
    }

    const loadOwnCycle = async () => {
        if (!session?.user?.id) return
        setLoading(true)
        const cycle = await getActiveWorkCycle(session.user.id)
        if (cycle) {
            setSelectedUser(session.user)
            setActiveCycle(cycle)
            setView("dashboard")
        } else {
            setView("list") // Showing empty list or message
        }
        setLoading(false)
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
            setActiveCycle(updatedUser?.workCycles?.[0] || null)
            setView("dashboard")
        }
        setLoading(false)
    }

    const handleDeactivate = async () => {
        if (!activeCycle) return
        if (confirm("¿Estás seguro de desactivar este ciclo de trabajo?")) {
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
            setActiveCycle(updatedUser?.workCycles?.[0] || null)
            setSelectedDay(null)
        }
        setLoading(false)
    }

    const filteredUsers = users.filter((u: any) => 
        ((u.name || u.email) as string).toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (loading && users.length === 0) {
        return <div className="h-96 flex items-center justify-center font-bold text-orange-600 animate-pulse tracking-widest uppercase">Cargando Rúbricas...</div>
    }

    const currentDayOfCycle = activeCycle ? Math.floor((new Date().getTime() - new Date(activeCycle.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1 : 1

    return (
        <div className="space-y-12 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-neutral-900 uppercase">
                        Control de <span className="text-orange-600">Rúbricas</span>
                    </h1>
                    <p className="text-neutral-400 font-medium text-sm mt-1">Bitácora de evaluación industrial y seguimiento de funciones.</p>
                </div>
                {isAdmin && view !== "list" && (
                    <button
                        onClick={() => setView("list")}
                        className="bg-neutral-900 text-white font-bold text-[10px] uppercase tracking-widest px-6 py-3 hover:bg-orange-600 transition-all flex items-center gap-2"
                    >
                        <ChevronLeft size={16} />
                        Volver al Listado
                    </button>
                )}
            </div>

            {view === "list" && !isAdmin ? (
                <div className="bg-neutral-50 border border-neutral-200 border-dashed p-20 text-center">
                    <Clock className="mx-auto text-neutral-200 mb-6" size={48} />
                    <p className="text-neutral-400 font-bold text-xs uppercase tracking-widest">No tienes un ciclo de trabajo activo. Consulta a tu administrador.</p>
                </div>
            ) : view === "list" ? (
                <div className="bg-white border border-neutral-200 shadow-sm animate-in fade-in duration-500">
                    <div className="p-8 border-b border-neutral-100 flex flex-col md:flex-row justify-between items-center gap-6">
                        <h2 className="text-xl font-bold text-neutral-900 uppercase tracking-tight">Gestión de Ciclos por Usuario</h2>
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300" size={18} />
                            <input
                                type="text"
                                placeholder="Buscar colaborador..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 border border-neutral-100 bg-neutral-50 text-xs font-bold uppercase focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="text-[10px] text-neutral-400 uppercase font-bold tracking-[0.2em] bg-neutral-50/50">
                                <tr>
                                    <th className="px-8 py-5">Colaborador</th>
                                    <th className="px-6 py-5">Estado de Ciclo</th>
                                    <th className="px-6 py-5">Progreso</th>
                                    <th className="px-8 py-5 text-right">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                                {filteredUsers.map((u: any) => {
                                    const cycle = u.workCycles?.[0]
                                    return (
                                        <tr key={u.id} className="hover:bg-neutral-50 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-10 h-10 bg-neutral-900 text-white flex items-center justify-center font-bold text-sm">
                                                        {u.name?.[0] || u.email?.[0]}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-neutral-900 text-sm tracking-tight">{u.name || u.email}</p>
                                                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{u.role}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                {cycle ? (
                                                    <div className="flex flex-col">
                                                        <span className="text-[9px] font-bold text-green-600 bg-green-50 px-3 py-1 border border-green-100 uppercase tracking-widest w-fit">Activo: {cycle.role}</span>
                                                        <span className="text-[8px] text-neutral-400 mt-1 font-bold">Inicia: {new Date(cycle.startDate).toLocaleDateString()}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-[9px] font-bold text-neutral-400 bg-neutral-50 px-3 py-1 border border-neutral-100 uppercase tracking-widest">Inactivo</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-6">
                                                {cycle && (
                                                    <div className="flex items-center space-x-3">
                                                        <div className="flex-1 h-1.5 bg-neutral-100 w-24">
                                                            <div className="h-full bg-orange-600 shadow-[0_0_8px_rgba(234,88,12,0.4)]" style={{ width: `${(cycle.dailyLogs.length / 30) * 100}%` }}></div>
                                                        </div>
                                                        <span className="text-[10px] font-bold text-neutral-900">{cycle.dailyLogs.length}/30D</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <button
                                                    onClick={() => handleSelectUser(u)}
                                                    className="bg-neutral-900 text-white px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest hover:bg-orange-600 transition-all"
                                                >
                                                    {cycle ? "Ver Avances" : "Gestionar Ciclo"}
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : view === "config" ? (
                <div className="max-w-4xl mx-auto bg-white border border-neutral-200 p-12 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex justify-between items-start mb-12 border-b border-neutral-100 pb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-neutral-900 uppercase tracking-tight">Configuración de Ciclo Laboral</h2>
                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-1">Establecer parámetros para: <span className="text-orange-600">{selectedUser?.name || selectedUser?.email}</span></p>
                        </div>
                        <Briefcase className="text-neutral-200" size={40} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Rol Desempeñado</label>
                            <input 
                                type="text"
                                value={cycleForm.role}
                                onChange={(e) => setCycleForm({...cycleForm, role: e.target.value.toUpperCase()})}
                                className="w-full bg-neutral-50 border border-neutral-100 px-5 py-4 text-sm font-bold uppercase outline-none focus:border-orange-500 transition-all font-mono"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Sueldo Fijo ($)</label>
                                <input 
                                    type="number"
                                    value={cycleForm.fixedPay}
                                    onChange={(e) => setCycleForm({...cycleForm, fixedPay: parseFloat(e.target.value) || 0})}
                                    className="w-full bg-neutral-50 border border-neutral-100 px-5 py-4 text-sm font-bold outline-none focus:border-orange-500 transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Comisión (%)</label>
                                <input 
                                    type="number"
                                    value={cycleForm.commissionPct}
                                    onChange={(e) => setCycleForm({...cycleForm, commissionPct: parseFloat(e.target.value) || 0})}
                                    className="w-full bg-neutral-50 border border-neutral-100 px-5 py-4 text-sm font-bold outline-none focus:border-orange-500 transition-all"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Fecha de Inicio</label>
                            <input 
                                type="date"
                                value={cycleForm.startDate}
                                onChange={(e) => setCycleForm({...cycleForm, startDate: e.target.value})}
                                className="w-full bg-neutral-50 border border-neutral-100 px-5 py-4 text-sm font-bold outline-none focus:border-orange-500 transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Fecha Fin (Estimada)</label>
                            <input 
                                type="date"
                                value={cycleForm.endDate}
                                onChange={(e) => setCycleForm({...cycleForm, endDate: e.target.value})}
                                className="w-full bg-neutral-50 border border-neutral-100 px-5 py-4 text-sm font-bold outline-none focus:border-orange-500 transition-all"
                            />
                        </div>
                    </div>

                    <div className="mt-12 space-y-6">
                        <div className="flex justify-between items-center border-b border-neutral-100 pb-4">
                            <h3 className="text-sm font-bold text-neutral-800 uppercase tracking-widest">Funciones a Realizar</h3>
                            <div className="flex gap-2">
                                <input 
                                    type="text"
                                    value={newFunction}
                                    onChange={(e) => setNewFunction(e.target.value)}
                                    placeholder="Nueva función operativa..."
                                    className="bg-neutral-50 border border-neutral-100 px-4 py-2 text-[10px] font-bold uppercase outline-none focus:border-orange-500 w-48 transition-all"
                                />
                                <button 
                                    onClick={() => { if(newFunction) { setCycleForm({...cycleForm, functions: [...cycleForm.functions, newFunction.toUpperCase()]}); setNewFunction(""); } }}
                                    className="bg-neutral-900 text-white p-2 hover:bg-orange-600 transition-all"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {cycleForm.functions.map((f, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-neutral-50 border border-neutral-100 group hover:border-orange-200 transition-all">
                                    <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest">{f}</span>
                                    <button 
                                        onClick={() => setCycleForm({...cycleForm, functions: cycleForm.functions.filter((_, idx) => idx !== i)})}
                                        className="text-neutral-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-16 flex flex-col md:flex-row gap-4">
                        <button 
                            onClick={handleActivateCycle}
                            disabled={!isAdmin}
                            className={`flex-1 ${isAdmin ? 'bg-neutral-900 hover:bg-orange-600' : 'bg-neutral-300'} text-white px-12 py-5 text-[10px] font-bold uppercase tracking-[0.3em] transition-all shadow-xl`}
                        >
                            Habilitar Ciclo de Trabajo
                        </button>
                        <button 
                            onClick={() => setView("list")}
                            className="bg-neutral-50 border border-neutral-200 text-neutral-400 font-bold text-[10px] uppercase tracking-widest px-8 py-5 hover:text-neutral-900 transition-all"
                        >
                            Descartar
                        </button>
                    </div>
                </div>
            ) : view === "history" ? (
                <div className="space-y-12 animate-in fade-in duration-500">
                    <div className="bg-white border border-neutral-200 p-12">
                        <div className="flex justify-between items-center mb-12 border-b border-neutral-100 pb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-neutral-900 uppercase tracking-tight">Historial de Ciclos</h2>
                                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-1">Registros históricos de: <span className="text-orange-600">{selectedUser?.name || selectedUser?.email}</span></p>
                            </div>
                            <button onClick={() => setView(activeCycle ? "dashboard" : "list")} className="text-neutral-400 hover:text-neutral-900">
                                <ChevronLeft size={24} />
                            </button>
                        </div>

                        {pastCycles.length === 0 ? (
                            <div className="py-20 text-center">
                                <Clock className="mx-auto text-neutral-100 mb-4" size={48} />
                                <p className="text-neutral-300 font-bold text-xs uppercase tracking-widest">No hay ciclos anteriores registrados.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6">
                                {pastCycles.map((cycle, idx) => (
                                    <div key={cycle.id} className="bg-neutral-50 border border-neutral-100 p-8 flex flex-col md:flex-row justify-between items-center gap-6 group hover:border-orange-200 transition-all">
                                        <div className="flex items-center gap-6">
                                            <div className="w-12 h-12 bg-neutral-200 text-neutral-500 flex items-center justify-center font-bold text-lg">
                                                {pastCycles.length - idx}
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-widest">{cycle.role}</h3>
                                                <p className="text-[10px] text-neutral-400 font-bold uppercase mt-1">
                                                    {new Date(cycle.startDate).toLocaleDateString()} - {new Date(cycle.endDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-12">
                                            <div className="text-right">
                                                <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Sueldo Base</p>
                                                <p className="font-bold text-neutral-900">${cycle.fixedPay}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Logs</p>
                                                <p className="font-bold text-orange-600">{cycle.dailyLogs?.length || 0}/30</p>
                                            </div>
                                            <button 
                                                onClick={() => { setActiveCycle(cycle); setView("dashboard"); }}
                                                className="bg-neutral-900 text-white px-6 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-orange-600 transition-all"
                                            >
                                                Ver Detalle
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="space-y-12 animate-in fade-in duration-500">
                    {/* Header Dash */}
                    <div className="bg-white border border-neutral-200 p-10 flex flex-col md:flex-row justify-between items-center gap-8 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-2 h-full bg-orange-600"></div>
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-neutral-950 text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-neutral-200">
                                {selectedUser?.name?.[0] || selectedUser?.email?.[0]}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-neutral-900 uppercase tracking-tight">{selectedUser?.name || selectedUser?.email}</h2>
                                <div className="flex items-center gap-4 mt-1">
                                    <span className="text-[10px] font-bold text-orange-600 uppercase tracking-[0.2em]">{activeCycle?.role}</span>
                                    <span className="text-neutral-200">|</span>
                                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Día {activeCycle?.dailyLogs.length} de 30</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap justify-center gap-6">
                            <div className="text-center md:text-right px-6 border-r border-neutral-100">
                                <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Pago Fijo Base</p>
                                <p className="text-xl font-bold text-neutral-900">${activeCycle?.fixedPay}</p>
                            </div>
                            <div className="text-center md:text-right px-6 md:border-r border-neutral-100">
                                <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Comisiones</p>
                                <p className="text-xl font-bold text-orange-600">{activeCycle?.commissionPct}%</p>
                            </div>
                            {isAdmin && (
                                <button 
                                    onClick={handleDeactivate}
                                    className="bg-red-50 text-red-600 px-6 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all border border-red-100"
                                >
                                    Desactivar Ciclo
                                </button>
                            )}
                            <button 
                                onClick={() => setView("history")}
                                className="bg-neutral-900 text-white px-6 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-orange-600 transition-all border border-neutral-800"
                            >
                                Ver Historial
                            </button>
                        </div>
                    </div>

                    {/* 30 Day Graph */}
                    <div className="bg-white border border-neutral-200 p-12">
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-[0.2em]">Mapa de Rendimiento Operativo</h3>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-orange-600"></div>
                                    <span className="text-[8px] font-bold text-neutral-400 uppercase">Completado</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-neutral-100 border border-neutral-200"></div>
                                    <span className="text-[8px] font-bold text-neutral-400 uppercase">Pendiente</span>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-3">
                            {Array.from({ length: 30 }).map((_, i) => {
                                const day = i + 1
                                const hasLog = activeCycle?.dailyLogs?.some((l: any) => l.dayNumber === day)
                                const isSelected = selectedDay === day
                                const isLocked = day > currentDayOfCycle
                                
                                return (
                                    <button 
                                        key={day}
                                        disabled={isLocked && !isAdmin}
                                        onClick={() => openDayLog(day)}
                                        className={`
                                            aspect-square flex flex-col items-center justify-center border transition-all relative group
                                            ${hasLog ? 'bg-orange-600 border-orange-600 text-white shadow-lg shadow-orange-100' : 'bg-white border-neutral-100 text-neutral-300 hover:border-orange-300 hover:text-orange-600'}
                                            ${isSelected ? 'ring-4 ring-orange-100 border-orange-600 transform scale-110 z-10' : ''}
                                            ${isLocked && !isAdmin ? 'opacity-30 cursor-not-allowed bg-neutral-50' : ''}
                                        `}
                                    >
                                        <span className="text-lg font-bold tracking-tighter">
                                            {isLocked && !isAdmin ? <Clock size={14} className="mb-1" /> : day}
                                        </span>
                                        {!isLocked && hasLog && <CheckCircle2 size={12} className="absolute bottom-2" />}
                                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-neutral-900 text-white text-[8px] font-bold py-2 px-3 opacity-0 group-hover:opacity-100 pointer-events-none transition-all whitespace-nowrap uppercase tracking-widest">
                                            {isLocked && !isAdmin ? "Día Bloqueado" : `Día Operativo ${day}`}
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Day Log Editor */}
                    {selectedDay ? (
                        <div className="bg-neutral-900 border border-neutral-800 p-12 animate-in zoom-in-95 duration-300 shadow-2xl">
                            <div className="flex justify-between items-center mb-12 border-b border-neutral-800 pb-8">
                                <h3 className="text-2xl font-bold text-white uppercase tracking-tight flex items-center gap-4">
                                    <Calendar className="text-orange-600" size={32} />
                                    Registro de Rendimiento: Día {selectedDay}
                                </h3>
                                <button onClick={() => setSelectedDay(null)} className="text-neutral-500 hover:text-white transition-all">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 gap-10">
                                {JSON.parse(activeCycle.functions).map((func: string, idx: number) => (
                                    <div key={idx} className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1.5 h-6 bg-orange-600"></div>
                                            <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest block">{func}</label>
                                        </div>
                                        <textarea 
                                            value={dayContent[func] || ""}
                                            onChange={(e) => setDayContent({...dayContent, [func]: e.target.value})}
                                            placeholder={`Describa el avance para ${func}...`}
                                            className="w-full bg-neutral-950 border border-neutral-800 p-6 text-xs font-bold uppercase outline-none focus:border-orange-500 transition-all h-32 resize-none text-white placeholder:text-neutral-700"
                                        />
                                    </div>
                                ))}

                                <div className="mt-8 flex justify-between items-center">
                                    <p className="text-[10px] font-bold text-neutral-600 uppercase tracking-[0.2em] max-w-sm">
                                        {isAdmin ? "* Vista de administrador: solo lectura de avances." : "* La información guardada se reflejará en el reporte consolidado de 30 días."}
                                    </p>
                                    {!isAdmin && activeCycle.isActive && (
                                        <button 
                                            onClick={handleSaveDayLog}
                                            className="bg-orange-600 text-white px-12 py-5 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-orange-700 transition-all flex items-center gap-4 shadow-xl shadow-orange-900/20"
                                        >
                                            <Save size={18} />
                                            <span>Garantizar Registro</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-neutral-50 border border-neutral-200 border-dashed p-20 text-center">
                            <Clock className="mx-auto text-neutral-200 mb-6" size={48} />
                            <p className="text-neutral-400 font-bold text-xs uppercase tracking-widest">Seleccione un día del calendario para registrar los avances operativos</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
