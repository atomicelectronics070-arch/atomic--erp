"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { 
  Zap, BatteryCharging, ShieldCheck, Sparkles, ShoppingCart, 
  Phone, ArrowRight, CheckCircle2, Cpu, Flame, Smartphone, 
  ExternalLink, Layers, Radio, Award, RefreshCw, Sun, ChevronRight,
  Lightbulb, Cable, Magnet, Check
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
}

interface PowerBankProduct {
  id: string
  sku: string
  name: string
  model: string
  badge: string
  capacity: string
  powerOutput: string
  price: number
  regularPrice: number
  image: string
  color: string
  highlightSpecs: string[]
  description: string
  cablesIncluded: string[]
  idealFor: string
  whatsappMsg: string
}

export default function HoraPowerBanksClient({ initialProducts }: { initialProducts: DbProduct[] }) {
  const { addToCart } = useCart()
  const [addedItem, setAddedItem] = useState<string | null>(null)
  const [selectedDevice, setSelectedDevice] = useState<number>(0)
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<'all' | '20000' | 'magsafe' | 'combo'>('all')

  const officialPhone = "593980319050"
  const formattedPhone = "098 031 9050"

  // Device specs for interactive simulator
  const DEVICES = [
    { name: "iPhone 15 / 16 Pro Max", batteryMah: 4685, icon: "📱", iconColor: "text-blue-400" },
    { name: "Samsung Galaxy S24 Ultra", batteryMah: 5000, icon: "⚡", iconColor: "text-purple-400" },
    { name: "Xiaomi 14 / Redmi Note", batteryMah: 5000, icon: "🔋", iconColor: "text-amber-400" },
    { name: "iPad Air / Tablet 11\"", batteryMah: 8820, icon: "💻", iconColor: "text-cyan-400" },
    { name: "AirPods / Audífonos TWS", batteryMah: 450, icon: "🎧", iconColor: "text-emerald-400" }
  ]

  const activeDev = DEVICES[selectedDevice]
  const charges20k = (20000 * 0.85 / activeDev.batteryMah).toFixed(1)
  const charges5k = (5000 * 0.82 / activeDev.batteryMah).toFixed(1)

  const PRODUCTS: PowerBankProduct[] = [
    {
      id: "cmw6-1h-gar159n",
      sku: "1H-GAR159N",
      name: "Banco de Carga 20000 mAh Negro con 4 Cables",
      model: "MOD. GAR159N",
      badge: "¡PRECIO ESPECIAL! $27.10",
      capacity: "20,000 mAh",
      powerOutput: "22.5W Carga Rápida",
      price: 27.10,
      regularPrice: 38.00,
      image: "/images/1hora/banco-20000-negro-gar159n.jpg",
      color: "Negro Carbón Texturizado",
      highlightSpecs: [
        "4 Cables integrados: USB, V8 (Micro-USB), Tipo-C e iOS (iPhone)",
        "Carga rápida de 22.5W con chip inteligente MultiTecnología",
        "Linterna LED doble de alta potencia integrada",
        "Display LED indicador de carga en tiempo real"
      ],
      description: "Olvídate de buscar cables. Este banco de 20,000 mAh lleva los 4 cables más utilizados del mercado directamente integrados en el cuerpo. Carga hasta 4 dispositivos simultáneamente con máxima seguridad.",
      cablesIncluded: ["USB-A", "Micro-USB (V8)", "USB Tipo-C", "Lightning (iPhone)"],
      idealFor: "Viajes largos, jornadas de trabajo fuera de oficina, delivery, emergencias y apagones.",
      whatsappMsg: "Hola ATOMIC / MultiTecnología, deseo pedir el Banco de Carga 20000 mAh NEGRO 1Hora (MOD. GAR159N) a $27.10 + IVA. ¿Tienen disponible para entrega inmediata?"
    },
    {
      id: "cmw6-1h-gar159r",
      sku: "1H-GAR159R",
      name: "Banco de Carga 20000 mAh Rojo Metálico con 4 Cables",
      model: "MOD. GAR159R",
      badge: "EDICIÓN DEPORTIVA RED",
      capacity: "20,000 mAh",
      powerOutput: "22.5W Carga Rápida",
      price: 27.10,
      regularPrice: 38.00,
      image: "/images/1hora/banco-20000-rojo-magsafe-combo.jpg",
      color: "Rojo Metálico Ferrari",
      highlightSpecs: [
        "4 Cables incorporados que se guardan en el chasis",
        "Potencia de 22.5W con entrega ultrarrápida de energía",
        "Linterna doble de emergencia para camping o apagones",
        "Diseño ecológico y carcasa de polímero ultra resistente"
      ],
      description: "La misma potencia colosal de 20,000 mAh en un vibrante color rojo metálico deportivo. Ideal para identificarlo fácilmente en tu mochila o vehículo.",
      cablesIncluded: ["USB-A", "Micro-USB (V8)", "USB Tipo-C", "Lightning (iPhone)"],
      idealFor: "Outdoor, viajes de aventura, deportistas, estudiantes y profesionales dinámicos.",
      whatsappMsg: "Hola ATOMIC / MultiTecnología, me interesa el Banco de Carga 20000 mAh ROJO 1Hora (MOD. GAR159R) a $27.10 + IVA. ¿Cómo coordino la compra?"
    },
    {
      id: "cmw6-1h-gar276n",
      sku: "1H-GAR276N",
      name: "Banco de Carga 5000 mAh Inalámbrico Magnético MagSafe",
      model: "MOD. GAR276N",
      badge: "¡OFERTA ESPECIAL! $28.90",
      capacity: "5,000 mAh",
      powerOutput: "15W Carga Inalámbrica",
      price: 28.90,
      regularPrice: 39.50,
      image: "/images/1hora/banco-5000-magsafe-gar276n.jpg",
      color: "Negro Mate Slim",
      highlightSpecs: [
        "Carga rápida inalámbrica de 15W sin ningún cable colgando",
        "Ajuste magnético ultra fuerte MagSafe (se adhiere al teléfono)",
        "Puerto bidireccional USB Tipo-C de alta velocidad",
        "Ultra compacto, peso pluma de bolsillo (menos de 125g)"
      ],
      description: "Carga tu teléfono con solo pegarlo a la parte trasera. Compatible con tecnología MagSafe de iPhone (12 al 16) y smartphones Samsung/Xiaomi con carcasa o aro magnético. Perfecto para seguir usando tu celular con una sola mano.",
      cablesIncluded: ["Inalámbrico Qi/MagSafe 15W", "Puerto USB-C Bidireccional"],
      idealFor: "Uso urbano diario, eventos, conciertos, transporte público y salidas nocturnas.",
      whatsappMsg: "Hola ATOMIC / MultiTecnología, deseo pedir el Banco de Carga Magnético MagSafe 5000 mAh 1Hora (MOD. GAR276N) a $28.90 + IVA. ¿Tienen stock en Quito?"
    },
    {
      id: "cmw6-1h-combo-duo",
      sku: "1H-COMBO-DUO",
      name: "Combo Dúo Carga Total 1Hora (20000 mAh + 5000 mAh MagSafe)",
      model: "COMBO PACK 1HORA",
      badge: "PACK DEFINITIVO • AHORRA $7",
      capacity: "25,000 mAh Totales",
      powerOutput: "22.5W + 15W MagSafe",
      price: 49.99,
      regularPrice: 65.00,
      image: "/images/1hora/banco-20000-rojo-magsafe-combo.jpg",
      color: "Kit Completo (20K + 5K MagSafe)",
      highlightSpecs: [
        "1 Banco 20000 mAh con 4 cables para autonomía máxima",
        "1 Banco 5000 mAh MagSafe magnético para el bolsillo",
        "Solución 360° para viajes largos y movilidad diaria",
        "Despacho prioritario asegurado por MultiTecnología"
      ],
      description: "El combo definitivo: lleva el monstruo de 20,000 mAh con sus 4 cables en la maleta para trabajar o viajar, y el banco magnético de 5,000 mAh pegado a tu teléfono para tus salidas cotidianas sin cables.",
      cablesIncluded: ["4 Cables Integrados + Carga Magnética Inalámbrica"],
      idealFor: "Quienes no quieren quedarse sin batería bajo ninguna circunstancia.",
      whatsappMsg: "Hola ATOMIC / MultiTecnología, quiero el COMBO DÚO 1HORA (20000 mAh + 5000 mAh MagSafe) por $49.99. ¿Hacen envíos a mi ciudad?"
    }
  ]

  const filteredProducts = selectedCategoryTab === 'all'
    ? PRODUCTS
    : selectedCategoryTab === '20000'
      ? PRODUCTS.filter(p => p.capacity.includes('20,000'))
      : selectedCategoryTab === 'magsafe'
        ? PRODUCTS.filter(p => p.sku === '1H-GAR276N')
        : PRODUCTS.filter(p => p.sku === '1H-COMBO-DUO')

  const handleAddToCart = (id: string, name: string, price: number, image: string) => {
    addToCart({
      id,
      name,
      price,
      quantity: 1,
      image
    })
    setAddedItem(id)
    setTimeout(() => setAddedItem(null), 2500)
  }

  return (
    <div className="min-h-screen bg-[#07090e] text-stone-100 font-sans selection:bg-cyan-400 selection:text-black relative overflow-x-hidden">
      
      {/* ── CYBERNETIC NEON GLOW & CIRCUIT AMBIENT ── */}
      <div className="fixed inset-0 bg-[radial-gradient(#162238_1px,transparent_1px)] [background-size:28px_28px] opacity-40 pointer-events-none" />
      <div className="fixed -top-40 left-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[180px] pointer-events-none" />
      <div className="fixed top-1/2 -right-40 w-[650px] h-[650px] bg-blue-600/10 rounded-full blur-[220px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[200px] pointer-events-none" />

      {/* ── TOP ANNOUNCEMENT BAR ── */}
      <div className="relative z-50 bg-gradient-to-r from-[#061826] via-[#0b2942] to-[#061826] border-b border-cyan-500/40 text-cyan-300 px-4 py-2 text-center text-xs font-mono font-bold tracking-wider flex items-center justify-center gap-2 shadow-sm">
        <Zap size={14} className="text-yellow-400 animate-bounce" />
        <span>DISTRIBUCIÓN OFICIAL MULTITECNOLOGÍA V&V • 1HORA ENERGÍA PORTÁTIL • BANCO 20000 mAh $27.10 • MAGSAFE 5000 mAh $28.90</span>
      </div>

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-40 bg-[#070b14]/90 backdrop-blur-2xl border-b border-cyan-950 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          <Link href="/web" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-600 via-blue-700 to-indigo-900 border border-cyan-400/50 flex items-center justify-center text-white font-black text-xl shadow-[0_0_20px_rgba(6,182,212,0.4)] group-hover:scale-105 transition-transform">
              <Zap size={20} className="fill-white text-yellow-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-xl font-black tracking-tight text-white uppercase font-sans">1Hora</span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-cyan-400 text-stone-950 uppercase font-mono">
                  MULTITECNOLOGÍA
                </span>
              </div>
              <p className="text-[10px] text-cyan-400/80 font-bold tracking-widest uppercase mt-0.5 font-mono">
                La Energía del Futuro • Carga Sin Límites
              </p>
            </div>
          </Link>

          {/* Quick Contact & Cart */}
          <div className="flex items-center gap-3">
            <a
              href={`https://wa.me/${officialPhone}?text=Hola%20ATOMIC%20y%20MultiTecnologia,%20deseo%20comprar%20Bancos%20de%20Carga%201Hora.`}
              target="_blank"
              rel="noreferrer"
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0d1527] border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 text-xs font-mono font-bold transition-all"
            >
              <Phone size={14} className="text-cyan-400" />
              <span>{formattedPhone}</span>
              <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-500/30">Asesoría</span>
            </a>

            <Link
              href="/web/cart"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0d1527] border border-slate-800 hover:border-cyan-700 text-stone-200 text-xs font-mono transition-all"
            >
              <ShoppingCart size={15} className="text-cyan-400" />
              <span className="hidden sm:inline">Carrito</span>
            </Link>

            <Link
              href="/web"
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-stone-950 text-xs font-black uppercase tracking-wider font-mono transition-all shadow-md"
            >
              Tienda General
            </Link>
          </div>

        </div>
      </header>

      {/* ── HERO BANNER FUTURISTA ── */}
      <section className="relative pt-10 pb-16 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Cyberpunk High-Energy Headlines */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold uppercase tracking-wider">
              <Sparkles size={14} className="text-cyan-400" />
              <span>Proveedor MultiTecnología V&V • 100% Original 1Hora</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase font-sans leading-[1.05]">
              La Energía del Futuro <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500">
                Carga Sin Límites
              </span>
            </h1>

            <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              Power banks de alto rendimiento con <strong>4 cables integrados</strong> para que nunca te quedes desconectado, y la nueva línea <strong>Inalámbrica Magnética MagSafe 15W</strong> que se adhiere directamente a tu teléfono.
            </p>

            {/* Quick Price Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3.5 rounded-2xl bg-[#0c1424] border border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
                <span className="text-[10px] font-mono text-cyan-400 uppercase block">Banco 20000 mAh</span>
                <div className="text-2xl sm:text-3xl font-black text-white font-mono">$27.10</div>
                <span className="text-[10px] text-stone-400 font-mono block">4 cables • 22.5W Fast</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#0c1424] border border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
                <span className="text-[10px] font-mono text-blue-400 uppercase block">MagSafe 5000 mAh</span>
                <div className="text-2xl sm:text-3xl font-black text-white font-mono">$28.90</div>
                <span className="text-[10px] text-stone-400 font-mono block">15W Qi • Ultra Slim</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#0c1424] border border-amber-500/40 col-span-2 sm:col-span-1">
                <span className="text-[10px] font-mono text-amber-400 uppercase block">Combo Dúo Carga</span>
                <div className="text-2xl sm:text-3xl font-black text-amber-300 font-mono">$49.99</div>
                <span className="text-[10px] text-stone-400 font-mono block">Ahorro de $6.00</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#catalogo-1hora"
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-stone-950 font-black text-xs uppercase tracking-wider font-mono shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all active:scale-95 cursor-pointer"
              >
                <span>Ver Modelos & Comprar Directo</span>
                <ArrowRight size={14} />
              </a>

              <a
                href={`https://wa.me/${officialPhone}?text=Hola%20ATOMIC%20y%20MultiTecnologia,%20deseo%20comprar%20el%20Banco%20de%20Carga%201Hora.`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-[#0d1629] hover:bg-[#13203c] border border-cyan-500/40 text-cyan-300 text-xs font-bold uppercase tracking-wider font-mono transition-all"
              >
                <Phone size={14} className="text-cyan-400" />
                <span>Pedir por WhatsApp ({formattedPhone})</span>
              </a>
            </div>

            {/* Micro Guarantees */}
            <div className="flex flex-wrap items-center gap-5 text-xs text-stone-400 pt-2 border-t border-slate-800">
              <div className="flex items-center gap-1.5">
                <Cpu size={14} className="text-cyan-400" />
                <span>Chip Inteligente Anti-Calentamiento</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-cyan-400" />
                <span>MultiTecnología V&V Oficial</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BatteryCharging size={14} className="text-cyan-400" />
                <span>Hasta 5-6 Cargas Completas</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Graphic with Cyber Glow */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border-2 border-cyan-500/50 shadow-[0_0_50px_rgba(6,182,212,0.25)] bg-[#0a101f] aspect-square group">
              <Image
                src="/images/1hora/banco-20000-rojo-magsafe-combo.jpg"
                alt="1Hora La Energía del Futuro MultiTecnología"
                fill
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-transparent to-black/30" />
              
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full bg-cyan-400 text-stone-950 text-[10px] font-black uppercase tracking-wider font-mono shadow-md">
                  TECNOLOGÍA 22.5W & 15W MAGSAFE
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-[#070b14]/90 backdrop-blur-md border border-cyan-900 text-left">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-cyan-400 font-mono font-bold uppercase block">Línea Oficial 1Hora</span>
                    <h4 className="text-xs font-black text-white uppercase">20000 mAh (4 Cables) + 5000 mAh MagSafe</h4>
                  </div>
                  <span className="text-xs font-black text-cyan-300 font-mono bg-cyan-950/80 px-2.5 py-1 rounded-lg border border-cyan-600">
                    Desde $27.10
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════════
          APARTADO 1: SIMULADOR DE CARGAS & AUTONOMÍA
      ══════════════════════════════════════════════════════════════════════════════ */}
      <section className="py-12 px-4 sm:px-8 max-w-7xl mx-auto border-t border-cyan-950">
        <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-[#0c1424] via-[#09101d] to-[#0c1424] border border-cyan-500/30 shadow-2xl">
          
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-[11px] font-mono font-bold uppercase tracking-wider border border-cyan-500/30">
              <BatteryCharging size={13} className="text-cyan-400" />
              <span>Simulador de Autonomía de Cargas</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-sans">
              ¿Cuántas Cargas Te Dará Cada Banco?
            </h2>
            <p className="text-stone-400 text-xs sm:text-sm">
              Selecciona tu dispositivo móvil para calcular exactamente la cantidad de cargas completas que te proporciona el banco de 20,000 mAh frente al MagSafe de 5,000 mAh.
            </p>
          </div>

          {/* Device Selector Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8 max-w-3xl mx-auto">
            {DEVICES.map((dev, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedDevice(idx)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  selectedDevice === idx
                    ? 'bg-cyan-400 text-stone-950 shadow-lg scale-105 font-black'
                    : 'bg-[#0f172a] hover:bg-[#1a253f] text-stone-300 border border-slate-800'
                }`}
              >
                <span>{dev.icon}</span>
                <span>{dev.name}</span>
                <span className="text-[10px] opacity-75 font-normal">({dev.batteryMah} mAh)</span>
              </button>
            ))}
          </div>

          {/* Results Grid Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            
            {/* 20000 mAh Result Card */}
            <div className="p-6 rounded-3xl bg-[#070b14] border border-cyan-500/40 relative overflow-hidden space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-cyan-950 pb-3">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase block">Máxima Capacidad</span>
                  <h3 className="text-base font-black text-white uppercase">Banco 20000 mAh (4 Cables)</h3>
                </div>
                <span className="text-xs font-black text-cyan-400 font-mono bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-700">
                  $27.10 + IVA
                </span>
              </div>

              <div className="text-center py-2">
                <span className="text-5xl font-black text-cyan-400 font-mono">{charges20k}</span>
                <span className="text-sm font-bold text-stone-300 block mt-1 font-mono">
                  Cargas Completas para tu {activeDev.name}
                </span>
                <span className="text-[11px] text-stone-500 font-mono block mt-0.5">
                  Hasta 5 a 6 días de autonomía sin enchufe de pared
                </span>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-800/80 text-[11px] text-stone-400">
                <div className="flex items-center gap-1.5">
                  <Check size={13} className="text-cyan-400 shrink-0" />
                  <span>Incluye cable Tipo C, Lightning de iPhone, Micro USB y USB de recarga</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check size={13} className="text-cyan-400 shrink-0" />
                  <span>Linterna doble LED para apagones o emergencias nocturnas</span>
                </div>
              </div>
            </div>

            {/* 5000 mAh MagSafe Result Card */}
            <div className="p-6 rounded-3xl bg-[#070b14] border border-blue-500/40 relative overflow-hidden space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-blue-950 pb-3">
                <div>
                  <span className="text-[10px] font-mono text-blue-400 font-bold uppercase block">Ultra Portabilidad</span>
                  <h3 className="text-base font-black text-white uppercase">MagSafe Inalámbrico 5000 mAh</h3>
                </div>
                <span className="text-xs font-black text-blue-400 font-mono bg-blue-950/80 px-2 py-0.5 rounded border border-blue-700">
                  $28.90 + IVA
                </span>
              </div>

              <div className="text-center py-2">
                <span className="text-5xl font-black text-blue-400 font-mono">{charges5k}</span>
                <span className="text-sm font-bold text-stone-300 block mt-1 font-mono">
                  Cargas Inalámbricas Directas (15W)
                </span>
                <span className="text-[11px] text-stone-500 font-mono block mt-0.5">
                  El salvavidas diario: sal a la calle y úsalo pegado al teléfono
                </span>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-800/80 text-[11px] text-stone-400">
                <div className="flex items-center gap-1.5">
                  <Check size={13} className="text-blue-400 shrink-0" />
                  <span>Sin cables estorbando: fijación magnética ultra fuerte</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check size={13} className="text-blue-400 shrink-0" />
                  <span>Compatible con iPhone 12/13/14/15/16 y carcasas con aro MagSafe</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════════
          APARTADO 2: CATÁLOGO DE PRODUCTOS (COMPRA DIRECTA & CARRITO)
      ══════════════════════════════════════════════════════════════════════════════ */}
      <section className="py-14 px-4 sm:px-8 max-w-7xl mx-auto" id="catalogo-1hora">
        
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-8 pb-4 border-b border-cyan-950">
          <div>
            <span className="text-cyan-400 text-xs font-mono uppercase tracking-widest font-black">
              Catálogo Oficial MultiTecnología V&V
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight mt-1 font-sans">
              Modelos Disponibles para Compra Inmediata
            </h2>
          </div>
          
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'Todos los Modelos (4)' },
              { id: '20000', label: '🔋 20,000 mAh (4 Cables)' },
              { id: 'magsafe', label: '⚡ MagSafe 5,000 mAh' },
              { id: 'combo', label: '⭐ Combo Dúo Carga' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategoryTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                  selectedCategoryTab === tab.id
                    ? "bg-cyan-400 text-stone-950 shadow-md scale-105 font-black"
                    : "bg-[#0c1424] hover:bg-[#152038] text-stone-300 border border-slate-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {filteredProducts.map((prod) => {
            const isAdded = addedItem === prod.id

            return (
              <div 
                key={prod.id}
                className="rounded-3xl bg-[#0c1322] border border-cyan-950 hover:border-cyan-500/50 transition-all flex flex-col justify-between overflow-hidden group shadow-xl"
              >
                <div>
                  
                  {/* Banner Image Display */}
                  <div className="relative aspect-[16/10] w-full bg-[#070b14] overflow-hidden">
                    <Image
                      src={prod.image}
                      alt={prod.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c1322] via-transparent to-black/20" />
                    
                    {/* Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase font-mono bg-cyan-400 text-stone-950 shadow-md">
                        {prod.badge}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-black/80 backdrop-blur-md text-cyan-300 border border-cyan-800">
                        {prod.powerOutput}
                      </span>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="p-6 space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
                        <span>SKU: {prod.sku}</span>
                        <span className="text-stone-400 font-bold">{prod.model}</span>
                      </div>
                      <h3 className="text-xl font-black text-white uppercase tracking-tight leading-snug group-hover:text-cyan-300 transition-colors mt-1">
                        {prod.name}
                      </h3>
                      <p className="text-xs text-stone-400 font-mono mt-0.5">
                        Color: {prod.color} • Capacidad: {prod.capacity}
                      </p>
                    </div>

                    <p className="text-xs text-stone-300 leading-relaxed">
                      {prod.description}
                    </p>

                    {/* Cables Included Chips */}
                    <div className="pt-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block mb-1.5">
                        Conectividad & Salidas:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {prod.cablesIncluded.map((c, i) => (
                          <span 
                            key={i} 
                            className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-[#142038] text-cyan-200 border border-cyan-800/60"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Highlights Bullet Points */}
                    <ul className="space-y-1.5 pt-2 border-t border-slate-800/80">
                      {prod.highlightSpecs.map((spec, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-stone-300">
                          <CheckCircle2 size={14} className="text-cyan-400 shrink-0 mt-0.5" />
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>

                  </div>

                </div>

                {/* Card Action Footer */}
                <div className="p-6 pt-0 border-t border-slate-800/80 mt-4 space-y-4">
                  
                  <div className="flex items-baseline justify-between pt-4">
                    <div>
                      <span className="text-[10px] font-mono text-stone-400 line-through block">
                        Precio Regular: ${prod.regularPrice.toFixed(2)}
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-cyan-400 font-mono">
                          ${prod.price.toFixed(2)}
                        </span>
                        <span className="text-xs font-mono text-stone-400">+ IVA</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/70 border border-emerald-800 px-2.5 py-1 rounded-full">
                      Stock Inmediato
                    </span>
                  </div>

                  {/* Actions Grid */}
                  <div className="grid grid-cols-2 gap-2.5">
                    
                    <button
                      type="button"
                      onClick={() => handleAddToCart(prod.id, prod.name, prod.price, prod.image)}
                      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-black text-xs uppercase tracking-wider font-mono transition-all cursor-pointer ${
                        isAdded 
                          ? 'bg-emerald-500 text-stone-950 shadow-lg'
                          : 'bg-[#15233c] hover:bg-[#1e3256] text-stone-100 border border-cyan-700/50'
                      }`}
                    >
                      <ShoppingCart size={15} className="text-cyan-400" />
                      <span>{isAdded ? "¡Añadido!" : "Al Carrito"}</span>
                    </button>

                    <a
                      href={`https://wa.me/${officialPhone}?text=${encodeURIComponent(prod.whatsappMsg)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:brightness-110 text-stone-950 font-black text-xs uppercase tracking-wider font-mono transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                    >
                      <Phone size={15} className="stroke-[2.5]" />
                      <span>Comprar Ya</span>
                    </a>

                  </div>

                </div>

              </div>
            )
          })}
        </div>

      </section>

      {/* ══════════════════════════════════════════════════════════════════════════════
          APARTADO 3: SEGURIDAD & ESPECIFICACIONES TÉCNICAS (CHIP MULTITECNOLOGÍA)
      ══════════════════════════════════════════════════════════════════════════════ */}
      <section className="py-12 px-4 sm:px-8 max-w-7xl mx-auto border-t border-cyan-950">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-cyan-400 text-xs font-mono uppercase tracking-widest font-black">
            Ingeniería & Seguridad Garantizada
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mt-1 font-sans">
            ¿Por Qué Elegir Power Banks 1Hora?
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <Cpu className="text-cyan-400" size={24} />,
              title: "Chip Inteligente 9 Capas",
              desc: "Protección automática contra sobrecalentamiento, cortocircuitos, picos de voltaje y sobrecargas eléctricas."
            },
            {
              icon: <Cable className="text-cyan-400" size={24} />,
              title: "4 Cables Todo en Uno",
              desc: "Olvídate de olvidar cables. Lleva USB, Micro USB, Tipo-C e iPhone integrados y plegados en el mismo cuerpo."
            },
            {
              icon: <Magnet className="text-cyan-400" size={24} />,
              title: "MagSafe Ultra Firme",
              desc: "Imanes de neodimio de alto agarre para mantener el banco de 5000 mAh fijo en el dorso del teléfono sin desprenderse."
            },
            {
              icon: <ShieldCheck className="text-cyan-400" size={24} />,
              title: "Garantía MultiTecnología",
              desc: "Producto 100% original con respaldo directo y servicio técnico de nuestro proveedor líder MultiTecnología V&V."
            }
          ].map((item, idx) => (
            <div key={idx} className="p-6 rounded-3xl bg-[#0c1424] border border-cyan-950 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-950/60 border border-cyan-800 flex items-center justify-center">
                {item.icon}
              </div>
              <h3 className="text-base font-black text-white uppercase tracking-tight font-sans">{item.title}</h3>
              <p className="text-xs text-stone-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════════
          APARTADO 4: ATENCIÓN INMEDIATA & DESPACHOS
      ══════════════════════════════════════════════════════════════════════════════ */}
      <section className="py-12 px-4 sm:px-8 max-w-5xl mx-auto border-t border-cyan-950">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#061524] via-[#0b2138] to-[#081728] border-2 border-cyan-500/50 text-center space-y-4 shadow-2xl">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400 text-stone-950 text-[10px] font-mono font-black uppercase tracking-wider">
            <Sparkles size={13} />
            <span>Envíos Inmediatos a Todo el Ecuador</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-sans">
            ¿Necesitas Cargar Varios Equipos o Comprar al por Mayor?
          </h3>

          <p className="text-stone-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Coordinamos entregas directas en Quito y envíos por Servientrega a todas las provincias. Escríbenos directamente a la línea oficial para confirmar tu pedido:
          </p>

          <div className="pt-2">
            <a
              href={`https://wa.me/${officialPhone}?text=Hola%20ATOMIC%20y%20MultiTecnologia,%20deseo%20comprar%20bancos%20de%20carga%201Hora%20(20000mAh%20o%20MagSafe).`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 text-stone-950 font-black text-sm uppercase tracking-wider hover:brightness-110 transition-all shadow-[0_0_25px_rgba(6,182,212,0.5)] active:scale-95 font-mono"
            >
              <Phone size={18} className="stroke-[2.5]" />
              <span>Pedir por WhatsApp al {formattedPhone}</span>
            </a>
          </div>

        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="mt-12 border-t border-cyan-950 bg-[#04060a] py-8 px-4 text-center text-xs text-stone-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} ATOMIC • División Energía Portátil 1Hora & MultiTecnología V&V.</p>
          <div className="flex items-center gap-4">
            <Link href="/web" className="hover:text-cyan-300 transition-colors">Tienda Oficial</Link>
            <span>•</span>
            <Link href="/web/paneles-ranurados" className="hover:text-cyan-300 transition-colors">Paneles WPC</Link>
            <span>•</span>
            <Link href="/web/carros-industriales" className="hover:text-cyan-300 transition-colors">Carros Industriales</Link>
            <span>•</span>
            <Link href="/web/cart" className="hover:text-cyan-300 transition-colors">Carrito</Link>
          </div>
        </div>
      </footer>

      {/* ── STICKY MOBILE CONVERSION BAR ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#070b14]/95 backdrop-blur-xl border-t border-cyan-950 p-2.5 flex items-center justify-between gap-2 sm:hidden shadow-2xl">
        <div className="flex-1 min-w-0 pl-1 font-mono">
          <span className="text-[10px] text-cyan-400 font-black uppercase block leading-none truncate">
            1Hora Bancos de Carga
          </span>
          <span className="text-[11px] text-white font-bold">
            Desde $27.10 • 4 Cables & MagSafe
          </span>
        </div>

        <a
          href={`https://wa.me/${officialPhone}?text=Hola%20ATOMIC%20y%20MultiTecnologia,%20deseo%20comprar%20el%20Banco%20de%20Carga%201Hora.`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-stone-950 font-black text-xs uppercase tracking-wider shadow-lg shrink-0 font-mono"
        >
          <Phone size={14} className="stroke-[2.5]" />
          <span>Comprar Ya</span>
        </a>
      </div>

    </div>
  )
}
