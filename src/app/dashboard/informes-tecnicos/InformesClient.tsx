"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    FileText, Download, Share2, MapPin, Calendar, User, Building, HardHat, Camera, 
    Layers, Zap, ShieldCheck, Clock, Award, ExternalLink, Printer
} from "lucide-react"

export default function InformesClient() {
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

    const handleCopiarEnlace = () => {
        const url = "https://atomiccotizador.shop/informes/it-2026-1012-domum-01"
        navigator.clipboard.writeText(url).then(() => {
            showToast("🔗 Enlace público copiado: " + url)
        }).catch(() => {
            showToast("Enlace: " + url)
        })
    }

    return (
        <div className="min-h-screen pb-24 bg-white text-slate-900 rounded-3xl p-4 sm:p-8 border border-slate-200 shadow-sm">
            {/* Header del Módulo */}
            <header className="mb-8 border-b border-slate-200 pb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-mono font-bold text-orange-600 uppercase tracking-wider mb-1.5">
                            <span className="w-2 h-2 rounded-full bg-orange-600 animate-pulse" />
                            Módulo de Informes Técnicos de Obra
                        </div>
                        <h1 className="text-3xl font-black text-slate-950 tracking-tight">
                            Informes Técnicos & Expedientes Oficiales
                        </h1>
                        <p className="text-sm text-slate-600 mt-1">
                            Diagnóstico de campo, factibilidad electromecánica y archivo documental con visualización directa.
                        </p>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <button
                            onClick={handleCopiarEnlace}
                            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors flex items-center gap-1.5"
                        >
                            <Share2 size={14} className="text-orange-600" />
                            <span>Copiar Enlace Público</span>
                        </button>
                        <a
                            href="/informes/it-2026-1012-domum-01"
                            target="_blank"
                            rel="noreferrer"
                            className="px-4 py-2 rounded-xl text-xs font-semibold bg-orange-50 hover:bg-orange-100 text-orange-800 border border-orange-200 transition-colors flex items-center gap-1.5"
                        >
                            <span>Abrir Vista Pública</span>
                            <ExternalLink size={13} />
                        </a>
                    </div>
                </div>
            </header>

            {/* KPI Cards (Blanco y Tomate) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                    <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">Código Oficial</p>
                    <p className="text-xl font-black text-slate-950 mt-1">IT-2026-1012-DOMUM-01</p>
                    <p className="text-xs text-orange-600 font-medium mt-1">Acceso Adoquinado Quito</p>
                </div>
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                    <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">Factibilidad</p>
                    <p className="text-xl font-black text-emerald-700 mt-1">100% Viable</p>
                    <p className="text-xs text-slate-600 mt-1">Adecuaciones eléctricas aprobadas</p>
                </div>
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                    <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">Recursos</p>
                    <p className="text-xl font-black text-slate-950 mt-1">2 Documentos</p>
                    <p className="text-xs text-slate-600 mt-1">Informe Técnico + Plan de Precios</p>
                </div>
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                    <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">Garantía / Validez</p>
                    <p className="text-xl font-black text-orange-600 mt-1">2 / 10 Años</p>
                    <p className="text-xs text-slate-600 mt-1">Respaldo total de fábrica DITEC</p>
                </div>
            </div>

            {/* Barra de Descarga: Solo Botón Descargar Recursos Ambos */}
            <div className="p-5 sm:p-6 rounded-2xl bg-orange-50 border border-orange-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-orange-700 block">
                        Descarga Documental
                    </span>
                    <h2 className="text-base sm:text-lg font-black text-slate-950 mt-0.5">
                        Paquete Completo del Expediente DOMUM
                    </h2>
                    <p className="text-xs text-slate-600 mt-0.5">
                        Descarga inmediata en un solo clic del Informe Técnico y del Plan de Precios original.
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

            {/* Pestañas Anexo 1 y Anexo 2 */}
            <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
                    <button
                        onClick={() => setActiveTab("anexo1")}
                        className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
                            activeTab === "anexo1"
                                ? "bg-orange-600 text-white shadow-xs"
                                : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-200"
                        }`}
                    >
                        <FileText size={15} />
                        <span>Anexo 1: Informe Técnico</span>
                    </button>

                    <button
                        onClick={() => setActiveTab("anexo2")}
                        className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
                            activeTab === "anexo2"
                                ? "bg-orange-600 text-white shadow-xs"
                                : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-200"
                        }`}
                    >
                        <Layers size={15} />
                        <span>Anexo 2: Plan de Precios</span>
                    </button>
                </div>

                <div className="p-6 sm:p-8 bg-white space-y-6">
                    {/* ANEXO 1 */}
                    {activeTab === "anexo1" && (
                        <div className="space-y-6 text-slate-800 text-sm">
                            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
                                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-orange-700 bg-orange-100 px-3 py-1 rounded-full border border-orange-200 inline-block mb-1">
                                    ANEXO 1
                                </span>
                                <h3 className="text-xl font-black text-slate-950 uppercase">
                                    INFORME TÉCNICO DE INSPECCIÓN EN SITIO Y FACTIBILIDAD
                                </h3>
                                <p className="text-xs text-slate-600">
                                    Barreras Vehiculares Herméticas DITEC 3M | Circuito Eléctrico Independiente | Bases Metálicas
                                </p>
                            </div>

                            {/* Metadatos */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono">
                                <div><span className="text-slate-500 block text-[10px]">CÓDIGO:</span><strong className="text-slate-950">IT-2026-1012-DOMUM-01</strong></div>
                                <div><span className="text-slate-500 block text-[10px]">FECHA:</span><strong className="text-slate-950">Viernes 09/10/2026 (11:30 AM)</strong></div>
                                <div><span className="text-slate-500 block text-[10px]">TÉCNICO:</span><strong className="text-slate-950">Luis Daniel Cañar Treviño (42 a.)</strong></div>
                                <div><span className="text-slate-500 block text-[10px]">ESTADO:</span><strong className="text-emerald-700">VIABLE CON ADECUACIONES</strong></div>
                            </div>

                            {/* Alerta Breaker Independiente */}
                            <div className="p-4 rounded-xl bg-orange-50 border-l-4 border-orange-600 text-slate-800 text-xs space-y-1">
                                <p className="font-extrabold text-orange-900 text-sm">⚡ DICTAMEN TÉCNICO MANDATORIO (ACOMETIDA Y BREAKER):</p>
                                <p className="leading-relaxed">
                                    <strong>No conectar el sistema de barreras a la línea compartida del elevador.</strong> Se debe derivar un breaker independiente exclusivo directamente desde el tablero general de breakers principales del edificio, garantizando independencia absoluta sin interferir en la red eléctrica normal ni en el control del ascensor.
                                </p>
                            </div>

                            {/* Alerta Canalización Adoquines */}
                            <div className="p-4 rounded-xl bg-slate-50 border-l-4 border-slate-700 text-slate-800 text-xs space-y-1">
                                <p className="font-bold text-slate-950 text-sm">🔍 HALLAZGO CRÍTICO EN SITIO (VIDEOS V1, V4, V8):</p>
                                <p className="leading-relaxed">
                                    Se constató la presencia de mangueras de cableado preexistentes emergiendo del pavimento de adoquín. <strong>Ya existe una canalización subterránea</strong>, la cual se aprovechará para enhebrar el circuito sin romper adoquines. Para cruces y subidas vistas se utilizará manguera metálica flexible <strong>Liquid-Tight</strong>.
                                </p>
                            </div>

                            {/* Alerta 2 Bases Metálicas */}
                            <div className="p-4 rounded-xl bg-slate-50 border-l-4 border-orange-500 text-slate-800 text-xs space-y-1">
                                <p className="font-bold text-slate-950 text-sm">🏗️ DOS (2) BASES METÁLICAS ESTRUCTURALES:</p>
                                <p className="leading-relaxed">
                                    Dado que la calzada es adoquín sobre cama de arena, no se debe anclar directamente a adoquines flotantes. Se prescribe la fabricación y montaje de <strong>dos (2) bases metálicas</strong> (placas de acero de 8 mm con espárragos químicos que alcancen el firme de hormigón subyacente).
                                </p>
                            </div>

                            {/* Galería de Fotos */}
                            <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50 space-y-3">
                                <h4 className="text-xs font-mono font-black uppercase text-orange-600 tracking-wider">
                                    REGISTRO FOTOGRÁFICO DE CAMPO
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="rounded-xl overflow-hidden border border-slate-200 bg-white">
                                        <img src="/documentos/fotos/v1_frame01.jpg" alt="Video V1" className="w-full h-44 object-cover" />
                                        <p className="p-2.5 text-[11px] text-slate-600 italic">Figura 1.2: Rampa de adoquines hacia subsuelo e intemperie total.</p>
                                    </div>
                                    <div className="rounded-xl overflow-hidden border border-slate-200 bg-white">
                                        <img src="/documentos/fotos/v4_frame01.jpg" alt="Video V4" className="w-full h-44 object-cover" />
                                        <p className="p-2.5 text-[11px] text-slate-600 italic">Figura 1.3: Manguera de cableado preexistente emergiendo de adoquines.</p>
                                    </div>
                                    <div className="rounded-xl overflow-hidden border border-slate-200 bg-white">
                                        <img src="/documentos/fotos/v8_frame01.jpg" alt="Video V8" className="w-full h-44 object-cover" />
                                        <p className="p-2.5 text-[11px] text-slate-600 italic">Figura 1.4: Medición métrica de distancia desde canalización existente.</p>
                                    </div>
                                    <div className="rounded-xl overflow-hidden border border-slate-200 bg-white">
                                        <img src="/documentos/fotos/v7_frame01.jpg" alt="Video V7" className="w-full h-44 object-cover" />
                                        <p className="p-2.5 text-[11px] text-slate-600 italic">Figura 1.5: Fachada del edificio en obra y elevador exterior.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ANEXO 2 */}
                    {activeTab === "anexo2" && (
                        <div className="space-y-6 text-slate-800 text-sm">
                            <div className="p-5 rounded-2xl bg-orange-50 border border-orange-200 text-center space-y-1">
                                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-orange-800 bg-white px-3 py-1 rounded-full border border-orange-300 inline-block mb-1">
                                    ANEXO 2
                                </span>
                                <h3 className="text-xl font-black text-slate-950 uppercase">
                                    PLAN DE PROPUESTAS COMERCIALES — BARRERAS VEHICULARES DITEC
                                </h3>
                                <p className="text-xs text-slate-600">
                                    Matriz de Precios Oficial (x2 Unidades de 3 Metros) y Fotomontajes In Situ
                                </p>
                            </div>

                            {/* Tabla Maestra */}
                            <div className="overflow-x-auto border border-slate-200 rounded-xl">
                                <table className="w-full text-xs text-left">
                                    <thead className="bg-slate-100 text-slate-800 font-mono">
                                        <tr>
                                            <th className="p-3">Configuración / Kit</th>
                                            <th className="p-3 text-center">Unitario</th>
                                            <th className="p-3 text-center">Instalación</th>
                                            <th className="p-3 text-center font-bold text-orange-600">Total (x2 Barreras)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 font-mono">
                                        <tr><td className="p-3 font-sans font-bold">KIT 1: Básico + Controles y Fotoceldas</td><td className="p-3 text-center">$ 1,988.00</td><td className="p-3 text-center">$ 380.00</td><td className="p-3 text-center font-bold text-slate-950">$ 4,736.00</td></tr>
                                        <tr><td className="p-3 font-sans font-bold">KIT 2: Lectura de Placas (LPR Alta Velocidad)</td><td className="p-3 text-center">$ 4,863.00</td><td className="p-3 text-center">$ 465.00</td><td className="p-3 text-center font-bold text-slate-950">$ 10,656.00</td></tr>
                                        <tr><td className="p-3 font-sans font-bold">KIT 3: Antenas RFID / Tags Proximidad</td><td className="p-3 text-center">$ 2,389.35</td><td className="p-3 text-center">$ 655.00</td><td className="p-3 text-center font-bold text-slate-950">$ 6,088.70</td></tr>
                                        <tr><td className="p-3 font-sans font-bold">KIT 4: Tiquetería QR para Tarifado / Cobro</td><td className="p-3 text-center">$ 5,161.20</td><td className="p-3 text-center">$ 765.00</td><td className="p-3 text-center font-bold text-slate-950">$ 11,852.40</td></tr>
                                        <tr className="bg-orange-50 font-bold"><td className="p-3 font-sans font-black text-orange-950">KIT 5: Solución Integral Mixta (Tags + QR)</td><td className="p-3 text-center">$ 5,911.20</td><td className="p-3 text-center">$ 765.00</td><td className="p-3 text-center font-black text-orange-700">$ 13,352.40</td></tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Fotomontajes */}
                            <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50 space-y-3">
                                <h4 className="text-xs font-mono font-black uppercase text-orange-600 tracking-wider">
                                    FOTOMONTAJES — VISUALIZACIÓN EN SITIO
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="rounded-xl overflow-hidden border border-slate-200 bg-white">
                                        <img src="/documentos/fotos/photomontage_1.png" alt="Fotomontaje 1" className="w-full h-48 object-cover" />
                                        <p className="p-2.5 text-[11px] text-slate-700 font-semibold text-center bg-slate-50">Fotomontaje 1: Barreras DITEC instaladas en acceso principal</p>
                                    </div>
                                    <div className="rounded-xl overflow-hidden border border-slate-200 bg-white">
                                        <img src="/documentos/fotos/photomontage_2.jpeg" alt="Fotomontaje 2" className="w-full h-48 object-cover" />
                                        <p className="p-2.5 text-[11px] text-slate-700 font-semibold text-center bg-slate-50">Fotomontaje 2: Perspectiva de cámaras LPR laterales</p>
                                    </div>
                                    <div className="rounded-xl overflow-hidden border border-slate-200 bg-white">
                                        <img src="/documentos/fotos/photomontage_3.jpeg" alt="Fotomontaje 3" className="w-full h-48 object-cover" />
                                        <p className="p-2.5 text-[11px] text-slate-700 font-semibold text-center bg-slate-50">Fotomontaje 3: Antenas RFID para vehículos autorizados</p>
                                    </div>
                                    <div className="rounded-xl overflow-hidden border border-slate-200 bg-white">
                                        <img src="/documentos/fotos/photomontage_4.jpeg" alt="Fotomontaje 4" className="w-full h-48 object-cover" />
                                        <p className="p-2.5 text-[11px] text-slate-700 font-semibold text-center bg-slate-50">Fotomontaje 4: Tótems con tiquetería QR al suelo</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

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
