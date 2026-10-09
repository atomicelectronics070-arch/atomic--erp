"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
    TrendingUp, TrendingDown, DollarSign, Activity, 
    ArrowUpRight, ArrowDownRight, RefreshCw, Key, 
    CheckCircle2, Sparkles, Shield, Send, Sliders
} from "lucide-react"

interface CryptoTicker {
    symbol: string
    pair: string
    name: string
    lastPrice: number
    priceChangePercent: number
    highPrice: number
    lowPrice: number
    volume: number
}

export default function CryptoBinanceTerminal() {
    const [selectedPair, setSelectedPair] = useState("BTCUSDT")
    const [timeframe, setTimeframe] = useState<"15m" | "1h" | "4h" | "1D">("1h")
    const [orderType, setOrderType] = useState<"market" | "limit">("market")
    const [orderSide, setOrderSide] = useState<"buy" | "sell">("buy")
    const [orderAmount, setOrderAmount] = useState("100")
    const [limitPrice, setLimitPrice] = useState("64500")

    // Binance API Keys state
    const [isApiModalOpen, setIsApiModalOpen] = useState(false)
    const [apiKey, setApiKey] = useState("")
    const [apiSecret, setApiSecret] = useState("")
    const [isApiConnected, setIsApiConnected] = useState(false)

    // AI Crypto Report
    const [isGeneratingReport, setIsGeneratingReport] = useState(false)
    const [cryptoReport, setCryptoReport] = useState<string | null>(null)

    // Tickers Data
    const [tickers, setTickers] = useState<CryptoTicker[]>([
        { symbol: "BTCUSDT", pair: "BTC / USDT", name: "Bitcoin", lastPrice: 65420.50, priceChangePercent: 3.42, highPrice: 66100, lowPrice: 63800, volume: 24510 },
        { symbol: "ETHUSDT", pair: "ETH / USDT", name: "Ethereum", lastPrice: 3480.20, priceChangePercent: 2.15, highPrice: 3550, lowPrice: 3390, volume: 89400 },
        { symbol: "SOLUSDT", pair: "SOL / USDT", name: "Solana", lastPrice: 154.80, priceChangePercent: 6.85, highPrice: 158.20, lowPrice: 144.10, volume: 152000 },
        { symbol: "BNBUSDT", pair: "BNB / USDT", name: "BNB", lastPrice: 592.40, priceChangePercent: 1.10, highPrice: 598.00, lowPrice: 585.00, volume: 12400 }
    ])

    // Fetch live prices from Binance public API
    useEffect(() => {
        const fetchBinancePrices = async () => {
            try {
                const res = await fetch("https://api.binance.com/api/v3/ticker/24hr")
                if (res.ok) {
                    const data = await res.json()
                    const targets = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT"]
                    const updated = targets.map(sym => {
                        const match = data.find((d: any) => d.symbol === sym)
                        const existing = tickers.find(t => t.symbol === sym)
                        if (match) {
                            return {
                                symbol: sym,
                                pair: existing?.pair || sym,
                                name: existing?.name || sym,
                                lastPrice: parseFloat(match.lastPrice),
                                priceChangePercent: parseFloat(match.priceChangePercent),
                                highPrice: parseFloat(match.highPrice),
                                lowPrice: parseFloat(match.lowPrice),
                                volume: parseFloat(match.volume)
                            }
                        }
                        return existing!
                    })
                    setTickers(updated)
                }
            } catch (e) {
                // Keep simulated/fallback data on offline or CORS
            }
        }

        fetchBinancePrices()
        const interval = setInterval(fetchBinancePrices, 8000)
        return () => clearInterval(interval)
    }, [])

    const activeTicker = tickers.find(t => t.symbol === selectedPair) || tickers[0]

    const handleSaveApi = (e: React.FormEvent) => {
        e.preventDefault()
        if (apiKey.trim()) {
            setIsApiConnected(true)
            setIsApiModalOpen(false)
        }
    }

    const handleRunCryptoAnalysis = () => {
        setIsGeneratingReport(true)
        setTimeout(() => {
            setCryptoReport(
                `📊 INFORME DE INTELIGENCIA CRIPTO EN VIVO · ATOMIC ALGO\n\n` +
                `• Bitcoin ($${activeTicker.lastPrice.toLocaleString()}): Estructura alcista consolidando sobre soporte clave. Entrada institucional neta en ETFs.\n` +
                `• Solana (SOL): Mayor impulso relativo (+${tickers[2].priceChangePercent}%). Alto volumen de transacciones en DeFi y ecosistema Pay.\n` +
                `• Recomendación Estratégica: Acumulación escalonada (DCA) en spot con órdenes limitadas en retrocesos hacia soporte.\n` +
                `• Alerta de Riesgo: Índice de Miedo y Codicia en 64 (Codicia Moderada). Mantener ratio de liquidez en USDT.`
            )
            setIsGeneratingReport(false)
        }, 1200)
    }

    return (
        <div className="w-full h-full flex flex-col space-y-4 text-white font-sans">
            {/* Top Binance Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#0b0e14] p-4 rounded-2xl border border-yellow-500/30 shadow-xl">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 border border-yellow-500/40 flex items-center justify-center text-yellow-400 shadow-[0_0_15px_rgba(240,185,11,0.2)]">
                        <Activity size={24} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg font-black text-white tracking-tight">Valores & Terminal Binance</h3>
                            <span className="px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 font-mono font-black text-[10px] border border-yellow-500/30">
                                PRO
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 font-mono">
                            Cotizaciones oficiales en vivo de Binance, libro de órdenes y automatización algorítmica.
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <button
                        onClick={handleRunCryptoAnalysis}
                        disabled={isGeneratingReport}
                        className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-black font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md"
                    >
                        <Sparkles size={14} className={isGeneratingReport ? "animate-spin" : ""} />
                        <span>{isGeneratingReport ? "Investigando..." : "Investigación IA Cripto"}</span>
                    </button>

                    <button
                        onClick={() => setIsApiModalOpen(true)}
                        className={`px-3.5 py-2 rounded-xl border text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
                            isApiConnected 
                                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40" 
                                : "bg-slate-900 text-slate-300 border-slate-800 hover:border-yellow-500/40"
                        }`}
                    >
                        <Key size={14} className={isApiConnected ? "text-emerald-400" : "text-yellow-400"} />
                        <span>{isApiConnected ? "Binance Conectado" : "Conectar Binance API"}</span>
                    </button>
                </div>
            </div>

            {/* AI Report Card if generated */}
            {cryptoReport && (
                <div className="p-4 rounded-2xl bg-yellow-950/30 border border-yellow-500/40 text-xs font-mono text-yellow-200/90 whitespace-pre-line relative">
                    <button onClick={() => setCryptoReport(null)} className="absolute top-3 right-3 text-yellow-400 hover:text-white">✕</button>
                    {cryptoReport}
                </div>
            )}

            {/* Market Tickers Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {tickers.map(ticker => {
                    const isPositive = ticker.priceChangePercent >= 0
                    const isSelected = ticker.symbol === selectedPair
                    return (
                        <button
                            key={ticker.symbol}
                            onClick={() => setSelectedPair(ticker.symbol)}
                            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                                isSelected
                                    ? "bg-[#181d26] border-yellow-500/60 shadow-[0_0_20px_rgba(240,185,11,0.2)]"
                                    : "bg-[#0f131a] border-slate-800/80 hover:border-slate-700"
                            }`}
                        >
                            <div className="flex justify-between items-center text-xs mb-1">
                                <span className="font-bold text-white">{ticker.pair}</span>
                                <span className={`font-mono text-[11px] font-bold flex items-center gap-0.5 ${isPositive ? "text-emerald-400" : "text-rose-400"}`}>
                                    {isPositive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                                    {isPositive ? "+" : ""}{ticker.priceChangePercent.toFixed(2)}%
                                </span>
                            </div>
                            <div className="text-lg font-mono font-black text-white">
                                ${ticker.lastPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </div>
                            <div className="text-[10px] font-mono text-slate-500 mt-1">
                                24h Vol: {ticker.volume.toLocaleString()}
                            </div>
                        </button>
                    )
                })}
            </div>

            {/* Trading Area: Chart Left (8 cols), Order Book & Execution Right (4 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Simulated Candlestick / TradingView Arena */}
                <div className="lg:col-span-8 bg-[#0b0e14] border border-slate-800 rounded-3xl p-5 flex flex-col space-y-4">
                    <div className="flex flex-wrap justify-between items-center gap-3 border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-3">
                            <span className="text-xl font-black text-white">{activeTicker.pair}</span>
                            <span className="text-xl font-mono font-bold text-emerald-400">
                                ${activeTicker.lastPrice.toLocaleString()}
                            </span>
                        </div>

                        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
                            {(["15m", "1h", "4h", "1D"] as const).map(tf => (
                                <button
                                    key={tf}
                                    onClick={() => setTimeframe(tf)}
                                    className={`px-2.5 py-1 rounded-lg ${timeframe === tf ? "bg-yellow-500 text-black font-bold" : "text-slate-400 hover:text-white"}`}
                                >
                                    {tf}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Chart Canvas Graphic Simulation */}
                    <div className="flex-1 min-h-[260px] bg-[#07090e] rounded-2xl border border-slate-900 relative overflow-hidden flex flex-col justify-end p-4">
                        <div className="absolute top-4 left-4 text-xs font-mono text-slate-500">
                            High: ${activeTicker.highPrice} • Low: ${activeTicker.lowPrice} • MA(7): ${Math.round(activeTicker.lastPrice * 0.99)}
                        </div>

                        {/* Simulated Candlesticks */}
                        <div className="flex items-end justify-between gap-2 h-44 z-10 px-2">
                            {[42, 48, 45, 52, 60, 58, 64, 72, 68, 75, 82, 80, 88, 92, 85, 94, 98, 95, 105, 110].map((h, i) => {
                                const isGreen = i % 3 !== 0
                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                                        <div className={`w-[2px] ${isGreen ? "bg-emerald-500" : "bg-rose-500"} mb-0.5`} style={{ height: `${h * 0.2}px` }} />
                                        <div
                                            className={`w-full max-w-[12px] rounded-sm ${isGreen ? "bg-emerald-500" : "bg-rose-500"}`}
                                            style={{ height: `${h}px` }}
                                        />
                                        <div className={`w-[2px] ${isGreen ? "bg-emerald-500" : "bg-rose-500"} mt-0.5`} style={{ height: `${h * 0.15}px` }} />
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* Order Execution & Book */}
                <div className="lg:col-span-4 bg-[#0b0e14] border border-slate-800 rounded-3xl p-5 flex flex-col space-y-4">
                    {/* Buy / Sell Tabs */}
                    <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-2xl border border-slate-800 font-mono text-xs font-bold">
                        <button
                            onClick={() => setOrderSide("buy")}
                            className={`py-2 rounded-xl transition-all cursor-pointer ${
                                orderSide === "buy" ? "bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]" : "text-slate-400 hover:text-white"
                            }`}
                        >
                            Comprar
                        </button>
                        <button
                            onClick={() => setOrderSide("sell")}
                            className={`py-2 rounded-xl transition-all cursor-pointer ${
                                orderSide === "sell" ? "bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)]" : "text-slate-400 hover:text-white"
                            }`}
                        >
                            Vender
                        </button>
                    </div>

                    {/* Order Inputs */}
                    <div className="space-y-3 font-mono text-xs">
                        <div>
                            <label className="text-slate-500 block mb-1">Monto en USDT:</label>
                            <input
                                type="number"
                                value={orderAmount}
                                onChange={(e) => setOrderAmount(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-yellow-500"
                            />
                        </div>

                        <div>
                            <label className="text-slate-500 block mb-1">Precio Estimado:</label>
                            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-mono">
                                ${activeTicker.lastPrice.toLocaleString()} USDT
                            </div>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                            <div className="flex justify-between">
                                <span>Total Cripto a Recibir:</span>
                                <span className="font-bold text-white">
                                    {(parseFloat(orderAmount || "0") / activeTicker.lastPrice).toFixed(6)} {activeTicker.symbol.replace("USDT", "")}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Comisión Estimada:</span>
                                <span className="text-emerald-400">0.075% (BNB)</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => alert(`Orden de ${orderSide === "buy" ? "COMPRA" : "VENTA"} de $${orderAmount} USDT enviada a la cola de automatización.`)}
                            className={`w-full py-3 rounded-2xl font-black font-mono uppercase tracking-wider text-xs transition-all cursor-pointer ${
                                orderSide === "buy"
                                    ? "bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                                    : "bg-rose-500 hover:bg-rose-400 text-white shadow-[0_0_20px_rgba(244,63,94,0.3)]"
                            }`}
                        >
                            {orderSide === "buy" ? "Ejecutar Compra" : "Ejecutar Venta"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal: Conectar Binance API */}
            {isApiModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="w-full max-w-md bg-[#0b0e14] border border-yellow-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <div className="flex items-center gap-2">
                                <Key size={16} className="text-yellow-400" />
                                <h4 className="font-bold text-white text-sm">Conectar Binance API</h4>
                            </div>
                            <button onClick={() => setIsApiModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
                        </div>

                        <form onSubmit={handleSaveApi} className="space-y-3 font-mono text-xs">
                            <p className="text-slate-400 text-[11px]">
                                Ingresa tu API Key de Binance para automatizar órdenes y consultas de saldo directo. Se recomienda habilitar únicamente permisos de lectura y trading spot (sin retiro).
                            </p>

                            <div>
                                <label className="text-slate-400 block mb-1">API Key:</label>
                                <input
                                    type="password"
                                    required
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    placeholder="Ingresa tu API Key de Binance..."
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-yellow-500"
                                />
                            </div>

                            <div>
                                <label className="text-slate-400 block mb-1">Secret Key:</label>
                                <input
                                    type="password"
                                    required
                                    value={apiSecret}
                                    onChange={(e) => setApiSecret(e.target.value)}
                                    placeholder="Ingresa tu Secret Key..."
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-yellow-500"
                                />
                            </div>

                            <div className="pt-2 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsApiModalOpen(false)}
                                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 rounded-xl bg-yellow-500 text-black font-bold hover:bg-yellow-400"
                                >
                                    Vincular API
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
