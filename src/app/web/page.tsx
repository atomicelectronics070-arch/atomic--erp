"use client"

import { useState, useEffect, useRef } from "react"
import { ShoppingBag, ChevronRight, Star, ArrowRight, Shield, Zap, Truck, Search, Download, X, ChevronLeft, Monitor, Cpu, Gamepad2, Home } from "lucide-react"
import Link from "next/link"
import { Starfield } from "@/components/ui/Starfield"

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
            <div className="min-h-screen flex items-center justify-center bg-[#020617]">
                <Starfield />
                <div className="animate-spin rounded-none h-12 w-12 border-4 border-[#E8341A] border-t-transparent shadow-lg shadow-red-100"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-transparent text-white font-sans relative">
            <Starfield />
            
            {/* 1. SECCIÓN SUPERIOR: CATEGORÍAS */}
            <CategoriesBanner categories={metadata.categories} />

            {/* 2. SECCIÓN MEDIA: PRODUCTOS DESTACADOS (16x4 GRID SCROLLABLE) */}
            <section className="bg-[#0F1923]/40 backdrop-blur-md py-32 border-b border-[#E8341A]/20 overflow-hidden">
                <div className="max-w-[95%] mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <div className="space-y-4">
                            <p className="text-[#E8341A] text-[10px] font-black uppercase tracking-[0.3em]">Selección Premium</p>
                            <h2 className="text-5xl font-light text-white uppercase tracking-tighter">
                                Productos <span className="font-black italic text-[#E8341A]">Destacados</span>
                            </h2>
                        </div>
                        <div className="flex gap-2">
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Scroll Horizontal Habilitado →</p>
                        </div>
                    </div>

                    <div className="w-full overflow-x-auto hide-scrollbar cursor-grab active:cursor-grabbing">
                        <div className="grid grid-flow-col grid-rows-4 gap-4 w-max">
                            {featuredProducts.length > 0 ? featuredProducts.map((p: any) => (
                                <Link
                                    key={p.id}
                                    href={`/web/product/${p.id}`}
                                    className="group flex flex-row w-[400px] h-[100px] border border-white/5 bg-[#0F1923]/60 backdrop-blur-sm transition-all hover:bg-[#1E3A5F]/40 hover:border-[#E8341A]/50 overflow-hidden shadow-xl"
                                >
                                    <div className="w-[100px] h-full shrink-0 bg-white p-2">
                                        {(() => {
                                            const imgs = safeParseArr(p.images)
                                            return imgs.length > 0 ? (
                                                <img src={imgs[0]} alt={p.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
                                            ) : null
                                        })()}
                                    </div>
                                    <div className="p-4 flex-1 flex flex-col justify-center bg-transparent transition-colors">
                                        <h3 className="text-[10px] font-black uppercase text-white/90 tracking-widest line-clamp-2 mb-2 leading-tight group-hover:text-[#E8341A] transition-colors">{p.name}</h3>
                                        <p className="font-mono font-black text-white/80">${p.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                                    </div>
                                </Link>
                            )) : (
                                <div className="col-span-full py-12 text-center border-2 border-dashed border-white/10 w-full min-w-[100vw]">
                                    <p className="font-black text-white/20 uppercase tracking-widest text-[10px]">No hay productos destacados configurados</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Bar */}
            <section className="bg-[#0F1923] py-12">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
                    {[
                        { icon: <Truck />, title: "Envíos Gratis", desc: "Todo el país", color: '#E8341A' },
                        { icon: <Shield />, title: "Garantía Total", desc: "Cobertura ATOMIC", color: '#2563EB' },
                        { icon: <Zap />, title: "Pago Seguro", desc: "Confianza total", color: '#E8341A' },
                        { icon: <Star />, title: "Soporte 24/7", desc: "Asistencia real", color: '#2563EB' }
                    ].map((f, i) => (
                        <div key={i} className="flex items-center space-x-5 text-white/90">
                            <div style={{ color: f.color }}>{f.icon}</div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest">{f.title}</p>
                                <p className="text-xs text-white/40">{f.desc}</p>
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
        <section className="relative w-full overflow-hidden border-b border-white/10" style={{ minHeight: '65vh' }}>
            {/* Background */}
            {collection.image ? (
                <>
                    <img src={collection.image} alt={collection.name} className="absolute inset-0 w-full h-full object-cover" />
                    <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-85`}></div>
                </>
            ) : (
                <div className={`absolute inset-0 bg-gradient-to-r ${gradient}`}></div>
            )}

            {/* Accent line */}
            <div className={`absolute ${reverse ? 'right-0' : 'left-0'} top-0 bottom-0 w-1.5`} style={{ backgroundColor: accent }}></div>

            {/* Content */}
            <div className="relative z-10 w-full h-full flex flex-col justify-between py-16" style={{ minHeight: '65vh' }}>
                <div className={`px-12 md:px-20 flex-1 flex flex-col justify-center ${reverse ? 'items-end text-right' : 'items-start text-left'}`}>
                    <div className={`inline-flex items-center gap-2 bg-white/10 text-white text-[9px] font-black uppercase tracking-[0.4em] px-4 py-2 mb-8 backdrop-blur-sm`}>
                        ÁREA DE ESPECIALIZACIÓN
                    </div>
                    
                    <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.9] mb-8 uppercase" style={{ textShadow: '0 4px 30px rgba(0,0,0,0.5)' }}>
                        {collection.name}
                    </h2>
                    
                    <p className="text-white/70 text-sm md:text-base font-medium max-w-xl leading-relaxed mb-10 line-clamp-3">
                        {collection.description || `Explora nuestras soluciones y equipos especializados en ${collection.name}.`}
                    </p>
                    
                    <Link
                        href={`/web/collection/${collection.slug}`}
                        className="relative z-50 inline-flex items-center gap-3 text-white text-[11px] font-black uppercase tracking-widest px-10 py-5 transition-all hover:gap-5 shadow-2xl"
                        style={{ backgroundColor: accent }}
                    >
                        Ingresar al Área <ArrowRight size={14} />
                    </Link>
                </div>

                {/* Bottom product gallery scroll */}
                {products.length > 0 && (
                    <div className={`absolute bottom-0 ${reverse ? 'left-0 pl-6' : 'right-0 pr-6'} w-full md:w-[60%] pb-8`}>
                        <div className={`flex items-center ${reverse ? 'justify-end flex-row-reverse' : 'justify-between'} mb-4 px-4 gap-4`}>
                            <span className="text-white/50 text-[9px] font-black uppercase tracking-[0.4em]">Equipamiento Sugerido</span>
                            <div className="flex gap-1">
                                <button onClick={() => scrollGallery('left')} className="w-8 h-8 border border-white/20 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all rounded-none">
                                    <ChevronLeft size={14} />
                                </button>
                                <button onClick={() => scrollGallery('right')} className="w-8 h-8 border border-white/20 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all rounded-none">
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
                                        className="group shrink-0 w-48 bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all overflow-hidden shadow-2xl rounded-none"
                                    >
                                        <div className="h-32 overflow-hidden bg-black/20 flex items-center justify-center p-4">
                                            {imgs.length > 0 ? (
                                                <img src={imgs[0]} alt={p.name} referrerPolicy="no-referrer" className="w-full h-full object-contain mix-blend-screen group-hover:scale-110 transition-transform duration-700" />
                                            ) : (
                                                <ShoppingBag size={24} className="text-white/20" />
                                            )}
                                        </div>
                                        <div className="p-4 border-t border-white/5">
                                            <p className="text-white text-[9px] font-black uppercase tracking-widest line-clamp-2 leading-tight">{p.name}</p>
                                            <p className="text-white/80 text-[11px] font-black font-mono mt-2" style={{ color: accent }}>${p.price?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}</p>
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
        <section id="categorias" className="w-full bg-[#0F1923] relative overflow-hidden py-24">
            {/* Diagonal grid texture */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }}
            ></div>

            <div className="relative z-10">
                {/* Header row */}
                <div className="max-w-[95%] mx-auto px-6 mb-12 flex flex-col md:flex-row items-end justify-between gap-6">
                    <div className="space-y-2">
                        <p className="text-[#E8341A] text-[10px] font-black uppercase tracking-[0.4em]">Explorar por sección</p>
                        <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">
                            Categorías <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50 italic">Industriales</span>
                        </h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => scroll('left')} className="w-12 h-12 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-[#E8341A] hover:bg-[#E8341A] transition-all rounded-none">
                            <ChevronLeft size={16} />
                        </button>
                        <button onClick={() => scroll('right')} className="w-12 h-12 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-[#E8341A] hover:bg-[#E8341A] transition-all rounded-none">
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
                            className="group shrink-0 relative overflow-hidden transition-all duration-500 hover:-translate-y-2 rounded-none bg-white/5 border border-white/10 w-72"
                            style={{ boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}
                        >
                            {/* Category image */}
                            <div className="h-56 overflow-hidden bg-black relative flex items-center justify-center">
                                {cat.image ? (
                                    <img
                                        src={cat.image}
                                        alt={cat.name}
                                        draggable={false}
                                        className="w-full h-full object-cover opacity-50 group-hover:opacity-80 group-hover:scale-110 transition-all duration-1000 ease-out"
                                    />
                                ) : (
                                    <span className="text-8xl font-black uppercase select-none opacity-5 text-white">
                                        {cat.name[0]}
                                    </span>
                                )}
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0F1923] via-[#0F1923]/40 to-transparent"></div>
                                {/* Accent line on hover */}
                                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-[#E8341A] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                            </div>

                            {/* Info */}
                            <div className="absolute bottom-0 left-0 p-6 w-full">
                                <h3 className="text-white text-sm font-black uppercase tracking-[0.1em] line-clamp-2 group-hover:text-[#E8341A] transition-colors leading-tight mb-2" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
                                    {cat.name}
                                </h3>
                                <p className="text-white/50 text-[9px] font-black mt-1 uppercase tracking-widest italic flex items-center gap-2">
                                    Ver Inventario <ArrowRight size={10} className="group-hover:translate-x-2 transition-transform" />
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#E8341A]/30 to-transparent"></div>
        </section>
    )
}
