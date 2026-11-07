"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { 
  Gamepad2, ShieldCheck, Sparkles, ShoppingCart, Phone, 
  ArrowRight, CheckCircle2, Youtube, BookOpen, Clock, 
  Award, Zap, Check, HelpCircle, AlertCircle, Lock, 
  ExternalLink, ChevronRight, Play, Star, Disc, Layers,
  Flame, HeartHandshake, Eye
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

interface SoldConsole {
  id: string
  name: string
  clientLocation: string
  clientName: string
  soldDate: string
  pricePaid: string
  details: string
  image: string
}

export default function AtomicGamingClient({ initialProducts }: { initialProducts: DbProduct[] }) {
  const { addToCart } = useCart()
  const [addedItem, setAddedItem] = useState<string | null>(null)
  
  // Interactive Console Variant Selector
  // 1: 1 Control ($260) | 2: 2 Controles ($280) | 3: Con Magia & Juegos ($295)
  const [selectedPs4Config, setSelectedPs4Config] = useState<number>(3)

  const officialPhone = "593980319050"
  const formattedPhone = "098 031 9050"

  const PS4_CONFIGS = [
    {
      id: 1,
      sku: "PS4-SLIM-1TB-GOW-1C",
      title: "PlayStation 4 Slim 1 TB + 1 Control",
      badge: "OPCIÓN ECONÓMICA",
      price: 260.00,
      regularPrice: 320.00,
      controllers: "1 Control Original DualShock 4",
      magicIncluded: false,
      included: [
        "Consola PS4 versión Slim de 1 TB de disco duro",
        "1 Control original DualShock 4 en óptimo estado",
        "Estuche rígido de transporte PlayStation oficial",
        "Cable HDMI de alta velocidad + cable de poder + cable de carga",
        "2 Años de garantía certificada ATOMIC Gaming"
      ],
      whatsappText: "Hola ATOMIC Gaming, deseo comprar la PlayStation 4 Slim 1TB con 1 CONTROL por $260. ¿Tienen entrega inmediata?"
    },
    {
      id: 2,
      sku: "PS4-SLIM-1TB-GOW-2C",
      title: "PlayStation 4 Slim 1 TB + 2 Controles (God of War + Camo Red)",
      badge: "PACK MULTIJUGADOR",
      price: 280.00,
      regularPrice: 350.00,
      controllers: "2 Controles DualShock 4 (God of War + Camo Red)",
      magicIncluded: false,
      included: [
        "Consola PS4 versión Slim de 1 TB de disco duro",
        "2 Controles DualShock 4: 1 Edición God of War + 1 Edición Camo Red militar",
        "Estuche rígido de transporte PlayStation oficial",
        "Cable HDMI de alta velocidad + cable de poder + cables de carga",
        "2 Años de garantía certificada ATOMIC Gaming"
      ],
      whatsappText: "Hola ATOMIC Gaming, me interesa la PlayStation 4 Slim 1TB con 2 CONTROLES (God of War + Camo) por $280. ¿Cómo coordino la compra?"
    },
    {
      id: 3,
      sku: "PS4-SLIM-1TB-GOW-MAGIA",
      title: "PlayStation 4 Slim 1 TB + 2 Controles + Magia & Juegos a Elección",
      badge: "EDICIÓN DEFINITIVA • MÁS VENDIDA",
      price: 295.00,
      regularPrice: 390.00,
      controllers: "2 Controles DualShock 4 (God of War + Camo Red)",
      magicIncluded: true,
      included: [
        "Consola PS4 versión Slim de 1 TB de disco duro",
        "Magia instalada permanente: descarga y juega todos los títulos sin pagar de más",
        "Juegos a completa elección del cliente ya descargados e instalados",
        "2 Controles DualShock 4 (Edición God of War + Edición Camo Red)",
        "Estuche rígido de transporte PlayStation oficial",
        "Cables originales completos",
        "2 Años de garantía certificada ATOMIC Gaming"
      ],
      whatsappText: "Hola ATOMIC Gaming, quiero la PlayStation 4 Slim 1TB con 2 CONTROLES y MAGIA INSTALADA con juegos a mi elección por $295. ¿Qué catálogo de juegos puedo elegir?"
    }
  ]

  const activeConfig = PS4_CONFIGS.find(c => c.id === selectedPs4Config) || PS4_CONFIGS[2]

  const SOLD_CONSOLES: SoldConsole[] = [
    {
      id: "sold-ps5-slim",
      name: "PlayStation 5 Slim 1 TB SSD + 2 Mandos DualSense",
      clientLocation: "Quito, Sector Cumbayá",
      clientName: "Esteban V.",
      soldDate: "Entregado el 28 de Octubre 2026",
      pricePaid: "$560.00",
      details: "Estado 10/10 Open Box con caja original y garantía de 2 años activa.",
      image: "/images/gaming/ps4-slim-1tb-god-of-war.jpg"
    },
    {
      id: "sold-ps4-pro-gow",
      name: "PlayStation 4 Pro 1 TB 4K HDR Edición God of War Limitada",
      clientLocation: "Quito Norte, El Inca",
      clientName: "Mateo R.",
      soldDate: "Entregado el 22 de Octubre 2026",
      pricePaid: "$370.00",
      details: "Mantenimiento térmico profundo, pasta disipadora Arctic MX-4 y 2 controles.",
      image: "/images/gaming/ps4-slim-1tb-god-of-war.jpg"
    },
    {
      id: "sold-switch-oled",
      name: "Nintendo Switch OLED 64GB Edición Zelda Tears of the Kingdom",
      clientLocation: "Guayaquil, Samborondón",
      clientName: "Carlos M.",
      soldDate: "Entregado el 15 de Octubre 2026",
      pricePaid: "$320.00",
      details: "Despacho asegurado por Servientrega con estuche de viaje y mica de vidrio.",
      image: "/images/gaming/ps4-slim-1tb-god-of-war.jpg"
    },
    {
      id: "sold-xbox-series-s",
      name: "Xbox Series S 512GB SSD Digital + 2 Mandos Inalámbricos",
      clientLocation: "Cuenca, Sector El Vergel",
      clientName: "David P.",
      soldDate: "Entregado el 05 de Octubre 2026",
      pricePaid: "$270.00",
      details: "Cuenta activa de Game Pass Ultimate de cortesía y 2 años de garantía.",
      image: "/images/gaming/ps4-slim-1tb-god-of-war.jpg"
    }
  ]

  const BLOG_POSTS = [
    {
      id: "ps4-slim-2026",
      title: "¿Vale la pena comprar una PS4 Slim de 1TB en 2026?",
      excerpt: "Analizamos el catálogo de más de 4,000 juegos, el costo por título, la resolución 1080p nativa y por qué sigue siendo la consola con mejor relación calidad-precio del mercado.",
      readTime: "4 min de lectura",
      tag: "ANÁLISIS DE MERCADO",
      date: "04 Nov 2026"
    },
    {
      id: "magia-playstation",
      title: "Todo sobre la Magia en PlayStation: Cómo jugar tus títulos favoritos sin gastar una fortuna",
      excerpt: "Explicamos de manera transparente cómo funciona la liberación de firmware en PS4, qué ventajas ofrece para guardar juegos en el disco de 1TB y cómo mantenemos la garantía de 2 años.",
      readTime: "6 min de lectura",
      tag: "GUÍA TÉCNICA",
      date: "01 Nov 2026"
    },
    {
      id: "mantenimiento-termico",
      title: "Por qué una consola certificada ATOMIC dura 10 años más",
      excerpt: "El secreto del rendimiento silencioso: desmontaje completo, limpieza por ultrasonido, cambio de thermal pads y aplicación de pasta térmica de grafito de grado aeroespacial.",
      readTime: "5 min de lectura",
      tag: "LABORATORIO ATOMIC",
      date: "27 Oct 2026"
    }
  ]

  const handleAddToCart = () => {
    addToCart({
      id: `gaming-${activeConfig.sku}`,
      name: activeConfig.title,
      price: activeConfig.price,
      quantity: 1,
      image: "/images/gaming/ps4-slim-1tb-god-of-war.jpg"
    })
    setAddedItem(activeConfig.sku)
    setTimeout(() => setAddedItem(null), 2500)
  }

  return (
    <div className="min-h-screen bg-[#050811] text-stone-100 font-sans selection:bg-blue-600 selection:text-white relative overflow-x-hidden">
      
      {/* ── PLAYSTATION DEEP BLUE AMBIENT LIGHTING ── */}
      <div className="fixed inset-0 bg-[radial-gradient(#0e2247_1px,transparent_1px)] [background-size:32px_32px] opacity-40 pointer-events-none" />
      <div className="fixed -top-40 left-1/3 w-[650px] h-[650px] bg-blue-600/15 rounded-full blur-[200px] pointer-events-none" />
      <div className="fixed top-1/2 -right-40 w-[700px] h-[700px] bg-indigo-700/10 rounded-full blur-[240px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[220px] pointer-events-none" />

      {/* ── TOP ANNOUNCEMENT BAR ── */}
      <div className="relative z-50 bg-gradient-to-r from-[#00173d] via-[#002f7a] to-[#00173d] border-b border-blue-500/40 text-blue-200 px-4 py-2 text-center text-xs font-mono font-bold tracking-wider flex items-center justify-center gap-2 shadow-sm">
        <Sparkles size={14} className="text-yellow-400 animate-pulse" />
        <span>ECOSISTEMA ATOMIC GAMING • CONSOLAS CERTIFICADAS CON 2 AÑOS DE GARANTÍA REAL • MANTENIMIENTO TÉRMICO PROFUNDO</span>
      </div>

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-40 bg-[#060b17]/90 backdrop-blur-2xl border-b border-blue-950 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          <Link href="/web" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#003791] via-[#002266] to-[#020b1c] border border-blue-400/50 flex items-center justify-center text-white font-black text-xl shadow-[0_0_20px_rgba(0,112,209,0.5)] group-hover:scale-105 transition-transform">
              <Gamepad2 size={22} className="text-blue-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-xl font-black tracking-tight text-white uppercase font-sans">ATOMIC</span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-600 text-white uppercase font-mono">
                  GAMING
                </span>
              </div>
              <p className="text-[10px] text-blue-300/80 font-bold tracking-widest uppercase mt-0.5 font-mono">
                Consolas de Segunda Mano Certificadas
              </p>
            </div>
          </Link>

          {/* Quick Direct WhatsApp & Cart */}
          <div className="flex items-center gap-3">
            <a
              href={`https://wa.me/${officialPhone}?text=Hola%20ATOMIC%20Gaming,%20deseo%20asesoria%20sobre%20consolas%20disponibles%20con%202%20anos%20de%20garantia.`}
              target="_blank"
              rel="noreferrer"
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-[#09152b] border border-blue-500/40 hover:border-blue-400 text-blue-200 text-xs font-mono font-bold transition-all"
            >
              <Phone size={14} className="text-blue-400" />
              <span>{formattedPhone}</span>
              <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded border border-blue-500/30">Asesor Gamer</span>
            </a>

            <Link
              href="/web/cart"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#09152b] border border-slate-800 hover:border-blue-700 text-stone-200 text-xs font-mono transition-all"
            >
              <ShoppingCart size={15} className="text-blue-400" />
              <span className="hidden sm:inline">Carrito</span>
            </Link>

            <Link
              href="/web"
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 text-white text-xs font-black uppercase tracking-wider font-mono transition-all shadow-md"
            >
              Tienda General
            </Link>
          </div>

        </div>
      </header>

      {/* ── HERO & MANIFIESTO: NOSOTROS BUSCAMOS LAS MEJORES CONSOLAS Y TÚ CONFÍA EN NOSOTROS ── */}
      <section className="relative pt-12 pb-14 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/40 text-blue-300 text-xs font-mono font-bold uppercase tracking-wider">
              <ShieldCheck size={15} className="text-blue-400" />
              <span>2 Años de Garantía Real en Cada Consola</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase font-sans leading-[1.06]">
              Nosotros buscamos las mejores consolas, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400">
                y tú solo confía en nosotros.
              </span>
            </h1>

            <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              Compramos consolas del mercado seleccionadas minuciosamente, las desarmamos para una limpieza técnica completa, aplicamos pasta térmica nueva de alta disipación, verificamos lectura, discos y controles, y te las entregamos <strong>100% listas para jugar con 2 años de garantía</strong>.
            </p>

            {/* Slogans / Value Props Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3.5 rounded-2xl bg-[#091325] border border-blue-500/30">
                <ShieldCheck size={18} className="text-blue-400 mb-1" />
                <h4 className="text-xs font-black text-white uppercase font-mono">2 Años de Garantía</h4>
                <p className="text-[11px] text-stone-400 leading-tight mt-0.5">Tranquilidad absoluta y respaldo por escrito.</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#091325] border border-cyan-500/30">
                <Zap size={18} className="text-cyan-400 mb-1" />
                <h4 className="text-xs font-black text-white uppercase font-mono">Mantenimiento Pro</h4>
                <p className="text-[11px] text-stone-400 leading-tight mt-0.5">Pasta térmica nueva, ventilador silencioso y cero polvo.</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#091325] border border-yellow-500/30">
                <Award size={18} className="text-yellow-400 mb-1" />
                <h4 className="text-xs font-black text-white uppercase font-mono">100% Lista Para Jugar</h4>
                <p className="text-[11px] text-stone-400 leading-tight mt-0.5">Con cables originales, estuche rígido y controles impecables.</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#seccion-disponibles"
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:brightness-110 text-white font-black text-xs uppercase tracking-wider font-mono shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all active:scale-95 cursor-pointer"
              >
                <span>Ver Consola Disponible (PS4 Slim 1TB)</span>
                <ArrowRight size={14} />
              </a>

              <a
                href="#seccion-vendidas"
                className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-[#0a162b] hover:bg-[#122344] border border-blue-500/40 text-blue-200 text-xs font-bold uppercase tracking-wider font-mono transition-all"
              >
                <span>Historial de Clientes Vendidos</span>
              </a>
            </div>

          </div>

          {/* Right Column: Hero Visual from User's God of War Banner */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border-2 border-blue-500/50 shadow-[0_0_50px_rgba(0,112,209,0.3)] bg-[#070e1c] aspect-square group">
              <Image
                src="/images/gaming/ps4-slim-1tb-god-of-war.jpg"
                alt="PlayStation 4 Slim 1TB God of War ATOMIC Gaming"
                fill
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050811] via-transparent to-black/30" />
              
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider font-mono shadow-md">
                  EN STOCK INMEDIATO • QUITO
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-2xl bg-[#060d1b]/95 backdrop-blur-md border border-blue-800 text-left">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-blue-400 font-mono font-bold uppercase block">Disponible Hoy</span>
                    <h4 className="text-xs font-black text-white uppercase">PS4 Slim 1TB + DualShock God of War</h4>
                  </div>
                  <span className="text-sm font-black text-yellow-400 font-mono bg-blue-950/80 px-2.5 py-1 rounded-lg border border-blue-600">
                    Desde $260
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════════
          APARTADO 1: CONSOLAS DISPONIBLES (EN STOCK INMEDIATO)
      ══════════════════════════════════════════════════════════════════════════════ */}
      <section className="py-14 px-4 sm:px-8 max-w-7xl mx-auto border-t border-blue-950" id="seccion-disponibles">
        
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider border border-emerald-500/30 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Disponible Para Entrega Inmediata</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight font-sans">
            PlayStation 4 Slim 1 TB • Edición God of War & Camo
          </h2>
          <p className="text-stone-400 text-xs sm:text-sm mt-1">
            Rendimiento, diversión y sin límites. Selecciona la configuración que mejor se adapte a tu forma de jugar.
          </p>
        </div>

        {/* Featured Big Console Card */}
        <div className="rounded-3xl bg-[#091325] border-2 border-blue-500/50 overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-0">
          
          {/* Image Showcase */}
          <div className="lg:col-span-6 relative aspect-square sm:aspect-[4/3] lg:aspect-auto bg-[#040813] min-h-[340px]">
            <Image
              src="/images/gaming/ps4-slim-1tb-god-of-war.jpg"
              alt="PlayStation 4 Slim 1TB Edición God of War"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#091325] via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#091325]" />
            
            <div className="absolute top-4 left-4 flex flex-col gap-1.5">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase font-mono bg-blue-600 text-white shadow-lg">
                1 TB DE DISCO DURO
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase font-mono bg-emerald-500 text-stone-950 shadow-md">
                2 AÑOS DE GARANTÍA
              </span>
            </div>

            <div className="absolute bottom-4 left-4">
              <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-black/80 backdrop-blur-md text-stone-200 border border-slate-700">
                Incluye Estuche Rígido & Cables Originales
              </span>
            </div>
          </div>

          {/* Configuration & Purchase Controls */}
          <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-400">
                  Modelo PlayStation 4 Slim • Código de Certificación: ATOMIC-GOW-01
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight mt-0.5">
                  PlayStation 4 Slim 1 TB (Impecable Estado)
                </h3>
                <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                  Consola verificada en banco de pruebas: lector blu-ray al 100%, pasta térmica de alto rendimiento recién aplicada, puertos HDMI sin holguras y disco duro de 1,000 GB con salud al 100%.
                </p>
              </div>

              {/* Selector de Configuración Interactiva */}
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-stone-300 uppercase block">
                  Elige tu Configuración de Compra:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {PS4_CONFIGS.map(cfg => (
                    <button
                      key={cfg.id}
                      type="button"
                      onClick={() => setSelectedPs4Config(cfg.id)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        selectedPs4Config === cfg.id
                          ? 'bg-blue-600/20 border-blue-400 text-white shadow-[0_0_15px_rgba(59,130,246,0.25)] scale-[1.02]'
                          : 'bg-[#060c18] border-slate-800 text-stone-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-[9px] font-mono font-bold block uppercase text-blue-300">
                        {cfg.badge}
                      </span>
                      <span className="text-lg font-black text-yellow-400 font-mono block mt-0.5">
                        ${cfg.price.toFixed(0)}
                      </span>
                      <span className="text-[10px] text-stone-300 block font-sans leading-tight mt-0.5">
                        {cfg.id === 1 ? '1 Control Original' : cfg.id === 2 ? '2 Controles GOW+Camo' : '2 Controles + Magia'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* What's Included in the Selected Configuration */}
              <div className="p-4 rounded-2xl bg-[#060c18] border border-blue-950 space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-bold block">
                  Incluido en esta configuración seleccionada (${activeConfig.price}):
                </span>
                <ul className="space-y-1.5">
                  {activeConfig.included.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-stone-300">
                      <CheckCircle2 size={14} className="text-blue-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Price & Checkout Buttons */}
            <div className="space-y-3 pt-4 border-t border-slate-800/80">
              
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] font-mono text-stone-400 line-through block">
                    Precio regular estimado: ${activeConfig.regularPrice.toFixed(2)}
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl font-black text-yellow-400 font-mono">
                      ${activeConfig.price.toFixed(2)}
                    </span>
                    <span className="text-xs text-stone-400 font-mono">USD</span>
                    <span className="text-[10px] bg-blue-600/30 text-blue-300 px-2 py-0.5 rounded-full font-mono font-bold border border-blue-500/40 ml-2">
                      Garantía 2 Años Incluida
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider font-mono transition-all cursor-pointer ${
                    addedItem === activeConfig.sku
                      ? 'bg-emerald-500 text-stone-950 shadow-lg'
                      : 'bg-[#10203f] hover:bg-[#182f5c] text-white border border-blue-500/50'
                  }`}
                >
                  <ShoppingCart size={16} className="text-blue-400" />
                  <span>{addedItem === activeConfig.sku ? "¡Añadido al Carrito!" : "Añadir al Carrito"}</span>
                </button>

                <a
                  href={`https://wa.me/${officialPhone}?text=${encodeURIComponent(activeConfig.whatsappText)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 text-white font-black text-xs uppercase tracking-wider font-mono transition-all shadow-[0_0_25px_rgba(37,99,235,0.4)]"
                >
                  <Phone size={16} className="stroke-[2.5]" />
                  <span>Comprar por WhatsApp</span>
                </a>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ══════════════════════════════════════════════════════════════════════════════
          APARTADO 2: HISTORIAL DE CLIENTES VENDIDOS (CONSOLAS YA VENDIDAS / AGOTADO)
      ══════════════════════════════════════════════════════════════════════════════ */}
      <section className="py-14 px-4 sm:px-8 max-w-7xl mx-auto border-t border-blue-950" id="seccion-vendidas">
        
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-8 pb-4 border-b border-blue-950">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-mono font-bold uppercase tracking-wider border border-red-500/30 mb-2">
              <Lock size={13} />
              <span>Registro de Transparencia & Entregas</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight font-sans">
              Historial de Consolas Vendidas
            </h2>
            <p className="text-stone-400 text-xs sm:text-sm mt-0.5">
              Consolas compradas, revisadas en laboratorio y entregadas con éxito a miembros de nuestra comunidad gamer.
            </p>
          </div>

          <a
            href={`https://wa.me/${officialPhone}?text=Hola%20ATOMIC%20Gaming,%20busco%20una%20consola%20especifica%20(PS5,%20PS4,%20Switch%20o%20Xbox).%20Deseo%20que%20me%20ayuden%20a%20buscarla%20y%20certificarla%20con%202%20anos%20de%20garantia.`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#09152b] hover:bg-[#122344] border border-blue-500/40 text-blue-200 text-xs font-mono font-bold transition-all shrink-0"
          >
            <span>¿Buscas otro modelo? Te lo conseguimos</span>
            <ChevronRight size={14} />
          </a>
        </div>

        {/* Sold Consoles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SOLD_CONSOLES.map((sold) => (
            <div 
              key={sold.id}
              className="rounded-3xl bg-[#081020] border border-slate-800/80 overflow-hidden relative flex flex-col justify-between group opacity-90 hover:opacity-100 transition-opacity"
            >
              <div>
                
                {/* Image with Restrictive "YA AGOTADO" Badge & Watermark */}
                <div className="relative aspect-[4/3] w-full bg-slate-950 overflow-hidden">
                  <Image
                    src={sold.image}
                    alt={sold.name}
                    fill
                    className="object-cover grayscale contrast-125 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />
                  
                  {/* Restrictive Stamp / Logo */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <div className="rotate-[-12deg] px-4 py-1.5 rounded-xl bg-red-600/90 border-2 border-red-400 text-white font-black text-xs uppercase tracking-widest font-mono shadow-[0_0_20px_rgba(239,68,68,0.6)] flex items-center gap-1.5">
                      <Lock size={14} />
                      <span>YA AGOTADO • VENDIDA</span>
                    </div>
                  </div>

                  <div className="absolute bottom-2 left-2 right-2 text-center">
                    <span className="text-[10px] font-mono text-stone-300 bg-black/80 px-2 py-0.5 rounded border border-slate-800">
                      {sold.soldDate}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 space-y-2.5">
                  <div className="flex items-center justify-between text-[10px] font-mono text-emerald-400">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 size={12} /> Cliente: {sold.clientName}
                    </span>
                    <span className="text-stone-400">{sold.clientLocation}</span>
                  </div>

                  <h3 className="text-sm font-black text-white uppercase leading-snug">
                    {sold.name}
                  </h3>

                  <p className="text-[11px] text-stone-400 leading-relaxed">
                    {sold.details}
                  </p>
                </div>

              </div>

              {/* Footer Stamp */}
              <div className="p-5 pt-0">
                <div className="p-2.5 rounded-xl bg-[#050a14] border border-slate-800 flex items-center justify-between text-xs font-mono">
                  <span className="text-stone-500">Precio entregado:</span>
                  <span className="font-bold text-stone-300">{sold.pricePaid}</span>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Notice for Future Past Consoles */}
        <div className="mt-8 p-4 rounded-2xl bg-[#09152b]/60 border border-blue-900/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-400">
          <div className="flex items-center gap-2 text-stone-300">
            <HeartHandshake size={16} className="text-blue-400 shrink-0" />
            <span>¿Tienes una consola que deseas vender? También compramos consolas usadas con pago inmediato tras revisión en laboratorio.</span>
          </div>
          <a
            href={`https://wa.me/${officialPhone}?text=Hola%20ATOMIC%20Gaming,%20deseo%20vender%20mi%20consola.%20%C2%BFCu%C3%A1nto%20me%20ofrecen?`}
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-[11px] uppercase tracking-wider shrink-0 transition-colors"
          >
            Cotizar mi consola
          </a>
        </div>

      </section>

      {/* ══════════════════════════════════════════════════════════════════════════════
          APARTADO 3: ATOMIC GAMING CANAL DE YOUTUBE & ARTÍCULOS DE BLOG
      ══════════════════════════════════════════════════════════════════════════════ */}
      <section className="py-14 px-4 sm:px-8 max-w-7xl mx-auto border-t border-blue-950" id="seccion-blog">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: YouTube Channel Feature Card */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0c1830] via-[#091224] to-[#0c1830] border-2 border-red-500/40 shadow-2xl space-y-5">
            
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 text-red-400 text-xs font-mono font-bold uppercase tracking-wider border border-red-500/40">
                <Youtube size={15} className="text-red-500 fill-red-500" />
                <span>Canal Oficial de YouTube</span>
              </div>
              <span className="text-[10px] font-mono text-stone-400 uppercase">Streaming & Reviews</span>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white uppercase tracking-tight font-sans">
                ATOMIC Gaming en YouTube
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Subimos unboxings de cada lote de consolas, pruebas de framerate en juegos pesados (God of War Ragnarok, Warzone, FIFA), tutoriales de instalación de magia y gameplays en vivo.
              </p>
            </div>

            {/* Video Preview Mockup */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-red-500/30 group cursor-pointer shadow-lg">
              <Image
                src="/images/gaming/ps4-slim-1tb-god-of-war.jpg"
                alt="ATOMIC Gaming YouTube Showcase"
                fill
                className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.8)] group-hover:scale-110 transition-transform">
                  <Play size={24} className="fill-white translate-x-0.5" />
                </div>
              </div>
              <div className="absolute bottom-2 left-2 right-2 p-2 rounded-lg bg-black/80 backdrop-blur-md text-[10px] font-mono text-stone-200">
                🔴 EN VIVO: Testeando PlayStation 4 Slim 1TB con 2 Controles en 2026
              </div>
            </div>

            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider font-mono shadow-[0_0_25px_rgba(239,68,68,0.4)] transition-all cursor-pointer"
            >
              <Youtube size={16} className="fill-white" />
              <span>Suscribirse a ATOMIC Gaming en YouTube</span>
            </a>

          </div>

          {/* Right Column: Gaming Blog Posts */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="flex items-center justify-between border-b border-blue-950 pb-3">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-mono font-bold uppercase tracking-wider border border-blue-500/30 mb-1">
                  <BookOpen size={13} />
                  <span>Artículos & Guías</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight font-sans">
                  Blog Gamer ATOMIC
                </h3>
              </div>
            </div>

            <div className="space-y-4">
              {BLOG_POSTS.map((post) => (
                <article 
                  key={post.id}
                  className="p-5 rounded-3xl bg-[#081122] border border-blue-950 hover:border-blue-500/40 transition-all space-y-2 group cursor-pointer shadow-md"
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-blue-400">
                    <span className="font-bold bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800">
                      {post.tag}
                    </span>
                    <span className="text-stone-500 flex items-center gap-1">
                      <Clock size={11} /> {post.readTime} • {post.date}
                    </span>
                  </div>

                  <h4 className="text-base font-black text-white uppercase group-hover:text-blue-300 transition-colors leading-snug">
                    {post.title}
                  </h4>

                  <p className="text-xs text-stone-300 leading-relaxed">
                    {post.excerpt}
                  </p>

                  <div className="pt-1 flex items-center gap-1 text-xs font-mono font-bold text-blue-400 group-hover:translate-x-1 transition-transform">
                    <span>Leer artículo completo</span>
                    <ArrowRight size={13} />
                  </div>
                </article>
              ))}
            </div>

          </div>

        </div>

      </section>

      {/* ── FOOTER ── */}
      <footer className="mt-12 border-t border-blue-950 bg-[#03060d] py-8 px-4 text-center text-xs text-stone-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} ATOMIC • Ecosistema Gaming & Consolas Certificadas.</p>
          <div className="flex items-center gap-4">
            <Link href="/web" className="hover:text-blue-300 transition-colors">Tienda Oficial</Link>
            <span>•</span>
            <Link href="/web/1hora" className="hover:text-blue-300 transition-colors">1Hora Powerbanks</Link>
            <span>•</span>
            <Link href="/web/paneles-ranurados" className="hover:text-blue-300 transition-colors">Paneles WPC</Link>
            <span>•</span>
            <Link href="/web/cart" className="hover:text-blue-300 transition-colors">Carrito</Link>
          </div>
        </div>
      </footer>

      {/* ── STICKY MOBILE CONVERSION BAR ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#060b17]/95 backdrop-blur-xl border-t border-blue-950 p-2.5 flex items-center justify-between gap-2 sm:hidden shadow-2xl">
        <div className="flex-1 min-w-0 pl-1 font-mono">
          <span className="text-[10px] text-blue-400 font-black uppercase block leading-none truncate">
            PS4 Slim 1TB God of War
          </span>
          <span className="text-[11px] text-white font-bold">
            ${activeConfig.price.toFixed(0)} • 2 Años Garantía
          </span>
        </div>

        <a
          href={`https://wa.me/${officialPhone}?text=${encodeURIComponent(activeConfig.whatsappText)}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-xs uppercase tracking-wider shadow-lg shrink-0 font-mono"
        >
          <Phone size={14} className="stroke-[2.5]" />
          <span>Comprar Ya</span>
        </a>
      </div>

    </div>
  )
}
