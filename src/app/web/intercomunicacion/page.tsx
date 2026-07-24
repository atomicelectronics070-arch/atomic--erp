"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import {
    Download, CheckCircle2, Sparkles, Phone, Wifi, Monitor,
    Cpu, Shield, Building2, Home, Layers, ChevronDown,
    Zap, Signal, Lock, Mail, ArrowRight, PlayCircle, X,
    Instagram, Facebook, Youtube
} from "lucide-react"

const SYSTEMS = [
    {
        icon: <Phone size={28} />,
        label: "Audio Puro",
        tag: "NIVEL 01",
        color: "from-slate-700 to-slate-900",
        accent: "#94a3b8",
        ring: "ring-slate-600",
        desc: "La solución más sólida y económica. Comunicación bidireccional de voz entre la entrada y las unidades. Sin cámaras, sin internet. Ideal para conjuntos con presupuesto ajustado.",
        pros: ["Sin dependencia de internet", "Instalación sencilla", "Bajo costo de mantenimiento", "Alta durabilidad"],
        tech: "Tecnología analógica de 2 hilos"
    },
    {
        icon: <Monitor size={28} />,
        label: "Video Analógico",
        tag: "NIVEL 02",
        color: "from-sky-900 to-slate-900",
        accent: "#38bdf8",
        ring: "ring-sky-700",
        desc: "Agrega visión en tiempo real a la entrada. El guardia o residente puede ver quién llama antes de abrir. Sin router ni configuración de red necesarios.",
        pros: ["Vista en tiempo real sin internet", "Monitor dedicado por unidad", "Cableado coaxial confiable", "Imagen clara en condiciones difíciles"],
        tech: "Señal CVBS / BNC analógica"
    },
    {
        icon: <Wifi size={28} />,
        label: "Smart / App",
        tag: "NIVEL 03",
        color: "from-violet-900 to-slate-900",
        accent: "#a78bfa",
        ring: "ring-violet-700",
        desc: "Conectado a tu red WiFi. Puedes ver y hablar desde tu smartphone aunque estés fuera del edificio. Ideal para propietarios que viajan o administradores con múltiples conjuntos.",
        pros: ["Acceso desde smartphone", "Notificaciones push de visitas", "Historial de accesos con foto", "Apertura remota de puerta"],
        tech: "Protocolo SIP / WiFi 2.4GHz"
    },
    {
        icon: <Cpu size={28} />,
        label: "Protocolo IP",
        tag: "NIVEL 04",
        color: "from-teal-900 to-slate-900",
        accent: "#2dd4bf",
        ring: "ring-teal-700",
        desc: "Infraestructura sobre red Ethernet. Cada punto es una IP individual. Escalable a cientos de unidades. Integra con control de acceso, CCTV y gestión centralizada.",
        pros: ["Escalabilidad ilimitada", "Integración con CCTV y BMS", "Video HD sobre red LAN", "Gestión centralizada por software"],
        tech: "Estándar TCP/IP — PoE IEEE 802.3"
    },
    {
        icon: <Layers size={28} />,
        label: "Sistemas Mixtos",
        tag: "NIVEL 05",
        color: "from-amber-900 to-slate-900",
        accent: "#fbbf24",
        ring: "ring-amber-700",
        desc: "Combinación de tecnologías según zonas o edificios. Permite migración gradual de analógico a IP. La solución más flexible para proyectos de modernización parcial.",
        pros: ["Compatible con instalaciones existentes", "Migración sin demolición", "Diferentes zonas con distinta tecnología", "Costo-beneficio optimizado"],
        tech: "Gateways analógico-IP / Codecs"
    }
]

interface SocialLinks {
    instagram: string
    facebook: string
    youtube: string
}

export default function IntercomunicacionPage() {
    const [email, setEmail] = useState("")
    const [name, setName] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")
    const [pdfLoading, setPdfLoading] = useState(false)
    const [activeSystem, setActiveSystem] = useState<number | null>(null)
    const [socialLinks, setSocialLinks] = useState<SocialLinks>({ instagram: "", facebook: "", youtube: "" })

    useEffect(() => {
        fetch("/api/web/landing-social")
            .then(r => r.json())
            .then(setSocialLinks)
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
                body: JSON.stringify({
                    email,
                    name,
                    source: "LANDING_INTERCOMUNICACION",
                    requirement: "Descargó Guía de Intercomunicación Residencial. Interesado en sistemas de portería electrónica."
                })
            })
            if (res.ok) {
                setSubmitted(true)
                generatePDF()
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

    const generatePDF = async () => {
        setPdfLoading(true)
        try {
            const { jsPDF } = await import("jspdf")
            const doc = new jsPDF()

            // ── PORTADA ──
            doc.setFillColor(5, 10, 25)
            doc.rect(0, 0, 210, 297, "F")
            // Líneas de circuito decorativas
            doc.setDrawColor(0, 180, 216)
            doc.setLineWidth(0.3)
            for (let i = 0; i < 6; i++) {
                doc.line(0, 30 + i * 40, 210, 30 + i * 40)
            }
            doc.setFillColor(0, 180, 216)
            doc.rect(0, 0, 210, 6, "F")
            doc.setTextColor(255, 255, 255)
            doc.setFont("helvetica", "bold")
            doc.setFontSize(22)
            doc.text("INTRODUCCIÓN A LA", 105, 65, { align: "center" })
            doc.setFontSize(28)
            doc.setTextColor(0, 180, 216)
            doc.text("INTERCOMUNICACIÓN", 105, 82, { align: "center" })
            doc.setFontSize(14)
            doc.setTextColor(200, 230, 255)
            doc.text("RESIDENCIAL Y EMPRESARIAL", 105, 96, { align: "center" })
            doc.setFillColor(0, 180, 216)
            doc.rect(60, 108, 90, 1, "F")
            doc.setFontSize(10)
            doc.setTextColor(100, 140, 180)
            doc.text("Sistemas de Portería Electrónica: Audio · Video · Smart · IP · Mixtos", 105, 122, { align: "center" })
            doc.text("Para Administradores, Presidentes de Conjunto y Entusiastas de Tecnología", 105, 132, { align: "center" })
            doc.setFontSize(10)
            doc.setTextColor(50, 100, 140)
            doc.text("ATOMIC INDUSTRIAS · DIVISIÓN SMART HOME 2026", 105, 285, { align: "center" })

            // ── INTRODUCCIÓN ──
            doc.addPage()
            doc.setFillColor(8, 15, 35)
            doc.rect(0, 0, 210, 297, "F")
            doc.setFillColor(0, 180, 216)
            doc.rect(0, 0, 210, 4, "F")
            doc.setTextColor(0, 180, 216)
            doc.setFont("helvetica", "bold")
            doc.setFontSize(14)
            doc.text("¿QUÉ ES LA INTERCOMUNICACIÓN RESIDENCIAL?", 20, 30)
            doc.setFont("helvetica", "normal")
            doc.setFontSize(10)
            doc.setTextColor(180, 210, 240)
            const intro = [
                "Si estás leyendo esto, es probable que seas un administrador de conjunto, presidente de una junta de propietarios, o simplemente alguien que busca mejorar la seguridad y comodidad de su edificio o residencia. La buena noticia: has llegado al lugar correcto.",
                "La intercomunicación residencial abarca todos los sistemas electrónicos que permiten la comunicación entre la portería principal de un inmueble y sus distintas unidades de vivienda o departamentos. Su objetivo principal es controlar quién entra y quién no, pero en su evolución tecnológica ha ganado capacidades de video, conexión a internet, integración con teléfonos inteligentes y control de acceso avanzado.",
                "La clave para elegir el sistema correcto no es elegir 'el más caro' o 'el más moderno'. Es entender cuáles son los requerimientos técnicos exactos del proyecto, qué presupuesto se quiere invertir y qué alcance tecnológico se desea en el mediano y largo plazo."
            ]
            let y = 45
            intro.forEach(p => {
                const lines = doc.splitTextToSize(p, 170)
                doc.text(lines, 20, y)
                y += lines.length * 5.5 + 7
            })

            // ── SISTEMAS ──
            const systems = [
                { tag: "NIVEL 01", name: "Sistemas de Audio Puro", body: "La solución más sólida y económica del mercado. Comunicación bidireccional de voz entre la unidad de portería y los apartamentos. No requieren internet ni configuración de red. Operan con tecnología analógica de 2 hilos. Ideales para conjuntos residenciales de presupuesto ajustado donde la prioridad es funcionalidad y durabilidad por encima de todo." },
                { tag: "NIVEL 02", name: "Video Analógico sin Internet", body: "Incorporan una cámara en el módulo de portería para que el residente pueda ver quién está en la entrada antes de abrir. La señal viaja por cable coaxial hacia un monitor en cada unidad. No dependen de routers ni redes WiFi, lo que los hace extremadamente confiables. Perfectos para proyectos donde la privacidad y la autonomía de la instalación son prioridad." },
                { tag: "NIVEL 03", name: "Sistemas Smart con App", body: "Conectados a la red WiFi del conjunto, permiten al propietario o residente recibir notificaciones en su smartphone cuando alguien llama desde la portería, ver la cámara en tiempo real y abrir la puerta de forma remota. Ideal para propietarios que trabajan fuera o administradores que gestionan varios conjuntos desde distintas ubicaciones." },
                { tag: "NIVEL 04", name: "Sistemas IP sobre Red Ethernet", body: "La solución de mayor nivel tecnológico. Cada dispositivo (módulo de portería, monitor interior) tiene una dirección IP individual dentro de la red local. La señal de video es HD. Escalan desde 2 hasta miles de unidades. Se integran con sistemas CCTV, control de acceso biométrico y plataformas de gestión de edificios inteligentes (BMS)." },
                { tag: "NIVEL 05", name: "Sistemas Mixtos e Híbridos", body: "La opción más flexible para proyectos de modernización. Permiten conectar infraestructura analógica existente con nuevos módulos IP mediante gateways de conversión. Ideal para conjuntos que quieren migrar gradualmente sin demoler cableados antiguos. Cada zona puede tener un nivel de tecnología diferente según el presupuesto disponible por etapa." }
            ]

            systems.forEach(s => {
                if (y > 240) { doc.addPage(); doc.setFillColor(8, 15, 35); doc.rect(0, 0, 210, 297, "F"); doc.setFillColor(0, 180, 216); doc.rect(0, 0, 210, 4, "F"); y = 25 }
                doc.setTextColor(0, 180, 216)
                doc.setFont("helvetica", "bold")
                doc.setFontSize(9)
                doc.text(`[ ${s.tag} ]`, 20, y)
                y += 6
                doc.setFontSize(12)
                doc.setTextColor(255, 255, 255)
                doc.text(s.name, 20, y)
                y += 7
                doc.setFont("helvetica", "normal")
                doc.setFontSize(9)
                doc.setTextColor(160, 200, 235)
                const lines = doc.splitTextToSize(s.body, 170)
                doc.text(lines, 20, y)
                y += lines.length * 5 + 12
            })

            // ── DECISIÓN ──
            if (y > 220) { doc.addPage(); doc.setFillColor(8, 15, 35); doc.rect(0, 0, 210, 297, "F"); doc.setFillColor(0, 180, 216); doc.rect(0, 0, 210, 4, "F"); y = 25 }
            doc.setTextColor(0, 180, 216)
            doc.setFont("helvetica", "bold")
            doc.setFontSize(14)
            doc.text("¿CÓMO ELEGIR EL SISTEMA CORRECTO?", 20, y + 10)
            doc.setFont("helvetica", "normal")
            doc.setFontSize(10)
            doc.setTextColor(180, 210, 240)
            y += 22
            const decision = [
                "1. NÚMERO DE UNIDADES: A mayor escala, IP es la única opción sostenible.",
                "2. PRESUPUESTO: Audio puro < Video analógico < Smart App < IP Full.",
                "3. ACCESO REMOTO: Si los propietarios deben abrir desde su celular, mínimo Smart.",
                "4. INTEGRACIÓN: Si se desea conectar con CCTV o control de acceso, IP es obligatorio.",
                "5. INFRAESTRUCTURA: Si ya hay cableado coaxial, el video analógico puede reutilizarlo.",
            ]
            decision.forEach(d => {
                doc.text(d, 20, y)
                y += 8
            })

            doc.save("Guia_Intercomunicacion_Residencial_Atomic.pdf")
        } catch (err) {
            console.error("Error generando PDF:", err)
        } finally {
            setPdfLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#050a19] text-white selection:bg-cyan-500/20 selection:text-cyan-200 overflow-x-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>

            {/* Circuit grid background */}
            <div className="fixed inset-0 z-0 pointer-events-none"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(0,180,216,0.04) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(0,180,216,0.04) 1px, transparent 1px)
                    `,
                    backgroundSize: "48px 48px"
                }}
            />
            {/* Glows */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-cyan-500/8 blur-[120px] rounded-full pointer-events-none z-0" />
            <div className="fixed bottom-1/4 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none z-0" />

            {/* ── HERO ── */}
            <section className="relative z-10 pt-20 pb-16 px-6 max-w-6xl mx-auto">

                {/* Top bar */}
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between mb-16"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-cyan-500 flex items-center justify-center">
                            <Building2 size={16} className="text-slate-950" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-cyan-500">Atomic · Smart Home Division</span>
                    </div>
                    <div className="h-px flex-1 mx-8 bg-gradient-to-r from-cyan-500/20 to-transparent" />
                    <div className="hidden md:flex items-center gap-2 px-4 py-1.5 border border-cyan-500/20 bg-cyan-500/5">
                        <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
                        <span className="text-[9px] font-bold uppercase tracking-widest text-cyan-400">Recurso Gratuito</span>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 mb-6">
                                <Cpu size={11} className="text-cyan-400" />
                                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-cyan-400">Guía Técnica 2026</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-none">
                                <span className="block text-white">INTRODUCCIÓN A LA</span>
                                <span className="block mt-1" style={{ WebkitTextStroke: "1px rgba(0,180,216,0.8)", color: "transparent" }}>INTERCOMUNICACIÓN</span>
                                <span className="block text-cyan-400 mt-1">RESIDENCIAL</span>
                            </h1>
                        </motion.div>

                        <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                            className="text-slate-400 text-sm leading-relaxed font-medium"
                        >
                            Si estás leyendo esto, probablemente eres un <strong className="text-slate-200">administrador de conjunto</strong>, <strong className="text-slate-200">presidente de junta</strong>, o alguien que busca la tecnología adecuada para su edificio o residencia. Aquí encuentras todo lo que necesitas entender antes de tomar una decisión de compra.
                        </motion.p>

                        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                            className="grid grid-cols-3 gap-4"
                        >
                            {[
                                { label: "5 Niveles", sub: "De tecnología" },
                                { label: "100% Técnico", sub: "Sin marketing vacío" },
                                { label: "PDF Gratis", sub: "Descarga inmediata" }
                            ].map((s, i) => (
                                <div key={i} className="border border-cyan-500/15 bg-cyan-500/5 p-4">
                                    <p className="text-sm font-black text-cyan-400">{s.label}</p>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">{s.sub}</p>
                                </div>
                            ))}
                        </motion.div>

                        <motion.a initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                            href="#download-section"
                            className="inline-flex items-center gap-3 bg-cyan-500 text-slate-950 px-8 py-4 font-black text-xs uppercase tracking-widest hover:bg-slate-900/50 backdrop-blur-xl border-slate-700/50 transition-all"
                        >
                            <Download size={16} />
                            Descargar Guía PDF Gratis
                        </motion.a>
                    </div>

                    {/* Visual panel */}
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
                        className="relative hidden lg:block"
                    >
                        <div className="border border-cyan-500/20 bg-slate-950/60 p-8 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
                            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

                            <div className="flex items-center justify-between mb-6">
                                <span className="text-[9px] font-black text-cyan-500/60 uppercase tracking-widest">Sistema Activo</span>
                                <div className="flex gap-1">
                                    {[...Array(3)].map((_, i) => <div key={i} className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />)}
                                </div>
                            </div>

                            <div className="space-y-3">
                                {SYSTEMS.map((s, i) => (
                                    <div key={i} className="flex items-center gap-4 p-3 border border-slate-800/60 hover:border-cyan-500/30 transition-all cursor-pointer group"
                                        onClick={() => setActiveSystem(activeSystem === i ? null : i)}
                                    >
                                        <div className="w-8 h-8 bg-slate-900 flex items-center justify-center" style={{ color: s.accent }}>
                                            {s.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-[9px] font-black uppercase tracking-widest" style={{ color: s.accent }}>{s.tag}</div>
                                            <div className="text-xs font-bold text-white truncate">{s.label}</div>
                                        </div>
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.accent, opacity: 0.5 }} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── INTRO ── */}
            <section className="relative z-10 py-20 border-y border-slate-900 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="md:col-span-1">
                            <div className="sticky top-8 space-y-4">
                                <span className="text-[9px] font-black text-cyan-500 uppercase tracking-[0.5em] block">Por qué importa</span>
                                <h2 className="text-3xl font-black uppercase text-white tracking-tight">¿DE QUÉ TRATA ESTE RECURSO?</h2>
                                <div className="h-px bg-gradient-to-r from-cyan-500/30 to-transparent" />
                            </div>
                        </div>
                        <div className="md:col-span-2 space-y-6 text-slate-400 text-sm leading-relaxed font-medium">
                            <p>Para entender el mundo de la intercomunicación residencial, es fundamental comprender <strong className="text-slate-200">de qué tecnología nace cada modelo</strong> o solución disponible en el mercado. No todas las opciones sirven para todos los proyectos.</p>
                            <p>Partiendo de los <strong className="text-slate-200">equipos de solo audio</strong> —los más simples y probados— hasta los <strong className="text-slate-200">sistemas IP de alta densidad</strong> con integración total, cada gama responde a un conjunto específico de requerimientos técnicos, presupuesto y alcance tecnológico.</p>
                            <p>La solución correcta no es la más cara: es la que mejor resuelve los tres factores determinantes que evalúa cualquier instalación profesional:</p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                                {[
                                    { icon: <Shield size={18} />, label: "Requerimientos Técnicos", color: "text-cyan-400" },
                                    { icon: <Zap size={18} />, label: "Presupuesto a Invertir", color: "text-amber-400" },
                                    { icon: <Signal size={18} />, label: "Alcance Tecnológico", color: "text-violet-400" }
                                ].map((f, i) => (
                                    <div key={i} className="flex items-center gap-3 p-4 border border-slate-800 bg-slate-950/40">
                                        <span className={f.color}>{f.icon}</span>
                                        <span className="text-xs font-bold text-slate-300">{f.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── SYSTEMS ── */}
            <section className="relative z-10 py-20 px-6 max-w-6xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                    <span className="text-[9px] font-black text-cyan-500 uppercase tracking-[0.5em]">Ecosistema Tecnológico</span>
                    <h2 className="text-3xl md:text-4xl font-black uppercase text-white tracking-tight">Los 5 Niveles de Intercomunicación</h2>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">De lo más simple a lo más avanzado</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {SYSTEMS.map((s, i) => (
                        <motion.div key={i}
                            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                            className={`relative bg-gradient-to-br ${s.color} border border-slate-800/80 p-8 space-y-5 cursor-pointer hover:border-opacity-60 transition-all duration-300 group overflow-hidden`}
                            onClick={() => setActiveSystem(activeSystem === i ? null : i)}
                        >
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: `radial-gradient(ellipse at top left, ${s.accent}15, transparent)` }} />
                            <div className="flex items-center justify-between">
                                <div className="w-12 h-12 flex items-center justify-center border" style={{ borderColor: `${s.accent}40`, color: s.accent }}>
                                    {s.icon}
                                </div>
                                <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border" style={{ color: s.accent, borderColor: `${s.accent}30` }}>{s.tag}</span>
                            </div>
                            <div>
                                <h3 className="text-base font-black uppercase text-white tracking-tight">{s.label}</h3>
                                <p className="text-[9px] font-bold uppercase tracking-wider mt-1" style={{ color: s.accent }}>{s.tech}</p>
                            </div>
                            <p className="text-slate-400 text-xs font-medium leading-relaxed">{s.desc}</p>
                            <AnimatePresence>
                                {activeSystem === i && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                                        <div className="border-t border-slate-800 pt-4 space-y-2 mt-2">
                                            {s.pros.map((p, pi) => (
                                                <div key={pi} className="flex items-center gap-2 text-[10px] font-bold text-slate-300">
                                                    <CheckCircle2 size={11} style={{ color: s.accent }} />
                                                    {p}
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <div className="text-[9px] font-bold uppercase tracking-widest pt-1" style={{ color: s.accent }}>
                                {activeSystem === i ? "▲ Ver menos" : "▼ Ver ventajas"}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── DECISION GUIDE ── */}
            <section className="relative z-10 py-20 border-t border-slate-900 px-6 bg-slate-950/50">
                <div className="max-w-5xl mx-auto space-y-12">
                    <div className="text-center space-y-3">
                        <span className="text-[9px] font-black text-cyan-500 uppercase tracking-[0.5em]">Criterios de Selección</span>
                        <h2 className="text-3xl font-black uppercase text-white tracking-tight">¿Cómo elegir el sistema correcto?</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { q: "¿Cuántas unidades tiene el conjunto?", a: "Hasta 16 unidades: Audio o Video Analógico. 16–100 unidades: Smart App o IP. +100 unidades: IP obligatorio.", icon: <Building2 size={20} /> },
                            { q: "¿Requieren abrir la puerta desde el celular?", a: "Si los propietarios necesitan acceso remoto, mínimo un sistema Smart App con protocolo SIP o similar.", icon: <Wifi size={20} /> },
                            { q: "¿Hay infraestructura de red existente?", a: "Red Ethernet Cat6: IP es la mejor opción. Solo cableado coaxial: Video Analógico o conversión mixta.", icon: <Lock size={20} /> },
                            { q: "¿Desean integrar CCTV o control de acceso?", a: "Integración total requiere sistemas IP. Los sistemas analógicos operan de forma independiente.", icon: <Cpu size={20} /> },
                        ].map((item, i) => (
                            <div key={i} className="border border-slate-800 bg-slate-950/40 p-6 space-y-4 hover:border-cyan-500/20 transition-all">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-cyan-500/10 flex items-center justify-center text-cyan-400 shrink-0">{item.icon}</div>
                                    <div>
                                        <p className="text-xs font-black text-white uppercase tracking-wide">{item.q}</p>
                                        <p className="text-xs text-slate-400 font-medium leading-relaxed mt-2">{item.a}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── DOWNLOAD FORM ── */}
            <section id="download-section" className="relative z-10 py-24 px-6">
                <div className="max-w-xl mx-auto">
                    <div className="border border-cyan-500/20 bg-slate-950/80 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />

                        <div className="p-10 space-y-8">
                            <div className="text-center space-y-3">
                                <div className="w-14 h-14 bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto text-cyan-400">
                                    <Download size={24} />
                                </div>
                                <h3 className="text-2xl font-black uppercase text-white tracking-tight">Descarga la Guía Completa</h3>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Ingresa tus datos para desbloquear la descarga PDF</p>
                            </div>

                            <AnimatePresence mode="wait">
                                {!submitted ? (
                                    <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleSubmit} className="space-y-5">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">Nombre o Empresa / Conjunto</label>
                                            <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="EJ: CONJUNTO RESIDENCIAL LAS PALMAS"
                                                className="w-full bg-slate-900/50 border border-slate-800 px-4 py-3.5 text-xs font-bold uppercase tracking-widest text-white outline-none focus:border-cyan-500 transition-all placeholder:text-slate-800"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">Correo Electrónico</label>
                                            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="ADMIN@CONJUNTO.COM"
                                                className="w-full bg-slate-900/50 border border-slate-800 px-4 py-3.5 text-xs font-bold uppercase tracking-widest text-white outline-none focus:border-cyan-500 transition-all placeholder:text-slate-800"
                                            />
                                        </div>
                                        {errorMsg && <p className="text-xs font-bold text-red-400 text-center bg-red-950/20 border border-red-900/20 p-3">⚠ {errorMsg}</p>}
                                        <button type="submit" disabled={submitting}
                                            className="w-full bg-cyan-500 hover:bg-slate-900/50 backdrop-blur-xl border-slate-700/50 text-slate-950 py-4 font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {submitting ? "Procesando..." : <><Download size={14} /> Registrar y Descargar PDF</>}
                                        </button>
                                        <p className="text-[8px] text-slate-600 font-bold uppercase tracking-wider text-center leading-relaxed">
                                            Recibirás información sobre sistemas de portería, Smart Home y nuevos lanzamientos. Sin spam.
                                        </p>
                                    </motion.form>
                                ) : (
                                    <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8 space-y-6">
                                        <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400 animate-pulse">
                                            <CheckCircle2 size={36} />
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="text-lg font-black text-white uppercase">¡Guía Descargada!</h4>
                                            <p className="text-slate-400 text-xs font-medium">Tu PDF se ha generado y descargado. Recibirás más contenido en <span className="text-cyan-400 font-bold">{email}</span>.</p>
                                        </div>
                                        <button onClick={generatePDF} disabled={pdfLoading}
                                            className="inline-flex items-center gap-2 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 px-8 py-3 font-black text-[10px] uppercase tracking-widest transition-all"
                                        >
                                            <Download size={14} />
                                            {pdfLoading ? "Generando..." : "Descargar de Nuevo"}
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 border-t border-slate-900 py-10 px-6 text-center">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[9px] font-bold text-slate-700 uppercase tracking-widest">© 2026 ATOMIC INDUSTRIES · DIVISIÓN SMART HOME · PORTERÍA ELECTRÓNICA & INTERCOMUNICACIÓN</p>
                    <div className="flex gap-4 items-center">
                        {socialLinks.instagram && <a href={socialLinks.instagram} target="_blank" rel="noreferrer" className="text-slate-600 hover:text-cyan-400 transition-colors"><Instagram size={16} /></a>}
                        {socialLinks.facebook && <a href={socialLinks.facebook} target="_blank" rel="noreferrer" className="text-slate-600 hover:text-cyan-400 transition-colors"><Facebook size={16} /></a>}
                        {socialLinks.youtube && <a href={socialLinks.youtube} target="_blank" rel="noreferrer" className="text-slate-600 hover:text-cyan-400 transition-colors"><Youtube size={16} /></a>}
                    </div>
                </div>
            </footer>
        </div>
    )
}
