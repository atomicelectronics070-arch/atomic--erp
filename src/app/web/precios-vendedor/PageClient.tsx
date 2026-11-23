"use client"

import React, { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import {
  Search, Copy, Check, ExternalLink, ShieldCheck, Truck, CreditCard,
  Percent, Sparkles, MessageSquare, PhoneCall, Download, ChevronDown,
  Layers, Package, AlertTriangle, ArrowRight, Laptop, Smartphone,
  Home, Wrench, Shield, CheckCircle2, X, HelpCircle, Flame, Gift,
  MapPin, Building, Clock, FileText, Zap, Phone, Share2
} from "lucide-react"

// ─── 100 MENSAJES CLASIFICADOS EN 10 CATEGORÍAS ───
const MESSAGE_CATEGORIES = [
  { id: "saludos", label: "1. Saludos & Primer Contacto (10)", count: 10 },
  { id: "fichas", label: "2. Ficha Técnica & Catálogo (10)", count: 10 },
  { id: "objecion-precio", label: "3. Objeción: Está muy caro (10)", count: 10 },
  { id: "objecion-anticipo", label: "4. Objeción: Desconfianza de Anticipo (10)", count: 10 },
  { id: "politica-envio", label: "5. Políticas de Envío & Contra Entrega (10)", count: 10 },
  { id: "cuentas-cierre", label: "6. Cuentas Bancarias & Cierre de Pago (10)", count: 10 },
  { id: "urgencia", label: "7. Cierre con Urgencia & Remate (10)", count: 10 },
  { id: "seguimiento", label: "8. Seguimiento a Clientes Fríos (10)", count: 10 },
  { id: "mayoristas", label: "9. Mayoristas & Distribución (6+ uds) (10)", count: 10 },
  { id: "postventa", label: "10. Post-Venta & Guías de Envío (10)", count: 10 }
]

const ALL_MESSAGES: Record<string, string[]> = {
  saludos: [
    "¡Hola! 👋 Qué gusto saludarte. Vi tu interés en nuestro producto en Marketplace. Cuéntame, ¿lo buscas para entrega en Quito o para envío a provincia?",
    "¡Buenas tardes! 🚀 Te saluda el equipo de ATOMIC Ecuador. Con mucho gusto te ayudo con información y disponibilidad inmediata. ¿Tienes alguna duda técnica o deseas coordinar el despacho?",
    "¡Hola! Con gusto te paso fotos reales y características. ¿Para qué ciudad necesitas la entrega para coordinar los tiempos exactos con bodega?",
    "¡Hola, qué tal! 👋 Tenemos stock disponible para despacho express hoy mismo. ¿Deseas retiro en nuestra oficina en Quito o prefieres entrega a domicilio?",
    "¡Saludos cordiales! Gracias por contactar a ATOMIC. Todos nuestros equipos cuentan con 1 año de garantía escrita y factura. ¿Qué modelo te gustaría revisar?",
    "¡Hola amigo/a! Sí, aún tenemos pocas unidades disponibles a precio de promoción. ¿En qué sector de la ciudad te encuentras?",
    "¡Buen día! Un gusto atenderte. Te comento que hoy tenemos activo un descuento especial por pronto pago. ¿Deseas que te comparta la cotización formal?",
    "¡Hola! Vi tu mensaje por el artículo publicado. Déjame confirmar el stock en bodega en este instante. ¿Tienes algún color o especificación de preferencia?",
    "¡Hola! Bienvenido/a a ATOMIC. Somos importadores directos en Quito. Te dejo nuestro catálogo con más de 3.000 productos garantizados. ¿Qué categoría buscas?",
    "¡Buenas tardes! Sí, producto 100% original, nuevo de paquete con garantía. ¿Te gustaría ver un video o fotos reales antes de concretar?"
  ],
  fichas: [
    "📄 *FICHA TÉCNICA OFICIAL ATOMIC:*\n• Condición: 100% Nuevo sellado en caja.\n• Garantía: 1 Año directo con nosotros.\n• Incluye todos sus accesorios originales.\n• Envío express asegurado. ¿Te gustaría reservar tu unidad?",
    "Te comparto los detalles del modelo: Cuenta con certificación de fábrica, componentes reforzados y soporte post-venta 24/7. Te adjunto fotos reales en este instante.",
    "Aquí tienes la especificación completa: Procesador de alto rendimiento, bajo consumo y máxima compatibilidad. Si deseas, te genero una proforma formal en PDF con tus datos.",
    "Para brindarte una propuesta exacta: ¿A nombre de quién o empresa emitimos la proforma y a qué número de WhatsApp te hacemos llegar el PDF oficial?",
    "Este equipo supera a las marcas genéricas porque incluye repuestos de fácil recambio y respaldo de servicio técnico directo en Quito. ¿Deseas verlo funcionando?",
    "Contamos con dos versiones: la versión estándar y la versión PRO con accesorios extra. ¿Cuál se ajusta mejor a tu presupuesto de compra?",
    "Te adjunto el enlace directo a nuestra landing page oficial con video demostrativo y testimonios de clientes: https://atomiccotizador.shop/web",
    "¡Excelente elección! Es uno de nuestros productos con mayor rotación por su durabilidad probada. Te paso los datos técnicos exactos a continuación:",
    "Mira esta comparativa rápida: por una pequeña diferencia de precio te llevas el modelo con mayor garantía y entrega express garantizada.",
    "Si necesitas la cotización para presentar a gerencia o compras, facilítame tu RUC o cédula y te envío el documento membretado en 5 minutos."
  ],
  "objecion-precio": [
    "Entiendo perfectamente tu punto. Sin embargo, nuestro valor incluye 1 año de garantía real, factura con IVA y respaldo técnico local. Lo barato en marketplace muchas veces sale carísimo al no tener a quién reclamar.",
    "Te comprendo. Ten en cuenta que nosotros somos empresa constituida en Quito (Sector El Labrador) y entregamos productos 100% originales nuevos, no remanufacturados ni copias.",
    "Si realizas el pago 100% anticipado hoy mismo, puedo autorizarte un descuento especial del 10% al 13% más envío gratis para que se ajuste a tu presupuesto. ¿Avanzamos?",
    "El precio refleja la calidad y durabilidad del componente. Con nosotros tienes la seguridad de que tu dinero está respaldado y te llegará exactamente lo que compraste.",
    "Permíteme consultarle a Dirección Comercial si podemos aplicarte la tarifa de distribuidor por ser tu primera compra con nosotros. ¿Estarías listo para concretar hoy?",
    "A veces se encuentran publicaciones muy baratas que son estafas o productos sin repuestos. Nosotros tenemos bodega física y repuestos para cada equipo que vendemos.",
    "Para tu tranquilidad: si sumas el flete, la garantía y el soporte técnico personalizado que te damos, nuestra oferta es la más rentable y segura del mercado.",
    "Te propongo algo: si te mantengo el precio de oferta con obsequio sorpresa en el paquete, ¿podemos coordinar la entrega para mañana?",
    "Compara nuestro servicio: te brindamos asesoría técnica antes y después de tu compra. Ningún vendedor informal te acompaña como lo hace ATOMIC.",
    "Por $5 o $10 dólares de diferencia, te aseguras un producto con respaldo legal y empresa con años de trayectoria en Ecuador."
  ],
  "objecion-anticipo": [
    "Comprendo totalmente tu cautela, hoy en día hay que ser precavidos. Por esa razón, en compras de $0 a $100 en Quito la entrega es 100% contra entrega: revisas el producto y pagas al instante.",
    "Para envíos a provincia, contamos con convenio oficial con transportadoras de recaudación. Tú solo cancelas el valor mínimo del flete ($5 a $7) y el valor del producto lo pagas en mano al recibirlo.",
    "Somos una empresa formal registrada. Te comparto nuestro RUC: 1709540478001 y la ubicación de nuestra oficina física en Quito (Sector El Labrador). Puedes verificarlo libremente.",
    "El anticipo en compras mayores o gama hogar es una seña de compromiso para movilizar el artículo de bodega aliada y asegurar que no haya viajes en vano. Tu dinero está 100% respaldado con proforma y comprobante oficial.",
    "Te paso nuestro comprobante bancario oficial a nombre de los directivos de la empresa para que verifiques que las cuentas son corporativas y auditables ante el SRI.",
    "Si tienes a algún familiar o conocido en Quito, puede acercarse a retirar el producto o coordinar una videollamada para que veas el paquete empacado antes de despacharlo.",
    "Revisa nuestras redes oficiales y testimonios en TikTok (@santiagoguzman216 / @juanguzman35886) y Facebook (Atomic Electronics Ecuador). Cientos de envíos semanales a todo el país.",
    "El anticipo no se pierde jamás: si hubiera algún problema de stock que no podamos resolver, se realiza la devolución inmediata de tu valor en menos de 2 horas.",
    "Para tu total confianza, te emito la proforma membretada con código de seguimiento único antes de que hagas cualquier depósito.",
    "Llevamos años equipando hogares y negocios en Ecuador. El anticipo es únicamente el protocolo estándar de despacho asegurado que nos permite mantener precios de importación."
  ],
  "politica-envio": [
    "🚚 *POLÍTICA OFICIAL DE ENTREGAS:*\n• Quito ($0 - $100): Contra entrega inmediata en tu domicilio o trabajo.\n• Provincias ($0 - $100): Abonas únicamente el flete y pagas el producto al recibirlo con transportadora aliada.\n• Compras $100 a $999: Contra entrega con el 50% de abono previo.\n• Equipos $1000+: 70% anticipo para importación/reserva.",
    "En la línea de Hogar y Cocina (hornos, encimeras, campanas): requerimos un anticipo de $20 a $100 según el modelo, ya que se trasladan desde bodegas asociadas bajo pedido de 24 a 48 horas.",
    "Para entregas en Quito dentro del perímetro urbano: nuestro mensajero te entrega, pruebas el encendido del equipo y cancelas en efectivo o transferencia directa.",
    "Los despachos a provincia se realizan por Servientrega o Cooperativa con guía de rastreo en tiempo real para que monitorees el paquete hasta tu ciudad.",
    "Si deseas entrega el mismo día en Quito: por favor confírmame antes de las 13:00 para ingresar tu pedido a la primera ruta de mensajería de la tarde.",
    "¿Prefieres retiro directo en bodega o te enviamos el producto con nuestro motorizado express a tu dirección exacta?",
    "Ten en cuenta que para activar el 13% de descuento especial, la compra debe ser 100% anticipada e incluye el envío gratis a cualquier cantón del Ecuador.",
    "Para envíos a Galápagos o zonas especiales de frontera: aplicamos una tarifa especial de flete aéreo/marítimo que se coordina previamente.",
    "Al momento de la entrega, te solicitamos firmar la hoja de recepción técnica para activar formalmente tu garantía de 1 año en el sistema.",
    "¿A qué dirección exacta y con qué persona de contacto coordinamos la entrega del paquete?"
  ],
  "cuentas-cierre": [
    "💳 *DATOS BANCARIOS OFICIALES PARA PAGO:*\n\n🟡 *BANCO PICHINCHA*\n• Titular: Santiago Guzmán\n• Cta. Ahorros: 2206020091\n• Cédula: 1709540478\n• Correo: sguzmanpal@yahoo.com\n\n🔴 *BANCO GUAYAQUIL*\n• Titular: Juan Pablo Guzmán Morales\n• Cta. Ahorros: 0124465041\n• Cédula: 1751940212\n\n_Por favor envía el comprobante visible para validar tu orden._",
    "Te dejo los datos para que realices la transferencia. Una vez hecha, envíame la captura de pantalla para separar tu equipo en bodega de inmediato.",
    "Perfecto, tenemos tu pedido listo en empaque. Puedes realizar el abono a nuestra cuenta de Banco Pichincha o Banco Guayaquil según tu preferencia.",
    "Apenas envíes el comprobante, nuestro sistema te asigna el código de despacho y te emitimos la nota de entrega oficial.",
    "Aceptamos transferencias directas de Pichincha a Pichincha (efectivización inmediata) o interbancarias directas sin costo adicional.",
    "Si vas a depositar por ventanilla o cajero automático: indícale al cajero los datos exactos que te acabé de compartir.",
    "Para congelar tu precio de promoción antes de que termine el lote: te recomiendo transferir hoy y así aseguramos tu entrega prioritaria.",
    "¿A qué banco se te hace más cómodo realizar el pago: Banco Pichincha o Banco Guayaquil?",
    "Comprobante recibido con éxito. Pasamos a validar con el departamento de contabilidad y te confirmamos tu guía en breves momentos.",
    "Muchas gracias por tu pago. Tu pedido ha ingresado a la cola de preparación. En unos minutos te comparto la foto del paquete rotulado."
  ],
  "urgencia": [
    "🔥 *ÚLTIMAS 2 UNIDADES EN STOCK:* Este producto tiene alta rotación y el lote se agota hoy. ¿Te lo separo con tu nombre para no perderlo?",
    "Te comento que esta promoción de fin de año con descuento aplica únicamente hasta agotar existencias del día. Si confirmas hoy, te mantengo el precio especial.",
    "Acaban de salir 3 pedidos de este mismo modelo para despacho. Me quedan solo 2 unidades disponibles en bodega principal. ¿Avanzamos?",
    "Si coordinamos tu pedido antes de que salga la camioneta a las 14:00, te llega hoy mismo en la tarde sin costo adicional de flete.",
    "El importador nos notificó que la siguiente remesa llegará con un incremento de precio del 15% por costos de flete marítimo. Aprovecha el valor actual.",
    "Estoy reservando una unidad en el sistema a tu nombre por 2 horas. Por favor confírmame antes de ese tiempo para no liberar el stock a otro cliente.",
    "Hoy cerramos inventario semanal de remate. Es la última oportunidad de llevarte este equipo con el combo de accesorios de regalo.",
    "No te quedes sin tu equipo para fin de año. En diciembre las empresas de logística se saturan y los pedidos se retrasan. ¡Asegura el tuyo hoy!",
    "Si confirmas en los próximos 30 minutos, te incluyo sin costo adicional una garantía extendida de soporte prioritario durante todo el año.",
    "Tengo a otro cliente consultando por este mismo artículo en Messenger. Como tú me escribiste primero, tienes la prioridad. ¿Te lo aparto?"
  ],
  "seguimiento": [
    "¡Hola! 👋 Quería saber si tuviste oportunidad de revisar la información y fotos del equipo que te compartí. ¿Tienes alguna consulta pendiente?",
    "¡Buen día! Te escribo porque hoy recibimos nuevo stock de este modelo y me acordé de tu interés. ¿Aún estás buscando tu equipo?",
    "¡Hola! ¿Cómo estás? Te comento que para los clientes que nos consultaron esta semana logramos habilitar un bono de descuento de $10 adicionales. ¿Te gustaría aprovecharlo?",
    "¡Hola amigo/a! Solo quería verificar si lograste resolver tu requerimiento o si deseas que te cotice otra opción más económica o diferente.",
    "¡Saludos! Estamos armando las rutas de entrega para mañana. Si deseas incluir tu pedido, avísame para coordinar el despacho sin recargos.",
    "¡Hola! Espero te encuentres muy bien. Te dejo por aquí nuestro catálogo actualizado de fin de año con promociones especiales por si te interesa.",
    "¿Pudiste revisar la proforma formal que te envié? Si requieres algún cambio en las condiciones o formas de pago, con gusto lo adaptamos."
  ],
  mayoristas: [
    "🤝 *PRECIOS MAYORISTAS Y DISTRIBUCIÓN DIRECTA (Desde 6 Unidades):*\nTe brindamos precios de importador en tarjetas electrónicas, drones, repuestos de laptop y gadgets para que revendas en tu cantón. ¿Qué línea te gustaría distribuir?",
    "Para negocios y técnicos: compras desde 6 piezas acceden al descuento mayorista del 25% al 35%. Facturamos legalmente y despachamos asegurado.",
    "¿Tienes local comercial o vendes por redes? Podemos registrarte como distribuidor oficial ATOMIC para que recibas ofertas de contenedor antes que el público general."
  ],
  postventa: [
    "📦 *CONFIRMACIÓN DE GUÍA & DESPACHO:*\nTu paquete ha sido despachado con éxito. Te adjunto la foto de la guía con el número de rastreo oficial para que hagas el seguimiento en línea.",
    "¡Hola! Nuestro sistema indica que tu paquete ya fue entregado. ¿Recibiste todo en orden y a entera satisfacción?",
    "Te agradecemos enormemente por confiar en ATOMIC. Tu garantía oficial de 1 año ya se encuentra registrada en nuestra base de datos con tu número de contacto.",
    "Si necesitas ayuda o asesoría para la primera configuración o instalación de tu equipo, escríbeme con toda confianza y te guiamos paso a paso.",
    "Nos encantaría conocer tu experiencia: ¿nos regalarías una breve reseña o calificación de 5 estrellas en nuestras redes? Nos ayuda mucho a seguir creciendo."
  ]
}

// ─── SUB-PESTAÑAS DE CATEGORÍAS REALES PARA TAB 2 ───
const SUB_CATEGORIES = [
  { id: "camaras", label: "📷 Cámaras de Seguridad", search: "camara", count: "405+ Items", icon: Shield },
  { id: "celulares", label: "📱 Celulares & Tablets", search: "celular", count: "650+ Items", icon: Smartphone },
  { id: "laptops", label: "💻 Laptops & Computación", search: "laptop", count: "185+ Items", icon: Laptop },
  { id: "cocina", label: "🍳 Cocina & Extracción", search: "cocina", count: "120+ Items", icon: Home },
  { id: "cerraduras", label: "🔐 Cerraduras Smart", search: "cerradura", count: "103+ Items", icon: ShieldCheck },
  { id: "energia", label: "⚡ UPS & Generadores", search: "regulador", count: "270+ Items", icon: Zap },
  { id: "repuestos", label: "🔧 Repuestos de Laptop", search: "bateria", count: "185+ Items", icon: Wrench },
  { id: "audio", label: "🔊 Audio & Sonido", search: "parlante", count: "250+ Items", icon: Sparkles },
  { id: "domotica", label: "🏠 Domótica & Smart", search: "wifi", count: "110+ Items", icon: Layers },
  { id: "alarmas", label: "🚨 Alarmas & Sensores", search: "alarma", count: "70+ Items", icon: AlertTriangle }
]

// ─── LANDINGS WEB OFICIALES ───
const LANDINGS_LIST = [
  { name: "Cerraduras Smart Biométricas", url: "/web/cerraduras-smart", badge: "Alta Demanda", desc: "Manijas biométricas para hogar y oficinas con 30% OFF en instalación." },
  { name: "Ecosistema Apple Ecuador", url: "/web/apple", badge: "VIP", desc: "iPhone, MacBooks, iPads con envío gratis nacional." },
  { name: "Laptops & Computación", url: "/web/laptops", badge: "Top Ventas", desc: "Portátiles empresariales, de estudio y alto rendimiento." },
  { name: "Línea de Repuestos de Laptop", url: "/web/repuestos", badge: "Mayoristas", desc: "Baterías, pantallas, teclados y cargadores para talleres." },
  { name: "Cámaras para Hogar 4K", url: "/web/camaras-hogar", badge: "Garantía 2 Años", desc: "Seguridad inteligente inalámbrica con visión nocturna." },
  { name: "Cercos Eléctricos Perimetrales", url: "/web/cercos-electricos", badge: "Seguridad", desc: "Sistemas electrificadores disuasivos de alta precisión." },
  { name: "Barreras Vehiculares Automáticas", url: "/web/barreras-vehiculares", badge: "Corporativo", desc: "Sistemas brushless de control de acceso para condominios." },
  { name: "Cargadores de Auto Eléctrico", url: "/web/cargadores-electricos", badge: "Movilidad", desc: "Wallbox Livoltek Mevo 7.3kW y cargadores portátiles 220V." },
  { name: "Cocinas & Encimeras Modernas", url: "/web/cocinas", badge: "Hogar", desc: "Encimeras de inducción y gas con diseño prémium." },
  { name: "Hornos Empotrables", url: "/web/hornos", badge: "Hogar", desc: "Hornos de alta eficiencia energética para cocinas de lujo." },
  { name: "Campanas Extractoras", url: "/web/campanas", badge: "Hogar", desc: "Campanas de isla y pared con filtros de carbono activo." },
  { name: "Bicicletas Eléctricas", url: "/web/bicicletas-electricas", badge: "Ecológico", desc: "Movilidad urbana ágil sin gasto en gasolina." },
  { name: "Scooters Eléctricos", url: "/web/scooters", badge: "Urbano", desc: "Scooters plegables de alta autonomía para la ciudad." },
  { name: "Generadores Eléctricos", url: "/web/generadores", badge: "Industrial", desc: "Plantas de energía para apagones, empresas y residencias." }
]

type TabType = 
  | "pvp-todos" 
  | "pvp-categorias" 
  | "pvp-landings" 
  | "beneficios" 
  | "promociones" 
  | "metodos-envio" 
  | "metodos-pago" 
  | "distribucion" 
  | "mensajes"
  | "contacto"

export default function PreciosVendedorClient() {
  const [activeTab, setActiveTab] = useState<TabType>("pvp-todos")
  const [selectedMsgCat, setSelectedMsgCat] = useState("saludos")
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [isComicOpen, setIsComicOpen] = useState(false)

  // Sub-categoría seleccionada en Tab 2
  const [activeSubCat, setActiveSubCat] = useState("camaras")
  const [catProducts, setCatProducts] = useState<any[]>([])
  const [loadingCatProducts, setLoadingCatProducts] = useState(false)

  // Products fetch state for Tab 1 (Buscador general)
  const [products, setProducts] = useState<any[]>([])
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const quickFilters = ["Camara", "iPhone", "PS5", "Cerradura", "Campana", "Laptop", "Generador", "Bateria", "Cocina"]

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    showToast(`✅ ¡${label} copiado al portapapeles!`)
  }

  // 1. Fetch reactivo en vivo para Tab 1 (Buscador General con Debounce)
  useEffect(() => {
    const fetchSearchProducts = async () => {
      setLoadingProducts(true)
      try {
        const query = searchTerm.trim()
        const url = query 
          ? `/api/public/matriz-precios?search=${encodeURIComponent(query)}&limit=90`
          : `/api/public/matriz-precios?limit=90`
        const res = await fetch(url)
        if (res.ok) {
          const data = await res.json()
          setProducts(data.products || [])
        }
      } catch (err) {
        console.error("Error searching products:", err)
      } finally {
        setLoadingProducts(false)
      }
    }

    const timer = setTimeout(fetchSearchProducts, 300)
    return () => clearTimeout(timer)
  }, [searchTerm])

  // 2. Fetch para Tab 2 (Sub-Pestañas de Categorías Reales)
  useEffect(() => {
    if (activeTab !== "pvp-categorias") return

    const fetchCategoryProducts = async () => {
      setLoadingCatProducts(true)
      try {
        const subCat = SUB_CATEGORIES.find(s => s.id === activeSubCat)
        const term = subCat?.search || "camara"
        const res = await fetch(`/api/public/matriz-precios?search=${encodeURIComponent(term)}&limit=90`)
        if (res.ok) {
          const data = await res.json()
          setCatProducts(data.products || [])
        }
      } catch (err) {
        console.error("Error loading category products:", err)
      } finally {
        setLoadingCatProducts(false)
      }
    }

    fetchCategoryProducts()
  }, [activeTab, activeSubCat])

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 font-sans selection:bg-orange-500/30 pb-28">
      {/* ── TOAST NOTIFICATION ── */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 inset-x-0 mx-auto w-fit max-w-sm z-50 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-black text-xs shadow-[0_10px_35px_rgba(16,185,129,0.4)] flex items-center gap-2"
          >
            <Check size={16} />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HEADER CORPORATIVO FORMAL & ACCESIBLE ── */}
      <header className="sticky top-0 z-40 bg-[#070b18]/95 backdrop-blur-2xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 via-orange-500 to-amber-400 flex items-center justify-center shadow-lg shadow-orange-500/30">
              <Sparkles className="text-white" size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black tracking-tight text-white">ATOMIC <span className="text-orange-400">PORTAL VENDEDORES</span></span>
                <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/40 text-[10px] font-mono font-bold uppercase tracking-wider">
                  Oficial 2026
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Matriz de Precios, Políticas de Entrega & Cuentas Bancarias</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/web"
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-200 transition-all flex items-center gap-1.5"
            >
              <span>Tienda Pública</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* ── HORIZONTAL SCROLLABLE TABS CON SNAP (ULTRA FLUIDO EN CELULAR) ── */}
        <div className="border-t border-white/5 bg-[#05070e] px-4 overflow-x-auto scrollbar-hide">
          <div className="max-w-7xl mx-auto flex items-center gap-2 py-2.5">
            {[
              { id: "pvp-todos", label: "📋 Todos los PVP", icon: Search },
              { id: "pvp-categorias", label: "🗂️ PVP Categorías", icon: Layers },
              { id: "contacto", label: "🏢 Quiénes Somos & Contacto", icon: MapPin },
              { id: "pvp-landings", label: "🌐 Landings Web", icon: ExternalLink },
              { id: "beneficios", label: "🎁 Bonos de la Semana", icon: Gift },
              { id: "promociones", label: "🎄 Descuentos Fin de Año", icon: Percent },
              { id: "metodos-envio", label: "🚚 Políticas de Envío", icon: Truck },
              { id: "metodos-pago", label: "💳 Cuentas Bancarias", icon: CreditCard },
              { id: "distribucion", label: "📦 Distribución (6+ Uds)", icon: Package },
              { id: "mensajes", label: "💬 100 Mensajes de Cierre", icon: MessageSquare },
            ].map(tab => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold font-heading transition-all duration-200 flex items-center gap-2 border ${
                    isActive
                      ? "bg-gradient-to-r from-orange-500 to-amber-500 text-black border-orange-400 shadow-md shadow-orange-950/40 font-black scale-102"
                      : "bg-[#0b1224] text-slate-300 border-white/10 hover:border-orange-500/40 hover:text-white"
                  }`}
                >
                  <tab.icon size={14} className={isActive ? "text-black" : "text-orange-400"} />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </header>

      {/* ── CONTENIDO PRINCIPAL SEGÚN PESTAÑA ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">

        {/* ═══════════ PESTAÑA 1: TODOS LOS PVP (BUSCADOR EN VIVO CON FOTO) ═══════════ */}
        {activeTab === "pvp-todos" && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0c1630] via-[#091024] to-[#050814] border border-blue-500/30 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-md bg-blue-500/20 text-blue-300 uppercase tracking-widest block w-fit mb-2">
                    Catálogo Oficial de Precios
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">Buscador Rápido de Precios Públicos (PVP)</h2>
                  <p className="text-slate-400 text-xs sm:text-sm mt-1">
                    Consulta el precio autorizado para tu cliente, fotos reales y calcula tu comisión del 20% al instante.
                  </p>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                    ✓ 3.000+ Productos Activos
                  </span>
                </div>
              </div>

              {/* Input Buscador */}
              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Escribe el nombre del producto (ej: Camara, iPhone, Freidora, Cerradura, Laptop, Campana)..."
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-black/60 border-2 border-white/10 focus:border-orange-500 text-white placeholder-slate-500 text-sm focus:outline-none transition-all shadow-inner"
                />
              </div>

              {/* Quick Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide pt-1">
                <span className="text-[11px] font-mono text-slate-400 shrink-0 mr-1">Filtros rápidos:</span>
                {quickFilters.map(filter => (
                  <button
                    key={filter}
                    onClick={() => setSearchTerm(filter)}
                    className={`px-3 py-1 rounded-lg border text-xs font-semibold shrink-0 transition-colors ${
                      searchTerm.toLowerCase() === filter.toLowerCase()
                        ? "bg-orange-500 text-black border-orange-400 font-bold"
                        : "bg-white/5 hover:bg-orange-500/20 hover:text-orange-300 border-white/10 text-slate-300"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 text-xs font-bold shrink-0 hover:bg-rose-500/30"
                  >
                    ✕ Limpiar
                  </button>
                )}
              </div>
            </div>

            {/* Listado de Productos con Recuadro de Imagen Designado */}
            {loadingProducts ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-slate-400 text-xs font-mono">Buscando en vivo en la base de datos de ATOMIC...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16 bg-[#080d1e] rounded-3xl border border-white/10 p-8 space-y-3">
                <Package size={40} className="text-slate-500 mx-auto" />
                <h3 className="text-lg font-bold text-white">No se encontraron productos con ese término</h3>
                <p className="text-slate-400 text-xs max-w-md mx-auto">
                  Prueba buscando con palabras como &ldquo;Camara&rdquo;, &ldquo;Apple&rdquo;, &ldquo;Laptop&rdquo;, &ldquo;Cerradura&rdquo; o &ldquo;Generador&rdquo;. Si requieres cotizar un artículo bajo pedido especial, consulta a Stefy (+593 98 947 6556).
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {products.map((p, idx) => {
                  const saleP = Number(p.salePrice) || 0
                  const comision20 = saleP * 0.20
                  return (
                    <div
                      key={p.id || idx}
                      className="p-5 rounded-3xl bg-[#091124] border border-white/10 hover:border-orange-500/50 transition-all flex flex-col justify-between space-y-4 group shadow-lg shadow-black/40"
                    >
                      {/* Recuadro de Imagen Designado (Medio Grande para Visibilidad Óptima) */}
                      <div className="w-full h-48 sm:h-52 bg-slate-950/80 rounded-2xl border border-white/5 overflow-hidden flex items-center justify-center relative p-3 group-hover:border-orange-500/30 transition-all">
                        {p.image ? (
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                            onError={(e) => {
                              (e.currentTarget as HTMLElement).style.display = 'none';
                              const parent = (e.currentTarget as HTMLElement).parentElement;
                              if (parent) {
                                const fallback = parent.querySelector('.img-fallback');
                                if (fallback) fallback.classList.remove('hidden');
                              }
                            }}
                          />
                        ) : null}
                        <div className={`img-fallback flex flex-col items-center justify-center text-slate-600 gap-1.5 ${p.image ? 'hidden' : ''}`}>
                          <Package size={36} className="text-slate-500" />
                          <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">ATOMIC Catálogo</span>
                        </div>
                        <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[10px] font-mono text-slate-300 border border-white/10 font-bold">
                          {p.category || "General"}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <span className="text-emerald-400 font-bold">✓ Stock Inmediato</span>
                          <span className="text-slate-400 font-bold">SKU: {p.sku || "N/A"}</span>
                        </div>
                        <h4 className="text-sm font-bold text-white leading-snug line-clamp-2 group-hover:text-orange-300 transition-colors">
                          {p.name}
                        </h4>
                      </div>

                      <div className="pt-3 border-t border-white/5 space-y-2">
                        <div className="flex items-baseline justify-between">
                          <div>
                            <span className="text-[10px] text-slate-400 font-mono block">PVP VENTA:</span>
                            <span className="text-2xl font-black text-white font-mono">
                              ${saleP.toFixed(2)} <span className="text-xs text-slate-400 font-normal">USD</span>
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-emerald-400 font-mono block font-bold">TU COMISIÓN (20%):</span>
                            <span className="text-base font-black text-emerald-400 font-mono">
                              +${comision20.toFixed(2)} USD
                            </span>
                          </div>
                        </div>

                        {/* Botón rápido para copiar cotización de este producto */}
                        <button
                          onClick={() => {
                            const txt = `Hola estimado/a cliente. Con gusto le cotizo el producto:\n\n📦 *${p.name}*\n• SKU: ${p.sku || 'N/A'}\n• Categoría: ${p.category || 'General'}\n• Garantía: 1 Año directa con ATOMIC Ecuador.\n• PVP Oficial: $${saleP.toFixed(2)} USD\n\n¿Desea entrega a domicilio en Quito o despacho asegurado a provincia?`
                            handleCopyText(txt, `Cotización de ${p.name.substring(0, 20)}...`)
                          }}
                          className="w-full py-2.5 rounded-xl bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/40 text-orange-300 font-bold text-xs transition-all flex items-center justify-center gap-2 active:scale-98"
                        >
                          <Copy size={13} />
                          <span>Copiar Cotización Lista</span>
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ═══════════ PESTAÑA 2: PVP POR CATEGORÍAS (CON SUB-PESTAÑAS ACTIVAS & FOTOS) ═══════════ */}
        {activeTab === "pvp-categorias" && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-gradient-to-br from-[#120e24] via-[#090b1c] to-[#040610] border border-purple-500/30 space-y-3 shadow-xl">
              <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-md bg-purple-500/20 text-purple-300 uppercase tracking-widest block w-fit">
                Líneas de Negocio Oficiales & Sub-Pestañas
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Catálogo de PVPs Clasificado por Categorías</h2>
              <p className="text-slate-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
                Selecciona la sub-pestaña de la categoría para cargar en vivo sus productos oficiales con imagen, PVP de venta y cálculo de tu 20% de comisión.
              </p>

              {/* ── SUB-PESTAÑAS HORIZONTALES ACTIVAS ── */}
              <div className="pt-2 flex items-center gap-2 overflow-x-auto scrollbar-hide">
                {SUB_CATEGORIES.map(sub => {
                  const isSubActive = activeSubCat === sub.id
                  return (
                    <button
                      key={sub.id}
                      onClick={() => setActiveSubCat(sub.id)}
                      className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                        isSubActive
                          ? "bg-purple-600 text-white border-purple-400 shadow-lg shadow-purple-900/50 scale-102"
                          : "bg-slate-900/80 text-slate-300 border-white/10 hover:border-purple-500/40 hover:text-white"
                      }`}
                    >
                      <sub.icon size={14} className={isSubActive ? "text-white" : "text-purple-400"} />
                      <span>{sub.label}</span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${isSubActive ? "bg-black/30 text-purple-200" : "bg-white/5 text-slate-400"}`}>
                        {sub.count}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Listado de Productos de la Sub-Categoría */}
            {loadingCatProducts ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-slate-400 text-xs font-mono">Cargando productos de la sub-categoría seleccionada...</p>
              </div>
            ) : catProducts.length === 0 ? (
              <div className="text-center py-16 bg-[#080d1e] rounded-3xl border border-white/10 p-8 space-y-3">
                <Package size={40} className="text-slate-500 mx-auto" />
                <h3 className="text-lg font-bold text-white">No se encontraron artículos en esta sección</h3>
                <p className="text-slate-400 text-xs max-w-md mx-auto">
                  Prueba seleccionando otra sub-pestaña superior o consulta con Stefy en WhatsApp.
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {catProducts.map((p, idx) => {
                  const saleP = Number(p.salePrice) || 0
                  const comision20 = saleP * 0.20
                  return (
                    <div
                      key={p.id || idx}
                      className="p-5 rounded-3xl bg-[#091124] border border-white/10 hover:border-purple-500/50 transition-all flex flex-col justify-between space-y-4 group shadow-lg shadow-black/40"
                    >
                      {/* Recuadro de Imagen Designado */}
                      <div className="w-full h-48 sm:h-52 bg-slate-950/80 rounded-2xl border border-white/5 overflow-hidden flex items-center justify-center relative p-3 group-hover:border-purple-500/30 transition-all">
                        {p.image ? (
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                            onError={(e) => {
                              (e.currentTarget as HTMLElement).style.display = 'none';
                              const parent = (e.currentTarget as HTMLElement).parentElement;
                              if (parent) {
                                const fallback = parent.querySelector('.img-fallback');
                                if (fallback) fallback.classList.remove('hidden');
                              }
                            }}
                          />
                        ) : null}
                        <div className={`img-fallback flex flex-col items-center justify-center text-slate-600 gap-1.5 ${p.image ? 'hidden' : ''}`}>
                          <Package size={36} className="text-slate-500" />
                          <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">ATOMIC Catálogo</span>
                        </div>
                        <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[10px] font-mono text-slate-300 border border-white/10 font-bold">
                          {p.category || "General"}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <span className="text-emerald-400 font-bold">✓ Stock Inmediato</span>
                          <span className="text-slate-400 font-bold">SKU: {p.sku || "N/A"}</span>
                        </div>
                        <h4 className="text-sm font-bold text-white leading-snug line-clamp-2 group-hover:text-purple-300 transition-colors">
                          {p.name}
                        </h4>
                      </div>

                      <div className="pt-3 border-t border-white/5 space-y-2">
                        <div className="flex items-baseline justify-between">
                          <div>
                            <span className="text-[10px] text-slate-400 font-mono block">PVP VENTA:</span>
                            <span className="text-2xl font-black text-white font-mono">
                              ${saleP.toFixed(2)} <span className="text-xs text-slate-400 font-normal">USD</span>
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-emerald-400 font-mono block font-bold">TU COMISIÓN (20%):</span>
                            <span className="text-base font-black text-emerald-400 font-mono">
                              +${comision20.toFixed(2)} USD
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            const txt = `Hola estimado/a cliente. Con gusto le cotizo el producto:\n\n📦 *${p.name}*\n• SKU: ${p.sku || 'N/A'}\n• Categoría: ${p.category || 'General'}\n• Garantía: 1 Año directa con ATOMIC Ecuador.\n• PVP Oficial: $${saleP.toFixed(2)} USD\n\n¿Desea entrega a domicilio en Quito o despacho asegurado a provincia?`
                            handleCopyText(txt, `Cotización de ${p.name.substring(0, 20)}...`)
                          }}
                          className="w-full py-2.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/40 text-purple-300 font-bold text-xs transition-all flex items-center justify-center gap-2 active:scale-98"
                        >
                          <Copy size={13} />
                          <span>Copiar Cotización Lista</span>
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ═══════════ PESTAÑA 3: QUIÉNES SOMOS & CONTACTO OFICIAL ═══════════ */}
        {activeTab === "contacto" && (
          <div className="space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0e1c2e] via-[#07111c] to-[#040912] border-2 border-cyan-500/40 space-y-3 shadow-xl">
              <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-md bg-cyan-500/20 text-cyan-300 uppercase tracking-widest block w-fit">
                Información Institucional & Canales Directos
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white">¿Quiénes Somos? Respaldo & Contacto Oficial</h2>
              <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
                ATOMIC Electronics Ecuador (división de AB Ingenieros) es una empresa legalmente constituida dedicada a la importación y comercialización mayorista de seguridad electrónica, tecnología, computación y equipamiento de hogar con garantía escrita de 1 año.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Tarjeta 1: Datos Fiscales y Legales */}
              <div className="p-6 sm:p-8 rounded-3xl bg-[#091122] border border-white/10 space-y-5 shadow-lg">
                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                    <Building size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">Datos Corporativos & RUC</h3>
                    <p className="text-xs text-slate-400 font-mono">Registro Oficial ante el SRI Ecuador</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                    <span className="text-slate-400 font-bold uppercase">Razón Social:</span>
                    <span className="text-white font-semibold">ATOMIC Electronics / AB Ingenieros</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                    <span className="text-slate-400 font-bold uppercase">RUC de Facturación:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-cyan-400 font-mono font-bold">1709540478001</span>
                      <button
                        onClick={() => handleCopyText("1709540478001", "RUC Oficial")}
                        className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white"
                        title="Copiar RUC"
                      >
                        <Copy size={13} />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                    <span className="text-slate-400 font-bold uppercase">Sede Física Central:</span>
                    <span className="text-white font-semibold text-right">Quito Norte, Sector El Labrador</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                    <span className="text-slate-400 font-bold uppercase">Horario de Atención:</span>
                    <span className="text-emerald-400 font-bold">Lunes a Sábado: 08:30 - 18:30</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5">
                    <span className="text-slate-400 font-bold uppercase">Garantía Escrita:</span>
                    <span className="text-amber-400 font-bold">1 Año Directo en Todos los Artículos</span>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href="https://maps.google.com/?q=Quito+Sector+El+Labrador"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <MapPin size={15} className="text-cyan-400" />
                    <span>Ver Ubicación en Google Maps</span>
                  </a>
                </div>
              </div>

              {/* Tarjeta 2: Directorio de Contactos Directos */}
              <div className="p-6 sm:p-8 rounded-3xl bg-[#091122] border border-white/10 space-y-5 shadow-lg">
                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">Canales Directos de Atención</h3>
                    <p className="text-xs text-slate-400 font-mono">Soporte Comercial, Admisión & Bodega</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Stefy */}
                  <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase block">Coordinación Operativa & Admisión</span>
                      <h4 className="text-sm font-bold text-white">Stefy</h4>
                      <p className="text-xs text-slate-400 font-mono">+593 98 947 6556</p>
                    </div>
                    <a
                      href="https://wa.me/593989476556?text=Saludos%20Stefy%2C%20solicito%20asistencia%20comercial%20o%20soporte%20de%20bodega."
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                    >
                      <MessageSquare size={13} />
                      <span>WhatsApp</span>
                    </a>
                  </div>

                  {/* Juan Pablo Guzmán */}
                  <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-orange-400 uppercase block">Dirección Comercial</span>
                      <h4 className="text-sm font-bold text-white">Juan Pablo Guzmán Morales</h4>
                      <p className="text-xs text-slate-400 font-mono">+593 98 947 6556</p>
                    </div>
                    <a
                      href="https://wa.me/593989476556?text=Saludos%20Director%20Juan%20Guzm%C3%A1n%2C%20requiero%20asistencia%20para%20un%20cierre%20comercial."
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                    >
                      <MessageSquare size={13} />
                      <span>WhatsApp</span>
                    </a>
                  </div>

                  {/* Santiago Guzmán */}
                  <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-purple-400 uppercase block">Gerencia General & Finanzas</span>
                      <h4 className="text-sm font-bold text-white">Santiago Guzmán</h4>
                      <p className="text-xs text-slate-400 font-mono">+593 98 425 2528</p>
                    </div>
                    <a
                      href="https://wa.me/593984252528?text=Saludos%20Santiago%20Guzm%C3%A1n%2C%20le%20escribo%20desde%20el%20portal%20comercial%20ATOMIC."
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                    >
                      <MessageSquare size={13} />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════ PESTAÑA 4: LANDINGS WEB ═══════════ */}
        {activeTab === "pvp-landings" && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0a1a2e] via-[#07111e] to-[#040810] border border-cyan-500/30 space-y-2 shadow-xl">
              <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-md bg-cyan-500/20 text-cyan-300 uppercase tracking-widest block w-fit">
                Recursos para Clientes
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Landings Pages Oficiales para Enviar a Clientes</h2>
              <p className="text-slate-400 text-xs sm:text-sm max-w-2xl">
                Copia y comparte directamente el enlace de cada landing. Cuentan con diseño de alta conversión, fichas técnicas y fotos de catálogo.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {LANDINGS_LIST.map((l, i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl bg-[#091122] border border-white/10 hover:border-cyan-500/50 transition-all flex flex-col justify-between space-y-4 shadow-md"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono font-bold uppercase">
                        {l.badge}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-white">{l.name}</h4>
                    <p className="text-xs text-slate-400">{l.desc}</p>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center gap-2">
                    <button
                      onClick={() => handleCopyText(`https://atomiccotizador.shop${l.url}`, `Enlace de ${l.name}`)}
                      className="flex-1 py-2 rounded-xl bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/40 text-orange-300 font-bold text-xs transition-all flex items-center justify-center gap-1.5"
                    >
                      <Copy size={13} />
                      <span>Copiar Link</span>
                    </button>
                    <Link
                      href={l.url}
                      target="_blank"
                      className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-bold flex items-center justify-center"
                      title="Abrir en pestaña nueva"
                    >
                      <ExternalLink size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════ PESTAÑA 5: BENEFICIOS & BONOS DE LA SEMANA ═══════════ */}
        {activeTab === "beneficios" && (
          <div className="space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#1c1208] via-[#140c06] to-[#0a0603] border-2 border-amber-500/40 space-y-4 shadow-2xl">
              <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase tracking-widest">
                <Gift size={16} /> Esquema de Incentivos Semanales · Noviembre 2026
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white">Bonificaciones y Recompensas de la Semana</h2>
              <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
                Además de tu comisión directa del 20%, premiamos activamente el cierre de ventas y la constancia de los asesores comerciales que ejecutan llamadas reales.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Bono 1: Bono por Venta Rápida */}
              <div className="p-6 rounded-3xl bg-[#0e1628] border-2 border-emerald-500/40 space-y-4 shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <Flame size={24} />
                </div>
                <div>
                  <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider block">Por Cada Venta Cerrada</span>
                  <h3 className="text-xl font-black text-white mt-1">Bono Flash de $5 a $10 USD</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Recibe un incentivo líquido inmediato de <strong>$5 USD</strong> (en tickets de $50 a $250) o <strong>$10 USD</strong> (en tickets mayores a $250) sumado al 20% de tu comisión base.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-emerald-500/20 text-[11px] font-mono text-emerald-300">
                  ⚡ Se transfiere apenas se confirma el pago del cliente.
                </div>
              </div>

              {/* Bono 2: Bono de Rendimiento Mensual */}
              <div className="p-6 rounded-3xl bg-[#140e26] border-2 border-purple-500/40 space-y-4 shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                  <Sparkles size={24} />
                </div>
                <div>
                  <span className="text-[11px] font-mono font-bold text-purple-400 uppercase tracking-wider block">Escalafón Cumplido</span>
                  <h3 className="text-xl font-black text-white mt-1">Clasificación a Sueldo Fijo</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Al cumplir los 30 días con tu bitácora de publicaciones y llamadas activas, desbloqueas tu bono base mensual ($25, $100, $200 o $450 USD).
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-purple-500/20 text-[11px] font-mono text-purple-300">
                  🎯 Liquidación directa a tu cuenta bancaria el día 30.
                </div>
              </div>

              {/* Bono 3: Envío Gratis en Cierres 100% Anticipados */}
              <div className="p-6 rounded-3xl bg-[#1c1408] border-2 border-amber-500/40 space-y-4 shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  <Gift size={24} />
                </div>
                <div>
                  <span className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-wider block">Herramienta de Cierre</span>
                  <h3 className="text-xl font-black text-white mt-1">Envío Gratis & Obsequio</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Usa el beneficio oficial: Si tu cliente realiza el abono del 100% anticipado, ATOMIC absorbe el costo del flete nacional a cualquier provincia.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-amber-500/20 text-[11px] font-mono text-amber-300">
                  🎁 Gancho comercial infalible para cerrar hoy mismo.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════ PESTAÑA 6: DESCUENTOS FIN DE AÑO ═══════════ */}
        {activeTab === "promociones" && (
          <div className="space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#241014] via-[#160a0d] to-[#0a0507] border-2 border-rose-500/40 space-y-4 shadow-2xl">
              <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-md bg-rose-500/20 text-rose-300 uppercase tracking-widest block w-fit">
                Campaña Oficial de Descuentos 2026
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white">Descuentos Especiales según Método de Pago Anticipado</h2>
              <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
                Autorizaciones oficiales de Dirección Comercial para aplicar descuentos reales a clientes que cancelen la totalidad de su compra por adelantado.
              </p>
            </div>

            {/* Tarjeta Gráfica Oficial de Descuentos */}
            <div className="p-6 rounded-3xl bg-[#0d1424] border-2 border-white/10 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Infografía Oficial: Descuentos por Pago Anticipado</h3>
                  <p className="text-xs text-slate-400">Descarga y comparte esta imagen con tus clientes para sustentar la rebaja.</p>
                </div>
                <a
                  href="/images/pagos/politicas-descuentos-anticipo.png"
                  download="politicas-descuentos-anticipo.png"
                  className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 shrink-0 transition-all shadow-md"
                >
                  <Download size={14} />
                  <span>Descargar Imagen</span>
                </a>
              </div>

              <div className="rounded-2xl overflow-hidden border border-white/10 bg-black flex justify-center p-2">
                <img
                  src="/images/pagos/politicas-descuentos-anticipo.png"
                  alt="Políticas de Descuentos por Pago Anticipado"
                  className="max-h-[500px] w-auto object-contain rounded-xl"
                />
              </div>
            </div>

            {/* Bloques de Texto Copiables */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 rounded-3xl bg-[#091122] border-2 border-rose-500/40 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-rose-400 uppercase">Compras $500 - $1.000+</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-xs font-black">Hasta 13% OFF</span>
                </div>
                <h4 className="text-lg font-black text-white">Descuento VIP del 13%</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Aplica para clientes que paguen el <strong>100% anticipado</strong> en órdenes de $500 en adelante. Incluye <strong>envío a domicilio totalmente gratis</strong> en todo el Ecuador.
                </p>
                <button
                  onClick={() => handleCopyText("🎉 ¡Excelente noticia! Al cancelar el 100% anticipado de tu compra mayor a $500, te aplicamos un DESCUENTO EXCLUSIVO DEL 13% sobre el total y te OBSEQUIAMOS el envío a domicilio a tu ciudad.", "Mensaje Descuento 13%")}
                  className="w-full py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-bold text-xs transition-all flex items-center justify-center gap-2"
                >
                  <Copy size={13} />
                  <span>Copiar Mensaje al Cliente</span>
                </button>
              </div>

              <div className="p-6 rounded-3xl bg-[#091122] border-2 border-amber-500/40 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-400 uppercase">Compras $100 - $499</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black">Hasta 10% OFF</span>
                </div>
                <h4 className="text-lg font-black text-white">Descuento Plus del 10%</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Aplica para compras de $100 a $499 cancelando el 100% anticipado. Se otorga despacho preferencial y embalaje reforzado sin costo adicional.
                </p>
                <button
                  onClick={() => handleCopyText("🎁 Si realizas el pago del 100% anticipado hoy mismo, te autorizo un DESCUENTO ESPECIAL DEL 10% más despacho preferencial express asegurado a tu domicilio.", "Mensaje Descuento 10%")}
                  className="w-full py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs transition-all flex items-center justify-center gap-2"
                >
                  <Copy size={13} />
                  <span>Copiar Mensaje al Cliente</span>
                </button>
              </div>

              <div className="p-6 rounded-3xl bg-[#091122] border-2 border-blue-500/40 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-blue-400 uppercase">Compras $0 - $99</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-black">5% OFF</span>
                </div>
                <h4 className="text-lg font-black text-white">Descuento Base del 5%</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Para compras menores a $100 con pago anticipado del 100%. Te permite redondear el precio final y cerrar al cliente indeciso al instante.
                </p>
                <button
                  onClick={() => handleCopyText("✅ Por pronto pago anticipado te otorgo un 5% de descuento inmediato para cerrar tu orden hoy mismo y asegurar la entrega inmediata.", "Mensaje Descuento 5%")}
                  className="w-full py-2.5 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 text-blue-300 font-bold text-xs transition-all flex items-center justify-center gap-2"
                >
                  <Copy size={13} />
                  <span>Copiar Mensaje al Cliente</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════ PESTAÑA 7: POLÍTICAS DE ENVÍO & ANTICIPOS ═══════════ */}
        {activeTab === "metodos-envio" && (
          <div className="space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0c1a2e] via-[#07111f] to-[#040812] border-2 border-cyan-500/40 space-y-4 shadow-2xl">
              <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-md bg-cyan-500/20 text-cyan-300 uppercase tracking-widest block w-fit">
                Protocolo Operativo de Entregas 2026
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white">Políticas Oficiales de Envío, Bodegas & Anticipos</h2>
              <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
                Reglamento para coordinar despachos contra entrega y compras bajo pedido de 24 a 48 horas en Quito y provincias del Ecuador.
              </p>
            </div>

            {/* Imagen Descargable de Políticas de Envío */}
            <div className="p-6 rounded-3xl bg-[#0d1424] border-2 border-white/10 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Infografía Oficial: Políticas de Envío y Contra Entrega</h3>
                  <p className="text-xs text-slate-400">Guarda esta imagen para enviarla a clientes que tengan dudas sobre la modalidad de entrega.</p>
                </div>
                <a
                  href="/images/pagos/politicas-envios-anticipos.png"
                  download="politicas-envios-anticipos.png"
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 shrink-0 transition-all shadow-md"
                >
                  <Download size={14} />
                  <span>Descargar Imagen</span>
                </a>
              </div>

              <div className="rounded-2xl overflow-hidden border border-white/10 bg-black flex justify-center p-2">
                <img
                  src="/images/pagos/politicas-envios-anticipos.png"
                  alt="Políticas Oficiales de Envío y Contra Entrega"
                  className="max-h-[500px] w-auto object-contain rounded-xl"
                />
              </div>
            </div>

            {/* Resumen Detallado por Gama */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Gama Hogar & Cocina */}
              <div className="p-6 rounded-3xl bg-[#091122] border-2 border-amber-500/40 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  <Home size={20} />
                </div>
                <h4 className="text-base font-bold text-white">Hogar & Cocina (Bajo Pedido)</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Para campanas, hornos y encimeras se requiere un <strong>anticipo de $20 a $100 USD</strong> para movilizar el equipo desde bodegas asociadas. Plazo de entrega: <strong>24 a 48 horas</strong> directo a domicilio.
                </p>
                <div className="p-2.5 rounded-xl bg-black/40 border border-amber-500/20 text-[11px] font-mono text-amber-300">
                  ⚠️ No se traslada línea blanca sin abono previo.
                </div>
              </div>

              {/* Gama Tecnología en Quito */}
              <div className="p-6 rounded-3xl bg-[#091122] border-2 border-blue-500/40 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                  <Laptop size={20} />
                </div>
                <h4 className="text-base font-bold text-white">Tecnología & Demostraciones</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  En Quito se realizan pruebas, encendido y demostraciones al momento de la entrega para la mayoría de dispositivos. Si el modelo es especial de bodega aledaña, se coordina entrega inmediata previa llamada.
                </p>
                <div className="p-2.5 rounded-xl bg-black/40 border border-blue-500/20 text-[11px] font-mono text-blue-300">
                  ⚡ Entregas el mismo día confirmando antes de 13:00.
                </div>
              </div>

              {/* Rango de Valores y Convenio */}
              <div className="p-6 rounded-3xl bg-[#091122] border-2 border-emerald-500/40 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <Truck size={20} />
                </div>
                <h4 className="text-base font-bold text-white">Convenio Provincias & Escalas</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  • <strong>$0 - $100 USD:</strong> En provincia pagan flete mínimo ($5 - $7) y el valor del producto lo pagan contra entrega a la transportadora aliada con convenio.<br />
                  • <strong>$100 - $999 USD:</strong> Contra entrega con 50% de abono previo.<br />
                  • <strong>$1.000+ USD:</strong> 70% anticipo por importación o combos de alto valor.
                </p>
                <div className="p-2.5 rounded-xl bg-black/40 border border-emerald-500/20 text-[11px] font-mono text-emerald-300">
                  🛡️ Convenio de recaudación 100% seguro.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════ PESTAÑA 8: CUENTAS BANCARIAS OFICIALES ═══════════ */}
        {activeTab === "metodos-pago" && (
          <div className="space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#1c1808] via-[#120f06] to-[#080702] border-2 border-amber-500/40 space-y-4 shadow-2xl">
              <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 uppercase tracking-widest block w-fit">
                Cuentas Empresariales Autorizadas
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white">Cuentas Bancarias para Depósitos & Transferencias</h2>
              <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
                Utiliza exclusivamente estas cuentas bancarias oficiales a nombre de los directivos de ATOMIC. Disponen de tarjetas gráficas oficiales y bloques de texto con botón para copiar en 1 clic.
              </p>
            </div>

            {/* Grid de 2 Cuentas Bancarias */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Banco Guayaquil - Juan Pablo Guzmán */}
              <div className="p-6 rounded-3xl bg-[#0f1424] border-2 border-rose-500/40 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500" />
                    <h3 className="text-lg font-black text-white">Banco Guayaquil (Ahorros)</h3>
                  </div>
                  <a
                    href="/images/pagos/banco-guayaquil.png"
                    download="banco-guayaquil-atomic.png"
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white"
                    title="Descargar Tarjeta"
                  >
                    <Download size={16} />
                  </a>
                </div>

                <div className="rounded-2xl overflow-hidden border border-white/10 bg-black flex justify-center p-2">
                  <img
                    src="/images/pagos/banco-guayaquil.png"
                    alt="Cuenta Banco Guayaquil"
                    className="max-h-[220px] w-auto object-contain rounded-xl"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-black/50 border border-white/5 space-y-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Banco:</span>
                    <span className="text-white font-bold">Banco Guayaquil</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tipo de Cuenta:</span>
                    <span className="text-white font-bold">Ahorros</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Número de Cuenta:</span>
                    <span className="text-rose-400 font-bold text-sm">0124465041</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Titular:</span>
                    <span className="text-white font-bold">Juan Pablo Guzmán Morales</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Cédula:</span>
                    <span className="text-white font-bold">1751940212</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const txt = `🔴 DATOS DE PAGO - BANCO GUAYAQUIL\n• Banco: Banco Guayaquil\n• Tipo de Cuenta: Ahorros\n• Número: 0124465041\n• Titular: Juan Pablo Guzmán Morales\n• Cédula: 1751940212\n\nPor favor envía el comprobante visible tras realizar la transferencia.`
                    handleCopyText(txt, "Datos Banco Guayaquil")
                  }}
                  className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-950/40"
                >
                  <Copy size={15} />
                  <span>Copiar Datos Banco Guayaquil</span>
                </button>
              </div>

              {/* Banco Pichincha - Santiago Guzmán */}
              <div className="p-6 rounded-3xl bg-[#0f1424] border-2 border-amber-500/40 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-400" />
                    <h3 className="text-lg font-black text-white">Banco Pichincha (Ahorros)</h3>
                  </div>
                  <a
                    href="/images/pagos/banco-pichincha.png"
                    download="banco-pichincha-atomic.png"
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white"
                    title="Descargar Tarjeta"
                  >
                    <Download size={16} />
                  </a>
                </div>

                <div className="rounded-2xl overflow-hidden border border-white/10 bg-black flex justify-center p-2">
                  <img
                    src="/images/pagos/banco-pichincha.png"
                    alt="Cuenta Banco Pichincha"
                    className="max-h-[220px] w-auto object-contain rounded-xl"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-black/50 border border-white/5 space-y-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Banco:</span>
                    <span className="text-white font-bold">Banco Pichincha</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tipo de Cuenta:</span>
                    <span className="text-white font-bold">Ahorros</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Número de Cuenta:</span>
                    <span className="text-amber-400 font-bold text-sm">2206020091</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Titular:</span>
                    <span className="text-white font-bold">Santiago Guzmán</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Cédula:</span>
                    <span className="text-white font-bold">1709540478</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Correo Confirmación:</span>
                    <span className="text-white font-bold">sguzmanpal@yahoo.com</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const txt = `🟡 DATOS DE PAGO - BANCO PICHINCHA\n• Banco: Banco Pichincha\n• Tipo de Cuenta: Ahorros\n• Número: 2206020091\n• Titular: Santiago Guzmán\n• Cédula: 1709540478\n• Correo: sguzmanpal@yahoo.com\n\nPor favor envía el comprobante visible tras realizar la transferencia.`
                    handleCopyText(txt, "Datos Banco Pichincha")
                  }}
                  className="w-full py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-950/40"
                >
                  <Copy size={15} />
                  <span>Copiar Datos Banco Pichincha</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════ PESTAÑA 9: DISTRIBUCIÓN MAYORISTA ═══════════ */}
        {activeTab === "distribucion" && (
          <div className="space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#102216] via-[#09140d] to-[#040806] border-2 border-emerald-500/40 space-y-4 shadow-2xl">
              <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 uppercase tracking-widest block w-fit">
                Canal de Importación B2B
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white">Distribución Mayorista Directa (+6 Unidades)</h2>
              <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
                Brindamos distribución directa para artículos de electrónica e importación a pequeños negocios, técnicos y emprendedores del Ecuador. Descuentos exclusivos a partir de solo 6 piezas.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Categoría 1: Repuestos de Laptop */}
              <div className="p-6 rounded-3xl bg-[#091524] border-2 border-cyan-500/40 space-y-4 shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                  <Laptop size={24} />
                </div>
                <h3 className="text-lg font-black text-white">Repuestos de Laptop</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Baterías originales y homologadas, pantallas LED slim, teclados para todas las marcas, cargadores tipo C y flex de video para talleres de reparación.
                </p>
                <div className="p-2.5 rounded-xl bg-black/40 border border-cyan-500/20 text-[11px] font-mono text-cyan-300">
                  📦 Mínimo: 6 unidades surtidas
                </div>
              </div>

              {/* Categoría 2: Tarjetas Electrónicas */}
              <div className="p-6 rounded-3xl bg-[#130f28] border-2 border-purple-500/40 space-y-4 shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                  <Wrench size={24} />
                </div>
                <h3 className="text-lg font-black text-white">Tarjetas Electrónicas</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Módulos de potencia, fuentes de poder, placas Arduino/ESP32, relevadores y placas base para automatización y proyectos electrónicos.
                </p>
                <div className="p-2.5 rounded-xl bg-black/40 border border-purple-500/20 text-[11px] font-mono text-purple-300">
                  ⚡ Precios de fábrica directo a tu celular
                </div>
              </div>

              {/* Categoría 3: Drones Económicos */}
              <div className="p-6 rounded-3xl bg-[#1e1408] border-2 border-amber-500/40 space-y-4 shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  <Sparkles size={24} />
                </div>
                <h3 className="text-lg font-black text-white">Drones Económicos</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Drones con cámara 4K Wi-Fi, sensores anticolisión y estuches de transporte. Producto de altísima rotación para reventa por redes sociales y bazares.
                </p>
                <div className="p-2.5 rounded-xl bg-black/40 border border-amber-500/20 text-[11px] font-mono text-amber-300">
                  🚁 Retorno rápido de inversión
                </div>
              </div>

              {/* Categoría 4: Artículos Chinos de Hogar */}
              <div className="p-6 rounded-3xl bg-[#1e0e14] border-2 border-rose-500/40 space-y-4 shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
                  <Home size={24} />
                </div>
                <h3 className="text-lg font-black text-white">Artículos de Hogar</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Gadgets de cocina, luces solares inteligentes, pequeños electrodomésticos y accesorios importados a precios insuperables.
                </p>
                <div className="p-2.5 rounded-xl bg-black/40 border border-rose-500/20 text-[11px] font-mono text-rose-300">
                  🏠 Margen de revendedor: 30%+
                </div>
              </div>
            </div>

            {/* Bloque Copiable para Captar Negocios Locales */}
            <div className="p-6 rounded-3xl bg-[#081120] border-2 border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">Mensaje para Enviar a Emprendedores y Técnicos:</h3>
                <span className="text-xs text-emerald-400 font-mono font-bold">Copia en 1 clic</span>
              </div>
              <div className="p-4 rounded-2xl bg-black/50 border border-white/10 text-xs sm:text-sm text-slate-200 font-mono leading-relaxed">
                ¡Hola colega! 🚀 Te saluda ATOMIC Ecuador. Brindamos distribución directa de importación para pequeños negocios, técnicos y emprendedores en todo el país. Accede a precios mayoristas desde solo 6 unidades en: Repuestos de Laptop (pantallas, teclados, baterías, cargadores), Tarjetas Electrónicas, Drones y Gadgets de Hogar. Te enviamos la lista de precios mayorista directamente a tu WhatsApp para que aumentes tus márgenes de ganancia. ¿Te gustaría recibir el catálogo hoy?
              </div>
              <button
                onClick={() => {
                  const txt = `¡Hola colega! 🚀 Te saluda ATOMIC Ecuador. Brindamos distribución directa de importación para pequeños negocios, técnicos y emprendedores en todo el país. Accede a precios mayoristas desde solo 6 unidades en: Repuestos de Laptop (pantallas, teclados, baterías, cargadores), Tarjetas Electrónicas, Drones y Gadgets de Hogar. Te enviamos la lista de precios mayorista directamente a tu WhatsApp para que aumentes tus márgenes de ganancia. ¿Te gustaría recibir el catálogo hoy?`
                  handleCopyText(txt, "Mensaje de Distribución Mayorista")
                }}
                className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              >
                <Copy size={15} />
                <span>Copiar Mensaje Mayorista al Portapapeles</span>
              </button>
            </div>
          </div>
        )}

        {/* ═══════════ PESTAÑA 10: 100 MENSAJES DE CIERRE ═══════════ */}
        {activeTab === "mensajes" && (
          <div className="space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#121c2e] via-[#09101c] to-[#040810] border-2 border-orange-500/40 space-y-4 shadow-2xl">
              <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-md bg-orange-500/20 text-orange-300 uppercase tracking-widest block w-fit">
                Batería de Respuestas Comerciales
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white">100 Mensajes de Cierre & Persuasión</h2>
              <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
                Selecciona la categoría en el desplegable y copia el mensaje exacto que necesitas para responderle a tu cliente en menos de 5 segundos.
              </p>
            </div>

            {/* SELECTOR DESPLEGABLE DE 10 CATEGORÍAS */}
            <div className="p-4 sm:p-6 rounded-2xl bg-[#091124] border border-white/10 space-y-3">
              <label className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider block">
                Selecciona la Fase de Negociación (10 Categorías Disponibles):
              </label>
              <div className="relative">
                <select
                  value={selectedMsgCat}
                  onChange={(e) => setSelectedMsgCat(e.target.value)}
                  className="w-full appearance-none px-4 py-3.5 rounded-xl bg-black/80 border-2 border-orange-500/40 text-white font-bold text-sm focus:outline-none focus:border-orange-400 transition-all cursor-pointer"
                >
                  {MESSAGE_CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id} className="bg-slate-900 text-white">
                      {cat.label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-400 pointer-events-none" />
              </div>
            </div>

            {/* LISTA DE LOS 10 MENSAJES DE LA CATEGORÍA SELECCIONADA */}
            <div className="space-y-4">
              {(ALL_MESSAGES[selectedMsgCat] || []).map((msg, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-[#081022] border border-white/10 hover:border-orange-500/40 transition-all space-y-3 shadow-md"
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="px-2 py-0.5 rounded bg-white/5 text-orange-400 font-bold">
                      Mensaje #{idx + 1}
                    </span>
                    <span className="text-slate-500">Copia y pega en WhatsApp / Messenger</span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-line">
                    {msg}
                  </p>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => {
                        handleCopyText(msg, `Mensaje #${idx + 1}`)
                        setCopiedIndex(idx)
                        setTimeout(() => setCopiedIndex(null), 2000)
                      }}
                      className="px-4 py-2 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/40 text-orange-300 font-bold text-xs transition-all flex items-center gap-1.5 active:scale-95"
                    >
                      {copiedIndex === idx ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      <span>{copiedIndex === idx ? "¡Copiado!" : "Copiar Mensaje"}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* ── BOTÓN FLOTANTE CON VIÑETA COMIC DE SOPORTE STEFY ── */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {/* VIÑETA TIPO CÓMIC / SPEECH BUBBLE */}
        <AnimatePresence>
          {isComicOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 10 }}
              className="mb-3 max-w-xs sm:max-w-sm p-5 rounded-3xl bg-[#0e172e] border-2 border-cyan-400 shadow-[0_15px_50px_rgba(6,182,212,0.35)] relative text-white space-y-3"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsComicOpen(false)}
                className="absolute top-3 right-3 text-slate-400 hover:text-white"
                title="Cerrar viñeta"
              >
                <X size={16} />
              </button>

              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-cyan-400 text-black font-black text-[10px] uppercase font-mono tracking-wider">
                  Coordinación Stefy
                </span>
              </div>

              <h4 className="text-sm font-black leading-snug">
                ¿Necesitas ficha técnica, imágenes o validar stock especial con bodega?
              </h4>

              <p className="text-[11px] text-amber-300 font-medium leading-relaxed bg-black/40 p-2.5 rounded-xl border border-amber-500/30">
                ⚠️ <strong>Asegúrate de tomar captura de pantalla de tu producto solicitado</strong> y de tener al menos el número de teléfono de tu cliente para más adelante enviarle una proforma formal.
              </p>

              <div className="pt-1">
                <a
                  href="https://wa.me/593989476556?text=Saludos%2C%20solicito%20informaci%C3%B3n%20con%20este%20producto%20(adjunto%20foto)"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setIsComicOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/50"
                >
                  <MessageSquare size={14} />
                  <span>Sí, Consultar a Stefy</span>
                </a>
              </div>

              {/* Comic bubble triangle tail */}
              <div className="absolute -bottom-2 right-8 w-4 h-4 bg-[#0e172e] border-r-2 border-b-2 border-cyan-400 transform rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* FLOATING ACTION BUTTON */}
        <button
          onClick={() => setIsComicOpen(!isComicOpen)}
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-[0_10px_35px_rgba(6,182,212,0.45)] hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-white/20 group cursor-pointer"
          title="Consultar a Coordinación Stefy"
          aria-label="Soporte Stefy"
        >
          <div className="relative">
            <MessageSquare size={26} className="group-hover:rotate-6 transition-transform" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-orange-500 border-2 border-black animate-pulse" />
          </div>
        </button>
      </div>
    </div>
  )
}
