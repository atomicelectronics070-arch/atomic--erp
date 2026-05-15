"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Fingerprint, Wifi, Smartphone, Shield, Camera, Users, Eye, Lock, ChevronRight, ArrowRight, CheckCircle2, X, Star, Zap, Phone, Mail, Send } from "lucide-react"

const PRODUCT_URL = "https://atomiccotizador.shop/web/product/cmog6mjtq000n12oy0182o9ki"

export default function ConjuntosSmartPage() {
    const [form, setForm] = useState({ name: "", phone: "", email: "", business: "", message: "" })
    const [activeImg, setActiveImg] = useState(0)
    const [showModal, setShowModal] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        alert("Formulario enviado. Nos contactaremos pronto.")
        setForm({ name: "", phone: "", email: "", business: "", message: "" })
    }

    const images = [
        "/assets/portero/portero1.jpeg",
        "/assets/portero/portero2.jpeg",
        "/assets/portero/portero3.jpeg",
        "/assets/portero/portero4.jpeg",
    ]

    const features = [
        { icon: Camera, title: "Cámara HD Binocular", desc: "WDR @ 1MP para visión clara de día y de noche, incluso en condiciones de luz extrema." },
        { icon: Fingerprint, title: "Huella + Facial + RFID", desc: "Triple autenticación biométrica. Reconocimiento facial, lector de huella óptico ZK y tarjeta RFID 125KHz/13.56MHz." },
        { icon: Wifi, title: "100% Inalámbrico", desc: "Conectividad Wi-Fi (2.4 GHz) integrada. Sin cables, instalación limpia y rápida en minutos." },
        { icon: Smartphone, title: "Control desde tu Celular", desc: "Gestión completa vía app ZKBio CVAccess o ZKBio Zlink. Abre la puerta, ve quién llega y recibe alertas en tiempo real." },
        { icon: Eye, title: "Videollamada HD", desc: "Comunicación bidireccional con audio de alta calidad y cancelación de ruido. Todo desde tu teléfono." },
        { icon: Users, title: "Múltiples Usuarios", desc: "Hasta 3,000 usuarios, 1,500 rostros, 3,000 huellas y 3,000 tarjetas. Ideal para hogares, oficinas y conjuntos." },
        { icon: Lock, title: "Apertura Remota", desc: "Abre la puerta desde cualquier lugar del mundo directamente desde tu smartphone." },
        { icon: Shield, title: "Registros en Tiempo Real", desc: "Historial completo de accesos. Consulta quién entró, a qué hora y cuántas veces." },
    ]

    const specs = [
        { label: "Capacidad de Rostros", value: "1,500 (1:N)" },
        { label: "Capacidad de Huellas", value: "3,000 (1:N)" },
        { label: "Capacidad de Tarjetas", value: "3,000" },
        { label: "Capacidad de Usuarios", value: "3,000" },
        { label: "Pantalla", value: "TFT 2.4\" a color" },
        { label: "Cámara", value: "WDR @ 1MP" },
        { label: "Comunicación", value: "Wi-Fi 2.4GHz / TCP-IP / USB" },
        { label: "Sistema Operativo", value: "Linux" },
        { label: "Temperatura", value: "-5°C ~ 45°C" },
        { label: "Humedad", value: "20% ~ 80% RH" },
        { label: "Alimentación", value: "DC 12V 1.5A" },
        { label: "Certificaciones", value: "ISO14001, ISO9001, CE, FCC, RoHS" },
    ]

    return (
        <div className="font-sans text-[#0F172A] bg-[#F8FAFC]">

            {/* HERO */}
            <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#020617]">
                {/* Animated BG */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500 rounded-full blur-[120px]" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600 rounded-full blur-[120px]" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 flex flex-col lg:flex-row items-center gap-16">
                    {/* Text */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="flex-1 space-y-8"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-bold uppercase tracking-wider">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Control Acceso Inteligente
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-white leading-[1.1]">
                            Portero Smart<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">SENSEFACE 2A</span>
                        </h1>
                        <p className="text-slate-400 text-xl font-medium max-w-xl">
                            Control de acceso multibiométrico con videoportero por app. Facial, Huella, RFID y videollamada HD — todo en un solo dispositivo.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <a
                                href={PRODUCT_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-[#020617] rounded-xl font-black text-lg transition-all hover:scale-105 active:scale-95 shadow-xl shadow-emerald-500/30"
                            >
                                Ver Producto y Precio <ArrowRight size={20} />
                            </a>
                            <button
                                onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
                                className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-bold text-lg transition-all"
                            >
                                Consultar Disponibilidad
                            </button>
                        </div>
                        {/* trust badges */}
                        <div className="flex flex-wrap gap-6 pt-4">
                            {["Instalación Incluida", "Garantía de Fábrica", "Soporte 24/7"].map((b, i) => (
                                <div key={i} className="flex items-center gap-2 text-slate-400 text-sm font-bold">
                                    <CheckCircle2 size={16} className="text-emerald-400" /> {b}
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Image gallery */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="flex-1 flex flex-col items-center gap-4"
                    >
                        <div className="w-full max-w-lg rounded-3xl overflow-hidden border border-white/10 bg-[#0F172A] shadow-2xl">
                            <img
                                src={images[activeImg]}
                                alt="Portero Smart SENSEFACE 2A"
                                className="w-full h-auto object-contain"
                            />
                        </div>
                        {/* Thumbnails */}
                        <div className="flex gap-3">
                            {images.map((img, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveImg(i)}
                                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${activeImg === i ? 'border-emerald-400 scale-105' : 'border-white/10 opacity-50 hover:opacity-80'}`}
                                >
                                    <img src={img} alt="" className="w-full h-full object-contain bg-[#0F172A]" />
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* FEATURES GRID */}
            <section className="py-24 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-xs font-black uppercase tracking-widest border border-emerald-100">
                        <Zap size={14} /> Todo en un Solo Dispositivo
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-[#0F172A]">Características que marcan la diferencia</h2>
                    <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                        Diseñado para hogares, oficinas y conjuntos residenciales que buscan seguridad inteligente sin complicaciones.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-50 transition-all group"
                        >
                            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-emerald-100">
                                <feat.icon size={22} className="text-emerald-600" />
                            </div>
                            <h3 className="font-black text-[#0F172A] text-sm mb-2">{feat.title}</h3>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed">{feat.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* FULL IMAGE SHOWCASE */}
            <section className="bg-[#020617] py-24 px-6">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
                    <div className="flex-1">
                        <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                            <img src="/assets/portero/portero1.jpeg" alt="Senseface 2A" className="w-full h-auto object-contain" />
                        </div>
                    </div>
                    <div className="flex-1 space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-black uppercase tracking-widest">
                            <Shield size={14} /> Seguridad Multicapa
                        </div>
                        <h2 className="text-4xl font-black text-white leading-tight">Para proteger lo que más importa</h2>
                        <p className="text-slate-400 text-lg font-medium">
                            Compatible con ZKBio CVAccess para control profesional y ZKBio Zlink para gestión en la nube. Disponible en Google Play y App Store.
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { label: "Reconocimiento Facial", sub: "Por luz visible" },
                                { label: "Huella Dactilar", sub: "Rápida y precisa" },
                                { label: "Tarjeta RFID", sub: "125KHz / 13.56MHz" },
                                { label: "Contraseña", sub: "Ingreso con código" },
                                { label: "Control de Acceso", sub: "Cerradura eléctrica" },
                                { label: "Registros en Tiempo Real", sub: "Historial de eventos" },
                            ].map((item, i) => (
                                <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors">
                                    <p className="text-white font-black text-sm">{item.label}</p>
                                    <p className="text-slate-500 text-xs mt-1">{item.sub}</p>
                                </div>
                            ))}
                        </div>
                        <a
                            href={PRODUCT_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-[#020617] rounded-xl font-black text-base transition-all hover:scale-105 shadow-xl shadow-emerald-500/20"
                        >
                            Ver Producto y Cotizar <ArrowRight size={18} />
                        </a>
                    </div>
                </div>
            </section>

            {/* SPECS TABLE */}
            <section className="py-24 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-4xl font-black text-[#0F172A]">Especificaciones Técnicas</h2>
                    <p className="text-slate-500 text-lg max-w-xl mx-auto">Todo lo que necesitas saber para tomar la mejor decisión de seguridad.</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        {specs.map((spec, i) => (
                            <div key={i} className={`flex items-center justify-between p-5 border-b border-slate-100 ${i % 2 === 0 ? 'md:border-r' : ''} last:border-b-0`}>
                                <span className="text-sm font-bold text-slate-500 uppercase tracking-wide">{spec.label}</span>
                                <span className="text-sm font-black text-[#0F172A] text-right max-w-[55%]">{spec.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CONTACT */}
            <section id="contacto" className="py-24 bg-slate-50 relative">
                <div className="max-w-3xl mx-auto px-6">
                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-200">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-black text-[#0F172A] mb-3">¿Quieres una demostración?</h2>
                            <p className="text-slate-500 font-medium">Cuéntanos dónde estás y qué necesitas proteger. Un asesor especializado te contactará hoy mismo.</p>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nombre Completo</label>
                                    <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 px-4 py-3.5 rounded-xl text-sm font-bold text-[#0F172A] outline-none focus:border-emerald-500 transition-all" placeholder="Juan Pérez" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Teléfono / WhatsApp</label>
                                    <input required type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full bg-slate-50 border border-slate-200 px-4 py-3.5 rounded-xl text-sm font-bold text-[#0F172A] outline-none focus:border-emerald-500 transition-all" placeholder="+593 ..." />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Correo Electrónico</label>
                                    <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full bg-slate-50 border border-slate-200 px-4 py-3.5 rounded-xl text-sm font-bold text-[#0F172A] outline-none focus:border-emerald-500 transition-all" placeholder="juan@empresa.com" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">¿Dónde lo necesitas?</label>
                                    <input required type="text" value={form.business} onChange={e => setForm({...form, business: e.target.value})} className="w-full bg-slate-50 border border-slate-200 px-4 py-3.5 rounded-xl text-sm font-bold text-[#0F172A] outline-none focus:border-emerald-500 transition-all" placeholder="Casa, oficina, conjunto..." />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">¿Qué necesitas proteger?</label>
                                <textarea required rows={3} value={form.message} onChange={e => setForm({...form, message: e.target.value})} className="w-full bg-slate-50 border border-slate-200 px-4 py-3.5 rounded-xl text-sm font-bold text-[#0F172A] outline-none focus:border-emerald-500 transition-all resize-none" placeholder="Cuéntanos brevemente..." />
                            </div>
                            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-black text-lg transition-all hover:scale-[1.02] shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2">
                                Solicitar Asesoría Gratuita <Send size={20} />
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
                            <div className="w-2 h-2 bg-emerald-500" />
                            <span className="text-lg font-black text-white uppercase tracking-[0.2em]">ATOMIC</span>
                        </div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Smart Security Solutions · Ecuador</p>
                    </div>
                    <a
                        href={PRODUCT_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-[#020617] rounded-xl font-black text-sm transition-all"
                    >
                        Ver Producto en Tienda <ArrowRight size={16} />
                    </a>
                </div>
            </footer>
        </div>
    )
}
