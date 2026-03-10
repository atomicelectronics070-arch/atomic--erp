"use client"

import { useState, useEffect } from "react"
import {
    Search,
    Database,
    Globe,
    History,
    Settings,
    Play,
    Download,
    Filter,
    AlertCircle,
    CheckCircle2,
    Clock,
    BarChart3,
    MoreVertical,
    ExternalLink,
    RefreshCw,
    FileDown,
    X,
    Copy
} from "lucide-react"

const stats = [
    { label: "Extracciones Hoy", value: "0", icon: <Database size={20} />, color: "orange" },
    { label: "Productos Capturados", value: "0", icon: <BarChart3 size={20} />, color: "green" },
    { label: "Dominios Activos", value: "0", icon: <Globe size={20} />, color: "orange" },
    { label: "Tasa de Éxito", value: "—", icon: <CheckCircle2 size={20} />, color: "green" },
]

const recentExtractions = [
    { id: 1, provider: "TechSupply Global", url: "https://techsupply.com/catalogue", date: "2026-03-05 14:20", items: 45, status: "completed" },
    { id: 2, provider: "ElectroParts SA", url: "https://electroparts.net/new-arrivals", date: "2026-03-05 11:05", items: 0, status: "error" },
    { id: 3, provider: "Industrial Tools Inc", url: "https://itools.com/category/drill-bits", date: "2026-03-04 16:45", items: 120, status: "processing" },
]

export default function ExtractionPage() {
    const [url, setUrl] = useState("")
    const [isExtracting, setIsExtracting] = useState(false)
    const [history, setHistory] = useState<any[]>([])
    const [result, setResult] = useState<any>(null)
    const [error, setError] = useState("")
    const [useJs, setUseJs] = useState(false)

    useEffect(() => {
        fetchHistory()
    }, [])

    const fetchHistory = async () => {
        try {
            const res = await fetch("/api/extraction/history")
            if (res.ok) {
                const data = await res.json()
                setHistory(data.length > 0 ? data : recentExtractions)
            } else {
                setHistory(recentExtractions)
            }
        } catch {
            setHistory(recentExtractions)
        }
    }

    const handleStartExtraction = async () => {
        if (!url.trim()) return
        setIsExtracting(true)
        setResult(null)
        setError("")

        try {
            // Validate URL format
            new URL(url)
            const domain = new URL(url).hostname

            // Try to get a template for the domain
            let selectors = {}
            try {
                const tempRes = await fetch(`/api/extraction/templates?domain=${domain}`)
                if (tempRes.ok) {
                    const template = await tempRes.json()
                    if (template?.selectors) {
                        selectors = JSON.parse(template.selectors)
                    }
                }
            } catch {
                // No template found, will use auto-detection
            }

            // Start Scraping
            const scrapeRes = await fetch("/api/extraction/scrape", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url, selectors, useJs })
            })

            const data = await scrapeRes.json()

            if (scrapeRes.ok) {
                setResult(data.result)
                fetchHistory()
            } else {
                setError(data.error || "Error durante la extracción.")
            }
        } catch (e: any) {
            if (e instanceof TypeError && e.message.includes("Invalid URL")) {
                setError("URL inválida. Asegúrate de incluir https:// al inicio.")
            } else {
                setError("Error al procesar la solicitud. Verifica la URL e intenta nuevamente.")
            }
        } finally {
            setIsExtracting(false)
        }
    }

    return (
        <div className="space-y-10 pb-24">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-neutral-900 uppercase">
                        Extracción de <span className="text-orange-600">Datos</span>
                    </h1>
                    <p className="text-neutral-400 font-medium text-sm mt-1">Motor de normalización y captura de catálogos industriales.</p>
                </div>
                <div className="flex space-x-3">
                    <button onClick={fetchHistory} className="bg-neutral-100 text-neutral-600 px-6 py-3 font-bold uppercase tracking-widest text-[10px] flex items-center space-x-2 transition-all hover:bg-neutral-200">
                        <History size={16} />
                        <span>Actualizar</span>
                    </button>
                    <button className="bg-neutral-900 text-white px-6 py-3 font-bold uppercase tracking-widest text-[10px] flex items-center space-x-2 transition-all hover:bg-orange-600">
                        <Settings size={16} />
                        <span>Plantillas</span>
                    </button>
                </div>
            </div>

            {/* Extraction Form */}
            <div className="bg-white border border-neutral-200 p-10 shadow-sm">
                <h2 className="text-xl font-bold uppercase tracking-tight mb-6">Nueva Extracción</h2>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300" size={18} />
                        <input
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleStartExtraction()}
                            placeholder="https://proveedor.com/producto-o-categoria"
                            className="w-full pl-12 pr-4 py-5 bg-neutral-50 border border-neutral-100 text-sm font-medium focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                        />
                    </div>
                    <button
                        onClick={handleStartExtraction}
                        disabled={isExtracting || !url.trim()}
                        className="bg-orange-600 text-white px-10 py-5 font-bold uppercase tracking-[0.2em] text-xs flex items-center justify-center space-x-3 hover:bg-orange-700 transition-all disabled:opacity-50 shadow-lg shadow-orange-500/20 shrink-0"
                    >
                        {isExtracting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Extrayendo...</span>
                            </>
                        ) : (
                            <>
                                <Play size={18} />
                                <span>Iniciar</span>
                            </>
                        )}
                    </button>
                </div>

                <div className="mt-4 flex items-center space-x-6 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                    <label className="flex items-center cursor-pointer hover:text-orange-600 transition-all">
                        <input
                            type="checkbox"
                            className="mr-2 accent-orange-600"
                            checked={useJs}
                            onChange={(e) => setUseJs(e.target.checked)}
                        />
                        Renderizar JavaScript (requiere modo avanzado)
                    </label>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mt-6 flex items-start space-x-3 bg-red-50 border border-red-100 p-4">
                        <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-xs font-bold text-red-700 uppercase tracking-wide">Error de Extracción</p>
                            <p className="text-xs text-red-600 mt-1">{error}</p>
                        </div>
                        <button onClick={() => setError("")} className="ml-auto text-red-300 hover:text-red-500">
                            <X size={16} />
                        </button>
                    </div>
                )}

                {/* Result Display */}
                {result && (
                    <div className="mt-6 bg-neutral-50 border border-neutral-100 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-700 flex items-center space-x-2">
                                <CheckCircle2 size={16} className="text-green-500" />
                                <span>Datos Extraídos</span>
                            </h3>
                            <button
                                onClick={() => navigator.clipboard.writeText(JSON.stringify(result, null, 2))}
                                className="flex items-center space-x-1 text-[10px] font-bold text-neutral-400 hover:text-orange-600 uppercase tracking-widest"
                            >
                                <Copy size={12} />
                                <span>Copiar JSON</span>
                            </button>
                        </div>
                        <div className="space-y-3">
                            {result.title && (
                                <div>
                                    <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Título</span>
                                    <p className="text-sm text-neutral-800 font-medium mt-0.5">{result.title}</p>
                                </div>
                            )}
                            {result.price && (
                                <div>
                                    <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Precio</span>
                                    <p className="text-sm text-neutral-800 font-bold mt-0.5">{result.price}</p>
                                </div>
                            )}
                            {result.description && (
                                <div>
                                    <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Descripción</span>
                                    <p className="text-sm text-neutral-600 mt-0.5 line-clamp-3">{result.description}</p>
                                </div>
                            )}
                            {result.sku && (
                                <div>
                                    <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">SKU</span>
                                    <p className="text-sm text-neutral-800 font-mono mt-0.5">{result.sku}</p>
                                </div>
                            )}
                            {result.images && result.images.length > 0 && (
                                <div>
                                    <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">{result.images.length} Imágenes Encontradas</span>
                                    <div className="flex gap-2 mt-1 flex-wrap">
                                        {result.images.slice(0, 4).map((img: string, i: number) => (
                                            <img key={i} src={img} alt="" className="w-16 h-16 object-cover border border-neutral-200" />
                                        ))}
                                    </div>
                                </div>
                            )}
                            {!result.title && !result.price && !result.description && !result.sku && (
                                <p className="text-xs text-neutral-500">
                                    Página capturada pero sin datos específicos encontrados. Configura selectores CSS personalizados en Plantillas para este dominio.
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-8 border border-neutral-100 shadow-sm hover:border-orange-600 transition-all group">
                        <div className="flex items-center space-x-4">
                            <div className={`p-4 ${stat.color === 'orange' ? 'bg-orange-50 text-orange-600 border border-orange-100' : 'bg-green-50 text-green-600 border border-green-100'} transition-all group-hover:bg-neutral-900 group-hover:text-white group-hover:border-neutral-900`}>
                                {stat.icon}
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">{stat.label}</p>
                                <p className="text-3xl font-bold text-neutral-900 tracking-tighter">{stat.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Table */}
            <div className="bg-white border border-neutral-200 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-neutral-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold uppercase tracking-tight">Registro de Operaciones</h2>
                    <button onClick={fetchHistory} className="p-2.5 bg-neutral-50 text-neutral-400 border border-neutral-100 hover:text-orange-600 transition-all">
                        <RefreshCw size={16} />
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="text-[10px] text-neutral-400 uppercase font-bold tracking-widest bg-neutral-50/50">
                            <tr>
                                <th className="px-8 py-5">Proveedor / Dominio</th>
                                <th className="px-6 py-5">Fecha Operación</th>
                                <th className="px-6 py-5 text-center">Ítems</th>
                                <th className="px-6 py-5">Estado</th>
                                <th className="px-8 py-5 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {history.map((ex) => (
                                <tr key={ex.id} className="hover:bg-neutral-50/50 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 bg-neutral-900 text-white flex items-center justify-center font-bold text-xs">
                                                {(ex.provider || ex.domain || "?")[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-neutral-900 text-sm tracking-tight">{ex.provider || ex.domain}</p>
                                                <p className="text-[9px] font-bold text-neutral-400 uppercase truncate max-w-[200px]">{ex.url}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 font-bold text-neutral-500 text-[10px] uppercase tracking-widest">
                                        {ex.date || new Date(ex.createdAt).toLocaleString("es-ES")}
                                    </td>
                                    <td className="px-6 py-6 text-center font-bold text-neutral-900">
                                        {ex.items ?? ex.itemCount ?? 0}
                                    </td>
                                    <td className="px-6 py-6">
                                        {(ex.status === 'completed' || ex.status === 'COMPLETED') && (
                                            <span className="flex items-center text-[9px] font-bold text-green-600 bg-green-50 px-2 py-1 uppercase tracking-widest border border-green-100 w-fit">
                                                <CheckCircle2 size={10} className="mr-1.5" /> Completada
                                            </span>
                                        )}
                                        {(ex.status === 'error' || ex.status === 'ERROR') && (
                                            <span className="flex items-center text-[9px] font-bold text-red-600 bg-red-50 px-2 py-1 uppercase tracking-widest border border-red-100 w-fit">
                                                <AlertCircle size={10} className="mr-1.5" /> Error
                                            </span>
                                        )}
                                        {(ex.status === 'processing' || ex.status === 'PROCESSING') && (
                                            <span className="flex items-center text-[9px] font-bold text-orange-600 bg-orange-50 px-2 py-1 uppercase tracking-widest border border-orange-100 w-fit animate-pulse">
                                                <Clock size={10} className="mr-1.5" /> En Proceso
                                            </span>
                                        )}
                                        {(ex.status === 'PENDING') && (
                                            <span className="flex items-center text-[9px] font-bold text-neutral-500 bg-neutral-50 px-2 py-1 uppercase tracking-widest border border-neutral-200 w-fit">
                                                <Clock size={10} className="mr-1.5" /> Pendiente
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end space-x-2">
                                            <button className="p-2 text-neutral-400 hover:text-orange-600 transition-all" title="Ver URL">
                                                <ExternalLink size={16} />
                                            </button>
                                            <button className="p-2 text-neutral-400 hover:text-neutral-900 transition-all" title="Descargar">
                                                <FileDown size={16} />
                                            </button>
                                            <button className="p-2 text-neutral-400 hover:text-neutral-900 transition-all">
                                                <MoreVertical size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {history.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-8 py-12 text-center text-neutral-400 text-xs font-medium">
                                        No hay extracciones registradas aún.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
