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
            {/* Header Directo y Elegante */}
            <div className="flex justify-between items-end border-b border-white/5 pb-8">
                <div className="space-y-3">
                    <div className="flex items-center gap-3 text-secondary">
                        <BarChart3 size={16} />
                        <span className="text-[9px] uppercase font-black tracking-[0.6em] italic opacity-60">SISTEMA DE INTELIGENCIA COMERCIAL</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic leading-none">DATOS Y <span className="text-primary">MÉTRICAS</span></h1>
                </div>
                
                <button 
                    onClick={loadStats} 
                    className="p-3 bg-white/5 text-slate-500 hover:text-primary transition-all border border-white/10"
                >
                    <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                </button>
            </div>

            {/* Grid de Datos Principal - 3 Columnas Optimizadas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KPITile 
                    icon={<TrendingUp size={20} className="text-primary" />}
                    label="Ventas Totales"
                    value={fmt(data.annualSales)}
                    meta="HISTORIAL ACUMULADO"
                />
                <KPITile 
                    icon={<FileText size={20} className="text-indigo-400" />}
                    label="Cotizaciones Emitidas"
                    value={data.quotesCount.toLocaleString()}
                    meta="TOTAL DEL SISTEMA"
                />
                <KPITile 
                    icon={<Users size={20} className="text-emerald-400" />}
                    label="Usuarios"
                    value={data.userCount.toLocaleString()}
                    meta="ACTIVOS EN NODO"
                />
            </div>

            {/* Resumen de Rendimiento Compacto */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/[0.02] border border-white/5 p-8 flex justify-between items-center group hover:bg-white/[0.04] transition-all">
                    <div>
                        <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em] italic mb-2">TICKET PROMEDIO DE VENTA</p>
                        <p className="text-2xl font-black text-white italic tracking-tighter">{fmt(data.annualSales / (data.quarterCount || 1))}</p>
                    </div>
                    <div className="p-3 bg-primary/10 border border-primary/20 text-primary group-hover:scale-110 transition-transform">
                        <Target size={20} />
                    </div>
                </div>
                <div className="bg-white/[0.02] border border-white/5 p-8 flex justify-between items-center group hover:bg-white/[0.04] transition-all">
                    <div>
                        <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em] italic mb-2">EFICIENCIA DE CONVERSIÓN</p>
                        <p className="text-2xl font-black text-emerald-400 italic tracking-tighter">{((data.quarterCount / (data.quotesCount || 1)) * 100).toFixed(1)}%</p>
                    </div>
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
                        <Activity size={20} />
                    </div>
                </div>
            </div>
        </div>
    )
}

function KPITile({ icon, label, value, meta }: { icon: any, label: string, value: string, meta: string }) {
    return (
        <div className="bg-white/[0.02] border border-white/5 p-8 space-y-6 hover:border-white/10 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-1">
                <div className="w-1.5 h-1.5 bg-primary/20 group-hover:bg-primary transition-colors"></div>
            </div>
            <div className="flex justify-between items-center">
                <div className="p-3 bg-black/60 border border-white/5 text-white/40 group-hover:text-white transition-colors">{icon}</div>
                <span className="text-[7px] font-black text-white/10 uppercase tracking-[0.5em] italic">{meta}</span>
            </div>
            <div className="space-y-1">
                <h3 className="text-[8px] font-black text-slate-600 uppercase tracking-[0.3em] italic group-hover:text-slate-400 transition-colors">{label}</h3>
                <p className="text-3xl font-black text-white italic tracking-tighter leading-none">{value}</p>
            </div>
        </div>
    )
}
