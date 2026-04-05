"use client"

import { useState, useMemo, useEffect } from "react"
import {
    Plus, Search, Edit3, Trash2, Filter,
    DollarSign, Calendar, Users,
    ChevronDown, X, Check, Save,
    ArrowUpRight, ArrowDownRight, Info, Clock
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

    // Fetch transactions from API
    useEffect(() => {
        fetchTransactions()
    }, [])

    const fetchTransactions = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/finance")
            const data = await res.json()
            setData(Array.isArray(data) ? data : [])
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

            return true // TODOS
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
        if (confirm("¿Está seguro de eliminar este registro permanentemente?")) {
            try {
                const res = await fetch(`/api/finance/${id}`, { method: "DELETE" })
                if (res.ok) fetchTransactions()
            } catch (e) {
                console.error("Error deleting transaction", e)
            }
        }
    }

    return (
        <div className="space-y-10 pb-12 animate-in fade-in duration-1000">
            {/* Period Filters and Search */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 glass-panel p-6 border-white/5 shadow-2xl rounded-[2rem]">
                <div className="flex flex-wrap items-center gap-2 glass-panel !bg-slate-900/40 p-1.5 rounded-2xl border-white/5 ring-1 ring-white/5">
                    {(["TODOS", "ANUAL", "TRIMESTRAL", "MENSUAL"] as const).map(p => (
                        <button 
                            key={p}
                            onClick={() => setPeriodFilter(p)}
                            className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all rounded-xl ${periodFilter === p ? 'bg-secondary text-white shadow-[0_5px_15px_rgba(255,99,71,0.3)]' : 'text-slate-500 hover:text-white'}`}
                        >
                            {p === "TODOS" ? "Histórico Total" : p === "ANUAL" ? "Año Actual" : p === p ? p : p}
                        </button>
                    ))}
                </div>

                <div className="flex flex-col md:flex-row items-center gap-6 w-full lg:w-auto">
                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-secondary transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar cliente o identificador..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-900/40 border border-white/5 rounded-xl py-3.5 pl-12 pr-6 text-[11px] font-black uppercase tracking-wider text-white outline-none focus:ring-2 focus:ring-secondary/50 transition-all placeholder:text-slate-700"
                        />
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="w-full md:w-auto bg-secondary text-white px-8 py-3.5 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center space-x-3 hover:bg-white hover:text-secondary transition-all shadow-[0_10px_30px_-5px_rgba(255,99,71,0.4)] active:scale-95"
                    >
                        <Plus size={18} />
                        <span>Nuevo Registro</span>
                    </button>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <StatSummary label={`Ventas (${periodFilter})`} value={totalSales} icon={<DollarSign size={24} />} trend={periodFilter} color="secondary" />
                <StatSummary label="Utilidad Estimada" value={totalProfit} icon={<Info size={24} />} trend="Post-Costos" color="azure" />
                <StatSummary label="Comisiones Netas" value={totalCommission} icon={<ArrowUpRight size={24} />} trend="Liquidables" color="emerald" />
            </div>

            {/* Data Table */}
            <div className="glass-panel border-white/5 shadow-2xl overflow-hidden rounded-[2.5rem]">
                <div className="overflow-x-auto scrollbar-hide">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.02]">
                                <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">ID / Cronología</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Cliente / Segmento</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] text-right">Monto Bruto</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] text-right">Inversión</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] text-right">Utilidad Neta</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] text-center">Estado</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            {filteredData.map((item) => (
                                <tr key={item.id} className="hover:bg-white/[0.03] transition-all group relative">
                                    <td className="px-10 py-6">
                                        <div className="text-xs font-black text-white mb-1.5 uppercase group-hover:text-secondary transition-colors">{item.id}</div>
                                        <div className="text-[10px] text-slate-600 font-black flex items-center tracking-widest"><Calendar size={12} className="mr-2 text-slate-700" /> {item.date}</div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="text-sm font-black text-white mb-1.5 tracking-tight uppercase italic">{item.client}</div>
                                        <div className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">{item.type}</div>
                                    </td>
                                    <td className="px-10 py-6 text-right text-sm font-black text-white tracking-tighter">${item.amount.toLocaleString()}</td>
                                    <td className="px-10 py-6 text-right text-sm font-black text-slate-600 tracking-tighter">-${item.cost.toLocaleString()}</td>
                                    <td className="px-10 py-6 text-right text-sm font-black text-emerald-400 tracking-tighter shadow-emerald-500/10">${item.profit.toLocaleString()}</td>
                                    <td className="px-10 py-6 text-center">
                                        <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border shadow-2xl ${
                                            item.status === 'PAGADO' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/10' : 
                                            'bg-secondary/10 text-secondary border-secondary/20 shadow-secondary/10'
                                            }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <div className="flex justify-end space-x-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                            <button
                                                onClick={() => handleOpenModal(item)}
                                                className="p-3 glass-panel !bg-slate-900 text-slate-500 hover:text-secondary hover:bg-white transition-all rounded-xl border-white/5"
                                            >
                                                <Edit3 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="p-3 glass-panel !bg-slate-900 text-slate-500 hover:text-red-500 hover:bg-red-500/10 transition-all rounded-xl border-white/5"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredData.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-10 py-32 text-center">
                                        <Clock className="mx-auto text-slate-900 mb-8" size={60} />
                                        <p className="text-slate-600 font-black text-xs uppercase tracking-[0.4em]">Sin registros tácticos detectados en el periodo.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* CRUD Modal remains same logic, just keeping it here for consistency */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-8">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-2xl animate-in fade-in duration-500" onClick={() => setIsModalOpen(false)} />
                    <div className="glass-panel !bg-slate-950/80 w-full max-w-2xl shadow-[0_0_100px_rgba(0,0,0,0.8)] border-white/10 overflow-hidden animate-in zoom-in-95 duration-500 rounded-[3rem] relative z-10">
                        <div className="p-12 border-b border-white/5 flex justify-between items-center bg-white/5">
                            <div>
                                <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">
                                    {editingItem ? 'Modificar Registro' : 'Nueva Operación'}
                                </h3>
                                <p className="text-[11px] font-black text-secondary mt-3 uppercase tracking-[0.4em]">Control de Flujo de Caja Corporativo</p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-4 glass-panel !bg-slate-900 rounded-2xl text-slate-500 hover:text-white hover:rotate-90 transition-all duration-300 border-white/5"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-12 space-y-8 scrollbar-hide max-h-[70vh] overflow-y-auto">
                            <div className="grid grid-cols-2 gap-8">
                                <div className="col-span-2 space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Cliente Corporativo / Nodo</label>
                                    <div className="relative group">
                                        <Users className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-secondary transition-colors" size={18} />
                                        <input
                                            required
                                            value={formData.client}
                                            onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                                            className="w-full bg-slate-900 border border-white/5 rounded-2xl py-4.5 pl-14 pr-6 text-xs font-black uppercase tracking-widest text-white focus:ring-2 focus:ring-secondary/50 outline-none transition-all placeholder:text-slate-800"
                                            placeholder="NOMBRE DEL ENTE CORPORATIVO..."
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Cronología</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        className="w-full bg-slate-900 border border-white/5 rounded-2xl py-4.5 px-8 text-xs font-black uppercase tracking-widest text-white focus:ring-2 focus:ring-secondary/50 outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Segmento</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full bg-slate-900 border border-white/5 rounded-2xl py-4.5 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-white focus:ring-2 focus:ring-secondary/50 outline-none transition-all cursor-pointer h-[57px]"
                                    >
                                        <option value="Venta Directa">VENTA DIRECTA</option>
                                        <option value="Equipos">EQUIPOS TÉCNICOS</option>
                                        <option value="Servicio">SERVICIOS PROF.</option>
                                        <option value="Proyectos">PROYECTOS I+D</option>
                                        <option value="Distribución">LOGÍSTICA / DIST.</option>
                                        <option value="Ticket de Pago">TICKET DE LIQUIDACIÓN</option>
                                    </select>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Precio Bruto ($)</label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                                        className="w-full bg-slate-900 border border-white/5 rounded-2xl py-4.5 px-8 text-sm font-black text-white focus:ring-2 focus:ring-secondary/50 outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Costo Operativo ($)</label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.cost}
                                        onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) })}
                                        className="w-full bg-slate-900 border border-white/5 rounded-2xl py-4.5 px-8 text-sm font-black text-slate-400 focus:ring-2 focus:ring-secondary/50 outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Incentivo / Comisión ($)</label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.commission}
                                        onChange={(e) => setFormData({ ...formData, commission: parseFloat(e.target.value) })}
                                        className="w-full bg-slate-900 border border-white/5 rounded-2xl py-4.5 px-8 text-sm font-black text-emerald-400 focus:ring-2 focus:ring-secondary/50 outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Estatus del Ciclo</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                        className={`w-full border border-white/5 rounded-2xl py-4.5 px-8 text-[10px] font-black uppercase tracking-[0.2em] transition-all cursor-pointer h-[57px] ${
                                            formData.status === 'PAGADO' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-secondary/10 text-secondary'
                                            }`}
                                    >
                                        <option value="PENDIENTE">PENDIENTE DE LIQUIDACIÓN</option>
                                        <option value="PAGADO">OPERACIÓN FINALIZADA</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-10 flex space-x-6">
                                <button
                                    type="submit"
                                    className="flex-1 bg-secondary text-white font-black py-6 rounded-2xl text-[11px] uppercase tracking-[0.3em] shadow-[0_15px_40px_-5px_rgba(255,99,71,0.5)] hover:bg-white hover:text-secondary transition-all flex items-center justify-center space-x-4 active:scale-[0.98]"
                                >
                                    <Save size={20} />
                                    <span>{editingItem ? 'Sincronizar Cambios' : 'Confirmar Operación'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

function StatSummary({ label, value, icon, trend, color }: any) {
    const colors = {
        secondary: "text-secondary bg-secondary/10 border-secondary/20 shadow-secondary/5",
        azure: "text-primary bg-primary/10 border-primary/20 shadow-primary/5",
        emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/5"
    }

    const colorKey = (color || 'secondary') as keyof typeof colors;

    return (
        <div className="glass-panel p-10 relative overflow-hidden group hover:scale-[1.02] transition-all rounded-[2.5rem] border-white/5 shadow-2xl">
            <div className="flex justify-between items-start mb-8">
                <div className={`p-4 glass-panel border shadow-2xl rounded-2xl ${colors[colorKey]}`}>
                    {icon}
                </div>
                <div className="text-[9px] font-black text-slate-700 uppercase tracking-[0.4em] pt-3">{trend}</div>
            </div>
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">{label}</h4>
            <p className="text-4xl font-black tracking-tighter text-white">${value.toLocaleString()}</p>
        </div>
    )
}
