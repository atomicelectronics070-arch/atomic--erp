"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    CheckSquare, Clock, AlertCircle, Plus, Send, 
    CheckCircle2, User, RefreshCw, Trash2, Calendar, 
    FileText, Tag, Shield, ChevronRight, UploadCloud, 
    Sparkles, ArrowRight, ExternalLink, X, Filter
} from "lucide-react"

interface Advisor {
    id: string
    name: string
    lastName?: string
    email: string
    role: string
    phoneNumber?: string
}

interface DirectedTask {
    id: string
    title: string
    taskType: "TEXTO" | "TIEMPO_LIMITADO" | "ABIERTO" | "EVIDENCIA"
    priority: "BAJA" | "MEDIA" | "ALTA" | "URGENTE"
    instructions: string
    deadline?: string | null
    status: "PENDIENTE" | "EN_PROGRESO" | "COMPLETADA" | "RECHAZADA"
    responseNotes?: string | null
    proofUrl?: string | null
    completedAt?: string | null
    createdAt: string
    sender?: { id: string; name: string; email: string; role: string }
    receiver?: { id: string; name: string; lastName?: string; email: string; role: string }
    isSender?: boolean
    isReceiver?: boolean
}

export default function DirectedTasksPanel() {
    const [loading, setLoading] = useState(true)
    const [isAdministrative, setIsAdministrative] = useState(false)
    const [advisors, setAdvisors] = useState<Advisor[]>([])
    const [tasks, setTasks] = useState<DirectedTask[]>([])
    const [filterStatus, setFilterStatus] = useState<string>("ALL")

    // Create Task Form State
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [selectedReceiverId, setSelectedReceiverId] = useState("")
    const [taskTitle, setTaskTitle] = useState("")
    const [taskType, setTaskType] = useState<"TEXTO" | "TIEMPO_LIMITADO" | "ABIERTO" | "EVIDENCIA">("TEXTO")
    const [priority, setPriority] = useState<"BAJA" | "MEDIA" | "ALTA" | "URGENTE">("ALTA")
    const [deadlineDate, setDeadlineDate] = useState("")
    const [deadlineTime, setDeadlineTime] = useState("17:00")
    const [instructions, setInstructions] = useState("")
    const [submittingTask, setSubmittingTask] = useState(false)

    // Complete / Respond Task Modal State
    const [respondingTask, setRespondingTask] = useState<DirectedTask | null>(null)
    const [responseNotes, setResponseNotes] = useState("")
    const [proofUrl, setProofUrl] = useState("")
    const [updatingStatus, setUpdatingStatus] = useState(false)

    // Toast
    const [toastMessage, setToastMessage] = useState<string | null>(null)
    const showToast = (msg: string) => {
        setToastMessage(msg)
        setTimeout(() => setToastMessage(null), 3500)
    }

    const fetchTasks = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/attendance/tasks")
            if (res.ok) {
                const data = await res.json()
                setIsAdministrative(!!data.isAdministrative)
                setAdvisors(data.advisors || [])
                setTasks(data.tasks || [])
                if (data.advisors?.length > 0 && !selectedReceiverId) {
                    setSelectedReceiverId(data.advisors[0].id)
                }
            }
        } catch (e) {
            console.error("Error loading directed tasks:", e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTasks()
    }, [])

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedReceiverId || !taskTitle.trim() || !instructions.trim()) {
            alert("Completa los campos obligatorios (Asesor, Título e Instrucciones)")
            return
        }

        setSubmittingTask(true)
        try {
            let combinedDeadline: string | null = null
            if (taskType === "TIEMPO_LIMITADO" && deadlineDate) {
                combinedDeadline = `${deadlineDate}T${deadlineTime || "17:00"}:00-05:00`
            }

            const res = await fetch("/api/attendance/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "create_task",
                    receiverId: selectedReceiverId,
                    title: taskTitle,
                    taskType,
                    priority,
                    deadline: combinedDeadline,
                    instructions
                })
            })

            const data = await res.json()
            if (data.success) {
                showToast("🎯 Tarea dirigida enviada exitosamente")
                setShowCreateModal(false)
                setTaskTitle("")
                setInstructions("")
                setDeadlineDate("")
                await fetchTasks()
            } else {
                alert(data.error || "Error al crear la tarea")
            }
        } catch (e: any) {
            alert(e.message || "Error al conectar con el servidor")
        } finally {
            setSubmittingTask(false)
        }
    }

    const handleUpdateTaskStatus = async (taskId: string, newStatus: string, notes?: string, proof?: string) => {
        setUpdatingStatus(true)
        try {
            const res = await fetch("/api/attendance/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "update_task_status",
                    taskId,
                    status: newStatus,
                    responseNotes: notes,
                    proofUrl: proof
                })
            })
            const data = await res.json()
            if (data.success) {
                showToast(`✅ Tarea marcada como: ${newStatus}`)
                setRespondingTask(null)
                setResponseNotes("")
                setProofUrl("")
                await fetchTasks()
            } else {
                alert(data.error || "No se pudo actualizar la tarea")
            }
        } catch (e: any) {
            alert(e.message || "Error al actualizar")
        } finally {
            setUpdatingStatus(false)
        }
    }

    const handleDeleteTask = async (taskId: string) => {
        if (!confirm("¿Seguro que deseas eliminar esta tarea dirigida?")) return
        try {
            const res = await fetch("/api/attendance/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "delete_task", taskId })
            })
            const data = await res.json()
            if (data.success) {
                showToast("🗑️ Tarea eliminada")
                await fetchTasks()
            }
        } catch (_) {}
    }

    const filteredTasks = tasks.filter(t => {
        if (filterStatus === "ALL") return true
        return t.status === filterStatus
    })

    return (
        <div className="space-y-6">
            {/* Toast */}
            {toastMessage && (
                <div className="fixed top-20 right-6 z-50 px-5 py-3 rounded-2xl bg-emerald-500 text-black font-black text-xs shadow-2xl flex items-center gap-2 animate-bounce border-2 border-white">
                    <CheckCircle2 size={16} />
                    <span>{toastMessage}</span>
                </div>
            )}

            {/* Header / Sub-Banner */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 uppercase tracking-wider flex items-center gap-1">
                            <Sparkles size={12} /> Tareas Dirigidas en Tiempo Real
                        </span>
                        {isAdministrative ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                Modo Supervisor / Asignador
                            </span>
                        ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                Mis Tareas Asignadas
                            </span>
                        )}
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-white">
                        {isAdministrative ? "Gestión y Asignación de Tareas Dirigidas" : "Bandeja de Tareas Operativas Asignadas"}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
                        {isAdministrative 
                            ? "Asigna instrucciones específicas a cualquier asesor: tipo de tarea (texto, tiempo limitado, evidencia o abierta), prioridad y fecha límite."
                            : "Recibe notificaciones inmediatas de tu supervisor o coordinador, reporta tu avance y envía tus comprobantes o notas de cumplimiento."}
                    </p>
                </div>

                <div className="flex items-center gap-2 self-stretch sm:self-auto">
                    {isAdministrative && (
                        <button
                            type="button"
                            onClick={() => setShowCreateModal(true)}
                            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 transition-all active:scale-95 cursor-pointer"
                        >
                            <Plus size={16} />
                            <span>Nueva Tarea</span>
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={fetchTasks}
                        disabled={loading}
                        className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer"
                        title="Recargar tareas"
                    >
                        <RefreshCw size={16} className={loading ? "animate-spin text-cyan-400" : ""} />
                    </button>
                </div>
            </div>

            {/* Filter status tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono">
                {[
                    { id: "ALL", label: `Todas (${tasks.length})` },
                    { id: "PENDIENTE", label: `Pendientes (${tasks.filter(t => t.status === "PENDIENTE").length})` },
                    { id: "EN_PROGRESO", label: `En Progreso (${tasks.filter(t => t.status === "EN_PROGRESO").length})` },
                    { id: "COMPLETADA", label: `Completadas (${tasks.filter(t => t.status === "COMPLETADA").length})` },
                ].map(tab => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setFilterStatus(tab.id)}
                        className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                            filterStatus === tab.id 
                                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-black" 
                                : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tasks Cards Grid */}
            {loading ? (
                <div className="text-center py-20 text-slate-500 text-xs flex items-center justify-center gap-2">
                    <RefreshCw size={16} className="animate-spin text-indigo-400" />
                    <span>Cargando tareas dirigidas...</span>
                </div>
            ) : filteredTasks.length === 0 ? (
                <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800/80 p-6 space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mx-auto">
                        <CheckSquare size={22} />
                    </div>
                    <div className="text-slate-300 font-bold text-sm">No hay tareas dirigidas registradas</div>
                    <p className="text-slate-500 text-xs max-w-sm mx-auto">
                        {isAdministrative 
                            ? "Usa el botón '+ Nueva Tarea' para enviar instrucciones específicas y personalizadas a tu equipo de ventas."
                            : "¡Todo al día! Cuando tu coordinador o supervisor te asigne una tarea prioritaria aparecerá aquí automáticamente."}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredTasks.map(task => {
                        const isCompleted = task.status === "COMPLETADA"
                        const isInProgress = task.status === "EN_PROGRESO"

                        let priorityColor = "bg-slate-800 text-slate-300 border-slate-700"
                        if (task.priority === "URGENTE") priorityColor = "bg-rose-500/20 text-rose-300 border-rose-500/40"
                        if (task.priority === "ALTA") priorityColor = "bg-amber-500/20 text-amber-300 border-amber-500/40"
                        if (task.priority === "MEDIA") priorityColor = "bg-indigo-500/20 text-indigo-300 border-indigo-500/40"

                        return (
                            <div 
                                key={task.id}
                                className={`rounded-3xl p-5 border flex flex-col justify-between space-y-4 shadow-xl transition-all ${
                                    isCompleted 
                                        ? "bg-slate-950/60 border-emerald-500/30 opacity-80" 
                                        : isInProgress 
                                            ? "bg-gradient-to-b from-[#0b1228] to-[#070b1a] border-cyan-500/40 ring-1 ring-cyan-500/30" 
                                            : "bg-[#090d1e] border-slate-800 hover:border-indigo-500/40"
                                }`}
                            >
                                <div className="space-y-3">
                                    {/* Top Badges */}
                                    <div className="flex items-center justify-between gap-2 flex-wrap">
                                        <div className="flex items-center gap-1.5">
                                            <span className={`px-2 py-0.5 rounded-md text-[9px] font-mono font-black border uppercase ${priorityColor}`}>
                                                {task.priority}
                                            </span>
                                            <span className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold bg-white/10 text-slate-300">
                                                {task.taskType}
                                            </span>
                                        </div>

                                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold ${
                                            isCompleted 
                                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40" 
                                                : isInProgress 
                                                    ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40" 
                                                    : "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                                        }`}>
                                            {task.status}
                                        </span>
                                    </div>

                                    {/* Task Title */}
                                    <h3 className="text-base font-black text-white leading-snug">
                                        {task.title}
                                    </h3>

                                    {/* Assigned info */}
                                    <div className="text-[11px] font-mono text-slate-400 space-y-1 bg-black/30 p-2.5 rounded-xl border border-white/5">
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-500">Para:</span>
                                            <span className="text-cyan-300 font-bold truncate max-w-[150px]">
                                                {task.receiver?.name || task.receiver?.email}
                                            </span>
                                        </div>
                                        {task.sender && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-500">De:</span>
                                                <span className="text-slate-300 truncate max-w-[150px]">
                                                    {task.sender.name || task.sender.email}
                                                </span>
                                            </div>
                                        )}
                                        {task.deadline && (
                                            <div className="flex items-center justify-between pt-1 border-t border-white/5 text-amber-300">
                                                <span className="flex items-center gap-1">
                                                    <Clock size={11} /> Límite:
                                                </span>
                                                <span>{new Date(task.deadline).toLocaleString("es-EC", { dateStyle: "short", timeStyle: "short" })}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Instructions Box */}
                                    <div className="text-xs text-slate-300 leading-relaxed bg-slate-900/80 p-3 rounded-2xl border border-slate-800 whitespace-pre-wrap">
                                        {task.instructions}
                                    </div>

                                    {/* Response / Notes if completed */}
                                    {task.responseNotes && (
                                        <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-xs space-y-1">
                                            <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase block">
                                                💬 Reporte de Cumplimiento:
                                            </span>
                                            <p className="text-slate-200">{task.responseNotes}</p>
                                        </div>
                                    )}

                                    {task.proofUrl && (
                                        <a 
                                            href={task.proofUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:underline font-mono"
                                        >
                                            <ExternalLink size={12} />
                                            <span>Ver Comprobante Adjunto</span>
                                        </a>
                                    )}
                                </div>

                                {/* Actions Bottom Bar */}
                                <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                                    {/* Advisor actions */}
                                    {!isCompleted && (
                                        <div className="flex items-center gap-2 flex-1">
                                            {!isInProgress && (
                                                <button
                                                    type="button"
                                                    disabled={updatingStatus}
                                                    onClick={() => handleUpdateTaskStatus(task.id, "EN_PROGRESO")}
                                                    className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold font-mono transition-all cursor-pointer"
                                                >
                                                    Iniciar
                                                </button>
                                            )}

                                            <button
                                                type="button"
                                                onClick={() => setRespondingTask(task)}
                                                className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-emerald-950/50"
                                            >
                                                Completar
                                            </button>
                                        </div>
                                    )}

                                    {/* Admin delete button */}
                                    {isAdministrative && (
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteTask(task.id)}
                                            className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                                            title="Eliminar tarea"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* ════ MODAL CREAR TAREA DIRIGIDA (ADMINS / COORDINADORES) ════ */}
            <AnimatePresence>
                {showCreateModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowCreateModal(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 15 }}
                            className="relative w-full max-w-xl bg-[#090d1e] border-2 border-indigo-500/40 rounded-3xl p-6 shadow-2xl z-10 space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar"
                        >
                            <div className="flex items-center justify-between border-b border-white/10 pb-3">
                                <div className="flex items-center gap-2.5">
                                    <div className="p-2 rounded-xl bg-indigo-500 text-black">
                                        <Plus size={18} className="stroke-[3]" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-black text-white">Nueva Tarea Dirigida</h3>
                                        <p className="text-[11px] font-mono text-slate-400">Asignación directa con parámetros de ejecución</p>
                                    </div>
                                </div>
                                <button onClick={() => setShowCreateModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                                    <X size={18} />
                                </button>
                            </div>

                            <form onSubmit={handleCreateTask} className="space-y-4 text-xs font-mono">
                                {/* Asesor Seleccionado */}
                                <div>
                                    <label className="text-slate-300 block mb-1.5 font-bold">1. Seleccionar Asesor / Colaborador:</label>
                                    <select
                                        value={selectedReceiverId}
                                        onChange={(e) => setSelectedReceiverId(e.target.value)}
                                        className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-400"
                                        required
                                    >
                                        {advisors.map(adv => (
                                            <option key={adv.id} value={adv.id}>
                                                {adv.name} {adv.lastName || ""} ({adv.role}) - {adv.email}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Título de la Tarea */}
                                <div>
                                    <label className="text-slate-300 block mb-1.5 font-bold">2. Título de la Tarea:</label>
                                    <input
                                        type="text"
                                        placeholder="Ej: Publicar 5 kits de videoportero en Marketplace sector La Carolina"
                                        value={taskTitle}
                                        onChange={(e) => setTaskTitle(e.target.value)}
                                        className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
                                        required
                                    />
                                </div>

                                {/* Tipo de Tarea & Prioridad */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-slate-300 block mb-1.5 font-bold">3. Tipo de Tarea:</label>
                                        <select
                                            value={taskType}
                                            onChange={(e) => setTaskType(e.target.value as any)}
                                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-400"
                                        >
                                            <option value="TEXTO">Texto / Instrucción</option>
                                            <option value="TIEMPO_LIMITADO">Tiempo Limitado (Con Límite)</option>
                                            <option value="ABIERTO">Abierta (Flexible)</option>
                                            <option value="EVIDENCIA">Evidencia / Foto Requerida</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-slate-300 block mb-1.5 font-bold">4. Prioridad:</label>
                                        <select
                                            value={priority}
                                            onChange={(e) => setPriority(e.target.value as any)}
                                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-400"
                                        >
                                            <option value="BAJA">Baja</option>
                                            <option value="MEDIA">Media</option>
                                            <option value="ALTA">Alta</option>
                                            <option value="URGENTE">Urgente</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Fecha y Hora límite si es tiempo limitado */}
                                {taskType === "TIEMPO_LIMITADO" && (
                                    <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                                        <div>
                                            <label className="text-amber-300 block mb-1 text-[11px] font-bold">Fecha Límite:</label>
                                            <input
                                                type="date"
                                                value={deadlineDate}
                                                onChange={(e) => setDeadlineDate(e.target.value)}
                                                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="text-amber-300 block mb-1 text-[11px] font-bold">Hora Límite:</label>
                                            <input
                                                type="time"
                                                value={deadlineTime}
                                                onChange={(e) => setDeadlineTime(e.target.value)}
                                                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                                                required
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Instrucciones Detalladas */}
                                <div>
                                    <label className="text-slate-300 block mb-1.5 font-bold">5. Instrucciones Detalladas:</label>
                                    <textarea
                                        rows={4}
                                        placeholder="Escribe paso a paso lo que el colaborador debe realizar, enlaces de referencia, condiciones o metas específicas..."
                                        value={instructions}
                                        onChange={(e) => setInstructions(e.target.value)}
                                        className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400 resize-none"
                                        required
                                    />
                                </div>

                                <div className="pt-2 flex items-center justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateModal(false)}
                                        className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submittingTask}
                                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-black font-black uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-indigo-950/50 cursor-pointer"
                                    >
                                        {submittingTask ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
                                        <span>Asignar Tarea Dirigida</span>
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ════ MODAL COMPLETAR / RESPONDER TAREA ════ */}
            <AnimatePresence>
                {respondingTask && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setRespondingTask(null)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 15 }}
                            className="relative w-full max-w-lg bg-[#090d1e] border-2 border-emerald-500/50 rounded-3xl p-6 shadow-2xl z-10 space-y-4"
                        >
                            <div className="flex items-center justify-between border-b border-white/10 pb-3">
                                <div className="flex items-center gap-2.5">
                                    <div className="p-2 rounded-xl bg-emerald-500 text-black">
                                        <CheckCircle2 size={18} />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-black text-white">Completar Tarea</h3>
                                        <p className="text-[11px] font-mono text-emerald-400">{respondingTask.title}</p>
                                    </div>
                                </div>
                                <button onClick={() => setRespondingTask(null)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="space-y-4 text-xs font-mono">
                                <div>
                                    <label className="text-slate-300 block mb-1 font-bold">Reporte / Observaciones de Cumplimiento:</label>
                                    <textarea
                                        rows={3}
                                        placeholder="Describe lo realizado, números contactados, publicaciones completadas o novedades..."
                                        value={responseNotes}
                                        onChange={(e) => setResponseNotes(e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="text-slate-300 block mb-1 font-bold">Enlace o URL de Evidencia (Opcional):</label>
                                    <input
                                        type="url"
                                        placeholder="https://drive.google.com/... o enlace de captura"
                                        value={proofUrl}
                                        onChange={(e) => setProofUrl(e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                                    />
                                </div>

                                <div className="pt-2 flex items-center justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setRespondingTask(null)}
                                        className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="button"
                                        disabled={updatingStatus}
                                        onClick={() => handleUpdateTaskStatus(respondingTask.id, "COMPLETADA", responseNotes, proofUrl)}
                                        className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-950/50 cursor-pointer"
                                    >
                                        {updatingStatus ? <RefreshCw size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                                        <span>Confirmar y Enviar</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
