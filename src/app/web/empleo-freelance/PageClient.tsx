"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import {
    Briefcase, Globe, Target, Cpu, CheckCircle2, ChevronRight,
    Users, Star, TrendingUp, Monitor, ShieldCheck, ArrowRight,
    Award, Layers, Zap, ShieldAlert, CalendarCheck, Share2, MapPin,
    DollarSign, Clock, MessageSquare, PhoneCall, Sparkles, FileText
} from "lucide-react"

export default function EmpleoFreelancePageClient() {
    return (
        <div className="min-h-screen bg-[#04060f] text-slate-200 selection:bg-amber-500/30 font-sans overflow-x-hidden">
            {/* Background Ambient Glows */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-amber-600/15 blur-[140px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] rounded-full bg-orange-600/10 blur-[140px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] h-[50%] rounded-full bg-cyan-600/5 blur-[160px]" />
            </div>

            {/* Navbar */}
            <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                            <Target className="text-black" size={20} strokeWidth={2.5} />
                        </div>
                        <div>
                            <span className="text-lg font-black text-white tracking-tight">Atomic Careers</span>
                            <span className="hidden sm:inline-block ml-2 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                FREELANCE • BAJO COMISIÓN
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link 
                            href="/web/empleo" 
                            className="hidden sm:inline-flex px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-bold text-xs transition-all"
                        >
                            Ver Vendedor Fijo (Oficina Virtual) →
                        </Link>
                        <Link 
                            href="/register?role=SALESPERSON" 
                            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black text-sm transition-all shadow-lg shadow-amber-950/50"
                        >
                            Aplicar como Freelancer
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="relative z-10 pt-32 pb-24 space-y-24">
                
                {/* 1. HERO SECTION */}
                <section className="max-w-7xl mx-auto px-6 pt-8 md:pt-16">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center max-w-4xl mx-auto"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 font-bold text-xs uppercase tracking-widest mb-8">
                            <Sparkles size={14} /> Modalidad 100% Remota • Sin Horario de Oficina
                        </div>

                        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-tight mb-8">
                            Ventas de Alta Tecnología <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400">
                                Bajo Comisión & Freelance.
                            </span>
                        </h1>

                        <p className="text-base sm:text-xl text-slate-300 font-medium leading-relaxed max-w-2xl mx-auto mb-10">
                            Vende desde donde quieras, en el horario que elijas. Ponemos a tu disposición nuestro catálogo oficial, inventario de remate y cotizador inteligente para generar ingresos directos sin techo.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link 
                                href="/register?role=SALESPERSON" 
                                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-black font-black text-lg hover:scale-105 transition-transform shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2"
                            >
                                Registrarme como Vendedor Freelance <ArrowRight size={20} />
                            </Link>
                            <Link 
                                href="/web/empleo" 
                                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-lg transition-colors flex items-center justify-center gap-2"
                            >
                                Ver Vendedor Fijo
                            </Link>
                        </div>
                    </motion.div>
                </section>

                {/* 2. REGLAMENTO OBLIGATORIO: LAS 3 ÚNICAS CONDICIONES */}
                <section className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 25 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="p-8 md:p-12 rounded-[2.5rem] bg-gradient-to-b from-[#101736] via-[#0b1026] to-[#050814] border-2 border-amber-500/40 shadow-[0_0_80px_rgba(245,158,11,0.2)] space-y-8"
                    >
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-6">
                            <div>
                                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold uppercase tracking-widest mb-3">
                                    <ShieldAlert size={14} /> Requisitos Indispensables
                                </span>
                                <h2 className="text-3xl md:text-4xl font-black text-white">
                                    Las 3 Tareas Obligatorias y Condicionantes
                                </h2>
                                <p className="text-slate-300 text-sm md:text-base mt-2 max-w-2xl">
                                    Para pertenecer y permanecer activo en el grupo comercial bajo comisión, debes cumplir estrictamente con estas 3 actividades de lunes a viernes:
                                </p>
                            </div>

                            <span className="px-4 py-2 rounded-xl bg-amber-500 text-black font-black text-xs uppercase tracking-wider shrink-0 shadow-md">
                                Cero Excepciones
                            </span>
                        </div>

                        {/* The 3 Pillars */}
                        <div className="grid md:grid-cols-3 gap-6">
                            {/* Pilar 1: 5 Publicaciones al Día */}
                            <div className="p-6 sm:p-7 rounded-3xl bg-white/5 border border-white/10 space-y-4 hover:border-amber-400/40 transition-all">
                                <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-2xl">
                                    1
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        <Share2 size={18} className="text-amber-400" />
                                        <span>5 Publicaciones Diarias</span>
                                    </h3>
                                    <span className="text-[10px] font-mono text-amber-300 font-bold uppercase">
                                        Marketplace de Lunes a Viernes
                                    </span>
                                </div>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    Publicar diariamente al menos <strong>5 productos</strong> de nuestro catálogo oficial en Facebook Marketplace y grupos de venta, utilizando las fotos y fichas de alta calidad que te proveemos en la plataforma.
                                </p>
                            </div>

                            {/* Pilar 2: 15 Números de Maps a la Semana */}
                            <div className="p-6 sm:p-7 rounded-3xl bg-white/5 border border-white/10 space-y-4 hover:border-cyan-400/40 transition-all">
                                <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-black text-2xl">
                                    2
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        <MapPin size={18} className="text-cyan-400" />
                                        <span>Recolectar Números de Maps</span>
                                    </h3>
                                    <span className="text-[10px] font-mono text-cyan-300 font-bold uppercase">
                                        15 Clientes Potenciales a la Semana
                                    </span>
                                </div>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    Buscar en Google Maps negocios o clientes potenciales (gimnasios, clínicas, tiendas, oficinas), <strong>registrar sus números en la plataforma</strong> y <strong>escribirles a todos con una oferta referente</strong> de nuestros productos o servicios.
                                </p>
                            </div>

                            {/* Pilar 3: Marcar Asistencia Diaria */}
                            <div className="p-6 sm:p-7 rounded-3xl bg-white/5 border border-white/10 space-y-4 hover:border-emerald-400/40 transition-all">
                                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-2xl">
                                    3
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        <CalendarCheck size={18} className="text-emerald-400" />
                                        <span>Marcar Asistencia Diaria</span>
                                    </h3>
                                    <span className="text-[10px] font-mono text-emerald-300 font-bold uppercase">
                                        Timbrado en la Plataforma
                                    </span>
                                </div>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    Ingresar a la plataforma y marcar tu asistencia todos los días usando el botón de <strong>"Asistencia Rápida"</strong> o en tu panel. Esto demuestra que estás activo comercializando en el sistema.
                                </p>
                            </div>
                        </div>

                        {/* Resumen Condicionante Destacado */}
                        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs sm:text-sm font-medium leading-relaxed">
                            💡 <em>"¿Sabías que para pertenecer al grupo bajo comisión debes marcar tu asistencia todos los días aquí en la plataforma, hacer 5 publicaciones cada día, además de recolectar 15 números de teléfono a la semana de clientes potenciales de Google Maps que registrarás en la plataforma y les escribirás ofertando nuestros servicios? Son las únicas tres tareas condicionantes y obligatorias para pertenecer al grupo bajo comisión."</em>
                        </div>
                    </motion.div>
                </section>

                {/* 3. BENEFICIOS DEL VENDEDOR FREELANCE */}
                <section className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                            Herramientas y Ventajas Comerciales
                        </h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            Aunque seas independiente, cuentas con todo el respaldo tecnológico de ATOMIC ERP.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                icon: DollarSign,
                                title: "Comisiones por Cierre",
                                desc: "Gana comisiones directas por cada venta concretada. Sin límites ni topes de ganancia mensual."
                            },
                            {
                                icon: FileText,
                                title: "Cotizador PROP Oficial",
                                desc: "Genera cotizaciones profesionales en PDF de alta resolución y hojas de Excel con tu nombre en segundos."
                            },
                            {
                                icon: Layers,
                                title: "Catálogo Completo",
                                desc: "Acceso a más de 11 categorías de tecnología: Cámaras CCTV, Domótica, Redes, Acceso y Equipos Smart."
                            },
                            {
                                icon: Clock,
                                title: "Autonomía Total",
                                desc: "Administra tus propios tiempos. Solo debes cumplir las 3 condiciones de publicaciones, Maps y timbrado."
                            }
                        ].map((b, i) => (
                            <div 
                                key={i}
                                className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-3 hover:border-amber-500/40 transition-all"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
                                    <b.icon size={22} />
                                </div>
                                <h3 className="text-lg font-bold text-white">{b.title}</h3>
                                <p className="text-slate-400 text-xs leading-relaxed">{b.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 4. CALL TO ACTION */}
                <section className="max-w-7xl mx-auto px-6 pb-12">
                    <div className="p-10 md:p-16 rounded-[2.5rem] bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 text-black flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
                        <div className="space-y-3 text-center md:text-left">
                            <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                                ¿Listo para Empezar a Generar Comisiones?
                            </h2>
                            <p className="text-amber-100 font-medium text-sm sm:text-base max-w-xl">
                                Regístrate hoy mismo, accede a tu plataforma, marca tu primera asistencia y empieza a publicar en Marketplace.
                            </p>
                        </div>

                        <Link 
                            href="/register?role=SALESPERSON"
                            className="px-8 py-4 rounded-2xl bg-black text-white hover:bg-slate-900 font-black text-base uppercase tracking-wider shrink-0 transition-all hover:scale-105 shadow-xl flex items-center gap-2"
                        >
                            <span>Comenzar Ahora</span>
                            <ChevronRight size={18} className="text-amber-400" />
                        </Link>
                    </div>
                </section>
            </main>
        </div>
    )
}
