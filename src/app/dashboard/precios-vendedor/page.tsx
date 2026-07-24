import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Package, Tag, ArrowRight, ShoppingBag, ShieldCheck } from "lucide-react"
import Link from "next/link"

export default async function PreciosVendedorPage() {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== "SALESPERSON" && session.user.role !== "ADMIN" && session.user.role !== "AFILIADO")) {
        redirect("/dashboard")
    }

    const discountPercentage = session.user.role === "AFILIADO" ? 0.15 : 0.20
    const discountLabel = session.user.role === "AFILIADO" ? "15%" : "20%"

    const products = await prisma.product.findMany({
        where: { isActive: true, isDeleted: false },
        select: {
            id: true,
            name: true,
            sku: true,
            price: true,
            stock: true,
            images: true,
        },
        orderBy: { name: "asc" }
    })

    const parseImages = (imagesStr: any) => {
        try {
            return JSON.parse(imagesStr || "[]")
        } catch {
            return []
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-32 font-sans">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#10b981] to-emerald-400 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-slate-900/50 backdrop-blur-xl border-slate-700/50/10 blur-[50px] rounded-full pointer-events-none" />
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 backdrop-blur-xl border-slate-700/50/20 backdrop-blur-sm border border-white/30 text-white font-bold text-xs uppercase tracking-widest mb-6">
                        <ShieldCheck size={16} /> Acceso Exclusivo de Socios
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-4">
                        Tus Precios de Distribuidor
                    </h1>
                    <p className="text-emerald-50 text-lg max-w-2xl font-medium">
                        Como {session.user.role}, disfrutas de un <span className="font-black bg-slate-900/50 backdrop-blur-xl border-slate-700/50 text-[#10b981] px-2 py-0.5 rounded-md mx-1">descuento fijo del {discountLabel}</span> en todos nuestros productos. Este es tu margen de ganancia neto por venta.
                    </p>
                </div>
            </div>

            {/* Catalog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map(product => {
                    const images = parseImages(product.images)
                    const imgUrl = images[0] || "/placeholder.png"
                    const basePrice = product.price
                    const discountedPrice = basePrice * (1 - discountPercentage)
                    const profit = basePrice - discountedPrice

                    return (
                        <div key={product.id} className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 rounded-2xl border border-slate-200 overflow-hidden shadow-[0_4px_15px_rgba(0,0,0,0.3)] hover:shadow-xl transition-all group flex flex-col">
                            <div className="h-48 relative bg-slate-50 flex items-center justify-center p-4">
                                <img src={imgUrl} alt={product.name} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-[0_12px_40px_rgba(0,0,0,0.5)] shadow-emerald-500/20">
                                    -{discountLabel}
                                </div>
                            </div>
                            <div className="p-6 flex flex-col flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{product.sku || "N/A"}</span>
                                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md ${product.stock > 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
                                        {product.stock > 0 ? `${product.stock} Stock` : "Agotado"}
                                    </span>
                                </div>
                                <h3 className="font-bold text-[#0F172A] leading-tight mb-4 flex-1 line-clamp-2">{product.name}</h3>
                                
                                <div className="bg-slate-50 rounded-xl p-4 mb-6 space-y-3 border border-slate-100">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500 font-medium">Precio Público (PVP):</span>
                                        <span className="font-bold text-slate-400 line-through">${basePrice.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-emerald-600 font-black flex items-center gap-1.5"><Tag size={16}/> Tu Precio:</span>
                                        <span className="text-xl font-black text-[#0F172A]">${discountedPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Tu Ganancia Neta:</span>
                                        <span className="text-sm font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md">+${profit.toFixed(2)}</span>
                                    </div>
                                </div>

                                <Link href={`/web/product/${product.id}`} className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#0F172A] hover:bg-black text-white rounded-xl font-black text-xs uppercase tracking-widest transition-colors">
                                    <ShoppingBag size={16} />
                                    <span>Ver Producto</span>
                                </Link>
                            </div>
                        </div>
                    )
                })}
            </div>
            
            {products.length === 0 && (
                <div className="text-center py-20 bg-slate-900/50 backdrop-blur-xl border-slate-700/50 border border-slate-200 rounded-3xl">
                    <Package size={48} className="mx-auto text-slate-300 mb-4" />
                    <h3 className="text-lg font-bold text-[#0F172A]">No hay productos disponibles</h3>
                    <p className="text-slate-500 mt-2">Actualmente no hay productos activos en el catálogo.</p>
                </div>
            )}
        </div>
    )
}
