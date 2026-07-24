"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Download, CheckCircle2, BookOpen, 
    Users, Award, Sparkles, Instagram, Facebook, Youtube, Phone, Headset, BookKey, Search, FileText
} from "lucide-react"

interface SocialLinks {
    instagram: string
    facebook: string
    youtube: string
}

export default function GuiaProveedoresPage() {
    const [email, setEmail] = useState("")
    const [name, setName] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")
    const [pdfLoading, setPdfLoading] = useState(false)
    const [socialLinks, setSocialLinks] = useState<SocialLinks>({ instagram: "", facebook: "", youtube: "" })

    useEffect(() => {
        fetch("/api/web/landing-social")
            .then(r => r.json())
            .then(data => setSocialLinks(data))
            .catch(() => {})
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email || !email.includes("@")) {
            setErrorMsg("Por favor, ingresa un correo electrónico válido.")
            return
        }
        setErrorMsg("")
        setSubmitting(true)
        try {
            const res = await fetch("/api/web/landing-lead", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, name })
            })
            if (res.ok) {
                setSubmitted(true)
                generatePDFGuide()
            } else {
                const data = await res.json()
                setErrorMsg(data.error || "Hubo un error al registrar tu correo.")
            }
        } catch {
            setErrorMsg("No se pudo conectar con el servidor.")
        } finally {
            setSubmitting(false)
        }
    }

    const generatePDFGuide = async () => {
        setPdfLoading(true)
        try {
            const { jsPDF } = await import("jspdf")
            const doc = new jsPDF()

            // COLORS: Navy Blue (Primary), Cyan (Accent), Light Gray (Background)
            const PRIMARY = [15, 23, 42] as [number, number, number]
            const ACCENT = [14, 165, 233] as [number, number, number]
            
            // ── PORTADA ──
            doc.setFillColor(248, 250, 252) // slate-50
            doc.rect(0, 0, 210, 297, "F")
            
            doc.setDrawColor(...ACCENT)
            doc.setLineWidth(1)
            doc.rect(15, 15, 180, 267, "S")
            
            doc.setTextColor(...PRIMARY)
            doc.setFont("helvetica", "bold")
            doc.setFontSize(32)
            doc.text("EL SCRIPT", 105, 80, { align: "center" })
            doc.text("DEFINITIVO", 105, 95, { align: "center" })
            
            doc.setFontSize(16)
            doc.setTextColor(...ACCENT)
            doc.text("Guía Paso a Paso para Captación de Proveedores", 105, 115, { align: "center" })
            
            doc.setDrawColor(200, 200, 200)
            doc.setLineWidth(0.5)
            doc.line(70, 130, 140, 130)
            
            doc.setTextColor(100, 116, 139)
            doc.setFont("helvetica", "normal")
            doc.setFontSize(11)
            doc.text("Aprende a negociar, superar objeciones y conseguir", 105, 150, { align: "center" })
            doc.text("los mejores tratos en logística y distribución.", 105, 157, { align: "center" })

            doc.setTextColor(15, 23, 42)
            doc.setFont("helvetica", "bold")
            doc.setFontSize(10)
            doc.text("ATOMIC SOLUTIONS · COMERCIO B2B · EDICIÓN 2026", 105, 250, { align: "center" })

            // ── PASO 1 Y 2 ──
            doc.addPage()
            doc.setFillColor(255, 255, 255)
            doc.rect(0, 0, 210, 297, "F")
            
            doc.setTextColor(...PRIMARY)
            doc.setFont("helvetica", "bold")
            doc.setFontSize(20)
            doc.text("Paso 1: El Contacto Inicial", 20, 30)
            
            doc.setFont("helvetica", "normal")
            doc.setFontSize(11)
            doc.setTextColor(51, 65, 85)
            const paso1 = [
                "Objetivo: Llegar al tomador de decisiones (Dueño, Gerente Comercial, Jefe de Ventas) evitando ser filtrado por la secretaria o atención al cliente.",
                "",
                "Guion Genérico (Llamada):",
                "TÚ: 'Hola, muy buenos días. Habla [Tu Nombre] de [Tu Empresa/Tienda]. ¿Se encuentra el encargado de distribución a nivel mayorista?'",
                "SECRETARIA: '¿De parte de quién? / ¿Para qué asunto?'",
                "TÚ: 'Dígale que le llamo de la gerencia de distribución comercial para habilitar una línea nueva de comercialización de sus productos en canales digitales. Es una consulta rápida sobre estructuración de inventarios.'",
                "",
                "Nota: Sonar corporativo, seguro y con prisa."
            ]
            let y = 45
            paso1.forEach(p => {
                const lines = doc.splitTextToSize(p, 170)
                doc.text(lines, 20, y)
                y += lines.length * 6 + 2
            })

            doc.setTextColor(...PRIMARY)
            doc.setFont("helvetica", "bold")
            doc.setFontSize(20)
            y += 15
            doc.text("Paso 2: La Propuesta de Valor", 20, y)
            
            doc.setFont("helvetica", "normal")
            doc.setFontSize(11)
            doc.setTextColor(51, 65, 85)
            const paso2 = [
                "Objetivo: Posicionarte como un canal de ventas masivo y no como un comprador novato pidiendo descuentos.",
                "",
                "Guion de Propuesta:",
                "TÚ: 'Qué tal [Nombre del Gerente], un gusto. Actualmente estamos expandiendo nuestra matriz de ventas digitales y hemos estado evaluando su catálogo de [Categoría de Productos]. Tenemos el presupuesto y la infraestructura de marketing para empezar a desplazar su inventario semanalmente.'",
                "TÚ: 'Me gustaría saber cómo manejan ustedes su esquema para distribuidores preferenciales. ¿Manejan un listado de precios B2B o trabajan con un esquema de comisiones por volumen?'"
            ]
            y += 15
            paso2.forEach(p => {
                const lines = doc.splitTextToSize(p, 170)
                doc.text(lines, 20, y)
                y += lines.length * 6 + 2
            })

            // ── PASO 3 Y 4 ──
            doc.addPage()
            doc.setFillColor(255, 255, 255)
            doc.rect(0, 0, 210, 297, "F")

            doc.setTextColor(...PRIMARY)
            doc.setFont("helvetica", "bold")
            doc.setFontSize(20)
            doc.text("Paso 3: Manejo de Objeciones", 20, 30)

            doc.setFont("helvetica", "normal")
            doc.setFontSize(11)
            doc.setTextColor(51, 65, 85)
            const paso3 = [
                "Objeción 1: 'No trabajamos con revendedores pequeños, pedimos compra mínima de 100 unidades.'",
                "RESPUESTA: 'Entiendo perfectamente la política. Lo que nosotros hacemos es una inyección de capital en marketing sobre productos probados. Antes de mover las 100 unidades, estructuramos una campaña piloto. ¿Sería posible coordinar los envíos desde su bodega si nosotros nos encargamos de las guías de transporte durante los primeros 14 días? Si llegamos al volumen, compramos el lote completo.'",
                "",
                "Objeción 2: 'No hacemos dropshipping, deben comprar la mercancía primero.'",
                "RESPUESTA: 'Correcto, no busco que ustedes financien la venta. Todos los pedidos salen pre-pagados por nosotros. Solo requiero que al momento de hacerles la transferencia del costo base, su personal empaquete el producto y le coloque la guía de la transportadora que yo mismo les enviaré. ¿Tienen capacidad operativa para empacar 5-10 paquetes diarios?'"
            ]
            y = 45
            paso3.forEach(p => {
                const lines = doc.splitTextToSize(p, 170)
                doc.text(lines, 20, y)
                y += lines.length * 6 + 2
            })

            doc.setTextColor(...PRIMARY)
            doc.setFont("helvetica", "bold")
            doc.setFontSize(20)
            y += 15
            doc.text("Paso 4: El Cierre y Protocolo", 20, y)
            
            doc.setFont("helvetica", "normal")
            doc.setFontSize(11)
            doc.setTextColor(51, 65, 85)
            const paso4 = [
                "Objetivo: Aterrizar el acuerdo en un canal de trabajo ágil.",
                "",
                "Guion de Cierre:",
                "TÚ: 'Perfecto, me parece un esquema viable. Para empezar operaciones el lunes, necesito dos cosas: Primero, que me envíen el catálogo completo en PDF o Excel con precios base. Y segundo, que me asignen a una persona de su bodega en un chat de WhatsApp para coordinar los despachos diarios y enviarle los comprobantes de pago. ¿Con quién puedo crear el grupo de trabajo?'"
            ]
            y += 15
            paso4.forEach(p => {
                const lines = doc.splitTextToSize(p, 170)
                doc.text(lines, 20, y)
                y += lines.length * 6 + 2
            })

            doc.setFillColor(...ACCENT)
            doc.rect(0, 260, 210, 37, "F")
            doc.setTextColor(255, 255, 255)
            doc.setFont("helvetica", "bold")
            doc.setFontSize(12)
            doc.text("INICIA HOY TUS NEGOCIACIONES. EL NO YA LO TIENES, VE POR EL SÍ.", 105, 275, { align: "center" })

            doc.save("Guion_Negociacion_B2B_Atomic.pdf")
        } catch (err) {
            console.error("Error al generar el PDF:", err)
        } finally {
            setPdfLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans selection:bg-cyan-500/20 selection:text-cyan-900 relative overflow-hidden">
            
            {/* Background Neon Lights */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-cyan-400/30 blur-[120px] rounded-full mix-blend-multiply" />
                <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-purple-400/20 blur-[150px] rounded-full mix-blend-multiply" />
                <div className="absolute bottom-[-20%] left-[20%] w-[700px] h-[700px] bg-emerald-400/20 blur-[150px] rounded-full mix-blend-multiply" />
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.04] mix-blend-overlay" />
            </div>

            {/* Navbar Placeholder to keep structure */}
            <nav className="relative z-20 w-full px-6 py-6 max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center shadow-[0_12px_40px_rgba(0,0,0,0.5)] shadow-cyan-500/20">
                        <FileText className="text-white" size={20} />
                    </div>
                    <span className="text-xl font-black text-slate-800 tracking-tight">Atomic B2B</span>
                </div>
            </nav>

            {/* Hero */}
            <section className="relative z-10 pt-16 pb-20 px-6 max-w-6xl mx-auto text-center space-y-8">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-slate-900/50 backdrop-blur-xl border-slate-700/50/60 backdrop-blur-md border border-white/80 shadow-[0_4px_15px_rgba(0,0,0,0.3)] text-[10px] font-black uppercase tracking-widest text-cyan-600"
                >
                    <Sparkles size={14} className="animate-pulse" />
                    <span>Recurso Gratuito de Alto Valor</span>
                </motion.div>

                <motion.h1 
                    initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-tight text-slate-900"
                >
                    EL SCRIPT PARA CERRAR <br className="hidden md:block" />
                    <span className="bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent">
                        TRATOS MILLONARIOS
                    </span>
                </motion.h1>

                <motion.p 
                    initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="max-w-2xl mx-auto text-slate-600 text-lg md:text-xl font-medium leading-relaxed"
                >
                    Aprende el protocolo exacto para negociar con grandes proveedores, importadores y fábricas sin necesidad de capital inicial.
                </motion.p>

                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <a href="#download-section" className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white w-full sm:w-auto px-8 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-900/20 transition-all duration-300">
                        <Download size={18} />
                        Descargar Script PDF
                    </a>
                </motion.div>
            </section>

            {/* Author / Strategy Section */}
            <section className="relative z-10 py-24 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50/40 backdrop-blur-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[3rem] p-10 md:p-16 grid md:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <div className="w-16 h-16 rounded-2xl bg-cyan-100 text-cyan-600 flex items-center justify-center mb-6">
                                <Headset size={32} />
                            </div>
                            <h2 className="text-4xl font-black uppercase text-slate-900 tracking-tight leading-tight">
                                Negocia como un profesional B2B
                            </h2>
                            <p className="text-slate-600 font-medium leading-relaxed text-lg">
                                La mayoría de emprendedores falla al intentar comprarle a grandes empresas porque suenan como "revendedores pidiendo descuentos". Este guion cambia el paradigma: te enseñamos a presentarte como un <strong>aliado estratégico de ventas digitales</strong>.
                            </p>
                            <div className="space-y-4 pt-4">
                                {[
                                    "Contacto asertivo superando barreras de secretarias.",
                                    "Propuesta de valor enfocada en canales digitales.",
                                    "Manejo de objeciones sobre stock y crédito."
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                                            <CheckCircle2 className="text-emerald-600" size={16} />
                                        </div>
                                        <span className="text-slate-700 font-bold">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative aspect-square md:aspect-auto md:h-full min-h-[400px] rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl flex items-center justify-center p-8">
                            {/* Abstract decorative element representing communication */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-900/40 to-purple-900/40" />
                            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay" />
                            <div className="relative z-10 text-center space-y-6">
                                <BookKey size={80} className="text-cyan-400 mx-auto drop-shadow-2xl" />
                                <h3 className="text-2xl font-black text-white italic tracking-tighter">EL SECRETO ESTÁ EN LA PALABRA</h3>
                                <div className="h-1 w-20 bg-gradient-to-r from-cyan-400 to-purple-400 mx-auto rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Download & Lead Form */}
            <section id="download-section" className="relative z-10 py-24 px-6">
                <div className="max-w-xl mx-auto">
                    <div className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50/60 backdrop-blur-xl border border-white/80 shadow-[0_20px_50px_rgb(0,0,0,0.05)] rounded-[2.5rem] p-10 md:p-12 relative overflow-hidden">
                        
                        <div className="text-center space-y-4 mb-10 relative z-10">
                            <h3 className="text-3xl font-black uppercase text-slate-900 tracking-tight">Acceso Inmediato</h3>
                            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Registra tu correo para descargar el Script</p>
                        </div>

                        <AnimatePresence mode="wait">
                            {!submitted ? (
                                <motion.form key="lead-form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleSubmit} className="space-y-6 relative z-10">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Tu Nombre o Empresa</label>
                                        <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="Ej: Juan Pérez / Digital Corp"
                                            className="w-full bg-slate-900/50 backdrop-blur-xl border-slate-700/50/50 backdrop-blur-sm border border-slate-200 px-6 py-4 rounded-2xl text-sm font-bold text-slate-800 outline-none focus:border-cyan-500 focus:bg-slate-900/50 backdrop-blur-xl border-slate-700/50 focus:shadow-[0_0_20px_rgba(6,182,212,0.1)] transition-all placeholder:text-slate-400" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Correo Electrónico</label>
                                        <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="ejemplo@correo.com"
                                            className="w-full bg-slate-900/50 backdrop-blur-xl border-slate-700/50/50 backdrop-blur-sm border border-slate-200 px-6 py-4 rounded-2xl text-sm font-bold text-slate-800 outline-none focus:border-cyan-500 focus:bg-slate-900/50 backdrop-blur-xl border-slate-700/50 focus:shadow-[0_0_20px_rgba(6,182,212,0.1)] transition-all placeholder:text-slate-400" />
                                    </div>
                                    {errorMsg && <p className="text-xs font-bold text-red-600 uppercase tracking-wide bg-red-50 border border-red-200 p-4 rounded-xl text-center shadow-[0_4px_15px_rgba(0,0,0,0.3)]">⚠️ {errorMsg}</p>}
                                    <button type="submit" disabled={submitting}
                                        className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-[0_12px_40px_rgba(0,0,0,0.5)] shadow-blue-500/30 flex items-center justify-center gap-3 disabled:opacity-50 mt-4"
                                    >
                                        {submitting ? <span>Generando PDF...</span> : <><Download size={18} /><span>Descargar Ahora</span></>}
                                    </button>
                                </motion.form>
                            ) : (
                                <motion.div key="success-card" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8 space-y-8 relative z-10">
                                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-500 shadow-xl shadow-emerald-500/20">
                                        <CheckCircle2 size={40} />
                                    </div>
                                    <div className="space-y-3">
                                        <h4 className="text-2xl font-black text-slate-900 uppercase">¡PDF Generado!</h4>
                                        <p className="text-slate-600 text-sm font-medium leading-relaxed">Tu script está listo para descargar y usar. Te hemos enviado una copia de bienvenida a <strong className="text-slate-900">{email}</strong>.</p>
                                    </div>
                                    <button onClick={generatePDFGuide} disabled={pdfLoading}
                                        className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-slate-900/20"
                                    >
                                        <Download size={18} />
                                        <span>{pdfLoading ? "Descargando..." : "Volver a Descargar"}</span>
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 py-10 px-6 border-t border-slate-200/60 bg-slate-900/50 backdrop-blur-xl border-slate-700/50/40 backdrop-blur-md">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">© 2026 ATOMIC B2B SOLUTIONS</p>
                    <div className="flex gap-6 items-center">
                        {socialLinks.instagram && <a href={socialLinks.instagram} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-cyan-600 transition-colors"><Instagram size={20} /></a>}
                        {socialLinks.facebook && <a href={socialLinks.facebook} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-cyan-600 transition-colors"><Facebook size={20} /></a>}
                        {socialLinks.youtube && <a href={socialLinks.youtube} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-cyan-600 transition-colors"><Youtube size={20} /></a>}
                    </div>
                </div>
            </footer>
        </div>
    )
}
