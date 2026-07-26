"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { RefreshCw, Save, RotateCcw, TrendingUp, Copy, Check, Send, Play, XCircle, Info } from "lucide-react"

interface DataPoint {
    day: number
    date: string
    quotes: number
    contacts: number
    sales: number
    mk: number
}

interface CycleData {
    startedAt: string
    startedBy: string
    cycleId: number
    daysPassed: number
    totals: {
        quotes: number
        contacts: number
        sales: number
        payments: number
    }
}

interface TradingChartProps {
    isAdmin?: boolean
}

const SERIES = [
    { key: "sales" as const,    label: "Ventas",       color: "#4ade80", glow: "rgba(74,222,128,0.9)",   w: 3, dashed: false, alpha: 1 },
    { key: "quotes" as const,   label: "Cotizaciones", color: "#f472b6", glow: "rgba(244,114,182,0.8)", w: 2, dashed: false, alpha: 1 },
    { key: "contacts" as const, label: "Contactos",    color: "#22d3ee", glow: "rgba(34,211,238,0.8)",  w: 2, dashed: false, alpha: 1 },
    { key: "mk" as const,       label: "MK",           color: "rgba(234,179,8,0.4)", glow: "rgba(234,179,8,0.25)", w: 1.5, dashed: true, alpha: 0.45 },
]

function drawIdleChart(ctx: CanvasRenderingContext2D, W: number, H: number) {
    const PAD = { top: 44, right: 34, bottom: 54, left: 54 }
    const cW = W - PAD.left - PAD.right
    const cH = H - PAD.top - PAD.bottom

    // Background gradient
    const bg = ctx.createLinearGradient(0, 0, 0, H)
    bg.addColorStop(0, "#060e1c")
    bg.addColorStop(1, "#030810")
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, W, H)

    // Subtle vignette
    const vig = ctx.createRadialGradient(W / 2, H / 2, cH * 0.2, W / 2, H / 2, W * 0.7)
    vig.addColorStop(0, "rgba(0,0,0,0)")
    vig.addColorStop(1, "rgba(0,0,0,0.35)")
    ctx.fillStyle = vig
    ctx.fillRect(0, 0, W, H)

    // Grid — vertical (30 columns)
    for (let i = 0; i <= 30; i++) {
        const x = PAD.left + (i / 30) * cW
        const isMajor = i % 5 === 0
        ctx.strokeStyle = isMajor ? "rgba(40,60,100,0.6)" : "rgba(25,38,62,0.4)"
        ctx.lineWidth = isMajor ? 0.8 : 0.4
        ctx.beginPath(); ctx.moveTo(x, PAD.top); ctx.lineTo(x, PAD.top + cH); ctx.stroke()
    }
    // Grid — horizontal (5 rows)
    for (let i = 0; i <= 5; i++) {
        const y = PAD.top + (i / 5) * cH
        ctx.strokeStyle = "rgba(40,60,100,0.5)"
        ctx.lineWidth = 0.6
        ctx.beginPath(); ctx.moveTo(PAD.left, y); ctx.lineTo(PAD.left + cW, y); ctx.stroke()

        // Y labels (0–5 scale placeholder)
        ctx.fillStyle = "rgba(70,90,130,0.7)"
        ctx.font = "10px 'Courier New', monospace"
        ctx.textAlign = "right"
        ctx.fillText(String(5 - i), PAD.left - 8, y + 4)
    }

    // X labels
    ctx.fillStyle = "rgba(60,80,120,0.7)"
    ctx.font = "9px 'Courier New', monospace"
    ctx.textAlign = "center"
    for (let d = 0; d <= 30; d += 5) {
        const x = PAD.left + (d / 30) * cW
        ctx.fillText(d === 0 ? "D1" : `D${d}`, x, PAD.top + cH + 18)
    }

    // Axes labels
    ctx.save()
    ctx.fillStyle = "rgba(60,80,120,0.5)"
    ctx.font = "9px 'Courier New', monospace"
    ctx.textAlign = "center"
    ctx.translate(PAD.left - 38, PAD.top + cH / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.fillText("REGISTROS", 0, 0)
    ctx.restore()
    ctx.fillStyle = "rgba(60,80,120,0.5)"
    ctx.font = "9px 'Courier New', monospace"
    ctx.textAlign = "center"
    ctx.fillText("DÍAS DEL CICLO →", PAD.left + cW / 2, PAD.top + cH + 36)

    // Origin glow — markers all resting at bottom-left
    const originX = PAD.left
    const originY = PAD.top + cH

    const dotSeries = [
        { color: "#4ade80", glow: "rgba(74,222,128,0.7)", r: 7 },
        { color: "#f472b6", glow: "rgba(244,114,182,0.7)", r: 6 },
        { color: "#22d3ee", glow: "rgba(34,211,238,0.7)", r: 6 },
        { color: "rgba(234,179,8,0.5)", glow: "rgba(234,179,8,0.3)", r: 4 },
    ]
    dotSeries.forEach(({ color, glow, r }, i) => {
        // Stagger dots slightly so they're all visible
        const ox = originX + i * 2
        const oy = originY - i * 1
        ctx.shadowBlur = 18
        ctx.shadowColor = glow
        ctx.beginPath()
        ctx.arc(ox, oy, r, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.fill()
        ctx.shadowBlur = 0
    })

    // Flat "starting" lines extending from origin — faint traces waiting to grow
    const flatSeries = [
        { color: "rgba(74,222,128,0.15)",  glow: "rgba(74,222,128,0.08)" },
        { color: "rgba(244,114,182,0.12)", glow: "rgba(244,114,182,0.06)" },
        { color: "rgba(34,211,238,0.12)",  glow: "rgba(34,211,238,0.06)" },
    ]
    flatSeries.forEach(({ color, glow }) => {
        ctx.shadowBlur = 6
        ctx.shadowColor = glow
        ctx.strokeStyle = color
        ctx.lineWidth = 1
        ctx.setLineDash([6, 8])
        ctx.beginPath()
        ctx.moveTo(originX, originY)
        ctx.lineTo(PAD.left + cW, originY)
        ctx.stroke()
        ctx.setLineDash([])
        ctx.shadowBlur = 0
    })

    // Center message
    ctx.fillStyle = "rgba(60, 85, 130, 0.55)"
    ctx.font = "bold 12px 'Courier New', monospace"
    ctx.textAlign = "center"
    ctx.fillText("— CICLO EN ESPERA —", W / 2, PAD.top + cH / 2 - 10)
    ctx.font = "10px 'Courier New', monospace"
    ctx.fillStyle = "rgba(50, 70, 110, 0.45)"
    ctx.fillText("Presiona ▷ INICIAR CICLO para comenzar el seguimiento", W / 2, PAD.top + cH / 2 + 10)

    // Legend at top
    drawLegend(ctx, PAD.left, cW, true)
}

function drawActiveChart(ctx: CanvasRenderingContext2D, W: number, H: number, dataPoints: DataPoint[]) {
    const PAD = { top: 44, right: 34, bottom: 54, left: 54 }
    const cW = W - PAD.left - PAD.right
    const cH = H - PAD.top - PAD.bottom

    // Background
    const bg = ctx.createLinearGradient(0, 0, 0, H)
    bg.addColorStop(0, "#060e1c")
    bg.addColorStop(1, "#030810")
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, W, H)

    const maxVal = Math.max(...dataPoints.map(d => Math.max(d.quotes, d.contacts, d.sales, d.mk)), 5)
    const scale = cH / (maxVal * 1.18)

    // Grid
    for (let i = 0; i <= 30; i++) {
        const x = PAD.left + (i / 30) * cW
        const isMajor = i % 5 === 0
        ctx.strokeStyle = isMajor ? "rgba(40,60,100,0.6)" : "rgba(25,38,62,0.4)"
        ctx.lineWidth = isMajor ? 0.8 : 0.4
        ctx.beginPath(); ctx.moveTo(x, PAD.top); ctx.lineTo(x, PAD.top + cH); ctx.stroke()
    }
    for (let i = 0; i <= 5; i++) {
        const y = PAD.top + (i / 5) * cH
        ctx.strokeStyle = "rgba(40,60,100,0.5)"
        ctx.lineWidth = 0.6
        ctx.beginPath(); ctx.moveTo(PAD.left, y); ctx.lineTo(PAD.left + cW, y); ctx.stroke()
        ctx.fillStyle = "rgba(80,100,150,0.8)"
        ctx.font = "10px 'Courier New', monospace"
        ctx.textAlign = "right"
        const val = Math.round(maxVal * (1 - i / 5))
        ctx.fillText(String(val), PAD.left - 8, y + 4)
    }

    // X labels + today marker label
    ctx.font = "9px 'Courier New', monospace"
    for (let d = 0; d <= 30; d += 5) {
        const x = PAD.left + (d / 30) * cW
        ctx.fillStyle = "rgba(70,90,130,0.7)"
        ctx.textAlign = "center"
        ctx.fillText(d === 0 ? "D1" : `D${d}`, x, PAD.top + cH + 18)
    }

    // "Elapsed" red zone
    const passedX = PAD.left + (dataPoints.length / 30) * cW
    const redZ = ctx.createLinearGradient(PAD.left, 0, passedX, 0)
    redZ.addColorStop(0, "rgba(239,68,68,0)")
    redZ.addColorStop(0.7, "rgba(239,68,68,0.07)")
    redZ.addColorStop(1, "rgba(239,68,68,0.14)")
    ctx.fillStyle = redZ
    ctx.fillRect(PAD.left, PAD.top, passedX - PAD.left, cH)

    // TODAY line
    ctx.strokeStyle = "rgba(239,68,68,0.55)"
    ctx.lineWidth = 1.5
    ctx.setLineDash([5, 5])
    ctx.beginPath(); ctx.moveTo(passedX, PAD.top); ctx.lineTo(passedX, PAD.top + cH); ctx.stroke()
    ctx.setLineDash([])
    ctx.fillStyle = "rgba(239,68,68,0.7)"
    ctx.font = "bold 8px 'Courier New', monospace"
    ctx.textAlign = "center"
    ctx.fillText("HOY", passedX, PAD.top - 6)

    // Axes labels
    ctx.save()
    ctx.fillStyle = "rgba(70,90,130,0.5)"
    ctx.font = "9px 'Courier New', monospace"
    ctx.textAlign = "center"
    ctx.translate(PAD.left - 40, PAD.top + cH / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.fillText("REGISTROS", 0, 0)
    ctx.restore()
    ctx.fillStyle = "rgba(70,90,130,0.5)"
    ctx.font = "9px 'Courier New', monospace"
    ctx.textAlign = "center"
    ctx.fillText("DÍAS DEL CICLO →", PAD.left + cW / 2, PAD.top + cH + 36)

    // Draw series
    SERIES.forEach(({ key, color, glow, w, dashed, alpha }) => {
        if (dataPoints.length < 1) return
        ctx.save()
        ctx.globalAlpha = alpha
        ctx.shadowBlur = 14
        ctx.shadowColor = glow
        ctx.strokeStyle = color
        ctx.lineWidth = w
        if (dashed) ctx.setLineDash([4, 6])
        ctx.beginPath()
        dataPoints.forEach((pt, i) => {
            const x = PAD.left + ((pt.day - 0.5) / 30) * cW
            const val = pt[key] as number
            const y = PAD.top + cH - val * scale
            if (i === 0) {
                ctx.moveTo(x, y)
            } else {
                const prev = dataPoints[i - 1]
                const px = PAD.left + ((prev.day - 0.5) / 30) * cW
                const py = PAD.top + cH - (prev[key] as number) * scale
                const cpx = (px + x) / 2
                ctx.bezierCurveTo(cpx, py, cpx, y, x, y)
            }
        })
        ctx.stroke()
        ctx.setLineDash([])
        ctx.shadowBlur = 0
        ctx.restore()

        // Dots
        dataPoints.forEach(pt => {
            const x = PAD.left + ((pt.day - 0.5) / 30) * cW
            const val = pt[key] as number
            const y = PAD.top + cH - val * scale
            ctx.save()
            ctx.globalAlpha = alpha
            ctx.shadowBlur = 12
            ctx.shadowColor = glow
            ctx.beginPath()
            ctx.arc(x, y, dashed ? 2.5 : 4, 0, Math.PI * 2)
            ctx.fillStyle = color
            ctx.fill()
            ctx.shadowBlur = 0
            ctx.restore()
        })
    })

    drawLegend(ctx, PAD.left, cW, false)
}

function drawLegend(ctx: CanvasRenderingContext2D, leftPad: number, cW: number, idle: boolean) {
    const items = [
        { label: "VENTAS",       color: "#4ade80",             glow: "rgba(74,222,128,0.8)",  dashed: false },
        { label: "COTIZACIONES", color: "#f472b6",             glow: "rgba(244,114,182,0.8)", dashed: false },
        { label: "CONTACTOS",    color: "#22d3ee",             glow: "rgba(34,211,238,0.8)",  dashed: false },
        { label: "MK",           color: "rgba(234,179,8,0.45)", glow: "rgba(234,179,8,0.3)",  dashed: true  },
    ]
    const totalW = items.reduce((acc, it) => acc + it.label.length * 7.5 + 50, 0)
    let lx = leftPad + (cW - totalW) / 2
    const ly = 22
    items.forEach(({ label, color, glow, dashed }) => {
        ctx.shadowBlur = dashed ? 3 : 7
        ctx.shadowColor = glow
        ctx.strokeStyle = color
        ctx.lineWidth = dashed ? 1.2 : 2
        if (dashed) ctx.setLineDash([4, 4])
        ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(lx + 22, ly); ctx.stroke()
        ctx.setLineDash([])
        ctx.shadowBlur = 0
        ctx.beginPath()
        ctx.shadowBlur = 8; ctx.shadowColor = glow
        ctx.arc(lx + 11, ly, dashed ? 2 : 3, 0, Math.PI * 2)
        ctx.fillStyle = color; ctx.fill()
        ctx.shadowBlur = 0
        ctx.fillStyle = idle ? color.replace("0.", "0.4") : color
        ctx.font = "bold 9px 'Courier New', monospace"
        ctx.textAlign = "left"
        ctx.fillText(label, lx + 28, ly + 4)
        lx += label.length * 7.5 + 50
    })
}

export default function LiveTradingChart({ isAdmin = false }: TradingChartProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [cycle, setCycle] = useState<CycleData | null>(null)
    const [dataPoints, setDataPoints] = useState<DataPoint[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isResetting, setIsResetting] = useState(false)
    const [isCancelling, setIsCancelling] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [postContent, setPostContent] = useState("")
    const [showPostModal, setShowPostModal] = useState(false)
    const [isCopied, setIsCopied] = useState(false)
    const [isPosting, setIsPosting] = useState(false)
    const [postSuccess, setPostSuccess] = useState(false)
    const [showLegend, setShowLegend] = useState(false)

    const fetchData = useCallback(async () => {
        try {
            const res = await fetch("/api/trading-chart")
            const data = await res.json()
            setCycle(data.cycle)
            setDataPoints(data.dataPoints || [])
        } catch (e) {
            console.error("Trading chart fetch error:", e)
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchData()
        const interval = setInterval(fetchData, 30000)
        return () => clearInterval(interval)
    }, [fetchData])

    // Redraw whenever data changes
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        if (!cycle || dataPoints.length === 0) {
            drawIdleChart(ctx, canvas.width, canvas.height)
        } else {
            drawActiveChart(ctx, canvas.width, canvas.height, dataPoints)
        }
    }, [cycle, dataPoints])

    const handleReset = async () => {
        if (!confirm("¿Iniciar un nuevo ciclo de 30 días? Si había un ciclo activo, se archivará en el historial.")) return
        setIsResetting(true)
        try {
            await fetch("/api/trading-chart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "reset" })
            })
            await fetchData()
        } catch (e) { console.error(e) } finally { setIsResetting(false) }
    }

    const handleCancel = async () => {
        if (!confirm("¿Cancelar el ciclo actual? Los datos se descartarán sin guardar en el historial.")) return
        setIsCancelling(true)
        try {
            await fetch("/api/trading-chart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "cancel" })
            })
            await fetchData()
        } catch (e) { console.error(e) } finally { setIsCancelling(false) }
    }

    const handleSaveCycle = async () => {
        if (!cycle) return
        setIsSaving(true)
        try {
            const res = await fetch("/api/trading-chart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "save_and_post", cycleData: cycle })
            })
            const data = await res.json()
            if (data.postContent) { setPostContent(data.postContent); setShowPostModal(true) }
        } catch (e) { console.error(e) } finally { setIsSaving(false) }
    }

    const handlePublish = async () => {
        if (!postContent) return
        setIsPosting(true)
        try {
            await fetch("/api/social/post", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: postContent })
            })
            setPostSuccess(true)
            setTimeout(() => { setShowPostModal(false); setPostSuccess(false) }, 2000)
        } catch { /* user can still copy */ } finally { setIsPosting(false) }
    }

    const copyPost = () => {
        navigator.clipboard.writeText(postContent)
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
    }

    const cycleStartLabel = cycle
        ? new Date(cycle.startedAt).toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })
        : null

    return (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 relative overflow-hidden">
            {/* Ambient glows */}
            <div className="absolute -top-16 -right-16 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-cyan-500/4 rounded-full blur-3xl pointer-events-none" />

            {/* ── HEADER ── */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1">
                    <h3 className="text-base font-black text-white flex items-center gap-2 tracking-tight">
                        <TrendingUp className="text-emerald-400 shrink-0" size={18} />
                        Rendimiento en Vivo — Ciclo de 30 Días
                        <button
                            onClick={() => setShowLegend(v => !v)}
                            className="ml-1 text-slate-600 hover:text-slate-400 transition-colors"
                            title="¿Qué muestra esta gráfica?"
                        >
                            <Info size={14} />
                        </button>
                    </h3>

                    {/* Status badge */}
                    {cycle ? (
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[10px] font-mono font-bold">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                                EN CURSO
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">
                                Iniciado el {cycleStartLabel} • <span className="text-white font-bold">Día {cycle.daysPassed}</span> de 30
                            </span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-500 text-[10px] font-mono font-bold">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-600 inline-block" />
                                SIN CICLO ACTIVO
                            </span>
                            {isAdmin && (
                                <span className="text-[10px] font-mono text-slate-500">
                                    Pulsa ▷ para iniciar el seguimiento
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* ── ADMIN CONTROLS ── */}
                {isAdmin && (
                    <div className="flex items-center gap-2 shrink-0">
                        {cycle && (
                            <>
                                {/* Save cycle */}
                                <button
                                    onClick={handleSaveCycle}
                                    disabled={isSaving}
                                    title="Guardar ciclo y generar resumen para publicar"
                                    className="px-3 py-2 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-2xl text-[10px] font-mono font-bold hover:bg-amber-500/20 transition-all flex items-center gap-1.5 disabled:opacity-50 whitespace-nowrap"
                                >
                                    {isSaving ? <RefreshCw size={12} className="animate-spin" /> : <Save size={12} />}
                                    Guardar ciclo
                                </button>
                                {/* Cancel cycle */}
                                <button
                                    onClick={handleCancel}
                                    disabled={isCancelling}
                                    title="Cancelar ciclo sin guardar historial"
                                    className="px-3 py-2 bg-rose-500/10 border border-rose-500/25 text-rose-400 rounded-2xl text-[10px] font-mono font-bold hover:bg-rose-500/20 transition-all flex items-center gap-1.5 disabled:opacity-50 whitespace-nowrap"
                                >
                                    {isCancelling ? <RefreshCw size={12} className="animate-spin" /> : <XCircle size={12} />}
                                    Cancelar ciclo
                                </button>
                            </>
                        )}
                        {/* Reset / Start */}
                        <button
                            onClick={handleReset}
                            disabled={isResetting}
                            title={cycle ? "Reiniciar ciclo (cada Lunes)" : "Iniciar nuevo ciclo de 30 días"}
                            className={`
                                w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                                ${cycle
                                    ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 hover:rotate-[200deg]"
                                    : "bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/30 hover:scale-110 shadow-[0_0_20px_rgba(74,222,128,0.3)]"
                                }
                            `}
                        >
                            {isResetting
                                ? <RefreshCw size={15} className="animate-spin" />
                                : cycle ? <RotateCcw size={15} /> : <Play size={15} className="ml-0.5" />
                            }
                        </button>
                    </div>
                )}
            </div>

            {/* ── INLINE LEGEND TOOLTIP ── */}
            {showLegend && (
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-[10px] font-mono animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-0.5 bg-emerald-400 rounded shadow-[0_0_6px_rgba(74,222,128,0.8)]" />
                        <span className="text-slate-300"><span className="text-emerald-400 font-bold">Ventas</span> — transacciones cerradas en el sistema</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-0.5 bg-pink-400 rounded shadow-[0_0_6px_rgba(244,114,182,0.8)]" />
                        <span className="text-slate-300"><span className="text-pink-400 font-bold">Cotizaciones</span> — PDFs emitidos en el módulo</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-0.5 bg-cyan-400 rounded shadow-[0_0_6px_rgba(34,211,238,0.8)]" />
                        <span className="text-slate-300"><span className="text-cyan-400 font-bold">Contactos</span> — nuevos clientes registrados</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-0.5 border-t-2 border-dashed border-yellow-400/40 rounded" style={{ borderStyle: "dashed" }} />
                        <span className="text-slate-500"><span className="text-yellow-400/50 font-bold">MK</span> — tickets de pago internos (solo lectura estratégica)</span>
                    </div>
                </div>
            )}

            {/* ── METRICS CARDS (only when active) ── */}
            {cycle && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                    {[
                        { label: "Ventas",        val: cycle.totals.sales,    color: "emerald", glow: "rgba(74,222,128,0.5)", icon: "💰" },
                        { label: "Cotizaciones",  val: cycle.totals.quotes,   color: "pink",    glow: "rgba(244,114,182,0.5)", icon: "📄" },
                        { label: "Contactos",     val: cycle.totals.contacts, color: "cyan",    glow: "rgba(34,211,238,0.5)", icon: "📍" },
                        { label: "MK",            val: cycle.totals.payments, color: "amber",   glow: "rgba(234,179,8,0.3)",  icon: "⬤", secret: true },
                    ].map(({ label, val, color, glow, icon, secret }) => (
                        <div
                            key={label}
                            className={`bg-slate-950/80 border rounded-2xl p-3 text-center transition-all ${
                                secret
                                    ? "border-amber-500/10 opacity-50 hover:opacity-70"
                                    : `border-${color}-500/20 hover:border-${color}-500/40`
                            }`}
                        >
                            <p className="text-xl font-black"
                                style={{ color: secret ? "rgba(234,179,8,0.5)" : undefined,
                                    textShadow: `0 0 18px ${glow}`,
                                    ...(secret ? {} : {}) }}
                                data-color={color}
                            >
                                <span className={secret ? "text-amber-400/50" : `text-${color}-400`}>{val}</span>
                            </p>
                            <p className="text-[9px] font-mono mt-0.5 flex items-center justify-center gap-1"
                                style={{ color: secret ? "rgba(100,80,30,0.7)" : undefined }}>
                                <span>{icon}</span>
                                <span className={secret ? "text-slate-600" : "text-slate-400"}>{label}</span>
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* ── CANVAS ── */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-800/60 bg-[#060e1c]">
                <canvas
                    ref={canvasRef}
                    width={900}
                    height={210}
                    className="w-full h-auto block"
                />
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm">
                        <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono">
                            <RefreshCw size={14} className="animate-spin" />
                            Cargando datos...
                        </div>
                    </div>
                )}
            </div>

            {/* ── PUBLISH MODAL ── */}
            {showPostModal && (
                <div className="fixed inset-0 z-50 bg-slate-950/88 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-amber-500/30 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-5">
                        <div className="border-b border-slate-800 pb-4">
                            <h4 className="font-black text-white flex items-center gap-2">
                                <Save size={16} className="text-amber-400" />
                                Resumen del Ciclo — Listo para Publicar
                            </h4>
                            <p className="text-[10px] font-mono text-slate-400 mt-1">
                                El copy fue generado automáticamente. Puedes editarlo antes de publicar.
                            </p>
                        </div>

                        <textarea
                            value={postContent}
                            onChange={e => setPostContent(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-white font-mono resize-none outline-none focus:border-amber-500/50 transition-colors"
                            rows={12}
                        />

                        <div className="flex gap-2.5">
                            <button onClick={copyPost} className="flex-1 py-2.5 bg-slate-800 border border-slate-700 rounded-2xl text-xs font-mono font-bold text-slate-200 hover:bg-slate-700 flex items-center justify-center gap-2 transition-all">
                                {isCopied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                                {isCopied ? "¡Copiado!" : "Copiar"}
                            </button>
                            <button onClick={handlePublish} disabled={isPosting}
                                className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-all disabled:opacity-60">
                                {isPosting ? <RefreshCw size={13} className="animate-spin" /> : <Send size={13} />}
                                {postSuccess ? "¡Publicado! ✓" : "Publicar en Red Social"}
                            </button>
                            <button onClick={() => setShowPostModal(false)} className="px-3.5 py-2.5 bg-slate-800/50 border border-slate-700 rounded-2xl text-slate-400 text-xs hover:text-white transition-colors">
                                ✕
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
