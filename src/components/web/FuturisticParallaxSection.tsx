"use client"

import React from "react"
import Link from "next/link"
import { ArrowRight, ShieldCheck, Zap, Cpu, Building2, Lock, Radio } from "lucide-react"

export default function FuturisticParallaxSection() {
    return (
        <div className="w-full my-6 overflow-hidden relative selection:bg-blue-500/30">
            {/* Scoped Pure CSS Parallax Styles */}
            <style jsx>{`
                .futuristic-parallax-wrapper {
                    --background: #08090f;
                    --text-color: #f1f5f9;
                    background: var(--background);
                    color: var(--text-color);
                    width: 100%;
                    position: relative;
                }

                .parallax-section {
                    position: relative;
                    min-height: 52vh;
                    display: grid;
                    place-items: center;
                    text-align: center;
                    padding: 3.5rem 1.5rem;
                }

                .no-parallax {
                    background: var(--background);
                    z-index: 2;
                    position: relative;
                    box-shadow: 0 0 50px rgba(5, 7, 18, 0.95);
                }

                .parallax-window-1 {
                    position: relative;
                    min-height: 65vh;
                    display: grid;
                    place-items: center;
                    background-image: url("/images/tech-command-center-4k.jpg");
                    background-attachment: fixed;
                    background-position: center;
                    background-repeat: no-repeat;
                    background-size: cover;
                    z-index: 1;
                    overflow: hidden;
                }

                .parallax-window-2 {
                    position: relative;
                    min-height: 60vh;
                    display: grid;
                    place-items: center;
                    background-image: url("/images/wholesale-tech-hub-4k.jpg");
                    background-attachment: fixed;
                    background-position: center;
                    background-repeat: no-repeat;
                    background-size: cover;
                    z-index: 1;
                    overflow: hidden;
                }

                /* Mobile fallback for background-attachment: fixed */
                @media (max-width: 768px) {
                    .parallax-window-1,
                    .parallax-window-2 {
                        background-attachment: scroll;
                        min-height: 48vh;
                    }
                }

                .parallax-overlay {
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(circle at center, rgba(8, 9, 15, 0.4) 0%, rgba(8, 9, 15, 0.85) 100%);
                    pointer-events: none;
                }

                .futuristic-title {
                    font-size: clamp(2rem, 5vw, 3.2rem);
                    font-weight: 800;
                    letter-spacing: -0.02em;
                    color: #ffffff;
                    text-shadow: 0 0 25px rgba(59, 130, 246, 0.35), 0 0 10px rgba(0, 0, 0, 0.7);
                    line-height: 1.15;
                }
            `}</style>

            <div className="futuristic-parallax-wrapper w-full border-y border-white/10 shadow-2xl overflow-hidden">
                
                {/* ── SECCIÓN 1: NO PARALLAX (INTRO ATOMIC REAL) ── */}
                <section className="parallax-section no-parallax border-b border-white/10">
                    <div className="max-w-3xl mx-auto space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-xs font-mono font-bold uppercase tracking-widest">
                            <Building2 size={14} className="text-blue-400" />
                            <span>ATOMIC Industries • Ingeniería & Seguridad 2026</span>
                        </div>
                        
                        <h2 className="futuristic-title font-heading uppercase">
                            Infraestructura, Automatización & Seguridad Electrónica
                        </h2>
                        
                        <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-sans leading-relaxed">
                            Diseñamos e integramos infraestructuras críticas: videovigilancia inteligente 4K, control de accesos perimetrales, domótica residencial y arquitectura de software sincronizada en tiempo real.
                        </p>
                    </div>
                </section>

                {/* ── SECCIÓN 2: PARALLAX BG (HQ QUITO COMANDO TECNOLÓGICO) ── */}
                <section className="parallax-section parallax-window-1">
                    <div className="parallax-overlay" />
                    
                    <div className="relative z-10 p-6 max-w-2xl mx-auto">
                        <div className="inline-block px-7 py-4 rounded-3xl bg-[#08090f]/85 border border-blue-400/40 backdrop-blur-md shadow-2xl">
                            <div className="flex items-center justify-center gap-2 text-blue-300 text-xs font-mono font-bold uppercase tracking-widest mb-1.5">
                                <Radio size={14} className="animate-pulse" />
                                <span>Centro de Mando Operativo</span>
                            </div>
                            <h3 className="text-xl sm:text-3xl font-black text-white uppercase tracking-tight font-heading">
                                Seguridad Perimetral & Redes Críticas
                            </h3>
                            <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto">
                                Sede central en Quito Norte (El Labrador) con cobertura y despacho técnico a las 24 provincias del Ecuador.
                            </p>
                        </div>
                    </div>
                </section>

                {/* ── SECCIÓN 3: NO PARALLAX (PILARES DE INGENIERÍA) ── */}
                <section className="parallax-section no-parallax border-y border-white/10">
                    <div className="max-w-4xl mx-auto space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold uppercase tracking-widest">
                            <Cpu size={14} className="text-emerald-400" />
                            <span>Integración Hardware + Software</span>
                        </div>

                        <h2 className="futuristic-title font-heading uppercase">
                            Ecosistema Tecnológico ATOMIC
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-3 text-left">
                            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5 hover:border-blue-500/40 transition-all">
                                <Lock className="text-blue-400" size={24} />
                                <h4 className="text-white font-bold text-sm">Control de Acceso & Barreras</h4>
                                <p className="text-slate-400 text-xs leading-relaxed">
                                    Torniquetes bidireccionales, barreras vehiculares de alto tráfico y cerraduras biométricas con auditoría remota.
                                </p>
                            </div>

                            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5 hover:border-emerald-500/40 transition-all">
                                <ShieldCheck className="text-emerald-400" size={24} />
                                <h4 className="text-white font-bold text-sm">CCTV 4K & Videoporteros</h4>
                                <p className="text-slate-400 text-xs leading-relaxed">
                                    Kits de videoportero con botoneras metálicas antivandálicas, reconocimiento facial y monitoreo en app móvil.
                                </p>
                            </div>

                            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5 hover:border-amber-500/40 transition-all">
                                <Zap className="text-amber-400" size={24} />
                                <h4 className="text-white font-bold text-sm">Energía & Respaldo Crítico</h4>
                                <p className="text-slate-400 text-xs leading-relaxed">
                                    Generadores eléctricos, bancos solares y cargadores para vehículos eléctricos para mantener continuidad de negocio.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── SECCIÓN 4: PARALLAX BG (LOGÍSTICA MAYORISTA & DESPACHOS) ── */}
                <section className="parallax-section parallax-window-2">
                    <div className="parallax-overlay" />
                    
                    <div className="relative z-10 p-6 max-w-2xl mx-auto">
                        <div className="inline-block px-7 py-4 rounded-3xl bg-[#08090f]/85 border border-emerald-400/40 backdrop-blur-md shadow-2xl">
                            <span className="text-emerald-300 text-xs font-mono font-bold uppercase tracking-widest block mb-1">
                                📦 Distribución Mayorista Directa
                            </span>
                            <h3 className="text-xl sm:text-3xl font-black text-white uppercase tracking-tight font-heading">
                                Stock Físico Inmediato & Despacho Express
                            </h3>
                            <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto">
                                Precios de contenedor e importación a partir de 6 unidades para tiendas, técnicos y emprendedores.
                            </p>
                        </div>
                    </div>
                </section>

                {/* ── SECCIÓN 5: NO PARALLAX (CIERRE EJECUTIVO & CTA) ── */}
                <section className="parallax-section no-parallax border-t border-white/10">
                    <div className="max-w-2xl mx-auto space-y-5">
                        <h2 className="futuristic-title font-heading uppercase">
                            Ingeniería Real en Marcha
                        </h2>
                        
                        <p className="text-slate-300 text-xs sm:text-sm font-sans leading-relaxed">
                            Respaldo directo con garantía escrita de 1 año, repuestos originales y asesoría técnica personalizada antes y después de cada instalación.
                        </p>

                        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                            <Link
                                href="/web/precios-vendedor"
                                className="px-6 py-3.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2"
                            >
                                <span>Ver Portal de Precios & Matriz PVP</span>
                                <ArrowRight size={14} />
                            </Link>

                            <a
                                href={`https://wa.me/593969043453?text=${encodeURIComponent("Hola ATOMIC! Requiero asesoría técnica para un proyecto de infraestructura o cotización.")}`}
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
