import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { 
    ECUADOR_CITIES, 
    TECH_CATEGORIES, 
    getCityBySlug, 
    PseoCategory, 
    EcuadorCity 
} from '@/lib/seo/ecuadorData';
import { 
    ShieldCheck, Clock, MapPin, CheckCircle2, 
    Smartphone, ArrowRight, Star, HelpCircle, Truck, PhoneCall, ChevronRight 
} from 'lucide-react';

interface PageProps {
    params: Promise<{
        categoria: string;
        ciudad: string;
    }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { categoria, ciudad } = await params;
    const cat = TECH_CATEGORIES.find(c => c.slug.toLowerCase() === categoria.toLowerCase());
    const city = getCityBySlug(ciudad);

    if (!cat || !city) {
        return {
            title: 'Servicio no encontrado | Atomic Ecuador',
            description: 'Soluciones de seguridad y tecnología en Ecuador.'
        };
    }

    const title = cat.metaTitleTemplate.replace('{city}', city.name).replace('{province}', city.province);
    const description = cat.metaDescriptionTemplate.replace('{city}', city.name).replace('{province}', city.province);

    return {
        title: `${title} | Atomic`,
        description,
        alternates: {
            canonical: `https://atomiccotizador.shop/servicios/${cat.slug}/${city.slug}`
        },
        openGraph: {
            title,
            description,
            locale: 'es_EC',
            type: 'website',
            url: `https://atomiccotizador.shop/servicios/${cat.slug}/${city.slug}`,
            images: [
                {
                    url: '/images/promociones/torniquetes-portada.jpg',
                    width: 1200,
                    height: 630,
                    alt: `${cat.name} en ${city.name}`
                }
            ]
        }
    };
}

export default async function PseoCityCategoryPage({ params }: PageProps) {
    const { categoria, ciudad } = await params;
    const cat = TECH_CATEGORIES.find(c => c.slug.toLowerCase() === categoria.toLowerCase());
    const city = getCityBySlug(ciudad);

    if (!cat || !city) {
        notFound();
    }

    // Buscar productos relevantes en la base de datos de Prisma
    const products = await prisma.product.findMany({
        where: {
            isActive: true,
            isDeleted: false,
            OR: cat.matchKeywords.map(kw => ({
                name: { contains: kw, mode: 'insensitive' }
            }))
        },
        take: 6,
        orderBy: { price: 'desc' },
        select: {
            id: true,
            name: true,
            price: true,
            images: true,
            description: true
        }
    });

    const prefilledWhatsApp = encodeURIComponent(
        `Hola equipo ATOMIC Ecuador, deseo cotizar ${cat.name} para instalación en ${city.name} (${city.province}). ¿Tienen disponibilidad técnica para coordinar una inspección o envío?`
    );

    // JSON-LD Schema para Google Rich Snippets
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'LocalBusiness',
                'name': `Atomic Solutions Ecuador - ${cat.name} en ${city.name}`,
                'description': cat.description,
                'telephone': `+593 96 904 3453`,
                'address': {
                    '@type': 'PostalAddress',
                    'addressLocality': city.name,
                    'addressRegion': city.province,
                    'addressCountry': 'EC'
                },
                'priceRange': '$$',
                'url': `https://atomiccotizador.shop/servicios/${cat.slug}/${city.slug}`
            },
            {
                '@type': 'FAQPage',
                'mainEntity': cat.faqs.map(faq => ({
                    '@type': 'Question',
                    'name': faq.q.replace('{city}', city.name).replace('{province}', city.province),
                    'acceptedAnswer': {
                        '@type': 'Answer',
                        'text': faq.a.replace('{city}', city.name).replace('{province}', city.province).replace('{estimatedHours}', String(city.estimatedDeliveryHours))
                    }
                }))
            }
        ]
    };

    return (
        <div className="min-h-screen bg-[#070a14] text-white selection:bg-cyan-500/30 selection:text-white">
            {/* Inject JSON-LD Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Breadcrumb Navigation */}
            <nav className="border-b border-white/5 bg-slate-950/40 backdrop-blur-md px-6 py-3.5">
                <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs font-mono text-slate-400">
                    <Link href="/web" className="hover:text-white transition-colors">Inicio</Link>
                    <ChevronRight size={12} />
                    <Link href="/servicios" className="hover:text-white transition-colors">Servicios Ecuador</Link>
                    <ChevronRight size={12} />
                    <span className="text-slate-300">{cat.name}</span>
                    <ChevronRight size={12} />
                    <span className="text-cyan-400 font-bold">{city.name}</span>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative pt-16 pb-20 px-6 max-w-7xl mx-auto overflow-hidden">
                <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none"></div>

                <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 font-mono text-xs font-black uppercase tracking-widest mb-6">
                            <MapPin size={12} className="text-cyan-400" />
                            <span>Cobertura Técnica en {city.name}, {city.province}</span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white mb-6 leading-tight">
                            {cat.name} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500">en {city.name}</span>
                        </h1>

                        <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-8">
                            {cat.description} Disponemos de técnicos calificados para inspección en sitio, cotización formal inmediata y envíos directos con entrega en {city.estimatedDeliveryHours} horas en todo {city.name}.
                        </p>

                        {/* Local Logistics & Trust Meta */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                                <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold mb-1">
                                    <Clock size={14} /> Tiempo de Entrega
                                </div>
                                <p className="text-base font-black text-white">{city.estimatedDeliveryHours} Horas</p>
                                <span className="text-[10px] text-slate-500 font-mono">Envíos a {city.name}</span>
                            </div>

                            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                                <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold mb-1">
                                    <ShieldCheck size={14} /> Garantía Oficial
                                </div>
                                <p className="text-base font-black text-white">{cat.warrantyYears} Años</p>
                                <span className="text-[10px] text-slate-500 font-mono">Repuestos directos</span>
                            </div>

                            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 col-span-2 sm:col-span-1">
                                <div className="flex items-center gap-2 text-purple-400 text-xs font-mono font-bold mb-1">
                                    <Truck size={14} /> Cobertura Local
                                </div>
                                <p className="text-base font-black text-white">100% {city.name}</p>
                                <span className="text-[10px] text-slate-500 font-mono">Urbano y Valles</span>
                            </div>
                        </div>

                        {/* Primary Local CTA */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <a
                                href={`https://wa.me/593969043453?text=${prefilledWhatsApp}`}
                                target="_blank"
                                rel="noreferrer"
                                className="px-8 py-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-black text-xs uppercase tracking-widest hover:brightness-110 shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-3"
                            >
                                <Smartphone size={18} /> Cotizar por WhatsApp en {city.name} <ArrowRight size={16} />
                            </a>
                            <Link
                                href="/web/cart"
                                className="px-8 py-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs uppercase tracking-widest text-center transition-all flex items-center justify-center gap-2"
                            >
                                Ver Carrito & Precios
                            </Link>
                        </div>
                    </div>

                    {/* Popular Zones in City Card */}
                    <div className="w-full lg:w-96 bg-slate-900/80 border border-cyan-500/30 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
                        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10 text-xs font-mono text-cyan-400 uppercase tracking-widest">
                            <MapPin size={14} /> Sectores Frecuentes en {city.name}
                        </div>
                        <p className="text-xs text-slate-400 mb-4">
                            Atendemos condominios, urbanizaciones privadas y locales comerciales con prioridad en:
                        </p>
                        <div className="flex flex-wrap gap-2 mb-6">
                            {city.popularZones.map((zone, idx) => (
                                <span key={idx} className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-slate-300 text-xs font-medium">
                                    📍 {zone}
                                </span>
                            ))}
                        </div>
                        <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-[11px] text-cyan-300 leading-relaxed font-mono">
                            ⚡ ¿Tu sector no aparece? Cubrimos toda el área cantonal de {city.name} y parroquias aledañas de {city.province}.
                        </div>
                    </div>
                </div>
            </div>

            {/* Catalog Products for this category */}
            {products.length > 0 && (
                <div className="max-w-7xl mx-auto px-6 py-16 border-t border-white/10">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-2xl font-black uppercase tracking-tight text-white">Equipos Disponibles para Entrega en {city.name}</h2>
                            <p className="text-xs text-slate-400 mt-1">Precios oficiales en USD con stock garantizado para despacho inmediato.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((prod) => {
                            const imgList = prod.images ? prod.images.split(',') : [];
                            const mainImg = imgList[0]?.trim() || '/images/promociones/torniquetes-portada.jpg';

                            return (
                                <div key={prod.id} className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 hover:border-cyan-400/40 transition-all flex flex-col justify-between group">
                                    <div>
                                        <div className="w-full h-48 rounded-2xl bg-black/40 overflow-hidden mb-4 relative">
                                            <img 
                                                src={mainImg} 
                                                alt={prod.name} 
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                            />
                                            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-cyan-300 font-mono text-[10px] font-bold">
                                                Stock Inmediato
                                            </div>
                                        </div>
                                        <h3 className="text-base font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors line-clamp-2">
                                            {prod.name}
                                        </h3>
                                        <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                                            {prod.description || `${cat.name} con tecnología de punta y garantía de fábrica.`}
                                        </p>
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center pt-3 border-t border-white/10 mb-4">
                                            <span className="text-[10px] font-mono text-slate-500 uppercase">Precio Oficial</span>
                                            <span className="text-xl font-black text-cyan-400 font-sans">${prod.price.toFixed(2)}</span>
                                        </div>

                                        <a
                                            href={`https://wa.me/593969043453?text=${encodeURIComponent(`Hola Atomic, me interesa el equipo "${prod.name}" ($${prod.price.toFixed(2)}) para envío a ${city.name}. ¿Me pueden dar más información?`)}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="w-full py-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                                        >
                                            <Smartphone size={14} /> Consultar Disponibilidad
                                        </a>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Localized FAQ Section */}
            <div className="max-w-5xl mx-auto px-6 py-16 border-t border-white/10">
                <div className="text-center mb-12">
                    <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">Preguntas Frecuentes</span>
                    <h2 className="text-3xl font-black uppercase tracking-tight text-white mt-1">
                        Dudas sobre {cat.name} en {city.name}
                    </h2>
                </div>

                <div className="space-y-4">
                    {cat.faqs.map((faq, i) => (
                        <div key={i} className="p-6 rounded-2xl bg-slate-900/60 border border-white/10">
                            <h4 className="text-base font-bold text-white flex items-center gap-2 mb-2">
                                <HelpCircle size={16} className="text-cyan-400 shrink-0" />
                                <span>{faq.q.replace('{city}', city.name).replace('{province}', city.province)}</span>
                            </h4>
                            <p className="text-sm text-slate-300 pl-6 leading-relaxed">
                                {faq.a.replace('{city}', city.name).replace('{province}', city.province).replace('{estimatedHours}', String(city.estimatedDeliveryHours))}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Floating Bar */}
            <div className="border-t border-white/10 bg-slate-950/80 backdrop-blur-xl p-8 text-center">
                <div className="max-w-2xl mx-auto">
                    <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-2">¿Necesitas una visita técnica en {city.name}?</h3>
                    <p className="text-xs text-slate-400 mb-6">
                        Coordinamos con nuestro equipo técnico en {city.province} para evaluar tu instalación y darte la proforma formal con respaldo de empresa.
                    </p>
                    <a
                        href={`https://wa.me/593969043453?text=${prefilledWhatsApp}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 font-black text-xs uppercase tracking-widest text-white hover:brightness-110 shadow-[0_0_25px_rgba(6,182,212,0.3)] transition-all"
                    >
                        <PhoneCall size={16} /> Hablar con Asesor Técnico para {city.name}
                    </a>
                </div>
            </div>
        </div>
    );
}
