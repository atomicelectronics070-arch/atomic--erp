"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { 
  Sparkles, CheckCircle2, ArrowRight, Phone, ShoppingCart, 
  ExternalLink, ShieldCheck, MapPin, Truck, Ruler, Layers, 
  Droplet, Flame, Sun, Hammer, Check, Calculator, Eye, HelpCircle,
  Home, Building, Palette, Star, ChevronRight
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

interface WpcPanel {
  id: string
  sku: string
  name: string
  colorName: string
  badge: string
  price: number
  regularPrice: number
  image: string
  toneHex: string
  idealFor: string
  description: string
  benefits: string[]
  whatsappMsg: string
}

export default function PanelesRanuradosClient({ initialProducts }: { initialProducts: DbProduct[] }) {
  const { addToCart } = useCart()
  const [addedItem, setAddedItem] = useState<string | null>(null)
  const [selectedColorTab, setSelectedColorTab] = useState<string>("todos")
  
  // Interactive Wall Calculator State
  const [wallWidthMeters, setWallWidthMeters] = useState<number>(3.2)
  const panelWidthMeters = 0.16 // 16 cm = 0.16 m
  const panelPrice = 9.09
  const panelsNeeded = Math.ceil(wallWidthMeters / panelWidthMeters)
  const calculatedTotal = (panelsNeeded * panelPrice).toFixed(2)

  // Official phone shown in user banners
  const officialPhone = "593980319050"
  const formattedPhone = "098 031 9050"

  const PANELS: WpcPanel[] = [
    {
      id: "cmw6rprh70002jtatw5h4oocv",
      sku: "WPC-PANEL-NEGRO",
      name: "Panel Ranurado WPC Color Negro",
      colorName: "Negro Profundo / Dark Slate",
      badge: "MÁXIMA ELEGANCIA & LUJO",
      price: 9.09,
      regularPrice: 14.50,
      image: "/images/paneles-wpc/panel-wpc-negro.jpg",
      toneHex: "#141416",
      idealFor: "Paredes de TV (Media Walls), salas modernas, suites, estudios y oficinas de alto perfil.",
      description: "Acabado negro mate texturizado de vanguardia. Crea un contraste visual espectacular con muebles de madera clara, sofás beige y tiras de iluminación LED indirecta.",
      benefits: [
        "100% impermeable y resistente al vapor (no se hincha ni se deforma)",
        "Longitud estándar de 2.90m: cubre de piso a techo sin cortes antiestéticos",
        "Alta durabilidad ante roces, impactos y polvo",
        "Tratamiento retardante de llama y cero mantenimiento"
      ],
      whatsappMsg: "Hola ATOMIC, deseo cotizar Paneles Ranurados WPC COLOR NEGRO (2.90m x 16cm) a $9.09. ¿Tienen entrega inmediata desde Carapungo?"
    },
    {
      id: "cmw6rpser0004jtattbz901l1",
      sku: "WPC-PANEL-BICOLOR",
      name: "Panel Ranurado WPC Bicolor Madera",
      colorName: "Bicolor Teca & Nogal Veteado",
      badge: "CALIDEZ ORGÁNICA NATURAL",
      price: 9.09,
      regularPrice: 14.50,
      image: "/images/paneles-wpc/panel-wpc-bicolor-madera.jpg",
      toneHex: "#825633",
      idealFor: "Comedores, recepciones, dormitorios, pasillos de ingreso y locales comerciales acogedores.",
      description: "Patrón bicolor con vetas orgánicas de madera natural sobre fondo oscuro. Aporta la textura y presencia de la madera noble sin la fragilidad ni el mantenimiento del barniz.",
      benefits: [
        "Veteado hiperrealista con textura háptica de listón de madera",
        "Protección UV que mantiene el tono cálido inalterable",
        "No requiere lijado, lacas ni productos químicos protectores",
        "Instalación limpia y rápida con clips invisibles"
      ],
      whatsappMsg: "Hola ATOMIC, me interesan los Paneles Ranurados WPC BICOLOR MADERA a $9.09. ¿Cuál es la dirección de la bodega en Carapungo para retirar?"
    },
    {
      id: "cmw6rptb40006jtato3inqzrm",
      sku: "WPC-PANEL-CAFE",
      name: "Panel Ranurado WPC Color Café Cálido",
      colorName: "Café Tostado / Roble Natural",
      badge: "ESTILO JAPANDI & NÓRDICO",
      price: 9.09,
      regularPrice: 14.50,
      image: "/images/paneles-wpc/panel-wpc-cafe.jpg",
      toneHex: "#633f25",
      idealFor: "Salas de estar, cabeceras de cama, barras de cocina y cafeterías boutique.",
      description: "Tono café cálido refinado que evoca los interiores japoneses y nórdicos contemporáneos. Suaviza la acústica de la habitación y brinda un ambiente sereno y acogedor.",
      benefits: [
        "Aislamiento acústico que absorbe ecos y reverberaciones en salas amplias",
        "Inmune a polillas, hongos, moho y humedad ambiente",
        "Se corta fácilmente con sierra de mano o caladora",
        "Superficie lavable con paño húmedo y jabón suave"
      ],
      whatsappMsg: "Hola ATOMIC, deseo comprar Paneles Ranurados WPC COLOR CAFÉ por $9.09 el panel. ¿Cuánto me sale el envío a mi dirección?"
    }
  ]

  const ACCESSORIES = [
    {
      id: "cmw6rpu880008jtat9vivwrdo",
      name: "Kit de Remodelación & Perfilería WPC",
      desc: "20 clips de acero inoxidable + perfil terminal en L (2.90m) + adhesivo sellador poliuretánico.",
      price: 12.50,
      badge: "ACCESORIO CLAVE"
    },
    {
      id: "cmw6rpv36000ajtatdw1eczc5",
      name: "Pack Remodelación Muro Completo (10 Paneles 2.90m)",
      desc: "Cubre 1.60m de ancho x 2.90m de alto en el color a elección + kit completo de fijación.",
      price: 99.99,
      badge: "COMBO SALA COMPLETA"
    }
  ]

  const filteredPanels = selectedColorTab === "todos"
    ? PANELS
    : PANELS.filter(p => p.sku.toLowerCase().includes(selectedColorTab))

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

  const handleCalculatorWhatsApp = () => {
    const msg = `Hola ATOMIC, utilicé la calculadora en su página web:
- Ancho de mi muro: ${wallWidthMeters} metros
- Paneles requeridos (16cm x 2.90m): ${panelsNeeded} unidades
- Presupuesto estimado a $9.09/panel: $${calculatedTotal} USD
Deseo verificar stock de colores y coordinar compra con retiro en Carapungo o envío a domicilio.`
    window.open(`https://wa.me/${officialPhone}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-[#0e0f12] text-stone-100 font-sans selection:bg-amber-400 selection:text-black relative overflow-x-hidden">
      
      {/* ── LUXURY WARM AMBIENT LIGHTING (INSPIRADO EN INTERIORISMO) ── */}
      <div className="fixed inset-0 bg-[radial-gradient(#26272e_1px,transparent_1px)] [background-size:32px_32px] opacity-40 pointer-events-none" />
      <div className="fixed -top-40 left-1/3 w-[600px] h-[600px] bg-amber-600/10 rounded-full blur-[180px] pointer-events-none" />
      <div className="fixed top-1/2 -right-40 w-[650px] h-[650px] bg-amber-700/10 rounded-full blur-[220px] pointer-events-none" />

      {/* ── TOP ANNOUNCEMENT BAR ── */}
      <div className="relative z-50 bg-gradient-to-r from-[#21160e] via-[#332215] to-[#21160e] border-b border-amber-500/30 text-amber-300 px-4 py-2 text-center text-xs font-mono font-bold tracking-wider flex items-center justify-center gap-2 shadow-sm">
        <Sparkles size={14} className="text-amber-400" />
        <span>OFERTA DIRECTA DE IMPORTADOR: $9.09 POR PANEL (2.90m x 16cm) • RETIRO EN BODEGA CARAPUNGO • ENVÍOS A TODO EL ECUADOR</span>
      </div>

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-40 bg-[#121318]/90 backdrop-blur-2xl border-b border-stone-800 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          <Link href="/web" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#3d2719] via-[#21140c] to-[#0e0805] border border-amber-500/40 flex items-center justify-center text-amber-400 font-black text-xl shadow-[0_0_20px_rgba(217,119,6,0.3)] group-hover:scale-105 transition-transform">
              <span>W</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-lg font-black tracking-tight text-white uppercase font-sans">ATOMIC</span>
                <span className="text-xs font-black px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-600 to-yellow-600 text-stone-950 uppercase font-mono">
                  WPC PANELES
                </span>
              </div>
              <p className="text-[10px] text-stone-400 font-bold tracking-widest uppercase mt-0.5 font-mono">
                Remodelaciones Interior & Exterior
              </p>
            </div>
          </Link>

          {/* Quick Direct WhatsApp from Banner */}
          <div className="flex items-center gap-3">
            <a
              href={`https://wa.me/${officialPhone}?text=Hola%20ATOMIC,%20deseo%20asesoria%20sobre%20los%20Paneles%20Ranurados%20WPC%20a%20$9.09.`}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-stone-950 font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:scale-105"
            >
              <Phone size={14} className="stroke-[2.5]" />
              <span>{formattedPhone} Escríbenos</span>
            </a>

            <Link
              href="/web/cart"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-stone-900/80 hover:bg-stone-800 border border-stone-800 text-stone-200 text-xs font-bold transition-all"
            >
              <ShoppingCart size={16} />
              <span className="hidden md:inline">Ver Carrito</span>
            </Link>
          </div>

        </div>
      </header>

      {/* ── HERO ARCHITECTURAL SHOWCASE ── */}
      <section className="relative pt-12 pb-16 px-4 sm:px-8 border-b border-stone-800/80 bg-gradient-to-b from-[#181920] via-[#121318] to-[#0e0f12]">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-stone-900/90 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider shadow-inner">
            <ShieldCheck size={16} className="text-amber-400" />
            <span>Calidad Garantizada ATOMIC • Carapungo, Quito</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase leading-[1.08] font-sans">
            Paneles Ranurados <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">WPC</span>
            <br />
            <span className="text-stone-300 font-light">Remodelación de Interior & Exterior</span>
          </h1>

          <p className="max-w-3xl mx-auto text-stone-300 text-sm sm:text-base leading-relaxed font-normal">
            Transforma cualquier sala, dormitorio, local u oficina en un espacio arquitectónico de revista. Paneles de <strong>2,90 m de alto x 16 cm de ancho</strong>. 100% impermeables, duraderos y sin obras complejas.
          </p>

          {/* Pricing Highlight Pill */}
          <div className="inline-flex flex-col sm:flex-row items-center gap-3 p-3 sm:p-4 rounded-3xl bg-gradient-to-r from-[#2a1b12] to-[#1a120c] border-2 border-amber-500/50 shadow-2xl">
            <div className="flex items-baseline gap-2">
              <span className="text-xs uppercase font-mono font-bold text-amber-400">¡Súper Precio de Oferta!</span>
              <span className="text-3xl sm:text-4xl font-black text-white font-mono">$9.09</span>
              <span className="text-xs text-stone-400 font-mono">/ panel</span>
              <span className="text-xs text-stone-500 line-through font-mono ml-2">$14.50</span>
            </div>
            <div className="h-4 w-[1px] bg-stone-700 hidden sm:block" />
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold">
              <span>● Medida: 2.90m x 16cm</span>
              <span>• Stock en Carapungo</span>
            </div>
          </div>

          {/* Value Badges Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto pt-4 text-left font-mono">
            
            <div className="p-3.5 rounded-2xl bg-stone-900/70 border border-stone-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                <Droplet size={20} />
              </div>
              <div>
                <p className="text-white text-xs font-bold uppercase">100% Impermeable</p>
                <p className="text-stone-400 text-[10px]">Cero hinchazón con humedad</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-900/70 border border-stone-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                <Ruler size={20} />
              </div>
              <div>
                <p className="text-white text-xs font-bold uppercase">2.90m de Altura</p>
                <p className="text-stone-400 text-[10px]">Cubre paredes sin cortes</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-900/70 border border-stone-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-white text-xs font-bold uppercase">Bodega Carapungo</p>
                <p className="text-stone-400 text-[10px]">Retiro inmediato en Quito</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-900/70 border border-stone-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 text-yellow-400 flex items-center justify-center shrink-0">
                <Truck size={20} />
              </div>
              <div>
                <p className="text-white text-xs font-bold uppercase">Envíos a Todo el País</p>
                <p className="text-stone-400 text-[10px]">Guayaquil, Cuenca y más</p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════════
          APARTADO 1: CALCULADORA INTERACTIVA DE PANELES EN VIVO (HERRAMIENTA)
      ══════════════════════════════════════════════════════════════════════════════ */}
      <section className="py-12 px-4 sm:px-8 max-w-5xl mx-auto">
        <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-[#1c1510] via-[#141215] to-[#0e0f12] border-2 border-amber-500/40 shadow-2xl relative overflow-hidden">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-stone-800 pb-5">
            <div>
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                <Calculator size={15} />
                Calculadora de Material para Muros
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mt-1 font-sans">
                ¿Cuántos Paneles Necesitas para tu Muro?
              </h2>
            </div>
            <p className="text-xs text-stone-400 max-w-xs font-mono">
              Ingresa el ancho de tu pared. Cada panel mide 16 cm (0.16m) de ancho y 2.90m de alto.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-6">
            
            {/* Slider Control */}
            <div className="space-y-4">
              <div className="flex justify-between items-baseline text-sm font-mono font-bold">
                <span className="text-stone-300">Ancho de tu pared:</span>
                <span className="text-2xl font-black text-amber-400 font-mono">{wallWidthMeters.toFixed(2)} m</span>
              </div>
              
              <input
                type="range"
                min="0.5"
                max="8.0"
                step="0.1"
                value={wallWidthMeters}
                onChange={(e) => setWallWidthMeters(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer h-2.5 bg-stone-800 rounded-lg"
              />

              <div className="flex justify-between text-[11px] font-mono text-stone-500">
                <span>0.50m (Columna)</span>
                <span>3.20m (Pared TV)</span>
                <span>8.00m (Muro Doble)</span>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="text-[11px] font-mono text-stone-400">Preajustes comunes:</span>
                {[
                  { label: "1.60 m (Muro Chico)", val: 1.6 },
                  { label: "2.40 m (Pared Standard)", val: 2.4 },
                  { label: "3.20 m (Sala TV)", val: 3.2 },
                  { label: "4.80 m (Muro Principal)", val: 4.8 },
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setWallWidthMeters(preset.val)}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Calculated Result Card */}
            <div className="p-6 rounded-3xl bg-[#0b0c0e] border border-amber-500/30 text-center space-y-4 shadow-xl">
              
              <div className="grid grid-cols-2 gap-3 border-b border-stone-800/80 pb-4">
                <div>
                  <span className="text-[10px] font-mono text-stone-400 uppercase block">Paneles Necesarios</span>
                  <span className="text-3xl font-black text-white font-mono">{panelsNeeded}</span>
                  <span className="text-[10px] text-amber-400 font-mono block">unidades de 2.90m</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-stone-400 uppercase block">Área Cubierta</span>
                  <span className="text-3xl font-black text-white font-mono">{(panelsNeeded * 0.464).toFixed(1)}</span>
                  <span className="text-[10px] text-stone-400 font-mono block">m² aproximados</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono text-stone-400 uppercase block">Costo Total Estimado ($9.09 c/u)</span>
                <span className="text-4xl font-black text-amber-400 font-mono">${calculatedTotal}</span>
                <span className="text-xs text-stone-400 font-mono"> USD con IVA</span>
              </div>

              <button
                type="button"
                onClick={handleCalculatorWhatsApp}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-stone-950 font-black text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-all cursor-pointer"
              >
                <Phone size={15} className="stroke-[2.5]" />
                <span>Pedir estos {panelsNeeded} Paneles por WhatsApp</span>
              </button>

            </div>

          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════════
          APARTADO 2: CATÁLOGO DE COLORES Y PRODUCTOS (IMÁGENES OFICIALES)
      ══════════════════════════════════════════════════════════════════════════════ */}
      <section className="py-14 px-4 sm:px-8 max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-10 pb-4 border-b border-stone-800">
          <div>
            <span className="text-amber-400 text-xs font-mono uppercase tracking-widest font-black">
              Acabados Arquitectónicos Disponibles
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight mt-1 font-sans">
              Colección Oficial de Paneles WPC
            </h2>
          </div>
          
          {/* Color Tabs */}
          <div className="flex items-center gap-2">
            {[
              { id: "todos", label: "Ver Todos los Colores" },
              { id: "negro", label: "Negro Mate" },
              { id: "bicolor", label: "Bicolor Madera" },
              { id: "cafe", label: "Café Cálido" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedColorTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                  selectedColorTab === tab.id
                    ? "bg-amber-400 text-stone-950 shadow-md scale-105"
                    : "bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {filteredPanels.map((prod) => {
            const isAdded = addedItem === prod.id

            return (
              <div
                key={prod.id}
                className="group rounded-3xl bg-[#14151a] border-2 border-stone-800 hover:border-amber-500/60 shadow-2xl transition-all duration-300 flex flex-col overflow-hidden hover:shadow-[0_15px_40px_rgba(217,119,6,0.15)]"
              >
                {/* ── BANNER ORIGINAL DISPLAY ── */}
                <div className="relative w-full aspect-square bg-[#0b0c0e] overflow-hidden">
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5 items-start">
                    <span className="px-3 py-1 rounded-lg bg-stone-950/80 backdrop-blur-md text-amber-400 border border-amber-500/30 font-black text-[10px] uppercase tracking-wider font-mono">
                      {prod.badge}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-amber-500 text-stone-950 font-black text-[10px] uppercase tracking-wider font-mono">
                      2.90m x 16cm
                    </span>
                  </div>

                  <div className="absolute top-4 right-4 z-20 px-3 py-1 rounded-xl bg-black/80 backdrop-blur-md border border-white/20 text-right font-mono">
                    <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest block">
                      ¡OFERTA!
                    </span>
                    <span className="text-base font-black text-white">
                      ${prod.price.toFixed(2)}
                    </span>
                  </div>

                  {/* Clickable Image -> Shop Product URL */}
                  <Link
                    href={`/web/product/${prod.id}`}
                    className="block w-full h-full relative group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                    title={`Ver ${prod.name} en la tienda`}
                  >
                    <Image
                      src={prod.image}
                      alt={prod.name}
                      fill
                      priority
                      className="object-cover object-center"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-stone-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                      <div className="px-4 py-2 rounded-xl bg-amber-400 text-stone-950 font-black text-xs uppercase tracking-wider shadow-2xl flex items-center gap-2">
                        <span>Ver Ficha Técnica</span>
                        <ArrowRight size={14} className="stroke-[3]" />
                      </div>
                    </div>
                  </Link>

                </div>

                {/* ── CONTENT DETAILS ── */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-5 bg-gradient-to-b from-[#14151a] to-[#0f1014]">
                  
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest">
                        SKU: {prod.sku}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full border border-white/30" style={{ backgroundColor: prod.toneHex }} />
                        <span className="text-[10px] font-mono text-stone-300 font-bold">{prod.colorName}</span>
                      </div>
                    </div>

                    <Link href={`/web/product/${prod.id}`} className="hover:text-amber-400 transition-colors">
                      <h3 className="text-xl font-black text-white uppercase tracking-tight leading-tight mt-1">
                        {prod.name}
                      </h3>
                    </Link>

                    <p className="text-stone-300 text-xs mt-2 leading-relaxed">
                      {prod.description}
                    </p>

                    {/* Specs Box */}
                    <div className="grid grid-cols-2 gap-2 mt-4 p-3 rounded-2xl bg-black/40 border border-stone-800 text-[11px] font-mono">
                      <div>
                        <span className="text-stone-500 block">Largo:</span>
                        <span className="text-white font-bold">2.90 Metros</span>
                      </div>
                      <div>
                        <span className="text-stone-500 block">Ancho útil:</span>
                        <span className="text-white font-bold">16 Centímetros</span>
                      </div>
                      <div>
                        <span className="text-stone-500 block">Impermeable:</span>
                        <span className="text-emerald-400 font-bold">100% Antihumedad</span>
                      </div>
                      <div>
                        <span className="text-stone-500 block">Instalación:</span>
                        <span className="text-amber-400 font-bold">Machihembrado</span>
                      </div>
                    </div>

                    {/* Benefits List */}
                    <div className="mt-4 space-y-1.5">
                      <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-stone-400">
                        Ventajas de este acabado:
                      </p>
                      <ul className="space-y-1 pl-1">
                        {prod.benefits.map((b, i) => (
                          <li key={i} className="text-[11px] text-stone-300 flex items-start gap-2 leading-tight">
                            <span className="text-amber-400 font-bold shrink-0">✓</span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* ── PRICE & ACTION BUTTONS ── */}
                  <div className="pt-4 border-t border-stone-800 space-y-3">
                    
                    <div className="flex items-baseline justify-between font-mono">
                      <div>
                        <span className="text-[10px] text-stone-400 uppercase block">Precio por Panel</span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-black text-amber-400 font-mono">
                            ${prod.price.toFixed(2)}
                          </span>
                          <span className="text-xs text-stone-500 line-through">
                            ${prod.regularPrice.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[9px] text-emerald-400 font-black uppercase block">
                          ● En Bodega Carapungo
                        </span>
                        <span className="text-[10px] text-stone-400">
                          Envíos a todo el país
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      
                      <Link
                        href={`/web/product/${prod.id}`}
                        className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-black text-xs uppercase tracking-wider transition-all text-center font-mono"
                      >
                        <span>Ver Ficha</span>
                        <ExternalLink size={13} />
                      </Link>

                      <a
                        href={`https://wa.me/${officialPhone}?text=${encodeURIComponent(prod.whatsappMsg)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-stone-950 font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 text-center font-mono"
                      >
                        <Phone size={13} className="stroke-[2.5]" />
                        <span>Pedir WhatsApp</span>
                      </a>

                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddToCart(prod.id, prod.name, prod.price, prod.image)}
                      className={`w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        isAdded
                          ? "bg-amber-400 text-stone-950 shadow-md"
                          : "bg-stone-900 hover:bg-stone-800 text-amber-300 border border-stone-800"
                      }`}
                    >
                      <ShoppingCart size={13} />
                      <span>{isAdded ? "¡Añadido al Carrito!" : "Añadir al Carrito"}</span>
                    </button>

                  </div>

                </div>
              </div>
            )
          })}
        </div>

      </section>

      {/* ══════════════════════════════════════════════════════════════════════════════
          APARTADO 3: KITS DE INSTALACIÓN & COMBOS DE REMODELACIÓN
      ══════════════════════════════════════════════════════════════════════════════ */}
      <section className="py-12 px-4 sm:px-8 max-w-5xl mx-auto border-t border-stone-800">
        
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-amber-400 text-xs font-mono uppercase tracking-widest font-black">
            Accesorios & Combos Listos para Colocar
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mt-1 font-sans">
            Kits de Remodelación & Perfilería
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ACCESSORIES.map((acc) => (
            <div key={acc.id} className="p-6 rounded-3xl bg-[#14151a] border border-amber-500/30 flex flex-col justify-between space-y-4 shadow-xl">
              <div className="space-y-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-mono text-[10px] font-black uppercase">
                  {acc.badge}
                </span>
                <h3 className="text-lg font-black text-white uppercase tracking-tight">
                  {acc.name}
                </h3>
                <p className="text-stone-300 text-xs leading-relaxed">
                  {acc.desc}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-stone-800 font-mono">
                <div>
                  <span className="text-[10px] text-stone-400 block uppercase">Precio Oferta</span>
                  <span className="text-2xl font-black text-amber-400">${acc.price.toFixed(2)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/web/product/${acc.id}`}
                    className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs uppercase tracking-wider"
                  >
                    Ver en Tienda
                  </Link>
                  <a
                    href={`https://wa.me/${officialPhone}?text=Hola%20ATOMIC,%20deseo%20comprar%20el%20${encodeURIComponent(acc.name)}%20por%20$${acc.price}.`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs uppercase tracking-wider"
                  >
                    Pedir
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* ══════════════════════════════════════════════════════════════════════════════
          APARTADO 4: GUÍA RÁPIDA DE INSTALACIÓN EN 4 PASOS
      ══════════════════════════════════════════════════════════════════════════════ */}
      <section className="py-14 px-4 sm:px-8 max-w-6xl mx-auto border-t border-stone-800">
        
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-1">
          <span className="text-amber-400 text-xs font-mono uppercase tracking-widest font-black">
            Fácil Montaje Sin Obras Pesadas
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-sans">
            ¿Cómo se Instalan los Paneles WPC?
          </h2>
          <p className="text-xs text-stone-400">
            Cualquier persona o maestro instalador puede colocarlos en minutos utilizando herramientas básicas.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
          
          <div className="p-5 rounded-2xl bg-[#121318] border border-stone-800 space-y-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-sm">
              1
            </div>
            <h4 className="text-white text-xs font-black uppercase">Medir y Limpiar</h4>
            <p className="text-stone-400 text-[11px] leading-relaxed">
              Verifica la altura de la pared. Si tu muro mide menos de 2.90m, corta el sobrante con sierra manual o caladora.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#121318] border border-stone-800 space-y-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-sm">
              2
            </div>
            <h4 className="text-white text-xs font-black uppercase">Adhesivo o Clips</h4>
            <p className="text-stone-400 text-[11px] leading-relaxed">
              Aplica cordones de adhesivo de montaje al dorso o utiliza los clips de fijación oculta atornillados al muro.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#121318] border border-stone-800 space-y-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-sm">
              3
            </div>
            <h4 className="text-white text-xs font-black uppercase">Machihembrado</h4>
            <p className="text-stone-400 text-[11px] leading-relaxed">
              Encaja el siguiente panel en la ranura del anterior. La unión es hermética, uniforme e invisible a la vista.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#121318] border border-stone-800 space-y-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-sm">
              4
            </div>
            <h4 className="text-white text-xs font-black uppercase">Remates Finales</h4>
            <p className="text-stone-400 text-[11px] leading-relaxed">
              Coloca el perfil terminal en L en los bordes expuestos para un acabado limpio y profesional de alta gama.
            </p>
          </div>

        </div>

      </section>

      {/* ══════════════════════════════════════════════════════════════════════════════
          APARTADO 5: BODEGA CARAPUNGO & ASESORÍA DIRECTA
      ══════════════════════════════════════════════════════════════════════════════ */}
      <section className="py-12 px-4 sm:px-8 max-w-5xl mx-auto border-t border-stone-800">
        
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#21160e] via-[#1a120c] to-[#121318] border-2 border-amber-500/40 text-center space-y-4 shadow-2xl">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500 text-stone-950 text-[10px] font-mono font-black uppercase tracking-wider">
            <MapPin size={13} />
            <span>Bodega Principal: Carapungo, Quito - Ecuador</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-sans">
            ¿Deseas Retirar Hoy Mismo o Necesitas Cotización para tu Proyecto?
          </h3>

          <p className="text-stone-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Puedes retirar tus paneles directamente en nuestra bodega en Carapungo (Quito) o te los enviamos a domicilio en cualquier provincia del Ecuador. Escríbenos directamente al número oficial:
          </p>

          <div className="pt-2">
            <a
              href={`https://wa.me/${officialPhone}?text=Hola%20ATOMIC,%20deseo%20visitar%20la%20bodega%20en%20Carapungo%20o%20cotizar%20Paneles%20Ranurados%20WPC.`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 font-black text-sm uppercase tracking-wider hover:brightness-110 transition-all shadow-[0_0_25px_rgba(245,158,11,0.4)] active:scale-95 font-mono"
            >
              <Phone size={18} className="stroke-[2.5]" />
              <span>Chatear al {formattedPhone} por WhatsApp</span>
            </a>
          </div>

        </div>

      </section>

      {/* ── FOOTER ── */}
      <footer className="mt-12 border-t border-stone-800 bg-[#090a0d] py-8 px-4 text-center text-xs text-stone-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} ATOMIC • División Paneles Ranurados & Remodelaciones de Interior y Exterior.</p>
          <div className="flex items-center gap-4">
            <Link href="/web" className="hover:text-stone-300 transition-colors">Tienda Oficial</Link>
            <span>•</span>
            <Link href="/web/carros-industriales" className="hover:text-stone-300 transition-colors">Carros Industriales</Link>
            <span>•</span>
            <Link href="/web/creacion-contenido" className="hover:text-stone-300 transition-colors">Studio Contenido</Link>
            <span>•</span>
            <Link href="/web/cart" className="hover:text-stone-300 transition-colors">Carrito</Link>
          </div>
        </div>
      </footer>

      {/* ── STICKY MOBILE CONVERSION BAR ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#121318]/95 backdrop-blur-xl border-t border-stone-800 p-2.5 flex items-center justify-between gap-2 sm:hidden shadow-2xl">
        <div className="flex-1 min-w-0 pl-1 font-mono">
          <span className="text-[10px] text-amber-400 font-black uppercase block leading-none truncate">
            Paneles Ranurados WPC
          </span>
          <span className="text-[11px] text-white font-bold">
            $9.09 c/u • Bodega Carapungo
          </span>
        </div>

        <a
          href={`https://wa.me/${officialPhone}?text=Hola%20ATOMIC,%20deseo%20comprar%20Paneles%20Ranurados%20WPC%20a%20$9.09.`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 font-black text-xs uppercase tracking-wider shadow-lg shrink-0 font-mono"
        >
          <Phone size={14} className="stroke-[2.5]" />
          <span>Escribir al 098 031 9050</span>
        </a>
      </div>

    </div>
  )
}
