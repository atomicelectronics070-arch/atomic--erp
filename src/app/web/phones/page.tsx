"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Search, ChevronLeft, ChevronRight, ShoppingBag, Smartphone, Tablet } from "lucide-react"
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

const PAGE_SIZE = 24

export default function MobileCatalogPage() {
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
                    fetch("/api/web/products?pageSize=1000").then(r => r.json()),
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
        const PHONE_BRANDS = ['samsung', 'iphone', 'xiaomi', 'oppo', 'motorola', 'redmi', 'realme', 'honor', 'infinix', 'tecno', 'ipad', 'apple']
        const DEVICE_INDICATORS = ['gb', 'ram', 'inch', 'display', 'pantalla', 'sim', 'dual', 'android', 'ios', '4g', '5g', 'lte', 'snapdragon', 'helio', 'dimensity']
        const PURE_ACCESSORY_KEYWORDS = ['funda para', 'estuche para', 'case for', 'mica de', 'protector de', 'cargador para', 'cable usb', 'repuesto', 'bateria para', 'batería para', 'teclado', 'keyboard', 'mouse', 'raton', 'ratón', 'banco de poder', 'power bank', 'powerbank', 'audifonos', 'audífono', 'cargador original']

        let p = products.filter(x => {
            const name = x.name.toLowerCase()
            const category = (x.category?.name || '').toLowerCase()
            
            if (PURE_ACCESSORY_KEYWORDS.some(kw => name.includes(kw))) return false
            
            const hasBrand = PHONE_BRANDS.some(brand => name.includes(brand))
            const hasSpecs = DEVICE_INDICATORS.some(spec => name.includes(spec))
            const isPhoneCategory = category.includes('celular') || category.includes('tablet') || category.includes('telef')

            if (hasBrand && hasSpecs) return true
            if (isPhoneCategory && hasBrand) return true

            if (name.includes('iphone') || name.includes('ipad')) {
                if (name.includes('cable') || name.includes('cargador') || name.includes('adapter')) return false
                return true
            }
            return false
        })

        if (search) {
            p = p.filter(x => x.name.toLowerCase().includes(search.toLowerCase()) || x.description?.toLowerCase().includes(search.toLowerCase()))
        }

        return p.sort((a, b) => a.name.localeCompare(b.name))
    }, [products, search])

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    if (loading) return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin h-10 w-10 border-4 border-[#1E3A8A] border-t-transparent rounded-full" />
                <p className="text-[10px] font-bold text-[#1E3A8A] uppercase tracking-[0.3em]">Cargando Catálogo Mobile...</p>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans pb-20">
            {/* Header / Search */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-40 backdrop-blur-md px-6 py-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-4">
                        <Link href="/web" className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-[#1E3A8A]">
                            <ChevronLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-xl font-black text-[#1E3A8A] uppercase tracking-tighter">
                                CELULARES <span className="text-blue-600">Y TABLETS</span>
                            </h1>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">{filtered.length} Dispositivos Encontrados</p>
                        </div>
                    </div>

                    <div className="relative w-full md:w-[450px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input
                            type="text"
                            value={search}
                            onChange={e => { setSearch(e.target.value); setPage(1); }}
                            placeholder="Buscar por modelo o marca..."
                            className="w-full bg-slate-50 border border-slate-200 pl-12 pr-6 py-3.5 text-sm rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-all shadow-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Grid */}
            <main className="max-w-7xl mx-auto px-6 py-10">
                {paginated.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-40 text-center bg-white border border-dashed border-slate-200 rounded-3xl">
                        <Smartphone className="w-16 h-16 text-slate-100 mb-6" strokeWidth={1} />
                        <h2 className="text-lg font-bold text-slate-400 uppercase tracking-widest mb-2">No se encontraron dispositivos</h2>
                        <p className="text-slate-300 text-sm max-w-xs mx-auto">Prueba ajustando tu búsqueda o contacta con un asesor para consultar stock.</p>
                        <button onClick={() => setSearch("")} className="mt-8 text-blue-600 font-bold uppercase tracking-widest text-[10px] hover:underline">Ver todo el catálogo móvil</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {paginated.map(p => {
                            const imgs = safeParseArray(p.images)
                            const price = calculateDiscountedPrice(p.price, userRole)
                            return (
                                <Link
                                    key={p.id}
                                    href={`/web/product/${p.id}`}
                                    className="group flex flex-col bg-white border border-slate-200 hover:border-blue-400 hover:shadow-2xl transition-all duration-500 rounded-2xl overflow-hidden"
                                >
                                    <div className="aspect-square relative bg-slate-50 flex items-center justify-center overflow-hidden border-b border-slate-100">
                                        {imgs.length > 0 ? (
                                            <img 
                                                src={imgs[0]} 
                                                alt={p.name} 
                                                className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500" 
                                                referrerPolicy="no-referrer"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-200 gap-2">
                                                <Smartphone size={32} />
                                                <span className="text-[8px] font-bold uppercase">Sin Imagen</span>
                                            </div>
                                        )}
                                        {p.price > 1000 && (
                                            <div className="absolute top-3 right-3 bg-blue-600 text-white text-[8px] font-black px-2 py-1 rounded-full shadow-lg uppercase tracking-widest">Premium</div>
                                        )}
                                    </div>
                                    <div className="p-4 flex flex-col flex-1">
                                        <p className="text-[11px] font-semibold text-slate-600 line-clamp-2 leading-relaxed group-hover:text-blue-600 transition-colors flex-1 mb-3">{p.name}</p>
                                        <div className="flex items-center justify-between mt-auto">
                                            <p className="text-sm font-black text-[#1E3A8A] bg-blue-50 px-2 py-1 rounded-lg">${price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-16 flex items-center justify-center gap-3">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 disabled:opacity-40 transition-all shadow-sm"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <div className="flex gap-2">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).filter(p => Math.abs(p - page) <= 2 || p === 1 || p === totalPages).map((p, i, arr) => (
                                <>
                                    {i > 0 && arr[i-1] !== p - 1 && <span className="text-slate-300 self-end mb-2">...</span>}
                                    <button
                                        key={p}
                                        onClick={() => setPage(p)}
                                        className={`w-12 h-12 rounded-xl text-xs font-bold transition-all shadow-sm ${
                                            page === p ? 'bg-[#1E3A8A] text-white' : 'bg-white border border-slate-200 text-slate-500 hover:border-blue-400 hover:text-blue-600'
                                        }`}
                                    >
                                        {p}
                                    </button>
                                </>
                            ))}
                        </div>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 disabled:opacity-40 transition-all shadow-sm"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                )}
            </main>
        </div>
    )
}
