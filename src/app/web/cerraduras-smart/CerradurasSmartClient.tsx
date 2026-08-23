"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Shield,
  Key,
  Fingerprint,
  Smartphone,
  Wifi,
  Eye,
  Camera,
  CheckCircle2,
  MapPin,
  Users,
  Wrench,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Star,
  Zap,
  Phone,
  MessageCircle,
  HelpCircle,
  Award,
  Layers,
  Clock,
  ArrowRight,
  X,
  Plus,
  Compass,
  Building,
  Home,
  Check,
  Cpu
} from "lucide-react"

// ═══════════════════════════════════════════════════════════════════════════
// PROVINCES & REGIONAL INSTALLATION COSTS DATA (ECUADOR)
// ═══════════════════════════════════════════════════════════════════════════
interface ProvinceData {
  id: string
  name: string
  region: "Quito Metropolitano" | "Sierra" | "Costa" | "Oriente / Amazonía" | "Galápagos"
  cost: number
  icon: string
  badgeColor: string
}

const PROVINCES_DATA: ProvinceData[] = [
  { id: "quito", name: "Quito (DMQ / Valles / Cumbayá / Chillos)", region: "Quito Metropolitano", cost: 45, icon: "🏙️", badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
  { id: "pichincha_resto", name: "Pichincha (Rumiñahui, Mejía, Cayambe)", region: "Sierra", cost: 55, icon: "🏔️", badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30" },
  { id: "azuay", name: "Azuay (Cuenca, Gualaceo, Paute)", region: "Sierra", cost: 55, icon: "🏔️", badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30" },
  { id: "bolivar", name: "Bolívar (Guaranda, San Miguel)", region: "Sierra", cost: 55, icon: "🏔️", badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30" },
  { id: "canar", name: "Cañar (Azogues, La Troncal, Cañar)", region: "Sierra", cost: 55, icon: "🏔️", badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30" },
  { id: "carchi", name: "Carchi (Tulcán, San Gabriel)", region: "Sierra", cost: 55, icon: "🏔️", badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30" },
  { id: "chimborazo", name: "Chimborazo (Riobamba, Guano, Alausí)", region: "Sierra", cost: 55, icon: "🏔️", badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30" },
  { id: "cotopaxi", name: "Cotopaxi (Latacunga, Salcedo, La Maná)", region: "Sierra", cost: 55, icon: "🏔️", badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30" },
  { id: "imbabura", name: "Imbabura (Ibarra, Otavalo, Cotacachi)", region: "Sierra", cost: 55, icon: "🏔️", badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30" },
  { id: "loja", name: "Loja (Loja, Catamayo, Cariamanga)", region: "Sierra", cost: 55, icon: "🏔️", badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30" },
  { id: "tungurahua", name: "Tungurahua (Ambato, Baños, Pelileo)", region: "Sierra", cost: 55, icon: "🏔️", badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30" },
  { id: "guayas", name: "Guayas (Guayaquil, Samborondón, Daule, Durán)", region: "Costa", cost: 65, icon: "🏖️", badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
  { id: "manabi", name: "Manabí (Manta, Portoviejo, Chone, Bahía)", region: "Costa", cost: 65, icon: "🏖️", badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
  { id: "el_oro", name: "El Oro (Machala, Pasaje, Santa Rosa)", region: "Costa", cost: 65, icon: "🏖️", badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
  { id: "esmeraldas", name: "Esmeraldas (Esmeraldas, Atacames, Tonsupa)", region: "Costa", cost: 65, icon: "🏖️", badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
  { id: "los_rios", name: "Los Ríos (Babahoyo, Quevedo, Ventanas)", region: "Costa", cost: 65, icon: "🏖️", badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
  { id: "santa_elena", name: "Santa Elena (Salinas, La Libertad, Montañita)", region: "Costa", cost: 65, icon: "🏖️", badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
  { id: "santo_domingo", name: "Santo Domingo (Santo Domingo de los Tsáchilas)", region: "Costa", cost: 65, icon: "🏖️", badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
  { id: "morona", name: "Morona Santiago (Macas, Sucúa)", region: "Oriente / Amazonía", cost: 75, icon: "🌳", badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
  { id: "napo", name: "Napo (Tena, Archidona)", region: "Oriente / Amazonía", cost: 75, icon: "🌳", badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
  { id: "orellana", name: "Orellana (El Coca / Francisco de Orellana)", region: "Oriente / Amazonía", cost: 75, icon: "🌳", badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
  { id: "pastaza", name: "Pastaza (Puyo, Mera)", region: "Oriente / Amazonía", cost: 75, icon: "🌳", badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
  { id: "sucumbios", name: "Sucumbíos (Lago Agrio / Nueva Loja)", region: "Oriente / Amazonía", cost: 75, icon: "🌳", badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
  { id: "zamora", name: "Zamora Chinchipe (Zamora, Yantzaza)", region: "Oriente / Amazonía", cost: 75, icon: "🌳", badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
  { id: "galapagos", name: "Galápagos (Santa Cruz, San Cristóbal, Isabela)", region: "Galápagos", cost: 95, icon: "🐢", badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30" },
]

// ═══════════════════════════════════════════════════════════════════════════
// SMART LOCK PRODUCTS & KITS DATA
// ═══════════════════════════════════════════════════════════════════════════
interface SmartLockProduct {
  id: string
  name: string
  versionTag: string
  badge: string
  category: "facial" | "manija" | "airbnb" | "edificios"
  image: string
  priceBase: number
  highlights: string[]
  methods: string[]
  differentiator: string
  description: string
  popular?: boolean
}

const SMART_LOCK_KITS: SmartLockProduct[] = [
  {
    id: "lock-facial-3d",
    name: "Cerradura Smart Biometría Facial 3D & Mirilla Cámara LCD Tuya Pro",
    versionTag: "Edición Flagship 2026 // Facial 3D + Pantalla HD",
    badge: "⭐ TOP DE GAMA",
    category: "facial",
    image: "/categories/cerraduras-smart-y-accesos.png",
    priceBase: 149.99,
    highlights: [
      "Reconocimiento Facial 3D estructurado en luz infrarroja (día y noche)",
      "Mirilla con cámara gran angular y pantalla LCD HD de 3.5 pulgadas",
      "Apertura remota desde celular al timbrar con captura fotográfica",
      "Batería recargable de litio 4200 mAh + llave de emergencia oculta",
      "Compatible con puertas de madera, metal y blindadas (38mm - 100mm)"
    ],
    methods: ["Facial 3D", "Huella 360°", "App Tuya/SmartLife", "Clave PIN Antiespía", "Tarjeta RFID", "Llave Mecánica"],
    differentiator: "Máximo nivel de lujo y comodidad: se abre automáticamente al detectar tu rostro sin tocar la cerradura.",
    description: "Nuestra cerradura inteligente más avanzada. Equipada con sensores biométricos 3D infrarrojos que reconocen tu rostro en 0.4s incluso en oscuridad absoluta. La mirilla integrada envía fotos en tiempo real a tu smartphone cuando alguien toca el timbre.",
    popular: true
  },
  {
    id: "lock-quantum-pro",
    name: "Cerradura Electrónica Premium Quantum Lock Biometría & Bluetooth Gateway",
    versionTag: "Versión Biométrica Semiconductores // WiFi & Bluetooth",
    badge: "🔥 MÁS VENDIDO",
    category: "manija",
    image: "/banners/smart_doorbell.png",
    priceBase: 109.99,
    highlights: [
      "Lector de huella digital integrado ergonomicamente en la manija",
      "Cuerpo de aleación de zinc de alta resistencia antivandálica",
      "Generación de contraseñas temporales y dinámicas por app",
      "Historial de aperturas y accesos en tiempo real con nombres de usuario",
      "Alarma acústica ante intentos forzados o contraseñas erróneas"
    ],
    methods: ["Huella Ergonómica", "App Móvil", "Contraseña Táctil", "2 Tarjetas RFID", "Llaves Físicas"],
    differentiator: "Apertura en un solo movimiento: pon el pulgar en la manija y empuja suavemente para entrar.",
    description: "Diseñada para residencias y departamentos que buscan elegancia minimalista y robustez. Su sensor de huella dactilar semiconductor de grado bancario previene réplicas y garantiza lectura instantánea en 0.3 segundos.",
    popular: true
  },
  {
    id: "lock-plasma-lock",
    name: "Cerradura Electrónica Plasma Lock Manija Digital Inteligente",
    versionTag: "Versión Manija Digital Multi-Acceso 5 en 1",
    badge: "⚡ EXCELENTE RELACIÓN CALIDAD/PRECIO",
    category: "manija",
    image: "/categories/cerraduras-smart-y-accesos.png",
    priceBase: 87.99,
    highlights: [
      "5 Métodos de apertura simultáneos para toda la familia",
      "Teclado táctil retroiluminado con función de código señuelo antiespía",
      "Bloqueo de privacidad interno (no permite apertura desde afuera)",
      "Puerto de alimentación de emergencia Type-C ante batería baja",
      "Instalación reversible (apertura izquierda o derecha)"
    ],
    methods: ["Huella Digital", "Clave Numérica", "Tarjeta IC M1", "App Tuya", "Llave Mecánica"],
    differentiator: "Ideal para renovar cerraduras convencionales de pomo o manija sin modificar la puerta.",
    description: "Transforma tu puerta tradicional en un acceso inteligente blindado. Soporta hasta 100 huellas y 100 tarjetas RFID. Baterías con autonomía de hasta 12 meses con aviso de batería baja con 200 aperturas de anticipación."
  },
  {
    id: "lock-voltex-lock",
    name: "Cerradura Voltex Lock Smart WiFi para Interiores & Departamentos",
    versionTag: "Versión Slimline // Aluminio Aeroespacial",
    badge: "🏠 IDEAL DEPARTAMENTOS",
    category: "airbnb",
    image: "/banners/smart.jpeg",
    priceBase: 76.99,
    highlights: [
      "Perfil estilizado extra delgado para diseño moderno y departamentos",
      "Conexión WiFi directa sin necesidad de gateways adicionales",
      "Códigos de un solo uso para personal de limpieza o entregas",
      "Resistencia a cambios de temperatura e intemperie ligera IP54",
      "Cilindro de seguridad de grado C antibumping"
    ],
    methods: ["Huella 360°", "Clave Virtual", "Tuya Smart", "Tarjetas Proximidad", "Llaves"],
    differentiator: "Diseño ultra moderno que combina con acabados de madera fina y puertas contemporáneas.",
    description: "Compacta, segura y fácil de administrar. Permite compartir llaves electrónicas virtuales temporales a visitas o familiares desde la app en cualquier momento sin importar dónde estés."
  },
  {
    id: "lock-dl04-airbnb",
    name: "Cerradura Inteligente DL04 Teclado Táctil, WiFi, Bluetooth & RFID",
    versionTag: "Versión Especial Airbnb, Hoteles & Rentas Cortas",
    badge: "💎 AIRBNB READY",
    category: "airbnb",
    image: "/categories/cerraduras-smart-y-accesos.png",
    priceBase: 59.99,
    highlights: [
      "Configuración de contraseñas con fecha y hora de inicio y fin para huéspedes",
      "Check-in y check-out 100% automatizado y remoto sin entregar llaves físicas",
      "Registro detallado de ingresos y salidas en tu teléfono móvil",
      "Compatibilidad total con cerraduras tubulares estándar",
      "Carcasa sellada a prueba de polvo y humedad"
    ],
    methods: ["Códigos con Horario", "Bluetooth / WiFi", "Tarjeta RFID", "Llave de Respaldo"],
    differentiator: "La herramienta perfecta para anfitriones de Airbnb: tus huéspedes reciben su código y tú te liberas de citas presenciales.",
    description: "Optimiza la gestión de tus departamentos de renta. Envía el código de acceso a tus huéspedes por WhatsApp con caducidad automática al finalizar su estancia. Ahorra tiempo y brinda máxima seguridad."
  },
  {
    id: "combo-acceso-edificio",
    name: "Combo Seguridad Acceso Edificios & Conjuntos Senseface 2A + Electroimán 600 Lbs",
    versionTag: "Kit Comunitario // Portones, Edificios & Oficinas",
    badge: "🏢 CONJUNTOS & EDIFICIOS",
    category: "edificios",
    image: "/images/seguridad/zkteco-kit-acceso.jpg",
    priceBase: 222.00,
    highlights: [
      "Terminal multibiométrica ZKTeco Senseface 2A (Rostros, Huellas, Tarjetas)",
      "Cerradura electromagnética de 600 Lbs de fuerza de sujeción",
      "Videollamada directa a smartphones de copropietarios o recepcionistas",
      "Capacidad para más de 1,500 usuarios y control de apertura vehicular/peatonal",
      "Incluye pulsador de salida sin contacto 'No Touch' + Fuente de poder con respaldo"
    ],
    methods: ["Reconocimiento Facial", "Huella Dactilar", "Tarjeta RFID", "Videollamada por App", "Pulsador No Touch"],
    differentiator: "Sistema integral para copropiedades: elimina duplicados de llaves y controla el acceso vehicular o peatonal.",
    description: "Solución profesional de control de accesos para conjuntos residenciales, urbanizaciones cerradas, edificios y sedes corporativas. Garantiza seguridad absoluta con reporte de ingresos auditable."
  }
]

export default function CerradurasSmartClient() {
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>("quito")
  const [activeCategory, setActiveCategory] = useState<string>("todos")
  const [modalProduct, setModalProduct] = useState<SmartLockProduct | null>(null)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  // Current selected province object
  const selectedProvince = useMemo(() => {
    return PROVINCES_DATA.find((p) => p.id === selectedProvinceId) || PROVINCES_DATA[0]
  }, [selectedProvinceId])

  // Filtered products
  const filteredProducts = useMemo(() => {
    if (activeCategory === "todos") return SMART_LOCK_KITS
    return SMART_LOCK_KITS.filter((p) => p.category === activeCategory)
  }, [activeCategory])

  // Helper to calculate total installed price
  const calculateTotal = (basePrice: number, installCost: number) => {
    return (basePrice + installCost).toFixed(2)
  }

  // Fictitious regular prices before 30% promo discount
  const calculateRegularProductPrice = (basePrice: number) => {
    return (basePrice / 0.70).toFixed(2)
  }

  const calculateRegularInstalledPrice = (basePrice: number, installCost: number) => {
    return ((basePrice + installCost) / 0.70).toFixed(2)
  }

  const calculateSavings = (basePrice: number, installCost: number) => {
    const regular = (basePrice + installCost) / 0.70
    const current = basePrice + installCost
    return (regular - current).toFixed(2)
  }

  // Generate dynamic WhatsApp URL
  const getWhatsAppUrl = (product: SmartLockProduct, province: ProvinceData) => {
    const total = calculateTotal(product.priceBase, province.cost)
    const text = encodeURIComponent(
      `¡Hola ATOMIC! 👋 Deseo solicitar el KIT CON INSTALACIÓN de la cerradura inteligente:\n\n` +
      `🔒 Producto: ${product.name}\n` +
      `🏷️ Versión: ${product.versionTag}\n` +
      `📍 Provincia / Ciudad: ${province.name}\n` +
      `🌎 Región: ${province.region}\n` +
      `💵 Precio Producto: $${product.priceBase.toFixed(2)}\n` +
      `🛠️ Instalación Profesional: $${province.cost.toFixed(2)}\n` +
      `💰 TOTAL ESTIMADO: $${total} USD\n\n` +
      `Por favor indíquenme disponibilidad y agendamiento de técnico certificado en mi zona. ¡Gracias!`
    )
    return `https://wa.me/593969043453?text=${text}`
  }

  return (
    <div className="w-full bg-[#07070A] min-h-screen text-white font-sans selection:bg-blue-500/30 selection:text-white overflow-x-hidden">
      
      {/* ═══════════ STICKY TOP BAR: PRODUCTOS 100% ORIGINALES & GARANTÍA ═══════════ */}
      <div className="sticky top-0 z-50 w-full bg-[#050507]/95 backdrop-blur-xl border-b border-emerald-500/20 py-1.5 px-4 text-center shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)] shrink-0" />
          <span className="text-emerald-400 font-extrabold font-heading text-[10px] sm:text-[11px] uppercase tracking-widest">
            PRODUCTOS 100% ORIGINALES & GARANTÍA DE INSTALACIÓN
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)] shrink-0" />
        </div>
      </div>

      {/* ═══════════ MAIN NAVIGATION BAR ═══════════ */}
      <header className="w-full bg-[#09090C]/90 backdrop-blur-2xl border-b border-white/[0.08] py-3.5 px-4 sm:px-6 sticky top-[29px] z-40 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* LEFT: BACK TO STORE & LOGO */}
          <div className="flex items-center gap-3">
            <Link
              href="/web"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/15 border border-white/10 text-xs font-bold text-neutral-300 hover:text-white transition-all group"
            >
              <ChevronLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
              <span>VOLVER A LA TIENDA</span>
            </Link>

            <div className="h-5 w-[1px] bg-white/10 hidden sm:block" />

            <div className="hidden sm:flex items-center gap-2 text-xs font-heading font-black tracking-wider">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-white">CERRADURAS SMART</span>
              <span className="text-blue-400 font-mono text-[10px] bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">KITS + INSTALACIÓN</span>
            </div>
          </div>

          {/* RIGHT: PROVINCE SELECTOR & WHATSAPP BUTTON */}
          <div className="flex items-center gap-2.5">
            {/* QUICK PROVINCE SELECTOR DROPDOWN IN HEADER */}
            <div className="flex items-center gap-2 bg-[#121118] border border-white/15 rounded-full px-3 py-1 text-xs">
              <MapPin size={13} className="text-blue-400 shrink-0" />
              <select
                value={selectedProvinceId}
                onChange={(e) => setSelectedProvinceId(e.target.value)}
                className="bg-transparent text-white text-[11px] font-bold outline-none cursor-pointer pr-1"
                title="Selecciona tu provincia para calcular la instalación"
              >
                {PROVINCES_DATA.map((prov) => (
                  <option key={prov.id} value={prov.id} className="bg-[#0e0e12] text-white">
                    {prov.icon} {prov.name} (+${prov.cost})
                  </option>
                ))}
              </select>
            </div>

            {/* ASESORÍA WHATSAPP (GOLD THIN CONTOUR) */}
            <a
              href="https://wa.me/593969043453?text=Hola%20ATOMIC!%20Deseo%20informaci%C3%B3n%20y%20asesor%C3%ADa%20sobre%20Cerraduras%20Smart%20con%20Instalaci%C3%B3n."
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-1.5 rounded-full border border-amber-400/50 hover:border-amber-400 bg-amber-500/[0.08] hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 font-bold font-heading uppercase tracking-wider text-[11px] shadow-[0_0_12px_rgba(245,158,11,0.18)] transition-all flex items-center gap-1.5 shrink-0"
              title="Asesoría Instantánea WhatsApp"
            >
              <span>ASESORÍA</span>
              <span className="text-amber-400">→</span>
            </a>
          </div>

        </div>
      </header>

      {/* ═══════════ HERO SECTION: KITS CON INSTALACIÓN PROFESIONAL ═══════════ */}
      <section className="relative w-full pt-12 pb-16 px-4 sm:px-6 overflow-hidden bg-gradient-to-b from-[#0B0B10] via-[#07070A] to-[#07070A]">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-blue-600/15 via-indigo-600/5 to-transparent blur-[110px] pointer-events-none" />
        <div className="absolute -top-10 right-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 text-center">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-wider mb-5 shadow-[0_0_20px_rgba(59,130,246,0.2)]"
          >
            <Wrench size={13} className="text-blue-400 animate-spin" style={{ animationDuration: "6s" }} />
            <span>KITS DE SEGURIDAD SMART CON INSTALACIÓN INCLUIDA A DOMICILIO</span>
            <Sparkles size={13} className="text-amber-300" />
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-black font-heading uppercase tracking-tight text-white max-w-4xl mx-auto leading-tight"
          >
            Cerraduras Inteligentes <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400">
              Con Instalación Profesional
            </span>
          </motion.h1>

          {/* Intro Explanation */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-5 text-sm sm:text-base text-neutral-300 max-w-3xl mx-auto leading-relaxed font-normal"
          >
            Las siguientes promociones son <strong>Kits Integrales con Instalación Certificada Incluida</strong>. Olvídate de buscar cerrajeros inexpertos: nosotros suministramos la cerradura inteligente original, la adaptamos a tu puerta de madera, metal o blindada, configuramos la app en tu teléfono y te dejamos el sistema 100% operativo con 1 año de garantía escrita.
          </motion.p>

          {/* ═══════════ PROVINCE SELECTOR HERO BANNER (REAL-TIME REGION CALCULATOR) ═══════════ */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 max-w-3xl mx-auto bg-gradient-to-r from-[#121118] via-[#161520] to-[#121118] border border-blue-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl shadow-blue-500/10 text-left relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)] shrink-0">
                  <Compass size={20} />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-white uppercase font-heading">
                    Calculadora de Instalación por Provincia
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    Selecciona dónde te encuentras para ver los precios exactos con mano de obra y viáticos
                  </p>
                </div>
              </div>

              {/* Current Region Tag */}
              <div className={`px-3 py-1 rounded-full border text-[11px] font-extrabold uppercase tracking-wider shrink-0 ${selectedProvince.badgeColor}`}>
                {selectedProvince.icon} {selectedProvince.region}
              </div>
            </div>

            {/* Selector Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-1 items-center">
              <div>
                <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                  📍 Tu Provincia / Cantón:
                </label>
                <div className="relative">
                  <select
                    value={selectedProvinceId}
                    onChange={(e) => setSelectedProvinceId(e.target.value)}
                    className="w-full bg-[#09080E] border border-white/20 hover:border-blue-400 focus:border-blue-400 rounded-xl px-3.5 py-2.5 text-xs font-bold text-white outline-none cursor-pointer transition-all shadow-inner"
                  >
                    {PROVINCES_DATA.map((prov) => (
                      <option key={prov.id} value={prov.id} className="bg-[#0c0b12] text-white">
                        {prov.icon} {prov.name} — ${prov.cost} USD
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pricing Rate Breakdown Box */}
              <div className="bg-[#08070C]/80 border border-white/10 rounded-2xl p-3.5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">Costo Instalación en {selectedProvince.name.split(' ')[0]}</span>
                  <span className="text-xl font-black text-emerald-400 font-heading">
                    +${selectedProvince.cost}.00 USD
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-neutral-400 block font-mono">Técnicos Locales</span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-400">
                    <CheckCircle2 size={12} className="text-emerald-400" /> Vía Red ATOMIC
                  </span>
                </div>
              </div>
            </div>

            {/* Regional Rates Summary Pills */}
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-white/[0.06] text-[10px] font-mono text-neutral-400">
              <span className="text-neutral-500 uppercase font-bold">Tarifas Oficiales:</span>
              <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-300">🏙️ Quito: $45</span>
              <span className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">🏔️ Sierra: $55</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">🏖️ Costa: $65</span>
              <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300">🌳 Oriente: $75</span>
              <span className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-300">🐢 Galápagos: $95</span>
            </div>

          </motion.div>

        </div>
      </section>

      {/* ═══════════ RED NACIONAL DE TÉCNICOS & ESTÁNDARES DE CALIDAD (TRUST BANNER) ═══════════ */}
      <section className="w-full bg-[#0D0C14] border-y border-white/[0.08] py-10 px-4 sm:px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Col: Info & Explanation */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-heading uppercase tracking-wider">
                <Shield size={13} />
                <span>COBERTURA TOTAL & RED DE CONFIANZA</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black font-heading uppercase tracking-tight text-white">
                ¿Cómo Garantizamos Tu Instalación en Cualquier Ciudad?
              </h2>

              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                En <strong>ATOMIC</strong> contamos con una <strong>comunidad técnica activa y organizada a través de grupos profesionales en redes sociales</strong>, integrada por especialistas certificados en cerrajería digital, domótica y seguridad electrónica en las 24 provincias del Ecuador.
              </p>

              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                Nos comunicamos activamente en tiempo real, referimos y repartimos trabajo siguiendo <strong>estrictos estándares de homologación, calidad, puntualidad y confiabilidad</strong>. Al adquirir tu kit en cualquier ciudad, coordinamos y despachamos de inmediato a un técnico calificado de tu localidad para efectuar el montaje impecable de tu cerradura.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="bg-[#15141E] border border-white/10 rounded-2xl p-3">
                  <div className="text-emerald-400 font-black text-lg font-heading">+120</div>
                  <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Técnicos Homologados</div>
                </div>
                <div className="bg-[#15141E] border border-white/10 rounded-2xl p-3">
                  <div className="text-blue-400 font-black text-lg font-heading">24 Provincias</div>
                  <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Cobertura Nacional</div>
                </div>
                <div className="bg-[#15141E] border border-white/10 rounded-2xl p-3 col-span-2 sm:col-span-1">
                  <div className="text-amber-400 font-black text-lg font-heading">1 Año</div>
                  <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Garantía Escrita</div>
                </div>
              </div>
            </div>

            {/* Right Col: Pillars */}
            <div className="lg:col-span-5 bg-[#121118] border border-white/10 rounded-3xl p-6 space-y-4 shadow-2xl">
              <h3 className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest border-b border-white/10 pb-2">
                ESTÁNDARES DEL SERVICIO DE INSTALACIÓN
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                    <Check size={13} />
                  </div>
                  <div>
                    <strong className="text-white font-bold block">Calibración y Perforación Milimétrica</strong>
                    <span className="text-neutral-400 text-[11px]">Adaptación perfecta del pestillo y mortise sin dañar el marco ni el acabado de tu puerta.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                    <Check size={13} />
                  </div>
                  <div>
                    <strong className="text-white font-bold block">Configuración de App & Huellas</strong>
                    <span className="text-neutral-400 text-[11px]">Enrolamiento de usuarios, contraseñas, tarjetas y vinculación a tu red Wi-Fi Tuya o SmartLife.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                    <Check size={13} />
                  </div>
                  <div>
                    <strong className="text-white font-bold block">Capacitación y Pruebas Reales</strong>
                    <span className="text-neutral-400 text-[11px]">Te enseñamos a crear códigos para visitas, cambiar baterías y activar el bloqueo antiespía.</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="https://wa.me/593969043453?text=Hola%20ATOMIC!%20Quiero%20conocer%20m%C3%A1s%20sobre%20la%20red%20de%20t%C3%A9cnicos%20para%20mi%20ciudad."
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold text-center flex items-center justify-center gap-2 transition-all"
                >
                  <MessageCircle size={14} className="text-emerald-400" />
                  <span>Consultar Técnico en Mi Zona</span>
                </a>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ═══════════ CATEGORY FILTER PILLS ═══════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-4">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#14131C] border border-white/10 text-xs font-bold text-neutral-300 mb-2">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span className="font-heading uppercase tracking-wider text-[11px]">CATÁLOGO DE KITS SMART</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-heading uppercase text-white tracking-tight">
              Modelos y Versiones Disponibles
            </h2>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#121118] p-1.5 rounded-2xl border border-white/10 shadow-inner">
            {[
              { id: "todos", label: "TODOS LOS KITS" },
              { id: "facial", label: "FACIAL 3D & MIRILLA" },
              { id: "manija", label: "MANIJAS CON HUELLA" },
              { id: "airbnb", label: "AIRBNB & RENTAS" },
              { id: "edificios", label: "EDIFICIOS & ACCESOS" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-heading uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  activeCategory === tab.id
                    ? "bg-white text-black shadow-lg shadow-white/20 font-black scale-105"
                    : "text-neutral-400 hover:text-white hover:bg-white/[0.06]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Province Banner Alert */}
        <div className="mb-8 p-3.5 rounded-2xl bg-blue-950/30 border border-blue-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="text-lg">{selectedProvince.icon}</span>
            <div>
              <span className="text-neutral-300">Precios calculados con instalación para: </span>
              <strong className="text-white font-bold">{selectedProvince.name}</strong>
              <span className="text-blue-400 font-mono ml-2">(+${selectedProvince.cost} USD mano de obra y viáticos)</span>
            </div>
          </div>

          <button
            onClick={() => {
              const selectEl = document.querySelector('select')
              selectEl?.focus()
              selectEl?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="text-blue-400 hover:text-blue-300 font-bold underline cursor-pointer shrink-0"
          >
            Cambiar Provincia
          </button>
        </div>

      </section>

      {/* ═══════════ PRODUCTS & KITS GRID ═══════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map((product) => {
            const installedTotal = calculateTotal(product.priceBase, selectedProvince.cost)
            const quitoTotal = calculateTotal(product.priceBase, 45)

            return (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-[#0e0d14] border border-white/10 hover:border-blue-500/50 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 flex flex-col justify-between group hover:shadow-blue-500/10"
              >
                {/* Top Section */}
                <div>
                  {/* Image & Badges Container */}
                  <div className="relative w-full aspect-square bg-[#060608] overflow-hidden p-6 flex items-center justify-center border-b border-white/[0.06]">
                    
                    {/* Top Badges */}
                    <div className="absolute top-3.5 left-3.5 z-20 flex flex-col gap-1.5 items-start">
                      <span className="px-3 py-1 rounded-full bg-emerald-500 text-black font-black text-[10px] uppercase tracking-wider font-heading shadow-lg flex items-center gap-1">
                        <Wrench size={11} /> + INSTALACIÓN INCLUIDA
                      </span>
                      {product.badge && (
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[9px] font-extrabold uppercase tracking-widest font-heading">
                          {product.badge}
                        </span>
                      )}
                    </div>

                    {/* Product Image */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain max-h-[280px] group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Quick Differentiator Ribbon */}
                    <div className="absolute bottom-2 left-2 right-2 z-20 bg-[#12111a]/90 backdrop-blur-md border border-white/10 rounded-xl px-3 py-1.5 text-[10px] text-neutral-300 font-mono flex items-center justify-between">
                      <span className="truncate">{product.versionTag}</span>
                    </div>
                  </div>

                  {/* Content Body */}
                  <div className="p-5 sm:p-6 space-y-4">
                    
                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-black text-white font-heading uppercase leading-snug group-hover:text-blue-300 transition-colors">
                      {product.name}
                    </h3>

                    {/* Differentiator callout */}
                    <p className="text-xs text-neutral-300 italic bg-white/[0.03] p-2.5 rounded-xl border border-white/[0.06] leading-relaxed">
                      "{product.differentiator}"
                    </p>

                    {/* Access Methods Pills */}
                    <div>
                      <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block mb-1.5">
                        Métodos de Desbloqueo:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {product.methods.map((method, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/10 text-[10px] font-bold text-neutral-200"
                          >
                            {method}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Highlights List */}
                    <div className="space-y-1.5 pt-1 text-xs text-neutral-400">
                      {product.highlights.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle2 size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                          <span className="text-[11px] leading-tight text-neutral-300">{item}</span>
                        </div>
                      ))}
                    </div>

                  </div>
                </div>

                {/* Bottom Pricing & Actions */}
                <div className="p-5 sm:p-6 pt-0 border-t border-white/[0.06] bg-[#0c0b11]/50 space-y-4 mt-2">
                  
                  {/* Dual Pricing Display */}
                  <div className="pt-4 flex items-end justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[10px] text-neutral-400 font-mono uppercase tracking-wider">
                          Solo Producto
                        </span>
                        <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[9px] font-black font-mono">
                          -30%
                        </span>
                      </div>
                      <div className="text-xs font-bold text-neutral-400 line-through font-mono">
                        ${calculateRegularProductPrice(product.priceBase)} USD
                      </div>
                      <div className="text-base font-black text-neutral-200 font-heading">
                        ${product.priceBase.toFixed(2)} USD
                      </div>
                    </div>

                    {/* Highlighted Kit Installed Price */}
                    <div className="text-right">
                      <div className="flex items-center justify-end gap-1.5 mb-0.5">
                        <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase tracking-wider">
                          KIT INSTALADO EN {selectedProvince.id === "quito" ? "QUITO" : selectedProvince.name.split(' ')[0].toUpperCase()}
                        </span>
                        <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-black font-mono">
                          -30% OFF
                        </span>
                      </div>
                      <div className="text-xs font-bold text-neutral-400 line-through font-mono">
                        Antes: ${calculateRegularInstalledPrice(product.priceBase, selectedProvince.cost)} USD
                      </div>
                      <div className="text-2xl sm:text-3xl font-black text-white font-heading text-emerald-400">
                        ${installedTotal} <span className="text-xs font-mono text-neutral-300 font-normal">USD</span>
                      </div>
                      <span className="text-[9px] text-neutral-400 block font-mono">
                        (Ahorras 30%: -${calculateSavings(product.priceBase, selectedProvince.cost)} USD)
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    {/* Open Details & Province Calculator Modal */}
                    <button
                      onClick={() => setModalProduct(product)}
                      className="w-full py-2.5 px-3 rounded-2xl bg-white/[0.08] hover:bg-white/15 border border-white/15 hover:border-white/30 text-white text-xs font-bold font-heading uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Layers size={13} />
                      <span>Más Opciones</span>
                    </button>

                    {/* Direct WhatsApp Order */}
                    <a
                      href={getWhatsAppUrl(product, selectedProvince)}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-black text-xs font-heading uppercase tracking-wider shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-1.5"
                    >
                      <MessageCircle size={14} />
                      <span>Pedir Kit</span>
                    </a>
                  </div>

                </div>

              </motion.div>
            )
          })}
        </div>

      </section>

      {/* ═══════════ DETAILED PRODUCT MODAL WITH DYNAMIC REGIONAL CALCULATOR ═══════════ */}
      <AnimatePresence>
        {modalProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#0F0E16] border border-blue-500/30 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8"
            >
              {/* Close button */}
              <button
                onClick={() => setModalProduct(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white transition-all cursor-pointer"
              >
                <X size={18} />
              </button>

              {/* Modal Content */}
              <div className="space-y-6">
                
                {/* Header */}
                <div className="pr-8">
                  <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold font-heading uppercase tracking-widest">
                    {modalProduct.versionTag}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white font-heading uppercase mt-2">
                    {modalProduct.name}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    {modalProduct.description}
                  </p>
                </div>

                {/* Province Selector for this product */}
                <div className="bg-[#161522] border border-white/10 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin size={14} className="text-blue-400" />
                      <span>Seleccionar Provincia para Instalación:</span>
                    </label>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${selectedProvince.badgeColor}`}>
                      {selectedProvince.region}
                    </span>
                  </div>

                  <select
                    value={selectedProvinceId}
                    onChange={(e) => setSelectedProvinceId(e.target.value)}
                    className="w-full bg-[#0b0a10] border border-white/20 rounded-xl p-3 text-xs font-bold text-white outline-none cursor-pointer"
                  >
                    {PROVINCES_DATA.map((p) => (
                      <option key={p.id} value={p.id} className="bg-[#0b0a10] text-white">
                        {p.icon} {p.name} — ${p.cost} USD
                      </option>
                    ))}
                  </select>

                  {/* Price Breakdown Calculation */}
                  <div className="pt-2 border-t border-white/10 space-y-1.5 text-xs">
                    <div className="flex justify-between text-neutral-400">
                      <span>Precio regular sin descuento:</span>
                      <span className="line-through font-mono text-neutral-400">
                        ${calculateRegularInstalledPrice(modalProduct.priceBase, selectedProvince.cost)} USD
                      </span>
                    </div>
                    <div className="flex justify-between text-rose-400 font-bold">
                      <span className="flex items-center gap-1">
                        <Sparkles size={12} /> Descuento Especial Promocional (30% OFF):
                      </span>
                      <span className="font-mono">
                        -${calculateSavings(modalProduct.priceBase, selectedProvince.cost)} USD
                      </span>
                    </div>
                    <div className="flex justify-between text-neutral-300 pt-1 border-t border-white/5">
                      <span>Cerradura Inteligente (Solo Equipo en Oferta):</span>
                      <strong className="text-white">${modalProduct.priceBase.toFixed(2)} USD</strong>
                    </div>
                    <div className="flex justify-between text-neutral-300">
                      <span>Mano de obra e instalación en {selectedProvince.name.split(' ')[0]}:</span>
                      <strong className="text-emerald-400">+${selectedProvince.cost.toFixed(2)} USD</strong>
                    </div>
                    <div className="flex justify-between text-base font-black text-white pt-2 border-t border-white/10 font-heading">
                      <span className="text-emerald-400">TOTAL OFERTA KIT + INSTALACIÓN:</span>
                      <span className="text-emerald-400 text-xl font-heading">
                        ${calculateTotal(modalProduct.priceBase, selectedProvince.cost)} USD
                      </span>
                    </div>
                  </div>
                </div>

                {/* Highlights */}
                <div>
                  <h4 className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider mb-2">
                    Lo que incluye tu servicio:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-2 text-neutral-300 bg-white/[0.03] p-2 rounded-xl border border-white/[0.05]">
                      <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                      <span>Instalación mecánica y adaptación</span>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-300 bg-white/[0.03] p-2 rounded-xl border border-white/[0.05]">
                      <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                      <span>Configuración de usuarios y app móvil</span>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-300 bg-white/[0.03] p-2 rounded-xl border border-white/[0.05]">
                      <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                      <span>Capacitación sobre códigos y llaves</span>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-300 bg-white/[0.03] p-2 rounded-xl border border-white/[0.05]">
                      <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                      <span>1 año de garantía en producto y montaje</span>
                    </div>
                  </div>
                </div>

                {/* Final Order CTA Button */}
                <div className="pt-2">
                  <a
                    href={getWhatsAppUrl(modalProduct, selectedProvince)}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 hover:from-emerald-400 hover:to-teal-400 text-black font-black text-sm uppercase tracking-wider font-heading shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                  >
                    <MessageCircle size={18} />
                    <span>Agendar Instalación por WhatsApp (${calculateTotal(modalProduct.priceBase, selectedProvince.cost)} USD)</span>
                  </a>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══════════ FREQUENTLY ASKED QUESTIONS (FAQ ACCORDION) ═══════════ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#13121C] border border-white/10 text-xs font-bold text-neutral-300 mb-2">
            <HelpCircle size={13} className="text-blue-400" />
            <span className="font-heading uppercase tracking-wider text-[11px]">PREGUNTAS FRECUENTES</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-heading uppercase text-white tracking-tight">
            Todo lo que necesitas saber antes de instalar
          </h2>
        </div>

        <div className="space-y-3">
          {[
            {
              q: "¿Qué incluye exactamente el valor de instalación?",
              a: "El valor cubre la visita técnica en tu domicilio, retiro de tu cerradura antigua (si aplica), perforación y adaptación milimétrica del mortise en tu puerta, montaje electrónico de la cerradura, colocación de baterías, configuración de la aplicación móvil (Tuya/SmartLife), registro de huellas/rostros/códigos y una explicación detallada de su funcionamiento."
            },
            {
              q: "¿Cómo coordina ATOMIC la instalación si estoy en otra ciudad o provincia?",
              a: "Gracias a nuestra red nacional de técnicos especializados en cerrajería digital y domótica, asignamos a un técnico certificado de tu provincia tan pronto confirmas tu pedido. El técnico se comunica contigo para coordinar el día y hora exactos de tu preferencia."
            },
            {
              q: "¿Qué pasa si se agota la batería de la cerradura?",
              a: "Todas nuestras cerraduras inteligentes cuentan con dos sistemas de emergencia: 1) Llave mecánica física oculta de alta seguridad para abrir de forma manual; 2) Puerto de alimentación de emergencia USB/Type-C donde puedes conectar una powerbank portátil para darle energía instantánea y abrir con tu huella o código."
            },
            {
              q: "¿Sirven para cualquier tipo de puerta (madera, metal, aluminio)?",
              a: "Sí, son compatibles con puertas de madera sólida, tamborada, perfiles de aluminio, metal y puertas blindadas con grosores entre 35 mm y 100 mm. Nuestros técnicos llevan brocas y herramientas especializadas para cada material."
            },
            {
              q: "¿Puedo crear códigos para visitas o para inquilinos de Airbnb que expiren solos?",
              a: "Totalmente. Desde la aplicación móvil puedes generar contraseñas de un solo uso o contraseñas con fecha y hora exacta de vencimiento. Cuando termine la estancia de tu huésped, el código dejará de funcionar automáticamente sin necesidad de cambiar llaves."
            }
          ].map((faq, idx) => (
            <div
              key={idx}
              className="bg-[#0f0e16] border border-white/10 rounded-2xl overflow-hidden transition-all"
            >
              <button
                onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02]"
              >
                <span className="text-sm font-bold text-white font-heading uppercase">
                  {faq.q}
                </span>
                <ChevronDown
                  size={16}
                  className={`text-neutral-400 transition-transform duration-300 shrink-0 ${
                    expandedFaq === idx ? "rotate-180 text-blue-400" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {expandedFaq === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="px-5 pb-5 text-xs sm:text-sm text-neutral-300 leading-relaxed border-t border-white/[0.06] pt-3"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ FOOTER CTA ═══════════ */}
      <footer className="w-full bg-[#050508] border-t border-white/10 py-12 px-4 sm:px-6 text-center text-xs text-neutral-500 space-y-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white font-heading font-black text-sm">
            <Shield size={16} className="text-blue-400" />
            <span>ATOMIC // CERRADURAS SMART & ACCESOS BIOMÉTRICOS</span>
          </div>

          <div className="flex items-center gap-4 text-xs text-neutral-400">
            <Link href="/web" className="hover:text-white transition-colors">Tienda Principal</Link>
            <span>•</span>
            <Link href="/web/conjuntos-smart" className="hover:text-white transition-colors">Senseface 2A</Link>
            <span>•</span>
            <a href="https://wa.me/593969043453" target="_blank" rel="noreferrer" className="text-emerald-400 hover:text-emerald-300 font-bold">WhatsApp Soporte</a>
          </div>
        </div>

        <p className="text-[11px] text-neutral-600">
          © {new Date().getFullYear()} ATOMIC Electronics & Technologies. Red nacional de instalación y distribución en las 24 provincias de Ecuador.
        </p>
      </footer>

    </div>
  )
}
