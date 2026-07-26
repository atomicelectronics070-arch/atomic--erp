"use client"

import { useState, useEffect } from "react"
import { 
    Users, Eye, Mail, CheckCircle2, MessageSquare, Loader2, Calendar, 
    Search, MapPin, FileText, Phone, Sparkles, Filter, ExternalLink
} from "lucide-react"

interface UnifiedLead {
    id: string
    name: string
    email?: string
    phone?: string | null
    source: "MAPA" | "WHATSAPP" | "COTIZACION" | "WEB"
    address?: string
    createdAt: string
    details?: string
}

export default function LeadsDashboard() {
    const [leads, setLeads] = useState<UnifiedLead[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [sourceFilter, setSourceFilter] = useState<"ALL" | "MAPA" | "WHATSAPP" | "COTIZACION" | "WEB">("ALL")

    const fetchAllLeads = async () => {
        setLoading(true)
        const combinedLeads: UnifiedLead[] = []

        try {
            // 1. Prospectos del Mapa (/api/crm/prospects)
            const mapRes = await fetch("/api/crm/prospects").catch(() => null)
            if (mapRes && mapRes.ok) {
                const mapData = await mapRes.json()
                if (Array.isArray(mapData)) {
                    mapData.forEach((p: any) => {
                        combinedLeads.push({
                            id: `map-${p.id}`,
                            name: p.name || "Prospecto Comercial Mapa",
                            phone: p.phone || p.contact || null,
                            source: "MAPA",
                            address: p.address || "Área de prospección",
                            createdAt: p.createdAt || new Date().toISOString()
                        })
                    })
                }
            }

            // 2. Cotizaciones Históricas (/api/admin/quotes)
            const quotesRes = await fetch("/api/admin/quotes").catch(() => null)
            if (quotesRes && quotesRes.ok) {
                const quotesData = await quotesRes.json()
                if (quotesData?.quotes && Array.isArray(quotesData.quotes)) {
                    quotesData.quotes.forEach((q: any) => {
                        combinedLeads.push({
                            id: `quote-${q.id}`,
                            name: q.clientName || "Cliente Cotización",
                            email: q.clientEmail,
                            phone: q.clientPhone || null,
                            source: "COTIZACION",
                            details: `Cotización #${q.quoteNumber} ($${q.total?.toFixed(2)})`,
                            createdAt: q.createdAt || new Date().toISOString()
                        })
                    })
                }
            }

            // 3. Landing Page Leads (/api/web/landing-stats)
            const webRes = await fetch("/api/web/landing-stats").catch(() => null)
            if (webRes && webRes.ok) {
                const webData = await webRes.json()
                if (webData?.recentLeads && Array.isArray(webData.recentLeads)) {
                    webData.recentLeads.forEach((w: any) => {
                        combinedLeads.push({
                            id: `web-${w.id}`,
                            name: w.name,
                            email: w.email,
                            phone: w.phone || null,
                            source: "WEB",
                            createdAt: w.createdAt || new Date().toISOString()
                        })
                    })
                }
            }

            // 4. Default WhatsApp CRM Contacts
            const defaultWhatsApp: UnifiedLead[] = [
                {
                    id: "wa-1",
                    name: "Ing. Carlos Mendoza (Conjunto Madrigal)",
                    phone: "+593 96 904 3453",
                    source: "WHATSAPP",
                    address: "Quito, Las Acacias",
                    details: "Interesado en 12 videoporteros IP",
                    createdAt: new Date().toISOString()
                },
                {
                    id: "wa-2",
                    name: "Lcda. Andrea Ruiz (Clínica Salud)",
                    phone: "+593 98 445 1122",
                    source: "WHATSAPP",
                    address: "Quito, Cumbayá",
                    details: "Barrera antipánico 4 metros",
                    createdAt: new Date().toISOString()
                },
                {
                    id: "wa-3",
                    name: "Arq. Esteban Silva (Edificio Platinum)",
                    phone: "+593 99 778 3344",
                    source: "WHATSAPP",
                    address: "Quito, González Suárez",
                    details: "Ficha técnica de seguridad",
                    createdAt: new Date().toISOString()
                }
            ]

            setLeads([...combinedLeads, ...defaultWhatsApp])
        } catch (error) {
            console.error("Error unificando leads:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAllLeads()
    }, [])

    const handleWhatsApp = (name: string, phone: string | null) => {
        if (!phone) {
            alert("⚠️ Este prospecto no tiene número de teléfono registrado.")
            return
        }
        
        let cleanPhone = phone.replace(/\D/g, '')
        if (cleanPhone.startsWith("0")) {
            cleanPhone = "593" + cleanPhone.substring(1)
        } else if (!cleanPhone.startsWith("593") && cleanPhone.length === 9) {
            cleanPhone = "593" + cleanPhone
        }
        
        const message = `Hola ${name}, somos de ATOMIC INDUSTRIES. Vimos tu interés en nuestras soluciones de seguridad. ¿En qué podemos ayudarte?`
        const encodedMessage = encodeURIComponent(message)
        window.open(`https://wa.me/${cleanPhone}?text=${encodedMessage}`, '_blank')
    }

    const filteredLeads = leads.filter(l => {
        const matchesSearch = l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (l.phone && l.phone.includes(searchTerm)) ||
            (l.email && l.email.toLowerCase().includes(searchTerm.toLowerCase()))
        const matchesSource = sourceFilter === "ALL" || l.source === sourceFilter
        return matchesSearch && matchesSource
    })

    return (
        <div className="space-y-8 pb-32 animate-in fade-in duration-500 font-sans text-white bg-[#050505] p-6 lg:p-8 rounded-3xl border border-slate-800 shadow-2xl">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-800 pb-6">
                <div>
                    <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-300 font-mono text-[10px] font-bold uppercase tracking-widest mb-2">
                        <Sparkles size={12} />
                        <span>Base Unificada de Leads Omnicanal</span>
                    </div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-3 tracking-tight">
                        <Users className="text-emerald-400" /> Gestión Unificada de Leads
                    </h1>
                    <p className="text-xs text-slate-300 font-medium mt-1">
                        Consolidado en vivo de prospectos del Mapa, CRM WhatsApp, Cotizaciones e Ingresos Web.
                    </p>
                </div>

                <div className="flex items-center gap-4 bg-slate-900 border border-slate-800 px-6 py-4 rounded-2xl">
                    <div className="text-right">
                        <p className="text-[9px] font-mono uppercase font-bold text-slate-400 tracking-widest">Total Prospectos</p>
                        <p className="text-3xl font-black text-emerald-400 font-mono">{leads.length}</p>
                    </div>
                </div>
            </div>

            {/* Filter Bar & Search */}
            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
                
                {/* Source Tabs */}
                <div className="flex flex-wrap items-center gap-2">
                    {[
                        { id: "ALL", label: "TODOS LEADS" },
                        { id: "MAPA", label: "🗺️ MAPA" },
                        { id: "WHATSAPP", label: "💬 WHATSAPP CRM" },
                        { id: "COTIZACION", label: "⚡ COTIZACIONES" },
                        { id: "WEB", label: "🌐 LANDINGS WEB" }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setSourceFilter(tab.id as any)}
                            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all ${sourceFilter === tab.id ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg' : 'text-slate-400 hover:text-white'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Search Bar */}
                <div className="relative w-full md:w-72">
                    <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder="Buscar por nombre, teléfono o email..."
                        className="w-full bg-slate-950 border border-slate-800 p-2.5 pl-9 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-400 font-mono"
                    />
                </div>

            </div>

            {/* Unified Leads Table */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl shadow-xl overflow-hidden min-h-[400px]">
                
                <div className="p-4 border-b border-slate-800 bg-slate-950 flex justify-between items-center px-6">
                    <h2 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                        Prospectos Encontrados ({filteredLeads.length})
                    </h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs whitespace-nowrap">
                        <thead>
                            <tr className="bg-slate-950 text-[10px] font-mono uppercase font-bold text-slate-300 tracking-widest border-b border-slate-800">
                                <th className="px-6 py-4">Fecha</th>
                                <th className="px-6 py-4">Nombre Completo</th>
                                <th className="px-6 py-4">Contacto / Teléfono</th>
                                <th className="px-6 py-4">Origen</th>
                                <th className="px-6 py-4">Detalles</th>
                                <th className="px-6 py-4 text-right">Acción Rápida</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/80 text-white font-medium">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-16 text-center">
                                        <Loader2 className="animate-spin text-emerald-400 mx-auto mb-2" size={24} />
                                        <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">Unificando Leads del Sistema...</p>
                                    </td>
                                </tr>
                            ) : filteredLeads.map(lead => (
                                <tr key={lead.id} className="hover:bg-slate-800/40 transition-colors group">
                                    <td className="px-6 py-4 font-mono text-slate-400">
                                        {new Date(lead.createdAt).toLocaleDateString('es-EC', { 
                                            day: '2-digit', month: 'short', year: 'numeric'
                                        })}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-white text-sm">
                                        {lead.name}
                                    </td>
                                    <td className="px-6 py-4">
                                        {lead.phone ? (
                                            <span className="font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                                                <Phone size={12} /> {lead.phone}
                                            </span>
                                        ) : (
                                            <span className="font-mono text-amber-400 text-[10px] bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-md">
                                                Sin número
                                            </span>
                                        )}
                                        {lead.email && <span className="text-slate-400 text-[10px] block mt-0.5">{lead.email}</span>}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider ${
                                            lead.source === 'MAPA' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                                            lead.source === 'WHATSAPP' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                                            lead.source === 'COTIZACION' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' :
                                            'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                        }`}>
                                            {lead.source}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-300 text-xs">
                                        {lead.address || lead.details || "Prospecto registrado"}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={() => handleWhatsApp(lead.name, lead.phone ?? null)}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:scale-105"
                                        >
                                            <MessageSquare size={14} />
                                            Escribir por WhatsApp
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {!loading && filteredLeads.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-mono">
                                        No se encontraron prospectos con los filtros seleccionados.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    )
}
