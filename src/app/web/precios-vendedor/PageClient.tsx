"use client"

import React, { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import {
  Search, Copy, Check, ExternalLink, ShieldCheck, Truck, CreditCard,
  Percent, Sparkles, MessageSquare, Download, ChevronDown,
  Layers, Package, AlertTriangle, ArrowRight, Laptop, Smartphone,
  Home, Wrench, Shield, CheckCircle2, X, Flame, Gift,
  MapPin, Building2, Clock, Zap, Phone, ArrowUpRight,
  Filter, BadgeCheck, SlidersHorizontal, Send, Globe, Tag, FileText
} from "lucide-react"

// ─── 100 MENSAJES CLASIFICADOS EN 10 CATEGORÍAS ───
const MESSAGE_CATEGORIES = [
  { id: "saludos", label: "Saludos & Primer Contacto", count: 10 },
  { id: "fichas", label: "Ficha Técnica & Catálogo", count: 10 },
  { id: "objecion-precio", label: "Objeción: Precio / Está Caro", count: 10 },
  { id: "objecion-anticipo", label: "Objeción: Desconfianza de Anticipo", count: 10 },
  { id: "politica-envio", label: "Políticas de Despacho & Contra Entrega", count: 10 },
  { id: "cuentas-cierre", label: "Cuentas Bancarias & Protocolo de Pago", count: 10 },
  { id: "urgencia", label: "Cierre con Urgencia & Stock Crítico", count: 10 },
  { id: "seguimiento", label: "Seguimiento a Clientes Fríos", count: 10 },
  { id: "mayoristas", label: "Distribución Mayorista (Desde 6 Uds)", count: 10 },
  { id: "postventa", label: "Post-Venta & Confirmación de Guía", count: 10 }
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
    "💳 *DATOS BANCARIOS OFICIALES PARA PAGO:*\n\n🔴 *BANCO GUAYAQUIL*\n• Titular: Juan Pablo Guzmán Morales\n• Cta. Ahorros: 0124465041\n• Cédula: 1751940212\n\n🟡 *BANCO PICHINCHA*\n• Titular: Santiago Guzmán\n• Cta. Ahorros: 2206020091\n• Cédula: 1709540478\n• Correo: sguzmanpal@yahoo.com\n\n_Por favor envía el comprobante visible para validar tu orden._",
    "Te dejo los datos para que realices la transferencia. Una vez hecha, envíame la captura de pantalla para separar tu equipo en bodega de inmediato.",
    "Perfecto, tenemos tu pedido listo en empaque. Puedes realizar el abono a nuestra cuenta de Banco Pichincha o Banco Guayaquil según tu preferencia.",
    "Apenas envíes el comprobante, nuestro sistema te asigna el código de despacho y te emitimos la nota de entrega oficial.",
    "Aceptamos transferencias directas de Pichincha a Pichincha (efectivización inmediata) o interbancarias directas sin costo adicional.",
    "Si vas a depositar por ventanilla o cajero automático: indícale al cajero los datos exactos que te acabé de compartir.",
    "Para congelar tu precio de promoción antes de que termine el lote: te recomiendo transferir hoy y así aseguramos tu entrega prioritaria.",
    "¿A qué banco se te hace más cómodo realizar el pago: Banco Guayaquil o Banco Pichincha?",
    "Comprobante recibido con éxito. Pasamos a validar con el departamento de contabilidad y te confirmamos tu guía en breves momentos.",
    "Muchas gracias por tu pago. Tu pedido ha ingresado a la cola de preparación. En unos minutos te comparto la foto del paquete rotulado."
  ],
  urgencia: [
    "🔥 *ÚLTIMAS 2 UNIDADES EN STOCK:* Este producto tiene alta rotación y el lote se agota hoy. ¿Te lo separo con tu nombre para no perderlo?",
    "Te comento que esta promoción con descuento aplica únicamente hasta agotar existencias del día. Si confirmas hoy, te mantengo el precio especial.",
    "Acaban de salir 3 pedidos de este mismo modelo para despacho. Me quedan solo 2 unidades disponibles en bodega principal. ¿Avanzamos?",
    "Si coordinamos tu pedido antes de que salga la camioneta a las 14:00, te llega hoy mismo en la tarde sin costo adicional de flete.",
    "El importador nos notificó que la siguiente remesa llegará con un incremento de precio del 15% por costos de flete marítimo. Aprovecha el valor actual.",
    "Estoy reservando una unidad en el sistema a tu nombre por 2 horas. Por favor confírmame antes de ese tiempo para no liberar el stock a otro cliente.",
    "Hoy cerramos inventario semanal de remate. Es la última oportunidad de llevarte este equipo con el combo de accesorios de regalo.",
    "No te quedes sin tu equipo para la temporada. En estas fechas las empresas de logística se saturan y los pedidos se retrasan. ¡Asegura el tuyo hoy!",
    "Si confirmas en los próximos 30 minutos, te incluyo sin costo adicional una garantía extendida de soporte prioritario durante todo el año.",
    "Tengo a otro cliente consultando por este mismo artículo en Messenger. Como tú me escribiste primero, tienes la prioridad. ¿Te lo aparto?"
  ],
  seguimiento: [
    "¡Hola! 👋 Quería saber si tuviste oportunidad de revisar la información y fotos del equipo que te compartí. ¿Tienes alguna consulta pendiente?",
    "¡Buen día! Te escribo porque hoy recibimos nuevo stock de este modelo y me acordé de tu interés. ¿Aún estás buscando tu equipo?",
    "¡Hola! ¿Cómo estás? Te comento que para los clientes que nos consultaron esta semana logramos habilitar un bono de descuento de $10 adicionales. ¿Te gustaría aprovecharlo?",
    "¡Hola amigo/a! Solo quería verificar si lograste resolver tu requerimiento o si deseas que te cotice otra opción más económica o diferente.",
    "¡Saludos! Estamos armando las rutas de entrega para mañana. Si deseas incluir tu pedido, avísame para coordinar el despacho sin recargos.",
    "¡Hola! Espero te encuentres muy bien. Te dejo por aquí nuestro catálogo actualizado con promociones especiales por si te interesa.",
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

// ─── SUB-CATEGORÍAS DE CATÁLOGO ───
const SUB_CATEGORIES = [
  { id: "camaras", label: "Cámaras de Seguridad", categoryId: "cmr1ljg860003enspbm1m5tic", search: "camara", count: "360+ Cámaras", icon: Shield },
  { id: "celulares", label: "Celulares & Tablets", categoryId: "cmr2n905o0001137wi0ufnmdm", search: "celular", count: "530+ Equipos", icon: Smartphone },
  { id: "laptops", label: "Laptops & Computación", categoryId: "cmrfunoy400031d1g55magimc", search: "laptop", count: "185+ Portátiles", icon: Laptop },
  { id: "cocina", label: "Cocinas & Encimeras", categoryId: "cmqvwkr8i0009ejkxbduhupxu", search: "cocina", count: "130+ Equipos", icon: Home },
  { id: "cerraduras", label: "Cerraduras Smart", categoryId: "cmoe77b3r000bwwr9nado4n9q", search: "cerradura", count: "100+ Cerraduras", icon: ShieldCheck },
  { id: "energia", label: "UPS & Generadores", categoryId: "cmr2n9xoj0003znjlj8jongdt", search: "regulador", count: "270+ Sistemas", icon: Zap },
  { id: "repuestos", label: "Repuestos Laptop", categoryId: "cmoe778p40005wwr94hp2y92j", search: "bateria", count: "560+ Repuestos", icon: Wrench },
  { id: "audio", label: "Audio & Parlantes", categoryId: "cmrf5upb700018v6pi7eop1lb", search: "parlante", count: "240+ Equipos", icon: Sparkles },
  { id: "domotica", label: "Domótica & IoT", categoryId: "cmqvwkvfb000gejkx2kpt69zq", search: "wifi", count: "110+ Dispositivos", icon: Layers },
  { id: "alarmas", label: "Alarmas & Sensores", categoryId: "cmoe7767m0000wwr9qj6erbvo", search: "alarma", count: "70+ Sensores", icon: AlertTriangle }
]

// ─── LANDINGS WEB OFICIALES ───
const LANDINGS_LIST = [
  { name: "Cerraduras Smart Biométricas", url: "/web/cerraduras-smart", category: "Seguridad Digital", desc: "Manijas biométricas para hogar y oficinas con opción de instalación profesional." },
  { name: "Ecosistema Apple Ecuador", url: "/web/apple", category: "Alta Gama", desc: "iPhone, MacBooks, iPads con despacho nacional asegurado." },
  { name: "Laptops & Computación", url: "/web/laptops", category: "Computación", desc: "Portátiles empresariales, de estudio y workstation de alto rendimiento." },
  { name: "Línea de Repuestos de Laptop", url: "/web/repuestos", category: "Servicio Técnico", desc: "Baterías, pantallas, teclados y cargadores para talleres." },
  { name: "Cámaras para Hogar 4K", url: "/web/camaras-hogar", category: "Videovigilancia", desc: "Seguridad inteligente inalámbrica con visión nocturna." },
  { name: "Cercos Eléctricos Perimetrales", url: "/web/cercos-electricos", category: "Perímetros", desc: "Sistemas disuasivos electrificadores de alta precisión." },
  { name: "Barreras Vehiculares Automáticas", url: "/web/barreras-vehiculares", category: "Control Acceso", desc: "Sistemas brushless de control vehicular para condominios." },
  { name: "Cargadores de Auto Eléctrico", url: "/web/cargadores-electricos", category: "Electromovilidad", desc: "Wallbox Livoltek Mevo 7.3kW y cargadores portátiles 220V." },
  { name: "Cocinas & Encimeras Modernas", url: "/web/cocinas", category: "Línea Blanca", desc: "Encimeras de inducción y gas con diseño prémium de vidrio templado." },
  { name: "Hornos Empotrables", url: "/web/hornos", category: "Línea Blanca", desc: "Hornos empotrables eléctricos y mixtos con control térmico preciso." },
  { name: "Campanas Extractoras", url: "/web/campanas", category: "Extracción", desc: "Campanas de isla y pared con filtros de carbono activo." },
  { name: "Bicicletas Eléctricas", url: "/web/bicicletas-electricas", category: "Movilidad", desc: "Movilidad urbana ágil, sin gasto de combustible ni emisiones." },
  { name: "Scooters Eléctricos", url: "/web/scooters", category: "Movilidad", desc: "Scooters plegables Segway Ninebot de alta autonomía." },
  { name: "Generadores Eléctricos", url: "/web/generadores", category: "Energía", desc: "Plantas de respaldo para cortes de luz en hogares e industrias." }
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

// ─── FILTROS DIFERENCIADORES DE CÁMARAS Y RESOLUCIÓN ───
const CAMERA_FILTERS = [
  { id: "all", label: "Todas las Cámaras", badge: "Catálogo Completo" },
  { id: "2mp", label: "2MP · 1080P FHD", badge: "$19 - $35", color: "emerald" },
  { id: "4mp", label: "4MP · 2K QHD", badge: "$54 - $125", color: "cyan" },
  { id: "5mp", label: "5MP / 6MP · 3K", badge: "$35 - $130", color: "blue" },
  { id: "8mp", label: "8MP · 4K UHD", badge: "$135 - $195", color: "purple" },
  { id: "wifi", label: "Wi-Fi & Solar", badge: "EZVIZ / Tapo", color: "sky" },
  { id: "ptz", label: "PTZ 360° / Dome", badge: "Giro Motorizado", color: "indigo" },
  { id: "kit", label: "Kits CCTV + DVR", badge: "Sistemas Completos", color: "amber" },
  { id: "nvr", label: "Grabadores", badge: "NVR / DVR", color: "zinc" }
]

function getCameraSpecs(p: any) {
  const text = `${p?.name || ''} ${p?.sku || ''} ${p?.specs || ''}`.toUpperCase()
  
  // 1. Resolution
  let resolution: { label: string; bg: string; text: string; border: string; tier: string } | null = null
  if (text.includes('8MP') || text.includes('4K') || text.includes('3840') || text.includes('UHD')) {
    resolution = { label: '8MP · 4K UHD', bg: 'bg-purple-950/90', text: 'text-purple-300', border: 'border-purple-500/50', tier: '8mp' }
  } else if (text.includes('6MP')) {
    resolution = { label: '6MP · 3K Panoramic', bg: 'bg-indigo-950/90', text: 'text-indigo-300', border: 'border-indigo-500/50', tier: '6mp' }
  } else if (text.includes('5MP') || text.includes('3K') || text.includes('3 K') || text.includes('3072')) {
    resolution = { label: '5MP · 3K HD', bg: 'bg-blue-950/90', text: 'text-blue-300', border: 'border-blue-500/50', tier: '5mp' }
  } else if (text.includes('4MP') || text.includes('4 MP') || text.includes('2K') || text.includes('QHD') || text.includes('2560')) {
    resolution = { label: '4MP · 2K QHD', bg: 'bg-cyan-950/90', text: 'text-cyan-300', border: 'border-cyan-500/50', tier: '4mp' }
  } else if (text.includes('3MP') || text.includes('3 MP') || text.includes('3 MPX')) {
    resolution = { label: '3MP · 2K', bg: 'bg-sky-950/90', text: 'text-sky-300', border: 'border-sky-500/50', tier: '3mp' }
  } else if (text.includes('2MP') || text.includes('2 MP') || text.includes('1080P') || text.includes('1080') || text.includes('FHD') || text.includes('FULL HD')) {
    resolution = { label: '2MP · 1080P FHD', bg: 'bg-emerald-950/90', text: 'text-emerald-300', border: 'border-emerald-500/50', tier: '2mp' }
  } else if (text.includes('720P') || text.includes('1MP') || text.includes('1 MP')) {
    resolution = { label: '1MP · 720P HD', bg: 'bg-amber-950/90', text: 'text-amber-300', border: 'border-amber-500/50', tier: '1mp' }
  } else if (text.includes('KIT') || text.includes('SISTEMA DE SEGURIDAD')) {
    resolution = { label: 'Kit CCTV + Disco', bg: 'bg-amber-950/90', text: 'text-amber-300', border: 'border-amber-500/50', tier: 'kit' }
  } else if (text.includes('NVR') || text.includes('DVR')) {
    resolution = { label: 'Grabador NVR / DVR', bg: 'bg-zinc-800/90', text: 'text-zinc-200', border: 'border-white/20', tier: 'nvr' }
  }

  // 2. Technology & Optic
  let tech: { label: string; bg: string; text: string; border: string } | null = null
  if (text.includes('SOLAR') || text.includes('BATERIA') || text.includes('BATERÍA')) {
    tech = { label: 'Solar & Batería', bg: 'bg-emerald-950/70', text: 'text-emerald-300', border: 'border-emerald-500/40' }
  } else if (text.includes('PTZ') || text.includes('PANTILT') || text.includes('ROTACION') || text.includes('SPEED DOME') || text.includes('ROBOTICA')) {
    tech = { label: 'PTZ 360° Motorizada', bg: 'bg-indigo-950/70', text: 'text-indigo-300', border: 'border-indigo-500/40' }
  } else if (text.includes('COLOR VU') || text.includes('COLORVU') || text.includes('COLOR MAKER') || text.includes('FULL COLOR') || text.includes('NOCHE A COLOR')) {
    tech = { label: 'ColorVu Noche Color', bg: 'bg-amber-950/70', text: 'text-amber-300', border: 'border-amber-500/40' }
  } else if (text.includes('LUZ HIBRIDA') || text.includes('DUAL LIGHT') || text.includes('SMART DUAL')) {
    tech = { label: 'Luz Híbrida Smart', bg: 'bg-yellow-950/70', text: 'text-yellow-300', border: 'border-yellow-500/40' }
  } else if (text.includes('WIFI') || text.includes('WI-FI') || text.includes('EZVIZ') || text.includes('TAPO')) {
    tech = { label: 'Wi-Fi Inalámbrica', bg: 'bg-cyan-950/70', text: 'text-cyan-300', border: 'border-cyan-500/40' }
  } else if (text.includes('POE') || text.includes('IP ')) {
    tech = { label: 'PoE IP Digital', bg: 'bg-blue-950/70', text: 'text-blue-300', border: 'border-blue-500/40' }
  } else if (text.includes('HD-TVI') || text.includes('TURBOHD') || text.includes('4 EN 1') || text.includes('AHD')) {
    tech = { label: 'TurboHD Coaxial', bg: 'bg-zinc-800/80', text: 'text-zinc-300', border: 'border-white/10' }
  } else if (text.includes('TERMICA') || text.includes('TÉRMICA')) {
    tech = { label: 'Térmica Industrial', bg: 'bg-rose-950/70', text: 'text-rose-300', border: 'border-rose-500/40' }
  }

  // 3. Audio & Alarm
  const hasAudio = text.includes('MIC') || text.includes('AUDIO') || text.includes('PARLANTE') || text.includes('DOS VIAS')
  const hasAlarm = text.includes('ALARMA') || text.includes('SIRENA') || text.includes('ESTROBO') || text.includes('SRB') || text.includes('SL')

  return { resolution, tech, hasAudio, hasAlarm }
}

// ─── FILTROS DIFERENCIADORES DE IPHONE Y GAMA APPLE ───
const IPHONE_FILTERS = [
  { id: "all", label: "Todos los iPhone", badge: "Catálogo Apple" },
  { id: "iphone-17", label: "iPhone 17 Series", badge: "A19 Bionic · 2026", color: "fuchsia" },
  { id: "iphone-16", label: "iPhone 16 Series", badge: "$862 - $1,550", color: "amber" },
  { id: "iphone-15", label: "iPhone 15 Series", badge: "USB-C · Titanio", color: "cyan" },
  { id: "iphone-14", label: "iPhone 14 Series", badge: "$699 - $899", color: "purple" },
  { id: "iphone-13", label: "iPhone 13 Series", badge: "$520 - $699", color: "emerald" },
]

function getIphoneSpecs(p: any) {
  const text = `${p?.name || ''} ${p?.sku || ''} ${p?.specs || ''}`.toUpperCase()
  const isApple = text.includes('IPHONE') || text.includes('APPLE')
  if (!isApple) return null

  // 1. Generation
  let gen: { label: string; bg: string; text: string; border: string; tier: string } | null = null
  if (text.includes('IPHONE 17')) {
    gen = { label: 'iPhone 17 Series', bg: 'bg-fuchsia-950/90', text: 'text-fuchsia-300', border: 'border-fuchsia-500/50', tier: 'iphone-17' }
  } else if (text.includes('IPHONE 16')) {
    gen = { label: 'iPhone 16 Series', bg: 'bg-amber-950/90', text: 'text-amber-300', border: 'border-amber-500/50', tier: 'iphone-16' }
  } else if (text.includes('IPHONE 15')) {
    gen = { label: 'iPhone 15 Series', bg: 'bg-cyan-950/90', text: 'text-cyan-300', border: 'border-cyan-500/50', tier: 'iphone-15' }
  } else if (text.includes('IPHONE 14')) {
    gen = { label: 'iPhone 14 Series', bg: 'bg-purple-950/90', text: 'text-purple-300', border: 'border-purple-500/50', tier: 'iphone-14' }
  } else if (text.includes('IPHONE 13')) {
    gen = { label: 'iPhone 13 Series', bg: 'bg-emerald-950/90', text: 'text-emerald-300', border: 'border-emerald-500/50', tier: 'iphone-13' }
  } else if (text.includes('IPHONE 12') || text.includes('IPHONE 11') || text.includes('IPHONE SE')) {
    gen = { label: 'iPhone Legacy / SE', bg: 'bg-zinc-800/90', text: 'text-zinc-300', border: 'border-white/20', tier: 'iphone-legacy' }
  }

  // 2. Model & Tier
  let model: { label: string; bg: string; text: string; border: string } | null = null
  if (text.includes('PRO MAX')) {
    model = { label: 'Pro Max 6.9" Titanio', bg: 'bg-amber-950/70', text: 'text-amber-300', border: 'border-amber-500/40' }
  } else if (text.includes('PRO') && !text.includes('PRO MAX')) {
    model = { label: 'Pro Titanio 120Hz', bg: 'bg-indigo-950/70', text: 'text-indigo-300', border: 'border-indigo-500/40' }
  } else if (text.includes('AIR')) {
    model = { label: 'Air Ultra Slim A19', bg: 'bg-sky-950/70', text: 'text-sky-300', border: 'border-sky-500/40' }
  } else if (text.includes('PLUS')) {
    model = { label: 'Plus Pantalla 6.7"', bg: 'bg-blue-950/70', text: 'text-blue-300', border: 'border-blue-500/40' }
  } else if (text.includes('MINI')) {
    model = { label: 'Mini Compact', bg: 'bg-emerald-950/70', text: 'text-emerald-300', border: 'border-emerald-500/40' }
  }

  // 3. Storage
  let storage: string | null = null
  if (text.includes('1TB') || text.includes('1 TB')) storage = '1 TB'
  else if (text.includes('512GB') || text.includes('512 GB')) storage = '512 GB'
  else if (text.includes('256GB') || text.includes('256 GB')) storage = '256 GB'
  else if (text.includes('128GB') || text.includes('128 GB')) storage = '128 GB'
  else if (text.includes('64GB') || text.includes('64 GB')) storage = '64 GB'

  // 4. Condition
  const isRefurbished = text.includes('REACONDICIONADO') || text.includes('SEMINUEVO') || text.includes('CPO')

  return { gen, model, storage, isRefurbished }
}

interface ProductCardProps {
  product: any
  copiedId: string | null
  copyToClipboard: (text: string, id: string, label: string) => void
}

function ProductCard({ product: p, copiedId, copyToClipboard }: ProductCardProps) {
  const saleP = Number(p.salePrice) || 0
  const comision20 = saleP * 0.20
  const productWebUrl = `https://atomiccotizador.shop/web/product/${p.id}`
  const specs = getCameraSpecs(p)
  const iphoneSpecs = getIphoneSpecs(p)

  const isInvalidLogo = (url: string) => {
    if (!url || typeof url !== 'string') return true
    const u = url.toLowerCase()
    return (
      u.includes('tms_logow') ||
      u.includes('tecnomega') ||
      u.includes('tecnomegastore') ||
      u.includes('placetopay') ||
      u.includes('servientrega') ||
      u.includes('/marcas/') ||
      u.includes('cropped-favicon')
    )
  }

  const validImage = p.image && !isInvalidLogo(p.image) ? p.image : null

  return (
    <div
      className="p-4 rounded-2xl bg-zinc-900/50 border border-white/[0.08] hover:border-cyan-500/30 transition-all flex flex-col justify-between space-y-3.5 group shadow-sm hover:shadow-xl hover:shadow-cyan-950/20 backdrop-blur-sm"
    >
      {/* Image Stage */}
      <div className="w-full h-48 bg-zinc-950/80 rounded-xl border border-white/[0.06] overflow-hidden flex items-center justify-center relative p-3">
        {validImage ? (
          <img
            src={validImage}
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
        <div className={`img-fallback flex flex-col items-center justify-center text-zinc-600 gap-1.5 ${validImage ? 'hidden' : ''}`}>
          <Package size={28} className="text-zinc-600" />
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Sin Imagen Oficial</span>
        </div>
        
        {/* Category Tag (Top Left) */}
        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-zinc-900/90 border border-white/[0.08] text-[10px] font-mono text-zinc-300">
          {p.category || "General"}
        </span>

        {/* Resolution or iPhone Generation Badge (Top Right - Differentiator) */}
        {specs.resolution ? (
          <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-md border text-[10px] font-mono font-bold shadow-md tracking-wide ${specs.resolution.bg} ${specs.resolution.text} ${specs.resolution.border}`}>
            {specs.resolution.label}
          </span>
        ) : iphoneSpecs?.gen ? (
          <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-md border text-[10px] font-mono font-bold shadow-md tracking-wide ${iphoneSpecs.gen.bg} ${iphoneSpecs.gen.text} ${iphoneSpecs.gen.border}`}>
            {iphoneSpecs.gen.label}
          </span>
        ) : null}
      </div>

      {/* Info */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="text-emerald-400 flex items-center gap-1 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Stock Inmediato
          </span>
          <span className="text-zinc-400">SKU: {p.sku || "N/A"}</span>
        </div>
        <h4 className="text-xs sm:text-sm font-semibold text-zinc-100 group-hover:text-cyan-300 transition-colors line-clamp-2 leading-snug">
          {p.name}
        </h4>

        {/* Differentiation Tags for Cameras (Tech, Audio, Sirena) */}
        {(specs.tech || specs.hasAudio || specs.hasAlarm) && (
          <div className="flex flex-wrap items-center gap-1 pt-0.5">
            {specs.tech && (
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold border ${specs.tech.bg} ${specs.tech.text} ${specs.tech.border}`}>
                {specs.tech.label}
              </span>
            )}
            {specs.hasAudio && (
              <span className="px-1.5 py-0.5 rounded-md text-[9px] font-mono bg-zinc-800 text-zinc-300 border border-white/10 flex items-center gap-1 font-medium">
                <span>🎙️</span> Audio
              </span>
            )}
            {specs.hasAlarm && (
              <span className="px-1.5 py-0.5 rounded-md text-[9px] font-mono bg-rose-950/70 text-rose-300 border border-rose-500/30 flex items-center gap-1 font-semibold">
                <span>🚨</span> Sirena
              </span>
            )}
          </div>
        )}

        {/* Differentiation Tags for iPhone (Model, Storage, Condition) */}
        {iphoneSpecs && (
          <div className="flex flex-wrap items-center gap-1 pt-0.5">
            {iphoneSpecs.model && (
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold border ${iphoneSpecs.model.bg} ${iphoneSpecs.model.text} ${iphoneSpecs.model.border}`}>
                {iphoneSpecs.model.label}
              </span>
            )}
            {iphoneSpecs.storage && (
              <span className="px-1.5 py-0.5 rounded-md text-[9px] font-mono bg-zinc-800 text-cyan-300 border border-cyan-500/30 flex items-center gap-1 font-bold">
                💾 {iphoneSpecs.storage}
              </span>
            )}
            {iphoneSpecs.isRefurbished ? (
              <span className="px-1.5 py-0.5 rounded-md text-[9px] font-mono bg-amber-950/70 text-amber-300 border border-amber-500/30 flex items-center gap-1 font-semibold">
                ♻️ CPO Reacondicionado
              </span>
            ) : (
              <span className="px-1.5 py-0.5 rounded-md text-[9px] font-mono bg-emerald-950/70 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-semibold">
                ✨ 100% Nuevo Sellado
              </span>
            )}
          </div>
        )}
      </div>

      {/* Pricing Breakdown */}
      <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-zinc-950/80 border border-white/5">
        <div>
          <span className="block text-[9px] font-mono text-zinc-400 uppercase">PVP Público</span>
          <span className="text-base font-bold text-white font-mono">
            ${saleP.toFixed(2)} <span className="text-[10px] text-zinc-400 font-normal">USD</span>
          </span>
        </div>
        <div className="text-right">
          <span className="block text-[9px] font-mono text-emerald-400 uppercase">Comisión (20%)</span>
          <span className="text-sm font-bold text-emerald-400 font-mono">
            +${comision20.toFixed(2)} USD
          </span>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="pt-2 border-t border-white/[0.06] space-y-2">
        {/* Link en Tienda Web */}
        <div className="p-2 rounded-xl bg-zinc-950/90 border border-cyan-500/20 space-y-1">
          <div className="flex items-center justify-between gap-1 text-[10px] font-mono">
            <span className="text-cyan-400 font-bold flex items-center gap-1">
              <Globe size={11} className="text-cyan-400 shrink-0" />
              <span>Link Oficial Web:</span>
            </span>
            <button
              onClick={() => copyToClipboard(productWebUrl, `link-${p.id}`, "Link Web")}
              className="px-2 py-0.5 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 text-[9px] font-mono font-bold transition-colors flex items-center gap-1 cursor-pointer"
              title="Copiar link directo para enviar por WhatsApp o redes"
            >
              {copiedId === `link-${p.id}` ? (
                <Check size={10} className="text-emerald-400" />
              ) : (
                <Copy size={10} />
              )}
              <span>{copiedId === `link-${p.id}` ? "¡Copiado!" : "Copiar Link"}</span>
            </button>
          </div>
          <div className="text-[10px] font-mono text-cyan-200/90 truncate bg-black/60 px-2 py-1 rounded border border-white/5 select-all flex items-center justify-between gap-1">
            <span className="truncate">{productWebUrl}</span>
            <a
              href={`/web/product/${p.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 rounded bg-cyan-600/80 hover:bg-cyan-500 text-white shrink-0 transition-colors"
              title="Abrir publicación en pestaña nueva"
            >
              <ExternalLink size={10} />
            </a>
          </div>
        </div>

        {/* Botón Ver en la Web */}
        <a
          href={`/web/product/${p.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono text-xs font-bold shadow-md shadow-cyan-950/30 transition-all group"
        >
          <Globe size={12} className="text-cyan-200" />
          <span>Ver Artículo en la Web</span>
          <ExternalLink size={11} className="group-hover:translate-x-0.5 transition-transform" />
        </a>

        {/* Botones Copiar Título & Copy Comercial PVP */}
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() => copyToClipboard(p.name, `title-${p.id}`, "Título")}
            className="flex items-center justify-center gap-1 px-2 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[10px] font-mono font-bold transition-colors border border-white/10"
            title="Copiar el título limpio del producto"
          >
            {copiedId === `title-${p.id}` ? (
              <Check size={11} className="text-emerald-400" />
            ) : (
              <Copy size={11} className="text-amber-400" />
            )}
            <span className="truncate">{copiedId === `title-${p.id}` ? "¡Título Copiado!" : "Copiar Título"}</span>
          </button>

          <button
            onClick={() => {
              const specLines = [
                specs.resolution ? `🎯 *Resolución Oficial:* ${specs.resolution.label}` : '',
                specs.tech ? `⚡ *Tecnología Óptica:* ${specs.tech.label}` : '',
                specs.hasAudio ? `🎙️ *Audio:* Micrófono incorporado de alta fidelidad` : '',
                specs.hasAlarm ? `🚨 *Seguridad:* Disuasión activa con alarma y sirena` : '',
                iphoneSpecs?.gen ? `📱 *Generación:* ${iphoneSpecs.gen.label}` : '',
                iphoneSpecs?.model ? `💎 *Gama & Acabado:* ${iphoneSpecs.model.label}` : '',
                iphoneSpecs?.storage ? `💾 *Almacenamiento:* ${iphoneSpecs.storage}` : '',
                iphoneSpecs ? (iphoneSpecs.isRefurbished ? `♻️ *Condición:* Reacondicionado Certificado Grado A+` : `📦 *Condición:* 100% Nuevo sellado en caja`) : ''
              ].filter(Boolean).join('\n')

              const commercialCopy = `🔥 *${p.name.toUpperCase()}*
━━━━━━━━━━━━━━━━━━━━━
${specLines ? specLines + '\n' : ''}🏷️ *SKU / Código:* ${p.sku || 'N/A'}
📂 *Categoría:* ${p.category || 'Tecnología & Equipamiento'}
🛡️ *Garantía Oficial:* 1 Año directa con ATOMIC Ecuador
📦 *Condición:* 100% Nuevo sellado en empaque original

💰 *PRECIO OFICIAL PVP: $${saleP.toFixed(2)} USD*
✨ *Stock:* Disponibilidad inmediata para entrega

🚚 *Envíos y Retiros:*
• Quito: Entrega a domicilio express o retiro en oficina (Sector El Labrador)
• Provincias: Envíos 100% asegurados a todo el país vía Servientrega

📲 *Ficha técnica completa y compra en línea:*
${productWebUrl}

💬 *Escríbenos directamente para coordinar tu entrega o responder cualquier duda.*`
              copyToClipboard(commercialCopy, `copy-${p.id}`, "Copy Comercial PVP")
            }}
            className="flex items-center justify-center gap-1 px-2 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900/90 text-emerald-300 text-[10px] font-mono font-bold transition-all border border-emerald-500/40 shadow-sm"
            title="Copiar copy comercial formateado en versión PVP para WhatsApp y Redes"
          >
            {copiedId === `copy-${p.id}` ? (
              <Check size={11} className="text-emerald-400" />
            ) : (
              <Sparkles size={11} className="text-emerald-400" />
            )}
            <span className="truncate">{copiedId === `copy-${p.id}` ? "¡Copy Copiado!" : "Copy Comercial"}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default function PreciosVendedorClient() {
  const [activeTab, setActiveTab] = useState<TabType>("pvp-todos")
  const [selectedMsgCat, setSelectedMsgCat] = useState("saludos")
  const [msgSearchTerm, setMsgSearchTerm] = useState("")
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [isConciergeOpen, setIsConciergeOpen] = useState(false)
  const [imageModalUrl, setImageModalUrl] = useState<string | null>(null)

  // Sub-categoría seleccionada en Tab 2
  const [activeSubCat, setActiveSubCat] = useState("camaras")
  const [cameraFilter, setCameraFilter] = useState("all")
  const [tab1CameraFilter, setTab1CameraFilter] = useState("all")
  const [iphoneFilter, setIphoneFilter] = useState("all")
  const [tab1IphoneFilter, setTab1IphoneFilter] = useState("all")
  const [catProducts, setCatProducts] = useState<any[]>([])
  const [loadingCatProducts, setLoadingCatProducts] = useState(false)

  // Products fetch state for Tab 1 (Buscador general)
  const [products, setProducts] = useState<any[]>([])
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const quickFilters = ["Camara", "iPhone", "Laptop", "Cerradura", "Cocina", "Horno", "Generador", "Bateria"]

  // Lista de productos filtrados en Tab 2 según resolución de cámara o generación de iPhone
  const filteredCatProducts = useMemo(() => {
    if (activeSubCat === "camaras" && cameraFilter !== "all") {
      return catProducts.filter(p => {
        const s = getCameraSpecs(p)
        if (cameraFilter === "2mp") return s.resolution?.tier === "2mp"
        if (cameraFilter === "4mp") return s.resolution?.tier === "4mp"
        if (cameraFilter === "3mp") return s.resolution?.tier === "3mp"
        if (cameraFilter === "5mp") return s.resolution?.tier === "5mp" || s.resolution?.tier === "6mp"
        if (cameraFilter === "8mp") return s.resolution?.tier === "8mp"
        if (cameraFilter === "wifi") return s.tech?.label?.includes("Wi-Fi") || s.tech?.label?.includes("Solar")
        if (cameraFilter === "ptz") return s.tech?.label?.includes("PTZ")
        if (cameraFilter === "kit") return s.resolution?.tier === "kit"
        if (cameraFilter === "nvr") return s.resolution?.tier === "nvr"
        return true
      })
    }
    if (activeSubCat === "celulares" && iphoneFilter !== "all") {
      return catProducts.filter(p => {
        const s = getIphoneSpecs(p)
        if (iphoneFilter === "iphone-17") return s?.gen?.tier === "iphone-17"
        if (iphoneFilter === "iphone-16") return s?.gen?.tier === "iphone-16"
        if (iphoneFilter === "iphone-15") return s?.gen?.tier === "iphone-15"
        if (iphoneFilter === "iphone-14") return s?.gen?.tier === "iphone-14"
        if (iphoneFilter === "iphone-13") return s?.gen?.tier === "iphone-13"
        return true
      })
    }
    return catProducts
  }, [catProducts, activeSubCat, cameraFilter, iphoneFilter])

  // Lista de productos filtrados en Tab 1 según resolución (cámaras) o generación (iPhone)
  const filteredTab1Products = useMemo(() => {
    const isCamSearch = searchTerm.toLowerCase().includes("camara") || searchTerm.toLowerCase() === "camaras"
    const isIphoneSearch = searchTerm.toLowerCase().includes("iphone") || searchTerm.toLowerCase().includes("i phone") || searchTerm.toLowerCase().includes("apple")

    if (isCamSearch && tab1CameraFilter !== "all") {
      return products.filter(p => {
        const s = getCameraSpecs(p)
        if (tab1CameraFilter === "2mp") return s.resolution?.tier === "2mp"
        if (tab1CameraFilter === "4mp") return s.resolution?.tier === "4mp"
        if (tab1CameraFilter === "5mp") return s.resolution?.tier === "5mp" || s.resolution?.tier === "6mp"
        if (tab1CameraFilter === "8mp") return s.resolution?.tier === "8mp"
        if (tab1CameraFilter === "wifi") return s.tech?.label?.includes("Wi-Fi") || s.tech?.label?.includes("Solar")
        if (tab1CameraFilter === "ptz") return s.tech?.label?.includes("PTZ")
        if (tab1CameraFilter === "kit") return s.resolution?.tier === "kit"
        if (tab1CameraFilter === "nvr") return s.resolution?.tier === "nvr"
        return true
      })
    }

    if (isIphoneSearch && tab1IphoneFilter !== "all") {
      return products.filter(p => {
        const s = getIphoneSpecs(p)
        if (tab1IphoneFilter === "iphone-17") return s?.gen?.tier === "iphone-17"
        if (tab1IphoneFilter === "iphone-16") return s?.gen?.tier === "iphone-16"
        if (tab1IphoneFilter === "iphone-15") return s?.gen?.tier === "iphone-15"
        if (tab1IphoneFilter === "iphone-14") return s?.gen?.tier === "iphone-14"
        if (tab1IphoneFilter === "iphone-13") return s?.gen?.tier === "iphone-13"
        return true
      })
    }

    return products
  }, [products, searchTerm, tab1CameraFilter, tab1IphoneFilter])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 2800)
  }

  const copyToClipboard = (text: string, id: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    showToast(`${label} copiado al portapapeles`)
    setTimeout(() => {
      setCopiedId((curr) => (curr === id ? null : curr))
    }, 2200)
  }

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    showToast(`${label} copiado`)
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

    const timer = setTimeout(fetchSearchProducts, 260)
    return () => clearTimeout(timer)
  }, [searchTerm])

  // 2. Fetch para Tab 2 (Sub-Pestañas de Categorías Reales)
  useEffect(() => {
    if (activeTab !== "pvp-categorias") return

    const fetchCategoryProducts = async () => {
      setLoadingCatProducts(true)
      try {
        const subCat = SUB_CATEGORIES.find(s => s.id === activeSubCat)
        const url = (subCat as any)?.categoryId
          ? `/api/public/matriz-precios?categoryId=${(subCat as any).categoryId}&limit=120`
          : `/api/public/matriz-precios?search=${encodeURIComponent(subCat?.search || 'camara')}&limit=120`
        const res = await fetch(url)
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

  // Filtrado interno para la biblioteca de 100 mensajes
  const filteredMessages = useMemo(() => {
    const list = ALL_MESSAGES[selectedMsgCat] || []
    if (!msgSearchTerm.trim()) return list
    const q = msgSearchTerm.toLowerCase()
    return list.filter(m => m.toLowerCase().includes(q))
  }, [selectedMsgCat, msgSearchTerm])

  const navigationTabs = [
    { id: "pvp-todos", label: "Buscador PVP", icon: Search },
    { id: "pvp-categorias", label: "Líneas de Negocio", icon: Layers },
    { id: "pvp-landings", label: "Landings Web", icon: ExternalLink },
    { id: "beneficios", label: "Incentivos Semanales", icon: Sparkles },
    { id: "promociones", label: "Descuentos Pronto Pago", icon: Percent },
    { id: "metodos-envio", label: "Políticas de Despacho", icon: Truck },
    { id: "metodos-pago", label: "Cuentas Bancarias", icon: CreditCard },
    { id: "distribucion", label: "Distribución Mayorista", icon: Package },
    { id: "mensajes", label: "100 Respuestas Rápidas", icon: MessageSquare },
    { id: "contacto", label: "Directorio & Legal", icon: Building2 },
  ]

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-zinc-800 selection:text-white pb-32">
      
      {/* ── TOAST MINIMALISTA LINEAR STYLE ── */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="fixed top-5 inset-x-0 mx-auto w-fit max-w-sm z-50 px-4 py-2.5 rounded-full bg-zinc-900/95 border border-white/15 text-white font-medium text-xs shadow-2xl backdrop-blur-xl flex items-center gap-2.5"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="tracking-tight">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MODAL VISOR DE INFOGRAFÍA OFICIAL ── */}
      <AnimatePresence>
        {imageModalUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
            onClick={() => setImageModalUrl(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-3xl w-full bg-zinc-950 border border-white/10 rounded-2xl p-4 overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-3">
                <span className="text-xs font-mono text-zinc-400">Documento Oficial ATOMIC</span>
                <button
                  onClick={() => setImageModalUrl(null)}
                  className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-white/10"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="flex justify-center bg-black/60 rounded-xl p-2 max-h-[70vh] overflow-auto">
                <img src={imageModalUrl} alt="Vista preliminar" className="max-h-[65vh] w-auto object-contain rounded-lg" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── TOP EXECUTIVE COMMAND BAR HEADER ── */}
      <header className="sticky top-0 z-40 bg-zinc-950/85 backdrop-blur-2xl border-b border-white/[0.08]">
        <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Brand Lockup */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/15 flex items-center justify-center shadow-inner">
              <span className="text-white font-mono font-bold text-xs tracking-tight">AT</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold tracking-tight text-white">ATOMIC</span>
                <span className="text-zinc-600">/</span>
                <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">Sales Console</span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-[10px] font-mono text-zinc-400 tracking-wider">Red Operativa 2026 · Quito & Provincias</span>
              </div>
            </div>
          </div>

          {/* Quick External Actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/web"
              className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-medium text-zinc-300 hover:text-white transition-all flex items-center gap-1.5"
            >
              <span>Catálogo Público</span>
              <ArrowUpRight size={13} className="text-zinc-500" />
            </Link>
          </div>
        </div>

        {/* ── NAVIGATION SEGMENTED CONTROL BAR ── */}
        <div className="border-t border-white/[0.04] bg-zinc-950 px-4 overflow-x-auto scrollbar-hide py-2">
          <div className="w-full max-w-[1720px] mx-auto flex items-center gap-1">
            {navigationTabs.map(tab => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 flex items-center gap-2 border ${
                    isActive
                      ? "bg-zinc-800 text-white border-white/20 shadow-sm"
                      : "bg-transparent text-zinc-400 border-transparent hover:text-zinc-200 hover:bg-white/[0.03]"
                  }`}
                >
                  <tab.icon size={13} className={isActive ? "text-zinc-100" : "text-zinc-500"} />
                  <span className="tracking-tight">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">

        {/* ═══════════ PESTAÑA 1: TODOS LOS PVP (COMMAND SEARCH) ═══════════ */}
        {activeTab === "pvp-todos" && (
          <div className="space-y-6">
            
            {/* Command Header Banner */}
            <div className="p-6 sm:p-7 rounded-2xl bg-zinc-900/60 border border-white/[0.08] space-y-4 shadow-xl backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
                <div className="space-y-1.5 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono tracking-widest uppercase text-cyan-400 px-2.5 py-0.5 rounded-full bg-cyan-950/70 border border-cyan-500/30 font-bold flex items-center gap-1.5 shadow-sm">
                      <Globe size={11} className="text-cyan-400" />
                      Catálogo Maestro Central · Todos los Productos Indexados
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                      Precios PVP Garantizados
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                    Buscador de Precios Públicos (PVP) & Catálogo Central
                  </h1>
                  <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
                    <strong>Aquí encontrarás la totalidad del catálogo oficial de productos de ATOMIC Ecuador</strong> (+3.000 SKUs activos de videovigilancia, computación empresarial y gamer, domótica smart, respaldo de energía, audio profesional, línea blanca y repuestos para talleres). Cada producto cuenta con <strong>1 año de garantía oficial</strong>, comisiones directas del 20% para vendedores autorizados y <strong>herramientas de venta rápida</strong>: copiado de enlace web directo, copiado de título limpio, generación de <strong>Copy Comercial PVP</strong> persuasivo para WhatsApp y redes, y botón directo para abrir y verificar el artículo en la tienda web.
                  </p>
                </div>

                {/* Live Stats Ribbon */}
                <div className="flex items-center gap-2.5 shrink-0">
                  <div className="px-3.5 py-2 rounded-xl bg-zinc-950/90 border border-cyan-500/30 text-right shadow-sm">
                    <span className="block text-[10px] font-mono uppercase text-cyan-400/90">Inventario Central</span>
                    <span className="text-sm font-mono font-bold text-white">3.000+ SKUs</span>
                  </div>
                  <div className="px-3.5 py-2 rounded-xl bg-zinc-950/90 border border-emerald-500/30 text-right shadow-sm">
                    <span className="block text-[10px] font-mono uppercase text-emerald-400">Comisión Vendedor</span>
                    <span className="text-sm font-mono font-bold text-emerald-400">20% Directo</span>
                  </div>
                </div>
              </div>

              {/* Minimalist Command Search Input */}
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por nombre, SKU o marca (ej: Camara, iPhone, Laptop, Cerradura, Cocina, Horno)..."
                  className="w-full pl-10 pr-20 py-2.5 rounded-xl bg-zinc-950 border border-white/10 focus:border-white/30 text-white placeholder-zinc-400 text-xs sm:text-sm focus:outline-none transition-all font-sans"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-400 hover:text-white px-1.5 py-0.5 rounded bg-white/[0.05]"
                  >
                    ESC
                  </button>
                )}
              </div>

              {/* Quick Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide pt-1">
                <span className="text-[11px] font-mono text-zinc-400 shrink-0 mr-1 flex items-center gap-1">
                  <Filter size={11} /> Filtros:
                </span>
                {quickFilters.map(filter => (
                  <button
                    key={filter}
                    onClick={() => setSearchTerm(filter)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium shrink-0 transition-colors border ${
                      searchTerm.toLowerCase() === filter.toLowerCase()
                        ? "bg-zinc-800 text-white border-white/20"
                        : "bg-zinc-900/60 hover:bg-zinc-800/60 border-white/[0.06] text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {/* Quick Resolution Pills when searching for cameras */}
              {(searchTerm.toLowerCase().includes("camara") || searchTerm.toLowerCase() === "camaras") && (
                <div className="pt-2.5 border-t border-white/[0.08] flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
                  <span className="text-[10px] font-mono text-cyan-400 shrink-0 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Sparkles size={11} className="text-cyan-400" /> Resolución:
                  </span>
                  {CAMERA_FILTERS.map(f => {
                    const isActive = tab1CameraFilter === f.id
                    return (
                      <button
                        key={f.id}
                        onClick={() => setTab1CameraFilter(f.id)}
                        className={`shrink-0 px-2.5 py-1 rounded-md text-[11px] font-mono transition-all flex items-center gap-1 border ${
                          isActive
                            ? "bg-cyan-950 text-cyan-200 border-cyan-400/50 shadow-sm"
                            : "bg-zinc-950/80 text-zinc-400 border-white/[0.06] hover:text-zinc-200"
                        }`}
                      >
                        <span>{f.label}</span>
                        <span className={`text-[9px] px-1 py-0.2 rounded ${isActive ? "bg-cyan-900/60 text-cyan-300 font-bold" : "text-zinc-500"}`}>
                          {f.badge}
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Quick iPhone Generation Pills when searching for iPhone */}
              {(searchTerm.toLowerCase().includes("iphone") || searchTerm.toLowerCase().includes("i phone") || searchTerm.toLowerCase().includes("apple")) && (
                <div className="pt-2.5 border-t border-white/[0.08] flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
                  <span className="text-[10px] font-mono text-amber-400 shrink-0 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Smartphone size={11} className="text-amber-400" /> Generación iPhone:
                  </span>
                  {IPHONE_FILTERS.map(f => {
                    const isActive = tab1IphoneFilter === f.id
                    return (
                      <button
                        key={f.id}
                        onClick={() => setTab1IphoneFilter(f.id)}
                        className={`shrink-0 px-2.5 py-1 rounded-md text-[11px] font-mono transition-all flex items-center gap-1 border ${
                          isActive
                            ? "bg-amber-950 text-amber-200 border-amber-400/50 shadow-sm"
                            : "bg-zinc-950/80 text-zinc-400 border-white/[0.06] hover:text-zinc-200"
                        }`}
                      >
                        <span>{f.label}</span>
                        <span className={`text-[9px] px-1 py-0.2 rounded ${isActive ? "bg-amber-900/60 text-amber-300 font-bold" : "text-zinc-500"}`}>
                          {f.badge}
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Product List */}
            {loadingProducts ? (
              <div className="text-center py-20 space-y-3">
                <div className="w-6 h-6 border-2 border-zinc-500 border-t-white rounded-full animate-spin mx-auto" />
                <p className="text-zinc-500 text-xs font-mono">Consultando catálogo en vivo...</p>
              </div>
            ) : filteredTab1Products.length === 0 ? (
              <div className="text-center py-20 bg-zinc-900/30 rounded-2xl border border-white/[0.06] p-8 space-y-2">
                <Package size={32} className="text-zinc-600 mx-auto" />
                <h3 className="text-sm font-semibold text-zinc-200">No se encontraron artículos con ese criterio</h3>
                <p className="text-zinc-500 text-xs max-w-md mx-auto">
                  Prueba buscando con palabras como &ldquo;Camara&rdquo;, &ldquo;iPhone&rdquo;, &ldquo;Laptop&rdquo;, &ldquo;Horno&rdquo; o seleccionando otra resolución.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4">
                {filteredTab1Products.map((p, idx) => (
                  <ProductCard
                    key={p.id || idx}
                    product={p}
                    copiedId={copiedId}
                    copyToClipboard={copyToClipboard}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ═══════════ PESTAÑA 2: LÍNEAS DE NEGOCIO (CATEGORÍAS) ═══════════ */}
        {activeTab === "pvp-categorias" && (
          <div className="space-y-6">
            <div className="p-6 sm:p-7 rounded-2xl bg-zinc-900/60 border border-white/[0.08] space-y-4 shadow-xl backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="space-y-1.5 max-w-3xl relative z-10">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-cyan-400 px-2.5 py-0.5 rounded-full bg-cyan-950/70 border border-cyan-500/30 font-bold flex items-center gap-1.5 shadow-sm">
                    <Layers size={11} className="text-cyan-400" />
                    Estructura por Líneas de Negocio · Catálogo Completo
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                    10 Especialidades
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                  Líneas de Negocio & Filtro por Especialidad Técnica
                </h2>
                <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
                  Explora las 10 líneas maestras de tecnología y equipamiento de ATOMIC Ecuador. Al igual que en la matriz central, dispones de herramientas de venta inmediata en cada producto: copiado de link web, copiado de título, generación de copy comercial en versión PVP y acceso directo al artículo en la web pública.
                </p>
              </div>

              {/* Sub-categorías Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide pt-1">
                {SUB_CATEGORIES.map(sub => {
                  const isSubActive = activeSubCat === sub.id
                  return (
                    <button
                      key={sub.id}
                      onClick={() => setActiveSubCat(sub.id)}
                      className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 border ${
                        isSubActive
                          ? "bg-zinc-800 text-white border-white/20 shadow-sm"
                          : "bg-zinc-900/60 text-zinc-400 border-white/[0.06] hover:text-zinc-200 hover:bg-zinc-800/60"
                      }`}
                    >
                      <sub.icon size={13} className={isSubActive ? "text-white" : "text-zinc-500"} />
                      <span>{sub.label}</span>
                      <span className={`text-[10px] font-mono px-1 py-0.2 rounded ${isSubActive ? "bg-black/30 text-zinc-300" : "text-zinc-500"}`}>
                        {sub.count}
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* Diferenciador Especial para Cámaras de Seguridad */}
              {activeSubCat === "camaras" && (
                <div className="pt-3 border-t border-white/[0.08] space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-[11px] font-mono flex items-center gap-1.5 font-bold uppercase tracking-wider text-cyan-400">
                      <Sparkles size={12} className="text-cyan-400" />
                      Diferenciador por Resolución & Tecnología:
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400 bg-zinc-950 px-2.5 py-0.5 rounded-full border border-white/5">
                      Mostrando {filteredCatProducts.length} de {catProducts.length} cámaras
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-1">
                    {CAMERA_FILTERS.map(f => {
                      const isActive = cameraFilter === f.id
                      return (
                        <button
                          key={f.id}
                          onClick={() => setCameraFilter(f.id)}
                          className={`shrink-0 px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 border ${
                            isActive
                              ? "bg-cyan-950 text-cyan-200 border-cyan-400/50 shadow-md shadow-cyan-950/40"
                              : "bg-zinc-950/70 text-zinc-400 border-white/[0.06] hover:text-zinc-200 hover:bg-zinc-900"
                          }`}
                        >
                          <span>{f.label}</span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded ${isActive ? "bg-cyan-900/60 text-cyan-300 font-bold" : "bg-zinc-900 text-zinc-500"}`}>
                            {f.badge}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Diferenciador Especial para Celulares (Apple iPhone & Gama) */}
              {activeSubCat === "celulares" && (
                <div className="pt-3 border-t border-white/[0.08] space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-[11px] font-mono flex items-center gap-1.5 font-bold uppercase tracking-wider text-amber-400">
                      <Smartphone size={12} className="text-amber-400" />
                      Diferenciador por Generación Apple & Gama:
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400 bg-zinc-950 px-2.5 py-0.5 rounded-full border border-white/5">
                      Mostrando {filteredCatProducts.length} de {catProducts.length} equipos
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-1">
                    {IPHONE_FILTERS.map(f => {
                      const isActive = iphoneFilter === f.id
                      return (
                        <button
                          key={f.id}
                          onClick={() => setIphoneFilter(f.id)}
                          className={`shrink-0 px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 border ${
                            isActive
                              ? "bg-amber-950 text-amber-200 border-amber-400/50 shadow-md shadow-amber-950/40"
                              : "bg-zinc-950/70 text-zinc-400 border-white/[0.06] hover:text-zinc-200 hover:bg-zinc-900"
                          }`}
                        >
                          <span>{f.label}</span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded ${isActive ? "bg-amber-900/60 text-amber-300 font-bold" : "bg-zinc-900 text-zinc-500"}`}>
                            {f.badge}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Listado de Productos de Categoría */}
            {loadingCatProducts ? (
              <div className="text-center py-20 space-y-3">
                <div className="w-6 h-6 border-2 border-zinc-500 border-t-white rounded-full animate-spin mx-auto" />
                <p className="text-zinc-500 text-xs font-mono">Cargando categoría seleccionada...</p>
              </div>
            ) : filteredCatProducts.length === 0 ? (
              <div className="text-center py-20 bg-zinc-900/30 rounded-2xl border border-white/[0.06] p-8 space-y-2">
                <Package size={32} className="text-zinc-600 mx-auto" />
                <h3 className="text-sm font-semibold text-zinc-200">No se encontraron artículos con este filtro</h3>
                <p className="text-zinc-500 text-xs max-w-md mx-auto">
                  Prueba seleccionando &ldquo;Todas las Cámaras&rdquo; o elige otra categoría.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4">
                {filteredCatProducts.map((p, idx) => (
                  <ProductCard
                    key={p.id || idx}
                    product={p}
                    copiedId={copiedId}
                    copyToClipboard={copyToClipboard}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ═══════════ PESTAÑA 3: LANDINGS WEB ═══════════ */}
        {activeTab === "pvp-landings" && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/[0.08] space-y-2">
              <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-400 px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08]">
                Recursos para Clientes
              </span>
              <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
                Landings Pages Oficiales para Compartir
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm max-w-2xl">
                Páginas públicas optimizadas para conversión móvil. Incluyen fotos de alta resolución, fichas técnicas y testimonios.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4">
              {LANDINGS_LIST.map((l, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-zinc-900/40 border border-white/[0.07] hover:border-white/[0.18] transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono text-zinc-400 px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.06] inline-block">
                      {l.category}
                    </span>
                    <h4 className="text-sm font-semibold text-zinc-100">{l.name}</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">{l.desc}</p>
                  </div>

                  <div className="pt-3 border-t border-white/[0.05] flex items-center gap-2">
                    <button
                      onClick={() => handleCopyText(`https://atomiccotizador.shop${l.url}`, `Enlace de ${l.name}`)}
                      className="flex-1 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-200 hover:text-white font-medium text-xs transition-all flex items-center justify-center gap-1.5"
                    >
                      <Copy size={12} className="text-zinc-400" />
                      <span>Copiar Link</span>
                    </button>
                    <Link
                      href={l.url}
                      target="_blank"
                      className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-400 hover:text-white transition-all"
                      title="Abrir en pestaña nueva"
                    >
                      <ExternalLink size={13} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════ PESTAÑA 4: INCENTIVOS & BONOS SEMANALES ═══════════ */}
        {activeTab === "beneficios" && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/[0.08] space-y-2">
              <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-400 px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08]">
                Esquema de Incentivos
              </span>
              <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
                Bonificaciones y Rendimiento Comercial
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
                Estructura adicional a la comisión base del 20%, diseñada para premiar la constancia en el cierre diario de operaciones.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {/* Bono 1 */}
              <div className="p-5 rounded-xl bg-zinc-900/40 border border-white/[0.08] space-y-3">
                <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-white/10 flex items-center justify-center text-zinc-200">
                  <Flame size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-zinc-400 block">Liquidación Inmediata</span>
                  <h3 className="text-base font-semibold text-white mt-0.5">Bono Flash de $5 a $10 USD</h3>
                  <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                    Incentivo líquido inmediato de <strong>$5 USD</strong> (en tickets de $50 a $250) o <strong>$10 USD</strong> (tickets mayores a $250) sumado al 20% de comisión base.
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-zinc-950 border border-white/[0.06] text-[11px] font-mono text-zinc-300">
                  ⚡ Se abona inmediatamente al confirmar el comprobante.
                </div>
              </div>

              {/* Bono 2 */}
              <div className="p-5 rounded-xl bg-zinc-900/40 border border-white/[0.08] space-y-3">
                <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-white/10 flex items-center justify-center text-zinc-200">
                  <Sparkles size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-zinc-400 block">Escalafón Cumplido</span>
                  <h3 className="text-base font-semibold text-white mt-0.5">Clasificación a Sueldo Base</h3>
                  <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                    Al completar los 30 días de actividad con bitácora de publicaciones y llamadas, desbloqueas tu asignación base mensual ($25, $100, $200 o $450 USD).
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-zinc-950 border border-white/[0.06] text-[11px] font-mono text-zinc-300">
                  🎯 Liquidación directa en cuenta bancaria el día 30.
                </div>
              </div>

              {/* Bono 3 */}
              <div className="p-5 rounded-xl bg-zinc-900/40 border border-white/[0.08] space-y-3">
                <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-white/10 flex items-center justify-center text-zinc-200">
                  <Gift size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-zinc-400 block">Herramienta de Cierre</span>
                  <h3 className="text-base font-semibold text-white mt-0.5">Envío Nacional Bonificado</h3>
                  <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                    Si el comprador realiza el abono del 100% anticipado, ATOMIC absorbe el costo del flete nacional a cualquier provincia del país.
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-zinc-950 border border-white/[0.06] text-[11px] font-mono text-zinc-300">
                  📦 Gancho comercial para clientes indecisos.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════ PESTAÑA 5: DESCUENTOS POR PRONTO PAGO ═══════════ */}
        {activeTab === "promociones" && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/[0.08] space-y-2">
              <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-400 px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08]">
                Políticas Comerciales de Descuento
              </span>
              <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
                Escala Autorizada de Descuentos por Pago Anticipado
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
                Tabulador oficial para clientes que cancelan la totalidad de la orden de forma anticipada antes del despacho.
              </p>
            </div>

            {/* Infografía oficial toggle/download */}
            <div className="p-4 rounded-xl bg-zinc-900/30 border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <ShieldCheck size={18} className="text-zinc-400" />
                <div>
                  <h4 className="text-xs font-semibold text-zinc-200">Infografía Oficial de Descuentos</h4>
                  <p className="text-[11px] text-zinc-400 font-mono">Documento gráfico auditable para compartir con clientes</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setImageModalUrl("/images/pagos/politicas-descuentos-anticipo.png")}
                  className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-300 hover:text-white text-xs font-medium transition-all"
                >
                  Visualizar Imagen
                </button>
                <a
                  href="/images/pagos/politicas-descuentos-anticipo.png"
                  download="politicas-descuentos-anticipo.png"
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-white/10 text-white text-xs font-medium transition-all flex items-center gap-1.5"
                >
                  <Download size={12} />
                  <span>Descargar</span>
                </a>
              </div>
            </div>

            {/* Tiers Grid */}
            <div className="grid md:grid-cols-3 gap-4">
              {/* VIP 13% */}
              <div className="p-5 rounded-xl bg-zinc-900/40 border border-white/[0.08] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-zinc-400">Compras $500 - $1.000+</span>
                  <span className="px-2 py-0.5 rounded bg-zinc-800 text-white font-mono text-xs font-semibold">13% OFF</span>
                </div>
                <h4 className="text-base font-semibold text-white">Descuento VIP del 13%</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Para pagos <strong>100% anticipados</strong> en compras superiores a $500. Incluye flete express a domicilio <strong>gratuito</strong> a nivel nacional.
                </p>
                <button
                  onClick={() => handleCopyText("🎉 ¡Excelente noticia! Al cancelar el 100% anticipado de tu compra mayor a $500, te aplicamos un DESCUENTO EXCLUSIVO DEL 13% sobre el total y te OBSEQUIAMOS el envío a domicilio a tu ciudad.", "Mensaje Descuento 13%")}
                  className="w-full py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-200 hover:text-white text-xs font-medium transition-all flex items-center justify-center gap-1.5"
                >
                  <Copy size={12} />
                  <span>Copiar Mensaje</span>
                </button>
              </div>

              {/* Plus 10% */}
              <div className="p-5 rounded-xl bg-zinc-900/40 border border-white/[0.08] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-zinc-400">Compras $100 - $499</span>
                  <span className="px-2 py-0.5 rounded bg-zinc-800 text-white font-mono text-xs font-semibold">10% OFF</span>
                </div>
                <h4 className="text-base font-semibold text-white">Descuento Plus del 10%</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Para compras de $100 a $499 cancelando el 100% anticipado. Se otorga despacho preferencial y embalaje reforzado.
                </p>
                <button
                  onClick={() => handleCopyText("🎁 Si realizas el pago del 100% anticipado hoy mismo, te autorizo un DESCUENTO ESPECIAL DEL 10% más despacho preferencial express asegurado a tu domicilio.", "Mensaje Descuento 10%")}
                  className="w-full py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-200 hover:text-white text-xs font-medium transition-all flex items-center justify-center gap-1.5"
                >
                  <Copy size={12} />
                  <span>Copiar Mensaje</span>
                </button>
              </div>

              {/* Base 5% */}
              <div className="p-5 rounded-xl bg-zinc-900/40 border border-white/[0.08] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-zinc-400">Compras $0 - $99</span>
                  <span className="px-2 py-0.5 rounded bg-zinc-800 text-white font-mono text-xs font-semibold">5% OFF</span>
                </div>
                <h4 className="text-base font-semibold text-white">Descuento Base del 5%</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Para compras menores a $100 con pago anticipado del 100%. Facilita el redondeo comercial para cierre inmediato.
                </p>
                <button
                  onClick={() => handleCopyText("✅ Por pronto pago anticipado te otorgo un 5% de descuento inmediato para cerrar tu orden hoy mismo y asegurar la entrega inmediata.", "Mensaje Descuento 5%")}
                  className="w-full py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-200 hover:text-white text-xs font-medium transition-all flex items-center justify-center gap-1.5"
                >
                  <Copy size={12} />
                  <span>Copiar Mensaje</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════ PESTAÑA 6: POLÍTICAS DE ENVÍO & ANTICIPOS ═══════════ */}
        {activeTab === "metodos-envio" && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/[0.08] space-y-2">
              <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-400 px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08]">
                Protocolo Logístico
              </span>
              <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
                Políticas Oficiales de Envío, Bodegas & Anticipos
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
                Lineamientos operativos de despacho contra entrega y transferencias de bodega para Quito y provincias del Ecuador.
              </p>
            </div>

            {/* Infografía oficial toggle/download */}
            <div className="p-4 rounded-xl bg-zinc-900/30 border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Truck size={18} className="text-zinc-400" />
                <div>
                  <h4 className="text-xs font-semibold text-zinc-200">Infografía Oficial de Políticas de Entrega</h4>
                  <p className="text-[11px] text-zinc-400 font-mono">Resumen visual de coberturas y métodos de cobro</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setImageModalUrl("/images/pagos/politicas-envios-anticipos.png")}
                  className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-300 hover:text-white text-xs font-medium transition-all"
                >
                  Visualizar Imagen
                </button>
                <a
                  href="/images/pagos/politicas-envios-anticipos.png"
                  download="politicas-envios-anticipos.png"
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-white/10 text-white text-xs font-medium transition-all flex items-center gap-1.5"
                >
                  <Download size={12} />
                  <span>Descargar</span>
                </a>
              </div>
            </div>

            {/* Protocol Cards */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-5 rounded-xl bg-zinc-900/40 border border-white/[0.08] space-y-3">
                <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-white/10 flex items-center justify-center text-zinc-200">
                  <Home size={18} />
                </div>
                <h4 className="text-sm font-semibold text-white">Línea Hogar & Cocina (Bajo Pedido)</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Para campanas, hornos y encimeras se requiere un <strong>anticipo de $20 a $100 USD</strong> según el modelo, ya que se trasladan desde bodegas asociadas en <strong>24 a 48 horas</strong> directo a domicilio.
                </p>
                <div className="p-2.5 rounded-lg bg-zinc-950 border border-white/[0.06] text-[11px] font-mono text-zinc-300">
                  ⚠️ No se moviliza línea pesada sin seña previa.
                </div>
              </div>

              <div className="p-5 rounded-xl bg-zinc-900/40 border border-white/[0.08] space-y-3">
                <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-white/10 flex items-center justify-center text-zinc-200">
                  <Laptop size={18} />
                </div>
                <h4 className="text-sm font-semibold text-white">Tecnología & Demostraciones (Quito)</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  En Quito se realizan pruebas, encendido y verificación al momento de la entrega. Pedidos confirmados antes de las 13:00 ingresan a ruta del mismo día.
                </p>
                <div className="p-2.5 rounded-lg bg-zinc-950 border border-white/[0.06] text-[11px] font-mono text-zinc-300">
                  ⚡ Entregas el mismo día confirmando antes de 13:00.
                </div>
              </div>

              <div className="p-5 rounded-xl bg-zinc-900/40 border border-white/[0.08] space-y-3">
                <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-white/10 flex items-center justify-center text-zinc-200">
                  <Truck size={18} />
                </div>
                <h4 className="text-sm font-semibold text-white">Convenio Provincias & Escala</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  • <strong>$0 - $100 USD:</strong> Pago del flete ($5 - $7) y valor del producto contra entrega a transportadora aliada.<br />
                  • <strong>$100 - $999 USD:</strong> Contra entrega con 50% de abono previo.<br />
                  • <strong>$1.000+ USD:</strong> 70% anticipo por importación o reserva.
                </p>
                <div className="p-2.5 rounded-lg bg-zinc-950 border border-white/[0.06] text-[11px] font-mono text-zinc-300">
                  🛡️ Convenio de recaudación 100% verificado.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════ PESTAÑA 7: CUENTAS BANCARIAS (LUXURY FINTECH CARD) ═══════════ */}
        {activeTab === "metodos-pago" && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/[0.08] space-y-2">
              <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-400 px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08]">
                Canales de Recaudación Oficiales
              </span>
              <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
                Cuentas Bancarias Autorizadas de la Empresa
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
                Utiliza exclusivamente estas cuentas bancarias registradas a nombre de los directivos para depósitos y transferencias.
              </p>
            </div>

            {/* Luxury Fintech Cards Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Card 1: Banco Guayaquil */}
              <div className="rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border border-white/10 p-6 space-y-5 shadow-2xl relative overflow-hidden">
                {/* Subtle top glare */}
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500" />
                    <span className="text-xs font-mono font-semibold tracking-wider text-zinc-300 uppercase">Banco Guayaquil</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08]">
                    Cuenta de Ahorros
                  </span>
                </div>

                {/* EMV Microchip Graphic */}
                <div className="w-10 h-7 rounded bg-amber-400/20 border border-amber-400/40 relative flex items-center justify-center">
                  <div className="w-8 h-4 border-t border-b border-amber-400/30" />
                </div>

                {/* Account Number */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Número de Cuenta</span>
                  <div className="flex items-center justify-between">
                    <span className="text-xl sm:text-2xl font-mono font-semibold text-white tracking-widest">
                      0124 465 041
                    </span>
                    <button
                      onClick={() => handleCopyText("0124465041", "Cuenta Banco Guayaquil")}
                      className="p-1.5 rounded-md bg-white/[0.05] hover:bg-white/[0.10] text-zinc-300 hover:text-white transition-all"
                      title="Copiar número"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="pt-3 border-t border-white/[0.06] grid grid-cols-2 gap-3 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-zinc-400 block uppercase">Titular</span>
                    <span className="font-semibold text-zinc-200">Juan Pablo Guzmán</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-400 block uppercase">Cédula</span>
                    <span className="font-semibold text-zinc-200">1751940212</span>
                  </div>
                </div>

                {/* Quick Copy Action */}
                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => {
                      const txt = `🔴 DATOS DE PAGO - BANCO GUAYAQUIL\n• Banco: Banco Guayaquil\n• Tipo de Cuenta: Ahorros\n• Número: 0124465041\n• Titular: Juan Pablo Guzmán Morales\n• Cédula: 1751940212\n\nPor favor envía el comprobante visible tras realizar la transferencia.`
                      handleCopyText(txt, "Datos Banco Guayaquil")
                    }}
                    className="flex-1 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs transition-all flex items-center justify-center gap-1.5 border border-white/10"
                  >
                    <Copy size={13} />
                    <span>Copiar Datos Completos</span>
                  </button>
                  <button
                    onClick={() => setImageModalUrl("/images/pagos/banco-guayaquil.png")}
                    className="p-2.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white border border-white/[0.08]"
                    title="Ver Tarjeta Oficial"
                  >
                    <ExternalLink size={14} />
                  </button>
                </div>
              </div>

              {/* Card 2: Banco Pichincha */}
              <div className="rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border border-white/10 p-6 space-y-5 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <span className="text-xs font-mono font-semibold tracking-wider text-zinc-300 uppercase">Banco Pichincha</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08]">
                    Cuenta de Ahorros
                  </span>
                </div>

                {/* EMV Microchip Graphic */}
                <div className="w-10 h-7 rounded bg-amber-400/20 border border-amber-400/40 relative flex items-center justify-center">
                  <div className="w-8 h-4 border-t border-b border-amber-400/30" />
                </div>

                {/* Account Number */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Número de Cuenta</span>
                  <div className="flex items-center justify-between">
                    <span className="text-xl sm:text-2xl font-mono font-semibold text-white tracking-widest">
                      2206 020 091
                    </span>
                    <button
                      onClick={() => handleCopyText("2206020091", "Cuenta Banco Pichincha")}
                      className="p-1.5 rounded-md bg-white/[0.05] hover:bg-white/[0.10] text-zinc-300 hover:text-white transition-all"
                      title="Copiar número"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="pt-3 border-t border-white/[0.06] grid grid-cols-2 gap-3 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-zinc-400 block uppercase">Titular</span>
                    <span className="font-semibold text-zinc-200">Santiago Guzmán</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-400 block uppercase">Cédula</span>
                    <span className="font-semibold text-zinc-200">1709540478</span>
                  </div>
                </div>

                {/* Quick Copy Action */}
                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => {
                      const txt = `🟡 DATOS DE PAGO - BANCO PICHINCHA\n• Banco: Banco Pichincha\n• Tipo de Cuenta: Ahorros\n• Número: 2206020091\n• Titular: Santiago Guzmán\n• Cédula: 1709540478\n• Correo: sguzmanpal@yahoo.com\n\nPor favor envía el comprobante visible tras realizar la transferencia.`
                      handleCopyText(txt, "Datos Banco Pichincha")
                    }}
                    className="flex-1 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs transition-all flex items-center justify-center gap-1.5 border border-white/10"
                  >
                    <Copy size={13} />
                    <span>Copiar Datos Completos</span>
                  </button>
                  <button
                    onClick={() => setImageModalUrl("/images/pagos/banco-pichincha.png")}
                    className="p-2.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white border border-white/[0.08]"
                    title="Ver Tarjeta Oficial"
                  >
                    <ExternalLink size={14} />
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ═══════════ PESTAÑA 8: DISTRIBUCIÓN MAYORISTA ═══════════ */}
        {activeTab === "distribucion" && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/[0.08] space-y-2">
              <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-400 px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08]">
                Canal B2B & Talleres
              </span>
              <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
                Distribución Mayorista Directa (Desde 6 Unidades)
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
                Precios de importador en electrónica, repuestos y gadgets para talleres, tiendas locales y emprendedores.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-xl bg-zinc-900/40 border border-white/[0.08] space-y-2.5">
                <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-white/10 flex items-center justify-center text-zinc-300">
                  <Laptop size={16} />
                </div>
                <h4 className="text-sm font-semibold text-white">Repuestos de Laptop</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Baterías originales, pantallas LED slim, teclados para todas las marcas, cargadores tipo C y flex de video.
                </p>
                <span className="text-[10px] font-mono text-zinc-400 block pt-1">Mínimo: 6 unidades surtidas</span>
              </div>

              <div className="p-5 rounded-xl bg-zinc-900/40 border border-white/[0.08] space-y-2.5">
                <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-white/10 flex items-center justify-center text-zinc-300">
                  <Wrench size={16} />
                </div>
                <h4 className="text-sm font-semibold text-white">Tarjetas Electrónicas</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Módulos de potencia, fuentes conmutadas, placas base para proyectos de automatización e IoT.
                </p>
                <span className="text-[10px] font-mono text-zinc-400 block pt-1">Precios de contenedor</span>
              </div>

              <div className="p-5 rounded-xl bg-zinc-900/40 border border-white/[0.08] space-y-2.5">
                <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-white/10 flex items-center justify-center text-zinc-300">
                  <Sparkles size={16} />
                </div>
                <h4 className="text-sm font-semibold text-white">Drones Económicos</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Modelos con cámara 4K Wi-Fi, sensores anticolisión y estuches. Rápida rotación en marketplace.
                </p>
                <span className="text-[10px] font-mono text-zinc-400 block pt-1">Margen comercial: 35%+</span>
              </div>

              <div className="p-5 rounded-xl bg-zinc-900/40 border border-white/[0.08] space-y-2.5">
                <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-white/10 flex items-center justify-center text-zinc-300">
                  <Home size={16} />
                </div>
                <h4 className="text-sm font-semibold text-white">Gadgets de Hogar</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Luces solares, pequeños electrodomésticos y accesorios importados para bazar o ventas online.
                </p>
                <span className="text-[10px] font-mono text-zinc-400 block pt-1">Despacho garantizado</span>
              </div>
            </div>

            {/* Script mayorista copiable */}
            <div className="p-5 rounded-xl bg-zinc-900/30 border border-white/[0.06] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-zinc-400 uppercase">Mensaje de Captación B2B</span>
                <span className="text-[11px] font-mono text-emerald-400">Listo para enviar</span>
              </div>
              <p className="text-xs text-zinc-300 font-mono leading-relaxed bg-zinc-950 p-3.5 rounded-lg border border-white/[0.04]">
                ¡Hola colega! 🚀 Te saluda ATOMIC Ecuador. Brindamos distribución directa de importación para pequeños negocios, técnicos y emprendedores en todo el país. Accede a precios mayoristas desde solo 6 unidades en: Repuestos de Laptop (pantallas, teclados, baterías, cargadores), Tarjetas Electrónicas, Drones y Gadgets de Hogar. Te enviamos la lista de precios mayorista directamente a tu WhatsApp para que aumentes tus márgenes de ganancia. ¿Te gustaría recibir el catálogo hoy?
              </p>
              <button
                onClick={() => {
                  const txt = `¡Hola colega! 🚀 Te saluda ATOMIC Ecuador. Brindamos distribución directa de importación para pequeños negocios, técnicos y emprendedores en todo el país. Accede a precios mayoristas desde solo 6 unidades en: Repuestos de Laptop (pantallas, teclados, baterías, cargadores), Tarjetas Electrónicas, Drones y Gadgets de Hogar. Te enviamos la lista de precios mayorista directamente a tu WhatsApp para que aumentes tus márgenes de ganancia. ¿Te gustaría recibir el catálogo hoy?`
                  handleCopyText(txt, "Mensaje B2B Mayorista")
                }}
                className="w-full py-2.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-white font-medium text-xs transition-all flex items-center justify-center gap-2"
              >
                <Copy size={13} />
                <span>Copiar Mensaje Mayorista</span>
              </button>
            </div>
          </div>
        )}

        {/* ═══════════ PESTAÑA 9: 100 RESPUESTAS RÁPIDAS (SALES VAULT) ═══════════ */}
        {activeTab === "mensajes" && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/[0.08] space-y-2">
              <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-400 px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08]">
                Biblioteca de Cierres Comerciales
              </span>
              <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
                100 Mensajes y Guiones de Venta
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
                Selecciona la etapa del embudo o filtra por palabra clave para copiar la respuesta exacta a WhatsApp.
              </p>
            </div>

            {/* Selector de Etapa & Buscador interno */}
            <div className="p-4 rounded-xl bg-zinc-900/30 border border-white/[0.06] space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                {/* Desplegable de Etapas */}
                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">
                    Fase de la Conversación
                  </label>
                  <div className="relative">
                    <select
                      value={selectedMsgCat}
                      onChange={(e) => setSelectedMsgCat(e.target.value)}
                      className="w-full appearance-none px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-white/10 text-white font-medium text-xs focus:outline-none focus:border-white/30 transition-all cursor-pointer"
                    >
                      {MESSAGE_CATEGORIES.map(cat => (
                        <option key={cat.id} value={cat.id} className="bg-zinc-900 text-white">
                          {cat.label} ({cat.count})
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                  </div>
                </div>

                {/* Filtro en vivo de texto */}
                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">
                    Filtrar por término (opcional)
                  </label>
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="text"
                      value={msgSearchTerm}
                      onChange={(e) => setMsgSearchTerm(e.target.value)}
                      placeholder="Ej: flete, garantía, proforma, provincia..."
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-zinc-950 border border-white/10 text-white text-xs placeholder-zinc-400 focus:outline-none focus:border-white/30 transition-all font-sans"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Listado de Mensajes */}
            <div className="space-y-3">
              {filteredMessages.length === 0 ? (
                <div className="text-center py-12 text-zinc-400 text-xs font-mono">
                  No se encontraron mensajes con ese término.
                </div>
              ) : (
                filteredMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-zinc-900/30 border border-white/[0.06] hover:border-white/[0.14] transition-all space-y-2.5"
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                        Opción #{idx + 1}
                      </span>
                      <button
                        onClick={() => {
                          handleCopyText(msg, `Mensaje #${idx + 1}`)
                          setCopiedIndex(idx)
                          setTimeout(() => setCopiedIndex(null), 1800)
                        }}
                        className="px-2.5 py-1 rounded-md bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-300 hover:text-white text-xs font-medium transition-all flex items-center gap-1.5"
                      >
                        {copiedIndex === idx ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                        <span>{copiedIndex === idx ? "Copiado" : "Copiar"}</span>
                      </button>
                    </div>

                    <p className="text-xs text-zinc-300 leading-relaxed font-sans whitespace-pre-line">
                      {msg}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ═══════════ PESTAÑA 10: DIRECTORIO & QUIÉNES SOMOS ═══════════ */}
        {activeTab === "contacto" && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/[0.08] space-y-2">
              <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-400 px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08]">
                Información Corporativa & Respaldos
              </span>
              <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
                ¿Quiénes Somos? Directorio Oficial & Legal
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm max-w-3xl leading-relaxed">
                ATOMIC Electronics Ecuador (división de AB Ingenieros) es una empresa formal dedicada a la importación y comercialización mayorista de seguridad electrónica, computación y equipamiento con garantía de 1 año.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Tarjeta 1: Datos Fiscales */}
              <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/[0.08] space-y-4">
                <div className="flex items-center gap-3 border-b border-white/[0.06] pb-3">
                  <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-white/10 flex items-center justify-center text-zinc-200">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Registro Fiscal & Sede Central</h3>
                    <p className="text-[11px] text-zinc-400 font-mono">Información verificable ante el SRI</p>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs font-mono">
                  <div className="flex justify-between items-center py-1 border-b border-white/[0.04]">
                    <span className="text-zinc-400">Razón Social:</span>
                    <span className="text-zinc-200 font-semibold font-sans">ATOMIC Electronics / AB Ingenieros</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-white/[0.04]">
                    <span className="text-zinc-400">RUC Facturación:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-zinc-100 font-bold">1709540478001</span>
                      <button
                        onClick={() => handleCopyText("1709540478001", "RUC Oficial")}
                        className="p-1 rounded text-zinc-400 hover:text-white"
                        title="Copiar RUC"
                      >
                        <Copy size={12} />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-white/[0.04]">
                    <span className="text-zinc-400">Sede Física:</span>
                    <span className="text-zinc-200 font-sans">Quito Norte, Sector El Labrador</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-white/[0.04]">
                    <span className="text-zinc-400">Horario Central:</span>
                    <span className="text-zinc-200 font-sans">Lunes a Sábado: 08:30 - 18:30</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-zinc-400">Garantía Escrita:</span>
                    <span className="text-emerald-400 font-sans">1 Año en Todos los Artículos</span>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href="https://maps.google.com/?q=Quito+Sector+El+Labrador"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-300 hover:text-white text-xs font-medium transition-all flex items-center justify-center gap-2"
                  >
                    <MapPin size={13} />
                    <span>Ver Ubicación en Google Maps</span>
                  </a>
                </div>
              </div>

              {/* Tarjeta 2: Directorio de Contactos */}
              <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/[0.08] space-y-4">
                <div className="flex items-center gap-3 border-b border-white/[0.06] pb-3">
                  <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-white/10 flex items-center justify-center text-zinc-200">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Directorio de Enlace Directo</h3>
                    <p className="text-[11px] text-zinc-400 font-mono">Soporte Operativo & Dirección</p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {/* Stefy */}
                  <div className="p-3 rounded-lg bg-zinc-950/60 border border-white/[0.05] flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-mono uppercase text-zinc-400 block">Admisión & Bodega</span>
                      <h4 className="text-xs font-semibold text-white">Stefy</h4>
                      <p className="text-[11px] text-zinc-400 font-mono">+593 98 947 6556</p>
                    </div>
                    <a
                      href="https://wa.me/593989476556?text=Saludos%20Stefy%2C%20solicito%20asistencia%20comercial%20o%20soporte%20de%20bodega."
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs flex items-center gap-1.5 border border-white/10"
                    >
                      <MessageSquare size={12} />
                      <span>WhatsApp</span>
                    </a>
                  </div>

                  {/* Juan Pablo Guzmán */}
                  <div className="p-3 rounded-lg bg-zinc-950/60 border border-white/[0.05] flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-mono uppercase text-zinc-400 block">Dirección General</span>
                      <h4 className="text-xs font-semibold text-white">Juan Pablo Guzmán Morales</h4>
                      <p className="text-[11px] text-zinc-400 font-mono">+593 98 947 6556</p>
                    </div>
                    <a
                      href="https://wa.me/593989476556?text=Saludos%20Director%20Juan%20Guzm%C3%A1n%2C%20requiero%20asistencia%20para%20un%20cierre%20comercial."
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs flex items-center gap-1.5 border border-white/10"
                    >
                      <MessageSquare size={12} />
                      <span>WhatsApp</span>
                    </a>
                  </div>

                  {/* Santiago Guzmán */}
                  <div className="p-3 rounded-lg bg-zinc-950/60 border border-white/[0.05] flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-mono uppercase text-zinc-400 block">Gerencia General & Finanzas</span>
                      <h4 className="text-xs font-semibold text-white">Santiago Guzmán</h4>
                      <p className="text-[11px] text-zinc-400 font-mono">+593 98 425 2528</p>
                    </div>
                    <a
                      href="https://wa.me/593984252528?text=Saludos%20Santiago%20Guzm%C3%A1n%2C%20le%20escribo%20desde%20el%20portal%20comercial%20ATOMIC."
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs flex items-center gap-1.5 border border-white/10"
                    >
                      <MessageSquare size={12} />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* ── SOPORTE FLOTANTE REFINED RAYCAST STYLE ── */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        <AnimatePresence>
          {isConciergeOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.15 }}
              className="mb-3 max-w-xs sm:max-w-sm p-4 rounded-2xl bg-zinc-950/95 border border-white/15 shadow-2xl backdrop-blur-2xl text-white space-y-3"
            >
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-mono uppercase font-semibold tracking-wider text-zinc-300">
                    Soporte Bodega Stefy
                  </span>
                </div>
                <button
                  onClick={() => setIsConciergeOpen(false)}
                  className="p-1 rounded text-zinc-400 hover:text-white"
                >
                  <X size={14} />
                </button>
              </div>

              <h4 className="text-xs font-semibold text-zinc-100 leading-snug">
                ¿Requieres validar stock especial o emitir una proforma membretada?
              </h4>

              <p className="text-[11px] text-zinc-400 leading-relaxed bg-zinc-900/60 p-2.5 rounded-lg border border-white/[0.05]">
                Toma captura de pantalla del artículo y ten a mano el número de teléfono del cliente para coordinar con bodega.
              </p>

              <a
                href="https://wa.me/593989476556?text=Saludos%20Stefy%2C%20solicito%20informaci%C3%B3n%20de%20este%20producto%20(adjunto%20captura)"
                target="_blank"
                rel="noreferrer"
                onClick={() => setIsConciergeOpen(false)}
                className="w-full py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs transition-all flex items-center justify-center gap-2 border border-white/10"
              >
                <MessageSquare size={13} />
                <span>Contactar a Stefy</span>
              </a>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Capsule Button */}
        <button
          onClick={() => setIsConciergeOpen(!isConciergeOpen)}
          className="px-4 py-2.5 rounded-full bg-zinc-900/95 hover:bg-zinc-850 border border-white/15 text-zinc-200 hover:text-white flex items-center gap-2.5 shadow-2xl backdrop-blur-xl transition-all duration-150 active:scale-95 group cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-xs font-medium tracking-tight">Soporte Bodega</span>
          <MessageSquare size={14} className="text-zinc-400 group-hover:text-zinc-200" />
        </button>
      </div>

    </div>
  )
}
