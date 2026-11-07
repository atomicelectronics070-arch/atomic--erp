"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { 
  Sparkles, Video, Share2, Palette, CheckCircle2, ArrowRight, 
  Phone, ShoppingCart, ExternalLink, Calendar, Zap, Star, 
  Layers, Check, Film, Music, ShieldCheck, Play, Award, 
  Clock, Flame, HelpCircle, ChevronRight, Sliders, Ticket
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

interface MonthlyTicket {
  id: string
  dbId: string
  name: string
  badge: string
  badgeColor: string
  price: number
  regularPrice: number
  period: string
  description: string
  features: string[]
  includesSession: boolean
  highlight?: boolean
  whatsappMsg: string
}

interface MegaPackItem {
  name: string
  icon: string
  desc: string
}

export default function CreacionContenidoClient({ dbProducts }: { dbProducts: DbProduct[] }) {
  const { addToCart } = useCart()
  const [addedItem, setAddedItem] = useState<string | null>(null)
  const salesPhone = "593969043453"

  // Find DB product IDs or fallback
  const getDbId = (sku: string, fallbackId: string) => {
    const found = dbProducts?.find(p => p.sku === sku)
    return found ? found.id : fallbackId
  }

  // 1. Tickets Mensuales Armados
  const MONTHLY_TICKETS: MonthlyTicket[] = [
    {
      id: "ticket-basico",
      dbId: getDbId("STUDIO-PLAN-BASICO", "cmw6rbekm0002y3495avgsdrl"),
      name: "TICKET BÁSICO",
      badge: "INICIO & MARCA PERSONAL",
      badgeColor: "from-rose-500 to-orange-500",
      price: 100.0,
      regularPrice: 150.0,
      period: "mensual",
      description: "Ideal para emprendedores y negocios locales que necesitan presencia constante y profesional.",
      features: [
        "10 Diseños profesionales para Facebook",
        "5 Diseños optimizados para Instagram",
        "4 Historias interactivas (Reels/Stories)",
        "Plan de contenido con objetivos definidos",
        "Copywriting persuasivo y hashtags estratégicos",
        "Entrega programada para publicación quincenal"
      ],
      includesSession: false,
      whatsappMsg: "Hola ATOMIC Studio, deseo contratar el TICKET BÁSICO de Redes Sociales por $100/mes. ¿Cómo iniciamos?"
    },
    {
      id: "ticket-estandar",
      dbId: getDbId("STUDIO-PLAN-ESTANDAR", "cmw6rbfcy0004y349hzqa8hm1"),
      name: "TICKET ESTÁNDAR",
      badge: "EL MÁS POPULAR ★",
      badgeColor: "from-purple-600 via-indigo-600 to-cyan-500",
      price: 300.0,
      regularPrice: 420.0,
      period: "mensual",
      description: "Diseñado para marcas en crecimiento que buscan captar clientes y posicionarse con autoridad.",
      features: [
        "12 Diseños profesionales para Facebook",
        "10 Diseños optimizados para Instagram",
        "6 Historias interactivas y dinámicas",
        "Sesión de fotografía y video profesional presencial",
        "Plan mensual de contenido con KPIs específicos",
        "Guión de contenido para publicaciones de engagement",
        "Optimización de biografía y portadas destacadas"
      ],
      includesSession: true,
      highlight: true,
      whatsappMsg: "Hola ATOMIC Studio, me interesa contratar el TICKET ESTÁNDAR de Redes Sociales por $300/mes con sesión audiovisual. ¿Tienen disponibilidad este mes?"
    },
    {
      id: "ticket-premium",
      dbId: getDbId("STUDIO-PLAN-PREMIUM", "cmw6rbg4m0006y349pzbs7340"),
      name: "TICKET INDISPENSABLE",
      badge: "MÁXIMO RENDIMIENTO",
      badgeColor: "from-cyan-500 to-blue-600",
      price: 600.0,
      regularPrice: 850.0,
      period: "mensual",
      description: "Ecosistema integral de alta producción audiovisual con videos comerciales y estrategia de conversión.",
      features: [
        "15 Diseños profesionales para Facebook",
        "12 Diseños optimizados para Instagram",
        "6 Historias interactivas",
        "2 Videos comerciales / Reels virales de alta producción",
        "Sesión completa de fotografía de producto y modelos",
        "Plan estratégico mensual de conversión y ventas",
        "Asesoría técnica y configuración de pauta Meta Ads",
        "Reporte mensual de rendimiento y crecimiento"
      ],
      includesSession: true,
      whatsappMsg: "Hola ATOMIC Studio, deseo contratar el TICKET INDISPENSABLE / PREMIUM por $600/mes para producción comercial y pauta. Deseo coordinar reunión."
    }
  ]

  // 2. Mega Pack Creador de Contenido
  const megaPackDbId = getDbId("STUDIO-MEGA-PACK", "cmw6rbgxd0008y349q08fdcr4")

  const MEGA_PACK_ITEMS: MegaPackItem[] = [
    { name: "Intros 3D Cinematográficas", icon: "🎬", desc: "Animaciones listas para personalizar con tu logo" },
    { name: "Efectos de Sonido FX", icon: "🔊", desc: "Whooshes, risers, pops, clicks, cinematics y hits" },
    { name: "Pack de Memes & Trends", icon: "😂", desc: "Clips virales en Full HD y 4K sin marca de agua" },
    { name: "Miniaturas Virales YouTube", icon: "🖼️", desc: "Plantillas en PSD y Figma de alta retención" },
    { name: "Emojis 3D Animados", icon: "😍", desc: "Stickers volumétricos para historias y videos" },
    { name: "Transiciones 4K", icon: "⚡", desc: "Glitches, zooms, pan, wipes y efectos de cámara" },
    { name: "Fuentes Tipográficas Prémium", icon: "🔤", desc: "Tipografías modernas para títulos de alto impacto" },
    { name: "Elementos Gráficos Vectoriales", icon: "✨", desc: "Iconos, badges, flechas dinámicas y badges" },
    { name: "Tarjetas de Presentación Digital", icon: "📱", desc: "Templates interactivos NFC y redes sociales" },
    { name: "Pack de Mockups Profesionales", icon: "💻", desc: "Smartphones, laptops, empaques y pantallas" },
    { name: "Overlays para Streaming", icon: "🎮", desc: "Marcos y alertas para Twitch, YouTube y TikTok Live" },
    { name: "Pantallas Verdes (Chroma Key VFX)", icon: "🟩", desc: "Explosiones, humo, dinero, fuego y efectos especiales" }
  ]

  // 3. Estado del Constructor Interactivo de Tickets a Medida
  const [customPosts, setCustomPosts] = useState<number>(15)
  const [customVideos, setCustomVideos] = useState<number>(2)
  const [customPhotoSession, setCustomPhotoSession] = useState<boolean>(true)
  const [customAdsManagement, setCustomAdsManagement] = useState<boolean>(false)

  // Cálculo en vivo del ticket a medida
  const calculatedCustomPrice = (
    customPosts * 7.5 +
    customVideos * 45 +
    (customPhotoSession ? 95 : 0) +
    (customAdsManagement ? 80 : 0)
  )

  const handleAddToCartTicket = (id: string, name: string, price: number, image: string) => {
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

  const customTicketWhatsappMsg = `Hola ATOMIC Studio, he armado un Ticket Personalizado en la web:
- Piezas de diseño: ${customPosts}
- Videos/Reels: ${customVideos}
- Sesión de foto/video: ${customPhotoSession ? "SÍ incluida" : "No"}
- Gestión de pauta publicitaria: ${customAdsManagement ? "SÍ incluida" : "No"}
- Total estimado: $${calculatedCustomPrice.toFixed(2)}/mes.
¿Podemos coordinar para formalizar la contratación?`

  return (
    <div className="min-h-screen bg-[#0a0316] text-slate-100 font-sans selection:bg-pink-500 selection:text-white relative overflow-x-hidden">
      
      {/* ── BACKGROUND ATOMIC NEON AMBIENCE ── */}
      <div className="fixed inset-0 bg-[radial-gradient(#2d1558_1px,transparent_1px)] [background-size:32px_32px] opacity-35 pointer-events-none" />
      <div className="fixed -top-40 -left-40 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[180px] pointer-events-none" />
      <div className="fixed top-1/4 -right-40 w-[650px] h-[650px] bg-pink-600/15 rounded-full blur-[200px] pointer-events-none" />
      <div className="fixed bottom-10 left-1/3 w-[700px] h-[700px] bg-cyan-600/15 rounded-full blur-[220px] pointer-events-none" />

      {/* ── TOP NOTIFICATION TICKER ── */}
      <div className="relative z-50 bg-gradient-to-r from-purple-700 via-pink-600 to-indigo-700 text-white px-4 py-2 text-center text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg">
        <Sparkles size={15} className="animate-spin text-yellow-300" />
        <span>⚡ ATOMIC STUDIO • INNOVACIÓN, CALIDAD Y RENDIMIENTO • PAQUETES MENSUALES DE CONTENIDO & TICKETS ARMADOS</span>
      </div>

      {/* ── STUDIO HEADER ── */}
      <header className="sticky top-0 z-40 bg-[#0d041e]/90 backdrop-blur-2xl border-b border-purple-500/20 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          <Link href="/web" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-600 via-pink-500 to-cyan-400 p-[1px] shadow-[0_0_25px_rgba(168,85,247,0.5)] group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0d041e] rounded-2xl flex items-center justify-center font-black text-white text-lg">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-300">⚛</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-lg font-black tracking-tight text-white uppercase font-sans">ATOMIC</span>
                <span className="text-xs font-black px-2 py-0.5 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 text-white uppercase tracking-wider">
                  STUDIO
                </span>
              </div>
              <p className="text-[10px] text-purple-300 font-bold tracking-widest uppercase mt-0.5 font-mono">
                Creación de Contenido & Redes
              </p>
            </div>
          </Link>

          {/* Direct Actions */}
          <div className="flex items-center gap-3">
            <a
              href={`https://wa.me/${salesPhone}?text=Hola%20ATOMIC%20Studio,%20deseo%20asesoria%20para%20creacion%20de%20contenido%20y%20redes%20sociales.`}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(244,63,94,0.4)] hover:scale-105"
            >
              <Phone size={14} className="stroke-[2.5]" />
              <span>Hablar con Asesor Creativo</span>
            </a>

            <Link
              href="/web/cart"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 border border-purple-500/30 text-purple-200 text-xs font-bold transition-all"
            >
              <ShoppingCart size={16} />
              <span className="hidden md:inline">Ver Carrito</span>
            </Link>
          </div>

        </div>
      </header>

      {/* ── HERO BANNER SECTION (INSPIRADO EN LAS IMÁGENES DEL USUARIO) ── */}
      <section className="relative pt-12 pb-16 px-4 sm:px-8 border-b border-purple-500/20 bg-gradient-to-b from-[#14062a] via-[#0d041e] to-[#0a0316]">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-purple-950/90 border border-pink-500/40 text-pink-300 text-xs font-mono font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(244,63,94,0.25)]">
            <Sparkles size={15} className="text-yellow-400" />
            <span>Innovación • Calidad • Rendimiento</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase leading-[1.08] font-sans">
            La Esencia de tu Marca,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-400">
              Convertida en Contenido que Conecta e Impacta.
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-purple-200 text-sm sm:text-base leading-relaxed font-normal">
            Descubre nuestros <strong>tickets armados</strong> para gestión de Redes Sociales, producción de video comercial de alto impacto y el <strong>Mega Pack de Recursos</strong> para creadores digitales.
          </p>

          {/* Quick Pillars Bento */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto pt-4 text-left">
            <div className="p-4 rounded-3xl bg-purple-950/40 border border-purple-500/30 backdrop-blur-xl flex items-center gap-3.5 hover:border-pink-500/50 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 text-white flex items-center justify-center shrink-0 shadow-lg">
                <Share2 size={22} />
              </div>
              <div>
                <p className="text-white text-sm font-black uppercase">Redes Sociales</p>
                <p className="text-purple-300 text-xs mt-0.5">Estrategia, grilla y diseños mensuales</p>
              </div>
            </div>

            <div className="p-4 rounded-3xl bg-purple-950/40 border border-purple-500/30 backdrop-blur-xl flex items-center gap-3.5 hover:border-cyan-500/50 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-lg">
                <Video size={22} />
              </div>
              <div>
                <p className="text-white text-sm font-black uppercase">Creación de Contenido</p>
                <p className="text-purple-300 text-xs mt-0.5">Reels, fotografía de producto y modelos</p>
              </div>
            </div>

            <div className="p-4 rounded-3xl bg-purple-950/40 border border-purple-500/30 backdrop-blur-xl flex items-center gap-3.5 hover:border-yellow-500/50 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center shrink-0 shadow-lg">
                <Film size={22} />
              </div>
              <div>
                <p className="text-white text-sm font-black uppercase">Edición Profesional</p>
                <p className="text-purple-300 text-xs mt-0.5">Subtítulos dinámicos, VFX y retención</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════════
          APARTADO 1: TICKETS ARMADOS MENSUALES DE REDES SOCIALES (CLICQUEABLES)
      ══════════════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <Ticket size={14} />
            <span>Tickets Pre-Armados Listos para Contratar</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight font-sans">
            Paquetes Especiales para Redes Sociales
          </h2>
          <p className="text-purple-300 text-xs sm:text-sm mt-1">
            ¡Adquiere el mejor plan mensual para tu negocio! Todos los planes incluyen sesión audiovisual profesional y objetivos de venta específicos.
          </p>
        </div>

        {/* Tickets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {MONTHLY_TICKETS.map((ticket) => {
            const isAdded = addedItem === ticket.dbId

            return (
              <div
                key={ticket.id}
                className={`relative rounded-3xl flex flex-col justify-between overflow-hidden transition-all duration-300 ${
                  ticket.highlight
                    ? "bg-gradient-to-b from-[#210940] via-[#15062a] to-[#0e041e] border-2 border-purple-500 shadow-[0_0_50px_rgba(168,85,247,0.35)] scale-105 z-20"
                    : "bg-[#120524] border border-purple-500/30 hover:border-purple-400/60 shadow-xl"
                }`}
              >
                {/* Ribbon Tag */}
                <div className={`px-4 py-2 bg-gradient-to-r ${ticket.badgeColor} text-white font-black text-xs uppercase tracking-wider text-center shadow-md flex items-center justify-center gap-1.5`}>
                  <Flame size={14} />
                  <span>{ticket.badge}</span>
                </div>

                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                  
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-widest">
                        TICKET ARMADO MENSUAL
                      </span>
                      {ticket.includesSession && (
                        <span className="text-[10px] font-black text-cyan-300 px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40">
                          📸 FOTO & VIDEO
                        </span>
                      )}
                    </div>

                    <h3 className="text-2xl font-black text-white uppercase tracking-tight mt-1">
                      {ticket.name}
                    </h3>

                    <p className="text-purple-300 text-xs mt-2 leading-relaxed">
                      {ticket.description}
                    </p>

                    {/* Price Block */}
                    <div className="mt-5 p-4 rounded-2xl bg-black/40 border border-purple-500/20 text-center">
                      <span className="text-[10px] text-purple-400 uppercase font-mono block">
                        Inversión del Plan
                      </span>
                      <div className="flex items-baseline justify-center gap-2 mt-0.5">
                        <span className="text-xs text-purple-400 uppercase font-bold">Desde</span>
                        <span className="text-4xl font-black text-white font-mono tracking-tight">
                          ${ticket.price.toFixed(0)}
                        </span>
                        <span className="text-xs text-purple-400 font-mono">/mes</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-bold font-mono block mt-1">
                        Ahorro del 30% en contratación mensual
                      </span>
                    </div>

                    {/* Features Checklist */}
                    <div className="mt-6 space-y-2.5">
                      <p className="text-[11px] font-black uppercase tracking-wider text-purple-300 font-mono">
                        ¿Qué incluye tu ticket?
                      </p>
                      <ul className="space-y-2">
                        {ticket.features.map((feat, i) => (
                          <li key={i} className="text-xs text-slate-200 flex items-start gap-2.5 leading-snug">
                            <CheckCircle2 size={15} className="text-pink-400 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Actions for this Ticket */}
                  <div className="pt-6 border-t border-purple-500/20 space-y-2.5">
                    
                    {/* Primary Buy / Contract Button */}
                    <Link
                      href={`/web/product/${ticket.dbId}`}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-400 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(244,63,94,0.35)] active:scale-95 text-center"
                    >
                      <span>Contratar Ticket {ticket.name.replace("TICKET ", "")}</span>
                      <ArrowRight size={14} className="stroke-[3]" />
                    </Link>

                    {/* WhatsApp Fast Order */}
                    <a
                      href={`https://wa.me/${salesPhone}?text=${encodeURIComponent(ticket.whatsappMsg)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 font-black text-xs uppercase tracking-wider transition-all text-center"
                    >
                      <Phone size={14} />
                      <span>Agendar por WhatsApp</span>
                    </a>

                    {/* Add to Cart */}
                    <button
                      type="button"
                      onClick={() => handleAddToCartTicket(ticket.dbId, ticket.name, ticket.price, "/images/atomic-studio/planes-mensuales-redes-sociales.jpg")}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        isAdded
                          ? "bg-yellow-400 text-black shadow-lg"
                          : "bg-purple-950/40 hover:bg-purple-900/40 text-purple-300 border border-purple-500/20"
                      }`}
                    >
                      <ShoppingCart size={13} />
                      <span>{isAdded ? "¡Ticket Añadido al Carrito!" : "Añadir Ticket al Carrito"}</span>
                    </button>

                  </div>

                </div>
              </div>
            )
          })}
        </div>

      </section>

      {/* ══════════════════════════════════════════════════════════════════════════════
          APARTADO 2: MEGA PACK CREADOR DE CONTENIDO (KIT RECURSOS DIGITALES)
      ══════════════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 px-4 sm:px-8 border-t border-b border-purple-500/20 bg-gradient-to-b from-[#110526] to-[#0d041e]">
        <div className="max-w-6xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Visual Box Component (Banner Image 2) */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border-2 border-purple-500/40 shadow-[0_0_40px_rgba(168,85,247,0.3)] group">
                <Image
                  src="/images/atomic-studio/mega-pack-creador-contenido.jpg"
                  alt="ATOMIC Mega Pack Creador de Contenido"
                  width={600}
                  height={600}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Instant Buy Badge */}
                <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-black/80 backdrop-blur-md border border-white/20 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-purple-300 uppercase font-mono block">Descarga Digital Inmediata</span>
                    <span className="text-lg font-black text-white font-mono">$49.99</span>
                    <span className="text-xs text-slate-400 line-through font-mono ml-2">$120.00</span>
                  </div>
                  <Link
                    href={`/web/product/${megaPackDbId}`}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-xs uppercase tracking-wider shadow-md"
                  >
                    Obtener Kit
                  </Link>
                </div>
              </div>
            </div>

            {/* Checklist & Content Details */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-500/20 border border-pink-500/30 text-pink-300 text-xs font-mono font-bold uppercase">
                <Sparkles size={14} className="text-yellow-400" />
                <span>Kit Todo en Uno para Creadores & Agencias</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight leading-tight">
                MEGA PACK CREADOR DE CONTENIDO
              </h2>

              <p className="text-purple-200 text-sm leading-relaxed">
                Todo el arsenal de edición, recursos y elementos visuales que utilizan los mayores creadores de YouTube, TikTok e Instagram. Eleva la calidad de tus producciones de 0 a 100 de inmediato.
              </p>

              {/* 12 Resources Checklist Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {MEGA_PACK_ITEMS.map((item, i) => (
                  <div key={i} className="p-3 rounded-2xl bg-purple-950/40 border border-purple-500/20 flex items-start gap-3">
                    <span className="text-xl shrink-0">{item.icon}</span>
                    <div className="min-w-0">
                      <p className="text-white text-xs font-black uppercase leading-tight truncate">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-purple-300 leading-tight mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA Buttons Row */}
              <div className="pt-4 flex flex-wrap items-center gap-3">
                <Link
                  href={`/web/product/${megaPackDbId}`}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-400 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(244,63,94,0.4)] flex items-center gap-2 active:scale-95"
                >
                  <Sparkles size={15} />
                  <span>Comprar Mega Pack Ahora ($49.99)</span>
                </Link>

                <a
                  href={`https://wa.me/${salesPhone}?text=Hola%20ATOMIC,%20deseo%20comprar%20el%20MEGA%20PACK%20Creador%20de%20Contenido%20por%20$49.99.%20¿Cómo%20es%20el%20acceso%20y%20descarga?`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-3.5 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2"
                >
                  <Phone size={15} />
                  <span>Pedir por WhatsApp</span>
                </a>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════════
          APARTADO 3: CONSTRUCTOR INTERACTIVO DE TICKETS A MEDIDA (ECOSISTEMA)
      ══════════════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 px-4 sm:px-8 max-w-5xl mx-auto">
        
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#180838] via-[#100424] to-[#0b0318] border-2 border-purple-500/40 shadow-2xl space-y-8 relative overflow-hidden">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold uppercase tracking-wider">
              ⚙️ Calculador & Armador de Tickets Personalizados
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              Arma tu Propio Ticket a Medida
            </h3>
            <p className="text-purple-300 text-xs sm:text-sm">
              Selecciona el volumen de contenido y servicios exactos que necesita tu empresa. Nuestro algoritmo calcula tu ticket en vivo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-2">
            
            {/* Interactive Sliders & Toggles */}
            <div className="space-y-6">
              
              {/* Slider 1: Posts */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono font-bold">
                  <span className="text-slate-300">Piezas de Diseño (Posts/Stories):</span>
                  <span className="text-pink-400 font-black text-sm">{customPosts} piezas</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="40"
                  step="5"
                  value={customPosts}
                  onChange={(e) => setCustomPosts(Number(e.target.value))}
                  className="w-full accent-pink-500 cursor-pointer h-2 bg-purple-950 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-purple-400 font-mono">
                  <span>5 mín</span>
                  <span>20 estándar</span>
                  <span>40 pro</span>
                </div>
              </div>

              {/* Slider 2: Videos */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono font-bold">
                  <span className="text-slate-300">Videos Comerciales / Reels Editados:</span>
                  <span className="text-cyan-400 font-black text-sm">{customVideos} videos</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={customVideos}
                  onChange={(e) => setCustomVideos(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer h-2 bg-purple-950 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-purple-400 font-mono">
                  <span>0</span>
                  <span>2 recomendados</span>
                  <span>10 full</span>
                </div>
              </div>

              {/* Toggle 1: Sesión Foto/Video */}
              <label className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/20 flex items-center justify-between cursor-pointer hover:border-purple-400/50 transition-colors">
                <div>
                  <span className="text-white text-xs font-bold block">📸 Sesión de Foto & Video Presencial</span>
                  <span className="text-[11px] text-purple-300">Producción en locación o tu oficina (+ $95)</span>
                </div>
                <input
                  type="checkbox"
                  checked={customPhotoSession}
                  onChange={(e) => setCustomPhotoSession(e.target.checked)}
                  className="w-5 h-5 accent-pink-500 rounded"
                />
              </label>

              {/* Toggle 2: Gestión de Pauta Meta Ads */}
              <label className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/20 flex items-center justify-between cursor-pointer hover:border-purple-400/50 transition-colors">
                <div>
                  <span className="text-white text-xs font-bold block">🎯 Estrategia & Gestión Meta Ads</span>
                  <span className="text-[11px] text-purple-300">Configuración de campañas y pixel de conversión (+ $80)</span>
                </div>
                <input
                  type="checkbox"
                  checked={customAdsManagement}
                  onChange={(e) => setCustomAdsManagement(e.target.checked)}
                  className="w-5 h-5 accent-cyan-400 rounded"
                />
              </label>

            </div>

            {/* Generated Live Ticket Preview */}
            <div className="p-6 rounded-3xl bg-[#090214] border-2 border-dashed border-pink-500/50 relative shadow-2xl flex flex-col justify-between space-y-5">
              
              <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
                <span className="text-[10px] font-mono text-purple-400 font-black uppercase tracking-widest">
                  TICKET ARMADO EN TIEMPO REAL
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">
                  ● LISTO PARA EMISIÓN
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between text-slate-300">
                  <span>Piezas de diseño ({customPosts}):</span>
                  <span className="text-white font-bold">${(customPosts * 7.5).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Reels / Videos ({customVideos}):</span>
                  <span className="text-white font-bold">${(customVideos * 45).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Sesión presencial:</span>
                  <span className="text-white font-bold">{customPhotoSession ? "$95.00" : "$0.00"}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Gestión Meta Ads:</span>
                  <span className="text-white font-bold">{customAdsManagement ? "$80.00" : "$0.00"}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-purple-500/20 text-center">
                <span className="text-[10px] text-purple-400 uppercase font-mono block">
                  Valor Estimado del Ticket Mensual
                </span>
                <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-300 font-mono">
                  ${calculatedCustomPrice.toFixed(2)}
                  <span className="text-xs text-purple-400 font-normal"> /mes</span>
                </div>
              </div>

              {/* Action */}
              <a
                href={`https://wa.me/${salesPhone}?text=${encodeURIComponent(customTicketWhatsappMsg)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-black text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-all text-center"
              >
                <Ticket size={16} />
                <span>Emitir Mi Ticket & Coordinar en WhatsApp</span>
              </a>

            </div>

          </div>

        </div>

      </section>

      {/* ══════════════════════════════════════════════════════════════════════════════
          APARTADO 4: AGENDA TU CITA & FAQ ESTRATÉGICO
      ══════════════════════════════════════════════════════════════════════════════ */}
      <section className="py-12 px-4 sm:px-8 max-w-5xl mx-auto border-t border-purple-500/20">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="p-6 rounded-3xl bg-purple-950/30 border border-purple-500/20 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold">
              🗓️
            </div>
            <h4 className="text-lg font-black text-white uppercase tracking-tight">
              ¿Cómo agendamos la sesión audiovisual?
            </h4>
            <p className="text-purple-300 text-xs leading-relaxed">
              Una vez contratado tu ticket, coordinamos con el equipo de fotógrafos y productores la fecha y hora para la sesión en tu negocio o en nuestro estudio en Quito. Te entregamos un guión previo con las tomas a realizar.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-purple-950/30 border border-purple-500/20 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
              🎯
            </div>
            <h4 className="text-lg font-black text-white uppercase tracking-tight">
              ¿Puedo solicitar cambios o revisiones?
            </h4>
            <p className="text-purple-300 text-xs leading-relaxed">
              Sí. Presentamos la grilla y bocetos de contenido para tu aprobación antes de cada publicación. Incluimos rondas de ajuste para garantizar que el tono, tipografía y estilo reflejen la identidad de tu marca al 100%.
            </p>
          </div>

        </div>

        {/* Big Agenda Call To Action */}
        <div className="mt-10 p-8 rounded-3xl bg-gradient-to-r from-purple-950 via-[#1a0736] to-[#0d041e] border-2 border-pink-500/40 text-center space-y-4 shadow-2xl">
          <span className="px-3.5 py-1 rounded-full bg-pink-500 text-white text-[10px] font-black uppercase tracking-widest">
            Sesión Estratégica
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            ¿Quieres ver ejemplos de cuentas que gestionamos o agendar cita?
          </h3>
          <p className="text-purple-200 text-xs sm:text-sm max-w-xl mx-auto">
            Te mostramos casos de éxito reales, métricas de engagement y te asesoramos sobre el mejor plan según tu tipo de industria.
          </p>
          <div className="pt-2">
            <a
              href={`https://wa.me/${salesPhone}?text=Hola%20ATOMIC%20Studio,%20deseo%20agendar%20una%20reunion%20estrategica%20para%20creacion%20de%20contenido.`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white font-black text-sm uppercase tracking-wider hover:brightness-110 transition-all shadow-[0_0_30px_rgba(244,63,94,0.4)] active:scale-95"
            >
              <Calendar size={18} />
              <span>¡Agenda tu Cita Creativa por WhatsApp!</span>
            </a>
          </div>
        </div>

      </section>

      {/* ── FOOTER ── */}
      <footer className="mt-12 border-t border-purple-500/20 bg-[#070210] py-8 px-4 text-center text-xs text-purple-400 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} ATOMIC STUDIO • División de Creación de Contenido, Redes y Multimedia.</p>
          <div className="flex items-center gap-4">
            <Link href="/web" className="hover:text-white transition-colors">Tienda Oficial</Link>
            <span>•</span>
            <Link href="/web/carros-industriales" className="hover:text-white transition-colors">Carros Industriales</Link>
            <span>•</span>
            <Link href="/web/cart" className="hover:text-white transition-colors">Carrito</Link>
          </div>
        </div>
      </footer>

      {/* ── STICKY MOBILE CONVERSION BAR ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0d041e]/95 backdrop-blur-xl border-t border-purple-500/30 p-2.5 flex items-center justify-between gap-2 sm:hidden shadow-2xl">
        <div className="flex-1 min-w-0 pl-1">
          <span className="text-[10px] text-pink-400 font-black uppercase block leading-none truncate">
            ATOMIC STUDIO
          </span>
          <span className="text-[11px] text-white font-mono font-bold">
            Tickets desde $100/mes
          </span>
        </div>

        <a
          href={`https://wa.me/${salesPhone}?text=Hola%20ATOMIC%20Studio,%20deseo%20contratar%20un%20plan%20de%20contenido.`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-xs uppercase tracking-wider shadow-lg shrink-0"
        >
          <Phone size={14} className="stroke-[2.5]" />
          <span>Contratar Ticket</span>
        </a>
      </div>

    </div>
  )
}
