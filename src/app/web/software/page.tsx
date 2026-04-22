"use client"

import { useRef, useState, useEffect } from "react"
import { ArrowRight, ChevronLeft, ChevronRight, Code, Database, Sparkles, Smartphone, X } from "lucide-react"

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
        title: "SOFT3 Logistics",
        category: "ERP de Logística",
        description: "Sistema robusto de gestión de inventarios y cadena de suministro desarrollado en Laravel para alta escalabilidad.",
        imagePlaceholderbg: "bg-blue-900/40",
        accent: "#3b82f6",
        delay: false,
        previewUrl: "/soft3.html"
    },
    {
        id: 6,
        title: "Juegos en Casa",
        category: "Catálogo Interactivo",
        description: "Plataforma de entretenimiento familiar diseñada para facilitar el acceso a juegos lúdicos en el hogar.",
        imagePlaceholderbg: "bg-amber-900/40",
        accent: "#f59e0b",
        delay: true,
        previewUrl: "/juegos_en_casa.html"
    },
    {
        id: 7,
        title: "Atomic ERP Admin",
        category: "Ecosistema Central",
        description: "El núcleo operativo de ATOMIC. Simulación en vivo de nuestro panel de control de Ultra-Rendimiento.",
        imagePlaceholderbg: "bg-orange-900/40",
        accent: "#6366f1",
        delay: false,
        previewUrl: "/dashboard"
    }
]

export default function SoftwareLandingPage() {
    const scrollRef = useRef<HTMLDivElement>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [startX, setStartX] = useState(0)
    const [scrollLeft, setScrollLeft] = useState(0)
    const [activePreview, setActivePreview] = useState<{url: string, title: string, accent: string} | null>(null)

    const onMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true)
        setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0))
        setScrollLeft(scrollRef.current?.scrollLeft || 0)
    }

    const onMouseLeave = () => setIsDragging(false)
    const onMouseUp = () => setIsDragging(false)

    const onMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return
        e.preventDefault()
        const x = e.pageX - (scrollRef.current?.offsetLeft || 0)
        const walk = (x - startX) * 2
        if (scrollRef.current) scrollRef.current.scrollLeft = scrollLeft - walk
    }

    const scroll = (offset: number) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' })
        }
    }

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setActivePreview(null)
        }
        window.addEventListener('keydown', handleEsc)
        return () => window.removeEventListener('keydown', handleEsc)
    }, [])

    return (
        <div className="min-h-screen bg-[#FAFAF8] text-[#0F1923] overflow-hidden relative">
            <style dangerouslySetInnerHTML={{ __html: styles }} />
            
            {/* INICIO MODAL DE SOFTWARE INTERACTIVO (OS WINDOW) */}
            {activePreview && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 md:p-12 animate-in fade-in duration-300"
                    onClick={() => setActivePreview(null)}
                >
                    {/* Big X button always visible */}
                    <button
                        onClick={(e) => { e.stopPropagation(); setActivePreview(null) }}
                        className="absolute top-4 right-4 z-[200] w-12 h-12 bg-red-600 hover:bg-red-500 rounded-none flex items-center justify-center shadow-2xl shadow-red-900/50 transition-all hover:scale-110"
                        aria-label="Cerrar preview"
                    >
                        <X size={22} className="text-white" />
                    </button>

                    <div
                        className="relative w-full h-full max-w-7xl flex flex-col bg-slate-950 rounded-none border border-white/20 shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden scale-in-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        
                        {/* OS Header Bar (IMPROVED CONTROLS) */}
                        <div className="h-16 bg-neutral-900 border-b border-white/10 flex items-center justify-between px-6 shrink-0 z-50">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center space-x-2">
                                    <button 
                                        onClick={() => setActivePreview(null)} 
                                        className="group relative w-5 h-5 rounded-none bg-red-500 hover:bg-red-400 transition-all shadow-lg flex items-center justify-center" 
                                        aria-label="Cerrar"
                                    >
                                        <X size={10} className="text-red-900 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </button>
                                    <div className="w-5 h-5 rounded-none bg-yellow-500/50 shadow-inner"></div>
                                    <div className="w-5 h-5 rounded-none bg-green-500/50 shadow-inner"></div>
                                </div>
                                <button 
                                    onClick={() => setActivePreview(null)}
                                    className="text-[10px] font-black uppercase tracking-widest text-neutral-500 hover:text-white transition-colors flex items-center gap-2"
                                >
                                    <span className="w-px h-4 bg-white/10 mx-2" />
                                    Cerrar Vista (ESC)
                                </button>
                            </div>

                            <div className="flex-1 flex justify-center pointer-events-none">
                                <div className="bg-black/50 border border-white/10 rounded-none px-8 py-2 flex items-center space-x-3 backdrop-blur-md">
                                    <Sparkles size={12} style={{ color: activePreview.accent }} />
                                    <span className="text-[11px] font-black uppercase tracking-[0.25em] text-neutral-400">
                                        Navegando: <span className="text-white">{activePreview.title}</span>
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <span className="text-[9px] font-bold text-neutral-600 uppercase tracking-widest hidden md:block">Safe Environment</span>
                                <div className="w-2 h-2 rounded-none bg-green-500 animate-pulse" />
                            </div>
                        </div>

                        {/* Iframe Interactivo */}
                        <div className="flex-1 w-full bg-neutral-100 flex relative overflow-hidden group">
                           {/* Decorative inner framing */}
                           <div className="absolute inset-0 border-x-4 border-b-4 pointer-events-none z-10 opacity-50" style={{ borderColor: activePreview.accent }}></div>
                           
                           {/* Loader Skeleton (hidden instantly when iframe overrides) */}
                           <div className="absolute inset-0 flex items-center justify-center bg-neutral-100 text-neutral-400 z-0">
                               <div className="flex flex-col items-center animate-pulse">
                                  <Database size={32} className="mb-4" />
                                  <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">Iniciando Servidor...</span>
                               </div>
                           </div>

                           <iframe 
                                src={activePreview.url} 
                                className="w-full h-full border-0 relative z-10 bg-white"
                                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                                title="App Preview"
                            />
                        </div>
                    </div>
                </div>
            )}
            {/* FIN MODAL */}

            {/* Background Effects */}
            <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-[#E8341A]/8 via-[#FAFAF8] to-[#FAFAF8] pointer-events-none"></div>
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-none bg-[#E8341A]/4 blur-[150px] pointer-events-none"></div>
            <div className="absolute top-[20%] right-[-10%] w-[40%] h-[50%] rounded-none bg-[#2563EB]/4 blur-[120px] pointer-events-none"></div>
            
            {/* Grid Texture */}
            <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 49px, #fff 49px, #fff 50px), repeating-linear-gradient(-90deg, transparent, transparent 49px, #fff 49px, #fff 50px)', backgroundSize: '50px 50px' }}></div>

            <div className="relative z-10 pt-40 pb-20">
                {/* HERO SECTION */}
                <section className="max-w-7xl mx-auto px-6 mb-32 flex flex-col items-center text-center">
                    <div className="inline-flex items-center gap-3 px-4 py-2 border border-[#E8341A]/25 bg-[#E8341A]/8 backdrop-blur-md rounded-none mb-8">
                        <Code size={14} className="text-[#E8341A]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#E8341A]">Atomic Software Labs</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.85] mb-8 text-[#0F1923]">
                        Ingeniería en <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E8341A] via-[#F5611A] to-[#2563EB]">Desarrollo</span>
                    </h1>

                    <p className="max-w-3xl text-lg md:text-xl text-[#0F1923]/50 font-medium leading-relaxed">
                        Nuestra misión es brindar un <strong className="text-[#0F1923]">ecosistema digital integrado para toda la región</strong>,
                        proporcionando herramientas tecnológicas que acorten exponencialmente los tiempos de ejecución administrativa y
                        mejoren drásticamente el rendimiento de todos los procesos operativos corporativos.
                    </p>

                    <div className="mt-12 flex space-x-6 text-[#0F1923]/30">
                        <div className="flex items-center gap-2"><Database size={16} /><span className="text-[10px] font-bold uppercase tracking-widest">Data</span></div>
                        <div className="w-1 h-1 rounded-none bg-[#0F1923]/15 my-auto"></div>
                        <div className="flex items-center gap-2"><Sparkles size={16} /><span className="text-[10px] font-bold uppercase tracking-widest">Cognitive UI</span></div>
                        <div className="w-1 h-1 rounded-none bg-[#0F1923]/15 my-auto"></div>
                        <div className="flex items-center gap-2"><Smartphone size={16} /><span className="text-[10px] font-bold uppercase tracking-widest">Mobile First</span></div>
                    </div>
                </section>

                {/* SHOWCASE SECTION */}
                <section className="w-full relative">
                    <div className="max-w-7xl mx-auto px-6 mb-10 flex flex-col md:flex-row items-end justify-between gap-6">
                        <div className="space-y-2">
                            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-[#0F1923]">
                                Interfaces Trabajadas <span className="text-[#0F1923]/25">Hasta Ahora</span>
                            </h2>
                            <p className="text-[11px] font-bold uppercase tracking-widest text-[#E8341A]">
                                Desliza para explorar nuestro portafolio de ecosistemas
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => scroll(-400)} className="w-12 h-12 rounded-none border border-[#0F1923]/12 flex items-center justify-center text-[#0F1923]/40 hover:bg-[#E8341A]/8 hover:text-[#E8341A] hover:border-[#E8341A]/30 transition-colors z-20">
                                <ChevronLeft size={18} />
                            </button>
                            <button onClick={() => scroll(400)} className="w-12 h-12 rounded-none border border-[#0F1923]/12 flex items-center justify-center text-[#0F1923]/40 hover:bg-[#E8341A]/8 hover:text-[#E8341A] hover:border-[#E8341A]/30 transition-colors z-20">
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Scrollable Container */}
                    <div className="relative w-full overflow-hidden pb-12 pt-8">
                        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#FAFAF8] to-transparent z-20 pointer-events-none"></div>
                        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#FAFAF8] to-transparent z-20 pointer-events-none"></div>
                        
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
                                    <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-none-[40px] p-4 shadow-2xl shadow-black/50 group">
                                        <div className="absolute -inset-0.5 bg-gradient-to-b from-white/20 to-transparent rounded-none-[42px] z-[-1] opacity-50 pointer-events-none"></div>
                                        
                                        {/* Screen */}
                                        <div className={`w-full aspect-[9/16] rounded-none-[28px] overflow-hidden ${item.imagePlaceholderbg} relative flex flex-col cursor-pointer`}
                                             onClick={(e) => {
                                                if (!isDragging && item.previewUrl) {
                                                    setActivePreview({url: item.previewUrl, title: item.title, accent: item.accent})
                                                }
                                             }}
                                        >
                                            {/* Camera Notch */}
                                            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-5 bg-neutral-950 rounded-none z-10 pointer-events-none shadow-md"></div>
                                            
                                            {/* Inner UI: Real Iframe Scaled Down or Mock */}
                                            {item.previewUrl ? (
                                                <div className="absolute inset-0 w-full h-full bg-white transition-opacity duration-1000 pointer-events-none overflow-hidden">
                                                    {/* Scale down the iframe to fit the phone screen aspect ratio */}
                                                    <iframe 
                                                        src={item.previewUrl} 
                                                        className="w-[300%] h-[300%] origin-top-left scale-[0.33] border-none absolute top-0 left-0"
                                                        aria-hidden="true"
                                                        tabIndex={-1}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="flex-1 w-full p-6 pt-12 flex flex-col transform transition-transform duration-1000 group-hover:-translate-y-8 ease-out pointer-events-none">
                                                    <div className="w-full flex justify-between items-center mb-8">
                                                        <div className="w-8 h-8 rounded-none bg-white/20 shadow-sm"></div>
                                                        <div className="w-16 h-3 rounded-none bg-white/20 shadow-sm"></div>
                                                    </div>
                                                    <div className="flex space-x-2 w-full mb-3">
                                                        <div className="flex-1 h-20 rounded-none bg-white/10 shadow-sm"></div>
                                                        <div className="flex-1 h-20 rounded-none bg-white/10 shadow-sm"></div>
                                                    </div>
                                                    <div className="w-3/4 h-8 rounded-none mb-6 shadow-sm" style={{ backgroundColor: item.accent, opacity: 0.8 }}></div>

                                                    <div className="w-full h-24 rounded-none bg-white/10 mb-4 border border-white/5 shadow-sm"></div>
                                                    <div className="w-full h-24 rounded-none bg-white/10 mb-4 border border-white/5 shadow-sm"></div>
                                                    <div className="w-full h-24 rounded-none bg-white/10 mb-4 border border-white/5 shadow-sm"></div>
                                                    <div className="w-full flex-1 rounded-none bg-white/10 border border-white/5 shadow-sm"></div>
                                                </div>
                                            )}

                                            {/* Hover Glow Accent / Call to action */}
                                            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                <div className="w-full text-center translate-y-8 group-hover:translate-y-0 transition-all duration-500 ease-out">
                                                    <span className="text-[10px] font-black uppercase tracking-widest px-4 py-3 bg-neutral-900 border border-white/20 shadow-2xl rounded-none inline-block scale-95 group-hover:scale-100 transition-transform duration-300" style={{ color: item.accent }}>
                                                        {item.previewUrl ? 'INSPECCIONAR UI / ABRIR' : 'Próximamente'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card Info Below */}
                                    <div className="mt-8 px-4 text-left border-l-2 pl-4 ml-6 transition-colors duration-500" style={{ borderColor: `${item.accent}50` }}>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2" style={{ color: item.accent }}>
                                            [0{idx + 1}] // {item.category}
                                        </p>
                                        <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-[#0F1923] mb-2">{item.title}</h3>
                                        <p className="text-[#0F1923]/40 text-xs font-medium leading-relaxed max-w-[90%]">
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
            <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#E8341A]/30 to-transparent"></div>
        </div>
    )
}
