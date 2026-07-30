"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Shield, Search, Star, CheckCircle2, ArrowRight, Send, Store, 
    ShoppingBag, Clock, Award, Gamepad2, Wrench, Tag, MessageCircle,
    Cpu, Zap, Sparkles, Check, X, ThumbsUp, ShieldCheck, Flame, Scale
} from "lucide-react"

const WHATSAPP_NUMBER = "0969043453"
const WHATSAPP_LINK = "https://wa.me/593969043453?text=Hola%20ATOMIC%20Industries%2C%20quiero%20cotizar%20las%20consolas%20PS4%20Slim%20Open%20Box%20y%20PS5%20Slim%20Nuevas%20Bajo%20Pedido."

export default function ConsolasPage() {
    const [selectedConsole, setSelectedConsole] = useState<"ps4" | "ps5">("ps4")
    const [activeTab, setActiveTab] = useState<"compra" | "vende">("compra")

    const COMPARISON_DATA = [
        {
            feature: "Garantía Real por Escrito",
            atomic: "1 Año Directo en Oficina con Respaldo Técnico",
            others: "Sin garantía o de 7 a 15 días informales",
            isAdvantage: true
        },
        {
            feature: "Certificación y Revisión de 20 Puntos",
            atomic: "Testeo de Estrés 48h (Ventiladores, HDMI, Lectora, Fuente)",
            others: "Ninguna revisión, consolas vendidas tal como llegan",
            isAdvantage: true
        },
        {
            feature: "Estado de la Consola",
            atomic: "Open Box Seleccionadas (9.8/10) o Nuevas Selladas de Fábrica",
            others: "Consolas usadas con acumulación de polvo y desgaste",
            isAdvantage: true
        },
        {
            feature: "Controles y Accesorios",
            atomic: "DualShock 4 / DualSense 100% Originales y Testeados",
            others: "Controles genéricos o con problemas de drift",
            isAdvantage: true
        },
        {
            feature: "Mantenimiento Preventivo",
            atomic: "Limpieza y cambio de pasta térmica gratis el 1er Año",
            others: "Cobro adicional por cualquier mantenimiento",
            isAdvantage: true
        },
        {
            feature: "Atención Posventa y Asesoría",
            atomic: "Asesoría permanente vía WhatsApp Directo 0969043453",
            others: "Bloqueo o sin respuesta tras efectuar la venta",
            isAdvantage: true
        }
    ]

    return (
        <div className="font-sans text-slate-100 bg-[#020617] selection:bg-cyan-500/30 selection:text-white overflow-x-hidden">

            {/* ── BANNER HERO PRINCIPAL ── */}
            <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-950 via-[#030712] to-[#020617] border-b border-slate-800/80">
                {/* Glow Effects */}
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[160px] pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[160px] pointer-events-none" />

                <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 flex flex-col lg:flex-row items-center gap-14">
                    {/* Hero Text Content */}
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        transition={{ duration: 0.7 }} 
                        className="flex-1 space-y-7 text-center lg:text-left"
                    >
                        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                            ATOMIC INDUSTRIES · CATEGORÍA DE CONSOLAS
                        </div>

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.08] tracking-tight">
                            Consolas Premium <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 drop-shadow-[0_0_25px_rgba(6,182,212,0.4)]">
                                Garantizadas 100%
                            </span>
                        </h1>

                        <p className="text-slate-300 text-base md:text-lg max-w-2xl font-light leading-relaxed mx-auto lg:mx-0">
                            Consigue tu <strong className="text-cyan-300 font-bold">PlayStation 4 Slim Open Box</strong> o la potente <strong className="text-indigo-300 font-bold">PlayStation 5 Slim Nueva Bajo Pedido</strong> con certificación de laboratorio, componentes de máxima durabilidad y garantía escrita.
                        </p>

                        {/* Badges Overview */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 max-w-lg mx-auto lg:mx-0">
                            <div className="bg-slate-900/90 border border-cyan-500/30 p-4 rounded-2xl flex items-center gap-3 shadow-lg">
                                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold shrink-0">
                                    📦
                                </div>
                                <div className="text-left">
                                    <h4 className="font-bold text-xs text-white">PlayStation 4 Slim</h4>
                                    <p className="text-[11px] font-mono text-cyan-400 font-semibold">Consolas Open Box Certificadas</p>
                                </div>
                            </div>

                            <div className="bg-slate-900/90 border border-indigo-500/30 p-4 rounded-2xl flex items-center gap-3 shadow-lg">
                                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold shrink-0">
                                    ⚡
                                </div>
                                <div className="text-left">
                                    <h4 className="font-bold text-xs text-white">PlayStation 5 Slim</h4>
                                    <p className="text-[11px] font-mono text-indigo-400 font-semibold">Consolas Nuevas Bajo Pedido</p>
                                </div>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center gap-4 pt-3 justify-center lg:justify-start">
                            <a 
                                href={WHATSAPP_LINK} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:scale-105 transition-all flex items-center justify-center gap-3 group"
                            >
                                <MessageCircle size={20} className="group-hover:scale-110 transition-transform" />
                                <span>Consultar por WhatsApp ({WHATSAPP_NUMBER})</span>
                            </a>
                            <a 
                                href="#productos" 
                                className="w-full sm:w-auto px-6 py-4 bg-slate-900 border border-slate-800 text-slate-300 rounded-2xl font-bold text-sm hover:bg-slate-800 hover:text-white transition-all text-center"
                            >
                                Ver Modelos & Especificaciones ↓
                            </a>
                        </div>
                    </motion.div>

                    {/* Hero Images Showcase */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="flex-1 w-full max-w-lg"
                    >
                        <div className="relative bg-gradient-to-br from-slate-900 to-slate-950 border border-cyan-500/30 rounded-3xl p-6 shadow-[0_0_50px_rgba(6,182,212,0.15)] space-y-4">
                            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 aspect-video flex items-center justify-center group">
                                <img 
                                    src="/assets/consolas/consola1.jpeg" 
                                    alt="PS4 Slim & PS5 Slim ATOMIC" 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                                <span className="absolute bottom-3 left-3 px-3 py-1 bg-slate-950/80 backdrop-blur-md border border-cyan-500/40 text-cyan-400 text-[10px] font-mono font-bold rounded-full">
                                    🎮 Muestras Reales en Local ATOMIC
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 aspect-video">
                                    <img src="/assets/consolas/consola2.jpeg" alt="PS4 Slim Open Box" className="w-full h-full object-cover" />
                                </div>
                                <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 aspect-video">
                                    <img src="/assets/consolas/consola3.jpeg" alt="PS5 Slim Nueva" className="w-full h-full object-cover" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>


            {/* ── SECCIÓN 1: PRODUCTOS EN CATÁLOGO (PS4 SLIM OPEN BOX vs PS5 SLIM NUEVA) ── */}
            <section id="productos" className="py-24 px-6 max-w-7xl mx-auto space-y-16">
                <div className="text-center space-y-3">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold uppercase tracking-widest">
                        <Gamepad2 size={16} /> NUESTRO STOCK & DISPONIBILIDAD
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                        Modelos de Consolas Disponibles
                    </h2>
                    <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto font-light">
                        Contamos con consolas <strong className="text-white">Open Box certificadas en stock</strong> y unidades <strong className="text-white">100% nuevas bajo pedido</strong> con entrega express.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-stretch">
                    
                    {/* PRODUCTO 1: PS4 SLIM OPEN BOX */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-cyan-500/40 rounded-3xl p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden group hover:border-cyan-400 transition-all">
                        <div className="space-y-6">
                            <div className="flex justify-between items-start gap-4">
                                <div>
                                    <span className="inline-block px-3 py-1 bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 font-mono text-[10px] font-bold uppercase tracking-wider rounded-full mb-2">
                                        📦 CONSOLA OPEN BOX CERTIFICADA
                                    </span>
                                    <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                                        PlayStation 4 Slim
                                    </h3>
                                    <p className="text-xs font-mono text-slate-400 mt-1">
                                        Capacidad: 500GB / 1TB HDD · Color Negro Mate
                                    </p>
                                </div>
                                <div className="text-right shrink-0">
                                    <span className="text-xs text-slate-400 block font-mono">Desde</span>
                                    <span className="text-3xl font-black text-cyan-400 tracking-tight">$240.00</span>
                                </div>
                            </div>

                            <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 h-56 relative">
                                <img src="/assets/consolas/consola1.jpeg" alt="PS4 Slim Open Box" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute top-3 right-3 px-3 py-1 bg-emerald-500/90 text-slate-950 font-black text-[10px] font-mono uppercase rounded-full shadow-lg">
                                    ✓ EN STOCK LOCAL
                                </div>
                            </div>

                            <div className="space-y-3 bg-slate-950/80 p-5 rounded-2xl border border-slate-800/80 text-xs font-mono">
                                <h4 className="font-bold text-white uppercase text-[11px] text-cyan-400 tracking-wider">
                                    Especificaciones del Estado Open Box:
                                </h4>
                                <ul className="space-y-2 text-slate-300">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                                        <span><strong>Condición Física 9.8/10:</strong> Sin rayones profundos ni golpes.</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                                        <span><strong>Revisión Interna:</strong> Limpieza de polvo y cambio de pasta térmica.</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                                        <span><strong>Incluye:</strong> Control DualShock 4 Original + Cables HDMI y Poder.</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                                        <span><strong>Garantía Escrita ATOMIC:</strong> 1 Año con respaldo técnico en local.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <a 
                            href={`https://wa.me/593969043453?text=Hola%2C%20me%20interesa%20comprar%20la%20PlayStation%204%20Slim%20Open%20Box`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="mt-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all hover:scale-[1.02]"
                        >
                            <MessageCircle size={18} />
                            <span>Cotizar PS4 Slim por WhatsApp</span>
                        </a>
                    </div>

                    {/* PRODUCTO 2: PS5 SLIM NUEVA BAJO PEDIDO */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-indigo-500/40 rounded-3xl p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden group hover:border-indigo-400 transition-all">
                        <div className="space-y-6">
                            <div className="flex justify-between items-start gap-4">
                                <div>
                                    <span className="inline-block px-3 py-1 bg-indigo-500/15 border border-indigo-500/40 text-indigo-300 font-mono text-[10px] font-bold uppercase tracking-wider rounded-full mb-2">
                                        ⚡ CONSOLA NUEVA SELLADA BAJO PEDIDO
                                    </span>
                                    <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                                        PlayStation 5 Slim
                                    </h3>
                                    <p className="text-xs font-mono text-slate-400 mt-1">
                                        Capacidad: 1TB SSD Ultra Rápido · Edición Digital o Disc
                                    </p>
                                </div>
                                <div className="text-right shrink-0">
                                    <span className="text-xs text-slate-400 block font-mono">Desde</span>
                                    <span className="text-3xl font-black text-indigo-400 tracking-tight">$520.00</span>
                                </div>
                            </div>

                            <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 h-56 relative">
                                <img src="/assets/consolas/consola3.jpeg" alt="PS5 Slim Nueva Bajo Pedido" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute top-3 right-3 px-3 py-1 bg-indigo-500/90 text-white font-black text-[10px] font-mono uppercase rounded-full shadow-lg">
                                    🚀 PEDIDO EXPRESS 24H
                                </div>
                            </div>

                            <div className="space-y-3 bg-slate-950/80 p-5 rounded-2xl border border-slate-800/80 text-xs font-mono">
                                <h4 className="font-bold text-white uppercase text-[11px] text-indigo-400 tracking-wider">
                                    Especificaciones de Consola Nueva:
                                </h4>
                                <ul className="space-y-2 text-slate-300">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 size={14} className="text-indigo-400 shrink-0" />
                                        <span><strong>100% Nueva Sellada:</strong> Empaque original de fábrica intacto.</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 size={14} className="text-indigo-400 shrink-0" />
                                        <span><strong>Tecnología 4K & 120 FPS:</strong> Gráficos Ray Tracing de última generación.</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 size={14} className="text-indigo-400 shrink-0" />
                                        <span><strong>Mando DualSense Incluido:</strong> Respuesta háptica y gatillos adaptativos.</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 size={14} className="text-indigo-400 shrink-0" />
                                        <span><strong>Garantía de Fábrica:</strong> 1 Año de garantía completa con soporte técnico.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <a 
                            href={`https://wa.me/593969043453?text=Hola%2C%20quiero%20solicitar%20la%20PlayStation%205%20Slim%20Nueva%20Bajo%20Pedido`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="mt-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all hover:scale-[1.02]"
                        >
                            <MessageCircle size={18} />
                            <span>Encargar PS5 Slim por WhatsApp</span>
                        </a>
                    </div>

                </div>
            </section>


            {/* ── SECCIÓN 2: BENEFICIOS EXCLUSIVOS ATOMIC ── */}
            <section className="py-20 bg-slate-950 border-y border-slate-800/80">
                <div className="max-w-7xl mx-auto px-6 space-y-12">
                    <div className="text-center space-y-3">
                        <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
                            POR QUÉ ELEGIR ATOMIC INDUSTRIES
                        </span>
                        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                            Beneficios de Comprar con Nosotros
                        </h2>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                icon: ShieldCheck,
                                title: "Garantía Real 1 Año",
                                desc: "Respaldamos cada consola con garantía por escrito. Si surge algún fallo técnico, nuestro equipo de laboratorio lo soluciona sin complicaciones."
                            },
                            {
                                icon: Wrench,
                                title: "Revisión 20+ Puntos",
                                desc: "No vendemos nada a ciegas. Cada consola Open Box pasa por testeo intensivo de 48h (lectora, HDMI, temperaturas y fuentes)."
                            },
                            {
                                icon: Sparkles,
                                title: "Limpieza & Mantenimiento",
                                desc: "Entregamos los equipos totalmente desinfectados, sin polvo interno y con pasta térmica de alta conductividad renovada."
                            },
                            {
                                icon: MessageCircle,
                                title: "Asesoría Directa 0969043453",
                                desc: "Soporte posventa directo por WhatsApp para configuraciones, cuentas, descargas y dudas de funcionamiento."
                            }
                        ].map((b, idx) => (
                            <div key={idx} className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-3 hover:border-cyan-500/40 transition-colors">
                                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
                                    <b.icon size={22} />
                                </div>
                                <h3 className="font-bold text-white text-base">{b.title}</h3>
                                <p className="text-xs text-slate-400 font-light leading-relaxed">{b.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            {/* ── SECCIÓN 3: DURABILIDAD & TESTEO DE LABORATORIO ── */}
            <section className="py-24 px-6 max-w-7xl mx-auto">
                <div className="bg-gradient-to-br from-slate-900 via-[#0a1128] to-slate-950 border border-slate-800 rounded-3xl p-8 md:p-14 shadow-2xl grid lg:grid-cols-12 gap-10 items-center">
                    <div className="lg:col-span-7 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-mono font-bold uppercase tracking-widest">
                            <Flame size={15} /> DURABILIDAD PROBADA EN PRUEBAS DE ESTRÉS
                        </div>

                        <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
                            Durabilidad Extendida & Control Térmico
                        </h2>

                        <p className="text-slate-300 text-sm md:text-base font-light leading-relaxed">
                            Una de las mayores preocupaciones al adquirir una consola es el sobrecalentamiento y el ruido excesivo del ventilador. En **ATOMIC Industries**, sometemos cada consola a pruebas intensivas de temperatura constante durante 48 horas continuas.
                        </p>

                        <div className="grid sm:grid-cols-2 gap-4 pt-2">
                            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-1">
                                <span className="text-cyan-400 font-mono font-bold text-xs">01. DISIPACIÓN EFICIENTE</span>
                                <p className="text-xs text-slate-300">Monitoreo térmico para evitar estrangulamiento térmico (Thermal Throttling).</p>
                            </div>
                            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-1">
                                <span className="text-indigo-400 font-mono font-bold text-xs">02. COMPONENTES ORIGINALES</span>
                                <p className="text-xs text-slate-300">Fuentes de poder y placas originales sin intervenciones informales.</p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-5 bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                        <h4 className="font-bold text-white text-sm uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                            <Cpu size={16} /> Checklist de Certificación ATOMIC
                        </h4>
                        <div className="space-y-2.5 text-xs font-mono text-slate-300 divide-y divide-slate-800/60">
                            <div className="pt-2 flex justify-between"><span>• Puerto HDMI & Salida 4K:</span> <strong className="text-emerald-400">Verificado 100%</strong></div>
                            <div className="pt-2 flex justify-between"><span>• Lector de Discos Blu-ray:</span> <strong className="text-emerald-400">Lectura Rápida OK</strong></div>
                            <div className="pt-2 flex justify-between"><span>• Nivel de Ruido de Ventilador:</span> <strong className="text-emerald-400">Silencioso (&lt;30dB)</strong></div>
                            <div className="pt-2 flex justify-between"><span>• Mando DualShock / DualSense:</span> <strong className="text-emerald-400">Cero Drift OK</strong></div>
                            <div className="pt-2 flex justify-between"><span>• Conexión Wi-Fi & LAN:</span> <strong className="text-emerald-400">Sincronización Alta Velocidad</strong></div>
                        </div>
                    </div>
                </div>
            </section>


            {/* ── SECCIÓN 4: MATERIALES & CONSTRUCCIÓN PREMIUM ── */}
            <section className="py-20 bg-slate-950 border-t border-slate-800/80">
                <div className="max-w-7xl mx-auto px-6 space-y-12">
                    <div className="text-center space-y-3">
                        <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest">
                            CALIDAD DE MATERIALES Y COMPONENTES
                        </span>
                        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                            Materiales Originales Sony & Ensamble Calificado
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-3">
                            <div className="text-3xl">🛡️</div>
                            <h3 className="font-bold text-white text-base">Chasis Original Robusto</h3>
                            <p className="text-xs text-slate-400 leading-relaxed font-light">
                                Carcasa con acabados mate originales de Sony que resisten el desgaste por uso cotidiano y protegen el interior contra impactos accidentales.
                            </p>
                        </div>

                        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-3">
                            <div className="text-3xl">⚡</div>
                            <h3 className="font-bold text-white text-base">Fuentes de Voltaje Estables</h3>
                            <p className="text-xs text-slate-400 leading-relaxed font-light">
                                Fuentes reguladas internamente preparadas para variaciones de voltaje en redes eléctricas locales de 110V y 220V.
                            </p>
                        </div>

                        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-3">
                            <div className="text-3xl">🎮</div>
                            <h3 className="font-bold text-white text-base">Mandos Originales Probados</h3>
                            <p className="text-xs text-slate-400 leading-relaxed font-light">
                                Controles originales con respuesta táctil perfecta, baterías de litio con alta retención de carga y joysticks calibrados.
                            </p>
                        </div>
                    </div>
                </div>
            </section>


            {/* ── SECCIÓN 5: USABILIDAD & EXPERIENCIA PLUG & PLAY ── */}
            <section className="py-24 px-6 max-w-7xl mx-auto text-center space-y-10">
                <div className="max-w-3xl mx-auto space-y-4">
                    <span className="text-xs font-mono font-bold text-teal-400 uppercase tracking-widest">
                        EXPERIENCIA DE USUARIO FLUIDA
                    </span>
                    <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                        Lista para Conectar y Jugar (Plug & Play)
                    </h2>
                    <p className="text-slate-400 text-sm md:text-base font-light">
                        Te entregamos la consola totalmente lista. Solo la conectas a tu televisor mediante el cable HDMI incluido, inicias sesión con tu cuenta de PlayStation y comienzas a jugar inmediatamente.
                    </p>
                </div>

                <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto text-left">
                    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-2">
                        <span className="text-cyan-400 font-mono font-bold text-sm">01. Conexión Rápida</span>
                        <h4 className="font-bold text-white text-sm">Cableado Completo Incluido</h4>
                        <p className="text-xs text-slate-400 font-light">Incluye cable de alimentación y HDMI 4K listo para conectar a cualquier TV o monitor.</p>
                    </div>

                    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-2">
                        <span className="text-cyan-400 font-mono font-bold text-sm">02. Interfaz Actualizada</span>
                        <h4 className="font-bold text-white text-sm">Último Firmware Instalado</h4>
                        <p className="text-xs text-slate-400 font-light">Consola actualizada con la versión oficial más reciente para acceso total a PS Network.</p>
                    </div>

                    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-2">
                        <span className="text-cyan-400 font-mono font-bold text-sm">03. Cero Complicaciones</span>
                        <h4 className="font-bold text-white text-sm">Soporte Técnico por WhatsApp</h4>
                        <p className="text-xs text-slate-400 font-light">Si necesitas ayuda para crear tu cuenta o descargar juegos, te guiamos paso a paso.</p>
                    </div>
                </div>
            </section>


            {/* ── SECCIÓN 6: APARTADO COMPARATIVO CON OTRAS MARCAS / VENDEDORES INFORMALES ── */}
            <section className="py-24 bg-slate-950 border-t border-slate-800/80">
                <div className="max-w-7xl mx-auto px-6 space-y-12">
                    <div className="text-center space-y-3">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-mono font-bold uppercase tracking-widest">
                            <Scale size={16} /> TABLA COMPARATIVA DE SEGURIDAD
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                            Por qué ATOMIC es la Mejor Opción
                        </h2>
                        <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto font-light">
                            Compara las garantías, certificación y transparencia de **ATOMIC Industries** frente a vendedores informales o de segunda mano sin respaldo.
                        </p>
                    </div>

                    {/* Comparison Table */}
                    <div className="overflow-x-auto rounded-3xl border border-slate-800 shadow-2xl bg-slate-900/90">
                        <table className="w-full text-left border-collapse text-xs md:text-sm">
                            <thead>
                                <tr className="border-b border-slate-800 bg-slate-950">
                                    <th className="p-4 md:p-6 font-mono uppercase text-slate-400 font-bold">Criterio de Evaluación</th>
                                    <th className="p-4 md:p-6 font-black text-cyan-400 bg-cyan-500/10 border-x border-cyan-500/20 text-center">
                                        🚀 ATOMIC INDUSTRIES
                                    </th>
                                    <th className="p-4 md:p-6 font-bold text-slate-400 text-center">
                                        ❌ Vendedores Informales / Mercado Libre
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/80 font-sans">
                                {COMPARISON_DATA.map((row, idx) => (
                                    <tr key={idx} className="hover:bg-slate-950/40 transition-colors">
                                        <td className="p-4 md:p-6 font-bold text-white flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                                            {row.feature}
                                        </td>
                                        <td className="p-4 md:p-6 text-center font-bold text-emerald-400 bg-cyan-500/5 border-x border-cyan-500/10">
                                            <div className="flex items-center justify-center gap-2">
                                                <Check size={16} className="text-emerald-400 shrink-0" />
                                                <span>{row.atomic}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 md:p-6 text-center text-slate-400">
                                            <div className="flex items-center justify-center gap-2">
                                                <X size={16} className="text-rose-500 shrink-0" />
                                                <span>{row.others}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>


            {/* ── SECCIÓN 7: FOOTER & WHATSAPP DIRECT ACTION BANNER ── */}
            <section className="py-20 bg-gradient-to-r from-cyan-950 via-slate-950 to-indigo-950 border-t border-cyan-500/30 relative overflow-hidden">
                <div className="max-w-5xl mx-auto px-6 text-center space-y-6 relative z-10">
                    <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
                        ¿LISTO PARA TU PRÓXIMA CONSOLA?
                    </span>
                    <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                        Cotiza tu PlayStation 4 Slim u Ordena tu PS5 Slim Hoy
                    </h2>
                    <p className="text-slate-300 text-sm md:text-base max-w-xl mx-auto font-light">
                        Te atendemos inmediatamente vía WhatsApp en el número <strong className="text-white font-mono">0969043453</strong>. Asesoramiento sin compromiso y envíos seguros a nivel nacional.
                    </p>

                    <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a 
                            href={WHATSAPP_LINK}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-10 py-5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:scale-105 transition-all flex items-center gap-3"
                        >
                            <MessageCircle size={22} />
                            <span>Contactar por WhatsApp ({WHATSAPP_NUMBER})</span>
                        </a>
                    </div>
                </div>
            </section>

        </div>
    )
}
