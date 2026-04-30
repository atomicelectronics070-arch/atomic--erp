"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight, Hexagon, Grid3X3 } from "lucide-react"

// Short descriptions for known categories
const CATEGORY_INTROS: Record<string, string> = {
    'camaras-de-seguridad': 'Sistemas de videovigilancia HD y 4K con visión nocturna, acceso remoto y almacenamiento en la nube para proteger tu hogar o negocio.',
    'antenas': 'Antenas de alta ganancia para amplificar señales WiFi, TV y radiofrecuencia hasta varios kilómetros de distancia.',
    'alarmas': 'Sistemas de alarma con sensores de movimiento, apertura y humo con alertas en tiempo real a tu teléfono.',
    'barreras-vehiculares': 'Control de acceso vehicular automático para condominios, empresas y estacionamientos de alta afluencia.',
    'cerraduras-smart-y-accesos': 'Cerraduras electrónicas con control por huella dactilar, PIN, tarjeta RFID y aplicación móvil.',
    'cable-utp': 'Cableado estructurado Cat5e, Cat6 y Cat6A para redes empresariales y residenciales de alta velocidad.',
    'iluminacion': 'Iluminación LED inteligente con control por voz, aplicación y programación horaria para todo tipo de ambientes.',
    'porteria-electronica': 'Sistemas de intercomunicación y portería electrónica para edificios residenciales y comerciales.',
    'tecnologia-residencial': 'Soluciones de domótica y tecnología inteligente para convertir tu hogar en un espacio conectado y eficiente.',
    'consolas-de-video-juegos': 'Consolas de última generación, accesorios gaming y periféricos de alto rendimiento para la mejor experiencia.',
    'gaming-consolas': 'Equipamiento gamer profesional: headsets, mandos, teclados mecánicos y pantallas de alta tasa de refresco.',
    'energia': 'Soluciones energéticas: paneles solares, inversores, UPS y baterías de respaldo para hogares y empresas.',
    'automatizacion-inteligente': 'Dispositivos IoT y sistemas de automatización para controlar iluminación, clima y seguridad desde un solo lugar.',
    'celulares-tablets-y-computacion': 'Smartphones, tablets y accesorios de computación de las principales marcas del mercado.',
    'software-desarrollo': 'Licencias de software, herramientas de desarrollo y soluciones digitales a medida para empresas.',
    'electronica-para-negocios-movilidad-y-de': 'Electrónica especializada para movilidad empresarial, logística y operaciones en campo.',
    'domotica-automatizacion-para-tu-negocio': 'Automatización integral para negocios: control de acceso, iluminación, clima y seguridad centralizada.',
    'ambientes': 'Sistemas de climatización y control ambiental para crear espacios confortables y eficientes energéticamente.',
    'repuestos-de-laptop': 'Repuestos originales y compatibles para laptops: pantallas, teclados, baterías, cargadores y más.',
    'servicios': 'Servicios técnicos profesionales de instalación, configuración y mantenimiento de sistemas tecnológicos.',
    'tienda-en-linea-a-medida': 'Desarrollo de tiendas en línea personalizadas con integración de pasarelas de pago y gestión de inventario.',
    'soft3-logistics': 'Soluciones de logística y gestión de cadena de suministro potenciadas por tecnología Soft3.',
}

const DEFAULT_INTRO = 'Explora nuestra selección de productos especializados con garantía directa de fábrica y soporte técnico profesional.'

export default function CategoriesPage() {
    const [categories, setCategories] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/web/metadata')
            .then(r => r.json())
            .then(data => {
                setCategories((data.categories || []).filter((c: any) => c.isVisible))
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [])

    if (loading) return (
        <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
            <div className="animate-spin h-10 w-10 border-4 border-[#E8341A] border-t-transparent rounded-full" />
        </div>
    )

    return (
        <div className="min-h-screen bg-[#0F172A] text-slate-200" style={{ fontFamily: "'IBM Plex Sans', ui-sans-serif, system-ui" }}>

            {/* Hero */}
            <header className="border-b border-slate-800 py-14 px-6 bg-slate-900/40">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-3 text-[#E8341A] mb-4">
                        <Grid3X3 size={16} />
                        <span className="text-[10px] font-semibold uppercase tracking-[0.3em]">Todas las Especialidades</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-light text-white uppercase tracking-tight mb-3">
                        NUESTRAS <span className="font-bold text-[#E8341A]">CATEGORÍAS</span>
                    </h1>
                    <p className="text-slate-400 text-sm font-normal max-w-xl">
                        Tecnología organizada por especialidad. Encuentra exactamente lo que necesitas para tu hogar o empresa.
                    </p>
                </div>
            </header>

            {/* Grid */}
            <main className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {categories.map((cat, i) => {
                        const intro = CATEGORY_INTROS[cat.slug] || DEFAULT_INTRO
                        return (
                            <motion.div
                                key={cat.id}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.04, duration: 0.4 }}
                            >
                                <Link
                                    href={`/web/category/${cat.slug}`}
                                    className="group flex flex-col h-full bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden hover:border-[#E8341A]/40 hover:bg-slate-800 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-[0_12px_40px_rgba(232,52,26,0.08)]"
                                >
                                    {/* Image area — silhouette mode */}
                                    <div className="relative h-44 bg-slate-900/60 flex items-center justify-center overflow-hidden border-b border-slate-700/40">
                                        {cat.image ? (
                                            <Image
                                                src={cat.image}
                                                alt={cat.name}
                                                fill
                                                className="object-contain p-10 opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-500 invert brightness-200 saturate-0"
                                            />
                                        ) : (
                                            <Hexagon className="w-16 h-16 text-slate-700 group-hover:text-slate-600 transition-colors" strokeWidth={0.8} />
                                        )}
                                        {/* Red glow on hover */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#E8341A]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>

                                    {/* Content */}
                                    <div className="p-5 flex flex-col flex-1">
                                        <h2 className="text-sm font-semibold text-white uppercase tracking-tight mb-2 group-hover:text-[#E8341A] transition-colors line-clamp-2">
                                            {cat.name}
                                        </h2>
                                        <p className="text-slate-400 text-[11px] font-normal leading-relaxed flex-1 line-clamp-3">
                                            {intro}
                                        </p>
                                        <div className="mt-4 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-slate-500 group-hover:text-[#E8341A] transition-colors">
                                            Ver productos <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        )
                    })}
                </div>
            </main>
        </div>
    )
}
