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

/* ── ATOMIC ATOM LOGO SVG ── */
function AtomicLogoSVG() {
  return (
    <svg width="40" height="40" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <circle cx="36" cy="36" r="6" fill="#FFFFFF" className="animate-pulse" />
      <ellipse cx="36" cy="36" rx="30" ry="10" stroke="#FFFFFF" strokeWidth="2" fill="none" />
      <ellipse cx="36" cy="36" rx="30" ry="10" stroke="#FFFFFF" strokeWidth="2" fill="none" transform="rotate(60 36 36)" />
      <ellipse cx="36" cy="36" rx="30" ry="10" stroke="#FFFFFF" strokeWidth="2" fill="none" transform="rotate(120 36 36)" />
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

  // Auto-close hamburger menu on resize or navigation
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

  // 12 Top Category Grid Items
  const categoryGridItems = [
    { id: 'industrial', title: 'INDUSTRIAL', sub: 'Automatización & Lubricación', icon: Factory, color: 'from-orange-500/20 to-red-500/20', borderColor: 'border-orange-500/30', href: '#industrial' },
    { id: 'servicios', title: 'SERVICIOS', sub: 'Asesoría & Especialización', icon: Award, color: 'from-blue-500/20 to-cyan-500/20', borderColor: 'border-blue-500/30', href: '#servicios' },
    { id: 'computacion', title: 'COMPUTACIÓN', sub: 'Laptops & Monitores', icon: Laptop, color: 'from-purple-500/20 to-indigo-500/20', borderColor: 'border-purple-500/30', href: '/web/cpus' },
    { id: 'telefonia', title: 'TELEFONÍA', sub: 'Celulares & Tablets', icon: Smartphone, color: 'from-emerald-500/20 to-teal-500/20', borderColor: 'border-emerald-500/30', href: '/web/phones' },
    { id: 'minipc', title: 'MINI PC', sub: 'Sistemas Compactos', icon: Cpu, color: 'from-amber-500/20 to-yellow-500/20', borderColor: 'border-amber-500/30', href: '/web/cpus' },
    { id: 'monitores', title: 'MONITORES', sub: 'Pantallas HD & Gaming', icon: Laptop, color: 'from-sky-500/20 to-blue-500/20', borderColor: 'border-sky-500/30', href: '/web/cpus' },
    { id: 'tablets-infantiles', title: 'TABLETS INFANTILES', sub: 'Edición Niños', icon: Smartphone, color: 'from-pink-500/20 to-rose-500/20', borderColor: 'border-pink-500/30', href: '/web/phones' },
    { id: 'portones-automaticos', title: 'PORTONES AUTOMÁTICOS', sub: 'Control de Acceso', icon: Lock, color: 'from-slate-500/20 to-zinc-500/20', borderColor: 'border-slate-500/30', href: '/web/intercomunicacion' },
    { id: 'hogar', title: 'HOGAR', sub: 'Iluminación & Cocina', icon: Utensils, color: 'from-amber-500/20 to-orange-500/20', borderColor: 'border-amber-500/30', href: '/web/cocinas' },
    { id: 'software', title: 'SOFTWARE', sub: 'Systems & Web Apps', icon: Code, color: 'from-cyan-500/20 to-blue-500/20', borderColor: 'border-cyan-500/30', href: '/web/software' },
    { id: 'tecnologia-residencial', title: 'TECNOLOGÍA RESIDENCIAL', sub: 'Alarmas & Perimetrales', icon: Shield, color: 'from-emerald-500/20 to-green-500/20', borderColor: 'border-emerald-500/30', href: '/web/conjuntos-smart' },
    { id: 'electronica', title: 'ELECTRÓNICA', sub: 'Microcomputadores & Cables', icon: Zap, color: 'from-red-500/20 to-pink-500/20', borderColor: 'border-red-500/30', href: '#electronica' },
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
    <div className="w-full bg-[#f4f5f8] min-h-screen text-slate-900 font-sans selection:bg-red-500 selection:text-white pb-24">

      {/* ═════════════════════════════════════════════════════════════ */}
      {/* 🔴 HEADER BAR: ATOMIC BRANDED CRIMSON RED NAV (#DC2626)       */}
      {/* ═════════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 bg-[#dc2626] text-white shadow-xl border-b border-red-700 px-3 md:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">

          {/* LEFT: HAMBURGER & LOGO */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsHamburgerOpen(true)}
              className="p-2 rounded-xl bg-red-700/80 hover:bg-red-800 transition-all text-white shadow-md active:scale-95"
              aria-label="Abrir Menú"
            >
              <Menu size={24} />
            </button>

            <Link href="/web" className="flex items-center gap-2 group">
              <AtomicLogoSVG />
              <div className="flex flex-col">
                <span className="text-xl md:text-2xl font-black tracking-tight leading-none uppercase font-mono">
                  ATOMIC
                </span>
                <span className="text-[10px] md:text-xs font-semibold opacity-90 tracking-tight leading-tight">
                  Tecnología, industria y Hogar
                </span>
              </div>
            </Link>
          </div>

          {/* CENTER: SEARCH INPUT BAR */}
          <div className="flex-1 max-w-xl mx-2 md:mx-6 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar..."
              className="w-full bg-white text-slate-900 border border-red-200 rounded-full py-2 md:py-2.5 pl-10 pr-10 text-xs md:text-sm font-medium shadow-inner outline-none focus:ring-2 focus:ring-red-300 transition-all"
            />
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* RIGHT ACTION ICONS: PROFILE, CART, SHIPPING */}
          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={() => setModalType('profile')}
              className="p-2 md:p-2.5 rounded-full bg-red-700/90 hover:bg-red-800 transition-all text-white shadow-md hover:scale-105 active:scale-95"
              title="Perfil de Usuario"
            >
              <User size={20} />
            </button>

            <button
              onClick={() => setModalType('cart')}
              className="p-2 md:p-2.5 rounded-full bg-red-700/90 hover:bg-red-800 transition-all text-white shadow-md relative hover:scale-105 active:scale-95"
              title="Carrito de Compras"
            >
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-400 text-red-950 font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-red-600 shadow-md">
                  {totalItems}
                </span>
              )}
            </button>

            <button
              onClick={() => setModalType('envios')}
              className="p-2 md:p-2.5 rounded-full bg-red-700/90 hover:bg-red-800 transition-all text-white shadow-md hover:scale-105 active:scale-95"
              title="Seguimiento de Envíos"
            >
              <Truck size={20} />
            </button>
          </div>

        </div>
      </header>

      {/* ═════════════════════════════════════════════════════════════ */}
      {/* 📌 MINI TABS NAVIGATION BAR: CATEGORIAS | LANDING PAGES | OFERTAS */}
      {/* ═════════════════════════════════════════════════════════════ */}
      <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-[61px] z-40 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center md:justify-start gap-6 md:gap-12 py-3">

          <button
            onClick={() => setActiveTab('categorias')}
            className={`font-black text-xs md:text-sm tracking-wider uppercase transition-all pb-1 border-b-2 ${
              activeTab === 'categorias'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-slate-700 hover:text-slate-900'
            }`}
          >
            CATEGORIAS
          </button>

          <button
            onClick={() => setActiveTab('landings')}
            className={`font-black text-xs md:text-sm tracking-wider uppercase transition-all pb-1 border-b-2 ${
              activeTab === 'landings'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-slate-700 hover:text-slate-900'
            }`}
          >
            LANDING PAGES
          </button>

          <button
            onClick={() => setActiveTab('ofertas')}
            className={`font-black text-xs md:text-sm tracking-wider uppercase transition-all pb-1 border-b-2 ${
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
      {/* MAIN CONTAINER AREA                                           */}
      {/* ═════════════════════════════════════════════════════════════ */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-6">

        {/* SEARCH OVERRIDE RESULTS VIEW */}
        {searchQuery.trim() ? (
          <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200 mb-8">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
              <h2 className="text-lg font-black text-slate-900 uppercase">
                Resultados para: &quot;<span className="text-red-600">{searchQuery}</span>&quot;
              </h2>
              <span className="text-xs font-bold text-slate-500 font-mono">
                {filteredProducts.length} productos encontrados
              </span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                No se encontraron productos que coincidan con la búsqueda.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredProducts.slice(0, 40).map(p => (
                  <div key={p.id} className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col justify-between hover:border-red-500 transition-all">
                    <div>
                      <span className="text-[9px] font-mono text-red-600 uppercase font-bold block mb-1">
                        {p.category?.name || 'General'}
                      </span>
                      <h4 className="font-bold text-xs text-slate-900 line-clamp-2 mb-2">{p.name}</h4>
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900 mb-3">${(p.price || 0).toFixed(2)}</p>
                      <a
                        href={`https://wa.me/593969043453?text=${encodeURIComponent(`Hola ATOMIC! Deseo cotizar: ${p.name} ($${(p.price || 0).toFixed(2)})`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] uppercase rounded-lg transition-all text-center flex items-center justify-center gap-1 shadow-sm"
                      >
                        <MessageCircle size={14} /> Cotizar
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}

        {/* ═════════════════════════════════════════════════════════════ */}
        {/* TAB 1: CATEGORIAS VIEW (MATCHING THE USER REFERENCE GRAPHIC) */}
        {/* ═════════════════════════════════════════════════════════════ */}
        {!searchQuery.trim() && activeTab === 'categorias' && (
          <div className="space-y-6">

            {/* TOP 12 HYPERMODERN CATEGORY CARDS GRID */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
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
                    className={`bg-white border ${item.borderColor} p-4 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col items-center justify-center text-center group cursor-pointer`}
                  >
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-red-600 mb-2.5 group-hover:scale-110 transition-transform shadow-inner`}>
                      <Icon size={24} />
                    </div>
                    <h3 className="font-black text-xs text-slate-900 uppercase tracking-tight group-hover:text-red-600 transition-colors">
                      {item.title}
                    </h3>
                    <span className="text-[10px] text-slate-500 font-medium mt-0.5 line-clamp-1">
                      {item.sub}
                    </span>
                  </Link>
                )
              })}
            </div>

            {/* MAIN 3-COLUMN CONTENT BREAKDOWN (EXACT FAITHFUL REPRODUCTION OF GRAPHIC) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">

              {/* COLUMN 1 */}
              <div className="space-y-6">
                
                {/* INDUSTRIAL CARD */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <h3 className="font-black text-base text-red-700 uppercase tracking-tight flex items-center gap-2">
                    <Factory size={18} /> INDUSTRIAL
                  </h3>
                  <ul className="space-y-1.5 text-xs text-slate-800 font-bold">
                    <li className="flex items-center gap-2 hover:text-red-600 cursor-pointer" onClick={() => setSelectedCategoryFilter('Automatización')}>
                      <span className="text-red-500">•</span> Automatización
                    </li>
                    <li className="flex items-center gap-2 hover:text-red-600 cursor-pointer" onClick={() => setSelectedCategoryFilter('Lubricación')}>
                      <span className="text-red-500">•</span> Lubricación
                    </li>
                    <li className="flex items-center gap-2 hover:text-red-600 cursor-pointer" onClick={() => setSelectedCategoryFilter('Generadores')}>
                      <span className="text-red-500">•</span> Generadores
                    </li>
                  </ul>
                </div>

                {/* SERVICIOS CARD */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <h3 className="font-black text-base text-red-700 uppercase tracking-tight flex items-center gap-2">
                    <Award size={18} /> SERVICIOS
                  </h3>
                  <ul className="space-y-1.5 text-xs text-slate-800 font-bold">
                    <li className="flex items-center gap-2 hover:text-red-600 cursor-pointer" onClick={() => setSelectedCategoryFilter('Asesoría')}>
                      <span className="text-red-500">•</span> Asesoría
                    </li>
                    <li className="flex items-center gap-2 hover:text-red-600 cursor-pointer" onClick={() => setSelectedCategoryFilter('Especialización')}>
                      <span className="text-red-500">•</span> Especialización
                    </li>
                    <li className="flex items-center gap-2 hover:text-red-600 cursor-pointer" onClick={() => setSelectedCategoryFilter('Peritaciones')}>
                      <span className="text-red-500">•</span> Peritaciones
                    </li>
                  </ul>
                </div>

                {/* TELEFONÍA CARD */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <h3 className="font-black text-base text-red-700 uppercase tracking-tight flex items-center gap-2">
                    <Smartphone size={18} /> TELEFONÍA
                  </h3>
                  <ul className="space-y-1.5 text-xs text-slate-800 font-bold">
                    <li className="flex items-center gap-2 hover:text-red-600 cursor-pointer" onClick={() => setSelectedCategoryFilter('Celulares')}>
                      <span className="text-red-500">•</span> Celulares
                    </li>
                    <li className="flex items-center gap-2 hover:text-red-600 cursor-pointer" onClick={() => setSelectedCategoryFilter('Tablets')}>
                      <span className="text-red-500">•</span> Tablets
                    </li>
                    <li className="flex items-center gap-2 hover:text-red-600 cursor-pointer" onClick={() => setSelectedCategoryFilter('Tablets infantiles')}>
                      <span className="text-red-500">•</span> Tablets infantiles
                    </li>
                  </ul>
                </div>

              </div>

              {/* COLUMN 2 */}
              <div className="space-y-6">
                
                {/* HOGAR CARD */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <h3 className="font-black text-base text-red-700 uppercase tracking-tight flex items-center gap-2">
                    <Utensils size={18} /> HOGAR
                  </h3>
                  <ul className="space-y-1.5 text-xs text-slate-800 font-bold">
                    <li className="flex items-center gap-2 hover:text-red-600 cursor-pointer" onClick={() => setSelectedCategoryFilter('Iluminación')}>
                      <span>💡</span> Iluminación
                    </li>
                    <li className="flex items-center gap-2 hover:text-red-600 cursor-pointer" onClick={() => setSelectedCategoryFilter('Cocina')}>
                      <span>🍳</span> Cocina
                    </li>
                    <li className="flex items-center gap-2 hover:text-red-600 cursor-pointer" onClick={() => setSelectedCategoryFilter('Domotica')}>
                      <span>🏠</span> Domotica
                    </li>
                    <li className="flex items-center gap-2 hover:text-red-600 cursor-pointer" onClick={() => setSelectedCategoryFilter('Entretenimiento')}>
                      <span>🎮</span> Entretenimiento
                    </li>
                  </ul>
                </div>

                {/* SOFTWARE CARD */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <h3 className="font-black text-base text-red-700 uppercase tracking-tight flex items-center gap-2">
                    <Code size={18} /> SOFTWARE
                  </h3>
                  <ul className="space-y-1.5 text-xs text-slate-800 font-bold">
                    <li className="flex items-center gap-2 hover:text-red-600 cursor-pointer" onClick={() => setSelectedCategoryFilter('Automatización')}>
                      <span className="text-red-500">•</span> Automatización
                    </li>
                    <li className="flex items-center gap-2 hover:text-red-600 cursor-pointer" onClick={() => setSelectedCategoryFilter('Tienda en línea')}>
                      <span className="text-red-500">•</span> Tienda en línea
                    </li>
                    <li className="flex items-center gap-2 hover:text-red-600 cursor-pointer" onClick={() => setSelectedCategoryFilter('Systems')}>
                      <span className="text-red-500">•</span> Systems
                    </li>
                  </ul>
                </div>

                {/* COMPUTACIÓN CARD */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <h3 className="font-black text-base text-red-700 uppercase tracking-tight flex items-center gap-2">
                    <Laptop size={18} /> COMPUTACIÓN
                  </h3>
                  <ul className="space-y-1.5 text-xs text-slate-800 font-bold">
                    <li className="flex items-center gap-2 hover:text-red-600 cursor-pointer" onClick={() => setSelectedCategoryFilter('Laptops')}>
                      <span className="text-red-500">•</span> Laptops
                    </li>
                    <li className="flex items-center gap-2 hover:text-red-600 cursor-pointer" onClick={() => setSelectedCategoryFilter('Portátiles PC')}>
                      <span className="text-red-500">•</span> Portátiles PC
                    </li>
                    <li className="flex items-center gap-2 hover:text-red-600 cursor-pointer" onClick={() => setSelectedCategoryFilter('Monitores')}>
                      <span className="text-red-500">•</span> Monitores
                    </li>
                    <li className="flex items-center gap-2 hover:text-red-600 cursor-pointer" onClick={() => setSelectedCategoryFilter('Impresoras')}>
                      <span className="text-red-500">•</span> Impresoras
                    </li>
                    <li className="flex items-center gap-2 hover:text-red-600 cursor-pointer" onClick={() => setSelectedCategoryFilter('Mini PC')}>
                      <span className="text-red-500">•</span> Mini PC
                    </li>
                  </ul>
                </div>

              </div>

              {/* COLUMN 3 */}
              <div className="space-y-6">
                
                {/* TECNOLOGÍA RESIDENCIAL CARD */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <h3 className="font-black text-base text-red-700 uppercase tracking-tight flex items-center gap-2">
                    <Shield size={18} /> TECNOLOGÍA RESIDENCIAL
                  </h3>
                  <ul className="space-y-1.5 text-xs text-slate-800 font-bold">
                    <li className="flex items-center gap-2 hover:text-red-600 cursor-pointer" onClick={() => setSelectedCategoryFilter('Portones')}>
                      <span className="text-red-500">•</span> Portones
                    </li>
                    <li className="flex items-center gap-2 hover:text-red-600 cursor-pointer" onClick={() => setSelectedCategoryFilter('Alarmas')}>
                      <span className="text-red-500">•</span> Alarmas
                    </li>
                    <li className="flex items-center gap-2 hover:text-red-600 cursor-pointer" onClick={() => setSelectedCategoryFilter('Perimetrales')}>
                      <span className="text-red-500">•</span> Perimetrales
                    </li>
                  </ul>
                </div>

                {/* ELECTRÓNICA CARD */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <h3 className="font-black text-base text-red-700 uppercase tracking-tight flex items-center gap-2">
                    <Zap size={18} /> ELECTRÓNICA
                  </h3>
                  <ul className="space-y-1.5 text-xs text-slate-800 font-bold">
                    <li className="flex items-center gap-2 hover:text-red-600 cursor-pointer" onClick={() => setSelectedCategoryFilter('Microcomputadores')}>
                      <span className="text-red-500">•</span> Microcomputadores
                    </li>
                    <li className="flex items-center gap-2 hover:text-red-600 cursor-pointer" onClick={() => setSelectedCategoryFilter('Cables')}>
                      <span className="text-red-500">•</span> Cables
                    </li>
                    <li className="flex items-center gap-2 hover:text-red-600 cursor-pointer" onClick={() => setSelectedCategoryFilter('Adaptadores')}>
                      <span className="text-red-500">•</span> Adaptadores
                    </li>
                    <li className="flex items-center gap-2 hover:text-red-600 cursor-pointer" onClick={() => setSelectedCategoryFilter('Cargadores')}>
                      <span className="text-red-500">•</span> Cargadores
                    </li>
                  </ul>
                </div>

                {/* TODOS LOS ARTÍCULOS BOX (DEFAULT OPEN ACCORDION IN REFERENCE IMAGE) */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
                  <button
                    onClick={() => setIsTodosArticulosOpen(!isTodosArticulosOpen)}
                    className="w-full flex items-center justify-between text-left font-black text-base text-red-700 uppercase tracking-tight"
                  >
                    <span>TODOS LOS ARTÍCULOS</span>
                    <ChevronDown size={18} className={`transition-transform ${isTodosArticulosOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isTodosArticulosOpen && (
                    <div className="pt-2 border-t border-slate-100 space-y-2 max-h-60 overflow-y-auto pr-2">
                      <ul className="space-y-1 text-xs text-slate-700 font-medium">
                        {allItemsList.map((item, idx) => (
                          <li
                            key={idx}
                            onClick={() => setSelectedCategoryFilter(item)}
                            className="hover:text-red-600 cursor-pointer flex items-center gap-1.5"
                          >
                            <span className="text-slate-400">-</span> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* 🟣 BOTTOM PURPLE/INDIGO PILL BUTTONS (MATCHING GRAPHIC) */}
                <div className="space-y-2.5 pt-2">

                  <button
                    onClick={() => setModalType('nosotros')}
                    className="w-full py-3 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-between transition-all shadow-md active:scale-98"
                  >
                    <span>Sobre nosotros</span>
                    <ChevronDown size={16} />
                  </button>

                  <button
                    onClick={() => setModalType('ubicacion')}
                    className="w-full py-3 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-between transition-all shadow-md active:scale-98"
                  >
                    <span>Ubicación</span>
                    <ChevronDown size={16} />
                  </button>

                  <button
                    onClick={() => setModalType('referencias')}
                    className="w-full py-3 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-between transition-all shadow-md active:scale-98"
                  >
                    <span>Referencias</span>
                    <ChevronDown size={16} />
                  </button>

                  <button
                    onClick={() => setModalType('contacto')}
                    className="w-full py-3 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-between transition-all shadow-md active:scale-98"
                  >
                    <span>Contacto</span>
                    <ChevronDown size={16} />
                  </button>

                  <button
                    onClick={() => setIsTodosArticulosOpen(!isTodosArticulosOpen)}
                    className="w-full py-3 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-between transition-all shadow-md active:scale-98"
                  >
                    <span>Todos los Artículos</span>
                    <ChevronDown size={16} />
                  </button>

                </div>

              </div>

            </div>

          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════ */}
        {/* TAB 2: LANDING PAGES VIEW (HYPERMODERN INTERACTIVE CARDS)     */}
        {/* ═════════════════════════════════════════════════════════════ */}
        {!searchQuery.trim() && activeTab === 'landings' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-1">
                Catálogo de Landing Pages Especializadas
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Explora las secciones interactivas creadas para líneas de productos de alta demanda
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {landingPagesList.map((lp, idx) => (
                <Link
                  key={idx}
                  href={lp.url}
                  className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-red-500 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl">{lp.image}</span>
                      <span className="text-[9px] font-black font-mono bg-red-100 text-red-700 px-2 py-0.5 rounded-full border border-red-200">
                        {lp.tag}
                      </span>
                    </div>
                    <h3 className="font-black text-sm text-slate-900 uppercase tracking-tight group-hover:text-red-600 transition-colors mb-1">
                      {lp.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium mb-4">
                      {lp.sub}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs font-bold text-red-600">
                    <span>Ver Landing Page</span>
                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
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
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-red-600 to-amber-600 text-white p-6 rounded-2xl shadow-lg">
              <h2 className="text-xl font-black uppercase tracking-tight mb-1">
                🔥 Promociones & Kits de Oferta Especial
              </h2>
              <p className="text-xs text-red-100 font-medium">
                Descuentos directos en equipos seleccionados con asesoría e instalación en todo Ecuador
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              
              {/* Promo Kit 1 */}
              <div className="bg-white border-2 border-red-200 p-5 rounded-2xl shadow-sm space-y-4">
                <div className="inline-block bg-red-100 text-red-700 font-mono text-[10px] font-black px-2.5 py-1 rounded-full uppercase">
                  KIT OFERTA #1 GAMING
                </div>
                <h3 className="font-black text-lg text-slate-900 uppercase">
                  Consola PS5 Slim 1TB + Mando Extra DualSense
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Incluye consola original sellada de paquete + 2 mandos DualSense originales + cable HDMI 2.1 de alta velocidad.
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <span className="text-2xl font-black text-red-600">$755.00</span>
                  <a
                    href="https://wa.me/593969043453?text=Hola%20ATOMIC!%20Deseo%20cotizar%20el%20KIT%20OFERTA%20PS5%20Slim%20+%20Mando"
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase rounded-xl transition-all shadow-md"
                  >
                    💬 Pedir por WhatsApp
                  </a>
                </div>
              </div>

              {/* Promo Kit 2 */}
              <div className="bg-white border-2 border-amber-200 p-5 rounded-2xl shadow-sm space-y-4">
                <div className="inline-block bg-amber-100 text-amber-800 font-mono text-[10px] font-black px-2.5 py-1 rounded-full uppercase">
                  KIT OFERTA #2 SEGURIDAD
                </div>
                <h3 className="font-black text-lg text-slate-900 uppercase">
                  Control de Acceso Biométrico ZKTECO + Cerradura
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Lectura facial, huella dactilar, tarjetas RFID y apertura desde la App para puertas de vidrio o madera.
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <span className="text-2xl font-black text-amber-600">$185.00</span>
                  <a
                    href="https://wa.me/593969043453?text=Hola%20ATOMIC!%20Deseo%20cotizar%20el%20Kit%20ZKTECO%20Biometrico"
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase rounded-xl transition-all shadow-md"
                  >
                    💬 Pedir por WhatsApp
                  </a>
                </div>
              </div>

              {/* Promo Kit 3 */}
              <div className="bg-white border-2 border-blue-200 p-5 rounded-2xl shadow-sm space-y-4">
                <div className="inline-block bg-blue-100 text-blue-800 font-mono text-[10px] font-black px-2.5 py-1 rounded-full uppercase">
                  KIT OFERTA #3 COCINA
                </div>
                <h3 className="font-black text-lg text-slate-900 uppercase">
                  Encimera a Gas 4 Hornillas + Horno Empotrable
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Línea de lujo en acero inoxidable con encendido electrónico y dimensiones estándar para cocina.
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <span className="text-2xl font-black text-blue-600">$420.00</span>
                  <a
                    href="https://wa.me/593969043453?text=Hola%20ATOMIC!%20Deseo%20cotizar%20el%20Kit%20Encimera%20+%20Horno"
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase rounded-xl transition-all shadow-md"
                  >
                    💬 Pedir por WhatsApp
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
              className="fixed top-0 left-0 bottom-0 z-50 w-80 max-w-[85vw] bg-white text-slate-900 shadow-2xl flex flex-col justify-between overflow-y-auto"
            >
              <div className="p-5 space-y-6">

                {/* Drawer Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-black text-xs">
                      A
                    </div>
                    <div>
                      <h3 className="font-black text-sm text-slate-900 leading-none">ATOMIC</h3>
                      <p className="text-[10px] text-slate-500">Menú Principal</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsHamburgerOpen(false)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Hamburger Navigation Sections */}
                <div className="space-y-4">

                  {/* Section 1: Todos los Artículos (Default Expanded Accordion) */}
                  <div className="border border-slate-200 rounded-xl p-3 bg-slate-50">
                    <button
                      onClick={() => setIsTodosArticulosOpen(!isTodosArticulosOpen)}
                      className="w-full flex items-center justify-between font-black text-xs text-red-600 uppercase"
                    >
                      <span>Todos los artículos</span>
                      <ChevronDown size={16} className={`transition-transform ${isTodosArticulosOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isTodosArticulosOpen && (
                      <div className="mt-3 pt-2 border-t border-slate-200 space-y-1.5 max-h-48 overflow-y-auto pr-1">
                        {allItemsList.map((item, idx) => (
                          <div
                            key={idx}
                            onClick={() => {
                              setSelectedCategoryFilter(item);
                              setIsHamburgerOpen(false);
                            }}
                            className="text-xs text-slate-700 hover:text-red-600 font-medium cursor-pointer py-1 px-2 rounded hover:bg-white"
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
                    className="w-full text-left p-3 rounded-xl bg-slate-100 hover:bg-indigo-50 text-indigo-950 font-bold text-xs uppercase flex items-center justify-between border border-slate-200"
                  >
                    <span>Sobre nosotros</span>
                    <ChevronRight size={16} />
                  </button>

                  {/* Section 3: Ubicación */}
                  <button
                    onClick={() => { setModalType('ubicacion'); setIsHamburgerOpen(false); }}
                    className="w-full text-left p-3 rounded-xl bg-slate-100 hover:bg-indigo-50 text-indigo-950 font-bold text-xs uppercase flex items-center justify-between border border-slate-200"
                  >
                    <span>Ubicación</span>
                    <ChevronRight size={16} />
                  </button>

                  {/* Section 4: Referencias */}
                  <button
                    onClick={() => { setModalType('referencias'); setIsHamburgerOpen(false); }}
                    className="w-full text-left p-3 rounded-xl bg-slate-100 hover:bg-indigo-50 text-indigo-950 font-bold text-xs uppercase flex items-center justify-between border border-slate-200"
                  >
                    <span>Referencias</span>
                    <ChevronRight size={16} />
                  </button>

                  {/* Section 5: Contacto */}
                  <button
                    onClick={() => { setModalType('contacto'); setIsHamburgerOpen(false); }}
                    className="w-full text-left p-3 rounded-xl bg-slate-100 hover:bg-indigo-50 text-indigo-950 font-bold text-xs uppercase flex items-center justify-between border border-slate-200"
                  >
                    <span>Contacto</span>
                    <ChevronRight size={16} />
                  </button>

                </div>

              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-slate-200 bg-slate-50 text-center">
                <p className="text-[10px] text-slate-500 font-mono uppercase font-bold">
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
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-white/95 backdrop-blur-md border border-slate-200 rounded-full px-4 py-2 shadow-2xl flex items-center gap-4">
        
        {/* WhatsApp */}
        <a
          href="https://wa.me/593969043453?text=Hola%20ATOMIC!%20Deseo%20informaci%C3%B3n."
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
          title="WhatsApp"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
            💬
          </div>
          <span className="hidden sm:inline">WhatsApp</span>
        </a>

        {/* Instagram */}
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 text-xs font-bold text-pink-600 hover:text-pink-700 transition-colors"
          title="Instagram"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shadow-md">
            📷
          </div>
          <span className="hidden sm:inline">Instagram</span>
        </a>

        {/* Ubicación */}
        <button
          onClick={() => setModalType('ubicacion')}
          className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
          title="Ubicación"
        >
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md">
            📍
          </div>
          <span className="hidden sm:inline">Ubicación</span>
        </button>

        {/* Facebook */}
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noreferrer"
          className="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center shadow-md hover:scale-105 transition-transform"
          title="Facebook"
        >
          <span className="font-black text-sm">f</span>
        </a>

        {/* TikTok */}
        <a
          href="https://tiktok.com"
          target="_blank"
          rel="noreferrer"
          className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center shadow-md hover:scale-105 transition-transform"
          title="TikTok"
        >
          <span className="font-black text-xs">🎵</span>
        </a>

      </div>

      {/* ═════════════════════════════════════════════════════════════ */}
      {/* 🪟 INTERACTIVE MODALS FOR PILL BUTTONS & ICON ACTIONS         */}
      {/* ═════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {modalType && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalType(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative z-10 w-full max-w-lg bg-white text-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 max-h-[85vh] overflow-y-auto"
            >
              <button
                onClick={() => setModalType(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600"
              >
                <X size={18} />
              </button>

              {/* MODAL 1: SOBRE NOSOTROS */}
              {modalType === 'nosotros' && (
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                    <Award size={24} />
                  </div>
                  <h3 className="text-xl font-black uppercase text-slate-900">Sobre Nosotros — ATOMIC</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    ATOMIC es una marca ecuatoriana especializada en <strong>Tecnología, Industria y Hogar</strong>. Comercializamos e importamos equipos biométricos, automatización de accesos, consolas gaming, electrodomésticos de cocina y soluciones de software a medida.
                  </p>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                      <span className="block font-black text-lg text-indigo-600">+10,000</span>
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Clientes Satisfechos</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                      <span className="block font-black text-lg text-indigo-600">100%</span>
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Garantía Directa</span>
                    </div>
                  </div>
                </div>
              )}

              {/* MODAL 2: UBICACIÓN */}
              {modalType === 'ubicacion' && (
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
                    <MapPin size={24} />
                  </div>
                  <h3 className="text-xl font-black uppercase text-slate-900">Nuestra Ubicación & Cobertura</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Despachamos pedidos diariamente a todo el Ecuador con cobertura garantizada en las principales provincias.
                  </p>
                  <div className="space-y-2 pt-2 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                      <MapPin className="text-red-600 shrink-0" size={18} />
                      <div>
                        <strong className="block text-slate-900">Matriz Principal:</strong>
                        <span className="text-slate-500">Quito, Ecuador — Envíos a Nivel Nacional</span>
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                      <Truck className="text-blue-600 shrink-0" size={18} />
                      <div>
                        <strong className="block text-slate-900">Agencias de Envío:</strong>
                        <span className="text-slate-500">Servientrega, Transporte Interprovincial & Envíos Directos</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* MODAL 3: REFERENCIAS */}
              {modalType === 'referencias' && (
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
                    <Star size={24} />
                  </div>
                  <h3 className="text-xl font-black uppercase text-slate-900">Referencias & Testimonios</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Conoce las valoraciones reales de nuestros clientes en todo Ecuador.
                  </p>
                  <div className="space-y-3 pt-2">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <strong className="text-slate-900">Carlos M. (Quito)</strong>
                        <span className="text-amber-500">★★★★★</span>
                      </div>
                      <p className="text-slate-600 text-[11px]">
                        &quot;Compré el Kit de Control de Acceso ZKTECO para mi edificio. Llegó al día siguiente y la asesoría por WhatsApp fue excelente.&quot;
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <strong className="text-slate-900">Sofía V. (Guayaquil)</strong>
                        <span className="text-amber-500">★★★★★</span>
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
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <Phone size={24} />
                  </div>
                  <h3 className="text-xl font-black uppercase text-slate-900">Canales de Contacto Directo</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Comunícate con nuestro equipo comercial para cotizaciones o soporte técnico.
                  </p>
                  <div className="space-y-2 pt-2">
                    <a
                      href="https://wa.me/593969043453?text=Hola%20ATOMIC!%20Deseo%20informaci%C3%B3n."
                      target="_blank"
                      rel="noreferrer"
                      className="w-full p-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase flex items-center justify-center gap-2 transition-all shadow-md"
                    >
                      <MessageCircle size={18} /> Chatear por WhatsApp (+593 96 904 3453)
                    </a>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono space-y-1">
                      <div className="flex items-center gap-2 text-slate-700">
                        <Mail size={14} /> ventas@atomic.com.ec
                      </div>
                      <div className="flex items-center gap-2 text-slate-700">
                        <Phone size={14} /> +593 96 904 3453
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* MODAL 5: CART */}
              {modalType === 'cart' && (
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
                    <ShoppingCart size={24} />
                  </div>
                  <h3 className="text-xl font-black uppercase text-slate-900">Carrito de Compras</h3>
                  <p className="text-xs text-slate-600 font-medium">
                    Tienes <strong>{totalItems}</strong> productos agregados al carrito.
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/web/cart"
                      onClick={() => setModalType(null)}
                      className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase rounded-xl transition-all text-center block shadow-md"
                    >
                      Ir a Finalizar Compra
                    </Link>
                  </div>
                </div>
              )}

              {/* MODAL 6: PROFILE */}
              {modalType === 'profile' && (
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
                    <User size={24} />
                  </div>
                  <h3 className="text-xl font-black uppercase text-slate-900">Mi Cuenta ATOMIC</h3>
                  <p className="text-xs text-slate-600 font-medium">
                    Inicia sesión para ver tu historial de pedidos y guardar cotizaciones.
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/login"
                      onClick={() => setModalType(null)}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase rounded-xl transition-all text-center block shadow-md"
                    >
                      Iniciar Sesión / Registro
                    </Link>
                  </div>
                </div>
              )}

              {/* MODAL 7: ENVIOS */}
              {modalType === 'envios' && (
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
                    <Truck size={24} />
                  </div>
                  <h3 className="text-xl font-black uppercase text-slate-900">Seguimiento & Envíos</h3>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    Realizamos envíos a todo Ecuador con número de guía en tiempo real para rastrear tu paquete.
                  </p>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono">
                    <span className="block font-bold text-slate-900 mb-1">Empresas Aliadas:</span>
                    <span className="text-slate-600">Servientrega · Envíos Express · Cooperativas de Transporte</span>
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
