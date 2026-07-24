"use client"

import { useState, useEffect } from "react"
import { Users, Eye, Mail, CheckCircle2, MessageSquare, Loader2, Calendar } from "lucide-react"

interface Lead {
    id: string
    name: string
    email: string
    phone: string | null
    source: string
    createdAt: string
}

interface LandingStats {
    totalLeads: number
    recentLeads: Lead[]
    webVisits: number
    dashboardVisits: number
}

export default function LeadsDashboard() {
    const [stats, setStats] = useState<LandingStats | null>(null)
    const [loading, setLoading] = useState(true)

    const fetchStats = async () => {
        try {
            const res = await fetch("/api/web/landing-stats")
            if (res.ok) {
                const data = await res.json()
                setStats(data)
            }
        } catch (error) {
            console.error("Error fetching landing stats:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchStats()
        // Poll every 30 seconds for new leads
        const interval = setInterval(fetchStats, 30000)
        return () => clearInterval(interval)
    }, [])

    const handleWhatsApp = (name: string, phone: string | null) => {
        if (!phone) {
            alert("Este lead no proporcionó un número telefónico.")
            return
        }
        
        let cleanPhone = phone.replace(/\D/g, '')
        if (cleanPhone.startsWith("0")) {
            cleanPhone = "593" + cleanPhone.substring(1)
        } else if (!cleanPhone.startsWith("593") && cleanPhone.length === 9) {
            cleanPhone = "593" + cleanPhone
        }
        
        const message = `Hola ${name}, somos de Atomic Industries. Vimos tu interés en nuestras soluciones de seguridad. ¿En qué podemos ayudarte?`
        const encodedMessage = encodeURIComponent(message)
        window.open(`https://wa.me/${cleanPhone}?text=${encodedMessage}`, '_blank')
    }

    if (loading) {
        return (
            <div className="flex-1 min-h-[calc(100vh-4rem)] bg-slate-50/50 p-8 flex items-center justify-center">
                <Loader2 className="animate-spin text-slate-400" size={32} />
            </div>
        )
    }

    return (
        <div className="flex-1 min-h-[calc(100vh-4rem)] bg-slate-50/50 p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/50 backdrop-blur-xl border-slate-700/50 p-6 rounded-2xl border border-slate-200 shadow-[0_4px_15px_rgba(0,0,0,0.3)]">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                            <Users size={24} className="text-emerald-500" />
                            Gestión de Leads (Módulo Quitopesos)
                        </h1>
                        <p className="text-sm text-slate-500 font-medium mt-1">Panel centralizado para administrar todos los prospectos ingresados a través de las Landing Pages.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-xs uppercase font-bold text-slate-400 tracking-wider">Total Histórico</p>
                            <p className="text-3xl font-black text-slate-900">{stats?.totalLeads || 0}</p>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 rounded-2xl border border-slate-200 shadow-[0_4px_15px_rgba(0,0,0,0.3)] overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <Calendar size={18} className="text-slate-400" />
                            Últimos Prospectos Registrados
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50/80 text-xs uppercase text-slate-500 font-bold tracking-wider border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4">Fecha</th>
                                    <th className="px-6 py-4">Nombre Completo</th>
                                    <th className="px-6 py-4">Contacto</th>
                                    <th className="px-6 py-4">Origen</th>
                                    <th className="px-6 py-4 text-right">Acción Rápida</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                                {stats?.recentLeads.map(lead => (
                                    <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {new Date(lead.createdAt).toLocaleDateString('es-ES', { 
                                                day: '2-digit', month: 'short', year: 'numeric', 
                                                hour: '2-digit', minute:'2-digit' 
                                            })}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-slate-900 whitespace-nowrap">
                                            {lead.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-slate-500">
                                                    <Mail size={14} />
                                                    {lead.email}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-[10px] font-black uppercase tracking-wider">
                                                {lead.source.replace('LANDING_', '')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => handleWhatsApp(lead.name, lead.phone)}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-lg font-bold text-xs transition-all shadow-[0_4px_15px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
                                            >
                                                <MessageSquare size={14} />
                                                Escribir por WhatsApp
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {(!stats?.recentLeads || stats.recentLeads.length === 0) && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                            No hay prospectos recientes para mostrar.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    )
}
