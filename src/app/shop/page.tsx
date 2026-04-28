"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { ShoppingBag, Heart, Search, ArrowRight, Package, LogOut, User, Star, Zap } from "lucide-react"
import Link from "next/link"
import { StaticMoleculesBackground } from "@/components/ui/StaticMoleculesBackground"

const safeParseArray = (str: any, fallback: any = []) => {
    if (!str || str === 'null' || str === '[]' || str === '') return fallback;
    if (Array.isArray(str)) return str.length > 0 ? str : fallback;
    if (typeof str === 'string') {
        try {
            let parsed = JSON.parse(str);
            if (Array.isArray(parsed)) return parsed;
        } catch (e) {}
        return [str];
    }
    return fallback;
};

const proxyImg = (url: string): string => {
    if (!url) return ''
    if (url.startsWith('/api/img-proxy') || url.startsWith('/') || url.startsWith('data:')) return url
    return `/api/img-proxy?url=${encodeURIComponent(url)}`
}

export default function ShopPlatform() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [favorites, setFavorites] = useState<string[]>([])
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login")
        }
    }, [status, router])

    useEffect(() => {
        const fetchProducts = async () => {
            const res = await fetch("/api/web/products?pageSize=50")
            const data = await res.json()
            setProducts(data.products || [])
            
            const savedFavs = localStorage.getItem('atomic_favs')
            if (savedFavs) setFavorites(JSON.parse(savedFavs))
            
            setLoading(false)
        }
        fetchProducts()
    }, [])

    const toggleFavorite = (id: string) => {
        const newFavs = favorites.includes(id) ? favorites.filter(f => f !== id) : [...favorites, id]
        setFavorites(newFavs)
        localStorage.setItem('atomic_favs', JSON.stringify(newFavs))
    }

    if (status === "loading" || loading) {
        return (
            <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#F4F1EB] gap-8">
                <div className="w-16 h-16 border-4 border-[#E8341A]/20 border-t-[#E8341A] rounded-none animate-spin"></div>
                <div className="font-black text-[#E8341A] uppercase tracking-[0.5em] animate-pulse text-[10px]">Cargando Tienda...</div>
            </div>
        )
    }

    const filteredProducts = products.filter((p: any) => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const favProducts = products.filter((p: any) => favorites.includes(p.id))

    return (
        <div className="min-h-screen bg-marble text-slate-900 font-sans selection:bg-[#E8341A]/10">
            <StaticMoleculesBackground />

            {/* Premium Header for Consumers */}
            <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-2xl border-b border-black/5 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link href="/shop" className="text-2xl font-black tracking-tighter italic uppercase">
                            ATOMIC<span className="text-[#E8341A]">.</span> SHOP
                        </Link>
                        <nav className="hidden md:flex items-center gap-6">
                            <button className="text-[10px] font-black uppercase tracking-widest text-[#E8341A] border-b-2 border-[#E8341A] pb-1">Catálogo</button>
                            <button onClick={() => document.getElementById('favs')?.scrollIntoView({ behavior: 'smooth' })} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors pb-1">Mis Favoritos</button>
                        </nav>
                    </div>

                    <div className="flex-1 max-w-md mx-10 relative group hidden lg:block">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#E8341A] transition-colors" size={18} />
                        <input 
                            type="text" 
                            placeholder="Buscar productos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-100 pl-12 pr-4 py-3 text-[11px] font-bold uppercase tracking-widest outline-none focus:border-[#E8341A] transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3 pr-6 border-r border-slate-100">
                            <div className="w-8 h-8 bg-[#E8341A] flex items-center justify-center text-white font-black text-xs">
                                {session?.user?.name?.[0] || 'U'}
                            </div>
                            <div className="hidden sm:block">
                                <p className="text-[10px] font-black uppercase tracking-tighter leading-none">{session?.user?.name}</p>
                                <p className="text-[8px] font-bold text-[#E8341A] uppercase tracking-widest mt-1">Consumidor Final</p>
                            </div>
                        </div>
                        <button onClick={() => router.push('/api/auth/signout')} className="text-slate-400 hover:text-red-500 transition-colors">
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </header>

            <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto relative z-10 space-y-20">
                {/* Search Bar for Mobile */}
                <div className="lg:hidden relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                        type="text" 
                        placeholder="Buscar productos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-slate-200 pl-12 pr-4 py-4 text-[11px] font-bold uppercase tracking-widest outline-none shadow-xl"
                    />
                </div>

                {/* Categories or Promo Banner */}
                <div className="bg-[#020617] p-12 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#E8341A]/20 blur-[100px] group-hover:bg-[#E8341A]/30 transition-all"></div>
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                        <div>
                            <h2 className="text-white text-4xl md:text-5xl font-black uppercase tracking-tighter italic leading-none">EQUIPOS DE <br/><span className="text-[#E8341A]">ALTO RENDIMIENTO</span></h2>
                            <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.4em] mt-4">Tecnología certificada para el hogar y oficina</p>
                        </div>
                        <Link href="#catalog" className="bg-[#E8341A] text-white px-10 py-5 font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-[#E8341A] transition-all shadow-2xl shadow-[#E8341A]/30">
                            Explorar Catálogo
                        </Link>
                    </div>
                </div>

                {/* Main Catalog */}
                <div id="catalog" className="space-y-12">
                    <div className="flex justify-between items-end border-b border-black/5 pb-6">
                        <div>
                            <p className="text-[#E8341A] text-[10px] font-black uppercase tracking-[0.4em]">Disponibilidad Inmediata</p>
                            <h2 className="text-4xl font-black uppercase tracking-tighter italic">Nuestros <span className="text-[#E8341A]">Productos</span></h2>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Mostrando {filteredProducts.length} Elementos
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {filteredProducts.map((p: any) => (
                            <ShopCard key={p.id} product={p} isFav={favorites.includes(p.id)} onToggleFav={() => toggleFavorite(p.id)} />
                        ))}
                    </div>
                </div>

                {/* Favorites Section */}
                <div id="favs" className="space-y-12 pt-20 border-t border-black/5">
                    <div className="flex flex-col items-center text-center space-y-4">
                        <Heart className="text-[#E8341A]" size={32} />
                        <h2 className="text-4xl font-black uppercase tracking-tighter italic">Mis <span className="text-[#E8341A]">Favoritos</span></h2>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Tus productos guardados para compra posterior</p>
                    </div>

                    {favProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {favProducts.map((p: any) => (
                                <ShopCard key={p.id} product={p} isFav={true} onToggleFav={() => toggleFavorite(p.id)} />
                            ))}
                        </div>
                    ) : (
                        <div className="py-32 flex flex-col items-center justify-center border-2 border-dashed border-black/5 rounded-none opacity-20 space-y-6">
                            <ShoppingBag size={48} />
                            <p className="font-black uppercase tracking-[0.3em] text-[10px]">Aún no has guardado favoritos</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-black/5 py-10 px-6 mt-20 relative z-10">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="text-center md:text-left">
                        <h3 className="font-black text-xl tracking-tighter uppercase italic">ATOMIC<span className="text-[#E8341A]">.</span> SHOP</h3>
                        <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-1">© 2026 Plataforma de Consumo Final</p>
                    </div>
                    <div className="flex gap-10">
                        <div className="text-center">
                            <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">Seguridad</p>
                            <p className="text-[10px] font-black uppercase mt-1">Encriptado SSL</p>
                        </div>
                        <div className="text-center">
                            <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">Envíos</p>
                            <p className="text-[10px] font-black uppercase mt-1">A todo el país</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

function ShopCard({ product, isFav, onToggleFav }: { product: any, isFav: boolean, onToggleFav: () => void }) {
    const imgs = safeParseArray(product.images)
    return (
        <div className="group bg-white p-6 border border-slate-100 hover:border-[#E8341A]/30 transition-all hover:shadow-2xl flex flex-col relative overflow-hidden">
            <div className="relative aspect-square mb-6 bg-slate-50 flex items-center justify-center p-6 group-hover:scale-105 transition-transform duration-700 overflow-hidden">
                {imgs[0] ? (
                    <img src={proxyImg(imgs[0])} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
                ) : (
                    <div className="flex flex-col items-center justify-center opacity-10">
                        <Package size={48} />
                        <span className="text-[8px] font-black uppercase tracking-[0.4em] mt-4">Imagen en Proceso</span>
                    </div>
                )}
                <button 
                    onClick={(e) => { e.preventDefault(); onToggleFav(); }}
                    className={`absolute top-0 right-0 w-12 h-12 flex items-center justify-center transition-all ${isFav ? 'bg-[#E8341A] text-white' : 'bg-slate-100 text-slate-300 hover:text-[#E8341A]'}`}
                >
                    <Heart size={18} fill={isFav ? 'currentColor' : 'none'} />
                </button>
            </div>
            <div className="flex-1 flex flex-col gap-4">
                <h3 className="text-[11px] font-black uppercase tracking-widest line-clamp-2 leading-tight group-hover:text-[#E8341A] transition-colors">{product.name}</h3>
                <div className="mt-auto pt-4 border-t border-slate-50 flex justify-between items-end">
                    <div>
                        <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mb-1">Precio Final</p>
                        <p className="text-[#E8341A] font-black text-2xl tracking-tighter">${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                    </div>
                    <Link href={`/web/product/${product.id}`} className="bg-black text-white p-3 hover:bg-[#E8341A] transition-all">
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        </div>
    )
}
