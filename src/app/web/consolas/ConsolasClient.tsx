"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Shield, Search, Star, CheckCircle2, ArrowRight, Send, Store, 
    ShoppingBag, Clock, Award, Gamepad2, Wrench, Tag, MessageCircle,
    Cpu, Zap, Sparkles, Check, X, ThumbsUp, ShieldCheck, Flame, Scale, ChevronRight
} from "lucide-react"
import Link from "next/link"

const WHATSAPP_NUMBER = "0969043453"

function SafeImage({ src, alt, className }: { src: string, alt: string, className?: string }) {
    const [error, setError] = useState(false)
    if (!src || error) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-500 p-4">
                <Gamepad2 size={32} className="mb-2 opacity-50" />
                <span className="text-[10px] font-mono uppercase tracking-widest">ATOMIC Gaming</span>
            </div>
        )
    }

    let parsedSrc = src
    if (src.startsWith('[')) {
        try {
            const arr = JSON.parse(src)
            if (arr.length > 0) parsedSrc = arr[0]
        } catch (e) {}
    }

    return (
        <img 
            src={parsedSrc} 
            alt={alt} 
            onError={() => setError(true)}
            className={className} 
        />
    )
}

export default function ConsolasClient({ dbProducts }: { dbProducts: any[] }) {
    const [filter, setFilter] = useState<"all" | "ps5" | "ps4" | "accessories">("all")
    const [searchTerm, setSearchTerm] = useState("")

    const filteredProducts = dbProducts.filter(p => {
        const text = `${p.name} ${p.description || ''} ${p.category?.name || ''}`.toLowerCase()
        if (searchTerm) {
            if (!text.includes(searchTerm.toLowerCase())) return false
        }
        if (filter === "ps5") return text.includes("ps5") || text.includes("playstation 5")
        if (filter === "ps4") return text.includes("ps4") || text.includes("playstation 4")
        if (filter === "accessories") return text.includes("volante") || text.includes("joystick") || text.includes("arcade") || text.includes("headset") || text.includes("audifono") || text.includes("estuche") || text.includes("ssd")
        return true
    })

    return (
        <div className="font-sans text-slate-100 bg-[#020617] selection:bg-cyan-500/30 selection:text-white overflow-x-hidden min-h-screen">
            {/* Header Nav */}
            <nav className="w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
                <Link href="/web" className="flex items-center gap-2 text-white font-black text-lg tracking-wider">
                    <span className="w-7 h-7 rounded-lg bg-cyan-500 text-slate-950 flex items-center justify-center text-sm font-black">A</span>
                    <span>ATOMIC <span className="text-cyan-400 font-mono text-xs">CONSOLAS</span></span>
                </Link>
                <div className="flex items-center gap-4 text-xs font-bold font-mono">
                    <Link href="/links" className="text-slate-400 hover:text-white transition-colors">Categorías</Link>
                    <a 
                        href={`https://wa.me/593969043453?text=Hola%20ATOMIC%2C%20quisiera%20cotizar%20consolas%20de%20videojuegos`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl flex items-center gap-2 transition-all font-black"
                    >
                        <MessageCircle size={14} /> WhatsApp Directo
                    </a>
                </div>
            </nav>

            {/* ── BANNER HERO PRINCIPAL ── */}
            <section className="relative flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-950 via-[#030712] to-[#020617] border-b border-slate-800/80">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[160px] pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[160px] pointer-events-none" />

                <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 text-center space-y-6">
                    <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                        CATÁLOGO OFICIAL DE CONSOLAS Y GAMING ATOMIC
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black text-white leading-[1.08] tracking-tight">
                        Consolas de Videojuegos <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 drop-shadow-[0_0_25px_rgba(6,182,212,0.4)]">
                            PlayStation & Retro Gaming
                        </span>
                    </h1>

                    <p className="text-slate-300 text-sm md:text-base max-w-2xl font-light leading-relaxed mx-auto">
                        Explora todas las consolas <strong className="text-cyan-300 font-bold">PlayStation 5, PS4 Slim/Pro, Pandora Arcade y accesorios de simulación</strong> certificadas con garantía por escrito de ATOMIC.
                    </p>

                    {/* Filter Tabs */}
                    <div className="pt-6 flex flex-wrap items-center justify-center gap-3">
                        <button 
                            onClick={() => setFilter("all")}
                            className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all ${filter === "all" ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700'}`}
                        >
                            🎮 TODAS ({dbProducts.length})
                        </button>
                        <button 
                            onClick={() => setFilter("ps5")}
                            className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all ${filter === "ps5" ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700'}`}
                        >
                            ⚡ PLAYSTATION 5
                        </button>
                        <button 
                            onClick={() => setFilter("ps4")}
                            className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all ${filter === "ps4" ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700'}`}
                        >
                            📦 PLAYSTATION 4
                        </button>
                        <button 
                            onClick={() => setFilter("accessories")}
                            className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all ${filter === "accessories" ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700'}`}
                        >
                            🕹️ ACCESORIOS & ARCADE
                        </button>
                    </div>

                    {/* Search bar */}
                    <div className="max-w-md mx-auto relative pt-2">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar consola, mando, modelo..."
                            className="w-full pl-11 pr-4 py-3 bg-slate-900/90 border border-slate-800 rounded-xl text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-all"
                        />
                    </div>
                </div>
            </section>

            {/* ── LISTADO DE PRODUCTOS ── */}
            <section className="py-16 px-6 max-w-7xl mx-auto space-y-8">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                    <h2 className="text-xl font-extrabold text-white uppercase tracking-tight flex items-center gap-2">
                        <Gamepad2 className="text-cyan-400" size={20} />
                        Catálogo de Consolas Registradas ({filteredProducts.length})
                    </h2>
                    <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full">
                        Precios Actualizados PVP
                    </span>
                </div>

                {filteredProducts.length === 0 ? (
                    <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-slate-800">
                        <p className="text-sm font-mono text-slate-400">No se encontraron productos en esta subcategoría</p>
                        <button onClick={() => { setFilter("all"); setSearchTerm(""); }} className="mt-4 px-6 py-2 bg-cyan-500 text-slate-950 font-bold text-xs rounded-xl">
                            Ver Todos los Productos
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProducts.map((p) => {
                            const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=Hola%20ATOMIC%2C%20quisiera%20consultar%20por%20la%20consola%3A%20${encodeURIComponent(p.name)}`
                            return (
                                <div 
                                    key={p.id}
                                    className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 group hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]"
                                >
                                    <div className="space-y-4">
                                        <div className="aspect-video bg-slate-950 rounded-xl overflow-hidden p-4 flex items-center justify-center relative border border-slate-800/60">
                                            <SafeImage 
                                                src={p.images} 
                                                alt={p.name} 
                                                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" 
                                            />
                                        </div>

                                        <div>
                                            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block mb-1">
                                                {p.category?.name || 'Consolas & Video Juegos'}
                                            </span>
                                            <h3 className="text-sm font-bold text-white leading-snug group-hover:text-cyan-300 transition-colors">
                                                {p.name}
                                            </h3>
                                            {p.description && (
                                                <p className="text-[11px] text-slate-400 font-light mt-1 line-clamp-2 leading-relaxed">
                                                    {p.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                                        <div>
                                            <span className="text-[9px] font-mono text-slate-500 uppercase block">Precio Público</span>
                                            <span className="text-xl font-black font-mono text-cyan-400">
                                                ${Number(p.price).toFixed(2)}
                                            </span>
                                        </div>

                                        <a 
                                            href={waLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500 border border-cyan-500/40 text-cyan-300 hover:text-slate-950 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5"
                                        >
                                            <MessageCircle size={14} /> Cotizar
                                        </a>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </section>

            {/* Footer */}
            <footer className="w-full border-t border-slate-800 py-8 text-center text-xs font-mono text-slate-500">
                ATOMIC INDUSTRIES — CATÁLOGO COMERCIAL DE CONSOLAS Y ENTRETENIMIENTO
            </footer>
        </div>
    )
}
