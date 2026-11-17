"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { 
  Sparkles, Search, RefreshCw, MessageSquare, Phone, Mail, 
  MapPin, Calendar, Clock, CheckCircle2, AlertCircle, Building2, 
  Home, ExternalLink, ChevronRight, ShieldCheck, Filter, Download
} from "lucide-react"

interface Lead {
  id: string
  fullName: string
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  projectType: string
  city: string
  message: string
  status: "NUEVO" | "CONTACTADO" | "COTIZADO" | "CERRADO" | string
  createdAt: string
  settingKey?: string
}

export default function SolicitudesLandingClient() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("TODOS")
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const fetchLeads = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/landing-leads", { cache: "no-store" })
      const data = await res.json()
      if (data.success && Array.isArray(data.leads)) {
        setLeads(data.leads)
      }
    } catch (e) {
      console.error("Error al cargar leads:", e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeads()
  }, [])

  const handleStatusChange = async (lead: Lead, newStatus: string) => {
    setUpdatingId(lead.id)
    try {
      const res = await fetch("/api/landing-leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: lead.settingKey || lead.id, status: newStatus })
      })
      if (res.ok) {
        setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, status: newStatus } : l))
      }
    } catch (e) {
      console.error("Error al actualizar estado:", e)
    } finally {
      setUpdatingId(null)
    }
  }

  const filteredLeads = leads.filter(l => {
    const matchesSearch = 
      (l.fullName || "").toLowerCase().includes(search.toLowerCase()) ||
      (l.phone || "").includes(search) ||
      (l.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (l.city || "").toLowerCase().includes(search.toLowerCase()) ||
      (l.projectType || "").toLowerCase().includes(search.toLowerCase()) ||
      (l.message || "").toLowerCase().includes(search.toLowerCase())

    if (!matchesSearch) return false

    if (statusFilter === "TODOS") return true
    if (statusFilter === "NUEVOS") return l.status === "NUEVO" || l.status === "PROSPECTO"
    if (statusFilter === "CONTACTADOS") return l.status === "CONTACTADO"
    if (statusFilter === "COTIZADOS") return l.status === "COTIZADO"
    if (statusFilter === "CERRADOS") return l.status === "CERRADO"

    return true
  })

  // Metrics
  const totalLeads = leads.length
  const nuevosCount = leads.filter(l => l.status === "NUEVO" || l.status === "PROSPECTO").length
  const enGestionCount = leads.filter(l => l.status === "CONTACTADO" || l.status === "COTIZADO").length
  const cerradosCount = leads.filter(l => l.status === "CERRADO").length

  return (
    <div className="space-y-6 pb-20">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-xl backdrop-blur-md">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Sparkles size={20} />
            </span>
            <span className="text-xs font-mono font-bold tracking-widest text-purple-400 uppercase">
              GESTIÓN DE PROSPECTOS • LANDING OFICIAL
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-heading">
            Solicitudes de Landing • Proyectos
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Contactos generados desde tus campañas en Instagram, Facebook y la landing page de proyectos residenciales, edificios y seguridad electrónica.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchLeads}
            disabled={loading}
            className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 border border-slate-700 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            <span>Actualizar</span>
          </button>

          <Link
            href="/web/proyectos"
            target="_blank"
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-purple-600/20"
          >
            <span>Ver Landing</span>
            <ExternalLink size={13} />
          </Link>
        </div>
      </div>

      {/* ── METRICS STRIP ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800">
          <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">
            Total Solicitudes
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-heading">{totalLeads}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Captadas en plataforma</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/40 border border-purple-500/30 bg-purple-500/5">
          <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-purple-400 mb-1">
            Nuevos Leads
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-300 font-heading">{nuevosCount}</div>
          <div className="text-[10px] text-purple-400/80 mt-0.5">Por contactar de inmediato</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/40 border border-cyan-500/30 bg-cyan-500/5">
          <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400 mb-1">
            En Gestión / Cotizados
          </div>
          <div className="text-2xl sm:text-3xl font-black text-cyan-300 font-heading">{enGestionCount}</div>
          <div className="text-[10px] text-cyan-400/80 mt-0.5">Con asesoría o propuesta</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/40 border border-emerald-500/30 bg-emerald-500/5">
          <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400 mb-1">
            Proyectos Cerrados
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-300 font-heading">{cerradosCount}</div>
          <div className="text-[10px] text-emerald-400/80 mt-0.5">Venta / Instalación concretada</div>
        </div>
      </div>

      {/* ── FILTER & SEARCH TOOLBAR ── */}
      <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, teléfono, ciudad..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {[
            { id: "TODOS", label: "Todos", count: totalLeads },
            { id: "NUEVOS", label: "Nuevos", count: nuevosCount },
            { id: "CONTACTADOS", label: "Contactados", count: leads.filter(l => l.status === "CONTACTADO").length },
            { id: "COTIZADOS", label: "Cotizados", count: leads.filter(l => l.status === "COTIZADO").length },
            { id: "CERRADOS", label: "Cerrados", count: cerradosCount }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                statusFilter === tab.id
                  ? "bg-purple-600 text-white border-purple-500 shadow-md"
                  : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
              }`}
            >
              <span>{tab.label}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/40 font-mono">
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── LEADS LIST ── */}
      {loading ? (
        <div className="p-16 rounded-3xl bg-slate-900/20 border border-slate-800/80 text-center space-y-3">
          <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono uppercase tracking-widest text-slate-400">
            Cargando solicitudes de la landing...
          </p>
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="p-16 rounded-3xl bg-slate-900/20 border border-slate-800 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-2xl text-purple-400">
            📋
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">No se encontraron solicitudes</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {search 
                ? "No hay contactos que coincidan con tu búsqueda."
                : "Aún no hay prospectos registrados con este filtro. Cuando las personas llenen el formulario en la landing aparecerán aquí automáticamente."}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredLeads.map((lead) => {
            const cleanPhone = (lead.phone || "").replace(/\D/g, "")
            const waNumber = cleanPhone.startsWith("593") 
              ? cleanPhone 
              : cleanPhone.startsWith("0") 
                ? `593${cleanPhone.substring(1)}` 
                : `593${cleanPhone}`

            const waText = encodeURIComponent(
              `¡Hola ${lead.fullName}! 👋 Te saludamos cordialmente de ATOMIC Ecuador. Recibimos tu solicitud en nuestra web sobre tu requerimiento de ${lead.projectType} en ${lead.city}. ¿Cuándo tendrías unos minutos para asesorarte con la propuesta técnica y cotización?`
            )

            const formattedDate = new Date(lead.createdAt).toLocaleDateString("es-EC", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            })

            return (
              <div
                key={lead.id}
                className="p-5 sm:p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all space-y-4 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base sm:text-lg font-black text-white font-heading">
                        {lead.fullName}
                      </h3>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/30">
                        {lead.projectType}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
                      {lead.city && (
                        <div className="flex items-center gap-1">
                          <MapPin size={13} className="text-emerald-400 shrink-0" />
                          <span>{lead.city}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Clock size={13} className="text-slate-500 shrink-0" />
                        <span>{formattedDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase text-slate-400">Estado:</span>
                    <select
                      value={lead.status}
                      disabled={updatingId === lead.id}
                      onChange={(e) => handleStatusChange(lead, e.target.value)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono uppercase outline-none border cursor-pointer ${
                        lead.status === "NUEVO" || lead.status === "PROSPECTO"
                          ? "bg-purple-950/80 text-purple-300 border-purple-500/50"
                          : lead.status === "CONTACTADO"
                            ? "bg-blue-950/80 text-blue-300 border-blue-500/50"
                            : lead.status === "COTIZADO"
                              ? "bg-amber-950/80 text-amber-300 border-amber-500/50"
                              : "bg-emerald-950/80 text-emerald-300 border-emerald-500/50"
                      }`}
                    >
                      <option value="NUEVO">NUEVO</option>
                      <option value="CONTACTADO">CONTACTADO</option>
                      <option value="COTIZADO">COTIZADO</option>
                      <option value="CERRADO">CERRADO</option>
                    </select>
                  </div>
                </div>

                {/* Requirement Message Box */}
                {lead.message && (
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/90 text-xs text-slate-300 leading-relaxed font-sans">
                    <span className="font-bold text-slate-400 uppercase text-[10px] block mb-1">
                      Mensaje / Requerimiento del Cliente:
                    </span>
                    {lead.message}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                    {lead.phone && (
                      <span className="font-mono text-slate-300">
                        📞 {lead.phone}
                      </span>
                    )}
                    {lead.email && (
                      <span className="text-slate-400">
                        ✉️ {lead.email}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {lead.phone && (
                      <>
                        <a
                          href={`https://wa.me/${waNumber}?text=${waText}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm"
                        >
                          <MessageSquare size={14} />
                          <span>Escribir por WhatsApp</span>
                        </a>

                        <a
                          href={`tel:${cleanPhone}`}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
                          title="Llamar"
                        >
                          <Phone size={14} />
                        </a>
                      </>
                    )}

                    {lead.email && (
                      <a
                        href={`mailto:${lead.email}?subject=Asesoría ATOMIC Ecuador - Proyecto ${lead.projectType}`}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
                        title="Enviar correo"
                      >
                        <Mail size={14} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
