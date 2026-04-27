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
    ExternalLink, Upload, ShieldCheck, AlertCircle
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
    status: "APROBADO" | "PENDIENTE" | "CANCELADO"
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
        type: "Venta Directa",
        proofUrl: "",
        salespersonId: session?.user?.id || ""
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

    const totalSales = filteredData.reduce((acc, curr) => acc + curr.amount, 0)
    const totalProfit = filteredData.reduce((acc, curr) => acc + curr.profit, 0)
    const totalCommission = filteredData.reduce((acc, curr) => acc + curr.commission, 0)

    const handleOpenModal = (item?: Transaction) => {
        if (item) {
            setEditingItem(item)
            setFormData(item)
        } else {
            setFormData({
                client: "",
                date: new Date().toISOString().split('T')[0],
                amount: 0,
                cost: 0,
                pvp: 0,
                commission: 0,
                bonus: 0,
                quoteNumber: "",
                status: "PENDIENTE",
                type: "Venta Directa",
                proofUrl: "",
                salespersonId: isAdmin ? "" : session?.user?.id || ""
            })
            setCommissionPercent(10)
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
            payload.profit = (formData.amount || 0) - (formData.cost || 0)
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
        if (confirm("⚠️ Confirmación Crítica: ¿Eliminar este registro permanentemente del ecosistema?")) {
            try {
                const res = await fetch(`/api/finance/${id}`, { method: "DELETE" })
                if (res.ok) fetchTransactions()
            } catch (e) {
                console.error("Error deleting transaction", e)
            }
        }
    }

    return (
        <div className="space-y-16 animate-in fade-in duration-1000 relative z-10">
            {/* Period Filters and Search */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 glass-panel p-8 border-white/5 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] rounded-none-[3rem] backdrop-blur-3xl">
                <div className="flex flex-wrap items-center gap-4 glass-panel !bg-slate-950/60 p-2.5 rounded-none border-white/5 ring-1 ring-white/5">
                    {(["TODOS", "ANUAL", "TRIMESTRAL", "MENSUAL"] as const).map(p => (
                        <button 
                            key={p}
                            onClick={() => setPeriodFilter(p)}
                            className={`px-8 py-3.5 text-[10px] font-black uppercase tracking-[0.3em] transition-all rounded-none relative italic ${periodFilter === p ? 'bg-secondary text-white shadow-[0_10px_30px_-5px_rgba(255,99,71,0.5)] z-10' : 'text-slate-600 hover:text-white'}`}
                        >
                            {p === "TODOS" ? "HISTÓRICO" : p === "ANUAL" ? "ANUAL" : p === "TRIMESTRAL" ? "TRIMESTRE" : "MENSUAL"}
                        </button>
                    ))}
                </div>

                <div className="flex flex-col md:flex-row items-center gap-8 w-full lg:w-auto">
                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-secondary transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="FILTRAR TRX O CLIENTE..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-950/40 border border-white/5 rounded-none py-4.5 pl-16 pr-8 text-[11px] font-black uppercase tracking-[0.4em] text-white outline-none focus:border-secondary transition-all placeholder:text-slate-800 shadow-inner"
                        />
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="w-full md:w-auto bg-secondary text-white px-10 py-4.5 rounded-none font-black uppercase tracking-[0.4em] text-[10px] flex items-center justify-center space-x-4 hover:bg-white hover:text-secondary transition-all shadow-[0_15px_40px_-5px_rgba(255,99,71,0.5)] active:scale-95 group italic skew-x-[-12deg]"
                    >
                        <div className="skew-x-[12deg] flex items-center gap-4">
                            <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                            <span>{isAdmin ? "Forzar Entrada" : "Registrar Venta"}</span>
                        </div>
                    </button>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <StatSummary label={`VENTAS PVP (${periodFilter})`} value={totalSales} icon={<DollarSign size={28} />} trend="FLUJO ENTRANTE" color="secondary" />
                <StatSummary label="UTILIDAD BRUTA" value={totalProfit} icon={<Target size={28} />} trend="RETENCIÓN DE VALOR" color="azure" />
                <StatSummary label="COMISIONES TOTALES" value={totalCommission} icon={<ArrowUpRight size={28} />} trend="PASIVO OPERATIVO" color="emerald" />
            </div>

            {/* Data Table */}
            <div className="glass-panel border-white/5 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)] overflow-hidden rounded-none-[3.5rem] backdrop-blur-3xl">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.02] text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] italic">
                                <th className="px-8 py-5 border-r border-white/5">FECHA</th>
                                <th className="px-8 py-5 border-r border-white/5">Cliente / Ítem</th>
                                <th className="px-8 py-5 border-r border-white/5">CLIENTE</th><th className="px-8 py-5 border-r border-white/5">PRODUCTO</th><th className="px-8 py-5 text-right border-r border-white/5">VALOR DE VENTA</th>
                                <th className="px-8 py-5 text-right border-r border-white/5">COSTO</th>
                                <th className="px-8 py-5 text-right border-r border-white/5">MARGEN</th>
                                <th className="px-8 py-5 text-right border-r border-white/5">Comisión</th>
                                
                                
                                <th className="px-8 py-5 text-right">ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            {filteredData.map((item) => (
                                <tr key={item.id} className="hover:bg-white/[0.02] transition-all group text-[11px] font-black italic">
                                    <td className="px-8 py-5">
                                        <div className="text-slate-400 mb-1">{new Date(item.date).toLocaleDateString()}</div>
                                    </td>
                                    <td className="px-8 py-5 text-secondary tracking-widest font-black uppercase text-[9px]">{item.quoteNumber || item.trxId}</td>
                                    <td className="px-8 py-5">
                                        <div className="text-white uppercase truncate max-w-[150px]">{item.client}</div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="text-[10px] text-slate-300 uppercase tracking-widest">{item.type}</div>
                                    </td>
                                    <td className="px-8 py-5 text-right text-white">${(item.pvp || item.amount).toLocaleString()}</td>
                                    <td className="px-8 py-5 text-right text-red-400/60">-${item.cost.toLocaleString()}</td>
                                    <td className="px-8 py-5 text-right text-emerald-400 underline decoration-emerald-500/20 underline-offset-4">${item.profit.toLocaleString()}</td>
                                    <td className="px-8 py-5 text-right text-secondary">${item.commission.toLocaleString()}</td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                            {isAdmin && (
                                                <button onClick={() => handleOpenModal(item)} className="p-2 hover:text-secondary"><Edit3 size={16} /></button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* CRUD Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-8">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-950/90 backdrop-blur-3xl" 
                            onClick={() => setIsModalOpen(false)} 
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="glass-panel !bg-slate-950/60 w-full max-w-4xl shadow-[0_0_150px_rgba(0,0,0,1)] border-white/10 overflow-hidden rounded-none-[4rem] relative z-10 backdrop-blur-3xl border"
                        >
                            <div className="p-14 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                                <div className="flex items-center gap-8">
                                    <div className="p-5 bg-secondary text-white rounded-none shadow-2xl shadow-secondary/30">
                                        {isAdmin ? <ShieldCheck size={32} /> : <Plus size={32} />}
                                    </div>
                                    <div>
                                        <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic">
                                            {isAdmin ? (editingItem ? 'PROCESAR <span className="text-secondary">ORDEN</span>' : 'FORZAR <span className="text-secondary">ENTRADA</span>') : 'REGISTRAR <span className="text-secondary">VENTA</span>'}
                                        </h3>
                                        <p className="text-[10px] font-black text-slate-500 mt-3 uppercase tracking-[0.6em] italic">Consolidación de Activos Corporativoes</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-5 bg-slate-900 border border-white/10 rounded-none text-slate-600 hover:text-white hover:rotate-90 transition-all duration-500 shadow-2xl"
                                >
                                    <X size={32} />
                                </button>
                            </div>

                            <form onSubmit={handleSave} className="p-14 space-y-12 custom-scrollbar max-h-[70vh] overflow-y-auto">
                                <div className="grid grid-cols-2 gap-12">
                                    <div className={`${isAdmin ? 'col-span-1' : 'col-span-2'} space-y-4`}>
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] ml-2 italic">Cliente Final / Proyecto</label>
                                        <div className="relative group">
                                            <Users className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-secondary transition-colors" size={20} />
                                            <input
                                                required
                                                disabled={!!(editingItem && !isAdmin)}
                                                value={formData.client}
                                                onChange={(e) => setFormData({ ...formData, client: e.target.value.toUpperCase() })}
                                                className="w-full bg-slate-950/60 border border-white/5 rounded-none py-6 pl-16 pr-8 text-[12px] font-black uppercase tracking-widest text-white focus:border-secondary outline-none transition-all placeholder:text-slate-900 shadow-inner italic disabled:opacity-50"
                                                placeholder="NOMBRE DEL CLIENTE..."
                                            />
                                        </div>
                                    </div>

                                    {isAdmin && (
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-secondary uppercase tracking-[0.5em] ml-2 italic">Asignar Asesor</label>
                                            <select
                                                required
                                                value={formData.salespersonId}
                                                onChange={(e) => setFormData({ ...formData, salespersonId: e.target.value })}
                                                className="w-full bg-slate-950/60 border border-white/5 rounded-none py-6 px-10 text-[11px] font-black uppercase tracking-[0.3em] text-white focus:border-secondary outline-none h-[75px]"
                                            >
                                                <option value="">SELECCIONAR ASESOR...</option>
                                                {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                                            </select>
                                        </div>
                                    )}

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] ml-2 italic">Fecha de Venta</label>
                                        <input
                                            type="date"
                                            required
                                            disabled={!!(editingItem && !isAdmin)}
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            className="w-full bg-slate-950/60 border border-white/5 rounded-none py-6 px-10 text-[12px] font-black uppercase tracking-widest text-white focus:border-secondary transition-all shadow-inner disabled:opacity-50"
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] ml-2 italic">Tipo de Operación</label>
                                        <select
                                            disabled={!!(editingItem && !isAdmin)}
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                            className="w-full bg-slate-950/60 border border-white/5 rounded-none py-6 px-10 text-[11px] font-black uppercase tracking-[0.3em] text-white focus:border-secondary outline-none h-[75px] shadow-inner italic disabled:opacity-50"
                                        >
                                            <option value="Venta Directa">VENTA DIRECTA</option>
                                            <option value="Servicio">SERVICIO PROF.</option>
                                            <option value="Proyectos">PROYECTO INTEGRAL</option>
                                        </select>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-white uppercase tracking-[0.5em] ml-2 italic">Valor Venta (PVP) ($)</label>
                                        <div className="relative group">
                                            <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-800" size={24} />
                                            <input
                                                type="number"
                                                required
                                                disabled={!!(editingItem && !isAdmin)}
                                                value={formData.amount}
                                                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                                                className="w-full bg-slate-950/60 border border-white/5 rounded-none py-6 pl-16 pr-8 text-2xl font-black text-white focus:border-secondary outline-none transition-all shadow-inner italic disabled:opacity-50"
                                            />
                                        </div>
                                    </div>

                                    <div className="col-span-2 space-y-4">
                                        <label className="text-[10px] font-black text-azure-400 uppercase tracking-[0.5em] ml-2 italic">Cotización Correspondiente (PDF/Imagen)</label>
                                        <div className="relative group flex items-center gap-6">
                                            <label className="flex-1 cursor-pointer group bg-slate-950/60 border-2 border-dashed border-white/10 hover:border-azure-400/50 rounded-none p-10 transition-all flex flex-col items-center justify-center gap-4 group">
                                                <Upload className="text-slate-700 group-hover:text-azure-400 transition-colors" size={40} />
                                                <span className="text-[10px] font-black text-slate-600 group-hover:text-white uppercase tracking-[0.3em] italic">Suelte el archivo o haga clic para subir</span>
                                                <input type="file" className="hidden" accept="image/*,.pdf,.doc,.docx" onChange={handleFileUpload} />
                                            </label>
                                            {formData.proofUrl && (
                                                <div className="w-40 h-40 glass-panel rounded-none p-4 flex flex-col items-center justify-center gap-4 bg-emerald-500/5 border-emerald-500/20">
                                                    <ShieldCheck className="text-emerald-400" size={32} />
                                                    <span className="text-[7px] font-black text-emerald-400 uppercase text-center tracking-widest">ARCHIVO CARGADO</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {isAdmin && (
                                        <AnimatePresence>
                                            <motion.div 
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                className="col-span-2 grid grid-cols-2 gap-12 pt-8 border-t border-white/5"
                                            >
                                                <div className="space-y-4">
                                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] ml-2 italic">Gastos de Operación (Inversión)</label>
                                                    <input
                                                        type="number"
                                                        required
                                                        value={formData.cost}
                                                        onChange={(e) => {
                                                            const newCost = parseFloat(e.target.value) || 0
                                                            const pvp = formData.pvp || formData.amount || 0
                                                            const profit = pvp - newCost
                                                            const comm = (profit * (commissionPercent / 100)) + (formData.bonus || 0)
                                                            setFormData({ ...formData, cost: newCost, profit, commission: comm })
                                                        }}
                                                        className="w-full bg-slate-950/60 border border-white/5 rounded-none py-6 px-10 text-xl font-black text-red-400 focus:border-red-500 outline-none italic"
                                                    />
                                                </div>
                                                <div className="space-y-4">
                                                    <label className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.5em] ml-2 italic">Margen Bruto (Calculado)</label>
                                                    <div className="w-full bg-emerald-500/5 border border-emerald-500/20 py-6 px-10 text-2xl font-black text-emerald-400 italic">
                                                        ${(formData.profit || 0).toLocaleString()}
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] ml-2 italic">% Comisión Asesor</label>
                                                    <select
                                                        value={commissionPercent}
                                                        onChange={(e) => {
                                                            const pct = parseInt(e.target.value)
                                                            setCommissionPercent(pct)
                                                            const profit = formData.profit || 0
                                                            const comm = (profit * (pct / 100)) + (formData.bonus || 0)
                                                            setFormData({ ...formData, commission: comm })
                                                        }}
                                                        className="w-full bg-slate-950/60 border border-white/5 rounded-none py-6 px-10 text-xl font-black text-white focus:border-secondary outline-none h-[75px]"
                                                    >
                                                        {Array.from({length: 100}, (_, i) => i + 1).map(n => (
                                                            <option key={n} value={n}>{n}% del Margen</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="space-y-4">
                                                    <label className="text-[10px] font-black text-azure-400 uppercase tracking-[0.5em] ml-2 italic">Bonificación Adicional ($)</label>
                                                    <input
                                                        type="number"
                                                        value={formData.bonus}
                                                        onChange={(e) => {
                                                            const bonus = parseFloat(e.target.value) || 0
                                                            const profit = formData.profit || 0
                                                            const comm = (profit * (commissionPercent / 100)) + bonus
                                                            setFormData({ ...formData, bonus, commission: comm })
                                                        }}
                                                        className="w-full bg-slate-950/60 border border-white/5 rounded-none py-6 px-10 text-xl font-black text-azure-400 focus:border-azure-500 outline-none italic"
                                                    />
                                                </div>

                                                <div className="space-y-4">
                                                    <label className="text-[10px] font-black text-secondary uppercase tracking-[0.5em] ml-2 italic">Comisión Final Asesor</label>
                                                    <div className="w-full bg-secondary/10 border border-secondary/30 py-6 px-10 text-2xl font-black text-secondary italic">
                                                        ${(formData.commission || 0).toLocaleString()}
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <label className="text-[10px] font-black text-white uppercase tracking-[0.5em] ml-2 italic">Beneficio Empresa (Neto)</label>
                                                    <div className="w-full bg-white/5 border border-white/20 py-6 px-10 text-2xl font-black text-white italic">
                                                        ${((formData.profit || 0) - (formData.commission || 0)).toLocaleString()}
                                                    </div>
                                                </div>

                                                <div className="col-span-2 space-y-4">
                                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] ml-2 italic">Estado de la Operación</label>
                                                    <select
                                                        value={formData.status}
                                                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                                        className={`w-full border rounded-none py-6 px-10 text-[11px] font-black uppercase tracking-[0.4em] transition-all cursor-pointer h-[75px] ${
                                                            formData.status === 'APROBADO' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-950/60 text-slate-600 border-white/10'
                                                            }`}
                                                    >
                                                        <option value="PENDIENTE">PENDIENTE DE REVISIÓN</option>
                                                        <option value="APROBADO">CONSOLIDAR Y NOTIFICAR</option>
                                                        <option value="CANCELADO">RECHAZAR OPERACIÓN</option>
                                                    </select>
                                                </div>
                                            </motion.div>
                                        </AnimatePresence>
                                    )}
                                </div>

                                <div className="pt-16 flex space-x-8">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-secondary text-white font-black py-8 rounded-none-[2rem] text-[12px] uppercase tracking-[0.6em] shadow-[0_25px_60px_-10px_rgba(255,99,71,0.6)] hover:bg-white hover:text-secondary transition-all flex items-center justify-center space-x-6 active:scale-[0.98] italic skew-x-[-8deg] group"
                                    >
                                        <div className="skew-x-[8deg] flex items-center gap-6">
                                            {isAdmin ? <ShieldCheck size={24} /> : <Save size={24} />}
                                            <span>{isAdmin ? (editingItem ? 'PROCESAR Y NOTIFICAR' : 'Subir REGISTRO') : 'ENVIAR PARA APROBACIÓN'}</span>
                                        </div>
                                    </button>
                                </div>
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
        secondary: "text-secondary bg-secondary/10 border-secondary/20 shadow-secondary/10",
        azure: "text-primary bg-primary/10 border-primary/20 shadow-primary/10",
        emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/10"
    }

    const colorKey = (color || 'secondary') as keyof typeof colors;

    return (
        <div className="glass-panel p-12 relative overflow-hidden group hover:scale-[1.03] transition-all duration-700 rounded-none-[3.5rem] border-white/5 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] backdrop-blur-3xl">
            <div className="absolute right-[-20px] top-[-20px] opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-125 transition-all text-white blur-sm">
                {icon}
                <div className="w-40 h-40" />
            </div>
            <div className="flex justify-between items-start mb-12">
                <div className={`p-6 glass-panel border shadow-2xl rounded-none group-hover:rotate-12 transition-transform duration-500 ${colors[colorKey]}`}>
                    {icon}
                </div>
                <div className="text-[9px] font-black text-slate-700 uppercase tracking-[0.6em] pt-4 italic group-hover:text-white transition-colors">{trend}</div>
            </div>
            <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em] mb-4 italic leading-relaxed">{label}</h4>
            <p className="text-5xl font-black tracking-tighter text-white italic drop-shadow-[0_0_20px_rgba(255,255,255,0.2)] group-hover:translate-x-2 transition-transform">${value.toLocaleString()}</p>
            <div className="mt-10 h-1.5 w-full bg-slate-900/60 rounded-none overflow-hidden border border-white/5">
                <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: '70%' }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    className={`h-full bg-gradient-to-r from-transparent to-current opacity-60 ${colors[colorKey].split(' ')[0]}`}
                />
            </div>
        </div>
    )
}



