import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { ArrowLeft, Download, ShoppingBag, ChevronRight, Shield, ArrowRight } from "lucide-react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { calculateDiscountedPrice } from "@/lib/utils/pricing"

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const session = await getServerSession(authOptions)
    const userRole = session?.user?.role

    const category = await prisma.category.findUnique({
        where: { slug: slug },
        include: {
            products: {
                where: { isDeleted: false, isActive: true }
            }
        }
    })

    if (!category) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white/60 backdrop-blur-sm text-center p-6">
                <div>
                    <h1 className="text-4xl font-black uppercase text-[#0F1923]/20 tracking-tighter mb-4">Categoría no encontrada</h1>
                    <Link href="/web" className="text-[#E8341A] font-black uppercase tracking-widest text-[10px] hover:underline">Volver al inicio</Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#020617] text-white">
            {/* Header / Cover */}
            <div className="relative h-72 md:h-[450px] bg-[#020617] flex flex-col items-center justify-center overflow-hidden border-b border-white/5">
                <div className="absolute inset-0 bg-[#E8341A]/[0.03] blur-[120px] rounded-full -top-[20%]" />
                {category.image && (
                    <img src={category.image} alt={category.name} className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent"></div>
                <div className="relative z-10 text-center px-6">
                    <p className="text-[#E8341A] font-black uppercase tracking-[0.5em] text-[10px] mb-6">Categoría Especializada</p>
                    <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter italic leading-none">{category.name}</h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-16 border-b border-white/5 pb-8">
                    <Link href="/web" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-[#E8341A] transition-colors">
                        <ArrowLeft size={14} /> Volver a Tienda
                    </Link>

                    {category.pdfUrl && (
                        <a 
                            href={category.pdfUrl} 
                            download={`${category.name}.pdf`}
                            className="flex items-center gap-3 bg-[#E8341A] text-white px-8 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-[#E8341A] transition-all shadow-[0_15px_40px_rgba(232,52,26,0.3)]"
                        >
                            <Download size={14} />
                            <span>Descargar Catálogo PDF</span>
                        </a>
                    )}
                </div>

                {/* Special Banner for Consoles */}
                {slug === 'consolas-de-video-juegos' && (
                    <div className="mb-20 bg-gradient-to-br from-[#E8341A]/10 to-transparent border border-[#E8341A]/20 p-8 md:p-12 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#E8341A]/10 blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-700" />
                        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            <div className="space-y-6">
                                <div className="inline-flex items-center gap-2 text-[#E8341A] text-[9px] font-black uppercase tracking-[0.3em] bg-[#E8341A]/10 px-3 py-1">
                                    <Shield size={12} /> CERTIFICACIÓN ATOMIC
                                </div>
                                <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter italic">EQUIPOS <span className="text-[#E8341A]">OPEN BOX.</span></h2>
                                <p className="text-white/50 text-[11px] leading-relaxed uppercase tracking-widest font-medium">
                                    Nuestras consolas son equipos en condición Open Box con garantía técnica directa y soporte continuo. 
                                    Hardware verificado para garantizar la máxima durabilidad y rendimiento en tus sesiones gaming.
                                </p>
                                <div className="flex gap-8 text-[9px] font-black uppercase tracking-widest text-white/40">
                                    <div className="flex items-center gap-2"><ChevronRight size={12} className="text-[#E8341A]" /> Garantía 1 Año</div>
                                    <div className="flex items-center gap-2"><ChevronRight size={12} className="text-[#E8341A]" /> Soporte VIP</div>
                                    <div className="flex items-center gap-2"><ChevronRight size={12} className="text-[#E8341A]" /> Mantenimiento Incluido</div>
                                </div>
                            </div>
                            <div className="hidden md:block opacity-40 group-hover:opacity-60 transition-opacity">
                                <ShoppingBag size={120} className="text-[#E8341A] ml-auto animate-pulse" strokeWidth={0.5} />
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {category.products.length > 0 ? category.products.map(p => {
                        let imgs: string[] = [];
                        if (p.images) {
                            const trimmed = p.images.trim();
                            if (trimmed.startsWith('http') || trimmed.startsWith('/') || trimmed.startsWith('data:image')) {
                                imgs = [trimmed];
                            } else {
                                try { 
                                    let parsed = JSON.parse(trimmed);
                                    if(typeof parsed === 'string') { try { parsed = JSON.parse(parsed) } catch(e){} }
                                    imgs = Array.isArray(parsed) ? parsed : (typeof parsed === 'string' ? [parsed] : []);
                                } catch {}
                            }
                        }
                        return (
                            <Link key={p.id} href={`/web/product/${p.id}`} className="group bg-slate-900/40 border border-white/5 hover:border-[#E8341A]/30 transition-all flex flex-col h-full hover:bg-slate-800/80 rounded-none overflow-hidden">
                                <div className="aspect-square bg-white/[0.02] relative overflow-hidden flex items-center justify-center p-6 border-b border-white/5">
                                    {imgs.length > 0 ? (
                                        <img src={imgs[0]} alt={p.name} referrerPolicy="no-referrer" className="w-full h-full object-contain opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out p-4" />
                                    ) : (
                                        <ShoppingBag size={32} className="text-white/10" />
                                    )}
                                </div>
                                <div className="p-5">
                                    <h3 className="text-[10px] font-black uppercase text-white/80 tracking-wider mb-3 group-hover:text-[#E8341A] transition-colors line-clamp-2 italic">{p.name}</h3>
                                    <div className="flex items-center justify-between">
                                        <p className="font-mono font-black text-xl text-white">
                                            ${calculateDiscountedPrice(p.price, userRole).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                        </p>
                                        <ArrowRight size={14} className="text-white/20 group-hover:text-[#E8341A] group-hover:translate-x-1 transition-all" />
                                    </div>
                                </div>
                            </Link>
                        )
                    }) : (
                        <div className="col-span-4 py-32 text-center border border-dashed border-white/5">
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Sin productos registrados en esta sección</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
