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
  Cpu,
  Filter,
  Tag
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
// SMART LOCK PRODUCTS ACROSS ALL OFFICIAL PROVIDERS (CRONTE, YALE, BP, YAE, SISEGUSA/ZKTECO)
// ═══════════════════════════════════════════════════════════════════════════
interface SmartLockProduct {
  id: string
  name: string
  provider: "CRONTE" | "YALE" | "BP" | "YAE" | "SISEGUSA"
  providerName: string
  versionTag: string
  badge: string
  category: "facial" | "manija" | "cerrojo" | "airbnb" | "edificios"
  image: string
  priceBase: number
  highlights: string[]
  methods: string[]
  differentiator: string
  description: string
  popular?: boolean
}

const SMART_LOCK_KITS: SmartLockProduct[] = [
  // ─── YAE & SMART LIFE ECOSYSTEM ───
  {
    id: "lock-yae-facial-3d",
    name: "Cerradura Smart Biometría Facial 3D & Mirilla Cámara LCD Tuya Pro",
    provider: "YAE",
    providerName: "YAE Smart Life",
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
    differentiator: "Máximo nivel de lujo: se abre automáticamente al detectar tu rostro sin necesidad de tocar la cerradura.",
    description: "Nuestra cerradura insignia más avanzada. Equipada con sensores biométricos 3D infrarrojos que reconocen tu rostro en 0.4s incluso en total oscuridad.",
    popular: true
  },
  {
    id: "lock-yae-glass-door",
    name: "Cerradura Smart Tuya WiFi para Puertas de Vidrio Templado & Corredizas",
    provider: "YAE",
    providerName: "YAE Smart Life",
    versionTag: "Instalación sin Perforación en Vidrio // Perno Doble",
    badge: "🏢 PUERTAS DE VIDRIO",
    category: "airbnb",
    image: "/images/cerraduras/bp-quantum-lock.png",
    priceBase: 119.99,
    highlights: [
      "Instalación limpia mediante abrazadera de alta presión sin perforar el vidrio templado",
      "Compatible con puertas de vidrio batientes, corredizas y marcos metálicos",
      "Sensor biométrico de huella digital capacitivo de 360 grados",
      "Control por app Tuya con contraseñas temporales y registros de asistencia"
    ],
    methods: ["Huella 360°", "App Tuya", "Clave PIN", "Tarjetas IC", "Control Remoto"],
    differentiator: "Ideal para oficinas comerciales, consultorios y locales con puertas de vidrio templado.",
    description: "Cerradura digital de sobreponer diseñada exclusivamente para puertas de vidrio templado de 10 a 12mm sin taladrar."
  },
  {
    id: "lock-yae-knob-smart",
    name: "Cerradura Pomo Smart Biométrico YAE con Lector de Huella Integrado",
    provider: "YAE",
    providerName: "YAE Smart Life",
    versionTag: "Reemplazo Directo de Pomo // Dormitorios & Oficinas",
    badge: "🚪 FÁCIL INSTALACIÓN",
    category: "airbnb",
    image: "/images/cerraduras/yale-ydl120.png",
    priceBase: 49.99,
    highlights: [
      "Reemplaza directamente cualquier pomo estándar tradicional sin modificar la puerta",
      "Lector de huella de alta precisión ubicado en el centro del pomo",
      "Modo paso libre para reuniones o eventos familiares",
      "Baterías AAA con autonomía de más de 12 meses + puerto de emergencia USB"
    ],
    methods: ["Huella en Pomo", "App Bluetooth", "Claves Numéricas", "Llave Mecánica"],
    differentiator: "La solución más rápida y económica para independizar habitaciones, oficinas privadas o departamentos.",
    description: "Transforma tu pomo tradicional en un acceso biométrico moderno en cuestión de minutos."
  },

  // ─── CRONTE TECHNOLOGY (MAADOK & TUYA SMART) ───
  {
    id: "lock-cronte-facial-3d",
    name: "Cerradura Inteligente Facial 3D WiFi Tuya Smart Máxima Seguridad 5 Pistones",
    provider: "CRONTE",
    providerName: "Cronte Technology",
    versionTag: "Reconocimiento Facial 3D // 5 Pistones de Acero // Batería Litio",
    badge: "⭐ TOP CRONTE",
    category: "facial",
    image: "/images/cerraduras/bp-plasma-lock.png",
    priceBase: 137.99,
    highlights: [
      "Reconocimiento facial 3D infrarrojo de alta velocidad y precisión",
      "Mirilla con cámara HD y pantalla LCD a color integrada",
      "Cuerpo de embutir blindado con 5 pistones de acero templado",
      "Apertura remota instantánea desde app Tuya Smart / Smart Life",
      "Batería recargable de litio de 4200 mAh de larga duración"
    ],
    methods: ["Facial 3D", "Huella Digital", "App Tuya WiFi", "Contraseña PIN", "Tarjetas IC", "Llave Mecánica"],
    differentiator: "Reconocimiento facial biométrico ultra rápido con máxima resistencia mecánica de 5 pistones.",
    description: "Cerradura insignia Cronte con biometría facial 3D infrarroja y pantalla LCD a color.",
    popular: true
  },
  {
    id: "lock-cronte-cam-lcd",
    name: "Cerradura Inteligente WiFi Tuya Smart 5 Pistones con Videocámara & Mirilla LCD",
    provider: "CRONTE",
    providerName: "Cronte Technology",
    versionTag: "Videocámara HD + Pantalla LCD // Timbre Intercomunicador",
    badge: "📷 CÁMARA & LCD",
    category: "facial",
    image: "/categories/cerraduras-smart-y-accesos.png",
    priceBase: 140.00,
    highlights: [
      "Videocámara HD frontal con visión nocturna infrarroja integrada",
      "Pantalla interior a color para visualización de visitantes en tiempo real",
      "Envío de fotografía y videollamada al celular al pulsar el timbre",
      "Cerradura de embutir reforzada con 5 pistones anti-palanca"
    ],
    methods: ["Videocámara HD", "Huella Digital", "App Tuya", "Clave PIN", "Tarjetas RFID", "Llave"],
    differentiator: "Funciona como videoportero y cerradura biométrica en un solo dispositivo integrado.",
    description: "Cerradura inteligente Cronte con cámara timbre frontal y pantalla LCD interior."
  },
  {
    id: "lock-cronte-push-pull",
    name: "Cerradura Inteligente Push-Pull Totalmente Automática 5 Pistones",
    provider: "CRONTE",
    providerName: "Cronte Technology",
    versionTag: "Mecanismo Push-Pull 100% Motorizado // Apertura Suave",
    badge: "⚡ PUSH-PULL PRO",
    category: "manija",
    image: "/images/cerraduras/bp-quantum-lock.png",
    priceBase: 169.49,
    highlights: [
      "Mecanismo Push-Pull 100% automático (se abre empujando suavemente)",
      "Lector de huella digital integrado ergonómicamente en la manija",
      "Bloqueo y desbloqueo motorizado sin esfuerzo manual",
      "Conexión WiFi directa sin requerir gateways adicionales"
    ],
    methods: ["Push-Pull Motorizado", "Huella Digital", "App Tuya", "Contraseña", "Tarjeta IC", "Llave"],
    differentiator: "Máximo confort: abre con un toque en la huella y empuja la puerta sin girar manijas.",
    description: "Cerradura Push-Pull automática con cerrojo motorizado de alta gama."
  },
  {
    id: "lock-cronte-chapa-ext",
    name: "Chapa Eléctrica Inteligente WiFi Exterior con Huella, Teclado & Control Remoto",
    provider: "CRONTE",
    providerName: "Cronte Technology",
    versionTag: "Exterior & Portones // Huella Impermeable + Control Remoto",
    badge: "🚪 EXTERIOR & PORTONES",
    category: "edificios",
    image: "/images/cerraduras/bp-plasma-lock.png",
    priceBase: 127.95,
    highlights: [
      "Diseño sellado de sobreponer para puertas exteriores, portones y rejas",
      "Teclado táctil exterior impermeable con lector de huella dactilar",
      "Incluye control remoto inalámbrico de largo alcance",
      "Apertura remota desde celular vía app Tuya / Smart Life",
      "Cilindro de alta seguridad con llaves de punto de respaldo"
    ],
    methods: ["Huella Exterior", "App Tuya WiFi", "Control Remoto", "Clave PIN", "Tarjetas Mifare", "Llave"],
    differentiator: "La solución definitiva para portones principales de casas y conjuntos expuestos al sol y lluvia.",
    description: "Chapa inteligente de sobreponer para exteriores con lector biométrico impermeable y control remoto."
  },
  {
    id: "lock-cronte-chapa-huella",
    name: "Chapa Eléctrica Inteligente WiFi Tuya Smart con Huella Exterior",
    provider: "CRONTE",
    providerName: "Cronte Technology",
    versionTag: "Sobreponer Peatonal // Biometría Exterior",
    badge: "⚡ SOBREPONER SMART",
    category: "edificios",
    image: "/images/cerraduras/bp-plasma-lock.png",
    priceBase: 101.65,
    highlights: [
      "Chapa de sobreponer para accesos peatonales y puertas metálicas",
      "Lector de huella exterior con protección contra polvo y salpicaduras",
      "Registro detallado de aperturas con fecha y hora en el celular",
      "Alimentación 12V DC compatible con intercomunicadores"
    ],
    methods: ["Huella Digital", "App Tuya", "Código PIN", "Tarjeta RFID", "Llave"],
    differentiator: "Automatiza cualquier portón o reja exterior con acceso biométrico seguro.",
    description: "Chapa eléctrica inteligente de sobreponer para accesos peatonales y rejas."
  },
  {
    id: "lock-cronte-vidrio-disp",
    name: "Cerradura Inteligente WiFi para Puerta de Vidrio Templado con Pantalla",
    provider: "CRONTE",
    providerName: "Cronte Technology",
    versionTag: "Sin Perforación en Vidrio // Pantalla OLED + Perno Doble",
    badge: "🏢 PUERTAS DE VIDRIO",
    category: "airbnb",
    image: "/images/cerraduras/bp-quantum-lock.png",
    priceBase: 111.62,
    highlights: [
      "Instalación limpia por abrazadera a presión sin taladrar el vidrio templado",
      "Compatible con puertas de vidrio batientes, corredizas y marcos de 10-12mm",
      "Pantalla OLED integrada para fácil administración de usuarios",
      "Conexión WiFi nativa Tuya Smart con generación de claves temporales"
    ],
    methods: ["Huella 360°", "App Tuya WiFi", "Contraseña Táctil", "Tarjeta IC", "Control Remoto"],
    differentiator: "Especialmente diseñada para oficinas, locales comerciales y consultorios con puertas de vidrio.",
    description: "Cerradura digital de sobreponer para puertas de vidrio templado sin taladrar."
  },
  {
    id: "lock-cronte-vidrio-ble",
    name: "Cerradura Inteligente Tuya Bluetooth para Puerta de Vidrio Templado",
    provider: "CRONTE",
    providerName: "Cronte Technology",
    versionTag: "Económica Puerta de Vidrio // Bluetooth Tuya",
    badge: "🏢 VIDRIO ECONÓMICA",
    category: "airbnb",
    image: "/images/cerraduras/bp-quantum-lock.png",
    priceBase: 71.94,
    highlights: [
      "Fijación rápida por abrazadera sin obras",
      "Lector de huella capacitivo de 360 grados",
      "Control de accesos y registros desde app Bluetooth",
      "Perno de acero templado de alta sujeción"
    ],
    methods: ["Huella Digital", "App Bluetooth", "Clave PIN", "Tarjeta RFID"],
    differentiator: "Acceso seguro y profesional para puertas de vidrio al precio más competitivo.",
    description: "Cerradura biométrica Bluetooth para puertas de cristal de oficinas y consultorios."
  },
  {
    id: "lock-cronte-slim-alum",
    name: "Cerradura Smart WiFi para Puerta Corrediza de Aluminio & Perfil Angosto",
    provider: "CRONTE",
    providerName: "Cronte Technology",
    versionTag: "Diseño Slimline 38mm // Gancho Corrediza // Acero Inox",
    badge: "🛡️ PERFIL DELGADO",
    category: "cerrojo",
    image: "/images/cerraduras/bp-voltex-lock.webp",
    priceBase: 139.78,
    highlights: [
      "Diseño estilizado de 38mm compatible con perfiles de aluminio y hierro",
      "Cerradura de gancho doble especial para puertas corredizas",
      "Protección contra intemperie y humedad IP65",
      "Manija reversible de acero inoxidable 304"
    ],
    methods: ["Huella Digital", "App Tuya WiFi", "Contraseña PIN", "Tarjetas RFID", "Llave"],
    differentiator: "Diseñada a medida para puertas corredizas de balcón, ventanas de acceso y perfiles angostos.",
    description: "Cerradura digital slimline para puertas corredizas y perfiles angostos de aluminio."
  },
  {
    id: "lock-cronte-manija-5p",
    name: "Cerradura Inteligente WiFi Tuya Smart 5 Pistones Manija Reversible",
    provider: "CRONTE",
    providerName: "Cronte Technology",
    versionTag: "Aleación de Zinc // Sensor FPC Sueco // 5 Pistones",
    badge: "🛡️ 5 PISTONES CRONTE",
    category: "manija",
    image: "/images/cerraduras/bp-plasma-lock.png",
    priceBase: 89.80,
    highlights: [
      "Cuerpo de aleación de zinc de alta durabilidad antivandálica",
      "Lector semiconductor sueco FPC de alta velocidad (0.25s)",
      "Caja de cerradura con 5 pistones de acero reforzado",
      "Historial de aperturas y notificaciones en tiempo real al celular"
    ],
    methods: ["Huella FPC", "App Tuya", "Contraseña Táctil", "Tarjetas RFID", "Llave"],
    differentiator: "Máxima robustez y solidez para puertas principales residenciales y de oficinas.",
    description: "Cerradura de alta seguridad Cronte con manija ergonómica y mecanismo de 5 pistones."
  },
  {
    id: "lock-cronte-manija-2p",
    name: "Cerradura Inteligente WiFi Tuya Smart 2 Pistones Manija Negra",
    provider: "CRONTE",
    providerName: "Cronte Technology",
    versionTag: "Línea Black Edition // 2 Pistones // WiFi Directo",
    badge: "⚡ CALIDAD/PRECIO",
    category: "manija",
    image: "/images/cerraduras/bp-plasma-lock.png",
    priceBase: 86.48,
    highlights: [
      "Elegante acabado en negro mate de alta resistencia",
      "Teclado táctil retroiluminado con código antiespía",
      "Apertura remota por app Tuya Smart / Smart Life",
      "Función de bloqueo de privacidad interno"
    ],
    methods: ["Huella Digital", "Clave Numérica", "App Tuya", "Tarjeta RFID", "Llave"],
    differentiator: "Excelente balance entre precio accesible, diseño moderno y tecnología de punta.",
    description: "Cerradura digital de manija en negro mate con conectividad WiFi nativa."
  },
  {
    id: "lock-cronte-pomo-huella",
    name: "Pomo Inteligente Biométrico WiFi con Lector de Huella en Pomo",
    provider: "CRONTE",
    providerName: "Cronte Technology",
    versionTag: "Reemplazo Directo de Pomo // Dormitorios & Oficinas",
    badge: "🚪 FÁCIL INSTALACIÓN",
    category: "airbnb",
    image: "/images/cerraduras/yale/yale-cerrojo-digital-yale-ydl120-1.png",
    priceBase: 58.56,
    highlights: [
      "Lector de huella integrado en el centro del pomo de la puerta",
      "Conexión WiFi directa para apertura y monitoreo por app",
      "Sustituye cualquier pomo convencional de 54mm sin taladros adicionales",
      "Modo paso libre para libre acceso temporal"
    ],
    methods: ["Huella en Pomo", "App Tuya WiFi", "Clave Numérica", "Llave Mecánica"],
    differentiator: "La forma más rápida y limpia de poner acceso biométrico en dormitorios u oficinas.",
    description: "Pomo digital biométrico con lector de huella dactilar integrado y WiFi."
  },
  {
    id: "lock-cronte-pomo-teclado",
    name: "Cerradura Bluetooth + WiFi Pomo con Teclado Táctil & Huella",
    provider: "CRONTE",
    providerName: "Cronte Technology",
    versionTag: "Pomo con Teclado Numérico // Claves Temporales",
    badge: "💎 AIRBNB POMO",
    category: "airbnb",
    image: "/images/cerraduras/yale/yale-cerrojo-digital-yale-ydl120-1.png",
    priceBase: 67.78,
    highlights: [
      "Teclado táctil completo integrado en la roseta del pomo",
      "Lector biométrico de huella digital de respuesta rápida",
      "Generación de contraseñas dinámicas por horario para huéspedes",
      "Puerto de alimentación Type-C de emergencia"
    ],
    methods: ["Huella Digital", "Código PIN Táctil", "App Tuya", "Llave"],
    differentiator: "Ideal para anfitriones de Airbnb que desean controlar habitaciones independientes.",
    description: "Cerradura de pomo con teclado numérico retroiluminado y lector de huella."
  },
  {
    id: "lock-cronte-candado-smart",
    name: "Candado Inteligente App Tuya Smart Bluetooth con Lector de Huella",
    provider: "CRONTE",
    providerName: "Cronte Technology",
    versionTag: "Cuerpo Aleación Zinc // Arco Acero // IP65",
    badge: "🔒 CANDADO SMART",
    category: "airbnb",
    image: "/images/cerraduras/bp-quantum-lock.png",
    priceBase: 32.66,
    highlights: [
      "Apertura biométrica instantánea en 0.2 segundos al poner el dedo",
      "Cuerpo de aleación de zinc y arco de acero cementado",
      "Batería recargable USB con duración de hasta 2,000 aperturas",
      "Protección contra lluvia y polvo IP65"
    ],
    methods: ["Huella Dactilar", "App Tuya Bluetooth"],
    differentiator: "Protege casilleros, bodegas, rejas, motos o portones sin necesidad de llevar llaves.",
    description: "Candado inteligente biométrico recargable por USB con control Bluetooth."
  },
  {
    id: "lock-cronte-chapa-boton",
    name: "Chapa Eléctrica con Botón para Puerta Peatonal de Sobreponer",
    provider: "CRONTE",
    providerName: "Cronte Technology",
    versionTag: "12V AC/DC // Acero Niquelado // Botón Mecánico",
    badge: "🔩 CHAPA PEATONAL",
    category: "edificios",
    image: "/images/cerraduras/yale/yale-cerradura-el-ctrica-678-con-bot-n-1.png",
    priceBase: 26.65,
    highlights: [
      "Botón mecánico de apertura interior de fácil pulsación",
      "Bobina eléctrica de 12V compatible con videoporteros y pulsadores",
      "Carcasa de acero niquelado resistente a la intemperie",
      "Incluye 3 llaves dentadas de seguridad exterior"
    ],
    methods: ["Pulsador Eléctrico 12V", "Botón Mecánico Interior", "Llave Exterior"],
    differentiator: "Máxima durabilidad mecánica tradicional para portones peatonales de alto tráfico.",
    description: "Cerradura eléctrica tradicional de sobreponer para portones peatonales y rejas."
  },
  {
    id: "lock-cronte-deadbolt",
    name: "Cerrojo Smart Cronte Touch con Conectividad WiFi & Teclado Táctil",
    provider: "CRONTE",
    providerName: "Cronte Technology",
    versionTag: "Cerrojo Automático Heavy-Duty",
    badge: "🛡️ CRONTE TECH",
    category: "cerrojo",
    image: "/images/cerraduras/yale-ydr41.png",
    priceBase: 62.99,
    highlights: [
      "Cerrojo motorizado de cierre automático al cerrar la puerta",
      "Teclado táctil iluminado con dígitos aleatorios antiespía",
      "Permite conservar tu manija o jaladera de lujo existente",
      "Alertas de batería baja con 200 aperturas de anticipación"
    ],
    methods: ["Código Touch", "App Tuya WiFi", "Huella Digital", "Llaves"],
    differentiator: "Ideal para combinar con manijas o jaladeras de diseño arquitectónico existentes.",
    description: "Cerrojo inteligente motorizado que brinda la máxima resistencia al apalancamiento."
  },

  // ─── YALE ECUADOR ───
  {
    id: "lock-yale-ymc420d",
    name: "Cerrojo Digital Inteligente Yale YMC420D Biométrico de Alta Gama",
    provider: "YALE",
    providerName: "Yale Ecuador",
    versionTag: "Original Yale Ecuador // Huella + Código + Tarjeta",
    badge: "🏆 TOP YALE",
    category: "cerrojo",
    image: "/images/cerraduras/yale/yale-cerrojo-digital-ymc420d-1.png",
    priceBase: 260.02,
    highlights: [
      "Certificación internacional de seguridad Yale y cilindro antibumping Grado 1",
      "Pantalla táctil capacitiva que no deja marcas de huellas dactilares",
      "Bloqueo automático programable al cerrar la puerta",
      "Alarma sonora de 80dB ante intento de sabotaje o golpe"
    ],
    methods: ["Lector Biométrico Yale", "Código PIN", "Tarjeta Yale", "Llave Mecánica"],
    differentiator: "El respaldo, prestigio y confiabilidad legendaria de la marca número 1 en cerrajería del mundo.",
    description: "Cerrojo digital de máxima seguridad Yale con teclado inteligente y acabados premium.",
    popular: true
  },
  {
    id: "lock-yale-ymf40a-hub",
    name: "Cerradura Digital Yale YMF40A + Módulo Yale Connect para Celular",
    provider: "YALE",
    providerName: "Yale Ecuador",
    versionTag: "Manija de Embutir + WiFi Yale Connect Hub",
    badge: "📱 YALE SMART CONNECT",
    category: "manija",
    image: "/images/cerraduras/yale/yale-cerradura-digital-ymf40a-m-dulo-para-abr-1.webp",
    priceBase: 463.33,
    highlights: [
      "Apertura remota desde celular con la app Yale Connect desde cualquier parte",
      "Sensor biométrico escandinavo de lectura ultra rápida",
      "Manija de embutir reversible para puertas principales de alta gama",
      "Menú guiado por voz en español para configuración intuitiva"
    ],
    methods: ["App Yale Connect", "Huella Digital", "Código PIN", "Llave de Puntos"],
    differentiator: "Control total desde tu smartphone con la app oficial de Yale y biometría de grado bancario.",
    description: "Cerradura digital insignia Yale con módulo de conectividad móvil incluido."
  },
  {
    id: "lock-yale-ymf40a",
    name: "Cerradura Digital Yale YMF40A Biometría y Manija de Embutir",
    provider: "YALE",
    providerName: "Yale Ecuador",
    versionTag: "Seguridad Grado 1 // Manija de Embutir",
    badge: "🏆 YALE ORIGINAL",
    category: "manija",
    image: "/images/cerraduras/yale/yale-cerradura-digital-ymf40a-1.png",
    priceBase: 388.43,
    highlights: [
      "Lector de huella digital de un toque con tecnología biométrica escandinava",
      "Mecanismo de embutir de acero templado ultra resistente",
      "Capacidad para hasta 100 usuarios con huellas y claves individuales",
      "Cierre automático con sensor magnético de puerta cerrada"
    ],
    methods: ["Huella Digital", "Código PIN", "Llave Mecánica de Emergencia"],
    differentiator: "Elegancia y máxima solidez estructural para puertas principales residenciales.",
    description: "Cerradura biométrica digital Yale con manija de embutir y acabado en negro piano."
  },
  {
    id: "lock-yale-ydf40a",
    name: "Cerrojo Digital Yale YDF40A con Lector Huella de Alta Precisión",
    provider: "YALE",
    providerName: "Yale Ecuador",
    versionTag: "Seguridad Grado 2 // Pantalla Touch Capacitiva",
    badge: "🏆 YALE ORIGINAL",
    category: "cerrojo",
    image: "/images/cerraduras/yale/yale-cerrojo-digital-ydf40a-1.png",
    priceBase: 263.13,
    highlights: [
      "Lector de huella digital de precisión escandinava con lectura en 0.3s",
      "Menú guiado por voz en español para fácil configuración",
      "Integrable con módulo Yale Connect para control desde celular",
      "Puerto exterior para batería de 9V en caso de emergencia"
    ],
    methods: ["Huella Yale", "Código Maestro y Usuarios", "Llave de Emergencia"],
    differentiator: "Guiado por voz en español y lectura biométrica de altísima precisión.",
    description: "Cerrojo digital biométrico Yale para hogares y oficinas con estándar internacional de protección."
  },
  {
    id: "lock-yale-ysd100",
    name: "Cerradura Digital Yale YSD100 para Puertas Abatibles & Corredizas",
    provider: "YALE",
    providerName: "Yale Ecuador",
    versionTag: "Especial Puertas Corredizas y Abatibles // Perfil Delgado",
    badge: "🚪 CORREDIZAS YALE",
    category: "cerrojo",
    image: "/images/cerraduras/yale/yale-cerradura-digital-ysd100-puerta-abatible-1.png",
    priceBase: 227.72,
    highlights: [
      "Mecanismo de gancho doble especial para puertas corredizas y marcos angostos",
      "Teclado táctil invisible con código señuelo antiespía",
      "Cuerpo ultra delgado de aleación de zinc de alta durabilidad",
      "Compatible con apertura por tarjeta de proximidad RFID y código PIN"
    ],
    methods: ["Código PIN", "Tarjeta RFID", "Llave Mecánica"],
    differentiator: "La solución oficial de Yale diseñada específicamente para puertas corredizas de balcón y acceso.",
    description: "Cerradura digital de sobreponer Yale con cerrojo de gancho para puertas corredizas y batientes."
  },
  {
    id: "lock-yale-ydr41",
    name: "Cerrojo Digital Touchscreen Yale YDR41 Antiespía",
    provider: "YALE",
    providerName: "Yale Ecuador",
    versionTag: "Bloqueo Automático Inteligente // Claves Temporales",
    badge: "🏆 YALE ORIGINAL",
    category: "cerrojo",
    image: "/images/cerraduras/yale/yale-cerrojo-digital-ydr41-1.png",
    priceBase: 280.42,
    highlights: [
      "Teclado táctil invisible que se enciende solo al tacto de la palma",
      "Código señuelo: puedes ingresar números aleatorios antes o después de tu clave real",
      "Cierre automático con pestillo de acero cementado",
      "Compatible con puertas de 30 a 55mm de espesor"
    ],
    methods: ["Código Touch", "Tarjeta de Proximidad Yale", "Llave de Alta Seguridad"],
    differentiator: "Función de código falso para que nadie pueda memorizar tu clave al verte teclear.",
    description: "Cerrojo digital Yale con teclado táctil retroiluminado y código señuelo para máxima privacidad."
  },
  {
    id: "lock-yale-yrd226-hub",
    name: "Cerrojo Digital Yale YRD226 Real Living + Módulo Yale Connect",
    provider: "YALE",
    providerName: "Yale Ecuador",
    versionTag: "Conectividad Total Celular // Acabado Bronce / Níquel",
    badge: "📱 YALE CONNECT",
    category: "cerrojo",
    image: "/images/cerraduras/yale/yale-cerrojo-digital-yrd226-m-dulo-para-abrir-1.webp",
    priceBase: 329.72,
    highlights: [
      "Abre, cierra y monitorea el estado de tu puerta desde tu celular con la app Yale Connect",
      "Mecanismo motorizado de acero con cerrojo cónico que corrige desalineaciones",
      "Pantalla táctil retroiluminada de alta resistencia",
      "Alertas en tiempo real al teléfono ante aperturas no autorizadas"
    ],
    methods: ["App Celular", "Pantalla Touch", "Llave Física Yale"],
    differentiator: "El cerrojo inteligente más elegante del mercado con control remoto total por internet.",
    description: "Cerrojo táctil motorizado Yale Real Living con kit de conexión móvil Yale Connect."
  },
  {
    id: "lock-yale-yrd226",
    name: "Cerrojo Digital Yale YRD226 Bronce Oscuro / Acero Níquel",
    provider: "YALE",
    providerName: "Yale Ecuador",
    versionTag: "Línea Real Living // Diseño Clásico & Moderno",
    badge: "🏆 YALE ORIGINAL",
    category: "cerrojo",
    image: "/images/cerraduras/yale/yale-cerrojo-digital-yrd226-bronce-oscuro-1.jpg",
    priceBase: 174.93,
    highlights: [
      "Acabado en bronce oscuro de lujo o acero inoxidable níquel satinado",
      "Resistente a la intemperie y rayos UV para puertas exteriores",
      "Capacidad para 250 códigos de usuario",
      "Mecanismo de embutir ultra suave con cerrojo de acero motorizado"
    ],
    methods: ["Pantalla Táctil", "Llave Física Yale", "Compatible con Smart Home"],
    differentiator: "Elegante diseño en bronce o níquel satinado que realza la estética de cualquier fachada.",
    description: "Cerrojo digital inteligente Yale con teclado táctil resistente a la intemperie."
  },
  {
    id: "lock-yale-yrd256",
    name: "Cerrojo Digital Touchscreen Yale YRD256 Negro Mate (Keyless)",
    provider: "YALE",
    providerName: "Yale Ecuador",
    versionTag: "100% Digital Sin Llave // Teclado Táctil Capacitivo",
    badge: "⚡ KEYLESS YALE",
    category: "cerrojo",
    image: "/images/cerraduras/yale/yale-cerrojo-digital-yrd256-negro-1.png",
    priceBase: 186.89,
    highlights: [
      "Diseño 100% keyless (sin orificio de llave para evitar manipulaciones mecánicas)",
      "Pantalla táctil retroiluminada de alta sensibilidad",
      "Terminal exterior para batería de 9V en caso de agotamiento de pilas",
      "Bloqueo automático de seguridad tras intentos fallidos consecutivos"
    ],
    methods: ["Pantalla Táctil", "Códigos Temporales", "Compatible Yale Connect"],
    differentiator: "Sin cilindro exterior: elimina por completo el riesgo de ganzuado o bumping.",
    description: "Cerrojo digital sin llave Yale YRD256 con teclado capacitivo en acabado negro mate."
  },
  {
    id: "lock-yale-yrl226",
    name: "Cerradura Digital con Manija Yale YRL226 Touchscreen",
    provider: "YALE",
    providerName: "Yale Ecuador",
    versionTag: "Manija Integrada Reversible // Teclado Táctil",
    badge: "🏆 YALE ORIGINAL",
    category: "manija",
    image: "/images/cerraduras/yale/yale-cerrojo-digital-yrl226-m-dulo-para-abrir-1.webp",
    priceBase: 227.72,
    highlights: [
      "Manija integrada de accionamiento suave para un acceso rápido y cómodo",
      "Teclado táctil iluminado de alta durabilidad con código antiespía",
      "Mecanismo tubular reversible para instalación izquierda o derecha",
      "Capacidad para hasta 250 códigos de usuario"
    ],
    methods: ["Pantalla Táctil", "Llave Física de Seguridad", "Compatible Yale Hub"],
    differentiator: "Todo en uno: sustituye tu manija tradicional por una cerradura digital táctil premium.",
    description: "Cerradura digital de manija integrada Yale Real Living con teclado táctil."
  },
  {
    id: "lock-yale-lia-smart",
    name: "Cerradura Digital LIA Yale Connect Embutir / Tubular",
    provider: "YALE",
    providerName: "Yale Ecuador",
    versionTag: "Línea LIA // Diseño Minimalista Escandinavo",
    badge: "💎 DISEÑO LIA",
    category: "cerrojo",
    image: "/images/cerraduras/yale/yale-cerradura-digital-lia-embutir--1.jpg",
    priceBase: 246.42,
    highlights: [
      "Diseño estilizado extra delgado de líneas redondeadas y limpias",
      "Lectura biométrica de huella digital y teclado táctil iluminado",
      "Conectividad con ecosistema Yale Connect para apertura remota",
      "Ideal para interiores modernos, departamentos y puertas principales"
    ],
    methods: ["Huella Digital", "Teclado Táctil", "App Yale Connect", "Llave"],
    differentiator: "Estética vanguardista minimalista que complementa la arquitectura moderna.",
    description: "Cerradura digital biométrica Yale LIA de diseño escandinavo contemporáneo."
  },
  {
    id: "lock-yale-ydl120",
    name: "Cerrojo Digital Yale YDL120 con Teclado Numérico",
    provider: "YALE",
    providerName: "Yale Ecuador",
    versionTag: "Económico & Resistente // Teclado Retroiluminado",
    badge: "⚡ ECONÓMICO YALE",
    category: "cerrojo",
    image: "/images/cerraduras/yale/yale-cerrojo-digital-yale-ydl120-1.png",
    priceBase: 136.84,
    highlights: [
      "Teclado numérico iluminado con teclas de fácil pulsación",
      "Programación de hasta 50 códigos de usuario",
      "Cierre automático programable de 10 a 99 segundos",
      "Cuerpo de zinc fundido resistente a intentos de impacto"
    ],
    methods: ["Teclado Numérico", "Llave Mecánica"],
    differentiator: "La confiabilidad de Yale al precio más accesible para departamentos y oficinas.",
    description: "Cerrojo digital con teclado retroiluminado Yale YDL120 de alta practicidad."
  },
  {
    id: "lock-yale-ydd120",
    name: "Cerrojo Digital Yale YDD120 Negro Mate",
    provider: "YALE",
    providerName: "Yale Ecuador",
    versionTag: "Diseño Compacto // Bloqueo Automático",
    badge: "⚡ COMPACTO YALE",
    category: "cerrojo",
    image: "/images/cerraduras/yale/yale-cerrojo-digital-ydd120-negra-1.png",
    priceBase: 92.57,
    highlights: [
      "Cuerpo compacto en acabado negro mate de alta resistencia",
      "Teclado numérico retroiluminado para fácil uso en la noche",
      "Modo privacidad y alarma de batería baja",
      "Instalación directa en perforaciones estándar de cerrojo"
    ],
    methods: ["Código PIN", "Llave Mecánica"],
    differentiator: "Compacto, seguro y fácil de operar para toda la familia.",
    description: "Cerrojo digital Yale YDD120 con teclado y pestillo de seguridad motorizado."
  },
  {
    id: "lock-yale-cilindro",
    name: "Cilindro Biométrico Inteligente Yale para Cerraduras Europerfil",
    provider: "YALE",
    providerName: "Yale Ecuador",
    versionTag: "Instalación en 3 Minutos // Europerfil Estándar",
    badge: "🔩 CILINDRO SMART",
    category: "cerrojo",
    image: "/images/cerraduras/yale/yale-cilindro-biom-trico-1.png",
    priceBase: 117.00,
    highlights: [
      "Reemplaza el cilindro mecánico existente sin cambiar la cerradura ni taladrar",
      "Lector de huella digital integrado en el pomo exterior",
      "Batería recargable con duración de hasta 12 meses",
      "Compatible con cualquier cerradura estándar de perfil europeo"
    ],
    methods: ["Huella Digital", "Llave Mecánica de Respaldo", "App Bluetooth"],
    differentiator: "Convierte cualquier cerradura existente en biométrica en solo 3 minutos sin obras.",
    description: "Cilindro digital biométrico Yale para actualización inmediata de puertas existentes."
  },
  {
    id: "lock-yale-phillips-ph240",
    name: "Cerrojo Digital Phillips PH240 Yale de Sobreponer",
    provider: "YALE",
    providerName: "Yale Ecuador",
    versionTag: "Instalación de Sobreponer // Teclado Touch",
    badge: "🔩 ROBUSTA PHILLIPS",
    category: "cerrojo",
    image: "/images/cerraduras/yale/yale-cerrojo-digital-phillips-ph240-1.png",
    priceBase: 67.00,
    highlights: [
      "Cerradura de sobreponer ideal para puertas metálicas, rejas y madera",
      "Teclado táctil iluminado con códigos de acceso",
      "Pestillo de acero reforzado de alta sujeción",
      "Respaldo oficial Phillips - Yale Ecuador"
    ],
    methods: ["Teclado Táctil", "Llave de Seguridad"],
    differentiator: "Fuerza mecánica tradicional con la comodidad de acceso digital por teclado.",
    description: "Cerrojo digital de sobreponer Phillips PH240 para máxima solidez en puertas y rejas."
  },
  {
    id: "lock-yale-mueble-biometrico",
    name: "Cerradura Digital Biométrica Yale para Muebles, Cajones & Gabinetes",
    provider: "YALE",
    providerName: "Yale Ecuador",
    versionTag: "Biometría Mini // Cajones, Armarios & Muebles YF67",
    badge: "🔒 MUEBLES & GABINETES",
    category: "airbnb",
    image: "/images/cerraduras/yale/yale-cerradura-digital-para-mueble-yf67-1.png",
    priceBase: 34.84,
    highlights: [
      "Sensor biométrico ultra compacto para cajones de oficina, vitrinas y armarios",
      "Apertura instantánea en 0.2 segundos al colocar el dedo",
      "Batería recargable vía micro-USB con bajo consumo de energía",
      "Instalación discreta y elegante en cualquier tipo de mueble de madera o metal"
    ],
    methods: ["Huella Digital", "Llave USB de Emergencia"],
    differentiator: "Protege documentos confidenciales, dinero o pertenencias valiosas en tu oficina u hogar.",
    description: "Cerradura biométrica compacta Yale para muebles, gavetas y armarios de seguridad."
  },

  // ─── BANCO DEL PERNO (BP / VOLTEX / PLASMA / HYPERBOLT / IONSECURE / QUANTUM / NOVA) ───
  {
    id: "lock-bp-voltex-bp03899",
    name: "Cerradura Electrónica Premium Voltex Lock (SKU: BP03899)",
    provider: "BP",
    providerName: "Banco del Perno (BP)",
    versionTag: "SKU: BP03899 // Cerrojo Smart Compacto // Huella & Clave",
    badge: "⚡ ECONÓMICA SMART",
    category: "cerrojo",
    image: "/images/cerraduras/bp/bp-voltex-lock-bp03899.png",
    priceBase: 69.99,
    highlights: [
      "Código de catálogo oficial BP03899 con IVA incluido",
      "Teclado táctil numérico iluminado con modo antiespía",
      "Sensor biométrico de huella digital de alta sensibilidad",
      "Conectividad Bluetooth integrada y gestión desde smartphone",
      "Bloqueo automático programable al cerrar la puerta",
      "Alimentación por 4 baterías AA con puerto micro-USB de respaldo"
    ],
    methods: ["Huella Digital", "Clave Numérica Táctil", "App Bluetooth", "Tarjeta de Proximidad", "Llave Mecánica"],
    differentiator: "Cerrojo inteligente compacto de Banco del Perno al precio más accesible, ideal para mantener la manija existente.",
    description: "Cerradura electrónica premium Voltex Lock con cerrojo motorizado y teclado numérico táctil."
  },
  {
    id: "lock-bp-plasma-bp03900",
    name: "Cerradura Electrónica Premium Plasma Lock (SKU: BP03900)",
    provider: "BP",
    providerName: "Banco del Perno (BP)",
    versionTag: "SKU: BP03900 // Manija Digital 5 en 1 // Biometría",
    badge: "🔥 MÁS VENDIDO BP",
    category: "manija",
    image: "/images/cerraduras/bp/bp-plasma-lock-bp03900.png",
    priceBase: 79.99,
    highlights: [
      "Código de catálogo oficial BP03900 con IVA incluido",
      "5 métodos de apertura: Huella dactilar, clave PIN, tarjeta RFID, Bluetooth y llave",
      "Sensor semiconductor de huella integrado ergonómicamente en la manija",
      "Generación de contraseñas temporales por fecha/hora para visitas y Airbnb",
      "Cuerpo de aleación de zinc de alta durabilidad con acabado negro mate",
      "Compatible con embutidos estándar de 50mm a 70mm"
    ],
    methods: ["Huella Ergonómica", "Clave PIN", "Tarjetas RFID IC", "App Móvil", "Llave de Respaldo"],
    differentiator: "La manija inteligente más versátil y equilibrada de Banco del Perno para departamentos y residencias.",
    description: "Cerradura electrónica premium Plasma Lock con manija reversible de alta resistencia y 5 accesos.",
    popular: true
  },
  {
    id: "lock-bp-hyperbolt-bp03895",
    name: "Cerradura Electrónica Premium Hyperbolt Lock (SKU: BP03895)",
    provider: "BP",
    providerName: "Banco del Perno (BP)",
    versionTag: "SKU: BP03895 // Cerrojo Reforzado Doble Paso // Alta Seguridad",
    badge: "🛡️ DOBLE CERROJO BP",
    category: "manija",
    image: "/images/cerraduras/bp/bp-hyperbolt-lock-bp03895.png",
    priceBase: 79.99,
    highlights: [
      "Código de catálogo oficial BP03895 con IVA incluido",
      "Cerrojo mecánico reforzado de alta seguridad con pasadores dobles de acero macizo",
      "Lector biométrico de huella en la manija para apertura en un solo movimiento",
      "Teclado numérico táctil con tecnología de código señuelo contra mirones",
      "Tarjetas inteligentes de proximidad RFID incluidas en el kit",
      "Alarma disuasoria ante forcejeo o intentos fallidos de clave"
    ],
    methods: ["Huella en Manija", "Teclado Táctil", "Tarjetas Proximidad", "App Móvil", "Llaves Computarizadas"],
    differentiator: "Máxima robustez de cerrojo mecánico combinado con apertura biométrica ultra rápida.",
    description: "Cerradura digital de alta seguridad Hyperbolt Lock con cerrojo de doble paso reforzado."
  },
  {
    id: "lock-bp-ionsecure-bp03897",
    name: "Cerradura Electrónica Premium Ionsecure Lock (SKU: BP03897)",
    provider: "BP",
    providerName: "Banco del Perno (BP)",
    versionTag: "SKU: BP03897 // Cámara HD + Pantalla LCD // Biometría Top",
    badge: "📹 CÁMARA & PANTALLA BP",
    category: "facial",
    image: "/images/cerraduras/bp/bp-ionsecure-lock-bp03897.png",
    priceBase: 109.99,
    highlights: [
      "Código de catálogo oficial BP03897 con IVA incluido",
      "Videocámara exterior HD integrada para ver a quién toca a la puerta",
      "Pantalla interior a color para visualización clara desde el interior de la casa",
      "Envío de alertas fotográficas y videollamada al celular al pulsar el timbre",
      "Sensor biométrico de huella digital de grado bancario",
      "Batería recargable de litio de larga duración con aviso de recarga"
    ],
    methods: ["Videocámara HD", "Huella Digital", "Pantalla Interior", "App Móvil WiFi", "Clave PIN", "Tarjetas RFID", "Llaves"],
    differentiator: "Videoportero y cerradura biométrica de alta gama en un solo equipo con pantalla interior a color.",
    description: "Cerradura inteligente tope de gama Ionsecure Lock con cámara HD y pantalla interior LCD.",
    popular: true
  },
  {
    id: "lock-bp-quantum-bp03896",
    name: "Cerradura Electrónica Premium Quantum Lock (SKU: BP03896)",
    provider: "BP",
    providerName: "Banco del Perno (BP)",
    versionTag: "SKU: BP03896 // Perfil Slim Delgado // Aluminio & Madera",
    badge: "💎 PERFIL SLIM BP",
    category: "manija",
    image: "/images/cerraduras/bp/bp-quantum-lock-bp03896.png",
    priceBase: 99.99,
    highlights: [
      "Código de catálogo oficial BP03896 con IVA incluido",
      "Perfil ultra delgado estilizado especial para perfiles de aluminio europeo, vidrio y madera",
      "Lector biométrico semiconductor en la empuñadura de rápida respuesta (<0.3s)",
      "Teclado táctil vertical numérico iluminado",
      "Tarjetas de proximidad IC Card de alta frecuencia",
      "Mortise de perfil estrecho de acero inoxidable SUS304"
    ],
    methods: ["Huella Semiconductora", "App Móvil Bluetooth/WiFi", "Teclado Vertical Táctil", "Tarjetas RFID", "Llaves Ocultas"],
    differentiator: "Especialmente diseñada para puertas de perfil angosto de aluminio, mamparas de vidrio o accesos modernos.",
    description: "Cerradura electrónica de diseño arquitectónico Quantum Lock con perfil estilizado delgado."
  },
  {
    id: "lock-bp-nova-bp03898",
    name: "Cerradura Electrónica Premium Nova Lock (SKU: BP03898)",
    provider: "BP",
    providerName: "Banco del Perno (BP)",
    versionTag: "SKU: BP03898 // Luxury Push-Pull // Cierre 100% Automático",
    badge: "👑 LÍNEA LUXURY NOVA",
    category: "manija",
    image: "/images/cerraduras/bp/bp-nova-lock-bp03898.png",
    priceBase: 129.99,
    highlights: [
      "Código de catálogo oficial BP03898 con IVA incluido",
      "Diseño arquitectónico de lujo con panel de vidrio templado negro 2.5D",
      "Mecanismo de cierre motorizado 100% automático al cerrar la puerta",
      "Sensor biométrico FPC sueco de alta resolución para huellas dactilares",
      "Gestión remota por app con historial de aperturas y notificaciones en tiempo real",
      "Mortise electrónico de 4 pasadores macizos de alta seguridad"
    ],
    methods: ["Huella FPC Sueca", "App Remota", "Vidrio Templado Táctil", "Tarjetas RFID", "Llaves Maestras"],
    differentiator: "La cerradura insignia más exclusiva de Banco del Perno: motorización automática total y diseño italiano de lujo.",
    description: "Cerradura digital de lujo Nova Lock con motorización automática y panel de vidrio templado."
  },

  // ─── SISEGUSA / ZKTECO / HIKVISION / EZVIZ ───
  {
    id: "lock-zkteco-tl800",
    name: "Cerradura Digital ZKTeco TL800 con Videocámara, Pantalla LCD & WiFi ZSmart",
    provider: "SISEGUSA",
    providerName: "Sisegusa / ZKTeco",
    versionTag: "Flagship ZKTeco // Cámara HD + Pantalla LCD // WiFi ZSmart",
    badge: "🏆 FLAGSHIP ZKTECO",
    category: "facial",
    image: "/images/cerraduras/zkteco/zk-tl800.png",
    priceBase: 238.00,
    highlights: [
      "Videocámara HD frontal gran angular con visión nocturna infrarroja",
      "Pantalla interior a color OLED para ver quién está al otro lado",
      "Envío de fotografía y videollamada al smartphone al tocar el timbre",
      "Lector de huella digital capacitivo de alta precisión (<0.5s)",
      "Batería recargable de litio de 4200 mAh de larga duración"
    ],
    methods: ["Videocámara HD", "Huella Digital", "App ZSmart WiFi", "Contraseña Táctil", "Tarjetas RFID IC", "Llave Mecánica"],
    differentiator: "La cúspide tecnológica de ZKTeco: videoportero y cerradura biométrica de lujo en un solo equipo.",
    description: "Cerradura inteligente insignia ZKTeco TL800 con videocámara HD, pantalla LCD y cerradura motorizada.",
    popular: true
  },
  {
    id: "lock-zkteco-tl400b-left",
    name: "Cerradura Digital ZKTeco TL400B Izquierda con Huella, Bluetooth & Teclado",
    provider: "SISEGUSA",
    providerName: "Sisegusa / ZKTeco",
    versionTag: "Manija Izquierda // Sensor FPC // Bluetooth 4.0",
    badge: "🛡️ ZKTECO BIOMETRÍA",
    category: "manija",
    image: "/images/cerraduras/zkteco/zk-tl400b-left.png",
    priceBase: 175.00,
    highlights: [
      "Orientación de manija izquierda para puertas de apertura a la izquierda",
      "Sensor semiconductor FPC de grado bancario para 100 huellas",
      "Conectividad Bluetooth 4.0 con administración desde app ZKBioBT",
      "Guía interactiva por voz en español y pantalla OLED integrada",
      "Grosor de puerta compatible: 35 a 65mm con mortise reforzado"
    ],
    methods: ["Huella Semiconductora", "App Bluetooth", "Teclado Táctil", "Tarjetas Mifare", "Llave Oculta"],
    differentiator: "Diseño industrial de vanguardia y máxima robustez certificada para puertas principales.",
    description: "Cerradura inteligente para puerta principal ZKTeco TL400B con orientación izquierda y Bluetooth."
  },
  {
    id: "lock-zkteco-tl400b-right",
    name: "Cerradura Digital ZKTeco TL400B Derecha con Huella, Bluetooth & Teclado",
    provider: "SISEGUSA",
    providerName: "Sisegusa / ZKTeco",
    versionTag: "Manija Derecha // Sensor FPC // Bluetooth 4.0",
    badge: "🛡️ ZKTECO BIOMETRÍA",
    category: "manija",
    image: "/images/cerraduras/zkteco/zk-tl400b-right.png",
    priceBase: 175.00,
    highlights: [
      "Orientación de manija derecha para puertas de apertura a la derecha",
      "Sensor biométrico de huella digital semiconductor de alta sensibilidad",
      "Capacidad para 100 huellas, 100 contraseñas y 100 tarjetas Mifare",
      "Alarma inteligente ante intentos de intrusión o batería baja"
    ],
    methods: ["Huella Semiconductora", "App Bluetooth", "Teclado Táctil", "Tarjetas Mifare", "Llave Oculta"],
    differentiator: "Reconocimiento biométrico instantáneo con manija reversible de alta resistencia.",
    description: "Cerradura inteligente para puerta principal ZKTeco TL400B con orientación derecha."
  },
  {
    id: "lock-zkteco-lh6000-left",
    name: "Cerradura Hotelera de Proximidad RFID ZKTeco LH6000 Izquierda",
    provider: "SISEGUSA",
    providerName: "Sisegusa / ZKTeco",
    versionTag: "RFID Mifare 13.56MHz // Hoteles & Rentas Cortas // Acero Inox",
    badge: "🏨 LÍNEA HOTELERA",
    category: "airbnb",
    image: "/images/cerraduras/zkteco/zk-lh6000-left.png",
    priceBase: 89.90,
    highlights: [
      "Lector sin contacto para tarjetas inteligentes Mifare-1 13.56 MHz",
      "Cuerpo de acero inoxidable SUS304 para uso intensivo en hoteles",
      "Mortise estándar americano con 5 pestillos de alta seguridad",
      "Almacena auditoría de los últimos 224 registros de apertura",
      "Compatible con software hotelero ZKBioAccess / ZKHotel"
    ],
    methods: ["Tarjeta RFID Mifare", "Llave Mecánica de Emergencia"],
    differentiator: "Especialmente construida para hoteles, posadas y edificios de departamentos en renta.",
    description: "Cerradura electrónica hotelera ZKTeco LH6000 con lector de proximidad RFID y manija izquierda."
  },
  {
    id: "lock-zkteco-lh6000-right",
    name: "Cerradura Hotelera de Proximidad RFID ZKTeco LH6000 Derecha",
    provider: "SISEGUSA",
    providerName: "Sisegusa / ZKTeco",
    versionTag: "RFID Mifare 13.56MHz // Manija Derecha // Auditoría 224 Eventos",
    badge: "🏨 LÍNEA HOTELERA",
    category: "airbnb",
    image: "/images/cerraduras/zkteco/zk-lh6000-right.png",
    priceBase: 89.90,
    highlights: [
      "Orientación de manija derecha para habitaciones hoteleras",
      "Lector de proximidad ultra rápido sin contacto",
      "Diseño estilizado en acero inoxidable anticorrosión",
      "Compatible con tarjetas maestras de piso, de servicio y huéspedes"
    ],
    methods: ["Tarjeta RFID Mifare", "Llave Mecánica de Emergencia"],
    differentiator: "Elimina la pérdida de llaves y permite programar tarjetas por fecha y hora de checkout.",
    description: "Cerradura electrónica para hoteles ZKTeco LH6000 con apertura derecha."
  },
  {
    id: "lock-zkteco-ll-01",
    name: "Chapa Eléctrica ZKTeco LL-01 12VDC en Acero Inox con Botón Pulsador Interior",
    provider: "SISEGUSA",
    providerName: "Sisegusa / ZKTeco",
    versionTag: "12VDC // Acero Inoxidable // Botón Mecánico Interior",
    badge: "⚡ SOBREPONER 12V",
    category: "edificios",
    image: "/images/cerraduras/zkteco/zk-ll-01.png",
    priceBase: 32.50,
    highlights: [
      "Construcción íntegra en acero inoxidable resistente a la intemperie",
      "Botón mecánico de apertura interior integrado en la carcasa",
      "Alimentación 12VDC estándar para conexión a porteros, biométricos y receptores RF",
      "Pestillo reversible de latón macizo para puertas de apertura interior o exterior",
      "Incluye 3 llaves dentadas de seguridad exterior"
    ],
    methods: ["Pulso Eléctrico 12V", "Botón Mecánico Interior", "Llave Exterior"],
    differentiator: "Chapa de sobreponer ultra duradera para portones peatonales residenciales y comerciales.",
    description: "Cerradura eléctrica de sobreponer ZKTeco LL-01 de 12VDC construida en acero inoxidable."
  },
  {
    id: "lock-ezviz-dl05",
    name: "Cerradura Digital Inteligente EZVIZ DL05 con Huella, Teclado & WiFi",
    provider: "SISEGUSA",
    providerName: "Sisegusa / EZVIZ",
    versionTag: "Ecosistema EZVIZ // WiFi Directo // Huella Biométrica",
    badge: "📱 EZVIZ SMART",
    category: "manija",
    image: "/images/cerraduras/bp-quantum-lock.png",
    priceBase: 185.00,
    highlights: [
      "Conexión WiFi directa e integración en el ecosistema de seguridad EZVIZ",
      "Lector de huella biométrico en el eje de la manija",
      "Códigos temporales y periódicos para visitas y personal",
      "Alertas instantáneas de intentos de manipulación o apertura forzada"
    ],
    methods: ["Huella Digital", "App EZVIZ", "Código Táctil", "Tarjetas RFID", "Llave Mecánica"],
    differentiator: "Se integra perfectamente con tus cámaras y videoporteros EZVIZ en una sola app.",
    description: "Cerradura digital inteligente EZVIZ DL05 con conectividad WiFi nativa y lector biométrico."
  },
  {
    id: "lock-zkteco-ml100",
    name: "Cerrojo Inteligente ZKTeco ML100 con Huella Digital & Teclado Táctil",
    provider: "SISEGUSA",
    providerName: "Sisegusa / ZKTeco",
    versionTag: "Cerrojo Motorizado // Huella + Teclado Táctil",
    badge: "🔩 CERROJO SMART",
    category: "cerrojo",
    image: "/images/cerraduras/yale/yale-cerrojo-digital-yale-ydl120-1.png",
    priceBase: 115.00,
    highlights: [
      "Cerrojo motorizado de bloqueo automático",
      "Lector biométrico semiconductor de rápida respuesta",
      "Teclado numérico táctil retroiluminado",
      "Compatible con perforaciones estándar de cerrojo de 54mm"
    ],
    methods: ["Huella Digital", "Clave PIN", "Bluetooth Móvil", "Llaves"],
    differentiator: "Cerrojo biométrico robusto ideal para mantener tu manija de lujo existente.",
    description: "Cerrojo digital biométrico ZKTeco ML100 de alta seguridad con lector de huella dactilar."
  },
  {
    id: "lock-ezviz-hp7",
    name: "Videoportero Smart Híbrido EZVIZ HP7 con Apertura de Cerradura Eléctrica",
    provider: "SISEGUSA",
    providerName: "Sisegusa / EZVIZ",
    versionTag: "Pantalla Touch 7\" 2K + Conexión a Cerradura",
    badge: "📱 VIDEOPORTERO 2K",
    category: "edificios",
    image: "/images/seguridad/zkteco-vt07-product.jpg",
    priceBase: 165.00,
    highlights: [
      "Pantalla táctil a color de 7 pulgadas con resolución 2K Ultra HD",
      "Cámara exterior con visión nocturna infrarroja y detección de personas",
      "Apertura remota de cerradura eléctrica o pestillo electromagnético desde app EZVIZ",
      "Conexión Wi-Fi de doble banda (2.4 / 5 GHz)"
    ],
    methods: ["App EZVIZ Móvil", "Pantalla Touch 7\"", "Tarjeta RFID", "Reconocimiento de Personas"],
    differentiator: "Ve en video 2K quién toca a tu puerta desde cualquier lugar del mundo y ábrele con un toque.",
    description: "Sistema de videoportero inteligente EZVIZ HP7 con control de cerradura integrado."
  },
  {
    id: "combo-acceso-edificio",
    name: "Combo Seguridad Acceso Edificios Senseface 2A + Electroimán 600 Lbs + Botonera",
    provider: "SISEGUSA",
    providerName: "Sisegusa / ZKTeco",
    versionTag: "ZKTeco Multibiométrico // Edificios & Conjuntos",
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
    description: "Solución profesional de control de accesos para conjuntos residenciales, urbanizaciones cerradas y edificios."
  }
]

export default function CerradurasSmartClient() {
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>("quito")
  const [activeCategory, setActiveCategory] = useState<string>("todos")
  const [activeProvider, setActiveProvider] = useState<string>("todos")
  const [modalProduct, setModalProduct] = useState<SmartLockProduct | null>(null)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  // Current selected province object
  const selectedProvince = useMemo(() => {
    return PROVINCES_DATA.find((p) => p.id === selectedProvinceId) || PROVINCES_DATA[0]
  }, [selectedProvinceId])

  // Filtered products by both Category and Provider
  const filteredProducts = useMemo(() => {
    return SMART_LOCK_KITS.filter((p) => {
      const matchCat = activeCategory === "todos" || p.category === activeCategory
      const matchProv = activeProvider === "todos" || p.provider === activeProvider
      return matchCat && matchProv
    })
  }, [activeCategory, activeProvider])

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
      `🏢 Proveedor: ${product.providerName}\n` +
      `🏷️ Versión: ${product.versionTag}\n` +
      `📍 Provincia / Ciudad: ${province.name}\n` +
      `🌎 Región: ${province.region}\n` +
      `💵 Precio Producto (30% OFF): $${product.priceBase.toFixed(2)}\n` +
      `🛠️ Instalación Profesional: $${province.cost.toFixed(2)}\n` +
      `💰 TOTAL OFERTA KIT: $${total} USD\n\n` +
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
            PRODUCTOS 100% ORIGINALES // CRONTE • YALE • BP • YAE • SISEGUSA // GARANTÍA DE INSTALACIÓN
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
            Disponemos del catálogo más completo de cerraduras inteligentes homologadas de proveedores líderes: <strong>CRONTE, YALE ECUADOR, BANCO DEL PERNO (BP), YAE SMART LIFE y SISEGUSA / ZKTECO</strong>. Todas nuestras opciones se entregan como <strong>Kits con Instalación Profesional Garantizada</strong> en tu domicilio a nivel nacional con <strong>30% de Descuento Promocional</strong>.
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

          {/* ═══════════ OFFICIAL CAMPAIGN FLYER DISPLAY ═══════════ */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mt-8 max-w-3xl mx-auto rounded-3xl overflow-hidden border border-amber-400/30 shadow-2xl shadow-amber-500/15 bg-[#0a0910] p-2"
          >
            <img
              src="/images/cerraduras/cerraduras-instalacion-portada.jpg"
              alt="Instalación con tu Cerradura - Promoción 30% Descuento ATOMIC"
              className="w-full h-auto max-h-[520px] object-contain rounded-2xl mx-auto"
            />
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

      {/* ═══════════ FILTER CONTROLS: PROVEEDOR & CATEGORÍA ═══════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-4">
        
        <div className="flex flex-col gap-5 mb-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#14131C] border border-white/10 text-xs font-bold text-neutral-300 mb-2">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <span className="font-heading uppercase tracking-wider text-[11px]">CATÁLOGO MULTI-PROVEEDOR ({filteredProducts.length} MODELOS)</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-heading uppercase text-white tracking-tight">
                Cerraduras Smart de Proveedores Homologados
              </h2>
            </div>

            {/* Provider Quick Counts */}
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
              <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10">CRONTE</span>
              <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10">YALE</span>
              <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10">BP</span>
              <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10">YAE</span>
              <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10">SISEGUSA</span>
            </div>
          </div>

          {/* ─── FILTRO 1: POR PROVEEDOR HOMOLOGADO ─── */}
          <div>
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block mb-2 font-bold">
              1. Filtrar por Proveedor / Marca:
            </span>
            <div className="flex flex-wrap items-center gap-2 bg-[#121118] p-1.5 rounded-2xl border border-white/10 shadow-inner">
              {[
                { id: "todos", label: "TODOS LOS PROVEEDORES", count: SMART_LOCK_KITS.length },
                { id: "CRONTE", label: "🛡️ CRONTE TECHNOLOGY", count: SMART_LOCK_KITS.filter(p => p.provider === 'CRONTE').length },
                { id: "YALE", label: "🏆 YALE ECUADOR", count: SMART_LOCK_KITS.filter(p => p.provider === 'YALE').length },
                { id: "BP", label: "🔩 BANCO DEL PERNO (BP)", count: SMART_LOCK_KITS.filter(p => p.provider === 'BP').length },
                { id: "YAE", label: "⭐ YAE SMART LIFE", count: SMART_LOCK_KITS.filter(p => p.provider === 'YAE').length },
                { id: "SISEGUSA", label: "🏢 SISEGUSA & ZKTECO", count: SMART_LOCK_KITS.filter(p => p.provider === 'SISEGUSA').length },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveProvider(tab.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-heading uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                    activeProvider === tab.id
                      ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25 font-black scale-105"
                      : "text-neutral-400 hover:text-white hover:bg-white/[0.06]"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${activeProvider === tab.id ? 'bg-white/20 text-white' : 'bg-white/10 text-neutral-400'}`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* ─── FILTRO 2: POR TIPO DE CERRADURA ─── */}
          <div>
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block mb-2 font-bold">
              2. Filtrar por Tipo de Mecanismo / Uso:
            </span>
            <div className="flex flex-wrap items-center gap-2 bg-[#121118] p-1.5 rounded-2xl border border-white/10 shadow-inner">
              {[
                { id: "todos", label: "TODAS LAS CATEGORÍAS" },
                { id: "facial", label: "FACIAL 3D & MIRILLA" },
                { id: "manija", label: "MANIJAS CON HUELLA" },
                { id: "cerrojo", label: "CERROJOS DIGITALES" },
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
        
        {filteredProducts.length === 0 ? (
          <div className="bg-[#121118] border border-white/10 rounded-3xl p-12 text-center my-8">
            <Package size={36} className="text-neutral-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white uppercase font-heading">No se encontraron productos con estos filtros</h3>
            <p className="text-xs text-neutral-400 mt-1 mb-4">Prueba seleccionando "Todos los proveedores" o "Todas las categorías".</p>
            <button
              onClick={() => { setActiveProvider("todos"); setActiveCategory("todos"); }}
              className="px-5 py-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-white text-xs font-bold cursor-pointer"
            >
              Restablecer Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((product) => {
              const installedTotal = calculateTotal(product.priceBase, selectedProvince.cost)

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

                      {/* Provider Badge (Top Right) */}
                      <div className="absolute top-3.5 right-3.5 z-20">
                        <span className="px-2 py-0.5 rounded-lg bg-black/80 backdrop-blur-md border border-white/20 text-white font-mono text-[9px] font-bold uppercase tracking-wider">
                          {product.providerName}
                        </span>
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
        )}

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
                
                {/* Header with Product Image */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 pr-8">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-[#07070a] border border-white/10 p-2 flex items-center justify-center shrink-0 shadow-inner">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={modalProduct.image}
                      alt={modalProduct.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="px-2.5 py-0.5 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold font-heading uppercase tracking-widest">
                        {modalProduct.providerName}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-lg bg-white/10 text-neutral-300 border border-white/15 text-[10px] font-bold font-mono">
                        {modalProduct.versionTag}
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-white font-heading uppercase mt-1">
                      {modalProduct.name}
                    </h3>
                    <p className="text-xs text-neutral-400 mt-1">
                      {modalProduct.description}
                    </p>
                  </div>
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
              a: "El valor cubre la visita técnica en tu domicilio, retiro de tu cerradura antigua (si aplica), perforación y adaptación milimétrica del mortise en tu puerta, montaje electrónico de la cerradura, colocación de baterías, configuración de la aplicación móvil (Tuya/SmartLife/Yale/EZVIZ), registro de huellas/rostros/códigos y una explicación detallada de su funcionamiento."
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
              q: "¿Sirven para cualquier tipo de puerta (madera, metal, aluminio, vidrio)?",
              a: "Sí, contamos con modelos específicos para puertas de madera sólida, perfiles de aluminio europeo, rejas de metal, puertas blindadas y puertas de vidrio templado (con abrazadera sin perforación). Nuestros técnicos llevan herramientas para cada material."
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
            <span>ATOMIC // CERRADURAS SMART • CRONTE • YALE • BP • YAE • SISEGUSA</span>
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
          © {new Date().getFullYear()} ATOMIC Electronics & Technologies. Red nacional de instalación y distribución multimarca en las 24 provincias de Ecuador.
        </p>
      </footer>

    </div>
  )
}
