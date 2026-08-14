"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, ChevronLeft, ChevronRight, Smartphone, Tablet, Zap, Shield, Sparkles, Check, MessageCircle } from "lucide-react"
import { calculateDiscountedPrice } from "@/lib/utils/pricing"
import { motion } from "framer-motion"

const safeParseArray = (str: any, fallback: any = []) => {
    if (!str || str === 'null' || str === '[]' || str === '') return fallback;
    if (Array.isArray(str)) return str.length > 0 ? str : fallback;
    if (typeof str === 'string') {
        const trimmed = str.trim();
        if (trimmed.startsWith('http') || trimmed.startsWith('/') || trimmed.startsWith('data:image')) return [trimmed];
        try {
            let cleaned = trimmed;
            if (cleaned.startsWith('"') && cleaned.endsWith('"')) cleaned = cleaned.substring(1, cleaned.length - 1).replace(/\\"/g, '"');
            let parsed = JSON.parse(cleaned);
            if (typeof parsed === 'string') { try { parsed = JSON.parse(parsed); } catch(e) {} }
            if (Array.isArray(parsed)) return parsed.length > 0 ? parsed : fallback;
            if (typeof parsed === 'string' && parsed.length > 0) return [parsed];
        } catch (e) {
            const urlRegex = /(https?:\/\/[^\s"\]]+)/g;
            const matches = trimmed.match(urlRegex);
            if (matches && matches.length > 0) return matches;
        }
    }
    return fallback;
};

export default function MobileBlogPage() {
    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("TODOS")
    const [userRole, setUserRole] = useState<string | undefined>()

    useEffect(() => {
        const init = async () => {
            setLoading(true)
            try {
                const [pRes, sRes] = await Promise.all([
                    fetch("/api/web/phones").then(r => r.json()),
                    fetch("/api/auth/session").then(r => r.json()).catch(() => null)
                ])
                setProducts(pRes.products || [])
                if (sRes?.user?.role) setUserRole(sRes.user.role)
            } catch(e) {
                console.error(e)
            }
            setLoading(false)
        }
        init()
    }, [])

    const filtered = useMemo(() => {
        let p = products

        if (search) {
            const q = search.toLowerCase().trim()
            p = p.filter(x => x.name.toLowerCase().includes(q) || x.description?.toLowerCase().includes(q))
        }

        if (selectedCategoryFilter !== "TODOS") {
            const catQ = selectedCategoryFilter.toLowerCase()
            p = p.filter(x => x.name.toLowerCase().includes(catQ) || x.category?.name?.toLowerCase().includes(catQ))
        }

        return p.sort((a, b) => a.name.localeCompare(b.name))
    }, [products, search, selectedCategoryFilter])

    if (loading) return (
        <div className="min-h-screen bg-[#05070c] text-white flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin h-10 w-10 border-4 border-[#ff5733] border-t-transparent rounded-full shadow-[0_0_15px_#ff5733]" />
                <p className="text-xs font-mono font-black text-cyan-300 uppercase tracking-[0.3em]">Cargando Catálogo Móvil & Tablets...</p>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-[#05070c] text-slate-100 font-sans pb-32">
            
            {/* 👑 TOP STANDALONE SLOGAN BAR */}
            <div className="w-full bg-[#080d18] text-cyan-300 text-[11px] font-black uppercase tracking-[0.3em] text-center py-2 px-4 border-b border-blue-500/30 font-mono flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#38bdf8]" />
                TECNOLOGÍA, INDUSTRIA Y HOGAR — ECOSISTEMA MÓVIL & TABLETS 2026
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#38bdf8]" />
            </div>

            {/* 🍅 BRANDED HEADER: LIGHT CORAL TOMATO (#FF5733) */}
            <nav className="sticky top-0 z-50 bg-gradient-to-r from-[#ff6b4a] via-[#ff5733] to-[#ff4136] text-white shadow-xl border-b border-[#e04322] px-4 py-2.5">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                    <Link href="/web" className="flex items-center gap-2 text-white font-bold hover:text-amber-200 transition-colors">
                        <ChevronLeft size={20} />
                        <span className="text-xs font-mono font-black uppercase tracking-wider">Volver a la Tienda</span>
                    </Link>
                    
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Buscar smartphone, tablet, iPhone, Samsung..."
                            className="w-full bg-[#0a0f1d] border border-blue-400/40 text-white placeholder-slate-400 pl-9 pr-4 py-1.5 text-xs rounded-full outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-inner"
                        />
                    </div>
                </div>
            </nav>

            {/* EDITORIAL HERO SECTION */}
            <header className="max-w-7xl mx-auto px-4 md:px-6 pt-8 pb-10">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="space-y-4"
                >
                    <div className="flex items-center gap-3">
                        {/* ULTRA-THIN GOLD BORDER WHITE BOX WITH LUMINOUS ELECTRIC BLUE 3D SHADOW & SILHOUETTE ICON */}
                        <div className="relative">
                            <div className="w-12 h-12 rounded-xl bg-white border border-[#d4af37] shadow-[0_0_22px_rgba(0,102,255,0.6)] flex items-center justify-center text-[#0f172a] relative z-10">
                                <Smartphone size={24} className="text-[#0f172a] stroke-[2.5]" />
                            </div>
                            <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 opacity-70 blur-[8px]" />
                        </div>
                        <div>
                            <span className="text-[10px] font-mono font-black text-cyan-300 bg-blue-950 px-2.5 py-0.5 rounded-full border border-blue-500/40 uppercase tracking-widest">
                                ECOSISTEMA SMARTPHONES & TABLETS
                            </span>
                            <h1 className="text-xl md:text-3xl lg:text-4xl font-black text-white uppercase tracking-tight font-mono mt-1">
                                Tecnología Celular & Tablets de Vanguardia
                            </h1>
                        </div>
                    </div>

                    <p className="text-xs md:text-sm text-slate-300 max-w-3xl leading-relaxed font-medium">
                        Explora nuestra colección de smartphones y tablets. Desde la precisión del ecosistema Apple iPhone e iPad hasta la potencia de Samsung Galaxy, Honor Magic, Xiaomi y Tablets Infantiles Antigolpes con garantía oficial en Ecuador.
                    </p>

                    {/* CATEGORY SELECTOR BADGES */}
                    <div className="flex flex-wrap gap-2 pt-2">
                        {["TODOS", "CELULARES", "TABLETS", "SAMSUNG", "HONOR", "KIDS"].map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategoryFilter(cat)}
                                className={`px-3.5 py-1.5 rounded-xl font-bold text-xs font-mono transition-all border ${
                                    selectedCategoryFilter === cat
                                        ? "bg-[#ff5733] text-white border-[#ff7f66] shadow-[0_0_12px_rgba(255,87,51,0.5)]"
                                        : "bg-[#0e1424] text-slate-300 border-[#1e293b] hover:border-cyan-400 hover:text-white"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </motion.div>
            </header>

            {/* MAIN CATALOG GRID */}
            <main className="max-w-7xl mx-auto px-4 md:px-6 py-6">
                <div className="flex items-center justify-between border-b border-[#1e293b] pb-3 mb-6 font-mono text-xs">
                    <h2 className="font-black text-white uppercase tracking-tight flex items-center gap-2">
                        <Tablet size={16} className="text-cyan-400" />
                        Dispositivos Disponibles
                    </h2>
                    <span className="text-cyan-300 font-bold bg-blue-950 px-2.5 py-0.5 rounded border border-blue-500/30">
                        {filtered.length} Productos
                    </span>
                </div>

                {filtered.length === 0 ? (
                    <div className="py-20 text-center border border-dashed border-[#1e293b] rounded-2xl bg-[#0e1424] p-6 space-y-3">
                        <Smartphone className="w-12 h-12 text-slate-500 mx-auto" strokeWidth={1.5} />
                        <h3 className="text-sm font-bold text-slate-300 uppercase font-mono">No se encontraron dispositivos en esta categoría</h3>
                        <p className="text-xs text-slate-400 max-w-md mx-auto">
                            ¿Buscas un modelo específico como Samsung Tab A9+, iPhone o Tablet Kids? Contáctanos directamente por WhatsApp para importártelo bajo pedido.
                        </p>
                        <button
                            onClick={() => { setSearch(""); setSelectedCategoryFilter("TODOS"); }}
                            className="mt-2 px-4 py-2 bg-[#ff5733] hover:bg-[#e04322] text-white font-bold text-xs uppercase rounded-xl transition-all shadow-md"
                        >
                            Ver Todo el Catálogo
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filtered.map((p, i) => {
                            const imgs = safeParseArray(p.images)
                            const price = calculateDiscountedPrice(p.price, userRole)
                            const displayImg = imgs.length > 0 ? imgs[0] : null

                            return (
                                <motion.div 
                                    key={p.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-30px" }}
                                    transition={{ duration: 0.4, delay: (i % 4) * 0.05 }}
                                    className="bg-[#0e1424] border border-[#1e293b] hover:border-cyan-400/80 rounded-2xl p-4 shadow-xl hover:shadow-[0_0_20px_rgba(0,102,255,0.3)] transition-all flex flex-col justify-between group"
                                >
                                    <div>
                                        {/* PURE WHITE CONTAINER FOR PRODUCT IMAGE WITH ULTRA-THIN GOLD BORDER & SILHOUETTE ICON */}
                                        <div className="relative bg-white rounded-xl overflow-hidden aspect-square mb-3.5 flex items-center justify-center p-4 border border-[#d4af37] shadow-[0_0_15px_rgba(0,102,255,0.4)] group-hover:scale-[1.02] transition-transform duration-300">
                                            {displayImg ? (
                                                <img 
                                                    src={displayImg} 
                                                    alt={p.name} 
                                                    className="max-h-full max-w-full object-contain" 
                                                    referrerPolicy="no-referrer"
                                                />
                                            ) : (
                                                <Smartphone size={48} className="text-[#0f172a] stroke-[1.5]" />
                                            )}
                                        </div>
                                        
                                        <span className="text-[9px] font-mono font-black text-cyan-400 uppercase tracking-widest block mb-1">
                                            {p.category?.name || "TELEFONÍA & TABLETS"}
                                        </span>
                                        <h3 className="text-xs md:text-sm font-bold tracking-tight text-white leading-snug mb-2 line-clamp-2 group-hover:text-cyan-300 transition-colors">
                                            {p.name}
                                        </h3>
                                    </div>

                                    <div className="mt-3 pt-3 border-t border-[#1e293b] space-y-2">
                                        <div className="flex items-baseline justify-between font-mono">
                                            <span className="text-[10px] text-slate-400 uppercase font-bold">Precio Oficial:</span>
                                            <span className="text-base font-black text-cyan-300">${price.toFixed(2)}</span>
                                        </div>

                                        <a
                                            href={`https://wa.me/593969043453?text=${encodeURIComponent(`Hola ATOMIC! Deseo cotizar el dispositivo: ${p.name} ($${price.toFixed(2)})`)}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="w-full py-2 bg-gradient-to-r from-[#0066ff] to-[#1d4ed8] hover:from-[#0052cc] hover:to-[#1e40af] text-white font-bold text-[11px] uppercase rounded-xl transition-all shadow-md text-center flex items-center justify-center gap-1.5"
                                        >
                                            <MessageCircle size={13} /> Cotizar por WhatsApp
                                        </a>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                )}
            </main>
        </div>
    )
}
