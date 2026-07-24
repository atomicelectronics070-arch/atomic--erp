"use client"

import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSession } from "next-auth/react"
import {
    Plus, Search, Edit3, Trash2, Filter,
    DollarSign, Calendar, Users,
    ChevronDown, X, Check, Save,
    ArrowUpRight, ArrowDownRight, Info, Clock,
    Target, Briefcase, FileText, PieChart,
    ExternalLink, Upload, ShieldCheck, AlertCircle,
    TrendingUp, Ban
} from "lucide-react"

interface Transaction {
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
}

export default function FinanceManager() {
    const { data: session } = useSession()
    const isAdmin = session?.user?.role === "ADMIN" || session?.user?.role === "MANAGEMENT"
    
    const [data, setData] = useState<Transaction[]>([])
    const [users, setUsers] = useState<{id: string, name: string}[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [periodFilter, setPeriodFilter] = useState("TODOS")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<Transaction | null>(null)
    const [hasCommission, setHasCommission] = useState(false)
    const [commissionDueDate, setCommissionDueDate] = useState("")
    const [entryMode, setEntryMode] = useState<"INGRESO" | "EGRESO">("INGRESO")

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
        proofUrl: "",
        salespersonId: isAdmin ? "" : session?.user?.id || ""
    })
    const [commissionPercent, setCommissionPercent] = useState(10)

    useEffect(() => {
        fetchTransactions()
        if (isAdmin) fetchUsers()
    }, [isAdmin])

    const fetchTransactions = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/finance")
            if (res.ok) {
                const data = await res.json()
                setData(Array.isArray(data) ? data : [])
            }
        } catch (e) {
            console.error("Error loading transactions", e)
        } finally {
            setLoading(false)
        }
    }

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/users") 
            if (res.ok) {
                const data = await res.json()
                setUsers(data)
            }
        } catch (e) {
            console.error("Error loading users", e)
        }
    }

    const filteredData = useMemo(() => {
        const now = new Date()
        const currentYear = now.getFullYear()
        const currentMonth = now.getMonth()
        const currentQuarter = Math.floor(currentMonth / 3)

        return data.filter(item => {
            const itemDate = new Date(item.date)
            const matchesSearch = (item.trxId || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
                                 (item.client || "").toLowerCase().includes(searchTerm.toLowerCase())
            
            if (!matchesSearch) return false

            if (periodFilter === "ANUAL") {
                return itemDate.getFullYear() === currentYear
            }
            if (periodFilter === "TRIMESTRAL") {
                const itemQuarter = Math.floor(itemDate.getMonth() / 3)
                return itemDate.getFullYear() === currentYear && itemQuarter === currentQuarter
            }
            if (periodFilter === "MENSUAL") {
                return itemDate.getFullYear() === currentYear && itemDate.getMonth() === currentMonth
            }

            return true
        })
    }, [data, searchTerm, periodFilter])

    const activeData = filteredData.filter(i => i.status !== "CANCELADO")
    const EGRESO_TYPES = ["Egreso Operativo", "Egreso Comision"]
    const ventas = activeData.filter(i => !EGRESO_TYPES.includes(i.type))
    const egresos = activeData.filter(i => EGRESO_TYPES.includes(i.type))

    // Ingresos cobrados vs pendientes
    const ingresosCobrados = ventas.filter(i => i.status === "PAGADO").reduce((a,c) => a + c.amount, 0)
    const ingresosPendientes = ventas.filter(i => i.status === "PENDIENTE" || i.status === "ABONADO").reduce((a,c) => a + c.amount, 0)

    const totalSales = ventas.reduce((acc, curr) => acc + curr.amount, 0)
    const totalProfit = ventas.reduce((acc, curr) => acc + curr.profit, 0)
    const totalEgresos = egresos.reduce((acc, curr) => acc + curr.amount, 0)

    // Comisiones: separar pagadas vs pendientes
    const comisionesPagadas = ventas.filter(i => i.commissionStatus === "PAGADO").reduce((a,c) => a + c.commission, 0)
    const comisionesPendientes = ventas.filter(i => i.commissionStatus === "PENDIENTE" && i.commission > 0).reduce((a,c) => a + c.commission, 0)
    const totalCommission = comisionesPagadas + comisionesPendientes
    
    const netProfit = totalProfit - totalCommission - totalEgresos

    const handleOpenModal = (item?: Transaction, mode: "INGRESO" | "EGRESO" = "INGRESO") => {
        if (item) {
            setEditingItem(item)
            setFormData(item)
            setHasCommission(item.commission > 0)
            const isEgresoType = ["Egreso Operativo", "Egreso Comision"].includes(item.type || "")
            setEntryMode(isEgresoType ? "EGRESO" : "INGRESO")
        } else {
            setEditingItem(null)
            setEntryMode(mode)
            const defaultType = mode === "EGRESO" ? "Egreso Operativo" : "Ingreso Simple"
            setFormData({
                client: mode === "EGRESO" ? "GASTO OPERATIVO" : "",
                date: new Date().toISOString().split('T')[0],
                amount: 0,
                cost: 0,
                pvp: 0,
                commission: 0,
                bonus: 0,
                quoteNumber: "",
                status: mode === "EGRESO" ? "PAGADO" : "PENDIENTE",
                commissionStatus: "PENDIENTE",
                type: defaultType,
                proofUrl: "",
                salespersonId: isAdmin ? "" : session?.user?.id || ""
            })
            setCommissionPercent(10)
            setHasCommission(false)
            setCommissionDueDate("")
        }
        setIsModalOpen(true)
    }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, proofUrl: reader.result as string }))
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!isAdmin && !editingItem && !formData.proofUrl) {
            alert("⚠️ ERROR DE SEGURIDAD: Es obligatorio subir la cotización correspondiente para registrar una venta.")
            return
        }

        const payload = { ...formData }
        if (isAdmin) {
            payload.profit = (formData.pvp || formData.amount || 0) - (formData.cost || 0)
        }
        // If no commission, zero it out
        if (!hasCommission) {
            payload.commission = 0
            payload.commissionStatus = "PENDIENTE"
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
                const savedTrx = await res.json()
                // Auto-create payment ticket if hasCommission and asesor selected
                if (hasCommission && payload.commission && (payload.commission > 0) && payload.salespersonId && !editingItem) {
                    const dueDate = commissionDueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                    await fetch("/api/finance/tickets", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            advisorId: payload.salespersonId,
                            amount: payload.commission,
                            dueDate,
                            issueDate: payload.date || new Date().toISOString().split('T')[0],
                            concept: `Comisión por venta - ${payload.client} | TRX: ${savedTrx.trxId}`
                        })
                    })
                }
                fetchTransactions()
                setIsModalOpen(false)
            }
        } catch (e) {
            console.error("Error saving transaction", e)
        }
    }

    const handleApprove = async (item: Transaction) => {
        if (!isAdmin) return
        handleOpenModal(item) 
    }

    const handleDelete = async (id: string) => {
        if (!isAdmin) return
        if (confirm("⚠️ Confirmación Crítica: ¿Desactivar este registro? La transacción pasará a estado CANCELADO pero quedará como evidencia.")) {
            try {
                const res = await fetch(`/api/finance/${id}`, { method: "DELETE" })
                if (res.ok) fetchTransactions()
            } catch (e) {
                console.error("Error deleting transaction", e)
            }
        }
    }

    return (
        <div className="space-y-8">
            {/* Period Filters and Search */}
            <div className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.3)] border border-slate-200 p-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-1.5 rounded-lg border border-slate-200">
                    {(["TODOS", "ANUAL", "TRIMESTRAL", "MENSUAL"] as const).map(p => (
                        <button 
                            key={p}
                            onClick={() => setPeriodFilter(p)}
                            className={`px-6 py-2 text-xs font-bold transition-all rounded-md ${periodFilter === p ? 'bg-slate-900/50 backdrop-blur-xl border-slate-700/50 text-indigo-600 shadow-[0_4px_15px_rgba(0,0,0,0.3)] border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            {p === "TODOS" ? "HISTÓRICO" : p}
                        </button>
                    ))}
                </div>

                <div className="flex flex-col md:flex-row items-center gap-3 w-full lg:w-auto">
                    <div className="relative w-full md:w-72 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar transacción o cliente..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-900/50 backdrop-blur-xl border-slate-700/50 border border-slate-200 rounded-lg py-2.5 pl-10 pr-4 text-sm font-medium text-[#0F172A] outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-400"
                        />
                    </div>
                    {isAdmin && (
                        <>
                            <button
                                onClick={() => handleOpenModal(undefined, "INGRESO")}
                                className="w-full md:w-auto bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-[0_4px_15px_rgba(0,0,0,0.3)]"
                            >
                                <ArrowUpRight size={18} />
                                <span>Registrar Ingreso</span>
                            </button>
                            <button
                                onClick={() => handleOpenModal(undefined, "EGRESO")}
                                className="w-full md:w-auto bg-rose-600 text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-rose-700 transition-all shadow-[0_4px_15px_rgba(0,0,0,0.3)]"
                            >
                                <ArrowDownRight size={18} />
                                <span>Registrar Egreso</span>
                            </button>
                        </>
                    )}
                    {!isAdmin && (
                        <button
                            onClick={() => handleOpenModal(undefined, "INGRESO")}
                            className="w-full md:w-auto bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-[0_4px_15px_rgba(0,0,0,0.3)]"
                        >
                            <Plus size={18} />
                            <span>Registrar Venta</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Summary Stats - 6 cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <StatSummary label="Ingreso Total" value={totalSales} icon={<DollarSign size={20} />} trend="Bruto PVP" color="indigo" />
                <StatSummary label="Cobrado" value={ingresosCobrados} icon={<ArrowUpRight size={20} />} trend="Clientes PAGADOS" color="emerald" />
                <StatSummary label="Por Cobrar" value={ingresosPendientes} icon={<Clock size={20} />} trend="Pendiente/Abonado" color="rose" />
                <StatSummary label="Egresos" value={totalEgresos} icon={<ArrowDownRight size={20} />} trend="Gastos Operativos" color="rose" />
                <StatSummary label="Comis. Pend." value={comisionesPendientes} icon={<AlertCircle size={20} />} trend="Por pagar asesores" color="rose" />
                <StatSummary label="Beneficio Neto" value={netProfit} icon={<Target size={20} />} trend="Caja Fuerte" color="emerald" />
            </div>

            {/* Data Table */}
            <div className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.3)] border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-500 uppercase">
                                <th className="px-4 py-4">Fecha</th>
                                <th className="px-4 py-4">TRX</th>
                                <th className="px-4 py-4">Cliente</th>
                                <th className="px-4 py-4">Concepto / Descripción</th>
                                <th className="px-4 py-4">Tipo</th>
                                <th className="px-4 py-4">Asesor</th>
                                <th className="px-4 py-4 text-center">Cliente ✓</th>
                                <th className="px-4 py-4 text-right">Monto PVP</th>
                                <th className="px-4 py-4 text-right">Costo</th>
                                <th className="px-4 py-4 text-right">Margen</th>
                                <th className="px-4 py-4 text-right">Comisión</th>
                                <th className="px-4 py-4 text-center">Comis. ✓</th>
                                <th className="px-4 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredData.map((item) => {
                                const isEgreso = item.type === 'Egreso Operativo'
                                const isCancelled = item.status === 'CANCELADO'
                                return (
                                <tr key={item.id} className={`hover:bg-slate-50 transition-all group text-sm font-medium ${isCancelled ? 'text-slate-400 opacity-60 bg-slate-50 line-through' : 'text-[#0F172A]'}`}>
                                    <td className="px-4 py-3 text-slate-500 text-xs">
                                        {new Date(item.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3 font-bold text-indigo-600 text-xs">
                                        {item.trxId}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="truncate max-w-[120px] text-xs font-bold">{item.client}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="truncate max-w-[160px] text-xs text-slate-500">{item.quoteNumber || '—'}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                            isEgreso ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'
                                        }`}>
                                            {item.type}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="text-xs text-slate-500 truncate max-w-[100px]">
                                            {item.salesperson?.name || '—'}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        {!isEgreso && (
                                            <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                                                item.status === 'PAGADO' ? 'bg-emerald-100 text-emerald-700' :
                                                item.status === 'ABONADO' ? 'bg-amber-100 text-amber-700' :
                                                'bg-rose-100 text-rose-600'
                                            }`}>
                                                {item.status === 'PAGADO' ? 'Cerrado' : item.status === 'ABONADO' ? 'Abonado' : 'Abierto'}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-right font-bold text-sm">
                                        {isEgreso ? <span className="text-rose-600">-${item.amount.toLocaleString()}</span> : `$${(item.pvp || item.amount).toLocaleString()}`}
                                    </td>
                                    <td className="px-4 py-3 text-right text-rose-500 text-xs">
                                        {isEgreso ? '—' : `$${item.cost.toLocaleString()}`}
                                    </td>
                                    <td className={`px-4 py-3 text-right font-black text-sm ${isEgreso ? 'text-rose-600' : 'text-emerald-600'}`}>
                                        {isEgreso ? '' : `$${item.profit.toLocaleString()}`}
                                    </td>
                                    <td className="px-4 py-3 text-right text-indigo-600 font-bold text-sm">
                                        {item.commission > 0 ? `$${item.commission.toLocaleString()}` : '—'}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        {item.commission > 0 && (
                                            <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                                                item.commissionStatus === 'PAGADO' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                            }`}>
                                                {item.commissionStatus === 'PAGADO' ? 'Pagada' : 'Pendiente'}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                            {isAdmin && (
                                                <>
                                                    <button onClick={() => handleOpenModal(item)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                                        <Edit3 size={14} />
                                                    </button>
                                                    <button onClick={() => handleDelete(item.id)} title="Desactivar Registro" className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
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
                        <div className="p-8 text-center text-slate-400 font-medium">
                            No hay transacciones registradas en este período.
                        </div>
                    )}
                </div>
            </div>

            {/* CRUD Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
                            onClick={() => setIsModalOpen(false)} 
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 w-full max-w-4xl shadow-2xl border border-slate-200 overflow-hidden rounded-2xl relative z-10 flex flex-col max-h-[90vh]"
                        >
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center" style={{
                                background: entryMode === 'EGRESO' ? 'linear-gradient(135deg, #fff5f5 0%, #fff 100%)' : 'linear-gradient(135deg, #f0fdf4 0%, #fff 100%)'
                            }}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-[0_4px_15px_rgba(0,0,0,0.3)] ${
                                        entryMode === 'EGRESO' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'
                                    }`}>
                                        {entryMode === 'EGRESO' ? <ArrowDownRight size={24} /> : <ArrowUpRight size={24} />}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-[#0F172A] tracking-tight">
                                            {editingItem ? 'Editar Registro' : entryMode === 'EGRESO' ? 'Registrar Egreso / Salida' : 'Registrar Ingreso / Entrada'}
                                        </h3>
                                        <p className={`text-xs font-bold uppercase tracking-wider mt-1 ${
                                            entryMode === 'EGRESO' ? 'text-rose-400' : 'text-emerald-500'
                                        }`}>
                                            {entryMode === 'EGRESO' ? 'Salida de Dinero — Pago o Gasto' : 'Entrada de Dinero — Venta, Cobro o Ingreso'}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSave} className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
                                {/* ===== EGRESO FORM ===== */}
                                {entryMode === 'EGRESO' ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Concepto / Descripción del Egreso</label>
                                            <div className="relative group">
                                                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                <input
                                                    required
                                                    value={formData.quoteNumber || ""}
                                                    onChange={(e) => setFormData({ ...formData, quoteNumber: e.target.value })}
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 pl-12 pr-4 text-sm font-bold text-[#0F172A] focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20 outline-none transition-all"
                                                    placeholder="Ej: Pago proveedor, alquiler, viático..."
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Categoría</label>
                                            <select
                                                value={formData.type}
                                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 text-sm font-bold text-[#0F172A] outline-none h-[46px]"
                                            >
                                                <option value="Egreso Operativo">Gasto Operativo</option>
                                                <option value="Egreso Comision">Pago Comisión Asesor</option>
                                                <option value="Egreso Proveedor">Pago a Proveedor</option>
                                                <option value="Egreso Marketing">Marketing / Publicidad</option>
                                                <option value="Egreso Logistica">Logística / Envíos</option>
                                                <option value="Egreso Nomina">Nómina / Sueldos</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Fecha</label>
                                            <input
                                                type="date" required
                                                value={formData.date}
                                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 text-sm font-bold text-[#0F172A] outline-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-rose-600 uppercase tracking-wider ml-1">Monto ($)</label>
                                            <div className="relative">
                                                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-400" size={20} />
                                                <input
                                                    type="number" required min="0" step="0.01"
                                                    value={formData.amount}
                                                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                                                    className="w-full bg-rose-50 border border-rose-200 rounded-lg py-3 pl-12 pr-4 text-xl font-black text-rose-700 focus:border-rose-400 outline-none"
                                                    placeholder="0.00"
                                                />
                                            </div>
                                        </div>
                                        {isAdmin && (
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Responsable / Asesor (opcional)</label>
                                                <select
                                                    value={formData.salespersonId}
                                                    onChange={(e) => setFormData({ ...formData, salespersonId: e.target.value })}
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 text-sm font-bold text-[#0F172A] outline-none h-[46px]"
                                                >
                                                    <option value="">Sin asesor asignado</option>
                                                    {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                                                </select>
                                            </div>
                                        )}
                                        <div className="md:col-span-2 pt-4">
                                            <button
                                                type="submit"
                                                className="w-full bg-rose-600 text-white font-bold py-4 rounded-lg text-sm shadow-[0_8px_32px_rgba(0,0,0,0.5)] hover:bg-rose-700 transition-all flex items-center justify-center gap-3"
                                            >
                                                <ArrowDownRight size={20} />
                                                <span>REGISTRAR EGRESO</span>
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Cliente Final</label>
                                        <div className="relative group">
                                            <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                                            <input
                                                required
                                                disabled={!!(editingItem && !isAdmin)}
                                                value={formData.client}
                                                onChange={(e) => setFormData({ ...formData, client: e.target.value.toUpperCase() })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 pl-12 pr-4 text-sm font-bold text-[#0F172A] focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-slate-300 disabled:opacity-50 disabled:bg-slate-100"
                                                placeholder="Nombre del cliente..."
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Concepto / Referencia</label>
                                        <div className="relative group">
                                            <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input
                                                value={formData.quoteNumber || ""}
                                                onChange={(e) => setFormData({ ...formData, quoteNumber: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 pl-12 pr-4 text-sm font-bold text-[#0F172A] focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-slate-300"
                                                placeholder="Descripción, Nº cotización..."
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Tipo de Ingreso</label>
                                        <select
                                            disabled={!!(editingItem && !isAdmin)}
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 text-sm font-bold text-[#0F172A] outline-none h-[46px] disabled:opacity-50"
                                        >
                                            <option value="Ingreso Simple">Ingreso Simple</option>
                                            <option value="Ingreso con Comision">Ingreso con Comisión</option>
                                            <option value="Ingreso por Cobranza">Ingreso por Cobranza</option>
                                            <option value="Venta Directa">Venta Directa</option>
                                            <option value="Servicio">Servicio Profesional</option>
                                            <option value="Proyectos">Proyecto Integral</option>
                                        </select>
                                    </div>

                                    {isAdmin && (
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Asignar Asesor</label>
                                            <select
                                                value={formData.salespersonId}
                                                onChange={(e) => setFormData({ ...formData, salespersonId: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 text-sm font-bold text-[#0F172A] outline-none h-[46px]"
                                            >
                                                <option value="">Sin asesor</option>
                                                {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                                            </select>
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Fecha</label>
                                        <input
                                            type="date" required
                                            disabled={!!(editingItem && !isAdmin)}
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 text-sm font-bold text-[#0F172A] outline-none transition-all disabled:opacity-50"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-emerald-600 uppercase tracking-wider ml-1">Valor / PVP ($)</label>
                                        <div className="relative group">
                                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                            <input
                                                type="number"
                                                required
                                                disabled={!!(editingItem && !isAdmin)}
                                                value={formData.amount}
                                                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                                                className="w-full bg-emerald-50 border border-emerald-200 rounded-lg py-3 pl-12 pr-4 text-lg font-black text-emerald-700 focus:border-emerald-500 outline-none transition-all disabled:opacity-50"
                                            />
                                        </div>
                                    </div>

                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Cotización Correspondiente (PDF/Imagen)</label>
                                        <div className="flex flex-col sm:flex-row items-center gap-4">
                                            <label className="flex-1 w-full cursor-pointer bg-slate-50 border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-xl p-8 transition-all flex flex-col items-center justify-center gap-3">
                                                <Upload className="text-slate-400" size={32} />
                                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Clic o Arrastrar archivo aquí</span>
                                                <input type="file" className="hidden" accept="image/*,.pdf,.doc,.docx" onChange={handleFileUpload} />
                                            </label>
                                            {formData.proofUrl && (
                                                <div className="w-full sm:w-40 h-40 bg-emerald-50 rounded-xl border border-emerald-200 p-4 flex flex-col items-center justify-center gap-3 shrink-0">
                                                    <ShieldCheck className="text-emerald-500" size={32} />
                                                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider text-center">Archivo Listo</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {isAdmin && (
                                        <AnimatePresence>
                                            <motion.div 
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100 mt-2"
                                            >
                                                {/* Commission checkbox toggle */}
                                                <div className="md:col-span-2">
                                                    <label className="flex items-center gap-3 cursor-pointer group">
                                                        <div
                                                            onClick={() => setHasCommission(v => !v)}
                                                            className={`w-12 h-6 rounded-full transition-all relative flex-shrink-0 ${
                                                                hasCommission ? 'bg-indigo-600' : 'bg-slate-200'
                                                            }`}
                                                        >
                                                            <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-slate-900/50 backdrop-blur-xl border-slate-700/50 rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.3)] transition-transform ${
                                                                hasCommission ? 'translate-x-6' : 'translate-x-0'
                                                            }`} />
                                                        </div>
                                                        <div>
                                                            <span className="text-sm font-black text-[#0F172A]">Esta venta lleva comisión de asesor</span>
                                                            <p className="text-xs text-slate-400 font-medium">Activa para configurar comisión y generar ticket automático</p>
                                                        </div>
                                                    </label>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Gastos de Operación ($)</label>
                                                    <div className="relative">
                                                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-400" size={18} />
                                                        <input
                                                            type="number"
                                                            required
                                                            value={formData.cost}
                                                            onChange={(e) => {
                                                                const newCost = parseFloat(e.target.value) || 0
                                                                const pvp = formData.pvp || formData.amount || 0
                                                                const profit = pvp - newCost
                                                                const comm = hasCommission ? (profit * (commissionPercent / 100)) + (formData.bonus || 0) : 0
                                                                setFormData({ ...formData, cost: newCost, profit, commission: comm })
                                                            }}
                                                            className="w-full bg-rose-50/50 border border-rose-200 rounded-lg py-3 pl-12 pr-4 text-base font-black text-rose-600 focus:border-rose-400 outline-none"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-emerald-600 uppercase tracking-wider ml-1">Margen Bruto (Calculado)</label>
                                                    <div className="w-full bg-emerald-50 border border-emerald-200 rounded-lg py-3 px-4 text-xl font-black text-emerald-600">
                                                        ${(formData.profit || 0).toLocaleString()}
                                                    </div>
                                                </div>

                                                {hasCommission && (
                                                    <>
                                                        <div className="space-y-2">
                                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">% Comisión Asesor</label>
                                                            <select
                                                                value={commissionPercent}
                                                                onChange={(e) => {
                                                                    const pct = parseInt(e.target.value)
                                                                    setCommissionPercent(pct)
                                                                    const profit = formData.profit || 0
                                                                    const comm = (profit * (pct / 100)) + (formData.bonus || 0)
                                                                    setFormData({ ...formData, commission: comm })
                                                                }}
                                                                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 text-sm font-bold text-[#0F172A] outline-none h-[46px]"
                                                            >
                                                                {Array.from({length: 100}, (_, i) => i + 1).map(n => (
                                                                    <option key={n} value={n}>{n}% del Margen</option>
                                                                ))}
                                                            </select>
                                                        </div>

                                                        <div className="space-y-2">
                                                            <label className="text-xs font-bold text-indigo-600 uppercase tracking-wider ml-1">Bonificación Adicional ($)</label>
                                                            <div className="relative">
                                                                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400" size={18} />
                                                                <input
                                                                    type="number"
                                                                    value={formData.bonus}
                                                                    onChange={(e) => {
                                                                        const bonus = parseFloat(e.target.value) || 0
                                                                        const profit = formData.profit || 0
                                                                        const comm = (profit * (commissionPercent / 100)) + bonus
                                                                        setFormData({ ...formData, bonus, commission: comm })
                                                                    }}
                                                                    className="w-full bg-indigo-50/50 border border-indigo-200 rounded-lg py-3 pl-12 pr-4 text-base font-black text-indigo-600 focus:border-indigo-400 outline-none"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="space-y-2">
                                                            <label className="text-xs font-bold text-indigo-600 uppercase tracking-wider ml-1">Comisión Final Asesor</label>
                                                            <div className="w-full bg-indigo-50 border border-indigo-200 rounded-lg py-3 px-4 text-xl font-black text-indigo-700">
                                                                ${(formData.commission || 0).toLocaleString()}
                                                            </div>
                                                        </div>

                                                        <div className="space-y-2">
                                                            <label className="text-xs font-bold text-amber-600 uppercase tracking-wider ml-1">Vence Pago Comisión</label>
                                                            <input
                                                                type="date"
                                                                value={commissionDueDate}
                                                                onChange={e => setCommissionDueDate(e.target.value)}
                                                                className="w-full bg-amber-50 border border-amber-200 rounded-lg py-3 px-4 text-sm font-bold text-amber-700 focus:border-amber-400 outline-none transition-all"
                                                            />
                                                        </div>

                                                        <div className="space-y-2">
                                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Estado de Comisión</label>
                                                            <select
                                                                value={formData.commissionStatus}
                                                                onChange={(e) => setFormData({ ...formData, commissionStatus: e.target.value as any })}
                                                                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 text-sm font-bold text-[#0F172A] outline-none h-[46px]"
                                                            >
                                                                <option value="PENDIENTE">🟡 Comisión Pendiente</option>
                                                                <option value="PAGADO">🟢 Comisión Pagada</option>
                                                            </select>
                                                        </div>
                                                    </>
                                                )}

                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-[#0F172A] uppercase tracking-wider ml-1">Beneficio Empresa (Neto)</label>
                                                    <div className="w-full bg-slate-100 border border-slate-300 rounded-lg py-3 px-4 text-xl font-black text-[#0F172A]">
                                                        ${((formData.profit || 0) - (formData.commission || 0)).toLocaleString()}
                                                    </div>
                                                </div>

                                                <div className="md:col-span-2 space-y-2 pt-4">
                                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Estado del Cliente (Pago)</label>
                                                    <select
                                                        value={formData.status}
                                                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                                        className={`w-full border rounded-lg py-4 px-4 text-sm font-bold uppercase tracking-wider transition-all cursor-pointer outline-none ${
                                                            formData.status === 'PAGADO' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                            formData.status === 'ABONADO' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                            'bg-slate-50 text-slate-600 border-slate-200'
                                                        }`}
                                                    >
                                                        <option value="PENDIENTE">🔴 Abierto — Cliente no ha pagado</option>
                                                        <option value="ABONADO">🟡 Abonado — Pago parcial recibido</option>
                                                        <option value="PAGADO">🟢 Cerrado — Pago completo recibido</option>
                                                        <option value="CANCELADO">⚫ Cancelado — Operación rechazada</option>
                                                    </select>
                                                </div>
                                            </motion.div>
                                        </AnimatePresence>
                                    )}
                                    <div className="md:col-span-2 pt-4">
                                        <button
                                            type="submit"
                                            className="w-full bg-emerald-600 text-white font-bold py-4 rounded-lg text-sm shadow-[0_8px_32px_rgba(0,0,0,0.5)] hover:bg-emerald-700 hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)] transition-all flex items-center justify-center gap-3"
                                        >
                                            <ArrowUpRight size={20} />
                                            <span>{isAdmin ? (editingItem ? 'ACTUALIZAR REGISTRO' : 'GUARDAR INGRESO') : 'ENVIAR PARA APROBACIÓN'}</span>
                                        </button>
                                    </div>
                                </div>
                                )}
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

function StatSummary({ label, value, icon, trend, color }: any) {
    const colors = {
        indigo: "text-indigo-600 bg-indigo-50 border-indigo-100",
        emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
        rose: "text-rose-600 bg-rose-50 border-rose-100"
    }

    const colorKey = (color || 'indigo') as keyof typeof colors;

    return (
        <div className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 p-6 rounded-xl border border-slate-200 shadow-[0_4px_15px_rgba(0,0,0,0.3)] relative overflow-hidden group hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all">
            <div className="absolute right-[-10px] top-[-10px] opacity-[0.03] group-hover:opacity-[0.06] group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <div className="flex justify-between items-start mb-8">
                <div className={`p-3 rounded-lg border ${colors[colorKey]} transition-colors`}>
                    {icon}
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pt-2">{trend}</div>
            </div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{label}</h4>
            <p className="text-3xl font-black text-[#0F172A] tracking-tight group-hover:text-indigo-600 transition-colors">
                ${value.toLocaleString()}
            </p>
        </div>
    )
}
