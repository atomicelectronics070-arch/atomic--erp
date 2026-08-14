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

/* ── ATOMIC ATOM LOGO SVG (COMPACT) ── */
function AtomicLogoSVG() {
  return (
    <svg width="32" height="32" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <circle cx="36" cy="36" r="6" fill="#FFFFFF" className="animate-pulse" />
      <ellipse cx="36" cy="36" rx="30" ry="10" stroke="#FFFFFF" strokeWidth="2.2" fill="none" />
      <ellipse cx="36" cy="36" rx="30" ry="10" stroke="#FFFFFF" strokeWidth="2.2" fill="none" transform="rotate(60 36 36)" />
      <ellipse cx="36" cy="36" rx="30" ry="10" stroke="#FFFFFF" strokeWidth="2.2" fill="none" transform="rotate(120 36 36)" />
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

  // 12 Top Category Grid Items with Realistic Metallic Badges (Compact)
  const categoryGridItems = [
    { 
      id: 'industrial', 
      title: 'INDUSTRIAL', 
      sub: 'Automatización', 
      icon: Factory, 
      metallicBg: 'bg-gradient-to-b from-amber-100 via-amber-200 to-amber-500', 
      metallicBorder: 'border border-amber-300 shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),0_2px_6px_rgba(0,0,0,0.1)]', 
      textColor: 'text-amber-950',
      href: '#industrial' 
    },
    { 
      id: 'servicios', 
      title: 'SERVICIOS', 
      sub: 'Asesoría', 
      icon: Award, 
      metallicBg: 'bg-gradient-to-b from-sky-100 via-slate-200 to-blue-600', 
      metallicBorder: 'border border-blue-300 shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),0_2px_6px_rgba(0,0,0,0.1)]', 
      textColor: 'text-blue-950',
      href: '#servicios' 
    },
    { 
      id: 'computacion', 
      title: 'COMPUTACIÓN', 
      sub: 'Laptops', 
      icon: Laptop, 
      metallicBg: 'bg-gradient-to-b from-purple-100 via-slate-200 to-indigo-600', 
      metallicBorder: 'border border-purple-300 shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),0_2px_6px_rgba(0,0,0,0.1)]', 
      textColor: 'text-purple-950',
      href: '/web/cpus' 
    },
    { 
      id: 'telefonia', 
      title: 'TELEFONÍA', 
      sub: 'Celulares', 
      icon: Smartphone, 
      metallicBg: 'bg-gradient-to-b from-emerald-100 via-slate-200 to-teal-600', 
      metallicBorder: 'border border-emerald-300 shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),0_2px_6px_rgba(0,0,0,0.1)]', 
      textColor: 'text-emerald-950',
      href: '/web/phones' 
    },
    { 
      id: 'minipc', 
      title: 'MINI PC', 
      sub: 'Compactos', 
      icon: Cpu, 
      metallicBg: 'bg-gradient-to-b from-slate-100 via-slate-300 to-zinc-500', 
      metallicBorder: 'border border-slate-300 shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),0_2px_6px_rgba(0,0,0,0.1)]', 
      textColor: 'text-zinc-950',
      href: '/web/cpus' 
    },
    { 
      id: 'monitores', 
      title: 'MONITORES', 
      sub: 'Gaming HD', 
      icon: Laptop, 
      metallicBg: 'bg-gradient-to-b from-cyan-100 via-slate-200 to-blue-600', 
      metallicBorder: 'border border-cyan-300 shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),0_2px_6px_rgba(0,0,0,0.1)]', 
      textColor: 'text-blue-950',
      href: '/web/cpus' 
    },
    { 
      id: 'tablets-infantiles', 
      title: 'TABLETS NIÑOS', 
      sub: 'Edición Kids', 
      icon: Smartphone, 
      metallicBg: 'bg-gradient-to-b from-pink-100 via-rose-200 to-rose-500', 
      metallicBorder: 'border border-pink-300 shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),0_2px_6px_rgba(0,0,0,0.1)]', 
      textColor: 'text-rose-950',
      href: '/web/phones' 
    },
    { 
      id: 'portones-automaticos', 
      title: 'PORTONES', 
      sub: 'Control Acceso', 
      icon: Lock, 
      metallicBg: 'bg-gradient-to-b from-zinc-100 via-zinc-300 to-zinc-600', 
      metallicBorder: 'border border-zinc-400 shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),0_2px_6px_rgba(0,0,0,0.1)]', 
      textColor: 'text-zinc-950',
      href: '/web/intercomunicacion' 
    },
    { 
      id: 'hogar', 
      title: 'HOGAR', 
      sub: 'Cocina & Luz', 
      icon: Utensils, 
      metallicBg: 'bg-gradient-to-b from-amber-100 via-orange-200 to-amber-600', 
      metallicBorder: 'border border-amber-300 shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),0_2px_6px_rgba(0,0,0,0.1)]', 
      textColor: 'text-amber-950',
      href: '/web/cocinas' 
    },
    { 
      id: 'software', 
      title: 'SOFTWARE', 
      sub: 'Systems & Web', 
      icon: Code, 
      metallicBg: 'bg-gradient-to-b from-cyan-100 via-slate-200 to-teal-600', 
      metallicBorder: 'border border-cyan-300 shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),0_2px_6px_rgba(0,0,0,0.1)]', 
      textColor: 'text-teal-950',
      href: '/web/software' 
    },
    { 
      id: 'tecnologia-residencial', 
      title: 'TECNOLOGÍA RES.', 
      sub: 'Alarmas', 
      icon: Shield, 
      metallicBg: 'bg-gradient-to-b from-emerald-100 via-slate-200 to-emerald-600', 
      metallicBorder: 'border border-emerald-300 shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),0_2px_6px_rgba(0,0,0,0.1)]', 
      textColor: 'text-emerald-950',
      href: '/web/conjuntos-smart' 
    },
    { 
      id: 'electronica', 
      title: 'ELECTRÓNICA', 
      sub: 'Cables & Micro', 
      icon: Zap, 
      metallicBg: 'bg-gradient-to-b from-red-100 via-rose-200 to-red-600', 
      metallicBorder: 'border border-red-300 shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),0_2px_6px_rgba(0,0,0,0.1)]', 
      textColor: 'text-red-950',
      href: '#electronica' 
    },
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
    <div className="w-full bg-[#f4f5f8] min-h-screen text-slate-900 font-sans selection:bg-red-500 selection:text-white pb-20">

      {/* ═════════════════════════════════════════════════════════════ */}
      {/* 🔴 HEADER BAR: ATOMIC BRANDED CRIMSON RED NAV (#DC2626) - SLIM */}
      {/* ═════════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 bg-[#dc2626] text-white shadow-lg border-b border-red-700 px-3 md:px-5 py-1.5 md:py-2">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2.5">

          {/* LEFT: HAMBURGER & LOGO */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsHamburgerOpen(true)}
              className="p-1.5 rounded-lg bg-red-700/80 hover:bg-red-800 transition-all text-white shadow-sm active:scale-95 shrink-0"
              aria-label="Abrir Menú"
            >
              <Menu size={20} />
            </button>

            <Link href="/web" className="flex items-center gap-1.5 group">
              <AtomicLogoSVG />
              <div className="flex flex-col">
                <span className="text-base md:text-xl font-black tracking-tight leading-none uppercase font-mono">
                  ATOMIC
                </span>
                <span className="text-[8px] md:text-[10px] font-semibold opacity-90 tracking-tight leading-tight hidden sm:block">
                  Tecnología, industria y Hogar
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
              placeholder="Buscar..."
              className="w-full bg-white text-slate-900 border border-red-200 rounded-full py-1 md:py-1.5 pl-8 pr-8 text-xs font-medium shadow-inner outline-none focus:ring-2 focus:ring-red-300 transition-all"
            />
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* RIGHT ACTION ICONS: PROFILE, CART, SHIPPING */}
          <div className="flex items-center gap-1 md:gap-2 shrink-0">
            <button
              onClick={() => setModalType('profile')}
              className="p-1.5 md:p-2 rounded-full bg-red-700/90 hover:bg-red-800 transition-all text-white shadow-sm hover:scale-105 active:scale-95"
              title="Perfil de Usuario"
            >
              <User size={16} />
            </button>

            <button
              onClick={() => setModalType('cart')}
              className="p-1.5 md:p-2 rounded-full bg-red-700/90 hover:bg-red-800 transition-all text-white shadow-sm relative hover:scale-105 active:scale-95"
              title="Carrito de Compras"
            >
              <ShoppingCart size={16} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-400 text-red-950 font-black text-[8px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-red-600 shadow-sm">
                  {totalItems}
                </span>
              )}
            </button>

            <button
              onClick={() => setModalType('envios')}
              className="p-1.5 md:p-2 rounded-full bg-red-700/90 hover:bg-red-800 transition-all text-white shadow-sm hover:scale-105 active:scale-95"
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
      <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-[45px] md:top-[51px] z-40 px-3 py-1.5">
        <div className="max-w-6xl mx-auto flex items-center justify-center md:justify-start gap-4 md:gap-10">

          <button
            onClick={() => setActiveTab('categorias')}
            className={`font-black text-xs tracking-wider uppercase transition-all pb-0.5 border-b-2 ${
              activeTab === 'categorias'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-slate-700 hover:text-slate-900'
            }`}
          >
            CATEGORIAS
          </button>

          <button
            onClick={() => setActiveTab('landings')}
            className={`font-black text-xs tracking-wider uppercase transition-all pb-0.5 border-b-2 ${
              activeTab === 'landings'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-slate-700 hover:text-slate-900'
            }`}
          >
            LANDING PAGES
          </button>

          <button
            onClick={() => setActiveTab('ofertas')}
            className={`font-black text-xs tracking-wider uppercase transition-all pb-0.5 border-b-2 ${
              activeTab === 'ofertas'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-slate-700 hover:text-slate-900'
            }`}
          >
            OFERTAS 🔥
          </button>

        </div>
      </nav>

      {/* ═════════════════════════════════════════════════════════════ */}
      {/* MAIN CONTAINER AREA (COMPACT MAX-W-6XL)                       */}
      {/* ═════════════════════════════════════════════════════════════ */}
      <main className="max-w-6xl mx-auto px-3 md:px-5 pt-3">

        {/* SEARCH OVERRIDE RESULTS VIEW */}
        {searchQuery.trim() ? (
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <h2 className="text-sm font-black text-slate-900 uppercase">
                Resultados para: &quot;<span className="text-red-600">{searchQuery}</span>&quot;
              </h2>
              <span className="text-[10px] font-bold text-slate-500 font-mono">
                {filteredProducts.length} productos
              </span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs">
                No se encontraron productos que coincidan con la búsqueda.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {filteredProducts.slice(0, 36).map(p => (
                  <div key={p.id} className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg flex flex-col justify-between hover:border-red-500 transition-all">
                    <div>
                      <span className="text-[8px] font-mono text-red-600 uppercase font-bold block mb-1">
                        {p.category?.name || 'General'}
                      </span>
                      <h4 className="font-bold text-[11px] text-slate-900 line-clamp-2 mb-1">{p.name}</h4>
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900 mb-1.5">${(p.price || 0).toFixed(2)}</p>
                      <a
                        href={`https://wa.me/593969043453?text=${encodeURIComponent(`Hola ATOMIC! Deseo cotizar: ${p.name} ($${(p.price || 0).toFixed(2)})`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-1 bg-red-600 hover:bg-red-700 text-white font-bold text-[9px] uppercase rounded transition-all text-center flex items-center justify-center gap-1 shadow-sm"
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
        {/* TAB 1: CATEGORIAS VIEW (ULTRA-COMPACT REFINED PROPORTIONS)   */}
        {/* ═════════════════════════════════════════════════════════════ */}
        {!searchQuery.trim() && activeTab === 'categorias' && (
          <div className="space-y-4">

            {/* TOP 12 CATEGORY RIBBON/GRID (COMPACT HORIZONTAL SWIPE ON MOBILE, SLEEK GRID ON DESKTOP) */}
            <div className="flex sm:grid sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-6 gap-2 overflow-x-auto snap-x snap-mandatory pb-1 px-0.5 scrollbar-none">
              {categoryGridItems.map(item => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => {
                      if (item.href.startsWith('#')) {
                        setSelectedCategoryFilter(item.title)
                      }
                    }}
                    className="min-w-[105px] w-[105px] sm:w-auto shrink-0 snap-start bg-white border border-slate-200 p-2 md:p-2.5 rounded-xl shadow-2xs hover:shadow-sm hover:-translate-y-0.5 transition-all flex flex-col items-center justify-center text-center group cursor-pointer"
                  >
                    {/* REALISTIC 3D METALLIC ICON CONTAINER (COMPACT) */}
                    <div className={`w-8 h-8 md:w-9 md:h-9 rounded-xl ${item.metallicBg} ${item.metallicBorder} flex items-center justify-center ${item.textColor} mb-1 group-hover:scale-105 transition-transform`}>
                      <Icon size={16} className="drop-shadow-2xs" />
                    </div>
                    <h3 className="font-black text-[10px] text-slate-900 uppercase tracking-tight group-hover:text-red-600 transition-colors line-clamp-1">
                      {item.title}
                    </h3>
                    <span className="text-[8px] text-slate-500 font-medium mt-0.5 line-clamp-1">
                      {item.sub}
                    </span>
                  </Link>
                )
              })}
            </div>

            {/* MAIN 3-COLUMN CONTENT BREAKDOWN (ELEGANT COMPACT PROPORTIONS) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-0.5">

              {/* COLUMN 1 */}
              <div className="space-y-3.5">
                
                {/* INDUSTRIAL CARD */}
                <div className="bg-white p-3.5 md:p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                  <h3 className="font-black text-xs md:text-sm text-red-700 uppercase tracking-tight flex items-center gap-1.5">
                    <Factory size={15} /> INDUSTRIAL
                  </h3>
                  <ul className="space-y-1 text-[11px] text-slate-800 font-semibold">
                    <li className="flex items-center gap-1.5 hover:text-red-600 cursor-pointer" onClick={() => setSelectedCategoryFilter('Automatización')}>
                      <span className="text-red-500">•</span> Automatización
                    </li>
                    <li className="flex items-center gap-1.5 hover:text-red-600 cursor-pointer" onClick={() => setSelectedCategoryFilter('Lubricación')}>
                      <span className="text-red-500">•</span> Lubricación
                    </li>
                    <li className="flex items-center gap-1.5 hover:text-red-600 cursor-pointer" onClick={() => setSelectedCategoryFilter('Generadores')}>
                      <span className="text-red-500">•</span> Generadores
                    </li>
                  </ul>
                </div>

                {/* SERVICIOS CARD */}
                <div className="bg-white p-3.5 md:p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                  <h3 className="font-black text-xs md:text-sm text-red-700 uppercase tracking-tight flex items-center gap-1.5">
                    <Award size={15} /> SERVICIOS
                  </h3>
                  <ul className="space-y-1 text-[11px] text-slate-800 font-semibold">
                    <li className="flex items-center gap-1.5 hover:text-red-600 cursor-pointer" onClick={() => setSelectedCategoryFilter('Asesoría')}>
                      <span className="text-red-500">•</span> Asesoría
                    </li>
                    <li className="flex items-center gap-1.5 hover:text-red-600 cursor-pointer" onClick={() => setSelectedCategoryFilter('Especialización')}>
                      <span className="text-red-500">•</span> Especialización
                    </li>
                    <li className="flex items-center gap-1.5 hover:text-red-600 cursor-pointer" onClick={() => setSelectedCategoryFilter('Peritaciones')}>
                      <span className="text-red-500">•</span> Peritaciones
                    </li>
                  </ul>
                </div>

                {/* TELEFONÍA CARD */}
                <div className="bg-white p-3.5 md:p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                  <h3 className="font-black text-xs md:text-sm text-red-700 uppercase tracking-tight flex items-center gap-1.5">
                    <Smartphone size={15} /> TELEFONÍA
                  </h3>
                  <ul className="space-y-1 text-[11px] text-slate-800 font-semibold">
                    <li className="flex items-center gap-1.5 hover:text-red-600 cursor-pointer" onClick={() => setSelectedCategoryFilter('Celulares')}>
                      <span className="text-red-500">•</span> Celulares
                    </li>
                    <li className="flex items-center gap-1.5 hover:text-red-600 cursor-pointer" onClick={() => setSelectedCategoryFilter('Tablets')}>
                      <span className="text-red-500">•</span> Tablets
                    </li>
                    <li className="flex items-center gap-1.5 hover:text-red-600 cursor-pointer" onClick={() => setSelectedCategoryFilter('Tablets infantiles')}>
                      <span className="text-red-500">•</span> Tablets infantiles
                    </li>
                  </ul>
                </div>

              </div>

              {/* COLUMN 2 */}
              <div className="space-y-3.5">
                
                {/* HOGAR CARD */}
                <div className="bg-white p-3.5 md:p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                  <h3 className="font-black text-xs md:text-sm text-red-700 uppercase tracking-tight flex items-center gap-1.5">
                    <Utensils size={15} /> HOGAR
                  </h3>
                  <ul className="space-y-1 text-[11px] text-slate-800 font-semibold">
                    <li className="flex items-center gap-1.5 hover:text-red-600 cursor-pointer" onClick={() => setSelectedCategoryFilter('Iluminación')}>
                      <span>💡</span> Iluminación
                    </li>
                    <li className="flex items-center gap-1.5 hover:text-red-600 cursor-pointer" onClick={() => setSelectedCategoryFilter('Cocina')}>
                      <span>🍳</span> Cocina
                    </li>
                    <li className="flex items-center gap-1.5 hover:text-red-600 cursor-pointer" onClick={() => setSelectedCategoryFilter('Domotica')}>
                      <span>🏠</span> Domotica
                    </li>
                    <li className="flex items-center gap-1.5 hover:text-red-600 cursor-pointer" onClick={() => setSelectedCategoryFilter('Entretenimiento')}>
                      <span>🎮</span> Entretenimiento
                    </li>
                  </ul>
                </div>

                {/* SOFTWARE CARD */}
                <div className="bg-white p-3.5 md:p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                  <h3 className="font-black text-xs md:text-sm text-red-700 uppercase tracking-tight flex items-center gap-1.5">
                    <Code size={15} /> SOFTWARE
                  </h3>
                  <ul className="space-y-1 text-[11px] text-slate-800 font-semibold">
                    <li className="flex items-center gap-1.5 hover:text-red-600 cursor-pointer" onClick={() => setSelectedCategoryFilter('Automatización')}>
                      <span className="text-red-500">•</span> Automatización
                    </li>
                    <li className="flex items-center gap-1.5 hover:text-red-600 cursor-pointer" onClick={() => setSelectedCategoryFilter('Tienda en línea')}>
                      <span className="text-red-500">•</span> Tienda en línea
                    </li>
                    <li className="flex items-center gap-1.5 hover:text-red-600 cursor-pointer" onClick={() => setSelectedCategoryFilter('Systems')}>
                      <span className="text-red-500">•</span> Systems
                    </li>
                  </ul>
                </div>

                {/* COMPUTACIÓN CARD */}
                <div className="bg-white p-3.5 md:p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                  <h3 className="font-black text-xs md:text-sm text-red-700 uppercase tracking-tight flex items-center gap-1.5">
                    <Laptop size={15} /> COMPUTACIÓN
                  </h3>
                  <ul className="space-y-1 text-[11px] text-slate-800 font-semibold">
                    <li className="flex items-center gap-1.5 hover:text-red-600 cursor-pointer" onClick={() => setSelectedCategoryFilter('Laptops')}>
                      <span className="text-red-500">•</span> Laptops
                    </li>
                    <li className="flex items-center gap-1.5 hover:text-red-600 cursor-pointer" onClick={() => setSelectedCategoryFilter('Portátiles PC')}>
                      <span className="text-red-500">•</span> Portátiles PC
                    </li>
                    <li className="flex items-center gap-1.5 hover:text-red-600 cursor-pointer" onClick={() => setSelectedCategoryFilter('Monitores')}>
                      <span className="text-red-500">•</span> Monitores
                    </li>
                    <li className="flex items-center gap-1.5 hover:text-red-600 cursor-pointer" onClick={() => setSelectedCategoryFilter('Impresoras')}>
                      <span className="text-red-500">•</span> Impresoras
                    </li>
                    <li className="flex items-center gap-1.5 hover:text-red-600 cursor-pointer" onClick={() => setSelectedCategoryFilter('Mini PC')}>
                      <span className="text-red-500">•</span> Mini PC
                    </li>
                  </ul>
                </div>

              </div>

              {/* COLUMN 3 */}
              <div className="space-y-3.5">
                
                {/* TECNOLOGÍA RESIDENCIAL CARD */}
                <div className="bg-white p-3.5 md:p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                  <h3 className="font-black text-xs md:text-sm text-red-700 uppercase tracking-tight flex items-center gap-1.5">
                    <Shield size={15} /> TECNOLOGÍA RESIDENCIAL
                  </h3>
                  <ul className="space-y-1 text-[11px] text-slate-800 font-semibold">
                    <li className="flex items-center gap-1.5 hover:text-red-600 cursor-pointer" onClick={() => setSelectedCategoryFilter('Portones')}>
                      <span className="text-red-500">•</span> Portones
                    </li>
                    <li className="flex items-center gap-1.5 hover:text-red-600 cursor-pointer" onClick={() => setSelectedCategoryFilter('Alarmas')}>
                      <span className="text-red-500">•</span> Alarmas
                    </li>
                    <li className="flex items-center gap-1.5 hover:text-red-600 cursor-pointer" onClick={() => setSelectedCategoryFilter('Perimetrales')}>
                      <span className="text-red-500">•</span> Perimetrales
                    </li>
                  </ul>
                </div>

                {/* ELECTRÓNICA CARD */}
                <div className="bg-white p-3.5 md:p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                  <h3 className="font-black text-xs md:text-sm text-red-700 uppercase tracking-tight flex items-center gap-1.5">
                    <Zap size={15} /> ELECTRÓNICA
                  </h3>
                  <ul className="space-y-1 text-[11px] text-slate-800 font-semibold">
                    <li className="flex items-center gap-1.5 hover:text-red-600 cursor-pointer" onClick={() => setSelectedCategoryFilter('Microcomputadores')}>
                      <span className="text-red-500">•</span> Microcomputadores
                    </li>
                    <li className="flex items-center gap-1.5 hover:text-red-600 cursor-pointer" onClick={() => setSelectedCategoryFilter('Cables')}>
                      <span className="text-red-500">•</span> Cables
                    </li>
                    <li className="flex items-center gap-1.5 hover:text-red-600 cursor-pointer" onClick={() => setSelectedCategoryFilter('Adaptadores')}>
                      <span className="text-red-500">•</span> Adaptadores
                    </li>
                    <li className="flex items-center gap-1.5 hover:text-red-600 cursor-pointer" onClick={() => setSelectedCategoryFilter('Cargadores')}>
                      <span className="text-red-500">•</span> Cargadores
                    </li>
                  </ul>
                </div>

                {/* TODOS LOS ARTÍCULOS BOX */}
                <div className="bg-white border border-slate-200 rounded-xl p-3.5 md:p-4 shadow-2xs space-y-2">
                  <button
                    onClick={() => setIsTodosArticulosOpen(!isTodosArticulosOpen)}
                    className="w-full flex items-center justify-between text-left font-black text-xs md:text-sm text-red-700 uppercase tracking-tight"
                  >
                    <span>TODOS LOS ARTÍCULOS</span>
                    <ChevronDown size={16} className={`transition-transform ${isTodosArticulosOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isTodosArticulosOpen && (
                    <div className="pt-1.5 border-t border-slate-100 space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      <ul className="space-y-0.5 text-[11px] text-slate-700 font-medium">
                        {allItemsList.map((item, idx) => (
                          <li
                            key={idx}
                            onClick={() => setSelectedCategoryFilter(item)}
                            className="hover:text-red-600 cursor-pointer flex items-center gap-1"
                          >
                            <span className="text-slate-400">-</span> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* 🟣 BOTTOM PURPLE PILL BUTTONS (COMPACT) */}
                <div className="space-y-1.5 pt-0.5">

                  <button
                    onClick={() => setModalType('nosotros')}
                    className="w-full py-2 px-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] uppercase tracking-wider flex items-center justify-between transition-all shadow-sm active:scale-98"
                  >
                    <span>Sobre nosotros</span>
                    <ChevronDown size={14} />
                  </button>

                  <button
                    onClick={() => setModalType('ubicacion')}
                    className="w-full py-2 px-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] uppercase tracking-wider flex items-center justify-between transition-all shadow-sm active:scale-98"
                  >
                    <span>Ubicación</span>
                    <ChevronDown size={14} />
                  </button>

                  <button
                    onClick={() => setModalType('referencias')}
                    className="w-full py-2 px-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] uppercase tracking-wider flex items-center justify-between transition-all shadow-sm active:scale-98"
                  >
                    <span>Referencias</span>
                    <ChevronDown size={14} />
                  </button>

                  <button
                    onClick={() => setModalType('contacto')}
                    className="w-full py-2 px-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] uppercase tracking-wider flex items-center justify-between transition-all shadow-sm active:scale-98"
                  >
                    <span>Contacto</span>
                    <ChevronDown size={14} />
                  </button>

                  <button
                    onClick={() => setIsTodosArticulosOpen(!isTodosArticulosOpen)}
                    className="w-full py-2 px-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] uppercase tracking-wider flex items-center justify-between transition-all shadow-sm active:scale-98"
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
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <h2 className="text-base md:text-lg font-black text-slate-900 uppercase tracking-tight mb-0.5">
                Catálogo de Landing Pages Especializadas
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">
                Explora las secciones interactivas creadas para líneas de productos de alta demanda
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {landingPagesList.map((lp, idx) => (
                <Link
                  key={idx}
                  href={lp.url}
                  className="bg-white border border-slate-200 p-3.5 rounded-xl shadow-2xs hover:shadow-xs hover:border-red-500 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xl">{lp.image}</span>
                      <span className="text-[8px] font-black font-mono bg-red-100 text-red-700 px-2 py-0.5 rounded-full border border-red-200">
                        {lp.tag}
                      </span>
                    </div>
                    <h3 className="font-black text-xs text-slate-900 uppercase tracking-tight group-hover:text-red-600 transition-colors mb-0.5">
                      {lp.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 leading-snug font-medium mb-2.5">
                      {lp.sub}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] font-bold text-red-600">
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
            <div className="bg-gradient-to-r from-red-600 to-amber-600 text-white p-4 rounded-xl shadow-md">
              <h2 className="text-base md:text-lg font-black uppercase tracking-tight mb-0.5">
                🔥 Promociones & Kits de Oferta Especial
              </h2>
              <p className="text-[11px] text-red-100 font-medium">
                Descuentos directos en equipos seleccionados con asesoría e instalación en todo Ecuador
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              
              {/* Promo Kit 1 */}
              <div className="bg-white border-2 border-red-200 p-4 rounded-xl shadow-2xs space-y-3">
                <div className="inline-block bg-red-100 text-red-700 font-mono text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                  KIT OFERTA #1 GAMING
                </div>
                <h3 className="font-black text-sm md:text-base text-slate-900 uppercase">
                  Consola PS5 Slim 1TB + Mando Extra DualSense
                </h3>
                <p className="text-[11px] text-slate-600 leading-snug">
                  Incluye consola original sellada de paquete + 2 mandos DualSense originales + cable HDMI 2.1 de alta velocidad.
                </p>
                <div className="flex items-center justify-between pt-2.5 border-t border-slate-100">
                  <span className="text-lg md:text-xl font-black text-red-600">$755.00</span>
                  <a
                    href="https://wa.me/593969043453?text=Hola%20ATOMIC!%20Deseo%20cotizar%20el%20KIT%20OFERTA%20PS5%20Slim%20+%20Mando"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] uppercase rounded-lg transition-all shadow-sm"
                  >
                    💬 Pedir WhatsApp
                  </a>
                </div>
              </div>

              {/* Promo Kit 2 */}
              <div className="bg-white border-2 border-amber-200 p-4 rounded-xl shadow-2xs space-y-3">
                <div className="inline-block bg-amber-100 text-amber-800 font-mono text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                  KIT OFERTA #2 SEGURIDAD
                </div>
                <h3 className="font-black text-sm md:text-base text-slate-900 uppercase">
                  Control de Acceso Biométrico ZKTECO + Cerradura
                </h3>
                <p className="text-[11px] text-slate-600 leading-snug">
                  Lectura facial, huella dactilar, tarjetas RFID y apertura desde la App para puertas de vidrio o madera.
                </p>
                <div className="flex items-center justify-between pt-2.5 border-t border-slate-100">
                  <span className="text-lg md:text-xl font-black text-amber-600">$185.00</span>
                  <a
                    href="https://wa.me/593969043453?text=Hola%20ATOMIC!%20Deseo%20cotizar%20el%20Kit%20ZKTECO%20Biometrico"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] uppercase rounded-lg transition-all shadow-sm"
                  >
                    💬 Pedir WhatsApp
                  </a>
                </div>
              </div>

              {/* Promo Kit 3 */}
              <div className="bg-white border-2 border-blue-200 p-4 rounded-xl shadow-2xs space-y-3">
                <div className="inline-block bg-blue-100 text-blue-800 font-mono text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                  KIT OFERTA #3 COCINA
                </div>
                <h3 className="font-black text-sm md:text-base text-slate-900 uppercase">
                  Encimera a Gas 4 Hornillas + Horno Empotrable
                </h3>
                <p className="text-[11px] text-slate-600 leading-snug">
                  Línea de lujo en acero inoxidable con encendido electrónico y dimensiones estándar para cocina.
                </p>
                <div className="flex items-center justify-between pt-2.5 border-t border-slate-100">
                  <span className="text-lg md:text-xl font-black text-blue-600">$420.00</span>
                  <a
                    href="https://wa.me/593969043453?text=Hola%20ATOMIC!%20Deseo%20cotizar%20el%20Kit%20Encimera%20+%20Horno"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] uppercase rounded-lg transition-all shadow-sm"
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
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />

            {/* Left Drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="fixed top-0 left-0 bottom-0 z-50 w-72 max-w-[80vw] bg-white text-slate-900 shadow-2xl flex flex-col justify-between overflow-y-auto"
            >
              <div className="p-4 space-y-4">

                {/* Drawer Header */}
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-red-600 flex items-center justify-center text-white font-black text-[11px]">
                      A
                    </div>
                    <div>
                      <h3 className="font-black text-xs text-slate-900 leading-none">ATOMIC</h3>
                      <p className="text-[9px] text-slate-500">Menú Principal</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsHamburgerOpen(false)}
                    className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Hamburger Navigation Sections */}
                <div className="space-y-2.5">

                  {/* Section 1: Todos los Artículos (Default Expanded Accordion) */}
                  <div className="border border-slate-200 rounded-lg p-2.5 bg-slate-50">
                    <button
                      onClick={() => setIsTodosArticulosOpen(!isTodosArticulosOpen)}
                      className="w-full flex items-center justify-between font-black text-[11px] text-red-600 uppercase"
                    >
                      <span>Todos los artículos</span>
                      <ChevronDown size={14} className={`transition-transform ${isTodosArticulosOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isTodosArticulosOpen && (
                      <div className="mt-2 pt-1.5 border-t border-slate-200 space-y-1 max-h-44 overflow-y-auto pr-1">
                        {allItemsList.map((item, idx) => (
                          <div
                            key={idx}
                            onClick={() => {
                              setSelectedCategoryFilter(item);
                              setIsHamburgerOpen(false);
                            }}
                            className="text-[11px] text-slate-700 hover:text-red-600 font-medium cursor-pointer py-0.5 px-1.5 rounded hover:bg-white"
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
                    className="w-full text-left p-2.5 rounded-lg bg-slate-100 hover:bg-indigo-50 text-indigo-950 font-bold text-[11px] uppercase flex items-center justify-between border border-slate-200"
                  >
                    <span>Sobre nosotros</span>
                    <ChevronRight size={14} />
                  </button>

                  {/* Section 3: Ubicación */}
                  <button
                    onClick={() => { setModalType('ubicacion'); setIsHamburgerOpen(false); }}
                    className="w-full text-left p-2.5 rounded-lg bg-slate-100 hover:bg-indigo-50 text-indigo-950 font-bold text-[11px] uppercase flex items-center justify-between border border-slate-200"
                  >
                    <span>Ubicación</span>
                    <ChevronRight size={14} />
                  </button>

                  {/* Section 4: Referencias */}
                  <button
                    onClick={() => { setModalType('referencias'); setIsHamburgerOpen(false); }}
                    className="w-full text-left p-2.5 rounded-lg bg-slate-100 hover:bg-indigo-50 text-indigo-950 font-bold text-[11px] uppercase flex items-center justify-between border border-slate-200"
                  >
                    <span>Referencias</span>
                    <ChevronRight size={14} />
                  </button>

                  {/* Section 5: Contacto */}
                  <button
                    onClick={() => { setModalType('contacto'); setIsHamburgerOpen(false); }}
                    className="w-full text-left p-2.5 rounded-lg bg-slate-100 hover:bg-indigo-50 text-indigo-950 font-bold text-[11px] uppercase flex items-center justify-between border border-slate-200"
                  >
                    <span>Contacto</span>
                    <ChevronRight size={14} />
                  </button>

                </div>

              </div>

              {/* Drawer Footer */}
              <div className="p-2.5 border-t border-slate-200 bg-slate-50 text-center">
                <p className="text-[9px] text-slate-500 font-mono uppercase font-bold">
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
      <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 bg-white/95 backdrop-blur-md border border-slate-200 rounded-full px-3 py-1 shadow-xl flex items-center gap-2.5">
        
        {/* WhatsApp */}
        <a
          href="https://wa.me/593969043453?text=Hola%20ATOMIC!%20Deseo%20informaci%C3%B3n."
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
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
          className="flex items-center gap-1 text-[11px] font-bold text-pink-600 hover:text-pink-700 transition-colors"
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
          className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 transition-colors"
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
          className="w-6.5 h-6.5 rounded-full bg-black text-white flex items-center justify-center shadow-sm hover:scale-105 transition-transform"
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
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-md bg-white text-slate-900 rounded-2xl p-5 shadow-2xl border border-slate-200 max-h-[85vh] overflow-y-auto"
            >
              <button
                onClick={() => setModalType(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600"
              >
                <X size={16} />
              </button>

              {/* MODAL 1: SOBRE NOSOTROS */}
              {modalType === 'nosotros' && (
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                    <Award size={20} />
                  </div>
                  <h3 className="text-lg font-black uppercase text-slate-900">Sobre Nosotros — ATOMIC</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    ATOMIC es una marca ecuatoriana especializada en <strong>Tecnología, Industria y Hogar</strong>. Comercializamos e importamos equipos biométricos, automatización de accesos, consolas gaming, electrodomésticos de cocina y soluciones de software a medida.
                  </p>
                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-center">
                      <span className="block font-black text-base text-indigo-600">+10,000</span>
                      <span className="text-[9px] text-slate-500 uppercase font-bold">Clientes Satisfechos</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-center">
                      <span className="block font-black text-base text-indigo-600">100%</span>
                      <span className="text-[9px] text-slate-500 uppercase font-bold">Garantía Directa</span>
                    </div>
                  </div>
                </div>
              )}

              {/* MODAL 2: UBICACIÓN */}
              {modalType === 'ubicacion' && (
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                    <MapPin size={20} />
                  </div>
                  <h3 className="text-lg font-black uppercase text-slate-900">Nuestra Ubicación & Cobertura</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Despachamos pedidos diariamente a todo el Ecuador con cobertura garantizada en las principales provincias.
                  </p>
                  <div className="space-y-2 pt-1 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2.5">
                      <MapPin className="text-red-600 shrink-0" size={16} />
                      <div>
                        <strong className="block text-slate-900">Matriz Principal:</strong>
                        <span className="text-slate-500">Quito, Ecuador — Envíos a Nivel Nacional</span>
                      </div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2.5">
                      <Truck className="text-blue-600 shrink-0" size={16} />
                      <div>
                        <strong className="block text-slate-900">Agencias de Envío:</strong>
                        <span className="text-slate-500">Servientrega, Transporte Interprovincial & Directo</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* MODAL 3: REFERENCIAS */}
              {modalType === 'referencias' && (
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                    <Star size={20} />
                  </div>
                  <h3 className="text-lg font-black uppercase text-slate-900">Referencias & Testimonios</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Conoce las valoraciones reales de nuestros clientes en todo Ecuador.
                  </p>
                  <div className="space-y-2 pt-1">
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <strong className="text-slate-900">Carlos M. (Quito)</strong>
                        <span className="text-amber-500 text-xs">★★★★★</span>
                      </div>
                      <p className="text-slate-600 text-[11px]">
                        &quot;Compré el Kit de Control de Acceso ZKTECO para mi edificio. Llegó al día siguiente y la asesoría por WhatsApp fue excelente.&quot;
                      </p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <strong className="text-slate-900">Sofía V. (Guayaquil)</strong>
                        <span className="text-amber-500 text-xs">★★★★★</span>
                      </div>
                      <p className="text-slate-600 text-[11px]">
                        &quot;Mi PS5 Slim llegó 100% nueva y sellada de paquete. Total confianza con ATOMIC.&quot;
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* MODAL 4: CONTACTO */}
              {modalType === 'contacto' && (
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <Phone size={20} />
                  </div>
                  <h3 className="text-lg font-black uppercase text-slate-900">Canales de Contacto Directo</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Comunícate con nuestro equipo comercial para cotizaciones o soporte técnico.
                  </p>
                  <div className="space-y-2 pt-1">
                    <a
                      href="https://wa.me/593969043453?text=Hola%20ATOMIC!%20Deseo%20informaci%C3%B3n."
                      target="_blank"
                      rel="noreferrer"
                      className="w-full p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase flex items-center justify-center gap-2 transition-all shadow-sm"
                    >
                      <MessageCircle size={16} /> Chatear por WhatsApp (+593 96 904 3453)
                    </a>
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono space-y-1">
                      <div className="flex items-center gap-2 text-slate-700">
                        <Mail size={13} /> ventas@atomic.com.ec
                      </div>
                      <div className="flex items-center gap-2 text-slate-700">
                        <Phone size={13} /> +593 96 904 3453
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* MODAL 5: CART */}
              {modalType === 'cart' && (
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                    <ShoppingCart size={20} />
                  </div>
                  <h3 className="text-lg font-black uppercase text-slate-900">Carrito de Compras</h3>
                  <p className="text-xs text-slate-600 font-medium">
                    Tienes <strong>{totalItems}</strong> productos agregados al carrito.
                  </p>
                  <div className="pt-1">
                    <Link
                      href="/web/cart"
                      onClick={() => setModalType(null)}
                      className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase rounded-xl transition-all text-center block shadow-sm"
                    >
                      Ir a Finalizar Compra
                    </Link>
                  </div>
                </div>
              )}

              {/* MODAL 6: PROFILE */}
              {modalType === 'profile' && (
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                    <User size={20} />
                  </div>
                  <h3 className="text-lg font-black uppercase text-slate-900">Mi Cuenta ATOMIC</h3>
                  <p className="text-xs text-slate-600 font-medium">
                    Inicia sesión para ver tu historial de pedidos y guardar cotizaciones.
                  </p>
                  <div className="pt-1">
                    <Link
                      href="/login"
                      onClick={() => setModalType(null)}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase rounded-xl transition-all text-center block shadow-sm"
                    >
                      Iniciar Sesión / Registro
                    </Link>
                  </div>
                </div>
              )}

              {/* MODAL 7: ENVIOS */}
              {modalType === 'envios' && (
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                    <Truck size={20} />
                  </div>
                  <h3 className="text-lg font-black uppercase text-slate-900">Seguimiento & Envíos</h3>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    Realizamos envíos a todo Ecuador con número de guía en tiempo real para rastrear tu paquete.
                  </p>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono">
                    <span className="block font-bold text-slate-900 mb-0.5">Empresas Aliadas:</span>
                    <span className="text-slate-600">Servientrega · Envíos Express · Cooperativas</span>
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
