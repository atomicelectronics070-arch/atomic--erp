"use client"

import { useState, useEffect, useRef } from "react"
import { ShoppingBag, ChevronRight, Star, ArrowRight, Shield, Zap, Truck, Search, Download, X, ChevronLeft, Monitor, Cpu, Gamepad2, Home } from "lucide-react"
import Link from "next/link"
// Galaxy background is now mounted globally in /web/layout.tsx

const safeParseArr = (str: any) => {
    try { const p = JSON.parse(str); return Array.isArray(p) ? p : [] } catch { return [] }
}

export default function PublicWebPage() {
    const [products, setProducts] = useState<any[]>([])
    const [metadata, setMetadata] = useState<any>({ categories: [], collections: [] })
    const [loading, setLoading] = useState(true)

    // Load metadata + products
    useEffect(() => {
        const init = async () => {
            const [mRes, pRes] = await Promise.all([
                fetch("/api/web/metadata").then(r => r.json()).catch(() => ({ categories: [], collections: [] })),
                fetch("/api/web/products?page=1&pageSize=500&search=").then(r => r.json()).catch(() => ({ products: [] }))
            ])
            setMetadata(mRes)
            setProducts(pRes.products || [])
            setLoading(false)
        }
        init()
    }, [])

    const featuredProducts = products.filter(p => p.featured)

    // Reorder collections to match user requirement: Tecnología Residencial, Desarrollo, Gaming, Automatización
    const orderedCollections = []
    const desiredOrder = ["tecnologia-residencial", "desarrollo", "gaming", "automatizacion"]
    for (const slug of desiredOrder) {
        const found = metadata.collections.find((c: any) => c.slug === slug)
        if (found) orderedCollections.push(found)
    }
    // Append any others not in the list
    for (const c of metadata.collections) {
        if (!desiredOrder.includes(c.slug)) orderedCollections.push(c)
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" data-testid="web-loading">
                <div className="animate-spin rounded-none h-12 w-12 border-4 border-[#0F0F0F] border-t-transparent"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen text-[#0F0F0F] font-sans relative" style={{ background: "transparent" }} data-testid="public-web-page">
            {/* 1. SECCIÓN SUPERIOR: CATEGORÍAS */}
            <div className="bg-transparent atomic-reveal">
                <CategoriesBanner categories={metadata.categories} />
            </div>

            {/* 2. SECCIÓN MEDIA: PRODUCTOS DESTACADOS (16x4 GRID SCROLLABLE) */}
            <section className="bg-transparent py-32 overflow-hidden atomic-reveal atomic-reveal-delay-1">
                <div className="max-w-[95%] mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <div className="space-y-4">
                            <p className="text-[#14110F]/55 text-[10px] font-black uppercase tracking-[0.42em]">Selección Premium</p>
                            <h2 className="atomic-display text-5xl md:text-6xl font-light text-[#14110F] uppercase">
                                Productos <span className="font-black italic">Destacados</span>
                            </h2>
                        </div>
                        <div className="flex gap-2">
                            <p className="text-[10px] font-black uppercase tracking-[0.32em] text-[#14110F]/40">Scroll Horizontal Habilitado →</p>
                        </div>
                    </div>

                    <div className="w-full overflow-x-auto hide-scrollbar cursor-grab active:cursor-grabbing">
                        <div className="grid grid-flow-col grid-rows-4 gap-4 w-max">
                            {featuredProducts.length > 0 ? featuredProducts.map((p: any) => (
                                <Link
                                    key={p.id}
                                    href={`/web/product/${p.id}`}
                                    className="group flex flex-row w-[400px] h-[100px] atomic-card overflow-hidden"
                                >
                                    <div className="w-[100px] h-full shrink-0 bg-white/70 border-r border-white p-2 group-hover:border-black/10 transition-colors">
                                        {(() => {
                                            const imgs = safeParseArr(p.images)
                                            return imgs.length > 0 ? (
                                                <img src={imgs[0]} alt={p.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
                                            ) : null
                                        })()}
                                    </div>
                                    <div className="p-4 flex-1 flex flex-col justify-center bg-transparent transition-colors">
                                        <h3 className="text-[10px] font-black uppercase text-[#0F0F0F] tracking-widest line-clamp-2 mb-2 leading-tight group-hover:text-black transition-colors">{p.name}</h3>
                                        <p className="font-mono font-black text-[#0F0F0F]/80">${p.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                                    </div>
                                </Link>
                            )) : (
                                <div className="col-span-full py-12 text-center border border-dashed border-[#0F0F0F]/20 w-full min-w-[100vw]">
                                    <p className="font-black text-[#0F0F0F]/40 uppercase tracking-widest text-[10px]">No hay productos destacados configurados</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Bar */}
            <section className="atomic-bar py-14 atomic-reveal atomic-reveal-delay-2" data-testid="features-bar">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
                    {[
                        { icon: <Truck strokeWidth={1.5} />, title: "Envíos Gratis", desc: "Todo el país" },
                        { icon: <Shield strokeWidth={1.5} />, title: "Garantía Total", desc: "Cobertura ATOMIC" },
                        { icon: <Zap strokeWidth={1.5} />, title: "Pago Seguro", desc: "Confianza total" },
                        { icon: <Star strokeWidth={1.5} />, title: "Soporte 24/7", desc: "Asistencia real" }
                    ].map((f, i) => (
                        <div key={i} className="flex items-center space-x-5 text-[#14110F]">
                            <div className="text-[#14110F] opacity-80">{f.icon}</div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.28em]">{f.title}</p>
                                <p className="text-xs text-[#14110F]/55 mt-0.5">{f.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 3. SECCIÓN INFERIOR: ÁREAS DE ESPECIALIZACIÓN */}
            {orderedCollections.map((col: any, idx: number) => {
                const bProducts = products.filter(p => p.collectionId === col.id).slice(0, 10)
                const isOdd = idx % 2 !== 0
                return (
                    <CollectionBanner
                        key={col.id}
                        collection={col}
                        products={bProducts}
                        reverse={isOdd}
                    />
                )
            })}

        </div>
    )
}

// ══════════════════════════════════════════════════════════════
//  CollectionBanner — Banners for Specialization Areas
// ══════════════════════════════════════════════════════════════
function CollectionBanner({ collection, products, reverse }: { collection: any, products: any[], reverse: boolean }) {
    const galleryRef = useRef<HTMLDivElement>(null)

    const scrollGallery = (dir: 'left' | 'right') => {
        if (!galleryRef.current) return
        galleryRef.current.scrollBy({ left: dir === 'right' ? 260 : -260, behavior: 'smooth' })
    }

    // Default gradients based on slug if image is missing or just to overlay
    let gradient = "from-[#0F1923] via-[#1E3A5F] to-[#0F1923]"
    let accent = "#2563EB"
    if (collection.slug.includes('gaming')) {
        gradient = "from-[#0F1923] via-[#5A1A0A] to-[#0F1923]"
        accent = "#F5611A"
    } else if (collection.slug.includes('automatizacion')) {
        gradient = "from-[#0F1923] via-[#3D0A03] to-[#0F1923]"
        accent = "#E8341A"
    } else if (collection.slug.includes('residencial')) {
        gradient = "from-[#0F1923] via-[#0F3D23] to-[#0F1923]"
        accent = "#10B981"
    }

    return (
        <section className="relative w-full overflow-hidden border-t border-white/70 atomic-reveal" style={{ minHeight: '65vh' }} data-testid={`collection-banner-${collection.slug}`}>
            {/* Background — kept very faint to let the metaballs breathe through */}
            {collection.image && (
                <img src={collection.image} alt={collection.name} className="absolute inset-0 w-full h-full object-cover opacity-[0.07]" />
            )}

            {/* Accent line */}
            <div className={`absolute ${reverse ? 'right-0' : 'left-0'} top-0 bottom-0 w-[2px] bg-[#0F0F0F]/30`}></div>

            {/* Content */}
            <div className="relative z-10 w-full h-full flex flex-col justify-between py-16" style={{ minHeight: '65vh' }}>
                <div className={`px-12 md:px-20 flex-1 flex flex-col justify-center ${reverse ? 'items-end text-right' : 'items-start text-left'}`}>
                    <div className="inline-flex items-center gap-2 atomic-card text-[#0F0F0F] text-[9px] font-black uppercase tracking-[0.4em] px-4 py-2 mb-8">
                        ÁREA DE ESPECIALIZACIÓN
                    </div>

                    <h2 className="atomic-display text-5xl md:text-7xl font-black text-[#14110F] mb-8 uppercase">
                        {collection.name}
                    </h2>

                    <p className="text-[#14110F]/65 text-sm md:text-base font-medium max-w-xl leading-relaxed mb-10 line-clamp-3">
                        {collection.description || `Explora nuestras soluciones y equipos especializados en ${collection.name}.`}
                    </p>

                    <Link
                        href={`/web/collection/${collection.slug}`}
                        className="relative z-50 inline-flex items-center gap-3 bg-[#14110F] text-white border border-white text-[11px] font-black uppercase tracking-[0.28em] px-10 py-5 transition-all duration-500 hover:gap-5 hover:bg-white hover:text-[#14110F] hover:border-[#14110F]/30 hover:shadow-[0_18px_40px_-18px_rgba(20,17,15,0.4)]"
                    >
                        Ingresar al Área <ArrowRight size={14} />
                    </Link>
                </div>

                {/* Bottom product gallery scroll */}
                {products.length > 0 && (
                    <div className={`absolute bottom-0 ${reverse ? 'left-0 pl-6' : 'right-0 pr-6'} w-full md:w-[60%] pb-8`}>
                        <div className={`flex items-center ${reverse ? 'justify-end flex-row-reverse' : 'justify-between'} mb-4 px-4 gap-4`}>
                            <span className="text-[#0F0F0F]/55 text-[9px] font-black uppercase tracking-[0.4em]">Equipamiento Sugerido</span>
                            <div className="flex gap-1">
                                <button onClick={() => scrollGallery('left')} className="w-8 h-8 border border-white bg-white/60 backdrop-blur-md flex items-center justify-center text-[#0F0F0F]/55 hover:text-[#0F0F0F] hover:border-black/20 transition-all rounded-none">
                                    <ChevronLeft size={14} />
                                </button>
                                <button onClick={() => scrollGallery('right')} className="w-8 h-8 border border-white bg-white/60 backdrop-blur-md flex items-center justify-center text-[#0F0F0F]/55 hover:text-[#0F0F0F] hover:border-black/20 transition-all rounded-none">
                                    <ChevronRight size={14} />
                                </button>
                            </div>
                        </div>
                        <div
                            ref={galleryRef}
                            className={`flex gap-4 overflow-x-auto pb-2 scroll-smooth px-4 hide-scrollbar ${reverse ? 'flex-row-reverse' : ''}`}
                        >
                            {products.map((p: any) => {
                                const imgs = safeParseArr(p.images)
                                return (
                                    <Link
                                        key={p.id}
                                        href={`/web/product/${p.id}`}
                                        className="group shrink-0 w-48 atomic-card overflow-hidden rounded-none"
                                    >
                                        <div className="h-32 overflow-hidden bg-white/40 flex items-center justify-center p-4 border-b border-white group-hover:border-black/10 transition-colors">
                                            {imgs.length > 0 ? (
                                                <img src={imgs[0]} alt={p.name} referrerPolicy="no-referrer" className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700" />
                                            ) : (
                                                <ShoppingBag size={24} className="text-[#0F0F0F]/30" />
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <p className="text-[#0F0F0F] text-[9px] font-black uppercase tracking-widest line-clamp-2 leading-tight">{p.name}</p>
                                            <p className="text-[#0F0F0F] text-[11px] font-black font-mono mt-2">${p.price?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}</p>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}

// ══════════════════════════════════════════════════════════════
//  CategoriesBanner — Categorías con Scroll Horizontal (Top Section)
// ══════════════════════════════════════════════════════════════
function CategoriesBanner({ categories }: { categories: any[] }) {
    const scrollRef = useRef<HTMLDivElement>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [startX, setStartX] = useState(0)
    const [scrollLeft, setScrollLeft] = useState(0)

    const scroll = (dir: 'left' | 'right') => {
        scrollRef.current?.scrollBy({ left: dir === 'right' ? 300 : -300, behavior: 'smooth' })
    }

    const onMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true)
        setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0))
        setScrollLeft(scrollRef.current?.scrollLeft || 0)
    }

    const onMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return
        e.preventDefault()
        const x = e.pageX - (scrollRef.current?.offsetLeft || 0)
        const walk = (x - startX) * 2 // Scroll-fast
        if (scrollRef.current) scrollRef.current.scrollLeft = scrollLeft - walk
    }

    if (categories.length === 0) return null
    const visible = categories.filter((c: any) => c.isVisible !== false)

    return (
        <section id="categorias" className="w-full bg-transparent relative overflow-hidden py-24" data-testid="categories-banner">
            <div className="relative z-10">
                {/* Header row */}
                <div className="max-w-[95%] mx-auto px-6 mb-12 flex flex-col md:flex-row items-end justify-between gap-6">
                    <div className="space-y-2">
                        <p className="text-[#14110F]/55 text-[10px] font-black uppercase tracking-[0.42em]">Explorar por sección</p>
                        <h2 className="atomic-display text-4xl md:text-6xl font-black text-[#14110F] uppercase">
                            Categorías <span className="italic font-light">Industriales</span>
                        </h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => scroll('left')} className="w-12 h-12 border border-white bg-white/60 backdrop-blur-md flex items-center justify-center text-[#0F0F0F]/55 hover:text-[#0F0F0F] hover:border-black/20 transition-all rounded-none">
                            <ChevronLeft size={16} />
                        </button>
                        <button onClick={() => scroll('right')} className="w-12 h-12 border border-white bg-white/60 backdrop-blur-md flex items-center justify-center text-[#0F0F0F]/55 hover:text-[#0F0F0F] hover:border-black/20 transition-all rounded-none">
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>

                {/* Cards track (Mouse drag enabled) */}
                <div
                    ref={scrollRef}
                    onMouseDown={onMouseDown}
                    onMouseLeave={() => setIsDragging(false)}
                    onMouseUp={() => setIsDragging(false)}
                    onMouseMove={onMouseMove}
                    className="flex gap-6 overflow-x-auto px-6 hide-scrollbar cursor-grab active:cursor-grabbing pb-8"
                >
                    {visible.map((cat: any) => (
                        <Link
                            key={cat.id}
                            href={`/web/category/${cat.slug}`}
                            draggable={false}
                            className="group shrink-0 relative overflow-hidden transition-all duration-500 hover:-translate-y-1 rounded-none atomic-card w-72"
                        >
                            {/* Category image */}
                            <div className="h-56 overflow-hidden bg-white/40 relative flex items-center justify-center border-b border-white group-hover:border-black/10 transition-colors">
                                {cat.image ? (
                                    <img
                                        src={cat.image}
                                        alt={cat.name}
                                        draggable={false}
                                        className="w-full h-full object-cover opacity-60 group-hover:opacity-90 group-hover:scale-110 transition-all duration-1000 ease-out mix-blend-multiply"
                                    />
                                ) : (
                                    <span className="text-8xl font-black uppercase select-none opacity-10 text-[#0F0F0F]">
                                        {cat.name[0]}
                                    </span>
                                )}
                                {/* Soft fade so caption is readable */}
                                <div className="absolute inset-0 bg-gradient-to-t from-white/70 via-transparent to-transparent"></div>
                                {/* Accent line on hover */}
                                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0F0F0F] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                            </div>

                            {/* Info */}
                            <div className="absolute bottom-0 left-0 p-6 w-full">
                                <h3 className="text-[#0F0F0F] text-sm font-black uppercase tracking-[0.1em] line-clamp-2 group-hover:text-black transition-colors leading-tight mb-2">
                                    {cat.name}
                                </h3>
                                <p className="text-[#0F0F0F]/55 text-[9px] font-black mt-1 uppercase tracking-widest italic flex items-center gap-2">
                                    Ver Inventario <ArrowRight size={10} className="group-hover:translate-x-2 transition-transform" />
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
