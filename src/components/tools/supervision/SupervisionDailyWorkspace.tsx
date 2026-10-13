"use client"

import React, { useState, useEffect, useMemo } from "react"
import { 
    Shield, CheckCircle2, Circle, Sparkles, Clock, Calendar, 
    Send, Settings, Copy, Check, Users, DollarSign, Phone, 
    Briefcase, FileText, GraduationCap, TrendingUp, AlertTriangle, 
    BarChart3, RefreshCw, Key, ChevronDown, ChevronRight, X
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface SubCheck {
    id: string
    title: string
    completed: boolean
}

interface SupervisionTask {
    id: string
    num: number
    title: string
    description: string
    category: "rutina" | "finanzas" | "liderazgo" | "estrategia" | "campo"
    freq: "DIARIO" | "SEMANAL" | "MENSUAL"
    completed: boolean
    subChecks?: SubCheck[]
}

const DEFAULT_SUPERVISION_TASKS: SupervisionTask[] = [
    {
        id: "sup-1",
        num: 1,
        title: "Apertura Oficial del Día Operativo",
        description: "Validar inicio formal a las 9:00 AM, habilitación de salas Zoom y asistencia del equipo en el ERP.",
        category: "rutina",
        freq: "DIARIO",
        completed: false
    },
    {
        id: "sup-2",
        num: 2,
        title: "Enviar Mensaje Motivante de Buenos Días",
        description: "Publicar el mensaje de energía, foco en metas ($400/día por asesor) y enfoque comercial en los grupos oficiales de WhatsApp.",
        category: "liderazgo",
        freq: "DIARIO",
        completed: false
    },
    {
        id: "sup-3",
        num: 3,
        title: "Escribir de Forma Personal a los Asesores",
        description: "Feedback individual 1 a 1 a cada vendedor con reconocimiento o empuje directo según su rendimiento del día anterior.",
        category: "liderazgo",
        freq: "DIARIO",
        completed: false
    },
    {
        id: "sup-4",
        num: 4,
        title: "Registrar y Balancear Finanzas Diarias",
        description: "Verificar ingresos reales por cotizaciones facturadas, abonos, transferencias a cuentas de empresa y liquidaciones.",
        category: "finanzas",
        freq: "DIARIO",
        completed: false
    },
    {
        id: "sup-5",
        num: 5,
        title: "Registrar y Auditar Deudas / Cuentas por Cobrar",
        description: "Monitoreo de saldos de clientes pendientes, créditos autorizados y pagos a proveedores clave.",
        category: "finanzas",
        freq: "DIARIO",
        completed: false
    },
    {
        id: "sup-6",
        num: 6,
        title: "Auditoría de Llamadas Comerciales Pendientes",
        description: "Verificar que cada asesor ejecute sus 7 llamadas grabadas en Zoom y apoyar en objeciones complejas.",
        category: "rutina",
        freq: "DIARIO",
        completed: false
    },
    {
        id: "sup-7",
        num: 7,
        title: "Revisión de Informes Técnicos y Visitas",
        description: "Comprobar actas de entrega de instalaciones de CCTV, cercos o cerraduras firmadas y fotografías en sistema.",
        category: "rutina",
        freq: "DIARIO",
        completed: false
    },
    {
        id: "sup-8",
        num: 8,
        title: "Capacitación y Refuerzo de Producto",
        description: "Revisar argumentos de venta, fichas técnicas y manejo de objeciones con las 5 escuadras de Suicide Squad.",
        category: "liderazgo",
        freq: "DIARIO",
        completed: false
    },
    {
        id: "sup-9",
        num: 9,
        title: "Supervisión de Ruta de Vendedor",
        description: "Comprobar avance en el plan diario de los 10 teléfonos, 5 posts y 3 grupos por vendedor.",
        category: "rutina",
        freq: "DIARIO",
        completed: false
    },
    {
        id: "sup-10",
        num: 10,
        title: "Resumen y Métricas de Pautas Digitales",
        description: "Revisión del costo por mensaje, leads generados en Meta Ads y TikTok de campañas institucionales.",
        category: "estrategia",
        freq: "DIARIO",
        completed: false
    },
    {
        id: "sup-11",
        num: 11,
        title: "Revisión de RRHH y Novedades de Personal",
        description: "Control de puntualidad, justificaciones médicas, contratos y clima laboral del equipo.",
        category: "liderazgo",
        freq: "DIARIO",
        completed: false
    },
    {
        id: "sup-12",
        num: 12,
        title: "Revisión Semanal de Vendedores y Rendimiento",
        description: "Auditoría integral del ranking de ventas de la semana, efectividad de cierre y cumplimiento de la meta de $30k.",
        category: "estrategia",
        freq: "SEMANAL",
        completed: false
    },
    {
        id: "sup-13",
        num: 13,
        title: "Conversar 1 Hora con Santiago (Dirección)",
        description: "Reunión estratégica semanal de alineación operativa y toma de decisiones clave.",
        category: "estrategia",
        freq: "SEMANAL",
        completed: false,
        subChecks: [
            { id: "sub-stock", title: "Disponibilidad y rotación de Stock", completed: false },
            { id: "sub-promo", title: "Estrategia de Promociones y Combos", completed: false },
            { id: "sub-rel", title: "Relaciones clave, alianzas e instituciones", completed: false }
        ]
    },
    {
        id: "sup-14",
        num: 14,
        title: "Hablar con Proveedores en Persona (Semanal)",
        description: "Visita presencial o negociación directa con importadores para asegurar mejores márgenes de costo y garantías.",
        category: "campo",
        freq: "SEMANAL",
        completed: false
    },
    {
        id: "sup-15",
        num: 15,
        title: "Reunión con Clientes Estratégicos (Semanal)",
        description: "Al menos una reunión presencial o virtual de alto nivel con constructoras, administradores de conjuntos o corporativos.",
        category: "campo",
        freq: "SEMANAL",
        completed: false
    },
    {
        id: "sup-16",
        num: 16,
        title: "Jornada de Volanteo y Activación en Calle",
        description: "Supervisar o coordinar volanteo físico semanal en zonas comerciales y urbanizaciones de alto flujo.",
        category: "campo",
        freq: "SEMANAL",
        completed: false
    },
    {
        id: "sup-17",
        num: 17,
        title: "Cartas de Presentación a Conjuntos Residenciales",
        description: "Envío formal de carpetas corporativas y propuestas de modernización a directivas de condominios.",
        category: "estrategia",
        freq: "SEMANAL",
        completed: false
    },
    {
        id: "sup-18",
        num: 18,
        title: "Campaña de Tags NFC y Llave Cero (Mensual)",
        description: "Activación mensual de prospección con tarjetas NFC, placas inteligentes de contacto y demostraciones tecnológicas.",
        category: "campo",
        freq: "MENSUAL",
        completed: false
    }
]

export default function SupervisionDailyWorkspace({
    onSwitchRole
}: {
    onSwitchRole?: (role: "VENTAS" | "COORDINACION" | "EDICION" | "SOFTWARE") => void
}) {
    const today = new Date().toISOString().split("T")[0]
    const storageKey = `atomic_supervision_workspace_${today}`

    const [tasks, setTasks] = useState<SupervisionTask[]>(DEFAULT_SUPERVISION_TASKS)
    const [dayOpened, setDayOpened] = useState(false)
    const [openedAtTime, setOpenedAtTime] = useState<string | null>(null)
    const [showTokensModal, setShowTokensModal] = useState(false)
    const [tokens, setTokens] = useState({ facebook: "", instagram: "", tiktok: "" })
    const [copiedMotivational, setCopiedMotivational] = useState(false)

    // Cargar estado guardado
    useEffect(() => {
        try {
            const saved = localStorage.getItem(storageKey)
            if (saved) {
                const parsed = JSON.parse(saved)
                if (parsed.tasks) setTasks(parsed.tasks)
                if (parsed.dayOpened) setDayOpened(parsed.dayOpened)
                if (parsed.openedAtTime) setOpenedAtTime(parsed.openedAtTime)
            }
            const savedTokens = localStorage.getItem("atomic_social_tokens_config")
            if (savedTokens) {
                setTokens(JSON.parse(savedTokens))
            }
        } catch (e) {
            console.error("Error loading supervision state", e)
        }
    }, [storageKey])

    // Guardar cambios
    const saveState = (updatedTasks: SupervisionTask[], opened = dayOpened, time = openedAtTime) => {
        try {
            localStorage.setItem(storageKey, JSON.stringify({
                tasks: updatedTasks,
                dayOpened: opened,
                openedAtTime: time
            }))
        } catch (e) {
            console.error("Error saving supervision state", e)
        }
    }

    const toggleTask = (taskId: string) => {
        const next = tasks.map(t => {
            if (t.id === taskId) {
                return { ...t, completed: !t.completed }
            }
            return t
        })
        setTasks(next)
        saveState(next)
    }

    const toggleSubCheck = (taskId: string, subId: string) => {
        const next = tasks.map(t => {
            if (t.id === taskId && t.subChecks) {
                const nextSubs = t.subChecks.map(s => s.id === subId ? { ...s, completed: !s.completed } : s)
                const allDone = nextSubs.every(s => s.completed)
                return { ...t, subChecks: nextSubs, completed: allDone }
            }
            return t
        })
        setTasks(next)
        saveState(next)
    }

    const handleOpenDay = () => {
        const timeNow = new Date().toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" })
        setDayOpened(true)
        setOpenedAtTime(timeNow)
        const next = tasks.map(t => t.id === "sup-1" ? { ...t, completed: true } : t)
        setTasks(next)
        saveState(next, true, timeNow)
    }

    const handleSaveTokens = () => {
        localStorage.setItem("atomic_social_tokens_config", JSON.stringify(tokens))
        setShowTokensModal(false)
    }

    const copyMotivationalTemplate = () => {
        const msg = `⚡ *BUENOS DÍAS EQUIPO ATOMIC — 9:00 AM EN SALA*\n\nHoy salimos a ganar el día. Recordatorio de enfoque:\n🎯 *Meta Diaria por Asesor:* $400 en ventas aprobadas\n📞 *Compromiso:* 10 números investigados + 7 llamadas efectivas por Zoom\n📢 *Marketplace:* 5 publicaciones optimizadas + 3 grupos locales\n\n_¡La constancia vence a la suerte. Vamos por los cierres de hoy!_`
        navigator.clipboard.writeText(msg)
        setCopiedMotivational(true)
        setTimeout(() => setCopiedMotivational(false), 2500)
    }

    // Progreso
    const completedCount = tasks.filter(t => t.completed).length
    const totalCount = tasks.length
    const progressPercent = Math.round((completedCount / (totalCount || 1)) * 100)

    // Esquema de días
    const daysOfWeek = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]
    const currentDayIdx = (new Date().getDay() + 6) % 7

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            
            {/* ── BANNER PRINCIPAL DE SUPERVISIÓN: APERTURA & CONTROLES ── */}
            <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-orange-950/40 border border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-5 shadow-2xl">
                <div className="space-y-1.5 text-center md:text-left">
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                        <Shield size={18} className="text-amber-400" />
                        <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest">
                            Panel Oficial de Supervisión General • Juan Guzmán / atomic@industrias.ec
                        </span>
                    </div>
                    <h2 className="text-xl font-black text-white">
                        {dayOpened ? `✅ Jornada Abierta a las ${openedAtTime}` : "⚡ Apertura del Día Operativo"}
                    </h2>
                    <p className="text-xs text-slate-400 font-mono">
                        Auditoría de 18 protocolos ejecutivos diarios, semanales y mensuales para garantizar la meta de $30k.
                    </p>
                </div>

                <div className="flex items-center gap-3 shrink-0 flex-wrap justify-center">
                    {!dayOpened ? (
                        <button
                            type="button"
                            onClick={handleOpenDay}
                            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-black font-black text-xs font-mono uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-500/25 active:scale-95 transition-all cursor-pointer"
                        >
                            <Sparkles size={16} />
                            <span>Abrir Día Oficial</span>
                        </button>
                    ) : (
                        <div className="px-4 py-2 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-amber-400" />
                            <span>Día Operativo Activo</span>
                        </div>
                    )}

                    {/* Botón rueda dentada: Configurar Tokens Redes Sociales */}
                    <button
                        type="button"
                        onClick={() => setShowTokensModal(true)}
                        className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 shadow-md transition-all cursor-pointer group"
                        title="Configurar Tokens API de Facebook, Instagram y TikTok"
                    >
                        <Settings size={18} className="group-hover:rotate-90 transition-transform duration-300 text-amber-400" />
                    </button>
                </div>
            </div>

            {/* ── BARRA RÁPIDA: INSPECCIÓN DE OTRAS RUTAS DEL DÍA ── */}
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                    <Users size={14} className="text-cyan-400" />
                    <span>Auditar Rutas de Cuadrillas:</span>
                </span>

                <div className="flex items-center gap-2 flex-wrap">
                    <button
                        type="button"
                        onClick={() => onSwitchRole?.("COORDINACION")}
                        className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5"
                    >
                        <span>👥 Coordinación</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => onSwitchRole?.("VENTAS")}
                        className="px-3 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5"
                    >
                        <span>💼 Ventas</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => onSwitchRole?.("EDICION")}
                        className="px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5"
                    >
                        <span>🎬 Edición (Stefy)</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => onSwitchRole?.("SOFTWARE")}
                        className="px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5"
                    >
                        <span>💻 Software</span>
                    </button>
                </div>
            </div>

            {/* ── ESQUEMA ESTADÍSTICO & GRÁFICO DE DÍAS (CUMPLIMIENTO SEMANAL) ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Cuadro Resumen Progreso */}
                <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div className="space-y-1">
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                            Cumplimiento de Hoy
                        </span>
                        <div className="text-3xl font-black text-amber-400">
                            {completedCount} <span className="text-sm font-normal text-slate-500">/ {totalCount}</span>
                        </div>
                        <span className="text-[11px] font-mono text-emerald-400 font-bold block">
                            {progressPercent}% completado
                        </span>
                    </div>

                    <div className="w-16 h-16 rounded-full border-4 border-slate-800 border-t-amber-400 border-r-amber-400 flex items-center justify-center font-black text-xs font-mono text-white">
                        {progressPercent}%
                    </div>
                </div>

                {/* Gráfico Semanal de Días */}
                <div className="md:col-span-2 p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between px-1">
                        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase flex items-center gap-1">
                            <BarChart3 size={13} className="text-amber-400" />
                            <span>Esquema Estadístico de Supervisión (7 Días)</span>
                        </span>
                        <span className="text-[10px] font-mono text-amber-400 font-bold">
                            Semana Activa
                        </span>
                    </div>

                    <div className="grid grid-cols-7 gap-1.5 text-center">
                        {daysOfWeek.map((dayName, idx) => {
                            const isToday = idx === currentDayIdx
                            const isPast = idx < currentDayIdx
                            const heightPct = isToday ? Math.max(25, progressPercent) : isPast ? 85 : 15

                            return (
                                <div key={dayName} className="flex flex-col items-center gap-1">
                                    <div className="w-full h-16 bg-slate-950 rounded-xl p-1 flex items-end justify-center border border-slate-800/80">
                                        <div
                                            className={`w-full rounded-lg transition-all duration-500 ${
                                                isToday
                                                    ? "bg-gradient-to-t from-amber-500 to-orange-400 shadow-[0_0_10px_rgba(245,158,11,0.4)]"
                                                    : isPast
                                                        ? "bg-emerald-500/70"
                                                        : "bg-slate-800"
                                            }`}
                                            style={{ height: `${heightPct}%` }}
                                        />
                                    </div>
                                    <span className={`text-[9px] font-mono uppercase font-bold ${isToday ? "text-amber-300" : "text-slate-500"}`}>
                                        {dayName.slice(0, 3)}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>

            </div>

            {/* ── ACCIONES RÁPIDAS DE SUPERVISIÓN ── */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/20 to-orange-950/20 border border-amber-500/20 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                    <Send size={16} className="text-amber-400" />
                    <div>
                        <h4 className="text-xs font-black text-white">Mensaje Motivacional Diario para WhatsApp</h4>
                        <p className="text-[10px] text-slate-400 font-mono">Plantilla lista con meta de $400/día y recordatorio de Zoom</p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={copyMotivationalTemplate}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                >
                    {copiedMotivational ? <Check size={14} className="stroke-[3]" /> : <Copy size={14} />}
                    <span>{copiedMotivational ? "¡Copiado!" : "Copiar Plantilla WhatsApp"}</span>
                </button>
            </div>

            {/* ── LISTA DE PROTOCOLOS DE SUPERVISIÓN (CON SUB-CHECKS) ── */}
            <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                        Lista de Verificación de Supervisión ({tasks.length} Protocolos)
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                        Marca cada protocolo al concluirlo
                    </span>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                    {tasks.map((task) => {
                        return (
                            <div
                                key={task.id}
                                className={`p-4 rounded-2xl border transition-all ${
                                    task.completed
                                        ? "bg-amber-950/15 border-amber-500/40 opacity-80"
                                        : "bg-slate-900/90 border-slate-800 hover:border-amber-500/30"
                                }`}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-start gap-3">
                                        <button
                                            type="button"
                                            onClick={() => toggleTask(task.id)}
                                            className="mt-0.5 text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
                                        >
                                            {task.completed ? (
                                                <CheckCircle2 size={20} className="text-amber-400 fill-amber-500/20" />
                                            ) : (
                                                <Circle size={20} className="text-slate-600 hover:text-slate-400" />
                                            )}
                                        </button>

                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="text-[10px] font-mono font-bold px-2 py-0.2 rounded-md bg-black/40 text-amber-400 border border-amber-500/30">
                                                    #{task.num}
                                                </span>
                                                <h4 className={`text-xs sm:text-sm font-bold transition-colors ${
                                                    task.completed ? "line-through text-slate-400" : "text-white"
                                                }`}>
                                                    {task.title}
                                                </h4>
                                                <span className={`text-[9px] font-mono font-bold px-2 py-0.2 rounded-full uppercase border ${
                                                    task.freq === "DIARIO"
                                                        ? "bg-blue-500/10 text-blue-300 border-blue-500/30"
                                                        : task.freq === "SEMANAL"
                                                            ? "bg-purple-500/10 text-purple-300 border-purple-500/30"
                                                            : "bg-rose-500/10 text-rose-300 border-rose-500/30"
                                                }`}>
                                                    {task.freq}
                                                </span>
                                            </div>

                                            <p className="text-[11px] text-slate-400 font-mono leading-relaxed">
                                                {task.description}
                                            </p>

                                            {/* Sub-checks para Reunión con Santiago */}
                                            {task.subChecks && task.subChecks.length > 0 && (
                                                <div className="mt-3 p-3 rounded-xl bg-black/40 border border-white/5 space-y-2">
                                                    <span className="text-[10px] font-mono font-bold text-amber-300 uppercase block">
                                                        Sub-tópicos obligatorios de la reunión:
                                                    </span>
                                                    <div className="space-y-1.5">
                                                        {task.subChecks.map((sub) => (
                                                            <label
                                                                key={sub.id}
                                                                className="flex items-center gap-2 text-xs font-mono text-slate-300 cursor-pointer hover:text-white"
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    checked={sub.completed}
                                                                    onChange={() => toggleSubCheck(task.id, sub.id)}
                                                                    className="rounded bg-slate-800 border-slate-700 text-amber-400 focus:ring-amber-400 cursor-pointer"
                                                                />
                                                                <span className={sub.completed ? "line-through text-slate-500" : ""}>
                                                                    {sub.title}
                                                                </span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* ── MODAL: CONFIGURACIÓN DE TOKENS DE REDES SOCIALES (JUAN SUPERVISOR) ── */}
            <AnimatePresence>
                {showTokensModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="w-full max-w-lg bg-slate-900 border border-amber-500/40 rounded-3xl p-6 shadow-2xl space-y-5"
                        >
                            <div className="flex items-center justify-between border-b border-white/10 pb-3">
                                <div className="flex items-center gap-2">
                                    <Key size={18} className="text-amber-400" />
                                    <h3 className="text-base font-black text-white">Configurar Tokens de Redes Sociales</h3>
                                </div>
                                <button
                                    onClick={() => setShowTokensModal(false)}
                                    className="p-1.5 text-slate-400 hover:text-white rounded-xl"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <p className="text-xs text-slate-400 font-mono">
                                Ingresa las claves API y Access Tokens para habilitar la publicación automática desde el módulo de Edición (Stefy).
                            </p>

                            <div className="space-y-4 text-xs font-mono">
                                <div className="space-y-1.5">
                                    <label className="text-slate-300 font-bold block">Token de Facebook Graph API</label>
                                    <input
                                        type="password"
                                        value={tokens.facebook}
                                        onChange={e => setTokens({ ...tokens, facebook: e.target.value })}
                                        placeholder="EAA..."
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-amber-400"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-slate-300 font-bold block">Token de Instagram Business API</label>
                                    <input
                                        type="password"
                                        value={tokens.instagram}
                                        onChange={e => setTokens({ ...tokens, instagram: e.target.value })}
                                        placeholder="IGQV..."
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-amber-400"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-slate-300 font-bold block">Token de TikTok Open API / Secret</label>
                                    <input
                                        type="password"
                                        value={tokens.tiktok}
                                        onChange={e => setTokens({ ...tokens, tiktok: e.target.value })}
                                        placeholder="act.xxx..."
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-amber-400"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowTokensModal(false)}
                                    className="px-4 py-2 text-xs font-mono text-slate-400 hover:text-white"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSaveTokens}
                                    className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-orange-500 text-black font-black text-xs font-mono uppercase rounded-xl shadow-md hover:scale-105 active:scale-95 transition-all"
                                >
                                    Guardar Tokens
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    )
}
