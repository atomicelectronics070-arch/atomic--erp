"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Calendar as CalendarIcon, 
    Clock, 
    Trophy, 
    Flame, 
    CheckCircle2, 
    AlertCircle, 
    UploadCloud, 
    Phone, 
    MessageSquare, 
    Users, 
    Share2, 
    Plus, 
    X, 
    Image as ImageIcon, 
    ChevronRight, 
    Sparkles, 
    Send, 
    Check, 
    ArrowUpRight, 
    ShieldCheck, 
    TrendingUp, 
    FileText, 
    Building, 
    MapPin, 
    HelpCircle, 
    RefreshCw,
    ExternalLink
} from "lucide-react"

interface DailyCounters {
    posts: number
    groupPosts: number
    numbers: number
    calls: number
    brandCampaign: boolean
    offerCampaign: boolean
    personalStatuses: number
}

interface Evaluation {
    active: boolean
    startDate: string
    endDate?: string
    daysRemaining: number
    bonusTarget: number
    currentDay: number
    totalDays: number
}

interface ProofItem {
    id: string
    category: string
    proofUrl: string
    fileName?: string
    createdAt: string
}

interface ContactItem {
    id: string
    name: string
    firstName?: string
    lastName?: string
    phone?: string
    city?: string
    requirement?: string
    status: string
    tags?: string
    createdAt: string
}

interface HistoryDay {
    day: number
    date: string
    dayName: string
    dayOfWeek: number
    isWorkingDay: boolean
    isToday: boolean
    isPast: boolean
    status: string // "COMPLETED" | "IN_PROGRESS" | "PENDING" | "LIBRE"
}

export default function AttendanceClient() {
    const [loading, setLoading] = useState(true)
    const [currentTime, setCurrentTime] = useState<string>("")
    const [currentDateStr, setCurrentDateStr] = useState<string>("")
    
    // Server states
    const [evaluation, setEvaluation] = useState<Evaluation>({
        active: false,
        startDate: "",
        daysRemaining: 30,
        bonusTarget: 100,
        currentDay: 0,
        totalDays: 30
    })
    const [dailyCounters, setDailyCounters] = useState<DailyCounters>({
        posts: 0,
        groupPosts: 0,
        numbers: 0,
        calls: 0,
        brandCampaign: false,
        offerCampaign: false,
        personalStatuses: 0
    })
    const [proofs, setProofs] = useState<ProofItem[]>([])
    const [callsChecklist, setCallsChecklist] = useState<boolean[]>([false, false, false, false, false, false, false])
    const [todayContacts, setTodayContacts] = useState<ContactItem[]>([])
    const [history, setHistory] = useState<HistoryDay[]>([])
    
    // Modals
    const [isEvaluationModalOpen, setIsEvaluationModalOpen] = useState(false)
    const [isContactModalOpen, setIsContactModalOpen] = useState(false)
    const [selectedDayLog, setSelectedDayLog] = useState<HistoryDay | null>(null)
    const [previewImage, setPreviewImage] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null)

    // Contact Form (7 exact fields)
    const [contactForm, setContactForm] = useState({
        firstName: "",
        lastName: "",
        company: "",
        requirement: "",
        status: "Interesado",
        phone: "",
        city: ""
    })

    // Clock effect
    useEffect(() => {
        const updateClock = () => {
            const now = new Date()
            setCurrentTime(now.toLocaleTimeString("es-EC", { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }))
            const monthName = now.toLocaleDateString("es-EC", { month: 'long' })
            const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1)
            setCurrentDateStr(`${capitalizedMonth} ${now.getFullYear()}`)
        }
        updateClock()
        const interval = setInterval(updateClock, 1000)
        return () => clearInterval(interval)
    }, [])

    // Fetch initial data
    const fetchAttendance = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/attendance")
            if (!res.ok) throw new Error("Error de conexión al servidor")
            const data = await res.json()
            if (data.evaluation) setEvaluation(data.evaluation)
            if (data.dailyCounters) setDailyCounters(data.dailyCounters)
            if (data.proofs) setProofs(data.proofs)
            if (data.callsChecklist) setCallsChecklist(data.callsChecklist)
            if (data.todayContacts) setTodayContacts(data.todayContacts)
            if (data.history) setHistory(data.history)
        } catch (error: any) {
            console.error("Fetch Attendance Error:", error)
            showToast("error", "No se pudo sincronizar los datos de asistencia.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAttendance()
    }, [])

    const showToast = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message })
        setTimeout(() => setNotification(null), 4000)
    }

    // Start Evaluation Action
    const handleStartEvaluation = async () => {
        setIsSubmitting(true)
        try {
            const res = await fetch("/api/attendance", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "start_evaluation" })
            })
            const data = await res.json()
            if (data.success) {
                setEvaluation(data.evaluation)
                setIsEvaluationModalOpen(false)
                showToast("success", "¡Felicidades! Has activado tu Carrera de 30 Días con Bono de $100 USD.")
                fetchAttendance()
            } else {
                showToast("error", data.error || "No se pudo iniciar la evaluación.")
            }
        } catch (e: any) {
            showToast("error", "Error al conectar con el servidor.")
        } finally {
            setIsSubmitting(false)
        }
    }

    // Upload Proof Action
    const handleFileUpload = async (category: 'posts' | 'groupPosts' | 'brandCampaign' | 'offerCampaign' | 'personalStatuses', file: File) => {
        if (!file) return

        // Read file as base64 data URL
        const reader = new FileReader()
        reader.onload = async () => {
            const base64Data = reader.result as string
            try {
                const res = await fetch("/api/attendance", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        action: "upload_proof",
                        category,
                        proofUrl: base64Data,
                        fileName: file.name
                    })
                })
                const data = await res.json()
                if (data.success) {
                    if (data.dailyCounters) setDailyCounters(data.dailyCounters)
                    if (data.proofs) setProofs(data.proofs)
                    showToast("success", "Captura cargada y registrada correctamente.")
                } else {
                    showToast("error", data.error || "Error al subir la captura")
                }
            } catch (e) {
                showToast("error", "Error de red al registrar la captura.")
            }
        }
        reader.readAsDataURL(file)
    }

    // Toggle Call Checklist Action
    const handleToggleCall = async (index: number) => {
        const nextCalls = [...callsChecklist]
        nextCalls[index] = !nextCalls[index]
        setCallsChecklist(nextCalls)
        
        const count = nextCalls.filter(Boolean).length
        setDailyCounters(prev => ({ ...prev, calls: count }))

        try {
            const res = await fetch("/api/attendance", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "log_call",
                    callIndex: index,
                    completed: nextCalls[index],
                    callsChecklist: nextCalls
                })
            })
            const data = await res.json()
            if (data.success && data.dailyCounters) {
                setDailyCounters(data.dailyCounters)
            }
        } catch (e) {
            console.error("Error logging call:", e)
        }
    }

    // Add Contact Action (7 exact fields)
    const handleAddContact = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!contactForm.phone && !contactForm.firstName && !contactForm.company) {
            showToast("error", "Ingresa al menos el nombre, empresa o teléfono del contacto.")
            return
        }

        setIsSubmitting(true)
        try {
            const res = await fetch("/api/attendance", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "add_contact",
                    firstName: contactForm.firstName,
                    lastName: contactForm.lastName,
                    company: contactForm.company,
                    requirement: contactForm.requirement,
                    status: contactForm.status,
                    phone: contactForm.phone,
                    city: contactForm.city
                })
            })
            const data = await res.json()
            if (data.success) {
                if (data.client) {
                    setTodayContacts(prev => [data.client, ...prev])
                }
                if (data.dailyCounters) {
                    setDailyCounters(data.dailyCounters)
                }
                setContactForm({
                    firstName: "",
                    lastName: "",
                    company: "",
                    requirement: "",
                    status: "Interesado",
                    phone: "",
                    city: ""
                })
                setIsContactModalOpen(false)
                showToast("success", "Contacto registrado exitosamente en base de datos.")
            } else {
                showToast("error", data.error || "No se pudo guardar el contacto.")
            }
        } catch (e) {
            showToast("error", "Error de conexión al registrar contacto.")
        } finally {
            setIsSubmitting(false)
        }
    }

    // Helper for category proofs filter
    const getProofsByCategory = (cat: string) => proofs.filter(p => p.category === cat)

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 space-y-8">
            {/* Toast Notification */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 backdrop-blur-md border ${
                            notification.type === 'success' 
                                ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200' 
                                : 'bg-rose-950/80 border-rose-500/40 text-rose-200'
                        }`}
                    >
                        {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <AlertCircle className="w-5 h-5 text-rose-400" />}
                        <span className="text-sm font-medium">{notification.message}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 1. HEADER */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-indigo-950/40 border border-slate-800/80 backdrop-blur-xl p-6 md:p-8 shadow-2xl">
                <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                    <div>
                        <div className="flex items-center gap-3 flex-wrap">
                            <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Atomic Sales Performance
                            </span>
                            <span className="px-3 py-1 text-xs font-medium rounded-full bg-slate-800/80 text-slate-300 border border-slate-700/60 flex items-center gap-1.5">
                                <CalendarIcon className="w-3.5 h-3.5 text-slate-400" /> {currentDateStr || "Septiembre 2026"}
                            </span>
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full border flex items-center gap-1.5 ${
                                evaluation.active 
                                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            }`}>
                                <span className={`w-2 h-2 rounded-full ${evaluation.active ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                                {evaluation.active ? 'Carrera 30 Días Activa' : 'Evaluación Pendiente'}
                            </span>
                        </div>
                        <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight mt-3 bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                            Registro Diario de Asistencia y Rendimiento
                        </h1>
                        <p className="text-sm md:text-base text-slate-400 mt-1 max-w-2xl">
                            Monitoreo de disciplina comercial, cuotas de prospección, publicaciones y llamadas de alto impacto.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end bg-slate-950/60 border border-slate-800 rounded-xl px-5 py-3 shadow-inner">
                            <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-indigo-400" /> Hora en Vivo
                            </span>
                            <span className="text-2xl md:text-3xl font-mono font-bold tracking-wider text-emerald-400">
                                {currentTime || "08:00:00"}
                            </span>
                        </div>
                        <button
                            onClick={fetchAttendance}
                            disabled={loading}
                            className="p-3 rounded-xl bg-slate-800/70 hover:bg-slate-850 border border-slate-700 text-slate-300 hover:text-white transition-all shadow-md active:scale-95"
                            title="Recargar Asistencia"
                        >
                            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. INICIAR CARRERA / EVALUACIÓN (30 DÍAS) BANNER */}
            {!evaluation.active ? (
                <motion.div 
                    initial={{ scale: 0.98, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500/10 via-indigo-600/15 to-purple-600/10 border-2 border-amber-500/40 p-6 md:p-8 backdrop-blur-xl shadow-[0_0_50px_-12px_rgba(245,158,11,0.25)] flex flex-col md:flex-row items-center justify-between gap-6"
                >
                    <div className="flex items-start gap-4">
                        <div className="p-4 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 shrink-0">
                            <Trophy className="w-8 h-8 md:w-10 md:h-10 animate-bounce" />
                        </div>
                        <div className="space-y-1.5">
                            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-500/30">
                                <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> Oportunidad de Bono Extra
                            </div>
                            <h2 className="text-xl md:text-2xl font-black text-white">
                                Iniciar Carrera de 30 Días &bull; Bono de $100 USD
                            </h2>
                            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
                                Completa el ciclo mensual de 30 días cumpliendo las pautas operativas diarias de prospección y gana tu bono directo garantizado.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsEvaluationModalOpen(true)}
                        className="w-full md:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 hover:from-amber-400 to-amber-600 text-slate-950 font-black text-sm md:text-base tracking-wide shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all active:scale-95 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                    >
                        <Sparkles className="w-5 h-5 text-slate-950" /> Iniciar Carrera (30 Días)
                    </button>
                </motion.div>
            ) : (
                <div className="rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900/80 to-indigo-950/40 border border-emerald-500/30 p-6 md:p-8 backdrop-blur-xl shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4 w-full lg:w-auto">
                        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 shrink-0">
                            <Trophy className="w-8 h-8" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-500/30 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                                    En Curso Activo
                                </span>
                                <span className="text-xs text-slate-400">Meta: $100 USD</span>
                            </div>
                            <h2 className="text-xl md:text-2xl font-bold text-white mt-1">
                                Día {evaluation.currentDay} de {evaluation.totalDays} &bull; <span className="text-emerald-400">{evaluation.daysRemaining} días restantes</span>
                            </h2>
                            <p className="text-xs md:text-sm text-slate-400 mt-0.5">
                                Progreso acumulado hacia el objetivo de bono mensual por constancia comercial.
                            </p>
                        </div>
                    </div>

                    <div className="w-full lg:w-96 space-y-2">
                        <div className="flex justify-between text-xs font-semibold">
                            <span className="text-slate-400">Cumplimiento del Ciclo</span>
                            <span className="text-emerald-400 font-mono">
                                {Math.round(((evaluation.currentDay || 1) / (evaluation.totalDays || 30)) * 100)}%
                            </span>
                        </div>
                        <div className="w-full h-3.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(100, ((evaluation.currentDay || 1) / (evaluation.totalDays || 30)) * 100)}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                            />
                        </div>
                        <div className="flex justify-between text-[11px] text-slate-400">
                            <span>Inicio: {evaluation.startDate ? new Date(evaluation.startDate).toLocaleDateString("es-EC") : "Hoy"}</span>
                            <span>Bono: $100 USD</span>
                        </div>
                    </div>
                </div>
            )}

            {/* 3. INTERACTIVE LIVE MONTHLY CALENDAR */}
            <div className="rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl p-6 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                        <CalendarIcon className="w-5 h-5 text-indigo-400" />
                        <h3 className="text-lg font-bold text-white">Calendario Mensual de Asistencia</h3>
                        <span className="text-xs text-slate-400">(Lunes a Sábado Laborales)</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-md bg-emerald-500/20 border border-emerald-500/50" />
                            <span className="text-slate-400">Completado</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-md bg-indigo-500/20 border border-indigo-500/50" />
                            <span className="text-slate-400">En Curso</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-md bg-slate-800 border border-slate-700" />
                            <span className="text-slate-400">Pendiente</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-md bg-slate-900/40 border border-slate-800 text-slate-400" />
                            <span className="text-slate-400">Libre (Dom)</span>
                        </div>
                    </div>
                </div>

                {/* Calendar Days Grid */}
                <div className="grid grid-cols-7 gap-2 pt-2">
                    {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((name, i) => (
                        <div key={name} className={`text-center text-xs font-semibold py-1.5 rounded-lg ${i === 0 ? 'text-slate-400' : 'text-slate-300'}`}>
                            {name}
                        </div>
                    ))}

                    {history.map((dayItem) => {
                        const isSunday = dayItem.dayOfWeek === 0
                        const isToday = dayItem.isToday

                        let bgClass = "bg-slate-950/60 border-slate-800/80 text-slate-400"
                        if (dayItem.status === "COMPLETED") {
                            bgClass = "bg-emerald-950/40 border-emerald-500/50 text-emerald-300 shadow-[0_0_10px_-3px_rgba(16,185,129,0.3)]"
                        } else if (dayItem.status === "IN_PROGRESS") {
                            bgClass = "bg-indigo-950/40 border-indigo-500/50 text-indigo-300"
                        } else if (isSunday) {
                            bgClass = "bg-slate-950/30 border-slate-900 text-slate-400 opacity-60"
                        }

                        return (
                            <button
                                key={dayItem.day}
                                onClick={() => dayItem.isWorkingDay && setSelectedDayLog(dayItem)}
                                disabled={!dayItem.isWorkingDay}
                                className={`group relative p-2.5 md:p-3 rounded-xl border flex flex-col items-center justify-between min-h-[68px] transition-all ${bgClass} ${
                                    isToday ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-slate-950 shadow-lg' : ''
                                } ${dayItem.isWorkingDay ? 'hover:scale-[1.03] hover:border-slate-500 cursor-pointer' : 'cursor-default'}`}
                            >
                                <div className="w-full flex items-center justify-between text-[11px]">
                                    <span className={`font-bold font-mono ${isToday ? 'text-emerald-400 text-sm' : ''}`}>
                                        {dayItem.day}
                                    </span>
                                    {isToday && (
                                        <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-emerald-500 text-slate-950">
                                            HOY
                                        </span>
                                    )}
                                </div>
                                <div className="text-[10px] font-medium tracking-tight mt-1">
                                    {isSunday ? (
                                        <span className="text-slate-400">Descanso</span>
                                    ) : dayItem.status === "COMPLETED" ? (
                                        <span className="flex items-center gap-0.5 text-emerald-400 font-semibold">
                                            <Check className="w-3 h-3" /> Listo
                                        </span>
                                    ) : dayItem.status === "IN_PROGRESS" ? (
                                        <span className="text-indigo-400">En Curso</span>
                                    ) : (
                                        <span className="text-slate-400">Por Iniciar</span>
                                    )}
                                </div>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* 4. TOP 6 METRIC PROGRESS CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {/* 1. Publicaciones Diarias */}
                <div className="rounded-2xl bg-gradient-to-br from-slate-900/90 to-purple-950/30 border border-purple-500/20 p-5 shadow-xl space-y-3 relative overflow-hidden">
                    <div className="flex justify-between items-start">
                        <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
                            <Share2 className="w-5 h-5" />
                        </div>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                            + Puntos si superas
                        </span>
                    </div>
                    <div>
                        <span className="text-xs text-slate-400 font-medium">1. Publicaciones Diarias</span>
                        <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-3xl font-extrabold text-white font-mono">{dailyCounters.posts}</span>
                            <span className="text-sm text-slate-400 font-semibold">/ 5 mín. día</span>
                        </div>
                    </div>
                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                        <div 
                            className="h-full bg-purple-500 transition-all duration-500 rounded-full"
                            style={{ width: `${Math.min(100, (dailyCounters.posts / 5) * 100)}%` }}
                        />
                    </div>
                </div>

                {/* 2. Publicaciones en Grupos */}
                <div className="rounded-2xl bg-gradient-to-br from-slate-900/90 to-cyan-950/30 border border-cyan-500/20 p-5 shadow-xl space-y-3 relative overflow-hidden">
                    <div className="flex justify-between items-start">
                        <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                            <Users className="w-5 h-5" />
                        </div>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                            + Puntos si superas
                        </span>
                    </div>
                    <div>
                        <span className="text-xs text-slate-400 font-medium">2. Grupos de Redes</span>
                        <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-3xl font-extrabold text-white font-mono">{dailyCounters.groupPosts}</span>
                            <span className="text-sm text-slate-400 font-semibold">/ 3 mín. día</span>
                        </div>
                    </div>
                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                        <div 
                            className="h-full bg-cyan-500 transition-all duration-500 rounded-full"
                            style={{ width: `${Math.min(100, (dailyCounters.groupPosts / 3) * 100)}%` }}
                        />
                    </div>
                </div>

                {/* 3. Números de Teléfono */}
                <div className="rounded-2xl bg-gradient-to-br from-slate-900/90 to-emerald-950/30 border border-emerald-500/20 p-5 shadow-xl space-y-3 relative overflow-hidden">
                    <div className="flex justify-between items-start">
                        <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                            <Phone className="w-5 h-5" />
                        </div>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            + Puntos / Resta si falta
                        </span>
                    </div>
                    <div>
                        <span className="text-xs text-slate-400 font-medium">3. Números Ingresados</span>
                        <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-3xl font-extrabold text-white font-mono">{dailyCounters.numbers}</span>
                            <span className="text-sm text-slate-400 font-semibold">/ 10 cuota día</span>
                        </div>
                    </div>
                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                        <div 
                            className="h-full bg-emerald-500 transition-all duration-500 rounded-full"
                            style={{ width: `${Math.min(100, (dailyCounters.numbers / 10) * 100)}%` }}
                        />
                    </div>
                </div>

                {/* 4. Llamadas Diarias */}
                <div className="rounded-2xl bg-gradient-to-br from-slate-900/90 to-indigo-950/30 border border-indigo-500/20 p-5 shadow-xl space-y-3 relative overflow-hidden">
                    <div className="flex justify-between items-start">
                        <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
                            <Phone className="w-5 h-5" />
                        </div>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            Checklist 1 al 7
                        </span>
                    </div>
                    <div>
                        <span className="text-xs text-slate-400 font-medium">4. Llamadas Efectivas</span>
                        <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-3xl font-extrabold text-white font-mono">{dailyCounters.calls}</span>
                            <span className="text-sm text-slate-400 font-semibold">/ 7 obligatorias</span>
                        </div>
                    </div>
                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                        <div 
                            className="h-full bg-indigo-500 transition-all duration-500 rounded-full"
                            style={{ width: `${Math.min(100, (dailyCounters.calls / 7) * 100)}%` }}
                        />
                    </div>
                </div>

                {/* 5. Campañas Lunes y Martes/Miércoles */}
                <div className="rounded-2xl bg-gradient-to-br from-slate-900/90 to-amber-950/30 border border-amber-500/20 p-5 shadow-xl space-y-3 relative overflow-hidden">
                    <div className="flex justify-between items-start">
                        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            1 Marca + 1 Oferta / Sem
                        </span>
                    </div>
                    <div>
                        <span className="text-xs text-slate-400 font-medium">5. Campañas Semanales</span>
                        <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-2xl font-extrabold text-white font-mono">
                                {(dailyCounters.brandCampaign ? 1 : 0) + (dailyCounters.offerCampaign ? 1 : 0)}
                            </span>
                            <span className="text-sm text-slate-400 font-semibold">/ 2 campañas</span>
                        </div>
                    </div>
                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                        <div 
                            className="h-full bg-amber-500 transition-all duration-500 rounded-full"
                            style={{ width: `${(((dailyCounters.brandCampaign ? 1 : 0) + (dailyCounters.offerCampaign ? 1 : 0)) / 2) * 100}%` }}
                        />
                    </div>
                </div>

                {/* 6. Estados Personales */}
                <div className="rounded-2xl bg-gradient-to-br from-slate-900/90 to-rose-950/30 border border-rose-500/20 p-5 shadow-xl space-y-3 relative overflow-hidden">
                    <div className="flex justify-between items-start">
                        <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
                            <MessageSquare className="w-5 h-5" />
                        </div>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                            2 Estados / Semana
                        </span>
                    </div>
                    <div>
                        <span className="text-xs text-slate-400 font-medium">6. Estados Personales</span>
                        <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-3xl font-extrabold text-white font-mono">{dailyCounters.personalStatuses}</span>
                            <span className="text-sm text-slate-400 font-semibold">/ 2 por semana</span>
                        </div>
                    </div>
                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                        <div 
                            className="h-full bg-rose-500 transition-all duration-500 rounded-full"
                            style={{ width: `${Math.min(100, (dailyCounters.personalStatuses / 2) * 100)}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* 5. INTERACTIVE ACTION SECTIONS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* SECTION 1: PUBLICACIONES DIARIAS */}
                <div className="rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl p-6 shadow-xl space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                                <Share2 className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-base">Publicaciones Diarias (Redes)</h3>
                                <p className="text-xs text-slate-400">Sube capturas de pantalla de tus 5 publicaciones de hoy</p>
                            </div>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-mono text-xs font-bold border border-purple-500/30">
                            {dailyCounters.posts} / 5
                        </span>
                    </div>

                    {/* Upload Dropzone */}
                    <label className="border-2 border-dashed border-slate-700/80 hover:border-purple-500/60 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer bg-slate-950/40 hover:bg-purple-950/10 transition-all">
                        <UploadCloud className="w-6 h-6 text-purple-400" />
                        <div className="text-center">
                            <span className="text-xs font-semibold text-purple-300">Haz clic para subir captura de publicación</span>
                            <p className="text-[10px] text-slate-400">PNG, JPG o WEBP</p>
                        </div>
                        <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={(e) => e.target.files?.[0] && handleFileUpload('posts', e.target.files[0])}
                        />
                    </label>

                    {/* Gallery Preview */}
                    <div className="space-y-2">
                        <span className="text-xs font-semibold text-slate-400">Capturas registradas hoy:</span>
                        <div className="grid grid-cols-5 gap-2">
                            {getProofsByCategory('posts').map((proof) => (
                                <div 
                                    key={proof.id} 
                                    onClick={() => setPreviewImage(proof.proofUrl)}
                                    className="relative aspect-square rounded-lg overflow-hidden border border-slate-800 bg-slate-950 hover:border-purple-500 cursor-pointer transition-all group"
                                >
                                    <img src={proof.proofUrl} alt="Prueba de publicación" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                        <ChevronRight className="w-4 h-4 text-white" />
                                    </div>
                                </div>
                            ))}
                            {Array.from({ length: Math.max(0, 5 - getProofsByCategory('posts').length) }).map((_, i) => (
                                <div key={i} className="aspect-square rounded-lg border border-dashed border-slate-800 bg-slate-950/30 flex items-center justify-center text-slate-400 text-xs">
                                    {getProofsByCategory('posts').length + i + 1}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* SECTION 2: PUBLICACIONES EN GRUPOS */}
                <div className="rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl p-6 shadow-xl space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                                <Users className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-base">Publicaciones en Grupos</h3>
                                <p className="text-xs text-slate-400">Grupos de Facebook, Telegram o comunidades (3 mín.)</p>
                            </div>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold border border-cyan-500/30">
                            {dailyCounters.groupPosts} / 3
                        </span>
                    </div>

                    {/* Upload Dropzone */}
                    <label className="border-2 border-dashed border-slate-700/80 hover:border-cyan-500/60 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer bg-slate-950/40 hover:bg-cyan-950/10 transition-all">
                        <UploadCloud className="w-6 h-6 text-cyan-400" />
                        <div className="text-center">
                            <span className="text-xs font-semibold text-cyan-300">Haz clic para subir captura de grupo</span>
                            <p className="text-[10px] text-slate-400">PNG, JPG o WEBP</p>
                        </div>
                        <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={(e) => e.target.files?.[0] && handleFileUpload('groupPosts', e.target.files[0])}
                        />
                    </label>

                    {/* Gallery Preview */}
                    <div className="space-y-2">
                        <span className="text-xs font-semibold text-slate-400">Capturas registradas hoy:</span>
                        <div className="grid grid-cols-3 gap-3">
                            {getProofsByCategory('groupPosts').map((proof) => (
                                <div 
                                    key={proof.id} 
                                    onClick={() => setPreviewImage(proof.proofUrl)}
                                    className="relative aspect-video rounded-lg overflow-hidden border border-slate-800 bg-slate-950 hover:border-cyan-500 cursor-pointer transition-all group"
                                >
                                    <img src={proof.proofUrl} alt="Prueba grupo" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                        <ChevronRight className="w-4 h-4 text-white" />
                                    </div>
                                </div>
                            ))}
                            {Array.from({ length: Math.max(0, 3 - getProofsByCategory('groupPosts').length) }).map((_, i) => (
                                <div key={i} className="aspect-video rounded-lg border border-dashed border-slate-800 bg-slate-950/30 flex items-center justify-center text-slate-400 text-xs">
                                    Grupo {getProofsByCategory('groupPosts').length + i + 1}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* SECTION 4: CHECKLIST DE LLAMADAS DIARIAS */}
                <div className="rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl p-6 shadow-xl space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                                <Phone className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-base">Checklist de Llamadas Diarias (7 Mín.)</h3>
                                <p className="text-xs text-slate-400">Marca cada llamada conforme la ejecutas en tu jornada</p>
                            </div>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-mono text-xs font-bold border border-indigo-500/30">
                            {callsChecklist.filter(Boolean).length} / 7
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                        {callsChecklist.map((checked, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleToggleCall(idx)}
                                className={`p-3 rounded-xl border flex items-center justify-between text-left transition-all ${
                                    checked 
                                        ? 'bg-indigo-950/40 border-indigo-500/50 text-indigo-200' 
                                        : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 text-slate-300'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                                        checked ? 'bg-indigo-500 border-indigo-400 text-slate-950' : 'border-slate-700 bg-slate-900'
                                    }`}>
                                        {checked && <Check className="w-4 h-4 stroke-[3]" />}
                                    </div>
                                    <span className="text-sm font-semibold">Llamada {idx + 1}</span>
                                </div>
                                <span className={`text-[11px] font-medium ${checked ? 'text-indigo-300' : 'text-slate-400'}`}>
                                    {checked ? 'Realizada' : 'Pendiente'}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* SECTION 5 & 6: CAMPAÑAS SEMANALES Y ESTADOS PERSONALES */}
                <div className="rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl p-6 shadow-xl space-y-6">
                    {/* Campañas Semanales */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <Sparkles className="w-5 h-5 text-amber-400" />
                                <div>
                                    <h4 className="font-bold text-white text-sm">Campañas Semanales Obligatorias</h4>
                                    <p className="text-[11px] text-slate-400">Lunes (Marca) &bull; Miércoles (Ofertas)</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {/* Marca */}
                            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/40 space-y-2">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="font-semibold text-amber-300">Campaña de Marca (Lunes)</span>
                                    {dailyCounters.brandCampaign ? (
                                        <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                                            <CheckCircle2 className="w-3 h-3" /> Subida
                                        </span>
                                    ) : (
                                        <span className="text-[10px] text-amber-400">Pendiente</span>
                                    )}
                                </div>
                                <label className="w-full py-2 px-3 rounded-lg border border-dashed border-amber-500/40 hover:border-amber-400 bg-amber-500/5 hover:bg-amber-500/10 text-center text-xs text-amber-200 flex items-center justify-center gap-1.5 cursor-pointer transition-all">
                                    <UploadCloud className="w-3.5 h-3.5" /> Subir Captura
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        className="hidden" 
                                        onChange={(e) => e.target.files?.[0] && handleFileUpload('brandCampaign', e.target.files[0])}
                                    />
                                </label>
                            </div>

                            {/* Oferta */}
                            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/40 space-y-2">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="font-semibold text-amber-300">Campaña de Ofertas (Miérc.)</span>
                                    {dailyCounters.offerCampaign ? (
                                        <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                                            <CheckCircle2 className="w-3 h-3" /> Subida
                                        </span>
                                    ) : (
                                        <span className="text-[10px] text-amber-400">Pendiente</span>
                                    )}
                                </div>
                                <label className="w-full py-2 px-3 rounded-lg border border-dashed border-amber-500/40 hover:border-amber-400 bg-amber-500/5 hover:bg-amber-500/10 text-center text-xs text-amber-200 flex items-center justify-center gap-1.5 cursor-pointer transition-all">
                                    <UploadCloud className="w-3.5 h-3.5" /> Subir Captura
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        className="hidden" 
                                        onChange={(e) => e.target.files?.[0] && handleFileUpload('offerCampaign', e.target.files[0])}
                                    />
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Estados Personales */}
                    <div className="space-y-3 pt-3 border-t border-slate-800">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <MessageSquare className="w-5 h-5 text-rose-400" />
                                <div>
                                    <h4 className="font-bold text-white text-sm">Estados Personales (WhatsApp / FB)</h4>
                                    <p className="text-[11px] text-slate-400">2 estados a la semana requeridos</p>
                                </div>
                            </div>
                            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono text-xs font-bold border border-rose-500/30">
                                {dailyCounters.personalStatuses} / 2
                            </span>
                        </div>
                        <label className="w-full py-3 px-4 rounded-xl border border-dashed border-rose-500/40 hover:border-rose-400 bg-rose-500/5 hover:bg-rose-500/10 text-center text-xs text-rose-200 flex items-center justify-center gap-2 cursor-pointer transition-all">
                            <UploadCloud className="w-4 h-4 text-rose-400" /> Subir Captura de Estado Publicado
                            <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={(e) => e.target.files?.[0] && handleFileUpload('personalStatuses', e.target.files[0])}
                            />
                        </label>
                    </div>
                </div>
            </div>

            {/* SECTION 3: INSERTAR NÚMEROS DE TELÉFONO (FULL WIDTH) */}
            <div className="rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl p-6 md:p-8 shadow-xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            <Phone className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-extrabold text-white text-lg md:text-xl">
                                    Prospección Diaria &bull; 10 Números Telefónicos
                                </h3>
                                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/30">
                                    {dailyCounters.numbers} / 10 hoy
                                </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Registra prospectos en la base de datos central. Cada número insertado suma puntos para tu cuota diaria.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <a
                            href="/dashboard/contactos-historicos"
                            className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
                        >
                            Ver Historial Completo <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                        <button
                            onClick={() => setIsContactModalOpen(true)}
                            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs md:text-sm tracking-wide shadow-lg shadow-emerald-500/20 transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
                        >
                            <Plus className="w-4 h-4 stroke-[3]" /> Registrar Nuevo Contacto
                        </button>
                    </div>
                </div>

                {/* Contacts Registered Today Table */}
                <div className="overflow-x-auto rounded-xl border border-slate-800">
                    <table className="w-full text-left text-xs text-slate-300">
                        <thead className="bg-slate-950/80 uppercase text-[11px] text-slate-400 tracking-wider border-b border-slate-800">
                            <tr>
                                <th className="p-3.5">Contacto / Organización</th>
                                <th className="p-3.5">Teléfono</th>
                                <th className="p-3.5">Ciudad / Sector</th>
                                <th className="p-3.5">Requerimiento</th>
                                <th className="p-3.5">Estado</th>
                                <th className="p-3.5 text-right">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 bg-slate-900/40 font-normal">
                            {todayContacts.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-400">
                                        No has registrado contactos hoy todavía. Haz clic en <span className="text-emerald-400 font-semibold">&ldquo;+ Registrar Nuevo Contacto&rdquo;</span> para completar tu cuota de 10 números.
                                    </td>
                                </tr>
                            ) : (
                                todayContacts.map((contact) => (
                                    <tr key={contact.id} className="hover:bg-slate-850/50 transition-colors">
                                        <td className="p-3.5 font-semibold text-white">
                                            <div>{contact.name || [contact.firstName, contact.lastName].filter(Boolean).join(" ")}</div>
                                            {contact.tags && (
                                                <div className="text-[10px] text-slate-400 font-normal">{contact.tags}</div>
                                            )}
                                        </td>
                                        <td className="p-3.5 font-mono text-emerald-300">
                                            {contact.phone ? (
                                                <a href={`tel:${contact.phone}`} className="hover:underline flex items-center gap-1">
                                                    <Phone className="w-3 h-3" /> {contact.phone}
                                                </a>
                                            ) : (
                                                <span className="text-slate-400">-</span>
                                            )}
                                        </td>
                                        <td className="p-3.5 text-slate-300">
                                            {contact.city || "No especificada"}
                                        </td>
                                        <td className="p-3.5 max-w-xs truncate text-slate-300">
                                            {contact.requirement || "Sin requerimiento específico"}
                                        </td>
                                        <td className="p-3.5">
                                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold border bg-indigo-500/20 text-indigo-300 border-indigo-500/30">
                                                {contact.status || "PROSPECTO"}
                                            </span>
                                        </td>
                                        <td className="p-3.5 text-right">
                                            {contact.phone && (
                                                <a
                                                    href={`https://wa.me/${contact.phone.replace(/[^0-9]/g, '')}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium text-[11px] transition-all"
                                                >
                                                    <MessageSquare className="w-3 h-3" /> WhatsApp
                                                </a>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL 1: INICIAR EVALUACIÓN (30 DÍAS) */}
            <AnimatePresence>
                {isEvaluationModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-6 relative"
                        >
                            <button
                                onClick={() => setIsEvaluationModalOpen(false)}
                                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                    <Trophy className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-white">Carrera de 30 Días &bull; Bono $100</h3>
                                    <p className="text-xs text-slate-400">Condiciones y reglas de la cuota de rendimiento</p>
                                </div>
                            </div>

                            <div className="space-y-3 bg-slate-950/60 rounded-xl p-4 border border-slate-800/80 text-xs text-slate-300">
                                <h4 className="font-bold text-amber-300 uppercase tracking-wider text-[11px]">Reglas de Trabajo Diario:</h4>
                                <ul className="space-y-2">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                        <span><strong>5 publicaciones diarias</strong> en redes sociales (Facebook, IG, etc.).</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                        <span><strong>3 publicaciones en grupos diarios</strong> de alto alcance.</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                        <span><strong>10 números de teléfono diarios</strong> ingresados en CRM.</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                        <span><strong>7 llamadas diarias realizadas</strong> y registradas en el checklist.</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                        <span><strong>1 campaña de marca</strong> los lunes y <strong>1 de ofertas</strong> los miércoles.</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                        <span><strong>2 estados personales</strong> por semana en WhatsApp.</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button
                                    onClick={() => setIsEvaluationModalOpen(false)}
                                    className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-all"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleStartEvaluation}
                                    disabled={isSubmitting}
                                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs md:text-sm tracking-wide shadow-lg shadow-amber-500/20 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    {isSubmitting ? "Iniciando..." : "¿Estás seguro de empezar tu Carrera de 30 Días?"}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* MODAL 2: REGISTRAR CONTACTO (7 EXACT FIELDS) */}
            <AnimatePresence>
                {isContactModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 p-6 md:p-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto"
                        >
                            <button
                                onClick={() => setIsContactModalOpen(false)}
                                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Registrar Nuevo Contacto</h3>
                                    <p className="text-xs text-slate-400">Ingresa los 7 datos para registrar en el CRM y sumar a tu cuota diaria</p>
                                </div>
                            </div>

                            <form onSubmit={handleAddContact} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* 1. Nombre */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-slate-300">1. Nombre *</label>
                                        <input
                                            type="text"
                                            required
                                            value={contactForm.firstName}
                                            onChange={(e) => setContactForm({ ...contactForm, firstName: e.target.value })}
                                            placeholder="Ej. Carlos"
                                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                                        />
                                    </div>

                                    {/* 2. Apellido */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-slate-300">2. Apellido</label>
                                        <input
                                            type="text"
                                            value={contactForm.lastName}
                                            onChange={(e) => setContactForm({ ...contactForm, lastName: e.target.value })}
                                            placeholder="Ej. Mendoza"
                                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                                        />
                                    </div>
                                </div>

                                {/* 3. Nombre o Organización */}
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-300">3. Nombre o Organización</label>
                                    <input
                                        type="text"
                                        value={contactForm.company}
                                        onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })}
                                        placeholder="Ej. Constructora ProAndes S.A."
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                                    />
                                </div>

                                {/* 4. Requerimiento */}
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-300">4. Requerimiento</label>
                                    <textarea
                                        rows={2}
                                        value={contactForm.requirement}
                                        onChange={(e) => setContactForm({ ...contactForm, requirement: e.target.value })}
                                        placeholder="Ej. Interesado en cerraduras inteligentes y control de accesos para 12 departamentos"
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500 resize-none"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* 5. Estado de atención */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-slate-300">5. Estado de Atención</label>
                                        <select
                                            value={contactForm.status}
                                            onChange={(e) => setContactForm({ ...contactForm, status: e.target.value })}
                                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                                        >
                                            <option value="Interesado">Interesado</option>
                                            <option value="Cotizado">Cotizado</option>
                                            <option value="En Negociación">En Negociación</option>
                                            <option value="Cerrado">Cerrado</option>
                                            <option value="Pendiente">Pendiente</option>
                                        </select>
                                    </div>

                                    {/* 6. Número de teléfono */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-slate-300">6. Número de Teléfono *</label>
                                        <input
                                            type="tel"
                                            required
                                            value={contactForm.phone}
                                            onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                                            placeholder="Ej. 0991234567"
                                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500 font-mono"
                                        />
                                    </div>
                                </div>

                                {/* 7. Ciudad o sector de residencia */}
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-300">7. Ciudad o Sector de Residencia</label>
                                    <input
                                        type="text"
                                        value={contactForm.city}
                                        onChange={(e) => setContactForm({ ...contactForm, city: e.target.value })}
                                        placeholder="Ej. Quito Norte / Cumbayá"
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                                    />
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                                    <button
                                        type="button"
                                        onClick={() => setIsContactModalOpen(false)}
                                        className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-all"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs tracking-wide shadow-lg shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-50"
                                    >
                                        {isSubmitting ? "Guardando..." : "Guardar Contacto"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* MODAL 3: PREVIEW IMAGE */}
            <AnimatePresence>
                {previewImage && (
                    <div 
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
                        onClick={() => setPreviewImage(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 p-2 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setPreviewImage(null)}
                                className="absolute top-4 right-4 z-10 bg-slate-900/80 text-white hover:bg-slate-800 p-2 rounded-full border border-slate-700 shadow-md"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <img src={previewImage} alt="Captura ampliada" className="max-w-full max-h-[85vh] object-contain rounded-xl mx-auto" />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* MODAL 4: CALENDAR DAY DETAILS */}
            <AnimatePresence>
                {selectedDayLog && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-5 relative"
                        >
                            <button
                                onClick={() => setSelectedDayLog(null)}
                                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                                    <CalendarIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">Detalle de Asistencia</h3>
                                    <p className="text-xs text-slate-400 font-mono">
                                        Día {selectedDayLog.day} ({selectedDayLog.dayName}) &bull; {selectedDayLog.date}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3 bg-slate-950/60 rounded-xl p-4 border border-slate-800/80 text-xs">
                                <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                                    <span className="text-slate-400">Tipo de Jornada:</span>
                                    <span className="font-semibold text-white">Laboral (Obligatoria)</span>
                                </div>
                                <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                                    <span className="text-slate-400">Estado Registrado:</span>
                                    <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                                        selectedDayLog.status === 'COMPLETED' 
                                            ? 'bg-emerald-500/20 text-emerald-300' 
                                            : 'bg-indigo-500/20 text-indigo-300'
                                    }`}>
                                        {selectedDayLog.status === 'COMPLETED' ? 'Cuota Cumplida' : selectedDayLog.isToday ? 'En Curso Hoy' : 'Registro Parcial'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-1">
                                    <span className="text-slate-400">Puntaje de Asistencia:</span>
                                    <span className="font-bold text-emerald-400 font-mono">
                                        {selectedDayLog.status === 'COMPLETED' ? '100% (Presente)' : selectedDayLog.isToday ? 'En desarrollo' : 'Registrado'}
                                    </span>
                                </div>
                            </div>

                            <div className="flex justify-end pt-2">
                                <button
                                    onClick={() => setSelectedDayLog(null)}
                                    className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
