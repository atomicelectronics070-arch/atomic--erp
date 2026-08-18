"use client"

// Version: 3.0.0 — ATOMIC × Appit Theme Integration (Inter Tight + Instrument Sans, real Appit CSS tokens)
import { useState, useRef, useEffect, useMemo } from "react"
import {
  ShoppingBag, ChevronRight, ArrowRight, Shield, Zap, Truck,
  ChevronLeft, Hexagon, Star, X, Smartphone, Sparkles, Code, Bot,
  Search, ImageOff, Home, Building, Factory, Cpu, Gamepad2, Utensils, Laptop, Award, User, Settings, ChevronDown, Package, LogIn
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import dynamic from "next/dynamic"
import { calculateDiscountedPrice } from "@/lib/utils/pricing"

const CoverflowGallery = dynamic(() => import("@/components/CoverflowGallery"), {
  ssr: false,
  loading: () => (
    <div className="w-full py-8 flex flex-col items-center justify-center bg-[#080d1a]/80 rounded-3xl border border-blue-500/20 shadow-2xl p-6">
      <div className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest mb-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
        <span>Cargando Catálogo 3D Coverflow de Productos IA...</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 w-full max-w-4xl opacity-90">
        <img src="/images/hero-3d/slide-1.png" alt="Producto IA 1" className="w-full h-24 object-cover rounded-xl border border-white/10" />
        <img src="/images/hero-3d/slide-2.jpg" alt="Producto IA 2" className="w-full h-24 object-cover rounded-xl border border-white/10" />
        <img src="/images/hero-3d/slide-3.jpg" alt="Producto IA 3" className="w-full h-24 object-cover rounded-xl border border-white/10" />
        <img src="/images/hero-3d/slide-4.jpg" alt="Producto IA 4" className="w-full h-24 object-cover rounded-xl border border-white/10" />
        <img src="/images/hero-3d/slide-5.jpg" alt="Producto IA 5" className="w-full h-24 object-cover rounded-xl border border-white/10" />
        <img src="/images/hero-3d/slide-6.jpg" alt="Producto IA 6" className="w-full h-24 object-cover rounded-xl border border-white/10" />
      </div>
    </div>
  )
})

// Enhanced cleaning for damaged image data
const safeParseArray = (str: any, fallback: any = []) => {
  if (!str || str === 'null' || str === '[]' || str === '') return fallback;
  if (Array.isArray(str)) return str.length > 0 ? str : fallback;
  if (typeof str === 'string') {
    const trimmed = str.trim();
    if (trimmed.startsWith('http') || trimmed.startsWith('/') || trimmed.startsWith('data:image')) return [trimmed];
    try {
      let cleaned = trimmed;
      if (cleaned.startsWith('"') && cleaned.endsWith('"')) cleaned = cleaned.substring(1, cleaned.length - 1).replace(/\\"/g, '"');
      let parsed = JSON.parse(cleaned);
      if (typeof parsed === 'string') { try { parsed = JSON.parse(parsed); } catch (e) { } }
      if (Array.isArray(parsed)) return parsed.length > 0 ? parsed : fallback;
      if (typeof parsed === 'string' && parsed.length > 0) return [parsed];
    } catch (e) {
      const urlRegex = /(https?:\/\/[^\s"\]]+)/g;
      const matches = trimmed.match(urlRegex);
      if (matches && matches.length > 0) return matches;
    }
  }
  return fallback;
};

/* ─── Robust Image Component ─── */
function SafeImage({ src, alt = "", className, fill = false, width, height, ...props }: any) {
  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const imgRef = useRef<HTMLImageElement>(null)

  const altLower = (alt || "").toLowerCase()
  let fallbackImage = "/web-banners/banner-17.jpg"
  if (altLower.includes("camara") || altLower.includes("h6c") || altLower.includes("ezviz") || altLower.includes("ip")) {
    fallbackImage = "/images/hero-3d/slide-2.jpg"
  } else if (altLower.includes("biometrico") || altLower.includes("zkteco") || altLower.includes("senseface") || altLower.includes("acceso") || altLower.includes("portero")) {
    fallbackImage = "/assets/portero/portero2.jpeg"
  }

  const rawSrc = typeof src === 'string' ? src : (src && typeof src === 'object' ? (src.src || src.url || '') : '')
  const realSrc = (!rawSrc || error) ? fallbackImage : rawSrc

  useEffect(() => {
    if (imgRef.current?.complete) {
      setIsLoading(false)
    }
  }, [realSrc])

  return (
    <div className={`relative overflow-hidden bg-neutral-950 ${fill ? 'absolute inset-0 w-full h-full' : ''} ${className}`}>
      <img
        ref={imgRef}
        src={realSrc}
        alt={alt}
        onLoad={() => setIsLoading(false)}
        onError={() => { setIsLoading(false); setError(true); }}
        className={`transition-all duration-500 ${isLoading ? 'scale-105 blur-md opacity-0' : 'scale-100 blur-0 opacity-100'} ${fill ? 'w-full h-full object-cover' : ''}`}
        style={{ width: fill ? '100%' : width, height: fill ? '100%' : height }}
        referrerPolicy="no-referrer"
        {...props}
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}

/* ─── Atom Logo ─── */
function AtomLogo() {
  return (
    <svg width="56" height="56" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="36" cy="36" r="6" fill="#3b82f6" className="animate-pulse" />
      <ellipse cx="36" cy="36" rx="30" ry="10" stroke="rgba(59, 130, 246, 0.6)" strokeWidth="1.5" fill="none" />
      <ellipse cx="36" cy="36" rx="30" ry="10" stroke="rgba(99, 102, 241, 0.6)" strokeWidth="1.5" fill="none" transform="rotate(60 36 36)" />
      <ellipse cx="36" cy="36" rx="30" ry="10" stroke="rgba(16, 185, 129, 0.6)" strokeWidth="1.5" fill="none" transform="rotate(120 36 36)" />
    </svg>
  )
}

interface PublicWebClientProps {
  initialProducts: any[]
  metadata: { categories: any[], collections: any[] }
  userRole?: string
  storeSettings?: any
}

const normalizeText = (s: string) =>
  s.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ').trim()

const fuzzyMatch = (query: string, target: string): boolean => {
  const q = normalizeText(query)
  const t = normalizeText(target)
  const words = q.split(' ').filter(Boolean)
  return words.every(w => t.includes(w))
}

export default function PublicWebClient({ 
  initialProducts = [], 
  metadata = { categories: [], collections: [] }, 
  userRole 
}: PublicWebClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeMainCategoryId, setActiveMainCategoryId] = useState<string | null>(null)
  const [activeSubcategoryId, setActiveSubcategoryId] = useState<string | null>(null)
  const [dynamicProducts, setDynamicProducts] = useState<any[]>([])
  const [isLoadingCategory, setIsLoadingCategory] = useState(false)
  const [searchResults, setSearchResults] = useState<any[] | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const searchDebounce = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [activeUserModal, setActiveUserModal] = useState<string | null>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState<string | null>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    const handleSearchUpdate = (e: any) => {
      setSearchQuery(e.detail)
      setActiveMainCategoryId(null)
      setActiveSubcategoryId(null)
      document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' })
    }
    window.addEventListener('atomic-search-update', handleSearchUpdate)
    return () => window.removeEventListener('atomic-search-update', handleSearchUpdate)
  }, [])

  useEffect(() => {
    if (searchDebounce.current) clearTimeout(searchDebounce.current)
    if (!searchQuery.trim()) {
      setSearchResults(null)
      setIsSearching(false)
      return
    }
    setIsSearching(true)
    searchDebounce.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/web/products?search=${encodeURIComponent(searchQuery.trim())}&pageSize=120`)
        const data = await res.json()
        setSearchResults(data.products || [])
      } catch {
        setSearchResults(null)
      } finally {
        setIsSearching(false)
      }
    }, 350)
    return () => { if (searchDebounce.current) clearTimeout(searchDebounce.current) }
  }, [searchQuery])

  useEffect(() => {
    if (!activeMainCategoryId && !activeSubcategoryId) {
      setDynamicProducts([])
      return
    }
    const fetchCategoryProducts = async () => {
      setIsLoadingCategory(true)
      try {
        const targetCat = activeSubcategoryId || activeMainCategoryId
        const res = await fetch(`/api/web/products?categoryId=${targetCat}&pageSize=100`)
        const data = await res.json()
        if (data && data.products) setDynamicProducts(data.products)
      } catch (error) {
        console.error("Error fetching category products:", error)
      } finally {
        setIsLoadingCategory(false)
      }
    }
    fetchCategoryProducts()
  }, [activeMainCategoryId, activeSubcategoryId])

  const filteredProducts = useMemo(() => {
    if (searchQuery.trim()) {
      if (searchResults !== null) return searchResults
      return initialProducts.filter(p => {
        const target = `${p.name} ${p.description || ''} ${p.category?.name || ''} ${p.provider || ''}`
        return fuzzyMatch(searchQuery, target)
      })
    }
    const base = dynamicProducts.length > 0 ? dynamicProducts : initialProducts
    if (activeSubcategoryId) {
      return base.filter(p => p.category?.id === activeSubcategoryId)
    } else if (activeMainCategoryId) {
      const cats = metadata?.categories || []
      const subCatIds = cats.filter(c => c.parentId === activeMainCategoryId).map(c => c.id)
      return base.filter(p => p.category?.id === activeMainCategoryId || subCatIds.includes(p.category?.id))
    }
    return base
  }, [searchQuery, searchResults, dynamicProducts, initialProducts, activeMainCategoryId, activeSubcategoryId, metadata?.categories])

  return (
    <div className="w-full bg-[#09090A] min-h-screen text-white font-sans selection:bg-white/20 selection:text-white overflow-x-hidden">
      
      {/* ═══════════ PROMO TOP HIGHLIGHT BAR (APPIT STYLE) ═══════════ */}
      <section className="bg-[#09090A] border-b border-white/[0.06] py-3 px-6 text-xs text-[#94969D]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 text-white font-bold font-heading text-xs">
              <Truck size={14} className="text-white" /> Envíos Seguros a Todo Ecuador
            </span>
            <span className="hidden md:flex items-center gap-2 text-[#94969D] font-medium text-xs">
              <Shield size={14} className="text-emerald-400" /> Productos 100% Originales & Garantía
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <a
              href="https://wa.me/593969043453?text=Hola%20ATOMIC!%20Deseo%20informaci%C3%B3n%20sobre%20sus%20productos."
              target="_blank"
              rel="noreferrer"
              className="text-[#94969D] hover:text-white font-bold hidden sm:flex items-center gap-1.5 transition-colors"
            >
              <span>💬 Asesoría Instantánea WhatsApp</span>
              <span>→</span>
            </a>

            {/* INICIAR SESIÓN BUTTON (APPIT PILL) */}
            <Link
              href="/login"
              className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-black hover:bg-neutral-200 text-xs font-bold font-heading tracking-wider shadow-lg transition-all"
            >
              <LogIn size={13} />
              <span>INICIAR SESIÓN</span>
            </Link>

            {/* USER DROPDOWN MENU (APPIT PILL) */}
            <div className="relative z-50" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 px-3.5 py-1.5 bg-[#131315] border border-white/10 hover:border-white/20 rounded-full text-xs font-bold text-white shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-white">
                  <User size={12} />
                </div>
                <span className="font-heading tracking-wider font-bold text-white">USER</span>
                <ChevronDown size={14} className={`text-neutral-400 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>


              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-52 bg-[#0c101c]/95 border border-blue-500/30 rounded-2xl shadow-2xl backdrop-blur-2xl p-2 z-50 overflow-hidden"
                  >
                    <div className="px-3 py-2 border-b border-white/10 mb-1">
                      <p className="text-[10px] font-mono text-blue-400 uppercase font-bold tracking-widest">Cuenta Activa</p>
                      <p className="text-xs font-bold text-white truncate">Usuario ATOMIC</p>
                    </div>

                    <button
                      onClick={() => { setActiveUserModal('perfil'); setIsUserMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-blue-600/20 text-neutral-200 hover:text-white text-xs font-bold transition-all text-left group cursor-pointer"
                    >
                      <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                        <User size={14} />
                      </div>
                      <span>Perfil</span>
                    </button>

                    <button
                      onClick={() => { setActiveUserModal('compras'); setIsUserMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-emerald-600/20 text-neutral-200 hover:text-white text-xs font-bold transition-all text-left group cursor-pointer"
                    >
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                        <ShoppingBag size={14} />
                      </div>
                      <span>Compras</span>
                    </button>

                    <button
                      onClick={() => { setActiveUserModal('envios'); setIsUserMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-amber-600/20 text-neutral-200 hover:text-white text-xs font-bold transition-all text-left group cursor-pointer"
                    >
                      <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                        <Truck size={14} />
                      </div>
                      <span>Envíos</span>
                    </button>

                    <button
                      onClick={() => { setActiveUserModal('settings'); setIsUserMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-purple-600/20 text-neutral-200 hover:text-white text-xs font-bold transition-all text-left group cursor-pointer"
                    >
                      <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                        <Settings size={14} />
                      </div>
                      <span>Settings</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ HORIZONTAL NAV TABS (APPIT PILL STYLE) ═══════════ */}
      <nav className="sticky top-0 z-40 w-full bg-[#09090A]/95 backdrop-blur-2xl border-b border-white/[0.06] shadow-2xl shadow-black/60">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-1.5 overflow-x-auto scrollbar-hide py-2.5">

          {/* BACK ARROW — visible when a tab is active */}
          {activeTab && (
            <button
              onClick={() => setActiveTab(null)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/10 border border-white/15 text-white hover:bg-white/20 text-xs font-bold font-mono tracking-wider transition-all shrink-0 mr-2 shadow-lg"
            >
              <ChevronLeft size={15} />
              <span className="hidden sm:inline">INICIO</span>
            </button>
          )}

          {([
            { id: 'categorias', label: '📦 Categorías' },
            { id: 'ofertas', label: '🔥 Ofertas' },
            { id: 'blog', label: '📝 Blog' },
            { id: 'newsletter', label: '✉️ Newsletter' },
            { id: 'landings', label: '🚀 Landings' },
            { id: 'especializacion', label: '🎓 Áreas' },
            { id: 'nosotros', label: '🏢 Nosotros' },
            { id: 'contacto', label: '📞 Contacto' },
            { id: 'resenas', label: '⭐ Reseñas' },
          ] as { id: string; label: string }[]).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(activeTab === tab.id ? null : tab.id)}
              className={`shrink-0 px-4 py-2 rounded-full text-[11px] font-bold tracking-wide transition-all duration-200 whitespace-nowrap border ${
                activeTab === tab.id
                  ? 'bg-white text-black border-white shadow-xl shadow-white/10 scale-105'
                  : 'bg-[#131315] text-[#94969D] border-white/[0.06] hover:bg-[#1D1D20] hover:text-white hover:border-white/15'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* ═══════════ TAB CONTENT PANELS (APPIT BENTO STYLE) ═══════════ */}
      <AnimatePresence mode="wait">
        {activeTab === 'categorias' && (
          <motion.section key="categorias" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex items-center gap-3 mb-8">
              <button onClick={() => setActiveTab(null)} className="p-2.5 rounded-2xl bg-[#131315] border border-white/10 hover:bg-[#1D1D20] text-neutral-400 hover:text-white transition-all">
                <ChevronLeft size={18} />
              </button>
              <h2 className="text-3xl font-black uppercase tracking-tight text-white font-heading">Categorías</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {(metadata?.categories?.filter(c => !c.parentId) || []).map((cat: any) => (
                <button key={cat.id} onClick={() => { setActiveMainCategoryId(cat.id); setActiveTab(null); document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' }); }} className="p-6 rounded-3xl bg-[#0E0E10] border border-white/[0.06] hover:border-white/20 hover:bg-[#131315] text-left transition-all group shadow-xl">
                  <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors font-heading">{cat.name}</p>
                  <p className="text-[10px] font-mono text-[#62646C] mt-2 uppercase tracking-widest">Ver productos →</p>
                </button>
              ))}
            </div>
          </motion.section>
        )}

        {activeTab === 'ofertas' && (
          <motion.section key="ofertas" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex items-center gap-3 mb-8">
              <button onClick={() => setActiveTab(null)} className="p-2.5 rounded-2xl bg-[#131315] border border-white/10 hover:bg-[#1D1D20] text-neutral-400 hover:text-white transition-all">
                <ChevronLeft size={18} />
              </button>
              <h2 className="text-3xl font-black uppercase tracking-tight text-white font-heading">Ofertas Especiales 🔥</h2>
            </div>
            <p className="text-[#94969D] text-sm mb-6">Descuentos exclusivos en tecnología, electrónica y hogar. <strong className="text-white">¡Por tiempo limitado!</strong></p>
            <button onClick={() => { setSearchQuery('oferta'); setActiveTab(null); document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' }); }} className="px-8 py-4 rounded-full bg-white text-black font-bold uppercase tracking-wider text-xs transition-all hover:bg-neutral-200 shadow-xl">Ver Todas las Ofertas</button>
          </motion.section>
        )}

        {activeTab === 'blog' && (
          <motion.section key="blog" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex items-center gap-3 mb-8">
              <button onClick={() => setActiveTab(null)} className="p-2.5 rounded-2xl bg-[#131315] border border-white/10 hover:bg-[#1D1D20] text-neutral-400 hover:text-white transition-all">
                <ChevronLeft size={18} />
              </button>
              <h2 className="text-3xl font-black uppercase tracking-tight text-white font-heading">Blog & Guías 📝</h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
              {[
                { title: 'Post #1: Introducción a ATOMIC', href: '/post-1', desc: 'Conoce nuestra historia y misión tecnológica.' },
                { title: 'Post #2: Seguridad para el Hogar', href: '/post-2', desc: 'Cámaras IP, porteros y sistemas biométricos.' },
                { title: 'Post #3: Recursos de Aprendizaje', href: '/recursos', desc: 'Cursos gratuitos de universidades top del mundo.' },
                { title: 'Post #4: 9 Cursos de YouTube Gratuitos', href: '/post-4', desc: 'Ventas, IA, Copywriting, Liderazgo y Neurociencia.' },
              ].map(post => (
                <Link key={post.href} href={post.href} className="p-6 rounded-3xl bg-[#0E0E10] border border-white/[0.06] hover:border-white/20 hover:bg-[#131315] transition-all group block shadow-xl">
                  <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors mb-2 font-heading">{post.title}</h3>
                  <p className="text-xs text-[#94969D]">{post.desc}</p>
                  <span className="mt-4 inline-block text-[10px] font-mono text-white uppercase font-bold">Leer →</span>
                </Link>
              ))}
            </div>
          </motion.section>
        )}

        {activeTab === 'newsletter' && (
          <motion.section key="newsletter" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="max-w-3xl mx-auto px-6 py-12 text-center">
            <div className="flex items-center gap-3 mb-8 justify-center">
              <button onClick={() => setActiveTab(null)} className="p-2.5 rounded-2xl bg-[#131315] border border-white/10 hover:bg-[#1D1D20] text-neutral-400 hover:text-white transition-all">
                <ChevronLeft size={18} />
              </button>
              <h2 className="text-3xl font-black uppercase tracking-tight text-white font-heading">Newsletter ✉️</h2>
            </div>
            <p className="text-[#94969D] mb-6 text-sm">Suscríbete y recibe <strong className="text-white">ofertas exclusivas, novedades tecnológicas y guías de IA</strong> directamente en tu correo.</p>
            <Link href="/recursos" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black font-bold uppercase tracking-wider text-xs transition-all hover:bg-neutral-200 shadow-xl">
              Suscribirme Ahora <ArrowRight size={16} />
            </Link>
          </motion.section>
        )}

        {activeTab === 'landings' && (
          <motion.section key="landings" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex items-center gap-3 mb-8">
              <button onClick={() => setActiveTab(null)} className="p-2.5 rounded-2xl bg-[#131315] border border-white/10 hover:bg-[#1D1D20] text-neutral-400 hover:text-white transition-all">
                <ChevronLeft size={18} />
              </button>
              <h2 className="text-3xl font-black uppercase tracking-tight text-white font-heading">Landings de Productos 🚀</h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-4">
              {[
                { name: 'IMOU Aurora Pro', href: '/aurora-pro', desc: 'Cámara Exterior Full-Color con Audio Bidireccional', icon: '📹' },
                { name: 'ZKTeco SenseFace 2A', href: '/senseface-2a', desc: 'Biométrico Facial 3D, Huella & RFID', icon: '🔐' },
                { name: 'EZVIZ H6c PT 2K', href: '/h6c', desc: 'Cámara IP Panorámica 360° Wi-Fi', icon: '📹' },
                { name: 'Recursos Top', href: '/recursos', desc: 'MIT, Harvard, Stanford y más — 100% Gratis', icon: '🎓' },
              ].map(l => (
                <Link key={l.href} href={l.href} className="p-6 rounded-3xl bg-[#0E0E10] border border-white/[0.06] hover:border-white/20 hover:bg-[#131315] transition-all group block shadow-xl">
                  <div className="text-3xl mb-3">{l.icon}</div>
                  <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors mb-1 font-heading">{l.name}</h3>
                  <p className="text-xs text-[#94969D]">{l.desc}</p>
                  <span className="mt-4 inline-block text-[10px] font-mono text-white uppercase font-bold">Ver Landing →</span>
                </Link>
              ))}
            </div>
          </motion.section>
        )}

        {activeTab === 'especializacion' && (
          <motion.section key="especializacion" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex items-center gap-3 mb-8">
              <button onClick={() => setActiveTab(null)} className="p-2.5 rounded-2xl bg-[#131315] border border-white/10 hover:bg-[#1D1D20] text-neutral-400 hover:text-white transition-all">
                <ChevronLeft size={18} />
              </button>
              <h2 className="text-3xl font-black uppercase tracking-tight text-white font-heading">Áreas de Especialización 🎓</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {[
                { area: '🔐 Seguridad & Control de Acceso', desc: 'Biométricos, porteros eléctricos, CCTV y vigilancia IP.' },
                { area: '📺 Electrónica de Consumo', desc: 'Smart TVs, audio, gaming, periféricos y accesorios.' },
                { area: '🏠 Hogar Inteligente', desc: 'Encimeras, hornos, electrodomésticos y automatización.' },
                { area: '💻 Computación & Laptops', desc: 'Portátiles, PCs, componentes y soluciones de red.' },
                { area: '⚡ Energía & Carga EV', desc: 'Cargadores de vehículos eléctricos y soluciones solares.' },
                { area: '🤖 Tecnología IA & Robótica', desc: 'Automatización inteligente, bots y soluciones de última generación.' },
              ].map(a => (
                <div key={a.area} className="p-6 rounded-3xl bg-[#0E0E10] border border-white/[0.06] hover:border-white/20 transition-all shadow-xl">
                  <h3 className="text-sm font-bold text-white mb-2 font-heading">{a.area}</h3>
                  <p className="text-xs text-[#94969D]">{a.desc}</p>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {activeTab === 'nosotros' && (
          <motion.section key="nosotros" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="max-w-4xl mx-auto px-6 py-12">
            <div className="flex items-center gap-3 mb-8">
              <button onClick={() => setActiveTab(null)} className="p-2.5 rounded-2xl bg-[#131315] border border-white/10 hover:bg-[#1D1D20] text-neutral-400 hover:text-white transition-all">
                <ChevronLeft size={18} />
              </button>
              <h2 className="text-3xl font-black uppercase tracking-tight text-white font-heading">Sobre Nosotros 🏢</h2>
            </div>
            <div className="space-y-6">
              <p className="text-[#AEB0B6] text-sm leading-relaxed"><strong className="text-white">ATOMIC INDUSTRIAS</strong> es una empresa ecuatoriana especializada en electrónica, tecnología y productos para el hogar. Ofrecemos los mejores precios con garantía 100% original, envíos seguros a todo Ecuador y asesoría técnica instantánea vía WhatsApp.</p>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { stat: '100%', label: 'Productos Originales' },
                  { stat: '24/7', label: 'Soporte Técnico' },
                  { stat: 'EC', label: 'Cobertura Nacional' },
                ].map(s => (
                  <div key={s.stat} className="p-6 rounded-3xl bg-[#0E0E10] border border-white/[0.06] text-center shadow-xl">
                    <p className="text-4xl font-black text-white font-heading">{s.stat}</p>
                    <p className="text-[11px] font-mono text-[#62646C] uppercase tracking-widest mt-2">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {activeTab === 'contacto' && (
          <motion.section key="contacto" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="max-w-4xl mx-auto px-6 py-12">
            <div className="flex items-center gap-3 mb-8">
              <button onClick={() => setActiveTab(null)} className="p-2.5 rounded-2xl bg-[#131315] border border-white/10 hover:bg-[#1D1D20] text-neutral-400 hover:text-white transition-all">
                <ChevronLeft size={18} />
              </button>
              <h2 className="text-3xl font-black uppercase tracking-tight text-white font-heading">Contáctanos 📞</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <a href="https://wa.me/593969043453?text=Hola%20ATOMIC!" target="_blank" rel="noreferrer" className="flex items-center gap-4 p-6 rounded-3xl bg-[#0E0E10] border border-white/[0.06] hover:border-emerald-500/40 hover:bg-[#131315] transition-all group shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-2xl">💬</div>
                <div>
                  <p className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors font-heading">WhatsApp</p>
                  <p className="text-xs text-[#94969D]">Asesoría instantánea disponible ahora</p>
                </div>
              </a>
              <div className="flex items-center gap-4 p-6 rounded-3xl bg-[#0E0E10] border border-white/[0.06] shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-2xl">📍</div>
                <div>
                  <p className="text-sm font-bold text-white font-heading">Ecuador</p>
                  <p className="text-xs text-[#94969D]">Envíos directos a las 24 provincias</p>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {activeTab === 'resenas' && (
          <motion.section key="resenas" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex items-center gap-3 mb-8">
              <button onClick={() => setActiveTab(null)} className="p-2.5 rounded-2xl bg-[#131315] border border-white/10 hover:bg-[#1D1D20] text-neutral-400 hover:text-white transition-all">
                <ChevronLeft size={18} />
              </button>
              <h2 className="text-3xl font-black uppercase tracking-tight text-white font-heading">Reseñas de Clientes ⭐</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {[
                { name: 'Carlos M.', rating: 5, text: 'Excelente servicio, el producto llegó rápido y en perfectas condiciones. 100% recomendado.' },
                { name: 'Andrea L.', rating: 5, text: 'La asesoría por WhatsApp fue increíble, me ayudaron a elegir el mejor biométrico para mi empresa.' },
                { name: 'Roberto V.', rating: 5, text: 'Compré una cámara EZVIZ H6c y funciona perfectamente. La calidad 2K es impresionante.' },
                { name: 'María F.', rating: 5, text: 'Productos originales con garantía, los precios son los mejores de todo Ecuador.' },
                { name: 'Jorge P.', rating: 5, text: 'El SenseFace 2A funciona perfecto en nuestras instalaciones. Muy buen equipo ATOMIC.' },
                { name: 'Lucía G.', rating: 5, text: 'Atención al cliente excepcional. Resolvieron todas mis dudas antes de la compra.' },
              ].map(r => (
                <div key={r.name} className="p-6 rounded-3xl bg-[#0E0E10] border border-white/[0.06] hover:border-white/20 transition-all shadow-xl">
                  <div className="flex items-center gap-1 mb-3">{Array.from({length: r.rating}).map((_,i) => <Star key={i} size={14} className="text-amber-400 fill-amber-400" />)}</div>
                  <p className="text-sm text-[#C9CACE] italic mb-3">"{r.text}"</p>
                  <p className="text-xs font-bold text-white font-heading">{r.name}</p>
                  <p className="text-[10px] font-mono text-[#62646C]">Cliente ATOMIC ✓</p>
                </div>
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ═══════════ HERO SECTION (APPIT MODERN AESTHETIC) ═══════════ */}
      <section className="pt-16 pb-16 flex flex-col items-center justify-center text-center px-6 relative overflow-hidden bg-[#09090A]">
        {/* Soft Appit Ambient Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-blue-600/10 via-indigo-600/5 to-transparent rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto">
          
          {/* Appit Style Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#131315] border border-white/10 text-xs font-bold text-neutral-300 mb-6 shadow-xl"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-heading">Tecnología, Electrónica & Hogar Inteligente</span>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="mb-4 flex flex-col items-center">
            <AtomLogo />
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tight leading-none mb-4 font-heading">
            <span className="text-white">
              ATOMIC
            </span>
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-xs sm:text-sm font-bold tracking-[0.25em] uppercase text-[#94969D] mb-8 font-heading">
            ELECTRÓNICA, TECNOLOGÍA Y HOGAR
          </motion.p>

          {/* SEARCH BAR (APPIT PILL INPUT) */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="w-full max-w-2xl mx-auto mb-10 relative group">
            {isSearching ? (
              <div className="absolute left-5 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#62646C] group-hover:text-white transition-colors" size={18} />
            )}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setActiveMainCategoryId(null);
                setActiveSubcategoryId(null);
              }}
              placeholder="Buscar producto, marca, categoría (ej. PS5, Aurora, Encimera)..."
              className="w-full bg-[#0E0E10] border border-white/10 rounded-full py-4 pl-14 pr-12 text-xs font-bold uppercase tracking-wider text-white placeholder-[#62646C] focus:border-white/30 focus:bg-[#131315] transition-all outline-none shadow-2xl"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors">
                <X size={16} />
              </button>
            )}
          </motion.div>

          {/* 3D COVERFLOW GALLERY SHOWCASE */}
          <div className="w-full max-w-5xl mx-auto my-6 overflow-hidden">
            <CoverflowGallery autoplay={true} cardWidth={480} cardHeight={360} gap={8} tilt={12} sideTilt={8} opacity={60} />
          </div>

          {/* QUICK CATEGORY HUB BUTTONS (APPIT PILLS) */}
          <div className="flex flex-wrap items-center justify-center gap-3 max-w-4xl mx-auto">
            <Link
              href="/web/mandos"
              className="px-5 py-3 rounded-full bg-[#0E0E10] border border-white/[0.08] hover:border-white/20 hover:bg-[#131315] text-xs font-bold text-neutral-200 transition-all flex items-center gap-2 shadow-lg"
            >
              <span>🎮 Mandos & Consolas</span>
              <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/30">NUEVO</span>
            </Link>

            <Link
              href="/web/cocinas"
              className="px-5 py-3 rounded-full bg-[#0E0E10] border border-white/[0.08] hover:border-white/20 hover:bg-[#131315] text-xs font-bold text-neutral-200 transition-all flex items-center gap-2 shadow-lg"
            >
              <span>🍳 Encimeras & Hornos</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/30">Línea Hogar</span>
            </Link>

            <Link
              href="/web/cpus"
              className="px-5 py-3 rounded-full bg-[#0E0E10] border border-white/[0.08] hover:border-white/20 hover:bg-[#131315] text-xs font-bold text-neutral-200 transition-all flex items-center gap-2 shadow-lg"
            >
              <span>💻 Laptops & CPUs</span>
              <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full border border-purple-500/30">Procesadores</span>
            </Link>

            <Link
              href="/web/phones"
              className="px-5 py-3 rounded-full bg-[#0E0E10] border border-white/[0.08] hover:border-white/20 hover:bg-[#131315] text-xs font-bold text-neutral-200 transition-all flex items-center gap-2 shadow-lg"
            >
              <span>📱 Celulares & Tablets</span>
            </Link>

            <Link
              href="/web/blogs/guia-maquinas-de-bloques"
              className="px-5 py-3 rounded-full bg-[#0E0E10] border border-white/[0.08] hover:border-white/20 hover:bg-[#131315] text-xs font-bold text-neutral-200 transition-all flex items-center gap-2 shadow-lg"
            >
              <span>🏗️ Plantas de Bloques</span>
              <span className="text-[10px] bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full border border-orange-500/30">Industrial</span>
            </Link>
          </div>

        </div>
      </section>

      {/* ═══════════ CATEGORÍAS — FRONTENDJOE CARD STYLE ═══════════ */}
      <section className="w-full max-w-7xl mx-auto px-6 pt-16 pb-12" id="categorias-seccion">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#131315] border border-white/10 text-xs font-bold text-neutral-300 mb-4 shadow-xl">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="font-heading uppercase tracking-wider text-[11px]">Catálogo Principal de Especialización</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white font-heading mb-4">
            Categorías
          </h2>
          <p className="text-sm text-[#94969D] leading-relaxed">
            Explora nuestras 8 divisiones especializadas en tecnología residencial, electrónica de consumo, equipamiento para el hogar, maquinaria industrial y soluciones digitales.
          </p>
        </div>

        {/* 8 CATEGORY CARDS GRID — EXACT FRONTENDJOE FLOATING OFFSET STYLE */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {[
            {
              id: 'cat-residencial',
              title: 'Tecnología Residencial',
              subtitle: 'Domótica & Seguridad Smart',
              description: 'Cámaras IP con audio bidireccional, reconocimiento facial 3D, porteros inteligentes y control de accesos.',
              image: '/images/hero-3d/slide-2.jpg',
              badge: 'Seguridad Smart',
              query: 'camara',
            },
            {
              id: 'cat-electronica',
              title: 'Electrónica',
              subtitle: 'Audio, Gadgets & Periféricos',
              description: 'Equipos de audio de alta fidelidad, iluminación inteligente, periféricos para creadores y componentes electrónicos.',
              image: '/images/hero-3d/slide-6.jpg',
              badge: 'Audio & Gadgets',
              query: 'electronica',
            },
            {
              id: 'cat-hogar',
              title: 'Hogar',
              subtitle: 'Cocina Premium & Confort',
              description: 'Encimeras a gas de alta eficiencia, hornos empotrables de acero inoxidable y electrodomésticos modernos para el hogar.',
              image: '/images/hero-3d/slide-4.jpg',
              badge: 'Línea Hogar',
              query: 'cocina',
            },
            {
              id: 'cat-industria',
              title: 'Industria',
              subtitle: 'Maquinaria & Plantas de Bloques',
              description: 'Plantas automáticas de bloques de hormigón, mezcladoras de concreto reforzado y automatización pesada.',
              image: '/images/hero-3d/slide-5.jpg',
              badge: 'Industrial',
              query: 'bloque',
            },
            {
              id: 'cat-entretenimiento',
              title: 'Entretenimiento',
              subtitle: 'Gaming, Consolas & Mandos',
              description: 'Mandos DualSense inalámbricos para PS5, consolas Nintendo Switch, Xbox Series X|S y PlayStation Portal.',
              image: '/images/hero-3d/slide-1.png',
              badge: 'Gaming',
              query: 'mando',
            },
            {
              id: 'cat-computacion',
              title: 'Computación',
              subtitle: 'Laptops, PCs & Procesadores',
              description: 'Portátiles de alto rendimiento, estaciones de trabajo All-in-One Dell, CPUs Intel/AMD y almacenamiento ultrarrápido.',
              image: '/images/hero-3d/slide-3.jpg',
              badge: 'Hardware',
              query: 'laptop',
            },
            {
              id: 'cat-telefonia',
              title: 'Telefonía',
              subtitle: 'Smartphones, Tablets & Redes',
              description: 'Dispositivos móviles de última generación, tablets para productividad, accesorios de carga rápida y conectividad.',
              image: '/images/hero-3d/slide-2.jpg',
              badge: 'Móvil',
              query: 'telefono',
            },
            {
              id: 'cat-software',
              title: 'Software & Servicios',
              subtitle: 'ERP, CRM & Automatización IA',
              description: 'Sistemas de gestión empresarial integral, cotizadores automáticos, asesoría tecnológica y desarrollo a medida.',
              image: '/images/hero-3d/slide-6.jpg',
              badge: 'Cloud & IA',
              query: 'software',
            },
          ].map((c) => (
            <div
              key={c.id}
              className="relative flex flex-col sm:flex-row items-center bg-[#121017] border border-white/[0.08] rounded-3xl p-6 sm:p-7 shadow-[0_40px_60px_rgba(0,0,0,0.5)] hover:border-white/20 transition-all duration-300 group"
            >
              {/* Floating offset image */}
              <div className="relative shrink-0 w-full sm:w-48 h-52 sm:h-56 -mt-8 sm:mt-0 sm:-ml-12 rounded-2xl overflow-hidden shadow-[0_30px_40px_rgba(0,0,0,0.6)] border border-white/10 bg-[#09090A]">
                <img
                  src={c.image}
                  alt={c.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[9px] font-mono font-bold text-white uppercase tracking-wider">
                  {c.badge}
                </div>
              </div>

              {/* Card content */}
              <div className="flex flex-col pt-5 sm:pt-0 sm:pl-6 text-center sm:text-left flex-grow">
                <h3 className="text-xl sm:text-2xl font-black text-white font-heading tracking-tight leading-tight group-hover:text-blue-400 transition-colors">
                  {c.title}
                </h3>
                <p className="text-xs font-semibold text-blue-400 mt-1 mb-2 font-heading">
                  {c.subtitle}
                </p>
                <p className="text-xs text-[#94969D] leading-relaxed mb-6 line-clamp-3">
                  {c.description}
                </p>

                {/* Buttons styled like FrontendJoe */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mt-auto">
                  <button
                    onClick={() => {
                      setSearchQuery(c.query);
                      document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-5 py-2.5 rounded-full border border-white/20 hover:border-white hover:bg-white/10 text-white text-xs font-bold font-heading transition-all cursor-pointer"
                  >
                    Ver Catálogo
                  </button>
                  <a
                    href={`https://wa.me/593969043453?text=${encodeURIComponent(`Hola ATOMIC! Deseo información y cotización sobre la categoría: ${c.title}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 rounded-full bg-white hover:bg-neutral-200 text-[#121017] text-xs font-black font-heading transition-all shadow-lg hover:scale-105"
                  >
                    💬 WhatsApp
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ MAIN FEATURED PROMO BANNERS (APPIT BENTO STYLE) ═══════════ */}
      {!searchQuery && !activeMainCategoryId && (
        <section className="py-12 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Promo Card 1: Mandos Gaming */}
            <div className="relative rounded-3xl overflow-hidden border border-white/[0.06] bg-[#0E0E10] p-8 shadow-2xl flex flex-col justify-between group hover:border-white/20 transition-all">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-white font-mono text-[10px] font-bold uppercase tracking-widest mb-4">
                  🎮 SECCIÓN DESTACADA GAMING
                </div>
                <h3 className="text-3xl font-black uppercase text-white mb-2 leading-tight font-heading">
                  Mandos DualSense & Consolas
                </h3>
                <p className="text-[#94969D] text-xs leading-relaxed max-w-md mb-6">
                  Descubre mandos originales para PS5, PS4, Xbox Series X|S, Nintendo Switch y la nueva PlayStation Portal Remote Player con fotos HD y especificaciones.
                </p>
              </div>
              <Link
                href="/web/mandos"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-black hover:bg-neutral-200 rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-xl w-fit"
              >
                <span>Explorar Mandos & Consolas</span>
                <span>→</span>
              </Link>
            </div>

            {/* Promo Card 2: Cocina & Encimeras */}
            <div className="relative rounded-3xl overflow-hidden border border-white/[0.06] bg-[#0E0E10] p-8 shadow-2xl flex flex-col justify-between group hover:border-white/20 transition-all">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] pointer-events-none" />
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-white font-mono text-[10px] font-bold uppercase tracking-widest mb-4">
                  🍳 LÍNEA PREMIUM DE COCINA
                </div>
                <h3 className="text-3xl font-black uppercase text-white mb-2 leading-tight font-heading">
                  Encimeras a Gas & Hornos
                </h3>
                <p className="text-[#94969D] text-xs leading-relaxed max-w-md mb-6">
                  Filtra por dimensiones en centímetros, número de hornillas y tipo de combustible. Promociones especiales y combos para armar tu cocina.
                </p>
              </div>
              <Link
                href="/web/cocinas"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-black hover:bg-neutral-200 rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-xl w-fit"
              >
                <span>Ver Catálogo de Cocinas</span>
                <span>→</span>
              </Link>
            </div>

          </div>
        </section>
      )}

      {/* ═══════════ PRODUCT GRID & FILTERS (APPIT BENTO CARDS) ═══════════ */}
      <section className="w-full max-w-7xl mx-auto px-6 py-8" id="productos">
        
        {/* SECTION TITLE & FILTER RESULTS COUNTER */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/[0.06]">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-heading">
              Catálogo General de Productos
            </h2>
            <p className="text-[#62646C] text-xs font-mono mt-1">
              {filteredProducts.length} productos disponibles
            </p>
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-xs text-white hover:text-neutral-300 font-bold uppercase tracking-wider flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-full"
            >
              <span>✕ Limpiar Búsqueda</span>
            </button>
          )}
        </div>

        {/* LOADING & GRID RENDER */}
        {isLoadingCategory ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-[#94969D] text-xs font-mono uppercase tracking-widest">Cargando catálogo...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-white/10 rounded-3xl p-8 bg-[#0E0E10]">
            <p className="text-[#94969D] text-xs font-mono uppercase tracking-widest mb-4">No se encontraron productos con esos criterios</p>
            <button
              onClick={() => { setSearchQuery(""); setActiveMainCategoryId(null); setActiveSubcategoryId(null); }}
              className="px-6 py-3 bg-white text-black font-bold text-xs uppercase tracking-wider rounded-full hover:bg-neutral-200 transition-colors"
            >
              Ver Todo el Catálogo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {filteredProducts.slice(0, 80).map((p: any) => {
              const imgs = safeParseArray(p.images);
              const img = imgs[0] || '';
              const price = calculateDiscountedPrice(p.price, userRole);
              const categoryName = p.category?.name || 'General';

              return (
                <div key={p.id} className="group flex flex-col bg-[#0E0E10] border border-white/[0.06] rounded-3xl overflow-hidden hover:border-white/20 hover:shadow-2xl transition-all duration-300">
                  <Link href={`/web/product/${p.id}`} className="relative aspect-square bg-[#09090A] p-4 flex items-center justify-center overflow-hidden">
                    <SafeImage src={img} alt={p.name} fill className="p-3 group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute top-3 right-3 bg-white text-black font-black text-xs px-3 py-1 rounded-full shadow-lg font-heading">
                      ${price.toFixed(2)}
                    </div>
                  </Link>
                  <div className="p-5 flex flex-col gap-2 flex-grow">
                    <span className="text-[10px] font-mono text-[#62646C] uppercase truncate">
                      {categoryName}
                    </span>
                    <Link href={`/web/product/${p.id}`} className="text-xs font-bold text-white leading-snug line-clamp-2 group-hover:text-blue-400 transition-colors font-heading">
                      {p.name}
                    </Link>
                    <a
                      href={`https://wa.me/593969043453?text=${encodeURIComponent(`Hola ATOMIC! Deseo cotizar el producto: ${p.name} ($${price.toFixed(2)})`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-auto w-full py-3 bg-[#181819] hover:bg-emerald-600 text-white font-bold text-[11px] uppercase tracking-wider rounded-2xl transition-all text-center flex items-center justify-center gap-1 border border-white/5 shadow-md"
                    >
                      <span>💬 Cotizar WhatsApp</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ═══════════ BOTTOM BRANDING & CONFIDENCE (APPIT BENTO CARDS) ═══════════ */}
      <section className="w-full max-w-7xl mx-auto px-6 pt-12 pb-20 border-t border-white/[0.06] mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-8 rounded-3xl bg-[#0E0E10] border border-white/[0.06] space-y-3 shadow-xl">
            <Truck className="mx-auto text-white" size={32} />
            <h4 className="font-bold text-sm text-white uppercase font-heading">Envíos a Todo el País</h4>
            <p className="text-xs text-[#94969D] leading-relaxed">Despachos seguros y coordinados con cobertura nacional en las 24 provincias del Ecuador.</p>
          </div>
          <div className="p-8 rounded-3xl bg-[#0E0E10] border border-white/[0.06] space-y-3 shadow-xl">
            <Shield className="mx-auto text-white" size={32} />
            <h4 className="font-bold text-sm text-white uppercase font-heading">Garantía Directa</h4>
            <p className="text-xs text-[#94969D] leading-relaxed">Equipos probados con garantía directa de fábrica y soporte técnico especializado.</p>
          </div>
          <div className="p-8 rounded-3xl bg-[#0E0E10] border border-white/[0.06] space-y-3 shadow-xl">
            <Award className="mx-auto text-white" size={32} />
            <h4 className="font-bold text-sm text-white uppercase font-heading">Atención Especializada</h4>
            <p className="text-xs text-[#94969D] leading-relaxed">Asesoría técnica instantánea vía WhatsApp antes, durante y después de tu compra.</p>
          </div>
        </div>
      </section>


    
      {/* ═══════════ USER DROPDOWN ACTION MODALS ═══════════ */}
      <AnimatePresence>
        {activeUserModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setActiveUserModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0b0f19] border border-blue-500/30 rounded-3xl p-6 max-w-md w-full shadow-2xl text-white relative overflow-hidden"
            >
              <button
                onClick={() => setActiveUserModal(null)}
                className="absolute top-4 right-4 text-neutral-400 hover:text-white p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>

              {activeUserModal === 'perfil' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-xl">
                      👤
                    </div>
                    <div>
                      <h3 className="text-lg font-black uppercase text-white">Mi Perfil ATOMIC</h3>
                      <p className="text-xs text-blue-400 font-mono">Usuario Registrado</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-xs text-neutral-300 font-mono">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex justify-between">
                      <span className="text-neutral-400">Cliente:</span>
                      <span className="font-bold text-white">Usuario Preferencial</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex justify-between">
                      <span className="text-neutral-400">Estado:</span>
                      <span className="font-bold text-emerald-400">Activo & Verificado</span>
                    </div>
                  </div>
                </div>
              )}

              {activeUserModal === 'compras' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xl">
                      🛍️
                    </div>
                    <div>
                      <h3 className="text-lg font-black uppercase text-white">Mis Compras</h3>
                      <p className="text-xs text-emerald-400 font-mono">Historial de Pedidos</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center text-xs text-neutral-400">
                    <p className="font-bold text-white mb-1">Sin pedidos pendientes</p>
                    <p>Tus cotizaciones y compras aparecerán aquí automáticamente.</p>
                  </div>
                </div>
              )}

              {activeUserModal === 'envios' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-xl">
                      🚚
                    </div>
                    <div>
                      <h3 className="text-lg font-black uppercase text-white">Seguimiento de Envíos</h3>
                      <p className="text-xs text-amber-400 font-mono">Cobertura Todo Ecuador</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-xs space-y-2">
                    <div className="flex items-center justify-between text-emerald-400 font-bold">
                      <span>Servientrega / Tramaco / Envíos Directos</span>
                      <span>100% Garantizado</span>
                    </div>
                    <p className="text-neutral-400">Tus guías de despacho se sincronizan automáticamente con tu número de WhatsApp.</p>
                  </div>
                </div>
              )}

              {activeUserModal === 'settings' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold text-xl">
                      ⚙️
                    </div>
                    <div>
                      <h3 className="text-lg font-black uppercase text-white">Configuración</h3>
                      <p className="text-xs text-purple-400 font-mono">Preferencias de Usuario</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                      <span>Moneda Predeterminada</span>
                      <span className="font-bold text-blue-400">USD ($)</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                      <span>Notificaciones WhatsApp</span>
                      <span className="font-bold text-emerald-400">Activadas</span>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={() => setActiveUserModal(null)}
                className="w-full mt-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                Cerrar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
</div>
  )
}
