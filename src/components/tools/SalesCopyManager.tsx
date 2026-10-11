"use client"

import React, { useState } from "react"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Copy, Check, MessageSquare, Send, Sparkles, ExternalLink, 
    Share2, Smartphone, Store, ShieldCheck, Tag, Filter, 
    RotateCcw, CheckCircle2, User, Phone, Package, MapPin, Zap
} from "lucide-react"

interface SalesScript {
    id: string
    title: string
    category: "marketplace" | "whatsapp" | "cierre" | "seguimiento" | "garantia"
    badge: string
    badgeColor: string
    template: (vars: ScriptVars) => string
    tips: string
    isFeatured?: boolean
}

interface ScriptVars {
    sellerName: string
    clientName: string
    product: string
    storeUrl: string
    sellerPhone: string
    clientPhone: string
    city: string
}

export default function SalesCopyManager({
    onClose
}: {
    onClose?: () => void
}) {
    const { data: session } = useSession()

    // Variable inputs for dynamic personalization
    const [sellerName, setSellerName] = useState(session?.user?.name || "Asesor Comercial")
    const [clientName, setClientName] = useState("")
    const [product, setProduct] = useState("Equipos de Tecnología y Seguridad")
    const [storeUrl, setStoreUrl] = useState("https://atomiccotizador.shop/web")
    const [sellerPhone, setSellerPhone] = useState((session?.user as any)?.phone || "0969043453")
    const [clientPhone, setClientPhone] = useState("")
    const [city, setCity] = useState("Quito")

    // Filter category
    const [activeCategory, setActiveCategory] = useState<"all" | "marketplace" | "whatsapp" | "cierre" | "seguimiento">("all")
    const [searchFilter, setSearchFilter] = useState("")

    // Copy notification state
    const [copiedId, setCopiedId] = useState<string | null>(null)

    const vars: ScriptVars = {
        sellerName: sellerName.trim() || "Asesor",
        clientName: clientName.trim() ? ` ${clientName.trim()}` : "",
        product: product.trim() || "el producto",
        storeUrl: storeUrl.trim() || "https://atomiccotizador.shop/web",
        sellerPhone: sellerPhone.trim() || "0969043453",
        clientPhone: clientPhone.trim(),
        city: city.trim() || "Quito"
    }

    // List of high-converting sales scripts
    const SCRIPTS: SalesScript[] = [
        {
            id: "bienvenida_marketplace",
            title: "🌟 Bienvenida Marketplace (Saludar + Tienda Web + Pedir WhatsApp)",
            category: "marketplace",
            badge: "MÁS UTILIZADO",
            badgeColor: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
            isFeatured: true,
            tips: "Envía este mensaje de inmediato a cada consulta nueva en Facebook Marketplace o Instagram.",
            template: (v) => 
`¡Hola${v.clientName}! 👋 Qué tal, un gusto saludarte. Con mucho gusto te ayudo con toda la información y disponibilidad de ${v.product} en ATOMIC Solutions 🇪🇨.

Te invito a ver nuestro catálogo completo, fotos reales en alta definición y promociones oficiales en nuestra tienda online:
👉 ${v.storeUrl}

Por este medio a veces las respuestas se demoran; ¿cuál es tu número de WhatsApp para enviarte de inmediato la ficha técnica completa, videos de prueba y el catálogo con precios especiales y garantía oficial de 1 año?`
        },
        {
            id: "respuesta_disponible",
            title: "⚡ Respuesta Rápida: \"¿Sigue disponible?\" (Marketplace)",
            category: "marketplace",
            badge: "RESPUESTA RÁPIDA",
            badgeColor: "bg-blue-500/10 text-blue-600 border-blue-500/30",
            tips: "Ideal para responder en 10 segundos al botón predeterminado de Facebook Marketplace.",
            template: (v) =>
`¡Hola${v.clientName}! 👋 Sí, aún tenemos stock disponible para entrega inmediata y despachos a nivel nacional de ${v.product}.

Puedes consultar la disponibilidad exacta y alternativas en nuestra tienda oficial:
👉 ${v.storeUrl}

¿En qué ciudad te encuentras para coordinarte la entrega? Pásame tu número de WhatsApp para enviarte la ubicación de retiro o coordinar tu despacho hoy mismo.`
        },
        {
            id: "captura_telefono_catalogo",
            title: "📱 Petición de WhatsApp para Enviar Catálogo Completo",
            category: "whatsapp",
            badge: "FILTRO A WHATSAPP",
            badgeColor: "bg-indigo-500/10 text-indigo-600 border-indigo-500/30",
            tips: "Mueve al cliente de Marketplace a WhatsApp donde la tasa de cierre es 4 veces mayor.",
            template: (v) =>
`Contamos con más de 9,600 productos en tecnología, electrónica y equipamiento con garantía de fábrica en ATOMIC Solutions.

Puedes revisar las categorías principales aquí: ${v.storeUrl}

¿Cuál es tu número de WhatsApp? Te comparto por ahí el catálogo interactivo en PDF con precios de distribuidor y resolvemos cualquier duda técnica de inmediato.`
        },
        {
            id: "envio_cotizacion",
            title: "📄 Envío de Cotización Oficial / Proforma Digital",
            category: "whatsapp",
            badge: "COTIZACIÓN",
            badgeColor: "bg-purple-500/10 text-purple-600 border-purple-500/30",
            tips: "Úsalo al enviar el enlace persistente generado en el cotizador de ATOMIC.",
            template: (v) =>
`¡Estimado/a${v.clientName}! 👋 Te compartimos aquí la cotización formal correspondiente a tu requerimiento de ${v.product}.

Recuerda que puedes solicitar un descuento adicional a tu asesor (${v.sellerName}) y consultar tu proforma con código QR verificable para siempre aquí:
👉 ${v.storeUrl}

¿Te reservamos el equipo o deseas incluir algún accesorio o instalación adicional en la propuesta?`
        },
        {
            id: "cierre_envios_pago",
            title: "🚚 Cierre de Venta: Envíos Nacionales Servientrega & Medios de Pago",
            category: "cierre",
            badge: "CIERRE DIRECTO",
            badgeColor: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
            tips: "Brinda seguridad absoluta al cliente indeciso sobre el despacho y formas de pago.",
            template: (v) =>
`¡Excelente${v.clientName}! En ATOMIC Solutions realizamos envíos 100% asegurados a nivel nacional a través de Servientrega o transporte interprovincial con guía de rastreo inmediata.

Formas de pago disponibles:
• Transferencia directa (Banco Pichincha, Guayaquil, Produbanco)
• Tarjeta de Crédito / Débito (diferido hasta 12 meses)
• Pago contraentrega en ${v.city}

Para emitirte la proforma formal con factura electrónica y reservar tu unidad, por favor indícame:
1. Nombre completo:
2. Cédula o RUC:
3. Ciudad y Dirección de entrega:
4. Teléfono de contacto:`
        },
        {
            id: "seguimiento_descuento",
            title: "⏳ Seguimiento con Descuento Especial por Compra Hoy",
            category: "seguimiento",
            badge: "URGENCIA & DESCUENTO",
            badgeColor: "bg-amber-500/10 text-amber-600 border-amber-500/30",
            tips: "Activa a clientes que dejaron de responder aplicando escasez y beneficio inmediato.",
            template: (v) =>
`¡Hola${v.clientName}! 👋 Te saluda nuevamente ${v.sellerName} de ATOMIC Solutions.

Quería comentarte que logré habilitarte un DESCUENTO ESPECIAL de cierre para tu compra de ${v.product} si confirmamos tu pedido el día de hoy.

Además, te incluimos garantía oficial de 1 año y soporte técnico directo.
¿Deseas que te reserve la última unidad disponible con este beneficio?`
        },
        {
            id: "garantia_soporte",
            title: "🛡️ Garantía Oficial de 1 Año & Soporte Técnico ATOMIC",
            category: "garantia",
            badge: "CONFIANZA",
            badgeColor: "bg-slate-500/10 text-slate-700 border-slate-500/30",
            tips: "Para derribar objeciones sobre desconfianza, procedencia o repuestos.",
            template: (v) =>
`En ATOMIC Solutions todos nuestros productos cuentan con:
✅ Garantía oficial de 1 año por defectos de fábrica.
✅ Equipos 100% nuevos en caja sellada con factura legal para respaldo tributario.
✅ Soporte técnico y repuestos originales en Ecuador.
✅ Tienda física y despacho verificado.

Puedes validar nuestra seriedad y catálogo en: ${v.storeUrl}
¿En qué te podemos asesorar para que tomes la mejor decisión?`
        }
    ]

    const handleCopy = (script: SalesScript) => {
        const text = script.template(vars)
        if (typeof navigator !== "undefined" && navigator.clipboard) {
            navigator.clipboard.writeText(text)
            setCopiedId(script.id)
            setTimeout(() => setCopiedId(null), 2500)
        }
    }

    const handleOpenWhatsApp = (script: SalesScript) => {
        const text = script.template(vars)
        const targetPhone = clientPhone.replace(/\D/g, "")
        const url = targetPhone 
            ? `https://api.whatsapp.com/send?phone=593${targetPhone.replace(/^0/, "")}&text=${encodeURIComponent(text)}`
            : `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`
        window.open(url, "_blank")
    }

    const filteredScripts = SCRIPTS.filter(s => {
        const matchesCategory = activeCategory === "all" || s.category === activeCategory
        const matchesSearch = s.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
                              s.tips.toLowerCase().includes(searchFilter.toLowerCase())
        return matchesCategory && matchesSearch
    })

    return (
        <div className="w-full flex flex-col space-y-6 font-sans text-slate-800">
            {/* Top Banner */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#026CDF]/10 border border-[#026CDF]/20 flex items-center justify-center text-[#026CDF] shrink-0 shadow-sm">
                        <MessageSquare size={26} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 text-[10px] font-bold font-mono uppercase bg-[#026CDF]/10 text-[#026CDF] border border-[#026CDF]/20 rounded-full">
                                HERRAMIENTA OFICIAL DE VENTAS
                            </span>
                            <span className="px-2.5 py-0.5 text-[10px] font-bold font-mono uppercase bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-full">
                                MARKETPLACE & WHATSAPP
                            </span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
                            Mensajes para Copiar y Pegar
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Plantillas optimizadas para saludar prospectos en Marketplace, enviar la tienda web y capturar su WhatsApp al instante.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                    <a
                        href="https://atomiccotizador.shop/web"
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
                    >
                        <Store size={14} /> Ver Tienda Web
                    </a>
                </div>
            </div>

            {/* Customization Toolbar (Dynamic variables) */}
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                        <Sparkles size={14} className="text-[#026CDF]" /> Variables de Personalización Rápida
                    </p>
                    <span className="text-[11px] text-slate-500">
                        Los mensajes se adaptan automáticamente con estos datos
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                    <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Nombre del Asesor</label>
                        <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-xl px-3 py-2">
                            <User size={13} className="text-slate-400" />
                            <input 
                                value={sellerName}
                                onChange={e => setSellerName(e.target.value)}
                                placeholder="Tu nombre"
                                className="w-full bg-transparent outline-none font-medium text-slate-800"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Nombre del Cliente (Opcional)</label>
                        <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-xl px-3 py-2">
                            <User size={13} className="text-slate-400" />
                            <input 
                                value={clientName}
                                onChange={e => setClientName(e.target.value)}
                                placeholder="Ej: Carlos"
                                className="w-full bg-transparent outline-none font-medium text-slate-800"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Producto Consultado</label>
                        <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-xl px-3 py-2">
                            <Package size={13} className="text-slate-400" />
                            <input 
                                value={product}
                                onChange={e => setProduct(e.target.value)}
                                placeholder="Ej: Kit Cámaras WiFi"
                                className="w-full bg-transparent outline-none font-medium text-slate-800"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">WhatsApp del Cliente (Opcional)</label>
                        <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-xl px-3 py-2">
                            <Phone size={13} className="text-slate-400" />
                            <input 
                                value={clientPhone}
                                onChange={e => setClientPhone(e.target.value)}
                                placeholder="Ej: 0991234567"
                                className="w-full bg-transparent outline-none font-medium text-slate-800"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
                {[
                    { id: "all", label: "Todos los Mensajes" },
                    { id: "marketplace", label: "🛒 Marketplace & Bienvenida" },
                    { id: "whatsapp", label: "💬 Captura de WhatsApp" },
                    { id: "cierre", label: "🤝 Cierre & Envíos" },
                    { id: "seguimiento", label: "⏳ Seguimiento & Descuento" }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveCategory(tab.id as any)}
                        className={`px-4 py-2 text-xs font-bold rounded-2xl transition-all border ${
                            activeCategory === tab.id
                                ? "bg-[#026CDF] text-white border-[#026CDF] shadow-sm shadow-[#026CDF]/20"
                                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Scripts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredScripts.map((script) => {
                    const text = script.template(vars)
                    const isCopied = copiedId === script.id

                    return (
                        <div 
                            key={script.id}
                            className={`bg-white border rounded-3xl p-5 shadow-sm transition-all flex flex-col justify-between ${
                                script.isFeatured 
                                    ? "border-[#026CDF]/40 ring-2 ring-[#026CDF]/10" 
                                    : "border-slate-200 hover:border-slate-300"
                            }`}
                        >
                            <div>
                                <div className="flex items-center justify-between gap-2 mb-2">
                                    <span className={`px-2.5 py-0.5 text-[9px] font-bold font-mono uppercase rounded-full border ${script.badgeColor}`}>
                                        {script.badge}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-mono">
                                        {text.length} caracteres
                                    </span>
                                </div>

                                <h3 className="text-sm font-black text-slate-900 mb-1">
                                    {script.title}
                                </h3>
                                <p className="text-[11px] text-slate-500 mb-3 italic">
                                    💡 {script.tips}
                                </p>

                                {/* Message Preview Bubble */}
                                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed select-all">
                                    {text}
                                </div>
                            </div>

                            {/* Actions Bar */}
                            <div className="flex items-center gap-2 pt-4 mt-4 border-t border-slate-100">
                                <button
                                    onClick={() => handleCopy(script)}
                                    className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm ${
                                        isCopied 
                                            ? "bg-emerald-600 text-white shadow-emerald-500/20" 
                                            : "bg-[#026CDF] hover:bg-[#0053CD] text-white shadow-[#026CDF]/20"
                                    }`}
                                >
                                    {isCopied ? <Check size={15} /> : <Copy size={15} />}
                                    {isCopied ? "¡Copiado al Portapapeles!" : "Copiar Mensaje"}
                                </button>

                                <button
                                    onClick={() => handleOpenWhatsApp(script)}
                                    className="py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all"
                                    title="Abrir directamente en WhatsApp con este texto pre-cargado"
                                >
                                    <Send size={14} />
                                    WhatsApp
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
