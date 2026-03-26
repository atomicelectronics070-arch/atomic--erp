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
        return <div className="h-screen flex items-center justify-center font-bold text-orange-600 animate-pulse tracking-widest uppercase">Arquitectando Centro de Control...</div>
    }

    const currentChartData = chartPeriod === "weekly" ? data.charts.weekly : chartPeriod === "monthly" ? data.charts.monthly : data.charts.annual

    return (
        <div className="space-y-12 pb-20 animate-in fade-in duration-700">
            {/* Header section with Premium feel */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-neutral-100 pb-10">
                <div>
                    <h1 className="text-5xl font-extrabold tracking-tighter text-neutral-900 uppercase">
                        Centro de <span className="text-orange-600">Control</span>
                    </h1>
                    <div className="flex items-center gap-3 mt-2">
                        <span className="bg-neutral-900 text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest">Inteligencia de Negocio</span>
                        <p className="text-neutral-400 font-medium text-sm">Vista consolidada de indicadores tácticos y financieros.</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-6">
                    <button onClick={loadStats} className="p-3 bg-neutral-50 hover:bg-orange-50 text-neutral-400 hover:text-orange-600 transition-all rounded-full border border-neutral-100">
                        <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                    </button>
                    <div className="flex items-center gap-4 bg-white border border-neutral-200 p-3 shadow-sm hover:shadow-md transition-all">
                        <div className="w-12 h-12 bg-neutral-900 text-white flex items-center justify-center font-bold text-xl ring-4 ring-neutral-50">
                            {session.user?.name?.[0]}
                        </div>
                        <div>
                            <p className="text-[9px] font-bold text-orange-600 uppercase tracking-[0.2em]">{role}</p>
                            <p className="text-sm font-bold text-neutral-900">{session.user?.name}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* 1. Annual Sales */}
                <div className="bg-white p-8 border border-neutral-200 shadow-sm relative overflow-hidden group hover:border-orange-200 transition-all">
                    <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <DollarSign size={120} />
                    </div>
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-neutral-900 text-white shadow-lg shadow-neutral-200">
                            <TrendingUp size={24} />
                        </div>
                        <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 uppercase">Año 2026</span>
                    </div>
                    <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Total Ventas Anual</h3>
                    <div className="flex items-baseline gap-2">
                        <p className="text-3xl font-black text-neutral-950 tracking-tighter">{fmt(data.annualSales)}</p>
                    </div>
                    <div className="mt-6 h-1 w-full bg-neutral-100">
                        <div className="h-full bg-orange-600" style={{ width: '65%' }}></div>
                    </div>
                    <p className="text-[9px] font-bold text-neutral-400 uppercase mt-2 tracking-widest">65% de la meta proyectada</p>
                </div>

                {/* 2. Quarter Sales */}
                <div className="bg-white p-8 border border-neutral-200 shadow-sm relative overflow-hidden group hover:border-orange-200 transition-all">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-neutral-900 text-white">
                            <Calendar size={24} />
                        </div>
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 uppercase">Primer Trimestre</span>
                    </div>
                    <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Facturación Neta (Q1)</h3>
                    <p className="text-3xl font-black text-neutral-950 tracking-tighter">{fmt(data.quarterSales)}</p>
                    <div className="flex items-center gap-2 mt-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                        <CheckCircle2 size={12} className="text-green-500" />
                        <span>{data.quarterCount} Ventas Realizadas</span>
                    </div>
                </div>

                {/* 3. Quotes (Interactive) */}
                <button 
                    onClick={() => setShowQuotesOverlay(true)}
                    className="bg-neutral-950 p-8 text-white shadow-xl relative overflow-hidden text-left hover:bg-neutral-900 transition-all border-b-4 border-orange-600"
                >
                    <div className="absolute right-0 bottom-0 opacity-10">
                        <FileText size={100} />
                    </div>
                    <h3 className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-1">Cotizaciones Históricas</h3>
                    <p className="text-5xl font-black text-white tracking-tighter">{data.quotesCount}</p>
                    <div className="mt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-neutral-400 group">
                        <span>Ver desglose completo</span>
                        <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                </button>

                {/* 4. Commissions */}
                <div className="bg-white p-8 border border-neutral-200 shadow-sm group hover:border-orange-200 transition-all">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-orange-600 text-white shadow-lg shadow-orange-100">
                            <Award size={24} />
                        </div>
                    </div>
                    <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">
                        {isAdmin ? "Comisiones Emitidas" : "Comisiones Obtenidas"}
                    </h3>
                    <p className="text-3xl font-black text-neutral-950 tracking-tighter">{fmt(data.commissionsTotal)}</p>
                    <p className="text-[10px] font-bold text-green-600 uppercase mt-4">Total Acumulado a la fecha</p>
                </div>
            </div>

            {/* Performance Charts */}
            <div className="bg-white border border-neutral-200 shadow-sm overflow-hidden">
                <div className="p-10 border-b border-neutral-100 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <h2 className="text-2xl font-bold text-neutral-900 uppercase tracking-tight flex items-center gap-3">
                            <BarChart3 className="text-orange-600" size={28} />
                            Análisis de Rendimiento Operativo
                        </h2>
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-1">Comparativa de ingresos y efectividad comercial.</p>
                    </div>
                    <div className="flex bg-neutral-100 p-1 group">
                        {(["weekly", "monthly", "annual"] as const).map(p => (
                            <button 
                                key={p}
                                onClick={() => setChartPeriod(p)}
                                className={`px-6 py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${chartPeriod === p ? 'bg-white text-neutral-950 shadow-sm' : 'text-neutral-400 hover:text-neutral-600'}`}
                            >
                                {p === "weekly" ? "Semanal" : p === "monthly" ? "Mensual" : "Anual"}
                            </button>
                        ))}
                    </div>
                </div>
                
                <div className="p-10">
                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={currentChartData}>
                                <defs>
                                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ea580c" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#ea580c" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: "#9ca3af" }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: "#9ca3af" }} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '0', border: '1px solid #e5e7eb', background: '#fff', padding: '15px' }}
                                    itemStyle={{ fontSize: '12px', fontWeight: 'bold', color: '#ea580c' }}
                                />
                                <Area type="monotone" dataKey="total" stroke="#ea580c" strokeWidth={4} fillOpacity={1} fill="url(#colorTotal)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Quote Overlay / Detail Section */}
            {showQuotesOverlay && (
                <div className="fixed inset-0 z-50 flex items-center justify-end animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm" onClick={() => setShowQuotesOverlay(false)}></div>
                    <div className="w-full max-w-4xl h-full bg-white shadow-2xl relative flex flex-col animate-in slide-in-from-right duration-500">
                        <div className="p-8 border-b border-neutral-100 flex justify-between items-center bg-neutral-950 text-white">
                            <div>
                                <h2 className="text-2xl font-bold uppercase tracking-tight">Archivo de Cotizaciones</h2>
                                <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mt-1">
                                    {isAdmin ? "Vista Administrativa: Todos los Usuarios" : "Mis Registros Históricos"}
                                </p>
                            </div>
                            <button onClick={() => setShowQuotesOverlay(false)} className="w-10 h-10 bg-neutral-800 flex items-center justify-center hover:bg-orange-600 transition-all">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-10 space-y-10">
                            {isAdmin ? (
                                // Admin Grouped View
                                data.quoteData.map((user: any) => (
                                    <div key={user.id} className="space-y-4">
                                        <div className="flex items-center gap-4 bg-neutral-50 p-4 border-l-4 border-orange-600">
                                            <div className="w-8 h-8 bg-neutral-900 text-white flex items-center justify-center text-xs font-bold font-mono">
                                                {user.name[0]}
                                            </div>
                                            <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-widest">{user.name}</h3>
                                            <span className="ms-auto bg-neutral-200 text-neutral-600 text-[10px] px-3 py-1 font-bold">
                                                {user.count} COTIZACIONES
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-1 gap-3">
                                            {user.latest.map((q: any) => (
                                                <QuoteRow key={q.id} quote={q} />
                                            ))}
                                            {user.latest.length === 0 && <p className="text-[10px] text-neutral-400 font-bold italic py-4">Este usuario no tiene cotizaciones registradas.</p>}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                // Personal List View
                                <div className="grid grid-cols-1 gap-4">
                                    {data.quoteData.map((q: any) => (
                                        <QuoteRow key={q.id} quote={q} />
                                    ))}
                                    {data.quoteData.length === 0 && (
                                        <div className="text-center py-20 bg-neutral-50 border border-dashed border-neutral-200">
                                            <FileText className="mx-auto text-neutral-200 mb-4" size={48} />
                                            <p className="text-neutral-400 font-bold text-sm uppercase">Aún no has generado ninguna cotización profesional.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function QuoteRow({ quote }: { quote: any }) {
    return (
        <div className="flex items-center justify-between p-5 bg-white border border-neutral-100 hover:border-orange-200 transition-all group">
            <div className="flex items-center gap-6">
                <div className="p-2 bg-neutral-50 text-neutral-400 group-hover:text-orange-600 transition-colors">
                    <FileText size={18} />
                </div>
                <div>
                    <p className="text-xs font-black text-neutral-900 uppercase">{quote.quoteNumber}</p>
                    <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-tight">{quote.client?.name || quote.clientName || 'Consumidor Final'}</p>
                </div>
            </div>
            <div className="flex items-center gap-10">
                <div className="text-right">
                    <p className="text-sm font-bold text-neutral-900 tracking-tighter">{fmt(quote.total)}</p>
                    <p className="text-[9px] text-neutral-400 font-bold uppercase">{new Date(quote.createdAt).toLocaleDateString()}</p>
                </div>
                <div className={`text-[9px] font-bold px-3 py-1 border uppercase tracking-widest ${
                    quote.status === "ACCEPTED" ? "bg-green-50 text-green-600 border-green-100" :
                    quote.status === "SENT" ? "bg-blue-50 text-blue-600 border-blue-100" :
                    "bg-neutral-50 text-neutral-400 border-neutral-100"
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
