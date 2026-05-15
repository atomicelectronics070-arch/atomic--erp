"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { 
    TrendingUp, 
    FileText, 
    RefreshCw, 
    Target,
    BarChart3,
    Activity,
    Users,
    Calendar,
    ArrowUpRight
} from "lucide-react"
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar
} from 'recharts'
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
                <div className="w-12 h-12 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin" />
                <p className="mt-6 font-bold text-slate-400 tracking-widest uppercase text-xs">Cargando Métricas...</p>
            </div>
        )
    }

    return (
        <div className="space-y-8 pb-32 animate-in fade-in duration-500 font-sans">
            {/* Header */}
            <div className="flex justify-between items-end border-b border-slate-200 pb-6">
                <div>
                    <h1 className="text-3xl font-black text-[#0F172A] flex items-center gap-3">
                        <BarChart3 className="text-indigo-600" /> Analytics y Desempeño
                    </h1>
                    <p className="text-sm text-slate-500 font-medium mt-1">
                        Sistema de Inteligencia Comercial e Indicadores Clave.
                    </p>
                </div>
                
                <button 
                    onClick={loadStats} 
                    className="p-2.5 bg-white text-slate-500 hover:text-indigo-600 transition-all border border-slate-200 shadow-sm rounded-lg hover:bg-slate-50"
                    title="Actualizar Datos"
                >
                    <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                </button>
            </div>

            {/* Grid de Datos Principal */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KPITile 
                    icon={<TrendingUp size={20} className="text-indigo-600" />}
                    iconBg="bg-indigo-50"
                    label="Ventas Totales"
                    value={fmt(data.annualSales)}
                    meta="Acumulado del Año"
                    trend="+12%"
                    trendPositive={true}
                />
                <KPITile 
                    icon={<FileText size={20} className="text-blue-500" />}
                    iconBg="bg-blue-50"
                    label="Cotizaciones Emitidas"
                    value={data.quotesCount?.toLocaleString() || "0"}
                    meta="Volumen Histórico"
                    trend="+8%"
                    trendPositive={true}
                />
                <KPITile 
                    icon={<Users size={20} className="text-emerald-500" />}
                    iconBg="bg-emerald-50"
                    label="Usuarios Activos"
                    value={data.userCount?.toLocaleString() || "0"}
                    meta="Nodos en Sistema"
                />
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Ingresos Mensuales (Area Chart) */}
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-black text-[#0F172A]">Ingresos Mensuales</h3>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Últimos 6 Meses</p>
                        </div>
                        <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-xs font-bold">
                            <TrendingUp size={14} /> Estable
                        </div>
                    </div>
                    
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.charts?.monthly || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B', fontWeight: 600 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B', fontWeight: 600 }} tickFormatter={(value) => `$${value/1000}k`} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value: any) => [fmt(value as number), 'Ingresos']}
                                />
                                <Area type="monotone" dataKey="total" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Ingresos Semanales (Bar Chart) */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
                    <div className="mb-6">
                        <h3 className="text-lg font-black text-[#0F172A]">Rendimiento Semanal</h3>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Últimos 7 Días</p>
                    </div>
                    
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.charts?.weekly || []} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B', fontWeight: 600 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748B', fontWeight: 600 }} tickFormatter={(value) => `$${value/1000}k`} />
                                <Tooltip 
                                    cursor={{fill: '#F1F5F9'}}
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value: any) => [fmt(value as number), 'Cierre Diario']}
                                />
                                <Bar dataKey="total" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>

            {/* Resumen de Rendimiento Compacto */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-slate-200 p-6 rounded-xl flex justify-between items-center group hover:border-indigo-300 transition-all shadow-sm">
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Ticket Promedio de Venta</p>
                        <p className="text-3xl font-black text-[#0F172A] tracking-tight">{fmt(data.annualSales / (data.quarterCount || 1))}</p>
                    </div>
                    <div className="w-14 h-14 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                        <Target size={28} />
                    </div>
                </div>
                
                <div className="bg-white border border-slate-200 p-6 rounded-xl flex justify-between items-center group hover:border-emerald-300 transition-all shadow-sm">
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Eficiencia de Conversión</p>
                        <p className="text-3xl font-black text-emerald-600 tracking-tight">{((data.quarterCount / (data.quotesCount || 1)) * 100).toFixed(1)}%</p>
                    </div>
                    <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                        <Activity size={28} />
                    </div>
                </div>
            </div>
        </div>
    )
}

function KPITile({ icon, iconBg, label, value, meta, trend, trendPositive }: any) {
    return (
        <div className="bg-white border border-slate-200 p-6 rounded-xl space-y-4 hover:shadow-md transition-all group relative overflow-hidden">
            <div className="flex justify-between items-start">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg}`}>
                    {icon}
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${trendPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        {trendPositive ? <ArrowUpRight size={14} /> : <TrendingUp size={14} className="rotate-180" />}
                        {trend}
                    </div>
                )}
            </div>
            
            <div>
                <h3 className="text-sm font-bold text-slate-500 mb-1">{label}</h3>
                <p className="text-3xl font-black text-[#0F172A] tracking-tight">{value}</p>
            </div>
            
            <div className="pt-4 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{meta}</span>
            </div>
        </div>
    )
}
