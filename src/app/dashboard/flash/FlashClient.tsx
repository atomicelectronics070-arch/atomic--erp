"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Plus, ChevronDown, ChevronRight, User, Phone, Calendar, Briefcase,
  Image as ImageIcon, Upload, X, Check, Save, Loader2, AlertCircle,
  ToggleLeft, ToggleRight, FileText, Eye, EyeOff, Trash2, Edit3,
  BookOpen, Target, Users, Camera, Grid3X3, Filter, Download,
  CheckCircle2, Clock, Tag, MessageSquare, Flame, Play,
  Link2, Lock, Unlock, ExternalLink, CalendarDays
} from "lucide-react"
import BancoImagenesFlash from "@/components/flash/BancoImagenesFlash"

// ─── Types ───────────────────────────────────────────────────────────────────

type Propuesta = "PROMOCION" | "BRANDING" | "RETARGETING"

interface FlashPhoneContact {
  id: string
  slotIndex: number
  clientName?: string | null
  phone?: string | null
  propuesta?: string | null
  screenshotUrl?: string | null
  sentAt?: string | null
}

interface FlashPhoneAssignment {
  id: string
  advisorId: string
  phoneCount: number
  status: string
  contacts: FlashPhoneContact[]
  createdAt: string
}

interface FlashPublicationImage {
  id: string
  url: string
  fileName?: string | null
  slotIndex: number
}

interface FlashEvidenceSlot {
  id: string
  slotIndex: number
  screenshotUrl?: string | null
  uploadedAt?: string | null
}

interface FlashPublicationAssignment {
  id: string
  advisorId: string
  topicTitle?: string | null
  imageCount: number
  observations?: string | null
  documentUrl?: string | null
  documentName?: string | null
  shareToken?: string | null
  status: string
  savedAt?: string | null
  closedAt?: string | null
  publicationImages: FlashPublicationImage[]
  evidenceSlots: FlashEvidenceSlot[]
  createdAt: string
}

interface FlashDailyLog {
  id: string
  dateStr: string
  status: string
  pubsAssigned: number
  evidencesDone: number
  phonesAssigned: number
  phonesDone: number
  closedAt?: string | null
}

interface FlashAdvisor {
  id: string
  firstName: string
  lastName: string
  phone?: string | null
  startDate?: string | null
  jobRole?: string | null
  category?: string | null
  objective?: string | null
  pubEnabled?: boolean
  phoneEnabled?: boolean
  msgEnabled?: boolean
  dayStatus?: string
  dayClosedAt?: string | null
  isActive: boolean
  publicationAssignments: FlashPublicationAssignment[]
  phoneAssignments: FlashPhoneAssignment[]
  dailyLogs?: FlashDailyLog[]
  createdAt: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SUICIDE_SQUAD_CATEGORIES = [
  { id: "GAMING", label: "Gaming & Consolas (PS4/PS5)" },
  { id: "COMPUTO", label: "Computación & Laptops" },
  { id: "DOMOTICA", label: "Domótica & Cerraduras Biométricas" },
  { id: "ENERGIA", label: "Energía & Respaldo Eléctrico" },
  { id: "PANELES", label: "Paneles WPC & Acabados" },
  { id: "SEGURIDAD", label: "Seguridad & CCTV" },
  { id: "REDES", label: "Redes & Conectividad" },
  { id: "GENERAL", label: "General / Sin categoría" },
]

const JOB_ROLES = [
  "Asesor de Ventas",
  "Asesor Senior",
  "Prospector B2B",
  "Prospector Digital",
  "Coordinador de Ventas",
  "Técnico de Campo",
  "Community Manager",
  "Otro",
]

const PROPUESTAS: { id: Propuesta; label: string; color: string }[] = [
  { id: "PROMOCION", label: "Promoción", color: "bg-amber-500/20 text-amber-300 border-amber-500/40" },
  { id: "BRANDING", label: "Branding", color: "bg-purple-500/20 text-purple-300 border-purple-500/40" },
  { id: "RETARGETING", label: "Retargeting", color: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40" },
]

const PHONE_COUNT_OPTIONS = [3, 5, 10]
const PUB_COUNT_OPTIONS = [1, 3, 5]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function categoryLabel(id?: string | null) {
  return SUICIDE_SQUAD_CATEGORIES.find(c => c.id === id)?.label || id || "Sin categoría"
}

async function uploadFileToStorage(file: File): Promise<string> {
  // Upload via /api/upload (uses existing storage pattern)
  const formData = new FormData()
  formData.append("file", file)
  const res = await fetch("/api/upload", { method: "POST", body: formData })
  if (!res.ok) throw new Error("Upload failed")
  const data = await res.json()
  return data.url as string
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Toggle({ on, onToggle, label }: { on: boolean; onToggle: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex items-center gap-3 group"
    >
      <div
        className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${on ? "bg-emerald-500" : "bg-slate-600"}`}
      >
        <div
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${on ? "translate-x-5" : "translate-x-0"}`}
        />
      </div>
      <span className={`text-sm font-semibold transition-colors ${on ? "text-emerald-300" : "text-slate-400"}`}>
        {label}
      </span>
    </button>
  )
}

function CountCheck({
  options, custom, value, onChange, onCustomChange,
}: {
  options: number[]
  custom?: boolean
  value: number | null
  onChange: (v: number) => void
  onCustomChange?: (v: number) => void
}) {
  const [customVal, setCustomVal] = useState("")

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {options.map(opt => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`px-3 py-1.5 rounded-lg text-sm font-bold border transition-all ${value === opt
            ? "bg-emerald-500 border-emerald-400 text-white shadow-[0_0_12px_rgba(16,185,129,0.4)]"
            : "bg-slate-800 border-slate-600 text-slate-300 hover:border-emerald-500/50"
            }`}
        >
          {opt}
        </button>
      ))}
      {custom && (
        <div className="flex items-center gap-1.5">
          <input
            type="number"
            min={1}
            max={50}
            placeholder="Personalizar"
            value={customVal}
            onChange={e => setCustomVal(e.target.value)}
            className="w-28 px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-600 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
          />
          {customVal && (
            <button
              type="button"
              onClick={() => { onChange(Number(customVal)); onCustomChange?.(Number(customVal)) }}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
            >
              OK
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// Image uploader — multi-file drag & drop
function MultiImageUploader({
  onUploaded,
  label,
}: {
  onUploaded: (files: { url: string; fileName: string }[]) => void
  label?: string
}) {
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFiles(files: FileList | File[]) {
    const arr = Array.from(files)
    if (!arr.length) return
    setUploading(true)
    setProgress(0)
    const results: { url: string; fileName: string }[] = []
    for (let i = 0; i < arr.length; i++) {
      try {
        const url = await uploadFileToStorage(arr[i])
        results.push({ url, fileName: arr[i].name })
      } catch { /* skip */ }
      setProgress(Math.round(((i + 1) / arr.length) * 100))
    }
    setUploading(false)
    onUploaded(results)
  }

  return (
    <div
      onDragOver={e => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files) }}
      className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${dragging ? "border-emerald-400 bg-emerald-500/10" : "border-slate-600 hover:border-slate-500 bg-slate-800/40"}`}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*,.jpg,.jpeg,.png,.webp,.gif,.bmp,.tiff,.heic,.svg"
        className="hidden"
        onChange={e => e.target.files && handleFiles(e.target.files)}
      />
      {uploading ? (
        <div className="space-y-2">
          <Loader2 className="mx-auto text-emerald-400 animate-spin" size={28} />
          <p className="text-sm text-emerald-300 font-medium">Subiendo... {progress}%</p>
          <div className="w-full bg-slate-700 rounded-full h-1.5">
            <div className="bg-emerald-500 h-1.5 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <Upload className="mx-auto text-slate-400" size={28} />
          <p className="text-sm text-white font-semibold">{label || "Aquí puedes subir de golpe todas las imágenes"}</p>
          <p className="text-xs text-slate-400">Arrastra o haz clic · JPG, PNG, WEBP, HEIC, GIF · Múltiples a la vez</p>
        </div>
      )}
    </div>
  )
}

// Single image/file uploader (for evidence slots)
function SingleFileUploader({
  onUploaded,
  onDelete,
  currentUrl,
  accept,
  placeholder,
}: {
  onUploaded: (url: string, fileName?: string) => void
  onDelete?: () => void
  currentUrl?: string | null
  accept?: string
  placeholder?: string
}) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    setUploading(true)
    try {
      const url = await uploadFileToStorage(file)
      onUploaded(url, file.name)
    } catch { /* ignore */ }
    setUploading(false)
  }

  return (
    <div
      className="relative border border-dashed border-slate-600 rounded-xl overflow-hidden cursor-pointer hover:border-emerald-500/50 transition-colors"
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept || "image/*,.pdf,.xlsx,.docx,.doc,.xls,.csv"}
        className="hidden"
        onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
      {currentUrl ? (
        <div className="relative w-full h-32 bg-slate-800 group">
          <img src={currentUrl} alt="evidence" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-xs text-white font-medium px-2 py-1 rounded bg-slate-800/80">Cambiar</span>
            {onDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete()
                }}
                className="p-1.5 rounded bg-rose-600 hover:bg-rose-500 text-white"
                title="Eliminar captura"
              >
                <Trash2 size={12} />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="h-28 flex flex-col items-center justify-center gap-2 text-slate-500">
          {uploading ? (
            <Loader2 className="animate-spin text-emerald-400" size={22} />
          ) : (
            <>
              <Camera size={22} />
              <span className="text-xs">{placeholder || "Subir evidencia"}</span>
            </>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Publication Assignment Panel ─────────────────────────────────────────────

function PublicationPanel({
  advisorId,
  assignments,
  onRefresh,
}: {
  advisorId: string
  assignments: FlashPublicationAssignment[]
  onRefresh: () => void
}) {
  const [pubCount, setPubCount] = useState<number | null>(null)
  const [topicTitle, setTopicTitle] = useState("")
  const [observations, setObservations] = useState("")
  const [pendingImages, setPendingImages] = useState<{ url: string; fileName: string }[]>([])
  const [pendingDoc, setPendingDoc] = useState<{ url: string; name: string } | null>(null)
  const [saving, setSaving] = useState(false)
  const [expandedAssignment, setExpandedAssignment] = useState<string | null>(null)

  async function handleSave() {
    if (!pubCount) return
    setSaving(true)
    try {
      // 1. Create assignment + slots
      const res = await fetch("/api/flash/publications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          advisorId,
          topicTitle: topicTitle || null,
          imageCount: pubCount,
          observations: observations || null,
          documentUrl: pendingDoc?.url || null,
          documentName: pendingDoc?.name || null,
        }),
      })
      const data = await res.json()
      const assignmentId = data.assignment?.id
      // 2. Upload images
      if (pendingImages.length > 0 && assignmentId) {
        await fetch(`/api/flash/publications/${assignmentId}/images`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            images: pendingImages.map((img, i) => ({ url: img.url, fileName: img.fileName, slotIndex: i })),
          }),
        })
      }
      setPubCount(null)
      setTopicTitle("")
      setObservations("")
      setPendingImages([])
      setPendingDoc(null)
      if (assignmentId) setExpandedAssignment(assignmentId)
      onRefresh()
    } catch { /* noop */ }
    setSaving(false)
  }

  async function handleEvidenceUpload(assignmentId: string, slotId: string, url: string) {
    await fetch(`/api/flash/publications/${assignmentId}/images`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slotId, screenshotUrl: url }),
    })
    onRefresh()
  }

  return (
    <div className="space-y-5">
      {/* Creator */}
      <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 space-y-4">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <ImageIcon size={15} className="text-emerald-400" />
          Nueva asignación de publicaciones
        </h4>

        {/* Count selector */}
        <div>
          <p className="text-xs text-slate-400 mb-2">¿Cuántas publicaciones asignas?</p>
          <CountCheck options={PUB_COUNT_OPTIONS} custom value={pubCount} onChange={setPubCount} />
        </div>

        {/* Topic */}
        <div>
          <input
            type="text"
            value={topicTitle}
            onChange={e => setTopicTitle(e.target.value)}
            placeholder="Escribe aquí la categoría o el grupo de anuncios asignado al asesor o el objetivo"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        {/* Bulk image upload */}
        {pubCount && pubCount > 0 && (
          <div>
            <p className="text-xs text-slate-400 mb-2">
              Sube los <span className="text-emerald-400 font-bold">{pubCount}</span> anuncio(s) diseñados
            </p>
            <MultiImageUploader
              onUploaded={imgs => setPendingImages(prev => [...prev, ...imgs])}
            />
            {pendingImages.length > 0 && (
              <div className="mt-3 grid grid-cols-4 sm:grid-cols-6 gap-2">
                {pendingImages.map((img, i) => (
                  <div key={i} className="relative group rounded-lg overflow-hidden aspect-square bg-slate-700">
                    <img src={img.url} alt={img.fileName} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setPendingImages(prev => prev.filter((_, j) => j !== i))}
                      className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Document */}
        <div>
          <p className="text-xs text-slate-400 mb-2">Documento de apoyo (Excel, Doc, PDF — opcional)</p>
          <label className="flex items-center gap-3 cursor-pointer px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 transition-colors">
            <FileText size={16} className="text-slate-400" />
            <span className="text-sm text-slate-400 flex-1 truncate">
              {pendingDoc ? pendingDoc.name : "Adjuntar documento..."}
            </span>
            <input
              type="file"
              accept=".xlsx,.xls,.csv,.doc,.docx,.pdf,.txt"
              className="hidden"
              onChange={async e => {
                const f = e.target.files?.[0]
                if (!f) return
                const url = await uploadFileToStorage(f)
                setPendingDoc({ url, name: f.name })
              }}
            />
          </label>
        </div>

        {/* Observations */}
        <textarea
          value={observations}
          onChange={e => setObservations(e.target.value)}
          placeholder="Observaciones..."
          rows={2}
          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none resize-none"
        />

        <button
          type="button"
          disabled={!pubCount || saving}
          onClick={handleSave}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm transition-colors"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? "Guardando..." : "Guardar asignación"}
        </button>
      </div>

      {/* Existing assignments */}
      {assignments.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Asignaciones anteriores ({assignments.length})
          </p>
          {assignments.map(a => (
            <div key={a.id} className="bg-slate-800/40 border border-slate-700/60 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setExpandedAssignment(expandedAssignment === a.id ? null : a.id)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-700/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${a.status === 'ACTIVE' ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                  <span className="text-sm font-semibold text-white">{a.topicTitle || `Asignación ${a.imageCount} pub.`}</span>
                  <span className="text-xs text-slate-500">{a.imageCount} pub · {a.publicationImages.length} subidas</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">
                    {a.evidenceSlots.filter(s => s.screenshotUrl).length}/{a.imageCount} evidencias
                  </span>
                  {expandedAssignment === a.id ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronRight size={14} className="text-slate-400" />}
                </div>
              </button>

              <AnimatePresence>
                {expandedAssignment === a.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 space-y-4 border-t border-slate-700/60">
                      {/* Shareable Advisor Link Bar */}
                      <div className="mt-3 p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-[11px] font-bold text-cyan-300 flex items-center gap-1.5">
                            <Link2 size={13} /> Link directo para el asesor (descargar y subir entregas)
                          </p>
                          <p className="text-[10px] text-slate-400 truncate font-mono mt-0.5">
                            /flash-entrega/{a.shareToken || a.id}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              const link = `${window.location.origin}/flash-entrega/${a.shareToken || a.id}`
                              navigator.clipboard.writeText(link)
                            }}
                            className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-[11px] font-bold flex items-center gap-1"
                          >
                            <Link2 size={12} /> Copiar Link
                          </button>
                          <a
                            href={`/flash-entrega/${a.shareToken || a.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white text-[11px] font-bold flex items-center gap-1"
                          >
                            Abrir <ExternalLink size={11} />
                          </a>
                        </div>
                      </div>

                      {/* Published images (editable: delete or add more) */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-bold text-slate-400 uppercase">
                            Anuncios diseñados ({a.publicationImages.length})
                          </p>
                          <label className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-emerald-300 text-[11px] font-bold cursor-pointer">
                            <Upload size={11} /> + Subir imagen
                            <input
                              type="file"
                              accept="image/*,.heic,.heif,.webp"
                              multiple
                              className="hidden"
                              onChange={async (e) => {
                                const files = Array.from(e.target.files || [])
                                if (!files.length) return
                                const uploaded = []
                                for (let i = 0; i < files.length; i++) {
                                  const url = await uploadFileToStorage(files[i])
                                  uploaded.push({ url, fileName: files[i].name, slotIndex: a.publicationImages.length + i })
                                }
                                await fetch(`/api/flash/publications/${a.id}/images`, {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ images: uploaded }),
                                })
                                e.target.value = ""
                                onRefresh()
                              }}
                            />
                          </label>
                        </div>
                        {a.publicationImages.length > 0 && (
                          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                            {a.publicationImages.map(img => (
                              <div key={img.id} className="group relative rounded-lg overflow-hidden aspect-square bg-slate-700 border border-slate-600">
                                <img src={img.url} alt={img.fileName || "pub"} className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={async () => {
                                    await fetch(`/api/flash/publications/${a.id}/images?imageId=${img.id}`, {
                                      method: "DELETE",
                                    })
                                    onRefresh()
                                  }}
                                  className="absolute top-1 right-1 p-1 rounded-full bg-rose-600/90 hover:bg-rose-500 text-white opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity"
                                  title="Eliminar imagen"
                                >
                                  <Trash2 size={11} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Evidence slots */}
                      <div>
                        <p className="text-xs font-bold text-slate-400 mb-2 uppercase">
                          Capturas de evidencia ({a.evidenceSlots.filter(s => s.screenshotUrl).length}/{a.imageCount})
                        </p>
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                          {a.evidenceSlots.map(slot => (
                            <div key={slot.id} className="space-y-1">
                              <p className="text-[10px] text-slate-500 text-center">#{slot.slotIndex + 1}</p>
                              <SingleFileUploader
                                currentUrl={slot.screenshotUrl}
                                accept="image/*"
                                placeholder={`Evidencia ${slot.slotIndex + 1}`}
                                onUploaded={(url) => handleEvidenceUpload(a.id, slot.id, url)}
                                onDelete={async () => {
                                  await fetch(`/api/flash/publications/${a.id}/images?slotId=${slot.id}`, {
                                    method: "DELETE",
                                  })
                                  onRefresh()
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Doc + observations */}
                      {a.documentUrl && (
                        <a href={a.documentUrl} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-2 text-xs text-cyan-400 hover:text-cyan-300 underline">
                          <FileText size={12} /> {a.documentName || "Documento adjunto"}
                        </a>
                      )}
                      {a.observations && (
                        <p className="text-xs text-slate-400 italic bg-slate-900/40 rounded-lg px-3 py-2">
                          {a.observations}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Phone Assignment Panel ────────────────────────────────────────────────────

function PhonePanel({
  advisorId,
  phoneAssignments,
  onRefresh,
}: {
  advisorId: string
  phoneAssignments: FlashPhoneAssignment[]
  onRefresh: () => void
}) {
  const [phoneCount, setPhoneCount] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [expandedAssignment, setExpandedAssignment] = useState<string | null>(null)
  const [localContacts, setLocalContacts] = useState<Record<string, FlashPhoneContact[]>>({})

  function getContacts(a: FlashPhoneAssignment): FlashPhoneContact[] {
    return localContacts[a.id] ?? a.contacts
  }

  async function handleCreate() {
    if (!phoneCount) return
    setSaving(true)
    try {
      const res = await fetch("/api/flash/phones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ advisorId, phoneCount }),
      })
      const data = await res.json()
      setExpandedAssignment(data.assignment?.id)
      setPhoneCount(null)
      onRefresh()
    } catch { /* noop */ }
    setSaving(false)
  }

  async function saveContact(contactId: string, patch: Partial<FlashPhoneContact>) {
    await fetch("/api/flash/phones", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contactId, ...patch }),
    })
    // local refresh will come via onRefresh — no spinner needed per slot
  }

  function updateLocal(assignmentId: string, contacts: FlashPhoneContact[]) {
    setLocalContacts(prev => ({ ...prev, [assignmentId]: contacts }))
  }

  return (
    <div className="space-y-5">
      {/* Creator */}
      <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 space-y-4">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <Phone size={15} className="text-cyan-400" />
          Nueva asignación de números
        </h4>
        <div>
          <p className="text-xs text-slate-400 mb-2">¿Cuántos números asignas?</p>
          <CountCheck options={PHONE_COUNT_OPTIONS} value={phoneCount} onChange={setPhoneCount} />
        </div>
        <button
          type="button"
          disabled={!phoneCount || saving}
          onClick={handleCreate}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm transition-colors"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
          {saving ? "Creando..." : `Crear ${phoneCount || "?"} slots de número`}
        </button>
      </div>

      {/* Existing */}
      {phoneAssignments.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Asignaciones anteriores ({phoneAssignments.length})
          </p>
          {phoneAssignments.map(a => {
            const contacts = getContacts(a)
            const evidenceFilled = contacts.filter(c => c.screenshotUrl).length
            return (
              <div key={a.id} className="bg-slate-800/40 border border-slate-700/60 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setExpandedAssignment(expandedAssignment === a.id ? null : a.id)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-700/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-cyan-400" />
                    <span className="text-sm font-semibold text-white">{a.phoneCount} números asignados</span>
                    <span className="text-xs text-slate-500">{evidenceFilled} evidencias</span>
                  </div>
                  {expandedAssignment === a.id ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronRight size={14} className="text-slate-400" />}
                </button>

                <AnimatePresence>
                  {expandedAssignment === a.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-5 space-y-3 border-t border-slate-700/60">
                        {contacts.map((c, idx) => (
                          <PhoneContactRow
                            key={c.id}
                            contact={c}
                            index={idx}
                            onSave={patch => {
                              saveContact(c.id, patch)
                              const updated = contacts.map((cc, i) => i === idx ? { ...cc, ...patch } : cc)
                              updateLocal(a.id, updated)
                            }}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function PhoneContactRow({
  contact, index, onSave,
}: {
  contact: FlashPhoneContact
  index: number
  onSave: (patch: Partial<FlashPhoneContact>) => void
}) {
  const [clientName, setClientName] = useState(contact.clientName || "")
  const [phone, setPhone] = useState(contact.phone || "")
  const [propuesta, setPropuesta] = useState<string>(contact.propuesta || "")
  const [dirty, setDirty] = useState(false)
  const [saving, setSaving] = useState(false)

  function mark<T>(setter: React.Dispatch<React.SetStateAction<T>>) {
    return (v: T) => { setter(v); setDirty(true) }
  }

  async function save() {
    setSaving(true)
    onSave({ clientName, phone, propuesta })
    setDirty(false)
    setSaving(false)
  }

  return (
    <div className="mt-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-700/40 space-y-3">
      <div className="flex items-center gap-2">
        <span className="w-6 h-6 rounded-full bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 text-xs font-bold flex items-center justify-center">
          {index + 1}
        </span>
        {contact.screenshotUrl && <CheckCircle2 size={14} className="text-emerald-400" />}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          type="text"
          value={clientName}
          onChange={e => mark(setClientName)(e.target.value)}
          placeholder="Cliente u organización"
          className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
        />
        <input
          type="tel"
          value={phone}
          onChange={e => mark(setPhone)(e.target.value)}
          placeholder="0999 999 999"
          className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
        />
      </div>
      {/* Propuesta a ofrecer */}
      <div>
        <label className="block text-[11px] text-slate-400 mb-1">Propuesta a ofrecer</label>
        <select
          value={propuesta}
          onChange={e => mark(setPropuesta)(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white focus:border-cyan-500 focus:outline-none"
        >
          <option value="">Seleccionar propuesta...</option>
          {PROPUESTAS.map(p => (
            <option key={p.id} value={p.id}>{p.label}</option>
          ))}
        </select>
      </div>

      {/* Evidence screenshot */}
      <div>
        <p className="text-[11px] text-slate-500 mb-1.5">Captura de evidencia del envío</p>
        <SingleFileUploader
          currentUrl={contact.screenshotUrl}
          accept="image/*"
          placeholder="Captura de pantalla"
          onUploaded={url => { onSave({ screenshotUrl: url }); setDirty(false) }}
        />
      </div>

      {dirty && (
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-colors"
        >
          {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
          Guardar
        </button>
      )}
    </div>
  )
}

// ─── Advisor Card ─────────────────────────────────────────────────────────────

function AdvisorCard({
  advisor,
  onRefresh,
}: {
  advisor: FlashAdvisor
  onRefresh: () => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [pubOn, setPubOn] = useState(Boolean(advisor.pubEnabled))
  const [phoneOn, setPhoneOn] = useState(Boolean(advisor.phoneEnabled))
  const [msgOn, setMsgOn] = useState(Boolean(advisor.msgEnabled))
  const [editingObjective, setEditingObjective] = useState(false)
  const [objective, setObjective] = useState(advisor.objective || "")
  const [daySaving, setDaySaving] = useState<"SAVED" | "CLOSED" | "OPEN" | null>(null)
  const [dayFeedback, setDayFeedback] = useState<string | null>(null)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState<string | null>(null)

  useEffect(() => {
    setPubOn(Boolean(advisor.pubEnabled))
    setPhoneOn(Boolean(advisor.phoneEnabled))
    setMsgOn(Boolean(advisor.msgEnabled))
    setObjective(advisor.objective || "")
  }, [advisor.pubEnabled, advisor.phoneEnabled, advisor.msgEnabled, advisor.objective])

  async function toggleSwitch(field: "pubEnabled" | "phoneEnabled" | "msgEnabled", nextVal: boolean) {
    if (field === "pubEnabled") setPubOn(nextVal)
    if (field === "phoneEnabled") setPhoneOn(nextVal)
    if (field === "msgEnabled") setMsgOn(nextVal)
    await fetch(`/api/flash/advisors/${advisor.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: nextVal }),
    })
    onRefresh()
  }

  async function handleAdvisorDayAction(status: "SAVED" | "CLOSED" | "OPEN") {
    if (status === "CLOSED") {
      const ok = window.confirm(`¿Cerrar el día de ${advisor.firstName} ${advisor.lastName}? Se registrará en su calendario de 30 días.`)
      if (!ok) return
    }
    setDaySaving(status)
    try {
      await fetch(`/api/flash/advisors/${advisor.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dayStatus: status,
          pubEnabled: pubOn,
          phoneEnabled: phoneOn,
          msgEnabled: msgOn,
        }),
      })
      setDayFeedback(
        status === "CLOSED"
          ? "🔒 Día cerrado y guardado en el calendario"
          : status === "SAVED"
          ? "💾 Cambios guardados — puedes volver a editar cuando quieras"
          : "🔓 Día reabierto para edición"
      )
      setTimeout(() => setDayFeedback(null), 3500)
      onRefresh()
    } catch { /* noop */ }
    setDaySaving(null)
  }

  async function saveObjective() {
    await fetch(`/api/flash/advisors/${advisor.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ objective }),
    })
    setEditingObjective(false)
    onRefresh()
  }

  // Build 30-day calendar entries (today + past 29 days)
  const calendarDays = Array.from({ length: 30 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (29 - i))
    const dateStr = d.toISOString().slice(0, 10)
    const log = advisor.dailyLogs?.find((l) => l.dateStr === dateStr)
    const dayPubs = advisor.publicationAssignments.filter(
      (a) => new Date(a.createdAt).toISOString().slice(0, 10) === dateStr
    )
    const dayPhones = advisor.phoneAssignments.filter(
      (a) => new Date(a.createdAt).toISOString().slice(0, 10) === dateStr
    )
    const pubsAssigned = log?.pubsAssigned ?? dayPubs.reduce((s, a) => s + a.imageCount, 0)
    const evidencesDone = log?.evidencesDone ?? dayPubs.reduce((s, a) => s + a.evidenceSlots.filter((e) => e.screenshotUrl).length, 0)
    const phonesAssigned = log?.phonesAssigned ?? dayPhones.reduce((s, a) => s + a.phoneCount, 0)
    const phonesDone = log?.phonesDone ?? dayPhones.reduce((s, a) => s + a.contacts.filter((c) => c.screenshotUrl).length, 0)
    const status = log?.status || (dayPubs.some((a) => a.status === "CLOSED") ? "CLOSED" : pubsAssigned > 0 || phonesAssigned > 0 ? "SAVED" : "EMPTY")
    return { dateStr, dayNum: d.getDate(), label: d.toLocaleDateString("es-EC", { day: "2-digit", month: "short" }), status, pubsAssigned, evidencesDone, phonesAssigned, phonesDone }
  })

  const selectedDayInfo = calendarDays.find((d) => d.dateStr === selectedDay) || calendarDays[calendarDays.length - 1]

  return (
    <div className="bg-[#0f1621] border border-slate-800 rounded-2xl overflow-hidden transition-all">
      {/* Header row */}
      <div
        className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-slate-800/30 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Avatar */}
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-500/30 to-cyan-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-300 font-bold text-lg flex-shrink-0">
          {advisor.firstName[0]}{advisor.lastName[0]}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-white text-[15px]">
              {advisor.firstName} {advisor.lastName}
            </span>
            {advisor.jobRole && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-700 text-slate-300 border border-slate-600">
                {advisor.jobRole}
              </span>
            )}
            {advisor.category && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-900/40 text-emerald-300 border border-emerald-500/30">
                {categoryLabel(advisor.category)}
              </span>
            )}
            {advisor.dayStatus === "CLOSED" ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                🔒 Día Cerrado
              </span>
            ) : advisor.dayStatus === "SAVED" ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                💾 Guardado
              </span>
            ) : null}
          </div>
          <div className="flex items-center gap-4 mt-0.5">
            {advisor.phone && <span className="text-xs text-slate-400">{advisor.phone}</span>}
            <span className="text-xs text-slate-500">
              {advisor.publicationAssignments.length} pub · {advisor.phoneAssignments.length} tel
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="hidden sm:inline text-xs text-slate-500">
            {new Date(advisor.createdAt).toLocaleDateString("es-EC")}
          </span>
          {expanded
            ? <ChevronDown size={18} className="text-slate-400" />
            : <ChevronRight size={18} className="text-slate-400" />
          }
        </div>
      </div>

      {/* Expanded panel */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-slate-800"
          >
            <div className="px-5 py-5 space-y-5">

              {/* Category + Objective */}
              <div className="space-y-3 p-4 rounded-xl bg-slate-800/40 border border-slate-700/40">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-700/40">
                  <div className="flex items-center gap-2">
                    <Tag size={14} className="text-emerald-400" />
                    <span className="text-xs font-bold text-emerald-300 uppercase tracking-widest">Categoría Suicide Squad</span>
                  </div>
                  <select
                    value={advisor.category || ""}
                    onChange={async (e) => {
                      await fetch(`/api/flash/advisors/${advisor.id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ category: e.target.value || null }),
                      })
                      onRefresh()
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-semibold text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="">Seleccionar categoría...</option>
                    {SUICIDE_SQUAD_CATEGORIES.map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <Target size={14} className="text-amber-400" />
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">Objetivo del asesor</span>
                </div>
                {editingObjective ? (
                  <div className="space-y-2">
                    <textarea
                      value={objective}
                      onChange={e => setObjective(e.target.value)}
                      rows={3}
                      placeholder="Tu objetivo será buscar, por ejemplo, colegios a los que podamos ofrecer tecnología o soluciones de seguridad."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-600 text-sm text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none resize-none"
                    />
                    <div className="flex gap-2">
                      <button onClick={saveObjective} className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5">
                        <Save size={12} /> Guardar
                      </button>
                      <button onClick={() => setEditingObjective(false)} className="px-4 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold transition-colors">
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => setEditingObjective(true)}
                    className="cursor-pointer"
                  >
                    {advisor.objective ? (
                      <p className="text-sm text-slate-200">{advisor.objective}</p>
                    ) : (
                      <p className="text-sm text-slate-500 italic">Tu objetivo será buscar, por ejemplo, colegios a los que podamos ofrecer tecnología o soluciones de seguridad. <span className="text-amber-400 not-italic">(Toca para editar)</span></p>
                    )}
                  </div>
                )}
              </div>

              {/* 3 Toggles (Persistidos en BD) */}
              <div className="space-y-3 p-4 rounded-xl bg-slate-800/40 border border-slate-700/40">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Actividades</p>
                <Toggle on={pubOn} onToggle={() => toggleSwitch("pubEnabled", !pubOn)} label="Publicaciones asignadas" />
                <Toggle on={phoneOn} onToggle={() => toggleSwitch("phoneEnabled", !phoneOn)} label="Números de teléfono" />
                <Toggle on={msgOn} onToggle={() => toggleSwitch("msgEnabled", !msgOn)} label="Mensajes enviados" />
              </div>

              {/* Publication Panel */}
              <AnimatePresence>
                {pubOn && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                    <PublicationPanel
                      advisorId={advisor.id}
                      assignments={advisor.publicationAssignments}
                      onRefresh={onRefresh}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Phone Panel */}
              <AnimatePresence>
                {phoneOn && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                    <PhonePanel
                      advisorId={advisor.id}
                      phoneAssignments={advisor.phoneAssignments}
                      onRefresh={onRefresh}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Mensajes enviados placeholder */}
              <AnimatePresence>
                {msgOn && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                    <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/40 text-center space-y-2">
                      <MessageSquare size={22} className="mx-auto text-slate-500" />
                      <p className="text-sm text-slate-400">Registro de mensajes enviados (próximamente)</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Collapsible 30-Day Performance Calendar */}
              <div className="rounded-xl bg-slate-800/40 border border-slate-700/40 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setCalendarOpen(!calendarOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-700/30 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <CalendarDays size={15} className="text-purple-400" />
                    <span className="text-xs font-bold text-purple-300 uppercase tracking-widest">
                      Calendario de Rendimiento (30 Días)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400">
                      {calendarDays.filter((d) => d.status === "CLOSED").length} días cerrados
                    </span>
                    {calendarOpen ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronRight size={14} className="text-slate-400" />}
                  </div>
                </button>

                <AnimatePresence>
                  {calendarOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-t border-slate-700/40"
                    >
                      <div className="p-4 space-y-3">
                        <div className="grid grid-cols-6 sm:grid-cols-10 gap-1.5">
                          {calendarDays.map((day) => (
                            <button
                              key={day.dateStr}
                              type="button"
                              onClick={() => setSelectedDay(day.dateStr)}
                              className={`p-1.5 rounded-lg border text-center transition-all ${
                                selectedDayInfo.dateStr === day.dateStr ? "ring-2 ring-white/50 " : ""
                              }${
                                day.status === "CLOSED"
                                  ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                                  : day.status === "SAVED"
                                  ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
                                  : "bg-slate-900/60 border-slate-800 text-slate-500"
                              }`}
                            >
                              <span className="block text-[10px] font-black">{day.dayNum}</span>
                              <span className="block text-[8px] truncate">{day.label.split(" ")[1]}</span>
                            </button>
                          ))}
                        </div>

                        {/* Selected Day Breakdown */}
                        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                          <div>
                            <span className="font-bold text-white">{selectedDayInfo.label}</span>
                            <span className="ml-2 text-[11px] text-slate-400">
                              ({selectedDayInfo.status === "CLOSED" ? "Día Cerrado ✅" : selectedDayInfo.status === "SAVED" ? "En progreso / Guardado 🟡" : "Sin actividad"})
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-[11px]">
                            <span className="text-purple-300 font-bold">
                              Pub: {selectedDayInfo.evidencesDone}/{selectedDayInfo.pubsAssigned} evidencias
                            </span>
                            <span className="text-cyan-300 font-bold">
                              Tel: {selectedDayInfo.phonesDone}/{selectedDayInfo.phonesAssigned} envíos
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Guardar vs Cerrar Día Bar */}
              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs">
                  {dayFeedback ? (
                    <span className="text-emerald-300 font-bold">{dayFeedback}</span>
                  ) : advisor.dayStatus === "CLOSED" ? (
                    <span className="text-emerald-300 font-semibold flex items-center gap-1.5">
                      <Lock size={13} /> Jornada cerrada ({advisor.dayClosedAt ? new Date(advisor.dayClosedAt).toLocaleString("es-EC") : "hoy"})
                    </span>
                  ) : (
                    <span className="text-slate-400">
                      Usa <strong>Guardar</strong> para mantener los switches y editar luego, o <strong>Cerrar Día</strong> al finalizar.
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    disabled={daySaving !== null}
                    onClick={() => handleAdvisorDayAction("SAVED")}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-black transition-colors"
                  >
                    {daySaving === "SAVED" ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                    Guardar
                  </button>
                  {advisor.dayStatus === "CLOSED" ? (
                    <button
                      type="button"
                      disabled={daySaving !== null}
                      onClick={() => handleAdvisorDayAction("OPEN")}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-black transition-colors"
                    >
                      <Unlock size={13} /> Reabrir Día
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={daySaving !== null}
                      onClick={() => handleAdvisorDayAction("CLOSED")}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition-colors"
                    >
                      {daySaving === "CLOSED" ? <Loader2 size={13} className="animate-spin" /> : <Lock size={13} />}
                      Cerrar Día
                    </button>
                  )}
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Add Advisor Modal ─────────────────────────────────────────────────────────

function AddAdvisorModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({
    firstName: "", lastName: "", phone: "", startDate: "", jobRole: "", category: "",
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  function set(k: keyof typeof form) { return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm(prev => ({ ...prev, [k]: e.target.value })) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.firstName || !form.lastName) { setError("Nombre y apellido requeridos"); return }
    setSaving(true)
    setError("")
    try {
      const res = await fetch("/api/flash/advisors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error("Error al crear")
      onCreated()
      onClose()
    } catch { setError("Error al guardar. Intenta de nuevo.") }
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        className="relative bg-[#0f1621] border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <User size={18} className="text-emerald-400" />
            Añadir asesor
          </h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Nombre *</label>
              <input value={form.firstName} onChange={set("firstName")} required placeholder="Nombre"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Apellido *</label>
              <input value={form.lastName} onChange={set("lastName")} required placeholder="Apellido"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">Teléfono</label>
            <input value={form.phone} onChange={set("phone")} type="tel" placeholder="0999 999 999"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none" />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">Fecha de inicio</label>
            <input value={form.startDate} onChange={set("startDate")} type="date"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:border-emerald-500 focus:outline-none" />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">Perfil del puesto</label>
            <select value={form.jobRole} onChange={set("jobRole")}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:border-emerald-500 focus:outline-none">
              <option value="">Seleccionar...</option>
              {JOB_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">Categoría (Suicide Squad)</label>
            <select value={form.category} onChange={set("category")}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:border-emerald-500 focus:outline-none">
              <option value="">Sin categoría</option>
              {SUICIDE_SQUAD_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-xs bg-red-900/20 border border-red-500/30 rounded-xl px-3 py-2">
              <AlertCircle size={14} /> {error}
            </div>
          )}

          <button type="submit" disabled={saving}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-sm transition-colors">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <User size={16} />}
            {saving ? "Guardando..." : "Crear asesor"}
          </button>
        </form>
      </motion.div>
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function FlashClient() {
  const [advisors, setAdvisors] = useState<FlashAdvisor[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [search, setSearch] = useState("")
  const [filterCategory, setFilterCategory] = useState("")
  const [activeTab, setActiveTab] = useState<"gestion" | "banco">("gestion")
  const [dayStartedAt, setDayStartedAt] = useState<string | null>(null)

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10)
    const saved = localStorage.getItem(`flash_day_started_${today}`)
    if (saved) setDayStartedAt(saved)
  }, [])

  function handleStartDay() {
    const today = new Date().toISOString().slice(0, 10)
    const nowTime = new Date().toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" })
    localStorage.setItem(`flash_day_started_${today}`, nowTime)
    setDayStartedAt(nowTime)
  }

  const fetchAdvisors = useCallback(async () => {
    try {
      const res = await fetch("/api/flash/advisors")
      const data = await res.json()
      setAdvisors(data.advisors || [])
    } catch { /* noop */ }
    setLoading(false)
  }, [])

  useEffect(() => { fetchAdvisors() }, [fetchAdvisors])

  const filtered = advisors.filter(a => {
    const full = `${a.firstName} ${a.lastName}`.toLowerCase()
    const matchSearch = !search || full.includes(search.toLowerCase())
    const matchCat = !filterCategory || a.category === filterCategory
    return matchSearch && matchCat
  })

  return (
    <div className="min-h-screen bg-[#080e18] text-slate-100">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#080e18]/95 backdrop-blur border-b border-slate-800/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)]">
              <Flame size={18} className="text-white" />
            </div>
            <div>
              <h1 className="font-black text-white text-[15px] leading-none">Flash Studio</h1>
              <p className="text-[11px] text-slate-400 mt-0.5">Gestión de asesores · Stefi</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {dayStartedAt ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                <CheckCircle2 size={13} /> Día iniciado ({dayStartedAt})
              </span>
            ) : (
              <button
                type="button"
                onClick={handleStartDay}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-all shadow-[0_0_16px_rgba(245,158,11,0.35)]"
              >
                <Play size={13} fill="currentColor" />
                Iniciar Día
              </button>
            )}

            {/* Add seller button — top-right, small */}
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-[0_0_16px_rgba(16,185,129,0.3)]"
            >
              <Plus size={14} />
              Añadir vendedor
            </button>
          </div>
        </div>

        {/* Sub-nav Tabs */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-2.5 flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("gestion")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "gestion"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                : "text-slate-400 hover:text-white bg-slate-800/40 border border-transparent"
            }`}
          >
            <Users size={13} /> Gestión Diaria
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("banco")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "banco"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                : "text-slate-400 hover:text-white bg-slate-800/40 border border-transparent"
            }`}
          >
            <Grid3X3 size={13} /> Banco de Imágenes Completo
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        {activeTab === "banco" ? (
          <BancoImagenesFlash />
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Vendedores", value: advisors.length, color: "text-emerald-400" },
                { label: "Asignaciones pub.", value: advisors.reduce((s, a) => s + a.publicationAssignments.length, 0), color: "text-purple-400" },
                { label: "Teléfonos asig.", value: advisors.reduce((s, a) => s + a.phoneAssignments.length, 0), color: "text-cyan-400" },
              ].map(stat => (
                <div key={stat.label} className="bg-slate-800/40 border border-slate-700/40 rounded-xl px-4 py-3 text-center">
                  <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div className="flex gap-3 flex-wrap">
              <div className="flex-1 min-w-[180px] relative">
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Buscar vendedor..."
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                />
                <Users size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              </div>
              <select
                value={filterCategory}
                onChange={e => setFilterCategory(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="">Todas las categorías</option>
                {SUICIDE_SQUAD_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>

            {/* Advisors list */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 size={32} className="text-emerald-400 animate-spin" />
                <p className="text-slate-400 text-sm">Cargando vendedores...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-800/60 border border-slate-700 flex items-center justify-center">
                  <Users size={28} className="text-slate-500" />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-white font-semibold">{search ? "Sin resultados" : "No hay vendedores aún"}</p>
                  <p className="text-slate-400 text-sm">
                    {search ? "Intenta con otro nombre" : 'Haz clic en "Añadir vendedor" para comenzar'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map(advisor => (
                  <AdvisorCard key={advisor.id} advisor={advisor} onRefresh={fetchAdvisors} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Add modal */}
      <AnimatePresence>
        {showAddModal && (
          <AddAdvisorModal
            onClose={() => setShowAddModal(false)}
            onCreated={fetchAdvisors}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
