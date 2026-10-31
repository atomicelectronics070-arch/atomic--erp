"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import {
  Shield,
  ShieldCheck,
  CheckCircle2,
  Camera,
  Eye,
  Wifi,
  Sparkles,
  ChevronDown,
  Truck,
  Moon,
  Volume2,
  HardDrive,
  Lock,
  ArrowRight,
  ChevronRight,
  X,
  Star,
  Heart,
  Baby,
  Home,
  Smartphone,
  Check,
  Users,
  BellRing,
  HelpCircle,
  Award,
  Video
} from "lucide-react"

interface CameraProduct {
  id: string
  code: string
  model: string
  name: string
  brand: "IMOU" | "EZVIZ" | "ATOMIC"
  tagline: string
  badge: string
  badgeColor: string
  price: number
  hasFreeShipping?: boolean
  image: string
  description: string
  highlightFeature: string
  features: string[]
  specs: { label: string; value: string }[]
  spacesBestFor: string[]
}

const CAMERAS_HOGAR: CameraProduct[] = [
  {
    id: "imou-ranger-3mp-10899",
    code: "10899",
    model: "IPC-K2EN-3H3W",
    name: "Cámara IMOU Ranger 360° 3MP",
    brand: "IMOU",
    tagline: "La opción más económica, confiable y querida por familias",
    badge: "💡 La Más Accesible",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    price: 35.80,
    hasFreeShipping: false,
    image: "/images/camaras/camara-imou-ranger-3mp-10899.jpg",
    description: "Cámara inteligente compacta con rotación 360° y resolución 3MP ultra nítida. Cuenta con detección humana por inteligencia artificial para evitar falsas alarmas, audio bidireccional y modo privado que oculta la lente cuando estás en casa.",
    highlightFeature: "Detección Humana IA + Modo Privacidad que cubre la lente",
    features: [
      "Resolución 3MP HD (2304 x 1296) de alta nitidez",
      "Giro motorizado 360° horizontal e inclinación vertical",
      "Detección humana inteligente (diferencia personas de sombras o cortinas)",
      "Audio bidireccional: habla y escucha a tus hijos en tiempo real",
      "Modo Privacidad: esconde físicamente la lente desde la app",
      "Visión nocturna infrarroja con alcance de 10 metros",
      "Ranura para memoria MicroSD de hasta 256GB (sin cuotas mensuales)",
      "App móvil gratuita en español para iPhone y Android"
    ],
    specs: [
      { label: "Código de Producto", value: "10899" },
      { label: "Modelo Oficial", value: "IPC-K2EN-3H3W" },
      { label: "Resolución", value: "3 Megapíxeles (3MP 2K)" },
      { label: "Campo de Visión", value: "Panorámica 360° Pan-Tilt" },
      { label: "Visión Nocturna", value: "Infrarrojo IR 10m inteligente" },
      { label: "Audio", value: "Micrófono y altavoz integrados (2 vías)" },
      { label: "Conectividad", value: "Wi-Fi 2.4GHz + Puerto de red" },
      { label: "Almacenamiento", value: "MicroSD hasta 256GB o Nube opcional" },
      { label: "Garantía", value: "1 Año de Garantía Directa ATOMIC" }
    ],
    spacesBestFor: ["Dormitorio de niños", "Cuna del bebé", "Sala de estar", "Oficina en casa"]
  },
  {
    id: "imou-mini-pt-fullcolor-13067",
    code: "13067",
    model: "IPC-K2MN-3R1WE",
    name: "Cámara IMOU Mini PT Ranger 360° 3MP Full Color",
    brand: "IMOU",
    tagline: "¡Nuevo lanzamiento! Vigilancia nocturna a todo color con sirena disuasiva",
    badge: "🌟 ¡NUEVA! Visión a Todo Color",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    price: 39.10,
    hasFreeShipping: false,
    image: "/images/camaras/camara-imou-mini-pt-fullcolor-13067.jpg",
    description: "Tecnología de última generación con visión nocturna a todo color incluso en completa oscuridad. Integra una sirena activa para ahuyentar visitantes no deseados y detección humana precisa para mantener tu hogar siempre protegido.",
    highlightFeature: "Full Color Nocturno + Sirena Activa de Advertencia Integrada",
    features: [
      "Visión nocturna a TODO COLOR gracias a sus focos de luz cálida",
      "Resolución 3MP cristalina y cobertura panorámica 360° Pan-Tilt",
      "Disuasión activa: sirena incorporada para alertas inmediatas",
      "Detección humana por IA que envía avisos directos a tu celular",
      "Modo de Privacidad: oculta la lente para total confidencialidad",
      "Audio bidireccional claro de alta fidelidad",
      "Soporte para memoria MicroSD de hasta 256GB",
      "Conectividad Wi-Fi de largo alcance y gran estabilidad"
    ],
    specs: [
      { label: "Código de Producto", value: "13067" },
      { label: "Modelo Oficial", value: "IPC-K2MN-3R1WE" },
      { label: "Resolución", value: "3 Megapíxeles (3MP Alta Definición)" },
      { label: "Modo Nocturno", value: "Full Color (Luz blanca) + Infrarrojo IR 10m" },
      { label: "Alarma", value: "Sirena disuasiva programable" },
      { label: "Inteligencia Artificial", value: "Detección precisa de siluetas humanas" },
      { label: "Audio", value: "Bidireccional con cancelación de ruido" },
      { label: "Almacenamiento", value: "MicroSD hasta 256GB" },
      { label: "Garantía", value: "1 Año de Garantía Directa ATOMIC" }
    ],
    spacesBestFor: ["Entrada principal", "Sala amplia", "Cocina y patio cubierto", "Negocio familiar"]
  },
  {
    id: "camara-doble-lente-360-interior",
    code: "21045",
    model: "DUAL-LENS-360-SMART",
    name: "Cámara Robótica Inteligente Doble Lente 360°",
    brand: "ATOMIC",
    tagline: "Doble protección: un lente fijo a la puerta y un lente giratorio 360°",
    badge: "🛡️ Doble Cámara Sin Puntos Ciegos",
    badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/40",
    price: 42.50,
    hasFreeShipping: false,
    image: "/images/camaras/camara-doble-lente-360-interior.jpg",
    description: "La innovación perfecta para el hogar: dos cámaras en un solo cuerpo. El lente inferior vigila de forma fija un acceso crítico (como la puerta o la cuna), mientras el lente superior gira 360° siguiendo automáticamente el movimiento.",
    highlightFeature: "Dos lentes simultáneos en tu pantalla: Vista Panorámica + Vista Focal",
    features: [
      "Doble Lente: 2 cámaras transmitiendo al mismo tiempo en tu celular",
      "Cobertura panorámica 360° sin ningún punto ciego",
      "Monitoreo en tiempo real con pantalla dividida en la aplicación",
      "Visión nocturna automática de alta definición",
      "Detección de movimiento inteligente con seguimiento continuo",
      "Audio bidireccional para comunicarte desde donde estés",
      "Conexión Wi-Fi rápida y fácil de configurar en 2 minutos",
      "Soporte para MicroSD y respaldo en la nube"
    ],
    specs: [
      { label: "Código de Producto", value: "21045" },
      { label: "Configuración", value: "Doble Cámara (Lente Fijo + Lente PTZ 360°)" },
      { label: "Resolución", value: "HD Dual Stream simultáneo" },
      { label: "Monitoreo", value: "Pantalla dividida dual en la app" },
      { label: "Visión Nocturna", value: "Infrarroja automática de alto alcance" },
      { label: "Seguimiento", value: "Auto-tracking inteligente de personas" },
      { label: "Audio", value: "Intercomunicador bidireccional integrado" },
      { label: "Garantía", value: "1 Año de Garantía Directa ATOMIC" }
    ],
    spacesBestFor: ["Sala y comedor juntos", "Cuarto de juegos", "Pasillos largos", "Local u oficina"]
  },
  {
    id: "ezviz-h6c-3mp-pauta",
    code: "H6C-3MP",
    model: "CS-H6C-R100-1K3WKFL",
    name: "Cámara Wi-Fi EZVIZ H6C 3MP Panorámica 360°",
    brand: "EZVIZ",
    tagline: "Líder mundial en seguridad residencial con ¡Envío Gratis a todo el país!",
    badge: "🚚 ¡ENVÍO GRATIS NACIONAL!",
    badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
    price: 43.99,
    hasFreeShipping: true,
    image: "/images/camaras/camara-ezviz-h6c-3mp-pauta.jpg",
    description: "La cámara de seguridad para el hogar más vendida y recomendada. Calidad 3MP con seguimiento de movimiento inteligente, visión nocturna infrarroja uniforme de 10 metros y modo suspensión para total intimidad familiar.",
    highlightFeature: "Seguimiento Automático Inteligente + ¡Envío Gratis a Todo el Ecuador!",
    features: [
      "¡Envío Gratis a cualquier rincón del Ecuador!",
      "Resolución 3MP Alta Definición para ver rostros y detalles nítidos",
      "Visión panorámica motorizada de 360° sin ángulos muertos",
      "Seguimiento automático: gira solita cuando tus niños o mascotas se mueven",
      "Comunicación bidireccional fluida en tiempo real",
      "Modo suspensión de privacidad con un solo toque en la app",
      "Visión nocturna infrarroja inteligente que no encandila",
      "Compatible con MicroSD de hasta 512GB para semanas de grabación"
    ],
    specs: [
      { label: "Código de Producto", value: "H6C-3MP" },
      { label: "Marca Oficial", value: "EZVIZ (Líder en Smart Home)" },
      { label: "Resolución", value: "3 Megapíxeles (2K Nítido)" },
      { label: "Seguimiento", value: "Auto-tracking motorizado 360°" },
      { label: "Modo Privacidad", value: "Modo suspensión activo desde celular" },
      { label: "Visión Nocturna", value: "Smart IR hasta 10m sin sombras" },
      { label: "Beneficio Especial", value: "¡Envío Gratis Incluido a Nivel Nacional!" },
      { label: "Garantía", value: "1 Año de Garantía Oficial ATOMIC" }
    ],
    spacesBestFor: ["Dormitorio principal", "Sala familiar", "Cuidado de adultos mayores", "Bebés"]
  }
]

const INTERIOR_SPACES = [
  {
    id: "bebe",
    icon: Baby,
    title: "Habitación del Bebé / Cuna",
    subtitle: "Paz mental total mientras duerme",
    badge: "🍼 Mamá Tranquila",
    description: "Vigila el sueño de tu pequeño sin tener que levantarte cada 5 minutos. Gracias a su visión nocturna invisible, no emite luces rojas que lo despierten. Si llora o balbucea, recibes una alerta y puedes hablarle con voz dulce desde tu teléfono para arrullarlo.",
    benefits: [
      "Visión nocturna invisible (sin luces molestas que lo despierten)",
      "Micrófono sensible que detecta el llanto del bebé al instante",
      "Habla con tu voz desde la cama o el trabajo para calmarlo",
      "Monitorea la temperatura y calma del cuarto"
    ],
    recommendedCam: "IMOU Ranger 360° 3MP ($35.80)"
  },
  {
    id: "sala",
    icon: Home,
    title: "Sala de Estar y Zona de Tareas",
    subtitle: "Mira a tus hijos jugar y estudiar",
    badge: "🛋️ Espacio Familiar",
    description: "¿Estás cocinando o en el trabajo y quieres saber si tus hijos llegaron bien de la escuela y están haciendo los deberes? La cámara cubre toda la sala en 360° y gira automáticamente siguiéndolos por la habitación sin puntos ciegos.",
    benefits: [
      "Rotación panorámica 360° que cubre toda la sala sin esquinas ciegas",
      "Seguimiento automático de movimiento de los pequeños",
      "Pregúntales cómo les fue en la escuela con el altavoz en vivo",
      "Monitorea que no hagan travesuras peligrosas"
    ],
    recommendedCam: "EZVIZ H6C 3MP con Auto-Tracking ($43.99)"
  },
  {
    id: "mascotas",
    icon: Heart,
    title: "Cuidado de Mascotas",
    subtitle: "¿Qué hace tu perrito o gatito cuando sales?",
    badge: "🐾 Amor de 4 Patas",
    description: "Se acabó la preocupación de dejar a tu peludo solo en casa. Abre la app en cualquier momento, mira qué está haciendo en vivo y llámalo por su nombre para que sienta tu compañía y evite morder muebles o ladrar por ansiedad.",
    benefits: [
      "Llama a tu mascota por el altavoz para que sienta tu voz cerca",
      "Mira si ya comió su alimento o si está descansando",
      "Detección de movimiento que te avisa si salta al sofá",
      "Captura fotos y videos tiernos directamente a tu celular"
    ],
    recommendedCam: "IMOU Ranger 360° 3MP ($35.80)"
  },
  {
    id: "entrada",
    icon: Shield,
    title: "Entrada Principal y Cocina",
    subtitle: "Protección activa ante cualquier visita",
    badge: "🚪 Entrada Segura",
    description: "Ten el control absoluto de quién entra y sale de casa. La cámara cuenta con detección de personas con Inteligencia Artificial que solo te alerta cuando realmente hay alguien en la puerta, ignorando el viento o el paso de mascotas.",
    benefits: [
      "Alertas inmediatas en tu celular si alguien llega a la puerta",
      "Visión nocturna Full Color que muestra rostros y ropa a colores",
      "Sirena integrada disuasiva para ahuyentar extraños",
      "Doble cámara disponible para vigilar puerta y pasillo a la vez"
    ],
    recommendedCam: "IMOU Mini PT Full Color ($39.10) o Doble Lente ($42.50)"
  },
  {
    id: "privacidad",
    icon: Lock,
    title: "Modo Privacidad 100% Seguro",
    subtitle: "Total intimidad cuando la familia está reunida",
    badge: "🔒 Privacidad Total",
    description: "Sabemos que tu privacidad es sagrada. Cuando toda la familia esté reunida en casa, con solo tocar un botón en tu celular la lente de la cámara se ocultará físicamente dentro de su propia carcasa, apagando la transmisión hasta que decidas reactivarla.",
    benefits: [
      "Obturador físico que cubre la lente por completo",
      "Cero transmisión mientras estés compartiendo en familia",
      "Se activa o desactiva con un solo toque desde la app",
      "Transmisión encriptada de grado bancario para tu tranquilidad"
    ],
    recommendedCam: "Incluido en todos los modelos (IMOU y EZVIZ)"
  }
]

const TESTIMONIOS_MAMAS = [
  {
    nombre: "Andrea Morales",
    ciudad: "Quito (Valle de los Chillos)",
    rol: "Mamá de Mateo (8 meses)",
    texto: "La compré para la cuna de mi bebé y me cambió la vida. Puedo cocinar o trabajar en la computadora y sé exactamente si se mueve o si despertó. La voz bidireccional es maravillosa, le hablo y se calma enseguida.",
    estrellas: 5,
    foto: "👩‍🍼"
  },
  {
    nombre: "Patricia Salazar",
    ciudad: "Guayaquil (Samborondón)",
    rol: "Ama de casa y madre de 2 niños",
    texto: "Compré la cámara doble lente y es espectacular. Un lente se queda apuntando a la puerta y el otro gira por toda la sala viendo a mis hijos hacer tareas. Super fácil de instalar, solo la enchufé a la pared y listo.",
    estrellas: 5,
    foto: "👩‍👧‍👦"
  },
  {
    nombre: "Carmen Luzuriaga",
    ciudad: "Cuenca",
    rol: "Cuidadora de adultos mayores",
    texto: "La instalé en el cuarto de mi mamá que tiene 78 años. Desde mi trabajo puedo ver cómo está y recordarle sus pastillas por el parlante de la cámara. Me da una paz mental que no tiene precio.",
    estrellas: 5,
    foto: "👵"
  }
]

const FAQS_DATA = [
  {
    q: "¿Necesito romper paredes o contratar un técnico para instalarla?",
    a: "¡Para nada! Todas nuestras cámaras de hogar son 100% 'Plug & Play'. Vienen con su cable y cargador; solo la colocas sobre una mesa, repisa o velador, la enchufas a la corriente y la sincronizas con la app en tu teléfono en 2 minutos. Si deseas anclarla a la pared o techo, incluye su soporte y tornillos listos."
  },
  {
    q: "¿Puedo ver la cámara si salgo a trabajar, de compras o de viaje?",
    a: "Sí, totalmente. Siempre que la cámara esté conectada al Wi-Fi de tu casa, tú puedes ver y escuchar en vivo desde tu celular en cualquier lugar del mundo usando tu plan de datos 4G/5G o cualquier otra red Wi-Fi."
  },
  {
    q: "¿Tengo que pagar alguna mensualidad para usar la cámara?",
    a: "¡No pagas ninguna mensualidad! La aplicación móvil es 100% gratuita de por vida. Ver en vivo, escuchar, hablar por el micrófono y recibir alertas no tiene ningún costo recurrente. Solo adquieres una tarjeta de memoria MicroSD (opcional) para guardar semanas de grabaciones."
  },
  {
    q: "¿Puede ver la cámara mi esposo y mis familiares también?",
    a: "Sí. Puedes compartir el acceso de forma segura con hasta 5 familiares para que cada uno pueda ver la cámara desde su propio celular al mismo tiempo."
  },
  {
    q: "¿Cómo son los envíos y formas de pago?",
    a: "Hacemos envíos rápidos y seguros a todo el Ecuador. Puedes pagar mediante transferencia bancaria, tarjeta de crédito o consultar por pago contraentrega en las principales ciudades. La EZVIZ H6C además incluye Envío Gratis a nivel nacional."
  }
]

export default function CamarasHogarClient() {
  const [selectedCam, setSelectedCam] = useState<CameraProduct>(CAMERAS_HOGAR[0])
  const [activeSpaceTab, setActiveSpaceTab] = useState<number>(0)
  const [detailModalOpen, setDetailModalOpen] = useState<boolean>(false)
  const [includeMicroSd, setIncludeMicroSd] = useState<boolean>(false)
  const [selectedSdSize, setSelectedSdSize] = useState<"64GB" | "128GB">("64GB")
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)

  // Cálculo de precio con tarjeta MicroSD opcional
  const sdPrice = includeMicroSd ? (selectedSdSize === "64GB" ? 11.50 : 18.00) : 0
  const totalPrice = (selectedCam.price + sdPrice).toFixed(2)

  // Enlace de WhatsApp pre-rellenado para compra directa
  const whatsappUrl = useMemo(() => {
    let msg = `Hola Atomic, vengo de la página de Cámaras para Hogar. Me interesa cotizar y pedir la *${selectedCam.name}* ($${selectedCam.price.toFixed(2)} + IVA, Cód: ${selectedCam.code}).`
    if (includeMicroSd) {
      msg += ` Deseo incluir memoria MicroSD de ${selectedSdSize} ($${sdPrice.toFixed(2)}). Total: $${totalPrice} + IVA.`
    }
    msg += ` Por favor indíquenme tiempos de entrega y formas de pago.`
    return `https://wa.me/593969043453?text=${encodeURIComponent(msg)}`
  }, [selectedCam, includeMicroSd, selectedSdSize, sdPrice, totalPrice])

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 font-sans selection:bg-rose-500/30 selection:text-white">
      {/* Top Banner Rosado Cálido / Oro */}
      <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-amber-950 border-b border-rose-500/30 py-2 px-4 text-center text-xs font-semibold text-rose-200 flex items-center justify-center gap-2">
        <Sparkles size={14} className="text-amber-400 shrink-0" />
        <span>🌸 Especial Seguridad para el Hogar: Tranquilidad para Mamás y Familias · Envíos a todo el Ecuador</span>
      </div>

      {/* Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#070b12]/90 backdrop-blur-md border-b border-slate-800/80 px-4 md:px-8 py-3.5 flex items-center justify-between">
        <Link href="/web" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white font-black text-base shadow-lg shadow-rose-900/40">
            ⚛
          </div>
          <div>
            <span className="font-black text-sm tracking-wide text-white uppercase block leading-none">
              ATOMIC <span className="text-rose-400">HOGAR</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium">Cámaras Inteligentes para la Familia</span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-md shadow-emerald-950 flex items-center gap-1.5 cursor-pointer"
          >
            <Smartphone size={14} />
            <span className="hidden sm:inline">Asesoría Inmediata WhatsApp</span>
            <span className="sm:hidden">WhatsApp</span>
          </a>
        </div>
      </header>

      {/* Hero Section Cálida y Empática */}
      <section className="relative overflow-hidden pt-8 pb-16 px-4 md:px-8 max-w-6xl mx-auto">
        {/* Glow de fondo suave */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-rose-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-bold uppercase tracking-wider">
            <Heart size={13} className="text-rose-400" />
            <span>Tranquilidad, Amor y Protección en tu Hogar</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            La paz de saber que tus hijos, tu bebé y tu hogar <span className="bg-gradient-to-r from-rose-400 via-amber-300 to-pink-400 bg-clip-text text-transparent">están bien</span>, estés donde estés.
          </h1>

          <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Cámaras de seguridad inteligentes 100% Wi-Fi diseñadas para el interior de tu casa. Monitorea en vivo desde tu celular, habla y escucha con tu voz, y recibe alertas instantáneas sin romper paredes ni pagar mensualidades.
          </p>

          {/* Badges de Confianza */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
            <span className="bg-slate-900/90 border border-slate-700/70 text-slate-200 text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-medium">
              <CheckCircle2 size={13} className="text-emerald-400" /> Fácil en 2 min (Plug & Play)
            </span>
            <span className="bg-slate-900/90 border border-slate-700/70 text-slate-200 text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-medium">
              <Volume2 size={13} className="text-rose-400" /> Audio Bidireccional (Habla y Escucha)
            </span>
            <span className="bg-slate-900/90 border border-slate-700/70 text-slate-200 text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-medium">
              <Moon size={13} className="text-indigo-400" /> Visión Nocturna que no despierta al bebé
            </span>
            <span className="bg-slate-900/90 border border-slate-700/70 text-slate-200 text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-medium">
              <Lock size={13} className="text-amber-400" /> Modo Privacidad con 1 toque
            </span>
          </div>

          {/* Botones de Acción Hero */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <a
              href="#catalogo-camaras"
              className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-extrabold text-sm px-6 py-3 rounded-xl transition-all shadow-lg shadow-rose-950 flex items-center gap-2 cursor-pointer"
            >
              <Eye size={16} /> Ver las 4 Cámaras Oficiales
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#1a2332] hover:bg-[#233044] border border-cyan-500/50 text-cyan-300 hover:text-white font-bold text-sm px-6 py-3 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <Smartphone size={16} className="text-emerald-400" /> Preguntar por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* SECCIÓN INTERACTIVA: OPCIONES INTERIORES DEL HOGAR */}
      <section className="py-12 px-4 md:px-8 max-w-6xl mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block">
            CUIDADO Y PROTECCIÓN INTEGRAL
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Un Ojo Amoroso en Cada Espacio de tu Casa
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Descubre cómo nuestras cámaras resuelven cada necesidad del día a día para mamás y amas de casa.
          </p>
        </div>

        {/* Tabs de Espacios */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
          {INTERIOR_SPACES.map((space, idx) => {
            const IconComponent = space.icon
            const isActive = activeSpaceTab === idx
            return (
              <button
                key={space.id}
                onClick={() => setActiveSpaceTab(idx)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 border cursor-pointer ${
                  isActive
                    ? 'bg-rose-950/80 text-rose-200 border-rose-500/80 shadow-md shadow-rose-950/50'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <IconComponent size={15} className={isActive ? 'text-rose-400' : 'text-slate-400'} />
                <span>{space.title.split(' ')[0]} {space.title.split(' ')[1] || ''}</span>
              </button>
            )
          })}
        </div>

        {/* Card Detalle del Espacio Activo */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSpaceTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-gradient-to-br from-slate-900/90 to-[#0e1624] border border-slate-800 rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto shadow-xl"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-950/80 text-rose-300 border border-rose-600/40">
                    {INTERIOR_SPACES[activeSpaceTab].badge}
                  </span>
                  <span className="text-xs text-amber-300 font-mono font-medium">
                    Recomendación: {INTERIOR_SPACES[activeSpaceTab].recommendedCam}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {INTERIOR_SPACES[activeSpaceTab].title}
                </h3>

                <p className="text-sm text-slate-300 leading-relaxed">
                  {INTERIOR_SPACES[activeSpaceTab].description}
                </p>

                <div className="space-y-2 pt-2">
                  {INTERIOR_SPACES[activeSpaceTab].benefits.map((b, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-200">
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="shrink-0 flex flex-col items-center justify-center p-6 bg-slate-950/70 border border-slate-800/80 rounded-2xl md:w-64 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-rose-950/80 border border-rose-500/40 flex items-center justify-center text-rose-300">
                  {(() => {
                    const CurIcon = INTERIOR_SPACES[activeSpaceTab].icon
                    return <CurIcon size={32} />
                  })()}
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Instalación recomendada</span>
                  <p className="text-xs font-bold text-white mt-0.5">{INTERIOR_SPACES[activeSpaceTab].subtitle}</p>
                </div>
                <a
                  href="#catalogo-camaras"
                  className="w-full text-center text-xs font-bold py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white transition-colors"
                >
                  Elegir esta cámara
                </a>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* CATÁLOGO OFICIAL DE LAS 4 CÁMARAS PARA HOGAR */}
      <section id="catalogo-camaras" className="py-12 px-4 md:px-8 max-w-6xl mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block">
            MODELOS 100% ORIGINALES CON GARANTÍA
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Nuestras 4 Cámaras Oficiales para Interiores
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Elige la que mejor se adapte a tu hogar o consulta con nosotros para asesorarte según el tamaño de tu casa.
          </p>
        </div>

        {/* Grid de 4 Cámaras */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CAMERAS_HOGAR.map((cam) => {
            const isSelected = selectedCam.id === cam.id
            return (
              <div
                key={cam.id}
                className={`bg-gradient-to-b from-slate-900/90 to-[#0c121e] border rounded-2xl p-5 sm:p-6 transition-all flex flex-col justify-between relative shadow-lg ${
                  isSelected ? 'border-rose-500 shadow-rose-950/40 ring-1 ring-rose-500/50' : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  {/* Badge Superior */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${cam.badgeColor}`}>
                      {cam.badge}
                    </span>
                    <span className="text-xs font-mono text-slate-400 font-bold">
                      CÓD: {cam.code}
                    </span>
                  </div>

                  {/* Imagen Oficial del Flyer */}
                  <div
                    onClick={() => {
                      setSelectedCam(cam)
                      setDetailModalOpen(true)
                    }}
                    className="relative w-full h-56 sm:h-64 rounded-xl overflow-hidden bg-slate-950/80 border border-slate-800/80 mb-4 cursor-pointer group"
                  >
                    <Image
                      src={cam.image}
                      alt={cam.name}
                      fill
                      className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white font-bold text-xs">
                      <Eye size={16} /> Click para ampliar y ver ficha técnica
                    </div>
                  </div>

                  {/* Título y Marca */}
                  <div className="mb-2">
                    <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider">
                      {cam.brand} OFICIAL
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-white leading-snug">
                      {cam.name}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1">
                      {cam.tagline}
                    </p>
                  </div>

                  {/* Característica Estrella */}
                  <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 mb-3 text-xs text-amber-300 font-medium flex items-center gap-2">
                    <Sparkles size={14} className="text-amber-400 shrink-0" />
                    <span>{cam.highlightFeature}</span>
                  </div>

                  {/* Lista de Características Rápidas */}
                  <div className="space-y-1.5 mb-4">
                    {cam.features.slice(0, 4).map((f, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-xs text-slate-300">
                        <Check size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer de la Card: Precio y Botón de Selección */}
                <div className="border-t border-slate-800/80 pt-4 mt-2">
                  <div className="flex items-baseline justify-between mb-3">
                    <div>
                      <span className="text-[10px] text-slate-400 font-mono uppercase block">Precio Oficial</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                          ${cam.price.toFixed(2)}
                        </span>
                        <span className="text-xs font-bold text-slate-400 font-mono">+ IVA</span>
                      </div>
                    </div>
                    {cam.hasFreeShipping && (
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-600/50">
                        Envío Gratis
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setSelectedCam(cam)
                        setDetailModalOpen(true)
                      }}
                      className="w-full text-xs font-bold py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
                    >
                      Ver Detalles
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCam(cam)
                        const el = document.getElementById('personalizar-pedido')
                        if (el) el.scrollIntoView({ behavior: 'smooth' })
                      }}
                      className="w-full text-xs font-bold py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-md shadow-rose-950"
                    >
                      <span>Seleccionar</span> <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* SECCIÓN INTERACTIVA: PERSONALIZA TU PEDIDO Y PIDE POR WHATSAPP */}
      <section id="personalizar-pedido" className="py-12 px-4 md:px-8 max-w-4xl mx-auto border-t border-slate-800/80">
        <div className="bg-gradient-to-br from-slate-900 to-[#121c2d] border border-rose-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-rose-300">
                Paso Final: Personaliza tu Compra
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Cámara Seleccionada: <span className="text-rose-400">{selectedCam.name}</span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Puedes agregar una tarjeta de memoria MicroSD para guardar semanas de grabaciones sin cuotas mensuales. Te la entregamos configurada lista para usar.
            </p>

            {/* Selector de Memoria MicroSD Opcional */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
              <label className="flex items-start sm:items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeMicroSd}
                  onChange={(e) => setIncludeMicroSd(e.target.checked)}
                  className="w-5 h-5 rounded border-slate-700 text-rose-600 focus:ring-rose-500 cursor-pointer mt-0.5 sm:mt-0"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-white">Incluir Tarjeta MicroSD Original de Alta Velocidad</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-600/40">
                      Recomendado
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Guarda grabaciones de seguridad las 24 horas y revísalas en cualquier momento desde tu teléfono sin pagar suscripción.
                  </p>
                </div>
              </label>

              {includeMicroSd && (
                <div className="pt-2 border-t border-slate-800/80 flex items-center gap-3">
                  <button
                    onClick={() => setSelectedSdSize("64GB")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      selectedSdSize === "64GB"
                        ? "bg-rose-950 border-rose-500 text-white"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    64GB (Hasta 2 semanas) · +$11.50
                  </button>
                  <button
                    onClick={() => setSelectedSdSize("128GB")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      selectedSdSize === "128GB"
                        ? "bg-rose-950 border-rose-500 text-white"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    128GB (Hasta 4 semanas) · +$18.00
                  </button>
                </div>
              )}
            </div>

            {/* Resumen Total y Botón de WhatsApp */}
            <div className="bg-slate-950/90 border border-slate-800/90 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-400 block">Total a Cotizar</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-black text-emerald-400 font-mono">
                    ${totalPrice}
                  </span>
                  <span className="text-xs font-bold text-slate-400 font-mono">+ IVA</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {selectedCam.hasFreeShipping ? '🚚 Incluye Envío Gratis a nivel nacional' : '📦 Envíos rápidos y seguros a todo el Ecuador'}
                </p>
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm px-6 py-3.5 rounded-2xl transition-all shadow-xl shadow-emerald-950 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Smartphone size={18} />
                <span>Pedir por WhatsApp Ahora</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FACILIDAD TOTAL: INSTALACIÓN EN 3 PASOS */}
      <section className="py-12 px-4 md:px-8 max-w-6xl mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-xl mx-auto mb-8 space-y-1">
          <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block">CERO COMPLICACIONES</span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">Fácil de Usar en 3 Simples Pasos</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-rose-950 border border-rose-500/40 text-rose-300 font-black flex items-center justify-center">
              1
            </div>
            <h3 className="font-bold text-sm text-white">Enchúfala a la pared</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Conecta la cámara al tomacorriente con su adaptador incluido. No requiere cables de red ni obras complicadas.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-500/40 text-amber-300 font-black flex items-center justify-center">
              2
            </div>
            <h3 className="font-bold text-sm text-white">Abre la App en tu Celular</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Descarga la aplicación gratuita (EZVIZ o IMOU Life en español) disponible para iPhone y teléfonos Android.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-black flex items-center justify-center">
              3
            </div>
            <h3 className="font-bold text-sm text-white">¡Listo! Mira tu hogar en vivo</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Escanea el código QR de la cámara y en menos de 2 minutos ya estás monitoreando y hablando en tiempo real.
            </p>
          </div>
        </div>
      </section>

      {/* TESTIMONIOS DE MAMÁS Y CLIENTES */}
      <section className="py-12 px-4 md:px-8 max-w-6xl mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-xl mx-auto mb-8 space-y-1">
          <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block">EXPERIENCIAS REALES</span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">Mamás y Familias Felices en Ecuador</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIOS_MAMAS.map((t, i) => (
            <div key={i} className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-1 text-amber-400 text-sm">
                  {[...Array(t.estrellas)].map((_, idx) => (
                    <Star key={idx} size={14} fill="currentColor" />
                  ))}
                </div>
                <p className="text-xs text-slate-300 italic leading-relaxed">
                  "{t.texto}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-800">
                <span className="text-2xl">{t.foto}</span>
                <div>
                  <h4 className="text-xs font-bold text-white">{t.nombre}</h4>
                  <p className="text-[10px] text-slate-400">{t.rol} · {t.ciudad}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PREGUNTAS FRECUENTES (FAQ) */}
      <section className="py-12 px-4 md:px-8 max-w-3xl mx-auto border-t border-slate-800/80">
        <div className="text-center mb-8 space-y-1">
          <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block">RESUELVE TUS DUDAS</span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">Preguntas Frecuentes</h2>
        </div>

        <div className="space-y-3">
          {FAQS_DATA.map((faq, idx) => {
            const isOpen = openFaqIndex === idx
            return (
              <div key={idx} className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 text-left font-bold text-xs sm:text-sm text-white flex items-center justify-between gap-3 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown size={16} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800/80 py-8 px-4 text-center text-xs text-slate-500 space-y-2">
        <p className="font-bold text-slate-400">ATOMIC Ecuador · Seguridad Inteligente para el Hogar</p>
        <p>© {new Date().getFullYear()} ATOMIC. Distribuidores Autorizados de IMOU y EZVIZ en Ecuador. Todos los derechos reservados.</p>
        <div className="flex items-center justify-center gap-4 pt-2 text-[11px] text-slate-400">
          <Link href="/web" className="hover:text-rose-400 transition-colors">Inicio</Link>
          <Link href="/web/cercos-electricos" className="hover:text-rose-400 transition-colors">Cercos Eléctricos</Link>
          <Link href="/web/videoporteros" className="hover:text-rose-400 transition-colors">Videoporteros</Link>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">WhatsApp Soporte</a>
        </div>
      </footer>

      {/* MODAL DETALLES DE CÁMARA */}
      <AnimatePresence>
        {detailModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0e1624] border border-slate-700/80 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative"
            >
              <button
                onClick={() => setDetailModalOpen(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>

              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${selectedCam.badgeColor}`}>
                  {selectedCam.badge}
                </span>
                <span className="text-xs font-mono text-slate-400 font-bold">
                  CÓDIGO: {selectedCam.code}
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-black text-white">{selectedCam.name}</h3>
                <p className="text-xs text-rose-300 mt-1">{selectedCam.tagline}</p>
              </div>

              {/* Imagen Grande */}
              <div className="relative w-full h-72 sm:h-80 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
                <Image
                  src={selectedCam.image}
                  alt={selectedCam.name}
                  fill
                  className="object-contain p-2"
                />
              </div>

              {/* Descripción */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {selectedCam.description}
              </p>

              {/* Ficha Técnica */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Ficha Técnica Oficial</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedCam.specs.map((s, idx) => (
                    <div key={idx} className="bg-slate-950/70 border border-slate-800/80 p-2.5 rounded-xl">
                      <span className="text-[10px] text-slate-400 font-mono block">{s.label}</span>
                      <span className="text-xs font-bold text-white">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Modal */}
              <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-400 font-mono uppercase block">Precio</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-white font-mono">${selectedCam.price.toFixed(2)}</span>
                    <span className="text-xs text-slate-400 font-mono">+ IVA</span>
                  </div>
                </div>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl transition-all shadow-lg shadow-emerald-950 flex items-center gap-1.5 cursor-pointer"
                >
                  <Smartphone size={16} />
                  <span>Pedir esta Cámara</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
