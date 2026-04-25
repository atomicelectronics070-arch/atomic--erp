import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { ArrowLeft, Download, ShoppingBag } from "lucide-react"

export default async function CollectionPage({ params }: { params: { slug: string } }) {
    const collection = await prisma.collection.findUnique({
        where: { slug: params.slug },
        include: {
            products: {
                where: { isDeleted: false, isActive: true }
            }
        }
    })

    if (!collection) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8] text-center p-6">
                <div>
                    <h1 className="text-4xl font-black uppercase text-[#0F1923]/20 tracking-tighter mb-4">Área de especialización no encontrada</h1>
                    <Link href="/web" className="text-[#E8341A] font-black uppercase tracking-widest text-[10px] hover:underline">Volver al inicio</Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#FAFAF8] text-[#0F1923]">
            {/* Header / Cover */}
            <div className="relative h-96 md:h-[32rem] bg-[#0F1923] flex flex-col items-center justify-center overflow-hidden">
                {collection.image && (
                    <img src={collection.image} alt={collection.name} className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F1923] via-[#0F1923]/80 to-transparent"></div>
                <div className="relative z-10 text-center px-6 max-w-4xl">
                    <p className="text-[#E8341A] font-black uppercase tracking-[0.4em] text-[10px] mb-6">Área de Especialización</p>
                    <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter italic mb-8">{collection.name}</h1>
                    
                    {collection.pdfUrl && (
                        <a 
                            href={collection.pdfUrl} 
                            download={`Brochure_${collection.name}.pdf`}
                            className="inline-flex items-center gap-3 bg-white text-[#E8341A] px-10 py-5 text-[11px] font-black uppercase tracking-widest hover:bg-[#E8341A] hover:text-white transition-all shadow-2xl rounded-none"
                        >
                            <Download size={16} />
                            <span>Descargar Brochure PDF</span>
                        </a>
                    )}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-20">
                <Link href="/web" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#0F1923]/40 hover:text-[#E8341A] transition-colors mb-16 border-b-2 border-transparent hover:border-[#E8341A] pb-1">
                    <ArrowLeft size={14} /> Volver al catálogo
                </Link>

                {/* Presentation Text */}
                {collection.description && (
                    <div className="mb-24 max-w-3xl">
                        <h2 className="text-[#E8341A] text-[10px] font-black uppercase tracking-[0.3em] mb-4">Presentación</h2>
                        <div className="prose prose-lg prose-neutral prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-a:text-[#E8341A] leading-relaxed">
                            {collection.description.split('\n').map((paragraph, idx) => (
                                <p key={idx} className="text-[#0F1923]/70">{paragraph}</p>
                            ))}
                        </div>
                    </div>
                )}

                {/* Products Grid */}
                <div>
                    <div className="mb-12 border-b border-[#0F1923]/10 pb-6 flex items-end justify-between">
                        <div>
                            <h2 className="text-4xl font-black uppercase tracking-tighter text-[#0F1923] italic">Equipamiento <span className="text-[#E8341A]">Recomendado</span></h2>
                        </div>
                        <span className="text-[10px] font-black text-[#0F1923]/30 tracking-widest">{collection.products.length} ITEMS</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {collection.products.length > 0 ? collection.products.map(p => {
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
                            <div className="col-span-4 py-24 text-center border-2 border-dashed border-[#0F1923]/10">
                                <p className="text-[12px] font-black uppercase tracking-widest text-[#0F1923]/30">Aún no hay productos recomendados en esta área</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
