"use client"

// Version: 3.0.0 — ATOMIC × Appit Theme Integration (Inter Tight + Instrument Sans, real Appit CSS tokens)
import { useState, useRef, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import {
  ShoppingBag, ChevronRight, ArrowRight, Shield, Zap, Truck,
  ChevronLeft, Hexagon, Star, X, Smartphone, Sparkles, Code, Bot,
  Search, ImageOff, Home, Building, Factory, Cpu, Gamepad2, Utensils, Laptop, Award, User, Settings, ChevronDown, Package, LogIn, Menu,
  Wrench, Clock, ShieldCheck, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, Briefcase, Loader2,
  Youtube, Play, PhoneCall, MessageSquare, Tag, Flame, Percent, ArrowUpRight, BookOpen, Layers, Check, Copy, GraduationCap, Share2
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import dynamic from "next/dynamic"
import { calculateDiscountedPrice } from "@/lib/utils/pricing"
import FuturisticParallaxSection from "@/components/web/FuturisticParallaxSection"

const OFERTAS_COVERFLOW_SLIDES = [
  { 
    image: { src: "/images/promociones/repuestos-computadoras-portada.jpg", alt: "Línea de Repuestos para Computadoras y Laptops" },
    title: "LÍNEA DE REPUESTOS PARA COMPUTADORAS\nBaterías, Cargadores, RAM, CPUs, Cases & Fuentes", 
    badge: "REPUESTOS ORIGINALES", 
    src: "/images/promociones/repuestos-computadoras-portada.jpg", 
    link: "/web/repuestos" 
  },
  { 
    image: { src: "/images/promociones/cargador-wallbox-mevo.jpg", alt: "Cargadores de Auto Eléctrico Wallbox Livoltek Mevo" },
    title: "CARGADORES DE AUTO ELÉCTRICO\nWallbox Livoltek Mevo 7.3 kW & Portátiles 220V", 
    badge: "MOVILIDAD ELÉCTRICA", 
    src: "/images/promociones/cargador-wallbox-mevo.jpg", 
    link: "/web/cargadores-electricos" 
  },
  { 
    image: { src: "/images/promociones/apple-portada.jpg", alt: "Ecosistema Apple Oficial Ecuador" },
    title: "ECOSISTEMA APPLE OFICIAL ECUADOR\nMacBook M2/M3/M4/M5, iPhone 13 al 17 Pro Max, iPad & Watch", 
    badge: "APPLE STORE", 
    src: "/images/promociones/apple-portada.jpg", 
    link: "/web/apple" 
  },
  { 
    image: { src: "/images/promociones/laptops-portada.jpg", alt: "Línea de Laptops & Computación ATOMIC" },
    title: "LÍNEA DE COMPUTACIÓN & LAPTOPS ATOMIC\nPortátiles Profesionales, PCs de Escritorio, All-in-One y Mini PCs", 
    badge: "COMPUTACIÓN", 
    src: "/images/promociones/laptops-portada.jpg", 
    link: "/web/laptops" 
  },
  { 
    image: { src: "/images/promociones/cercos-electricos-portada.jpg", alt: "Barreras de Cerco Eléctrico de Alta Precisión" },
    title: "BARRERAS DE CERCO ELÉCTRICO DE ALTA PRECISIÓN\nSistemas Electrificadores Inteligentes, Disuasión Activa y Monitoreo 24/7", 
    badge: "SEGURIDAD PERIMETRAL", 
    src: "/images/promociones/cercos-electricos-portada.jpg", 
    link: "/web/cercos-electricos" 
  },
  { 
    image: { src: "/images/cerraduras/cerraduras-instalacion-portada.jpg", alt: "Promoción 30% Descuento en Cerraduras Smart con Instalación" },
    title: "PROMOCIÓN 30% DE DESCUENTO EN CERRADURAS SMART\nAl Comprar tu Cerradura y Adquirirla con Instalación", 
    badge: "30% DE DESCUENTO", 
    src: "/images/cerraduras/cerraduras-instalacion-portada.jpg", 
    link: "/web/cerraduras-smart" 
  },
  { 
    image: { src: "/banners/camaras-hogar-portada-4k.jpg", alt: "Cámaras para Hogar de Alta Calidad 4K con Garantía de 2 Años" },
    title: "CÁMARAS PARA HOGAR CON GARANTÍA DE 2 AÑOS\nSeguridad Inteligente 4K & Wi-Fi Sin Cables", 
    badge: "GARANTÍA 2 AÑOS", 
    src: "/banners/camaras-hogar-portada-4k.jpg", 
    link: "/web/camaras-hogar" 
  },
  { 
    image: { src: "/images/barreras/barreras-portada-promociones.jpg", alt: "Barreras Vehiculares Automáticas & Control de Acceso" },
    title: "BARRERAS VEHICULARES AUTOMÁTICAS & CONTROL DE ACCESO\nSistemas Brushless de 1.5s a 6s para Urbanizaciones e Industrias", 
    badge: "NUEVA LÍNEA", 
    src: "/images/barreras/barreras-portada-promociones.jpg", 
    link: "/web/barreras-vehiculares" 
  },
]

const PROMO_COVERFLOW_SLIDES = [
  { 
    image: { src: "/images/cerraduras/cerraduras-instalacion-portada.jpg", alt: "Promoción 30% Descuento en Cerraduras Smart con Instalación" },
    title: "CERRADURA SMART BIOMÉTRICA CON INSTALACIÓN\nManija Digital + Reconocimiento de Huella & Clave (30% OFF)", 
    badge: "30% OFF COMBO", 
    src: "/images/cerraduras/cerraduras-instalacion-portada.jpg", 
    link: "/web/cerraduras-smart" 
  },
  { 
    image: { src: "/images/promociones/cargador-wallbox-mevo.jpg", alt: "Cargadores de Auto Eléctrico Wallbox Livoltek Mevo" },
    title: "CARGADOR WALLBOX LIVOLTEK MEVO 7.3 kW\nCarga Ultrarrápida 220V + Cable Type 2 de 5 Metros", 
    badge: "MOVILIDAD ELÉCTRICA", 
    src: "/images/promociones/cargador-wallbox-mevo.jpg", 
    link: "/web/cargadores-electricos" 
  },
  { 
    image: { src: "/images/promociones/apple-portada.jpg", alt: "Ecosistema Apple Oficial Ecuador" },
    title: "MACBOOK M3/M4 & IPHONE 16 PRO MAX EN ECUADOR\nFundas, Magsafe y Accesorios con Envío Nacional Gratis", 
    badge: "APPLE STORE", 
    src: "/images/promociones/apple-portada.jpg", 
    link: "/web/apple" 
  },
  { 
    image: { src: "/images/promociones/laptops-portada.jpg", alt: "Línea de Laptops & Computación ATOMIC" },
    title: "LAPTOPS CORE I7 / RYZEN 7 + MOCHILA & MOUSE\nConfiguraciones de Alta Velocidad para Estudio y Oficina", 
    badge: "BUNDLE LAPTOP", 
    src: "/images/promociones/laptops-portada.jpg", 
    link: "/web/laptops" 
  },
  { 
    image: { src: "/images/promociones/cercos-electricos-portada.jpg", alt: "Barreras de Cerco Eléctrico de Alta Precisión" },
    title: "CERCO ELÉCTRICO INTELIGENTE 10.000V\nElectrificador + Batería de Respaldo + Sirena 30W", 
    badge: "SEGURIDAD 24/7", 
    src: "/images/promociones/cercos-electricos-portada.jpg", 
    link: "/web/cercos-electricos" 
  },
  { 
    image: { src: "/images/parlantes/parlante-smart-rendimiento.jpg", alt: "Parlante Smart Alto Rendimiento con Audífonos TWS de Regalo" },
    title: "PARLANTE SMART ALTO RENDIMIENTO + TWS\nBajos Envolventes 360° + Audífonos Bluetooth de Regalo", 
    badge: "REGALO AUDÍFONOS", 
    src: "/images/parlantes/parlante-smart-rendimiento.jpg", 
    link: "/web/parlante-smart" 
  },
  { 
    image: { src: "/banners/camaras-hogar-portada-4k.jpg", alt: "Cámaras para Hogar de Alta Calidad 4K con Garantía de 2 Años" },
    title: "KIT 4 CÁMARAS WI-FI 4K CON GARANTÍA 2 AÑOS\nVisión Nocturna a Color + Detección de Personas por IA", 
    badge: "GARANTÍA 2 AÑOS", 
    src: "/banners/camaras-hogar-portada-4k.jpg", 
    link: "/web/camaras-hogar" 
  },
]

const TEMPORADA_COVERFLOW_SLIDES = [
  { 
    image: { src: "/images/scooters/scooter-ninebot-f25.jpg", alt: "Scooters Eléctricos Smart Ninebot & KickScooter" },
    title: "SCOOTERS ELÉCTRICOS SMART 2026\nSegway Ninebot F25 ($489) y ES1L ($412)", 
    badge: "MOVILIDAD SMART", 
    src: "/images/scooters/scooter-ninebot-f25.jpg", 
    link: "/web/scooters" 
  },
  { 
    image: { src: "/images/bicicletas/bicicleta-shimano-r8014.jpg", alt: "Bicicletas Eléctricas Shimano & Montaña" },
    title: "BICICLETAS ELÉCTRICAS • TEMPORADA 2026\n25% OFF General y 40% OFF para Estudiantes", 
    badge: "25% - 40% OFF", 
    src: "/images/bicicletas/bicicleta-shimano-r8014.jpg", 
    link: "/web/bicicletas-electricas" 
  },
  { 
    image: { src: "/images/promociones/cargador-wallbox-mevo.jpg", alt: "Cargadores de Auto Eléctrico Wallbox Livoltek Mevo" },
    title: "CARGADORES DE AUTO ELÉCTRICO WALLBOX\nPotencia 7.3 kW 220V para Hogar & Residencias", 
    badge: "ELECTROMOVILIDAD", 
    src: "/images/promociones/cargador-wallbox-mevo.jpg", 
    link: "/web/cargadores-electricos" 
  },
  { 
    image: { src: "/images/luminarias/luces-led-solares-300-800w.jpg", alt: "Luminarias Solares Autónomas Atomeca" },
    title: "LUMINARIAS SOLARES AUTÓNOMAS IP65\n300W, 600W y 800W con Panel Solar y Control Remoto", 
    badge: "ENERGÍA SOLAR", 
    src: "/images/luminarias/luces-led-solares-300-800w.jpg", 
    link: "/web/luminarias-solares" 
  },
  { 
    image: { src: "/images/pizarras/pizarra-smart-4k-75.jpg", alt: "Pizarra Smart Interactiva 4K UHD 75" },
    title: "PIZARRA SMART INTERACTIVA 4K UHD 75\"\nViewBoard IFP7550-5F • Android 11 • 8GB/128GB", 
    badge: "SMART 4K", 
    src: "/images/pizarras/pizarra-smart-4k-75.jpg", 
    link: "/web/pizarras-smart" 
  },
  { 
    image: { src: "/images/camaras/camara-wifi-bateria.jpg", alt: "Cámaras de Seguridad Wi-Fi a Batería" },
    title: "CÁMARAS WI-FI A BATERÍA SIN CABLES\n100% Inalámbricas • Visión Nocturna y Audio Bidireccional", 
    badge: "100% WI-FI", 
    src: "/images/camaras/camara-wifi-bateria.jpg", 
    link: "/web/camaras-wifi" 
  },
  { 
    image: { src: "/images/monitores/monitor-dahua-19.jpg", alt: "Monitor Dahua DH-LM19 LED Bajo Consumo" },
    title: "MONITORES DAHUA LED 24/7 CCTV\nResolución HD+ 1600x900 • Entradas HDMI & VGA", 
    badge: "DAHUA CCTV", 
    src: "/images/monitores/monitor-dahua-19.jpg", 
    link: "/web/monitores" 
  },
]

const COMBOS_COVERFLOW_SLIDES = [
  { 
    image: { src: "/images/generadores/comparativa-generadores.jpg", alt: "Generadores Eléctricos vs Gasolina" },
    title: "COMBO GENERADORES ELÉCTRICOS + PANELES\nConfigura tu Estación Solar o Generador a la Medida", 
    badge: "CONFIGURADOR", 
    src: "/images/generadores/comparativa-generadores.jpg", 
    link: "/web/generadores" 
  },
  { 
    image: { src: "/images/generadores/generadores-ecofriendly.jpg", alt: "Generadores Ecofriendly Silenciosos" },
    title: "ESTACIONES DE ENERGÍA ECOFRIENDLY\nCero Emisiones • 100% Silencioso • Recarga Solar", 
    badge: "ECOFRIENDLY", 
    src: "/images/generadores/generadores-ecofriendly.jpg", 
    link: "/web/generadores" 
  },
  { 
    image: { src: "/images/consolas/ps4-slim-reacondicionada.jpg", alt: "PS4 Slim Reacondicionada $325" },
    title: "PLAYSTATION 4 SLIM REACONDICIONADA $325\n2 Controles + Parlante Gratis + 2 Años de Garantía", 
    badge: "BUNDLE PS4", 
    src: "/images/consolas/ps4-slim-reacondicionada.jpg", 
    link: "/web/playstation-4" 
  },
  { 
    image: { src: "/images/consolas/control-wireless-gaming.jpg", alt: "Control Wireless Bluetooth Gaming" },
    title: "CONTROL WIRELESS GAMING (AMC-2885) $29.99\nPC, Android, iOS • Audífonos y Envío Gratis", 
    badge: "OFERTA GAMING", 
    src: "/images/consolas/control-wireless-gaming.jpg", 
    link: "/web/playstation-4" 
  },
  { 
    image: { src: "/images/repuestos/repuestos-portada.jpg", alt: "Cargadores de Laptop por Mayor" },
    title: "CARGADORES DE LAPTOP POR MAYOR\nCompra 6 Unidades a Precio de Distribuidor Exclusivo", 
    badge: "MAYORISTA 6+ U.", 
    src: "/images/repuestos/repuestos-portada.jpg", 
    link: "/web/cargadores-laptop" 
  },
  { 
    image: { src: "/images/cerraduras/cerraduras-instalacion-portada.jpg", alt: "Combo Cerradura Smart con Instalación" },
    title: "COMBO CERRADURA SMART + INSTALACIÓN PROFESIONAL\nGarantía en Producto e Instalación a Nivel Nacional", 
    badge: "SUPER COMBO", 
    src: "/images/cerraduras/cerraduras-instalacion-portada.jpg", 
    link: "/web/cerraduras-smart" 
  },
  { 
    image: { src: "/banners/camaras-hogar-portada-4k.jpg", alt: "Combo Cámaras Hogar 4K con Garantía 2 Años" },
    title: "COMBO CÁMARAS HOGAR 4K CON GARANTÍA DE 2 AÑOS\nMonitoreo 24/7 en Celular + Detección IA", 
    badge: "COMBO SEGURIDAD", 
    src: "/banners/camaras-hogar-portada-4k.jpg", 
    link: "/web/camaras-hogar" 
  },
]

const INSTALACION_COVERFLOW_SLIDES = [
  { 
    image: { src: "/images/servidores/catalogo-servidores.jpg", alt: "Servidores Empresariales con Instalación" },
    title: "CATÁLOGO DE SERVIDORES CON INSTALACIÓN TI\nDell PowerEdge, HPE & Supermicro para Empresas", 
    badge: "SERVIDORES RACK", 
    src: "/images/servidores/catalogo-servidores.jpg", 
    link: "/web/servidores" 
  },
  { 
    image: { src: "/images/videoporteros/videoportero-diel-10.jpg", alt: "Videoportero DIEL 10 con Botonera Antivandálica" },
    title: "VIDEOPORTERO DIEL 10\" + BOTONERA METÁLICA\nInstalación Residencial & Comercial Garantizada", 
    badge: "VIDEOPORTEROS", 
    src: "/images/videoporteros/videoportero-diel-10.jpg", 
    link: "/web/videoporteros" 
  },
  { 
    image: { src: "/images/videoporteros/ezviz-cb1-hp7.jpg", alt: "Portero Smart EZVIZ HP7 CB1 Inalámbrico" },
    title: "PORTERO SMART EZVIZ HP7 CB1 SIN CABLES\nPantalla Táctil 7\" • Desbloqueo RFID • App Móvil", 
    badge: "100% INALÁMBRICO", 
    src: "/images/videoporteros/ezviz-cb1-hp7.jpg", 
    link: "/web/videoporteros" 
  },
  { 
    image: { src: "/images/promociones/cercos-electricos-portada.jpg", alt: "Cercos Eléctricos con Instalación" },
    title: "BARRERAS DE CERCO ELÉCTRICO CON INSTALACIÓN\nSistemas Electrificadores Inteligentes y Monitoreo 24/7", 
    badge: "CERCOS SMART", 
    src: "/images/promociones/cercos-electricos-portada.jpg", 
    link: "/web/cercos-electricos" 
  },
  { 
    image: { src: "/images/cerraduras/cerraduras-instalacion-portada.jpg", alt: "Instalación con tu Cerradura ATOMIC" },
    title: "INSTALACIÓN DE CERRADURAS SMART ATOMIC\n30% OFF en Mano de Obra al Adquirirla con Cerradura", 
    badge: "INSTALACIÓN SMART", 
    src: "/images/cerraduras/cerraduras-instalacion-portada.jpg", 
    link: "/web/cerraduras-smart" 
  },
  { 
    image: { src: "/banners/camaras-hogar-portada-4k.jpg", alt: "Cámaras para Hogar con Garantía de 2 Años" },
    title: "CÁMARAS PARA HOGAR CON GARANTÍA DE 2 AÑOS\nInstalación & Montaje Técnico en las 24 Provincias", 
    badge: "GARANTÍA 2 AÑOS", 
    src: "/banners/camaras-hogar-portada-4k.jpg", 
    link: "/web/camaras-hogar" 
  },
  { 
    image: { src: "/images/camaras/camara-exterior-imou.jpg", alt: "Cámara Exterior Profesional IMOU 360" },
    title: "CÁMARA EXTERIOR PROFESIONAL IMOU 360°\nAntena Dual Wi-Fi • Micrófono • Configuración Incluida", 
    badge: "EXTERIOR IP66", 
    src: "/images/camaras/camara-exterior-imou.jpg", 
    link: "/web/camaras-wifi" 
  },
]

const SERVICIOS_COVERFLOW_SLIDES = [
  { 
    image: { src: "/images/software/automatizacion-bot-99.jpg", alt: "Bot Inteligente 24/7 Atomic Systems" },
    title: "TEN UN BOT INTELIGENTE QUE TRABAJA 24/7 ($99/MES)\nAtiende WhatsApp, Factura SRI, Llama con Voz IA & Agenda", 
    badge: "$99 AL MES", 
    src: "/images/software/automatizacion-bot-99.jpg", 
    link: "/web/automatizacion" 
  },
  { 
    image: { src: "/images/software/atencion-bot-24-7.jpg", alt: "Módulo Atiende Bot 24/7" },
    title: "MÓDULO ATIENDE • RESPUESTAS EN VIVO 24/7\nFlujos Lógicos • Cotizaciones PDF • Reportes Excel", 
    badge: "ATENCIÓN 24/7", 
    src: "/images/software/atencion-bot-24-7.jpg", 
    link: "/web/automatizacion" 
  },
  { 
    image: { src: "/images/software/facturacion-cotizacion.jpg", alt: "Facturación SRI y Cotización Oficial" },
    title: "FACTURACIÓN ELECTRÓNICA CONECTADA AL SRI\nEmisión Oficial de Facturas, Histórico y Cobranza", 
    badge: "SRI ECUADOR", 
    src: "/images/software/facturacion-cotizacion.jpg", 
    link: "/web/automatizacion" 
  },
  { 
    image: { src: "/images/software/llamadas-bot.jpg", alt: "Módulo Llama con Voz IA" },
    title: "MÓDULO LLAMA • VOZ IA NATURAL & FLUIDA\nLlamadas Telefónicas Salientes para Ventas y Cobranzas", 
    badge: "VOZ INTELIGENTE", 
    src: "/images/software/llamadas-bot.jpg", 
    link: "/web/automatizacion" 
  },
  { 
    image: { src: "/images/software/agenda-bot.jpg", alt: "Módulo Agenda Inteligente" },
    title: "MÓDULO AGENDA • TU TIEMPO OPTIMIZADO\nSincronización de Citas y Recordatorios WhatsApp", 
    badge: "AGENDAMIENTO", 
    src: "/images/software/agenda-bot.jpg", 
    link: "/web/automatizacion" 
  },
  { 
    image: { src: "/images/consolas/mantenimiento-consolas.jpg", alt: "Mantenimiento y Reparación de Consolas" },
    title: "SERVICIO TÉCNICO DE CONSOLAS DE VIDEOJUEGOS\nPS5, PS4, Xbox & Switch • 10% Descuento > $80", 
    badge: "10% OFF", 
    src: "/images/consolas/mantenimiento-consolas.jpg", 
    link: "/web/mantenimiento-consolas" 
  },
  { 
    image: { src: "/images/software/impulsa-tienda-online.jpg", alt: "Impulsa tu Tienda en Línea desde Quito" },
    title: "IMPULSA TU NEGOCIO CON TU PROPIA TIENDA EN LÍNEA\nDesarrollo E-Commerce desde Quito (El Labrador)", 
    badge: "TIENDA EN LÍNEA", 
    src: "/images/software/impulsa-tienda-online.jpg", 
    link: "/web/tienda-en-linea" 
  },
]

const CoverflowGallery = dynamic(() => import("@/components/CoverflowGallery"), {
  ssr: false,
  loading: () => (
    <div className="w-full py-8 flex flex-col items-center justify-center bg-[#080d1a]/80 rounded-3xl border border-blue-500/20 shadow-2xl p-6">
      <div className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest mb-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
        <span>Cargando Catálogo 3D Coverflow de Productos IA...</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 w-full max-w-4xl opacity-90">
        <img src="/images/categories/tecnologia-residencial.jpg" alt="Tecnología Residencial" className="w-full h-24 object-cover rounded-xl border border-white/10" />
        <img src="/images/categories/electronica.jpg" alt="Electrónica" className="w-full h-24 object-cover rounded-xl border border-white/10" />
        <img src="/images/categories/hogar.jpg" alt="Hogar" className="w-full h-24 object-cover rounded-xl border border-white/10" />
        <img src="/images/categories/industria.jpg" alt="Industria" className="w-full h-24 object-cover rounded-xl border border-white/10" />
        <img src="/images/categories/entretenimiento.jpg" alt="Entretenimiento" className="w-full h-24 object-cover rounded-xl border border-white/10" />
        <img src="/images/categories/computacion.jpg" alt="Computación" className="w-full h-24 object-cover rounded-xl border border-white/10" />
      </div>
    </div>
  )
})

// Enhanced cleaning for damaged image data
const safeParseArray = (str: any, fallback: any = []) => {
  if (!str || str === 'null' || str === '[]' || str === '') return fallback;
  if (Array.isArray(str)) return str.length > 0 ? str : fallback;
  if (typeof str === 'string') {
    const trimmed = str.trim();
    if (trimmed.startsWith('http') || trimmed.startsWith('/') || trimmed.startsWith('data:image')) return [trimmed];
    try {
      let cleaned = trimmed;
      if (cleaned.startsWith('"') && cleaned.endsWith('"')) cleaned = cleaned.substring(1, cleaned.length - 1).replace(/\\"/g, '"');
      let parsed = JSON.parse(cleaned);
      if (typeof parsed === 'string') { try { parsed = JSON.parse(parsed); } catch (e) { } }
      if (Array.isArray(parsed)) return parsed.length > 0 ? parsed : fallback;
      if (typeof parsed === 'string' && parsed.length > 0) return [parsed];
    } catch (e) {
      const urlRegex = /(https?:\/\/[^\s"\]]+)/g;
      const matches = trimmed.match(urlRegex);
      if (matches && matches.length > 0) return matches;
    }
  }
  return fallback;
};

/* ─── Robust Image Component ─── */
function SafeImage({ src, alt = "", className, fill = false, width, height, ...props }: any) {
  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const imgRef = useRef<HTMLImageElement>(null)

  const rawSrc = typeof src === 'string' ? src : (src && typeof src === 'object' ? (src.src || src.url || '') : '')

  useEffect(() => {
    if (imgRef.current?.complete) {
      setIsLoading(false)
    }
  }, [rawSrc])

  if (!rawSrc || error) {
    return (
      <div className={`relative overflow-hidden bg-neutral-900/80 border border-white/5 flex flex-col items-center justify-center p-4 text-center ${fill ? 'absolute inset-0 w-full h-full' : ''} ${className}`} style={{ width: fill ? '100%' : width, height: fill ? '100%' : height }}>
        <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-neutral-500 mb-2">
          <Package size={22} className="text-neutral-400" />
        </div>
        <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider font-bold">ATOMIC PRODUCTO</span>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden bg-neutral-950 ${fill ? 'absolute inset-0 w-full h-full' : ''} ${className}`}>
      <img
        ref={imgRef}
        src={rawSrc}
        alt={alt}
        onLoad={() => setIsLoading(false)}
        onError={() => { setIsLoading(false); setError(true); }}
        className={`transition-all duration-500 ${isLoading ? 'scale-105 blur-md opacity-0' : 'scale-100 blur-0 opacity-100'} ${fill ? 'w-full h-full object-cover' : ''}`}
        style={{ width: fill ? '100%' : width, height: fill ? '100%' : height }}
        referrerPolicy="no-referrer"
        {...props}
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}

/* ─── Atom Logo (300% Size + 100% Electric Blue Glow) ─── */
function AtomLogo() {
  return (
    <div className="relative flex items-center justify-center my-2">
      {/* Background Soft Electric Blue Aura */}
      <div className="absolute w-52 h-52 bg-blue-600/30 rounded-full blur-3xl pointer-events-none" />
      
      <svg
        width="168"
        height="168"
        viewBox="0 0 72 72"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_0_35px_rgba(59,130,246,0.95)] transition-transform hover:scale-105 duration-500 relative z-10"
      >
        {/* Core Glowing Blue Nucleus */}
        <circle cx="36" cy="36" r="9" fill="#2563eb" className="animate-pulse" />
        <circle cx="36" cy="36" r="6" fill="#60a5fa" />
        <circle cx="36" cy="36" r="3.5" fill="#ffffff" />
        
        {/* 100% Pure Electric Blue Orbital Ring 1 */}
        <ellipse cx="36" cy="36" rx="31" ry="11" stroke="#3b82f6" strokeWidth="2.2" strokeOpacity="0.95" fill="none" />
        
        {/* 100% Pure Electric Blue Orbital Ring 2 */}
        <ellipse cx="36" cy="36" rx="31" ry="11" stroke="#60a5fa" strokeWidth="2.2" strokeOpacity="0.95" fill="none" transform="rotate(60 36 36)" />
        
        {/* 100% Pure Electric Blue Orbital Ring 3 */}
        <ellipse cx="36" cy="36" rx="31" ry="11" stroke="#2563eb" strokeWidth="2.2" strokeOpacity="0.95" fill="none" transform="rotate(120 36 36)" />
      </svg>
    </div>
  )
}

interface PublicWebClientProps {
  initialProducts: any[]
  metadata: { categories: any[], collections: any[] }
  userRole?: string
  storeSettings?: any
}

const normalizeText = (s: string) =>
  (s || "")
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ').trim()

const getWordVariants = (word: string): string[] => {
  const w = normalizeText(word)
  if (!w || w.length < 3) return [w]
  const variants = new Set<string>([w])

  // Lematización Plural -> Singular
  if (w.endsWith('ces') && w.length > 3) {
    variants.add(w.slice(0, -3) + 'z') // luces -> luz
  } else if (w.endsWith('es') && w.length > 4) {
    variants.add(w.slice(0, -2)) // generadores -> generador, motores -> motor
    variants.add(w.slice(0, -1))
  } else if (w.endsWith('s') && w.length > 3) {
    variants.add(w.slice(0, -1)) // encimeras -> encimera, cocinas -> cocina, camaras -> camara
  } else {
    // Singular -> Plural
    variants.add(w + 's') // encimera -> encimeras
    variants.add(w + 'es') // panel -> paneles
  }

  // Grupos semánticos
  const synonyms: Record<string, string[]> = {
    encimera: ['cocina', 'hornilla', 'parrilla', 'induccion', 'quemador', 'estufa', 'plancha'],
    encimeras: ['cocinas', 'hornillas', 'parrillas', 'induccion', 'quemadores', 'estufas'],
    cocina: ['encimera', 'parrilla', 'hornilla', 'estufa', 'induccion'],
    cocinas: ['encimeras', 'parrillas', 'hornillas', 'estufas', 'induccion'],
    camara: ['cctv', 'dvr', 'nvr', 'vigilancia'],
    camaras: ['cctv', 'dvr', 'nvr', 'vigilancia'],
    cerradura: ['chapa', 'smart lock', 'manija digital'],
    cerraduras: ['chapas', 'smart locks', 'manijas digitales'],
    senseface: ['zkteco', 'facial', 'biometrico', 'asistencia', '2a'],
    zkteco: ['senseface', 'biometrico', 'facial', '2a'],
    '2a': ['senseface', 'zkteco', 'facial', 'biometrico'],
    laptop: ['portatil', 'notebook', 'computador'],
    laptops: ['portatiles', 'notebooks', 'computadores'],
  }

  const syns = synonyms[w]
  if (syns) {
    syns.forEach(s => variants.add(normalizeText(s)))
  }

  return Array.from(variants)
}

const fuzzyMatch = (query: string, target: string): boolean => {
  const q = normalizeText(query)
  const t = normalizeText(target)
  if (!q) return true
  if (t.includes(q)) return true

  const queryWords = q.split(' ').filter(Boolean)
  const targetWords = t.split(' ').filter(Boolean)

  return queryWords.every(qWord => {
    const variants = getWordVariants(qWord)
    // Coincidencia directa con cualquiera de las variantes (singular/plural/sinónimos)
    if (variants.some(v => t.includes(v))) return true

    // Coincidencia por palabra
    return targetWords.some(tWord => {
      const tVariants = getWordVariants(tWord)
      return variants.some(v => tVariants.some(tv => tv === v || tv.startsWith(v) || v.startsWith(tv)))
    })
  })
}

function getCategoryTargetHref(name: string, slug?: string): string {
  const n = (name || '').toLowerCase()
  const s = (slug || '').toLowerCase()

  if (/m[aá]rmol|ranurado|remodelaci|pvc/i.test(n) || /marmol|ranurado|wpc|remodelacion/i.test(s)) return '/web/paneles-ranurados'
  if (/celular|samsung|galaxy|iphone|tel[eé]fono|smartphone|tablet|ipad/i.test(n) || /celular|telefonia|tablet/i.test(s)) return '/web/phones'
  if (/computaci|laptop|port[aá]til|cpu|servidor/i.test(n) || /laptop|computacion|cpu/i.test(s)) return '/web/laptops'
  if (/cocina|encimera|horno|campana|freidora/i.test(n) || /cocina|encimera|horno/i.test(s)) return '/web/cocinas'
  if (/mando|consola|playstation|ps5|ps4|gaming|nintendo|dualsense/i.test(n) || /mando|consola|gaming/i.test(s)) return '/web/mandos'
  if (/cerradura|chapa|biometric|smart\s*lock/i.test(n) || /cerradura/i.test(s)) return '/web/cerraduras-smart'
  if (/c[aá]mara|cctv|vigilancia|ezviz|imou/i.test(n) || /camara|seguridad/i.test(s)) return '/web/camaras-hogar'
  if (/barrera|vehicular/i.test(n) || /barrera/i.test(s)) return '/web/barreras-vehiculares'
  if (/torniquete|peatonal/i.test(n) || /torniquete/i.test(s)) return '/web/torniquetes'
  if (/movilidad|cargador|wallbox|scooter|bicicleta/i.test(n) || /cargador|movilidad/i.test(s)) return '/web/cargadores-electricos'
  if (/generador|energ[ií]a|bater[ií]a|solix|planta/i.test(n) || /generador|energia/i.test(s)) return '/web/generadores'
  if (/paneles?\s*solar|luminaria/i.test(n) || /solar|iluminacion/i.test(s)) return '/web/luminarias-solares'
  if (/disco|almacenamiento|adata|hd710|ssd/i.test(n) || /disco|almacenamiento/i.test(s)) return '/web/disco-duro-adata'
  if (/1hora|banco.*carga|powerbank/i.test(n) || /1hora|banco-de-carga/i.test(s)) return '/web/1hora'
  if (/calefactor|calentador/i.test(n) || /calefactor/i.test(s)) return '/web/calefactores'
  if (/cable|utp|bobina/i.test(n) || /cable/i.test(s)) return '/web/cables'
  if (/porter|intercomunic|videoportero/i.test(n) || /porter|intercomunicacion/i.test(s)) return '/web/videoporteros'
  if (/automatizaci|dom[oó]tica/i.test(n) || /automatizacion|domotica/i.test(s)) return '/web/automatizacion'
  if (/studio|creaci[oó]n.*contenido|contenido/i.test(n) || /creacion-contenido/i.test(s)) return '/web/creacion-contenido'
  if (/industrial|bloque|hormig[oó]n|maquinaria/i.test(n) || /industrial|maquinas/i.test(s)) return '/web/blogs/guia-maquinas-de-bloques'
  if (/carros?\s*industrial/i.test(n) || /carros/i.test(s)) return '/web/carros-industriales'
  if (/monitor|pantalla/i.test(n) || /monitor|pantalla/i.test(s)) return '/web/monitores'
  if (/tienda\s*en\s*l[ií]nea/i.test(n) || /tienda-en-linea/i.test(s)) return '/web/tienda-en-linea'
  if (/software|desarrollo\s*web|erp|sistemas|logistics/i.test(n) || /software|web/i.test(s)) return '/web/software'
  if (/dise[ñn]o|branding/i.test(n) || /diseno/i.test(s)) return '/web/software-portfolio'
  if (/ambiente/i.test(n)) return '/web/paneles-ranurados'
  if (/hogar/i.test(n)) return '/web/cocinas'
  if (/residencial/i.test(n)) return '/web/cerraduras-smart'
  if (/accesorio/i.test(n)) return '/web/precios-vendedor'

  return '/web/products'
}

function getCategoryShortcut(q: string): { name: string; subtitle: string; href: string; icon: string } | null {
  const qClean = q.toLowerCase().trim()
  if (!qClean) return null

  if (/m[aá]rmol|ranurado|remodelaci|pvc/i.test(qClean)) {
    return { name: "Acabados Tipo Mármol & WPC", subtitle: "Planchas PVC desde $27.00 • Paneles WPC $9.09", href: "/web/paneles-ranurados", icon: "🏛️" }
  }
  if (/celular|telefono|smartphone|iphone|samsung|galaxy/i.test(qClean)) {
    return { name: "Celulares & Smartphones", subtitle: "Samsung Galaxy, iPhone, Redmi Note, Honor y más", href: "/web/phones", icon: "📱" }
  }
  if (/tablet|ipad|kids/i.test(qClean)) {
    return { name: "Tablets & iPads Oficiales", subtitle: "Amazon Fire Kids, Galaxy Tab, iPad y Surface", href: "/web/phones", icon: "📲" }
  }
  if (/laptop|computad|port[aá]til|cpu|servidor/i.test(qClean)) {
    return { name: "Laptops & Computación Portátil", subtitle: "Dell, HP, Lenovo, ThinkPad, Asus y CPUs", href: "/web/laptops", icon: "💻" }
  }
  if (/cocina|encimera|horno|campana|freidora/i.test(qClean)) {
    return { name: "Cocinas, Encimeras & Hornos", subtitle: "Línea empotrable a gas, inducción y hornos", href: "/web/cocinas", icon: "🍳" }
  }
  if (/mando|consola|playstation|ps5|ps4|gaming|dualsense/i.test(qClean)) {
    return { name: "Mandos & Consolas Gaming", subtitle: "DualSense PS5, mandos Xbox, Nintendo y PS4", href: "/web/mandos", icon: "🎮" }
  }
  if (/cerradura|chapa|biometric|smart\s*lock/i.test(qClean)) {
    return { name: "Cerraduras Smart Biométricas", subtitle: "Kits de cerraduras inteligentes con instalación", href: "/web/cerraduras-smart", icon: "🔐" }
  }
  if (/c[aá]mara|cctv|vigilancia|ezviz|imou/i.test(qClean)) {
    return { name: "Cámaras de Seguridad 4K", subtitle: "Ezviz, Imou, Hikvision con 2 años de garantía", href: "/web/camaras-hogar", icon: "📷" }
  }
  if (/barrera|vehicular/i.test(qClean)) {
    return { name: "Barreras Vehiculares Automáticas", subtitle: "Ditec y sistemas de control de acceso vehicular", href: "/web/barreras-vehiculares", icon: "🚧" }
  }
  if (/torniquete|peatonal/i.test(qClean)) {
    return { name: "Torniquetes & Control Peatonal", subtitle: "Sistemas bidireccionales de acceso con torniquete", href: "/web/torniquetes", icon: "🚶" }
  }
  if (/cargador|wallbox|scooter|movilidad/i.test(qClean)) {
    return { name: "Movilidad Eléctrica & Cargadores EV", subtitle: "Wallbox para autos eléctricos y scooters", href: "/web/cargadores-electricos", icon: "⚡" }
  }
  if (/generador|energ[ií]a|bater[ií]a|solix|planta/i.test(qClean)) {
    return { name: "Generadores Eléctricos & Solix", subtitle: "Estaciones de energía Anker Solix y generadores", href: "/web/generadores", icon: "🔋" }
  }
  if (/paneles?\s*solar|luminaria/i.test(qClean)) {
    return { name: "Energía Solar & Luminarias", subtitle: "Luminarias solares suburbanas y paneles", href: "/web/luminarias-solares", icon: "☀️" }
  }
  if (/disco|almacenamiento|adata|hd710|ssd/i.test(qClean)) {
    return { name: "Discos Duros Antigolpes Adata", subtitle: "Adata HD710 Pro 1TB, 2TB, 4TB uso rudo", href: "/web/disco-duro-adata", icon: "💾" }
  }
  if (/1hora|banco.*carga|powerbank/i.test(qClean)) {
    return { name: "Bancos de Carga 1Hora Oficial", subtitle: "Powerbanks de 10.000mAh y 20.000mAh", href: "/web/1hora", icon: "🔌" }
  }
  if (/calefactor|calentador/i.test(qClean)) {
    return { name: "Calefactores de Ambiente", subtitle: "Calefactores eléctricos cerámicos de torre", href: "/web/calefactores", icon: "🔥" }
  }
  if (/cable|utp|bobina/i.test(qClean)) {
    return { name: "Cables UTP & Redes", subtitle: "Bobinas Cat 6, conectores y cableado", href: "/web/cables", icon: "🌐" }
  }
  if (/porter|intercomunic|videoportero/i.test(qClean)) {
    return { name: "Videoporteros & Intercomunicación", subtitle: "Monitores touch y frentes de calle IP", href: "/web/videoporteros", icon: "📞" }
  }
  if (/automatizaci|dom[oó]tica/i.test(qClean)) {
    return { name: "Automatización & Domótica", subtitle: "Sistemas inteligentes para hogar y oficinas", href: "/web/automatizacion", icon: "🏡" }
  }
  if (/studio|contenido/i.test(qClean)) {
    return { name: "ATOMIC Studio & Creación", subtitle: "Equipos y producción audiovisual para creadores", href: "/web/creacion-contenido", icon: "🎬" }
  }
  if (/industrial|bloque|hormig[oó]n|maquinaria/i.test(qClean)) {
    return { name: "Plantas de Bloques de Concreto", subtitle: "Maquinaria industrial y automatización", href: "/web/blogs/guia-maquinas-de-bloques", icon: "🏗️" }
  }
  if (/monitor|pantalla/i.test(qClean)) {
    return { name: "Monitores & Pantallas Gaming", subtitle: "Monitores 144Hz, 165Hz, IPS y curvos", href: "/web/monitores", icon: "🖥️" }
  }
  if (/software|desarrollo/i.test(qClean)) {
    return { name: "Software ERP & Facturación SRI", subtitle: "Plataformas ERP y sistemas comerciales", href: "/web/software", icon: "💻" }
  }
  return null
}

/* ═══════════════════════════════════════════════════════════════════
   CAMPAMENTOS & CAMPAÑAS ESPECIALES: BLACK FRIDAY & REMATE DE FIN DE AÑO
   ═══════════════════════════════════════════════════════════════════ */
const BLACK_FRIDAY_DATA = {
  badge: "EDICIÓN ESPECIAL BLACK FRIDAY 2026",
  headline: "BLACK FRIDAY TECNOLÓGICO: EL EVENTO DE DESCUENTOS DEL AÑO",
  subheadline: "Rebajas directas de fábrica en gaming, computación, domótica y seguridad perimetral. Envíos gratis a todo el Ecuador con garantía oficial directa.",
  blogIntro: {
    title: "¿Cómo aprovechar al máximo el Black Friday en ATOMIC?",
    date: "Temporada Black Friday 2026 • Almacenes Centrales Ecuador",
    summary: "Durante el Black Friday, los stocks de alta demanda vuelan en minutos. Para que asegures tu equipamiento sin contratiempos, hemos activado el sistema de congelamiento de precio por WhatsApp con atención técnica personalizada en tiempo real.",
    tips: [
      { num: "01", title: "Reserva Inmediata con Asesor", text: "Haz clic en 'Cotizar por WhatsApp' para congelar la tarifa Black Friday antes de que se agote el cupo de importación asignado." },
      { num: "02", title: "Envíos Sin Recargo Nacional", text: "Despachamos sin costo extra a Quito, Guayaquil, Cuenca, Ambato, Manta, Loja y todas las provincias del Ecuador." },
      { num: "03", title: "Garantía Oficial 100% Legal", text: "Todos los equipos se entregan con factura autorizada por el SRI, número de serie registrado y soporte técnico posventa." }
    ]
  },
  products: [
    {
      id: "bf-ps5",
      name: "Consola PlayStation 5 Slim Digital + 2 Mandos DualSense",
      badge: "30% OFF • BLACK FRIDAY",
      discountPct: "-23%",
      originalPrice: "$699.00",
      promoPrice: "$539.00",
      img: "/images/consolas/ps4-slim-reacondicionada.jpg",
      specs: ["Almacenamiento SSD 1TB Ultra Rápido", "Incluye 2 Mandos Inalámbricos DualSense", "Trazado de Rayos 4K HDR hasta 120 fps", "Tempest 3D AudioTech"],
      showroomHref: "/web/mandos",
      waMessage: "Hola ATOMIC! Deseo comprar en oferta Black Friday la PlayStation 5 Slim Digital ($539.00). ¿Tienen stock para envío?"
    },
    {
      id: "bf-dell-laptop",
      name: "Laptop Dell Latitude Corporativa Core i7 / 16GB / 512GB SSD",
      badge: "33% OFF • BLACK FRIDAY",
      discountPct: "-33%",
      originalPrice: "$749.00",
      promoPrice: "$499.00",
      img: "/images/laptops/dell-latitude.png",
      specs: ["Procesador Intel Core i7 8va Gen", "16 GB Memoria RAM DDR4", "Disco de Estado Sólido 512 GB SSD NVMe", "Pantalla 14\" Full HD Antirreflejo"],
      showroomHref: "/web/laptops",
      waMessage: "Hola ATOMIC! Me interesa la Laptop Dell Latitude Core i7 de $499 en Black Friday. ¿Incluye cargador y garantía?"
    },
    {
      id: "bf-ezviz-cam",
      name: "Cámara Panorámica Wi-Fi EZVIZ H6c 2K IA 360° Interior",
      badge: "37% OFF • BLACK FRIDAY",
      discountPct: "-37%",
      originalPrice: "$59.00",
      promoPrice: "$36.90",
      img: "/images/camaras/camara-ezviz-h6c-3mp-basica-44.jpg",
      specs: ["Resolución 2K (4 Megapíxeles) nítida", "Rotación 360° Pan & Tilt motorizada", "Seguimiento Inteligente de Personas", "Audio Bidireccional & Visión Nocturna"],
      showroomHref: "/web/camaras-hogar",
      waMessage: "Hola ATOMIC! Deseo pedir la Cámara EZVIZ H6c 2K a $36.90 de Black Friday. ¿Cómo coordino la entrega?"
    },
    {
      id: "bf-lock-senseface",
      name: "Cerradura Smart Biometría Facial SenseFace Pro 3D",
      badge: "32% OFF • BLACK FRIDAY",
      discountPct: "-32%",
      originalPrice: "$220.00",
      promoPrice: "$149.00",
      img: "/images/cerraduras/bp-quantum-lock.png",
      specs: ["Reconocimiento Facial 3D infrarrojo", "Lector de Huella Dactilar Óptico", "Apertura por Tarjeta RFID, Clave y App Tuya", "Cuerpo de aleación de aluminio reforzado"],
      showroomHref: "/web/cerraduras-smart",
      waMessage: "Hola ATOMIC! Quiero adquirir la Cerradura Smart Facial a $149 en promo Black Friday. ¿Tienen servicio de instalación?"
    },
    {
      id: "bf-monitor-gamer",
      name: "Monitor Gamer Fast IPS 24\" FHD 165Hz 1ms Ultra Slim",
      badge: "31% OFF • BLACK FRIDAY",
      discountPct: "-31%",
      originalPrice: "$189.00",
      promoPrice: "$129.00",
      img: "/images/monitores/monitor-lg-ultragear-24g411b.jpg",
      specs: ["Tasa de Refresco 165Hz & 1ms MPRT", "Panel Fast IPS con colores 99% sRGB", "Compatibilidad AMD FreeSync & G-Sync", "Entradas HDMI 2.0 y DisplayPort 1.4"],
      showroomHref: "/web/monitores",
      waMessage: "Hola ATOMIC! Deseo comprar el Monitor Gamer 165Hz de Black Friday ($129.00). ¿Hacen envíos a provincia?"
    },
    {
      id: "bf-powerbank-1hora",
      name: "Banco de Carga Powerbank 1Hora 20.000mAh 22.5W Carga Rápida",
      badge: "35% OFF • BLACK FRIDAY",
      discountPct: "-35%",
      originalPrice: "$35.00",
      promoPrice: "$22.50",
      img: "/images/1hora/banco-20000-negro-gar159n.jpg",
      specs: ["Capacidad masiva 20.000 mAh real", "Carga rápida USB-C PD 22.5W bidireccional", "Pantalla LED con indicador de batería", "Carga simultánea de hasta 3 dispositivos"],
      showroomHref: "/web/1hora",
      waMessage: "Hola ATOMIC! Deseo pedir la Powerbank 1Hora 20.000mAh de Black Friday ($22.50). ¿Qué colores tienen?"
    }
  ]
}

const REMATE_STOCK_DATA = {
  badge: "LIQUIDACIÓN DE BODEGA & FIN DE AÑO 2026",
  headline: "GRAN REMATE DE STOCK DE FIN DE AÑO: RENOVACIÓN TOTAL",
  subheadline: "Liquidamos excedentes de bodega, lotes de remodelación arquitectónica, generadores ante apagones y equipos de acceso al costo de importador.",
  blogIntro: {
    title: "Gran Venta de Bodega: ¿Por qué comprar en la liquidación de fin de año?",
    date: "Cierre de Inventario Anual • Despachos desde Bodega Central",
    summary: "Previo a la llegada de los nuevos contenedores 2026, liberamos espacio físico en nuestros almacenes centrales de Quito. Es el momento estratégico para que constructores, electricistas, remodeladores y dueños de casa adquieran productos de primera línea con ahorros de hasta el 40%.",
    reasons: [
      { tag: "REMODELACIÓN RÁPIDA", title: "Planchas Mármol PVC & WPC al Costo", desc: "Lotes cerrados de acabados decorativos listos para retirar o entregar sin demoras." },
      { tag: "RESPALDO ELÉCTRICO", title: "Generadores e Inversores en Stock", desc: "Equipos probados en banco de carga, listos para proteger tu hogar o negocio." },
      { tag: "EQUIPAMIENTO DE COCINA", title: "Combos de Inducción con Envío Bonificado", desc: "Renueva tu cocina con encimeras vitrocerámicas de máxima eficiencia." }
    ]
  },
  products: [
    {
      id: "remate-marmol-calacatta",
      name: "Planchas PVC Tipo Mármol UV Calacatta Gold 2.44m x 1.22m",
      badge: "REMATE FIN DE AÑO • AL COSTO",
      discountPct: "-29%",
      originalPrice: "$38.00",
      promoPrice: "$27.00",
      savings: "Ahorras $11.00 por plancha",
      img: "/images/paneles-wpc/plancha-pvc-marmol-calacatta-sala.jpg",
      specs: ["Medida estándar 2.44m x 1.22m (3.0mm espesor)", "Capa protectora UV con brillo espejo mármol", "100% impermeable, ignífugo e inmune a hongos", "Instalación limpia con pegamento de poliuretano"],
      showroomHref: "/web/paneles-ranurados",
      waMessage: "Hola ATOMIC! Deseo cotizar planchas de mármol PVC Calacatta Gold a $27.00 de liquidación de fin de año. ¿Cuántas unidades tienen?"
    },
    {
      id: "remate-panel-wpc",
      name: "Panel Ranurado WPC Teca Nórdica / Nogal 2.90m x 16cm",
      badge: "REMATE FIN DE AÑO • AL COSTO",
      discountPct: "-30%",
      originalPrice: "$18.50",
      promoPrice: "$12.90",
      savings: "Ahorras $5.60 por listón",
      img: "/images/paneles-wpc/panel-wpc-bicolor-madera.jpg",
      specs: ["Longitud de 2.90m para cubrir pared sin uniones", "Acabado madera tridimensional de lujo", "Machihembrado perfecto con grapas invisibles", "Apto para interiores y zonas semiexteriores"],
      showroomHref: "/web/paneles-ranurados",
      waMessage: "Hola ATOMIC! Me interesa el panel ranurado WPC en remate a $12.90. Necesito cubrir 15 metros cuadrados."
    },
    {
      id: "remate-generador-2500w",
      name: "Generador Eléctrico Inverter 2500W Ultra Silencioso",
      badge: "LIQUIDACIÓN • ANTE APAGONES",
      discountPct: "-27%",
      originalPrice: "$580.00",
      promoPrice: "$420.00",
      savings: "Ahorras $160.00",
      img: "/images/anker-solix/anker-solix-c300-hero-hogar.jpg",
      specs: ["Salida de onda senoidal pura para equipos delicados", "Nivel de ruido menor a 58 dB en modo ECO", "Autonomía de hasta 8 horas con estanque lleno", "Arranque fácil con sensor de bajo nivel de aceite"],
      showroomHref: "/web/generadores",
      waMessage: "Hola ATOMIC! Deseo comprar el generador inverter en remate de stock ($420.00). ¿Tienen entrega inmediata en Quito/Guayaquil?"
    },
    {
      id: "remate-cocina-induccion",
      name: "Encimera de Inducción 4 Hornillas Touch Vidrio Templado",
      badge: "REMATE FIN DE AÑO • AL COSTO",
      discountPct: "-30%",
      originalPrice: "$340.00",
      promoPrice: "$239.00",
      savings: "Ahorras $101.00",
      img: "/images/categories/hogar.jpg",
      specs: ["4 Zonas de cocción independientes de alta velocidad", "Vidrio vitrocerámico alemán resistente a impactos", "Panel touch deslizante con bloqueo de seguridad infantil", "Consumo eficiente clasificación energética A+++"],
      showroomHref: "/web/cocinas",
      waMessage: "Hola ATOMIC! Deseo pedir la cocina de inducción 4 hornillas a $239.00 de liquidación de fin de año."
    },
    {
      id: "remate-torniquete-peatonal",
      name: "Torniquete Peatonal Bidireccional Acero Inox 304",
      badge: "LIQUIDACIÓN DE BODEGA",
      discountPct: "-22%",
      originalPrice: "$1,150.00",
      promoPrice: "$890.00",
      savings: "Ahorras $260.00",
      img: "/images/categories/tecnologia-residencial.jpg",
      specs: ["Chasis en Acero Inoxidable AISI 304 de 1.5mm", "Mecanismo electromecánico de giro suave bidireccional", "Compatible con lectores faciales, huella y tarjetas RFID", "Brazos antipánico con caída automática ante incendios"],
      showroomHref: "/web/torniquetes",
      waMessage: "Hola ATOMIC! Me interesa el torniquete peatonal inox en liquidación a $890. ¿Incluye placa controladora?"
    },
    {
      id: "remate-luminaria-solar",
      name: "Luminaria Solar Suburbana LED 300W Todo en Uno",
      badge: "REMATE FIN DE AÑO • AL COSTO",
      discountPct: "-36%",
      originalPrice: "$75.00",
      promoPrice: "$48.00",
      savings: "Ahorras $27.00",
      img: "/images/categories/industria.jpg",
      specs: ["Panel solar monocristalino integrado de alta eficiencia", "Batería de fosfato de hierro y litio (LiFePO4) duradera", "Sensor de movimiento radar y encendido automático nocturno", "Cuerpo impermeable IP65 con control remoto incluido"],
      showroomHref: "/web/luminarias-solares",
      waMessage: "Hola ATOMIC! Quisiera pedir 4 luminarias solares de 300W a $48.00 en liquidación de stock."
    }
  ]
}

const SPECIALIZED_AREAS = [
  {
    id: "seguridad",
    name: "Seguridad & Control de Acceso",
    shortName: "Seguridad & Accesos",
    icon: "🔐",
    tagline: "Control biométrico, cerraduras inteligentes, torniquetes y videovigilancia IP con inteligencia artificial.",
    heroImg: "/images/categories/tecnologia-residencial.jpg",
    showroomHref: "/web/cerraduras-smart",
    showroomLabel: "Ver Showroom de Cerraduras Smart",
    intro: {
      headline: "Protección Perimetral y Control Biométrico de Grado Corporativo",
      description: "Nuestra división de seguridad integra tecnología de última generación para residencias, urbanizaciones y empresas. Desde cerraduras digitales con reconocimiento facial 3D hasta barreras vehiculares automáticas y cámaras con visión nocturna en color 24/7.",
      pillars: [
        { title: "Cero Falsos Positivos", desc: "Algoritmos ZKTeco & EZVIZ con verificación biométrica en menos de 0.3 segundos." },
        { title: "Autonomía & Respaldo", desc: "Baterías de litio recargables y alimentación de emergencia USB-C ante cortes de luz." },
        { title: "Garantía & Repuestos", desc: "Stock físico de repuestos, pestillos, tarjetas RFID y soporte técnico en Ecuador." }
      ]
    },
    blogHighlights: [
      {
        title: "Cerraduras Smart: ¿Adiós a las llaves físicas en 2026?",
        summary: "Descubre cómo las cerraduras biométricas con conexión Wi-Fi permiten generar claves temporales para Airbnb, registrar entradas de empleados y abrir desde tu smartphone.",
        tag: "TENDENCIA DOMÓTICA",
        readTime: "3 min lectura",
        featuredProduct: {
          name: "Cerradura Smart Biometría Facial & Huella SenseFace Pro",
          specs: "Reconocimiento Facial 3D • Lector Huella Óptico • Apertura App Tuya/SmartLife • Timbre con Cámara HD",
          price: "$149.00",
          regularPrice: "$220.00",
          img: "/images/cerraduras/bp-quantum-lock.png",
          href: "/web/cerraduras-smart"
        }
      },
      {
        title: "Vigilancia Perimetral con IA: Detección Humana sin Suscripciones",
        summary: "Las cámaras EZVIZ e IMOU con inteligencia artificial clasifican humanos y vehículos eliminando falsas alarmas por viento o mascotas, almacenando todo en MicroSD o NVR local.",
        tag: "ANÁLISIS TÉCNICO",
        readTime: "4 min lectura",
        featuredProduct: {
          name: "Cámara Wi-Fi Panorámica EZVIZ H6c 2K IA 360°",
          specs: "Resolución 2K (4MP) • Cobertura 360° Motorizada • Visión Nocturna IR 10m • Audio 2 Vías",
          price: "$36.90",
          regularPrice: "$59.00",
          img: "/images/camaras/camara-ezviz-h6c-3mp-basica-44.jpg",
          href: "/web/camaras-hogar"
        }
      }
    ],
    catalogKeywords: ["cerradura", "biometric", "facial", "camara", "ezviz", "imou", "dvr", "torniquete", "barrera", "acceso", "cerco", "videoportero"]
  },
  {
    id: "marmol",
    name: "Acabados Tipo Mármol & WPC",
    shortName: "Acabados & Mármol",
    icon: "🏛️",
    tagline: "Planchas de PVC imitación mármol UV y paneles ranurados WPC para remodelación residencial y comercial de lujo.",
    heroImg: "/images/paneles-wpc/plancha-pvc-marmol-calacatta-sala.jpg",
    showroomHref: "/web/paneles-ranurados",
    showroomLabel: "Ver Showroom de Planchas & Paneles",
    intro: {
      headline: "Elegancia Arquitectónica sin Obras Pesadas ni Altos Costos",
      description: "Transforma paredes, salas de juntas, baños y fachadas con planchas de mármol sintético de alto brillo UV y listones acústicos de WPC. Instalación limpia en seco con pegamento de poliuretano, 100% resistentes a la humedad y hongos.",
      pillars: [
        { title: "Acabado Espejo UV", desc: "Capa protectora ultravioleta resistente al rayado, calor y decoloración por luz solar." },
        { title: "Resistente al Agua 100%", desc: "Ideal para baños, cocinas y zonas húmedas donde el mármol natural se mancha." },
        { title: "Ahorro de Hasta 70%", desc: "Mismo impacto visual de una losa de mármol italiano con una fracción del costo y peso." }
      ]
    },
    blogHighlights: [
      {
        title: "Guía de Remodelación: Mármol PVC vs Mármol Natural",
        summary: "Comparativa técnica: Peso estructural de 18kg vs 150kg, nulo mantenimiento de sellado y cortes precisos con cuchilla o sierra sin generar polvo tóxico.",
        tag: "GUÍA PRÁCTICA",
        readTime: "4 min lectura",
        featuredProduct: {
          name: "Plancha PVC Mármol UV Calacatta Gold 2.44m x 1.22m",
          specs: "Espesor 3.0mm • Recubrimiento UV Alto Brillo • Ignífugo Clase B1 • Fácil Corte",
          price: "$27.00",
          regularPrice: "$38.00",
          img: "/images/paneles-wpc/plancha-pvc-marmol-calacatta-sala.jpg",
          href: "/web/paneles-ranurados"
        }
      },
      {
        title: "Paneles Ranurados WPC: Aislamiento Térmico y Acústico en Paredes",
        summary: "La madera plástica compuesta (WPC) no se pudre, no absorbe humedad y entrega un relieve tridimensional moderno ideal para cabeceras y fondos de TV.",
        tag: "DECORACIÓN INTERIOR",
        readTime: "3 min lectura",
        featuredProduct: {
          name: "Panel Ranurado WPC Teca Nórdica / Nogal 2.90m",
          specs: "Largo 2.90m • Ancho 16cm • Resina Termoplástica con Polvo de Madera • Ensamble Machihembrado",
          price: "$12.90",
          regularPrice: "$18.50",
          img: "/images/paneles-wpc/panel-wpc-bicolor-madera.jpg",
          href: "/web/paneles-ranurados"
        }
      }
    ],
    catalogKeywords: ["marmol", "mármol", "pvc", "wpc", "ranurado", "calacatta", "marquina", "panel", "moldura", "perfil"]
  },
  {
    id: "computacion",
    name: "Computación & Laptops Corporativas",
    shortName: "Laptops & PCs",
    icon: "💻",
    tagline: "Laptops empresariales, estaciones de trabajo, componentes originales y PCs All-in-One con garantía certificada.",
    heroImg: "/images/promociones/laptops-portada.jpg",
    showroomHref: "/web/laptops",
    showroomLabel: "Ver Showroom de Laptops & PCs",
    intro: {
      headline: "Potencia, Durabilidad y Rendimiento Certificado para Profesionales",
      description: "Equipamiento de cómputo para ingeniería, arquitectura, programación y empresas. Contamos con líneas líderes Dell Latitude, HP ProBook/EliteBook, Lenovo ThinkPad y estaciones de trabajo de alto rendimiento.",
      pillars: [
        { title: "Pruebas de Estrés 100%", desc: "Cada laptop pasa chequeo de 24 puntos: batería, memoria, SSD NVMe y temperaturas." },
        { title: "Windows Pro Original", desc: "Sistemas operativos legales activados con licencia digital permanente." },
        { title: "Garantía de Almacén", desc: "Respaldado por nuestro laboratorio técnico de repuestos y soporte." }
      ]
    },
    blogHighlights: [
      {
        title: "Dell Latitude vs HP EliteBook: ¿Cuál elegir para trabajo remoto?",
        summary: "Evaluamos chasis de aleación de magnesio, autonomía de batería de hasta 9 horas, pantallas antirreflejo y facilidad de ampliación de memoria RAM.",
        tag: "BENCHMARK ATOMIC",
        readTime: "5 min lectura",
        featuredProduct: {
          name: "Laptop Dell Latitude 7490 Core i7 / 16GB / 512GB SSD",
          specs: "Intel Core i7 8th Gen • 16GB RAM DDR4 • 512GB SSD NVMe • Pantalla 14\" FHD IPS",
          price: "$499.00",
          regularPrice: "$749.00",
          img: "/images/laptops/dell-latitude.png",
          href: "/web/laptops"
        }
      },
      {
        title: "La Importancia del Disco Duro Antigolpes en Terreno",
        summary: "Por qué los ingenieros civiles y fotógrafos en Ecuador eligen la serie Adata HD710 Pro con certificación militar MIL-STD-810G e IP68 contra agua y polvo.",
        tag: "PROTECCIÓN DE DATOS",
        readTime: "3 min lectura",
        featuredProduct: {
          name: "Disco Duro Externo Adata HD710 Pro 2TB Uso Rudo",
          specs: "Capacidad 2TB • Resistencia al Agua IP68 • Sensor Antigolpes G-Shock • Cable Integrado",
          price: "$78.00",
          regularPrice: "$105.00",
          img: "/images/adata-hd710/adata-hd710-2tb-negro.jpg",
          href: "/web/disco-duro-adata"
        }
      }
    ],
    catalogKeywords: ["laptop", "dell", "hp", "lenovo", "portatil", "computadora", "core", "ryzen", "disco", "adata", "repuesto", "teclado", "bateria"]
  },
  {
    id: "energia",
    name: "Energía, Generadores & Movilidad Eléctrica",
    shortName: "Energía & Generadores",
    icon: "⚡",
    tagline: "Generadores inverter silenciados, estaciones de energía Anker Solix, cargadores de autos eléctricos y luminarias solares.",
    heroImg: "/images/promociones/cargador-wallbox-mevo.jpg",
    showroomHref: "/web/generadores",
    showroomLabel: "Ver Showroom de Generadores & Energía",
    intro: {
      headline: "Seguridad Energética sin Interrupciones Ante Apagones",
      description: "Soluciones de energía continua para hogares, clínicas, comercios y proyectos de movilidad eléctrica. Desde generadores a gasolina inverter con onda senoidal pura hasta cargadores Wallbox tipo 2 para vehículos eléctricos.",
      pillars: [
        { title: "Onda Senoidal Pura", desc: "Corriente ultraestable que protege laptops, servidores y electrodomésticos delicados." },
        { title: "Bajo Consumo & Ruido", desc: "Modo Eco inteligente que regula las RPM ahorrando hasta un 40% de combustible." },
        { title: "Movilidad Eléctrica EV", desc: "Wallbox de 7.3 kW y 22 kW compatibles con BYD, Tesla, Kia, Hyundai y Chevrolet." }
      ]
    },
    blogHighlights: [
      {
        title: "¿Cómo calcular la potencia necesaria para tu casa ante apagones?",
        summary: "Aprende a sumar la carga de refrigeradora, routers Wi-Fi, iluminación LED y computadoras para elegir el generador o estación Anker adecuada.",
        tag: "GUÍA ENERGÉTICA",
        readTime: "4 min lectura",
        featuredProduct: {
          name: "Estación de Energía Portátil Anker Solix C300 LiFePO4",
          specs: "Capacidad 288Wh • Salida AC 300W (Surge 600W) • Baterías LiFePO4 3000 Ciclos • Carga en 50 min",
          price: "$289.00",
          regularPrice: "$375.00",
          img: "/images/anker-solix/anker-solix-c300-hero-hogar.jpg",
          href: "/web/generadores"
        }
      },
      {
        title: "Cargadores Wallbox de 7.3kW: Carga Inteligente en Casa",
        summary: "Reduce el tiempo de recarga de tu vehículo eléctrico de 16 horas a menos de 5 horas con gestión dinámica de carga por app móvil.",
        tag: "MOVILIDAD SOSTENIBLE",
        readTime: "3 min lectura",
        featuredProduct: {
          name: "Cargador de Auto Eléctrico Wallbox Livoltek Mevo 7.3kW",
          specs: "Conector Tipo 2 Mennekes • Potencia 32A / 220V • Wi-Fi & Bluetooth con App • Protección IP65",
          price: "$480.00",
          regularPrice: "$650.00",
          img: "/images/promociones/cargador-wallbox-mevo.jpg",
          href: "/web/cargadores-electricos"
        }
      }
    ],
    catalogKeywords: ["generador", "bateria", "solix", "anker", "wallbox", "cargador", "solar", "luminaria", "inverter", "planta"]
  },
  {
    id: "hogar",
    name: "Hogar, Confort & Cocina Moderna",
    shortName: "Cocina & Hogar",
    icon: "🍳",
    tagline: "Encimeras de inducción, hornos empotrables, campanas extractoras, freidoras de aire y climatización.",
    heroImg: "/images/categories/hogar.jpg",
    showroomHref: "/web/cocinas",
    showroomLabel: "Ver Showroom de Cocinas & Hornos",
    intro: {
      headline: "Diseño Contemporáneo y Eficiencia Térmica para tu Cocina",
      description: "Equipos de cocina diseñados para maximizar el espacio, reducir el consumo eléctrico y ofrecer una estética minimalista. Tecnología de inducción magnética de calentamiento veloz con sistemas de seguridad para niños.",
      pillars: [
        { title: "Vidrio Cerámico de Alta Resistencia", desc: "Superficies vitrocerámicas alemanas resistentes a choques térmicos y rayones." },
        { title: "Seguridad Total", desc: "Bloqueo de panel, apagado automático al retirar la olla y sensor de sobrecalentamiento." },
        { title: "Eficiencia A+++", desc: "90% de energía transferida directamente al recipiente vs 40% en cocinas a gas." }
      ]
    },
    blogHighlights: [
      {
        title: "Cocina de Inducción vs Cocina a Gas: ¿Cuánto se ahorra realmente?",
        summary: "Análisis con tarifas eléctricas de Ecuador: Menor tiempo de ebullición, cocción uniforme y ambiente libre de humo y calor residual en el hogar.",
        tag: "EFICIENCIA ENERGÉTICA",
        readTime: "4 min lectura",
        featuredProduct: {
          name: "Encimera de Inducción 4 Zonas Touch Vidrio Templado",
          specs: "4 Focos de Alta Potencia • Panel Touch Deslizante • Temporizador Digital • Función Boost",
          price: "$239.00",
          regularPrice: "$340.00",
          img: "/images/categories/hogar.jpg",
          href: "/web/cocinas"
        }
      }
    ],
    catalogKeywords: ["cocina", "horno", "campana", "encimera", "induccion", "freidora", "calefactor"]
  },
  {
    id: "gaming",
    name: "Gaming, Consolas & Simulación",
    shortName: "Gaming & Consolas",
    icon: "🎮",
    tagline: "Consolas PlayStation 5, mandos inalámbricos DualSense, Nintendo Switch, monitores gamers 165Hz y periféricos.",
    heroImg: "/images/categories/entretenimiento.jpg",
    showroomHref: "/web/mandos",
    showroomLabel: "Ver Showroom de Mandos & Consolas",
    intro: {
      headline: "Inmersión Total con Tiempos de Respuesta Ultrarrápidos",
      description: "El catálogo gaming de ATOMIC ofrece consolas oficiales con garantía, mandos inalámbricos con gatillos adaptativos y monitores Fast IPS de hasta 165Hz para una ventaja competitiva en eSports y simulación.",
      pillars: [
        { title: "Gatillos Adaptativos & Háptica", desc: "Siente cada disparo, frenada y textura en tus manos con la tecnología DualSense." },
        { title: "Monitores 1ms & 165Hz", desc: "Cero ghosting con compatibilidad AMD FreeSync y G-Sync para fluidez absoluta." },
        { title: "Stock 100% Original", desc: "Mandos y accesorios genuinos con sellos de fábrica y códigos verificables." }
      ]
    },
    blogHighlights: [
      {
        title: "DualSense en PC: Configuración para Haptics y Gatillos Adaptativos",
        summary: "Descubre cómo sacarle el 100% al mando de PS5 en Steam y emuladores en Windows con respuesta háptica completa.",
        tag: "TUTORIAL GAMING",
        readTime: "3 min lectura",
        featuredProduct: {
          name: "Mando Inalámbrico DualSense Midnight Black / Cosmic Red",
          specs: "Conexión Bluetooth & USB-C • Batería Recargable Integrada • Micrófono & Jack 3.5mm • Sensor Movimiento",
          price: "$69.00",
          regularPrice: "$95.00",
          img: "/images/consolas/control-wireless-gaming.jpg",
          href: "/web/mandos"
        }
      }
    ],
    catalogKeywords: ["ps5", "ps4", "playstation", "mando", "dualsense", "consola", "nintendo", "xbox", "gaming", "monitor", "144hz", "165hz"]
  },
  {
    id: "automatizacion",
    name: "Automatización, IA & Software",
    shortName: "Automatización & IA",
    icon: "🤖",
    tagline: "Agentes inteligentes para WhatsApp, facturación electrónica SRI en 3 segundos, ERP en la nube y domótica.",
    heroImg: "/images/software/automatizacion-bot-99.jpg",
    showroomHref: "/web/software",
    showroomLabel: "Ver Soluciones de Software & IA",
    intro: {
      headline: "Operaciones Comerciales Autónomas y Sin Fricción 24/7",
      description: "Nuestros sistemas de IA y software empresarial eliminan el trabajo repetitivo: atención inmediata de clientes por WhatsApp, cotizaciones automáticas, sincronización de inventario multialmacén y emisión de comprobantes autorizados por el SRI.",
      pillars: [
        { title: "Atención Ininterrumpida 24/7", desc: "El bot responde consultas, envía fichas técnicas y cierra pedidos a cualquier hora." },
        { title: "Facturación SRI Automática", desc: "Emisión de facturas electrónicas firmadas digitalmente y enviadas por correo al instante." },
        { title: "Panel Web Centralizado", desc: "Visualiza métricas de ventas, cobros y stock en tiempo real desde cualquier dispositivo." }
      ]
    },
    blogHighlights: [
      {
        title: "¿Cómo un Bot de WhatsApp Triplica las Ventas de un Negocio?",
        summary: "Estudio de caso: Las empresas que responden en menos de 2 minutos convierten 4 veces más que las que tardan 1 hora. La IA no duerme ni olvida un seguimiento.",
        tag: "CASO DE ÉXITO",
        readTime: "4 min lectura",
        featuredProduct: {
          name: "Licencia Anual Bot de Ventas WhatsApp + Facturación SRI",
          specs: "Integración WhatsApp Web • Conexión Base de Datos ERP • Firma Electrónica SRI • Panel Analítica",
          price: "$199.00/año",
          regularPrice: "$350.00",
          img: "/images/software/automatizacion-bot-99.jpg",
          href: "/web/software"
        }
      }
    ],
    catalogKeywords: ["software", "erp", "bot", "automatizacion", "facturacion", "sri", "licencia"]
  },
  {
    id: "industrial",
    name: "Maquinaria Industrial & Producción",
    shortName: "Maquinaria Industrial",
    icon: "🏗️",
    tagline: "Plantas automáticas de bloques de concreto, mezcladoras de alta capacidad, moldes intercambiables y silos.",
    heroImg: "/images/categories/industria.jpg",
    showroomHref: "/web/blogs/guia-maquinas-de-bloques",
    showroomLabel: "Ver Guía de Plantas de Bloques",
    intro: {
      headline: "Ingeniería Mecánica y Alta Productividad en Construcción",
      description: "Equipos industriales pesados para la fabricación automatizada de bloques de hormigón, adoquines peatonales y bovedillas con dosificación precisa y sistemas hidráulicos de alta vibración.",
      pillars: [
        { title: "Producción Continua", desc: "Capacidad de hasta 10,000 bloques por jornada con sistemas de desmolde automático." },
        { title: "Moldes Intercambiables", desc: "Cambio rápido de moldes para bloques de 10, 15 y 20cm, adoquines tipo holandés o cruz." },
        { title: "Asistencia Técnica en Planta", desc: "Puesta en marcha, calibración y capacitación del personal operador en el sitio de obra." }
      ]
    },
    blogHighlights: [
      {
        title: "Guía de Inversión: Retorno en Plantas Automáticas de Bloques",
        summary: "Cálculo de costo por metro cúbico de hormigón, consumo de cemento y árido, y amortización de maquinaria en proyectos de vivienda social.",
        tag: "ESTUDIO FINANCIERO",
        readTime: "6 min lectura",
        featuredProduct: {
          name: "Planta Automática de Bloques de Hormigón Serie Industrial",
          specs: "Central Hidráulica 16MPa • Mesa Vibratoria Sincronizada • PLC Táctil Siemens • Tolva de Carga",
          price: "Cotización Inmediata",
          regularPrice: "Disponibilidad Directa",
          img: "/images/categories/industria.jpg",
          href: "/web/blogs/guia-maquinas-de-bloques"
        }
      }
    ],
    catalogKeywords: ["bloque", "maquina", "planta", "hormigon", "industrial", "mezcladora"]
  }
]

export default function PublicWebClient({ 
  initialProducts = [], 
  metadata = { categories: [], collections: [] }, 
  userRole 
}: PublicWebClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeMainCategoryId, setActiveMainCategoryId] = useState<string | null>(null)
  const [activeSubcategoryId, setActiveSubcategoryId] = useState<string | null>(null)
  const [dynamicProducts, setDynamicProducts] = useState<any[]>([])
  const [isLoadingCategory, setIsLoadingCategory] = useState(false)
  const [searchResults, setSearchResults] = useState<any[] | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [showLiveDropdown, setShowLiveDropdown] = useState(false)
  const [liveMatches, setLiveMatches] = useState<any[]>([])
  const searchContainerRef = useRef<HTMLDivElement>(null)
  const searchDebounce = useRef<ReturnType<typeof setTimeout> | null>(null)
  const router = useRouter()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [activeUserModal, setActiveUserModal] = useState<string | null>(null)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authProfileType, setAuthProfileType] = useState<"empleado" | "comprador">("comprador")
  const [authEmail, setAuthEmail] = useState("")
  const [authPassword, setAuthPassword] = useState("")
  const [showAuthPassword, setShowAuthPassword] = useState(false)
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState("")

  const handleQuickLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!authEmail || !authPassword) {
      setAuthError("Ingresa tu correo y contraseña")
      return
    }
    setAuthLoading(true)
    setAuthError("")
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: authEmail.trim().toLowerCase(),
        password: authPassword,
      })
      if (res?.error) {
        setAuthError("Email o contraseña incorrectos")
      } else if (res?.ok) {
        try {
          const resRole = await fetch(`/api/auth/user-role?email=${encodeURIComponent(authEmail.trim().toLowerCase())}`)
          const dataRole = await resRole.json()
          const role = (dataRole?.role || "SALESPERSON").toUpperCase()
          if (role === "CONSUMIDOR") {
            setIsAuthModalOpen(false)
            router.refresh()
          } else if (role === "ACADEMIA") {
            router.push("/web/academy")
          } else if (role === "TECNICO") {
            router.push("/dashboard")
          } else if (role === "SALESPERSON" || role === "VENDEDOR") {
            router.push("/dashboard/asistencia")
          } else {
            router.push("/dashboard")
          }
        } catch {
          router.push("/dashboard")
        }
      }
    } catch {
      setAuthError("Error de conexión con el servidor")
    } finally {
      setAuthLoading(false)
    }
  }
  const userMenuRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState<string | null>(null)
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false)
  const [coverflowSection, setCoverflowSection] = useState<'ofertas' | 'promociones' | 'temporada' | 'combos' | 'instalacion' | 'servicios'>('ofertas')
  const [catalogSubdivision, setCatalogSubdivision] = useState<string>("todos")
  const [ofertasFilter, setOfertasFilter] = useState<'todos' | 'blackfriday' | 'remate'>('todos')
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null)
  const [newsletterFilter, setNewsletterFilter] = useState<'todos' | 'educacion' | 'tecnologia'>('todos')
  const [blogFilter, setBlogFilter] = useState<string>('todos')
  const [copiedCtaId, setCopiedCtaId] = useState<string | null>(null)

  const copyCtaText = (id: string, text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text)
      setCopiedCtaId(id)
      setTimeout(() => setCopiedCtaId(null), 2500)
    }
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false)
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowLiveDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    const handleSearchUpdate = (e: any) => {
      setSearchQuery(e.detail)
      setActiveMainCategoryId(null)
      setActiveSubcategoryId(null)
      setShowLiveDropdown(false)
      document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' })
    }
    window.addEventListener('atomic-search-update', handleSearchUpdate)
    return () => window.removeEventListener('atomic-search-update', handleSearchUpdate)
  }, [])

  useEffect(() => {
    if (searchDebounce.current) clearTimeout(searchDebounce.current)
    const q = searchQuery.trim()
    if (!q) {
      setSearchResults(null)
      setLiveMatches([])
      setIsSearching(false)
      setShowLiveDropdown(false)
      return
    }

    // Instant zero-lag local filter from initial products
    const localMatches = (initialProducts || []).filter((p: any) => {
      const target = `${p.name || ''} ${p.category?.name || ''} ${p.provider || ''} ${p.sku || ''} ${p.description || ''}`
      return fuzzyMatch(q, target)
    }).slice(0, 12)

    if (localMatches.length > 0) {
      setLiveMatches(localMatches)
      setShowLiveDropdown(true)
    }

    setIsSearching(true)
    searchDebounce.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/web/products?search=${encodeURIComponent(q)}&pageSize=60`)
        const data = await res.json()
        if (data && data.products) {
          setLiveMatches(data.products.slice(0, 12))
          setSearchResults(data.products)
          setShowLiveDropdown(true)
        }
      } catch {
        // preserve local matches
      } finally {
        setIsSearching(false)
      }
    }, 150)

    return () => { if (searchDebounce.current) clearTimeout(searchDebounce.current) }
  }, [searchQuery, initialProducts])

  useEffect(() => {
    if (!activeMainCategoryId && !activeSubcategoryId) {
      setDynamicProducts([])
      return
    }
    const fetchCategoryProducts = async () => {
      setIsLoadingCategory(true)
      try {
        const targetCat = activeSubcategoryId || activeMainCategoryId
        const res = await fetch(`/api/web/products?categoryId=${targetCat}&pageSize=100`)
        const data = await res.json()
        if (data && data.products) setDynamicProducts(data.products)
      } catch (error) {
        console.error("Error fetching category products:", error)
      } finally {
        setIsLoadingCategory(false)
      }
    }
    fetchCategoryProducts()
  }, [activeMainCategoryId, activeSubcategoryId])

  const filteredProducts = useMemo(() => {
    if (searchQuery.trim()) {
      if (searchResults !== null) return searchResults
      return initialProducts.filter(p => {
        const target = `${p.name} ${p.description || ''} ${p.category?.name || ''} ${p.provider || ''} ${p.sku || ''}`
        return fuzzyMatch(searchQuery, target)
      })
    }
    const base = dynamicProducts.length > 0 ? dynamicProducts : initialProducts
    if (activeSubcategoryId) {
      return base.filter(p => p.category?.id === activeSubcategoryId)
    } else if (activeMainCategoryId) {
      const cats = metadata?.categories || []
      const subCatIds = cats.filter(c => c.parentId === activeMainCategoryId).map(c => c.id)
      return base.filter(p => p.category?.id === activeMainCategoryId || subCatIds.includes(p.category?.id))
    }
    return base
  }, [searchQuery, searchResults, dynamicProducts, initialProducts, activeMainCategoryId, activeSubcategoryId, metadata?.categories])

  const CATALOG_SUBDIVISIONS = useMemo(() => [
    { id: "todos", label: "Todos los Productos", icon: "🌐" },
    { id: "marmol", label: "Acabados Tipo Mármol & WPC", icon: "🏛️", keywords: ["marmol", "mármol", "pvc", "wpc", "ranurado", "remodelacion", "panel", "adhesivo", "calacatta", "marquina"] },
    { id: "monitores", label: "Monitores & Pantallas", icon: "🖥️", keywords: ["monitor", "pantalla", "fhd", "ips", "144hz", "165hz", "curvo", "asus", "lg", "gigabyte"] },
    { id: "cerraduras", label: "Cerraduras Smart de Oferta", icon: "🔐", keywords: ["cerradura", "biometric", "facial", "manija", "pistones", "smart lock"] },
    { id: "generadores", label: "Generadores & Energía", icon: "⚡", keywords: ["generador", "bateria", "solix", "regulador", "ups", "anker", "solar", "planta"] },
    { id: "consolas", label: "Consolas & Gaming", icon: "🎮", keywords: ["ps5", "ps4", "playstation", "mando", "dualsense", "consola", "nintendo", "xbox", "gaming"] },
    { id: "hogar", label: "Cocina & Hornos (Hogar)", icon: "🍳", keywords: ["cocina", "horno", "campana", "encimera", "freidora", "induccion"] },
    { id: "automatizacion", label: "Automatización & Accesos", icon: "🚧", keywords: ["torniquete", "barrera", "acceso", "ditec", "antipanico", "cerco"] },
    { id: "camaras", label: "Cámaras & Videovigilancia", icon: "📷", keywords: ["camara", "cctv", "ezviz", "imou", "dvr", "nvr", "videoportero", "seguridad"] },
    { id: "laptops", label: "Laptops & Computación", icon: "💻", keywords: ["laptop", "dell", "hp", "lenovo", "portatil", "computadora", "aio", "cpu"] },
    { id: "repuestos", label: "Repuestos de Laptop", icon: "🔧", keywords: ["repuesto", "teclado", "bateria", "pantalla", "cargador", "flex"] }
  ], [])

  const displayedProducts = useMemo(() => {
    if (catalogSubdivision === "todos") return filteredProducts
    const sub = CATALOG_SUBDIVISIONS.find(s => s.id === catalogSubdivision)
    if (!sub || !('keywords' in sub)) return filteredProducts
    const keywords: string[] = (sub as any).keywords || []
    return filteredProducts.filter((p: any) => {
      const text = `${p.name || ''} ${p.description || ''} ${p.category?.name || ''}`.toLowerCase()
      return keywords.some((kw: string) => text.includes(kw.toLowerCase()))
    })
  }, [filteredProducts, catalogSubdivision, CATALOG_SUBDIVISIONS])


  return (
    <div className="w-full bg-[#FAFAFC] min-h-screen text-slate-900 font-sans selection:bg-blue-600/20 selection:text-blue-900 overflow-x-hidden">
      
      {/* ═══════════ APARTADO INDEPENDIENTE: PRODUCTOS 100% ORIGINALES & GARANTÍA (SIEMPRE NOS SIGUE A TODAS PARTES) ═══════════ */}
      <div className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-xl border-b border-emerald-500/30 py-1.5 px-4 text-center shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)] shrink-0" />
          <span className="text-emerald-700 font-black font-heading text-[10px] sm:text-[11px] uppercase tracking-widest">
            PRODUCTOS 100% ORIGINALES & GARANTÍA DIRECTA
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)] shrink-0" />
        </div>
      </div>

      {/* ═══════════ BANNER INDEPENDIENTE CENTRADO — ENVÍOS SIN RECARGO ═══════════ */}
      <section className="w-full bg-slate-100 border-b border-slate-200 py-2.5 px-4 text-center">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <Truck size={14} className="text-blue-600 shrink-0 animate-bounce" />
          <span className="text-slate-900 font-black font-heading text-[11px] sm:text-xs uppercase tracking-wider">
            PROMO: ENVÍOS SIN RECARGO A NIVEL NACIONAL EN CUALQUIER PRODUCTO
          </span>
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse ml-1 shrink-0" />
        </div>
      </section>

      {/* ═══════════ STICKY HORIZONTAL NAV TABS + ACCIONES + IN-PLACE DESPLEGABLE EN VIVO ═══════════ */}
      <nav className="sticky top-[29px] z-40 w-full bg-white/95 backdrop-blur-2xl border-b border-slate-200/90 shadow-[0_4px_25px_rgba(0,0,0,0.06)]">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-3 py-2.5">

          {/* LEFT: 3-LINES HAMBURGER + TABS */}
          <div className="flex items-center gap-1.5 lg:gap-2 xl:gap-2.5 overflow-x-auto scrollbar-hide no-scrollbar min-w-0 pr-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {/* 3-LINES HAMBURGER ICON BUTTON */}
            <button
              onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
              className={`p-1.5 lg:p-2 rounded-full border transition-all duration-200 active:scale-95 shrink-0 shadow-sm cursor-pointer flex items-center justify-center ${
                isMegaMenuOpen
                  ? 'bg-blue-600 text-white border-blue-600 shadow-blue-500/30'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 hover:text-slate-950'
              }`}
              title="Mapa Conceptual de Navegación"
              aria-label="Abrir Menú"
            >
              <Menu size={16} className={`transition-transform duration-300 ${isMegaMenuOpen ? 'rotate-90 text-white' : 'text-blue-600'}`} />
            </button>

            {/* BACK ARROW — visible when a tab is active */}
            {activeTab && (
              <button
                onClick={() => setActiveTab(null)}
                className="flex items-center gap-1 px-2.5 lg:px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-800 hover:bg-slate-200 text-[10px] sm:text-xs font-bold font-mono tracking-wider transition-all shrink-0 mr-0.5 shadow-sm"
              >
                <ChevronLeft size={14} />
                <span className="hidden md:inline">INICIO</span>
              </button>
            )}

            {/* ─── SECCIÓN 1: CATÁLOGO & NAVEGACIÓN PRINCIPAL ─── */}
            <div className="flex items-center gap-0.5 lg:gap-1 bg-slate-100 hover:bg-slate-200/70 p-0.5 lg:p-1 rounded-full border border-slate-200/80 backdrop-blur-md shrink-0 shadow-inner transition-colors">
              {[
                { id: 'categorias', label: 'CATEGORÍAS' },
                { id: 'ofertas', label: 'OFERTAS' },
                { id: 'especializacion', label: 'ÁREAS' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(activeTab === tab.id ? null : tab.id); setIsMegaMenuOpen(false); }}
                  className={`shrink-0 px-2 lg:px-2.5 xl:px-3.5 py-1 lg:py-1.5 rounded-full text-[10px] lg:text-[11px] font-bold tracking-wider font-heading transition-all duration-200 whitespace-nowrap border ${
                    activeTab === tab.id
                      ? 'bg-slate-950 text-white border-slate-950 shadow-md scale-105'
                      : 'bg-transparent text-slate-600 border-transparent hover:bg-white hover:text-slate-950'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* LÍNEA DIVISORIA VERTICAL 1 */}
            <div className="h-4 lg:h-5 w-[1px] bg-slate-300 shrink-0" />

            {/* ─── SECCIÓN 2: SUSCRIBIBLES & CONTENIDO DINÁMICO ─── */}
            <div className="flex items-center gap-0.5 lg:gap-1 bg-slate-100 hover:bg-slate-200/70 p-0.5 lg:p-1 rounded-full border border-slate-200/80 backdrop-blur-md shrink-0 shadow-inner transition-colors">
              {[
                { id: 'landings', label: 'LANDINGS' },
                { id: 'newsletter', label: 'NEWSLETTER' },
                { id: 'blog', label: 'BLOG' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(activeTab === tab.id ? null : tab.id); setIsMegaMenuOpen(false); }}
                  className={`shrink-0 px-2 lg:px-2.5 xl:px-3.5 py-1 lg:py-1.5 rounded-full text-[10px] lg:text-[11px] font-bold tracking-wider font-heading transition-all duration-200 whitespace-nowrap border ${
                    activeTab === tab.id
                      ? 'bg-slate-950 text-white border-slate-950 shadow-md scale-105'
                      : 'bg-transparent text-slate-600 border-transparent hover:bg-white hover:text-slate-950'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* LÍNEA DIVISORIA VERTICAL 2 */}
            <div className="h-4 lg:h-5 w-[1px] bg-slate-300 shrink-0" />

            {/* ─── SECCIÓN 3: CONFIANZA, EMPRESA & SOPORTE ─── */}
            <div className="flex items-center gap-0.5 lg:gap-1 bg-slate-100 hover:bg-slate-200/70 p-0.5 lg:p-1 rounded-full border border-slate-200/80 backdrop-blur-md shrink-0 shadow-inner transition-colors">
              {[
                { id: 'nosotros', label: 'NOSOTROS' },
                { id: 'contacto', label: 'CONTACTO' },
                { id: 'resenas', label: 'RESEÑAS' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(activeTab === tab.id ? null : tab.id); setIsMegaMenuOpen(false); }}
                  className={`shrink-0 px-2 lg:px-2.5 xl:px-3.5 py-1 lg:py-1.5 rounded-full text-[10px] lg:text-[11px] font-bold tracking-wider font-heading transition-all duration-200 whitespace-nowrap border ${
                    activeTab === tab.id
                      ? 'bg-slate-950 text-white border-slate-950 shadow-md scale-105'
                      : 'bg-transparent text-slate-600 border-transparent hover:bg-white hover:text-slate-950'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: WHATSAPP, LOGIN & USER */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* PORTAL VENDEDORES & LISTA DE PRECIOS */}
            <Link
              href="/web/precios-vendedor"
              className="px-2.5 sm:px-3 py-1.5 rounded-full border border-orange-500/40 hover:border-orange-600 bg-orange-50 hover:bg-orange-100 text-orange-800 hover:text-orange-950 font-bold font-heading uppercase tracking-wider text-[10px] sm:text-[11px] shadow-sm transition-all flex items-center gap-1 shrink-0"
              title="Portal de Vendedores & Lista de Precios"
            >
              <span className="text-orange-600">⚡</span>
              <span className="hidden xl:inline">PRECIOS VENDEDOR</span>
              <span className="xl:hidden">PRECIOS</span>
            </Link>

            {/* WHATSAPP CON CONTORNO ELEGANTE */}
            <a
              href="https://wa.me/593969043453?text=Hola%20ATOMIC!%20Deseo%20informaci%C3%B3n%20sobre%20sus%20productos."
              target="_blank"
              rel="noreferrer"
              className="px-2.5 sm:px-3 py-1.5 rounded-full border border-amber-500/50 hover:border-amber-600 bg-amber-50 hover:bg-amber-100 text-amber-800 hover:text-amber-900 font-bold font-heading uppercase tracking-wider text-[10px] sm:text-[11px] shadow-sm transition-all flex items-center gap-1 shrink-0"
              title="Asesoría Instantánea WhatsApp"
            >
              <span className="hidden 2xl:inline">ASESORÍA WHATSAPP</span>
              <span className="2xl:hidden hidden sm:inline">WHATSAPP</span>
              <span className="text-amber-600 font-bold">→</span>
            </a>

            {/* INICIAR SESIÓN / SELECTOR DE ACCESO */}
            <button
              type="button"
              onClick={() => setIsAuthModalOpen(true)}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-900 flex items-center justify-center shadow-sm transition-all active:scale-95 shrink-0 cursor-pointer"
              title="Iniciar Sesión / Acceso"
              aria-label="Iniciar Sesión"
            >
              <LogIn size={13} className="text-slate-900" />
            </button>

            {/* USER (ICONO SOLAMENTE CON PROTECCIÓN DE SESIÓN) */}
            <div className="relative z-50" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="w-7 h-7 sm:w-8 sm:h-8 bg-slate-100 border border-slate-300 hover:border-slate-400 rounded-full text-slate-900 shadow-sm transition-all active:scale-95 cursor-pointer flex items-center justify-center shrink-0"
                title="Cuenta de Usuario"
                aria-label="Cuenta de Usuario"
              >
                <User size={13} className="text-slate-800" />
              </button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-72 bg-white/98 border border-blue-500/30 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.18)] backdrop-blur-2xl p-3 z-50 overflow-hidden text-slate-900"
                  >
                    {!userRole ? (
                      <div className="space-y-3">
                        <div className="px-2 py-1.5 border-b border-slate-100">
                          <span className="text-[10px] font-mono text-blue-600 uppercase font-black tracking-widest block">
                            INVITADO // SIN SESIÓN
                          </span>
                          <p className="text-xs font-bold text-slate-900 mt-0.5">Acceso a Tu Cuenta ATOMIC</p>
                        </div>

                        <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 text-slate-600 text-xs leading-relaxed">
                          <p className="font-semibold text-slate-800 mb-1">¿Deseas ver tus compras y perfil?</p>
                          <p className="text-[11px]">Inicia sesión o regístrate para acceder a tu historial de pedidos, seguimiento de envíos y configuración personalizada.</p>
                        </div>

                        <button
                          onClick={() => { setIsAuthModalOpen(true); setIsUserMenuOpen(false); }}
                          className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 cursor-pointer"
                        >
                          <LogIn size={14} />
                          <span>INICIAR SESIÓN O REGISTRARSE</span>
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div className="px-3 py-2 border-b border-slate-100 mb-1">
                          <p className="text-[10px] font-mono text-blue-600 uppercase font-bold tracking-widest">Cuenta Activa // Rol: {userRole}</p>
                          <p className="text-xs font-bold text-slate-900 truncate">Usuario Verificado</p>
                        </div>

                        <button
                          onClick={() => { setActiveUserModal('perfil'); setIsUserMenuOpen(false); }}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-100 text-slate-800 text-xs font-bold transition-all text-left group cursor-pointer"
                        >
                          <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                            <User size={14} />
                          </div>
                          <span>Perfil</span>
                        </button>

                        <button
                          onClick={() => { setActiveUserModal('compras'); setIsUserMenuOpen(false); }}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-100 text-slate-800 text-xs font-bold transition-all text-left group cursor-pointer"
                        >
                          <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                            <ShoppingBag size={14} />
                          </div>
                          <span>Compras</span>
                        </button>

                        <button
                          onClick={() => { setActiveUserModal('envios'); setIsUserMenuOpen(false); }}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-100 text-slate-800 text-xs font-bold transition-all text-left group cursor-pointer"
                        >
                          <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                            <Truck size={14} />
                          </div>
                          <span>Envíos</span>
                        </button>

                        <button
                          onClick={() => { setActiveUserModal('settings'); setIsUserMenuOpen(false); }}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-100 text-slate-800 text-xs font-bold transition-all text-left group cursor-pointer"
                        >
                          <div className="w-7 h-7 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                            <Settings size={14} />
                          </div>
                          <span>Settings</span>
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* ═══════════ DESPLEGABLE EN VIVO (INLINE ACCORDION DROPDOWN) ═══════════ */}
        <AnimatePresence>
          {isMegaMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="w-full bg-white/98 border-t border-slate-200 shadow-2xl overflow-hidden backdrop-blur-2xl"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
                      <Hexagon size={18} />
                    </div>
                    <div>
                      <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        ECOSISTEMA INTEGRAL ATOMIC
                      </span>
                      <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-slate-950 font-heading">
                        MAPA CONCEPTUAL DE NAVEGACIÓN
                      </h2>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMegaMenuOpen(false)}
                    className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-all cursor-pointer"
                    title="Cerrar Desplegable"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Central Root Node (Mapa Conceptual) */}
                <div className="flex flex-col items-center justify-center mb-8">
                  <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-slate-50 border border-blue-400 shadow-[0_4px_20px_rgba(59,130,246,0.12)]">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                    <span className="text-xs sm:text-sm font-black font-heading tracking-widest text-slate-950 uppercase">
                      ATOMIC PLATFORM // CORE HUB
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <div className="w-0.5 h-5 bg-gradient-to-b from-blue-500/60 to-blue-500/20 my-1" />
                </div>

                {/* Quick Link to Portal de Vendedores */}
                <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border border-orange-300 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">⚡</span>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 uppercase">Portal de Vendedores & Lista de Precios PVP</h4>
                      <p className="text-xs text-slate-600">Accede a las políticas de entrega, cuentas bancarias, descuentos y 100 mensajes sugeridos.</p>
                    </div>
                  </div>
                  <Link
                    href="/web/precios-vendedor"
                    onClick={() => setIsMegaMenuOpen(false)}
                    className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shrink-0 transition-all shadow-md shadow-orange-600/20"
                  >
                    Entrar al Portal Vendedores →
                  </Link>
                </div>

                {/* Conceptual Map Grid with Interconnected Tree Lines */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 relative">
                  
                  {/* ─── RAMA 1: SECTORES ─── */}
                  <div className="relative bg-slate-50 border border-slate-200/90 hover:border-blue-400 hover:bg-white rounded-2xl p-5 transition-all group shadow-sm">
                    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-200">
                      <div className="w-8 h-8 rounded-xl bg-blue-100/70 border border-blue-200 flex items-center justify-center text-blue-600">
                        <Building size={16} />
                      </div>
                      <div>
                        <h3 className="text-sm font-black uppercase tracking-wider text-slate-950 font-heading">
                          SECTORES
                        </h3>
                        <p className="text-[10px] text-slate-500 font-mono">Divisiones de Especialización</p>
                      </div>
                    </div>

                    <div className="relative pl-5 space-y-2.5 before:absolute before:top-2 before:bottom-2 before:left-2 before:w-0.5 before:bg-blue-300">
                      {[
                        { name: "Tecnología Residencial & Domótica", desc: "Seguridad y control smart", query: "camara" },
                        { name: "Electrónica & Periféricos", desc: "Audio, gadgets y creadores", query: "electronica" },
                        { name: "Línea Hogar & Confort", desc: "Cocinas, encimeras y hornos", query: "cocina" },
                        { name: "Industria & Construcción", desc: "Plantas de bloques y maquinaria", query: "bloque" },
                        { name: "Energía & Movilidad Eléctrica", desc: "Cargadores EV y generadores", query: "generador" },
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setIsMegaMenuOpen(false)
                            setActiveTab(null)
                            setSearchQuery(item.query)
                            document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' })
                          }}
                          className="relative cursor-pointer hover:bg-blue-50/60 p-2 rounded-xl transition-all after:absolute after:top-1/2 after:-left-3 after:w-3 after:h-0.5 after:bg-blue-400"
                        >
                          <div className="text-xs font-bold text-slate-800 group-hover:text-blue-700 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                            <span>{item.name}</span>
                          </div>
                          <div className="text-[10px] text-slate-500 pl-3.5">{item.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ─── RAMA 2: CATEGORÍAS ─── */}
                  <div className="relative bg-slate-50 border border-slate-200/90 hover:border-amber-400 hover:bg-white rounded-2xl p-5 transition-all group shadow-sm">
                    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-200">
                      <div className="w-8 h-8 rounded-xl bg-amber-100/70 border border-amber-200 flex items-center justify-center text-amber-600">
                        <Package size={16} />
                      </div>
                      <div>
                        <h3 className="text-sm font-black uppercase tracking-wider text-slate-950 font-heading">
                          CATEGORÍAS
                        </h3>
                        <p className="text-[10px] text-slate-500 font-mono">Líneas de Producto Activas</p>
                      </div>
                    </div>

                    <div className="relative pl-5 space-y-2.5 before:absolute before:top-2 before:bottom-2 before:left-2 before:w-0.5 before:bg-amber-300">
                      {[
                        { name: "Apple Store (Mac, iPhone, iPad, Watch)", href: "/web/apple", badge: "APPLE" },
                        { name: "Acabados Tipo Mármol & Paneles WPC", href: "/web/paneles-ranurados", badge: "$27.00" },
                        { name: "Barreras Vehiculares Automáticas", href: "/web/barreras-vehiculares", badge: "2026" },
                        { name: "Cámaras Hogar 4K (2 Años Garantía)", href: "/web/camaras-hogar", badge: "2 AÑOS" },
                        { name: "Cerraduras Smart + Instalación", href: "/web/cerraduras-smart", badge: "KITS" },
                        { name: "Mandos & Consolas Gaming", href: "/web/mandos", badge: "NUEVO" },
                        { name: "Encimeras & Hornos", href: "/web/cocinas", badge: "HOGAR" },
                        { name: "Laptops & Computadoras Portátiles", href: "/web/laptops", badge: "PRO" },
                        { name: "Celulares, Tablets & Redes", href: "/web/phones", badge: "MÓVIL" },
                        { name: "Plantas de Bloques de Hormigón", href: "/web/blogs/guia-maquinas-de-bloques", badge: "INDUSTRIAL" },
                      ].map((item, idx) => (
                        <Link
                          key={idx}
                          href={item.href}
                          onClick={() => setIsMegaMenuOpen(false)}
                          className="relative block hover:bg-amber-50/60 p-2 rounded-xl transition-all after:absolute after:top-1/2 after:-left-3 after:w-3 after:h-0.5 after:bg-amber-400"
                        >
                          <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                            <span className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                              {item.name}
                            </span>
                            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                              {item.badge}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* ─── RAMA 3: BLOG & NEWSLETTER ─── */}
                  <div className="relative bg-slate-50 border border-slate-200/90 hover:border-purple-400 hover:bg-white rounded-2xl p-5 transition-all group shadow-sm">
                    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-200">
                      <div className="w-8 h-8 rounded-xl bg-purple-100/70 border border-purple-200 flex items-center justify-center text-purple-600">
                        <Sparkles size={16} />
                      </div>
                      <div>
                        <h3 className="text-sm font-black uppercase tracking-wider text-slate-950 font-heading">
                          BLOG & NEWSLETTER
                        </h3>
                        <p className="text-[10px] text-slate-500 font-mono">Contenido, New Sellers & Landings</p>
                      </div>
                    </div>

                    <div className="relative pl-5 space-y-2.5 before:absolute before:top-2 before:bottom-2 before:left-2 before:w-0.5 before:bg-purple-300">
                      {[
                        { tab: "blog", name: "Blog Tecnológico & Guías", desc: "Artículos y comparativas técnicas" },
                        { tab: "newsletter", name: "Newsletter Semanal", desc: "Ofertas exclusivas y lanzamientos" },
                        { tab: "landings", name: "Landings & New Sellers", desc: "Páginas dedicadas y distribuidores" },
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setIsMegaMenuOpen(false)
                            setActiveTab(item.tab)
                          }}
                          className="relative cursor-pointer hover:bg-purple-50/60 p-2 rounded-xl transition-all after:absolute after:top-1/2 after:-left-3 after:w-3 after:h-0.5 after:bg-purple-400"
                        >
                          <div className="text-xs font-bold text-slate-800 group-hover:text-purple-700 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                            <span>{item.name}</span>
                          </div>
                          <div className="text-[10px] text-slate-500 pl-3.5">{item.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ─── RAMA 4: OFERTAS & BENEFICIOS ─── */}
                  <div className="relative bg-slate-50 border border-slate-200/90 hover:border-emerald-400 hover:bg-white rounded-2xl p-5 transition-all group shadow-sm">
                    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-200">
                      <div className="w-8 h-8 rounded-xl bg-emerald-100/70 border border-emerald-200 flex items-center justify-center text-emerald-600">
                        <Zap size={16} />
                      </div>
                      <div>
                        <h3 className="text-sm font-black uppercase tracking-wider text-slate-950 font-heading">
                          OFERTAS
                        </h3>
                        <p className="text-[10px] text-slate-500 font-mono">Promociones y Despacho</p>
                      </div>
                    </div>

                    <div className="relative pl-5 space-y-2.5 before:absolute before:top-2 before:bottom-2 before:left-2 before:w-0.5 before:bg-emerald-300">
                      <div
                        onClick={() => {
                          setIsMegaMenuOpen(false)
                          setActiveTab('ofertas')
                        }}
                        className="relative cursor-pointer hover:bg-emerald-50/60 p-2 rounded-xl transition-all after:absolute after:top-1/2 after:-left-3 after:w-3 after:h-0.5 after:bg-emerald-400"
                      >
                        <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                          <span>Ofertas Destacadas</span>
                        </div>
                        <div className="text-[10px] text-slate-500 pl-3.5">Descuentos y combos de temporada</div>
                      </div>

                      <div className="relative hover:bg-emerald-50/60 p-2 rounded-xl transition-all after:absolute after:top-1/2 after:-left-3 after:w-3 after:h-0.5 after:bg-emerald-400">
                        <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                          <span>Envíos Sin Recargo Nacional</span>
                        </div>
                        <div className="text-[10px] text-slate-500 pl-3.5">Entrega segura en todo el Ecuador</div>
                      </div>

                      <div className="relative hover:bg-emerald-50/60 p-2 rounded-xl transition-all after:absolute after:top-1/2 after:-left-3 after:w-3 after:h-0.5 after:bg-emerald-400">
                        <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                          <span>Garantía 100% Originales</span>
                        </div>
                        <div className="text-[10px] text-slate-500 pl-3.5">Equipos con respaldo y certificación</div>
                      </div>
                    </div>
                  </div>

                  {/* ─── RAMA 5: INICIAR SESIÓN & CUENTA ─── */}
                  <div className="relative bg-slate-50 border border-slate-200/90 hover:border-cyan-400 hover:bg-white rounded-2xl p-5 transition-all group shadow-sm">
                    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-200">
                      <div className="w-8 h-8 rounded-xl bg-cyan-100/70 border border-cyan-200 flex items-center justify-center text-cyan-600">
                        <LogIn size={16} />
                      </div>
                      <div>
                        <h3 className="text-sm font-black uppercase tracking-wider text-slate-950 font-heading">
                          INICIAR SESIÓN
                        </h3>
                        <p className="text-[10px] text-slate-500 font-mono">Acceso a Plataforma ERP</p>
                      </div>
                    </div>

                    <div className="relative pl-5 space-y-2.5 before:absolute before:top-2 before:bottom-2 before:left-2 before:w-0.5 before:bg-cyan-300">
                      <Link
                        href="/login"
                        onClick={() => setIsMegaMenuOpen(false)}
                        className="relative block hover:bg-cyan-50/60 p-2 rounded-xl transition-all after:absolute after:top-1/2 after:-left-3 after:w-3 after:h-0.5 after:bg-cyan-400"
                      >
                        <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0" />
                          <span>Acceso al Sistema (Login)</span>
                        </div>
                        <div className="text-[10px] text-slate-500 pl-3.5">Ingreso con credenciales corporativas</div>
                      </Link>

                      <Link
                        href="/login"
                        onClick={() => setIsMegaMenuOpen(false)}
                        className="relative block hover:bg-cyan-50/60 p-2 rounded-xl transition-all after:absolute after:top-1/2 after:-left-3 after:w-3 after:h-0.5 after:bg-cyan-400"
                      >
                        <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0" />
                          <span>Generador de Cotizaciones</span>
                        </div>
                        <div className="text-[10px] text-slate-500 pl-3.5">Cotizador inteligente automatizado</div>
                      </Link>
                    </div>
                  </div>

                  {/* ─── RAMA 6: CONTACTO & ASISTENCIA ─── */}
                  <div className="relative bg-slate-50 border border-slate-200/90 hover:border-rose-400 hover:bg-white rounded-2xl p-5 transition-all group shadow-sm">
                    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-200">
                      <div className="w-8 h-8 rounded-xl bg-rose-100/70 border border-rose-200 flex items-center justify-center text-rose-600">
                        <User size={16} />
                      </div>
                      <div>
                        <h3 className="text-sm font-black uppercase tracking-wider text-slate-950 font-heading">
                          CONTACTO
                        </h3>
                        <p className="text-[10px] text-slate-500 font-mono">Atención Directa y Reseñas</p>
                      </div>
                    </div>

                    <div className="relative pl-5 space-y-2.5 before:absolute before:top-2 before:bottom-2 before:left-2 before:w-0.5 before:bg-rose-300">
                      <a
                        href="https://wa.me/593969043453?text=Hola%20ATOMIC!%20Deseo%20informaci%C3%B3n%20sobre%20sus%20productos."
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => setIsMegaMenuOpen(false)}
                        className="relative block hover:bg-rose-50/60 p-2 rounded-xl transition-all after:absolute after:top-1/2 after:-left-3 after:w-3 after:h-0.5 after:bg-rose-400"
                      >
                        <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                          <span>WhatsApp Oficial (+593 96 904 3453)</span>
                        </div>
                        <div className="text-[10px] text-slate-500 pl-3.5">Respuesta inmediata de asesores</div>
                      </a>

                      <div
                        onClick={() => {
                          setIsMegaMenuOpen(false)
                          setActiveTab('nosotros')
                        }}
                        className="relative cursor-pointer hover:bg-rose-50/60 p-2 rounded-xl transition-all after:absolute after:top-1/2 after:-left-3 after:w-3 after:h-0.5 after:bg-rose-400"
                      >
                        <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                          <span>Sobre Nosotros & Garantía</span>
                        </div>
                        <div className="text-[10px] text-slate-500 pl-3.5">Trayectoria ATOMIC, valores y respaldo comercial</div>
                      </div>

                      <div
                        onClick={() => {
                          setIsMegaMenuOpen(false)
                          setActiveTab('contacto')
                        }}
                        className="relative cursor-pointer hover:bg-rose-50/60 p-2 rounded-xl transition-all after:absolute after:top-1/2 after:-left-3 after:w-3 after:h-0.5 after:bg-rose-400"
                      >
                        <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                          <span>Formulario de Contacto & Ubicación</span>
                        </div>
                        <div className="text-[10px] text-slate-500 pl-3.5">Matriz comercial y canales oficiales</div>
                      </div>

                      <div
                        onClick={() => {
                          setIsMegaMenuOpen(false)
                          setActiveTab('resenas')
                        }}
                        className="relative cursor-pointer hover:bg-rose-50/60 p-2 rounded-xl transition-all after:absolute after:top-1/2 after:-left-3 after:w-3 after:h-0.5 after:bg-rose-400"
                      >
                        <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                          <span>Reseñas de Clientes</span>
                        </div>
                        <div className="text-[10px] text-slate-500 pl-3.5">Opiniones y calificaciones 5 estrellas</div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </nav>

      {/* ═══════════ TAB CONTENT PANELS (APPIT BENTO STYLE) ═══════════ */}
      <AnimatePresence mode="wait">
        {activeTab === 'categorias' && (
          <motion.section key="categorias" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex items-center gap-3 mb-8">
              <button onClick={() => setActiveTab(null)} className="p-2.5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-all shadow-sm">
                <ChevronLeft size={18} />
              </button>
              <h2 className="text-3xl font-black uppercase tracking-tight text-slate-950 font-heading">Categorías</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {(metadata?.categories?.filter(c => !c.parentId && c.isVisible !== false && !c.name.toLowerCase().includes('s55') && !c.name.toLowerCase().includes('soft3')) || []).map((cat: any) => {
                const targetHref = getCategoryTargetHref(cat.name, cat.slug)
                return (
                  <Link
                    key={cat.id}
                    href={targetHref}
                    className="p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-blue-500 hover:bg-blue-50/20 text-left transition-all group shadow-sm hover:shadow-xl block"
                  >
                    <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors font-heading uppercase leading-snug">
                      {cat.name}
                    </p>
                    <p className="text-[10px] font-mono text-blue-600 mt-2.5 uppercase tracking-widest font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>Ver catálogo</span>
                      <span>→</span>
                    </p>
                  </Link>
                )
              })}
            </div>
          </motion.section>
        )}

        {activeTab === 'ofertas' && (
          <motion.section key="ofertas" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
            {/* Header & Campaign Selector */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveTab(null)}
                  className="p-2.5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 hover:text-slate-950 transition-all shadow-sm cursor-pointer"
                  title="Volver a Inicio"
                >
                  <ChevronLeft size={18} />
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-red-600">
                      CAMPAÑAS DE TEMPORADA // ATOMIC ECUADOR
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-slate-950 font-heading">
                    Black Friday & Remate de Stock Fin de Año
                  </h2>
                </div>
              </div>

              {/* Subtabs Filter */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shrink-0 self-start md:self-auto shadow-inner">
                {[
                  { id: 'todos', label: '🔥 Todas las Ofertas' },
                  { id: 'blackfriday', label: '⚡ Black Friday Tech' },
                  { id: 'remate', label: '📦 Remate Fin de Año' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setOfertasFilter(f.id as any)}
                    className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold font-heading transition-all cursor-pointer ${
                      ofertasFilter === f.id
                        ? 'bg-slate-950 text-white shadow-md scale-102'
                        : 'text-slate-600 hover:text-slate-950 hover:bg-white'
                    }`}
                  >
                    <span>{f.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 1. SECCIÓN BLACK FRIDAY ATOMIC */}
            {(ofertasFilter === 'todos' || ofertasFilter === 'blackfriday') && (
              <div className="mb-14">
                {/* Hero Banner Black Friday */}
                <div className="relative rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white p-6 sm:p-10 border border-blue-500/20 shadow-2xl overflow-hidden mb-8">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

                  <div className="relative z-10 max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-400 text-[10px] font-mono font-bold tracking-widest uppercase mb-4">
                      <Sparkles size={12} className="animate-pulse" />
                      <span>{BLACK_FRIDAY_DATA.badge}</span>
                    </div>
                    <h3 className="text-2xl sm:text-4xl lg:text-5xl font-black font-heading tracking-tight uppercase leading-tight mb-4">
                      {BLACK_FRIDAY_DATA.headline}
                    </h3>
                    <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                      {BLACK_FRIDAY_DATA.subheadline}
                    </p>

                    {/* Blog Tips / Guía Rápida */}
                    <div className="grid sm:grid-cols-3 gap-3 pt-4 border-t border-white/10 text-xs">
                      {BLACK_FRIDAY_DATA.blogIntro.tips.map((tip) => (
                        <div key={tip.num} className="bg-white/5 backdrop-blur-md rounded-2xl p-3 border border-white/10">
                          <span className="text-[10px] font-mono font-black text-blue-400 block mb-1">Paso {tip.num}</span>
                          <p className="font-bold text-white text-[11px] mb-1">{tip.title}</p>
                          <p className="text-slate-400 text-[10px] leading-relaxed">{tip.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Editorial Blog Card Black Friday */}
                <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 mb-8 shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <span className="text-[10px] font-mono uppercase font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                        EDITORIAL // GUÍA DE COMPRAS BLACK FRIDAY
                      </span>
                      <h4 className="text-lg sm:text-xl font-black text-slate-900 mt-2 font-heading">
                        {BLACK_FRIDAY_DATA.blogIntro.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 font-mono">
                        {BLACK_FRIDAY_DATA.blogIntro.date}
                      </p>
                    </div>
                    <a
                      href="https://wa.me/593969043453?text=Hola%20ATOMIC!%20Deseo%20congelar%20precio%20promocional%20de%20Black%20Friday"
                      target="_blank"
                      rel="noreferrer"
                      className="px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 self-start md:self-auto cursor-pointer"
                    >
                      <span>💬 Congelar Tarifa por WhatsApp</span>
                    </a>
                  </div>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    {BLACK_FRIDAY_DATA.blogIntro.summary}
                  </p>
                </div>

                {/* Products Grid Black Friday */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {BLACK_FRIDAY_DATA.products.map((p) => (
                    <div
                      key={p.id}
                      className="group flex flex-col bg-white border border-slate-200/90 rounded-3xl overflow-hidden hover:border-blue-500/50 hover:shadow-xl transition-all duration-300"
                    >
                      <div className="relative aspect-[4/3] bg-slate-50 flex items-center justify-center p-4 border-b border-slate-100">
                        <SafeImage src={p.img} alt={p.name} fill className="p-3 group-hover:scale-105 transition-transform duration-300" />
                        <div className="absolute top-3 left-3 bg-red-600 text-white font-black text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                          {p.badge}
                        </div>
                        <div className="absolute top-3 right-3 bg-slate-950 text-white font-black text-xs px-2.5 py-1 rounded-full font-mono shadow-md">
                          {p.discountPct}
                        </div>
                      </div>

                      <div className="p-5 flex flex-col flex-1">
                        <h5 className="font-heading font-black text-sm text-slate-900 group-hover:text-blue-600 transition-colors leading-snug mb-3">
                          {p.name}
                        </h5>

                        <ul className="space-y-1.5 mb-4 text-[11px] text-slate-600 flex-1">
                          {p.specs.map((spec, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-emerald-500 font-bold shrink-0">✓</span>
                              <span className="line-clamp-1">{spec}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="pt-3 border-t border-slate-100 flex items-baseline justify-between mb-4">
                          <div>
                            <span className="text-[10px] font-mono text-slate-400 line-through mr-2">
                              {p.originalPrice}
                            </span>
                            <span className="text-lg font-black text-slate-950 font-heading">
                              {p.promoPrice}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-emerald-600 font-bold uppercase">
                            Envío Gratis
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-auto">
                          <Link
                            href={p.showroomHref}
                            className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[10px] uppercase tracking-wider text-center transition-colors flex items-center justify-center"
                          >
                            Ver Showroom
                          </Link>
                          <a
                            href={`https://wa.me/593969043453?text=${encodeURIComponent(p.waMessage)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] uppercase tracking-wider text-center transition-colors flex items-center justify-center shadow-sm cursor-pointer"
                          >
                            Comprar WA
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. SECCIÓN REMATE DE STOCK DE FIN DE AÑO */}
            {(ofertasFilter === 'todos' || ofertasFilter === 'remate') && (
              <div>
                {/* Hero Banner Remate Fin de Año */}
                <div className="relative rounded-3xl bg-gradient-to-br from-amber-950 via-slate-900 to-amber-900 text-white p-6 sm:p-10 border border-amber-500/20 shadow-2xl overflow-hidden mb-8">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

                  <div className="relative z-10 max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-[10px] font-mono font-bold tracking-widest uppercase mb-4">
                      <Package size={12} className="animate-pulse" />
                      <span>{REMATE_STOCK_DATA.badge}</span>
                    </div>
                    <h3 className="text-2xl sm:text-4xl lg:text-5xl font-black font-heading tracking-tight uppercase leading-tight mb-4">
                      {REMATE_STOCK_DATA.headline}
                    </h3>
                    <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                      {REMATE_STOCK_DATA.subheadline}
                    </p>

                    <div className="grid sm:grid-cols-3 gap-3 pt-4 border-t border-white/10 text-xs">
                      {REMATE_STOCK_DATA.blogIntro.reasons.map((r, i) => (
                        <div key={i} className="bg-white/5 backdrop-blur-md rounded-2xl p-3 border border-white/10">
                          <span className="text-[10px] font-mono font-black text-amber-400 block mb-1">{r.tag}</span>
                          <p className="font-bold text-white text-[11px] mb-1">{r.title}</p>
                          <p className="text-slate-400 text-[10px] leading-relaxed">{r.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Editorial Blog Card Remate Fin de Año */}
                <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 mb-8 shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <span className="text-[10px] font-mono uppercase font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
                        EDITORIAL // LIQUIDACIÓN DE BODEGA & COSTOS
                      </span>
                      <h4 className="text-lg sm:text-xl font-black text-slate-900 mt-2 font-heading">
                        {REMATE_STOCK_DATA.blogIntro.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 font-mono">
                        {REMATE_STOCK_DATA.blogIntro.date}
                      </p>
                    </div>
                    <a
                      href="https://wa.me/593969043453?text=Hola%20ATOMIC!%20Quisiera%20cotizar%20un%20lote%20mayorista%20de%20remate%20de%20fin%20de%20año"
                      target="_blank"
                      rel="noreferrer"
                      className="px-5 py-2.5 rounded-full bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 self-start md:self-auto cursor-pointer"
                    >
                      <span>📦 Cotizar Lote Mayorista por WA</span>
                    </a>
                  </div>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    {REMATE_STOCK_DATA.blogIntro.summary}
                  </p>
                </div>

                {/* Products Grid Remate Fin de Año */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {REMATE_STOCK_DATA.products.map((p) => (
                    <div
                      key={p.id}
                      className="group flex flex-col bg-white border border-slate-200/90 rounded-3xl overflow-hidden hover:border-amber-500/50 hover:shadow-xl transition-all duration-300"
                    >
                      <div className="relative aspect-[4/3] bg-slate-50 flex items-center justify-center p-4 border-b border-slate-100">
                        <SafeImage src={p.img} alt={p.name} fill className="p-3 group-hover:scale-105 transition-transform duration-300" />
                        <div className="absolute top-3 left-3 bg-amber-600 text-white font-black text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                          {p.badge}
                        </div>
                        <div className="absolute top-3 right-3 bg-slate-950 text-white font-black text-xs px-2.5 py-1 rounded-full font-mono shadow-md">
                          {p.discountPct}
                        </div>
                      </div>

                      <div className="p-5 flex flex-col flex-1">
                        <h5 className="font-heading font-black text-sm text-slate-900 group-hover:text-amber-700 transition-colors leading-snug mb-3">
                          {p.name}
                        </h5>

                        <ul className="space-y-1.5 mb-4 text-[11px] text-slate-600 flex-1">
                          {p.specs.map((spec, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-amber-600 font-bold shrink-0">✓</span>
                              <span className="line-clamp-1">{spec}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="pt-3 border-t border-slate-100 flex items-baseline justify-between mb-4">
                          <div>
                            <span className="text-[10px] font-mono text-slate-400 line-through mr-2">
                              {p.originalPrice}
                            </span>
                            <span className="text-lg font-black text-slate-950 font-heading">
                              {p.promoPrice}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-amber-700 font-bold">
                            {p.savings}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-auto">
                          <Link
                            href={p.showroomHref}
                            className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[10px] uppercase tracking-wider text-center transition-colors flex items-center justify-center"
                          >
                            Ver Showroom
                          </Link>
                          <a
                            href={`https://wa.me/593969043453?text=${encodeURIComponent(p.waMessage)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-[10px] uppercase tracking-wider text-center transition-colors flex items-center justify-center shadow-sm cursor-pointer"
                          >
                            Comprar WA
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.section>
        )}

        {activeTab === 'blog' && (
          <motion.section key="blog" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
            {/* Editorial Masthead Bar */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-8 border-b border-slate-200">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  <button onClick={() => setActiveTab(null)} className="p-2.5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 hover:text-slate-950 transition-all shadow-sm cursor-pointer flex items-center gap-1.5 text-xs font-bold" title="Volver a Inicio">
                    <ChevronLeft size={16} />
                    <span>Inicio</span>
                  </button>
                  <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-mono font-bold text-[10px] uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                    THE ATOMIC JOURNAL • EDICIÓN 2027
                  </span>
                  <span className="hidden sm:inline-block text-[10px] font-mono text-slate-400">
                    ISSN 2954-771X // PUBLICACIÓN CONTINUA
                  </span>
                </div>

                <div>
                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-slate-950 font-heading leading-tight">
                    The ATOMIC Journal <span className="text-blue-600 font-mono text-2xl sm:text-4xl">#BLOG</span>
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mt-1.5 leading-relaxed font-sans">
                    Reviews rigurosos de hardware, ingeniería de software, investigación de soluciones y guías maestras de formación tecnológica para profesionales y empresas en Ecuador.
                  </p>
                </div>
              </div>

              {/* Subtabs Filter #BLOG */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shrink-0 self-start md:self-auto shadow-inner overflow-x-auto scrollbar-hide max-w-full">
                {[
                  { id: 'todos', label: '🔥 Todo el Journal' },
                  { id: 'reviews', label: '💻 Hardware Reviews' },
                  { id: 'soluciones', label: '🤖 Software & IA' },
                  { id: 'seguridad', label: '📹 Seguridad & Domótica' },
                  { id: 'energia', label: '⚡ Energía & EV' },
                  { id: 'recursos', label: '🎓 Guías & Educación' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setBlogFilter(f.id)}
                    className={`px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-xs font-bold font-heading transition-all cursor-pointer whitespace-nowrap ${
                      blogFilter === f.id
                        ? 'bg-slate-950 text-white shadow-md scale-102'
                        : 'text-slate-600 hover:text-slate-950 hover:bg-white'
                    }`}
                  >
                    <span>{f.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Featured Bento Hero Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
              {/* Cover Article (8 Cols) */}
              <div className="lg:col-span-8 group relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl flex flex-col justify-between text-left transition-all">
                <div className="relative h-72 sm:h-96 w-full overflow-hidden">
                  <SafeImage
                    src="/images/promociones/laptops-portada.jpg"
                    alt="Review Laptops Gamers vs Ultrabooks Corporativos"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 brightness-90 group-hover:brightness-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
                  <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-blue-600/90 text-white font-mono font-bold text-[10px] uppercase tracking-wider backdrop-blur-md shadow-md flex items-center gap-1.5">
                      <Flame size={12} className="text-amber-300" />
                      HISTORIA DE PORTADA • EXCLUSIVO
                    </span>
                    <span className="px-3 py-1 rounded-full bg-slate-900/80 text-slate-200 font-mono text-[10px] uppercase tracking-wider backdrop-blur-md border border-white/10 flex items-center gap-1">
                      <Clock size={11} />
                      7 MIN DE LECTURA
                    </span>
                  </div>
                </div>

                <div className="p-6 sm:p-8 relative z-10 -mt-16 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent">
                  <div className="flex items-center gap-2 text-blue-400 text-xs font-mono mb-2 uppercase tracking-widest">
                    <span>#BLOG // HARDWARE REVIEW & BENCHMARK</span>
                    <span>•</span>
                    <span>Edición 2026-2027</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white font-heading leading-tight mb-3 group-hover:text-blue-300 transition-colors">
                    Review & Benchmark 2027: Laptops Gamers vs Estaciones Corporativas Dell & ThinkPad para Desarrollo e IA
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 font-sans line-clamp-3">
                    Sometemos a pruebas de estrés térmico, renderizado 3D y despliegue de contenedores Docker las laptops líderes del mercado en Ecuador. ¿Conviene una workstation con chasis de magnesio o una laptop gamer con GPU RTX? Desglosamos benchmarks reales, durabilidad y retorno de inversión.
                  </p>

                  <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold font-mono text-xs">
                        AT
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white font-heading">Ing. Juan Pablo Guzmán</p>
                        <p className="text-[10px] font-mono text-slate-400">Laboratorio I+D de Hardware ATOMIC</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href="/web/laptops-blog"
                        className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-lg shadow-blue-600/30 cursor-pointer"
                      >
                        <span>Leer Artículo</span>
                        <ArrowRight size={14} />
                      </Link>
                      <button
                        onClick={() => copyCtaText('hero-laptop', '💻 ¿Qué laptop elegir para desarrollo o ingeniería en 2026-2027? Comparamos potencia gráfica vs durabilidad corporativa. 🚀 Lee el review completo aquí: https://atomiccotizador.shop/web/laptops-blog 📲 Cotiza tu equipo con garantía en WhatsApp: https://wa.me/593969043453 #BLOG #LaptopsEcuador #ATOMIC')}
                        className={`px-3 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 border cursor-pointer ${
                          copiedCtaId === 'hero-laptop'
                            ? 'bg-emerald-600 text-white border-emerald-500'
                            : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-700'
                        }`}
                      >
                        {copiedCtaId === 'hero-laptop' ? (
                          <>
                            <Check size={14} />
                            <span>¡Copiado!</span>
                          </>
                        ) : (
                          <>
                            <Copy size={14} />
                            <span>Copiar CTA</span>
                          </>
                        )}
                      </button>
                      <a
                        href="https://wa.me/593969043453?text=Hola%20ATOMIC,%20leí%20el%20review%20de%20laptops%20en%20el%20Blog%20y%20deseo%20asesoría%20para%20adquirir%20un%20equipo"
                        target="_blank"
                        rel="noreferrer"
                        className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md cursor-pointer"
                        title="Consultar en WhatsApp"
                      >
                        <MessageSquare size={16} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Side Bento Column (4 Cols) */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                {/* ATOMIC Cinema Box */}
                <div className="rounded-3xl bg-white border border-slate-200/90 shadow-xl p-5 flex flex-col justify-between text-left">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-600">
                          ATOMIC CINEMA // SPOTLIGHT
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono text-[9px] font-bold">
                        HD 1080P
                      </span>
                    </div>

                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 shadow-inner mb-3 border border-slate-100">
                      <iframe
                        className="w-full h-full"
                        src="https://www.youtube.com/embed/_rI46cUolfQ"
                        title="ATOMIC Industrias Ecuador - Capacitación Técnica"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 font-heading leading-snug mb-1">
                      Capacitación: Barreras Antipánico y Vías de Evacuación Segura
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed mb-3">
                      Normativa de seguridad contra siniestros, mecanismos de escape rápido y control de accesos corporativos.
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400">Canal YouTube Oficial</span>
                    <a
                      href="https://www.youtube.com/@atomicindustrias"
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 font-heading"
                    >
                      <span>Ver Canal</span>
                      <ArrowUpRight size={14} />
                    </a>
                  </div>
                </div>

                {/* Trending / Lo Más Leído */}
                <div className="rounded-3xl bg-slate-950 text-white p-5 border border-slate-800 shadow-xl text-left flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-800 text-blue-400 font-mono text-[10px] font-bold uppercase tracking-widest">
                      <Flame size={13} className="text-amber-400" />
                      <span>TRENDING // LO MÁS LEÍDO</span>
                    </div>

                    <div className="space-y-3.5">
                      {[
                        { num: '01', title: '12 Prompts de IA para Fotografía Hiperrealista & VFX', href: '/prompts', tag: 'IA & Creatividad' },
                        { num: '02', title: 'Cómo un Bot de WhatsApp con Facturación SRI Triplica Ventas', href: '/web/software', tag: 'Software Empresarial' },
                        { num: '03', title: 'Cámara Exterior Doble Lente PIP con Autotracking 360°', href: '/aurora-pro', tag: 'Seguridad Residencial' },
                        { num: '04', title: 'Cursos Gratuitos con MIT, Harvard & Stanford', href: '/recursos', tag: 'Educación Élite' },
                      ].map((item) => (
                        <Link
                          key={item.num}
                          href={item.href}
                          className="group flex items-start gap-3 hover:translate-x-1 transition-transform"
                        >
                          <span className="text-xl font-black font-mono text-blue-500/80 group-hover:text-blue-400 shrink-0">
                            {item.num}
                          </span>
                          <div>
                            <p className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors leading-snug line-clamp-2">
                              {item.title}
                            </p>
                            <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block mt-0.5">
                              {item.tag}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 mt-4 border-t border-slate-800 text-[10px] font-mono text-slate-400 text-center">
                    Métricas verificadas • Atomic Analytics
                  </div>
                </div>
              </div>
            </div>

            {/* Articles Stream Grid */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <BookOpen size={18} className="text-blue-600" />
                  <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-slate-900 font-heading">
                    Artículos & Investigaciones Publicadas
                  </h2>
                </div>
                <span className="text-xs font-mono text-slate-500">
                  Mostrando publicaciones verificadas
                </span>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    id: 'blog-laptops-review',
                    category: 'reviews',
                    tag: '#BLOG // REVIEW DE PRODUCTO',
                    readTime: '6 min',
                    date: 'Noviembre 2026',
                    author: 'Ing. Juan Pablo G.',
                    image: '/images/promociones/laptops-portada.jpg',
                    title: '💻 Review & Benchmark: Laptops Gamers vs Ultrabooks Dell Latitude',
                    desc: 'Evaluamos autonomía de batería, chasis de magnesio, temperaturas en renderizado 3D y rendimiento de CPUs Intel Core i7 para profesionales y desarrolladores.',
                    href: '/web/laptops-blog',
                    ctaText: '💻 ¿Qué laptop elegir para desarrollo o ingeniería en 2026? Comparamos potencia gráfica vs durabilidad corporativa. 🚀 Lee el review completo aquí: https://atomiccotizador.shop/web/laptops-blog 📲 Cotiza tu equipo con garantía en WhatsApp: https://wa.me/593969043453 #BLOG #LaptopsEcuador #ATOMIC'
                  },
                  {
                    id: 'blog-software-bots',
                    category: 'soluciones',
                    tag: '#BLOG // INVESTIGACIÓN DE SOFTWARE',
                    readTime: '5 min',
                    date: 'Noviembre 2026',
                    author: 'Equipo Software I+D',
                    image: '/images/software/automatizacion-bot-99.jpg',
                    title: '🤖 Cómo un Bot de WhatsApp con Facturación SRI Multiplica Ventas',
                    desc: 'Investigación empírica: Las empresas que responden en menos de 2 minutos y emiten facturas electrónicas en 3 segundos triplican su conversión comercial.',
                    href: '/web/software',
                    ctaText: '🤖 ¡Automatiza tus ventas y emite facturas SRI en 3 segundos! Descubre cómo los agentes inteligentes atienden WhatsApp 24/7. 🚀 Mira la investigación aquí: https://atomiccotizador.shop/web/software 📲 Agenda tu demo gratuita en WhatsApp: https://wa.me/593969043453 #BLOG #SoftwareSRI #Automatizacion'
                  },
                  {
                    id: 'blog-doble-lente',
                    category: 'seguridad',
                    tag: '#BLOG // SEGURIDAD RESIDENCIAL',
                    readTime: '4 min',
                    date: 'Noviembre 2026',
                    author: 'Seguridad Electrónica',
                    image: '/images/hero-3d/slide-2.jpg',
                    title: '📹 Review de Producto: Cámara Exterior Doble Lente (PIP) con Vigilancia 360°',
                    desc: 'Prueba de campo bajo lluvia (IP66): Cómo la tecnología PIP elimina puntos ciegos en parques, residencias y negocios con luces disuasorias y autotracking.',
                    href: '/aurora-pro',
                    ctaText: '📹 ¡Vigila tu hogar seguramente! Probamos la cámara exterior doble lente PIP con seguimiento 360° y luces disuasorias. 🚀 Conoce todos los detalles aquí: https://atomiccotizador.shop/aurora-pro 📲 Pídela desde $63.77 o con instalación en WhatsApp: https://wa.me/593969043453 #BLOG #SeguridadResidencial #ATOMIC'
                  },
                  {
                    id: 'blog-recursos-mit',
                    category: 'recursos',
                    tag: '#BLOG // EDUCACIÓN DE ÉLITE',
                    readTime: '7 min',
                    date: 'Noviembre 2026',
                    author: 'Educación & Certificaciones',
                    image: '/images/tech-command-center-4k.jpg',
                    title: '🎓 Recursos Top Educativos: Cursos con MIT, Harvard & Stanford',
                    desc: 'Rutas maestras de aprendizaje con certificación gratuita en Inteligencia Artificial, Programación, Finanzas y Liderazgo de las universidades #1 del mundo.',
                    href: '/recursos',
                    ctaText: '🎓 ¿Quieres estudiar en MIT, Harvard o Stanford 100% GRATIS? En ATOMIC preparamos la lista maestra de programas oficiales con acceso abierto en IA, programación y finanzas. 🚀 Mira la guía completa aquí: https://atomiccotizador.shop/recursos 📲 ¿Dudas o necesitas soporte para inscribirte? Escríbenos directo a nuestro WhatsApp: https://wa.me/593969043453 #BLOG #EducacionGratis #ATOMIC'
                  },
                  {
                    id: 'blog-prompts-mrbeast',
                    category: 'recursos',
                    tag: '#BLOG // RECURSOS & GUÍAS',
                    readTime: '5 min',
                    date: 'Noviembre 2026',
                    author: 'Laboratorio de Creatividad IA',
                    image: '/images/atomic-studio/mega-pack-creador-contenido.jpg',
                    title: '🎨 12 Prompts de IA para Fotografía Hiperrealista & VFX Publicitario',
                    desc: 'Fórmulas maestras para miniaturas virales, retratos ejecutivos con iluminación de estudio y texturas cinematográficas con PDF oficial descargable.',
                    href: '/prompts',
                    ctaText: '🎨 Domina la fotografía con Inteligencia Artificial. 12 prompts hiperrealistas 8K con PDF oficial descargable. 🚀 Explora los prompts aquí: https://atomiccotizador.shop/prompts 📲 Soporte técnico vía WhatsApp: https://wa.me/593969043453 #BLOG #PromptsIA #ATOMIC'
                  },
                  {
                    id: 'blog-anker-solix',
                    category: 'energia',
                    tag: '#BLOG // ENERGÍA & RESILIENCIA',
                    readTime: '5 min',
                    date: 'Noviembre 2026',
                    author: 'Ingeniería Energética',
                    image: '/images/anker-solix/anker-solix-c300-hero-hogar.jpg',
                    title: '⚡ Review & Guía: Estaciones de Poder Anker Solix C300 ante Apagones',
                    desc: 'Análisis de celdas LiFePO4 de 300W/600W pico: Cómo alimentar laptops de trabajo, routers de fibra óptica y sistemas de seguridad durante cortes prolongados.',
                    href: '/web/generadores',
                    ctaText: '⚡ ¿Preparado para los cortes de luz? Probamos la estación de energía Anker Solix C300 con carga ultra rápida y celdas LiFePO4. 🚀 Mira el análisis completo aquí: https://atomiccotizador.shop/web/generadores 📲 Cotiza la tuya con entrega inmediata en WhatsApp: https://wa.me/593969043453 #BLOG #AnkerSolix #EnergiaIninterrumpida'
                  },
                  {
                    id: 'blog-cargadores-wallbox',
                    category: 'energia',
                    tag: '#BLOG // MOVILIDAD SOSTENIBLE',
                    readTime: '6 min',
                    date: 'Noviembre 2026',
                    author: 'Movilidad Eléctrica',
                    image: '/images/promociones/cargador-wallbox-mevo.jpg',
                    title: '🔋 Guía Técnica de Instalación de Cargadores Wallbox Livoltek 7.3 kW',
                    desc: 'Requerimientos 220V, protecciones diferenciales y balanceo dinámico de carga para residencias y tiempos de recarga para vehículos eléctricos en Ecuador.',
                    href: '/web/cargadores-electricos',
                    ctaText: '🔋 ¿Compraste un vehículo eléctrico en Ecuador? Te explicamos cómo instalar un cargador Wallbox Livoltek 7.3 kW con total seguridad. 🚀 Lee la guía aquí: https://atomiccotizador.shop/web/cargadores-electricos 📲 Cotiza cargador + instalación certificada: https://wa.me/593969043453 #BLOG #AutosElectricos #Wallbox'
                  },
                  {
                    id: 'blog-cursos-youtube',
                    category: 'recursos',
                    tag: '#BLOG // CAPACITACIÓN GRATUITA',
                    readTime: '4 min',
                    date: 'Noviembre 2026',
                    author: 'Academy ATOMIC',
                    image: '/images/wholesale-tech-hub-4k.jpg',
                    title: '📺 9 Cursos Gratuitos de YouTube en Ventas, IA & Liderazgo Estratégico',
                    desc: 'Capacitación audiovisual de alto impacto para emprendedores, directores comerciales y desarrolladores sin costo de suscripción.',
                    href: '/post-4',
                    ctaText: '📺 Rutas de autoaprendizaje en video: Ventas de Alto Impacto, Liderazgo e Inteligencia Artificial 100% Gratis. 🚀 Mira los cursos aquí: https://atomiccotizador.shop/post-4 📲 Contacto oficial ATOMIC: https://wa.me/593969043453 #BLOG #CursosGratis #ATOMIC'
                  },
                ].filter(post => blogFilter === 'todos' || post.category === blogFilter).map(post => (
                  <div
                    key={post.id}
                    className="group rounded-3xl bg-white border border-slate-200/90 hover:border-blue-400/50 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden text-left"
                  >
                    <div>
                      {/* Card Cover Image with zoom */}
                      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                        <SafeImage
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 flex items-center gap-1.5">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-white bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 shadow-sm">
                            {post.tag}
                          </span>
                        </div>
                        <div className="absolute top-3 right-3">
                          <span className="text-[10px] font-mono font-bold text-slate-800 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-md shadow-sm flex items-center gap-1">
                            <Clock size={10} />
                            {post.readTime}
                          </span>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-5 sm:p-6">
                        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2">
                          <span>{post.date}</span>
                          <span>•</span>
                          <span>{post.author}</span>
                        </div>
                        <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors mb-2 font-heading leading-snug">
                          {post.title}
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                          {post.desc}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="p-5 sm:p-6 pt-0 mt-auto">
                      <div className="pt-4 border-t border-slate-100 space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <Link
                            href={post.href}
                            className="py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-[10px] uppercase tracking-wider text-center transition-colors flex items-center justify-center gap-1 group-hover:bg-blue-600 cursor-pointer"
                          >
                            <span>Leer Más</span>
                            <ArrowRight size={12} />
                          </Link>
                          <button
                            onClick={() => copyCtaText(post.id, post.ctaText)}
                            className={`py-2.5 px-3 rounded-xl font-bold text-[10px] uppercase tracking-wider text-center transition-all flex items-center justify-center gap-1 border cursor-pointer ${
                              copiedCtaId === post.id
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                            }`}
                          >
                            {copiedCtaId === post.id ? (
                              <>
                                <Check size={12} />
                                <span>¡Copiado!</span>
                              </>
                            ) : (
                              <>
                                <Copy size={12} />
                                <span>Copiar CTA</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Creator / Community Banner */}
            <div className="mt-14 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl text-left">
              <div className="space-y-2 max-w-2xl">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-blue-400 bg-blue-950/80 px-2.5 py-1 rounded-full border border-blue-800/50 inline-block">
                  RED EDITORIAL // CREADORES & AFILIADOS #BLOG
                </span>
                <h3 className="text-xl sm:text-2xl font-black font-heading leading-tight">
                  ¿Creas contenido de tecnología o gestionas canales de difusión?
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Utiliza el botón <strong className="text-slate-200">«Copiar CTA»</strong> en cada artículo para obtener el texto formateado con enlaces directos y trazabilidad para redes sociales (TikTok, LinkedIn, Instagram). Direcciona consultas a nuestro WhatsApp CRM con comisión de canal.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
                <a
                  href="https://wa.me/593969043453?text=Hola%20ATOMIC,%20deseo%20sumarme%20a%20la%20red%20de%20difusión%20y%20afiliados%20del%20Blog%20tecnológico"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer"
                >
                  <MessageSquare size={16} />
                  <span>Contactar Red Editorial</span>
                </a>
              </div>
            </div>
          </motion.section>
        )}

        {activeTab === 'newsletter' && (
          <motion.section key="newsletter" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
            {/* Header & Filter Selector */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <button onClick={() => setActiveTab(null)} className="p-2.5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 hover:text-slate-950 transition-all shadow-sm cursor-pointer" title="Volver a Inicio">
                  <ChevronLeft size={18} />
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-600">
                      THE ATOMIC GAZETTE // #NEWSLETTER OFICIAL
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-slate-950 font-heading">
                    Edición Semanal & CTAs para Redes Sociales ✉️
                  </h2>
                </div>
              </div>

              {/* Subtabs Filter #NEWSLETTER */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shrink-0 self-start md:self-auto shadow-inner">
                {[
                  { id: 'todos', label: '🔥 Todo el #NEWSLETTER' },
                  { id: 'educacion', label: '🎓 Educación' },
                  { id: 'tecnologia', label: '⚡ Actualidad Tecnológica & Software' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setNewsletterFilter(f.id as any)}
                    className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold font-heading transition-all cursor-pointer whitespace-nowrap ${
                      newsletterFilter === f.id
                        ? 'bg-slate-950 text-white shadow-md scale-102'
                        : 'text-slate-600 hover:text-slate-950 hover:bg-white'
                    }`}
                  >
                    <span>{f.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Newsletter Gazette Stream */}
            <div className="space-y-10">

              {/* ── SECCIÓN 1: EDUCACIÓN (CON RECURSOS TOP EDUCATIVOS) ── */}
              {(newsletterFilter === 'todos' || newsletterFilter === 'educacion') && (
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <GraduationCap className="text-blue-600" size={20} />
                    <h3 className="text-xl sm:text-2xl font-black font-heading uppercase text-slate-950">
                      Sección Educación Continua // #NEWSLETTER
                    </h3>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* Item 1: Recursos Top Educativos */}
                    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm hover:border-blue-500/40 hover:shadow-xl transition-all flex flex-col justify-between text-left">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                            #NEWSLETTER // EDUCACIÓN
                          </span>
                          <span className="text-xs">🎓 100% GRATIS</span>
                        </div>
                        <h4 className="text-lg font-black text-slate-900 font-heading mb-2 leading-snug">
                          Cursos Gratuitos de MIT, Stanford y Harvard con Certificación
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed mb-4">
                          Acceso oficial a programas de élite mundial en Inteligencia Artificial, Ciencia de la Computación, Python, Finanzas y Liderazgo sin costo de matrícula para Ecuador.
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-100 mt-auto space-y-3">
                        {/* CTA Box for Social Media */}
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-700 font-mono leading-relaxed">
                          <p className="line-clamp-3">
                            🎓 ¿Quieres estudiar en MIT, Harvard o Stanford 100% GRATIS? En ATOMIC preparamos la lista maestra de programas oficiales con acceso abierto en IA, programación y finanzas. 🚀 Mira la guía completa aquí: https://atomiccotizador.shop/recursos 📲 ¿Dudas o necesitas soporte para inscribirte? Escríbenos directo a nuestro WhatsApp: https://wa.me/593969043453 #NEWSLETTER #EducacionGratis #ATOMIC
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <Link href="/recursos" className="py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-[10px] uppercase tracking-wider text-center transition-colors flex items-center justify-center">
                            Ver Cursos →
                          </Link>
                          <button
                            onClick={() => copyCtaText('nl-mit', '🎓 ¿Quieres estudiar en MIT, Harvard o Stanford 100% GRATIS? En ATOMIC preparamos la lista maestra de programas oficiales con acceso abierto en IA, programación y finanzas. 🚀 Mira la guía completa aquí: https://atomiccotizador.shop/recursos 📲 ¿Dudas o necesitas soporte para inscribirte? Escríbenos directo a nuestro WhatsApp: https://wa.me/593969043453 #NEWSLETTER #EducacionGratis #ATOMIC')}
                            className={`py-2.5 px-3 rounded-xl font-bold text-[10px] uppercase tracking-wider text-center transition-all flex items-center justify-center gap-1 border cursor-pointer ${
                              copiedCtaId === 'nl-mit'
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200'
                            }`}
                          >
                            {copiedCtaId === 'nl-mit' ? (
                              <>
                                <Check size={12} />
                                <span>¡Copiado!</span>
                              </>
                            ) : (
                              <>
                                <Copy size={12} />
                                <span>Copiar CTA</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Item 2: 9 Cursos YouTube */}
                    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm hover:border-blue-500/40 hover:shadow-xl transition-all flex flex-col justify-between text-left">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                            #NEWSLETTER // EDUCACIÓN
                          </span>
                          <span className="text-xs">📺 VIDEO MASTER</span>
                        </div>
                        <h4 className="text-lg font-black text-slate-900 font-heading mb-2 leading-snug">
                          9 Cursos Gratuitos de YouTube: Ventas de Alto Impacto & Liderazgo
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed mb-4">
                          Aprende prospección digital, negociación comercial y herramientas de IA aplicada organizadas en rutas de video listas para ejecutar hoy.
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-100 mt-auto space-y-3">
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-700 font-mono leading-relaxed">
                          <p className="line-clamp-3">
                            📺 Rutas de autoaprendizaje en video: Ventas de Alto Impacto, Liderazgo e Inteligencia Artificial 100% Gratis. 🚀 Mira los cursos aquí: https://atomiccotizador.shop/post-4 📲 Contacto oficial ATOMIC: https://wa.me/593969043453 #NEWSLETTER #CursosGratis #ATOMIC
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <Link href="/post-4" className="py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-[10px] uppercase tracking-wider text-center transition-colors flex items-center justify-center">
                            Ver Rutas →
                          </Link>
                          <button
                            onClick={() => copyCtaText('nl-yt', '📺 Rutas de autoaprendizaje en video: Ventas de Alto Impacto, Liderazgo e Inteligencia Artificial 100% Gratis. 🚀 Mira los cursos aquí: https://atomiccotizador.shop/post-4 📲 Contacto oficial ATOMIC: https://wa.me/593969043453 #NEWSLETTER #CursosGratis #ATOMIC')}
                            className={`py-2.5 px-3 rounded-xl font-bold text-[10px] uppercase tracking-wider text-center transition-all flex items-center justify-center gap-1 border cursor-pointer ${
                              copiedCtaId === 'nl-yt'
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200'
                            }`}
                          >
                            {copiedCtaId === 'nl-yt' ? (
                              <>
                                <Check size={12} />
                                <span>¡Copiado!</span>
                              </>
                            ) : (
                              <>
                                <Copy size={12} />
                                <span>Copiar CTA</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Item 3: Prompts IA */}
                    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm hover:border-blue-500/40 hover:shadow-xl transition-all flex flex-col justify-between text-left">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                            #NEWSLETTER // EDUCACIÓN & IA
                          </span>
                          <span className="text-xs">🎨 PROMPTS 8K</span>
                        </div>
                        <h4 className="text-lg font-black text-slate-900 font-heading mb-2 leading-snug">
                          Guía Maestra: 12 Prompts IA para Fotografía Hiperrealista
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed mb-4">
                          Copia fórmulas avanzadas de iluminación, texturas y ángulos cinematográficos estilo MrBeast con PDF oficial descargable.
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-100 mt-auto space-y-3">
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-700 font-mono leading-relaxed">
                          <p className="line-clamp-3">
                            🎨 Domina la fotografía con Inteligencia Artificial. 12 prompts hiperrealistas 8K con PDF oficial descargable. 🚀 Explora los prompts aquí: https://atomiccotizador.shop/prompts 📲 Soporte técnico vía WhatsApp: https://wa.me/593969043453 #NEWSLETTER #PromptsIA #ATOMIC
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <Link href="/prompts" className="py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-[10px] uppercase tracking-wider text-center transition-colors flex items-center justify-center">
                            Ver Prompts →
                          </Link>
                          <button
                            onClick={() => copyCtaText('nl-prompts', '🎨 Domina la fotografía con Inteligencia Artificial. 12 prompts hiperrealistas 8K con PDF oficial descargable. 🚀 Explora los prompts aquí: https://atomiccotizador.shop/prompts 📲 Soporte técnico vía WhatsApp: https://wa.me/593969043453 #NEWSLETTER #PromptsIA #ATOMIC')}
                            className={`py-2.5 px-3 rounded-xl font-bold text-[10px] uppercase tracking-wider text-center transition-all flex items-center justify-center gap-1 border cursor-pointer ${
                              copiedCtaId === 'nl-prompts'
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200'
                            }`}
                          >
                            {copiedCtaId === 'nl-prompts' ? (
                              <>
                                <Check size={12} />
                                <span>¡Copiado!</span>
                              </>
                            ) : (
                              <>
                                <Copy size={12} />
                                <span>Copiar CTA</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── SECCIÓN 2: ACTUALIDAD TECNOLÓGICA & SOFTWARE ── */}
              {(newsletterFilter === 'todos' || newsletterFilter === 'tecnologia') && (
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <Zap className="text-emerald-600" size={20} />
                    <h3 className="text-xl sm:text-2xl font-black font-heading uppercase text-slate-950">
                      Sección Actualidad Tecnológica & Software // #NEWSLETTER
                    </h3>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* Item 4: Bots de WhatsApp & Software SRI */}
                    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm hover:border-emerald-500/40 hover:shadow-xl transition-all flex flex-col justify-between text-left">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                            #NEWSLETTER // SOFTWARE & IA
                          </span>
                          <span className="text-xs">🤖 SRI 2026</span>
                        </div>
                        <h4 className="text-lg font-black text-slate-900 font-heading mb-2 leading-snug">
                          Bots Inteligentes de WhatsApp con Facturación Electrónica SRI
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed mb-4">
                          Agentes conversacionales que atienden 24/7, verifican stock en ERP y emiten comprobantes autorizados por el SRI en menos de 3 segundos.
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-100 mt-auto space-y-3">
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-700 font-mono leading-relaxed">
                          <p className="line-clamp-3">
                            ⚡ ¡Deja de perder clientes por tardar en responder! Nuestro Bot de Inteligencia Artificial para WhatsApp atiende consultas 24/7, cotiza y emite facturas electrónicas SRI en 3 segundos. 🚀 Mira la solución completa aquí: https://atomiccotizador.shop/web/software 📲 Agenda tu demo personalizada hoy en nuestro WhatsApp CRM: https://wa.me/593969043453 #NEWSLETTER #Automatizacion #SoftwareSRI #ATOMIC
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <Link href="/web/software" className="py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-[10px] uppercase tracking-wider text-center transition-colors flex items-center justify-center">
                            Ver Software →
                          </Link>
                          <button
                            onClick={() => copyCtaText('nl-software', '⚡ ¡Deja de perder clientes por tardar en responder! Nuestro Bot de Inteligencia Artificial para WhatsApp atiende consultas 24/7, cotiza y emite facturas electrónicas SRI en 3 segundos. 🚀 Mira la solución completa aquí: https://atomiccotizador.shop/web/software 📲 Agenda tu demo personalizada hoy en nuestro WhatsApp CRM: https://wa.me/593969043453 #NEWSLETTER #Automatizacion #SoftwareSRI #ATOMIC')}
                            className={`py-2.5 px-3 rounded-xl font-bold text-[10px] uppercase tracking-wider text-center transition-all flex items-center justify-center gap-1 border cursor-pointer ${
                              copiedCtaId === 'nl-software'
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
                            }`}
                          >
                            {copiedCtaId === 'nl-software' ? (
                              <>
                                <Check size={12} />
                                <span>¡Copiado!</span>
                              </>
                            ) : (
                              <>
                                <Copy size={12} />
                                <span>Copiar CTA</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Item 5: Cámara Doble Lente PIP */}
                    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm hover:border-cyan-500/40 hover:shadow-xl transition-all flex flex-col justify-between text-left">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-full">
                            #NEWSLETTER // DOMÓTICA RESIDENCIAL
                          </span>
                          <span className="text-xs">📹 DOBLE LENTE PIP</span>
                        </div>
                        <h4 className="text-lg font-black text-slate-900 font-heading mb-2 leading-snug">
                          Cámara Exterior Doble Lente PIP con Visión Nocturna Full-Color
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed mb-4">
                          Vigila tu hogar seguramente: 2 cámaras en 1 con monitoreo de parques, residencias y negocios. Resistente al agua IP66 desde $63.77 c/u.
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-100 mt-auto space-y-3">
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-700 font-mono leading-relaxed">
                          <p className="line-clamp-3">
                            📹 ¡Vigila tu hogar seguramente! Cámara exterior Doble Lente PIP con visión nocturna a todo color, sirena disuasoria y resistencia al agua IP66. 🚀 Ver detalles y promoción: https://atomiccotizador.shop/aurora-pro 📲 Cotiza con instalación profesional en WhatsApp: https://wa.me/593969043453 #NEWSLETTER #SeguridadResidencial #ATOMIC
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <Link href="/aurora-pro" className="py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-[10px] uppercase tracking-wider text-center transition-colors flex items-center justify-center">
                            Ver Cámara →
                          </Link>
                          <button
                            onClick={() => copyCtaText('nl-cam', '📹 ¡Vigila tu hogar seguramente! Cámara exterior Doble Lente PIP con visión nocturna a todo color, sirena disuasoria y resistencia al agua IP66. 🚀 Ver detalles y promoción: https://atomiccotizador.shop/aurora-pro 📲 Cotiza con instalación profesional en WhatsApp: https://wa.me/593969043453 #NEWSLETTER #SeguridadResidencial #ATOMIC')}
                            className={`py-2.5 px-3 rounded-xl font-bold text-[10px] uppercase tracking-wider text-center transition-all flex items-center justify-center gap-1 border cursor-pointer ${
                              copiedCtaId === 'nl-cam'
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : 'bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border-cyan-200'
                            }`}
                          >
                            {copiedCtaId === 'nl-cam' ? (
                              <>
                                <Check size={12} />
                                <span>¡Copiado!</span>
                              </>
                            ) : (
                              <>
                                <Copy size={12} />
                                <span>Copiar CTA</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Item 6: Generadores & Respaldo */}
                    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm hover:border-amber-500/40 hover:shadow-xl transition-all flex flex-col justify-between text-left">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
                            #NEWSLETTER // ENERGÍA
                          </span>
                          <span className="text-xs">⚡ ANTE APAGONES</span>
                        </div>
                        <h4 className="text-lg font-black text-slate-900 font-heading mb-2 leading-snug">
                          Generadores Inverter & Estaciones LiFePO4 para Respaldo Eléctrico
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed mb-4">
                          Soluciones silenciosas de onda senoidal pura para que tu hogar y routers nunca se apaguen durante cortes de energía programados.
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-100 mt-auto space-y-3">
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-700 font-mono leading-relaxed">
                          <p className="line-clamp-3">
                            ⚡ ¿Sin luz en casa o tu oficina? Protege tus equipos con generadores inverter y estaciones portátiles de energía Anker Solix. 🚀 Catálogo de energía disponible: https://atomiccotizador.shop/web/generadores 📲 Cotiza con despacho inmediato en WhatsApp: https://wa.me/593969043453 #NEWSLETTER #EnergiaEcuador #ATOMIC
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <Link href="/web/generadores" className="py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-[10px] uppercase tracking-wider text-center transition-colors flex items-center justify-center">
                            Ver Generadores →
                          </Link>
                          <button
                            onClick={() => copyCtaText('nl-gen', '⚡ ¿Sin luz en casa o tu oficina? Protege tus equipos con generadores inverter y estaciones portátiles de energía Anker Solix. 🚀 Catálogo de energía disponible: https://atomiccotizador.shop/web/generadores 📲 Cotiza con despacho inmediato en WhatsApp: https://wa.me/593969043453 #NEWSLETTER #EnergiaEcuador #ATOMIC')}
                            className={`py-2.5 px-3 rounded-xl font-bold text-[10px] uppercase tracking-wider text-center transition-all flex items-center justify-center gap-1 border cursor-pointer ${
                              copiedCtaId === 'nl-gen'
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200'
                            }`}
                          >
                            {copiedCtaId === 'nl-gen' ? (
                              <>
                                <Check size={12} />
                                <span>¡Copiado!</span>
                              </>
                            ) : (
                              <>
                                <Copy size={12} />
                                <span>Copiar CTA</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Suscripción Semanal */}
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 text-center max-w-2xl mx-auto shadow-inner">
                <p className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 font-heading">
                  Recibe la Gaceta #NEWSLETTER y nuevos lanzamientos cada semana
                </p>
                <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Ingresa tu correo electrónico..."
                    className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600"
                  />
                  <button
                    onClick={() => alert('¡Gracias por suscribirte a la Gaceta #NEWSLETTER de ATOMIC!')}
                    className="px-6 py-3 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer"
                  >
                    Suscribirme
                  </button>
                </div>
              </div>

            </div>
          </motion.section>
        )}

        {activeTab === 'landings' && (
          <motion.section key="landings" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex items-center gap-3 mb-8">
              <button onClick={() => setActiveTab(null)} className="p-2.5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-all shadow-sm">
                <ChevronLeft size={18} />
              </button>
              <h2 className="text-3xl font-black uppercase tracking-tight text-slate-950 font-heading">Landings de Productos Especializados 🚀</h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-4">
              {[
                { name: 'ZKTeco SenseFace 2A', href: '/senseface-2a', desc: 'Lectora Facial Biometría Visible Light 2A, Huella & RFID', icon: '🔐' },
                { name: 'EZVIZ H6c 2K / 4MP', href: '/h6c', desc: 'Cámara Panorámica 360° Wi-Fi con Detección IA', icon: '📹' },
                { name: 'Cámara Doble Lente PIP', href: '/aurora-pro', desc: 'Vigila tu hogar seguramente: Doble lente 360°, Full Color y resistencia al agua', icon: '📹' },
                { name: 'Cargadores Wallbox EV', href: '/web/cargadores-electricos', desc: 'Cargador Livoltek Mevo 7.3kW Tipo 2 para Autos Eléctricos', icon: '⚡' },
              ].map(l => (
                <Link key={l.href} href={l.href} className="p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-blue-400/50 hover:bg-blue-50/20 transition-all group block shadow-sm hover:shadow-xl text-left">
                  <div className="text-3xl mb-3">{l.icon}</div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1 font-heading">{l.name}</h3>
                  <p className="text-xs text-slate-600">{l.desc}</p>
                  <span className="mt-4 inline-block text-[10px] font-mono text-blue-600 uppercase font-black">Ver Landing →</span>
                </Link>
              ))}
            </div>
          </motion.section>
        )}

        {activeTab === 'especializacion' && (() => {
          const currentArea = selectedAreaId ? SPECIALIZED_AREAS.find(a => a.id === selectedAreaId) : null

          return (
            <motion.section key="especializacion" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
              {!currentArea ? (
                /* ─── VISTA 1: SELECTOR DE TODAS LAS ÁREAS ─── */
                <div>
                  <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-200">
                    <button
                      onClick={() => setActiveTab(null)}
                      className="p-2.5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 hover:text-slate-950 transition-all shadow-sm cursor-pointer"
                      title="Volver a Inicio"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-blue-600 block">
                        CAMPUS TECNOLÓGICO // 8 DIVISIONES ESPECIALIZADAS
                      </span>
                      <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-slate-950 font-heading">
                        Áreas de Especialización 🎓
                      </h2>
                    </div>
                  </div>

                  <p className="text-slate-600 text-sm mb-8 max-w-3xl leading-relaxed">
                    Selecciona cualquiera de nuestras divisiones para ver su <strong>página de introducción técnica</strong>, la selección editorial de <strong>productos tipo blog</strong> y el <strong>catálogo sobrio y profesional</strong> con disponibilidad inmediata en bodega.
                  </p>

                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {SPECIALIZED_AREAS.map((a) => (
                      <div
                        key={a.id}
                        onClick={() => setSelectedAreaId(a.id)}
                        className="group flex flex-col rounded-3xl bg-white border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-2xl hover:border-blue-500/50 transition-all duration-300 cursor-pointer text-left"
                      >
                        <div className="h-44 w-full overflow-hidden bg-slate-100 relative">
                          <img
                            src={a.heroImg}
                            alt={a.name}
                            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold font-mono text-slate-900 shadow-md flex items-center gap-1.5">
                            <span>{a.icon}</span>
                            <span>{a.shortName}</span>
                          </div>
                        </div>

                        <div className="p-5 flex flex-col flex-1">
                          <h3 className="text-base font-black text-slate-900 mb-2 font-heading group-hover:text-blue-600 transition-colors leading-snug">
                            {a.name}
                          </h3>
                          <p className="text-xs text-slate-600 leading-relaxed mb-4 flex-1">
                            {a.tagline}
                          </p>

                          <div className="pt-3 border-t border-slate-100 mt-auto flex items-center justify-between text-blue-600 text-xs font-bold font-heading group-hover:translate-x-1 transition-transform">
                            <span>Explorar Área & Soluciones</span>
                            <span>→</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* ─── VISTA 2: PÁGINA INTRO + BLOG + CATÁLOGO SOBRIO Y PROFESIONAL ─── */
                <div>
                  {/* Top Header Bar with Back & Area Switcher */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSelectedAreaId(null)}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 font-bold text-xs font-mono uppercase tracking-wider transition-all shadow-sm cursor-pointer"
                      >
                        <ChevronLeft size={16} />
                        <span>Volver a Todas las Áreas</span>
                      </button>
                    </div>

                    {/* Area Switcher Pills */}
                    <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide no-scrollbar py-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                      {SPECIALIZED_AREAS.map((a) => (
                        <button
                          key={a.id}
                          onClick={() => setSelectedAreaId(a.id)}
                          className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold font-heading transition-all cursor-pointer flex items-center gap-1 border ${
                            selectedAreaId === a.id
                              ? 'bg-slate-950 text-white border-slate-950 shadow-md scale-102'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <span>{a.icon}</span>
                          <span className="hidden sm:inline">{a.shortName}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* ════ 1. HERO & INTRO DE LA CATEGORÍA ════ */}
                  <div className="relative rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white p-6 sm:p-10 border border-slate-800 shadow-2xl overflow-hidden mb-12">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 max-w-4xl">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-mono font-bold tracking-widest uppercase mb-4">
                        <span>{currentArea.icon}</span>
                        <span>DIVISIÓN OFICIAL // {currentArea.name.toUpperCase()}</span>
                      </div>

                      <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black font-heading tracking-tight uppercase leading-tight mb-4 text-white">
                        {currentArea.intro.headline}
                      </h2>

                      <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
                        {currentArea.intro.description}
                      </p>

                      {/* 3 Technical Pillars */}
                      <div className="grid sm:grid-cols-3 gap-4 pt-6 border-t border-white/15">
                        {currentArea.intro.pillars.map((pil, idx) => (
                          <div key={idx} className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                            <span className="text-[10px] font-mono font-black text-blue-400 block mb-1">
                              PILAR 0{idx + 1}
                            </span>
                            <h4 className="font-bold text-white text-xs sm:text-sm mb-1 font-heading">
                              {pil.title}
                            </h4>
                            <p className="text-slate-400 text-xs leading-relaxed">
                              {pil.desc}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Showroom CTA */}
                      <div className="mt-8 flex flex-wrap items-center gap-3">
                        <Link
                          href={currentArea.showroomHref}
                          className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center gap-2"
                        >
                          <span>{currentArea.showroomLabel}</span>
                          <span>→</span>
                        </Link>
                        <a
                          href={`https://wa.me/593969043453?text=${encodeURIComponent(`Hola ATOMIC! Deseo asesoría técnica sobre la división de ${currentArea.name}.`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all border border-white/20 flex items-center gap-2 cursor-pointer"
                        >
                          <span>💬 Asesoría Técnica Especializada</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* ════ 2. SELECCIÓN DE PRODUCTOS TIPO BLOG (EDITORIAL SHOWCASE) ════ */}
                  <div className="mb-14">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-blue-600 block">
                          EDITORIAL SHOWCASE // {currentArea.shortName.toUpperCase()}
                        </span>
                        <h3 className="text-xl sm:text-3xl font-black uppercase tracking-tight text-slate-950 font-heading">
                          Selección de Productos Destacados (Blog)
                        </h3>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                      {currentArea.blogHighlights.map((post, idx) => (
                        <div
                          key={idx}
                          className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-3">
                              <span className="text-[10px] font-mono uppercase font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                                {post.tag}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400">
                                ⏱️ {post.readTime}
                              </span>
                            </div>

                            <h4 className="text-lg sm:text-xl font-black text-slate-900 mb-2 font-heading leading-snug">
                              {post.title}
                            </h4>

                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                              {post.summary}
                            </p>
                          </div>

                          {/* Embedded Featured Product Box */}
                          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 mt-auto">
                            <div className="relative w-24 h-24 bg-white rounded-xl overflow-hidden shrink-0 border border-slate-200 p-2 flex items-center justify-center">
                              <SafeImage src={post.featuredProduct.img} alt={post.featuredProduct.name} fill className="p-1 object-contain" />
                            </div>

                            <div className="flex-1 min-w-0 text-center sm:text-left">
                              <p className="font-heading font-black text-xs sm:text-sm text-slate-900 truncate">
                                {post.featuredProduct.name}
                              </p>
                              <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
                                {post.featuredProduct.specs}
                              </p>
                              <div className="flex items-baseline gap-2 mt-2 justify-center sm:justify-start">
                                <span className="text-base font-black text-slate-950 font-heading">
                                  {post.featuredProduct.price}
                                </span>
                                {post.featuredProduct.regularPrice && (
                                  <span className="text-[10px] font-mono text-slate-400 line-through">
                                    {post.featuredProduct.regularPrice}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex flex-col gap-1.5 shrink-0 w-full sm:w-auto">
                              <Link
                                href={post.featuredProduct.href}
                                className="px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-[10px] uppercase tracking-wider text-center transition-colors"
                              >
                                Ver Showroom
                              </Link>
                              <a
                                href={`https://wa.me/593969043453?text=${encodeURIComponent(`Hola ATOMIC! Deseo cotizar el producto del blog: ${post.featuredProduct.name}`)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] uppercase tracking-wider text-center transition-colors shadow-sm cursor-pointer"
                              >
                                Cotizar WA
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ════ 3. CATÁLOGO DE PRODUCTOS DE FORMA SOBRIA Y PROFESIONAL ════ */}
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200">
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 block">
                          STOCK DISPONIBLE // BODEGA CENTRAL ECUADOR
                        </span>
                        <h3 className="text-xl sm:text-3xl font-black uppercase tracking-tight text-slate-950 font-heading">
                          Catálogo de Productos {currentArea.name}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 font-mono">
                          Equipos con garantía 100% oficial, factura autorizada por el SRI y soporte directo.
                        </p>
                      </div>

                      <Link
                        href={currentArea.showroomHref}
                        className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs uppercase tracking-wider transition-colors border border-slate-200 shrink-0 self-start sm:self-auto"
                      >
                        Ver Showroom Completo →
                      </Link>
                    </div>

                    {/* SOBER & PROFESSIONAL PRODUCT GRID */}
                    {(() => {
                      const matched = (initialProducts || []).filter((p: any) => {
                        const text = `${p.name || ''} ${p.description || ''} ${p.category?.name || ''}`.toLowerCase()
                        return currentArea.catalogKeywords.some((kw: string) => text.includes(kw.toLowerCase()))
                      })

                      const productsToShow = matched.length > 0 ? matched.slice(0, 16) : []

                      if (productsToShow.length === 0) {
                        return (
                          <div className="p-10 rounded-3xl bg-white border border-dashed border-slate-300 text-center space-y-4">
                            <p className="text-slate-600 text-sm">
                              Los productos de <strong>{currentArea.name}</strong> se encuentran disponibles en nuestro showroom dedicado con fichas técnicas y cotizador interactivo.
                            </p>
                            <Link
                              href={currentArea.showroomHref}
                              className="inline-block px-6 py-3 rounded-full bg-slate-950 text-white font-bold text-xs uppercase tracking-wider hover:bg-slate-800 transition-all shadow-md"
                            >
                              Ingresar al Showroom de {currentArea.shortName} →
                            </Link>
                          </div>
                        )
                      }

                      return (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                          {productsToShow.map((p: any) => {
                            const imgs = safeParseArray(p.images)
                            const img = imgs[0] || ''
                            const price = calculateDiscountedPrice(p.price, userRole)
                            const categoryName = p.category?.name || currentArea.shortName

                            return (
                              <div
                                key={p.id}
                                className="group flex flex-col bg-white border border-slate-200/90 rounded-3xl overflow-hidden hover:border-slate-400 hover:shadow-xl transition-all duration-300 text-left"
                              >
                                <Link
                                  href={`/web/product/${p.id}`}
                                  className="relative aspect-square bg-slate-50 p-4 flex items-center justify-center overflow-hidden border-b border-slate-100"
                                >
                                  <SafeImage src={img} alt={p.name} fill className="p-3 group-hover:scale-105 transition-transform duration-300" />
                                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-slate-800 font-mono text-[9px] font-bold px-2 py-0.5 rounded-full border border-slate-200">
                                    EN BODEGA
                                  </div>
                                  <div className="absolute top-3 right-3 bg-slate-950 text-white font-black text-xs px-2.5 py-1 rounded-full shadow-md font-heading">
                                    ${price.toFixed(2)}
                                  </div>
                                </Link>

                                <div className="p-4 flex flex-col flex-1 gap-2">
                                  <span className="text-[10px] font-mono text-slate-400 uppercase truncate">
                                    {categoryName}
                                  </span>

                                  <Link
                                    href={`/web/product/${p.id}`}
                                    className="text-xs font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors font-heading"
                                  >
                                    {p.name}
                                  </Link>

                                  <p className="text-[10px] font-mono text-emerald-600 font-bold uppercase mt-auto">
                                    ✓ Factura con IVA • Garantía Directa
                                  </p>

                                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 mt-1">
                                    <Link
                                      href={`/web/product/${p.id}`}
                                      className="py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[10px] uppercase tracking-wider text-center transition-colors"
                                    >
                                      Ficha
                                    </Link>
                                    <a
                                      href={`https://wa.me/593969043453?text=${encodeURIComponent(`Hola ATOMIC! Deseo cotizar: ${p.name} ($${price.toFixed(2)})`)}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] uppercase tracking-wider text-center transition-colors shadow-sm cursor-pointer"
                                    >
                                      Cotizar WA
                                    </a>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )
                    })()}
                  </div>
                </div>
              )}
            </motion.section>
          )
        })()}

        {activeTab === 'nosotros' && (
          <motion.section key="nosotros" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="max-w-4xl mx-auto px-6 py-12">
            <div className="flex items-center gap-3 mb-8">
              <button onClick={() => setActiveTab(null)} className="p-2.5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-all shadow-sm">
                <ChevronLeft size={18} />
              </button>
              <h2 className="text-3xl font-black uppercase tracking-tight text-slate-950 font-heading">Sobre Nosotros</h2>
            </div>
            <div className="space-y-6">
              <p className="text-slate-700 text-sm leading-relaxed"><strong className="text-slate-950">ATOMIC INDUSTRIAS</strong> es una empresa ecuatoriana especializada en electrónica, tecnología y productos para el hogar. Ofrecemos los mejores precios con garantía 100% original, envíos seguros a todo Ecuador y asesoría técnica instantánea vía WhatsApp.</p>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { stat: '100%', label: 'Productos Originales' },
                  { stat: '24/7', label: 'Soporte Técnico' },
                  { stat: 'EC', label: 'Cobertura Nacional' },
                ].map(s => (
                  <div key={s.stat} className="p-6 rounded-3xl bg-white border border-slate-200/90 text-center shadow-sm">
                    <p className="text-4xl font-black text-slate-900 font-heading">{s.stat}</p>
                    <p className="text-[11px] font-mono text-slate-500 uppercase tracking-widest mt-2">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {activeTab === 'contacto' && (
          <motion.section key="contacto" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="max-w-4xl mx-auto px-6 py-12">
            <div className="flex items-center gap-3 mb-8">
              <button onClick={() => setActiveTab(null)} className="p-2.5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-all shadow-sm">
                <ChevronLeft size={18} />
              </button>
              <h2 className="text-3xl font-black uppercase tracking-tight text-slate-950 font-heading">Contacto & Matriz Comercial</h2>
            </div>

            {/* Sketch / Informative Card of El Labrador */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm mb-6 space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-bold">
                  📍
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 uppercase font-heading">Oficinas y Showroom El Labrador</h4>
                  <p className="text-xs text-slate-500">Av. Galo Plaza Lasso y El Labrador, Quito, Ecuador</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 text-xs text-slate-700">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <p className="font-bold text-slate-900">🕒 Horario de Atención:</p>
                  <p>Lunes a Viernes: 08:30 - 18:30</p>
                  <p>Sábados: 09:00 - 15:00</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <p className="font-bold text-slate-900">📞 Canales Oficiales:</p>
                  <p>WhatsApp: +593 96 904 3453</p>
                  <p>Instagram: @atomic.ec | Web: atomiccotizador.shop</p>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <a href="https://wa.me/593969043453?text=Hola%20ATOMIC!" target="_blank" rel="noreferrer" className="flex items-center gap-4 p-6 rounded-3xl bg-white border border-emerald-500/40 hover:bg-emerald-50/20 transition-all group shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold text-base">WA</div>
                <div>
                  <p className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors font-heading">WhatsApp Directo</p>
                  <p className="text-xs text-slate-600">Asesoría comercial y técnica instantánea</p>
                </div>
              </a>
              <div className="flex items-center gap-4 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-800 font-bold text-base">EC</div>
                <div>
                  <p className="text-sm font-bold text-slate-900 font-heading">Ecuador Nacional</p>
                  <p className="text-xs text-slate-600">Despachos seguros a las 24 provincias</p>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {activeTab === 'resenas' && (
          <motion.section key="resenas" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex items-center gap-3 mb-8">
              <button onClick={() => setActiveTab(null)} className="p-2.5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-all shadow-sm">
                <ChevronLeft size={18} />
              </button>
              <h2 className="text-3xl font-black uppercase tracking-tight text-slate-950 font-heading">Reseñas de Clientes Verificados</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {[
                { name: 'Carlos M.', rating: 5, text: 'Excelente servicio, el producto llegó rápido y en perfectas condiciones. 100% recomendado.' },
                { name: 'Andrea L.', rating: 5, text: 'La asesoría por WhatsApp fue increíble, me ayudaron a elegir el mejor biométrico para mi empresa.' },
                { name: 'Roberto V.', rating: 5, text: 'Compré una cámara EZVIZ H6c y funciona perfectamente. La calidad 2K es impresionante.' },
                { name: 'María F.', rating: 5, text: 'Productos originales con garantía, los precios son los mejores de todo Ecuador.' },
                { name: 'Jorge P.', rating: 5, text: 'El biométrico ZKTeco SenseFace 2A funciona perfecto en nuestras instalaciones. Muy buen equipo ATOMIC.' },
                { name: 'Lucía G.', rating: 5, text: 'Atención al cliente excepcional. Resolvieron todas mis dudas antes de la compra.' },
              ].map(r => (
                <div key={r.name} className="p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-blue-400/40 transition-all shadow-sm hover:shadow-md">
                  <div className="flex items-center gap-1 mb-3">{Array.from({length: r.rating}).map((_,i) => <Star key={i} size={14} className="text-amber-500 fill-amber-500" />)}</div>
                  <p className="text-sm text-slate-700 italic mb-3">"{r.text}"</p>
                  <p className="text-xs font-bold text-slate-900 font-heading">{r.name}</p>
                  <p className="text-[10px] font-mono text-emerald-600 font-bold">Cliente Verificado ATOMIC ✓</p>
                </div>
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ═══════════ HERO SECTION (LUXURY WHITE WITH ELECTRIC BLUE NEON ORBITS) ═══════════ */}
      <section className="pt-16 pb-16 flex flex-col items-center justify-center text-center px-6 relative overflow-hidden bg-[#FAFAFC]">
        {/* Soft Ambient Glows on White */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-blue-500/10 via-cyan-500/5 to-transparent rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto">
          
          {/* Style Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center justify-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-800 mb-6 shadow-sm mx-auto"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)] shrink-0" />
            <span className="font-heading uppercase tracking-wider text-[11px] text-slate-700">Tecnología, Electrónica & Hogar Inteligente</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)] shrink-0" />
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="mb-4 flex flex-col items-center">
            <AtomLogo />
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tight leading-none mb-4 font-heading text-[#0A0A0C]">
            ATOMIC
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-xs sm:text-sm font-bold tracking-[0.25em] uppercase text-[#1E293B] mb-8 font-heading">
            ELECTRÓNICA, TECNOLOGÍA Y HOGAR
          </motion.p>

          {/* SEARCH BAR (PILL INPUT & LIVE FLOATING DROPDOWN) */}
          <motion.div 
            ref={searchContainerRef}
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.3 }} 
            className="w-full max-w-2xl mx-auto mb-10 relative group z-40"
          >
            <div className="relative">
              {isSearching ? (
                <div className="absolute left-5 top-1/2 -translate-y-1/2 z-10">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-slate-900 transition-colors z-10" size={18} />
              )}
              <input
                type="text"
                value={searchQuery}
                onFocus={() => {
                  if (searchQuery.trim() && liveMatches.length > 0) setShowLiveDropdown(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    setShowLiveDropdown(false);
                    const shortcut = getCategoryShortcut(searchQuery);
                    if (shortcut) {
                      window.location.href = shortcut.href;
                      return;
                    }
                    document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' });
                  } else if (e.key === 'Escape') {
                    setShowLiveDropdown(false);
                  }
                }}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setActiveMainCategoryId(null);
                  setActiveSubcategoryId(null);
                }}
                placeholder="Buscar producto, marca, categoría (ej. SenseFace, Encimera, PS5)..."
                className="w-full bg-white border border-slate-300 rounded-full py-4 pl-14 pr-12 text-xs font-bold uppercase tracking-wider text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:shadow-[0_0_25px_rgba(37,99,235,0.25)] transition-all outline-none shadow-lg"
              />
              {searchQuery && (
                <button 
                  onClick={() => {
                    setSearchQuery("");
                    setShowLiveDropdown(false);
                  }} 
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors z-10"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* LIVE FLOATING DROPDOWN WINDOW */}
            <AnimatePresence>
              {showLiveDropdown && searchQuery.trim() && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white/98 backdrop-blur-2xl border border-slate-200 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden z-50 text-left divide-y divide-slate-100"
                >
                  {/* Dropdown Header */}
                  <div className="px-5 py-3 bg-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                      <span className="text-[11px] font-heading font-black uppercase tracking-wider text-blue-700">
                        Resultados en vivo ({liveMatches.length})
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-500">
                      Presiona <kbd className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-900 font-mono text-[9px] border border-slate-300">ENTER ↵</kbd> para ver todos
                    </span>
                  </div>

                  {/* Matches List */}
                  <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
                    {(() => {
                      const shortcut = getCategoryShortcut(searchQuery);
                      if (!shortcut) return null;
                      return (
                        <Link
                          href={shortcut.href}
                          className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-blue-500/15 via-indigo-500/10 to-transparent border border-blue-400/30 hover:border-blue-500 hover:bg-blue-500/20 transition-all group/sc mb-2"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{shortcut.icon}</span>
                            <div>
                              <p className="text-xs font-black uppercase text-slate-950 font-heading group-hover/sc:text-blue-700">
                                Viñeta Oficial: {shortcut.name}
                              </p>
                              <p className="text-[10px] text-slate-600 font-mono">
                                {shortcut.subtitle}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs font-black text-blue-700 font-mono px-2.5 py-1 rounded-full bg-blue-100 border border-blue-300 shrink-0">
                            Abrir Showroom →
                          </span>
                        </Link>
                      );
                    })()}
                    {liveMatches.length === 0 ? (
                      <div className="py-8 text-center text-xs font-mono text-slate-500">
                        {isSearching ? 'Buscando en tiempo real...' : 'No se encontraron productos coincidentes.'}
                      </div>
                    ) : (
                      liveMatches.map((item: any) => {
                        const parsedImg = safeParseArray(item.images, [''])[0] || '';
                        return (
                          <a
                            key={item.id}
                            href={`/web/product/${item.id}`}
                            className="flex items-center gap-3.5 p-2.5 rounded-2xl hover:bg-slate-50 transition-all group/item cursor-pointer"
                          >
                            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                              {parsedImg ? (
                                <SafeImage src={parsedImg} alt={item.name} className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-300" />
                              ) : (
                                <Package size={20} className="text-slate-400" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-bold text-slate-900 group-hover/item:text-blue-600 transition-colors truncate">
                                {item.name}
                              </h4>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] font-mono uppercase text-slate-500 truncate">
                                  {item.category?.name || item.provider || 'Atomic'}
                                </span>
                                {item.stock > 0 && (
                                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono font-bold">
                                    Stock: {item.stock}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-xs font-black font-mono text-blue-600 block">
                                ${Number(item.price || 0).toFixed(2)}
                              </span>
                              <span className="text-[10px] text-slate-400 group-hover/item:text-slate-900 flex items-center gap-1 justify-end font-bold">
                                Ver <ChevronRight size={10} />
                              </span>
                            </div>
                          </a>
                        );
                      })
                    )}
                  </div>

                  {/* Dropdown Footer CTA */}
                  <div className="p-2.5 bg-slate-50">
                    <button
                      onClick={() => {
                        setShowLiveDropdown(false);
                        document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="w-full py-2.5 px-4 rounded-2xl bg-slate-950 hover:bg-slate-800 text-white font-heading font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                    >
                      <Search size={14} />
                      <span>Ver todos los resultados en el catálogo</span>
                      <span className="text-[10px] opacity-75 font-mono">(ENTER ↵)</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ═══════════ PREVIEW / INTRODUCCIÓN SECTION TITLE ═══════════ */}
          <div className="text-center max-w-3xl mx-auto mt-4 mb-2">
            <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-800 mb-2 shadow-sm mx-auto">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span className="font-heading uppercase tracking-wider text-[11px] text-slate-700">PREVIEW / INTRODUCCIÓN</span>
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            </div>
          </div>

          {/* ═══════════ MINI RECUADROS OPACOS (FILTROS BLANCO/SLATE) ═══════════ */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto mb-6 px-4">
            {[
              { id: 'ofertas', label: 'OFERTAS' },
              { id: 'promociones', label: 'PROMOCIONES' },
              { id: 'temporada', label: 'POR TEMPORADA' },
              { id: 'combos', label: 'COMBOS' },
              { id: 'instalacion', label: 'CON INSTALACIÓN' },
              { id: 'servicios', label: 'SERVICIOS' },
            ].map((item) => {
              const isSelected = coverflowSection === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setCoverflowSection(item.id as any)}
                  className={`px-4 py-2 rounded-2xl border text-[11px] font-extrabold font-heading uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-sm flex items-center gap-2 ${
                    isSelected
                      ? 'bg-slate-950 text-white border-slate-950 shadow-md scale-105'
                      : 'bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-950 border-slate-300'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-blue-600'}`} />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </div>

          {/* ═══════════ 3D COVERFLOW GALLERY SHOWCASE ═══════════ */}
          <div className="w-full max-w-5xl mx-auto my-4 overflow-hidden min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={coverflowSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="w-full"
              >
                {coverflowSection === 'ofertas' && (
                  <CoverflowGallery slides={OFERTAS_COVERFLOW_SLIDES} autoplay={true} cardWidth={460} cardHeight={460} gap={8} tilt={12} sideTilt={8} opacity={60} radius={20} />
                )}
                {coverflowSection === 'promociones' && (
                  <CoverflowGallery slides={PROMO_COVERFLOW_SLIDES} autoplay={true} cardWidth={460} cardHeight={460} gap={8} tilt={12} sideTilt={8} opacity={60} radius={20} />
                )}
                {coverflowSection === 'temporada' && (
                  <CoverflowGallery slides={TEMPORADA_COVERFLOW_SLIDES} autoplay={true} cardWidth={460} cardHeight={460} gap={8} tilt={12} sideTilt={8} opacity={60} radius={20} />
                )}
                {coverflowSection === 'combos' && (
                  <CoverflowGallery slides={COMBOS_COVERFLOW_SLIDES} autoplay={true} cardWidth={460} cardHeight={460} gap={8} tilt={12} sideTilt={8} opacity={60} radius={20} />
                )}
                {coverflowSection === 'instalacion' && (
                  <CoverflowGallery slides={INSTALACION_COVERFLOW_SLIDES} autoplay={true} cardWidth={460} cardHeight={460} gap={8} tilt={12} sideTilt={8} opacity={60} radius={20} />
                )}
                {coverflowSection === 'servicios' && (
                  <CoverflowGallery slides={SERVICIOS_COVERFLOW_SLIDES} autoplay={true} cardWidth={460} cardHeight={460} gap={8} tilt={12} sideTilt={8} opacity={60} radius={20} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ═══════════ OFERTAS SECTION HEADER ═══════════ */}
          <div className="text-center max-w-3xl mx-auto mt-10 mb-8">
            <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-800 mb-3 shadow-sm mx-auto">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span className="font-heading uppercase tracking-wider text-[11px] text-slate-700">OFERTAS POR CATEGORÍA</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-slate-950 font-heading mb-2">
              OFERTAS
            </h2>
          </div>

          {/* QUICK CATEGORY HUB BUTTONS */}
          <div className="flex flex-wrap items-center justify-center gap-3 max-w-4xl mx-auto mb-16">
            <Link
              href="/web/camaras-hogar"
              className="px-5 py-3 rounded-full bg-white border border-amber-400 hover:border-amber-500 hover:bg-amber-50/40 text-xs font-bold text-slate-800 transition-all flex items-center gap-2 shadow-sm group"
            >
              <span className="font-heading uppercase tracking-wider text-[11px] text-amber-800">CÁMARAS HOGAR 4K</span>
              <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-300 font-mono font-bold">2 AÑOS</span>
            </Link>

            <Link
              href="/web/mandos"
              className="px-5 py-3 rounded-full bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 text-xs font-bold text-slate-800 transition-all flex items-center gap-2 shadow-sm group"
            >
              <span className="font-heading uppercase tracking-wider text-[11px]">MANDOS & CONSOLAS</span>
              <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200 font-mono font-bold">NUEVO</span>
            </Link>

            <Link
              href="/web/paneles-ranurados"
              className="px-5 py-3 rounded-full bg-white border border-slate-200 hover:border-yellow-500 hover:bg-yellow-50/40 text-xs font-bold text-slate-800 transition-all flex items-center gap-2 shadow-sm group"
            >
              <span className="font-heading uppercase tracking-wider text-[11px]">ACABADOS TIPO MÁRMOL</span>
              <span className="text-[10px] bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full border border-yellow-300 font-mono font-bold">$27.00</span>
            </Link>

            <Link
              href="/web/cocinas"
              className="px-5 py-3 rounded-full bg-white border border-slate-200 hover:border-amber-400 hover:bg-amber-50/40 text-xs font-bold text-slate-800 transition-all flex items-center gap-2 shadow-sm group"
            >
              <span className="font-heading uppercase tracking-wider text-[11px]">ENCIMERAS & HORNOS</span>
              <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-300 font-mono font-bold">LÍNEA HOGAR</span>
            </Link>

            <Link
              href="/web/laptops"
              className="px-5 py-3 rounded-full bg-white border border-slate-200 hover:border-purple-400 hover:bg-purple-50/40 text-xs font-bold text-slate-800 transition-all flex items-center gap-2 shadow-sm group"
            >
              <span className="font-heading uppercase tracking-wider text-[11px]">LAPTOPS & CPUS</span>
              <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full border border-purple-200 font-mono font-bold">PORTÁTILES & PCS</span>
            </Link>

            <Link
              href="/web/phones"
              className="px-5 py-3 rounded-full bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 text-xs font-bold text-slate-800 transition-all flex items-center gap-2 shadow-sm group"
            >
              <span className="font-heading uppercase tracking-wider text-[11px]">CELULARES & TABLETS</span>
            </Link>

            <Link
              href="/web/blogs/guia-maquinas-de-bloques"
              className="px-5 py-3 rounded-full bg-white border border-slate-200 hover:border-orange-400 hover:bg-orange-50/40 text-xs font-bold text-slate-800 transition-all flex items-center gap-2 shadow-sm group"
            >
              <span className="font-heading uppercase tracking-wider text-[11px]">PLANTAS DE BLOQUES</span>
              <span className="text-[10px] bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full border border-orange-300 font-mono font-bold">INDUSTRIAL</span>
            </Link>
          </div>

        </div>
      </section>

      {/* ═══════════ RELOCATED: FUTURISTIC PARALLAX BANNER (RIGHT AFTER OFERTAS, BEFORE CATEGORIAS) ═══════════ */}
      <FuturisticParallaxSection />

      {/* ═══════════ CATEGORÍAS — LARGE PRO CARDS WITH DEEP DARK SHADOW BACKDROP ═══════════ */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-16 scroll-mt-24 relative" id="categorias-seccion">
        
        {/* Deep ambient dark shadow backdrop behind the category zone */}
        <div className="rounded-[40px] bg-gradient-to-b from-[#060813] via-[#090d1c] to-[#04060f] p-6 sm:p-12 border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.8)] relative overflow-hidden">
          
          {/* Subtle background glow */}
          <div className="absolute top-0 inset-x-0 h-96 bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.18),_transparent_70%)] pointer-events-none" />

          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-14 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/15 border border-blue-400/30 text-xs font-bold text-blue-300 mb-4 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span className="font-heading uppercase tracking-wider text-[11px] font-mono">Divisiones Especializadas Oficiales</span>
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white font-heading mb-3">
              CATEGORÍAS DE ESPECIALIZACIÓN
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Nuestras 8 divisiones principales en tecnología residencial, electrónica mayorista, línea de hogar, computación y automatización pesada con respaldo y garantía directa.
            </p>
          </div>

          {/* 8 CATEGORY CARDS GRID — 2 COLUMNS, EXPANDED & PROMINENT */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 relative z-10">
            {[
              {
                id: 'cat-residencial',
                title: 'TECNOLOGÍA RESIDENCIAL',
                subtitle: 'DOMÓTICA & SEGURIDAD SMART',
                description: 'Cámaras IP con audio bidireccional, reconocimiento facial 3D, porteros inteligentes y cerraduras biométricas con control centralizado.',
                image: '/images/categories/tecnologia-residencial.jpg',
                badge: 'SEGURIDAD SMART',
                query: 'camara',
              },
              {
                id: 'cat-electronica',
                title: 'ELECTRÓNICA & GADGETS',
                subtitle: 'AUDIO, PERIFÉRICOS & COMPONENTES',
                description: 'Equipos de audio de alta fidelidad, iluminación inteligente, periféricos para creadores y componentes electrónicos al por mayor.',
                image: '/images/categories/electronica.jpg',
                badge: 'AUDIO & GADGETS',
                query: 'electronica',
              },
              {
                id: 'cat-marmol',
                title: 'ACABADOS TIPO MÁRMOL & WPC',
                subtitle: 'PLANCHAS PVC & PANELES RANURADOS',
                description: 'Planchas arquitectónicas efecto mármol Calacatta, Negro Marquina y Blanco Carrara desde $27.00, y paneles ranurados WPC de 2.90m a $9.09 para muros de TV.',
                image: '/images/paneles-wpc/plancha-pvc-marmol-calacatta-sala.jpg',
                badge: 'REMODELACIÓN',
                query: 'marmol',
                href: '/web/paneles-ranurados',
              },
              {
                id: 'cat-hogar',
                title: 'LÍNEA HOGAR & COCINA',
                subtitle: 'COCINA PREMIUM & CONFORT',
                description: 'Encimeras a gas y de inducción, hornos empotrables de acero inoxidable y campanas extractoras con filtros de carbón activado.',
                image: '/images/categories/hogar.jpg',
                badge: 'LÍNEA HOGAR',
                query: 'cocina',
                href: '/web/cocinas',
              },
              {
                id: 'cat-industria',
                title: 'INDUSTRIA & CONCRETO',
                subtitle: 'MAQUINARIA & PLANTAS DE BLOQUES',
                description: 'Plantas automáticas de bloques de hormigón, mezcladoras de concreto reforzado y sistemas de automatización industrial.',
                image: '/images/categories/industria.jpg',
                badge: 'INDUSTRIAL',
                query: 'bloque',
                href: '/web/blogs/guia-maquinas-de-bloques',
              },
              {
                id: 'cat-entretenimiento',
                title: 'GAMING & ENTRETENIMIENTO',
                subtitle: 'CONSOLAS, MANDOS & ACCESORIOS',
                description: 'Mandos DualSense inalámbricos para PS5, consolas PlayStation 4, PlayStation Portal, Nintendo Switch y accesorios gamer.',
                image: '/images/categories/entretenimiento.jpg',
                badge: 'GAMING OFICIAL',
                query: 'mando',
                href: '/web/mandos',
              },
              {
                id: 'cat-computacion',
                title: 'COMPUTACIÓN & LAPTOPS',
                subtitle: 'LAPTOPS, PCS & PROCESADORES',
                description: 'Portátiles corporativas y gamer, estaciones de trabajo All-in-One Dell, CPUs de alto rendimiento y almacenamiento SSD ultrarrápido.',
                image: '/images/categories/computacion.jpg',
                badge: 'HARDWARE PRO',
                query: 'laptop',
                href: '/web/laptops',
              },
              {
                id: 'cat-telefonia',
                title: 'TELEFONÍA & MÓVILES',
                subtitle: 'SMARTPHONES, TABLETS & REDES',
                description: 'Dispositivos móviles de última generación, tablets para productividad, accesorios de carga rápida y conectividad garantizada.',
                image: '/images/categories/telefonia.jpg',
                badge: 'MÓVIL & CONECTIVIDAD',
                query: 'telefono',
                href: '/web/phones',
              },
              {
                id: 'cat-software',
                title: 'SOFTWARE & AUTOMATIZACIÓN',
                subtitle: 'ERP, CRM & DESARROLLO A MEDIDA',
                description: 'Sistemas de facturación electrónica SRI, cotizadores automáticos, plataformas ERP para empresas e integración hardware-software.',
                image: '/images/categories/software-servicios.jpg',
                badge: 'SOFTWARE & CLOUD',
                query: 'software',
              },
            ].map((c: any) => (
              <div
                key={c.id}
                className="relative flex flex-col sm:flex-row items-center bg-white border border-slate-200/90 hover:border-blue-400 rounded-3xl p-7 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.35)] hover:shadow-[0_25px_65px_rgba(59,130,246,0.3)] transition-all duration-300 group"
              >
                {/* Large Floating offset image */}
                <div className="relative shrink-0 w-full sm:w-56 h-56 sm:h-60 -mt-8 sm:mt-0 sm:-ml-12 rounded-2xl overflow-hidden shadow-2xl border border-slate-300 bg-slate-100">
                  <img
                    src={c.image}
                    alt={c.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/85 backdrop-blur-md border border-white/20 text-[10px] font-mono font-bold text-white uppercase tracking-wider shadow">
                    {c.badge}
                  </div>
                </div>

                {/* Expanded Card content */}
                <div className="flex flex-col pt-6 sm:pt-0 sm:pl-7 text-center sm:text-left flex-grow">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-950 font-heading tracking-tight leading-tight group-hover:text-blue-600 transition-colors uppercase">
                    {c.title}
                  </h3>
                  <p className="text-xs font-bold text-blue-600 mt-1 mb-2 font-mono tracking-wider uppercase">
                    {c.subtitle}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 line-clamp-3">
                    {c.description}
                  </p>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mt-auto">
                    {c.id === 'cat-residencial' ? (
                      <Link
                        href="/web/cerraduras-smart"
                        className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-black font-heading transition-all shadow-md hover:scale-105 flex items-center gap-1.5"
                      >
                        <Wrench size={13} />
                        <span>Kits + Instalación</span>
                      </Link>
                    ) : c.href ? (
                      <Link
                        href={c.href}
                        className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold font-heading transition-all shadow-md hover:scale-105 flex items-center gap-1.5"
                      >
                        <span>Ver Catálogo</span>
                        <span>→</span>
                      </Link>
                    ) : (
                      <button
                        onClick={() => {
                          setSearchQuery(c.query);
                          document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold font-heading transition-all shadow-md hover:scale-105 cursor-pointer"
                      >
                        Ver Catálogo
                      </button>
                    )}
                    <a
                      href={`https://wa.me/593969043453?text=${encodeURIComponent(`Hola ATOMIC! Deseo información y cotización sobre la categoría: ${c.title}`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black font-heading transition-all shadow-md hover:scale-105"
                    >
                      💬 WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* ═══════════ MAIN FEATURED PROMO BANNERS (APPIT BENTO STYLE) ═══════════ */}
      {!searchQuery && !activeMainCategoryId && (
        <section className="py-12 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Promo Card 1: Mandos Gaming */}
            <div className="relative rounded-3xl overflow-hidden border border-slate-200/90 bg-white p-8 shadow-[0_15px_35px_rgba(0,0,0,0.06)] hover:shadow-xl hover:border-blue-400/50 flex flex-col justify-between group transition-all">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-blue-700 font-mono text-[10px] font-bold uppercase tracking-widest mb-4">
                  🎮 SECCIÓN DESTACADA GAMING
                </div>
                <h3 className="text-3xl font-black uppercase text-slate-950 mb-2 leading-tight font-heading">
                  Mandos DualSense & Consolas
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed max-w-md mb-6">
                  Descubre mandos originales para PS5, PS4, Xbox Series X|S, Nintendo Switch y la nueva PlayStation Portal Remote Player con fotos HD y especificaciones.
                </p>
              </div>
              <Link
                href="/web/mandos"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-slate-950 text-white hover:bg-blue-600 rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-md w-fit"
              >
                <span>Explorar Mandos & Consolas</span>
                <span>→</span>
              </Link>
            </div>

            {/* Promo Card 2: Cocina & Encimeras */}
            <div className="relative rounded-3xl overflow-hidden border border-slate-200/90 bg-white p-8 shadow-[0_15px_35px_rgba(0,0,0,0.06)] hover:shadow-xl hover:border-amber-400/50 flex flex-col justify-between group transition-all">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] pointer-events-none" />
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-amber-700 font-mono text-[10px] font-bold uppercase tracking-widest mb-4">
                  🍳 LÍNEA PREMIUM DE COCINA
                </div>
                <h3 className="text-3xl font-black uppercase text-slate-950 mb-2 leading-tight font-heading">
                  Encimeras a Gas & Hornos
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed max-w-md mb-6">
                  Filtra por dimensiones en centímetros, número de hornillas y tipo de combustible. Promociones especiales y combos para armar tu cocina.
                </p>
              </div>
              <Link
                href="/web/cocinas"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-slate-950 text-white hover:bg-amber-600 rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-md w-fit"
              >
                <span>Ver Catálogo de Cocinas</span>
                <span>→</span>
              </Link>
            </div>

          </div>
        </section>
      )}

      {/* ═══════════ PRODUCT GRID & FILTERS (APPIT BENTO CARDS) ═══════════ */}
      <section className="w-full max-w-7xl mx-auto px-6 py-8 scroll-mt-32" id="productos">
        
        {/* SECTION TITLE & FILTER RESULTS COUNTER */}
        <div className="flex flex-col gap-4 mb-6 pb-4 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-950 font-heading">
                Catálogo General de Productos
              </h2>
              <p className="text-slate-500 text-xs font-mono mt-0.5">
                {displayedProducts.length} productos disponibles en esta sección
              </p>
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-xs text-slate-700 hover:text-slate-950 font-bold uppercase tracking-wider flex items-center gap-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3 py-1.5 rounded-full cursor-pointer w-fit"
              >
                <span>✕ Limpiar Búsqueda</span>
              </button>
            )}
          </div>

          {/* SUBDIVISION PILLS BAR (DESAGRUPACIÓN DE CATÁLOGO) */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide no-scrollbar py-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {CATALOG_SUBDIVISIONS.map(sub => {
              const isSelected = catalogSubdivision === sub.id
              return (
                <button
                  key={sub.id}
                  onClick={() => setCatalogSubdivision(sub.id)}
                  className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold font-heading transition-all flex items-center gap-1.5 border cursor-pointer ${
                    isSelected
                      ? "bg-slate-950 text-white border-slate-950 shadow-md scale-102"
                      : "bg-white hover:bg-slate-100 text-slate-700 border-slate-200/90 hover:text-slate-950"
                  }`}
                >
                  <span>{sub.icon}</span>
                  <span>{sub.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* LOADING & GRID RENDER */}
        {isLoadingCategory ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-slate-500 text-xs font-mono uppercase tracking-widest">Cargando catálogo...</p>
          </div>
        ) : displayedProducts.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-slate-300 rounded-3xl p-8 bg-white shadow-sm">
            <p className="text-slate-500 text-xs font-mono uppercase tracking-widest mb-4">No se encontraron productos con esos criterios</p>
            <button
              onClick={() => { setSearchQuery(""); setActiveMainCategoryId(null); setActiveSubcategoryId(null); setCatalogSubdivision("todos"); }}
              className="px-6 py-3 bg-slate-950 text-white font-bold text-xs uppercase tracking-wider rounded-full hover:bg-blue-600 transition-colors shadow-sm cursor-pointer"
            >
              Ver Todo el Catálogo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {displayedProducts.slice(0, 80).map((p: any) => {
              const imgs = safeParseArray(p.images);
              const img = imgs[0] || '';
              const price = calculateDiscountedPrice(p.price, userRole);
              const categoryName = p.category?.name || 'General';

              return (
                <div key={p.id} className="group flex flex-col bg-white border border-slate-200/90 rounded-3xl overflow-hidden hover:border-blue-400/50 hover:shadow-[0_20px_45px_rgba(0,0,0,0.08)] transition-all duration-300">
                  <Link href={`/web/product/${p.id}`} className="relative aspect-square bg-slate-50 p-4 flex items-center justify-center overflow-hidden">
                    <SafeImage src={img} alt={p.name} fill className="p-3 group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute top-3 right-3 bg-slate-950 text-white font-black text-xs px-3 py-1 rounded-full shadow-md font-heading">
                      ${price.toFixed(2)}
                    </div>
                  </Link>
                  <div className="p-5 flex flex-col gap-2 flex-grow">
                    <span className="text-[10px] font-mono text-slate-500 uppercase truncate">
                      {categoryName}
                    </span>
                    <Link href={`/web/product/${p.id}`} className="text-xs font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors font-heading">
                      {p.name}
                    </Link>
                    <a
                      href={`https://wa.me/593969043453?text=${encodeURIComponent(`Hola ATOMIC! Deseo cotizar el producto: ${p.name} ($${price.toFixed(2)})`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-auto w-full py-2.5 bg-slate-100 hover:bg-emerald-600 text-slate-800 hover:text-white font-bold text-[11px] uppercase tracking-wider rounded-2xl transition-all text-center flex items-center justify-center gap-1 border border-slate-200 shadow-sm"
                    >
                      <span>💬 Cotizar WhatsApp</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ═══════════ INTERACTIVE CAMPAIGN & LANDING BANNERS ═══════════ */}
      <section className="w-full max-w-7xl mx-auto px-6 py-12 space-y-8">
        
        {/* Banner 1: Generadores Eléctricos vs Gasolina */}
        <div className="rounded-3xl bg-gradient-to-r from-amber-50/80 via-yellow-50/60 to-white border border-amber-200/90 p-8 sm:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-md relative overflow-hidden group">
          <div className="space-y-4 max-w-2xl relative z-10">
            <span className="px-3.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-black uppercase tracking-wider border border-amber-300">
              ⚡ Energía & Comparativa Versus
            </span>
            <h3 className="text-2xl sm:text-4xl font-black text-slate-950 leading-tight font-heading">
              ¿Generadores Eléctricos a Batería vs Generadores a Gasolina?
            </h3>
            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
              Analiza los pros y contras de cada tecnología. Silencio, cero humo, recarga solar vs potencia continua. Configura tu kit ideal con paneles solares y accesorios.
            </p>
            <div className="pt-2">
              <Link
                href="/web/generadores"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-sm hover:brightness-105 shadow-md transition-all"
              >
                <span>Ver Comparativa & Combos</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
          <div className="relative z-10 shrink-0 w-full lg:w-72 aspect-video sm:aspect-square rounded-2xl bg-white border border-amber-200 overflow-hidden flex items-center justify-center p-4 shadow-sm">
            <SafeImage src="/images/generadores/comparativa-generadores.jpg" alt="Generadores Eléctricos vs Gasolina" className="object-contain w-full h-full group-hover:scale-105 transition-transform" />
          </div>
        </div>

        {/* Banner 2: Botonera Antigolpes & Videoportero (IMAGEN REAL DEL KIT LCD 10") */}
        <div className="rounded-3xl bg-gradient-to-r from-blue-50/80 via-cyan-50/60 to-white border border-cyan-200/90 p-8 sm:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-md relative overflow-hidden group">
          <div className="space-y-4 max-w-2xl relative z-10">
            <span className="px-3.5 py-1 rounded-full bg-cyan-100 text-cyan-800 text-xs font-black uppercase tracking-wider border border-cyan-300">
              🛡️ Ofertas de Alta Calidad
            </span>
            <h3 className="text-2xl sm:text-4xl font-black text-slate-950 leading-tight font-heading">
              Kit Videoportero LCD 10" con Botonera Antigolpes Metálica & Antivandálica
            </h3>
            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
              Máxima durabilidad y seguridad perimetral para conjuntos, residencias y empresas. Visión nocturna, apertura remota desde smartphone y botonera metálica de alta resistencia.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/web/videoporteros"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-black text-sm hover:brightness-105 shadow-md transition-all"
              >
                <span>Ver Videoporteros & Precios</span>
                <ArrowRight size={16} />
              </Link>
              <a
                href={`https://wa.me/593969043453?text=${encodeURIComponent("Hola ATOMIC! Deseo cotizar el Kit Videoportero LCD 10 con Botonera Antivandálica.")}`}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-3.5 rounded-xl bg-white hover:bg-cyan-50 text-slate-800 font-bold text-xs border border-cyan-200 shadow-sm transition-all"
              >
                Cotizar por WhatsApp
              </a>
            </div>
          </div>
          <div className="relative z-10 shrink-0 w-full lg:w-80 aspect-square rounded-2xl bg-white border border-cyan-200 overflow-hidden flex items-center justify-center p-3 shadow-md">
            <SafeImage src="/images/videoporteros/videoportero-lcd10-kit.jpg" alt="Kit Videoportero LCD 10 con Botonera Antivandálica" className="object-contain w-full h-full group-hover:scale-105 transition-transform" />
          </div>
        </div>

        {/* Banner 3: Nuestra Especialidad es la Tecnología */}
        <div className="rounded-3xl bg-gradient-to-r from-purple-50/80 via-indigo-50/60 to-white border border-purple-200/90 p-8 sm:p-12 text-center shadow-md relative overflow-hidden">
          <span className="px-3.5 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-black uppercase tracking-wider border border-purple-300">
            ✨ ATOMIC INDUSTRIES • ECUADOR
          </span>
          <h3 className="text-3xl sm:text-5xl font-black text-slate-950 mt-4 max-w-4xl mx-auto leading-tight font-heading">
            Nuestra Especialidad es la Tecnología
          </h3>
          <p className="text-slate-700 text-xs sm:text-base max-w-3xl mx-auto mt-3">
            Desde seguridad electrónica inteligente y servidores corporativos hasta movilidad urbana, computación y automatización con IA. Transformamos tu vida y tu negocio.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link href="/web/automatizacion" className="px-5 py-2.5 rounded-xl bg-white hover:bg-purple-50 text-slate-800 font-bold text-xs border border-purple-200 shadow-sm transition-all">
              🤖 Bots & IA ($99/mes)
            </Link>
            <Link href="/web/scooters" className="px-5 py-2.5 rounded-xl bg-white hover:bg-purple-50 text-slate-800 font-bold text-xs border border-purple-200 shadow-sm transition-all">
              🛵 Scooters Eléctricos
            </Link>
            <Link href="/web/bicicletas-electricas" className="px-5 py-2.5 rounded-xl bg-white hover:bg-purple-50 text-slate-800 font-bold text-xs border border-purple-200 shadow-sm transition-all">
              🚲 Bicicletas Eléctricas (40% OFF)
            </Link>
            <Link href="/web/servidores" className="px-5 py-2.5 rounded-xl bg-white hover:bg-purple-50 text-slate-800 font-bold text-xs border border-purple-200 shadow-sm transition-all">
              🖥️ Servidores Rack TI
            </Link>
          </div>
        </div>

        {/* ═══════════ NUEVO APARTADO: NUESTRO BLOG & TRABAJOS EN ACCIÓN (YOUTUBE) ═══════════ */}
        <div className="rounded-[36px] bg-white border border-slate-200/90 p-8 sm:p-12 shadow-xl space-y-8" id="blog-seccion">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                <Youtube size={14} className="text-red-600" />
                <span>Casos de Éxito & Trabajos Realizados</span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-black text-slate-950 font-heading uppercase tracking-tight">
                Nuestro Blog & Ingeniería en Acción
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                No solo comercializamos tecnología; nuestro equipo técnico instala, calibra y entrega obras llave en mano en todo el Ecuador. Explora los registros en video de nuestras instalaciones reales:
              </p>
            </div>
            <a
              href="https://youtube.com/@atomicmenquantum?si=jScgTmF2FBGTrObU"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md w-fit shrink-0 transition-all hover:scale-105"
            >
              <Youtube size={15} />
              <span>Canal @atomicmenquantum</span>
            </a>
          </div>

          {/* 3 Featured Video Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Campana Extractora */}
            <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-5 space-y-4 hover:border-blue-400 hover:shadow-lg transition-all flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="relative aspect-video rounded-xl bg-slate-900 overflow-hidden flex items-center justify-center">
                  <img src="/images/categories/hogar.jpg" alt="Instalación de Campanas Extractoras" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play size={20} className="ml-1" />
                    </div>
                  </div>
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-white">Línea Hogar</span>
                </div>
                <h4 className="text-base font-bold text-slate-950 font-heading group-hover:text-blue-600 transition-colors">
                  Instalación de Campanas Extractoras de Alta Eficiencia
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Montaje de ductería, extracción silenciosa de humos y filtros de carbón activado en cocinas residenciales e industriales en Quito.
                </p>
              </div>
              <div className="pt-2 flex items-center gap-2">
                <a
                  href="https://youtube.com/@atomicmenquantum?si=jScgTmF2FBGTrObU"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs border border-slate-200 text-center flex items-center justify-center gap-1.5 transition-all"
                >
                  <Youtube size={13} className="text-red-600" />
                  <span>Ver Video</span>
                </a>
                <Link
                  href="/web/campanas"
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs transition-all"
                >
                  Campanas
                </Link>
              </div>
            </div>

            {/* Card 2: Videoporteros */}
            <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-5 space-y-4 hover:border-blue-400 hover:shadow-lg transition-all flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="relative aspect-video rounded-xl bg-slate-900 overflow-hidden flex items-center justify-center">
                  <img src="/images/videoporteros/videoportero-lcd10-kit.jpg" alt="Instalación de Videoporteros" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play size={20} className="ml-1" />
                    </div>
                  </div>
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-white">Seguridad Smart</span>
                </div>
                <h4 className="text-base font-bold text-slate-950 font-heading group-hover:text-blue-600 transition-colors">
                  Sistemas de Videoportero LCD & Citofonía IP
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Puesta en marcha de pantallas LCD de 10 pulgadas, botoneras metálicas antivandálicas y apertura remota desde app móvil en condominios.
                </p>
              </div>
              <div className="pt-2 flex items-center gap-2">
                <a
                  href="https://youtube.com/@atomicmenquantum?si=jScgTmF2FBGTrObU"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs border border-slate-200 text-center flex items-center justify-center gap-1.5 transition-all"
                >
                  <Youtube size={13} className="text-red-600" />
                  <span>Ver Video</span>
                </a>
                <Link
                  href="/web/videoporteros"
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs transition-all"
                >
                  Porteros
                </Link>
              </div>
            </div>

            {/* Card 3: Barreras y Antipánico */}
            <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-5 space-y-4 hover:border-blue-400 hover:shadow-lg transition-all flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="relative aspect-video rounded-xl bg-slate-900 overflow-hidden flex items-center justify-center">
                  <img src="/images/categories/tecnologia-residencial.jpg" alt="Barreras Vehiculares y Antipánico" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play size={20} className="ml-1" />
                    </div>
                  </div>
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-white">Accesos & Tráfico</span>
                </div>
                <h4 className="text-base font-bold text-slate-950 font-heading group-hover:text-blue-600 transition-colors">
                  Barreras Vehiculares Automáticas & Sistemas Antipánico
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Integración de barreras automáticas brushless para alto tráfico, lectores vehiculares RFID de largo alcance y barras antipánico de seguridad.
                </p>
              </div>
              <div className="pt-2 flex items-center gap-2">
                <a
                  href="https://youtube.com/@atomicmenquantum?si=jScgTmF2FBGTrObU"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs border border-slate-200 text-center flex items-center justify-center gap-1.5 transition-all"
                >
                  <Youtube size={13} className="text-red-600" />
                  <span>Ver Video</span>
                </a>
                <Link
                  href="/web/barreras-vehiculares"
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs transition-all"
                >
                  Barreras
                </Link>
              </div>
            </div>
          </div>

          {/* Embedded Official YouTube Player */}
          <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 shadow-inner p-2">
            <div className="relative w-full aspect-video rounded-xl overflow-hidden">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/_rI46cUolfQ"
                title="ATOMIC Industrias Ecuador - Trabajos Realizados"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>

        {/* ═══════════ NUEVO APARTADO: NEWSLETTER OFICIAL (INTELIGENCIA DE IMPORTACIÓN & TÉCNICA) ═══════════ */}
        <div className="rounded-[36px] bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 text-white p-8 sm:p-12 border border-blue-500/30 shadow-2xl relative overflow-hidden" id="newsletter-seccion">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative z-10 max-w-4xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-300 text-xs font-mono font-bold uppercase tracking-wider">
              <Mail size={13} />
              <span>The ATOMIC Gazette • Boletín Técnico Semanal</span>
            </div>

            <h3 className="text-2xl sm:text-4xl lg:text-5xl font-black font-heading leading-tight uppercase">
              Inteligencia de Importación & Especialización Técnica
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
              Semanalmente subimos noticias y análisis de alto valor estratégico para saber <strong>qué productos importar, vender y distribuir en Ecuador</strong> con altos márgenes de ganancia, así como guías paso a paso para <strong>especializarte como técnico certificado</strong> en instalación de cerraduras smart, CCTV y citofonía.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white/[0.05] border border-white/10 space-y-1">
                <span className="text-emerald-400 font-mono text-xs font-bold block">01 / TENDENCIAS</span>
                <h5 className="font-bold text-sm text-white">Artículos Más Rentables</h5>
                <p className="text-[11px] text-slate-400 leading-relaxed">Conoce qué tecnología china y repuestos tienen mayor rotación inmediata.</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.05] border border-white/10 space-y-1">
                <span className="text-blue-400 font-mono text-xs font-bold block">02 / CAPACITACIÓN</span>
                <h5 className="font-bold text-sm text-white">Especialízate como Técnico</h5>
                <p className="text-[11px] text-slate-400 leading-relaxed">Diagramas de conexión, configuración de apps móviles y resolución de fallas.</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.05] border border-white/10 space-y-1">
                <span className="text-amber-400 font-mono text-xs font-bold block">03 / COMUNIDAD VIP</span>
                <h5 className="font-bold text-sm text-white">Alertas de Contenedor</h5>
                <p className="text-[11px] text-slate-400 leading-relaxed">Entérate de la llegada de lotes antes de que salgan a la venta pública.</p>
              </div>
            </div>

            <div className="pt-3 flex flex-wrap items-center gap-3">
              <a
                href="https://wa.me/593989476556?text=Deseo%20suscribirme%20al%20bolet%C3%ADn%20semanal%20de%20importaci%C3%B3n%20y%20gu%C3%ADas%20t%C3%A9cnicas%20ATOMIC."
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/25 flex items-center gap-2"
              >
                <MessageSquare size={14} />
                <span>Unirme al Canal VIP de WhatsApp</span>
              </a>
              <Link
                href="/web/precios-vendedor"
                className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider border border-white/15 transition-all"
              >
                Ver Matriz de Precios Mayorista
              </Link>
            </div>
          </div>
        </div>

        {/* ═══════════ NUEVO BANNER: LÍNEAS DE DISTRIBUCIÓN & PRECIOS MAYORISTAS (4K IMAGE BACKDROP) ═══════════ */}
        <div className="rounded-[36px] border border-white/10 overflow-hidden shadow-2xl relative">
          {/* 4K Tech Hub Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src="/images/wholesale-tech-hub-4k.jpg"
              alt="Centro Mayorista de Distribución ATOMIC"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/90 to-blue-950/80 backdrop-blur-[2px]" />
          </div>

          <div className="relative z-10 p-8 sm:p-14 space-y-6 text-white max-w-5xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider">
              <Package size={13} />
              <span>Importación Directa & Precios Mayoristas Únicos</span>
            </div>

            <h3 className="text-3xl sm:text-5xl font-black font-heading leading-tight uppercase tracking-tight">
              Líneas de Distribución para Negocios, Técnicos & Emprendedores
            </h3>

            <p className="text-xs sm:text-base text-slate-300 leading-relaxed max-w-3xl">
              Ponemos a tu disposición precios de mayorista directo para que inicies o escales tu negocio hoy mismo. Accede a descuentos de distribuidor <strong>a partir de solo 6 unidades surtidas</strong> con entrega express y garantía legal en todo el Ecuador.
            </p>

            {/* 4 Wholesale Categories Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              <div className="p-5 rounded-2xl bg-black/60 border border-white/10 space-y-2 backdrop-blur-md">
                <span className="text-cyan-400 font-mono text-xs font-bold block">CIRCUITOS & MÓDULOS</span>
                <h5 className="font-bold text-sm text-white">Tarjetas Electrónicas</h5>
                <p className="text-xs text-slate-400 leading-relaxed">Fuentes conmutadas, módulos de control, relés y placas base a precio de fábrica.</p>
                <span className="text-[10px] font-mono text-cyan-300 block pt-1 font-bold">Desde 6 unidades</span>
              </div>

              <div className="p-5 rounded-2xl bg-black/60 border border-white/10 space-y-2 backdrop-blur-md">
                <span className="text-blue-400 font-mono text-xs font-bold block">TALLERES DE LAPTOP</span>
                <h5 className="font-bold text-sm text-white">Repuestos de Computación</h5>
                <p className="text-xs text-slate-400 leading-relaxed">Baterías de litio, pantallas LED slim, teclados para todas las marcas, cargadores tipo C y flex.</p>
                <span className="text-[10px] font-mono text-blue-300 block pt-1 font-bold">Lotes para talleres</span>
              </div>

              <div className="p-5 rounded-2xl bg-black/60 border border-white/10 space-y-2 backdrop-blur-md">
                <span className="text-amber-400 font-mono text-xs font-bold block">ALTA ROTACIÓN</span>
                <h5 className="font-bold text-sm text-white">Tecnología China Económica</h5>
                <p className="text-xs text-slate-400 leading-relaxed">Gadgets inteligentes, luces solares, cerraduras y accesorios de hogar para venta rápida.</p>
                <span className="text-[10px] font-mono text-amber-300 block pt-1 font-bold">Margen 30% a 45%</span>
              </div>

              <div className="p-5 rounded-2xl bg-black/60 border border-white/10 space-y-2 backdrop-blur-md">
                <span className="text-emerald-400 font-mono text-xs font-bold block">RESPALDO & GUÍA</span>
                <h5 className="font-bold text-sm text-white">Capacitación Continua</h5>
                <p className="text-xs text-slate-400 leading-relaxed">Asesoría personalizada y acompañamiento técnico directo por formar parte de nuestro equipo.</p>
                <span className="text-[10px] font-mono text-emerald-300 block pt-1 font-bold">100% Asesoría Gratuita</span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-3">
              <a
                href="https://wa.me/593989476556?text=Saludos%20Direcci%C3%B3n%20Comercial%20ATOMIC%2C%20solicito%20la%20lista%20de%20precios%20mayoristas%20(desde%206%20unidades)%20para%20distribuir."
                target="_blank"
                rel="noreferrer"
                className="px-7 py-4 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:brightness-105 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-xl shadow-amber-500/30 flex items-center gap-2"
              >
                <span>Solicitar Lista Mayorista en WhatsApp</span>
                <ArrowRight size={15} />
              </a>
              <Link
                href="/web/precios-vendedor"
                className="px-6 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider border border-white/20 transition-all"
              >
                Ver Matriz de Comisiones
              </Link>
            </div>
          </div>
        </div>

        {/* ═══════════ NUEVO BANNER DE CIERRE: CUÉNTANOS TU PROYECTO (DISEÑO PRO EJECUTIVO) ═══════════ */}
        <div className="rounded-[40px] bg-gradient-to-br from-[#070b16] via-[#0d162d] to-[#050812] border-2 border-blue-500/40 p-8 sm:p-14 shadow-2xl relative overflow-hidden text-white space-y-6">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/15 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/15 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 max-w-4xl space-y-5">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-300 text-xs font-mono font-bold uppercase tracking-widest">
              <Sparkles size={14} className="text-blue-400" />
              <span>CONSULTORÍA & DESARROLLO INTEGRAL ATOMIC</span>
            </div>

            <h3 className="text-3xl sm:text-5xl font-black font-heading uppercase tracking-tight leading-tight">
              ¿Tienes un Proyecto en Tecnología, Negocio o Software? Cuéntanoslo.
            </h3>

            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              <p>
                Ya sea que busques una comunidad activa donde compartir y enriquecer tus ideas, requieras asesoría especializada de ingeniería para implementar una infraestructura compleja, o simplemente desees realizar una compra garantizada para ti, tu negocio o tu emprendimiento: escríbenos con total confianza.
              </p>
              <p className="bg-white/[0.04] p-4 rounded-2xl border border-white/10 text-slate-200">
                ⚡ En <strong>ATOMIC Electronics / AB Ingenieros</strong> integramos las mejores soluciones tecnológicas del mercado: <strong>desarrollo de software a medida</strong>, despliegue de <strong>sistemas de hardware corporativo</strong>, <strong>seguridad electrónica perimetral</strong> y <strong>control de accesos</strong>, con vinculación directa a aplicativos de <strong>gestión monetaria, control de tickets y plataformas ERP en la nube</strong>.
              </p>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-3">
              <a
                href="https://wa.me/593989476556?text=Saludos%20Director%20Juan%20Guzm%C3%A1n%2C%20tengo%20un%20proyecto%20tecnol%C3%B3gico%20%2F%20requerimiento%20para%20mi%20negocio%20y%20deseo%20asesor%C3%ADa."
                target="_blank"
                rel="noreferrer"
                className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:brightness-110 text-white font-black text-xs uppercase tracking-wider transition-all shadow-xl shadow-blue-600/30 flex items-center gap-2 hover:scale-102"
              >
                <MessageSquare size={16} />
                <span>Hablar con Dirección General (WhatsApp)</span>
              </a>

              <a
                href="tel:+593989476556"
                className="px-6 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider border border-white/15 transition-all flex items-center gap-2"
              >
                <PhoneCall size={14} />
                <span>Llamada Directa</span>
              </a>

              <Link
                href="/web/software"
                className="px-6 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider border border-white/15 transition-all"
              >
                Ver Portafolio de Software
              </Link>
            </div>
          </div>
        </div>


      </section>

      {/* ═══════════ BOTTOM BRANDING & CONFIDENCE (APPIT BENTO CARDS) ═══════════ */}
      <section className="w-full max-w-7xl mx-auto px-6 pt-12 pb-20 border-t border-slate-200 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-8 rounded-3xl bg-white border border-slate-200/90 space-y-3 shadow-md hover:shadow-lg transition-all">
            <Truck className="mx-auto text-blue-600" size={32} />
            <h4 className="font-bold text-sm text-slate-950 uppercase font-heading">Envíos a Todo el País</h4>
            <p className="text-xs text-slate-600 leading-relaxed">Despachos seguros y coordinados con cobertura nacional en las 24 provincias del Ecuador.</p>
          </div>
          <div className="p-8 rounded-3xl bg-white border border-slate-200/90 space-y-3 shadow-md hover:shadow-lg transition-all">
            <Shield className="mx-auto text-blue-600" size={32} />
            <h4 className="font-bold text-sm text-slate-950 uppercase font-heading">Garantía Directa</h4>
            <p className="text-xs text-slate-600 leading-relaxed">Equipos probados con garantía directa de fábrica y soporte técnico especializado.</p>
          </div>
          <div className="p-8 rounded-3xl bg-white border border-slate-200/90 space-y-3 shadow-md hover:shadow-lg transition-all">
            <Award className="mx-auto text-blue-600" size={32} />
            <h4 className="font-bold text-sm text-slate-950 uppercase font-heading">Atención Especializada</h4>
            <p className="text-xs text-slate-600 leading-relaxed">Asesoría técnica instantánea vía WhatsApp antes, durante y después de tu compra.</p>
          </div>
        </div>
      </section>


    
      {/* ═══════════ USER DROPDOWN ACTION MODALS ═══════════ */}
      <AnimatePresence>
        {activeUserModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setActiveUserModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl text-slate-900 relative overflow-hidden"
            >
              <button
                onClick={() => setActiveUserModal(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>

              {activeUserModal === 'perfil' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-bold text-xl">
                      👤
                    </div>
                    <div>
                      <h3 className="text-lg font-black uppercase text-slate-950 font-heading">Mi Perfil ATOMIC</h3>
                      <p className="text-xs text-blue-600 font-mono">Usuario Registrado</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-xs text-slate-700 font-mono">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between">
                      <span className="text-slate-500">Cliente:</span>
                      <span className="font-bold text-slate-950">Usuario Preferencial</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between">
                      <span className="text-slate-500">Estado:</span>
                      <span className="font-bold text-emerald-600">Activo & Verificado</span>
                    </div>
                  </div>
                </div>
              )}

              {activeUserModal === 'compras' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 font-bold text-xl">
                      🛍️
                    </div>
                    <div>
                      <h3 className="text-lg font-black uppercase text-slate-950 font-heading">Mis Compras</h3>
                      <p className="text-xs text-emerald-600 font-mono">Historial de Pedidos</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-600">
                    <p className="font-bold text-slate-900 mb-1">Sin pedidos pendientes</p>
                    <p>Tus cotizaciones y compras aparecerán aquí automáticamente.</p>
                  </div>
                </div>
              )}

              {activeUserModal === 'envios' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 font-bold text-xl">
                      🚚
                    </div>
                    <div>
                      <h3 className="text-lg font-black uppercase text-slate-950 font-heading">Seguimiento de Envíos</h3>
                      <p className="text-xs text-amber-600 font-mono">Cobertura Todo Ecuador</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                    <div className="flex items-center justify-between text-emerald-600 font-bold">
                      <span>Servientrega / Tramaco / Envíos Directos</span>
                      <span>100% Garantizado</span>
                    </div>
                    <p className="text-slate-600">Tus guías de despacho se sincronizan automáticamente con tu número de WhatsApp.</p>
                  </div>
                </div>
              )}

              {activeUserModal === 'settings' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 font-bold text-xl">
                      ⚙️
                    </div>
                    <div>
                      <h3 className="text-lg font-black uppercase text-slate-950 font-heading">Configuración</h3>
                      <p className="text-xs text-purple-600 font-mono">Preferencias de Usuario</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <span className="text-slate-600">Moneda Predeterminada</span>
                      <span className="font-bold text-blue-600">USD ($)</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <span className="text-slate-600">Notificaciones WhatsApp</span>
                      <span className="font-bold text-emerald-600">Activadas</span>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={() => setActiveUserModal(null)}
                className="w-full mt-4 py-3 bg-slate-950 hover:bg-blue-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md"
              >
                Cerrar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════ MODAL SELECTOR: EMPLEADO O COMPRADOR ═══════════ */}
      <AnimatePresence>
        {isAuthModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setIsAuthModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-[0_20px_70px_rgba(0,0,0,0.15)] relative text-slate-900"
            >
              {/* Botón cerrar */}
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-all cursor-pointer"
              >
                <X size={16} />
              </button>

              {/* Header */}
              <div className="text-center mb-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-mono font-bold uppercase tracking-widest mb-2">
                  <ShieldCheck size={12} /> Acceso al Ecosistema ATOMIC
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight text-slate-950 font-heading">
                  Identificación de Cuenta
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Selecciona tu perfil de usuario para ingresar
                </p>
              </div>

              {/* ── MENÚ DESPLEGABLE: EMPLEADO O COMPRADOR ── */}
              <div className="mb-5 space-y-2">
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-blue-700">
                  Tipo de Perfil:
                </label>
                <div className="relative">
                  <select
                    value={authProfileType}
                    onChange={(e) => setAuthProfileType(e.target.value as "empleado" | "comprador")}
                    className="w-full bg-slate-50 border border-slate-300 focus:border-blue-500 text-slate-900 rounded-2xl px-4 py-3 text-xs font-bold uppercase tracking-wider outline-none appearance-none cursor-pointer"
                  >
                    <option value="comprador">🛍️ COMPRADOR (CLIENTE TIENDA EN LÍNEA)</option>
                    <option value="empleado">🏢 EMPLEADO (ASESOR DE VENTAS)</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                </div>

                {/* Alternador Rápido en Pestañas */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setAuthProfileType("empleado")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 border ${
                      authProfileType === "empleado"
                        ? "bg-cyan-50 border-cyan-500 text-cyan-800 shadow-sm"
                        : "bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Briefcase size={13} />
                    <span>Empleado</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthProfileType("comprador")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 border ${
                      authProfileType === "comprador"
                        ? "bg-blue-50 border-blue-500 text-blue-800 shadow-sm"
                        : "bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <ShoppingBag size={13} />
                    <span>Comprador</span>
                  </button>
                </div>
              </div>

              {/* Indicador Contextual */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 mb-5">
                {authProfileType === "empleado" ? (
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-black text-cyan-700 uppercase tracking-wider block">
                      ✓ REGISTRO OFICIAL DE ASESORES ATOMIC VENTAS
                    </span>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Acceso al portal comercial de asesores, comisiones, asistencia y cotizador interno.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-black text-blue-700 uppercase tracking-wider block">
                      ✓ PORTAL OFICIAL DE CLIENTES & COMPRADORES
                    </span>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Acceso a compras, precios preferenciales, pedidos y cotizaciones de la tienda online.
                    </p>
                  </div>
                )}
              </div>

              {/* Alerta de Error */}
              {authError && (
                <div className="mb-4 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                  <AlertCircle size={14} className="shrink-0 text-rose-600" />
                  <span>{authError}</span>
                </div>
              )}

              {/* Formulario Rápido de Login */}
              <form onSubmit={handleQuickLogin} className="space-y-3">
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-600" />
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="Correo electrónico"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-600" />
                  <input
                    type={showAuthPassword ? "text" : "password"}
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="Contraseña"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAuthPassword(!showAuthPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    {showAuthPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  {authLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={14} /> Identificando perfil...
                    </>
                  ) : (
                    <>
                      <span>Iniciar Sesión ({authProfileType === "empleado" ? "Empleado" : "Comprador"})</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </form>

              {/* Enlaces a Registros y Logins Dedicados */}
              <div className="mt-5 pt-4 border-t border-slate-200 flex flex-col gap-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">¿No tienes cuenta?</span>
                  <Link
                    href={authProfileType === "empleado" ? "/register/vendedor" : "/register/comprador"}
                    onClick={() => setIsAuthModalOpen(false)}
                    className="font-bold text-blue-600 hover:underline"
                  >
                    {authProfileType === "empleado" ? "Registrar como Empleado →" : "Registrar como Comprador →"}
                  </Link>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100">
                  <Link
                    href={authProfileType === "empleado" ? "/login" : "/login/comprador"}
                    onClick={() => setIsAuthModalOpen(false)}
                    className="hover:text-slate-800 underline"
                  >
                    Página completa de {authProfileType === "empleado" ? "Login Empleado" : "Login Comprador"}
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsAuthModalOpen(false)}
                    className="hover:text-slate-800 underline"
                  >
                    Registro General
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
