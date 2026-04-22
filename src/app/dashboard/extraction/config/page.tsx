"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
    ArrowLeft,
    Save,
    Database,
    Globe,
    Code,
    Eye,
    Monitor,
    ExternalLink,
    Trash2,
    Layers,
    Type,
    Tag,
    Image as ImageIcon,
    Hash,
    Plus,
    X
} from "lucide-react"

export default function ExtractionConfigPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const domainParam = searchParams.get("domain") || ""

    const [domain, setDomain] = useState(domainParam)
    const [name, setName] = useState("")
    const [selectors, setSelectors] = useState({
        title: "h1",
        price: ".price",
        description: ".product-description",
        sku: ".sku",
        images: "img.product-image",
        container: ".product-item"
    })
    const [isSaving, setIsSaving] = useState(false)
    const [previewUrl, setPreviewUrl] = useState("")

    useEffect(() => {
        if (domainParam) {
            fetchTemplate(domainParam)
        }
    }, [domainParam])

    const fetchTemplate = async (d: string) => {
        try {
            const res = await fetch(`/api/extraction/templates?domain=${d}`)
            if (res.ok) {
                const data = await res.json()
                if (data) {
                    setName(data.name || "")
                    if (data.selectors) {
                        setSelectors(JSON.parse(data.selectors))
                    }
                }
            }
        } catch (e) {
            console.error("Error loading template", e)
        }
    }

    const handleSave = async () => {
        if (!domain) return
        setIsSaving(true)
        try {
            const res = await fetch("/api/extraction/templates", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ domain, name, selectors })
            })
            if (res.ok) {
                router.push("/dashboard/extraction")
            }
        } catch (e) {
            console.error("Error saving template", e)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="space-y-12 pb-24">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center space-x-6">
                    <button
                        onClick={() => router.back()}
                        className="p-3 bg-white border border-neutral-100 hover:text-orange-600 transition-all shadow-sm"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 uppercase">
                            Configuración de <span className="text-orange-600">Selectores</span>
                        </h1>
                        <p className="text-neutral-400 font-medium text-sm mt-1">Definición de reglas de captura para el dominio: {domain || "Nuevo"}</p>
                    </div>
                </div>
                <div className="flex space-x-3">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-orange-600 text-white px-8 py-4 font-bold uppercase tracking-widest text-xs flex items-center space-x-3 transition-all hover:bg-orange-700 disabled:opacity-50"
                    >
                        {isSaving ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-none animate-spin"></div>
                        ) : (
                            <Save size={18} />
                        )}
                        <span>Guardar Plantilla</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Configuration Panel */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-white border border-neutral-200 p-8 shadow-sm">
                        <h3 className="text-lg font-bold uppercase tracking-tight mb-8 flex items-center">
                            <Database size={20} className="mr-3 text-orange-600" />
                            Identificación Global
                        </h3>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Dominio del Proveedor</label>
                                <input
                                    type="text"
                                    value={domain}
                                    onChange={(e) => setDomain(e.target.value)}
                                    placeholder="ej: amazon.com"
                                    className="w-full bg-neutral-50 border border-neutral-100 p-4 text-xs font-bold outline-none focus:border-orange-600 transition-all uppercase"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Nombre Descriptivo</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="ej: Catálogo Tech Supply"
                                    className="w-full bg-neutral-50 border border-neutral-100 p-4 text-xs font-bold outline-none focus:border-orange-600 transition-all uppercase"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-neutral-200 p-8 shadow-sm">
                        <h3 className="text-lg font-bold uppercase tracking-tight mb-8 flex items-center">
                            <Code size={20} className="mr-3 text-orange-600" />
                            Mapeo de Selectores CSS
                        </h3>
                        <div className="space-y-6">
                            <SelectorInput
                                label="Título del Producto"
                                icon={<Type size={14} />}
                                value={selectors.title}
                                onChange={(val: string) => setSelectors({ ...selectors, title: val })}
                            />
                            <SelectorInput
                                label="Precio de Lista"
                                icon={<Tag size={14} />}
                                value={selectors.price}
                                onChange={(val: string) => setSelectors({ ...selectors, price: val })}
                            />
                            <SelectorInput
                                label="Descripción Técnica"
                                icon={<Layers size={14} />}
                                value={selectors.description}
                                onChange={(val: string) => setSelectors({ ...selectors, description: val })}
                            />
                            <SelectorInput
                                label="Referencia / SKU"
                                icon={<Hash size={14} />}
                                value={selectors.sku}
                                onChange={(val: string) => setSelectors({ ...selectors, sku: val })}
                            />
                            <SelectorInput
                                label="Contenedor de Imágenes"
                                icon={<ImageIcon size={14} />}
                                value={selectors.images}
                                onChange={(val: string) => setSelectors({ ...selectors, images: val })}
                            />
                            <div className="pt-4 mt-4 border-t border-neutral-100">
                                <SelectorInput
                                    label="Contenedor de Producto (Listados)"
                                    icon={<Database size={14} />}
                                    value={selectors.container}
                                    onChange={(val: string) => setSelectors({ ...selectors, container: val })}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Preview / Interactive Editor Mock */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-neutral-900 border border-neutral-800 p-1 rounded-none shadow-2xl relative">
                        <div className="flex items-center justify-between px-6 py-4 bg-neutral-900">
                            <div className="flex items-center space-x-2">
                                <div className="flex space-x-1.5">
                                    <div className="w-2.5 h-2.5 rounded-none bg-neutral-700"></div>
                                    <div className="w-2.5 h-2.5 rounded-none bg-neutral-700"></div>
                                    <div className="w-2.5 h-2.5 rounded-none bg-neutral-700"></div>
                                </div>
                                <div className="ml-6 px-4 py-1.5 bg-neutral-800 border border-neutral-700 text-neutral-400 text-[10px] font-bold tracking-tight flex items-center w-[400px]">
                                    <Monitor size={12} className="mr-3" />
                                    {previewUrl || "VISUALIZACIÓN DE INTERFAZ DEL PROVEEDOR..."}
                                </div>
                            </div>
                            <button className="bg-orange-600 text-white px-5 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-orange-700 transition-all flex items-center">
                                <Eye size={14} className="mr-2" /> Inspeccionar
                            </button>
                        </div>

                        <div className="bg-white min-h-[600px] relative overflow-hidden">
                            {/* Placeholder for iframe / visual editor */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-20 text-center space-y-6">
                                <div className="w-32 h-32 bg-neutral-50 rounded-none flex items-center justify-center text-neutral-200">
                                    <Globe size={64} />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold uppercase tracking-tight text-neutral-900">Modo Interactivo de Selección</h4>
                                    <p className="text-neutral-400 text-xs font-bold uppercase tracking-widest mt-2 max-w-sm">
                                        Ingresa una URL de muestra para cargar el DOM y seleccionar elementos visualmente.
                                    </p>
                                </div>
                                <div className="w-full max-w-lg flex shadow-2xl shadow-neutral-100">
                                    <input
                                        type="text"
                                        placeholder="URL DE PRUEBA (EJ: HTTPS://WWW.PROVEEDOR.COM/PRODUCTO-X)"
                                        className="flex-1 bg-white border border-neutral-100 p-4 text-xs font-bold uppercase outline-none focus:border-orange-600"
                                        value={previewUrl}
                                        onChange={(e) => setPreviewUrl(e.target.value)}
                                    />
                                    <button className="bg-neutral-900 text-white px-8 font-bold uppercase text-[10px] tracking-widest">
                                        Cargar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-orange-50 border border-orange-100 p-8 flex items-start space-x-6">
                        <div className="p-3 bg-white border border-orange-100 text-orange-600">
                            <ExternalLink size={24} />
                        </div>
                        <div>
                            <h4 className="text-orange-900 font-bold uppercase tracking-tight text-sm mb-1">Guía de Selectores</h4>
                            <p className="text-orange-700 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                                Utiliza selectores standar CSS. Ejemplos: <br />
                                <span className="text-neutral-900">.price-current</span> (Clase),
                                <span className="text-neutral-900"> #product-sku</span> (ID),
                                <span className="text-neutral-900"> h2.title</span> (Etiqueta + Clase).
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function SelectorInput({ label, icon, value, onChange }: any) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">{label}</label>
                <span className="text-orange-600">{icon}</span>
            </div>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-100 p-3 text-[11px] font-mono outline-none focus:border-orange-600 transition-all"
            />
        </div>
    )
}
