"use client"

// Version: 2.0.0 - High-Converting Modern E-Commerce Redesign (Read-only UI)
import { useState, useRef, useEffect, useMemo } from "react"
import {
  ShoppingBag, ChevronRight, ArrowRight, Shield, Zap, Truck,
  ChevronLeft, Hexagon, Star, X, Smartphone, Sparkles, Code, Bot,
  Search, ImageOff, Home, Building, Factory, Cpu, Gamepad2, Utensils, Laptop, Award, User, Settings, ChevronDown, Package
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
function SafeImage({ src, alt, className, fill = false, width, height, ...props }: any) {
  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const imgRef = useRef<HTMLImageElement>(null)

  const realSrc = typeof src === 'string' ? src : (src && typeof src === 'object' ? (src.src || src.url || '') : '')

  useEffect(() => {
    if (imgRef.current?.complete) {
      setIsLoading(false)
    }
  }, [realSrc])

  if (!realSrc || error) {
    return (
      <div className={`flex flex-col items-center justify-center bg-neutral-900 border border-white/5 p-4 ${className} ${fill ? 'absolute inset-0' : ''}`}>
        <Hexagon className="text-neutral-700 w-10 h-10 animate-[spin_20s_linear_infinite]" strokeWidth={1} />
        <ImageOff className="text-neutral-600 mt-2" size={16} />
        <span className="text-[8px] font-bold text-neutral-500 uppercase tracking-widest mt-1">Sin imagen</span>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden bg-neutral-950 ${fill ? 'absolute inset-0 w-full h-full' : ''} ${className}`}>
      <img
        ref={imgRef}
        src={realSrc}
        alt={alt}
        onLoad={() => setIsLoading(false)}
        onError={() => { setIsLoading(false); setError(true); }}
        className={`transition-all duration-500 ${isLoading ? 'scale-105 blur-md opacity-0' : 'scale-100 blur-0 opacity-100'} ${fill ? 'w-full h-full object-contain' : ''}`}
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
    <div className="w-full bg-[#070709] min-h-screen text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
      
      {/* ═══════════ PROMO TOP HIGHLIGHT BAR ═══════════ */}
      <section className="bg-gradient-to-r from-blue-950 via-neutral-900 to-indigo-950 border-b border-white/10 py-3 px-6 text-xs text-neutral-300 font-mono">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 text-blue-400 font-bold">
              <Truck size={14} /> Envíos Seguros a Todo Ecuador
            </span>
            <span className="hidden md:flex items-center gap-2 text-emerald-400 font-bold">
              <Shield size={14} /> Productos 100% Originales & Garantía
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <a
              href="https://wa.me/593969043453?text=Hola%20ATOMIC!%20Deseo%20informaci%C3%B3n%20sobre%20sus%20productos."
              target="_blank"
              rel="noreferrer"
              className="text-emerald-400 hover:text-emerald-300 font-bold hidden sm:flex items-center gap-1.5 transition-colors"
            >
              <span>💬 Asesoría Instantánea WhatsApp</span>
              <span>→</span>
            </a>

            {/* INICIAR SESIÓN BUTTON */}
            <Link
              href="/login"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold font-mono tracking-wider shadow-md shadow-blue-500/20 border border-blue-400/30 transition-all duration-200"
            >
              <LogIn size={13} />
              <span>INICIAR SESIÓN</span>
            </Link>

            {/* USER DROPDOWN MENU */}
            <div className="relative z-50" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-900/60 via-neutral-900 to-indigo-900/60 border border-blue-500/40 hover:border-blue-400/80 rounded-xl text-xs font-bold text-white shadow-lg transition-all hover:shadow-blue-500/20 active:scale-95 cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-400">
                  <User size={12} />
                </div>
                <span className="font-mono tracking-wider font-bold text-white">USER</span>
                <ChevronDown size={14} className={`text-blue-400 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
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

      {/* ═══════════ HERO SECTION ═══════════ */}
      <section className="pt-14 pb-16 flex flex-col items-center justify-center text-center px-6 relative overflow-hidden bg-gradient-to-b from-neutral-950 via-[#0a0a10] to-[#070709]">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="mb-4 flex flex-col items-center">
            <AtomLogo />
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl sm:text-7xl font-black uppercase tracking-tight leading-none mb-4">
            <span 
              className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 inline-block py-1"
              style={{ 
                WebkitTextStroke: "1.5px #ffffff",
                paintOrder: "stroke fill",
                filter: "drop-shadow(0 0 15px rgba(59, 130, 246, 0.4))"
              }}
            >
              ATOMIC
            </span>
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-xs font-mono font-bold tracking-[0.35em] uppercase text-blue-400 mb-8">
            Catálogo Oficial & Tienda en Línea
          </motion.p>

          {/* SEARCH BAR */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="w-full max-w-2xl mx-auto mb-10 relative group">
            {isSearching ? (
              <div className="absolute left-5 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-400 group-hover:text-blue-400 transition-colors" size={18} />
            )}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setActiveMainCategoryId(null);
                setActiveSubcategoryId(null);
              }}
              placeholder="Buscar producto, marca, categoría (ej. PS5, Encimera, Laptop)..."
              className="w-full bg-neutral-900/90 border border-white/10 rounded-full py-4 pl-14 pr-12 text-xs font-mono font-bold uppercase tracking-wider text-white placeholder-neutral-500 focus:border-blue-500 focus:bg-black transition-all outline-none shadow-2xl"
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

          {/* QUICK CATEGORY HUB BUTTONS */}
          <div className="flex flex-wrap items-center justify-center gap-3 max-w-4xl mx-auto">
            <Link
              href="/web/mandos"
              className="px-5 py-3 rounded-2xl bg-neutral-900 border border-white/10 hover:border-blue-500/50 hover:bg-neutral-800 text-xs font-mono font-bold text-neutral-200 transition-all flex items-center gap-2 shadow-lg"
            >
              <span>🎮 Mandos & Consolas</span>
              <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/30">NUEVO</span>
            </Link>

            <Link
              href="/web/cocinas"
              className="px-5 py-3 rounded-2xl bg-neutral-900 border border-white/10 hover:border-amber-500/50 hover:bg-neutral-800 text-xs font-mono font-bold text-neutral-200 transition-all flex items-center gap-2 shadow-lg"
            >
              <span>🍳 Encimeras & Hornos</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/30">Línea Hogar</span>
            </Link>

            <Link
              href="/web/cpus"
              className="px-5 py-3 rounded-2xl bg-neutral-900 border border-white/10 hover:border-purple-500/50 hover:bg-neutral-800 text-xs font-mono font-bold text-neutral-200 transition-all flex items-center gap-2 shadow-lg"
            >
              <span>💻 Laptops & CPUs</span>
              <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full border border-purple-500/30">Procesadores</span>
            </Link>

            <Link
              href="/web/phones"
              className="px-5 py-3 rounded-2xl bg-neutral-900 border border-white/10 hover:border-emerald-500/50 hover:bg-neutral-800 text-xs font-mono font-bold text-neutral-200 transition-all flex items-center gap-2 shadow-lg"
            >
              <span>📱 Celulares & Tablets</span>
            </Link>

            <Link
              href="/web/blogs/guia-maquinas-de-bloques"
              className="px-5 py-3 rounded-2xl bg-neutral-900 border border-white/10 hover:border-orange-500/50 hover:bg-neutral-800 text-xs font-mono font-bold text-neutral-200 transition-all flex items-center gap-2 shadow-lg"
            >
              <span>🏗️ Plantas de Bloques</span>
              <span className="text-[10px] bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full border border-orange-500/30">Industrial</span>
            </Link>
          </div>

        </div>
      </section>

      {/* ═══════════ MAIN FEATURED PROMO BANNERS ═══════════ */}
      {!searchQuery && !activeMainCategoryId && (
        <section className="py-12 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Promo Card 1: Mandos Gaming */}
            <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-neutral-950 via-neutral-900 to-blue-950 p-8 shadow-2xl flex flex-col justify-between group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 font-mono text-[10px] font-bold uppercase tracking-widest mb-4">
                  🎮 SECCIÓN DESTACADA GAMING
                </div>
                <h3 className="text-3xl font-black uppercase text-white mb-2 leading-tight">
                  Mandos DualSense & Consolas
                </h3>
                <p className="text-neutral-400 text-xs font-light leading-relaxed max-w-md mb-6">
                  Descubre mandos originales para PS5, PS4, Xbox Series X|S, Nintendo Switch y la nueva PlayStation Portal Remote Player con fotos HD y especificaciones.
                </p>
              </div>
              <Link
                href="/web/mandos"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-500/20 w-fit"
              >
                <span>Explorar Mandos & Consolas</span>
                <span>→</span>
              </Link>
            </div>

            {/* Promo Card 2: Cocina & Encimeras */}
            <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-neutral-950 via-neutral-900 to-amber-950 p-8 shadow-2xl flex flex-col justify-between group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] pointer-events-none" />
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 font-mono text-[10px] font-bold uppercase tracking-widest mb-4">
                  🍳 LÍNEA PREMIUM DE COCINA
                </div>
                <h3 className="text-3xl font-black uppercase text-white mb-2 leading-tight">
                  Encimeras a Gas & Hornos
                </h3>
                <p className="text-neutral-400 text-xs font-light leading-relaxed max-w-md mb-6">
                  Filtra por dimensiones en centímetros, número de hornillas y tipo de combustible. Promociones especiales y combos para armar tu cocina.
                </p>
              </div>
              <Link
                href="/web/cocinas"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-2xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20 w-fit"
              >
                <span>Ver Catálogo de Cocinas</span>
                <span>→</span>
              </Link>
            </div>

          </div>
        </section>
      )}

      {/* ═══════════ PRODUCT GRID & FILTERS ═══════════ */}
      <section className="w-full max-w-7xl mx-auto px-6 py-8" id="productos">
        
        {/* SECTION TITLE & FILTER RESULTS COUNTER */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2">
              <span>Catálogo General de Productos</span>
            </h2>
            <p className="text-neutral-400 text-xs font-mono mt-1">
              {filteredProducts.length} productos listados
            </p>
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-xs text-blue-400 hover:text-blue-300 font-mono font-bold uppercase tracking-wider flex items-center gap-1"
            >
              <span>✕ Limpiar Búsqueda</span>
            </button>
          )}
        </div>

        {/* LOADING & GRID RENDER */}
        {isLoadingCategory ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-neutral-400 text-xs font-mono uppercase tracking-widest">Cargando catálogo...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-white/10 rounded-3xl p-8">
            <p className="text-neutral-400 text-xs font-mono uppercase tracking-widest mb-4">No se encontraron productos con esos criterios</p>
            <button
              onClick={() => { setSearchQuery(""); setActiveMainCategoryId(null); setActiveSubcategoryId(null); }}
              className="px-6 py-3 bg-blue-600 text-white font-bold text-xs uppercase tracking-wider rounded-full hover:bg-blue-500 transition-colors"
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
                <div key={p.id} className="group flex flex-col bg-neutral-900/80 border border-white/10 rounded-2xl overflow-hidden hover:border-blue-500/50 hover:shadow-xl transition-all duration-300">
                  <Link href={`/web/product/${p.id}`} className="relative aspect-square bg-black p-4 flex items-center justify-center overflow-hidden">
                    <SafeImage src={img} alt={p.name} fill className="p-3 group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute top-2 right-2 bg-blue-600 text-white font-mono font-bold text-xs px-2.5 py-1 rounded-full shadow-md">
                      ${price.toFixed(2)}
                    </div>
                  </Link>
                  <div className="p-4 flex flex-col gap-2 flex-grow">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase truncate">
                      {categoryName}
                    </span>
                    <Link href={`/web/product/${p.id}`} className="text-xs font-bold text-white leading-snug line-clamp-2 group-hover:text-blue-400 transition-colors">
                      {p.name}
                    </Link>
                    <a
                      href={`https://wa.me/593969043453?text=${encodeURIComponent(`Hola ATOMIC! Deseo cotizar el producto: ${p.name} ($${price.toFixed(2)})`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-auto w-full py-2.5 bg-neutral-800 hover:bg-emerald-600 text-neutral-300 hover:text-white font-mono font-bold text-[11px] uppercase tracking-wider rounded-xl transition-all text-center flex items-center justify-center gap-1 border border-white/5"
                    >
                      <span>💬 Pedir WhatsApp</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ═══════════ BOTTOM BRANDING & CONFIDENCE ═══════════ */}
      <section className="w-full max-w-7xl mx-auto px-6 pt-12 pb-20 border-t border-white/10 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-6 rounded-2xl bg-neutral-900/50 border border-white/5 space-y-2">
            <Truck className="mx-auto text-blue-400" size={28} />
            <h4 className="font-bold text-sm text-white uppercase">Envíos a Todo el País</h4>
            <p className="text-xs text-neutral-400 font-light">Despachos seguros y coordinados con cobertura nacional en Ecuador.</p>
          </div>
          <div className="p-6 rounded-2xl bg-neutral-900/50 border border-white/5 space-y-2">
            <Shield className="mx-auto text-emerald-400" size={28} />
            <h4 className="font-bold text-sm text-white uppercase">Garantía Directa</h4>
            <p className="text-xs text-neutral-400 font-light">Equipos probados con garantía directa de fábrica y soporte técnico.</p>
          </div>
          <div className="p-6 rounded-2xl bg-neutral-900/50 border border-white/5 space-y-2">
            <Award className="mx-auto text-amber-400" size={28} />
            <h4 className="font-bold text-sm text-white uppercase">Atención Especializada</h4>
            <p className="text-xs text-neutral-400 font-light">Asesoría directa por WhatsApp antes y después de tu compra.</p>
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
