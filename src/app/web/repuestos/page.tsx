"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Search, ChevronLeft, ChevronRight, ShoppingBag, Cpu, Battery, Power, Settings, Monitor, Cable } from "lucide-react"
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

const PAGE_SIZE = 30

export default function SparePartsCatalogPage() {
    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)
    const [userRole, setUserRole] = useState<string | undefined>()

    useEffect(() => {
        const init = async () => {
            setLoading(true)
            try {
                const [pRes, sRes] = await Promise.all([
                    fetch("/api/web/products?pageSize=2000").then(r => r.json()),
                    fetch("/api/auth/session").then(r => r.json()).catch(() => null)
                ])
                setProducts(pRes.products || [])
                if (sRes?.user?.role) setUserRole(sRes.user.role)
            } catch(e) {
                console.error(e)
            }
            setLoading(false)
        }
        init()
    }, [])

    const filtered = useMemo(() => {
        const SPARE_KEYWORDS = [
            'cargador laptop', 'cargador para laptop', 'cargador notebook',
            'bateria laptop', 'bateria para laptop', 'batería laptop', 'batería para laptop',
            'flex laptop', 'cable flex', 'flex de video', 'flex pantalla',
            'pantalla laptop', 'screen laptop', 'display laptop', 'panel led laptop',
            'teclado laptop', 'keyboard laptop',
            'bisagra laptop', 'hinge laptop',
            'fan laptop', 'ventilador laptop', 'cooler laptop',
            'repuesto laptop', 'pin de carga', 'jack dc'
        ]

        let p = products.filter(x => {
            const name = x.name.toLowerCase()
            const category = (x.category?.name || '').toLowerCase()
            
            const isSpare = SPARE_KEYWORDS.some(kw => name.includes(kw))
            const isLaptopCat = category.includes('computacion') || category.includes('laptop') || category.includes('accesorio')

            return isSpare || (isLaptopCat && (name.includes('repuesto') || name.includes('reemplazo')))
        })

        if (search) {
            p = p.filter(x => x.name.toLowerCase().includes(search.toLowerCase()) || x.description?.toLowerCase().includes(search.toLowerCase()))
        }

        return p.sort((a, b) => a.name.localeCompare(b.name))
    }, [products, search])

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    if (loading) return (
        <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin h-10 w-10 border-4 border-[#1E3A8A] border-t-transparent rounded-full" />
                <p className="text-[10px] font-bold text-[#1E3A8A] uppercase tracking-[0.3em]">Sincronizando Catálogo de Repuestos...</p>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-[#F1F5F9] text-slate-900 font-sans pb-20">
            {/* ── Industrial Header ── */}
            <div className="bg-[#0F172A] text-white px-6 py-12 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                </div>
                
                <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-blue-600 p-2 rounded-none">
                                <Cpu size={24} className="text-white" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400">División Técnica de Hardware</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic leading-none mb-6">
                            DISTRIBUCIÓN <br /> <span className="text-blue-500">DE REPUESTOS</span>
                        </h1>
                        <p className="text-sm text-slate-400 font-bold uppercase tracking-widest max-w-xl">
                            Stock masivo de componentes para laptops: Pantallas, Baterías, Cargadores y Flex de video. Calidad OEM para laboratorios técnicos.
                        </p>
                    </div>

                    <div className="relative w-full md:w-[450px]">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                        <input
                            type="text"
                            value={search}
                            onChange={e => { setSearch(e.target.value); setPage(1); }}
                            placeholder="BUSCAR REPUESTO POR MODELO O SKU..."
                            className="w-full bg-white/5 border border-white/10 pl-16 pr-8 py-5 text-sm uppercase font-black tracking-widest outline-none focus:border-blue-500 focus:bg-white/10 transition-all rounded-none backdrop-blur-md"
                        />
                    </div>
                </div>
            </div>

            {/* ── Stats / Legend ── */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-8 overflow-x-auto hide-scrollbar whitespace-nowrap">
                        <div className="flex items-center gap-2">
                            <Monitor size={14} className="text-blue-600" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Pantallas</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Battery size={14} className="text-emerald-600" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Baterías</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Power size={14} className="text-orange-600" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Cargadores</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Cable size={14} className="text-purple-600" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Flex de Video</span>
                        </div>
                    </div>
                    <span className="hidden md:block text-[10px] font-black uppercase tracking-widest text-slate-300">Total Items: {filtered.length}</span>
                </div>
            </div>

            {/* ── Industrial Grid ── */}
            <main className="max-w-7xl mx-auto px-6 py-12">
                {paginated.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-40 text-center bg-white border-2 border-dashed border-slate-200">
                        <Settings className="w-16 h-16 text-slate-200 mb-6 animate-spin-slow" strokeWidth={1} />
                        <h2 className="text-lg font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Repuesto no encontrado</h2>
                        <p className="text-slate-300 text-[10px] font-bold uppercase tracking-widest max-w-xs mx-auto">Nuestro inventario de repuestos rota diariamente. Contacta con bodega para pedidos especiales.</p>
                        <button onClick={() => setSearch("")} className="mt-8 bg-[#1E3A8A] text-white px-8 py-4 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-blue-700 transition-all">Ver todo el inventario</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {paginated.map(p => {
                            const imgs = safeParseArray(p.images)
                            const price = calculateDiscountedPrice(p.price, userRole)
                            return (
                                <Link
                                    key={p.id}
                                    href={`/web/product/${p.id}`}
                                    className="group flex flex-col bg-white border border-slate-200 hover:border-blue-600 transition-all duration-300 shadow-sm hover:shadow-2xl relative"
                                >
                                    <div className="aspect-video relative bg-slate-50 flex items-center justify-center overflow-hidden border-b border-slate-100">
                                        {imgs.length > 0 ? (
                                            <img 
                                                src={imgs[0]} 
                                                alt={p.name} 
                                                className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500" 
                                                referrerPolicy="no-referrer"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-200 gap-2">
                                                <Cpu size={40} strokeWidth={1} />
                                            </div>
                                        )}
                                        <div className="absolute top-4 left-4 bg-slate-900/10 backdrop-blur-md px-2 py-1 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-blue-600 animate-pulse" />
                                            <span className="text-[8px] font-black text-slate-900 uppercase tracking-widest">In Stock</span>
                                        </div>
                                    </div>
                                    
                                    <div className="p-6 flex flex-col flex-1">
                                        <div className="mb-2">
                                            <span className="text-[8px] font-black text-blue-600 uppercase tracking-[0.3em] bg-blue-50 px-2 py-1">Repuesto OEM</span>
                                        </div>
                                        <h3 className="text-[12px] font-black text-slate-800 uppercase tracking-tight line-clamp-2 leading-tight mb-4 group-hover:text-blue-600 transition-colors">{p.name}</h3>
                                        
                                        <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                                            <div>
                                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Precio Distribución</p>
                                                <p className="text-xl font-black text-[#1E3A8A] tracking-tighter">${price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                                            </div>
                                            <div className="w-10 h-10 bg-slate-900 text-white flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                                                <ShoppingBag size={18} />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Industrial accent */}
                                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-slate-100 group-hover:bg-blue-600 transition-all" />
                                </Link>
                            )
                        })}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-20 flex items-center justify-center gap-4">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-6 py-4 bg-white border border-slate-200 font-black uppercase text-[10px] tracking-widest text-slate-400 hover:text-blue-600 disabled:opacity-40 transition-all"
                        >
                            Anterior
                        </button>
                        <div className="flex gap-2">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).filter(p => Math.abs(p - page) <= 1 || p === 1 || p === totalPages).map((p, i, arr) => (
                                <button
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className={`w-12 h-12 text-xs font-black transition-all ${
                                        page === p ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-500 hover:border-blue-600'
                                    }`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="px-6 py-4 bg-white border border-slate-200 font-black uppercase text-[10px] tracking-widest text-slate-400 hover:text-blue-600 disabled:opacity-40 transition-all"
                        >
                            Siguiente
                        </button>
                    </div>
                )}
            </main>
        </div>
    )
}
