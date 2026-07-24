"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, ChevronLeft, ChevronRight, ShoppingBag, Smartphone, Tablet } from "lucide-react"
import { calculateDiscountedPrice } from "@/lib/utils/pricing"
import { motion } from "framer-motion"

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

export default function MobileBlogPage() {
    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
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

    if (loading) return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin h-10 w-10 border-4 border-black border-t-transparent rounded-full" />
                <p className="text-[10px] font-black text-black uppercase tracking-[0.3em]">Cargando Catálogo Móvil...</p>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-white text-black font-sans pb-32">
            {/* Minimalist Navigation */}
            <nav className="border-b border-black/5 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/web" className="flex items-center gap-3 group text-black/50 hover:text-black transition-colors">
                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Volver a la Tienda</span>
                    </Link>
                    
                    <div className="relative w-full max-w-xs hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black/30" size={14} />
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Buscar dispositivo..."
                            className="w-full bg-slate-50 border-none pl-9 pr-4 py-2 text-xs rounded-full outline-none focus:ring-1 focus:ring-black transition-all"
                        />
                    </div>
                </div>
            </nav>

            {/* Editorial Hero */}
            <header className="max-w-7xl mx-auto px-6 pt-20 pb-16">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <h4 className="text-[#1e3a8a] text-[10px] font-black uppercase tracking-[0.4em] mb-6">El Ecosistema Móvil 2026</h4>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9] max-w-4xl mb-8">
                        DISEÑADOS PARA <br /> <span className="text-black/30">EL MAÑANA.</span>
                    </h1>
                    <p className="text-sm md:text-base font-medium text-black/60 max-w-2xl leading-relaxed">
                        Explora nuestra colección curada de smartphones y tablets. Desde la precisión quirúrgica del ecosistema Apple hasta la innovación desbordante de Samsung y Xiaomi. Encuentra el dispositivo que elevará tu productividad y creatividad al siguiente nivel.
                    </p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="mt-16 relative w-full aspect-[21/9] rounded-[2rem] overflow-hidden"
                >
                    <Image 
                        src="/assets/ecommerce/phones_banner.jpg"
                        alt="Editorial Phones"
                        fill
                        className="object-cover"
                    />
                </motion.div>
            </header>

            {/* The Catalog (Blog Style) */}
            <main className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex items-end justify-between border-b border-black/10 pb-4 mb-12">
                    <h2 className="text-2xl font-black tracking-tighter uppercase">Todos los Modelos</h2>
                    <span className="text-[10px] font-bold text-black/40 uppercase tracking-widest">{filtered.length} Dispositivos</span>
                </div>

                {filtered.length === 0 ? (
                    <div className="py-32 text-center border border-dashed border-black/10 rounded-[2rem]">
                        <Smartphone className="w-12 h-12 text-black/20 mx-auto mb-4" strokeWidth={1} />
                        <h2 className="text-sm font-bold text-black/40 uppercase tracking-widest mb-2">No se encontraron dispositivos</h2>
                        <button onClick={() => setSearch("")} className="mt-4 text-black font-black uppercase tracking-widest text-[10px] hover:underline">Ver todo el catálogo</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                        {filtered.map((p, i) => {
                            const imgs = safeParseArray(p.images)
                            const price = calculateDiscountedPrice(p.price, userRole)
                            return (
                                <motion.div 
                                    key={p.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
                                >
                                    <Link
                                        href={`/web/product/${p.id}`}
                                        className="group block"
                                    >
                                        <div className="relative bg-[#f8f9fa] rounded-3xl overflow-hidden aspect-[4/5] mb-6 flex items-center justify-center p-8 group-hover:bg-[#f1f3f5] transition-colors">
                                            {imgs.length > 0 ? (
                                                <img 
                                                    src={imgs[0]} 
                                                    alt={p.name} 
                                                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-700 ease-out" 
                                                    referrerPolicy="no-referrer"
                                                />
                                            ) : (
                                                <Smartphone size={40} className="text-black/20" />
                                            )}
                                        </div>
                                        
                                        <div>
                                            <h3 className="text-lg font-black tracking-tight text-black leading-snug mb-2 group-hover:text-[#1e3a8a] transition-colors">
                                                {p.name}
                                            </h3>
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-bold text-black/60">${price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-[#1e3a8a] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-4 group-hover:translate-x-0 duration-300">
                                                    Ver Detalles <ChevronRight size={12} />
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            )
                        })}
                    </div>
                )}
            </main>
        </div>
    )
}
