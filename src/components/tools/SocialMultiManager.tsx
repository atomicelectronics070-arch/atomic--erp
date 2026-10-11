"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Share2, Plus, Trash2, CheckCircle2, Instagram, 
    Facebook, Video, Sparkles, Send, Calendar, Clock, 
    Layers, ExternalLink, Image as ImageIcon, Copy,
    Youtube, Eye, Check, AlertCircle, HelpCircle,
    Sliders, Smartphone, Play, MessageSquare, Flame, CheckCheck
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

interface ScheduledPost {
    id: string
    title: string
    content: string
    platforms: string[]
    postType: "short" | "video" | "post" | "community"
    scheduledDate: string
    status: "SCHEDULED" | "PUBLISHED" | "PENDING_TOKEN"
    mediaUrl?: string
}

export default function SocialMultiManager() {
    const [accounts, setAccounts] = useState<SocialAccount[]>([
        { id: "a1", platform: "tiktok", handle: "@atomic_ecuador_oficial", followers: "24.5K", purpose: "Demos de Seguridad y Virales", isActive: true },
        { id: "a2", platform: "instagram", handle: "@atomic.electronics.ec", followers: "18.9K", purpose: "Catálogo y Proformas Directas", isActive: true },
        { id: "a3", platform: "facebook", handle: "ATOMIC Electronics Ecuador", followers: "42.1K", purpose: "Comunidad y Pauta Publicitaria", isActive: true },
        { id: "a4", platform: "youtube", handle: "ATOMIC Soluciones Tech", followers: "8.7K", purpose: "YouTube Shorts y Reviews 4K", isActive: true }
    ])

    // Multi-account selection state
    const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>(["a1", "a2", "a3", "a4"])
    
    // Composer Form State
    const [title, setTitle] = useState("")
    const [postText, setPostText] = useState("")
    const [hashtags, setHashtags] = useState("#AtomicEcuador #Seguridad #SmartHome #Tecnologia #Quito")
    const [mediaUrl, setMediaUrl] = useState("")
    const [postType, setPostType] = useState<"short" | "video" | "post" | "community">("short")
    const [scheduledDate, setScheduledDate] = useState("")
    const [isPublishing, setIsPublishing] = useState(false)
    const [publishStatus, setPublishStatus] = useState<any | null>(null)

    // Preview Platform Tab
    const [previewPlatform, setPreviewPlatform] = useState<"tiktok" | "instagram" | "facebook" | "youtube">("youtube")

    // AI Copy Mode
    const [isGeneratingCopy, setIsGeneratingCopy] = useState(false)
    const [aiCopyStyle, setAiCopyStyle] = useState<"viral" | "youtube_seo" | "ecommerce" | "tech_review">("youtube_seo")

    // Scheduled Queue
    const [scheduledQueue, setScheduledQueue] = useState<ScheduledPost[]>([
        {
            id: "sched_1",
            title: "Cerradura Biométrica Smart ATOMIC V4",
            content: "¡Olvídate de las llaves! Desbloqueo por huella, tarjeta NFC y app móvil.",
            platforms: ["youtube", "tiktok", "instagram"],
            postType: "short",
            scheduledDate: new Date(Date.now() + 3600000 * 4).toISOString(),
            status: "SCHEDULED"
        }
    ])

    // Guide Modal
    const [showApiGuideModal, setShowApiGuideModal] = useState(false)

    // Helper toggle account
    const toggleAccount = (id: string) => {
        setSelectedAccountIds(prev => 
            prev.includes(id) 
                ? (prev.length > 1 ? prev.filter(x => x !== id) : prev) 
                : [...prev, id]
        )
    }

    const selectAllAccounts = () => {
        if (selectedAccountIds.length === accounts.length) {
            setSelectedAccountIds(["a4"]) // keep at least YouTube
        } else {
            setSelectedAccountIds(accounts.map(a => a.id))
        }
    }

    // AI Copywriter
    const handleGenerateAiCopy = () => {
        setIsGeneratingCopy(true)
        setTimeout(() => {
            if (aiCopyStyle === "youtube_seo") {
                setTitle("CÓMO INSTALAR UNA CERRADURA INTELIGENTE EN 5 MINUTOS 🔒 (Tutorial Completo 2026)")
                setPostText(
                    "En este video te mostramos el paso a paso exacto para instalar y configurar la nueva cerradura biométrica ATOMIC.\n\n" +
                    "⏱️ MARCAS DE TIEMPO:\n" +
                    "00:00 - Introducción y Unboxing\n" +
                    "01:15 - Desmontaje de cerradura anterior\n" +
                    "02:40 - Calibración del pestillo y huella\n" +
                    "04:10 - Vinculación con WiFi y App Móvil\n\n" +
                    "📦 Envíos seguros a todo el Ecuador. Solicita tu cotización oficial en www.atomiccotizador.shop"
                )
                setHashtags("#Shorts #YouTubeShorts #Tutorial #CerraduraInteligente #AtomicEcuador #SeguridadHogar")
                setPostType("video")
            } else if (aiCopyStyle === "viral") {
                setTitle("POV: Cambiaste todas las cerraduras de tu casa por huella digital 🤯")
                setPostText(
                    "¡Nunca más te quedas afuera sin llaves! 🚨\n" +
                    "Controla los accesos desde tu teléfono, genera claves temporales para visitas y recibe alertas de intrusión en tiempo real. 📲⚡\n\n" +
                    "Comenta 'SEGURIDAD' para enviarte la proforma con descuento directo de fábrica."
                )
                setHashtags("#TikTokMadeMeBuyIt #HogarInteligente #Seguridad #AtomicEcuador #Viral #LifeHack")
                setPostType("short")
            } else if (aiCopyStyle === "ecommerce") {
                setTitle("OFERTA FLASH: Kit de Cámaras de Seguridad 4K + Instalación")
                setPostText(
                    "Protege tu negocio con resolución Ultra HD y visión nocturna a color. 🛡️\n\n" +
                    "✅ Monitoreo 24/7 sin pagos mensuales.\n" +
                    "✅ Audio bidireccional y sirena disuasiva.\n" +
                    "✅ Garantía oficial de 1 año con soporte técnico.\n\n" +
                    "Pide tu cotización con asesoría técnica por WhatsApp al 0969043453."
                )
                setHashtags("#OfertasEcuador #CamarasDeSeguridad #CCTV #AtomicSolutions #Guayaquil #Quito")
                setPostType("post")
            }
            setIsGeneratingCopy(false)
        }, 900)
    }

    // Multi-Publish Action
    const handlePublish = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!postText.trim() && !title.trim()) return

        const targetPlatforms = accounts
            .filter(a => selectedAccountIds.includes(a.id))
            .map(a => a.platform)

        setIsPublishing(true)
        setPublishStatus(null)

        try {
            const res = await fetch("/api/social/publish", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    platforms: targetPlatforms,
                    title,
                    content: postText,
                    hashtags,
                    mediaUrl,
                    postType,
                    scheduledDate: scheduledDate || null
                })
            })

            const data = await res.json()

            if (data.success) {
                setPublishStatus({
                    success: true,
                    isScheduled: data.isScheduled,
                    summary: data.summary,
                    results: data.results
                })

                if (data.isScheduled) {
                    setScheduledQueue(prev => [
                        {
                            id: `sched_${Date.now()}`,
                            title: title || postText.slice(0, 30),
                            content: postText,
                            platforms: targetPlatforms,
                            postType,
                            scheduledDate: scheduledDate,
                            status: "SCHEDULED",
                            mediaUrl
                        },
                        ...prev
                    ])
                }
            } else {
                setPublishStatus({
                    success: false,
                    error: data.error || "Error al despachar la publicación multired."
                })
            }
        } catch (err: any) {
            setPublishStatus({
                success: false,
                error: "Error de red al conectar con el publicador automático."
            })
        } finally {
            setIsPublishing(false)
        }
    }

    return (
        <div className="w-full h-full flex flex-col space-y-6 text-white font-sans">
            {/* Header / Command Bar */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-slate-900/90 p-5 rounded-3xl border border-slate-800 shadow-xl">
                <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-600 via-rose-600 to-red-600 flex items-center justify-center text-white shadow-[0_0_25px_rgba(236,72,153,0.35)] shrink-0">
                        <Share2 size={24} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg font-black text-white">Publicador Automático Multiredes PRO</h3>
                            <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-pink-500/10 text-pink-400 border border-pink-500/30 rounded-full">
                                YOUTUBE + META + TIKTOK
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">
                            Publicación y programación simultánea con adaptación inteligente por plataforma.
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setShowApiGuideModal(true)}
                        className="px-3.5 py-2 bg-slate-950 border border-slate-700 hover:border-slate-500 text-slate-300 font-mono font-bold text-xs rounded-xl flex items-center gap-2 transition-all cursor-pointer"
                    >
                        <HelpCircle size={15} className="text-cyan-400" />
                        <span>Paso a Paso de Conexión Real</span>
                    </button>
                    <button
                        type="button"
                        onClick={selectAllAccounts}
                        className="px-3.5 py-2 bg-pink-500/10 border border-pink-500/30 text-pink-300 hover:bg-pink-500/20 font-mono font-bold text-xs rounded-xl flex items-center gap-2 transition-all cursor-pointer"
                    >
                        <CheckCheck size={15} />
                        <span>{selectedAccountIds.length === accounts.length ? "Desmarcar Todo" : "Publicar en Todas (1-Clic)"}</span>
                    </button>
                </div>
            </div>

            {/* Platform Multi-Selector Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {accounts.map(acc => {
                    const isSelected = selectedAccountIds.includes(acc.id)
                    return (
                        <button
                            key={acc.id}
                            type="button"
                            onClick={() => toggleAccount(acc.id)}
                            className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                                isSelected
                                    ? "bg-slate-900 border-pink-500/60 shadow-[0_0_15px_rgba(236,72,153,0.2)]"
                                    : "bg-slate-950/70 border-slate-800 opacity-60 hover:opacity-100"
                            }`}
                        >
                            <div className="flex items-center gap-2.5">
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                                    acc.platform === "youtube" ? "bg-red-500/20 text-red-400 border border-red-500/30" :
                                    acc.platform === "tiktok" ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" :
                                    acc.platform === "instagram" ? "bg-pink-500/20 text-pink-400 border border-pink-500/30" :
                                    "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                                }`}>
                                    {acc.platform === "youtube" && <Youtube size={18} />}
                                    {acc.platform === "tiktok" && <Video size={18} />}
                                    {acc.platform === "instagram" && <Instagram size={18} />}
                                    {acc.platform === "facebook" && <Facebook size={18} />}
                                </div>
                                <div className="min-w-0">
                                    <div className="text-xs font-bold text-white truncate">{acc.handle}</div>
                                    <div className="text-[10px] text-slate-400 font-mono uppercase">{acc.platform}</div>
                                </div>
                            </div>
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                isSelected ? "bg-pink-500 border-pink-500 text-white" : "border-slate-700"
                            }`}>
                                {isSelected && <Check size={10} />}
                            </div>
                        </button>
                    )
                })}
            </div>

            {/* Main Studio: Left Composer (7 cols), Right Live Preview (5 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Composer Form */}
                <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-5">
                    {/* Format Type Selector */}
                    <div className="space-y-2">
                        <label className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
                            Formato de Publicación:
                        </label>
                        <div className="grid grid-cols-4 gap-2 text-xs font-bold">
                            {[
                                { id: "short", label: "Short / Reel / TikTok", icon: Smartphone },
                                { id: "video", label: "Video YouTube (16:9)", icon: Youtube },
                                { id: "post", label: "Post / Imagen", icon: ImageIcon },
                                { id: "community", label: "Comunidad / Texto", icon: MessageSquare },
                            ].map(t => (
                                <button
                                    key={t.id}
                                    type="button"
                                    onClick={() => setPostType(t.id as any)}
                                    className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                                        postType === t.id
                                            ? "bg-pink-500/20 border-pink-500/50 text-pink-300"
                                            : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                                    }`}
                                >
                                    <t.icon size={16} />
                                    <span className="text-[10px] leading-tight line-clamp-1">{t.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* AI Copywriter Bar */}
                    <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <Sparkles size={16} className="text-cyan-400" />
                            <span className="text-xs font-bold text-slate-300">Asistente IA de Redacción:</span>
                            <select
                                value={aiCopyStyle}
                                onChange={(e) => setAiCopyStyle(e.target.value as any)}
                                className="bg-slate-900 border border-slate-800 text-cyan-300 text-xs rounded-lg px-2.5 py-1 focus:outline-none"
                            >
                                <option value="youtube_seo">YouTube SEO & Marcas de Tiempo</option>
                                <option value="viral">Viral TikTok / Hook Inicial</option>
                                <option value="ecommerce">Promoción / Llamado a WhatsApp</option>
                            </select>
                        </div>

                        <button
                            type="button"
                            onClick={handleGenerateAiCopy}
                            disabled={isGeneratingCopy}
                            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-black font-black text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer disabled:opacity-50"
                        >
                            <Sparkles size={13} className={isGeneratingCopy ? "animate-spin" : ""} />
                            <span>{isGeneratingCopy ? "Generando..." : "Autogenerar Copy"}</span>
                        </button>
                    </div>

                    <form onSubmit={handlePublish} className="space-y-4 font-mono text-xs">
                        {/* Title (for YouTube and Facebook) */}
                        <div>
                            <label className="text-slate-400 font-bold block mb-1">
                                TÍTULO DEL VIDEO / PUBLICACIÓN (Crucial para YouTube):
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Ej: Cerradura Inteligente ATOMIC V4 con Huella y WiFi (Review 2026)"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-pink-500 transition-colors"
                            />
                        </div>

                        {/* Caption / Description */}
                        <div>
                            <label className="text-slate-400 font-bold block mb-1">
                                DESCRIPCIÓN O CAPTION PRINCIPAL:
                            </label>
                            <textarea
                                value={postText}
                                onChange={(e) => setPostText(e.target.value)}
                                placeholder="Escribe el copy de tu publicación, links, llamados a la acción o usa el generador con IA..."
                                rows={6}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-white font-sans text-xs focus:outline-none focus:border-pink-500 transition-colors resize-none leading-relaxed"
                            />
                        </div>

                        {/* Hashtags & Tags */}
                        <div>
                            <label className="text-slate-400 font-bold block mb-1">
                                HASHTAGS & ETIQUETAS DE BÚSQUEDA:
                            </label>
                            <input
                                type="text"
                                value={hashtags}
                                onChange={(e) => setHashtags(e.target.value)}
                                placeholder="#Shorts #AtomicEcuador #Seguridad #SmartHome"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-pink-300 focus:outline-none focus:border-pink-500"
                            />
                        </div>

                        {/* Media URL / Asset */}
                        <div>
                            <label className="text-slate-400 font-bold block mb-1">
                                URL DE MULTIMEDIA / VIDEO / MINIATURA (Opcional):
                            </label>
                            <input
                                type="text"
                                value={mediaUrl}
                                onChange={(e) => setMediaUrl(e.target.value)}
                                placeholder="https://atomiccotizador.shop/media/demo_cerradura.mp4"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-300 focus:outline-none focus:border-pink-500"
                            />
                        </div>

                        {/* Schedule & Submit Row */}
                        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-slate-800">
                            <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
                                <Calendar size={15} className="text-cyan-400" />
                                <span className="text-slate-400 text-[11px]">Programar Lanzamiento:</span>
                                <input
                                    type="datetime-local"
                                    value={scheduledDate}
                                    onChange={(e) => setScheduledDate(e.target.value)}
                                    className="bg-transparent text-slate-200 text-xs focus:outline-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isPublishing || (!title.trim() && !postText.trim())}
                                className="py-3 px-6 bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 hover:from-pink-500 hover:to-red-500 text-white font-black uppercase tracking-wider text-xs rounded-xl shadow-[0_0_20px_rgba(236,72,153,0.3)] flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                            >
                                <Send size={15} />
                                <span>{isPublishing ? "Despachando a Redes..." : (scheduledDate ? "Programar en Cola Automática" : "Publicar Ahora en Todas")}</span>
                            </button>
                        </div>

                        {/* Result Notification */}
                        {publishStatus && (
                            <div className={`p-4 rounded-2xl border text-xs font-mono space-y-2 ${
                                publishStatus.success 
                                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                                    : "bg-rose-500/10 border-rose-500/30 text-rose-300"
                            }`}>
                                <div className="flex items-center gap-2 font-bold">
                                    {publishStatus.success ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                                    <span>{publishStatus.summary || publishStatus.error}</span>
                                </div>
                                {publishStatus.results && (
                                    <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                                        {publishStatus.results.map((r: any, idx: number) => (
                                            <div key={idx} className="bg-black/30 p-2 rounded-lg border border-white/5">
                                                <div className="font-bold text-white">{r.platform} ({r.type})</div>
                                                <div className="text-slate-300 text-[10px]">{r.message}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </form>
                </div>

                {/* Right: Live Preview Studio & Scheduled Queue */}
                <div className="lg:col-span-5 space-y-6">
                    {/* Live Preview Container */}
                    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <div className="flex items-center gap-2">
                                <Eye size={16} className="text-pink-400" />
                                <span className="text-xs font-bold text-white uppercase tracking-wider">Previsualización en Vivo:</span>
                            </div>
                            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                                {(["youtube", "tiktok", "instagram", "facebook"] as const).map(p => (
                                    <button
                                        key={p}
                                        type="button"
                                        onClick={() => setPreviewPlatform(p)}
                                        className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase transition-all cursor-pointer ${
                                            previewPlatform === p 
                                                ? "bg-pink-500 text-white" 
                                                : "text-slate-400 hover:text-white"
                                        }`}
                                    >
                                        {p === "youtube" ? "YT" : p === "tiktok" ? "TK" : p === "instagram" ? "IG" : "FB"}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Device Frame */}
                        <div className="bg-black border border-slate-800 rounded-2xl p-4 min-h-[320px] flex flex-col justify-between text-xs font-sans">
                            {previewPlatform === "youtube" && (
                                <div className="space-y-3">
                                    {/* YouTube Player Mock */}
                                    <div className="w-full aspect-video bg-slate-900 rounded-xl relative flex items-center justify-center border border-slate-800 overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                        <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white shadow-lg cursor-pointer">
                                            <Play size={20} className="ml-1" />
                                        </div>
                                        <div className="absolute bottom-2 left-2 right-2 flex justify-between text-[10px] text-white font-mono">
                                            <span>0:00 / 3:45</span>
                                            <span className="bg-black/60 px-1.5 py-0.5 rounded">4K 60FPS</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-sm line-clamp-2">
                                            {title || "Título del video en YouTube (Optimizado para SEO)"}
                                        </h4>
                                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-1">
                                            <span className="font-bold text-white">ATOMIC Soluciones Tech</span>
                                            <span>• 1.2K vistas • Hace 5 min</span>
                                        </div>
                                        <p className="text-[11px] text-slate-300 mt-2 line-clamp-3 whitespace-pre-line leading-relaxed">
                                            {postText || "Aquí aparecerá la descripción con enlaces, marcas de tiempo y llamados a la acción..."}
                                        </p>
                                        <div className="text-[10px] text-blue-400 font-mono mt-1.5">{hashtags}</div>
                                    </div>
                                </div>
                            )}

                            {previewPlatform === "tiktok" && (
                                <div className="h-[360px] bg-slate-950 rounded-xl p-4 flex flex-col justify-between border border-slate-800 relative overflow-hidden">
                                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                                        <span>Siguiendo</span>
                                        <span className="font-bold text-white border-b-2 border-white pb-0.5">Para ti</span>
                                        <span>🔍</span>
                                    </div>
                                    <div className="space-y-2 mt-auto">
                                        <div className="font-bold text-white text-xs">@atomic_ecuador_oficial</div>
                                        <p className="text-white text-[11px] line-clamp-3 leading-snug">
                                            {title ? `🔥 ${title} - ` : ""}{postText || "El gancho viral del video aparecerá aquí con los hashtags para posicionarse en el feed..."}
                                        </p>
                                        <div className="text-cyan-300 text-[10px] font-mono">{hashtags}</div>
                                        <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
                                            <span>🎵</span> <span>Sonido original - ATOMIC Trend 2026</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {previewPlatform === "instagram" && (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-yellow-500 to-pink-600 p-[1.5px]">
                                                <div className="w-full h-full bg-black rounded-full flex items-center justify-center text-[10px] font-bold">A</div>
                                            </div>
                                            <span className="font-bold text-xs text-white">atomic.electronics.ec</span>
                                        </div>
                                        <span className="text-slate-400">•••</span>
                                    </div>
                                    <div className="w-full aspect-square bg-slate-900 rounded-xl flex items-center justify-center border border-slate-800 text-slate-500">
                                        <ImageIcon size={32} />
                                    </div>
                                    <div className="text-[11px] text-slate-200">
                                        <span className="font-bold text-white mr-1.5">atomic.electronics.ec</span>
                                        <span className="line-clamp-3">{postText || "Tu caption de Instagram con detalles de producto..."}</span>
                                        <div className="text-blue-400 text-[10px] mt-1">{hashtags}</div>
                                    </div>
                                </div>
                            )}

                            {previewPlatform === "facebook" && (
                                <div className="space-y-2.5">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-xs">A</div>
                                        <div>
                                            <div className="font-bold text-xs text-white">ATOMIC Electronics Ecuador</div>
                                            <div className="text-[9px] text-slate-400 font-mono">Publicado por ATOMIC Bot • 🌐 Público</div>
                                        </div>
                                    </div>
                                    <div className="text-[11px] text-slate-200 line-clamp-4 leading-relaxed">
                                        {postText || "El texto de la publicación de tu Fan Page con llamados a contactar por WhatsApp..."}
                                    </div>
                                    <div className="w-full h-32 bg-slate-900 rounded-xl flex items-center justify-center border border-slate-800 text-slate-500 text-xs">
                                        Banner / Video Corporativo
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Scheduled Queue Box */}
                    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                            <div className="flex items-center gap-2">
                                <Clock size={16} className="text-cyan-400" />
                                <span className="text-xs font-bold text-white uppercase tracking-wider">Cola de Programaciones:</span>
                            </div>
                            <span className="text-[10px] font-mono bg-cyan-500/10 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/30">
                                {scheduledQueue.length} Pendientes
                            </span>
                        </div>

                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {scheduledQueue.map(item => (
                                <div key={item.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs space-y-1">
                                    <div className="flex justify-between items-start">
                                        <span className="font-bold text-white line-clamp-1">{item.title}</span>
                                        <span className="text-[9px] font-mono text-pink-400 font-bold bg-pink-500/10 px-2 py-0.5 rounded">
                                            {item.status}
                                        </span>
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-mono">
                                        Canales: {item.platforms.join(", ").toUpperCase()}
                                    </div>
                                    <div className="text-[10px] text-emerald-400 font-mono">
                                        Disparo: {new Date(item.scheduledDate).toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Guide Modal: Paso a Paso para Conectar APIs Reales */}
            <AnimatePresence>
                {showApiGuideModal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[110]"
                            onClick={() => setShowApiGuideModal(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed inset-0 z-[120] flex items-center justify-center p-4 pointer-events-none"
                        >
                            <div className="bg-[#0b0e14] border border-slate-700 rounded-3xl p-6 shadow-2xl max-w-2xl w-full pointer-events-auto text-white max-h-[85vh] overflow-y-auto space-y-5">
                                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                                            <Sliders size={20} />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-black text-white">Guía Oficial: Conexión Real de Redes Sociales</h3>
                                            <p className="text-[11px] text-slate-400 font-mono">YouTube, Instagram, Facebook y TikTok de verdad</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowApiGuideModal(false)}
                                        className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
                                    >
                                        ✕
                                    </button>
                                </div>

                                <div className="space-y-4 text-xs leading-relaxed font-sans">
                                    {/* YouTube */}
                                    <div className="bg-slate-950 p-4 rounded-2xl border border-red-500/30 space-y-2">
                                        <div className="flex items-center gap-2 font-black text-red-400">
                                            <Youtube size={16} /> 1. Conectar YouTube de verdad (Google Cloud)
                                        </div>
                                        <ol className="list-decimal pl-4 space-y-1 text-slate-300 text-[11px]">
                                            <li>Ingresa a <b>console.cloud.google.com</b> con tu cuenta de Google del canal.</li>
                                            <li>Crea un proyecto (ej. <i>ATOMIC Social Ops</i>) y busca en la biblioteca: <b>YouTube Data API v3</b>.</li>
                                            <li>Haz clic en <b>Habilitar</b>.</li>
                                            <li>En <b>Credenciales</b>, crea un <i>ID de cliente de OAuth 2.0</i> (Tipo: Aplicación Web).</li>
                                            <li>Agrega el alcance (Scope): <code className="text-yellow-300">https://www.googleapis.com/auth/youtube.upload</code>.</li>
                                            <li>Guarda tu <b>Client ID</b> y <b>Client Secret</b> para permitir subidas automáticas de Shorts y Videos.</li>
                                        </ol>
                                    </div>

                                    {/* Meta: Instagram & Facebook */}
                                    <div className="bg-slate-950 p-4 rounded-2xl border border-pink-500/30 space-y-2">
                                        <div className="flex items-center gap-2 font-black text-pink-400">
                                            <Instagram size={16} /> 2. Conectar Instagram y Facebook (Meta Graph API)
                                        </div>
                                        <ol className="list-decimal pl-4 space-y-1 text-slate-300 text-[11px]">
                                            <li>Ingresa a <b>developers.facebook.com</b> e inicia sesión con tu cuenta administradora de Meta.</li>
                                            <li>Crea una App de tipo <b>Empresarial / Otros</b>.</li>
                                            <li>Asegúrate de que tu cuenta de Instagram sea <b>Profesional (Creador o Empresa)</b> y esté vinculada a tu Fan Page de Facebook en Meta Business Suite.</li>
                                            <li>En el <i>Explorador de la Graph API</i> o en <i>Usuarios del Sistema</i>, genera un <b>Token de Acceso Permanente</b> con los siguientes permisos:
                                                <div className="font-mono text-[10px] text-cyan-300 mt-1">
                                                    • pages_show_list • pages_manage_posts • instagram_basic • instagram_content_publish
                                                </div>
                                            </li>
                                        </ol>
                                    </div>

                                    {/* TikTok */}
                                    <div className="bg-slate-950 p-4 rounded-2xl border border-cyan-500/30 space-y-2">
                                        <div className="flex items-center gap-2 font-black text-cyan-400">
                                            <Video size={16} /> 3. Conectar TikTok (TikTok for Developers)
                                        </div>
                                        <ol className="list-decimal pl-4 space-y-1 text-slate-300 text-[11px]">
                                            <li>Ingresa a <b>developers.tiktok.com</b> y registra tu cuenta.</li>
                                            <li>Crea una aplicación y selecciona el producto <b>Content Posting API</b>.</li>
                                            <li>Obtén tu <b>Client Key</b> y <b>Client Secret</b> con permisos de subida de video (<code className="text-yellow-300">video.publish</code>).</li>
                                        </ol>
                                    </div>
                                </div>

                                <div className="pt-2 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setShowApiGuideModal(false)}
                                        className="py-2.5 px-5 bg-gradient-to-r from-cyan-500 to-indigo-600 font-black text-black text-xs rounded-xl"
                                    >
                                        Entendido, Volver al Publicador
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}
