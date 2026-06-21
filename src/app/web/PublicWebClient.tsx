"use client"

// Version: 1.0.2 - Fixed Broken Images System
import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { ShoppingBag, ChevronRight, ArrowRight, Shield, Zap, Truck, ChevronLeft, Hexagon, Star, X, Smartphone, Database, Sparkles, Code, Bot, Download, Search, ImageOff, AlertCircle, Home, Building, Factory, Cpu } from "lucide-react"
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
                        <h2 className="text-xl font-semibold text-[black] uppercase tracking-widest">
                            CATÁLOGO DE <span className="font-bold text-black">CELULARES Y TABLETS</span>
                        </h2>
                        <p className="text-slate-400 text-[10px] mt-1 uppercase tracking-[0.3em] font-medium">Samsung · iPhone · Xiaomi · OPPO y más</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={() => scroll('left')} className="w-8 h-8 flex items-center justify-center border border-slate-200 bg-white hover:border-blue-600 hover:text-black text-slate-400 rounded-lg transition-all shadow-sm">
                            <ChevronLeft size={15} />
                        </button>
                        <button onClick={() => scroll('right')} className="w-8 h-8 flex items-center justify-center border border-slate-200 bg-white hover:border-blue-600 hover:text-black text-slate-400 rounded-lg transition-all shadow-sm">
                            <ChevronRight size={15} />
                        </button>
                        <Link href="/web/phones" className="text-[10px] font-semibold text-slate-500 hover:text-black transition-colors flex items-center gap-1 uppercase tracking-widest">
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
                                    <p className="text-[9px] font-medium text-slate-500 line-clamp-2 leading-snug group-hover:text-black transition-colors flex-1 mb-1">{p.name}</p>
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
            products = [
                { id: 'v-web-1', name: 'GESTOR: DESARROLLO BÁSICO', description: 'Tienda con hasta 50 productos, WhatsApp, Responsive.', price: 199, images: '["/assets/ecommerce/img1.jpeg"]', featured: true },
                { id: 'v-web-2', name: 'GESTOR: ESTÁNDAR', description: 'Hasta 500 productos, Pagos en línea, Gestor Avanzado, SEO.', price: 299, images: '["/assets/ecommerce/img2.jpeg"]', featured: true },
                { id: 'v-web-3', name: 'GESTOR: PRO', description: 'Productos Ilimitados, ERP, CRM WhatsApp, Cuentas Multiples.', price: 599, images: '["/assets/ecommerce/img1.jpeg"]', featured: true },
                { id: 'v-web-4', name: 'GESTOR: PERSONALIZADO', description: 'Arquitectura a medida, Apps Móviles, integraciones API.', price: 999, images: '["/assets/ecommerce/img2.jpeg"]', featured: false }
            ];
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
        <div className="min-h-screen bg-white text-black selection:bg-black/10 pb-20 font-sans relative">
            <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.025]"
                style={{
                    backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px),
                                     linear-gradient(to bottom, #000 1px, transparent 1px)`,
                    backgroundSize: `80px 80px`
                }}
            />
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="relative z-10">

                <MinimalStoreHero searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

                {/* PRODUCTOS */}
                <section className="w-full max-w-7xl mx-auto px-6 py-8" id="productos">
                    {searchQuery ? (
                        filteredProducts.length === 0 ? (
                            <div className="py-20 text-center border border-dashed border-slate-200 rounded-none">
                                <p className="text-slate-400 text-[10px] uppercase tracking-[0.3em] font-black">No se encontraron productos para "{searchQuery}"</p>
                                <button onClick={() => setSearchQuery("")} className="mt-4 text-[black] text-[10px] font-black uppercase tracking-widest hover:underline">Limpiar Búsqueda</button>
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
                </section>
            </motion.div>
        </div>
    )
}

function MinimalStoreHero({ searchQuery, setSearchQuery }: { searchQuery: string, setSearchQuery: (val: string) => void }) {
    const cards = [
        { id: 'electronica', label: 'Electrónica', icon: <Cpu size={24} /> },
        { id: 'hogar', label: 'Hogar', icon: <Home size={24} /> },
        { id: 'residencial', label: 'Residencial', icon: <Building size={24} /> },
        { id: 'industrial', label: 'Industrial', icon: <Factory size={24} /> },
        { id: 'software', label: 'Software', icon: <Code size={24} /> }
    ];

    const scrollDown = () => {
        document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="pt-24 pb-8 flex flex-col items-center justify-center text-center px-6 border-b border-zinc-100 bg-white">
            {/* ATOM LOGO & TITLE */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="mb-6 flex flex-col items-center"
            >
                <AtomLogo />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mb-2"
            >
                <h1 className="text-4xl md:text-5xl font-black tracking-[0.15em] uppercase text-black leading-none">
                    ATOMIC INDUSTRIAS
                </h1>
            </motion.div>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="text-xs font-bold tracking-[0.4em] uppercase text-zinc-400 mb-12"
            >
                Tienda en Línea
            </motion.p>

            {/* SEARCH BAR */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="w-full max-w-2xl mx-auto mb-12 relative group"
            >
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-black transition-colors" size={18} />
                <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar por nombre, marca o categoría..."
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl p-4 pl-12 pr-12 text-sm uppercase tracking-widest placeholder:text-slate-400 focus:border-black focus:bg-white transition-all outline-none shadow-sm hover:shadow-md"
                />
                {searchQuery && (
                    <button 
                        onClick={() => setSearchQuery("")}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-black transition-colors"
                    >
                        <X size={16} />
                    </button>
                )}
            </motion.div>

            {/* HORIZONTAL CARDS */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="w-full max-w-5xl overflow-x-auto pb-4 scrollbar-hide"
            >
                <div className="flex items-center justify-center gap-4 min-w-max mx-auto px-4">
                    {cards.map((card, i) => (
                        <button
                            key={card.id}
                            onClick={() => {
                                setSearchQuery(card.label);
                                scrollDown();
                            }}
                            className="group flex flex-col items-center justify-center gap-4 bg-white text-black rounded-2xl w-36 h-36 border border-zinc-200
                                       hover:scale-[1.05] hover:shadow-2xl hover:shadow-black/10 hover:border-black hover:bg-zinc-50
                                       active:scale-[0.98] transition-all duration-300 ease-out"
                        >
                            <div className="w-12 h-12 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center group-hover:bg-black group-hover:text-white group-hover:border-black transition-all duration-300">
                                {card.icon}
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black">
                                {card.label}
                            </span>
                        </button>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}

function AtomLogo() {
    return (
        <svg width="64" height="64" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="36" cy="36" r="5" fill="#000" />
            <ellipse cx="36" cy="36" rx="30" ry="10" stroke="#000" strokeWidth="1.5" fill="none" />
            <ellipse cx="36" cy="36" rx="30" ry="10" stroke="#000" strokeWidth="1.5" fill="none" transform="rotate(60 36 36)" />
            <ellipse cx="36" cy="36" rx="30" ry="10" stroke="#000" strokeWidth="1.5" fill="none" transform="rotate(120 36 36)" />
            <circle cx="66" cy="36" r="2.5" fill="#000" />
            <circle cx="21" cy="10.5" r="2.5" fill="#000" />
            <circle cx="21" cy="61.5" r="2.5" fill="#000" />
        </svg>
    )
}
