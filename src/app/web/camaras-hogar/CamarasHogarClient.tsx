"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import {
  Shield,
  ShieldCheck,
  Zap,
  CheckCircle2,
  PhoneCall,
  Camera,
  Eye,
  Wifi,
  Sparkles,
  ChevronDown,
  HelpCircle,
  Truck,
  Building,
  Award,
  Video,
  Moon,
  Volume2,
  HardDrive,
  Cpu,
  Lock,
  ArrowRight,
  ChevronRight,
  Compass,
  ArrowLeft,
  X,
  Star
} from "lucide-react"

interface CameraProduct {
  id: string
  sku: string
  name: string
  tier: "Básica" | "Avanzada" | "Premium"
  resolution: string
  tagline: string
  badge: string
  recommended?: boolean
  priceBase: number
  image: string
  description: string
  fullOverview: string
  keyFeatures: string[]
  specsTable: { label: string; value: string }[]
  nightVisionType: string
  aiFeatures: string
  audio: string
  storage: string
  warranty: string
}

const CAMERAS_LINEUP: CameraProduct[] = [
  {
    id: "cam-basica-3mp",
    sku: "CAM-EZVIZ-H6C-3MP",
    name: "Cámara Wi-Fi EZVIZ H6C 3MP Básica 360°",
    tier: "Básica",
    resolution: "3MP HD (2304 × 1296)",
    tagline: "Vigilancia esencial, nítida y confiable para tu hogar",
    badge: "⚡ OFERTA LIMITADA",
    priceBase: 44.99,
    image: "/images/camaras/camara-ezviz-h6c-3mp-basica-44.jpg",
    description: "Transforma tu hogar o negocio con la tranquilidad que mereces. Nuestra cámara 100% Wi-Fi ofrece vigilancia avanzada y sin complicaciones. Disfruta de monitoreo en tiempo real directamente desde tu celular, sin importar dónde te encuentres.",
    fullOverview: "La EZVIZ H6C 3MP es la solución ideal para quienes buscan proteger dormitorios, salas de estar o pequeños comercios sin complicaciones técnicas. Su lente motorizado ofrece una cobertura panorámica completa de 360 grados sin puntos ciegos. Cuenta con visión nocturna infrarroja inteligente que ajusta la intensidad de los LEDs para no sobreexponer los rostros en la oscuridad y seguimiento automático que gira la cámara cuando detecta movimiento.",
    keyFeatures: [
      "Visión nocturna infrarroja inteligente hasta 10 metros",
      "Cobertura panorámica motorizada de 360° (Paneo 340°, Inclinación 55°)",
      "Detección de movimiento con seguimiento automático de personas",
      "Comunicación bidireccional en tiempo real (habla y escucha)",
      "Modo de suspensión para privacidad total con un solo toque en la app",
      "Compatible con tarjetas MicroSD de hasta 512GB y almacenamiento en nube"
    ],
    specsTable: [
      { label: "Sensor de Imagen", value: "1/2.8\" Progressive Scan CMOS" },
      { label: "Resolución Máxima", value: "3MP HD (2304 × 1296 píxeles)" },
      { label: "Lente y Ángulo", value: "4mm @ F2.4, Ángulo diagonal 85°" },
      { label: "Rango Panorámico", value: "Paneo 340°, Inclinación vertical 55°" },
      { label: "Visión Nocturna", value: "Infrarrojo inteligente con alcance de 10m" },
      { label: "Compresión de Video", value: "H.265 / H.264 inteligente" },
      { label: "Conectividad", value: "Wi-Fi 2.4 GHz IEEE802.11b/g/n" },
      { label: "Almacenamiento Local", value: "Ranura MicroSD (hasta 512 GB)" },
      { label: "Garantía Oficial", value: "2 Años de Garantía Directa ATOMIC" }
    ],
    nightVisionType: "Infrarroja Inteligente (10 metros)",
    aiFeatures: "Detección de Movimiento + Autotracking",
    audio: "Audio Bidireccional Integrado",
    storage: "MicroSD hasta 512GB + CloudPlay",
    warranty: "2 Años Oficial ATOMIC"
  },
  {
    id: "cam-avanzada-3k",
    sku: "CAM-EZVIZ-3K-AVANZADA",
    name: "Cámara Wi-Fi EZVIZ 3K Avanzada Visión Nocturna Color",
    tier: "Avanzada",
    resolution: "3K Ultra Nítida (2880 × 1620)",
    tagline: "Colores vivos en la noche y máxima nitidez sin cables",
    badge: "🎨 VISIÓN A COLOR",
    priceBase: 64.99,
    image: "/images/camaras/camara-ezviz-3k-avanzada-64.jpg",
    description: "SOLUCIÓN DE VIGILANCIA COMPLETA: Esta cámara inteligente de alto rendimiento ofrece un monitoreo excepcional del interior de su hogar, oficina o negocio, brindando tranquilidad las 24 horas del día. Acceso remoto total desde su celular.",
    fullOverview: "La versión Avanzada 3K eleva el estándar de seguridad residencial incorporando sensores ópticos de gran apertura y focos LED de luz cálida integrados que permiten capturar video a todo color incluso en plena oscuridad. Su resolución 3K (5 Megapíxeles) permite hacer zoom digital sin perder la nitidez de placas vehiculares o rasgos faciales. Con su diseño Plug & Play, puedes instalarla en repisas, paredes o techos en cuestión de minutos.",
    keyFeatures: [
      "Resolución ultra nítida 3K para capturar hasta el más mínimo detalle",
      "Visión nocturna a todo color con focos LED inteligentes y sensor de alta sensibilidad",
      "Visión panorámica 360° con giro e inclinación motorizados",
      "Detección de movimiento inteligente con reducción de falsas alarmas",
      "Audio bidireccional con supresión de ruido ambiental",
      "Configuración sencilla Plug & Play y monitoreo multi-usuario"
    ],
    specsTable: [
      { label: "Sensor de Imagen", value: "1/2.7\" Progressive Scan CMOS Ultra Sensible" },
      { label: "Resolución Máxima", value: "3K (2880 × 1620 píxeles, 5MP)" },
      { label: "Lente y Apertura", value: "4mm @ F1.6 de gran apertura luminosa" },
      { label: "Modo Nocturno", value: "Full-Color Nocturno + Infrarrojo B/N" },
      { label: "Alcance Nocturno", value: "Hasta 15 metros en oscuridad total" },
      { label: "Audio", value: "Micrófono de alta ganancia + Altavoz HQ" },
      { label: "Conectividad", value: "Wi-Fi 2.4 GHz + Puerto Ethernet RJ45" },
      { label: "Almacenamiento Local", value: "MicroSD hasta 512 GB" },
      { label: "Garantía Oficial", value: "2 Años de Garantía Directa ATOMIC" }
    ],
    nightVisionType: "Visión Nocturna a Todo Color + IR",
    aiFeatures: "Detección Inteligente + Enfoque Dinámico",
    audio: "Audio Bidireccional con Cancelación de Ruido",
    storage: "MicroSD hasta 512GB + CloudPlay",
    warranty: "2 Años Oficial ATOMIC"
  },
  {
    id: "cam-premium-4k",
    sku: "CAM-EZVIZ-4K-PREMIUM",
    name: "Cámara Wi-Fi 4K Ultra HD Premium con Inteligencia Artificial",
    tier: "Premium",
    resolution: "4K Ultra HD (3840 × 2160)",
    tagline: "El pináculo de la seguridad: IA humana, 4K UHD y seguimiento 360°",
    badge: "⭐ RECOMENDADA",
    recommended: true,
    priceBase: 78.99,
    image: "/images/camaras/camara-ezviz-4k-premium-78.jpg",
    description: "Experience the peace of mind that comes with cutting-edge technology. Our 100% Wi-Fi cameras offer a comprehensive security solution that's easy to use and accessible from anywhere. Forget complicated cables and cumbersome installations.",
    fullOverview: "La joya de la corona en vigilancia inteligente para el hogar. Diseñada con un potente procesador de Inteligencia Artificial en el chip (Edge AI) capaz de distinguir con exactitud milimétrica entre personas, mascotas y objetos en movimiento, eliminando por completo falsas alarmas provocadas por cortinas o insectos. Su sensor óptico 4K Ultra HD captura cada escena con una riqueza visual cinematográfica. Cuenta con obturador físico de privacidad que oculta el lente cuando deseas intimidad y seguimiento inteligente 360° con zoom dinámico.",
    keyFeatures: [
      "Máxima resolución 4K Ultra HD para lectura clara de rostros, billetes y detalles",
      "Inteligencia Artificial integrada: Detección precisa de humanos y mascotas",
      "Seguimiento automático inteligente 360° con zoom dinámico automático",
      "Visión nocturna a color de largo alcance con sensor Starlight y focos auxiliares",
      "Comunicación bidireccional premium con micrófono dual y altavoz de alta potencia",
      "Modo de privacidad de obturador físico con un toque en el celular",
      "Compatibilidad total con ZKTeco Zlink, EZVIZ App y asistentes de voz"
    ],
    specsTable: [
      { label: "Sensor de Imagen", value: "1/1.8\" Starlight Ultra High-Definition CMOS" },
      { label: "Resolución Máxima", value: "4K UHD (3840 × 2160 píxeles, 8MP)" },
      { label: "Procesador IA", value: "Chip Neural Edge AI para detección de personas/mascotas" },
      { label: "Rango Panorámico", value: "Paneo 360° continuo, Inclinación 90°" },
      { label: "Visión Nocturna", value: "Full-Color Starlight 4K con focos inteligentes" },
      { label: "Privacidad", value: "Obturador físico motorizado que tapa el lente" },
      { label: "Audio", value: "Micrófono Dual con IA antirruido + Altavoz" },
      { label: "Conectividad", value: "Wi-Fi Dual-Band 2.4/5GHz + Ethernet" },
      { label: "Garantía Oficial", value: "2 Años de Garantía Directa ATOMIC" }
    ],
    nightVisionType: "Starlight 4K Full-Color (Hasta 20m)",
    aiFeatures: "IA Humana + Mascotas + Zoom Dinámico 360°",
    audio: "Audio Bidireccional Dual HQ",
    storage: "MicroSD hasta 512GB + CloudPlay",
    warranty: "2 Años Oficial ATOMIC"
  }
]

const PROVINCES_DATA = [
  { id: "quito", name: "Quito / Pichincha", cost: 45, region: "Quito y Valles", icon: "🏙️", badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
  { id: "guayas", name: "Guayas (Guayaquil, Samborondón, Durán)", cost: 65, region: "Costa", icon: "🏖️", badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
  { id: "azuay", name: "Azuay (Cuenca)", cost: 55, region: "Sierra Sur", icon: "🏔️", badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30" },
  { id: "manabi", name: "Manabí (Manta, Portoviejo)", cost: 65, region: "Costa", icon: "🏖️", badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
  { id: "tungurahua", name: "Tungurahua (Ambato, Baños)", cost: 55, region: "Sierra Centro", icon: "🏔️", badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30" },
  { id: "el-oro", name: "El Oro (Machala)", cost: 65, region: "Costa Sur", icon: "🏖️", badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
  { id: "imbabura", name: "Imbabura (Ibarra, Otavalo)", cost: 55, region: "Sierra Norte", icon: "🏔️", badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30" },
  { id: "santo-domingo", name: "Santo Domingo", cost: 55, region: "Sierra / Costa", icon: "🏔️", badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30" },
  { id: "los-rios", name: "Los Ríos (Babahoyo, Quevedo)", cost: 65, region: "Costa Centro", icon: "🏖️", badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
  { id: "chimborazo", name: "Chimborazo (Riobamba)", cost: 55, region: "Sierra Centro", icon: "🏔️", badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30" },
  { id: "loja", name: "Loja", cost: 55, region: "Sierra Sur", icon: "🏔️", badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30" },
  { id: "esmeraldas", name: "Esmeraldas", cost: 65, region: "Costa Norte", icon: "🏖️", badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
  { id: "santa-elena", name: "Santa Elena / Salinas", cost: 65, region: "Costa", icon: "🏖️", badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
  { id: "cotopaxi", name: "Cotopaxi (Latacunga)", cost: 55, region: "Sierra Centro", icon: "🏔️", badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30" },
  { id: "carchi", name: "Carchi (Tulcán)", cost: 55, region: "Sierra Norte", icon: "🏔️", badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30" },
  { id: "oriente", name: "Oriente (Napo, Pastaza, Sucumbíos, Orellana, Morona, Zamora)", cost: 75, region: "Amazonía", icon: "🌳", badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
  { id: "galapagos", name: "Galápagos (Santa Cruz, San Cristóbal, Isabela)", cost: 95, region: "Insular", icon: "🐢", badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30" }
]

const FAQS_DATA = [
  {
    q: "¿En qué consiste la Garantía Oficial de 2 Años?",
    a: "Todos nuestros modelos de cámaras para hogar cuentan con 2 años completos de garantía directa respaldada por ATOMIC y los fabricantes oficiales (EZVIZ / ZKTeco). Cubre cualquier defecto de fábrica, sensor óptico, motor PTZ o módulo Wi-Fi con reemplazo inmediato o servicio técnico especializado."
  },
  {
    q: "¿Necesito pagar mensualidades o suscripciones para ver las grabaciones?",
    a: "¡No! Todas las cámaras admiten tarjetas de memoria MicroSD de hasta 512GB (que almacenan semanas continuas de video sin cuotas mensuales). Además, cuentas con acceso gratuito en tiempo real 24/7 y notificaciones instantáneas a tu celular sin ningún costo adicional."
  },
  {
    q: "¿Puedo ver la cámara desde varios celulares al mismo tiempo?",
    a: "Sí. Puedes compartir el acceso de manera segura con todos los integrantes de tu familia o colaboradores a través de la aplicación oficial, asignando permisos de visualización o control según lo desees."
  },
  {
    q: "¿Qué sucede si se va el internet en mi casa?",
    a: "La cámara continuará grabando localmente en la tarjeta MicroSD sin interrupción. En cuanto el internet se restablezca, podrás revisar todo el historial desde tu teléfono sin perder ningún segundo."
  },
  {
    q: "¿Cómo funciona la instalación a domicilio?",
    a: "Las cámaras son 100% Plug & Play y puedes colocarlas tú mismo sobre cualquier mueble en 3 minutos. Si prefieres instalación profesional en pared/techo con cableado oculto, disponemos de técnicos certificados en las 24 provincias del Ecuador."
  }
]

export default function CamarasHogarClient() {
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>("quito")
  const [selectedProduct, setSelectedProduct] = useState<CameraProduct | null>(null)
  const [includeInstallation, setIncludeInstallation] = useState<boolean>(true)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const selectedProvince = useMemo(() => {
    return PROVINCES_DATA.find((p) => p.id === selectedProvinceId) || PROVINCES_DATA[0]
  }, [selectedProvinceId])

  const calculateRegularPrice = (base: number) => {
    return (base / 0.70).toFixed(2)
  }

  const getWhatsAppLink = (cam: CameraProduct) => {
    const installText = includeInstallation
      ? ` con Instalación Profesional en ${selectedProvince.name} (Total: $${(cam.priceBase + selectedProvince.cost).toFixed(2)} USD)`
      : ` con Envío Nacional Sin Recargo ($${cam.priceBase.toFixed(2)} USD)`
    const text = encodeURIComponent(
      `Hola ATOMIC! Deseo adquirir la ${cam.name} (${cam.tier} $${cam.priceBase} USD)${installText}. Garantía 2 Años.`
    )
    return `https://wa.me/593969043453?text=${text}`
  }

  return (
    <div className="w-full bg-[#08080C] min-h-screen text-white font-sans selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* ═══════════ TOP BANNER: 2 AÑOS DE GARANTÍA & PRODUCTOS 100% ORIGINALES ═══════════ */}
      <div className="sticky top-0 z-50 w-full bg-[#060609]/95 backdrop-blur-xl border-b border-amber-500/20 py-2 px-4 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
          <Link
            href="/web"
            className="flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors font-mono font-bold uppercase tracking-wider text-[11px]"
          >
            <ArrowLeft size={14} className="text-amber-400" />
            <span className="hidden sm:inline">Volver a la Tienda</span>
            <span className="sm:hidden">Tienda</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
            <span className="font-extrabold font-heading text-amber-300 uppercase tracking-widest text-[11px] sm:text-xs">
              🛡️ CÁMARAS PARA HOGAR // GARANTÍA OFICIAL DE 2 AÑOS
            </span>
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/web/cerraduras-smart"
              className="text-[10px] sm:text-[11px] text-blue-400 hover:text-blue-300 underline font-mono font-bold uppercase tracking-wider"
            >
              Cerraduras Smart →
            </Link>
          </div>
        </div>
      </div>

      {/* ═══════════ HEADER NAV BAR ═══════════ */}
      <header className="w-full bg-[#0D0C14] border-b border-white/[0.06] py-3.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.25)]">
              <Camera size={18} />
            </div>
            <div>
              <span className="text-base sm:text-lg font-black font-heading tracking-tight text-white uppercase block leading-none">
                ATOMIC <span className="text-amber-400">SECURITY</span>
              </span>
              <span className="text-[10px] text-neutral-400 font-mono tracking-widest uppercase">
                CÁMARAS WI-FI 4K, 3K & 3MP
              </span>
            </div>
          </div>

          {/* Quick Province Selector */}
          <div className="flex items-center gap-2.5">
            <div className="hidden md:flex items-center gap-2 bg-white/[0.04] border border-white/10 rounded-full px-3 py-1 text-xs">
              <Compass size={14} className="text-amber-400" />
              <span className="text-[11px] text-neutral-400 font-mono">Provincia:</span>
              <select
                value={selectedProvinceId}
                onChange={(e) => setSelectedProvinceId(e.target.value)}
                className="bg-transparent text-white font-bold outline-none cursor-pointer text-xs"
              >
                {PROVINCES_DATA.map((prov) => (
                  <option key={prov.id} value={prov.id} className="bg-[#0e0e14] text-white">
                    {prov.icon} {prov.name}
                  </option>
                ))}
              </select>
            </div>

            <a
              href="https://wa.me/593969043453?text=Hola%20ATOMIC!%20Deseo%20informaci%C3%B3n%20sobre%20las%20C%C3%A1maras%20para%20Hogar%20con%20Garant%C3%ADa%20de%202%20A%C3%B1os."
              target="_blank"
              rel="noreferrer"
              className="px-4 py-1.5 rounded-full border border-amber-400/50 hover:border-amber-400 bg-amber-500/[0.12] hover:bg-amber-500/25 text-amber-300 hover:text-amber-200 font-bold font-heading uppercase tracking-wider text-[11px] transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
            >
              <PhoneCall size={12} />
              <span>ASESORÍA WHATSAPP</span>
            </a>
          </div>
        </div>
      </header>

      {/* ═══════════ HERO SHOWCASE SECTION ═══════════ */}
      <section className="relative w-full pt-12 pb-16 px-4 sm:px-6 overflow-hidden bg-gradient-to-b from-[#0F0E17] via-[#09080F] to-[#08080C]">
        {/* Ambient Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[750px] h-[380px] bg-gradient-to-b from-amber-500/15 via-yellow-600/5 to-transparent blur-[130px] pointer-events-none" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 text-center">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-5 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
          >
            <Award size={14} className="text-amber-400" />
            <span>GARANTÍA OFICIAL DE 2 AÑOS // ATOMIC SECURITY</span>
            <Sparkles size={14} className="text-amber-300" />
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black font-heading uppercase tracking-tight text-white max-w-4xl mx-auto leading-tight"
          >
            Cámaras para Hogar <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500">
              De Alta Calidad 4K, 3K & 3MP
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-sm sm:text-base text-neutral-300 max-w-3xl mx-auto leading-relaxed"
          >
            Seguridad inteligente, tranquilidad total las 24 horas del día. Cámaras 100% Wi-Fi sin cables con visión nocturna a color, detección de movimiento con Inteligencia Artificial, audio bidireccional y monitoreo en tiempo real desde tu celular.
          </motion.p>

          {/* ═══════════ OFFICIAL CAMPAIGN FLYER DISPLAY (IMAGE 1) ═══════════ */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 max-w-3xl mx-auto rounded-3xl overflow-hidden border border-amber-400/40 shadow-2xl shadow-amber-500/15 bg-[#0b0a12] p-2"
          >
            <img
              src="/banners/camaras-hogar-portada-4k.jpg"
              alt="Cámaras para Hogar de Alta Calidad 4K - Portada Oficial ATOMIC"
              className="w-full h-auto max-h-[560px] object-contain rounded-2xl mx-auto"
            />
          </motion.div>

          {/* ═══════════ 2-YEAR WARRANTY TRUST PILLS ═══════════ */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto mt-8">
            {[
              { icon: "🛡️", title: "Garantía 2 Años", desc: "Respaldo directo ATOMIC" },
              { icon: "⚡", title: "Plug & Play", desc: "Instalación en 3 minutos" },
              { icon: "📱", title: "App Sin Costo", desc: "Monitoreo 24/7 en celular" },
              { icon: "🚚", title: "Envíos Sin Recargo", desc: "A todo el Ecuador" }
            ].map((pill, idx) => (
              <div
                key={idx}
                className="bg-[#121018] border border-white/[0.08] hover:border-amber-500/40 rounded-2xl p-3.5 text-center transition-all shadow-lg"
              >
                <div className="text-xl mb-1">{pill.icon}</div>
                <div className="text-xs font-black font-heading text-white uppercase">{pill.title}</div>
                <div className="text-[10px] text-neutral-400 font-mono mt-0.5">{pill.desc}</div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ═══════════ 3 PRODUCT CARDS SHOWCASE (GRID COMPARISON) ═══════════ */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-16" id="modelos">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-bold text-neutral-300 mb-3 shadow-xl">
            <Eye size={14} className="text-amber-400" />
            <span className="font-heading uppercase tracking-wider text-[11px]">ELIGE LA QUE MEJOR SE ADAPTE A TU HOGAR</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-heading mb-3">
            Nuestros 3 Modelos Disponibles
          </h2>
          <p className="text-sm text-neutral-400">
            Compara características, resolución y precios con <strong>Garantía de 2 Años</strong> y opción de instalación a domicilio.
          </p>
        </div>

        {/* 3 CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {CAMERAS_LINEUP.map((cam) => {
            const isRec = cam.recommended
            return (
              <motion.div
                key={cam.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`relative rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 bg-gradient-to-b from-[#13111B] via-[#0E0C15] to-[#0A0910] border ${
                  isRec
                    ? "border-amber-400/80 shadow-[0_0_40px_rgba(245,158,11,0.25)] scale-105 z-20"
                    : "border-white/10 hover:border-white/25 shadow-xl"
                }`}
              >
                {/* Recommended Top Badge */}
                {isRec && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black font-heading text-[10px] uppercase tracking-widest px-4 py-1 rounded-full shadow-lg flex items-center gap-1.5">
                    <Star size={11} className="fill-black" />
                    <span>MÁS VENDIDA // RECOMENDADA</span>
                  </div>
                )}

                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <span className="text-[10px] font-mono font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-neutral-300">
                        Nivel {cam.tier}
                      </span>
                      <h3 className="text-xl font-black font-heading text-white uppercase mt-2 leading-snug">
                        {cam.name}
                      </h3>
                      <span className="text-xs font-bold text-amber-400 font-mono block mt-1">
                        {cam.resolution}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold shrink-0">
                      {cam.badge}
                    </span>
                  </div>

                  {/* Product Image */}
                  <div
                    onClick={() => setSelectedProduct(cam)}
                    className="w-full h-64 rounded-2xl overflow-hidden bg-black/40 border border-white/10 mb-5 relative group cursor-pointer"
                  >
                    <img
                      src={cam.image}
                      alt={cam.name}
                      className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-3">
                      <span className="text-[11px] font-bold font-heading text-white uppercase bg-black/70 px-3 py-1 rounded-full border border-white/20">
                        Ver Ficha Técnica Completa →
                      </span>
                    </div>
                  </div>

                  {/* Highlights Bullet List */}
                  <ul className="space-y-2.5 mb-6 text-xs text-neutral-300">
                    {cam.keyFeatures.slice(0, 5).map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2">
                        <CheckCircle2 size={14} className="text-amber-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Footer / Pricing */}
                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-baseline justify-between mb-3">
                    <div>
                      <span className="text-[10px] text-neutral-500 line-through font-mono block">
                        Precio Regular: ${calculateRegularPrice(cam.priceBase)} USD
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black font-heading text-amber-300">
                          ${cam.priceBase.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-neutral-400 font-mono">USD</span>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono px-2 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold">
                      Garantía 2 Años ✓
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSelectedProduct(cam)}
                      className="w-full py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/15 border border-white/15 text-white text-[11px] font-bold uppercase font-heading transition-all text-center"
                    >
                      Detalles
                    </button>

                    <a
                      href={getWhatsAppLink(cam)}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black text-[11px] font-black uppercase font-heading transition-all text-center shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1"
                    >
                      <span>Pedir</span>
                      <ArrowRight size={12} />
                    </a>
                  </div>
                </div>

              </motion.div>
            )
          })}
        </div>

      </section>

      {/* ═══════════ DETAILED COMPARISON TABLE ═══════════ */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-[#100E17] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
          
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Cpu size={20} />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black font-heading uppercase text-white">
                Tabla Comparativa de Especificaciones Técnicas
              </h3>
              <p className="text-xs text-neutral-400">
                Detalle comparativo entre los modelos Básica 3MP, Avanzada 3K y Premium 4K
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/15 text-neutral-400 font-mono uppercase text-[10px]">
                  <th className="pb-3 pr-4 font-bold">Característica</th>
                  <th className="pb-3 px-4 font-bold text-white">BÁSICA (3MP)</th>
                  <th className="pb-3 px-4 font-bold text-white">AVANZADA (3K)</th>
                  <th className="pb-3 pl-4 font-bold text-amber-400">PREMIUM (4K) ⭐</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] text-neutral-300">
                <tr>
                  <td className="py-3.5 pr-4 font-bold text-white">Resolución de Video</td>
                  <td className="py-3.5 px-4 font-mono">3MP (2304 × 1296)</td>
                  <td className="py-3.5 px-4 font-mono">3K (2880 × 1620)</td>
                  <td className="py-3.5 pl-4 font-mono font-bold text-amber-300">4K Ultra HD (3840 × 2160)</td>
                </tr>
                <tr>
                  <td className="py-3.5 pr-4 font-bold text-white">Tipo de Visión Nocturna</td>
                  <td className="py-3.5 px-4">Infrarroja Inteligente (10m)</td>
                  <td className="py-3.5 px-4 text-emerald-300">Full-Color Nocturno LED</td>
                  <td className="py-3.5 pl-4 font-bold text-emerald-400">Starlight 4K a Todo Color</td>
                </tr>
                <tr>
                  <td className="py-3.5 pr-4 font-bold text-white">Inteligencia Artificial</td>
                  <td className="py-3.5 px-4">Detección de Movimiento</td>
                  <td className="py-3.5 px-4">Detección Inteligente</td>
                  <td className="py-3.5 pl-4 font-bold text-amber-300">Chip IA (Humanos + Mascotas)</td>
                </tr>
                <tr>
                  <td className="py-3.5 pr-4 font-bold text-white">Seguimiento Motorizado</td>
                  <td className="py-3.5 px-4">360° Autotracking</td>
                  <td className="py-3.5 px-4">360° Suave</td>
                  <td className="py-3.5 pl-4 font-bold text-white">360° con Zoom Dinámico IA</td>
                </tr>
                <tr>
                  <td className="py-3.5 pr-4 font-bold text-white">Audio Bidireccional</td>
                  <td className="py-3.5 px-4">Estándar (Habla y Escucha)</td>
                  <td className="py-3.5 px-4">Con Cancelación de Ruido</td>
                  <td className="py-3.5 pl-4 font-bold text-white">Micrófono Dual HQ + Altavoz Potente</td>
                </tr>
                <tr>
                  <td className="py-3.5 pr-4 font-bold text-white">Modo de Privacidad</td>
                  <td className="py-3.5 px-4">Suspensión por App</td>
                  <td className="py-3.5 px-4">Suspensión por App</td>
                  <td className="py-3.5 pl-4 font-bold text-amber-300">Obturador Físico Motorizado</td>
                </tr>
                <tr>
                  <td className="py-3.5 pr-4 font-bold text-white">Almacenamiento Local</td>
                  <td className="py-3.5 px-4">MicroSD hasta 512GB</td>
                  <td className="py-3.5 px-4">MicroSD hasta 512GB</td>
                  <td className="py-3.5 pl-4 font-bold text-white">MicroSD hasta 512GB + Cloud</td>
                </tr>
                <tr>
                  <td className="py-3.5 pr-4 font-bold text-white">Garantía Directa</td>
                  <td className="py-3.5 px-4 text-emerald-400 font-bold">2 Años Oficial</td>
                  <td className="py-3.5 px-4 text-emerald-400 font-bold">2 Años Oficial</td>
                  <td className="py-3.5 pl-4 text-emerald-400 font-bold">2 Años Oficial</td>
                </tr>
                <tr>
                  <td className="py-3.5 pr-4 font-bold text-white">Precio Promocional</td>
                  <td className="py-3.5 px-4 font-heading font-black text-base text-white">$44.99 USD</td>
                  <td className="py-3.5 px-4 font-heading font-black text-base text-white">$64.99 USD</td>
                  <td className="py-3.5 pl-4 font-heading font-black text-xl text-amber-300">$78.99 USD</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </section>

      {/* ═══════════ PROVINCE INSTALLATION CALCULATOR ═══════════ */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-gradient-to-r from-[#12101A] via-[#161422] to-[#12101A] border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Compass size={20} />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black font-heading uppercase text-white">
                  Calculadora de Instalación & Despacho por Provincia
                </h3>
                <p className="text-xs text-neutral-400">
                  Selecciona tu provincia para cotizar con servicio de montaje técnico o envío gratuito
                </p>
              </div>
            </div>

            <div className={`px-3 py-1 rounded-full border text-xs font-extrabold uppercase font-mono ${selectedProvince.badgeColor}`}>
              {selectedProvince.icon} {selectedProvince.region}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-6 items-center">
            <div>
              <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
                📍 Selecciona tu Provincia / Cantón:
              </label>
              <select
                value={selectedProvinceId}
                onChange={(e) => setSelectedProvinceId(e.target.value)}
                className="w-full bg-[#0A0910] border border-white/20 hover:border-amber-400 focus:border-amber-400 rounded-xl px-4 py-3 text-xs font-bold text-white outline-none cursor-pointer transition-all shadow-inner"
              >
                {PROVINCES_DATA.map((prov) => (
                  <option key={prov.id} value={prov.id} className="bg-[#0e0d16] text-white">
                    {prov.icon} {prov.name} — ${prov.cost} USD Instalación
                  </option>
                ))}
              </select>
            </div>

            {/* Mode toggle: With Installation vs Self-Install */}
            <div className="bg-[#090810] border border-white/10 rounded-2xl p-4 flex flex-col justify-between gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Opción de Instalación Técnica:</span>
                <button
                  onClick={() => setIncludeInstallation(!includeInstallation)}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold font-heading uppercase transition-all ${
                    includeInstallation
                      ? "bg-emerald-500 text-black shadow-md"
                      : "bg-white/10 text-neutral-300"
                  }`}
                >
                  {includeInstallation ? "✓ Con Instalación" : "Solo Producto"}
                </button>
              </div>

              <div className="text-xs text-neutral-400">
                {includeInstallation ? (
                  <span className="text-emerald-400 font-bold">
                    +${selectedProvince.cost}.00 USD (Técnicos locales en {selectedProvince.name.split(" ")[0]})
                  </span>
                ) : (
                  <span className="text-blue-400 font-bold">
                    +$0.00 USD (Envío Nacional Sin Recargo - Plug & Play)
                  </span>
                )}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ═══════════ FAQS SECTION ═══════════ */}
      <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[11px] font-bold text-neutral-300 mb-2">
            <HelpCircle size={13} className="text-amber-400" />
            <span className="font-heading uppercase tracking-wider">PREGUNTAS FRECUENTES</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-heading">
            Dudas Comunes sobre las Cámaras para Hogar
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS_DATA.map((faq, idx) => {
            const isOpen = expandedFaq === idx
            return (
              <div
                key={idx}
                className="bg-[#100E17] border border-white/[0.08] rounded-2xl overflow-hidden transition-all shadow-md"
              >
                <button
                  onClick={() => setExpandedFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-white hover:text-amber-300 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 text-amber-400 shrink-0 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-4 pb-4 text-xs text-neutral-300 leading-relaxed border-t border-white/[0.06] pt-3"
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

      {/* ═══════════ MODAL FOR DETAILED PRODUCT VIEW ═══════════ */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#121018] border border-amber-500/40 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 relative shadow-2xl"
            >
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white transition-all"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono font-bold text-[10px] uppercase">
                  {selectedProduct.badge}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono font-bold text-[10px] uppercase">
                  Garantía 2 Años
                </span>
              </div>

              <h2 className="text-2xl font-black font-heading text-white uppercase mb-1">
                {selectedProduct.name}
              </h2>
              <p className="text-xs text-amber-400 font-mono mb-4">{selectedProduct.resolution}</p>

              <div className="w-full h-72 rounded-2xl overflow-hidden bg-black/60 border border-white/10 mb-5 flex items-center justify-center">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-contain p-2"
                />
              </div>

              <p className="text-xs text-neutral-300 leading-relaxed mb-5">
                {selectedProduct.fullOverview}
              </p>

              <h4 className="text-xs font-black font-heading uppercase text-white mb-3">
                Especificaciones Técnicas Detalladas:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6 text-xs">
                {selectedProduct.specsTable.map((spec, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex flex-col justify-between"
                  >
                    <span className="text-[10px] font-mono text-neutral-400 uppercase">{spec.label}</span>
                    <span className="font-bold text-white mt-0.5">{spec.value}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/[0.08] border border-amber-500/25 flex items-center justify-between mb-5">
                <div>
                  <span className="text-[10px] text-neutral-400 font-mono uppercase block">Precio Promocional:</span>
                  <span className="text-2xl font-black font-heading text-amber-300">
                    ${selectedProduct.priceBase.toFixed(2)} USD
                  </span>
                </div>

                <a
                  href={getWhatsAppLink(selectedProduct)}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-3 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-black font-heading uppercase tracking-wider text-xs shadow-lg flex items-center gap-1.5"
                >
                  <span>Pedir por WhatsApp</span>
                  <ArrowRight size={14} />
                </a>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="w-full bg-[#050508] border-t border-white/[0.08] py-8 px-4 sm:px-6 text-center text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} ATOMIC INDUSTRIAS // División de Seguridad Residencial y Cámaras Wi-Fi.</p>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <Link href="/web/cerraduras-smart" className="hover:text-white transition-colors">Cerraduras Smart</Link>
            <Link href="/web" className="hover:text-white transition-colors">Tienda Principal</Link>
            <Link href="/web/cocinas" className="hover:text-white transition-colors">Línea Hogar</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
