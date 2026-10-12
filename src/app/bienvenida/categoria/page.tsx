"use client"

import React, { useState } from "react"
import Link from "next/link"
import { 
    SUICIDE_SQUAD_CATEGORIES, 
    SuicideSquadCategoryLanding 
} from "@/lib/data/suicideSquadCategories"
import { 
    Shield, Search, ExternalLink, ArrowRight, Sparkles, 
    CheckCircle2, DollarSign, Layers, ChevronRight, MessageSquare, 
    Award, Zap, Home, ShoppingCart, Download, RefreshCw 
} from "lucide-react"
import { generateCategoryCatalogPDF } from "@/lib/pdf/categoryCatalogPdf"

export default function LandingsHub2026() {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedSquad, setSelectedSquad] = useState<string>("ALL")
    const [downloadingSlug, setDownloadingSlug] = useState<string | null>(null)

    const handleDownloadPdf = async (cat: SuicideSquadCategoryLanding) => {
        setDownloadingSlug(cat.slug)
        try {
            await generateCategoryCatalogPDF(cat)
        } catch (e) {
            console.error("Error downloading PDF:", e)
        } finally {
            setDownloadingSlug(null)
        }
    }

    const squads = [
        { id: "ALL", label: "Todas las Categorías (2026)", code: "TODAS" },
        { id: "squad-1", label: "S-01 El Guardián Urbano (CCTV)", code: "S-01" },
        { id: "squad-2", label: "S-02 Blindaje Perimetral (Accesos & Cercas)", code: "S-02" },
        { id: "squad-3", label: "S-03 Conectividad & Redes (Wifi/Fibra)", code: "S-03" },
        { id: "squad-4", label: "S-04 Domótica & Automatismos", code: "S-04" },
        { id: "squad-5", label: "S-05 Energía & Climatización", code: "S-05" },
    ]

    const filtered = SUICIDE_SQUAD_CATEGORIES.filter((cat) => {
        const matchesSquad = selectedSquad === "ALL" || cat.squadId === selectedSquad
        const matchesSearch = 
            cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cat.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cat.badge.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cat.squadName.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesSquad && matchesSearch
    })

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 pb-28">
            {/* ── HEADER HERO ── */}
            <header className="relative bg-[#090d1e] text-white border-b border-orange-500/30 overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ea580c_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 relative z-10">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                        <Link 
                            href="/dashboard"
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono text-slate-200 transition-colors"
                        >
                            <Home size={14} />
                            Volver al ERP
                        </Link>
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold font-mono uppercase bg-orange-500/20 text-orange-400 border border-orange-500/40">
                            <Sparkles size={13} />
                            PORTAL OFICIAL DE LANDINGS 2026
                        </span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white max-w-3xl leading-tight">
                        Catálogo de Landings de Bienvenida{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-rose-400">
                            ATOMIC Solutions 2026
                        </span>
                    </h1>
                    <p className="mt-3 text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
                        Explora todas las páginas de bienvenida y conversión creadas para cada línea técnica del Suicide Squad. Diseñadas para cotización ágil, garantías SRI y prospección directa.
                    </p>

                    {/* SEARCH & FILTERS BAR */}
                    <div className="mt-8 flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Buscar landing por categoría, producto o alcance..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-orange-500 transition-colors"
                            />
                        </div>
                    </div>

                    {/* SQUAD FILTER TABS */}
                    <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                        {squads.map((sq) => {
                            const isSelected = selectedSquad === sq.id
                            return (
                                <button
                                    key={sq.id}
                                    onClick={() => setSelectedSquad(sq.id)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                                        isSelected 
                                            ? "bg-orange-500 text-white shadow-md shadow-orange-500/30" 
                                            : "bg-white/5 text-slate-300 hover:bg-white/15 border border-white/10"
                                    }`}
                                >
                                    {sq.label}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </header>

            {/* ── GRID DE LANDINGS ── */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-black text-slate-900">
                            Landings Activas ({filtered.length})
                        </h2>
                        <p className="text-xs text-slate-500">
                            Listas para compartir con prospectos o auditar especificaciones y precios de mercado.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((cat) => {
                        const href = `/bienvenida/categoria/${cat.slug}`
                        return (
                            <div 
                                key={cat.slug}
                                className="group bg-white rounded-3xl border border-slate-200 hover:border-orange-400/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
                            >
                                {/* CARD HEADER */}
                                <div className="p-6 pb-4 border-b border-slate-100 flex-1">
                                    <div className="flex items-center justify-between gap-2 mb-3">
                                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-black font-mono uppercase bg-slate-900 text-orange-400 border border-slate-700">
                                            {cat.squadCode} • {cat.squadName}
                                        </span>
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-700">
                                            {cat.badge}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-black text-slate-900 group-hover:text-orange-600 transition-colors">
                                        {cat.name}
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                                        {cat.subtitle}
                                    </p>

                                    {/* PRECIOS Y ALCANCE */}
                                    <div className="mt-4 p-3 rounded-2xl bg-orange-50/60 border border-orange-100 flex items-center justify-between">
                                        <div>
                                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Rango Mercado</span>
                                            <span className="text-sm font-black text-slate-900">
                                                ${cat.priceRange.min} - ${cat.priceRange.max}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Ticket Promedio</span>
                                            <span className="text-xs font-black text-orange-600">
                                                {cat.priceRange.avg}
                                            </span>
                                        </div>
                                    </div>

                                    {/* ALCANCES / SCOPES */}
                                    <div className="mt-4 space-y-1.5">
                                        <span className="text-[10px] uppercase font-mono font-bold text-slate-400 tracking-wider">
                                            Soluciones Incluidas:
                                        </span>
                                        {cat.scopes.slice(0, 3).map((scope, idx) => (
                                            <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-600">
                                                <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                                                <span className="truncate">{scope.title}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* CARD FOOTER ACTION */}
                                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                                    <button
                                        onClick={() => handleDownloadPdf(cat)}
                                        disabled={downloadingSlug === cat.slug}
                                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 border border-orange-500/30 text-xs font-bold transition-all active:scale-95 cursor-pointer disabled:opacity-60"
                                        title="Descargar Catálogo Oficial PDF con PVP y Garantía"
                                    >
                                        {downloadingSlug === cat.slug ? (
                                            <RefreshCw size={13} className="animate-spin text-orange-600" />
                                        ) : (
                                            <Download size={13} className="text-orange-600" />
                                        )}
                                        <span>PDF</span>
                                    </button>

                                    <Link
                                        href={href}
                                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-orange-600 text-white text-xs font-bold transition-all active:scale-95 shadow-sm"
                                    >
                                        Ver Landing
                                        <ArrowRight size={13} />
                                    </Link>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {filtered.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
                        <Search size={36} className="mx-auto text-slate-300 mb-3" />
                        <h3 className="text-base font-bold text-slate-700">No se encontraron landings con ese término</h3>
                        <p className="text-xs text-slate-400 mt-1">Prueba con otra palabra clave o selecciona &quot;Todas las Categorías&quot;</p>
                    </div>
                )}
            </main>
        </div>
    )
}
