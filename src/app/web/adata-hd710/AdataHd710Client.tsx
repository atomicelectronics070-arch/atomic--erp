"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { 
  ShieldCheck, Droplets, Zap, Sparkles, ShoppingCart, Phone, 
  ArrowRight, CheckCircle2, HardDrive, RefreshCw, Award, 
  Activity, Layers, Waves, AlertTriangle, ChevronRight, Check,
  Cpu, Compass, Lock, Sliders, ExternalLink
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

interface AdataHd710ClientProps {
  products: DbProduct[]
}

interface Variant {
  capacity: "1TB" | "2TB"
  color: "Amarillo" | "Rojo" | "Azul" | "Negro"
  colorHex: string
  colorBadgeClass: string
  accentColor: string
  borderAccent: string
  bgGlow: string
  sku: string
  price: number
  compareAtPrice: number
  image: string
  alt: string
  badgeText: string
}

const VARIANTS: Variant[] = [
  {
    capacity: "1TB",
    color: "Amarillo",
    colorHex: "#eab308",
    colorBadgeClass: "bg-yellow-500 text-stone-950",
    accentColor: "text-yellow-600",
    borderAccent: "border-yellow-400 ring-yellow-400/40",
    bgGlow: "rgba(234, 179, 8, 0.15)",
    sku: "HDDADA1TBHD710Y",
    price: 148.12,
    compareAtPrice: 175.00,
    image: "/images/adata-hd710/adata-hd710-1tb-amarillo.png",
    alt: "Disco Duro Externo ADATA 1TB HD710 Amarillo AntiShock",
    badgeText: "CYBER YELLOW • 1TB"
  },
  {
    capacity: "1TB",
    color: "Rojo",
    colorHex: "#ef4444",
    colorBadgeClass: "bg-red-500 text-white",
    accentColor: "text-red-600",
    borderAccent: "border-red-500 ring-red-500/40",
    bgGlow: "rgba(239, 68, 68, 0.15)",
    sku: "HDDADA1TBHD710R",
    price: 148.12,
    compareAtPrice: 175.00,
    image: "/images/adata-hd710/adata-hd710-1tb-rojo.png",
    alt: "Disco Duro Externo ADATA 1TB HD710 Rojo AntiShock",
    badgeText: "RACING RED • 1TB"
  },
  {
    capacity: "1TB",
    color: "Azul",
    colorHex: "#2563eb",
    colorBadgeClass: "bg-blue-600 text-white",
    accentColor: "text-blue-600",
    borderAccent: "border-blue-500 ring-blue-500/40",
    bgGlow: "rgba(37, 99, 235, 0.15)",
    sku: "HDDADA1TBHD710L",
    price: 148.12,
    compareAtPrice: 175.00,
    image: "/images/adata-hd710/adata-hd710-1tb-azul.png",
    alt: "Disco Duro Externo ADATA 1TB HD710 Azul AntiShock",
    badgeText: "ELECTRIC BLUE • 1TB"
  },
  {
    capacity: "2TB",
    color: "Negro",
    colorHex: "#18181b",
    colorBadgeClass: "bg-stone-900 text-white",
    accentColor: "text-stone-900",
    borderAccent: "border-stone-900 ring-stone-900/30",
    bgGlow: "rgba(24, 24, 27, 0.15)",
    sku: "HDDADA2TBHD710K",
    price: 178.80,
    compareAtPrice: 215.00,
    image: "/images/adata-hd710/adata-hd710-2tb-negro.png",
    alt: "Disco Duro Externo ADATA 2TB HD710 Negro AntiShock",
    badgeText: "STEALTH OBSIDIAN • 2TB"
  },
  {
    capacity: "2TB",
    color: "Rojo",
    colorHex: "#dc2626",
    colorBadgeClass: "bg-red-600 text-white",
    accentColor: "text-red-600",
    borderAccent: "border-red-600 ring-red-600/40",
    bgGlow: "rgba(220, 38, 38, 0.15)",
    sku: "HDDADA2TBHD710R",
    price: 178.80,
    compareAtPrice: 215.00,
    image: "/images/adata-hd710/adata-hd710-2tb-rojo.png",
    alt: "Disco Duro Externo ADATA 2TB HD710 Rojo AntiShock",
    badgeText: "RACING RED • 2TB"
  }
]

export default function AdataHd710Client({ products }: AdataHd710ClientProps) {
  const { addToCart } = useCart()
  const [selectedVariantIndex, setSelectedVariantIndex] = useState<number>(0)
  const [selectedCapacityFilter, setSelectedCapacityFilter] = useState<"ALL" | "1TB" | "2TB">("ALL")
  const [addedItem, setAddedItem] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<"resistencia" | "specs" | "compatibilidad">("resistencia")

  const officialPhone = "593980319050"
  const formattedPhone = "098 031 9050"

  const currentVariant = VARIANTS[selectedVariantIndex]

  const filteredVariants = selectedCapacityFilter === "ALL" 
    ? VARIANTS 
    : VARIANTS.filter(v => v.capacity === selectedCapacityFilter)

  const handleAddToCart = () => {
    const dbMatch = products.find(p => p.sku === currentVariant.sku)
    
    addToCart({
      id: dbMatch ? dbMatch.id : currentVariant.sku,
      name: `Disco Duro Externo ADATA ${currentVariant.capacity} HD710 (${currentVariant.color})`,
      price: currentVariant.price,
      image: currentVariant.image,
      quantity: 1
    })

    setAddedItem(true)
    setTimeout(() => setAddedItem(false), 3000)
  }

  const handleWhatsAppBuy = () => {
    const message = encodeURIComponent(
      `¡Hola ATOMIC! 👋 Deseo comprar el Disco Duro Externo ADATA HD710:\n\n` +
      `💾 *Capacidad:* ${currentVariant.capacity}\n` +
      `🎨 *Color:* ${currentVariant.color}\n` +
      `🏷️ *Código SKU:* ${currentVariant.sku}\n` +
      `💰 *Precio Oficial:* $${currentVariant.price.toFixed(2)} USD (Incluye IVA)\n\n` +
      `¿Tienen disponibilidad para despacho hoy mismo? Por favor indíquenme los métodos de pago y entrega en Quito / Envíos nacionales.`
    )

    window.open(`https://wa.me/${officialPhone}?text=${message}`, "_blank")
  }

  return (
    <div className="min-h-screen bg-white text-stone-900 font-sans selection:bg-stone-900 selection:text-white">
      
      {/* ── TOP ANNOUNCEMENT BAR: DISTRIBUCIÓN OFICIAL & IVA INCLUIDO ── */}
      <div className="bg-stone-100 border-b border-stone-200 px-4 py-2 text-center text-xs font-mono font-bold tracking-wide uppercase flex items-center justify-center gap-2 flex-wrap text-stone-700">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>DISCOS DUROS BLINDADOS ADATA HD710 // DISTRIBUCIÓN TECNOMEGA ECUADOR</span>
        <span className="bg-stone-900 text-white px-2 py-0.5 rounded text-[10px]">
          PRECIOS INCLUYEN IVA
        </span>
        <span className="hidden sm:inline text-stone-500">• 100% ORIGINALES CON GARANTÍA</span>
      </div>

      {/* ── CLEAN WHITE HEADER ── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Link href="/web" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-stone-950 flex items-center justify-center text-white font-black text-base shadow-sm group-hover:scale-105 transition-transform">
              ⚛
            </div>
            <div className="leading-none">
              <span className="font-heading font-black text-lg tracking-wider text-stone-950">ATOMIC</span>
              <span className="block text-[9px] font-mono text-stone-500 tracking-widest uppercase">ALMACENAMIENTO PRO</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-xs font-mono font-bold uppercase tracking-wider text-stone-600">
            <a href="#catalogo" className="hover:text-stone-950 transition-colors">Catálogo de Colores</a>
            <a href="#resistencia" className="hover:text-stone-950 transition-colors">Test Militar & IP68</a>
            <a href="#specs" className="hover:text-stone-950 transition-colors">Ficha Técnica</a>
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

      {/* ── HERO SECTION: CLEAN WHITE STUDIO WITH DYNAMIC ACCENT ── */}
      <section className="relative overflow-hidden pt-10 pb-16 px-4 sm:px-8 bg-gradient-to-b from-stone-50 via-white to-white border-b border-stone-100">
        
        {/* Subtle Ambient Glow matching selected device */}
        <div 
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none transition-all duration-700 opacity-60"
          style={{ background: currentVariant.bgGlow }}
        />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          
          {/* LEFT COLUMN: HERO INFORMATION & PRICING */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-stone-950 text-white text-[11px] font-mono font-black uppercase tracking-wider">
                ADATA HD710 PRO
              </span>
              <span className={`px-3 py-1 rounded-full text-[11px] font-mono font-black uppercase tracking-wider ${currentVariant.colorBadgeClass}`}>
                {currentVariant.badgeText}
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-mono font-bold">
                ✓ Disponibilidad Inmediata
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-black text-stone-950 tracking-tight uppercase leading-[1.08]">
              DISCO DURO EXTERNO <br />
              <span 
                className="transition-colors duration-500"
                style={{ color: currentVariant.colorHex }}
              >
                ADATA HD710 {currentVariant.capacity}
              </span> <br />
              <span className="text-stone-400 text-2xl sm:text-4xl">ANTISHOCK & WATER RESIST</span>
            </h1>

            <p className="text-stone-600 text-sm sm:text-base font-sans leading-relaxed max-w-xl">
              Diseñado para sobrevivir a las condiciones más extremas. Certificación militar de caídas 
              <strong> MIL-STD-810G</strong>, sellado hermético sumergible <strong>IP68</strong> y sensores inteligentes 
              <strong> G-Shock</strong> que protegen tus datos valiosos en todo momento.
            </p>

            {/* Price Showcase */}
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/90 max-w-md space-y-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs font-mono text-stone-400 line-through block">
                    Precio Regular: ${currentVariant.compareAtPrice.toFixed(2)} USD
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-heading font-black text-stone-950">
                      ${currentVariant.price.toFixed(2)}
                    </span>
                    <span className="text-xs font-mono font-bold text-stone-500 uppercase">
                      USD (Precio Incluye IVA)
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-mono font-black text-xs">
                  EN STOCK
                </span>
              </div>

              <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-xs font-mono text-stone-600">
                <span>Código Tecnomega:</span>
                <span className="font-bold text-stone-900 bg-white px-2 py-0.5 rounded border border-stone-300">
                  {currentVariant.sku}
                </span>
              </div>
            </div>

            {/* Capacity & Color Quick Toggles */}
            <div className="space-y-4 pt-2">
              
              {/* Capacity Toggle */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-stone-500 mb-2">
                  1. Selecciona la Capacidad:
                </label>
                <div className="inline-flex p-1 bg-stone-100 rounded-xl border border-stone-200">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCapacityFilter("1TB")
                      const target = VARIANTS.findIndex(v => v.capacity === "1TB")
                      if (target !== -1) setSelectedVariantIndex(target)
                    }}
                    className={`px-5 py-2 rounded-lg text-xs font-mono font-black transition-all cursor-pointer ${
                      currentVariant.capacity === "1TB"
                        ? "bg-white text-stone-950 shadow-sm"
                        : "text-stone-600 hover:text-stone-950"
                    }`}
                  >
                    1TB ($148.12 Inc. IVA)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCapacityFilter("2TB")
                      const target = VARIANTS.findIndex(v => v.capacity === "2TB")
                      if (target !== -1) setSelectedVariantIndex(target)
                    }}
                    className={`px-5 py-2 rounded-lg text-xs font-mono font-black transition-all cursor-pointer ${
                      currentVariant.capacity === "2TB"
                        ? "bg-white text-stone-950 shadow-sm"
                        : "text-stone-600 hover:text-stone-950"
                    }`}
                  >
                    2TB ($178.80 Inc. IVA)
                  </button>
                </div>
              </div>

              {/* Color Swatches */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-stone-500 mb-2">
                  2. Selecciona el Color del Chasis ({currentVariant.color}):
                </label>
                <div className="flex items-center gap-3">
                  {VARIANTS.map((v, idx) => {
                    const isSelected = selectedVariantIndex === idx
                    return (
                      <button
                        key={v.sku}
                        type="button"
                        onClick={() => setSelectedVariantIndex(idx)}
                        className={`group relative p-1 rounded-2xl border-2 transition-all cursor-pointer ${
                          isSelected 
                            ? `${v.borderAccent} scale-105 shadow-md` 
                            : "border-stone-200 hover:border-stone-400"
                        }`}
                        title={`${v.color} (${v.capacity})`}
                      >
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-mono text-[10px] font-black shadow-inner"
                          style={{ backgroundColor: v.colorHex }}
                        >
                          {isSelected && <Check size={16} strokeWidth={3} className={v.color === "Amarillo" ? "text-stone-950" : "text-white"} />}
                        </div>
                        <span className="block text-[9px] font-mono text-center mt-1 text-stone-600 font-bold">
                          {v.color.slice(0, 3)}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 max-w-md">
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-stone-950 hover:bg-stone-800 text-white font-mono font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <ShoppingCart size={16} />
                <span>{addedItem ? "¡Agregado al Carrito!" : "Añadir al Carrito"}</span>
              </button>

              <button
                type="button"
                onClick={handleWhatsAppBuy}
                className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-black text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Phone size={16} />
                <span>Comprar WhatsApp</span>
              </button>
            </div>

            {/* Quick Guarantees */}
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-mono text-stone-500">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-600" />
                Garantía Oficial ADATA
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Zap size={14} className="text-amber-500" />
                Entrega Inmediata en Quito
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-blue-600" />
                Factura Oficial con IVA
              </span>
            </div>

          </div>

          {/* RIGHT COLUMN: PRISTINE SQUARE WHITE BACKGROUND PRODUCT IMAGE */}
          <div className="lg:col-span-5 flex flex-col items-center">
            
            <div className="relative w-full max-w-[460px] aspect-square rounded-3xl bg-white border border-stone-200/90 shadow-[0_20px_50px_rgba(0,0,0,0.06)] p-8 flex items-center justify-center group overflow-hidden">
              
              {/* Product Badge Overlay */}
              <div className="absolute top-4 left-4 z-20">
                <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-800 border border-stone-200 text-[10px] font-mono font-black uppercase tracking-wider">
                  {currentVariant.capacity} • {currentVariant.color}
                </span>
              </div>

              {/* Tecnomega Verified Pill */}
              <div className="absolute top-4 right-4 z-20">
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  ORIGINAL
                </span>
              </div>

              {/* The Isolated Square Product */}
              <div className="relative w-full h-full">
                <Image
                  src={currentVariant.image}
                  alt={currentVariant.alt}
                  fill
                  priority
                  className="object-contain transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Bottom Feature Pill */}
              <div className="absolute bottom-4 left-4 right-4 z-20 text-center">
                <span className="inline-block px-3 py-1 rounded-full bg-stone-900/90 text-white text-[10px] font-mono font-bold backdrop-blur-sm">
                  ⚡ USB 3.0 • IP68 SUMERGIBLE • ANTISHOCK
                </span>
              </div>

            </div>

            {/* Mini Gallery Switcher under Image */}
            <div className="flex items-center gap-2 mt-4">
              {VARIANTS.map((v, idx) => (
                <button
                  key={v.sku}
                  type="button"
                  onClick={() => setSelectedVariantIndex(idx)}
                  className={`w-12 h-12 rounded-xl border p-1 bg-white relative overflow-hidden transition-all cursor-pointer ${
                    selectedVariantIndex === idx 
                      ? `${v.borderAccent} scale-105 shadow-sm` 
                      : "border-stone-200 opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={v.image}
                    alt={v.color}
                    fill
                    className="object-contain p-0.5"
                  />
                </button>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* ── 4 PILARES DE RESISTENCIA Y TECNOLOGÍA ── */}
      <section id="resistencia" className="max-w-7xl mx-auto px-4 sm:px-8 py-16 space-y-12">
        <div className="text-center space-y-2 max-w-3xl mx-auto">
          <span className="text-xs font-mono font-black uppercase text-stone-500 tracking-widest">
            INGENIERÍA EXTREMA A PRUEBA DE TODO
          </span>
          <h2 className="text-2xl sm:text-4xl font-heading font-black text-stone-950 uppercase tracking-tight">
            ¿Por qué el ADATA HD710 es el Disco Más Fuerte del Mundo?
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm font-sans">
            Construido con materiales de estándar industrial automotriz para usuarios que no pueden permitirse perder su información ante caídas, lluvia o polvo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: IP68 Water & Dust */}
          <div className="p-6 rounded-3xl bg-stone-50 border border-stone-200 space-y-3 hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Droplets size={24} />
            </div>
            <h3 className="font-heading font-black text-base text-stone-950 uppercase">
              Sumergible IP68 (2 Metros)
            </h3>
            <p className="text-xs text-stone-600 font-sans leading-relaxed">
              Supera con creces el estándar IPX8. Puede permanecer sumergido bajo 2 metros de agua durante 60 minutos ininterrumpidos sin que penetre una sola gota.
            </p>
          </div>

          {/* Card 2: Military Drop MIL-STD-810G */}
          <div className="p-6 rounded-3xl bg-stone-50 border border-stone-200 space-y-3 hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <ShieldCheck size={24} />
            </div>
            <h3 className="font-heading font-black text-base text-stone-950 uppercase">
              Certificación Militar 1.5M
            </h3>
            <p className="text-xs text-stone-600 font-sans leading-relaxed">
              Cumple el estándar estricto del ejército estadounidense MIL-STD-810G 516.6. Resiste impactos tras 26 caídas sucesivas sobre concreto.
            </p>
          </div>

          {/* Card 3: G-Shock Sensors */}
          <div className="p-6 rounded-3xl bg-stone-50 border border-stone-200 space-y-3 hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
              <Activity size={24} />
            </div>
            <h3 className="font-heading font-black text-base text-stone-950 uppercase">
              Sensores de Impacto G-Shock
            </h3>
            <p className="text-xs text-stone-600 font-sans leading-relaxed">
              Si el disco sufre una vibración o golpe durante una transferencia, el sensor detiene de inmediato el movimiento mecánico y activa un LED rojo de alerta.
            </p>
          </div>

          {/* Card 4: Wrap-Around Cable */}
          <div className="p-6 rounded-3xl bg-stone-50 border border-stone-200 space-y-3 hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-2xl bg-stone-200 text-stone-900 flex items-center justify-center">
              <Layers size={24} />
            </div>
            <h3 className="font-heading font-black text-base text-stone-950 uppercase">
              Cable USB Envolvente
            </h3>
            <p className="text-xs text-stone-600 font-sans leading-relaxed">
              Ranura lateral envolvente en el chasis de silicona que sujeta el cable USB 3.0 de alta velocidad. Olvídate de olvidar o perder cables de conexión.
            </p>
          </div>

        </div>
      </section>

      {/* ── CATÁLOGO COMPLETO DE PRODUCTOS DISPONIBLES ── */}
      <section id="catalogo" className="max-w-7xl mx-auto px-4 sm:px-8 py-16 border-t border-stone-200 space-y-10">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-bold uppercase text-stone-500 tracking-wider">
              INVENTARIO DISPONIBLE TECNOMEGA
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-stone-950 uppercase">
              Todos los Modelos y Capacidades
            </h2>
          </div>

          {/* Capacity Filter Pills */}
          <div className="flex items-center gap-2 bg-stone-100 p-1 rounded-xl border border-stone-200">
            {(["ALL", "1TB", "2TB"] as const).map(cap => (
              <button
                key={cap}
                type="button"
                onClick={() => setSelectedCapacityFilter(cap)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  selectedCapacityFilter === cap 
                    ? "bg-white text-stone-950 shadow-sm" 
                    : "text-stone-600 hover:text-stone-950"
                }`}
              >
                {cap === "ALL" ? "Ver Todos" : cap}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVariants.map((item, idx) => {
            const isSelected = VARIANTS[selectedVariantIndex].sku === item.sku

            return (
              <div 
                key={item.sku}
                className={`rounded-3xl bg-white border-2 p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl ${
                  isSelected 
                    ? `${item.borderAccent} shadow-lg ring-2` 
                    : "border-stone-200 hover:border-stone-300"
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-black uppercase ${item.colorBadgeClass}`}>
                    {item.capacity} • {item.color}
                  </span>
                  <span className="text-[11px] font-mono text-stone-400 font-bold">
                    {item.sku}
                  </span>
                </div>

                {/* Pure White Square Image */}
                <div className="relative w-full aspect-square bg-stone-50/60 rounded-2xl p-4 mb-4 overflow-hidden group">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Details */}
                <div className="space-y-3">
                  <h3 className="font-heading font-black text-sm text-stone-950 uppercase leading-snug">
                    ADATA HD710 {item.capacity} ({item.color})
                  </h3>
                  
                  <div className="flex items-baseline justify-between pt-2 border-t border-stone-100">
                    <div>
                      <span className="text-[11px] font-mono text-stone-400 line-through block">
                        Normal: ${item.compareAtPrice.toFixed(2)}
                      </span>
                      <div className="text-2xl font-heading font-black text-stone-950">
                        ${item.price.toFixed(2)}
                        <span className="text-[10px] font-mono text-stone-500 font-normal ml-1">Inc. IVA</span>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono font-bold bg-stone-100 text-stone-700 px-2 py-1 rounded">
                      USB 3.0 • IP68
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        const targetIdx = VARIANTS.findIndex(v => v.sku === item.sku)
                        if (targetIdx !== -1) setSelectedVariantIndex(targetIdx)
                        handleAddToCart()
                      }}
                      className="py-2.5 px-3 rounded-xl bg-stone-950 hover:bg-stone-800 text-white font-mono font-bold text-xs uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <ShoppingCart size={13} />
                      <span>Al Carrito</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const targetIdx = VARIANTS.findIndex(v => v.sku === item.sku)
                        if (targetIdx !== -1) setSelectedVariantIndex(targetIdx)
                        handleWhatsAppBuy()
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

      {/* ── TABLA TÉCNICA OFICIAL TECNOMEGA / ADATA ── */}
      <section id="specs" className="max-w-5xl mx-auto px-4 sm:px-8 py-16 border-t border-stone-200 space-y-8">
        <div className="text-center space-y-1">
          <span className="text-xs font-mono font-bold uppercase text-stone-500 tracking-wider">ESPECIFICACIONES INDUSTRIALES</span>
          <h2 className="text-2xl font-heading font-black text-stone-950 uppercase">Ficha Técnica ADATA HD710</h2>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white shadow-sm">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <tbody className="divide-y divide-stone-200">
              <tr className="bg-stone-50">
                <td className="p-4 font-bold text-stone-900 w-1/3">Capacidades Disponibles</td>
                <td className="p-4 text-stone-700">1TB (Amarillo, Rojo, Azul) • 2TB (Negro, Rojo)</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-stone-900">Interfaz de Conexión</td>
                <td className="p-4 text-stone-700">USB 3.2 Gen 1 (compatible con USB 3.0 y USB 2.0 a 5 Gbps)</td>
              </tr>
              <tr className="bg-stone-50">
                <td className="p-4 font-bold text-stone-900">Certificación Militar Caídas</td>
                <td className="p-4 text-emerald-700 font-bold">MIL-STD-810G 516.6 (Pruebas de impacto a 1.5 metros)</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-stone-900">Resistencia al Agua y Polvo</td>
                <td className="p-4 text-blue-700 font-bold">IP68 (Inmersión total a 2 metros durante 60 minutos)</td>
              </tr>
              <tr className="bg-stone-50">
                <td className="p-4 font-bold text-stone-900">Sensores de Movimiento</td>
                <td className="p-4 text-stone-700">G-Shock Sensor Technology con indicador LED de estado</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-stone-900">Dimensiones Físicas</td>
                <td className="p-4 text-stone-700">133.3 mm × 98.5 mm × 21.5 mm</td>
              </tr>
              <tr className="bg-stone-50">
                <td className="p-4 font-bold text-stone-900">Peso Neto</td>
                <td className="p-4 text-stone-700">270 g (1TB) / 390 g (2TB)</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-stone-900">Compatibilidad de Sistemas</td>
                <td className="p-4 text-stone-700">Windows 7 / 8 / 10 / 11, macOS X 10.6 o posterior, Linux Kernel 2.6+</td>
              </tr>
              <tr className="bg-stone-50">
                <td className="p-4 font-bold text-stone-900">Garantía & Origen</td>
                <td className="p-4 text-stone-700">Garantía oficial Tecnomega Ecuador con factura autorizada SRI</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="mt-16 border-t border-stone-200 bg-stone-50 py-10 px-4 text-center text-xs text-stone-500 font-mono">
        <div className="max-w-7xl mx-auto space-y-4">
          <p className="text-stone-700 font-bold">
            © {new Date().getFullYear()} ATOMIC • Distribución Oficial ADATA HD710 Tecnomega Ecuador
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-stone-500">
            <Link href="/web" className="hover:text-stone-950 transition-colors">Tienda Oficial</Link>
            <span>•</span>
            <Link href="/web/cerraduras-oferta" className="hover:text-stone-950 transition-colors">Cerraduras Inteligentes</Link>
            <span>•</span>
            <Link href="/web/anker-solix" className="hover:text-stone-950 transition-colors">Anker SOLIX C300</Link>
            <span>•</span>
            <Link href="/web/cart" className="hover:text-stone-950 transition-colors">Carrito de Compras</Link>
          </div>
          <p className="text-[11px] text-stone-400">
            Precios oficiales con IVA incluido • Despacho inmediato en Quito y envíos asegurados a todo el país.
          </p>
        </div>
      </footer>

      {/* ── STICKY QUICK BUY BOTTOM BAR ── */}
      <aside className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-stone-200 py-3 px-4 shadow-[0_-10px_25px_rgba(0,0,0,0.05)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
              <Image
                src={currentVariant.image}
                alt={currentVariant.color}
                fill
                className="object-contain p-1"
              />
            </div>
            <div className="font-mono text-xs hidden sm:block">
              <span className="font-bold text-stone-950 block">
                ADATA HD710 {currentVariant.capacity} ({currentVariant.color})
              </span>
              <span className="text-[11px] text-stone-500">
                Código: {currentVariant.sku}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right font-mono">
              <span className="text-xs text-stone-400 line-through hidden sm:block">
                ${currentVariant.compareAtPrice.toFixed(2)}
              </span>
              <span className="text-lg sm:text-xl font-heading font-black text-stone-950">
                ${currentVariant.price.toFixed(2)}
              </span>
              <span className="text-[9px] text-stone-500 font-mono block">Inc. IVA</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAddToCart}
                className="py-2.5 px-4 rounded-xl bg-stone-950 hover:bg-stone-800 text-white font-mono font-bold text-xs uppercase flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              >
                <ShoppingCart size={14} />
                <span className="hidden sm:inline">{addedItem ? "¡Agregado!" : "Al Carrito"}</span>
              </button>

              <button
                type="button"
                onClick={handleWhatsAppBuy}
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
