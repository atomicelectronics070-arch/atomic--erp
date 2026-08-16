"use client"

import { useState, useEffect, useMemo } from "react"
import {
  Menu, Search, User, ShoppingCart, Truck, X, ChevronDown, ChevronRight,
  ExternalLink, MapPin, Phone, Mail, Award, Shield, Star, Sparkles,
  Bot, Laptop, Smartphone, Home as HomeIcon, Building, Factory, Cpu,
  Gamepad2, Utensils, Zap, Code, Lock, ShieldCheck, CheckCircle2, MessageCircle
} from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useCart } from "@/context/CartContext"

import dynamic from "next/dynamic"
import { BANNER_IMAGES } from "@/lib/banner-data"

const CoverflowGallery = dynamic(() => import("@/components/CoverflowGallery"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[380px] flex items-center justify-center bg-[#090e1a] rounded-2xl border border-slate-800">
      <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
    </div>
  )
})

/* ── ATOMIC ATOM LOGO SVG (LUXURY HIGH-CONTRAST) ── */
function AtomicLogoSVG() {
  return (
    <svg width="34" height="34" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 drop-shadow-[0_0_12px_rgba(255,255,255,0.9)]">
      <circle cx="36" cy="36" r="6" fill="#FFFFFF" className="animate-pulse" />
      <ellipse cx="36" cy="36" rx="30" ry="10" stroke="#FFFFFF" strokeWidth="2.5" fill="none" />
      <ellipse cx="36" cy="36" rx="30" ry="10" stroke="#FFFFFF" strokeWidth="2.5" fill="none" transform="rotate(60 36 36)" />
      <ellipse cx="36" cy="36" rx="30" ry="10" stroke="#FFFFFF" strokeWidth="2.5" fill="none" transform="rotate(120 36 36)" />
    </svg>
  )
}

interface PublicWebClientProps {
  initialProducts: any[]
  metadata: { categories: any[]; collections: any[] }
  userRole?: string
  storeSettings?: any
}

export default function PublicWebClient({ initialProducts, metadata, userRole }: PublicWebClientProps) {
  const { totalItems } = useCart()

  // State Management
  const [activeTab, setActiveTab] = useState<'categorias' | 'landings' | 'ofertas'>('categorias')
  const [searchQuery, setSearchQuery] = useState('')
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false)
  const [isTodosArticulosOpen, setIsTodosArticulosOpen] = useState(true)
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null)
  const [modalType, setModalType] = useState<'nosotros' | 'ubicacion' | 'referencias' | 'contacto' | 'cart' | 'profile' | 'envios' | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)

  // Auto-read URL search parameter ?search=... or ?q=... on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const qParam = params.get('search') || params.get('q');
      if (qParam) {
        const cleaned = decodeURIComponent(qParam).replace(/-/g, ' ').trim();
        setSearchQuery(cleaned);
      }
    }
  }, []);

  // Auto-close hamburger menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsHamburgerOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // 24 Real Promotional Banners (All 24 User Banners 100% Inlined)
  const volkswagenAdBanners = [
    { title: 'CAMARAS ESPIAS & SEGURIDAD', sub: 'Protección Residencial & Industrial en Tiempo Real', img: BANNER_IMAGES['banner-13.jpg'] || BANNER_IMAGES['banner-1.jpg'], tag: 'SEGURIDAD' },
    { title: 'CONTROLES DE ACCESO BIOMETRICOS', sub: 'Sistemas Inteligentes ZKTECO con Reconocimiento Facial', img: BANNER_IMAGES['banner-14.jpg'] || BANNER_IMAGES['banner-2.jpg'], tag: 'ACCESO' },
    { title: 'MONITORES & PANTALLAS AHD 7"', sub: 'Visualización de Alta Definición con Grabación Continua', img: BANNER_IMAGES['banner-15.jpg'] || BANNER_IMAGES['banner-3.jpg'], tag: 'GAMING' },
    { title: 'MICROCOMPUTADORES & MINI PC', sub: 'Potencia Industrial en Chasis Ultra-Compactos', img: BANNER_IMAGES['banner-16.jpg'] || BANNER_IMAGES['banner-4.jpg'], tag: 'HARDWARE' },
    { title: 'BOTONERAS & PUERTAS AUTOMÁTICAS', sub: 'Control de Portones Industriales de Alta Resistencia', img: BANNER_IMAGES['banner-17.jpg'] || BANNER_IMAGES['banner-5.jpg'], tag: 'AUTOMATIZACION' },
    { title: 'SOLUCIONES EN DOMÓTICA & HOGAR', sub: 'Tecnología Inteligente para Tu Estilo de Vida', img: BANNER_IMAGES['banner-18.jpg'] || BANNER_IMAGES['banner-6.jpg'], tag: 'HOGAR' },
    { title: 'EQUIPAMIENTO DE COCINA A GAS', sub: 'Línea de Lujo en Acero Inoxidable en Centímetros', img: BANNER_IMAGES['banner-19.jpg'] || BANNER_IMAGES['banner-7.jpg'], tag: 'COCINA' },
    { title: 'CONSOLAS GAMING & DUALSENSE', sub: 'PlayStation 5 Slim, PS4, Xbox & Mandos Originales', img: BANNER_IMAGES['banner-20.jpg'] || BANNER_IMAGES['banner-8.jpg'], tag: 'GAMING' },
    { title: 'KIT ALARMAS & SENSORES SMART', sub: 'Detección de Movimiento y Alertas a tu Celular', img: BANNER_IMAGES['banner-21.jpg'] || BANNER_IMAGES['banner-9.jpg'], tag: 'ALARMAS' },
    { title: 'PORTONES ELÉCTRICOS & ACCESOS', sub: 'Automatización para Garajes y Entradas Principales', img: BANNER_IMAGES['banner-22.jpg'] || BANNER_IMAGES['banner-10.jpg'], tag: 'PORTONES' },
    { title: 'SISTEMAS POS & SOFTWARE ERP', sub: 'Control de Ventas, Inventario y Facturación Electrónica SRI', img: BANNER_IMAGES['banner-23.jpg'] || BANNER_IMAGES['banner-11.jpg'], tag: 'SOFTWARE' },
    { title: 'PLANTAS DE BLOQUES & INDUSTRIAL', sub: 'Maquinaria de Construcción de Alta Eficiencia', img: BANNER_IMAGES['banner-18.jpg'] || BANNER_IMAGES['banner-12.jpg'], tag: 'INDUSTRIAL' },
  ]

  // Auto Slider for Volkswagen Style Scroll Hero
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % volkswagenAdBanners.length)
    }, 4500)
    return () => clearInterval(timer)
  }, [volkswagenAdBanners.length])

  // Filtered Products for Live Search & Category Filter
  const filteredProducts = useMemo(() => {
    let result = initialProducts || []
    if (searchQuery.trim()) {
      const stopWords = new Set(['de', 'del', 'la', 'el', 'en', 'para', 'con', 'un', 'una', 'y'])
      const tokens = searchQuery
        .toLowerCase()
        .replace(/-/g, ' ')
        .split(/\s+/)
        .map(t => t.trim())
        .filter(t => t.length > 0 && !stopWords.has(t))

      if (tokens.length > 0) {
        result = result.filter(p => {
          const text = `${p.name || ''} ${p.category?.name || ''} ${p.description || ''} ${p.specs || ''}`.toLowerCase()
          return tokens.every(token => text.includes(token))
        })
      }
    }
    if (selectedCategoryFilter) {
      const catQ = selectedCategoryFilter.toLowerCase()
      result = result.filter(p => p.category?.name?.toLowerCase().includes(catQ) || p.name?.toLowerCase().includes(catQ))
    }
    return result
  }, [initialProducts, searchQuery, selectedCategoryFilter])

  // 12 Top Category Grid Items with Prices "DESDE $"
  const categoryGridItems = [
    { id: 'industrial', title: 'INDUSTRIAL', sub: 'Automatización', fromPrice: '$185.00', sampleProduct: 'Planta de Adoquines', icon: Factory, iconBg: 'bg-blue-600/20 text-cyan-300 border-blue-500/40', href: '#industrial' },
    { id: 'servicios', title: 'SERVICIOS', sub: 'Asesoría', fromPrice: '$45.00', sampleProduct: 'Peritaciones & Consultoría', icon: Award, iconBg: 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40', href: '#servicios' },
    { id: 'computacion', title: 'COMPUTACIÓN', sub: 'Laptops', fromPrice: '$320.00', sampleProduct: 'Laptop Asus Core i7', icon: Laptop, iconBg: 'bg-purple-600/20 text-purple-300 border-purple-500/40', href: '/web/cpus' },
    { id: 'telefonia', title: 'TELEFONÍA', sub: 'Celulares', fromPrice: '$110.00', sampleProduct: 'Honor Magic 7 5G', icon: Smartphone, iconBg: 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40', href: '/web/phones' },
    { id: 'minipc', title: 'MINI PC', sub: 'Compactos', fromPrice: '$195.00', sampleProduct: 'Mini PC Intel N100', icon: Cpu, iconBg: 'bg-sky-600/20 text-sky-300 border-sky-500/40', href: '/web/cpus' },
    { id: 'monitores', title: 'MONITORES', sub: 'Gaming HD', fromPrice: '$135.00', sampleProduct: 'Monitor Gaming 165Hz', icon: Laptop, iconBg: 'bg-cyan-600/20 text-cyan-300 border-cyan-500/40', href: '/web/cpus' },
    { id: 'tablets-infantiles', title: 'TABLETS NIÑOS', sub: 'Edición Kids', fromPrice: '$65.00', sampleProduct: 'Tablet Kids 7" Antigolpes', icon: Smartphone, iconBg: 'bg-rose-600/20 text-rose-300 border-rose-500/40', href: '/web/phones' },
    { id: 'portones-automaticos', title: 'PORTONES', sub: 'Control Acceso', fromPrice: '$150.00', sampleProduct: 'Motor Portón Eléctrico', icon: Lock, iconBg: 'bg-amber-600/20 text-amber-300 border-amber-500/40', href: '/web/intercomunicacion' },
    { id: 'hogar', title: 'HOGAR', sub: 'Cocina & Domótica', fromPrice: '$85.00', sampleProduct: 'Encimera a Gas 4 Hornillas', icon: Utensils, iconBg: 'bg-[#ff5733]/20 text-orange-300 border-[#ff5733]/40', href: '/web/cocinas' },
    { id: 'software', title: 'SOFTWARE', sub: 'Systems & Web', fromPrice: '$150.00', sampleProduct: 'Sistema POS & ERP Web', icon: Code, iconBg: 'bg-blue-600/20 text-blue-300 border-blue-500/40', href: '/web/software' },
    { id: 'tecnologia-residencial', title: 'TECNOLOGÍA RES.', sub: 'Alarmas', fromPrice: '$95.00', sampleProduct: 'Kit Alarma Smart Wifi', icon: Shield, iconBg: 'bg-teal-600/20 text-teal-300 border-teal-500/40', href: '/web/conjuntos-smart' },
    { id: 'electronica', title: 'ELECTRÓNICA', sub: 'Cables & Micro', fromPrice: '$12.00', sampleProduct: 'Camara Espia HD', icon: Zap, iconBg: 'bg-yellow-600/20 text-yellow-300 border-yellow-500/40', href: '#electronica' },
  ]

  // Landing Pages Data
  const landingPagesList = [
    { title: 'Bobinas de Cable UTP & FTP', sub: 'Cat6, Cat5e, 100% Cobre, Aleación CCA & Blindados', url: '/web/bobinas-cables', tag: 'CABLEADO', image: '⚡' },
    { title: 'Mandos & Consolas Gaming', sub: 'DualSense PS5, PS4, Switch, PS Portal', url: '/web/mandos', tag: 'GAMING', image: '🎮' },
    { title: 'Encimeras & Hornos a Gas', sub: 'Línea de Cocina en Centímetros', url: '/web/cocinas', tag: 'HOGAR', image: '🍳' },
    { title: 'Consolas de Videojuegos', sub: 'PS5 Slim 1TB, PS4 Pro, Xbox Series X', url: '/web/collection/consolas-de-video-juegos', tag: 'CONSOLAS', image: '🕹️' },
    { title: 'Máquinas de Bloques & Adoquines', sub: 'Planta Industrial de Construcción', url: '/web/blogs/guia-maquinas-de-bloques', tag: 'INDUSTRIAL', image: '🏗️' },
    { title: 'Tarjetas Smart NFC & IoT', sub: 'Control de Acceso Digital', url: '/web/nfc', tag: 'TECNOLOGÍA', image: '💳' },
    { title: 'Ecosistema TOMC & Servicios', sub: 'Consultoría & Peritaciones', url: '/web/ecosistema-tomc', tag: 'SERVICIOS', image: '💼' },
    { title: 'Intercomunicación & Videoporteros', sub: 'Seguridad Residencial ZKTECO', url: '/web/intercomunicacion', tag: 'SEGURIDAD', image: '📹' },
    { title: 'Cargadores Eléctricos', sub: 'Movilidad Eléctrica Inteligente', url: '/web/cargadores-electricos', tag: 'ECO', image: '⚡' },
  ]

  // All Items List for Accordion Breakdown
  const allItemsList = [
    'Portones', 'Alarmas', 'Perimetrales', 'Microcomputadores', 'Cables', 'Adaptadores',
    'Asesoría', 'Especialización', 'Peritaciones', 'Automatización', 'Lubricación', 'Generadores',
    'Iluminación', 'Cocina', 'Domótica', 'Systems', 'Celulares', 'Tablets', 'Tablets infantiles',
    'Laptops', 'Portátiles PC', 'Monitores', 'Impresoras', 'Mini PC', 'Mandos DualSense', 'Encimeras a Gas'
  ]

  return (
    <div className="w-full bg-[#05070c] min-h-screen text-slate-100 font-sans selection:bg-blue-600 selection:text-white pb-20">

      {/* ═════════════════════════════════════════════════════════════ */}
      {/* 👑 TOP STANDALONE SLOGAN HEADER BAR (HIGH-PRECISION MONO)     */}
      {/* ═════════════════════════════════════════════════════════════ */}
      <div className="w-full bg-[#080d18] text-cyan-300 text-[11px] md:text-xs font-black uppercase tracking-[0.3em] text-center py-2 px-4 border-b border-blue-500/30 shadow-md font-mono flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#38bdf8]" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-100 to-blue-300">
          TECNOLOGÍA, INDUSTRIA Y HOGAR
        </span>
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#38bdf8]" />
      </div>

      {/* ═════════════════════════════════════════════════════════════ */}
      {/* 🍅 HEADER BAR: LIGHT CORAL TOMATO BRANDED NAV (#FF5733 / #FF4D4D) */}
      {/* ═════════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-[#ff6b4a] via-[#ff5733] to-[#ff4136] text-white shadow-xl border-b border-[#e04322] px-3 md:px-5 py-1.5 md:py-2">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2.5">

          {/* LEFT: HAMBURGER & LOGO */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsHamburgerOpen(true)}
              className="p-1.5 rounded-lg bg-[#e04322] hover:bg-[#c9381b] transition-all text-white shadow-md active:scale-95 shrink-0"
              aria-label="Abrir Menú"
            >
              <Menu size={20} />
            </button>

            <Link href="/web" className="flex items-center gap-1.5 group">
              <AtomicLogoSVG />
              <div className="flex flex-col">
                <span className="text-base md:text-xl font-black tracking-tight leading-none uppercase font-mono text-white drop-shadow-md">
                  ATOMIC
                </span>
                <span className="text-[8px] md:text-[10px] font-bold tracking-tight leading-tight text-amber-100 hidden sm:block">
                  Hardware & Software
                </span>
              </div>
            </Link>
          </div>

          {/* CENTER: COMPACT SEARCH INPUT BAR */}
          <div className="flex-1 max-w-md mx-1 md:mx-4 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar producto..."
              className="w-full bg-[#0a0f1d] text-white placeholder-slate-400 border border-blue-400/40 rounded-full py-1 md:py-1.5 pl-8 pr-8 text-xs font-medium shadow-inner outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            />
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-cyan-400 pointer-events-none" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* RIGHT ACTION ICONS: PROFILE, CART, SHIPPING */}
          <div className="flex items-center gap-1 md:gap-2 shrink-0">
            <button
              onClick={() => setModalType('profile')}
              className="p-1.5 md:p-2 rounded-full bg-[#0a0f1d] hover:bg-blue-900 transition-all text-cyan-300 border border-blue-400/40 shadow-md hover:scale-105 active:scale-95"
              title="Perfil de Usuario"
            >
              <User size={16} />
            </button>

            <button
              onClick={() => setModalType('cart')}
              className="p-1.5 md:p-2 rounded-full bg-[#0a0f1d] hover:bg-blue-900 transition-all text-cyan-300 border border-blue-400/40 shadow-md relative hover:scale-105 active:scale-95"
              title="Carrito de Compras"
            >
              <ShoppingCart size={16} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-cyan-400 text-blue-950 font-black text-[8px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#0a0f1d] shadow-sm">
                  {totalItems}
                </span>
              )}
            </button>

            <button
              onClick={() => setModalType('envios')}
              className="p-1.5 md:p-2 rounded-full bg-[#0a0f1d] hover:bg-blue-900 transition-all text-cyan-300 border border-blue-400/40 shadow-md hover:scale-105 active:scale-95"
              title="Seguimiento de Envíos"
            >
              <Truck size={16} />
            </button>
          </div>

        </div>
      </header>

      {/* ═════════════════════════════════════════════════════════════ */}
      {/* 🔮 3D COVERFLOW GALLERY HERO (ORIGINKIT 3D SHOWCASE)         */}
      {/* ═════════════════════════════════════════════════════════════ */}
      <section className="bg-gradient-to-b from-[#060913] via-[#090e1a] to-[#0e1424] pt-6 pb-4 border-b border-[#1e293b] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-2 mb-2">
          <span className="inline-block text-[10px] md:text-xs font-mono font-black text-cyan-400 uppercase tracking-[0.3em] bg-blue-950/90 px-3.5 py-1 rounded-full border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            ✨ ATOMIC SHOWCASE 3D DE PRODUCTOS IA
          </span>
          <h2 className="text-xl md:text-3xl lg:text-4xl font-black text-white uppercase tracking-tight font-mono">
            GALERÍA DE PRODUCTOS DESTACADOS
          </h2>
          <p className="text-xs md:text-sm text-slate-300 max-w-2xl mx-auto font-medium">
            Explora nuestra línea de importación y productos inteligentes en tecnología 3D.
          </p>
        </div>
        <div className="w-full max-w-6xl mx-auto min-h-[420px] flex items-center justify-center">
          <CoverflowGallery autoplay={true} cardWidth={480} cardHeight={360} gap={8} tilt={12} sideTilt={8} opacity={60} />
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════ */}
      {/* 🚘 VOLKSWAGEN LUXURY SCROLL HERO SECTION                     */}
      {/* ═════════════════════════════════════════════════════════════ */}
      <section className="bg-gradient-to-b from-[#0e1424] to-[#05070c] border-b border-[#1e293b] pt-5 pb-7 px-3 md:px-5">
        <div className="max-w-6xl mx-auto space-y-4">
          
          {/* INTRO TEXT AS REQUESTED */}
          <div className="text-center md:text-left space-y-1">
            <span className="text-[10px] md:text-xs font-mono font-black text-cyan-400 uppercase tracking-[0.2em] bg-blue-950/80 px-3 py-1 rounded-full border border-blue-500/30">
              NUESTRO ALCANCE TOTAL PARA TI
            </span>
            <h1 className="text-lg md:text-2xl lg:text-3xl font-black text-white uppercase tracking-tight font-mono">
              Te invitamos a ver todas nuestras categorías
            </h1>
            <p className="text-xs text-slate-400 max-w-2xl font-medium">
              Elige la tuya y configúrala como tú quieras. Innovación, importación directa y respaldo técnico en todo Ecuador.
            </p>
          </div>

          {/* VOLKSWAGEN STYLE ELEGANT CAROUSEL WITH ADVERTISING BANNERS (FORMAL GREY STUDIO SHOWCASE) */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-700/80 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-950 shadow-2xl min-h-[220px] md:min-h-[300px] flex items-center justify-between p-4 md:p-8">
            
            {/* Slide Details */}
            <div className="z-10 max-w-md space-y-2">
              <span className="text-[9px] font-mono font-bold bg-[#ff5733] text-white px-2 py-0.5 rounded uppercase tracking-wider">
                {volkswagenAdBanners[currentSlide].tag}
              </span>
              <h2 className="text-base md:text-xl font-black text-white uppercase tracking-tight leading-snug">
                {volkswagenAdBanners[currentSlide].title}
              </h2>
              <p className="text-xs text-slate-300 font-medium">
                {volkswagenAdBanners[currentSlide].sub}
              </p>
              <div className="pt-2">
                <a
                  href={`https://wa.me/593969043453?text=${encodeURIComponent(`Hola ATOMIC! Deseo cotizar la línea: ${volkswagenAdBanners[currentSlide].title}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-gradient-to-r from-[#0066ff] to-[#1d4ed8] hover:from-[#0052cc] hover:to-[#1e40af] text-white font-bold text-xs uppercase rounded-xl transition-all shadow-lg inline-flex items-center gap-1.5"
                >
                  <MessageCircle size={14} /> Configurar Ahora
                </a>
              </div>
            </div>

            {/* Slide Image Presentation (Formal Studio Presentation) */}
            <div className="relative w-full md:w-1/2 min-h-[180px] md:min-h-[240px] flex items-center justify-center p-3 rounded-xl border border-[#d4af37]/40 bg-slate-900/60 shadow-[0_0_20px_rgba(0,102,255,0.4)]">
              <img
                key={currentSlide}
                src={volkswagenAdBanners[currentSlide].img}
                alt={volkswagenAdBanners[currentSlide].title}
                style={{
                  maxHeight: '220px',
                  maxWidth: '100%',
                  objectFit: 'contain',
                  borderRadius: '12px',
                  border: '1.5px solid #d4af37',
                  boxShadow: '0 0 25px rgba(0, 102, 255, 0.6)',
                  backgroundColor: '#ffffff'
                }}
              />
            </div>

            {/* Carousel Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
              {volkswagenAdBanners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-1.5 rounded-full transition-all ${currentSlide === idx ? 'w-6 bg-cyan-400' : 'w-2 bg-slate-600'}`}
                />
              ))}
            </div>

          </div>

          {/* VOLKSWAGEN STYLE HORIZONTAL CATEGORY SCROLLER WITH "DESDE $" & PRODUCT SAMPLE PRESENTATION */}
          <div className="pt-2 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-slate-300">EXPLORA EL CATÁLOGO (12 DE 12 CATEGORÍAS)</span>
              <span className="text-cyan-400 font-bold">DESDE PRECIOS DE IMPORTACIÓN</span>
            </div>

            <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 scrollbar-none">
              {categoryGridItems.map((cat) => {
                const Icon = cat.icon
                return (
                  <div
                    key={cat.id}
                    onClick={() => setSelectedCategoryFilter(cat.title)}
                    className="min-w-[180px] w-[180px] shrink-0 snap-start bg-[#0e1424] border border-[#1e293b] hover:border-cyan-400 p-3 rounded-xl shadow-md hover:bg-[#121a2f] transition-all cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        {/* ULTRA-THIN GOLD BORDER WHITE BOX WITH LUMINOUS ELECTRIC BLUE 3D SHADOW & SILHOUETTE ICON */}
                        <div
                          style={{
                            backgroundColor: '#ffffff',
                            border: '2px solid #d4af37',
                            borderRadius: '12px',
                            boxShadow: '0 0 18px rgba(0, 102, 255, 0.85), 0 4px 10px rgba(0, 0, 0, 0.3)',
                            width: '42px',
                            height: '42px',
                            minWidth: '42px',
                            minHeight: '42px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                          className="shrink-0 group-hover:scale-110 transition-transform duration-300 relative z-10"
                        >
                          <Icon size={20} style={{ color: '#0f172a', strokeWidth: 2.5, width: '20px', height: '20px', minWidth: '20px', minHeight: '20px' }} />
                        </div>
                        <span className="text-[10px] font-mono font-black text-white bg-gradient-to-r from-[#ff5733] to-[#ff4136] px-2.5 py-0.5 rounded-full border border-[#ff6b4a] shadow-sm shrink-0">
                          Desde {cat.fromPrice}
                        </span>
                      </div>
                      <h3 className="font-black text-xs text-white uppercase tracking-tight group-hover:text-cyan-400 transition-colors">
                        {cat.title}
                      </h3>
                      <span className="text-[9px] text-slate-400 font-medium block mt-0.5">
                        {cat.sub}
                      </span>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-[#1e293b] flex items-center justify-between text-[10px] font-bold text-slate-300">
                      <span className="truncate">{cat.sampleProduct}</span>
                      <ChevronRight size={12} className="text-cyan-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════ */}
      {/* 📌 MINI TABS NAVIGATION BAR: CATEGORIAS | LANDING PAGES | OFERTAS */}
      {/* ═════════════════════════════════════════════════════════════ */}
      <nav className="bg-[#0b101c] border-b border-blue-500/20 shadow-md sticky top-[45px] md:top-[51px] z-40 px-3 py-1.5">
        <div className="max-w-6xl mx-auto flex items-center justify-center md:justify-start gap-4 md:gap-10">

          <button
            onClick={() => setActiveTab('categorias')}
            className={`font-black text-xs tracking-wider uppercase transition-all pb-0.5 border-b-2 ${
              activeTab === 'categorias'
                ? 'border-blue-500 text-blue-400 shadow-[0_2px_10px_rgba(59,130,246,0.5)]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            CATEGORIAS
          </button>

          <button
            onClick={() => setActiveTab('landings')}
            className={`font-black text-xs tracking-wider uppercase transition-all pb-0.5 border-b-2 ${
              activeTab === 'landings'
                ? 'border-blue-500 text-blue-400 shadow-[0_2px_10px_rgba(59,130,246,0.5)]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            LANDING PAGES
          </button>

          <button
            onClick={() => setActiveTab('ofertas')}
            className={`font-black text-xs tracking-wider uppercase transition-all pb-0.5 border-b-2 ${
              activeTab === 'ofertas'
                ? 'border-blue-500 text-blue-400 shadow-[0_2px_10px_rgba(59,130,246,0.5)]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            OFERTAS 🔥
          </button>

        </div>
      </nav>

      {/* ═════════════════════════════════════════════════════════════ */}
      {/* MAIN BENTO GRID CONTAINER AREA                                */}
      {/* ═════════════════════════════════════════════════════════════ */}
      <main className="max-w-6xl mx-auto px-3 md:px-5 pt-3">

        {/* SEARCH OVERRIDE RESULTS VIEW */}
        {searchQuery.trim() ? (
          <div className="bg-[#0f172a] p-4 rounded-xl shadow-lg border border-blue-500/30 mb-6">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-blue-500/20">
              <h2 className="text-sm font-black text-white uppercase">
                Resultados para: &quot;<span className="text-cyan-400">{searchQuery}</span>&quot;
              </h2>
              <span className="text-[10px] font-bold text-blue-400 font-mono">
                {filteredProducts.length} productos
              </span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No se encontraron productos que coincidan con la búsqueda.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {filteredProducts.slice(0, 36).map(p => (
                  <div key={p.id} className="bg-[#131c31] border border-blue-500/20 p-2.5 rounded-lg flex flex-col justify-between hover:border-blue-400 transition-all">
                    <div>
                      <span className="text-[8px] font-mono text-cyan-400 uppercase font-bold block mb-1">
                        {p.category?.name || 'General'}
                      </span>
                      <h4 className="font-bold text-[11px] text-white line-clamp-2 mb-1">{p.name}</h4>
                    </div>
                    <div>
                      <p className="text-xs font-black text-cyan-300 mb-1.5">${(p.price || 0).toFixed(2)}</p>
                      <a
                        href={`https://wa.me/593969043453?text=${encodeURIComponent(`Hola ATOMIC! Deseo cotizar: ${p.name} ($${(p.price || 0).toFixed(2)})`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-1 bg-gradient-to-r from-[#0066ff] to-[#1d4ed8] hover:from-[#0052cc] hover:to-[#1e40af] text-white font-bold text-[9px] uppercase rounded transition-all text-center flex items-center justify-center gap-1 shadow-md shadow-blue-500/20"
                      >
                        <MessageCircle size={10} /> Cotizar
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}

        {/* ═════════════════════════════════════════════════════════════ */}
        {/* TAB 1: CATEGORIAS VIEW (VERCEL/LINEAR HIGH-SPEED BENTO GRID) */}
        {/* ═════════════════════════════════════════════════════════════ */}
        {!searchQuery.trim() && activeTab === 'categorias' && (
          <div className="space-y-4">

            {/* MAIN 3-COLUMN CONTENT BENTO BREAKDOWN */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-0.5">

              {/* COLUMN 1 */}
              <div className="space-y-3.5">
                
                {/* INDUSTRIAL CARD */}
                <div className="bg-[#0e1424] p-3.5 md:p-4 rounded-xl border border-[#1e293b] shadow-md space-y-1.5 hover:border-cyan-500/50 transition-all">
                  <h3 className="font-black text-xs md:text-sm text-cyan-400 uppercase tracking-tight flex items-center gap-1.5 font-mono">
                    <Factory size={15} /> INDUSTRIAL
                  </h3>
                  <ul className="space-y-1 text-[11px] text-slate-200 font-semibold">
                    <li className="flex items-center gap-1.5 hover:text-cyan-400 cursor-pointer" onClick={() => setSelectedCategoryFilter('Automatización')}>
                      <span className="text-blue-400">•</span> Automatización
                    </li>
                    <li className="flex items-center gap-1.5 hover:text-cyan-400 cursor-pointer" onClick={() => setSelectedCategoryFilter('Lubricación')}>
                      <span className="text-blue-400">•</span> Lubricación
                    </li>
                    <li className="flex items-center gap-1.5 hover:text-cyan-400 cursor-pointer" onClick={() => setSelectedCategoryFilter('Generadores')}>
                      <span className="text-blue-400">•</span> Generadores
                    </li>
                  </ul>
                </div>

                {/* SERVICIOS CARD */}
                <div className="bg-[#0e1424] p-3.5 md:p-4 rounded-xl border border-[#1e293b] shadow-md space-y-1.5 hover:border-indigo-500/50 transition-all">
                  <h3 className="font-black text-xs md:text-sm text-indigo-400 uppercase tracking-tight flex items-center gap-1.5 font-mono">
                    <Award size={15} /> SERVICIOS
                  </h3>
                  <ul className="space-y-1 text-[11px] text-slate-200 font-semibold">
                    <li className="flex items-center gap-1.5 hover:text-indigo-400 cursor-pointer" onClick={() => setSelectedCategoryFilter('Asesoría')}>
                      <span className="text-indigo-400">•</span> Asesoría
                    </li>
                    <li className="flex items-center gap-1.5 hover:text-indigo-400 cursor-pointer" onClick={() => setSelectedCategoryFilter('Especialización')}>
                      <span className="text-indigo-400">•</span> Especialización
                    </li>
                    <li className="flex items-center gap-1.5 hover:text-indigo-400 cursor-pointer" onClick={() => setSelectedCategoryFilter('Peritaciones')}>
                      <span className="text-indigo-400">•</span> Peritaciones
                    </li>
                  </ul>
                </div>

                {/* TELEFONÍA CARD */}
                <div className="bg-[#0e1424] p-3.5 md:p-4 rounded-xl border border-[#1e293b] shadow-md space-y-1.5 hover:border-emerald-500/50 transition-all">
                  <h3 className="font-black text-xs md:text-sm text-emerald-400 uppercase tracking-tight flex items-center gap-1.5 font-mono">
                    <Smartphone size={15} /> TELEFONÍA
                  </h3>
                  <ul className="space-y-1 text-[11px] text-slate-200 font-semibold">
                    <li className="flex items-center gap-1.5 hover:text-emerald-400 cursor-pointer" onClick={() => setSelectedCategoryFilter('Celulares')}>
                      <span className="text-emerald-400">•</span> Celulares
                    </li>
                    <li className="flex items-center gap-1.5 hover:text-emerald-400 cursor-pointer" onClick={() => setSelectedCategoryFilter('Tablets')}>
                      <span className="text-emerald-400">•</span> Tablets
                    </li>
                    <li className="flex items-center gap-1.5 hover:text-emerald-400 cursor-pointer" onClick={() => setSelectedCategoryFilter('Tablets infantiles')}>
                      <span className="text-emerald-400">•</span> Tablets infantiles
                    </li>
                  </ul>
                </div>

              </div>

              {/* COLUMN 2 */}
              <div className="space-y-3.5">
                
                {/* HOGAR CARD */}
                <div className="bg-[#0e1424] p-3.5 md:p-4 rounded-xl border border-[#1e293b] shadow-md space-y-1.5 hover:border-orange-500/50 transition-all">
                  <h3 className="font-black text-xs md:text-sm text-orange-400 uppercase tracking-tight flex items-center gap-1.5 font-mono">
                    <Utensils size={15} /> HOGAR
                  </h3>
                  <ul className="space-y-1 text-[11px] text-slate-200 font-semibold">
                    <li className="flex items-center gap-1.5 hover:text-orange-400 cursor-pointer" onClick={() => setSelectedCategoryFilter('Iluminación')}>
                      <span>💡</span> Iluminación
                    </li>
                    <li className="flex items-center gap-1.5 hover:text-orange-400 cursor-pointer" onClick={() => setSelectedCategoryFilter('Cocina')}>
                      <span>🍳</span> Cocina
                    </li>
                    <li className="flex items-center gap-1.5 hover:text-orange-400 cursor-pointer" onClick={() => setSelectedCategoryFilter('Domotica')}>
                      <span>🏠</span> Domotica
                    </li>
                    <li className="flex items-center gap-1.5 hover:text-orange-400 cursor-pointer" onClick={() => setSelectedCategoryFilter('Entretenimiento')}>
                      <span>🎮</span> Entretenimiento
                    </li>
                  </ul>
                </div>

                {/* SOFTWARE CARD */}
                <div className="bg-[#0e1424] p-3.5 md:p-4 rounded-xl border border-[#1e293b] shadow-md space-y-1.5 hover:border-blue-500/50 transition-all">
                  <h3 className="font-black text-xs md:text-sm text-blue-400 uppercase tracking-tight flex items-center gap-1.5 font-mono">
                    <Code size={15} /> SOFTWARE
                  </h3>
                  <ul className="space-y-1 text-[11px] text-slate-200 font-semibold">
                    <li className="flex items-center gap-1.5 hover:text-blue-400 cursor-pointer" onClick={() => setSelectedCategoryFilter('Automatización')}>
                      <span className="text-blue-400">•</span> Automatización
                    </li>
                    <li className="flex items-center gap-1.5 hover:text-blue-400 cursor-pointer" onClick={() => setSelectedCategoryFilter('Tienda en línea')}>
                      <span className="text-blue-400">•</span> Tienda en línea
                    </li>
                    <li className="flex items-center gap-1.5 hover:text-blue-400 cursor-pointer" onClick={() => setSelectedCategoryFilter('Systems')}>
                      <span className="text-blue-400">•</span> Systems
                    </li>
                  </ul>
                </div>

                {/* COMPUTACIÓN CARD */}
                <div className="bg-[#0e1424] p-3.5 md:p-4 rounded-xl border border-[#1e293b] shadow-md space-y-1.5 hover:border-purple-500/50 transition-all">
                  <h3 className="font-black text-xs md:text-sm text-purple-400 uppercase tracking-tight flex items-center gap-1.5 font-mono">
                    <Laptop size={15} /> COMPUTACIÓN
                  </h3>
                  <ul className="space-y-1 text-[11px] text-slate-200 font-semibold">
                    <li className="flex items-center gap-1.5 hover:text-purple-400 cursor-pointer" onClick={() => setSelectedCategoryFilter('Laptops')}>
                      <span className="text-purple-400">•</span> Laptops
                    </li>
                    <li className="flex items-center gap-1.5 hover:text-purple-400 cursor-pointer" onClick={() => setSelectedCategoryFilter('Portátiles PC')}>
                      <span className="text-purple-400">•</span> Portátiles PC
                    </li>
                    <li className="flex items-center gap-1.5 hover:text-purple-400 cursor-pointer" onClick={() => setSelectedCategoryFilter('Monitores')}>
                      <span className="text-purple-400">•</span> Monitores
                    </li>
                    <li className="flex items-center gap-1.5 hover:text-purple-400 cursor-pointer" onClick={() => setSelectedCategoryFilter('Impresoras')}>
                      <span className="text-purple-400">•</span> Impresoras
                    </li>
                    <li className="flex items-center gap-1.5 hover:text-purple-400 cursor-pointer" onClick={() => setSelectedCategoryFilter('Mini PC')}>
                      <span className="text-purple-400">•</span> Mini PC
                    </li>
                  </ul>
                </div>

              </div>

              {/* COLUMN 3 */}
              <div className="space-y-3.5">
                
                {/* TECNOLOGÍA RESIDENCIAL CARD */}
                <div className="bg-[#0e1424] p-3.5 md:p-4 rounded-xl border border-[#1e293b] shadow-md space-y-1.5 hover:border-teal-500/50 transition-all">
                  <h3 className="font-black text-xs md:text-sm text-teal-400 uppercase tracking-tight flex items-center gap-1.5 font-mono">
                    <Shield size={15} /> TECNOLOGÍA RESIDENCIAL
                  </h3>
                  <ul className="space-y-1 text-[11px] text-slate-200 font-semibold">
                    <li className="flex items-center gap-1.5 hover:text-teal-400 cursor-pointer" onClick={() => setSelectedCategoryFilter('Portones')}>
                      <span className="text-teal-400">•</span> Portones
                    </li>
                    <li className="flex items-center gap-1.5 hover:text-teal-400 cursor-pointer" onClick={() => setSelectedCategoryFilter('Alarmas')}>
                      <span className="text-teal-400">•</span> Alarmas
                    </li>
                    <li className="flex items-center gap-1.5 hover:text-teal-400 cursor-pointer" onClick={() => setSelectedCategoryFilter('Perimetrales')}>
                      <span className="text-teal-400">•</span> Perimetrales
                    </li>
                  </ul>
                </div>

                {/* ELECTRÓNICA CARD */}
                <div className="bg-[#0e1424] p-3.5 md:p-4 rounded-xl border border-[#1e293b] shadow-md space-y-1.5 hover:border-yellow-500/50 transition-all">
                  <h3 className="font-black text-xs md:text-sm text-yellow-400 uppercase tracking-tight flex items-center gap-1.5 font-mono">
                    <Zap size={15} /> ELECTRÓNICA
                  </h3>
                  <ul className="space-y-1 text-[11px] text-slate-200 font-semibold">
                    <li className="flex items-center gap-1.5 hover:text-yellow-400 cursor-pointer" onClick={() => setSelectedCategoryFilter('Microcomputadores')}>
                      <span className="text-yellow-400">•</span> Microcomputadores
                    </li>
                    <li className="flex items-center gap-1.5 hover:text-yellow-400 cursor-pointer" onClick={() => setSelectedCategoryFilter('Cables')}>
                      <span className="text-yellow-400">•</span> Cables
                    </li>
                    <li className="flex items-center gap-1.5 hover:text-yellow-400 cursor-pointer" onClick={() => setSelectedCategoryFilter('Adaptadores')}>
                      <span className="text-yellow-400">•</span> Adaptadores
                    </li>
                    <li className="flex items-center gap-1.5 hover:text-yellow-400 cursor-pointer" onClick={() => setSelectedCategoryFilter('Cargadores')}>
                      <span className="text-yellow-400">•</span> Cargadores
                    </li>
                  </ul>
                </div>

                {/* TODOS LOS ARTÍCULOS BOX */}
                <div className="bg-[#0e1424] border border-[#1e293b] rounded-xl p-3.5 md:p-4 shadow-md space-y-2">
                  <button
                    onClick={() => setIsTodosArticulosOpen(!isTodosArticulosOpen)}
                    className="w-full flex items-center justify-between text-left font-black text-xs md:text-sm text-cyan-400 uppercase tracking-tight font-mono"
                  >
                    <span>TODOS LOS ARTÍCULOS</span>
                    <ChevronDown size={16} className={`transition-transform ${isTodosArticulosOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isTodosArticulosOpen && (
                    <div className="pt-1.5 border-t border-[#1e293b] space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      <ul className="space-y-0.5 text-[11px] text-slate-300 font-medium">
                        {allItemsList.map((item, idx) => (
                          <li
                            key={idx}
                            onClick={() => setSelectedCategoryFilter(item)}
                            className="hover:text-cyan-400 cursor-pointer flex items-center gap-1"
                          >
                            <span className="text-blue-400">-</span> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* 🔵 VIBRANT ELECTRIC COBALT BLUE PILL BUTTONS */}
                <div className="space-y-1.5 pt-0.5">

                  <button
                    onClick={() => setModalType('nosotros')}
                    className="w-full py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-[#0066ff] via-[#1d4ed8] to-[#0052cc] hover:from-[#0052cc] hover:to-[#1e40af] text-white font-bold text-[11px] uppercase tracking-wider flex items-center justify-between transition-all shadow-lg shadow-blue-600/30 border border-blue-400/40 active:scale-98"
                  >
                    <span>Sobre nosotros</span>
                    <ChevronDown size={14} />
                  </button>

                  <button
                    onClick={() => setModalType('ubicacion')}
                    className="w-full py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-[#0066ff] via-[#1d4ed8] to-[#0052cc] hover:from-[#0052cc] hover:to-[#1e40af] text-white font-bold text-[11px] uppercase tracking-wider flex items-center justify-between transition-all shadow-lg shadow-blue-600/30 border border-blue-400/40 active:scale-98"
                  >
                    <span>Ubicación</span>
                    <ChevronDown size={14} />
                  </button>

                  <button
                    onClick={() => setModalType('referencias')}
                    className="w-full py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-[#0066ff] via-[#1d4ed8] to-[#0052cc] hover:from-[#0052cc] hover:to-[#1e40af] text-white font-bold text-[11px] uppercase tracking-wider flex items-center justify-between transition-all shadow-lg shadow-blue-600/30 border border-blue-400/40 active:scale-98"
                  >
                    <span>Referencias</span>
                    <ChevronDown size={14} />
                  </button>

                  <button
                    onClick={() => setModalType('contacto')}
                    className="w-full py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-[#0066ff] via-[#1d4ed8] to-[#0052cc] hover:from-[#0052cc] hover:to-[#1e40af] text-white font-bold text-[11px] uppercase tracking-wider flex items-center justify-between transition-all shadow-lg shadow-blue-600/30 border border-blue-400/40 active:scale-98"
                  >
                    <span>Contacto</span>
                    <ChevronDown size={14} />
                  </button>

                  <button
                    onClick={() => setIsTodosArticulosOpen(!isTodosArticulosOpen)}
                    className="w-full py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-[#0066ff] via-[#1d4ed8] to-[#0052cc] hover:from-[#0052cc] hover:to-[#1e40af] text-white font-bold text-[11px] uppercase tracking-wider flex items-center justify-between transition-all shadow-lg shadow-blue-600/30 border border-blue-400/40 active:scale-98"
                  >
                    <span>Todos los Artículos</span>
                    <ChevronDown size={14} />
                  </button>

                </div>

              </div>

            </div>

          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════ */}
        {/* TAB 2: LANDING PAGES VIEW                                    */}
        {/* ═════════════════════════════════════════════════════════════ */}
        {!searchQuery.trim() && activeTab === 'landings' && (
          <div className="space-y-4">
            <div className="bg-[#0e1424] p-4 rounded-xl border border-[#1e293b] shadow-md">
              <h2 className="text-base md:text-lg font-black text-white uppercase tracking-tight mb-0.5">
                Catálogo de Landing Pages Especializadas
              </h2>
              <p className="text-[11px] text-blue-300 font-medium">
                Explora las secciones interactivas creadas para líneas de productos de alta demanda
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {landingPagesList.map((lp, idx) => (
                <Link
                  key={idx}
                  href={lp.url}
                  className="bg-[#0e1424] border border-[#1e293b] p-3.5 rounded-xl shadow-md hover:border-cyan-400 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xl">{lp.image}</span>
                      <span className="text-[8px] font-black font-mono bg-blue-950 text-cyan-300 px-2 py-0.5 rounded-full border border-blue-500/40">
                        {lp.tag}
                      </span>
                    </div>
                    <h3 className="font-black text-xs text-white uppercase tracking-tight group-hover:text-cyan-400 transition-colors mb-0.5">
                      {lp.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 leading-snug font-medium mb-2.5">
                      {lp.sub}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-[#1e293b] text-[11px] font-bold text-cyan-400">
                    <span>Ver Landing Page</span>
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════ */}
        {/* TAB 3: OFERTAS VIEW                                          */}
        {/* ═════════════════════════════════════════════════════════════ */}
        {!searchQuery.trim() && activeTab === 'ofertas' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-[#ff5733] text-white p-4 rounded-xl shadow-lg border border-blue-400/30">
              <h2 className="text-base md:text-lg font-black uppercase tracking-tight mb-0.5">
                🔥 Promociones & Kits de Oferta Especial
              </h2>
              <p className="text-[11px] text-cyan-100 font-medium">
                Descuentos directos en equipos seleccionados con asesoría e instalación en todo Ecuador
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              
              {/* Promo Kit 1 */}
              <div className="bg-[#0e1424] border border-[#1e293b] p-4 rounded-xl shadow-md space-y-3">
                <div className="inline-block bg-blue-950 text-cyan-300 font-mono text-[9px] font-black px-2 py-0.5 rounded-full uppercase border border-blue-500/30">
                  KIT OFERTA #1 GAMING
                </div>
                <h3 className="font-black text-sm md:text-base text-white uppercase">
                  Consola PS5 Slim 1TB + Mando Extra DualSense
                </h3>
                <p className="text-[11px] text-slate-300 leading-snug">
                  Incluye consola original sellada de paquete + 2 mandos DualSense originales + cable HDMI 2.1 de alta velocidad.
                </p>
                <div className="flex items-center justify-between pt-2.5 border-t border-[#1e293b]">
                  <span className="text-lg md:text-xl font-black text-cyan-400">$755.00</span>
                  <a
                    href="https://wa.me/593969043453?text=Hola%20ATOMIC!%20Deseo%20cotizar%20el%20KIT%20OFERTA%20PS5%20Slim%20+%20Mando"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] uppercase rounded-lg transition-all shadow-md"
                  >
                    💬 Pedir WhatsApp
                  </a>
                </div>
              </div>

              {/* Promo Kit 2 */}
              <div className="bg-[#0e1424] border border-[#1e293b] p-4 rounded-xl shadow-md space-y-3">
                <div className="inline-block bg-blue-950 text-cyan-300 font-mono text-[9px] font-black px-2 py-0.5 rounded-full uppercase border border-blue-500/30">
                  KIT OFERTA #2 SEGURIDAD
                </div>
                <h3 className="font-black text-sm md:text-base text-white uppercase">
                  Control de Acceso Biométrico ZKTECO + Cerradura
                </h3>
                <p className="text-[11px] text-slate-300 leading-snug">
                  Lectura facial, huella dactilar, tarjetas RFID y apertura desde la App para puertas de vidrio o madera.
                </p>
                <div className="flex items-center justify-between pt-2.5 border-t border-[#1e293b]">
                  <span className="text-lg md:text-xl font-black text-cyan-400">$185.00</span>
                  <a
                    href="https://wa.me/593969043453?text=Hola%20ATOMIC!%20Deseo%20cotizar%20el%20Kit%20ZKTECO%20Biometrico"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] uppercase rounded-lg transition-all shadow-md"
                  >
                    💬 Pedir WhatsApp
                  </a>
                </div>
              </div>

              {/* Promo Kit 3 */}
              <div className="bg-[#0e1424] border border-[#1e293b] p-4 rounded-xl shadow-md space-y-3">
                <div className="inline-block bg-blue-950 text-cyan-300 font-mono text-[9px] font-black px-2 py-0.5 rounded-full uppercase border border-blue-500/30">
                  KIT OFERTA #3 COCINA
                </div>
                <h3 className="font-black text-sm md:text-base text-white uppercase">
                  Encimera a Gas 4 Hornillas + Horno Empotrable
                </h3>
                <p className="text-[11px] text-slate-300 leading-snug">
                  Línea de lujo en acero inoxidable con encendido electrónico y dimensiones estándar para cocina.
                </p>
                <div className="flex items-center justify-between pt-2.5 border-t border-[#1e293b]">
                  <span className="text-lg md:text-xl font-black text-cyan-400">$420.00</span>
                  <a
                    href="https://wa.me/593969043453?text=Hola%20ATOMIC!%20Deseo%20cotizar%20el%20Kit%20Encimera%20+%20Horno"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] uppercase rounded-lg transition-all shadow-md"
                  >
                    💬 Pedir WhatsApp
                  </a>
                </div>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* ═════════════════════════════════════════════════════════════ */}
      {/* 🍔 HAMBURGER LEFT DRAWER SLIDE-OVER                          */}
      {/* ═════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isHamburgerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsHamburgerOpen(false)}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            />

            {/* Left Drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="fixed top-0 left-0 bottom-0 z-50 w-72 max-w-[80vw] bg-[#090d16] text-white shadow-2xl flex flex-col justify-between overflow-y-auto border-r border-[#1e293b]"
            >
              <div className="p-4 space-y-4">

                {/* Drawer Header */}
                <div className="flex items-center justify-between pb-2.5 border-b border-[#1e293b]">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#ff5733] flex items-center justify-center text-white font-black text-[11px]">
                      A
                    </div>
                    <div>
                      <h3 className="font-black text-xs text-white leading-none">ATOMIC</h3>
                      <p className="text-[9px] text-cyan-400 font-bold">Tecnología, Industria y Hogar</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsHamburgerOpen(false)}
                    className="p-1 rounded-lg bg-slate-900 text-cyan-300"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Hamburger Navigation Sections */}
                <div className="space-y-2.5">

                  {/* Section 1: Todos los Artículos (Default Expanded Accordion) */}
                  <div className="border border-[#1e293b] rounded-lg p-2.5 bg-[#0e1424]">
                    <button
                      onClick={() => setIsTodosArticulosOpen(!isTodosArticulosOpen)}
                      className="w-full flex items-center justify-between font-black text-[11px] text-cyan-400 uppercase font-mono"
                    >
                      <span>Todos los artículos</span>
                      <ChevronDown size={14} className={`transition-transform ${isTodosArticulosOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isTodosArticulosOpen && (
                      <div className="mt-2 pt-1.5 border-t border-[#1e293b] space-y-1 max-h-44 overflow-y-auto pr-1">
                        {allItemsList.map((item, idx) => (
                          <div
                            key={idx}
                            onClick={() => {
                              setSelectedCategoryFilter(item);
                              setIsHamburgerOpen(false);
                            }}
                            className="text-[11px] text-slate-300 hover:text-cyan-400 font-medium cursor-pointer py-0.5 px-1.5 rounded hover:bg-slate-800/50"
                          >
                            • {item}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Section 2: Sobre Nosotros */}
                  <button
                    onClick={() => { setModalType('nosotros'); setIsHamburgerOpen(false); }}
                    className="w-full text-left p-2.5 rounded-lg bg-[#0e1424] hover:bg-slate-800 text-white font-bold text-[11px] uppercase flex items-center justify-between border border-[#1e293b]"
                  >
                    <span>Sobre nosotros</span>
                    <ChevronRight size={14} />
                  </button>

                  {/* Section 3: Ubicación */}
                  <button
                    onClick={() => { setModalType('ubicacion'); setIsHamburgerOpen(false); }}
                    className="w-full text-left p-2.5 rounded-lg bg-[#0e1424] hover:bg-slate-800 text-white font-bold text-[11px] uppercase flex items-center justify-between border border-[#1e293b]"
                  >
                    <span>Ubicación</span>
                    <ChevronRight size={14} />
                  </button>

                  {/* Section 4: Referencias */}
                  <button
                    onClick={() => { setModalType('referencias'); setIsHamburgerOpen(false); }}
                    className="w-full text-left p-2.5 rounded-lg bg-[#0e1424] hover:bg-slate-800 text-white font-bold text-[11px] uppercase flex items-center justify-between border border-[#1e293b]"
                  >
                    <span>Referencias</span>
                    <ChevronRight size={14} />
                  </button>

                  {/* Section 5: Contacto */}
                  <button
                    onClick={() => { setModalType('contacto'); setIsHamburgerOpen(false); }}
                    className="w-full text-left p-2.5 rounded-lg bg-[#0e1424] hover:bg-slate-800 text-white font-bold text-[11px] uppercase flex items-center justify-between border border-[#1e293b]"
                  >
                    <span>Contacto</span>
                    <ChevronRight size={14} />
                  </button>

                </div>

              </div>

              {/* Drawer Footer */}
              <div className="p-2.5 border-t border-[#1e293b] bg-[#05070c] text-center">
                <p className="text-[9px] text-cyan-400 font-mono uppercase font-bold">
                  ATOMIC © {new Date().getFullYear()} · Ecuador
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ═════════════════════════════════════════════════════════════ */}
      {/* 📱 FLOATING BOTTOM SOCIAL BAR (WHATSAPP, IG, MAP, FB, TIKTOK)  */}
      {/* ═════════════════════════════════════════════════════════════ */}
      <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 bg-[#090d16]/95 backdrop-blur-md border border-[#1e293b] rounded-full px-3 py-1 shadow-2xl flex items-center gap-2.5">
        
        {/* WhatsApp */}
        <a
          href="https://wa.me/593969043453?text=Hola%20ATOMIC!%20Deseo%20informaci%C3%B3n."
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
          title="WhatsApp"
        >
          <div className="w-6.5 h-6.5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm text-xs">
            💬
          </div>
          <span className="hidden sm:inline">WhatsApp</span>
        </a>

        {/* Instagram */}
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1 text-[11px] font-bold text-pink-400 hover:text-pink-300 transition-colors"
          title="Instagram"
        >
          <div className="w-6.5 h-6.5 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shadow-sm text-xs">
            📷
          </div>
          <span className="hidden sm:inline">Instagram</span>
        </a>

        {/* Ubicación */}
        <button
          onClick={() => setModalType('ubicacion')}
          className="flex items-center gap-1 text-[11px] font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
          title="Ubicación"
        >
          <div className="w-6.5 h-6.5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-sm text-xs">
            📍
          </div>
          <span className="hidden sm:inline">Ubicación</span>
        </button>

        {/* Facebook */}
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noreferrer"
          className="w-6.5 h-6.5 rounded-full bg-blue-700 text-white flex items-center justify-center shadow-sm hover:scale-105 transition-transform"
          title="Facebook"
        >
          <span className="font-black text-[10px]">f</span>
        </a>

        {/* TikTok */}
        <a
          href="https://tiktok.com"
          target="_blank"
          rel="noreferrer"
          className="w-6.5 h-6.5 rounded-full bg-slate-900 border border-slate-700 text-white flex items-center justify-center shadow-sm hover:scale-105 transition-transform"
          title="TikTok"
        >
          <span className="font-black text-[9px]">🎵</span>
        </a>

      </div>

      {/* ═════════════════════════════════════════════════════════════ */}
      {/* 🪟 INTERACTIVE MODALS FOR PILL BUTTONS & ICON ACTIONS         */}
      {/* ═════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {modalType && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalType(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-md bg-[#090d16] text-white rounded-2xl p-5 shadow-2xl border border-[#1e293b] max-h-[85vh] overflow-y-auto"
            >
              <button
                onClick={() => setModalType(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-900 text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>

              {/* MODAL 1: SOBRE NOSOTROS */}
              {modalType === 'nosotros' && (
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-900/60 text-cyan-400 border border-blue-500/30 flex items-center justify-center">
                    <Award size={20} />
                  </div>
                  <h3 className="text-lg font-black uppercase text-white font-mono">Sobre Nosotros — ATOMIC</h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    ATOMIC es una marca ecuatoriana especializada en <strong>Tecnología, Industria y Hogar</strong>. Comercializamos e importamos equipos biométricos, automatización de accesos, consolas gaming, electrodomésticos de cocina y soluciones de software a medida.
                  </p>
                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    <div className="p-2.5 rounded-lg bg-[#0e1424] border border-[#1e293b] text-center">
                      <span className="block font-black text-base text-cyan-400 font-mono">+10,000</span>
                      <span className="text-[9px] text-slate-400 uppercase font-bold">Clientes Satisfechos</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#0e1424] border border-[#1e293b] text-center">
                      <span className="block font-black text-base text-cyan-400 font-mono">100%</span>
                      <span className="text-[9px] text-slate-400 uppercase font-bold">Garantía Directa</span>
                    </div>
                  </div>
                </div>
              )}

              {/* MODAL 2: UBICACIÓN */}
              {modalType === 'ubicacion' && (
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-900/60 text-cyan-400 border border-blue-500/30 flex items-center justify-center">
                    <MapPin size={20} />
                  </div>
                  <h3 className="text-lg font-black uppercase text-white font-mono">Nuestra Ubicación & Cobertura</h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    Despachamos pedidos diariamente a todo el Ecuador con cobertura garantizada en las principales provincias.
                  </p>
                  <div className="space-y-2 pt-1 text-xs">
                    <div className="p-2.5 rounded-lg bg-[#0e1424] border border-[#1e293b] flex items-center gap-2.5">
                      <MapPin className="text-[#ff5733] shrink-0" size={16} />
                      <div>
                        <strong className="block text-white">Matriz Principal:</strong>
                        <span className="text-slate-400">Quito, Ecuador — Envíos a Nivel Nacional</span>
                      </div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#0e1424] border border-[#1e293b] flex items-center gap-2.5">
                      <Truck className="text-cyan-400 shrink-0" size={16} />
                      <div>
                        <strong className="block text-white">Agencias de Envío:</strong>
                        <span className="text-slate-400">Servientrega, Transporte Interprovincial & Directo</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* MODAL 3: REFERENCIAS */}
              {modalType === 'referencias' && (
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-950/60 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                    <Star size={20} />
                  </div>
                  <h3 className="text-lg font-black uppercase text-white font-mono">Referencias & Testimonios</h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    Conoce las valoraciones reales de nuestros clientes en todo Ecuador.
                  </p>
                  <div className="space-y-2 pt-1">
                    <div className="p-2.5 rounded-lg bg-[#0e1424] border border-[#1e293b] text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <strong className="text-white">Carlos M. (Quito)</strong>
                        <span className="text-amber-400 text-xs">★★★★★</span>
                      </div>
                      <p className="text-slate-300 text-[11px]">
                        &quot;Compré el Kit de Control de Acceso ZKTECO para mi edificio. Llegó al día siguiente y la asesoría por WhatsApp fue excelente.&quot;
                      </p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#0e1424] border border-[#1e293b] text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <strong className="text-white">Sofía V. (Guayaquil)</strong>
                        <span className="text-amber-400 text-xs">★★★★★</span>
                      </div>
                      <p className="text-slate-300 text-[11px]">
                        &quot;Mi PS5 Slim llegó 100% nueva y sellada de paquete. Total confianza con ATOMIC.&quot;
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* MODAL 4: CONTACTO */}
              {modalType === 'contacto' && (
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                    <Phone size={20} />
                  </div>
                  <h3 className="text-lg font-black uppercase text-white font-mono">Canales de Contacto Directo</h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    Comunícate con nuestro equipo comercial para cotizaciones o soporte técnico.
                  </p>
                  <div className="space-y-2 pt-1">
                    <a
                      href="https://wa.me/593969043453?text=Hola%20ATOMIC!%20Deseo%20informaci%C3%B3n."
                      target="_blank"
                      rel="noreferrer"
                      className="w-full p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase flex items-center justify-center gap-2 transition-all shadow-md"
                    >
                      <MessageCircle size={16} /> Chatear por WhatsApp (+593 96 904 3453)
                    </a>
                    <div className="p-2.5 rounded-lg bg-[#0e1424] border border-[#1e293b] text-xs font-mono space-y-1">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Mail size={13} /> ventas@atomic.com.ec
                      </div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <Phone size={13} /> +593 96 904 3453
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* MODAL 5: CART */}
              {modalType === 'cart' && (
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-900/60 text-cyan-400 border border-blue-500/30 flex items-center justify-center">
                    <ShoppingCart size={20} />
                  </div>
                  <h3 className="text-lg font-black uppercase text-white font-mono">Carrito de Compras</h3>
                  <p className="text-xs text-slate-300 font-medium">
                    Tienes <strong>{totalItems}</strong> productos agregados al carrito.
                  </p>
                  <div className="pt-1">
                    <Link
                      href="/web/cart"
                      onClick={() => setModalType(null)}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase rounded-xl transition-all text-center block shadow-md"
                    >
                      Ir a Finalizar Compra
                    </Link>
                  </div>
                </div>
              )}

              {/* MODAL 6: PROFILE */}
              {modalType === 'profile' && (
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-900/60 text-cyan-400 border border-blue-500/30 flex items-center justify-center">
                    <User size={20} />
                  </div>
                  <h3 className="text-lg font-black uppercase text-white font-mono">Mi Cuenta ATOMIC</h3>
                  <p className="text-xs text-slate-300 font-medium">
                    Inicia sesión para ver tu historial de pedidos y guardar cotizaciones.
                  </p>
                  <div className="pt-1">
                    <Link
                      href="/login"
                      onClick={() => setModalType(null)}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase rounded-xl transition-all text-center block shadow-md"
                    >
                      Iniciar Sesión / Registro
                    </Link>
                  </div>
                </div>
              )}

              {/* MODAL 7: ENVIOS */}
              {modalType === 'envios' && (
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-900/60 text-cyan-400 border border-blue-500/30 flex items-center justify-center">
                    <Truck size={20} />
                  </div>
                  <h3 className="text-lg font-black uppercase text-white font-mono">Seguimiento & Envíos</h3>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed">
                    Realizamos envíos a todo Ecuador con número de guía en tiempo real para rastrear tu paquete.
                  </p>
                  <div className="p-2.5 rounded-lg bg-[#0e1424] border border-[#1e293b] text-xs font-mono">
                    <span className="block font-bold text-cyan-300 mb-0.5">Empresas Aliadas:</span>
                    <span className="text-slate-300">Servientrega · Envíos Express · Cooperativas</span>
                  </div>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}
