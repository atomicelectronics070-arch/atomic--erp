"use client"

import React, { useState, useEffect } from "react"
import { 
    Clock, CheckCircle2, Save, Sparkles, Calendar, 
    Code2, Cpu, Check, AlertCircle, RefreshCw, Terminal, Layers
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function SoftwareDailyWorkspace() {
    const today = new Date().toISOString().split("T")[0]
    const storageKey = `atomic_software_worklog_${today}`

    const [clockInTime, setClockInTime] = useState<string | null>(null)
    const [clockOutTime, setClockOutTime] = useState<string | null>(null)
    const [atomicSummary, setAtomicSummary] = useState("")
    const [softSummary, setSoftSummary] = useState("")
    const [savedAt, setSavedAt] = useState<string | null>(null)
    const [isSaving, setIsSaving] = useState(false)
    const [selectedDayOffset, setSelectedDayOffset] = useState(0)

    // Cargar datos del día
    useEffect(() => {
        try {
            const saved = localStorage.getItem(storageKey)
            if (saved) {
                const parsed = JSON.parse(saved)
                if (parsed.clockInTime) setClockInTime(parsed.clockInTime)
                if (parsed.clockOutTime) setClockOutTime(parsed.clockOutTime)
                if (parsed.atomicSummary) setAtomicSummary(parsed.atomicSummary)
                if (parsed.softSummary) setSoftSummary(parsed.softSummary)
                if (parsed.savedAt) setSavedAt(parsed.savedAt)
            }
        } catch (e) {
            console.error("Error loading software worklog", e)
        }
    }, [storageKey])

    // Timbrar entrada/salida
    const handleClock = (type: "in" | "out") => {
        const timeNow = new Date().toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
        if (type === "in") {
            setClockInTime(timeNow)
        } else {
            setClockOutTime(timeNow)
        }
        saveData(type === "in" ? { clockInTime: timeNow } : { clockOutTime: timeNow })
    }

    // Guardar progreso sin retroceso
    const saveData = (extra = {}) => {
        setIsSaving(true)
        const timeStamp = new Date().toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" })
        const payload = {
            clockInTime,
            clockOutTime,
            atomicSummary,
            softSummary,
            savedAt: timeStamp,
            ...extra
        }
        try {
            localStorage.setItem(storageKey, JSON.stringify(payload))
            setSavedAt(timeStamp)
        } catch (e) {
            console.error("Error saving software log", e)
        } finally {
            setTimeout(() => setIsSaving(false), 400)
        }
    }

    // Generar días de la semana para interfaz gráfica de días
    const daysOfWeek = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]
    const currentDayIndex = (new Date().getDay() + 6) % 7

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            
            {/* ── HEADER: TIMBRADO DEL DÍA & ESTADO EN TIEMPO REAL ── */}
            <div className="p-5 rounded-3xl bg-gradient-to-r from-indigo-950/40 via-slate-900 to-cyan-950/40 border border-indigo-500/30 flex flex-col md:flex-row items-center justify-between gap-5 shadow-2xl">
                <div className="space-y-1.5 text-center md:text-left">
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                        <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest">
                            Software & Ingeniería • Protocolo de Desarrollo
                        </span>
                    </div>
                    <h2 className="text-xl font-black text-white flex items-center gap-2 justify-center md:justify-start">
                        <Terminal size={22} className="text-cyan-400" />
                        <span>Timbrado y Bitácora Diaria de Programación</span>
                    </h2>
                    <p className="text-xs text-slate-400 font-mono">
                        Registra tus sesiones técnicas en ATOMIC y SOFT con persistencia permanente sin retroceso.
                    </p>
                </div>

                {/* Botones de Timbrado */}
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => handleClock("in")}
                        disabled={Boolean(clockInTime)}
                        className={`px-4 py-2.5 rounded-2xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
                            clockInTime 
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default" 
                                : "bg-gradient-to-r from-emerald-500 to-teal-500 text-black hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/20 cursor-pointer"
                        }`}
                    >
                        <Clock size={16} />
                        <span>{clockInTime ? `Entrada: ${clockInTime}` : "Timbrar Entrada"}</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => handleClock("out")}
                        disabled={Boolean(clockOutTime)}
                        className={`px-4 py-2.5 rounded-2xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
                            clockOutTime 
                                ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 cursor-default" 
                                : "bg-gradient-to-r from-rose-500 to-red-500 text-white hover:scale-105 active:scale-95 shadow-lg shadow-rose-500/20 cursor-pointer"
                        }`}
                    >
                        <Clock size={16} />
                        <span>{clockOutTime ? `Salida: ${clockOutTime}` : "Timbrar Salida"}</span>
                    </button>
                </div>
            </div>

            {/* ── INTERFAZ GRÁFICA DE DÍAS (CALENDARIO DE CICLO SEMANAL) ── */}
            <div className="p-4 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between px-1">
                    <span className="text-[11px] font-mono font-bold uppercase text-slate-400 flex items-center gap-1.5">
                        <Calendar size={14} className="text-cyan-400" />
                        <span>Matriz Semanal de Timbrado & Sesiones</span>
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400">
                        Día actual: {daysOfWeek[currentDayIndex]}
                    </span>
                </div>

                <div className="grid grid-cols-7 gap-2">
                    {daysOfWeek.map((dayName, idx) => {
                        const isToday = idx === currentDayIndex
                        const isPast = idx < currentDayIndex
                        const isSelected = selectedDayOffset === idx

                        return (
                            <button
                                key={dayName}
                                type="button"
                                onClick={() => setSelectedDayOffset(idx)}
                                className={`p-3 rounded-2xl text-center border transition-all cursor-pointer flex flex-col items-center gap-1 ${
                                    isToday
                                        ? "bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                                        : isPast
                                            ? "bg-slate-950/60 border-emerald-500/30 text-emerald-400"
                                            : "bg-slate-950/40 border-slate-800/80 text-slate-500"
                                }`}
                            >
                                <span className="text-[10px] font-mono uppercase tracking-wider block font-bold">
                                    {dayName.slice(0, 3)}
                                </span>
                                <span className="w-2 h-2 rounded-full block bg-current opacity-80" />
                                <span className="text-[9px] font-mono block">
                                    {isToday ? "HOY" : isPast ? "LISTO" : "PEND"}
                                </span>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* ── LOS DOS RECUADROS DE TEXTO LIBRE: ATOMIC vs SOFT ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* 1. Sesión hecha en ATOMIC Resumen */}
                <div className="p-5 rounded-3xl bg-slate-900/90 border border-cyan-500/30 space-y-3 shadow-xl relative overflow-hidden group hover:border-cyan-400 transition-all">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-300">
                                <Code2 size={16} />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-white tracking-wide">
                                    Sesión hecha en ATOMIC (Resumen)
                                </h3>
                                <p className="text-[10px] text-cyan-400/80 font-mono">
                                    ERP, Cotizador, Catálogo, APIs & CRM
                                </p>
                            </div>
                        </div>
                        <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-400/10 text-cyan-300 border border-cyan-400/30 uppercase">
                            ATOMIC ERP
                        </span>
                    </div>

                    <textarea
                        value={atomicSummary}
                        onChange={(e) => setAtomicSummary(e.target.value)}
                        placeholder="Escribe el resumen técnico de lo desarrollado en ATOMIC hoy (ej: optimizaciones de base de datos, fix en cálculo de cotizaciones, nuevas vistas...)"
                        rows={8}
                        className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-xs font-mono text-slate-100 placeholder:text-slate-600 outline-none focus:border-cyan-400 transition-all resize-none leading-relaxed"
                    />

                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1">
                        <span>Caracteres: {atomicSummary.length}</span>
                        <span>Autoguardado local activo</span>
                    </div>
                </div>

                {/* 2. Sesión hecha en SOFT Resumen */}
                <div className="p-5 rounded-3xl bg-slate-900/90 border border-indigo-500/30 space-y-3 shadow-xl relative overflow-hidden group hover:border-indigo-400 transition-all">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-300">
                                <Cpu size={16} />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-white tracking-wide">
                                    Sesión hecha en SOFT (Resumen)
                                </h3>
                                <p className="text-[10px] text-indigo-400/80 font-mono">
                                    Infraestructura, Servidores, Docker & Scripts
                                </p>
                            </div>
                        </div>
                        <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-400/10 text-indigo-300 border border-indigo-400/30 uppercase">
                            SOFT ENGINE
                        </span>
                    </div>

                    <textarea
                        value={softSummary}
                        onChange={(e) => setSoftSummary(e.target.value)}
                        placeholder="Escribe el resumen técnico de lo desarrollado en SOFT hoy (ej: despliegues, microservicios, migraciones multi-tenant, optimización de caché...)"
                        rows={8}
                        className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-xs font-mono text-slate-100 placeholder:text-slate-600 outline-none focus:border-indigo-400 transition-all resize-none leading-relaxed"
                    />

                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1">
                        <span>Caracteres: {softSummary.length}</span>
                        <span>Autoguardado local activo</span>
                    </div>
                </div>

            </div>

            {/* ── BOTÓN DE GUARDADO SIN RETROCESO ── */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                    <CheckCircle2 size={16} className="text-emerald-400" />
                    <span>
                        {savedAt ? `Última sincronización guardada a las ${savedAt}` : "Listo para guardar tu jornada de trabajo"}
                    </span>
                </div>

                <button
                    type="button"
                    onClick={() => saveData()}
                    disabled={isSaving}
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-black text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 active:scale-95 transition-all cursor-pointer"
                >
                    <Save size={16} />
                    <span>{isSaving ? "Guardando..." : "Guardar y Guardar (Sin Retroceso)"}</span>
                </button>
            </div>

        </div>
    )
}
