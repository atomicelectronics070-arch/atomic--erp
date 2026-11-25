"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import {
    Activity, Users, ShoppingCart, Eye, Globe, Bot, Sparkles,
    RefreshCw, TrendingUp, Smartphone, Monitor, ShieldAlert,
    UserCheck, Briefcase, Home, Cpu, ArrowLeft, ExternalLink,
    AlertTriangle, BrainCircuit, MessageSquare, FileText, Package,
    GraduationCap, ShoppingBag, Clock
} from "lucide-react"
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, BarChart, Bar, Cell
} from "recharts"

const fmtCurrency = (val: number) =>
    new Intl.NumberFormat("es-EC", { style: "currency", currency: "USD" }).format(val || 0)

const CAMPAIGN_META: Record<string, { label: string; color: string; badge: string; desc: string }> = {
    MARCA_PERSONAL: {
        label: "Marca Personal (Santiago)",
        color: "#F59E0B",
        badge: "bg-amber-500/15 text-amber-300 border-amber-500/30",
        desc: "TikTok personal, bio y YouTube"
    },
    ATOMIC_SYSTEMS: {
        label: "Atomic Systems (Industrial/Seguridad)",
        color: "#06B6D4",
        badge: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
        desc: "Videoporteros, barreras, CCTV, acceso"
    },
    ATOMIC_RESIDENCIAL: {
        label: "Atomic Residencial (Domótica/Hogar)",
        color: "#A855F7",
        badge: "bg-purple-500/15 text-purple-300 border-purple-500/30",
        desc: "Cerraduras smart, hogar y cocina"
    },
    EMPLEO: {
        label: "Campaña de Empleo & Talento",
        color: "#10B981",
        badge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
        desc: "Convocatorias y /contrataciones"
    },
    CATALOGO_GENERAL: {
        label: "Catálogo & Dominio General",
        color: "#6366F1",
        badge: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
        desc: "Tráfico orgánico / cotizador"
    }
}

export default function TelemetrySupervisionPage() {
    const { data: session } = useSession()
    const [days, setDays] = useState<number>(7)
    const [report, setReport] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState<"overview" | "carts" | "visitors" | "users">("overview")

    const role = String((session?.user as any)?.role || "").toUpperCase()
    const isAuthorized =
        role.includes("ADMIN") ||
        role.includes("MANAGEMENT") ||
        role.includes("COORDINATOR") ||
        role.includes("SUPERVISOR")

    const loadReport = async (selectedDays = days) => {
        setLoading(true)
        setError(null)
        try {
            const res = await fetch(`/api/admin/telemetry?days=${selectedDays}`, { cache: "no-store" })
            if (!res.ok) {
                const err = await res.json().catch(() => ({}))
                throw new Error(err.error || "No se pudo obtener la telemetría")
            }
            const data = await res.json()
            setReport(data)
        } catch (e: any) {
            setError(e.message || "Error al cargar datos")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (session && isAuthorized) {
            loadReport(days)
        }
    }, [session, days, isAuthorized])

    if (session && !isAuthorized) {
        return (
            <div className="max-w-2xl mx-auto py-24 text-center space-y-4">
                <ShieldAlert size={48} className="mx-auto text-red-400" />
                <h1 className="text-xl font-black text-white">Acceso Restringido a Supervisión</h1>
                <p className="text-sm text-slate-400">
                    Este centro de telemetría y píxel inteligente está reservado para Administración, Supervisión y Gerencia.
                </p>
                <Link href="/dashboard" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-cyan-300 text-xs font-bold">
                    <ArrowLeft size={14} /> Volver al Dashboard
                </Link>
            </div>
        )
    }

    const today = report?.todayStats || { today_views: 0, today_visitors: 0, today_buyers: 0, today_sellers: 0, today_guests: 0 }
    const cartStats = report?.cartStats || { total_carts: 0, abandoned_carts: 0, total_cart_value: 0, active_carts_with_items: 0 }
    const userBase = report?.userBase || { total: 0, buyers: 0, sellers: 0, rolesBreakdown: [], recentRegistrations: [] }
    const ai = report?.aiAndPlatform || { quotesCount: 0, webOrdersCount: 0, waConversationsCount: 0, waMessagesCount: 0, personalBotUsersCount: 0, personalBotMessagesCount: 0, activeProductsCount: 0, clientsCount: 0, enrollmentsCount: 0 }
    const campaigns = (report?.campaignTraffic || []).map((c: any) => ({
        ...c,
        meta: CAMPAIGN_META[c.campaign_tag] || CAMPAIGN_META.CATALOGO_GENERAL
    }))

    return (
        <div className="space-y-6 pb-20">
            {/* Header Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900/75 border border-cyan-500/25 rounded-3xl p-6 backdrop-blur-xl shadow-2xl">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-indigo-600/30 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shrink-0 shadow-[0_0_20px_rgba(6,182,212,0.25)]">
                        <Activity size={24} />
                    </div>
                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                                Centro de Telemetría & Píxel Inteligente
                            </h1>
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono font-bold flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                PÍXEL ACTIVO EN DOMINIO
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                            Mapeo exacto de tráfico en <span className="text-cyan-300 font-mono">atomiccotizador.shop</span> • Campañas Alex & Santiago • Carritos Casi Comprados • Usuarios & IAs
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                    {[7, 14, 30].map((d) => (
                        <button
                            key={d}
                            type="button"
                            onClick={() => setDays(d)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                                days === d
                                    ? "bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                                    : "bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700"
                            }`}
                        >
                            {d} días
                        </button>
                    ))}
                    <button
                        type="button"
                        onClick={() => loadReport(days)}
                        disabled={loading}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
                    >
                        <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                        <span>Actualizar</span>
                    </button>
                </div>
            </div>

            {error && (
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm font-medium">
                    ⚠️ {error}
                </div>
            )}

            {/* Intelligent BI Executive Report */}
            {report?.intelligentReport && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-950/60 to-slate-900/90 border border-cyan-500/30 space-y-2">
                        <div className="flex items-center gap-2 text-cyan-300 text-xs font-black uppercase tracking-wider">
                            <BrainCircuit size={16} />
                            <span>Diagnóstico Ejecutivo IA</span>
                        </div>
                        <p className="text-xs text-slate-200 leading-relaxed">
                            {report.intelligentReport.resumenEjecutivo}
                        </p>
                    </div>
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/60 to-slate-900/90 border border-indigo-500/30 space-y-2">
                        <div className="flex items-center gap-2 text-indigo-300 text-xs font-black uppercase tracking-wider">
                            <Sparkles size={16} />
                            <span>Estrategia Marketing (Alex & CTAs)</span>
                        </div>
                        <p className="text-xs text-slate-200 leading-relaxed">
                            {report.intelligentReport.recomendacionMarketing}
                        </p>
                    </div>
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-950/50 to-slate-900/90 border border-amber-500/30 space-y-2">
                        <div className="flex items-center gap-2 text-amber-300 text-xs font-black uppercase tracking-wider">
                            <AlertTriangle size={16} />
                            <span>Alerta Carritos & Conversión</span>
                        </div>
                        <p className="text-xs text-slate-200 leading-relaxed">
                            {report.intelligentReport.alertaConversion}
                        </p>
                    </div>
                </div>
            )}

            {/* Top KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
                <KpiCard
                    icon={<Eye size={18} className="text-cyan-400" />}
                    label="Impactos Hoy"
                    value={today.today_views}
                    sub={`${today.today_visitors} visitantes únicos`}
                    accent="border-cyan-500/30"
                />
                <KpiCard
                    icon={<Globe size={18} className="text-indigo-400" />}
                    label="Público vs Equipo Hoy"
                    value={`${today.today_guests} / ${today.today_buyers + today.today_sellers}`}
                    sub={`${today.today_buyers} compradores • ${today.today_sellers} vendedores`}
                    accent="border-indigo-500/30"
                />
                <KpiCard
                    icon={<ShoppingCart size={18} className="text-amber-400" />}
                    label="Carritos Casi Comprados"
                    value={cartStats.abandoned_carts}
                    sub={`${fmtCurrency(cartStats.total_cart_value)} recuperables`}
                    accent="border-amber-500/30"
                />
                <KpiCard
                    icon={<Users size={18} className="text-emerald-400" />}
                    label="Usuarios Registrados"
                    value={userBase.total}
                    sub={`${userBase.buyers} compradores • ${userBase.sellers} vendedores`}
                    accent="border-emerald-500/30"
                />
                <KpiCard
                    icon={<Bot size={18} className="text-purple-400" />}
                    label="Actividad Bots / IAs"
                    value={ai.waMessagesCount + ai.personalBotMessagesCount}
                    sub={`${ai.waConversationsCount} chats WA • ${ai.personalBotUsersCount} bots`}
                    accent="border-purple-500/30"
                />
                <KpiCard
                    icon={<FileText size={18} className="text-rose-400" />}
                    label="Cotizaciones & Pedidos"
                    value={ai.quotesCount}
                    sub={`${ai.webOrdersCount} pedidos web • ${ai.clientsCount} clientes`}
                    accent="border-rose-500/30"
                />
            </div>

            {/* Sub-Tabs */}
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
                {[
                    { id: "overview", label: "Tráfico, Campañas & IAs", icon: <TrendingUp size={14} /> },
                    { id: "carts", label: `Carritos Casi Comprados (${report?.recentCarts?.length || 0})`, icon: <ShoppingCart size={14} /> },
                    { id: "visitors", label: `Mapeo en Vivo (${report?.recentVisitors?.length || 0})`, icon: <Activity size={14} /> },
                    { id: "users", label: `Registrados, Compradores & Vendedores (${userBase.total})`, icon: <UserCheck size={14} /> }
                ].map((t) => (
                    <button
                        key={t.id}
                        type="button"
                        onClick={() => setActiveTab(t.id as any)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer ${
                            activeTab === t.id
                                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                                : "bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800"
                        }`}
                    >
                        {t.icon}
                        <span>{t.label}</span>
                    </button>
                ))}
            </div>

            {/* TAB: OVERVIEW */}
            {activeTab === "overview" && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                        {/* Daily Visitors Chart */}
                        <div className="xl:col-span-2 bg-slate-900/70 border border-slate-800 rounded-3xl p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-black text-white uppercase tracking-wider">
                                        Tráfico Diario al Dominio (Últimos {days} días)
                                    </h3>
                                    <p className="text-xs text-slate-400">Impactos totales vs Visitantes únicos diarios</p>
                                </div>
                            </div>
                            <div className="h-[290px] w-full">
                                {report?.dailyVisits?.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={report.dailyVisits}>
                                            <defs>
                                                <linearGradient id="gradViews" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4} />
                                                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                                                </linearGradient>
                                                <linearGradient id="gradUnique" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#818CF8" stopOpacity={0.4} />
                                                    <stop offset="95%" stopColor="#818CF8" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                                            <XAxis dataKey="label" stroke="#94A3B8" fontSize={11} />
                                            <YAxis stroke="#94A3B8" fontSize={11} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: "#0F172A", borderColor: "#334155", borderRadius: "12px", fontSize: "12px", color: "#fff" }}
                                            />
                                            <Area type="monotone" dataKey="total_views" name="Vistas Totales" stroke="#06B6D4" fillOpacity={1} fill="url(#gradViews)" strokeWidth={2} />
                                            <Area type="monotone" dataKey="unique_visitors" name="Visitantes Únicos" stroke="#818CF8" fillOpacity={1} fill="url(#gradUnique)" strokeWidth={2} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs">
                                        <Activity size={32} className="mb-2 opacity-40" />
                                        Aún no hay impactos registrados en el rango seleccionado. El píxel ya está capturando nuevas visitas.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Campaign Breakdown */}
                        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 space-y-4">
                            <div>
                                <h3 className="text-sm font-black text-white uppercase tracking-wider">
                                    Atribución por Campaña / CTA
                                </h3>
                                <p className="text-xs text-slate-400">Marca Personal, Systems, Residencial, Empleo</p>
                            </div>

                            {campaigns.length === 0 ? (
                                <div className="py-12 text-center text-xs text-slate-500">
                                    Sin datos de campañas todavía. Usa parámetros <code className="text-cyan-300">?utm_campaign=personal</code>, <code className="text-cyan-300">systems</code>, <code className="text-cyan-300">residencial</code> o <code className="text-cyan-300">empleo</code>.
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {campaigns.map((c: any) => (
                                        <div key={c.campaign_tag} className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className={`px-2 py-0.5 rounded-md border text-[10px] font-black ${c.meta.badge}`}>
                                                    {c.meta.label}
                                                </span>
                                                <span className="text-xs font-mono font-black text-white">
                                                    {c.total_hits} hits
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-[11px] text-slate-400">
                                                <span>{c.meta.desc}</span>
                                                <span className="font-mono text-cyan-300">{c.unique_visitors} únicos</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Platform & AI Ecosystem Data */}
                    <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 space-y-4">
                        <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                            <Cpu size={16} className="text-purple-400" />
                            <span>Ecosistema IA, Catálogo & Operación Completa</span>
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                            <MiniMetric icon={<MessageSquare size={14} className="text-emerald-400" />} label="Chats WhatsApp" value={ai.waConversationsCount} />
                            <MiniMetric icon={<Bot size={14} className="text-cyan-400" />} label="Mensajes WA/IA" value={ai.waMessagesCount} />
                            <MiniMetric icon={<Sparkles size={14} className="text-purple-400" />} label="Bots Personales" value={ai.personalBotUsersCount} />
                            <MiniMetric icon={<BrainCircuit size={14} className="text-indigo-400" />} label="Prompts IA Bot" value={ai.personalBotMessagesCount} />
                            <MiniMetric icon={<Package size={14} className="text-amber-400" />} label="Productos Activos" value={ai.activeProductsCount} />
                            <MiniMetric icon={<FileText size={14} className="text-sky-400" />} label="Cotizaciones" value={ai.quotesCount} />
                            <MiniMetric icon={<ShoppingBag size={14} className="text-rose-400" />} label="Pedidos Web" value={ai.webOrdersCount} />
                            <MiniMetric icon={<GraduationCap size={14} className="text-teal-400" />} label="Academia Inscritos" value={ai.enrollmentsCount} />
                        </div>
                    </div>
                </div>
            )}

            {/* TAB: ABANDONED CARTS */}
            {activeTab === "carts" && (
                <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                        <div>
                            <h3 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                                <ShoppingCart size={18} className="text-amber-400" />
                                <span>Carritos Casi Comprados & En Proceso</span>
                            </h3>
                            <p className="text-xs text-slate-400">
                                Capturados automáticamente por CartContext con productos, monto total y estado del visitante.
                            </p>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] font-mono uppercase text-slate-400 block">Valor Total en Carritos</span>
                            <span className="text-lg font-black font-mono text-amber-400">{fmtCurrency(cartStats.total_cart_value)}</span>
                        </div>
                    </div>

                    {!report?.recentCarts?.length ? (
                        <div className="py-16 text-center text-sm text-slate-500">
                            No hay carritos activos o abandonados con productos en este momento.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="border-b border-slate-800 text-[10px] font-mono uppercase text-slate-400">
                                        <th className="py-3 px-3">Visitante / Usuario</th>
                                        <th className="py-3 px-3">Estado</th>
                                        <th className="py-3 px-3">Items</th>
                                        <th className="py-3 px-3">Monto</th>
                                        <th className="py-3 px-3">Campaña / Ruta</th>
                                        <th className="py-3 px-3">Última Acción</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/70">
                                    {report.recentCarts.map((cart: any) => {
                                        const items = Array.isArray(cart.items_data) ? cart.items_data : []
                                        return (
                                            <tr key={cart.id} className="hover:bg-slate-800/40">
                                                <td className="py-3 px-3">
                                                    <div className="font-bold text-white">
                                                        {cart.user_name || "Visitante Anónimo"}
                                                    </div>
                                                    <div className="text-[11px] text-slate-400 font-mono">
                                                        {cart.user_email || cart.user_phone || cart.visitor_id?.slice(0, 12)}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-3">
                                                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                                                        cart.status === "ABANDONADO"
                                                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                                            : cart.status === "COMPRADO"
                                                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                                            : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                                                    }`}>
                                                        {cart.status}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-3">
                                                    <div className="font-bold text-slate-200">{cart.items_count} productos</div>
                                                    <div className="text-[11px] text-slate-400 truncate max-w-[240px]">
                                                        {items.map((it: any) => `${it.quantity}x ${it.name}`).join(", ")}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-3 font-mono font-black text-emerald-400">
                                                    {fmtCurrency(cart.total_amount)}
                                                </td>
                                                <td className="py-3 px-3">
                                                    <div className="text-[10px] font-bold text-cyan-300">{cart.campaign_tag}</div>
                                                    <div className="text-[11px] text-slate-500 truncate max-w-[160px]">{cart.source_url || "/"}</div>
                                                </td>
                                                <td className="py-3 px-3 text-slate-400">
                                                    <div>{cart.last_action}</div>
                                                    <div className="text-[10px] font-mono text-slate-500">
                                                        {new Date(cart.updated_at).toLocaleString()}
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* TAB: LIVE VISITORS */}
            {activeTab === "visitors" && (
                <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 space-y-4">
                    <div className="border-b border-slate-800 pb-4">
                        <h3 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                            <Activity size={18} className="text-cyan-400" />
                            <span>Mapeo Exacto de Visitantes Recientes (Últimos 50 impactos)</span>
                        </h3>
                        <p className="text-xs text-slate-400">
                            Cada página visitada en el dominio o dashboard queda trazada con usuario/rol, dispositivo, campaña y ruta.
                        </p>
                    </div>

                    {!report?.recentVisitors?.length ? (
                        <div className="py-16 text-center text-sm text-slate-500">
                            Esperando primeros impactos del píxel...
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="border-b border-slate-800 text-[10px] font-mono uppercase text-slate-400">
                                        <th className="py-3 px-3">Persona / Rol</th>
                                        <th className="py-3 px-3">Ruta Visitada</th>
                                        <th className="py-3 px-3">Campaña / UTM</th>
                                        <th className="py-3 px-3">Dispositivo</th>
                                        <th className="py-3 px-3">Fecha & Hora</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/70">
                                    {report.recentVisitors.map((v: any) => (
                                        <tr key={v.id} className="hover:bg-slate-800/40">
                                            <td className="py-2.5 px-3">
                                                <div className="font-bold text-white">
                                                    {v.user_name || "Visitante Público"}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-[10px]">
                                                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono">
                                                        {v.user_role || "GUEST"}
                                                    </span>
                                                    <span className="text-slate-500 font-mono">
                                                        {v.user_email || v.visitor_id?.slice(0, 10)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-2.5 px-3 font-mono text-emerald-300 max-w-[260px] truncate">
                                                {v.path}
                                            </td>
                                            <td className="py-2.5 px-3">
                                                <span className="px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold">
                                                    {v.campaign_tag}
                                                </span>
                                                {(v.utm_source || v.utm_campaign) && (
                                                    <div className="text-[10px] text-slate-400 mt-0.5">
                                                        {v.utm_source || "-"} / {v.utm_campaign || "-"}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="py-2.5 px-3 text-slate-300 capitalize">
                                                <span className="inline-flex items-center gap-1">
                                                    {v.device === "mobile" ? <Smartphone size={12} /> : <Monitor size={12} />}
                                                    {v.device || "desktop"}
                                                </span>
                                                {v.city && <div className="text-[10px] text-slate-500">{v.city}</div>}
                                            </td>
                                            <td className="py-2.5 px-3 text-[11px] font-mono text-slate-400">
                                                {new Date(v.created_at).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* TAB: REGISTERED USERS */}
            {activeTab === "users" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 space-y-4">
                        <h3 className="text-sm font-black text-white uppercase tracking-wider">
                            Distribución de Usuarios ({userBase.total})
                        </h3>
                        <div className="space-y-2.5">
                            {(userBase.rolesBreakdown || []).map((r: any) => (
                                <div key={r.role} className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                                    <span className="text-xs font-mono font-bold text-cyan-300">{r.role}</span>
                                    <span className="text-sm font-black text-white font-mono">{r.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-2 bg-slate-900/70 border border-slate-800 rounded-3xl p-6 space-y-4">
                        <h3 className="text-sm font-black text-white uppercase tracking-wider">
                            Últimos Usuarios Registrados (Compradores, Vendedores & Staff)
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="border-b border-slate-800 text-[10px] font-mono uppercase text-slate-400">
                                        <th className="py-2.5 px-3">Nombre</th>
                                        <th className="py-2.5 px-3">Correo</th>
                                        <th className="py-2.5 px-3">Rol</th>
                                        <th className="py-2.5 px-3">Estado</th>
                                        <th className="py-2.5 px-3">Registro</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/70">
                                    {(userBase.recentRegistrations || []).map((u: any) => (
                                        <tr key={u.id} className="hover:bg-slate-800/40">
                                            <td className="py-2.5 px-3 font-bold text-white">
                                                {`${u.name || ""} ${u.lastName || ""}`.trim() || "Sin nombre"}
                                            </td>
                                            <td className="py-2.5 px-3 font-mono text-slate-300">{u.email}</td>
                                            <td className="py-2.5 px-3">
                                                <span className="px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 text-[10px] font-mono font-bold">
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="py-2.5 px-3">
                                                <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 text-[10px] font-bold">
                                                    {u.status}
                                                </span>
                                            </td>
                                            <td className="py-2.5 px-3 font-mono text-[11px] text-slate-400">
                                                {new Date(u.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function KpiCard({ icon, label, value, sub, accent }: { icon: React.ReactNode; label: string; value: string | number; sub: string; accent: string }) {
    return (
        <div className={`p-4 rounded-2xl bg-slate-900/80 border ${accent} space-y-1.5 shadow-lg`}>
            <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase text-slate-400">{label}</span>
                {icon}
            </div>
            <div className="text-2xl font-black text-white font-mono">{value}</div>
            <div className="text-[11px] text-slate-400 truncate">{sub}</div>
        </div>
    )
}

function MiniMetric({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
    return (
        <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase">
                {icon}
                <span className="truncate">{label}</span>
            </div>
            <div className="text-lg font-black text-white font-mono">{value}</div>
        </div>
    )
}
