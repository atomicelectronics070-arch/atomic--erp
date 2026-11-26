"use client"

import React from "react"
import Link from "next/link"
import { ArrowRight, ShieldCheck, Cpu, Building2, Lock, Bot, Sparkles, MessageSquare, Mic, Home, Smartphone, Globe, Package, Zap } from "lucide-react"

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
                    min-height: 44vh;
                    display: grid;
                    place-items: center;
                    text-align: center;
                    padding: 3.75rem 1.5rem;
                }

                .no-parallax {
                    background: var(--background);
                    z-index: 2;
                    position: relative;
                    box-shadow: 0 0 50px rgba(5, 7, 18, 0.95);
                }

                .parallax-window-1 {
                    position: relative;
                    min-height: 60vh;
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
                    min-height: 56vh;
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
                        min-height: 46vh;
                    }
                }

                .parallax-overlay {
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(circle at center, rgba(8, 9, 15, 0.4) 0%, rgba(8, 9, 15, 0.85) 100%);
                    pointer-events: none;
                }

                .futuristic-title {
                    font-size: clamp(1.9rem, 4.4vw, 3.25rem);
                    font-weight: 900;
                    letter-spacing: -0.02em;
                    color: #ffffff;
                    text-shadow: 0 0 28px rgba(59, 130, 246, 0.4), 0 0 12px rgba(0, 0, 0, 0.75);
                    line-height: 1.12;
                }
            `}</style>

            <div className="futuristic-parallax-wrapper w-full border-y border-white/10 shadow-2xl overflow-hidden">
                
                {/* ── SECCIÓN 1: NO PARALLAX (PROYECTOS DE TECNOLOGÍA Y AUTOMATIZACIÓN RESIDENCIAL) ── */}
                <section className="parallax-section no-parallax border-b border-white/10 overflow-hidden">
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.18),_transparent_65%)]"
                    />
                    <div className="relative z-10 max-w-6xl mx-auto space-y-6 w-full">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-xs font-mono font-bold uppercase tracking-widest">
                            <Building2 size={14} className="text-blue-400" />
                            <span>ATOMIC Industries • Ingeniería & Domótica 2026</span>
                        </div>
                        
                        <h2 className="futuristic-title font-heading uppercase max-w-4xl mx-auto">
                            Creación de Proyectos de Tecnología y Automatización Residencial
                        </h2>
                        
                        <p className="text-slate-300 text-sm sm:text-base max-w-3xl mx-auto font-sans leading-relaxed">
                            Diseñamos, equipamos e integramos hogares inteligentes, edificios y conjuntos residenciales llave en mano: domótica integral, cerraduras biométricas, videovigilancia 4K, accesos automatizados y control total en tiempo real.
                        </p>

                        {/* 4 Pilares de Proyectos Residenciales */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-3 text-left">
                            <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-blue-400/50 transition-all space-y-2">
                                <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-400/30 flex items-center justify-center text-blue-300">
                                    <Home size={18} />
                                </div>
                                <h3 className="text-white font-bold text-sm uppercase tracking-tight font-heading">Domótica Integral</h3>
                                <p className="text-slate-400 text-xs leading-relaxed">
                                    Iluminación inteligente, cortinas motorizadas, climatización y escenas automatizadas por voz o app.
                                </p>
                            </div>

                            <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-cyan-400/50 transition-all space-y-2">
                                <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
                                    <Lock size={18} />
                                </div>
                                <h3 className="text-white font-bold text-sm uppercase tracking-tight font-heading">Accesos Biométricos</h3>
                                <p className="text-slate-400 text-xs leading-relaxed">
                                    Cerraduras faciales 3D, videoporteros IP Wi-Fi y apertura remota para casas y edificios.
                                </p>
                            </div>

                            <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-emerald-400/50 transition-all space-y-2">
                                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
                                    <ShieldCheck size={18} />
                                </div>
                                <h3 className="text-white font-bold text-sm uppercase tracking-tight font-heading">Seguridad Perimetral 4K</h3>
                                <p className="text-slate-400 text-xs leading-relaxed">
                                    Videovigilancia con IA, alertas instantáneas al móvil, portones automáticos y respaldo continuo.
                                </p>
                            </div>

                            <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-amber-400/50 transition-all space-y-2">
                                <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-300">
                                    <Smartphone size={18} />
                                </div>
                                <h3 className="text-white font-bold text-sm uppercase tracking-tight font-heading">Ingeniería Llave en Mano</h3>
                                <p className="text-slate-400 text-xs leading-relaxed">
                                    Levantamiento en obra, cableado estructurado, red Mesh pro y soporte técnico post-instalación.
                                </p>
                            </div>
                        </div>

                        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                            <a
                                href={`https://wa.me/593969043453?text=${encodeURIComponent("Hola ATOMIC! Deseo cotizar un proyecto de tecnología y automatización residencial.")}`}
                                target="_blank"
                                rel="noreferrer"
                                className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2"
                            >
                                <span>Cotizar Proyecto Residencial</span>
                                <ArrowRight size={14} />
                            </a>
                            <Link
                                href="/web/cerraduras-smart"
                                className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider border border-white/15 transition-all"
                            >
                                Ver Kits Smart & Cerraduras
                            </Link>
                        </div>
                    </div>
                </section>

                {/* ── SECCIÓN 2: PARALLAX BG (SOFTWARE A MEDIDA & AGENTES DE IA POR VOZ O TEXTO) ── */}
                <section className="parallax-section parallax-window-1">
                    <div className="parallax-overlay" />
                    
                    <div className="relative z-10 px-4 py-6 max-w-5xl mx-auto w-full">
                        <div className="rounded-3xl bg-[#08090f]/78 border border-blue-400/35 backdrop-blur-md shadow-[0_25px_70px_rgba(2,6,23,0.85)] px-6 sm:px-10 py-7 sm:py-8 space-y-5">
                            <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/15 border border-blue-400/35 text-blue-300 text-xs font-mono font-bold uppercase tracking-widest">
                                <Bot size={14} className="text-blue-400 animate-pulse" />
                                <span>Software de Administración a Medida • Agentes IA</span>
                            </div>

                            <div className="space-y-2.5">
                                <h3 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight font-heading leading-tight">
                                    Olvídate de los Sistemas ERP Tradicionales
                                </h3>
                                <p className="text-xs sm:text-sm text-slate-200 max-w-3xl mx-auto leading-relaxed">
                                    Diseñamos software de administración totalmente a tu medida con agentes de Inteligencia Artificial que ejecutan tu operación diaria por ti —ventas, inventario, cobros y reportes— mediante comandos naturales de <strong className="text-cyan-300">voz o texto</strong>.
                                </p>
                            </div>

                            {/* 3 Pilares estructurados de operación IA */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1 text-left">
                                <div className="p-4 rounded-2xl bg-white/[0.05] border border-white/10 hover:border-cyan-400/45 transition-all space-y-1.5">
                                    <div className="flex items-center gap-2 text-cyan-300 text-xs font-mono font-bold uppercase tracking-wider">
                                        <Mic size={14} />
                                        <MessageSquare size={14} />
                                        <span>Voz o Texto</span>
                                    </div>
                                    <p className="text-white font-bold text-xs sm:text-sm">Control Conversacional Directo</p>
                                    <p className="text-slate-300 text-[11px] sm:text-xs leading-relaxed">
                                        Habla o escribe lo que necesitas y el sistema registra, consulta y responde al instante sin menús complejos.
                                    </p>
                                </div>

                                <div className="p-4 rounded-2xl bg-white/[0.05] border border-white/10 hover:border-blue-400/45 transition-all space-y-1.5">
                                    <div className="flex items-center gap-2 text-blue-300 text-xs font-mono font-bold uppercase tracking-wider">
                                        <Bot size={14} />
                                        <span>Gestión Autónoma</span>
                                    </div>
                                    <p className="text-white font-bold text-xs sm:text-sm">Agentes que Trabajan por Ti</p>
                                    <p className="text-slate-300 text-[11px] sm:text-xs leading-relaxed">
                                        Cotizaciones, facturación, control de stock y seguimiento de clientes automatizados 24/7.
                                    </p>
                                </div>

                                <div className="p-4 rounded-2xl bg-white/[0.05] border border-white/10 hover:border-emerald-400/45 transition-all space-y-1.5">
                                    <div className="flex items-center gap-2 text-emerald-300 text-xs font-mono font-bold uppercase tracking-wider">
                                        <Sparkles size={14} />
                                        <span>100% Exclusivo</span>
                                    </div>
                                    <p className="text-white font-bold text-xs sm:text-sm">Diseño Totalmente a Medida</p>
                                    <p className="text-slate-300 text-[11px] sm:text-xs leading-relaxed">
                                        Cada flujo se adapta a la lógica real de tu empresa, sin forzarte a usar plantillas ERP genéricas.
                                    </p>
                                </div>
                            </div>

                            <div className="pt-1 flex flex-wrap items-center justify-center gap-3">
                                <a
                                    href={`https://wa.me/593969043453?text=${encodeURIComponent("Hola ATOMIC! Deseo diseñar un software administrativo a medida con agentes de IA por voz y texto para mi empresa.")}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-600/30 inline-flex items-center gap-2"
                                >
                                    <span>Diseñar Mi Agente IA a Medida</span>
                                    <ArrowRight size={14} />
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── SECCIÓN 3: NO PARALLAX (ECOSISTEMA HARDWARE + SOFTWARE PARA PROYECTOS COMPLEJOS) ── */}
                <section className="parallax-section no-parallax border-y border-white/10">
                    <div className="max-w-6xl mx-auto space-y-6 w-full">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold uppercase tracking-widest">
                            <Cpu size={14} className="text-emerald-400" />
                            <span>Integración Hardware + Software</span>
                        </div>

                        <div className="space-y-3">
                            <h2 className="futuristic-title font-heading uppercase">
                                Ecosistema Tecnológico ATOMIC
                            </h2>
                            <p className="text-slate-300 text-sm sm:text-base max-w-3xl mx-auto font-sans leading-relaxed">
                                Diseñamos propuestas de alto impacto para proyectos tecnológicos de alcance complejo, uniendo electrónica profesional y software inteligente con una arquitectura clara, escalable y fácil de operar.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 lg:gap-6 pt-3 text-left">
                            <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 space-y-3 hover:border-blue-500/45 transition-all">
                                <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-400/30 flex items-center justify-center text-blue-400">
                                    <Building2 size={22} />
                                </div>
                                <h4 className="text-white font-bold text-base font-heading">Configuraciones en Instituciones</h4>
                                <p className="text-slate-300 text-xs sm:text-[13px] leading-relaxed">
                                    Estructuramos infraestructuras completas para empresas, entidades educativas y corporaciones: conectividad robusta, control centralizado y automatización diseñada para operar a gran escala.
                                </p>
                            </div>

                            <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 space-y-3 hover:border-emerald-500/45 transition-all">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                                    <Cpu size={22} />
                                </div>
                                <h4 className="text-white font-bold text-base font-heading">Sistemas Particulares a Medida</h4>
                                <p className="text-slate-300 text-xs sm:text-[13px] leading-relaxed">
                                    Desarrollamos arquitecturas exclusivas donde hardware especializado y software propio trabajan sincronizados, resolviendo necesidades técnicas complejas que los paquetes estándar no cubren.
                                </p>
                            </div>

                            <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 space-y-3 hover:border-cyan-500/45 transition-all">
                                <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
                                    <ShieldCheck size={22} />
                                </div>
                                <h4 className="text-white font-bold text-base font-heading">Módulos de Seguridad Residencial</h4>
                                <p className="text-slate-300 text-xs sm:text-[13px] leading-relaxed">
                                    Implementamos soluciones claras e intuitivas para hogares y conjuntos: protección perimetral inteligente, accesos digitales y alertas en tiempo real sin complicaciones técnicas.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── SECCIÓN 4: PARALLAX BG (DISTRIBUCIÓN MAYORISTA DIRECTA & IMPORTACIÓN GLOBAL) ── */}
                <section className="parallax-section parallax-window-2">
                    <div className="parallax-overlay" />
                    
                    <div className="relative z-10 px-4 py-6 max-w-4xl mx-auto w-full">
                        <div className="rounded-3xl bg-[#08090f]/82 border border-emerald-400/35 backdrop-blur-md shadow-[0_25px_70px_rgba(2,6,23,0.85)] px-6 sm:px-10 py-7 space-y-4">
                            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/35 text-emerald-300 text-xs font-mono font-bold uppercase tracking-widest">
                                <Package size={14} className="text-emerald-300" />
                                <span>Distribución Mayorista Directa</span>
                            </span>

                            <h3 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight font-heading leading-tight">
                                Importación Global Verificada & Stock Inmediato
                            </h3>

                            <p className="text-xs sm:text-sm text-slate-200 max-w-3xl mx-auto leading-relaxed">
                                Contamos con <strong className="text-emerald-300">relaciones comerciales verificadas con importadores de distintas áreas</strong> y proveedores directos en distintos países. Visita nuestra línea de <strong className="text-white">Importación e Industria</strong> y dispón de stock inmediato en todo el mundo con respaldo logístico real.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-left">
                                <div className="p-3.5 rounded-2xl bg-white/[0.05] border border-white/10 space-y-1">
                                    <div className="flex items-center gap-1.5 text-emerald-300 text-[11px] font-mono font-bold uppercase tracking-wider">
                                        <ShieldCheck size={13} />
                                        <span>Alianzas Verificadas</span>
                                    </div>
                                    <p className="text-slate-300 text-xs leading-snug">
                                        Importadores auditados en múltiples sectores industriales y tecnológicos.
                                    </p>
                                </div>
                                <div className="p-3.5 rounded-2xl bg-white/[0.05] border border-white/10 space-y-1">
                                    <div className="flex items-center gap-1.5 text-cyan-300 text-[11px] font-mono font-bold uppercase tracking-wider">
                                        <Globe size={13} />
                                        <span>Alcance Multipaís</span>
                                    </div>
                                    <p className="text-slate-300 text-xs leading-snug">
                                        Proveedores directos estratégicos en Asia, EE. UU., Europa y Latinoamérica.
                                    </p>
                                </div>
                                <div className="p-3.5 rounded-2xl bg-white/[0.05] border border-white/10 space-y-1">
                                    <div className="flex items-center gap-1.5 text-amber-300 text-[11px] font-mono font-bold uppercase tracking-wider">
                                        <Package size={13} />
                                        <span>Stock Inmediato</span>
                                    </div>
                                    <p className="text-slate-300 text-xs leading-snug">
                                        Disponibilidad ágil y despacho directo para proyectos, tiendas y mayoristas.
                                    </p>
                                </div>
                            </div>

                            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                                <Link
                                    href="/web/bajo-pedido"
                                    className="px-6 py-2.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-600/30 inline-flex items-center gap-2"
                                >
                                    <span>Línea de Importación e Industria</span>
                                    <ArrowRight size={14} />
                                </Link>
                                <Link
                                    href="/web/guia-proveedores"
                                    className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider border border-white/15 transition-all"
                                >
                                    Red de Proveedores
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── SECCIÓN 5: NO PARALLAX (SISTEMAS DE GENERACIÓN Y RESPALDO ENERGÉTICO URBANO) ── */}
                <section className="parallax-section no-parallax border-t border-white/10 overflow-hidden">
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(245,158,11,0.14),_transparent_65%)]"
                    />
                    <div className="relative z-10 max-w-6xl mx-auto space-y-6 w-full">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/35 text-amber-300 text-xs font-mono font-bold uppercase tracking-widest">
                            <Zap size={14} className="text-amber-400 animate-pulse" />
                            <span>Ingeniería Eléctrica Urbana • Alta Capacidad</span>
                        </div>

                        <div className="space-y-3">
                            <h2 className="futuristic-title font-heading uppercase max-w-4xl mx-auto">
                                Sistemas de Generación y Respaldo Energético Urbano
                            </h2>
                            <p className="text-slate-300 text-sm sm:text-base max-w-3xl mx-auto font-sans leading-relaxed">
                                Planeamos y desarrollamos proyectos integrales de respaldo eléctrico para edificios, conjuntos habitacionales y zonas urbanas: configuración de paneles de abastecimiento, transferencia automática y líneas para sistemas de alto voltaje.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 lg:gap-6 pt-2 text-left">
                            <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 space-y-3 hover:border-amber-400/50 transition-all">
                                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-400">
                                    <Zap size={22} />
                                </div>
                                <h4 className="text-white font-bold text-base font-heading">Paneles de Abastecimiento & ATS</h4>
                                <p className="text-slate-300 text-xs sm:text-[13px] leading-relaxed">
                                    Configuración de tableros eléctricos generales, sistemas de transferencia automática y protección inteligente ante cortes de red.
                                </p>
                            </div>

                            <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 space-y-3 hover:border-blue-400/50 transition-all">
                                <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-400/30 flex items-center justify-center text-blue-400">
                                    <Building2 size={22} />
                                </div>
                                <h4 className="text-white font-bold text-base font-heading">Líneas de Alto Voltaje en Edificios</h4>
                                <p className="text-slate-300 text-xs sm:text-[13px] leading-relaxed">
                                    Ingeniería y tendido de acometidas de alta exigencia para torres, conjuntos cerrados, ascensores, bombeo y áreas comunes.
                                </p>
                            </div>

                            <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 space-y-3 hover:border-emerald-400/50 transition-all">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                                    <ShieldCheck size={22} />
                                </div>
                                <h4 className="text-white font-bold text-base font-heading">Planeación & Desarrollo Íntegro</h4>
                                <p className="text-slate-300 text-xs sm:text-[13px] leading-relaxed">
                                    Cálculo de demanda energética, dimensionamiento de generación continua, montaje llave en mano y soporte técnico garantizado.
                                </p>
                            </div>
                        </div>

                        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                            <Link
                                href="/web/generadores"
                                className="px-6 py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/25 flex items-center gap-2"
                            >
                                <span>Línea de Generación & Respaldo</span>
                                <ArrowRight size={14} />
                            </Link>

                            <a
                                href={`https://wa.me/593969043453?text=${encodeURIComponent("Hola ATOMIC! Requiero asesoría para un proyecto integral de generación, paneles de abastecimiento o líneas de alto voltaje para edificio/conjunto.")}`}
                                target="_blank"
                                rel="noreferrer"
                                className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider border border-white/15 transition-all flex items-center gap-2"
                            >
                                <span>Planificar Proyecto Energético</span>
                            </a>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    )
}
