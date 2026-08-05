"use client"

// Version: 2.1.0 - One Page Love Style Top Navbar & Hover Megamenu Dropdowns
import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { 
    ShoppingBag, ChevronRight, ArrowRight, Shield, Zap, Truck, ChevronLeft, Hexagon, 
    Star, X, Smartphone, Database, Sparkles, Code, Bot, Download, Search, ImageOff, 
    AlertCircle, Home, Building, Factory, Cpu, Layers, Gamepad2, ChevronDown, Monitor
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
            <div className={`flex flex-col items-center justify-center bg-slate-900 border border-slate-800 p-4 ${className} ${fill ? 'absolute inset-0' : ''}`}>
                <div className="relative">
                    <Hexagon className="text-slate-700 w-10 h-10 animate-[spin_20s_linear_infinite]" strokeWidth={1} />
                    <ImageOff className="absolute inset-0 m-auto text-slate-600" size={16} />
                </div>
                <span className="text-[7px] font-bold text-slate-500 uppercase tracking-widest mt-2">No disponible</span>
            </div>
        )
    }

    return (
        <div className={`relative overflow-hidden bg-slate-950 ${fill ? 'absolute inset-0 w-full h-full' : ''} ${className}`}>
            <img
                ref={imgRef}
                src={src}
                alt={alt}
                onLoad={handleLoad}
                onError={handleError}
                className={`transition-all duration-700 ${isLoading ? 'scale-110 blur-xl opacity-0' : 'scale-100 blur-0 opacity-100'} ${fill ? 'w-full h-full object-contain' : ''}`}
                style={{ width: fill ? '100%' : width, height: fill ? '100%' : height }}
                referrerPolicy="no-referrer"
                {...props}
            />
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm">
                    <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                </div>
            )}
        </div>
    )
}

/* ─── Main Public Web Store Client ─── */
export default function PublicWebClient({ initialProducts, metadata, userRole, storeSettings }: any) {
    const [searchQuery, setSearchQuery] = useState("")
    const [searchResults, setSearchResults] = useState<any[] | null>(null)
    const [isSearching, setIsSearching] = useState(false)
    const [activeMainCategoryId, setActiveMainCategoryId] = useState<string | null>(null)
    const [activeSubcategoryId, setActiveSubcategoryId] = useState<string | null>(null)
    const [isLoadingCategory, setIsLoadingCategory] = useState(false)

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
                const res = await fetch(`/api/products?search=${encodeURIComponent(query)}&limit=120`)
                if (res.ok) {
                    const data = await res.json()
                    const items = Array.isArray(data) ? data : data.products || []
                    setSearchResults(items)
                }
            } catch (err) {
                console.error("Error realizando búsqueda:", err)
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
        <div className="w-full pb-20 bg-[#020617] text-slate-100 font-sans min-h-screen">
            {/* ─── STICKY TOP NAVBAR ESTILO ONE PAGE LOVE CON HOVER MEGAMENU ─── */}
            <TopStickyNavbar 
                searchQuery={searchQuery}
                onSearchChange={handleSearchInput}
                isSearching={isSearching}
                categories={metadata.categories}
                activeMainCategoryId={activeMainCategoryId}
                setActiveMainCategoryId={setActiveMainCategoryId}
                activeSubcategoryId={activeSubcategoryId}
                setActiveSubcategoryId={setActiveSubcategoryId}
            />

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="relative z-10">

                {/* ─── WELCOME BANNER & CATEGORY CARDS ─── */}
                <MinimalStoreHero 
                    searchQuery={searchQuery} 
                    setSearchQuery={handleSearchInput}
                    activeMainCategoryId={activeMainCategoryId}
                    setActiveMainCategoryId={setActiveMainCategoryId}
                    activeSubcategoryId={activeSubcategoryId}
                    setActiveSubcategoryId={setActiveSubcategoryId}
                    categories={metadata.categories}
                    isSearching={isSearching}
                    searchResults={searchResults}
                />

                <HomeCategoryBanner 
                    activeMainCategoryId={activeMainCategoryId} 
                    categories={metadata.categories} 
                />

                <ElectronicsCategoryBanner 
                    activeMainCategoryId={activeMainCategoryId} 
                    categories={metadata.categories} 
                />

                <PhonesCategoryBanner 
                    activeMainCategoryId={activeMainCategoryId} 
                    categories={metadata.categories} 
                />

                {/* ─── PRODUCT GRID ─── */}
                <section className="w-full max-w-7xl mx-auto px-6 py-8" id="productos">
                    {searchQuery ? (
                        filteredProducts.length === 0 ? (
                            <div className="py-20 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-950/50">
                                <p className="text-slate-400 text-xs font-mono uppercase tracking-widest">No se encontraron productos para "{searchQuery}"</p>
                                <button onClick={() => { handleSearchInput(""); setActiveMainCategoryId(null); setActiveSubcategoryId(null); }} className="mt-4 text-cyan-400 text-xs font-mono uppercase tracking-widest hover:underline font-bold">
                                    Limpiar Búsqueda
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                    <h2 className="text-sm font-mono text-cyan-400 font-bold uppercase tracking-wider">
                                        Resultados de Búsqueda ({filteredProducts.length})
                                    </h2>
                                    <button onClick={() => handleSearchInput("")} className="text-xs text-slate-400 hover:text-white font-mono">
                                        Limpiar ✕
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                    {filteredProducts.map((p: any, i: number) => (
                                        <MiniProductCard key={p.id} product={p} userRole={userRole} delay={i * 0.02} />
                                    ))}
                                </div>
                            </div>
                        )
                    ) : (
                        <div className="mt-6 border-t border-slate-800/80 pt-8" id="productos">
                            {isLoadingCategory ? (
                                <div className="py-20 flex flex-col items-center justify-center">
                                    <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mb-4" />
                                    <p className="text-slate-400 text-[10px] uppercase tracking-[0.3em] font-black">Cargando catálogo...</p>
                                </div>
                            ) : filteredProducts.length === 0 ? (
                                <div className="py-20 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-950/50">
                                    <p className="text-slate-400 text-xs font-mono uppercase tracking-widest">No hay productos en esta categoría</p>
                                    <button onClick={() => { setActiveMainCategoryId(null); setActiveSubcategoryId(null); }} className="mt-4 text-cyan-400 text-xs font-mono uppercase tracking-widest hover:underline font-bold">
                                        Quitar Filtro
                                    </button>
                                </div>
                            ) : (
                                <InfiniteProductScroll products={filteredProducts} userRole={userRole} />
                            )}
                        </div>
                    )}
                </section>

                {/* BANNER DE PRESENTACIÓN */}
                {!searchQuery && !activeMainCategoryId && (
                    <IntroductionBanner />
                )}
            </motion.div>
        </div>
    )
}

/* ─── STICKY TOP NAVBAR ESTILO ONE PAGE LOVE CON DESPLEGABLE EN CADA CATEGORÍA ─── */
function TopStickyNavbar({ 
    searchQuery, onSearchChange, isSearching, 
    categories, activeMainCategoryId, setActiveMainCategoryId, 
    activeSubcategoryId, setActiveSubcategoryId 
}: any) {
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)

    // Build categories mapping
    const navCategories = [
        { id: categories.find((c: any) => c.slug === 'electronica')?.id || 'electronica', name: 'Electrónica', slug: 'electronica' },
        { id: categories.find((c: any) => c.slug === 'hogar')?.id || 'hogar', name: 'Hogar', slug: 'hogar' },
        { id: categories.find((c: any) => c.slug === 'residencial')?.id || 'residencial', name: 'Residencial', slug: 'residencial' },
        { id: categories.find((c: any) => c.slug === 'industrial')?.id || 'industrial', name: 'Industrial', slug: 'industrial' },
        { id: categories.find((c: any) => c.slug === 'software')?.id || 'software', name: 'Software', slug: 'software' },
    ]

    const getSubcategories = (mainCatId: string) => {
        return categories.filter((c: any) => c.parentId === mainCatId || (c.parent && c.parent.id === mainCatId))
    }

    const currentSubcats = hoveredCategory ? getSubcategories(hoveredCategory) : []
    const hoveredCatName = categories.find((c: any) => c.id === hoveredCategory)?.name || ''

    return (
        <header className="sticky top-0 z-50 bg-[#090d16]/95 backdrop-blur-xl border-b border-slate-800 text-slate-100 shadow-2xl">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
                
                {/* BRAND LOGO */}
                <Link 
                    href="/web" 
                    onClick={() => { onSearchChange(""); setActiveMainCategoryId(null); setActiveSubcategoryId(null); }}
                    className="flex items-center gap-3 group shrink-0"
                >
                    <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 text-slate-950 font-black flex items-center justify-center text-sm shadow-[0_0_15px_rgba(6,182,212,0.4)] group-hover:scale-105 transition-transform">
                        A
                    </span>
                    <div className="flex flex-col">
                        <span className="text-sm font-black tracking-widest uppercase text-white group-hover:text-cyan-400 transition-colors">
                            ATOMIC
                        </span>
                        <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest -mt-1">
                            Tienda en Línea
                        </span>
                    </div>
                </Link>

                {/* CENTER LINKS (ONE PAGE LOVE STYLE WITH HOVER MEGAMENU) */}
                <nav className="hidden lg:flex items-center gap-1 text-xs font-mono uppercase font-bold relative h-full">
                    
                    {/* INICIO LINK */}
                    <button
                        onClick={() => {
                            onSearchChange("");
                            setActiveMainCategoryId(null);
                            setActiveSubcategoryId(null);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`px-4 h-full border-b-2 flex items-center gap-1 transition-all ${!activeMainCategoryId && !searchQuery ? 'border-red-500 text-white font-black' : 'border-transparent text-slate-400 hover:text-white'}`}
                    >
                        Inicio
                    </button>

                    {/* DYNAMIC MAIN CATEGORIES WITH MOUSE OVER DROP-DOWN BOX */}
                    {navCategories.map((cat) => {
                        const isCatActive = activeMainCategoryId === cat.id
                        const subCount = getSubcategories(cat.id).length

                        return (
                            <div 
                                key={cat.id}
                                className="h-full flex items-center relative"
                                onMouseEnter={() => setHoveredCategory(cat.id)}
                                onMouseLeave={() => setHoveredCategory(null)}
                            >
                                <button
                                    onClick={() => {
                                        onSearchChange("");
                                        if (isCatActive) {
                                            setActiveMainCategoryId(null);
                                            setActiveSubcategoryId(null);
                                        } else {
                                            setActiveMainCategoryId(cat.id);
                                            setActiveSubcategoryId(null);
                                        }
                                        document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className={`px-4 h-full border-b-2 flex items-center gap-1 transition-all ${isCatActive || hoveredCategory === cat.id ? 'border-red-500 text-white font-black bg-slate-900/40' : 'border-transparent text-slate-400 hover:text-white'}`}
                                >
                                    <span>{cat.name}</span>
                                    {subCount > 0 && <ChevronDown size={12} className={`transition-transform duration-200 ${hoveredCategory === cat.id ? 'rotate-180 text-cyan-400' : 'text-slate-500'}`} />}
                                </button>
                            </div>
                        )
                    })}

                    {/* CONSOLAS LINK */}
                    <Link
                        href="/web/consolas"
                        className="px-4 h-full border-b-2 border-transparent hover:border-cyan-400 text-slate-400 hover:text-white flex items-center gap-1 transition-all"
                    >
                        <span>🎮 Consolas</span>
                    </Link>

                    {/* DIRECTORIO LINKS */}
                    <Link
                        href="/links"
                        className="px-4 h-full border-b-2 border-transparent hover:border-cyan-400 text-slate-400 hover:text-white flex items-center gap-1 transition-all"
                    >
                        <span>📋 Directorio</span>
                    </Link>
                </nav>

                {/* SEARCH INPUT BAR (LUPA FUNCIONAL EN LA DERECHA) */}
                <div className="relative w-48 sm:w-64 md:w-80">
                    <div className="relative flex items-center">
                        {isSearching ? (
                            <div className="absolute left-3 w-3.5 h-3.5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Search className="absolute left-3 text-slate-500" size={14} />
                        )}
                        <input 
                            type="text"
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder="Buscar..."
                            className="w-full bg-slate-950/80 border border-slate-800 rounded-lg py-1.5 pl-9 pr-8 text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500 transition-all"
                        />
                        {searchQuery && (
                            <button 
                                onClick={() => onSearchChange("")}
                                className="absolute right-2.5 text-slate-400 hover:text-white"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>
                </div>

            </div>

            {/* ── MEGAMENU DROPDOWN BOX FLOATING UPON HOVERING ANY CATEGORY ── */}
            <AnimatePresence>
                {hoveredCategory && (
                    <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.15 }}
                        onMouseEnter={() => setHoveredCategory(hoveredCategory)}
                        onMouseLeave={() => setHoveredCategory(null)}
                        className="absolute top-16 left-0 w-full bg-[#080c16]/98 border-b border-slate-800 shadow-2xl backdrop-blur-2xl z-50 py-6 px-8"
                    >
                        <div className="max-w-7xl mx-auto space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                                <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest flex items-center gap-2">
                                    <Layers size={14} /> Subcategorías Disponibles en {hoveredCatName}
                                </span>
                                <span className="text-[10px] font-mono text-slate-500 uppercase">
                                    Haz clic para filtrar productos
                                </span>
                            </div>

                            {currentSubcats.length === 0 ? (
                                <div className="py-4 text-xs font-mono text-slate-400">
                                    No hay subcategorías secundarias en esta sección. Haz clic en <strong className="text-white">{hoveredCatName}</strong> para ver todos sus productos.
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                    {currentSubcats.map((sub: any) => (
                                        <button
                                            key={sub.id}
                                            onClick={() => {
                                                onSearchChange("");
                                                setActiveMainCategoryId(hoveredCategory);
                                                setActiveSubcategoryId(sub.id);
                                                setHoveredCategory(null);
                                                document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' });
                                            }}
                                            className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all group ${activeSubcategoryId === sub.id ? 'bg-cyan-500/20 border-cyan-400 text-white' : 'bg-slate-900/60 border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900 text-slate-300 hover:text-white'}`}
                                        >
                                            <span className="text-xs font-bold font-mono group-hover:text-cyan-400 transition-colors uppercase line-clamp-2">
                                                {sub.name}
                                            </span>
                                            <span className="text-[9px] font-mono text-slate-500 mt-2 flex items-center gap-1">
                                                Ver productos <ChevronRight size={10} className="group-hover:translate-x-1 transition-transform" />
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}

/* ── Minimal Store Hero con Saludo de Bienvenida e Iconos de Categoría (Estilo Imagen 1) ── */
function MinimalStoreHero({ 
    searchQuery, setSearchQuery,
    activeMainCategoryId, setActiveMainCategoryId,
    activeSubcategoryId, setActiveSubcategoryId,
    categories,
    isSearching,
    searchResults
}: { 
    searchQuery: string, setSearchQuery: (val: string) => void,
    activeMainCategoryId: string | null, setActiveMainCategoryId: (val: string | null) => void,
    activeSubcategoryId: string | null, setActiveSubcategoryId: (val: string | null) => void,
    categories: any[],
    isSearching: boolean,
    searchResults: any[] | null
}) {
    const cards = [
        { id: categories.find(c => c.slug === 'electronica')?.id || 'electronica', label: 'Electrónica', icon: <Cpu size={24} /> },
        { id: categories.find(c => c.slug === 'hogar')?.id || 'hogar', label: 'Hogar', icon: <Home size={24} /> },
        { id: categories.find(c => c.slug === 'residencial')?.id || 'residencial', label: 'Residencial', icon: <Building size={24} /> },
        { id: categories.find(c => c.slug === 'industrial')?.id || 'industrial', label: 'Industrial', icon: <Factory size={24} /> },
        { id: categories.find(c => c.slug === 'software')?.id || 'software', label: 'Software', icon: <Code size={24} /> }
    ];

    const subcategories = activeMainCategoryId ? categories.filter(c => c.parentId === activeMainCategoryId) : [];

    const scrollDown = () => {
        document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="pt-10 pb-16 flex flex-col items-center justify-center text-center px-6 border-b border-slate-800/80">
            {/* ATOM LOGO & WELCOME TITLE */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="mb-4 flex flex-col items-center"
            >
                <AtomLogo />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mb-2"
            >
                <span className="text-xs font-mono font-bold tracking-[0.3em] uppercase text-cyan-400 mb-2 block">
                    BIENVENIDO A ATOMIC ELECTRONICS
                </span>
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-white leading-none mb-4">
                    ATOMIC
                </h1>
            </motion.div>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="text-xs font-bold tracking-[0.4em] uppercase text-slate-400 mb-10 max-w-xl"
            >
                Infraestructura Tecnológica & Comercio Electrónico Certificado
            </motion.p>

            {/* HORIZONTAL CARDS (ESTILO IMAGEN 1) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="w-full max-w-5xl overflow-x-auto pb-4 scrollbar-hide"
            >
                <div className="flex items-center justify-center gap-4 min-w-max mx-auto px-4">
                    {cards.map((card) => (
                        <button
                            key={card.id}
                            onClick={() => {
                                setSearchQuery("");
                                if (activeMainCategoryId === card.id) {
                                    setActiveMainCategoryId(null);
                                    setActiveSubcategoryId(null);
                                } else {
                                    setActiveMainCategoryId(card.id);
                                    setActiveSubcategoryId(null);
                                }
                            }}
                            className={`group flex flex-col items-center justify-center gap-4 bg-slate-900/80 backdrop-blur-xl border text-slate-100 rounded-3xl w-36 h-36 border ${activeMainCategoryId === card.id ? 'border-cyan-400 shadow-[0_10px_40px_rgba(6,182,212,0.25)] scale-[1.05]' : 'border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.4)]'}
                                       hover:scale-[1.05] hover:shadow-[0_20px_40px_rgba(6,182,212,0.15)] hover:border-cyan-500/60 transition-all duration-300
                                       active:scale-[0.98] ease-out`}
                        >
                            <div className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all duration-300 ${activeMainCategoryId === card.id ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold' : 'bg-slate-950 border-slate-800 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950'}`}>
                                {card.icon}
                            </div>
                            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-slate-200 group-hover:text-white">
                                {card.label}
                            </span>
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* SUBCATEGORIES STRIP */}
            <AnimatePresence>
                {activeMainCategoryId && subcategories.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-full max-w-4xl overflow-x-auto scrollbar-hide flex items-center justify-center gap-3 px-4"
                    >
                        {subcategories.map((sub: any) => (
                            <button
                                key={sub.id}
                                onClick={() => {
                                    setActiveSubcategoryId(sub.id === activeSubcategoryId ? null : sub.id);
                                    scrollDown();
                                }}
                                className={`group flex flex-col items-center justify-center gap-2 bg-slate-900/80 backdrop-blur-xl text-white rounded-2xl w-36 h-24 border ${activeSubcategoryId === sub.id ? 'border-cyan-400 bg-cyan-500/20 scale-[1.05] shadow-xl' : 'border-slate-800'}
                                           hover:scale-[1.05] hover:border-cyan-400 transition-all duration-300 ease-out shrink-0`}
                            >
                                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-center px-3 leading-relaxed group-hover:text-cyan-300">
                                    {sub.name}
                                </span>
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}

function AtomLogo() {
    return (
        <svg width="64" height="64" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="36" cy="36" r="5" fill="#06b6d4" className="animate-pulse" />
            <ellipse cx="36" cy="36" rx="30" ry="10" stroke="rgba(6,182,212,0.6)" strokeWidth="1.5" fill="none" />
            <ellipse cx="36" cy="36" rx="30" ry="10" stroke="rgba(6,182,212,0.6)" strokeWidth="1.5" fill="none" transform="rotate(60 36 36)" />
            <ellipse cx="36" cy="36" rx="30" ry="10" stroke="rgba(6,182,212,0.6)" strokeWidth="1.5" fill="none" transform="rotate(120 36 36)" />
            <circle cx="66" cy="36" r="3" fill="#fff" />
            <circle cx="21" cy="10.5" r="3" fill="#fff" />
            <circle cx="21" cy="61.5" r="3" fill="#fff" />
        </svg>
    )
}

function MiniProductCard({ product: p, userRole, delay }: { product: any, userRole?: string, delay: number }) {
    const imgs = safeParseArray(p.images)
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay }}
        >
            <Link
                href={`/web/product/${p.id}`}
                className="group flex flex-col bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 hover:shadow-[0_10px_30px_rgba(6,182,212,0.15)] transition-all duration-300 rounded-2xl overflow-hidden"
            >
                <div className="aspect-square relative bg-slate-950 flex items-center justify-center overflow-hidden border-b border-slate-800/80">
                    <SafeImage src={imgs[0]} alt={p.name} fill className="p-3 group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-3">
                    <p className="text-[10px] font-mono text-slate-300 line-clamp-2 leading-tight group-hover:text-cyan-300 transition-colors mb-2">{p.name}</p>
                    <p className="text-xs font-mono font-black text-cyan-400">
                        ${calculateDiscountedPrice(p.price, userRole).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                </div>
            </Link>
        </motion.div>
    );
}

function InfiniteProductScroll({ products, userRole }: { products: any[], userRole?: string }) {
    const trackRef = useRef<HTMLDivElement>(null)
    const isDragging = useRef(false)
    const startX = useRef(0)
    const scrollLeft = useRef(0)

    const onMouseDown = (e: React.MouseEvent) => {
        isDragging.current = true
        startX.current = e.pageX - (trackRef.current?.offsetLeft ?? 0)
        scrollLeft.current = trackRef.current?.scrollLeft ?? 0
    }
    const onMouseMove = (e: React.MouseEvent) => {
        if (!isDragging.current || !trackRef.current) return
        e.preventDefault()
        const x = e.pageX - trackRef.current.offsetLeft
        trackRef.current.scrollLeft = scrollLeft.current - (x - startX.current)
    }
    const onMouseUp = () => { isDragging.current = false }

    const scroll = (dir: 'left' | 'right') => {
        trackRef.current?.scrollBy({ left: dir === 'right' ? 320 : -320, behavior: 'smooth' })
    }

    return (
        <div className="relative">
            <div className="absolute left-0 top-0 bottom-4 w-12 bg-gradient-to-r from-[#020617] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-[#020617] to-transparent z-10 pointer-events-none" />

            <button onClick={() => scroll('left')} className="absolute left-1 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-slate-900 border border-slate-800 text-slate-300 flex items-center justify-center hover:bg-cyan-500 hover:text-slate-950 transition-all shadow-lg">
                <ChevronLeft size={16} />
            </button>
            <button onClick={() => scroll('right')} className="absolute right-1 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-slate-900 border border-slate-800 text-slate-300 flex items-center justify-center hover:bg-cyan-500 hover:text-slate-950 transition-all shadow-lg">
                <ChevronRight size={16} />
            </button>

            <div
                ref={trackRef}
                className="flex gap-4 overflow-x-auto pb-4 px-10 cursor-grab active:cursor-grabbing select-none scrollbar-hide"
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseUp}
            >
                {products.map((p: any) => (
                    <Link
                        key={p.id}
                        href={`/web/product/${p.id}`}
                        className="shrink-0 w-44 group bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 transition-all duration-300 rounded-2xl overflow-hidden shadow-lg"
                        draggable={false}
                    >
                        <div className="h-36 relative bg-slate-950 flex items-center justify-center overflow-hidden border-b border-slate-800/80">
                             <SafeImage src={safeParseArray(p.images)[0]} alt={p.name} fill className="p-3 group-hover:scale-105 transition-transform duration-300" />
                        </div>
                        <div className="p-3">
                            <p className="text-[10px] font-mono text-slate-300 line-clamp-2 leading-snug mb-2 group-hover:text-cyan-300 transition-colors">{p.name}</p>
                            <p className="text-xs font-mono font-black text-cyan-400">${calculateDiscountedPrice(p.price, userRole).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

function CollectionBanner({ collection, products, reverse, userRole }: { collection: any, products: any[], reverse: boolean, userRole?: string }) {
    const galleryRef = useRef<HTMLDivElement>(null)
    const scrollGallery = (dir: 'left' | 'right') => {
        galleryRef.current?.scrollBy({ left: dir === 'right' ? 300 : -300, behavior: 'smooth' })
    }

    return (
        <motion.section 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="group relative bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl transition-all duration-500"
        >
            <div className="flex flex-col lg:flex-row items-stretch relative z-10">
                <div className="w-full lg:w-[45%] p-8 flex flex-col justify-center relative border-b lg:border-b-0 lg:border-r border-slate-800">
                    <span className="px-3 py-1 text-[9px] font-mono font-bold uppercase tracking-[0.3em] rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 w-fit mb-4 flex items-center gap-2">
                        <Sparkles size={10} /> Colección Destacada
                    </span>
                    <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-4">
                        {collection.name}
                    </h2>
                    <p className="text-slate-400 text-xs leading-relaxed mb-6 font-light max-w-md">
                        {collection.description || `Equipamiento especializado y soluciones avanzadas para ${collection.name}.`}
                    </p>
                    <Link
                        href={`/web/collection/${collection.slug}`}
                        className="inline-flex items-center gap-2 text-slate-950 text-xs font-mono font-bold uppercase tracking-widest px-6 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 transition-all w-fit shadow-lg"
                    >
                        Explorar Catálogo <ArrowRight size={14} />
                    </Link>
                </div>
                <div className="w-full lg:w-[55%] p-6 bg-slate-950/60">
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                        {products.map((p: any) => (
                            <Link 
                                key={p.id}
                                href={`/web/product/${p.id}`} 
                                className="block w-44 shrink-0 bg-slate-900 border border-slate-800 rounded-2xl p-3 hover:border-cyan-400 transition-all shadow-md"
                            >
                                <div className="h-32 bg-slate-950 flex items-center justify-center relative mb-3 rounded-xl overflow-hidden border border-slate-800">
                                    <SafeImage src={safeParseArray(p.images)[0]} alt={p.name} fill className="p-3 hover:scale-105 transition-transform" />
                                </div>
                                <p className="text-[10px] font-mono text-slate-300 line-clamp-2 mb-2 h-7">{p.name}</p>
                                <p className="text-xs font-mono font-black text-cyan-400">${calculateDiscountedPrice(p.price, userRole).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </motion.section>
    )
}

function IntroductionBanner() {
    return (
        <section className="w-full max-w-7xl mx-auto px-6 pt-4 pb-20 flex flex-col items-center justify-center text-center">
            <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-[6vw] md:text-[4vw] font-black tracking-tighter uppercase text-white leading-[0.9] mb-8"
            >
                TECNOLOGÍA QUE <br/> <span className="text-cyan-400">TRANSFORMA</span>
            </motion.h2>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="max-w-3xl text-sm md:text-base font-light text-slate-400 leading-relaxed mb-12"
            >
                En <strong className="text-white font-bold">ATOMIC Electronics</strong>, construimos soluciones de alta gama. Desde electrónica de consumo hasta automatización e ingeniería avanzada. Cada producto incluye respaldo técnico certificado.
            </motion.p>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="w-full max-w-5xl mx-auto aspect-[16/7] md:aspect-[21/9] relative rounded-3xl overflow-hidden shadow-2xl border border-slate-800"
            >
                <Image 
                    src="/assets/ecommerce/intro_banner.jpg" 
                    alt="Atomic Industrial Equipment"
                    fill
                    className="object-cover"
                />
            </motion.div>
        </section>
    )
}
