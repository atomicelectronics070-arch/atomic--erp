"use client"

import React, { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import {
  Search, Copy, Check, ExternalLink, ShieldCheck, Truck, CreditCard,
  Percent, Sparkles, MessageSquare, PhoneCall, Download, ChevronDown,
  Layers, Package, AlertTriangle, ArrowRight, Laptop, Smartphone,
  Home, Wrench, Shield, CheckCircle2, X, HelpCircle, Flame, Gift
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
    "¿Pudiste revisar la proforma formal que te envié? Si requieres algún cambio en las condiciones o formas de pago, con gusto lo adaptamos.",
    "¡Hola! Sé que a veces uno se ocupa en el trabajo. Solo quería recordarte que tu cotización sigue vigente hasta fin de mes. ¿Deseas retomarla?",
    "Te comparto este breve video demostrativo de cómo funciona el equipo para que veas lo fácil que es de instalar y usar en tu hogar o negocio.",
    "¡Hola! Si el tema era el presupuesto, cuéntame cuánto tenías pensado invertir y te ayudo a buscar la mejor solución dentro de nuestro catálogo."
  ],
  "mayoristas": [
    "💼 *PLAN DISTRIBUIDOR ATOMIC (Desde 6 Unidades):*\nAccede a precios mayoristas exclusivos directos de importación. Línea completa en Repuestos de Laptop, Tarjetas Electrónicas, Drones Económicos y Gadgets de Hogar.",
    "¿Tienes un negocio, taller técnico o vendes por tu cuenta? Con compras desde 6 unidades accedes a márgenes de ganancia de hasta el 40%. Te paso la lista mayorista.",
    "En *REPUESTOS DE LAPTOP* manejamos: Pantallas LED, teclados en español, baterías originales/homologadas, cargadores tipo C y pin central, cables flex y coolers con despacho a nivel nacional.",
    "Te ofrecemos soporte técnico mayorista: si eres técnico reparador, te brindamos repuestos garantizados con precios preferenciales para que tus clientes queden 100% conformes.",
    "Para compras al por mayor: manejamos catálogo exclusivo donde recibes promociones directas a tu WhatsApp sin intermediarios ni demoras.",
    "Si deseas emprender: no necesitas miles de dólares de inversión. Con un pedido inicial surtido de 6 unidades ya clasificas a la tarifa de Distribuidor Autorizado.",
    "Nuestros drones económicos y artículos tecnológicos de consumo vuelan en redes sociales para revender en tu cantón. ¿Te gustaría recibir la lista de precios mayorista?",
    "Manejamos tarjetas electrónicas, módulos y componentes para proyectos de automatización e ingeniería a precios que compiten directamente con importación china.",
    "Todos nuestros repuestos y lotes de distribución cuentan con garantía de cambio inmediato por falla de fábrica. Tu capital está protegido.",
    "¿Qué categoría te interesa revender o abastecer en tu local? Te armo un combo mayorista personalizado con entrega prioritaria."
  ],
  "postventa": [
    "📦 *CONFIRMACIÓN DE GUÍA & DESPACHO:*\nTu paquete ha sido despachado con éxito. Te adjunto la foto de la guía con el número de rastreo oficial para que hagas el seguimiento en línea.",
    "¡Hola! Nuestro sistema indica que tu paquete ya fue entregado. ¿Recibiste todo en orden y a entera satisfacción?",
    "Te agradecemos enormemente por confiar en ATOMIC. Tu garantía oficial de 1 año ya se encuentra registrada en nuestra base de datos con tu número de contacto.",
    "Si necesitas ayuda o asesoría para la primera configuración o instalación de tu equipo, escríbeme con toda confianza y te guiamos paso a paso.",
    "Nos encantaría conocer tu experiencia: ¿nos regalarías una breve reseña o calificación de 5 estrellas en nuestras redes? Nos ayuda mucho a seguir creciendo.",
    "Por ser cliente registrado ATOMIC, en tu próxima compra tienes un 5% de descuento permanente en cualquiera de nuestros más de 3.000 artículos.",
    "Si conoces a un familiar, colega o amigo que necesite tecnología de calidad, recomiéndanos y te otorgamos una bonificación en efectivo o saldo para tu siguiente compra.",
    "Te recordamos conservar la factura o nota de entrega digital en tu correo para cualquier revisión técnica durante el año de vigencia.",
    "Cualquier novedad, consulta o duda sobre el funcionamiento de tu artículo, este canal de WhatsApp queda abierto 24/7 para tu atención prioritaria.",
    "¡Gracias por ser parte de la familia ATOMIC Ecuador! Que disfrutes al máximo tu nuevo equipo. ¡Estamos a las órdenes!"
  ]
}

// ─── CATEGORÍAS COMERCIALES CLAVE ───
const COMMERCIAL_CATEGORIES = [
  {
    id: "celulares-apple",
    name: "Celulares & Ecosistema Apple",
    icon: Smartphone,
    desc: "iPhone 11 al 17 Pro Max, MacBooks, iPads, Apple Watch y cargadores Magsafe.",
    pvpRango: "$180 - $2.400 USD",
    comision: "15% - 20%",
    landing: "/web/apple"
  },
  {
    id: "laptops-computacion",
    name: "Computación & Laptops ATOMIC",
    icon: Laptop,
    desc: "Portátiles para oficina, arquitectura, gaming, PCs de escritorio, Mini PCs y monitores.",
    pvpRango: "$250 - $1.850 USD",
    comision: "15% - 20%",
    landing: "/web/laptops"
  },
  {
    id: "repuestos-laptop",
    name: "Repuestos para Laptops & PCs",
    icon: Wrench,
    desc: "Pantallas LED, teclados, baterías, cargadores tipo C y pin central, flex y memorias RAM.",
    pvpRango: "$15 - $220 USD",
    comision: "20% - 25%",
    landing: "/web/repuestos"
  },
  {
    id: "hogar-cocina",
    name: "Hogar & Cocina Inteligente",
    icon: Home,
    desc: "Encimeras de inducción, campanas extractoras, hornos empotrables y freidoras de aire.",
    pvpRango: "$90 - $850 USD",
    comision: "15% - 20%",
    landing: "/web/cocinas"
  },
  {
    id: "seguridad-acceso",
    name: "Seguridad Electrónica & Acceso",
    icon: Shield,
    desc: "Cerraduras smart biométricas, cámaras Wi-Fi 4K, videoporteros y cercos eléctricos.",
    pvpRango: "$35 - $650 USD",
    comision: "20%",
    landing: "/web/cerraduras-smart"
  },
  {
    id: "movilidad-energia",
    name: "Movilidad Eléctrica & Energía",
    icon: Truck,
    desc: "Scooters, bicicletas eléctricas, cargadores Wallbox Livoltek y generadores eléctricos.",
    pvpRango: "$380 - $3.200 USD",
    comision: "15%",
    landing: "/web/cargadores-electricos"
  }
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

// ─── TAB PRINCIPAL CONFIG ───
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

export default function PreciosVendedorClient() {
  const [activeTab, setActiveTab] = useState<TabType>("pvp-todos")
  const [selectedMsgCat, setSelectedMsgCat] = useState("saludos")
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [isComicOpen, setIsComicOpen] = useState(false)

  // Products fetch state for Tab 1
  const [products, setProducts] = useState<any[]>([])
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  // Quick filter pills for search
  const quickFilters = ["iPhone", "PS5", "Cerradura", "Campana", "Laptop", "Generador", "Camara", "Bateria", "Cocina"]

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    showToast(`✅ ¡${label} copiado al portapapeles!`)
  }

  // Load products from public matrix
  useEffect(() => {
    const fetchPublicProducts = async () => {
      setLoadingProducts(true)
      try {
        const res = await fetch("/api/public/matriz-precios?limit=200")
        if (res.ok) {
          const data = await res.json()
          setProducts(data.products || [])
        }
      } catch (err) {
        console.error("Error loading products:", err)
      } finally {
        setLoadingProducts(false)
      }
    }
    fetchPublicProducts()
  }, [])

  // Filtered products
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return products.slice(0, 50)
    const term = searchTerm.toLowerCase()
    return products.filter(p => 
      (p.name && p.name.toLowerCase().includes(term)) ||
      (p.sku && p.sku.toLowerCase().includes(term)) ||
      (p.category && p.category.toLowerCase().includes(term))
    )
  }, [products, searchTerm])

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 font-sans selection:bg-orange-500/30 pb-28">
      {/* ── TOAST NOTIFICATION ── */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
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

        {/* ═══════════ PESTAÑA 1: TODOS LOS PVP (BUSCADOR EN VIVO) ═══════════ */}
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
                    Consulta el precio autorizado para tu cliente y calcula tu comisión del 20% al instante.
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
                  placeholder="Escribe el nombre del producto (ej: iPhone, freidora, cerradura, laptop, camara)..."
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
                    className="px-3 py-1 rounded-lg bg-white/5 hover:bg-orange-500/20 hover:text-orange-300 border border-white/10 text-slate-300 text-xs font-semibold shrink-0 transition-colors"
                  >
                    {filter}
                  </button>
                ))}
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 text-xs font-bold shrink-0"
                  >
                    ✕ Limpiar
                  </button>
                )}
              </div>
            </div>

            {/* Listado de Productos */}
            {loadingProducts ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-slate-400 text-xs font-mono">Cargando catálogo en vivo de ATOMIC...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-[#080d1e] rounded-3xl border border-white/10 p-8 space-y-3">
                <Package size={40} className="text-slate-500 mx-auto" />
                <h3 className="text-lg font-bold text-white">No se encontraron productos con ese término</h3>
                <p className="text-slate-400 text-xs max-w-md mx-auto">
                  Prueba buscando con palabras generales como &ldquo;Apple&rdquo;, &ldquo;Smart&rdquo;, &ldquo;Campana&rdquo; o &ldquo;Cargador&rdquo;. Si necesitas cotizar un producto especial de bodega, consulta a Stefy (+593 98 947 6556).
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((p, idx) => {
                  const saleP = Number(p.salePrice) || 0
                  const comision20 = saleP * 0.20
                  return (
                    <div
                      key={p.id || idx}
                      className="p-5 rounded-2xl bg-[#091124] border border-white/10 hover:border-orange-500/50 transition-all flex flex-col justify-between space-y-4 group shadow-lg shadow-black/40"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <span className="px-2 py-0.5 rounded bg-white/5 text-slate-400">
                            {p.category || "General"}
                          </span>
                          <span className="text-slate-400 font-bold">
                            SKU: {p.sku || "N/A"}
                          </span>
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

        {/* ═══════════ PESTAÑA 2: PVP POR CATEGORÍAS ═══════════ */}
        {activeTab === "pvp-categorias" && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-gradient-to-br from-[#120e24] via-[#090b1c] to-[#040610] border border-purple-500/30 space-y-2 shadow-xl">
              <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-md bg-purple-500/20 text-purple-300 uppercase tracking-widest block w-fit">
                Líneas de Negocio Oficiales
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Catálogo de PVPs por Categorías Comerciales</h2>
              <p className="text-slate-400 text-xs sm:text-sm max-w-2xl">
                Conoce las márgenes de ganancia, rangos de precio promedio y enlaces a landings directas para cada categoría.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {COMMERCIAL_CATEGORIES.map((cat) => (
                <div
                  key={cat.id}
                  className="p-6 rounded-3xl bg-[#090f22] border-2 border-white/10 hover:border-orange-500/40 transition-all flex flex-col justify-between space-y-5 shadow-lg shadow-black/50"
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
                      <cat.icon size={24} />
                    </div>
                    <h3 className="text-lg font-black text-white">{cat.name}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{cat.desc}</p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-white/10 text-xs font-mono">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Rango PVP Promedio:</span>
                      <span className="font-bold text-white">{cat.pvpRango}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-400 font-bold">Comisión Estimada:</span>
                      <span className="font-bold text-emerald-400">{cat.comision}</span>
                    </div>

                    <div className="pt-2 flex items-center gap-2">
                      <Link
                        href={cat.landing}
                        target="_blank"
                        className="flex-1 py-2 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 border border-blue-400/40 text-blue-200 text-xs font-bold text-center transition-all flex items-center justify-center gap-1.5"
                      >
                        <span>Ver Landing</span>
                        <ExternalLink size={12} />
                      </Link>
                      <button
                        onClick={() => {
                          setActiveTab("pvp-todos")
                          setSearchTerm(cat.name.split(" ")[0])
                        }}
                        className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300"
                        title="Ver productos de esta categoría"
                      >
                        🔍 Ver PVPs
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════ PESTAÑA 3: LANDINGS WEB ═══════════ */}
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

        {/* ═══════════ PESTAÑA 4: BENEFICIOS & BONOS DE LA SEMANA ═══════════ */}
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
                  <h3 className="text-xl font-black text-white mt-1">Bono de $50 a $65 USD</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Al cumplir con tus métricas de 30 días, desbloqueas el bono de <strong>$50 USD</strong> (en Nivel 2) o <strong>$65 USD</strong> (en Nivel 3) que se suma a tu sueldo fijo mensual.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-purple-500/20 text-[11px] font-mono text-purple-300">
                  🎯 Condición: Asistencia timbrada y prospectos validados.
                </div>
              </div>

              {/* Bono 3: Prioridad de Leads */}
              <div className="p-6 rounded-3xl bg-[#1f1010] border-2 border-rose-500/40 space-y-4 shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
                  <PhoneCall size={24} />
                </div>
                <div>
                  <span className="text-[11px] font-mono font-bold text-rose-400 uppercase tracking-wider block">Equipo de Élite</span>
                  <h3 className="text-xl font-black text-white mt-1">Leads Calientes del Bot Directos</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Los asesores que demuestren llamadas activas reciben de Dirección Comercial clientes que ya están con intención de compra listos para proforma y cierre.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-rose-500/20 text-[11px] font-mono text-rose-300">
                  🔥 Asignación diaria coordinada con Stefy y Juan Guzmán.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════ PESTAÑA 5: PROMOCIONES FIN DE AÑO & DESCUENTOS ═══════════ */}
        {activeTab === "promociones" && (
          <div className="space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#1c0d20] via-[#100714] to-[#060308] border-2 border-rose-500/40 space-y-4 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-md bg-rose-500/20 text-rose-300 uppercase tracking-widest block w-fit mb-2">
                    Política Oficial de Rebajas
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-black text-white">Descuentos por Pago Anticipado (100% Contado)</h2>
                  <p className="text-slate-300 text-xs sm:text-sm max-w-2xl mt-1">
                    Usa esta herramienta comercial para cerrar a clientes que disponen de liquidez inmediata.
                  </p>
                </div>
                <a
                  href="/images/pagos/politicas-descuentos-anticipo.png"
                  download="politicas-descuentos-anticipo-atomic.png"
                  target="_blank"
                  className="shrink-0 px-5 py-3 rounded-2xl bg-rose-500 hover:bg-rose-400 text-white font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-950/50"
                >
                  <Download size={15} />
                  <span>Descargar Tarjeta (PNG)</span>
                </a>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Nivel VIP */}
              <div className="p-6 rounded-3xl bg-[#091b16] border-2 border-emerald-500/50 space-y-4 shadow-xl">
                <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 uppercase tracking-widest block w-fit">
                  Nivel VIP · $500 a $1.000 USD
                </span>
                <div>
                  <h3 className="text-3xl font-black text-emerald-300 font-mono">Hasta 13% OFF</h3>
                  <p className="text-xs text-white font-bold mt-1">+ ENVÍO GRATIS A DOMICILIO</p>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Aplica para clientes que paguen el 100% del pedido por adelantado mediante transferencia. Válido bajo consulta de disponibilidad en bodega.
                </p>
                <button
                  onClick={() => {
                    const txt = `🎁 *PROMOCIÓN VIP ATOMIC FIN DE AÑO:*\nSi cancelas el 100% de tu pedido de forma anticipada vía transferencia, accedes a un *DESCUENTO EXCLUSIVO DE HASTA EL 13%* sobre el valor total, y te *OBSEQUIAMOS EL ENVÍO A DOMICILIO* a cualquier cantón del Ecuador.\n\n¿Deseas que te aplique esta promoción en tu orden?`
                    handleCopyText(txt, "Mensaje Descuento 13%")
                  }}
                  className="w-full py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs transition-all flex items-center justify-center gap-2"
                >
                  <Copy size={13} />
                  <span>Copiar Mensaje para Cliente</span>
                </button>
              </div>

              {/* Nivel Plus */}
              <div className="p-6 rounded-3xl bg-[#1c1608] border-2 border-amber-500/50 space-y-4 shadow-xl">
                <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 uppercase tracking-widest block w-fit">
                  Nivel Plus · $100 a $499 USD
                </span>
                <div>
                  <h3 className="text-3xl font-black text-amber-300 font-mono">Hasta 10% OFF</h3>
                  <p className="text-xs text-white font-bold mt-1">Despacho Express Mismo Día</p>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Para compras intermedias abonadas al 100%. Te permite competir contra cualquier cotización externa y asegurar el cierre inmediato.
                </p>
                <button
                  onClick={() => {
                    const txt = `🔥 *DESCUENTO PLUS POR PAGO ANTICIPADO:*\nPara pedidos de $100 a $499 USD abonados al 100% por transferencia, te aplicamos un *10% DE DESCUENTO DIRECTO* y despacho prioritario el mismo día laboral.\n\n¿Te comparto la cuenta para coordinar tu envío?`
                    handleCopyText(txt, "Mensaje Descuento 10%")
                  }}
                  className="w-full py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs transition-all flex items-center justify-center gap-2"
                >
                  <Copy size={13} />
                  <span>Copiar Mensaje para Cliente</span>
                </button>
              </div>

              {/* Nivel Smart */}
              <div className="p-6 rounded-3xl bg-[#1a0f16] border-2 border-rose-500/50 space-y-4 shadow-xl">
                <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-md bg-rose-500/20 text-rose-300 uppercase tracking-widest block w-fit">
                  Nivel Smart · $0 a $99 USD
                </span>
                <div>
                  <h3 className="text-3xl font-black text-rose-300 font-mono">Hasta 5% OFF</h3>
                  <p className="text-xs text-white font-bold mt-1">Compras Menores & Gadgets</p>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Descuento directo por pronto pago en repuestos, periféricos y artículos de alta rotación para clientes que prefieren pagar antes de recibir.
                </p>
                <button
                  onClick={() => {
                    const txt = `💡 *DESCUENTO SMART POR TRANSFERENCIA:*\nSi abonas el valor completo de tu producto ($0 - $99 USD) antes del envío, te obsequiamos un *5% DE DESCUENTO DIRECTO* en tu factura.\n\n¿Prefieres este descuento o contra entrega normal?`
                    handleCopyText(txt, "Mensaje Descuento 5%")
                  }}
                  className="w-full py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-bold text-xs transition-all flex items-center justify-center gap-2"
                >
                  <Copy size={13} />
                  <span>Copiar Mensaje para Cliente</span>
                </button>
              </div>
            </div>

            {/* Visualizador de la Infografía */}
            <div className="p-4 rounded-3xl bg-[#090f20] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Percent size={24} className="text-rose-400 shrink-0" />
                <span className="text-xs sm:text-sm text-slate-300">
                  Infografía oficial de descuentos lista para enviar a clientes indecisos en WhatsApp.
                </span>
              </div>
              <a
                href="/images/pagos/politicas-descuentos-anticipo.png"
                target="_blank"
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white shrink-0 flex items-center gap-1.5"
              >
                <span>Ver Tarjeta en HD</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        )}

        {/* ═══════════ PESTAÑA 6: MÉTODOS DE ENVÍO & POLÍTICAS DE ANTICIPO ═══════════ */}
        {activeTab === "metodos-envio" && (
          <div className="space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0c1a30] via-[#071120] to-[#03060d] border-2 border-cyan-500/40 space-y-4 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-md bg-cyan-500/20 text-cyan-300 uppercase tracking-widest block w-fit mb-2">
                    Blindaje Logístico Obligatorio
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-black text-white">Políticas de Envío, Anticipos & Contra Entrega</h2>
                  <p className="text-slate-300 text-xs sm:text-sm max-w-2xl mt-1">
                    Normas inquebrantables de despacho para proteger a la empresa y a los asesores comerciales de paquetes rebotados.
                  </p>
                </div>
                <a
                  href="/images/pagos/politicas-envios-anticipos.png"
                  download="politicas-envios-anticipos-atomic.png"
                  target="_blank"
                  className="shrink-0 px-5 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/50"
                >
                  <Download size={15} />
                  <span>Descargar Normativa (PNG)</span>
                </a>
              </div>
            </div>

            <div className="space-y-4">
              {[
                {
                  title: "1. Compras Generales de $0 a $100 USD (Quito y Provincias)",
                  badge: "Bajo Ticket",
                  badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
                  textQuito: "En Quito: Totalmente a contra entrega en domicilio, trabajo o retiro en oficina.",
                  textProv: "En Provincias: El cliente abona únicamente el valor de envío ($5 a $7 USD) y paga el 100% del valor del producto en mano a la transportadora aliada con convenio de cobro.",
                  copyMsg: "📦 *POLÍTICA DE ENTREGA ($0 - $100 USD):*\n• En Quito: Pagas el 100% al recibir el producto en tu domicilio.\n• En Provincias: Abonas únicamente el valor del envío ($5 a $7) y el valor del producto lo pagas en efectivo a la empresa de entregas al momento de recibirlo.\n\n¿A qué dirección coordinamos tu despacho?"
                },
                {
                  title: "2. Compras Intermedias de $100 a $999 USD (Seña del 50%)",
                  badge: "Medio Ticket",
                  badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
                  textQuito: "Contra entrega autorizada ÚNICAMENTE tras realizar un abono parcial / seña del 50% del valor del artículo.",
                  textProv: "El saldo restante (50%) se cancela al recibir el producto o contra entrega con la transportadora.",
                  copyMsg: "🛡️ *POLÍTICA PARA PEDIDOS DE $100 A $999 USD:*\nPara separar el stock en bodega y autorizar la entrega a contra entrega, se requiere un abono inicial del 50%. El saldo restante del 50% lo cancelas cómodamente al recibir tu producto en mano.\n\n¿Deseas que te emita la proforma formal para tu abono?"
                },
                {
                  title: "3. Compras Mayores de $1.000 USD en Adelante (Anticipo 70%)",
                  badge: "Alto Ticket / Corp",
                  badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/30",
                  textQuito: "Negociación formal con 70% de anticipo para reserva de lote, importación directa o combos corporativos.",
                  textProv: "Descuentos abiertos a negociación tras bambalinas para compras corporativas o pagos de contado.",
                  copyMsg: "🏢 *CONDICIONES CORPORATIVAS (MÁS DE $1.000 USD):*\nPara pedidos de alto ticket e importación directa, se formaliza la orden con el 70% de anticipo bajo contrato de suministro y proforma firmada. El 30% restante se cancela contra entrega o prueba técnica.\n\n¿A nombre de qué razón social emitimos la propuesta formal?"
                },
                {
                  title: "4. Gama Hogar & Cocina (Encimeras, Hornos, Campanas)",
                  badge: "Línea Hogar",
                  badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
                  textQuito: "Se solicita entre $20 y $100 USD de anticipo para poder solicitar la entrega a domicilio en Quito o provincias.",
                  textProv: "Motivo: Gran variedad de modelos que se trasladan desde bodegas asociadas bajo pedido de 24 a 48 horas.",
                  copyMsg: "🍳 *POLÍTICA LÍNEA COCINA & HOGAR (Encimeras / Hornos / Campanas):*\nDebido a que nuestros electrodomésticos empotrables se trasladan desde bodega central asociada bajo pedido especial, se solicita un anticipo de garantía de $20 a $100 según el modelo. El saldo lo pagas al recibir en tu domicilio en 24 a 48 horas.\n\n¿Te comparto la cuenta para separar tu modelo?"
                }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-[#081022] border-2 border-white/10 hover:border-cyan-500/30 transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                    <h3 className="text-base sm:text-lg font-bold text-white">{item.title}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-mono font-bold uppercase w-fit ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 text-xs text-slate-300 font-mono">
                    <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                      <span className="text-cyan-400 font-bold block">📍 EN QUITO:</span>
                      <p>{item.textQuito}</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                      <span className="text-amber-400 font-bold block">🚛 EN PROVINCIAS:</span>
                      <p>{item.textProv}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopyText(item.copyMsg, `Explicación ${item.badge}`)}
                    className="w-full py-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 font-bold text-xs transition-all flex items-center justify-center gap-2"
                  >
                    <Copy size={13} />
                    <span>Copiar Texto Explicativo para el Cliente</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════ PESTAÑA 7: CUENTAS BANCARIAS OFICIALES ═══════════ */}
        {activeTab === "metodos-pago" && (
          <div className="space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#1c1808] via-[#100d04] to-[#050401] border-2 border-yellow-500/40 space-y-4 shadow-2xl">
              <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-md bg-yellow-500/20 text-yellow-300 uppercase tracking-widest block w-fit">
                Recaudación Oficial
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white">Cuentas Bancarias Oficiales de ATOMIC</h2>
              <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
                Estas son las únicas dos cuentas autorizadas por la Dirección General para recibir pagos de clientes, anticipos y pedidos mayoristas. Copia los datos con un solo clic.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* BANCO PICHINCHA */}
              <div className="p-6 sm:p-8 rounded-3xl bg-[#0f172a] border-2 border-yellow-500/60 shadow-2xl space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-yellow-500 text-black text-xs font-black uppercase tracking-wider">
                      Banco Pichincha
                    </span>
                    <span className="text-xs text-yellow-300 font-mono font-bold">Oficial Facturación</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-black/50 border border-yellow-500/30 space-y-3 font-mono">
                    <div>
                      <span className="text-[11px] text-slate-400 block">TITULAR DE LA CUENTA:</span>
                      <span className="text-base font-black text-white">SANTIAGO GUZMÁN</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block">NÚMERO DE CUENTA (AHORROS):</span>
                      <span className="text-2xl font-black text-yellow-400">2206020091</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
                      <div>
                        <span className="text-[10px] text-slate-400 block">CÉDULA:</span>
                        <span className="text-xs font-bold text-white">1709540478</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">CORREO:</span>
                        <span className="text-xs font-bold text-yellow-300 truncate block">sguzmanpal@yahoo.com</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => {
                      const txt = `🟡 *DATOS BANCO PICHINCHA · ATOMIC ECUADOR:*\n• Titular: SANTIAGO GUZMÁN\n• Tipo de Cuenta: Ahorros\n• Número de Cuenta: 2206020091\n• Cédula: 1709540478\n• Correo: sguzmanpal@yahoo.com\n\n_Por favor adjunta el comprobante legible para validar tu orden de inmediato._`
                      handleCopyText(txt, "Datos Banco Pichincha")
                    }}
                    className="w-full py-3 rounded-2xl bg-yellow-500 hover:bg-yellow-400 text-black font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-yellow-950/50"
                  >
                    <Copy size={15} />
                    <span>Copiar Datos Banco Pichincha</span>
                  </button>

                  <a
                    href="/images/pagos/banco-pichincha.png"
                    download="banco-pichincha-datos.png"
                    target="_blank"
                    className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300 text-center flex items-center justify-center gap-2"
                  >
                    <Download size={13} />
                    <span>Descargar Tarjeta Gráfica HD</span>
                  </a>
                </div>
              </div>

              {/* BANCO GUAYAQUIL */}
              <div className="p-6 sm:p-8 rounded-3xl bg-[#1a0f24] border-2 border-pink-500/60 shadow-2xl space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-pink-500 text-white text-xs font-black uppercase tracking-wider">
                      Banco Guayaquil
                    </span>
                    <span className="text-xs text-pink-300 font-mono font-bold">Oficial Recaudación</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-black/50 border border-pink-500/30 space-y-3 font-mono">
                    <div>
                      <span className="text-[11px] text-slate-400 block">TITULAR DE LA CUENTA:</span>
                      <span className="text-base font-black text-white">JUAN PABLO GUZMAN MORALES</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block">NÚMERO DE CUENTA (AHORROS):</span>
                      <span className="text-2xl font-black text-pink-400">0124465041</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
                      <div>
                        <span className="text-[10px] text-slate-400 block">CÉDULA:</span>
                        <span className="text-xs font-bold text-white">1751940212</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">TIPO:</span>
                        <span className="text-xs font-bold text-pink-300">Cuenta de Ahorros</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => {
                      const txt = `🔴 *DATOS BANCO GUAYAQUIL · ATOMIC ECUADOR:*\n• Titular: JUAN PABLO GUZMAN MORALES\n• Tipo de Cuenta: Ahorros\n• Número de Cuenta: 0124465041\n• Cédula: 1751940212\n\n_Por favor adjunta el comprobante legible para validar tu orden de inmediato._`
                      handleCopyText(txt, "Datos Banco Guayaquil")
                    }}
                    className="w-full py-3 rounded-2xl bg-pink-500 hover:bg-pink-400 text-white font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-pink-950/50"
                  >
                    <Copy size={15} />
                    <span>Copiar Datos Banco Guayaquil</span>
                  </button>

                  <a
                    href="/images/pagos/banco-guayaquil.png"
                    download="banco-guayaquil-datos.png"
                    target="_blank"
                    className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300 text-center flex items-center justify-center gap-2"
                  >
                    <Download size={13} />
                    <span>Descargar Tarjeta Gráfica HD</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Aviso de comprobante */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-1">
              <div className="flex items-center gap-2 font-bold text-amber-400">
                <AlertTriangle size={15} />
                <span>Instrucción Crítica para Vendedores:</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Siempre exige que la captura del cliente muestre la fecha, hora y valor exacto. No despaches ningún producto sin que Stefy o Juan Guzmán hayan validado el ingreso real del saldo en la banca móvil.
              </p>
            </div>
          </div>
        )}

        {/* ═══════════ PESTAÑA 8: DISTRIBUCIÓN MAYORISTA ═══════════ */}
        {activeTab === "distribucion" && (
          <div className="space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0c2420] via-[#071614] to-[#030a09] border-2 border-emerald-500/40 space-y-4 shadow-2xl">
              <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 uppercase tracking-widest block w-fit">
                Canal B2B & Emprendedores
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white">Programa de Distribución & Mayoristas (+6 Unidades)</h2>
              <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
                Brindamos distribución directa de electrónica e importación para pequeños negocios, técnicos, emprendedores y comerciantes en todo el Ecuador, con descuentos exclusivos por compras desde 6 unidades.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Categoría 1: Repuestos de Laptop */}
              <div className="p-6 rounded-3xl bg-[#091522] border-2 border-cyan-500/40 space-y-4 shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                  <Laptop size={24} />
                </div>
                <h3 className="text-lg font-black text-white">Repuestos de Laptop</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Pantallas LCD/LED, teclados en español, baterías originales/homologadas, cargadores tipo C y pin central, cables flex y coolers para talleres de reparación.
                </p>
                <div className="p-2.5 rounded-xl bg-black/40 border border-cyan-500/20 text-[11px] font-mono text-cyan-300">
                  🔧 Margen Técnico: 25% - 40%
                </div>
              </div>

              {/* Categoría 2: Tarjetas Electrónicas */}
              <div className="p-6 rounded-3xl bg-[#140e24] border-2 border-purple-500/40 space-y-4 shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                  <Wrench size={24} />
                </div>
                <h3 className="text-lg font-black text-white">Tarjetas Electrónicas</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Módulos de potencia, placas de control para portones, sensores, relés y componentes de ingeniería para integradores y electricistas.
                </p>
                <div className="p-2.5 rounded-xl bg-black/40 border border-purple-500/20 text-[11px] font-mono text-purple-300">
                  ⚡ Precios de fábrica directos
                </div>
              </div>

              {/* Categoría 3: Drones Económicos */}
              <div className="p-6 rounded-3xl bg-[#201509] border-2 border-amber-500/40 space-y-4 shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  <Package size={24} />
                </div>
                <h3 className="text-lg font-black text-white">Drones Económicos</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Drones de inicio con cámara 4K/1080p, control remoto y repuestos de hélices. Producto de alta rotación para venta en bazares y redes sociales.
                </p>
                <div className="p-2.5 rounded-xl bg-black/40 border border-amber-500/20 text-[11px] font-mono text-amber-300">
                  🛸 Alta rotación en TikTok
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

        {/* ═══════════ PESTAÑA 9: 100 MENSAJES DE CIERRE ═══════════ */}
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
