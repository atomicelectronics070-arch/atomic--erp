"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingCart, LayoutDashboard, Zap, Code2, CheckCircle2, ChevronRight, MessageSquare, Briefcase, Mail, Send, ArrowRight, PlayCircle, Star, Phone, Volume2, VolumeX, X } from "lucide-react"

export default function TiendasOnlineLanding() {
    const [form, setForm] = useState({ name: "", phone: "", email: "", business: "", message: "" })
    const [isMuted, setIsMuted] = useState(true)
    const [selectedPlan, setSelectedPlan] = useState<any>(null)
    const videoRef = useRef<HTMLVideoElement>(null)
    
    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted
            setIsMuted(!isMuted)
        }
    }
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        alert("Formulario enviado. Nos contactaremos pronto.")
        setForm({ name: "", phone: "", email: "", business: "", message: "" })
    }

    const plans = [
        {
            name: "Desarrollo Básico",
            price: "$199",
            period: "pago único",
            description: "Ideal para pequeños emprendimientos que recién comienzan en internet.",
            features: [
                "Tienda con hasta 50 productos", 
                "Integración de botón WhatsApp", 
                "Diseño Responsivo Básico (Móvil y PC)", 
                "Gestor de Contenido Simple", 
                "Soporte por email 30 días",
                "Certificado de Seguridad SSL",
                "Dominio Gratis por 1 año"
            ],
            color: "blue"
        },
        {
            name: "Estándar",
            price: "$299",
            period: "pago único",
            description: "Para negocios establecidos que necesitan una presencia sólida y profesional.",
            features: [
                "Hasta 500 productos y variaciones", 
                "Pasarela de pagos (Stripe/PayPal/Tarjetas)", 
                "Gestor Avanzado (Beast Mode)", 
                "Optimización SEO Básica", 
                "Soporte por 3 meses vía WhatsApp",
                "Panel de analíticas de ventas",
                "Integración con redes sociales (Pixel)"
            ],
            color: "indigo",
            popular: true
        },
        {
            name: "Pro",
            price: "$599",
            period: "pago único",
            description: "E-commerce de alto rendimiento con todas las automatizaciones empresariales.",
            features: [
                "Productos ilimitados", 
                "Sistema ERP Integrado para inventario", 
                "CRM interno para clientes", 
                "Cuentas para Vendedores/Sucursales", 
                "Soporte Prioritario 1 Año",
                "Recuperación de carritos abandonados",
                "Sistema de Cupones Avanzado"
            ],
            color: "purple"
        },
        {
            name: "Personalizado",
            price: "A Medida",
            period: "cotización",
            description: "Desarrollamos soluciones 100% únicas para fábricas o empresas complejas.",
            features: [
                "Arquitectura a medida (React/Node)", 
                "Integraciones con APIs externas (SAP, etc)", 
                "Aplicación móvil nativa opcional", 
                "Diseño UI/UX Exclusivo desde cero", 
                "Soporte Dedicado 24/7",
                "Servidores dedicados AWS/Google Cloud",
                "Contrato de confidencialidad"
            ],
            color: "slate"
        }
    ]

    const managers = [
        { title: "Gestor Retail", icon: ShoppingCart, desc: "Para venta de ropa, electrónica o productos físicos. Control de inventario, tallas, colores y envíos automatizados." },
        { title: "Gestor de Servicios", icon: Briefcase, desc: "Ideal para agencias, consultores o clínicas. Sistema de reservas, agendas de citas y pagos anticipados." },
        { title: "Gestor Restaurantes", icon: Zap, desc: "Menús digitales interactivos, toma de pedidos en tiempo real, gestión de mesas y despachos por delivery." }
    ]

    return (
        <div className="font-sans text-[#0F172A] bg-[#F8FAFC]">
            
            {/* 0. HERO SECTION WITH VIDEO */}
            <section className="relative w-full h-[75vh] md:h-[85vh] flex items-center justify-center overflow-hidden bg-black">
                <video 
                    ref={videoRef}
                    autoPlay 
                    loop 
                    muted={isMuted} 
                    playsInline 
                    className="absolute inset-0 w-full h-full object-contain md:object-cover opacity-60"
                >
                    <source src="/assets/ecommerce/hero-video.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
                
                <button 
                    onClick={toggleMute}
                    className="absolute bottom-8 right-8 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white p-4 rounded-full transition-all shadow-xl"
                    title={isMuted ? "Activar sonido" : "Silenciar"}
                >
                    {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                </button>
                
                <div className="relative z-10 max-w-5xl mx-auto px-6 text-center space-y-8">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-bold uppercase tracking-wider mb-6">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Soluciones Enterprise 2026
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-[1.1]">
                            Potencia tu negocio con un <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Ecosistema Digital Total</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mt-6 font-medium">
                            No solo te damos una tienda en línea. Te entregamos un gestor inteligente y automatizado para escalar tus ventas sin límites.
                        </p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button onClick={() => document.getElementById('planes')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-lg transition-all hover:scale-105 active:scale-95 shadow-xl shadow-indigo-600/30 flex items-center gap-2 w-full sm:w-auto justify-center">
                            Ver Planes Disponibles <ArrowRight size={20} />
                        </button>
                        <button onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 rounded-xl font-bold text-lg transition-all w-full sm:w-auto justify-center">
                            Hablar con un Asesor
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* 1 & 5. THE OFFER & PRICING PLANS */}
            <section id="planes" className="py-24 px-6 max-w-7xl mx-auto relative">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-4xl md:text-5xl font-black text-[#0F172A] tracking-tight">Elige tu Ecosistema Digital</h2>
                    <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
                        Plataformas construidas a medida de tu negocio, incluyendo tienda en línea y sistema gestor administrativo. Elige el plan que se adapte a tu nivel de crecimiento.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
                    {plans.map((plan, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className={`relative bg-white rounded-3xl p-8 border ${plan.popular ? 'border-indigo-500 shadow-2xl shadow-indigo-500/10' : 'border-slate-200 shadow-sm'} flex flex-col h-full`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest shadow-md">
                                    Más Elegido
                                </div>
                            )}
                            
                            <div className="mb-6">
                                <h3 className="text-xl font-black text-[#0F172A]">{plan.name}</h3>
                                <div className="mt-4 flex items-baseline gap-2">
                                    <span className="text-4xl font-black text-indigo-600">{plan.price}</span>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">/ {plan.period}</span>
                                </div>
                                <p className="text-sm text-slate-500 mt-4 font-medium h-12">{plan.description}</p>
                            </div>

                            <ul className="space-y-4 flex-1 mb-8">
                                {plan.features.slice(0, 4).map((feat: string, idx: number) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                                        <span className="text-sm font-bold text-slate-700">{feat}</span>
                                    </li>
                                ))}
                                <li className="text-xs font-bold text-indigo-500 mt-2">+ Ver todos los beneficios</li>
                            </ul>

                            <button onClick={() => setSelectedPlan(plan)} className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all ${plan.popular ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md' : 'bg-slate-50 hover:bg-slate-100 text-[#0F172A] border border-slate-200'}`}>
                                Ver Detalles del Plan
                            </button>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* 2. TYPES OF MANAGERS */}
            <section className="py-24 bg-white border-y border-slate-200">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="flex-1 space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 text-blue-600 text-xs font-black uppercase tracking-widest mb-2">
                                Versatilidad <Zap size={14} />
                            </div>
                            <h2 className="text-4xl font-black text-[#0F172A] leading-tight">Un gestor perfecto para cada industria</h2>
                            <p className="text-slate-500 text-lg font-medium">
                                Entendemos que vender zapatos no es lo mismo que agendar citas médicas o vender comida. Adaptamos la interfaz del administrador (gestor) para que se alinee con tu operatividad diaria.
                            </p>

                            <div className="grid gap-6 mt-10">
                                {managers.map((m, i) => (
                                    <div key={i} className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-colors group">
                                        <div className="w-12 h-12 shrink-0 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform shadow-sm">
                                            <m.icon size={24} />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-black text-[#0F172A]">{m.title}</h4>
                                            <p className="text-sm text-slate-500 mt-1 font-medium">{m.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1 relative">
                            <div className="aspect-[4/5] w-full max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl relative border-8 border-slate-50 bg-slate-900">
                                <img src="/assets/ecommerce/img1.jpeg" alt="Ejemplo de Gestor" className="w-full h-full object-contain" />
                                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/80 to-transparent flex items-end p-8">
                                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl w-full text-white">
                                        <p className="font-black text-sm uppercase tracking-wider mb-1">Control Total</p>
                                        <p className="text-xs font-medium text-slate-200">Supervisa tus ventas, inventario y clientes desde tu celular o computadora.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. WORK METHODS - 100% CUSTOM */}
            <section className="py-24 bg-[#0F172A] text-white overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500 via-transparent to-transparent pointer-events-none" />
                
                <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row-reverse items-center gap-16 relative z-10">
                    <div className="flex-1 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-black uppercase tracking-widest mb-2">
                            Nuestra Metodología <Code2 size={14} />
                        </div>
                        <h2 className="text-4xl font-black text-white leading-tight">Desarrollo 100% a medida de tu marca</h2>
                        <p className="text-slate-400 text-lg font-medium">
                            No usamos plantillas genéricas. Construimos tu plataforma desde cero analizando la identidad visual de tu marca, el recorrido de tu cliente (Customer Journey) y tus necesidades operativas.
                        </p>
                        
                        <ul className="space-y-6 mt-8">
                            {[
                                { title: "1. Descubrimiento", desc: "Analizamos tu modelo de negocio y requerimientos." },
                                { title: "2. Diseño UX/UI", desc: "Creamos prototipos interactivos antes de programar." },
                                { title: "3. Desarrollo Core", desc: "Programación robusta con tecnologías modernas." },
                                { title: "4. Despliegue", desc: "Lanzamiento y capacitación de tu equipo." },
                            ].map((step, i) => (
                                <li key={i} className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                                    <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center font-black text-lg">{i+1}</div>
                                    <div>
                                        <h4 className="font-black text-white">{step.title}</h4>
                                        <p className="text-sm text-slate-400">{step.desc}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex-1 w-full max-w-md relative">
                        <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl relative border-8 border-slate-800 bg-slate-900">
                            <img src="/assets/ecommerce/img2.jpeg" alt="Desarrollo a medida" className="w-full h-full object-contain" />
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. CONTACT FORM */}
            <section id="contacto" className="py-24 bg-slate-50 relative">
                <div className="max-w-3xl mx-auto px-6">
                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-200">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-black text-[#0F172A] mb-3">¿Listo para evolucionar tu negocio?</h2>
                            <p className="text-slate-500 font-medium">Déjanos tus datos y un especialista arquitecto de software se pondrá en contacto contigo hoy mismo.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nombre Completo</label>
                                    <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 px-4 py-3.5 rounded-xl text-sm font-bold text-[#0F172A] outline-none focus:border-indigo-500 transition-all" placeholder="Juan Pérez" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Teléfono / WhatsApp</label>
                                    <input required type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full bg-slate-50 border border-slate-200 px-4 py-3.5 rounded-xl text-sm font-bold text-[#0F172A] outline-none focus:border-indigo-500 transition-all" placeholder="+52 ..." />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Correo Electrónico</label>
                                    <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full bg-slate-50 border border-slate-200 px-4 py-3.5 rounded-xl text-sm font-bold text-[#0F172A] outline-none focus:border-indigo-500 transition-all" placeholder="juan@empresa.com" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nombre de tu Negocio</label>
                                    <input required type="text" value={form.business} onChange={e => setForm({...form, business: e.target.value})} className="w-full bg-slate-50 border border-slate-200 px-4 py-3.5 rounded-xl text-sm font-bold text-[#0F172A] outline-none focus:border-indigo-500 transition-all" placeholder="Mi Empresa S.A." />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">¿Qué necesitas?</label>
                                <textarea required rows={4} value={form.message} onChange={e => setForm({...form, message: e.target.value})} className="w-full bg-slate-50 border border-slate-200 px-4 py-3.5 rounded-xl text-sm font-bold text-[#0F172A] outline-none focus:border-indigo-500 transition-all resize-none" placeholder="Cuéntanos brevemente sobre tu negocio y lo que buscas lograr..." />
                            </div>

                            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-black text-lg transition-all hover:scale-[1.02] shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2">
                                Solicitar Asesoría Gratuita <Send size={20} />
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* 5. FOOTER */}
            <footer className="bg-white border-t border-slate-200 py-12">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-indigo-600"></div>
                            <span className="text-lg font-black text-[#0F172A] uppercase tracking-[0.2em]">ATOMIC</span>
                        </div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Digital Commerce Solutions</p>
                    </div>
                    
                    <div className="flex gap-6">
                        <a href="#" className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold text-sm transition-colors"><Mail size={18} /> hola@atomic-industries.com</a>
                        <a href="#" className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold text-sm transition-colors"><Phone size={18} /> +1 (555) 123-4567</a>
                    </div>
                </div>
            </footer>

            {/* PLAN DETAILS MODAL */}
            <AnimatePresence>
                {selectedPlan && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedPlan(null)} />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl relative z-10 overflow-hidden"
                        >
                            <button onClick={() => setSelectedPlan(null)} className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors z-20">
                                <X size={20} />
                            </button>
                            
                            <div className={`h-3 w-full ${selectedPlan.popular ? 'bg-indigo-600' : 'bg-slate-300'}`} />
                            
                            <div className="p-8 md:p-10 max-h-[85vh] overflow-y-auto">
                                <h3 className="text-3xl font-black text-[#0F172A] mb-2">{selectedPlan.name}</h3>
                                <p className="text-slate-500 font-medium mb-6">{selectedPlan.description}</p>
                                
                                <div className="flex items-baseline gap-2 mb-8">
                                    <span className="text-5xl font-black text-indigo-600">{selectedPlan.price}</span>
                                    <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">/ {selectedPlan.period}</span>
                                </div>

                                <div className="space-y-4 mb-10 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                    <h4 className="font-bold text-[#0F172A] uppercase tracking-wider text-xs mb-4">¿Qué incluye este ecosistema?</h4>
                                    {selectedPlan.features.map((feat: string, idx: number) => (
                                        <div key={idx} className="flex items-start gap-3">
                                            <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />
                                            <span className="text-sm font-bold text-slate-700">{feat}</span>
                                        </div>
                                    ))}
                                </div>

                                <button onClick={() => { setSelectedPlan(null); document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' }) }} className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-lg transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2">
                                    Iniciar Proyecto Ahora <ArrowRight size={20} />
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
