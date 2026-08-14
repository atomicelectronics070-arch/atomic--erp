"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import {
  Menu, Search, User, ShoppingCart, Truck, X, ChevronDown, ChevronRight,
  ExternalLink, MapPin, Phone, Mail, Award, Shield, Star, Sparkles,
  Bot, Laptop, Smartphone, Home as HomeIcon, Building, Factory, Cpu,
  Gamepad2, Utensils, Zap, Code, Lock, ShieldCheck, CheckCircle2, MessageCircle
} from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useCart } from "@/context/CartContext"
import CategoryBadge3D from "@/components/ui/CategoryBadge3D"
import HeroCanvas3D from "@/components/ui/HeroCanvas3D"

/* ── ATOMIC ATOM LOGO SVG (COMPACT & METALLIC) ── */
function AtomicLogoSVG() {
  return (
    <svg width="34" height="34" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]">
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

  // Auto-close hamburger menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsHamburgerOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Filtered Products for Live Search & Category Filter
  const filteredProducts = useMemo(() => {
    let result = initialProducts || []
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(p => 
        p.name?.toLowerCase().includes(q) || 
        p.category?.name?.toLowerCase().includes(q) || 
        p.description?.toLowerCase().includes(q)
      )
    }
    if (selectedCategoryFilter) {
      const catQ = selectedCategoryFilter.toLowerCase()
      result = result.filter(p => p.category?.name?.toLowerCase().includes(catQ) || p.name?.toLowerCase().includes(catQ))
    }
    return result
  }, [initialProducts, searchQuery, selectedCategoryFilter])

  // 12 Top Category Grid Items with Real-Time WebGL 3D Badges
  const categoryGridItems = [
    { id: 'industrial', title: 'INDUSTRIAL', sub: 'Automatización', href: '#industrial' },
    { id: 'servicios', title: 'SERVICIOS', sub: 'Asesoría', href: '#servicios' },
    { id: 'computacion', title: 'COMPUTACIÓN', sub: 'Laptops', href: '/web/cpus' },
    { id: 'telefonia', title: 'TELEFONÍA', sub: 'Celulares', href: '/web/phones' },
    { id: 'minipc', title: 'MINI PC', sub: 'Compactos', href: '/web/cpus' },
    { id: 'monitores', title: 'MONITORES', sub: 'Gaming HD', href: '/web/cpus' },
    { id: 'tablets-infantiles', title: 'TABLETS NIÑOS', sub: 'Edición Kids', href: '/web/phones' },
    { id: 'portones-automaticos', title: 'PORTONES', sub: 'Control Acceso', href: '/web/intercomunicacion' },
    { id: 'hogar', title: 'HOGAR', sub: 'Cocina & Luz', href: '/web/cocinas' },
    { id: 'software', title: 'SOFTWARE', sub: 'Systems & Web', href: '/web/software' },
    { id: 'tecnologia-residencial', title: 'TECNOLOGÍA RES.', sub: 'Alarmas', href: '/web/conjuntos-smart' },
    { id: 'electronica', title: 'ELECTRÓNICA', sub: 'Cables & Micro', href: '#electronica' },
  ]

  // Landing Pages Data (Created over last 3-4 months)
  const landingPagesList = [
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
    <div className="w-full bg-[#06080e] min-h-screen text-slate-100 font-sans selection:bg-blue-600 selection:text-white pb-20 relative overflow-x-hidden">

      {/* 🔮 REAL-TIME 3D WEBGL PARTICLE FIELD BACKGROUND */}
      <HeroCanvas3D />

      {/* ═════════════════════════════════════════════════════════════ */}
      {/* 👑 TOP STANDALONE SLOGAN HEADER BAR (OBSIDIAN & NEON SAPPHIRE) */}
      {/* ═════════════════════════════════════════════════════════════ */}
      <div className="relative z-10 w-full bg-gradient-to-r from-[#04060b] via-[#091428] to-[#04060b] text-cyan-300 text-[11px] md:text-xs font-black uppercase tracking-[0.35em] text-center py-2 px-4 border-b border-blue-500/40 shadow-[0_4px_20px_rgba(0,102,255,0.25)] font-mono flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#38bdf8]" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-100 to-blue-400 drop-shadow-[0_0_12px_rgba(56,189,248,0.5)]">
          TECNOLOGÍA, INDUSTRIA Y HOGAR
        </span>
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#38bdf8]" />
      </div>

      {/* ═════════════════════════════════════════════════════════════ */}
      {/* 🍅 HEADER BAR: LIGHT CORAL TOMATO BRANDED NAV (#FF5733 / #FF4D4D) */}
      {/* ═════════════════════════════════════════════════════════════ */}
      <header className="relative z-10 sticky top-0 z-50 bg-gradient-to-r from-[#ff6b4a] via-[#ff5733] to-[#ff4136] text-white shadow-xl border-b border-[#e04322] px-3 md:px-5 py-1.5 md:py-2">
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
      {/* 📌 MINI TABS NAVIGATION BAR: CATEGORIAS | LANDING PAGES | OFERTAS */}
      {/* ═════════════════════════════════════════════════════════════ */}
      <nav className="relative z-10 bg-[#090e1a]/90 backdrop-blur-md border-b border-blue-500/25 shadow-md sticky top-[45px] md:top-[51px] z-40 px-3 py-1.5">
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
      {/* MAIN CONTAINER AREA WITH 3D GLASS TILT CARDS                  */}
      {/* ═════════════════════════════════════════════════════════════ */}
      <main className="relative z-10 max-w-6xl mx-auto px-3 md:px-5 pt-3">

        {/* SEARCH OVERRIDE RESULTS VIEW */}
        {searchQuery.trim() ? (
          <div className="bg-[#0f172a]/90 backdrop-blur-md p-4 rounded-xl shadow-xl border border-blue-500/30 mb-6">
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
        {/* TAB 1: CATEGORIAS VIEW WITH 3D WEBGL INTERACTIVE BADGES       */}
        {/* ═════════════════════════════════════════════════════════════ */}
        {!searchQuery.trim() && activeTab === 'categorias' && (
          <div className="space-y-4">

            {/* TOP 12 CATEGORY RIBBON/GRID WITH REAL-TIME 3D WEBGL BADGES */}
            <div className="flex sm:grid sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-6 gap-2 overflow-x-auto snap-x snap-mandatory pb-1 px-0.5 scrollbar-none">
              {categoryGridItems.map(item => {
                return (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.03, rotateX: 3, rotateY: 3 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => {
                        if (item.href.startsWith('#')) {
                          setSelectedCategoryFilter(item.title)
                        }
                      }}
                      className="w-full min-w-[110px] sm:w-auto shrink-0 snap-start bg-[#0e1424]/90 backdrop-blur-md border border-blue-500/25 p-2 md:p-2.5 rounded-xl shadow-lg hover:shadow-blue-500/20 hover:border-blue-400 transition-all flex flex-col items-center justify-center text-center group cursor-pointer"
                    >
                      {/* REAL-TIME 3D THREE.JS / WEBGL INTERACTIVE BADGE */}
                      <CategoryBadge3D categoryId={item.id} />

                      <h3 className="font-black text-[10px] text-white uppercase tracking-tight group-hover:text-cyan-400 transition-colors line-clamp-1 mt-1">
                        {item.title}
                      </h3>
                      <span className="text-[8px] text-blue-300/80 font-medium line-clamp-1">
                        {item.sub}
                      </span>
                    </Link>
                  </motion.div>
                )
              })}
            </div>

            {/* MAIN 3-COLUMN CONTENT BREAKDOWN (3D OBSIDIAN GLASS TILT CARDS) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-0.5">

              {/* COLUMN 1 */}
              <div className="space-y-3.5">
                
                {/* INDUSTRIAL CARD */}
                <div className="bg-[#0f172a]/90 backdrop-blur-md p-3.5 md:p-4 rounded-xl border border-blue-500/25 shadow-lg space-y-1.5 hover:border-blue-400 transition-all">
                  <h3 className="font-black text-xs md:text-sm text-cyan-400 uppercase tracking-tight flex items-center gap-1.5">
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
                <div className="bg-[#0f172a]/90 backdrop-blur-md p-3.5 md:p-4 rounded-xl border border-blue-500/25 shadow-lg space-y-1.5 hover:border-blue-400 transition-all">
                  <h3 className="font-black text-xs md:text-sm text-cyan-400 uppercase tracking-tight flex items-center gap-1.5">
                    <Award size={15} /> SERVICIOS
                  </h3>
                  <ul className="space-y-1 text-[11px] text-slate-200 font-semibold">
                    <li className="flex items-center gap-1.5 hover:text-cyan-400 cursor-pointer" onClick={() => setSelectedCategoryFilter('Asesoría')}>
                      <span className="text-blue-400">•</span> Asesoría
                    </li>
                    <li className="flex items-center gap-1.5 hover:text-cyan-400 cursor-pointer" onClick={() => setSelectedCategoryFilter('Especialización')}>
                      <span className="text-blue-400">•</span> Especialización
                    </li>
                    <li className="flex items-center gap-1.5 hover:text-cyan-400 cursor-pointer" onClick={() => setSelectedCategoryFilter('Peritaciones')}>
                      <span className="text-blue-400">•</span> Peritaciones
                    </li>
                  </ul>
                </div>

                {/* TELEFONÍA CARD */}
                <div className="bg-[#0f172a]/90 backdrop-blur-md p-3.5 md:p-4 rounded-xl border border-blue-500/25 shadow-lg space-y-1.5 hover:border-blue-400 transition-all">
                  <h3 className="font-black text-xs md:text-sm text-cyan-400 uppercase tracking-tight flex items-center gap-1.5">
                    <Smartphone size={15} /> TELEFONÍA
                  </h3>
                  <ul className="space-y-1 text-[11px] text-slate-200 font-semibold">
                    <li className="flex items-center gap-1.5 hover:text-cyan-400 cursor-pointer" onClick={() => setSelectedCategoryFilter('Celulares')}>
                      <span className="text-blue-400">•</span> Celulares
                    </li>
                    <li className="flex items-center gap-1.5 hover:text-cyan-400 cursor-pointer" onClick={() => setSelectedCategoryFilter('Tablets')}>
                      <span className="text-blue-400">•</span> Tablets
                    </li>
                    <li className="flex items-center gap-1.5 hover:text-cyan-400 cursor-pointer" onClick={() => setSelectedCategoryFilter('Tablets infantiles')}>
                      <span className="text-blue-400">•</span> Tablets infantiles
                    </li>
                  </ul>
                </div>

              </div>

              {/* COLUMN 2 */}
              <div className="space-y-3.5">
                
                {/* HOGAR CARD */}
                <div className="bg-[#0f172a]/90 backdrop-blur-md p-3.5 md:p-4 rounded-xl border border-blue-500/25 shadow-lg space-y-1.5 hover:border-blue-400 transition-all">
                  <h3 className="font-black text-xs md:text-sm text-cyan-400 uppercase tracking-tight flex items-center gap-1.5">
                    <Utensils size={15} /> HOGAR
                  </h3>
                  <ul className="space-y-1 text-[11px] text-slate-200 font-semibold">
                    <li className="flex items-center gap-1.5 hover:text-cyan-400 cursor-pointer" onClick={() => setSelectedCategoryFilter('Iluminación')}>
                      <span>💡</span> Iluminación
                    </li>
                    <li className="flex items-center gap-1.5 hover:text-cyan-400 cursor-pointer" onClick={() => setSelectedCategoryFilter('Cocina')}>
                      <span>🍳</span> Cocina
                    </li>
                    <li className="flex items-center gap-1.5 hover:text-cyan-400 cursor-pointer" onClick={() => setSelectedCategoryFilter('Domotica')}>
                      <span>🏠</span> Domotica
                    </li>
                    <li className="flex items-center gap-1.5 hover:text-cyan-400 cursor-pointer" onClick={() => setSelectedCategoryFilter('Entretenimiento')}>
                      <span>🎮</span> Entretenimiento
                    </li>
                  </ul>
                </div>

                {/* SOFTWARE CARD */}
                <div className="bg-[#0f172a]/90 backdrop-blur-md p-3.5 md:p-4 rounded-xl border border-blue-500/25 shadow-lg space-y-1.5 hover:border-blue-400 transition-all">
                  <h3 className="font-black text-xs md:text-sm text-cyan-400 uppercase tracking-tight flex items-center gap-1.5">
                    <Code size={15} /> SOFTWARE
                  </h3>
                  <ul className="space-y-1 text-[11px] text-slate-200 font-semibold">
                    <li className="flex items-center gap-1.5 hover:text-cyan-400 cursor-pointer" onClick={() => setSelectedCategoryFilter('Automatización')}>
                      <span className="text-blue-400">•</span> Automatización
                    </li>
                    <li className="flex items-center gap-1.5 hover:text-cyan-400 cursor-pointer" onClick={() => setSelectedCategoryFilter('Tienda en línea')}>
                      <span className="text-blue-400">•</span> Tienda en línea
                    </li>
                    <li className="flex items-center gap-1.5 hover:text-cyan-400 cursor-pointer" onClick={() => setSelectedCategoryFilter('Systems')}>
                      <span className="text-blue-400">•</span> Systems
                    </li>
                  </ul>
                </div>

                {/* COMPUTACIÓN CARD */}
                <div className="bg-[#0f172a]/90 backdrop-blur-md p-3.5 md:p-4 rounded-xl border border-blue-500/25 shadow-lg space-y-1.5 hover:border-blue-400 transition-all">
                  <h3 className="font-black text-xs md:text-sm text-cyan-400 uppercase tracking-tight flex items-center gap-1.5">
                    <Laptop size={15} /> COMPUTACIÓN
                  </h3>
                  <ul className="space-y-1 text-[11px] text-slate-200 font-semibold">
                    <li className="flex items-center gap-1.5 hover:text-cyan-400 cursor-pointer" onClick={() => setSelectedCategoryFilter('Laptops')}>
                      <span className="text-blue-400">•</span> Laptops
                    </li>
                    <li className="flex items-center gap-1.5 hover:text-cyan-400 cursor-pointer" onClick={() => setSelectedCategoryFilter('Portátiles PC')}>
                      <span className="text-blue-400">•</span> Portátiles PC
                    </li>
                    <li className="flex items-center gap-1.5 hover:text-cyan-400 cursor-pointer" onClick={() => setSelectedCategoryFilter('Monitores')}>
                      <span className="text-blue-400">•</span> Monitores
                    </li>
                    <li className="flex items-center gap-1.5 hover:text-cyan-400 cursor-pointer" onClick={() => setSelectedCategoryFilter('Impresoras')}>
                      <span className="text-blue-400">•</span> Impresoras
                    </li>
                    <li className="flex items-center gap-1.5 hover:text-cyan-400 cursor-pointer" onClick={() => setSelectedCategoryFilter('Mini PC')}>
                      <span className="text-blue-400">•</span> Mini PC
                    </li>
                  </ul>
                </div>

              </div>

              {/* COLUMN 3 */}
              <div className="space-y-3.5">
                
                {/* TECNOLOGÍA RESIDENCIAL CARD */}
                <div className="bg-[#0f172a]/90 backdrop-blur-md p-3.5 md:p-4 rounded-xl border border-blue-500/25 shadow-lg space-y-1.5 hover:border-blue-400 transition-all">
                  <h3 className="font-black text-xs md:text-sm text-cyan-400 uppercase tracking-tight flex items-center gap-1.5">
                    <Shield size={15} /> TECNOLOGÍA RESIDENCIAL
                  </h3>
                  <ul className="space-y-1 text-[11px] text-slate-200 font-semibold">
                    <li className="flex items-center gap-1.5 hover:text-cyan-400 cursor-pointer" onClick={() => setSelectedCategoryFilter('Portones')}>
                      <span className="text-blue-400">•</span> Portones
                    </li>
                    <li className="flex items-center gap-1.5 hover:text-cyan-400 cursor-pointer" onClick={() => setSelectedCategoryFilter('Alarmas')}>
                      <span className="text-blue-400">•</span> Alarmas
                    </li>
                    <li className="flex items-center gap-1.5 hover:text-cyan-400 cursor-pointer" onClick={() => setSelectedCategoryFilter('Perimetrales')}>
                      <span className="text-blue-400">•</span> Perimetrales
                    </li>
                  </ul>
                </div>

                {/* ELECTRÓNICA CARD */}
                <div className="bg-[#0f172a]/90 backdrop-blur-md p-3.5 md:p-4 rounded-xl border border-blue-500/25 shadow-lg space-y-1.5 hover:border-blue-400 transition-all">
                  <h3 className="font-black text-xs md:text-sm text-cyan-400 uppercase tracking-tight flex items-center gap-1.5">
                    <Zap size={15} /> ELECTRÓNICA
                  </h3>
                  <ul className="space-y-1 text-[11px] text-slate-200 font-semibold">
                    <li className="flex items-center gap-1.5 hover:text-cyan-400 cursor-pointer" onClick={() => setSelectedCategoryFilter('Microcomputadores')}>
                      <span className="text-blue-400">•</span> Microcomputadores
                    </li>
                    <li className="flex items-center gap-1.5 hover:text-cyan-400 cursor-pointer" onClick={() => setSelectedCategoryFilter('Cables')}>
                      <span className="text-blue-400">•</span> Cables
                    </li>
                    <li className="flex items-center gap-1.5 hover:text-cyan-400 cursor-pointer" onClick={() => setSelectedCategoryFilter('Adaptadores')}>
                      <span className="text-blue-400">•</span> Adaptadores
                    </li>
                    <li className="flex items-center gap-1.5 hover:text-cyan-400 cursor-pointer" onClick={() => setSelectedCategoryFilter('Cargadores')}>
                      <span className="text-blue-400">•</span> Cargadores
                    </li>
                  </ul>
                </div>

                {/* TODOS LOS ARTÍCULOS BOX */}
                <div className="bg-[#0f172a]/90 backdrop-blur-md border border-blue-500/25 rounded-xl p-3.5 md:p-4 shadow-lg space-y-2">
                  <button
                    onClick={() => setIsTodosArticulosOpen(!isTodosArticulosOpen)}
                    className="w-full flex items-center justify-between text-left font-black text-xs md:text-sm text-cyan-400 uppercase tracking-tight"
                  >
                    <span>TODOS LOS ARTÍCULOS</span>
                    <ChevronDown size={16} className={`transition-transform ${isTodosArticulosOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isTodosArticulosOpen && (
                    <div className="pt-1.5 border-t border-blue-500/20 space-y-1.5 max-h-48 overflow-y-auto pr-1">
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
                    className="w-full py-2 px-3.5 rounded-xl bg-gradient-to-r from-[#0066ff] via-[#1d4ed8] to-[#0052cc] hover:from-[#0052cc] hover:to-[#1e40af] text-white font-bold text-[11px] uppercase tracking-wider flex items-center justify-between transition-all shadow-lg shadow-blue-600/30 border border-blue-400/40 active:scale-98"
                  >
                    <span>Sobre nosotros</span>
                    <ChevronDown size={14} />
                  </button>

                  <button
                    onClick={() => setModalType('ubicacion')}
                    className="w-full py-2 px-3.5 rounded-xl bg-gradient-to-r from-[#0066ff] via-[#1d4ed8] to-[#0052cc] hover:from-[#0052cc] hover:to-[#1e40af] text-white font-bold text-[11px] uppercase tracking-wider flex items-center justify-between transition-all shadow-lg shadow-blue-600/30 border border-blue-400/40 active:scale-98"
                  >
                    <span>Ubicación</span>
                    <ChevronDown size={14} />
                  </button>

                  <button
                    onClick={() => setModalType('referencias')}
                    className="w-full py-2 px-3.5 rounded-xl bg-gradient-to-r from-[#0066ff] via-[#1d4ed8] to-[#0052cc] hover:from-[#0052cc] hover:to-[#1e40af] text-white font-bold text-[11px] uppercase tracking-wider flex items-center justify-between transition-all shadow-lg shadow-blue-600/30 border border-blue-400/40 active:scale-98"
                  >
                    <span>Referencias</span>
                    <ChevronDown size={14} />
                  </button>

                  <button
                    onClick={() => setModalType('contacto')}
                    className="w-full py-2 px-3.5 rounded-xl bg-gradient-to-r from-[#0066ff] via-[#1d4ed8] to-[#0052cc] hover:from-[#0052cc] hover:to-[#1e40af] text-white font-bold text-[11px] uppercase tracking-wider flex items-center justify-between transition-all shadow-lg shadow-blue-600/30 border border-blue-400/40 active:scale-98"
                  >
                    <span>Contacto</span>
                    <ChevronDown size={14} />
                  </button>

                  <button
                    onClick={() => setIsTodosArticulosOpen(!isTodosArticulosOpen)}
                    className="w-full py-2 px-3.5 rounded-xl bg-gradient-to-r from-[#0066ff] via-[#1d4ed8] to-[#0052cc] hover:from-[#0052cc] hover:to-[#1e40af] text-white font-bold text-[11px] uppercase tracking-wider flex items-center justify-between transition-all shadow-lg shadow-blue-600/30 border border-blue-400/40 active:scale-98"
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
            <div className="bg-[#0f172a]/90 backdrop-blur-md p-4 rounded-xl border border-blue-500/25 shadow-lg">
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
                  className="bg-[#0e1424]/90 backdrop-blur-md border border-blue-500/25 p-3.5 rounded-xl shadow-lg hover:shadow-blue-500/20 hover:border-blue-400 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xl">{lp.image}</span>
                      <span className="text-[8px] font-black font-mono bg-blue-900/80 text-cyan-300 px-2 py-0.5 rounded-full border border-blue-400/40">
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
                  <div className="flex items-center justify-between pt-2 border-t border-blue-500/20 text-[11px] font-bold text-cyan-400">
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
              <div className="bg-[#0f172a]/90 backdrop-blur-md border border-blue-500/30 p-4 rounded-xl shadow-lg space-y-3">
                <div className="inline-block bg-blue-950 text-cyan-300 font-mono text-[9px] font-black px-2 py-0.5 rounded-full uppercase border border-blue-400/30">
                  KIT OFERTA #1 GAMING
                </div>
                <h3 className="font-black text-sm md:text-base text-white uppercase">
                  Consola PS5 Slim 1TB + Mando Extra DualSense
                </h3>
                <p className="text-[11px] text-slate-300 leading-snug">
                  Incluye consola original sellada de paquete + 2 mandos DualSense originales + cable HDMI 2.1 de alta velocidad.
                </p>
                <div className="flex items-center justify-between pt-2.5 border-t border-blue-500/20">
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
              <div className="bg-[#0f172a]/90 backdrop-blur-md border border-blue-500/30 p-4 rounded-xl shadow-lg space-y-3">
                <div className="inline-block bg-blue-950 text-cyan-300 font-mono text-[9px] font-black px-2 py-0.5 rounded-full uppercase border border-blue-400/30">
                  KIT OFERTA #2 SEGURIDAD
                </div>
                <h3 className="font-black text-sm md:text-base text-white uppercase">
                  Control de Acceso Biométrico ZKTECO + Cerradura
                </h3>
                <p className="text-[11px] text-slate-300 leading-snug">
                  Lectura facial, huella dactilar, tarjetas RFID y apertura desde la App para puertas de vidrio o madera.
                </p>
                <div className="flex items-center justify-between pt-2.5 border-t border-blue-500/20">
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
              <div className="bg-[#0f172a]/90 backdrop-blur-md border border-blue-500/30 p-4 rounded-xl shadow-lg space-y-3">
                <div className="inline-block bg-blue-950 text-cyan-300 font-mono text-[9px] font-black px-2 py-0.5 rounded-full uppercase border border-blue-400/30">
                  KIT OFERTA #3 COCINA
                </div>
                <h3 className="font-black text-sm md:text-base text-white uppercase">
                  Encimera a Gas 4 Hornillas + Horno Empotrable
                </h3>
                <p className="text-[11px] text-slate-300 leading-snug">
                  Línea de lujo en acero inoxidable con encendido electrónico y dimensiones estándar para cocina.
                </p>
                <div className="flex items-center justify-between pt-2.5 border-t border-blue-500/20">
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
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            />

            {/* Left Drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="fixed top-0 left-0 bottom-0 z-50 w-72 max-w-[80vw] bg-[#0b101c] text-white shadow-2xl flex flex-col justify-between overflow-y-auto border-r border-blue-500/30"
            >
              <div className="p-4 space-y-4">

                {/* Drawer Header */}
                <div className="flex items-center justify-between pb-2.5 border-b border-blue-500/20">
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
                    className="p-1 rounded-lg bg-blue-950 hover:bg-blue-900 text-cyan-300"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Hamburger Navigation Sections */}
                <div className="space-y-2.5">

                  {/* Section 1: Todos los Artículos (Default Expanded Accordion) */}
                  <div className="border border-blue-500/30 rounded-lg p-2.5 bg-[#0f172a]">
                    <button
                      onClick={() => setIsTodosArticulosOpen(!isTodosArticulosOpen)}
                      className="w-full flex items-center justify-between font-black text-[11px] text-cyan-400 uppercase"
                    >
                      <span>Todos los artículos</span>
                      <ChevronDown size={14} className={`transition-transform ${isTodosArticulosOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isTodosArticulosOpen && (
                      <div className="mt-2 pt-1.5 border-t border-blue-500/20 space-y-1 max-h-44 overflow-y-auto pr-1">
                        {allItemsList.map((item, idx) => (
                          <div
                            key={idx}
                            onClick={() => {
                              setSelectedCategoryFilter(item);
                              setIsHamburgerOpen(false);
                            }}
                            className="text-[11px] text-slate-300 hover:text-cyan-400 font-medium cursor-pointer py-0.5 px-1.5 rounded hover:bg-blue-900/40"
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
                    className="w-full text-left p-2.5 rounded-lg bg-blue-950/80 hover:bg-blue-900 text-white font-bold text-[11px] uppercase flex items-center justify-between border border-blue-500/30"
                  >
                    <span>Sobre nosotros</span>
                    <ChevronRight size={14} />
                  </button>

                  {/* Section 3: Ubicación */}
                  <button
                    onClick={() => { setModalType('ubicacion'); setIsHamburgerOpen(false); }}
                    className="w-full text-left p-2.5 rounded-lg bg-blue-950/80 hover:bg-blue-900 text-white font-bold text-[11px] uppercase flex items-center justify-between border border-blue-500/30"
                  >
                    <span>Ubicación</span>
                    <ChevronRight size={14} />
                  </button>

                  {/* Section 4: Referencias */}
                  <button
                    onClick={() => { setModalType('referencias'); setIsHamburgerOpen(false); }}
                    className="w-full text-left p-2.5 rounded-lg bg-blue-950/80 hover:bg-blue-900 text-white font-bold text-[11px] uppercase flex items-center justify-between border border-blue-500/30"
                  >
                    <span>Referencias</span>
                    <ChevronRight size={14} />
                  </button>

                  {/* Section 5: Contacto */}
                  <button
                    onClick={() => { setModalType('contacto'); setIsHamburgerOpen(false); }}
                    className="w-full text-left p-2.5 rounded-lg bg-blue-950/80 hover:bg-blue-900 text-white font-bold text-[11px] uppercase flex items-center justify-between border border-blue-500/30"
                  >
                    <span>Contacto</span>
                    <ChevronRight size={14} />
                  </button>

                </div>

              </div>

              {/* Drawer Footer */}
              <div className="p-2.5 border-t border-blue-500/20 bg-[#070b14] text-center">
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
      <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 bg-[#0b101c]/95 backdrop-blur-md border border-blue-500/30 rounded-full px-3 py-1 shadow-2xl flex items-center gap-2.5">
        
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
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-md bg-[#0f172a] text-white rounded-2xl p-5 shadow-2xl border border-blue-500/30 max-h-[85vh] overflow-y-auto"
            >
              <button
                onClick={() => setModalType(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-blue-950 hover:bg-blue-900 text-cyan-300"
              >
                <X size={16} />
              </button>

              {/* MODAL 1: SOBRE NOSOTROS */}
              {modalType === 'nosotros' && (
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-900/60 text-cyan-400 border border-blue-500/30 flex items-center justify-center">
                    <Award size={20} />
                  </div>
                  <h3 className="text-lg font-black uppercase text-white">Sobre Nosotros — ATOMIC</h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    ATOMIC es una marca ecuatoriana especializada en <strong>Tecnología, Industria y Hogar</strong>. Comercializamos e importamos equipos biométricos, automatización de accesos, consolas gaming, electrodomésticos de cocina y soluciones de software a medida.
                  </p>
                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    <div className="p-2.5 rounded-lg bg-[#131c31] border border-blue-500/20 text-center">
                      <span className="block font-black text-base text-cyan-400">+10,000</span>
                      <span className="text-[9px] text-slate-400 uppercase font-bold">Clientes Satisfechos</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#131c31] border border-blue-500/20 text-center">
                      <span className="block font-black text-base text-cyan-400">100%</span>
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
                  <h3 className="text-lg font-black uppercase text-white">Nuestra Ubicación & Cobertura</h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    Despachamos pedidos diariamente a todo el Ecuador con cobertura garantizada en las principales provincias.
                  </p>
                  <div className="space-y-2 pt-1 text-xs">
                    <div className="p-2.5 rounded-lg bg-[#131c31] border border-blue-500/20 flex items-center gap-2.5">
                      <MapPin className="text-[#ff5733] shrink-0" size={16} />
                      <div>
                        <strong className="block text-white">Matriz Principal:</strong>
                        <span className="text-slate-400">Quito, Ecuador — Envíos a Nivel Nacional</span>
                      </div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#131c31] border border-blue-500/20 flex items-center gap-2.5">
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
                  <h3 className="text-lg font-black uppercase text-white">Referencias & Testimonios</h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    Conoce las valoraciones reales de nuestros clientes en todo Ecuador.
                  </p>
                  <div className="space-y-2 pt-1">
                    <div className="p-2.5 rounded-lg bg-[#131c31] border border-blue-500/20 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <strong className="text-white">Carlos M. (Quito)</strong>
                        <span className="text-amber-400 text-xs">★★★★★</span>
                      </div>
                      <p className="text-slate-300 text-[11px]">
                        &quot;Compré el Kit de Control de Acceso ZKTECO para mi edificio. Llegó al día siguiente y la asesoría por WhatsApp fue excelente.&quot;
                      </p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#131c31] border border-blue-500/20 text-xs space-y-1">
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
                  <h3 className="text-lg font-black uppercase text-white">Canales de Contacto Directo</h3>
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
                    <div className="p-2.5 rounded-lg bg-[#131c31] border border-blue-500/20 text-xs font-mono space-y-1">
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
                  <h3 className="text-lg font-black uppercase text-white">Carrito de Compras</h3>
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
                  <h3 className="text-lg font-black uppercase text-white">Mi Cuenta ATOMIC</h3>
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
                  <h3 className="text-lg font-black uppercase text-white">Seguimiento & Envíos</h3>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed">
                    Realizamos envíos a todo Ecuador con número de guía en tiempo real para rastrear tu paquete.
                  </p>
                  <div className="p-2.5 rounded-lg bg-[#131c31] border border-blue-500/20 text-xs font-mono">
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
