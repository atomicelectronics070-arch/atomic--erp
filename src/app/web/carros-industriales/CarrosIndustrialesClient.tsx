"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { 
  Truck, ShieldCheck, Wrench, ArrowRight, Phone, Check, 
  Sparkles, Layers, Box, ChevronRight, CheckCircle2, ShoppingCart, 
  ExternalLink, Zap, Star, AlertTriangle, HelpCircle, Compass
} from "lucide-react"
import { useCart } from "@/context/CartContext"

interface DbProduct {
  id: string
  name: string
  price: number
  compareAtPrice: number | null
  stock?: number
  images?: string | null
  description?: string | null
}

interface ProductItem {
  id: string
  sku: string
  name: string
  badge: string
  capacity: string
  tagline: string
  price: number
  regularPrice: number
  image: string
  category: "escalador" | "plataforma" | "pesado" | "taller" | "cajas"
  specs: {
    capacidad: string
    ruedas: string
    chasis: string
    plegable: string
    peso: string
  }
  recomendaciones: string[]
  whatsappMsg: string
}

const PRODUCTS_DATA: ProductItem[] = [
  {
    id: "cmmwxkyzt05zr86cq1s9mvvkp",
    sku: "BP-ESC-80KG",
    name: "Carro Escalador para Transporte 80 KG",
    badge: "DOMINA LAS ESCALERAS",
    capacity: "80 KG",
    tagline: "Facilita tu carga pesada en gradas y desniveles sin castigar la espalda.",
    price: 65.99,
    regularPrice: 85.00,
    image: "/images/landing-carros/carro-escalador-80kg.jpg",
    category: "escalador",
    specs: {
      capacidad: "80 KG continuo",
      ruedas: "Trío rotativo de 6 ruedas en estrella (3 por lado)",
      chasis: "Tubo de acero estructural con recubrimiento azul",
      plegable: "Pala plegable para guardado compacto",
      peso: "9.2 KG"
    },
    recomendaciones: [
      "Edificios residenciales, oficinas y condominios sin ascensor.",
      "Entrega de botellones de agua, bidones, cajas de archivo y paquetes medianos.",
      "Sube bordillos de acera y escalones empinados con mínimo esfuerzo físico.",
      "Excelente para empresas de mudanzas, repartidores urbanos y servicios técnicos."
    ],
    whatsappMsg: "Hola ATOMIC, deseo comprar el Carro Escalador 80KG por $65.99. ¿Tienen stock para despacho inmediato?"
  },
  {
    id: "cmmwxkyzt05zq86cqv9e17dws",
    sku: "BP-PLAT-150KG",
    name: "Carro Multiuso Profesional con Asa Plegable",
    badge: "PLATAFORMA REFORZADA",
    capacity: "150 - 200 KG",
    tagline: "Durabilidad y eficiencia para tu negocio. Plataforma azul resistente y asa abatible.",
    price: 54.99,
    regularPrice: 67.49,
    image: "/images/landing-carros/carro-multiuso-plataforma.jpg",
    category: "plataforma",
    specs: {
      capacidad: "150 KG a 200 KG distribuidos",
      ruedas: "4 ruedas industriales (2 giratorias 360° silenciosas + 2 fijas)",
      chasis: "Plataforma de polímero texturizado antideslizante con asa de acero",
      plegable: "Asa abatible con barra de liberación a pedal",
      peso: "7.8 KG"
    },
    recomendaciones: [
      "Bodegas, farmacias, minimarkets, ferreterías y almacenes de retail.",
      "Movimiento ágil de mercadería encartonada, bidones y fardos voluminosos.",
      "Se pliega completamente plano para meterlo en la cajuela de autos y furgonetas.",
      "Superficie estriada de alta tracción que evita que la mercadería resbale al rodar."
    ],
    whatsappMsg: "Hola ATOMIC, deseo ordenar el Carro Multiuso Profesional (Plataforma azul) por $54.99. ¿Hacen envío a mi ciudad?"
  },
  {
    id: "cmmwxkyzt05zs86cqa707o7mn",
    sku: "BP-IND-200KG",
    name: "Carro de Carga Industrial 200 KG (Zorra de Carga)",
    badge: "TRABAJO PESADO EXTREMO",
    capacity: "200 KG",
    tagline: "Resistencia y eficiencia para faenas duras. Estructura de tubo y ruedas neumáticas.",
    price: 43.99,
    regularPrice: 59.99,
    image: "/images/landing-carros/carro-carga-industrial-200kg.jpg",
    category: "pesado",
    specs: {
      capacidad: "200 KG reales de carga continua",
      ruedas: "Neumáticas todoterreno de 10 pulgadas con cámara y rodamiento sellado",
      chasis: "Doble costilla tubular reforzada con pala de acero estampada",
      plegable: "Estructura fija mono-bloque de máxima rigidez",
      peso: "11.5 KG"
    },
    recomendaciones: [
      "Ferreterías, depósitos de materiales, plantas de producción y obras civiles.",
      "Carga de sacos de cemento, rollos de alambre, motores, compresores y cajas pesadas.",
      "Neumáticos inflables que amortiguan golpes en adoquines, ripio y pisos irregulares.",
      "Pala con bisel inferior que permite deslizarse debajo de pallets y cajas sin esfuerzo."
    ],
    whatsappMsg: "Hola ATOMIC, necesito el Carro de Carga Industrial 200 KG por $43.99. ¿Pueden enviarme la proforma para compra inmediata?"
  },
  {
    id: "cmmx2lf4602aibnt09pqie90g",
    sku: "BP-TALLER-3NIV",
    name: "Carro Porta Herramientas 3 Niveles BP",
    badge: "CALIDAD PROFESIONAL BP",
    capacity: "120 KG (3 Niveles)",
    tagline: "Resistente, espacioso y profesional. Organiza tu taller con calidad industrial.",
    price: 60.49,
    regularPrice: 79.99,
    image: "/images/landing-carros/carro-porta-herramientas-3-niveles.jpg",
    category: "taller",
    specs: {
      capacidad: "120 KG en total (40 KG por cada nivel)",
      ruedas: "4 ruedas de alta fricción para taller (2 con freno de bloqueo)",
      chasis: "Chapa de acero laminado con pintura electrostática horneada azul",
      plegable: "Estructura fija abulonada con manija ergonómica de empuje",
      peso: "12.8 KG"
    },
    recomendaciones: [
      "Talleres mecánicos, lavadoras, talleres de enderezada, pintura y tornerías.",
      "Mantenimiento industrial y líneas de ensamblaje en fábricas y plantas técnicas.",
      "Bandejas profundas con reborde perimetral para evitar caídas de pernos, dados o llaves.",
      "Desplaza todo tu kit de llaves, pistolas neumáticas y repuestos junto al trabajo."
    ],
    whatsappMsg: "Hola ATOMIC, me interesa el Carro Porta Herramientas 3 Niveles por $60.49 para mi taller. ¿Qué métodos de pago manejan?"
  },
  {
    id: "cmmwxkyzt05zp86cqs9j2tss1",
    sku: "BP-CAJ-COMPACT",
    name: "Carro Porta Cajas y Cilindros Profesional",
    badge: "ÁGIL & ULTRA RESISTENTE",
    capacity: "70 - 100 KG",
    tagline: "Robusto, duradero y fácil de usar para mover cajas, cilindros y paquetes ágilmente.",
    price: 13.19,
    regularPrice: 22.50,
    image: "/images/landing-carros/carro-porta-cajas-profesional.jpg",
    category: "cajas",
    specs: {
      capacidad: "70 KG a 100 KG",
      ruedas: "Ruedas de goma termo-inyectada silenciosas con rines reforzados",
      chasis: "Tubo de aleación ligera con manubrio extensible cromado",
      plegable: "Totalmente plegable (base y manubrio se retraen al ras)",
      peso: "3.4 KG"
    },
    recomendaciones: [
      "Despacho rápido de mensajería, paquetería urbana, motocicletas y camionetas.",
      "Cilindros de gas pequeños, botellones, garrafas y cajas de archivo muerto.",
      "Entra en cualquier rincón del auto, placard o debajo de mostradores de atención.",
      "La mejor relación costo/beneficio del mercado para transporte diario liviano."
    ],
    whatsappMsg: "Hola ATOMIC, deseo adquirir el Carro Porta Cajas y Cilindros por $13.19. ¿Cuál es el costo de envío a mi ciudad?"
  }
]

export default function CarrosIndustrialesClient({ initialProducts }: { initialProducts: DbProduct[] }) {
  const { addToCart } = useCart()
  const [activeFilter, setActiveFilter] = useState<string>("todos")
  const [addedItem, setAddedItem] = useState<string | null>(null)

  // Merge real prices from database if available
  const products = PRODUCTS_DATA.map(p => {
    const dbMatch = initialProducts?.find(db => db.id === p.id)
    if (dbMatch && dbMatch.price > 0) {
      return {
        ...p,
        price: dbMatch.price,
        regularPrice: dbMatch.compareAtPrice || p.regularPrice
      }
    }
    return p
  })

  const filteredProducts = activeFilter === "todos"
    ? products
    : products.filter(p => p.category === activeFilter)

  const handleAddToCart = (p: ProductItem) => {
    addToCart({
      id: p.id,
      name: p.name,
      price: p.price,
      quantity: 1,
      image: p.image
    })
    setAddedItem(p.id)
    setTimeout(() => setAddedItem(null), 2500)
  }

  const salesPhone = "593969043453"

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans selection:bg-yellow-400 selection:text-black relative overflow-x-hidden">
      
      {/* ── AMBIENT WAREHOUSE LIGHTING ── */}
      <div className="fixed inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:28px_28px] opacity-40 pointer-events-none" />
      <div className="fixed -top-40 left-1/4 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[160px] pointer-events-none" />
      <div className="fixed top-1/3 -right-40 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[180px] pointer-events-none" />

      {/* ── TOP NOTIFICATION BANNER ── */}
      <div className="relative z-50 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-black px-4 py-2 text-center text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-md">
        <Truck size={15} className="stroke-[2.5]" />
        <span>🇪🇨 Envíos Inmediatos a Todo el Ecuador | Quito, Guayaquil, Cuenca y Provincias | Stock Real en Bodega</span>
      </div>

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-40 bg-[#0a0f1d]/90 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          <Link href="/web" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-slate-900 border border-blue-400/40 flex items-center justify-center text-white font-black text-xl shadow-[0_0_20px_rgba(37,99,235,0.4)] group-hover:scale-105 transition-transform">
              <span className="text-yellow-400">A</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-lg font-black tracking-tight text-white uppercase">ATOMIC</span>
                <span className="text-xs font-black px-1.5 py-0.5 rounded bg-blue-600 text-white uppercase">INDUSTRIAL</span>
              </div>
              <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-0.5">
                Línea Oficial Banco del Perno
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <a
              href={`https://wa.me/${salesPhone}?text=Hola%20ATOMIC,%20deseo%20asesoria%20tecnica%20inmediata%20sobre%20los%20carros%20industriales%20de%20carga.`}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-105"
            >
              <Phone size={14} className="stroke-[2.5]" />
              <span>Cotizar por WhatsApp</span>
            </a>

            <Link
              href="/web/cart"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs font-bold transition-all"
            >
              <ShoppingCart size={16} />
              <span className="hidden md:inline">Ver Carrito</span>
            </Link>
          </div>

        </div>
      </header>

      {/* ── HERO INDUSTRIAL SECTION ── */}
      <section className="relative pt-12 pb-10 px-4 sm:px-8 border-b border-slate-800/60 bg-gradient-to-b from-[#0e1628] to-[#070b14]">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-blue-950/80 border border-blue-500/40 text-blue-300 text-xs font-mono font-bold uppercase tracking-wider shadow-inner">
            <ShieldCheck size={16} className="text-yellow-400" />
            <span>Equipos de Carga Pesada & Logística Profesional</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase leading-[1.08] font-sans">
            Mueve tu Carga <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500">Sin Esfuerzo</span>.
            <br />
            <span className="text-blue-400">Resistencia 100% Industrial.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
            Equipos fabricados en acero estructural y componentes reforzados para bodegas, talleres, escaleras y faenas pesadas. Cero complicaciones, despacho inmediato y garantía directa en Ecuador.
          </p>

          {/* Value Props Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto pt-2 text-left">
            <div className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-yellow-500/10 text-yellow-400 flex items-center justify-center shrink-0">
                <Truck size={18} />
              </div>
              <div>
                <p className="text-white text-xs font-bold">Envíos a Todo el País</p>
                <p className="text-slate-400 text-[10px]">Servientrega / Transporte</p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                <ShieldCheck size={18} />
              </div>
              <div>
                <p className="text-white text-xs font-bold">Garantía Directa</p>
                <p className="text-slate-400 text-[10px]">Calidad Banco del Perno</p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                <Zap size={18} />
              </div>
              <div>
                <p className="text-white text-xs font-bold">Stock Inmediato</p>
                <p className="text-slate-400 text-[10px]">Despacho en 24 horas</p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                <Wrench size={18} />
              </div>
              <div>
                <p className="text-white text-xs font-bold">Uso Profesional</p>
                <p className="text-slate-400 text-[10px]">Bodega, Taller y Reparto</p>
              </div>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {[
              { id: "todos", label: "Todos los Modelos (5)" },
              { id: "escalador", label: "Escaleras (80 KG)" },
              { id: "plataforma", label: "Plataforma Almacén" },
              { id: "pesado", label: "Carga Pesada (200 KG)" },
              { id: "taller", label: "Taller Mecánico (3 Niveles)" },
              { id: "cajas", label: "Porta Cajas Ágil" },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  activeFilter === tab.id
                    ? "bg-yellow-400 text-black shadow-[0_0_20px_rgba(250,204,21,0.4)] scale-105"
                    : "bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* ── PRODUCT SHOWCASE GRID (EXACT GRAPHIC BANNERS) ── */}
      <section className="py-14 px-4 sm:px-8 max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-10 pb-4 border-b border-slate-800">
          <div>
            <span className="text-yellow-400 text-xs font-black uppercase tracking-widest font-mono">
              Catálogo de Venta Directa
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mt-1">
              Modelos Seleccionados para Faena Industrial
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Haz clic en cualquier imagen o botón para ver detalles o comprar directamente en tienda.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredProducts.map((prod) => {
            const savings = Math.max(0, prod.regularPrice - prod.price)
            const isAdded = addedItem === prod.id

            return (
              <div 
                key={prod.id}
                className="group relative rounded-3xl bg-[#0c1222] border-2 border-slate-800 hover:border-blue-500/60 shadow-2xl transition-all duration-300 flex flex-col overflow-hidden hover:shadow-[0_15px_40px_rgba(37,99,235,0.2)]"
              >
                {/* ── BANNER IMAGE COMPONENT (EXACT GRAPHIC UPLOADED) ── */}
                <div className="relative w-full aspect-square bg-[#060913] overflow-hidden">
                  
                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5 items-start">
                    <span className="px-3 py-1 rounded-lg bg-blue-600 text-white font-black text-[11px] uppercase tracking-wider shadow-lg">
                      {prod.badge}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-yellow-400 text-black font-black text-[10px] uppercase tracking-wider">
                      CAPACIDAD: {prod.capacity}
                    </span>
                  </div>

                  {/* Ecuador Free Shipping Stamp */}
                  <div className="absolute top-4 right-4 z-20 px-3 py-1 rounded-xl bg-black/70 backdrop-blur-md border border-white/20 text-right">
                    <span className="text-[10px] font-black text-yellow-400 uppercase tracking-widest block">
                      🇪🇨 ENVÍO GRATIS
                    </span>
                    <span className="text-[9px] text-slate-300 font-bold">
                      A Todo Ecuador
                    </span>
                  </div>

                  {/* Clickable Image -> Direct Shop Product URL */}
                  <Link 
                    href={`/web/product/${prod.id}`}
                    className="block w-full h-full relative group-hover:scale-[1.03] transition-transform duration-500 cursor-pointer"
                    title={`Ver ${prod.name} en la tienda oficial`}
                  >
                    <Image
                      src={prod.image}
                      alt={prod.name}
                      fill
                      priority
                      className="object-cover object-center"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                      <div className="px-4 py-2 rounded-xl bg-yellow-400 text-black font-black text-xs uppercase tracking-wider shadow-2xl flex items-center gap-2">
                        <span>Ver en Tienda</span>
                        <ArrowRight size={14} className="stroke-[3]" />
                      </div>
                    </div>
                  </Link>

                </div>

                {/* ── PRODUCT CONTENT & TECH SPECS ── */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-5 bg-gradient-to-b from-[#0c1222] to-[#090d18]">
                  
                  <div>
                    {/* Title & Tagline */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                          SKU: {prod.sku} • Banco del Perno
                        </span>
                        <Link 
                          href={`/web/product/${prod.id}`}
                          className="hover:text-yellow-400 transition-colors"
                        >
                          <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight leading-tight mt-0.5">
                            {prod.name}
                          </h3>
                        </Link>
                      </div>
                    </div>

                    <p className="text-slate-300 text-xs sm:text-sm mt-2 font-normal leading-relaxed">
                      {prod.tagline}
                    </p>

                    {/* Technical Specs Bento */}
                    <div className="grid grid-cols-2 gap-2 mt-4 p-3 rounded-2xl bg-black/40 border border-slate-800/80 text-[11px] font-mono">
                      <div>
                        <span className="text-slate-500 block">Capacidad:</span>
                        <span className="text-yellow-400 font-bold">{prod.specs.capacidad}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Ruedas:</span>
                        <span className="text-slate-200 font-bold truncate block">{prod.specs.ruedas}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Chasis:</span>
                        <span className="text-slate-200 font-bold truncate block">{prod.specs.chasis}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Plegable:</span>
                        <span className="text-emerald-400 font-bold">{prod.specs.plegable}</span>
                      </div>
                    </div>

                    {/* Recomendaciones de Uso Profesionales */}
                    <div className="mt-4 space-y-1.5">
                      <p className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5 font-mono">
                        <CheckCircle2 size={13} className="text-yellow-400" />
                        Recomendaciones de uso profesional:
                      </p>
                      <ul className="space-y-1 pl-1">
                        {prod.recomendaciones.map((rec, i) => (
                          <li key={i} className="text-[11px] text-slate-300 flex items-start gap-2 leading-tight">
                            <span className="text-yellow-400 font-bold shrink-0">▸</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* ── PRICE & ACTION BUTTONS (OPTIMIZADOS 100% PARA VENTA) ── */}
                  <div className="pt-4 border-t border-slate-800 space-y-3">
                    
                    {/* Price Tag */}
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-mono block">
                          Precio Oficial con IVA
                        </span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                            ${prod.price.toFixed(2)}
                          </span>
                          {savings > 0 && (
                            <span className="text-xs text-slate-500 line-through font-mono">
                              ${prod.regularPrice.toFixed(2)}
                            </span>
                          )}
                          <span className="text-[10px] font-bold text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                            AHORRAS ${savings.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[9px] font-mono text-emerald-400 uppercase font-black block">
                          ● En Stock Bodega
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Entrega en 24h
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      
                      {/* 1. Comprar en Tienda (Direct Product Link) */}
                      <Link
                        href={`/web/product/${prod.id}`}
                        className="sm:col-span-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 text-center"
                      >
                        <span>Ver en Tienda</span>
                        <ExternalLink size={13} />
                      </Link>

                      {/* 2. Pedido Inmediato WhatsApp */}
                      <a
                        href={`https://wa.me/${salesPhone}?text=${encodeURIComponent(prod.whatsappMsg)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="sm:col-span-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] active:scale-95 text-center"
                      >
                        <Phone size={14} className="stroke-[2.5]" />
                        <span>Pedir WhatsApp</span>
                      </a>

                      {/* 3. Añadir al Carrito */}
                      <button
                        type="button"
                        onClick={() => handleAddToCart(prod)}
                        className={`sm:col-span-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all active:scale-95 cursor-pointer ${
                          isAdded
                            ? "bg-yellow-400 text-black shadow-[0_0_15px_rgba(250,204,21,0.5)]"
                            : "bg-slate-800 hover:bg-slate-700 text-yellow-400 border border-yellow-500/30"
                        }`}
                      >
                        <ShoppingCart size={14} />
                        <span>{isAdded ? "¡Añadido!" : "Al Carrito"}</span>
                      </button>

                    </div>

                  </div>

                </div>

              </div>
            )
          })}
        </div>

      </section>

      {/* ── TECHNICAL COMPARISON TABLE ── */}
      <section className="py-12 px-4 sm:px-8 max-w-7xl mx-auto border-t border-slate-800">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-yellow-400 text-xs font-mono uppercase tracking-widest font-black">
            Guía Rápida de Selección
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mt-1">
            Tabla Comparativa de Modelos
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Compara capacidades y características para escoger el equipo exacto que requiere tu operación.
          </p>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-[#0c1222] shadow-2xl">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#0f172a] text-slate-300 uppercase border-b border-slate-800">
              <tr>
                <th className="p-4 font-black">Equipo</th>
                <th className="p-4 font-black">Capacidad</th>
                <th className="p-4 font-black">Tipo de Ruedas</th>
                <th className="p-4 font-black">Plegable</th>
                <th className="p-4 font-black">Uso Principal</th>
                <th className="p-4 font-black">Precio con IVA</th>
                <th className="p-4 font-black text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {PRODUCTS_DATA.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>{p.name}</span>
                  </td>
                  <td className="p-4 text-yellow-400 font-bold">{p.capacity}</td>
                  <td className="p-4 text-slate-300">{p.specs.ruedas}</td>
                  <td className="p-4 text-emerald-400 font-bold">{p.specs.plegable}</td>
                  <td className="p-4 text-slate-300 max-w-[200px] truncate">{p.tagline}</td>
                  <td className="p-4 text-white font-black text-sm">${p.price.toFixed(2)}</td>
                  <td className="p-4 text-center">
                    <Link
                      href={`/web/product/${p.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] uppercase tracking-wider transition-all"
                    >
                      <span>Ver</span>
                      <ChevronRight size={12} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── FAQ & DIRECT WHOLESALE ADVISORY ── */}
      <section className="py-12 px-4 sm:px-8 max-w-5xl mx-auto border-t border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0c1326] to-[#070b14] border border-blue-500/30 space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Truck size={20} />
            </div>
            <h3 className="text-lg font-black text-white uppercase tracking-tight">
              ¿Cómo realizamos los envíos a provincias?
            </h3>
            <p className="text-slate-300 text-xs leading-relaxed">
              Despachamos diariamente desde Quito a todas las ciudades del país mediante <strong>Servientrega</strong>, cooperativas de encomiendas o transporte de carga pesada. Los pedidos confirmados antes de las 14:00 se despachan el mismo día laborable con guía de rastreo inmediata.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0c1326] to-[#070b14] border border-yellow-500/30 space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-yellow-500/20 text-yellow-400 flex items-center justify-center">
              <ShieldCheck size={20} />
            </div>
            <h3 className="text-lg font-black text-white uppercase tracking-tight">
              Facturación con IVA & Compras por Mayor
            </h3>
            <p className="text-slate-300 text-xs leading-relaxed">
              Emitimos factura electrónica autorizada por el SRI con IVA desglosado para empresas, constructoras, almacenes y personas naturales. Si requieres equipar flotas de reparto o compras al por mayor, solicita precio mayorista directamente por WhatsApp.
            </p>
          </div>

        </div>

        {/* Big Industrial WhatsApp Call To Action */}
        <div className="mt-10 p-8 rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-[#070b14] border-2 border-yellow-400/40 text-center space-y-4 shadow-2xl">
          <span className="px-3 py-1 rounded-full bg-yellow-400 text-black text-[10px] font-black uppercase tracking-widest">
            Asistencia Inmediata
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            ¿Tienes dudas técnicas o necesitas cotización formal para tu empresa?
          </h3>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto">
            Habla directamente con nuestros asesores comerciales en tiempo real. Te enviamos ficha técnica, fotos de stock real en bodega y proforma formal en minutos.
          </p>
          <div className="pt-2">
            <a
              href={`https://wa.me/${salesPhone}?text=Hola%20ATOMIC,%20deseo%20asesoria%20comercial%20para%20comprar%20carros%20de%20carga%20industriales.`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-black text-sm uppercase tracking-wider hover:from-emerald-400 hover:to-teal-300 transition-all shadow-[0_0_30px_rgba(16,185,129,0.4)] active:scale-95"
            >
              <Phone size={18} className="stroke-[2.5]" />
              <span>Chatear con un Asesor por WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="mt-12 border-t border-slate-800 bg-[#050810] py-8 px-4 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} ATOMIC Ecuador • Línea de Logística & Carga Banco del Perno (BP).</p>
          <div className="flex items-center gap-4">
            <Link href="/web" className="hover:text-slate-300 transition-colors">Tienda Oficial</Link>
            <span>•</span>
            <Link href="/web/matriz-precios" className="hover:text-slate-300 transition-colors">Matriz de Precios</Link>
            <span>•</span>
            <Link href="/web/cart" className="hover:text-slate-300 transition-colors">Carrito</Link>
          </div>
        </div>
      </footer>

      {/* ── STICKY MOBILE CONVERSION BAR ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0a0f1d]/95 backdrop-blur-xl border-t border-slate-800 p-2.5 flex items-center justify-between gap-2 sm:hidden shadow-2xl">
        <div className="flex-1 min-w-0 pl-1">
          <span className="text-[10px] text-yellow-400 font-black uppercase block leading-none truncate">
            Carros Industriales BP
          </span>
          <span className="text-[11px] text-white font-mono font-bold">
            Desde $13.19 • Envíos EC
          </span>
        </div>

        <a
          href={`https://wa.me/${salesPhone}?text=Hola%20ATOMIC,%20deseo%20comprar%20carros%20industriales%20de%20carga.`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 text-black font-black text-xs uppercase tracking-wider shadow-lg shrink-0"
        >
          <Phone size={14} className="stroke-[2.5]" />
          <span>Pedir WhatsApp</span>
        </a>
      </div>

    </div>
  )
}
