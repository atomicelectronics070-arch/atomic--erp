"use client"

import React, { useState, useEffect, useCallback, useRef } from "react"
import {
  Search, Globe, AlertTriangle, CheckCircle2, RefreshCw, Shuffle,
  Loader2, ExternalLink, DollarSign, EyeOff, Save, ImageOff,
  TrendingUp, TrendingDown, ShieldAlert, Sparkles, StopCircle
} from "lucide-react"

interface ProductSample {
  id: string
  sku?: string | null
  name: string
  price: number
  compareAtPrice?: number | null
  provider: string
  category: string
  stock?: number
  firstImage?: string | null
}

interface WebValidationResult {
  productId: string
  storedPrice: number
  minMarketUsd: number
  maxMarketUsd: number
  recommendedPvpUsd: number
  verdict: "OK" | "SOBREPRECIO_CRITICO" | "SUBPRECIO_PERDIDA" | "REVISAR"
  confidence: "ALTA" | "MEDIA" | "BAJA"
  categoryError?: boolean
  reason: string
  sources?: { title: string; url: string }[]
}

interface AuditPayload {
  stats: {
    totalActive: number
    extremeTechCount: number
    compareAtGreaterCount: number
    suspiciousLowLaptopMonitorCount: number
    brokenImagesCount: number
    garbageNamesCount: number
  }
  topTmBuckets: { price: number; count: number }[]
  providers: { name: string; count: number }[]
  anomalies: {
    extremeTech: any[]
    compareAtGreater: any[]
    suspiciousLowLaptopMonitor: any[]
    brokenImages: any[]
    garbageNames: any[]
  }
  randomSample: ProductSample[]
}

export default function ProductPriceAuditor() {
  const [data, setData] = useState<AuditPayload | null>(null)
  const [loading, setLoading] = useState(true)
  const [sampleSize, setSampleSize] = useState(25)
  const [provider, setProvider] = useState("ALL")
  const [viewMode, setViewMode] = useState<"sample" | "extremeTech" | "compareAtGreater" | "lowLaptops" | "brokenImages" | "garbageNames">("sample")

  const [validations, setValidations] = useState<Record<string, WebValidationResult>>({})
  const [validatingId, setValidatingId] = useState<string | null>(null)
  const [batchRunning, setBatchRunning] = useState(false)
  const [batchProgress, setBatchProgress] = useState({ done: 0, total: 0 })
  const stopRef = useRef(false)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editPrice, setEditPrice] = useState("")
  const [savingId, setSavingId] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3500)
  }

  const fetchAudit = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/supervision/product-audit?sampleSize=${sampleSize}&provider=${encodeURIComponent(provider)}`)
      if (res.ok) {
        const json = await res.json()
        setData(json)
      }
    } catch { /* noop */ }
    setLoading(false)
  }, [sampleSize, provider])

  useEffect(() => {
    fetchAudit()
  }, [fetchAudit])

  async function validateSingle(p: ProductSample) {
    setValidatingId(p.id)
    try {
      const res = await fetch("/api/supervision/product-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: p.id,
          name: p.name,
          sku: p.sku,
          storedPrice: p.price,
          compareAtPrice: p.compareAtPrice,
          category: p.category,
          provider: p.provider,
        }),
      })
      if (res.ok) {
        const result: WebValidationResult = await res.json()
        setValidations((prev) => ({ ...prev, [p.id]: result }))
      }
    } catch { /* noop */ }
    setValidatingId(null)
  }

  async function validateSampleBatch() {
    if (!data?.randomSample?.length) return
    stopRef.current = false
    setBatchRunning(true)
    const list = data.randomSample
    setBatchProgress({ done: 0, total: list.length })

    // Run 3 concurrently to finish 25 items cleanly without hitting rate limits
    let index = 0
    async function worker() {
      while (index < list.length && !stopRef.current) {
        const current = list[index++]
        if (!current) break
        await validateSingle(current)
        setBatchProgress((prev) => ({ ...prev, done: Math.min(prev.total, prev.done + 1) }))
      }
    }

    await Promise.all([worker(), worker(), worker()])
    setBatchRunning(false)
    showToast("Validación en internet finalizada")
  }

  async function handleSavePrice(productId: string, newPrice: number) {
    setSavingId(productId)
    try {
      const res = await fetch("/api/supervision/product-audit", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, price: newPrice }),
      })
      if (res.ok) {
        showToast(`Precio actualizado a $${newPrice.toFixed(2)}`)
        setEditingId(null)
        // Update locally
        setData((prev) => {
          if (!prev) return prev
          const patchItem = (arr: any[]) => arr.map((x) => (x.id === productId ? { ...x, price: newPrice } : x))
          return {
            ...prev,
            randomSample: patchItem(prev.randomSample),
            anomalies: {
              extremeTech: patchItem(prev.anomalies.extremeTech),
              compareAtGreater: patchItem(prev.anomalies.compareAtGreater),
              suspiciousLowLaptopMonitor: patchItem(prev.anomalies.suspiciousLowLaptopMonitor),
              brokenImages: patchItem(prev.anomalies.brokenImages),
              garbageNames: patchItem(prev.anomalies.garbageNames),
            },
          }
        })
      }
    } catch { /* noop */ }
    setSavingId(null)
  }

  async function handleDeactivate(productId: string) {
    setSavingId(productId)
    try {
      const res = await fetch("/api/supervision/product-audit", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, isActive: false }),
      })
      if (res.ok) {
        showToast("Producto desactivado del catálogo público")
        setData((prev) => {
          if (!prev) return prev
          const filterItem = (arr: any[]) => arr.filter((x) => x.id !== productId)
          return {
            ...prev,
            randomSample: filterItem(prev.randomSample),
            anomalies: {
              extremeTech: filterItem(prev.anomalies.extremeTech),
              compareAtGreater: filterItem(prev.anomalies.compareAtGreater),
              suspiciousLowLaptopMonitor: filterItem(prev.anomalies.suspiciousLowLaptopMonitor),
              brokenImages: filterItem(prev.anomalies.brokenImages),
              garbageNames: filterItem(prev.anomalies.garbageNames),
            },
          }
        })
      }
    } catch { /* noop */ }
    setSavingId(null)
  }

  const activeRows: any[] = !data
    ? []
    : viewMode === "sample"
    ? data.randomSample
    : viewMode === "extremeTech"
    ? data.anomalies.extremeTech
    : viewMode === "compareAtGreater"
    ? data.anomalies.compareAtGreater
    : viewMode === "lowLaptops"
    ? data.anomalies.suspiciousLowLaptopMonitor
    : viewMode === "brokenImages"
    ? data.anomalies.brokenImages
    : data.anomalies.garbageNames

  const validatedVals = Object.values(validations)
  const overpriceCount = validatedVals.filter((v) => v.verdict === "SOBREPRECIO_CRITICO").length
  const underpriceCount = validatedVals.filter((v) => v.verdict === "SUBPRECIO_PERDIDA").length
  const okCount = validatedVals.filter((v) => v.verdict === "OK").length

  return (
    <div className="space-y-5">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-2xl border border-emerald-400/50">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="bg-[#0b1220] border border-slate-800 rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <ShieldAlert size={20} className="text-amber-400" />
            Auditor Interno de Catálogo & Validador Web (Ecuador)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Escanea los {data?.stats.totalActive?.toLocaleString() || "..."} productos activos en BD, detecta anomalías de importación y valida precios al azar contra tiendas de Ecuador en vivo.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-white focus:outline-none"
          >
            <option value="ALL">Todos los proveedores</option>
            {(data?.providers || []).map((pr) => (
              <option key={pr.name} value={pr.name}>
                {pr.name} ({pr.count})
              </option>
            ))}
          </select>

          <select
            value={sampleSize}
            onChange={(e) => setSampleSize(Number(e.target.value))}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-white focus:outline-none"
          >
            <option value={15}>Muestra: 15 al azar</option>
            <option value={25}>Muestra: 25 al azar</option>
            <option value={40}>Muestra: 40 al azar</option>
            <option value={50}>Muestra: 50 al azar</option>
          </select>

          <button
            type="button"
            onClick={() => {
              setValidations({})
              setViewMode("sample")
              fetchAudit()
            }}
            disabled={loading || batchRunning}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white text-xs font-bold transition-colors disabled:opacity-50"
          >
            <Shuffle size={14} className={loading ? "animate-spin" : ""} />
            Nueva Muestra
          </button>

          {batchRunning ? (
            <button
              type="button"
              onClick={() => { stopRef.current = true }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black transition-colors"
            >
              <StopCircle size={14} />
              Detener ({batchProgress.done}/{batchProgress.total})
            </button>
          ) : (
            <button
              type="button"
              onClick={validateSampleBatch}
              disabled={loading || !data?.randomSample?.length}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white text-xs font-black transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-40"
            >
              <Globe size={14} />
              Validar Muestra en Internet (EC)
            </button>
          )}
        </div>
      </div>

      {/* Anomaly KPI Cards (Clickable filters) */}
      {data && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { key: "sample", label: "Muestra Aleatoria", count: data.randomSample.length, color: "border-emerald-500/40 text-emerald-400" },
            { key: "extremeTech", label: "Tech > $2,500", count: data.stats.extremeTechCount, color: "border-rose-500/40 text-rose-400" },
            { key: "compareAtGreater", label: "compareAt > PVP", count: data.stats.compareAtGreaterCount, color: "border-amber-500/40 text-amber-400" },
            { key: "lowLaptops", label: "Laptops/TV < $120", count: data.stats.suspiciousLowLaptopMonitorCount, color: "border-orange-500/40 text-orange-400" },
            { key: "brokenImages", label: "Sin Imagen / Emoji", count: data.stats.brokenImagesCount, color: "border-purple-500/40 text-purple-400" },
            { key: "garbageNames", label: "Nombres Basura", count: data.stats.garbageNamesCount, color: "border-cyan-500/40 text-cyan-400" },
          ].map((card) => (
            <button
              key={card.key}
              type="button"
              onClick={() => setViewMode(card.key as any)}
              className={`text-left p-3.5 rounded-2xl border bg-[#0b1220] transition-all cursor-pointer ${
                viewMode === card.key ? `${card.color} ring-1 ring-inset ring-current bg-slate-900` : "border-slate-800 hover:border-slate-700"
              }`}
            >
              <p className={`text-2xl font-black ${card.color.split(" ")[1]}`}>{card.count}</p>
              <p className="text-[11px] font-bold text-slate-300 mt-0.5">{card.label}</p>
            </button>
          ))}
        </div>
      )}

      {/* TecnoMega Collision Warning Banner */}
      {data?.topTmBuckets && data.topTmBuckets.length > 0 && (
        <div className="bg-amber-950/30 border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs font-black text-amber-300 flex items-center gap-1.5">
              <AlertTriangle size={14} />
              Alerta Crítica en TecnoMega: Colisión de Precios por Lote
            </p>
            <p className="text-[11px] text-amber-200/80">
              Cientos de productos distintos en TecnoMega comparten precios idénticos (ej:{" "}
              {data.topTmBuckets.slice(0, 5).map((b) => `$${b.price.toFixed(2)} (${b.count} prod.)`).join(" · ")}). Muchos tienen el PVP real guardado en <code className="text-white">compareAtPrice</code>.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setProvider("TecnoMega")
              setViewMode("sample")
            }}
            className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-200 text-xs font-bold shrink-0"
          >
            Auditar TecnoMega
          </button>
        </div>
      )}

      {/* Live Batch Validation Summary */}
      {validatedVals.length > 0 && (
        <div className="bg-[#0b1220] border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center gap-4 text-xs">
          <span className="font-bold text-slate-300">Validados en Internet ({validatedVals.length}):</span>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 font-bold">✅ {okCount} Correctos</span>
          <span className="px-2.5 py-1 rounded-lg bg-rose-500/15 text-rose-300 font-bold">🔴 {overpriceCount} Sobreprecio Crítico</span>
          <span className="px-2.5 py-1 rounded-lg bg-orange-500/15 text-orange-300 font-bold">🟠 {underpriceCount} Bajo Costo / Pérdida</span>
        </div>
      )}

      {/* Main Audit Table */}
      <div className="bg-[#0b1220] border border-slate-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3">
            <Loader2 size={28} className="text-emerald-400 animate-spin" />
            <p className="text-xs text-slate-400">Escaneando base de datos de productos...</p>
          </div>
        ) : activeRows.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-sm">No hay elementos en esta vista</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/60 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Producto</th>
                  <th className="py-3 px-3">Proveedor / Cat.</th>
                  <th className="py-3 px-3">Precio BD</th>
                  <th className="py-3 px-3">Mercado EC (Internet)</th>
                  <th className="py-3 px-3">Veredicto</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 text-xs">
                {activeRows.map((p) => {
                  const v = validations[p.id]
                  const isEditing = editingId === p.id
                  const img = p.firstImage ?? p.firstImg
                  const isEmoji = img && String(img).includes("s.w.org/images/core/emoji")

                  return (
                    <tr key={p.id} className="hover:bg-slate-900/40 transition-colors">
                      {/* Product */}
                      <td className="py-3 px-4 max-w-[300px]">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 overflow-hidden shrink-0 flex items-center justify-center">
                            {img && !isEmoji ? (
                              <img src={img} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <ImageOff size={14} className="text-rose-400" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-white line-clamp-2">{p.name}</p>
                            <p className="text-[10px] text-slate-500 font-mono truncate">{p.sku || "SIN-SKU"}</p>
                          </div>
                        </div>
                      </td>

                      {/* Provider & Category */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="block font-semibold text-slate-200">{p.provider}</span>
                        <span className="text-[11px] text-slate-400">{p.category}</span>
                      </td>

                      {/* Stored Price */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        {isEditing ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              step="0.01"
                              value={editPrice}
                              onChange={(e) => setEditPrice(e.target.value)}
                              className="w-24 px-2 py-1 rounded bg-slate-800 border border-emerald-500 text-white font-bold text-xs focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleSavePrice(p.id, parseFloat(editPrice))}
                              disabled={savingId === p.id}
                              className="p-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white"
                            >
                              <Save size={12} />
                            </button>
                          </div>
                        ) : (
                          <div>
                            <span className="font-black text-white text-sm">${Number(p.price).toFixed(2)}</span>
                            {p.compareAtPrice != null && p.compareAtPrice > 0 && (
                              <span
                                className={`block text-[10px] ${
                                  p.compareAtPrice > p.price ? "text-amber-400 font-bold" : "text-slate-500"
                                }`}
                              >
                                Ref/Comp: ${Number(p.compareAtPrice).toFixed(2)}
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Market EC */}
                      <td className="py-3 px-3 max-w-[260px]">
                        {validatingId === p.id ? (
                          <span className="inline-flex items-center gap-1.5 text-cyan-300">
                            <Loader2 size={12} className="animate-spin" /> Buscando en Ecuador...
                          </span>
                        ) : v ? (
                          <div className="space-y-1">
                            <div className="font-bold text-cyan-300">
                              ${v.minMarketUsd.toFixed(2)} – ${v.maxMarketUsd.toFixed(2)}
                              <span className="text-[10px] text-slate-400 font-normal ml-1">
                                (Sug: ${v.recommendedPvpUsd.toFixed(2)})
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-300 leading-snug">{v.reason}</p>
                            {v.sources && v.sources.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 pt-0.5">
                                {v.sources.slice(0, 2).map((s, idx) => (
                                  <a
                                    key={idx}
                                    href={s.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-0.5 text-[10px] text-emerald-400 hover:underline"
                                  >
                                    Fuente {idx + 1} <ExternalLink size={9} />
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => validateSingle(p)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 text-[11px] font-bold"
                          >
                            <Globe size={11} /> Validar en Web
                          </button>
                        )}
                      </td>

                      {/* Verdict */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        {v ? (
                          <div className="space-y-1">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black border ${
                                v.verdict === "OK"
                                  ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                                  : v.verdict === "SOBREPRECIO_CRITICO"
                                  ? "bg-rose-500/15 border-rose-500/30 text-rose-300"
                                  : v.verdict === "SUBPRECIO_PERDIDA"
                                  ? "bg-orange-500/15 border-orange-500/30 text-orange-300"
                                  : "bg-amber-500/15 border-amber-500/30 text-amber-300"
                              }`}
                            >
                              {v.verdict === "OK" && <CheckCircle2 size={10} />}
                              {v.verdict === "SOBREPRECIO_CRITICO" && <TrendingUp size={10} />}
                              {v.verdict === "SUBPRECIO_PERDIDA" && <TrendingDown size={10} />}
                              {v.verdict}
                            </span>
                            {v.verdict !== "OK" && v.recommendedPvpUsd > 0 && (
                              <button
                                type="button"
                                onClick={() => handleSavePrice(p.id, v.recommendedPvpUsd)}
                                className="block text-[10px] text-emerald-400 hover:text-emerald-300 font-bold underline"
                              >
                                Aplicar ${v.recommendedPvpUsd.toFixed(2)}
                              </button>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-600 text-[11px]">Sin validar</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingId(isEditing ? null : p.id)
                              setEditPrice(String(p.price))
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                            title="Editar precio manualmente"
                          >
                            <DollarSign size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeactivate(p.id)}
                            disabled={savingId === p.id}
                            className="p-1.5 rounded-lg bg-rose-950/50 hover:bg-rose-900 text-rose-300 border border-rose-500/20"
                            title="Desactivar producto del catálogo"
                          >
                            <EyeOff size={13} />
                          </button>
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
    </div>
  )
}
