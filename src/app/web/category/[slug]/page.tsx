import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { ArrowLeft, Download, ShoppingBag, ChevronRight, Shield, ArrowRight } from "lucide-react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { calculateDiscountedPrice } from "@/lib/utils/pricing"

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const session = await getServerSession(authOptions)
    const userRole = session?.user?.role

    const category = await prisma.category.findUnique({
        where: { slug },
        include: {
            products: {
                where: { isDeleted: false, isActive: true }
            }
        }
    })

    if (!category) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] text-center p-6">
                <div>
                    <h1 className="text-4xl font-black uppercase text-slate-200 tracking-tighter mb-4">Categoría no encontrada</h1>
                    <Link href="/web" className="text-[#1E3A8A] font-black uppercase tracking-widest text-[10px] hover:underline">Volver al inicio</Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
            {/* Header / Cover */}
            <div className="relative h-72 md:h-[450px] bg-[#1E3A8A] flex flex-col items-center justify-center overflow-hidden border-b border-slate-200">
                <div className="absolute inset-0 bg-blue-600/[0.1] blur-[120px] rounded-full -top-[20%]" />
                {category.image && (
                    <img src={category.image} alt={category.name} className="absolute inset-0 w-full h-full object-cover opacity-10 grayscale" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E3A8A] via-transparent to-transparent opacity-80"></div>
                <div className="relative z-10 text-center px-6">
                    <p className="text-blue-300 font-black uppercase tracking-[0.5em] text-[10px] mb-6">Categoría Especializada</p>
                    <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter italic leading-none drop-shadow-2xl">{category.name}</h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-16 border-b border-slate-200 pb-8">
                    <Link href="/web" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#1E3A8A] transition-colors">
                        <ArrowLeft size={14} /> Volver a Tienda
                    </Link>

                    {category.pdfUrl && (
                        <a 
                            href={category.pdfUrl} 
                            download={`${category.name}.pdf`}
                            className="flex items-center gap-3 bg-[#1E3A8A] text-white px-8 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-blue-800 transition-all shadow-lg"
                        >
                            <Download size={14} />
                            <span>Descargar Catálogo PDF</span>
                        </a>
                    )}
                </div>

                {/* Special Banner for Consoles */}
                {slug === 'consolas-de-video-juegos' && (
                    <div className="mb-20 bg-white border border-slate-200 p-8 md:p-12 relative overflow-hidden group shadow-xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-700" />
                        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            <div className="space-y-6">
                                <div className="inline-flex items-center gap-2 text-[#1E3A8A] text-[9px] font-black uppercase tracking-[0.3em] bg-blue-50 px-3 py-1 border border-blue-100">
                                    <Shield size={12} /> CERTIFICACIÓN ATOMIC
                                </div>
                                <h2 className="text-3xl md:text-5xl font-black text-[#1E3A8A] uppercase tracking-tighter italic">EQUIPOS <span className="text-blue-600">OPEN BOX.</span></h2>
                                <p className="text-slate-500 text-[11px] leading-relaxed uppercase tracking-widest font-medium">
                                    Nuestras consolas son equipos en condición Open Box con garantía técnica directa y soporte continuo. 
                                    Hardware verificado para garantizar la máxima durabilidad y rendimiento en tus sesiones gaming.
                                </p>
                                <div className="flex flex-wrap gap-8 text-[9px] font-black uppercase tracking-widest text-slate-400">
                                    <div className="flex items-center gap-2"><ChevronRight size={12} className="text-blue-600" /> Garantía 1 Año</div>
                                    <div className="flex items-center gap-2"><ChevronRight size={12} className="text-blue-600" /> Soporte VIP</div>
                                    <div className="flex items-center gap-2"><ChevronRight size={12} className="text-blue-600" /> Mantenimiento Incluido</div>
                                </div>
                            </div>
                            <div className="hidden md:block opacity-10 group-hover:opacity-20 transition-opacity">
                                <ShoppingBag size={120} className="text-[#1E3A8A] ml-auto animate-pulse" strokeWidth={0.5} />
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
                            <Link key={p.id} href={`/web/product/${p.id}`} className="group bg-white border border-slate-200 hover:border-blue-300 transition-all flex flex-col h-full hover:shadow-xl rounded-none overflow-hidden">
                                <div className="aspect-square bg-slate-50 relative overflow-hidden flex items-center justify-center p-6 border-b border-slate-100">
                                    {imgs.length > 0 ? (
                                        <img src={imgs[0]} alt={p.name} referrerPolicy="no-referrer" className="w-full h-full object-contain group-hover:scale-110 transition-all duration-700 ease-out p-4" />
                                    ) : (
                                        <ShoppingBag size={32} className="text-slate-100" />
                                    )}
                                </div>
                                <div className="p-5">
                                    <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-wider mb-3 group-hover:text-[#1E3A8A] transition-colors line-clamp-2 italic">{p.name}</h3>
                                    <div className="flex items-center justify-between">
                                        <p className="font-mono font-black text-xl text-[#1E3A8A]">
                                            ${calculateDiscountedPrice(p.price, userRole).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                        </p>
                                        <ArrowRight size={14} className="text-slate-200 group-hover:text-[#1E3A8A] group-hover:translate-x-1 transition-all" />
                                    </div>
                                </div>
                            </Link>
                        )
                    }) : (
                        <div className="col-span-4 py-32 text-center border border-dashed border-slate-200">
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Sin productos registrados en esta sección</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
