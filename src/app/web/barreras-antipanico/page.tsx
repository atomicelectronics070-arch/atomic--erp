import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { ClientImage } from "./ClientImage"
import { ShieldAlert, Activity, CheckCircle2, Factory, ShieldCheck, Flame, ArrowRight, ArrowDown } from "lucide-react"

export const metadata = {
    title: "Barreras Antipánico y de Emergencia",
    description: "Sistemas de evacuación seguros para puertas de emergencia. Venta y distribución a nivel nacional.",
}

export default async function PanicBarsLandingPage() {
    // 1. Fetch panic bars from database
    const rawProducts = await prisma.product.findMany({
        where: {
            OR: [
                { name: { contains: "antipanico", mode: "insensitive" } },
                { name: { contains: "antipánico", mode: "insensitive" } },
                { name: { contains: "push bar", mode: "insensitive" } },
                { sku: { startsWith: "CRONTE-CR" } }
            ],
            isActive: true,
            isDeleted: false
        },
        select: {
            id: true,
            name: true,
            description: true,
            price: true,
            provider: true,
            images: true,
        }
    })

    // Filter out irrelevant items
    const relevantProducts = rawProducts.filter(p => !p.name.toLowerCase().includes("manija"))

    // Deduplicate by name
    const uniqueProducts = []
    const seenNames = new Set()
    for (const p of relevantProducts) {
        if (!seenNames.has(p.name)) {
            seenNames.add(p.name)
            uniqueProducts.push(p)
        }
    }

    // Sort by price ASC
    const products = uniqueProducts.sort((a, b) => a.price - b.price)

    return (
        <div className="min-h-screen bg-white text-black font-sans selection:bg-[#FF6347]/30">
            
            {/* HERO SECTION */}
            <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden border-b border-gray-200">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-white z-0"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#FF6347]/10 blur-[120px] rounded-full pointer-events-none"></div>
                
                <div className="relative z-10 max-w-5xl mx-auto px-6 text-center mt-20">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF6347]/10 border border-[#FF6347]/20 text-[#FF6347] font-bold text-xs uppercase tracking-widest mb-8 animate-pulse">
                        <ShieldAlert size={14} /> Seguridad Vital & Evacuación Rápida
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-black text-black tracking-tight mb-6 leading-tight">
                        La Frontera Entre <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6347] to-[#FF4500]">
                            El Peligro y la Salida.
                        </span>
                    </h1>
                    
                    <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed font-medium">
                        En una situación de pánico, un segundo marca la diferencia. Nuestras 
                        <strong className="text-black"> Barreras Antipánico de Grado Comercial </strong> 
                        están diseñadas para garantizar una evacuación instintiva, inmediata y sin esfuerzo. 
                        Cumplen con los más estrictos estándares mundiales.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a href="#catalogo" className="px-8 py-4 bg-gradient-to-r from-[#FF6347] to-[#FF4500] hover:from-[#E5533D] hover:to-[#E03E00] text-white font-bold rounded-xl shadow-[0_0_40px_rgba(255,99,71,0.3)] transition-all flex items-center gap-2 group">
                            Ver Modelos Disponibles 
                            <ArrowDown size={18} className="group-hover:translate-y-1 transition-transform" />
                        </a>
                    </div>
                </div>
            </section>

            {/* BENEFITS SECTION */}
            <section className="py-24 bg-gray-50 relative border-b border-gray-200">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white border border-gray-200 p-8 rounded-2xl hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-[#FF6347]/10 rounded-xl flex items-center justify-center text-[#FF6347] mb-6">
                                <Activity size={24} />
                            </div>
                            <h3 className="text-xl font-black text-black mb-3">Respuesta Instintiva</h3>
                            <p className="text-gray-600 text-sm leading-relaxed font-medium">
                                Su mecanismo de empuje suave permite la apertura inmediata incluso con las manos ocupadas, garantizando una salida rápida durante avalanchas humanas o visibilidad nula.
                            </p>
                        </div>
                        <div className="bg-white border border-gray-200 p-8 rounded-2xl hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-black mb-6">
                                <Flame size={24} />
                            </div>
                            <h3 className="text-xl font-black text-black mb-3">Resistencia al Fuego</h3>
                            <p className="text-gray-600 text-sm leading-relaxed font-medium">
                                Construidas con aleaciones resistentes a altas temperaturas. Mantienen su integridad estructural y mecanismo interno intactos durante un incendio, evitando bloqueos.
                            </p>
                        </div>
                        <div className="bg-white border border-gray-200 p-8 rounded-2xl hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-6">
                                <ShieldCheck size={24} />
                            </div>
                            <h3 className="text-xl font-black text-black mb-3">Alta Durabilidad</h3>
                            <p className="text-gray-600 text-sm leading-relaxed font-medium">
                                Diseñadas para uso intensivo en hospitales, centros comerciales y fábricas. Soportan miles de ciclos diarios de apertura sin perder calibración ni desgastar sus componentes.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CATALOG SECTION */}
            <section id="catalogo" className="py-32 relative bg-white">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-black text-black mb-6">Equipamiento de Evacuación</h2>
                        <p className="text-gray-500 max-w-2xl mx-auto font-medium">
                            Comparamos las mejores barreras antipánico de la industria, ordenadas desde los modelos más accesibles hasta los sistemas de anclaje de grado militar.
                        </p>
                    </div>

                    <div className="space-y-12">
                        {products.map((product, idx) => {
                            let images = []
                            try {
                                images = JSON.parse(product.images || "[]")
                            } catch (e) {
                                images = []
                            }
                            
                            // Corrección de imagen rota
                            let mainImage = images[0] || "/img/panic_bar_fallback.png"
                            
                            const cleanProductName = product.name;
                            
                            return (
                                <div key={product.id} className="group relative bg-white border border-gray-200 rounded-3xl overflow-hidden hover:border-[#FF6347]/50 hover:shadow-xl transition-all duration-500 flex flex-col md:flex-row items-stretch">
                                    
                                    {/* Product Image Side */}
                                    <div className="md:w-2/5 bg-gray-50 relative p-12 flex items-center justify-center shrink-0 border-b md:border-b-0 md:border-r border-gray-200">
                                        <ClientImage 
                                            src={mainImage} 
                                            alt={cleanProductName} 
                                            className="w-full h-auto max-h-[300px] object-contain group-hover:scale-105 transition-transform duration-700 mix-blend-multiply" 
                                        />
                                    </div>
                                    
                                    {/* Product Details Side */}
                                    <div className="p-8 md:p-12 flex flex-col justify-between flex-1 relative">
                                        
                                        <div>
                                            <div className="flex items-center gap-3 mb-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                                                <span>Categoría Fuego y Evacuación</span>
                                                <span>•</span>
                                                <span className="text-[#FF6347]">Nivel {idx + 1}</span>
                                            </div>
                                            
                                            <h3 className="text-3xl font-black text-black mb-6 leading-tight">
                                                {cleanProductName}
                                            </h3>
                                            
                                            <div 
                                                className="prose prose-sm max-w-none text-gray-600 mb-8 font-medium"
                                                dangerouslySetInnerHTML={{ __html: product.description || "<p>Producto especializado para vías de escape de emergencia.</p>" }}
                                            />
                                            
                                            <div className="grid grid-cols-2 gap-4 mb-8">
                                                <div className="flex items-center gap-2 text-sm text-gray-600 font-bold">
                                                    <CheckCircle2 size={16} className="text-[#FF6347]" />
                                                    Instalación Inmediata
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600 font-bold">
                                                    <CheckCircle2 size={16} className="text-[#FF6347]" />
                                                    Garantía de Fábrica
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-gray-200 gap-6 mt-8">
                                            <div>
                                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Inversión de Seguridad</p>
                                                <div className="flex items-end gap-3">
                                                    <p className="text-4xl font-black text-black">${product.price.toFixed(2)}</p>
                                                    <span className="text-sm text-gray-500 font-bold mb-1">+ IVA</span>
                                                </div>
                                            </div>
                                            
                                            <Link href={`/web/product/${product.id}`} className="w-full sm:w-auto px-8 py-4 bg-black text-white font-black hover:bg-[#FF6347] transition-colors rounded-xl flex items-center justify-center gap-2 group/btn">
                                                Ver Detalles Completos
                                                <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                                            </Link>
                                        </div>
                                    </div>
                                    
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>
            
        </div>
    )
}
