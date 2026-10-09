"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
    Calculator, Trash2, Copy, Check, Percent, 
    DollarSign, ArrowRight, History, Sparkles, Download
} from "lucide-react"

interface HistoryEntry {
    id: string
    operation: string
    result: string
    timestamp: string
    note?: string
}

export default function FinancialCalculator() {
    const [display, setDisplay] = useState("0")
    const [prevValue, setPrevValue] = useState<number | null>(null)
    const [operation, setOperation] = useState<string | null>(null)
    const [waitingForOperand, setWaitingForOperand] = useState(false)
    const [copied, setCopied] = useState(false)

    // History tape
    const [history, setHistory] = useState<HistoryEntry[]>(() => {
        if (typeof window !== "undefined") {
            try {
                const saved = localStorage.getItem("atomic_calc_history")
                return saved ? JSON.parse(saved) : []
            } catch (e) {
                return []
            }
        }
        return []
    })

    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("atomic_calc_history", JSON.stringify(history))
        }
    }, [history])

    const handleDigit = (digit: string) => {
        if (waitingForOperand) {
            setDisplay(digit)
            setWaitingForOperand(false)
        } else {
            setDisplay(display === "0" ? digit : display + digit)
        }
    }

    const handleDecimal = () => {
        if (waitingForOperand) {
            setDisplay("0.")
            setWaitingForOperand(false)
        } else if (!display.includes(".")) {
            setDisplay(display + ".")
        }
    }

    const handleClear = () => {
        setDisplay("0")
        setPrevValue(null)
        setOperation(null)
        setWaitingForOperand(false)
    }

    const handleOperator = (nextOp: string) => {
        const inputValue = parseFloat(display)

        if (prevValue === null) {
            setPrevValue(inputValue)
        } else if (operation) {
            const current = prevValue || 0
            const result = calculate(current, inputValue, operation)
            setPrevValue(result)
            setDisplay(String(result))
            addToHistory(`${current} ${operation} ${inputValue}`, String(result))
        }

        setWaitingForOperand(true)
        setOperation(nextOp)
    }

    const handleEquals = () => {
        const inputValue = parseFloat(display)
        if (prevValue !== null && operation) {
            const current = prevValue
            const result = calculate(current, inputValue, operation)
            setDisplay(String(result))
            addToHistory(`${current} ${operation} ${inputValue}`, String(result))
            setPrevValue(null)
            setOperation(null)
            setWaitingForOperand(true)
        }
    }

    const calculate = (prev: number, current: number, op: string): number => {
        switch (op) {
            case "+": return prev + current
            case "-": return prev - current
            case "×": return prev * current
            case "÷": return current !== 0 ? prev / current : 0
            default: return current
        }
    }

    // Financial Shortcuts
    const applyIva15 = () => {
        const current = parseFloat(display) || 0
        const withIva = Number((current * 1.15).toFixed(2))
        setDisplay(String(withIva))
        addToHistory(`$${current} + 15% IVA`, `$${withIva}`, "IVA Ecuador (15%)")
        setWaitingForOperand(true)
    }

    const applyMargin30 = () => {
        const costo = parseFloat(display) || 0
        // PVP = Costo / (1 - 0.30)
        const pvp = Number((costo / 0.70).toFixed(2))
        setDisplay(String(pvp))
        addToHistory(`Costo $${costo} con Margen 30%`, `$${pvp}`, "Margen Comercial 30%")
        setWaitingForOperand(true)
    }

    const applyDiscount10 = () => {
        const current = parseFloat(display) || 0
        const desc = Number((current * 0.90).toFixed(2))
        setDisplay(String(desc))
        addToHistory(`$${current} - 10% Descuento`, `$${desc}`, "Descuento 10%")
        setWaitingForOperand(true)
    }

    const addToHistory = (op: string, res: string, note?: string) => {
        const newEntry: HistoryEntry = {
            id: Date.now().toString(),
            operation: op,
            result: res,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            note
        }
        setHistory(prev => [newEntry, ...prev.slice(0, 30)])
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(display)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="w-full h-full flex flex-col space-y-6 text-white font-sans">
            {/* Top Overview */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/80 p-5 rounded-2xl border border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                        <Calculator size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">Calculadora Financiera & Comercial</h3>
                        <p className="text-xs text-slate-400 font-mono">
                            Cálculos rápidos con IVA 15%, márgenes de utilidad, descuentos y cinta de historial.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={applyIva15}
                        className="px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold hover:bg-cyan-500/30 transition-all cursor-pointer"
                    >
                        + 15% IVA
                    </button>
                    <button
                        onClick={applyMargin30}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold hover:bg-emerald-500/30 transition-all cursor-pointer"
                    >
                        Margen 30%
                    </button>
                    <button
                        onClick={applyDiscount10}
                        className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold hover:bg-amber-500/30 transition-all cursor-pointer"
                    >
                        - 10% Desc.
                    </button>
                </div>
            </div>

            {/* Layout: Keypad Left, History Tape Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Calculator Keypad (7 cols) */}
                <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
                    {/* Display */}
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col items-end justify-center min-h-[90px] relative">
                        <span className="text-[11px] font-mono text-slate-500 absolute top-2 left-4">
                            {prevValue !== null && operation ? `${prevValue} ${operation}` : "Listo"}
                        </span>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleCopy}
                                className="text-slate-500 hover:text-cyan-400 transition-colors p-1"
                                title="Copiar resultado"
                            >
                                {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                            </button>
                            <span className="text-3xl sm:text-4xl font-mono font-bold text-white tracking-tight">
                                {display}
                            </span>
                        </div>
                    </div>

                    {/* Keypad Grid */}
                    <div className="grid grid-cols-4 gap-2.5 text-base font-bold font-mono">
                        <button onClick={handleClear} className="p-3.5 rounded-2xl bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 transition-all">
                            AC
                        </button>
                        <button onClick={applyIva15} className="p-3.5 rounded-2xl bg-slate-800 text-cyan-300 hover:bg-slate-700 transition-all">
                            IVA
                        </button>
                        <button onClick={applyDiscount10} className="p-3.5 rounded-2xl bg-slate-800 text-amber-300 hover:bg-slate-700 transition-all">
                            -10%
                        </button>
                        <button onClick={() => handleOperator("÷")} className="p-3.5 rounded-2xl bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600/40 transition-all">
                            ÷
                        </button>

                        <button onClick={() => handleDigit("7")} className="p-3.5 rounded-2xl bg-slate-950 text-white hover:bg-slate-800 transition-all">7</button>
                        <button onClick={() => handleDigit("8")} className="p-3.5 rounded-2xl bg-slate-950 text-white hover:bg-slate-800 transition-all">8</button>
                        <button onClick={() => handleDigit("9")} className="p-3.5 rounded-2xl bg-slate-950 text-white hover:bg-slate-800 transition-all">9</button>
                        <button onClick={() => handleOperator("×")} className="p-3.5 rounded-2xl bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600/40 transition-all">
                            ×
                        </button>

                        <button onClick={() => handleDigit("4")} className="p-3.5 rounded-2xl bg-slate-950 text-white hover:bg-slate-800 transition-all">4</button>
                        <button onClick={() => handleDigit("5")} className="p-3.5 rounded-2xl bg-slate-950 text-white hover:bg-slate-800 transition-all">5</button>
                        <button onClick={() => handleDigit("6")} className="p-3.5 rounded-2xl bg-slate-950 text-white hover:bg-slate-800 transition-all">6</button>
                        <button onClick={() => handleOperator("-")} className="p-3.5 rounded-2xl bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600/40 transition-all">
                            -
                        </button>

                        <button onClick={() => handleDigit("1")} className="p-3.5 rounded-2xl bg-slate-950 text-white hover:bg-slate-800 transition-all">1</button>
                        <button onClick={() => handleDigit("2")} className="p-3.5 rounded-2xl bg-slate-950 text-white hover:bg-slate-800 transition-all">2</button>
                        <button onClick={() => handleDigit("3")} className="p-3.5 rounded-2xl bg-slate-950 text-white hover:bg-slate-800 transition-all">3</button>
                        <button onClick={() => handleOperator("+")} className="p-3.5 rounded-2xl bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600/40 transition-all">
                            +
                        </button>

                        <button onClick={() => handleDigit("0")} className="col-span-2 p-3.5 rounded-2xl bg-slate-950 text-white hover:bg-slate-800 transition-all">0</button>
                        <button onClick={handleDecimal} className="p-3.5 rounded-2xl bg-slate-950 text-white hover:bg-slate-800 transition-all">.</button>
                        <button onClick={handleEquals} className="p-3.5 rounded-2xl bg-cyan-500 text-black font-bold hover:bg-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all">
                            =
                        </button>
                    </div>
                </div>

                {/* History Tape (5 cols) */}
                <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 flex flex-col h-[430px] shadow-xl">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                        <div className="flex items-center gap-2">
                            <History size={16} className="text-cyan-400" />
                            <h4 className="text-xs font-mono font-bold uppercase text-white">Cinta de Auditoría</h4>
                        </div>
                        {history.length > 0 && (
                            <button
                                onClick={() => setHistory([])}
                                className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                                title="Limpiar historial"
                            >
                                <Trash2 size={14} />
                            </button>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-xs font-mono">
                        {history.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center p-6">
                                <Calculator size={32} className="mb-2 opacity-30" />
                                <span>El historial está vacío. Realiza cálculos para registrarlos aquí.</span>
                            </div>
                        ) : (
                            history.map(item => (
                                <div key={item.id} className="p-3 rounded-xl bg-slate-950 border border-slate-850 space-y-1">
                                    <div className="flex justify-between items-center text-[10px] text-slate-500">
                                        <span>{item.timestamp}</span>
                                        {item.note && <span className="text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded">{item.note}</span>}
                                    </div>
                                    <div className="text-slate-400">{item.operation}</div>
                                    <div className="text-emerald-400 font-bold text-sm text-right">= {item.result}</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
