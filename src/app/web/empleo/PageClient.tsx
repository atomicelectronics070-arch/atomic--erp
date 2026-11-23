"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import {
    Briefcase, Globe, Target, Cpu, CheckCircle2, ChevronRight,
    Users, Star, TrendingUp, Monitor, ShieldCheck, ArrowRight,
    Award, Layers, Zap, Video, CalendarCheck, Clock, Sparkles, PhoneCall, Download,
    Flame, AlertCircle, BadgeCheck, Check, Smartphone
} from "lucide-react"

export default function EmpleoLandingPage() {
    return (
        <div className="min-h-screen bg-[#070a12] text-slate-100 font-sans selection:bg-rose-500/30 overflow-x-hidden">
            {/* Elegant Subtle Ambient Lighting */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-1/4 w-[600px] h-[600px] rounded-full bg-slate-800/20 blur-[150px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-900/10 blur-[160px]" />
            </div>

            {/* Navbar Prémium Minimalista */}
            <nav className="fixed top-0 inset-x-0 z-50 border-b border-slate-800/80 bg-[#070a12]/90 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 border border-slate-600/50 flex items-center justify-center shadow-md">
                            <Target className="text-white" size={18} />
                        </div>
                        <div>
                            <span className="text-lg font-black text-white tracking-tight font-heading">ATOMIC <span className="text-slate-400 font-light">CAREERS</span></span>
                            <span className="hidden sm:inline-block ml-2 text-[10px] font-mono font-bold text-slate-400 px-2 py-0.5 rounded border border-slate-800 bg-slate-900">
                                División Comercial 2026
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/web/precios-vendedor" className="hidden sm:inline-flex px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs transition-all">
                            ⚡ Portal Vendedores & PVPs
                        </Link>
                        <Link href="/register?role=SALESPERSON" className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-200 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-md">
                            Postular Ahora
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="relative z-10 pt-28 pb-24 space-y-14">
                
                {/* ── 1. HERO EJECUTIVO Y ELEGANTE ── */}
                <section className="max-w-7xl mx-auto px-6 pt-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl mx-auto space-y-4"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-700 bg-slate-900/80 text-slate-300 font-mono text-xs font-semibold">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span>Convocatoria Oficial · Régimen Laboral & Escalafón Meritocrático</span>
                        </div>

                        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight font-heading">
                            Plan de Carrera Comercial & <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-200 via-slate-100 to-slate-400">
                                Asignación de Sueldos Fijos 2026
                            </span>
                        </h1>

                        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
                            En ATOMIC las condiciones son transparentes, auditables y orientadas a resultados. Conoce con precisión matemática los requisitos para cada nivel de remuneración fija y comisiones.
                        </p>
                    </motion.div>
                </section>

                {/* ── 2. CLÁUSULA DESTACADA FAST-TRACK SENIOR (ROJO / CARMESÍ ELEGANTE) ── */}
                <section className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#2a0c12] via-[#1a080c] to-[#120608] border-2 border-rose-600/70 shadow-[0_15px_50px_rgba(225,29,72,0.25)] space-y-5 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
                            <div className="space-y-3 max-w-3xl">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-600/25 border border-rose-500/50 text-rose-300 font-mono text-xs font-black uppercase tracking-widest">
                                    <Flame size={14} className="text-rose-400" /> Cláusula Especial para Vendedores Experimentados
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight leading-snug">
                                    ¿Eres un Vendedor Senior con Experiencia? <br />
                                    <span className="text-rose-400">Postula Directamente al Sueldo Fijo de $450 USD</span>
                                </h2>
                                <p className="text-xs sm:text-sm text-rose-100/90 leading-relaxed">
                                    Si cuentas con <strong>experiencia comercial comprobable</strong>, cartera de clientes activa o trayectoria cerrando ventas en tecnología, electrodomésticos o canal B2B, <strong>no requieres pasar por el escalafón inicial de $25 o $100</strong>. Puedes calificar de inmediato al <strong>Puesto Fijo de Planta ($450 USD Básico de Ley + Comisiones Corporativas)</strong> mediante entrevista directa de validación con Dirección Comercial.
                                </p>
                                <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] font-mono text-rose-200">
                                    <span className="flex items-center gap-1.5 bg-rose-950/60 px-3 py-1 rounded-lg border border-rose-800/40">
                                        <BadgeCheck size={14} className="text-rose-400" /> Sin período de espera de 30 días
                                    </span>
                                    <span className="flex items-center gap-1.5 bg-rose-950/60 px-3 py-1 rounded-lg border border-rose-800/40">
                                        <BadgeCheck size={14} className="text-rose-400" /> Contrato formal firmado
                                    </span>
                                    <span className="flex items-center gap-1.5 bg-rose-950/60 px-3 py-1 rounded-lg border border-rose-800/40">
                                        <BadgeCheck size={14} className="text-rose-400" /> Entrevista prioritaria con Juan Guzmán
                                    </span>
                                </div>
                            </div>

                            <div className="shrink-0 w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col gap-3">
                                <a
                                    href="https://wa.me/593989476556?text=Saludos%2C%20deseo%20postular%20directamente%20al%20Puesto%20Fijo%20Senior%20de%20%24450%20USD.%20Cuento%20con%20experiencia%20comercial%20demostrable%20y%20cartera%20de%20clientes."
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-6 py-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xl shadow-rose-950/60 hover:scale-102"
                                >
                                    <Flame size={16} />
                                    <span>Postular Directo a $450 Fijo</span>
                                </a>
                                <Link
                                    href="/register?role=SALESPERSON"
                                    className="px-5 py-3 rounded-2xl bg-black/50 hover:bg-black/70 border border-rose-500/30 text-rose-200 font-bold text-xs uppercase tracking-wider text-center transition-all"
                                >
                                    Registro en Plataforma →
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* ── 3. LA TABLA OFICIAL EN LA CIMA (DISEÑO SAAS PRÉMIUM) ── */}
                <section id="escalafon" className="max-w-7xl mx-auto px-6 scroll-mt-28">
                    <div className="bg-[#0b101d] border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
                        
                        {/* Header de la Tabla */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
                            <div>
                                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 font-mono text-xs font-semibold uppercase tracking-widest mb-2">
                                    <ShieldCheck size={14} className="text-emerald-400" /> Cuadro de Honor & Métricas Operativas
                                </span>
                                <h2 className="text-2xl sm:text-3xl font-black text-white font-heading">
                                    Escalafón Laboral y Requisitos de Asignación Fija
                                </h2>
                                <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
                                    Conoce con exactitud qué actividades debes cumplir para cada nivel de sueldo y comisión.
                                </p>
                            </div>

                            <a 
                                href="/tabla-escalafon-atomic-2026.png" 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="shrink-0 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                            >
                                <Download size={14} />
                                <span>Ver Tabla Gráfica (PNG)</span>
                            </a>
                        </div>

                        {/* Banner de Blindaje Normativo: Día 0 al 29 vs Día 30 */}
                        <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/30 text-amber-200 space-y-2">
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

                        {/* Las 5 Tarjetas de Nivel: Estilo Slate Ejecutivo */}
                        <div className="grid lg:grid-cols-5 sm:grid-cols-2 gap-4 pt-2">
                            {/* Nivel 0 */}
                            <div className="p-5 rounded-2xl bg-[#0e1424] border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4">
                                <div>
                                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400 uppercase tracking-wider block w-fit mb-3">
                                        Nivel 0 • Base
                                    </span>
                                    <h3 className="text-sm font-black text-white leading-snug">Permanencia en Grupo</h3>
                                    <div className="my-3 py-2 px-3 rounded-xl bg-black/40 border border-white/5">
                                        <p className="text-lg font-black text-slate-300 font-mono">$0.00 USD Fijo</p>
                                        <p className="text-[10px] text-slate-400 font-mono">100% Variable • 20% Comisión</p>
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
                            <div className="p-5 rounded-2xl bg-[#0c182b] border border-blue-500/40 hover:border-blue-400 transition-all flex flex-col justify-between space-y-4 shadow-sm">
                                <div>
                                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase tracking-wider block w-fit mb-3">
                                        Nivel 1 • Incentivo
                                    </span>
                                    <h3 className="text-sm font-black text-white leading-snug">Rendimiento Básico</h3>
                                    <div className="my-3 py-2 px-3 rounded-xl bg-black/40 border border-blue-500/20">
                                        <p className="text-lg font-black text-blue-300 font-mono">$25.00 USD Fijo</p>
                                        <p className="text-[10px] text-blue-400/80 font-mono">Mensual + 20% Comisiones</p>
                                    </div>
                                    <ul className="text-xs text-slate-300 space-y-2">
                                        <li>• <strong>3 números diarios</strong> de empresas con WhatsApp comprobable y <strong>ACTIVO</strong> (se valida si llegan mensajes y responde).</li>
                                        <li>• Envío de mensaje con texto e imagen publicitaria (captura obligatoria).</li>
                                        <li>• <strong>1 llamada larga semanal</strong> a clientes.</li>
                                    </ul>
                                </div>
                                <div className="p-2.5 rounded-lg bg-blue-950/40 border border-blue-500/20 text-[11px] text-blue-200">
                                    Estímulo fijo de $25 USD + 20% comisiones directas. Requiere &gt;30 días en el grupo.
                                </div>
                            </div>

                            {/* Nivel 2 */}
                            <div className="p-5 rounded-2xl bg-[#091b1a] border border-emerald-500/40 hover:border-emerald-400 transition-all flex flex-col justify-between space-y-4 shadow-sm">
                                <div>
                                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider block w-fit mb-3">
                                        Nivel 2 • Plan Mes 1
                                    </span>
                                    <h3 className="text-sm font-black text-white leading-snug">Puesto Fijo Junior</h3>
                                    <div className="my-3 py-2 px-3 rounded-xl bg-black/40 border border-emerald-500/20">
                                        <p className="text-lg font-black text-emerald-300 font-mono">$100.00 USD Fijo</p>
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
                            <div className="p-5 rounded-2xl bg-[#141026] border border-purple-500/40 hover:border-purple-400 transition-all flex flex-col justify-between space-y-4 shadow-sm">
                                <div>
                                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase tracking-wider block w-fit mb-3">
                                        Nivel 3 • Plan Mes 2
                                    </span>
                                    <h3 className="text-sm font-black text-white leading-snug">Puesto Fijo Intermedio</h3>
                                    <div className="my-3 py-2 px-3 rounded-xl bg-black/40 border border-purple-500/20">
                                        <p className="text-lg font-black text-purple-300 font-mono">$200.00 USD Fijo</p>
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
                            <div className="p-5 rounded-2xl bg-[#1c0f18] border-2 border-rose-500/60 hover:border-rose-400 transition-all flex flex-col justify-between space-y-4 shadow-md shadow-rose-950/30">
                                <div>
                                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-500/25 text-rose-300 border border-rose-500/40 uppercase tracking-wider block w-fit mb-3">
                                        Nivel 4 • Fast-Track
                                    </span>
                                    <h3 className="text-sm font-black text-white leading-snug">Puesto Fijo de Planta</h3>
                                    <div className="my-3 py-2 px-3 rounded-xl bg-black/40 border border-rose-500/30">
                                        <p className="text-lg font-black text-rose-300 font-mono">$450.00 USD Fijo</p>
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
                                <div className="p-2.5 rounded-lg bg-rose-950/50 border border-rose-500/30 text-[11px] text-rose-200 font-medium">
                                    Salario Básico Unificado $450 USD fijos + comisiones corporativas + estabilidad formal.
                                </div>
                            </div>
                        </div>

                        {/* SISTEMA DE PUNTOS ATOMIC (GAMIFICACIÓN Y RECOMPENSAS SEMANALES) */}
                        <div id="puntos" className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0c1a30] via-[#081224] to-[#050b18] border-2 border-cyan-500/50 shadow-[0_10px_40px_rgba(6,182,212,0.2)] space-y-6">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-cyan-500/30 pb-5">
                                <div className="space-y-1">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-mono text-xs font-bold uppercase tracking-widest">
                                        <Sparkles size={13} className="text-cyan-400 animate-pulse" />
                                        <span>Programa Oficial de Gamificación Comercial</span>
                                    </div>
                                    <h3 className="text-xl sm:text-2xl font-black text-white font-heading">
                                        Sistema de Puntos ATOMIC: Recompensas y Bonos Semanales
                                    </h3>
                                    <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                                        Premia tu esfuerzo diario en tiempo real. Cada número prospectado, llamada y cotización suma puntos en el Tablero de Honor semanal.
                                    </p>
                                </div>
                                <div className="shrink-0 px-4 py-2 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-200 font-mono text-xs font-black uppercase tracking-wider">
                                    Semana Activa · Lunes a Viernes
                                </div>
                            </div>

                            {/* Mecánica de Puntos */}
                            <div className="grid sm:grid-cols-3 gap-4">
                                <div className="p-4 rounded-2xl bg-black/40 border border-cyan-500/30 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase">Prospección</span>
                                        <span className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 font-mono font-black text-xs">+10 PUNTOS</span>
                                    </div>
                                    <h4 className="text-sm font-black text-white">Contacto Calificado Extraído</h4>
                                    <p className="text-xs text-slate-400 leading-relaxed">
                                        Subir al grupo el WhatsApp del cliente con la captura de pantalla de su consulta en Marketplace.
                                    </p>
                                </div>

                                <div className="p-4 rounded-2xl bg-black/40 border border-amber-500/30 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-mono font-bold text-amber-400 uppercase">Interacción</span>
                                        <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 font-mono font-black text-xs">+25 PUNTOS</span>
                                    </div>
                                    <h4 className="text-sm font-black text-white">Cotización Formal o Llamada</h4>
                                    <p className="text-xs text-slate-400 leading-relaxed">
                                        Prospecto que recibe cotización oficial emitida en plataforma o acepta llamada de asesoría comercial.
                                    </p>
                                </div>

                                <div className="p-4 rounded-2xl bg-black/40 border border-emerald-500/30 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase">Cierre Efectivo</span>
                                        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono font-black text-xs">+100 PUNTOS</span>
                                    </div>
                                    <h4 className="text-sm font-black text-white">Venta Concretada y Liquidada</h4>
                                    <p className="text-xs text-slate-400 leading-relaxed">
                                        Venta con comprobante bancario acreditado (+ 20% de comisión directa en efectivo transferida al asesor).
                                    </p>
                                </div>
                            </div>

                            {/* Beneficios Canjeables */}
                            <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/20 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono">
                                <div className="space-y-1 text-slate-300">
                                    <div className="flex items-center gap-2 font-bold text-cyan-300">
                                        <Award size={15} />
                                        <span>Beneficios del Ranking Semanal:</span>
                                    </div>
                                    <p className="text-[11px] text-slate-400 font-sans">
                                        🏆 <strong>Top 1 del Viernes:</strong> Bono de $15 USD en efectivo transferido en el acto · 🎯 <strong>Top 2:</strong> Asignación prioritaria de clientes inbound de pauta · 🛡️ <strong>200 Pts/mes:</strong> Habilita postulación directa a Sueldos Fijos.
                                    </p>
                                </div>
                                <a 
                                    href="https://wa.me/593989476556?text=Saludos%2C%20deseo%20activar%20mi%20participaci%C3%B3n%20en%20el%20Tablero%20de%20Puntos%20ATOMIC." 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-xs uppercase tracking-wider shrink-0 transition-transform hover:scale-105 shadow-md shadow-cyan-950/60"
                                >
                                    Activar mi Tablero →
                                </a>
                            </div>
                        </div>

                        {/* Footer informativo de la tabla */}
                        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-400">
                            <div>
                                <span>Dirección Comercial ATOMIC • Juan Guzmán - Director Comercial</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Link 
                                    href="/web/precios-vendedor" 
                                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-all"
                                >
                                    Ver Lista de Precios →
                                </Link>
                                <Link 
                                    href="/register?role=SALESPERSON" 
                                    className="px-5 py-2 rounded-xl bg-white hover:bg-slate-200 text-slate-950 font-black uppercase tracking-wider transition-all shadow-md shrink-0"
                                >
                                    Postular Ahora
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── 4. OPORTUNIDADES 100% REMOTAS & PLANETA 3D ILUMINADO (IMPACTO REGIONAL) ── */}
                <section className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-10 items-center bg-[#0b101d] border border-slate-800 rounded-3xl p-8 sm:p-12">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 font-mono text-xs font-bold uppercase tracking-wider">
                                <Globe size={14} className="text-blue-400" /> Cobertura Continental
                            </div>
                            <h2 className="text-2xl sm:text-4xl font-black text-white font-heading leading-tight">
                                Oportunidades 100% Remotas en LATAM
                            </h2>
                            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                                Nuestro modelo comercial descentralizado te permite operar desde cualquier rincón del país o el continente, conectando clientes con nuestro inventario físico y despacho garantizado.
                            </p>
                            <div className="space-y-3.5 pt-2">
                                {[
                                    "Trabajo 100% Remoto sin ataduras geográficas ni horarios rígidos.",
                                    "Transparencia total en el registro de tus ventas y comisiones en tiempo real.",
                                    "Acceso a productos de alta demanda con garantía escrita y respaldo técnico en Quito."
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
                                            <Check size={14} className="text-emerald-400" />
                                        </div>
                                        <span className="text-slate-300 text-xs sm:text-sm font-medium">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* PLANETA 3D SOFISTICADO CON ANILLOS Y ATMÓSFERA ILUMINADA */}
                        <div className="relative aspect-square md:aspect-auto md:h-[460px] rounded-3xl bg-gradient-to-b from-[#091122] via-[#060a16] to-[#04060e] border border-slate-700/60 overflow-hidden flex items-center justify-center p-8 group shadow-2xl">
                            
                            {/* Radial Glow Halo behind planet */}
                            <div className="absolute w-72 h-72 rounded-full bg-cyan-500/15 blur-3xl group-hover:bg-cyan-500/25 transition-all duration-700" />
                            <div className="absolute w-52 h-52 rounded-full bg-blue-600/20 blur-2xl" />

                            {/* Dynamic SVG Planetary Visualization */}
                            <svg className="w-64 h-64 sm:w-80 sm:h-80 relative z-10 transition-transform duration-700 group-hover:scale-105" viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <defs>
                                    <radialGradient id="planetBody" cx="35%" cy="30%" r="70%">
                                        <stop offset="0%" stopColor="#38bdf8" />
                                        <stop offset="25%" stopColor="#0284c7" />
                                        <stop offset="60%" stopColor="#0f172a" />
                                        <stop offset="100%" stopColor="#020617" />
                                    </radialGradient>
                                    <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                                        <stop offset="50%" stopColor="#818cf8" stopOpacity="0.2" />
                                        <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.7" />
                                    </linearGradient>
                                    <filter id="glow">
                                        <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                                        <feMerge>
                                            <feMergeNode in="coloredBlur"/>
                                            <feMergeNode in="SourceGraphic"/>
                                        </feMerge>
                                    </filter>
                                </defs>

                                {/* Background Atmosphere Aura */}
                                <circle cx="160" cy="160" r="92" fill="#38bdf8" fillOpacity="0.08" filter="url(#glow)" />
                                
                                {/* Back Half of Orbit Ring */}
                                <ellipse cx="160" cy="160" rx="140" ry="42" stroke="url(#ringGrad)" strokeWidth="2" strokeDasharray="6 4" transform="rotate(-24 160 160)" opacity="0.4" />

                                {/* Main Planetary Sphere */}
                                <circle cx="160" cy="160" r="80" fill="url(#planetBody)" stroke="#38bdf8" strokeWidth="1.5" strokeOpacity="0.5" />

                                {/* Latin America / Globe Meridian Grid Lines */}
                                <path d="M80 160 Q160 210 240 160" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.35" fill="none" />
                                <path d="M85 130 Q160 175 235 130" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.25" fill="none" />
                                <path d="M85 190 Q160 245 235 190" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.25" fill="none" />
                                <ellipse cx="160" cy="160" rx="35" ry="80" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.3" fill="none" />

                                {/* Illuminated Cities / Active Commercial Nodes (Ecuador, Peru, Colombia, Chile) */}
                                <circle cx="140" cy="165" r="4" fill="#10b981" filter="url(#glow)" />
                                <circle cx="150" cy="145" r="3.5" fill="#38bdf8" filter="url(#glow)" />
                                <circle cx="165" cy="190" r="3" fill="#f59e0b" filter="url(#glow)" />
                                <circle cx="130" cy="135" r="2.5" fill="#ec4899" filter="url(#glow)" />

                                {/* Connection Pulse Lines between hubs */}
                                <path d="M140 165 L150 145 L165 190" stroke="#10b981" strokeWidth="1" strokeOpacity="0.6" strokeDasharray="3 3" />

                                {/* Front Half of Orbit Ring */}
                                <path d="M22 172 C60 220 260 220 298 148" stroke="url(#ringGrad)" strokeWidth="2.5" fill="none" filter="url(#glow)" />
                            </svg>

                            {/* Floating Overlay Badge */}
                            <div className="absolute bottom-6 inset-x-6 z-20 text-center bg-black/60 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                                <h3 className="text-base font-black text-white">Impacto Regional</h3>
                                <p className="text-xs text-cyan-400 font-mono font-bold mt-0.5">Operaciones Comerciales en Todo Ecuador & LATAM</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── 5. OFICINA VIRTUAL & ACTIVIDADES OPERATIVAS (SOBRIAS Y ELEGANTES) ── */}
                <section className="max-w-7xl mx-auto px-6">
                    <div className="p-8 rounded-3xl bg-[#0b101d] border border-slate-800 space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                            <div>
                                <h3 className="text-xl sm:text-2xl font-black text-white font-heading">
                                    Actividades que Mantienen Viva la Oficina Virtual
                                </h3>
                                <p className="text-slate-400 text-xs sm:text-sm mt-1">
                                    Tu permanencia y calificación a sueldo fijo se miden por puntualidad y contacto directo con coordinación.
                                </p>
                            </div>
                            <Link 
                                href="/web/empleo-freelance"
                                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold transition-all shrink-0"
                            >
                                Modalidad Freelance (Sin Oficina) →
                            </Link>
                        </div>

                        <div className="grid sm:grid-cols-3 gap-4">
                            <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-2">
                                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                                    <Video size={18} />
                                </div>
                                <h4 className="text-base font-bold text-white">Reuniones en Zoom</h4>
                                <p className="text-slate-400 text-xs leading-relaxed">
                                    Sesiones sincrónicas para revisión de promociones, stock de remate y soporte técnico-comercial.
                                </p>
                            </div>

                            <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-2">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                                    <CalendarCheck size={18} />
                                </div>
                                <h4 className="text-base font-bold text-white">Timbrado de Asistencias</h4>
                                <p className="text-slate-400 text-xs leading-relaxed">
                                    Registro de entrada y salida diario en la plataforma reflejado en tu matriz gráfica de 30 días.
                                </p>
                            </div>

                            <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-2">
                                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                                    <ShieldCheck size={18} />
                                </div>
                                <h4 className="text-base font-bold text-white">Seguimiento con Stefy</h4>
                                <p className="text-slate-400 text-xs leading-relaxed">
                                    Validación de capturas de mensajes, números activos comprobables y justificaciones directas.
                                </p>
                            </div>
                        </div>

                        {/* Banner resumen de tareas diarias */}
                        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
                            <div className="flex items-center gap-2 text-slate-300">
                                <Clock size={16} className="text-slate-400 shrink-0" />
                                <span><strong>Meta Diaria:</strong> 5 publicaciones Marketplace • 3 grupos FB • 10 prospectos Maps • Llamadas según nivel</span>
                            </div>
                            <Link 
                                href="/web/precios-vendedor"
                                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold shrink-0 border border-slate-700 transition-colors"
                            >
                                Ver Guiones de Llamada →
                            </Link>
                        </div>
                    </div>
                </section>

                {/* ── 6. METODOLOGÍA DE TRABAJO (PASO 1 COMO GRAN BENEFICIO AUTOMATIZADO) ── */}
                <section className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-8">
                        <span className="text-xs font-mono text-cyan-400 uppercase font-bold tracking-widest block mb-1">
                            Tu Recorrido de Crecimiento
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-black text-white font-heading">
                            Metodología y Beneficios de Ingreso
                        </h2>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-6">
                        {/* BENEFICIO 1: HERRAMIENTAS DE REGISTRO AUTOMÁTICO */}
                        <div className="p-6 rounded-3xl bg-[#09152b] border-2 border-cyan-500/40 hover:border-cyan-400 transition-all space-y-4 shadow-xl">
                            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold">
                                <Sparkles size={24} />
                            </div>
                            <div>
                                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider block">
                                    Beneficio Exclusivo #1
                                </span>
                                <h3 className="text-lg font-black text-white mt-1">
                                    Herramientas de Registro Automático
                                </h3>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed">
                                <strong>Cero demoras burocráticas:</strong> Al registrarte con rol &lsquo;Vendedor&rsquo;, el sistema te crea inmediatamente tu cuenta digital. Accedes en el acto a nuestro cotizador web, cálculo automatizado de tu 20% de comisión y acceso a más de 3.000 productos con fichas y precios listos para vender.
                            </p>
                            <div className="p-2.5 rounded-xl bg-black/40 border border-cyan-500/20 text-[11px] font-mono text-cyan-200">
                                ⚡ Alta instantánea sin esperas manuales.
                            </div>
                        </div>

                        {/* PASO 2: INGRESO A GRUPOS DE TRABAJO */}
                        <div className="p-6 rounded-3xl bg-[#0b101d] border border-slate-800 hover:border-slate-700 transition-all space-y-4 shadow-lg">
                            <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-300 flex items-center justify-center font-bold">
                                <Users size={24} />
                            </div>
                            <div>
                                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                                    Paso #2 Operativo
                                </span>
                                <h3 className="text-lg font-black text-white mt-1">
                                    Ingreso a Grupos de Trabajo
                                </h3>
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Te integras inmediatamente a nuestros grupos oficiales de WhatsApp y comunidades operativas. Recibes en tiempo real las ofertas de remate, promociones flash y alertas de stock de bodega desde el minuto cero.
                            </p>
                            <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 text-[11px] font-mono text-slate-400">
                                👥 Trabajo en equipo y dinamismo diario.
                            </div>
                        </div>

                        {/* PASO 3: GUÍA DIRECTA DE COORDINADORA */}
                        <div className="p-6 rounded-3xl bg-[#0b101d] border border-slate-800 hover:border-slate-700 transition-all space-y-4 shadow-lg">
                            <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-300 flex items-center justify-center font-bold">
                                <ShieldCheck size={24} />
                            </div>
                            <div>
                                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                                    Paso #3 Acompañamiento
                                </span>
                                <h3 className="text-lg font-black text-white mt-1">
                                    Guía Directa de Coordinadora
                                </h3>
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Stefy te asigna tus primeros 3 anuncios ya testeados en Marketplace, audita tus primeros números activos y te ayuda a resolver objeciones técnicas de clientes para que concretes tu primera venta rápidamente.
                            </p>
                            <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 text-[11px] font-mono text-slate-400">
                                🛡️ Acompañamiento personalizado permanente.
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── 7. CIERRE Y ACCIÓN ── */}
                <section className="max-w-7xl mx-auto px-6 text-center">
                    <div className="p-10 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700 text-white space-y-4 shadow-xl">
                        <h3 className="text-2xl sm:text-3xl font-black text-white font-heading">
                            Construye tu Carrera Comercial con ATOMIC
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
                            Comisiones directas del 20%, bonificaciones semanales y contratos de planta para profesionales que demuestren resultados.
                        </p>
                        <div className="pt-2 flex flex-wrap justify-center gap-3">
                            <Link 
                                href="/register?role=SALESPERSON" 
                                className="px-8 py-3.5 rounded-xl bg-white text-slate-950 font-black text-sm hover:bg-slate-200 transition-all shadow-lg"
                            >
                                Postular Ahora
                            </Link>
                            <Link 
                                href="/web/precios-vendedor" 
                                className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 font-bold text-sm transition-all"
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
