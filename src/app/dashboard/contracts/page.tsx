"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Calendar as CalendarIcon, Upload, CheckCircle2, FileSignature, 
    Timer, ShieldAlert, ChevronRight, Loader2, FileText, X, 
    DollarSign, Percent, Zap, Target, ShieldCheck, ArrowUpRight,
    TrendingUp, Briefcase
} from "lucide-react"

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
            if (res.ok) {
                const data = await res.json()
                if (data.cycle) setMyCycle(data.cycle)
            }
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
            if (res.ok) {
                const data = await res.json()
                if (data.cycles) setPendingRequests(data.cycles)
            }
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
                alert("CONTRATO_REGISTRADO: Espera la auditoría del administrador para iniciar el ciclo.")
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
                alert("ACTIVO: Ciclo operativo activado exitosamente.")
                fetchPendingRequests()
                fetchMyCycle()
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

    const cycleInfo = myCycle?.isActive ? getCycleInfo(myCycle.startDate) : null

    if (loadingCycle) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[500px] space-y-8 animate-pulse text-slate-800">
                <div className="w-16 h-16 border-4 border-white/5 border-t-secondary rounded-full animate-spin shadow-2xl"></div>
                <p className="text-[10px] font-black uppercase tracking-[0.5em] italic">Sincronizando Historial Contractual...</p>
            </div>
        )
    }

    return (
        <div className="space-y-16 pb-32 animate-in fade-in duration-1000 relative">
            {/* Background Orbs */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[5%] right-[-5%] w-[40%] h-[40%] rounded-full bg-azure-500/5 blur-[120px]" />
                <div className="absolute bottom-[10%] left-[-5%] w-[35%] h-[35%] rounded-full bg-tomato-500/3 blur-[100px]" />
            </div>

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 border-b border-white/5 pb-16 relative z-10">
                <div>
                     <div className="flex items-center space-x-4 mb-4 text-secondary">
                        <ShieldCheck size={20} className="drop-shadow-[0_0_8px_rgba(255,99,71,0.5)]" />
                        <span className="text-[10px] uppercase font-black tracking-[0.6em] italic">Protocolo Legal & Operativo</span>
                    </div>
                    <h1 className="text-6xl font-black tracking-tighter text-white uppercase italic leading-none">
                        CONTRATOS & <span className="text-secondary underline decoration-secondary/30 underline-offset-8">CICLO LABORAL</span>
                    </h1>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.3em] mt-5 max-w-xl italic leading-relaxed">
                        Gestión táctica de vinculación legal y monitoreo estratégico del programa de alto rendimiento de 30 días.
                    </p>
                </div>
                <div className="flex items-center gap-6 glass-panel !bg-slate-950/40 px-8 py-4 rounded-2xl border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500 italic shadow-2xl ring-1 ring-white/5">
                    <span className={`w-3 h-3 rounded-full animate-pulse ${isAdmin ? "bg-secondary shadow-[0_0_10px_rgba(255,99,71,1)]" : "bg-azure-500 shadow-[0_0_10px_rgba(45,212,191,1)]"}`} />
                    NIVEL_ACCESO: <span className="text-white ml-2">{session?.user?.role || "COLABORADOR"}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">

                {/* Left Panel */}
                <div className="lg:col-span-1 space-y-10">
                    {isAdmin && (
                        /* Admin: Pending Requests */
                        <div className="glass-panel border-white/5 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col rounded-[3.5rem] backdrop-blur-3xl">
                            <div className="p-12 border-b border-white/5 bg-white/[0.01]">
                                <h2 className="text-xl font-black text-white uppercase tracking-tighter italic flex items-center gap-6">
                                    <ShieldAlert size={28} className="text-secondary drop-shadow-[0_0_10px_rgba(255,99,71,0.5)]" /> Auditoría Pendiente
                                </h2>
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] mt-3 italic">Validación de Nodos en Espera</p>
                            </div>
                            <div className="p-8 space-y-6 max-h-[600px] overflow-y-auto custom-scrollbar">
                                {loadingPending ? (
                                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-secondary" size={32} /></div>
                                ) : pendingRequests.length === 0 ? (
                                    <div className="text-center py-20 space-y-4">
                                        <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto border border-white/5 shadow-inner">
                                            <FileSignature size={24} className="text-slate-800" />
                                        </div>
                                        <p className="text-[10px] text-slate-700 font-black uppercase tracking-[0.4em] italic">Sin solicitudes registradas.</p>
                                    </div>
                                ) : (
                                    pendingRequests.map(cycle => (
                                        <div key={cycle.id} className="glass-panel !bg-slate-900/40 p-8 rounded-[2.5rem] border-white/5 space-y-6 group hover:!bg-white/[0.04] transition-all relative overflow-hidden">
                                            <div className="absolute left-0 top-0 w-1.5 h-full bg-secondary opacity-20 group-hover:opacity-100 transition-opacity" />
                                            <div className="flex items-center gap-6">
                                                <div className="w-14 h-14 bg-slate-950 rounded-2xl border border-white/5 flex items-center justify-center text-white font-black text-xl italic shadow-inner group-hover:scale-105 transition-transform">
                                                    {cycle.user?.name?.[0] || "U"}
                                                </div>
                                                <div>
                                                    <p className="text-base font-black text-white uppercase tracking-tighter italic">{cycle.user?.name}</p>
                                                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] mt-1">{new Date(cycle.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            
                                            <a 
                                                href={cycle.contractUrl} 
                                                target="_blank" 
                                                rel="noreferrer"
                                                className="flex items-center gap-4 text-[10px] text-secondary font-black hover:text-white uppercase tracking-[0.3em] bg-secondary/5 px-6 py-3 rounded-xl border border-secondary/20 transition-all italic group/link"
                                            >
                                                <FileText size={16} className="group-hover/link:rotate-12 transition-transform" />
                                                Visualizar Activo Legal
                                            </a>

                                            <div className="grid grid-cols-2 gap-6 pt-4">
                                                <div className="space-y-3">
                                                    <label className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] ml-2 italic">Sueldo Fijo ($)</label>
                                                    <input 
                                                        type="number" 
                                                        className="w-full bg-slate-950 border border-white/5 px-4 py-3 text-xs font-black text-white rounded-xl focus:border-secondary outline-none transition-all shadow-inner"
                                                        value={approveForm.fixedPay}
                                                        onChange={(e) => setApproveForm(prev => ({ ...prev, fixedPay: e.target.value }))}
                                                    />
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] ml-2 italic">Comisión (%)</label>
                                                    <input 
                                                        type="number" 
                                                        className="w-full bg-slate-950 border border-white/5 px-4 py-3 text-xs font-black text-white rounded-xl focus:border-secondary outline-none transition-all shadow-inner"
                                                        value={approveForm.commissionPct}
                                                        onChange={(e) => setApproveForm(prev => ({ ...prev, commissionPct: e.target.value }))}
                                                    />
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => handleApproveAdmin(cycle.id)}
                                                className="w-full bg-secondary hover:bg-white hover:text-secondary text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] transition-all shadow-[0_15px_30px_rgba(255,99,71,0.4)] italic skew-x-[-8deg] group"
                                            >
                                                <div className="skew-x-[8deg] flex items-center justify-center gap-3">
                                                    <Zap size={16} className="group-hover:scale-125 transition-transform" />
                                                    Activar Ciclo 30D
                                                </div>
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {!isAdmin && (
                        /* Colaborador Section */
                        <div className="glass-panel border-white/5 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] p-12 flex flex-col rounded-[3.5rem] backdrop-blur-3xl relative overflow-hidden">
                             <div className="absolute top-0 right-0 p-8 opacity-5 text-white pointer-events-none">
                                <FileSignature size={120} />
                            </div>
                            {!myCycle ? (
                                /* No cycle at all -> Upload */
                                <div className="relative z-10">
                                    <div className="w-24 h-24 bg-white/5 text-secondary rounded-3xl flex items-center justify-center mx-auto mb-10 border border-white/5 shadow-[0_0_50px_rgba(255,99,71,0.15)] group hover:scale-105 transition-transform duration-700">
                                        <FileSignature size={48} className="group-hover:rotate-12 transition-transform" />
                                    </div>
                                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4 text-center italic">MI <span className="text-secondary">CONTRATO</span></h2>
                                    <p className="text-[11px] text-slate-500 mb-10 font-black uppercase tracking-[0.4em] text-center italic leading-relaxed">
                                        Sincroniza tu vinculación legal firmada (PDF) para iniciar el protocolo de auditoría Atomic.
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
                                            className="w-full border-2 border-dashed border-white/10 hover:border-secondary/40 bg-slate-900/60 text-slate-500 font-black py-16 rounded-[2rem] flex flex-col items-center justify-center transition-all gap-6 text-[10px] uppercase tracking-[0.5em] italic group shadow-inner"
                                        >
                                            <Upload size={32} className="group-hover:translate-y-[-4px] transition-transform text-secondary/40" />
                                            <span>IDENTIFICAR PDF_LOCAL</span>
                                        </button>
                                    ) : (
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-6 bg-slate-900/80 border border-white/5 px-8 py-6 rounded-2xl shadow-inner relative group">
                                                <div className="absolute left-0 top-0 h-full w-1.5 bg-secondary rounded-l-2xl" />
                                                <FileText size={24} className="text-secondary shrink-0" />
                                                <span className="text-xs font-black text-white truncate flex-1 uppercase italic tracking-tighter">{uploadedFile.name}</span>
                                                <button onClick={handleResetUpload} className="p-3 text-slate-700 hover:text-red-500 transition-all bg-slate-950 rounded-xl border border-white/5 shadow-2xl">
                                                    <X size={18} />
                                                </button>
                                            </div>
                                            <button
                                                onClick={handleUpload}
                                                disabled={isUploading}
                                                className="w-full bg-secondary hover:bg-white hover:text-secondary disabled:opacity-20 text-white font-black py-6 rounded-[2rem] flex items-center justify-center transition-all shadow-[0_25px_60px_-10px_rgba(255,99,71,0.6)] active:scale-95 text-[11px] uppercase tracking-[0.4em] gap-6 italic skew-x-[-12deg] group"
                                            >
                                                <div className="skew-x-[12deg] flex items-center gap-4">
                                                    {isUploading ? (
                                                        <><Loader2 size={24} className="animate-spin" /> PROCESANDO...</>
                                                    ) : (
                                                        <><Upload size={24} className="group-hover:translate-y-[-2px] transition-transform" /> INYECTAR NODO</>
                                                    )}
                                                </div>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : myCycle.isActive === false ? (
                                /* Cycle exists but not approved */
                                <div className="text-center py-12 relative z-10">
                                    <div className="w-24 h-24 bg-slate-900 text-slate-700 rounded-3xl flex items-center justify-center mx-auto mb-10 border border-white/5 shadow-inner">
                                        <Timer size={48} className="animate-pulse" />
                                    </div>
                                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-4 italic">AUDITORÍA <span className="text-secondary">ESTACIONARIA</span></h2>
                                    <p className="text-[11px] text-slate-500 font-black mb-10 italic leading-relaxed uppercase tracking-[0.4em]">
                                        Contrato recibido exitosamente. Protocolo en espera de configuración central para iniciar ciclo 30D.
                                    </p>
                                    <div className="inline-flex items-center gap-4 px-8 py-3 bg-secondary/5 text-[9px] font-black text-secondary uppercase tracking-[0.5em] border border-secondary/20 rounded-full italic shadow-2xl">
                                        ESTADO: ESPERANDO SINCRONIZACIÓN
                                    </div>
                                </div>
                            ) : (
                                /* Active cycle info */
                                <div className="space-y-10 relative z-10">
                                    <div className="text-center">
                                        <div className="w-24 h-24 bg-emerald-500/10 text-emerald-400 rounded-3xl flex items-center justify-center mx-auto mb-10 border border-emerald-500/20 shadow-[0_0_50px_rgba(52,211,153,0.2)]">
                                            <CheckCircle2 size={48} />
                                        </div>
                                        <h2 className="text-3xl font-black text-emerald-400 uppercase tracking-tighter mb-2 italic">CICLO <span className="text-white">ACTIVO</span></h2>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] mb-10 italic">
                                            DESPLIEGUE: {new Date(myCycle.startDate).toLocaleDateString("es-EC", { day: "2-digit", month: "long", year: "numeric" }).toUpperCase()}
                                        </p>
                                    </div>

                                    {/* Economic Terms for User */}
                                    <div className="grid grid-cols-2 gap-8 border-t border-white/5 pt-12">
                                        <div className="glass-panel !bg-slate-950/60 p-8 border border-white/5 rounded-3xl shadow-inner relative overflow-hidden group">
                                            <div className="absolute right-0 top-0 p-4 opacity-5 text-secondary group-hover:scale-125 transition-transform"><DollarSign size={40} /></div>
                                            <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] mb-4 italic flex items-center gap-3">
                                                <TrendingUp size={12} className="text-secondary" /> SUELDO_FIJO
                                            </p>
                                            <p className="text-4xl font-black text-white italic tracking-tighter group-hover:translate-x-2 transition-transform">${myCycle.fixedPay || 0}</p>
                                        </div>
                                        <div className="glass-panel !bg-slate-950/60 p-8 border border-white/5 rounded-3xl shadow-inner relative overflow-hidden group">
                                            <div className="absolute right-0 top-0 p-4 opacity-5 text-azure-400 group-hover:scale-125 transition-transform"><Percent size={40} /></div>
                                            <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] mb-4 italic flex items-center gap-3">
                                                <Zap size={12} className="text-azure-400" /> VARIABLE_COM
                                            </p>
                                            <p className="text-4xl font-black text-white italic tracking-tighter group-hover:translate-x-2 transition-transform">{myCycle.commissionPct || 0}%</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Cycle Status Card (Colaborador only when cycle is active) */}
                    <AnimatePresence>
                        {!isAdmin && cycleInfo && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="glass-panel !bg-slate-950/60 border-white/5 rounded-[3.5rem] p-12 text-white shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] border relative overflow-hidden backdrop-blur-3xl"
                            >
                                <div className="absolute top-0 right-0 p-10 opacity-5 text-secondary pointer-events-none rotate-12">
                                    <Timer size={150} />
                                </div>
                                <div className="flex items-center space-x-6 text-secondary mb-10 relative z-10">
                                    <div className="p-4 glass-panel !bg-secondary/10 border-secondary/20 rounded-2xl shadow-2xl">
                                        <Timer size={24} className="drop-shadow-[0_0_10px_rgba(255,99,71,0.5)]" />
                                    </div>
                                    <span className="text-[11px] font-black uppercase tracking-[0.6em] italic">Progreso de Despliegue</span>
                                </div>
                                <div className="relative z-10">
                                    <h3 className="text-6xl font-black mb-4 tracking-tighter italic flex items-end gap-4">
                                        DÍA {cycleInfo.currentDay} <span className="text-xl text-slate-700 tracking-widest font-black uppercase mb-3">/ 30D</span>
                                    </h3>
                                    <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden mt-10 border border-white/5 shadow-inner p-[1.5px]">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${cycleInfo.progress}%` }}
                                            transition={{ duration: 2, ease: "easeOut" }}
                                            className="bg-gradient-to-r from-secondary/40 to-secondary h-full rounded-full shadow-[0_0_20px_rgba(255,99,71,0.5)]"
                                        />
                                    </div>
                                    <p className="text-[10px] text-slate-500 mt-8 uppercase font-black tracking-[0.6em] italic leading-relaxed">
                                        {cycleInfo.daysRemaining === 0
                                            ? "Felicidades: Protocolo 30D completado al 100%."
                                            : `Quedan ${cycleInfo.daysRemaining} jornadas para completar el ciclo operativo.`}
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Right Panel: 30-Day Timeline */}
                <div className="lg:col-span-2 space-y-10">
                    <div className="glass-panel border-white/5 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] p-12 rounded-[4rem] backdrop-blur-3xl">
                        <div className="flex flex-wrap justify-between items-center mb-16 border-b border-white/5 pb-10 gap-8">
                            <div className="flex items-center space-x-6">
                                <div className="p-5 bg-azure-500/10 border border-azure-500/20 text-azure-400 rounded-2xl shadow-2xl">
                                    <CalendarIcon size={32} className="drop-shadow-[0_0_10px_rgba(45,212,191,0.5)]" />
                                </div>
                                <div>
                                    <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">PROGRAMA DE <span className="text-azure-400">DESARROLLO</span></h2>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] mt-3 italic">Cronograma Maestro 30 Jornadas</p>
                                </div>
                            </div>
                            <span className="text-[11px] font-black text-azure-400 bg-azure-500/10 px-8 py-3 rounded-full border border-azure-500/20 uppercase tracking-[0.4em] italic shadow-2xl">
                                {myCycle?.isActive 
                                    ? `VENCIMIENTO: ${new Date(myCycle.endDate).toLocaleDateString("es-EC").toUpperCase()}`
                                    : "PROTOCOLO EN ESPERA"}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {WEEK_DEFINITIONS.map((week) => {
                                const status = cycleInfo
                                    ? getWeekStatus(week.start, week.end, cycleInfo.currentDay)
                                    : "upcoming"

                                return (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        key={week.id}
                                        className={`p-10 rounded-[3rem] border-2 transition-all flex flex-col justify-between group relative overflow-hidden shadow-2xl ${status === "completed"
                                            ? "border-emerald-500/20 bg-emerald-500/5 backdrop-blur-3xl"
                                            : status === "pending"
                                                ? "border-secondary/40 bg-secondary/5 shadow-[0_0_50px_rgba(255,99,71,0.1)] scale-[1.03] border-dashed"
                                                : "border-white/5 bg-slate-900/40 opacity-40 grayscale"
                                            }`}
                                    >
                                        <div className="absolute top-0 right-0 p-8 opacity-5 text-white pointer-events-none group-hover:scale-110 transition-transform">
                                            {status === "completed" ? <CheckCircle2 size={120} /> : <CalendarIcon size={120} />}
                                        </div>

                                        <div className="flex items-start justify-between mb-10 relative z-10">
                                            <div>
                                                <span className={`text-[9px] font-black uppercase tracking-[0.4em] px-5 py-2 rounded-xl italic border shadow-2xl mb-6 inline-block ${status === "completed" ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/10" : "text-secondary bg-secondary/10 border-secondary/20 shadow-secondary/10"}`}>
                                                    {week.type.toUpperCase()}
                                                </span>
                                                <h4 className="text-3xl font-black text-white italic tracking-tighter uppercase group-hover:text-secondary transition-colors">SEMANA {week.id}</h4>
                                                <p className="text-[11px] font-black text-slate-600 uppercase tracking-[0.3em] mt-3 italic">{week.label}</p>
                                            </div>
                                            {status === "completed" ? (
                                                <div className="w-16 h-16 bg-emerald-500 text-slate-950 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(52,211,153,0.5)] group-hover:rotate-12 transition-transform">
                                                    <CheckCircle2 size={32} />
                                                </div>
                                            ) : (
                                                <div className="w-16 h-16 bg-slate-900 border border-white/5 rounded-2xl flex items-center justify-center text-slate-700 shadow-inner group-hover:bg-secondary group-hover:text-white transition-all group-hover:shadow-[0_15px_30px_rgba(255,99,71,0.3)]">
                                                    <Briefcase size={28} />
                                                </div>
                                            )}
                                        </div>

                                        <div className="pt-10 border-t border-white/5 flex items-center justify-between relative z-10">
                                            <span className="text-[9px] font-black text-slate-700 uppercase tracking-[0.6em] italic group-hover:text-white transition-colors">
                                                {status === "completed" ? "PROTOCOLO_FINALIZADO" : status === "pending" ? "FASE_EN_EJECUCIÓN" : "OBJETIVO_BLOQUEADO"}
                                            </span>
                                            {status === "pending" && (
                                                <button className="text-secondary hover:text-white font-black text-[10px] uppercase tracking-[0.4em] flex items-center gap-3 transition-all hover:translate-x-3 italic">
                                                    VER_DETALLE <ArrowUpRight size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </div>
                        
                        {/* Legend for Admin */}
                        {isAdmin && (
                            <div className="mt-16 bg-slate-950/60 p-8 rounded-[2.5rem] border border-white/5 flex items-center gap-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] italic">COMPLETADO</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-3 h-3 rounded-full bg-secondary shadow-[0_0_10px_rgba(255,99,71,0.5)] animate-pulse" />
                                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] italic">EN_PROGRESO</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-3 h-3 rounded-full bg-slate-800" />
                                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] italic">POR_ACTIVAR</span>
                                </div>
                                <div className="ms-auto flex items-center gap-3 text-slate-800 italic uppercase font-black text-[8px] tracking-[0.4em]">
                                    <ShieldCheck size={14} /> AUDITORÍA_SISTEMA: OK
                                </div>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    )
}
