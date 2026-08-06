"use client"

// Version: 3.0.0 - Design Redesign Inspired by Minimalist Catalog Layout (Bershka / Clean E-Commerce)
import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { 
    ShoppingBag, ChevronRight, ArrowRight, Shield, Zap, Truck, ChevronLeft, Hexagon, 
    Star, X, Smartphone, Database, Sparkles, Code, Bot, Download, Search, ImageOff, 
    AlertCircle, Home, Building, Factory, Cpu, SlidersHorizontal, ChevronDown, Check,
    Filter, ArrowUpDown
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

/* ─── Robust Image Component with Fallback ─── */
function SafeImage({ src, alt, className, fill = false, width, height, ...props }: any) {
    const [error, setError] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const imgRef = useRef<HTMLImageElement>(null)

    useEffect(() => {
        if (imgRef.current?.complete) {
            setIsLoading(false)
        }
    }, [src])

    const handleLoad = () => {
        setIsLoading(false)
    }

    const handleError = () => {
        setIsLoading(false)
        setError(true)
    }

    if (!src || error) {
        return (
            <div className={`flex flex-col items-center justify-center bg-[#F6F6F6] border border-neutral-200 p-4 ${className} ${fill ? 'absolute inset-0' : ''}`}>
                <div className="relative">
                    <Hexagon className="text-neutral-300 w-10 h-10 animate-[spin_20s_linear_infinite]" strokeWidth={1} />
                    <ImageOff className="absolute inset-0 m-auto text-neutral-400" size={16} />
                </div>
                <span className="text-[8px] font-medium text-neutral-400 uppercase tracking-widest mt-2">No disponible</span>
            </div>
        )
    }

    return (
        <div className={`relative overflow-hidden bg-[#F6F6F6] ${fill ? 'absolute inset-0 w-full h-full' : ''} ${className}`}>
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
                <div className="absolute inset-0 flex items-center justify-center bg-[#F6F6F6]/80 backdrop-blur-xs">
                    <div className="w-5 h-5 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
                </div>
            )}
        </div>
    )
}

export default function PublicWebClient({ initialProducts, metadata, userRole, storeSettings }: any) {
    const [searchQuery, setSearchQuery] = useState("")
    const [searchResults, setSearchResults] = useState<any[] | null>(null)
    const [isSearching, setIsSearching] = useState(false)
    const [activeMainCategoryId, setActiveMainCategoryId] = useState<string | null>(null)
    const [activeSubcategoryId, setActiveSubcategoryId] = useState<string | null>(null)
    const [showFilters, setShowFilters] = useState(true)
    const [sortBy, setSortBy] = useState<"popularity" | "price-asc" | "price-desc" | "newest">("popularity")
    const [activeTab, setActiveTab] = useState<"COLECCIÓN" | "NOVEDADES" | "CONSOLAS" | "DIRECTORIO">("COLECCIÓN")

    // Debouncing search requests to server
    const searchDebounceRef = useRef<NodeJS.Timeout | null>(null)
    const performSearch = useCallback((query: string) => {
        if (!query.trim()) {
            setSearchResults(null)
            setIsSearching(false)
            return
        }
        setIsSearching(true)
        if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current)

        searchDebounceRef.current = setTimeout(async () => {
            try {
                const res = await fetch(`/api/products?search=${encodeURIComponent(query)}&limit=160`)
                if (res.ok) {
                    const data = await res.json()
                    const items = Array.isArray(data) ? data : data.products || []
                    setSearchResults(items)
                }
            } catch (err) {
                console.error("Error buscando productos:", err)
            } finally {
                setIsSearching(false)
            }
        }, 250)
    }, [])

    const handleSearchInput = (val: string) => {
        setSearchQuery(val)
        performSearch(val)
    }

    const dynamicProducts = searchResults || []

    const filteredProducts = useMemo(() => {
        let result = []
        if (searchQuery.trim()) {
            if (searchResults !== null) {
                result = searchResults
            } else {
                const fuzzyMatch = (str: string, target: string) => {
                    const s = str.toLowerCase().replace(/[\s\-_]/g, '')
                    const t = target.toLowerCase().replace(/[\s\-_]/g, '')
                    return t.includes(s) || s.includes(t)
                }
                result = initialProducts.filter((p: any) => {
                    const target = `${p.name} ${p.description || ''} ${p.category?.name || ''} ${p.provider || ''}`
                    return fuzzyMatch(searchQuery, target)
                })
            }
        } else {
            const base = dynamicProducts.length > 0 ? dynamicProducts : initialProducts
            if (activeSubcategoryId) {
                result = base.filter((p: any) => p.category?.id === activeSubcategoryId)
            } else if (activeMainCategoryId) {
                const subCatIds = metadata.categories.filter((c: any) => c.parentId === activeMainCategoryId).map((c: any) => c.id)
                result = base.filter((p: any) => p.category?.id === activeMainCategoryId || subCatIds.includes(p.category?.id))
            } else {
                result = base
            }
        }

        // Sorting
        const sorted = [...result]
        if (sortBy === "price-asc") {
            sorted.sort((a, b) => Number(a.price) - Number(b.price))
        } else if (sortBy === "price-desc") {
            sorted.sort((a, b) => Number(b.price) - Number(a.price))
        } else if (sortBy === "newest") {
            sorted.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
        }

        return sorted
    }, [searchQuery, searchResults, dynamicProducts, initialProducts, activeMainCategoryId, activeSubcategoryId, metadata.categories, sortBy])

    const subcategories = activeMainCategoryId ? metadata.categories.filter((c: any) => c.parentId === activeMainCategoryId) : []
    const activeCatObj = metadata.categories.find((c: any) => c.id === activeMainCategoryId)

    return (
        <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white">
            
            {/* ── 1. CLEAN BERSHKA-STYLE HEADER NAVIGATION ── */}
            <header className="bg-white border-b border-neutral-200 sticky top-0 z-50 px-6 py-4 shadow-2xs">
                <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-6">
                    
                    {/* LOGO */}
                    <Link 
                        href="/web"
                        onClick={() => { setSearchQuery(""); setActiveMainCategoryId(null); setActiveSubcategoryId(null); }}
                        className="flex items-center gap-2 group"
                    >
                        <span className="w-7 h-7 rounded-sm bg-neutral-900 text-white font-black flex items-center justify-center text-xs tracking-tighter">
                            A
                        </span>
                        <span className="text-xl font-extrabold tracking-tight text-neutral-900 uppercase">
                            ATOMIC
                        </span>
                    </Link>

                    {/* TOP NAVIGATION TABS */}
                    <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-neutral-600">
                        <button
                            onClick={() => { setActiveTab("COLECCIÓN"); setActiveMainCategoryId(null); setActiveSubcategoryId(null); setSearchQuery(""); }}
                            className={`pb-1 border-b-2 transition-all ${activeTab === "COLECCIÓN" && !activeMainCategoryId && !searchQuery ? 'border-neutral-900 text-neutral-900 font-bold' : 'border-transparent hover:text-neutral-900'}`}
                        >
                            COLECCIÓN
                        </button>
                        <button
                            onClick={() => { setActiveTab("NOVEDADES"); setSortBy("newest"); setActiveMainCategoryId(null); setActiveSubcategoryId(null); }}
                            className={`pb-1 border-b-2 transition-all ${activeTab === "NOVEDADES" ? 'border-neutral-900 text-neutral-900 font-bold' : 'border-transparent hover:text-neutral-900'}`}
                        >
                            NOVEDADES
                        </button>
                        <Link
                            href="/web/consolas"
                            className="pb-1 border-b-2 border-transparent hover:text-neutral-900 transition-all"
                        >
                            CONSOLAS
                        </Link>
                        <Link
                            href="/links"
                            className="pb-1 border-b-2 border-transparent hover:text-neutral-900 transition-all"
                        >
                            DIRECTORIO
                        </Link>
                    </nav>

                    {/* SEARCH INPUT BAR (RIGHT SIDE LUPA FUNCIONAL) */}
                    <div className="relative w-48 sm:w-64 md:w-80">
                        <div className="relative flex items-center">
                            {isSearching ? (
                                <div className="absolute left-3 w-3.5 h-3.5 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <Search className="absolute left-3 text-neutral-400" size={14} />
                            )}
                            <input 
                                type="text"
                                value={searchQuery}
                                onChange={(e) => handleSearchInput(e.target.value)}
                                placeholder="Buscar producto..."
                                className="w-full bg-[#F5F5F5] border border-neutral-200 rounded-md py-2 pl-9 pr-8 text-xs font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:bg-white transition-all"
                            />
                            {searchQuery && (
                                <button 
                                    onClick={() => handleSearchInput("")}
                                    className="absolute right-2.5 text-neutral-400 hover:text-neutral-900"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    </div>

                </div>
            </header>

            {/* ── 2. CATALOG CONTAINER WITH SIDEBAR FILTERS & PRODUCT GRID ── */}
            <div className="max-w-[1600px] mx-auto px-6 py-8">
                
                {/* TOP HEADER CONTROLS (FILTER TOGGLE, BREADCRUMB, SORT) */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-neutral-100 text-xs text-neutral-500">
                    
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 font-bold text-neutral-900 hover:text-neutral-600 transition-colors uppercase tracking-wider"
                        >
                            <SlidersHorizontal size={14} />
                            <span>{showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}</span>
                            <ChevronDown size={14} className={`transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
                        </button>

                        {/* BREADCRUMB */}
                        <div className="hidden sm:flex items-center gap-2 text-neutral-400 font-medium">
                            <Link href="/web" className="hover:text-neutral-900 transition-colors">Catálogo</Link>
                            <span>&gt;</span>
                            <span className="text-neutral-900 font-semibold">
                                {activeCatObj ? activeCatObj.name : 'Todos los Artículos'}
                            </span>
                            {activeSubcategoryId && (
                                <>
                                    <span>&gt;</span>
                                    <span className="text-neutral-900 font-semibold">
                                        {metadata.categories.find((c: any) => c.id === activeSubcategoryId)?.name}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-4 justify-between md:justify-end">
                        <span className="font-semibold text-neutral-400 uppercase tracking-widest text-[11px]">
                            {filteredProducts.length} ARTÍCULOS
                        </span>

                        {/* SORT DROPDOWN */}
                        <div className="flex items-center gap-2 font-medium">
                            <span>Ordenar:</span>
                            <select
                                value={sortBy}
                                onChange={(e: any) => setSortBy(e.target.value)}
                                className="bg-transparent font-bold text-neutral-900 outline-none cursor-pointer border-b border-neutral-300 pb-0.5"
                            >
                                <option value="popularity">Popularidad</option>
                                <option value="price-asc">Precio: Menor a Mayor</option>
                                <option value="price-desc">Precio: Mayor a Menor</option>
                                <option value="newest">Novedades</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* MAIN CONTENT SPLIT: SIDEBAR FILTERS (IZQUIERDA) + PRODUCT GRID (DERECHA) */}
                <div className="flex gap-10 items-start">
                    
                    {/* LEFT SIDEBAR FILTERS */}
                    <AnimatePresence initial={false}>
                        {showFilters && (
                            <motion.aside
                                initial={{ width: 0, opacity: 0 }}
                                animate={{ width: 240, opacity: 1 }}
                                exit={{ width: 0, opacity: 0 }}
                                transition={{ duration: 0.25 }}
                                className="shrink-0 overflow-hidden text-xs space-y-8 pr-4 border-r border-neutral-100 hidden md:block"
                            >
                                {/* CATEGORÍAS PRINCIPALES (TIPOLOGÍA) */}
                                <div className="space-y-3">
                                    <h3 className="font-bold text-neutral-900 uppercase tracking-wider text-[11px]">
                                        Tipología
                                    </h3>

                                    <div className="space-y-2">
                                        <label 
                                            onClick={() => { setActiveMainCategoryId(null); setActiveSubcategoryId(null); setSearchQuery(""); }}
                                            className="flex items-center gap-3 cursor-pointer hover:text-neutral-900 transition-colors group"
                                        >
                                            <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${!activeMainCategoryId ? 'border-neutral-900 bg-neutral-900' : 'border-neutral-300 group-hover:border-neutral-500'}`}>
                                                {!activeMainCategoryId && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                            </div>
                                            <span className={!activeMainCategoryId ? 'font-bold text-neutral-900' : 'text-neutral-600'}>
                                                Todos ({initialProducts.length})
                                            </span>
                                        </label>

                                        {metadata.categories.filter((c: any) => !c.parentId).map((cat: any) => {
                                            const isSelected = activeMainCategoryId === cat.id
                                            return (
                                                <label 
                                                    key={cat.id}
                                                    onClick={() => {
                                                        if (isSelected) {
                                                            setActiveMainCategoryId(null)
                                                            setActiveSubcategoryId(null)
                                                        } else {
                                                            setActiveMainCategoryId(cat.id)
                                                            setActiveSubcategoryId(null)
                                                        }
                                                        setSearchQuery("")
                                                    }}
                                                    className="flex items-center gap-3 cursor-pointer hover:text-neutral-900 transition-colors group"
                                                >
                                                    <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${isSelected ? 'border-neutral-900 bg-neutral-900' : 'border-neutral-300 group-hover:border-neutral-500'}`}>
                                                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                                    </div>
                                                    <span className={isSelected ? 'font-bold text-neutral-900' : 'text-neutral-600'}>
                                                        {cat.name}
                                                    </span>
                                                </label>
                                            )
                                        })}
                                    </div>
                                </div>

                                {/* SUBCATEGORÍAS SECUNDARIAS */}
                                {subcategories.length > 0 && (
                                    <div className="space-y-3 pt-4 border-t border-neutral-100">
                                        <h3 className="font-bold text-neutral-900 uppercase tracking-wider text-[11px]">
                                            Subcategoría
                                        </h3>

                                        <div className="space-y-2 max-h-60 overflow-y-auto pr-2 scrollbar-thin">
                                            {subcategories.map((sub: any) => {
                                                const isSubSelected = activeSubcategoryId === sub.id
                                                return (
                                                    <label 
                                                        key={sub.id}
                                                        onClick={() => setActiveSubcategoryId(isSubSelected ? null : sub.id)}
                                                        className="flex items-center gap-3 cursor-pointer hover:text-neutral-900 transition-colors group"
                                                    >
                                                        <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${isSubSelected ? 'border-neutral-900 bg-neutral-900' : 'border-neutral-300 group-hover:border-neutral-500'}`}>
                                                            {isSubSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                                        </div>
                                                        <span className={isSubSelected ? 'font-bold text-neutral-900' : 'text-neutral-600'}>
                                                            {sub.name}
                                                        </span>
                                                    </label>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}

                            </motion.aside>
                        )}
                    </AnimatePresence>

                    {/* RIGHT PRODUCT GRID (FORMATO CATÁLOGO BERSHKA) */}
                    <main className="flex-1">
                        {filteredProducts.length === 0 ? (
                            <div className="py-24 text-center border border-dashed border-neutral-200 rounded-lg">
                                <p className="text-neutral-400 text-xs font-semibold uppercase tracking-widest mb-3">No hay productos en esta selección</p>
                                <button
                                    onClick={() => { setSearchQuery(""); setActiveMainCategoryId(null); setActiveSubcategoryId(null); }}
                                    className="px-6 py-2 bg-neutral-900 text-white rounded-sm text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
                                >
                                    Ver Todo el Catálogo
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                                {filteredProducts.map((p: any) => {
                                    const imgs = safeParseArray(p.images)
                                    const primaryImg = imgs.length > 0 ? imgs[0] : ''
                                    const finalPrice = calculateDiscountedPrice(p.price, userRole)

                                    return (
                                        <Link
                                            key={p.id}
                                            href={`/web/product/${p.id}`}
                                            className="group flex flex-col space-y-2 cursor-pointer"
                                        >
                                            {/* IMAGE CONTAINER (TALL RATIO ASP-3/4) */}
                                            <div className="aspect-[3/4] bg-[#F6F6F6] rounded-xs relative overflow-hidden flex items-center justify-center p-6 border border-neutral-100 group-hover:border-neutral-300 transition-colors">
                                                <SafeImage 
                                                    src={primaryImg} 
                                                    alt={p.name} 
                                                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" 
                                                />
                                            </div>

                                            {/* TITLE & UNIFIED PVP PRICE (SINGLE PRICE, ZERO STRIKETHROUGH) */}
                                            <div className="pt-1">
                                                <h4 className="text-[12px] font-medium text-neutral-800 line-clamp-1 group-hover:text-black transition-colors leading-tight">
                                                    {p.name}
                                                </h4>
                                                <p className="text-[13px] font-black text-neutral-950 mt-1 font-sans">
                                                    {finalPrice.toFixed(2).replace('.', ',')} $
                                                </p>
                                            </div>
                                        </Link>
                                    )
                                })}
                            </div>
                        )}
                    </main>

                </div>

            </div>

            {/* BANNERS COMPLEMENTARIOS */}
            <div className="max-w-[1600px] mx-auto px-6 mt-16 space-y-12">
                <SpyCameraBanner />
                <SmartIntercomBanner />
            </div>

            {/* ── FOOTER MINIMALISTA ── */}
            <footer className="max-w-[1600px] mx-auto px-6 mt-20 pt-8 border-t border-neutral-200 text-center text-[11px] text-neutral-400 font-medium tracking-wider">
                ATOMIC ELECTRONICS & HEAVY MACHINERY — CATÁLOGO OFICIAL 2026
            </footer>
        </div>
    )
}
