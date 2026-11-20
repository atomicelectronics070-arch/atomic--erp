"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSession } from "next-auth/react"
import {
    Plus, Search, Edit3, Filter,
    DollarSign, Calendar, Users,
    X, Check, Save, ArrowUpRight, ArrowDownRight,
    Info, Clock, Target, Briefcase, FileText, PieChart,
    ExternalLink, Upload, ShieldCheck, AlertCircle,
    TrendingUp, Ban, Loader2, CheckCircle2,
    Paperclip, Building2, CreditCard, Wallet,
    Download, Eye, RefreshCw, FileSpreadsheet, Layers,
    Receipt, Tag, AlertTriangle, MessageSquare, Copy,
    CheckCheck, ShieldAlert
} from "lucide-react"
import PaymentTickets from "@/components/PaymentTickets"

// ============================================================================
// 1. INTERFACES Y MODELOS DE DATOS CONTABLES & CARTERA DE COBRANZAS
// ============================================================================

export interface FinanceAttachment {
    id: string
    name: string
    size: string
    type: string
    dataUrl: string
    uploadedAt: string
}

export interface TaxBreakdown {
    subtotal15: number
    subtotal0: number
    vatAmount: number
    retentionIncome: number
    retentionVat: number
    totalNet: number
}

export interface PaymentAssignment {
    targetType: "PROVEEDOR" | "ASESOR" | "CLIENTE" | "COTIZACION" | "OTRO"
    targetName: string
    paymentMethod: string
    bankReference: string
    paymentStatus: "PAGADO_TOTAL" | "ABONO_PARCIAL" | "PENDIENTE"
    partialAmountPaid?: number
    pendingBalance?: number
    paidAt?: string
}

export interface DebtDetails {
    isDebt: boolean
    dueDate: string              // Fecha prometida / compromiso de pago
    daysOverdue: number          // Días de mora calculados en tiempo real
    initialAmount: number        // Monto total adeudado
    paidAmount: number           // Total abonado
    remainingBalance: number     // Saldo restante por cobrar
    riskLevel: "CORRIENTE" | "MEDIO" | "CRITICO"
    debtType: "CLIENTE_VENTA" | "PROYECTO_SOFTWARE" | "PRESTAMO_INTERNO" | "PROVEEDOR" | "OTRO"
    collectionNotes?: string     // Speech, acuerdos y compromisos asumidos
}

export interface FinanceMetadata {
    attachments: FinanceAttachment[]
    exercise: string
    period: string
    costCenter: string
    paymentMethod: string
    bankReference: string
    paymentTarget: string
    isPaymentAssigned: boolean
    paymentAssignmentType: string
    taxDetails?: TaxBreakdown
    debtDetails?: DebtDetails
}

export interface Transaction {
    id: string
    trxId: string
    client: string
    date: string
    amount: number
    pvp: number
    cost: number
    profit: number
    commission: number
    bonus: number
    quoteNumber?: string
    status: "PAGADO" | "PENDIENTE" | "ABONADO" | "CANCELADO"
    commissionStatus: "PENDIENTE" | "PAGADO"
    type: string
    proofUrl?: string
    salespersonId: string
    salesperson?: {
        name: string
        email: string
    }
    meta?: FinanceMetadata
}

// Catálogos Oficiales
export const FISCAL_EXERCISES = ["2026", "2027", "2025"]

export const COST_CENTERS = [
    { id: "operaciones", name: "Operaciones & Oficina", icon: "🏢" },
    { id: "servidores", name: "Servidores, Cloud & Dominios", icon: "💻" },
    { id: "marketing", name: "Publicidad & Meta Ads", icon: "📢" },
    { id: "nomina", name: "Nómina, Asistencia & Bonos", icon: "👥" },
    { id: "proveedores", name: "Proveedores & Mayoristas", icon: "📦" },
    { id: "viaticos", name: "Viáticos & Soporte Técnico", icon: "🛠️" },
    { id: "impuestos", name: "Impuestos & SRI Ecuador", icon: "🏛️" }
]

export const PAYMENT_METHODS = [
    "Transferencia Banco Pichincha",
    "Transferencia Produbanco",
    "Transferencia Banco Guayaquil",
    "Transferencia Banco Internacional",
    "Efectivo en Caja Chica",
    "Cheque Bancario",
    "Tarjeta de Crédito / Débito",
    "De Una / PayPhone",
    "Crédito Directo Proveedor"
]

// Parser resiliente de metadata
export function parseProofMetadata(proofUrl?: string | null): FinanceMetadata {
    const defaultMeta: FinanceMetadata = {
        attachments: [],
        exercise: "2026",
        period: "Q4",
        costCenter: "Operaciones & Oficina",
        paymentMethod: "Transferencia Banco Pichincha",
        bankReference: "",
        paymentTarget: "",
        isPaymentAssigned: false,
        paymentAssignmentType: "PROVEEDOR"
    }

    if (!proofUrl) return defaultMeta

    const trimmed = proofUrl.trim()
    if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
        try {
            const parsed = JSON.parse(trimmed)
            if (Array.isArray(parsed)) {
                return { ...defaultMeta, attachments: parsed }
            }
            if (parsed && typeof parsed === "object") {
                return {
                    attachments: Array.isArray(parsed.attachments) ? parsed.attachments : [],
                    exercise: parsed.exercise || "2026",
                    period: parsed.period || "Q4",
                    costCenter: parsed.costCenter || "Operaciones & Oficina",
                    paymentMethod: parsed.paymentMethod || "Transferencia Banco Pichincha",
                    bankReference: parsed.bankReference || "",
                    paymentTarget: parsed.paymentTarget || "",
                    isPaymentAssigned: Boolean(parsed.isPaymentAssigned),
                    paymentAssignmentType: parsed.paymentAssignmentType || "PROVEEDOR",
                    taxDetails: parsed.taxDetails,
                    debtDetails: parsed.debtDetails
                }
            }
        } catch (e) {}
    }

    // Legacy single URL
    const isPdf = trimmed.includes(".pdf") || trimmed.startsWith("data:application/pdf")
    return {
        ...defaultMeta,
        attachments: [{
            id: "legacy-att-1",
            name: isPdf ? "Comprobante-Factura.pdf" : "Comprobante-Venta.jpg",
            size: "Adjunto",
            type: isPdf ? "application/pdf" : "image/jpeg",
            dataUrl: proofUrl,
            uploadedAt: new Date().toISOString()
        }]
    }
}

// ============================================================================
// 2. COMPONENTE PRINCIPAL FINANCE MANAGER
// ============================================================================

export default function FinanceManager() {
    const { data: session } = useSession()
    const isAdmin = session?.user?.role === "ADMIN" || session?.user?.role === "MANAGEMENT"
    
    // Core data
    const [data, setData] = useState<Transaction[]>([])
    const [users, setUsers] = useState<{ id: string, name: string }[]>([])
    const [quotes, setQuotes] = useState<{ quoteNumber: string, clientName?: string, total: number }[]>([])
    const [loading, setLoading] = useState(true)

    // Navigation & Tabs
    const [activeTab, setActiveTab] = useState<"TRANSACTIONS" | "DEBTS" | "PAYMENT_ASSIGNMENT" | "EXERCISE_BUDGET" | "TICKETS">("TRANSACTIONS")

    // Filters
    const [searchTerm, setSearchTerm] = useState("")
    const [exerciseFilter, setExerciseFilter] = useState("TODOS")
    const [periodFilter, setPeriodFilter] = useState("TODOS")
    const [costCenterFilter, setCostCenterFilter] = useState("TODOS")
    const [typeFilter, setTypeFilter] = useState<"TODOS" | "INGRESOS" | "EGRESOS" | "ASIGNADOS" | "DEUDAS">("TODOS")

    // CRUD Modal State
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<Transaction | null>(null)
    const [entryMode, setEntryMode] = useState<"INGRESO" | "EGRESO" | "ASIGNAR_PAGO" | "DEUDA">("INGRESO")

    // Form fields
    const [formData, setFormData] = useState<Partial<Transaction>>({
        client: "",
        date: new Date().toISOString().split('T')[0],
        amount: 0,
        cost: 0,
        pvp: 0,
        commission: 0,
        bonus: 0,
        quoteNumber: "",
        status: "PENDIENTE",
        commissionStatus: "PENDIENTE",
        type: "Venta Directa",
        salespersonId: isAdmin ? "" : session?.user?.id || ""
    })

    // Metadata fields
    const [formExercise, setFormExercise] = useState("2026")
    const [formPeriod, setFormPeriod] = useState("Q4")
    const [formCostCenter, setFormCostCenter] = useState("Operaciones & Oficina")
    const [formPaymentMethod, setFormPaymentMethod] = useState("Transferencia Banco Pichincha")
    const [formBankReference, setFormBankReference] = useState("")
    const [formPaymentTarget, setFormPaymentTarget] = useState("")
    const [formAttachments, setFormAttachments] = useState<FinanceAttachment[]>([])
    
    // SRI Tax breakdown
    const [enableTaxBreakdown, setEnableTaxBreakdown] = useState(false)
    const [taxSubtotal15, setTaxSubtotal15] = useState(0)
    const [taxSubtotal0, setTaxSubtotal0] = useState(0)
    const [taxRetentionIncome, setTaxRetentionIncome] = useState(0)
    const [taxRetentionVat, setTaxRetentionVat] = useState(0)

    // Commission parameters
    const [hasCommission, setHasCommission] = useState(false)
    const [commissionPercent, setCommissionPercent] = useState(10)
    const [commissionDueDate, setCommissionDueDate] = useState("")

    // Deudas por Cobrar Specific States
    const [debtDueDate, setDebtDueDate] = useState("")
    const [debtInitialPaid, setDebtInitialPaid] = useState<number>(0)
    const [debtNotes, setDebtNotes] = useState("")
    const [debtType, setDebtType] = useState<"CLIENTE_VENTA" | "PROYECTO_SOFTWARE" | "PRESTAMO_INTERNO" | "PROVEEDOR" | "OTRO">("CLIENTE_VENTA")

    // Submission states
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
    const [statusMessage, setStatusMessage] = useState("")

    // Attachments Lightbox Modal
    const [viewingAttachments, setViewingAttachments] = useState<{ trxId: string, client: string, attachments: FinanceAttachment[], meta?: FinanceMetadata } | null>(null)
    const [activePreviewDoc, setActivePreviewDoc] = useState<FinanceAttachment | null>(null)

    // Quick Payment Assign Modal
    const [quickAssignTrx, setQuickAssignTrx] = useState<Transaction | null>(null)
    const [quickAssignAmount, setQuickAssignAmount] = useState<number>(0)
    const [quickAssignBank, setQuickAssignBank] = useState(PAYMENT_METHODS[0])
    const [quickAssignRef, setQuickAssignRef] = useState("")
    const [quickAssignAttachment, setQuickAssignAttachment] = useState<FinanceAttachment | null>(null)

    // Toast copy state
    const [copiedSpeechTrxId, setCopiedSpeechTrxId] = useState<string | null>(null)

    // ============================================================================
    // 3. EFECTOS & CARGA DE DATOS
    // ============================================================================

    useEffect(() => {
        fetchTransactions()
        if (isAdmin) {
            fetchUsers()
            fetchQuotes()
        }
    }, [isAdmin])

    const fetchTransactions = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/finance")
            if (res.ok) {
                const raw = await res.json()
                if (Array.isArray(raw)) {
                    const enriched: Transaction[] = raw.map(t => ({
                        ...t,
                        meta: parseProofMetadata(t.proofUrl)
                    }))
                    setData(enriched)
                }
            }
        } catch (e) {
            console.error("[FinanceManager] Error loading transactions", e)
        } finally {
            setLoading(false)
        }
    }

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/users")
            if (res.ok) {
                const u = await res.json()
                setUsers(Array.isArray(u) ? u : [])
            }
        } catch (e) {}
    }

    const fetchQuotes = async () => {
        try {
            const res = await fetch("/api/quotes?limit=50")
            if (res.ok) {
                const q = await res.json()
                const list = q.quotes || q
                if (Array.isArray(list)) {
                    setQuotes(list.map(item => ({
                        quoteNumber: item.quoteNumber || item.globalQuoteNumber || "PROP",
                        clientName: item.clientName || item.client?.name || "Cliente",
                        total: item.total || 0
                    })))
                }
            }
        } catch (e) {}
    }

    // ============================================================================
    // 4. CÁLCULO DE KPIs CONTABLES & DEUDAS POR COBRAR
    // ============================================================================

    const isEgresoItem = (itemType: string) => {
        const t = (itemType || "").toLowerCase()
        return t.startsWith("egreso") || t === "ticket de pago" || t.includes("gasto") || t.includes("pago a proveedor")
    }

    const isDebtItem = (item: Transaction) => {
        const t = (item.type || "").toLowerCase()
        const meta = item.meta
        if (meta?.debtDetails?.isDebt) return true
        if (t.includes("deuda") || t.includes("cartera") || t.includes("cuenta por cobrar")) return true
        if (!isEgresoItem(item.type) && (item.status === "PENDIENTE" || item.status === "ABONADO")) return true
        return false
    }

    const calculateDaysOverdue = (targetDateStr?: string, fallbackCreatedStr?: string) => {
        const dateToEvaluate = targetDateStr ? new Date(targetDateStr) : (fallbackCreatedStr ? new Date(fallbackCreatedStr) : new Date())
        if (isNaN(dateToEvaluate.getTime())) return 0
        const diffMs = Date.now() - dateToEvaluate.getTime()
        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
        return Math.max(0, days)
    }

    const filteredData = useMemo(() => {
        const now = new Date()
        const currentYear = now.getFullYear()
        const currentMonth = now.getMonth()
        const currentQuarter = Math.floor(currentMonth / 3)

        return data.filter(item => {
            const itemDate = new Date(item.date)
            const meta = item.meta

            const matchesSearch = 
                (item.trxId || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
                (item.client || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                (item.quoteNumber || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                (meta?.bankReference || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                (meta?.paymentTarget || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                (meta?.debtDetails?.collectionNotes || "").toLowerCase().includes(searchTerm.toLowerCase())
            
            if (!matchesSearch) return false

            if (exerciseFilter !== "TODOS") {
                const trxYear = meta?.exercise || itemDate.getFullYear().toString()
                if (trxYear !== exerciseFilter) return false
            }

            if (periodFilter === "ANUAL") {
                if (itemDate.getFullYear() !== currentYear) return false
            } else if (periodFilter === "TRIMESTRAL") {
                const itemQuarter = Math.floor(itemDate.getMonth() / 3)
                if (itemDate.getFullYear() !== currentYear || itemQuarter !== currentQuarter) return false
            } else if (periodFilter === "MENSUAL") {
                if (itemDate.getFullYear() !== currentYear || itemDate.getMonth() !== currentMonth) return false
            }

            if (costCenterFilter !== "TODOS") {
                if (meta?.costCenter !== costCenterFilter) return false
            }

            if (typeFilter === "INGRESOS") {
                if (isEgresoItem(item.type)) return false
            } else if (typeFilter === "EGRESOS") {
                if (!isEgresoItem(item.type)) return false
            } else if (typeFilter === "ASIGNADOS") {
                if (!meta?.isPaymentAssigned && item.status !== "ABONADO" && item.status !== "PAGADO") return false
            } else if (typeFilter === "DEUDAS") {
                if (!isDebtItem(item)) return false
            }

            return true
        })
    }, [data, searchTerm, exerciseFilter, periodFilter, costCenterFilter, typeFilter])

    // Deudas por Cobrar Lista
    const allDebts = useMemo(() => {
        return data.filter(i => isDebtItem(i) && i.status !== "CANCELADO")
    }, [data])

    const openDebts = useMemo(() => {
        return allDebts.filter(i => i.status === "PENDIENTE" || i.status === "ABONADO")
    }, [allDebts])

    // KPI Metrics
    const activeData = filteredData.filter(i => i.status !== "CANCELADO")
    const ventas = activeData.filter(i => !isEgresoItem(i.type))
    const egresos = activeData.filter(i => isEgresoItem(i.type))

    const ingresosTotales = ventas.reduce((a, c) => a + (c.pvp || c.amount), 0)
    const ingresosCobrados = ventas.filter(i => i.status === "PAGADO").reduce((a, c) => a + c.amount, 0)
    const ingresosAbonados = ventas.filter(i => i.status === "ABONADO").reduce((a, c) => a + c.amount, 0)
    
    // Cuentas por cobrar (cartera)
    const cuentasPorCobrar = openDebts.reduce((a, c) => {
        const remaining = c.meta?.debtDetails?.remainingBalance !== undefined ? c.meta.debtDetails.remainingBalance : (c.pvp || c.amount)
        return a + remaining
    }, 0)
    
    // Mora Crítica (>30 días o caso Soft 3 / Rómulo)
    const moraCriticaDeudas = openDebts.filter(i => {
        const targetDueDate = i.meta?.debtDetails?.dueDate || i.date
        return calculateDaysOverdue(targetDueDate, i.date) >= 30
    })
    const totalMoraCritica = moraCriticaDeudas.reduce((a, c) => a + (c.pvp || c.amount), 0)

    const egresosTotales = egresos.reduce((a, c) => a + c.amount, 0)
    const margenBruto = ventas.reduce((a, c) => a + c.profit, 0)
    const comisionesPagadas = ventas.filter(i => i.commissionStatus === "PAGADO").reduce((a, c) => a + c.commission, 0)
    const comisionesPendientes = ventas.filter(i => i.commissionStatus === "PENDIENTE" && i.commission > 0).reduce((a, c) => a + c.commission, 0)
    
    const flujoCajaNeto = (ingresosCobrados + ingresosAbonados) - egresosTotales - comisionesPagadas
    const margenOperativoPct = ingresosTotales > 0 ? ((margenBruto / ingresosTotales) * 100).toFixed(1) : "0.0"

    // ============================================================================
    // 5. MANEJADORES DE ARCHIVOS MÚLTIPLES
    // ============================================================================

    const handleMultipleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        Array.from(files).forEach(file => {
            if (file.size > 8 * 1024 * 1024) {
                alert(`⚠️ El archivo "${file.name}" supera los 8MB. Adjunta archivos optimizados.`)
                return
            }

            const reader = new FileReader()
            reader.onloadend = () => {
                const newAtt: FinanceAttachment = {
                    id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
                    name: file.name,
                    size: `${(file.size / 1024).toFixed(0)} KB`,
                    type: file.type || "application/octet-stream",
                    dataUrl: reader.result as string,
                    uploadedAt: new Date().toISOString()
                }
                setFormAttachments(prev => [...prev, newAtt])
            }
            reader.readAsDataURL(file)
        })
    }

    const removeFormAttachment = (id: string) => {
        setFormAttachments(prev => prev.filter(a => a.id !== id))
    }

    // ============================================================================
    // 6. APERTURA DE MODAL Y PLANTILLAS RÁPIDAS
    // ============================================================================

    const handleOpenModal = (item?: Transaction, mode: "INGRESO" | "EGRESO" | "ASIGNAR_PAGO" | "DEUDA" = "INGRESO") => {
        setIsSubmitting(false)
        setSubmitStatus("idle")
        setStatusMessage("")

        if (item) {
            setEditingItem(item)
            setFormData(item)
            const meta = item.meta || parseProofMetadata(item.proofUrl)
            setFormExercise(meta.exercise || "2026")
            setFormPeriod(meta.period || "Q4")
            setFormCostCenter(meta.costCenter || "Operaciones & Oficina")
            setFormPaymentMethod(meta.paymentMethod || "Transferencia Banco Pichincha")
            setFormBankReference(meta.bankReference || "")
            setFormPaymentTarget(meta.paymentTarget || item.client)
            setFormAttachments(meta.attachments || [])
            setHasCommission(item.commission > 0)

            const isDebt = isDebtItem(item)
            const isEgreso = isEgresoItem(item.type || "")
            setEntryMode(isDebt ? "DEUDA" : (meta.isPaymentAssigned ? "ASIGNAR_PAGO" : (isEgreso ? "EGRESO" : "INGRESO")))

            if (meta.debtDetails) {
                setDebtDueDate(meta.debtDetails.dueDate || "")
                setDebtInitialPaid(meta.debtDetails.paidAmount || 0)
                setDebtNotes(meta.debtDetails.collectionNotes || "")
                setDebtType((meta.debtDetails.debtType as any) || "CLIENTE_VENTA")
            } else {
                setDebtDueDate(item.date ? new Date(item.date).toISOString().split('T')[0] : "")
                setDebtInitialPaid(0)
                setDebtNotes("")
                setDebtType("CLIENTE_VENTA")
            }

            if (meta.taxDetails) {
                setEnableTaxBreakdown(true)
                setTaxSubtotal15(meta.taxDetails.subtotal15)
                setTaxSubtotal0(meta.taxDetails.subtotal0)
                setTaxRetentionIncome(meta.taxDetails.retentionIncome)
                setTaxRetentionVat(meta.taxDetails.retentionVat)
            } else {
                setEnableTaxBreakdown(false)
            }
        } else {
            setEditingItem(null)
            setEntryMode(mode)
            setFormAttachments([])
            setEnableTaxBreakdown(false)
            setTaxSubtotal15(0)
            setTaxSubtotal0(0)
            setTaxRetentionIncome(0)
            setTaxRetentionVat(0)
            setFormExercise("2026")
            setFormPeriod("Q4")
            setFormCostCenter(mode === "EGRESO" ? "Servidores, Cloud & Dominios" : mode === "DEUDA" ? "Servidores, Cloud & Dominios" : "Operaciones & Oficina")
            setFormPaymentMethod("Transferencia Banco Pichincha")
            setFormBankReference("")
            setFormPaymentTarget("")
            setHasCommission(false)
            setCommissionPercent(10)
            setCommissionDueDate("")

            // Debt defaults
            setDebtDueDate(new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
            setDebtInitialPaid(0)
            setDebtNotes("")
            setDebtType(mode === "DEUDA" ? "PROYECTO_SOFTWARE" : "CLIENTE_VENTA")

            const defaultType = mode === "EGRESO" 
                ? "Egreso Operativo" 
                : mode === "ASIGNAR_PAGO" 
                    ? "Egreso Proveedor" 
                    : mode === "DEUDA"
                        ? "Deuda por Cobrar"
                        : "Venta Directa"

            setFormData({
                client: mode === "DEUDA" ? "" : mode === "EGRESO" ? "PAGO SERVIDORES / SOFT 3" : mode === "ASIGNAR_PAGO" ? "PAGO PROVEEDOR" : "",
                date: new Date().toISOString().split('T')[0],
                amount: 0,
                cost: 0,
                pvp: 0,
                commission: 0,
                bonus: 0,
                quoteNumber: "",
                status: mode === "EGRESO" || mode === "ASIGNAR_PAGO" ? "PAGADO" : "PENDIENTE",
                commissionStatus: "PENDIENTE",
                type: defaultType,
                salespersonId: isAdmin ? "" : session?.user?.id || ""
            })
        }
        setIsModalOpen(true)
    }

    // Plantilla con 1 clic: Caso Sr. Rómulo / Soft 3
    const handlePreloadRomuloSoft3Debt = () => {
        setEntryMode("DEUDA")
        setFormData(prev => ({
            ...prev,
            client: "SOFTRES SISTEMAS / SR. RÓMULO",
            amount: 850.00,
            pvp: 850.00,
            type: "Deuda por Cobrar",
            quoteNumber: "Módulos Soft 3 - Servidores y Dominios Migración",
            status: "PENDIENTE",
            date: "2026-10-07"
        }))
        setDebtDueDate("2026-10-07")
        setDebtInitialPaid(0)
        setDebtType("PROYECTO_SOFTWARE")
        setFormCostCenter("Servidores, Cloud & Dominios")
        setDebtNotes("Mora crítica acumulada de 43+ días (desde el Miércoles 7 de Octubre de 2026). Valor comprometido expresamente para servidores y dominios multi-tenant. En chat del 17/11/2026 indicó: 'finalicemos ahí tenemos que cobrar para pagarle a ust'. Condicionar cada entrega técnica a abonos bancarios.")
    }

    // Speech de Cobranza formal para copiar con 1 clic
    const handleCopyDebtSpeech = (trx: Transaction) => {
        const meta = trx.meta || parseProofMetadata(trx.proofUrl)
        const targetDueDate = meta.debtDetails?.dueDate || trx.date
        const days = calculateDaysOverdue(targetDueDate, trx.date)
        const balance = meta.debtDetails?.remainingBalance !== undefined ? meta.debtDetails.remainingBalance : (trx.pvp || trx.amount)

        const speech = `Estimado(a) ${trx.client},\n\nLe saludamos cordialmente desde la Dirección Financiera de ATOMIC Industries / ATOMIC Electronics.\n\nLe contactamos para dar seguimiento al saldo pendiente de *$${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD* por concepto de: *${trx.quoteNumber || trx.type}*.\n\n📅 Fecha de compromiso de pago acordada: *${targetDueDate ? new Date(targetDueDate).toLocaleDateString() : 'Pendiente'}* (${days > 0 ? `⚠️ Lleva ${days} días de retraso en mora` : 'Próxima a vencer'}).\n\nFavor hacernos llegar el comprobante de transferencia a nuestras cuentas corporativas autorizadas:\n🏦 Banco Pichincha - Cuenta Corriente ATOMIC\n🏦 Banco Produbanco - Cuenta Corriente ATOMIC\n\nQuedamos a la espera de su confirmación para conciliar su estado de cuenta. Muchas gracias.`

        navigator.clipboard.writeText(speech)
        setCopiedSpeechTrxId(trx.id)
        setTimeout(() => setCopiedSpeechTrxId(null), 3500)
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.client || formData.client.trim() === "") {
            setSubmitStatus("error")
            setStatusMessage("Debes especificar el cliente, deudor o proveedor.")
            return
        }

        if (!formData.amount || formData.amount <= 0) {
            setSubmitStatus("error")
            setStatusMessage("El monto registrado debe ser mayor a 0.")
            return
        }

        setIsSubmitting(true)
        setSubmitStatus("idle")
        setStatusMessage("")

        // Build Tax Breakdown if enabled
        let taxDetails: TaxBreakdown | undefined = undefined
        if (enableTaxBreakdown) {
            const vat = taxSubtotal15 * 0.15
            const net = (taxSubtotal15 + taxSubtotal0 + vat) - taxRetentionIncome - taxRetentionVat
            taxDetails = {
                subtotal15: taxSubtotal15,
                subtotal0: taxSubtotal0,
                vatAmount: vat,
                retentionIncome: taxRetentionIncome,
                retentionVat: taxRetentionVat,
                totalNet: net
            }
        }

        // Build Debt Details if Deuda mode
        let debtDetails: DebtDetails | undefined = undefined
        if (entryMode === "DEUDA") {
            const total = formData.amount || 0
            const paid = debtInitialPaid || 0
            const rem = Math.max(0, total - paid)
            const days = calculateDaysOverdue(debtDueDate, formData.date)
            const risk: "CORRIENTE" | "MEDIO" | "CRITICO" = days >= 40 ? "CRITICO" : days >= 15 ? "MEDIO" : "CORRIENTE"

            debtDetails = {
                isDebt: true,
                dueDate: debtDueDate || formData.date || new Date().toISOString().split('T')[0],
                daysOverdue: days,
                initialAmount: total,
                paidAmount: paid,
                remainingBalance: rem,
                riskLevel: risk,
                debtType,
                collectionNotes: debtNotes
            }
        }

        // Build rich metadata
        const metadata: FinanceMetadata = {
            attachments: formAttachments,
            exercise: formExercise,
            period: formPeriod,
            costCenter: formCostCenter,
            paymentMethod: formPaymentMethod,
            bankReference: formBankReference,
            paymentTarget: formPaymentTarget || formData.client || "",
            isPaymentAssigned: entryMode === "ASIGNAR_PAGO",
            paymentAssignmentType: entryMode === "ASIGNAR_PAGO" ? "PROVEEDOR" : "CLIENTE",
            taxDetails,
            debtDetails
        }

        const resolvedStatus = entryMode === "DEUDA" 
            ? (debtInitialPaid > 0 ? (debtInitialPaid >= (formData.amount || 0) ? "PAGADO" : "ABONADO") : "PENDIENTE")
            : formData.status

        const resolvedType = entryMode === "DEUDA" ? "Deuda por Cobrar" : formData.type

        const payload: any = {
            ...formData,
            status: resolvedStatus,
            type: resolvedType,
            pvp: formData.pvp || formData.amount,
            profit: isAdmin ? ((formData.pvp || formData.amount || 0) - (formData.cost || 0)) : 0,
            commission: hasCommission ? (formData.commission || 0) : 0,
            metadata,
            proofUrl: JSON.stringify(metadata)
        }

        try {
            const url = editingItem ? `/api/finance/${editingItem.id}` : "/api/finance"
            const method = editingItem ? "PUT" : "POST"

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })

            if (res.ok) {
                const resp = await res.json()
                const savedTrx = resp.transaction || resp

                // Auto-ticket if commission
                if (hasCommission && payload.commission > 0 && payload.salespersonId && !editingItem) {
                    try {
                        const dueDate = commissionDueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                        await fetch("/api/finance/tickets", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                advisorId: payload.salespersonId,
                                amount: payload.commission,
                                dueDate,
                                issueDate: payload.date || new Date().toISOString().split('T')[0],
                                concept: `Comisión por venta - ${payload.client} | TRX: ${savedTrx?.trxId || 'N/A'}`
                            })
                        })
                    } catch (ticketErr) {}
                }

                setSubmitStatus("success")
                setStatusMessage(
                    entryMode === "DEUDA"
                        ? "¡Deuda por cobrar registrada exitosamente en el sistema de cartera!"
                        : (editingItem ? "¡Transacción contable actualizada con éxito!" : "¡Registro contable guardado exitosamente en Finanzas!")
                )

                await fetchTransactions()

                setTimeout(() => {
                    setIsModalOpen(false)
                    setIsSubmitting(false)
                    setSubmitStatus("idle")
                    setStatusMessage("")
                }, 1600)
            } else {
                const errData = await res.json().catch(() => ({ error: "Error en el servidor al guardar la transacción" }))
                setSubmitStatus("error")
                setStatusMessage(errData.error || "Fallo en el servidor al guardar los datos.")
                setIsSubmitting(false)
            }
        } catch (err: any) {
            setSubmitStatus("error")
            setStatusMessage("Fallo de red al enviar la transacción. Tus datos permanecen en pantalla para reintentar.")
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!isAdmin) return
        if (confirm("⚠️ Confirmación Crítica: ¿Desactivar este registro contable? Quedará marcado como CANCELADO como evidencia histórica.")) {
            try {
                const res = await fetch(`/api/finance/${id}`, { method: "DELETE" })
                if (res.ok) fetchTransactions()
            } catch (e) {}
        }
    }

    // ============================================================================
    // 7. ASIGNACIÓN RÁPIDA DE PAGOS & CONCILIACIÓN
    // ============================================================================

    const handleExecuteQuickPayment = async () => {
        if (!quickAssignTrx) return
        if (quickAssignAmount <= 0) {
            alert("Ingresa un monto de pago válido.")
            return
        }

        try {
            const currentMeta = quickAssignTrx.meta || parseProofMetadata(quickAssignTrx.proofUrl)
            const updatedAttachments = [...(currentMeta.attachments || [])]
            if (quickAssignAttachment) {
                updatedAttachments.push(quickAssignAttachment)
            }

            const isTotal = quickAssignAmount >= quickAssignTrx.amount
            const newStatus = isTotal ? "PAGADO" : "ABONADO"

            // Update remaining balance if debt
            let updatedDebtDetails = currentMeta.debtDetails
            if (updatedDebtDetails) {
                const newPaid = (updatedDebtDetails.paidAmount || 0) + quickAssignAmount
                const newRem = Math.max(0, updatedDebtDetails.initialAmount - newPaid)
                updatedDebtDetails = {
                    ...updatedDebtDetails,
                    paidAmount: newPaid,
                    remainingBalance: newRem
                }
            }

            const updatedMeta: FinanceMetadata = {
                ...currentMeta,
                attachments: updatedAttachments,
                paymentMethod: quickAssignBank,
                bankReference: quickAssignRef || currentMeta.bankReference,
                isPaymentAssigned: true,
                paymentTarget: quickAssignTrx.client,
                debtDetails: updatedDebtDetails
            }

            const res = await fetch(`/api/finance/${quickAssignTrx.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    status: newStatus,
                    metadata: updatedMeta,
                    proofUrl: JSON.stringify(updatedMeta)
                })
            })

            if (res.ok) {
                alert(`✅ Pago / Abono asignado con éxito a ${quickAssignTrx.client} (${newStatus}).`)
                setQuickAssignTrx(null)
                setQuickAssignAttachment(null)
                setQuickAssignRef("")
                fetchTransactions()
            }
        } catch (e) {
            alert("Error al asignar el pago.")
        }
    }

    // ============================================================================
    // 8. EXPORTACIÓN PROFESIONAL A EXCEL / CSV
    // ============================================================================

    const handleExportCSV = () => {
        if (filteredData.length === 0) {
            alert("No hay transacciones para exportar con los filtros actuales.")
            return
        }

        const headers = [
            "TRX ID", "Ejercicio Fiscal", "Periodo", "Fecha", "Cliente / Beneficiario",
            "Concepto / Cotizacion", "Tipo Transaccion", "Centro de Costos", "Metodo de Pago",
            "Referencia Bancaria", "Monto PVP ($)", "Costo ($)", "Margen Bruto ($)",
            "Comision ($)", "Estado Cobro", "Dias de Mora", "Saldo Pendiente", "Asesor Responsable", "Num Adjuntos"
        ]

        const rows = filteredData.map(t => {
            const meta = t.meta || parseProofMetadata(t.proofUrl)
            const targetDueDate = meta.debtDetails?.dueDate || t.date
            const days = calculateDaysOverdue(targetDueDate, t.date)
            const rem = meta.debtDetails?.remainingBalance !== undefined ? meta.debtDetails.remainingBalance : (t.pvp || t.amount)

            return [
                t.trxId,
                meta.exercise || "2026",
                meta.period || "Q4",
                new Date(t.date).toLocaleDateString(),
                `"${(t.client || '').replace(/"/g, '""')}"`,
                `"${(t.quoteNumber || '').replace(/"/g, '""')}"`,
                `"${(t.type || '').replace(/"/g, '""')}"`,
                `"${(meta.costCenter || '').replace(/"/g, '""')}"`,
                `"${(meta.paymentMethod || '').replace(/"/g, '""')}"`,
                `"${(meta.bankReference || '').replace(/"/g, '""')}"`,
                (t.pvp || t.amount).toFixed(2),
                t.cost.toFixed(2),
                t.profit.toFixed(2),
                t.commission.toFixed(2),
                t.status,
                days,
                rem.toFixed(2),
                `"${(t.salesperson?.name || '').replace(/"/g, '""')}"`,
                meta.attachments?.length || 0
            ].join(",")
        })

        const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\r\n")
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.setAttribute("href", url)
        link.setAttribute("download", `Atomic_Reporte_Financiero_${new Date().toISOString().split('T')[0]}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    // ============================================================================
    // 9. RENDERIZADO VISUAL
    // ============================================================================

    return (
        <div className="space-y-8">
            
            {/* ── BARRA SUPERIOR DE PESTAÑAS (TABS CFO) ── */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                    <button
                        onClick={() => setActiveTab("TRANSACTIONS")}
                        className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
                            activeTab === "TRANSACTIONS"
                                ? "bg-white text-indigo-700 shadow-sm border border-slate-200"
                                : "text-slate-600 hover:text-slate-900"
                        }`}
                    >
                        <Layers size={15} />
                        <span>Flujo de Caja</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("DEBTS")}
                        className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 relative ${
                            activeTab === "DEBTS"
                                ? "bg-amber-500 text-white shadow-md shadow-amber-500/20"
                                : "text-amber-800 hover:text-amber-950 hover:bg-amber-100/50"
                        }`}
                    >
                        <AlertTriangle size={15} />
                        <span>Deudas por Cobrar (Cartera)</span>
                        {openDebts.length > 0 && (
                            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-black ${
                                activeTab === "DEBTS" ? "bg-white text-amber-600" : "bg-amber-200 text-amber-900"
                            }`}>
                                {openDebts.length}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab("PAYMENT_ASSIGNMENT")}
                        className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
                            activeTab === "PAYMENT_ASSIGNMENT"
                                ? "bg-white text-indigo-700 shadow-sm border border-slate-200"
                                : "text-slate-600 hover:text-slate-900"
                        }`}
                    >
                        <CreditCard size={15} />
                        <span>Asignador de Pagos</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("EXERCISE_BUDGET")}
                        className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
                            activeTab === "EXERCISE_BUDGET"
                                ? "bg-white text-indigo-700 shadow-sm border border-slate-200"
                                : "text-slate-600 hover:text-slate-900"
                        }`}
                    >
                        <Building2 size={15} />
                        <span>Presupuestos</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("TICKETS")}
                        className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
                            activeTab === "TICKETS"
                                ? "bg-white text-indigo-700 shadow-sm border border-slate-200"
                                : "text-slate-600 hover:text-slate-900"
                        }`}
                    >
                        <Receipt size={15} />
                        <span>Tickets</span>
                    </button>
                </div>

                <div className="flex items-center gap-2.5">
                    {/* Botón directo para registrar Deuda por Cobrar */}
                    <button
                        onClick={() => handleOpenModal(undefined, "DEUDA")}
                        className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl text-xs font-bold shadow-md shadow-amber-500/20 flex items-center gap-2 cursor-pointer transition-all hover:scale-102"
                    >
                        <AlertTriangle size={15} />
                        <span>+ Registrar Deuda por Cobrar</span>
                    </button>

                    <button
                        onClick={handleExportCSV}
                        className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-sm hover:bg-slate-800 transition-all flex items-center gap-2 cursor-pointer"
                        title="Exportar a Microsoft Excel / CSV con UTF-8"
                    >
                        <Download size={14} />
                        <span>Excel</span>
                    </button>
                    <button
                        onClick={fetchTransactions}
                        className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-indigo-600 hover:border-indigo-300 transition-all shadow-sm cursor-pointer"
                        title="Actualizar datos"
                    >
                        <RefreshCw size={15} className={loading ? "animate-spin text-indigo-600" : ""} />
                    </button>
                </div>
            </div>

            {/* ── TAB 1: FLUJO DE CAJA & TRANSACCIONES ── */}
            {activeTab === "TRANSACTIONS" && (
                <>
                    {/* Filtros avanzados */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
                        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
                            {/* Búsqueda */}
                            <div className="relative flex-1 group">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={17} />
                                <input
                                    type="text"
                                    placeholder="Buscar por TRX, Cliente, Deudor, Proveedor, Cotización, Referencia bancaria..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition-all placeholder:text-slate-400"
                                />
                            </div>

                            {/* Botones de Acción */}
                            <div className="flex flex-wrap items-center gap-2">
                                <button
                                    onClick={() => handleOpenModal(undefined, "DEUDA")}
                                    className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                                >
                                    <Clock size={16} />
                                    <span>Deuda por Cobrar</span>
                                </button>

                                {isAdmin && (
                                    <>
                                        <button
                                            onClick={() => handleOpenModal(undefined, "INGRESO")}
                                            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                                        >
                                            <ArrowUpRight size={16} />
                                            <span>Registrar Venta</span>
                                        </button>
                                        <button
                                            onClick={() => handleOpenModal(undefined, "EGRESO")}
                                            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                                        >
                                            <ArrowDownRight size={16} />
                                            <span>Gasto Operativo</span>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Barra de filtros secundarios */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100 text-xs">
                            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
                                <span className="font-bold text-slate-400">Ejercicio:</span>
                                <select
                                    value={exerciseFilter}
                                    onChange={(e) => setExerciseFilter(e.target.value)}
                                    className="bg-transparent font-bold text-slate-700 outline-none w-full cursor-pointer"
                                >
                                    <option value="TODOS">Todos los Ejercicios</option>
                                    {FISCAL_EXERCISES.map(y => <option key={y} value={y}>Ejercicio {y}</option>)}
                                </select>
                            </div>

                            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
                                <span className="font-bold text-slate-400">Periodo:</span>
                                <select
                                    value={periodFilter}
                                    onChange={(e) => setPeriodFilter(e.target.value)}
                                    className="bg-transparent font-bold text-slate-700 outline-none w-full cursor-pointer"
                                >
                                    <option value="TODOS">Histórico Total</option>
                                    <option value="MENSUAL">Mes en Curso</option>
                                    <option value="TRIMESTRAL">Trimestre Actual</option>
                                    <option value="ANUAL">Año 2026</option>
                                </select>
                            </div>

                            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
                                <span className="font-bold text-slate-400">Centro:</span>
                                <select
                                    value={costCenterFilter}
                                    onChange={(e) => setCostCenterFilter(e.target.value)}
                                    className="bg-transparent font-bold text-slate-700 outline-none w-full truncate cursor-pointer"
                                >
                                    <option value="TODOS">Todos los Centros</option>
                                    {COST_CENTERS.map(c => <option key={c.id} value={c.name}>{c.icon} {c.name}</option>)}
                                </select>
                            </div>

                            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
                                <span className="font-bold text-slate-400">Tipo:</span>
                                <select
                                    value={typeFilter}
                                    onChange={(e) => setTypeFilter(e.target.value as any)}
                                    className="bg-transparent font-bold text-slate-700 outline-none w-full cursor-pointer"
                                >
                                    <option value="TODOS">Todos los Flujos</option>
                                    <option value="DEUDAS">Solo Deudas por Cobrar</option>
                                    <option value="INGRESOS">Solo Ingresos (Ventas)</option>
                                    <option value="EGRESOS">Solo Gastos / OPEX</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* CFO KPI Dashboard Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
                        <KPICard label="Ingresos Totales" value={ingresosTotales} trend="Facturado Bruto" icon={<DollarSign size={18} />} color="indigo" />
                        <KPICard label="Cobrado en Banco" value={ingresosCobrados + ingresosAbonados} trend="Liquidez Recibida" icon={<ArrowUpRight size={18} />} color="emerald" />
                        <KPICard 
                            label="Deudas por Cobrar" 
                            value={cuentasPorCobrar} 
                            trend={`${openDebts.length} clientes pendientes`} 
                            icon={<Clock size={18} />} 
                            color="amber" 
                        />
                        <KPICard 
                            label="Mora Crítica (+30d)" 
                            value={totalMoraCritica} 
                            trend={moraCriticaDeudas.length > 0 ? `⚠️ ${moraCriticaDeudas.length} en mora (Soft 3)` : "Al día"} 
                            icon={<AlertTriangle size={18} />} 
                            color={totalMoraCritica > 0 ? "rose" : "emerald"} 
                        />
                        <KPICard label="Gastos de Ejercicio" value={egresosTotales} trend="OPEX + Servidores" icon={<ArrowDownRight size={18} />} color="rose" />
                        <KPICard label="Flujo de Caja Neto" value={flujoCajaNeto} trend={`Margen: ${margenOperativoPct}%`} icon={<Target size={18} />} color="emerald" />
                    </div>

                    {/* Tabla de Transacciones Contables */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse whitespace-nowrap text-xs">
                                <thead>
                                    <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                        <th className="px-4 py-3.5">Fecha</th>
                                        <th className="px-4 py-3.5">TRX ID</th>
                                        <th className="px-4 py-3.5">Tipo / Cartera</th>
                                        <th className="px-4 py-3.5">Cliente / Deudor</th>
                                        <th className="px-4 py-3.5">Concepto / Cotización</th>
                                        <th className="px-4 py-3.5">Compromiso / Mora</th>
                                        <th className="px-4 py-3.5 text-center">Estado</th>
                                        <th className="px-4 py-3.5 text-right">Monto Original</th>
                                        <th className="px-4 py-3.5 text-right">Saldo Pendiente</th>
                                        <th className="px-4 py-3.5 text-center">Evidencias</th>
                                        <th className="px-4 py-3.5 text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                                    {filteredData.map((item) => {
                                        const meta = item.meta || parseProofMetadata(item.proofUrl)
                                        const isEgreso = isEgresoItem(item.type)
                                        const isDebt = isDebtItem(item)
                                        const isCancelled = item.status === "CANCELADO"
                                        const attCount = meta.attachments?.length || 0

                                        const targetDueDate = meta.debtDetails?.dueDate || item.date
                                        const daysOverdue = calculateDaysOverdue(targetDueDate, item.date)
                                        const remainingBalance = meta.debtDetails?.remainingBalance !== undefined ? meta.debtDetails.remainingBalance : (item.pvp || item.amount)

                                        return (
                                            <tr key={item.id} className={`hover:bg-slate-50/80 transition-colors group ${isCancelled ? "opacity-40 bg-slate-50 line-through" : ""}`}>
                                                <td className="px-4 py-3 text-slate-500 font-mono text-[11px]">
                                                    {new Date(item.date).toLocaleDateString()}
                                                </td>
                                                <td className="px-4 py-3 font-mono font-bold text-indigo-600">
                                                    {item.trxId}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                                        isDebt ? "bg-amber-100 text-amber-900 border border-amber-300" :
                                                        isEgreso ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-800"
                                                    }`}>
                                                        {item.type}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="font-bold text-slate-900 truncate max-w-[140px]" title={item.client}>
                                                        {item.client}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="truncate max-w-[160px] text-slate-600 font-medium" title={item.quoteNumber || "—"}>
                                                        {item.quoteNumber || "—"}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    {isDebt && (item.status === "PENDIENTE" || item.status === "ABONADO") ? (
                                                        <div className="flex items-center gap-1.5">
                                                            {daysOverdue > 0 ? (
                                                                <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 font-mono font-bold text-[10px] flex items-center gap-1">
                                                                    <AlertTriangle size={10} />
                                                                    <span>{daysOverdue}d mora</span>
                                                                </span>
                                                            ) : (
                                                                <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 font-mono text-[10px] font-bold">
                                                                    Al día
                                                                </span>
                                                            )}
                                                            <span className="text-slate-400 text-[10px]">vence: {new Date(targetDueDate).toLocaleDateString()}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-slate-400 font-mono text-[11px]">—</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                                        item.status === 'PAGADO' ? 'bg-emerald-100 text-emerald-800' :
                                                        item.status === 'ABONADO' ? 'bg-amber-100 text-amber-800' :
                                                        item.status === 'PENDIENTE' ? 'bg-rose-100 text-rose-700' :
                                                        'bg-slate-200 text-slate-600'
                                                    }`}>
                                                        {item.status === 'PAGADO' ? 'Cobrado' : item.status === 'ABONADO' ? 'Abonado' : item.status === 'PENDIENTE' ? 'Por Cobrar' : 'Cancelado'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                                                    {isEgreso ? (
                                                        <span className="text-rose-600">-${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                                                    ) : (
                                                        `$${(item.pvp || item.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-right font-mono font-bold">
                                                    {isDebt && (item.status === "PENDIENTE" || item.status === "ABONADO") ? (
                                                        <span className="text-amber-700 font-black">${remainingBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                                                    ) : (
                                                        <span className="text-slate-400 font-normal">$0.00</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    {attCount > 0 ? (
                                                        <button
                                                            onClick={() => setViewingAttachments({ trxId: item.trxId, client: item.client, attachments: meta.attachments, meta })}
                                                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[10px] transition-colors cursor-pointer"
                                                            title="Ver y descargar evidencias"
                                                        >
                                                            <Paperclip size={11} />
                                                            <span>{attCount}</span>
                                                        </button>
                                                    ) : (
                                                        <span className="text-slate-300 text-[11px]">—</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex items-center justify-end gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                                                        {isDebt && (item.status === "PENDIENTE" || item.status === "ABONADO") && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleCopyDebtSpeech(item)}
                                                                    className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                                                                    title="Copiar speech formal de cobranza para WhatsApp"
                                                                >
                                                                    {copiedSpeechTrxId === item.id ? <CheckCheck size={13} className="text-emerald-600" /> : <MessageSquare size={13} />}
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        setQuickAssignTrx(item)
                                                                        setQuickAssignAmount(remainingBalance)
                                                                        setQuickAssignRef(meta.bankReference || "")
                                                                    }}
                                                                    className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                                                                    title="Registrar Abono o Cobro Total"
                                                                >
                                                                    Cobrar
                                                                </button>
                                                            </>
                                                        )}
                                                        {isAdmin && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleOpenModal(item)}
                                                                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                                                                    title="Editar registro"
                                                                >
                                                                    <Edit3 size={14} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(item.id)}
                                                                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                                                    title="Desactivar registro"
                                                                >
                                                                    <Ban size={14} />
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                            {filteredData.length === 0 && (
                                <div className="p-12 text-center text-slate-400">
                                    <p className="font-bold text-sm">No se encontraron transacciones contables con los filtros seleccionados.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}

            {/* ── TAB 2: GESTOR ESPECIALIZADO DE CARTERA & DEUDAS POR COBRAR ── */}
            {activeTab === "DEBTS" && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-base font-black text-slate-900">Control de Cartera & Deudas por Cobrar (Accounts Receivable)</h3>
                                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold font-mono">
                                    {openDebts.length} cuentas abiertas
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">Monitorea deudas de clientes y empresas deudoras, días de mora en tiempo real, garantías, abonos y speches de cobranza.</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handlePreloadRomuloSoft3Debt}
                                className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                                title="Precargar la deuda de Soft 3 (Sr. Rómulo) de 43 días en mora"
                            >
                                <AlertTriangle size={14} />
                                <span>⚡ Cargar Caso Rómulo / Soft 3</span>
                            </button>
                            <button
                                onClick={() => handleOpenModal(undefined, "DEUDA")}
                                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                            >
                                <Plus size={15} />
                                <span>Registrar Nueva Deuda</span>
                            </button>
                        </div>
                    </div>

                    {/* Resumen de Aging de Cartera */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
                            <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">Cartera Total Pendiente</span>
                            <p className="text-2xl font-black text-amber-900 mt-1 font-mono">${cuentasPorCobrar.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                            <span className="text-[10px] text-amber-600 font-medium">Suma de saldos de todas las deudas</span>
                        </div>
                        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block">Mora Crítica (+30 / +43 Días)</span>
                                <AlertTriangle size={14} className="text-rose-600" />
                            </div>
                            <p className="text-2xl font-black text-rose-700 mt-1 font-mono">${totalMoraCritica.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                            <span className="text-[10px] text-rose-600 font-bold">{moraCriticaDeudas.length} cliente(s) en mora severa (ej. Soft 3)</span>
                        </div>
                        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Abonos Recuperados</span>
                            <p className="text-2xl font-black text-emerald-700 mt-1 font-mono">${ingresosAbonados.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                            <span className="text-[10px] text-emerald-600 font-medium">Cobros parciales ingresados a banco</span>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Cuentas Gestionadas</span>
                            <p className="text-2xl font-black text-slate-900 mt-1 font-mono">{allDebts.length}</p>
                            <span className="text-[10px] text-slate-500 font-medium">{allDebts.filter(d => d.status === "PAGADO").length} deudas ya liquidadas</span>
                        </div>
                    </div>

                    {/* Tabla de Deudas por Cobrar */}
                    <div className="rounded-xl border border-slate-200 overflow-hidden">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                <tr>
                                    <th className="px-4 py-3">TRX ID</th>
                                    <th className="px-4 py-3">Deudor / Cliente</th>
                                    <th className="px-4 py-3">Concepto de la Deuda</th>
                                    <th className="px-4 py-3">Compromiso de Pago</th>
                                    <th className="px-4 py-3 text-center">Días de Mora</th>
                                    <th className="px-4 py-3 text-right">Monto Inicial</th>
                                    <th className="px-4 py-3 text-right">Saldo Pendiente</th>
                                    <th className="px-4 py-3 text-center">Estado</th>
                                    <th className="px-4 py-3 text-right">Acciones de Cobro</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                                {openDebts.map(debt => {
                                    const meta = debt.meta || parseProofMetadata(debt.proofUrl)
                                    const targetDueDate = meta.debtDetails?.dueDate || debt.date
                                    const days = calculateDaysOverdue(targetDueDate, debt.date)
                                    const balance = meta.debtDetails?.remainingBalance !== undefined ? meta.debtDetails.remainingBalance : (debt.pvp || debt.amount)
                                    const isSoft3 = debt.client.toLowerCase().includes("romulo") || debt.client.toLowerCase().includes("rómulo") || debt.client.toLowerCase().includes("softres")

                                    return (
                                        <tr key={debt.id} className={`hover:bg-slate-50/80 transition-colors ${isSoft3 ? "bg-rose-50/30" : ""}`}>
                                            <td className="px-4 py-3 font-mono font-bold text-indigo-600">{debt.trxId}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="font-bold text-slate-900">{debt.client}</span>
                                                    {isSoft3 && (
                                                        <span className="px-1.5 py-0.2 rounded bg-rose-100 text-rose-700 text-[9px] font-black uppercase">
                                                            Mora 43+d
                                                        </span>
                                                    )}
                                                </div>
                                                {meta.debtDetails?.collectionNotes && (
                                                    <p className="text-[10px] text-slate-400 truncate max-w-[200px]" title={meta.debtDetails.collectionNotes}>
                                                        Nota: {meta.debtDetails.collectionNotes}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-slate-600">
                                                <div className="truncate max-w-[180px]" title={debt.quoteNumber || "—"}>
                                                    {debt.quoteNumber || "Deuda por cobrar"}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 font-mono text-slate-600">
                                                {targetDueDate ? new Date(targetDueDate).toLocaleDateString() : "Sin fecha"}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {days >= 30 ? (
                                                    <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold font-mono text-[10px] flex items-center justify-center gap-1">
                                                        <AlertTriangle size={11} />
                                                        <span>{days} días mora</span>
                                                    </span>
                                                ) : days > 0 ? (
                                                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold font-mono text-[10px]">
                                                        {days} días mora
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold font-mono text-[10px]">
                                                        Al día
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-right font-mono text-slate-500">
                                                ${(debt.pvp || debt.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="px-4 py-3 text-right font-mono font-black text-rose-700 text-sm">
                                                ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                                                    debt.status === "ABONADO" ? "bg-amber-100 text-amber-800" : "bg-rose-100 text-rose-700"
                                                }`}>
                                                    {debt.status === "ABONADO" ? "Abonado" : "Pendiente"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        onClick={() => handleCopyDebtSpeech(debt)}
                                                        className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                                                        title="Copiar texto formal de cobranza para WhatsApp"
                                                    >
                                                        {copiedSpeechTrxId === debt.id ? (
                                                            <>
                                                                <CheckCheck size={12} className="text-emerald-600" />
                                                                <span className="text-emerald-700">¡Copiado!</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <MessageSquare size={12} />
                                                                <span>Speech</span>
                                                            </>
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setQuickAssignTrx(debt)
                                                            setQuickAssignAmount(balance)
                                                            setQuickAssignRef(meta.bankReference || "")
                                                        }}
                                                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold transition-colors cursor-pointer shadow-xs"
                                                    >
                                                        Abonar
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                        {openDebts.length === 0 && (
                            <div className="p-8 text-center text-slate-400">
                                <p className="font-bold text-sm">No existen deudas por cobrar pendientes registradas.</p>
                                <p className="text-xs text-slate-400 mt-0.5">Puedes registrar una nueva deuda con el botón "+ Registrar Deuda por Cobrar".</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ── TAB 3: ASIGNADOR DE PAGOS & BANCOS ── */}
            {activeTab === "PAYMENT_ASSIGNMENT" && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <div>
                            <h3 className="text-base font-black text-slate-900">Asignador de Pagos & Conciliación Bancaria</h3>
                            <p className="text-xs text-slate-500">Asigna salidas de dinero y pagos a proveedores, anticipos a asesores o cobra facturas de clientes con respaldo bancario.</p>
                        </div>
                        <button
                            onClick={() => handleOpenModal(undefined, "ASIGNAR_PAGO")}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                        >
                            <Plus size={15} />
                            <span>Nuevo Pago Asignado</span>
                        </button>
                    </div>

                    <div className="rounded-xl border border-slate-200 overflow-hidden">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                <tr>
                                    <th className="px-4 py-3">Fecha</th>
                                    <th className="px-4 py-3">Beneficiario / Proveedor</th>
                                    <th className="px-4 py-3">Concepto</th>
                                    <th className="px-4 py-3">Método / Banco</th>
                                    <th className="px-4 py-3"># Referencia</th>
                                    <th className="px-4 py-3 text-right">Monto Pagado</th>
                                    <th className="px-4 py-3 text-center">Evidencias</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                                {egresos.map(item => {
                                    const meta = item.meta || parseProofMetadata(item.proofUrl)
                                    return (
                                        <tr key={item.id} className="hover:bg-slate-50/60">
                                            <td className="px-4 py-2.5 font-mono text-slate-500">{new Date(item.date).toLocaleDateString()}</td>
                                            <td className="px-4 py-2.5 font-bold text-slate-900">{item.client}</td>
                                            <td className="px-4 py-2.5 text-slate-600">{item.quoteNumber || "Pago Asignado"}</td>
                                            <td className="px-4 py-2.5 text-slate-500">{meta.paymentMethod}</td>
                                            <td className="px-4 py-2.5 font-mono text-slate-500">{meta.bankReference || "—"}</td>
                                            <td className="px-4 py-2.5 text-right font-mono font-bold text-rose-600">${item.amount.toLocaleString()}</td>
                                            <td className="px-4 py-2.5 text-center">
                                                {meta.attachments?.length > 0 ? (
                                                    <button
                                                        onClick={() => setViewingAttachments({ trxId: item.trxId, client: item.client, attachments: meta.attachments, meta })}
                                                        className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-bold hover:bg-indigo-100"
                                                    >
                                                        {meta.attachments.length} comprobante(s)
                                                    </button>
                                                ) : <span className="text-slate-300">—</span>}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ── TAB 4: CONTROL PRESUPUESTARIO DE EJERCICIO ── */}
            {activeTab === "EXERCISE_BUDGET" && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
                    <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                        <div>
                            <h3 className="text-base font-black text-slate-900">Control de Gastos por Ejercicio Fiscal & Centros de Costo</h3>
                            <p className="text-xs text-slate-500">Visualiza la ejecución presupuestaria de cada departamento para el Ejercicio {exerciseFilter === "TODOS" ? "2026" : exerciseFilter}.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {COST_CENTERS.map(center => {
                            const centerExpenses = egresos.filter(e => (e.meta?.costCenter || "").toLowerCase().includes(center.name.toLowerCase().substring(0, 8)))
                            const totalCenter = centerExpenses.reduce((a, c) => a + c.amount, 0)
                            const estimatedBudget = 2500
                            const pct = Math.min(Math.round((totalCenter / estimatedBudget) * 100), 100)

                            return (
                                <div key={center.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl">{center.icon}</span>
                                            <div>
                                                <h4 className="text-xs font-bold text-slate-900">{center.name}</h4>
                                                <span className="text-[10px] text-slate-400">{centerExpenses.length} registro(s) contables</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-sm font-black text-slate-900">${totalCenter.toLocaleString()}</span>
                                            <span className="block text-[10px] text-slate-400">Gastado</span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${
                                                pct > 80 ? "bg-rose-500" : pct > 50 ? "bg-amber-500" : "bg-emerald-500"
                                            }`}
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* ── TAB 5: TICKETS DE COMISIÓN ── */}
            {activeTab === "TICKETS" && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <PaymentTickets />
                </div>
            )}

            {/* ============================================================================
                MODAL PRINCIPAL: REGISTRO CONTABLE & DEUDAS POR COBRAR
            ============================================================================ */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-150">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 15 }}
                            className="bg-white w-full max-w-4xl shadow-2xl border border-slate-200 rounded-3xl overflow-hidden flex flex-col max-h-[92vh]"
                        >
                            {/* Modal Header */}
                            <div className="p-5 border-b border-slate-200 flex justify-between items-center" style={{
                                background: entryMode === "DEUDA"
                                    ? "linear-gradient(135deg, #fffbeb 0%, #ffffff 100%)"
                                    : entryMode === "EGRESO" 
                                        ? "linear-gradient(135deg, #fff5f5 0%, #ffffff 100%)" 
                                        : entryMode === "ASIGNAR_PAGO"
                                            ? "linear-gradient(135deg, #eef2ff 0%, #ffffff 100%)"
                                            : "linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)"
                            }}>
                                <div className="flex items-center gap-3.5">
                                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-md ${
                                        entryMode === "DEUDA"
                                            ? "bg-amber-100 text-amber-700"
                                            : entryMode === "EGRESO" 
                                                ? "bg-rose-100 text-rose-600" 
                                                : entryMode === "ASIGNAR_PAGO"
                                                    ? "bg-indigo-100 text-indigo-600"
                                                    : "bg-emerald-100 text-emerald-600"
                                    }`}>
                                        {entryMode === "DEUDA" ? <AlertTriangle size={22} /> : entryMode === "EGRESO" ? <ArrowDownRight size={22} /> : entryMode === "ASIGNAR_PAGO" ? <CreditCard size={22} /> : <ArrowUpRight size={22} />}
                                    </div>
                                    <div>
                                        <h3 className="text-base font-black text-slate-900">
                                            {editingItem 
                                                ? `Editar Registro: ${editingItem.trxId}` 
                                                : entryMode === "DEUDA"
                                                    ? "Registrar Deuda por Cobrar (Cartera & Compromisos)"
                                                    : entryMode === "EGRESO" 
                                                        ? "Registrar Gasto de Ejercicio / Salida" 
                                                        : entryMode === "ASIGNAR_PAGO"
                                                            ? "Asignar Pago Directo a Proveedor / Colaborador"
                                                            : "Registrar Venta / Cobro de Cliente"}
                                        </h3>
                                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                                            {entryMode === "DEUDA"
                                                ? "Cuentas por Cobrar — Control de Vencimientos y Cartera en Mora"
                                                : entryMode === "EGRESO" 
                                                    ? "Salida de Dinero — OPEX, Servidores o Servicios" 
                                                    : entryMode === "ASIGNAR_PAGO"
                                                        ? "Conciliación Bancaria y Asignación de Comprobantes"
                                                        : "Entrada de Dinero — Facturación y Cobranzas"}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Modal Form */}
                            <form onSubmit={handleSave} className="p-6 space-y-6 overflow-y-auto custom-scrollbar text-xs">
                                
                                {/* Feedback Notifications inside Modal */}
                                {submitStatus === "error" && (
                                    <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-800 flex items-start gap-3">
                                        <AlertCircle className="w-5 h-5 text-rose-600 mt-0.5 shrink-0" />
                                        <div className="flex-1">
                                            <h4 className="font-bold text-rose-900">Error al procesar el registro</h4>
                                            <p className="text-[11px] text-rose-700 mt-0.5">{statusMessage}</p>
                                        </div>
                                    </div>
                                )}

                                {submitStatus === "success" && (
                                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-400 text-emerald-900 flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                                        <div className="flex-1">
                                            <h4 className="font-bold text-emerald-900">✅ ¡REGISTRO CONTABLE GUARDADO CON ÉXITO!</h4>
                                            <p className="text-[11px] text-emerald-700 mt-0.5">{statusMessage}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Selector de Modo si es nuevo */}
                                {!editingItem && (
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 bg-slate-100 rounded-2xl">
                                        <button
                                            type="button"
                                            onClick={() => setEntryMode("DEUDA")}
                                            className={`py-2 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 ${
                                                entryMode === "DEUDA" ? "bg-amber-500 text-white shadow-sm" : "text-amber-800 hover:text-amber-950"
                                            }`}
                                        >
                                            <AlertTriangle size={13} />
                                            <span>Deuda por Cobrar</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setEntryMode("INGRESO")}
                                            className={`py-2 rounded-xl font-bold transition-all ${
                                                entryMode === "INGRESO" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500 hover:text-slate-800"
                                            }`}
                                        >
                                            🟢 Ingreso / Venta
                                        </button>
                                        {isAdmin && (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={() => setEntryMode("EGRESO")}
                                                    className={`py-2 rounded-xl font-bold transition-all ${
                                                        entryMode === "EGRESO" ? "bg-white text-rose-700 shadow-sm" : "text-slate-500 hover:text-slate-800"
                                                    }`}
                                                >
                                                    🔴 Gasto Ejercicio
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setEntryMode("ASIGNAR_PAGO")}
                                                    className={`py-2 rounded-xl font-bold transition-all ${
                                                        entryMode === "ASIGNAR_PAGO" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-500 hover:text-slate-800"
                                                    }`}
                                                >
                                                    🔵 Asignar Pago
                                                </button>
                                            </>
                                        )}
                                    </div>
                                )}

                                {/* ACCIÓN RÁPIDA: PRECARGAR CASO RÓMULO SOFT 3 */}
                                {entryMode === "DEUDA" && (
                                    <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl">⚠️</span>
                                            <div>
                                                <h5 className="font-bold text-amber-950 text-xs">¿Deseas registrar la deuda del Sr. Rómulo / Soft 3?</h5>
                                                <p className="text-[10px] text-amber-800">43+ días en mora acumulados por servidores y dominios de migración multi-tenant.</p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handlePreloadRomuloSoft3Debt}
                                            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-[11px] font-bold shadow-xs transition-all shrink-0 cursor-pointer"
                                        >
                                            ⚡ Autocompletar Caso Rómulo
                                        </button>
                                    </div>
                                )}

                                {/* SECCIÓN 1: DATOS GENERALES Y DEUDOR */}
                                <div className="space-y-4">
                                    <h4 className="font-black text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1.5 text-slate-500">
                                        <Building2 size={13} className="text-indigo-600" />
                                        <span>1. Identificación del Deudor & Cartera</span>
                                    </h4>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase">Ejercicio Fiscal</label>
                                            <select
                                                value={formExercise}
                                                onChange={(e) => setFormExercise(e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 font-bold text-slate-800 outline-none"
                                            >
                                                {FISCAL_EXERCISES.map(y => <option key={y} value={y}>Ejercicio {y}</option>)}
                                            </select>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase">Período / Trimestre</label>
                                            <select
                                                value={formPeriod}
                                                onChange={(e) => setFormPeriod(e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 font-bold text-slate-800 outline-none"
                                            >
                                                <option value="Q1">Q1 (Enero - Marzo)</option>
                                                <option value="Q2">Q2 (Abril - Junio)</option>
                                                <option value="Q3">Q3 (Julio - Septiembre)</option>
                                                <option value="Q4">Q4 (Octubre - Diciembre)</option>
                                            </select>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase">Centro de Costo</label>
                                            <select
                                                value={formCostCenter}
                                                onChange={(e) => setFormCostCenter(e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 font-bold text-slate-800 outline-none"
                                            >
                                                {COST_CENTERS.map(c => <option key={c.id} value={c.name}>{c.icon} {c.name}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-slate-600 uppercase">
                                                {entryMode === "DEUDA" ? "Cliente Deudor / Empresa Morosa" : entryMode === "EGRESO" ? "Proveedor" : "Cliente"}
                                            </label>
                                            <input
                                                required
                                                value={formData.client}
                                                onChange={(e) => setFormData({ ...formData, client: e.target.value.toUpperCase() })}
                                                placeholder={entryMode === "DEUDA" ? "Ej: SOFTRES SISTEMAS / SR. RÓMULO" : "Nombre del cliente o proveedor"}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 font-bold text-slate-900 outline-none focus:border-indigo-500 focus:bg-white"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-slate-600 uppercase">Fecha de Emisión / Adquisición</label>
                                            <input
                                                type="date"
                                                required
                                                value={formData.date}
                                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 font-bold text-slate-900 outline-none"
                                            />
                                        </div>
                                    </div>

                                    {/* Concepto */}
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-600 uppercase">Concepto / Glosa de la Deuda</label>
                                        <input
                                            value={formData.quoteNumber || ""}
                                            onChange={(e) => setFormData({ ...formData, quoteNumber: e.target.value })}
                                            placeholder="Ej: Servidores de migración Soft 3 / Factura impaga 001-002"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 font-medium text-slate-800 outline-none focus:border-indigo-500"
                                        />
                                    </div>
                                </div>

                                {/* SECCIÓN 2: CONTROL DE VENCIMIENTO & MORA (EXCLUSIVO DEUDAS) */}
                                {entryMode === "DEUDA" && (
                                    <div className="space-y-4 pt-3 border-t border-slate-100">
                                        <h4 className="font-black text-amber-900 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                                            <Clock size={13} className="text-amber-600" />
                                            <span>2. Compromiso de Pago & Semáforo de Cartera</span>
                                        </h4>

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-slate-600 uppercase">Fecha Límite / Compromiso</label>
                                                <input
                                                    type="date"
                                                    required
                                                    value={debtDueDate}
                                                    onChange={e => setDebtDueDate(e.target.value)}
                                                    className="w-full bg-amber-50/70 border border-amber-300 rounded-xl py-2 px-3 font-bold text-amber-900 outline-none"
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-slate-600 uppercase">Tipo de Deuda</label>
                                                <select
                                                    value={debtType}
                                                    onChange={e => setDebtType(e.target.value as any)}
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 font-bold text-slate-800 outline-none"
                                                >
                                                    <option value="CLIENTE_VENTA">Venta Comercial / Equipos</option>
                                                    <option value="PROYECTO_SOFTWARE">Proyecto Software (Soft 3 / ERP)</option>
                                                    <option value="PRESTAMO_INTERNO">Préstamo / Anticipo</option>
                                                    <option value="PROVEEDOR">Saldo Proveedor / Mayorista</option>
                                                    <option value="OTRO">Otro Compromiso</option>
                                                </select>
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-slate-600 uppercase">Días de Mora en Vivo</label>
                                                <div className="w-full bg-slate-100 border border-slate-200 rounded-xl py-2 px-3 font-mono font-black text-xs flex items-center gap-2">
                                                    {calculateDaysOverdue(debtDueDate, formData.date) >= 30 ? (
                                                        <span className="text-rose-700 flex items-center gap-1">
                                                            <AlertTriangle size={12} />
                                                            <span>{calculateDaysOverdue(debtDueDate, formData.date)} DÍAS EN MORA CRÍTICA</span>
                                                        </span>
                                                    ) : calculateDaysOverdue(debtDueDate, formData.date) > 0 ? (
                                                        <span className="text-amber-700">
                                                            {calculateDaysOverdue(debtDueDate, formData.date)} DÍAS VENCIDOS
                                                        </span>
                                                    ) : (
                                                        <span className="text-emerald-700">🟢 DENTRO DEL PLAZO (AL DÍA)</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Acuerdos y speech */}
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-slate-600 uppercase">Speech / Acuerdos de Cobranza Registrados</label>
                                            <textarea
                                                rows={2}
                                                value={debtNotes}
                                                onChange={e => setDebtNotes(e.target.value)}
                                                placeholder="Ej: Declaró que pagará al finalizar módulos. Se le notificó que la entrega se condiciona a abonos bancarios..."
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-medium text-slate-800 outline-none focus:border-indigo-500"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* SECCIÓN 3: MONTOS Y SALDO PENDIENTE */}
                                <div className="space-y-4 pt-3 border-t border-slate-100">
                                    <h4 className="font-black text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1.5 text-slate-500">
                                        <DollarSign size={13} className="text-emerald-600" />
                                        <span>3. Monto de la Deuda & Saldo Pendiente</span>
                                    </h4>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-slate-600 uppercase">Monto Total de la Deuda ($ USD)</label>
                                            <input
                                                type="number"
                                                required
                                                min="0"
                                                step="0.01"
                                                value={formData.amount}
                                                onChange={(e) => {
                                                    const val = parseFloat(e.target.value) || 0
                                                    setFormData({ ...formData, amount: val, pvp: val })
                                                }}
                                                className="w-full bg-amber-50/70 border border-amber-300 rounded-xl py-2.5 px-3.5 font-mono text-lg font-black text-amber-900 outline-none"
                                                placeholder="0.00"
                                            />
                                        </div>

                                        {entryMode === "DEUDA" ? (
                                            <>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-emerald-700 uppercase">Abono Inicial Recibido ($)</label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        value={debtInitialPaid}
                                                        onChange={(e) => setDebtInitialPaid(parseFloat(e.target.value) || 0)}
                                                        className="w-full bg-emerald-50 border border-emerald-200 rounded-xl py-2.5 px-3.5 font-mono text-base font-bold text-emerald-700 outline-none"
                                                        placeholder="0.00"
                                                    />
                                                </div>

                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-rose-700 uppercase">Saldo Pendiente de Cobro ($)</label>
                                                    <div className="w-full bg-rose-50 border border-rose-300 rounded-xl py-2.5 px-3.5 font-mono text-lg font-black text-rose-700">
                                                        ${Math.max(0, (formData.amount || 0) - debtInitialPaid).toFixed(2)}
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            isAdmin && entryMode === "INGRESO" && (
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-rose-600 uppercase">Costo Operación ($)</label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        value={formData.cost}
                                                        onChange={e => setFormData({ ...formData, cost: parseFloat(e.target.value) || 0 })}
                                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 font-mono font-bold"
                                                    />
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>

                                {/* SECCIÓN 4: GESTOR DE MÚLTIPLES ADJUNTOS */}
                                <div className="space-y-3 pt-3 border-t border-slate-100">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-black text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1.5 text-slate-500">
                                            <Paperclip size={13} className="text-indigo-600" />
                                            <span>4. Garantías & Adjuntos (Pagarés, Contratos, Facturas, Chats de Compromiso)</span>
                                        </h4>
                                        <span className="text-[10px] font-mono text-slate-400 font-bold">
                                            {formAttachments.length} archivo(s) listos
                                        </span>
                                    </div>

                                    <label className="cursor-pointer bg-slate-50 border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-2xl p-5 transition-all flex flex-col items-center justify-center gap-1.5 group">
                                        <Upload className="text-slate-400 group-hover:text-indigo-600 group-hover:scale-110 transition-all" size={24} />
                                        <span className="text-xs font-bold text-slate-700">
                                            Adjuntar pagaré, cotización formal, captura de chat o contrato firmado
                                        </span>
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*,.pdf,.doc,.docx"
                                            onChange={handleMultipleFiles}
                                            className="hidden"
                                        />
                                    </label>

                                    {formAttachments.length > 0 && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                                            {formAttachments.map((att) => (
                                                <div key={att.id} className="p-2.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-2 shadow-xs">
                                                    <div className="flex items-center gap-2 min-w-0">
                                                        <span>{att.type.includes("pdf") ? "📄" : "🖼️"}</span>
                                                        <div className="min-w-0">
                                                            <p className="font-bold text-slate-800 text-[11px] truncate max-w-[190px]">{att.name}</p>
                                                            <span className="text-[9px] text-slate-400 font-mono">{att.size}</span>
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeFormAttachment(att.id)}
                                                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                                                    >
                                                        <X size={15} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Botón Guardar */}
                                <div className="pt-4 border-t border-slate-100">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || submitStatus === "success"}
                                        className={`w-full text-white font-bold py-3.5 rounded-2xl text-xs shadow-lg transition-all flex items-center justify-center gap-2.5 ${
                                            submitStatus === "success"
                                                ? "bg-emerald-600 cursor-default"
                                                : isSubmitting
                                                    ? "bg-indigo-400 cursor-wait opacity-80"
                                                    : entryMode === "DEUDA"
                                                        ? "bg-amber-600 hover:bg-amber-700 shadow-amber-500/20 cursor-pointer"
                                                        : entryMode === "EGRESO"
                                                            ? "bg-rose-600 hover:bg-rose-700 shadow-rose-500/20 cursor-pointer"
                                                            : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20 cursor-pointer"
                                        }`}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 size={16} className="animate-spin" />
                                                <span>PROCESANDO EN CARTERA...</span>
                                            </>
                                        ) : submitStatus === "success" ? (
                                            <>
                                                <Check size={16} />
                                                <span>¡REGISTRADO CON ÉXITO!</span>
                                            </>
                                        ) : (
                                            <>
                                                <Save size={16} />
                                                <span>{entryMode === "DEUDA" ? "REGISTRAR DEUDA EN CARTERA" : "GUARDAR EN FINANZAS"}</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ============================================================================
                MODAL LIGHTBOX: VISOR DE MÚLTIPLES ADJUNTOS
            ============================================================================ */}
            <AnimatePresence>
                {viewingAttachments && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]"
                        >
                            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                                <div>
                                    <h3 className="font-black text-slate-900 text-sm">
                                        Evidencias & Adjuntos: {viewingAttachments.trxId}
                                    </h3>
                                    <p className="text-[11px] text-slate-500">{viewingAttachments.client} • {viewingAttachments.attachments.length} archivo(s)</p>
                                </div>
                                <button
                                    onClick={() => { setViewingAttachments(null); setActivePreviewDoc(null) }}
                                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="p-5 overflow-y-auto space-y-4">
                                {activePreviewDoc ? (
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-xs text-slate-700 truncate max-w-[300px]">{activePreviewDoc.name}</span>
                                            <button
                                                onClick={() => setActivePreviewDoc(null)}
                                                className="text-xs text-indigo-600 font-bold hover:underline"
                                            >
                                                ← Volver a lista
                                            </button>
                                        </div>
                                        <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-100 flex items-center justify-center max-h-[50vh]">
                                            {activePreviewDoc.type.includes("pdf") ? (
                                                <iframe src={activePreviewDoc.dataUrl} className="w-full h-[45vh]" title="PDF Preview" />
                                            ) : (
                                                <img src={activePreviewDoc.dataUrl} alt={activePreviewDoc.name} className="max-h-[45vh] object-contain" />
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {viewingAttachments.attachments.map((att, i) => (
                                            <div key={att.id || i} className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100/80 transition-all flex flex-col justify-between gap-3">
                                                <div className="flex items-start gap-2.5">
                                                    <span className="text-2xl">{att.type.includes("pdf") ? "📄" : "🖼️"}</span>
                                                    <div className="min-w-0">
                                                        <h5 className="font-bold text-xs text-slate-800 truncate" title={att.name}>{att.name}</h5>
                                                        <span className="text-[10px] text-slate-400 font-mono block">{att.size}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 pt-1 border-t border-slate-200/60">
                                                    <button
                                                        onClick={() => setActivePreviewDoc(att)}
                                                        className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                                                    >
                                                        <Eye size={12} />
                                                        <span>Ver</span>
                                                    </button>
                                                    <a
                                                        href={att.dataUrl}
                                                        download={att.name}
                                                        className="px-2.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                                                    >
                                                        <Download size={12} />
                                                    </a>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ============================================================================
                MODAL RÁPIDO: REGISTRAR ABONO O COBRO
            ============================================================================ */}
            <AnimatePresence>
                {quickAssignTrx && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4 text-xs"
                        >
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <div>
                                    <h4 className="font-black text-slate-900 text-sm">Registrar Pago / Abono de Cartera</h4>
                                    <p className="text-[11px] text-slate-500 font-mono">{quickAssignTrx.trxId} • {quickAssignTrx.client}</p>
                                </div>
                                <button onClick={() => setQuickAssignTrx(null)} className="text-slate-400 hover:text-slate-700">
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 block uppercase">Monto Recibido en Banco ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={quickAssignAmount}
                                        onChange={e => setQuickAssignAmount(parseFloat(e.target.value) || 0)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono text-base font-black text-emerald-700 outline-none"
                                    />
                                    <span className="text-[10px] text-slate-400">Total de la deuda: ${(quickAssignTrx.pvp || quickAssignTrx.amount).toFixed(2)}</span>
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 block uppercase">Cuenta Bancaria Receptora</label>
                                    <select
                                        value={quickAssignBank}
                                        onChange={e => setQuickAssignBank(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-bold text-slate-800"
                                    >
                                        {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 block uppercase"># Comprobante / Transferencia</label>
                                    <input
                                        value={quickAssignRef}
                                        onChange={e => setQuickAssignRef(e.target.value)}
                                        placeholder="Ej: TRANSF-891023"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-mono font-bold"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 block uppercase">Comprobante Bancario de Abono</label>
                                    <input
                                        type="file"
                                        accept="image/*,.pdf"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0]
                                            if (file) {
                                                const r = new FileReader()
                                                r.onloadend = () => {
                                                    setQuickAssignAttachment({
                                                        id: `att-bank-${Date.now()}`,
                                                        name: file.name,
                                                        size: `${(file.size / 1024).toFixed(0)} KB`,
                                                        type: file.type || "image/jpeg",
                                                        dataUrl: r.result as string,
                                                        uploadedAt: new Date().toISOString()
                                                    })
                                                }
                                                r.readAsDataURL(file)
                                            }
                                        }}
                                        className="w-full text-[11px] text-slate-500"
                                    />
                                    {quickAssignAttachment && (
                                        <span className="text-[10px] font-bold text-emerald-600 block mt-1">✓ {quickAssignAttachment.name}</span>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={handleExecuteQuickPayment}
                                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer"
                            >
                                Conciliar y Aplicar Abono a Deuda
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

// ── COMPONENTE TARJETA KPI CONTABLE ──
function KPICard({ label, value, trend, icon, color }: { label: string, value: number, trend: string, icon: React.ReactNode, color: "indigo" | "emerald" | "rose" | "amber" }) {
    const colorStyles = {
        indigo: "text-indigo-600 bg-indigo-50 border-indigo-100",
        emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
        rose: "text-rose-600 bg-rose-50 border-rose-100",
        amber: "text-amber-600 bg-amber-50 border-amber-100"
    }

    return (
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs relative overflow-hidden group hover:border-slate-300 transition-all">
            <div className="flex justify-between items-start mb-2.5">
                <div className={`p-2 rounded-xl border ${colorStyles[color]} transition-colors`}>
                    {icon}
                </div>
                <div className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider truncate max-w-[100px]" title={trend}>
                    {trend}
                </div>
            </div>
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{label}</h4>
            <p className="text-xl font-black text-slate-900 font-mono tracking-tight group-hover:text-indigo-600 transition-colors">
                ${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
            </p>
        </div>
    )
}
