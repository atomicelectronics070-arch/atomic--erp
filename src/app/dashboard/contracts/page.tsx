"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Calendar as CalendarIcon, Upload, CheckCircle2, FileSignature, Timer, ShieldAlert, ChevronRight, Loader2, FileText, X, DollarSign, Percent } from "lucide-react"

// Helper to compute cycle info from a start date
function getCycleInfo(startDateStr: string | null) {
    if (!startDateStr) return null
    const cycleStartDate = new Date(startDateStr)
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
    const { data: session } = useSession()
    const isAdmin = session?.user?.role === "ADMIN" || session?.user?.role === "MANAGER"

    // User Cycle state
    const [myCycle, setMyCycle] = useState<any>(null)
    const [loadingCycle, setLoadingCycle] = useState(true)

    // Admin: pending contract requests
    const [pendingRequests, setPendingRequests] = useState<any[]>([])
    const [loadingPending, setLoadingPending] = useState(false)
    const [approveForm, setApproveForm] = useState({ fixedPay: "0", commissionPct: "0" })

    // Colaborador: contract upload state
    const [uploadedFile, setUploadedFile] = useState<File | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const fetchMyCycle = useCallback(async () => {
        try {
            const res = await fetch("/api/contracts/me")
            const data = await res.json()
            if (data.cycle) setMyCycle(data.cycle)
        } catch (error) {
            console.error("Error fetching cycle:", error)
        } finally {
            setLoadingCycle(false)
        }
    }, [])

    const fetchPendingRequests = useCallback(async () => {
        if (!isAdmin) return
        setLoadingPending(true)
        try {
            const res = await fetch("/api/contracts/all")
            const data = await res.json()
            if (data.cycles) setPendingRequests(data.cycles)
        } catch (error) {
            console.error("Error fetching pending:", error)
        } finally {
            setLoadingPending(false)
        }
    }, [isAdmin])

    useEffect(() => {
        fetchMyCycle()
        if (isAdmin) fetchPendingRequests()
    }, [fetchMyCycle, fetchPendingRequests, isAdmin])

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
        
        const formData = new FormData()
        formData.append("file", uploadedFile)

        try {
            const res = await fetch("/api/contracts/upload", {
                method: "POST",
                body: formData
            })
            const data = await res.json()
            if (data.success) {
                alert("Contrato subido. Espera a que el administrador lo apruebe para iniciar tu ciclo.")
                setUploadedFile(null)
                fetchMyCycle()
            } else {
                alert(data.error || "Error al subir")
            }
        } catch (error) {
            alert("Error de conexión al subir contrato")
        } finally {
            setIsUploading(false)
        }
    }, [uploadedFile, fetchMyCycle])

    const handleApproveAdmin = async (cycleId: string) => {
        try {
            const res = await fetch("/api/contracts/approve", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    cycleId,
                    fixedPay: approveForm.fixedPay,
                    commissionPct: approveForm.commissionPct
                })
            })
            const data = await res.json()
            if (data.success) {
                alert("Ciclo activado exitosamente")
                fetchPendingRequests()
                fetchMyCycle() // Update current view if admin is checking their own or just refreshing
            } else {
                alert(data.error || "Error al aprobar")
            }
        } catch (error) {
            alert("Error de conexión al aprobar")
        }
    }

    const handleResetUpload = useCallback(() => {
        setUploadedFile(null)
        if (fileInputRef.current) fileInputRef.current.value = ""
    }, [])

    // Cycle computation for current user
    const cycleInfo = myCycle?.isActive ? getCycleInfo(myCycle.startDate) : null

    if (loadingCycle) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-orange-600" size={48} />
            </div>
        )
    }

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
                <div className="flex items-center gap-2 px-4 py-2 bg-neutral-100 border border-neutral-200 text-[10px] font-bold uppercase tracking-widest text-neutral-600">
                    <span className={`w-2 h-2 rounded-full ${isAdmin ? "bg-orange-500" : "bg-blue-500"}`} />
                    Rol: {session?.user?.role || "COLABORADOR"}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Panel */}
                <div className="lg:col-span-1 space-y-6">
                    {isAdmin && (
                        /* Admin: Pending Requests */
                        <div className="bg-white rounded-none border border-neutral-200 shadow-sm overflow-hidden flex flex-col">
                            <div className="p-8 border-b border-neutral-100">
                                <h2 className="text-xl font-bold text-neutral-900 uppercase tracking-tight flex items-center">
                                    <ShieldAlert size={22} className="mr-3 text-orange-600" /> Solicitudes Pendientes
                                </h2>
                            </div>
                            <div className="p-4 space-y-4">
                                {loadingPending ? (
                                    <div className="flex justify-center py-8"><Loader2 className="animate-spin text-neutral-400" /></div>
                                ) : pendingRequests.length === 0 ? (
                                    <p className="text-sm text-neutral-400 text-center py-6 font-medium">No hay solicitudes pendientes.</p>
                                ) : (
                                    pendingRequests.map(cycle => (
                                        <div key={cycle.id} className="bg-neutral-50 p-6 rounded-none border border-neutral-100 space-y-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-orange-100 rounded-none flex items-center justify-center text-orange-600 font-bold uppercase">
                                                    {cycle.user?.name?.[0] || "U"}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-neutral-900">{cycle.user?.name}</p>
                                                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{new Date(cycle.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            
                                            <a 
                                                href={cycle.contractUrl} 
                                                target="_blank" 
                                                rel="noreferrer"
                                                className="flex items-center gap-2 text-xs text-orange-600 font-bold hover:underline bg-orange-50 px-3 py-2"
                                            >
                                                <FileText size={14} />
                                                Ver Contrato Subido
                                            </a>

                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="space-y-1">
                                                    <label className="text-[9px] font-bold text-neutral-500 uppercase">Sueldo Fijo ($)</label>
                                                    <input 
                                                        type="number" 
                                                        className="w-full bg-white border border-neutral-200 px-2 py-1.5 text-xs font-bold"
                                                        value={approveForm.fixedPay}
                                                        onChange={(e) => setApproveForm(prev => ({ ...prev, fixedPay: e.target.value }))}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[9px] font-bold text-neutral-500 uppercase">Comisión (%)</label>
                                                    <input 
                                                        type="number" 
                                                        className="w-full bg-white border border-neutral-200 px-2 py-1.5 text-xs font-bold"
                                                        value={approveForm.commissionPct}
                                                        onChange={(e) => setApproveForm(prev => ({ ...prev, commissionPct: e.target.value }))}
                                                    />
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => handleApproveAdmin(cycle.id)}
                                                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-none text-xs font-bold transition-all shadow-lg shadow-orange-500/20"
                                            >
                                                Aprobar y Activar Ciclo
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {!isAdmin && (
                        /* Colaborador Section */
                        <div className="bg-white rounded-none border border-neutral-200 shadow-sm p-8">
                            {!myCycle ? (
                                /* No cycle at all -> Upload */
                                <>
                                    <div className="w-20 h-20 bg-orange-50 text-orange-600 rounded-none flex items-center justify-center mx-auto mb-6">
                                        <FileSignature size={40} />
                                    </div>
                                    <h2 className="text-xl font-bold text-neutral-900 uppercase mb-2 text-center">Mi Contrato</h2>
                                    <p className="text-sm text-neutral-500 mb-6 font-medium text-center">
                                        Sube tu contrato firmado (PDF) para iniciar tu proceso de validación.
                                    </p>

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
                                                    <><Upload size={18} /> Subir Contrato</>
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : myCycle.isActive === false ? (
                                /* Cycle exists but not approved */
                                <div className="text-center py-6">
                                    <div className="w-20 h-20 bg-neutral-100 text-neutral-400 rounded-none flex items-center justify-center mx-auto mb-6">
                                        <Timer size={40} />
                                    </div>
                                    <h2 className="text-lg font-bold text-neutral-900 uppercase mb-2">Validación Pendiente</h2>
                                    <p className="text-xs text-neutral-500 font-medium mb-6">
                                        Tu contrato ha sido recibido. El administrador debe validarlo y configurar tus términos para iniciar el ciclo de 30 días.
                                    </p>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-100 text-[10px] font-bold text-neutral-500 uppercase tracking-widest border border-neutral-200">
                                        Estatus: Esperando Aprobación
                                    </div>
                                </div>
                            ) : (
                                /* Active cycle info */
                                <div className="space-y-6">
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-none flex items-center justify-center mx-auto mb-4">
                                            <CheckCircle2 size={36} />
                                        </div>
                                        <h2 className="text-lg font-bold text-green-700 uppercase mb-1">¡Ciclo Activado!</h2>
                                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-6">
                                            Inició el: {new Date(myCycle.startDate).toLocaleDateString("es-EC", { day: "2-digit", month: "long", year: "numeric" })}
                                        </p>
                                    </div>

                                    {/* Economic Terms for User */}
                                    <div className="grid grid-cols-2 gap-4 border-t border-neutral-100 pt-6">
                                        <div className="bg-neutral-50 p-4 border border-neutral-100">
                                            <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                                                <DollarSign size={10} /> Sueldo Fijo
                                            </p>
                                            <p className="text-xl font-black text-neutral-900">${myCycle.fixedPay || 0}</p>
                                        </div>
                                        <div className="bg-neutral-50 p-4 border border-neutral-100">
                                            <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                                                <Percent size={10} /> Comisiones
                                            </p>
                                            <p className="text-xl font-black text-neutral-900">{myCycle.commissionPct || 0}%</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Cycle Status Card (Colaborador only when cycle is active) */}
                    {!isAdmin && cycleInfo && (
                        <div className="bg-neutral-950 rounded-none p-8 text-white border border-neutral-800 shadow-2xl">
                            <div className="flex items-center space-x-2 text-orange-500 mb-4">
                                <Timer size={18} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Progreso del Programa</span>
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
                                    ? "¡Felicidades! Ciclo completado"
                                    : `Faltan ${cycleInfo.daysRemaining} días para cumplir el ciclo`}
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
                                {myCycle?.isActive 
                                    ? `Vence: ${new Date(myCycle.endDate).toLocaleDateString("es-EC")}`
                                    : "Esperando activación"}
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
                                            ? "border-green-100 bg-green-50/10 grayscale-[0.5]"
                                            : status === "pending"
                                                ? "border-orange-200 bg-orange-50/30 shadow-lg shadow-orange-500/5 scale-[1.02] border-dashed"
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
                                                {status === "completed" ? "Verificado" : status === "pending" ? "En curso" : "Bloqueado"}
                                            </span>
                                            {status === "pending" && (
                                                <button className="text-orange-600 hover:text-orange-700 font-bold text-sm uppercase flex items-center transition-all hover:translate-x-1">
                                                    Ver Detalle <ChevronRight size={16} />
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
