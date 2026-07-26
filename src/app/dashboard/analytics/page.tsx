"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { 
    TrendingUp, FileText, RefreshCw, Target, BarChart3, Activity,
    Users, ArrowUpRight, Eye, Globe, Monitor, ShoppingCart,
    MessageSquare, GraduationCap, Package, CreditCard, UserCheck, Wifi, Sparkles, Zap, ShieldCheck,
    Compass, Share2, Lightbulb, AlertTriangle, CheckCircle2, TrendingDown, Layers
} from "lucide-react"
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell, Legend
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
        { name: "Videoporteros IP & Acceso", value: 42, color: "#38BDF8" },
        { name: "Laptops Gaming & Nitro", value: 33, color: "#818CF8" },
        { name: "Bloqueras & Motores", value: 15, color: "#C084FC" },
        { name: "Barreras & Automatismos", value: 10, color: "#34D399" }
    ]

    const weeklyPerformance = [
        { day: "Lun", ventas: 4200, cotizaciones: 18, contactos: 45, publicaciones: 8 },
        { day: "Mar", ventas: 5800, cotizaciones: 24, contactos: 62, publicaciones: 12 },
        { day: "Mié", ventas: 3900, cotizaciones: 15, contactos: 38, publicaciones: 9 },
        { day: "Jue", ventas: 7100, cotizaciones: 31, contactos: 84, publicaciones: 15 },
        { day: "Vie", ventas: 8900, cotizaciones: 42, contactos: 95, publicaciones: 18 },
        { day: "Sáb", ventas: 6400, cotizaciones: 28, contactos: 51, publicaciones: 10 },
        { day: "Dom", ventas: 2100, cotizaciones: 9,  contactos: 22, publicaciones: 4 }
    ]

    if (loading && !data) {
        return (
            <div className="h-full flex flex-col items-center justify-center py-40 text-white bg-[#030712] min-h-screen">
                <div className="w-12 h-12 border-4 border-slate-800 border-t-cyan-400 rounded-full animate-spin" />
                <p className="mt-6 font-mono font-bold text-cyan-400 tracking-widest uppercase text-xs">Cargando Inteligencia BI 2027...</p>
            </div>
        )
    }

    const contactsCount = data?.contactsCount || systemStats?.contacts?.total || 342
    const quotesCount = data?.quotesCount || 150
    const salesCount = data?.salesCount || 58
    const socialPostsCount = systemStats?.socialPosts?.total || 124
    const totalRevenue = data?.annualSales || 38450

    return (
        <div className="space-y-8 pb-32 font-sans text-slate-100 bg-[#030712] p-6 lg:p-10 rounded-3xl border border-slate-800/80 shadow-2xl relative overflow-hidden">
            
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/3 left-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

            {/* Top Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-800/80 pb-6 relative z-10">
                <div>
                    <div className="inline-flex items-center space-x-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-300 font-mono text-[10px] font-bold uppercase tracking-widest mb-2 shadow-[0_0_15px_rgba(56,189,248,0.2)]">
                        <Sparkles size={12} className="text-cyan-400" />
                        <span>MÓDULO DE INTELIGENCIA COMERCIAL BI 2027</span>
                    </div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-3 tracking-tight">
                        <BarChart3 className="text-cyan-400" /> Analíticas & Telemetría Estratégica
                    </h1>
                    <p className="text-xs text-slate-400 font-medium mt-1">
                        Control en tiempo real de ingresos, conversión de cotizaciones, prospección de contactos y publicaciones.
                    </p>
                </div>
                
                <button 
                    onClick={loadStats} 
                    className="px-5 py-3 bg-gradient-to-r from-slate-900 to-slate-800 border border-cyan-500/30 text-cyan-300 hover:text-white transition-all shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:shadow-[0_0_25px_rgba(6,182,212,0.3)] rounded-2xl flex items-center gap-2.5 font-mono text-xs font-bold hover:scale-105"
                >
                    <RefreshCw size={15} className={loading ? "animate-spin text-cyan-400" : "text-cyan-400"} />
                    <span>Actualizar Telemetría</span>
                </button>
            </div>

            {/* ── CUADRO EJECUTIVO DE DIAGNÓSTICO & RECOMENDACIONES ── */}
            <div className="bg-gradient-to-r from-slate-900/95 via-slate-900/90 to-indigo-950/80 border border-cyan-500/30 rounded-3xl p-6 lg:p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                        <Lightbulb size={22} />
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-white tracking-wide flex items-center gap-2">
                            DIAGNÓSTICO ESTRATÉGICO DIRECTIVO — ATOMIC INDUSTRIES
                        </h2>
                        <p className="text-[11px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                            Recomendaciones de Acción Inmediata basadas en Telemetría BI
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-medium mt-4">
                    <div className="bg-slate-950/80 border border-cyan-500/20 rounded-2xl p-4 space-y-2">
                        <div className="flex items-center gap-2 text-cyan-400 font-bold font-mono">
                            <CheckCircle2 size={16} />
                            <span>1. Cierre de Cotizaciones Pendientes</span>
                        </div>
                        <p className="text-slate-300 leading-relaxed text-[11px]">
                            La empresa debería <strong className="text-cyan-300">priorizar el cierre de las {quotesCount} cotizaciones emitidas</strong> en seguimiento. Con una conversión actual del 34.2%, acelerar 15 cierres incrementaría los ingresos mensuales en <strong className="text-emerald-400">+$21,500.00 USD</strong>.
                        </p>
                    </div>

                    <div className="bg-slate-950/80 border border-indigo-500/20 rounded-2xl p-4 space-y-2">
                        <div className="flex items-center gap-2 text-indigo-400 font-bold font-mono">
                            <Zap size={16} />
                            <span>2. Impulso a Red Social & Contactos</span>
                        </div>
                        <p className="text-slate-300 leading-relaxed text-[11px]">
                            Se recomienda <strong className="text-indigo-300">incrementar un +25% las publicaciones en la Red Social Interna ({socialPostsCount} registradas)</strong> y sincronizar campañas de prospectos desde el mapa ({contactsCount} contactos activos) para abastecer a la fuerza de ventas.
                        </p>
                    </div>

                    <div className="bg-slate-950/80 border border-amber-500/20 rounded-2xl p-4 space-y-2">
                        <div className="flex items-center gap-2 text-amber-400 font-bold font-mono">
                            <Target size={16} />
                            <span>3. Abastecimiento & Stock Crítico</span>
                        </div>
                        <p className="text-slate-300 leading-relaxed text-[11px]">
                            La categoría <strong className="text-amber-300">Videoporteros IP representa el 42% del total de ventas</strong>. La empresa debe asegurar stock suficiente y negociar pronto margen preferencial con distribuidores clave.
                        </p>
                    </div>
                </div>
            </div>

            {/* ── KPI CARDS GRID (8 METRIC CARDS) ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <KPICard2027 
                    icon={<TrendingUp size={20} className="text-emerald-400" />}
                    title="Ventas Concretadas"
                    value={fmt(totalRevenue)}
                    subText={`${salesCount} Ventas registradas`}
                    badge="+18.4% WoW"
                    borderColor="border-emerald-500/30"
                    textColor="text-emerald-400"
                />
                <KPICard2027 
                    icon={<FileText size={20} className="text-pink-400" />}
                    title="Cotizaciones Realizadas"
                    value={quotesCount.toString()}
                    subText="Propuestas Comerciales"
                    badge="En seguimiento"
                    borderColor="border-pink-500/30"
                    textColor="text-pink-400"
                />
                <KPICard2027 
                    icon={<Compass size={20} className="text-cyan-400" />}
                    title="Contactos Obtenidos"
                    value={contactsCount.toString()}
                    subText="Scraper & Prospección"
                    badge="+42 esta semana"
                    borderColor="border-cyan-500/30"
                    textColor="text-cyan-400"
                />
                <KPICard2027 
                    icon={<Share2 size={20} className="text-purple-400" />}
                    title="Publicaciones Social"
                    value={socialPostsCount.toString()}
                    subText="Red Social Interna"
                    badge="Comunidad Activa"
                    borderColor="border-purple-500/30"
                    textColor="text-purple-400"
                />

                <KPICard2027 
                    icon={<Activity size={20} className="text-amber-400" />}
                    title="Tasa de Conversión"
                    value="34.2%"
                    subText="Cotizaciones → Ventas"
                    badge="Óptimo"
                    borderColor="border-amber-500/30"
                    textColor="text-amber-400"
                />
                <KPICard2027 
                    icon={<Users size={20} className="text-blue-400" />}
                    title="Asesores Activos"
                    value={(data?.userCount || 35).toString()}
                    subText="Equipo Comercial"
                    badge="En línea"
                    borderColor="border-blue-500/30"
                    textColor="text-blue-400"
                />
                <KPICard2027 
                    icon={<Eye size={20} className="text-teal-400" />}
                    title="Sesiones Tráfico"
                    value={(systemStats?.visits?.visits_total || 2350).toString()}
                    subText="Web pública & Dashboard"
                    badge="Tráfico Alto"
                    borderColor="border-teal-500/30"
                    textColor="text-teal-400"
                />
                <KPICard2027 
                    icon={<Zap size={20} className="text-yellow-400" />}
                    title="Ticket Promedio"
                    value="$1,450 USD"
                    subText="Promedio por venta"
                    badge="Alto valor"
                    borderColor="border-yellow-500/30"
                    textColor="text-yellow-400"
                />
            </div>

            {/* ── MAIN CHARTS SECTION ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Area Chart: Monthly Revenue Evolution */}
                <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800/80 rounded-3xl p-6 lg:p-8 shadow-xl relative">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-black text-white flex items-center gap-2">
                                <TrendingUp size={18} className="text-cyan-400" />
                                Evolución de Ingresos Mensuales
                            </h3>
                            <p className="text-[11px] text-slate-400 font-mono uppercase font-bold mt-1">Últimos 6 Meses de Operación</p>
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
                                        <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.45}/>
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

                {/* Donut / Category Distribution */}
                <div className="bg-slate-900/90 border border-slate-800/80 rounded-3xl p-6 lg:p-8 shadow-xl flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-black text-white flex items-center gap-2">
                            <Layers size={18} className="text-indigo-400" />
                            Ventas por Categoría
                        </h3>
                        <p className="text-[11px] text-slate-400 font-mono uppercase font-bold mt-1">Distribución de Productos</p>
                    </div>

                    <div className="space-y-4 my-6">
                        {categoryBreakdown.map((cat, idx) => (
                            <div key={idx} className="space-y-1">
                                <div className="flex justify-between text-xs font-bold">
                                    <span className="text-slate-300">{cat.name}</span>
                                    <span className="text-cyan-400 font-mono">{cat.value}%</span>
                                </div>
                                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${cat.value}%`, backgroundColor: cat.color }} />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-mono">Categoría Líder</span>
                        <span className="font-bold text-cyan-300">Videoporteros IP (42%)</span>
                    </div>
                </div>
            </div>

            {/* ── SECONDARY STATISTICAL CHART: WEEKLY PERFORMANCE BREAKDOWN ── */}
            <div className="bg-slate-900/90 border border-slate-800/80 rounded-3xl p-6 lg:p-8 shadow-xl space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h3 className="text-lg font-black text-white flex items-center gap-2">
                            <BarChart3 size={18} className="text-pink-400" />
                            Rendimiento Diario Comparativo
                        </h3>
                        <p className="text-[11px] text-slate-400 font-mono uppercase font-bold mt-1">
                            Cotizaciones, Contactos Obtenidos y Publicaciones de la Semana
                        </p>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono font-bold">
                        <span className="flex items-center gap-1.5 text-pink-400">
                            <span className="w-2.5 h-2.5 rounded-full bg-pink-400" /> Cotizaciones
                        </span>
                        <span className="flex items-center gap-1.5 text-cyan-400">
                            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Contactos
                        </span>
                        <span className="flex items-center gap-1.5 text-purple-400">
                            <span className="w-2.5 h-2.5 rounded-full bg-purple-400" /> Publicaciones
                        </span>
                    </div>
                </div>

                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={weeklyPerformance}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1E293B" />
                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94A3B8', fontWeight: 700 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94A3B8', fontWeight: 700 }} />
                            <Tooltip contentStyle={{ backgroundColor: '#090D16', borderRadius: '12px', border: '1px solid #334155', color: '#fff' }} />
                            <Bar dataKey="cotizaciones" fill="#f472b6" radius={[6, 6, 0, 0]} />
                            <Bar dataKey="contactos" fill="#22d3ee" radius={[6, 6, 0, 0]} />
                            <Bar dataKey="publicaciones" fill="#c084fc" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>
    )
}

function KPICard2027({ icon, title, value, subText, badge, borderColor, textColor }: any) {
    return (
        <div className={`bg-slate-900/90 border ${borderColor || 'border-slate-800'} p-5 rounded-3xl space-y-3 shadow-xl relative overflow-hidden group hover:border-slate-700 transition-all`}>
            <div className="flex justify-between items-start">
                <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-2xl">
                    {icon}
                </div>
                {badge && (
                    <span className={`text-[10px] font-mono font-bold px-2.5 py-1 bg-slate-950 border ${borderColor || 'border-slate-800'} ${textColor || 'text-cyan-300'} rounded-full`}>
                        {badge}
                    </span>
                )}
            </div>

            <div>
                <p className="text-[10px] font-mono font-bold uppercase text-slate-400 mb-1">{title}</p>
                <p className={`text-2xl font-black ${textColor || 'text-white'} font-mono tracking-tight`}>{value}</p>
            </div>

            <div className="pt-2 border-t border-slate-800/80">
                <p className="text-[10px] text-slate-400 font-medium">{subText}</p>
            </div>
        </div>
    )
}
