"use client"

// Version: 1.0.2 - Fixed Broken Images System
import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { ShoppingBag, ChevronRight, ArrowRight, Shield, Zap, Truck, ChevronLeft, Hexagon, Star, X, Smartphone, Database, Sparkles, Code, Bot, Download, Search, ImageOff, AlertCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { calculateDiscountedPrice } from "@/lib/utils/pricing"
import SpyCameraBanner from "@/components/web/SpyCameraBanner"
import SmartIntercomBanner from "@/components/web/SmartIntercomBanner"

// Enhanced cleaning for damaged image data
const safeParseArray = (str: any, fallback: any = []) => {
    if (!str || str === 'null' || str === '[]' || str === '') return fallback;
    if (Array.isArray(str)) return str.length > 0 ? str : fallback;
    if (typeof str === 'string') {
        const trimmed = str.trim();
        // Check if it's a direct URL
        if (trimmed.startsWith('http') || trimmed.startsWith('/') || trimmed.startsWith('data:image')) return [trimmed];
        try {
            let cleaned = trimmed;
            // Clean quoted strings
            if (cleaned.startsWith('"') && cleaned.endsWith('"')) cleaned = cleaned.substring(1, cleaned.length - 1).replace(/\\"/g, '"');
            let parsed = JSON.parse(cleaned);
            if (typeof parsed === 'string') { try { parsed = JSON.parse(parsed); } catch(e) {} }
            if (Array.isArray(parsed)) return parsed.length > 0 ? parsed : fallback;
            if (typeof parsed === 'string' && parsed.length > 0) return [parsed];
        } catch (e) {
            // Regex to extract URLs from damaged strings (e.g. text containing URLs without valid JSON structure)
            const urlRegex = /(https?:\/\/[^\s"\]]+)/g;
            const matches = trimmed.match(urlRegex);
            if (matches && matches.length > 0) return matches;
        }
    }
    return fallback;
};

/* ─── Robust Image Component with Fallback ─── */
function SafeImage({ src, alt, className, fill = false, width, height, ...props }: any) {
    const [error, setError] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const imgRef = useRef<HTMLImageElement>(null)

    useEffect(() => {
        // If image is already in cache, it might be complete before React mounts
        if (imgRef.current?.complete) {
            setIsLoading(false)
        }
    }, [src])

    const handleLoad = () => {
        setIsLoading(false)
    }

    const handleError = () => {
        setIsLoading(false)
        setError(true)
    }

    if (!src || error) {
        return (
            <div className={`flex flex-col items-center justify-center bg-slate-100 border border-slate-200 p-4 ${className} ${fill ? 'absolute inset-0' : ''}`}>
                <div className="relative">
                    <Hexagon className="text-slate-200 w-12 h-12 animate-[spin_20s_linear_infinite]" strokeWidth={1} />
                    <ImageOff className="absolute inset-0 m-auto text-slate-300" size={18} />
                </div>
                <span className="text-[7px] font-bold text-slate-400 uppercase tracking-widest mt-2">No disponible</span>
            </div>
        )
    }

    return (
        <div className={`relative overflow-hidden bg-slate-50 ${fill ? 'absolute inset-0 w-full h-full' : ''} ${className}`}>
            <img
                ref={imgRef}
                src={src}
                alt={alt}
                onLoad={handleLoad}
                onError={handleError}
                className={`transition-all duration-700 ${isLoading ? 'scale-110 blur-xl opacity-0' : 'scale-100 blur-0 opacity-100'} ${fill ? 'w-full h-full object-contain' : ''}`}
                style={{ width: fill ? '100%' : width, height: fill ? '100%' : height }}
                referrerPolicy="no-referrer"
                {...props}
            />
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-50/50 backdrop-blur-sm">
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
            )}
        </div>
    )
}

/* ─── Phone Catalog Horizontal Strip ─── */
function PhoneCatalogStrip({ products, userRole }: { products: any[], userRole?: string }) {
    const scrollRef = useRef<HTMLDivElement>(null)
    const PHONE_BRANDS = ['samsung', 'iphone', 'xiaomi', 'oppo', 'motorola', 'redmi', 'realme', 'honor', 'infinix', 'tecno', 'ipad', 'apple']
    const DEVICE_INDICATORS = ['gb', 'ram', 'inch', 'display', 'pantalla', 'sim', 'dual', 'android', 'ios', '4g', '5g', 'lte', 'snapdragon', 'helio', 'dimensity']
    const PURE_ACCESSORY_KEYWORDS = [
        'funda para', 'estuche para', 'case for', 'mica de', 'protector de', 
        'cargador para', 'cable usb', 'repuesto', 'bateria para', 'batería para',
        'teclado', 'keyboard', 'mouse', 'raton', 'ratón', 'banco de poder', 
        'power bank', 'powerbank', 'audifonos', 'audífono', 'cargador original'
    ]

    const phones = products.filter(p => {
        const name = p.name.toLowerCase()
        const category = (p.category?.name || '').toLowerCase()
        
        // 1. Si es explícitamente un accesorio o periférico, excluir
        if (PURE_ACCESSORY_KEYWORDS.some(kw => name.includes(kw))) return false
        
        // 2. Heurística de dispositivo móvil
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

    if (phones.length === 0) return null

    const scroll = (dir: 'left' | 'right') => {
        if (!scrollRef.current) return
        scrollRef.current.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' })
    }

    return (
        <section className="py-10 border-t border-slate-100" id="celulares">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="mb-5 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-[#1E3A8A] uppercase tracking-widest">
                            CATÁLOGO DE <span className="font-bold text-blue-600">CELULARES Y TABLETS</span>
                        </h2>
                        <p className="text-slate-400 text-[10px] mt-1 uppercase tracking-[0.3em] font-medium">Samsung · iPhone · Xiaomi · OPPO y más</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={() => scroll('left')} className="w-8 h-8 flex items-center justify-center border border-slate-200 bg-white hover:border-blue-600 hover:text-blue-600 text-slate-400 rounded-lg transition-all shadow-sm">
                            <ChevronLeft size={15} />
                        </button>
                        <button onClick={() => scroll('right')} className="w-8 h-8 flex items-center justify-center border border-slate-200 bg-white hover:border-blue-600 hover:text-blue-600 text-slate-400 rounded-lg transition-all shadow-sm">
                            <ChevronRight size={15} />
                        </button>
                        <Link href="/web/phones" className="text-[10px] font-semibold text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-1 uppercase tracking-widest">
                            Ver todos <ArrowRight size={12} />
                        </Link>
                    </div>
                </div>

                {/* Horizontal Scroll Strip */}
                <div
                    ref={scrollRef}
                    className="flex gap-3 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent"
                    style={{ scrollbarWidth: 'thin' }}
                >
                    {phones.map((p: any) => {
                        const imgs = safeParseArray(p.images)
                        const price = calculateDiscountedPrice(p.price, userRole)
                        return (
                            <Link
                                key={p.id}
                                href={`/web/product/${p.id}`}
                                className="flex-none w-[120px] flex flex-col bg-white border border-slate-100 hover:border-blue-400 hover:shadow-md transition-all duration-200 rounded-xl overflow-hidden group"
                            >
                                <div className="w-full h-[100px] relative bg-slate-50 overflow-hidden">
                                    {imgs.length > 0 ? (
                                        <SafeImage src={imgs[0]} alt={p.name} fill className="object-contain p-2 group-hover:scale-105 transition-transform duration-300" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Smartphone className="text-slate-200 w-8 h-8" />
                                        </div>
                                    )}
                                </div>
                                <div className="p-2 flex flex-col flex-1">
                                    <p className="text-[9px] font-medium text-slate-500 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors flex-1 mb-1">{p.name}</p>
                                    <p className="text-[10px] font-bold text-slate-900">${price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

interface PublicWebClientProps {
    initialProducts: any[]
    metadata: { categories: any[], collections: any[] }
    userRole?: string
    storeSettings?: any
}

export default function PublicWebClient({ initialProducts, metadata, userRole, storeSettings }: PublicWebClientProps) {
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

    // ─── ATOMIC REORGANIZATION LOGIC ───
    const curatedCategories = useMemo(() => {
        const EXCLUDE = ['domotica', 'automatizacion', 'tienda en linea a medida', 'tecnologia residencial', 'soft3 logustucs'];
        let base = metadata.categories.filter(c => {
            const n = (c.name || '').toLowerCase();
            return !EXCLUDE.some(ex => n.includes(ex));
        });
        return base.map(c => {
            let nc = { ...c };
            if (nc.name.toLowerCase().includes('electronica para negocios movilidad a deportes')) nc.name = "Movilidad y Deportes";
            return nc;
        }).sort((a, b) => {
            if (a.name.toLowerCase().includes('accesorios y varios')) return 1;
            if (b.name.toLowerCase().includes('accesorios y varios')) return -1;
            return 0;
        });
    }, [metadata.categories]);

    const curatedCollections = useMemo(() => {
        const EXCLUDE = ['domotica', 'tienda-en-linea-a-medida', 'tecnologia-residencial', 'soft3-logustucs'];
        let base = metadata.collections.filter(c => {
            const s = (c.slug || '').toLowerCase();
            const n = (c.name || '').toLowerCase();
            return !EXCLUDE.some(ex => s.includes(ex) || n.includes(ex));
        });
        return base.map(c => {
            let nc = { ...c };
            const lowName = nc.name.toLowerCase();
            if (lowName.includes('automatizacion')) nc.name = "Barreras Vehiculares";
            if (lowName.includes('electronica para negocios movilidad a deportes')) nc.name = "Movilidad y Deportes";
            return nc;
        }).sort((a, b) => {
            if (a.name.toLowerCase().includes('accesorios y varios')) return 1;
            if (b.name.toLowerCase().includes('accesorios y varios')) return -1;
            return 0;
        });
    }, [metadata.collections]);

    const getCuratedProducts = (col: any) => {
        const slug = col.slug.toLowerCase();
        const colName = col.name.toLowerCase();
        
        // Determinar si es una sección "especial" que requiere búsqueda global
        const isSpecialSection = 
            colName.includes('barreras') || colName.includes('celulares') || 
            colName.includes('computacion') || colName.includes('cerraduras') || 
            colName.includes('consolas') || colName.includes('energia') || 
            colName.includes('iluminacion') || colName.includes('movilidad') || 
            colName.includes('deportes') || colName.includes('repuestos') || 
            colName.includes('porteria') || colName.includes('desarrollo') || 
            colName.includes('branding') || colName.includes('servicios') ||
            colName.includes('ambientes');

        // Si es especial, buscamos en TODO el set de productos iniciales. Si no, solo en su colección.
        let products = isSpecialSection ? [...initialProducts] : initialProducts.filter(p => p.collectionId === col.id);

        if (colName.includes('acabados tipo marmol')) {
            products = products.filter(p => {
                const n = p.name.toLowerCase();
                return !n.includes('papel aluminio') && !n.includes('sierra de marmol industrial');
            });
        }
        else if (colName.includes('ambientes') || colName.includes('hambientes')) {
            const extra = initialProducts.filter(p => {
                const n = p.name.toLowerCase();
                const prov = (p.provider || '').toLowerCase();
                return n.includes('calefactor') && (prov.includes('bp') || prov.includes('banco del perno'));
            });
            products = [...new Set([...products, ...extra])];
        }
        else if (colName.includes('barreras vehiculares')) {
            const extra = initialProducts.filter(p => {
                const n = p.name.toLowerCase();
                return n.includes('motor de garaje') || n.includes('motor batiente') || n.includes('barrera vehicular') || n.includes('barrera');
            });
            products = [...new Set([...products, ...extra])];
        }
        else if (slug.includes('utp') || colName.includes('utp')) {
            products = initialProducts.filter(p => (p.provider || '').toLowerCase().includes('fabricable'));
        }
        else if (colName.includes('celulares') || colName.includes('computacion')) {
            const isDevice = (n: string) => {
                const ln = n.toLowerCase();
                return ln.includes('samsung') || ln.includes('iphone') || ln.includes('tablet') || 
                       ln.includes('ipad') || ln.includes('laptop') || ln.includes('computadora') ||
                       ln.includes('portatil') || ln.includes('portátil');
            };
            products = initialProducts.filter(p => {
                const n = p.name.toLowerCase();
                if (['funda', 'case', 'cargador', 'cable', 'mouse', 'teclado'].some(x => n.includes(x))) return false;
                return isDevice(n);
            });
        }
        else if (colName.includes('cerraduras') || colName.includes('chapa')) {
            products = initialProducts.filter(p => {
                const n = p.name.toLowerCase();
                return n.includes('cerradura') || n.includes('acceso smart') || n.includes('chapa') || n.includes('cerradura smart');
            });
        }
        else if (colName.includes('consolas') || colName.includes('video juegos')) {
            products = initialProducts.filter(p => {
                const n = p.name.toLowerCase();
                return n.includes('playstation') || n.includes('play station') || n.includes('video juego') || 
                       n.includes('videojuego') || n.includes('consola') || n.includes('control') || n.includes('joistick') || n.includes('joystick');
            });
        }
        else if (colName.includes('energia') || colName.includes('energía')) {
            products = initialProducts.filter(p => p.name.toLowerCase().includes('generador'));
        }
        else if (colName.includes('iluminacion') || colName.includes('iluminación')) {
            products = initialProducts.filter(p => {
                const n = p.name.toLowerCase();
                const prov = (p.provider || '').toLowerCase();
                const isLuminaria = n.includes('luminaria') || n.includes('lampara') || n.includes('lámpara');
                return isLuminaria && (prov.includes('bp') || prov.includes('banco del perno'));
            });
        }
        else if (colName.includes('movilidad') || colName.includes('deportes')) {
            products = initialProducts.filter(p => {
                const n = p.name.toLowerCase();
                return n.includes('drone') || n.includes('bicicleta') || n.includes('dron');
            });
        }
        else if (colName.includes('repuestos') || colName.includes('laptop')) {
            products = initialProducts.filter(p => {
                const n = p.name.toLowerCase();
                return n.includes('cargador') || n.includes('bateria') || n.includes('batería') || 
                       n.includes('teclado') || n.includes('ventilador') || n.includes('cable');
            });
        }
        else if (colName.includes('porteria') || colName.includes('portería')) {
            products = initialProducts.filter(p => {
                const n = p.name.toLowerCase();
                return n.includes('portero') || n.includes('video portero') || n.includes('videoportero');
            });
        }
        else if (colName.includes('desarrollo web')) {
            products = [{ id: 'v-web-1', name: 'TU TIENDA EN LÍNEA (PLANES)', description: 'Plan $99 / Plan $199 / Plan $299', price: 99, images: '[]', featured: true }];
        }
        else if (colName.includes('diseño') || colName.includes('branding')) {
            products = [
                { id: 'v-d-1', name: 'ESTRATEGIA DE MARKETING', price: 150, description: 'Planes: Trimestral, Semestral, Anual.', images: '[]' },
                { id: 'v-d-2', name: 'ELABORACIÓN DE CONTENIDOS', price: 80, description: 'Planes: Trimestral, Semestral, Anual.', images: '[]' },
                { id: 'v-d-3', name: 'DISEÑO GRÁFICO', price: 60, description: 'Planes: Trimestral, Semestral, Anual.', images: '[]' },
                { id: 'v-d-4', name: 'DISEÑO DE MARCA', price: 200, description: 'Planes: Trimestral, Semestral, Anual.', images: '[]' }
            ];
        }
        else if (colName.includes('servicios')) {
            products = [
                { id: 'v-s-1', name: 'VISITA TÉCNICA', price: 25, description: 'Soporte presencial.', images: '[]' },
                { id: 'v-s-2', name: 'DIAGNÓSTICO TÉCNICO', price: 45, description: 'Evaluación técnica.', images: '[]' },
                { id: 'v-s-3', name: 'INSTALACIÓN POR PUNTO', price: 10, description: 'Desde $10 a $35.', images: '[]' }
            ];
        }

        return products.slice(0, 10);
    };

    const featuredProducts = (() => {
        let consolasCount = 0;
        const sorted = [...initialProducts].sort((a, b) => {
            const aIsSpy = a.name.toLowerCase().includes('espia') || a.name.toLowerCase().includes('espía') || a.name.startsWith('CE-');
            const bIsSpy = b.name.toLowerCase().includes('espia') || b.name.toLowerCase().includes('espía') || b.name.startsWith('CE-');
            if (aIsSpy && !bIsSpy) return -1;
            if (!aIsSpy && bIsSpy) return 1;
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

        return sorted.filter(p => {
            const text = `${p.name} ${p.description || ''} ${p.category?.name || ''}`.toLowerCase();
            const isComputer = text.includes('computadora') || text.includes('laptop') || text.includes('mini pc');
            if (isComputer) return false;
            const isConsole = text.includes('playstation') || text.includes('ps5');
            const isTech = text.includes('espia') || text.includes('espía') || p.name.startsWith('CE-');
            if (isConsole) { if (consolasCount < 1) { consolasCount++; return true; } return false; }
            return p.featured || isTech;
        }).slice(0, 32);
    })();

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-[#1E3A8A]/20 pb-20 font-sans">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>

                {/* 1. CATEGORÍAS */}
                <CategoriesBanner categories={curatedCategories} />


                {/* 2. PRODUCTOS DESTACADOS */}
                <section className="py-12" id="destacados">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="mb-6 flex items-end justify-between">
                            <div>
                                <h2 className="text-xl font-semibold text-[#1E3A8A] uppercase tracking-widest">
                                    PRODUCTOS <span className="font-bold text-blue-600">DESTACADOS</span>
                                </h2>
                                <p className="text-slate-400 text-[10px] mt-1 uppercase tracking-[0.3em] font-medium">Selección Premium</p>
                            </div>
                            <Link href="/web/products" className="text-[10px] font-semibold text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-1 uppercase tracking-widest">
                                Ver todos <ArrowRight size={12} />
                            </Link>
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                                {featuredProducts.slice(0, 32).map((p: any, i: number) => (
                                    <MiniProductCard key={p.id} product={p} userRole={userRole} delay={i * 0.03} />
                                ))}
                        </div>
                    </div>
                </section>

                {/* BANNERS — after featured, contained boxes */}
                <div className="max-w-7xl mx-auto px-6 pb-2 flex flex-col gap-4">
                    {/* Move the Whatsapp images HeroBanner here as well */}
                    <div className="rounded-xl overflow-hidden border border-slate-100 shadow-sm">
                        <HeroBanner settings={storeSettings} />
                    </div>
                    <div className="rounded-xl overflow-hidden border border-slate-100 shadow-sm" style={{maxHeight: '380px'}}>
                        <SpyCameraBanner />
                    </div>
                    <div className="rounded-xl overflow-hidden border border-slate-100 shadow-sm" style={{maxHeight: '380px'}}>
                        <SmartIntercomBanner />
                    </div>
                </div>

                {/* CATALÓGO DE CELULARES — horizontal scroll strip */}
                <PhoneCatalogStrip products={initialProducts} userRole={userRole} />

                {/* 3. TIENDA PÚBLICA */}
                <section className="py-20 border-t border-slate-200" id="productos">
                    <div className="max-w-7xl mx-auto px-6 mb-12">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
                            <div className="space-y-2">
                                <h2 className="text-3xl md:text-5xl font-black text-[#1E3A8A] uppercase tracking-tighter italic">
                                    NUESTROS <span className="text-blue-600">PRODUCTOS</span>
                                </h2>
                                <p className="text-slate-400 text-[10px] uppercase tracking-[0.4em] font-bold">Catálogo de Alta Precisión</p>
                            </div>

                            <div className="relative group w-full md:w-[400px]">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-blue-600 transition-colors" size={18} />
                                <input 
                                    type="text" 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Buscar por nombre, marca o categoría..."
                                    className="w-full bg-white border border-slate-200 rounded-none p-4 pl-12 pr-24 text-sm uppercase tracking-widest placeholder:text-slate-300 focus:border-[#1E3A8A] focus:bg-slate-50 transition-all outline-none"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-4">
                                    <div className="hidden sm:block px-2 py-0.5 bg-blue-50 border border-blue-100 rounded-none">
                                        <span className="text-[8px] font-black text-[#1E3A8A] uppercase tracking-widest">{filteredProducts.length} Items</span>
                                    </div>
                                    {searchQuery && (
                                        <button 
                                            onClick={() => setSearchQuery("")}
                                            className="text-slate-400 hover:text-[#1E3A8A] transition-colors"
                                        >
                                            <X size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {searchQuery ? (
                            filteredProducts.length === 0 ? (
                                <div className="py-20 text-center border border-dashed border-slate-200 rounded-none">
                                    <p className="text-slate-400 text-[10px] uppercase tracking-[0.3em] font-black">No se encontraron productos para "{searchQuery}"</p>
                                    <button onClick={() => setSearchQuery("")} className="mt-4 text-[#1E3A8A] text-[10px] font-black uppercase tracking-widest hover:underline">Limpiar Búsqueda</button>
                                </div>
                            ) : (
                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                        {filteredProducts.map((p: any, i: number) => (
                                            <MiniProductCard key={p.id} product={p} userRole={userRole} delay={i * 0.02} />
                                        ))}
                                    </div>
                            )
                        ) : (
                            <InfiniteProductScroll products={filteredProducts} userRole={userRole} />
                        )}
                    </div>
                </section>

                {/* 4. BANNER ACADEMY */}
                <section className="py-16 border-y border-slate-200 bg-slate-50">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xl relative flex flex-col md:flex-row">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="flex-1 p-10 md:p-14 flex flex-col justify-center"
                            >
                                <div className="flex items-center gap-2 text-blue-600 mb-4">
                                    <Zap size={13} className="animate-pulse" />
                                    <span className="text-[10px] font-semibold uppercase tracking-[0.3em]">PLATAFORMA EDUCATIVA</span>
                                </div>
                                <h2 className="text-4xl md:text-5xl font-light text-[#1E3A8A] uppercase tracking-tight mb-4">
                                    ATOMIC <span className="font-bold text-blue-700">ACADEMY</span>
                                </h2>
                                <p className="text-slate-500 text-sm leading-relaxed max-w-lg mb-8 font-normal">
                                    Certificaciones técnicas de alto nivel. Aprenda de los expertos y potencie su carrera profesional con el ecosistema Atomic.
                                </p>
                                <div className="flex gap-4">
                                    <Link href="/web/academy">
                                        <button className="bg-[#1E3A8A] text-white px-8 py-3 rounded-lg font-semibold uppercase tracking-widest text-[10px] hover:bg-blue-800 hover:-translate-y-0.5 transition-all shadow-lg">Acceder a Cursos</button>
                                    </Link>
                                    <button className="border border-slate-200 text-slate-500 bg-slate-50 px-8 py-3 rounded-lg font-semibold uppercase tracking-widest text-[10px] hover:bg-slate-100 hover:text-slate-900 transition-all">Ver Temario</button>
                                </div>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                className="w-full md:w-2/5 relative min-h-[220px] bg-gradient-to-br from-[#1E3A8A] to-blue-900 flex flex-col items-center justify-center p-10 overflow-hidden border-l border-slate-200"
                            >
                                <Hexagon size={80} className="text-blue-500/10 absolute scale-[3] animate-[spin_60s_linear_infinite]" strokeWidth={0.5} />
                                <div className="relative z-10 text-center">
                                    <div className="text-2xl font-bold text-white tracking-tight mb-2 italic">NUEVOS CURSOS</div>
                                    <div className="text-[10px] font-semibold text-blue-100 uppercase tracking-[0.4em] bg-blue-950/30 px-4 py-2 rounded-full border border-blue-500/30">Disponibles Ahora</div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* 5. COLECCIONES CURADAS */}
                <div className="py-16 max-w-7xl mx-auto px-6 space-y-16">
                    {curatedCollections.map((col: any, idx: number) => {
                        const bProducts = getCuratedProducts(col);
                        if (bProducts.length === 0) return null;
                        return (
                            <CollectionBanner key={col.id} collection={col} products={bProducts} reverse={idx % 2 !== 0} userRole={userRole} />
                        )
                    })}
                </div>

                {/* 6. SOFTWARE & WEB SHOWCASE */}
                <section id="demos" className="py-20 max-w-7xl mx-auto px-6">
                    <WebShowcase />
                </section>

                {/* 7. FEATURES BAR */}
                <section className="py-10 border-t border-slate-200 mt-8">
                    <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { icon: <Truck size={16} />, title: "Logística Global", desc: "Envíos rápidos", color: '#1E3A8A' },
                            { icon: <Shield size={16} />, title: "Seguridad", desc: "Garantía total", color: '#2563EB' },
                            { icon: <Zap size={16} />, title: "Rapidez", desc: "Pago en 1-Click", color: '#1E3A8A' },
                            { icon: <Star size={16} />, title: "Soporte", desc: "Asistencia VIP", color: '#2563EB' }
                        ].map((f, i) => (
                            <div key={i} className="flex items-center space-x-3">
                                <div style={{ color: f.color }} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 shrink-0">{f.icon}</div>
                                <div>
                                    <p className="text-[11px] font-semibold uppercase tracking-widest text-[#1E3A8A]">{f.title}</p>
                                    <p className="text-[10px] text-slate-400 font-normal mt-0.5">{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

            </motion.div>
        </div>
    )
}

/* ─── Mini compact card for Destacados ─── */
function MiniProductCard({ product: p, userRole, delay }: { product: any, userRole?: string, delay: number }) {
    const imgs = safeParseArray(p.images)
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay }}
        >
            <Link
                href={`/web/product/${p.id}`}
                className="group flex flex-col bg-white border border-slate-200 hover:border-[#1E3A8A]/60 hover:shadow-xl transition-all duration-300 rounded-lg overflow-hidden"
            >
                <div className="aspect-square relative bg-slate-50 flex items-center justify-center overflow-hidden">
                    <SafeImage src={imgs[0]} alt={p.name} fill className="p-2 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="p-2">
                    <p className="text-[9px] font-medium text-slate-500 tracking-wide line-clamp-2 leading-tight group-hover:text-[#1E3A8A] transition-colors mb-1">{p.name}</p>
                    <p className="text-[10px] font-bold text-[#1E3A8A]">
                        ${calculateDiscountedPrice(p.price, userRole).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                </div>
            </Link>
        </motion.div>
    );
}

/* ─── Infinite horizontal scroll for Nuestros Productos ─── */
function InfiniteProductScroll({ products, userRole }: { products: any[], userRole?: string }) {
    const trackRef = useRef<HTMLDivElement>(null)
    const isDragging = useRef(false)
    const startX = useRef(0)
    const scrollLeft = useRef(0)

    const onMouseDown = (e: React.MouseEvent) => {
        isDragging.current = true
        startX.current = e.pageX - (trackRef.current?.offsetLeft ?? 0)
        scrollLeft.current = trackRef.current?.scrollLeft ?? 0
    }
    const onMouseMove = (e: React.MouseEvent) => {
        if (!isDragging.current || !trackRef.current) return
        e.preventDefault()
        const x = e.pageX - trackRef.current.offsetLeft
        trackRef.current.scrollLeft = scrollLeft.current - (x - startX.current)
    }
    const onMouseUp = () => { isDragging.current = false }

    const scroll = (dir: 'left' | 'right') => {
        trackRef.current?.scrollBy({ left: dir === 'right' ? 320 : -320, behavior: 'smooth' })
    }

    return (
        <div className="relative">
            <div className="absolute left-0 top-0 bottom-4 w-16 bg-gradient-to-r from-[#F8FAFC] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-4 w-16 bg-gradient-to-l from-[#F8FAFC] to-transparent z-10 pointer-events-none" />

            <button onClick={() => scroll('left')} className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center hover:bg-white text-slate-500 shadow-md">
                <ChevronLeft size={16} />
            </button>
            <button onClick={() => scroll('right')} className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center hover:bg-white text-slate-500 shadow-md">
                <ChevronRight size={16} />
            </button>

            <div
                ref={trackRef}
                className="flex gap-3 overflow-x-auto pb-4 px-12 cursor-grab active:cursor-grabbing select-none custom-scrollbar"
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseUp}
            >
                {products.map((p: any) => (
                    <Link
                        key={p.id}
                        href={`/web/product/${p.id}`}
                        className="shrink-0 w-44 group bg-white border border-slate-200 hover:border-[#1E3A8A]/50 hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden"
                        draggable={false}
                    >
                        <div className="h-32 relative bg-slate-50 flex items-center justify-center overflow-hidden border-b border-slate-100">
                             <SafeImage src={safeParseArray(p.images)[0]} alt={p.name} fill className="p-3 group-hover:scale-105 transition-transform duration-300" />
                        </div>
                        <div className="p-3">
                            <p className="text-[10px] font-medium text-slate-500 line-clamp-2 leading-snug mb-2 group-hover:text-[#1E3A8A] transition-colors">{p.name}</p>
                            <p className="text-xs font-bold text-[#1E3A8A]">${calculateDiscountedPrice(p.price, userRole).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                        </div>
                    </Link>
                ))}
                <div className="shrink-0 w-8" />
            </div>
        </div>
    )
}

/* ─── Collection Banner ─── */
function CollectionBanner({ collection, products, reverse, userRole }: { collection: any, products: any[], reverse: boolean, userRole?: string }) {
    const galleryRef = useRef<HTMLDivElement>(null)
    const scrollGallery = (dir: 'left' | 'right') => {
        galleryRef.current?.scrollBy({ left: dir === 'right' ? 300 : -300, behavior: 'smooth' })
    }

    const textAccent = "text-[#1E3A8A]"
    const bgAccent = "from-blue-600/10"
    const btnHover = "hover:bg-[#1E3A8A] hover:border-[#1E3A8A]"
    const badgeColor = "bg-blue-50 text-[#1E3A8A] border-blue-100"

    return (
        <motion.section 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="group relative bg-white border border-slate-200 hover:border-blue-200 rounded-3xl overflow-hidden shadow-xl transition-all duration-500"
        >
            <div className={`absolute top-0 ${reverse ? 'right-0' : 'left-0'} w-[500px] h-[500px] bg-gradient-to-br ${bgAccent} to-transparent opacity-20 blur-[100px] pointer-events-none`} />
            
            <div className={`flex flex-col lg:flex-row ${reverse ? 'lg:flex-row-reverse' : ''} items-stretch relative z-10`}>
                
                <div className={`w-full lg:w-[45%] p-10 md:p-14 flex flex-col justify-center relative border-b lg:border-b-0 ${reverse ? 'lg:border-l border-slate-200' : 'lg:border-r border-slate-200'} overflow-hidden`}>
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-[0.4em] rounded-full border ${badgeColor} backdrop-blur-sm flex items-center gap-2`}>
                                <Sparkles size={10} />
                                Colección Premium
                            </span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-black text-[#1E3A8A] tracking-tighter leading-none mb-6 uppercase">
                            {collection.name}
                        </h2>
                        
                        <p className="text-slate-500 text-[13px] leading-relaxed mb-10 font-medium max-w-md">
                            {collection.description || `Equipamiento especializado y soluciones avanzadas para ${collection.name}. Eleva tu infraestructura tecnológica al siguiente nivel con calidad certificada.`}
                        </p>

                        <div className="flex flex-wrap gap-4 items-center">
                            <Link
                                href={`/web/collection/${collection.slug}`}
                                className={`inline-flex items-center gap-3 text-white text-[11px] font-black uppercase tracking-widest px-8 py-4 rounded-xl transition-all duration-300 bg-[#1E3A8A] border border-[#1E3A8A] ${btnHover} shadow-xl`}
                            >
                                Explororar Catálogo <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="w-full lg:w-[55%] p-6 md:p-10 relative bg-slate-50">
                    {products.length > 0 ? (
                        <div className="h-full flex flex-col">
                            <div className="flex justify-between items-center mb-6 px-2">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Productos Destacados</span>
                                <div className="flex gap-2">
                                    <button onClick={() => scrollGallery('left')} className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-[#1E3A8A] hover:text-white transition-all text-slate-400 shadow-md"><ChevronLeft size={16} /></button>
                                    <button onClick={() => scrollGallery('right')} className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-[#1E3A8A] hover:text-white transition-all text-slate-400 shadow-md"><ChevronRight size={16} /></button>
                                </div>
                            </div>

                            <div ref={galleryRef} className="flex gap-4 overflow-x-auto pb-6 pt-2 px-2 hide-scrollbar snap-x flex-1 items-center">
                                {products.map((p: any, idx: number) => (
                                    <div 
                                        key={p.id}
                                        className="snap-center shrink-0"
                                    >
                                        <Link 
                                            href={`/web/product/${p.id}`} 
                                            className="block w-48 lg:w-56 group bg-white border border-slate-200 rounded-2xl hover:border-blue-300 transition-all duration-300 p-3 shadow-lg hover:shadow-xl relative overflow-hidden"
                                        >
                                            <div className="h-36 lg:h-44 bg-slate-50 flex items-center justify-center relative mb-4 rounded-xl overflow-hidden border border-slate-100">
                                                <SafeImage src={safeParseArray(p.images)[0]} alt={p.name} fill className="p-4 group-hover:scale-110 transition-transform duration-500" />
                                            </div>
                                            
                                            <div className="px-1">
                                                <p className="text-slate-500 text-[11px] font-semibold line-clamp-2 mb-2 group-hover:text-[#1E3A8A] transition-colors leading-relaxed h-8">{p.name}</p>
                                                <p className="text-sm font-black text-[#1E3A8A] bg-blue-50 inline-block px-3 py-1.5 rounded-lg border border-blue-100">${calculateDiscountedPrice(p.price, userRole).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="h-full min-h-[300px] flex items-center justify-center">
                            <div className="text-center bg-white p-10 rounded-3xl border border-slate-100 shadow-sm">
                                <Hexagon className="w-12 h-12 text-slate-200 mx-auto mb-4 animate-[spin_10s_linear_infinite]" strokeWidth={1} />
                                <p className="text-slate-300 text-[11px] uppercase tracking-[0.4em] font-black">Catálogo en Sincronización</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </motion.section>
    )
}

/* ─── Categories Banner ─── */
function CategoriesBanner({ categories }: { categories: any[] }) {
    const scrollRef = useRef<HTMLDivElement>(null)
    const scroll = (dir: 'left' | 'right') => {
        scrollRef.current?.scrollBy({ left: dir === 'right' ? 240 : -240, behavior: 'smooth' })
    }

    return (
        <section id="categorias" className="w-full py-10">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-end justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-semibold text-[#1E3A8A] uppercase tracking-widest">
                            NUESTRAS <span className="font-bold text-blue-600">CATEGORÍAS</span>
                        </h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => scroll('left')} className="w-8 h-8 rounded-full border border-slate-200 bg-white text-slate-400 flex items-center justify-center hover:bg-[#1E3A8A] hover:text-white transition-all shadow-sm"><ChevronLeft size={15} /></button>
                        <button onClick={() => scroll('right')} className="w-8 h-8 rounded-full border border-slate-200 bg-white text-slate-400 flex items-center justify-center hover:bg-[#1E3A8A] hover:text-white transition-all shadow-sm"><ChevronRight size={15} /></button>
                    </div>
                </div>

                <div ref={scrollRef} className="flex gap-3 overflow-x-auto hide-scrollbar pb-4 snap-x">
                    {categories.filter(c => c.isVisible).map((cat: any, i: number) => (
                        <motion.div
                            key={cat.id}
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.04 }}
                            className="snap-start shrink-0"
                        >
                            <Link
                                href={cat.slug === 'desarrollo' || cat.slug === 'software-desarrollo' || cat.slug.includes('diseno') || cat.name.toLowerCase().includes('diseño') ? '/web/demos' : `/web/category/${cat.slug}`}
                                className="group block relative overflow-hidden w-48 h-60 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-lg transition-all duration-300"
                            >
                                <div className="absolute inset-0 flex items-center justify-center p-6">
                                    <SafeImage src={cat.image} alt={cat.name} fill className="p-8 opacity-10 group-hover:opacity-30 transition-all duration-500 saturate-0" />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-white via-white/95 to-transparent">
                                    <h3 className="text-[#1E3A8A] text-[11px] font-semibold uppercase tracking-tight mb-0.5 group-hover:text-blue-600 transition-colors line-clamp-2">{cat.name}</h3>
                                    <p className="text-slate-400 text-[9px] font-medium uppercase tracking-widest flex items-center gap-1 group-hover:text-blue-600 transition-colors">
                                        Ver <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
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

/* ─── Web Demo Showcase ─── */
const PORTFOLIO_ITEMS = [
    { id: 1, title: "Instituto Sucre", category: "Plataforma EduTech", description: "Gestión académica integral.", accent: "#6366f1", previewUrl: "/instituto_sucre.html" },
    { id: 2, title: "Bodegas Logistics", category: "Logística Corporativo", description: "Control de inventario QR.", accent: "#10b981", previewUrl: "/bodegas.html" },
    { id: 3, title: "Scraper Pro", category: "Inteligencia Competitiva", description: "Motor automatizado de datos.", accent: "#a855f7", previewUrl: "/scraper/index.html" },
    { id: 4, title: "Couple Games", category: "Entretenimiento B2C", description: "App interactiva engagement.", accent: "#ec4899", previewUrl: "/couples-game/index.html" },
    { id: 5, title: "SOFT3 Logistics", category: "ERP de Logística", description: "Sistema de gestión Laravel.", accent: "#3b82f6", previewUrl: "/soft3.html" }
]

function WebShowcase() {
    const [activePreview, setActivePreview] = useState<{url: string, title: string, accent: string} | null>(null)
    const scrollRef = useRef<HTMLDivElement>(null)
    const scroll = (dir: 'left' | 'right') => { scrollRef.current?.scrollBy({ left: dir === 'right' ? 350 : -350, behavior: 'smooth' }) }

    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 relative overflow-hidden shadow-xl">
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
                <div>
                    <div className="flex items-center gap-2 text-blue-600 mb-2">
                        <Sparkles size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Software & Web Demos</span>
                    </div>
                    <h3 className="text-2xl font-black text-[#1E3A8A] uppercase tracking-tight">Showcase de <span className="text-blue-600">Desarrollo</span></h3>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => scroll('left')} className="w-10 h-10 rounded-full border border-slate-200 bg-white text-slate-400 hover:text-blue-600 flex items-center justify-center transition-colors shadow-sm"><ChevronLeft size={20} /></button>
                    <button onClick={() => scroll('right')} className="w-10 h-10 rounded-full border border-slate-200 bg-white text-slate-400 hover:text-blue-600 flex items-center justify-center transition-colors shadow-sm"><ChevronRight size={20} /></button>
                </div>
            </div>

            <div ref={scrollRef} className="flex gap-6 overflow-x-auto hide-scrollbar pb-4 snap-x">
                {PORTFOLIO_ITEMS.map((item) => (
                    <motion.div 
                        key={item.id}
                        whileHover={{ y: -5 }}
                        className="snap-start shrink-0 w-72 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden group cursor-pointer shadow-md hover:shadow-xl transition-all"
                        onClick={() => setActivePreview({ url: item.previewUrl, title: item.title, accent: item.accent })}
                    >
                        <div className="h-40 relative bg-white flex items-center justify-center overflow-hidden">
                             <iframe src={item.previewUrl} title={item.title} className="w-[400%] h-[400%] origin-top-left scale-[0.25] pointer-events-none opacity-40 group-hover:opacity-80 transition-opacity" />
                             <div className="absolute inset-0 flex flex-col items-center justify-center bg-blue-600/10 opacity-100 group-hover:opacity-0 transition-opacity"><span className="text-[10px] font-bold text-blue-600/40 uppercase tracking-widest">Ver Demo</span></div>
                        </div>
                        <div className="p-4 border-t border-slate-100 bg-white">
                            <span className="text-[9px] font-bold uppercase tracking-widest mb-1 block" style={{ color: item.accent }}>{item.category}</span>
                            <h4 className="text-sm font-bold text-slate-800 mb-2">{item.title}</h4>
                            <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-2">{item.description}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {activePreview && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 md:p-10" onClick={() => setActivePreview(null)}>
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full h-full max-w-6xl bg-white border border-slate-200 shadow-2xl rounded-xl overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
                            <div className="h-14 bg-slate-50 border-b border-slate-200 flex items-center justify-between px-6">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Demo: <span className="text-slate-900">{activePreview.title}</span></span>
                                <button onClick={() => setActivePreview(null)} className="text-slate-400 hover:text-slate-900 transition-colors"><X size={20} /></button>
                            </div>
                            <div className="flex-1 bg-white"><iframe src={activePreview.url} title="Active Demo" className="w-full h-full border-0" /></div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

function HeroBanner({ settings }: { settings: any }) {
    const banners = [
        { 
            url: "/banners/espia.jpeg", 
            pdf: "/pdfs/catalogo_espia.pdf",
        },
        { 
            url: "/banners/smart.jpeg", 
            pdf: "/pdfs/catalogo_smart.pdf",
        }
    ]

    return (
        <section className="w-full bg-white">
            <div className="flex flex-col">
                {banners.map((b, i) => (
                    <div 
                        key={i}
                        className="relative w-full overflow-hidden"
                    >
                        <img src={b.url} alt="Banner" className="w-full h-auto block" />
                        <a 
                            href={b.pdf} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="absolute inset-0 z-10"
                            aria-label="Ver más"
                        />
                    </div>
                ))}
            </div>
        </section>
    )
}
