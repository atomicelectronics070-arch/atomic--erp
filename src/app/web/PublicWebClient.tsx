"use client"

// Version: 3.0.0 — ATOMIC × Appit Theme Integration (Inter Tight + Instrument Sans, real Appit CSS tokens)
import { useState, useRef, useEffect, useMemo } from "react"
import {
  ShoppingBag, ChevronRight, ArrowRight, Shield, Zap, Truck,
  ChevronLeft, Hexagon, Star, X, Smartphone, Sparkles, Code, Bot,
  Search, ImageOff, Home, Building, Factory, Cpu, Gamepad2, Utensils, Laptop, Award, User, Settings, ChevronDown, Package, LogIn, Menu,
  Wrench, Clock, ShieldCheck
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import dynamic from "next/dynamic"
import { calculateDiscountedPrice } from "@/lib/utils/pricing"

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
    title: "PROMOCIÓN 30% DE DESCUENTO EN CERRADURAS SMART\nAl Comprar tu Cerradura y Adquirirla con Instalación", 
    badge: "30% DE DESCUENTO", 
    src: "/images/cerraduras/cerraduras-instalacion-portada.jpg", 
    link: "/web/cerraduras-smart" 
  },
  { 
    image: { src: "/images/promociones/cargador-wallbox-mevo.jpg", alt: "Cargadores de Auto Eléctrico Wallbox Livoltek Mevo" },
    title: "CARGADORES DE AUTO ELÉCTRICO\nWallbox Livoltek Mevo 7.3 kW & Portátiles 220V", 
    badge: "MOVILIDAD ELÉCTRICA", 
    src: "/images/promociones/cargador-wallbox-mevo.jpg", 
    link: "/web/cargadores-electricos" 
  },
  { 
    image: { src: "/images/promociones/repuestos-computadoras-portada.jpg", alt: "Línea de Repuestos para Computadoras y Laptops" },
    title: "LÍNEA DE REPUESTOS PARA COMPUTADORAS\nBaterías, Cargadores, RAM, CPUs, Cases & Fuentes", 
    badge: "REPUESTOS ORIGINALES", 
    src: "/images/promociones/repuestos-computadoras-portada.jpg", 
    link: "/web/repuestos" 
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
    image: { src: "/images/parlantes/parlante-smart-rendimiento.jpg", alt: "Parlante Smart Alto Rendimiento con Audífonos TWS de Regalo" },
    title: "PARLANTE SMART ALTO RENDIMIENTO\nSonido Único Envolvente + Audífonos Bluetooth de Regalo", 
    badge: "REGALO TWS", 
    src: "/images/parlantes/parlante-smart-rendimiento.jpg", 
    link: "/web/parlante-smart" 
  },
  { 
    image: { src: "/images/camaras-espia/gafas-camara-espia.jpg", alt: "Gafas con Cámara Espía y Micro Vigilancia" },
    title: "CÁMARAS ESPÍA & DISPOSITIVOS DISCRETOS\nGafas Full HD, Cargadores y Percheros con Cámara Oculta", 
    badge: "DISCRETO", 
    src: "/images/camaras-espia/gafas-camara-espia.jpg", 
    link: "/web/camaras-espia" 
  },
  { 
    image: { src: "/images/videoporteros/videoportero-diel-10.jpg", alt: "Videoportero DIEL 10 con Botonera Antivandálica" },
    title: "VIDEOPORTEROS SMART & BOTONERAS METÁLICAS\nPantalla 10\" DIEL ($221.01) y EZVIZ HP7 Inalámbrico", 
    badge: "ANTIVANDÁLICO", 
    src: "/images/videoporteros/videoportero-diel-10.jpg", 
    link: "/web/videoporteros" 
  },
]

const TEMPORADA_COVERFLOW_SLIDES = [
  { 
    image: { src: "/images/scooters/scooter-ninebot-f25.jpg", alt: "Scooters Eléctricos Smart Ninebot & KickScooter" },
    title: "SCOOTERS ELÉCTRICOS SMART 2026\nSegway Ninebot F25 ($489), ES1L ($412) y E12 ($269)", 
    badge: "MOVILIDAD SMART", 
    src: "/images/scooters/scooter-ninebot-f25.jpg", 
    link: "/web/scooters" 
  },
  { 
    image: { src: "/images/scooters/scooter-es1l.jpg", alt: "KickScooter ES1L Ligero Urbano" },
    title: "KICKSCOOTER ES1L LIGERO URBANO ($412)\nMovilidad Práctica • Solo 11 kg de Peso", 
    badge: "ULTRA LIGERO", 
    src: "/images/scooters/scooter-es1l.jpg", 
    link: "/web/scooters" 
  },
  { 
    image: { src: "/images/bicicletas/bicicleta-shimano-r8014.jpg", alt: "Bicicletas Eléctricas Shimano & Montaña" },
    title: "BICICLETAS ELÉCTRICAS • TEMPORADA DE VERANO\n25% OFF General y 40% OFF para Estudiantes", 
    badge: "25% - 40% OFF", 
    src: "/images/bicicletas/bicicleta-shimano-r8014.jpg", 
    link: "/web/bicicletas-electricas" 
  },
  { 
    image: { src: "/images/bicicletas/bicicleta-montana-26.jpg", alt: "Bicicleta de Montaña 26 Pulgadas Uso Rudo" },
    title: "BICICLETA DE MONTAÑA 26\" USO RUDO\nBatería Litio 48V 10Ah • Motor 350W • Uso 24/7", 
    badge: "USO RUDO", 
    src: "/images/bicicletas/bicicleta-montana-26.jpg", 
    link: "/web/bicicletas-electricas" 
  },
  { 
    image: { src: "/images/bicicletas/bicicleta-plegable-48v.jpg", alt: "Bicicleta Eléctrica Plegable Alto Rendimiento" },
    title: "BICICLETA ELÉCTRICA PLEGABLE ALTO RENDIMIENTO\nNeumáticos 21\" • Puerto USB LCD • Batería 48V", 
    badge: "PLEGABLE", 
    src: "/images/bicicletas/bicicleta-plegable-48v.jpg", 
    link: "/web/bicicletas-electricas" 
  },
  { 
    image: { src: "/images/luminarias/luces-led-solares-300-800w.jpg", alt: "Luminarias Solares Autónomas Atomeca" },
    title: "LUMINARIAS SOLARES AUTÓNOMAS ATOMECA\n300W ($43), 600W ($54) y 800W ($66) con Panel Solar IP65", 
    badge: "ENERGÍA SOLAR", 
    src: "/images/luminarias/luces-led-solares-300-800w.jpg", 
    link: "/web/luminarias-solares" 
  },
  { 
    image: { src: "/images/luminarias/iluminacion-lujo-colgante.jpg", alt: "Iluminación de Lujo para Departamentos" },
    title: "ILUMINACIÓN DE LUJO PARA DEPARTAMENTOS\nLámparas Colgantes Industriales a Costo Mega Reducido", 
    badge: "DISEÑO VINTAGE", 
    src: "/images/luminarias/iluminacion-lujo-colgante.jpg", 
    link: "/web/iluminacion" 
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
    title: "CÁMARAS DE SEGURIDAD WI-FI A BATERÍA\nEconómicas de Alto Rendimiento para Garitas y Locales", 
    badge: "100% WI-FI", 
    src: "/images/camaras/camara-wifi-bateria.jpg", 
    link: "/web/camaras-wifi" 
  },
  { 
    image: { src: "/images/monitores/monitor-dahua-19.jpg", alt: "Monitor Dahua DH-LM19 LED Bajo Consumo" },
    title: "MONITORES DAHUA LED 24/7\nResolución HD+ 1600x900 • Entradas HDMI & VGA", 
    badge: "DAHUA CCTV", 
    src: "/images/monitores/monitor-dahua-19.jpg", 
    link: "/web/monitores" 
  },
]

const COMBOS_COVERFLOW_SLIDES = [
  { 
    image: { src: "/images/generadores/comparativa-generadores.jpg", alt: "Generadores Eléctricos vs Gasolina" },
    title: "GENERADORES ELÉCTRICOS + PANELES + ACCESORIOS\nConfigura tu Estación Solar o Generador a la Medida", 
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
    image: { src: "/images/linternas/linterna-potencia-steren.jpg", alt: "Linterna Steren Alto Nivel Lumínico" },
    title: "LINTERNA STEREN ALTO NIVEL LUMÍNICO\nPotencia Extrema + Paquete de Baterías de Regalo", 
    badge: "BATERÍAS GRATIS", 
    src: "/images/linternas/linterna-potencia-steren.jpg", 
    link: "/web/linterna-potencia" 
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
    title: "INSTALACIÓN CON TU CERRADURA // ATOMIC INDUSTRIES\n30% OFF al Comprar tu Cerradura con Instalación", 
    badge: "PORTADA OFICIAL", 
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
    image: { src: "/images/software/sistema-control-qr.jpg", alt: "Software Control de Acceso por QR y Tickets" },
    title: "SOFTWARE CONTROL DE ACCESO POR QR & TICKETS\nRegistro de Visitantes, Torniquetes y Barreras", 
    badge: "SISTEMA QR", 
    src: "/images/software/sistema-control-qr.jpg", 
    link: "/web/software-qr" 
  },
  { 
    image: { src: "/images/software/impulsa-tienda-online.jpg", alt: "Impulsa tu Tienda en Línea desde Quito" },
    title: "IMPULSA TU NEGOCIO CON TU PROPIA TIENDA EN LÍNEA\nDesarrollo E-Commerce desde Quito (El Labrador)", 
    badge: "TIENDA EN LÍNEA", 
    src: "/images/software/impulsa-tienda-online.jpg", 
    link: "/web/tienda-en-linea" 
  },
  { 
    image: { src: "/images/contrataciones/empleo-ingeniero-redes.jpg", alt: "Ecosistema de Contrataciones Atomic Talent" },
    title: "ECOSISTEMA DE CONTRATACIONES • ATOMIC TALENT\nIngeniero en Redes, Instaladores y Ventas $450/mes", 
    badge: "EMPLEO & VENTAS", 
    src: "/images/contrataciones/empleo-ingeniero-redes.jpg", 
    link: "/web/contrataciones" 
  },
  { 
    image: { src: "/images/contrataciones/gana-450-celular.jpg", alt: "Ventas Digitales $450 Fijo más Comisiones" },
    title: "VENDEDORES DIGITALES • $450 FIJO + COMISIONES\nGana Dinero Desde Tu Celular con Capacitación Incluida", 
    badge: "$450 / MES", 
    src: "/images/contrataciones/gana-450-celular.jpg", 
    link: "/web/contrataciones" 
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
        <img src="/images/hero-3d/slide-1.png" alt="Producto IA 1" className="w-full h-24 object-cover rounded-xl border border-white/10" />
        <img src="/images/hero-3d/slide-2.jpg" alt="Producto IA 2" className="w-full h-24 object-cover rounded-xl border border-white/10" />
        <img src="/images/hero-3d/slide-3.jpg" alt="Producto IA 3" className="w-full h-24 object-cover rounded-xl border border-white/10" />
        <img src="/images/hero-3d/slide-4.jpg" alt="Producto IA 4" className="w-full h-24 object-cover rounded-xl border border-white/10" />
        <img src="/images/hero-3d/slide-5.jpg" alt="Producto IA 5" className="w-full h-24 object-cover rounded-xl border border-white/10" />
        <img src="/images/hero-3d/slide-6.jpg" alt="Producto IA 6" className="w-full h-24 object-cover rounded-xl border border-white/10" />
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
  s.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ').trim()

const fuzzyMatch = (query: string, target: string): boolean => {
  const q = normalizeText(query)
  const t = normalizeText(target)
  const words = q.split(' ').filter(Boolean)
  return words.every(w => t.includes(w))
}

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
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [activeUserModal, setActiveUserModal] = useState<string | null>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState<string | null>(null)
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false)
  const [coverflowSection, setCoverflowSection] = useState<'ofertas' | 'promociones' | 'temporada' | 'combos' | 'instalacion' | 'servicios'>('ofertas')

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
      const target = `${p.name || ''} ${p.provider || ''} ${p.category?.name || ''} ${p.sku || ''}`
      return fuzzyMatch(q, target)
    }).slice(0, 8)

    if (localMatches.length > 0) {
      setLiveMatches(localMatches)
      setShowLiveDropdown(true)
    }

    setIsSearching(true)
    searchDebounce.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/web/products?search=${encodeURIComponent(q)}&pageSize=30`)
        const data = await res.json()
        if (data && data.products) {
          setLiveMatches(data.products.slice(0, 8))
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
        const target = `${p.name} ${p.description || ''} ${p.category?.name || ''} ${p.provider || ''}`
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

  return (
    <div className="w-full bg-[#09090A] min-h-screen text-white font-sans selection:bg-white/20 selection:text-white overflow-x-hidden">
      
      {/* ═══════════ APARTADO INDEPENDIENTE: PRODUCTOS 100% ORIGINALES & GARANTÍA (SIEMPRE NOS SIGUE A TODAS PARTES) ═══════════ */}
      <div className="sticky top-0 z-50 w-full bg-[#050507]/95 backdrop-blur-xl border-b border-emerald-500/20 py-1.5 px-4 text-center shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)] shrink-0" />
          <span className="text-emerald-400 font-extrabold font-heading text-[10px] sm:text-[11px] uppercase tracking-widest">
            PRODUCTOS 100% ORIGINALES & GARANTÍA
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)] shrink-0" />
        </div>
      </div>

      {/* ═══════════ BANNER INDEPENDIENTE CENTRADO — ENVÍOS SIN RECARGO ═══════════ */}
      <section className="w-full bg-[#0D0C12] border-b border-white/[0.04] py-2.5 px-4 text-center">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <Truck size={14} className="text-blue-400 shrink-0 animate-bounce" />
          <span className="text-white font-black font-heading text-[11px] sm:text-xs uppercase tracking-wider">
            PROMO: ENVÍOS SIN RECARGO A NIVEL NACIONAL EN CUALQUIER PRODUCTO
          </span>
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse ml-1 shrink-0" />
        </div>
      </section>

      {/* ═══════════ STICKY HORIZONTAL NAV TABS + ACCIONES + IN-PLACE DESPLEGABLE EN VIVO ═══════════ */}
      <nav className="sticky top-[29px] z-40 w-full bg-[#09090A]/95 backdrop-blur-2xl border-b border-white/[0.06] shadow-2xl shadow-black/60">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-3 py-2.5">

          {/* LEFT: 3-LINES HAMBURGER + TABS */}
          <div className="flex items-center gap-2.5 overflow-x-auto scrollbar-hide">
            {/* 3-LINES HAMBURGER ICON BUTTON (SOLO LAS 3 LÍNEAS, SIN TEXTO) */}
            <button
              onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
              className={`p-2 rounded-full border transition-all duration-200 active:scale-95 shrink-0 shadow-lg cursor-pointer flex items-center justify-center ${
                isMegaMenuOpen
                  ? 'bg-blue-500 text-white border-blue-400 shadow-blue-500/30'
                  : 'bg-white/[0.06] hover:bg-white/15 text-blue-400 border-white/10 hover:text-white'
              }`}
              title="Mapa Conceptual de Navegación"
              aria-label="Abrir Menú"
            >
              <Menu size={16} className={`transition-transform duration-300 ${isMegaMenuOpen ? 'rotate-90 text-white' : 'text-blue-400'}`} />
            </button>

            {/* BACK ARROW — visible when a tab is active */}
            {activeTab && (
              <button
                onClick={() => setActiveTab(null)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/10 border border-white/15 text-white hover:bg-white/20 text-xs font-bold font-mono tracking-wider transition-all shrink-0 mr-1 shadow-lg"
              >
                <ChevronLeft size={15} />
                <span className="hidden sm:inline">INICIO</span>
              </button>
            )}

          {/* ─── SECCIÓN 1: CATÁLOGO & NAVEGACIÓN PRINCIPAL ─── */}
          <div className="flex items-center gap-1 bg-white/[0.04] hover:bg-white/[0.06] p-1 rounded-full border border-white/[0.08] backdrop-blur-md shrink-0 shadow-inner transition-colors">
            {[
              { id: 'categorias', label: 'CATEGORÍAS' },
              { id: 'ofertas', label: 'OFERTAS' },
              { id: 'especializacion', label: 'ÁREAS' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(activeTab === tab.id ? null : tab.id); setIsMegaMenuOpen(false); }}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-wider font-heading transition-all duration-200 whitespace-nowrap border ${
                  activeTab === tab.id
                    ? 'bg-white text-black border-white shadow-xl shadow-white/10 scale-105'
                    : 'bg-transparent text-[#94969D] border-transparent hover:bg-white/10 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* LÍNEA DIVISORIA VERTICAL 1 */}
          <div className="h-5 w-[1px] bg-white/20 shrink-0" />

          {/* ─── SECCIÓN 2: SUSCRIBIBLES & CONTENIDO DINÁMICO ─── */}
          <div className="flex items-center gap-1 bg-white/[0.04] hover:bg-white/[0.06] p-1 rounded-full border border-white/[0.08] backdrop-blur-md shrink-0 shadow-inner transition-colors">
            {[
              { id: 'landings', label: 'LANDINGS' },
              { id: 'newsletter', label: 'NEWSLETTER' },
              { id: 'blog', label: 'BLOG' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(activeTab === tab.id ? null : tab.id); setIsMegaMenuOpen(false); }}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-wider font-heading transition-all duration-200 whitespace-nowrap border ${
                  activeTab === tab.id
                    ? 'bg-white text-black border-white shadow-xl shadow-white/10 scale-105'
                    : 'bg-transparent text-[#94969D] border-transparent hover:bg-white/10 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* LÍNEA DIVISORIA VERTICAL 2 */}
          <div className="h-5 w-[1px] bg-white/20 shrink-0" />

          {/* ─── SECCIÓN 3: CONFIANZA, EMPRESA & SOPORTE ─── */}
          <div className="flex items-center gap-1 bg-white/[0.04] hover:bg-white/[0.06] p-1 rounded-full border border-white/[0.08] backdrop-blur-md shrink-0 shadow-inner transition-colors">
            {[
              { id: 'nosotros', label: 'NOSOTROS' },
              { id: 'contacto', label: 'CONTACTO' },
              { id: 'resenas', label: 'RESEÑAS' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(activeTab === tab.id ? null : tab.id); setIsMegaMenuOpen(false); }}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-wider font-heading transition-all duration-200 whitespace-nowrap border ${
                  activeTab === tab.id
                    ? 'bg-white text-black border-white shadow-xl shadow-white/10 scale-105'
                    : 'bg-transparent text-[#94969D] border-transparent hover:bg-white/10 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

          {/* RIGHT: WHATSAPP (GOLD OUTLINE), LOGIN (ICON ONLY) & USER (ICON ONLY) */}
          <div className="flex items-center gap-2 shrink-0">
            {/* WHATSAPP WITH HYPER-THIN GOLD CONTOUR */}
            <a
              href="https://wa.me/593969043453?text=Hola%20ATOMIC!%20Deseo%20informaci%C3%B3n%20sobre%20sus%20productos."
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-full border border-amber-400/50 hover:border-amber-400 bg-amber-500/[0.08] hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 font-bold font-heading uppercase tracking-wider text-[10px] sm:text-[11px] shadow-[0_0_12px_rgba(245,158,11,0.18)] transition-all flex items-center gap-1.5"
              title="Asesoría Instantánea WhatsApp"
            >
              <span>ASESORÍA WHATSAPP</span>
              <span className="text-amber-400">→</span>
            </a>

            {/* INICIAR SESIÓN (ICONO SOLAMENTE) */}
            <Link
              href="/login"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white text-black hover:bg-neutral-200 flex items-center justify-center shadow-md transition-all active:scale-95 shrink-0"
              title="Iniciar Sesión"
              aria-label="Iniciar Sesión"
            >
              <LogIn size={13} className="text-black" />
            </Link>

            {/* USER (ICONO SOLAMENTE) */}
            <div className="relative z-50" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="w-7 h-7 sm:w-8 sm:h-8 bg-[#131315] border border-white/15 hover:border-white/30 rounded-full text-white shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center shrink-0"
                title="Cuenta de Usuario"
                aria-label="Cuenta de Usuario"
              >
                <User size={13} className="text-neutral-200" />
              </button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-52 bg-[#0c101c]/95 border border-blue-500/30 rounded-2xl shadow-2xl backdrop-blur-2xl p-2 z-50 overflow-hidden"
                  >
                    <div className="px-3 py-2 border-b border-white/10 mb-1">
                      <p className="text-[10px] font-mono text-blue-400 uppercase font-bold tracking-widest">Cuenta Activa</p>
                      <p className="text-xs font-bold text-white truncate">Usuario ATOMIC</p>
                    </div>

                    <button
                      onClick={() => { setActiveUserModal('perfil'); setIsUserMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-blue-600/20 text-neutral-200 hover:text-white text-xs font-bold transition-all text-left group cursor-pointer"
                    >
                      <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                        <User size={14} />
                      </div>
                      <span>Perfil</span>
                    </button>

                    <button
                      onClick={() => { setActiveUserModal('compras'); setIsUserMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-emerald-600/20 text-neutral-200 hover:text-white text-xs font-bold transition-all text-left group cursor-pointer"
                    >
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                        <ShoppingBag size={14} />
                      </div>
                      <span>Compras</span>
                    </button>

                    <button
                      onClick={() => { setActiveUserModal('envios'); setIsUserMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-amber-600/20 text-neutral-200 hover:text-white text-xs font-bold transition-all text-left group cursor-pointer"
                    >
                      <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                        <Truck size={14} />
                      </div>
                      <span>Envíos</span>
                    </button>

                    <button
                      onClick={() => { setActiveUserModal('settings'); setIsUserMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-purple-600/20 text-neutral-200 hover:text-white text-xs font-bold transition-all text-left group cursor-pointer"
                    >
                      <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                        <Settings size={14} />
                      </div>
                      <span>Settings</span>
                    </button>
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
              className="w-full bg-[#09080E]/98 border-t border-white/10 shadow-2xl overflow-hidden backdrop-blur-2xl"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                      <Hexagon size={18} />
                    </div>
                    <div>
                      <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                        ECOSISTEMA INTEGRAL ATOMIC
                      </span>
                      <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-white font-heading">
                        MAPA CONCEPTUAL DE NAVEGACIÓN
                      </h2>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMegaMenuOpen(false)}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white transition-all cursor-pointer"
                    title="Cerrar Desplegable"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Central Root Node (Mapa Conceptual) */}
                <div className="flex flex-col items-center justify-center mb-8">
                  <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-blue-900/40 border border-blue-500/40 shadow-[0_0_25px_rgba(59,130,246,0.25)]">
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                    <span className="text-xs sm:text-sm font-black font-heading tracking-widest text-white uppercase">
                      ATOMIC PLATFORM // CORE HUB
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <div className="w-0.5 h-5 bg-gradient-to-b from-blue-500/60 to-blue-500/20 my-1" />
                </div>

                {/* Conceptual Map Grid with Interconnected Tree Lines */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 relative">
                  
                  {/* ─── RAMA 1: SECTORES ─── */}
                  <div className="relative bg-[#121017] border border-white/[0.08] hover:border-blue-500/40 rounded-2xl p-5 transition-all group">
                    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/10">
                      <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                        <Building size={16} />
                      </div>
                      <div>
                        <h3 className="text-sm font-black uppercase tracking-wider text-white font-heading">
                          SECTORES
                        </h3>
                        <p className="text-[10px] text-[#94969D] font-mono">Divisiones de Especialización</p>
                      </div>
                    </div>

                    <div className="relative pl-5 space-y-2.5 before:absolute before:top-2 before:bottom-2 before:left-2 before:w-0.5 before:bg-blue-500/30">
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
                          className="relative cursor-pointer hover:bg-white/[0.06] p-2 rounded-xl transition-all after:absolute after:top-1/2 after:-left-3 after:w-3 after:h-0.5 after:bg-blue-500/40"
                        >
                          <div className="text-xs font-bold text-neutral-200 group-hover:text-white flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                            <span>{item.name}</span>
                          </div>
                          <div className="text-[10px] text-[#94969D] pl-3.5">{item.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ─── RAMA 2: CATEGORÍAS ─── */}
                  <div className="relative bg-[#121017] border border-white/[0.08] hover:border-amber-500/40 rounded-2xl p-5 transition-all group">
                    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/10">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                        <Package size={16} />
                      </div>
                      <div>
                        <h3 className="text-sm font-black uppercase tracking-wider text-white font-heading">
                          CATEGORÍAS
                        </h3>
                        <p className="text-[10px] text-[#94969D] font-mono">Líneas de Producto Activas</p>
                      </div>
                    </div>

                    <div className="relative pl-5 space-y-2.5 before:absolute before:top-2 before:bottom-2 before:left-2 before:w-0.5 before:bg-amber-500/30">
                      {[
                        { name: "Apple Store (Mac, iPhone, iPad, Watch)", href: "/web/apple", badge: "APPLE" },
                        { name: "Barreras Vehiculares Automáticas", href: "/web/barreras-vehiculares", badge: "2026" },
                        { name: "Cámaras Hogar 4K (2 Años Garantía)", href: "/web/camaras-hogar", badge: "2 AÑOS" },
                        { name: "Cerraduras Smart + Instalación", href: "/web/cerraduras-smart", badge: "KITS" },
                        { name: "Mandos & Consolas Gaming", href: "/web/mandos", badge: "NUEVO" },
                        { name: "Encimeras & Hornos", href: "/web/cocinas", badge: "HOGAR" },
                        { name: "Laptops & CPUs Intel/AMD", href: "/web/cpus", badge: "PRO" },
                        { name: "Celulares, Tablets & Redes", href: "/web/phones", badge: "MÓVIL" },
                        { name: "Plantas de Bloques de Hormigón", href: "/web/blogs/guia-maquinas-de-bloques", badge: "INDUSTRIAL" },
                      ].map((item, idx) => (
                        <Link
                          key={idx}
                          href={item.href}
                          onClick={() => setIsMegaMenuOpen(false)}
                          className="relative block hover:bg-white/[0.06] p-2 rounded-xl transition-all after:absolute after:top-1/2 after:-left-3 after:w-3 after:h-0.5 after:bg-amber-500/40"
                        >
                          <div className="flex items-center justify-between text-xs font-bold text-neutral-200">
                            <span className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                              {item.name}
                            </span>
                            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                              {item.badge}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* ─── RAMA 3: BLOG & NEWSLETTER ─── */}
                  <div className="relative bg-[#121017] border border-white/[0.08] hover:border-purple-500/40 rounded-2xl p-5 transition-all group">
                    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/10">
                      <div className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                        <Sparkles size={16} />
                      </div>
                      <div>
                        <h3 className="text-sm font-black uppercase tracking-wider text-white font-heading">
                          BLOG & NEWSLETTER
                        </h3>
                        <p className="text-[10px] text-[#94969D] font-mono">Contenido, New Sellers & Landings</p>
                      </div>
                    </div>

                    <div className="relative pl-5 space-y-2.5 before:absolute before:top-2 before:bottom-2 before:left-2 before:w-0.5 before:bg-purple-500/30">
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
                          className="relative cursor-pointer hover:bg-white/[0.06] p-2 rounded-xl transition-all after:absolute after:top-1/2 after:-left-3 after:w-3 after:h-0.5 after:bg-purple-500/40"
                        >
                          <div className="text-xs font-bold text-neutral-200 group-hover:text-white flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
                            <span>{item.name}</span>
                          </div>
                          <div className="text-[10px] text-[#94969D] pl-3.5">{item.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ─── RAMA 4: OFERTAS & BENEFICIOS ─── */}
                  <div className="relative bg-[#121017] border border-white/[0.08] hover:border-emerald-500/40 rounded-2xl p-5 transition-all group">
                    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/10">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                        <Zap size={16} />
                      </div>
                      <div>
                        <h3 className="text-sm font-black uppercase tracking-wider text-white font-heading">
                          OFERTAS
                        </h3>
                        <p className="text-[10px] text-[#94969D] font-mono">Promociones y Despacho</p>
                      </div>
                    </div>

                    <div className="relative pl-5 space-y-2.5 before:absolute before:top-2 before:bottom-2 before:left-2 before:w-0.5 before:bg-emerald-500/30">
                      <div
                        onClick={() => {
                          setIsMegaMenuOpen(false)
                          setActiveTab('ofertas')
                        }}
                        className="relative cursor-pointer hover:bg-white/[0.06] p-2 rounded-xl transition-all after:absolute after:top-1/2 after:-left-3 after:w-3 after:h-0.5 after:bg-emerald-500/40"
                      >
                        <div className="text-xs font-bold text-neutral-200 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                          <span>Ofertas Destacadas</span>
                        </div>
                        <div className="text-[10px] text-[#94969D] pl-3.5">Descuentos y combos de temporada</div>
                      </div>

                      <div className="relative hover:bg-white/[0.06] p-2 rounded-xl transition-all after:absolute after:top-1/2 after:-left-3 after:w-3 after:h-0.5 after:bg-emerald-500/40">
                        <div className="text-xs font-bold text-neutral-200 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                          <span>Envíos Sin Recargo Nacional</span>
                        </div>
                        <div className="text-[10px] text-[#94969D] pl-3.5">Entrega segura en todo el Ecuador</div>
                      </div>

                      <div className="relative hover:bg-white/[0.06] p-2 rounded-xl transition-all after:absolute after:top-1/2 after:-left-3 after:w-3 after:h-0.5 after:bg-emerald-500/40">
                        <div className="text-xs font-bold text-neutral-200 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                          <span>Garantía 100% Originales</span>
                        </div>
                        <div className="text-[10px] text-[#94969D] pl-3.5">Equipos con respaldo y certificación</div>
                      </div>
                    </div>
                  </div>

                  {/* ─── RAMA 5: INICIAR SESIÓN & CUENTA ─── */}
                  <div className="relative bg-[#121017] border border-white/[0.08] hover:border-cyan-500/40 rounded-2xl p-5 transition-all group">
                    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/10">
                      <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                        <LogIn size={16} />
                      </div>
                      <div>
                        <h3 className="text-sm font-black uppercase tracking-wider text-white font-heading">
                          INICIAR SESIÓN
                        </h3>
                        <p className="text-[10px] text-[#94969D] font-mono">Acceso a Plataforma ERP</p>
                      </div>
                    </div>

                    <div className="relative pl-5 space-y-2.5 before:absolute before:top-2 before:bottom-2 before:left-2 before:w-0.5 before:bg-cyan-500/30">
                      <Link
                        href="/login"
                        onClick={() => setIsMegaMenuOpen(false)}
                        className="relative block hover:bg-white/[0.06] p-2 rounded-xl transition-all after:absolute after:top-1/2 after:-left-3 after:w-3 after:h-0.5 after:bg-cyan-500/40"
                      >
                        <div className="text-xs font-bold text-white flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                          <span>Acceso al Sistema (Login)</span>
                        </div>
                        <div className="text-[10px] text-[#94969D] pl-3.5">Ingreso con credenciales corporativas</div>
                      </Link>

                      <Link
                        href="/login"
                        onClick={() => setIsMegaMenuOpen(false)}
                        className="relative block hover:bg-white/[0.06] p-2 rounded-xl transition-all after:absolute after:top-1/2 after:-left-3 after:w-3 after:h-0.5 after:bg-cyan-500/40"
                      >
                        <div className="text-xs font-bold text-white flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                          <span>Generador de Cotizaciones</span>
                        </div>
                        <div className="text-[10px] text-[#94969D] pl-3.5">Cotizador inteligente automatizado</div>
                      </Link>
                    </div>
                  </div>

                  {/* ─── RAMA 6: CONTACTO & ASISTENCIA ─── */}
                  <div className="relative bg-[#121017] border border-white/[0.08] hover:border-rose-500/40 rounded-2xl p-5 transition-all group">
                    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/10">
                      <div className="w-8 h-8 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
                        <User size={16} />
                      </div>
                      <div>
                        <h3 className="text-sm font-black uppercase tracking-wider text-white font-heading">
                          CONTACTO
                        </h3>
                        <p className="text-[10px] text-[#94969D] font-mono">Atención Directa y Reseñas</p>
                      </div>
                    </div>

                    <div className="relative pl-5 space-y-2.5 before:absolute before:top-2 before:bottom-2 before:left-2 before:w-0.5 before:bg-rose-500/30">
                      <a
                        href="https://wa.me/593969043453?text=Hola%20ATOMIC!%20Deseo%20informaci%C3%B3n%20sobre%20sus%20productos."
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => setIsMegaMenuOpen(false)}
                        className="relative block hover:bg-white/[0.06] p-2 rounded-xl transition-all after:absolute after:top-1/2 after:-left-3 after:w-3 after:h-0.5 after:bg-rose-500/40"
                      >
                        <div className="text-xs font-bold text-white flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                          <span>WhatsApp Oficial (+593 96 904 3453)</span>
                        </div>
                        <div className="text-[10px] text-[#94969D] pl-3.5">Respuesta inmediata de asesores</div>
                      </a>

                      <div
                        onClick={() => {
                          setIsMegaMenuOpen(false)
                          setActiveTab('contacto')
                        }}
                        className="relative cursor-pointer hover:bg-white/[0.06] p-2 rounded-xl transition-all after:absolute after:top-1/2 after:-left-3 after:w-3 after:h-0.5 after:bg-rose-500/40"
                      >
                        <div className="text-xs font-bold text-neutral-200 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                          <span>Formulario de Contacto & Ubicación</span>
                        </div>
                        <div className="text-[10px] text-[#94969D] pl-3.5">Matriz comercial y canales oficiales</div>
                      </div>

                      <div
                        onClick={() => {
                          setIsMegaMenuOpen(false)
                          setActiveTab('resenas')
                        }}
                        className="relative cursor-pointer hover:bg-white/[0.06] p-2 rounded-xl transition-all after:absolute after:top-1/2 after:-left-3 after:w-3 after:h-0.5 after:bg-rose-500/40"
                      >
                        <div className="text-xs font-bold text-neutral-200 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                          <span>Reseñas de Clientes</span>
                        </div>
                        <div className="text-[10px] text-[#94969D] pl-3.5">Opiniones y calificaciones 5 estrellas</div>
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
              <button onClick={() => setActiveTab(null)} className="p-2.5 rounded-2xl bg-[#131315] border border-white/10 hover:bg-[#1D1D20] text-neutral-400 hover:text-white transition-all">
                <ChevronLeft size={18} />
              </button>
              <h2 className="text-3xl font-black uppercase tracking-tight text-white font-heading">Categorías</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {(metadata?.categories?.filter(c => !c.parentId) || []).map((cat: any) => (
                <button key={cat.id} onClick={() => { setActiveMainCategoryId(cat.id); setActiveTab(null); document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' }); }} className="p-6 rounded-3xl bg-[#0E0E10] border border-white/[0.06] hover:border-white/20 hover:bg-[#131315] text-left transition-all group shadow-xl">
                  <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors font-heading">{cat.name}</p>
                  <p className="text-[10px] font-mono text-[#62646C] mt-2 uppercase tracking-widest">Ver productos →</p>
                </button>
              ))}
            </div>
          </motion.section>
        )}

        {activeTab === 'ofertas' && (
          <motion.section key="ofertas" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex items-center gap-3 mb-8">
              <button onClick={() => setActiveTab(null)} className="p-2.5 rounded-2xl bg-[#131315] border border-white/10 hover:bg-[#1D1D20] text-neutral-400 hover:text-white transition-all">
                <ChevronLeft size={18} />
              </button>
              <h2 className="text-3xl font-black uppercase tracking-tight text-white font-heading">Ofertas Especiales</h2>
            </div>
            <p className="text-[#94969D] text-sm mb-6">Descuentos exclusivos en tecnología, electrónica y hogar. <strong className="text-white">¡Por tiempo limitado!</strong></p>
            <button onClick={() => { setSearchQuery('oferta'); setActiveTab(null); document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' }); }} className="px-8 py-4 rounded-full bg-white text-black font-bold uppercase tracking-wider text-xs transition-all hover:bg-neutral-200 shadow-xl">Ver Todas las Ofertas</button>
          </motion.section>
        )}

        {activeTab === 'blog' && (
          <motion.section key="blog" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex items-center gap-3 mb-8">
              <button onClick={() => setActiveTab(null)} className="p-2.5 rounded-2xl bg-[#131315] border border-white/10 hover:bg-[#1D1D20] text-neutral-400 hover:text-white transition-all">
                <ChevronLeft size={18} />
              </button>
              <h2 className="text-3xl font-black uppercase tracking-tight text-white font-heading">Blog & Guías</h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
              {[
                { title: 'Post #1: Introducción a ATOMIC', href: '/post-1', desc: 'Conoce nuestra historia y misión tecnológica.' },
                { title: 'Post #2: Seguridad para el Hogar', href: '/post-2', desc: 'Cámaras IP, porteros y sistemas biométricos.' },
                { title: 'Post #3: Recursos de Aprendizaje', href: '/recursos', desc: 'Cursos gratuitos de universidades top del mundo.' },
                { title: 'Post #4: 9 Cursos de YouTube Gratuitos', href: '/post-4', desc: 'Ventas, IA, Copywriting, Liderazgo y Neurociencia.' },
              ].map(post => (
                <Link key={post.href} href={post.href} className="p-6 rounded-3xl bg-[#0E0E10] border border-white/[0.06] hover:border-white/20 hover:bg-[#131315] transition-all group block shadow-xl">
                  <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors mb-2 font-heading">{post.title}</h3>
                  <p className="text-xs text-[#94969D]">{post.desc}</p>
                  <span className="mt-4 inline-block text-[10px] font-mono text-white uppercase font-bold">Leer →</span>
                </Link>
              ))}
            </div>
          </motion.section>
        )}

        {activeTab === 'newsletter' && (
          <motion.section key="newsletter" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="max-w-3xl mx-auto px-6 py-12 text-center">
            <div className="flex items-center gap-3 mb-8 justify-center">
              <button onClick={() => setActiveTab(null)} className="p-2.5 rounded-2xl bg-[#131315] border border-white/10 hover:bg-[#1D1D20] text-neutral-400 hover:text-white transition-all">
                <ChevronLeft size={18} />
              </button>
              <h2 className="text-3xl font-black uppercase tracking-tight text-white font-heading">Newsletter ✉️</h2>
            </div>
            <p className="text-[#94969D] mb-6 text-sm">Suscríbete y recibe <strong className="text-white">ofertas exclusivas, novedades tecnológicas y guías de IA</strong> directamente en tu correo.</p>
            <Link href="/recursos" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black font-bold uppercase tracking-wider text-xs transition-all hover:bg-neutral-200 shadow-xl">
              Suscribirme Ahora <ArrowRight size={16} />
            </Link>
          </motion.section>
        )}

        {activeTab === 'landings' && (
          <motion.section key="landings" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex items-center gap-3 mb-8">
              <button onClick={() => setActiveTab(null)} className="p-2.5 rounded-2xl bg-[#131315] border border-white/10 hover:bg-[#1D1D20] text-neutral-400 hover:text-white transition-all">
                <ChevronLeft size={18} />
              </button>
              <h2 className="text-3xl font-black uppercase tracking-tight text-white font-heading">Landings de Productos 🚀</h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-4">
              {[
                { name: 'IMOU Aurora Pro', href: '/aurora-pro', desc: 'Cámara Exterior Full-Color con Audio Bidireccional', icon: '📹' },
                { name: 'ZKTeco SenseFace 2A', href: '/senseface-2a', desc: 'Biométrico Facial 3D, Huella & RFID', icon: '🔐' },
                { name: 'EZVIZ H6c PT 2K', href: '/h6c', desc: 'Cámara IP Panorámica 360° Wi-Fi', icon: '📹' },
                { name: 'Recursos Top', href: '/recursos', desc: 'MIT, Harvard, Stanford y más — 100% Gratis', icon: '🎓' },
              ].map(l => (
                <Link key={l.href} href={l.href} className="p-6 rounded-3xl bg-[#0E0E10] border border-white/[0.06] hover:border-white/20 hover:bg-[#131315] transition-all group block shadow-xl">
                  <div className="text-3xl mb-3">{l.icon}</div>
                  <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors mb-1 font-heading">{l.name}</h3>
                  <p className="text-xs text-[#94969D]">{l.desc}</p>
                  <span className="mt-4 inline-block text-[10px] font-mono text-white uppercase font-bold">Ver Landing →</span>
                </Link>
              ))}
            </div>
          </motion.section>
        )}

        {activeTab === 'especializacion' && (
          <motion.section key="especializacion" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex items-center gap-3 mb-8">
              <button onClick={() => setActiveTab(null)} className="p-2.5 rounded-2xl bg-[#131315] border border-white/10 hover:bg-[#1D1D20] text-neutral-400 hover:text-white transition-all">
                <ChevronLeft size={18} />
              </button>
              <h2 className="text-3xl font-black uppercase tracking-tight text-white font-heading">Áreas de Especialización 🎓</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {[
                { area: '🔐 Seguridad & Control de Acceso', desc: 'Biométricos, porteros eléctricos, CCTV y vigilancia IP.' },
                { area: '📺 Electrónica de Consumo', desc: 'Smart TVs, audio, gaming, periféricos y accesorios.' },
                { area: '🏠 Hogar Inteligente', desc: 'Encimeras, hornos, electrodomésticos y automatización.' },
                { area: '💻 Computación & Laptops', desc: 'Portátiles, PCs, componentes y soluciones de red.' },
                { area: '⚡ Energía & Carga EV', desc: 'Cargadores de vehículos eléctricos y soluciones solares.' },
                { area: '🤖 Tecnología IA & Robótica', desc: 'Automatización inteligente, bots y soluciones de última generación.' },
              ].map(a => (
                <div key={a.area} className="p-6 rounded-3xl bg-[#0E0E10] border border-white/[0.06] hover:border-white/20 transition-all shadow-xl">
                  <h3 className="text-sm font-bold text-white mb-2 font-heading">{a.area}</h3>
                  <p className="text-xs text-[#94969D]">{a.desc}</p>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {activeTab === 'nosotros' && (
          <motion.section key="nosotros" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="max-w-4xl mx-auto px-6 py-12">
            <div className="flex items-center gap-3 mb-8">
              <button onClick={() => setActiveTab(null)} className="p-2.5 rounded-2xl bg-[#131315] border border-white/10 hover:bg-[#1D1D20] text-neutral-400 hover:text-white transition-all">
                <ChevronLeft size={18} />
              </button>
              <h2 className="text-3xl font-black uppercase tracking-tight text-white font-heading">Sobre Nosotros</h2>
            </div>
            <div className="space-y-6">
              <p className="text-[#AEB0B6] text-sm leading-relaxed"><strong className="text-white">ATOMIC INDUSTRIAS</strong> es una empresa ecuatoriana especializada en electrónica, tecnología y productos para el hogar. Ofrecemos los mejores precios con garantía 100% original, envíos seguros a todo Ecuador y asesoría técnica instantánea vía WhatsApp.</p>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { stat: '100%', label: 'Productos Originales' },
                  { stat: '24/7', label: 'Soporte Técnico' },
                  { stat: 'EC', label: 'Cobertura Nacional' },
                ].map(s => (
                  <div key={s.stat} className="p-6 rounded-3xl bg-[#0E0E10] border border-white/[0.06] text-center shadow-xl">
                    <p className="text-4xl font-black text-white font-heading">{s.stat}</p>
                    <p className="text-[11px] font-mono text-[#62646C] uppercase tracking-widest mt-2">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {activeTab === 'contacto' && (
          <motion.section key="contacto" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="max-w-4xl mx-auto px-6 py-12">
            <div className="flex items-center gap-3 mb-8">
              <button onClick={() => setActiveTab(null)} className="p-2.5 rounded-2xl bg-[#131315] border border-white/10 hover:bg-[#1D1D20] text-neutral-400 hover:text-white transition-all">
                <ChevronLeft size={18} />
              </button>
              <h2 className="text-3xl font-black uppercase tracking-tight text-white font-heading">Contáctanos</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <a href="https://wa.me/593969043453?text=Hola%20ATOMIC!" target="_blank" rel="noreferrer" className="flex items-center gap-4 p-6 rounded-3xl bg-[#0E0E10] border border-white/[0.06] hover:border-emerald-500/40 hover:bg-[#131315] transition-all group shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold text-base">WA</div>
                <div>
                  <p className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors font-heading">WhatsApp</p>
                  <p className="text-xs text-[#94969D]">Asesoría instantánea disponible ahora</p>
                </div>
              </a>
              <div className="flex items-center gap-4 p-6 rounded-3xl bg-[#0E0E10] border border-white/[0.06] shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white font-bold text-base">EC</div>
                <div>
                  <p className="text-sm font-bold text-white font-heading">Ecuador</p>
                  <p className="text-xs text-[#94969D]">Envíos directos a las 24 provincias</p>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {activeTab === 'resenas' && (
          <motion.section key="resenas" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex items-center gap-3 mb-8">
              <button onClick={() => setActiveTab(null)} className="p-2.5 rounded-2xl bg-[#131315] border border-white/10 hover:bg-[#1D1D20] text-neutral-400 hover:text-white transition-all">
                <ChevronLeft size={18} />
              </button>
              <h2 className="text-3xl font-black uppercase tracking-tight text-white font-heading">Reseñas de Clientes</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {[
                { name: 'Carlos M.', rating: 5, text: 'Excelente servicio, el producto llegó rápido y en perfectas condiciones. 100% recomendado.' },
                { name: 'Andrea L.', rating: 5, text: 'La asesoría por WhatsApp fue increíble, me ayudaron a elegir el mejor biométrico para mi empresa.' },
                { name: 'Roberto V.', rating: 5, text: 'Compré una cámara EZVIZ H6c y funciona perfectamente. La calidad 2K es impresionante.' },
                { name: 'María F.', rating: 5, text: 'Productos originales con garantía, los precios son los mejores de todo Ecuador.' },
                { name: 'Jorge P.', rating: 5, text: 'El SenseFace 2A funciona perfecto en nuestras instalaciones. Muy buen equipo ATOMIC.' },
                { name: 'Lucía G.', rating: 5, text: 'Atención al cliente excepcional. Resolvieron todas mis dudas antes de la compra.' },
              ].map(r => (
                <div key={r.name} className="p-6 rounded-3xl bg-[#0E0E10] border border-white/[0.06] hover:border-white/20 transition-all shadow-xl">
                  <div className="flex items-center gap-1 mb-3">{Array.from({length: r.rating}).map((_,i) => <Star key={i} size={14} className="text-amber-400 fill-amber-400" />)}</div>
                  <p className="text-sm text-[#C9CACE] italic mb-3">"{r.text}"</p>
                  <p className="text-xs font-bold text-white font-heading">{r.name}</p>
                  <p className="text-[10px] font-mono text-[#62646C]">Cliente ATOMIC ✓</p>
                </div>
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ═══════════ HERO SECTION (APPIT MODERN AESTHETIC) ═══════════ */}
      <section className="pt-16 pb-16 flex flex-col items-center justify-center text-center px-6 relative overflow-hidden bg-[#09090A]">
        {/* Soft Appit Ambient Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-blue-600/10 via-indigo-600/5 to-transparent rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto">
          
          {/* Appit Style Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center justify-center gap-2.5 px-4 py-1.5 rounded-full bg-[#131315] border border-white/10 text-xs font-bold text-neutral-300 mb-6 shadow-xl mx-auto"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)] shrink-0" />
            <span className="font-heading uppercase tracking-wider text-[11px]">Tecnología, Electrónica & Hogar Inteligente</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)] shrink-0" />
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="mb-4 flex flex-col items-center">
            <AtomLogo />
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tight leading-none mb-4 font-heading">
            <span className="text-white">
              ATOMIC
            </span>
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-xs sm:text-sm font-bold tracking-[0.25em] uppercase text-[#94969D] mb-8 font-heading">
            ELECTRÓNICA, TECNOLOGÍA Y HOGAR
          </motion.p>

          {/* SEARCH BAR (APPIT PILL INPUT & LIVE FLOATING DROPDOWN) */}
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
                  <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#62646C] group-hover:text-white transition-colors z-10" size={18} />
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
                placeholder="Buscar producto, marca, categoría (ej. PS5, Aurora, Encimera)..."
                className="w-full bg-[#0E0E10] border border-white/10 rounded-full py-4 pl-14 pr-12 text-xs font-bold uppercase tracking-wider text-white placeholder-[#62646C] focus:border-emerald-500/50 focus:bg-[#131315] focus:shadow-[0_0_25px_rgba(16,185,129,0.2)] transition-all outline-none shadow-2xl"
              />
              {searchQuery && (
                <button 
                  onClick={() => {
                    setSearchQuery("");
                    setShowLiveDropdown(false);
                  }} 
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors z-10"
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
                  className="absolute top-full left-0 right-0 mt-2 bg-[#0C101A]/95 backdrop-blur-2xl border border-white/15 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] overflow-hidden z-50 text-left divide-y divide-white/5"
                >
                  {/* Dropdown Header */}
                  <div className="px-5 py-3 bg-white/[0.03] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[11px] font-heading font-black uppercase tracking-wider text-emerald-400">
                        Resultados en vivo ({liveMatches.length})
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-neutral-400">
                      Presiona <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-[9px] border border-white/20">ENTER ↵</kbd> para ver todos
                    </span>
                  </div>

                  {/* Matches List */}
                  <div className="max-h-[360px] overflow-y-auto divide-y divide-white/5 p-2 space-y-1">
                    {liveMatches.length === 0 ? (
                      <div className="py-8 text-center text-xs font-mono text-neutral-400">
                        {isSearching ? 'Buscando en tiempo real...' : 'No se encontraron productos coincidentes.'}
                      </div>
                    ) : (
                      liveMatches.map((item: any) => {
                        const parsedImg = safeParseArray(item.images, [''])[0] || '';
                        return (
                          <a
                            key={item.id}
                            href={`/web/product/${item.id}`}
                            className="flex items-center gap-3.5 p-2.5 rounded-2xl hover:bg-white/10 transition-all group/item cursor-pointer"
                          >
                            <div className="w-12 h-12 rounded-xl bg-black/50 border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                              {parsedImg ? (
                                <SafeImage src={parsedImg} alt={item.name} className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-300" />
                              ) : (
                                <Package size={20} className="text-neutral-500" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-bold text-white group-hover/item:text-emerald-300 transition-colors truncate">
                                {item.name}
                              </h4>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] font-mono uppercase text-neutral-400 truncate">
                                  {item.category?.name || item.provider || 'Atomic'}
                                </span>
                                {item.stock > 0 && (
                                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono font-bold">
                                    Stock: {item.stock}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-xs font-black font-mono text-emerald-400 block">
                                ${Number(item.price || 0).toFixed(2)}
                              </span>
                              <span className="text-[10px] text-neutral-400 group-hover/item:text-white flex items-center gap-1 justify-end font-bold">
                                Ver <ChevronRight size={10} />
                              </span>
                            </div>
                          </a>
                        );
                      })
                    )}
                  </div>

                  {/* Dropdown Footer CTA */}
                  <div className="p-2.5 bg-white/[0.02]">
                    <button
                      onClick={() => {
                        setShowLiveDropdown(false);
                        document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black font-heading font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
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
            <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-[#131315] border border-white/10 text-xs font-bold text-neutral-300 mb-2 shadow-xl mx-auto">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span className="font-heading uppercase tracking-wider text-[11px]">PREVIEW / INTRODUCCIÓN</span>
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            </div>
          </div>

          {/* ═══════════ MINI RECUADROS OPACOS (FILTROS DIFUMINADOS BLANCO/GRIS) ═══════════ */}
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
                  className={`px-4 py-2 rounded-2xl border text-[11px] font-extrabold font-heading uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-md flex items-center gap-2 ${
                    isSelected
                      ? 'bg-white text-black border-white shadow-xl shadow-white/20 scale-105'
                      : 'bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 hover:text-white border-white/[0.12] hover:border-white/30 backdrop-blur-md'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-black' : 'bg-blue-400'}`} />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </div>

          {/* ═══════════ 3D COVERFLOW GALLERY SHOWCASE (CON ANIMACIÓN VERTICAL) ═══════════ */}
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

          {/* ═══════════ OFERTAS SECTION HEADER (REQUESTED PLACEMENT) ═══════════ */}
          <div className="text-center max-w-3xl mx-auto mt-10 mb-8">
            <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-[#131315] border border-white/10 text-xs font-bold text-neutral-300 mb-3 shadow-xl mx-auto">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span className="font-heading uppercase tracking-wider text-[11px]">OFERTAS POR CATEGORÍA</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white font-heading mb-2">
              OFERTAS
            </h2>
          </div>

          {/* QUICK CATEGORY HUB BUTTONS (APPIT PILLS) */}
          <div className="flex flex-wrap items-center justify-center gap-3 max-w-4xl mx-auto mb-16">
            <Link
              href="/web/camaras-hogar"
              className="px-5 py-3 rounded-full bg-[#0E0E10] border border-amber-500/30 hover:border-amber-400 hover:bg-[#131315] text-xs font-bold text-neutral-200 transition-all flex items-center gap-2 shadow-lg group"
            >
              <span className="font-heading uppercase tracking-wider text-[11px] text-amber-300">CÁMARAS HOGAR 4K</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/30 font-mono font-bold">2 AÑOS</span>
            </Link>

            <Link
              href="/web/mandos"
              className="px-5 py-3 rounded-full bg-[#0E0E10] border border-white/[0.08] hover:border-white/20 hover:bg-[#131315] text-xs font-bold text-neutral-200 transition-all flex items-center gap-2 shadow-lg group"
            >
              <span className="font-heading uppercase tracking-wider text-[11px]">MANDOS & CONSOLAS</span>
              <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/30 font-mono font-bold">NUEVO</span>
            </Link>

            <Link
              href="/web/cocinas"
              className="px-5 py-3 rounded-full bg-[#0E0E10] border border-white/[0.08] hover:border-white/20 hover:bg-[#131315] text-xs font-bold text-neutral-200 transition-all flex items-center gap-2 shadow-lg group"
            >
              <span className="font-heading uppercase tracking-wider text-[11px]">ENCIMERAS & HORNOS</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/30 font-mono font-bold">LÍNEA HOGAR</span>
            </Link>

            <Link
              href="/web/cpus"
              className="px-5 py-3 rounded-full bg-[#0E0E10] border border-white/[0.08] hover:border-white/20 hover:bg-[#131315] text-xs font-bold text-neutral-200 transition-all flex items-center gap-2 shadow-lg group"
            >
              <span className="font-heading uppercase tracking-wider text-[11px]">LAPTOPS & CPUS</span>
              <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full border border-purple-500/30 font-mono font-bold">PROCESADORES</span>
            </Link>

            <Link
              href="/web/phones"
              className="px-5 py-3 rounded-full bg-[#0E0E10] border border-white/[0.08] hover:border-white/20 hover:bg-[#131315] text-xs font-bold text-neutral-200 transition-all flex items-center gap-2 shadow-lg group"
            >
              <span className="font-heading uppercase tracking-wider text-[11px]">CELULARES & TABLETS</span>
            </Link>

            <Link
              href="/web/blogs/guia-maquinas-de-bloques"
              className="px-5 py-3 rounded-full bg-[#0E0E10] border border-white/[0.08] hover:border-white/20 hover:bg-[#131315] text-xs font-bold text-neutral-200 transition-all flex items-center gap-2 shadow-lg group"
            >
              <span className="font-heading uppercase tracking-wider text-[11px]">PLANTAS DE BLOQUES</span>
              <span className="text-[10px] bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full border border-orange-500/30 font-mono font-bold">INDUSTRIAL</span>
            </Link>
          </div>

        </div>
      </section>

      {/* ═══════════ CATEGORÍAS — FRONTENDJOE CARD STYLE ═══════════ */}
      <section className="w-full max-w-7xl mx-auto px-6 pt-16 pb-12" id="categorias-seccion">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#131315] border border-white/10 text-xs font-bold text-neutral-300 mb-4 shadow-xl">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="font-heading uppercase tracking-wider text-[11px]">Catálogo Principal de Especialización</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white font-heading mb-4">
            CATEGORÍAS
          </h2>
          <p className="text-sm text-[#94969D] leading-relaxed">
            Explora nuestras 8 divisiones especializadas en tecnología residencial, electrónica de consumo, equipamiento para el hogar, maquinaria industrial y soluciones digitales.
          </p>
        </div>

        {/* 8 CATEGORY CARDS GRID — EXACT FRONTENDJOE FLOATING OFFSET STYLE */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {[
            {
              id: 'cat-residencial',
              title: 'TECNOLOGÍA RESIDENCIAL',
              subtitle: 'DOMÓTICA & SEGURIDAD SMART',
              description: 'Cámaras IP con audio bidireccional, reconocimiento facial 3D, porteros inteligentes y control de accesos.',
              image: '/images/hero-3d/slide-2.jpg',
              badge: 'SEGURIDAD SMART',
              query: 'camara',
            },
            {
              id: 'cat-electronica',
              title: 'ELECTRÓNICA',
              subtitle: 'AUDIO, GADGETS & PERIFÉRICOS',
              description: 'Equipos de audio de alta fidelidad, iluminación inteligente, periféricos para creadores y componentes electrónicos.',
              image: '/images/hero-3d/slide-6.jpg',
              badge: 'AUDIO & GADGETS',
              query: 'electronica',
            },
            {
              id: 'cat-hogar',
              title: 'HOGAR',
              subtitle: 'COCINA PREMIUM & CONFORT',
              description: 'Encimeras a gas de alta eficiencia, hornos empotrables de acero inoxidable y electrodomésticos modernos para el hogar.',
              image: '/images/hero-3d/slide-4.jpg',
              badge: 'LÍNEA HOGAR',
              query: 'cocina',
            },
            {
              id: 'cat-industria',
              title: 'INDUSTRIA',
              subtitle: 'MAQUINARIA & PLANTAS DE BLOQUES',
              description: 'Plantas automáticas de bloques de hormigón, mezcladoras de concreto reforzado y automatización pesada.',
              image: '/images/hero-3d/slide-5.jpg',
              badge: 'INDUSTRIAL',
              query: 'bloque',
            },
            {
              id: 'cat-entretenimiento',
              title: 'ENTRETENIMIENTO',
              subtitle: 'GAMING, CONSOLAS & MANDOS',
              description: 'Mandos DualSense inalámbricos para PS5, consolas Nintendo Switch, Xbox Series X|S y PlayStation Portal.',
              image: '/images/hero-3d/slide-1.png',
              badge: 'GAMING',
              query: 'mando',
            },
            {
              id: 'cat-computacion',
              title: 'COMPUTACIÓN',
              subtitle: 'LAPTOPS, PCS & PROCESADORES',
              description: 'Portátiles de alto rendimiento, estaciones de trabajo All-in-One Dell, CPUs Intel/AMD y almacenamiento ultrarrápido.',
              image: '/images/hero-3d/slide-3.jpg',
              badge: 'HARDWARE',
              query: 'laptop',
            },
            {
              id: 'cat-telefonia',
              title: 'TELEFONÍA',
              subtitle: 'SMARTPHONES, TABLETS & REDES',
              description: 'Dispositivos móviles de última generación, tablets para productividad, accesorios de carga rápida y conectividad.',
              image: '/images/hero-3d/slide-2.jpg',
              badge: 'MÓVIL',
              query: 'telefono',
            },
            {
              id: 'cat-software',
              title: 'SOFTWARE & SERVICIOS',
              subtitle: 'ERP, CRM & AUTOMATIZACIÓN IA',
              description: 'Sistemas de gestión empresarial integral, cotizadores automáticos, asesoría tecnológica y desarrollo a medida.',
              image: '/images/hero-3d/slide-6.jpg',
              badge: 'CLOUD & IA',
              query: 'software',
            },
          ].map((c) => (
            <div
              key={c.id}
              className="relative flex flex-col sm:flex-row items-center bg-[#121017] border border-white/[0.08] rounded-3xl p-6 sm:p-7 shadow-[0_40px_60px_rgba(0,0,0,0.5)] hover:border-white/20 transition-all duration-300 group"
            >
              {/* Floating offset image */}
              <div className="relative shrink-0 w-full sm:w-48 h-52 sm:h-56 -mt-8 sm:mt-0 sm:-ml-12 rounded-2xl overflow-hidden shadow-[0_30px_40px_rgba(0,0,0,0.6)] border border-white/10 bg-[#09090A]">
                <img
                  src={c.image}
                  alt={c.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[9px] font-mono font-bold text-white uppercase tracking-wider">
                  {c.badge}
                </div>
              </div>

              {/* Card content */}
              <div className="flex flex-col pt-5 sm:pt-0 sm:pl-6 text-center sm:text-left flex-grow">
                <h3 className="text-xl sm:text-2xl font-black text-white font-heading tracking-tight leading-tight group-hover:text-blue-400 transition-colors uppercase">
                  {c.title}
                </h3>
                <p className="text-xs font-bold text-blue-400 mt-1 mb-2 font-heading uppercase tracking-wider">
                  {c.subtitle}
                </p>
                <p className="text-xs text-[#94969D] leading-relaxed mb-6 line-clamp-3">
                  {c.description}
                </p>

                {/* Buttons styled like FrontendJoe */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mt-auto">
                  {c.id === 'cat-residencial' ? (
                    <Link
                      href="/web/cerraduras-smart"
                      className="px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black font-heading transition-all shadow-lg hover:scale-105 flex items-center gap-1.5"
                    >
                      <Wrench size={13} />
                      <span>Kits + Instalación</span>
                    </Link>
                  ) : (
                    <button
                      onClick={() => {
                        setSearchQuery(c.query);
                        document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-5 py-2.5 rounded-full border border-white/20 hover:border-white hover:bg-white/10 text-white text-xs font-bold font-heading transition-all cursor-pointer"
                    >
                      Ver Catálogo
                    </button>
                  )}
                  <a
                    href={`https://wa.me/593969043453?text=${encodeURIComponent(`Hola ATOMIC! Deseo información y cotización sobre la categoría: ${c.title}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 rounded-full bg-white hover:bg-neutral-200 text-[#121017] text-xs font-black font-heading transition-all shadow-lg hover:scale-105"
                  >
                    💬 WhatsApp
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ MAIN FEATURED PROMO BANNERS (APPIT BENTO STYLE) ═══════════ */}
      {!searchQuery && !activeMainCategoryId && (
        <section className="py-12 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Promo Card 1: Mandos Gaming */}
            <div className="relative rounded-3xl overflow-hidden border border-white/[0.06] bg-[#0E0E10] p-8 shadow-2xl flex flex-col justify-between group hover:border-white/20 transition-all">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-white font-mono text-[10px] font-bold uppercase tracking-widest mb-4">
                  🎮 SECCIÓN DESTACADA GAMING
                </div>
                <h3 className="text-3xl font-black uppercase text-white mb-2 leading-tight font-heading">
                  Mandos DualSense & Consolas
                </h3>
                <p className="text-[#94969D] text-xs leading-relaxed max-w-md mb-6">
                  Descubre mandos originales para PS5, PS4, Xbox Series X|S, Nintendo Switch y la nueva PlayStation Portal Remote Player con fotos HD y especificaciones.
                </p>
              </div>
              <Link
                href="/web/mandos"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-black hover:bg-neutral-200 rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-xl w-fit"
              >
                <span>Explorar Mandos & Consolas</span>
                <span>→</span>
              </Link>
            </div>

            {/* Promo Card 2: Cocina & Encimeras */}
            <div className="relative rounded-3xl overflow-hidden border border-white/[0.06] bg-[#0E0E10] p-8 shadow-2xl flex flex-col justify-between group hover:border-white/20 transition-all">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] pointer-events-none" />
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-white font-mono text-[10px] font-bold uppercase tracking-widest mb-4">
                  🍳 LÍNEA PREMIUM DE COCINA
                </div>
                <h3 className="text-3xl font-black uppercase text-white mb-2 leading-tight font-heading">
                  Encimeras a Gas & Hornos
                </h3>
                <p className="text-[#94969D] text-xs leading-relaxed max-w-md mb-6">
                  Filtra por dimensiones en centímetros, número de hornillas y tipo de combustible. Promociones especiales y combos para armar tu cocina.
                </p>
              </div>
              <Link
                href="/web/cocinas"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-black hover:bg-neutral-200 rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-xl w-fit"
              >
                <span>Ver Catálogo de Cocinas</span>
                <span>→</span>
              </Link>
            </div>

          </div>
        </section>
      )}

      {/* ═══════════ PRODUCT GRID & FILTERS (APPIT BENTO CARDS) ═══════════ */}
      <section className="w-full max-w-7xl mx-auto px-6 py-8" id="productos">
        
        {/* SECTION TITLE & FILTER RESULTS COUNTER */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/[0.06]">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-heading">
              Catálogo General de Productos
            </h2>
            <p className="text-[#62646C] text-xs font-mono mt-1">
              {filteredProducts.length} productos disponibles
            </p>
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-xs text-white hover:text-neutral-300 font-bold uppercase tracking-wider flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-full"
            >
              <span>✕ Limpiar Búsqueda</span>
            </button>
          )}
        </div>

        {/* LOADING & GRID RENDER */}
        {isLoadingCategory ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-[#94969D] text-xs font-mono uppercase tracking-widest">Cargando catálogo...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-white/10 rounded-3xl p-8 bg-[#0E0E10]">
            <p className="text-[#94969D] text-xs font-mono uppercase tracking-widest mb-4">No se encontraron productos con esos criterios</p>
            <button
              onClick={() => { setSearchQuery(""); setActiveMainCategoryId(null); setActiveSubcategoryId(null); }}
              className="px-6 py-3 bg-white text-black font-bold text-xs uppercase tracking-wider rounded-full hover:bg-neutral-200 transition-colors"
            >
              Ver Todo el Catálogo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {filteredProducts.slice(0, 80).map((p: any) => {
              const imgs = safeParseArray(p.images);
              const img = imgs[0] || '';
              const price = calculateDiscountedPrice(p.price, userRole);
              const categoryName = p.category?.name || 'General';

              return (
                <div key={p.id} className="group flex flex-col bg-[#0E0E10] border border-white/[0.06] rounded-3xl overflow-hidden hover:border-white/20 hover:shadow-2xl transition-all duration-300">
                  <Link href={`/web/product/${p.id}`} className="relative aspect-square bg-[#09090A] p-4 flex items-center justify-center overflow-hidden">
                    <SafeImage src={img} alt={p.name} fill className="p-3 group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute top-3 right-3 bg-white text-black font-black text-xs px-3 py-1 rounded-full shadow-lg font-heading">
                      ${price.toFixed(2)}
                    </div>
                  </Link>
                  <div className="p-5 flex flex-col gap-2 flex-grow">
                    <span className="text-[10px] font-mono text-[#62646C] uppercase truncate">
                      {categoryName}
                    </span>
                    <Link href={`/web/product/${p.id}`} className="text-xs font-bold text-white leading-snug line-clamp-2 group-hover:text-blue-400 transition-colors font-heading">
                      {p.name}
                    </Link>
                    <a
                      href={`https://wa.me/593969043453?text=${encodeURIComponent(`Hola ATOMIC! Deseo cotizar el producto: ${p.name} ($${price.toFixed(2)})`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-auto w-full py-3 bg-[#181819] hover:bg-emerald-600 text-white font-bold text-[11px] uppercase tracking-wider rounded-2xl transition-all text-center flex items-center justify-center gap-1 border border-white/5 shadow-md"
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
        <div className="rounded-3xl bg-gradient-to-r from-amber-950/40 via-yellow-950/30 to-[#0E0E10] border border-amber-500/30 p-8 sm:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden group">
          <div className="space-y-4 max-w-2xl relative z-10">
            <span className="px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black uppercase tracking-wider border border-amber-500/30">
              ⚡ Energía & Comparativa Versus
            </span>
            <h3 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              ¿Generadores Eléctricos a Batería vs Generadores a Gasolina?
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Analiza los pros y contras de cada tecnología. Silencio, cero humo, recarga solar vs potencia continua. Configura tu kit ideal con paneles solares y accesorios.
            </p>
            <div className="pt-2">
              <Link
                href="/web/generadores"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-sm hover:brightness-110 shadow-lg shadow-amber-500/25 transition-all"
              >
                <span>Ver Comparativa & Combos</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
          <div className="relative z-10 shrink-0 w-full lg:w-72 aspect-video sm:aspect-square rounded-2xl bg-black/40 border border-white/10 overflow-hidden flex items-center justify-center p-4">
            <SafeImage src="/images/generadores/comparativa-generadores.jpg" alt="Generadores Eléctricos vs Gasolina" className="object-contain w-full h-full group-hover:scale-105 transition-transform" />
          </div>
        </div>

        {/* Banner 2: Botonera Antigolpes & Videoportero */}
        <div className="rounded-3xl bg-gradient-to-r from-blue-950/40 via-cyan-950/30 to-[#0E0E10] border border-cyan-500/30 p-8 sm:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden group">
          <div className="space-y-4 max-w-2xl relative z-10">
            <span className="px-3.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-black uppercase tracking-wider border border-cyan-500/30">
              🛡️ Ofertas de Alta Calidad
            </span>
            <h3 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              Kit Videoportero LCD 10" con Botonera Antigolpes Metálica & Antivandálica
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Máxima durabilidad y seguridad perimetral para conjuntos, residencias y empresas. Visión nocturna, apertura remota y audio bidireccional sin fallas.
            </p>
            <div className="pt-2">
              <Link
                href="/web/videoporteros"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-sm hover:brightness-110 shadow-lg shadow-cyan-500/25 transition-all"
              >
                <span>Ver Videoporteros & Precios</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
          <div className="relative z-10 shrink-0 w-full lg:w-72 aspect-video sm:aspect-square rounded-2xl bg-black/40 border border-white/10 overflow-hidden flex items-center justify-center p-4">
            <SafeImage src="/images/videoporteros/videoportero-diel-10.jpg" alt="Kit Videoportero DIEL 10" className="object-contain w-full h-full group-hover:scale-105 transition-transform" />
          </div>
        </div>

        {/* Banner 3: Nuestra Especialidad es la Tecnología */}
        <div className="rounded-3xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-[#0E0E10] border border-purple-500/30 p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden">
          <span className="px-3.5 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-black uppercase tracking-wider border border-purple-500/30">
            ✨ ATOMIC INDUSTRIES • ECUADOR
          </span>
          <h3 className="text-3xl sm:text-5xl font-black text-white mt-4 max-w-4xl mx-auto leading-tight">
            Nuestra Especialidad es la Tecnología
          </h3>
          <p className="text-slate-300 text-xs sm:text-base max-w-3xl mx-auto mt-3">
            Desde seguridad electrónica inteligente y servidores corporativos hasta movilidad urbana, computación y automatización con IA. Transformamos tu vida y tu negocio.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link href="/web/automatizacion" className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/15 transition-all">
              🤖 Bots & IA ($99/mes)
            </Link>
            <Link href="/web/scooters" className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/15 transition-all">
              🛵 Scooters Eléctricos
            </Link>
            <Link href="/web/bicicletas-electricas" className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/15 transition-all">
              🚲 Bicicletas Eléctricas (40% OFF)
            </Link>
            <Link href="/web/servidores" className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/15 transition-all">
              🖥️ Servidores Rack TI
            </Link>
          </div>
        </div>

        {/* Banner 4: Ver más sobre nosotros */}
        <div className="rounded-3xl bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-[#0E0E10] border border-emerald-500/30 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2 text-center md:text-left">
            <h4 className="text-2xl font-black text-white">¿Quieres conocer más sobre el Ecosistema Atomic?</h4>
            <p className="text-xs text-slate-300 max-w-xl">
              Somos importadores directos, integradores de tecnología e ingenieros en software desde Quito. Oficinas presenciales en El Labrador y despachos a todo el país.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/web/tienda-en-linea"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs hover:brightness-110 shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2"
            >
              <span>Ver Más Sobre Nosotros</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/web/contrataciones"
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/15 transition-all"
            >
              Trabaja con Nosotros
            </Link>
          </div>
        </div>

      </section>

      {/* ═══════════ BOTTOM BRANDING & CONFIDENCE (APPIT BENTO CARDS) ═══════════ */}
      <section className="w-full max-w-7xl mx-auto px-6 pt-12 pb-20 border-t border-white/[0.06] mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-8 rounded-3xl bg-[#0E0E10] border border-white/[0.06] space-y-3 shadow-xl">
            <Truck className="mx-auto text-white" size={32} />
            <h4 className="font-bold text-sm text-white uppercase font-heading">Envíos a Todo el País</h4>
            <p className="text-xs text-[#94969D] leading-relaxed">Despachos seguros y coordinados con cobertura nacional en las 24 provincias del Ecuador.</p>
          </div>
          <div className="p-8 rounded-3xl bg-[#0E0E10] border border-white/[0.06] space-y-3 shadow-xl">
            <Shield className="mx-auto text-white" size={32} />
            <h4 className="font-bold text-sm text-white uppercase font-heading">Garantía Directa</h4>
            <p className="text-xs text-[#94969D] leading-relaxed">Equipos probados con garantía directa de fábrica y soporte técnico especializado.</p>
          </div>
          <div className="p-8 rounded-3xl bg-[#0E0E10] border border-white/[0.06] space-y-3 shadow-xl">
            <Award className="mx-auto text-white" size={32} />
            <h4 className="font-bold text-sm text-white uppercase font-heading">Atención Especializada</h4>
            <p className="text-xs text-[#94969D] leading-relaxed">Asesoría técnica instantánea vía WhatsApp antes, durante y después de tu compra.</p>
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
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setActiveUserModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0b0f19] border border-blue-500/30 rounded-3xl p-6 max-w-md w-full shadow-2xl text-white relative overflow-hidden"
            >
              <button
                onClick={() => setActiveUserModal(null)}
                className="absolute top-4 right-4 text-neutral-400 hover:text-white p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>

              {activeUserModal === 'perfil' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-xl">
                      👤
                    </div>
                    <div>
                      <h3 className="text-lg font-black uppercase text-white">Mi Perfil ATOMIC</h3>
                      <p className="text-xs text-blue-400 font-mono">Usuario Registrado</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-xs text-neutral-300 font-mono">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex justify-between">
                      <span className="text-neutral-400">Cliente:</span>
                      <span className="font-bold text-white">Usuario Preferencial</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex justify-between">
                      <span className="text-neutral-400">Estado:</span>
                      <span className="font-bold text-emerald-400">Activo & Verificado</span>
                    </div>
                  </div>
                </div>
              )}

              {activeUserModal === 'compras' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xl">
                      🛍️
                    </div>
                    <div>
                      <h3 className="text-lg font-black uppercase text-white">Mis Compras</h3>
                      <p className="text-xs text-emerald-400 font-mono">Historial de Pedidos</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center text-xs text-neutral-400">
                    <p className="font-bold text-white mb-1">Sin pedidos pendientes</p>
                    <p>Tus cotizaciones y compras aparecerán aquí automáticamente.</p>
                  </div>
                </div>
              )}

              {activeUserModal === 'envios' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-xl">
                      🚚
                    </div>
                    <div>
                      <h3 className="text-lg font-black uppercase text-white">Seguimiento de Envíos</h3>
                      <p className="text-xs text-amber-400 font-mono">Cobertura Todo Ecuador</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-xs space-y-2">
                    <div className="flex items-center justify-between text-emerald-400 font-bold">
                      <span>Servientrega / Tramaco / Envíos Directos</span>
                      <span>100% Garantizado</span>
                    </div>
                    <p className="text-neutral-400">Tus guías de despacho se sincronizan automáticamente con tu número de WhatsApp.</p>
                  </div>
                </div>
              )}

              {activeUserModal === 'settings' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold text-xl">
                      ⚙️
                    </div>
                    <div>
                      <h3 className="text-lg font-black uppercase text-white">Configuración</h3>
                      <p className="text-xs text-purple-400 font-mono">Preferencias de Usuario</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                      <span>Moneda Predeterminada</span>
                      <span className="font-bold text-blue-400">USD ($)</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                      <span>Notificaciones WhatsApp</span>
                      <span className="font-bold text-emerald-400">Activadas</span>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={() => setActiveUserModal(null)}
                className="w-full mt-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                Cerrar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
