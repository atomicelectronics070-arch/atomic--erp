"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
    Palette, Sparkles, Check, RefreshCw, Eye, 
    Sliders, Sun, Moon, Zap, Layers
} from "lucide-react"

interface ThemePalette {
    primary: string
    glow: string
    bgBase: string
    cardBg: string
    borderColor: string
    name: string
}

const PRESET_PALETTES: ThemePalette[] = [
    { name: "Ticketmaster Blanco (Por Defecto)", primary: "#026cdf", glow: "rgba(2, 108, 223, 0.25)", bgBase: "#ffffff", cardBg: "#f8fafc", borderColor: "#e2e8f0" },
    { name: "Cyan Neón (Oficial)", primary: "#06b6d4", glow: "rgba(6, 182, 212, 0.4)", bgBase: "#050914", cardBg: "#070c1d", borderColor: "rgba(6, 182, 212, 0.3)" },
    { name: "Verde Esmeralda Matrix", primary: "#10b981", glow: "rgba(16, 185, 129, 0.4)", bgBase: "#02120a", cardBg: "#051c11", borderColor: "rgba(16, 185, 129, 0.3)" },
    { name: "Púrpura Cyberpunk", primary: "#a855f7", glow: "rgba(168, 85, 247, 0.4)", bgBase: "#0b0518", cardBg: "#120a24", borderColor: "rgba(168, 85, 247, 0.3)" },
    { name: "Oro & Ámbar Imperial", primary: "#f59e0b", glow: "rgba(245, 158, 11, 0.4)", bgBase: "#120b02", cardBg: "#1c1205", borderColor: "rgba(245, 158, 11, 0.3)" },
    { name: "Rojo Carmesí Neón", primary: "#ef4444", glow: "rgba(239, 68, 68, 0.4)", bgBase: "#140406", cardBg: "#20080b", borderColor: "rgba(239, 68, 68, 0.3)" },
    { name: "OLED Negro Puro", primary: "#00f0ff", glow: "rgba(0, 240, 255, 0.3)", bgBase: "#000000", cardBg: "#080808", borderColor: "rgba(255, 255, 255, 0.15)" }
]

export default function ThemePainterStudio() {
    const [primaryColor, setPrimaryColor] = useState("#026cdf")
    const [bgBaseColor, setBgBaseColor] = useState("#ffffff")
    const [cardBgColor, setCardBgColor] = useState("#f8fafc")
    const [glowIntensity, setGlowIntensity] = useState(25)
    const [appliedSuccess, setAppliedSuccess] = useState(false)

    // Load saved custom palette
    useEffect(() => {
        if (typeof window !== "undefined") {
            try {
                const saved = localStorage.getItem("atomic_custom_palette")
                if (saved) {
                    const parsed = JSON.parse(saved)
                    if (parsed.primary) setPrimaryColor(parsed.primary)
                    if (parsed.bgBase) setBgBaseColor(parsed.bgBase)
                    if (parsed.cardBg) setCardBgColor(parsed.cardBg)
                }
            } catch (e) {}
        }
    }, [])

    const applyLivePalette = (primary: string, bgBase: string, cardBg: string, glow: number) => {
        if (typeof document !== "undefined") {
            const root = document.documentElement
            root.style.setProperty("--theme-primary", primary)
            root.style.setProperty("--theme-bg", bgBase)
            root.style.setProperty("--theme-card", cardBg)
            root.style.setProperty("--theme-glow", `0 0 ${glow}px ${primary}`)

            // Dispatch global event for listeners
            window.dispatchEvent(new CustomEvent("theme-painted", {
                detail: { primary, bgBase, cardBg, glow }
            }))

            localStorage.setItem("atomic_custom_palette", JSON.stringify({
                primary,
                bgBase,
                cardBg,
                glow
            }))

            setAppliedSuccess(true)
            setTimeout(() => setAppliedSuccess(false), 2500)
        }
    }

    const handleSelectPreset = (p: ThemePalette) => {
        setPrimaryColor(p.primary)
        setBgBaseColor(p.bgBase)
        setCardBgColor(p.cardBg)
        applyLivePalette(p.primary, p.bgBase, p.cardBg, glowIntensity)
    }

    const handleApplyCustom = () => {
        applyLivePalette(primaryColor, bgBaseColor, cardBgColor, glowIntensity)
    }

    const handleReset = () => {
        const def = PRESET_PALETTES[0]
        setPrimaryColor(def.primary)
        setBgBaseColor(def.bgBase)
        setCardBgColor(def.cardBg)
        setGlowIntensity(40)
        applyLivePalette(def.primary, def.bgBase, def.cardBg, 40)
    }

    return (
        <div className="w-full h-full flex flex-col space-y-6 text-white font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/80 p-5 rounded-2xl border border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                        <Palette size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">Pintor de Temas · Color Studio</h3>
                        <p className="text-xs text-slate-400 font-mono">
                            Pinta literalmente la paleta de colores del sistema en tiempo real con inyección CSS dinámica.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleReset}
                        className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
                    >
                        <RefreshCw size={13} />
                        <span>Restaurar Oficial</span>
                    </button>
                    <button
                        onClick={handleApplyCustom}
                        className="px-5 py-2 rounded-xl bg-cyan-500 text-black font-bold text-xs font-mono flex items-center gap-1.5 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:bg-cyan-400 transition-all cursor-pointer"
                    >
                        <Zap size={14} />
                        <span>Pintar Sistema Ahora</span>
                    </button>
                </div>
            </div>

            {/* Presets Cards */}
            <div className="space-y-3">
                <span className="text-xs font-mono font-bold uppercase text-slate-400 block px-1">
                    Paletas Maestras Preconfiguradas:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {PRESET_PALETTES.map((preset) => (
                        <button
                            key={preset.name}
                            onClick={() => handleSelectPreset(preset)}
                            className="p-3.5 rounded-2xl border border-slate-800 hover:border-white/30 text-left transition-all flex flex-col justify-between space-y-3 cursor-pointer group"
                            style={{ backgroundColor: preset.cardBg }}
                        >
                            <div className="flex items-center justify-between">
                                <div
                                    className="w-5 h-5 rounded-full shadow-md"
                                    style={{ backgroundColor: preset.primary, boxShadow: `0 0 10px ${preset.primary}` }}
                                />
                                {primaryColor.toLowerCase() === preset.primary.toLowerCase() && (
                                    <Check size={14} className="text-white" />
                                )}
                            </div>
                            <div>
                                <span className="text-xs font-bold text-white block">{preset.name}</span>
                                <span className="text-[10px] font-mono text-slate-400">{preset.primary}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Custom Color Pickers Studio */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-6">
                <span className="text-xs font-mono font-bold uppercase text-slate-400 block">
                    Personalizador de Colores Hexadecimales:
                </span>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Primary Color */}
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                        <label className="text-xs font-mono text-slate-300 block font-bold">
                            Color Primario Neón:
                        </label>
                        <div className="flex items-center gap-3">
                            <input
                                type="color"
                                value={primaryColor}
                                onChange={(e) => setPrimaryColor(e.target.value)}
                                className="w-12 h-12 rounded-xl bg-transparent border-0 cursor-pointer"
                            />
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={primaryColor}
                                    onChange={(e) => setPrimaryColor(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs font-mono text-white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Background Base */}
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                        <label className="text-xs font-mono text-slate-300 block font-bold">
                            Fondo Base del ERP:
                        </label>
                        <div className="flex items-center gap-3">
                            <input
                                type="color"
                                value={bgBaseColor}
                                onChange={(e) => setBgBaseColor(e.target.value)}
                                className="w-12 h-12 rounded-xl bg-transparent border-0 cursor-pointer"
                            />
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={bgBaseColor}
                                    onChange={(e) => setBgBaseColor(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs font-mono text-white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Card Background */}
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                        <label className="text-xs font-mono text-slate-300 block font-bold">
                            Fondo de Tarjetas & Paneles:
                        </label>
                        <div className="flex items-center gap-3">
                            <input
                                type="color"
                                value={cardBgColor}
                                onChange={(e) => setCardBgColor(e.target.value)}
                                className="w-12 h-12 rounded-xl bg-transparent border-0 cursor-pointer"
                            />
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={cardBgColor}
                                    onChange={(e) => setCardBgColor(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs font-mono text-white"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Glow Intensity Slider */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex justify-between items-center text-xs font-mono">
                        <span className="text-slate-300 font-bold">Intensidad de Resplandor Neón (Glow):</span>
                        <span className="text-cyan-400 font-bold">{glowIntensity}px</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="80"
                        value={glowIntensity}
                        onChange={(e) => setGlowIntensity(Number(e.target.value))}
                        className="w-full accent-cyan-500 cursor-pointer"
                    />
                </div>

                {appliedSuccess && (
                    <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2">
                        <Check size={16} />
                        <span>¡Paleta aplicada y persistida con éxito en todo el DOM del sistema!</span>
                    </div>
                )}
            </div>
        </div>
    )
}
