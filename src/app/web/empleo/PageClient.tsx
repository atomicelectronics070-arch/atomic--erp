"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import {
    Briefcase, Globe, Target, Cpu, CheckCircle2, ChevronRight,
    Users, Star, TrendingUp, Monitor, ShieldCheck, ArrowRight,
    Award, Layers, Zap, Video, CalendarCheck, Clock, Sparkles, PhoneCall, Download
} from "lucide-react"

export default function EmpleoLandingPage() {
    return (
        <div className="min-h-screen bg-[#050505] text-slate-200 selection:bg-emerald-500/30 font-sans overflow-x-hidden">
            {/* Background Glow */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-900/20 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-600/10 blur-[120px]" />
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
            </div>

            {/* Navbar */}
            <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-black/60 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <Target className="text-white" size={20} />
                        </div>
                        <span className="text-xl font-black text-white tracking-tight">Atomic Careers</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/web/precios-vendedor" className="hidden sm:inline-flex px-4 py-2 rounded-full bg-orange-500/15 border border-orange-500/40 text-orange-300 font-bold text-xs hover:bg-orange-500/25 transition-all">
                            ⚡ Portal Vendedores & PVPs
                        </Link>
                        <Link href="/web/empleo-freelance" className="hidden md:inline-flex px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold text-xs hover:bg-amber-500/20 transition-all">
                            Vendedor Freelance
                        </Link>
                        <Link href="/register?role=SALESPERSON" className="px-6 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-black text-sm transition-all shadow-lg shadow-emerald-950/50">
                            Aplicar Ahora
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="relative z-10 pt-28 pb-20 space-y-16">
                
                {/* ── 1. HERO COMPACTO (DIRECTO AL CONTEXTO) ── */}
                <section className="max-w-7xl mx-auto px-6 pt-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl mx-auto space-y-4"
                    >
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 font-mono font-bold text-xs uppercase tracking-widest">
                            <Sparkles size={14} /> Convocatoria Oficial 2026 · ATOMIC Ecuador
                        </div>

                        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
                            Escalafón Comercial y <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
                                Asignación de Sueldos Fijos
                            </span>
                        </h1>

                        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
                            En ATOMIC las reglas son transparentes y meritocráticas. Conoce con total exactitud las actividades operativas requeridas para cada nivel de remuneración fija y comisiones.
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                            <a 
                                href="#escalafon" 
                                className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-cyan-950/40"
                            >
                                <span>Ver Tabla de Escalafón Abajo</span>
                                <ArrowRight size={14} />
                            </a>
                            <a 
                                href="/tabla-escalafon-atomic-2026.png" 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
                            >
                                <Download size={14} />
                                <span>Descargar PNG Oficial</span>
                            </a>
                        </div>
                    </motion.div>
                </section>

                {/* ── 2. LA TABLA OFICIAL EN LA CIMA (LO QUE TODOS QUIEREN VER DE ENTRADA) ── */}
                <section id="escalafon" className="max-w-7xl mx-auto px-6 scroll-mt-28">
                    <div className="bg-gradient-to-b from-[#091124] via-[#060a16] to-[#03050b] border-2 border-cyan-500/40 rounded-[2.5rem] p-6 sm:p-10 shadow-[0_0_80px_rgba(6,182,212,0.18)] space-y-6">
                        
                        {/* Header de la Tabla */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
                            <div>
                                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold uppercase tracking-widest mb-2">
                                    <ShieldCheck size={14} /> Normativa Vigente 2026
                                </span>
                                <h2 className="text-2xl sm:text-4xl font-black text-white">
                                    Tabla Oficial de Clasificación a Puestos Fijos
                                </h2>
                                <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
                                    Rige para todos los postulantes y asesores del equipo. Sin excepciones ni acuerdos verbales fuera de sistema.
                                </p>
                            </div>

                            <a 
                                href="/tabla-escalafon-atomic-2026.png" 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="shrink-0 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md shadow-cyan-950/40"
                            >
                                <Download size={14} />
                                <span>Ver Tabla Gráfica (PNG)</span>
                            </a>
                        </div>

                        {/* Banner de Blindaje Normativo: Día 0 al 29 vs Día 30 */}
                        <div className="p-5 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 text-amber-200 space-y-2">
                            <div className="flex items-center gap-2 font-bold text-amber-400 text-xs sm:text-sm font-mono uppercase tracking-wide">
                                <ShieldCheck size={18} className="text-amber-400 shrink-0" />
                                <span>Blindaje Normativo Oficial: Del Día 0 al 29 vs. Día 30 en Adelante</span>
                            </div>
                            <div className="text-xs sm:text-sm text-slate-300 space-y-1.5 leading-relaxed">
                                <p>
                                    <strong className="text-amber-300">1. Período Día 0 al 29 (Comisión Directa al 20%):</strong> Todo nuevo asesor ingresa bajo comisión directa. La asistencia y publicaciones diarias en Marketplace otorgan <strong>Permanencia en el Grupo (Nivel 0)</strong> y acceso a herramientas, pero <strong className="text-rose-400">NO generan remuneración fija alguna</strong> por solo publicar.
                                </p>
                                <p>
                                    <strong className="text-amber-300">2. Clasificación a partir del Día 30 (Sueldos Fijos):</strong> Solo tras cumplir al menos 1 mes continuo con asistencia y publicaciones activas, el asesor puede reclamar bonos y clasificar a los escalafones de <strong>Sueldo Fijo ($25, $100, $200 o $450 USD)</strong> demostrando el cumplimiento estricto del plan de prospección y llamadas activas.
                                </p>
                            </div>
                        </div>

                        {/* Las 5 Tarjetas de Nivel con Alta Visibilidad */}
                        <div className="grid lg:grid-cols-5 sm:grid-cols-2 gap-4 pt-2">
                            {/* Nivel 0 */}
                            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4">
                                <div>
                                    <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-md bg-slate-800 text-slate-400 uppercase tracking-wider block w-fit mb-3">
                                        Nivel 0 • Base
                                    </span>
                                    <h3 className="text-base font-black text-white leading-snug">Permanencia en Grupo</h3>
                                    <div className="my-3 py-2 px-3 rounded-xl bg-black/40 border border-white/5">
                                        <p className="text-xl font-black text-slate-400 font-mono">$0.00 USD Fijo</p>
                                        <p className="text-[10px] text-slate-500 font-mono">100% Variable • 20% Comisión</p>
                                    </div>
                                    <ul className="text-xs text-slate-400 space-y-2">
                                        <li>• Asistencia timbrada diaria en plataforma.</li>
                                        <li>• Publicaciones activas en Marketplace (3-5 días/sem).</li>
                                        <li>• Aplica del Día 0 al 29 para todo ingreso.</li>
                                    </ul>
                                </div>
                                <div className="p-2.5 rounded-lg bg-black/30 border border-white/5 text-[11px] text-slate-400">
                                    Catálogo de 3.000+ productos, cotizador web y 20% de comisión directa por venta.
                                </div>
                            </div>

                            {/* Nivel 1 */}
                            <div className="p-5 rounded-2xl bg-[#091528] border-2 border-cyan-500/40 hover:border-cyan-400 transition-all flex flex-col justify-between space-y-4 shadow-lg shadow-cyan-950/20">
                                <div>
                                    <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase tracking-wider block w-fit mb-3">
                                        Nivel 1 • Incentivo
                                    </span>
                                    <h3 className="text-base font-black text-white leading-snug">Rendimiento Básico</h3>
                                    <div className="my-3 py-2 px-3 rounded-xl bg-black/40 border border-cyan-500/20">
                                        <p className="text-xl font-black text-cyan-300 font-mono">$25.00 USD Fijo</p>
                                        <p className="text-[10px] text-cyan-400/80 font-mono">Mensual + 20% Comisiones</p>
                                    </div>
                                    <ul className="text-xs text-slate-300 space-y-2">
                                        <li>• <strong>3 números diarios</strong> de empresas con WhatsApp comprobable y <strong>ACTIVO</strong> (se valida si llegan mensajes y responde).</li>
                                        <li>• Envío de mensaje con texto e imagen publicitaria (captura obligatoria).</li>
                                        <li>• <strong>1 llamada larga semanal</strong> a clientes.</li>
                                    </ul>
                                </div>
                                <div className="p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-500/20 text-[11px] text-cyan-200">
                                    Estímulo fijo de $25 USD + 20% comisiones directas. Requiere &gt;30 días en el grupo.
                                </div>
                            </div>

                            {/* Nivel 2 */}
                            <div className="p-5 rounded-2xl bg-[#061e1b] border-2 border-emerald-500/40 hover:border-emerald-400 transition-all flex flex-col justify-between space-y-4 shadow-lg shadow-emerald-950/20">
                                <div>
                                    <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase tracking-wider block w-fit mb-3">
                                        Nivel 2 • Plan Mes 1
                                    </span>
                                    <h3 className="text-base font-black text-white leading-snug">Puesto Fijo Junior</h3>
                                    <div className="my-3 py-2 px-3 rounded-xl bg-black/40 border border-emerald-500/20">
                                        <p className="text-xl font-black text-emerald-300 font-mono">$100.00 USD Fijo</p>
                                        <p className="text-[10px] text-emerald-400/80 font-mono">+ 20% Comis. + Bono $50</p>
                                    </div>
                                    <ul className="text-xs text-slate-300 space-y-2">
                                        <li>• <strong>5 números diarios</strong> de empresas comprobables (escribir a todos con texto e imagen).</li>
                                        <li>• <strong>3 llamadas largas semanales</strong> de prospección y cierre.</li>
                                        <li>• <strong>Seguimiento diario</strong> a clientes en Messenger y WhatsApp.</li>
                                        <li>• Mínimo 30 días con asistencia activa.</li>
                                    </ul>
                                </div>
                                <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/20 text-[11px] text-emerald-200">
                                    Sueldo fijo base de $100 USD + 20% comisiones + bono $50 por metas.
                                </div>
                            </div>

                            {/* Nivel 3 */}
                            <div className="p-5 rounded-2xl bg-[#170e24] border-2 border-purple-500/40 hover:border-purple-400 transition-all flex flex-col justify-between space-y-4 shadow-lg shadow-purple-950/20">
                                <div>
                                    <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/40 uppercase tracking-wider block w-fit mb-3">
                                        Nivel 3 • Plan Mes 2
                                    </span>
                                    <h3 className="text-base font-black text-white leading-snug">Puesto Fijo Intermedio</h3>
                                    <div className="my-3 py-2 px-3 rounded-xl bg-black/40 border border-purple-500/20">
                                        <p className="text-xl font-black text-purple-300 font-mono">$200.00 USD Fijo</p>
                                        <p className="text-[10px] text-purple-400/80 font-mono">+ 20% Comis. + Bono $65</p>
                                    </div>
                                    <ul className="text-xs text-slate-300 space-y-2">
                                        <li>• <strong>7 números diarios</strong> de empresas comprobables (contacto texto e imagen).</li>
                                        <li>• <strong>5 llamadas semanales</strong> (1 diaria de negociación).</li>
                                        <li>• Seguimiento continuo en Messenger y WhatsApp.</li>
                                        <li>• <strong className="text-purple-300">Cerrar al menos 1 venta en el mes</strong>.</li>
                                    </ul>
                                </div>
                                <div className="p-2.5 rounded-lg bg-purple-950/40 border border-purple-500/20 text-[11px] text-purple-200">
                                    Sueldo fijo de $200 USD + 20% comisión + bono $65 + prioridad en leads del bot.
                                </div>
                            </div>

                            {/* Nivel 4 */}
                            <div className="p-5 rounded-2xl bg-[#1e0c15] border-2 border-rose-500/40 hover:border-rose-400 transition-all flex flex-col justify-between space-y-4 shadow-lg shadow-rose-950/20">
                                <div>
                                    <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/40 uppercase tracking-wider block w-fit mb-3">
                                        Nivel 4 • Fast-Track
                                    </span>
                                    <h3 className="text-base font-black text-white leading-snug">Puesto Fijo de Planta</h3>
                                    <div className="my-3 py-2 px-3 rounded-xl bg-black/40 border border-rose-500/20">
                                        <p className="text-xl font-black text-rose-300 font-mono">$450.00 USD Fijo</p>
                                        <p className="text-[10px] text-rose-400/80 font-mono">Básico de Ley + Comis. Corp.</p>
                                    </div>
                                    <ul className="text-xs text-slate-300 space-y-2">
                                        <li>• <strong>10 números diarios</strong> (propuesta formal texto e imagen).</li>
                                        <li>• <strong>2 llamadas diarias</strong> (10 semanales) + seguimiento.</li>
                                        <li>• Dominio de la plataforma web/ERP ATOMIC.</li>
                                        <li>• <strong className="text-rose-300">Cerrar al menos 3 ventas en el mes</strong>.</li>
                                        <li>• Jornada 8h (9:00 a 17:00), PC + Celular y contrato firmado.</li>
                                    </ul>
                                </div>
                                <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-500/20 text-[11px] text-rose-200">
                                    Salario Básico Unificado $450 USD fijos + comisiones corporativas + estabilidad formal.
                                </div>
                            </div>
                        </div>

                        {/* Footer informativo de la tabla */}
                        <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-400">
                            <div>
                                <span>Dirección Comercial ATOMIC • Juan Guzmán - Director Comercial</span>
                            </div>
                            <Link 
                                href="/register?role=SALESPERSON" 
                                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-wider transition-all shadow-md shrink-0"
                            >
                                Aplicar y Empezar Hoy
                            </Link>
                        </div>
                    </div>
                </section>

                {/* ── 3. ACTIVIDADES OPERATIVAS DE OFICINA VIRTUAL (COMPACTAS) ── */}
                <section className="max-w-7xl mx-auto px-6">
                    <div className="p-8 rounded-[2rem] bg-gradient-to-br from-[#0c1836] via-[#091126] to-[#040814] border border-cyan-500/30 space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                            <div>
                                <h3 className="text-xl sm:text-2xl font-black text-white">
                                    Actividades que Mantienen Viva la Oficina Virtual
                                </h3>
                                <p className="text-slate-400 text-xs sm:text-sm mt-1">
                                    Tu permanencia y calificación se miden por puntualidad y contacto directo con coordinación.
                                </p>
                            </div>
                            <Link 
                                href="/web/empleo-freelance"
                                className="px-4 py-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold hover:bg-amber-500/25 transition-all shrink-0"
                            >
                                Modalidad Freelance (Sin Oficina) →
                            </Link>
                        </div>

                        <div className="grid sm:grid-cols-3 gap-4">
                            <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                                    <Video size={20} />
                                </div>
                                <h4 className="text-base font-bold text-white">Reuniones en Zoom</h4>
                                <p className="text-slate-400 text-xs leading-relaxed">
                                    Sesiones sincrónicas para revisión de promociones, stock de remate y soporte comercial.
                                </p>
                            </div>

                            <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                                    <CalendarCheck size={20} />
                                </div>
                                <h4 className="text-base font-bold text-white">Timbrado de Asistencias</h4>
                                <p className="text-slate-400 text-xs leading-relaxed">
                                    Registro de entrada y salida diario en la plataforma reflejado en tu matriz gráfica de 30 días.
                                </p>
                            </div>

                            <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                                    <ShieldCheck size={20} />
                                </div>
                                <h4 className="text-base font-bold text-white">Seguimiento con Stefy</h4>
                                <p className="text-slate-400 text-xs leading-relaxed">
                                    Validación de capturas de mensajes, números activos y justificaciones directas con coordinación.
                                </p>
                            </div>
                        </div>

                        {/* Banner resumen de tareas diarias */}
                        <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
                            <div className="flex items-center gap-2 text-slate-300">
                                <Clock size={16} className="text-cyan-400 shrink-0" />
                                <span><strong>Meta Diaria:</strong> 5 publicaciones Marketplace • 3 grupos FB • 10 prospectos Maps • Llamadas según nivel</span>
                            </div>
                            <Link 
                                href="/web/precios-vendedor"
                                className="px-4 py-2 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/40 text-orange-300 font-bold shrink-0"
                            >
                                Ver Guiones de Llamada →
                            </Link>
                        </div>
                    </div>
                </section>

                {/* ── 4. METODOLOGÍA DE INGRESO EN 3 PASOS ── */}
                <section className="max-w-7xl mx-auto px-6">
                    <div className="grid sm:grid-cols-3 gap-4">
                        {[
                            {
                                step: "1",
                                title: "Registro en la Plataforma",
                                desc: "Regístrate con rol 'Vendedor'. Tendrás acceso inmediato al catálogo completo con precios y comisiones calculadas."
                            },
                            {
                                step: "2",
                                title: "Ingreso a Grupos de Trabajo",
                                desc: "Te integramos a nuestros canales oficiales de WhatsApp para que recibas promociones de remate del día."
                            },
                            {
                                step: "3",
                                title: "Guía Directa de Coordinadora",
                                desc: "Stefy te asignará tus primeros 3 anuncios validados y auditará tus números activos para ayudarte a cerrar rápido."
                            }
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="p-6 rounded-2xl bg-[#090e1f] border border-white/10 space-y-2"
                            >
                                <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 font-mono font-black text-sm flex items-center justify-center">
                                    {item.step}
                                </span>
                                <h4 className="text-base font-bold text-white pt-1">{item.title}</h4>
                                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── 5. CIERRE Y ACCIÓN ── */}
                <section className="max-w-7xl mx-auto px-6 text-center">
                    <div className="p-10 rounded-[2.5rem] bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-black p-8 space-y-4 shadow-2xl">
                        <h3 className="text-2xl sm:text-4xl font-black text-white">
                            ¿Listo para Empezar a Ganar de Verdad?
                        </h3>
                        <p className="text-xs sm:text-sm text-emerald-100 max-w-xl mx-auto">
                            Únete al equipo comercial de ATOMIC hoy mismo. Gana 20% en comisiones inmediatas y clasifica a sueldos fijos demostrando resultados.
                        </p>
                        <div className="pt-2 flex flex-wrap justify-center gap-3">
                            <Link 
                                href="/register?role=SALESPERSON" 
                                className="px-8 py-3.5 rounded-xl bg-black text-white font-black text-sm hover:scale-105 transition-transform shadow-xl"
                            >
                                Registrarme Ahora
                            </Link>
                            <Link 
                                href="/web/precios-vendedor" 
                                className="px-6 py-3.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-sm backdrop-blur-md transition-all"
                            >
                                Explorar Portal de Precios
                            </Link>
                        </div>
                    </div>
                </section>

            </main>
        </div>
    )
}
