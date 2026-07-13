import Link from "next/link"
import { Shield, Zap, Radio, CheckCircle, Download, ArrowRight, ArrowDown, ChevronRight, Cpu, MonitorSmartphone, BatteryCharging, Box } from "lucide-react"
import { prisma } from "@/lib/prisma"

export default async function SharkdeckLandingPage() {
    // Buscar el producto en la DB por SKU
    const product = await prisma.product.findFirst({
        where: { sku: "SHRK-DCK-KIT-V1", isActive: true, isDeleted: false }
    })

    const productUrl = product ? `/web/product/${product.id}` : "#"

    return (
        <div className="min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-cyan-500/30 overflow-hidden">
            {/* Background effects */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-900/20 blur-[150px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-600/10 blur-[150px]" />
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.04] mix-blend-overlay" />
            </div>

            <main className="relative z-10">
                {/* 1. HERO SECTION */}
                <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 font-bold text-xs uppercase tracking-widest mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                        <Cpu size={14} /> Hardware Abierto para Makers
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[1.1] mb-6 max-w-4xl animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">
                        Construye tu propio Laboratorio de <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Ciberseguridad de Bolsillo.</span>
                    </h1>
                    
                    <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed max-w-2xl mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                        Domina el hardware hacking. Ensambla desde cero un poderoso dispositivo ESP32 para pentesting, deauther y automatización de macros, sin ser un ingeniero.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
                        <a href="#manual" className="px-8 py-4 rounded-xl bg-white text-black font-black text-lg hover:bg-slate-200 transition-all flex items-center gap-2 group shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(255,255,255,0.2)]">
                            <Download size={20} className="group-hover:-translate-y-1 transition-transform" />
                            Descargar Guía PDF Gratis
                        </a>
                        <a href="#comprar" className="px-8 py-4 rounded-xl border border-slate-700 bg-slate-800/50 text-white font-bold text-lg hover:bg-slate-800 transition-all flex items-center gap-2">
                            Ver Kit Oficial <ArrowDown size={18} />
                        </a>
                    </div>

                    <div className="mt-20 w-full max-w-4xl relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl animate-in fade-in zoom-in-95 duration-1000 delay-500">
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10" />
                        <img src="/sharkdeck/media_77fc2104-3877-4fa1-8aba-c0f973653e6e_1783100161862.jpg" alt="Sharkdeck Hero" className="w-full h-auto object-cover opacity-80" />
                    </div>
                </section>

                {/* 2. INTRODUCCIÓN Y CASOS DE USO */}
                <section className="py-24 px-6 border-y border-slate-800/50 bg-[#0A0A0A]/80 backdrop-blur-sm">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center max-w-3xl mx-auto mb-20">
                            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-6">No es un juguete. Es una <span className="text-cyan-400">Navaja Suiza</span> para el Siglo XXI.</h2>
                            <p className="text-slate-400 text-lg leading-relaxed">
                                Basado en la implacable arquitectura ESP32, el Sharkdeck te permite auditar redes, controlar entornos físicos y ejecutar scripts complejos con solo tocar una pantalla. Todo encapsulado en un módulo de grado industrial.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="bg-[#111] border border-slate-800 p-8 rounded-2xl hover:border-cyan-500/30 transition-colors group">
                                <div className="w-14 h-14 bg-cyan-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Shield className="text-cyan-400" size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">Pentesting y Deauther</h3>
                                <p className="text-slate-400 leading-relaxed">
                                    Audita vulnerabilidades en redes WiFi e intercepta tráfico (uso ético). Analiza la seguridad de tus entornos en tiempo real.
                                </p>
                            </div>

                            <div className="bg-[#111] border border-slate-800 p-8 rounded-2xl hover:border-emerald-500/30 transition-colors group">
                                <div className="w-14 h-14 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Zap className="text-emerald-400" size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">Macro / Streamdeck</h3>
                                <p className="text-slate-400 leading-relaxed">
                                    Ejecuta macros, atajos de teclado y scripts personalizados al instante desde su pantalla táctil integrada.
                                </p>
                            </div>

                            <div className="bg-[#111] border border-slate-800 p-8 rounded-2xl hover:border-purple-500/30 transition-colors group">
                                <div className="w-14 h-14 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Radio className="text-purple-400" size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">Monitoreo Portátil</h3>
                                <p className="text-slate-400 leading-relaxed">
                                    Analiza espectros y señales RF sub-GHz en cualquier lugar gracias a su diseño autónomo y batería de larga duración.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. TUTORIAL EN 4 PASOS */}
                <section className="py-24 px-6 max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-700 bg-slate-800/50 text-slate-300 font-bold text-xs uppercase tracking-widest mb-4">
                            Workflow de Ensamble
                        </div>
                        <h2 className="text-4xl font-black text-white tracking-tight">El Proceso de Creación</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-12">
                            <div className="flex gap-6">
                                <div className="shrink-0 w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-black text-xl border border-cyan-500/30">1</div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2"><Cpu size={20} className="text-cyan-400" /> El Cerebro</h3>
                                    <p className="text-slate-400 leading-relaxed">
                                        Prepara la placa base ESP32-DIV V2.0 con sus módulos RF sub-GHz integrados. El núcleo absoluto de la bestia, donde se ejecuta el firmware de control.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-6">
                                <div className="shrink-0 w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-black text-xl border border-slate-700">2</div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2"><MonitorSmartphone size={20} className="text-slate-400" /> La Interfaz</h3>
                                    <p className="text-slate-400 leading-relaxed">
                                        Conecta mediante pines SPI la pantalla táctil TFT de 2.8" para un control visual total y sin latencia de todos los comandos y escaneos.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-6">
                                <div className="shrink-0 w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-black text-xl border border-slate-700">3</div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2"><BatteryCharging size={20} className="text-slate-400" /> Energía Portátil</h3>
                                    <p className="text-slate-400 leading-relaxed">
                                        Monta el Battery Shield para celdas de litio 18650. Esto otorga autonomía extrema para operaciones y pruebas en terreno sin cables.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-6">
                                <div className="shrink-0 w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-black text-xl border border-slate-700">4</div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2"><Box size={20} className="text-slate-400" /> El Blindaje</h3>
                                    <p className="text-slate-400 leading-relaxed">
                                        Ensambla toda la electrónica dentro de nuestra carcasa modular de alta resistencia tipo PLC. Tu laboratorio está ahora listo para la batalla.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <img src="/sharkdeck/media_77fc2104-3877-4fa1-8aba-c0f973653e6e_1783100162259.jpg" alt="Sharkdeck Paso 1" className="rounded-2xl border border-slate-800 object-cover aspect-square hover:border-cyan-500/50 transition-colors" />
                            <img src="/sharkdeck/media_77fc2104-3877-4fa1-8aba-c0f973653e6e_1783100162296.jpg" alt="Sharkdeck Paso 2" className="rounded-2xl border border-slate-800 object-cover aspect-square mt-8 hover:border-cyan-500/50 transition-colors" />
                        </div>
                    </div>
                </section>

                {/* 4. LEAD MAGNET */}
                <section id="manual" className="py-24 px-6 relative">
                    <div className="absolute inset-0 bg-cyan-900/10 skew-y-[-2deg] z-0" />
                    <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#111] to-[#0A0A0A] border border-cyan-500/30 p-10 md:p-16 rounded-3xl relative z-10 shadow-[0_0_50px_rgba(6,182,212,0.1)] text-center">
                        <div className="w-16 h-16 bg-cyan-500/20 text-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-8">
                            <Download size={32} />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-white mb-4">El Mapa del Tesoro</h2>
                        <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
                            ¿Quieres conocer los diagramas de conexión exactos, los pines correctos y el firmware recomendado? Descarga gratis nuestro <strong className="text-white">Manual Gráfico de Ensamble y Configuración Avanzada en PDF.</strong>
                        </p>
                        
                        {/* Simulation Form */}
                        <form className="max-w-md mx-auto flex flex-col gap-4">
                            <input 
                                type="text" 
                                placeholder="Tu Nombre" 
                                className="w-full bg-[#050505] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                                required
                            />
                            <input 
                                type="email" 
                                placeholder="Tu Correo Electrónico" 
                                className="w-full bg-[#050505] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                                required
                            />
                            <a href="/sharkdeck_manual.pdf" download className="w-full py-4 mt-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-black uppercase tracking-widest rounded-xl hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-[1.02] transition-all flex justify-center items-center gap-2">
                                Enviar a mi correo el Manual <ChevronRight size={20} />
                            </a>
                        </form>
                    </div>
                </section>

                {/* 5. VENTA PRINCIPAL (EL KIT) */}
                <section id="comprar" className="py-24 px-6 max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-emerald-500/20 blur-[100px] rounded-full" />
                            <img src="/sharkdeck/media_77fc2104-3877-4fa1-8aba-c0f973653e6e_1783100162799.jpg" alt="Kit Completo" className="relative z-10 w-full rounded-2xl border border-slate-800 shadow-2xl" />
                            
                            {/* Badges */}
                            <div className="absolute -top-6 -right-6 bg-[#050505] border border-emerald-500/50 p-4 rounded-2xl shadow-xl z-20 flex items-center gap-3">
                                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                                <span className="font-black text-white text-sm uppercase tracking-widest">En Stock</span>
                            </div>
                        </div>

                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-bold text-xs uppercase tracking-widest mb-6">
                                La Vía Rápida
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-6">
                                Deja de buscar componentes sueltos.
                            </h2>
                            <p className="text-slate-400 text-lg mb-6 leading-relaxed">
                                Podrías pasar los próximos 3 meses buscando los componentes exactos en China, lidiar con aduanas, pagar triple envío y rogar que las pantallas sean compatibles con los pines de tu placa base...
                            </p>
                            <p className="text-white text-lg font-bold mb-10 leading-relaxed border-l-2 border-emerald-500 pl-4">
                                O puedes empezar a armarlo hoy mismo con nuestro Kit de Hardware Verificado.
                            </p>

                            <ul className="space-y-4 mb-12">
                                <li className="flex items-center gap-3 text-slate-300"><CheckCircle className="text-emerald-500 shrink-0" size={20} /> Placa base ESP32-DIV con pines pre-soldados.</li>
                                <li className="flex items-center gap-3 text-slate-300"><CheckCircle className="text-emerald-500 shrink-0" size={20} /> Pantalla táctil TFT SPI 2.8" 100% compatible.</li>
                                <li className="flex items-center gap-3 text-slate-300"><CheckCircle className="text-emerald-500 shrink-0" size={20} /> Battery Shield V3 para celdas 18650.</li>
                                <li className="flex items-center gap-3 text-slate-300"><CheckCircle className="text-emerald-500 shrink-0" size={20} /> Carcasa modular tipo PLC lista para encajar.</li>
                            </ul>

                            <Link 
                                href={productUrl}
                                className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-black font-black text-lg hover:scale-105 transition-transform shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_50px_rgba(16,185,129,0.5)] flex items-center justify-center gap-2"
                            >
                                Comprar Kit Sharkdeck Completo <ArrowRight size={20} />
                            </Link>
                            <p className="text-slate-500 text-xs mt-4 text-center sm:text-left">* Envío seguro garantizado a todo Ecuador Continental.</p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}
