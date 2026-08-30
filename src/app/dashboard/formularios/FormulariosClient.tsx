"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
    FileSpreadsheet, Search, RefreshCw, Smartphone, Mail, MapPin, Calendar, 
    UserCheck, ExternalLink, ShieldCheck, Download, Filter, MessageSquare, BookOpen, Layers
} from "lucide-react"

interface FormLead {
    id: string
    name: string
    email: string | null
    phone: string | null
    city: string | null
    source: string
    requirement: string | null
    status: string
    createdAt: string
    salesperson?: {
        name: string
    }
}

export default function FormulariosClient() {
    const [leads, setLeads] = useState<FormLead[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [activeTab, setActiveTab] = useState<"guia-proveedores" | "todos">("guia-proveedores")
    const [selectedCity, setSelectedCity] = useState("TODAS")

    const fetchLeads = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/admin/formularios")
            if (res.ok) {
                const data = await res.json()
                setLeads(data.leads || [])
            }
        } catch (err) {
            console.error("Error fetching form leads:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchLeads()
    }, [])

    // Extract unique cities for filter dropdown
    const cities = Array.from(new Set(leads.map(l => l.city).filter(Boolean))) as string[]

    // Filter leads
    const filteredLeads = leads.filter(l => {
        if (activeTab === "guia-proveedores") {
            const isGuia = 
                l.source === "MANUAL_NEGOCIACION_PROVEEDORES" ||
                l.source === "LANDING_PROVEEDORES" ||
                (l.requirement && l.requirement.toLowerCase().includes("guía")) ||
                (l.requirement && l.requirement.toLowerCase().includes("proveedores"))
            if (!isGuia) return false
        }

        if (selectedCity !== "TODAS" && l.city !== selectedCity) return false

        if (search.trim()) {
            const q = search.toLowerCase()
            const matchesName = l.name.toLowerCase().includes(q)
            const matchesEmail = (l.email || "").toLowerCase().includes(q)
            const matchesPhone = (l.phone || "").toLowerCase().includes(q)
            const matchesCity = (l.city || "").toLowerCase().includes(q)
            return matchesName || matchesEmail || matchesPhone || matchesCity
        }

        return true
    })

    const exportToCSV = () => {
        if (filteredLeads.length === 0) return
        const headers = ["Nombre", "Email", "Telefono", "Ciudad", "Origen", "Detalle", "Fecha"]
        const rows = filteredLeads.map(l => [
            `"${l.name.replace(/"/g, '""')}"`,
            `"${(l.email || '').replace(/"/g, '""')}"`,
            `"${(l.phone || '').replace(/"/g, '""')}"`,
            `"${(l.city || '').replace(/"/g, '""')}"`,
            `"${l.source}"`,
            `"${(l.requirement || '').replace(/"/g, '""')}"`,
            `"${new Date(l.createdAt).toLocaleString('es-EC')}"`
        ])

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n")
        const encodedUri = encodeURI(csvContent)
        const link = document.createElement("a")
        link.setAttribute("href", encodedUri)
        link.setAttribute("download", `Leads_Formularios_Atomic_${new Date().toISOString().slice(0, 10)}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const cleanPhone = (num?: string | null) => {
        if (!num) return ""
        let cleaned = num.replace(/\D/g, "")
        if (cleaned.startsWith("09")) cleaned = "593" + cleaned.slice(1)
        if (cleaned.startsWith("9")) cleaned = "593" + cleaned
        return cleaned
    }

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 font-sans">
            
            {/* Header Title */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                            <FileSpreadsheet size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black text-white font-mono uppercase tracking-tight">
                                CONTACTOS DE LANDING
                            </h1>
                            <p className="text-xs font-mono text-slate-400">
                                REGISTRO UNIFICADO DE LEADS Y CONTACTOS CAPTURADOS EN LANDINGS WEB
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchLeads}
                        className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-mono font-bold flex items-center gap-2 transition-all"
                    >
                        <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                        <span>Actualizar</span>
                    </button>
                    <button
                        onClick={exportToCSV}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-mono font-black uppercase tracking-wider flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                    >
                        <Download size={14} />
                        <span>Exportar CSV</span>
                    </button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="inline-flex p-1.5 rounded-2xl bg-slate-900 border border-slate-800 font-mono text-xs">
                    <button
                        onClick={() => setActiveTab("guia-proveedores")}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold uppercase transition-all ${
                            activeTab === "guia-proveedores"
                                ? "bg-amber-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.4)]"
                                : "text-slate-400 hover:text-white"
                        }`}
                    >
                        <BookOpen size={15} />
                        <span>Contactos de Landing & Campañas</span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-950/60 text-amber-300 text-[10px]">
                            {leads.filter(l => l.source === "MANUAL_NEGOCIACION_PROVEEDORES" || l.source === "LANDING_PROVEEDORES" || (l.requirement && l.requirement.includes("Guía"))).length}
                        </span>
                    </button>
                    <button
                        onClick={() => setActiveTab("todos")}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold uppercase transition-all ${
                            activeTab === "todos"
                                ? "bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                                : "text-slate-400 hover:text-white"
                        }`}
                    >
                        <Layers size={15} />
                        <span>Todos los Formularios</span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-950/60 text-cyan-300 text-[10px]">
                            {leads.length}
                        </span>
                    </button>
                </div>

                {/* Filter and Search */}
                <div className="flex flex-wrap items-center gap-3 flex-1 max-w-md">
                    <div className="relative flex-1">
                        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Buscar por nombre, correo, ciudad..."
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
                        />
                    </div>

                    {cities.length > 0 && (
                        <select
                            value={selectedCity}
                            onChange={e => setSelectedCity(e.target.value)}
                            className="bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500"
                        >
                            <option value="TODAS">Todas las Ciudades</option>
                            {cities.map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    )}
                </div>
            </div>

            {/* Recuadro / Apartado Principal de la Guía de Tratos con Proveedores */}
            <div className="p-6 md:p-8 rounded-3xl bg-slate-900/80 border border-amber-500/30 backdrop-blur-xl shadow-2xl space-y-6">
                
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-amber-400 animate-ping" />
                        <h2 className="text-lg font-black text-white font-mono uppercase tracking-tight flex items-center gap-2">
                            {activeTab === "guia-proveedores" ? "📑 LEADS: CONTACTOS DE LANDING & CAMPAÑAS" : "📋 TODOS LOS REGISTROS DE FORMULARIOS"}
                        </h2>
                    </div>
                    <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
                        {filteredLeads.length} Registros Encontrados
                    </span>
                </div>

                {loading ? (
                    <div className="py-20 text-center space-y-3 font-mono">
                        <RefreshCw size={32} className="mx-auto text-amber-400 animate-spin" />
                        <p className="text-xs text-slate-400 uppercase tracking-widest">Cargando datos de formularios...</p>
                    </div>
                ) : filteredLeads.length === 0 ? (
                    <div className="py-20 text-center space-y-3 border border-dashed border-slate-800 rounded-2xl">
                        <BookOpen size={40} className="mx-auto text-slate-600" />
                        <p className="text-sm font-mono font-bold text-slate-400 uppercase">Aún no hay registros en esta vista</p>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto">
                            Cuando los usuarios completen el formulario en la landing de la guía de proveedores, sus datos aparecerán automáticamente en este recuadro.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-800 font-mono text-[11px] uppercase tracking-wider text-slate-400 bg-slate-950/60">
                                    <th className="py-3 px-4">Nombre Completo</th>
                                    <th className="py-3 px-4">Correo Electrónico</th>
                                    <th className="py-3 px-4">Teléfono / WhatsApp</th>
                                    <th className="py-3 px-4">Ciudad</th>
                                    <th className="py-3 px-4">Fecha y Hora</th>
                                    <th className="py-3 px-4 text-center">Acción Directa</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60 text-xs font-mono">
                                {filteredLeads.map((lead) => {
                                    const formattedPhone = cleanPhone(lead.phone)
                                    const waUrl = formattedPhone ? `https://wa.me/${formattedPhone}?text=${encodeURIComponent(`Hola ${lead.name}, te saludamos de ATOMIC B2B con respecto a tu solicitud del Manual de Proveedores.`)}` : null

                                    return (
                                        <tr key={lead.id} className="hover:bg-slate-800/40 transition-colors group">
                                            <td className="py-4 px-4 font-bold text-white uppercase">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-black flex items-center justify-center text-xs shrink-0">
                                                        {lead.name[0]}
                                                    </div>
                                                    <span>{lead.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-slate-300">
                                                {lead.email ? (
                                                    <a href={`mailto:${lead.email}`} className="flex items-center gap-1.5 hover:text-amber-400 transition-colors">
                                                        <Mail size={13} className="text-slate-500 shrink-0" />
                                                        <span>{lead.email}</span>
                                                    </a>
                                                ) : <span className="text-slate-600">-</span>}
                                            </td>
                                            <td className="py-4 px-4 text-slate-300">
                                                {lead.phone ? (
                                                    <div className="flex items-center gap-1.5">
                                                        <Smartphone size={13} className="text-emerald-400 shrink-0" />
                                                        <span className="font-bold text-emerald-300">{lead.phone}</span>
                                                    </div>
                                                ) : <span className="text-slate-600">-</span>}
                                            </td>
                                            <td className="py-4 px-4 text-slate-300">
                                                {lead.city ? (
                                                    <div className="flex items-center gap-1.5">
                                                        <MapPin size={13} className="text-amber-400 shrink-0" />
                                                        <span className="capitalize">{lead.city}</span>
                                                    </div>
                                                ) : <span className="text-slate-600">No especificada</span>}
                                            </td>
                                            <td className="py-4 px-4 text-slate-400 text-[11px]">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar size={13} className="text-slate-500 shrink-0" />
                                                    <span>{new Date(lead.createdAt).toLocaleString('es-EC', { dateStyle: 'short', timeStyle: 'short' })}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                {waUrl ? (
                                                    <a
                                                        href={waUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold text-[11px] transition-all hover:scale-105"
                                                    >
                                                        <MessageSquare size={13} />
                                                        <span>Contactar por WhatsApp</span>
                                                    </a>
                                                ) : (
                                                    <span className="text-[10px] text-slate-600 font-mono">Sin teléfono</span>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

        </div>
    )
}
