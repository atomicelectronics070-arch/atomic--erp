"use client"

// Version: 2.0.0 - Rediseño Profesional UI (Inspirado en el mock-up limpio de catálogo)
import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { 
  ShoppingBag, ChevronRight, ArrowRight, Shield, Zap, Truck, ChevronLeft, Hexagon, 
  Star, X, Smartphone, Database, Sparkles, Code, Bot, Download, Search, ImageOff, 
  AlertCircle, Home, Building, Factory, Cpu, Layers, Tag, ChevronDown, Check
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { calculateDiscountedPrice } from "@/lib/utils/pricing"
import SpyCameraBanner from "@/components/web/SpyCameraBanner"
import SmartIntercomBanner from "@/components/web/SmartIntercomBanner"
import HomeCategoryBanner from "@/components/web/HomeCategoryBanner"
import ElectronicsCategoryBanner from "@/components/web/ElectronicsCategoryBanner"
import PhonesCategoryBanner from "@/components/web/PhonesCategoryBanner"

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
            if (typeof parsed === 'string') { try { parsed = JSON.parse(parsed); } catch(e) {} }
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

    useEffect(() => {
        if (imgRef.current?.complete) {
            setIsLoading(false)
        }
    }, [src])

    const handleLoad = () => setIsLoading(false)
    const handleError = () => {
        setIsLoading(false)
        setError(true)
    }

    if (!src || error) {
        return (
            <div className={`flex flex-col items-center justify-center bg-slate-50 border border-slate-100 p-4 ${className} ${fill ? 'absolute inset-0' : ''}`}>
                <div className="relative">
                    <PackageIcon className="text-slate-300 w-10 h-10 animate-pulse" />
                </div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2">Imagen no disponible</span>
            </div>
        )
    }

    return (
        <div className={`relative overflow-hidden bg-slate-50/50 ${fill ? 'absolute inset-0 w-full h-full' : ''} ${className}`}>
            <img
                ref={imgRef}
                src={src}
                alt={alt}
                onLoad={handleLoad}
                onError={handleError}
                className={`transition-all duration-500 ${isLoading ? 'scale-105 blur-sm opacity-0' : 'scale-100 blur-0 opacity-100'} ${fill ? 'w-full h-full object-contain' : ''}`}
                style={{ width: fill ? '100%' : width, height: fill ? '100%' : height }}
                referrerPolicy="no-referrer"
                {...props}
            />
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-50/60 backdrop-blur-xs">
                    <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                </div>
            )}
        </div>
    )
}

function PackageIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 8L12 3L3 8V16L12 21L21 16V8Z" />
      <path d="M12 3V21" />
      <path d="M3 8L12 13L21 8" />
    </svg>
  );
}

/* ─── MAIN CLIENT APPLICATION ─── */
export default function PublicWebClient({ initialProducts, metadata, userRole, storeSettings }: any) {
    const [searchQuery, setSearchQuery] = useState("")
    const [searchResults, setSearchResults] = useState<any[] | null>(null)
    const [isSearching, setIsSearching] = useState(false)
    const [activeMainCategoryId, setActiveMainCategoryId] = useState<string | null>(null)
    const [activeSubcategoryId, setActiveSubcategoryId] = useState<string | null>(null)
    const [isLoadingCategory, setIsLoadingCategory] = useState(false)

    // Sync search
    const debounceTimer = useRef<any>(null)
    const handleSearchChange = (query: string) => {
        setSearchQuery(query)
        if (debounceTimer.current) clearTimeout(debounceTimer.current)
        if (!query.trim()) {
            setSearchResults(null)
            setIsSearching(false)
            return
        }
        setIsSearching(true)
        debounceTimer.current = setTimeout(async () => {
            try {
                const res = await fetch(`/api/products?search=${encodeURIComponent(query)}&limit=100`)
                if (res.ok) {
                    const data = await res.json()
                    setSearchResults(data.products || data || [])
                }
            } catch (err) {
                console.error("Error en búsqueda:", err)
            } finally {
                setIsSearching(false)
            }
        }, 300)
    }

    const dynamicProducts = searchResults || []

    const filteredProducts = useMemo(() => {
        if (searchQuery.trim()) {
            if (searchResults !== null) return searchResults
            const fuzzyMatch = (str: string, target: string) => {
                const s = str.toLowerCase().replace(/[\s\-_]/g, '')
                const t = target.toLowerCase().replace(/[\s\-_]/g, '')
                return t.includes(s) || s.includes(t)
            }
            return initialProducts.filter((p: any) => {
                const target = `${p.name} ${p.description || ''} ${p.category?.name || ''} ${p.provider || ''}`
                return fuzzyMatch(searchQuery, target)
            })
        }
        const base = dynamicProducts.length > 0 ? dynamicProducts : initialProducts
        if (activeSubcategoryId) {
            return base.filter((p: any) => p.category?.id === activeSubcategoryId)
        } else if (activeMainCategoryId) {
            const subCatIds = metadata.categories.filter((c: any) => c.parentId === activeMainCategoryId).map((c: any) => c.id)
            return base.filter((p: any) => p.category?.id === activeMainCategoryId || subCatIds.includes(p.category?.id))
        }
        return base
    }, [searchQuery, searchResults, dynamicProducts, initialProducts, activeMainCategoryId, activeSubcategoryId, metadata.categories])

    return (
        <div className="w-full bg-[#F3F4F6] min-h-screen text-slate-800 font-sans pb-20">
            {/* HERO SECTION ESTILO MOCKUP PIZZO */}
            <header className="w-full bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-600 pt-8 pb-24 px-4 sm:px-8 rounded-b-[2.5rem] shadow-xl relative overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    {/* Top Navigation */}
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10 text-white">
                        <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-xl bg-white text-indigo-700 font-black flex items-center justify-center text-lg shadow-md">
                                A
                            </span>
                            <span className="text-xl font-black uppercase tracking-wider">ATOMIC</span>
                        </div>
                        
                        <div className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-indigo-100">
                            <a href="#productos" className="hover:text-white transition-colors">Inicio</a>
                            <a href="#categorias" className="hover:text-white transition-colors">Categorías</a>
                            <a href="#destacados" className="hover:text-white transition-colors">Destacados</a>
                            <a href="#contacto" className="hover:text-white transition-colors">Contacto</a>
                        </div>

                        <Link href="/web/cart" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-xs font-bold transition-all border border-white/10">
                            <ShoppingBag size={16} />
                            <span>Carrito</span>
                        </Link>
                    </div>

                    {/* Banner Tarjeta Hero Estilo Pizzo */}
                    <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-2xl grid md:grid-cols-2 gap-8 items-center text-slate-800">
                        <div className="aspect-4/3 bg-slate-50 rounded-2xl p-6 flex items-center justify-center overflow-hidden border border-slate-100">
                            <SafeImage 
                                src="/assets/ecommerce/intro_banner.jpg" 
                                alt="Colección Destacada ATOMIC" 
                                className="w-full h-full object-contain hover:scale-105 transition-transform duration-500" 
                            />
                        </div>
                        <div className="flex flex-col justify-center space-y-4">
                            <span className="text-xs font-bold uppercase text-indigo-600 tracking-widest bg-indigo-50 px-3 py-1 rounded-full w-fit">
                                Colección Principal 2026
                            </span>
                            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight uppercase leading-tight">
                                Tecnología & Prefabricados ATOMIC
                            </h1>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                Explora nuestro catálogo certificado con precios actualizados en tiempo real y soporte técnico garantizado.
                            </p>
                            <div className="pt-2">
                                <a 
                                    href="#productos" 
                                    className="inline-flex items-center justify-center px-8 py-3.5 bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-0.5"
                                >
                                    Explorar Catálogo
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* SECCIÓN DE BÚSQUEDA Y CATEGORÍAS */}
            <main className="max-w-7xl mx-auto px-4 sm:px-8 -mt-10 relative z-20 space-y-12">

                {/* BARRA DE BÚSQUEDA FLOTANTE */}
                <div className="bg-white rounded-2xl p-4 shadow-xl border border-slate-100 flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            placeholder="Buscar por producto, marca o especificación..."
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all"
                        />
                        {searchQuery && (
                            <button onClick={() => handleSearchChange("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                                <X size={16} />
                            </button>
                        )}
                    </div>
                    {isSearching && (
                        <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    )}
                </div>

                {/* TARJETAS DE CATEGORÍAS ESTILO MOCKUP (ICONOS AZULES EN CONTENEDORES PASTEL) */}
                <section id="categorias" className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-extrabold text-slate-900 uppercase tracking-tight">Categorías</h2>
                        <button 
                            onClick={() => { setActiveMainCategoryId(null); setActiveSubcategoryId(null); setSearchQuery(""); }} 
                            className="text-xs font-bold text-indigo-600 hover:bg-indigo-50 px-4 py-1.5 rounded-lg transition-colors border border-transparent hover:border-indigo-100"
                        >
                            Ver todo
                        </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                        {metadata.categories.slice(0, 5).map((cat: any) => {
                            const isSelected = activeMainCategoryId === cat.id;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => {
                                        setSearchQuery("");
                                        if (isSelected) {
                                            setActiveMainCategoryId(null);
                                            setActiveSubcategoryId(null);
                                        } else {
                                            setActiveMainCategoryId(cat.id);
                                            setActiveSubcategoryId(null);
                                        }
                                    }}
                                    className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center gap-3 text-center ${
                                        isSelected 
                                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/25 scale-[1.02]' 
                                            : 'bg-indigo-50/60 hover:bg-indigo-100/80 border-indigo-100/80 text-slate-800 hover:shadow-md'
                                    }`}
                                >
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isSelected ? 'bg-white text-indigo-600' : 'bg-white text-indigo-600 shadow-sm'}`}>
                                        <Layers size={22} />
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-tight line-clamp-1">{cat.name}</span>
                                </button>
                            );
                        })}
                    </div>
                </section>

                {/* SECCIÓN DE PRODUCTOS DESTACADOS (TARJETAS BLANCAS CON PRECIO ÚNICO) */}
                <section id="productos" className="space-y-6 pt-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-extrabold text-slate-900 uppercase tracking-tight">Catálogo de Productos</h2>
                            <p className="text-xs text-slate-500 mt-0.5">{filteredProducts.length} artículos disponibles</p>
                        </div>
                    </div>

                    {filteredProducts.length === 0 ? (
                        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                            <p className="text-sm font-bold text-slate-600 mb-2">No se encontraron productos con el filtro aplicado</p>
                            <button
                                onClick={() => { setSearchQuery(""); setActiveMainCategoryId(null); setActiveSubcategoryId(null); }}
                                className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-indigo-700 transition-colors"
                            >
                                Limpiar Filtros
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {filteredProducts.map((p: any) => {
                                const imgs = safeParseArray(p.images);
                                const primaryImg = imgs.length > 0 ? imgs[0] : '/img/placeholder.png';
                                const finalPrice = calculateDiscountedPrice(p.price, userRole);

                                return (
                                    <Link
                                        key={p.id}
                                        href={`/web/product/${p.id}`}
                                        className="group bg-white rounded-2xl p-4 border border-slate-100 hover:border-indigo-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                                    >
                                        {/* Imagen del producto */}
                                        <div className="aspect-square bg-slate-50 rounded-xl p-4 flex items-center justify-center overflow-hidden mb-4 relative">
                                            <SafeImage 
                                                src={primaryImg} 
                                                alt={p.name} 
                                                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" 
                                            />
                                        </div>

                                        {/* Titulo y Precio Limpio (Único, Sin Tachados) */}
                                        <div className="flex items-end justify-between gap-3 pt-2 border-t border-slate-50">
                                            <div className="flex-1">
                                                <h3 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
                                                    {p.name}
                                                </h3>
                                                <span className="text-[10px] text-slate-400 font-medium block mt-1">
                                                    {p.category?.name || 'General'}
                                                </span>
                                            </div>

                                            <div className="text-right">
                                                <span className="text-lg font-black text-slate-900 font-mono">
                                                    ${finalPrice.toFixed(0)}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </section>

                {/* BANNERS COMPLEMENTARIOS */}
                <SpyCameraBanner />
                <SmartIntercomBanner />
                <HomeCategoryBanner activeMainCategoryId={activeMainCategoryId} categories={metadata.categories} />
                <ElectronicsCategoryBanner activeMainCategoryId={activeMainCategoryId} categories={metadata.categories} />
                <PhonesCategoryBanner activeMainCategoryId={activeMainCategoryId} categories={metadata.categories} />
            </main>

            {/* FOOTER LIMPIO */}
            <footer id="contacto" className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-slate-200 text-center text-xs text-slate-400 font-mono">
                ATOMIC HEAVY MACHINERY & ELECTRONICS — CATÁLOGO COMERCIAL OFICIAL
            </footer>
        </div>
    )
}
