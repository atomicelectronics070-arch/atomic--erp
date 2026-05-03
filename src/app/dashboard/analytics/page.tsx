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
    Shield,
    Users
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
                <div className="w-12 h-12 border-2 border-slate-200 border-t-[#1E3A8A] rounded-none animate-spin" />
                <p className="mt-8 font-black text-slate-300 tracking-[0.5em] uppercase text-[10px] italic animate-pulse">Sincronizando Estadísticas...</p>
            </div>
        )
    }

    return (
        <div className="space-y-12 pb-32 animate-in fade-in duration-700 relative z-10 font-sans">
            {/* Header Directo y Elegante */}
            <div className="flex justify-between items-end border-b border-slate-200 pb-8">
                <div className="space-y-3">
                    <div className="flex items-center gap-3 text-slate-400">
                        <BarChart3 size={16} className="text-[#1E3A8A]" />
                        <span className="text-[9px] uppercase font-black tracking-[0.6em] italic opacity-60">SISTEMA DE INTELIGENCIA COMERCIAL</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter text-[#0F172A] uppercase italic leading-none">DATOS Y <span className="text-[#1E3A8A]">MÉTRICAS</span></h1>
                </div>
                
                <button 
                    onClick={loadStats} 
                    className="p-3 bg-white text-slate-400 hover:text-[#1E3A8A] transition-all border border-slate-200 shadow-sm"
                >
                    <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                </button>
            </div>

            {/* Grid de Datos Principal */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KPITile 
                    icon={<TrendingUp size={20} className="text-[#1E3A8A]" />}
                    label="Ventas Totales"
                    value={fmt(data.annualSales)}
                    meta="HISTORIAL ACUMULADO"
                />
                <KPITile 
                    icon={<FileText size={20} className="text-blue-500" />}
                    label="Cotizaciones Emitidas"
                    value={data.quotesCount.toLocaleString()}
                    meta="TOTAL DEL SISTEMA"
                />
                <KPITile 
                    icon={<Users size={20} className="text-emerald-500" />}
                    label="Usuarios"
                    value={data.userCount.toLocaleString()}
                    meta="ACTIVOS EN NODO"
                />
            </div>

            {/* Resumen de Rendimiento Compacto */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-slate-200 p-8 flex justify-between items-center group hover:border-[#1E3A8A] transition-all shadow-sm">
                    <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.4em] italic mb-2">TICKET PROMEDIO DE VENTA</p>
                        <p className="text-2xl font-black text-[#0F172A] italic tracking-tighter leading-none">{fmt(data.annualSales / (data.quarterCount || 1))}</p>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-100 text-[#1E3A8A] group-hover:bg-[#1E3A8A] group-hover:text-white transition-all">
                        <Target size={20} />
                    </div>
                </div>
                <div className="bg-white border border-slate-200 p-8 flex justify-between items-center group hover:border-emerald-500 transition-all shadow-sm">
                    <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.4em] italic mb-2">EFICIENCIA DE CONVERSIÓN</p>
                        <p className="text-2xl font-black text-emerald-600 italic tracking-tighter leading-none">{((data.quarterCount / (data.quotesCount || 1)) * 100).toFixed(1)}%</p>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-100 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                        <Activity size={20} />
                    </div>
                </div>
            </div>
        </div>
    )
}

function KPITile({ icon, label, value, meta }: { icon: any, label: string, value: string, meta: string }) {
    return (
        <div className="bg-white border border-slate-200 p-8 space-y-6 hover:border-[#1E3A8A] transition-all group relative overflow-hidden shadow-sm hover:shadow-xl">
            <div className="absolute top-0 right-0 p-1">
                <div className="w-1.5 h-1.5 bg-slate-100 group-hover:bg-[#1E3A8A] transition-colors"></div>
            </div>
            <div className="flex justify-between items-center">
                <div className="p-3 bg-slate-50 border border-slate-100 text-slate-400 group-hover:text-[#1E3A8A] transition-colors">{icon}</div>
                <span className="text-[7px] font-black text-slate-300 uppercase tracking-[0.5em] italic">{meta}</span>
            </div>
            <div className="space-y-2">
                <h3 className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em] italic group-hover:text-slate-500 transition-colors">{label}</h3>
                <p className="text-3xl font-black text-[#0F172A] italic tracking-tighter leading-none">{value}</p>
            </div>
        </div>
    )
}
