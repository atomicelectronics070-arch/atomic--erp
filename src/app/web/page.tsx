"use client"

import { useState, useEffect } from "react"
import { ShoppingBag, ChevronRight, Star, ArrowRight, Shield, Zap, Truck, Search, ShoppingCart, User, Download, ExternalLink, Power } from "lucide-react"
import { getProducts, getShopMetadata } from "@/lib/actions/shop"
import Link from "next/link"

export default function PublicWebPage() {
    const [products, setProducts] = useState<any[]>([])
    const [metadata, setMetadata] = useState<any>({ categories: [], collections: [] })
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [totalProducts, setTotalProducts] = useState(0)
    const itemsPerPage = 24

    useEffect(() => {
        const load = async () => {
            setLoading(true)
            const [productRes, m] = await Promise.all([
                getProducts({ page: currentPage, pageSize: itemsPerPage, search: searchQuery }),
                getShopMetadata()
            ])
            setProducts(productRes.products)
            setTotalProducts(productRes.total)
            setMetadata(m)
            setLoading(false)
        }
        load()
    }, [currentPage, searchQuery])

    const totalPages = Math.ceil(totalProducts / itemsPerPage)
    const paginatedProducts = products // Now coming paginated from server

    const featuredProducts = products.filter(p => p.featured).slice(0, 4)

    return (
        <div className="min-h-screen bg-white text-neutral-900 font-sans">
            {/* Minimalist Navbar */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center space-x-12">
                        <Link href="/web" className="text-2xl font-black tracking-tighter uppercase italic">
                            ATOMIC<span className="text-orange-600">.</span>
                        </Link>
                        <div className="hidden md:flex space-x-8 text-[11px] font-bold uppercase tracking-widest text-neutral-500">
                            <a href="#" className="text-orange-600 border-b-2 border-orange-600 pb-1">Inicio</a>
                            <a href="#productos" className="hover:text-neutral-800 transition-colors">Productos</a>
                            <a href="#categorias" className="hover:text-neutral-800 transition-colors">Categorías</a>
                            <a href="#" className="hover:text-neutral-800 transition-colors">Soporte</a>
                        </div>
                    </div>
                    <div className="flex items-center space-x-6">
                        <button className="text-neutral-400 hover:text-orange-600 transition-colors"><Search size={20} /></button>
                        <button className="text-neutral-400 hover:text-orange-600 transition-colors"><User size={20} /></button>
                        <div className="relative">
                            <button className="text-neutral-400 hover:text-orange-600 transition-colors"><ShoppingCart size={20} /></button>
                            <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[8px] font-black w-3.5 h-3.5 flex items-center justify-center rounded-none shadow-sm shadow-orange-200">0</span>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative bg-neutral-50 py-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center relative z-10">
                    <div className="md:w-1/2 space-y-6 text-center md:text-left">
                        <div className="inline-block bg-orange-600 text-white text-[10px] font-black uppercase tracking-[0.3em] px-4 py-1.5 mb-2">
                            Nueva Colección 2026
                        </div>
                        <h1 className="text-6xl md:text-8xl font-light text-neutral-800 tracking-tighter leading-[0.9]">
                            Tecnología <br /><span className="font-black text-neutral-900">Industial Pro</span>
                        </h1>
                        <p className="text-neutral-500 text-lg max-w-md mx-auto md:mx-0 font-medium">
                            Descubre la potencia de los equipos ATOMIC. Diseñados para un alto rendimiento y eficiencia máxima.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 pt-6">
                            <a href="#productos" className="bg-neutral-900 text-white px-10 py-5 text-xs font-bold uppercase tracking-widest hover:bg-orange-600 transition-all shadow-2xl shadow-neutral-200">
                                Explorar Catálogo
                            </a>
                            <button className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-neutral-800 group">
                                <span>Ver Video</span>
                                <div className="w-10 h-10 border border-neutral-200 rounded-none flex items-center justify-center group-hover:border-orange-600 transition-all">
                                    <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-neutral-800 border-b-[5px] border-b-transparent ml-1"></div>
                                </div>
                            </button>
                        </div>
                    </div>
                    <div className="md:w-1/2 mt-20 md:mt-0 relative group">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-orange-500/5 blur-[120px] rounded-full"></div>
                        <img
                            src="https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                            alt="Featured Product"
                            className="w-full max-w-md mx-auto relative z-10 shadow-3xl transform group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                    </div>
                </div>
            </section>

            {/* Features Bar */}
            <section className="bg-neutral-900 py-12">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
                    {[
                        { icon: <Truck />, title: "Envíos Gratis", desc: "Todo el país" },
                        { icon: <Shield />, title: "Garantía Total", desc: "Cobertura ATOMIC" },
                        { icon: <Zap />, title: "Pago Seguro", desc: "Confianza total" },
                        { icon: <Star />, title: "Soporte 24/7", desc: "Asistencia real" }
                    ].map((f, i) => (
                        <div key={i} className="flex items-center space-x-5 text-white/90">
                            <div className="text-orange-500">{f.icon}</div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest">{f.title}</p>
                                <p className="text-xs text-white/50">{f.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section id="categorias" className="py-24 max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16">
                    <div className="space-y-2">
                        <p className="text-orange-600 text-[10px] font-black uppercase tracking-[0.3em]">Explora</p>
                        <h2 className="text-4xl font-light text-neutral-800">Secciones <span className="font-black text-neutral-900">Industriales</span></h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {metadata.categories.slice(0, 3).map((cat: any, i: number) => (
                        <div key={cat.id} className="group relative h-96 overflow-hidden bg-neutral-100 cursor-pointer border border-neutral-100">
                            <div className="absolute inset-0 flex items-center justify-center bg-neutral-50 font-black text-neutral-100 text-9xl uppercase select-none opacity-20">
                                {cat.name[0]}
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent opacity-80"></div>
                            <div className="absolute bottom-8 left-8 right-8">
                                <h3 className="text-white text-2xl font-black uppercase mb-2">{cat.name}</h3>
                                <p className="text-white/60 text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">Explorar productos</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Featured Products */}
            <section id="productos" className="bg-neutral-50 py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center space-y-4 mb-16">
                        <p className="text-orange-600 text-[10px] font-black uppercase tracking-[0.3em]">Catálogo Real</p>
                        <h2 className="text-5xl font-light text-neutral-800">Equipos <span className="font-black text-neutral-900">Disponibles</span></h2>
                    </div>

                    {!loading && (
                        <div className="mb-12 max-w-2xl mx-auto relative group">
                            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-orange-600 transition-colors">
                                <Search size={20} />
                            </div>
                            <input
                                type="text"
                                placeholder="BUSCAR POR NOMBRE O CATEGORÍA..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value)
                                    setCurrentPage(1)
                                }}
                                className="w-full bg-white border-2 border-neutral-100 px-16 py-6 text-sm font-bold uppercase tracking-widest focus:outline-none focus:border-orange-600 transition-all shadow-xl shadow-neutral-100/50"
                            />
                        </div>
                    )}

                    {loading ? (
                        <div className="py-20 text-center animate-pulse">
                            <p className="font-black text-neutral-200 text-4xl uppercase tracking-widest">Cargando Catálogo...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {paginatedProducts.map((p) => (
                                <Link 
                                    key={p.id} 
                                    href={`/web/product/${p.id}`}
                                    className="bg-white group cursor-pointer border border-neutral-100 hover:border-orange-500/20 transition-all flex flex-col h-full hover:shadow-2xl shadow-neutral-100/50 hover:shadow-orange-100/20"
                                >
                                    <div className="aspect-square bg-neutral-50 relative overflow-hidden flex items-center justify-center p-8 border-b border-neutral-50">
                                        {(() => {
                                            try {
                                                const imageUrls = p.images ? JSON.parse(p.images) : [];
                                                return imageUrls.length > 0 ? (
                                                    <img
                                                        src={imageUrls[0]}
                                                        alt={p.name}
                                                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700 ease-out"
                                                    />
                                                ) : (
                                                    <div className="text-neutral-200 uppercase font-black text-[10px] text-center">Sin imagen</div>
                                                );
                                            } catch (e) {
                                                return <div className="text-neutral-200 uppercase font-black text-[10px] text-center">Error imagen</div>;
                                            }
                                        })()}
                                        {p.featured && (
                                            <div className="absolute top-4 right-4 bg-orange-600 text-white text-[8px] font-black uppercase px-2 py-1 shadow-lg">Destacado</div>
                                        )}
                                        <div className="absolute inset-x-0 bottom-0 bg-neutral-900 text-white py-4 text-[9px] font-black uppercase tracking-[0.3em] translate-y-full group-hover:translate-y-0 transition-transform flex items-center justify-center space-x-2">
                                            <span>Ver detalles pro</span> <ChevronRight size={12} />
                                        </div>
                                    </div>
                                    <div className="p-6 space-y-3 flex-1 flex flex-col group-hover:bg-neutral-50/50 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-black text-orange-600 uppercase tracking-[0.2em]">{p.category?.name || 'Varios'}</span>
                                            {p.specSheetUrl && <Download size={12} className="text-neutral-300" />}
                                        </div>
                                        <h4 className="text-xs font-black uppercase tracking-wide text-neutral-800 line-clamp-2 leading-[1.1] flex-1 group-hover:text-orange-600 transition-colors uppercase italic">{p.name}</h4>
                                        <div className="pt-4 border-t border-neutral-50 flex items-center justify-between">
                                            <p className="text-lg font-black text-neutral-900 font-mono tracking-tighter">${p.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                            {p.compareAtPrice && (
                                                <p className="text-[10px] text-neutral-300 line-through font-bold">${p.compareAtPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                            {totalProducts === 0 && (
                                <div className="col-span-4 py-20 text-center border-2 border-dashed border-neutral-100">
                                    <p className="font-black text-neutral-300 uppercase tracking-widest">No se encontraron productos</p>
                                </div>
                            )}
                        </div>
                    )}



                    {!loading && totalProducts > 0 && (
                        <div className="mt-24 flex flex-col items-center space-y-8">
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="w-12 h-12 flex items-center justify-center border-2 border-neutral-100 text-neutral-400 hover:border-orange-600 hover:text-orange-600 disabled:opacity-30 disabled:hover:border-neutral-100 disabled:hover:text-neutral-400 transition-all font-black"
                                >
                                    &lt;
                                </button>
                                
                                {[...Array(totalPages)].map((_, i) => {
                                    const page = i + 1;
                                    if (totalPages > 7) {
                                        if (page !== 1 && page !== totalPages && Math.abs(page - currentPage) > 1) {
                                            if (page === 2 || page === totalPages - 1) return <span key={page} className="text-neutral-300">...</span>;
                                            return null;
                                        }
                                    }

                                    return (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`w-12 h-12 flex items-center justify-center border-2 font-black text-xs transition-all ${
                                                currentPage === page 
                                                ? "bg-neutral-900 border-neutral-900 text-white shadow-lg shadow-neutral-200" 
                                                : "bg-white border-neutral-100 text-neutral-400 hover:border-orange-600 hover:text-orange-600"
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    );
                                })}

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="w-12 h-12 flex items-center justify-center border-2 border-neutral-100 text-neutral-400 hover:border-orange-600 hover:text-orange-600 disabled:opacity-30 disabled:hover:border-neutral-100 disabled:hover:text-neutral-400 transition-all font-black"
                                >
                                    &gt;
                                </button>
                            </div>
                            <p className="text-[10px] font-black text-neutral-300 uppercase tracking-widest">
                                Página {currentPage} de {totalPages} — {totalProducts} resultados
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* Newsletter */}
            <section className="bg-orange-600 py-24 relative overflow-hidden">
                <div className="absolute right-0 top-0 h-full w-1/3 bg-orange-500/20 -skew-x-12 translate-x-20"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 text-white">
                    <div className="max-w-xl space-y-4">
                        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">Únete a la <br />Comunidad ATOMIC</h2>
                        <p className="text-white/80 font-medium">Suscríbete para recibir ofertas exclusivas, lanzamientos de nuevos productos y consejos de tecnología industrial.</p>
                    </div>
                    <form className="w-full max-w-md flex flex-col sm:flex-row gap-4">
                        <input
                            type="email"
                            placeholder="Tu correo electrónico"
                            className="flex-1 bg-white/10 border-2 border-white/20 px-6 py-5 text-white placeholder-white/50 focus:outline-none focus:border-white transition-all font-bold"
                        />
                        <button className="bg-white text-orange-600 px-10 py-5 text-xs font-black uppercase tracking-widest shadow-2xl hover:bg-neutral-900 hover:text-white transition-all">
                            Suscribirme
                        </button>
                    </form>
                </div>
            </section>

            <footer className="bg-neutral-900 pt-24 pb-12 text-white border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 border-b border-white/5 pb-16">
                    <div className="space-y-8">
                        <span className="text-3xl font-black tracking-tighter uppercase italic">
                            ATOMIC<span className="text-orange-600">.</span>
                        </span>
                        <p className="text-sm text-white/50 leading-relaxed font-medium">
                            Líderes en tecnología industrial y soluciones de refrigeración avanzada para el mercado global.
                        </p>
                    </div>
                    {/* Simplified for demo */}
                    <div className="col-span-3 grid grid-cols-3">
                        <div className="space-y-6">
                            <h5 className="text-[11px] font-black uppercase tracking-[0.3em] text-orange-500">Corporativo</h5>
                            <ul className="space-y-4 text-sm text-white/40 font-bold uppercase text-[10px]">
                                <li>Nuestra Visión</li>
                                <li>Contacto</li>
                                <li>Trabaja con nosotros</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-6 pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] font-black uppercase text-white/20 tracking-widest">© 2026 INDUSTRIAS ATOMIC. Todos los derechos reservados.</p>
                    <a href="/dashboard" className="text-[10px] font-black uppercase text-neutral-600 hover:text-orange-600 flex items-center space-x-2 border-2 border-neutral-800 px-4 py-2 transition-all">
                        <Power size={12} /> <span>Acceso Sistema Interno</span>
                    </a>
                </div>
            </footer>
        </div>
    )
}
