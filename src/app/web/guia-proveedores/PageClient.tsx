"use client"


import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Download, CheckCircle2, BookOpen, 
    Users, Award, Sparkles, Instagram, Facebook, Youtube, Phone, Headset, BookKey, Search, FileText,
    Globe2, Building2, Target, ShieldAlert, Cpu, ArrowRight, ShieldCheck, Landmark, Scale, Zap, Compass, RefreshCw, X, Send
} from "lucide-react"

interface SocialLinks {
    instagram: string
    facebook: string
    youtube: string
}

export default function GuiaProveedoresPage() {
    // Form fields
    const [email, setEmail] = useState("")
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [city, setCity] = useState("")

    // Statuses
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")
    const [pdfLoading, setPdfLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [socialLinks, setSocialLinks] = useState<SocialLinks>({ instagram: "", facebook: "", youtube: "" })

    // Active Tab state for interactive manual viewer
    const [activeTab, setActiveTab] = useState<"extranjeros" | "locales">("extranjeros")
    const [activeStepIndex, setActiveStepIndex] = useState(0)

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
        if (!name.trim()) {
            setErrorMsg("Por favor, ingresa tus nombres y apellidos.")
            return
        }
        if (!phone.trim()) {
            setErrorMsg("Por favor, ingresa tu número de teléfono de contacto.")
            return
        }
        if (!city.trim()) {
            setErrorMsg("Por favor, ingresa tu ciudad de residencia.")
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
                    phone,
                    city,
                    source: "MANUAL_NEGOCIACION_PROVEEDORES",
                    requirement: `Solicitud de Manual Completo de Negociación con Proveedores. Ciudad: ${city}, Tel: ${phone}`
                })
            })

            if (res.ok) {
                setSubmitted(true)
                setShowModal(true)
                generatePDFGuide()
            } else {
                const data = await res.json()
                setErrorMsg(data.error || "Hubo un error al procesar tu registro.")
            }
        } catch {
            setErrorMsg("No se pudo conectar con el servidor. Inténtalo de nuevo.")
        } finally {
            setSubmitting(false)
        }
    }

    const generatePDFGuide = async () => {
        setPdfLoading(true)
        try {
            const { jsPDF } = await import("jspdf")
            const doc = new jsPDF()

            // Palette
            const PRIMARY = [15, 23, 42] as [number, number, number]   // Slate 900
            const GOLD = [217, 119, 6] as [number, number, number]     // Amber 600
            const CYAN = [8, 145, 178] as [number, number, number]     // Cyan 600
            
            // ── COVER ──
            doc.setFillColor(248, 250, 252)
            doc.rect(0, 0, 210, 297, "F")
            
            doc.setDrawColor(...GOLD)
            doc.setLineWidth(1.5)
            doc.rect(12, 12, 186, 273, "S")
            
            doc.setTextColor(...PRIMARY)
            doc.setFont("helvetica", "bold")
            doc.setFontSize(26)
            doc.text("MANUAL DE NEGOCIACIÓN", 105, 65, { align: "center" })
            doc.text("ESTRATÉGICA B2B", 105, 78, { align: "center" })
            
            doc.setFontSize(14)
            doc.setTextColor(...CYAN)
            doc.text("Cómo Tratar con Proveedores Extranjeros y Locales", 105, 95, { align: "center" })
            doc.text("y Lograr Acuerdos Únicos de Alta Rentabilidad", 105, 103, { align: "center" })
            
            doc.setDrawColor(203, 213, 225)
            doc.setLineWidth(0.5)
            doc.line(60, 115, 150, 115)
            
            doc.setTextColor(71, 85, 105)
            doc.setFont("helvetica", "normal")
            doc.setFontSize(10)
            doc.text("Basado en 15+ años de experiencia real en comercio internacional,", 105, 130, { align: "center" })
            doc.text("logística transfronteriza y distribución mayorista.", 105, 137, { align: "center" })

            doc.setFillColor(15, 23, 42)
            doc.rect(30, 160, 150, 45, "F")
            doc.setTextColor(255, 255, 255)
            doc.setFont("helvetica", "bold")
            doc.setFontSize(11)
            doc.text("CONTENIDO MAESTRO INCLUIDO:", 105, 173, { align: "center" })
            doc.setFont("helvetica", "normal")
            doc.setFontSize(9)
            doc.text("• 5 Pasos para Negociar con Fabricantes Extranjeros", 105, 183, { align: "center" })
            doc.text("• 5 Pilares Tácticos para Negociar con Proveedores Locales", 105, 192, { align: "center" })

            doc.setTextColor(15, 23, 42)
            doc.setFont("helvetica", "bold")
            doc.setFontSize(9)
            doc.text("EDICIÓN EXCLUSIVA 2026 · ATOMIC B2B MASTERMIND", 105, 260, { align: "center" })

            // ── SECCIÓN 1: PROVEEDORES EXTRANJEROS ──
            doc.addPage()
            doc.setFillColor(255, 255, 255)
            doc.rect(0, 0, 210, 297, "F")
            
            doc.setTextColor(...PRIMARY)
            doc.setFont("helvetica", "bold")
            doc.setFontSize(18)
            doc.text("PARTE I: 5 PASOS CON PROVEEDORES EXTRANJEROS", 20, 25)
            
            doc.setDrawColor(...GOLD)
            doc.setLineWidth(1)
            doc.line(20, 30, 190, 30)

            const pasosExtranjeros = [
                {
                    title: "Paso 1: Filtrado de Fábricas Directas vs. Traders",
                    body: "No trates con brokers intermediarios. Exige la Licencia Fiscal de Exportación china/internacional, certificado de propiedad industrial y realiza una auditoría remota en vivo por video de las líneas de producción. Revisa antecedentes en Panjiva y TradeMap."
                },
                {
                    title: "Paso 2: Muestras y Pruebas de Calidad Bajo Presión",
                    body: "Nunca compres contenedor a ciegas. Solicita muestras de serie comercial (no preparadas para exhibición). Exige inspección de tercera parte (SGS/TUV) pre-embarque con tolerancia de defecto menor al 0.5%."
                },
                {
                    title: "Paso 3: Incoterms y Financiamiento (Sin Arriesgar Caja)",
                    body: "Negocia términos FOB para controlar el flete marítimo/aéreo. Evoluciona del depósito 30% / 70% tradicional al esquema de Pago contra Copia de Bill of Lading (B/L) o Cartas de Crédito Irrevocables (LC a la vista)."
                },
                {
                    title: "Paso 4: Exclusividad Territorial y Marcas Blancas (OEM/ODM)",
                    body: "Pide exclusividad geográfica condicionada a metas trimestrales escalonadas. Protege tus modelos mediante acuerdos NNN (Non-disclosure, Non-use, Non-circumvention) bajo legislación del país de origen."
                },
                {
                    title: "Paso 5: Consolidación Logística y Agilidad Aduanera",
                    body: "Utiliza Freight Forwarders independientes. Agrupa cargas LCL hacia FCL, optimiza las partidas arancelarias (HS Codes) y asegura de 14 a 21 días libres de demoras en puerto de destino."
                }
            ]

            let curY = 40
            pasosExtranjeros.forEach((p, idx) => {
                doc.setFont("helvetica", "bold")
                doc.setFontSize(11)
                doc.setTextColor(...CYAN)
                doc.text(p.title, 20, curY)
                curY += 6

                doc.setFont("helvetica", "normal")
                doc.setFontSize(9.5)
                doc.setTextColor(51, 65, 85)
                const lines = doc.splitTextToSize(p.body, 170)
                doc.text(lines, 20, curY)
                curY += lines.length * 5 + 8
            })

            // ── SECCIÓN 2: PROVEEDORES LOCALES ──
            doc.addPage()
            doc.setFillColor(255, 255, 255)
            doc.rect(0, 0, 210, 297, "F")

            doc.setTextColor(...PRIMARY)
            doc.setFont("helvetica", "bold")
            doc.setFontSize(18)
            doc.text("PARTE II: 5 PILARES CON PROVEEDORES LOCALES", 20, 25)
            
            doc.setDrawColor(...GOLD)
            doc.setLineWidth(1)
            doc.line(20, 30, 190, 30)

            const pilaresLocales = [
                {
                    title: "Pilar 1: Encontrar tu Nicho de Alta Rotación",
                    body: "Identifica micro-sectores desatendidos por las grandes cadenas donde el margen supera el 35% y la competencia sea lenta en la atención digital."
                },
                {
                    title: "Pilar 2: Identificar las Vulnerabilidades de la Competencia",
                    body: "Mapea los quiebres de stock habituales y lentitud de despacho de tus competidores para posicionarte como la alternativa inmediata."
                },
                {
                    title: "Pilar 3: Auditar las Herramientas Digitales y Logísticas que Posees",
                    body: "Muéstrale al proveedor tu infraestructura: e-commerce optimizado, CRM omnicanal y envíos el mismo día para convencerlo de darte precio distribuidor VIP."
                },
                {
                    title: "Pilar 4: El Punto a Favor de tu Cliente (Tus Datos del Consumidor)",
                    body: "Tus métricas en tiempo real de qué busca la gente son oro puro para el proveedor. Ofrécele inteligencia de mercado a cambio de consignación garantizada."
                },
                {
                    title: "Pilar 5: Propuestas a la Medida Según el Perfil del Proveedor",
                    body: "Adáptate: al importador maduro ofrécele liberar stock estancado; al fabricante nacional ofrécele empaquetado exclusivo de tu marca propia."
                }
            ]

            curY = 40
            pilaresLocales.forEach((p) => {
                doc.setFont("helvetica", "bold")
                doc.setFontSize(11)
                doc.setTextColor(...GOLD)
                doc.text(p.title, 20, curY)
                curY += 6

                doc.setFont("helvetica", "normal")
                doc.setFontSize(9.5)
                doc.setTextColor(51, 65, 85)
                const lines = doc.splitTextToSize(p.body, 170)
                doc.text(lines, 20, curY)
                curY += lines.length * 5 + 8
            })

            doc.setFillColor(...PRIMARY)
            doc.rect(0, 260, 210, 37, "F")
            doc.setTextColor(255, 255, 255)
            doc.setFont("helvetica", "bold")
            doc.setFontSize(10)
            doc.text("MANUAL ESTRATÉGICO DE PROVEEDORES · GENERADO EXCLUSIVAMENTE PARA ATOMIC B2B", 105, 278, { align: "center" })

            doc.save("Manual_Negociacion_Proveedores_Atomic.pdf")
        } catch (err) {
            console.error("Error al generar PDF:", err)
        } finally {
            setPdfLoading(false)
        }
    }

    // Interactive Manual Data
    const pasosExtranjerosData = [
        {
            num: "01",
            title: "Auditoría Directa de Fábrica y Bypass de Intermediarios",
            subtitle: "Cómo saltarte brokers y traders para llegar a los dueños reales en China, EE.UU. o Europa.",
            details: [
                "Verificación fiscal de licencias de exportación en el Business License Register oficial.",
                "Auditoría visual remota en tiempo real de las líneas de producción y almacenes de materia prima.",
                "Cruce de volumen de exportación histórico mediante plataformas internacionales de aduana (TradeMap & ImportYeti).",
                "Protocolo de contacto en idioma técnico: Hablar en términos de capacidad instalada mensual (PMP) y no como un comprador novato solicitando catálogos aleatorios."
            ],
            quote: "Si hablas con un trader en Alibaba creyendo que es el fabricante, ya regalaste un 20% de tu margen antes de empezar."
        },
        {
            num: "02",
            title: "Pruebas de Estrés de Muestras y Auditorías de Calidad",
            subtitle: "Blindaje técnico para evitar contenedores con productos defectuosos.",
            details: [
                "Solicitud de muestras de línea comercial estándar, rechazando las 'muestras de laboratorio' preparadas para engañar.",
                "Contratación de inspección técnica pre-embarque por firmas independientes (SGS, TUV, Bureau Veritas).",
                "Cláusulas estrictas AQL (Acceptable Quality Limit) fijadas en nivel II con tolerancia máxima de defecto menor al 0.5%.",
                "Firma de contrato de responsabilidad donde la fábrica asume los costos de reposición y flete en productos fuera de especificación."
            ],
            quote: "Un control de calidad pre-embarque cuesta $300. Un contenedor retenido en aduana con fallas te cuesta el negocio."
        },
        {
            num: "03",
            title: "ESTRUCTURA DE INCOTERMS Y FINANCIAMIENTO SIN ARRIESGAR CAJA",
            subtitle: "Control absoluto de costos logísticos y esquemas de pago escalonados.",
            details: [
                "Dominio de Incoterms: Operar bajo FOB (Free On Board) para mantener el control total del agente de carga y seguros.",
                "Evolución del pago: Migrar del rígido 30% anticipado a esquemas de pago del 80% contra presentación de Bill of Lading (B/L) verificado.",
                "Implementación de Cartas de Crédito (L/C Irrevocable a la vista) para transacciones de volumen alto sin desembolso de liquidez inmediata.",
                "Negociación de descuentos financieros por prontopago cuando el tipo de cambio favorece la transacción."
            ],
            quote: "El comerciante novato pide crédito; el empresario veterano estructura instrumentos financieros respaldados por el mismo inventario."
        },
        {
            num: "04",
            title: "EXCLUSIVIDAD TERRITORIAL, OEM/ODM Y PROPIEDAD INTELECTUAL",
            subtitle: "Construcción de barreras de entrada imposibles de copiar por tu competencia.",
            details: [
                "Contratos de distribución exclusiva regional condicionada a cuotas de compra trimestrales realistas.",
                "Desarrollo de empaques personalizados (OEM) y personalización funcional de hardware/software (ODM).",
                "Firmas de Acuerdos NNN (Non-disclosure, Non-use, Non-circumvention) bajo la jurisdicción legal y laboral del país del proveedor.",
                "Registro previo de marca e isotipo en la oficina de patentes locales antes de lanzar el producto al mercado."
            ],
            quote: "Si el producto que importas lo puede traer cualquiera buscando el mismo link, tu negocio es un préstamo con fecha de caducidad."
        },
        {
            num: "05",
            title: "CONSOLIDACIÓN LOGÍSTICA, DERECHOS ARANCELARIOS Y ESCALABILIDAD",
            subtitle: "Maximizando el margen neto en la nacionalización del producto.",
            details: [
                "Consolidación de carga LCL (Less than Container Load) en bodegas de agentes neutrales antes de saltar a contenedores completos FCL.",
                "Revisión y optimización de Subpartidas Arancelarias (HS Code / NANDINA) para aplicar a acuerdos comerciales y desgravaciones.",
                "Negociación de días libres de demoras y almacenaje en puerto (Demurrage) de 14 a 21 días para amortiguar inspecciones aduaneras.",
                "Modelado de costos landed exactos incluyendo seguros, aranceles, salvaguardias y transporte interno directo a tu centro de distribución."
            ],
            quote: "La ganancia en el comercio exterior no se logra en la venta; se consolida en la eficiencia de la liquidación aduanera."
        }
    ]

    const pilaresLocalesData = [
        {
            num: "P-01",
            title: "Encontrar Tu Nicho de Alta Rotación y Rentabilidad",
            subtitle: "Dominar micro-mercados especializados donde las grandes cadenas no pueden reaccionar a tiempo.",
            details: [
                "Foco en familias de productos con márgenes superiores al 35% neto y ticket promedio saludable.",
                "Identificación de nichos de demanda latente en búsquedas digitales que los distribuidores tradicionales ignoran.",
                "Especialización en soluciones completas (combos / kits) en lugar de vender ítems sueltos que compiten solo por precio.",
                "Filtrado de productos por peso/volumen optimizado para mantener costos de despacho local mínimos."
            ],
            quote: "No luches por el océano entero; aduéñate de una bahía donde tú seas la única autoridad."
        },
        {
            num: "P-02",
            title: "Identificar a Tu Competencia y Sus Grietas Operativas",
            subtitle: "Mapeo exhaustivo de las debilidades del mercado local para capitalizar sus fallas.",
            details: [
                "Radiografía de la competencia: tiempos de respuesta, políticas de garantía, estado de su catálogo web y presencia omnicanal.",
                "Detección de quiebres de stock habituales de la competencia para ofrecer suministro ininterrumpido.",
                "Identificación de puntos ciegos en la atención al cliente de los competidores locales.",
                "Estrategia de precios dinámicos posicionándote sobre el valor agregado y no en el remate desperdiciado de margen."
            ],
            quote: "Tu mayor ventaja competitiva suele ser la pereza operativa de tu rival establecido."
        },
        {
            num: "P-03",
            title: "Identificar Qué Herramientas Tienes (Tu Venta de Poder)",
            subtitle: "Presentarte ante el proveedor local como una máquina de ventas digitales de alto rendimiento.",
            details: [
                "Demostración de infraestructura digital: catálogo web optimizado, sistemas de cotización automática y pasarelas de pago.",
                "Estrategia de pauta publicitaria segmentada (Meta, Google, TikTok) para mover volumen sin depender de tráfico orgánico lento.",
                "Sistemas CRM con automatización de seguimiento que garantizan un cierre eficiente de cada lead generado.",
                "Capacidad de recolección y despacho mismo día (Same-Day Delivery) para elevar la satisfacción del usuario final."
            ],
            quote: "Al proveedor local no le importa quién eres; le importa cuántas unidades puedes sacarle de la bodega cada semana."
        },
        {
            num: "P-04",
            title: "Qué Punto a Favor Tienes de Tu Cliente (Tus Datos)",
            subtitle: "Usar la voz y el comportamiento directo del consumidor como moneda de cambio con el distribuidor.",
            details: [
                "Conocimiento analítico inmediato de qué variaciones de producto prefiere el mercado.",
                "Retroalimentación directa sobre precios máximos tolerados y funciones más valoradas.",
                "Historial de recompra y fidelización que le asegura al proveedor ingresos predecibles a mediano plazo.",
                "Capacidad de testear nuevos productos del proveedor en 48 horas con datos reales antes de compras masivas."
            ],
            quote: "Quien posee la relación y la confianza directa con el cliente final siempre impone las condiciones en la mesa de negociación."
        },
        {
            num: "P-05",
            title: "Propuesta Personalizada Según el Perfil del Proveedor",
            subtitle: "Diseño de ofertas irrresistibles adaptadas a las necesidades psicológicas y comerciales de cada tipo de proveedor.",
            details: [
                "Para el Importador Mayorista Tradicional: Ofrécele liquidar lotes estancados o de baja rotación a cambio de márgenes del 40%+.",
                "Para el Fabricante Nacional: Ofrécele crear empaques exclusivos con tu marca o integrarlo en paquetes cerrados con garantía.",
                "Para el Distribuidor Conservador: Ofrécele pago inmediato por despacho diario eliminando su riesgo crediticio.",
                "Para el Proveedor Saturado: Ofrécele encargarte tú mismo de la logística de recolección y etiquetado en su propia bodega."
            ],
            quote: "Descubre dónde le duele la cabeza a tu proveedor y tu propuesta será el único analgésico disponible."
        }
    ]

    return (
        <div className="min-h-screen bg-[#030712] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-x-hidden">
            
            {/* Ambient Lighting Gradients */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[700px] h-[700px] bg-cyan-600/10 blur-[180px] rounded-full" />
                <div className="absolute top-[30%] right-[-10%] w-[800px] h-[800px] bg-amber-500/10 blur-[200px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[20%] w-[900px] h-[900px] bg-indigo-600/10 blur-[220px] rounded-full" />
                <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
            </div>

            {/* HEADER / NAVIGATION */}
            <nav className="relative z-30 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_25px_rgba(6,182,212,0.4)]">
                            <Compass className="text-slate-950 font-black" size={22} />
                        </div>
                        <div>
                            <span className="text-lg font-black tracking-widest text-white uppercase font-mono">
                                ATOMIC <span className="text-amber-400">MASTERMIND</span>
                            </span>
                            <p className="text-[10px] text-slate-400 font-mono tracking-wider">GUÍAS & ESTRATEGIAS DE NEGOCIACIÓN B2B</p>
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => {
                            const el = document.getElementById("registro-form")
                            el?.scrollIntoView({ behavior: "smooth" })
                        }}
                        className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-mono font-black text-xs uppercase tracking-wider hover:scale-105 transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                    >
                        <Download size={15} />
                        <span>Recibir Guía Completa</span>
                    </button>
                </div>
            </nav>

            {/* HERO SECTION */}
            <section className="relative z-10 pt-16 pb-20 px-6 max-w-6xl mx-auto text-center space-y-8">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-slate-900/90 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold shadow-[0_0_25px_rgba(245,158,11,0.2)]"
                >
                    <Sparkles size={15} className="text-amber-400 animate-pulse" />
                    <span>MANUAL EXCLUSIVO DE COMERCIO EXTERIOR & NEGOCIACIÓN LOCAL 2026</span>
                </motion.div>

                <motion.h1 
                    initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-white max-w-5xl mx-auto leading-[1.08] font-mono"
                >
                    CÓMO HACER TRATOS ÚNICOS CON <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-cyan-400 to-blue-500">
                        PROVEEDORES EXTRANJEROS Y LOCALES
                    </span>
                </motion.h1>

                <motion.div 
                    initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="max-w-3xl mx-auto p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl text-slate-300 text-sm md:text-base font-sans leading-relaxed text-left space-y-3 relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500" />
                    <p className="font-semibold text-amber-200 font-mono text-xs uppercase tracking-wider flex items-center gap-2">
                        <Award size={16} className="text-amber-400" />
                        Mensaje del Empresario Director (15+ años en importación y distribución):
                    </p>
                    <p className="italic text-slate-300">
                        "En más de una década en el mundo de los negocios, he visto morir cientos de emprendimientos no por falta de clientes, sino por negociar mal con sus proveedores. Si dependes de revendedores locales de tercer nivel o te dejas intimidar por las fábricas extranjeras, estás trabajando para ellos. Este manual es la hoja de ruta estratégica para tomar el control de tu cadena de suministro, asegurar exclusividades y maximizar tus márgenes netos desde el día uno."
                    </p>
                </motion.div>

                {/* Stat Cards Highlights */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-4">
                    {[
                        { label: "PASOS EXTRANJEROS", val: "5 ETAPAS", sub: "China, EE.UU. & UE" },
                        { label: "PILARES LOCALES", val: "5 TÁCTICAS", sub: "Mercado Nacional" },
                        { label: "MARGEN TÍPICO", val: "+35% A 60%", sub: "Rentabilidad Neta" },
                        { label: "ACUERDOS UNICOS", val: "EXCLUSIVOS", sub: "Contratos Blindados" }
                    ].map((st, i) => (
                        <div key={i} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-center font-mono">
                            <span className="text-[10px] text-slate-400 block tracking-widest uppercase">{st.label}</span>
                            <span className="text-xl font-black text-amber-400 block my-1">{st.val}</span>
                            <span className="text-[10px] text-cyan-300 block">{st.sub}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* INTERACTIVE MANUAL EXPLORER */}
            <section className="relative z-10 max-w-6xl mx-auto px-6 py-12">
                <div className="text-center space-y-3 mb-10">
                    <h2 className="text-3xl font-black text-white font-mono uppercase tracking-tight">
                        EXPLORA EL MANUAL ESTRATÉGICO
                    </h2>
                    <p className="text-slate-400 text-sm max-w-xl mx-auto font-sans">
                        Selecciona el módulo para revisar los protocolos detallados de negociación internacional y nacional.
                    </p>

                    {/* Tab Selector */}
                    <div className="inline-flex p-1.5 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs mt-4">
                        <button 
                            onClick={() => { setActiveTab("extranjeros"); setActiveStepIndex(0); }}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold uppercase transition-all ${
                                activeTab === "extranjeros"
                                    ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-[0_0_20px_rgba(8,145,178,0.4)]"
                                    : "text-slate-400 hover:text-white"
                            }`}
                        >
                            <Globe2 size={16} />
                            <span>1. Proveedores Extranjeros (5 Pasos)</span>
                        </button>
                        <button 
                            onClick={() => { setActiveTab("locales"); setActiveStepIndex(0); }}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold uppercase transition-all ${
                                activeTab === "locales"
                                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.4)]"
                                    : "text-slate-400 hover:text-white"
                            }`}
                        >
                            <Building2 size={16} />
                            <span>2. Proveedores Locales (5 Pilares)</span>
                        </button>
                    </div>
                </div>

                {/* Step / Pillar Details Viewer */}
                <div className="grid lg:grid-cols-12 gap-8 items-start">
                    {/* Index List Sidebar */}
                    <div className="lg:col-span-5 space-y-3">
                        {(activeTab === "extranjeros" ? pasosExtranjerosData : pilaresLocalesData).map((item, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveStepIndex(idx)}
                                className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 flex items-start gap-4 ${
                                    activeStepIndex === idx
                                        ? activeTab === "extranjeros"
                                            ? "bg-cyan-950/40 border-cyan-500/80 shadow-[0_0_25px_rgba(8,145,178,0.2)]"
                                            : "bg-amber-950/40 border-amber-500/80 shadow-[0_0_25px_rgba(245,158,11,0.2)]"
                                        : "bg-slate-950/80 border-slate-800/80 hover:border-slate-700 text-slate-400 hover:text-slate-200"
                                }`}
                            >
                                <span className={`text-lg font-black font-mono shrink-0 px-3 py-1 rounded-xl ${
                                    activeStepIndex === idx 
                                        ? activeTab === "extranjeros" ? "bg-cyan-500 text-slate-950" : "bg-amber-500 text-slate-950"
                                        : "bg-slate-900 text-slate-400"
                                }`}>
                                    {item.num}
                                </span>
                                <div className="space-y-1">
                                    <h4 className="font-mono font-bold text-sm text-white line-clamp-1">
                                        {item.title}
                                    </h4>
                                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                                        {item.subtitle}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Step Content Viewer Card */}
                    <div className="lg:col-span-7">
                        <AnimatePresence mode="wait">
                            {(() => {
                                const current = (activeTab === "extranjeros" ? pasosExtranjerosData : pilaresLocalesData)[activeStepIndex]
                                return (
                                    <motion.div
                                        key={`${activeTab}-${activeStepIndex}`}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.25 }}
                                        className="p-8 rounded-3xl bg-slate-950/90 border border-slate-800/90 backdrop-blur-2xl shadow-2xl relative space-y-6"
                                    >
                                        {/* Header */}
                                        <div className="space-y-2 border-b border-slate-800 pb-5">
                                            <div className="flex items-center justify-between">
                                                <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                                                    activeTab === "extranjeros" 
                                                        ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
                                                        : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                                                }`}>
                                                    {activeTab === "extranjeros" ? `PASO ${current.num} DE 5 EXTRANJEROS` : `PILAR ${current.num} LOCAL`}
                                                </span>
                                                <Sparkles className={activeTab === "extranjeros" ? "text-cyan-400" : "text-amber-400"} size={18} />
                                            </div>
                                            <h3 className="text-2xl font-black text-white font-mono leading-tight">
                                                {current.title}
                                            </h3>
                                            <p className="text-slate-400 text-sm font-sans italic">
                                                "{current.subtitle}"
                                            </p>
                                        </div>

                                        {/* Key Tactical Requirements */}
                                        <div className="space-y-3">
                                            <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                                                <CheckCircle2 size={14} className={activeTab === "extranjeros" ? "text-cyan-400" : "text-amber-400"} />
                                                Acciones Tácticas Clave:
                                            </h4>
                                            <div className="space-y-2.5">
                                                {current.details.map((dt, dIdx) => (
                                                    <div key={dIdx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/70 border border-slate-800/60 text-xs text-slate-300 leading-relaxed font-sans">
                                                        <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${activeTab === "extranjeros" ? "bg-cyan-400" : "bg-amber-400"}`} />
                                                        <span>{dt}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Veteran Quote Box */}
                                        <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 text-xs font-mono italic text-slate-300 flex items-center gap-3">
                                            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
                                                <Award size={20} />
                                            </div>
                                            <div>
                                                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">Regla de Oro del Veterano:</span>
                                                "{current.quote}"
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            })()}
                        </AnimatePresence>
                    </div>
                </div>
            </section>

            {/* FULL DETAILED MANUAL OVERVIEW (EXTENSIVE TEXT SECTION) */}
            <section className="relative z-10 max-w-5xl mx-auto px-6 py-16 space-y-12">
                <div className="p-8 md:p-12 rounded-3xl bg-slate-950/80 border border-slate-800/80 backdrop-blur-2xl space-y-10">
                    
                    {/* Header */}
                    <div className="text-center space-y-3 border-b border-slate-800 pb-8">
                        <span className="px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold uppercase tracking-widest">
                            DOCUMENTO COMPLETO DE ESTRATEGIA B2B
                        </span>
                        <h2 className="text-3xl md:text-4xl font-black text-white font-mono uppercase tracking-tight">
                            DESGLOSE MAESTRO DE NEGOCIACIÓN
                        </h2>
                        <p className="text-slate-400 text-sm max-w-2xl mx-auto">
                            Estudio exhaustivo para dominar las compras internacionales y locales con márgenes superiores al promedio de la industria.
                        </p>
                    </div>

                    {/* Extranjeros Block */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                                <Globe2 size={22} />
                            </div>
                            <h3 className="text-xl font-bold text-white font-mono uppercase">
                                I. Los 5 Pasos para Tratos Únicos con Proveedores Extranjeros
                            </h3>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 text-xs text-slate-300 leading-relaxed font-sans">
                            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                                <h4 className="font-mono font-bold text-cyan-300 text-sm">1. Filtrado Directo de Fábricas vs. Traders</h4>
                                <p>
                                    La mayoría de compradores latinos caen en la trampa de comprar a comercializadoras (Traders) pensando que son fabricantes. Exige la licencia comercial fiscal (Business License) del país de origen, solicita un video-call en vivo mostrando las líneas de montaje y verifica sus declaraciones de aduana de exportación.
                                </p>
                            </div>
                            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                                <h4 className="font-mono font-bold text-cyan-300 text-sm">2. Muestras Comerciales & Control de Calidad</h4>
                                <p>
                                    Rechaza las muestras de exhibición ("Golden Samples"). Solicita muestras extraídas al azar del flujo estándar. Implementa inspección física de carga antes del pago final usando empresas independientes (SGS / TUV) bajo la norma ISO 2859-1.
                                </p>
                            </div>
                            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                                <h4 className="font-mono font-bold text-cyan-300 text-sm">3. Incoterms & Estructura de Financiación</h4>
                                <p>
                                    No aceptes términos CIF ciegos donde la fábrica controla el flete marítimo y te cobra recargos ocultos en puerto de llegada. Negocia en término FOB y pasa de pagar el 100% por adelantado a esquemas de Pago contra Bill of Lading (B/L) o Cartas de Crédito Irrevocables (L/C).
                                </p>
                            </div>
                            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                                <h4 className="font-mono font-bold text-cyan-300 text-sm">4. Exclusividades & Marcas Blancas (OEM)</h4>
                                <p>
                                    Asegura contratos de exclusividad condicionados a volumen por trimestres. Desarrolla empaques y branding propio (OEM/ODM) con acuerdos NNN (Non-disclosure, Non-use, Non-circumvention) redactados en la jurisdicción legal del país del fabricante.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Locales Block */}
                    <div className="space-y-6 pt-6 border-t border-slate-800">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                                <Building2 size={22} />
                            </div>
                            <h3 className="text-xl font-bold text-white font-mono uppercase">
                                II. Los 5 Pilares Tácticos con Proveedores Locales
                            </h3>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4 text-xs text-slate-300 leading-relaxed font-sans">
                            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                                <span className="text-[10px] font-mono text-amber-400 uppercase font-bold block">PILAR 1</span>
                                <h4 className="font-mono font-bold text-white text-sm">Encontrar Tu Nicho</h4>
                                <p>Micro-sectores con alta demanda y baja competencia directa, enfocados en combos o soluciones integrales que impidan la comparación rápida de precios de remate.</p>
                            </div>
                            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                                <span className="text-[10px] font-mono text-amber-400 uppercase font-bold block">PILAR 2</span>
                                <h4 className="font-mono font-bold text-white text-sm">Identificar a la Competencia</h4>
                                <p>Mapea las fallas operativas de los rivales locales: demoras en entregas, quiebres de stock y deficiente atención digital para tomar su cuota de mercado.</p>
                            </div>
                            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                                <span className="text-[10px] font-mono text-amber-400 uppercase font-bold block">PILAR 3</span>
                                <h4 className="font-mono font-bold text-white text-sm">Identificar Tus Herramientas</h4>
                                <p>Demuéstrale al proveedor que cuentas con tienda e-commerce de alto rendimiento, CRM automatizado y pauta digital masiva para mover su stock acumulado.</p>
                            </div>
                            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                                <span className="text-[10px] font-mono text-amber-400 uppercase font-bold block">PILAR 4</span>
                                <h4 className="font-mono font-bold text-white text-sm">Punto a Favor de Tu Cliente</h4>
                                <p>Usa tus datos del comportamiento de consumo final en tiempo real como moneda de negociación para exigir precios de distribuidor preferencial o consignación.</p>
                            </div>
                            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 md:col-span-2">
                                <span className="text-[10px] font-mono text-amber-400 uppercase font-bold block">PILAR 5</span>
                                <h4 className="font-mono font-bold text-white text-sm">Propuesta Según el Perfil del Proveedor</h4>
                                <p>Adáptate según quien sea: al importador mayorista ofrécele liquidar stock estancado; al fabricante nacional ofrécele empaquetar con tu marca exclusiva y retiro diario con tus guías logísticas.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FORM / CTA SECTION */}
            <section id="registro-form" className="relative z-10 py-16 px-6">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-slate-950 border border-amber-500/40 rounded-3xl p-8 sm:p-12 shadow-[0_0_50px_rgba(245,158,11,0.15)] relative overflow-hidden space-y-8">
                        
                        <div className="text-center space-y-3 relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto">
                                <BookOpen size={24} />
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-black text-white font-mono uppercase tracking-tight">
                                SOLICITA LA GUÍA COMPLETA DE NEGOCIACIÓN
                            </h3>
                            <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto font-sans">
                                Completa el formulario para recibir todo el paquete estratégico e instruccional en tu correo electrónico en menos de 24 horas.
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Nombres y Apellidos *</label>
                                    <input 
                                        type="text" 
                                        required 
                                        value={name} 
                                        onChange={e => setName(e.target.value)} 
                                        placeholder="Ej: Roberto Alarcón"
                                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono transition-all"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Correo Electrónico *</label>
                                    <input 
                                        type="email" 
                                        required 
                                        value={email} 
                                        onChange={e => setEmail(e.target.value)} 
                                        placeholder="ejemplo@empresa.com"
                                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Número de Teléfono / WhatsApp *</label>
                                    <input 
                                        type="tel" 
                                        required 
                                        value={phone} 
                                        onChange={e => setPhone(e.target.value)} 
                                        placeholder="+593 99 123 4567"
                                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono transition-all"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Ciudad de Residencia *</label>
                                    <input 
                                        type="text" 
                                        required 
                                        value={city} 
                                        onChange={e => setCity(e.target.value)} 
                                        placeholder="Quito, Guayaquil, Cuenca..."
                                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono transition-all"
                                    />
                                </div>
                            </div>

                            {errorMsg && (
                                <p className="text-xs font-mono font-bold text-red-400 bg-red-950/60 border border-red-800 p-3.5 rounded-xl text-center">
                                    ⚠️ {errorMsg}
                                </p>
                            )}

                            <button 
                                type="submit" 
                                disabled={submitting}
                                className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 text-slate-950 font-mono font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 hover:scale-[1.01] transition-all shadow-[0_0_25px_rgba(245,158,11,0.3)] disabled:opacity-50 mt-2"
                            >
                                {submitting ? (
                                    <>
                                        <RefreshCw size={16} className="animate-spin" />
                                        <span>Procesando Solicitud...</span>
                                    </>
                                ) : (
                                    <>
                                        <Send size={16} />
                                        <span>Recibir Guía Completa</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* CONFIRMATION MODAL OVERLAY */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg p-8 rounded-3xl bg-slate-900 border border-amber-500/50 shadow-[0_0_60px_rgba(245,158,11,0.25)] space-y-6 text-center"
                        >
                            <button 
                                onClick={() => setShowModal(false)}
                                className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
                            >
                                <X size={18} />
                            </button>

                            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-xl">
                                <CheckCircle2 size={36} />
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-2xl font-black text-white font-mono uppercase">
                                    ¡SOLICITUD CONFIRMADA!
                                </h3>
                                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs sm:text-sm font-sans text-amber-200 leading-relaxed text-left space-y-2">
                                    <p className="font-semibold text-center">
                                        ¡Listo! Te enviaremos todo el material para que puedas hacer tratos únicos con proveedores de tu sector a tu correo electrónico en las próximas 24 horas.
                                    </p>
                                </div>
                            </div>

                            <div className="pt-2 flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={generatePDFGuide}
                                    disabled={pdfLoading}
                                    className="flex-1 py-3 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg"
                                >
                                    <Download size={14} />
                                    <span>{pdfLoading ? "Generando PDF..." : "Descargar PDF Ahora"}</span>
                                </button>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono font-bold text-xs uppercase tracking-wider"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* FOOTER */}
            <footer className="relative z-10 border-t border-slate-900 bg-slate-950 py-8 px-6 text-center text-xs font-mono text-slate-500 space-y-4">
                <p>© 2026 ATOMIC B2B SOLUTIONS · DIRECCIÓN DE NEGOCIACIÓN ESTRATÉGICA</p>
                <div className="flex justify-center gap-6">
                    {socialLinks.instagram && <a href={socialLinks.instagram} target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors"><Instagram size={18} /></a>}
                    {socialLinks.facebook && <a href={socialLinks.facebook} target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors"><Facebook size={18} /></a>}
                    {socialLinks.youtube && <a href={socialLinks.youtube} target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors"><Youtube size={18} /></a>}
                </div>
            </footer>
        </div>
    )
}
