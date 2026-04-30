"use client"

import { useState, useRef, useEffect } from "react"
import { ShoppingBag, ChevronRight, Star, ArrowRight, Shield, Zap, Truck, ChevronLeft, Hexagon } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { calculateDiscountedPrice } from "@/lib/utils/pricing"

const safeParseArray = (str: any, fallback: any = []) => {
    if (!str || str === 'null' || str === '[]' || str === '') return fallback;
    if (Array.isArray(str)) return str.length > 0 ? str : fallback;
    if (typeof str === 'string') {
        const trimmed = str.trim();
        if (trimmed.startsWith('http') || trimmed.startsWith('/') || trimmed.startsWith('data:image')) {
            return [trimmed];
        }
        try {
            let cleaned = trimmed;
            if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
                cleaned = cleaned.substring(1, cleaned.length - 1).replace(/\\"/g, '"');
            }
            let parsed = JSON.parse(cleaned);
            if (typeof parsed === 'string') {
                try { parsed = JSON.parse(parsed); } catch(e) {}
            }
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
    metadata: {
        categories: any[]
        collections: any[]
    }
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

    const featuredProducts = filteredProducts.filter(p => p.featured)

    const desiredOrder = ["tecnologia-residencial", "desarrollo", "gaming", "automatizacion"]
    const orderedCollections = desiredOrder
        .map(slug => metadata.collections.find(c => c.slug === slug))
        .filter(Boolean)
        .concat(metadata.collections.filter(c => !desiredOrder.includes(c.slug)))

    return (
        <div className="min-h-screen bg-marble text-slate-900 font-sans selection:bg-[#E8341A]/10 pb-20">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                {/* 1. SECCIÓN SUPERIOR: CATEGORÍAS */}
                <CategoriesBanner categories={metadata.categories} />

                {/* 2. SECCIÓN MEDIA: PRODUCTOS DESTACADOS */}
                <section className="bg-transparent py-16">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-light text-slate-800 uppercase tracking-tight">
                                    PRODUCTOS <span className="font-black text-[#E8341A]">DESTACADOS</span>
                                </h2>
                                <p className="text-slate-500 text-[10px] mt-1 uppercase tracking-widest font-semibold">Selección Premium</p>
                            </div>
                            <Link href="/web/products" className="text-xs font-bold text-slate-600 hover:text-[#E8341A] transition-colors flex items-center gap-1 uppercase tracking-widest">
                                Ver todos <ArrowRight size={14} />
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {featuredProducts.slice(0, 10).map((p: any, i: number) => (
                                <motion.div
                                    key={p.id}
                                    initial={{ opacity: 0, y: 15 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <Link
                                        href={`/web/product/${p.id}`}
                                        className="group flex flex-col bg-white/60 backdrop-blur-md border border-slate-200/60 hover:border-[#E8341A]/30 hover:bg-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 rounded-xl overflow-hidden h-[280px]"
                                    >
                                        <div className="h-36 relative bg-transparent p-3 flex items-center justify-center border-b border-slate-100/50">
                                            {(() => {
                                                const imgs = safeParseArray(p.images)
                                                return imgs.length > 0 ? (
                                                    <Image 
                                                        src={imgs[0]} 
                                                        alt={p.name} 
                                                        fill
                                                        className="object-contain p-3 group-hover:scale-110 transition-transform duration-500 mix-blend-multiply" 
                                                    />
                                                ) : <ShoppingBag className="text-slate-200 w-8 h-8" />
                                            })()}
                                        </div>
                                        <div className="p-4 flex-1 flex flex-col justify-between">
                                            <h3 className="text-[11px] font-bold text-slate-700 tracking-wide line-clamp-2 leading-tight group-hover:text-[#E8341A] transition-colors">{p.name}</h3>
                                            <div className="flex items-end justify-between mt-2">
                                                <div>
                                                    {userRole && (userRole === 'AFILIADO' || userRole === 'DISTRIBUIDOR') && (
                                                        <p className="text-[9px] text-slate-400 line-through font-medium">
                                                            ${p.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                        </p>
                                                    )}
                                                    <p className="text-sm font-black text-slate-900">
                                                        ${calculateDiscountedPrice(p.price, userRole).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Bar */}
                <section className="py-8 my-8 border-y border-slate-200/50 bg-white/30 backdrop-blur-sm">
                    <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { icon: <Truck size={16} />, title: "Logística Global", desc: "Envíos rápidos", color: '#E8341A' },
                            { icon: <Shield size={16} />, title: "Seguridad", desc: "Garantía total", color: '#2563EB' },
                            { icon: <Zap size={16} />, title: "Rapidez", desc: "Pago en 1-Click", color: '#E8341A' },
                            { icon: <Star size={16} />, title: "Soporte", desc: "Asistencia VIP", color: '#2563EB' }
                        ].map((f, i) => (
                            <div key={i} className="flex items-center space-x-3">
                                <div style={{ color: f.color }} className="bg-white p-2 rounded-lg shadow-sm border border-slate-100">{f.icon}</div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-800">{f.title}</p>
                                    <p className="text-[9px] text-slate-500 uppercase">{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Academy Promo Banner */}
                <section className="py-12 my-12 max-w-6xl mx-auto px-6">
                    <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl overflow-hidden shadow-2xl relative">
                        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 blur-[100px] pointer-events-none" />
                        <div className="grid grid-cols-1 lg:grid-cols-5 items-center">
                            <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="lg:col-span-3 p-10 md:p-14 space-y-6"
                            >
                                <div className="flex items-center gap-2 text-blue-400">
                                    <Zap size={14} />
                                    <span className="text-[9px] font-bold uppercase tracking-[0.2em]">PLATAFORMA EDUCATIVA</span>
                                </div>
                                <h2 className="text-3xl md:text-4xl font-light text-white uppercase tracking-tight">
                                    ATOMIC <span className="font-black text-blue-400">ACADEMY</span>
                                </h2>
                                <p className="text-slate-300 text-sm leading-relaxed max-w-sm">
                                    Certificaciones técnicas de alto nivel. Aprenda de los expertos y potencie su carrera profesional.
                                </p>
                                <div className="flex gap-4 pt-2">
                                    <Link href="/web/academy">
                                        <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20">Acceder</button>
                                    </Link>
                                    <button className="border border-slate-700 text-slate-300 px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-slate-800 transition-all">Saber más</button>
                                </div>
                            </motion.div>
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="lg:col-span-2 relative h-full min-h-[200px] bg-slate-950/50 border-l border-slate-800 flex flex-col items-center justify-center p-8"
                            >
                                <Hexagon size={60} className="text-blue-500/20 mb-4" strokeWidth={1} />
                                <div className="text-xl font-black text-white tracking-tight mb-1">NUEVOS CURSOS</div>
                                <div className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Disponibles Ahora</div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* 3. SECCIÓN INFERIOR: ÁREAS DE ESPECIALIZACIÓN */}
                <div className="max-w-7xl mx-auto px-6 space-y-12">
                    {orderedCollections.map((col: any, idx: number) => {
                        const bProducts = filteredProducts.filter(p => p.collectionId === col.id).slice(0, 10)
                        return (
                            <CollectionBanner
                                key={col.id}
                                collection={col}
                                products={bProducts}
                                reverse={idx % 2 !== 0}
                                userRole={userRole}
                            />
                        )
                    })}
                </div>
            </motion.div>
        </div>
    )
}

function CollectionBanner({ collection, products, reverse, userRole }: { collection: any, products: any[], reverse: boolean, userRole?: string }) {
    const galleryRef = useRef<HTMLDivElement>(null)
    const scrollGallery = (dir: 'left' | 'right') => {
        if (!galleryRef.current) return
        galleryRef.current.scrollBy({ left: dir === 'right' ? 250 : -250, behavior: 'smooth' })
    }

    let accent = "bg-slate-900"
    let hoverAccent = "hover:bg-blue-600"
    let textAccent = "text-blue-600"
    
    if (collection.slug.includes('gaming') || collection.slug.includes('automatizacion')) {
        hoverAccent = "hover:bg-[#E8341A]"
        textAccent = "text-[#E8341A]"
    }

    return (
        <section className="bg-white/60 backdrop-blur-xl border border-slate-200/60 rounded-3xl overflow-hidden shadow-sm">
            <div className={`flex flex-col lg:flex-row ${reverse ? 'lg:flex-row-reverse' : ''} items-stretch`}>
                
                {/* Title Section */}
                <div className="w-full lg:w-1/3 p-8 md:p-12 flex flex-col justify-center bg-white/40">
                    <span className={`inline-block ${textAccent} text-[9px] font-black uppercase tracking-[0.3em] mb-3`}>
                        Colección
                    </span>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight leading-tight mb-4 uppercase">
                        {collection.name}
                    </h2>
                    <p className="text-slate-500 text-xs leading-relaxed mb-8 line-clamp-3">
                        {collection.description || `Equipamiento especializado para ${collection.name}. Eleve su experiencia con nuestra selección exclusiva de productos de alta gama.`}
                    </p>
                    
                    <Link
                        href={`/web/collection/${collection.slug}`}
                        className={`inline-flex self-start items-center gap-2 text-white text-[10px] font-bold uppercase tracking-widest px-6 py-3 rounded-lg transition-all shadow-sm ${accent} ${hoverAccent}`}
                    >
                        Ver colección <ArrowRight size={14} />
                    </Link>
                </div>

                {/* Products Slider */}
                <div className="w-full lg:w-2/3 p-6 lg:p-8 bg-transparent relative border-t lg:border-t-0 lg:border-l border-slate-200/50">
                    {products.length > 0 ? (
                        <>
                            <div className="absolute top-4 right-8 flex gap-2 z-10">
                                <button onClick={() => scrollGallery('left')} className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors text-slate-600 shadow-sm"><ChevronLeft size={16} /></button>
                                <button onClick={() => scrollGallery('right')} className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors text-slate-600 shadow-sm"><ChevronRight size={16} /></button>
                            </div>
                            
                            <div ref={galleryRef} className="flex gap-4 overflow-x-auto pb-4 pt-8 scroll-smooth hide-scrollbar snap-x px-2">
                                {products.map((p: any) => (
                                    <Link key={p.id} href={`/web/product/${p.id}`} className="shrink-0 w-48 group bg-white border border-slate-100 rounded-xl hover:shadow-lg hover:border-slate-300 transition-all p-3 snap-start">
                                        <div className="h-32 bg-transparent flex items-center justify-center relative mb-3">
                                            {safeParseArray(p.images).length > 0 ? (
                                                <Image src={safeParseArray(p.images)[0]} alt={p.name} fill className="object-contain p-2 group-hover:scale-105 transition-transform duration-500 mix-blend-multiply" />
                                            ) : <ShoppingBag className="text-slate-200 w-8 h-8" />}
                                        </div>
                                        <p className="text-slate-700 text-[10px] font-bold uppercase tracking-wide line-clamp-2 mb-2 group-hover:text-[#E8341A] transition-colors">{p.name}</p>
                                        <p className="text-xs font-black text-slate-900">
                                            ${calculateDiscountedPrice(p.price, userRole).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="h-full min-h-[200px] flex items-center justify-center">
                            <div className="text-center">
                                <Hexagon className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                                <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">Catálogo en actualización</p>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </section>
    )
}

function CategoriesBanner({ categories }: { categories: any[] }) {
    const scrollRef = useRef<HTMLDivElement>(null)
    const scroll = (dir: 'left' | 'right') => {
        scrollRef.current?.scrollBy({ left: dir === 'right' ? 250 : -250, behavior: 'smooth' })
    }

    return (
        <section id="categorias" className="w-full bg-transparent relative py-12">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-row items-end justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-light text-slate-800 uppercase tracking-tight">
                            NUESTRAS <span className="font-black text-[#E8341A]">CATEGORÍAS</span>
                        </h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => scroll('left')} className="w-9 h-9 rounded-full border border-slate-300 bg-white/80 backdrop-blur-sm text-slate-600 flex items-center justify-center hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-sm"><ChevronLeft size={16} /></button>
                        <button onClick={() => scroll('right')} className="w-9 h-9 rounded-full border border-slate-300 bg-white/80 backdrop-blur-sm text-slate-600 flex items-center justify-center hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-sm"><ChevronRight size={16} /></button>
                    </div>
                </div>

                <div ref={scrollRef} className="flex gap-4 overflow-x-auto hide-scrollbar pb-6 snap-x px-1">
                    {categories.filter(c => c.isVisible).map((cat: any, i: number) => (
                        <motion.div
                            key={cat.id}
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                            className="snap-start"
                        >
                            <Link
                                href={`/web/category/${cat.slug}`}
                                className="group block relative overflow-hidden w-56 h-72 rounded-2xl border border-slate-200/50 bg-white/80 backdrop-blur-md hover:shadow-lg hover:border-[#E8341A]/20 transition-all duration-300"
                            >
                                <div className="absolute inset-0 p-6 flex items-center justify-center">
                                    {cat.image ? (
                                        <Image 
                                            src={cat.image} 
                                            alt={cat.name} 
                                            fill 
                                            className="object-contain p-8 opacity-70 mix-blend-multiply group-hover:scale-110 transition-transform duration-700" 
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center opacity-20 group-hover:opacity-40 transition-opacity">
                                            <Hexagon className="w-16 h-16 text-slate-400 mb-2" strokeWidth={1} />
                                        </div>
                                    )}
                                </div>
                                <div className="absolute bottom-0 left-0 w-full p-5 bg-gradient-to-t from-white via-white/90 to-transparent">
                                    <h3 className="text-slate-800 text-sm font-black uppercase tracking-tight mb-1 group-hover:text-[#E8341A] transition-colors line-clamp-2">{cat.name}</h3>
                                    <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest flex items-center gap-1 group-hover:text-[#E8341A] transition-colors">
                                        Ver Catálogo <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
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
