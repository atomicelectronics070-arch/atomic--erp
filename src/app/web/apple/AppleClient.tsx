"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import {
  Shield,
  Zap,
  PhoneCall,
  ArrowRight,
  HelpCircle,
  Sliders,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Cpu,
  Eye,
  Check,
  Search,
  Laptop,
  Smartphone,
  Tablet,
  Watch,
  Headphones,
  MapPin,
  RefreshCw,
  Award,
  Layers,
  ShoppingBag,
  ExternalLink,
  Package,
  X,
  CreditCard,
  Truck
} from "lucide-react"
import { APPLE_PRODUCTS, AppleProduct } from "./appleProductsData"

export default function AppleClient() {
  const [activeFamily, setActiveFamily] = useState<string>("todos")
  const [activeChipFilter, setActiveChipFilter] = useState<string>("todos")
  const [activeCondition, setActiveCondition] = useState<string>("todos")
  const [activeProvider, setActiveProvider] = useState<string>("todos")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [modalProduct, setModalProduct] = useState<AppleProduct | null>(null)
  const [compareList, setCompareList] = useState<AppleProduct[]>([])
  const [showCompareModal, setShowCompareModal] = useState<boolean>(false)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  // Filter products dynamically
  const filteredProducts = useMemo(() => {
    return APPLE_PRODUCTS.filter((prod) => {
      // Family filter
      if (activeFamily !== "todos" && prod.family !== activeFamily) return false

      // Chip filter
      if (activeChipFilter === "m-series") {
        if (!/M1|M2|M3|M4|M5/i.test(prod.chip)) return false
      } else if (activeChipFilter === "a-series") {
        if (!/A15|A16|A17|A18|A19/i.test(prod.chip)) return false
      }

      // Condition filter
      if (activeCondition !== "todos") {
        if (activeCondition === "nuevo" && prod.condition !== "Nuevo Sellado") return false
        if (activeCondition === "open-box" && prod.condition !== "Open Box Grado A+") return false
      }

      // Provider filter
      if (activeProvider !== "todos" && prod.provider !== activeProvider) return false

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchName = prod.name.toLowerCase().includes(q)
        const matchChip = prod.chip.toLowerCase().includes(q)
        const matchDesc = prod.description.toLowerCase().includes(q)
        const matchProvider = prod.provider.toLowerCase().includes(q)
        if (!matchName && !matchChip && !matchDesc && !matchProvider) return false
      }

      return true
    })
  }, [activeFamily, activeChipFilter, activeCondition, activeProvider, searchQuery])

  // WhatsApp checkout message generator
  const getWhatsAppUrl = (product: AppleProduct) => {
    const text = encodeURIComponent(
      `Hola ATOMIC, deseo comprar/cotizar el siguiente producto Apple oficial:\n\n` +
      `🍎 *Producto:* ${product.name}\n` +
      `⚡ *Chip / Procesador:* ${product.chip}\n` +
      `📦 *Condición:* ${product.condition}\n` +
      `🏷️ *Proveedor Homologado:* ${product.provider}\n` +
      `💵 *Precio Oferta (+15% IVA):* $${product.priceWithVat.toFixed(2)} USD (Base: $${product.priceBase.toFixed(2)} + IVA)\n` +
      `🛡️ *Garantía:* 1 Año Oficial Apple & ATOMIC Ecuador\n\n` +
      `¿Tienen disponibilidad para entrega o envío a mi ciudad?`
    )
    return `https://wa.me/593999008080?text=${text}`
  }

  // Toggle compare item
  const toggleCompare = (product: AppleProduct) => {
    if (compareList.some(p => p.id === product.id)) {
      setCompareList(compareList.filter(p => p.id !== product.id))
    } else {
      if (compareList.length >= 3) {
        alert("Puedes comparar hasta 3 productos Apple a la vez.")
        return
      }
      setCompareList([...compareList, product])
    }
  }

  return (
    <div className="min-h-screen bg-[#070709] text-neutral-100 font-sans selection:bg-neutral-200 selection:text-black">
      
      {/* ══════════════════════════════════════════════════════════════════════
          TOP APPLE ANNOUNCEMENT BAR
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="bg-gradient-to-r from-[#1c1b22] via-[#24222f] to-[#1c1b22] border-b border-white/[0.08] text-white text-[11px] font-mono tracking-wider py-2 px-4 text-center flex items-center justify-center gap-2">
        <span className="text-amber-400">🍎</span>
        <span className="font-bold">APPLE STORE ECUADOR // ATOMIC PREMIUM RESELLER</span>
        <span className="hidden md:inline text-neutral-400">• Homologación Arcotel 5G • 1 Año de Garantía • 15% IVA Incluido • Envíos a Nivel Nacional</span>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          NAVBAR HEADER
      ══════════════════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 bg-[#070709]/85 backdrop-blur-2xl border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            <Link href="/web" className="flex items-center gap-2.5 group cursor-pointer">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-neutral-200 to-neutral-500 flex items-center justify-center text-black font-black text-lg shadow-lg group-hover:scale-105 transition-transform">
                
              </div>
              <div>
                <span className="text-base font-black tracking-tight font-heading text-white flex items-center gap-1.5">
                  ATOMIC <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-neutral-300 font-mono border border-white/20">APPLE</span>
                </span>
                <p className="text-[9px] text-neutral-400 font-mono leading-none">Ecosistema Oficial Ecuador</p>
              </div>
            </Link>
          </div>

          {/* Quick Family Navigation Pills */}
          <nav className="hidden lg:flex items-center gap-1 font-mono text-xs text-neutral-400">
            <button
              onClick={() => { setActiveFamily("mac"); }}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${activeFamily === "mac" ? "text-white bg-white/10" : "hover:text-white"}`}
            >
              Mac
            </button>
            <button
              onClick={() => { setActiveFamily("iphone"); }}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${activeFamily === "iphone" ? "text-white bg-white/10" : "hover:text-white"}`}
            >
              iPhone
            </button>
            <button
              onClick={() => { setActiveFamily("ipad"); }}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${activeFamily === "ipad" ? "text-white bg-white/10" : "hover:text-white"}`}
            >
              iPad
            </button>
            <button
              onClick={() => { setActiveFamily("watch"); }}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${activeFamily === "watch" ? "text-white bg-white/10" : "hover:text-white"}`}
            >
              Watch
            </button>
            <button
              onClick={() => { setActiveFamily("audio"); }}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${activeFamily === "audio" ? "text-white bg-white/10" : "hover:text-white"}`}
            >
              AirPods
            </button>
            <button
              onClick={() => { setActiveFamily("accesorios"); }}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${activeFamily === "accesorios" ? "text-white bg-white/10" : "hover:text-white"}`}
            >
              Accesorios
            </button>
          </nav>

          {/* WhatsApp CTA & Compare Badge */}
          <div className="flex items-center gap-3">
            {compareList.length > 0 && (
              <button
                onClick={() => setShowCompareModal(true)}
                className="px-3 py-1.5 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer hover:bg-blue-500/30 transition-colors"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Comparar ({compareList.length})</span>
              </button>
            )}

            <a
              href="https://wa.me/593999008080?text=Hola%20ATOMIC,%20deseo%20asesoria%20especializada%20en%20equipos%20Apple%20(MacBook,%20iPhone,%20iPad,%20Watch)."
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-white text-black font-extrabold text-xs uppercase tracking-wider font-heading hover:bg-neutral-200 shadow-lg flex items-center gap-2 transition-all cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5 text-black" />
              <span>Asesor Apple</span>
            </a>
          </div>

        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════════════════
          HERO SECTION (APPLE CINEMATIC DARK)
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b border-white/[0.08]">
        {/* Glow ambient background */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-blue-600/10 via-purple-600/10 to-transparent blur-[160px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/20 text-neutral-200 text-xs font-mono font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Apple Intelligence & Silicon Chips M-Series / A-Series</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-heading uppercase text-white tracking-tight leading-tight">
              El Ecosistema Apple Completo en{" "}
              <span className="bg-gradient-to-r from-neutral-100 via-neutral-300 to-neutral-500 bg-clip-text text-transparent">
                Ecuador
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-neutral-300 font-normal leading-relaxed max-w-3xl mx-auto">
              Descubre más de <strong className="text-white">100 equipos originales homologados</strong>. Desde la última potencia de los <strong className="text-white">MacBook Pro M5 & Air M4/M3</strong>, pasando por la línea <strong className="text-white">iPhone 17 Pro Max, 16 y 15</strong>, hasta <strong className="text-white">iPads, Apple Watch y AirPods</strong> con garantía y soporte directo.
            </p>

            {/* Key Value Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 max-w-3xl mx-auto text-left font-mono text-xs">
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center gap-2.5">
                <Shield className="w-5 h-5 text-blue-400 shrink-0" />
                <div>
                  <div className="text-white font-bold">100% ORIGINAL</div>
                  <div className="text-neutral-400 text-[10px]">Equipos homologados</div>
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center gap-2.5">
                <Zap className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <div className="text-white font-bold">APPLE SILICON</div>
                  <div className="text-neutral-400 text-[10px]">M5, M4, M3, M2 & A19</div>
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center gap-2.5">
                <CreditCard className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-white font-bold">FINANCIAMIENTO</div>
                  <div className="text-neutral-400 text-[10px]">Hasta 24 meses crédito</div>
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center gap-2.5">
                <Truck className="w-5 h-5 text-purple-400 shrink-0" />
                <div>
                  <div className="text-white font-bold">DESPACHO 24H</div>
                  <div className="text-neutral-400 text-[10px]">Envíos asegurados</div>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <a
                href="#catalogo-apple"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-black font-black text-sm uppercase tracking-widest font-heading hover:bg-neutral-200 shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-105"
              >
                <span>Explorar Catálogo ({APPLE_PRODUCTS.length} Productos)</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/593999008080?text=Hola%20ATOMIC,%20deseo%20consultar%20por%20un%20producto%20Apple%20especifico%20y%20formas%20de%20pago."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/20 font-bold text-sm uppercase tracking-widest font-heading transition-all flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                <span>Consultar con un Especialista</span>
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          ECOSYSTEM SPOTLIGHT CAROUSEL / HIGHLIGHTS
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-12 bg-[#0c0b10] border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            {/* Box 1: Mac */}
            <div
              onClick={() => setActiveFamily("mac")}
              className="p-5 rounded-3xl bg-white/[0.02] border border-white/[0.06] hover:border-white/20 hover:bg-white/[0.05] transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <Laptop className="w-6 h-6 text-neutral-300 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/10 text-white">
                  {APPLE_PRODUCTS.filter(p => p.family === 'mac').length} Modelos
                </span>
              </div>
              <h3 className="text-base font-bold font-heading text-white uppercase">MacBooks & Mac</h3>
              <p className="text-[11px] text-neutral-400 mt-1">Air M2/M3/M4, Pro M5, iMac 4.5K y Mac Mini</p>
            </div>

            {/* Box 2: iPhone */}
            <div
              onClick={() => setActiveFamily("iphone")}
              className="p-5 rounded-3xl bg-white/[0.02] border border-white/[0.06] hover:border-white/20 hover:bg-white/[0.05] transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <Smartphone className="w-6 h-6 text-neutral-300 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/10 text-white">
                  {APPLE_PRODUCTS.filter(p => p.family === 'iphone').length} Modelos
                </span>
              </div>
              <h3 className="text-base font-bold font-heading text-white uppercase">iPhone Series</h3>
              <p className="text-[11px] text-neutral-400 mt-1">iPhone 17 Pro Max, 16, 15, 14 y 13 (Sellados y Open Box)</p>
            </div>

            {/* Box 3: iPad */}
            <div
              onClick={() => setActiveFamily("ipad")}
              className="p-5 rounded-3xl bg-white/[0.02] border border-white/[0.06] hover:border-white/20 hover:bg-white/[0.05] transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <Tablet className="w-6 h-6 text-neutral-300 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/10 text-white">
                  {APPLE_PRODUCTS.filter(p => p.family === 'ipad').length} Modelos
                </span>
              </div>
              <h3 className="text-base font-bold font-heading text-white uppercase">iPad & Pencil</h3>
              <p className="text-[11px] text-neutral-400 mt-1">iPad A16 Bionic 11", Apple Pencil 2 y Accesorios</p>
            </div>

            {/* Box 4: Watch & Accesorios */}
            <div
              onClick={() => setActiveFamily("accesorios")}
              className="p-5 rounded-3xl bg-white/[0.02] border border-white/[0.06] hover:border-white/20 hover:bg-white/[0.05] transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <Watch className="w-6 h-6 text-neutral-300 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/10 text-white">
                  {APPLE_PRODUCTS.filter(p => p.family === 'accesorios' || p.family === 'ecosistema' || p.family === 'watch' || p.family === 'audio').length} Modelos
                </span>
              </div>
              <h3 className="text-base font-bold font-heading text-white uppercase">Watch, Audio & MagSafe</h3>
              <p className="text-[11px] text-neutral-400 mt-1">Apple Watch SE, AirTags, Cargadores 20W y MagSafe</p>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          MAIN CATALOG SECTION & MULTI-FILTERS
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="catalogo-apple" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Header & Live Search */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.08] pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-neutral-400 font-bold">
                <Sliders className="w-4 h-4 text-blue-400" />
                Catálogo Apple Homologado ({filteredProducts.length} de {APPLE_PRODUCTS.length} Productos)
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-heading uppercase text-white tracking-tight">
                Explora por Familia y Especificación
              </h2>
            </div>
            
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar iPhone, MacBook, M3, 256GB..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/15 text-white font-mono text-xs placeholder:text-neutral-500 focus:outline-none focus:border-white/40 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* ─── FILTRO 1: FAMILIA DE PRODUCTO ─── */}
          <div>
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block mb-2 font-bold">
              1. Selecciona la Familia Apple:
            </span>
            <div className="flex flex-wrap items-center gap-2 bg-[#121118] p-1.5 rounded-2xl border border-white/[0.08]">
              {[
                { id: "todos", label: "🍎 TODO EL ECOSISTEMA", count: APPLE_PRODUCTS.length },
                { id: "mac", label: "💻 MACBOOKS & MAC", count: APPLE_PRODUCTS.filter(p => p.family === 'mac').length },
                { id: "iphone", label: "📱 IPHONE SERIES", count: APPLE_PRODUCTS.filter(p => p.family === 'iphone').length },
                { id: "ipad", label: "📟 IPAD & PENCIL", count: APPLE_PRODUCTS.filter(p => p.family === 'ipad').length },
                { id: "watch", label: "⌚ APPLE WATCH", count: APPLE_PRODUCTS.filter(p => p.family === 'watch').length },
                { id: "audio", label: "🎧 AIRPODS & AUDIO", count: APPLE_PRODUCTS.filter(p => p.family === 'audio').length },
                { id: "ecosistema", label: "📍 AIRTAG & FIND MY", count: APPLE_PRODUCTS.filter(p => p.family === 'ecosistema').length },
                { id: "accesorios", label: "⚡ ACCESORIOS & CARGA", count: APPLE_PRODUCTS.filter(p => p.family === 'accesorios').length },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFamily(tab.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-heading uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                    activeFamily === tab.id
                      ? "bg-white text-black shadow-lg font-black scale-105"
                      : "text-neutral-400 hover:text-white hover:bg-white/[0.06]"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${activeFamily === tab.id ? 'bg-black/20 text-black' : 'bg-white/10 text-neutral-400'}`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* ─── FILTROS SECUNDARIOS: CHIP, CONDICIÓN, PROVEEDOR ─── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Filter by Chip */}
            <div>
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block mb-1.5 font-bold">
                2. Filtrar por Procesador / Chip:
              </span>
              <select
                value={activeChipFilter}
                onChange={(e) => setActiveChipFilter(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-white/40 cursor-pointer"
              >
                <option value="todos" className="bg-[#121118] text-white">Todos los Procesadores</option>
                <option value="m-series" className="bg-[#121118] text-white">✨ Apple Silicon M-Series (M5, M4, M3, M2)</option>
                <option value="a-series" className="bg-[#121118] text-white">⚡ Apple A-Series Bionic (A19, A18, A17, A16, A15)</option>
              </select>
            </div>

            {/* Filter by Condition */}
            <div>
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block mb-1.5 font-bold">
                3. Condición del Equipo:
              </span>
              <select
                value={activeCondition}
                onChange={(e) => setActiveCondition(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-white/40 cursor-pointer"
              >
                <option value="todos" className="bg-[#121118] text-white">Todas las Condiciones</option>
                <option value="nuevo" className="bg-[#121118] text-white">📦 Nuevo Sellado en Caja Oficial</option>
                <option value="open-box" className="bg-[#121118] text-white">✨ Open Box Grado A+ Certificado</option>
              </select>
            </div>

            {/* Filter by Provider */}
            <div>
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block mb-1.5 font-bold">
                4. Mayorista / Proveedor:
              </span>
              <select
                value={activeProvider}
                onChange={(e) => setActiveProvider(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-white/40 cursor-pointer"
              >
                <option value="todos" className="bg-[#121118] text-white">Todos los Proveedores Homologados</option>
                <option value="TecnoMega" className="bg-[#121118] text-white">TecnoMega Store</option>
                <option value="IDC Mayoristas" className="bg-[#121118] text-white">IDC Mayoristas</option>
                <option value="CelularQuito" className="bg-[#121118] text-white">CelularQuito</option>
                <option value="TelefonosyAccesorios" className="bg-[#121118] text-white">Telefonos & Accesorios</option>
                <option value="Meeltech Store" className="bg-[#121118] text-white">Meeltech Store</option>
                <option value="MultiTecnologia V&V" className="bg-[#121118] text-white">MultiTecnología V&V</option>
                <option value="Impormel" className="bg-[#121118] text-white">Impormel</option>
              </select>
            </div>

          </div>

          {/* ─── PRODUCT GRID ─── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-4">
            {filteredProducts.map((product) => {
              const isCompared = compareList.some(p => p.id === product.id)

              return (
                <div
                  key={product.id}
                  className="bg-[#100f16] rounded-3xl border border-white/[0.08] hover:border-white/25 transition-all duration-300 flex flex-col justify-between overflow-hidden group shadow-xl hover:shadow-white/5 relative"
                >
                  {/* Top Image Container */}
                  <div>
                    <div className="relative h-60 w-full bg-gradient-to-b from-[#181622] to-[#100f16] p-5 flex items-center justify-center overflow-hidden border-b border-white/[0.06]">
                      
                      {/* Badge Top Left */}
                      <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider font-mono border ${
                          product.condition === 'Open Box Grado A+'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            : 'bg-white/10 text-white border-white/20'
                        }`}>
                          {product.condition}
                        </span>
                      </div>

                      {/* Chip Badge Top Right */}
                      <div className="absolute top-3 right-3 z-20">
                        <span className="px-2 py-0.5 rounded-lg bg-black/80 backdrop-blur-md border border-white/20 text-neutral-200 font-mono text-[9px] font-bold">
                          {product.chip}
                        </span>
                      </div>

                      {/* Product Image */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.mainImage}
                        alt={product.name}
                        className="w-full h-full object-contain max-h-[190px] group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Provider Ribbon Bottom */}
                      <div className="absolute bottom-2 left-2 right-2 z-20 bg-[#070709]/90 backdrop-blur-md border border-white/[0.08] rounded-xl px-2.5 py-1 text-[9px] text-neutral-400 font-mono flex items-center justify-between">
                        <span>Origen: {product.provider}</span>
                        <span className="text-emerald-400 font-bold">✓ Homologado</span>
                      </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-4 sm:p-5 space-y-3">
                      
                      {/* Title */}
                      <h3 className="text-sm sm:text-base font-bold text-white font-heading uppercase leading-snug line-clamp-2 group-hover:text-neutral-200 transition-colors">
                        {product.name}
                      </h3>

                      {/* Specs pills */}
                      <div className="flex flex-wrap gap-1.5 text-[10px] font-mono text-neutral-300">
                        {Object.entries(product.specs).slice(0, 3).map(([k, v]) => (
                          <span key={k} className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.08] truncate max-w-[200px]">
                            {v}
                          </span>
                        ))}
                      </div>

                    </div>
                  </div>

                  {/* Bottom Pricing & Action Section */}
                  <div className="p-4 sm:p-5 pt-0 space-y-3 border-t border-white/[0.06] bg-black/20">
                    
                    {/* Price box */}
                    <div className="pt-3 flex items-end justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] text-neutral-500 line-through font-mono">
                            ${product.compareAtPrice.toFixed(2)}
                          </span>
                          <span className="px-1 py-0.2 rounded bg-red-500/20 text-red-400 font-mono text-[8px] font-bold border border-red-500/30">
                            -30% PROMO
                          </span>
                        </div>
                        <div className="text-xl font-black font-heading text-white tracking-tight">
                          ${product.priceWithVat.toFixed(2)}{" "}
                          <span className="text-[9px] text-neutral-400 font-mono font-normal">IVA inc.</span>
                        </div>
                        <div className="text-[9px] text-neutral-400 font-mono">
                          (Base: ${product.priceBase.toFixed(2)} + IVA)
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="inline-flex items-center gap-1 text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20 font-bold">
                          ✓ Garantía 1 Año
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => setModalProduct(product)}
                        className="w-full py-2 px-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white font-bold text-[11px] uppercase tracking-wider font-heading border border-white/10 flex items-center justify-center gap-1 cursor-pointer transition-colors"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Ficha</span>
                      </button>

                      <a
                        href={getWhatsAppUrl(product)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2 px-2 rounded-xl bg-white text-black font-black text-[11px] uppercase tracking-wider font-heading hover:bg-neutral-200 shadow-md flex items-center justify-center gap-1 transition-transform hover:scale-[1.02] cursor-pointer"
                      >
                        <PhoneCall className="w-3 h-3 text-black" />
                        <span>Comprar</span>
                      </a>
                    </div>

                    {/* Compare Checkbox */}
                    <button
                      onClick={() => toggleCompare(product)}
                      className={`w-full py-1 text-[10px] font-mono rounded-lg border transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                        isCompared
                          ? "bg-blue-500/20 text-blue-300 border-blue-500/40"
                          : "bg-transparent text-neutral-400 border-transparent hover:text-white"
                      }`}
                    >
                      <span>{isCompared ? "✓ En Comparación" : "+ Comparar Modelo"}</span>
                    </button>

                  </div>
                </div>
              )
            })}
          </div>

          {/* No results placeholder */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-16 p-8 rounded-3xl bg-white/[0.02] border border-white/[0.08] space-y-4">
              <Package className="w-12 h-12 text-neutral-500 mx-auto" />
              <h3 className="text-lg font-black font-heading text-white">No se encontraron productos Apple con estos filtros</h3>
              <p className="text-xs text-neutral-400">Prueba cambiando los términos de búsqueda o restableciendo los filtros.</p>
              <button
                onClick={() => { setActiveFamily("todos"); setActiveChipFilter("todos"); setActiveCondition("todos"); setActiveProvider("todos"); setSearchQuery(""); }}
                className="px-5 py-2 rounded-xl bg-white text-black font-bold text-xs uppercase font-heading cursor-pointer hover:bg-neutral-200"
              >
                Restablecer Filtros
              </button>
            </div>
          )}

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          APPLE ECOSYSTEM CONTINUITY SECTION
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-[#0c0b10] border-t border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-bold">
              Experiencia Mágica e Integrada
            </span>
            <h2 className="text-2xl sm:text-4xl font-black font-heading uppercase text-white tracking-tight">
              La Magia del Ecosistema Apple
            </h2>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Todos tus dispositivos se comunican entre sí de forma transparente. Empieza un correo en tu iPhone y termínalo en tu MacBook, copia una foto en tu iPad y pégala al instante en tu Mac.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
            
            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.06] space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 text-white flex items-center justify-center font-bold text-lg">
                ⚡
              </div>
              <h3 className="text-lg font-bold font-heading text-white uppercase">AirDrop & Portapapeles Universal</h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Envía gigabytes de videos, fotos y documentos en segundos sin cables ni internet. Copia texto o imágenes en un dispositivo y pégalos en otro sin fricción.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.06] space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 text-white flex items-center justify-center font-bold text-lg">
                🛡️
              </div>
              <h3 className="text-lg font-bold font-heading text-white uppercase">Apple Intelligence & Privacidad</h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Herramientas avanzadas de redacción, edición fotográfica asistida por IA y respuestas automáticas inteligentes que procesan tus datos directamente en el chip de tu equipo.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.06] space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 text-white flex items-center justify-center font-bold text-lg">
                📍
              </div>
              <h3 className="text-lg font-bold font-heading text-white uppercase">Red Global Buscar (Find My)</h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Localiza tu iPhone, Mac, iPad, AirPods o llaves con AirTag en cualquier rincón del mundo gracias a la red encriptada de cientos de millones de dispositivos Apple.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          FAQ ACCORDION SECTION
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-[#070709] border-t border-white/[0.08]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="text-center space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-bold">
              Preguntas Frecuentes Apple Ecuador
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-heading uppercase text-white">
              Todo lo que necesitas saber antes de tu compra
            </h2>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "¿Los iPhones y MacBooks cuentan con homologación Arcotel para redes en Ecuador?",
                a: "Sí, todos nuestros equipos iPhone están 100% homologados ante la Arcotel y liberados de fábrica para funcionar en redes 5G, 4G LTE de Claro, Movistar, Tuenti y CNT sin ningún tipo de bloqueo ni restricción de IMEI."
              },
              {
                q: "¿Qué diferencia existe entre un modelo Sellado y uno Open Box Grado A+?",
                a: "Los modelos 'Nuevo Sellado' vienen en su caja de fábrica con precintos intactos. Los modelos 'Open Box Grado A+' son equipos de exhibición o cajas abiertas de aduana, con 0 marcas de uso, 100% de salud de batería y garantía completa de funcionamiento respaldada por ATOMIC."
              },
              {
                q: "¿Cómo funciona la garantía de los productos Apple con ATOMIC?",
                a: "Todos nuestros productos cuentan con 1 año de garantía oficial contra defectos de fabricación. Realizamos soporte directo, diagnóstico técnico y reemplazo inmediato sin trámites engorrosos."
              },
              {
                q: "¿Qué medios de pago y opciones de crédito diferido aceptan?",
                a: "Aceptamos transferencias bancarias directas (Banco Pichincha, Guayaquil, Produbanco, Pacífico), pagos con tarjeta de débito y diferidos con tarjeta de crédito de 3 a 24 meses con y sin intereses (Visa, Mastercard, Diners, American Express)."
              },
              {
                q: "¿Realizan envíos asegurados a provincias fuera de Quito y Guayaquil?",
                a: "Sí, realizamos envíos exprés asegurados mediante Servientrega y transporte de valores a las 24 provincias del Ecuador, con guía de rastreo en tiempo real y entrega en 24 a 48 horas laborables."
              }
            ].map((faq, idx) => {
              const isOpen = expandedFaq === idx
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-white/[0.02] border border-white/[0.08] overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setExpandedFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.03]"
                  >
                    <span className="text-sm sm:text-base font-bold text-white font-heading uppercase flex items-center gap-2.5">
                      <HelpCircle className="w-4 h-4 text-blue-400 shrink-0" />
                      {faq.q}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-neutral-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-neutral-300 leading-relaxed border-t border-white/[0.06] pt-3 font-sans">
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════════════════════ */}
      <footer className="bg-[#040405] border-t border-white/[0.08] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-neutral-200 to-neutral-500 flex items-center justify-center text-black font-black font-heading text-2xl mx-auto shadow-lg">
            
          </div>
          <div className="space-y-2 max-w-xl mx-auto">
            <h3 className="text-xl font-black font-heading uppercase text-white">
              ATOMIC — Distribuidor & Especialista Apple Ecuador
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-mono">
              Quito • Guayaquil • Cuenca • Manta • Ambato • Machala • Santo Domingo • Red Nacional
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-neutral-400 pt-2">
            <Link href="/web" className="hover:text-white transition-colors">Tienda Principal</Link>
            <span>•</span>
            <Link href="/web/cerraduras-smart" className="hover:text-white transition-colors">Cerraduras Smart</Link>
            <span>•</span>
            <Link href="/web/camaras-hogar" className="hover:text-white transition-colors">Cámaras 4K</Link>
            <span>•</span>
            <Link href="/web/barreras-vehiculares" className="hover:text-white transition-colors">Barreras Vehiculares</Link>
            <span>•</span>
            <a href="https://wa.me/593999008080" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">
              WhatsApp: +593 99 900 8080
            </a>
          </div>
          <p className="text-[10px] text-neutral-600 font-mono">
            © 2026 ATOMIC Electronics. Todos los derechos reservados. Apple, el logotipo de Apple, iPhone, MacBook, iPad, Apple Watch y AirPods son marcas registradas de Apple Inc.
          </p>
        </div>
      </footer>

      {/* ══════════════════════════════════════════════════════════════════════
          DETAIL MODAL
      ══════════════════════════════════════════════════════════════════════ */}
      {modalProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#121118] border border-white/20 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 relative shadow-2xl">
            
            {/* Close button */}
            <button
              onClick={() => setModalProduct(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer text-sm font-bold"
            >
              ✕
            </button>

            {/* Modal Header */}
            <div className="flex items-start gap-4">
              <div className="w-24 h-24 rounded-2xl bg-black/40 border border-white/10 p-2 flex items-center justify-center shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={modalProduct.mainImage}
                  alt={modalProduct.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="space-y-1">
                <span className="px-2 py-0.5 rounded bg-white/10 text-white font-mono text-[9px] font-bold uppercase border border-white/20">
                  {modalProduct.chip} • {modalProduct.condition}
                </span>
                <h3 className="text-lg sm:text-xl font-black font-heading text-white uppercase leading-snug">
                  {modalProduct.name}
                </h3>
                <p className="text-xs text-neutral-400 font-mono">Proveedor Homologado: {modalProduct.provider}</p>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-neutral-300 leading-relaxed font-sans">
              {modalProduct.description}
            </p>

            {/* Highlights */}
            <div className="space-y-1.5">
              <span className="text-xs font-mono font-bold uppercase text-neutral-300 block">
                ✨ Características Principales:
              </span>
              <ul className="space-y-1 text-xs text-neutral-300 font-sans">
                {modalProduct.highlights.map((hl, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                    <span>{hl}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Technical Specifications Table */}
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold uppercase text-neutral-300 block">
                📋 Ficha Técnica Oficial:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                {Object.entries(modalProduct.specs).map(([key, val]) => (
                  <div key={key} className="p-2.5 rounded-xl bg-black/40 border border-white/[0.06] flex items-center justify-between">
                    <span className="text-neutral-400">{key}:</span>
                    <span className="text-white font-bold text-right ml-2 truncate">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Breakdown in Modal */}
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/20 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-neutral-400 font-mono">Precio con 15% IVA Incluido:</div>
                <div className="text-2xl font-black font-heading text-white">
                  ${modalProduct.priceWithVat.toFixed(2)} USD
                </div>
                <div className="text-[10px] text-neutral-400 font-mono">
                  (Base: ${modalProduct.priceBase.toFixed(2)} + IVA)
                </div>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 font-bold">
                  ✓ Garantía Oficial 1 Año
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-2">
              <a
                href={getWhatsAppUrl(modalProduct)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-xl bg-white text-black font-black text-xs uppercase tracking-widest font-heading hover:bg-neutral-200 shadow-lg flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-4 h-4 text-black" />
                <span>Solicitar Compra / Asesoría Oficial por WhatsApp</span>
              </a>
            </div>

          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          COMPARISON MODAL
      ══════════════════════════════════════════════════════════════════════ */}
      {showCompareModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#121118] border border-white/20 rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 relative shadow-2xl">
            
            {/* Close button */}
            <button
              onClick={() => setShowCompareModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer text-sm font-bold"
            >
              ✕
            </button>

            <div className="space-y-1">
              <span className="text-xs font-mono font-bold uppercase text-blue-400">
                Comparador de Especificaciones
              </span>
              <h3 className="text-xl sm:text-2xl font-black font-heading text-white uppercase">
                Comparativa de Modelos Apple ({compareList.length})
              </h3>
            </div>

            {/* Comparison Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
              {compareList.map((item) => (
                <div key={item.id} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="h-32 w-full bg-black/30 rounded-xl p-3 flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.mainImage} alt={item.name} className="h-full object-contain" />
                    </div>
                    <div className="font-bold text-white uppercase leading-snug">{item.name}</div>
                    <div className="text-amber-400 font-bold text-base">${item.priceWithVat.toFixed(2)} USD</div>
                    <div className="space-y-1 text-[11px] text-neutral-300 border-t border-white/10 pt-2">
                      <div><strong className="text-neutral-400">Chip:</strong> {item.chip}</div>
                      <div><strong className="text-neutral-400">Condición:</strong> {item.condition}</div>
                      {Object.entries(item.specs).slice(0, 5).map(([k, v]) => (
                        <div key={k}><strong className="text-neutral-400">{k}:</strong> {v}</div>
                      ))}
                    </div>
                  </div>
                  <div className="pt-3 space-y-2">
                    <a
                      href={getWhatsAppUrl(item)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 rounded-xl bg-white text-black font-bold text-xs uppercase text-center block"
                    >
                      Cotizar
                    </a>
                    <button
                      onClick={() => toggleCompare(item)}
                      className="w-full py-1 text-red-400 hover:text-red-300 text-[10px] cursor-pointer"
                    >
                      Quitar de Comparación
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
