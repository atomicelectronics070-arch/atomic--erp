"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Star, Send, MapPin, Phone, Mail, MessageSquare, ChevronLeft, ChevronRight, User } from "lucide-react"

export default function ContactPage() {
    const [formState, setFormState] = useState({ name: "", email: "", message: "" })

    const reviews = [
        { name: "SANTIAGO G.", role: "CEO Tech Corp", content: "La integración de Atomic en mi residencia superó todas las expectativas. El control de iluminación circadiana ha mejorado mi productividad y descanso notablemente.", rating: 5 },
        { name: "MARÍA J.", role: "Arquitecta", content: "Como profesional del diseño, busco estética y funcionalidad. Atomic ofrece un ecosistema que se funde con la arquitectura de forma invisible pero potente.", rating: 5 },
        { name: "CARLOS R.", role: "Entusiasta Smart Home", content: "He probado muchos sistemas, pero la estabilidad y la interfaz de Atomic son de otro nivel. El soporte técnico es impecable.", rating: 5 }
    ]

    const [currentReview, setCurrentReview] = useState(0)

    const nextReview = () => setCurrentReview((prev) => (prev + 1) % reviews.length)
    const prevReview = () => setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length)

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-blue-600/10">
            {/* Contact Hero */}
            <section className="relative py-48 border-b border-slate-200 overflow-hidden bg-white">
                <div className="absolute top-0 right-0 w-[60%] h-[100%] bg-blue-500/[0.02] blur-[140px] rounded-full animate-pulse" />
                <div className="max-w-7xl mx-auto px-8 relative z-10">
                    <div className="inline-flex items-center gap-4 mb-10 text-blue-600/50 text-[9px] font-bold uppercase tracking-[0.6em]">
                        <div className="w-16 h-px bg-current opacity-30"></div>
                        Enlace de Sistemas
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] italic mb-12 text-[#1E3A8A]">
                        CONTACTO <br/> <span className="text-blue-600 font-black">Y RESEÑAS.</span>
                    </h1>
                </div>
            </section>

            {/* Main Content: Form + Info */}
            <section className="max-w-7xl mx-auto px-8 py-32">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-32">
                    {/* Contact Form */}
                    <div className="space-y-16">
                        <div className="space-y-4">
                            <h2 className="text-3xl font-black uppercase tracking-tighter italic text-slate-800">SOLICITAR <span className="text-blue-600">CONSULTORÍA</span></h2>
                            <p className="text-slate-400 text-[9px] uppercase tracking-[0.4em] font-bold italic">Un ingeniero de Atomic se pondrá en contacto en menos de 24h.</p>
                        </div>

                        <form className="space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-3">
                                    <label className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Nombre Completo</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-white border border-slate-200 rounded-none p-4 focus:border-blue-600 transition-all outline-none font-bold text-[11px] uppercase tracking-widest placeholder:text-slate-200 shadow-sm"
                                        placeholder="SANTIAGO G."
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Email Corporativo</label>
                                    <input 
                                        type="email" 
                                        className="w-full bg-white border border-slate-200 rounded-none p-4 focus:border-blue-600 transition-all outline-none font-bold text-[11px] uppercase tracking-widest placeholder:text-slate-200 shadow-sm"
                                        placeholder="EMAIL@EMPRESA.COM"
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Requerimiento</label>
                                <textarea 
                                    rows={4}
                                    className="w-full bg-white border border-slate-200 rounded-none p-4 focus:border-blue-600 transition-all outline-none font-bold text-[11px] uppercase tracking-widest resize-none placeholder:text-slate-200 shadow-sm"
                                    placeholder="DESCRIBA SU PROYECTO..."
                                />
                            </div>
                            <button className="px-10 py-5 bg-[#1E3A8A] text-white font-black uppercase tracking-[0.4em] text-[10px] italic hover:bg-blue-700 transition-all flex items-center gap-4 shadow-xl">
                                ENVIAR <Send size={14} />
                            </button>
                        </form>
                    </div>

                    {/* Contact Info & Reviews */}
                    <div className="space-y-24">
                        {/* Info Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="p-8 bg-white border border-slate-200 space-y-6 shadow-sm">
                                <MapPin size={24} className="text-blue-600" />
                                <h4 className="text-xs font-black uppercase tracking-widest italic text-[#1E3A8A]">HQ Global</h4>
                                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold leading-relaxed">Piso 42, Edificio Atomic <br/> Sector Corporativo</p>
                            </div>
                            <div className="p-8 bg-white border border-slate-200 space-y-6 shadow-sm">
                                <Phone size={24} className="text-blue-600" />
                                <h4 className="text-xs font-black uppercase tracking-widest italic text-[#1E3A8A]">Línea Directa</h4>
                                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold leading-relaxed">+593 99 888 7777 <br/> Soporte 24/7</p>
                            </div>
                        </div>

                        {/* Reviews Carousel */}
                        <div className="bg-[#1E3A8A] p-16 relative overflow-hidden shadow-2xl">
                            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                            <div className="relative z-10 space-y-10 text-white">
                                <div className="flex gap-1 text-blue-400">
                                    {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                                </div>
                                <motion.p 
                                    key={currentReview}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-xl font-black uppercase tracking-tighter italic leading-relaxed"
                                >
                                    "{reviews[currentReview].content}"
                                </motion.p>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white/10 flex items-center justify-center">
                                            <User size={24} className="text-white" />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-black uppercase tracking-widest">{reviews[currentReview].name}</p>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-white/50">{reviews[currentReview].role}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <button onClick={prevReview} className="w-10 h-10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all"><ChevronLeft size={18} /></button>
                                        <button onClick={nextReview} className="w-10 h-10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all"><ChevronRight size={18} /></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Floating Client Landing Section */}
            <section className="bg-white py-40 border-t border-slate-200">
                <div className="max-w-7xl mx-auto px-8 text-center space-y-16">
                    <div className="inline-flex items-center gap-4 text-slate-400 text-[10px] font-black uppercase tracking-[0.5em]">
                        <div className="w-12 h-px bg-current"></div>
                        Área de Clientes
                    </div>
                    <h2 className="text-6xl md:text-8xl font-black text-[#1E3A8A] uppercase tracking-tighter italic leading-none">
                        TU PROYECTO, <br/> NUESTRA <span className="text-blue-600">MISIÓN.</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
                        {[
                            { title: "Planificación", desc: "Diseñamos el esquema neuronal de su hogar a medida." },
                            { title: "Despliegue", desc: "Instalación de hardware grado militar y configuración." },
                            { title: "Optimización", desc: "Ajuste fino de algoritmos para su estilo de vida." }
                        ].map((item, i) => (
                            <div key={i} className="p-10 border border-slate-100 space-y-6 hover:shadow-2xl transition-all bg-slate-50/30">
                                <h4 className="text-xl font-black uppercase tracking-tighter italic text-[#1E3A8A]">{item.title}</h4>
                                <p className="text-xs text-slate-400 uppercase tracking-widest font-bold leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
