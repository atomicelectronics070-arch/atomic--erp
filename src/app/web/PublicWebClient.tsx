"use client"

import { useState, useRef, useEffect } from "react"
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
        <div className="min-h-screen bg-[#020617] text-white font-sans relative selection:bg-[#E8341A]/30">
            <Starfield />
            <div className="scanline opacity-[0.05]" />
            
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
            >
                {/* 1. SECCIÓN SUPERIOR: CATEGORÍAS */}
                <CategoriesBanner categories={metadata.categories} />

                {/* 2. SECCIÓN MEDIA: PRODUCTOS DESTACADOS */}
                <section className="bg-transparent py-48 border-b border-white/[0.03] overflow-hidden">
                    <div className="max-w-[95%] mx-auto px-6">
                        <motion.div 
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            className="flex flex-col md:flex-row justify-between items-end mb-24 gap-6"
                        >
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-px bg-[#E8341A]/30" />
                                    <p className="text-[#E8341A]/50 text-[9px] font-medium uppercase tracking-[0.6em]">Selección de Élite</p>
                                </div>
                                <h2 className="text-6xl md:text-8xl font-light text-white uppercase tracking-tighter leading-none italic">
                                    PRODUCTOS <span className="font-black text-[#E8341A] drop-shadow-[0_0_15px_rgba(232,52,26,0.3)]">DESTACADOS</span>
                                </h2>
                            </div>
                        </motion.div>

                        <div className="w-full overflow-x-auto hide-scrollbar">
                            <div className="grid grid-flow-col grid-rows-3 gap-6 w-max pb-12">
                                {featuredProducts.length > 0 ? featuredProducts.map((p: any, i: number) => (
                                    <motion.div
                                        key={p.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.03 }}
                                    >
                                        <Link
                                            href={`/web/product/${p.id}`}
                                            className="group flex flex-row w-[380px] h-[90px] border border-white/[0.03] bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/[0.1] transition-all duration-500 overflow-hidden"
                                        >
                                            <div className="w-[90px] h-full shrink-0 bg-white/[0.02] p-2 relative border-r border-white/[0.03]">
                                                {(() => {
                                                    const imgs = safeParseArray(p.images)
                                                    return imgs.length > 0 ? (
                                                        <Image 
                                                            src={imgs[0]} 
                                                            alt={p.name} 
                                                            fill
                                                            className="object-contain p-3 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 invert" 
                                                        />
                                                    ) : null
                                                })()}
                                            </div>
                                            <div className="p-4 flex-1 flex flex-col justify-center bg-slate-950/20">
                                                <h3 className="text-[9px] font-medium uppercase text-white/40 tracking-[0.2em] line-clamp-1 mb-2 group-hover:text-white transition-colors">{p.name}</h3>
                                                <div className="flex items-end gap-3">
                                                    <p className="text-lg font-light text-white/80 italic leading-none">
                                                        ${calculateDiscountedPrice(p.price, userRole).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                    </p>
                                                    {userRole && (userRole === 'AFILIADO' || userRole === 'DISTRIBUIDOR') && (
                                                        <p className="text-[8px] text-white/10 line-through font-medium mb-1">
                                                            ${p.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                        </p>
                                                    )}
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
                <section className="bg-slate-950/20 backdrop-blur-3xl py-16 border-y border-white/[0.02]">
                    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
                        {[
                            { icon: <Truck size={16} />, title: "Logística Global", desc: "Envíos prioritarios", color: '#E8341A' },
                            { icon: <Shield size={16} />, title: "Seguridad Atomic", desc: "Garantía blindada", color: '#2563EB' },
                            { icon: <Zap size={16} />, title: "Transacción Encriptada", desc: "Pago en 1-Click", color: '#E8341A' },
                            { icon: <Star size={16} />, title: "Elite Support", desc: "Canal exclusivo", color: '#2563EB' }
                        ].map((f, i) => (
                            <div key={i} className="flex items-center space-x-6 group">
                                <div style={{ color: f.color }} className="opacity-30 group-hover:opacity-100 transition-opacity duration-500">{f.icon}</div>
                                <div>
                                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/60 mb-1">{f.title}</p>
                                    <p className="text-[10px] text-white/20 uppercase tracking-widest">{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Academy Promo Banner */}
                <section className="relative py-48 overflow-hidden border-b border-white/[0.03]">
                    <div className="absolute inset-0 bg-[#2563EB]/[0.02] blur-[150px] -z-10" />
                    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="space-y-12"
                        >
                            <div className="flex items-center gap-4 text-[#2563EB]/50">
                                <Zap size={14} />
                                <span className="text-[8px] font-black uppercase tracking-[0.8em] italic">NEURAL LEARNING HUB</span>
                            </div>
                            <h2 className="text-7xl md:text-9xl font-light text-white uppercase italic tracking-tighter leading-[0.8] mb-12">
                                ATOMIC <br/> 
                                <span className="text-[#2563EB] font-black drop-shadow-[0_0_30px_rgba(37,99,235,0.2)]">ACADEMY</span>
                            </h2>
                            <p className="text-white/20 text-[10px] md:text-xs font-medium uppercase tracking-[0.4em] italic leading-relaxed max-w-md">
                                Domine el ecosistema tecnológico con certificaciones de alto nivel.
                            </p>
                            <div className="flex gap-8">
                                <Link href="/web/academy">
                                    <button className="bg-[#2563EB] text-white px-10 py-5 font-black uppercase tracking-[0.4em] text-[9px] italic hover:bg-[#3b82f6] transition-all shadow-xl">INICIAR CURSO</button>
                                </Link>
                                <button className="border border-white/5 text-white/30 px-10 py-5 font-black uppercase tracking-[0.4em] text-[9px] italic hover:bg-white/[0.02] hover:text-white transition-all">VER TEMARIO</button>
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
        <section id={id} className="relative w-full overflow-hidden border-b border-white/[0.03]" style={{ minHeight: '85vh' }}>
            <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-20`}></div>
            <div className={`absolute ${reverse ? 'right-0' : 'left-0'} top-0 bottom-0 w-[1px] opacity-20`} style={{ backgroundColor: accent, boxShadow: `0 0 40px ${accent}` }}></div>

            <div className="relative z-10 w-full h-full flex flex-col justify-between py-32" style={{ minHeight: '85vh' }}>
                <div className={`px-12 md:px-24 flex-1 flex flex-col justify-center ${reverse ? 'items-end text-right' : 'items-start text-left'}`}>
                    <motion.div 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-3 text-white/30 text-[8px] font-black uppercase tracking-[0.6em] mb-12"
                    >
                        <div className="w-8 h-px bg-current opacity-20" />
                        ÁREA DE ESPECIALIZACIÓN
                    </motion.div>
                    
                    <motion.h2 
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-7xl md:text-[10rem] font-light text-white tracking-tighter leading-[0.8] mb-12 uppercase italic"
                    >
                        {collection.name.split(' ')[0]} <br/> 
                        <span className="font-black drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">{collection.name.split(' ').slice(1).join(' ')}</span>
                    </motion.h2>
                    
                    <motion.p 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-white/30 text-[10px] md:text-xs font-medium max-w-md uppercase tracking-[0.3em] leading-relaxed mb-16 italic"
                    >
                        {collection.description || `Equipamiento avanzado para ${collection.name}.`}
                    </motion.p>
                    
                    <Link
                        href={`/web/collection/${collection.slug}`}
                        className="group relative z-50 inline-flex items-center gap-5 text-white text-[9px] font-black uppercase tracking-[0.4em] px-12 py-6 transition-all border border-white/5 hover:bg-white hover:text-black shadow-2xl italic"
                    >
                        EXPLORAR <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                    </Link>
                </div>

                {products.length > 0 && (
                    <div className={`absolute bottom-20 ${reverse ? 'left-0 pl-12' : 'right-0 pr-12'} w-full md:w-[45%]`}>
                        <div className="flex items-center justify-between mb-8 px-6">
                            <span className="text-white/10 text-[8px] font-black uppercase tracking-[0.6em]">RECOMENDADOS_ATOMIC</span>
                            <div className="flex gap-4">
                                <button onClick={() => scrollGallery('left')} className="w-12 h-12 border border-white/[0.03] flex items-center justify-center hover:bg-white/5 transition-all"><ChevronLeft size={14} /></button>
                                <button onClick={() => scrollGallery('right')} className="w-12 h-12 border border-white/[0.03] flex items-center justify-center hover:bg-white/5 transition-all"><ChevronRight size={14} /></button>
                            </div>
                        </div>
                        <div ref={galleryRef} className="flex gap-6 overflow-x-auto pb-8 scroll-smooth px-6 hide-scrollbar">
                            {products.map((p: any) => (
                                <Link key={p.id} href={`/web/product/${p.id}`} className="shrink-0 w-64 group p-5 border border-white/[0.02] bg-white/[0.01] hover:bg-white/[0.03] transition-all">
                                    <div className="h-48 bg-white/[0.01] flex items-center justify-center relative mb-5 border border-white/[0.02]">
                                        {safeParseArray(p.images).length > 0 ? (
                                            <Image src={safeParseArray(p.images)[0]} alt={p.name} fill className="object-contain p-6 opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000 invert" />
                                        ) : <ShoppingBag className="text-white/5" />}
                                    </div>
                                    <p className="text-white/40 text-[9px] font-medium uppercase tracking-[0.2em] line-clamp-1 mb-2 group-hover:text-white transition-colors">{p.name}</p>
                                    <p className="text-[11px] font-light italic text-white/60">
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
        <section id="categorias" className="w-full bg-[#020617] relative overflow-hidden py-48 border-b border-white/[0.03]">
            <div className="relative z-10">
                <div className="max-w-[95%] mx-auto px-6 mb-24 flex flex-col md:flex-row items-end justify-between gap-12">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-px bg-[#E8341A]/30" />
                            <p className="text-[#E8341A]/50 text-[9px] font-medium uppercase tracking-[0.6em]">Navegación Estratégica</p>
                        </div>
                        <h2 className="text-6xl md:text-9xl font-light text-white uppercase tracking-tighter leading-none italic">
                            NUESTRAS <span className="text-[#E8341A] font-black drop-shadow-[0_0_15px_rgba(232,52,26,0.2)]">CATEGORÍAS</span>
                        </h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={() => scroll('left')} className="w-16 h-16 border border-white/[0.03] flex items-center justify-center hover:bg-white/5 transition-all"><ChevronLeft size={20} /></button>
                        <button onClick={() => scroll('right')} className="w-16 h-16 border border-white/[0.03] flex items-center justify-center hover:bg-white/5 transition-all"><ChevronRight size={20} /></button>
                    </div>
                </div>

                <div ref={scrollRef} className="flex gap-8 overflow-x-auto px-12 hide-scrollbar pb-16">
                    {categories.filter(c => c.isVisible).map((cat: any, i: number) => (
                        <motion.div
                            key={cat.id}
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <Link
                                href={`/web/category/${cat.slug}`}
                                className="group shrink-0 relative overflow-hidden w-96 h-[550px] border border-white/[0.03]"
                            >
                                <div className="absolute inset-0 bg-black">
                                    {cat.image && (
                                        <Image src={cat.image} alt={cat.name} fill className="object-cover opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-1000 grayscale" />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                                </div>
                                <div className="absolute bottom-0 left-0 p-12 w-full">
                                    <h3 className="text-white text-3xl font-light uppercase tracking-tighter mb-6 group-hover:text-[#E8341A] transition-colors italic">{cat.name}</h3>
                                    <p className="text-white/20 text-[8px] font-black uppercase tracking-[0.5em] flex items-center gap-4 group-hover:text-white transition-colors">
                                        VER CATÁLOGO <ArrowRight size={14} className="group-hover:translate-x-3 transition-transform" />
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

