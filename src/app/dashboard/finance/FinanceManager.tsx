"use client"

import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Plus, Search, Edit3, Trash2, Filter,
    DollarSign, Calendar, Users,
    ChevronDown, X, Check, Save,
    ArrowUpRight, ArrowDownRight, Info, Clock,
    Target, Briefcase, FileText, PieChart
} from "lucide-react"

interface Transaction {
    id: string
    client: string
    date: string
    amount: number
    cost: number
    profit: number
    commission: number
    status: "PAGADO" | "PENDIENTE"
    type: string
}

export default function FinanceManager() {
    const [data, setData] = useState<Transaction[]>([])
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
        commission: 0,
        status: "PENDIENTE",
        type: "Venta Directa"
    })

    useEffect(() => {
        fetchTransactions()
    }, [])

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

    const filteredData = useMemo(() => {
        const now = new Date()
        const currentYear = now.getFullYear()
        const currentMonth = now.getMonth()
        const currentQuarter = Math.floor(currentMonth / 3)

        return data.filter(item => {
            const itemDate = new Date(item.date)
            const matchesSearch = (item.id || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
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
            setEditingItem(null)
            setFormData({
                client: "",
                date: new Date().toISOString().split('T')[0],
                amount: 0,
                cost: 0,
                commission: 0,
                status: "PENDIENTE",
                type: "Venta Directa"
            })
        }
        setIsModalOpen(true)
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        const profit = (formData.amount || 0) - (formData.cost || 0)
        const payload = { ...formData, profit }

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

    const handleDelete = async (id: string) => {
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
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 glass-panel p-8 border-white/5 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] rounded-[3rem] backdrop-blur-3xl">
                <div className="flex flex-wrap items-center gap-4 glass-panel !bg-slate-950/60 p-2.5 rounded-2xl border-white/5 ring-1 ring-white/5">
                    {(["TODOS", "ANUAL", "TRIMESTRAL", "MENSUAL"] as const).map(p => (
                        <button 
                            key={p}
                            onClick={() => setPeriodFilter(p)}
                            className={`px-8 py-3.5 text-[10px] font-black uppercase tracking-[0.3em] transition-all rounded-xl relative italic ${periodFilter === p ? 'bg-secondary text-white shadow-[0_10px_30px_-5px_rgba(255,99,71,0.5)] z-10' : 'text-slate-600 hover:text-white'}`}
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
                            placeholder="FILTRAR NODO O CLIENTE..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-950/40 border border-white/5 rounded-2xl py-4.5 pl-16 pr-8 text-[11px] font-black uppercase tracking-[0.4em] text-white outline-none focus:border-secondary transition-all placeholder:text-slate-800 shadow-inner"
                        />
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="w-full md:w-auto bg-secondary text-white px-10 py-4.5 rounded-2xl font-black uppercase tracking-[0.4em] text-[10px] flex items-center justify-center space-x-4 hover:bg-white hover:text-secondary transition-all shadow-[0_15px_40px_-5px_rgba(255,99,71,0.5)] active:scale-95 group italic skew-x-[-12deg]"
                    >
                        <div className="skew-x-[12deg] flex items-center gap-4">
                            <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                            <span>Inyectar Registro</span>
                        </div>
                    </button>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <StatSummary label={`VENTAS BRUTAS (${periodFilter})`} value={totalSales} icon={<DollarSign size={28} />} trend="FLUJO ENTRANTE" color="secondary" />
                <StatSummary label="UTILIDAD NETA ESTIMADA" value={totalProfit} icon={<Target size={28} />} trend="RETENCIÓN DE VALOR" color="azure" />
                <StatSummary label="LIQUIDACIÓN DE COMISIONES" value={totalCommission} icon={<ArrowUpRight size={28} />} trend="PASIVO OPERATIVO" color="emerald" />
            </div>

            {/* Data Table */}
            <div className="glass-panel border-white/5 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)] overflow-hidden rounded-[3.5rem] backdrop-blur-3xl">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.02]">
                                <th className="px-12 py-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.6em] italic">IDENTIFICACIÓN / CRONO</th>
                                <th className="px-12 py-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.6em] italic">CLIENTE / SEGMENTO</th>
                                <th className="px-12 py-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.6em] italic text-right">MONTO BRUTO</th>
                                <th className="px-12 py-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.6em] italic text-right">OPERACIÓN</th>
                                <th className="px-12 py-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.6em] italic text-right underline decoration-secondary decoration-2 underline-offset-8">UTILIDAD</th>
                                <th className="px-12 py-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.6em] italic text-center">ESTATUS</th>
                                <th className="px-12 py-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.6em] italic text-right">MOD</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            {filteredData.map((item) => (
                                <tr key={item.id} className="hover:bg-white/[0.04] transition-all group relative">
                                    <td className="px-12 py-8 relative">
                                        <div className="absolute left-0 top-0 w-1.5 h-full bg-secondary/0 group-hover:bg-secondary transition-colors" />
                                        <div className="text-sm font-black text-white mb-2 uppercase tracking-tighter group-hover:translate-x-2 transition-transform italic">{item.id.slice(0,10)}</div>
                                        <div className="text-[9px] text-slate-600 font-black flex items-center tracking-[0.3em] uppercase italic group-hover:translate-x-2 transition-transform delay-75"><Calendar size={12} className="mr-3 text-slate-800" /> {new Date(item.date).toLocaleDateString()}</div>
                                    </td>
                                    <td className="px-12 py-8">
                                        <div className="text-base font-black text-white mb-2 tracking-tighter uppercase italic">{item.client}</div>
                                        <div className="flex items-center gap-3">
                                            <span className="w-1.5 h-1.5 rounded-full bg-azure-500 animate-pulse" />
                                            <div className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] italic">{item.type}</div>
                                        </div>
                                    </td>
                                    <td className="px-12 py-8 text-right text-lg font-black text-white tracking-tighter italic">${item.amount.toLocaleString()}</td>
                                    <td className="px-12 py-8 text-right text-xs font-black text-slate-700 tracking-[0.2em] italic">-${item.cost.toLocaleString()}</td>
                                    <td className="px-12 py-8 text-right text-xl font-black text-emerald-400 tracking-tighter italic drop-shadow-[0_0_10px_rgba(52,211,153,0.2)]">${item.profit.toLocaleString()}</td>
                                    <td className="px-12 py-8 text-center">
                                        <span className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-[0.4em] border italic shadow-2xl ${
                                            item.status === 'PAGADO' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/10' : 
                                            'bg-secondary/10 text-secondary border-secondary/20 shadow-secondary/10'
                                            }`}>
                                            {item.status === 'PAGADO' ? 'LIQUIDADO' : 'PENDIENTE'}
                                        </span>
                                    </td>
                                    <td className="px-12 py-8 text-right">
                                        <div className="flex justify-end space-x-3 opacity-0 group-hover:opacity-100 transition-all translate-x-10 group-hover:translate-x-0">
                                            <button
                                                onClick={() => handleOpenModal(item)}
                                                className="p-4 glass-panel !bg-slate-900 text-slate-600 hover:text-secondary hover:bg-white transition-all rounded-2xl border-white/5 shadow-2xl"
                                            >
                                                <Edit3 size={20} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="p-4 glass-panel !bg-slate-900 text-slate-600 hover:text-red-500 hover:bg-red-500/10 transition-all rounded-2xl border-white/5 shadow-2xl"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredData.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-12 py-52 text-center text-slate-800">
                                        <div className="w-24 h-24 bg-slate-900/60 rounded-full flex items-center justify-center mx-auto mb-10 border border-white/5 shadow-inner group">
                                            <Clock className="text-slate-800 group-hover:scale-110 transition-transform" size={48} />
                                        </div>
                                        <p className="text-slate-700 font-black text-[11px] uppercase tracking-[0.6em] italic">Sin registros autorizados en el periodo seleccionado.</p>
                                        <p className="text-[9px] text-slate-900 font-black uppercase tracking-[0.4em] mt-4">Protocolo de búsqueda activo</p>
                                    </td>
                                </tr>
                            )}
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
                            className="glass-panel !bg-slate-950/60 w-full max-w-3xl shadow-[0_0_150px_rgba(0,0,0,1)] border-white/10 overflow-hidden rounded-[4rem] relative z-10 backdrop-blur-3xl border"
                        >
                            <div className="p-14 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                                <div className="flex items-center gap-8">
                                    <div className="p-5 bg-secondary text-white rounded-2xl shadow-2xl shadow-secondary/30">
                                        {editingItem ? <Edit3 size={32} /> : <Plus size={32} />}
                                    </div>
                                    <div>
                                        <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic">
                                            {editingItem ? 'MODIFICAR <span className="text-secondary">NODO</span>' : 'INYECTAR <span className="text-secondary">OPERACIÓN</span>'}
                                        </h3>
                                        <p className="text-[10px] font-black text-slate-500 mt-3 uppercase tracking-[0.6em] italic">Protocolo de Tesorería Industrial</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-5 bg-slate-900 border border-white/10 rounded-2xl text-slate-600 hover:text-white hover:rotate-90 transition-all duration-500 shadow-2xl"
                                >
                                    <X size={32} />
                                </button>
                            </div>

                            <form onSubmit={handleSave} className="p-14 space-y-12 custom-scrollbar max-h-[70vh] overflow-y-auto">
                                <div className="grid grid-cols-2 gap-12">
                                    <div className="col-span-2 space-y-4">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] ml-2 italic">Entidad Corporativa / Cliente Nodo</label>
                                        <div className="relative group">
                                            <Users className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-secondary transition-colors" size={20} />
                                            <input
                                                required
                                                value={formData.client}
                                                onChange={(e) => setFormData({ ...formData, client: e.target.value.toUpperCase() })}
                                                className="w-full bg-slate-950/60 border border-white/5 rounded-2xl py-6 pl-16 pr-8 text-[12px] font-black uppercase tracking-widest text-white focus:border-secondary outline-none transition-all placeholder:text-slate-900 shadow-inner italic"
                                                placeholder="IDENTIFICAR DESTINATARIO..."
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] ml-2 italic">Fecha de Despliegue</label>
                                        <input
                                            type="date"
                                            required
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            className="w-full bg-slate-950/60 border border-white/5 rounded-2xl py-6 px-10 text-[12px] font-black uppercase tracking-widest text-white focus:border-secondary outline-none transition-all shadow-inner"
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] ml-2 italic">Segmentación de Valor</label>
                                        <select
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                            className="w-full bg-slate-950/60 border border-white/5 rounded-2xl py-6 px-10 text-[11px] font-black uppercase tracking-[0.3em] text-white focus:border-secondary outline-none transition-all cursor-pointer h-[75px] shadow-inner italic"
                                        >
                                            <option value="Venta Directa">VENTA DIRECTA</option>
                                            <option value="Equipos">EQUIPOS TÉCNICOS</option>
                                            <option value="Servicio">SERVICIOS PROF.</option>
                                            <option value="Proyectos">PROYECTOS I+D</option>
                                            <option value="Ticket de Pago">TICKET DE LIQUIDACIÓN</option>
                                        </select>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] ml-2 italic">Precio Maestro ($)</label>
                                        <div className="relative group">
                                            <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-800" size={24} />
                                            <input
                                                type="number"
                                                required
                                                value={formData.amount}
                                                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                                                className="w-full bg-slate-950/60 border border-white/5 rounded-2xl py-6 pl-16 pr-8 text-2xl font-black text-white focus:border-secondary outline-none transition-all shadow-inner italic"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] ml-2 italic">Inversión Operativa ($)</label>
                                        <div className="relative group">
                                            <Briefcase className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-800" size={20} />
                                            <input
                                                type="number"
                                                required
                                                value={formData.cost}
                                                onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) })}
                                                className="w-full bg-slate-950/60 border border-white/5 rounded-2xl py-6 pl-16 pr-8 text-xl font-black text-slate-400 focus:border-secondary outline-none transition-all shadow-inner italic"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-secondary uppercase tracking-[0.5em] ml-2 italic">Incentivo Base</label>
                                        <input
                                            type="number"
                                            required
                                            value={formData.commission}
                                            onChange={(e) => setFormData({ ...formData, commission: parseFloat(e.target.value) })}
                                            className="w-full bg-secondary/5 border border-secondary/20 rounded-2xl py-6 px-10 text-2xl font-black text-secondary focus:border-secondary outline-none transition-all shadow-2xl shadow-secondary/5 italic"
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] ml-2 italic">Fase de Liquidación</label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                            className={`w-full border rounded-2xl py-6 px-10 text-[11px] font-black uppercase tracking-[0.4em] transition-all cursor-pointer h-[75px] shadow-2xl italic ${
                                                formData.status === 'PAGADO' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-950/60 text-slate-600 border-white/10'
                                                }`}
                                        >
                                            <option value="PENDIENTE">EN ESPERA</option>
                                            <option value="PAGADO">CONSOLIDADO</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="pt-16 flex space-x-8">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-secondary text-white font-black py-8 rounded-[2rem] text-[12px] uppercase tracking-[0.6em] shadow-[0_25px_60px_-10px_rgba(255,99,71,0.6)] hover:bg-white hover:text-secondary transition-all flex items-center justify-center space-x-6 active:scale-[0.98] italic skew-x-[-8deg] group"
                                    >
                                        <div className="skew-x-[8deg] flex items-center gap-6">
                                            <Save size={24} className="group-hover:translate-y-[-2px] transition-transform" />
                                            <span>{editingItem ? 'ACTUALIZAR NODO' : 'AUTORIZAR REGISTRO'}</span>
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
        <div className="glass-panel p-12 relative overflow-hidden group hover:scale-[1.03] transition-all duration-700 rounded-[3.5rem] border-white/5 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] backdrop-blur-3xl">
            <div className="absolute right-[-20px] top-[-20px] opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-125 transition-all text-white blur-sm">
                {icon}
                <div className="w-40 h-40" />
            </div>
            <div className="flex justify-between items-start mb-12">
                <div className={`p-6 glass-panel border shadow-2xl rounded-2xl group-hover:rotate-12 transition-transform duration-500 ${colors[colorKey]}`}>
                    {icon}
                </div>
                <div className="text-[9px] font-black text-slate-700 uppercase tracking-[0.6em] pt-4 italic group-hover:text-white transition-colors">{trend}</div>
            </div>
            <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em] mb-4 italic leading-relaxed">{label}</h4>
            <p className="text-5xl font-black tracking-tighter text-white italic drop-shadow-[0_0_20px_rgba(255,255,255,0.2)] group-hover:translate-x-2 transition-transform">${value.toLocaleString()}</p>
            <div className="mt-10 h-1.5 w-full bg-slate-900/60 rounded-full overflow-hidden border border-white/5">
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
