"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { 
    TrendingUp, FileText, RefreshCw, Target, BarChart3, Activity,
    Users, Calendar, ArrowUpRight, Eye, Globe, Monitor, ShoppingCart,
    MessageSquare, GraduationCap, Package, CreditCard, UserCheck, Wifi
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
    const [systemStats, setSystemStats] = useState<any>(null)

    const loadStats = async () => {
        if (!session?.user?.id || !session?.user?.role) return
        setLoading(true)
        try {
            const [stats, sysRes] = await Promise.all([
                getDashboardData(session.user.id, session.user.role),
                fetch("/api/admin/system-stats").then(r => r.ok ? r.json() : null).catch(() => null)
            ])
            setData(stats)
            if (sysRes) setSystemStats(sysRes)
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
            {/* System Activity Panel — Visits & Activity */}
            {systemStats && (
                <div className="bg-gradient-to-br from-[#0F172A] to-[#1E3A8A] rounded-2xl overflow-hidden shadow-xl">
                    {/* Top row: Total Visits Hero */}
                    <div className="p-8 pb-0 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center border border-white/20">
                                <Eye size={28} className="text-white" />
                            </div>
                            <div>
                                <p className="text-white/50 text-xs font-black uppercase tracking-[0.3em] mb-1">Actividad Total del Sistema</p>
                                <p className="text-5xl font-black text-white tracking-tight">
                                    {(systemStats.visits?.visits_total || 0).toLocaleString()}
                                    <span className="text-white/30 text-2xl ml-3 font-bold tracking-normal">sesiones</span>
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="bg-white/10 border border-white/10 rounded-xl px-6 py-4 text-center min-w-[120px]">
                                <Monitor size={18} className="text-blue-300 mx-auto mb-2" />
                                <p className="text-2xl font-black text-white">{(systemStats.visits?.visits_dashboard || 0).toLocaleString()}</p>
                                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">Dashboard</p>
                            </div>
                            <div className="bg-white/10 border border-white/10 rounded-xl px-6 py-4 text-center min-w-[120px]">
                                <Globe size={18} className="text-emerald-300 mx-auto mb-2" />
                                <p className="text-2xl font-black text-white">{(systemStats.visits?.visits_web || 0).toLocaleString()}</p>
                                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">Web Pública</p>
                            </div>
                            <div className="bg-white/10 border border-white/10 rounded-xl px-6 py-4 text-center min-w-[120px]">
                                <Users size={18} className="text-purple-300 mx-auto mb-2" />
                                <p className="text-2xl font-black text-white">{systemStats.users?.total || 0}</p>
                                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">Usuarios</p>
                            </div>
                        </div>
                    </div>

                    {/* User breakdown by role */}
                    <div className="px-8 pt-6 pb-4">
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-3">Distribución por Rol</p>
                        <div className="flex flex-wrap gap-2">
                            {Object.entries(systemStats.users?.byRole || {}).map(([role, count]: [string, any]) => {
                                const colors: Record<string, string> = {
                                    ADMIN: "bg-red-500/20 border-red-400/30 text-red-300",
                                    MANAGEMENT: "bg-orange-500/20 border-orange-400/30 text-orange-300",
                                    COORDINATOR: "bg-yellow-500/20 border-yellow-400/30 text-yellow-300",
                                    SALESPERSON: "bg-blue-500/20 border-blue-400/30 text-blue-300",
                                    AFILIADO: "bg-purple-500/20 border-purple-400/30 text-purple-300",
                                    COORD_ASSISTANT: "bg-teal-500/20 border-teal-400/30 text-teal-300",
                                }
                                return (
                                    <span key={role} className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold ${colors[role] || "bg-white/10 border-white/20 text-white/60"}`}>
                                        <UserCheck size={12} /> {role} <span className="font-black text-sm">{count}</span>
                                    </span>
                                )
                            })}
                        </div>
                    </div>

                    {/* Activity metrics grid */}
                    <div className="px-8 pb-8 pt-2">
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-3">Actividad de la Plataforma</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                            {[
                                { label: "Cotizaciones", value: systemStats.activity?.quotes, icon: FileText, color: "text-blue-300" },
                                { label: "Pedidos Web", value: systemStats.activity?.webOrders, icon: ShoppingCart, color: "text-emerald-300" },
                                { label: "Conversaciones WA", value: systemStats.activity?.waConversations, icon: MessageSquare, color: "text-green-300" },
                                { label: "Mensajes WA", value: systemStats.activity?.waMessages, icon: Wifi, color: "text-teal-300" },
                                { label: "Matrículas", value: systemStats.activity?.enrollments, icon: GraduationCap, color: "text-indigo-300" },
                                { label: "Productos", value: systemStats.activity?.products, icon: Package, color: "text-purple-300" },
                                { label: "Transacciones", value: systemStats.activity?.transactions, icon: CreditCard, color: "text-yellow-300" },
                            ].map((item, i) => (
                                <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all">
                                    <item.icon size={16} className={`${item.color} mb-2`} />
                                    <p className="text-xl font-black text-white">{(item.value || 0).toLocaleString()}</p>
                                    <p className="text-[9px] font-bold text-white/30 uppercase tracking-wider mt-1">{item.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

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
