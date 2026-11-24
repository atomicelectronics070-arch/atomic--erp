"use client"

import React, { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    ShieldAlert, ExternalLink, Download, Copy, Check, Search, Filter,
    Truck, Building2, Tag, DollarSign, Image as ImageIcon, FileText,
    Share2, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, Phone,
    Eye, Laptop, Gamepad2, Shield, Zap, Home, ChevronRight, Layers, Lock
} from "lucide-react"

export interface ProviderProduct {
    id: string
    name: string
    category: "GAMING" | "COMPUTO" | "DOMOTICA" | "ENERGIA" | "PANELES" | "CCTV"
    sku: string
    providerName: string
    providerCity: string
    providerUrl: string
    providerPhone: string
    wholesaleCost: number
    suggestedRetailPrice: number
    margin: number
    stockStatus: "STOCK INMEDIATO" | "BAJO PEDIDO 24H" | "PRODUCCIÓN TALLER"
    images: string[]
    description: string
    technicalSpecs: string[]
    notesConfidential: string
}

const CONFIDENTIAL_PRODUCTS: ProviderProduct[] = [
    {
        id: "prod-ps4-slim",
        name: "PlayStation 4 Slim 1TB + 2 Mandos + Juegos Listos",
        category: "GAMING",
        sku: "PS4-SLIM-1TB-BK",
        providerName: "Bodega Central Mayorista Consolas Ecuador",
        providerCity: "Quito Norte",
        providerUrl: "https://atomiccotizador.shop/web/banco-publicaciones",
        providerPhone: "+593 96 904 3453",
        wholesaleCost: 185.00,
        suggestedRetailPrice: 240.00,
        margin: 55.00,
        stockStatus: "STOCK INMEDIATO",
        images: [
            "https://images.unsplash.com/photo-1507457379470-08b800bebc67?auto=format&fit=crop&w=1200&q=85",
            "https://images.unsplash.com/photo-1486401899868-0e435ed85128?auto=format&fit=crop&w=1200&q=85"
        ],
        description: `🔥 ¡PLAYSTATION 4 SLIM 1TB CON ENTREGA INMEDIATA HOY MISMO EN QUITO! 🔥

Incluye:
✅ Consola 100% testeada con mantenimiento al día y sello de garantía
✅ 2 Controles inalámbricos en perfecto estado
✅ Juegos instalados listos para conectar y jugar
✅ Envíos a todo el Ecuador con Servientrega o retiro seguro en punto.

Precio de remate: $240.00 USD. Escríbenos al WhatsApp para apartar la tuya hoy.`,
        technicalSpecs: [
            "Almacenamiento: 1TB HDD de alta velocidad",
            "Resolución: 1080p HDR a 60 FPS",
            "Conectividad: Wi-Fi 5GHz, Bluetooth 4.0, HDMI 2.0",
            "Garantía de cambio: 30 días directa con sello de seguridad"
        ],
        notesConfidential: "Stock físico disponible en bodega Quito. Se puede entregar el mismo día. Margen neto de $55.00 por consola."
    },
    {
        id: "prod-ps5-disc",
        name: "PlayStation 5 Sellada de Fábrica (Garantía Oficial Sony 1 Año)",
        category: "GAMING",
        sku: "PS5-DISC-ED-WHITE",
        providerName: "Distribuidor Autorizado Sony PlayStation Hub",
        providerCity: "Guayaquil / Quito Almacén Fiscal",
        providerUrl: "https://www.playstation.com/es-ec/",
        providerPhone: "+593 98 425 2528",
        wholesaleCost: 520.00,
        suggestedRetailPrice: 620.00,
        margin: 100.00,
        stockStatus: "BAJO PEDIDO 24H",
        images: [
            "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1200&q=85",
            "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=85"
        ],
        description: `⚡ PLAYSTATION 5 VERSIÓN DISCO - BODEGA CENTRAL MAYORISTA ⚡

Consola virgen sellada de fábrica, con precinto de seguridad intacto y garantía oficial Sony de 1 año.

📦 Protocolo de Entrega en 24 Horas:
1. Reserva hoy con anticipo formal del 50%
2. Despacho directo de almacén central
3. Entrega a domicilio o retiro en oficina donde liquidas el saldo restante.

Precio oficial: $620 USD. Cupos de despacho limitados.`,
        technicalSpecs: [
            "CPU: AMD Zen 2 de 8 núcleos a 3.5 GHz",
            "GPU: 10.28 TFLOPs RDNA 2 personalizada",
            "SSD: 825GB NVMe PCIe 4.0 ultra rápido (5.5 GB/s)",
            "Lector de disco: Blu-ray Ultra HD 4K"
        ],
        notesConfidential: "Consola bajo pedido directo de bodega mayorista. Requiere 50% de anticipo ($310) antes de movilizar o despachar. Margen neto $100.00."
    },
    {
        id: "prod-acer-nitro",
        name: "Laptop Gamer Acer Nitro V 15 (Core i5 13va + RTX 4050)",
        category: "COMPUTO",
        sku: "ACER-NITRO-V15-4050",
        providerName: "Megatek Importador Mayorista de Laptops",
        providerCity: "Quito Norte (Eloy Alfaro)",
        providerUrl: "https://atomiccotizador.shop/dashboard/matriz-precios",
        providerPhone: "+593 99 789 0123",
        wholesaleCost: 730.00,
        suggestedRetailPrice: 890.00,
        margin: 160.00,
        stockStatus: "STOCK INMEDIATO",
        images: [
            "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=1200&q=85",
            "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1200&q=85"
        ],
        description: `🚀 POTENCIA TOTAL: ACER NITRO V 15 PARA ARQUITECTURA Y GAMING 🚀

Especificaciones de Alto Desempeño:
• Intel Core i5 13420H (13va Generación Turbo)
• Gráfica NVIDIA RTX 4050 6GB GDDR6
• 16GB RAM DDR5 + 512GB SSD NVMe
• Pantalla 15.6" FHD 144Hz IPS

Factura electrónica con IVA y garantía de 1 año. Ideal para renderizado, AutoCAD y gaming pesado.`,
        technicalSpecs: [
            "Procesador: Intel Core i5-13420H (8 núcleos, hasta 4.6 GHz)",
            "Gráfica dedicada: NVIDIA GeForce RTX 4050 6GB GDDR6",
            "Memoria: 16GB RAM DDR5 a 5200MHz (Expandible)",
            "Pantalla: 15.6 pulgadas Full HD 144Hz SlimBezel"
        ],
        notesConfidential: "Proveedor Megatek. Entrega inmediata con factura SRI y 1 año de garantía de fabricante. Margen neto $160.00."
    },
    {
        id: "prod-cerradura-tuya",
        name: "Cerradura Biométrica Inteligente Tuya WiFi con Huella y App",
        category: "DOMOTICA",
        sku: "SMART-LOCK-TUYA-WF",
        providerName: "Diel Comunicaciones & Automatización",
        providerCity: "Quito / Cuenca",
        providerUrl: "https://atomiccotizador.shop/web/cerraduras-smart",
        providerPhone: "+593 98 321 6549",
        wholesaleCost: 120.00,
        suggestedRetailPrice: 195.00,
        margin: 75.00,
        stockStatus: "STOCK INMEDIATO",
        images: [
            "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1200&q=85",
            "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1200&q=85"
        ],
        description: `🔒 SEGURIDAD INTELIGENTE: CERRADURA BIOMÉTRICA DE ALTA SEGURIDAD 🔒

Olvídate de cargar llaves. Abre tu puerta con:
👆 Huella dactilar ultra-rápida (< 0.3s)
📱 Apertura remota desde celular con app Tuya / SmartLife
🔢 Código PIN numérico temporal para visitas o Airbnb
💳 Tarjeta de proximidad RFID y llaves mecánicas de emergencia

Compatible con puertas de madera y metal. ¡Instalación garantizada en Quito y valles!`,
        technicalSpecs: [
            "Capacidad: 100 huellas, 100 tarjetas RFID, 100 códigos PIN",
            "App: Tuya Smart / Smart Life (iOS y Android)",
            "Batería: 4 pilas AA con aviso de batería baja y puerto microUSB de emergencia",
            "Material: Aleación de aluminio de alta resistencia anti-palanca"
        ],
        notesConfidential: "Proveedor Diel. Margen bruto de $75.00. Si se vende con instalación incluida se cobran $45 adicionales de mano de obra técnica."
    },
    {
        id: "prod-tablero-transferencia",
        name: "Tablero de Transferencia Automática para Generador Eléctrico",
        category: "ENERGIA",
        sku: "ATS-TRANSFER-63A-220V",
        providerName: "Taller de Ingeniería & Cuadros Eléctricos ATOMIC",
        providerCity: "Quito Sur / Taller Matriz",
        providerUrl: "https://atomiccotizador.shop/web/proyectos",
        providerPhone: "+593 96 904 3453",
        wholesaleCost: 260.00,
        suggestedRetailPrice: 420.00,
        margin: 160.00,
        stockStatus: "PRODUCCIÓN TALLER",
        images: [
            "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=85",
            "https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=1200&q=85"
        ],
        description: `⚡ ¡BLINDA TU CASA CONTRA LOS APAGONES! TABLERO DE TRANSFERENCIA AUTOMÁTICA ⚡

¿Se corta la luz en tu sector? Nuestro sistema conmuta en milisegundos hacia tu generador o batería sin que tengas que mover una palanca ni quedarte a oscuras.

Protege tus neveras, computadoras, cámaras y red de internet. Ingeniería certificada con garantía de 2 años.`,
        technicalSpecs: [
            "Capacidad: 63A Bifásico / Monofásico 110V-220V",
            "Tiempo de conmutación: < 50 milisegundos",
            "Gabinete: Metálico IP65 hermético con pintura electrostática",
            "Protección: Enclavamiento mecánico y eléctrico contra retroalimentación a la red"
        ],
        notesConfidential: "Ensamblado en nuestro propio taller técnico. Costo de componentes: $260. Margen de ganancia $160 por equipo vendido."
    },
    {
        id: "prod-paneles-wpc",
        name: "Panel Ranurado WPC Tipo Madera para Exteriores e Interiores",
        category: "PANELES",
        sku: "WPC-PANEL-TEAK-290",
        providerName: "Importadora Directa de Acabados Arquitectónicos",
        providerCity: "Guayaquil / Quito Bodega Centro",
        providerUrl: "https://atomiccotizador.shop/web/categoria/paneles-wpc",
        providerPhone: "+593 99 904 7979",
        wholesaleCost: 8.50,
        suggestedRetailPrice: 14.50,
        margin: 6.00,
        stockStatus: "STOCK INMEDIATO",
        images: [
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85",
            "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=85"
        ],
        description: `🌿 ELEGANCIA Y CERO MANTENIMIENTO: PANELES RANURADOS WPC 🌿

Renueva la fachada de tu casa, sala o negocio con paneles tipo madera compuestos de polímero y fibra de madera de alta densidad.

✅ 100% resistentes al agua, sol y polillas
✅ No necesitan barniz ni pintura nunca
✅ Instalación rápida con clips ocultos

Cotiza tus metros cuadrados hoy mismo con nosotros.`,
        technicalSpecs: [
            "Dimensiones: 2.90m largo x 16cm ancho x 24mm espesor",
            "Composición: 60% fibra de madera, 30% polietileno de alta densidad, 10% aditivos UV",
            "Resistencia térmica: De -20°C a +60°C",
            "Vida útil estimada: Más de 20 años sin deformación"
        ],
        notesConfidential: "Se vende por lámina o por metro cuadrado. Costo importación: $8.50/lámina. Margen por proyecto mediano supera los $400 USD."
    }
]

export default function ListaPreciosProveedoresConfidencial() {
    const [search, setSearch] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<string>("TODAS")
    const [selectedProduct, setSelectedProduct] = useState<ProviderProduct | null>(null)
    const [copiedId, setCopiedId] = useState<string | null>(null)
    const [toastMessage, setToastMessage] = useState<string | null>(null)

    const filtered = useMemo(() => {
        return CONFIDENTIAL_PRODUCTS.filter(p => {
            const matchCategory = selectedCategory === "TODAS" || p.category === selectedCategory
            const matchSearch = 
                p.name.toLowerCase().includes(search.toLowerCase()) ||
                p.providerName.toLowerCase().includes(search.toLowerCase()) ||
                p.sku.toLowerCase().includes(search.toLowerCase())
            return matchCategory && matchSearch
        })
    }, [search, selectedCategory])

    const handleCopyText = (text: string, id: string, label: string) => {
        navigator.clipboard.writeText(text)
        setCopiedId(id)
        setToastMessage(`✅ ${label} copiado al portapapeles`)
        setTimeout(() => {
            setCopiedId(null)
            setToastMessage(null)
        }, 3000)
    }

    const openWhatsAppProvider = (p: ProviderProduct) => {
        const text = encodeURIComponent(`Hola ${p.providerName}, requiero validar disponibilidad de stock y fotos en alta resolución del artículo: ${p.name} (SKU: ${p.sku}) para catálogo de ATOMIC Solutions.`)
        const cleanPhone = p.providerPhone.replace(/\D/g, "")
        window.open(`https://wa.me/${cleanPhone}?text=${text}`, "_blank")
    }

    return (
        <div className="space-y-6">
            {/* ── BANNER INTRODUCTORIO DE ESTRICTA CONFIDENCIALIDAD ── */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-red-950/60 via-amber-950/40 to-slate-900 border-2 border-amber-500/50 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500 text-black flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/30 font-black">
                            <ShieldAlert size={26} className="stroke-[2.5]" />
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded-full bg-red-500/30 text-red-300 border border-red-500/50">
                                    ESTRICTAMENTE CONFIDENCIAL
                                </span>
                                <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                                    EXCLUSIVO STEFY & CRISTINA
                                </span>
                            </div>
                            <h2 className="text-xl font-black text-white tracking-tight">
                                Lista Maestra de Precios, Costos & Enlaces Directos a Proveedores
                            </h2>
                            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
                                Este módulo contiene los <strong>costos de importación reales</strong>, márgenes comerciales autorizados y accesos directos a bodegas de proveedores.
                                Puedes <strong>validar especificaciones técnicas</strong>, ingresar con un clic al proveedor oficial, y <strong>extraer fotografías en alta definición y copys persuasivos</strong> para alimentar el banco de publicaciones y campañas de los asesores.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-1 shrink-0 bg-black/40 p-3 rounded-2xl border border-white/10 font-mono text-xs">
                        <span className="text-slate-400 text-[10px]">Acceso Auditado Por:</span>
                        <span className="text-amber-300 font-bold">Stefy (Edición) & Cristina (Coordinación)</span>
                        <span className="text-emerald-400 text-[10px] flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Precios Vigentes 2026
                        </span>
                    </div>
                </div>
            </div>

            {/* Toast Feedback */}
            {toastMessage && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-60 px-5 py-2.5 rounded-2xl bg-emerald-500 text-black font-black text-xs shadow-2xl flex items-center gap-2 border-2 border-white animate-bounce">
                    <CheckCircle2 size={16} />
                    <span>{toastMessage}</span>
                </div>
            )}

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
                <div className="relative w-full sm:w-96">
                    <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Buscar por producto, proveedor o SKU..."
                        className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-medium"
                    />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
                    <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                        <Filter size={12} /> Categoría:
                    </span>
                    <select
                        value={selectedCategory}
                        onChange={e => setSelectedCategory(e.target.value)}
                        className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 font-medium"
                    >
                        <option value="TODAS">Todas las Categorías</option>
                        <option value="GAMING">Gaming & Consolas (PS4 / PS5)</option>
                        <option value="COMPUTO">Computación & Laptops (Nitro V)</option>
                        <option value="DOMOTICA">Domótica & Cerraduras Smart</option>
                        <option value="ENERGIA">Energía & Transferencias Eléctricas</option>
                        <option value="PANELES">Paneles WPC & Acabados</option>
                    </select>
                </div>
            </div>

            {/* Grid of Confidential Products */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((item) => (
                    <div
                        key={item.id}
                        className="rounded-3xl border border-slate-800 bg-[#090e1d] hover:border-cyan-500/40 transition-all overflow-hidden flex flex-col justify-between shadow-xl group"
                    >
                        <div>
                            {/* Card Header: Category & Stock Status */}
                            <div className="p-4 border-b border-white/5 flex items-center justify-between">
                                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 uppercase">
                                    {item.category}
                                </span>
                                <span className={`text-[10px] font-mono font-black px-2.5 py-0.5 rounded-full border ${
                                    item.stockStatus === "STOCK INMEDIATO"
                                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                                        : item.stockStatus === "BAJO PEDIDO 24H"
                                        ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                                        : "bg-blue-500/20 text-blue-300 border-blue-500/40"
                                }`}>
                                    {item.stockStatus}
                                </span>
                            </div>

                            {/* Product Image & Badges */}
                            <div className="relative aspect-video bg-black/60 overflow-hidden group">
                                <img
                                    src={item.images[0]}
                                    alt={item.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-white/10 text-white font-mono font-black text-xs">
                                    PVP: ${item.suggestedRetailPrice.toFixed(2)}
                                </div>
                                <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 font-mono text-[10px] font-bold">
                                    Costo: ${item.wholesaleCost.toFixed(2)} | Margen: +${item.margin.toFixed(2)}
                                </div>
                            </div>

                            {/* Info Body */}
                            <div className="p-5 space-y-4">
                                <div>
                                    <h3 className="text-sm font-black text-white leading-snug group-hover:text-cyan-300 transition-colors">
                                        {item.name}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1 text-[11px] font-mono text-slate-400">
                                        <span>SKU: {item.sku}</span>
                                        <span>•</span>
                                        <span className="text-amber-300/90 truncate">{item.providerName}</span>
                                    </div>
                                </div>

                                {/* Financial Metric Card */}
                                <div className="p-3 rounded-2xl bg-black/50 border border-white/5 grid grid-cols-3 gap-2 text-center text-xs font-mono">
                                    <div>
                                        <span className="text-[9px] text-slate-500 block uppercase font-bold">Costo Bodega</span>
                                        <span className="font-bold text-amber-300">${item.wholesaleCost.toFixed(2)}</span>
                                    </div>
                                    <div>
                                        <span className="text-[9px] text-slate-500 block uppercase font-bold">PVP Sugerido</span>
                                        <span className="font-bold text-white">${item.suggestedRetailPrice.toFixed(2)}</span>
                                    </div>
                                    <div>
                                        <span className="text-[9px] text-emerald-400 block uppercase font-bold">Ganancia</span>
                                        <span className="font-black text-emerald-400">+${item.margin.toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* Confidential Note */}
                                <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-[11px] text-amber-200/90 font-mono leading-relaxed">
                                    🔒 <strong>Directiva Confidencial:</strong> {item.notesConfidential}
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons: Ir al Proveedor, Extraer Fotos, Extraer Copy */}
                        <div className="p-5 pt-0 space-y-2">
                            <div className="grid grid-cols-2 gap-2 text-xs font-mono font-bold">
                                {/* Botón: Ir al Proveedor Directo */}
                                <a
                                    href={item.providerUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-300 border border-cyan-500/30 hover:border-cyan-400 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                    title="Ir directamente a la página o catálogo del proveedor"
                                >
                                    <ExternalLink size={13} />
                                    <span>Ir Proveedor</span>
                                </a>

                                {/* Botón: WhatsApp Proveedor */}
                                <button
                                    type="button"
                                    onClick={() => openWhatsAppProvider(item)}
                                    className="px-3 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:border-emerald-400 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                    title="Contactar al proveedor mayorista por WhatsApp para consultar stock"
                                >
                                    <Phone size={13} />
                                    <span>WhatsApp</span>
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs font-mono font-bold">
                                {/* Botón: Extraer Fotos HD */}
                                <button
                                    type="button"
                                    onClick={() => setSelectedProduct(item)}
                                    className="px-3 py-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:border-blue-400 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                    title="Ver y descargar fotos originales del artículo en alta definición"
                                >
                                    <ImageIcon size={13} />
                                    <span>Extraer Fotos ({item.images.length})</span>
                                </button>

                                {/* Botón: Extraer Ficha & Copy */}
                                <button
                                    type="button"
                                    onClick={() => handleCopyText(item.description, item.id, "Ficha y Copy Comercial")}
                                    className="px-3 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-black transition-all flex items-center justify-center gap-1.5 shadow-md shadow-amber-950/40 cursor-pointer"
                                    title="Copiar texto publicitario y características técnicas para publicar"
                                >
                                    {copiedId === item.id ? (
                                        <Check size={13} className="text-black stroke-[3]" />
                                    ) : (
                                        <Copy size={13} className="stroke-[2.5]" />
                                    )}
                                    <span>Extraer Copy</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Sub-Modal: Visor y Extracción de Fotos HD */}
            {selectedProduct && (
                <div className="fixed inset-0 z-70 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/85 backdrop-blur-md" onClick={() => setSelectedProduct(null)} />
                    <div className="relative z-10 w-full max-w-3xl bg-[#090d1e] border border-cyan-500/40 rounded-3xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                            <div className="flex items-center gap-2">
                                <ImageIcon size={20} className="text-cyan-400" />
                                <div>
                                    <h3 className="text-base font-black text-white uppercase">{selectedProduct.name}</h3>
                                    <span className="text-[10px] font-mono text-slate-400">Proveedor: {selectedProduct.providerName}</span>
                                </div>
                            </div>
                            <button onClick={() => setSelectedProduct(null)} className="text-slate-400 hover:text-white p-1">
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4">
                            <span className="text-xs font-mono text-cyan-400 font-bold block uppercase">
                                Fotos de Alta Definición Disponibles para Extracción & Campañas:
                            </span>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {selectedProduct.images.map((img, idx) => (
                                    <div key={idx} className="rounded-2xl border border-white/10 bg-black/40 overflow-hidden space-y-2 p-2">
                                        <img src={img} alt={`Foto ${idx + 1}`} className="w-full aspect-video object-cover rounded-xl" />
                                        <div className="flex items-center justify-between pt-1 px-1">
                                            <span className="text-[10px] font-mono text-slate-400">Resolución HD</span>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleCopyText(img, `url_${idx}`, `URL Foto ${idx + 1}`)}
                                                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-cyan-300 text-[10px] font-mono flex items-center gap-1"
                                                >
                                                    <Copy size={11} />
                                                    <span>Copiar URL</span>
                                                </button>
                                                <a
                                                    href={img}
                                                    target="_blank"
                                                    download={`foto_${selectedProduct.sku}_${idx + 1}.jpg`}
                                                    className="px-2.5 py-1 rounded-lg bg-cyan-500 text-black text-[10px] font-mono font-black flex items-center gap-1"
                                                >
                                                    <Download size={11} />
                                                    <span>Abrir / Bajar</span>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Technical Specs Summary */}
                            <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-2">
                                <span className="text-xs font-mono font-bold text-amber-300 uppercase block">
                                    Ficha de Validación Técnica:
                                </span>
                                <ul className="space-y-1 text-xs text-slate-300 font-mono">
                                    {selectedProduct.technicalSpecs.map((spec, i) => (
                                        <li key={i} className="flex items-center gap-2">
                                            <span className="text-cyan-400">•</span>
                                            <span>{spec}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="pt-2 border-t border-white/10 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setSelectedProduct(null)}
                                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold"
                            >
                                Cerrar Visor
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
