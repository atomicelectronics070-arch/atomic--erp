"use client"

import { useState, useRef } from "react"
import { ShoppingBag, ChevronRight, Star, ArrowRight, Shield, Zap, Truck, ChevronLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Starfield } from "@/components/ui/Starfield"
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
            // Scroll to product section
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
        <div className="min-h-screen bg-[#020617] text-white font-sans relative">
            <Starfield />
            <div className="scanline" />
            
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                {/* 1. SECCIÓN SUPERIOR: CATEGORÍAS */}
                <CategoriesBanner categories={metadata.categories} />

                {/* 2. SECCIÓN MEDIA: PRODUCTOS DESTACADOS */}
                <section className="bg-transparent py-32 border-b border-white/5 overflow-hidden">
                    <div className="max-w-[95%] mx-auto px-6">
                        <motion.div 
                            initial={{ x: -50, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6"
                        >
                            <div className="space-y-4">
                                <p className="text-[#E8341A] text-[10px] font-black uppercase tracking-[0.4em] neon-text">Selección Premium</p>
                                <h2 className="text-5xl font-light text-white uppercase tracking-tighter">
                                    Productos <span className="font-black italic text-[#E8341A] neon-text">Destacados</span>
                                </h2>
                            </div>
                        </motion.div>

                        <div className="w-full overflow-x-auto hide-scrollbar cursor-grab active:cursor-grabbing">
                            <div className="grid grid-flow-col grid-rows-4 gap-4 w-max">
                                {featuredProducts.length > 0 ? featuredProducts.map((p: any, i: number) => (
                                    <motion.div
                                        key={p.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.05 }}
                                    >
                                        <Link
                                            href={`/web/product/${p.id}`}
                                            className="cyber-card group flex flex-row w-[400px] h-[100px] overflow-hidden"
                                        >
                                            <div className="w-[100px] h-full shrink-0 bg-white p-2 relative">
                                                {(() => {
                                                    const imgs = safeParseArray(p.images)
                                                    return imgs.length > 0 ? (
                                                        <Image 
                                                            src={imgs[0]} 
                                                            alt={p.name} 
                                                            fill
                                                            className="object-contain p-2 mix-blend-multiply group-hover:scale-110 transition-transform duration-500" 
                                                        />
                                                    ) : null
                                                })()}
                                            </div>
                                            <div className="p-4 flex-1 flex flex-col justify-center">
                                                <h3 className="text-[10px] font-black uppercase text-white/90 tracking-widest line-clamp-2 mb-2 leading-tight group-hover:text-[#E8341A] transition-colors">{p.name}</h3>
                                                <div className="flex flex-col">
                                                    {userRole && (userRole === 'AFILIADO' || userRole === 'DISTRIBUIDOR') && (
                                                        <p className="text-[9px] text-white/30 line-through font-mono">
                                                            ${p.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                        </p>
                                                    )}
                                                    <p className="font-mono font-black text-white/80 neon-text">
                                                        ${calculateDiscountedPrice(p.price, userRole).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                )) : null}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Bar */}
                <section className="bg-slate-950/50 backdrop-blur-md py-12 border-y border-white/5">
                    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[
                            { icon: <Truck />, title: "Envíos Gratis", desc: "Todo el país", color: '#E8341A' },
                            { icon: <Shield />, title: "Garantía Total", desc: "Cobertura ATOMIC", color: '#00F0FF' },
                            { icon: <Zap />, title: "Pago Seguro", desc: "Confianza total", color: '#E8341A' },
                            { icon: <Star />, title: "Soporte 24/7", desc: "Asistencia real", color: '#00F0FF' }
                        ].map((f, i) => (
                            <div key={i} className="flex items-center space-x-5 text-white/90">
                                <div style={{ color: f.color }} className="neon-text">{f.icon}</div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest">{f.title}</p>
                                    <p className="text-xs text-white/40">{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Academy Promo Banner */}
                <section className="relative py-32 overflow-hidden border-b border-white/5">
                    <div className="absolute inset-0 bg-[#00F0FF]/5 blur-[120px] -z-10 animate-pulse" />
                    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <motion.div 
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-10"
                        >
                            <div className="flex items-center gap-4 text-[#00F0FF] neon-text">
                                <Zap size={20} />
                                <span className="text-[10px] font-black uppercase tracking-[0.6em] italic">ATOMIC ACADEMY // NEURAL LEARNING</span>
                            </div>
                            <h2 className="text-6xl md:text-8xl font-black text-white uppercase italic tracking-tighter leading-none">
                                CAPACI<span className="text-[#00F0FF] neon-text">TACIÓN</span> <br/> 
                                <span className="text-white/20">Y ACADEMIA</span>
                            </h2>
                            <p className="text-white/40 text-sm md:text-base font-bold uppercase tracking-widest italic leading-relaxed max-w-lg">
                                Domina el ecosistema tecnológico con nuestros cursos especializados. Certificaciones avaladas por Atomic Electronics.
                            </p>
                            <div className="flex gap-6">
                                <Link href="/web/academy">
                                    <button className="bg-[#00F0FF] text-slate-950 px-12 py-5 font-black uppercase tracking-widest text-[11px] italic hover:scale-105 transition-all">INICIAR CURSO</button>
                                </Link>
                                <button className="border border-white/10 text-white px-12 py-5 font-black uppercase tracking-widest text-[11px] italic hover:bg-white/5 transition-all">VER TEMARIO</button>
                            </div>
                        </motion.div>
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative aspect-video bg-white/5 border border-white/5 overflow-hidden flex items-center justify-center"
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#00F0FF]/20 to-transparent" />
                            <Zap size={120} className="text-[#00F0FF] opacity-10 animate-pulse" />
                            <div className="relative z-10 text-center space-y-4">
                                <div className="text-5xl font-black text-white italic tracking-tighter">PRÓXIMA CLASE</div>
                                <div className="text-[10px] font-black text-[#00F0FF] uppercase tracking-[0.5em] italic">VIVO // 19:00 GMT-5</div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* 3. SECCIÓN INFERIOR: ÁREAS DE ESPECIALIZACIÓN */}
                {orderedCollections.map((col: any, idx: number) => {
                    const bProducts = filteredProducts.filter(p => p.collectionId === col.id).slice(0, 10)
                    return (
                        <CollectionBanner
                            id="productos"
                            key={col.id}
                            collection={col}
                            products={bProducts}
                            reverse={idx % 2 !== 0}
                            userRole={userRole}
                        />
                    )
                })}
            </motion.div>
        </div>
    )
}

function CollectionBanner({ id, collection, products, reverse, userRole }: { id?: string, collection: any, products: any[], reverse: boolean, userRole?: string }) {
    const galleryRef = useRef<HTMLDivElement>(null)
    const scrollGallery = (dir: 'left' | 'right') => {
        if (!galleryRef.current) return
        galleryRef.current.scrollBy({ left: dir === 'right' ? 260 : -260, behavior: 'smooth' })
    }

    let gradient = "from-[#0F1923] via-[#1E3A5F] to-[#0F1923]"
    let accent = "#2563EB"
    if (collection.slug.includes('gaming')) {
        gradient = "from-[#0F1923] via-[#5A1A0A] to-[#0F1923]"
        accent = "#E8341A"
    } else if (collection.slug.includes('automatizacion')) {
        gradient = "from-[#0F1923] via-[#3D0A03] to-[#0F1923]"
        accent = "#E8341A"
    }

    return (
        <section id={id} className="relative w-full overflow-hidden border-b border-white/10" style={{ minHeight: '75vh' }}>
            <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-40`}></div>
            <div className={`absolute ${reverse ? 'right-0' : 'left-0'} top-0 bottom-0 w-1.5`} style={{ backgroundColor: accent, boxShadow: `0 0 20px ${accent}` }}></div>

            <div className="relative z-10 w-full h-full flex flex-col justify-between py-24" style={{ minHeight: '75vh' }}>
                <div className={`px-12 md:px-20 flex-1 flex flex-col justify-center ${reverse ? 'items-end text-right' : 'items-start text-left'}`}>
                    <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 bg-white/10 text-white text-[9px] font-black uppercase tracking-[0.4em] px-4 py-2 mb-8 backdrop-blur-sm"
                    >
                        ÁREA DE ESPECIALIZACIÓN
                    </motion.div>
                    
                    <motion.h2 
                        initial={{ y: 30, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.85] mb-8 uppercase"
                    >
                        {collection.name}
                    </motion.h2>
                    
                    <motion.p 
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-white/70 text-sm md:text-base font-medium max-w-xl leading-relaxed mb-10"
                    >
                        {collection.description || `Equipamiento avanzado para ${collection.name}.`}
                    </motion.p>
                    
                    <Link
                        href={`/web/collection/${collection.slug}`}
                        className="relative z-50 inline-flex items-center gap-3 text-white text-[11px] font-black uppercase tracking-[0.2em] px-10 py-5 transition-all hover:gap-6 shadow-2xl"
                        style={{ backgroundColor: accent }}
                    >
                        Acceder <ArrowRight size={14} />
                    </Link>
                </div>

                {products.length > 0 && (
                    <div className={`absolute bottom-12 ${reverse ? 'left-0 pl-12' : 'right-0 pr-12'} w-full md:w-[50%]`}>
                        <div className="flex items-center justify-between mb-6 px-4">
                            <span className="text-white/30 text-[9px] font-black uppercase tracking-[0.4em]">Sugeridos</span>
                            <div className="flex gap-2">
                                <button onClick={() => scrollGallery('left')} className="w-10 h-10 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all"><ChevronLeft size={16} /></button>
                                <button onClick={() => scrollGallery('right')} className="w-10 h-10 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all"><ChevronRight size={16} /></button>
                            </div>
                        </div>
                        <div ref={galleryRef} className="flex gap-4 overflow-x-auto pb-6 scroll-smooth px-4 hide-scrollbar">
                            {products.map((p: any) => (
                                <Link key={p.id} href={`/web/product/${p.id}`} className="cyber-card shrink-0 w-56 group p-4 bg-slate-900/40 backdrop-blur-xl">
                                    <div className="h-40 bg-white/5 flex items-center justify-center relative mb-4">
                                        {safeParseArray(p.images).length > 0 ? (
                                            <Image src={safeParseArray(p.images)[0]} alt={p.name} fill className="object-contain p-4 group-hover:scale-110 transition-transform duration-700" />
                                        ) : <ShoppingBag className="text-white/10" />}
                                    </div>
                                    <p className="text-white text-[10px] font-black uppercase tracking-widest line-clamp-1 mb-2">{p.name}</p>
                                    <p className="text-[12px] font-mono font-black" style={{ color: accent }}>
                                        ${calculateDiscountedPrice(p.price, userRole).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}

function CategoriesBanner({ categories }: { categories: any[] }) {
    const scrollRef = useRef<HTMLDivElement>(null)
    const scroll = (dir: 'left' | 'right') => {
        scrollRef.current?.scrollBy({ left: dir === 'right' ? 300 : -300, behavior: 'smooth' })
    }

    return (
        <section id="categorias" className="w-full bg-[#030712] relative overflow-hidden py-32 border-b border-white/5">
            <div className="relative z-10">
                <div className="max-w-[95%] mx-auto px-6 mb-16 flex flex-col md:flex-row items-end justify-between gap-8">
                    <div className="space-y-4">
                        <p className="text-[#E8341A] text-[10px] font-black uppercase tracking-[0.5em] neon-text">Navegación Táctica</p>
                        <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">
                            NUESTRAS <span className="text-[#E8341A] neon-text italic">CATEGORÍAS</span>
                        </h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={() => scroll('left')} className="w-14 h-14 border border-white/10 flex items-center justify-center hover:bg-[#E8341A] hover:border-[#E8341A] transition-all"><ChevronLeft /></button>
                        <button onClick={() => scroll('right')} className="w-14 h-14 border border-white/10 flex items-center justify-center hover:bg-[#E8341A] hover:border-[#E8341A] transition-all"><ChevronRight /></button>
                    </div>
                </div>

                <div ref={scrollRef} className="flex gap-8 overflow-x-auto px-12 hide-scrollbar pb-12">
                    {categories.filter(c => c.isVisible).map((cat: any, i: number) => (
                        <motion.div
                            key={cat.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <Link
                                href={`/web/category/${cat.slug}`}
                                className="group shrink-0 relative overflow-hidden w-80 h-[450px] cyber-card"
                            >
                                <div className="absolute inset-0 bg-black">
                                    {cat.image && (
                                        <Image src={cat.image} alt={cat.name} fill className="object-cover opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-1000" />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                                </div>
                                <div className="absolute bottom-0 left-0 p-8 w-full">
                                    <h3 className="text-white text-xl font-black uppercase tracking-tighter mb-4 group-hover:text-[#E8341A] transition-colors">{cat.name}</h3>
                                    <p className="text-white/40 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 group-hover:text-white transition-colors">
                                        Explorar Catálogo <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
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
