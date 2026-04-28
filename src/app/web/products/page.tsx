"use client"

import { useState, useEffect, useRef } from "react"
import { ShoppingBag, Star, ArrowRight, Search, ChevronLeft, ChevronRight, Heart, Zap, Shield, Truck, Package, Filter, LayoutGrid, List } from "lucide-react"
import Link from "next/link"
import { StaticMoleculesBackground } from "@/components/ui/StaticMoleculesBackground"

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

const proxyImg = (url: string): string => {
    if (!url) return ''
    if (url.startsWith('/api/img-proxy') || url.startsWith('/') || url.startsWith('data:')) return url
    return `/api/img-proxy?url=${encodeURIComponent(url)}`
}

export default function ProductsPage() {
    const [sections, setSections] = useState<any>({
        featured: [],
        categories: [],
        collections: [],
        bestSellers: [],
        distributors: [],
        recent: [],
        gadgets: [],
        builders: [],
        all: []
    })
    const [loading, setLoading] = useState(true)
    const [favorites, setFavorites] = useState<string[]>([])
    const [catalogSearch, setCatalogSearch] = useState("")

    useEffect(() => {
        const init = async () => {
            setLoading(true)
            const [mRes, pRes] = await Promise.all([
                fetch("/api/web/metadata").then(r => r.json()),
                fetch("/api/web/products?pageSize=100").then(r => r.json())
            ])

            const products = pRes.products || []
            
            // Logic for sections
            setSections({
                featured: products.filter((p: any) => p.featured),
                categories: mRes.categories || [],
                collections: mRes.collections || [],
                bestSellers: products.slice(0, 10), // Mocked for now
                distributors: products.filter((p: any) => p.name.toLowerCase().includes('distribuidor') || p.price > 1000).slice(0, 8),
                recent: [...products].sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 8),
                gadgets: products.filter((p: any) => p.categoryId && mRes.categories.find((c: any) => c.id === p.categoryId && c.slug.includes('gadgets'))).slice(0, 8),
                builders: products.filter((p: any) => p.name.toLowerCase().includes('obra') || p.name.toLowerCase().includes('constru')).slice(0, 8),
                all: products
            })

            const savedFavs = localStorage.getItem('atomic_favs')
            if (savedFavs) setFavorites(JSON.parse(savedFavs))
            
            setLoading(false)
        }
        init()
    }, [])

    const toggleFavorite = (id: string) => {
        const newFavs = favorites.includes(id) ? favorites.filter(f => f !== id) : [...favorites, id]
        setFavorites(newFavs)
        localStorage.setItem('atomic_favs', JSON.stringify(newFavs))
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F4F1EB]">
                <StaticMoleculesBackground />
                <div className="animate-spin h-10 w-10 border-4 border-[#E8341A] border-t-transparent shadow-lg"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#F4F1EB] text-slate-900 selection:bg-[#E8341A]/10">
            <StaticMoleculesBackground />

            {/* Header / Hero Section for Products */}
            <header className="relative z-10 pt-20 pb-16 px-6 border-b border-black/5 bg-white/30 backdrop-blur-md">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="space-y-6 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 bg-[#E8341A]/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-[#E8341A]">
                            Catálogo Maestro de Productos
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none">
                            CENTRO DE <span className="text-[#E8341A] italic underline decoration-4 underline-offset-8">EQUIPOS</span>
                        </h1>
                        <p className="text-slate-500 uppercase text-[10px] font-bold tracking-[0.3em] max-w-lg mx-auto md:mx-0">
                            Explora nuestra infraestructura tecnológica organizada por categorías, áreas y especialidades corporativas.
                        </p>
                    </div>
                    <div className="w-full md:w-[500px] relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#E8341A] transition-colors" size={22} />
                        <input 
                            type="text"
                            placeholder="Buscar en todo el inventario..."
                            className="w-full bg-white border-2 border-slate-100 pl-16 pr-8 py-7 text-[12px] font-black uppercase tracking-widest outline-none focus:border-[#E8341A] transition-all shadow-2xl"
                        />
                    </div>
                </div>
            </header>

            <main className="relative z-10 max-w-7xl mx-auto px-6 py-20 space-y-32">
                
                {/* 1. PRODUCTOS DESTACADOS - Large Grid */}
                <Section title="Nuestros Destacados" subtitle="Lo mejor de la ingeniería" color="#E8341A">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {sections.featured.slice(0, 4).map((p: any) => (
                            <ProductCard key={p.id} product={p} isFav={favorites.includes(p.id)} onFav={() => toggleFavorite(p.id)} />
                        ))}
                    </div>
                </Section>

                {/* 2. CATEGORÍAS - Scrollable Cards */}
                <Section title="Categorías" subtitle="Organizado por especialidad" color="#2563EB">
                    <div className="flex gap-6 overflow-x-auto hide-scrollbar pb-10">
                        {sections.categories.map((c: any) => (
                            <Link key={c.id} href={`/web/category/${c.slug}`} className="group shrink-0 w-64 bg-white/60 backdrop-blur-md border border-white/40 p-8 flex flex-col items-center text-center transition-all hover:shadow-2xl hover:-translate-y-2">
                                <div className="w-20 h-20 bg-slate-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    {c.image ? <img src={proxyImg(c.image)} className="w-12 h-12 object-contain mix-blend-multiply" /> : <Package className="w-10 h-10 text-slate-200" />}
                                </div>
                                <h3 className="text-xs font-black uppercase tracking-widest line-clamp-1">{c.name}</h3>
                                <p className="text-[#2563EB] text-[9px] font-black mt-2 uppercase flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">Explorar <ArrowRight size={10} /></p>
                            </Link>
                        ))}
                    </div>
                </Section>

                {/* 3. MÁS VENDIDOS & RECIENTES - Split Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                    <Section title="Más Vendidos" subtitle="Preferidos por el sector" color="#F59E0B">
                        <div className="space-y-4">
                            {sections.bestSellers.slice(0, 5).map((p: any) => (
                                <MiniProductItem key={p.id} product={p} />
                            ))}
                        </div>
                    </Section>
                    <Section title="Novedades" subtitle="Importados recientemente" color="#10B981">
                        <div className="space-y-4">
                            {sections.recent.slice(0, 5).map((p: any) => (
                                <MiniProductItem key={p.id} product={p} />
                            ))}
                        </div>
                    </Section>
                </div>

                {/* 4. SECCIONES ESPECIALES - Horizontal Rows */}
                <Section title="Para Distribuidores" subtitle="Ofertas de volumen" color="#6366F1">
                    <HorizontalScroll>
                        {sections.distributors.map((p: any) => (
                            <ProductCard key={p.id} product={p} isFav={favorites.includes(p.id)} onFav={() => toggleFavorite(p.id)} />
                        ))}
                    </HorizontalScroll>
                </Section>

                <Section title="Ofertas para Constructores" subtitle="Proyectos a gran escala" color="#E8341A">
                    <HorizontalScroll>
                        {sections.builders.length > 0 ? sections.builders.map((p: any) => (
                            <ProductCard key={p.id} product={p} isFav={favorites.includes(p.id)} onFav={() => toggleFavorite(p.id)} />
                        )) : <div className="py-20 text-center w-full border-2 border-dashed border-black/5 opacity-30 font-black uppercase tracking-widest text-xs italic">Próximamente más ofertas en este sector</div>}
                    </HorizontalScroll>
                </Section>

                {/* 5. GADGETS & FAVORITOS */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2">
                        <Section title="Gadgets & Accesorios" subtitle="Tecnología de punta" color="#EC4899">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {sections.gadgets.slice(0, 6).map((p: any) => (
                                    <ProductCard key={p.id} product={p} isFav={favorites.includes(p.id)} onFav={() => toggleFavorite(p.id)} compact />
                                ))}
                            </div>
                        </Section>
                    </div>
                    <div>
                        <Section title="Tus Favoritos" subtitle="Guardados por ti" color="#E8341A">
                            <div className="bg-white/60 backdrop-blur-md border border-white/40 p-8 min-h-[400px]">
                                {favorites.length > 0 ? (
                                    <div className="space-y-6">
                                        {favorites.slice(0, 6).map(id => {
                                            const p = sections.all.find((x: any) => x.id === id)
                                            if (!p) return null
                                            return <MiniProductItem key={p.id} product={p} showFavIcon />
                                        })}
                                        {favorites.length > 6 && <p className="text-center text-[10px] font-black uppercase text-slate-400 mt-4">y {favorites.length - 6} más...</p>}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-20 py-20">
                                        <Heart size={48} />
                                        <p className="text-[10px] font-black uppercase tracking-widest">No tienes favoritos guardados</p>
                                    </div>
                                )}
                            </div>
                        </Section>
                    </div>
                </div>

            </main>
        </div>
    )
}

function Section({ title, subtitle, color, children }: { title: string, subtitle: string, color: string, children: React.ReactNode }) {
    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div className="space-y-2 text-center md:text-left">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em]" style={{ color }}>{subtitle}</p>
                    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">{title}</h2>
                </div>
                <div className="flex items-center gap-2">
                    <Link href="/web" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#E8341A] transition-colors flex items-center gap-2">Ver todo <ArrowRight size={12} /></Link>
                </div>
            </div>
            {children}
        </div>
    )
}

function ProductCard({ product, isFav, onFav, compact = false }: { product: any, isFav: boolean, onFav: () => void, compact?: boolean }) {
    const imgs = safeParseArray(product.images)
    return (
        <div className={`group bg-white/60 backdrop-blur-md border border-white/40 ${compact ? 'p-4' : 'p-8'} transition-all hover:shadow-2xl hover:-translate-y-2 flex flex-col`}>
            <div className="relative aspect-square mb-6 bg-white flex items-center justify-center p-6 border border-black/5 overflow-hidden">
                <img src={proxyImg(imgs[0])} alt={product.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700" />
                <button 
                    onClick={(e) => { e.preventDefault(); onFav(); }}
                    className={`absolute top-4 right-4 w-10 h-10 flex items-center justify-center transition-all ${isFav ? 'bg-[#E8341A] text-white' : 'bg-white/80 text-slate-400 hover:text-[#E8341A]'}`}
                >
                    <Heart size={18} fill={isFav ? 'currentColor' : 'none'} />
                </button>
            </div>
            <Link href={`/web/product/${product.id}`} className="flex-1 space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest line-clamp-2 leading-tight group-hover:text-[#E8341A] transition-colors">{product.name}</h3>
                <div className="flex justify-between items-end">
                    <p className="text-[#E8341A] font-mono font-black text-xl">${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                    <p className="text-[9px] font-black uppercase text-slate-300 tracking-tighter">SKU: {product.sku || 'N/A'}</p>
                </div>
            </Link>
        </div>
    )
}

function MiniProductItem({ product, showFavIcon = false }: { product: any, showFavIcon?: boolean }) {
    const imgs = safeParseArray(product.images)
    return (
        <Link href={`/web/product/${product.id}`} className="group flex items-center gap-6 p-4 bg-white/40 border border-white/40 hover:bg-white/80 transition-all">
            <div className="w-16 h-16 bg-white p-2 shrink-0 border border-black/5">
                <img src={proxyImg(imgs[0])} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
            </div>
            <div className="flex-1">
                <h4 className="text-[10px] font-black uppercase tracking-widest line-clamp-1 group-hover:text-[#E8341A] transition-colors">{product.name}</h4>
                <p className="text-[#E8341A] font-mono font-black text-sm">${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            </div>
            {showFavIcon && <Heart size={14} className="text-[#E8341A] fill-[#E8341A]" />}
            <ArrowRight size={14} className="text-slate-200 group-hover:text-[#E8341A] transition-colors group-hover:translate-x-2" />
        </Link>
    )
}

function HorizontalScroll({ children }: { children: React.ReactNode }) {
    const ref = useRef<HTMLDivElement>(null)
    return (
        <div className="relative group">
            <button onClick={() => ref.current?.scrollBy({ left: -600, behavior: 'smooth' })} className="absolute -left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white shadow-xl flex items-center justify-center border border-black/5 opacity-0 group-hover:opacity-100 transition-all hover:bg-[#E8341A] hover:text-white"><ChevronLeft size={20} /></button>
            <button onClick={() => ref.current?.scrollBy({ left: 600, behavior: 'smooth' })} className="absolute -right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white shadow-xl flex items-center justify-center border border-black/5 opacity-0 group-hover:opacity-100 transition-all hover:bg-[#E8341A] hover:text-white"><ChevronRight size={20} /></button>
            <div ref={ref} className="flex gap-8 overflow-x-auto hide-scrollbar scroll-smooth px-2">
                {children}
            </div>
        </div>
    )
}
