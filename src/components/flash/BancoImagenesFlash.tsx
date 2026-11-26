"use client"

import React, { useState, useEffect, useCallback } from "react"
import {
  Image as ImageIcon, Filter, FileText, Download, Eye, X,
  CheckCircle2, Clock, User, Loader2, RefreshCw, ExternalLink
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
  const [loading, setLoading] = useState(true)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

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

  const totalImages = assignments.reduce((acc, a) => acc + a.publicationImages.length, 0)
  const totalEvidences = assignments.reduce(
    (acc, a) => acc + a.evidenceSlots.filter(s => s.screenshotUrl).length,
    0
  )

  return (
    <div className="space-y-5">
      {/* Header & Filter bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0f1621] border border-slate-800 rounded-2xl p-4">
        <div>
          <h2 className="text-base font-black text-white flex items-center gap-2">
            <ImageIcon size={18} className="text-emerald-400" />
            Banco de Imágenes Completo — Flash Studio
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {assignments.length} asignaciones · {totalImages} anuncios subidos · {totalEvidences} evidencias de asesores
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2">
            <Filter size={14} className="text-slate-400" />
            <select
              value={selectedAdvisorId}
              onChange={e => setSelectedAdvisorId(e.target.value)}
              className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
            >
              <option value="" className="bg-slate-900">Ver todos los asesores</option>
              {advisors.map(adv => (
                <option key={adv.id} value={adv.id} className="bg-slate-900">
                  {adv.firstName} {adv.lastName}
                </option>
              ))}
            </select>
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

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Loader2 size={28} className="text-emerald-400 animate-spin" />
          <p className="text-xs text-slate-400">Cargando banco de imágenes...</p>
        </div>
      ) : assignments.length === 0 ? (
        <div className="bg-[#0f1621] border border-slate-800 rounded-2xl p-12 text-center space-y-2">
          <ImageIcon size={32} className="mx-auto text-slate-600" />
          <p className="text-sm font-bold text-slate-300">No hay publicaciones registradas aún</p>
          <p className="text-xs text-slate-500">Cuando Stefi asigne anuncios a un vendedor, aparecerán aquí.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {assignments.map(a => {
            const filledEvidences = a.evidenceSlots.filter(s => s.screenshotUrl).length
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

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-bold">
                      {a.publicationImages.length}/{a.imageCount} anuncios
                    </span>
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                      filledEvidences >= a.imageCount
                        ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                        : "bg-amber-500/15 border-amber-500/30 text-amber-300"
                    }`}>
                      {filledEvidences}/{a.imageCount} evidencias
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
          <div className="relative max-w-4xl max-h-[90vh] w-full flex flex-col items-center" onClick={e => e.stopPropagation()}>
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
