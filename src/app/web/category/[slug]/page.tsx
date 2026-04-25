import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { ArrowLeft, Download, ShoppingBag, ChevronRight } from "lucide-react"

export default async function CategoryPage({ params }: { params: { slug: string } }) {
    const category = await prisma.category.findUnique({
        where: { slug: params.slug },
        include: {
            products: {
                where: { isDeleted: false, isActive: true }
            }
        }
    })

    if (!category) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8] text-center p-6">
                <div>
                    <h1 className="text-4xl font-black uppercase text-[#0F1923]/20 tracking-tighter mb-4">Categoría no encontrada</h1>
                    <Link href="/web" className="text-[#E8341A] font-black uppercase tracking-widest text-[10px] hover:underline">Volver al inicio</Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#FAFAF8] text-[#0F1923]">
            {/* Header / Cover */}
            <div className="relative h-64 md:h-96 bg-[#0F1923] flex flex-col items-center justify-center overflow-hidden">
                {category.image && (
                    <img src={category.image} alt={category.name} className="absolute inset-0 w-full h-full object-cover opacity-30" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F1923] to-transparent"></div>
                <div className="relative z-10 text-center px-6">
                    <p className="text-[#E8341A] font-black uppercase tracking-[0.4em] text-[10px] mb-4">Categoría</p>
                    <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic">{category.name}</h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-16 border-b border-[#0F1923]/5 pb-8">
                    <Link href="/web" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#0F1923]/40 hover:text-[#E8341A] transition-colors">
                        <ArrowLeft size={14} /> Volver
                    </Link>

                    {category.pdfUrl && (
                        <a 
                            href={category.pdfUrl} 
                            download={`${category.name}.pdf`}
                            className="flex items-center gap-3 bg-[#E8341A] text-white px-8 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-[#0F1923] transition-colors shadow-2xl rounded-none"
                        >
                            <Download size={14} />
                            <span>Descargar Catálogo PDF</span>
                        </a>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {category.products.length > 0 ? category.products.map(p => {
                        let imgs = [];
                        try { imgs = JSON.parse(p.images || '[]') } catch {}
                        return (
                            <Link key={p.id} href={`/web/product/${p.id}`} className="bg-white group cursor-pointer border border-[#0F1923]/6 hover:border-[#E8341A]/30 transition-all flex flex-col h-full hover:shadow-2xl shadow-[#E8341A]/10 rounded-none overflow-hidden">
                                <div className="aspect-square bg-[#F5F3F0] relative overflow-hidden flex items-center justify-center p-8 border-b border-[#0F1923]/6">
                                    {imgs.length > 0 ? (
                                        <img src={imgs[0]} className="w-full h-full object-contain mix-blend-darken opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out" />
                                    ) : (
                                        <ShoppingBag size={32} className="text-[#0F1923]/20" />
                                    )}
                                </div>
                                <div className="p-6">
                                    <h3 className="text-[11px] font-black uppercase text-[#0F1923] tracking-wider mb-2 group-hover:text-[#E8341A] transition-colors line-clamp-2">{p.name}</h3>
                                    <p className="font-mono font-black text-lg">${p.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                                </div>
                            </Link>
                        )
                    }) : (
                        <div className="col-span-4 py-32 text-center border-2 border-dashed border-[#0F1923]/10">
                            <p className="text-[12px] font-black uppercase tracking-widest text-[#0F1923]/30">No hay productos en esta categoría</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
