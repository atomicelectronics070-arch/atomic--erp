"use client"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { RefreshCw, Save, RotateCcw, TrendingUp, Copy, Check, Send } from "lucide-react"

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

export default function LiveTradingChart({ isAdmin = false }: TradingChartProps) {
    const { data: session } = useSession()
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [cycle, setCycle] = useState<CycleData | null>(null)
    const [dataPoints, setDataPoints] = useState<DataPoint[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isResetting, setIsResetting] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [postContent, setPostContent] = useState("")
    const [showPostModal, setShowPostModal] = useState(false)
    const [isCopied, setIsCopied] = useState(false)
    const [isPosting, setIsPosting] = useState(false)
    const [postSuccess, setPostSuccess] = useState(false)

    useEffect(() => {
        fetchData()
        const interval = setInterval(fetchData, 30000) // refresh every 30s
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        if (dataPoints.length > 0) {
            drawChart()
        }
    }, [dataPoints])

    const fetchData = async () => {
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
    }

    const drawChart = () => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const W = canvas.width
        const H = canvas.height
        const PADDING = { top: 40, right: 30, bottom: 50, left: 50 }
        const chartW = W - PADDING.left - PADDING.right
        const chartH = H - PADDING.top - PADDING.bottom

        // Clear
        ctx.clearRect(0, 0, W, H)

        // Background
        const bgGrad = ctx.createLinearGradient(0, 0, 0, H)
        bgGrad.addColorStop(0, "#050d1a")
        bgGrad.addColorStop(1, "#020912")
        ctx.fillStyle = bgGrad
        ctx.fillRect(0, 0, W, H)

        // Calculate max value for scale
        const maxVal = Math.max(
            ...dataPoints.map(d => Math.max(d.quotes, d.contacts, d.sales, d.mk)),
            5
        )
        const scale = chartH / (maxVal * 1.2)

        // Grid lines (30 vertical, 5 horizontal)
        ctx.strokeStyle = "rgba(30, 45, 70, 0.5)"
        ctx.lineWidth = 0.5
        for (let i = 0; i <= 30; i++) {
            const x = PADDING.left + (i / 30) * chartW
            ctx.beginPath()
            ctx.moveTo(x, PADDING.top)
            ctx.lineTo(x, PADDING.top + chartH)
            ctx.stroke()
        }
        for (let i = 0; i <= 5; i++) {
            const y = PADDING.top + (i / 5) * chartH
            ctx.beginPath()
            ctx.moveTo(PADDING.left, y)
            ctx.lineTo(PADDING.left + chartW, y)
            ctx.stroke()

            // Y labels
            ctx.fillStyle = "rgba(100, 120, 160, 0.8)"
            ctx.font = "10px monospace"
            ctx.textAlign = "right"
            const val = Math.round(maxVal * (1 - i / 5))
            ctx.fillText(val.toString(), PADDING.left - 5, y + 3)
        }

        // X labels (day 1-30)
        ctx.fillStyle = "rgba(80, 100, 140, 0.8)"
        ctx.font = "9px monospace"
        ctx.textAlign = "center"
        for (let d = 0; d < 30; d += 5) {
            const x = PADDING.left + ((d + 0.5) / 30) * chartW
            ctx.fillText(`D${d + 1}`, x, PADDING.top + chartH + 15)
        }

        // Red line for passed days
        if (dataPoints.length > 0) {
            const passedX = PADDING.left + (dataPoints.length / 30) * chartW
            const redGrad = ctx.createLinearGradient(PADDING.left, 0, passedX, 0)
            redGrad.addColorStop(0, "rgba(239, 68, 68, 0)")
            redGrad.addColorStop(1, "rgba(239, 68, 68, 0.12)")
            ctx.fillStyle = redGrad
            ctx.fillRect(PADDING.left, PADDING.top, passedX - PADDING.left, chartH)

            ctx.strokeStyle = "rgba(239, 68, 68, 0.5)"
            ctx.lineWidth = 1.5
            ctx.setLineDash([6, 4])
            ctx.beginPath()
            ctx.moveTo(passedX, PADDING.top)
            ctx.lineTo(passedX, PADDING.top + chartH)
            ctx.stroke()
            ctx.setLineDash([])
        }

        if (dataPoints.length === 0) {
            ctx.fillStyle = "rgba(100, 120, 160, 0.5)"
            ctx.font = "13px monospace"
            ctx.textAlign = "center"
            ctx.fillText("Sin datos — Inicia un ciclo con el botón ↺ para comenzar", W / 2, H / 2)
            return
        }

        // Helper to draw a series line with glow
        const drawLine = (
            key: keyof DataPoint,
            color: string,
            glowColor: string,
            lineWidth: number,
            isDashed: boolean = false,
            alpha: number = 1
        ) => {
            if (dataPoints.length < 1) return

            // Glow effect
            ctx.shadowBlur = 12
            ctx.shadowColor = glowColor

            ctx.beginPath()
            ctx.lineWidth = lineWidth
            ctx.globalAlpha = alpha

            if (isDashed) ctx.setLineDash([4, 5])

            const gradLine = ctx.createLinearGradient(0, 0, W, 0)
            gradLine.addColorStop(0, color)
            gradLine.addColorStop(1, color)
            ctx.strokeStyle = gradLine

            dataPoints.forEach((pt, i) => {
                const x = PADDING.left + ((pt.day - 0.5) / 30) * chartW
                const val = pt[key] as number
                const y = PADDING.top + chartH - val * scale

                if (i === 0) {
                    ctx.moveTo(x, y)
                } else {
                    // Smooth curve
                    const prevPt = dataPoints[i - 1]
                    const prevX = PADDING.left + ((prevPt.day - 0.5) / 30) * chartW
                    const prevY = PADDING.top + chartH - (prevPt[key] as number) * scale
                    const cpX = (prevX + x) / 2
                    ctx.bezierCurveTo(cpX, prevY, cpX, y, x, y)
                }
            })
            ctx.stroke()
            ctx.setLineDash([])
            ctx.globalAlpha = 1
            ctx.shadowBlur = 0

            // Draw data point dots
            dataPoints.forEach(pt => {
                const x = PADDING.left + ((pt.day - 0.5) / 30) * chartW
                const val = pt[key] as number
                const y = PADDING.top + chartH - val * scale

                ctx.shadowBlur = 10
                ctx.shadowColor = glowColor
                ctx.beginPath()
                ctx.arc(x, y, isDashed ? 2 : 3.5, 0, Math.PI * 2)
                ctx.fillStyle = color
                ctx.fill()
                ctx.shadowBlur = 0
            })
        }

        // MK (secret golden, very subtle, behind everything)
        drawLine("mk", "rgba(234, 179, 8, 0.35)", "rgba(234, 179, 8, 0.2)", 1.5, true, 0.4)

        // Contacts (cyan neon)
        drawLine("contacts", "#22d3ee", "rgba(34,211,238,0.8)", 2)

        // Quotes (hot pink neon)
        drawLine("quotes", "#f472b6", "rgba(244,114,182,0.8)", 2)

        // Sales (neon green — primary, thickest)
        drawLine("sales", "#4ade80", "rgba(74,222,128,0.9)", 3)

        // Legend
        const legends = [
            { label: "VENTAS", color: "#4ade80", shadow: "rgba(74,222,128,0.8)", isDashed: false },
            { label: "COTIZACIONES", color: "#f472b6", shadow: "rgba(244,114,182,0.8)", isDashed: false },
            { label: "CONTACTOS", color: "#22d3ee", shadow: "rgba(34,211,238,0.8)", isDashed: false },
            { label: "MK", color: "rgba(234,179,8,0.5)", shadow: "rgba(234,179,8,0.3)", isDashed: true }
        ]

        let lx = PADDING.left
        legends.forEach(leg => {
            ctx.shadowBlur = 6
            ctx.shadowColor = leg.shadow
            ctx.strokeStyle = leg.color
            ctx.lineWidth = leg.isDashed ? 1.5 : 2
            if (leg.isDashed) ctx.setLineDash([4, 4])
            ctx.beginPath()
            ctx.moveTo(lx, 22)
            ctx.lineTo(lx + 20, 22)
            ctx.stroke()
            ctx.setLineDash([])
            ctx.shadowBlur = 0

            ctx.fillStyle = leg.isDashed ? "rgba(234,179,8,0.4)" : leg.color
            ctx.font = "9px monospace"
            ctx.textAlign = "left"
            ctx.fillText(leg.label, lx + 25, 26)
            lx += leg.label.length * 7 + 40
        })
    }

    const handleReset = async () => {
        if (!confirm("¿Confirmas reiniciar el ciclo de 30 días? El ciclo anterior se guardará automáticamente en el historial.")) return
        setIsResetting(true)
        try {
            const res = await fetch("/api/trading-chart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "reset" })
            })
            await fetchData()
        } catch (e) {
            console.error("Reset error:", e)
        } finally {
            setIsResetting(false)
        }
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
            if (data.postContent) {
                setPostContent(data.postContent)
                setShowPostModal(true)
            }
        } catch (e) {
            console.error("Save cycle error:", e)
        } finally {
            setIsSaving(false)
        }
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
            setTimeout(() => {
                setShowPostModal(false)
                setPostSuccess(false)
            }, 2000)
        } catch {
            // Silently fail, user can still copy
        } finally {
            setIsPosting(false)
        }
    }

    const copyPost = () => {
        navigator.clipboard.writeText(postContent)
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
    }

    return (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 relative overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                        <TrendingUp className="text-emerald-400" size={20} />
                        Gráfica de Rendimiento en Vivo — Ciclo 30 Días
                    </h3>
                    <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                        {cycle 
                            ? `Ciclo iniciado: ${new Date(cycle.startedAt).toLocaleDateString("es-ES", { day: "numeric", month: "long" })} • Día ${cycle.daysPassed}/30 en curso`
                            : "Sin ciclo activo — Solo el administrador puede iniciar un nuevo ciclo"
                        }
                    </p>
                </div>

                {/* Admin controls */}
                {isAdmin && (
                    <div className="flex items-center gap-2">
                        {cycle && (
                            <button
                                onClick={handleSaveCycle}
                                disabled={isSaving}
                                className="px-4 py-2 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-2xl text-xs font-mono font-bold hover:bg-amber-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
                            >
                                {isSaving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                                Guardar Ciclo
                            </button>
                        )}
                        <button
                            onClick={handleReset}
                            disabled={isResetting}
                            className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center hover:bg-emerald-500/20 transition-all hover:rotate-180 duration-300"
                            title="Reiniciar Ciclo (cada Lunes)"
                        >
                            {isResetting ? <RefreshCw size={16} className="animate-spin" /> : <RotateCcw size={16} />}
                        </button>
                    </div>
                )}
            </div>

            {/* Metrics bar */}
            {cycle && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-slate-950/80 border border-emerald-500/20 rounded-2xl p-3 text-center">
                        <p className="text-2xl font-black text-emerald-400" style={{ textShadow: "0 0 20px rgba(74,222,128,0.6)" }}>{cycle.totals.sales}</p>
                        <p className="text-[10px] font-mono text-slate-400 mt-0.5">Ventas</p>
                    </div>
                    <div className="bg-slate-950/80 border border-pink-500/20 rounded-2xl p-3 text-center">
                        <p className="text-2xl font-black text-pink-400" style={{ textShadow: "0 0 20px rgba(244,114,182,0.6)" }}>{cycle.totals.quotes}</p>
                        <p className="text-[10px] font-mono text-slate-400 mt-0.5">Cotizaciones</p>
                    </div>
                    <div className="bg-slate-950/80 border border-cyan-500/20 rounded-2xl p-3 text-center">
                        <p className="text-2xl font-black text-cyan-400" style={{ textShadow: "0 0 20px rgba(34,211,238,0.6)" }}>{cycle.totals.contacts}</p>
                        <p className="text-[10px] font-mono text-slate-400 mt-0.5">Contactos</p>
                    </div>
                    <div className="bg-slate-950/80 border border-amber-500/10 rounded-2xl p-3 text-center opacity-60">
                        <p className="text-2xl font-black text-amber-400/60">{cycle.totals.payments}</p>
                        <p className="text-[10px] font-mono text-slate-500 mt-0.5">MK</p>
                    </div>
                </div>
            )}

            {/* CANVAS CHART */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-800/80" style={{ background: "#050d1a" }}>
                <canvas
                    ref={canvasRef}
                    width={900}
                    height={320}
                    className="w-full h-auto"
                    style={{ imageRendering: "auto" }}
                />
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/70">
                        <div className="text-emerald-400 text-sm font-mono animate-pulse">Cargando datos del ciclo...</div>
                    </div>
                )}
            </div>

            {/* Post Modal */}
            {showPostModal && (
                <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-amber-500/30 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                            <div>
                                <h4 className="font-black text-white">Resumen del Ciclo Generado</h4>
                                <p className="text-[10px] font-mono text-slate-400">Publica directamente en la Red Social Interna</p>
                            </div>
                        </div>

                        <textarea
                            value={postContent}
                            onChange={e => setPostContent(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-white font-mono resize-none outline-none focus:border-amber-500/50"
                            rows={12}
                        />

                        <div className="flex gap-3">
                            <button
                                onClick={copyPost}
                                className="flex-1 py-3 bg-slate-800 border border-slate-700 rounded-2xl text-xs font-mono font-bold text-slate-200 hover:bg-slate-700 flex items-center justify-center gap-2"
                            >
                                {isCopied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                                {isCopied ? "¡Copiado!" : "Copiar"}
                            </button>
                            <button
                                onClick={handlePublish}
                                disabled={isPosting}
                                className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-all disabled:opacity-60"
                            >
                                {isPosting ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
                                {postSuccess ? "¡Publicado!" : "Publicar en Red Social"}
                            </button>
                            <button
                                onClick={() => setShowPostModal(false)}
                                className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-2xl text-slate-400 text-xs hover:text-white"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
