"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
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
        return (
            <div className="h-screen flex flex-col items-center justify-center space-y-8">
                <div className="w-16 h-16 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin shadow-[0_0_20px_rgba(255,99,71,0.3)]" />
                <div className="flex flex-col items-center gap-2">
                    <p className="font-black text-white tracking-[0.6em] uppercase text-xs animate-pulse italic">Sincronizando Nodo Central</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Protocolo de Inteligencia Operativa</p>
                </div>
            </div>
        )
    }

    const currentChartData = chartPeriod === "weekly" ? data.charts.weekly : chartPeriod === "monthly" ? data.charts.monthly : data.charts.annual

    return (
        <div className="space-y-16 pb-32 animate-in fade-in duration-1000 relative z-10">
            {/* Background Orbs */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-azure-500/5 blur-[120px]" />
                <div className="absolute bottom-[20%] left-[-10%] w-[35%] h-[35%] rounded-full bg-tomato-500/5 blur-[100px]" />
            </div>

            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 border-b border-white/5 pb-16 relative z-10">
                <div>
                    <div className="flex items-center space-x-4 mb-4 text-secondary">
                        <Target size={20} className="drop-shadow-[0_0_8px_rgba(255,99,71,0.5)]" />
                        <span className="text-[10px] uppercase font-black tracking-[0.6em]">ECOSISTEMA DE CONTROL</span>
                    </div>
                    <h1 className="text-6xl font-black tracking-tighter text-white uppercase italic leading-none">
                        CENTRO DE <span className="text-secondary">MANDO</span>
                    </h1>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.3em] mt-4 max-w-2xl leading-relaxed italic">Visualización táctica de métricas corporativas, eficiencia operativa y proyecciones de escalado comercial.</p>
                </div>
                
                <div className="flex items-center gap-8">
                    <button onClick={loadStats} className="p-6 glass-panel hover:bg-white/5 text-slate-500 hover:text-secondary transition-all rounded-2xl group border-white/5 shadow-2xl">
                        <RefreshCw size={24} className={loading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"} />
                    </button>
                    <div className="flex items-center gap-6 glass-panel !bg-slate-950/40 p-5 border-white/5 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] rounded-2xl ring-1 ring-white/5 backdrop-blur-2xl">
                        <div className="w-16 h-16 bg-slate-900 border border-white/10 text-white flex items-center justify-center font-black text-2xl shadow-2xl shadow-azure-500/10 rounded-xl uppercase tracking-tighter italic">
                            {session.user?.name?.[0]}
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-secondary uppercase tracking-[0.4em] mb-2">{role === "ADMIN" ? "ADMINISTRADOR" : role}</p>
                            <p className="text-xl font-black text-white uppercase tracking-tighter italic">{session.user?.name}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 relative z-10">
                {/* 1. Annual Sales */}
                <div className="glass-panel p-10 relative overflow-hidden group hover:scale-[1.02] transition-all duration-500 rounded-[2.5rem] border-white/5 shadow-2xl">
                    <div className="absolute -right-8 -top-8 opacity-[0.03] group-hover:opacity-10 group-hover:scale-110 transition-all text-white">
                        <DollarSign size={180} />
                    </div>
                    <div className="flex justify-between items-start mb-12">
                        <div className="p-5 bg-slate-900 text-white shadow-2xl border-white/10 rounded-2xl ring-1 ring-white/20 group-hover:rotate-6 transition-transform">
                            <TrendingUp size={30} className="text-secondary" />
                        </div>
                        <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-5 py-2 uppercase tracking-widest rounded-xl border border-emerald-500/20 italic shadow-2xl shadow-emerald-500/5">Año Fiscal 2026</span>
                    </div>
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-3 italic">Volumen Transaccional Anual</h3>
                    <p className="text-5xl font-black text-white tracking-tighter italic leading-none">{fmt(data.annualSales)}</p>
                    <div className="mt-10 h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5 shadow-inner p-[2px]">
                        <div className="h-full bg-gradient-to-r from-secondary to-orange-400 rounded-full shadow-[0_0_15px_rgba(255,99,71,0.6)]" style={{ width: '65%' }}></div>
                    </div>
                    <p className="text-[10px] font-black text-slate-500 uppercase mt-6 tracking-widest flex items-center gap-3 italic">
                        <Target size={14} className="text-secondary animate-pulse" /> 65% Rendimiento Proyectado
                    </p>
                </div>

                {/* 2. Quarter Sales */}
                <div className="glass-panel p-10 relative overflow-hidden group hover:scale-[1.02] transition-all duration-500 rounded-[2.5rem] border-white/5 shadow-2xl">
                    <div className="absolute -right-8 -top-8 opacity-[0.03] group-hover:opacity-10 group-hover:scale-110 transition-all text-white">
                        <Calendar size={180} />
                    </div>
                    <div className="flex justify-between items-start mb-12">
                        <div className="p-5 bg-slate-900 text-white shadow-2xl border-white/10 rounded-2xl ring-1 ring-white/20 group-hover:-rotate-6 transition-transform">
                            <Calendar size={30} className="text-azure-400" />
                        </div>
                        <span className="text-[10px] font-black text-azure-400 bg-azure-500/10 px-5 py-2 uppercase tracking-widest rounded-xl border border-azure-500/20 italic shadow-2xl shadow-azure-500/5">Cierre Trimestral</span>
                    </div>
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-3 italic">Facturación Nodo Q1</h3>
                    <p className="text-5xl font-black text-white tracking-tighter italic leading-none">{fmt(data.quarterSales)}</p>
                    <div className="flex items-center gap-4 mt-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] italic">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shadow-[0_0_15px_rgba(16,185,129,0.7)]" />
                        <span>{data.quarterCount} Ventas Liquidadas</span>
                    </div>
                </div>

                {/* 3. Quotes (Interactive) */}
                <button 
                    onClick={() => setShowQuotesOverlay(true)}
                    className="glass-panel !bg-slate-950/60 p-10 text-white shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] relative overflow-hidden text-left hover:scale-[1.02] transition-all border-b-4 border-secondary/50 rounded-[2.5rem] group ring-1 ring-white/5 backdrop-blur-3xl"
                >
                    <div className="absolute right-[-30px] bottom-[-30px] opacity-[0.05] group-hover:scale-125 group-hover:opacity-15 transition-all duration-700">
                        <FileText size={180} />
                    </div>
                    <h3 className="text-[10px] font-black text-secondary uppercase tracking-[0.4em] mb-3 italic">Protocolos de Emisión</h3>
                    <p className="text-7xl font-black text-white tracking-tighter drop-shadow-[0_0_25px_rgba(255,255,255,0.25)] italic leading-none">{data.quotesCount}</p>
                    <div className="mt-10 flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 group-hover:text-white transition-all italic">
                        <span>Desglosar Archivo</span>
                        <ArrowRight size={18} className="group-hover:translate-x-3 transition-transform text-secondary font-black" />
                    </div>
                </button>

                {/* 4. Commissions */}
                <div className="glass-panel p-10 group hover:scale-[1.02] transition-all duration-500 rounded-[2.5rem] border-white/5 shadow-2xl relative overflow-hidden">
                    <div className="absolute -right-8 -top-8 opacity-[0.03] group-hover:opacity-10 group-hover:scale-110 transition-all text-white">
                        <Award size={180} />
                    </div>
                    <div className="flex justify-between items-start mb-12">
                        <div className="p-5 bg-emerald-500/10 text-emerald-400 shadow-2xl border-emerald-500/20 rounded-2xl group-hover:rotate-12 transition-transform shadow-emerald-500/10">
                            <Award size={30} />
                        </div>
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest italic">Rendimiento IA</span>
                    </div>
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-3 italic">
                        {isAdmin ? "Liquidaciones Ejecutadas" : "Incentivos Acumulados"}
                    </h3>
                    <p className="text-5xl font-black text-white tracking-tighter italic leading-none">{fmt(data.commissionsTotal)}</p>
                    <div className="mt-8 flex items-center gap-4">
                         <div className="flex -space-x-3 overflow-hidden">
                            {[1,2,3].map(i => (
                                <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-950 bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-500 border border-white/5 shadow-xl">
                                    {i}
                                </div>
                            ))}
                         </div>
                         <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] italic">Status: Meta Activa</p>
                    </div>
                </div>
            </div>

            {/* Performance Charts */}
            <div className="glass-panel border-white/5 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)] overflow-hidden rounded-[3.5rem] relative z-10 backdrop-blur-3xl">
                <div className="p-12 border-b border-white/5 flex flex-col xl:flex-row justify-between items-center gap-10 bg-white/[0.02]">
                    <div className="text-center xl:text-left">
                        <h2 className="text-4xl font-black text-white uppercase tracking-tighter flex items-center justify-center xl:justify-start gap-6 italic">
                            <div className="p-4 bg-slate-900 rounded-2xl border border-white/10 shadow-2xl shadow-secondary/20">
                                <BarChart3 className="text-secondary" size={36} />
                            </div>
                            Protocolo de Análisis <span className="text-secondary underline decoration-secondary/30 underline-offset-8">Global</span>
                        </h2>
                        <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em] mt-4 italic">Métricas de eficiencia neta vs Proyecciones de escalado industrial</p>
                    </div>
                    <div className="flex glass-panel !bg-slate-950/60 p-2 rounded-2xl border-white/10 ring-1 ring-white/5 shadow-inner">
                        {(["weekly", "monthly", "annual"] as const).map(p => (
                            <button 
                                key={p}
                                onClick={() => setChartPeriod(p)}
                                className={`px-10 py-4 text-[11px] font-black uppercase tracking-[0.2em] transition-all rounded-xl relative ${chartPeriod === p ? 'bg-secondary text-white shadow-[0_15px_30px_-5px_rgba(255,99,71,0.5)] italic z-10' : 'text-slate-600 hover:text-white'}`}
                            >
                                {p === "weekly" ? "Protocolo Semanal" : p === "monthly" ? "Estadística Mensual" : "Auditoría Anual"}
                            </button>
                        ))}
                    </div>
                </div>
                
                <div className="p-16 relative">
                    {/* Inner Orb for visual depth */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-secondary/5 blur-[100px] pointer-events-none" />
                    
                    <div className="h-[500px] w-full relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={currentChartData}>
                                <defs>
                                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ff6347" stopOpacity={0.4} />
                                        <stop offset="50%" stopColor="#ff6347" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#ff6347" stopOpacity={0} />
                                    </linearGradient>
                                    <filter id="shadow" height="200%">
                                        <feGaussianBlur in="SourceAlpha" stdDeviation="10" />
                                        <feOffset dx="0" dy="15" result="offsetblur" />
                                        <feComponentTransfer><feFuncA type="linear" slope="0.5"/></feComponentTransfer>
                                        <feMerge> 
                                            <feMergeNode />
                                            <feMergeNode in="SourceGraphic" /> 
                                        </feMerge>
                                    </filter>
                                </defs>
                                <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#ffffff10" />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fontSize: 10, fontWeight: '900', fill: "#475569", textTransform: 'uppercase', letterSpacing: '0.2em' }} 
                                    dy={25} 
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fontSize: 10, fontWeight: '900', fill: "#475569", letterSpacing: '0.1em' }} 
                                    tickFormatter={(v) => `$${(v/1000).toFixed(0)}K`} 
                                    dx={-25} 
                                />
                                <Tooltip 
                                    contentStyle={{ 
                                        borderRadius: '30px', 
                                        border: '1px solid rgba(255,255,255,0.1)', 
                                        background: 'rgba(2,6,23,0.95)', 
                                        backdropFilter: 'blur(30px)',
                                        padding: '25px',
                                        boxShadow: '0 40px 80px rgba(0,0,0,0.8)',
                                        fontFamily: 'inherit'
                                    }}
                                    itemStyle={{ fontSize: '14px', fontWeight: '900', color: '#ff6347', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                                    labelStyle={{ color: '#64748b', fontSize: '10px', fontWeight: '900', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.3em' }}
                                    cursor={{ stroke: 'rgba(255,99,71,0.3)', strokeWidth: 2, strokeDasharray: '10 10' }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="total" 
                                    stroke="#ff6347" 
                                    strokeWidth={6} 
                                    fillOpacity={1} 
                                    fill="url(#colorTotal)" 
                                    animationDuration={2000}
                                    filter="url(#shadow)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                
                <div className="p-10 bg-slate-950/60 border-t border-white/5 flex flex-wrap justify-center gap-12 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 italic">
                    <div className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-secondary shadow-[0_0_8px_rgba(255,99,71,0.5)]" /> Volumen Bruto</div>
                    <div className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-azure-500 shadow-[0_0_8px_rgba(45,212,191,0.5)]" /> Proyección IA</div>
                    <div className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-slate-800" /> Histórico Base</div>
                </div>
            </div>

            {/* Quote Overlay */}
            <AnimatePresence>
                {showQuotesOverlay && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-end overflow-hidden p-0 md:p-8">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-950/95 backdrop-blur-3xl" 
                            onClick={() => setShowQuotesOverlay(false)}
                        />
                        <motion.div 
                            initial={{ x: '100%', opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: '100%', opacity: 0 }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.8 }}
                            className="w-full md:w-[800px] h-full glass-panel !bg-slate-950/60 !border-l !border-white/10 relative flex flex-col shadow-[0_0_150px_rgba(0,0,0,1)] md:rounded-l-[4rem] overflow-hidden"
                        >
                            <div className="p-12 border-b border-white/5 flex justify-between items-center bg-white/[0.01] shrink-0">
                                <div className="flex items-center gap-8">
                                    <div className="p-5 bg-secondary text-white rounded-2xl shadow-2xl shadow-secondary/30">
                                        <FileText size={28} />
                                    </div>
                                    <div>
                                        <h2 className="text-4xl font-black uppercase tracking-tighter text-white italic">Archivo <span className="text-secondary">Maestro</span></h2>
                                        <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em] mt-2">
                                            {isAdmin ? "PROTOCOLOS OPERATIVOS CONSOLIDADOS" : "REGISTROS PERSONALES DE EMISIÓN"}
                                        </p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setShowQuotesOverlay(false)} 
                                    className="p-4 bg-slate-900 border border-white/10 text-slate-500 hover:text-white hover:rotate-90 transition-all duration-500 rounded-2xl shadow-2xl group"
                                >
                                    <X size={32} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar">
                                {isAdmin ? (
                                    data.quoteData.map((user: any) => (
                                        <div key={user.id} className="space-y-8 animate-in slide-in-from-bottom duration-700">
                                            <div className="flex items-center gap-6 glass-panel !bg-slate-900/60 border-white/10 p-6 rounded-3xl shadow-2xl border-l-8 border-l-secondary relative overflow-hidden group">
                                                <div className="absolute right-[-10px] top-[-10px] opacity-[0.02] text-white">
                                                    <User size={80} />
                                                </div>
                                                <div className="w-14 h-14 glass-panel !bg-slate-950 text-white flex items-center justify-center text-xl font-black shadow-2xl rounded-2xl italic group-hover:scale-110 transition-transform">
                                                    {user.name[0]}
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-black text-white uppercase tracking-tighter italic">{user.name}</h3>
                                                    <span className="bg-white/5 text-slate-500 text-[9px] px-4 py-1.5 font-black uppercase tracking-[0.4em] border border-white/5 rounded-full mt-2 inline-block">
                                                        IDENTIFICADOR: {user.id.slice(0,8)}
                                                    </span>
                                                </div>
                                                <div className="ms-auto flex flex-col items-end">
                                                    <span className="text-secondary text-base font-black italic tracking-tighter">{user.count} PROTOCOLOS</span>
                                                    <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest mt-1">Archivo de Auditoría</span>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 gap-6 ps-10 border-l-2 border-white/5">
                                                {user.latest.map((q: any) => (
                                                    <QuoteRow key={q.id} quote={q} />
                                                ))}
                                                {user.latest.length === 0 && (
                                                    <div className="p-8 border border-dashed border-white/5 rounded-2xl text-[10px] text-slate-700 font-black uppercase tracking-[0.5em] italic flex items-center gap-4">
                                                        <ShieldAlert size={16} /> Vacío: Sin historial de emisión autorizado
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="grid grid-cols-1 gap-8">
                                        {data.quoteData.map((q: any) => (
                                            <QuoteRow key={q.id} quote={q} />
                                        ))}
                                        {data.quoteData.length === 0 && (
                                            <div className="text-center py-40 glass-panel !border-dashed border-white/10 rounded-[4rem] animate-in zoom-in duration-1000">
                                                <div className="w-24 h-24 bg-slate-900 border border-white/5 rounded-full flex items-center justify-center mx-auto mb-10 shadow-inner group">
                                                    <FileText className="text-slate-800 group-hover:scale-110 transition-transform" size={48} />
                                                </div>
                                                <p className="text-slate-500 font-black text-[11px] uppercase tracking-[0.6em] italic">Sin registros de emisión profesional</p>
                                                <p className="text-[9px] text-slate-700 font-bold uppercase tracking-widest mt-4">Protocolo Cero Iniciado</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="p-10 border-t border-white/5 bg-white/[0.01] shrink-0">
                                <button 
                                    onClick={() => setShowQuotesOverlay(false)}
                                    className="w-full py-6 bg-secondary text-white font-black uppercase tracking-[0.6em] text-[10px] italic skew-x-[-12deg] hover:skew-x-0 transition-all duration-500 shadow-[0_20px_50px_-10px_rgba(255,99,71,0.6)] rounded-2xl active:scale-95"
                                >
                                    Cerrar Expediente Maestro
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

function QuoteRow({ quote }: { quote: any }) {
    return (
        <div className="flex items-center justify-between p-8 glass-panel !bg-slate-900/40 border-white/5 hover:!bg-white/[0.05] hover:border-secondary/40 transition-all group rounded-[2rem] shadow-2xl relative overflow-hidden">
            <div className="absolute left-0 top-0 w-1.5 h-full bg-secondary/20 group-hover:bg-secondary transition-colors" />
            <div className="flex items-center gap-10">
                <div className="p-5 bg-slate-950 border border-white/10 text-slate-600 group-hover:text-secondary group-hover:rotate-12 transition-all rounded-2xl shadow-inner">
                    <FileText size={24} />
                </div>
                <div>
                    <p className="text-base font-black text-white uppercase tracking-tighter italic group-hover:translate-x-1 transition-transform">{quote.quoteNumber}</p>
                    <div className="flex items-center gap-3 mt-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-azure-500" />
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">{quote.client?.name || quote.clientName || 'CONSUMIDOR FINAL'}</p>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-16">
                <div className="text-right">
                    <p className="text-2xl font-black text-white tracking-tighter italic">{fmt(quote.total)}</p>
                    <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.4em] mt-2 italic shadow-2xl">{new Date(quote.createdAt).toLocaleDateString()}</p>
                </div>
                <div className={`text-[9px] font-black px-6 py-2.5 rounded-xl border-2 uppercase tracking-[0.4em] italic shadow-2xl ${
                    quote.status === "ACCEPTED" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/10" :
                    quote.status === "SENT" ? "bg-azure-500/10 text-azure-400 border-azure-500/20 shadow-azure-500/10" :
                    "bg-slate-800/10 text-slate-500 border-white/10"
                }`}>
                    {quote.status}
                </div>
            </div>
        </div>
    )
}
