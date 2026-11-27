"use client"

import React, { useState, useEffect, useCallback, useRef } from "react"
import {
  Download, Upload, Trash2, CheckCircle2, Lock, Save, FileText,
  Image as ImageIcon, Loader2, Camera, User, Target, AlertCircle, Flame
} from "lucide-react"

interface PubImage {
  id: string
  url: string
  fileName?: string | null
  slotIndex: number
}

interface EvidenceSlot {
  id: string
  slotIndex: number
  screenshotUrl?: string | null
  uploadedAt?: string | null
}

interface AssignmentDetail {
  id: string
  topicTitle?: string | null
  imageCount: number
  observations?: string | null
  documentUrl?: string | null
  documentName?: string | null
  status: string
  savedAt?: string | null
  closedAt?: string | null
  createdAt: string
  advisor: {
    id: string
    firstName: string
    lastName: string
    category?: string | null
    objective?: string | null
    jobRole?: string | null
  }
  publicationImages: PubImage[]
  evidenceSlots: EvidenceSlot[]
}

async function triggerFileDownload(url: string, fallbackName: string) {
  try {
    const res = await fetch(url)
    const blob = await res.blob()
    const blobUrl = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = blobUrl
    a.download = fallbackName
    document.body.appendChild(a)
    a.click()
    a.remove()
    setTimeout(() => URL.revokeObjectURL(blobUrl), 3000)
  } catch {
    window.open(url, "_blank")
  }
}

export default function EntregaClient({ token }: { token: string }) {
  const [assignment, setAssignment] = useState<AssignmentDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [uploadingSlotId, setUploadingSlotId] = useState<string | null>(null)
  const [savingAction, setSavingAction] = useState<"save_day" | "close_day" | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const fileInputsRef = useRef<Record<string, HTMLInputElement | null>>({})

  const notify = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 4000)
  }

  const fetchDetail = useCallback(async () => {
    try {
      const res = await fetch(`/api/flash/entrega/${encodeURIComponent(token)}`)
      if (!res.ok) {
        setError("Enlace no encontrado o expirado.")
        setLoading(false)
        return
      }
      const data = await res.json()
      setAssignment(data.assignment)
    } catch {
      setError("Error de conexión al cargar la asignación.")
    }
    setLoading(false)
  }, [token])

  useEffect(() => {
    fetchDetail()
  }, [fetchDetail])

  async function handleUploadEvidence(slotId: string, file: File) {
    setUploadingSlotId(slotId)
    try {
      const fd = new FormData()
      fd.append("file", file)
      fd.append("token", token)
      const upRes = await fetch("/api/flash/upload-public", { method: "POST", body: fd })
      const upData = await upRes.json()
      if (!upRes.ok || !upData.url) {
        notify(upData.error || "No se pudo subir la captura")
        setUploadingSlotId(null)
        return
      }
      const res = await fetch(`/api/flash/entrega/${encodeURIComponent(token)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "upload_evidence", slotId, screenshotUrl: upData.url }),
      })
      const data = await res.json()
      if (res.ok && data.assignment) {
        setAssignment(data.assignment)
        notify("Captura subida correctamente")
      }
    } catch {
      notify("Error de red al subir la captura")
    }
    setUploadingSlotId(null)
  }

  async function handleDeleteEvidence(slotId: string) {
    setUploadingSlotId(slotId)
    try {
      const res = await fetch(`/api/flash/entrega/${encodeURIComponent(token)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete_evidence", slotId }),
      })
      const data = await res.json()
      if (res.ok && data.assignment) {
        setAssignment(data.assignment)
        notify("Captura eliminada")
      }
    } catch { /* noop */ }
    setUploadingSlotId(null)
  }

  async function handleDayAction(action: "save_day" | "close_day") {
    if (action === "close_day") {
      const ok = window.confirm("¿Seguro que deseas CERRAR EL DÍA? Una vez cerrado ya no podrás subir ni modificar capturas en este enlace.")
      if (!ok) return
    }
    setSavingAction(action)
    try {
      const res = await fetch(`/api/flash/entrega/${encodeURIComponent(token)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      })
      const data = await res.json()
      if (res.ok && data.assignment) {
        setAssignment(data.assignment)
        notify(
          action === "close_day"
            ? "✅ Día cerrado exitosamente."
            : "💾 Progreso guardado. Puedes volver más tarde a subir el resto."
        )
      } else {
        notify(data.error || "No se pudo completar la acción")
      }
    } catch {
      notify("Error de conexión")
    }
    setSavingAction(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080e18] flex flex-col items-center justify-center gap-3 text-slate-300">
        <Loader2 size={32} className="text-emerald-400 animate-spin" />
        <p className="text-sm">Cargando material asignado...</p>
      </div>
    )
  }

  if (error || !assignment) {
    return (
      <div className="min-h-screen bg-[#080e18] flex flex-col items-center justify-center p-6 text-center gap-3 text-slate-300">
        <AlertCircle size={40} className="text-rose-400" />
        <h1 className="text-lg font-black text-white">{error || "Enlace inválido"}</h1>
        <p className="text-xs text-slate-400 max-w-sm">Verifica con Stefi (Edición) que te haya compartido el enlace correcto.</p>
      </div>
    )
  }

  const isClosed = assignment.status === "CLOSED"
  const filledCount = assignment.evidenceSlots.filter((s) => Boolean(s.screenshotUrl)).length

  return (
    <div className="min-h-screen bg-[#080e18] text-slate-100 pb-24">
      {toast && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-2xl border border-emerald-400/50 whitespace-nowrap">
          {toast}
        </div>
      )}

      {/* Top Header */}
      <div className="bg-[#0b1322] border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center">
              <Flame size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-sm font-black text-white leading-tight">ATOMIC Flash — Entrega de Asesor</h1>
              <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                <User size={11} className="text-emerald-400" />
                {assignment.advisor.firstName} {assignment.advisor.lastName}
                {assignment.advisor.category && <span className="text-slate-500">· {assignment.advisor.category}</span>}
              </p>
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-[11px] font-black border ${
              isClosed
                ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                : "bg-amber-500/15 border-amber-500/30 text-amber-300"
            }`}
          >
            {isClosed ? "🔒 Día Cerrado" : `${filledCount}/${assignment.imageCount} Entregas`}
          </span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Assignment Info */}
        <div className="bg-[#0f1726] border border-slate-800 rounded-2xl p-5 space-y-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Tema / Grupo Asignado</p>
            <h2 className="text-base font-black text-white mt-0.5">
              {assignment.topicTitle || `Publicaciones del día (${assignment.imageCount})`}
            </h2>
          </div>

          {assignment.advisor.objective && (
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3 flex items-start gap-2">
              <Target size={14} className="text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-300">{assignment.advisor.objective}</p>
            </div>
          )}

          {assignment.observations && (
            <p className="text-xs text-slate-300 bg-slate-900/60 border border-slate-800 rounded-xl p-3">
              <span className="font-bold text-slate-400">Indicaciones de Stefi: </span>
              {assignment.observations}
            </p>
          )}
        </div>

        {/* Assigned Images with Independent Download */}
        <div className="bg-[#0f1726] border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <ImageIcon size={16} className="text-cyan-400" />
              1. Descarga tus Anuncios Asignados ({assignment.publicationImages.length})
            </h3>
          </div>

          {assignment.publicationImages.length === 0 ? (
            <p className="text-xs text-slate-500">No se adjuntaron imágenes aún.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {assignment.publicationImages.map((img, i) => (
                <div key={img.id} className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
                  <div className="aspect-square bg-slate-950 overflow-hidden">
                    <img src={img.url} alt={img.fileName || `Anuncio ${i + 1}`} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-2.5 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-400 truncate">
                      {img.fileName || `Anuncio #${i + 1}`}
                    </span>
                    <button
                      type="button"
                      onClick={() => triggerFileDownload(img.url, img.fileName || `anuncio-${i + 1}.jpg`)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-[11px] font-bold shrink-0 transition-colors"
                    >
                      <Download size={12} /> Descargar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Document / Copy Download */}
          {assignment.documentUrl && (
            <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/50 rounded-xl p-3.5">
              <div className="flex items-center gap-2.5 min-w-0">
                <FileText size={18} className="text-emerald-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">{assignment.documentName || "Documento / Cuadro de Texto"}</p>
                  <p className="text-[10px] text-slate-400">Material de texto / Excel adjunto</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => triggerFileDownload(assignment.documentUrl!, assignment.documentName || "documento-asignado")}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shrink-0"
              >
                <Download size={14} /> Descargar Documento
              </button>
            </div>
          )}
        </div>

        {/* Advisor Evidence Upload Slots */}
        <div className="bg-[#0f1726] border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Camera size={16} className="text-emerald-400" />
              2. Sube tus Capturas de Evidencia ({filledCount}/{assignment.imageCount})
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Sube las capturas conforme vayas publicando durante el día y presiona <strong>Guardar</strong> para conservarlas sin perder nada. Al terminar todas, presiona <strong>Cerrar Día</strong>.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {assignment.evidenceSlots.map((slot, idx) => {
              const isBusy = uploadingSlotId === slot.id
              return (
                <div key={slot.id} className="space-y-1.5">
                  <p className="text-[11px] font-bold text-slate-400 text-center">Captura #{idx + 1}</p>
                  <input
                    ref={(el) => { fileInputsRef.current[slot.id] = el }}
                    type="file"
                    accept="image/*,.heic,.heif,.webp"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0]
                      if (f) handleUploadEvidence(slot.id, f)
                      e.target.value = ""
                    }}
                  />
                  {slot.screenshotUrl ? (
                    <div className="relative aspect-square rounded-xl overflow-hidden border border-emerald-500/40 bg-slate-900 group">
                      <img src={slot.screenshotUrl} alt={`Evidencia ${idx + 1}`} className="w-full h-full object-cover" />
                      {!isClosed && (
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => fileInputsRef.current[slot.id]?.click()}
                            className="p-1.5 rounded-lg bg-slate-800 text-white hover:bg-slate-700"
                            title="Reemplazar"
                          >
                            <Upload size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteEvidence(slot.id)}
                            className="p-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-500"
                            title="Eliminar captura"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      )}
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-emerald-600/90 text-[9px] font-bold text-white flex items-center gap-0.5">
                        <CheckCircle2 size={9} /> Listo
                      </span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={isClosed || isBusy}
                      onClick={() => fileInputsRef.current[slot.id]?.click()}
                      className="w-full aspect-square rounded-xl border-2 border-dashed border-slate-700 hover:border-emerald-500/60 bg-slate-900/50 flex flex-col items-center justify-center gap-1.5 text-slate-400 hover:text-emerald-300 transition-colors disabled:opacity-40"
                    >
                      {isBusy ? <Loader2 size={20} className="animate-spin text-emerald-400" /> : <Camera size={20} />}
                      <span className="text-[10px] font-bold">Subir #{idx + 1}</span>
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer Actions: Guardar vs Cerrar Día */}
        <div className="bg-[#0f1726] border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          {isClosed ? (
            <div className="w-full flex items-center justify-center gap-2 py-2 text-emerald-300 text-sm font-black">
              <Lock size={16} /> Día Cerrado el {assignment.closedAt ? new Date(assignment.closedAt).toLocaleString("es-EC") : "hoy"}
            </div>
          ) : (
            <>
              <p className="text-xs text-slate-400">
                ¿Subiste solo algunas capturas? Usa <strong>Guardar</strong> para continuar luego.
              </p>
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  disabled={savingAction !== null}
                  onClick={() => handleDayAction("save_day")}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-black transition-colors"
                >
                  {savingAction === "save_day" ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  Guardar
                </button>
                <button
                  type="button"
                  disabled={savingAction !== null}
                  onClick={() => handleDayAction("close_day")}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition-colors"
                >
                  {savingAction === "close_day" ? <Loader2 size={14} className="animate-spin" /> : <Lock size={14} />}
                  Cerrar Día
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
