"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    ClipboardCheck, TrendingUp, Clock, Users, Building2, DollarSign,
    BarChart3, Send, ChevronDown, ChevronUp, X, Plus, Check, Loader2,
    Wallet, CreditCard, AlertTriangle, Receipt, Megaphone, FileText,
    UserCheck, Star, Calendar, Target, Phone, MapPin, Briefcase, Upload,
    Activity, Zap, Award, Timer
} from "lucide-react"
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    ReferenceLine, Area, AreaChart
} from "recharts"

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
interface AttendanceRecord {
    id: string
    date: string
    time: string
    score: number
    status: string
    note: string
}

interface WorkCycle {
    id: string
    employeeEmail: string
    employeeName: string
    role: string
    cycleDays: number
    cycleStart: string
    cycleEnd: string
    daysRemaining: number
    bankAccount: string
    monetaryBenefit: string
    contractType: string
    modality: string
    workHours: string
    isFreelancer: boolean
    freelanceAgreement: string
    freelancePercentage: number
    contractUrl: string
    hasNoContract: boolean
}

interface DirectedTask {
    id: string
    title: string
    description: string
    targetArea: string
    duration: string
    deadline: string
    requiredFormat: string
    taskType: string
    status: string
    createdAt: string
    delivery: any
    feedback: any
}

interface DelegatedClient {
    id: string
    clientName: string
    phone: string
    assignedTo: string
    assignedName: string
    objective: string
    requirementText: string
    status: string
    createdAt: string
}

// ─────────────────────────────────────────────────────────────────────────────
// SCORE BADGE
// ─────────────────────────────────────────────────────────────────────────────
function ScoreBadge({ score }: { score: number }) {
    const color = score >= 9.5 ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
        : score >= 8 ? "text-blue-400 bg-blue-500/10 border-blue-500/30"
            : score >= 6 ? "text-amber-400 bg-amber-500/10 border-amber-500/30"
                : "text-rose-400 bg-rose-500/10 border-rose-500/30"
    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl border text-xs font-black font-mono ${color}`}>
            <Star size={10} className="fill-current" />
            {score.toFixed(1)}/10
        </span>
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// WORK CYCLE TIMER
// ─────────────────────────────────────────────────────────────────────────────
function WorkCycleTimer({ cycle }: { cycle: WorkCycle }) {
    const progressPct = Math.max(0, Math.min(100, ((cycle.cycleDays - cycle.daysRemaining) / cycle.cycleDays) * 100))
    const isLow = cycle.daysRemaining <= 5
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative p-4 bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden group hover:border-emerald-500/30 transition-all"
        >
            {/* Animated green glow pulse */}
            <div className={`absolute top-3 right-3 w-3 h-3 rounded-full ${isLow ? 'bg-amber-400' : 'bg-emerald-400'} shadow-[0_0_12px_rgba(16,185,129,0.8)] animate-pulse`} />
            <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-black text-sm shrink-0">
                    {cycle.employeeName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-white truncate">{cycle.employeeName}</p>
                    <p className="text-[10px] font-mono text-emerald-400">{cycle.role}</p>
                    <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                            cycle.modality === 'REMOTO' ? 'text-blue-400 bg-blue-500/10 border-blue-500/30'
                            : cycle.modality === 'HIBRIDO' ? 'text-purple-400 bg-purple-500/10 border-purple-500/30'
                            : 'text-slate-400 bg-slate-700/50 border-slate-700'
                        }`}>{cycle.modality}</span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                            cycle.contractType === 'INDEFINIDO' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                            : 'text-amber-400 bg-amber-500/10 border-amber-500/30'
                        }`}>{cycle.contractType}</span>
                    </div>
                </div>
            </div>
            {/* Cycle progress bar */}
            <div className="mb-2">
                <div className="flex justify-between text-[9px] font-mono text-slate-400 mb-1">
                    <span>Ciclo {cycle.cycleDays} días</span>
                    <span className={isLow ? 'text-amber-400 font-bold' : ''}>{cycle.daysRemaining}d restantes</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPct}%` }}
                        transition={{ duration: 1.2, delay: 0.3 }}
                        className={`h-full rounded-full ${isLow ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-gradient-to-r from-emerald-500 to-teal-400'}`}
                    />
                </div>
            </div>
            <div className="text-[10px] font-mono text-slate-500">
                <span className="text-slate-300">{cycle.monetaryBenefit}</span>
            </div>
            {cycle.isFreelancer && (
                <div className="mt-2 px-2 py-1 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                    <p className="text-[9px] font-mono text-purple-400 font-bold">🤝 FREELANCER • {cycle.freelancePercentage}%</p>
                </div>
            )}
        </motion.div>
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function SupervisionClient({ session }: { session: any }) {
    // ── DATA STATE ──────────────────────────────────────────────────────────
    const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
    const [workCycles, setWorkCycles] = useState<WorkCycle[]>([])
    const [tasks, setTasks] = useState<DirectedTask[]>([])
    const [delegated, setDelegated] = useState<DelegatedClient[]>([])
    const [checks, setChecks] = useState<any>({})
    const [systemUsers, setSystemUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isRegisteringAttendance, setIsRegisteringAttendance] = useState(false)
    const [todayAttendance, setTodayAttendance] = useState<AttendanceRecord | null>(null)

    // ── MODAL STATE ──────────────────────────────────────────────────────────
    const [activeTab, setActiveTab] = useState<"asistencia"|"auditoria"|"ciclos"|"tareas"|"crm">("asistencia")
    const [checkModal, setCheckModal] = useState<"personal"|"empresa"|"marketing"|null>(null)
    const [addCycleOpen, setAddCycleOpen] = useState(false)
    const [sendTaskOpen, setSendTaskOpen] = useState(false)
    const [delegateOpen, setDelegateOpen] = useState(false)
    const [taskAuditView, setTaskAuditView] = useState(false)

    // ── FORM STATE - FINANZAS ────────────────────────────────────────────────
    const [pfIncome, setPfIncome] = useState("")
    const [pfExpenses, setPfExpenses] = useState("")
    const [cfIncome, setCfIncome] = useState("")
    const [cfExpenses, setCfExpenses] = useState("")
    const [newDebtCreditor, setNewDebtCreditor] = useState("")
    const [newDebtAmount, setNewDebtAmount] = useState("")
    const [newDebtDue, setNewDebtDue] = useState("")
    const [newInvClient, setNewInvClient] = useState("")
    const [newInvAmount, setNewInvAmount] = useState("")
    const [mktIncome, setMktIncome] = useState("")
    const [mktExpenses, setMktExpenses] = useState("")
    const [mktDebt, setMktDebt] = useState("")
    const [mktAdAccountId, setMktAdAccountId] = useState("")
    const [mktPlatform, setMktPlatform] = useState("Meta Ads Manager")
    const [isSavingCheck, setIsSavingCheck] = useState(false)

    // ── FORM STATE - CICLOS ──────────────────────────────────────────────────
    const [cycleEmployee, setCycleEmployee] = useState("")
    const [cycleDays, setCycleDays] = useState("30")
    const [cycleBank, setCycleBank] = useState("")
    const [cycleBenefit, setCycleBenefit] = useState("")
    const [cycleContract, setCycleContract] = useState("INDEFINIDO")
    const [cycleModality, setCycleModality] = useState("PRESENCIAL")
    const [cycleHours, setCycleHours] = useState("40 Horas Semanales")
    const [cycleIsFreelancer, setCycleIsFreelancer] = useState(false)
    const [cycleAgreement, setCycleAgreement] = useState("")
    const [cyclePercent, setCyclePercent] = useState("")
    const [cycleNoContract, setCycleNoContract] = useState(false)

    // ── FORM STATE - TAREA ───────────────────────────────────────────────────
    const [taskTitle, setTaskTitle] = useState("")
    const [taskDesc, setTaskDesc] = useState("")
    const [taskArea, setTaskArea] = useState("Ventas")
    const [taskDuration, setTaskDuration] = useState("24 horas")
    const [taskFormat, setTaskFormat] = useState("VIDEO")
    const [taskType, setTaskType] = useState("URGENTE")

    // ── FORM STATE - DELEGACION ──────────────────────────────────────────────
    const [delClientName, setDelClientName] = useState("")
    const [delPhone, setDelPhone] = useState("")
    const [delAssignTo, setDelAssignTo] = useState("")
    const [delObjective, setDelObjective] = useState("Cerrar Venta")
    const [delRequirement, setDelRequirement] = useState("")
    const [isSending, setIsSending] = useState(false)

    // ─────────────────────────────────────────────────────────────────────────
    // LOAD DATA
    // ─────────────────────────────────────────────────────────────────────────
    useEffect(() => {
        const loadData = async () => {
            try {
                const [supRes, taskRes, usersRes] = await Promise.all([
                    fetch("/api/supervision"),
                    fetch("/api/supervision/tasks"),
                    fetch("/api/admin/manage-users")
                ])
                if (supRes.ok) {
                    const supData = await supRes.json()
                    if (supData.data) {
                        setAttendance(supData.data.supervisorAttendance || [])
                        setWorkCycles(supData.data.workCycles || [])
                        setDelegated(supData.data.delegatedClients || [])
                        setChecks(supData.data.checks || {})
                        // Check today's attendance
                        const today = new Date().toISOString().split("T")[0]
                        const todayRec = (supData.data.supervisorAttendance || []).find((a: AttendanceRecord) => a.date === today)
                        setTodayAttendance(todayRec || null)
                    }
                }
                if (taskRes.ok) {
                    const taskData = await taskRes.json()
                    setTasks(taskData.tasks || [])
                }
                if (usersRes.ok) {
                    const usersData = await usersRes.json()
                    setSystemUsers(usersData.users || [])
                }
            } catch (e) { console.error(e) } finally { setLoading(false) }
        }
        loadData()
    }, [])

    // ─────────────────────────────────────────────────────────────────────────
    // REGISTER ATTENDANCE
    // ─────────────────────────────────────────────────────────────────────────
    const handleRegisterAttendance = async () => {
        setIsRegisteringAttendance(true)
        try {
            const res = await fetch("/api/supervision", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "REGISTER_SUPERVISOR_ATTENDANCE", payload: {} })
            })
            const data = await res.json()
            if (data.success) {
                setTodayAttendance(data.record)
                setAttendance(prev => {
                    const filtered = prev.filter(a => a.date !== data.record.date)
                    return [...filtered, data.record].sort((a, b) => a.date.localeCompare(b.date))
                })
            }
        } catch (e) { console.error(e) } finally { setIsRegisteringAttendance(false) }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // SAVE FINANCIAL CHECKS
    // ─────────────────────────────────────────────────────────────────────────
    const handleSaveCheck = async (type: "personal"|"empresa"|"marketing") => {
        setIsSavingCheck(true)
        let action = ""
        let payload: any = {}
        if (type === "personal") {
            action = "SAVE_PERSONAL_FINANCE"
            payload = { income: parseFloat(pfIncome) || 0, expenses: parseFloat(pfExpenses) || 0 }
        } else if (type === "empresa") {
            action = "SAVE_COMPANY_FINANCE"
            payload = { income: parseFloat(cfIncome) || 0, expenses: parseFloat(cfExpenses) || 0 }
        } else {
            action = "SAVE_MARKETING_CHECK"
            payload = { income: parseFloat(mktIncome) || 0, expenses: parseFloat(mktExpenses) || 0, debt: parseFloat(mktDebt) || 0, adAccountId: mktAdAccountId, platform: mktPlatform }
        }
        try {
            const res = await fetch("/api/supervision", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, payload }) })
            const data = await res.json()
            if (data.success) setCheckModal(null)
        } catch (e) { console.error(e) } finally { setIsSavingCheck(false) }
    }

    const handleAddDebt = async () => {
        if (!newDebtCreditor || !newDebtAmount) return
        try {
            const res = await fetch("/api/supervision", { method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "ADD_DEBT_TO_PAY", payload: { creditor: newDebtCreditor, amount: newDebtAmount, dueDate: newDebtDue } })
            })
            const data = await res.json()
            if (data.success) {
                setChecks((prev: any) => ({ ...prev, debtsToPay: [...(prev.debtsToPay || []), data.debt] }))
                setNewDebtCreditor(""); setNewDebtAmount(""); setNewDebtDue("")
            }
        } catch (e) { console.error(e) }
    }

    const handleAddInvoice = async () => {
        if (!newInvClient || !newInvAmount) return
        try {
            const res = await fetch("/api/supervision", { method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "ADD_INVOICE_TO_COLLECT", payload: { client: newInvClient, amount: newInvAmount, issueDate: new Date().toISOString().split("T")[0] } })
            })
            const data = await res.json()
            if (data.success) {
                setChecks((prev: any) => ({ ...prev, invoicesToCollect: [...(prev.invoicesToCollect || []), data.invoice] }))
                setNewInvClient(""); setNewInvAmount("")
            }
        } catch (e) { console.error(e) }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // SEND DIRECTED TASK
    // ─────────────────────────────────────────────────────────────────────────
    const handleSendTask = async () => {
        if (!taskTitle.trim() || isSending) return
        setIsSending(true)
        try {
            const targetUser = systemUsers.find((u: any) => u.email?.includes(taskArea.toLowerCase()) || u.role === taskArea)
            const deadline = new Date()
            const durationMap: Record<string, number> = { "Urgente": 0.25, "30 minutos": 0.5, "1 hora": 1, "1.5 horas": 1.5, "12 horas": 12, "24 horas": 24, "1 día": 24, "1-2 días": 48, "1-5 días": 120, "Abierto": 720 }
            deadline.setHours(deadline.getHours() + (durationMap[taskDuration] || 24))

            const res = await fetch("/api/supervision/tasks", { method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "CREATE_DIRECTED_TASK", payload: {
                    title: taskTitle, description: taskDesc, targetArea: taskArea,
                    targetEmail: targetUser?.email || taskArea.toLowerCase() + "@atomic.com.ec",
                    targetName: targetUser?.name || taskArea,
                    duration: taskDuration, deadline: deadline.toISOString(),
                    requiredFormat: taskFormat, taskType
                }})
            })
            const data = await res.json()
            if (data.success) {
                setTasks(prev => [data.task, ...prev])
                setSendTaskOpen(false)
                setTaskTitle(""); setTaskDesc("")
            }
        } catch (e) { console.error(e) } finally { setIsSending(false) }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // ADD WORK CYCLE
    // ─────────────────────────────────────────────────────────────────────────
    const handleAddCycle = async () => {
        if (!cycleEmployee || isSending) return
        setIsSending(true)
        const selectedUser = systemUsers.find(u => u.email === cycleEmployee || u.id === cycleEmployee)
        const cycleStart = new Date().toISOString().split("T")[0]
        const cycleEnd = new Date(Date.now() + parseInt(cycleDays) * 86400000).toISOString().split("T")[0]
        try {
            const res = await fetch("/api/supervision", { method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "ADD_WORK_CYCLE", payload: {
                    employeeEmail: selectedUser?.email || cycleEmployee,
                    employeeName: selectedUser?.name || selectedUser?.email || cycleEmployee,
                    role: selectedUser?.role || "Colaborador",
                    cycleDays: parseInt(cycleDays), cycleStart, cycleEnd,
                    bankAccount: cycleBank, monetaryBenefit: cycleBenefit,
                    contractType: cycleContract, modality: cycleModality,
                    workHours: cycleHours, isFreelancer: cycleIsFreelancer,
                    freelanceAgreement: cycleAgreement, freelancePercentage: parseInt(cyclePercent) || 0,
                    hasNoContract: cycleNoContract
                }})
            })
            const data = await res.json()
            if (data.success) {
                setWorkCycles(prev => [...prev, data.cycle])
                setAddCycleOpen(false)
            }
        } catch (e) { console.error(e) } finally { setIsSending(false) }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // DELEGATE CLIENT
    // ─────────────────────────────────────────────────────────────────────────
    const handleDelegateClient = async () => {
        if (!delClientName || !delAssignTo || isSending) return
        setIsSending(true)
        const targetUser = systemUsers.find(u => u.id === delAssignTo || u.email === delAssignTo)
        try {
            const res = await fetch("/api/supervision", { method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "DELEGATE_CLIENT", payload: {
                    clientName: delClientName, phone: delPhone,
                    assignedTo: targetUser?.email || delAssignTo,
                    assignedName: targetUser?.name || delAssignTo,
                    objective: delObjective, requirementText: delRequirement
                }})
            })
            const data = await res.json()
            if (data.success) {
                setDelegated(prev => [data.client, ...prev])
                setDelegateOpen(false)
                setDelClientName(""); setDelPhone(""); setDelRequirement("")
            }
        } catch (e) { console.error(e) } finally { setIsSending(false) }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // CARTESIAN CHART DATA
    // ─────────────────────────────────────────────────────────────────────────
    const chartData = attendance.map(a => ({
        date: a.date.slice(5), // MM-DD
        score: a.score,
        time: a.time,
        status: a.status
    })).sort((a, b) => a.date.localeCompare(b.date))

    const avgScore = attendance.length > 0
        ? (attendance.reduce((s, a) => s + a.score, 0) / attendance.length).toFixed(1)
        : "—"

    // ─────────────────────────────────────────────────────────────────────────
    // TASK APPROVE/REJECT
    // ─────────────────────────────────────────────────────────────────────────
    const handleTaskAction = async (taskId: string, action: "APPROVE_TASK"|"REJECT_TASK", comment?: string) => {
        try {
            const res = await fetch("/api/supervision/tasks", { method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action, payload: { taskId, comment } })
            })
            const data = await res.json()
            if (data.success) {
                setTasks(prev => prev.map(t => t.id === taskId ? data.task : t))
            }
        } catch (e) { console.error(e) }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-2 border-emerald-500 rounded-full animate-spin border-t-transparent" />
                    <p className="text-emerald-400 font-mono text-sm animate-pulse">Cargando Sistema de Supervisión...</p>
                </div>
            </div>
        )
    }

    // ─────────────────────────────────────────────────────────────────────────
    // RENDER
    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-[#050505] text-white p-4 md:p-8 space-y-8">
            {/* Ambient effects */}
            <div className="fixed top-0 right-0 w-96 h-96 bg-emerald-600/5 rounded-full blur-[140px] pointer-events-none" />
            <div className="fixed bottom-0 left-0 w-96 h-96 bg-indigo-600/5 rounded-full blur-[140px] pointer-events-none" />

            {/* ── HEADER ──────────────────────────────────────────────── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 font-mono text-[10px] font-bold uppercase tracking-widest mb-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        SISTEMA DE SUPERVISIÓN OPERATIVA
                    </div>
                    <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white">
                        Centro de <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Supervisión</span>
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">Panel exclusivo de control, auditoría y gestión del equipo</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <p className="text-[10px] font-mono text-slate-400">Promedio General</p>
                        <p className="text-2xl font-black text-emerald-400">{avgScore}<span className="text-sm text-slate-500">/10</span></p>
                    </div>
                    <div className="w-px h-12 bg-slate-800" />
                    <div className="text-right">
                        <p className="text-[10px] font-mono text-slate-400">Registros</p>
                        <p className="text-2xl font-black text-blue-400">{attendance.length}</p>
                    </div>
                </div>
            </div>

            {/* ── TABS ────────────────────────────────────────────────── */}
            <div className="flex items-center gap-1 bg-slate-900/80 border border-slate-800 rounded-2xl p-1 overflow-x-auto">
                {(["asistencia", "auditoria", "ciclos", "tareas", "crm"] as const).map(tab => {
                    const labels: Record<string, string> = {
                        asistencia: "📊 Asistencia & Plano",
                        auditoria: "🗂️ Auditoría Diaria",
                        ciclos: "⏱️ Ciclos Laborales",
                        tareas: "📋 Pendientes Dirigidos",
                        crm: "👥 Clientes & CRM"
                    }
                    return (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all shrink-0 ${
                                activeTab === tab
                                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                            }`}
                        >
                            {labels[tab]}
                        </button>
                    )
                })}
            </div>

            {/* ── TAB: ASISTENCIA ────────────────────────────────────── */}
            <AnimatePresence mode="wait">
                {activeTab === "asistencia" && (
                    <motion.div key="asistencia" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                        {/* Registro de Ingreso */}
                        <div className="flex flex-col md:flex-row gap-6">
                            <motion.div
                                whileHover={{ scale: 1.01 }}
                                className={`flex-1 p-6 rounded-3xl border relative overflow-hidden ${
                                    todayAttendance
                                        ? "bg-gradient-to-br from-emerald-950/50 to-teal-950/30 border-emerald-500/40"
                                        : "bg-slate-900/80 border-slate-700"
                                }`}
                            >
                                {todayAttendance && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent pointer-events-none" />
                                )}
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Registro de Hoy</p>
                                        <p className="text-xs font-mono text-slate-500">{new Date().toLocaleDateString('es-EC', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    </div>
                                    {todayAttendance && <ScoreBadge score={todayAttendance.score} />}
                                </div>
                                {todayAttendance ? (
                                    <div className="space-y-2">
                                        <p className="text-3xl font-black text-emerald-400">{todayAttendance.time}</p>
                                        <p className="text-xs font-bold text-slate-300">{todayAttendance.note}</p>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                            <span className="text-[10px] font-mono text-emerald-400">Ingreso registrado exitosamente</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <p className="text-sm text-slate-400">Aún no has registrado tu ingreso hoy</p>
                                        <p className="text-[10px] font-mono text-slate-500">Horario base: <span className="text-emerald-400 font-bold">6:00 AM</span> → Calificación máxima 10/10</p>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handleRegisterAttendance}
                                            disabled={isRegisteringAttendance}
                                            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black rounded-2xl text-sm uppercase tracking-wider shadow-[0_0_30px_rgba(16,185,129,0.4)] disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            {isRegisteringAttendance ? <Loader2 size={18} className="animate-spin" /> : <ClipboardCheck size={18} />}
                                            {isRegisteringAttendance ? "Registrando..." : "REGISTRAR INGRESO AHORA"}
                                        </motion.button>
                                    </div>
                                )}
                            </motion.div>

                            {/* Stats cards */}
                            <div className="grid grid-cols-2 gap-4 md:w-64">
                                {[
                                    { label: "Días Puntual", value: attendance.filter(a => a.score >= 10).length, color: "emerald", icon: "✅" },
                                    { label: "Con Retraso", value: attendance.filter(a => a.score < 10).length, color: "amber", icon: "⚠️" },
                                    { label: "Mejor Nota", value: attendance.length > 0 ? Math.max(...attendance.map(a => a.score)).toFixed(1) : "—", color: "blue", icon: "⭐" },
                                    { label: "Este Mes", value: attendance.filter(a => a.date.startsWith(new Date().toISOString().slice(0,7))).length, color: "purple", icon: "📅" },
                                ].map((stat, i) => (
                                    <div key={i} className={`p-4 bg-slate-900/80 border border-slate-800 rounded-2xl text-center hover:border-${stat.color}-500/30 transition-all`}>
                                        <p className="text-2xl mb-1">{stat.icon}</p>
                                        <p className={`text-xl font-black text-${stat.color}-400`}>{stat.value}</p>
                                        <p className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Cartesian Chart */}
                        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-sm font-black text-white uppercase tracking-wider">Plano Cartesiano de Rendimiento</h3>
                                    <p className="text-[10px] font-mono text-slate-400 mt-0.5">Eje X: Días del período · Eje Y: Calificación sobre 10</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                                    <span className="text-[10px] font-mono text-slate-400">Puntual</span>
                                    <div className="w-2 h-2 rounded-full bg-amber-400 ml-2" />
                                    <span className="text-[10px] font-mono text-slate-400">Retraso</span>
                                </div>
                            </div>
                            {chartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={320}>
                                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                        <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 10, fontFamily: "monospace" }} />
                                        <YAxis domain={[0, 10]} tick={{ fill: "#64748b", fontSize: 10, fontFamily: "monospace" }} />
                                        <Tooltip
                                            contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", color: "#fff", fontSize: "11px" }}
                                            formatter={(val: any) => [`${Number(val).toFixed(1)}/10`, "Calificación"]}
                                        />
                                        <ReferenceLine y={10} stroke="#10b981" strokeDasharray="4 4" strokeOpacity={0.5} label={{ value: "10 ✓", fill: "#10b981", fontSize: 9 }} />
                                        <ReferenceLine y={8} stroke="#f59e0b" strokeDasharray="4 4" strokeOpacity={0.3} />
                                        <Area type="monotone" dataKey="score" stroke="#10b981" strokeWidth={2.5} fill="url(#scoreGradient)" dot={{ fill: "#10b981", r: 5, strokeWidth: 2, stroke: "#065f46" }} activeDot={{ r: 7, fill: "#34d399" }} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-64 flex items-center justify-center text-slate-500 font-mono text-sm">
                                    Sin datos de asistencia registrados
                                </div>
                            )}
                        </div>

                        {/* Attendance history table */}
                        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-800">
                                <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider">Historial de Registros</h3>
                            </div>
                            <div className="divide-y divide-slate-800">
                                {[...attendance].reverse().map(a => (
                                    <div key={a.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-900/50 transition-colors">
                                        <div className="text-center shrink-0 w-14">
                                            <p className="text-[10px] font-mono text-slate-400">{a.date.slice(5)}</p>
                                            <p className="text-sm font-black text-white">{a.time}</p>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold text-slate-300 truncate">{a.note}</p>
                                            <p className="text-[9px] font-mono text-slate-500">{a.status.replace(/_/g, " ")}</p>
                                        </div>
                                        <ScoreBadge score={a.score} />
                                    </div>
                                ))}
                                {attendance.length === 0 && (
                                    <div className="px-6 py-8 text-center text-slate-500 font-mono text-sm">No hay registros aún</div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ── TAB: AUDITORÍA ─────────────────────────────────── */}
                {activeTab === "auditoria" && (
                    <motion.div key="auditoria" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                        <div className="grid md:grid-cols-3 gap-4">
                            {/* Check: Finanzas Personales */}
                            <motion.div
                                whileHover={{ scale: 1.01 }}
                                onClick={() => setCheckModal("personal")}
                                className="p-6 bg-slate-900/80 border border-slate-800 rounded-3xl cursor-pointer hover:border-emerald-500/40 transition-all group"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl">
                                        <Wallet size={20} className="text-emerald-400" />
                                    </div>
                                    <Check size={18} className="text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <h3 className="font-black text-white text-sm mb-1">💰 Finanzas Personales</h3>
                                <p className="text-[10px] font-mono text-slate-400">Ingresos y gastos personales del día</p>
                                {checks.personalFinance && (
                                    <div className="mt-3 pt-3 border-t border-slate-800 grid grid-cols-2 gap-2">
                                        <div>
                                            <p className="text-[9px] font-mono text-slate-500">Ingresos</p>
                                            <p className="text-sm font-black text-emerald-400">${checks.personalFinance.income?.toFixed(2)}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-mono text-slate-500">Gastos</p>
                                            <p className="text-sm font-black text-rose-400">${checks.personalFinance.expenses?.toFixed(2)}</p>
                                        </div>
                                    </div>
                                )}
                            </motion.div>

                            {/* Check: Finanzas Empresa */}
                            <motion.div
                                whileHover={{ scale: 1.01 }}
                                onClick={() => setCheckModal("empresa")}
                                className="p-6 bg-slate-900/80 border border-slate-800 rounded-3xl cursor-pointer hover:border-blue-500/40 transition-all group"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-2xl">
                                        <Building2 size={20} className="text-blue-400" />
                                    </div>
                                    <Check size={18} className="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <h3 className="font-black text-white text-sm mb-1">🏢 Finanzas Empresa</h3>
                                <p className="text-[10px] font-mono text-slate-400">Ingresos, egresos, deudas y facturas</p>
                                {checks.companyFinance && (
                                    <div className="mt-3 pt-3 border-t border-slate-800 grid grid-cols-2 gap-2">
                                        <div>
                                            <p className="text-[9px] font-mono text-slate-500">Ingresos</p>
                                            <p className="text-sm font-black text-emerald-400">${checks.companyFinance.income?.toFixed(2)}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-mono text-slate-500">Egresos</p>
                                            <p className="text-sm font-black text-rose-400">${checks.companyFinance.expenses?.toFixed(2)}</p>
                                        </div>
                                    </div>
                                )}
                                {(checks.debtsToPay?.length > 0 || checks.invoicesToCollect?.length > 0) && (
                                    <div className="mt-2 flex gap-2">
                                        <span className="text-[9px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">{checks.debtsToPay?.length || 0} deudas</span>
                                        <span className="text-[9px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full">{checks.invoicesToCollect?.length || 0} facturas</span>
                                    </div>
                                )}
                            </motion.div>

                            {/* Check: Marketing */}
                            <motion.div
                                whileHover={{ scale: 1.01 }}
                                onClick={() => setCheckModal("marketing")}
                                className="p-6 bg-slate-900/80 border border-slate-800 rounded-3xl cursor-pointer hover:border-purple-500/40 transition-all group"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-2xl">
                                        <Megaphone size={20} className="text-purple-400" />
                                    </div>
                                    <Check size={18} className="text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <h3 className="font-black text-white text-sm mb-1">📣 Marketing</h3>
                                <p className="text-[10px] font-mono text-slate-400">Ingresos, pautas, deuda publicitaria</p>
                                {checks.marketing && (
                                    <div className="mt-3 pt-3 border-t border-slate-800 space-y-1">
                                        <p className="text-[9px] font-mono text-slate-400">
                                            ID Cuenta: <span className="text-purple-400 font-bold">{checks.marketing.adAccountId || "—"}</span>
                                        </p>
                                        <p className="text-[9px] font-mono text-slate-400">
                                            Pauta: <span className="text-rose-400 font-bold">${checks.marketing.expenses?.toFixed(2)}</span>
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    </motion.div>
                )}

                {/* ── TAB: CICLOS LABORALES ──────────────────────────── */}
                {activeTab === "ciclos" && (
                    <motion.div key="ciclos" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-black text-slate-300 uppercase tracking-wider">Ciclos Laborales Activos</h2>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setAddCycleOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all"
                            >
                                <Plus size={14} /> Agregar Ciclo
                            </motion.button>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {workCycles.map(cycle => <WorkCycleTimer key={cycle.id} cycle={cycle} />)}
                            {workCycles.length === 0 && (
                                <div className="col-span-3 py-12 text-center text-slate-500 font-mono text-sm">No hay ciclos laborales registrados</div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* ── TAB: TAREAS DIRIGIDAS ──────────────────────────── */}
                {activeTab === "tareas" && (
                    <motion.div key="tareas" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <h2 className="text-sm font-black text-slate-300 uppercase tracking-wider">Pendientes Dirigidos</h2>
                                <div className="flex gap-2">
                                    <button onClick={() => setTaskAuditView(false)} className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all ${!taskAuditView ? 'bg-blue-500/20 border border-blue-500/30 text-blue-300' : 'text-slate-400 hover:text-white'}`}>Despachar</button>
                                    <button onClick={() => setTaskAuditView(true)} className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all ${taskAuditView ? 'bg-purple-500/20 border border-purple-500/30 text-purple-300' : 'text-slate-400 hover:text-white'}`}>Auditar Entregas</button>
                                </div>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setSendTaskOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 text-blue-300 hover:bg-blue-500/20 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all"
                            >
                                <Send size={14} /> Enviar Tarea
                            </motion.button>
                        </div>

                        {!taskAuditView ? (
                            <div className="space-y-3">
                                {tasks.map(task => (
                                    <div key={task.id} className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl hover:border-slate-700 transition-all">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                                                        task.taskType === 'URGENTE' ? 'text-rose-400 bg-rose-500/10 border-rose-500/30' : 'text-blue-400 bg-blue-500/10 border-blue-500/30'
                                                    }`}>{task.taskType}</span>
                                                    <span className="text-[9px] font-mono text-slate-400">{task.targetArea}</span>
                                                    <span className="text-[9px] font-mono text-slate-500">• {task.requiredFormat}</span>
                                                </div>
                                                <p className="text-xs font-bold text-white truncate">{task.title}</p>
                                                <p className="text-[10px] font-mono text-slate-400 mt-0.5 line-clamp-1">{task.description}</p>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border inline-block ${
                                                    task.status === 'APROBADA' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                                                    : task.status === 'ENTREGADA' ? 'text-blue-400 bg-blue-500/10 border-blue-500/30'
                                                    : task.status === 'RECHAZADA' ? 'text-rose-400 bg-rose-500/10 border-rose-500/30'
                                                    : 'text-amber-400 bg-amber-500/10 border-amber-500/30'
                                                }`}>{task.status}</span>
                                                <p className="text-[9px] font-mono text-slate-500 mt-1">{task.duration}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {tasks.length === 0 && (
                                    <div className="py-12 text-center text-slate-500 font-mono text-sm">No hay tareas despachadas</div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {tasks.filter(t => t.status === 'ENTREGADA').map(task => (
                                    <div key={task.id} className="p-5 bg-slate-900/80 border border-blue-500/20 rounded-2xl space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-xs font-black text-white">{task.title}</p>
                                                <p className="text-[10px] font-mono text-blue-400">{task.targetArea} • {task.requiredFormat}</p>
                                            </div>
                                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full border text-blue-400 bg-blue-500/10 border-blue-500/30">ENTREGADA</span>
                                        </div>
                                        {task.delivery && (
                                            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                                                <p className="text-[10px] font-mono text-slate-400 mb-1">ENTREGA DEL COLABORADOR:</p>
                                                <p className="text-xs text-slate-300">{task.delivery.text}</p>
                                            </div>
                                        )}
                                        <div className="flex gap-2">
                                            <button onClick={() => handleTaskAction(task.id, "APPROVE_TASK", "¡Excelente trabajo!")}
                                                className="flex-1 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1">
                                                <Check size={12} /> Aprobar
                                            </button>
                                            <button onClick={() => handleTaskAction(task.id, "REJECT_TASK", "Requiere correcciones. Revisar requisitos.")}
                                                className="flex-1 py-2 bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1">
                                                <X size={12} /> Rechazar
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {tasks.filter(t => t.status === 'ENTREGADA').length === 0 && (
                                    <div className="py-12 text-center text-slate-500 font-mono text-sm">No hay entregas pendientes de revisión</div>
                                )}
                            </div>
                        )}
                    </motion.div>
                )}

                {/* ── TAB: CRM ──────────────────────────────────────── */}
                {activeTab === "crm" && (
                    <motion.div key="crm" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-black text-slate-300 uppercase tracking-wider">Delegación de Clientes</h2>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setDelegateOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all"
                            >
                                <UserCheck size={14} /> Delegar Cliente
                            </motion.button>
                        </div>
                        <div className="space-y-3">
                            {delegated.map(d => (
                                <div key={d.id} className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl hover:border-amber-500/20 transition-all">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-black font-black shrink-0">
                                            {d.clientName.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <p className="text-xs font-black text-white truncate">{d.clientName}</p>
                                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                                                    d.status === 'ATENDIDO' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' : 'text-amber-400 bg-amber-500/10 border-amber-500/30'
                                                }`}>{d.status}</span>
                                            </div>
                                            <p className="text-[10px] font-mono text-slate-400">📲 {d.phone} • Asignado a: <span className="text-blue-400">{d.assignedName}</span></p>
                                            <p className="text-[10px] font-mono text-amber-400 mt-0.5">🎯 {d.objective}</p>
                                            {d.requirementText && <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">{d.requirementText}</p>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {delegated.length === 0 && (
                                <div className="py-12 text-center text-slate-500 font-mono text-sm">No hay clientes delegados</div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ─────────────────────────────────────────────────────────────────
                MODALS
            ───────────────────────────────────────────────────────────────── */}
            <AnimatePresence>
                {/* Modal: Finanzas Personales */}
                {checkModal === "personal" && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" onClick={() => setCheckModal(null)} />
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="fixed inset-0 z-60 flex items-center justify-center p-4">
                            <div className="bg-[#0a0a0f] border border-emerald-500/30 rounded-3xl p-6 shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
                                <div className="flex justify-between items-center mb-5">
                                    <h3 className="font-black text-white flex items-center gap-2"><Wallet className="text-emerald-400" size={18} /> Finanzas Personales</h3>
                                    <button onClick={() => setCheckModal(null)} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400"><X size={16} /></button>
                                </div>
                                <div className="space-y-4">
                                    {[
                                        { label: "Ingresos Personales ($)", value: pfIncome, set: setPfIncome, color: "emerald" },
                                        { label: "Gastos Personales ($)", value: pfExpenses, set: setPfExpenses, color: "rose" },
                                    ].map((f, i) => (
                                        <div key={i}>
                                            <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">{f.label}</label>
                                            <input type="number" step="0.01" value={f.value} onChange={e => f.set(e.target.value)} placeholder="0.00"
                                                className="w-full bg-slate-900 border border-slate-700 text-white p-3 rounded-2xl font-mono font-bold outline-none focus:border-emerald-500/50 transition-colors" />
                                        </div>
                                    ))}
                                    {pfIncome && pfExpenses && (
                                        <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl">
                                            <p className="text-[10px] font-mono text-slate-400">Balance</p>
                                            <p className={`text-xl font-black ${(parseFloat(pfIncome) - parseFloat(pfExpenses)) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                ${(parseFloat(pfIncome) - parseFloat(pfExpenses)).toFixed(2)}
                                            </p>
                                        </div>
                                    )}
                                    <button onClick={() => handleSaveCheck("personal")} disabled={isSavingCheck} className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black rounded-2xl text-sm flex items-center justify-center gap-2 disabled:opacity-50">
                                        {isSavingCheck ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} Guardar
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}

                {/* Modal: Finanzas Empresa */}
                {checkModal === "empresa" && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" onClick={() => setCheckModal(null)} />
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="fixed inset-0 z-60 flex items-center justify-center p-4">
                            <div className="bg-[#0a0a0f] border border-blue-500/30 rounded-3xl p-6 shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto">
                                <div className="flex justify-between items-center mb-5">
                                    <h3 className="font-black text-white flex items-center gap-2"><Building2 className="text-blue-400" size={18} /> Finanzas de la Empresa</h3>
                                    <button onClick={() => setCheckModal(null)} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400"><X size={16} /></button>
                                </div>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { label: "Ingresos ($)", value: cfIncome, set: setCfIncome },
                                            { label: "Egresos ($)", value: cfExpenses, set: setCfExpenses },
                                        ].map((f, i) => (
                                            <div key={i}>
                                                <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">{f.label}</label>
                                                <input type="number" step="0.01" value={f.value} onChange={e => f.set(e.target.value)} placeholder="0.00"
                                                    className="w-full bg-slate-900 border border-slate-700 text-white p-3 rounded-2xl font-mono font-bold outline-none focus:border-blue-500/50 transition-colors" />
                                            </div>
                                        ))}
                                    </div>
                                    <button onClick={() => handleSaveCheck("empresa")} disabled={isSavingCheck} className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black rounded-2xl text-sm flex items-center justify-center gap-2 disabled:opacity-50">
                                        {isSavingCheck ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} Guardar Finanzas
                                    </button>
                                    {/* Deudas por pagar */}
                                    <div className="border-t border-slate-800 pt-4">
                                        <h4 className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest mb-3">⚠️ Deudas por Pagar</h4>
                                        <div className="space-y-2 mb-3">
                                            {(checks.debtsToPay || []).map((d: any) => (
                                                <div key={d.id} className="flex items-center justify-between p-2.5 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                                                    <div>
                                                        <p className="text-[10px] font-bold text-white">{d.creditor}</p>
                                                        <p className="text-[9px] font-mono text-slate-400">Vence: {d.dueDate}</p>
                                                    </div>
                                                    <p className="text-sm font-black text-amber-400">${d.amount}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                            <input placeholder="Acreedor" value={newDebtCreditor} onChange={e => setNewDebtCreditor(e.target.value)} className="bg-slate-900 border border-slate-700 text-white p-2 rounded-xl text-xs outline-none focus:border-amber-500/50" />
                                            <input type="number" placeholder="Monto $" value={newDebtAmount} onChange={e => setNewDebtAmount(e.target.value)} className="bg-slate-900 border border-slate-700 text-white p-2 rounded-xl text-xs font-mono outline-none focus:border-amber-500/50" />
                                            <input type="date" value={newDebtDue} onChange={e => setNewDebtDue(e.target.value)} className="bg-slate-900 border border-slate-700 text-white p-2 rounded-xl text-xs font-mono outline-none focus:border-amber-500/50" />
                                        </div>
                                        <button onClick={handleAddDebt} className="w-full mt-2 py-2 bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 rounded-xl text-xs font-bold flex items-center justify-center gap-1">
                                            <Plus size={12} /> Agregar Deuda
                                        </button>
                                    </div>
                                    {/* Facturas por cobrar */}
                                    <div className="border-t border-slate-800 pt-4">
                                        <h4 className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest mb-3">📄 Facturas por Cobrar</h4>
                                        <div className="space-y-2 mb-3">
                                            {(checks.invoicesToCollect || []).map((inv: any) => (
                                                <div key={inv.id} className="flex items-center justify-between p-2.5 bg-cyan-500/5 border border-cyan-500/20 rounded-xl">
                                                    <div>
                                                        <p className="text-[10px] font-bold text-white">{inv.client}</p>
                                                        <p className="text-[9px] font-mono text-slate-400">{inv.issueDate}</p>
                                                    </div>
                                                    <p className="text-sm font-black text-cyan-400">${inv.amount}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <input placeholder="Cliente / Empresa" value={newInvClient} onChange={e => setNewInvClient(e.target.value)} className="bg-slate-900 border border-slate-700 text-white p-2 rounded-xl text-xs outline-none focus:border-cyan-500/50" />
                                            <input type="number" placeholder="Monto $" value={newInvAmount} onChange={e => setNewInvAmount(e.target.value)} className="bg-slate-900 border border-slate-700 text-white p-2 rounded-xl text-xs font-mono outline-none focus:border-cyan-500/50" />
                                        </div>
                                        <button onClick={handleAddInvoice} className="w-full mt-2 py-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 rounded-xl text-xs font-bold flex items-center justify-center gap-1">
                                            <Plus size={12} /> Agregar Factura
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}

                {/* Modal: Marketing */}
                {checkModal === "marketing" && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" onClick={() => setCheckModal(null)} />
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="fixed inset-0 z-60 flex items-center justify-center p-4">
                            <div className="bg-[#0a0a0f] border border-purple-500/30 rounded-3xl p-6 shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
                                <div className="flex justify-between items-center mb-5">
                                    <h3 className="font-black text-white flex items-center gap-2"><Megaphone className="text-purple-400" size={18} /> Check de Marketing</h3>
                                    <button onClick={() => setCheckModal(null)} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400"><X size={16} /></button>
                                </div>
                                <div className="space-y-4">
                                    {[
                                        { label: "Ingresos Atribuidos ($)", value: mktIncome, set: setMktIncome },
                                        { label: "Egresos en Pauta ($)", value: mktExpenses, set: setMktExpenses },
                                        { label: "Deuda Publicitaria ($)", value: mktDebt, set: setMktDebt },
                                    ].map((f, i) => (
                                        <div key={i}>
                                            <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">{f.label}</label>
                                            <input type="number" step="0.01" value={f.value} onChange={e => f.set(e.target.value)} placeholder="0.00"
                                                className="w-full bg-slate-900 border border-slate-700 text-white p-3 rounded-2xl font-mono font-bold outline-none focus:border-purple-500/50 transition-colors" />
                                        </div>
                                    ))}
                                    <div>
                                        <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">Plataforma</label>
                                        <select value={mktPlatform} onChange={e => setMktPlatform(e.target.value)} className="w-full bg-slate-900 border border-slate-700 text-white p-3 rounded-2xl text-sm font-bold outline-none focus:border-purple-500/50">
                                            <option>Meta Ads Manager</option>
                                            <option>Google Ads</option>
                                            <option>TikTok Ads</option>
                                            <option>LinkedIn Ads</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-widest block mb-1">🆔 ID Cuenta Publicitaria</label>
                                        <input type="text" value={mktAdAccountId} onChange={e => setMktAdAccountId(e.target.value)} placeholder="act_XXXXXXXXXXXXXXXXX"
                                            className="w-full bg-slate-900 border border-purple-500/30 text-purple-300 p-3 rounded-2xl font-mono font-bold outline-none focus:border-purple-500/60 placeholder-purple-900 transition-colors" />
                                        <p className="text-[9px] font-mono text-slate-500 mt-1">Ej: act_492019482019842 (Meta) • 123-456-7890 (Google)</p>
                                    </div>
                                    <button onClick={() => handleSaveCheck("marketing")} disabled={isSavingCheck} className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black rounded-2xl text-sm flex items-center justify-center gap-2 disabled:opacity-50">
                                        {isSavingCheck ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} Guardar Marketing
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}

                {/* Modal: Enviar Tarea */}
                {sendTaskOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" onClick={() => setSendTaskOpen(false)} />
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="fixed inset-0 z-60 flex items-center justify-center p-4">
                            <div className="bg-[#0a0a0f] border border-blue-500/30 rounded-3xl p-6 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                                <div className="flex justify-between items-center mb-5">
                                    <h3 className="font-black text-white flex items-center gap-2"><Send className="text-blue-400" size={18} /> Enviar Tarea Dirigida</h3>
                                    <button onClick={() => setSendTaskOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400"><X size={16} /></button>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">Título de la Tarea *</label>
                                        <input value={taskTitle} onChange={e => setTaskTitle(e.target.value)} placeholder="Ej: Crear 3 reels de cámaras 4K..."
                                            className="w-full bg-slate-900 border border-slate-700 text-white p-3 rounded-2xl text-sm font-bold outline-none focus:border-blue-500/50 transition-colors" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">Descripción Detallada</label>
                                        <textarea value={taskDesc} onChange={e => setTaskDesc(e.target.value)} rows={3} placeholder="Detalla el objetivo, estilo, referencias..."
                                            className="w-full bg-slate-900 border border-slate-700 text-white p-3 rounded-2xl text-sm resize-none outline-none focus:border-blue-500/50 transition-colors" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">Área de Destino</label>
                                            <select value={taskArea} onChange={e => setTaskArea(e.target.value)} className="w-full bg-slate-900 border border-slate-700 text-white p-3 rounded-2xl text-sm font-bold outline-none">
                                                {["Todos", "Ventas", "Edición", "Desarrollo", "Marketing", "Coordinación", "Contabilidad", "Investigación"].map(a => <option key={a}>{a}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">Tipo</label>
                                            <select value={taskType} onChange={e => setTaskType(e.target.value)} className="w-full bg-slate-900 border border-slate-700 text-white p-3 rounded-2xl text-sm font-bold outline-none">
                                                {["URGENTE", "ORDINARIA"].map(t => <option key={t}>{t}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">Tiempo Límite</label>
                                            <select value={taskDuration} onChange={e => setTaskDuration(e.target.value)} className="w-full bg-slate-900 border border-slate-700 text-white p-3 rounded-2xl text-sm font-bold outline-none">
                                                {["Urgente", "30 minutos", "1 hora", "1.5 horas", "12 horas", "24 horas", "1 día", "1-2 días", "1-5 días", "Abierto"].map(d => <option key={d}>{d}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">Formato de Entrega</label>
                                            <select value={taskFormat} onChange={e => setTaskFormat(e.target.value)} className="w-full bg-slate-900 border border-slate-700 text-white p-3 rounded-2xl text-sm font-bold outline-none">
                                                {["VIDEO", "FOTO", "AUDIO", "CUESTIONARIO", "CUALQUIER_ARCHIVO"].map(f => <option key={f}>{f}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleSendTask}
                                        disabled={!taskTitle || isSending}
                                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black rounded-2xl text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {isSending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                                        {isSending ? "Enviando..." : "Despachar Tarea"}
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}

                {/* Modal: Agregar Ciclo Laboral */}
                {addCycleOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" onClick={() => setAddCycleOpen(false)} />
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="fixed inset-0 z-60 flex items-center justify-center p-4">
                            <div className="bg-[#0a0a0f] border border-emerald-500/30 rounded-3xl p-6 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                                <div className="flex justify-between items-center mb-5">
                                    <h3 className="font-black text-white flex items-center gap-2"><Timer className="text-emerald-400" size={18} /> Nuevo Ciclo Laboral</h3>
                                    <button onClick={() => setAddCycleOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400"><X size={16} /></button>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">Colaborador *</label>
                                        <select value={cycleEmployee} onChange={e => setCycleEmployee(e.target.value)} className="w-full bg-slate-900 border border-slate-700 text-white p-3 rounded-2xl text-sm font-bold outline-none focus:border-emerald-500/50">
                                            <option value="">Seleccionar colaborador...</option>
                                            {systemUsers.map((u: any) => <option key={u.id} value={u.email}>{u.name || u.email} ({u.role})</option>)}
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">Duración del Ciclo (días)</label>
                                            <input type="number" value={cycleDays} onChange={e => setCycleDays(e.target.value)} className="w-full bg-slate-900 border border-slate-700 text-white p-3 rounded-2xl font-mono font-bold outline-none focus:border-emerald-500/50" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">Horas de Trabajo</label>
                                            <input value={cycleHours} onChange={e => setCycleHours(e.target.value)} placeholder="40 Horas Semanales" className="w-full bg-slate-900 border border-slate-700 text-white p-3 rounded-2xl text-sm font-bold outline-none focus:border-emerald-500/50" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">Cuenta Bancaria</label>
                                        <input value={cycleBank} onChange={e => setCycleBank(e.target.value)} placeholder="Banco Pichincha - Ahorros: XXXXXXXXXX" className="w-full bg-slate-900 border border-slate-700 text-white p-3 rounded-2xl text-sm font-bold outline-none focus:border-emerald-500/50" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">Beneficio Monetario</label>
                                        <input value={cycleBenefit} onChange={e => setCycleBenefit(e.target.value)} placeholder="$600 Base + 5% Comisiones" className="w-full bg-slate-900 border border-slate-700 text-white p-3 rounded-2xl text-sm font-bold outline-none focus:border-emerald-500/50" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">Tipo de Contrato</label>
                                            <select value={cycleContract} onChange={e => setCycleContract(e.target.value)} className="w-full bg-slate-900 border border-slate-700 text-white p-3 rounded-2xl text-sm font-bold outline-none">
                                                {["INDEFINIDO", "DEFINIDO"].map(c => <option key={c}>{c}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">Modalidad</label>
                                            <select value={cycleModality} onChange={e => setCycleModality(e.target.value)} className="w-full bg-slate-900 border border-slate-700 text-white p-3 rounded-2xl text-sm font-bold outline-none">
                                                {["PRESENCIAL", "REMOTO", "HIBRIDO"].map(m => <option key={m}>{m}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-slate-900 border border-slate-700 rounded-2xl cursor-pointer" onClick={() => setCycleIsFreelancer(!cycleIsFreelancer)}>
                                        <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${cycleIsFreelancer ? 'bg-purple-500 border-purple-500' : 'border-slate-600'}`}>
                                            {cycleIsFreelancer && <Check size={12} className="text-white" />}
                                        </div>
                                        <span className="text-sm font-bold text-slate-300">Es Freelancer</span>
                                    </div>
                                    {cycleIsFreelancer && (
                                        <div className="space-y-3 p-4 bg-purple-500/5 border border-purple-500/20 rounded-2xl">
                                            <div>
                                                <label className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-widest block mb-1">Descripción del Acuerdo</label>
                                                <textarea value={cycleAgreement} onChange={e => setCycleAgreement(e.target.value)} rows={2} className="w-full bg-slate-900 border border-purple-500/30 text-white p-2 rounded-xl text-sm resize-none outline-none" placeholder="Ej: 12 reels semanales + 4 spots comerciales 4K por mes..." />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-widest block mb-1">Porcentaje de Comisión (%)</label>
                                                <input type="number" value={cyclePercent} onChange={e => setCyclePercent(e.target.value)} placeholder="15" className="w-full bg-slate-900 border border-purple-500/30 text-white p-2 rounded-xl font-mono font-bold outline-none" />
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-3 p-3 bg-slate-900 border border-slate-700 rounded-2xl cursor-pointer" onClick={() => setCycleNoContract(!cycleNoContract)}>
                                        <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${cycleNoContract ? 'bg-amber-500 border-amber-500' : 'border-slate-600'}`}>
                                            {cycleNoContract && <Check size={12} className="text-white" />}
                                        </div>
                                        <span className="text-sm font-bold text-slate-300">Sin Contrato Formal</span>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleAddCycle}
                                        disabled={!cycleEmployee || isSending}
                                        className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black rounded-2xl text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {isSending ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                                        {isSending ? "Registrando..." : "Registrar Ciclo Laboral"}
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}

                {/* Modal: Delegar Cliente */}
                {delegateOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" onClick={() => setDelegateOpen(false)} />
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="fixed inset-0 z-60 flex items-center justify-center p-4">
                            <div className="bg-[#0a0a0f] border border-amber-500/30 rounded-3xl p-6 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                                <div className="flex justify-between items-center mb-5">
                                    <h3 className="font-black text-white flex items-center gap-2"><UserCheck className="text-amber-400" size={18} /> Delegar Atención de Cliente</h3>
                                    <button onClick={() => setDelegateOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400"><X size={16} /></button>
                                </div>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">Nombre del Cliente *</label>
                                            <input value={delClientName} onChange={e => setDelClientName(e.target.value)} placeholder="Carlos Mendoza..." className="w-full bg-slate-900 border border-slate-700 text-white p-3 rounded-2xl text-sm font-bold outline-none focus:border-amber-500/50" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">Teléfono / WhatsApp</label>
                                            <input value={delPhone} onChange={e => setDelPhone(e.target.value)} placeholder="+593 9XX XXX XXX" className="w-full bg-slate-900 border border-slate-700 text-white p-3 rounded-2xl text-sm font-mono outline-none focus:border-amber-500/50" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">Asignar a *</label>
                                        <select value={delAssignTo} onChange={e => setDelAssignTo(e.target.value)} className="w-full bg-slate-900 border border-slate-700 text-white p-3 rounded-2xl text-sm font-bold outline-none focus:border-amber-500/50">
                                            <option value="">Seleccionar asesor...</option>
                                            {systemUsers.map((u: any) => <option key={u.id} value={u.email}>{u.name || u.email} ({u.role})</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">Objetivo de la Atención</label>
                                        <select value={delObjective} onChange={e => setDelObjective(e.target.value)} className="w-full bg-slate-900 border border-slate-700 text-white p-3 rounded-2xl text-sm font-bold outline-none">
                                            {["Cerrar Venta", "Cobrar Factura", "Promoción / Oferta", "Presentación de Servicios", "Seguimiento de Lead", "Retención de Cliente"].map(o => <option key={o}>{o}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">Requerimiento Detallado</label>
                                        <textarea value={delRequirement} onChange={e => setDelRequirement(e.target.value)} rows={3} placeholder="Describe el requerimiento del cliente, contexto, qué quiere, qué necesita..."
                                            className="w-full bg-slate-900 border border-slate-700 text-white p-3 rounded-2xl text-sm resize-none outline-none focus:border-amber-500/50" />
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleDelegateClient}
                                        disabled={!delClientName || !delAssignTo || isSending}
                                        className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black rounded-2xl text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {isSending ? <Loader2 size={16} className="animate-spin" /> : <UserCheck size={16} />}
                                        {isSending ? "Delegando..." : "Delegar Atención"}
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}
