"use client"

import { motion } from "framer-motion"
import { Monitor, Smartphone, Globe, ArrowRight, ExternalLink, Code, Database, Sparkles } from "lucide-react"
import Link from "next/link"

const demos = [
    {
        title: "Atomic E-Commerce",
        description: "Tienda online de alto rendimiento con pasarela de pagos, gestión de inventario y panel administrativo.",
        type: "Tienda Pública",
        image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=800&auto=format&fit=crop",
        tags: ["Next.js", "Prisma", "Tailwind"]
    },
    {
        title: "Portal Corporativo",
        description: "Sitio web institucional con blog, gestión de servicios y optimización SEO de nivel profesional.",
        type: "Landing Page",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
        tags: ["SEO", "Analytics", "CRM"]
    },
    {
        title: "SaaS Dashboard",
        description: "Panel de control inteligente para gestión de datos, usuarios y métricas en tiempo real.",
        type: "Software de Gestión",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
        tags: ["Dashboard", "Real-time", "API"]
    },
    {
        title: "Atomic Academy",
        description: "Plataforma de e-learning con gestión de cursos, lecciones interactivas y seguimiento de alumnos.",
        type: "Educación Online",
        image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=800&auto=format&fit=crop",
        tags: ["LMS", "Video", "Quizzes"]
    }
]

export default function DemosPage() {
    return (
        <div className="min-h-screen bg-[#020617] text-white py-32 px-6">
            <div className="max-w-7xl mx-auto">
                <header className="mb-20 text-center space-y-4">
                    <p className="text-[#E8341A] font-black uppercase tracking-[0.5em] text-[10px]">Catálogo de Desarrollo</p>
                    <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter italic leading-none">DEMOS <span className="text-white/10">WEB.</span></h1>
                    <p className="text-white/40 max-w-2xl mx-auto text-[11px] uppercase tracking-widest leading-relaxed">
                        Explora las capacidades de desarrollo de Atomic. Soluciones a medida con tecnología de última generación para escalar tu presencia digital.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {demos.map((demo, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="group relative bg-slate-900/40 border border-white/5 p-1 overflow-hidden"
                        >
                            <div className="relative aspect-video overflow-hidden border border-white/5">
                                <img 
                                    src={demo.image} 
                                    alt={demo.title} 
                                    className="w-full h-full object-cover grayscale opacity-50 group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-60"></div>
                                <div className="absolute top-6 left-6">
                                    <span className="bg-[#E8341A] text-white text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 italic shadow-2xl">
                                        {demo.type}
                                    </span>
                                </div>
                            </div>

                            <div className="p-8 space-y-6">
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black uppercase tracking-tighter italic">{demo.title}</h3>
                                    <p className="text-white/50 text-[11px] leading-relaxed uppercase tracking-widest">{demo.description}</p>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {demo.tags.map(tag => (
                                        <span key={tag} className="text-[9px] font-black uppercase tracking-widest text-white/30 border border-white/10 px-2 py-1">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="pt-4 flex items-center gap-6">
                                    <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#E8341A] hover:text-white transition-colors group/btn">
                                        Explorar Demo <ExternalLink size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                    <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 hover:text-white transition-colors">
                                        Especificaciones <ArrowRight size={14} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <footer className="mt-32 p-12 bg-white/[0.02] border border-white/5 text-center">
                    <h2 className="text-2xl font-black uppercase tracking-tighter italic mb-6">¿NECESITAS UN DESARROLLO <span className="text-[#E8341A]">A MEDIDA?</span></h2>
                    <p className="text-white/40 text-[10px] uppercase tracking-[0.3em] mb-8">Nuestro equipo de ingenieros está listo para materializar tu visión.</p>
                    <Link href="/web/contacto" className="inline-flex items-center gap-4 bg-[#E8341A] text-white px-10 py-5 text-[11px] font-black uppercase tracking-widest hover:bg-white hover:text-[#E8341A] transition-all">
                        Solicitar Consultoría Técnica <Sparkles size={16} />
                    </Link>
                </footer>
            </div>
        </div>
    )
}
