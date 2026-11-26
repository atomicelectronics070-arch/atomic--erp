"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Sparkles,
  Video,
  Share2,
  Palette,
  CheckCircle2,
  ArrowRight,
  Phone,
  ShoppingCart,
  Calendar,
  Zap,
  Layers,
  Film,
  Flame,
  Ticket,
  Volume2,
  Mic,
  Camera,
  TrendingUp,
  PenTool,
  ShieldCheck,
  Target
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
    const found = dbProducts?.find((p) => p.sku === sku)
    return found ? found.id : fallbackId
  }

  // 1. Tickets Mensuales Armados
  const MONTHLY_TICKETS: MonthlyTicket[] = [
    {
      id: "ticket-basico",
      dbId: getDbId("STUDIO-PLAN-BASICO", "cmw6rbekm0002y3495avgsdrl"),
      name: "TICKET BÁSICO",
      badge: "INICIO, MARCA & REDES",
      badgeColor: "from-rose-500 to-orange-500",
      price: 100.0,
      regularPrice: 150.0,
      period: "mensual",
      description:
        "Ideal para emprendedores y negocios locales que buscan presencia constante, orden visual y ajustes iniciales en su logotipo.",
      features: [
        "10 Diseños estratégicos para Facebook",
        "5 Diseños optimizados para Instagram",
        "4 Historias / Reels cortos con audio en tendencia",
        "Revisión y adaptación digital de tu logotipo (avatares y marcas de agua)",
        "Planeación editorial mensual con objetivos de marca",
        "Copywriting persuasivo y entregas quincenales listas para publicar"
      ],
      includesSession: false,
      whatsappMsg:
        "Hola ATOMIC Studio, deseo contratar el TICKET BÁSICO de Redes Sociales por $100/mes. Me interesa la planeación mensual y adaptación de marca."
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
      description:
        "Diseñado para empresas que desean remodelar su logotipo, producir contenido estratégico en video y audio y refinar su catálogo.",
      features: [
        "12 Diseños profesionales para Facebook",
        "10 Diseños optimizados para Instagram",
        "6 Historias interactivas y Reels con edición en video y diseño de audio",
        "Te ayudamos a remodelar y modernizar tu logotipo para formatos digitales",
        "Refinación visual de productos clave para tu catálogo comercial",
        "Sesión presencial de fotografía y grabación de video",
        "Planeación estratégica mensual, guiones y métricas KPIs",
        "Consistencia visual de marca aplicada a portadas y biografía"
      ],
      includesSession: true,
      highlight: true,
      whatsappMsg:
        "Hola ATOMIC Studio, me interesa contratar el TICKET ESTÁNDAR ($300/mes) con planeación en video y audio, remodelación de logotipo y sesión audiovisual."
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
      description:
        "Ecosistema integral de dirección creativa continua: video y audio de alta producción, identidad de marca sólida y catálogos impecables.",
      features: [
        "15 Diseños profesionales para Facebook + 12 para Instagram",
        "6 Historias dinámicas con llamados a la acción de venta",
        "2 Videos comerciales de alta producción con guion, locución y mezcla de audio FX",
        "Remodelación o creación de logotipo + guía de consistencia de marca",
        "Refinación fotográfica integral de productos para catálogo y tienda web",
        "Sesión completa de foto y video comercial en estudio o locación",
        "Estrategia mensual de conversión y pauta publicitaria Meta Ads",
        "Reporte mensual de retención, alcance y evolución de marca"
      ],
      includesSession: true,
      whatsappMsg:
        "Hola ATOMIC Studio, deseo contratar el TICKET INDISPENSABLE ($600/mes) para estrategia integral en video/audio, branding y catálogo."
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
    { name: "Elementos Gráficos Vectoriales", icon: "✨", desc: "Iconos, badges, flechas dinámicas y adornos" },
    { name: "Tarjetas de Presentación Digital", icon: "📱", desc: "Templates interactivos NFC y redes sociales" },
    { name: "Pack de Mockups Profesionales", icon: "💻", desc: "Smartphones, laptops, empaques y pantallas" },
    { name: "Overlays para Streaming", icon: "🎮", desc: "Marcos y alertas para Twitch, YouTube y TikTok Live" },
    { name: "Pantallas Verdes (Chroma Key VFX)", icon: "🟩", desc: "Explosiones, humo, dinero, fuego y efectos especiales" }
  ]

  // 3. Estado del Constructor Interactivo de Tickets a Medida
  const [customPosts, setCustomPosts] = useState<number>(15)
  const [customVideos, setCustomVideos] = useState<number>(2)
  const [customPhotoSession, setCustomPhotoSession] = useState<boolean>(true)
  const [customAudioDesign, setCustomAudioDesign] = useState<boolean>(true)
  const [customLogoRemodel, setCustomLogoRemodel] = useState<boolean>(false)
  const [customCatalogRefine, setCustomCatalogRefine] = useState<boolean>(false)
  const [customAdsManagement, setCustomAdsManagement] = useState<boolean>(false)

  // Cálculo en vivo del ticket a medida
  const calculatedCustomPrice =
    customPosts * 7.5 +
    customVideos * 45 +
    (customPhotoSession ? 95 : 0) +
    (customAudioDesign ? 45 : 0) +
    (customLogoRemodel ? 65 : 0) +
    (customCatalogRefine ? 55 : 0) +
    (customAdsManagement ? 80 : 0)

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

  const customTicketWhatsappMsg = `Hola ATOMIC Studio, armé un Plan Personalizado en su landing page:
- Piezas de diseño (Posts/Stories): ${customPosts}
- Videos/Reels editados: ${customVideos}
- Locución & Diseño Sonoro Pro (Audio + Video): ${customAudioDesign ? "SÍ incluido" : "No"}
- Remodelación de Logotipo & Guía de Marca: ${customLogoRemodel ? "SÍ incluido" : "No"}
- Refinación de Productos para Catálogo: ${customCatalogRefine ? "SÍ incluido" : "No"}
- Sesión de foto/video presencial: ${customPhotoSession ? "SÍ incluida" : "No"}
- Gestión de pauta Meta Ads: ${customAdsManagement ? "SÍ incluida" : "No"}
- Total estimado: $${calculatedCustomPrice.toFixed(2)}/mes.
¿Podemos coordinar la planeación inicial de mi marca?`

  return (
    <div className="min-h-screen bg-[#0a0316] text-slate-100 font-sans selection:bg-pink-500 selection:text-white relative overflow-x-hidden pb-16 sm:pb-0">
      {/* ── BACKGROUND ATOMIC STUDIO AMBIENCE ── */}
      <div className="fixed inset-0 bg-[radial-gradient(#2d1558_1px,transparent_1px)] [background-size:32px_32px] opacity-35 pointer-events-none" />
      <div className="fixed -top-40 -left-40 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[180px] pointer-events-none" />
      <div className="fixed top-1/4 -right-40 w-[650px] h-[650px] bg-pink-600/15 rounded-full blur-[200px] pointer-events-none" />
      <div className="fixed bottom-10 left-1/3 w-[700px] h-[700px] bg-cyan-600/15 rounded-full blur-[220px] pointer-events-none" />

      {/* ── TOP NOTIFICATION TICKER ── */}
      <div className="relative z-50 bg-gradient-to-r from-purple-700 via-pink-600 to-indigo-700 text-white px-4 py-2 text-center text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg">
        <Sparkles size={15} className="text-yellow-300 shrink-0" />
        <span>ATOMIC STUDIO • PLANEACIÓN ESTRATÉGICA EN VIDEO & AUDIO • REMODELACIÓN DE LOGOTIPOS • CATÁLOGOS Y MARCA</span>
      </div>

      {/* ── STUDIO HEADER ── */}
      <header className="sticky top-0 z-40 bg-[#0d041e]/92 backdrop-blur-2xl border-b border-purple-500/20 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Link href="/web" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-600 via-pink-500 to-cyan-400 p-[1px] shadow-[0_0_25px_rgba(168,85,247,0.45)] group-hover:scale-105 transition-transform">
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
                Video, Audio, Logotipos & Estrategia
              </p>
            </div>
          </Link>

          {/* Navigation Anchors */}
          <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold text-purple-200">
            <a href="#estrategia-video-audio" className="hover:text-white transition-colors">
              Video & Audio
            </a>
            <a href="#remodelacion-logo" className="hover:text-white transition-colors">
              Remodelación de Logo
            </a>
            <a href="#planes-mensuales" className="hover:text-white transition-colors">
              Planes Mensuales
            </a>
            <a href="#armar-ticket" className="hover:text-white transition-colors">
              Armar Plan
            </a>
          </nav>

          {/* Direct Actions */}
          <div className="flex items-center gap-2.5">
            <a
              href={`https://wa.me/${salesPhone}?text=${encodeURIComponent(
                "Hola ATOMIC Studio, deseo asesoría para planes de redes sociales (video y audio) y remodelación de mi logotipo."
              )}`}
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
              <span className="hidden md:inline">Carrito</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO BANNER ESTRATÉGICO ── */}
      <section className="relative pt-14 pb-18 px-4 sm:px-8 border-b border-purple-500/20 bg-gradient-to-b from-[#16072f] via-[#0d041e] to-[#0a0316]">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-purple-950/90 border border-pink-500/40 text-pink-300 text-xs font-mono font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(244,63,94,0.25)]">
            <Sparkles size={15} className="text-yellow-400" />
            <span>Planeación • Video & Audio • Remodelación de Logotipo</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase leading-[1.08] font-sans">
            Estrategia Mensual en Video & Audio,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-400">
              Logotipos Renovados y Marca Consistente.
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-purple-200 text-sm sm:text-base leading-relaxed font-normal">
            En <strong>ATOMIC Studio</strong> combinamos <strong>planeación estratégica mensual para redes sociales</strong>, producción audiovisual con{" "}
            <strong>video dinámico y diseño de audio profesional</strong>, <strong>remodelación o creación de logotipos</strong> y{" "}
            <strong>refinación de imágenes para catálogos</strong> para que tu marca proyecte autoridad y venda mes tras mes.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href="#planes-mensuales"
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:brightness-110 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-pink-500/30 flex items-center gap-2 transition-all"
            >
              <span>Ver Paquetes Mensuales</span>
              <ArrowRight size={15} />
            </a>
            <a
              href="#remodelacion-logo"
              className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-purple-400/35 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all"
            >
              <PenTool size={15} className="text-pink-400" />
              <span>Remodelar Mi Logotipo</span>
            </a>
          </div>

          {/* 4 Pilares Estratégicos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto pt-6 text-left">
            <div className="p-4 rounded-3xl bg-purple-950/40 border border-purple-500/30 backdrop-blur-xl flex items-start gap-3.5 hover:border-pink-500/50 transition-colors">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 text-white flex items-center justify-center shrink-0 shadow-lg">
                <Video size={20} />
              </div>
              <div>
                <p className="text-white text-xs sm:text-sm font-black uppercase">Video & Audio Pro</p>
                <p className="text-purple-300 text-[11px] mt-1 leading-relaxed">
                  Reels, guiones, locución comercial, FX y música estratégica para máxima retención.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-3xl bg-purple-950/40 border border-purple-500/30 backdrop-blur-xl flex items-start gap-3.5 hover:border-fuchsia-400/50 transition-colors">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-fuchsia-600 to-purple-700 text-white flex items-center justify-center shrink-0 shadow-lg">
                <Palette size={20} />
              </div>
              <div>
                <p className="text-white text-xs sm:text-sm font-black uppercase">Remodelación de Logo</p>
                <p className="text-purple-300 text-[11px] mt-1 leading-relaxed">
                  Actualizamos tu logotipo o lo creamos desde cero listo para digital, impresos y video.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-3xl bg-purple-950/40 border border-purple-500/30 backdrop-blur-xl flex items-start gap-3.5 hover:border-amber-400/50 transition-colors">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shrink-0 shadow-lg">
                <Camera size={20} />
              </div>
              <div>
                <p className="text-white text-xs sm:text-sm font-black uppercase">Catálogos Refinados</p>
                <p className="text-purple-300 text-[11px] mt-1 leading-relaxed">
                  Retoque de productos, limpieza de fondo y estética unificada para ecommerce y PDF.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-3xl bg-purple-950/40 border border-purple-500/30 backdrop-blur-xl flex items-start gap-3.5 hover:border-cyan-400/50 transition-colors">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center shrink-0 shadow-lg">
                <TrendingUp size={20} />
              </div>
              <div>
                <p className="text-white text-xs sm:text-sm font-black uppercase">Consistencia Continua</p>
                <p className="text-purple-300 text-[11px] mt-1 leading-relaxed">
                  Planeación editorial sostenida para construir recordación de marca a través del tiempo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════════
          SECCIÓN ESTRATÉGICA 1: PLANEACIÓN Y ESTRATEGIA CON VIDEO Y AUDIO
      ══════════════════════════════════════════════════════════════════════════════ */}
      <section id="estrategia-video-audio" className="py-16 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-br from-[#160730] via-[#0f0522] to-[#0a0417] border border-purple-500/30 p-6 sm:p-10 lg:p-12 shadow-2xl space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold uppercase tracking-wider">
                <Volume2 size={14} />
                <span>Metodología Audiovisual • Video + Audio + Estrategia</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight leading-tight">
                Planeación y Estrategia de Contenidos con Utilización de Video y Audio
              </h2>
              <p className="text-purple-200 text-xs sm:text-sm leading-relaxed">
                Publicar sin rumbo quema presupuesto. En ATOMIC Studio estructuramos cada mes como un sistema completo donde el{" "}
                <strong className="text-white">ritmo visual del video</strong> y la{" "}
                <strong className="text-cyan-300">psicología sonora del audio (voz, música y FX)</strong> trabajan juntos para captar atención en los primeros 3 segundos, explicar tu propuesta con claridad y generar mensajes directos de compra.
              </p>
            </div>

            <a
              href={`https://wa.me/${salesPhone}?text=${encodeURIComponent(
                "Hola ATOMIC Studio, quiero conocer cómo estructuran la planeación mensual con video y audio para mis redes sociales."
              )}`}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shrink-0 self-start lg:self-auto transition-all"
            >
              <Mic size={15} />
              <span>Solicitar Plan Video + Audio</span>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2.5">
              <span className="text-[11px] font-mono font-black text-pink-400 uppercase tracking-widest">Paso 01 • Planeación</span>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Target size={16} className="text-pink-400 shrink-0" />
                <span>Calendario & Guiones</span>
              </h3>
              <p className="text-xs text-purple-200 leading-relaxed">
                Definimos pilares de contenido (educativo, demostración de producto, prueba social y oferta), ganchos de apertura y estructura de cada pieza mensual.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2.5">
              <span className="text-[11px] font-mono font-black text-purple-300 uppercase tracking-widest">Paso 02 • Video</span>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Film size={16} className="text-purple-400 shrink-0" />
                <span>Producción & Ritmo Visual</span>
              </h3>
              <p className="text-xs text-purple-200 leading-relaxed">
                Grabación presencial o montaje dinámico en formato vertical (Reels, TikTok, Shorts) y horizontal con cortes limpios, color grading y subtítulos de alta retención.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2.5">
              <span className="text-[11px] font-mono font-black text-cyan-300 uppercase tracking-widest">Paso 03 • Audio</span>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Volume2 size={16} className="text-cyan-400 shrink-0" />
                <span>Voz, Música & Diseño Sonoro</span>
              </h3>
              <p className="text-xs text-purple-200 leading-relaxed">
                Limpieza profesional de diálogos, locución comercial clara, selección musical alineada a la energía de tu marca y efectos sonoros FX que evitan el scroll.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2.5">
              <span className="text-[11px] font-mono font-black text-emerald-300 uppercase tracking-widest">Paso 04 • Continuidad</span>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <TrendingUp size={16} className="text-emerald-400 shrink-0" />
                <span>Medición & Estrategia Continua</span>
              </h3>
              <p className="text-xs text-purple-200 leading-relaxed">
                Analizamos retención, compartidos y consultas recibidas cada mes para replicar los formatos ganadores sin perder la identidad de marca.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════════
          SECCIÓN ESTRATÉGICA 2: REMODELACIÓN DE LOGOTIPO, CATÁLOGOS & CONSISTENCIA DE MARCA
      ══════════════════════════════════════════════════════════════════════════════ */}
      <section id="remodelacion-logo" className="py-8 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Bloque Principal: Remodelación y Creación de Logotipos */}
          <div className="lg:col-span-7 p-6 sm:p-9 rounded-3xl bg-gradient-to-br from-[#20093b] via-[#130528] to-[#0b0318] border border-pink-500/35 shadow-2xl flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-500/15 border border-pink-400/40 text-pink-300 text-xs font-mono font-bold uppercase tracking-wider">
                <PenTool size={14} />
                <span>Rediseño & Identidad Visual Corporativa</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight leading-tight">
                Planes para Redes Sociales Donde Te Ayudamos a Remodelar Tu Logotipo
              </h2>
              <p className="text-purple-200 text-xs sm:text-sm leading-relaxed">
                Muchas marcas buenas pierden ventas porque su logotipo luce pixelado, recargado o desactualizado en pantallas móviles. Dentro de nuestros planes de redes sociales{" "}
                <strong className="text-white">remodelamos tu logotipo actual</strong> respetando su esencia —o diseñamos uno nuevo desde cero— para que se vea impecable en fotos de perfil, videos Reels, catálogos y empaques.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="p-4 rounded-2xl bg-black/35 border border-purple-500/25 space-y-1.5">
                <p className="text-xs font-black text-pink-300 uppercase">✨ Remodelación Moderna</p>
                <p className="text-[11.5px] text-slate-300 leading-relaxed">
                  Depuración de trazos, tipografía legible, vectorización en alta resolución y adaptación proporcional 1:1 para Instagram, TikTok y WhatsApp.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-black/35 border border-purple-500/25 space-y-1.5">
                <p className="text-xs font-black text-cyan-300 uppercase">🎨 Kit de Marca Aplicable</p>
                <p className="text-[11.5px] text-slate-300 leading-relaxed">
                  Entregamos versiones positivo/negativo, isotipo limpio, códigos hexadecimales oficiales, marcas de agua para video y plantillas coherentes.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href={`https://wa.me/${salesPhone}?text=${encodeURIComponent(
                  "Hola ATOMIC Studio, quiero información sobre sus planes de redes sociales donde ayudan a remodelar mi logotipo y alinear mi marca."
                )}`}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:brightness-110 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all"
              >
                <span>Remodelar Mi Logotipo Ahora</span>
                <ArrowRight size={14} />
              </a>
              <a
                href="#armar-ticket"
                className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-xs uppercase tracking-wider transition-all"
              >
                Cotizar en el Armador
              </a>
            </div>
          </div>

          {/* Bloque Derecho: Refinación de Catálogos & Consistencia Estratégica */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="flex-1 p-6 rounded-3xl bg-[#130628] border border-amber-400/30 space-y-3 shadow-xl">
              <div className="flex items-center gap-2 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider">
                <Camera size={15} />
                <span>Refinación de Catálogos & Productos</span>
              </div>
              <h3 className="text-lg font-black text-white uppercase">Imágenes Limpias que Venden Más</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Convertimos fotografías tomadas con celular o fichas de proveedor desordenadas en imágenes uniformes de alto valor percibido: recorte limpio, mejora de contraste/iluminación, etiquetas técnicas claras y maquetación profesional para catálogos WhatsApp y web.
              </p>
            </div>

            <div className="flex-1 p-6 rounded-3xl bg-[#130628] border border-cyan-400/30 space-y-3 shadow-xl">
              <div className="flex items-center gap-2 text-cyan-300 text-xs font-mono font-bold uppercase tracking-wider">
                <ShieldCheck size={15} />
                <span>Consistencia de Marca en el Tiempo</span>
              </div>
              <h3 className="text-lg font-black text-white uppercase">Identidad Sólida Mes tras Mes</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Las marcas rentables no cambian de estilo cada semana. Definimos tu arquitectura visual, tono de comunicación, música/audio característico y reglas de diseño para sostener una imagen confiable y reconocible a largo plazo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════════
          APARTADO 1: TICKETS ARMADOS MENSUALES DE REDES SOCIALES (CLICQUEABLES)
      ══════════════════════════════════════════════════════════════════════════════ */}
      <section id="planes-mensuales" className="py-16 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <Ticket size={14} />
            <span>Planes Mensuales Armados Listos para Contratar</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight font-sans">
            Paquetes de Redes Sociales, Video/Audio y Marca
          </h2>
          <p className="text-purple-300 text-xs sm:text-sm mt-2">
            Escoge el plan mensual acorde a la etapa de tu negocio: desde presencia constante con ajustes de logotipo hasta producción integral en video, audio y catálogos.
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
                    ? "bg-gradient-to-b from-[#210940] via-[#15062a] to-[#0e041e] border-2 border-purple-500 shadow-[0_0_50px_rgba(168,85,247,0.35)] md:scale-105 z-20"
                    : "bg-[#120524] border border-purple-500/30 hover:border-purple-400/60 shadow-xl"
                }`}
              >
                {/* Ribbon Tag */}
                <div
                  className={`px-4 py-2 bg-gradient-to-r ${ticket.badgeColor} text-white font-black text-xs uppercase tracking-wider text-center shadow-md flex items-center justify-center gap-1.5`}
                >
                  <Flame size={14} />
                  <span>{ticket.badge}</span>
                </div>

                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-widest">
                        PLAN MENSUAL ESTRATÉGICO
                      </span>
                      {ticket.includesSession && (
                        <span className="text-[10px] font-black text-cyan-300 px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40">
                          🎬 VIDEO & AUDIO
                        </span>
                      )}
                    </div>

                    <h3 className="text-2xl font-black text-white uppercase tracking-tight mt-1">{ticket.name}</h3>

                    <p className="text-purple-300 text-xs mt-2 leading-relaxed">{ticket.description}</p>

                    {/* Price Block */}
                    <div className="mt-5 p-4 rounded-2xl bg-black/40 border border-purple-500/20 text-center">
                      <span className="text-[10px] text-purple-400 uppercase font-mono block">Inversión del Plan</span>
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
                        ¿Qué incluye este paquete?
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
                    <Link
                      href={`/web/product/${ticket.dbId}`}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-400 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(244,63,94,0.35)] active:scale-95 text-center"
                    >
                      <span>Contratar {ticket.name}</span>
                      <ArrowRight size={14} className="stroke-[3]" />
                    </Link>

                    <a
                      href={`https://wa.me/${salesPhone}?text=${encodeURIComponent(ticket.whatsappMsg)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 font-black text-xs uppercase tracking-wider transition-all text-center"
                    >
                      <Phone size={14} />
                      <span>Agendar por WhatsApp</span>
                    </a>

                    <button
                      type="button"
                      onClick={() =>
                        handleAddToCartTicket(
                          ticket.dbId,
                          ticket.name,
                          ticket.price,
                          "/images/atomic-studio/planes-mensuales-redes-sociales.jpg"
                        )
                      }
                      className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        isAdded
                          ? "bg-yellow-400 text-black shadow-lg"
                          : "bg-purple-950/40 hover:bg-purple-900/40 text-purple-300 border border-purple-500/20"
                      }`}
                    >
                      <ShoppingCart size={13} />
                      <span>{isAdded ? "¡Plan Añadido al Carrito!" : "Añadir Plan al Carrito"}</span>
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
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border-2 border-purple-500/40 shadow-[0_0_40px_rgba(168,85,247,0.3)] group">
                <Image
                  src="/images/atomic-studio/mega-pack-creador-contenido.jpg"
                  alt="ATOMIC Mega Pack Creador de Contenido"
                  width={600}
                  height={600}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                />

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

            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-500/20 border border-pink-500/30 text-pink-300 text-xs font-mono font-bold uppercase">
                <Sparkles size={14} className="text-yellow-400" />
                <span>Kit Todo en Uno para Creadores & Agencias</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight leading-tight">
                MEGA PACK CREADOR DE CONTENIDO
              </h2>

              <p className="text-purple-200 text-sm leading-relaxed">
                ¿Editas parte de tu propio contenido o tienes equipo interno? Llévate todo el arsenal de video, efectos de audio FX, intros 3D para logotipos y recursos gráficos listos para elevar la calidad visual y sonora de tus producciones.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {MEGA_PACK_ITEMS.map((item, i) => (
                  <div key={i} className="p-3 rounded-2xl bg-purple-950/40 border border-purple-500/20 flex items-start gap-3">
                    <span className="text-xl shrink-0">{item.icon}</span>
                    <div className="min-w-0">
                      <p className="text-white text-xs font-black uppercase leading-tight truncate">{item.name}</p>
                      <p className="text-[11px] text-purple-300 leading-tight mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-3">
                <Link
                  href={`/web/product/${megaPackDbId}`}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-400 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(244,63,94,0.4)] flex items-center gap-2 active:scale-95"
                >
                  <Sparkles size={15} />
                  <span>Comprar Mega Pack Ahora ($49.99)</span>
                </Link>

                <a
                  href={`https://wa.me/${salesPhone}?text=${encodeURIComponent(
                    "Hola ATOMIC, deseo comprar el MEGA PACK Creador de Contenido por $49.99. ¿Cómo es el acceso y descarga?"
                  )}`}
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
          APARTADO 3: CONSTRUCTOR INTERACTIVO DE PLANES A MEDIDA
      ══════════════════════════════════════════════════════════════════════════════ */}
      <section id="armar-ticket" className="py-16 px-4 sm:px-8 max-w-6xl mx-auto">
        <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-[#180838] via-[#100424] to-[#0b0318] border-2 border-purple-500/40 shadow-2xl space-y-8 relative overflow-hidden">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold uppercase tracking-wider">
              ⚙️ Armador Interactivo de Estrategia Mensual
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              Arma Tu Plan a Medida (Redes + Video/Audio + Logo + Catálogo)
            </h3>
            <p className="text-purple-300 text-xs sm:text-sm">
              Ajusta la cantidad de piezas, videos y módulos estratégicos que necesita tu marca. Calculamos la inversión estimada en vivo.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start pt-2">
            {/* Interactive Sliders & Toggles */}
            <div className="space-y-4">
              {/* Slider 1: Posts */}
              <div className="p-4 rounded-2xl bg-purple-950/35 border border-purple-500/20 space-y-2">
                <div className="flex justify-between text-xs font-mono font-bold">
                  <span className="text-slate-300">Piezas Gráficas (Posts / Stories):</span>
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
              <div className="p-4 rounded-2xl bg-purple-950/35 border border-purple-500/20 space-y-2">
                <div className="flex justify-between text-xs font-mono font-bold">
                  <span className="text-slate-300">Reels / Videos Estratégicos:</span>
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

              <label className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/20 flex items-center justify-between cursor-pointer hover:border-cyan-400/50 transition-colors">
                <div>
                  <span className="text-white text-xs font-bold block">🎙️ Locución & Diseño Sonoro Pro (Audio + Video)</span>
                  <span className="text-[11px] text-purple-300">Guiones, voz comercial, música y mezcla sonora (+ $45)</span>
                </div>
                <input
                  type="checkbox"
                  checked={customAudioDesign}
                  onChange={(e) => setCustomAudioDesign(e.target.checked)}
                  className="w-5 h-5 accent-cyan-400 rounded"
                />
              </label>

              <label className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/20 flex items-center justify-between cursor-pointer hover:border-pink-400/50 transition-colors">
                <div>
                  <span className="text-white text-xs font-bold block">🎨 Remodelación de Logotipo & Guía Visual</span>
                  <span className="text-[11px] text-purple-300">Rediseño vectorizado + versiones digitales y paleta (+ $65)</span>
                </div>
                <input
                  type="checkbox"
                  checked={customLogoRemodel}
                  onChange={(e) => setCustomLogoRemodel(e.target.checked)}
                  className="w-5 h-5 accent-pink-500 rounded"
                />
              </label>

              <label className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/20 flex items-center justify-between cursor-pointer hover:border-amber-400/50 transition-colors">
                <div>
                  <span className="text-white text-xs font-bold block">📦 Refinación de Productos para Catálogo (20 imgs)</span>
                  <span className="text-[11px] text-purple-300">Limpieza de fondo, iluminación y fichas uniformes (+ $55)</span>
                </div>
                <input
                  type="checkbox"
                  checked={customCatalogRefine}
                  onChange={(e) => setCustomCatalogRefine(e.target.checked)}
                  className="w-5 h-5 accent-amber-400 rounded"
                />
              </label>

              <label className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/20 flex items-center justify-between cursor-pointer hover:border-purple-400/50 transition-colors">
                <div>
                  <span className="text-white text-xs font-bold block">📸 Sesión de Foto & Video Presencial</span>
                  <span className="text-[11px] text-purple-300">Producción en tu local o en estudio (+ $95)</span>
                </div>
                <input
                  type="checkbox"
                  checked={customPhotoSession}
                  onChange={(e) => setCustomPhotoSession(e.target.checked)}
                  className="w-5 h-5 accent-pink-500 rounded"
                />
              </label>

              <label className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/20 flex items-center justify-between cursor-pointer hover:border-purple-400/50 transition-colors">
                <div>
                  <span className="text-white text-xs font-bold block">🎯 Estrategia & Gestión Meta Ads</span>
                  <span className="text-[11px] text-purple-300">Configuración de campañas y optimización de conversión (+ $80)</span>
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
            <div className="p-6 sm:p-7 rounded-3xl bg-[#090214] border-2 border-dashed border-pink-500/50 relative shadow-2xl flex flex-col justify-between space-y-5 lg:sticky lg:top-24">
              <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
                <span className="text-[10px] font-mono text-purple-400 font-black uppercase tracking-widest">
                  PLAN PERSONALIZADO EN VIVO
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">● LISTO PARA COORDINAR</span>
              </div>

              <div className="space-y-2.5 text-xs font-mono">
                <div className="flex justify-between text-slate-300">
                  <span>Piezas de diseño ({customPosts}):</span>
                  <span className="text-white font-bold">${(customPosts * 7.5).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Reels / Videos ({customVideos}):</span>
                  <span className="text-white font-bold">${(customVideos * 45).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Locución & Diseño Sonoro:</span>
                  <span className="text-white font-bold">{customAudioDesign ? "$45.00" : "$0.00"}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Remodelación Logotipo + Marca:</span>
                  <span className="text-white font-bold">{customLogoRemodel ? "$65.00" : "$0.00"}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Refinación Catálogo (20 imgs):</span>
                  <span className="text-white font-bold">{customCatalogRefine ? "$55.00" : "$0.00"}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Sesión foto/video presencial:</span>
                  <span className="text-white font-bold">{customPhotoSession ? "$95.00" : "$0.00"}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Gestión Meta Ads:</span>
                  <span className="text-white font-bold">{customAdsManagement ? "$80.00" : "$0.00"}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-purple-500/20 text-center">
                <span className="text-[10px] text-purple-400 uppercase font-mono block">
                  Inversión Estimada Mensual
                </span>
                <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-300 font-mono">
                  ${calculatedCustomPrice.toFixed(2)}
                  <span className="text-xs text-purple-400 font-normal"> /mes</span>
                </div>
              </div>

              <a
                href={`https://wa.me/${salesPhone}?text=${encodeURIComponent(customTicketWhatsappMsg)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-black text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-all text-center"
              >
                <Ticket size={16} />
                <span>Enviar Plan a WhatsApp & Agendar</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════════
          APARTADO 4: PREGUNTAS CLAVE & SESIÓN ESTRATÉGICA
      ══════════════════════════════════════════════════════════════════════════════ */}
      <section className="py-12 px-4 sm:px-8 max-w-6xl mx-auto border-t border-purple-500/20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-purple-950/30 border border-purple-500/20 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold">
              <PenTool size={18} />
            </div>
            <h4 className="text-base font-black text-white uppercase tracking-tight">
              ¿Cómo remodelan mi logotipo dentro del plan?
            </h4>
            <p className="text-purple-300 text-xs leading-relaxed">
              Analizamos tu logo actual, conservamos los elementos que ya reconocen tus clientes y modernizamos sus trazos, tipografía y proporciones para que funcione en redes sociales, videos y catálogos.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-purple-950/30 border border-purple-500/20 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
              <Volume2 size={18} />
            </div>
            <h4 className="text-base font-black text-white uppercase tracking-tight">
              ¿Por qué planear el video junto con el audio?
            </h4>
            <p className="text-purple-300 text-xs leading-relaxed">
              En Reels y TikTok el sonido dirige la emoción y la retención. Trabajamos guion hablado, limpieza vocal, música estratégica y efectos sonoros FX en cada producción para multiplicar visualizaciones.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-purple-950/30 border border-purple-500/20 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Layers size={18} />
            </div>
            <h4 className="text-base font-black text-white uppercase tracking-tight">
              ¿Cómo mantienen la consistencia en el tiempo?
            </h4>
            <p className="text-purple-300 text-xs leading-relaxed">
              Trabajamos con una guía viva de colores, tipografías, estilos de catálogo y calendario editorial mensual aprobada por ti antes de publicar, asegurando coherencia continua.
            </p>
          </div>
        </div>

        {/* Big Agenda Call To Action */}
        <div className="mt-10 p-8 rounded-3xl bg-gradient-to-r from-purple-950 via-[#1a0736] to-[#0d041e] border-2 border-pink-500/40 text-center space-y-4 shadow-2xl">
          <span className="px-3.5 py-1 rounded-full bg-pink-500 text-white text-[10px] font-black uppercase tracking-widest">
            Diagnóstico Creativo Sin Costo
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            ¿Listo para profesionalizar tus redes, tu logotipo y tu catálogo?
          </h3>
          <p className="text-purple-200 text-xs sm:text-sm max-w-2xl mx-auto">
            Revisamos tu cuenta actual, te recomendamos qué ajustar en tu logotipo y armamos una hoja de ruta mensual en video, audio e imagen adaptada a tu industria.
          </p>
          <div className="pt-2">
            <a
              href={`https://wa.me/${salesPhone}?text=${encodeURIComponent(
                "Hola ATOMIC Studio, quiero agendar una sesión estratégica para mi plan de redes sociales (video/audio), remodelación de logotipo y catálogo."
              )}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white font-black text-sm uppercase tracking-wider hover:brightness-110 transition-all shadow-[0_0_30px_rgba(244,63,94,0.4)] active:scale-95"
            >
              <Calendar size={18} />
              <span>¡Agenda Tu Sesión Creativa por WhatsApp!</span>
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="mt-12 border-t border-purple-500/20 bg-[#070210] py-8 px-4 text-center text-xs text-purple-400 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} ATOMIC STUDIO • Estrategia en Video & Audio, Logotipos, Catálogos y Marca.</p>
          <div className="flex items-center gap-4">
            <Link href="/web" className="hover:text-white transition-colors">
              Inicio ATOMIC
            </Link>
            <span>•</span>
            <Link href="/web/precios-vendedor" className="hover:text-white transition-colors">
              Precios & Catálogo
            </Link>
            <span>•</span>
            <Link href="/web/cart" className="hover:text-white transition-colors">
              Carrito
            </Link>
          </div>
        </div>
      </footer>

      {/* ── STICKY MOBILE CONVERSION BAR ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0d041e]/95 backdrop-blur-xl border-t border-purple-500/30 p-2.5 flex items-center justify-between gap-2 sm:hidden shadow-2xl">
        <div className="flex-1 min-w-0 pl-1">
          <span className="text-[10px] text-pink-400 font-black uppercase block leading-none truncate">
            ATOMIC STUDIO
          </span>
          <span className="text-[11px] text-white font-mono font-bold">Planes desde $100/mes</span>
        </div>

        <a
          href={`https://wa.me/${salesPhone}?text=${encodeURIComponent(
            "Hola ATOMIC Studio, quiero contratar un plan mensual de redes sociales con video, audio y remodelación de logotipo."
          )}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-xs uppercase tracking-wider shadow-lg shrink-0"
        >
          <Phone size={14} className="stroke-[2.5]" />
          <span>Contratar Plan</span>
        </a>
      </div>
    </div>
  )
}
