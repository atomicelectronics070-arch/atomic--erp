"use client"

import { motion } from "framer-motion"
import { Monitor, Smartphone, Globe, ArrowRight, ExternalLink, Code, Database, Sparkles, Hexagon, Zap, Shield, Star } from "lucide-react"
import Link from "next/link"

const demos = [
    {
        title: "Atomic E-Commerce",
        description: "Plataforma de comercio electrónico masivo con integración de pagos globales y gestión logística en tiempo real.",
        type: "Software de Comercio",
        image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=1200&auto=format&fit=crop",
        tags: ["Next.js", "Prisma", "Real-time"],
        accent: "#E8341A"
    },
    {
        title: "SaaS Dashboard Pro",
        description: "Panel administrativo de ultra-rendimiento con analítica predictiva e inteligencia de datos centralizada.",
        type: "Software de Gestión",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
        tags: ["Dashboard", "Big Data", "API"],
        accent: "#2563EB"
    },
    {
        title: "Branding & UI/UX",
        description: "Identidad visual de alto impacto y diseño de interfaces optimizadas para la máxima conversión de usuarios.",
        type: "Diseño Creativo",
        image: "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?q=80&w=1200&auto=format&fit=crop",
        tags: ["Branding", "UI/UX", "Figma"],
        accent: "#F5611A"
    },
    {
        title: "Atomic Academy",
        description: "Ecosistema de aprendizaje digital con gestión de certificaciones y trayectorias de capacitación inteligente.",
        type: "Educación Digital",
        image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=1200&auto=format&fit=crop",
        tags: ["LMS", "E-learning", "Mobile"],
        accent: "#00F0FF"
    }
]

export default function DemosPage() {
    return (
        <div className="min-h-screen bg-[#020617] text-white overflow-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#E8341A]/5 blur-[150px] animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#2563EB]/5 blur-[150px] animate-pulse delay-1000" />
            </div>

            <div className="relative z-10 pt-40 pb-32 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Hero */}
                    <header className="mb-32 space-y-8 text-center md:text-left relative">
                        <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-md mb-6">
                            <Zap size={14} className="text-[#E8341A]" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">Atomic Digital Showcase</span>
                        </div>
                        <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter italic leading-none">
                            INGENIERÍA EN <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E8341A] via-[#F5611A] to-[#2563EB]">DESARROLLO.</span>
                        </h1>
                        <p className="max-w-2xl text-white/40 text-sm md:text-lg uppercase tracking-widest leading-relaxed font-medium">
                            Soluciones tecnológicas de alto impacto. Transformamos visión en ecosistemas digitales escalables y de alto rendimiento.
                        </p>
                    </header>

                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
                        {demos.map((demo, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.8 }}
                                className="group relative"
                            >
                                {/* Browser Frame */}
                                <div className="relative aspect-[16/10] bg-slate-900 border border-white/10 overflow-hidden shadow-2xl group-hover:border-white/20 transition-all duration-500 rounded-none">
                                    {/* OS Controls */}
                                    <div className="absolute top-0 left-0 right-0 h-8 bg-slate-950/80 border-b border-white/5 flex items-center px-4 gap-2 z-20 backdrop-blur-md">
                                        <div className="flex gap-1.5">
                                            <div className="w-2 h-2 rounded-full bg-red-500/50" />
                                            <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                                            <div className="w-2 h-2 rounded-full bg-green-500/50" />
                                        </div>
                                        <div className="ml-4 h-3 w-1/3 bg-white/5 rounded-full" />
                                    </div>

                                    {/* Image */}
                                    <div className="absolute inset-0 pt-8">
                                        <img 
                                            src={demo.image} 
                                            alt={demo.title} 
                                            className="w-full h-full object-cover grayscale opacity-40 group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/20 to-transparent" />
                                    </div>

                                    {/* Overlay Label */}
                                    <div className="absolute bottom-8 left-8">
                                        <div className="px-4 py-2 bg-white/5 border border-white/10 backdrop-blur-xl mb-4">
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: demo.accent }}>{demo.type}</span>
                                        </div>
                                        <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter italic">{demo.title}</h3>
                                    </div>

                                    {/* Hover Action */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 bg-black/40 backdrop-blur-sm">
                                        <button className="px-8 py-4 bg-white text-black text-[11px] font-black uppercase tracking-[0.3em] hover:bg-[#E8341A] hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0">
                                            Lanzar Demo Pro
                                        </button>
                                    </div>
                                </div>

                                {/* Info Below */}
                                <div className="mt-10 space-y-6">
                                    <p className="text-white/40 text-[11px] uppercase tracking-widest leading-relaxed max-w-md">
                                        {demo.description}
                                    </p>
                                    <div className="flex flex-wrap gap-4">
                                        {demo.tags.map(tag => (
                                            <div key={tag} className="flex items-center gap-2">
                                                <div className="w-1 h-1 bg-white/20" />
                                                <span className="text-[9px] font-black uppercase tracking-widest text-white/30">{tag}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Bottom CTA */}
                    <footer className="mt-40 p-20 bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 text-center relative overflow-hidden">
                        <Hexagon size={300} className="absolute -top-32 -right-32 text-white/[0.02] -rotate-12 pointer-events-none" />
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic mb-8">
                                ¿TIENES UN PROYECTO <span className="text-[#E8341A]">DE ALTO NIVEL?</span>
                            </h2>
                            <p className="text-white/30 text-xs md:text-sm uppercase tracking-[0.5em] mb-12 max-w-2xl mx-auto">
                                Nuestro laboratorio de software está listo para materializar tu visión con tecnología de última generación.
                            </p>
                            <Link href="/web/contacto" className="inline-flex items-center gap-6 bg-[#E8341A] text-white px-12 py-6 text-[11px] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-[#E8341A] transition-all shadow-[0_20px_50px_rgba(232,52,26,0.3)]">
                                Iniciar Consultoría Técnica <ArrowRight size={16} />
                            </Link>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    )
}
