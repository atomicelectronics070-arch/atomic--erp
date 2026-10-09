"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { 
    Share2, Plus, Trash2, CheckCircle2, Instagram, 
    Facebook, Video, Sparkles, Send, Calendar, Clock, 
    Layers, ExternalLink, Image as ImageIcon, Copy
} from "lucide-react"

interface SocialAccount {
    id: string
    platform: "instagram" | "tiktok" | "facebook" | "youtube"
    handle: string
    avatar?: string
    followers: string
    purpose: string
    isActive: boolean
}

export default function SocialMultiManager() {
    const [accounts, setAccounts] = useState<SocialAccount[]>([
        { id: "a1", platform: "tiktok", handle: "@atomic_ecuador_oficial", followers: "24.5K", purpose: "Ventas y Demos de Seguridad", isActive: true },
        { id: "a2", platform: "tiktok", handle: "@atomic_tech_soporte", followers: "8.2K", purpose: "Tutoriales Técnicos e Instalaciones", isActive: true },
        { id: "a3", platform: "instagram", handle: "@atomic.electronics.ec", followers: "18.9K", purpose: "Catálogo y Proformas Directas", isActive: true },
        { id: "a4", platform: "facebook", handle: "ATOMIC Electronics Ecuador", followers: "42.1K", purpose: "Comunidad y Pauta Publicitaria", isActive: true },
        { id: "a5", platform: "youtube", handle: "ATOMIC Soluciones Smart", followers: "5.4K", purpose: "Reviews de Productos 4K", isActive: true }
    ])

    const [selectedAccount, setSelectedAccount] = useState<string>("a1")
    const [postText, setPostText] = useState("")
    const [isGeneratingCopy, setIsGeneratingCopy] = useState(false)
    const [scheduledDate, setScheduledDate] = useState("")
    const [publishStatus, setPublishStatus] = useState<string | null>(null)

    const activeAcc = accounts.find(a => a.id === selectedAccount) || accounts[0]

    const handleGenerateAiCopy = () => {
        setIsGeneratingCopy(true)
        setTimeout(() => {
            setPostText(
                `🚀 ¡Protege tu hogar y empresa con tecnología biométrica ATOMIC! 🔒⚡\n\n` +
                `Conoce la nueva cerradura inteligente con apertura por huella, tarjeta NFC y control desde tu celular en tiempo real.\n\n` +
                `📲 Cotiza hoy mismo con asesoría técnica inmediata y envío gratis a todo el Ecuador. Escríbenos al enlace de nuestro perfil o por WhatsApp directo.\n\n` +
                `#AtomicEcuador #SeguridadElectronica #CerraduraSmart #Biometria #HogarInteligente #Quito #Guayaquil #Cuenca`
            )
            setIsGeneratingCopy(false)
        }, 800)
    }

    const handlePublish = (e: React.FormEvent) => {
        e.preventDefault()
        if (!postText.trim()) return
        setPublishStatus("¡Publicación programada y sincronizada con éxito en " + activeAcc.handle + "!")
        setTimeout(() => setPublishStatus(null), 4000)
    }

    return (
        <div className="w-full h-full flex flex-col space-y-6 text-white font-sans">
            {/* Top Overview Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/80 p-5 rounded-2xl border border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400">
                        <Share2 size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">Gestor Social Multicuentas PRO</h3>
                        <p className="text-xs text-slate-400 font-mono">
                            Gestiona múltiples perfiles de TikTok, Instagram, Facebook y YouTube desde un solo lugar.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-pink-500/20 text-pink-300 font-bold border border-pink-500/30">
                        {accounts.length} Cuentas Conectadas
                    </span>
                </div>
            </div>

            {/* Main Area: Accounts Left, Composer Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Accounts List (Left 4 cols) */}
                <div className="lg:col-span-4 space-y-3">
                    <div className="flex justify-between items-center text-xs font-mono uppercase text-slate-400 font-bold px-1">
                        <span>Perfiles Activos</span>
                        <span>Propósito</span>
                    </div>

                    <div className="space-y-2.5">
                        {accounts.map(acc => (
                            <button
                                key={acc.id}
                                onClick={() => setSelectedAccount(acc.id)}
                                className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                                    selectedAccount === acc.id
                                        ? "bg-slate-900 border-pink-500/50 shadow-[0_0_20px_rgba(236,72,153,0.2)]"
                                        : "bg-slate-950/80 border-slate-800 hover:border-slate-700"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-pink-400">
                                        {acc.platform === "tiktok" && <Video size={18} />}
                                        {acc.platform === "instagram" && <Instagram size={18} />}
                                        {acc.platform === "facebook" && <Facebook size={18} />}
                                        {acc.platform === "youtube" && <Video size={18} />}
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                                            {acc.handle}
                                        </div>
                                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">{acc.purpose}</div>
                                    </div>
                                </div>
                                <span className="text-[10px] font-mono text-emerald-400 font-bold">{acc.followers}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Post Composer & AI Copywriter (Right 8 cols) */}
                <div className="lg:col-span-8 bg-slate-900/90 border border-white/10 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold uppercase text-slate-300">Publicando en:</span>
                            <span className="px-2.5 py-0.5 rounded-lg bg-pink-500/20 text-pink-300 font-mono text-xs font-bold border border-pink-500/30">
                                {activeAcc.handle} ({activeAcc.platform.toUpperCase()})
                            </span>
                        </div>

                        <button
                            type="button"
                            onClick={handleGenerateAiCopy}
                            disabled={isGeneratingCopy}
                            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-black font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                        >
                            <Sparkles size={14} className={isGeneratingCopy ? "animate-spin" : ""} />
                            <span>{isGeneratingCopy ? "Redactando..." : "Generar Copy con IA"}</span>
                        </button>
                    </div>

                    <form onSubmit={handlePublish} className="space-y-4">
                        <textarea
                            value={postText}
                            onChange={(e) => setPostText(e.target.value)}
                            placeholder="Escribe el contenido del post o utiliza el redactor inteligente de IA..."
                            rows={8}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-medium text-white placeholder:text-slate-500 focus:outline-none focus:border-pink-500 transition-colors resize-none"
                        />

                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                            <div className="flex items-center gap-2 text-xs font-mono">
                                <Calendar size={15} className="text-slate-400" />
                                <span className="text-slate-400">Programar:</span>
                                <input
                                    type="datetime-local"
                                    value={scheduledDate}
                                    onChange={(e) => setScheduledDate(e.target.value)}
                                    className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-300 text-xs focus:outline-none focus:border-pink-500"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={!postText.trim()}
                                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(236,72,153,0.3)] transition-all disabled:opacity-50 cursor-pointer"
                            >
                                <Send size={15} />
                                <span>Publicar / Programar Ahora</span>
                            </button>
                        </div>

                        {publishStatus && (
                            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2">
                                <CheckCircle2 size={16} />
                                <span>{publishStatus}</span>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    )
}
