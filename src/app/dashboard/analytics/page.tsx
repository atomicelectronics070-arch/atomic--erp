"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { 
    TrendingUp, 
    Calendar, 
    FileText, 
    Award, 
    ArrowRight, 
    RefreshCw, 
    Target, 
    User, 
    X, 
    BarChart3, 
    DollarSign,
    ShieldAlert
} from "lucide-react"
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer 
} from "recharts"
import { motion, AnimatePresence } from "framer-motion"
import { getDashboardData } from "@/lib/actions/dashboard"

const fmt = (val: number) => 
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(val || 0)

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
            <div className="h-full flex flex-col items-center justify-center space-y-12 py-40">
                <div className="relative">
                    <div className="w-24 h-24 border-4 border-primary/10 border-t-primary rounded-none animate-spin shadow-[0_0_50px_rgba(99,102,241,0.2)]" />
                    <div className="absolute inset-0 w-24 h-24 border-4 border-pink-500/10 border-b-pink-500 rounded-none animate-reverse-spin opacity-40 shadow-[0_0_50px_rgba(236,72,153,0.2)]" />
                </div>
                <div className="flex flex-col items-center gap-6">
                    <p className="font-black text-white tracking-[0.8em] uppercase text-xs animate-pulse italic">Cargando Central</p>
                    <div className="h-1 w-48 bg-white/5 rounded-none overflow-hidden border border-white/5">
                        <motion.div 
                            initial={{ x: "-100%" }}
                            animate={{ x: "100%" }}
                            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                            className="h-full w-1/2 bg-gradient-to-r from-transparent via-secondary to-transparent"
                        />
                    </div>
                </div>
            </div>
        )
    }

    const currentChartData = chartPeriod === "weekly" ? data.charts.weekly : chartPeriod === "monthly" ? data.charts.monthly : data.charts.annual

    return (
        <div className="space-y-16 pb-32 animate-in fade-in duration-1000 relative z-10">
            {/* Background Orbs - Visual Depth */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[10%] right-[-10%] w-[50%] h-[50%] rounded-none bg-indigo-500/5 blur-[150px]" />
                <div className="absolute bottom-[20%] left-[-10%] w-[45%] h-[45%] rounded-none bg-pink-500/5 blur-[130px]" />
            </div>

            {/* Header Section - Corporativo Command Center */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-12 border-b border-white/5 pb-20 relative z-10">
                <div className="space-y-6">
                    <div className="flex items-center space-x-6 text-secondary group">
                        <Target size={24} className="drop-shadow-[0_0_12px_rgba(255,99,71,0.6)] group-hover:rotate-45 transition-transform" />
                        <span className="text-[11px] uppercase font-black tracking-[0.6em] italic">ECOSISTEMA DE CONTROL v4.0</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic leading-none">
                        CENTRO DE <span className="text-primary">MANDO</span>
                    </h1>
                    <p className="text-slate-500 font-bold text-[9px] uppercase tracking-[0.3em] max-w-xl leading-relaxed italic opacity-60 border-l border-primary/30 pl-4">
                        Visualización táctica de métricas corporativas y eficiencia operativa.
                    </p>
                </div>
                
                <div className="flex items-center gap-6">
                    <button 
                        onClick={loadStats} 
                        className="p-4 glass-panel hover:bg-white/5 text-slate-500 hover:text-primary transition-all rounded-none border-white/5 shadow-xl active:scale-95"
                    >
                        <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                    </button>
                    <div className="flex items-center gap-4 glass-panel !bg-slate-950/40 p-4 border-white/5 shadow-xl rounded-none ring-1 ring-white/5 backdrop-blur-3xl group">
                        <div className="w-10 h-10 bg-slate-900 border border-white/5 text-white flex items-center justify-center font-black text-lg shadow-xl rounded-none italic border-l-2 border-l-primary">
                            {session.user?.name?.[0]}
                        </div>
                        <div className="pr-4">
                            <p className="text-[8px] font-black text-primary uppercase tracking-[0.3em] mb-0.5 opacity-60 italic">{role === "ADMIN" ? "ADMINISTRADOR" : role}</p>
                            <p className="text-sm font-black text-white uppercase tracking-tighter italic">{session.user?.name}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* KPI Mastery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
                <KPITile 
                    icon={<TrendingUp size={36} className="text-primary" />}
                    label="Volumen Transaccional GBL"
                    value={fmt(data.annualSales)}
                    meta="Eje Fiscal 2026"
                    progress={72}
                    accent="pink"
                />

                <KPITile 
                    icon={<Calendar size={36} className="text-indigo-400" />}
                    label="Facturación Elemento Q1"
                    value={fmt(data.quarterSales)}
                    meta={`${data.quarterCount} Ventas Liquidadas`}
                    progress={45}
                    accent="indigo"
                />

                <button 
                    onClick={() => setShowQuotesOverlay(true)}
                    className="glass-panel !bg-slate-950/40 p-8 text-white shadow-xl relative overflow-hidden text-left hover:bg-slate-900/60 transition-all border-b-2 border-secondary/30 rounded-none group ring-1 ring-white/5 backdrop-blur-3xl"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-secondary/5 rounded-none border border-secondary/10">
                            <FileText size={18} className="text-secondary" />
                        </div>
                        <h3 className="text-[9px] font-black text-secondary uppercase tracking-[0.3em] italic opacity-60">Emisiones</h3>
                    </div>
                    <p className="text-5xl font-black text-white tracking-tighter italic leading-none">{data.quotesCount}</p>
                    <div className="mt-8 flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 group-hover:text-white transition-all italic">
                        <span>Ver Archivo</span>
                        <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform text-primary" />
                    </div>
                </button>

                <KPITile 
                    icon={<Award size={36} className="text-emerald-400" />}
                    label={isAdmin ? "Liquidaciones Netas" : "Incentivos Directos"}
                    value={fmt(data.commissionsTotal)}
                    meta="Status: Meta Activa"
                    progress={90}
                    accent="emerald"
                />
            </div>

            {/* Performance Analysis Protocol */}
            <div className="glass-panel border-white/10 shadow-[0_60px_120px_-30px_rgba(0,0,0,0.9)] overflow-hidden rounded-none-[4rem] relative z-10 backdrop-blur-[40px] border-t border-l border-white/5 ring-1 ring-white/5 group">
                <div className="p-16 border-b border-white/10 flex flex-col xl:flex-row justify-between items-center gap-14 bg-white/[0.03]">
                    <div className="text-center xl:text-left space-y-4">
                        <div className="flex items-center justify-center xl:justify-start gap-8">
                             <div className="p-6 bg-slate-900 rounded-none border border-white/10 shadow-2xl shadow-primary/20 group-hover:scale-110 transition-transform duration-500">
                                <BarChart3 className="text-primary" size={42} />
                            </div>
                            <h2 className="text-5xl font-black text-white uppercase tracking-tighter italic">
                                Gesti�n de ANÁLISIS <span className="text-primary underline decoration-primary/40 underline-offset-[12px]">GLOBAL</span>
                            </h2>
                        </div>
                        <p className="text-[12px] font-black text-slate-500 uppercase tracking-[0.5em] ml-2 italic opacity-60">Matriz de eficiencia neta vs Proyecciones de escalado Corporativo v4</p>
                    </div>
                    
                    <div className="flex glass-panel !bg-slate-950/80 p-3 rounded-none-[2rem] border-white/10 ring-1 ring-white/5 shadow-inner backdrop-blur-2xl">
                        {(["weekly", "monthly", "annual"] as const).map(p => (
                            <button 
                                key={p}
                                onClick={() => setChartPeriod(p)}
                                className={`px-12 py-5 text-[11px] font-black uppercase tracking-[0.3em] transition-all rounded-none-[1.5rem] relative ${chartPeriod === p ? 'bg-primary text-white shadow-[0_20px_40px_-10px_rgba(99,102,241,0.6)] italic z-10 scale-105' : 'text-slate-600 hover:text-white hover:bg-white/5'}`}
                            >
                                {p === "weekly" ? "Gesti�n Semanal" : p === "monthly" ? "Análisis Mensual" : "Detallesoría Anual"}
                            </button>
                        ))}
                    </div>
                </div>
                
                <div className="p-20 relative min-h-[650px]">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-secondary/10 blur-[150px] pointer-events-none animate-pulse" />
                    
                    <div className="h-[550px] w-full relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={currentChartData}>
                                <defs>
                                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.5} />
                                        <stop offset="50%" stopColor="#6366f1" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                    <filter id="premium-glow" height="200%">
                                        <feGaussianBlur in="SourceAlpha" stdDeviation="15" />
                                        <feOffset dx="0" dy="20" result="offsetblur" />
                                        <feComponentTransfer><feFuncA type="linear" slope="0.6"/></feComponentTransfer>
                                        <feMerge> 
                                            <feMergeNode />
                                            <feMergeNode in="SourceGraphic" /> 
                                        </feMerge>
                                    </filter>
                                </defs>
                                <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#ffffff08" />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fontSize: 11, fontWeight: '900', fill: "#475569", letterSpacing: '0.3em' }} 
                                    dy={35} 
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fontSize: 11, fontWeight: '900', fill: "#475569", letterSpacing: '0.1em' }} 
                                    tickFormatter={(v) => `$${(v/1000).toFixed(0)}K`} 
                                    dx={-35} 
                                />
                                <Tooltip 
                                    contentStyle={{ 
                                        borderRadius: '0px', 
                                        border: '1px solid rgba(255,255,255,0.15)', 
                                        background: 'rgba(2,6,23,0.98)', 
                                        backdropFilter: 'blur(50px)',
                                        padding: '30px',
                                        boxShadow: '0 50px 100px rgba(0,0,0,0.9)',
                                        fontFamily: 'inherit'
                                    }}
                                    itemStyle={{ fontSize: '16px', fontWeight: '900', color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.15em' }}
                                    labelStyle={{ color: '#64748b', fontSize: '11px', fontWeight: '900', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '0.4em' }}
                                    cursor={{ stroke: 'rgba(99,102,241,0.4)', strokeWidth: 3, strokeDasharray: '12 12' }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="total" 
                                    stroke="#6366f1" 
                                    strokeWidth={8} 
                                    fillOpacity={1} 
                                    fill="url(#colorTotal)" 
                                    animationDuration={3000}
                                    filter="url(#premium-glow)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                
                <div className="p-12 bg-slate-950/80 border-t border-white/10 flex flex-wrap justify-center gap-20 text-[11px] font-black uppercase tracking-[0.5em] text-slate-500 italic backdrop-blur-3xl">
                    <div className="flex items-center gap-5 group cursor-default text-white/40 hover:text-primary transition-colors"><div className="w-3.5 h-3.5 rounded-none bg-primary shadow-[0_0_12px_rgba(99,102,241,0.7)] group-hover:scale-125 transition-transform" /> Volumen Operativo</div>
                    <div className="flex items-center gap-5 group cursor-default text-white/40 hover:text-indigo-400 transition-colors"><div className="w-3.5 h-3.5 rounded-none bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.7)] group-hover:scale-125 transition-transform" /> Sincronía IA</div>
                    <div className="flex items-center gap-5 group cursor-default text-white/40 hover:text-emerald-400 transition-colors"><div className="w-3.5 h-3.5 rounded-none bg-emerald-500" /> Detallesoría GBL</div>
                </div>
            </div>

            {/* Quote Overlay - Redefined */}
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
                            transition={{ type: 'spring', damping: 35, stiffness: 350, mass: 1 }}
                            className="w-full md:w-[900px] h-full glass-panel !bg-slate-950/70 !border-l !border-white/15 relative flex flex-col shadow-[0_0_200px_rgba(0,0,0,1)] md:rounded-none-[5rem] overflow-hidden backdrop-blur-[100px]"
                        >
                            <div className="p-16 border-b border-white/10 flex justify-between items-center bg-white/[0.02] shrink-0">
                                <div className="flex items-center gap-10">
                                    <div className="p-7 bg-primary text-white rounded-none-[2rem] shadow-2xl shadow-primary/40 animate-pulse">
                                        <FileText size={36} />
                                    </div>
                                    <div>
                                        <h2 className="text-5xl font-black uppercase tracking-tighter text-white italic leading-tight">ARCHIVO <span className="text-primary">MAESTRO</span></h2>
                                        <p className="text-[12px] font-black text-slate-500 uppercase tracking-[0.6em] mt-3 italic opacity-80">
                                            {isAdmin ? "PROTOCOLOS OPERATIVOS CONSOLIDADOS v4" : "REGISTROS PERSONALES DE EMISIÓN TÁCTICA"}
                                        </p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setShowQuotesOverlay(false)} 
                                    className="p-6 bg-slate-900 border border-white/15 text-slate-500 hover:text-white hover:rotate-90 transition-all duration-700 rounded-none-[1.5rem] shadow-2xl group active:scale-90"
                                >
                                    <X size={40} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-16 space-y-16 custom-scrollbar-hidden scroll-smooth">
                                {isAdmin ? (
                                    data.quoteData.map((user: any) => (
                                        <div key={user.id} className="space-y-10 animate-in slide-in-from-bottom-20 duration-1000">
                                            <div className="flex items-center gap-8 glass-panel !bg-slate-900/40 border-white/15 p-8 rounded-none-[3rem] shadow-2xl border-l-[12px] border-l-secondary relative overflow-hidden group hover:!bg-slate-900/60 transition-all">
                                                <div className="absolute right-[-20px] top-[-20px] opacity-[0.05] text-white group-hover:scale-125 transition-transform duration-1000">
                                                    <User size={120} />
                                                </div>
                                                <div className="w-20 h-20 glass-panel !bg-slate-950 text-white flex items-center justify-center text-3xl font-black shadow-2xl rounded-none-[1.5rem] italic group-hover:rotate-6 transition-all border-white/10">
                                                    {user.name[0]}
                                                </div>
                                                <div className="space-y-2">
                                                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic leading-none">{user.name}</h3>
                                                    <span className="bg-white/5 text-slate-500 text-[10px] px-6 py-2 font-black uppercase tracking-[0.5em] border border-white/10 rounded-none mt-4 inline-block italic">
                                                        ID_SISTEMA: {user.id.slice(0,8)}
                                                    </span>
                                                </div>
                                                <div className="ms-auto flex flex-col items-end gap-2">
                                                    <span className="text-secondary text-2xl font-black italic tracking-tighter drop-shadow-sm">{user.count} PROTOCOLOS</span>
                                                    <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest italic opacity-60">Sincronía Verificada</span>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 gap-8 ps-12 border-l-4 border-white/5">
                                                {user.latest.map((q: any) => (
                                                    <QuoteRow key={q.id} quote={q} />
                                                ))}
                                                {user.latest.length === 0 && (
                                                    <div className="p-12 border border-dashed border-white/15 rounded-none-[2.5rem] text-[11px] text-slate-700 font-black uppercase tracking-[0.6em] italic flex items-center justify-center gap-6 opacity-40">
                                                        <ShieldAlert size={24} /> HISTORIAL DE EMISIÓN VACÍO
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="grid grid-cols-1 gap-10">
                                        {data.quoteData.map((q: any) => (
                                            <QuoteRow key={q.id} quote={q} />
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="p-14 border-t border-white/15 bg-white/[0.03] shrink-0 backdrop-blur-3xl">
                                <button 
                                    onClick={() => setShowQuotesOverlay(false)}
                                    className="w-full py-8 bg-primary text-white font-black uppercase tracking-[0.8em] text-[11px] italic skew-x-[-15deg] hover:skew-x-0 transition-all duration-700 shadow-[0_30px_70px_-15px_rgba(99,102,241,0.7)] rounded-none-[2rem] active:scale-95 group overflow-hidden relative"
                                >
                                    <span className="relative z-10 group-hover:tracking-[1em] transition-all">TERMINAR DetallesORÍA DE ARCHIVO</span>
                                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

function KPITile({ icon, label, value, meta, progress, accent }: { icon: any, label: string, value: string, meta: string, progress: number, accent: 'pink' | 'indigo' | 'emerald' }) {
    const accentColor = accent === 'pink' ? 'secondary' : accent === 'indigo' ? 'primary' : 'emerald-400'
    const shadowColor = accent === 'pink' ? 'rgba(236,72,153,0.5)' : accent === 'indigo' ? 'rgba(99,102,241,0.5)' : 'rgba(16,185,129,0.5)'
    const barGradient = accent === 'pink' ? 'from-secondary to-pink-400' : accent === 'indigo' ? 'from-primary to-indigo-400' : 'from-emerald-500 to-teal-400'

    return (
        <div className="glass-panel p-8 relative overflow-hidden hover:bg-white/[0.02] transition-all duration-500 rounded-none border-white/5 shadow-xl backdrop-blur-3xl ring-1 ring-white/5">
            <div className="flex justify-between items-start mb-10">
                <div className={`p-4 bg-slate-900/60 text-white shadow-lg border border-white/5 rounded-none`}>
                    {icon}
                </div>
                <span className={`text-[8px] font-black text-${accentColor} bg-${accentColor}/5 px-4 py-1.5 uppercase tracking-widest rounded-none border border-${accentColor}/10 italic`}>
                    {meta}
                </span>
            </div>
            <h3 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2 italic opacity-60">{label}</h3>
            <p className="text-4xl font-black text-white tracking-tighter italic leading-none">{value}</p>
            
            <div className="mt-8 h-1.5 w-full bg-slate-900 rounded-none overflow-hidden border border-white/5 shadow-inner relative">
                <div className={`h-full bg-gradient-to-r ${barGradient} rounded-none`} style={{ width: `${progress}%` }}></div>
            </div>
        </div>
    )
}

function QuoteRow({ quote }: { quote: any }) {
    return (
        <div className="flex items-center justify-between p-10 glass-panel !bg-slate-900/30 border-white/10 hover:!bg-white/[0.08] hover:border-secondary/50 transition-all group rounded-none-[2.5rem] shadow-2xl relative overflow-hidden border-t border-l border-white/5 backdrop-blur-xl">
            <div className="absolute left-0 top-0 w-2 h-full bg-secondary/10 group-hover:bg-secondary transition-all duration-500" />
            <div className="flex items-center gap-12">
                <div className="p-6 bg-slate-950/80 border border-white/15 text-slate-700 group-hover:text-secondary group-hover:rotate-12 transition-all rounded-none shadow-inner group-hover:scale-110">
                    <FileText size={32} />
                </div>
                <div>
                    <p className="text-2xl font-black text-white uppercase tracking-tighter italic group-hover:translate-x-3 transition-transform duration-500">{quote.quoteNumber}</p>
                    <div className="flex items-center gap-5 mt-3">
                        <div className="w-2 h-2 rounded-none bg-azure-500 shadow-[0_0_8px_rgba(45,212,191,0.6)]" />
                        <p className="text-[11px] text-slate-500 font-black uppercase tracking-[0.4em] italic opacity-80 group-hover:text-slate-300 transition-colors">{quote.client?.name || quote.clientName || 'CONSUMIDOR FINAL'}</p>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-20">
                <div className="text-right space-y-2">
                    <p className="text-3xl font-black text-white tracking-tighter italic group-hover:text-secondary transition-colors duration-500">{fmt(quote.total)}</p>
                    <p className="text-[11px] text-slate-600 font-black uppercase tracking-[0.5em] italic opacity-60">{new Date(quote.createdAt).toLocaleDateString()}</p>
                </div>
                <div className={`text-[10px] font-black px-8 py-3.5 rounded-none border-2 uppercase tracking-[0.5em] italic shadow-2xl transition-all duration-500 group-hover:scale-105 ${
                    quote.status === "ACCEPTED" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/10" :
                    quote.status === "SENT" ? "bg-primary/10 text-primary border-primary/20 shadow-primary/10" :
                    "bg-slate-800/10 text-slate-600 border-white/10"
                }`}>
                    {quote.status}
                </div>
            </div>
        </div>
    )
}


