
export const dynamic = 'force-dynamic'
export const revalidate = 0
"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { MessageSquare, Phone, Calendar, FileText, Send, ArrowRight, CheckCircle2, Zap, Bot, Clock, DollarSign, TrendingUp, Shield } from "lucide-react"

export default function ChatBotsPage() {
    const [activeBot, setActiveBot] = useState(0)
    const [form, setForm] = useState({ name: "", phone: "", email: "", business: "", message: "" })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        alert("Formulario enviado. Nos contactaremos pronto.")
        setForm({ name: "", phone: "", email: "", business: "", message: "" })
    }

    const bots = [
        {
            key: "atiende",
            title: "ATIENDE",
            subtitle: "El bot que trabaja por ti 24/7",
            img: "/assets/bots/bot4.jpeg",
            color: "orange",
            accent: "from-orange-500 to-amber-500",
            border: "border-orange-500/30",
            badge: "bg-orange-500/10 text-orange-400 border-orange-500/30",
            desc: "Nuestro bot inteligente atiende, entiende y resuelve. Lleva flujos lógicos avanzados, conecta con tu base de productos y entrega cotizaciones, Excel o facturas oficiales en segundos, sin intervención humana.",
            features: [
                "Flujos Lógicos Avanzados", "Escarba en Base de Productos", "Cotizaciones en PDF Automáticas",
                "Generación de Excel y Reportes", "Facturas Oficiales Automatizadas", "Atención 24/7 sin Interrupciones",
                "Atención Personalizada", "Aprende y Mejora Cada Día", "Seguro y Confiable", "Integración Total (ERP, CRM)"
            ]
        },
        {
            key: "llama",
            title: "LLAMA",
            subtitle: "Conecta, gestiona y crece",
            img: "/assets/bots/bot2.jpeg",
            color: "green",
            accent: "from-green-500 to-emerald-500",
            border: "border-green-500/30",
            badge: "bg-green-500/10 text-green-400 border-green-500/30",
            desc: "Nuestro bot inteligente llama de forma ordenada y lógica, llevando recordatorios de citas y recordatorios para ti por WhatsApp. Genera reportes resumidos y llena tu agenda personal.",
            features: [
                "Llamadas Ordenadas y Lógicas", "Recordatorios por WhatsApp", "Registro de Citas y Seguimiento",
                "Reportes Resumidos Automáticos", "Agenda Personal Inteligente", "Recordatorios de Citas",
                "Optimiza tu Tiempo", "Relación Más Cercana con Clientes", "Gestión Completa de Llamadas", "Seguridad y Confianza"
            ]
        },
        {
            key: "agenda",
            title: "AGENDA",
            subtitle: "Tu tiempo, tus clientes, tu éxito",
            img: "/assets/bots/bot3.jpeg",
            color: "blue",
            accent: "from-blue-500 to-indigo-500",
            border: "border-blue-500/30",
            badge: "bg-blue-500/10 text-blue-400 border-blue-500/30",
            desc: "Nuestro bot inteligente organiza tu agenda, lleva registro ordenado de citas y te envía recordatorios por WhatsApp. Genera reportes resumidos y llena tu agenda personal.",
            features: [
                "Registro Ordenado de Citas", "Recordatorios por WhatsApp", "Reportes Resumidos Automáticos",
                "Agenda Personal Inteligente", "Integración con Clientes", "Alertas Personalizadas",
                "Sincronización Multiplataforma", "Análisis de Tiempo", "Seguridad y Privacidad", "Mejora tus Relaciones"
            ]
        },
        {
            key: "facturacion",
            title: "FACTURACIÓN",
            subtitle: "Y Cotización — Conectado al SRI",
            img: "/assets/bots/bot1.jpeg",
            color: "purple",
            accent: "from-purple-500 to-violet-500",
            border: "border-purple-500/30",
            badge: "bg-purple-500/10 text-purple-400 border-purple-500/30",
            desc: "Nuestro bot genera cotizaciones y facturas oficiales, lleva registro ordenado de históricos y se conecta a tu SRI para emitir comprobantes válidos y cumplir con todas las normativas.",
            features: [
                "Cotizaciones Profesionales Automáticas", "Facturas Oficiales (SRI)", "Histórico Ordenado",
                "Conectado a tu SRI", "Reportes y Estadísticas", "Gestión de Clientes",
                "Recordatorios Automáticos", "Envío Automático por WhatsApp", "Cumplimiento Garantizado", "Seguridad Total"
            ]
        },
    ]

    const current = bots[activeBot]

    const benefits = [
        { icon: Clock, label: "Ahorra Tiempo", desc: "En tareas repetitivas que consume horas a tu equipo." },
        { icon: DollarSign, label: "Reduce Costos", desc: "Automatiza sin contratar más personal para atención." },
        { icon: TrendingUp, label: "Atención 24/7", desc: "Sin pausas ni errores, todos los días del año." },
        { icon: Shield, label: "Haz Crecer tu Negocio", desc: "Escala sin límites con tecnología que trabaja por ti." },
    ]

    return (
        <div className="font-sans text-[#0F172A] bg-[#F8FAFC]">

            {/* HERO */}
            <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-[#020617]">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500 rounded-full blur-[140px]" />
                    <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-amber-400 rounded-full blur-[120px]" />
                </div>
                <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 flex flex-col lg:flex-row items-center gap-16">
                    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="flex-1 space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-sm font-bold uppercase tracking-wider">
                            <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" /> Atomic Sistems · IA para Negocios
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1]">
                            Chat<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">Bots</span><br />
                            <span className="text-3xl md:text-4xl text-slate-400 font-bold">Inteligentes para tu Negocio</span>
                        </h1>
                        <p className="text-slate-400 text-xl font-medium max-w-xl">
                            Automatiza tu atención al cliente, gestión de llamadas, agenda de citas y facturación — todo con bots inteligentes que trabajan 24/7 sin descanso.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <button onClick={() => document.getElementById('bots')?.scrollIntoView({ behavior: 'smooth' })} className="inline-flex items-center gap-2 px-8 py-4 bg-orange-500 hover:bg-orange-400 text-[#020617] rounded-xl font-black text-lg transition-all hover:scale-105 shadow-xl shadow-orange-500/30">
                                Ver Módulos de Bot <ArrowRight size={20} />
                            </button>
                            <button onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-slate-900/50 backdrop-blur-xl border-slate-700/50/5 hover:bg-slate-900/50 backdrop-blur-xl border-slate-700/50/10 text-white border border-white/10 rounded-xl font-bold text-lg transition-all">
                                Activar mi Bot
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-6 pt-2">
                            {["Sin intervención humana", "Conectado a WhatsApp", "Integración SRI Ecuador"].map((b, i) => (
                                <div key={i} className="flex items-center gap-2 text-slate-400 text-sm font-bold">
                                    <CheckCircle2 size={16} className="text-orange-400" /> {b}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="flex-1">
                        <div className="rounded-3xl overflow-hidden border border-orange-500/20 bg-[#0F172A] shadow-2xl shadow-orange-500/10">
                            <img src="/assets/bots/bot4.jpeg" alt="ChatBot Atomic" className="w-full h-auto object-contain" />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* BENEFITS */}
            <section className="py-16 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {benefits.map((b, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                            className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 border border-slate-200 rounded-2xl p-6 text-center hover:border-orange-200 hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)] transition-all group">
                            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform border border-orange-100">
                                <b.icon size={22} className="text-orange-500" />
                            </div>
                            <h3 className="font-black text-[#0F172A] text-sm mb-1">{b.label}</h3>
                            <p className="text-xs text-slate-500">{b.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* BOT SELECTOR */}
            <section id="bots" className="py-24 bg-[#020617]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Nuestros Módulos de Automatización</h2>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto">Cada bot es una especialización. Elige el que tu negocio necesita o combínalos todos.</p>
                    </div>

                    {/* Tab buttons */}
                    <div className="flex flex-wrap justify-center gap-3 mb-12">
                        {bots.map((bot, i) => (
                            <button key={i} onClick={() => setActiveBot(i)}
                                className={`px-6 py-3 rounded-xl font-black text-sm transition-all border ${activeBot === i ? `bg-gradient-to-r ${bot.accent} text-white border-transparent shadow-[0_12px_40px_rgba(0,0,0,0.5)]` : 'bg-slate-900/50 backdrop-blur-xl border-slate-700/50/5 text-slate-400 border-white/10 hover:bg-slate-900/50 backdrop-blur-xl border-slate-700/50/10'}`}>
                                {bot.title}
                            </button>
                        ))}
                    </div>

                    {/* Active bot display */}
                    <motion.div key={activeBot} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                        className="flex flex-col lg:flex-row items-center gap-12">
                        <div className="flex-1">
                            <div className={`rounded-3xl overflow-hidden border ${current.border} shadow-2xl`}>
                                <img src={current.img} alt={current.title} className="w-full h-auto object-contain bg-[#0F172A]" />
                            </div>
                        </div>
                        <div className="flex-1 space-y-8">
                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-black uppercase tracking-wider ${current.badge}`}>
                                <Bot size={14} /> {current.title}
                            </div>
                            <div>
                                <h3 className="text-4xl font-black text-white mb-2">{current.title}</h3>
                                <p className="text-slate-400 font-bold text-lg">{current.subtitle}</p>
                            </div>
                            <p className="text-slate-400 text-base leading-relaxed">{current.desc}</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {current.features.map((feat, i) => (
                                    <div key={i} className="flex items-center gap-3 bg-slate-900/50 backdrop-blur-xl border-slate-700/50/5 border border-white/10 rounded-xl px-4 py-3 hover:bg-slate-900/50 backdrop-blur-xl border-slate-700/50/10 transition-colors">
                                        <CheckCircle2 size={16} className="text-orange-400 shrink-0" />
                                        <span className="text-sm font-bold text-white">{feat}</span>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
                                className={`inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r ${current.accent} text-white rounded-xl font-black text-base transition-all hover:scale-105 shadow-xl`}>
                                Activar {current.title} <ArrowRight size={18} />
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ALL BOTS GALLERY */}
            <section className="py-24 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-black text-[#0F172A] mb-4">Galería de Módulos</h2>
                    <p className="text-slate-500 text-lg max-w-xl mx-auto">Todos los bots trabajan en conjunto para cubrir cada área de tu negocio.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {["/assets/bots/bot1.jpeg","/assets/bots/bot2.jpeg","/assets/bots/bot3.jpeg","/assets/bots/bot4.jpeg","/assets/bots/bot5.jpeg"].map((img, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                            className="rounded-2xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.5)] border border-slate-200 bg-slate-900/50 backdrop-blur-xl border-slate-700/50 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer"
                            onClick={() => setActiveBot(Math.min(i, bots.length - 1))}>
                            <img src={img} alt={`Bot ${i+1}`} className="w-full h-auto object-contain bg-[#020617]" />
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* CONTACT */}
            <section id="contacto" className="py-24 bg-slate-50">
                <div className="max-w-3xl mx-auto px-6">
                    <div className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 rounded-3xl p-8 md:p-12 shadow-xl border border-slate-200">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-black text-[#0F172A] mb-3">🚀 Activa tu Bot Hoy</h2>
                            <p className="text-slate-500 font-medium">Cuéntanos qué procesos quieres automatizar y un especialista diseñará la solución exacta para tu negocio.</p>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nombre Completo</label>
                                    <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 px-4 py-3.5 rounded-xl text-sm font-bold text-[#0F172A] outline-none focus:border-orange-500 transition-all" placeholder="Juan Pérez" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Teléfono / WhatsApp</label>
                                    <input required type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full bg-slate-50 border border-slate-200 px-4 py-3.5 rounded-xl text-sm font-bold text-[#0F172A] outline-none focus:border-orange-500 transition-all" placeholder="+593 ..." />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Correo Electrónico</label>
                                    <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full bg-slate-50 border border-slate-200 px-4 py-3.5 rounded-xl text-sm font-bold text-[#0F172A] outline-none focus:border-orange-500 transition-all" placeholder="juan@empresa.com" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nombre del Negocio</label>
                                    <input required type="text" value={form.business} onChange={e => setForm({...form, business: e.target.value})} className="w-full bg-slate-50 border border-slate-200 px-4 py-3.5 rounded-xl text-sm font-bold text-[#0F172A] outline-none focus:border-orange-500 transition-all" placeholder="Mi Empresa S.A." />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">¿Qué proceso quieres automatizar?</label>
                                <textarea required rows={3} value={form.message} onChange={e => setForm({...form, message: e.target.value})} className="w-full bg-slate-50 border border-slate-200 px-4 py-3.5 rounded-xl text-sm font-bold text-[#0F172A] outline-none focus:border-orange-500 transition-all resize-none" placeholder="Ej: Quiero automatizar mi atención al cliente por WhatsApp..." />
                            </div>
                            <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl font-black text-lg transition-all hover:scale-[1.02] shadow-[0_12px_40px_rgba(0,0,0,0.5)] shadow-orange-500/20 flex items-center justify-center gap-2">
                                Quiero mi Bot Ahora <Send size={20} />
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="bg-[#020617] border-t border-white/10 py-12">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-orange-500" />
                            <span className="text-lg font-black text-white uppercase tracking-[0.2em]">ATOMIC SISTEMS</span>
                        </div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tecnología que impulsa tu negocio · Ecuador</p>
                    </div>
                    <button onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })} className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-400 text-[#020617] rounded-xl font-black text-sm transition-all">
                        Activar mi Bot <ArrowRight size={16} />
                    </button>
                </div>
            </footer>
        </div>
    )
}
