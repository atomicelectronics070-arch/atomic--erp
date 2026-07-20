import React from 'react'
import { Eye, AlertTriangle, Cpu, Globe, Crosshair, Download, FileText } from 'lucide-react'
import { SummaryModal } from './SummaryModal'

export const metadata = {
    title: "El Siniestro Algoritmo de The Economist",
    description: "¿Por qué sus portadas predicen nuestra destrucción con una exactitud enfermiza? Descarga la revista The World Ahead 2026.",
}

export default function EconomistPage() {
    return (
        <div className="min-h-screen !bg-[#050505] !text-gray-300 font-sans selection:bg-red-900 selection:text-white">
            
            {/* HERO SECTION */}
            <header className="relative min-h-screen flex items-center justify-center overflow-hidden border-b border-red-900/30">
                <div className="absolute inset-0 bg-[url('/img/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none z-10"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-900/10 blur-[100px] rounded-full pointer-events-none"></div>
                
                <div className="relative z-20 max-w-4xl mx-auto px-6 text-center mt-20">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-950/50 border border-red-800 !text-red-500 font-bold text-xs uppercase tracking-widest mb-8 animate-pulse shadow-[0_0_20px_rgba(220,38,38,0.2)]">
                        <Eye size={14} /> Clasificado / Top Secret
                    </div>
                    
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black !text-white tracking-tight mb-8 leading-tight">
                        El Siniestro Algoritmo de <br />
                        <span className="!text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400">
                            The Economist
                        </span>
                    </h1>
                    
                    <p className="text-xl md:text-2xl !text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
                        ¿Por qué sus portadas predicen nuestra destrucción con una <strong className="!text-red-500">exactitud enfermiza?</strong>
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <a 
                            href="/docs/the-economist-2026.pdf" 
                            download
                            className="w-full sm:w-auto px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl shadow-[0_0_40px_rgba(220,38,38,0.4)] transition-all flex items-center justify-center gap-3 group"
                        >
                            <Download size={20} className="group-hover:-translate-y-1 transition-transform" /> 
                            Versión Completa en Inglés
                        </a>
                        
                        <SummaryModal />
                    </div>
                    
                    <p className="mt-8 text-sm text-red-500/70 font-mono tracking-widest uppercase animate-pulse">
                        ¡Te quedan segundos para entender esto antes de que ocurra! 👇
                    </p>
                </div>
            </header>

            {/* MAIN ARTICLE */}
            <main className="max-w-3xl mx-auto px-6 py-24 relative z-10">
                <article className="prose prose-invert prose-lg md:prose-xl prose-headings:font-black prose-headings:!text-white prose-p:!text-gray-300 prose-strong:!text-white max-w-none">
                    
                    <p className="lead text-2xl font-light !text-gray-300 border-l-4 border-red-600 pl-6 mb-12">
                        Cada año, The Economist lanza una portada que no falla. No aproxima; acierta con una exactitud casi enfermiza cada crisis, colapso y giro geopolítico del mundo.
                    </p>

                    <p>
                        No es misticismo ni profecía. Es una fría maquinaria de <strong className="!text-white">Big Data y análisis de datos a gran escala</strong> que procesa millones de variables. 
                        El futuro ya está escrito en sus oficinas antes de que nosotros lo vivamos. Las mentes maestras detrás de estos cálculos operan con algoritmos que devoran el comportamiento humano, las deudas nacionales y los movimientos militares para pintar el panorama del siguiente año.
                    </p>

                    <p>
                        Si miras los detalles de la edición <em className="!text-gray-200">"The World Ahead 2026"</em>, la precisión con la que se está cumpliendo todo es verdaderamente perturbadora. Hemos extraído los patrones de su portada y la conclusión es una sola: el tablero global está predeterminado.
                    </p>

                    <div className="my-16 grid grid-cols-1 md:grid-cols-2 gap-8 not-prose">
                        
                        <div className="bg-[#0a0a0a] p-8 rounded-3xl border border-red-900/30 hover:border-red-600/50 transition-colors shadow-xl">
                            <div className="w-14 h-14 bg-red-950 rounded-2xl flex items-center justify-center text-red-500 mb-6">
                                <Crosshair size={28} />
                            </div>
                            <h3 className="text-2xl font-black !text-white mb-4">La sincronía del desastre</h3>
                            <p className="!text-gray-400 text-base leading-relaxed">
                                Conectan de forma quirúrgica la distracción masiva de eventos globales (como el Mundial) con tragedias territoriales y crisis humanas (como el impacto directo en los afectados por el terremoto de Venezuela). Saben exactamente cuándo y dónde va a doler mientras el mundo mira hacia otro lado.
                            </p>
                        </div>
                        
                        <div className="bg-[#0a0a0a] p-8 rounded-3xl border border-red-900/30 hover:border-red-600/50 transition-colors shadow-xl">
                            <div className="w-14 h-14 bg-red-950 rounded-2xl flex items-center justify-center text-red-500 mb-6">
                                <Cpu size={28} />
                            </div>
                            <h3 className="text-2xl font-black !text-white mb-4">La ocupación de la IA</h3>
                            <p className="!text-gray-400 text-base leading-relaxed">
                                Predijeron su intervención masiva en la economía y la guerra mucho antes de que la Inteligencia Artificial se filtrara con tanta potencia en nuestro día a día. Los algoritmos no solo recomendarán contenido; decidirán rutas comerciales y objetivos militares.
                            </p>
                        </div>

                    </div>

                    <h2 className="!text-white">No hay magia, hay un guion</h2>
                    <p>
                        Hay un tablero global predeterminado y nosotros solo seguimos el guion de su portada. Las élites corporativas y financieras se alimentan de esta información meses antes de que suceda. Por eso invierten en armas, en oro y en data centers mientras la población general es sorprendida por "eventos inesperados".
                    </p>

                    <div className="bg-red-950/20 border border-red-900/50 p-8 rounded-3xl my-16 text-center not-prose">
                        <AlertTriangle size={48} className="text-red-500 mx-auto mb-6" />
                        <h3 className="text-3xl font-black !text-white mb-4">¿Quieres ver el mapa completo y adelantarte al colapso?</h3>
                        <p className="!text-gray-300 mb-8 max-w-xl mx-auto">
                            Hemos subido la revista íntegra en formato digital para nuestra comunidad. No te quedes a ciegas. Descárgala ahora y descifra lo que viene antes de que sea tarde.
                        </p>
                        
                        <a 
                            href="/docs/the-economist-2026.pdf" 
                            download
                            className="inline-flex items-center gap-3 px-10 py-5 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl shadow-[0_0_40px_rgba(220,38,38,0.4)] transition-all hover:scale-105"
                        >
                            <Download size={20} /> 
                            DESCARGAR EL PDF COMPLETO AQUÍ
                        </a>
                    </div>
                    
                </article>

                <div className="flex flex-wrap items-center justify-center gap-4 mt-20 pt-10 border-t border-gray-900 text-xs font-mono text-gray-600 uppercase">
                    <span>#TheEconomist</span>
                    <span>#TheWorldAhead</span>
                    <span>#BigData</span>
                    <span>#Predicciones2026</span>
                    <span>#InteligenciaArtificial</span>
                    <span>#Geopolitica</span>
                    <span>#ControlGlobal</span>
                    <span>#DescargaPDF</span>
                </div>
            </main>
            
        </div>
    )
}
