"use client"

import React, { useState } from "react"
import Link from "next/link"
import { 
    SUICIDE_SQUAD_CATEGORIES, 
    SuicideSquadCategoryLanding 
} from "@/lib/data/suicideSquadCategories"
import { 
    Shield, Search, ExternalLink, ArrowRight, Sparkles, 
    CheckCircle2, Layers, MessageSquare, 
    Award, Zap, Home, ShoppingCart, Download, RefreshCw,
    PhoneCall, Check, Lock, Cpu
} from "lucide-react"
import { generateCategoryCatalogPDF } from "@/lib/pdf/categoryCatalogPdf"

export default function ClientSolutionsLandingHub() {
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
        { id: "ALL", label: "Todas las Especialidades", code: "TODAS" },
        { id: "squad-1", label: "CCTV & Vigilancia con IA", code: "CCTV" },
        { id: "squad-2", label: "Control de Acceso & Perimetral", code: "ACCESOS" },
        { id: "squad-3", label: "Conectividad & Fibra Óptica", code: "REDES" },
        { id: "squad-4", label: "Domótica & Automatización", code: "DOMÓTICA" },
        { id: "squad-5", label: "Energía Solar & Climatización", code: "ENERGÍA" },
    ]

    const filtered = SUICIDE_SQUAD_CATEGORIES.filter((cat) => {
        const matchesSquad = selectedSquad === "ALL" || cat.squadId === selectedSquad
        const matchesSearch = 
            cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cat.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cat.badge.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesSquad && matchesSearch
    })

    const WHATSAPP_CONTACT = "593963421111"

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 pb-28 font-sans">
            {/* ── HEADER HERO DE CARA AL CLIENTE ── */}
            <header className="relative bg-gradient-to-b from-[#060b18] via-[#090f22] to-[#040714] text-white border-b border-cyan-500/20 overflow-hidden">
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                        <Link 
                            href="/web"
                            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-xs font-mono text-cyan-300 border border-cyan-500/30 transition-colors"
                        >
                            <Home size={14} />
                            <span>Tienda Oficial ATOMIC</span>
                        </Link>
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold font-mono uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                            <Shield size={13} />
                            INGENIERÍA & SEGURIDAD INTEGRAL CERTIFICADA
                        </span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white max-w-4xl leading-tight">
                        Soluciones Tecnológicas & Especialidades de Ingeniería{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">
                            ATOMIC Solutions
                        </span>
                    </h1>
                    <p className="mt-4 text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
                        Implementación profesional de alta tecnología para hogares, empresas e industrias en todo el Ecuador. Seguridad con Inteligencia Artificial, Casas Inteligentes, Cableado Estructurado y Respaldo Eléctrico con Garantía de 1 Año y Facturación Oficial SRI.
                    </p>

                    {/* BADGES DE CONFIANZA PARA EL CLIENTE */}
                    <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-mono">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400">
                            <CheckCircle2 size={14} />
                            <span>Garantía Oficial 1 Año</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400">
                            <Award size={14} />
                            <span>Facturación Electrónica SRI</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-amber-400">
                            <Cpu size={14} />
                            <span>Soporte Técnico Especializado</span>
                        </div>
                    </div>

                    {/* SEARCH & FILTERS BAR */}
                    <div className="mt-8 flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Buscar especialidad (ej. Cámaras con IA, Control de Acceso, Redes, Domótica)..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                            />
                        </div>
                    </div>

                    {/* SQUAD / ESPECIALIDADES FILTER TABS */}
                    <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                        {squads.map((sq) => {
                            const isSelected = selectedSquad === sq.id
                            return (
                                <button
                                    key={sq.id}
                                    onClick={() => setSelectedSquad(sq.id)}
                                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                                        isSelected 
                                            ? "bg-cyan-500 text-black font-black shadow-lg shadow-cyan-500/30" 
                                            : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800"
                                    }`}
                                >
                                    {sq.label}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </header>

            {/* ── GRID DE SOLUCIONES PARA EL CLIENTE ── */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-black text-white flex items-center gap-2">
                            <span>Especialidades Disponibles</span>
                            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                                {filtered.length} Categorías
                            </span>
                        </h2>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Selecciona una categoría técnica para ver configuraciones recomendadas y cotizar tu instalación.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((cat) => {
                        const href = `/bienvenida/categoria/${cat.slug}`
                        const whatsappMsg = encodeURIComponent(`Hola ATOMIC Solutions, deseo solicitar información y cotización sobre la especialidad: ${cat.name}.`)
                        const whatsappUrl = `https://wa.me/${WHATSAPP_CONTACT}?text=${whatsappMsg}`

                        return (
                            <div 
                                key={cat.slug}
                                className="group bg-[#0d121f] rounded-3xl border border-slate-800 hover:border-cyan-500/60 shadow-xl hover:shadow-cyan-950/40 transition-all duration-300 flex flex-col overflow-hidden"
                            >
                                {/* CARD HEADER */}
                                <div className="p-6 pb-4 border-b border-slate-800/80 flex-1">
                                    <div className="flex items-center justify-between gap-2 mb-3">
                                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-black font-mono uppercase bg-slate-900 text-cyan-400 border border-cyan-500/30">
                                            {cat.badge}
                                        </span>
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                            Garantía 1 Año
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-black text-white group-hover:text-cyan-300 transition-colors">
                                        {cat.name}
                                    </h3>
                                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                                        {cat.subtitle}
                                    </p>

                                    {/* ALCANCES / SCOPES PARA EL CLIENTE */}
                                    <div className="mt-4 space-y-1.5">
                                        <span className="text-[10px] uppercase font-mono font-bold text-slate-400 tracking-wider block">
                                            Equipamiento & Alcance Técnico:
                                        </span>
                                        {cat.scopes.slice(0, 3).map((scope, idx) => (
                                            <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-300">
                                                <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                                                <span className="truncate">{scope.title}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* CARD FOOTER ACTION */}
                                <div className="p-4 bg-slate-900/60 border-t border-slate-800 flex items-center justify-between gap-2">
                                    <button
                                        onClick={() => handleDownloadPdf(cat)}
                                        disabled={downloadingSlug === cat.slug}
                                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all active:scale-95 cursor-pointer disabled:opacity-60"
                                        title="Descargar Catálogo Técnico en PDF con Garantía y Especificaciones"
                                    >
                                        {downloadingSlug === cat.slug ? (
                                            <RefreshCw size={13} className="animate-spin text-cyan-300" />
                                        ) : (
                                            <Download size={13} className="text-cyan-300" />
                                        )}
                                        <span>PDF</span>
                                    </button>

                                    <a
                                        href={whatsappUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all active:scale-95"
                                        title="Contactar Asesor Técnico por WhatsApp"
                                    >
                                        <MessageSquare size={13} />
                                        <span>WhatsApp</span>
                                    </a>

                                    <Link
                                        href={href}
                                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold transition-all active:scale-95 shadow-md shadow-cyan-950/50"
                                    >
                                        <span>Ver Solución</span>
                                        <ArrowRight size={13} />
                                    </Link>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {filtered.length === 0 && (
                    <div className="text-center py-20 bg-slate-900 rounded-3xl border border-slate-800">
                        <Search size={36} className="mx-auto text-slate-500 mb-3" />
                        <h3 className="text-base font-bold text-slate-200">No se encontraron especialidades con ese término</h3>
                        <p className="text-xs text-slate-400 mt-1">Prueba con otra palabra clave o selecciona &quot;Todas las Especialidades&quot;</p>
                    </div>
                )}
            </main>
        </div>
    )
}

