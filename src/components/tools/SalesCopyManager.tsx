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
    category: "marketplace" | "whatsapp" | "cierre" | "seguimiento" | "ofertas" | "recompra" | "objeciones" | "garantia"
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
    const [storeUrl, setStoreUrl] = useState("https://atomiccotizador.shop/bienvenida")
    const [sellerPhone, setSellerPhone] = useState((session?.user as any)?.phone || "0969043453")
    const [clientPhone, setClientPhone] = useState("")
    const [city, setCity] = useState("Quito")

    // Filter category
    const [activeCategory, setActiveCategory] = useState<"all" | "marketplace" | "whatsapp" | "cierre" | "seguimiento" | "ofertas" | "recompra" | "objeciones" | "garantia">("all")
    const [searchFilter, setSearchFilter] = useState("")

    // Copy notification state
    const [copiedId, setCopiedId] = useState<string | null>(null)

    const vars: ScriptVars = {
        sellerName: sellerName.trim() || "Asesor",
        clientName: clientName.trim() ? ` ${clientName.trim()}` : "",
        product: product.trim() || "el producto",
        storeUrl: storeUrl.trim() || "https://atomiccotizador.shop/bienvenida",
        sellerPhone: sellerPhone.trim() || "0969043453",
        clientPhone: clientPhone.trim(),
        city: city.trim() || "Quito"
    }

    // List of high-converting sales scripts
    const SCRIPTS: SalesScript[] = [
        {
            id: "bienvenida_marketplace",
            title: "🌟 Bienvenida Marketplace (Saludar + Portal Bienvenida + Pedir WhatsApp)",
            category: "marketplace",
            badge: "MÁS UTILIZADO",
            badgeColor: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
            isFeatured: true,
            tips: "Envía este mensaje de inmediato a cada consulta nueva en Facebook Marketplace o Instagram.",
            template: (v) => 
`¡Hola${v.clientName}! 👋 Qué tal, un gusto saludarte. Con mucho gusto te ayudo con toda la información y disponibilidad de ${v.product} en ATOMIC Solutions 🇪🇨.

Te invito a ver nuestro portal oficial de bienvenida, referencias verificadas y catálogo completo con promociones:
👉 ${v.storeUrl}

Por este medio a veces las respuestas se demoran; ¿cuál es tu número de WhatsApp para enviarte de inmediato la ficha técnica completa, videos de prueba y el catálogo con precios especiales y garantía oficial de 1 año?`
        },
        {
            id: "prospeccion_en_frio_maps",
            title: "❄️ Prospección en Frío (Contactos de Google Maps / Negocios)",
            category: "marketplace",
            badge: "VENTA EN FRÍO",
            badgeColor: "bg-cyan-500/10 text-cyan-600 border-cyan-500/30",
            tips: "Para escribir a los 10 contactos recolectados de Google Maps cada día.",
            template: (v) =>
`¡Buen día! 👋 Les saluda ${v.sellerName} de ATOMIC Solutions Ecuador.

Nos comunicamos porque en su sector en ${v.city} estamos equipando a varios comercios y oficinas con ${v.product} y sistemas de seguridad electrónica sin mensualidades.

Les compartimos nuestra carta de presentación oficial y catálogo corporativo:
👉 ${v.storeUrl}

¿Con quién tengo el gusto de coordinar una cotización sin costo con precios mayoristas y garantía de 1 año con factura con IVA?`
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
            id: "oferta_flash_lunes_miercoles",
            title: "⚡ Oferta Flash (Lunes & Miércoles - Difusión Obligatoria)",
            category: "ofertas",
            badge: "FLASH LUNES/MIÉRCOLES",
            badgeColor: "bg-rose-500/10 text-rose-600 border-rose-500/30",
            isFeatured: true,
            tips: "Para enviar a toda tu base de contactos los días lunes y miércoles según el plan laboral.",
            template: (v) =>
`¡Hola${v.clientName}! 👋 Te saluda ${v.sellerName} de ATOMIC Solutions.

🔥 *OFERTA FLASH DE LA SEMANA* 🔥
Habilitamos un lote exclusivo de ${v.product} con PRECIO DE BODEGA con factura y garantía oficial de 1 año.

📦 Incluye entrega inmediata y opción de despacho con Servientrega asegurado a todo el país.
👉 Mira fotos y especificaciones en nuestro portal: ${v.storeUrl}

Válido solo por 48 horas o hasta agotar 5 unidades en stock. ¿Te reservo una unidad a tu nombre hoy?`
        },
        {
            id: "recompra_clientes_antiguos",
            title: "🔥 Reactivación de Clientes Anteriores (Recompra & Descuento)",
            category: "recompra",
            badge: "CLIENTES CALIENTES",
            badgeColor: "bg-amber-500/10 text-amber-600 border-amber-500/30",
            isFeatured: true,
            tips: "Contacta a clientes que ya te compraron hace semanas o meses para ofrecerles accesorios, mantenimiento o renovación.",
            template: (v) =>
`¡Hola${v.clientName}! 👋 Qué gusto saludarte, te escribe ${v.sellerName} de ATOMIC Solutions.

Te escribía para saber cómo ha estado funcionando el equipo que adquiriste con nosotros y comentarte que por ser CLIENTE PREFERENCIAL tienes habilitado un *15% DE DESCUENTO* en accesorios, repuestos o nuevas instalaciones de ${v.product}.

Además, si requieres mantenimiento o asesoría técnica, cuentas con nuestro respaldo directo.
Revisa las novedades de temporada en: ${v.storeUrl}

¿Hay algún requerimiento o equipo adicional que estés necesitando para tu casa o negocio en estos días?`
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
            id: "objecion_precio_caro",
            title: "🛡️ Manejo de Objeción: \"Está muy caro / Lo vi en $X en otro lado\"",
            category: "objeciones",
            badge: "DESTRUIR OBJECIÓN",
            badgeColor: "bg-red-500/10 text-red-600 border-red-500/30",
            tips: "Explica con contundencia la diferencia entre réplica informal y equipo original con respaldo.",
            template: (v) =>
`Comprendo perfectamente${v.clientName}. En el mercado informal hay opciones que parecen más económicas, pero casi siempre son réplicas sin garantía, sin soporte técnico y sin factura para respaldo ante el SRI.

En ATOMIC Solutions te entregamos:
1. Equipo 100% original en caja sellada con número de serie homologado.
2. Factura oficial legal que respalda tu inversión.
3. Garantía REAL de 1 año con reemplazo y soporte en Ecuador.
4. Asesoría técnica directa para configuración e instalación.

Por una diferencia mínima aseguras que tu inversión no se pierda al mes de uso. ¿Deseas que te mantengamos la oferta con el obsequio técnico incluido?`
        },
        {
            id: "objecion_solo_cotizando",
            title: "🎯 Manejo de Objeción: \"Solo estoy cotizando / Lo voy a pensar\"",
            category: "objeciones",
            badge: "RECUPERAR CLIENTE",
            badgeColor: "bg-orange-500/10 text-orange-600 border-orange-500/30",
            tips: "Congela el precio por tiempo limitado para forzar una decisión positiva.",
            template: (v) =>
`¡Totalmente de acuerdo${v.clientName}! Es bueno comparar antes de decidir. 

Solo para tu tranquilidad, te voy a dejar *CONGELADO EL PRECIO* de ${v.product} durante las próximas 48 horas, para que si te decides no te afecte la variación de inventario o fin de la promoción.

¿Te gustaría que te envíe un video de 30 segundos mostrando el equipo funcionando en vivo para que tengas todos los elementos al tomar la decisión?`
        },
        {
            id: "cierre_b2b_conjuntos",
            title: "🏢 Propuesta B2B para Administradores de Edificios / Empresas",
            category: "cierre",
            badge: "ALTO TICKET B2B",
            badgeColor: "bg-violet-500/10 text-violet-600 border-violet-500/30",
            tips: "Para juntas de condominios, conjuntos residenciales y constructoras.",
            template: (v) =>
`Estimados miembros de la directiva / administración${v.clientName}:

Les saluda ${v.sellerName}, asesor técnico corporativo de ATOMIC Solutions.
Ponemos a su disposición nuestra solución integral en ${v.product} con las siguientes ventajas institucionales:

• Inspección técnica preliminar sin costo en sitio.
• Equipos de alta demanda certificados con 1 año de garantía extendible.
• Factura electrónica corporativa y facilidades de pago para condominios.
• Respaldo técnico continuo y actas de entrega certificadas.

Pueden revisar nuestro portafolio de referencias en proyectos similares aquí:
👉 ${v.storeUrl}

¿Qué día de esta semana podemos coordinar una visita técnica de 15 minutos para relevar medidas exactas?`
        },
        {
            id: "garantia_soporte",
            title: "🛡️ Garantía Oficial de 1 Año & Soporte Técnico ATOMIC",
            category: "garantia",
            badge: "CONFIANZA TOTAL",
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

            {/* Category Filter Tabs - Marketplace Style */}
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
                {[
                    { id: "all", label: "🏢 Todos los Mensajes" },
                    { id: "marketplace", label: "🛒 Marketplace & Frío" },
                    { id: "whatsapp", label: "💬 Captura de WhatsApp" },
                    { id: "ofertas", label: "⚡ Ofertas Flash (Lunes/Miérc)" },
                    { id: "recompra", label: "🔥 Reactivación & Recompra" },
                    { id: "cierre", label: "🤝 Cierre & Envíos" },
                    { id: "objeciones", label: "🛡️ Manejo de Objeciones" },
                    { id: "garantia", label: "📜 Garantía & SRI" }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveCategory(tab.id as any)}
                        className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all border cursor-pointer ${
                            activeCategory === tab.id
                                ? "bg-orange-600 text-white border-orange-600 shadow-sm shadow-orange-600/30"
                                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
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
