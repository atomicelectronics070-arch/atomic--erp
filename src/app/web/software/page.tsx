"use client"

import { useRef, useState, useEffect } from "react"
import { ArrowRight, ChevronLeft, ChevronRight, Code, Database, Sparkles, Smartphone } from "lucide-react"

// Custom CSS for floating animations and scroll hiding
const styles = `
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-15px); }
    100% { transform: translateY(0px); }
  }
  @keyframes float-delayed {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-15px); }
    100% { transform: translateY(0px); }
  }
  .animate-float { animation: float 6s ease-in-out infinite; }
  .animate-float-delayed { animation: float-delayed 6s ease-in-out infinite 3s; }
  .hide-scrollbar::-webkit-scrollbar { display: none; }
  .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
`

const PORTFOLIO_ITEMS = [
    {
        id: 1,
        title: "Instituto Sucre",
        category: "Plataforma EduTech",
        description: "Gestión académica integral. Redujo el tiempo de inscripción de estudiantes en un 80% mediante flujos automatizados.",
        imagePlaceholderbg: "bg-indigo-900/40",
        accent: "#6366f1",
        delay: false,
        previewUrl: "/instituto_sucre.html"
    },
    {
        id: 2,
        title: "Bodegas Logistics",
        category: "Logística Industrial",
        description: "Control de inventario en tiempo real. Algoritmos de predicción de desabastecimiento y trazabilidad QR multi-almacén.",
        imagePlaceholderbg: "bg-emerald-900/40",
        accent: "#10b981",
        delay: true,
        previewUrl: "/bodegas.html"
    },
    {
        id: 3,
        title: "Scraper Pro",
        category: "Inteligencia Competitiva",
        description: "Motor automatizado de extracción de datos masivos con exportación instantánea a Excel y CSV, impulsado por Puppeteer.",
        imagePlaceholderbg: "bg-purple-900/40",
        accent: "#a855f7",
        delay: false,
        previewUrl: "/scraper/index.html"
    },
    {
        id: 4,
        title: "Couple Games",
        category: "Entretenimiento B2C",
        description: "Aplicación interactiva y lúdica. Interfaces vibrantes con micro-animaciones fluidas diseñadas para alto engagement.",
        imagePlaceholderbg: "bg-pink-900/40",
        accent: "#ec4899",
        delay: true,
        previewUrl: "/couples-game/index.html"
    },
    {
        id: 5,
        title: "Atomic ERP Admin",
        category: "Ecosistema Central",
        description: "El núcleo operativo de ATOMIC. Simulación en vivo de nuestro panel de control de Ultra-Rendimiento.",
        imagePlaceholderbg: "bg-orange-900/40",
        accent: "#ea580c",
        delay: false,
        previewUrl: "/dashboard"
    }
]

export default function SoftwareLandingPage() {
    const scrollRef = useRef<HTMLDivElement>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [startX, setStartX] = useState(0)
    const [scrollLeft, setScrollLeft] = useState(0)
    const [activePreview, setActivePreview] = useState<string | null>(null)

    const onMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true)
        setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0))
        setScrollLeft(scrollRef.current?.scrollLeft || 0)
    }

    const onMouseLeave = () => setIsDragging(false)
    const onMouseUp = () => {
        setIsDragging(false)
    }

    const onMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return
        e.preventDefault()
        const x = e.pageX - (scrollRef.current?.offsetLeft || 0)
        const walk = (x - startX) * 2 // Velocidad de arrastre
        if (scrollRef.current) scrollRef.current.scrollLeft = scrollLeft - walk
    }

    const scroll = (offset: number) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' })
        }
    }

    return (
        <div className="min-h-screen bg-neutral-950 text-white selection:bg-orange-500/30 overflow-hidden relative">
            <style dangerouslySetInnerHTML={{ __html: styles }} />
            
            {/* INICIO MODAL DE SOFTWARE INTERACTIVO */}
            {activePreview && (
                <div className="fixed inset-0 z-[100] flex flex-col bg-neutral-950/95 backdrop-blur-3xl animate-in fade-in duration-300">
                    <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-neutral-950">
                        <div className="flex items-center space-x-4">
                            <div className="w-2.5 h-2.5 bg-orange-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(249,115,22,0.8)]" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Simulador de Entorno Operativo</span>
                        </div>
                        <button 
                            onClick={() => setActivePreview(null)}
                            className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.2em] bg-white/10 hover:bg-red-500 hover:text-white border border-white/10 px-4 py-2 transition-all"
                        >
                            <span className="hidden sm:inline">Cerrar Entorno</span>
                            <ArrowRight size={14} />
                        </button>
                    </div>
                    <div className="flex-1 w-full bg-neutral-900/50 p-2 md:p-6 overflow-hidden">
                        <div className="w-full h-full border border-white/10 bg-white shadow-2xl rounded-sm overflow-hidden relative">
                            {/* Iframe Interactivo */}
                            <iframe 
                                src={activePreview} 
                                className="w-full h-full bg-white border-0"
                                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                                title="App Preview"
                            />
                        </div>
                    </div>
                </div>
            )}
            {/* FIN MODAL */}

            {/* Background Effects */}
            <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-orange-900/20 via-neutral-950 to-neutral-950 pointer-events-none"></div>
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-orange-600/5 blur-[150px] pointer-events-none"></div>
            <div className="absolute top-[20%] right-[-10%] w-[40%] h-[50%] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none"></div>
            
            {/* Grid Texture */}
            <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 49px, #fff 49px, #fff 50px), repeating-linear-gradient(-90deg, transparent, transparent 49px, #fff 49px, #fff 50px)', backgroundSize: '50px 50px' }}></div>

            <div className="relative z-10 pt-40 pb-20">
                {/* HERO SECTION */}
                <section className="max-w-7xl mx-auto px-6 mb-32 flex flex-col items-center text-center">
                    <div className="inline-flex items-center gap-3 px-4 py-2 border border-orange-500/30 bg-orange-500/10 backdrop-blur-md rounded-full mb-8">
                        <Code size={14} className="text-orange-500" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-400">Atomic Software Labs</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.85] mb-8">
                        Ingeniería en <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-600 to-red-600">Desarrollo</span>
                    </h1>

                    <p className="max-w-3xl text-lg md:text-xl text-neutral-400 font-medium leading-relaxed">
                        Nuestra misión es brindar un <strong className="text-white">ecosistema digital integrado para toda la región</strong>, 
                        proporcionando herramientas tecnológicas que acorten exponencialmente los tiempos de ejecución administrativa y 
                        mejoren drásticamente el rendimiento de todos los procesos operativos corporativos.
                    </p>

                    <div className="mt-12 flex space-x-6 text-neutral-500">
                        <div className="flex items-center gap-2"><Database size={16} /><span className="text-[10px] font-bold uppercase tracking-widest">Data</span></div>
                        <div className="w-1 h-1 rounded-full bg-neutral-700 my-auto"></div>
                        <div className="flex items-center gap-2"><Sparkles size={16} /><span className="text-[10px] font-bold uppercase tracking-widest">Cognitive UI</span></div>
                        <div className="w-1 h-1 rounded-full bg-neutral-700 my-auto"></div>
                        <div className="flex items-center gap-2"><Smartphone size={16} /><span className="text-[10px] font-bold uppercase tracking-widest">Mobile First</span></div>
                    </div>
                </section>

                {/* SHOWCASE SECTION */}
                <section className="w-full relative">
                    <div className="max-w-7xl mx-auto px-6 mb-10 flex flex-col md:flex-row items-end justify-between gap-6">
                        <div className="space-y-2">
                            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white">
                                Interfaces Trabajadas <span className="text-neutral-600">Hasta Ahora</span>
                            </h2>
                            <p className="text-[11px] font-bold uppercase tracking-widest text-orange-500">
                                Desliza para explorar nuestro portafolio de ecosistemas
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => scroll(-400)} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors">
                                <ChevronLeft size={18} />
                            </button>
                            <button onClick={() => scroll(400)} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors">
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Scrollable Container */}
                    <div className="relative w-full overflow-hidden pb-12 pt-8">
                        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-neutral-950 to-transparent z-20 pointer-events-none"></div>
                        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-neutral-950 to-transparent z-20 pointer-events-none"></div>
                        
                        <div 
                            ref={scrollRef}
                            onMouseDown={onMouseDown}
                            onMouseLeave={onMouseLeave}
                            onMouseUp={onMouseUp}
                            onMouseMove={onMouseMove}
                            className={`flex gap-10 px-[10vw] hide-scrollbar overflow-x-auto select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                        >
                            {PORTFOLIO_ITEMS.map((item, idx) => (
                                <div 
                                    key={item.id} 
                                    className={`shrink-0 w-[320px] md:w-[380px] relative ${item.delay ? 'animate-float-delayed mt-12' : 'animate-float'}`}
                                >
                                    {/* Glass Phone Device */}
                                    <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-[40px] p-4 shadow-2xl shadow-black/50 group">
                                        <div className="absolute -inset-0.5 bg-gradient-to-b from-white/20 to-transparent rounded-[42px] z-[-1] opacity-50"></div>
                                        
                                        {/* Screen */}
                                        <div className={`w-full aspect-[9/16] rounded-[28px] overflow-hidden ${item.imagePlaceholderbg} relative flex flex-col`}>
                                            {/* Camera Notch */}
                                            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-5 bg-neutral-950 rounded-full z-10 pointer-events-none"></div>
                                            
                                            {/* Inner Simulated UI or Embedded Preview */}
                                            {item.previewUrl ? (
                                                <div className="absolute inset-0 w-full h-full bg-white opacity-40 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none">
                                                    <iframe 
                                                        src={item.previewUrl} 
                                                        className="w-[300%] h-[300%] origin-top-left scale-[0.33] border-none"
                                                        aria-hidden="true"
                                                        tabIndex={-1}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="flex-1 w-full p-6 pt-12 flex flex-col transform transition-transform duration-1000 group-hover:-translate-y-16 ease-out">
                                                    <div className="w-full flex justify-between items-center mb-8">
                                                        <div className="w-8 h-8 rounded-full bg-white/20"></div>
                                                        <div className="w-16 h-3 rounded bg-white/20"></div>
                                                    </div>
                                                    <div className="w-3/4 h-6 rounded bg-white/30 mb-3"></div>
                                                    <div className="w-1/2 h-3 rounded bg-white/20 mb-10"></div>

                                                    <div className="w-full h-32 rounded-xl bg-white/10 mb-4 border border-white/5"></div>
                                                    <div className="w-full h-32 rounded-xl bg-white/10 mb-4 border border-white/5"></div>
                                                    <div className="w-full h-32 rounded-xl bg-white/10 mb-4 border border-white/5"></div>
                                                    <div className="w-full h-32 rounded-xl bg-white/10 border border-white/5"></div>
                                                </div>
                                            )}

                                            {/* Hover Glow Accent / Click Interceptor */}
                                            <button 
                                                onClick={(e) => {
                                                    if (!isDragging && item.previewUrl) {
                                                        setActivePreview(item.previewUrl)
                                                    }
                                                }}
                                                className={`absolute inset-0 w-full flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 ${item.previewUrl ? 'cursor-pointer hover:bg-black/40' : ''} transition-all duration-500`}
                                            >
                                                <div className="w-full text-center translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                                                    <span className="text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-neutral-900 border border-white/20 shadow-2xl inline-block mb-3 hover:scale-105 transition-transform" style={{ color: item.accent }}>
                                                        {item.previewUrl ? 'INGRESAR AL SISTEMA' : 'Inspeccionar UI'}
                                                    </span>
                                                </div>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Card Info Below */}
                                    <div className="mt-8 text-center px-4">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2" style={{ color: item.accent }}>
                                            {String(idx + 1).padStart(2, '0')} // {item.category}
                                        </p>
                                        <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white mb-3">{item.title}</h3>
                                        <p className="text-neutral-400 text-xs font-medium leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
            
            {/* Bottom Glow */}
            <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-orange-600/50 to-transparent"></div>
        </div>
    )
}
