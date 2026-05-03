"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { 
    TrendingUp, 
    Calendar, 
    FileText, 
    Award, 
    RefreshCw, 
    Target,
    BarChart3,
    Activity,
    Shield
} from "lucide-react"
import { motion } from "framer-motion"
import { getDashboardData } from "@/lib/actions/dashboard"

const fmt = (val: number) => 
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(val || 0)

export default function DashboardOverview() {
    const { data: session } = useSession()
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    const loadStats = async () => {
        if (!session?.user?.id || !session?.user?.role) return
        setLoading(true)
        try {
            const stats = await getDashboardData(session.user.id, session.user.role)
            setData(stats)
        } catch (error) {
            console.error("Dashboard load error:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (session) loadStats()
    }, [session])

    if (!session) return null
    const role = session.user?.role

    if (loading && !data) {
        return (
            <div className="h-full flex flex-col items-center justify-center py-40">
                <div className="w-12 h-12 border-2 border-primary/20 border-t-primary rounded-none animate-spin" />
                <p className="mt-8 font-black text-white/20 tracking-[0.5em] uppercase text-[10px] italic">Sincronizando Estadísticas...</p>
            </div>
        )
    }

    return (
        <div className="space-y-12 pb-32 animate-in fade-in duration-700 relative z-10">
            {/* Header Directo */}
            <div className="flex justify-between items-end border-b border-white/5 pb-12">
                <div className="space-y-4">
                    <div className="flex items-center gap-3 text-secondary">
                        <Activity size={18} />
                        <span className="text-[10px] uppercase font-black tracking-[0.5em] italic">CENTRO DE ANÁLISIS ESTADÍSTICO</span>
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter text-white uppercase italic">KPI <span className="text-primary">MASTER</span></h1>
                </div>
                
                <button 
                    onClick={loadStats} 
                    className="p-4 bg-white/5 text-slate-500 hover:text-primary transition-all border border-white/10"
                >
                    <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                </button>
            </div>

            {/* Grid de Estadísticas Puras */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <KPITile 
                    icon={<TrendingUp size={24} className="text-primary" />}
                    label="Ventas Anuales"
                    value={fmt(data.annualSales)}
                    meta="Fiscal 2026"
                />
                <KPITile 
                    icon={<Calendar size={24} className="text-indigo-400" />}
                    label="Ventas Trimestrales"
                    value={fmt(data.quarterSales)}
                    meta={`${data.quarterCount} Transacciones`}
                />
                <KPITile 
                    icon={<FileText size={24} className="text-secondary" />}
                    label="Cotizaciones Emitidas"
                    value={data.quotesCount.toString()}
                    meta="Historial Total"
                />
                <KPITile 
                    icon={<Award size={24} className="text-emerald-400" />}
                    label="Comisiones Netas"
                    value={fmt(data.commissionsTotal)}
                    meta="Meta de Rendimiento"
                />
            </div>

            {/* Resumen de Eficiencia LIGERO */}
            <div className="bg-white/[0.02] border border-white/5 p-12 space-y-8">
                <div className="flex items-center gap-4 text-white/40">
                    <Shield size={20} />
                    <h2 className="text-[11px] font-black uppercase tracking-[0.4em] italic">Protocolo de Eficiencia Corporativa</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="space-y-2">
                        <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Tasa de Conversión</p>
                        <p className="text-3xl font-black text-white italic">{( (data.quarterCount / (data.quotesCount || 1)) * 100 ).toFixed(1)}%</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Ticket Promedio</p>
                        <p className="text-3xl font-black text-primary italic">{fmt(data.annualSales / (data.quarterCount || 1))}</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Estado del Nodo</p>
                        <p className="text-3xl font-black text-emerald-500 italic">ÓPTIMO</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

function KPITile({ icon, label, value, meta }: { icon: any, label: string, value: string, meta: string }) {
    return (
        <div className="bg-white/[0.03] border border-white/5 p-8 space-y-6 hover:bg-white/[0.05] transition-all">
            <div className="flex justify-between items-center">
                <div className="p-3 bg-black/40 border border-white/5">{icon}</div>
                <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">{meta}</span>
            </div>
            <div className="space-y-1">
                <h3 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] italic">{label}</h3>
                <p className="text-3xl font-black text-white italic tracking-tighter leading-none">{value}</p>
            </div>
        </div>
    )
}
