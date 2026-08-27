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
  Truck,
  MessageCircle
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
    return `https://wa.me/593969043453?text=${text}`
  }

  // Toggle compare item
  const toggleCompare = (product: AppleProduct) => {
    if (compareList.some((p) => p.id === product.id)) {
      setCompareList(compareList.filter((p) => p.id !== product.id))
    } else {
      if (compareList.length >= 3) {
        alert("Puedes comparar un máximo de 3 productos a la vez.")
        return
      }
      setCompareList([...compareList, product])
    }
  }

  // Categories list with count
  const familyButtons = [
    { id: "todos", label: "Todos", count: APPLE_PRODUCTS.length, icon: Sparkles },
    { id: "mac", label: "Mac", count: APPLE_PRODUCTS.filter((p) => p.family === "mac").length, icon: Laptop },
    { id: "iphone", label: "iPhone", count: APPLE_PRODUCTS.filter((p) => p.family === "iphone").length, icon: Smartphone },
    { id: "ipad", label: "iPad", count: APPLE_PRODUCTS.filter((p) => p.family === "ipad").length, icon: Tablet },
    { id: "watch", label: "Watch", count: APPLE_PRODUCTS.filter((p) => p.family === "watch").length, icon: Watch },
    { id: "audio", label: "AirPods", count: APPLE_PRODUCTS.filter((p) => p.family === "audio").length, icon: Headphones },
    { id: "accesorios", label: "Accesorios", count: APPLE_PRODUCTS.filter((p) => p.family === "accesorios").length, icon: Package }
  ]

  return (
    <main className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans selection:bg-[#0071E3] selection:text-white">
      {/* ════════ TOP ANNOUNCEMENT BAR (APPLE CLEAN WHITE STYLE) ════════ */}
      <div className="bg-[#E8E8ED] border-b border-[#D2D2D7]/60 text-[#1D1D1F] text-[11px] font-mono tracking-wider py-2 px-4 text-center flex items-center justify-center gap-2">
        <span className="text-xl"></span>
        <span className="font-bold">APPLE STORE ECUADOR // DISTRIBUIDOR AUTORIZADO ATOMIC</span>
        <span className="hidden md:inline text-[#6E6E73]">• Homologación Arcotel 5G • 1 Año de Garantía Oficial • 15% IVA Incluido • Envíos a las 24 Provincias</span>
      </div>

      {/* ════════ NAVBAR HEADER (APPLE GLASS WHITE) ════════ */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-[#D2D2D7]/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/web" className="flex items-center gap-2.5 group cursor-pointer">
              <div className="w-9 h-9 rounded-xl bg-black flex items-center justify-center text-white font-black text-lg shadow-md group-hover:scale-105 transition-transform">
                
              </div>
              <div>
                <span className="text-base font-black tracking-tight font-heading text-[#1D1D1F] flex items-center gap-1.5">
                  ATOMIC <span className="text-[10px] px-2 py-0.5 rounded-full bg-black text-white font-mono font-bold">APPLE</span>
                </span>
                <p className="text-[9px] text-[#86868B] font-mono leading-none">Ecosistema Oficial Ecuador</p>
              </div>
            </Link>
          </div>

          {/* Quick Family Navigation Pills */}
          <nav className="hidden lg:flex items-center gap-1 font-mono text-xs text-[#6E6E73]">
            {familyButtons.slice(1).map((btn) => (
              <button
                key={btn.id}
                onClick={() => setActiveFamily(btn.id)}
                className={`px-3.5 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
                  activeFamily === btn.id ? "text-white bg-black shadow-sm" : "hover:text-[#1D1D1F] hover:bg-[#E8E8ED]"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </nav>

          {/* WhatsApp CTA & Compare Badge */}
          <div className="flex items-center gap-3">
            {compareList.length > 0 && (
              <button
                onClick={() => setShowCompareModal(true)}
                className="px-3.5 py-1.5 rounded-full bg-[#0071E3]/10 text-[#0071E3] border border-[#0071E3]/30 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer hover:bg-[#0071E3]/20 transition-all"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Comparar ({compareList.length})</span>
              </button>
            )}

            <a
              href="https://wa.me/593969043453?text=Hola%20ATOMIC,%20deseo%20asesoria%20especializada%20en%20equipos%20Apple%20(MacBook,%20iPhone,%20iPad,%20Watch)."
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white font-extrabold text-xs uppercase tracking-wider font-heading shadow-md flex items-center gap-2 transition-all cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Asesor Apple</span>
            </a>
          </div>
        </div>
      </header>

      {/* ════════ HERO SECTION (PURE WHITE APPLE STORE STYLE) ════════ */}
      <section className="relative overflow-hidden pt-14 pb-20 border-b border-[#E5E5EA] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F5F5F7] border border-[#D2D2D7] text-[#1D1D1F] text-xs font-mono font-bold tracking-wider uppercase shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#0071E3]" />
              <span>Apple Intelligence & Chips M-Series / A-Series</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-heading uppercase text-[#1D1D1F] tracking-tight leading-tight">
              Ecosistema Apple Oficial<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0071E3] via-[#43B88C] to-[#2E5BFF]">
                En Ecuador
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#6E6E73] font-normal leading-relaxed max-w-3xl mx-auto font-sans">
              Descubre más de <strong className="text-[#1D1D1F]">100 equipos originales homologados</strong>. Desde la última potencia de los <strong className="text-[#1D1D1F]">MacBook Pro M3/M4 & Air M2/M3</strong>, pasando por la línea <strong className="text-[#1D1D1F]">iPhone 17, 16 Pro Max y 15</strong>, hasta <strong className="text-[#1D1D1F]">iPads, Apple Watch y AirPods</strong> con 1 Año de Garantía oficial.
            </p>

            {/* Key Value Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 max-w-4xl mx-auto text-left font-mono text-xs">
              <div className="p-4 rounded-2xl bg-[#F5F5F7] border border-[#E5E5EA] flex items-center gap-3 shadow-sm">
                <Shield className="w-6 h-6 text-[#0071E3] shrink-0" />
                <div>
                  <div className="text-[#1D1D1F] font-bold">100% ORIGINAL</div>
                  <div className="text-[#86868B] text-[10px]">Equipos homologados</div>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-[#F5F5F7] border border-[#E5E5EA] flex items-center gap-3 shadow-sm">
                <Zap className="w-6 h-6 text-amber-500 shrink-0" />
                <div>
                  <div className="text-[#1D1D1F] font-bold">APPLE SILICON</div>
                  <div className="text-[#86868B] text-[10px]">Chips M2/M3/M4 & A18</div>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-[#F5F5F7] border border-[#E5E5EA] flex items-center gap-3 shadow-sm">
                <Award className="w-6 h-6 text-emerald-500 shrink-0" />
                <div>
                  <div className="text-[#1D1D1F] font-bold">1 AÑO GARANTÍA</div>
                  <div className="text-[#86868B] text-[10px]">Soporte técnico directo</div>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-[#F5F5F7] border border-[#E5E5EA] flex items-center gap-3 shadow-sm">
                <Truck className="w-6 h-6 text-indigo-500 shrink-0" />
                <div>
                  <div className="text-[#1D1D1F] font-bold">ENVÍOS EXPRESS</div>
                  <div className="text-[#86868B] text-[10px]">24 Provincias del Ecuador</div>
                </div>
              </div>
            </div>

            {/* Main Search Input */}
            <div className="relative max-w-xl mx-auto pt-2">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#86868B]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Busca por modelo, chip M3, iPhone 16 Pro, iPad, proveedor..."
                className="w-full pl-12 pr-10 py-3.5 rounded-full bg-[#F5F5F7] border border-[#D2D2D7] text-[#1D1D1F] placeholder-[#86868B] text-sm focus:outline-none focus:ring-2 focus:ring-[#0071E3] focus:bg-white transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#86868B] hover:text-[#1D1D1F]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ════════ PRODUCT CATEGORY SELECTOR ════════ */}
      <section className="sticky top-16 z-40 bg-white/90 backdrop-blur-xl border-b border-[#E5E5EA] py-3.5 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 overflow-x-auto">
          <div className="flex items-center gap-2 shrink-0">
            {familyButtons.map((btn) => {
              const Icon = btn.icon
              const isActive = activeFamily === btn.id
              return (
                <button
                  key={btn.id}
                  onClick={() => setActiveFamily(btn.id)}
                  className={`px-4 py-2 rounded-full text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap border ${
                    isActive
                      ? "bg-black text-white border-black shadow-sm"
                      : "bg-[#F5F5F7] text-[#6E6E73] border-[#E5E5EA] hover:bg-[#E8E8ED] hover:text-[#1D1D1F]"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{btn.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? "bg-white/20 text-white" : "bg-[#E5E5EA] text-[#6E6E73]"}`}>
                    {btn.count}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="hidden sm:flex items-center gap-2 shrink-0 text-xs font-mono">
            <span className="text-[#86868B]">Chip:</span>
            {[
              { id: "todos", label: "Todos" },
              { id: "m-series", label: "M-Series (M1/M2/M3)" },
              { id: "a-series", label: "A-Series Bionic" }
            ].map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveChipFilter(c.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors ${
                  activeChipFilter === c.id
                    ? "bg-[#0071E3] text-white border-[#0071E3]"
                    : "bg-[#F5F5F7] text-[#6E6E73] border-[#E5E5EA] hover:bg-[#E8E8ED]"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ PRODUCTS GRID (CRISP WHITE CARDS) ════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black font-heading uppercase text-[#1D1D1F] tracking-tight">
              Catálogo Apple Disponible ({filteredProducts.length})
            </h2>
            <p className="text-xs text-[#86868B] font-mono mt-1">Precios referenciales con 15% IVA incluido y garantía oficial en Ecuador</p>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="p-16 text-center bg-white rounded-3xl border border-[#E5E5EA] shadow-sm">
            <Package className="w-16 h-16 text-[#86868B] mx-auto mb-4" strokeWidth={1} />
            <h3 className="text-xl font-bold text-[#1D1D1F]">No se encontraron productos con estos filtros</h3>
            <p className="text-xs text-[#86868B] mt-2 max-w-md mx-auto">
              Intenta cambiar la familia, borrar el término de búsqueda o restablecer los filtros de procesador.
            </p>
            <button
              onClick={() => {
                setActiveFamily("todos")
                setActiveChipFilter("todos")
                setSearchQuery("")
              }}
              className="mt-6 px-6 py-2.5 rounded-full bg-black text-white text-xs font-bold font-mono uppercase"
            >
              Restablecer Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((prod) => (
              <div
                key={prod.id}
                className="bg-white rounded-3xl border border-[#E5E5EA] hover:border-[#0071E3]/50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:scale-[1.01]"
              >
                {/* Visual Image Header */}
                <div className="p-6 pb-2 relative bg-gradient-to-b from-[#FAFAFA] to-white border-b border-[#F0F0F2]">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-mono font-black uppercase px-2.5 py-0.5 rounded-full bg-[#F5F5F7] text-[#1D1D1F] border border-[#E5E5EA]">
                      {prod.chip}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-[#86868B]">
                      {prod.condition}
                    </span>
                  </div>

                  <div className="aspect-square relative w-full flex items-center justify-center p-2">
                    <img
                      src={prod.mainImage}
                      alt={prod.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-[#0071E3] block">
                      {prod.familyLabel} · {prod.provider}
                    </span>
                    <h3 className="text-sm font-black text-[#1D1D1F] uppercase font-mono mt-1 leading-snug line-clamp-2">
                      {prod.name}
                    </h3>
                  </div>

                  <div className="pt-3 border-t border-[#F0F0F2] flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] text-[#86868B] block font-mono">PVP CON IVA</span>
                      <span className="text-xl font-black font-mono text-[#1D1D1F]">
                        ${prod.priceWithVat.toFixed(2)}
                      </span>
                    </div>
                    {prod.compareAtPrice > prod.priceWithVat && (
                      <span className="text-xs text-[#86868B] line-through font-mono">
                        ${prod.compareAtPrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex flex-col gap-2">
                    <a
                      href={getWhatsAppUrl(prod)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 rounded-2xl bg-[#0071E3] hover:bg-[#0077ED] text-white font-extrabold text-xs uppercase font-heading tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                    >
                      <MessageCircle size={15} />
                      <span>Comprar por WhatsApp</span>
                    </a>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setModalProduct(prod)}
                        className="flex-1 py-2 rounded-xl bg-[#F5F5F7] hover:bg-[#E8E8ED] text-[#1D1D1F] font-bold text-xs font-mono transition-colors"
                      >
                        Ver Detalles
                      </button>
                      <button
                        onClick={() => toggleCompare(prod)}
                        className={`px-3 py-2 rounded-xl text-xs font-mono font-bold border transition-colors ${
                          compareList.some((p) => p.id === prod.id)
                            ? "bg-black text-white border-black"
                            : "bg-[#F5F5F7] text-[#6E6E73] border-[#E5E5EA] hover:text-[#1D1D1F]"
                        }`}
                        title="Comparar"
                      >
                        ⚖️
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ════════ PRODUCT DETAIL MODAL ════════ */}
      {modalProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#D2D2D7] rounded-3xl max-w-2xl w-full p-6 sm:p-8 text-[#1D1D1F] max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button
              onClick={() => setModalProduct(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#F5F5F7] hover:bg-[#E8E8ED] flex items-center justify-center text-[#1D1D1F] font-bold transition-all cursor-pointer"
            >
              ✕
            </button>

            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="w-full sm:w-1/2 aspect-square bg-[#F5F5F7] rounded-2xl overflow-hidden border border-[#E5E5EA] p-4 flex items-center justify-center">
                <img
                  src={modalProduct.mainImage}
                  alt={modalProduct.name}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="w-full sm:w-1/2 space-y-4">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black uppercase bg-black text-white">
                  {modalProduct.chip} · {modalProduct.condition}
                </span>

                <h3 className="text-lg font-black uppercase font-mono text-[#1D1D1F]">
                  {modalProduct.name}
                </h3>

                <div className="p-3 bg-[#F5F5F7] rounded-2xl border border-[#E5E5EA]">
                  <span className="text-[10px] text-[#86868B] block font-mono">PRECIO OFICIAL CON 15% IVA</span>
                  <span className="text-3xl font-black font-mono text-[#0071E3]">
                    ${modalProduct.priceWithVat.toFixed(2)} USD
                  </span>
                  <span className="text-xs text-[#86868B] block mt-0.5">Base: ${modalProduct.priceBase.toFixed(2)} + IVA</span>
                </div>

                <div className="space-y-1.5 text-xs font-mono">
                  {Object.entries(modalProduct.specs || {}).map(([k, v]) => (
                    <div key={k} className="flex justify-between border-b border-[#F0F0F2] pb-1">
                      <span className="text-[#86868B]">{k}:</span>
                      <span className="text-[#1D1D1F] font-bold text-right">{v}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-3">
                  <a
                    href={getWhatsAppUrl(modalProduct)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 rounded-2xl bg-[#0071E3] hover:bg-[#0077ED] text-white font-black text-xs uppercase font-heading tracking-wider flex items-center justify-center gap-2 shadow-md transition-all"
                  >
                    <MessageCircle size={16} />
                    <span>Cotizar por WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════ FOOTER ════════ */}
      <footer className="border-t border-[#E5E5EA] bg-white py-12 px-6 text-center text-xs text-[#86868B] font-mono space-y-2">
        <p>© 2026 ATOMIC INDUSTRIES — Distribución y Ecosistema Apple Oficial Ecuador.</p>
        <p className="text-[11px] text-[#A1A1A6]">Equipos homologados por Arcotel para redes 5G y 4G LTE en todas las operadoras del país.</p>
      </footer>
    </main>
  )
}
