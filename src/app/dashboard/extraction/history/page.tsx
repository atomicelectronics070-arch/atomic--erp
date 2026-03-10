"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    History,
    ArrowLeft,
    Download,
    Filter,
    Search,
    RefreshCw,
    ExternalLink,
    CheckCircle2,
    AlertCircle,
    Clock,
    FileSpreadsheet,
    FileJson,
    Trash2
} from "lucide-react"

export default function ExtractionHistoryPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [history, setHistory] = useState<any[]>([])

    useEffect(() => {
        fetchHistory()
    }, [])

    const fetchHistory = async () => {
        setLoading(true)
        try {
            // Mocking history for now as per dashboard data
            setHistory([
                { id: 1, provider: "TechSupply Global", url: "https://techsupply.com/catalogue", date: "2026-03-05 14:20", items: 45, status: "completed" },
                { id: 2, provider: "ElectroParts SA", url: "https://electroparts.net/new-arrivals", date: "2026-03-05 11:05", items: 12, status: "error" },
                { id: 3, provider: "Industrial Tools Inc", url: "https://itools.com/category/drill-bits", date: "2026-03-04 16:45", items: 120, status: "processing" },
                { id: 4, provider: "PowerLink Systems", url: "https://powerlink.io/products", date: "2026-03-04 09:15", items: 0, status: "processing" },
                { id: 5, provider: "Global Components", url: "https://gcomponents.biz/stock", date: "2026-03-03 17:30", items: 88, status: "completed" },
            ])
        } catch (e) {
            console.error("Error fetching history", e)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-12 pb-24">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center space-x-6">
                    <button
                        onClick={() => router.back()}
                        className="p-3 bg-white border border-neutral-100 hover:text-orange-600 transition-all shadow-sm"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 uppercase">
                            Registro de <span className="text-orange-600">Extracciones</span>
                        </h1>
                        <p className="text-neutral-400 font-medium text-sm mt-1">Historial completo y gestión de archivos exportados.</p>
                    </div>
                </div>
                <div className="flex space-x-3">
                    <button className="bg-neutral-900 text-white px-6 py-4 font-bold uppercase tracking-widest text-xs flex items-center space-x-3 transition-all hover:bg-orange-600">
                        <RefreshCw size={18} />
                        <span>Sincronizar</span>
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white border border-neutral-200 p-8 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300" size={18} />
                    <input
                        type="text"
                        placeholder="BUSCAR POR PROVEEDOR O URL..."
                        className="w-full pl-12 pr-4 py-4 border border-neutral-100 bg-neutral-50 text-[10px] font-bold uppercase focus:ring-1 focus:ring-orange-600 outline-none transition-all placeholder:text-neutral-300"
                    />
                </div>
                <div className="flex space-x-4">
                    <button className="px-5 py-3 border border-neutral-100 text-[10px] font-bold uppercase tracking-widest text-neutral-500 hover:border-orange-600 hover:text-orange-600 transition-all flex items-center">
                        <Filter size={14} className="mr-2" /> Filtrar por Estado
                    </button>
                    <button className="px-5 py-3 border border-neutral-100 text-[10px] font-bold uppercase tracking-widest text-neutral-500 hover:border-orange-600 hover:text-orange-600 transition-all flex items-center">
                        <Download size={14} className="mr-2" /> Exportar Registro
                    </button>
                </div>
            </div>

            {/* History Table */}
            <div className="bg-white border border-neutral-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="text-[10px] text-neutral-400 uppercase font-bold tracking-widest bg-neutral-50/50">
                            <tr>
                                <th className="px-8 py-5">Proveedor</th>
                                <th className="px-6 py-5">Fuente (URL)</th>
                                <th className="px-6 py-5">Fecha / Hora</th>
                                <th className="px-6 py-5 text-center">Registros</th>
                                <th className="px-6 py-5">Estado Operativo</th>
                                <th className="px-8 py-5 text-right">Archivos</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {history.map((h) => (
                                <tr key={h.id} className="hover:bg-neutral-50/50 transition-colors group">
                                    <td className="px-8 py-6 font-bold text-neutral-900 text-sm tracking-tight uppercase">
                                        {h.provider}
                                    </td>
                                    <td className="px-6 py-6 font-medium text-neutral-400 text-[10px] max-w-xs truncate">
                                        {h.url}
                                    </td>
                                    <td className="px-6 py-6 font-bold text-neutral-500 text-[10px] uppercase">
                                        {h.date}
                                    </td>
                                    <td className="px-6 py-6 text-center font-bold text-neutral-900">
                                        {h.items}
                                    </td>
                                    <td className="px-6 py-6">
                                        {h.status === 'completed' && (
                                            <span className="flex items-center text-[9px] font-bold text-green-600 bg-green-50 px-2 py-1 uppercase tracking-widest border border-green-100 w-fit">
                                                <CheckCircle2 size={10} className="mr-1.5" /> Éxito
                                            </span>
                                        )}
                                        {h.status === 'error' && (
                                            <span className="flex items-center text-[9px] font-bold text-red-600 bg-red-50 px-2 py-1 uppercase tracking-widest border border-red-100 w-fit">
                                                <AlertCircle size={10} className="mr-1.5" /> Fallida
                                            </span>
                                        )}
                                        {h.status === 'processing' && (
                                            <span className="flex items-center text-[9px] font-bold text-orange-600 bg-orange-50 px-2 py-1 uppercase tracking-widest border border-orange-100 w-fit animate-pulse">
                                                <Clock size={10} className="mr-1.5" /> Capturando
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end space-x-3">
                                            {h.status === 'completed' ? (
                                                <>
                                                    <button className="p-2 border border-neutral-100 text-orange-600 hover:bg-orange-50 transition-all font-bold text-[9px] uppercase tracking-widest flex items-center">
                                                        <FileSpreadsheet size={14} className="mr-2" /> XLSX
                                                    </button>
                                                    <button className="p-2 border border-neutral-100 text-neutral-400 hover:bg-neutral-50 transition-all">
                                                        <FileJson size={14} />
                                                    </button>
                                                </>
                                            ) : (
                                                <button className="text-[9px] font-bold text-neutral-300 uppercase tracking-widest hover:text-red-500 transition-all">
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
