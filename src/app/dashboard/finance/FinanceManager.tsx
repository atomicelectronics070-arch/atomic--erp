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
        <div className="space-y-8 pb-12">
            {/* Period Filters and Search */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white p-6 border border-neutral-100 shadow-sm">
                <div className="flex flex-wrap items-center gap-2 bg-neutral-100 p-1">
                    {(["TODOS", "ANUAL", "TRIMESTRAL", "MENSUAL"] as const).map(p => (
                        <button 
                            key={p}
                            onClick={() => setPeriodFilter(p)}
                            className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${periodFilter === p ? 'bg-white text-neutral-950 shadow-sm' : 'text-neutral-400 hover:text-neutral-600'}`}
                        >
                            {p === "TODOS" ? "Histórico Total" : p === "ANUAL" ? "Año Actual" : p === "TRIMESTRAL" ? "Trimestre" : "Este Mes"}
                        </button>
                    ))}
                </div>

                <div className="flex flex-col md:flex-row items-center gap-4 w-full lg:w-auto">
                    <div className="relative w-full md:w-80 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-orange-600 transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Buscar cliente o ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-neutral-50 border border-neutral-100 rounded-none py-3 pl-10 pr-4 text-xs font-medium outline-none focus:ring-1 focus:ring-orange-500 transition-all"
                        />
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="w-full md:w-auto bg-neutral-900 text-white px-6 py-3 rounded-none font-bold uppercase tracking-widest text-[10px] flex items-center justify-center space-x-2 hover:bg-orange-600 transition-all shadow-md active:scale-95"
                    >
                        <Plus size={14} />
                        <span>Nuevo Registro</span>
                    </button>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatSummary label={`Ventas (${periodFilter})`} value={totalSales} icon={<DollarSign size={20} />} trend={periodFilter} color="orange" />
                <StatSummary label="Utilidad Estimada" value={totalProfit} icon={<Info size={20} />} trend="Post-Costos" color="neutral" />
                <StatSummary label="Comisiones Netas" value={totalCommission} icon={<ArrowUpRight size={20} />} trend="Liquidables" color="green" />
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-none border border-neutral-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-neutral-50 bg-neutral-50/20">
                                <th className="px-8 py-6 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">ID / Fecha</th>
                                <th className="px-8 py-6 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Cliente / Concepto</th>
                                <th className="px-8 py-6 text-[10px] font-bold text-neutral-400 uppercase tracking-widest text-right">Monto Bruto</th>
                                <th className="px-8 py-6 text-[10px] font-bold text-neutral-400 uppercase tracking-widest text-right">Costo Operativo</th>
                                <th className="px-8 py-6 text-[10px] font-bold text-neutral-400 uppercase tracking-widest text-right">Utilidad</th>
                                <th className="px-8 py-6 text-[10px] font-bold text-neutral-400 uppercase tracking-widest text-center">Estado</th>
                                <th className="px-8 py-6 text-[10px] font-bold text-neutral-400 uppercase tracking-widest text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-50">
                            {filteredData.map((item) => (
                                <tr key={item.id} className="hover:bg-neutral-50/50 transition-all group">
                                    <td className="px-8 py-6">
                                        <div className="text-xs font-bold text-neutral-900 mb-1">{item.id}</div>
                                        <div className="text-[10px] text-neutral-400 flex items-center"><Calendar size={12} className="mr-1" /> {item.date}</div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="text-sm font-bold text-neutral-900 mb-1">{item.client}</div>
                                        <div className="text-[10px] font-bold text-orange-600 uppercase tracking-[0.1em]">{item.type}</div>
                                    </td>
                                    <td className="px-8 py-6 text-right text-sm font-bold text-neutral-900">${item.amount.toLocaleString()}</td>
                                    <td className="px-8 py-6 text-right text-sm font-medium text-neutral-400">-${item.cost.toLocaleString()}</td>
                                    <td className="px-8 py-6 text-right text-sm font-bold text-green-600">${item.profit.toLocaleString()}</td>
                                    <td className="px-8 py-6 text-center">
                                        <span className={`px-3 py-1.5 rounded-none text-[9px] font-bold uppercase tracking-widest border ${item.status === 'PAGADO' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-orange-50 text-orange-600 border-orange-100'
                                            }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleOpenModal(item)}
                                                className="p-2 text-neutral-400 hover:text-orange-600 hover:bg-orange-50 rounded-none transition-all"
                                            >
                                                <Edit3 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-none transition-all"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredData.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-8 py-20 text-center">
                                        <Clock className="mx-auto text-neutral-200 mb-4" size={40} />
                                        <p className="text-neutral-400 font-bold text-xs uppercase tracking-widest">No se encontraron registros para este periodo.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* CRUD Modal remains same logic, just keeping it here for consistency */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-stone-900/10">
                    <div className="bg-white w-full max-w-xl rounded-none shadow-2xl border border-neutral-100 overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-10 border-b border-neutral-50 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold text-neutral-900">{editingItem ? 'Editar Transacción' : 'Nuevo Registro Operativo'}</h3>
                                <p className="text-xs text-neutral-400 mt-1">Nivel Industrial • Control de Liquidación</p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-3 bg-neutral-50 rounded-none text-neutral-400 hover:text-neutral-900 transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-10 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="col-span-2 space-y-2">
                                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest ml-1">Cliente Corporativo</label>
                                    <div className="relative">
                                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300" size={16} />
                                        <input
                                            required
                                            value={formData.client}
                                            onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                                            className="w-full bg-neutral-50 border-none rounded-none py-4 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-orange-500/10 transition-all"
                                            placeholder="Nombre de la empresa..."
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest ml-1">Fecha de Registro</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        className="w-full bg-neutral-50 border-none rounded-none py-4 px-6 text-sm font-medium focus:ring-2 focus:ring-orange-500/10 transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest ml-1">Categoría</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full bg-neutral-50 border-none rounded-none py-4 px-6 text-sm font-medium focus:ring-2 focus:ring-orange-500/10 transition-all appearance-none"
                                    >
                                        <option value="Venta Directa">Venta Directa</option>
                                        <option value="Equipos">Equipos</option>
                                        <option value="Servicio">Servicio</option>
                                        <option value="Proyectos">Proyectos</option>
                                        <option value="Distribución">Distribución</option>
                                        <option value="Ticket de Pago">Ticket de Pago</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest ml-1">Precio de Venta ($)</label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                                        className="w-full bg-neutral-50 border-none rounded-none py-4 px-6 text-sm font-bold text-neutral-900 focus:ring-2 focus:ring-orange-500/10 transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest ml-1">Costo ($)</label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.cost}
                                        onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) })}
                                        className="w-full bg-neutral-50 border-none rounded-none py-4 px-6 text-sm font-bold text-neutral-400 focus:ring-2 focus:ring-orange-500/10 transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest ml-1">Comisión ($)</label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.commission}
                                        onChange={(e) => setFormData({ ...formData, commission: parseFloat(e.target.value) })}
                                        className="w-full bg-neutral-50 border-none rounded-none py-4 px-6 text-sm font-bold text-green-600 focus:ring-2 focus:ring-orange-500/10 transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest ml-1">Estado de Pago</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                        className={`w-full border-none rounded-none py-4 px-6 text-sm font-bold transition-all appearance-none ${formData.status === 'PAGADO' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                                            }`}
                                    >
                                        <option value="PENDIENTE">PENDIENTE</option>
                                        <option value="PAGADO">PAGADO</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-6 flex space-x-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-neutral-900 text-white font-bold py-5 rounded-none text-xs uppercase tracking-[0.2em] shadow-lg shadow-neutral-200 hover:bg-orange-600 transition-all flex items-center justify-center space-x-2"
                                >
                                    <Save size={18} />
                                    <span>{editingItem ? 'Guardar Cambios' : 'Confirmar Registro'}</span>
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
        orange: "text-orange-600 bg-orange-50",
        green: "text-green-600 bg-green-50",
        neutral: "text-neutral-900 bg-neutral-50"
    }

    const colorKey = (color || 'neutral') as keyof typeof colors;

    return (
        <div className="bg-white p-8 rounded-none border border-neutral-100 shadow-sm transition-all hover:shadow-md border-b-4 border-b-neutral-900">
            <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-none ${colors[colorKey]}`}>
                    {icon}
                </div>
                <div className="text-[9px] font-extrabold text-neutral-300 uppercase tracking-[0.2em] pt-2">{trend}</div>
            </div>
            <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">{label}</h4>
            <p className="text-3xl font-bold tracking-tight text-neutral-900">${value.toLocaleString()}</p>
        </div>
    )
}
