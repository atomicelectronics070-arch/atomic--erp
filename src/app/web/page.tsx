"use client"

import { useState, useEffect, useRef } from "react"
import { ShoppingBag, ChevronRight, Star, ArrowRight, Shield, Zap, Truck, Search, Download, X, ChevronLeft, Monitor, Cpu, Gamepad2 } from "lucide-react"
import Link from "next/link"

const safeParseArr = (str: any) => {
    try { const p = JSON.parse(str); return Array.isArray(p) ? p : [] } catch { return [] }
}

export default function PublicWebPage() {
    const [products, setProducts] = useState<any[]>([])
    const [metadata, setMetadata] = useState<any>({ categories: [], collections: [] })
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [totalProducts, setTotalProducts] = useState(0)
    const [localSearch, setLocalSearch] = useState("")
    const [isSearching, setIsSearching] = useState(false)
    const [shopSettings, setShopSettings] = useState<any>(null)
    const [allProductsMap, setAllProductsMap] = useState<Record<string, any>>({})
    const itemsPerPage = 24

    // Load metadata + settings
    useEffect(() => {
        const init = async () => {
            const [mRes, s] = await Promise.all([
                fetch("/api/web/metadata").then(r => r.json()).catch(() => ({ categories: [], collections: [] })),
                fetch("/api/shop/settings").then(r => r.json()).catch(() => ({}))
            ])
            setMetadata(mRes)
            if (s?.settings) setShopSettings(s.settings)
        }
        init()
    }, [])

    // Debounce search
    useEffect(() => {
        if (loading) return
        const t = setTimeout(() => { setSearchQuery(localSearch); setCurrentPage(1) }, 500)
        return () => clearTimeout(t)
    }, [localSearch])

    // Load products
    useEffect(() => {
        const load = async () => {
            setIsSearching(true)
            try {
                const params = new URLSearchParams({
                    page: String(currentPage),
                    pageSize: String(itemsPerPage),
                    search: searchQuery
                })
                const res = await fetch(`/api/web/products?${params}`).then(r => r.json())
                setProducts(res.products || [])
                setTotalProducts(res.total || 0)
                // Build map for banner product lookup
                const map: Record<string, any> = {}
                ;(res.products || []).forEach((p: any) => { map[p.id] = p })
                setAllProductsMap(prev => ({ ...prev, ...map }))
            } catch(e) {
                console.error('Error loading products:', e)
            } finally { setIsSearching(false); setLoading(false) }
        }
        load()
    }, [currentPage, searchQuery])

    // Pre-fetch banner products if not already in map
    useEffect(() => {
        if (!shopSettings?.banners) return
        const allIds = [
            ...(shopSettings.banners.software?.productIds || []),
            ...(shopSettings.banners.automation?.productIds || []),
            ...(shopSettings.banners.gaming?.productIds || []),
        ]
        if (allIds.length === 0) return
        const missing = allIds.filter((id: string) => !allProductsMap[id])
        if (missing.length === 0) return
        fetch('/api/web/products?page=1&pageSize=200&search=').then(r => r.json()).then(res => {
            const map: Record<string, any> = {}
            ;(res.products || []).forEach((p: any) => { map[p.id] = p })
            setAllProductsMap(prev => ({ ...prev, ...map }))
        })
    }, [shopSettings])

    const totalPages = Math.ceil(totalProducts / itemsPerPage)
    const banners = shopSettings?.banners || {}

    const BANNER_CONFIGS = [
        {
            key: 'software',
            defaultTitle: 'Software & Desarrollo',
            defaultDesc: 'Licencias, herramientas y soluciones para llevar tu negocio al siguiente nivel.',
            defaultBg: 'from-slate-900 via-indigo-950 to-slate-900',
            accent: '#6366f1',
            accentDark: '#4338ca',
            icon: <Monitor size={14} />,
            tag: 'Software',
            tagBg: 'bg-indigo-600',
        },
        {
            key: 'automation',
            defaultTitle: 'Automatización Industrial',
            defaultDesc: 'Sistemas de control, PLCs y soluciones de automatización de última generación.',
            defaultBg: 'from-slate-900 via-pink-950 to-slate-900',
            accent: '#ec4899',
            accentDark: '#be185d',
            icon: <Cpu size={14} />,
            tag: 'Automatización',
            tagBg: 'bg-pink-600',
        },
        {
            key: 'gaming',
            defaultTitle: 'Gaming & Consolas',
            defaultDesc: 'El mejor equipamiento gamer, consolas y accesorios para la experiencia definitiva.',
            defaultBg: 'from-slate-900 via-violet-950 to-slate-900',
            accent: '#8b5cf6',
            accentDark: '#6d28d9',
            icon: <Gamepad2 size={14} />,
            tag: 'Gaming',
            tagBg: 'bg-violet-600',
        },
    ]

    return (
        <div className="min-h-screen bg-mesh text-neutral-900 font-sans">
            {/* Minimalist Navbar removido - Controlado por layout.tsx */}

            {/* ══════════════════════════════════════════
                 PRODUCTOS — PRIMERO
              ══════════════════════════════════════════ */}
            <section id="productos" className="bg-slate-950 py-32">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center space-y-4 mb-16">
                        <p className="text-indigo-500 text-[10px] font-black uppercase tracking-[0.3em]">Catálogo Real</p>
                        <h2 className="text-5xl font-light text-neutral-200 uppercase tracking-tighter">Equipos <span className="font-black text-white italic">Disponibles</span></h2>
                    </div>

                    <div className="mb-16 max-w-2xl mx-auto relative group">
                        <div className={`absolute inset-y-0 left-6 flex items-center pointer-events-none transition-all duration-300 ${isSearching ? 'text-indigo-500 scale-110' : 'text-neutral-500 group-focus-within:text-indigo-500'}`}>
                            {isSearching ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-indigo-500 border-t-transparent shadow-lg shadow-indigo-100"></div>
                            ) : (
                                <Search size={22} className="group-focus-within:scale-110 transition-transform" />
                            )}
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar en el catálogo tecnológico..."
                            value={localSearch}
                            onChange={(e) => setLocalSearch(e.target.value)}
                            className="w-full bg-slate-900/50 border-b-2 border-white/5 px-16 py-8 text-[11px] font-black uppercase tracking-[0.2em] focus:outline-none focus:border-indigo-500 transition-all shadow-2xl shadow-black/30 hover:shadow-indigo-500/10 placeholder:text-neutral-500 placeholder:italic text-white"
                        />
                        {localSearch && !isSearching && (
                            <button onClick={() => setLocalSearch("")} className="absolute inset-y-0 right-6 flex items-center text-neutral-300 hover:text-red-500 transition-colors">
                                <X size={18} />
                            </button>
                        )}
                    </div>

                    {loading ? (
                        <div className="py-32 text-center">
                            <div className="inline-block animate-pulse space-y-4">
                                <div className="h-4 w-64 bg-neutral-100 mx-auto"></div>
                                <div className="h-12 w-96 bg-neutral-100 mx-auto"></div>
                            </div>
                        </div>
                    ) : (
                        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 transition-opacity duration-300 ${isSearching ? 'opacity-50 grayscale' : 'opacity-100'}`}>
                            {products.map((p) => (
                                <Link
                                    key={p.id}
                                    href={`/web/product/${p.id}`}
                                    className="bg-white/5 group cursor-pointer border border-white/5 hover:border-indigo-500/40 transition-all flex flex-col h-full hover:shadow-2xl shadow-black/50 hover:shadow-indigo-500/10 rounded-2xl overflow-hidden"
                                >
                                    <div className="aspect-square bg-slate-900/50 relative overflow-hidden flex items-center justify-center p-8 border-b border-white/5">
                                        {(() => {
                                            const imgs = safeParseArr(p.images)
                                            return imgs.length > 0 ? (
                                                <img src={imgs[0]} alt={p.name} referrerPolicy="no-referrer" className="w-full h-full object-contain opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out" />
                                            ) : (
                                                <div className="text-neutral-600 uppercase font-black text-[10px] text-center">Sin imagen</div>
                                            )
                                        })()}
                                        {p.featured && (
                                            <div className="absolute top-4 right-4 bg-indigo-600 text-white text-[8px] font-black uppercase px-2 py-1 shadow-lg shadow-indigo-500/30">Destacado</div>
                                        )}
                                        <div className="absolute inset-x-0 bottom-0 bg-indigo-600 text-white py-4 text-[9px] font-black uppercase tracking-[0.3em] translate-y-full group-hover:translate-y-0 transition-transform flex items-center justify-center space-x-2">
                                            <span>Ver detalles</span> <ChevronRight size={12} />
                                        </div>
                                    </div>
                                    <div className="p-6 space-y-3 flex-1 flex flex-col group-hover:bg-white/5 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">{p.category?.name || 'Varios'}</span>
                                            {p.specSheetUrl && <Download size={12} className="text-white/20" />}
                                        </div>
                                        <h4 className="text-sm font-black uppercase tracking-wide text-white line-clamp-2 leading-[1.1] flex-1 group-hover:text-indigo-400 transition-colors italic">{p.name}</h4>
                                        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                                            <p className="text-xl font-black text-white font-mono tracking-tighter">${p.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                                            {p.compareAtPrice && <p className="text-[10px] text-white/20 line-through font-bold">${p.compareAtPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                            {totalProducts === 0 && (
                                <div className="col-span-4 py-20 text-center border-2 border-dashed border-neutral-100">
                                    <p className="font-black text-neutral-300 uppercase tracking-widest">No se encontraron productos</p>
                                </div>
                            )}
                        </div>
                    )}

                    {!loading && totalProducts > 0 && (
                        <div className="mt-24 flex flex-col items-center space-y-8">
                            <div className="flex items-center space-x-2">
                                <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} className="w-12 h-12 flex items-center justify-center border-2 border-white/5 text-white/30 hover:border-indigo-500 hover:text-indigo-500 disabled:opacity-10 transition-all font-black rounded-xl">&lt;</button>
                                {[...Array(totalPages)].map((_, i) => {
                                    const page = i + 1
                                    if (totalPages > 7 && page !== 1 && page !== totalPages && Math.abs(page - currentPage) > 1) {
                                        if (page === 2 || page === totalPages - 1) return <span key={page} className="text-white/10">...</span>
                                        return null
                                    }
                                    return (
                                        <button key={page} onClick={() => setCurrentPage(page)} className={`w-12 h-12 flex items-center justify-center border-2 font-black text-xs transition-all rounded-xl ${currentPage === page ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/40" : "bg-white/5 border-white/5 text-white/30 hover:border-indigo-500 hover:text-indigo-500"}`}>{page}</button>
                                    )
                                })}
                                <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} className="w-12 h-12 flex items-center justify-center border-2 border-white/5 text-white/30 hover:border-indigo-500 hover:text-indigo-500 disabled:opacity-10 transition-all font-black rounded-xl">&gt;</button>
                            </div>
                            <p className="text-[10px] font-black text-neutral-300 uppercase tracking-widest">Página {currentPage} de {totalPages} — {totalProducts} resultados</p>
                        </div>
                    )}
                </div>
            </section>

            {/* ══════════════════════════════════════════
                 CATEGORÍAS SCROLLABLES
              ══════════════════════════════════════════ */}
            <CategoriesBanner categories={metadata.categories} />

            {/* Features Bar */}
            <section className="bg-neutral-900 py-12">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
                    {[
                        { icon: <Truck />, title: "Envíos Gratis", desc: "Todo el país" },
                        { icon: <Shield />, title: "Garantía Total", desc: "Cobertura ATOMIC" },
                        { icon: <Zap />, title: "Pago Seguro", desc: "Confianza total" },
                        { icon: <Star />, title: "Soporte 24/7", desc: "Asistencia real" }
                    ].map((f, i) => (
                        <div key={i} className="flex items-center space-x-5 text-white/90">
                            <div className="text-indigo-500">{f.icon}</div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest">{f.title}</p>
                                <p className="text-xs text-white/50">{f.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ══════════════════════════════════════════
                 BANNERS HERO (Software / Auto / Gaming)
              ══════════════════════════════════════════ */}
            {BANNER_CONFIGS.map((cfg) => {
                const bData = banners[cfg.key] || {}
                if (bData.active === false) return null
                const title = bData.title || cfg.defaultTitle
                const desc = bData.description || cfg.defaultDesc
                const bg = bData.imageUrl
                const prodIds: string[] = bData.productIds || []
                const bannerProducts = prodIds.map((id: string) => allProductsMap[id]).filter(Boolean)

                return (
                    <HeroBanner
                        key={cfg.key}
                        title={title}
                        description={desc}
                        backgroundImage={bg}
                        gradientClass={cfg.defaultBg}
                        accent={cfg.accent}
                        accentDark={cfg.accentDark}
                        tag={cfg.tag}
                        tagBg={cfg.tagBg}
                        icon={cfg.icon}
                        products={bannerProducts}
                        linkUrl={cfg.key === 'software' ? '/web/software' : '#productos'}
                        linkText={cfg.key === 'software' ? 'Ver Portafolio' : 'Ver Catálogo'}
                    />
                )
            })}

            {/* Newsletter */}
            <section className="bg-gradient-to-r from-indigo-900 to-pink-900 py-32 relative overflow-hidden">
                <div className="absolute right-0 top-0 h-full w-1/3 bg-white/5 -skew-x-12 translate-x-20"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 text-white">
                    <div className="max-w-xl space-y-6">
                        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none italic">Únete a la <br />Comunidad <span className="text-indigo-400">ATOMIC</span></h2>
                        <p className="text-white/60 font-medium text-lg">Suscríbete para recibir ofertas exclusivas, lanzamientos y consejos de tecnología industrial.</p>
                    </div>
                    <form className="w-full max-w-md flex flex-col sm:flex-row gap-4">
                        <input type="email" placeholder="Tu correo electrónico" className="flex-1 bg-white/10 border-2 border-white/20 px-6 py-5 text-white placeholder-white/30 focus:outline-none focus:border-indigo-400 transition-all font-bold rounded-2xl" />
                        <button className="bg-white text-indigo-900 px-10 py-5 text-[10px] font-black uppercase tracking-widest shadow-2xl hover:bg-slate-900 hover:text-white transition-all rounded-2xl">Suscribirme</button>
                    </form>
                </div>
            </section>
        </div>
    )
}

// ══════════════════════════════════════════════════════════════
//  HeroBanner — Banner hero full-width con galería de productos
// ══════════════════════════════════════════════════════════════
function HeroBanner({ title, description, backgroundImage, gradientClass, accent, accentDark, tag, tagBg, icon, products, linkUrl = "#productos", linkText = "Ver Catálogo" }: {
    title: string
    description: string
    backgroundImage?: string
    gradientClass: string
    accent: string
    accentDark: string
    tag: string
    tagBg: string
    icon: any
    products: any[]
    linkUrl?: string
    linkText?: string
}) {
    const galleryRef = useRef<HTMLDivElement>(null)

    const scrollGallery = (dir: 'left' | 'right') => {
        if (!galleryRef.current) return
        galleryRef.current.scrollBy({ left: dir === 'right' ? 260 : -260, behavior: 'smooth' })
    }

    return (
        <section className="relative w-full overflow-hidden" style={{ minHeight: '72vh' }}>
            {/* Background */}
            {backgroundImage ? (
                <>
                    <img src={backgroundImage} alt={title} className="absolute inset-0 w-full h-full object-cover" />
                    <div className={`absolute inset-0 bg-gradient-to-r ${gradientClass} opacity-85`}></div>
                </>
            ) : (
                <div className={`absolute inset-0 bg-gradient-to-r ${gradientClass}`}></div>
            )}

            {/* Decorative patterns */}
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>

            {/* Accent line */}
            <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: accent }}></div>

            {/* Content */}
            <div className="relative z-10 w-full h-full flex flex-col justify-between" style={{ minHeight: '72vh' }}>
                {/* Top: tag */}
                <div className="px-12 pt-12">
                    <div className={`inline-flex items-center gap-2 ${tagBg} text-white text-[10px] font-black uppercase tracking-[0.3em] px-4 py-2`}>
                        {icon}
                        <span>{tag}</span>
                    </div>
                </div>

                {/* Center: main copy */}
                <div className="px-12 md:px-20 flex-1 flex flex-col justify-center py-8" style={{ maxWidth: '65%' }}>
                    <h2 className="text-5xl md:text-7xl xl:text-8xl font-black text-white tracking-tighter leading-[0.88] mb-6 uppercase" style={{ textShadow: '0 4px 30px rgba(0,0,0,0.5)' }}>
                        {title}
                    </h2>
                    <p className="text-white/70 text-base md:text-lg font-medium max-w-lg leading-relaxed mb-8">
                        {description}
                    </p>
                    <div className="flex items-center gap-4">
                        <a
                            href={linkUrl || "#productos"}
                            className="relative z-50 inline-flex items-center gap-3 text-white text-[11px] font-black uppercase tracking-widest px-8 py-4 transition-all hover:gap-5"
                            style={{ backgroundColor: accent }}
                        >
                            {linkText || "Ver Catálogo"} <ArrowRight size={14} />
                        </a>
                        <a href="#categorias" className="relative z-50 text-white/50 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">
                            Ver Categorías →
                        </a>
                    </div>
                </div>

                {/* Bottom-right: product gallery scroll */}
                {products.length > 0 && (
                    <div className="absolute bottom-0 right-0 w-full md:w-[55%] pb-6 pr-6">
                        <div className="flex items-center justify-between mb-3 px-2">
                            <span className="text-white/40 text-[9px] font-black uppercase tracking-[0.3em]">Productos Destacados</span>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => scrollGallery('left')}
                                    className="w-7 h-7 border border-white/20 flex items-center justify-center text-white/40 hover:text-white hover:border-white/60 transition-all"
                                >
                                    <ChevronLeft size={12} />
                                </button>
                                <button
                                    onClick={() => scrollGallery('right')}
                                    className="w-7 h-7 border border-white/20 flex items-center justify-center text-white/40 hover:text-white hover:border-white/60 transition-all"
                                >
                                    <ChevronRight size={12} />
                                </button>
                            </div>
                        </div>
                        <div
                            ref={galleryRef}
                            className="flex gap-3 overflow-x-auto pb-1 scroll-smooth"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            {products.map((p: any) => {
                                const imgs = safeParseArr(p.images)
                                return (
                                    <Link
                                        key={p.id}
                                        href={`/web/product/${p.id}`}
                                        className="group shrink-0 w-36 bg-white/10 backdrop-blur-md border border-white/10 hover:border-white/30 hover:bg-white/20 transition-all overflow-hidden"
                                    >
                                        <div className="h-24 overflow-hidden bg-white/5 flex items-center justify-center">
                                            {imgs.length > 0 ? (
                                                <img src={imgs[0]} alt={p.name} referrerPolicy="no-referrer" className="w-full h-full object-contain p-2 mix-blend-luminosity group-hover:mix-blend-normal group-hover:scale-110 transition-all duration-500" />
                                            ) : (
                                                <ShoppingBag size={24} className="text-white/20" />
                                            )}
                                        </div>
                                        <div className="p-2.5">
                                            <p className="text-white text-[9px] font-black uppercase tracking-wide line-clamp-2 leading-tight">{p.name}</p>
                                            <p className="text-white/70 text-[10px] font-black font-mono mt-1">${p.price?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}</p>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Divider bottom glow */}
            <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}></div>
        </section>
    )
}

// ══════════════════════════════════════════════════════════════
//  CategoriesBanner — Banner 4 con todas las categorías scrollable
// ══════════════════════════════════════════════════════════════
function CategoriesBanner({ categories }: { categories: any[] }) {
    const scrollRef = useRef<HTMLDivElement>(null)
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(true)
    const [activeIdx, setActiveIdx] = useState(0)
    const [isDragging, setIsDragging] = useState(false)
    const [dragStart, setDragStart] = useState(0)
    const [scrollStart, setScrollStart] = useState(0)
    const CARD_W = 216

    const checkScroll = () => {
        if (!scrollRef.current) return
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
        setCanScrollLeft(scrollLeft > 10)
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
        setActiveIdx(Math.round(scrollLeft / CARD_W))
    }

    useEffect(() => {
        const el = scrollRef.current
        if (!el) return
        el.addEventListener('scroll', checkScroll, { passive: true })
        checkScroll()
        return () => el.removeEventListener('scroll', checkScroll)
    }, [categories])

    const scroll = (dir: 'left' | 'right') => {
        scrollRef.current?.scrollBy({ left: dir === 'right' ? CARD_W * 2 : -CARD_W * 2, behavior: 'smooth' })
    }
    const goToIdx = (i: number) => {
        scrollRef.current?.scrollTo({ left: i * CARD_W, behavior: 'smooth' })
    }

    // Drag-to-scroll
    const onMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true)
        setDragStart(e.clientX)
        setScrollStart(scrollRef.current?.scrollLeft || 0)
    }
    const onMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !scrollRef.current) return
        scrollRef.current.scrollLeft = scrollStart + (dragStart - e.clientX)
    }
    const onMouseUp = () => setIsDragging(false)

    if (categories.length === 0) return null
    const visible = categories.filter((c: any) => c.isVisible !== false)

    return (
        <section id="categorias" className="w-full bg-slate-950 relative overflow-hidden">
            {/* Diagonal grid texture */}
            <div
                className="absolute inset-0 opacity-[0.025]"
                style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)', backgroundSize: '14px 14px' }}
            ></div>

            {/* Top divider glow */}
            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>

            <div className="relative z-10 py-20 pb-12">
                {/* Header row */}
                <div className="max-w-7xl mx-auto px-6 mb-12 flex items-end justify-between">
                    <div className="space-y-1">
                        <p className="text-indigo-500 text-[9px] font-black uppercase tracking-[0.4em]">Explorar por sección</p>
                        <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">
                            Todas las <span className="text-indigo-400 italic">Categorías</span>
                        </h2>
                        <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest pt-2">
                            {visible.length} sección{visible.length !== 1 ? 'es' : ''} disponible{visible.length !== 1 ? 's' : ''} — ingeniería modular
                        </p>
                    </div>
                    <div className="flex items-center gap-2 pb-1">
                        <button
                            onClick={() => scroll('left')}
                            disabled={!canScrollLeft}
                            className="w-12 h-12 border border-white/10 flex items-center justify-center text-white/30 hover:text-white hover:border-indigo-500 hover:bg-indigo-500/10 transition-all disabled:opacity-10 rounded-xl"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            disabled={!canScrollRight}
                            className="w-12 h-12 border border-white/10 flex items-center justify-center text-white/30 hover:text-white hover:border-indigo-500 hover:bg-indigo-500/10 transition-all disabled:opacity-10 rounded-xl"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>

                {/* Cards track */}
                <div className="relative">
                    <div
                        ref={scrollRef}
                        onScroll={checkScroll}
                        onMouseDown={onMouseDown}
                        onMouseMove={onMouseMove}
                        onMouseUp={onMouseUp}
                        onMouseLeave={onMouseUp}
                        className="flex gap-4 overflow-x-auto pl-6 pr-6 pb-6 hide-scrollbar"
                        style={{
                            cursor: isDragging ? 'grabbing' : 'grab',
                            userSelect: 'none',
                        }}
                    >
                        {visible.map((cat: any, i: number) => (
                            <a
                                key={cat.id}
                                href="#productos"
                                draggable={false}
                                className="group shrink-0 relative overflow-hidden transition-all duration-500 hover:-translate-y-2 rounded-3xl"
                                style={{
                                    width: `${CARD_W}px`,
                                    minWidth: `${CARD_W}px`,
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
                                }}
                            >
                                {/* Category image */}
                                <div className="h-48 overflow-hidden bg-slate-900 relative">
                                    {cat.image ? (
                                        <img
                                            src={cat.image}
                                            alt={cat.name}
                                            draggable={false}
                                            className="w-full h-full object-cover opacity-40 group-hover:opacity-80 group-hover:scale-110 transition-all duration-1000 ease-out"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-7xl font-black uppercase select-none opacity-5">
                                                {cat.name[0]}
                                            </span>
                                        </div>
                                    )}
                                    {/* Scrim */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                                    {/* Accent line on hover */}
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                                </div>

                                {/* Info */}
                                <div className="p-5 bg-slate-900/90 backdrop-blur-md">
                                    <h3 className="text-white text-xs font-black uppercase tracking-[0.1em] line-clamp-1 group-hover:text-indigo-400 transition-colors">
                                        {cat.name}
                                    </h3>
                                    <p className="text-white/30 text-[9px] font-bold mt-1 uppercase tracking-widest italic">Explorar →</p>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>

                {/* Progress bar info */}
                <div className="flex justify-center items-center gap-1.5 mt-8">
                    {visible.slice(0, Math.min(visible.length, 12)).map((_: any, i: number) => (
                        <div
                            key={i}
                            className="transition-all duration-500"
                            style={{
                                height: '2px',
                                width: activeIdx === i ? '32px' : '4px',
                                backgroundColor: activeIdx === i ? '#6366f1' : 'rgba(255,255,255,0.1)',
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Bottom line */}
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent"></div>
        </section>
    )
}
