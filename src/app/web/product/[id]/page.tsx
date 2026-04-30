"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { 
  ShoppingBag, ChevronRight, Star, ArrowRight, Shield, Zap, Truck, 
  Search, ShoppingCart, User, Download, ExternalLink, Power, ArrowLeft, 
  CheckCircle2, Info, Package
} from "lucide-react"
import { useSession } from "next-auth/react"
import { useCart } from "@/context/CartContext"
import { getProductById, getRelatedProducts } from "@/lib/actions/shop"
import { calculateDiscountedPrice } from "@/lib/utils/pricing"

export default function ProductDetailPage() {
    const { data: session } = useSession()
    const userRole = session?.user?.role
    const { addToCart } = useCart()
    const params = useParams()
    const router = useRouter()
    const [product, setProduct] = useState<any>(null)
    const [related, setRelated] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedImage, setSelectedImage] = useState(0)
    const [errorMsg, setErrorMsg] = useState<string | null>(null)
    const [added, setAdded] = useState(false)

    const handleAddToCart = () => {
        if (!product) return;
        const price = calculateDiscountedPrice(product.price, userRole);
        const images = product.images ? JSON.parse(product.images) : [];
        addToCart({
            id: product.id,
            name: product.name,
            price: price,
            quantity: 1,
            image: Array.isArray(images) ? images[0] : (typeof images === 'string' ? images : undefined)
        });
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    }

    useEffect(() => {
        const load = async () => {
            if (!params.id) return
            setLoading(true)
            try {
                const p = await getProductById(params.id as string)
                if (p) {
                    setProduct(p)
                    const r = await getRelatedProducts(p.categoryId, p.id)
                    setRelated(r)
                } else {
                    setErrorMsg("Product returned null from DB. ID: " + params.id)
                }
            } catch (error: any) {
                console.error("Error loading product detail:", error)
                setErrorMsg(error?.message || "Unknown error occurred")
            }
            setLoading(false)
        }
        load()
    }, [params.id])

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 bg-slate-800 mb-4 rounded-none ring-1 ring-slate-700"></div>
                    <div className="h-2 w-48 bg-slate-800"></div>
                </div>
            </div>
        )
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center space-y-6">
                <h1 className="text-4xl font-black uppercase text-slate-400 tracking-tighter">Producto no encontrado</h1>
                {errorMsg && <p className="text-red-500 font-bold max-w-xl text-center border border-red-500 p-4">{errorMsg}</p>}
                <p className="text-slate-500">ID Buscado: {params.id}</p>
                <Link href="/web" className="text-[10px] font-black uppercase tracking-[0.3em] bg-slate-800 text-white px-8 py-4 hover:bg-[#E8341A] transition-all flex items-center space-x-3 rounded-none">
                    <ArrowLeft size={14} />
                    <span>Volver al catálogo</span>
                </Link>
            </div>
        )
    }

    const images = (() => {
        try {
            let parsed = product.images ? JSON.parse(product.images) : [];
            if(typeof parsed === 'string') { try { parsed = JSON.parse(parsed) } catch(e){} }
            if (Array.isArray(parsed)) return parsed;
            if (typeof parsed === "string") return [parsed];
            if (product.images && (product.images.startsWith("http") || product.images.startsWith("/"))) return [product.images];
            return [];
        } catch (e) {
            return []
        }
    })()

    const specs = (() => {
        try {
            return product.specs ? JSON.parse(product.specs) : null
        } catch (e) {
            return null
        }
    })()

    return (
        <div className="min-h-screen bg-[#0F172A] text-slate-200 font-sans">
            {/* Nav removed -> Handled by layout.tsx */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Breadcrumbs */}
                <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-slate-500 mb-12 overflow-x-auto whitespace-nowrap pb-4 md:pb-0">
                    <Link href="/web" className="hover:text-[#E8341A] flex items-center">
                        <ArrowLeft size={10} className="mr-1" /> Inicio
                    </Link>
                    <ChevronRight size={10} />
                    <span className="text-slate-400">{product.category?.name || 'Varios'}</span>
                    <ChevronRight size={10} />
                    <span className="text-white truncate max-w-[200px]">{product.name}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                    {/* Left: Gallery */}
                    <div className="space-y-6">
                        <div className="aspect-square bg-slate-800/50 border border-slate-700/50 relative overflow-hidden flex items-center justify-center p-12 group shadow-xl">
                            {images.length > 0 ? (
                                <img 
                                    src={images[selectedImage]} 
                                    alt={product.name}
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105" 
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center opacity-10">
                                    <Package size={80} />
                                    <span className="text-[10px] font-black uppercase tracking-[0.5em] mt-8 text-center italic">Elemento sin imagen<br/>Sincronización Pendiente</span>
                                </div>
                            )}
                            {product.featured && (
                                <div className="absolute top-8 left-8 bg-[#E8341A] text-white text-[8px] font-black uppercase px-3 py-1.5 shadow-xl shadow-orange-100">Destacado</div>
                            )}
                        </div>
                        {images.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {images.map((img: string, i: number) => (
                                    <button 
                                        key={i}
                                        onClick={() => setSelectedImage(i)}
                                        className={`aspect-square bg-slate-800/50 border transition-all p-3 flex items-center justify-center ${selectedImage === i ? 'border-[#E8341A] ring-2 ring-[#E8341A]/20' : 'border-slate-700 hover:border-slate-500'}`}
                                    >
                                        <img src={img} alt="" referrerPolicy="no-referrer" className="w-full h-full object-contain mix-blend-multiply" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Info */}
                    <div className="flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                             <span className="text-[10px] font-black text-[#E8341A] uppercase tracking-[0.3em]">{product.category?.name || 'Varios'}</span>
                             {product.sku && <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-800 px-3 py-1 border border-slate-700">REF: {product.sku}</span>}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.85] mb-8 text-white">
                            {product.name}
                        </h1>
                        
                        <div className="flex flex-col mb-12">
                            <div className="flex items-center space-x-6">
                                <p className="text-5xl font-black text-white font-mono tracking-tighter">
                                    ${calculateDiscountedPrice(product.price, userRole).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </p>
                                {(userRole === 'AFILIADO' || userRole === 'DISTRIBUIDOR') && (
                                    <p className="text-2xl text-neutral-200 line-through font-bold">
                                        ${product.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </p>
                                )}
                                {product.compareAtPrice && !userRole && (
                                    <p className="text-2xl text-neutral-200 line-through font-bold">
                                        ${product.compareAtPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </p>
                                )}
                            </div>
                            {userRole && (userRole === 'AFILIADO' || userRole === 'DISTRIBUIDOR') && (
                                <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mt-2">
                                    Precio especial para {userRole === 'AFILIADO' ? 'Afiliado' : 'Distribuidor'} aplicado
                                </p>
                            )}
                        </div>

                        <div className="space-y-10 flex-1">
                            <div className="p-8 bg-neutral-900 text-white/90 relative overflow-hidden group">
                                <div className="absolute right-0 top-0 h-full w-24 bg-white/5 skew-x-[30deg] translate-x-12"></div>
                                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-orange-500 mb-6 flex items-center">
                                    <Info size={14} className="mr-2" /> Descripción Técnica
                                </p>
                                <p className="text-sm leading-relaxed font-medium">
                                    {product.description || "Este equipo ATOMIC representa la vanguardia en tecnología Corporativo, diseñado para optimizar procesos y garantizar máxima durabilidad en entornos exigentes altamente competitivos."}
                                </p>
                            </div>

                            <div className="space-y-4">
                                <button 
                                    onClick={handleAddToCart}
                                    className={`w-full py-6 text-[10px] font-black uppercase tracking-[0.4em] transition-all shadow-2xl flex items-center justify-center space-x-4 group rounded-none ${added ? 'bg-green-600 text-white' : 'bg-orange-600 text-white hover:bg-neutral-900 shadow-orange-100'}`}
                                >
                                    {added ? (
                                        <>
                                            <CheckCircle2 size={18} />
                                            <span>¡Añadido!</span>
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingCart size={18} />
                                            <span>Añadir al Carrito</span>
                                            <ArrowRight size={16} className="translate-x-0 group-hover:translate-x-3 transition-transform" />
                                        </>
                                    )}
                                </button>
                                
                                {product.specSheetUrl && (
                                    <a 
                                        href={product.specSheetUrl} 
                                        target="_blank" 
                                        className="w-full border-2 border-neutral-100 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 hover:text-neutral-900 hover:border-neutral-900 transition-all flex items-center justify-center space-x-3"
                                    >
                                        <Download size={16} />
                                        <span>Ficha Técnica PDF</span>
                                    </a>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
                                <div className="flex items-start space-x-4 group">
                                    <div className="w-10 h-10 border border-neutral-100 flex items-center justify-center text-orange-500 group-hover:bg-orange-600 group-hover:text-white transition-all">
                                        <Truck size={18} />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-white">Envío Prioritario</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Cobertura en todo el país</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4 group">
                                    <div className="w-10 h-10 border border-slate-700 flex items-center justify-center text-[#E8341A] group-hover:bg-[#E8341A] group-hover:text-white transition-all">
                                        <Shield size={18} />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-white">Garantía Protegida</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Soporte directo de fábrica</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Technical specs */}
                {specs && Object.keys(specs).length > 0 && (
                    <div className="mt-40">
                        <div className="space-y-2 mb-16">
                            <p className="text-orange-600 text-[10px] font-black uppercase tracking-[0.3em]">Hardware & Performance</p>
                            <h2 className="text-4xl font-light text-neutral-800 tracking-tighter leading-none">
                                Especificaciones <span className="font-black text-neutral-900">Técnicas Pro</span>
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-1">
                            {Object.entries(specs).map(([key, value]: [string, any]) => (
                                <div key={key} className="flex justify-between items-center py-6 border-b border-neutral-50 group hover:border-orange-500/20 transition-all px-2">
                                    <span className="text-[9px] font-black uppercase text-neutral-300 tracking-[0.2em] group-hover:text-neutral-500">{key}</span>
                                    <span className="text-[11px] font-black text-neutral-900 uppercase">{String(value)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Related Products */}
                {related.length > 0 && (
                    <div className="mt-48 pb-20">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                            <div className="space-y-2">
                                <p className="text-orange-600 text-[10px] font-black uppercase tracking-[0.3em]">Te puede interesar</p>
                                <h2 className="text-4xl font-light text-neutral-800 tracking-tighter">
                                    Equipos <span className="font-black text-neutral-900">Similares</span>
                                </h2>
                            </div>
                            <Link href="/web" className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 hover:text-orange-600 transition-colors border-b-2 border-neutral-100 hover:border-orange-600 pb-1">Ver catálogo completo</Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                            {related.map((p) => (
                                <Link key={p.id} href={`/web/product/${p.id}`} className="group flex flex-col h-full bg-slate-800/50 border border-slate-700/50 p-6 hover:shadow-2xl hover:border-[#E8341A]/40 transition-all duration-500 rounded-xl">
                                    <div className="aspect-square bg-slate-900/50 relative overflow-hidden flex items-center justify-center p-6 mb-6 rounded-lg">
                                        {(() => {
                                            try {
                                                let rImages = p.images ? JSON.parse(p.images) : [];
                                                if(typeof rImages === 'string') { try { rImages = JSON.parse(rImages) } catch(e){} }
                                                if (Array.isArray(rImages)) { rImages = rImages; }
                                                else if (typeof rImages === "string") { rImages = [rImages]; }
                                                else if (p.images && (p.images.startsWith("http") || p.images.startsWith("/"))) { rImages = [p.images]; }
                                                else { rImages = []; }
                                                return rImages.length > 0 ? (
                                                    <img 
                                                        src={rImages[0]} 
                                                        alt={p.name} 
                                                        referrerPolicy="no-referrer"
                                                        className="w-full h-full object-contain mix-blend-multiply group-hover:rotate-3 transition-transform duration-700" 
                                                    />
                                                ) : null;
                                            } catch (e) { return null }
                                        })()}
                                    </div>
                                    <div className="space-y-4 flex-1 flex flex-col">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-300 group-hover:text-[#E8341A] transition-colors leading-tight line-clamp-2 h-8">{p.name}</h4>
                                        <div className="pt-4 border-t border-slate-700/50 flex items-center justify-between mt-auto">
                                            <div className="flex flex-col">
                                                {userRole && (userRole === 'AFILIADO' || userRole === 'DISTRIBUIDOR') && (
                                                    <p className="text-[9px] text-slate-500 line-through font-mono">
                                                        ${p.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </p>
                                                )}
                                                <p className="font-mono font-black text-lg text-white">
                                                    ${calculateDiscountedPrice(p.price, userRole).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </p>
                                            </div>
                                            <ChevronRight size={14} className="text-neutral-200 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>

        </div>
    )
}

