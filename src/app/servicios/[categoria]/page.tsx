import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ECUADOR_CITIES, TECH_CATEGORIES } from '@/lib/seo/ecuadorData';
import { MapPin, ShieldCheck, ArrowRight, Smartphone, ChevronRight } from 'lucide-react';

interface CategoryPageProps {
    params: Promise<{
        categoria: string;
    }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
    const { categoria } = await params;
    const cat = TECH_CATEGORIES.find(c => c.slug.toLowerCase() === categoria.toLowerCase());

    if (!cat) {
        return { title: 'Servicio no encontrado | Atomic' };
    }

    return {
        title: `${cat.name} en Ecuador | Instalación y Venta Nacional`,
        description: cat.description,
        alternates: {
            canonical: `https://atomiccotizador.shop/servicios/${cat.slug}`
        }
    };
}

export default async function PseoCategoryIndexPage({ params }: CategoryPageProps) {
    const { categoria } = await params;
    const cat = TECH_CATEGORIES.find(c => c.slug.toLowerCase() === categoria.toLowerCase());

    if (!cat) {
        notFound();
    }

    // Buscar productos
    const products = await prisma.product.findMany({
        where: {
            isActive: true,
            isDeleted: false,
            OR: cat.matchKeywords.map(kw => ({
                name: { contains: kw, mode: 'insensitive' }
            }))
        },
        take: 6,
        orderBy: { price: 'desc' }
    });

    return (
        <div className="min-h-screen bg-[#070a14] text-white selection:bg-cyan-500/30 selection:text-white">
            <nav className="border-b border-white/5 bg-slate-950/40 backdrop-blur-md px-6 py-3.5">
                <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs font-mono text-slate-400">
                    <Link href="/web" className="hover:text-white transition-colors">Inicio</Link>
                    <ChevronRight size={12} />
                    <Link href="/servicios" className="hover:text-white transition-colors">Servicios Ecuador</Link>
                    <ChevronRight size={12} />
                    <span className="text-cyan-400 font-bold">{cat.name}</span>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="max-w-3xl mb-12">
                    <span className="px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 font-mono text-xs font-black uppercase tracking-widest mb-4 inline-block">
                        Línea Especializada Nacional
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white mb-4">
                        {cat.name} <span className="text-cyan-400">en Ecuador</span>
                    </h1>
                    <p className="text-slate-300 text-base leading-relaxed">
                        {cat.description}
                    </p>
                </div>

                {/* Cities Grid for this Category */}
                <div className="mb-20">
                    <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-6">
                        Selecciona tu Ciudad o Cantón
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {ECUADOR_CITIES.map((city) => (
                            <Link
                                key={city.slug}
                                href={`/servicios/${cat.slug}/${city.slug}`}
                                className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-cyan-400/50 hover:bg-slate-900 transition-all group flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-bold mb-1">
                                        <MapPin size={12} />
                                        <span>{city.name}</span>
                                    </div>
                                    <p className="text-[10px] text-slate-500 font-mono">{city.province}</p>
                                </div>
                                <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400 group-hover:text-cyan-300 transition-colors font-mono">
                                    <span>Entrega {city.estimatedDeliveryHours}h</span>
                                    <ArrowRight size={12} />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Catalog Products */}
                {products.length > 0 && (
                    <div className="border-t border-white/10 pt-16">
                        <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-8">
                            Equipos Destacados de {cat.name}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {products.map((p) => (
                                <div key={p.id} className="p-6 rounded-3xl bg-slate-900/60 border border-white/10">
                                    <h3 className="text-base font-bold text-white mb-2">{p.name}</h3>
                                    <p className="text-xl font-black text-cyan-400 mb-4">${p.price.toFixed(2)} USD</p>
                                    <a
                                        href={`https://wa.me/593969043453?text=${encodeURIComponent(`Hola Atomic, deseo cotizar el producto ${p.name} ($${p.price.toFixed(2)} USD).`)}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="w-full py-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-cyan-400/30 transition-all"
                                    >
                                        <Smartphone size={14} /> Cotizar Equipo
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
