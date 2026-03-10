"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import {
    AreaChart, Area, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts"
import {
    TrendingUp, Users, FileText, DollarSign,
    Award, Target, Briefcase, ChevronRight, RefreshCw
} from "lucide-react"
import Link from "next/link"

type DashboardStats = {
    stats: {
        ventas: number
        cotizaciones: number
        comisiones: number
        efectividad: number
        pendientesPago: number
    }
    trends: {
        ventasPct: number
        cotizacionesDiff: number
    }
    weeklyData: { name: string; ventas: number; cotizaciones: number; comisiones: number }[]
}

const EMPTY_STATS: DashboardStats = {
    stats: { ventas: 0, cotizaciones: 0, comisiones: 0, efectividad: 0, pendientesPago: 0 },
    trends: { ventasPct: 0, cotizacionesDiff: 0 },
    weeklyData: [
        { name: "Sem 1", ventas: 0, cotizaciones: 0, comisiones: 0 },
        { name: "Sem 2", ventas: 0, cotizaciones: 0, comisiones: 0 },
        { name: "Sem 3", ventas: 0, cotizaciones: 0, comisiones: 0 },
        { name: "Sem 4", ventas: 0, cotizaciones: 0, comisiones: 0 },
    ],
}

function fmt(n: number) {
    return n.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 })
}

function trendLabel(val: number, suffix = "%") {
    if (val === 0) return "Sin cambios"
    return val > 0 ? `+${val}${suffix}` : `${val}${suffix}`
}

export default function DashboardOverview() {
    const { data: session } = useSession()
    const [data, setData] = useState<DashboardStats>(EMPTY_STATS)
    const [goal, setGoal] = useState<number>(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [isEditingGoal, setIsEditingGoal] = useState(false)
    const [newGoal, setNewGoal] = useState("")

    const fetchStats = async () => {
        setLoading(true)
        setError("")
        try {
            const [resStats, resGoal] = await Promise.all([
                fetch("/api/dashboard/stats"),
                fetch("/api/dashboard/goal")
            ])

            if (resStats.ok) {
                const json = await resStats.json()
                setData(json)
            } else {
                setError("No se pudieron cargar las estadísticas.")
            }

            if (resGoal.ok) {
                const json = await resGoal.json()
                setGoal(json.goal)
                setNewGoal(json.goal.toString())
            }
        } catch {
            setError("Error de red al cargar el resumen.")
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateGoal = async () => {
        if (!newGoal || isNaN(Number(newGoal))) return
        try {
            const res = await fetch("/api/dashboard/goal", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ goal: Number(newGoal) })
            })
            if (res.ok) {
                setGoal(Number(newGoal))
                setIsEditingGoal(false)
            }
        } catch (error) {
            console.error("Error updating goal", error)
        }
    }

    useEffect(() => {
        if (session) fetchStats()
    }, [session])

    if (!session) return null

    const role = session.user?.role
    const { stats, trends, weeklyData } = data

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-neutral-900 uppercase">
                        Resumen de <span className="text-orange-600">Rendimiento</span>
                    </h1>
                    <p className="text-neutral-500 font-medium">
                        Plataforma de Control Estratégico{" "}
                        <span className="text-orange-600 font-bold">ATOMIC INDUSTRIES</span>.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchStats}
                        disabled={loading}
                        className="p-2 text-neutral-400 hover:text-orange-600 transition-colors disabled:opacity-40"
                        title="Actualizar datos"
                    >
                        <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                    </button>
                    <div className="bg-orange-50 px-4 py-2 border border-orange-100 flex items-center space-x-3">
                        <div className="w-10 h-10 bg-orange-600 flex items-center justify-center text-white font-bold">
                            {session.user?.name?.[0]}
                        </div>
                        <div>
                            <p className="text-xs font-bold text-orange-800 uppercase tracking-widest">{role}</p>
                            <p className="text-sm font-bold text-neutral-900">{session.user?.name}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Weekly Goal Banner */}
            <div className="bg-neutral-950 p-4 border border-neutral-800 flex flex-col md:flex-row items-center justify-between text-white">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-neutral-800 shrink-0">
                        <Target size={20} className="text-orange-500" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Objetivo de la Semana</p>
                        <div className="flex items-end gap-2">
                            {isEditingGoal ? (
                                <input
                                    type="number"
                                    value={newGoal}
                                    onChange={(e) => setNewGoal(e.target.value)}
                                    className="bg-neutral-800 text-white border border-neutral-700 px-2 py-1 text-lg font-bold w-32 focus:outline-none focus:border-orange-500 rounded-none"
                                />
                            ) : (
                                <p className="text-2xl font-bold text-white">{fmt(goal)}</p>
                            )}
                            <span className="text-xs text-neutral-500 mb-1 font-medium">USD</span>
                        </div>
                    </div>
                </div>

                {(role === "ADMIN" || role === "MANAGEMENT") && (
                    <div className="mt-3 md:mt-0 flex gap-2">
                        {isEditingGoal ? (
                            <>
                                <button onClick={handleUpdateGoal} className="px-4 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-colors">Guardar</button>
                                <button onClick={() => setIsEditingGoal(false)} className="px-4 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold transition-colors">Cancelar</button>
                            </>
                        ) : (
                            <button onClick={() => setIsEditingGoal(true)} className="px-4 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold transition-colors border border-neutral-700">Editar Meta</button>
                        )}
                    </div>
                )}
            </div>

            {/* Error banner */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-medium px-4 py-3 flex items-center gap-3">
                    <span>{error}</span>
                    <button onClick={fetchStats} className="underline text-xs">Reintentar</button>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Ventas del Mes"
                    value={loading ? "—" : fmt(stats.ventas)}
                    icon={<DollarSign className="text-orange-600" />}
                    trend={loading ? "—" : trendLabel(trends.ventasPct)}
                    label="vs mes anterior"
                    loading={loading}
                />
                <StatCard
                    title="Cotizaciones"
                    value={loading ? "—" : String(stats.cotizaciones)}
                    icon={<FileText className="text-orange-600" />}
                    trend={loading ? "—" : trendLabel(trends.cotizacionesDiff, "")}
                    label="este mes"
                    loading={loading}
                />
                <StatCard
                    title="Comisiones"
                    value={loading ? "—" : fmt(stats.comisiones)}
                    icon={<Award className="text-orange-600" />}
                    trend={loading ? "—" : fmt(stats.pendientesPago)}
                    label="pendiente de cobro"
                    loading={loading}
                />
                <StatCard
                    title="Efectividad"
                    value={loading ? "—" : `${stats.efectividad}%`}
                    icon={<Target className="text-orange-600" />}
                    trend={loading ? "—" : `${stats.cotizaciones} cot.`}
                    label="tasa de conversión"
                    loading={loading}
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Chart */}
                <div className="lg:col-span-2 bg-white p-6 border border-neutral-200 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-neutral-900 flex items-center">
                            <TrendingUp size={20} className="mr-2 text-orange-600" /> Rendimiento Semanal
                        </h3>
                        <div className="flex space-x-2">
                            <span className="flex items-center text-xs font-bold text-neutral-400">
                                <div className="w-2 h-2 bg-orange-600 mr-1" /> Ventas
                            </span>
                            <span className="flex items-center text-xs font-bold text-neutral-400">
                                <div className="w-2 h-2 bg-neutral-300 mr-1" /> Cotizaciones
                            </span>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        {loading ? (
                            <div className="h-full flex items-center justify-center text-neutral-300">
                                <div className="w-8 h-8 border-2 border-orange-200 border-t-orange-600 rounded-full animate-spin" />
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={weeklyData}>
                                    <defs>
                                        <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ea580c" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#ea580c" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
                                    <Tooltip contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
                                    <Area type="monotone" dataKey="ventas" stroke="#ea580c" strokeWidth={3} fillOpacity={1} fill="url(#colorVentas)" />
                                    <Area type="monotone" dataKey="cotizaciones" stroke="#d1d5db" strokeWidth={2} fillOpacity={0} fill="none" />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Bar Chart */}
                <div className="bg-white p-6 border border-neutral-200 shadow-sm">
                    <h3 className="text-lg font-bold text-neutral-900 mb-6 flex items-center">
                        <Briefcase size={20} className="mr-2 text-orange-600" /> Distribución Mensual
                    </h3>
                    <div className="h-[300px] w-full">
                        {loading ? (
                            <div className="h-full flex items-center justify-center">
                                <div className="w-8 h-8 border-2 border-orange-200 border-t-orange-600 rounded-full animate-spin" />
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={weeklyData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
                                    <YAxis hide />
                                    <Tooltip cursor={{ fill: "#f9fafb" }} contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
                                    <Bar dataKey="ventas" fill="#ea580c" radius={[4, 4, 0, 0]} barSize={20} />
                                    <Bar dataKey="comisiones" fill="#111827" radius={[4, 4, 0, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Access */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link href="/dashboard/quotes" className="block bg-neutral-950 p-8 text-white relative overflow-hidden group border border-neutral-800 border-t-4 border-t-orange-600 hover:border-t-orange-500 transition-all">
                    <div className="absolute right-0 bottom-0 opacity-10 group-hover:scale-110 transition-transform">
                        <TrendingUp size={160} />
                    </div>
                    <h4 className="text-orange-500 font-bold uppercase tracking-widest text-xs mb-2">Acción Rápida</h4>
                    <h2 className="text-2xl font-bold mb-4">Nueva Cotización Profesional</h2>
                    <p className="text-neutral-400 text-sm mb-6 max-w-xs">Genera ofertas comerciales con fotos y seguimiento automático de CRM.</p>
                    <span className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-6 transition-colors inline-flex items-center">
                        Empezar Ahora <ChevronRight size={18} className="ml-2" />
                    </span>
                </Link>

                <div className="bg-white p-8 border border-neutral-200 shadow-sm">
                    <h4 className="text-orange-600 font-bold uppercase tracking-widest text-xs mb-4">Estado del Mes</h4>
                    {loading ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-12 bg-neutral-100 animate-pulse rounded" />
                            ))}
                        </div>
                    ) : (
                        <ul className="space-y-4">
                            <StatusItem
                                icon={<DollarSign className="text-green-500" />}
                                text={`Ventas del mes: ${fmt(stats.ventas)}`}
                                empty={stats.ventas === 0}
                            />
                            <StatusItem
                                icon={<FileText className="text-orange-500" />}
                                text={`${stats.cotizaciones} cotizacion${stats.cotizaciones !== 1 ? "es" : ""} emitida${stats.cotizaciones !== 1 ? "s" : ""} este mes`}
                                empty={stats.cotizaciones === 0}
                            />
                            <StatusItem
                                icon={<Award className="text-yellow-500" />}
                                text={
                                    stats.comisiones > 0
                                        ? `Comisiones acumuladas: ${fmt(stats.comisiones)}`
                                        : "Sin comisiones registradas este mes"
                                }
                                empty={stats.comisiones === 0}
                            />
                        </ul>
                    )}
                </div>
            </div>
        </div>
    )
}

function StatCard({ title, value, icon, trend, label, loading }: any) {
    const isPositive = typeof trend === "string" && trend.startsWith("+")
    const isNeutral = typeof trend === "string" && (trend === "Sin cambios" || trend === "—" || trend.includes("cot.") || trend.includes("$"))

    return (
        <div className="bg-white p-5 border border-neutral-200 shadow-sm transition-all hover:shadow-md">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-orange-50">{icon}</div>
                {!loading && (
                    <span className={`text-[10px] font-bold uppercase px-2 py-1 ${isNeutral
                        ? "bg-neutral-100 text-neutral-600"
                        : isPositive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}>
                        {trend}
                    </span>
                )}
            </div>
            <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">{title}</h4>
            <p className={`text-2xl font-bold text-neutral-900 ${loading ? "animate-pulse text-neutral-200" : ""}`}>
                {value}
            </p>
            <p className="text-[10px] text-neutral-400 mt-1 font-medium">{label}</p>
        </div>
    )
}

function StatusItem({ icon, text, empty }: { icon: React.ReactNode; text: string; empty: boolean }) {
    return (
        <li className={`flex items-center p-3 rounded-none border ${empty ? "bg-neutral-50 border-neutral-100" : "bg-green-50 border-green-100"}`}>
            <div className="mr-3">{icon}</div>
            <span className={`text-sm font-medium ${empty ? "text-neutral-400" : "text-neutral-700"}`}>{text}</span>
        </li>
    )
}
