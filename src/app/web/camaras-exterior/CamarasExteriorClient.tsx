"use client"

import { useState } from "react"
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
  Star,
  Home,
  Smartphone,
  Check,
  Users,
  BellRing,
  HelpCircle,
  Award,
  Video,
  CloudRain,
  Sun,
  Flame,
  Wrench,
  Radio
} from "lucide-react"

interface CameraProduct {
  id: string
  code: string
  name: string
  brand: "IMOU" | "ATOMIC" | "PRO"
  tagline: string
  badge: string
  badgeColor: string
  price: number
  priceWithInstall?: number
  priceNotes?: string
  image: string
  description: string
  highlightFeature: string
  features: string[]
  specs: { label: string; value: string }[]
  spacesBestFor: string[]
}

const CAMERAS_EXTERIOR: CameraProduct[] = [
  {
    id: "camara-exterior-ip66-wifi",
    code: "IP66-WIFI",
    name: "Cámara Exterior Inteligente Wi-Fi IP66",
    brand: "ATOMIC",
    tagline: "Protección resistente al clima con visión nocturna y audio en vivo",
    badge: "🔥 Super Oferta",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    price: 47.82,
    priceWithInstall: 20.99,
    priceNotes: "Equipo $47.82 | Instalación profesional disponible por $20.99 adicionales",
    image: "/images/camaras-exterior/camara-exterior-ip66-wifi.jpg",
    description: "Cámara para exteriores con certificación IP66 resistente a lluvias torrenciales y sol extremo. Cuenta con visión nocturna automática, audio bidireccional y detección de movimiento en tu smartphone.",
    highlightFeature: "Protección IP66 contra intemperie + Notificaciones de alerta en tiempo real",
    features: [
      "Certificación IP66 totalmente hermética contra lluvias y polvo",
      "Visión nocturna automática de largo alcance (hasta 25 metros)",
      "Audio de dos vías: habla y escucha a través de la app móvil",
      "Detección inteligente de movimiento humano con notificaciones push",
      "Conexión Wi-Fi inalámbrica estable con antena reforzada",
      "Ranura para memoria MicroSD de hasta 128GB para grabaciones continuas",
      "App móvil gratuita sin pagos mensuales para iOS y Android",
      "Soporte de montaje articulado para pared o techo"
    ],
    specs: [
      { label: "Certificación Climática", value: "IP66 impermeable y antipolvo" },
      { label: "Visión Nocturna", value: "Infrarrojo IR inteligente 25m" },
      { label: "Conectividad", value: "Wi-Fi 2.4GHz de alta ganancia" },
      { label: "Audio", value: "Bidireccional (Micrófono y Altavoz)" },
      { label: "Almacenamiento", value: "MicroSD hasta 128GB / Nube" },
      { label: "Instalación", value: "Autoinstalable o técnica por $20.99" },
      { label: "Garantía", value: "3 AÑOS Garantía Oficial ATOMIC" }
    ],
    spacesBestFor: ["Entrada principal", "Patio posterior", "Parqueadero", "Fachada de negocio"]
  },
  {
    id: "camara-doble-lente-ip81-exterior",
    code: "IP81-DL",
    name: "Cámara Doble Lente Exterior IP81 con Pan-Tilt 360°",
    brand: "PRO",
    tagline: "Vigila dos ángulos a la vez: un lente fijo perimetral + un lente giratorio 360°",
    badge: "⭐ Doble Cobertura",
    badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
    price: 63.77,
    priceWithInstall: 20.99,
    priceNotes: "Lleva 3 unidades por $63.77 c/u | Instalación disponible por $20.99",
    image: "/images/camaras-exterior/camara-doble-lente-ip81-exterior.jpg",
    description: "La tecnología más demandada en exteriores: incorpora dos cámaras en un solo cuerpo. El lente superior vigila fijamente el portón mientras el lente inferior gira 360° siguiendo automáticamente a sospechosos.",
    highlightFeature: "2 Cámaras en 1: Cero puntos ciegos con seguimiento inteligente",
    features: [
      "Sistema de Doble Lente Simultáneo en una sola pantalla",
      "Rotación panorámica motorizada 360° horizontal y 90° vertical",
      "Auto-tracking inteligente: la cámara sigue activamente al intruso",
      "Visión nocturna Full-Color con proyectores LED y luces disuasivas",
      "Sirena sonora de advertencia para espantar intrusos de inmediato",
      "Carcasa reforzada apta para sol y lluvia intensa en exteriores",
      "Visualización compartida para toda la familia en simultáneo",
      "Ranura para memoria MicroSD de hasta 256GB"
    ],
    specs: [
      { label: "Sistema de Lentes", value: "Doble Lente (Fijo + PTZ Motorizado)" },
      { label: "Rotación", value: "360° Horizontal / 90° Vertical" },
      { label: "Iluminación Nocturna", value: "LEDs blancos Full Color + IR" },
      { label: "Disuasión", value: "Sirena y destello estroboscópico" },
      { label: "Certificación", value: "Resistente a la intemperie" },
      { label: "Garantía", value: "3 AÑOS Garantía Oficial ATOMIC" }
    ],
    spacesBestFor: ["Esquinas de predios", "Portones vehiculares", "Terrenos abiertos", "Locales comerciales"]
  },
  {
    id: "combo-kit-nks4223wbth",
    code: "10115",
    name: "ATOMIC COMBO Kit NVR Wi-Fi NKS4223WBTH",
    brand: "ATOMIC",
    tagline: "Sistema integral con grabador NVR inalámbrico + cámaras de alta resolución",
    badge: "🏆 Combo Completo",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    price: 95.00,
    priceNotes: "Kit completo oficial $95.00 + IVA (Cód 10115)",
    image: "/images/camaras-exterior/combo-kit-nks4223wbth.jpg",
    description: "Kit completo de videovigilancia inalámbrica con central grabadora NVR. Olvídate del cableado entre cámaras y grabador; el sistema se conecta por Wi-Fi directo con alcance de hasta 100 metros en línea de vista.",
    highlightFeature: "Grabación continua 24/7 centralizada en grabador NVR con salida HDMI/VGA",
    features: [
      "Grabador NVR inalámbrico de largo alcance con tecnología mesh Wi-Fi",
      "Cámaras resistentes al agua listas para montaje en exteriores",
      "Grabación centralizada continua sin depender de tarjetas MicroSD individuales",
      "Salida de video HDMI y VGA para conectar a televisores o monitores",
      "Monitoreo remoto en celular, tablet y computadora sin costos de suscripción",
      "Detección inteligente de movimiento con filtro de falsas alarmas",
      "Compresión de video de alta eficiencia para optimizar el almacenamiento",
      "Kit pre-emparejado de fábrica: conectar y empezar a visualizar"
    ],
    specs: [
      { label: "Código de Producto", value: "10115" },
      { label: "Modelo Oficial", value: "Kit NKS4223WBTH" },
      { label: "Tipo de Sistema", value: "Grabador NVR Inalámbrico + Cámaras" },
      { label: "Alcance Wi-Fi", value: "Hasta 100m en línea de vista directa" },
      { label: "Salidas de Video", value: "HDMI Full HD y VGA" },
      { label: "Compresión", value: "H.265+ ultra eficiente" },
      { label: "Garantía", value: "3 AÑOS Garantía Oficial ATOMIC" }
    ],
    spacesBestFor: ["Casas familiares completas", "Bodegas y galpones", "Talleres mecánicos", "Oficinas y almacenes"]
  },
  {
    id: "camara-imou-cruiser-triple-11mp",
    code: "12759",
    name: "IMOU Cruiser Triple Lente 11MP Pan-Tilt 360°",
    brand: "IMOU",
    tagline: "El buque insignia de IMOU: 3 lentes independientes con resolución masiva de 11MP",
    badge: "👑 Máxima Nitidez 11MP",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/40",
    price: 135.00,
    priceNotes: "Precio oficial $135.00 + IVA (Cód 12759)",
    image: "/images/camaras-exterior/camara-imou-cruiser-triple-11mp.jpg",
    description: "La joya tecnológica de IMOU para exteriores. Tres lentes de alta resolución que suman 11 Megapíxeles combinados. Cubre múltiples zonas críticas al mismo tiempo sin necesidad de instalar tres cámaras separadas.",
    highlightFeature: "3 Lentes en 1 sola cámara con 11MP combinados y visión a todo color 24/7",
    features: [
      "Resolución combinada de 11 Megapíxeles para nitidez quirúrgica de rostros y placas",
      "Tres lentes que vigilan tres direcciones simultáneas",
      "Visión nocturna Full-Color Smart: iluminación LED inteligente que se activa con intrusos",
      "Detección humana y de vehículos mediante algoritmos de Inteligencia Artificial IMOU Sense",
      "Sirena de 110dB integrada + reflector destellante de alta disuasión",
      "Resistencia extrema a intemperie certificada IP66",
      "Conexión Wi-Fi 6 de última generación con antenas duales de alta cobertura",
      "Almacenamiento en MicroSD hasta 512GB"
    ],
    specs: [
      { label: "Código de Producto", value: "12759" },
      { label: "Resolución Total", value: "11 Megapíxeles (Triple Lente)" },
      { label: "Inteligencia Artificial", value: "IMOU SENSE (Personas y Autos)" },
      { label: "Sirena Integrada", value: "110 dB de potencia acústica" },
      { label: "Visión Nocturna", value: "4 modos inteligentes Full Color" },
      { label: "Conectividad", value: "Wi-Fi 6 + Puerto RJ45 Ethernet" },
      { label: "Garantía", value: "3 AÑOS Garantía Oficial ATOMIC" }
    ],
    spacesBestFor: ["Quintas y fincas", "Condominios residenciales", "Parqueaderos comerciales", "Residencias de lujo"]
  },
  {
    id: "camara-imou-titan-pro-aurora",
    code: "TITAN-AURORA",
    name: "IMOU Titan Pro Aurora Full-Color Exterior Wi-Fi",
    brand: "IMOU",
    tagline: "Visión nocturna nocturna ultrabrillante a color con opciones con y sin instalación",
    badge: "🌟 Visión Aurora",
    badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/40",
    price: 115.00,
    priceWithInstall: 145.00,
    priceNotes: "1 Cámara: $115 solo equipo / $145 instalada | 2 Cámaras: $110 c/u equipo / $130 instalada | 3 Cámaras: $105 c/u equipo / $115 instalada",
    image: "/images/camaras-exterior/camara-imou-titan-pro-aurora.jpg",
    description: "Cámara exterior con sensor ultrasensible de iluminación Aurora que permite ver a pleno color en la oscuridad de la noche. Disponible con paquetes promocionales por volumen y servicio de instalación llave en mano.",
    highlightFeature: "Tecnología Aurora Full-Color + Escala de descuentos por compra múltiple",
    features: [
      "Sensor Aurora ultraluminoso para claridad cromática nocturna superior",
      "Opciones con instalación técnica profesional en Quito y valles",
      "Detección de personas y mascotas con notificaciones instantáneas",
      "Audio bidireccional de largo alcance con cancelación de eco y viento",
      "Carcasa reforzada con grado de impermeabilidad IP66",
      "Precios especiales por volumen: lleva 1, 2 o 3 unidades con descuento progresivo",
      "Visualización multipantalla en app IMOU Life para toda la familia",
      "Compatible con almacenamiento en MicroSD y Nube"
    ],
    specs: [
      { label: "Sensor Óptico", value: "Tecnología Aurora Full-Color 24/7" },
      { label: "Resistencia", value: "IP66 apta para sol y lluvia" },
      { label: "Escala 1 Cámara", value: "$115 equipo / $145 instalado" },
      { label: "Escala 2 Cámaras", value: "$110 c/u equipo / $130 c/u instalado" },
      { label: "Escala 3 Cámaras", value: "$105 c/u equipo / $115 c/u instalado" },
      { label: "Garantía", value: "3 AÑOS Garantía Oficial ATOMIC" }
    ],
    spacesBestFor: ["Casas con amplios jardines", "Perímetros residenciales", "Locales a la calle", "Accesos de condominios"]
  }
]

const EXTERIOR_ADVANTAGES = [
  {
    icon: CloudRain,
    title: "100% Resistentes al Clima",
    description: "Construidas con sellado hermético IP66/IP67 que resiste aguaceros de la Sierra, humedad de la Costa y el sol más intenso sin decolorarse."
  },
  {
    icon: Moon,
    title: "Visión Nocturna Full-Color",
    description: "No más sombras borrosas en blanco y negro. Distingue colores de ropa, marcas y placas de vehículos incluso en la oscuridad total."
  },
  {
    icon: BellRing,
    title: "Disuasión Activa Inmediata",
    description: "Sirena acústica de hasta 110dB y destellos de luz estroboscópica que ahuyentan a intrusos antes de que toquen tu puerta."
  },
  {
    icon: Smartphone,
    title: "App Móvil Sin Mensualidades",
    description: "Monitorea en vivo desde tu celular en cualquier lugar del mundo. Recibe alertas y habla en tiempo real sin suscripciones mensuales."
  },
  {
    icon: Award,
    title: "3 Años de Garantía Directa",
    description: "Respaldado por el servicio técnico oficial de ATOMIC Electronics Ecuador. Soporte de repuestos, configuración y recambio."
  },
  {
    icon: Wrench,
    title: "Instalación Opcional Llave en Mano",
    description: "Puedes instalarla tú mismo fácilmente o solicitar a nuestros técnicos certificados en Quito, Valles y a nivel nacional."
  }
]

const FAQS = [
  {
    q: "¿Necesito romper paredes para pasar cables?",
    a: "No. Todas nuestras cámaras para exteriores cuentan con conexión Wi-Fi de alta ganancia. Solo necesitas un punto de energía eléctrica cercano para alimentar el transformador y la señal de video viaja de forma 100% inalámbrica a tu módem y celular."
  },
  {
    q: "¿Soportan las lluvias fuertes y el granizo en Ecuador?",
    a: "Absolutamente sí. Cuentan con certificación oficial IP66 e IP67, lo que significa que el chasis está herméticamente sellado contra chorros de agua a presión, lluvias torrenciales, humedad extrema y polvo fino."
  },
  {
    q: "¿Cómo se pagan las cámaras y realizan los envíos?",
    a: "Aceptamos transferencia bancaria directa (Banco Pichincha, Guayaquil, Produbanco), tarjeta de crédito y pago contra entrega en Quito. Despachamos a todas las provincias del Ecuador vía Servientrega o Cooperativa con seguro de carga."
  },
  {
    q: "¿Tengo que pagar alguna mensualidad por la aplicación?",
    a: "No. Las aplicaciones oficiales (IMOU Life, EZVIZ, CareCam) son 100% gratuitas de por vida. Puedes ver en vivo, reproducir grabaciones, recibir alertas y compartir el acceso con tus familiares sin pagar un solo centavo mensual."
  },
  {
    q: "¿Qué capacidad de memoria MicroSD recomiendan para exteriores?",
    a: "Recomendamos tarjetas MicroSD Clase 10 de 64GB (para ~8 a 10 días de grabación continua) o 128GB (para ~18 a 22 días). Cuando la memoria se llena, la cámara sobreescribe automáticamente los días más antiguos."
  }
]

export default function CamarasExteriorClient() {
  const [selectedProduct, setSelectedProduct] = useState<CameraProduct>(CAMERAS_EXTERIOR[0])
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const whatsappBaseUrl = "https://wa.me/593969043453"

  const buildWhatsAppLink = (productName: string, price: number) => {
    const text = encodeURIComponent(
      `¡Hola ATOMIC Electronics! 👋 Deseo información y cotizar la *${productName}* ($${price.toFixed(2)} + IVA) para exterior. ¿Me pueden ayudar con disponibilidad, envíos o instalación? 📹`
    )
    return `${whatsappBaseUrl}?text=${text}`
  }

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 font-sans selection:bg-cyan-500 selection:text-white">
      {/* Top Banner de Confianza */}
      <div className="bg-gradient-to-r from-cyan-900/40 via-blue-900/40 to-cyan-900/40 border-b border-cyan-800/30 text-xs py-2 px-4 text-center text-cyan-200 flex items-center justify-center gap-4 flex-wrap">
        <span className="flex items-center gap-1.5 font-medium">
          <Award className="w-3.5 h-3.5 text-cyan-400" /> 3 AÑOS DE GARANTÍA OFICIAL ATOMIC
        </span>
        <span className="hidden sm:inline text-cyan-500">•</span>
        <span className="flex items-center gap-1.5 font-medium">
          <Truck className="w-3.5 h-3.5 text-cyan-400" /> ENVÍOS SEGUROS A TODO EL ECUADOR POR SERVIENTREGA
        </span>
        <span className="hidden sm:inline text-cyan-500">•</span>
        <span className="flex items-center gap-1.5 font-medium">
          <CloudRain className="w-3.5 h-3.5 text-cyan-400" /> CERTIFICACIÓN IP66 100% IMPERMEABLE
        </span>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b border-slate-800/80">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-cyan-950/30 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs sm:text-sm font-semibold mb-5 tracking-wide uppercase">
              <ShieldCheck className="w-4 h-4" /> Seguridad Perimetral e Intemperie 2026
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
              Protege el Exterior de tu Hogar con Cámaras{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
                Wi-Fi IP66 de Alta Resistencia
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8">
              Descubre nuestra gama de cámaras exteriores profesionales. Visión nocturna a pleno color, rotación 360°, sirenas disuasivas y modelos con hasta 3 lentes simultáneos. Vigila portones, patios y fachadas desde tu celular.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#catalogo-exterior"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-center shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2"
              >
                <Camera className="w-5 h-5" /> Ver Modelos y Precios
              </a>
              <a
                href={buildWhatsAppLink("Asesoría General Cámaras Exterior", 47.82)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-center shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2"
              >
                <Smartphone className="w-5 h-5" /> Chatear con un Asesor
              </a>
            </div>
          </div>

          {/* Quick stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 border-t border-slate-800/60">
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400">IP66</div>
              <div className="text-xs sm:text-sm text-slate-400 font-medium mt-1">Impermeabilidad Total</div>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400">11 MP</div>
              <div className="text-xs sm:text-sm text-slate-400 font-medium mt-1">Resolución Máxima</div>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400">$47.82</div>
              <div className="text-xs sm:text-sm text-slate-400 font-medium mt-1">Precios Desde</div>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400">3 Años</div>
              <div className="text-xs sm:text-sm text-slate-400 font-medium mt-1">Garantía Directa</div>
            </div>
          </div>
        </div>
      </section>

      {/* Ventajas Clave */}
      <section className="py-16 bg-slate-950/60 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-4">
              ¿Por qué elegir Cámaras de Exterior en ATOMIC?
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Diseñadas específicamente para soportar los climas más duros del país con la mejor conectividad móvil.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {EXTERIOR_ADVANTAGES.map((adv, idx) => {
              const Icon = adv.icon
              return (
                <div
                  key={idx}
                  className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/40 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{adv.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{adv.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Catálogo Maestro con Selector */}
      <section id="catalogo-exterior" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-cyan-400 text-sm font-semibold tracking-wider uppercase">Gama Oficial 2026</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-2 mb-4">
            Catálogo Oficial de Cámaras para Exterior
          </h2>
          <p className="text-slate-400 text-base">
            Elige el modelo que mejor se adapte al tamaño de tu propiedad, requerimientos de visión y presupuesto.
          </p>
        </div>

        {/* Tabs de selección de cámaras */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12">
          {CAMERAS_EXTERIOR.map(camera => {
            const isSelected = selectedProduct.id === camera.id
            return (
              <button
                key={camera.id}
                onClick={() => setSelectedProduct(camera)}
                className={`px-4 sm:px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all border ${
                  isSelected
                    ? "bg-cyan-600 text-white border-cyan-400 shadow-lg shadow-cyan-600/30"
                    : "bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white"
                }`}
              >
                {camera.name.split(" ")[1] || camera.name} (${camera.price.toFixed(2)})
              </button>
            )
          })}
        </div>

        {/* Ficha Principal Detallada de la Cámara Seleccionada */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-10 mb-16 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Foto del Flyer Oficial */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-slate-700/60 bg-black/40 aspect-[4/5] shadow-2xl">
                <Image
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 500px"
                  priority
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${selectedProduct.badgeColor}`}>
                    {selectedProduct.badge}
                  </span>
                </div>
              </div>
            </div>

            {/* Información y Especificaciones */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <span className="text-xs uppercase tracking-wider text-cyan-400 font-bold bg-cyan-950/60 px-2.5 py-0.5 rounded border border-cyan-800/40">
                    Marca: {selectedProduct.brand}
                  </span>
                  <span className="text-xs text-slate-400">Cód: {selectedProduct.code}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">{selectedProduct.name}</h3>
                <p className="text-slate-300 text-sm sm:text-base italic mb-4 text-cyan-300/90">{selectedProduct.tagline}</p>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">{selectedProduct.description}</p>

                {/* Precios */}
                <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 mb-6">
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <span className="text-3xl sm:text-4xl font-extrabold text-cyan-400">
                      ${selectedProduct.price.toFixed(2)}
                    </span>
                    <span className="text-xs text-slate-400">+ IVA / Unidad</span>
                    {selectedProduct.priceWithInstall && (
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800/40">
                        Opcional instalada por solo +${selectedProduct.priceWithInstall.toFixed(2)}
                      </span>
                    )}
                  </div>
                  {selectedProduct.priceNotes && (
                    <p className="text-xs text-slate-400 mt-2 font-medium">{selectedProduct.priceNotes}</p>
                  )}
                </div>

                {/* Características Clave */}
                <div className="space-y-2 mb-8">
                  <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider">Puntos Destacados</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedProduct.features.slice(0, 6).map((feat, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Botón CTA a WhatsApp */}
              <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row gap-3">
                <a
                  href={buildWhatsAppLink(selectedProduct.name, selectedProduct.price)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-center shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2"
                >
                  <Smartphone className="w-5 h-5" /> Cotizar {selectedProduct.name.split(" ")[1]} por WhatsApp
                </a>
                <a
                  href="#tabla-comparativa"
                  className="py-3.5 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-center transition-all flex items-center justify-center gap-2 text-sm"
                >
                  Ver Ficha Técnica Completa
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Tarjetas de Todos los Modelos en Cuadrícula */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CAMERAS_EXTERIOR.map(cam => (
            <div
              key={cam.id}
              className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-slate-700 transition-all"
            >
              <div className="relative aspect-video w-full bg-black/40">
                <Image src={cam.image} alt={cam.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 400px" />
                <div className="absolute top-3 left-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${cam.badgeColor}`}>
                    {cam.badge}
                  </span>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-lg font-bold text-white mb-1">{cam.name}</h4>
                  <p className="text-xs text-slate-400 mb-4 line-clamp-2">{cam.description}</p>
                  <div className="text-2xl font-extrabold text-cyan-400 mb-1">
                    ${cam.price.toFixed(2)} <span className="text-xs text-slate-400 font-normal">+ IVA</span>
                  </div>
                  {cam.priceNotes && <p className="text-xs text-slate-500 mb-4 line-clamp-1">{cam.priceNotes}</p>}
                </div>
                <div className="pt-4 border-t border-slate-800/80 flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedProduct(cam)
                      window.scrollTo({ top: 500, behavior: "smooth" })
                    }}
                    className="flex-1 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-semibold transition-all text-center"
                  >
                    Ver Detalles
                  </button>
                  <a
                    href={buildWhatsAppLink(cam.name, cam.price)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs text-white font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <Smartphone className="w-3.5 h-3.5" /> Cotizar
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tabla Comparativa de Especificaciones */}
      <section id="tabla-comparativa" className="py-16 bg-slate-950/80 border-t border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-3">
              Ficha Comparativa de Especificaciones
            </h2>
            <p className="text-slate-400 text-sm">
              Compara directamente las especificaciones técnicas de toda nuestra línea exterior
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-slate-300 border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-xs tracking-wider bg-slate-900/60">
                  <th className="py-4 px-4 font-bold">Modelo</th>
                  <th className="py-4 px-4 font-bold">Resolución / Lentes</th>
                  <th className="py-4 px-4 font-bold">Rotación</th>
                  <th className="py-4 px-4 font-bold">Visión Nocturna</th>
                  <th className="py-4 px-4 font-bold">Precio (+IVA)</th>
                  <th className="py-4 px-4 font-bold text-center">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {CAMERAS_EXTERIOR.map(cam => (
                  <tr key={cam.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-4 px-4 font-bold text-white flex items-center gap-2">
                      <Camera className="w-4 h-4 text-cyan-400 shrink-0" />
                      {cam.name}
                    </td>
                    <td className="py-4 px-4 text-slate-300">
                      {cam.specs.find(s => s.label.includes("Resolución") || s.label.includes("Lentes"))?.value || "HD Exterior"}
                    </td>
                    <td className="py-4 px-4 text-slate-300">
                      {cam.features.some(f => f.includes("360°")) ? "360° Pan-Tilt Motorizado" : "Ángulo Fijo Gran Angular"}
                    </td>
                    <td className="py-4 px-4 text-slate-300">
                      {cam.specs.find(s => s.label.includes("Nocturna") || s.label.includes("Iluminación"))?.value || "Full Color Smart"}
                    </td>
                    <td className="py-4 px-4 font-extrabold text-cyan-400">
                      ${cam.price.toFixed(2)}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <a
                        href={buildWhatsAppLink(cam.name, cam.price)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all"
                      >
                        <Smartphone className="w-3.5 h-3.5" /> Cotizar
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Acordeón */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-400 text-xs font-semibold mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" /> Preguntas Frecuentes
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            Todo lo que necesitas saber antes de comprar
          </h2>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx
            return (
              <div
                key={idx}
                className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-white text-sm sm:text-base hover:text-cyan-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? "rotate-180 text-cyan-400" : ""}`} />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-5 pb-5 text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 pt-4"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-gradient-to-b from-slate-950 to-cyan-950/40 border-t border-slate-800 text-center px-4">
        <div className="max-w-3xl mx-auto">
          <Shield className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-4">
            ¿Listo para proteger tu hogar o negocio hoy mismo?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mb-8">
            Escríbenos directamente a WhatsApp. Un asesor técnico te atenderá en menos de 2 minutos para resolver tus dudas y gestionar tu despacho a domicilio.
          </p>
          <a
            href={buildWhatsAppLink("Cámaras Exterior - Asesoría Inmediata", 47.82)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base shadow-xl shadow-emerald-600/30 transition-all"
          >
            <Smartphone className="w-5 h-5" /> Chatear con un Asesor por WhatsApp
          </a>
          <p className="text-xs text-slate-500 mt-4">
            ATOMIC Electronics Ecuador • Av. Colón y Foch, Quito • Despachos diarios a nivel nacional
          </p>
        </div>
      </section>
    </div>
  )
}
