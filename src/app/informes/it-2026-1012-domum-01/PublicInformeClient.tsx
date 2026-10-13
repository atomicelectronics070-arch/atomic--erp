"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    FileText, Download, Eye, ExternalLink, Printer, CheckCircle2, 
    Share2, MapPin, Calendar, User, Building, HardHat, Camera, 
    Layers, Zap, ShieldCheck, Clock, Award, Phone, Mail, ChevronRight, Copy
} from "lucide-react"

export default function PublicInformeClient() {
    const [activeTab, setActiveTab] = useState<"anexo1" | "anexo2">("anexo1")
    const [toastMessage, setToastMessage] = useState<string | null>(null)

    const showToast = (msg: string) => {
        setToastMessage(msg)
        setTimeout(() => setToastMessage(null), 3500)
    }

    const downloadFile = (url: string, filename: string) => {
        const a = document.createElement("a")
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
    }

    // Botón 1: Descargar Recursos (Ambos PDFs)
    const handleDescargarRecursos = () => {
        showToast("📦 Descargando paquete oficial (Informe Técnico + Plan de Precios DITEC)...")
        setTimeout(() => {
            downloadFile("/api/documentos/INFORME_TECNICO_DOMUM_BARRERAS_DITEC_2026.pdf", "INFORME_TECNICO_DOMUM_BARRERAS_DITEC_2026.pdf")
        }, 200)
        setTimeout(() => {
            downloadFile("/api/documentos/PLAN_DE_PROPUESTAS_DITEC.pdf", "PLAN_DE_PROPUESTAS_DITEC_REFERENCIA.pdf")
        }, 1200)
    }

    // Botón 3: Descargar PDF Oficial Individual
    const handleDescargarInformeDirecto = () => {
        showToast("📄 Descargando Informe Técnico Oficial en PDF...")
        downloadFile("/api/documentos/INFORME_TECNICO_DOMUM_BARRERAS_DITEC_2026.pdf", "INFORME_TECNICO_DOMUM_BARRERAS_DITEC_2026.pdf")
    }

    // Botón 4: Copiar Enlace Público para Compartir
    const handleCopiarEnlace = () => {
        const url = "https://atomiccotizador.shop/informes/it-2026-1012-domum-01"
        navigator.clipboard.writeText(url).then(() => {
            showToast("🔗 Enlace copiado al portapapeles: " + url)
        }).catch(() => {
            showToast("Enlace: " + url)
        })
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-black">
            {/* Barra superior institucional */}
            <div className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-xl sticky top-0 z-40">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-black text-sm tracking-wider shadow-inner">
                            ⚡
                        </div>
                        <div>
                            <span className="font-extrabold text-white text-base tracking-tight block">
                                ATOMIC<span className="text-cyan-400">.AI</span>
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest block -mt-1">
                                Automatización & Seguridad Electrónica
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleCopiarEnlace}
                            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                        >
                            <Share2 size={13} className="text-cyan-400" />
                            <span>Compartir Enlace</span>
                        </button>
                        <button
                            onClick={() => window.print()}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                        >
                            <Printer size={13} className="text-slate-400" />
                            <span className="hidden sm:inline">Imprimir</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Contenedor Principal */}
            <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
                
                {/* Header del Expediente */}
                <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                        <span className="px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold">
                            📋 EXPEDIENTE OFICIAL # IT-2026-1012-DOMUM-01
                        </span>
                        <span className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            FACTIBILIDAD: 100% VIABLE CON ADECUACIONES
                        </span>
                        <span className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300">
                            Versión 2.0 Final
                        </span>
                    </div>

                    <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                        Informe Técnico de Inspección en Sitio y Factibilidad Electromecánica
                    </h1>
                    <p className="text-sm sm:text-base text-slate-300 max-w-4xl leading-relaxed">
                        Suministro e Instalación de Sistema de Control de Acceso Vehicular mediante dos (2) Barreras Herméticas DITEC de 3 Metros, 
                        Adecuación de Acometida Eléctrica Independiente desde Tablero Principal de Breakers, 
                        Aprovechamiento de Canalización Subterránea y Fijación con Bases Metálicas Estructurales.
                    </p>
                </div>

                {/* Tarjetas de Metadatos del Proyecto */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-mono uppercase mb-2">
                            <Building size={14} className="text-cyan-400" />
                            Empresa Solicitante
                        </div>
                        <p className="font-bold text-white text-sm">DOMUM CONSTRUCCIONES DOMUM-CONS CIA.LTDA.</p>
                        <p className="text-xs font-mono text-slate-400 mt-1">RUC: 1792917387001</p>
                        <p className="text-xs text-slate-400 mt-1">Calle Antonio de Ulloa y Pedro Bedón, Edif. KAMAY Of. 202, Quito</p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-mono uppercase mb-2">
                            <User size={14} className="text-cyan-400" />
                            Técnico Responsable
                        </div>
                        <p className="font-bold text-white text-sm">Luis Daniel Cañar Treviño</p>
                        <p className="text-xs text-cyan-400 font-mono mt-1">Edad: 42 años</p>
                        <p className="text-xs text-slate-400 mt-1">Técnico Especialista a cargo de la inspección electromecánica</p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-mono uppercase mb-2">
                            <Calendar size={14} className="text-cyan-400" />
                            Visita & Emisión
                        </div>
                        <p className="font-bold text-white text-sm">Viernes, 09 de Octubre 2026</p>
                        <p className="text-xs text-slate-400 mt-1">Hora aproximada: 11:30 hrs</p>
                        <p className="text-xs font-mono text-emerald-400 mt-1">Emisión Informe: 12/10/2026</p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-mono uppercase mb-2">
                            <MapPin size={14} className="text-cyan-400" />
                            Ubicación Evaluada
                        </div>
                        <p className="font-bold text-white text-sm">Acceso Adoquinado Quito</p>
                        <p className="text-xs text-slate-400 mt-1">Rampa de ingreso a subsuelos en obra</p>
                        <a 
                            href="https://maps.app.goo.gl/eh9LfyVfUwEno6uf8" 
                            target="_blank" 
                            rel="noreferrer" 
                            className="text-xs text-cyan-400 hover:underline inline-flex items-center gap-1 mt-1.5 font-semibold"
                        >
                            Ver en Google Maps <ExternalLink size={11} />
                        </a>
                    </div>
                </div>

                {/* ══════════════════════════════════════════════════════════════════
                    LOS 3 BOTONES DE ACCIÓN SOLICITADOS (MÁS COPIAR ENLACE)
                ══════════════════════════════════════════════════════════════════ */}
                <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-900 border border-cyan-500/30 shadow-2xl space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-cyan-400 block">
                                Acciones Rápidas & Descargas
                            </span>
                            <h2 className="text-lg font-black text-white mt-0.5">
                                Acceso Inmediato a Documentación Oficial
                            </h2>
                        </div>

                        {/* Botón de Enlace Oficial */}
                        <button
                            onClick={handleCopiarEnlace}
                            className="self-start md:self-auto px-3.5 py-2 rounded-xl text-xs font-mono font-semibold bg-slate-800/80 hover:bg-slate-700 text-cyan-300 border border-cyan-500/20 flex items-center gap-2 transition-all"
                        >
                            <Copy size={13} />
                            <span>atomiccotizador.shop/informes/it-2026-1012-domum-01</span>
                        </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                        {/* BOTÓN 1: Descargar Recursos (Ambos PDFs) */}
                        <button
                            onClick={handleDescargarRecursos}
                            className="px-5 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-[0_0_25px_rgba(16,185,129,0.35)] transition-all flex items-center gap-2.5 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <Download size={16} />
                            <span>Descargar Recursos (Ambos PDFs)</span>
                        </button>

                        {/* BOTÓN 2: Ver Documento Oficial en Línea (Alterna a vista) */}
                        <button
                            onClick={() => {
                                const target = document.getElementById("visor-oficial")
                                if (target) target.scrollIntoView({ behavior: "smooth" })
                                showToast("Visualizando documento oficial en línea...")
                            }}
                            className="px-5 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-[0_0_25px_rgba(59,130,246,0.35)] transition-all flex items-center gap-2.5 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <Eye size={16} />
                            <span>Ver Documento Oficial en Línea</span>
                        </button>

                        {/* BOTÓN 3: Descargar PDF Oficial */}
                        <button
                            onClick={handleDescargarInformeDirecto}
                            className="px-4 py-3.5 rounded-2xl text-xs font-bold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-all flex items-center gap-2"
                        >
                            <FileText size={16} className="text-cyan-400" />
                            <span>Descargar PDF Oficial</span>
                        </button>
                    </div>
                </div>

                {/* ══════════════════════════════════════════════════════════════════
                    VISOR OFICIAL DIVIDIDO CON PESTAÑAS: ANEXO 1 Y ANEXO 2
                ══════════════════════════════════════════════════════════════════ */}
                <section id="visor-oficial" className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
                    
                    {/* Barra de pestañas */}
                    <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 sticky top-16 z-30">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setActiveTab("anexo1")}
                                className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
                                    activeTab === "anexo1"
                                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30"
                                        : "text-slate-400 hover:text-white hover:bg-slate-800/80"
                                }`}
                            >
                                <FileText size={15} />
                                <span>Anexo 1: Informe Técnico Oficial</span>
                            </button>

                            <button
                                onClick={() => setActiveTab("anexo2")}
                                className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
                                    activeTab === "anexo2"
                                        ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-orange-600/30"
                                        : "text-slate-400 hover:text-white hover:bg-slate-800/80"
                                }`}
                            >
                                <Layers size={15} />
                                <span>Anexo 2: Plan de Precios & Propuestas DITEC</span>
                            </button>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-[11px] font-mono text-slate-400 hidden md:inline">
                                {activeTab === "anexo1" ? "13 Secciones Técnicas Oficiales" : "5 Kits de Barreras DITEC"}
                            </span>
                            <button
                                onClick={() => window.print()}
                                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                                title="Imprimir esta sección"
                            >
                                <Printer size={15} />
                            </button>
                        </div>
                    </div>

                    {/* Cuerpo del Visor */}
                    <div className="p-6 sm:p-10 text-slate-200 space-y-8">

                        {/* ──────────────────────────────────────────────────────────
                            PESTAÑA ANEXO 1: INFORME TÉCNICO OFICIAL
                        ────────────────────────────────────────────────────────── */}
                        {activeTab === "anexo1" && (
                            <div className="space-y-8">
                                
                                {/* Membrete Oficial */}
                                <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950 via-slate-900 to-slate-900 border border-blue-600/30 text-center space-y-2">
                                    <div className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 font-mono text-[10px] uppercase font-bold tracking-widest">
                                        DOCUMENTO DE INGENIERÍA & FACTIBILIDAD
                                    </div>
                                    <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wide">
                                        INFORME TÉCNICO DE INSPECCIÓN EN SITIO Y FACTIBILIDAD
                                    </h2>
                                    <p className="text-xs sm:text-sm text-cyan-200">
                                        SUMINISTRO E INSTALACIÓN DE CONTROL VEHICULAR CON BARRERAS HERMÉTICAS DITEC<br />
                                        ADECUACIÓN DE CIRCUITO ELÉCTRICO INDEPENDIENTE, CANALIZACIÓN Y BASES
                                    </p>
                                </div>

                                {/* Tabla de Control del Informe */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-950/70 p-4 rounded-xl border border-slate-800 font-mono">
                                    <div><span className="text-slate-400 block text-[10px]">CÓDIGO:</span><strong>IT-2026-1012-DOMUM-01</strong></div>
                                    <div><span className="text-slate-400 block text-[10px]">FECHA VISITA:</span><strong>09/10/2026 (~11:30 AM)</strong></div>
                                    <div><span className="text-slate-400 block text-[10px]">TÉCNICO:</span><strong>Luis Daniel Cañar Treviño (42 a.)</strong></div>
                                    <div><span className="text-slate-400 block text-[10px]">ESTADO:</span><strong className="text-emerald-400">VIABLE CON ADECUACIONES</strong></div>
                                </div>

                                {/* SECCIÓN 1 */}
                                <div className="p-5 rounded-2xl bg-slate-950/50 border border-slate-800 space-y-3">
                                    <h3 className="text-xs font-mono font-black uppercase text-cyan-400 tracking-wider flex items-center gap-2">
                                        <Building size={14} /> SECCIÓN 1 | DATOS GENERALES Y ENTORNO DE INSPECCIÓN
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300">
                                        <div><strong>Empresa Solicitante:</strong> DOMUM CONSTRUCCIONES DOMUM-CONS CIA.LTDA.</div>
                                        <div><strong>RUC:</strong> 1792917387001</div>
                                        <div><strong>Dirección Fiscal:</strong> Rumipamba / Calle Antonio de Ulloa S/N y Pedro Bedón, Edif. KAMAY Of. 202 Mz. E10A, Quito – Ecuador</div>
                                        <div><strong>Contactos:</strong> 099 596 3208 / 098 316 0189 | compras@trabahaq.com</div>
                                        <div><strong>Técnico a Cargo:</strong> Luis Daniel Cañar Treviño (42 años, Especialista Electromecánico)</div>
                                        <div><strong>Ubicación Proyecto:</strong> Acceso Vehicular Adoquinado en Obra Civil (Quito, Ecuador)</div>
                                    </div>
                                </div>

                                {/* SECCIÓN 2 */}
                                <div className="p-5 rounded-2xl bg-slate-950/50 border border-slate-800 space-y-3">
                                    <h3 className="text-xs font-mono font-black uppercase text-cyan-400 tracking-wider flex items-center gap-2">
                                        <HardHat size={14} /> SECCIÓN 2 | OBJETO DE LA INSPECCIÓN Y ALCANCE DEL TRABAJO
                                    </h3>
                                    <p className="text-xs text-slate-300 leading-relaxed text-justify">
                                        El presente informe técnico responde al requerimiento formulado por <strong>DOMUM CONSTRUCCIONES DOMUM-CONS CIA.LTDA.</strong> para la evaluación diagnóstica, dimensionamiento de rutas de cableado, selección de punto de alimentación eléctrica y análisis de fijación estructural necesarios para la implementación de un sistema de control de acceso vehicular mediante <strong>dos (2) barreras automáticas de 3 metros marca DITEC</strong>, a situarse en la rampa exterior de adoquín que conecta el nivel exterior con los estacionamientos en subsuelo del edificio en proceso de construcción.
                                    </p>
                                </div>

                                {/* SECCIÓN 3: EL PUNTO CRÍTICO DEL ELEVADOR Y BREAKER */}
                                <div className="p-5 rounded-2xl bg-slate-950/50 border border-slate-800 space-y-3">
                                    <h3 className="text-xs font-mono font-black uppercase text-cyan-400 tracking-wider flex items-center gap-2">
                                        <Zap size={14} /> SECCIÓN 3 | DIAGNÓSTICO ELÉCTRICO: ACOMETIDA, BREAKER Y SEGURIDAD
                                    </h3>
                                    <p className="text-xs text-slate-300 leading-relaxed text-justify">
                                        Durante el recorrido técnico en el sitio, se constató que la obra cuenta con una acometida eléctrica prevista para la alimentación del <strong>sistema de elevador independiente y sus tomas anexas</strong>. Sin embargo, tras un minucioso análisis de carga, aislamiento de circuitos y normativas eléctricas de seguridad, se concluyó de forma categórica que <strong>no es técnicamente procedente ni recomendable colgar las barreras vehiculares directamente de la línea compartida del elevador</strong>.
                                    </p>
                                    
                                    <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-200 text-xs space-y-2">
                                        <p className="font-bold flex items-center gap-2 text-emerald-300 text-sm">
                                            ⚡ DICTAMEN TÉCNICO MANDATORIO:
                                        </p>
                                        <p className="leading-relaxed">
                                            La solución óptima y segura consiste en <strong>derivar un breaker independiente exclusivo directamente desde el sistema / tablero principal de breakers</strong>. Esta configuración garantiza que el circuito de las barreras vehiculares opere sin interferir en la red eléctrica normal del edificio ni en el sistema centralizado del elevador, previniendo disparos por sobrecarga, perturbaciones inductivas y cortes de servicio cruzados.
                                        </p>
                                    </div>

                                    {/* Ventajas del aislamiento */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                                            <p className="font-bold text-white mb-1">1. Independencia del Elevador</p>
                                            <p className="text-slate-400">Evita que maniobras de apertura/cierre de barreras provoquen transitorios de voltaje o afecten la placa controladora del elevador.</p>
                                        </div>
                                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                                            <p className="font-bold text-white mb-1">2. Mantenimiento Selectivo</p>
                                            <p className="text-slate-400">Permite desenergizar el sistema vehicular para revisiones sin suspender la energía en áreas comunes, elevador ni estacionamientos.</p>
                                        </div>
                                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                                            <p className="font-bold text-white mb-1">3. Protección Calibrada</p>
                                            <p className="text-slate-400">Calibre de protección exacto para los dos motores Ditec (24V/230V) según curva de arranque del fabricante.</p>
                                        </div>
                                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                                            <p className="font-bold text-white mb-1">4. Normativa NEC</p>
                                            <p className="text-slate-400">Cumplimiento formal con la Norma Ecuatoriana de la Construcción (NEC-SB-IE) para circuitos de automatismos exteriores.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* SECCIÓN 4: CANALIZACIÓN Y ADOQUINES */}
                                <div className="p-5 rounded-2xl bg-slate-950/50 border border-slate-800 space-y-3">
                                    <h3 className="text-xs font-mono font-black uppercase text-cyan-400 tracking-wider flex items-center gap-2">
                                        <Layers size={14} /> SECCIÓN 4 | CANALIZACIÓN, DISTANCIAS Y APROVECHAMIENTO DE RUTA SUBTERRÁNEA
                                    </h3>
                                    
                                    <div className="p-4 rounded-xl bg-cyan-950/50 border border-cyan-500/40 text-cyan-200 text-xs space-y-2">
                                        <p className="font-bold flex items-center gap-2 text-cyan-300 text-sm">
                                            🔍 CONSTATACIÓN CLAVE DE CAMPO (VIDEOS V1, V4, V8):
                                        </p>
                                        <p className="leading-relaxed">
                                            Durante la inspección se verificó la presencia de <strong>mangueras de cableado existentes emergiendo del pavimento de adoquín</strong> en el sector central del acceso. Este hallazgo confirma que <strong>ya existe una ruta / canalización subterránea instalada</strong>. En consecuencia, se determinará el aprovechamiento de este ducto existente para el paso del cableado, <strong>evitando la rotura masiva de adoquines y acelerando los plazos de obra</strong>.
                                        </p>
                                    </div>

                                    <div className="pt-2 text-xs text-slate-300 space-y-1">
                                        <p><strong>Especificación de Manguera Metálica:</strong> Para aquellos tramos que discurran fuera del subsuelo (subidas a tablero, cruces entre muros y derivaciones a periféricos), se requerirá imperativamente el uso de <strong>manguera metálica flexible tipo Liquid-Tight / Conduit metálico galvanizado</strong>. Este material evita aplastamientos mecánicos, protege contra humedad exterior, radiación UV y acción de roedores.</p>
                                    </div>
                                </div>

                                {/* SECCIÓN 5: DOS BASES METÁLICAS */}
                                <div className="p-5 rounded-2xl bg-slate-950/50 border border-slate-800 space-y-3">
                                    <h3 className="text-xs font-mono font-black uppercase text-cyan-400 tracking-wider flex items-center gap-2">
                                        <ShieldCheck size={14} /> SECCIÓN 5 | FIJACIÓN MECÁNICA: REQUERIMIENTO DE DOS (2) BASES METÁLICAS
                                    </h3>
                                    <div className="p-4 rounded-xl bg-amber-950/50 border border-amber-500/40 text-amber-200 text-xs space-y-2">
                                        <p className="font-bold flex items-center gap-2 text-amber-300 text-sm">
                                            🏗️ RECOMENDACIÓN ESTRUCTURAL OBLIGATORIA:
                                        </p>
                                        <p className="leading-relaxed">
                                            El soporte de cada barrera vehicular DITEC de 3 metros debe resistir no solo el peso propio del gabinete y mástil, sino también las fuerzas dinámicas de torsión, aceleración, frenado e impacto de ráfagas de viento. Dado que la calzada está conformada por adoquines sobre cama de arena, anclar las barreras únicamente sobre adoquines provocaría desajustes. Por ello, se prescribe la <strong>fabricación e instalación de dos (2) bases metálicas de anclaje de alta resistencia</strong> con placa de acero de 8 mm y espárragos químicos que alcancen la losa o firme de hormigón subyacente.
                                        </p>
                                    </div>
                                </div>

                                {/* SECCIÓN 6: ARNESES SEGÚN MÉTODO */}
                                <div className="p-5 rounded-2xl bg-slate-950/50 border border-slate-800 space-y-3">
                                    <h3 className="text-xs font-mono font-black uppercase text-cyan-400 tracking-wider flex items-center gap-2">
                                        <Layers size={14} /> SECCIÓN 6 | CONFIGURACIÓN DE ARNESES SEGÚN MÉTODO DE VERIFICACIÓN
                                    </h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-xs text-left">
                                            <thead className="bg-slate-800 text-slate-300 font-mono">
                                                <tr>
                                                    <th className="p-2.5">Método de Control</th>
                                                    <th className="p-2.5">Tipo de Arnés y Canalización</th>
                                                    <th className="p-2.5">Ubicación de Fijación</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-800">
                                                <tr>
                                                    <td className="p-2.5 font-bold">Pulsador / Fotoceldas</td>
                                                    <td className="p-2.5 text-slate-300">Arnés de señal apantallado en ducto adosado a muro</td>
                                                    <td className="p-2.5 text-cyan-400">Paredes laterales de cerramiento</td>
                                                </tr>
                                                <tr>
                                                    <td className="p-2.5 font-bold">Cámaras LPR (Placas)</td>
                                                    <td className="p-2.5 text-slate-300">Cableado estructurado Cat6 exterior + 110V hacia mástil</td>
                                                    <td className="p-2.5 text-cyan-400">Muro perimetral o poste elevado lateral</td>
                                                </tr>
                                                <tr>
                                                    <td className="p-2.5 font-bold">Antenas RFID (Tags)</td>
                                                    <td className="p-2.5 text-slate-300">Arnés coaxial de alta frecuencia / datos a controlador</td>
                                                    <td className="p-2.5 text-cyan-400">Pedestales al piso o soportes en pared</td>
                                                </tr>
                                                <tr>
                                                    <td className="p-2.5 font-bold">Tiquetería QR / Cobro</td>
                                                    <td className="p-2.5 text-slate-300">Arnés múltiple de datos, red LAN y fuerza de 110V para impresora y lector</td>
                                                    <td className="p-2.5 text-emerald-400 font-bold">Al suelo en tótems vehiculares con base metálica</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* SECCIÓN 7: EQUIPOS DITEC HERMÉTICOS */}
                                <div className="p-5 rounded-2xl bg-slate-950/50 border border-slate-800 space-y-3">
                                    <h3 className="text-xs font-mono font-black uppercase text-cyan-400 tracking-wider flex items-center gap-2">
                                        <Award size={14} /> SECCIÓN 7 | CONDICIÓN EXTERIOR: EQUIPAMIENTO DITEC HERMÉTICO CERTIFICADO
                                    </h3>
                                    <p className="text-xs text-slate-300 leading-relaxed text-justify">
                                        Las evidencias de video (V1, V7, V9) confirman sin ambigüedad la <strong>presencia exterior total</strong> de la zona de instalación. El equipamiento estará expuesto a lluvias directas, polvo, radiación solar constante y variaciones de temperatura propias del clima de Quito. Se valida como una <strong>excelente y obligatoria recomendación técnica</strong> la colocación de barreras vehiculares marca <strong>DITEC de fabricación hermética (IP54/IP55)</strong>, con cuerpo de acero tratado contra corrosión, gabinete sellado con empaque de caucho EPDM, cuadro de control encapsulado y microinterruptores protegidos contra humedad.
                                    </p>
                                </div>

                                {/* SECCIÓN 8: RESUMEN DE KITS */}
                                <div className="p-5 rounded-2xl bg-slate-950/50 border border-slate-800 space-y-3">
                                    <h3 className="text-xs font-mono font-black uppercase text-cyan-400 tracking-wider flex items-center gap-2">
                                        <FileText size={14} /> SECCIÓN 8 | RESUMEN TÉCNICO-ECONÓMICO DE KITS (x2 BARRERAS DITEC 3 METROS)
                                    </h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-xs text-left">
                                            <thead className="bg-slate-800 text-slate-300 font-mono">
                                                <tr>
                                                    <th className="p-2.5">Configuración / Kit</th>
                                                    <th className="p-2.5 text-center">Precio Unit.</th>
                                                    <th className="p-2.5 text-center">Instalación</th>
                                                    <th className="p-2.5 text-center">Total Unit.</th>
                                                    <th className="p-2.5 text-center font-bold text-cyan-400">TOTAL (x2 Barreras)</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-800 font-mono">
                                                <tr>
                                                    <td className="p-2.5 font-bold font-sans">KIT 1: Básico + Controles y Fotoceldas</td>
                                                    <td className="p-2.5 text-center">$ 1,988.00</td>
                                                    <td className="p-2.5 text-center">$ 380.00</td>
                                                    <td className="p-2.5 text-center">$ 2,368.00</td>
                                                    <td className="p-2.5 text-center font-bold text-emerald-400">$ 4,736.00</td>
                                                </tr>
                                                <tr>
                                                    <td className="p-2.5 font-bold font-sans">KIT 2: Lectura de Placas (LPR Alta Velocidad)</td>
                                                    <td className="p-2.5 text-center">$ 4,863.00</td>
                                                    <td className="p-2.5 text-center">$ 465.00</td>
                                                    <td className="p-2.5 text-center">$ 5,328.00</td>
                                                    <td className="p-2.5 text-center font-bold text-emerald-400">$ 10,656.00</td>
                                                </tr>
                                                <tr>
                                                    <td className="p-2.5 font-bold font-sans">KIT 3: Antenas RFID / Tags UHF Proximidad</td>
                                                    <td className="p-2.5 text-center">$ 2,389.35</td>
                                                    <td className="p-2.5 text-center">$ 655.00</td>
                                                    <td className="p-2.5 text-center">$ 3,044.35</td>
                                                    <td className="p-2.5 text-center font-bold text-emerald-400">$ 6,088.70</td>
                                                </tr>
                                                <tr>
                                                    <td className="p-2.5 font-bold font-sans">KIT 4: Tiquetería QR para Tarifado / Cobro</td>
                                                    <td className="p-2.5 text-center">$ 5,161.20</td>
                                                    <td className="p-2.5 text-center">$ 765.00</td>
                                                    <td className="p-2.5 text-center">$ 5,926.20</td>
                                                    <td className="p-2.5 text-center font-bold text-emerald-400">$ 11,852.40</td>
                                                </tr>
                                                <tr className="bg-blue-950/40">
                                                    <td className="p-2.5 font-black font-sans text-cyan-300">KIT 5: Integral Mixto Tags + Tickets QR</td>
                                                    <td className="p-2.5 text-center font-bold">$ 5,911.20</td>
                                                    <td className="p-2.5 text-center font-bold">$ 765.00</td>
                                                    <td className="p-2.5 text-center font-bold">$ 6,676.20</td>
                                                    <td className="p-2.5 text-center font-black text-cyan-300 text-sm">$ 13,352.40</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* SECCIÓN 9: PLAZOS DE EJECUCIÓN */}
                                <div className="p-5 rounded-2xl bg-slate-950/50 border border-slate-800 space-y-3">
                                    <h3 className="text-xs font-mono font-black uppercase text-cyan-400 tracking-wider flex items-center gap-2">
                                        <Clock size={14} /> SECCIÓN 9 | EVALUACIÓN DE DIFICULTAD OPERATIVA Y PLAZOS DE EJECUCIÓN
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                                        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
                                            <p className="font-bold text-emerald-300 text-sm mb-1">🟢 Caso Más Favorable</p>
                                            <p className="font-mono text-xl font-black text-white mb-2">3 Días Hábiles</p>
                                            <p className="text-slate-400">Ruta subterránea 100% permeable sin obstrucciones de escombros, acceso despejado al tablero principal y clima seco para montaje de bases.</p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30">
                                            <p className="font-bold text-cyan-300 text-sm mb-1">🟡 Caso Estándar / Complejo</p>
                                            <p className="font-mono text-xl font-black text-white mb-2">3 a 5 Días Hábiles</p>
                                            <p className="text-slate-400">Dificultad normal de obra civil en edificio activo: ajustes en curvas de manguera metálica, calibración de fotoceldas y fraguado de pernos de bases.</p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/30">
                                            <p className="font-bold text-rose-300 text-sm mb-1">🔴 Caso Desfavorable</p>
                                            <p className="font-mono text-xl font-black text-white mb-2">5 Días o Más</p>
                                            <p className="text-slate-400">Existencia de atrasos ajenos: obstrucción imprevista en ducto subterráneo que obligue a sondeo prolongado, lluvias intensas o demoras de permisos.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* SECCIÓN 10: GARANTÍAS Y CERTIFICADOS */}
                                <div className="p-5 rounded-2xl bg-slate-950/50 border border-slate-800 space-y-3">
                                    <h3 className="text-xs font-mono font-black uppercase text-cyan-400 tracking-wider flex items-center gap-2">
                                        <ShieldCheck size={14} /> SECCIÓN 10 | GARANTÍAS Y CERTIFICADOS DE CALIDAD
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                                        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                                            <p className="font-mono text-2xl font-black text-emerald-400 mb-1">2 AÑOS</p>
                                            <p className="font-bold text-white mb-1">Garantía Integral de Instalación y Equipos</p>
                                            <p className="text-slate-400">Cubre desperfectos de fabricación en motorreductores DITEC, centrales de mando, sensores y mano de obra electromecánica.</p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                                            <p className="font-mono text-2xl font-black text-amber-400 mb-1">10 AÑOS</p>
                                            <p className="font-bold text-white mb-1">Certificado de Validez y Vida Útil del Equipo</p>
                                            <p className="text-slate-400">Certificación formal de durabilidad estimada del chasis y mecánica, con disponibilidad garantizada de repuestos y soporte técnico continuo.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* SECCIÓN 11: FOTOGRAFÍAS REALES DEL SITIO */}
                                <div className="p-5 rounded-2xl bg-slate-950/50 border border-slate-800 space-y-4">
                                    <h3 className="text-xs font-mono font-black uppercase text-cyan-400 tracking-wider flex items-center gap-2">
                                        <Camera size={14} /> SECCIÓN 11 | REGISTRO FOTOGRÁFICO DE CAMPO Y LEVANTAMIENTO TÉCNICO
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
                                            <img src="/documentos/fotos/v1_frame01.jpg" alt="Video V1" className="w-full h-48 object-cover" />
                                            <div className="p-3 bg-slate-900/90 text-xs">
                                                <p className="font-bold text-white">Figura 1.2 (Video V1): Rampa de Adoquines</p>
                                                <p className="text-slate-400 text-[11px] mt-0.5">Vista hacia el subsuelo y confirmación de intemperie total exterior.</p>
                                            </div>
                                        </div>
                                        <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
                                            <img src="/documentos/fotos/v4_frame01.jpg" alt="Video V4" className="w-full h-48 object-cover" />
                                            <div className="p-3 bg-slate-900/90 text-xs">
                                                <p className="font-bold text-white">Figura 1.3 (Video V4): Manguera Preexistente</p>
                                                <p className="text-slate-400 text-[11px] mt-0.5">Canalización subterránea preexistente emergiendo del pavimento de adoquines.</p>
                                            </div>
                                        </div>
                                        <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
                                            <img src="/documentos/fotos/v8_frame01.jpg" alt="Video V8" className="w-full h-48 object-cover" />
                                            <div className="p-3 bg-slate-900/90 text-xs">
                                                <p className="font-bold text-white">Figura 1.4 (Video V8): Medición Métrica</p>
                                                <p className="text-slate-400 text-[11px] mt-0.5">Levantamiento de distancias y curvaturas en el pavimento.</p>
                                            </div>
                                        </div>
                                        <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
                                            <img src="/documentos/fotos/v7_frame01.jpg" alt="Video V7" className="w-full h-48 object-cover" />
                                            <div className="p-3 bg-slate-900/90 text-xs">
                                                <p className="font-bold text-white">Figura 1.5 (Video V7): Fachada y Elevador</p>
                                                <p className="text-slate-400 text-[11px] mt-0.5">Estructura del edificio en construcción y elevador independiente adyacente.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* SECCIÓN 12: CONCLUSIONES */}
                                <div className="p-5 rounded-2xl bg-slate-950/50 border border-slate-800 space-y-3">
                                    <h3 className="text-xs font-mono font-black uppercase text-cyan-400 tracking-wider flex items-center gap-2">
                                        <CheckCircle2 size={14} /> SECCIÓN 12 | CONCLUSIONES TÉCNICAS Y RECOMENDACIONES
                                    </h3>
                                    <ul className="space-y-2 text-xs text-slate-300">
                                        <li className="flex items-start gap-2">
                                            <span className="text-cyan-400 font-bold">1.</span>
                                            <span><strong>Factibilidad Técnica:</strong> El proyecto es plenamente viable electromecánicamente, requiriendo la ejecución de las adecuaciones recomendadas.</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-cyan-400 font-bold">2.</span>
                                            <span><strong>Independencia Eléctrica:</strong> La instalación de un breaker independiente en el tablero principal es mandatoria para salvaguardar el sistema del elevador y la red general.</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-cyan-400 font-bold">3.</span>
                                            <span><strong>Optimización de Costos:</strong> El aprovechamiento de la ruta subterránea constatada en el piso de adoquín abarata significativamente el rubro de obra civil.</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-cyan-400 font-bold">4.</span>
                                            <span><strong>Seguridad Estructural:</strong> La confección de dos bases metálicas ancladas es indispensable para garantizar el asentamiento y aplomo de las barreras DITEC.</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-cyan-400 font-bold">5.</span>
                                            <span><strong>Durabilidad a la Intemperie:</strong> Los equipos DITEC herméticos garantizan operación ininterrumpida frente al clima exterior de la capital.</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* SECCIÓN 13: FIRMAS */}
                                <div className="p-8 rounded-2xl bg-slate-950/70 border border-slate-800 text-center">
                                    <h3 className="text-xs font-mono font-black uppercase text-slate-400 tracking-wider mb-8">
                                        SECCIÓN 13 | CONSTANCIA Y FIRMAS DE RESPONSABILIDAD TÉCNICA
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                                        <div>
                                            <div className="w-56 h-0.5 bg-slate-700 mx-auto mb-2.5" />
                                            <p className="font-bold text-white text-sm">LUIS DANIEL CAÑAR TREVIÑO</p>
                                            <p className="text-xs text-slate-400">Técnico Responsable de Inspección</p>
                                            <p className="text-[11px] text-cyan-400 font-mono">Edad: 42 años | Automatización & Sistemas</p>
                                            <p className="text-[10px] text-slate-400 mt-0.5">Visita: Viernes 09/10/2026 (11:30 AM)</p>
                                        </div>
                                        <div>
                                            <div className="w-56 h-0.5 bg-slate-700 mx-auto mb-2.5" />
                                            <p className="font-bold text-white text-sm">DOMUM CONSTRUCCIONES</p>
                                            <p className="text-xs text-slate-400">DOMUM-CONS CIA.LTDA.</p>
                                            <p className="text-[11px] text-emerald-400 font-mono">RUC: 1792917387001</p>
                                            <p className="text-[10px] text-slate-400 mt-0.5">Recepción y Aprobación de Informe</p>
                                        </div>
                                    </div>
                                    <p className="text-[11px] text-slate-400 mt-8 italic">
                                        Informe Técnico Oficial emitido para DOMUM CONSTRUCCIONES DOMUM-CONS CIA.LTDA. — Quito, Ecuador, 2026.
                                    </p>
                                </div>

                            </div>
                        )}

                        {/* ──────────────────────────────────────────────────────────
                            PESTAÑA ANEXO 2: PLAN DE PRECIOS Y PROPUESTAS DITEC
                        ────────────────────────────────────────────────────────── */}
                        {activeTab === "anexo2" && (
                            <div className="space-y-8">
                                
                                {/* Membrete Anexo 2 */}
                                <div className="p-6 rounded-2xl bg-gradient-to-r from-orange-950 via-slate-900 to-slate-900 border border-orange-600/30 text-center space-y-2">
                                    <div className="inline-block px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-300 font-mono text-[10px] uppercase font-bold tracking-widest">
                                        DOCUMENTO DE REFERENCIA OFICIAL COMERCIAL
                                    </div>
                                    <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wide">
                                        PLAN DE PROPUESTAS COMERCIALES — BARRERAS VEHICULARES DITEC
                                    </h2>
                                    <p className="text-xs sm:text-sm text-orange-200">
                                        Matriz de Opciones, Costos Unitarios, Mano de Obra y Fotomontajes In Situ (x2 Barreras DITEC de 3 Metros)
                                    </p>
                                </div>

                                {/* Tabla Resumen del Plan Original */}
                                <div className="p-5 rounded-2xl bg-slate-950/50 border border-slate-800 space-y-3">
                                    <h3 className="text-xs font-mono font-black uppercase text-orange-400 tracking-wider">
                                        TABLA MAESTRA DE PRECIOS & SUMINISTRO (DITEC 3 METROS)
                                    </h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-xs text-left">
                                            <thead className="bg-slate-800 text-slate-300 font-mono">
                                                <tr>
                                                    <th className="p-2.5">Configuración / Kit</th>
                                                    <th className="p-2.5">Modelo</th>
                                                    <th className="p-2.5 text-center">Precio Unit.</th>
                                                    <th className="p-2.5 text-center">Instalación</th>
                                                    <th className="p-2.5 text-center font-bold text-white">Total Unit.</th>
                                                    <th className="p-2.5 text-center font-black text-orange-400">x2 Unidades</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-800 font-mono">
                                                <tr>
                                                    <td className="p-2.5 font-bold font-sans">KIT BARRERA BÁSICO + CONTROLES Y FOTOCELDAS</td>
                                                    <td className="p-2.5 text-slate-400">DITEC 3 METROS</td>
                                                    <td className="p-2.5 text-center">$ 1,988.00</td>
                                                    <td className="p-2.5 text-center">$ 380.00</td>
                                                    <td className="p-2.5 text-center font-bold">$ 2,368.00</td>
                                                    <td className="p-2.5 text-center font-black text-emerald-400 text-sm">$ 4,736.00</td>
                                                </tr>
                                                <tr>
                                                    <td className="p-2.5 font-bold font-sans">KIT BARRERA PARA PLACAS + CONTROLES Y FOTOCELDAS (LPR)</td>
                                                    <td className="p-2.5 text-slate-400">DITEC 3M + SIST CAM</td>
                                                    <td className="p-2.5 text-center">$ 4,863.00</td>
                                                    <td className="p-2.5 text-center">$ 465.00</td>
                                                    <td className="p-2.5 text-center font-bold">$ 5,328.00</td>
                                                    <td className="p-2.5 text-center font-black text-emerald-400 text-sm">$ 10,656.00</td>
                                                </tr>
                                                <tr>
                                                    <td className="p-2.5 font-bold font-sans">KIT BARRERA PARA ANTENAS + CONTROLES Y FOTOCELDAS (RFID)</td>
                                                    <td className="p-2.5 text-slate-400">DITEC 3M + ANTENAS</td>
                                                    <td className="p-2.5 text-center">$ 2,389.35</td>
                                                    <td className="p-2.5 text-center">$ 655.00</td>
                                                    <td className="p-2.5 text-center font-bold">$ 3,044.35</td>
                                                    <td className="p-2.5 text-center font-black text-emerald-400 text-sm">$ 6,088.70</td>
                                                </tr>
                                                <tr>
                                                    <td className="p-2.5 font-bold font-sans">KIT BARRERA PARA TICKETS + CONTROL Y FOTOCELDAS (QR)</td>
                                                    <td className="p-2.5 text-slate-400">DITEC 3M + LECTORES</td>
                                                    <td className="p-2.5 text-center">$ 5,161.20</td>
                                                    <td className="p-2.5 text-center">$ 765.00</td>
                                                    <td className="p-2.5 text-center font-bold">$ 5,926.20</td>
                                                    <td className="p-2.5 text-center font-black text-emerald-400 text-sm">$ 11,852.40</td>
                                                </tr>
                                                <tr className="bg-orange-950/30">
                                                    <td className="p-2.5 font-black font-sans text-orange-300">KIT BARRERA PARA TAGS Y TICKETS (INTEGRAL MIXTO)</td>
                                                    <td className="p-2.5 text-orange-200">DITEC 3M + LECT + ANT</td>
                                                    <td className="p-2.5 text-center font-bold">$ 5,911.20</td>
                                                    <td className="p-2.5 text-center font-bold">$ 765.00</td>
                                                    <td className="p-2.5 text-center font-bold">$ 6,676.20</td>
                                                    <td className="p-2.5 text-center font-black text-orange-300 text-base">$ 13,352.40</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Detalle Explicativo de los 5 Kits */}
                                <div className="space-y-4">
                                    <h3 className="text-xs font-mono font-black uppercase text-orange-400 tracking-wider">
                                        DETALLE DEL ALCANCE DE CADA CONFIGURACIÓN
                                    </h3>

                                    {[
                                        {
                                            num: "1",
                                            title: "KIT BARRERA BÁSICO + CONTROLES Y FOTOCELDAS (DITEC 3 METROS)",
                                            price: "$ 4,736.00 USD (x2 Barreras)",
                                            desc: "Este es el kit más simple que se podría conjugar para este tipo de proyectos. Se integran las dos barreras DITEC de 3 metros, dos pequeñas antenas anti-cierre de emergencia para cuando alguien se cruce por las barreras, dos pulsadores de apertura y cierre para ubicar en garita, y dos controles de obsequio por parte de la marca.",
                                            includes: "Barrera DITEC | 2 Controles Gratis | Juego de Fotoceldas | Antenas Anti-Cierre | Pulsadores"
                                        },
                                        {
                                            num: "2",
                                            title: "KIT BARRERA PARA PLACAS + CONTROLES Y FOTOCELDAS (LPR ALTA VELOCIDAD)",
                                            price: "$ 10,656.00 USD (x2 Barreras)",
                                            desc: "Diseñado para cámaras especializadas preparadas para leer placas vehiculares a alta velocidad y alto tráfico. Incluye el juego completo de barreras DITEC, controles, fotoceldas, dos cámaras lectoras de placas sobre postes laterales, servidor de gestión y monitor para visualización de garita.",
                                            includes: "Barrera DITEC | 2 Controles Gratis | Juego de Fotoceldas | 2 Cámaras Lectoras de Placas | Monitor de Gestión | Software"
                                        },
                                        {
                                            num: "3",
                                            title: "KIT BARRERA PARA ANTENAS + CONTROLES Y FOTOCELDAS (RFID TAGS VEHICULARES)",
                                            price: "$ 6,088.70 USD (x2 Barreras)",
                                            desc: "El kit solicitado inicialmente. Permite la lectura de stickers/tags en los parabrisas de vehículos autorizados a través de antenas de largo alcance conectadas a la computadora. Gestiona entradas y salidas de usuarios conocidos, residentes y visitantes recurrentes.",
                                            includes: "Barrera DITEC | 2 Controles Gratis | Juego de Fotoceldas | 2 Antenas RFID UHF | Stickers / Tags | Software de Gestión"
                                        },
                                        {
                                            num: "4",
                                            title: "KIT BARRERA PARA TICKETS + CONTROL Y FOTOCELDAS (TIQUETERÍA QR Y TARIFADO)",
                                            price: "$ 11,852.40 USD (x2 Barreras)",
                                            desc: "Ideal para control con tarifado por horas y validación de visitas. Cuenta con dos impresoras automáticas de tickets con código QR, dos lectores ópticos QR, software de tarifado y dos bases metálicas tipo tótem vehicular ancladas al suelo.",
                                            includes: "Barrera DITEC | 2 Controles Gratis | Fotoceldas | 2 Lectores de Tickets QR | 2 Impresoras | Sistema de Gestión | 2 Tótems Metálicos"
                                        },
                                        {
                                            num: "5",
                                            title: "KIT INTEGRAL MIXTO: TAGS Y TICKETS (SOLUCIÓN TOTAL PRO)",
                                            price: "$ 13,352.40 USD (x2 Barreras)",
                                            desc: "La solución más completa y versátil: combina antenas RFID para residentes permanentes con expedición de tickets QR para visitantes temporales en tótems vehiculares metálicos de piso.",
                                            includes: "Barrera DITEC | 2 Controles | Fotoceldas | 2 Lectores QR | 2 Impresoras | 2 Antenas RFID | 2 Tótems | Software Completo",
                                            highlight: true
                                        }
                                    ].map((kit, idx) => (
                                        <div 
                                            key={idx} 
                                            className={`p-5 rounded-2xl border transition-all ${
                                                kit.highlight 
                                                    ? "bg-orange-950/20 border-orange-500/50 shadow-xl" 
                                                    : "bg-slate-950/60 border-slate-800"
                                            }`}
                                        >
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                                <h4 className="font-bold text-white text-sm">
                                                    {kit.num}. {kit.title}
                                                </h4>
                                                <span className="font-mono font-black text-sm px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shrink-0">
                                                    {kit.price}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-300 leading-relaxed">{kit.desc}</p>
                                            <p className="text-[11px] font-mono font-bold text-cyan-400 mt-2">
                                                INCLUYE: {kit.includes}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {/* FOTOMONTAJES REALES SUPOSITORIOS EN SITIO */}
                                <div className="p-5 rounded-2xl bg-slate-950/50 border border-slate-800 space-y-4">
                                    <h3 className="text-xs font-mono font-black uppercase text-orange-400 tracking-wider">
                                        FOTOMONTAJES SUPOSITORIOS IN SITU — VISUALIZACIÓN EN LA RAMPA ADOQUINADA
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="rounded-2xl overflow-hidden border border-orange-500/30 bg-slate-950">
                                            <img src="/documentos/fotos/photomontage_1.png" alt="Fotomontaje 1" className="w-full h-52 object-cover" />
                                            <div className="p-3 bg-slate-900/90 text-xs text-center border-t border-slate-800">
                                                <p className="font-bold text-orange-300">Fotomontaje 1: Kit Básico DITEC (3 Metros)</p>
                                                <p className="text-slate-400 text-[11px]">Disposición de Barrera 1 (Entrada) y Barrera 2 (Salida) con delimitación sobre adoquines.</p>
                                            </div>
                                        </div>
                                        <div className="rounded-2xl overflow-hidden border border-orange-500/30 bg-slate-950">
                                            <img src="/documentos/fotos/photomontage_2.jpeg" alt="Fotomontaje 2" className="w-full h-52 object-cover" />
                                            <div className="p-3 bg-slate-900/90 text-xs text-center border-t border-slate-800">
                                                <p className="font-bold text-orange-300">Fotomontaje 2: Kit Cámaras LPR (Lectura de Placas)</p>
                                                <p className="text-slate-400 text-[11px]">Integración de postes laterales con cámaras LPR de alta velocidad para acceso vehicular.</p>
                                            </div>
                                        </div>
                                        <div className="rounded-2xl overflow-hidden border border-orange-500/30 bg-slate-950">
                                            <img src="/documentos/fotos/photomontage_3.jpeg" alt="Fotomontaje 3" className="w-full h-52 object-cover" />
                                            <div className="p-3 bg-slate-900/90 text-xs text-center border-t border-slate-800">
                                                <p className="font-bold text-orange-300">Fotomontaje 3: Kit Antenas RFID / Tags</p>
                                                <p className="text-slate-400 text-[11px]">Antenas lectoras RFID de proximidad UHF para paso expedito de vehículos autorizados.</p>
                                            </div>
                                        </div>
                                        <div className="rounded-2xl overflow-hidden border border-orange-500/30 bg-slate-950">
                                            <img src="/documentos/fotos/photomontage_4.jpeg" alt="Fotomontaje 4" className="w-full h-52 object-cover" />
                                            <div className="p-3 bg-slate-900/90 text-xs text-center border-t border-slate-800">
                                                <p className="font-bold text-orange-300">Fotomontaje 4: Kit Tótems QR & Integral Mixto</p>
                                                <p className="text-slate-400 text-[11px]">Tótems vehiculares metálicos de piso con expendedor y lector de tickets QR.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        )}

                    </div>
                </section>

                {/* Footer del Expediente */}
                <footer className="pt-8 border-t border-slate-800/80 text-center space-y-2 text-xs text-slate-400">
                    <p className="font-mono text-slate-300">
                        EXPEDIENTE OFICIAL # IT-2026-1012-DOMUM-01 | DOMUM CONSTRUCCIONES CIA.LTDA.
                    </p>
                    <p>
                        Plataforma de Operaciones & Automatización ATOMIC — Quito, Ecuador. Todos los derechos reservados 2026.
                    </p>
                </footer>

            </main>

            {/* Toast flotante */}
            <AnimatePresence>
                {toastMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-slate-900 border border-cyan-500/50 shadow-2xl text-xs font-bold text-white flex items-center gap-2"
                    >
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                        {toastMessage}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
