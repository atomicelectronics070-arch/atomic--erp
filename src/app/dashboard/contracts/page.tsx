"use client"

import { useState, useRef, useCallback } from "react"
import { Calendar as CalendarIcon, Upload, CheckCircle2, FileSignature, Timer, ShieldAlert, ChevronRight, Loader2, FileText, X } from "lucide-react"

// Helper to compute cycle info from a start date
function getCycleInfo(cycleStartDate: Date) {
    const now = new Date()
    const msPerDay = 1000 * 60 * 60 * 24
    const elapsed = Math.floor((now.getTime() - cycleStartDate.getTime()) / msPerDay)
    const currentDay = Math.min(elapsed + 1, 30)
    const daysRemaining = Math.max(30 - currentDay, 0)
    const progress = Math.min((currentDay / 30) * 100, 100)
    return { currentDay, daysRemaining, progress }
}

// Helper to get week status based on current day of cycle
function getWeekStatus(weekStart: number, weekEnd: number, currentDay: number) {
    if (currentDay > weekEnd) return "completed"
    if (currentDay >= weekStart && currentDay <= weekEnd) return "pending"
    return "upcoming"
}

const WEEK_DEFINITIONS = [
    { id: 1, start: 1, end: 7, label: "Día 1 – 7", type: "Inducción" },
    { id: 2, start: 8, end: 14, label: "Día 8 – 14", type: "Prospección" },
    { id: 3, start: 15, end: 21, label: "Día 15 – 21", type: "Ventas" },
    { id: 4, start: 22, end: 30, label: "Día 22 – 30", type: "Cierre" },
]

export default function ContractsEvidencePage() {
    // Role toggle (Admin vs Colaborador)
    const [isAdmin, setIsAdmin] = useState(false)

    // Admin: pending contract requests
    const [adminContracts, setAdminContracts] = useState([
        { id: 1, user: "Carlos Rodriguez", status: "pending", date: "2026-03-05", file: "contrato_carlos.pdf" },
        { id: 2, user: "Ana Martinez", status: "approved", date: "2026-02-15", cycleStart: "2026-02-16", file: "contrato_ana.pdf" },
    ])

    // Colaborador: contract upload state
    const [uploadedFile, setUploadedFile] = useState<File | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [cycleStartDate, setCycleStartDate] = useState<Date | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        if (file.type !== "application/pdf") {
            alert("Solo se permiten archivos PDF.")
            return
        }
        setUploadedFile(file)
    }, [])

    const handleUpload = useCallback(async () => {
        if (!uploadedFile) return
        setIsUploading(true)
        // Simulate upload delay
        await new Promise(r => setTimeout(r, 2000))
        setCycleStartDate(new Date())
        setIsUploading(false)
    }, [uploadedFile])

    const handleResetUpload = useCallback(() => {
        setUploadedFile(null)
        setCycleStartDate(null)
        if (fileInputRef.current) fileInputRef.current.value = ""
    }, [])

    const handleApproveAdmin = (id: number) => {
        setAdminContracts(prev => prev.map(c =>
            c.id === id ? { ...c, status: "approved", cycleStart: new Date().toISOString().split('T')[0] } : c
        ))
    }

    // Cycle computation
    const cycleInfo = cycleStartDate ? getCycleInfo(cycleStartDate) : null

    const approvedAdminContract = adminContracts.find(c => c.status === "approved")

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-neutral-900 uppercase">
                        Contratos &amp; <span className="text-orange-600">Ciclo Laboral</span>
                    </h1>
                    <p className="text-neutral-500 font-medium">Gestión de vinculación legal y seguimiento del programa de 30 días.</p>
                </div>
                {/* Role toggle for demo */}
                <button
                    onClick={() => setIsAdmin(a => !a)}
                    className="flex items-center gap-2 px-4 py-2 border border-neutral-200 rounded-none text-xs font-bold uppercase tracking-widest hover:bg-neutral-100 transition-all"
                >
                    <span className={`w-2 h-2 rounded-full ${isAdmin ? "bg-orange-500" : "bg-blue-500"}`} />
                    Vista: {isAdmin ? "Administrador" : "Colaborador"}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Panel */}
                <div className="lg:col-span-1 space-y-6">
                    {isAdmin ? (
                        /* Admin: Pending Requests */
                        <div className="bg-white rounded-none border border-neutral-200 shadow-sm overflow-hidden flex flex-col">
                            <div className="p-8 border-b border-neutral-100">
                                <h2 className="text-xl font-bold text-neutral-900 uppercase tracking-tight flex items-center">
                                    <ShieldAlert size={22} className="mr-3 text-orange-600" /> Solicitudes Pendientes
                                </h2>
                            </div>
                            <div className="p-4 space-y-4">
                                {adminContracts.filter(c => c.status === "pending").length === 0 && (
                                    <p className="text-sm text-neutral-400 text-center py-6 font-medium">No hay solicitudes pendientes.</p>
                                )}
                                {adminContracts.filter(c => c.status === "pending").map(contract => (
                                    <div key={contract.id} className="bg-neutral-50 p-6 rounded-none border border-neutral-100">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <div className="w-10 h-10 bg-orange-100 rounded-none flex items-center justify-center text-orange-600 font-bold">
                                                {contract.user[0]}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-neutral-900">{contract.user}</p>
                                                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{contract.date}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col space-y-2">
                                            <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium bg-neutral-100 px-3 py-2">
                                                <FileText size={14} className="text-orange-500" />
                                                {contract.file}
                                            </div>
                                            <button
                                                onClick={() => handleApproveAdmin(contract.id)}
                                                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-none text-xs font-bold transition-all shadow-lg shadow-orange-500/20"
                                            >
                                                Aprobar y Activar Ciclo
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        /* Colaborador: Upload */
                        <div className="bg-white rounded-none border border-neutral-200 shadow-sm p-8">
                            {!cycleStartDate ? (
                                <>
                                    <div className="w-20 h-20 bg-orange-50 text-orange-600 rounded-none flex items-center justify-center mx-auto mb-6">
                                        <FileSignature size={40} />
                                    </div>
                                    <h2 className="text-xl font-bold text-neutral-900 uppercase mb-2 text-center">Mi Contrato</h2>
                                    <p className="text-sm text-neutral-500 mb-6 font-medium text-center">
                                        Sube tu contrato firmado (PDF) para iniciar tu ciclo de 30 días.
                                    </p>

                                    {/* File Selector */}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="application/pdf"
                                        className="hidden"
                                        onChange={handleFileSelect}
                                    />

                                    {!uploadedFile ? (
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="w-full border-2 border-dashed border-orange-300 hover:border-orange-500 bg-orange-50/50 text-orange-600 font-bold py-8 rounded-none flex flex-col items-center justify-center transition-all gap-2 text-xs uppercase tracking-widest"
                                        >
                                            <Upload size={28} />
                                            Seleccionar PDF
                                        </button>
                                    ) : (
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 bg-neutral-50 border border-neutral-200 px-4 py-3">
                                                <FileText size={18} className="text-orange-500 shrink-0" />
                                                <span className="text-xs font-bold text-neutral-700 truncate flex-1">{uploadedFile.name}</span>
                                                <button onClick={handleResetUpload} className="text-neutral-400 hover:text-red-500 transition-colors">
                                                    <X size={16} />
                                                </button>
                                            </div>
                                            <button
                                                onClick={handleUpload}
                                                disabled={isUploading}
                                                className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-bold py-4 rounded-none flex items-center justify-center transition-all shadow-xl shadow-orange-500/20 active:scale-95 text-xs uppercase tracking-[0.2em] gap-2"
                                            >
                                                {isUploading ? (
                                                    <><Loader2 size={18} className="animate-spin" /> Subiendo...</>
                                                ) : (
                                                    <><Upload size={18} /> Subir y Activar Ciclo</>
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                /* Uploaded success */
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-none flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle2 size={36} />
                                    </div>
                                    <h2 className="text-lg font-bold text-green-700 uppercase mb-1">¡Contrato Activado!</h2>
                                    <p className="text-xs text-neutral-500 font-medium mb-4">{uploadedFile?.name}</p>
                                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                                        Inicio: {cycleStartDate.toLocaleDateString("es-EC", { day: "2-digit", month: "long", year: "numeric" })}
                                    </p>
                                    <button
                                        onClick={handleResetUpload}
                                        className="mt-6 text-xs text-neutral-400 hover:text-red-500 underline transition-colors"
                                    >
                                        Reiniciar (demo)
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Cycle Status Card (Colaborador only when cycle is active) */}
                    {!isAdmin && cycleInfo && (
                        <div className="bg-neutral-950 rounded-none p-8 text-white border border-neutral-800">
                            <div className="flex items-center space-x-2 text-orange-500 mb-4">
                                <Timer size={18} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Estado del Ciclo</span>
                            </div>
                            <h3 className="text-3xl font-bold mb-1">
                                Día {cycleInfo.currentDay} <span className="text-sm text-neutral-500">/ 30</span>
                            </h3>
                            <div className="w-full bg-neutral-800 h-2 rounded-none overflow-hidden mt-4">
                                <div
                                    className="bg-orange-600 h-full transition-all duration-700"
                                    style={{ width: `${cycleInfo.progress}%` }}
                                />
                            </div>
                            <p className="text-[10px] text-neutral-400 mt-4 uppercase font-bold tracking-widest">
                                {cycleInfo.daysRemaining === 0
                                    ? "¡Ciclo completado!"
                                    : `Faltan ${cycleInfo.daysRemaining} día${cycleInfo.daysRemaining !== 1 ? "s" : ""} para revisión final`}
                            </p>
                        </div>
                    )}
                </div>

                {/* Right Panel: 30-Day Timeline */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-none border border-neutral-200 shadow-sm p-8">
                        <div className="flex flex-wrap justify-between items-center mb-8 border-b border-neutral-100 pb-4 gap-3">
                            <h2 className="text-2xl font-bold text-neutral-900 uppercase tracking-tight flex items-center">
                                <CalendarIcon size={24} className="mr-3 text-orange-600" /> Plan de Desarrollo (30 días)
                            </h2>
                            <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-3 py-1.5 rounded-none uppercase tracking-widest">
                                {isAdmin
                                    ? (approvedAdminContract?.cycleStart ? `Inicio: ${approvedAdminContract.cycleStart}` : "Sin ciclo activo")
                                    : (cycleStartDate
                                        ? `Inicio: ${cycleStartDate.toLocaleDateString("es-EC")}`
                                        : "Pendiente")}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {WEEK_DEFINITIONS.map((week) => {
                                const status = cycleInfo
                                    ? getWeekStatus(week.start, week.end, cycleInfo.currentDay)
                                    : "upcoming"

                                return (
                                    <div
                                        key={week.id}
                                        className={`p-6 rounded-none border-2 transition-all flex flex-col justify-between ${status === "completed"
                                            ? "border-green-100 bg-green-50/20"
                                            : status === "pending"
                                                ? "border-orange-200 bg-orange-50/50 shadow-lg shadow-orange-500/10 scale-[1.02]"
                                                : "border-neutral-100 bg-neutral-50/50 opacity-40 grayscale"
                                            }`}
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-none ${status === "completed" ? "text-green-600 bg-green-100" : "text-orange-600 bg-orange-100"}`}>
                                                    {week.type}
                                                </span>
                                                <h4 className="text-xl font-bold text-neutral-900 mt-2">Semana {week.id}</h4>
                                                <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest">{week.label}</p>
                                            </div>
                                            {status === "completed" ? (
                                                <div className="w-10 h-10 bg-green-500 rounded-none flex items-center justify-center text-white shadow-lg shadow-green-500/20">
                                                    <CheckCircle2 size={24} />
                                                </div>
                                            ) : (
                                                <div className="w-10 h-10 bg-orange-100 rounded-none flex items-center justify-center text-orange-600">
                                                    <CalendarIcon size={24} />
                                                </div>
                                            )}
                                        </div>

                                        <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                                            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                                                {status === "completed" ? "Verificado" : status === "pending" ? "Acción Requerida" : "Bloqueado"}
                                            </span>
                                            {status === "pending" && (
                                                <button className="text-orange-600 hover:text-orange-700 font-bold text-sm uppercase flex items-center transition-all hover:translate-x-1">
                                                    Ver <ChevronRight size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
