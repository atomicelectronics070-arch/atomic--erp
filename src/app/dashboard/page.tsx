"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import {
    AreaChart, Area, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line
} from "recharts"
import {
    TrendingUp, Users, FileText, DollarSign,
    Award, Target, Briefcase, ChevronRight, RefreshCw,
    Calendar, ArrowUpRight, BarChart3, PieChart,
    ChevronDown, X, User, ArrowRight
} from "lucide-react"
import Link from "next/link"
import { getDashboardData } from "@/lib/actions/dashboard"

function fmt(n: number) {
    return n.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 })
}

export default function DashboardOverview() {
    const { data: session } = useSession()
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [showQuotesOverlay, setShowQuotesOverlay] = useState(false)
    const [chartPeriod, setChartPeriod] = useState<"weekly" | "monthly" | "annual">("weekly")

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
    const isAdmin = role === "ADMIN" || role === "MANAGEMENT"

    if (loading && !data) {
        return <div className="h-screen flex items-center justify-center font-black text-secondary animate-pulse tracking-[0.5em] uppercase text-xs">Sincronizando Nodo Central...</div>
    }

    const currentChartData = chartPeriod === "weekly" ? data.charts.weekly : chartPeriod === "monthly" ? data.charts.monthly : data.charts.annual

    return (
        <div className="space-y-16 pb-20 animate-in fade-in duration-1000 relative z-10">
            {/* Header section with Premium feel */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 border-b border-white/5 pb-14">
                <div>
                    <h1 className="text-6xl font-black tracking-tighter text-white uppercase italic leading-none">
                        Centro de <span className="text-secondary">Control</span>
                    </h1>
                    <div className="flex items-center gap-4 mt-4">
                        <span className="bg-secondary/10 text-secondary text-[10px] font-black px-4 py-1.5 uppercase tracking-widest rounded-full border border-secondary/20">Inteligencia de Negocio</span>
                        <p className="text-slate-500 font-bold text-xs uppercase tracking-tight">Efectividad Operativa y Financiera Consolidada</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-8">
                    <button onClick={loadStats} className="p-4 glass-panel hover:bg-white/5 text-slate-400 hover:text-secondary transition-all rounded-2xl group border-white/5">
                        <RefreshCw size={24} className={loading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"} />
                    </button>
                    <div className="flex items-center gap-5 glass-panel !bg-slate-950/40 p-4 border-white/5 shadow-2xl rounded-2xl ring-1 ring-white/5">
                        <div className="w-14 h-14 bg-slate-900 border border-white/10 text-white flex items-center justify-center font-black text-2xl shadow-xl shadow-azure-500/10 rounded-xl uppercase tracking-tighter">
                            {session.user?.name?.[0]}
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-secondary uppercase tracking-[0.3em] mb-1">{role === "ADMIN" ? "ADMINISTRADOR" : role}</p>
                            <p className="text-base font-black text-white uppercase tracking-tight">{session.user?.name}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* 1. Annual Sales */}
                <div className="glass-panel p-10 relative overflow-hidden group hover:border-secondary/30 transition-all rounded-[2.5rem]">
                    <div className="absolute -right-8 -top-8 opacity-[0.03] group-hover:opacity-10 transition-opacity text-white">
                        <DollarSign size={160} />
                    </div>
                    <div className="flex justify-between items-start mb-10">
                        <div className="p-4 glass-panel !bg-slate-900 text-white shadow-2xl border-white/10 rounded-2xl ring-1 ring-white/20">
                            <TrendingUp size={28} className="text-secondary" />
                        </div>
                        <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-4 py-1.5 uppercase tracking-widest rounded-full border border-emerald-500/20">Año Fiscal 2026</span>
                    </div>
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] mb-2">Volumen de Ventas Anual</h3>
                    <div className="flex items-baseline gap-2">
                        <p className="text-4xl font-black text-white tracking-tighter">{fmt(data.annualSales)}</p>
                    </div>
                    <div className="mt-8 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-secondary to-orange-400 rounded-full shadow-[0_0_15px_rgba(255,99,71,0.5)]" style={{ width: '65%' }}></div>
                    </div>
                    <p className="text-[10px] font-black text-slate-500 uppercase mt-4 tracking-widest flex items-center gap-2">
                        <Target size={12} className="text-secondary" /> 65% de Crecimiento Proyectado
                    </p>
                </div>

                {/* 2. Quarter Sales */}
                <div className="glass-panel p-10 relative overflow-hidden group hover:border-azure-500/30 transition-all rounded-[2.5rem]">
                    <div className="absolute -right-8 -top-8 opacity-[0.03] group-hover:opacity-10 transition-opacity text-white">
                        <Calendar size={160} />
                    </div>
                    <div className="flex justify-between items-start mb-10">
                        <div className="p-4 glass-panel !bg-slate-900 text-white shadow-2xl border-white/10 rounded-2xl ring-1 ring-white/20">
                            <Calendar size={28} className="text-primary" />
                        </div>
                        <span className="text-[10px] font-black text-azure-400 bg-azure-500/10 px-4 py-1.5 uppercase tracking-widest rounded-full border border-azure-500/20">Cierre Q1</span>
                    </div>
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] mb-2">Facturación Neta Trimestral</h3>
                    <p className="text-4xl font-black text-white tracking-tighter">{fmt(data.quarterSales)}</p>
                    <div className="flex items-center gap-3 mt-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                        <span>{data.quarterCount} Ventas Liquidadas</span>
                    </div>
                </div>

                {/* 3. Quotes (Interactive) */}
                <button 
                    onClick={() => setShowQuotesOverlay(true)}
                    className="glass-panel !bg-slate-950/60 p-10 text-white shadow-2xl relative overflow-hidden text-left hover:!bg-white/[0.04] transition-all border-b-4 border-secondary/50 rounded-[2.5rem] group ring-1 ring-white/5"
                >
                    <div className="absolute right-[-20px] bottom-[-20px] opacity-10 group-hover:scale-110 transition-transform">
                        <FileText size={140} />
                    </div>
                    <h3 className="text-[10px] font-black text-secondary uppercase tracking-[0.25em] mb-2">Archivo de Cotizaciones</h3>
                    <p className="text-6xl font-black text-white tracking-tighter drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">{data.quotesCount}</p>
                    <div className="mt-8 flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-white transition-colors">
                        <span>Desglosar Registros</span>
                        <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform text-secondary" />
                    </div>
                </button>

                {/* 4. Commissions */}
                <div className="glass-panel p-10 group hover:border-emerald-500/30 transition-all rounded-[2.5rem]">
                    <div className="flex justify-between items-start mb-10">
                        <div className="p-4 glass-panel !bg-emerald-500/10 text-emerald-400 shadow-2xl border-emerald-500/20 rounded-2xl">
                            <Award size={28} />
                        </div>
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Rendimiento</span>
                    </div>
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] mb-2">
                        {isAdmin ? "Comisiones Ejecutadas" : "Incentivos Acumulados"}
                    </h3>
                    <p className="text-4xl font-black text-white tracking-tighter">{fmt(data.commissionsTotal)}</p>
                    <div className="mt-8 flex items-center gap-3">
                         <div className="flex -space-x-2 overflow-hidden">
                            {[1,2,3].map(i => (
                                <div key={i} className="inline-block h-6 w-6 rounded-full ring-2 ring-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-500">
                                    {i}
                                </div>
                            ))}
                         </div>
                         <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Meta de Bonificación: Activa</p>
                    </div>
                </div>
            </div>

            {/* Performance Charts */}
            <div className="glass-panel border-white/5 shadow-2xl overflow-hidden rounded-[3rem]">
                <div className="p-12 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 bg-white/5">
                    <div>
                        <h2 className="text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-5">
                            <BarChart3 className="text-secondary" size={32} />
                            Análisis de Flujo Operativo Global
                        </h2>
                        <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] mt-2">Métricas de eficiencia neta vs Proyección Comercial</p>
                    </div>
                    <div className="flex glass-panel !bg-slate-900/40 p-1.5 rounded-2xl border-white/10 ring-1 ring-white/5">
                        {(["weekly", "monthly", "annual"] as const).map(p => (
                            <button 
                                key={p}
                                onClick={() => setChartPeriod(p)}
                                className={`px-8 py-3 text-[11px] font-black uppercase tracking-widest transition-all rounded-xl ${chartPeriod === p ? 'bg-secondary text-white shadow-[0_10px_20px_-5px_rgba(255,99,71,0.4)]' : 'text-slate-500 hover:text-white'}`}
                            >
                                {p === "weekly" ? "Semanal" : p === "monthly" ? "Mensual" : "Anual"}
                            </button>
                        ))}
                    </div>
                </div>
                
                <div className="p-14">
                    <div className="h-[450px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={currentChartData}>
                                <defs>
                                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ff6347" stopOpacity={0.3} />
                                        <stop offset="90%" stopColor="#ff6347" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: '900', fill: "#64748b" }} dy={20} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: '900', fill: "#64748b" }} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} dx={-20} />
                                <Tooltip 
                                    contentStyle={{ 
                                        borderRadius: '20px', 
                                        border: '1px solid rgba(255,255,255,0.1)', 
                                        background: 'rgba(15,23,42,0.9)', 
                                        backdropFilter: 'blur(10px)',
                                        padding: '20px',
                                        boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
                                    }}
                                    itemStyle={{ fontSize: '13px', fontWeight: '900', color: '#ff6347', textTransform: 'uppercase' }}
                                    cursor={{ stroke: 'rgba(255,99,71,0.2)', strokeWidth: 2 }}
                                />
                                <Area type="monotone" dataKey="total" stroke="#ff6347" strokeWidth={5} fillOpacity={1} fill="url(#colorTotal)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Quote Overlay / Detail Section */}
            {showQuotesOverlay && (
                <div className="fixed inset-0 z-[100] flex items-center justify-end">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" 
                        onClick={() => setShowQuotesOverlay(false)}
                    />
                    <motion.div 
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="w-full max-w-4xl h-full glass-panel !bg-slate-950/60 !border-l !border-white/10 relative flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.8)]"
                    >
                        <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/5">
                            <div>
                                <h2 className="text-3xl font-black uppercase tracking-tighter text-white italic">Archivo Maestro</h2>
                                <p className="text-[11px] font-black text-secondary uppercase tracking-[0.4em] mt-2">
                                    {isAdmin ? "Historial Operativo Consolidado" : "Mis Registros de Emisión"}
                                </p>
                            </div>
                            <button onClick={() => setShowQuotesOverlay(false)} className="w-14 h-14 glass-panel !bg-slate-900 flex items-center justify-center hover:bg-red-500/20 text-white transition-all rounded-2xl group border-white/10">
                                <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-12 space-y-12 scrollbar-hide">
                            {isAdmin ? (
                                // Admin Grouped View
                                data.quoteData.map((user: any) => (
                                    <div key={user.id} className="space-y-6">
                                        <div className="flex items-center gap-5 glass-panel !bg-slate-900 border-white/10 p-5 rounded-2xl shadow-xl border-l-4 border-l-secondary">
                                            <div className="w-10 h-10 glass-panel !bg-slate-950 text-white flex items-center justify-center text-xs font-black ring-1 ring-white/10 rounded-xl">
                                                {user.name[0]}
                                            </div>
                                            <h3 className="text-sm font-black text-white uppercase tracking-widest">{user.name}</h3>
                                            <span className="ms-auto glass-panel !bg-white/5 text-slate-400 text-[10px] px-4 py-1.5 font-black uppercase tracking-widest border-white/5 rounded-full">
                                                {user.count} REGISTROS
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-1 gap-4 ps-6 border-l border-white/5">
                                            {user.latest.map((q: any) => (
                                                <QuoteRow key={q.id} quote={q} />
                                            ))}
                                            {user.latest.length === 0 && <p className="text-[11px] text-slate-600 font-black uppercase italic py-6 tracking-widest">Sin registros autorizados.</p>}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                // Personal List View
                                <div className="grid grid-cols-1 gap-6">
                                    {data.quoteData.map((q: any) => (
                                        <QuoteRow key={q.id} quote={q} />
                                    ))}
                                    {data.quoteData.length === 0 && (
                                        <div className="text-center py-28 glass-panel !border-dashed border-white/10 rounded-[3rem]">
                                            <FileText className="mx-auto text-slate-800 mb-8" size={80} />
                                            <p className="text-slate-500 font-black text-xs uppercase tracking-[0.4em]">Sin historial de emisión profesional registrado.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    )
}

function QuoteRow({ quote }: { quote: any }) {
    return (
        <div className="flex items-center justify-between p-6 glass-panel !bg-white/[0.02] border-white/5 hover:!bg-white/[0.05] hover:border-secondary/30 transition-all group rounded-2xl shadow-sm">
            <div className="flex items-center gap-8">
                <div className="p-3 glass-panel !bg-slate-900 text-slate-500 group-hover:text-secondary transition-colors rounded-xl border-white/10">
                    <FileText size={20} />
                </div>
                <div>
                    <p className="text-sm font-black text-white uppercase tracking-tight">{quote.quoteNumber}</p>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-1">{quote.client?.name || quote.clientName || 'Consumidor Final'}</p>
                </div>
            </div>
            <div className="flex items-center gap-12">
                <div className="text-right">
                    <p className="text-lg font-black text-white tracking-tighter">{fmt(quote.total)}</p>
                    <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">{new Date(quote.createdAt).toLocaleDateString()}</p>
                </div>
                <div className={`text-[10px] font-black px-4 py-2 rounded-xl border uppercase tracking-[0.2em] shadow-lg ${
                    quote.status === "ACCEPTED" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/5" :
                    quote.status === "SENT" ? "bg-azure-500/10 text-azure-400 border-azure-500/20 shadow-azure-500/5" :
                    "bg-slate-800/10 text-slate-500 border-white/5"
                }`}>
                    {quote.status}
                </div>
            </div>
        </div>
    )
}

function CheckCircle2({ size, className }: { size: number, className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/>
        </svg>
    )
}
