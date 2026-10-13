"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    FileText, Download, Eye, ExternalLink, Printer, X, 
    ShieldCheck, Zap, AlertTriangle, CheckCircle2, MapPin, 
    Calendar, User, Building, HardHat, Camera, Layers, ArrowRight
} from "lucide-react"

export default function InformesClient() {
    const [viewerOpen, setViewerOpen] = useState(false)
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
        showToast("📦 Descargando paquete de recursos (Informe Oficial + Plan de Precios)...")
        setTimeout(() => {
            downloadFile("/documentos/INFORME_TECNICO_DOMUM_BARRERAS_DITEC_2026.pdf", "INFORME_TECNICO_DOMUM_BARRERAS_DITEC_2026.pdf")
        }, 300)
        setTimeout(() => {
            downloadFile("/documentos/PLAN_DE_PROPUESTAS_DITEC.pdf", "PLAN_DE_PROPUESTAS_REFERENCIA_DITEC.pdf")
        }, 1200)
    }

    // Botón 2: Ver Documento Oficial en Línea
    const handleVerEnLinea = () => {
        setViewerOpen(true)
    }

    // Botón 3: Descargar PDF Oficial
    const handleDescargarInformeDirecto = () => {
        showToast("📄 Descargando Informe Técnico Oficial en PDF...")
        downloadFile("/documentos/INFORME_TECNICO_DOMUM_BARRERAS_DITEC_2026.pdf", "INFORME_TECNICO_DOMUM_BARRERAS_DITEC_2026.pdf")
    }

    return (
        <div className="min-h-screen pb-24 text-slate-100">
            {/* Header del Módulo */}
            <header className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest mb-1.5">
                            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                            Módulo de Informes Técnicos de Obra
                        </div>
                        <h1 className="text-3xl font-black text-white tracking-tight">
                            Informes Técnicos & Expedientes Oficiales
                        </h1>
                        <p className="text-sm text-slate-400 mt-1">
                            Diagnóstico de campo, factibilidad electromecánica y archivo documental con visor oficial en línea.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                            1 Expediente Vigente
                        </span>
                    </div>
                </div>
            </header>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
                    <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">Código Oficial</p>
                    <p className="text-xl font-black text-white mt-1">IT-2026-1012-DOMUM-01</p>
                    <p className="text-xs text-cyan-400 mt-1">Acceso Adoquinado Quito</p>
                </div>
                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
                    <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">Estado de Factibilidad</p>
                    <p className="text-xl font-black text-emerald-400 mt-1">100% Viable</p>
                    <p className="text-xs text-slate-400 mt-1">Adecuaciones eléctricas aprobadas</p>
                </div>
                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
                    <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">Recursos Disponibles</p>
                    <p className="text-xl font-black text-white mt-1">2 Documentos</p>
                    <p className="text-xs text-slate-400 mt-1">Informe Técnico + Plan de Precios</p>
                </div>
                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
                    <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">Garantía / Certificación</p>
                    <p className="text-xl font-black text-amber-400 mt-1">2 / 10 Años</p>
                    <p className="text-xs text-slate-400 mt-1">Respaldo total de fábrica DITEC</p>
                </div>
            </div>

            {/* Tarjeta Principal del Expediente */}
            <article className="rounded-3xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-2xl backdrop-blur-xl">
                {/* Cabecera de la tarjeta */}
                <div className="p-6 md:p-8 bg-gradient-to-r from-blue-950/60 via-slate-900 to-slate-900 border-b border-slate-800">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="space-y-2 max-w-4xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-mono font-bold bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                                📋 EXPEDIENTE # IT-2026-1012-DOMUM-01
                            </div>
                            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                                Informe Técnico de Inspección en Sitio y Factibilidad — Barreras Vehiculares DITEC
                            </h2>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                Suministro e Instalación de Control de Acceso Vehicular con Barreras Herméticas DITEC de 3 Metros, 
                                Adecuación de Acometida Eléctrica Independiente desde Tablero Principal, Canalización Subterránea en Adoquines y Bases de Anclaje.
                            </p>
                        </div>

                        <div className="shrink-0">
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                VIABLE CON RECOMENDACIONES
                            </span>
                        </div>
                    </div>
                </div>

                {/* Cuerpo de la tarjeta: Metadatos */}
                <div className="p-6 md:p-8 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 rounded-2xl bg-slate-950/50 border border-slate-800/80">
                        <div>
                            <p className="text-[10px] font-mono font-bold uppercase text-slate-400">Empresa Solicitante</p>
                            <p className="text-sm font-bold text-white mt-0.5">DOMUM CONSTRUCCIONES CIA.LTDA.</p>
                            <p className="text-[11px] font-mono text-slate-400">RUC: 1792917387001</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-mono font-bold uppercase text-slate-400">Técnico Responsable</p>
                            <p className="text-sm font-bold text-white mt-0.5">Luis Daniel Cañar Treviño</p>
                            <p className="text-[11px] text-cyan-400 font-mono">Edad: 42 años | A cargo de inspección</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-mono font-bold uppercase text-slate-400">Fecha y Hora de Inspección</p>
                            <p className="text-sm font-bold text-white mt-0.5">Viernes 09/10/2026 — 11:30 AM</p>
                            <p className="text-[11px] text-slate-400">Revisión en Obra Civil</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-mono font-bold uppercase text-slate-400">Ubicación Inspeccionada</p>
                            <p className="text-sm font-bold text-white mt-0.5">Acceso Adoquinado (Quito)</p>
                            <a 
                                href="https://maps.app.goo.gl/eh9LfyVfUwEno6uf8" 
                                target="_blank" 
                                rel="noreferrer" 
                                className="text-[11px] text-cyan-400 hover:underline inline-flex items-center gap-1 mt-0.5"
                            >
                                Ver GPS Google Maps <ExternalLink size={11} />
                            </a>
                        </div>
                    </div>

                    {/* Tags técnicos */}
                    <div className="flex flex-wrap gap-2">
                        {[
                            "⚡ Breaker Independiente Tablero Principal",
                            "🔍 Aprovechamiento Ducto Subterráneo en Adoquín",
                            "🏗️ Fabricación de 2 Bases Metálicas de Anclaje",
                            "🛡️ Equipos DITEC Herméticos IP54/IP55 para Intemperie",
                            "⏱️ Tiempo de Obra: 3 a 5 Días Hábiles",
                            "📜 2 Años Garantía / 10 Años Certificado DITEC"
                        ].map((tag, i) => (
                            <span key={i} className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800/80 border border-slate-700/80 text-slate-300">
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* ══════════════════════════════════════════════════════════
                        LOS 3 BOTONES DE ACCIÓN SOLICITADOS POR EL USUARIO
                    ══════════════════════════════════════════════════════════ */}
                    <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-3">
                            {/* BOTÓN 1: Descargar Recursos (Descarga ambos PDFs) */}
                            <button
                                onClick={handleDescargarRecursos}
                                className="px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <Download size={16} />
                                <span>Descargar Recursos (Ambos PDFs)</span>
                            </button>

                            {/* BOTÓN 2: Ver Documento Oficial en Línea (Abre visor con Anexo 1 y Anexo 2) */}
                            <button
                                onClick={handleVerEnLinea}
                                className="px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <Eye size={16} />
                                <span>Ver Documento Oficial en Línea</span>
                            </button>
                        </div>

                        <div>
                            {/* BOTÓN 3: Descargar PDF Oficial */}
                            <button
                                onClick={handleDescargarInformeDirecto}
                                className="px-4 py-3 rounded-2xl text-xs font-bold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-all flex items-center gap-2"
                            >
                                <FileText size={16} className="text-cyan-400" />
                                <span>Descargar PDF Oficial</span>
                            </button>
                        </div>
                    </div>
                </div>
            </article>

            {/* ══════════════════════════════════════════════════════════
                VISOR OFICIAL EN LÍNEA: MODAL CON PESTAÑAS ANEXO 1 Y ANEXO 2
            ══════════════════════════════════════════════════════════ */}
            <AnimatePresence>
                {viewerOpen && (
                    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md p-3 sm:p-6 flex items-start justify-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-5xl bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl my-6"
                        >
                            {/* Barra de herramientas del visor con PESTAÑAS */}
                            <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-20">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setActiveTab("anexo1")}
                                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
                                            activeTab === "anexo1"
                                                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                                                : "text-slate-400 hover:text-white hover:bg-slate-800"
                                        }`}
                                    >
                                        <FileText size={15} />
                                        <span>Anexo 1: Informe Técnico Oficial</span>
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("anexo2")}
                                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
                                            activeTab === "anexo2"
                                                ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg"
                                                : "text-slate-400 hover:text-white hover:bg-slate-800"
                                        }`}
                                    >
                                        <Layers size={15} />
                                        <span>Anexo 2: Plan de Precios y Propuestas DITEC</span>
                                    </button>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => window.print()}
                                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                                        title="Imprimir / Guardar en PDF"
                                    >
                                        <Printer size={16} />
                                    </button>
                                    <button
                                        onClick={handleDescargarRecursos}
                                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400"
                                        title="Descargar Recursos"
                                    >
                                        <Download size={16} />
                                    </button>
                                    <button
                                        onClick={() => setViewerOpen(false)}
                                        className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white transition-colors"
                                        title="Cerrar Visor"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Contenido del visor */}
                            <div className="p-6 sm:p-10 bg-slate-950/70 text-slate-200 space-y-8 max-h-[80vh] overflow-y-auto">
                                
                                {/* ══════════════════════════════════════════════════
                                    PESTAÑA ANEXO 1: INFORME TÉCNICO OFICIAL
                                ══════════════════════════════════════════════════ */}
                                {activeTab === "anexo1" && (
                                    <div className="space-y-6">
                                        {/* Banner de Cabecera Oficial */}
                                        <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900 to-slate-900 border border-blue-700/50 text-center space-y-2">
                                            <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wide">
                                                INFORME TÉCNICO DE INSPECCIÓN EN SITIO Y FACTIBILIDAD
                                            </h3>
                                            <p className="text-xs sm:text-sm text-cyan-200">
                                                SUMINISTRO E INSTALACIÓN DE CONTROL VEHICULAR CON BARRERAS HERMÉTICAS DITEC<br />
                                                ADECUACIÓN DE CIRCUITO ELÉCTRICO INDEPENDIENTE, CANALIZACIÓN Y BASES
                                            </p>
                                        </div>

                                        {/* Metadata Table */}
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-900 p-4 rounded-xl border border-slate-800">
                                            <div><span className="text-slate-400 block font-mono">CÓDIGO:</span><strong>IT-2026-1012-DOMUM-01</strong></div>
                                            <div><span className="text-slate-400 block font-mono">FECHA VISITA:</span><strong>09/10/2026 (11:30 AM)</strong></div>
                                            <div><span className="text-slate-400 block font-mono">TÉCNICO:</span><strong>Luis Daniel Cañar Treviño (42 años)</strong></div>
                                            <div><span className="text-slate-400 block font-mono">ESTADO:</span><strong className="text-emerald-400">VIABLE CON RECOMENDACIONES</strong></div>
                                        </div>

                                        {/* Secciones del Informe */}
                                        <div className="space-y-6 text-sm">
                                            
                                            {/* Sección 1 */}
                                            <div className="border border-slate-800 rounded-2xl p-5 bg-slate-900/40 space-y-3">
                                                <h4 className="text-xs font-mono font-black uppercase text-cyan-400 tracking-wider">
                                                    SECCIÓN 1 | DATOS GENERALES Y ENTORNO DE INSPECCIÓN
                                                </h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300">
                                                    <div><strong>Solicitante:</strong> DOMUM CONSTRUCCIONES CIA.LTDA. (RUC: 1792917387001)</div>
                                                    <div><strong>Dirección:</strong> Edif. KAMAY Of. 202, Rumipamba / Calle Ulloa, Quito</div>
                                                    <div><strong>Contactos:</strong> 099 596 3208 / 098 316 0189 | compras@trabahaq.com</div>
                                                    <div><strong>Ubicación Obra:</strong> Acceso Adoquinado Quito</div>
                                                </div>
                                            </div>

                                            {/* Sección 2 */}
                                            <div className="border border-slate-800 rounded-2xl p-5 bg-slate-900/40 space-y-3">
                                                <h4 className="text-xs font-mono font-black uppercase text-cyan-400 tracking-wider">
                                                    SECCIÓN 2 | OBJETO DE LA INSPECCIÓN Y ALCANCE
                                                </h4>
                                                <p className="text-xs text-slate-300 leading-relaxed text-justify">
                                                    Evaluación diagnóstica, dimensionamiento de rutas de cableado, selección de punto de alimentación eléctrica y análisis de fijación estructural para la implementación de <strong>dos (2) barreras automáticas de 3 metros marca DITEC</strong> en rampa exterior de adoquín hacia subsuelos del edificio en construcción.
                                                </p>
                                            </div>

                                            {/* Sección 3 */}
                                            <div className="border border-slate-800 rounded-2xl p-5 bg-slate-900/40 space-y-3">
                                                <h4 className="text-xs font-mono font-black uppercase text-cyan-400 tracking-wider">
                                                    SECCIÓN 3 | DIAGNÓSTICO ELÉCTRICO: ACOMETIDA Y BREAKER INDEPENDIENTE
                                                </h4>
                                                <p className="text-xs text-slate-300 leading-relaxed text-justify">
                                                    Se constató acometida prevista para elevador independiente. Tras el análisis, se determinó categóricamente que <strong>no es técnicamente procedente colgar las barreras de la línea compartida del elevador</strong>.
                                                </p>
                                                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs">
                                                    <strong>DICTAMEN TÉCNICO OBLIGATORIO:</strong> Derivar un <strong>breaker independiente exclusivo directamente desde el tablero principal de breakers</strong>. Garantiza independencia total de la red del elevador y áreas comunes, previniendo perturbaciones y caídas de servicio.
                                                </div>
                                            </div>

                                            {/* Sección 4 */}
                                            <div className="border border-slate-800 rounded-2xl p-5 bg-slate-900/40 space-y-3">
                                                <h4 className="text-xs font-mono font-black uppercase text-cyan-400 tracking-wider">
                                                    SECCIÓN 4 | CANALIZACIÓN Y APROVECHAMIENTO DE RUTA EXISTENTE
                                                </h4>
                                                <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-cyan-200 text-xs">
                                                    <strong>CONSTATACIÓN CLAVE DE CAMPO (VIDEOS V1, V4, V8):</strong> Se verificó la presencia de <strong>mangueras de cableado existentes emergiendo del pavimento de adoquín</strong>. Ya existe una ruta / canalización subterránea instalada. Se aprovechará este ducto para evitar la rotura masiva de adoquines y acortar plazos. Para tramos aéreos se usará manguera metálica flexible <strong>Liquid-Tight</strong>.
                                                </div>
                                            </div>

                                            {/* Sección 5 */}
                                            <div className="border border-slate-800 rounded-2xl p-5 bg-slate-900/40 space-y-3">
                                                <h4 className="text-xs font-mono font-black uppercase text-cyan-400 tracking-wider">
                                                    SECCIÓN 5 | FIJACIÓN MECÁNICA: DOS (2) BASES METÁLICAS DE ANCLAJE
                                                </h4>
                                                <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs">
                                                    <strong>RECOMENDACIÓN ESTRUCTURAL:</strong> Fabricar e instalar <strong>dos (2) bases metálicas de anclaje de alta resistencia</strong> con placa de acero de 8 mm y espárragos químicos que alcancen el firme de hormigón subyacente. No fijar directamente a adoquines flotantes.
                                                </div>
                                            </div>

                                            {/* Sección 7 */}
                                            <div className="border border-slate-800 rounded-2xl p-5 bg-slate-900/40 space-y-3">
                                                <h4 className="text-xs font-mono font-black uppercase text-cyan-400 tracking-wider">
                                                    SECCIÓN 7 | CONDICIÓN EXTERIOR: EQUIPAMIENTO DITEC HERMÉTICO CERTIFICADO
                                                </h4>
                                                <p className="text-xs text-slate-300 leading-relaxed text-justify">
                                                    Debido a la intemperie total, lluvia y polvo, se ratifica la selección de barreras marca <strong>DITEC herméticas certificadas IP54/IP55</strong>, con gabinete de acero tratado y empaques EPDM.
                                                </p>
                                            </div>

                                            {/* Sección 8: Matriz Económica */}
                                            <div className="border border-slate-800 rounded-2xl p-5 bg-slate-900/40 space-y-3">
                                                <h4 className="text-xs font-mono font-black uppercase text-cyan-400 tracking-wider">
                                                    SECCIÓN 8 | RESUMEN TÉCNICO-ECONÓMICO DE KITS (x2 BARRERAS DITEC)
                                                </h4>
                                                <div className="overflow-x-auto">
                                                    <table className="w-full text-xs text-left">
                                                        <thead className="bg-slate-800 text-slate-300 font-mono">
                                                            <tr>
                                                                <th className="p-2.5">Configuración / Kit</th>
                                                                <th className="p-2.5 text-center">Unitario</th>
                                                                <th className="p-2.5 text-center">Instalación</th>
                                                                <th className="p-2.5 text-center font-bold text-cyan-400">Total (x2 Barreras)</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-slate-800 font-mono">
                                                            <tr><td className="p-2.5">KIT 1: Básico + Controles y Fotoceldas</td><td className="p-2.5 text-center">$ 1,988.00</td><td className="p-2.5 text-center">$ 380.00</td><td className="p-2.5 text-center font-bold text-emerald-400">$ 4,736.00</td></tr>
                                                            <tr><td className="p-2.5">KIT 2: Lectura de Placas (LPR)</td><td className="p-2.5 text-center">$ 4,863.00</td><td className="p-2.5 text-center">$ 465.00</td><td className="p-2.5 text-center font-bold text-emerald-400">$ 10,656.00</td></tr>
                                                            <tr><td className="p-2.5">KIT 3: Antenas RFID / Tags</td><td className="p-2.5 text-center">$ 2,389.35</td><td className="p-2.5 text-center">$ 655.00</td><td className="p-2.5 text-center font-bold text-emerald-400">$ 6,088.70</td></tr>
                                                            <tr><td className="p-2.5">KIT 4: Tiquetería QR para Cobro</td><td className="p-2.5 text-center">$ 5,161.20</td><td className="p-2.5 text-center">$ 765.00</td><td className="p-2.5 text-center font-bold text-emerald-400">$ 11,852.40</td></tr>
                                                            <tr className="bg-blue-950/30"><td className="p-2.5 font-bold">KIT 5: Solución Integral Mixta (Tags + QR)</td><td className="p-2.5 text-center">$ 5,911.20</td><td className="p-2.5 text-center">$ 765.00</td><td className="p-2.5 text-center font-bold text-cyan-300">$ 13,352.40</td></tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>

                                            {/* Galería Fotográfica de Campo */}
                                            <div className="border border-slate-800 rounded-2xl p-5 bg-slate-900/40 space-y-3">
                                                <h4 className="text-xs font-mono font-black uppercase text-cyan-400 tracking-wider">
                                                    SECCIÓN 11 | REGISTRO FOTOGRÁFICO DE CAMPO
                                                </h4>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                                                        <img src="/documentos/fotos/v1_frame01.jpg" alt="Video V1" className="w-full h-44 object-cover" />
                                                        <p className="p-2.5 text-[11px] text-slate-400 italic">Figura 1.2: Rampa de adoquines hacia subsuelo e intemperie total.</p>
                                                    </div>
                                                    <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                                                        <img src="/documentos/fotos/v4_frame01.jpg" alt="Video V4" className="w-full h-44 object-cover" />
                                                        <p className="p-2.5 text-[11px] text-slate-400 italic">Figura 1.3: Manguera de cableado preexistente emergiendo de adoquines.</p>
                                                    </div>
                                                    <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                                                        <img src="/documentos/fotos/v8_frame01.jpg" alt="Video V8" className="w-full h-44 object-cover" />
                                                        <p className="p-2.5 text-[11px] text-slate-400 italic">Figura 1.4: Medición métrica de distancia desde canalización existente.</p>
                                                    </div>
                                                    <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                                                        <img src="/documentos/fotos/v7_frame01.jpg" alt="Video V7" className="w-full h-44 object-cover" />
                                                        <p className="p-2.5 text-[11px] text-slate-400 italic">Figura 1.5: Fachada del edificio en obra y elevador exterior.</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Firmas de Responsabilidad */}
                                            <div className="border border-slate-800 rounded-2xl p-6 bg-slate-900/40 text-center">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
                                                    <div>
                                                        <div className="w-48 h-0.5 bg-slate-700 mx-auto mb-2" />
                                                        <p className="font-bold text-white text-xs">LUIS DANIEL CAÑAR TREVIÑO</p>
                                                        <p className="text-[11px] text-slate-400">Técnico Responsable (42 años)</p>
                                                        <p className="text-[10px] text-cyan-400 font-mono">Automatización & Sistemas</p>
                                                    </div>
                                                    <div>
                                                        <div className="w-48 h-0.5 bg-slate-700 mx-auto mb-2" />
                                                        <p className="font-bold text-white text-xs">DOMUM CONSTRUCCIONES CIA.LTDA.</p>
                                                        <p className="text-[11px] text-slate-400">RUC: 1792917387001</p>
                                                        <p className="text-[10px] text-emerald-400 font-mono">Recepción & Aprobación</p>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                )}

                                {/* ══════════════════════════════════════════════════
                                    PESTAÑA ANEXO 2: PLAN DE PRECIOS Y PROPUESTAS DITEC
                                ══════════════════════════════════════════════════ */}
                                {activeTab === "anexo2" && (
                                    <div className="space-y-6">
                                        <div className="p-6 rounded-2xl bg-gradient-to-r from-orange-950 to-slate-900 border border-orange-700/50 text-center space-y-2">
                                            <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wide">
                                                PLAN DE PROPUESTAS COMERCIALES — BARRERAS VEHICULARES DITEC
                                            </h3>
                                            <p className="text-xs sm:text-sm text-orange-200">
                                                Documento de Referencia Oficial de Precios, Suministro e Instalación (x2 Unidades de 3 Metros)
                                            </p>
                                        </div>

                                        {/* Detalle de los 5 Kits */}
                                        <div className="space-y-4">
                                            {[
                                                {
                                                    num: "1",
                                                    title: "KIT BARRERA BÁSICO + CONTROLES Y FOTOCELDAS",
                                                    total: "$ 4,736.00",
                                                    desc: "El kit más simple: dos barreras DITEC de 3 metros, dos pequeñas antenas anti-cierre de emergencia, dos pulsadores de apertura/cierre en garita y dos controles de obsequio de la marca.",
                                                    includes: "Barrera DITEC | 2 Controles Gratis | Juego Fotoceldas | Antenas anti-cierre | Pulsadores"
                                                },
                                                {
                                                    num: "2",
                                                    title: "KIT BARRERA PARA PLACAS + CONTROLES Y FOTOCELDAS (LPR)",
                                                    total: "$ 10,656.00",
                                                    desc: "Usual para cámaras especializadas para leer placas a alta velocidad y alto tráfico. Incluye juego de 2 cámaras lectoras de placas, monitor y sistema de gestión en computadora.",
                                                    includes: "Barrera DITEC | 2 Controles | Fotoceldas | 2 Cámaras LPR | Monitor | Software"
                                                },
                                                {
                                                    num: "3",
                                                    title: "KIT BARRERA PARA ANTENAS + CONTROLES Y FOTOCELDAS (RFID TAGS)",
                                                    total: "$ 6,088.70",
                                                    desc: "Kit solicitado al inicio. Dos antenas lectoras de largo alcance para stickers/tags que permiten administración de vehículos conocidos, recurrentes o permanentes a través de software.",
                                                    includes: "Barrera DITEC | 2 Controles | Fotoceldas | 2 Antenas RFID | Stickers/Tags | Software"
                                                },
                                                {
                                                    num: "4",
                                                    title: "KIT BARRERA PARA TICKETS + CONTROL Y FOTOCELDAS (TIQUETERÍA QR)",
                                                    total: "$ 11,852.40",
                                                    desc: "Sistema de tiquetería con expedición automática de tickets impresos con código QR, lectura automática y tarifado por horas para cobro de estacionamientos.",
                                                    includes: "Barrera DITEC | 2 Controles | Fotoceldas | 2 Lectores QR | 2 Impresoras | Gestión | 2 Tótems"
                                                },
                                                {
                                                    num: "5",
                                                    title: "KIT BARRERA PARA TAGS Y TICKETS (SOLUCIÓN INTEGRAL MIXTA)",
                                                    total: "$ 13,352.40",
                                                    desc: "Solución integral que combina lectura de tags RFID para residentes con tiquetería QR para visitantes temporales. Máxima versatilidad operativa.",
                                                    includes: "Barrera DITEC | 2 Controles | Fotoceldas | 2 Lectores QR | 2 Impresoras | 2 Antenas RFID | 2 Tótems | Software",
                                                    highlight: true
                                                }
                                            ].map((kit, i) => (
                                                <div 
                                                    key={i} 
                                                    className={`p-5 rounded-2xl border transition-all ${
                                                        kit.highlight 
                                                            ? "bg-orange-950/20 border-orange-500/50 shadow-lg" 
                                                            : "bg-slate-900/60 border-slate-800"
                                                    }`}
                                                >
                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                                        <h4 className="font-bold text-white text-sm">
                                                            {kit.num}. {kit.title}
                                                        </h4>
                                                        <span className="font-mono font-black text-sm px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shrink-0">
                                                            {kit.total} (x2 Barreras)
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-slate-300 leading-relaxed">{kit.desc}</p>
                                                    <p className="text-[11px] font-mono font-bold text-cyan-400 mt-2">
                                                        INCLUYE: {kit.includes}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Fotomontajes de la propuesta */}
                                        <div className="border border-slate-800 rounded-2xl p-5 bg-slate-900/40 space-y-4">
                                            <h4 className="text-xs font-mono font-black uppercase text-orange-400 tracking-wider">
                                                FOTOMONTAJES — VISUALIZACIÓN DE BARRERAS INSTALADAS EN SITIO
                                            </h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="rounded-xl overflow-hidden border border-orange-500/30 bg-slate-950">
                                                    <img src="/documentos/fotos/photomontage_1.png" alt="Fotomontaje 1" className="w-full h-48 object-cover" />
                                                    <p className="p-2.5 text-[11px] text-orange-300 font-semibold text-center bg-orange-950/40">Fotomontaje 1: Barrera DITEC instalada en acceso principal</p>
                                                </div>
                                                <div className="rounded-xl overflow-hidden border border-orange-500/30 bg-slate-950">
                                                    <img src="/documentos/fotos/photomontage_2.jpeg" alt="Fotomontaje 2" className="w-full h-48 object-cover" />
                                                    <p className="p-2.5 text-[11px] text-orange-300 font-semibold text-center bg-orange-950/40">Fotomontaje 2: Perspectiva lateral de integración</p>
                                                </div>
                                                <div className="rounded-xl overflow-hidden border border-orange-500/30 bg-slate-950">
                                                    <img src="/documentos/fotos/photomontage_3.jpeg" alt="Fotomontaje 3" className="w-full h-48 object-cover" />
                                                    <p className="p-2.5 text-[11px] text-orange-300 font-semibold text-center bg-orange-950/40">Fotomontaje 3: Posición de cierre y paso peatonal</p>
                                                </div>
                                                <div className="rounded-xl overflow-hidden border border-orange-500/30 bg-slate-950">
                                                    <img src="/documentos/fotos/photomontage_4.jpeg" alt="Fotomontaje 4" className="w-full h-48 object-cover" />
                                                    <p className="p-2.5 text-[11px] text-orange-300 font-semibold text-center bg-orange-950/40">Fotomontaje 4: Doble barrera en rampa adoquinada</p>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                )}

                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

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
