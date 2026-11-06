import { Metadata } from 'next';
import Link from 'next/link';
import { ECUADOR_CITIES, TECH_CATEGORIES } from '@/lib/seo/ecuadorData';
import { ShieldCheck, MapPin, ArrowRight, Sparkles, Phone, Award } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Servicios Técnicos & Seguridad Electrónica en Ecuador | Atomic',
    description: 'Directorio oficial de soluciones de seguridad electrónica, videoporteros, barreras vehiculares y cámaras con cobertura técnica en los 221 cantones del Ecuador.',
    alternates: {
        canonical: 'https://atomiccotizador.shop/servicios'
    }
};

export default function ServiciosIndexPage() {
    return (
        <div className="min-h-screen bg-[#070a14] text-white selection:bg-cyan-500/30 selection:text-white">
            {/* Header Ambient */}
            <div className="relative pt-24 pb-16 px-6 max-w-7xl mx-auto text-center overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-r from-cyan-500/20 via-indigo-600/20 to-purple-600/20 rounded-full blur-[130px] pointer-events-none"></div>

                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 font-mono text-xs font-black uppercase tracking-widest mb-6">
                    <Sparkles size={14} className="text-cyan-400 animate-pulse" />
                    <span>Red Nacional de Cobertura e Instalación 🇪🇨</span>
                </div>

                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white mb-6">
                    Soluciones de Ingeniería & Seguridad <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500">en todo el Ecuador</span>
                </h1>

                <p className="text-slate-400 text-sm md:text-base max-w-3xl mx-auto leading-relaxed mb-10">
                    Suministro, configuración técnica e instalación profesional de videoporteros, barreras automáticas, cámaras de seguridad y control de acceso para hogares, condominios y empresas en las 24 provincias.
                </p>

                {/* Fast Action Trust Badges */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left mb-16">
                    {[
                        { title: 'Garantía Oficial', desc: 'Hasta 3 años de garantía con repuestos directos', icon: <ShieldCheck size={20} className="text-cyan-400" /> },
                        { title: 'Técnicos Certificados', desc: 'Instaladores calificados en las principales ciudades', icon: <Award size={20} className="text-emerald-400" /> },
                        { title: 'Envíos Inmediatos', desc: 'Entrega en 24 a 48 horas a domicilio nacional', icon: <MapPin size={20} className="text-indigo-400" /> },
                        { title: 'Soporte 24/7', desc: 'Atención personalizada por WhatsApp y CRM', icon: <Phone size={20} className="text-purple-400" /> }
                    ].map((b, i) => (
                        <div key={i} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
                            <div className="mb-2">{b.icon}</div>
                            <h4 className="text-xs font-bold text-white uppercase">{b.title}</h4>
                            <p className="text-[10px] text-slate-400 leading-tight mt-1">{b.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Categories Bento Grid */}
            <div className="max-w-7xl mx-auto px-6 pb-24">
                <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                    <h2 className="text-2xl font-black uppercase tracking-tight text-white">Líneas de Especialidad Técnica</h2>
                    <span className="text-xs font-mono text-cyan-400 font-bold">{TECH_CATEGORIES.length} Categorías Activas</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
                    {TECH_CATEGORIES.map((cat) => (
                        <div key={cat.slug} className="p-8 rounded-3xl bg-slate-900/60 border border-white/10 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-[0_0_40px_rgba(6,182,212,0.15)] flex flex-col justify-between group">
                            <div>
                                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{cat.warrantyYears} Años de Garantía</span>
                                <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors mt-2 mb-3">
                                    {cat.name}
                                </h3>
                                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                                    {cat.description}
                                </p>
                            </div>

                            <div>
                                <div className="text-[10px] font-mono text-slate-500 mb-3 uppercase tracking-wider">Ciudades con técnicos disponibles:</div>
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {ECUADOR_CITIES.slice(0, 5).map((city) => (
                                        <Link 
                                            key={city.slug} 
                                            href={`/servicios/${cat.slug}/${city.slug}`}
                                            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 text-[10px] font-medium transition-colors"
                                        >
                                            {city.name}
                                        </Link>
                                    ))}
                                    <span className="text-[10px] text-slate-600 self-center">+35 más</span>
                                </div>

                                <Link 
                                    href={`/servicios/${cat.slug}`}
                                    className="w-full py-3 rounded-xl bg-white/5 group-hover:bg-cyan-500/20 text-slate-300 group-hover:text-cyan-300 border border-white/10 group-hover:border-cyan-500/40 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                                >
                                    Ver Soluciones & Precios <ArrowRight size={14} />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Cities Directory Cloud */}
                <div className="p-8 md:p-12 rounded-[32px] bg-slate-950/70 border border-white/10 text-center">
                    <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-2">Ciudades y Cantones con Cobertura Directa</h3>
                    <p className="text-xs text-slate-400 max-w-xl mx-auto mb-8">
                        Selecciona tu cantón para revisar tiempos de entrega, costos de envío y disponibilidad técnica para cotización en sitio.
                    </p>

                    <div className="flex flex-wrap justify-center gap-2.5 max-w-5xl mx-auto">
                        {ECUADOR_CITIES.map((city) => (
                            <Link 
                                key={city.slug}
                                href={`/servicios/videoporteros/${city.slug}`}
                                className="px-4 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-cyan-400/50 text-xs font-mono text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
                            >
                                <MapPin size={12} className="text-cyan-400" />
                                <span>{city.name}</span>
                                <span className="text-[9px] text-slate-500">({city.province})</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
