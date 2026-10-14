"use client"

import React, { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Clock, CheckCircle2, AlertCircle, Calendar, Sparkles, 
    Check, X, RefreshCw, ShieldCheck, UserCheck, Flame, 
    ArrowRight, Sun, Moon, Briefcase, Zap, Info
} from "lucide-react"

export interface DayAttendanceLog {
    day: number
    date: string
    dayName: string
    dayOfWeek: number
    isWorkingDay: boolean
    isToday: boolean
    isPast: boolean
    status: "COMPLETED" | "IN_PROGRESS" | "PENDING" | "LIBRE"
    clockInTime?: string | null
    clockOutTime?: string | null
    hoursWorked?: string | null
    notes?: string
}

interface UniversalTimbradoProps {
    roleName?: string
    onClockChange?: (clockData: { in: string | null; out: string | null }) => void
    compact?: boolean
}

export default function UniversalTimbrado30Dias({
    roleName,
    onClockChange,
    compact = false
}: UniversalTimbradoProps) {
    const { data: session } = useSession()
    const userName = session?.user?.name || "Colaborador ATOMIC"
    const userEmail = session?.user?.email || "colaborador@atomic.com.ec"
    const primaryRole = (session?.user as any)?.role || roleName || "ORGANIZACIONAL"

    const [currentTime, setCurrentTime] = useState<string>("")
    const [currentDateStr, setCurrentDateStr] = useState<string>("")
    const [loading, setLoading] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null)

    // Clock state for today
    const [clockInTime, setClockInTime] = useState<string | null>(null)
    const [clockOutTime, setClockOutTime] = useState<string | null>(null)

    // 30-Day graphical matrix
    const [historyDays, setHistoryDays] = useState<DayAttendanceLog[]>([])
    const [selectedDay, setSelectedDay] = useState<DayAttendanceLog | null>(null)

    const now = new Date()
    const todayKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
    const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    const storagePrefix = `atomic_timbrado_${userEmail.replace(/[^a-zA-Z0-9]/g, "_")}`

    // Live clock timer
    useEffect(() => {
        const updateClock = () => {
            const d = new Date()
            setCurrentTime(d.toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true }))
            setCurrentDateStr(d.toLocaleDateString("es-EC", { weekday: "long", year: "numeric", month: "long", day: "numeric" }))
        }
        updateClock()
        const timer = setInterval(updateClock, 1000)
        return () => clearInterval(timer)
    }, [])

    const showToast = (type: "success" | "error", message: string) => {
        setNotification({ type, message })
        setTimeout(() => setNotification(null), 4000)
    }

    // Build the 30-Day Matrix
    const buildMonthlyMatrix = (serverHistory: any[] = [], currentIn: string | null = null, currentOut: string | null = null) => {
        const year = now.getFullYear()
        const month = now.getMonth()
        const daysInMonth = new Date(year, month + 1, 0).getDate()
        const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
        const todayDate = now.getDate()

        // Load monthly history from localStorage fallback
        let localHistoryMap: Record<string, { in?: string; out?: string }> = {}
        try {
            const saved = localStorage.getItem(`${storagePrefix}_matrix_${monthKey}`)
            if (saved) localHistoryMap = JSON.parse(saved)
        } catch (e) {}

        const days: DayAttendanceLog[] = []
        for (let d = 1; d <= daysInMonth; d++) {
            const dateObj = new Date(year, month, d)
            const dayOfWeek = dateObj.getDay()
            const isWorkingDay = dayOfWeek !== 0 // Sunday is descanso
            const isToday = d === todayDate
            const isPast = d < todayDate
            const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`

            // Find matching server record
            const serverDay = serverHistory.find((sh: any) => sh.day === d)
            const localRecord = localHistoryMap[dateString] || {}

            const dayIn = isToday ? (currentIn || serverDay?.clockInTime || localRecord.in || null) : (serverDay?.clockInTime || localRecord.in || null)
            const dayOut = isToday ? (currentOut || serverDay?.clockOutTime || localRecord.out || null) : (serverDay?.clockOutTime || localRecord.out || null)

            let status: "COMPLETED" | "IN_PROGRESS" | "PENDING" | "LIBRE" = "PENDING"
            if (!isWorkingDay) {
                status = "LIBRE"
            } else if (isToday) {
                if (dayOut) status = "COMPLETED"
                else if (dayIn) status = "IN_PROGRESS"
                else status = "PENDING"
            } else if (isPast) {
                if (dayOut || dayIn || serverDay?.status === "COMPLETED") status = "COMPLETED"
                else if (serverDay?.status === "IN_PROGRESS") status = "IN_PROGRESS"
                else status = "PENDING"
            }

            days.push({
                day: d,
                date: dateString,
                dayName: dayNames[dayOfWeek],
                dayOfWeek,
                isWorkingDay,
                isToday,
                isPast,
                status,
                clockInTime: dayIn,
                clockOutTime: dayOut
            })
        }
        return days
    }

    // Load initial attendance & timbrado
    const loadAttendance = async () => {
        setLoading(true)
        let loadedIn: string | null = null
        let loadedOut: string | null = null

        // 1. First check localStorage for zero-latency local fallback
        try {
            const localSaved = localStorage.getItem(`${storagePrefix}_${todayKey}`)
            if (localSaved) {
                const parsed = JSON.parse(localSaved)
                if (parsed.in) loadedIn = parsed.in
                if (parsed.out) loadedOut = parsed.out
            }
        } catch (e) {}

        // 2. Fetch from backend API
        try {
            const res = await fetch("/api/attendance")
            if (res.ok) {
                const data = await res.json()
                if (data.clockInTime) loadedIn = data.clockInTime
                if (data.clockOutTime) loadedOut = data.clockOutTime

                setClockInTime(loadedIn)
                setClockOutTime(loadedOut)
                onClockChange?.({ in: loadedIn, out: loadedOut })

                const matrix = buildMonthlyMatrix(data.history || [], loadedIn, loadedOut)
                setHistoryDays(matrix)
                return
            }
        } catch (e) {
            console.error("Attendance API fetch failed, fallback to local", e)
        } finally {
            setLoading(false)
        }

        // Fallback matrix if server unreachable
        setClockInTime(loadedIn)
        setClockOutTime(loadedOut)
        onClockChange?.({ in: loadedIn, out: loadedOut })
        setHistoryDays(buildMonthlyMatrix([], loadedIn, loadedOut))
    }

    useEffect(() => {
        loadAttendance()
    }, [userEmail, todayKey])

    // Save Timbrado (Entrada o Salida)
    const handleClock = async (type: "in" | "out") => {
        if (isSubmitting) return
        const timeNow = new Date().toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true })
        setIsSubmitting(true)

        const nextIn = type === "in" ? timeNow : clockInTime
        const nextOut = type === "out" ? timeNow : clockOutTime

        // 1. Immediately save to localStorage
        try {
            localStorage.setItem(`${storagePrefix}_${todayKey}`, JSON.stringify({ in: nextIn, out: nextOut }))
            
            // Update monthly matrix cache
            const savedMatrix = localStorage.getItem(`${storagePrefix}_matrix_${monthKey}`)
            let map = savedMatrix ? JSON.parse(savedMatrix) : {}
            map[todayKey] = { in: nextIn, out: nextOut }
            localStorage.setItem(`${storagePrefix}_matrix_${monthKey}`, JSON.stringify(map))
        } catch (e) {}

        setClockInTime(nextIn)
        setClockOutTime(nextOut)
        onClockChange?.({ in: nextIn, out: nextOut })

        // Update local matrix visually
        setHistoryDays(prev => prev.map(d => {
            if (d.isToday) {
                return {
                    ...d,
                    clockInTime: nextIn,
                    clockOutTime: nextOut,
                    status: type === "out" ? "COMPLETED" : "IN_PROGRESS"
                }
            }
            return d
        }))

        // 2. Synchronize with backend API
        try {
            const res = await fetch("/api/attendance", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: type === "in" ? "clock_in" : "clock_out",
                    time: timeNow
                })
            })
            if (res.ok) {
                showToast("success", type === "in" ? `¡Entrada timbrada con éxito a las ${timeNow}!` : `¡Salida timbrada con éxito a las ${timeNow}!`)
            } else {
                showToast("success", `Timbrado registrado localmente: ${timeNow}`)
            }
        } catch (e) {
            showToast("success", `Timbrado registrado en memoria offline: ${timeNow}`)
        } finally {
            setIsSubmitting(false)
        }
    }

    const completedDaysCount = historyDays.filter(d => d.status === "COMPLETED").length
    const workingDaysCount = historyDays.filter(d => d.isWorkingDay).length
    const progressPercent = Math.min(100, Math.round((completedDaysCount / (workingDaysCount || 26)) * 100))

    return (
        <div className="space-y-5 animate-in fade-in duration-300">
            {/* Toast feedback */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: -15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -15, scale: 0.95 }}
                        className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-xl border ${
                            notification.type === "success"
                                ? "bg-emerald-950/90 text-emerald-200 border-emerald-500/50 shadow-emerald-950/50"
                                : "bg-rose-950/90 text-rose-200 border-rose-500/50 shadow-rose-950/50"
                        }`}
                    >
                        {notification.type === "success" ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                        ) : (
                            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                        )}
                        <span className="text-xs sm:text-sm font-bold font-sans">{notification.message}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ═══════════════════════════════════════════════════════════════════
                1. CONTROL MASTER: TIMBRADO DEL DÍA (OFICIAL PARA TODOS LOS ROLES)
            ═══════════════════════════════════════════════════════════════════ */}
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-xl relative overflow-hidden transition-all">
                {/* Subtle Ambient Accent */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/5 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    {/* Left: Perfil & Reloj En Vivo */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-black uppercase tracking-wider bg-orange-100 dark:bg-cyan-500/20 text-orange-700 dark:text-cyan-300 border border-orange-200 dark:border-cyan-500/40 flex items-center gap-1.5 shadow-sm">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                                <span>Timbrado Oficial Diario</span>
                            </span>

                            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
                                <Briefcase size={12} className="text-slate-500" />
                                <span>{primaryRole}</span>
                            </span>

                            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                {userName}
                            </span>
                        </div>

                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                            <span>Control de Asistencia & Timbrado del Día</span>
                        </h2>

                        <p className="text-xs text-slate-600 dark:text-slate-400 capitalize font-medium">
                            📅 {currentDateStr || "Cargando fecha actual..."}
                        </p>
                    </div>

                    {/* Middle: Reloj Digital y Status */}
                    <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex flex-col items-center sm:items-end px-5 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-inner">
                            <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                <Clock size={11} className="text-emerald-500" /> HORA EN VIVO
                            </span>
                            <span className="text-2xl sm:text-3xl font-mono font-extrabold text-slate-900 dark:text-emerald-400 tracking-wider">
                                {currentTime || "08:00:00 AM"}
                            </span>
                        </div>

                        {/* Status Chip */}
                        <div className="flex flex-col gap-1 text-center sm:text-left">
                            <span className="text-[10px] font-mono uppercase font-bold text-slate-500">Estado de Jornada:</span>
                            {clockOutTime ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/40">
                                    <CheckCircle2 size={14} className="text-indigo-500" />
                                    <span>Jornada Completada</span>
                                </span>
                            ) : clockInTime ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/40">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span>Jornada en Curso</span>
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/40">
                                    <Clock size={14} className="text-amber-500" />
                                    <span>Pendiente de Timbrar</span>
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Right: Botones Oficiales de Timbrado */}
                    <div className="flex items-center gap-3 flex-wrap">
                        {/* 1. BOTÓN TIMBRAR ENTRADA */}
                        <button
                            type="button"
                            onClick={() => handleClock("in")}
                            disabled={Boolean(clockInTime) || isSubmitting}
                            className={`px-5 py-3.5 rounded-2xl text-xs sm:text-sm font-mono font-black flex items-center gap-2.5 transition-all shadow-lg cursor-pointer ${
                                clockInTime
                                    ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40 opacity-90 cursor-default"
                                    : "bg-gradient-to-r from-emerald-500 hover:from-emerald-400 to-teal-600 text-white shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-102 active:scale-98"
                            }`}
                            title={clockInTime ? `Entrada timbrada a las ${clockInTime}` : "Registrar hora de entrada oficial de hoy"}
                        >
                            <Clock size={18} className={clockInTime ? "text-emerald-600 dark:text-emerald-400" : "animate-pulse"} />
                            <span>{clockInTime ? `Entrada: ${clockInTime}` : "Timbrar Entrada del Día"}</span>
                        </button>

                        {/* 2. BOTÓN TIMBRAR SALIDA */}
                        <button
                            type="button"
                            onClick={() => handleClock("out")}
                            disabled={!Boolean(clockInTime) || Boolean(clockOutTime) || isSubmitting}
                            className={`px-5 py-3.5 rounded-2xl text-xs sm:text-sm font-mono font-black flex items-center gap-2.5 transition-all shadow-lg cursor-pointer ${
                                clockOutTime
                                    ? "bg-rose-100 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-500/40 opacity-90 cursor-default"
                                    : !clockInTime
                                        ? "bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700 opacity-60 cursor-not-allowed"
                                        : "bg-gradient-to-r from-rose-500 hover:from-rose-400 to-red-600 text-white shadow-rose-500/30 hover:shadow-rose-500/50 hover:scale-102 active:scale-98"
                            }`}
                            title={
                                !clockInTime 
                                    ? "Debes timbrar la entrada antes de poder timbrar la salida"
                                    : clockOutTime 
                                        ? `Salida timbrada a las ${clockOutTime}` 
                                        : "Registrar hora de salida oficial de hoy"
                            }
                        >
                            <CheckCircle2 size={18} className={clockOutTime ? "text-rose-600 dark:text-rose-400" : ""} />
                            <span>{clockOutTime ? `Salida: ${clockOutTime}` : "Timbrar Salida del Día"}</span>
                        </button>

                        <button
                            type="button"
                            onClick={loadAttendance}
                            disabled={loading}
                            className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer shadow-sm"
                            title="Recargar estado del timbrado"
                        >
                            <RefreshCw size={17} className={loading ? "animate-spin text-orange-500" : ""} />
                        </button>
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════════
                2. INTERFAZ GRÁFICA DE 30 DÍAS (CALENDARIO DE ASISTENCIA & CICLO)
            ═══════════════════════════════════════════════════════════════════ */}
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-xl space-y-4 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-orange-100 dark:bg-cyan-500/20 text-orange-600 dark:text-cyan-400">
                            <Calendar size={18} />
                        </div>
                        <div>
                            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                                <span>Matriz Gráfica de 30 Días de Asistencia</span>
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/40">
                                    {completedDaysCount} de {workingDaysCount} completados ({progressPercent}%)
                                </span>
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                Monitoreo visual de asistencia y disciplina operativa (Lunes a Sábado laborales).
                            </p>
                        </div>
                    </div>

                    {/* Leyenda de Colores */}
                    <div className="flex items-center gap-3 text-[11px] font-medium text-slate-600 dark:text-slate-400 flex-wrap">
                        <div className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-md bg-emerald-500 shadow-sm" />
                            <span>Completado</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-md bg-cyan-400 ring-2 ring-cyan-400/40 animate-pulse" />
                            <span>En Curso / Hoy</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-md bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700" />
                            <span>Pendiente</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-md bg-slate-100 dark:bg-slate-900/40 opacity-50" />
                            <span>Descanso (Dom)</span>
                        </div>
                    </div>
                </div>

                {/* Días de la Semana */}
                <div className="grid grid-cols-7 gap-2">
                    {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((name, i) => (
                        <div 
                            key={name} 
                            className={`text-center text-[11px] font-mono font-bold py-1.5 rounded-lg ${
                                i === 0 
                                    ? 'text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-950/40' 
                                    : 'text-slate-700 dark:text-slate-300 bg-slate-100/70 dark:bg-slate-800/60'
                            }`}
                        >
                            {name}
                        </div>
                    ))}

                    {/* Matriz de Días (1..30/31) */}
                    {historyDays.map((dayItem) => {
                        const isSunday = dayItem.dayOfWeek === 0
                        const isToday = dayItem.isToday

                        let cardStyle = "bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400"
                        let badgeStyle = "text-slate-400 dark:text-slate-500"

                        if (dayItem.status === "COMPLETED") {
                            cardStyle = "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-500/50 text-emerald-900 dark:text-emerald-200 shadow-md shadow-emerald-500/10"
                            badgeStyle = "text-emerald-600 dark:text-emerald-400 font-bold"
                        } else if (dayItem.status === "IN_PROGRESS") {
                            cardStyle = "bg-cyan-50 dark:bg-cyan-950/40 border-cyan-400 dark:border-cyan-500 text-cyan-900 dark:text-cyan-200 ring-2 ring-cyan-400/50"
                            badgeStyle = "text-cyan-600 dark:text-cyan-400 font-bold"
                        } else if (isSunday) {
                            cardStyle = "bg-slate-100/60 dark:bg-slate-950/20 border-slate-200 dark:border-slate-900 text-slate-400 opacity-60"
                        }

                        return (
                            <button
                                key={dayItem.day}
                                type="button"
                                onClick={() => setSelectedDay(dayItem)}
                                className={`group relative p-2.5 sm:p-3 rounded-2xl border flex flex-col items-center justify-between min-h-[72px] sm:min-h-[80px] transition-all cursor-pointer ${cardStyle} ${
                                    isToday 
                                        ? "ring-2 ring-orange-500 dark:ring-cyan-400 shadow-lg scale-102 z-10" 
                                        : "hover:scale-103 hover:border-slate-400 dark:hover:border-slate-600"
                                }`}
                            >
                                <div className="w-full flex items-center justify-between text-[11px]">
                                    <span className={`font-mono font-black ${isToday ? "text-orange-600 dark:text-cyan-300 text-sm" : "text-slate-900 dark:text-white"}`}>
                                        {dayItem.day}
                                    </span>
                                    {isToday && (
                                        <span className="text-[8px] font-mono font-black uppercase px-1.5 py-0.2 rounded-md bg-orange-500 dark:bg-cyan-400 text-white dark:text-black">
                                            HOY
                                        </span>
                                    )}
                                </div>

                                <div className={`text-[9.5px] font-mono tracking-tight text-center mt-1.5 ${badgeStyle}`}>
                                    {isSunday ? (
                                        <span className="text-slate-400">Descanso</span>
                                    ) : dayItem.status === "COMPLETED" ? (
                                        <span className="flex items-center gap-1 justify-center">
                                            <Check size={11} className="stroke-[3]" />
                                            <span>{dayItem.clockInTime ? dayItem.clockInTime.slice(0, 5) : "Listo"}</span>
                                        </span>
                                    ) : dayItem.status === "IN_PROGRESS" ? (
                                        <span className="flex items-center gap-1 justify-center animate-pulse">
                                            <Clock size={11} />
                                            <span>En Curso</span>
                                        </span>
                                    ) : (
                                        <span className="text-slate-400 dark:text-slate-600">Por Iniciar</span>
                                    )}
                                </div>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Modal: Detalle del Día Seleccionado en la Matriz */}
            <AnimatePresence>
                {selectedDay && (
                    <div 
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in"
                        onClick={() => setSelectedDay(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4"
                        >
                            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 rounded-xl bg-orange-100 dark:bg-cyan-500/20 text-orange-600 dark:text-cyan-400 font-bold">
                                        <Calendar size={18} />
                                    </div>
                                    <div>
                                        <h4 className="text-base font-black text-slate-900 dark:text-white">
                                            Día {selectedDay.day} &bull; {selectedDay.dayName}
                                        </h4>
                                        <span className="text-xs text-slate-500 font-mono">{selectedDay.date}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedDay(null)}
                                    className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all cursor-pointer"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="space-y-2.5 text-xs">
                                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                                    <span className="text-slate-500 font-medium">Estado del Timbrado:</span>
                                    <span className="font-bold text-slate-900 dark:text-white font-mono uppercase">
                                        {selectedDay.status === "COMPLETED" ? "✅ Completado" : selectedDay.status === "IN_PROGRESS" ? "🟢 En Curso" : selectedDay.status === "LIBRE" ? "☕ Descanso" : "⏳ Pendiente"}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                                    <span className="text-slate-500 font-medium">Hora de Entrada:</span>
                                    <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">
                                        {selectedDay.clockInTime || "No registrada"}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                                    <span className="text-slate-500 font-medium">Hora de Salida:</span>
                                    <span className="font-bold font-mono text-rose-600 dark:text-rose-400">
                                        {selectedDay.clockOutTime || "No registrada"}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                                    <span className="text-slate-500 font-medium">Colaborador Asignado:</span>
                                    <span className="font-bold text-slate-900 dark:text-white">
                                        {userName} ({primaryRole})
                                    </span>
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    onClick={() => setSelectedDay(null)}
                                    className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                                >
                                    Cerrar Detalle
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
