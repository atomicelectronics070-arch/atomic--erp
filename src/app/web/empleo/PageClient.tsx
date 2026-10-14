"use client"


import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import {
    Briefcase, Globe, Target, Cpu, CheckCircle2, ChevronRight,
    Users, Star, TrendingUp, Monitor, ShieldCheck, ArrowRight,
    Award, Layers, Zap, Video, CalendarCheck, Clock, Sparkles, PhoneCall
} from "lucide-react"

const BENEFITS = [
    {
        id: "fijo",
        label: "Trabajo Fijo",
        icon: Briefcase,
        title: "Estabilidad y Crecimiento",
        content: "Si logras las metas indicadas y demuestras un desempeño correcto y constante en tus actividades, tendrás la oportunidad de acceder a un sueldo fijo base, además de las comisiones generadas. Premiamos la excelencia."
    },
    {
        id: "permanencia",
        label: "Permanencia",
        icon: Star,
        title: "Opciones de Permanencia",
        content: "Cumpliendo múltiples meses dentro de la empresa con resultados sólidos, tendrás la opción de acceder a mejores condiciones, bonos exclusivos de permanencia y participación en grupos de alto rendimiento."
    },
    {
        id: "afiliacion",
        label: "Afiliación Remota",
        icon: Users,
        title: "Flexibilidad Total",
        content: "Si no logras cumplir las métricas de élite indicadas por tu coordinadora, ¡no te preocupes! Puedes quedarte como afiliado de la empresa. Seguirás recibiendo capacitación, instrucciones y apoyo. Trabaja 100% de forma remota, vende desde donde quieras, cuando quieras, accediendo a tu plataforma."
    }
]

export default function EmpleoLandingPage() {
    const [activeTab, setActiveTab] = useState(BENEFITS[0].id)

    return (
        <div className="min-h-screen bg-[#050505] text-slate-200 selection:bg-emerald-500/30 font-sans overflow-x-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-900/20 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-600/10 blur-[120px]" />
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
            </div>

            {/* Navbar */}
            <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-black/40 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center shadow-[0_12px_40px_rgba(0,0,0,0.5)] shadow-emerald-500/20">
                            <Target className="text-white" size={20} />
                        </div>
                        <span className="text-xl font-black text-white tracking-tight">Atomic Careers</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/web/empleo-freelance" className="hidden sm:inline-flex px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold text-xs hover:bg-amber-500/20 transition-all">
                            ⚡ Ver Vendedor Bajo Comisión (Freelance)
                        </Link>
                        <Link href="/register?role=SALESPERSON" className="px-6 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-black text-sm transition-all shadow-lg shadow-emerald-950/50">
                            Aplicar Ahora
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="relative z-10 pt-32 pb-24 space-y-32">
                
                {/* 1. HERO SECTION */}
                <section className="max-w-7xl mx-auto px-6 pt-12 md:pt-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center max-w-4xl mx-auto"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-bold text-xs uppercase tracking-widest mb-8">
                            <Zap size={14} /> Vanguardia en Tecnología
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-tight mb-8">
                            Importamos y Distribuimos <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                                Excelencia Tecnológica.
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto mb-12">
                            Somos una empresa especializada en brindar productos y servicios de alta calidad. 
                            Buscamos talento con mentalidad de crecimiento para revolucionar el comercio a distancia.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/register?role=SALESPERSON" className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-slate-100 font-black text-lg hover:scale-105 transition-transform shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2">
                                Iniciar como Vendedor <ArrowRight size={20} />
                            </Link>
                            <Link href="/login" className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900/50 backdrop-blur-xl border-slate-700/50/5 border border-white/10 text-white font-black text-lg hover:bg-slate-900/50 backdrop-blur-xl border-slate-700/50/10 transition-colors flex items-center justify-center gap-2">
                                Ya tengo cuenta
                            </Link>
                        </div>
                    </motion.div>
                </section>

                {/* 2. MISSION & VISION */}
                <section className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-6"
                        >
                            <h2 className="text-3xl md:text-4xl font-black text-white">
                                Oportunidades 100% Remotas en LATAM
                            </h2>
                            <p className="text-slate-400 text-lg leading-relaxed">
                                Nuestro principal objetivo con esta vacante es conectar oportunidades de crecimiento 
                                reales con personas alineadas a nuestra mentalidad de escalar.
                            </p>
                            <div className="space-y-4 pt-4">
                                {[
                                    "Trabajo 100% Remoto sin ataduras geográficas.",
                                    "Transparencia total en tus métricas el 100% del tiempo.",
                                    "Mentalidad de crecimiento y escalabilidad dentro de Latinoamérica."
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                                            <CheckCircle2 className="text-emerald-400" size={16} />
                                        </div>
                                        <span className="text-slate-300 font-medium">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative aspect-square md:aspect-auto md:h-[500px] rounded-[2rem] bg-gradient-to-tr from-slate-900 to-slate-800 border border-white/10 overflow-hidden flex items-center justify-center"
                        >
                            <Globe size={180} className="text-emerald-500/20 absolute" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                            <div className="relative z-10 p-8 text-center">
                                <h3 className="text-2xl font-black text-white mb-2">Impacto Regional</h3>
                                <p className="text-emerald-400 font-bold">Desde cualquier país de Latinoamérica.</p>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* 2.5 OFICINA VIRTUAL & ACTIVIDADES QUE MANTIENEN VIVA LA OFICINA */}
                <section className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 25 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="p-8 md:p-12 rounded-[2.5rem] bg-gradient-to-br from-[#0c1836] via-[#091126] to-[#040814] border-2 border-cyan-500/40 shadow-[0_0_80px_rgba(6,182,212,0.18)] space-y-8"
                    >
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-6">
                            <div>
                                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold uppercase tracking-widest mb-3">
                                    <Sparkles size={14} /> Dinámica de Operaciones Diarias
                                </span>
                                <h2 className="text-3xl md:text-4xl font-black text-white">
                                    Actividades que Mantienen Viva la Oficina Virtual
                                </h2>
                                <p className="text-slate-300 text-sm md:text-base mt-2 max-w-2xl">
                                    Como asesor comercial de staff fijo en nuestra <strong>Oficina Virtual</strong>, tu compromiso diario se mide a través del cumplimiento de las actividades operativas, puntualidad y el contacto directo con tu coordinación.
                                </p>
                            </div>

                            <Link 
                                href="/web/empleo-freelance"
                                className="px-5 py-3 rounded-2xl bg-amber-500/15 border border-amber-500/40 hover:bg-amber-500/25 text-amber-300 text-xs font-bold transition-all flex items-center gap-2 shrink-0"
                            >
                                <span>¿Prefieres modalidad 100% freelance sin oficina?</span>
                                <ArrowRight size={14} />
                            </Link>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {/* Pilar 1: Reuniones en Zoom */}
                            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-3 hover:border-cyan-500/30 transition-all">
                                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                                    <Video size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-white">Reuniones Diarias en Zoom</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    Deberás asistir puntualmente a las sesiones sincrónicas del equipo en Zoom para alineación de promociones, revisión de stock de remate y soporte técnico comercial en vivo.
                                </p>
                            </div>

                            {/* Pilar 2: Marcaje de Asistencias */}
                            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-3 hover:border-emerald-500/30 transition-all">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                                    <CalendarCheck size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-white">Timbrado y Asistencias</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    Registrarás tu timbrado de entrada y salida oficial en la plataforma todos los días. Cada jornada de tu ciclo laboral se refleja en tiempo real en tu matriz gráfica de 30 días.
                                </p>
                            </div>

                            {/* Pilar 3: Seguimiento y Justificaciones con Asesores */}
                            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-3 hover:border-indigo-500/30 transition-all">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                                    <ShieldCheck size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-white">Seguimiento con Coordinación</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    Todo seguimiento de tus actividades operativas, metas diarias, permisos o justificaciones de inasistencia se llevará de forma transparente y directa con tus coordinadores y asesores designados.
                                </p>
                            </div>
                        </div>

                        {/* Banner resumen de tareas diarias */}
                        <div className="p-5 rounded-2xl bg-black/40 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono">
                            <div className="flex items-center gap-3 text-slate-300">
                                <Clock size={18} className="text-cyan-400 shrink-0" />
                                <span>
                                    <strong>Tareas Diarias Clave:</strong> 5 publicaciones en Marketplace • 3 en grupos FB • 10 prospectos en Maps • 7 llamadas • 5 estados WhatsApp
                                </span>
                            </div>
                            <Link 
                                href="/register?role=SALESPERSON"
                                className="px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-black uppercase tracking-wider shrink-0 transition-transform hover:scale-105"
                            >
                                Iniciar Carrera Fija
                            </Link>
                        </div>
                    </motion.div>
                </section>

                {/* 3. METODOLOGÍA & PLATAFORMA */}
                <section className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Metodología de Trabajo</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">Así es tu recorrido desde el momento en que decides aplicar.</p>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: Monitor,
                                title: "1. Registro en la Plataforma",
                                desc: "Al momento de registrarte y colocar el rol de 'vendedor', automáticamente tendrás acceso a nuestra plataforma. Podrás ver todos los productos que vas a vender."
                            },
                            {
                                icon: Users,
                                title: "2. Ingreso a Grupos de Trabajo",
                                desc: "Ingresarás inmediatamente a nuestros múltiples grupos de trabajo apenas empieces. Te conectarás con la dinámica del equipo desde el minuto cero."
                            },
                            {
                                icon: ShieldCheck,
                                title: "3. Guía de Coordinadora",
                                desc: "Recibirás contacto directo de tu coordinadora, quien te guiará por tu recorrido laboral brindándote las indicaciones y pasos necesarios durante todo el trayecto."
                            }
                        ].map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50/5 border border-white/10 rounded-3xl p-8 hover:bg-slate-900/50 backdrop-blur-xl border-slate-700/50/[0.07] transition-colors"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6">
                                    <step.icon size={28} className="text-emerald-400" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-4">{step.title}</h3>
                                <p className="text-slate-400 leading-relaxed text-sm">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* 4. BENEFICIOS Y CONDICIONES (TABS) */}
                <section className="max-w-7xl mx-auto px-6">
                    <div className="bg-gradient-to-b from-slate-900 to-black border border-white/10 rounded-[2.5rem] p-8 md:p-12">
                        <h2 className="text-3xl md:text-4xl font-black text-white mb-10 text-center">Trayectoria y Clasificación</h2>
                        
                        <div className="flex flex-col md:flex-row gap-8 lg:gap-16">
                            {/* Tabs Selectors */}
                            <div className="flex md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0 md:min-w-[250px] scrollbar-hide">
                                {BENEFITS.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-3 px-6 py-4 rounded-2xl text-left font-bold transition-all whitespace-nowrap ${
                                            activeTab === tab.id 
                                            ? "bg-emerald-500 text-slate-100 shadow-[0_12px_40px_rgba(0,0,0,0.5)] shadow-emerald-500/20" 
                                            : "text-slate-400 hover:bg-slate-900/50 backdrop-blur-xl border-slate-700/50/5 hover:text-white"
                                        }`}
                                    >
                                        <tab.icon size={20} />
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* Tab Content */}
                            <div className="flex-1">
                                <AnimatePresence mode="wait">
                                    {BENEFITS.map((tab) => activeTab === tab.id && (
                                        <motion.div
                                            key={tab.id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.3 }}
                                            className="h-full flex flex-col justify-center"
                                        >
                                            <div className="w-16 h-16 rounded-2xl bg-slate-900/50 backdrop-blur-xl border-slate-700/50/5 border border-white/10 flex items-center justify-center mb-8">
                                                <tab.icon size={32} className="text-emerald-400" />
                                            </div>
                                            <h3 className="text-3xl font-black text-white mb-6">{tab.title}</h3>
                                            <p className="text-xl text-slate-300 leading-relaxed font-medium">
                                                {tab.content}
                                            </p>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 5. CAPACITACIÓN DESTACADA */}
                <section className="max-w-7xl mx-auto px-6 pb-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative overflow-hidden rounded-[2.5rem] bg-emerald-600 border border-emerald-500 p-10 md:p-16"
                    >
                        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay" />
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-slate-900/50 backdrop-blur-xl border-slate-700/50/20 blur-[100px] rounded-full pointer-events-none translate-x-1/2 -translate-y-1/2" />
                        
                        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">
                                    Beneficios de nuestras Capacitaciones.
                                </h2>
                                <p className="text-emerald-50 text-lg md:text-xl font-medium leading-relaxed mb-8">
                                    Te brindamos capacitación en todo momento. Oportunidades reales de crecimiento, 
                                    especialización y sobre todo, de un entendimiento profundo sobre las categorías que vendes.
                                </p>
                                <div className="space-y-4 text-emerald-50 font-medium">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle2 size={20} className="text-white" />
                                        Metas de desempeño semanales y mensuales.
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <CheckCircle2 size={20} className="text-white" />
                                        Evaluación constante de actividades dentro del grupo.
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <CheckCircle2 size={20} className="text-white" />
                                        Evolución profesional integral.
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-center md:justify-end">
                                <Link href="/register" className="px-10 py-5 bg-black text-white rounded-2xl font-black text-xl hover:scale-105 transition-transform flex items-center gap-3 shadow-2xl">
                                    Quiero Evolucionar <ChevronRight size={24} className="text-emerald-400" />
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </section>
            </main>
        </div>
    )
}
