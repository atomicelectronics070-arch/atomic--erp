"use client"

import React, { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Calendar, CheckSquare, Clock, Users, User, Phone, 
    Save, Plus, AlertCircle, CheckCircle2, ChevronRight, X, 
    Sparkles, Shield, TrendingUp, RefreshCw, MessageSquare, 
    FileText, Tag, Award, ShieldAlert, Edit3, ArrowRight, Share2, MapPin
} from "lucide-react"
import BajoComisionModal from "./BajoComisionModal"
import { ATOMIC_CATEGORIES } from "./AdvisorsTabContent"

interface EquipoAsistenciasViewProps {
    preselectedAdvisorId?: string
    isModal?: boolean
    onClose?: () => void
}

export default function EquipoAsistenciasView({
    preselectedAdvisorId,
    isModal = false,
    onClose
}: EquipoAsistenciasViewProps) {
    const [loadingAdvisors, setLoadingAdvisors] = useState(true)
    const [advisors, setAdvisors] = useState<any[]>([])
    const [selectedAdvisorId, setSelectedAdvisorId] = useState<string>("")
    const [advisorSearch, setAdvisorSearch] = useState("")

    // Active Advisor Cycle Data
    const [loadingCycle, setLoadingCycle] = useState(false)
    const [selectedUser, setSelectedUser] = useState<any>(null)
    const [cycleData, setCycleData] = useState<any>(null)

    // Form: Iniciar Ciclo Laboral View (Panel Inline sin doble capa)
    const [showStartCyclePanel, setShowStartCyclePanel] = useState(false)
    const [startCycleForm, setStartCycleForm] = useState({
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        daysCount: 30,
        cycleAgreement: "Sueldo base sujeto a cumplimiento de 30 días operacionales + comisiones por cierre de cotizaciones PROP.",
        firstName: "",
        lastName: "",
        phone: "",
        category: ATOMIC_CATEGORIES[0]
    })
    const [savingCycle, setSavingCycle] = useState(false)

    // Form: Day Editor Panel (Drawer / Panel Inline sin doble capa)
    const [selectedDay, setSelectedDay] = useState<any | null>(null)
    const [dayEditForm, setDayEditForm] = useState({
        status: "COMPLETED",
        posts: 5,
        groupPosts: 3,
        numbers: 10,
        calls: 7,
        personalStatuses: 5,
        brandCampaign: true,
        observations: "",
        clockInTime: "08:30:00",
        clockOutTime: "17:30:00"
    })
    const [savingDay, setSavingDay] = useState(false)

    // Bajo Comision Modal State
    const [showBajoComisionModal, setShowBajoComisionModal] = useState(false)

    // Notification toast
    const [toastMessage, setToastMessage] = useState<string | null>(null)
    const showToast = (msg: string) => {
        setToastMessage(msg)
        setTimeout(() => setToastMessage(null), 3000)
    }

    // 1. Fetch Advisors List on Mount
    useEffect(() => {
        const fetchAdvisors = async () => {
            setLoadingAdvisors(true)
            try {
                const res = await fetch("/api/admin/attendance-team")
                const data = await res.json()
                if (data.advisors) {
                    setAdvisors(data.advisors)
                    if (preselectedAdvisorId) {
                        setSelectedAdvisorId(preselectedAdvisorId)
                    } else if (data.advisors.length > 0 && !selectedAdvisorId) {
                        setSelectedAdvisorId(data.advisors[0].id)
                    }
                }
            } catch (e) {
                console.error("Error loading advisors:", e)
            } finally {
                setLoadingAdvisors(false)
            }
        }
        fetchAdvisors()
    }, [preselectedAdvisorId])

    // 2. Fetch Selected Advisor's Cycle and Days
    const fetchAdvisorCycle = async (userId: string) => {
        if (!userId) return
        setLoadingCycle(true)
        try {
            const res = await fetch(`/api/admin/attendance-team?userId=${userId}`)
            const data = await res.json()
            if (data.success) {
                setSelectedUser(data.user)
                setCycleData(data.cycle)
                // Pre-fill start cycle form with user details
                setStartCycleForm(prev => ({
                    ...prev,
                    firstName: data.user.name || "",
                    lastName: data.user.lastName || "",
                    phone: data.user.phoneNumber || "",
                    category: data.cycle?.category || ATOMIC_CATEGORIES[0]
                }))
            }
        } catch (e) {
            console.error("Error fetching advisor cycle:", e)
        } finally {
            setLoadingCycle(false)
        }
    }

    useEffect(() => {
        if (selectedAdvisorId) {
            fetchAdvisorCycle(selectedAdvisorId)
        }
    }, [selectedAdvisorId])

    // Filtered Advisors
    const filteredAdvisors = useMemo(() => {
        if (!advisorSearch) return advisors
        const q = advisorSearch.toLowerCase()
        return advisors.filter(a => 
            (a.name || "").toLowerCase().includes(q) ||
            (a.lastName || "").toLowerCase().includes(q) ||
            (a.email || "").toLowerCase().includes(q) ||
            (a.phoneNumber || "").toLowerCase().includes(q)
        )
    }, [advisors, advisorSearch])

    // 3. Handle Submit Iniciar Ciclo Laboral
    const handleStartCycle = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedAdvisorId) return
        setSavingCycle(true)
        try {
            const res = await fetch("/api/admin/attendance-team", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "start_cycle",
                    userId: selectedAdvisorId,
                    startDate: startCycleForm.startDate,
                    endDate: startCycleForm.endDate,
                    daysCount: startCycleForm.daysCount,
                    cycleAgreement: startCycleForm.cycleAgreement,
                    firstName: startCycleForm.firstName,
                    lastName: startCycleForm.lastName,
                    phone: startCycleForm.phone,
                    category: startCycleForm.category
                })
            })
            const data = await res.json()
            if (data.success) {
                showToast("¡Ciclo laboral iniciado exitosamente!")
                setShowStartCyclePanel(false)
                await fetchAdvisorCycle(selectedAdvisorId)
            } else {
                alert(data.error || "No se pudo iniciar el ciclo")
            }
        } catch (e: any) {
            alert(e.message || "Error al procesar")
        } finally {
            setSavingCycle(false)
        }
    }

    // 4. Open Day Editor Form
    const handleOpenDayEditor = (day: any) => {
        setSelectedDay(day)
        setDayEditForm({
            status: day.status || "COMPLETED",
            posts: day.posts || 0,
            groupPosts: day.groupPosts || 0,
            numbers: day.numbers || 0,
            calls: day.calls || 0,
            personalStatuses: day.personalStatuses || 0,
            brandCampaign: !!day.brandCampaign,
            observations: day.observations || "",
            clockInTime: day.clockInTime || "08:30:00",
            clockOutTime: day.clockOutTime || "17:30:00"
        })
    }

    // 5. Save Day Activities & Observations
    const handleSaveDayEdit = async () => {
        if (!selectedDay || !cycleData) return
        setSavingDay(true)
        try {
            const res = await fetch("/api/admin/attendance-team", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "update_day",
                    cycleId: cycleData.id,
                    dayNumber: selectedDay.dayNumber,
                    status: dayEditForm.status,
                    activities: {
                        posts: dayEditForm.posts,
                        groupPosts: dayEditForm.groupPosts,
                        numbers: dayEditForm.numbers,
                        calls: dayEditForm.calls,
                        personalStatuses: dayEditForm.personalStatuses,
                        brandCampaign: dayEditForm.brandCampaign
                    },
                    observations: dayEditForm.observations,
                    clockInTime: dayEditForm.clockInTime,
                    clockOutTime: dayEditForm.clockOutTime
                })
            })
            const data = await res.json()
            if (data.success) {
                showToast(`Día ${selectedDay.dayNumber} ajustado correctamente`)
                setSelectedDay(null)
                await fetchAdvisorCycle(selectedAdvisorId)
            } else {
                alert(data.error || "Error al actualizar día")
            }
        } catch (e: any) {
            alert(e.message || "Error en la petición")
        } finally {
            setSavingDay(false)
        }
    }

    return (
        <div className="w-full flex flex-col bg-[#070b1a] border border-cyan-500/30 rounded-3xl text-white overflow-hidden shadow-2xl relative">
            {/* Header */}
            <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-black/40 backdrop-blur-md shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30 shrink-0">
                        <Calendar size={20} className="stroke-[2.5]" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-mono font-black text-cyan-400 uppercase tracking-widest flex items-center gap-1">
                                <Sparkles size={11} />
                                <span>Supervisión & Coordinación de Equipo</span>
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                                Sincronizado en Vivo
                            </span>
                        </div>
                        <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                            Consola de Asistencias & Ciclos Laborales
                        </h2>
                    </div>
                </div>

                {isModal && onClose && (
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        title="Cerrar ventana"
                    >
                        <X size={18} />
                    </button>
                )}
            </div>

            {/* Toast Notification */}
            {toastMessage && (
                <div className="absolute top-16 right-6 z-40 px-4 py-2.5 rounded-xl bg-emerald-500 text-black font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce border-2 border-white">
                    <CheckCircle2 size={16} />
                    <span>{toastMessage}</span>
                </div>
            )}

            {/* Split Content: Left Sidebar Selector + Right Main Matrix */}
            <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-white/10 min-h-[580px]">
                
                {/* ── COLUMNA IZQUIERDA: SELECTOR DE ASESORES ── */}
                <div className="w-full lg:w-72 shrink-0 p-4 space-y-4 bg-black/20 flex flex-col">
                    <div>
                        <label className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-2">
                            1. Seleccionar Asesor
                        </label>
                        <input
                            type="text"
                            placeholder="Buscar por nombre, email o tel..."
                            value={advisorSearch}
                            onChange={(e) => setAdvisorSearch(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400"
                        />
                    </div>

                    {/* Advisors List */}
                    <div className="flex-1 overflow-y-auto space-y-1.5 max-h-[320px] lg:max-h-[500px] pr-1 custom-scrollbar">
                        {loadingAdvisors ? (
                            <div className="text-center py-8 text-slate-500 text-xs flex items-center justify-center gap-2">
                                <RefreshCw size={14} className="animate-spin text-cyan-400" />
                                <span>Cargando colaboradores...</span>
                            </div>
                        ) : filteredAdvisors.length === 0 ? (
                            <div className="text-center py-8 text-slate-500 text-xs">
                                No se encontraron colaboradores.
                            </div>
                        ) : (
                            filteredAdvisors.map(adv => {
                                const isSelected = adv.id === selectedAdvisorId
                                const fullName = `${adv.name || ""} ${adv.lastName || ""}`.trim() || adv.email
                                return (
                                    <button
                                        key={adv.id}
                                        type="button"
                                        onClick={() => {
                                            setSelectedAdvisorId(adv.id)
                                            setShowStartCyclePanel(false)
                                            setSelectedDay(null)
                                        }}
                                        className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center gap-2.5 cursor-pointer ${
                                            isSelected 
                                                ? "bg-gradient-to-r from-cyan-500/25 to-blue-600/25 border-2 border-cyan-400/80 text-white shadow-lg shadow-cyan-950/50" 
                                                : "bg-white/5 border border-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                                        }`}
                                    >
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                                            isSelected ? "bg-cyan-400 text-black" : "bg-white/10 text-slate-300"
                                        }`}>
                                            {fullName.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-bold text-xs truncate">{fullName}</div>
                                            <div className="text-[10px] text-slate-400 truncate">{adv.email}</div>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <span className="text-[8px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-slate-300">
                                                    {adv.role}
                                                </span>
                                                {adv.phoneNumber && (
                                                    <span className="text-[8px] font-mono text-cyan-400">
                                                        {adv.phoneNumber}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        {isSelected && (
                                            <ChevronRight size={14} className="text-cyan-400 shrink-0" />
                                        )}
                                    </button>
                                )
                            })
                        )}
                    </div>

                    {/* Botón Reglamento Bajo Comisión */}
                    <button
                        type="button"
                        onClick={() => setShowBajoComisionModal(true)}
                        className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 hover:border-amber-400 text-amber-300 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                    >
                        <ShieldAlert size={14} />
                        <span>Reglamento "Bajo Comisión"</span>
                    </button>
                </div>

                {/* ── COLUMNA DERECHA: GESTIÓN DE CICLO Y MATRIZ DE DÍAS ── */}
                <div className="flex-1 p-4 sm:p-6 space-y-5 overflow-y-auto">
                    
                    {loadingCycle ? (
                        <div className="text-center py-20 text-slate-400 text-sm flex flex-col items-center gap-3">
                            <RefreshCw size={24} className="animate-spin text-cyan-400" />
                            <span>Cargando ciclo laboral y matriz de asistencia...</span>
                        </div>
                    ) : !selectedUser ? (
                        <div className="text-center py-20 text-slate-400 text-sm">
                            Selecciona un colaborador del panel lateral para inspeccionar o iniciar su ciclo.
                        </div>
                    ) : (
                        <>
                            {/* ── ADVISOR HEADER CARD & CYCLE SUMMARY ── */}
                            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900/90 via-[#0a1128] to-slate-900/90 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
                                <div className="flex items-center gap-3.5">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white text-lg font-black shadow-lg shadow-cyan-500/20 shrink-0">
                                        {(selectedUser.name || "A").charAt(0).toUpperCase()}
                                    </div>
                                    <div className="space-y-0.5">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h3 className="text-base sm:text-lg font-black text-white">
                                                {selectedUser.name} {selectedUser.lastName || ""}
                                            </h3>
                                            <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-white/10 text-slate-300">
                                                {selectedUser.role}
                                            </span>
                                            {cycleData?.isActive ? (
                                                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                                                    Ciclo Activo ({cycleData.daysCount} Días)
                                                </span>
                                            ) : (
                                                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                                    Sin Ciclo Formal
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-xs text-slate-400 flex items-center gap-3 flex-wrap">
                                            <span>{selectedUser.email}</span>
                                            {selectedUser.phoneNumber && (
                                                <span className="flex items-center gap-1 text-cyan-300 font-mono">
                                                    <Phone size={11} /> {selectedUser.phoneNumber}
                                                </span>
                                            )}
                                            {cycleData?.category && (
                                                <span className="flex items-center gap-1 text-amber-300">
                                                    <Tag size={11} /> {cycleData.category}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Action: Iniciar / Reajustar Ciclo Laboral */}
                                <div className="flex items-center gap-2 self-stretch md:self-auto">
                                    <button
                                        type="button"
                                        onClick={() => setShowStartCyclePanel(!showStartCyclePanel)}
                                        className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/25 active:scale-95 cursor-pointer"
                                    >
                                        <PlayIcon size={14} />
                                        <span>{showStartCyclePanel ? "Ocultar Formulario" : cycleData?.isActive ? "Reajustar Ciclo" : "Iniciar Ciclo Laboral"}</span>
                                    </button>
                                </div>
                            </div>

                            {/* ── PANEL INLINE: FORMULARIO INICIAR / REAJUSTAR CICLO LABORAL (SIN DOBLE CAPA) ── */}
                            <AnimatePresence>
                                {showStartCyclePanel && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-5 rounded-2xl bg-gradient-to-b from-[#0e1633] to-[#070b1a] border-2 border-emerald-500/50 shadow-2xl space-y-4">
                                            <div className="flex items-center justify-between border-b border-white/10 pb-2">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={18} className="text-emerald-400" />
                                                    <h4 className="text-sm font-black text-white uppercase tracking-wide">
                                                        Configuración de Ciclo Laboral para {selectedUser.name}
                                                    </h4>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowStartCyclePanel(false)}
                                                    className="p-1 rounded-lg text-slate-400 hover:text-white"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>

                                            <form onSubmit={handleStartCycle} className="space-y-3 text-xs">
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                    <div>
                                                        <label className="text-slate-400 block mb-1 font-bold">Fecha de Inicio:</label>
                                                        <input
                                                            type="date"
                                                            required
                                                            value={startCycleForm.startDate}
                                                            onChange={(e) => setStartCycleForm({ ...startCycleForm, startDate: e.target.value })}
                                                            className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-emerald-400 font-mono"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-slate-400 block mb-1 font-bold">Fecha de Fin:</label>
                                                        <input
                                                            type="date"
                                                            required
                                                            value={startCycleForm.endDate}
                                                            onChange={(e) => setStartCycleForm({ ...startCycleForm, endDate: e.target.value })}
                                                            className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-emerald-400 font-mono"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-slate-400 block mb-1 font-bold">Días de Ciclo:</label>
                                                        <input
                                                            type="number"
                                                            required
                                                            min={1}
                                                            max={365}
                                                            value={startCycleForm.daysCount}
                                                            onChange={(e) => setStartCycleForm({ ...startCycleForm, daysCount: parseInt(e.target.value) || 30 })}
                                                            className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-emerald-400 font-mono font-bold"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                    <div>
                                                        <label className="text-slate-400 block mb-1 font-bold">Nombres del Vendedor:</label>
                                                        <input
                                                            type="text"
                                                            placeholder="Ej: Luisa"
                                                            value={startCycleForm.firstName}
                                                            onChange={(e) => setStartCycleForm({ ...startCycleForm, firstName: e.target.value })}
                                                            className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-emerald-400"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-slate-400 block mb-1 font-bold">Apellidos:</label>
                                                        <input
                                                            type="text"
                                                            placeholder="Ej: Sabando"
                                                            value={startCycleForm.lastName}
                                                            onChange={(e) => setStartCycleForm({ ...startCycleForm, lastName: e.target.value })}
                                                            className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-emerald-400"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-slate-400 block mb-1 font-bold">Número de Teléfono:</label>
                                                        <input
                                                            type="text"
                                                            placeholder="Ej: 0991234567"
                                                            value={startCycleForm.phone}
                                                            onChange={(e) => setStartCycleForm({ ...startCycleForm, phone: e.target.value })}
                                                            className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-emerald-400 font-mono"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="text-slate-400 block mb-1 font-bold">Asignar Categoría Principal:</label>
                                                    <select
                                                        value={startCycleForm.category}
                                                        onChange={(e) => setStartCycleForm({ ...startCycleForm, category: e.target.value })}
                                                        className="w-full px-3 py-2 rounded-xl bg-[#090d1f] border border-white/15 text-white focus:outline-none focus:border-emerald-400"
                                                    >
                                                        {ATOMIC_CATEGORIES.map(cat => (
                                                            <option key={cat} value={cat}>{cat}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="text-slate-400 block mb-1 font-bold">Acuerdo de Ciclo (Términos / Metas):</label>
                                                    <textarea
                                                        rows={2}
                                                        value={startCycleForm.cycleAgreement}
                                                        onChange={(e) => setStartCycleForm({ ...startCycleForm, cycleAgreement: e.target.value })}
                                                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-emerald-400 resize-none"
                                                        placeholder="Detalla aquí el acuerdo económico, porcentaje de comisión o condiciones..."
                                                    />
                                                </div>

                                                <div className="pt-1 flex items-center justify-end gap-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowStartCyclePanel(false)}
                                                        className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold"
                                                    >
                                                        Cancelar
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        disabled={savingCycle}
                                                        className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-950/50 cursor-pointer"
                                                    >
                                                        {savingCycle ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                                                        <span>Guardar e Iniciar Ciclo</span>
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* ── BARRA DE PROGRESO DEL CICLO LABORAL (SINCRONIZADA EN VIVO) ── */}
                            {cycleData && (
                                <div className="p-4 rounded-2xl bg-black/40 border border-cyan-500/30 space-y-2.5">
                                    <div className="flex items-center justify-between text-xs font-mono flex-wrap gap-2">
                                        <span className="text-slate-300 font-bold flex items-center gap-2">
                                            <TrendingUp size={14} className="text-cyan-400" />
                                            <span>Cumplimiento del Ciclo ({cycleData.completedDays} / {cycleData.daysCount} días completados)</span>
                                        </span>
                                        <span className="text-cyan-300 font-black text-sm">
                                            {cycleData.progressPercent}% Cumplido
                                        </span>
                                    </div>
                                    <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-white/10 p-0.5">
                                        <div 
                                            className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 rounded-full transition-all duration-700 shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                                            style={{ width: `${Math.min(100, cycleData.progressPercent || 0)}%` }}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 flex-wrap gap-2">
                                        <span>Inicio: {cycleData.startDate} &bull; Fin: {cycleData.endDate}</span>
                                        <span className="text-emerald-400 font-bold">{cycleData.daysRemaining} días restantes</span>
                                    </div>
                                </div>
                            )}

                            {/* ── PANEL INLINE: EDITOR DEL DÍA SELECCIONADO (SIN DOBLE CAPA) ── */}
                            <AnimatePresence>
                                {selectedDay && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="p-5 rounded-2xl bg-gradient-to-b from-[#0d1532] to-[#060a17] border-2 border-cyan-400/60 shadow-2xl text-white space-y-4"
                                    >
                                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                                            <div className="flex items-center gap-2.5">
                                                <div className="p-2 rounded-xl bg-cyan-400 text-black">
                                                    <Edit3 size={16} />
                                                </div>
                                                <div>
                                                    <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest">
                                                        Ajuste Diario &bull; {selectedUser.name}
                                                    </span>
                                                    <h3 className="text-base font-black text-white">
                                                        Editar Día {selectedDay.dayNumber} ({selectedDay.date})
                                                    </h3>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setSelectedDay(null)}
                                                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>

                                        <div className="space-y-3.5 text-xs">
                                            {/* Estado del Día */}
                                            <div>
                                                <label className="text-slate-400 block mb-1 font-bold">Estado Oficial del Día:</label>
                                                <div className="grid grid-cols-4 gap-2">
                                                    {[
                                                        { id: "COMPLETED", label: "Completado", color: "bg-emerald-500 text-black font-black" },
                                                        { id: "IN_PROGRESS", label: "En Curso", color: "bg-cyan-400 text-black font-black" },
                                                        { id: "PENDING", label: "Pendiente", color: "bg-slate-700 text-white" },
                                                        { id: "LIBRE", label: "Descanso", color: "bg-purple-500 text-white" },
                                                    ].map(st => (
                                                        <button
                                                            key={st.id}
                                                            type="button"
                                                            onClick={() => setDayEditForm({ ...dayEditForm, status: st.id })}
                                                            className={`py-2 px-1 text-center rounded-xl text-[11px] transition-all cursor-pointer ${
                                                                dayEditForm.status === st.id 
                                                                    ? `${st.color} shadow-md scale-102` 
                                                                    : "bg-white/5 text-slate-400 hover:bg-white/10"
                                                            }`}
                                                        >
                                                            {st.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Activities Checklist & Counters */}
                                            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2.5">
                                                <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                                                    Metas Diarias & Actividades:
                                                </div>

                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                                    <div>
                                                        <label className="text-slate-300 block mb-0.5 text-[11px]">Posts Marketplace (5):</label>
                                                        <input
                                                            type="number"
                                                            min={0}
                                                            value={dayEditForm.posts}
                                                            onChange={(e) => setDayEditForm({ ...dayEditForm, posts: parseInt(e.target.value) || 0 })}
                                                            className="w-full px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/15 text-white font-mono"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-slate-300 block mb-0.5 text-[11px]">Grupos FB (3):</label>
                                                        <input
                                                            type="number"
                                                            min={0}
                                                            value={dayEditForm.groupPosts}
                                                            onChange={(e) => setDayEditForm({ ...dayEditForm, groupPosts: parseInt(e.target.value) || 0 })}
                                                            className="w-full px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/15 text-white font-mono"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-slate-300 block mb-0.5 text-[11px]">Números Maps (10):</label>
                                                        <input
                                                            type="number"
                                                            min={0}
                                                            value={dayEditForm.numbers}
                                                            onChange={(e) => setDayEditForm({ ...dayEditForm, numbers: parseInt(e.target.value) || 0 })}
                                                            className="w-full px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/15 text-white font-mono"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-slate-300 block mb-0.5 text-[11px]">Llamadas (7):</label>
                                                        <input
                                                            type="number"
                                                            min={0}
                                                            value={dayEditForm.calls}
                                                            onChange={(e) => setDayEditForm({ ...dayEditForm, calls: parseInt(e.target.value) || 0 })}
                                                            className="w-full px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/15 text-white font-mono"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Clock In / Out Times */}
                                                <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-white/10">
                                                    <div>
                                                        <label className="text-slate-300 block mb-0.5 text-[11px]">Hora Entrada:</label>
                                                        <input
                                                            type="text"
                                                            placeholder="08:30:00"
                                                            value={dayEditForm.clockInTime}
                                                            onChange={(e) => setDayEditForm({ ...dayEditForm, clockInTime: e.target.value })}
                                                            className="w-full px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/15 text-emerald-400 font-mono text-center"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-slate-300 block mb-0.5 text-[11px]">Hora Salida:</label>
                                                        <input
                                                            type="text"
                                                            placeholder="17:30:00"
                                                            value={dayEditForm.clockOutTime}
                                                            onChange={(e) => setDayEditForm({ ...dayEditForm, clockOutTime: e.target.value })}
                                                            className="w-full px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/15 text-rose-400 font-mono text-center"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Observaciones Recuadro */}
                                            <div>
                                                <label className="text-slate-400 block mb-1 font-bold">Observaciones / Notas del Coordinador:</label>
                                                <textarea
                                                    rows={2}
                                                    value={dayEditForm.observations}
                                                    onChange={(e) => setDayEditForm({ ...dayEditForm, observations: e.target.value })}
                                                    placeholder="Escribe aquí justificaciones, permisos o felicitaciones sobre la jornada..."
                                                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-cyan-400 resize-none text-xs"
                                                />
                                            </div>

                                            {/* Submit Day Button */}
                                            <div className="pt-1 flex items-center justify-end gap-2.5">
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedDay(null)}
                                                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold"
                                                >
                                                    Cancelar
                                                </button>
                                                <button
                                                    type="button"
                                                    disabled={savingDay}
                                                    onClick={handleSaveDayEdit}
                                                    className="px-5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-black uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-950/50 cursor-pointer"
                                                >
                                                    {savingDay ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                                                    <span>Guardar Ajuste de Día {selectedDay.dayNumber}</span>
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* ── MATRIZ DE DÍAS DINÁMICA (E.G. 30 DÍAS) ── */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={16} className="text-cyan-400" />
                                        <h4 className="text-sm font-black text-white uppercase tracking-wider">
                                            Calendario de Operación ({cycleData?.days?.length || 30} Días)
                                        </h4>
                                    </div>
                                    <span className="text-[10px] font-mono text-slate-400">
                                        Haz clic en cualquier día para editar actividades y observaciones
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-2.5">
                                    {(cycleData?.days || []).map((day: any) => {
                                        const isCompleted = day.status === "COMPLETED"
                                        const isInProgress = day.status === "IN_PROGRESS"
                                        const isLibre = day.status === "LIBRE"
                                        const isSelectedForEdit = selectedDay?.dayNumber === day.dayNumber

                                        let borderStyle = "border-white/10 bg-white/5 hover:border-cyan-400/50"
                                        if (isSelectedForEdit) {
                                            borderStyle = "border-cyan-400 bg-cyan-500/20 ring-2 ring-cyan-400"
                                        } else if (isCompleted) {
                                            borderStyle = "border-emerald-500/50 bg-emerald-950/20 shadow-md shadow-emerald-950/40"
                                        } else if (isInProgress) {
                                            borderStyle = "border-cyan-400/60 bg-cyan-950/30 ring-1 ring-cyan-400/40"
                                        } else if (isLibre) {
                                            borderStyle = "border-purple-500/40 bg-purple-950/20 opacity-70"
                                        }

                                        return (
                                            <button
                                                key={day.dayNumber}
                                                type="button"
                                                onClick={() => handleOpenDayEditor(day)}
                                                className={`p-3 rounded-2xl border text-left transition-all active:scale-95 cursor-pointer flex flex-col justify-between min-h-[95px] ${borderStyle}`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-mono font-black text-white">
                                                        Día {day.dayNumber}
                                                    </span>
                                                    <span className={`text-[8px] font-mono px-1.5 py-0.2 rounded-full font-bold uppercase ${
                                                        isCompleted ? "bg-emerald-500 text-black" :
                                                        isInProgress ? "bg-cyan-400 text-black" :
                                                        isLibre ? "bg-purple-500 text-white" :
                                                        "bg-white/10 text-slate-400"
                                                    }`}>
                                                        {isCompleted ? "✓ Listo" : isInProgress ? "En Curso" : isLibre ? "Libre" : "Pendiente"}
                                                    </span>
                                                </div>

                                                <div className="text-[10px] text-slate-400 space-y-0.5 my-1">
                                                    <div className="truncate font-mono text-[9px] text-slate-500">{day.date}</div>
                                                    <div className="text-[9px] text-slate-300 flex items-center gap-1">
                                                        <span>P: {day.posts || 0}/5</span> &bull; 
                                                        <span>M: {day.numbers || 0}/10</span>
                                                    </div>
                                                </div>

                                                {day.observations && (
                                                    <div className="text-[9px] text-amber-300 truncate italic">
                                                        💬 {day.observations}
                                                    </div>
                                                )}

                                                <div className="text-[8px] font-mono text-cyan-400/80 flex items-center justify-end gap-1 mt-1">
                                                    <Edit3 size={10} />
                                                    <span>Ajustar</span>
                                                </div>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Sub-Modal: Reglamento Bajo Comisión */}
            <BajoComisionModal
                isOpen={showBajoComisionModal}
                onClose={() => setShowBajoComisionModal(false)}
                advisorName={selectedUser?.name || "Asesor"}
            />
        </div>
    )
}

function PlayIcon({ size = 16 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
    )
}
