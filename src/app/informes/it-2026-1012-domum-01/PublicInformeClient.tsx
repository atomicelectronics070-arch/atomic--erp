"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    FileText, Download, Printer, CheckCircle2, 
    Share2, MapPin, Calendar, User, Building, HardHat, Camera, 
    Layers, Zap, ShieldCheck, Clock, Award, ExternalLink, Copy
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

    // Botón único de descarga: Descargar Recursos (Ambos PDFs)
    const handleDescargarRecursos = () => {
        showToast("📦 Descargando paquete completo (Informe Técnico + Plan de Precios DITEC)...")
        setTimeout(() => {
            downloadFile("/api/documentos/INFORME_TECNICO_DOMUM_BARRERAS_DITEC_2026.pdf", "INFORME_TECNICO_DOMUM_BARRERAS_DITEC_2026.pdf")
        }, 200)
        setTimeout(() => {
            downloadFile("/api/documentos/PLAN_DE_PROPUESTAS_DITEC.pdf", "PLAN_DE_PROPUESTAS_DITEC.pdf")
        }, 1200)
    }

    // Copiar Enlace Público para Compartir
    const handleCopiarEnlace = () => {
        const url = "https://atomiccotizador.shop/informes/it-2026-1012-domum-01"
        navigator.clipboard.writeText(url).then(() => {
            showToast("🔗 Enlace copiado: " + url)
        }).catch(() => {
            showToast("Enlace: " + url)
        })
    }

    return (
        <div className="min-h-screen bg-white text-slate-900 selection:bg-orange-500 selection:text-white">
            {/* Fail-safe de seguridad visual: Ocultar cualquier bot o widget flotante */}
            <style dangerouslySetInnerHTML={{ __html: `
                .fixed.bottom-28,
                .fixed.bottom-8,
                [title="Abrir Guía de ATOMIC"],
                [title*="Guía"] {
                    display: none !important;
                    visibility: hidden !important;
                    opacity: 0 !important;
                    pointer-events: none !important;
                }
            ` }} />
            {/* Barra superior institucional - Fondo blanco pulcro con acentos tomate */}
            <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-40 shadow-xs">

                <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white font-black text-base shadow-sm">
                            ⚡
                        </div>
                        <div>
                            <span className="font-extrabold text-slate-950 text-base tracking-tight block">
                                ATOMIC<span className="text-orange-600">.AI</span>
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block -mt-1 font-semibold">
                                Automatización & Seguridad Electrónica
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleCopiarEnlace}
                            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
                        >
                            <Share2 size={13} className="text-orange-600" />
                            <span>Compartir Enlace</span>
                        </button>
                        <button
                            onClick={() => window.print()}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
                            title="Imprimir documento"
                        >
                            <Printer size={13} className="text-slate-600" />
                            <span className="hidden sm:inline">Imprimir</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Contenedor Principal */}
            <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
                
                {/* Cabecera del Expediente */}
                <div className="space-y-3 border-b border-slate-200 pb-6">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                        <span className="px-3 py-1 rounded-lg bg-orange-100 border border-orange-200 text-orange-800 font-bold">
                            📋 EXPEDIENTE # IT-2026-1012-DOMUM-01
                        </span>
                        <span className="px-3 py-1 rounded-lg bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                            FACTIBILIDAD: 100% VIABLE CON ADECUACIONES
                        </span>
                        <span className="px-3 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-semibold">
                            Revisión Técnica 2.0
                        </span>
                    </div>

                    <h1 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight leading-tight">
                        Informe Técnico de Inspección en Sitio y Factibilidad Electromecánica
                    </h1>
                    <p className="text-sm sm:text-base text-slate-600 max-w-4xl leading-relaxed">
                        Suministro e Instalación de Sistema de Control de Acceso Vehicular mediante dos (2) Barreras Herméticas DITEC de 3 Metros, 
                        Adecuación de Acometida Eléctrica Independiente desde Tablero Principal de Breakers, 
                        Aprovechamiento de Canalización Subterránea en Adoquines y Bases de Anclaje Estructurales.
                    </p>
                </div>

                {/* Tarjetas de Metadatos del Proyecto (Fondo Blanco / Bordes Suaves) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs">
                        <div className="flex items-center gap-2 text-slate-500 text-xs font-mono uppercase mb-1.5 font-bold">
                            <Building size={14} className="text-orange-600" />
                            Empresa Solicitante
                        </div>
                        <p className="font-extrabold text-slate-950 text-sm">DOMUM CONSTRUCCIONES CIA.LTDA.</p>
                        <p className="text-xs font-mono text-slate-600 mt-1 font-semibold">RUC: 1792917387001</p>
                        <p className="text-xs text-slate-500 mt-1">Calle Antonio de Ulloa y Pedro Bedón, Edif. KAMAY Of. 202, Quito</p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs">
                        <div className="flex items-center gap-2 text-slate-500 text-xs font-mono uppercase mb-1.5 font-bold">
                            <User size={14} className="text-orange-600" />
                            Técnico Responsable
                        </div>
                        <p className="font-extrabold text-slate-950 text-sm">Luis Daniel Cañar Treviño</p>
                        <p className="text-xs text-orange-600 font-mono mt-1 font-bold">Edad: 42 años</p>
                        <p className="text-xs text-slate-500 mt-1">Técnico Especialista a cargo de la inspección electromecánica</p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs">
                        <div className="flex items-center gap-2 text-slate-500 text-xs font-mono uppercase mb-1.5 font-bold">
                            <Calendar size={14} className="text-orange-600" />
                            Visita & Emisión
                        </div>
                        <p className="font-extrabold text-slate-950 text-sm">Viernes, 09 de Octubre 2026</p>
                        <p className="text-xs text-slate-500 mt-1">Hora inspección: ~11:30 hrs</p>
                        <p className="text-xs font-mono text-emerald-700 mt-1 font-bold">Emisión: 12/10/2026</p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs">
                        <div className="flex items-center gap-2 text-slate-500 text-xs font-mono uppercase mb-1.5 font-bold">
                            <MapPin size={14} className="text-orange-600" />
                            Ubicación Evaluada
                        </div>
                        <p className="font-extrabold text-slate-950 text-sm">Acceso Adoquinado Quito</p>
                        <p className="text-xs text-slate-500 mt-1">Rampa de ingreso a subsuelos en obra</p>
                        <a 
                            href="https://maps.app.goo.gl/eh9LfyVfUwEno6uf8" 
                            target="_blank" 
                            rel="noreferrer" 
                            className="text-xs text-orange-600 hover:text-orange-700 hover:underline inline-flex items-center gap-1 mt-1 font-bold"
                        >
                            Ver en Google Maps <ExternalLink size={11} />
                        </a>
                    </div>
                </div>

                {/* ══════════════════════════════════════════════════════════════════
                    BARRA DE ACCIONES: SOLO BOTÓN DE DESCARGAR RECURSOS AMBOS
                ══════════════════════════════════════════════════════════════════ */}
                <div className="p-5 sm:p-6 rounded-2xl bg-orange-50 border border-orange-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-orange-700 block">
                            Descarga Documental
                        </span>
                        <h2 className="text-base sm:text-lg font-black text-slate-950 mt-0.5">
                            Paquete de Documentos del Expediente
                        </h2>
                        <p className="text-xs text-slate-600 mt-0.5">
                            Descarga simultánea del Informe Técnico y el Plan de Propuestas de Referencia.
                        </p>
                    </div>

                    {/* BOTÓN ÚNICO SOLICITADO */}
                    <div className="shrink-0">
                        <button
                            onClick={handleDescargarRecursos}
                            className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider bg-orange-600 hover:bg-orange-700 text-white shadow-md shadow-orange-600/20 transition-all flex items-center justify-center gap-2.5 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <Download size={16} />
                            <span>Descargar Recursos (Ambos PDFs)</span>
                        </button>
                    </div>
                </div>

                {/* ══════════════════════════════════════════════════════════════════
                    VISOR INTEGRADO EN FONDO BLANCO: PESTAÑAS ANEXO 1 Y ANEXO 2
                ══════════════════════════════════════════════════════════════════ */}
                <section className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm">
                    
                    {/* Barra de pestañas - Anexo Informe Técnico / Anexo Plan de Precios */}
                    <div className="p-3 sm:p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 sticky top-16 z-30">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setActiveTab("anexo1")}
                                className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
                                    activeTab === "anexo1"
                                        ? "bg-orange-600 text-white shadow-sm"
                                        : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-200"
                                }`}
                            >
                                <FileText size={15} />
                                <span>Anexo 1: Informe Técnico</span>
                            </button>

                            <button
                                onClick={() => setActiveTab("anexo2")}
                                className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
                                    activeTab === "anexo2"
                                        ? "bg-orange-600 text-white shadow-sm"
                                        : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-200"
                                }`}
                            >
                                <Layers size={15} />
                                <span>Anexo 2: Plan de Precios</span>
                            </button>
                        </div>

                        <div className="text-[11px] font-mono font-bold text-slate-500 hidden md:block">
                            {activeTab === "anexo1" ? "13 Secciones de Factibilidad" : "Matriz de 5 Kits Comerciales DITEC"}
                        </div>
                    </div>

                    {/* Contenido en Fondo Blanco con Texto Negro de Alto Contraste */}
                    <div className="p-6 sm:p-10 space-y-8 bg-white">

                        {/* ──────────────────────────────────────────────────────────
                            PESTAÑA ANEXO 1: INFORME TÉCNICO
                        ────────────────────────────────────────────────────────── */}
                        {activeTab === "anexo1" && (
                            <div className="space-y-8 text-slate-800">
                                
                                {/* Membrete Técnico */}
                                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
                                    <div className="inline-block px-3 py-1 rounded-full bg-orange-100 border border-orange-200 text-orange-800 font-mono text-[10px] uppercase font-bold tracking-widest">
                                        ANEXO 1 | DOCUMENTO DE INGENIERÍA Y FACTIBILIDAD
                                    </div>
                                    <h2 className="text-xl sm:text-2xl font-black text-slate-950 uppercase tracking-wide">
                                        INFORME TÉCNICO DE INSPECCIÓN EN SITIO Y FACTIBILIDAD
                                    </h2>
                                    <p className="text-xs sm:text-sm text-slate-600 max-w-3xl mx-auto">
                                        SUMINISTRO E INSTALACIÓN DE CONTROL VEHICULAR CON BARRERAS HERMÉTICAS DITEC<br />
                                        ADECUACIÓN DE CIRCUITO ELÉCTRICO INDEPENDIENTE, CANALIZACIÓN Y BASES
                                    </p>
                                </div>

                                {/* Tabla de Control */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono">
                                    <div><span className="text-slate-500 block text-[10px] uppercase font-bold">CÓDIGO:</span><strong className="text-slate-950">IT-2026-1012-DOMUM-01</strong></div>
                                    <div><span className="text-slate-500 block text-[10px] uppercase font-bold">FECHA VISITA:</span><strong className="text-slate-950">09/10/2026 (~11:30 AM)</strong></div>
                                    <div><span className="text-slate-500 block text-[10px] uppercase font-bold">TÉCNICO:</span><strong className="text-slate-950">Luis Daniel Cañar Treviño (42 a.)</strong></div>
                                    <div><span className="text-slate-500 block text-[10px] uppercase font-bold">ESTADO:</span><strong className="text-emerald-700">VIABLE CON ADECUACIONES</strong></div>
                                </div>

                                {/* SECCIÓN 1 */}
                                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                                    <h3 className="text-xs font-mono font-black uppercase text-orange-600 tracking-wider flex items-center gap-2">
                                        <Building size={14} /> SECCIÓN 1 | DATOS GENERALES Y ENTORNO DE INSPECCIÓN
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-700">
                                        <div><strong className="text-slate-950">Empresa Solicitante:</strong> DOMUM CONSTRUCCIONES DOMUM-CONS CIA.LTDA.</div>
                                        <div><strong className="text-slate-950">RUC:</strong> 1792917387001</div>
                                        <div><strong className="text-slate-950">Dirección Fiscal:</strong> Rumipamba / Calle Antonio de Ulloa S/N y Pedro Bedón, Edif. KAMAY Of. 202 Mz. E10A, Quito – Ecuador</div>
                                        <div><strong className="text-slate-950">Contactos:</strong> 099 596 3208 / 098 316 0189 | compras@trabahaq.com</div>
                                        <div><strong className="text-slate-950">Técnico a Cargo:</strong> Luis Daniel Cañar Treviño (42 años, Especialista Electromecánico)</div>
                                        <div><strong className="text-slate-950">Ubicación Proyecto:</strong> Acceso Vehicular Adoquinado en Obra Civil (Quito, Ecuador)</div>
                                    </div>
                                </div>

                                {/* SECCIÓN 2 */}
                                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                                    <h3 className="text-xs font-mono font-black uppercase text-orange-600 tracking-wider flex items-center gap-2">
                                        <HardHat size={14} /> SECCIÓN 2 | OBJETO DE LA INSPECCIÓN Y ALCANCE DEL TRABAJO
                                    </h3>
                                    <p className="text-xs text-slate-700 leading-relaxed text-justify">
                                        El presente informe técnico responde al requerimiento formulado por <strong>DOMUM CONSTRUCCIONES DOMUM-CONS CIA.LTDA.</strong> para la evaluación diagnóstica, dimensionamiento de rutas de cableado, selección de punto de alimentación eléctrica y análisis de fijación estructural necesarios para la implementación de un sistema de control de acceso vehicular mediante <strong>dos (2) barreras automáticas de 3 metros marca DITEC</strong>, a situarse en la rampa exterior de adoquín que conecta el nivel exterior con los estacionamientos en subsuelo del edificio en proceso de construcción.
                                    </p>
                                </div>

                                {/* SECCIÓN 3: EL DICTAMEN ELÉCTRICO OBLIGATORIO */}
                                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                                    <h3 className="text-xs font-mono font-black uppercase text-orange-600 tracking-wider flex items-center gap-2">
                                        <Zap size={14} /> SECCIÓN 3 | DIAGNÓSTICO ELÉCTRICO: ACOMETIDA, BREAKER Y SEGURIDAD
                                    </h3>
                                    <p className="text-xs text-slate-700 leading-relaxed text-justify">
                                        Durante el recorrido técnico en el sitio, se constató que la obra cuenta con una acometida eléctrica prevista para la alimentación del <strong>sistema de elevador independiente y sus tomas anexas</strong>. Sin embargo, tras un minucioso análisis de carga, aislamiento de circuitos y normativas eléctricas de seguridad, se concluyó de forma categórica que <strong>no es técnicamente procedente ni recomendable colgar las barreras vehiculares directamente de la línea compartida del elevador</strong>.
                                    </p>
                                    
                                    <div className="p-4 rounded-xl bg-orange-50 border-l-4 border-orange-600 text-slate-800 text-xs space-y-2">
                                        <p className="font-extrabold text-orange-800 text-sm flex items-center gap-2">
                                            ⚡ DICTAMEN TÉCNICO MANDATORIO:
                                        </p>
                                        <p className="leading-relaxed">
                                            La solución óptima y segura consiste en <strong>derivar un breaker independiente exclusivo directamente desde el sistema / tablero principal de breakers</strong>. Esta configuración garantiza que el circuito de las barreras vehiculares opere sin interferir en la red eléctrica normal del edificio ni en el sistema centralizado del elevador, previniendo disparos por sobrecarga, perturbaciones inductivas y cortes de servicio cruzados.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                                            <p className="font-bold text-slate-950 mb-1">1. Independencia del Elevador</p>
                                            <p className="text-slate-600">Evita que maniobras de arranque/freno de barreras provoquen transitorios que afecten la tarjeta controladora del ascensor.</p>
                                        </div>
                                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                                            <p className="font-bold text-slate-950 mb-1">2. Mantenimiento Selectivo</p>
                                            <p className="text-slate-600">Permite desenergizar las barreras para revisiones sin suspender la energía en áreas comunes, elevador ni garita.</p>
                                        </div>
                                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                                            <p className="font-bold text-slate-950 mb-1">3. Protección Calibrada</p>
                                            <p className="text-slate-600">Calibre termomagnético exacto para los motores DITEC de 24V/230V según la curva de arranque de fábrica.</p>
                                        </div>
                                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                                            <p className="font-bold text-slate-950 mb-1">4. Normativa Eléctrica NEC</p>
                                            <p className="text-slate-600">Conformidad con la Norma Ecuatoriana de la Construcción (NEC-SB-IE) para automatismos exteriores.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* SECCIÓN 4: CANALIZACIÓN SUBTERRÁNEA EN ADOQUÍN */}
                                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                                    <h3 className="text-xs font-mono font-black uppercase text-orange-600 tracking-wider flex items-center gap-2">
                                        <Layers size={14} /> SECCIÓN 4 | CANALIZACIÓN, DISTANCIAS Y APROVECHAMIENTO SUBTERRÁNEO
                                    </h3>
                                    
                                    <div className="p-4 rounded-xl bg-slate-50 border-l-4 border-slate-700 text-slate-800 text-xs space-y-2">
                                        <p className="font-bold text-slate-950 text-sm flex items-center gap-2">
                                            🔍 CONSTATACIÓN DE CAMPO (VIDEOS V1, V4, V8):
                                        </p>
                                        <p className="leading-relaxed">
                                            Durante la inspección se verificó la presencia de <strong>mangueras de cableado preexistentes emergiendo del pavimento de adoquín</strong> en el sector central del acceso. Este hallazgo confirma que <strong>ya existe una ruta / canalización subterránea instalada</strong>. Se aprovechará dicho ducto existente para el paso del cableado, <strong>evitando la rotura masiva de adoquines y acelerando los plazos de obra</strong>.
                                        </p>
                                    </div>

                                    <div className="pt-2 text-xs text-slate-700">
                                        <p><strong className="text-slate-950">Manguera Metálica:</strong> Para aquellos tramos vistos fuera del subsuelo (subidas a tablero, cruces entre muros y derivaciones a periféricos), se requerirá obligatoriamente el uso de <strong>manguera metálica flexible tipo Liquid-Tight / Conduit galvanizado pesado</strong>, garantizando blindaje contra humedad, rayos UV, golpes mecánicos y roedores.</p>
                                    </div>
                                </div>

                                {/* SECCIÓN 5: DOS BASES METÁLICAS */}
                                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                                    <h3 className="text-xs font-mono font-black uppercase text-orange-600 tracking-wider flex items-center gap-2">
                                        <ShieldCheck size={14} /> SECCIÓN 5 | FIJACIÓN MECÁNICA: REQUERIMIENTO DE DOS (2) BASES METÁLICAS
                                    </h3>
                                    <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 text-slate-800 text-xs space-y-2">
                                        <p className="font-bold text-orange-900 text-sm flex items-center gap-2">
                                            🏗️ RECOMENDACIÓN ESTRUCTURAL:
                                        </p>
                                        <p className="leading-relaxed">
                                            Debido a que la calzada está conformada por adoquines sobre cama de arena, anclar las barreras únicamente sobre adoquines superficiales provocaría desajustes por vibración ante el torque del mástil. Se prescribe la <strong>fabricación e instalación de dos (2) bases metálicas de anclaje de alta resistencia</strong> con placa de acero de 8 mm y espárragos químicos que alcancen la losa o firme de hormigón subyacente.
                                        </p>
                                    </div>
                                </div>

                                {/* SECCIÓN 6: ARNESES */}
                                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                                    <h3 className="text-xs font-mono font-black uppercase text-orange-600 tracking-wider flex items-center gap-2">
                                        <Layers size={14} /> SECCIÓN 6 | CONFIGURACIÓN DE ARNESES SEGÚN MÉTODO DE VERIFICACIÓN
                                    </h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-xs text-left">
                                            <thead className="bg-slate-100 text-slate-800 font-mono">
                                                <tr>
                                                    <th className="p-2.5">Método de Control</th>
                                                    <th className="p-2.5">Tipo de Arnés y Canalización</th>
                                                    <th className="p-2.5">Ubicación de Fijación</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-200">
                                                <tr>
                                                    <td className="p-2.5 font-bold text-slate-950">Pulsador / Fotoceldas</td>
                                                    <td className="p-2.5 text-slate-700">Arnés de señal apantallado en ducto adosado a muro</td>
                                                    <td className="p-2.5 font-semibold text-slate-800">Paredes laterales de cerramiento</td>
                                                </tr>
                                                <tr>
                                                    <td className="p-2.5 font-bold text-slate-950">Cámaras LPR (Placas)</td>
                                                    <td className="p-2.5 text-slate-700">Cableado estructurado Cat6 exterior + 110V hacia mástil</td>
                                                    <td className="p-2.5 font-semibold text-slate-800">Muro perimetral o poste elevado lateral</td>
                                                </tr>
                                                <tr>
                                                    <td className="p-2.5 font-bold text-slate-950">Antenas RFID (Tags)</td>
                                                    <td className="p-2.5 text-slate-700">Arnés coaxial de alta frecuencia / datos a controlador</td>
                                                    <td className="p-2.5 font-semibold text-slate-800">Pedestales al piso o soportes en pared</td>
                                                </tr>
                                                <tr>
                                                    <td className="p-2.5 font-bold text-slate-950">Tiquetería QR / Cobro</td>
                                                    <td className="p-2.5 text-slate-700">Arnés múltiple de datos, red LAN y fuerza 110V</td>
                                                    <td className="p-2.5 font-bold text-orange-700">Al suelo en tótems vehiculares con base metálica</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* SECCIÓN 7: EQUIPAMIENTO HERMÉTICO DITEC */}
                                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                                    <h3 className="text-xs font-mono font-black uppercase text-orange-600 tracking-wider flex items-center gap-2">
                                        <Award size={14} /> SECCIÓN 7 | CONDICIÓN EXTERIOR: EQUIPAMIENTO DITEC HERMÉTICO CERTIFICADO
                                    </h3>
                                    <p className="text-xs text-slate-700 leading-relaxed text-justify">
                                        Las evidencias confirman la <strong>intemperie total exterior</strong> del emplazamiento. El equipamiento estará expuesto a lluvias directas, polvo, radiación solar y variaciones térmicas. Se dictamina como una <strong>excelente y obligatoria recomendación técnica</strong> la instalación de barreras vehiculares marca <strong>DITEC herméticas certificadas (IP54/IP55)</strong>, con cuerpo de acero tratado contra corrosión, gabinete sellado con empaque de caucho EPDM y cuadro de control encapsulado.
                                    </p>
                                </div>

                                {/* SECCIÓN 8: RESUMEN DE KITS */}
                                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                                    <h3 className="text-xs font-mono font-black uppercase text-orange-600 tracking-wider flex items-center gap-2">
                                        <FileText size={14} /> SECCIÓN 8 | RESUMEN TÉCNICO-ECONÓMICO DE KITS (x2 BARRERAS DITEC 3 METROS)
                                    </h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-xs text-left">
                                            <thead className="bg-slate-100 text-slate-800 font-mono">
                                                <tr>
                                                    <th className="p-2.5">Configuración / Kit</th>
                                                    <th className="p-2.5 text-center">Precio Unit.</th>
                                                    <th className="p-2.5 text-center">Instalación</th>
                                                    <th className="p-2.5 text-center">Total Unit.</th>
                                                    <th className="p-2.5 text-center font-bold text-orange-600">TOTAL (x2 Barreras)</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-200 font-mono">
                                                <tr className="hover:bg-slate-50">
                                                    <td className="p-2.5 font-bold font-sans text-slate-950">KIT 1: Básico + Controles y Fotoceldas</td>
                                                    <td className="p-2.5 text-center">$ 1,988.00</td>
                                                    <td className="p-2.5 text-center">$ 380.00</td>
                                                    <td className="p-2.5 text-center">$ 2,368.00</td>
                                                    <td className="p-2.5 text-center font-black text-slate-950">$ 4,736.00</td>
                                                </tr>
                                                <tr className="hover:bg-slate-50">
                                                    <td className="p-2.5 font-bold font-sans text-slate-950">KIT 2: Lectura de Placas (LPR Alta Velocidad)</td>
                                                    <td className="p-2.5 text-center">$ 4,863.00</td>
                                                    <td className="p-2.5 text-center">$ 465.00</td>
                                                    <td className="p-2.5 text-center">$ 5,328.00</td>
                                                    <td className="p-2.5 text-center font-black text-slate-950">$ 10,656.00</td>
                                                </tr>
                                                <tr className="hover:bg-slate-50">
                                                    <td className="p-2.5 font-bold font-sans text-slate-950">KIT 3: Antenas RFID / Tags UHF Proximidad</td>
                                                    <td className="p-2.5 text-center">$ 2,389.35</td>
                                                    <td className="p-2.5 text-center">$ 655.00</td>
                                                    <td className="p-2.5 text-center">$ 3,044.35</td>
                                                    <td className="p-2.5 text-center font-black text-slate-950">$ 6,088.70</td>
                                                </tr>
                                                <tr className="hover:bg-slate-50">
                                                    <td className="p-2.5 font-bold font-sans text-slate-950">KIT 4: Tiquetería QR para Tarifado / Cobro</td>
                                                    <td className="p-2.5 text-center">$ 5,161.20</td>
                                                    <td className="p-2.5 text-center">$ 765.00</td>
                                                    <td className="p-2.5 text-center">$ 5,926.20</td>
                                                    <td className="p-2.5 text-center font-black text-slate-950">$ 11,852.40</td>
                                                </tr>
                                                <tr className="bg-orange-50 font-bold">
                                                    <td className="p-2.5 font-black font-sans text-orange-900">KIT 5: Integral Mixto Tags + Tickets QR</td>
                                                    <td className="p-2.5 text-center">$ 5,911.20</td>
                                                    <td className="p-2.5 text-center">$ 765.00</td>
                                                    <td className="p-2.5 text-center">$ 6,676.20</td>
                                                    <td className="p-2.5 text-center font-black text-orange-700 text-sm">$ 13,352.40</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* SECCIÓN 9: PLAZOS DE EJECUCIÓN */}
                                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                                    <h3 className="text-xs font-mono font-black uppercase text-orange-600 tracking-wider flex items-center gap-2">
                                        <Clock size={14} /> SECCIÓN 9 | EVALUACIÓN DE DIFICULTAD OPERATIVA Y PLAZOS DE EJECUCIÓN
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                                        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                                            <p className="font-bold text-emerald-800 text-sm mb-1">🟢 Caso Más Favorable</p>
                                            <p className="font-mono text-xl font-black text-slate-950 mb-1">3 Días Hábiles</p>
                                            <p className="text-slate-600">Ruta subterránea 100% permeable sin obstrucciones de escombros, acceso despejado al tablero y clima seco.</p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-orange-50 border border-orange-200">
                                            <p className="font-bold text-orange-800 text-sm mb-1">🟡 Caso Estándar / Complejo</p>
                                            <p className="font-mono text-xl font-black text-slate-950 mb-1">3 a 5 Días Hábiles</p>
                                            <p className="text-slate-600">Dificultad normal de obra civil en edificio activo: ajustes en curvas de manguera metálica y fraguado de bases.</p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
                                            <p className="font-bold text-rose-800 text-sm mb-1">🔴 Caso Desfavorable</p>
                                            <p className="font-mono text-xl font-black text-slate-950 mb-1">5 Días o Más</p>
                                            <p className="text-slate-600">Existencia de retrasos ajenos: obstrucción imprevista en ducto que obligue a sondeo prolongado o lluvias torrenciales.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* SECCIÓN 10: GARANTÍAS Y CERTIFICADOS */}
                                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                                    <h3 className="text-xs font-mono font-black uppercase text-orange-600 tracking-wider flex items-center gap-2">
                                        <ShieldCheck size={14} /> SECCIÓN 10 | GARANTÍAS Y CERTIFICADOS DE CALIDAD
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                                            <p className="font-mono text-2xl font-black text-emerald-700 mb-1">2 AÑOS</p>
                                            <p className="font-bold text-slate-950 mb-1">Garantía Integral de Instalación y Equipos</p>
                                            <p className="text-slate-600">Cubre defectos de fabricación en motorreductores DITEC, centrales de mando, sensores y mano de obra electromecánica.</p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                                            <p className="font-mono text-2xl font-black text-orange-600 mb-1">10 AÑOS</p>
                                            <p className="font-bold text-slate-950 mb-1">Certificado de Validez y Vida Útil del Equipo</p>
                                            <p className="text-slate-600">Certificación formal de durabilidad estimada del chasis y mecánica, con disponibilidad garantizada de repuestos y soporte técnico continuo.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* SECCIÓN 11: FOTOGRAFÍAS REALES DEL SITIO */}
                                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
                                    <h3 className="text-xs font-mono font-black uppercase text-orange-600 tracking-wider flex items-center gap-2">
                                        <Camera size={14} /> SECCIÓN 11 | REGISTRO FOTOGRÁFICO DE CAMPO Y LEVANTAMIENTO TÉCNICO
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
                                            <img src="/documentos/fotos/v1_frame01.jpg" alt="Video V1" className="w-full h-48 object-cover" />
                                            <div className="p-3 bg-white text-xs border-t border-slate-100">
                                                <p className="font-bold text-slate-950">Figura 1.2 (Video V1): Rampa de Adoquines</p>
                                                <p className="text-slate-500 text-[11px] mt-0.5">Vista hacia el subsuelo e intemperie total exterior.</p>
                                            </div>
                                        </div>
                                        <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
                                            <img src="/documentos/fotos/v4_frame01.jpg" alt="Video V4" className="w-full h-48 object-cover" />
                                            <div className="p-3 bg-white text-xs border-t border-slate-100">
                                                <p className="font-bold text-slate-950">Figura 1.3 (Video V4): Manguera Preexistente</p>
                                                <p className="text-slate-500 text-[11px] mt-0.5">Canalización subterránea preexistente emergiendo del pavimento de adoquines.</p>
                                            </div>
                                        </div>
                                        <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
                                            <img src="/documentos/fotos/v8_frame01.jpg" alt="Video V8" className="w-full h-48 object-cover" />
                                            <div className="p-3 bg-white text-xs border-t border-slate-100">
                                                <p className="font-bold text-slate-950">Figura 1.4 (Video V8): Medición Métrica</p>
                                                <p className="text-slate-500 text-[11px] mt-0.5">Levantamiento de distancias y trazado en el pavimento.</p>
                                            </div>
                                        </div>
                                        <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
                                            <img src="/documentos/fotos/v7_frame01.jpg" alt="Video V7" className="w-full h-48 object-cover" />
                                            <div className="p-3 bg-white text-xs border-t border-slate-100">
                                                <p className="font-bold text-slate-950">Figura 1.5 (Video V7): Fachada y Elevador</p>
                                                <p className="text-slate-500 text-[11px] mt-0.5">Estructura del edificio en construcción y elevador independiente adyacente.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* SECCIÓN 12: CONCLUSIONES */}
                                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                                    <h3 className="text-xs font-mono font-black uppercase text-orange-600 tracking-wider flex items-center gap-2">
                                        <CheckCircle2 size={14} /> SECCIÓN 12 | CONCLUSIONES TÉCNICAS Y RECOMENDACIONES
                                    </h3>
                                    <ul className="space-y-2 text-xs text-slate-700">
                                        <li className="flex items-start gap-2">
                                            <span className="text-orange-600 font-bold">1.</span>
                                            <span><strong>Factibilidad Técnica:</strong> El proyecto es plenamente viable electromecánicamente, requiriendo la ejecución de las adecuaciones recomendadas.</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-orange-600 font-bold">2.</span>
                                            <span><strong>Independencia Eléctrica:</strong> La instalación de un breaker independiente en el tablero principal es mandatoria para salvaguardar el sistema del elevador y la red general.</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-orange-600 font-bold">3.</span>
                                            <span><strong>Optimización de Costos:</strong> El aprovechamiento de la ruta subterránea constatada en el piso de adoquín abarata significativamente el rubro de obra civil.</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-orange-600 font-bold">4.</span>
                                            <span><strong>Seguridad Estructural:</strong> La confección de dos bases metálicas ancladas es indispensable para garantizar el asentamiento y aplomo de las barreras DITEC.</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-orange-600 font-bold">5.</span>
                                            <span><strong>Durabilidad a la Intemperie:</strong> Los equipos DITEC herméticos garantizan operación ininterrumpida frente al clima exterior de la capital.</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* SECCIÓN 13: FIRMAS */}
                                <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                                    <h3 className="text-xs font-mono font-black uppercase text-slate-500 tracking-wider mb-8">
                                        SECCIÓN 13 | CONSTANCIA Y FIRMAS DE RESPONSABILIDAD TÉCNICA
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                                        <div>
                                            <div className="w-56 h-0.5 bg-slate-400 mx-auto mb-2.5" />
                                            <p className="font-bold text-slate-950 text-sm">LUIS DANIEL CAÑAR TREVIÑO</p>
                                            <p className="text-xs text-slate-600">Técnico Responsable de Inspección</p>
                                            <p className="text-[11px] text-orange-600 font-mono font-bold">Edad: 42 años | Automatización & Sistemas</p>
                                            <p className="text-[10px] text-slate-500 mt-0.5">Visita: Viernes 09/10/2026 (11:30 AM)</p>
                                        </div>
                                        <div>
                                            <div className="w-56 h-0.5 bg-slate-400 mx-auto mb-2.5" />
                                            <p className="font-bold text-slate-950 text-sm">DOMUM CONSTRUCCIONES</p>
                                            <p className="text-xs text-slate-600">DOMUM-CONS CIA.LTDA.</p>
                                            <p className="text-[11px] text-emerald-700 font-mono font-bold">RUC: 1792917387001</p>
                                            <p className="text-[10px] text-slate-500 mt-0.5">Recepción y Aprobación de Informe</p>
                                        </div>
                                    </div>
                                    <p className="text-[11px] text-slate-500 mt-8 italic">
                                        Informe Técnico emitido para DOMUM CONSTRUCCIONES DOMUM-CONS CIA.LTDA. — ATOMIC Automation & Security Systems, Quito, Ecuador, 2026.
                                    </p>
                                </div>

                            </div>
                        )}

                        {/* ──────────────────────────────────────────────────────────
                            PESTAÑA ANEXO 2: PLAN DE PRECIOS
                        ────────────────────────────────────────────────────────── */}
                        {activeTab === "anexo2" && (
                            <div className="space-y-8 text-slate-800">
                                
                                {/* Membrete Anexo 2 */}
                                <div className="p-6 rounded-2xl bg-orange-50 border border-orange-200 text-center space-y-2">
                                    <div className="inline-block px-3 py-1 rounded-full bg-white border border-orange-300 text-orange-800 font-mono text-[10px] uppercase font-bold tracking-widest">
                                        ANEXO 2 | REFERENCIA COMERCIAL OFICIAL
                                    </div>
                                    <h2 className="text-xl sm:text-2xl font-black text-slate-950 uppercase tracking-wide">
                                        PLAN DE PROPUESTAS COMERCIALES — BARRERAS VEHICULARES DITEC
                                    </h2>
                                    <p className="text-xs sm:text-sm text-slate-600 max-w-3xl mx-auto">
                                        Matriz de Opciones, Costos Unitarios, Mano de Obra y Fotomontajes In Situ (x2 Barreras DITEC de 3 Metros)
                                    </p>
                                </div>

                                {/* Tabla Resumen del Plan Original */}
                                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                                    <h3 className="text-xs font-mono font-black uppercase text-orange-600 tracking-wider">
                                        TABLA MAESTRA DE PRECIOS & SUMINISTRO (DITEC 3 METROS)
                                    </h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-xs text-left">
                                            <thead className="bg-slate-100 text-slate-800 font-mono">
                                                <tr>
                                                    <th className="p-2.5">Configuración / Kit</th>
                                                    <th className="p-2.5">Modelo</th>
                                                    <th className="p-2.5 text-center">Precio Unit.</th>
                                                    <th className="p-2.5 text-center">Instalación</th>
                                                    <th className="p-2.5 text-center font-bold text-slate-950">Total Unit.</th>
                                                    <th className="p-2.5 text-center font-black text-orange-600">x2 Unidades</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-200 font-mono">
                                                <tr className="hover:bg-slate-50">
                                                    <td className="p-2.5 font-bold font-sans text-slate-950">KIT BARRERA BÁSICO + CONTROLES Y FOTOCELDAS</td>
                                                    <td className="p-2.5 text-slate-600">DITEC 3 METROS</td>
                                                    <td className="p-2.5 text-center">$ 1,988.00</td>
                                                    <td className="p-2.5 text-center">$ 380.00</td>
                                                    <td className="p-2.5 text-center font-bold">$ 2,368.00</td>
                                                    <td className="p-2.5 text-center font-black text-slate-950 text-sm">$ 4,736.00</td>
                                                </tr>
                                                <tr className="hover:bg-slate-50">
                                                    <td className="p-2.5 font-bold font-sans text-slate-950">KIT BARRERA PARA PLACAS + CONTROLES Y FOTOCELDAS (LPR)</td>
                                                    <td className="p-2.5 text-slate-600">DITEC 3M + SIST CAM</td>
                                                    <td className="p-2.5 text-center">$ 4,863.00</td>
                                                    <td className="p-2.5 text-center">$ 465.00</td>
                                                    <td className="p-2.5 text-center font-bold">$ 5,328.00</td>
                                                    <td className="p-2.5 text-center font-black text-slate-950 text-sm">$ 10,656.00</td>
                                                </tr>
                                                <tr className="hover:bg-slate-50">
                                                    <td className="p-2.5 font-bold font-sans text-slate-950">KIT BARRERA PARA ANTENAS + CONTROLES Y FOTOCELDAS (RFID)</td>
                                                    <td className="p-2.5 text-slate-600">DITEC 3M + ANTENAS</td>
                                                    <td className="p-2.5 text-center">$ 2,389.35</td>
                                                    <td className="p-2.5 text-center">$ 655.00</td>
                                                    <td className="p-2.5 text-center font-bold">$ 3,044.35</td>
                                                    <td className="p-2.5 text-center font-black text-slate-950 text-sm">$ 6,088.70</td>
                                                </tr>
                                                <tr className="hover:bg-slate-50">
                                                    <td className="p-2.5 font-bold font-sans text-slate-950">KIT BARRERA PARA TICKETS + CONTROL Y FOTOCELDAS (QR)</td>
                                                    <td className="p-2.5 text-slate-600">DITEC 3M + LECTORES</td>
                                                    <td className="p-2.5 text-center">$ 5,161.20</td>
                                                    <td className="p-2.5 text-center">$ 765.00</td>
                                                    <td className="p-2.5 text-center font-bold">$ 5,926.20</td>
                                                    <td className="p-2.5 text-center font-black text-slate-950 text-sm">$ 11,852.40</td>
                                                </tr>
                                                <tr className="bg-orange-50 font-bold">
                                                    <td className="p-2.5 font-black font-sans text-orange-950">KIT BARRERA PARA TAGS Y TICKETS (INTEGRAL MIXTO)</td>
                                                    <td className="p-2.5 text-orange-800">DITEC 3M + LECT + ANT</td>
                                                    <td className="p-2.5 text-center font-bold">$ 5,911.20</td>
                                                    <td className="p-2.5 text-center font-bold">$ 765.00</td>
                                                    <td className="p-2.5 text-center font-bold">$ 6,676.20</td>
                                                    <td className="p-2.5 text-center font-black text-orange-700 text-base">$ 13,352.40</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Detalle Explicativo de los 5 Kits */}
                                <div className="space-y-4">
                                    <h3 className="text-xs font-mono font-black uppercase text-orange-600 tracking-wider">
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
                                                    ? "bg-orange-50 border-orange-300 shadow-xs" 
                                                    : "bg-white border-slate-200 shadow-2xs"
                                            }`}
                                        >
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                                <h4 className="font-bold text-slate-950 text-sm">
                                                    {kit.num}. {kit.title}
                                                </h4>
                                                <span className="font-mono font-black text-sm px-3 py-1 rounded-xl bg-orange-100 border border-orange-200 text-orange-800 shrink-0">
                                                    {kit.price}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-600 leading-relaxed">{kit.desc}</p>
                                            <p className="text-[11px] font-mono font-bold text-orange-700 mt-2">
                                                INCLUYE: {kit.includes}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {/* FOTOMONTAJES REALES SUPOSITORIOS EN SITIO */}
                                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
                                    <h3 className="text-xs font-mono font-black uppercase text-orange-600 tracking-wider">
                                        FOTOMONTAJES SUPOSITORIOS IN SITU — VISUALIZACIÓN EN LA RAMPA ADOQUINADA
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
                                            <img src="/documentos/fotos/photomontage_1.png" alt="Fotomontaje 1" className="w-full h-52 object-cover" />
                                            <div className="p-3 bg-white text-xs text-center border-t border-slate-100">
                                                <p className="font-bold text-slate-950">Fotomontaje 1: Kit Básico DITEC (3 Metros)</p>
                                                <p className="text-slate-500 text-[11px]">Disposición de Barrera 1 (Entrada) y Barrera 2 (Salida) con delimitación sobre adoquines.</p>
                                            </div>
                                        </div>
                                        <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
                                            <img src="/documentos/fotos/photomontage_2.jpeg" alt="Fotomontaje 2" className="w-full h-52 object-cover" />
                                            <div className="p-3 bg-white text-xs text-center border-t border-slate-100">
                                                <p className="font-bold text-slate-950">Fotomontaje 2: Kit Cámaras LPR (Lectura de Placas)</p>
                                                <p className="text-slate-500 text-[11px]">Integración de postes laterales con cámaras LPR de alta velocidad para acceso vehicular.</p>
                                            </div>
                                        </div>
                                        <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
                                            <img src="/documentos/fotos/photomontage_3.jpeg" alt="Fotomontaje 3" className="w-full h-52 object-cover" />
                                            <div className="p-3 bg-white text-xs text-center border-t border-slate-100">
                                                <p className="font-bold text-slate-950">Fotomontaje 3: Kit Antenas RFID / Tags</p>
                                                <p className="text-slate-500 text-[11px]">Antenas lectoras RFID de proximidad UHF para paso expedito de vehículos autorizados.</p>
                                            </div>
                                        </div>
                                        <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
                                            <img src="/documentos/fotos/photomontage_4.jpeg" alt="Fotomontaje 4" className="w-full h-52 object-cover" />
                                            <div className="p-3 bg-white text-xs text-center border-t border-slate-100">
                                                <p className="font-bold text-slate-950">Fotomontaje 4: Kit Tótems QR & Integral Mixto</p>
                                                <p className="text-slate-500 text-[11px]">Tótems vehiculares metálicos de piso con expendedor y lector de tickets QR.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        )}

                    </div>
                </section>

                {/* Footer del Expediente */}
                <footer className="pt-8 border-t border-slate-200 text-center space-y-1.5 text-xs text-slate-500">
                    <p className="font-mono text-slate-700 font-semibold">
                        EXPEDIENTE # IT-2026-1012-DOMUM-01 | DOMUM CONSTRUCCIONES CIA.LTDA.
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
                        className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-slate-900 border border-orange-500/50 shadow-2xl text-xs font-bold text-white flex items-center gap-2"
                    >
                        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                        {toastMessage}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
