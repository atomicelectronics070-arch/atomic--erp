"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Shield, Search, Star, CheckCircle2, ArrowRight, Send, Store, ShoppingBag, Clock, Award, Gamepad2, Wrench, Tag, MessageCircle } from "lucide-react"

const WHATSAPP_URL = "https://wa.me/593969043453"

export default function ConsolasPage() {
    const [activeTab, setActiveTab] = useState<"compra" | "vende">("compra")
    const [showModal, setShowModal] = useState(false)
    const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        alert("Formulario enviado. Nos contactaremos pronto.")
        setForm({ name: "", phone: "", email: "", message: "" })
    }

    const process = [
        { step: "01", icon: Search, title: "Buscamos la Oportunidad", desc: "Rastreamos el mercado de segunda mano en busca de las mejores consolas a precio de oportunidad, seleccionando solo las que valen la pena." },
        { step: "02", icon: Wrench, title: "Revisión Técnica a Detalle", desc: "Cada consola pasa por un chequeo técnico exhaustivo en nuestra oficina: lector, ventiladores, conectores HDMI, puertos USB, mandos y software." },
        { step: "03", icon: Shield, title: "Certificamos y Garantizamos", desc: "Emitimos una garantía oficial de 1 año. Si algo falla dentro de ese período, lo resolvemos sin costo adicional para ti." },
        { step: "04", icon: Tag, title: "Puesta en Venta Inmediata", desc: "Una vez certificada, la publicamos al mejor precio del mercado. Tú la recibes como nueva pero pagas como segunda mano." },
    ]

    const buyFeatures = [
        { icon: Shield, title: "Garantía 1 Año Oficial", desc: "Documento de garantía emitido desde nuestra oficina." },
        { icon: Wrench, title: "Revisión Técnica Completa", desc: "Checklist de 20+ puntos antes de ponerse en venta." },
        { icon: Star, title: "Selección de Oportunidad", desc: "Solo compramos lo que realmente vale la pena." },
        { icon: Clock, title: "Reserva sin Stock", desc: "Si no hay stock, reservas y nosotros la buscamos por ti." },
        { icon: Award, title: "Open Box Certificado", desc: "Como nueva, a precio de segunda mano inteligente." },
        { icon: Gamepad2, title: "Con Controles y Juegos", desc: "Kits completos disponibles con accesorios incluidos." },
    ]

    const sellModes = [
        {
            icon: ShoppingBag,
            title: "Te la Compramos",
            desc: "Traemos tu consola a revisión técnica gratuita. Si está en buen estado, te hacemos una oferta justa de compra inmediata.",
            color: "bg-blue-50 border-blue-200 text-blue-700",
            badge: "Pago Inmediato",
            badgeColor: "bg-blue-600 text-white"
        },
        {
            icon: Store,
            title: "La Vendemos por Ti",
            desc: "¿No quieres ceder precio? Exhibe tu consola en nuestro local comercial. Nosotros la mostramos, la vendemos y tú recibes tu dinero.",
            color: "bg-purple-50 border-purple-200 text-purple-700",
            badge: "Sin Complicaciones",
            badgeColor: "bg-purple-600 text-white"
        },
    ]

    return (
        <div className="font-sans text-[#0F172A] bg-[#F8FAFC]">

            {/* HERO */}
            <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-[#020617]">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-1/3 w-96 h-96 bg-blue-600 rounded-full blur-[140px]" />
                    <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-cyan-400 rounded-full blur-[120px]" />
                </div>
                <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 flex flex-col lg:flex-row items-center gap-16">
                    {/* Text */}
                    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="flex-1 space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-bold uppercase tracking-wider">
                            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" /> Atomic Industries · Open Box Certificado
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-white leading-[1.1]">
                            Consolas<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Garantizadas</span>
                        </h1>
                        <p className="text-slate-400 text-xl font-medium max-w-xl">
                            PlayStation, Xbox y más — de segunda mano pero con revisión técnica a detalle y <strong className="text-white">garantía de 1 año</strong> emitida por nuestra oficina.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <button onClick={() => { setActiveTab("compra"); document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth' }) }}
                                className="inline-flex items-center gap-2 px-8 py-4 bg-blue-500 hover:bg-blue-400 text-white rounded-xl font-black text-lg transition-all hover:scale-105 shadow-xl shadow-blue-500/30">
                                Quiero Comprar <ArrowRight size={20} />
                            </button>
                            <button onClick={() => { setActiveTab("vende"); document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth' }) }}
                                className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-bold text-lg transition-all">
                                Quiero Vender mi Consola
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-6 pt-2">
                            {["Garantía 1 Año", "Revisión Técnica", "Open Box Certificado"].map((b, i) => (
                                <div key={i} className="flex items-center gap-2 text-slate-400 text-sm font-bold">
                                    <CheckCircle2 size={16} className="text-blue-400" /> {b}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                    {/* Gallery */}
                    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="flex-1 flex flex-col gap-4">
                        <div className="rounded-3xl overflow-hidden border border-blue-500/20 bg-[#0F172A] shadow-2xl shadow-blue-500/10">
                            <img src="/assets/consolas/consola1.jpeg" alt="PS4 Slim Open Box" className="w-full h-auto object-contain" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#0F172A]">
                                <img src="/assets/consolas/consola2.jpeg" alt="PS4 Slim" className="w-full h-auto object-contain" />
                            </div>
                            <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#0F172A]">
                                <img src="/assets/consolas/consola3.jpeg" alt="PS4 Bundle" className="w-full h-auto object-contain" />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* TAB SELECTOR */}
            <section id="como-funciona" className="py-20 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-black text-[#0F172A] mb-4">¿Qué deseas hacer?</h2>
                    <p className="text-slate-500 text-lg max-w-xl mx-auto">Tanto si quieres comprar como vender, tenemos el proceso perfecto para ti.</p>
                </div>
                <div className="flex justify-center gap-4 mb-16">
                    <button onClick={() => setActiveTab("compra")}
                        className={`px-8 py-4 rounded-xl font-black text-base transition-all border ${activeTab === "compra" ? "bg-blue-600 text-white border-transparent shadow-lg shadow-blue-600/20" : "bg-white text-slate-600 border-slate-200 hover:border-blue-200"}`}>
                        🎮 Quiero Comprar una Consola
                    </button>
                    <button onClick={() => setActiveTab("vende")}
                        className={`px-8 py-4 rounded-xl font-black text-base transition-all border ${activeTab === "vende" ? "bg-purple-600 text-white border-transparent shadow-lg shadow-purple-600/20" : "bg-white text-slate-600 border-slate-200 hover:border-purple-200"}`}>
                        💰 Quiero Vender mi Consola
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === "compra" ? (
                        <motion.div key="compra" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                            {/* How we buy process */}
                            <div className="mb-16">
                                <div className="text-center mb-12">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-xs font-black uppercase tracking-widest border border-blue-100 mb-4">
                                        <Shield size={14} /> ¿Cómo te Garantizamos la Consola?
                                    </div>
                                    <h3 className="text-3xl font-black text-[#0F172A]">Nuestro proceso antes de venderte</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {process.map((p, i) => (
                                        <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                                            className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-lg transition-all relative overflow-hidden group">
                                            <div className="absolute top-4 right-4 text-5xl font-black text-slate-100 group-hover:text-blue-50 transition-colors">{p.step}</div>
                                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 border border-blue-100">
                                                <p.icon size={22} className="text-blue-600" />
                                            </div>
                                            <h4 className="font-black text-[#0F172A] mb-2">{p.title}</h4>
                                            <p className="text-sm text-slate-500 font-medium leading-relaxed">{p.desc}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Buy features */}
                            <div className="bg-[#020617] rounded-3xl p-10 md:p-16">
                                <div className="flex flex-col lg:flex-row items-center gap-12">
                                    <div className="flex-1">
                                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-black uppercase tracking-widest mb-6">
                                            <Award size={14} /> Incluido en cada Compra
                                        </div>
                                        <h3 className="text-3xl font-black text-white mb-4">Tu consola llega certificada, tú solo juegas.</h3>
                                        <p className="text-slate-400 font-medium mb-8">
                                            Nos encargamos de todo el proceso tedioso. Si no tenemos la consola que buscas, <strong className="text-white">haz una reserva</strong> y nosotros la encontramos por ti en el mercado, la revisamos y te la entregamos certificada.
                                        </p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {buyFeatures.map((f, i) => (
                                                <div key={i} className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors">
                                                    <div className="w-9 h-9 bg-blue-500/20 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                                                        <f.icon size={18} className="text-blue-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-black text-sm">{f.title}</p>
                                                        <p className="text-slate-500 text-xs mt-0.5">{f.desc}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex-1 max-w-md">
                                        <div className="rounded-3xl overflow-hidden border border-blue-500/20 bg-[#0F172A] shadow-2xl">
                                            <img src="/assets/consolas/consola2.jpeg" alt="PS4 Garantizada" className="w-full h-auto object-contain" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div key="vende" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                            {/* Sell section */}
                            <div className="bg-gradient-to-br from-[#1a0533] to-[#020617] rounded-3xl p-10 md:p-16 border border-purple-500/20">
                                <div className="text-center mb-12">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-black uppercase tracking-widest mb-6">
                                        <Store size={14} /> ¿Cómo Compramos tu Consola?
                                    </div>
                                    <h3 className="text-3xl font-black text-white mb-4">Hola, si estás leyendo esta parte...</h3>
                                    <p className="text-slate-400 text-lg max-w-3xl mx-auto leading-relaxed">
                                        Es porque seguramente deseas <strong className="text-white">vendernos tu consola</strong>. Es importante que hagamos una revisión técnica para poder comprártela, con el fin de certificar que esté funcionando correctamente y que no tenga averías. Además contamos con un <strong className="text-purple-400">segundo modo</strong> donde podemos promover tu consola sin comprártela.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                                    {/* Card 1 - Compramos */}
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}
                                        className="bg-white/5 border border-blue-500/30 rounded-2xl p-8 hover:bg-white/10 transition-all flex flex-col">
                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black mb-6 bg-blue-600 text-white w-fit">
                                            Pago Inmediato
                                        </div>
                                        <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-5 border border-blue-500/20">
                                            <ShoppingBag size={28} className="text-blue-400" />
                                        </div>
                                        <h4 className="text-2xl font-black text-white mb-3">Te la Compramos</h4>
                                        <p className="text-slate-400 font-medium leading-relaxed flex-1">Traemos tu consola a revisión técnica gratuita. Si está en buen estado, te hacemos una oferta justa de compra inmediata.</p>
                                        <div className="flex flex-col gap-3 mt-6">
                                            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
                                                className="flex items-center justify-center gap-2 w-full py-3 bg-green-500 hover:bg-green-400 text-white rounded-xl font-black text-sm transition-all">
                                                <MessageCircle size={18} /> Vender por WhatsApp
                                            </a>
                                            <button onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
                                                className="w-full py-3 bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-xl font-bold text-sm transition-all">
                                                Llenar Formulario
                                            </button>
                                        </div>
                                    </motion.div>
                                    {/* Card 2 - Exhibimos */}
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                                        className="bg-white/5 border border-purple-500/30 rounded-2xl p-8 hover:bg-white/10 transition-all flex flex-col">
                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black mb-6 bg-purple-600 text-white w-fit">
                                            Sin Complicaciones
                                        </div>
                                        <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-5 border border-purple-500/20">
                                            <Store size={28} className="text-purple-400" />
                                        </div>
                                        <h4 className="text-2xl font-black text-white mb-3">La Vendemos por Ti</h4>
                                        <p className="text-slate-400 font-medium leading-relaxed flex-1">¿No quieres ceder precio? Exhibe tu consola en nuestro local comercial. Nosotros la mostramos, la vendemos y tú recibes tu dinero.</p>
                                        <div className="flex flex-col gap-3 mt-6">
                                            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
                                                className="flex items-center justify-center gap-2 w-full py-3 bg-green-500 hover:bg-green-400 text-white rounded-xl font-black text-sm transition-all">
                                                <MessageCircle size={18} /> Exhibir por WhatsApp
                                            </a>
                                            <button onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
                                                className="w-full py-3 bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-xl font-bold text-sm transition-all">
                                                Llenar Formulario
                                            </button>
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Process sell */}
                                <div className="bg-white/5 border border-purple-500/20 rounded-2xl p-8">
                                    <h4 className="text-xl font-black text-white mb-6 flex items-center gap-3">
                                        <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center"><Wrench size={18} className="text-purple-400" /></div>
                                        ¿Cómo es el proceso?
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {[
                                            { n: "1", t: "Ven con tu Consola", d: "Tráela a nuestra oficina o agenda una visita. La revisión técnica es completamente gratuita." },
                                            { n: "2", t: "Revisión Técnica", d: "Nuestro técnico hace el chequeo detallado. Te decimos exactamente el estado y el valor." },
                                            { n: "3", t: "Elige tu Opción", d: "Te la compramos al instante con pago inmediato, o la exhibimos en nuestro local y vendemos por ti." },
                                        ].map((s, i) => (
                                            <div key={i} className="flex items-start gap-4">
                                                <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center font-black text-white text-lg shrink-0">{s.n}</div>
                                                <div>
                                                    <p className="text-white font-black text-sm mb-1">{s.t}</p>
                                                    <p className="text-slate-500 text-xs leading-relaxed">{s.d}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>

            {/* CONTACT */}
            <section id="contacto" className="py-24 bg-slate-50">
                <div className="max-w-3xl mx-auto px-6">
                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-200">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-black text-[#0F172A] mb-3">
                                {activeTab === "compra" ? "🎮 Reservar o Consultar Consola" : "💰 Quiero Vender mi Consola"}
                            </h2>
                            <p className="text-slate-500 font-medium">
                                {activeTab === "compra"
                                    ? "Dinos qué consola buscas y te avisamos en cuanto tengamos stock, o la buscamos por ti."
                                    : "Agéndanos y trae tu consola a revisión técnica gratuita. Sin compromiso."}
                            </p>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nombre Completo</label>
                                    <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 px-4 py-3.5 rounded-xl text-sm font-bold text-[#0F172A] outline-none focus:border-blue-500 transition-all" placeholder="Juan Pérez" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Teléfono / WhatsApp</label>
                                    <input required type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full bg-slate-50 border border-slate-200 px-4 py-3.5 rounded-xl text-sm font-bold text-[#0F172A] outline-none focus:border-blue-500 transition-all" placeholder="+593 ..." />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Correo Electrónico</label>
                                <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full bg-slate-50 border border-slate-200 px-4 py-3.5 rounded-xl text-sm font-bold text-[#0F172A] outline-none focus:border-blue-500 transition-all" placeholder="juan@ejemplo.com" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                                    {activeTab === "compra" ? "¿Qué consola buscas?" : "¿Qué consola tienes y cuál es su estado?"}
                                </label>
                                <textarea required rows={3} value={form.message} onChange={e => setForm({...form, message: e.target.value})} className="w-full bg-slate-50 border border-slate-200 px-4 py-3.5 rounded-xl text-sm font-bold text-[#0F172A] outline-none focus:border-blue-500 transition-all resize-none"
                                    placeholder={activeTab === "compra" ? "Ej: Busco PS4 Slim con 2 controles y juegos instalados..." : "Ej: Tengo una PS4 Pro, funciona bien, tiene 1 control..."} />
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-black text-base transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2">
                                    Enviar Consulta <Send size={18} />
                                </button>
                                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
                                    className="flex-1 bg-green-500 hover:bg-green-400 text-white py-4 rounded-xl font-black text-base transition-all shadow-lg shadow-green-500/20 flex items-center justify-center gap-2">
                                    <MessageCircle size={18} /> WhatsApp Directo
                                </a>
                            </div>
                        </form>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="bg-[#020617] border-t border-white/10 py-12">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-blue-500" />
                            <span className="text-lg font-black text-white uppercase tracking-[0.2em]">ATOMIC INDUSTRIES</span>
                        </div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tu Aliado en Cada Partida · Ecuador</p>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={() => { setActiveTab("compra"); document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' }) }} className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black text-sm transition-all">
                            🎮 Quiero Comprar
                        </button>
                        <button onClick={() => { setActiveTab("vende"); document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' }) }} className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-black text-sm transition-all">
                            💰 Quiero Vender
                        </button>
                    </div>
                </div>
            </footer>
        </div>
    )
}
