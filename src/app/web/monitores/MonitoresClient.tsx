"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { 
  Tv, Zap, ShieldCheck, ShoppingCart, Phone, Eye, 
  Layers, CheckCircle2, ChevronRight, Sliders, 
  Gamepad2, Briefcase, Monitor, Sparkles, Award, 
  Check, ArrowRight, Gauge, Cpu, Flame, Search
} from "lucide-react"
import { useCart } from "@/context/CartContext"

interface DbProduct {
  id: string
  name: string
  price: number
  compareAtPrice: number | null
  sku?: string | null
  images?: string | null
  description?: string | null
  stock?: number | null
}

interface MonitoresClientProps {
  products: DbProduct[]
}

interface MonitorItem {
  sku: string
  brand: "ASUS" | "LG" | "GIGABYTE" | "DELL"
  title: string
  size: "27\"" | "23.8\"" | "19.5\""
  hz: "120Hz" | "144Hz" | "60Hz"
  panel: "IPS" | "TN"
  responseTime: "1ms" | "5ms"
  category: "Gaming" | "Híbrido" | "Oficina / Pro"
  badge: string
  badgeColor: string
  accentColor: string
  borderAccent: string
  price: number
  compareAtPrice: number
  costPrice: number
  image: string
  alt: string
  ports: string[]
  features: string[]
  warranty: string
}

const MONITORS_DATA: MonitorItem[] = [
  {
    sku: "MONASUVY279HGR",
    brand: "ASUS",
    title: "Monitor ASUS VY279HGR 27\" FHD IPS 120Hz 1ms Eye Care Plus",
    size: "27\"",
    hz: "120Hz",
    panel: "IPS",
    responseTime: "1ms",
    category: "Híbrido",
    badge: "120Hz EYE CARE PLUS • 27\"",
    badgeColor: "bg-teal-500 text-stone-950",
    accentColor: "text-teal-600",
    borderAccent: "border-teal-400 ring-teal-400/30",
    costPrice: 253.92,
    price: 317.40,
    compareAtPrice: 365.00,
    image: "/images/monitores/monitor-asus-vy279hgr-27.png",
    alt: "Monitor ASUS VY279HGR 27 Pulgadas IPS 120Hz 1ms",
    ports: ["HDMI 1.4", "VGA clásico", "Salida de audio 3.5mm"],
    features: [
      "Panel IPS Full HD (1920x1080) con 178° de visión panorámica",
      "Fluidez de 120Hz con tecnología SmoothMotion y 1ms MPRT",
      "Tratamiento antibacteriano patentado BacGuard en biseles y botones",
      "Tecnología ASUS Eye Care Plus con certificación TÜV Rheinland",
      "Color Augmentation y Rest Reminder para cuidar tu salud visual"
    ],
    warranty: "3 Años de Garantía Oficial ASUS"
  },
  {
    sku: "MONLGX24G411B-B",
    brand: "LG",
    title: "Monitor LG UltraGear 23.8\" FHD IPS Gaming 144Hz 1ms Slim Stand",
    size: "23.8\"",
    hz: "144Hz",
    panel: "IPS",
    responseTime: "1ms",
    category: "Gaming",
    badge: "144Hz ESPORTS • 24\"",
    badgeColor: "bg-rose-600 text-white",
    accentColor: "text-rose-600",
    borderAccent: "border-rose-500 ring-rose-500/30",
    costPrice: 171.93,
    price: 220.07,
    compareAtPrice: 259.00,
    image: "/images/monitores/monitor-lg-ultragear-24g411b.png",
    alt: "Monitor LG UltraGear 24G411B Gaming 144Hz 1ms IPS",
    ports: ["DisplayPort 1.2", "HDMI 2.0", "Salida Auriculares"],
    features: [
      "Panel IPS Full HD con 99% de cobertura sRGB para colores vivos",
      "144Hz de tasa de refresco nativa para shooters y gaming competitivo",
      "1ms Motion Blur Reduction (MBR) que elimina el ghosting",
      "Compatible con AMD FreeSync Premium para sincronización perfecta",
      "Base estilizada Slim Stand con inclinación ergonómica ajustable"
    ],
    warranty: "12 Meses de Garantía Oficial LG"
  },
  {
    sku: "MONLGX27G411A-B",
    brand: "LG",
    title: "Monitor LG UltraGear 27\" FHD IPS Gaming 144Hz 1ms HDR10",
    size: "27\"",
    hz: "144Hz",
    panel: "IPS",
    responseTime: "1ms",
    category: "Gaming",
    badge: "144Hz INMERSIÓN 27\" • HDR10",
    badgeColor: "bg-red-600 text-white",
    accentColor: "text-red-600",
    borderAccent: "border-red-500 ring-red-500/30",
    costPrice: 203.66,
    price: 254.58,
    compareAtPrice: 299.00,
    image: "/images/monitores/monitor-lg-ultragear-27g411a.png",
    alt: "Monitor LG UltraGear 27G411A Gaming 27 Pulgadas 144Hz",
    ports: ["DisplayPort 1.2", "HDMI 2.0", "Jack de Audio"],
    features: [
      "Gran diagonal de 27 pulgadas con diseño sin bordes en 3 lados",
      "144Hz nativos + 1ms MBR para máxima precisión de disparo",
      "Soporte HDR10 con alto rango dinámico y contraste cinematográfico",
      "Tecnologías Dynamic Action Sync (DAS) y Black Stabilizer para sombras",
      "Mira en pantalla (Crosshair) configurable para juegos FPS"
    ],
    warranty: "12 Meses de Garantía Oficial LG"
  },
  {
    sku: "MONGIBGS24F14",
    brand: "GIGABYTE",
    title: "Monitor GIGABYTE GS24F 23.8\" Super Speed IPS 144Hz (170Hz OC) 1ms",
    size: "23.8\"",
    hz: "144Hz",
    panel: "IPS",
    responseTime: "1ms",
    category: "Gaming",
    badge: "HASTA 170Hz OC • GIGABYTE TACTICAL",
    badgeColor: "bg-orange-500 text-white",
    accentColor: "text-orange-600",
    borderAccent: "border-orange-500 ring-orange-500/30",
    costPrice: 208.95,
    price: 261.19,
    compareAtPrice: 310.00,
    image: "/images/monitores/monitor-gigabyte-gs24f.png",
    alt: "Monitor GIGABYTE GS24F Gaming 170Hz IPS 1ms",
    ports: ["2x HDMI 2.0", "DisplayPort 1.2", "Earphone Jack"],
    features: [
      "Super Speed IPS con tasa overclockeable hasta 170Hz y 1ms (MPRT)",
      "99% sRGB / 105% sRGB volumen de color vibrante",
      "Funciones tácticas OSD Sidekick: Aim Stabilizer y Black Equalizer",
      "Tecnología AMD FreeSync Premium para evitar el stuttering",
      "Dual HDMI para conectar tu PC y consola PlayStation / Xbox a la vez"
    ],
    warranty: "12 Meses de Garantía Oficial GIGABYTE"
  },
  {
    sku: "MONDELE2026H",
    brand: "DELL",
    title: "Monitor Dell Pro 20 E2026H 19.5\" HD+ (1600x900) HDMI DP VGA",
    size: "19.5\"",
    hz: "60Hz",
    panel: "TN",
    responseTime: "5ms",
    category: "Oficina / Pro",
    badge: "CORP PRO • 3 AÑOS GARANTÍA DELL",
    badgeColor: "bg-sky-700 text-white",
    accentColor: "text-sky-700",
    borderAccent: "border-sky-600 ring-sky-600/30",
    costPrice: 142.83,
    price: 182.82,
    compareAtPrice: 219.00,
    image: "/images/monitores/monitor-dell-pro-e2026h.png",
    alt: "Monitor Dell Pro E2026H 19.5 Pulgadas HDMI DisplayPort VGA",
    ports: ["HDMI 1.4", "DisplayPort 1.2", "VGA clásico (D-Sub)"],
    features: [
      "Resolución HD+ (1600x900) nítida y económica para puestos de trabajo",
      "Triple conectividad universal: HDMI, DisplayPort y VGA simultáneos",
      "Dell Display Manager (DDM) con función Easy Arrange para multitarea",
      "Certificación ambiental ENERGY STAR® y EPEAT® Gold",
      "Respaldado por el Servicio de Intercambio Avanzado Dell de 3 años"
    ],
    warranty: "3 Años de Garantía Oficial Dell con Soporte VIP"
  }
]

export default function MonitoresClient({ products }: MonitoresClientProps) {
  const { addToCart } = useCart()
  const [selectedBrand, setSelectedBrand] = useState<string>("ALL")
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL")
  const [activeItemSku, setActiveItemSku] = useState<string>("MONASUVY279HGR")
  const [addedSku, setAddedSku] = useState<string | null>(null)

  const officialPhone = "593980319050"
  const formattedPhone = "098 031 9050"

  const activeMonitor = MONITORS_DATA.find(m => m.sku === activeItemSku) || MONITORS_DATA[0]

  const filteredMonitors = MONITORS_DATA.filter(m => {
    if (selectedBrand !== "ALL" && m.brand !== selectedBrand) return false
    if (selectedCategory !== "ALL" && m.category !== selectedCategory) return false
    return true
  })

  const handleAddToCart = (item: MonitorItem) => {
    const dbMatch = products.find(p => p.sku === item.sku)
    
    addToCart({
      id: dbMatch ? dbMatch.id : item.sku,
      name: item.title,
      price: item.price,
      image: item.image,
      quantity: 1
    })

    setAddedSku(item.sku)
    setTimeout(() => setAddedSku(null), 3000)
  }

  const handleWhatsAppBuy = (item: MonitorItem) => {
    const message = encodeURIComponent(
      `¡Hola ATOMIC! 👋 Deseo comprar este monitor de Tecnomega:\n\n` +
      `🖥️ *Modelo:* ${item.title}\n` +
      `🏷️ *Código SKU:* ${item.sku}\n` +
      `💰 *Precio PVP:* $${item.price.toFixed(2)} USD (Incluye IVA)\n` +
      `🛡️ *Garantía:* ${item.warranty}\n\n` +
      `¿Tienen stock disponible para entrega inmediata en Quito o envío a provincia? Gracias.`
    )

    window.open(`https://wa.me/${officialPhone}?text=${message}`, "_blank")
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-stone-900 selection:text-white">
      
      {/* ── TOP ANNOUNCEMENT BAR: DISTRIBUCIÓN OFICIAL & MARGEN CON IVA ── */}
      <div className="bg-stone-900 text-white px-4 py-2 text-center text-xs font-mono font-bold tracking-wide uppercase flex items-center justify-center gap-2 flex-wrap">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>MONITORES GAMING & CORPORATIVOS TECNOMEGA // ASUS • LG • GIGABYTE • DELL</span>
        <span className="bg-amber-400 text-stone-950 px-2 py-0.5 rounded text-[10px] font-black">
          PRECIOS INCLUYEN IVA
        </span>
        <span className="hidden sm:inline text-stone-300">• DESPACHO INMEDIATO EN QUITO & ENVÍOS NACIONALES</span>
      </div>

      {/* ── CLEAN NAV ── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Link href="/web" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-stone-950 flex items-center justify-center text-white font-black text-base shadow-sm group-hover:scale-105 transition-transform">
              ⚛
            </div>
            <div className="leading-none">
              <span className="font-heading font-black text-lg tracking-wider text-stone-950">ATOMIC</span>
              <span className="block text-[9px] font-mono text-stone-500 tracking-widest uppercase">MONITORES & PANTALLAS</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-xs font-mono font-bold uppercase tracking-wider text-stone-600">
            <a href="#catalogo" className="hover:text-stone-950 transition-colors">Catálogo de Pantallas</a>
            <a href="#gaming-vs-office" className="hover:text-stone-950 transition-colors">144Hz vs 120Hz vs 60Hz</a>
            <a href="#garantia" className="hover:text-stone-950 transition-colors">Garantía Tecnomega</a>
          </div>

          <div className="flex items-center gap-3">
            <a 
              href={`https://wa.me/${officialPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-mono font-bold transition-all"
            >
              <Phone size={13} className="text-emerald-600" />
              <span>{formattedPhone}</span>
            </a>

            <Link
              href="/web/cart"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-stone-950 hover:bg-stone-800 text-white text-xs font-mono font-bold tracking-wider shadow-sm transition-all"
            >
              <ShoppingCart size={15} />
              <span className="hidden sm:inline">Carrito</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO SPOTLIGHT SHOWCASE: FEATURED MONITOR ── */}
      <section className="relative overflow-hidden pt-10 pb-16 px-4 sm:px-8 bg-gradient-to-b from-white via-stone-50 to-stone-50 border-b border-stone-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* LEFT: MONITOR INFORMATION & SPECS */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-stone-900 text-white text-[11px] font-mono font-black uppercase tracking-wider">
                {activeMonitor.brand} OFICIAL
              </span>
              <span className={`px-3 py-1 rounded-full text-[11px] font-mono font-black uppercase tracking-wider ${activeMonitor.badgeColor}`}>
                {activeMonitor.badge}
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-mono font-bold">
                ✓ Entrega Inmediata
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-stone-950 tracking-tight uppercase leading-[1.1]">
              {activeMonitor.title}
            </h1>

            <p className="text-stone-600 text-sm sm:text-base font-sans leading-relaxed max-w-xl">
              Equipado con panel <strong>{activeMonitor.panel}</strong> de alta fidelidad cromática, 
              fluidez cinematográfica de <strong>{activeMonitor.hz}</strong> con <strong>{activeMonitor.responseTime}</strong> de respuesta 
              y certificación contra fatiga visual para jornadas intensivas de juego y trabajo.
            </p>

            {/* Price Box with Margin Breakdown */}
            <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm max-w-md space-y-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs font-mono text-stone-400 line-through block">
                    Precio Regular: ${activeMonitor.compareAtPrice.toFixed(2)} USD
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-heading font-black text-stone-950">
                      ${activeMonitor.price.toFixed(2)}
                    </span>
                    <span className="text-xs font-mono font-bold text-stone-500 uppercase">
                      USD (Inc. IVA)
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-red-600 text-white font-mono font-black text-xs">
                  -${(activeMonitor.compareAtPrice - activeMonitor.price).toFixed(0)} OFF
                </span>
              </div>

              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs font-mono text-stone-500">
                <span>Código Tecnomega:</span>
                <span className="font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                  {activeMonitor.sku}
                </span>
              </div>
            </div>

            {/* Key Features Bullet List */}
            <div className="space-y-2 text-xs text-stone-700">
              {activeMonitor.features.slice(0, 3).map((f, fIdx) => (
                <div key={fIdx} className="flex items-start gap-2">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>{f}</span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 max-w-md">
              <button
                type="button"
                onClick={() => handleAddToCart(activeMonitor)}
                className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-stone-950 hover:bg-stone-800 text-white font-mono font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <ShoppingCart size={16} />
                <span>{addedSku === activeMonitor.sku ? "¡Agregado al Carrito!" : "Añadir al Carrito"}</span>
              </button>

              <button
                type="button"
                onClick={() => handleWhatsAppBuy(activeMonitor)}
                className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-black text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Phone size={16} />
                <span>Pedir por WhatsApp</span>
              </button>
            </div>

            {/* Guarantees */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-stone-500 pt-2">
              <span className="flex items-center gap-1.5">
                <Award size={14} className="text-amber-500" />
                {activeMonitor.warranty}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-600" />
                Caja Sellada de Fábrica
              </span>
            </div>

          </div>

          {/* RIGHT: CLEAN SQUARE WHITE MONITOR IMAGE */}
          <div className="lg:col-span-5 flex flex-col items-center">
            
            <div className="relative w-full max-w-[460px] aspect-square rounded-3xl bg-white border border-stone-200/90 shadow-[0_20px_50px_rgba(0,0,0,0.06)] p-6 flex items-center justify-center group overflow-hidden">
              
              <div className="absolute top-4 left-4 z-20">
                <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-800 border border-stone-200 text-[10px] font-mono font-black uppercase">
                  {activeMonitor.size} • {activeMonitor.hz} • {activeMonitor.panel}
                </span>
              </div>

              <div className="absolute top-4 right-4 z-20">
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  ORIGINAL
                </span>
              </div>

              <div className="relative w-full h-full">
                <Image
                  src={activeMonitor.image}
                  alt={activeMonitor.alt}
                  fill
                  priority
                  className="object-contain transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="absolute bottom-4 left-4 right-4 z-20 text-center">
                <span className="inline-block px-3 py-1 rounded-full bg-stone-900/90 text-white text-[10px] font-mono font-bold backdrop-blur-sm">
                  ⚡ {activeMonitor.ports.join(" • ")}
                </span>
              </div>

            </div>

            {/* Quick Switcher Thumbnails */}
            <div className="flex items-center gap-2 mt-4 overflow-x-auto max-w-full p-1">
              {MONITORS_DATA.map(m => (
                <button
                  key={m.sku}
                  type="button"
                  onClick={() => setActiveItemSku(m.sku)}
                  className={`w-14 h-14 rounded-xl border p-1 bg-white relative overflow-hidden transition-all shrink-0 cursor-pointer ${
                    activeItemSku === m.sku 
                      ? "border-stone-950 ring-2 ring-stone-950/20 scale-105 shadow-md" 
                      : "border-stone-200 opacity-60 hover:opacity-100"
                  }`}
                  title={m.title}
                >
                  <Image
                    src={m.image}
                    alt={m.title}
                    fill
                    className="object-contain p-0.5"
                  />
                </button>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* ── FILTROS Y CATÁLOGO COMPLETO DE MONITORES ── */}
      <section id="catalogo" className="max-w-7xl mx-auto px-4 sm:px-8 py-16 space-y-10">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
          <div>
            <span className="text-xs font-mono font-bold uppercase text-stone-500 tracking-wider">
              CATÁLOGO TECNOMEGA CON MARGEN OFICIAL
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-stone-950 uppercase">
              Monitores Gaming & Corporativos
            </h2>
          </div>

          {/* Brand Filter Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono text-stone-500 font-bold mr-1">Marca:</span>
            {["ALL", "ASUS", "LG", "GIGABYTE", "DELL"].map(brand => (
              <button
                key={brand}
                type="button"
                onClick={() => setSelectedBrand(brand)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  selectedBrand === brand 
                    ? "bg-stone-950 text-white shadow-sm" 
                    : "bg-white border border-stone-200 text-stone-700 hover:border-stone-400"
                }`}
              >
                {brand === "ALL" ? "Todas" : brand}
              </button>
            ))}
          </div>
        </div>

        {/* Monitors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMonitors.map(item => {
            const isActive = item.sku === activeItemSku

            return (
              <div 
                key={item.sku}
                className={`rounded-3xl bg-white border-2 p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl ${
                  isActive 
                    ? "border-stone-950 shadow-lg ring-2 ring-stone-950/20" 
                    : "border-stone-200 hover:border-stone-300"
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-black uppercase ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                  <span className="text-[11px] font-mono text-stone-400 font-bold">
                    {item.sku}
                  </span>
                </div>

                {/* Pure White Square Image */}
                <div className="relative w-full aspect-square bg-white rounded-2xl p-4 mb-4 overflow-hidden group border border-stone-100">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-2 left-2 right-2 text-center">
                    <span className="inline-block px-2.5 py-0.5 rounded-md bg-stone-100 text-[10px] font-mono font-bold text-stone-700 border border-stone-200">
                      {item.size} • {item.panel} • {item.hz}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <h3 className="font-heading font-black text-base text-stone-950 uppercase leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-stone-500 font-mono">
                      Garantía: {item.warranty}
                    </p>
                  </div>

                  {/* Ports */}
                  <div className="pt-2 border-t border-stone-100 text-xs font-mono text-stone-600">
                    <span className="font-bold text-stone-900 block mb-1">Puertos:</span>
                    <div className="flex flex-wrap gap-1">
                      {item.ports.map((p, pIdx) => (
                        <span key={pIdx} className="px-2 py-0.5 bg-stone-100 rounded text-[10px] border border-stone-200">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Price Box */}
                  <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex items-baseline justify-between">
                    <div>
                      <span className="text-[11px] font-mono text-stone-400 line-through block">
                        Normal: ${item.compareAtPrice.toFixed(2)}
                      </span>
                      <div className="text-2xl font-heading font-black text-stone-950">
                        ${item.price.toFixed(2)}
                        <span className="text-[10px] font-mono text-stone-500 font-normal ml-1">Inc. IVA</span>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                      STOCK INMEDIATO
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveItemSku(item.sku)
                        handleAddToCart(item)
                      }}
                      className="py-2.5 px-3 rounded-xl bg-stone-950 hover:bg-stone-800 text-white font-mono font-bold text-xs uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <ShoppingCart size={13} />
                      <span>{addedSku === item.sku ? "¡Listo!" : "Al Carrito"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveItemSku(item.sku)
                        handleWhatsAppBuy(item)
                      }}
                      className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Phone size={13} />
                      <span>WhatsApp</span>
                    </button>
                  </div>
                </div>

              </div>
            )
          })}
        </div>
      </section>

      {/* ── GUÍA TÉCNICA: 144Hz VS 120Hz VS 60Hz ── */}
      <section id="gaming-vs-office" className="max-w-7xl mx-auto px-4 sm:px-8 py-16 border-t border-stone-200">
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-8">
          <div className="text-center space-y-1 max-w-2xl mx-auto">
            <span className="text-xs font-mono font-bold uppercase text-stone-500 tracking-wider">
              INGENIERÍA VISUAL
            </span>
            <h3 className="text-2xl sm:text-3xl font-heading font-black text-stone-950 uppercase">
              ¿Qué Frecuencia de Actualización Necesitas?
            </h3>
            <p className="text-xs text-stone-600">
              Conoce la diferencia real en fluidez, salud ocular y rendimiento competitivo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <span className="px-2.5 py-1 rounded bg-rose-600 text-white text-[10px] font-mono font-bold">
                144Hz / 170Hz OC (LG & GIGABYTE)
              </span>
              <h4 className="font-heading font-black text-base text-stone-950 uppercase pt-1">
                Gaming Competitivo & eSports
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed font-sans">
                Renderiza 144 imágenes por segundo. En shooters como CS2, Valorant o Warzone, reduce a la mitad el retraso visual frente a un monitor tradicional, permitiendo fijar la mira antes que tu rival.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <span className="px-2.5 py-1 rounded bg-teal-600 text-white text-[10px] font-mono font-bold">
                120Hz SmoothMotion (ASUS Eye Care)
              </span>
              <h4 className="font-heading font-black text-base text-stone-950 uppercase pt-1">
                Híbrido Trabajo + Gaming Diario
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed font-sans">
                El balance perfecto para quienes trabajan 8 horas al día y juegan por la noche. Movimiento ultra suave del cursor y ventanas, reduciendo el parpadeo y la fatiga ocular a largo plazo.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <span className="px-2.5 py-1 rounded bg-sky-700 text-white text-[10px] font-mono font-bold">
                60Hz HD+ Multi-Puerto (Dell Pro 20)
              </span>
              <h4 className="font-heading font-black text-base text-stone-950 uppercase pt-1">
                Oficinas, Puntos de Venta & Servidores
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed font-sans">
                Máxima compatibilidad con computadoras antiguas y modernas gracias a sus puertos HDMI, DisplayPort y VGA simultáneos. Eficiencia energética de clase corporativa y 3 años de garantía VIP.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="mt-16 border-t border-stone-200 bg-white py-10 px-4 text-center text-xs text-stone-500 font-mono">
        <div className="max-w-7xl mx-auto space-y-4">
          <p className="text-stone-800 font-bold">
            © {new Date().getFullYear()} ATOMIC • Monitores Oficiales Tecnomega Ecuador
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-stone-500">
            <Link href="/web" className="hover:text-stone-950 transition-colors">Tienda Oficial</Link>
            <span>•</span>
            <Link href="/web/adata-hd710" className="hover:text-stone-950 transition-colors">Discos Duros ADATA HD710</Link>
            <span>•</span>
            <Link href="/web/cerraduras-oferta" className="hover:text-stone-950 transition-colors">Cerraduras Smart</Link>
            <span>•</span>
            <Link href="/web/cart" className="hover:text-stone-950 transition-colors">Carrito</Link>
          </div>
          <p className="text-[11px] text-stone-400">
            Precios con IVA incluido y márgenes oficiales calculados • Garantía de fábrica autorizada en Ecuador.
          </p>
        </div>
      </footer>

      {/* ── STICKY BOTTOM BAR ── */}
      <aside className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-stone-200 py-3 px-4 shadow-[0_-10px_25px_rgba(0,0,0,0.05)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
              <Image
                src={activeMonitor.image}
                alt={activeMonitor.title}
                fill
                className="object-contain p-1"
              />
            </div>
            <div className="font-mono text-xs hidden sm:block">
              <span className="font-bold text-stone-950 block truncate max-w-md">
                {activeMonitor.title}
              </span>
              <span className="text-[11px] text-stone-500">
                Código: {activeMonitor.sku} • {activeMonitor.hz}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right font-mono">
              <span className="text-xs text-stone-400 line-through hidden sm:block">
                ${activeMonitor.compareAtPrice.toFixed(2)}
              </span>
              <span className="text-lg sm:text-xl font-heading font-black text-stone-950">
                ${activeMonitor.price.toFixed(2)}
              </span>
              <span className="text-[9px] text-stone-500 font-mono block">Inc. IVA</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleAddToCart(activeMonitor)}
                className="py-2.5 px-4 rounded-xl bg-stone-950 hover:bg-stone-800 text-white font-mono font-bold text-xs uppercase flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              >
                <ShoppingCart size={14} />
                <span className="hidden sm:inline">{addedSku === activeMonitor.sku ? "¡Agregado!" : "Al Carrito"}</span>
              </button>

              <button
                type="button"
                onClick={() => handleWhatsAppBuy(activeMonitor)}
                className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs uppercase flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              >
                <Phone size={14} />
                <span>WhatsApp</span>
              </button>
            </div>
          </div>

        </div>
      </aside>

    </div>
  )
}
