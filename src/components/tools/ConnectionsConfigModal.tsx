"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Settings, Plus, Trash2, CheckCircle2, Shield, 
    Share2, Key, Globe, Sparkles, MessageSquare, 
    Send, Instagram, Facebook, Video, Check, Layers
} from "lucide-react"

interface SocialTokenConfig {
    platform: string
    name: string
    token: string
    status: "active" | "expired" | "pending"
    updatedAt: string
}

interface ConnectionPurpose {
    id: string
    platform: "telegram" | "whatsapp" | "instagram" | "facebook" | "tiktok"
    instanceName: string
    purpose: string // "Cripto" | "Trabajo" | custom
    isActive: boolean
}

export default function ConnectionsConfigModal() {
    const [activeTab, setActiveTab] = useState<"social" | "purposes" | "enabled">("purposes")

    // Saved purposes list with default values
    const [purposesList, setPurposesList] = useState<string[]>(() => {
        if (typeof window !== "undefined") {
            try {
                const saved = localStorage.getItem("atomic_purposes_list")
                return saved ? JSON.parse(saved) : ["Cripto", "Trabajo", "Soporte VIP", "Ventas Express"]
            } catch (e) {
                return ["Cripto", "Trabajo", "Soporte VIP", "Ventas Express"]
            }
        }
        return ["Cripto", "Trabajo", "Soporte VIP", "Ventas Express"]
    })

    const [isCreatingPurpose, setIsCreatingPurpose] = useState(false)
    const [newPurposeName, setNewPurposeName] = useState("")

    // Active Instances with purposes
    const [instances, setInstances] = useState<ConnectionPurpose[]>([
        { id: "i1", platform: "telegram", instanceName: "Telegram Bot 1", purpose: "Trabajo", isActive: true },
        { id: "i2", platform: "telegram", instanceName: "Telegram Bot 2 (Trading)", purpose: "Cripto", isActive: true },
        { id: "i3", platform: "whatsapp", instanceName: "WhatsApp Asesor Principal", purpose: "Trabajo", isActive: true },
        { id: "i4", platform: "whatsapp", instanceName: "WhatsApp Alertas Binance", purpose: "Cripto", isActive: true },
        { id: "i5", platform: "instagram", instanceName: "Instagram @atomic.electronics.ec", purpose: "Trabajo", isActive: true },
        { id: "i6", platform: "facebook", instanceName: "Facebook Oficial ATOMIC", purpose: "Trabajo", isActive: true },
        { id: "i7", platform: "tiktok", instanceName: "TikTok Demos Seguridad", purpose: "Trabajo", isActive: true }
    ])

    // Tokens state
    const [tokens, setTokens] = useState<SocialTokenConfig[]>([
        { platform: "WhatsApp Meta Cloud", name: "System User Token v21.0", token: "EAAG...K92L", status: "active", updatedAt: "08/10/2026" },
        { platform: "Telegram Bot API", name: "@AtomicGuiaBot Token", token: "7129...89Xa", status: "active", updatedAt: "08/10/2026" },
        { platform: "Instagram Graph API", name: "Meta Business Token", token: "IGQV...441P", status: "active", updatedAt: "07/10/2026" },
        { platform: "TikTok Content API", name: "TikTok Open Platform Key", token: "tk_live_99...", status: "active", updatedAt: "06/10/2026" }
    ])

    const handleCreatePurpose = (e: React.FormEvent) => {
        e.preventDefault()
        const clean = newPurposeName.trim()
        if (clean && !purposesList.includes(clean)) {
            const updated = [...purposesList, clean]
            setPurposesList(updated)
            if (typeof window !== "undefined") {
                localStorage.setItem("atomic_purposes_list", JSON.stringify(updated))
            }
            setNewPurposeName("")
            setIsCreatingPurpose(false)
        }
    }

    const handleAddInstance = (platform: ConnectionPurpose["platform"]) => {
        const count = instances.filter(i => i.platform === platform).length + 1
        const newInst: ConnectionPurpose = {
            id: `inst_${Date.now()}`,
            platform,
            instanceName: `${platform.toUpperCase()} Instancia #${count}`,
            purpose: "Trabajo",
            isActive: true
        }
        setInstances(prev => [...prev, newInst])
    }

    const handleChangePurpose = (id: string, newPurp: string) => {
        setInstances(prev => prev.map(i => i.id === id ? { ...i, purpose: newPurp } : i))
    }

    const handleToggleActive = (id: string) => {
        setInstances(prev => prev.map(i => i.id === id ? { ...i, isActive: !i.isActive } : i))
    }

    const handleDeleteInstance = (id: string) => {
        setInstances(prev => prev.filter(i => i.id !== id))
    }

    return (
        <div className="w-full h-full flex flex-col space-y-6 text-white font-sans">
            {/* Top Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/80 p-5 rounded-2xl border border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                        <Settings size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">Configuración de Conexiones & Redes</h3>
                        <p className="text-xs text-slate-400 font-mono">
                            Gestiona tokens sociales, propósitos dinámicos (Cripto vs. Trabajo) y cuentas habilitadas.
                        </p>
                    </div>
                </div>

                {/* Subtabs Switcher */}
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs font-mono">
                    <button
                        onClick={() => setActiveTab("purposes")}
                        className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                            activeTab === "purposes" ? "bg-cyan-500 text-black font-bold shadow-md" : "text-slate-400 hover:text-white"
                        }`}
                    >
                        Propósitos de Conexión
                    </button>
                    <button
                        onClick={() => setActiveTab("social")}
                        className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                            activeTab === "social" ? "bg-cyan-500 text-black font-bold shadow-md" : "text-slate-400 hover:text-white"
                        }`}
                    >
                        Cuentas Sociales & Tokens
                    </button>
                    <button
                        onClick={() => setActiveTab("enabled")}
                        className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                            activeTab === "enabled" ? "bg-cyan-500 text-black font-bold shadow-md" : "text-slate-400 hover:text-white"
                        }`}
                    >
                        Cuentas Habilitadas ({instances.filter(i => i.isActive).length})
                    </button>
                </div>
            </div>

            {/* TAB 1: PROPÓSITOS DE CONEXIONES */}
            {activeTab === "purposes" && (
                <div className="space-y-6">
                    {/* Header bar to add more channels */}
                    <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                        <span className="text-xs font-mono font-bold uppercase text-slate-300">
                            Añadir Canales Múltiples:
                        </span>

                        <div className="flex flex-wrap items-center gap-2">
                            {(["telegram", "whatsapp", "instagram", "facebook", "tiktok"] as const).map(plat => (
                                <button
                                    key={plat}
                                    onClick={() => handleAddInstance(plat)}
                                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono flex items-center gap-1.5 cursor-pointer text-slate-200"
                                >
                                    <Plus size={12} className="text-cyan-400" />
                                    <span>+ {plat.toUpperCase()}</span>
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setIsCreatingPurpose(true)}
                            className="px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold flex items-center gap-1 cursor-pointer"
                        >
                            <Sparkles size={13} />
                            <span>+ Crear Nuevo Motivo</span>
                        </button>
                    </div>

                    {/* Modal to create a new purpose */}
                    {isCreatingPurpose && (
                        <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 flex items-center justify-between gap-4">
                            <div className="flex-1 flex items-center gap-3">
                                <span className="text-xs font-mono font-bold text-cyan-300">Nuevo Motivo:</span>
                                <input
                                    type="text"
                                    value={newPurposeName}
                                    onChange={(e) => setNewPurposeName(e.target.value)}
                                    placeholder="Ej: Inversionistas, Cobranzas, Proveedores..."
                                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                                />
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => setIsCreatingPurpose(false)} className="px-3 py-1.5 rounded-xl bg-slate-800 text-xs text-slate-400">
                                    Cancelar
                                </button>
                                <button onClick={handleCreatePurpose} className="px-4 py-1.5 rounded-xl bg-cyan-500 text-black font-bold text-xs">
                                    Guardar Motivo
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Cards Grid for all instances */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {instances.map(inst => (
                            <div
                                key={inst.id}
                                className={`p-4 rounded-2xl bg-slate-900/90 border transition-all flex flex-col justify-between space-y-4 ${
                                    inst.isActive ? "border-cyan-500/30" : "border-slate-800 opacity-60"
                                }`}
                            >
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                                            {inst.platform}
                                        </span>
                                        <button
                                            onClick={() => handleToggleActive(inst.id)}
                                            className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                                                inst.isActive ? "bg-emerald-500" : "bg-slate-800"
                                            }`}
                                        >
                                            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                                                inst.isActive ? "right-0.5" : "left-0.5"
                                            }`} />
                                        </button>
                                    </div>

                                    <h4 className="font-bold text-white text-sm truncate">{inst.instanceName}</h4>

                                    {/* Selector de Motivo */}
                                    <div>
                                        <label className="text-[10px] text-slate-400 font-mono block mb-1">
                                            Motivo / Alma del Bot:
                                        </label>
                                        <select
                                            value={inst.purpose}
                                            onChange={(e) => handleChangePurpose(inst.id, e.target.value)}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-400"
                                        >
                                            {purposesList.map(p => (
                                                <option key={p} value={p}>{p}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800/80 text-[10px] font-mono text-slate-400">
                                        {inst.purpose === "Cripto" ? (
                                            <span className="text-yellow-400 font-bold">⚡ Modo Cripto: Reportes de Binance y asesoría de mercado activa.</span>
                                        ) : inst.purpose === "Trabajo" ? (
                                            <span className="text-cyan-400 font-bold">💼 Modo Trabajo: Cotizaciones, CRM y catálogo comercial activos.</span>
                                        ) : (
                                            <span className="text-slate-300">🎯 Modo Personalizado: {inst.purpose}</span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-end pt-2 border-t border-slate-800">
                                    <button
                                        onClick={() => handleDeleteInstance(inst.id)}
                                        className="text-slate-500 hover:text-rose-400 p-1"
                                        title="Eliminar instancia"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* TAB 2: CUENTAS SOCIALES & TOKENS */}
            {activeTab === "social" && (
                <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
                    <div className="border-b border-slate-800 pb-3">
                        <h4 className="font-bold text-white text-sm">Tokens y Claves de API de Redes Sociales</h4>
                        <p className="text-xs text-slate-400 font-mono">
                            Gestiona las credenciales permanentes de Meta Cloud API, Telegram Bot API, Instagram y TikTok.
                        </p>
                    </div>

                    <div className="space-y-3">
                        {tokens.map((tok, i) => (
                            <div key={i} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs font-mono">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-white text-sm">{tok.platform}</span>
                                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                                            {tok.status.toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="text-slate-400 text-[11px] mt-0.5">{tok.name}</div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-cyan-300">
                                        {tok.token}
                                    </span>
                                    <button
                                        onClick={() => alert(`Editando token de ${tok.platform}`)}
                                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                                    >
                                        Actualizar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* TAB 3: CUENTAS HABILITADAS */}
            {activeTab === "enabled" && (
                <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
                    <div className="border-b border-slate-800 pb-3">
                        <h4 className="font-bold text-white text-sm">Resumen de Canales y Cuentas Habilitadas</h4>
                        <p className="text-xs text-slate-400 font-mono">
                            Estado operativo de las conexiones de entrada y salida del ecosistema ATOMIC.
                        </p>
                    </div>

                    <div className="space-y-2.5">
                        {instances.map(inst => (
                            <div key={inst.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono">
                                <div className="flex items-center gap-3">
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                                    <div>
                                        <span className="font-bold text-white">{inst.instanceName}</span>
                                        <span className="text-slate-500 ml-2">({inst.platform.toUpperCase()})</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className="px-2.5 py-0.5 rounded-lg bg-cyan-500/20 text-cyan-300 font-bold text-[10px]">
                                        {inst.purpose}
                                    </span>
                                    <span className="text-emerald-400 text-[11px] font-bold">DISPONIBLE</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
