"use client"

import React from "react"
import Link from "next/link"
import { ArrowRight, Sparkles, Rocket, Cpu, ShieldCheck, Zap } from "lucide-react"

export default function FuturisticParallaxSection() {
    return (
        <div className="w-full my-12 overflow-hidden relative selection:bg-purple-500/30">
            {/* Scoped Pure CSS Parallax Styles matching exact user snippet */}
            <style jsx>{`
                .futuristic-parallax-wrapper {
                    --background: #040517;
                    --text-color: #f0e5ff;
                    background: var(--background);
                    color: var(--text-color);
                    width: 100%;
                    position: relative;
                }

                .parallax-section {
                    position: relative;
                    min-height: 55vh;
                    display: grid;
                    place-items: center;
                    text-align: center;
                    padding: 3rem 1.5rem;
                }

                .no-parallax {
                    background: var(--background);
                    z-index: 2;
                    position: relative;
                    box-shadow: 0 0 50px rgba(4, 5, 23, 0.9);
                }

                .parallax-window {
                    position: relative;
                    min-height: 65vh;
                    display: grid;
                    place-items: center;
                    background-image: url("/images/futuristic-colony.jpg");
                    background-attachment: fixed;
                    background-position: center;
                    background-repeat: no-repeat;
                    background-size: cover;
                    z-index: 1;
                    overflow: hidden;
                }

                /* Mobile fallback for background-attachment: fixed */
                @media (max-width: 768px) {
                    .parallax-window {
                        background-attachment: scroll;
                        min-height: 45vh;
                    }
                }

                .parallax-overlay {
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(circle at center, rgba(4, 5, 23, 0.25) 0%, rgba(4, 5, 23, 0.75) 100%);
                    pointer-events: none;
                }

                .futuristic-title {
                    font-size: clamp(2rem, 5vw, 3.5rem);
                    font-weight: 400;
                    letter-spacing: -0.02em;
                    color: #f0e5ff;
                    text-shadow: 0 0 25px rgba(168, 85, 247, 0.3), 0 0 10px rgba(0, 0, 0, 0.5);
                    line-height: 1.15;
                }
            `}</style>

            <div className="futuristic-parallax-wrapper rounded-3xl border border-purple-500/20 shadow-2xl overflow-hidden max-w-7xl mx-auto">
                
                {/* ── SECCIÓN 1: NO PARALLAX (PURE CSS / INTRO) ── */}
                <section className="parallax-section no-parallax border-b border-purple-500/15">
                    <div className="max-w-3xl mx-auto space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono font-bold uppercase tracking-widest">
                            <Rocket size={14} className="text-purple-400" />
                            <span>Atomic Technologies • Próxima Generación</span>
                        </div>
                        
                        <h2 className="futuristic-title font-heading">
                            Ingeniería & Automatización 2026
                        </h2>
                        
                        <p className="text-purple-200/70 text-sm sm:text-base max-w-xl mx-auto font-sans leading-relaxed">
                            Diseñamos e integramos infraestructuras inteligentes donde la energía, la robótica y el software convergen hacia el futuro.
                        </p>
                    </div>
                </section>

                {/* ── SECCIÓN 2: PARALLAX BG (FOTO FUTURISTA - VENTANA 1) ── */}
                <section className="parallax-section parallax-window">
                    <div className="parallax-overlay" />
                    
                    <div className="relative z-10 p-6 max-w-2xl mx-auto">
                        <div className="inline-block px-6 py-3 rounded-2xl bg-[#040517]/80 border border-purple-400/40 backdrop-blur-md shadow-2xl">
                            <div className="flex items-center justify-center gap-2 text-purple-300 text-xs font-mono font-bold uppercase tracking-widest mb-1">
                                <Sparkles size={14} />
                                <span>Infraestructura Autónoma</span>
                            </div>
                            <h3 className="text-xl sm:text-3xl font-black text-white uppercase tracking-tight font-heading">
                                Bases Inteligentes & Monorrieles de Datos
                            </h3>
                        </div>
                    </div>
                </section>

                {/* ── SECCIÓN 3: NO PARALLAX (INTERMEDIO DE BENEFICIOS) ── */}
                <section className="parallax-section no-parallax border-y border-purple-500/15">
                    <div className="max-w-4xl mx-auto space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold uppercase tracking-widest">
                            <Cpu size={14} className="text-cyan-400" />
                            <span>Parallax • Pure CSS Depth</span>
                        </div>

                        <h2 className="futuristic-title font-heading">
                            Parallax
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 text-left">
                            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                                <Zap className="text-amber-400" size={24} />
                                <h4 className="text-white font-bold text-sm">Energía & Movilidad</h4>
                                <p className="text-purple-200/60 text-xs leading-relaxed">
                                    Generadores solares y vehículos eléctricos de alta autonomía para operaciones críticas.
                                </p>
                            </div>

                            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                                <ShieldCheck className="text-emerald-400" size={24} />
                                <h4 className="text-white font-bold text-sm">Seguridad Perimetral</h4>
                                <p className="text-purple-200/60 text-xs leading-relaxed">
                                    CCTV 4K inteligente, control de acceso biométrico y videoportería de grado industrial.
                                </p>
                            </div>

                            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                                <Cpu className="text-blue-400" size={24} />
                                <h4 className="text-white font-bold text-sm">Software & Bots IA</h4>
                                <p className="text-purple-200/60 text-xs leading-relaxed">
                                    Automatización de procesos empresariales y plataformas en la nube sincronizadas en tiempo real.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── SECCIÓN 4: PARALLAX BG (FOTO FUTURISTA - VENTANA 2) ── */}
                <section className="parallax-section parallax-window">
                    <div className="parallax-overlay" />
                    
                    <div className="relative z-10 p-6 max-w-2xl mx-auto">
                        <div className="inline-block px-6 py-3 rounded-2xl bg-[#040517]/80 border border-cyan-400/40 backdrop-blur-md shadow-2xl">
                            <span className="text-cyan-300 text-xs font-mono font-bold uppercase tracking-widest block mb-1">
                                🌌 Exploración & Tecnología Continua
                            </span>
                            <h3 className="text-xl sm:text-3xl font-black text-white uppercase tracking-tight font-heading">
                                Naves, Cúpulas & Sistemas de Navegación
                            </h3>
                        </div>
                    </div>
                </section>

                {/* ── SECCIÓN 5: NO PARALLAX (SMOOTH RIGHT? / CIERRE & CTA) ── */}
                <section className="parallax-section no-parallax border-t border-purple-500/15">
                    <div className="max-w-2xl mx-auto space-y-5">
                        <h2 className="futuristic-title font-heading">
                            Smooth right?
                        </h2>
                        
                        <p className="text-purple-200/70 text-xs sm:text-sm font-sans leading-relaxed">
                            Tecnología pura sin recargas lentas ni scripts pesados. Efecto Parallax fluido en CSS nativo con la visión de vanguardia de Atomic Ecuador.
                        </p>

                        <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
                            <Link
                                href="/web/automatizacion"
                                className="px-6 py-3.5 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_30px_rgba(168,85,247,0.4)] flex items-center gap-2"
                            >
                                <span>Explorar Ecosistema Futurista</span>
                                <ArrowRight size={14} />
                            </Link>

                            <a
                                href={`https://wa.me/593969043453?text=${encodeURIComponent("Hola ATOMIC! Deseo información sobre tecnología y automatización futurista.")}`}
                                target="_blank"
                                rel="noreferrer"
                                className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider border border-white/15 transition-all flex items-center gap-2"
                            >
                                <span>Hablar con un Ingeniero</span>
                            </a>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    )
}
