"use client"

// Version: 1.0.1 - Force Refresh
import { useState, useRef, useEffect, useCallback } from "react"
import { ShoppingBag, ChevronRight, ArrowRight, Shield, Zap, Truck, ChevronLeft, Hexagon, Star, X, Smartphone, Database, Sparkles, Code, Bot, Download, Search } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
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

    const featuredProducts = (() => {
        const seenCategories = new Set<string>();
        // 1. Initial filter: featured, consoles, or tech keywords
        let base = filteredProducts.filter(p => {
            const text = `${p.name} ${p.description || ''} ${p.category?.name || ''}`.toLowerCase();
            const isConsole = p.category?.slug === 'consolas-de-video-juegos' || text.includes('playstation') || text.includes('ps5') || text.includes('ps4');
            const isTech = text.includes('power bank') || text.includes('powerbank') || text.includes('banco de poder') || text.includes('espia') || text.includes('espía') || text.includes('oculta');
            
            if (isConsole) {
                if (!seenCategories.has('consoles')) {
                    seenCategories.add('consoles');
                    return true;
                }
                return false;
            }
            return p.featured || isTech;
        });

        // 2. If we have less than 16, fill with newest products that aren't already there
        if (base.length < 16) {
            const currentIds = new Set(base.map(p => p.id));
            const newest = [...filteredProducts]
                .filter(p => !currentIds.has(p.id))
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 16 - base.length);
            base = [...base, ...newest];
        }

        return base;
    })();

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
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-[#1E3A8A]/20 pb-20 font-sans">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>

                {/* 1. CATEGORÍAS */}
                <CategoriesBanner categories={metadata.categories} />

                {/* 2. PRODUCTOS DESTACADOS — Always filled */}
                <section className="py-12" id="destacados">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="mb-6 flex items-end justify-between">
                            <div>
                                <h2 className="text-xl font-semibold text-[#1E3A8A] uppercase tracking-widest">
                                    PRODUCTOS <span className="font-bold text-blue-600">DESTACADOS</span>
                                </h2>
                                <p className="text-slate-400 text-[10px] mt-1 uppercase tracking-[0.3em] font-medium">Selección Premium</p>
                            </div>
                            <Link href="/web/products" className="text-[10px] font-semibold text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-1 uppercase tracking-widest">
                                Ver todos <ArrowRight size={12} />
                            </Link>
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                                {featuredProducts.slice(0, 32).map((p: any, i: number) => (
                                    <MiniProductCard key={p.id} product={p} userRole={userRole} delay={i * 0.03} />
                                ))}
                        </div>
                    </div>
                </section>

                {/* 3. TIENDA PÚBLICA — Professional Search & Catalog */}
                <section className="py-20 border-t border-slate-200" id="productos">
                    <div className="max-w-7xl mx-auto px-6 mb-12">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
                            <div className="space-y-2">
                                <h2 className="text-3xl md:text-5xl font-black text-[#1E3A8A] uppercase tracking-tighter italic">
                                    NUESTROS <span className="text-blue-600">PRODUCTOS</span>
                                </h2>
                                <p className="text-slate-400 text-[10px] uppercase tracking-[0.4em] font-bold">Catálogo de Alta Precisión</p>
                            </div>

                            {/* Professional Search Bar */}
                            <div className="relative group w-full md:w-[400px]">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-blue-600 transition-colors" size={18} />
                                <input 
                                    type="text" 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Buscar por nombre, marca o categoría..."
                                    className="w-full bg-white border border-slate-200 rounded-none p-4 pl-12 pr-24 text-sm uppercase tracking-widest placeholder:text-slate-300 focus:border-[#1E3A8A] focus:bg-slate-50 transition-all outline-none"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-4">
                                    <div className="hidden sm:block px-2 py-0.5 bg-blue-50 border border-blue-100 rounded-none">
                                        <span className="text-[8px] font-black text-[#1E3A8A] uppercase tracking-widest">{filteredProducts.length} Items</span>
                                    </div>
                                    {searchQuery && (
                                        <button 
                                            onClick={() => setSearchQuery("")}
                                            className="text-slate-400 hover:text-[#1E3A8A] transition-colors"
                                        >
                                            <X size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {searchQuery ? (
                            filteredProducts.length === 0 ? (
                                <div className="py-20 text-center border border-dashed border-slate-200 rounded-none">
                                    <p className="text-slate-400 text-[10px] uppercase tracking-[0.3em] font-black">No se encontraron productos para "{searchQuery}"</p>
                                    <button onClick={() => setSearchQuery("")} className="mt-4 text-[#1E3A8A] text-[10px] font-black uppercase tracking-widest hover:underline">Limpiar Búsqueda</button>
                                </div>
                            ) : (
                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                        {filteredProducts.map((p: any, i: number) => (
                                            <MiniProductCard key={p.id} product={p} userRole={userRole} delay={i * 0.02} />
                                        ))}
                                    </div>
                            )
                        ) : (
                            <InfiniteProductScroll products={filteredProducts} userRole={userRole} />
                        )}
                    </div>
                </section>

                {/* 4. BANNER ACADEMY */}
                <section className="py-16 border-y border-slate-200 bg-slate-50">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xl relative flex flex-col md:flex-row">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="flex-1 p-10 md:p-14 flex flex-col justify-center"
                            >
                                <div className="flex items-center gap-2 text-blue-600 mb-4">
                                    <Zap size={13} className="animate-pulse" />
                                    <span className="text-[10px] font-semibold uppercase tracking-[0.3em]">PLATAFORMA EDUCATIVA</span>
                                </div>
                                <h2 className="text-4xl md:text-5xl font-light text-[#1E3A8A] uppercase tracking-tight mb-4">
                                    ATOMIC <span className="font-bold text-blue-700">ACADEMY</span>
                                </h2>
                                <p className="text-slate-500 text-sm leading-relaxed max-w-lg mb-8 font-normal">
                                    Certificaciones técnicas de alto nivel. Aprenda de los expertos y potencie su carrera profesional con el ecosistema Atomic.
                                </p>
                                <div className="flex gap-4">
                                    <Link href="/web/academy">
                                        <button className="bg-[#1E3A8A] text-white px-8 py-3 rounded-lg font-semibold uppercase tracking-widest text-[10px] hover:bg-blue-800 hover:-translate-y-0.5 transition-all shadow-lg">Acceder a Cursos</button>
                                    </Link>
                                    <button className="border border-slate-200 text-slate-500 bg-slate-50 px-8 py-3 rounded-lg font-semibold uppercase tracking-widest text-[10px] hover:bg-slate-100 hover:text-slate-900 transition-all">Ver Temario</button>
                                </div>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                className="w-full md:w-2/5 relative min-h-[220px] bg-gradient-to-br from-[#1E3A8A] to-blue-900 flex flex-col items-center justify-center p-10 overflow-hidden border-l border-slate-200"
                            >
                                <Hexagon size={80} className="text-blue-500/10 absolute scale-[3] animate-[spin_60s_linear_infinite]" strokeWidth={0.5} />
                                <div className="relative z-10 text-center">
                                    <div className="text-2xl font-bold text-white tracking-tight mb-2 italic">NUEVOS CURSOS</div>
                                    <div className="text-[10px] font-semibold text-blue-100 uppercase tracking-[0.4em] bg-blue-950/30 px-4 py-2 rounded-full border border-blue-500/30">Disponibles Ahora</div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* 5. COLECCIONES */}
                <div className="py-16 max-w-7xl mx-auto px-6 space-y-16">
                    {orderedCollections.map((col: any, idx: number) => {
                        const bProducts = filteredProducts.filter(p => p.collectionId === col.id).slice(0, 10)
                        return (
                            <CollectionBanner key={col.id} collection={col} products={bProducts} reverse={idx % 2 !== 0} userRole={userRole} />
                        )
                    })}
                </div>

                {/* 6. SOFTWARE & WEB SHOWCASE - Dedicated Section */}
                <section id="demos" className="py-20 max-w-7xl mx-auto px-6">
                    <WebShowcase />
                </section>

                {/* 7. FEATURES BAR */}
                <section className="py-10 border-t border-slate-200 mt-8">
                    <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { icon: <Truck size={16} />, title: "Logística Global", desc: "Envíos rápidos", color: '#1E3A8A' },
                            { icon: <Shield size={16} />, title: "Seguridad", desc: "Garantía total", color: '#2563EB' },
                            { icon: <Zap size={16} />, title: "Rapidez", desc: "Pago en 1-Click", color: '#1E3A8A' },
                            { icon: <Star size={16} />, title: "Soporte", desc: "Asistencia VIP", color: '#2563EB' }
                        ].map((f, i) => (
                            <div key={i} className="flex items-center space-x-3">
                                <div style={{ color: f.color }} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 shrink-0">{f.icon}</div>
                                <div>
                                    <p className="text-[11px] font-semibold uppercase tracking-widest text-[#1E3A8A]">{f.title}</p>
                                    <p className="text-[10px] text-slate-400 font-normal mt-0.5">{f.desc}</p>
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
                className="group flex flex-col bg-white border border-slate-200 hover:border-[#1E3A8A]/60 hover:shadow-xl transition-all duration-300 rounded-lg overflow-hidden"
            >
                <div className="aspect-square relative bg-slate-50 flex items-center justify-center overflow-hidden">
                    {(() => {
                        const imgs = safeParseArray(p.images)
                        return imgs.length > 0 ? (
                            <Image src={imgs[0]} alt={p.name} fill className="object-contain p-2 group-hover:scale-110 transition-transform duration-300" referrerPolicy="no-referrer" />
                        ) : <ShoppingBag className="text-slate-300 w-5 h-5" />
                    })()}
                </div>
                <div className="p-2">
                    <p className="text-[9px] font-medium text-slate-500 tracking-wide line-clamp-2 leading-tight group-hover:text-[#1E3A8A] transition-colors mb-1">{p.name}</p>
                    <p className="text-[10px] font-bold text-[#1E3A8A]">
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
            <div className="absolute left-0 top-0 bottom-4 w-16 bg-gradient-to-r from-[#F8FAFC] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-4 w-16 bg-gradient-to-l from-[#F8FAFC] to-transparent z-10 pointer-events-none" />

            {/* Nav arrows */}
            <button onClick={() => scroll('left')} className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center hover:bg-white text-slate-500 shadow-md">
                <ChevronLeft size={16} />
            </button>
            <button onClick={() => scroll('right')} className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center hover:bg-white text-slate-500 shadow-md">
                <ChevronRight size={16} />
            </button>

            <div
                ref={trackRef}
                className="flex gap-3 overflow-x-auto pb-4 px-12 cursor-grab active:cursor-grabbing select-none custom-scrollbar"
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseUp}
            >
                {products.map((p: any) => (
                    <Link
                        key={p.id}
                        href={`/web/product/${p.id}`}
                        className="shrink-0 w-44 group bg-white border border-slate-200 hover:border-[#1E3A8A]/50 hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden"
                        draggable={false}
                    >
                        <div className="h-32 relative bg-slate-50 flex items-center justify-center overflow-hidden border-b border-slate-100">
                            {safeParseArray(p.images).length > 0 ? (
                                <Image src={safeParseArray(p.images)[0]} alt={p.name} fill className="object-contain p-3 group-hover:scale-105 transition-transform duration-300" referrerPolicy="no-referrer" />
                            ) : <ShoppingBag className="text-slate-200 w-7 h-7" />}
                        </div>
                        <div className="p-3">
                            <p className="text-[10px] font-medium text-slate-500 line-clamp-2 leading-snug mb-2 group-hover:text-[#1E3A8A] transition-colors">{p.name}</p>
                            <p className="text-xs font-bold text-[#1E3A8A]">${calculateDiscountedPrice(p.price, userRole).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
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
        galleryRef.current?.scrollBy({ left: dir === 'right' ? 300 : -300, behavior: 'smooth' })
    }

    const textAccent = "text-[#1E3A8A]"
    const bgAccent = "from-blue-600/10"
    const btnHover = "hover:bg-[#1E3A8A] hover:border-[#1E3A8A]"
    const badgeColor = "bg-blue-50 text-[#1E3A8A] border-blue-100"

    return (
        <motion.section 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="group relative bg-white border border-slate-200 hover:border-blue-200 rounded-3xl overflow-hidden shadow-xl transition-all duration-500"
        >
            {/* Background Glow effects */}
            <div className={`absolute top-0 ${reverse ? 'right-0' : 'left-0'} w-[500px] h-[500px] bg-gradient-to-br ${bgAccent} to-transparent opacity-20 blur-[100px] pointer-events-none`} />
            
            <div className={`flex flex-col lg:flex-row ${reverse ? 'lg:flex-row-reverse' : ''} items-stretch relative z-10`}>
                
                {/* Left Side: Premium Text Info */}
                <div className={`w-full lg:w-[45%] p-10 md:p-14 flex flex-col justify-center relative border-b lg:border-b-0 ${reverse ? 'lg:border-l border-slate-200' : 'lg:border-r border-slate-200'} overflow-hidden`}>
                    {/* Subtle grid background for text area */}
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-[0.4em] rounded-full border ${badgeColor} backdrop-blur-sm flex items-center gap-2`}>
                                <Sparkles size={10} />
                                Colección Premium
                            </span>
                            <span className="px-3 py-1 text-[9px] font-bold uppercase tracking-widest rounded-full border border-slate-200 bg-slate-50 text-slate-400 backdrop-blur-sm">
                                2026 Edition
                            </span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-black text-[#1E3A8A] tracking-tighter leading-none mb-6 uppercase">
                            {collection.name}
                        </h2>
                        
                        <p className="text-slate-500 text-[13px] leading-relaxed mb-10 font-medium max-w-md">
                            {collection.description || `Equipamiento especializado y soluciones avanzadas para ${collection.name}. Eleva tu infraestructura tecnológica al siguiente nivel con calidad certificada.`}
                        </p>

                        <div className="flex flex-wrap gap-4 items-center">
                            <Link
                                href={`/web/collection/${collection.slug}`}
                                className={`inline-flex items-center gap-3 text-white text-[11px] font-black uppercase tracking-widest px-8 py-4 rounded-xl transition-all duration-300 bg-[#1E3A8A] border border-[#1E3A8A] ${btnHover} shadow-xl`}
                            >
                                Explorar Catálogo <ArrowRight size={16} />
                            </Link>
                            
                            {collection.slug === 'desarrollo' || collection.slug === 'software-desarrollo' ? (
                                <button
                                    onClick={() => document.getElementById('demos')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="inline-flex items-center gap-3 text-white text-[11px] font-black uppercase tracking-widest px-8 py-4 rounded-xl transition-all duration-300 bg-gradient-to-r from-blue-600 to-blue-800 border border-blue-500 hover:bg-blue-700 shadow-xl"
                                >
                                    Ver Demos Web <Bot size={16} />
                                </button>
                            ) : (
                                <button className="inline-flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 bg-slate-50 border border-slate-200 hover:bg-[#1E3A8A] hover:text-white text-slate-400 shadow-xl group/btn">
                                    <Download size={18} className="group-hover/btn:-translate-y-0.5 transition-transform" />
                                </button>
                            )}
                        </div>

                        {/* Extra trust badges below buttons */}
                        <div className="flex items-center gap-6 mt-12 pt-8 border-t border-slate-100">
                            <div className="flex items-center gap-2">
                                <Shield size={16} className={textAccent} />
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Garantía Total</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Zap size={16} className={textAccent} />
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Soporte VIP</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Showcase Gallery */}
                <div className="w-full lg:w-[55%] p-6 md:p-10 relative bg-slate-50">
                    {products.length > 0 ? (
                        <div className="h-full flex flex-col">
                            <div className="flex justify-between items-center mb-6 px-2">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Productos Destacados</span>
                                <div className="flex gap-2">
                                    <button onClick={() => scrollGallery('left')} className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-[#1E3A8A] hover:text-white transition-all text-slate-400 shadow-md"><ChevronLeft size={16} /></button>
                                    <button onClick={() => scrollGallery('right')} className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-[#1E3A8A] hover:text-white transition-all text-slate-400 shadow-md"><ChevronRight size={16} /></button>
                                </div>
                            </div>

                            <div ref={galleryRef} className="flex gap-4 overflow-x-auto pb-6 pt-2 px-2 hide-scrollbar snap-x flex-1 items-center">
                                {products.map((p: any, idx: number) => (
                                    <motion.div 
                                        key={p.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="snap-center shrink-0"
                                    >
                                        <Link 
                                            href={`/web/product/${p.id}`} 
                                            className="block w-48 lg:w-56 group bg-white border border-slate-200 rounded-2xl hover:border-blue-300 transition-all duration-300 p-3 shadow-lg hover:shadow-xl relative overflow-hidden"
                                        >
                                            <div className="absolute top-0 right-0 p-3 z-10">
                                                <div className="w-6 h-6 rounded-full bg-slate-50 backdrop-blur-sm flex items-center justify-center border border-slate-100 group-hover:bg-[#1E3A8A] group-hover:text-white transition-all">
                                                    <ArrowRight size={10} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                                                </div>
                                            </div>

                                            <div className="h-36 lg:h-44 bg-slate-50 flex items-center justify-center relative mb-4 rounded-xl overflow-hidden border border-slate-100">
                                                {safeParseArray(p.images).length > 0 ? (
                                                    <Image src={safeParseArray(p.images)[0]} alt={p.name} fill className="object-contain p-4 group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                                                ) : <ShoppingBag className="text-slate-200 w-8 h-8" />}
                                            </div>
                                            
                                            <div className="px-1">
                                                <p className="text-slate-500 text-[11px] font-semibold line-clamp-2 mb-2 group-hover:text-[#1E3A8A] transition-colors leading-relaxed h-8">{p.name}</p>
                                                <p className="text-sm font-black text-[#1E3A8A] bg-blue-50 inline-block px-3 py-1.5 rounded-lg border border-blue-100">${calculateDiscountedPrice(p.price, userRole).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="h-full min-h-[300px] flex items-center justify-center">
                            <div className="text-center bg-white p-10 rounded-3xl border border-slate-100 shadow-sm">
                                <Hexagon className="w-12 h-12 text-slate-200 mx-auto mb-4 animate-[spin_10s_linear_infinite]" strokeWidth={1} />
                                <p className="text-slate-300 text-[11px] uppercase tracking-[0.4em] font-black">Catálogo en Sincronización</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </motion.section>
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
                        <h2 className="text-xl font-semibold text-[#1E3A8A] uppercase tracking-widest">
                            NUESTRAS <span className="font-bold text-blue-600">CATEGORÍAS</span>
                        </h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => scroll('left')} className="w-8 h-8 rounded-full border border-slate-200 bg-white text-slate-400 flex items-center justify-center hover:bg-[#1E3A8A] hover:text-white transition-all shadow-sm"><ChevronLeft size={15} /></button>
                        <button onClick={() => scroll('right')} className="w-8 h-8 rounded-full border border-slate-200 bg-white text-slate-400 flex items-center justify-center hover:bg-[#1E3A8A] hover:text-white transition-all shadow-sm"><ChevronRight size={15} /></button>
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
                                href={cat.slug === 'desarrollo' || cat.slug === 'software-desarrollo' || cat.slug.includes('diseno') || cat.name.toLowerCase().includes('diseño') ? '/web/demos' : `/web/category/${cat.slug}`}
                                className="group block relative overflow-hidden w-48 h-60 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-lg transition-all duration-300"
                            >
                                {/* Always silhouette — invert + brightness to turn any image into a white silhouette */}
                                <div className="absolute inset-0 flex items-center justify-center p-6">
                                    {cat.image ? (
                                        <Image
                                            src={cat.image}
                                            alt={cat.name}
                                            fill
                                            className="object-contain p-8 opacity-10 group-hover:opacity-30 transition-all duration-500 saturate-0"
                                        />
                                    ) : (
                                        <Hexagon className="w-14 h-14 text-slate-100 group-hover:text-blue-50 transition-colors" strokeWidth={1} />
                                    )}
                                </div>
                                {/* Subtle blue glow on hover */}
                                <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-white via-white/95 to-transparent">
                                    <h3 className="text-[#1E3A8A] text-[11px] font-semibold uppercase tracking-tight mb-0.5 group-hover:text-blue-600 transition-colors line-clamp-2">{cat.name}</h3>
                                    <p className="text-slate-400 text-[9px] font-medium uppercase tracking-widest flex items-center gap-1 group-hover:text-blue-600 transition-colors">
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

/* ─── Web Demo Showcase (Development Section) ─── */
const PORTFOLIO_ITEMS = [
    {
        id: 1,
        title: "Instituto Sucre",
        category: "Plataforma EduTech",
        description: "Gestión académica integral. Redujo el tiempo de inscripción de estudiantes en un 80%.",
        accent: "#6366f1",
        previewUrl: "/instituto_sucre.html"
    },
    {
        id: 2,
        title: "Bodegas Logistics",
        category: "Logística Corporativo",
        description: "Control de inventario en tiempo real con trazabilidad QR multi-almacén.",
        accent: "#10b981",
        previewUrl: "/bodegas.html"
    },
    {
        id: 3,
        title: "Scraper Pro",
        category: "Inteligencia Competitiva",
        description: "Motor automatizado de extracción de datos masivos impulsado por Puppeteer.",
        accent: "#a855f7",
        previewUrl: "/scraper/index.html"
    },
    {
        id: 4,
        title: "Couple Games",
        category: "Entretenimiento B2C",
        description: "Aplicación interactiva con micro-animaciones fluidas diseñada para alto engagement.",
        accent: "#ec4899",
        previewUrl: "/couples-game/index.html"
    },
    {
        id: 5,
        title: "SOFT3 Logistics",
        category: "ERP de Logística",
        description: "Sistema robusto de gestión de inventarios desarrollado en Laravel para alta escalabilidad.",
        accent: "#3b82f6",
        previewUrl: "/soft3.html"
    }
]

function WebShowcase() {
    const [activePreview, setActivePreview] = useState<{url: string, title: string, accent: string} | null>(null)
    const scrollRef = useRef<HTMLDivElement>(null)

    const scroll = (dir: 'left' | 'right') => {
        scrollRef.current?.scrollBy({ left: dir === 'right' ? 350 : -350, behavior: 'smooth' })
    }

    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-[#1E3A8A]">
                <Code size={120} />
            </div>
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
                <div>
                    <div className="flex items-center gap-2 text-blue-600 mb-2">
                        <Sparkles size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Software & Web Demos</span>
                    </div>
                    <h3 className="text-2xl font-black text-[#1E3A8A] uppercase tracking-tight">Showcase de <span className="text-blue-600">Desarrollo</span></h3>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => scroll('left')} className="w-10 h-10 rounded-full border border-slate-200 bg-white text-slate-400 hover:text-blue-600 flex items-center justify-center transition-colors shadow-sm">
                        <ChevronLeft size={20} />
                    </button>
                    <button onClick={() => scroll('right')} className="w-10 h-10 rounded-full border border-slate-200 bg-white text-slate-400 hover:text-blue-600 flex items-center justify-center transition-colors shadow-sm">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div ref={scrollRef} className="flex gap-6 overflow-x-auto hide-scrollbar pb-4 snap-x">
                {PORTFOLIO_ITEMS.map((item) => (
                    <motion.div 
                        key={item.id}
                        whileHover={{ y: -5 }}
                        className="snap-start shrink-0 w-72 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden group cursor-pointer shadow-md hover:shadow-xl transition-all"
                        onClick={() => setActivePreview({ url: item.previewUrl, title: item.title, accent: item.accent })}
                    >
                        {/* Fake Browser Top */}
                        <div className="bg-slate-100 px-3 py-2 flex items-center gap-1.5 border-b border-slate-200">
                            <div className="w-2 h-2 rounded-full bg-red-400" />
                            <div className="w-2 h-2 rounded-full bg-yellow-400" />
                            <div className="w-2 h-2 rounded-full bg-green-400" />
                            <div className="ml-2 flex-1 bg-white h-3 rounded-sm" />
                        </div>
                        
                        {/* Preview Image / Placeholder */}
                        <div className="h-40 relative bg-white flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-50 group-hover:opacity-100 transition-opacity" />
                            <iframe 
                                src={item.previewUrl} 
                                title={item.title}
                                className="w-[400%] h-[400%] origin-top-left scale-[0.25] pointer-events-none opacity-40 group-hover:opacity-80 transition-opacity"
                                tabIndex={-1}
                            />
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-blue-600/10 opacity-100 group-hover:opacity-0 transition-opacity">
                                <Smartphone size={32} className="text-blue-600/20 mb-2" />
                                <span className="text-[10px] font-bold text-blue-600/40 uppercase tracking-widest">Ver Demo</span>
                            </div>
                        </div>

                        {/* Info */}
                        <div className="p-4 border-t border-slate-100 bg-white">
                            <span className="text-[9px] font-bold uppercase tracking-widest mb-1 block" style={{ color: item.accent }}>{item.category}</span>
                            <h4 className="text-sm font-bold text-slate-800 mb-2">{item.title}</h4>
                            <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-2">{item.description}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Preview Modal */}
            <AnimatePresence>
                {activePreview && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 md:p-10"
                        onClick={() => setActivePreview(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full h-full max-w-6xl bg-white border border-slate-200 shadow-2xl rounded-xl overflow-hidden flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="h-14 bg-slate-50 border-b border-slate-200 flex items-center justify-between px-6">
                                <div className="flex items-center gap-4">
                                    <div className="flex gap-2">
                                        <button onClick={() => setActivePreview(null)} className="w-3 h-3 rounded-full bg-red-500" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                        <div className="w-3 h-3 rounded-full bg-green-500" />
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-l border-slate-200 pl-4">
                                        Demo: <span className="text-slate-900">{activePreview.title}</span>
                                    </span>
                                </div>
                                <button onClick={() => setActivePreview(null)} className="text-slate-400 hover:text-slate-900 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="flex-1 bg-white">
                                <iframe src={activePreview.url} title="Active Demo" className="w-full h-full border-0" />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
