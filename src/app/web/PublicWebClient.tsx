"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { ShoppingBag, ChevronRight, ArrowRight, Shield, Zap, Truck, ChevronLeft, Hexagon, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { calculateDiscountedPrice } from "@/lib/utils/pricing"

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

interface PublicWebClientProps {
    initialProducts: any[]
    metadata: { categories: any[], collections: any[] }
    userRole?: string
}

export default function PublicWebClient({ initialProducts, metadata, userRole }: PublicWebClientProps) {
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        const handleSearchUpdate = (e: any) => {
            setSearchQuery(e.detail)
            document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' })
        }
        window.addEventListener('atomic-search-update', handleSearchUpdate)
        return () => window.removeEventListener('atomic-search-update', handleSearchUpdate)
    }, [])

    const filteredProducts = initialProducts.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const featuredProducts = filteredProducts.filter(p => {
        const text = `${p.name} ${p.description || ''} ${p.category?.name || ''}`.toLowerCase();
        return p.featured ||
               text.includes('power bank') || text.includes('powerbank') ||
               text.includes('banco de poder') ||
               text.includes('espia') || text.includes('espía') ||
               text.includes('oculta');
    })

    const desiredOrder = ["tecnologia-residencial", "desarrollo", "gaming", "automatizacion"]
    // Deduplicate collections by slug before rendering
    const seenSlugs = new Set<string>()
    const orderedCollections = desiredOrder
        .map(slug => metadata.collections.find(c => c.slug === slug))
        .filter(Boolean)
        .concat(metadata.collections.filter(c => !desiredOrder.includes(c.slug)))
        .filter((c: any) => {
            if (seenSlugs.has(c.slug)) return false;
            seenSlugs.add(c.slug);
            return true;
        })

    return (
        <div className="min-h-screen bg-[#0F172A] text-slate-200 selection:bg-[#E8341A]/20 pb-20" style={{ fontFamily: "'IBM Plex Sans', ui-sans-serif, system-ui" }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>

                {/* 1. CATEGORÍAS */}
                <CategoriesBanner categories={metadata.categories} />

                {/* 2. PRODUCTOS DESTACADOS — compact 2-row grid */}
                <section className="py-12" id="destacados">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="mb-6 flex items-end justify-between">
                            <div>
                                <h2 className="text-xl font-semibold text-white uppercase tracking-widest">
                                    PRODUCTOS <span className="font-bold text-[#E8341A]">DESTACADOS</span>
                                </h2>
                                <p className="text-slate-500 text-[10px] mt-1 uppercase tracking-[0.3em] font-medium">Selección Premium</p>
                            </div>
                            <Link href="/web/products" className="text-[10px] font-semibold text-slate-400 hover:text-[#E8341A] transition-colors flex items-center gap-1 uppercase tracking-widest">
                                Ver todos <ArrowRight size={12} />
                            </Link>
                        </div>
                        {/* Compact grid: 8 cols on xl, max 2 rows = 16 items */}
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                            {featuredProducts.slice(0, 16).map((p: any, i: number) => (
                                <MiniProductCard key={p.id} product={p} userRole={userRole} delay={i * 0.03} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* 3. NUESTROS PRODUCTOS — infinite horizontal scroll */}
                <section className="py-12 border-t border-slate-800/50" id="productos">
                    <div className="max-w-7xl mx-auto px-6 mb-6 flex items-end justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-white uppercase tracking-widest">
                                NUESTROS <span className="font-bold text-[#E8341A]">PRODUCTOS</span>
                            </h2>
                            <p className="text-slate-500 text-[10px] mt-1 uppercase tracking-[0.3em] font-medium">Catálogo General</p>
                        </div>
                    </div>
                    <InfiniteProductScroll products={filteredProducts} userRole={userRole} />
                </section>

                {/* 4. BANNER ACADEMY */}
                <section className="py-16 border-y border-slate-800/50 bg-[#1e293b]/30">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="flex-1 p-10 md:p-14 flex flex-col justify-center"
                            >
                                <div className="flex items-center gap-2 text-blue-400 mb-4">
                                    <Zap size={13} className="animate-pulse" />
                                    <span className="text-[10px] font-semibold uppercase tracking-[0.3em]">PLATAFORMA EDUCATIVA</span>
                                </div>
                                <h2 className="text-4xl md:text-5xl font-light text-white uppercase tracking-tight mb-4">
                                    ATOMIC <span className="font-bold text-blue-500">ACADEMY</span>
                                </h2>
                                <p className="text-slate-400 text-sm leading-relaxed max-w-lg mb-8 font-normal">
                                    Certificaciones técnicas de alto nivel. Aprenda de los expertos y potencie su carrera profesional con el ecosistema Atomic.
                                </p>
                                <div className="flex gap-4">
                                    <Link href="/web/academy">
                                        <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold uppercase tracking-widest text-[10px] hover:bg-blue-500 hover:-translate-y-0.5 transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]">Acceder a Cursos</button>
                                    </Link>
                                    <button className="border border-slate-600 text-slate-300 bg-slate-800/50 px-8 py-3 rounded-lg font-semibold uppercase tracking-widest text-[10px] hover:bg-slate-700 hover:text-white transition-all">Ver Temario</button>
                                </div>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                className="w-full md:w-2/5 relative min-h-[220px] bg-gradient-to-br from-blue-900 to-slate-900 flex flex-col items-center justify-center p-10 overflow-hidden border-l border-slate-700/50"
                            >
                                <Hexagon size={80} className="text-blue-500/20 absolute scale-[3] animate-[spin_60s_linear_infinite]" strokeWidth={0.5} />
                                <div className="relative z-10 text-center">
                                    <div className="text-2xl font-bold text-white tracking-tight mb-2 italic">NUEVOS CURSOS</div>
                                    <div className="text-[10px] font-semibold text-blue-300 uppercase tracking-[0.4em] bg-blue-900/50 px-4 py-2 rounded-full border border-blue-500/30">Disponibles Ahora</div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* 5. COLECCIONES */}
                <div className="py-16 max-w-7xl mx-auto px-6 space-y-10">
                    {orderedCollections.map((col: any, idx: number) => {
                        const bProducts = filteredProducts.filter(p => p.collectionId === col.id).slice(0, 12)
                        return (
                            <CollectionBanner key={col.id} collection={col} products={bProducts} reverse={idx % 2 !== 0} userRole={userRole} />
                        )
                    })}
                </div>

                {/* 6. FEATURES BAR */}
                <section className="py-10 border-t border-slate-800/50 mt-8">
                    <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { icon: <Truck size={16} />, title: "Logística Global", desc: "Envíos rápidos", color: '#E8341A' },
                            { icon: <Shield size={16} />, title: "Seguridad", desc: "Garantía total", color: '#2563EB' },
                            { icon: <Zap size={16} />, title: "Rapidez", desc: "Pago en 1-Click", color: '#E8341A' },
                            { icon: <Star size={16} />, title: "Soporte", desc: "Asistencia VIP", color: '#2563EB' }
                        ].map((f, i) => (
                            <div key={i} className="flex items-center space-x-3">
                                <div style={{ color: f.color }} className="bg-slate-800 p-2.5 rounded-lg border border-slate-700/50 shrink-0">{f.icon}</div>
                                <div>
                                    <p className="text-[11px] font-semibold uppercase tracking-widest text-white">{f.title}</p>
                                    <p className="text-[10px] text-slate-500 font-normal mt-0.5">{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

            </motion.div>
        </div>
    )
}

/* ─── Mini compact card for Destacados ─── */
function MiniProductCard({ product: p, userRole, delay }: { product: any, userRole?: string, delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay }}
        >
            <Link
                href={`/web/product/${p.id}`}
                className="group flex flex-col bg-slate-800/50 border border-slate-700/40 hover:border-[#E8341A]/60 hover:bg-slate-800 transition-all duration-200 rounded-lg overflow-hidden"
            >
                <div className="aspect-square relative bg-white/3 flex items-center justify-center overflow-hidden">
                    {(() => {
                        const imgs = safeParseArray(p.images)
                        return imgs.length > 0 ? (
                            <Image src={imgs[0]} alt={p.name} fill className="object-contain p-2 group-hover:scale-110 transition-transform duration-300" />
                        ) : <ShoppingBag className="text-slate-700 w-5 h-5" />
                    })()}
                </div>
                <div className="p-2">
                    <p className="text-[9px] font-medium text-slate-400 tracking-wide line-clamp-2 leading-tight group-hover:text-slate-200 transition-colors mb-1">{p.name}</p>
                    <p className="text-[10px] font-bold text-white">
                        ${calculateDiscountedPrice(p.price, userRole).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                </div>
            </Link>
        </motion.div>
    );
}

/* ─── Infinite horizontal scroll for Nuestros Productos ─── */
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
            {/* Gradient fade edges */}
            <div className="absolute left-0 top-0 bottom-4 w-16 bg-gradient-to-r from-[#0F172A] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-4 w-16 bg-gradient-to-l from-[#0F172A] to-transparent z-10 pointer-events-none" />

            {/* Nav arrows */}
            <button onClick={() => scroll('left')} className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center hover:bg-slate-700 text-slate-300 shadow-lg">
                <ChevronLeft size={16} />
            </button>
            <button onClick={() => scroll('right')} className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center hover:bg-slate-700 text-slate-300 shadow-lg">
                <ChevronRight size={16} />
            </button>

            <div
                ref={trackRef}
                className="flex gap-3 overflow-x-auto hide-scrollbar pb-2 px-12 cursor-grab active:cursor-grabbing select-none"
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseUp}
            >
                {products.map((p: any) => (
                    <Link
                        key={p.id}
                        href={`/web/product/${p.id}`}
                        className="shrink-0 w-44 group bg-slate-800/50 border border-slate-700/40 hover:border-[#E8341A]/50 hover:bg-slate-800 transition-all duration-200 rounded-xl overflow-hidden"
                        draggable={false}
                    >
                        <div className="h-32 relative bg-white/3 flex items-center justify-center overflow-hidden border-b border-slate-700/30">
                            {safeParseArray(p.images).length > 0 ? (
                                <Image src={safeParseArray(p.images)[0]} alt={p.name} fill className="object-contain p-3 group-hover:scale-105 transition-transform duration-300" />
                            ) : <ShoppingBag className="text-slate-700 w-7 h-7" />}
                        </div>
                        <div className="p-3">
                            <p className="text-[10px] font-medium text-slate-400 line-clamp-2 leading-snug mb-2 group-hover:text-slate-200 transition-colors">{p.name}</p>
                            <p className="text-xs font-bold text-white">${calculateDiscountedPrice(p.price, userRole).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                        </div>
                    </Link>
                ))}
                {/* Trailing spacer */}
                <div className="shrink-0 w-8" />
            </div>
        </div>
    )
}

/* ─── Collection Banner ─── */
function CollectionBanner({ collection, products, reverse, userRole }: { collection: any, products: any[], reverse: boolean, userRole?: string }) {
    const galleryRef = useRef<HTMLDivElement>(null)
    const scrollGallery = (dir: 'left' | 'right') => {
        galleryRef.current?.scrollBy({ left: dir === 'right' ? 250 : -250, behavior: 'smooth' })
    }

    const isRed = collection.slug.includes('gaming') || collection.slug.includes('automatizacion')
    const textAccent = isRed ? "text-[#E8341A]" : "text-[#2563EB]"
    const btnHover = isRed ? "hover:bg-[#E8341A]" : "hover:bg-[#2563EB]"

    return (
        <section className="bg-slate-800/30 border border-slate-700/50 rounded-2xl overflow-hidden shadow-lg">
            <div className={`flex flex-col lg:flex-row ${reverse ? 'lg:flex-row-reverse' : ''} items-stretch`}>
                <div className="w-full lg:w-1/3 p-8 md:p-10 flex flex-col justify-center bg-slate-800/80">
                    <span className={`${textAccent} text-[9px] font-semibold uppercase tracking-[0.3em] mb-3 block`}>Colección</span>
                    <h2 className="text-2xl font-semibold text-white tracking-tight leading-tight mb-3 uppercase">{collection.name}</h2>
                    <p className="text-slate-400 text-xs leading-relaxed mb-7 line-clamp-3 font-normal">
                        {collection.description || `Equipamiento especializado para ${collection.name}. Selección exclusiva de productos de alto rendimiento.`}
                    </p>
                    <Link
                        href={`/web/collection/${collection.slug}`}
                        className={`inline-flex self-start items-center gap-2 text-white text-[10px] font-semibold uppercase tracking-widest px-5 py-2.5 rounded-lg transition-all bg-slate-700 ${btnHover} border border-slate-600/50`}
                    >
                        Ver colección <ArrowRight size={13} />
                    </Link>
                </div>

                <div className="w-full lg:w-2/3 p-5 lg:p-6 relative border-t lg:border-t-0 lg:border-l border-slate-700/50">
                    {products.length > 0 ? (
                        <>
                            <div className="absolute top-4 right-6 flex gap-2 z-10">
                                <button onClick={() => scrollGallery('left')} className="w-7 h-7 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center hover:bg-slate-700 text-slate-300"><ChevronLeft size={14} /></button>
                                <button onClick={() => scrollGallery('right')} className="w-7 h-7 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center hover:bg-slate-700 text-slate-300"><ChevronRight size={14} /></button>
                            </div>
                            <div ref={galleryRef} className="flex gap-3 overflow-x-auto pb-3 pt-8 hide-scrollbar snap-x">
                                {products.map((p: any) => (
                                    <Link key={p.id} href={`/web/product/${p.id}`} className="shrink-0 w-40 group bg-slate-800/50 border border-slate-700/40 rounded-xl hover:border-slate-500 transition-all p-2.5 snap-start">
                                        <div className="h-28 bg-white/3 flex items-center justify-center relative mb-2.5 rounded-lg overflow-hidden border border-slate-700/30">
                                            {safeParseArray(p.images).length > 0 ? (
                                                <Image src={safeParseArray(p.images)[0]} alt={p.name} fill className="object-contain p-2 group-hover:scale-110 transition-transform duration-400" />
                                            ) : <ShoppingBag className="text-slate-700 w-6 h-6" />}
                                        </div>
                                        <p className="text-slate-400 text-[9px] font-medium line-clamp-2 mb-1.5 group-hover:text-white transition-colors leading-snug">{p.name}</p>
                                        <p className="text-[11px] font-bold text-white">${calculateDiscountedPrice(p.price, userRole).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                                    </Link>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="h-full min-h-[180px] flex items-center justify-center">
                            <div className="text-center">
                                <Hexagon className="w-7 h-7 text-slate-700 mx-auto mb-2" />
                                <p className="text-slate-600 text-[10px] uppercase tracking-widest font-medium">Catálogo en actualización</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

/* ─── Categories Banner — silhouette mode for all ─── */
function CategoriesBanner({ categories }: { categories: any[] }) {
    const scrollRef = useRef<HTMLDivElement>(null)
    const scroll = (dir: 'left' | 'right') => {
        scrollRef.current?.scrollBy({ left: dir === 'right' ? 240 : -240, behavior: 'smooth' })
    }

    return (
        <section id="categorias" className="w-full py-10">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-end justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-semibold text-white uppercase tracking-widest">
                            NUESTRAS <span className="font-bold text-[#E8341A]">CATEGORÍAS</span>
                        </h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => scroll('left')} className="w-8 h-8 rounded-full border border-slate-700 bg-slate-800 text-slate-300 flex items-center justify-center hover:bg-slate-700 hover:text-white transition-colors"><ChevronLeft size={15} /></button>
                        <button onClick={() => scroll('right')} className="w-8 h-8 rounded-full border border-slate-700 bg-slate-800 text-slate-300 flex items-center justify-center hover:bg-slate-700 hover:text-white transition-colors"><ChevronRight size={15} /></button>
                    </div>
                </div>

                <div ref={scrollRef} className="flex gap-3 overflow-x-auto hide-scrollbar pb-4 snap-x">
                    {categories.filter(c => c.isVisible).map((cat: any, i: number) => (
                        <motion.div
                            key={cat.id}
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.04 }}
                            className="snap-start shrink-0"
                        >
                            <Link
                                href={`/web/category/${cat.slug}`}
                                className="group block relative overflow-hidden w-48 h-60 rounded-xl border border-slate-700/50 bg-slate-800/50 hover:border-[#E8341A]/50 hover:-translate-y-1 transition-all duration-300"
                            >
                                {/* Always silhouette — invert + brightness to turn any image into a white silhouette */}
                                <div className="absolute inset-0 flex items-center justify-center p-6">
                                    {cat.image ? (
                                        <Image
                                            src={cat.image}
                                            alt={cat.name}
                                            fill
                                            className="object-contain p-8 opacity-25 group-hover:opacity-50 transition-all duration-500 invert brightness-200 saturate-0"
                                        />
                                    ) : (
                                        <Hexagon className="w-14 h-14 text-slate-700 group-hover:text-slate-500 transition-colors" strokeWidth={1} />
                                    )}
                                </div>
                                {/* Subtle red glow on hover */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#E8341A]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/85 to-transparent">
                                    <h3 className="text-white text-[11px] font-semibold uppercase tracking-tight mb-0.5 group-hover:text-[#E8341A] transition-colors line-clamp-2">{cat.name}</h3>
                                    <p className="text-slate-500 text-[9px] font-medium uppercase tracking-widest flex items-center gap-1 group-hover:text-[#E8341A] transition-colors">
                                        Ver <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                                    </p>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
