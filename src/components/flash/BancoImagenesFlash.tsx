"use client"

import React, { useState, useEffect, useCallback } from "react"
import {
  Image as ImageIcon, Filter, FileText, Download, Eye, X,
  CheckCircle2, Clock, User, Loader2, RefreshCw, ExternalLink,
  Search, Grid3X3, Layers, Link2, Check
} from "lucide-react"

interface BancoImage {
  id: string
  url: string
  fileName?: string | null
  slotIndex: number
}

interface BancoEvidence {
  id: string
  slotIndex: number
  screenshotUrl?: string | null
  uploadedAt?: string | null
}

interface BancoAssignment {
  id: string
  advisorId: string
  topicTitle?: string | null
  imageCount: number
  observations?: string | null
  documentUrl?: string | null
  documentName?: string | null
  shareToken?: string | null
  status: string
  createdAt: string
  advisor: {
    id: string
    firstName: string
    lastName: string
    category?: string | null
  }
  publicationImages: BancoImage[]
  evidenceSlots: BancoEvidence[]
}

interface AdvisorOption {
  id: string
  firstName: string
  lastName: string
}

export default function BancoImagenesFlash() {
  const [assignments, setAssignments] = useState<BancoAssignment[]>([])
  const [advisors, setAdvisors] = useState<AdvisorOption[]>([])
  const [selectedAdvisorId, setSelectedAdvisorId] = useState<string>("")
  const [nameQuery, setNameQuery] = useState<string>("")
  const [viewMode, setViewMode] = useState<"assignments" | "gallery">("assignments")
  const [loading, setLoading] = useState(true)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const fetchBanco = useCallback(async () => {
    setLoading(true)
    try {
      const qs = selectedAdvisorId ? `?advisorId=${encodeURIComponent(selectedAdvisorId)}` : ""
      const res = await fetch(`/api/flash/banco${qs}`)
      if (res.ok) {
        const data = await res.json()
        setAssignments(data.assignments || [])
        setAdvisors(data.advisors || [])
      }
    } catch { /* noop */ }
    setLoading(false)
  }, [selectedAdvisorId])

  useEffect(() => {
    fetchBanco()
  }, [fetchBanco])

  const filteredAssignments = assignments.filter((a) => {
    if (!nameQuery.trim()) return true
    const fullName = `${a.advisor.firstName} ${a.advisor.lastName}`.toLowerCase()
    const topic = (a.topicTitle || "").toLowerCase()
    const q = nameQuery.trim().toLowerCase()
    return fullName.includes(q) || topic.includes(q)
  })

  const allFlatImages = filteredAssignments.flatMap((a) => [
    ...a.publicationImages.map((img, i) => ({
      key: `pub-${img.id}`,
      url: img.url,
      label: img.fileName || `Anuncio #${i + 1}`,
      kind: "ANUNCIO" as const,
      advisorName: `${a.advisor.firstName} ${a.advisor.lastName}`,
      topic: a.topicTitle || "Sin tema",
      createdAt: a.createdAt,
    })),
    ...a.evidenceSlots
      .filter((s) => Boolean(s.screenshotUrl))
      .map((s) => ({
        key: `ev-${s.id}`,
        url: s.screenshotUrl!,
        label: `Evidencia #${s.slotIndex + 1}`,
        kind: "EVIDENCIA" as const,
        advisorName: `${a.advisor.firstName} ${a.advisor.lastName}`,
        topic: a.topicTitle || "Sin tema",
        createdAt: s.uploadedAt || a.createdAt,
      })),
  ])

  const totalImages = filteredAssignments.reduce((acc, a) => acc + a.publicationImages.length, 0)
  const totalEvidences = filteredAssignments.reduce(
    (acc, a) => acc + a.evidenceSlots.filter((s) => s.screenshotUrl).length,
    0
  )

  function copyShareLink(a: BancoAssignment) {
    const token = a.shareToken || a.id
    const url = `${window.location.origin}/flash-entrega/${token}`
    navigator.clipboard.writeText(url)
    setCopiedId(a.id)
    setTimeout(() => setCopiedId(null), 2500)
  }

  return (
    <div className="space-y-5">
      {/* Header & Filter bar */}
      <div className="bg-[#0f1621] border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <ImageIcon size={18} className="text-emerald-400" />
              Banco de Imágenes Completo — Flash Studio
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {filteredAssignments.length} asignaciones · {totalImages} anuncios · {totalEvidences} evidencias
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* View mode switcher */}
            <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl p-0.5">
              <button
                type="button"
                onClick={() => setViewMode("assignments")}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors ${
                  viewMode === "assignments" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                <Layers size={12} /> Por Asesor
              </button>
              <button
                type="button"
                onClick={() => setViewMode("gallery")}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors ${
                  viewMode === "gallery" ? "bg-cyan-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                <Grid3X3 size={12} /> Todas General ({allFlatImages.length})
              </button>
            </div>

            <button
              type="button"
              onClick={fetchBanco}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-colors"
              title="Actualizar banco"
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* Search by advisor name + dropdown */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="flex-1 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={nameQuery}
              onChange={(e) => setNameQuery(e.target.value)}
              placeholder="Filtrar por nombre del asesor o tema..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2">
            <Filter size={14} className="text-slate-400" />
            <select
              value={selectedAdvisorId}
              onChange={(e) => setSelectedAdvisorId(e.target.value)}
              className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
            >
              <option value="" className="bg-slate-900">Ver todos los asesores</option>
              {advisors.map((adv) => (
                <option key={adv.id} value={adv.id} className="bg-slate-900">
                  {adv.firstName} {adv.lastName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Loader2 size={28} className="text-emerald-400 animate-spin" />
          <p className="text-xs text-slate-400">Cargando banco de imágenes...</p>
        </div>
      ) : filteredAssignments.length === 0 ? (
        <div className="bg-[#0f1621] border border-slate-800 rounded-2xl p-12 text-center space-y-2">
          <ImageIcon size={32} className="mx-auto text-slate-600" />
          <p className="text-sm font-bold text-slate-300">No hay publicaciones con ese filtro</p>
          <p className="text-xs text-slate-500">Prueba limpiando el filtro de nombre o seleccionando todos los asesores.</p>
        </div>
      ) : viewMode === "gallery" ? (
        /* General Flat Gallery View */
        <div className="bg-[#0f1621] border border-slate-800 rounded-2xl p-5">
          {allFlatImages.length === 0 ? (
            <p className="text-center text-xs text-slate-500 py-8">No hay imágenes subidas aún</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {allFlatImages.map((item) => (
                <div
                  key={item.key}
                  onClick={() => setPreviewUrl(item.url)}
                  className="group relative aspect-square rounded-xl overflow-hidden bg-slate-900 border border-slate-700 cursor-pointer hover:border-cyan-400 transition-all"
                >
                  <img src={item.url} alt={item.label} className="w-full h-full object-cover" />
                  <div className="absolute top-1.5 left-1.5 right-1.5 flex items-center justify-between gap-1">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] font-black ${
                        item.kind === "ANUNCIO" ? "bg-purple-600/90 text-white" : "bg-emerald-600/90 text-white"
                      }`}
                    >
                      {item.kind}
                    </span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-2">
                    <p className="text-[10px] font-bold text-white truncate">{item.advisorName}</p>
                    <p className="text-[9px] text-slate-300 truncate">{item.topic}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAssignments.map((a) => {
            const filledEvidences = a.evidenceSlots.filter((s) => s.screenshotUrl).length
            const sharePath = `/flash-entrega/${a.shareToken || a.id}`
            return (
              <div key={a.id} className="bg-[#0f1621] border border-slate-800 rounded-2xl p-5 space-y-4">
                {/* Assignment Header */}
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-800 pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                        <User size={12} />
                        {a.advisor.firstName} {a.advisor.lastName}
                      </span>
                      {a.advisor.category && (
                        <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[11px] font-semibold">
                          {a.advisor.category}
                        </span>
                      )}
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Clock size={11} />
                        {new Date(a.createdAt).toLocaleString("es-EC", { dateStyle: "medium", timeStyle: "short" })}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white">
                      {a.topicTitle || `Grupo de ${a.imageCount} publicaciones`}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => copyShareLink(a)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-[11px] font-bold"
                    >
                      {copiedId === a.id ? <Check size={12} /> : <Link2 size={12} />}
                      {copiedId === a.id ? "Link copiado" : "Link Asesor"}
                    </button>
                    <a
                      href={sharePath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold"
                    >
                      Abrir <ExternalLink size={11} />
                    </a>
                    <span className="px-2.5 py-1 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-bold">
                      {a.publicationImages.length}/{a.imageCount} anuncios
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                        a.status === "CLOSED"
                          ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                          : filledEvidences >= a.imageCount
                          ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                          : "bg-amber-500/15 border-amber-500/30 text-amber-300"
                      }`}
                    >
                      {a.status === "CLOSED" ? "Cerrado · " : ""}{filledEvidences}/{a.imageCount} evidencias
                    </span>
                  </div>
                </div>

                {/* Documents & Observations */}
                {(a.documentUrl || a.observations) && (
                  <div className="flex flex-col sm:flex-row gap-3 bg-slate-900/60 border border-slate-800 rounded-xl p-3">
                    {a.documentUrl && (
                      <a
                        href={a.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/25 text-xs font-bold transition-colors shrink-0"
                      >
                        <FileText size={14} />
                        {a.documentName || "Ver Documento / Excel"}
                        <ExternalLink size={12} />
                      </a>
                    )}
                    {a.observations && (
                      <p className="text-xs text-slate-300 leading-relaxed">
                        <span className="font-bold text-slate-400">Observaciones: </span>
                        {a.observations}
                      </p>
                    )}
                  </div>
                )}

                {/* Images Grid: Diseños de Stefi */}
                {a.publicationImages.length > 0 && (
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Publicaciones Asignadas (Diseñadas por Stefi)
                    </p>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                      {a.publicationImages.map((img, i) => (
                        <div
                          key={img.id}
                          onClick={() => setPreviewUrl(img.url)}
                          className="group relative aspect-square rounded-xl overflow-hidden bg-slate-800 border border-slate-700 cursor-pointer hover:border-emerald-400 transition-all"
                        >
                          <img src={img.url} alt={img.fileName || `Ad ${i + 1}`} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Eye size={18} className="text-white" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Evidence Screenshots Grid */}
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Evidencias de Publicación (Capturas del Asesor)
                  </p>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                    {a.evidenceSlots.map((slot, i) => (
                      <div
                        key={slot.id}
                        onClick={() => slot.screenshotUrl && setPreviewUrl(slot.screenshotUrl)}
                        className={`relative aspect-square rounded-xl overflow-hidden border flex flex-col items-center justify-center ${
                          slot.screenshotUrl
                            ? "bg-slate-800 border-emerald-500/40 cursor-pointer hover:border-emerald-400"
                            : "bg-slate-900/50 border-slate-800 text-slate-600"
                        }`}
                      >
                        {slot.screenshotUrl ? (
                          <>
                            <img src={slot.screenshotUrl} alt={`Evidencia ${i + 1}`} className="w-full h-full object-cover" />
                            <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-emerald-600/90 text-[9px] font-bold text-white flex items-center gap-0.5">
                              <CheckCircle2 size={9} /> #{i + 1}
                            </span>
                          </>
                        ) : (
                          <span className="text-[10px] font-medium">Pendiente #{i + 1}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Lightbox Modal */}
      {previewUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewUrl(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 self-end mb-2">
              <a
                href={previewUrl}
                download
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Download size={14} /> Descargar
              </a>
              <button
                type="button"
                onClick={() => setPreviewUrl(null)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white"
              >
                <X size={18} />
              </button>
            </div>
            <img src={previewUrl} alt="Vista previa" className="max-h-[82vh] max-w-full rounded-xl object-contain border border-slate-700" />
          </div>
        </div>
      )}
    </div>
  )
}
