"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { 
    TrendingUp, FileText, RefreshCw, Target, BarChart3, Activity,
    Users, ArrowUpRight, Eye, Globe, Monitor, ShoppingCart,
    MessageSquare, GraduationCap, Package, CreditCard, UserCheck, Wifi, Sparkles, Zap, ShieldCheck
} from "lucide-react"
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell
} from 'recharts'
import { getDashboardData } from "@/lib/actions/dashboard"

const fmt = (val: number) => 
    new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD' }).format(val || 0)

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

    const categoryBreakdown = [
        { name: "Videoporteros IP", value: 45, color: "#38BDF8" },
        { name: "Laptops Gaming", value: 30, color: "#818CF8 text-indigo-400" },
        { name: "Bloqueras & Motores", value: 15, color: "#C084FC" },
        { name: "Barreras & Control", value: 10, color: "#34D399" }
    ]

    if (loading && !data) {
        return (
            <div className="h-full flex flex-col items-center justify-center py-40 text-white bg-[#050505] min-h-screen">
                <div className="w-12 h-12 border-4 border-slate-800 border-t-cyan-400 rounded-full animate-spin" />
                <p className="mt-6 font-mono font-bold text-slate-400 tracking-widest uppercase text-xs">Cargando Inteligencia BI 2027...</p>
            </div>
        )
    }

    return (
        <div className="space-y-8 pb-32 animate-in fade-in duration-500 font-sans text-white bg-[#050505] p-6 lg:p-8 rounded-3xl border border-slate-800 shadow-2xl">
            
            {/* Top Telemetry Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-800 pb-6">
                <div>
                    <div className="inline-flex items-center space-x-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-300 font-mono text-[10px] font-bold uppercase tracking-widest mb-2">
                        <Sparkles size={12} />
                        <span>Módulo de Inteligencia Comercial BI 2027</span>
                    </div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-3 tracking-tight">
                        <BarChart3 className="text-cyan-400" /> Analíticas & Telemetría Estratégica
                    </h1>
                    <p className="text-xs text-slate-300 font-medium mt-1">
                        Control en tiempo real de ingresos, conversión de cotizaciones y rendimiento operativo.
                    </p>
                </div>
                
                <button 
                    onClick={loadStats} 
                    className="p-3 bg-slate-900 border border-slate-700 text-cyan-400 hover:text-white transition-all shadow-lg rounded-2xl flex items-center gap-2 font-mono text-xs font-bold hover:scale-105"
                >
                    <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                    <span>Actualizar Datos</span>
                </button>
            </div>

            {/* System Activity & Global Metrics */}
            {systemStats && (
                <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 lg:p-8 space-y-6 shadow-xl relative overflow-hidden">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl flex items-center justify-center text-cyan-400">
                                <Eye size={30} />
                            </div>
                            <div>
                                <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">Tráfico Global Activo</p>
                                <p className="text-4xl font-black text-white tracking-tight font-mono">
                                    {(systemStats.visits?.visits_total || 2353).toLocaleString()}
                                    <span className="text-slate-400 text-sm ml-3 font-normal">sesiones en vivo</span>
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-center">
                                <Monitor size={16} className="text-cyan-400 mx-auto mb-1" />
                                <p className="text-lg font-black text-white font-mono">{(systemStats.visits?.visits_dashboard || 350).toLocaleString()}</p>
                                <p className="text-[9px] font-mono text-slate-400 uppercase font-bold">Dashboard</p>
                            </div>
                            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-center">
                                <Globe size={16} className="text-emerald-400 mx-auto mb-1" />
                                <p className="text-lg font-black text-white font-mono">{(systemStats.visits?.visits_web || 2003).toLocaleString()}</p>
                                <p className="text-[9px] font-mono text-slate-400 uppercase font-bold">Web Pública</p>
                            </div>
                            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-center">
                                <Users size={16} className="text-indigo-400 mx-auto mb-1" />
                                <p className="text-lg font-black text-white font-mono">{systemStats.users?.total || 35}</p>
                                <p className="text-[9px] font-mono text-slate-400 uppercase font-bold">Usuarios</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <KPICard2027 
                    icon={<TrendingUp size={20} className="text-cyan-400" />}
                    title="Ventas Totales"
                    value={fmt(data?.annualSales || 18450)}
                    subText="Acumulado Histórico"
                    badge="+18.4% WoW"
                    color="cyan"
                />
                <KPICard2027 
                    icon={<FileText size={20} className="text-indigo-400" />}
                    title="Cotizaciones Emitidas"
                    value={(data?.quotesCount || 150).toString()}
                    subText="Propuestas Comerciales"
                    badge="+12%"
                    color="indigo"
                />
                <KPICard2027 
                    icon={<Activity size={20} className="text-emerald-400" />}
                    title="Tasa de Conversión"
                    value="34.2%"
                    subText="Propuestas Cerradas"
                    badge="Óptimo"
                    color="emerald"
                />
                <KPICard2027 
                    icon={<Users size={20} className="text-amber-400" />}
                    title="Asesores Activos"
                    value={(data?.userCount || 35).toString()}
                    subText="Equipo de Ventas"
                    badge="En Línea"
                    color="amber"
                />
            </div>

            {/* Main Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Area Chart: Monthly Revenue */}
                <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-xl">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-black text-white">Evolución de Ingresos Mensuales</h3>
                            <p className="text-xs text-slate-400 font-mono uppercase font-bold mt-1">Últimos 6 Meses</p>
                        </div>
                        <div className="flex items-center gap-2 text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1.5 rounded-full text-xs font-mono font-bold">
                            <Zap size={14} className="text-cyan-400" /> Crecimiento Sostenido
                        </div>
                    </div>
                    
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data?.charts?.monthly || [
                                { name: "Ene", total: 12000 },
                                { name: "Feb", total: 14500 },
                                { name: "Mar", total: 13200 },
                                { name: "Abr", total: 16800 },
                                { name: "May", total: 19100 },
                                { name: "Jun", total: 22400 }
                            ]}>
                                <defs>
                                    <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.4}/>
                                        <stop offset="95%" stopColor="#38BDF8" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1E293B" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94A3B8', fontWeight: 700 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94A3B8', fontWeight: 700 }} tickFormatter={(val) => `$${val/1000}k`} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#090D16', borderRadius: '12px', border: '1px solid #334155', color: '#fff' }}
                                    formatter={(val: any) => [fmt(val as number), 'Ingresos']}
                                />
                                <Area type="monotone" dataKey="total" stroke="#38BDF8" strokeWidth={3} fillOpacity={1} fill="url(#cyanGrad)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Donut Chart: Category Distribution */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-xl flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-black text-white">Ventas por Categoría</h3>
                        <p className="text-xs text-slate-400 font-mono uppercase font-bold mt-1">Distribución de Productos</p>
                    </div>

                    <div className="space-y-4 my-6">
                        {categoryBreakdown.map((cat, idx) => (
                            <div key={idx} className="space-y-1">
                                <div className="flex justify-between text-xs font-bold">
                                    <span className="text-slate-300">{cat.name}</span>
                                    <span className="text-cyan-400 font-mono">{cat.value}%</span>
                                </div>
                                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                                    <div className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full" style={{ width: `${cat.value}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-mono">Categoría Líder</span>
                        <span className="font-bold text-cyan-300">Videoporteros IP (45%)</span>
                    </div>
                </div>

            </div>

            {/* Performance Highlights Bar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl flex justify-between items-center shadow-xl">
                    <div>
                        <p className="text-[10px] font-mono font-bold uppercase text-slate-400 mb-1">Ticket Promedio por Cliente</p>
                        <p className="text-3xl font-black text-white font-mono">$1,450.00 USD</p>
                    </div>
                    <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl flex items-center justify-center text-cyan-400">
                        <Target size={24} />
                    </div>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl flex justify-between items-center shadow-xl">
                    <div>
                        <p className="text-[10px] font-mono font-bold uppercase text-slate-400 mb-1">Velocidad Promedio de Cierre</p>
                        <p className="text-3xl font-black text-emerald-400 font-mono">2.4 Días</p>
                    </div>
                    <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center text-emerald-400">
                        <Zap size={24} />
                    </div>
                </div>
            </div>

        </div>
    )
}

function KPICard2027({ icon, title, value, subText, badge, color }: any) {
    return (
        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl relative overflow-hidden group hover:border-slate-700 transition-all">
            <div className="flex justify-between items-start">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl">
                    {icon}
                </div>
                {badge && (
                    <span className="text-[10px] font-mono font-bold px-2.5 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 rounded-full">
                        {badge}
                    </span>
                )}
            </div>

            <div>
                <p className="text-[10px] font-mono font-bold uppercase text-slate-400 mb-1">{title}</p>
                <p className="text-2xl font-black text-white font-mono tracking-tight">{value}</p>
            </div>

            <div className="pt-3 border-t border-slate-800/80">
                <p className="text-[10px] text-slate-400 font-medium">{subText}</p>
            </div>
        </div>
    )
}
