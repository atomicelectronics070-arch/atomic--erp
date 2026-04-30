"use client"

import { useState, useRef, useEffect } from "react"
import { ShoppingBag, ChevronRight, Star, ArrowRight, Shield, Zap, Truck, ChevronLeft } from "lucide-react"
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
        <div className="min-h-screen bg-marble text-slate-900 font-sans selection:bg-[#E8341A]/10">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                {/* 1. SECCIÓN SUPERIOR: CATEGORÍAS */}
                <CategoriesBanner categories={metadata.categories} />

                {/* 2. SECCIÓN MEDIA: PRODUCTOS DESTACADOS */}
                <section className="bg-transparent py-24 border-b border-slate-200">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="mb-12">
                            <h2 className="text-3xl md:text-5xl font-light text-slate-900 uppercase tracking-tighter">
                                PRODUCTOS <span className="font-black text-[#E8341A]">DESTACADOS</span>
                            </h2>
                            <p className="text-slate-500 text-sm mt-3 uppercase tracking-widest">La mejor selección premium</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {featuredProducts.slice(0, 8).map((p: any, i: number) => (
                                <motion.div
                                    key={p.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <Link
                                        href={`/web/product/${p.id}`}
                                        className="group flex flex-col bg-white border border-slate-200 hover:border-[#E8341A]/30 hover:shadow-xl transition-all duration-300 rounded-sm overflow-hidden h-full"
                                    >
                                        <div className="h-48 relative bg-slate-50 p-4 border-b border-slate-100 flex items-center justify-center">
                                            {(() => {
                                                const imgs = safeParseArray(p.images)
                                                return imgs.length > 0 ? (
                                                    <Image 
                                                        src={imgs[0]} 
                                                        alt={p.name} 
                                                        fill
                                                        className="object-contain p-4 group-hover:scale-105 transition-transform duration-500" 
                                                    />
                                                ) : <ShoppingBag className="text-slate-300 w-12 h-12" />
                                            })()}
                                        </div>
                                        <div className="p-5 flex-1 flex flex-col justify-between">
                                            <h3 className="text-xs font-bold uppercase text-slate-800 tracking-wide line-clamp-2 mb-3 group-hover:text-[#E8341A] transition-colors">{p.name}</h3>
                                            <div className="flex items-end justify-between">
                                                <div>
                                                    {userRole && (userRole === 'AFILIADO' || userRole === 'DISTRIBUIDOR') && (
                                                        <p className="text-[10px] text-slate-400 line-through font-medium">
                                                            ${p.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                        </p>
                                                    )}
                                                    <p className="text-lg font-bold text-slate-900">
                                                        ${calculateDiscountedPrice(p.price, userRole).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                    </p>
                                                </div>
                                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#E8341A] group-hover:text-white transition-colors">
                                                    <ArrowRight size={14} />
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
                <section className="bg-white py-12 border-b border-slate-200">
                    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[
                            { icon: <Truck size={20} />, title: "Logística Global", desc: "Envíos prioritarios", color: '#E8341A' },
                            { icon: <Shield size={20} />, title: "Seguridad Atomic", desc: "Garantía blindada", color: '#2563EB' },
                            { icon: <Zap size={20} />, title: "Transacción Encriptada", desc: "Pago en 1-Click", color: '#E8341A' },
                            { icon: <Star size={20} />, title: "Elite Support", desc: "Canal exclusivo", color: '#2563EB' }
                        ].map((f, i) => (
                            <div key={i} className="flex items-center space-x-4">
                                <div style={{ color: f.color }} className="bg-slate-50 p-3 rounded-full">{f.icon}</div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-1">{f.title}</p>
                                    <p className="text-[11px] text-slate-500 uppercase">{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Academy Promo Banner */}
                <section className="py-24 border-b border-slate-200 bg-gradient-to-br from-blue-50/50 to-white">
                    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div 
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-8"
                        >
                            <div className="flex items-center gap-3 text-blue-600">
                                <Zap size={16} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">NEURAL LEARNING HUB</span>
                            </div>
                            <h2 className="text-4xl md:text-6xl font-light text-slate-900 uppercase tracking-tighter leading-tight">
                                ATOMIC <br/> 
                                <span className="text-blue-600 font-black">ACADEMY</span>
                            </h2>
                            <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-md">
                                Domine el ecosistema tecnológico con certificaciones de alto nivel avaladas por expertos.
                            </p>
                            <div className="flex gap-4">
                                <Link href="/web/academy">
                                    <button className="bg-blue-600 text-white px-8 py-4 font-bold uppercase tracking-widest text-xs hover:bg-blue-700 transition-colors shadow-lg">INICIAR CURSO</button>
                                </Link>
                                <button className="border border-slate-300 text-slate-700 px-8 py-4 font-bold uppercase tracking-widest text-xs hover:bg-slate-50 transition-colors">VER TEMARIO</button>
                            </div>
                        </motion.div>
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative aspect-video bg-white shadow-2xl border border-slate-100 rounded-lg overflow-hidden flex items-center justify-center"
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/50 to-transparent" />
                            <Zap size={80} className="text-blue-500 opacity-20" />
                            <div className="relative z-10 text-center space-y-3">
                                <div className="text-3xl font-black text-slate-900 tracking-tight">PRÓXIMA CLASE</div>
                                <div className="text-xs font-bold text-blue-600 uppercase tracking-widest">EN VIVO // 19:00 GMT-5</div>
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
        galleryRef.current.scrollBy({ left: dir === 'right' ? 300 : -300, behavior: 'smooth' })
    }

    let accent = "bg-blue-600"
    let hoverAccent = "hover:bg-blue-700"
    let textAccent = "text-blue-600"
    if (collection.slug.includes('gaming') || collection.slug.includes('automatizacion')) {
        accent = "bg-[#E8341A]"
        hoverAccent = "hover:bg-[#d02c15]"
        textAccent = "text-[#E8341A]"
    }

    return (
        <section id={id} className="relative w-full overflow-hidden border-b border-slate-200 bg-white py-24">
            <div className="max-w-7xl mx-auto px-6">
                <div className={`flex flex-col md:flex-row ${reverse ? 'md:flex-row-reverse' : ''} gap-12 items-center`}>
                    
                    <div className="w-full md:w-1/3 flex flex-col justify-center">
                        <motion.div 
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                        >
                            <span className={`inline-block ${textAccent} text-[10px] font-bold uppercase tracking-widest mb-4`}>
                                ÁREA DE ESPECIALIZACIÓN
                            </span>
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight mb-6 uppercase">
                                {collection.name}
                            </h2>
                            <p className="text-slate-600 text-sm leading-relaxed mb-8">
                                {collection.description || `Equipamiento premium para ${collection.name}. Eleve su experiencia con nuestra selección exclusiva.`}
                            </p>
                            
                            <Link
                                href={`/web/collection/${collection.slug}`}
                                className={`inline-flex items-center gap-3 text-white text-xs font-bold uppercase tracking-widest px-8 py-4 transition-all shadow-md ${accent} ${hoverAccent}`}
                            >
                                Acceder al Catálogo <ArrowRight size={14} />
                            </Link>
                        </motion.div>
                    </div>

                    <div className="w-full md:w-2/3 relative">
                        {products.length > 0 ? (
                            <>
                                <div className="absolute -top-12 right-0 flex gap-2">
                                    <button onClick={() => scrollGallery('left')} className="w-10 h-10 bg-slate-50 border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors text-slate-600"><ChevronLeft size={18} /></button>
                                    <button onClick={() => scrollGallery('right')} className="w-10 h-10 bg-slate-50 border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors text-slate-600"><ChevronRight size={18} /></button>
                                </div>
                                <div ref={galleryRef} className="flex gap-6 overflow-x-auto pb-4 pt-2 scroll-smooth hide-scrollbar snap-x">
                                    {products.map((p: any) => (
                                        <Link key={p.id} href={`/web/product/${p.id}`} className="shrink-0 w-64 group bg-white border border-slate-200 hover:shadow-xl transition-all p-4 snap-start">
                                            <div className="h-48 bg-slate-50 flex items-center justify-center relative mb-4">
                                                {safeParseArray(p.images).length > 0 ? (
                                                    <Image src={safeParseArray(p.images)[0]} alt={p.name} fill className="object-contain p-4 group-hover:scale-105 transition-transform duration-500" />
                                                ) : <ShoppingBag className="text-slate-300 w-12 h-12" />}
                                            </div>
                                            <p className="text-slate-800 text-xs font-bold uppercase tracking-wide line-clamp-2 mb-2 group-hover:text-[#E8341A] transition-colors">{p.name}</p>
                                            <p className="text-[14px] font-bold text-slate-900">
                                                ${calculateDiscountedPrice(p.price, userRole).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                            </p>
                                        </Link>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="h-64 border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 text-sm uppercase tracking-widest font-bold">
                                Próximamente
                            </div>
                        )}
                    </div>

                </div>
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
        <section id="categorias" className="w-full bg-white relative py-20 border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-12">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-light text-slate-900 uppercase tracking-tighter">
                            NUESTRAS <span className="font-black text-[#E8341A]">CATEGORÍAS</span>
                        </h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={() => scroll('left')} className="w-12 h-12 border border-slate-200 bg-white text-slate-600 flex items-center justify-center hover:bg-slate-50 transition-colors"><ChevronLeft size={20} /></button>
                        <button onClick={() => scroll('right')} className="w-12 h-12 border border-slate-200 bg-white text-slate-600 flex items-center justify-center hover:bg-slate-50 transition-colors"><ChevronRight size={20} /></button>
                    </div>
                </div>

                <div ref={scrollRef} className="flex gap-6 overflow-x-auto hide-scrollbar pb-6 snap-x">
                    {categories.filter(c => c.isVisible).map((cat: any, i: number) => (
                        <motion.div
                            key={cat.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                            className="snap-start"
                        >
                            <Link
                                href={`/web/category/${cat.slug}`}
                                className="group block relative overflow-hidden w-72 h-96 border border-slate-200 bg-slate-50 hover:shadow-xl transition-all duration-300"
                            >
                                <div className="absolute inset-0">
                                    {cat.image ? (
                                        <Image src={cat.image} alt={cat.name} fill className="object-cover opacity-60 mix-blend-multiply group-hover:scale-110 transition-transform duration-700" />
                                    ) : (
                                        <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                                            <ShoppingBag className="text-slate-300 w-16 h-16" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
                                </div>
                                <div className="absolute bottom-0 left-0 p-6 w-full">
                                    <h3 className="text-white text-2xl font-black uppercase tracking-tight mb-2 group-hover:text-[#E8341A] transition-colors">{cat.name}</h3>
                                    <p className="text-white/80 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 group-hover:text-white transition-colors">
                                        Ver Catálogo <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
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
